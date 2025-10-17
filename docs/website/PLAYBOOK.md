---
owner: website
status: active
last_reviewed: 2025-10-17
next_review_due: 2025-11-17
---
# Website Engineering Playbook

## Purpose
Owner's manual for the marketing website: structure, copy, selectors, safety.

## Ground rules
- Static-first, minimal JS, brand-safe CSS tokens.
- Public brand: **Clockwork Venue**. App: **Clockwork Venue - Console**.
- Generated pages go to `/_generated` only.
- Propose a short "Approval Plan" in plain English for any non-trivial change; wait for APPROVED.

## CTAs
- Header: **Log in**
- Hero/sections: **Sign up to test**, **Join the waitlist**, **Contact us**

## Testing
- Start with file-based selector smoke; layer Playwright/Chrome Dev MCP later.
