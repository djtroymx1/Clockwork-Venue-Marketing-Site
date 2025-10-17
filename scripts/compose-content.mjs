import { readFile, readdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import fs from "fs-extra";
import matter from "gray-matter";
import { marked } from "marked";
import * as cheerio from "cheerio";

marked.use({ mangle: false, headerIds: false });

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

const moduleBlueprint = [
  {
    name: "Rotate",
    kicker: "Booth control",
    summary: "Smooth stage scheduling and handoffs.",
    points: [
      "Advance stages with one tap",
      "Timers keep every performer on schedule",
      "Set custom stage orders for theme nights",
    ],
  },
  {
    name: "Floor",
    kicker: "Host tools",
    summary: "Assignments, headcounts, and shift notes stay aligned.",
    points: [
      "Track floor checks and table status",
      "Log guest spend and comp activity",
      "Leave handoff notes for the next shift",
    ],
  },
  {
    name: "DJ",
    kicker: "Rotation view",
    summary: "Live rotation board plus cues the whole team can trust.",
    points: [
      "Project rotation to monitors across the club",
      "See timers and lineup without leaving the booth",
      "Drop in announcements and VIP cues",
    ],
  },
  {
    name: "Admin",
    kicker: "Setup",
    summary: "Roles, rules, and automation that match your house policy.",
    points: [
      "Configure stages, shift cadence, and rotation order",
      "Manage staff access with role-based permissions",
      "Archive nights and reopen them for audits",
    ],
  },
  {
    name: "Reports",
    kicker: "Nightly insights",
    summary: "Summaries you can act on the next morning.",
    points: [
      "Export shifts with counts, spend, and notes",
      "Spot trends across weeks and locations",
      "Share clean recaps with owners and partners",
    ],
  },
];

const flowSteps = [
  {
    title: "Prep the night",
    description:
      "Load tonight's roster, define stage order, and pin any floor priorities or VIP holds.",
  },
  {
    title: "Run every shift",
    description:
      "Hosts, DJs, and monitors stay in sync with live rotation, timers, and status boards.",
  },
  {
    title: "Review and hand off",
    description:
      "Exports land in inboxes so owners and partners see the story of the night without chasing staff.",
  },
];

const highlightCards = [
  {
    title: "Heads-up displays",
    description:
      "Mirror the current lineup on any back-of-house monitor so performers know exactly when they are on deck.",
  },
  {
    title: "Shift memory",
    description:
      "Log comps, VIP notes, and floor adjustments that the next team can pick up instantly.",
  },
  {
    title: "Compliance ready",
    description:
      "Keep a clean record of rotations, hours, and staffing for owners, auditors, and investors.",
  },
];

const cssTokensPath = path.join(assetsDir, "site.generated.css");
async function ensureCss() {
  await fs.ensureDir(assetsDir);
  const css = `:root{
  --brand-primary:#0A2540;--brand-aqua:#1FB8C6;--brand-accent:#3F8CFF;
  --neutral-050:#FAFBFD;--neutral-100:#F4F6F8;--neutral-200:#E6EBF1;
  --neutral-700:#26415E;--neutral-900:#08131E;
  --surface:white;--surface-muted:rgba(255,255,255,0.82);
  --radius-lg:22px;--radius-md:16px;--shadow-soft:0 22px 48px rgba(8,19,30,0.12);
}
*{box-sizing:border-box}
body{margin:0;background:var(--neutral-100);color:var(--neutral-900);font-family:system-ui,-apple-system,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;line-height:1.55;}
a{color:var(--brand-accent);text-decoration:none;}
a:hover{text-decoration:underline;}
.site-header{position:sticky;top:0;background:var(--surface);border-bottom:1px solid rgba(8,19,30,0.08);padding:14px 20px;display:flex;align-items:center;justify-content:space-between;z-index:20;}
.site-logo{display:flex;align-items:center;gap:10px;font-weight:700;color:var(--brand-primary);}
.site-nav a{font-weight:600;color:var(--brand-primary);}
.site-main{display:flex;flex-direction:column;gap:56px;padding-bottom:64px;}
.hero-splash{background:linear-gradient(135deg,rgba(10,37,64,0.95),rgba(63,140,255,0.85));color:white;padding:64px 20px 72px;}
.hero-inner{max-width:1080px;margin:0 auto;display:flex;flex-direction:column;gap:24px;}
.hero-eyebrow{text-transform:uppercase;letter-spacing:0.18em;font-size:0.75rem;opacity:0.75;}
.hero-title{margin:0;font-size:clamp(2.4rem,4vw,3.5rem);line-height:1.1;}
.hero-copy p{margin:0 0 14px;max-width:720px;font-size:1.125rem;}
.hero-ctas{display:flex;flex-wrap:wrap;gap:14px;}
.btn{display:inline-flex;align-items:center;justify-content:center;padding:11px 18px;border-radius:999px;border:1px solid transparent;font-weight:700;font-size:0.95rem;background:rgba(255,255,255,0.14);color:white;}
.btn.primary{background:white;color:var(--brand-primary);}
.btn.outline{background:transparent;border-color:rgba(255,255,255,0.65);}
.btn.ghost{background:rgba(255,255,255,0.12);}
.hero-subnote{margin:0;font-size:0.95rem;opacity:0.85;}
.section{max-width:1080px;margin:0 auto;padding:0 20px;}
.section-header{text-align:center;margin-bottom:32px;}
.section-header h2{margin:0;font-size:2rem;color:var(--brand-primary);}
.section-header p{margin:12px auto 0;max-width:640px;color:var(--neutral-700);}
.login-stack{display:flex;justify-content:center;}
.login-card{background:white;border:1px solid rgba(8,19,30,0.08);border-radius:var(--radius-lg);box-shadow:var(--shadow-soft);padding:28px;max-width:720px;width:100%;display:flex;flex-direction:column;gap:18px;}
.login-card h2{margin:0;font-size:1.5rem;color:var(--brand-primary);}
.login-picker{display:flex;flex-wrap:wrap;gap:12px;align-items:center;}
.login-picker label{font-weight:600;}
.login-picker select,.login-picker button{padding:10px 14px;border-radius:12px;border:1px solid rgba(8,19,30,0.16);background:white;font-weight:600;}
.login-picker button{background:var(--brand-accent);color:white;border:none;cursor:pointer;}
.login-quick{font-size:0.95rem;color:var(--neutral-700);}
.login-divider{margin:0 6px;opacity:0.4;}
.module-band{display:flex;flex-direction:column;gap:32px;}
.module-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:20px;}
.module-card{background:white;border:1px solid rgba(8,19,30,0.08);border-radius:var(--radius-md);padding:22px;display:flex;flex-direction:column;gap:12px;box-shadow:0 12px 28px rgba(8,19,30,0.08);}
.module-kicker{text-transform:uppercase;font-size:0.75rem;letter-spacing:0.12em;color:var(--brand-accent);}
.module-card h3{margin:0;font-size:1.25rem;color:var(--brand-primary);}
.module-card ul{margin:0;padding-left:18px;color:var(--neutral-700);font-size:0.95rem;display:flex;flex-direction:column;gap:6px;}
.flow-band{background:var(--surface);border:1px solid rgba(8,19,30,0.07);border-radius:var(--radius-lg);padding:32px;display:grid;gap:24px;}
.flow-band h3{margin:0;font-size:1.35rem;color:var(--brand-primary);}
.flow-steps{list-style:none;padding:0;margin:0;display:grid;gap:18px;}
.flow-steps li{display:flex;gap:14px;align-items:flex-start;}
.step-index{flex-shrink:0;width:34px;height:34px;border-radius:50%;background:var(--brand-accent);color:white;font-weight:700;display:flex;align-items:center;justify-content:center;}
.flow-steps h4{margin:0;font-size:1.05rem;color:var(--brand-primary);}
.flow-steps p{margin:4px 0 0;color:var(--neutral-700);font-size:0.95rem;}
.highlight-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:20px;}
.highlight-card{background:white;border:1px solid rgba(8,19,30,0.07);border-radius:var(--radius-md);padding:20px;box-shadow:0 8px 24px rgba(8,19,30,0.08);}
.highlight-card h4{margin:0 0 10px;color:var(--brand-primary);}
.highlight-card p{margin:0;color:var(--neutral-700);font-size:0.95rem;}
.support-band{display:grid;grid-template-columns:repeat(auto-fit,minmax(320px,1fr));gap:24px;}
.panel{background:white;border:1px solid rgba(8,19,30,0.08);border-radius:var(--radius-lg);padding:28px;box-shadow:0 14px 32px rgba(8,19,30,0.09);}
.panel h3{margin:0 0 18px;color:var(--brand-primary);font-size:1.4rem;}
.faq-list details{border:1px solid rgba(8,19,30,0.1);border-radius:14px;padding:16px;margin-bottom:12px;background:var(--neutral-050);}
.faq-list summary{cursor:pointer;font-weight:600;color:var(--brand-primary);outline:none;}
.faq-answer p{margin:12px 0 0;font-size:0.95rem;color:var(--neutral-700);}
.contact-copy p,.pricing-copy p{margin:0 0 12px;color:var(--neutral-700);}
.contact-cta{display:flex;flex-wrap:wrap;gap:12px;margin-top:12px;}
.surface-button{display:inline-flex;align-items:center;justify-content:center;padding:10px 16px;border-radius:999px;font-weight:700;border:1px solid var(--brand-accent);color:var(--brand-accent);}
.surface-button.primary{background:var(--brand-accent);color:white;border-color:var(--brand-accent);}
.waitlist-slot{margin-top:18px;border-top:1px dashed rgba(8,19,30,0.15);padding-top:18px;}
.waitlist-placeholder{background:var(--neutral-050);border:1px solid rgba(8,19,30,0.12);border-radius:var(--radius-md);padding:18px;color:var(--neutral-700);}
footer{background:white;border-top:1px solid rgba(8,19,30,0.08);margin-top:80px;padding:32px 20px;}
footer .section{display:flex;flex-direction:column;gap:12px;align-items:flex-start;}
footer a{color:var(--brand-accent);}
@media (max-width:720px){
  .hero-inner{gap:20px;}
  .hero-ctas{flex-direction:column;align-items:flex-start;}
  .login-picker{flex-direction:column;align-items:flex-start;}
  .flow-band{padding:24px;}
  .panel{padding:24px;}
}
@media (prefers-color-scheme: dark){
  body{background:#03080F;color:white;}
  header,footer{background:rgba(8,19,30,0.9);}
  .site-header{border-color:rgba(255,255,255,0.08);}
  .hero-splash{background:linear-gradient(135deg,rgba(10,37,64,0.88),rgba(31,184,198,0.85));}
  .module-card,.highlight-card,.panel,.login-card{background:rgba(8,19,30,0.75);border-color:rgba(255,255,255,0.1);box-shadow:none;}
  .waitlist-placeholder{background:rgba(8,19,30,0.6);border-color:rgba(255,255,255,0.1);color:#dbe7f5;}
  .surface-button{border-color:rgba(255,255,255,0.6);color:white;}
  .surface-button.primary{background:var(--brand-accent);border-color:var(--brand-accent);}
}
`;
  await fs.writeFile(cssTokensPath, css, "utf8");
}

function optionalLegacyStylesLink() {
  const candidate = path.join(assetsDir, "styles.css");
  return existsSync(candidate)
    ? '<link rel="stylesheet" href="/assets/styles.css">'
    : "";
}

function normalize(value) {
  return value
    .replace(/\u2013|\u2014/g, "-")
    .replace(/\u2018|\u2019/g, "'")
    .replace(/\u201C|\u201D/g, '"')
    .replace(/\u00A0/g, " ")
    .replace(/\u2026/g, "...");
}

function escapeHtml(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function escapeHtmlAttr(value) {
  return escapeHtml(value).replace(/"/g, "&quot;");
}

function capitalizeSentence(value) {
  if (!value) return value;
  return value.charAt(0).toUpperCase() + value.slice(1);
}

const htmlShell = ({ title, body, brand }) => {
  const siteTitle = escapeHtml(brand.siteTitle || "Clockwork Venue");
  const supportLinks = [];
  if (brand.manualUrl) {
    supportLinks.push(
      `<a href="${escapeHtmlAttr(brand.manualUrl)}">Manual</a>`
    );
  }
  if (brand.tutorialsUrl) {
    supportLinks.push(
      `<a href="${escapeHtmlAttr(brand.tutorialsUrl)}">Tutorials</a>`
    );
  }
  const supportLine = supportLinks.length
    ? supportLinks.join(" / ")
    : "Resources coming soon.";
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title ? `${escapeHtml(title)} - ${siteTitle}` : siteTitle}</title>
<meta name="description" content="${escapeHtmlAttr(
    brand.description || "Clockwork Venue keeps operations in sync."
  )}">
<link rel="stylesheet" href="/assets/site.generated.css">
${optionalLegacyStylesLink()}
</head>
<body>
<header class="site-header">
  <a href="/" data-testid="nav-logo" class="site-logo"><strong>${siteTitle}</strong></a>
  <nav class="site-nav">
    <a href="${escapeHtmlAttr(brand.consoleBase || "#")}" data-testid="nav-login">Log in</a>
  </nav>
</header>
<main id="main" class="site-main">
${body}
</main>
<footer data-testid="footer">
  <div class="section">
    <p>(c) ${new Date().getFullYear()} ${siteTitle}</p>
    <p>Support: ${supportLine}</p>
    <p><a href="mailto:hello@clockworkvenue.com" data-testid="footer-email">hello@clockworkvenue.com</a></p>
  </div>
</footer>
</body>
</html>`;
};

async function loadBrand() {
  const raw = await readFile(path.join(contentDir, "brand.json"), "utf8");
  return JSON.parse(raw);
}

async function ensureOut() {
  await fs.ensureDir(outDir);
}

async function loadContent(relPath) {
  const fullPath = path.join(contentDir, relPath);
  const raw = await readFile(fullPath, "utf8");
  return matter(raw);
}

async function writeHtmlPage(brand, relOutPath, title, body) {
  const html = htmlShell({ title, body, brand });
  const outPath = path.join(outDir, relOutPath);
  await fs.ensureDir(path.dirname(outPath));
  await fs.writeFile(outPath, html, "utf8");
}

async function writeMarkdownPage(brand, srcPath, relOutPath) {
  const { content, data } = await loadContent(srcPath);
  const md = marked.parse(content);
  const title = data?.title ?? "";
  await writeHtmlPage(brand, relOutPath, title, md);
}

function heroFromMarkdown(markdown, fallbackTitle) {
  const html = marked.parse(markdown);
  const $ = cheerio.load(html);
  const title = normalize($("h1").first().text().trim() || fallbackTitle);
  const paragraphs = $("p")
    .map((_, el) => normalize($(el).html().trim()))
    .get();
  return { title, paragraphs };
}

function parseModuleMap(markdown) {
  const map = new Map();
  const lines = markdown.split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed.startsWith("- **")) continue;
    const match = trimmed.match(/^- \*\*(.+?)\*\*\s*-\s*(.+)$/);
    if (match) {
      map.set(normalize(match[1].trim()), normalize(match[2].trim()));
    }
  }
  return map;
}

function parseFaqEntries(markdown) {
  const entries = [];
  const lines = markdown.split(/\r?\n/);
  let currentQuestion = null;
  let buffer = [];
  const pushEntry = () => {
    if (currentQuestion) {
      const answerHtml = normalize(marked.parse(buffer.join("\n")).trim());
      entries.push({ question: normalize(currentQuestion), answerHtml });
    }
  };
  for (const line of lines) {
    if (line.startsWith("### ")) {
      pushEntry();
      currentQuestion = line.replace("### ", "").trim();
      buffer = [];
    } else {
      buffer.push(line);
    }
  }
  pushEntry();
  return entries;
}

function buildConsoleHref(brand, key) {
  const base = (brand.consoleBase || "").replace(/\/$/, "");
  const pathValue =
    (brand.paths && typeof brand.paths[key] === "string"
      ? brand.paths[key]
      : "") || "";
  if (!base && !pathValue) return "#";
  if (!base) return pathValue;
  return `${base}${pathValue}`;
}

function renderHomeBody({
  brand,
  hero,
  moduleMap,
  faqEntries,
  pricingHtml,
  contactHtml,
}) {
  const heroCopy =
    hero.paragraphs.length > 0
      ? hero.paragraphs.map((p) => `<p>${p}</p>`).join("")
      : `<p>${escapeHtml(brand.description || "")}</p>`;

  const moduleCards = moduleBlueprint
    .map((module) => {
      const summary =
        moduleMap.get(module.name) || module.summary || "Details coming soon.";
      const summaryText = capitalizeSentence(summary);
      const points = module.points
        .map((point) => `<li>${escapeHtml(point)}</li>`)
        .join("");
      return `<article class="module-card">
  <span class="module-kicker">${escapeHtml(module.kicker)}</span>
  <h3>${escapeHtml(module.name)}</h3>
  <p>${escapeHtml(summaryText)}</p>
  <ul>${points}</ul>
</article>`;
    })
    .join("");

  const flowMarkup = flowSteps
    .map(
      (step, index) => `<li>
  <span class="step-index">${index + 1}</span>
  <div>
    <h4>${escapeHtml(step.title)}</h4>
    <p>${escapeHtml(step.description)}</p>
  </div>
</li>`
    )
    .join("");

  const highlightMarkup = highlightCards
    .map(
      (card) => `<article class="highlight-card">
  <h4>${escapeHtml(card.title)}</h4>
  <p>${escapeHtml(card.description)}</p>
</article>`
    )
    .join("");

  const faqMarkup = faqEntries.slice(0, 3).map(
    (faq) => `<details>
  <summary>${escapeHtml(faq.question)}</summary>
  <div class="faq-answer">${faq.answerHtml}</div>
</details>`
  ).join("");

  const consoleBase = brand.consoleBase || "#";
  const signUpHref = brand.signUpFormUrl || consoleBase;
  const loginHref = consoleBase;
  const waitlistHref = "#waitlist";

  const loginLinks = [
    { label: "DJ", href: buildConsoleHref(brand, "dj"), testId: "login-dj" },
    { label: "Host", href: buildConsoleHref(brand, "host"), testId: "login-host" },
    {
      label: "Monitor",
      href: buildConsoleHref(brand, "monitor"),
      testId: "login-monitor",
    },
  ]
    .map(
      (item, index) =>
        `<a href="${escapeHtmlAttr(item.href)}" data-testid="${item.testId}">${escapeHtml(item.label)}</a>${
          index < 2 ? '<span class="login-divider">/</span>' : ""
        }`
    )
    .join(" ");

  return `
<section class="hero-splash" data-testid="hero">
  <div class="hero-inner">
    <span class="hero-eyebrow">Clockwork Venue Platform</span>
    <h1 class="hero-title" data-testid="hero-title">${escapeHtml(hero.title)}</h1>
    <div class="hero-copy">
      ${heroCopy}
    </div>
    <div class="hero-ctas">
      <a class="btn primary" href="${escapeHtmlAttr(
        loginHref
      )}" data-testid="cta-login">Log in</a>
      <a class="btn outline" href="${escapeHtmlAttr(
        signUpHref
      )}" data-testid="cta-signup">Sign up to test</a>
      <a class="btn ghost" href="${waitlistHref}" data-testid="cta-waitlist">Join the waitlist</a>
    </div>
    <p class="hero-subnote">No new hardware required. DJs, hosts, and monitors stay in sync from the same console.</p>
  </div>
