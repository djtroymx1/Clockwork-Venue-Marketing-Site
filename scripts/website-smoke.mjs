import { readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

const repoRoot = process.cwd();
const publicCandidates = [
  path.join(repoRoot, "sites", "www", "public"),
  path.join(repoRoot, "public"),
];
const publicDir =
  publicCandidates.find((p) => existsSync(p)) || path.join(repoRoot, "public");
const genDir = path.join(publicDir, "_generated");

const LIVE = [
  'data-testid="nav-logo"',
  'data-testid="nav-login"',
  'data-testid="footer"',
  'data-testid="footer-email"',
];
const GEN = [
  'data-testid="hero"',
  'data-testid="hero-title"',
  'data-testid="cta-login"',
  'data-testid="cta-signup"',
  'data-testid="cta-waitlist"',
  'data-testid="login-views"',
  'data-testid="login-dj"',
  'data-testid="login-host"',
  'data-testid="login-monitor"',
  'data-testid="waitlist"',
];

async function missingNeedles(file, needles) {
  const html = await readFile(file, "utf8");
  return needles.filter((n) => !html.includes(n));
}

(async () => {
  const failures = [];
  const liveHome = path.join(publicDir, "index.html");
  const genHome = path.join(genDir, "index.html");

  if (existsSync(liveHome)) {
    const miss = await missingNeedles(liveHome, LIVE);
    if (miss.length) failures.push({ file: liveHome, miss });
  }
  if (existsSync(genHome)) {
    const miss = await missingNeedles(genHome, GEN);
    if (miss.length) failures.push({ file: genHome, miss });
  }

  if (failures.length) {
    console.error("Selector smoke failed:");
    for (const f of failures) {
      console.error(`- ${f.file}: missing ${f.miss.join(", ")}`);
    }
    process.exit(1);
  } else {
    console.log("Selector smoke passed.");
  }
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
