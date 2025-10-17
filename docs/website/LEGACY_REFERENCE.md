---
owner: website
status: active
last_reviewed: 2025-10-17
next_review_due: 2025-11-17
---
# Legacy Reference (Local-only)

Use `_legacy/` to store OLD website backups for reference (copy blocks, styles, fragments).
- This folder is **git-ignored** and should never be pushed.
- Tools may read from `_legacy/` for reference ONLY; do not import files directly into live pages without review.
- If you need to re-use a fragment (e.g., the waitlist box), paste the minimal HTML/CSS into the new site or the content composer.

**How to use**
1) Put your unzipped backup under `_legacy/website-old/`.
2) If you want to import a fragment later, copy just that section into new content/templates.
3) Keep `_legacy/` small - no giant archives. Delete what you don't need.
