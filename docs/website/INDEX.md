---
owner: website
status: active
last_reviewed: 2025-10-17
next_review_due: 2025-11-17
---
# Clockwork Venue - Website Project Index

Read in this order:
1) ./PLAYBOOK.md
2) ./PRD.md
3) ./SELECTORS.md
4) ./CONTENT_MODEL.md
5) ./ROADMAP.md

Notes:
- Static-first on Firebase Hosting; minimal JS.
- Changes must be surgical and additive.
- Use selector hooks; don't remove them without an alias.
- No hosting/DNS changes without explicit approval.

## Swap to Live (Preview First)
- Generate site: `npm run website:compose`
- Quick check: `npm run website:smoke`
- Swap homepage (backs up live): `npm run website:swap:home`
- If needed, revert: `npm run website:swap:home:revert`
- Create a feature branch and deploy a Firebase preview channel to review before merging.
