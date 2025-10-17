# Attach Custom Domains (Zero-Downtime)

## A) What to attach (site → domain)
1) **clockwork-www** → `www.clockworkvenue.com` (serve marketing site)
2) **clockwork-apex** → `clockworkvenue.com` (**Redirect this domain** → `https://www.clockworkvenue.com`)
3) **clockwork-console** → `console.clockworkvenue.com` (serve Console SPA)
4) **stageflow-legacy** → `stageflowlive.com`, `www.stageflowlive.com` (serve “legacy” placeholder; redirect later)

> Note: Use **Advanced Setup** for each to mint certs first. Remove conflicting `A/AAAA/CNAME` at your DNS before final connect. Keep TTL low (300) during cutover.

## B) Firebase Console steps (per domain)
1. Go to **Hosting → View** for the target site → **Add custom domain**.  
2. Enter the domain. For apex → check **Redirect all requests to another domain**, set to `https://www.clockworkvenue.com`.  
3. Choose **Advanced Setup**. Follow the wizard:
   - Add/keep **TXT** ownership record if prompted.
   - Add **A** record(s) the wizard shows (IPv4 to Hosting).
   - **Remove any AAAA** and other A/CNAMEs that point elsewhere.
4. Wait for status to become **Connected** (cert minted), then repeat for the next domain.

## C) Auth & App Check
- **Auth → Sign-in method → Authorized domains**: add  
  `clockworkvenue.com`, `www.clockworkvenue.com`, `console.clockworkvenue.com`, plus `stageflowlive.com` / `www.stageflowlive.com` if sign-in ever flows there.  
- If your client uses a custom `authDomain`, update it to the canonical host.
- **App Check** (Web): ensure the production site key is enabled for the above domains. If using reCAPTCHA Enterprise, update the site key’s allowed domains.

## D) Deploy to LIVE (multi-site)
From repo root:  firebase deploy --only hosting:clockwork-apex,hosting:clockwork-www,hosting:clockwork-console,hosting:stageflow-legacy 

## E) Verify (scripts + MCP)
Run the scripts in `scripts/` (added below) and the MCP smoke to confirm:
- DNS resolves to Firebase Hosting IP
- Apex → 3xx redirect to `https://www.clockworkvenue.com` **with path & query preserved**
- `www` and `console` return `200` and show no console errors
- HSTS header present on `www` (and `console` if desired)
- Stageflow hosts return `200` (or later 3xx once we flip them)

## F) Rollback
- In **Hosting → Releases**, roll back each site to the previous live version; remove the domain mapping (or turn off redirect) in the domain’s **⋮** menu if needed.