</section>

<section class="section login-stack">
  <div class="login-card" data-testid="login-views">
    <h2>Jump back into the console</h2>
    <p class="login-intro">Pick the view you use most and head straight into the Clockwork Venue Console.</p>
    <div class="login-picker">
      <label for="login-view-select">View</label>
      <select id="login-view-select">
        <option value="${escapeHtmlAttr(buildConsoleHref(brand, "dj"))}">DJ</option>
        <option value="${escapeHtmlAttr(buildConsoleHref(brand, "host"))}">Host</option>
        <option value="${escapeHtmlAttr(buildConsoleHref(brand, "monitor"))}">Monitor</option>
      </select>
      <button id="login-view-go">Go</button>
    </div>
    <p class="login-quick">Quick links: ${loginLinks}</p>
  </div>
</section>

<section class="section module-band">
  <div class="section-header">
    <h2>Modules built for every shift</h2>
    <p>Rotate, Floor, DJ, Admin, and Reports keep the whole house aligned without bolting on extra tools.</p>
  </div>
  <div class="module-grid" data-testid="feature-grid">
    ${moduleCards}
  </div>
</section>

<section class="section">
  <div class="flow-band">
    <h3>How a night runs on Clockwork Venue</h3>
    <ol class="flow-steps">
      ${flowMarkup}
    </ol>
  </div>
