# ArkyHub Brand Strategy — Documentation Index

This folder contains the foundational brand and messaging documents for **ArkyHub**, the first product of the Arkytech ecosystem. These documents are the **single source of truth** for how ArkyHub is positioned, described, and communicated — across the landing page, pitch decks, sales conversations, and any external-facing material.

---

## Relationship with CLAUDE.md

This project has two governing documents that operate on **different planes** — they do not compete with each other:

| Document | Domain | What it decides |
|----------|--------|----------------|
| `CLAUDE.md` (project root) | **Technical decisions** | Stack, security, component architecture, animations, code conventions |
| `docs/brand/README.md` (this file) | **Messaging decisions** | What to say, in what order, against what we compete, narrative and copy |

**If there's an apparent conflict, there is no real conflict** — one document decides *how to build*, the other decides *what to say*. For example, CLAUDE.md may specify a particular animation library, while this folder specifies the headline text that animation brings to life. They are complementary layers.

---

## Documents in This Folder

| File | Framework | Purpose |
|------|-----------|---------|
| `arkyhub-positioning-statement.md` | April Dunford — *Obviously Awesome* | Defines **what ArkyHub is**, **who it's for**, and **against what it competes**. Provides the headline, subheadline, and tagline for the landing page. |
| `arkyhub-brandscript-sb7.md` | Donald Miller — *Building a StoryBrand* | Defines **the narrative** ArkyHub tells: problem → guide → plan → CTA → stakes → success. Provides the structure and copy for the full landing page scroll. |

---

## How to Use These Documents for the Landing Page

The two documents are **complementary, not redundant**. Each one resolves a different part of the landing page. Use them together as follows:

### Above the Fold → Use the Positioning Statement

The first thing the visitor sees (before scrolling) must pass the **"grunt test"** — can a caveman understand what this is in 5 seconds? This is pure positioning, not storytelling.

Take from `arkyhub-positioning-statement.md`:

- **Headline / Tagline** → from the "Tagline (above the fold)" section
- **Subheadline** → from the "One-liner (elevator)" section
- **Framing** → from the "Competitive Alternatives" section (the real competition is email + Drive + WhatsApp, not other SaaS)

### Everything Below the Fold → Use the BrandScript

Once the visitor starts scrolling, the landing page must tell a story. Follow the SB7 framework exactly, in order. Each element of the framework maps to a section of the page:

| Page Section | BrandScript Element | Source |
|-------------|---------------------|--------|
| 1. Hero Section | CHARACTER — the hero's desire | Section 1 of BrandScript |
| 2. Problem Section | PROBLEM — three levels + villain | Section 2 of BrandScript |
| 3. About / Guide Section | GUIDE — empathy + authority | Section 3 of BrandScript |
| 4. How It Works | PLAN — three simple steps | Section 4 of BrandScript |
| 5. Primary CTA Block | CALL TO ACTION | Section 5 of BrandScript |
| 6. Stakes / Why Now | FAILURE — what's at stake | Section 6 of BrandScript (includes validated industry data with sources) |
| 7. Transformation Section | SUCCESS — before/after | Section 7 of BrandScript |
| Final CTA | CALL TO ACTION (repeated) | Section 5 of BrandScript |

---

## Precedence Rules (If There's a Conflict)

If the two documents ever seem to contradict each other, follow these rules:

1. **For the headline / tagline above the fold** → the Positioning Statement wins
2. **For the narrative flow and emotional messaging** → the BrandScript wins
3. **For the target customer definition** → the Positioning Statement wins (it's more specific about firm size and decision maker)
4. **For the problem framing** → the BrandScript wins (three levels of problem is richer than Dunford's framework)
5. **For industry data and statistics** → only use what's in the BrandScript's "Validated Industry Data" table, with its sources

---

## Target Customer (Unified)

Pulling from both documents, the customer to address in all messaging:

- **Firm type:** Architecture firms, 5–50 people, managing multiple concurrent projects with external stakeholders
- **Decision maker:** Firm owner or principal architect
- **Daily user:** Project manager or project architect
- **Current workflow:** Patchwork of email, Google Drive / Dropbox, and WhatsApp
- **Trigger moment:** A project where version confusion caused a costly mistake

---

## What NOT to Do

- ❌ Do not invent statistics or industry data — use only what's in the BrandScript table, with sources
- ❌ Do not position ArkyHub against Procore, Autodesk Construction Cloud, or BIM 360 — the real competition is the patchwork, not other SaaS
- ❌ Do not use technical jargon from the PRD (multi-tenant, RLS, role-based access control) in customer-facing copy — translate to plain language
- ❌ Do not mix the Arkytech company narrative with the ArkyHub product narrative — ArkyHub is the product, Arkytech is mentioned only as "the company that built it"
- ❌ Do not skip the "stakes" section of the BrandScript — it's what creates urgency

---

## For AI Assistants Working on This Project

When building or refining the ArkyHub landing page, follow this order:

1. **Read this README first** to understand which document applies to which part of the page
2. **Read `arkyhub-positioning-statement.md`** to get the above-the-fold copy
3. **Read `arkyhub-brandscript-sb7.md`** to get the structure and copy for the scroll
4. **Apply the precedence rules** if anything seems contradictory
5. **Do not add content** that isn't grounded in these two documents — if something is missing, flag it for the human to decide

---

*Last updated: April 2026. Maintained by: Guillermo (Arkytech founder).*
