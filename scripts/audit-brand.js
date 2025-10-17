#!/usr/bin/env node

/**
 * Clockwork Venue brand audit helper.
 *
 * Scans public-facing content files for leftover "StageFlow" references.
 * Always exits with code 0 (report only; no CI enforcement).
 */

const fs = require("fs");
const path = require("path");

const ROOT = process.cwd();
const ALLOWED_EXTENSIONS = new Set([
  ".html",
  ".htm",
  ".md",
  ".mdx",
  ".markdown",
  ".njk",
  ".ejs",
  ".pug",
  ".hbs",
  ".liquid",
  ".xml",
]);

const IGNORE_DIRS = new Set([
  "Archived",
  ".rollback_bak",
  ".snapshots",
  "node_modules",
  "e2e",
  ".git",
  "assets",
  ".rename_backup",
]);

const MATCH_REGEX = /Stage\s*Flow/gi;

const results = [];
let filesScanned = 0;

function shouldSkipDir(dirName) {
  return IGNORE_DIRS.has(dirName);
}

async function scanDirectory(dirPath) {
  const entries = await fs.promises.readdir(dirPath, { withFileTypes: true });
  for (const entry of entries) {
    const entryPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      if (!shouldSkipDir(entry.name)) {
        await scanDirectory(entryPath);
      }
      continue;
    }

    const ext = path.extname(entry.name);
    if (!ALLOWED_EXTENSIONS.has(ext)) {
      continue;
    }

    filesScanned += 1;
    const content = await fs.promises.readFile(entryPath, "utf8");
    const lines = content.split(/\r?\n/);
    lines.forEach((line, index) => {
      MATCH_REGEX.lastIndex = 0;
      if (MATCH_REGEX.test(line)) {
        const excerpt = line.trim().slice(0, 200);
        results.push({
          file: path.relative(ROOT, entryPath),
          line: index + 1,
          excerpt,
        });
      }
    });
  }
}

async function run() {
  await scanDirectory(ROOT);

  console.log("## Brand Audit\n");
  console.log(`- Files scanned: ${filesScanned}`);
  console.log(`- Matches found: ${results.length}\n`);

  if (results.length > 0) {
    console.log("| File | Line | Excerpt |");
    console.log("| --- | ---: | --- |");
    results.forEach(({ file, line, excerpt }) => {
      const safeExcerpt = excerpt.replace(/\|/g, "\\|");
      console.log(`| ${file} | ${line} | ${safeExcerpt} |`);
    });
  } else {
    console.log("No matches 🎉");
  }
}

run()
  .catch((error) => {
    console.error("Brand audit failed to complete:", error);
  })
  .finally(() => {
    process.exit(0);
  });