</section>

<section class="section">
  <div class="highlight-grid">
    ${highlightMarkup}
  </div>
</section>

<section class="section support-band">
  <article class="panel" data-testid="faq">
    <h3>FAQ</h3>
    <div class="faq-list">
      ${faqMarkup}
    </div>
  </article>
  <article class="panel" data-testid="pricing-contact">
    <h3>Get in touch</h3>
    <div class="pricing-copy">${pricingHtml}</div>
    <div class="contact-copy">${contactHtml}</div>
    <div class="contact-cta">
      <a class="surface-button primary" href="${escapeHtmlAttr(
        loginHref
      )}">Log in</a>
      <a class="surface-button" href="${escapeHtmlAttr(
        signUpHref
      )}">Sign up to test</a>
      <a class="surface-button" href="mailto:hello@clockworkvenue.com">Contact us</a>
    </div>
    <section id="waitlist" data-testid="waitlist" class="waitlist-slot">
      <div class="waitlist-placeholder" data-waitlist-placeholder="true">
        <h4>Legacy waitlist box</h4>
        <p>Drop the StageFlow waitlist markup back into the live site and rerun the composer. This card will mirror it automatically.</p>
      </div>
    </section>
  </article>
</section>

<script>
(function(){
  var select = document.getElementById("login-view-select");
  var go = document.getElementById("login-view-go");
  if (select && go) {
    go.addEventListener("click", function(){
      var href = select.value;
      if (href && href !== "#") {
        window.location.href = href;
      }
    });
  }
})();
</script>
`;
}

async function composeHome(brand) {
  const home = await loadContent("home.md");
  const hero = heroFromMarkdown(
    home.content,
    brand.tagline || "Run every shift like clockwork."
  );
  const modulesContent = await loadContent("modules.md");
  const moduleMap = parseModuleMap(modulesContent.content);
  const faqContent = await loadContent("faq.md");
  const faqEntries = parseFaqEntries(faqContent.content);
  const pricingContent = await loadContent("pricing.md");
  const contactContent = await loadContent("contact.md");

  const pricingHtml = normalize(marked.parse(pricingContent.content));
  const contactHtml = normalize(marked.parse(contactContent.content));

  const body = renderHomeBody({
    brand,
    hero,
    moduleMap,
    faqEntries,
    pricingHtml,
    contactHtml,
  });

  await writeHtmlPage(brand, "index.html", home.data?.title ?? "Home", body);
}

async function composeStandardPages(brand) {
  const standardFiles = ["modules.md", "pricing.md", "faq.md", "contact.md"];
  for (const file of standardFiles) {
    const name = path.parse(file).name;
    const rel = `${name}/index.html`;
    await writeMarkdownPage(brand, file, rel);
  }
}

async function composeLegalPages(brand) {
  const legalDir = path.join(contentDir, "legal");
  if (!existsSync(legalDir)) return;
  const entries = (await readdir(legalDir)).filter((f) => f.endsWith(".md"));
  for (const file of entries) {
    const name = path.parse(file).name;
    await writeMarkdownPage(
      brand,
      path.join("legal", file),
      path.join("legal", name, "index.html")
    );
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
  const genHome = path.join(outDir, "index.html");
  if (!existsSync(genHome)) return;

  const candidateSources = [
    path.join(repoRoot, "_legacy", "website-old", "index.html"),
    path.join(repoRoot, "_legacy", "index.html"),
    path.join(publicDir, "index.html"),
  ];
  const sourcePath = candidateSources.find((candidate) => existsSync(candidate));
  if (!sourcePath) return;

  const [sourceHtml, genHtml] = await Promise.all([
    readFile(sourcePath, "utf8"),
    readFile(genHome, "utf8"),
  ]);
  const $source = cheerio.load(sourceHtml);
  const $gen = cheerio.load(genHtml);

  const legacyWaitlist = pickContainerWithWaitlist($source);
  const main = $gen("main#main");
  if (!main.length) {
    await fs.writeFile(genHome, $gen.html(), "utf8");
    return;
  }

  const placeholder = $gen('section#waitlist[data-testid="waitlist"]').first();
  const loginPicker = $gen('[data-testid="login-views"]').first();

  if (legacyWaitlist && legacyWaitlist.length) {
    const wrapped = `<section id="waitlist" data-testid="waitlist">${cheerio.html(
      legacyWaitlist
    )}</section>`;
    if (placeholder.length) placeholder.remove();
    if (loginPicker.length) {
      loginPicker.after(wrapped);
    } else {
      main.append(wrapped);
    }
    await fs.writeFile(genHome, $gen.html(), "utf8");
    return;
  }

  if (!placeholder.length) {
    const fallback = `<section id="waitlist" data-testid="waitlist" class="waitlist-slot"><div class="waitlist-placeholder" data-waitlist-placeholder="true"><p>Legacy waitlist markup was not detected in the current source. Keep the waiting room content in &lt;public&gt;/index.html and rerun the composer to mirror it here.</p></div></section>`;
    if (loginPicker.length) {
      loginPicker.after(fallback);
    } else {
      main.append(fallback);
    }
  }

  await fs.writeFile(genHome, $gen.html(), "utf8");
}

async function main() {
  if (!existsSync(contentDir)) {
    console.error("No /content folder found.");
    process.exit(1);
  }
  await ensureCss();
  const brand = await loadBrand();
  await ensureOut();

  await composeHome(brand);
  await composeStandardPages(brand);
  await composeLegalPages(brand);

  await importLegacyWaitlistIntoGeneratedHome();

  console.log("Composed to:", outDir);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
