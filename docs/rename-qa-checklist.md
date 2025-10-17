# Clockwork Venue — Rename QA Checklist (Local)

Use this before any deployment. Check each item on a few representative pages (home, features, pricing, docs, legal).

## Brand Surface
- [ ] Browser tab shows "Clockwork Venue" (Title).
- [ ] Hero/heading uses "Clockwork Venue".
- [ ] Meta description: “Run every shift like clockwork: live rotation, VIP timers, payouts, and reports in one console.”
- [ ] Open Graph/Twitter previews pull the new text and `og-cover.png`.

## Visuals
- [ ] Header/logo points to the new logo; alt reads "Clockwork Venue logo".
- [ ] Favicon and Apple Touch Icon render as expected.
- [ ] No legacy StageFlow logo images visible.

## Text Audit
- [ ] No visible "StageFlow" or "Stage Flow" remains on any public page.
- [ ] Footer and any legal pages read "Clockwork Venue".
- [ ] (Optional) REVIEW comments added where “stage” is used as branding; decide if wording should be “rotation / queue / on deck”.

## Downloads/Embeds
- [ ] Any downloadable PDFs/CSVs/screenshots show "Clockwork Venue" in headers/overlays.

## Sanity
- [ ] Page loads normally; no console errors caused by these edits.
- [ ] Nothing in Archived/, .rollback_bak/, .snapshots/ was altered.

> Tip: Run `node scripts/audit-brand.js` to list any leftover "StageFlow" in public files.