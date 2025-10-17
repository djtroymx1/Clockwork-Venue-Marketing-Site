import { readFile, readdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import fs from "fs-extra";
import matter from "gray-matter";
import { marked } from "marked";
import * as cheerio from "cheerio";

const repoRoot = process.cwd();
const contentDir = path.join(repoRoot, "content");
const publicCandidates = [
  path.join(repoRoot, "sites", "www", "public"),
  path.join(repoRoot, "public"),
];
const publicDir =
  publicCandidates.find((p) => existsSync(p)) || path.join(repoRoot, "public");
const outDir = path.join(publicDir, "_generated");
const assetsDir = path.join(publicDir, "assets");

const cssTokensPath = path.join(assetsDir, "site.generated.css");
async function ensureCss() {
  await fs.ensureDir(assetsDir);
  const css = `:root{
  --brand-primary:#0A2540;--brand-aqua:#1FB8C6;--brand-accent:#3F8CFF;
  --neutral-100:#F4F6F8;--neutral-900:#08131E;
  --success:#18B06B;--warning:#FFBF4D;--danger:#E34F4F;
  --radius:16px;--shadow:0 6px 24px rgba(0,0,0,.12);
}
*{box-sizing:border-box}
body{margin:0;font-family:system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;line-height:1.5;background:#fff;color:#111}
@media (prefers-color-scheme: dark){
  body{background:var(--neutral-900);color:#f5f7fb}
  header,footer{background:rgba(255,255,255,0.02)}
}
a{color:var(--brand-accent);text-decoration:none}
header{display:flex;justify-content:space-between;align-items:center;padding:16px 20px;position:sticky;top:0;backdrop-filter:saturate(180%) blur(8px)}
.nav a{margin-left:16px}
.hero{padding:56px 20px;max-width:1100px;margin:0 auto}
.hero h1{font-size:clamp(28px,6vw,44px);margin:0 0 12px}
.ctas a{display:inline-block;margin-right:12px;padding:10px 14px;border-radius:10px;box-shadow:var(--shadow)}
.cta-primary{background:var(--brand-accent);color:#fff}
.cta-ghost{background:transparent;border:1px solid rgba(0,0,0,.1)}
@media (prefers-color-scheme: dark){.cta-ghost{border-color:rgba(255,255,255,.2)}}
.section{max-width:1100px;margin:32px auto;padding:0 20px}
.grid{display:grid;gap:16px;grid-template-columns:repeat(auto-fit,minmax(240px,1fr))}
.card{padding:16px;border-radius:var(--radius);background:rgba(0,0,0,.03)}
@media (prefers-color-scheme: dark){.card{background:rgba(255,255,255,.04)}}
footer{padding:32px 20px;margin-top:40px}
summary{cursor:pointer}
.select{display:flex;gap:8px;align-items:center;margin-top:8px}
select,button{padding:10px 12px;border-radius:10px;border:1px solid rgba(0,0,0,.1);background:transparent}
@media (prefers-color-scheme: dark){select,button{border-color:rgba(255,255,255,.2);color:#fff}}
.bg-gradient{background:linear-gradient(135deg,var(--brand-primary),var(--brand-aqua));-webkit-background-clip:text;color:transparent}
`;
  await fs.writeFile(cssTokensPath, css, "utf8");
}

function optionalLegacyStylesLink() {
  const candidate = path.join(assetsDir, "styles.css");
  return existsSync(candidate)
    ? '<link rel="stylesheet" href="/assets/styles.css">'
    : "";
}

const htmlShell = ({ title, body, brand }) => `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title ? `${title} - ${brand.siteTitle}` : brand.siteTitle}</title>
<meta name="description" content="${brand.description}">
<link rel="stylesheet" href="/assets/site.generated.css">
${optionalLegacyStylesLink()}
</head>
<body>
<header>
  <a href="/" data-testid="nav-logo" class="logo"><strong>${brand.siteTitle}</strong></a>
  <nav class="nav">
    <a href="${brand.consoleBase}" data-testid="nav-login">Log in</a>
  </nav>
</header>
<main id="main">
  ${body}
</main>
<footer data-testid="footer">
  <div class="section">
    <p>&copy; ${new Date().getFullYear()} ${brand.siteTitle}</p>
    <p>Support:
      ${brand.manualUrl ? `<a href="${brand.manualUrl}">Manual</a>` : ``}
      ${brand.tutorialsUrl ? ` · <a href="${brand.tutorialsUrl}">Tutorials</a>` : ``}
    </p>
    <p><a href="mailto:hello@clockworkvenue.com" data-testid="footer-email">hello@clockworkvenue.com</a></p>
  </div>
</footer>
</body>
</html>`;

async function loadBrand() {
  const raw = await readFile(path.join(contentDir, "brand.json"), "utf8");
  return JSON.parse(raw);
}

async function ensureOut() {
  await fs.ensureDir(outDir);
}

async function writePage(brand, srcPath, relOutPath) {
  const raw = await readFile(srcPath, "utf8");
  const { content, data } = matter(raw);
  const md = marked.parse(content);
  const title = data?.title ?? "";
  const html = htmlShell({ title, body: md, brand });
  const outPath = path.join(outDir, relOutPath);
  await fs.ensureDir(path.dirname(outPath));
  await fs.writeFile(outPath, html, "utf8");
}

function heroExtras(brand) {
  const signup = `<a class="cta-ghost" href="${brand.consoleBase}" data-testid="cta-signup">Sign up to test</a>`;
  const waitlist = `<a class="cta-ghost" href="#waitlist" data-testid="cta-waitlist">Join the waitlist</a>`;
  const pick = `
  <details class="card" data-testid="login-views">
    <summary>Log in to a specific view</summary>
    <div class="select">
      <label for="view">Choose view:</label>
      <select id="view" data-testid="login-view-select">
        <option value="${brand.consoleBase}${brand.paths.dj}">DJ</option>
        <option value="${brand.consoleBase}${brand.paths.host}">Host</option>
        <option value="${brand.consoleBase}${brand.paths.monitor}">Monitor</option>
      </select>
      <button id="go" data-testid="login-view-go">Go</button>
    </div>
    <p>Quick links:
      <a href="${brand.consoleBase}${brand.paths.dj}" data-testid="login-dj">DJ</a> ·
      <a href="${brand.consoleBase}${brand.paths.host}" data-testid="login-host">Host</a> ·
      <a href="${brand.consoleBase}${brand.paths.monitor}" data-testid="login-monitor">Monitor</a>
    </p>
  </details>
  <script>
  (function(){
    const s=document.getElementById('view'), b=document.getElementById('go');
    if(s&&b){ b.addEventListener('click',()=>{ const href=s.value; if(href) location.href = href; }); }
  })();
  </script>`;
  return { signup, waitlist, pick };
}

async function injectHero(brand) {
  const home = path.join(outDir, "index.html");
  if (!existsSync(home)) return;
  let html = await readFile(home, "utf8");
  if (!html.includes('data-testid="hero"')) {
    html = html.replace(
      '<main id="main">',
      '<main id="main"><section class="hero" data-testid="hero">'
    );
    html = html.replace("<h1>", '<h1 class="bg-gradient" data-testid="hero-title">');
    const { signup, waitlist, pick } = heroExtras(brand);
    const ctas = `
    <div class="ctas">
      <a class="cta-primary" href="${brand.consoleBase}" data-testid="cta-login">Log in</a>
      ${signup}
      ${waitlist}
    </div>`;
    html = html.replace("</h1>", "</h1>" + ctas);
    html = html.replace("</main>", "</section>" + pick + "</main>");
    await fs.writeFile(home, html, "utf8");
  }
}

function pickContainerWithWaitlist($) {
  let el = $('section[id*="waitlist" i], section[class*="waitlist" i]').first();
  if (!el.length) el = $('div[id*="waitlist" i], div[class*="waitlist" i]').first();
  if (!el.length) {
    el = $('section:contains("waitlist"), div:contains("waitlist")').first();
  }
  return el;
}

async function importLegacyWaitlistIntoGeneratedHome() {
  const liveHome = path.join(publicDir, "index.html");
  const genHome = path.join(outDir, "index.html");
  if (!existsSync(liveHome) || !existsSync(genHome)) return;

  const [liveHtml, genHtml] = await Promise.all([
    readFile(liveHome, "utf8"),
    readFile(genHome, "utf8"),
  ]);
  const $live = cheerio.load(liveHtml);
  const $gen = cheerio.load(genHtml);

  const el = pickContainerWithWaitlist($live);
  const mount = $gen("main#main");

  if (el && el.length && mount && mount.length) {
    const wrapped = `<section id="waitlist" data-testid="waitlist">${cheerio.html(el)}</section>`;
    const picker = $gen('[data-testid="login-views"]').first();
    if (picker.length) {
      picker.after(wrapped);
    } else {
      mount.append(wrapped);
    }
    await fs.writeFile(genHome, $gen.html(), "utf8");
  } else {
    const fallback = `<section id="waitlist" data-testid="waitlist" class="section card"><p>Waitlist box will remain as in the live site for now.</p></section>`;
    const picker = $gen('[data-testid="login-views"]').first();
    if (picker.length) {
      picker.after(fallback);
    } else {
      $gen("main#main").append(fallback);
    }
    await fs.writeFile(genHome, $gen.html(), "utf8");
  }
}

async function main() {
  if (!existsSync(contentDir)) {
    console.error("No /content folder found.");
    process.exit(1);
  }
  await ensureCss();
  const brand = await loadBrand();
  await ensureOut();

  const topFiles = ["home.md", "modules.md", "pricing.md", "faq.md", "contact.md"].filter(
    (f) => existsSync(path.join(contentDir, f))
  );
  for (const f of topFiles) {
    const name = path.parse(f).name;
    const rel = name === "home" ? "index.html" : `${name}/index.html`;
    await writePage(brand, path.join(contentDir, f), rel);
  }

  const legalDir = path.join(contentDir, "legal");
  if (existsSync(legalDir)) {
    const legals = (await readdir(legalDir)).filter((f) => f.endsWith(".md"));
    for (const file of legals) {
      const name = path.parse(file).name;
      await writePage(brand, path.join(legalDir, file), path.join("legal", name, "index.html"));
    }
  }

  await injectHero(brand);
  await importLegacyWaitlistIntoGeneratedHome();

  console.log("Composed to:", outDir);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
