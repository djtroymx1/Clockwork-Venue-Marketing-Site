# Clockwork Venue Cutover Checklist

Plain-language guardrails to follow before promoting the Clockwork cutover to production.

## 1. Verify Hosting Target Wiring
- Replace the placeholder site IDs in `.firebaserc` with the real Firebase Hosting site IDs for `clockwork-www`, `clockwork-apex`, and `stageflow-legacy`.
- Double-check that `clockwork-console` already points at the Console Hosting site.
- Run `firebase target:list` to confirm the mappings.

## 2. Confirm Custom Domains
- In the Firebase Console (Hosting → Custom domains), attach `clockworkvenue.com` to the `clockwork-apex` site.
- Ensure both `stageflowlive.com` and `www.stageflowlive.com` are mapped to the `stageflow-legacy` site.
- Verify that `console.clockworkvenue.com` and `www.clockworkvenue.com` point to their respective Hosting targets.

## 3. CI & Preview Deploy
- Push the branch `agent/cutover-bundle` and open the PR “Cutover bundle: multi-site Hosting, 308s, Console SPA, robots fix”.
- Confirm CI passes: `pnpm -C web-ui typecheck`, `pnpm -C web-ui lint`, `pnpm -C web-ui build`, `pnpm -C web-ui e2e:smoke`.
- Let Firebase preview deploys finish for all touched targets; review the preview URLs for console, www, and redirect-only sites.

## 4. Run External Verification
- Set `EXTERNAL_CHECK=1` and execute the optional e2e spec (`pnpm -C web-ui e2e:external`) to confirm 308 redirects for `clockworkvenue.com`, `stageflowlive.com`, and `www.stageflowlive.com`.
- Use the MCP script (`node scripts/run-chrome-devtools.mjs <url>`) to re-run the six-URL sweep and confirm:
  - StageFlow domains now respond with 308 → `https://www.clockworkvenue.com/…`.
  - `clockworkvenue.com` apex returns 308 → `https://www.clockworkvenue.com/…`.
  - `console.clockworkvenue.com` loads without 404s, registers its service worker, and serves `manifest.webmanifest`.
  - `www.clockworkvenue.com` robots.txt references `https://www.clockworkvenue.com/sitemap.xml`.

## 5. Production Promotion (Approval Required)
- After approvals, trigger the production deploy workflow.
- Verify the deployment summary lists the four hosting targets and that each was released to production.
- Spot-check the live domains immediately after go-live.

## Preview cutover-20251016202009
- Console preview: https://clockwork-console--cutover-20251016202009-94xsa7tj.web.app
- Marketing preview: https://clockworkvenue--cutover-20251016202009-jlsgt7wj.web.app
- Apex redirect preview: https://clockworkvenueapex--cutover-20251016202009-yvqrrw7r.web.app
- Stageflow legacy preview: https://stageflow-marketing-site--cutover-20251016202009-u46ch5j2.web.app

| site | url | status / final stop | console errors | notes |
| --- | --- | --- | --- | --- |
| Apex redirect | https://clockworkvenueapex--cutover-20251016202009-yvqrrw7r.web.app | 308 → https://www.clockworkvenue.com/ (200) | none | Redirect jumps straight to the production www domain; path preserved, but still references production host |
| Marketing | https://clockworkvenue--cutover-20251016202009-jlsgt7wj.web.app | 404 | 2 (favicon + page) | Static build missing; Next.js site not yet exported for Hosting preview |
| Stageflow legacy | https://stageflow-marketing-site--cutover-20251016202009-u46ch5j2.web.app | 404 | 2 (favicon + page) | Legacy content not staged; current config points at `public/` but no HTML snapshot is present |
| Console SPA | https://clockwork-console--cutover-20251016202009-94xsa7tj.web.app | 200 | none | Static shell serves correctly (index + favicon) |
| Console SPA (deep link) | https://clockwork-console--cutover-20251016202009-94xsa7tj.web.app/deep/link | 200 | none | SPA rewrite serves `/index.html` for deep routes |

## 6. Rollback Playbook
- Hosting rollback: Firebase Console → Hosting → View releases → Roll back the affected site (`clockwork-console`, `clockwork-www`, `clockwork-apex`, or `stageflow-legacy`).
- Console SPA: redeploy the last known good commit (e.g., `firebase deploy --only hosting:clockwork-console --message "Rollback"`).
- Redirects: use the same Hosting rollback option for `clockwork-apex` or `stageflow-legacy`.
- Re-run the MCP sweep to confirm the rollback state matches expectations.
