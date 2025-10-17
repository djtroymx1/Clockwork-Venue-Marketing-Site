#!/usr/bin/env node
import fs from "node:fs/promises";
import path from "node:path";
import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);
const helperPath = path.resolve("scripts/run-chrome-devtools.mjs");
const artifactDir = path.resolve("docs/_mcp-artifacts");
await fs.mkdir(artifactDir, { recursive: true });

function formatStamp(date = new Date()) {
  const pad = (num, len = 2) => String(num).padStart(len, "0");
  return (
    date.getUTCFullYear().toString() +
    pad(date.getUTCMonth() + 1) +
    pad(date.getUTCDate()) +
    "-" +
    pad(date.getUTCHours()) +
    pad(date.getUTCMinutes()) +
    pad(date.getUTCSeconds())
  );
}

const stamp = formatStamp();

const probes = [
  {
    label: "A",
    short: "sfl-www-https",
    url: "https://www.stageflowlive.com/test?x=1",
    expectedFinal: "https://www.clockworkvenue.com/test?x=1",
    category: "stageflow",
  },
  {
    label: "B",
    short: "sfl-www-http",
    url: "http://www.stageflowlive.com/test?x=1",
    expectedFinal: "https://www.clockworkvenue.com/test?x=1",
    category: "stageflow",
  },
  {
    label: "C",
    short: "sfl-apex-https",
    url: "https://stageflowlive.com/test?x=1",
    expectedFinal: "https://www.clockworkvenue.com/test?x=1",
    category: "stageflow",
  },
  {
    label: "D",
    short: "sfl-apex-http",
    url: "http://stageflowlive.com/test?x=1",
    expectedFinal: "https://www.clockworkvenue.com/test?x=1",
    category: "stageflow",
  },
  {
    label: "E",
    short: "cw-www",
    url: "https://www.clockworkvenue.com/test?x=1",
    expectedFinal: "https://www.clockworkvenue.com/test?x=1",
    category: "clockwork",
  },
  {
    label: "F",
    short: "cw-console-root",
    url: "https://console.clockworkvenue.com/",
    expectedFinal: "https://console.clockworkvenue.com/",
    category: "clockwork",
  },
  {
    label: "G",
    short: "cw-console-deep",
    url: "https://console.clockworkvenue.com/deep/link",
    expectedFinal: "https://console.clockworkvenue.com/deep/link",
    category: "clockwork",
  },
];

const rows = [];
const failingStageflow = [];
const failingClockwork = [];

for (const probe of probes) {
  const outJson = path.join(
    artifactDir,
    `mcp-REDIRECT-FINAL-${stamp}-${probe.short}.json`,
  );
  const args = [
    helperPath,
    "--url",
    probe.url,
    "--clearSiteData",
    "--net",
    "--console",
    "--screenshot",
    "--out",
    outJson,
  ];

  await execFileAsync(process.execPath, args, { stdio: "inherit" });

  const jsonRaw = await fs.readFile(outJson, "utf8");
  const data = JSON.parse(jsonRaw);
  const pngPath = outJson.replace(/\.json$/i, ".png");
  const pngExists = await fs
    .access(pngPath)
    .then(() => true)
    .catch(() => false);

  const finalUrl =
    data.matchedRequestUrl ??
    data.selectedPageUrl ??
    data.targetUrl ??
    "";
  const finalStatus = data.finalStatusCode ?? null;
  const redirectHops = Array.isArray(data.redirectChain)
    ? data.redirectChain
        .map((entry) => entry.statusCode ?? entry.statusSummary ?? "?")
        .join(" -> ")
    : "";
  const pathPreserved = finalUrl === probe.expectedFinal;
  const consoleErrors = Array.isArray(data.consoleMessages)
    ? data.consoleMessages.filter(
        (msg) => typeof msg === "string" && !/^<no console messages/i.test(msg),
      ).length
    : 0;
  const errorResponses = Array.isArray(data.documentRequests)
    ? data.documentRequests.filter(
        (req) =>
          typeof req?.statusCode === "number" && req.statusCode >= 400,
      ).length
    : 0;
  const swRegistrations =
    data.serviceWorker?.registrations?.length ??
    (Array.isArray(data.serviceWorker?.registrations)
      ? data.serviceWorker.registrations.length
      : 0);
  const swError = data.serviceWorker?.error ?? null;
  const swPresent =
    (Array.isArray(data.serviceWorker?.registrations) &&
      data.serviceWorker.registrations.length > 0) ||
    Boolean(
      Array.isArray(data.serviceWorker?.registrations) &&
        data.serviceWorker.registrations.length > 0,
    );

  const jsonRel = path.relative(process.cwd(), outJson).replace(/\\/g, "/");
  const pngRel = pngExists
    ? path.relative(process.cwd(), pngPath).replace(/\\/g, "/")
    : "";

  rows.push({
    probe: probe.label,
    start: probe.url,
    final: finalUrl,
    status: finalStatus ?? "?",
    hops: redirectHops || "—",
    pathOk: pathPreserved,
    consoleErrors,
    errorResponses,
    serviceWorker: swPresent ? "Yes" : swError ? `Error (${swError})` : "No",
    jsonRel,
    pngRel: pngRel || "n/a",
    category: probe.category,
    short: probe.short,
  });

  if (probe.category === "stageflow") {
    const stageflowOk =
      pathPreserved && finalStatus === 200 && consoleErrors === 0 && errorResponses === 0;
    if (!stageflowOk) {
      failingStageflow.push(probe.label);
    }
  } else if (probe.category === "clockwork") {
    const clockworkOk =
      finalStatus === 200 && consoleErrors === 0 && errorResponses === 0;
    if (!clockworkOk) {
      failingClockwork.push(probe.label);
    }
  }
}

const stageflowPass = failingStageflow.length === 0;
const clockworkPass = failingClockwork.length === 0;

const header =
  "| Probe | Start | Final | Status | Hops | Path+Query OK | Console Errs | 4xx/5xx | SW? | JSON | PNG |\n" +
  "|------:|-------|-------|--------|------|----------------|--------------|---------|-----|------|-----|\n";

const body = rows
  .map((row) => {
    const pathSummary = row.pathOk ? "OK" : "DIFF";
    return `| ${row.probe} | ${row.start} | ${row.final} | ${row.status} | ${row.hops} | ${pathSummary} | ${row.consoleErrors} | ${row.errorResponses} | ${row.serviceWorker} | ${row.jsonRel} | ${row.pngRel} |`;
  })
  .join("\n");

const stageflowVerdict = `StageFlow + Clockwork: ${
  stageflowPass ? "PASS" : `FAIL (probes ${failingStageflow.join(", ")})`
}`;
const clockworkVerdict = `Clockwork health: ${
  clockworkPass ? "PASS" : `FAIL (probes ${failingClockwork.join(", ")})`
}`;

const outputBlock = `${header}${body}\n\n${stageflowVerdict}\n${clockworkVerdict}\n`;

process.stdout.write(outputBlock);

const healthLogPath = path.resolve("docs/REDIRECT-HEALTH.md");
const logEntry = `## Redirect Health ${stamp}\n\n${outputBlock}\n`;
await fs.appendFile(healthLogPath, logEntry, "utf8");
