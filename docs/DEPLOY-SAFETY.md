# Safe Deploys — Clockwork Venue & Dirt Bike Database

## How this works (plain English)
- Every pull request runs checks: typecheck, lint, build, and a smoke end-to-end test.
- If those pass, the PR gets a **preview website**. You can click around and verify changes safely.
- **Nothing** goes to your live site until you approve a **Production** workflow that is protected by the `production` environment.
- If something slips through, you can roll back Hosting in a click (or via CLI), and you can re-deploy the last good Functions build.

## Commands that must pass
- `pnpm -C web-ui typecheck`
- `pnpm -C web-ui lint`
- `pnpm -C web-ui build`
- `pnpm -C web-ui e2e:smoke`
- Optional: add more e2e jobs (SW-update, telemetry-sanitize) when relevant.

## Environments
- **Preview (PRs):** Auto-deploys to a short-lived channel (expires in 7 days by default).
- **Production:** Requires approval (GitHub `production` environment). You can add required reviewers in repo settings.

## Rollback
### Hosting
- Console: Firebase → Hosting → *View releases* → pick the previous release → **Rollback**.
- CLI:
  ```bash
  firebase hosting:rollback --project <PROJECT_ID>
  ```

### Functions
- In Firebase Console → Functions → select the previous version → **Roll back**.
- Or from CLI, re-deploy a known good commit:
  ```bash
  git checkout <good_tag_or_commit>
  npx firebase-tools deploy --only functions --project <PROJECT_ID>
  ```

Keep this checklist handy during each release: confirm the preview looks good, ensure reviewers approve the protected workflow, and note any manual steps taken so they can be repeated—or reversed—next time.
