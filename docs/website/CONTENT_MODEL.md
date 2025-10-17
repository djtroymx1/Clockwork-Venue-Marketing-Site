---
owner: website
status: active
last_reviewed: 2025-10-17
next_review_due: 2025-11-17
---
# Content Model (Markdown + JSON)

- `/content/brand.json` holds site meta (title/desc), Console base, view paths, links (manual/tutorials), analytics ids, and theme.
- Markdown pages: `home.md`, `modules.md`, `pricing.md`, `faq.md`, `contact.md`, and `legal/*.md`.
- Composer writes to `<public>/_generated/`. Do not overwrite live pages.
