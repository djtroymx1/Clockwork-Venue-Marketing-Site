import fs from "fs";
import path from "path";

const repoRoot = process.cwd();
const gitInfoExclude = path.join(repoRoot, ".git", "info", "exclude");
const legacyDir = path.join(repoRoot, "_legacy");
const hooksDir = path.join(repoRoot, ".git", "hooks");

function ensureDir(p) {
  if (!fs.existsSync(p)) {
    fs.mkdirSync(p, { recursive: true });
  }
}

function appendUnique(file, line) {
  const exists = fs.existsSync(file);
  const content = exists ? fs.readFileSync(file, "utf8") : "";
  const lines = content.split(/\r?\n/);
  if (!lines.includes(line)) {
    const prefix = exists && !content.endsWith("\n") ? "\n" : "";
    fs.appendFileSync(file, `${prefix}${line}\n`, "utf8");
  }
}

function writeHook(name, script) {
  const hookPath = path.join(hooksDir, name);
  const marker = "# LEGACY-GUARD";
  if (fs.existsSync(hookPath)) {
    const current = fs.readFileSync(hookPath, "utf8");
    if (current.includes(marker)) return;
  }
  fs.writeFileSync(hookPath, script, { encoding: "utf8", mode: 0o755 });
}

(function main() {
  ensureDir(legacyDir);

  ensureDir(path.dirname(gitInfoExclude));
  appendUnique(gitInfoExclude, "_legacy/");

  ensureDir(hooksDir);
  const guard = `#!/usr/bin/env sh
# LEGACY-GUARD
STAGED="$(git diff --cached --name-only)"
echo "$STAGED" | grep -E '^_legacy/' >/dev/null 2>&1
if [ $? -eq 0 ]; then
  echo >&2 "✖ Commit blocked: _legacy/ is local-only and must not be committed."
  echo >&2 "  Run: git restore --staged _legacy/ - or remove those files from the commit."
  exit 1
fi
`;
  writeHook("pre-commit", guard);
  writeHook("pre-push", guard);

  console.log("✓ Legacy reference ready: _legacy/ (ignored, guarded locally)");
})();
