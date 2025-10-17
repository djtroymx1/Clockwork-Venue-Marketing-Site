import { existsSync } from "node:fs";
import { cp } from "node:fs/promises";
import path from "node:path";

const repo = process.cwd();
const pubs = [
  path.join(repo, "sites", "www", "public"),
  path.join(repo, "public"),
];
const pub = pubs.find((p) => existsSync(p)) || path.join(repo, "public");
const live = path.join(pub, "index.html");
const latest = path.join(pub, "index.backup-latest.html");

(async () => {
  if (!existsSync(latest)) {
    console.error("No latest backup:", latest);
    process.exit(1);
  }
  await cp(latest, live);
  console.log("✓ Reverted home from", latest);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
