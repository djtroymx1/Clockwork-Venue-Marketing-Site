#!/usr/bin/env node
/**
 * Utility script to interact with the chrome-devtools MCP server and collect
 * diagnostics for a single URL.
 */
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

const TARGET_URL = process.argv[2] ?? "https://clockworkvenue.com";
const MAX_CONSOLE_MESSAGES = 10;

const CLEAR_SITE_DATA_FUNCTION = String.raw`async () => {
  const summary = {
    origin: self.location?.origin ?? null,
    localStorageCleared: false,
    sessionStorageCleared: false,
    cachesCleared: [],
    indexedDBCleared: [],
    cookiesCleared: [],
    notes: [],
  };

  try {
    if (typeof localStorage !== "undefined") {
      localStorage.clear();
      summary.localStorageCleared = true;
    }
  } catch (error) {
    summary.notes.push("localStorage: " + (error?.message ?? String(error)));
  }

  try {
    if (typeof sessionStorage !== "undefined") {
      sessionStorage.clear();
      summary.sessionStorageCleared = true;
    }
  } catch (error) {
    summary.notes.push("sessionStorage: " + (error?.message ?? String(error)));
  }

  try {
    if ("caches" in self && typeof caches.keys === "function") {
      const keys = await caches.keys();
      await Promise.all(
        keys.map(async (key) => {
          await caches.delete(key);
          summary.cachesCleared.push(key);
        }),
      );
    }
  } catch (error) {
    summary.notes.push("caches: " + (error?.message ?? String(error)));
  }

  try {
    if (typeof indexedDB !== "undefined" && typeof indexedDB.databases === "function") {
      const databases = (await indexedDB.databases()) ?? [];
      await Promise.all(
        databases.map(
          (db) =>
            new Promise((resolve) => {
              const request = indexedDB.deleteDatabase(db.name);
              request.onsuccess = request.onerror = request.onblocked = () => {
                summary.indexedDBCleared.push(db.name);
                resolve();
              };
            }),
        ),
      );
    }
  } catch (error) {
    summary.notes.push("indexedDB: " + (error?.message ?? String(error)));
  }

  try {
    if (typeof document !== "undefined" && typeof document.cookie === "string") {
      const cookies = document.cookie
        .split(";")
        .map((cookie) => cookie.trim())
        .filter(Boolean);
      for (const cookie of cookies) {
        const name = cookie.split("=")[0];
        summary.cookiesCleared.push(name);
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
      }
    }
  } catch (error) {
    summary.notes.push("cookies: " + (error?.message ?? String(error)));
  }

  return summary;
}`;

function getTextContent(result) {
  if (!result?.content) {
    return "";
  }
  return result.content
    .filter((item) => item.type === "text" && typeof item.text === "string")
    .map((item) => item.text)
    .join("\n");
}

function extractSelectedPageUrl(text) {
  const match = text.match(/^\s*\d+:\s*(.*?)\s*\[selected]/m);
  return match ? match[1].trim() : null;
}

function parseNetworkSummary(text) {
  const lines = text.split(/\r?\n/);
  const summary = [];
  let inSection = false;
  for (const line of lines) {
    if (line.startsWith("## Network requests")) {
      inSection = true;
      continue;
    }
    if (inSection) {
      if (line.startsWith("## ") && !line.startsWith("## Network requests")) {
        break;
      }
      const trimmed = line.trim();
      if (
        !trimmed ||
        trimmed.startsWith("Showing ") ||
        trimmed.startsWith("Next page") ||
        trimmed.startsWith("Previous page")
      ) {
        continue;
      }
      summary.push(trimmed);
    }
  }
  return summary;
}

function buildRequestEntry({ url, method, statusSummary }) {
  const entry = {
    url: url ?? null,
    method: method ?? null,
    statusSummary: statusSummary ?? null,
    statusCode: null,
    ok: null,
  };

  if (typeof entry.statusSummary === "string" && entry.statusSummary.length > 0) {
    entry.ok = /\bsuccess\b/i.test(entry.statusSummary);
    const codeMatch = entry.statusSummary.match(/- (\d{3})\]/);
    if (codeMatch) {
      entry.statusCode = Number.parseInt(codeMatch[1], 10);
    }
  }

  return entry;
}

function parseRequestDescriptor(line) {
  const match = line.match(/^(.*?)\s+([A-Z]+)\s+(\[.*\])$/);
  if (!match) {
    return { raw: line.trim() };
  }
  return buildRequestEntry({
    url: match[1].trim(),
    method: match[2].trim(),
    statusSummary: match[3].trim(),
  });
}

function parseRequestDetails(text) {
  const lines = text.split(/\r?\n/);
  let requestUrl = null;
  let statusLine = null;
  const redirectChain = [];
  let inRedirectSection = false;

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (line.startsWith("## Request ")) {
      requestUrl = line.replace(/^## Request\s+/, "").trim();
    } else if (line.startsWith("Status:")) {
      statusLine = line;
    } else if (line.startsWith("### Redirect chain")) {
      inRedirectSection = true;
      continue;
    } else if (inRedirectSection) {
      if (line.startsWith("###") || line.startsWith("##")) {
        inRedirectSection = false;
        continue;
      }
      if (line.length === 0) {
        continue;
      }
      redirectChain.push(line);
    }
  }

  const statusSummary = statusLine ? statusLine.replace(/^Status:\s*/, "") : null;
  let statusCode = null;
  if (statusSummary) {
    const match = statusSummary.match(/- (\d{3})\]/);
    if (match) {
      statusCode = Number.parseInt(match[1], 10);
    }
  }

  return { requestUrl, statusSummary, statusCode, redirectChain };
}

function parseConsoleMessages(text, limit) {
  const lines = text.split(/\r?\n/);
  const messages = [];
  let inSection = false;
  for (const rawLine of lines) {
    if (rawLine.startsWith("## Console messages")) {
      inSection = true;
      continue;
    }
    if (inSection) {
      if (rawLine.startsWith("## ") && !rawLine.startsWith("## Console messages")) {
        break;
      }
      const trimmed = rawLine.trim();
      if (!trimmed) {
        continue;
      }
      messages.push(rawLine.trimEnd());
      if (trimmed.startsWith("<no console messages")) {
        break;
      }
      if (messages.length >= limit) {
        break;
      }
    }
  }
  return messages;
}

function parseJsonBlock(text) {
  const match = text.match(/```json\s*([\s\S]*?)\s*```/);
  if (!match) {
    return null;
  }
  try {
    return JSON.parse(match[1]);
  } catch {
    return null;
  }
}

async function getRequestDetailsForCandidates(client, candidates) {
  const tried = new Set();
  for (const candidate of candidates) {
    if (!candidate || tried.has(candidate)) {
      continue;
    }
    tried.add(candidate);
    try {
      const result = await client.callTool({
        name: "get_network_request",
        arguments: { url: candidate },
      });
      return { candidate, result };
    } catch (error) {
      if (
        error instanceof Error &&
        /Request not found/.test(error.message)
      ) {
        continue;
      }
      throw error;
    }
  }
  throw new Error("Unable to retrieve network request details for the provided candidates.");
}

async function main() {
  const transport = new StdioClientTransport({
    command: "npx",
    args: ["chrome-devtools-mcp@latest", "--isolated=true"],
    stderr: "pipe",
  });

  if (transport.stderr) {
    transport.stderr.on("data", (chunk) => {
      process.stderr.write(chunk);
    });
  }

  const client = new Client({
    name: "codex-cli-script",
    version: "0.1.0",
  });

  try {
    await client.connect(transport);

    await client.callTool({
      name: "new_page",
      arguments: { url: TARGET_URL, timeout: 20_000 },
    });

    const pagesResult = await client.callTool({
      name: "list_pages",
      arguments: {},
    });
    const pagesText = getTextContent(pagesResult);
    const selectedPageUrl = extractSelectedPageUrl(pagesText);
    if (!selectedPageUrl) {
      throw new Error("Unable to determine the selected page URL after navigation.");
    }

    const networkSummaryResult = await client.callTool({
      name: "list_network_requests",
      arguments: { resourceTypes: ["document"] },
    });
    const networkSummaryText = getTextContent(networkSummaryResult);
    const documentRequestsRaw = parseNetworkSummary(networkSummaryText);
    const documentRequests = documentRequestsRaw.map(parseRequestDescriptor);

    const candidateUrls = [
      selectedPageUrl,
      ...documentRequestsRaw.map((entry) => entry.split(" ")[0]),
    ];
    const { result: requestDetailsResult, candidate: matchedRequestUrl } =
      await getRequestDetailsForCandidates(client, candidateUrls);
    const requestDetailsText = getTextContent(requestDetailsResult);
    const requestDetails = parseRequestDetails(requestDetailsText);
    const redirectChainEntries = requestDetails.redirectChain.map(parseRequestDescriptor);

    const finalUrl = matchedRequestUrl ?? requestDetails.requestUrl ?? selectedPageUrl;
    const finalMethod =
      documentRequests.find((entry) => entry.url === finalUrl)?.method ??
      documentRequests.at(-1)?.method ??
      "GET";
    redirectChainEntries.push(
      buildRequestEntry({
        url: finalUrl,
        method: finalMethod,
        statusSummary: requestDetails.statusSummary ?? null,
      }),
    );

    const consoleResult = await client.callTool({
      name: "list_console_messages",
      arguments: {},
    });
    const consoleText = getTextContent(consoleResult);
    const consoleMessages = parseConsoleMessages(consoleText, MAX_CONSOLE_MESSAGES);

    const clearResult = await client.callTool({
      name: "evaluate_script",
      arguments: { function: CLEAR_SITE_DATA_FUNCTION },
    });
    const clearResultText = getTextContent(clearResult);
    const clearSiteData = parseJsonBlock(clearResultText);

    const output = {
      targetUrl: TARGET_URL,
      selectedPageUrl,
      matchedRequestUrl: matchedRequestUrl ?? requestDetails.requestUrl ?? null,
      finalStatusSummary: requestDetails.statusSummary ?? null,
      finalStatusCode: requestDetails.statusCode ?? null,
      redirectChain: redirectChainEntries,
      documentRequests,
      consoleMessages,
      clearSiteData,
    };

    console.log(JSON.stringify(output, null, 2));
  } finally {
    await client.close().catch(() => {});
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.stack ?? error.message : String(error));
  process.exitCode = 1;
});
