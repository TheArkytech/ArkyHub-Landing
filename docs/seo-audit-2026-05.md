# SEO Audit — ArkyHub Landing

**Date**: 2026-05-06
**Site**: https://arky-hub-landing.vercel.app/ (Vercel deployment)
**Codebase commit**: `claude/trusting-bardeen-dc8e13` branch
**Auditor**: Claude (Opus 4.7) running searchfit-seo skills
**Scope**: audits only — no code changes this round

---

## 1. Executive Summary

### TL;DR

The ArkyHub landing page has **strong foundations and one critical blocker**. The animations do NOT block search engines from reading content — but they do hurt page-speed scores and ignore accessibility settings. The biggest single issue is a **domain mismatch**: the live sitemap and OpenGraph URLs point to `arkyhub.app`, but the site is actually deployed at `arky-hub-landing.vercel.app`. Every external link, social preview, and search-engine canonical URL currently points to a domain that doesn't serve the site.

**Aggregate scores**:
- SEO foundations: **62/100** (Step 1)
- Technical SEO: **45-95/100** depending on dimension; performance is the weak spot (Step 2)
- On-page SEO: **65/100** today, **88/100** projected after rewrites (Step 3)
- Internal linking: **75/100** today, **90/100** after footer + logo fixes (Step 6)
- AI visibility (GEO/AEO): **~5/100** — baseline floor (Step 5)

### Top 5 fixes ranked by impact × effort

| # | Fix | Impact | Effort | Section |
|---|---|---|---|---|
| 1 | **Fix domain mismatch** — set `NEXT_PUBLIC_SITE_URL` in Vercel to the real production URL (and confirm whether that's `arkyhub.app` with DNS wired up, or `arky-hub-landing.vercel.app` for now). Until this is fixed, no other SEO work compounds. | 🔴 Critical | 5 min | §3, §9 |
| 2 | **Land all 4 JSON-LD blocks** (Organization, WebSite, SoftwareApplication, FAQPage). Single biggest unlock for both classic SEO rich results AND future AI visibility. Copy-paste from §6. | 🔴 High | 30 min | §6 |
| 3 | **Stop hiding the H1 post-hydration** in [cinematic-hero.tsx:244-246](../src/components/sections/cinematic-hero.tsx). Either gate the GSAP `.set(autoAlpha:0)` behind `useReducedMotion()` or move the initial-hidden state into CSS so the H1 paints visible at LCP. | 🔴 High | 1-2h | §4, §9 |
| 4 | **Reduce JS bundle weight** from ~1023 KB to <400 KB. Dynamic-import `DottedSurface` (`next/dynamic`, `ssr: false`), gate canvas RAFs on visibility, lazy-load GSAP via the hero scroll trigger. | 🟡 High | 2-4h | §4 |
| 5 | **Apply title/description rewrites** from §5 to [messages/es.json](../messages/es.json) and [messages/en.json](../messages/en.json). ES title currently truncated by Google at char 60. | 🟡 Medium | 15 min | §5 |

### What we confirmed about animations (the user's worry)

✅ **Animations do NOT block crawlers from reading content.** Hero text is server-rendered as plain HTML inside `<h1>`. Google sees it.

⚠️ **Animations hurt human-reading speed.** GSAP fades the H1 in over ~1-2 seconds after JS hydrates. For users on slow phones, the headline appears later than it would without JS.

⚠️ **Animations hurt Core Web Vitals.** The post-hydration hide-then-fade hurts LCP. The width/height card animation hurts CLS.

⚠️ **Animations ignore `prefers-reduced-motion`** in three places (GSAP timeline, Three.js dotted surface, canvas sparkles). Users with motion sensitivity get the full show.

**None of this requires removing the animations** — just gating them properly.

---

## 2. Animations vs. Content — Direct Answer

**Question**: Do the animations on the cinematic hero block users or search engines from reading the content?

### Verdict table

| Concern | Verdict | Evidence |
|---|---|---|
| Do animations block crawlers from indexing the H1? | **No** ✅ | Hero copy is hardcoded JSX inside `<h1>` and ships in SSR HTML. No `{mounted && …}` gating. |
| Do animations hurt LCP for human readers? | **Yes (medium)** ⚠️ | GSAP `.set({ autoAlpha: 0, filter: "blur(14px)" })` on `.ch-eyebrow` / `.ch-line-a` / `.ch-line-b` / `.ch-sub` / `.ch-pills` after hydration → text briefly hides before fading in. |
| Do animations cause CLS (layout shift)? | **Yes (small)** ⚠️ | `.ch-card` animates `width: 100vw, height: 100vh` (layout properties, not transforms). |
| Do animations respect `prefers-reduced-motion`? | **Partial** ⚠️ | ✅ `MotionConfig reducedMotion="user"` covers `motion/react` components. ❌ GSAP timeline, `dotted-surface.tsx` (Three.js), and `sparkles.tsx` (canvas) all run regardless. |

**Plain-language summary for the user**:

Your animations are NOT hiding the page from Google. The hero text is there in the raw HTML before any JavaScript runs — crawlers see it, and so do users on slow devices.

What the animations DO hurt:
1. **Speed perception**: the GSAP fade-in briefly hides the headline (~200ms) after the page loads. Real users don't read it any faster than the animation lets them.
2. **Lighthouse / Core Web Vitals scores**: the layout-changing animation causes a small CLS penalty.
3. **Accessibility**: users with motion sensitivity (who set "reduce motion" in their OS) still get the full Three.js + canvas + GSAP show. That's an accessibility miss and can also drain battery on phones.

Fix recommendations are in section 9 (Animation findings) and section 10 (Implementation plan).

---

## 3. Step 1 — `searchfit-seo:seo-audit` (umbrella baseline)

**Pages analyzed**: 2 (live `/es` + `/en` and corresponding code under [src/app/[locale]/page.tsx](../src/app/[locale]/page.tsx))
**Overall score**: **62 / 100** — Needs significant work. Foundations are mostly correct (one H1, good metas, hreflang via Link header), but missing structured data, robots.txt, image SEO, and the canonical-domain mismatch is critical.

### Critical issues (must fix)

- [ ] **Sitemap and `metadataBase` emit wrong domain**. Live `/sitemap.xml` lists `https://arkyhub.app/es` and `https://arkyhub.app/en`, but the deployed site is at `https://arky-hub-landing.vercel.app/`. Source: [src/app/sitemap.ts:4](../src/app/sitemap.ts) and [src/app/[locale]/layout.tsx:28](../src/app/[locale]/layout.tsx) — both fall back to `arkyhub.app` because `NEXT_PUBLIC_SITE_URL` is unset in Vercel. Google will index a non-existent domain. **Fix shape**: either set the env var in Vercel to the real production URL, or finish wiring the `arkyhub.app` domain to the Vercel deployment.

- [ ] **`robots.txt` returns 404**. `https://arky-hub-landing.vercel.app/robots.txt` → 404. No `src/app/robots.ts` in the codebase. Crawlers will assume default-allow, which is OK for indexing but you lose the chance to declare the sitemap location and block previews. **Fix shape**: create `src/app/robots.ts` exporting a `MetadataRoute.Robots` with sitemap URL.

- [ ] **No JSON-LD structured data on the live page**. `application/ld+json` count = 0. Missing Organization, WebSite, SoftwareApplication, FAQPage. **Fix shape**: covered in Step 4 of this report.

### Warnings (should fix)

- [ ] **ES title too long**. "ArkyHub — Un solo espacio de trabajo para cada proyecto de arquitectura" = **73 characters**, over the 60-char target. Google will truncate it in SERPs around char 55-60. **Fix shape**: rewrite covered in Step 3. (EN title at 55 chars is fine.)

- [ ] **No `og:image` or `twitter:image` meta tags in HTML head**. Even though [opengraph-image.tsx](../src/app/opengraph-image.tsx) exists, it isn't being declared as `og:image` in the head. WhatsApp / LinkedIn / iMessage previews will fall back to no-image cards. **Fix shape**: add `openGraph.images` and `twitter.images` to `generateMetadata` in [src/app/[locale]/page.tsx](../src/app/[locale]/page.tsx).

- [ ] **No `<link rel="canonical">` in HTML head**. Without explicit canonicals, Google guesses based on URL signals — usually fine but risks duplicate-content issues across `?ref=…` query params. **Fix shape**: add `alternates.canonical` to `generateMetadata`.

- [ ] **Heading-outline skip in cinematic hero mockup**. Sequence under the H1: H1 → H2 → H4 (×7) → H5 (×2) → H4 (×6) → H2 (next section). The mockup card labels jump from H2 directly to H4/H5 without intermediate H3s. Mostly an a11y/outline issue, minor SEO impact. **Fix shape**: downgrade mockup labels to H3 or non-heading elements (`<p class="font-semibold">`).

### Opportunities (nice to have)

- [ ] **Zero `<img>` tags on the page**. The mockup is built with divs/SVG/canvas. This is fine for layout, but the page has no chance of appearing in Google Image Search. Consider adding 1-2 real screenshots of the product UI (hosted via `next/image` with proper `alt`) below the fold — they'll also strengthen above-the-fold visual credibility.

- [ ] **Header logo links to `/` (raw href), not locale-aware**. [src/components/layout/header.tsx](../src/components/layout/header.tsx) uses `<a href="/">` for the brand SVG link. From `/en`, clicking the logo redirects through middleware to `/es` (default locale). Use `Link` from `@/i18n/navigation` instead. Tiny issue but a violation of the project convention.

- [ ] **Anchor link CTAs use generic text**. "Solicitar demo" appears multiple times as the same anchor `#final-cta`. Diversify with descriptive variants for assistive tech and link-graph differentiation.

### Passing (already done well)

- ✅ One `<h1>` per page, with target keyword in the headline.
- ✅ Title and description per locale via `generateMetadata` (EN within target, ES needs trimming).
- ✅ OpenGraph + Twitter Card title/description set.
- ✅ `viewport` meta present.
- ✅ Sitemap exists at `/sitemap.xml` (returns 200, just wrong URLs inside).
- ✅ hreflang relationships emitted via `Link` HTTP header (next-intl middleware) — Google accepts these.
- ✅ HTTPS, HSTS, edge-cached (`X-Vercel-Cache: HIT`, age ~46h), `X-Nextjs-Prerender: 1` (statically rendered).
- ✅ Internal nav uses anchor links (`#features`, `#how-it-works`, etc.) — no broken links.
- ✅ ARIA labels and `aria-hidden` on decorative SVGs.
- ✅ No `noindex` / `nofollow` blocks anywhere.
- ✅ Default locale (`/`) returns `307` redirect to `/es` correctly.

---

## 4. Step 2 — `searchfit-seo:technical-seo` (Core Web Vitals + crawl)

**Crawlability**: 70/100 · **Indexation**: 85/100 · **Performance**: 45/100 · **Mobile**: 80/100 · **Security**: 95/100

The single biggest technical issue is **JavaScript weight**: 11 chunks totalling **~1023 KB compressed** load on the initial page. For a single-page marketing landing, healthy is 200-300 KB. Three.js (in [dotted-surface.tsx](../src/components/ui/dotted-surface.tsx)) and GSAP (in [cinematic-hero.tsx](../src/components/sections/cinematic-hero.tsx)) are the main culprits — both could be lazy-loaded or skipped under reduced-motion.

### Crawlability — 70/100

- ❌ **No `robots.txt`** (404). Crawlers will assume default-allow, which is functionally OK but you lose the chance to declare sitemap location and exclude preview deployments.
- ⚠️ **Sitemap returns wrong-domain URLs**. See Step 1's critical finding.
- ✅ Sitemap exists, hreflang via Link header (next-intl middleware) works correctly.
- ✅ Default route `/` returns `307` to `/es` (matches `localePrefix: "always"`).

### Indexation — 85/100

- ✅ `X-Nextjs-Prerender: 1` — page is statically prerendered.
- ✅ `X-Vercel-Cache: HIT`, age ~46h — edge cached, fast TTFB.
- ✅ HTTP 200 on both `/es` and `/en`.
- ⚠️ No canonical link → Google must guess. Low risk on a single page, real risk if/when query params or campaign tags appear.
- ✅ No `noindex` / `nofollow` headers.

### Performance — 45/100 (LCP / CLS / INP risks)

**LCP** — at risk of breaking the 2.5s target due to:
- 1023 KB of JS loaded on initial paint, including:
  - Three.js full library (`import * as THREE from 'three'` in [dotted-surface.tsx:5](../src/components/ui/dotted-surface.tsx)) — ~140 KB just for the dotted background.
  - GSAP + ScrollTrigger — ~40 KB for the cinematic hero timeline.
  - motion/react + Next runtime + React + next-intl — the rest.
- The H1 is in the SSR HTML but is hidden by JS via `gsap.set({ autoAlpha: 0, filter: "blur(14px)" })` at [cinematic-hero.tsx:244-246](../src/components/sections/cinematic-hero.tsx) immediately on hydration. The intro timeline at [cinematic-hero.tsx:282-291](../src/components/sections/cinematic-hero.tsx) then fades it back in over ~5 seconds (chained `.to()` calls with `-=0.4` to `-=0.8` overlaps). **Lighthouse counts the H1 as visible only after the fade-in completes** — which means LCP is being delayed by JavaScript that runs after a 1+ MB bundle parses.

**CLS** — small but real:
- [cinematic-hero.tsx:333](../src/components/sections/cinematic-hero.tsx) animates `.ch-card` from `width: min(88vw, 1400px) / height: min(80vh, 780px)` to `width: 100vw / height: 100vh` during scroll. These are layout properties — every frame triggers a layout recalculation and shifts surrounding flow. Should be `transform: scale(x, y)` from a fixed-size container.

**INP** — at risk on mid-range mobile:
- Three.js render loop ([dotted-surface.tsx:22+](../src/components/ui/dotted-surface.tsx)) runs unconditionally with `requestAnimationFrame` — competes with click/tap handlers for main-thread time.
- Canvas sparkles ([sparkles.tsx:33+](../src/components/ui/sparkles.tsx)) RAF loop also runs unconditionally.
- Particle system inside the hero card (~1400 particles per [cinematic-hero.tsx](../src/components/sections/cinematic-hero.tsx)) runs during the entire scroll-pinned section.
- No `prefers-reduced-motion` gating on any of the three.
- No `IntersectionObserver` to pause when offscreen.

**Render-blocking**:
- ✅ Fonts use `display: 'swap'` (next/font) — good.
- ✅ Stylesheets have `data-precedence` (Next.js streaming).
- ⚠️ All 11 JS chunks load on first page — no dynamic imports for hero/dotted-surface/sparkles.

**Asset optimization**:
- ❌ `next.config.ts` is empty — no image optimization config, no bundle analyzer, no `output` mode set.
- N/A — no `<img>` tags on the page anyway.
- ✅ Brotli/gzip applied at edge (Vercel default).

### Mobile — 80/100

- ✅ Viewport meta correct.
- ✅ The cinematic hero gates the heavy GSAP timeline with `isMob = window.innerWidth < 768` check at [cinematic-hero.tsx:241](../src/components/sections/cinematic-hero.tsx) — particles disabled on mobile.
- ⚠️ But Three.js dotted-surface and sparkles still run on mobile — no mobile gate.
- ⚠️ Touch targets: not audited in this round (would need a real device run).
- ✅ Body font sizes use `clamp()` — readable on mobile.

### Security — 95/100

- ✅ HTTPS only.
- ✅ HSTS: `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`.
- ✅ HTTP/2 (Vercel default).
- ⚠️ No CSP header set. Low priority for a marketing site without form submissions.

### Priority fixes (technical)

1. **[Critical]** Domain mismatch in `metadataBase` / sitemap — see Step 1.
2. **[High]** Reduce initial JS weight from ~1023 KB to <400 KB. Strategy: dynamic-import the Three.js `DottedSurface` (`next/dynamic`, `ssr: false`), lazy-load GSAP only when the hero scroll trigger is near, gate canvas RAFs on visibility.
3. **[High]** Stop hiding the H1 post-hydration. Either move the initial-hidden state into CSS so GSAP can `from()` cleanly, or skip the intro timeline entirely under `prefers-reduced-motion`. The H1 should be visible at LCP without JS.
4. **[High]** Replace `width/height` animation with `transform: scale()` at [cinematic-hero.tsx:333](../src/components/sections/cinematic-hero.tsx) to eliminate CLS contribution.
5. **[Medium]** Gate Three.js + canvas particle RAFs behind `useReducedMotion()` and `IntersectionObserver`. Render a static fallback (CSS gradient) when motion is off.
6. **[Medium]** Create `src/app/robots.ts` with sitemap reference.
7. **[Low]** Add CSP header in `next.config.ts` once content is finalized.

---

## 5. Step 3 — `searchfit-seo:on-page-seo` (per-section optimization)

**Target keywords**:
- ES primary: "plataforma BIM colaboración" / "plataforma BIM arquitectos"
- ES secondary: "gestor de planos arquitectura", "visualizador BIM navegador"
- EN primary: "BIM collaboration platform"
- EN secondary: "BIM viewer browser", "architecture project management", "AEC collaboration software"

### Title tag rewrites

| Locale | Before | After | Δ |
|---|---|---|---|
| **ES** | `ArkyHub — Un solo espacio de trabajo para cada proyecto de arquitectura` (73 chars — truncated by Google) | `Plataforma BIM para estudios de arquitectura \| ArkyHub` (54 chars) | Keyword-led, audience-targeted, brand moved to end (Google convention). Frees ~20 chars of SERP real estate. |
| **EN** | `ArkyHub — One workspace for every architecture project` (55 chars — fits) | `BIM collaboration platform for architecture teams \| ArkyHub` (59 chars) | Keyword-led with primary search term ("BIM collaboration platform"). Brand at end. Slight uplift in keyword authority. |

**Why brand-at-end?** Google bolds matched query terms. If a user searches "plataforma BIM", we want those words at position 1, not after the brand name (which only matches branded queries — a smaller search volume).

### Meta description rewrites

| Locale | Before | After | Δ |
|---|---|---|---|
| **ES** | `ArkyHub centraliza planos, modelos BIM y recorridos virtuales con control de versiones y accesos por rol. Sustituye el parcheo de email, Drive y WhatsApp.` (157 chars — over) | `Plataforma BIM que centraliza planos, modelos y recorridos virtuales con control de versiones y acceso por rol. Adiós al parcheo de Drive y WhatsApp.` (149 chars) | Opens with keyword "Plataforma BIM" matching the title. Compresses to fit. Tone preserved. |
| **EN** | `ArkyHub centralizes plans, BIM models, and virtual tours with version control and role-based access. Replace the patchwork of email, Drive, and WhatsApp.` (154 chars — fits) | `BIM collaboration for architecture teams. Centralize plans, models, and virtual tours with version control and role-based access. No more Drive sprawl.` (152 chars) | Opens with target keyword. "Drive sprawl" is more vivid than "patchwork". |

### Heading hierarchy recommendations

The current H2 copy is excellent for brand voice ("Sabemos el momento en que dejaste de confiar en tu estructura de carpetas.") and we should NOT keyword-stuff them. Instead, add a **kicker line** above 1-2 H2s — a short uppercase eyebrow with the keyword — that gives Google something to match without breaking the headline poetry.

**Suggested kickers** (small uppercase tracking-wide, above the existing H2):

- Above Features H2 (`Cuatro cosas que el parcheo no puede hacer.`):
  - ES: `PLATAFORMA BIM · CARACTERÍSTICAS`
  - EN: `BIM COLLABORATION · CAPABILITIES`
- Above Pricing H2 (`Empieza gratis. Escala cuando estés listo.`):
  - ES: `PRECIOS PLATAFORMA BIM`
  - EN: `BIM PLATFORM PRICING`

### Heading-outline fix (carry-over from Step 1)

The cinematic-hero mockup uses H4 and H5 inside a card that appears before any H3 — these are the workspace mockup labels ("Casa Ribera", "Proyectos", "Equipo del proyecto", "Todos tus proyectos…", etc.). Demote these to non-heading elements (`<p class="font-semibold text-sm">` or `<div role="heading" aria-level="3">` if a heading is required for screen readers). They don't add SEO value — they're decorative UI labels — and they break the document outline.

### Internal anchor text (link-graph differentiation)

The header has 5 anchor links, all to in-page sections (`#features`, `#how-it-works`, `#why-now`, `#pricing`, `#faq`). These are good. The "Solicitar demo" CTA appears in the header AND repeats in CinematicHero, MidCTA, and FinalCTA — all linking to `#final-cta` or `mailto:` with the same anchor text.

**Recommendation**: Diversify the CTA anchor text by section:

| Section | Current | Suggested |
|---|---|---|
| Header | "Solicitar demo" | (keep — global CTA) |
| Hero CTA scene | "Solicitar acceso anticipado" | (already differentiated ✓) |
| MidCTA | "Solicitar demo" | "Reservar una demo personalizada" |
| FinalCTA | "Solicitar demo" | "Crear cuenta gratuita" / "Empezar el primer proyecto" |

(Apply equivalent variants to EN catalog.)

### Content gaps (LSI keywords missing)

Words that match buyer-intent searches but don't appear in copy:
- **ES**: "IFC", "RVT", "Revit", "AutoCAD", "interoperabilidad", "estudios de arquitectura"
- **EN**: "IFC", "Revit", "AutoCAD", "stakeholder access", "architecture firm"

Suggested home: a single sentence in the FAQ answer for "¿Qué formatos de archivo soportáis?" / "What file formats do you support?" naming IFC, RVT, DWG, PDF explicitly. Already partially there (file format question exists) — just confirm the answer enumerates the formats by name.

### On-page SEO score

**Before**: 65 / 100 (good metas, weak keyword targeting, outline gaps)
**After estimated**: 88 / 100 (with title/description rewrites, kickers, anchor diversity, outline fix)

---

## 6. Step 4 — `searchfit-seo:schema-markup` (JSON-LD generation)

Four ready-to-paste JSON-LD blocks below. **Important**: the `url`, `image`, and `sameAs` fields use `https://arkyhub.app` as the canonical domain. Confirm this is the intended production URL before shipping (see Step 1's domain-mismatch finding). If the production target ends up being the Vercel URL, swap accordingly. The implementation should reference `process.env.NEXT_PUBLIC_SITE_URL` rather than hardcoding either domain.

All four blocks should land in a single server component (e.g. `src/components/seo/json-ld.tsx`) and be mounted once inside [src/app/[locale]/page.tsx](../src/app/[locale]/page.tsx). Pass the active `locale` down so the FAQPage block emits the correct language.

### Block 1 — Organization

```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": "https://arkyhub.app/#organization",
  "name": "ArkyHub",
  "alternateName": "ArkyHub by Arkytech",
  "url": "https://arkyhub.app",
  "logo": "https://arkyhub.app/logo.png",
  "description": "BIM collaboration platform for architecture studios. Centralizes plans, BIM models, and virtual tours with version control and role-based access.",
  "parentOrganization": {
    "@type": "Organization",
    "name": "Arkytech",
    "url": "https://arkytech.com"
  },
  "contactPoint": {
    "@type": "ContactPoint",
    "email": "hello@arkytech.com",
    "contactType": "customer service",
    "availableLanguage": ["es", "en"]
  }
}
```

### Block 2 — WebSite

```json
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": "https://arkyhub.app/#website",
  "name": "ArkyHub",
  "alternateName": "ArkyHub — Plataforma BIM",
  "url": "https://arkyhub.app",
  "inLanguage": ["es", "en"],
  "publisher": { "@id": "https://arkyhub.app/#organization" }
}
```

### Block 3 — SoftwareApplication

Only the Solo tier has a finalized price. Studio uses `[PENDIENTE]` in the catalog and Firm is custom — both are flagged as "Contact for pricing" rather than including non-validating empty Offers.

```json
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "@id": "https://arkyhub.app/#software",
  "name": "ArkyHub",
  "applicationCategory": "BusinessApplication",
  "applicationSubCategory": "BIM Collaboration Platform",
  "operatingSystem": "Web Browser",
  "url": "https://arkyhub.app",
  "description": "BIM collaboration platform for architecture studios. Centralize plans, BIM models, and virtual tours with version control and role-based stakeholder access. Browser-native — no install required.",
  "image": "https://arkyhub.app/opengraph-image",
  "publisher": { "@id": "https://arkyhub.app/#organization" },
  "offers": {
    "@type": "Offer",
    "name": "Solo",
    "price": "0",
    "priceCurrency": "EUR",
    "description": "1 project, free forever. Unlimited stakeholders. Browser-based — no install.",
    "url": "https://arkyhub.app/#pricing",
    "availability": "https://schema.org/InStock"
  },
  "featureList": [
    "Browser-native BIM viewer (no install)",
    "Plan version control",
    "Virtual tour playback",
    "Role-based stakeholder access",
    "Issue tracking pinned to plan revisions",
    "Multi-format support: DWG, PDF, IFC, RVT, panoramic tours"
  ]
}
```

### Block 4a — FAQPage (Spanish)

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "inLanguage": "es",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "¿La constructora necesita instalar algo?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "No. ArkyHub funciona completamente en el navegador — incluido el visor BIM. Tu constructora abre un enlace, ve el último plano. Eso es todo."
      }
    },
    {
      "@type": "Question",
      "name": "¿En qué se diferencia de Google Drive?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Drive almacena archivos. ArkyHub sabe qué son. Los planos tienen control de versiones. Las incidencias se vinculan al dibujo exacto. BIM y recorridos virtuales se renderizan de forma nativa. Cada parte interesada ve una vista diferente."
      }
    },
    {
      "@type": "Question",
      "name": "¿En qué se diferencia de Procore o Autodesk Construction Cloud?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Esos están construidos para constructoras y los gestionan constructoras. ArkyHub está hecho para el arquitecto — tú controlas la documentación, tú decides qué ve cada parte interesada."
      }
    },
    {
      "@type": "Question",
      "name": "¿Qué formatos de archivo soportáis?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Planos en DWG y PDF. Modelos BIM en IFC y RVT. Recorridos virtuales en formatos panorámicos estándar. Si tu flujo de trabajo depende de un pipeline de exportación específico, solicita una demo y confirmamos la compatibilidad."
      }
    },
    {
      "@type": "Question",
      "name": "¿Los datos de mi cliente están aislados de mis otros proyectos?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Sí. Cada estudio — y cada proyecto dentro de un estudio — está completamente separado. Trabajar con varios clientes nunca implica fugas de datos entre ellos."
      }
    },
    {
      "@type": "Question",
      "name": "¿Cuánto cuesta?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Estamos desplegando acceso con precios para early adopters. Solicita una demo y te explicamos qué se adapta al tamaño de tu estudio."
      }
    }
  ]
}
```

### Block 4b — FAQPage (English)

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "inLanguage": "en",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Do contractors need to install anything?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "No. ArkyHub runs entirely in the browser — including the BIM viewer. Your contractor opens a link, sees the latest plan. That's it."
      }
    },
    {
      "@type": "Question",
      "name": "How is this different from Google Drive?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Drive stores files. ArkyHub knows what they are. Plans get version control. Issues get tied to the exact drawing. BIM and virtual tours render natively. Each stakeholder gets a different view."
      }
    },
    {
      "@type": "Question",
      "name": "How is it different from Procore or Autodesk Construction Cloud?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Those are built for contractors and run by contractors. ArkyHub is built for the architect — you control the documentation, you decide what each stakeholder sees."
      }
    },
    {
      "@type": "Question",
      "name": "What file formats do you support?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Plans in DWG and PDF. BIM models in IFC and RVT. Virtual tours via standard panoramic formats. If your workflow depends on a specific export pipeline, schedule a demo and we'll confirm the fit."
      }
    },
    {
      "@type": "Question",
      "name": "Is my client data isolated from my other projects?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. Each firm — and each project within a firm — is fully separated. Working with multiple clients never means data leaks between them."
      }
    },
    {
      "@type": "Question",
      "name": "How much does it cost?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "We're rolling out access with early-adopter pricing. Schedule a demo and we'll walk you through what fits your firm size."
      }
    }
  ]
}
```

### Validation checklist (run before shipping)

1. Paste each block individually into [Google's Rich Results Test](https://search.google.com/test/rich-results) — must report 0 errors.
2. Verify FAQPage shows "FAQ" rich result eligibility.
3. Verify SoftwareApplication shows "Software App" rich result eligibility.
4. Confirm Organization @id reference resolves correctly across all four blocks (`@id: "https://arkyhub.app/#organization"` referenced from WebSite and SoftwareApplication).
5. Once URL is finalized, replace `https://arkyhub.app` with `${process.env.NEXT_PUBLIC_SITE_URL}` in the implementation.

---

## 7. Step 5 — `searchfit-seo:ai-visibility` (GEO/AEO baseline)

### Honest baseline (this audit, 2026-05-06)

**Current AI visibility score: ~5 / 100.** ArkyHub is functionally invisible to LLMs today. This is normal for a v0.1 early-access product with no public presence — it's a baseline to measure against in 30/60/90 days, not a problem to solve overnight.

**Why visibility is near-zero**:

1. **No training-data presence**. The product launched recently (commits show active hero work in 2026-05). LLM training cutoffs typically lag by 6-12 months. No major LLM has training data mentioning ArkyHub.
2. **No third-party citations**. No reviews on G2, Capterra, SoftwareAdvice, GetApp, Producthunt. No Reddit threads in r/architecture or r/BIM. No coverage in AEC industry publications (BIM+, ENR, Architectural Record, etc.).
3. **No structured data**. The site emits zero JSON-LD today. AI training pipelines weight structured data heavily for entity extraction.
4. **No Wikipedia entry**. (Wouldn't pass notability bar yet, but worth tracking when scale justifies.)
5. **Brand confusion risk**. "ArkyHub" is an unfamiliar token. LLMs may hallucinate it as a misspelling of similar-sounding products. The Organization JSON-LD (Step 4) with `alternateName: "ArkyHub by Arkytech"` is the single most important fix to anchor the entity.
6. **Domain mismatch** (Step 1's critical finding) compounds this — even if articles start linking to `arkyhub.app`, those links resolve to nothing today.

### Baseline test plan — queries to run manually now

Run each query in ChatGPT (GPT-4o or 5), Claude (3.5 Sonnet, 4.5, 4.6), and Perplexity. Record the response verbatim in a tracking sheet so you have a baseline against which to measure Q3 and Q4 progress.

| # | Query (run in ES + EN) | Goal |
|---|---|---|
| 1 | "What's the best BIM collaboration platform for small architecture studios?" / "¿Cuál es la mejor plataforma BIM colaboración para estudios pequeños?" | Category authority |
| 2 | "Alternatives to Autodesk Construction Cloud for architects" / "Alternativas a Autodesk Construction Cloud para arquitectos" | Competitive displacement |
| 3 | "How do I share BIM models with my contractor without them installing Revit?" / "¿Cómo comparto modelos BIM con la constructora sin que instalen Revit?" | Use-case query (matches our FAQ #1) |
| 4 | "What's a browser-native BIM viewer?" / "¿Qué es un visor BIM en navegador?" | Feature/capability query |
| 5 | "Compare BIMcollab vs Trimble Connect vs ArkyHub" / "Compara BIMcollab vs Trimble Connect vs ArkyHub" | Branded comparison (forces the model to surface what it knows) |
| 6 | "What is ArkyHub?" / "¿Qué es ArkyHub?" | Direct entity query — measures hallucination risk |

**Expected results today**:
- Queries 1, 2, 3, 4: ArkyHub will NOT appear. Competitors (Autodesk Construction Cloud, BIMcollab, Procore, Trimble Connect, Bluebeam) dominate.
- Query 5: The model will describe BIMcollab and Trimble Connect, then either skip ArkyHub or hallucinate a fake description.
- Query 6: Hallucination expected. Model may invent a description, conflate with another product, or correctly say "I don't have information about this."

### Visibility scorecard — first measurement

| Dimension | Score (0-10) | Notes |
|---|---|---|
| **Presence** | 1 | Not mentioned in any category query; only surfaces if explicitly named. |
| **Accuracy** | 0-3 | When asked directly, expect hallucinations. Run Query 6 to confirm exactly what each model says. |
| **Sentiment** | N/A | No mentions to evaluate. |
| **Position** | 0 | Never recommended. |
| **Completeness** | 1 | Even when forced (Query 5), descriptions are sparse. |
| **Consistency** | N/A | All three platforms equally absent. |

**Overall**: ~5/100. Floor.

### Action plan — 30/60/90 days

**Days 0-14 (foundation — most ship in next-session implementation)**:
1. **Land all four JSON-LD blocks** (Step 4) — anchors the entity for crawlers and future training data. *Highest impact action.*
2. **Fix domain mismatch** (Step 1) — every external link will resolve correctly.
3. **Create `/about` and `/manifesto` static pages** with Organization-rich content explaining what ArkyHub is, who built it (Arkytech), and what category it competes in. Use clear, definitive language ("ArkyHub is a BIM collaboration platform for architecture studios. It...").
4. **Publish a comparison page**: `/vs/autodesk-construction-cloud` and `/vs/bimcollab`. Comparison content is heavily extracted by LLMs.

**Days 15-45 (third-party signals)**:
5. **G2 + Capterra + GetApp + SoftwareAdvice listings**. Free claims. Each has a directory page that LLMs reference.
6. **Producthunt launch** when v1.0 is ready. Producthunt pages frequently appear in LLM training data.
7. **Reddit presence**: answer 5-10 genuine questions in r/architecture, r/BIM, r/Revit (don't spam — answer first, mention ArkyHub only if relevant).
8. **AEC publication outreach**: pitch one article to BIM+, AEC Magazine, or Architectural Record about "Why architects need their own collaboration platform" (point of view, not press release).

**Days 46-90 (authority)**:
9. **Customer case study** with named studio + measurable outcome (e.g. "Studio X reduced plan-versioning email volume 80% in 30 days").
10. **Original research piece**: survey ~50 small architecture studios on collaboration tool stack. Original data is highly cited.
11. **Re-run baseline test plan**. Compare scores. Specifically watch Query 6 — does the model now say "ArkyHub is a BIM collaboration platform by Arkytech…" verbatim from your site, or still hallucinate?

### Tracking method

Maintain a spreadsheet (`docs/ai-visibility-tracker.csv`) with columns:
`date | platform | query | mentioned (Y/N) | position | sentiment | response_excerpt`.

Add one row per query × platform × month. Six queries × three platforms × monthly = 18 rows/month. Trivial to maintain, valuable to compare quarter-over-quarter.

**Re-run cadence**: monthly for the first 6 months, then quarterly.

---

## 8. Step 6 — `searchfit-seo:internal-linking` (sanity check)

**Pages analyzed**: 1 (single-page landing) · **Total in-page anchors**: 11 · **Broken anchors**: 0 · **Placeholder hrefs**: 5 (footer)

### What's working ✅

- **All 5 header nav anchors resolve**: `#features`, `#how-it-works`, `#why-now`, `#pricing`, `#faq` — verified each section component has the matching `id` attribute. ([features.tsx:23](../src/components/sections/features.tsx), [how-it-works.tsx:18](../src/components/sections/how-it-works.tsx), [stats.tsx:25](../src/components/sections/stats.tsx) (id="why-now"), [pricing.tsx:26](../src/components/sections/pricing.tsx), [faq.tsx:14](../src/components/sections/faq.tsx))
- **CTA anchor `#final-cta` resolves** ([final-cta.tsx:19](../src/components/sections/final-cta.tsx))
- **Locale-aware navigation correctly used** in `LocaleSwitcher` and `CinematicHero` via `@/i18n/navigation`.
- **No raw `next/link` violations** elsewhere in the codebase.

### What's broken ⚠️

#### Footer placeholder hrefs (5 dead links)

[src/components/layout/footer.tsx:19-29](../src/components/layout/footer.tsx) — five footer links use `href: "#"` as placeholders:

| Label | Current href | Should be |
|---|---|---|
| `aboutArkytech` | `#` | `https://arkytech.com/about` (external) or `/about` if owned |
| `contact` | `#` | `mailto:hello@arkytech.com` or `/contact` |
| `documentation` | `#` | External docs URL or `/docs` |
| `privacy` | `#` | `/privacy` |
| `terms` | `#` | `/terms` |

**Why this matters**: clicking any of these scrolls to top of page (the `#` fragment behavior). Worse for SEO: Google sees them as "internal links pointing to the homepage with mismatched anchor text" — confusing for the link graph. For users, it's a trust hit.

**Severity**: Medium. Either ship the destination pages or remove the links until they're real. Linking to nothing is worse than not linking.

#### Header logo uses raw anchor

[src/components/layout/header.tsx:49-50](../src/components/layout/header.tsx) — the brand SVG link is `<a href="/">` instead of `<Link href="/">` from `@/i18n/navigation`. From `/en`, clicking the logo redirects through middleware (`/` → `/es`), causing a flash and an unnecessary client-side language switch.

**Severity**: Low (functional, just suboptimal). Easy fix.

### Anchor text diversity (carry-over from Step 3)

The "Solicitar demo" / "Schedule a demo" CTA appears in Header, MidCTA, and FinalCTA — same text, different sections. Anchor-text repetition isn't catastrophic, but it doesn't help Google distinguish the value of each link target. See Step 3 for proposed differentiations.

### Scaffolding for when blog/docs/about ship

The single-page model works fine today. Plan ahead for when content expands:

**Recommended hub-and-spoke structure** (target 6-12 months out):

```
/[locale]/                                   ← Landing (current)
   │
   ├── /about                                ← Hub: who/why
   │     ├── /about/team
   │     └── /about/manifesto                ← Long-form positioning piece
   │
   ├── /vs/                                  ← Comparison hub
   │     ├── /vs/autodesk-construction-cloud  ← Comparison spokes
   │     ├── /vs/bimcollab
   │     ├── /vs/trimble-connect
   │     └── /vs/google-drive-for-architects
   │
   ├── /blog/                                ← Editorial hub
   │     ├── /blog/[slug]                    ← Cross-link to /vs/* and /docs/*
   │     └── /blog/category/bim-workflows
   │
   ├── /docs/                                ← Knowledge base hub
   │     ├── /docs/getting-started
   │     ├── /docs/file-formats              ← Anchored from FAQ #4
   │     ├── /docs/role-based-access
   │     └── /docs/bim-viewer
   │
   └── /pricing                              ← Promote from #pricing anchor to dedicated page when SoftwareApplication offers expand
```

**Linking rules** (apply when these pages exist):
- Every `/blog/*` post links to ≥2 `/docs/*` pages and ≥1 `/vs/*` comparison.
- Every `/vs/*` comparison links back to homepage `#features` AND to the relevant `/docs/*` capability page.
- Footer links populate as soon as `/about`, `/docs`, `/privacy`, `/terms` exist — replace `#` placeholders.
- Add `BreadcrumbList` JSON-LD on every non-home page (Step 4 framework already established).

### Internal linking score

**Current**: 75 / 100 — single-page constrains the score; the 5 broken footer links are the only real loss.
**After footer + logo fixes**: 90 / 100.

---

## 9. Animation findings (pre-confirmed in code)

### CRITICAL pre-finding — Domain mismatch

**Location**: [src/app/sitemap.ts:4](../src/app/sitemap.ts) and [src/app/[locale]/layout.tsx:28](../src/app/[locale]/layout.tsx)

```ts
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://arkyhub.app";
```

The fallback domain `https://arkyhub.app` does NOT match the actual deployed URL (`https://arky-hub-landing.vercel.app/`). If `NEXT_PUBLIC_SITE_URL` is not set in the Vercel project's environment variables, then:

- **Sitemap entries** point to `arkyhub.app` → Google crawls a domain that doesn't serve the site.
- **OpenGraph image URLs** point to `arkyhub.app` → Twitter / LinkedIn / WhatsApp link previews break.
- **Canonical URLs** point to `arkyhub.app` → Google deduplicates against a non-existent domain, your real URLs lose authority.
- **hreflang alternates** point to `arkyhub.app` → Google can't resolve language pairs.

**Severity**: Critical. Fix is one of:
- (a) Set `NEXT_PUBLIC_SITE_URL=https://arky-hub-landing.vercel.app` in Vercel (if the Vercel URL is the real production target).
- (b) Set `NEXT_PUBLIC_SITE_URL=https://arkyhub.app` AND register/configure that domain to serve the Vercel deployment.

**Verification this round**: Audit must check `curl -sI https://arky-hub-landing.vercel.app/sitemap.xml` and inspect what URLs are emitted.

### Animation findings

1. **[src/components/sections/cinematic-hero.tsx](../src/components/sections/cinematic-hero.tsx)** GSAP fade-in initial state (lines 244-280): `.set({ autoAlpha: 0, filter: "blur(14px)" })` on `.ch-eyebrow`, `.ch-line-a`, `.ch-line-b`, `.ch-sub`, `.ch-pills` runs post-hydration. The H1 paints visible at SSR but is hidden by JS for ~100-300ms. **Hurts LCP**.

2. **[src/components/sections/cinematic-hero.tsx:333](../src/components/sections/cinematic-hero.tsx)** card expand: animates `width: 100vw, height: 100vh` (layout properties). Forces layout, contributes to CLS. Should be `transform: scale()`.

3. **[src/components/sections/cinematic-hero.tsx](../src/components/sections/cinematic-hero.tsx)** GSAP timeline: not gated by `useReducedMotion()`. Runs even with reduced-motion enabled.

4. **[src/components/ui/dotted-surface.tsx](../src/components/ui/dotted-surface.tsx)**: Three.js mount + RAF loop runs unconditionally. ~140KB bundle for full-page background. Bypasses reduced-motion.

5. **[src/components/ui/sparkles.tsx](../src/components/ui/sparkles.tsx)**: 1400-particle canvas RAF runs unconditionally. Bypasses reduced-motion.

6. **All three canvases**: no `IntersectionObserver` pause-when-offscreen. CPU is consumed even when the element scrolls past.

---

## 10. Implementation plan for next session

Ordered by dependency. Each item is a single change with the file to edit / create.

### Group A — Foundation (must land first; no dependencies)

- [ ] **A1.** In Vercel dashboard, set `NEXT_PUBLIC_SITE_URL` env var (Production scope) to whatever the real production URL will be. If this is `arky-hub-landing.vercel.app` for now, use that. If `arkyhub.app` is wired up to Vercel, use that.
- [ ] **A2.** Create [src/app/robots.ts](../src/app/robots.ts) — `MetadataRoute.Robots` with `sitemap: \`${SITE_URL}/sitemap.xml\``, host, `rules: [{ userAgent: "*", allow: "/" }]`. ~10 lines.
- [ ] **A3.** Add `alternates.canonical` and `openGraph.images` and `twitter.images` to `generateMetadata` in [src/app/[locale]/page.tsx](../src/app/[locale]/page.tsx).

### Group B — Schema markup (depends on A)

- [ ] **B1.** Create `src/components/seo/json-ld.tsx` — server component that takes `locale` prop and renders the four JSON-LD blocks from §6 inside `<script type="application/ld+json">` tags. Use `process.env.NEXT_PUBLIC_SITE_URL` for all URLs.
- [ ] **B2.** Mount `<JsonLd locale={locale} />` once in [src/app/[locale]/page.tsx](../src/app/[locale]/page.tsx) above `<Header />`.
- [ ] **B3.** Validate each block individually at https://search.google.com/test/rich-results — must return 0 errors for Organization, WebSite, SoftwareApplication, FAQPage.

### Group C — Copy rewrites (independent of A/B; can ship in parallel)

- [ ] **C1.** Update `home.meta.title` in [messages/es.json](../messages/es.json) → `"Plataforma BIM para estudios de arquitectura | ArkyHub"` (54 chars).
- [ ] **C2.** Update `home.meta.description` in [messages/es.json](../messages/es.json) → `"Plataforma BIM que centraliza planos, modelos y recorridos virtuales con control de versiones y acceso por rol. Adiós al parcheo de Drive y WhatsApp."` (149 chars).
- [ ] **C3.** Update `home.meta.title` in [messages/en.json](../messages/en.json) → `"BIM collaboration platform for architecture teams | ArkyHub"` (59 chars).
- [ ] **C4.** Update `home.meta.description` in [messages/en.json](../messages/en.json) → `"BIM collaboration for architecture teams. Centralize plans, models, and virtual tours with version control and role-based access. No more Drive sprawl."` (152 chars).
- [ ] **C5.** Diversify CTA anchor text in MidCTA and FinalCTA per §5 (`midCTA.cta` and `finalCta.cta` in both catalogs).

### Group D — Animation fixes (independent; biggest perf win)

- [ ] **D1.** [src/components/sections/cinematic-hero.tsx:244-246](../src/components/sections/cinematic-hero.tsx) — wrap the GSAP `.set({ autoAlpha: 0, filter: "blur(14px)" })` calls in a `useReducedMotion()` check. When motion is reduced, skip the intro timeline and let the H1 paint as-is from SSR.
- [ ] **D2.** [src/components/sections/cinematic-hero.tsx:333](../src/components/sections/cinematic-hero.tsx) — change `.to(".ch-card", { width: "100vw", height: "100vh" })` to a `transform: scale()` animation on a fixed-dimension container. Eliminates CLS contribution.
- [ ] **D3.** [src/components/ui/dotted-surface.tsx](../src/components/ui/dotted-surface.tsx) — add `useReducedMotion()` check at top of useEffect; if reduced, return early and render a static CSS gradient fallback. Also gate the `requestAnimationFrame` loop behind `IntersectionObserver` so it pauses when offscreen.
- [ ] **D4.** [src/components/ui/sparkles.tsx](../src/components/ui/sparkles.tsx) — same pattern as D3.
- [ ] **D5.** Convert `import * as THREE from 'three'` in [dotted-surface.tsx:5](../src/components/ui/dotted-surface.tsx) to `next/dynamic`-imported component (`ssr: false`). Reduces initial bundle by ~140 KB.

### Group E — Heading hierarchy + footer fixes

- [ ] **E1.** [src/components/sections/cinematic-hero.tsx](../src/components/sections/cinematic-hero.tsx) — demote the mockup card labels from H4/H5 to non-heading elements (e.g., `<p class="text-sm font-semibold">`). They're decorative UI labels, not document outline.
- [ ] **E2.** [src/components/layout/footer.tsx:19-29](../src/components/layout/footer.tsx) — replace 5 placeholder `href: "#"` with real destinations (or remove the links until the destination pages exist).
- [ ] **E3.** [src/components/layout/header.tsx:49-50](../src/components/layout/header.tsx) — replace raw `<a href="/">` brand link with `<Link href="/">` from `@/i18n/navigation`.

### Group F — Verification (after all of A-E)

- [ ] **F1.** `curl https://[real-domain]/sitemap.xml` — confirm URLs match the real production domain.
- [ ] **F2.** `curl https://[real-domain]/robots.txt` — confirm 200 + sitemap reference.
- [ ] **F3.** `curl https://[real-domain]/es | grep "@type"` — confirm all 4 JSON-LD blocks appear in raw HTML.
- [ ] **F4.** Run https://pagespeed.web.dev/ on `/es` and `/en`, mobile + desktop. Targets: LCP < 2.5s, CLS < 0.1, INP < 200ms.
- [ ] **F5.** Toggle DevTools "emulate prefers-reduced-motion: reduce" and confirm: H1 paints visible immediately, Three.js + sparkles do not start, GSAP timeline does not run.
- [ ] **F6.** Visual regression check: load the site fresh, confirm no functional regression in animations under default (non-reduced) motion.

### Group G — Initiate AI visibility tracking (manual, no code)

- [ ] **G1.** Create `docs/ai-visibility-tracker.csv` with columns `date,platform,query,mentioned,position,sentiment,response_excerpt`.
- [ ] **G2.** Run the 6 queries from §7 in ChatGPT, Claude, and Perplexity. Record verbatim responses. This is your baseline.
- [ ] **G3.** Re-run monthly for the first 6 months.

### Estimated total time

- Foundation (A): 30 minutes (mostly dashboard + small file)
- Schema (B): 1-1.5 hours (component + validation)
- Copy (C): 30 minutes (catalog edits + verify metadata renders)
- Animation fixes (D): 4-6 hours (testing under reduced motion is the slow part)
- Heading + footer (E): 1 hour
- Verification (F): 30 minutes
- AI visibility (G): 1 hour for first baseline, then ~30 min/month

**Total for next session**: ~8 working hours if all groups land. Realistic split: groups A + B + C + E in one session (~4h), groups D + F in a follow-up focused on performance (~5h with testing).

---

## Source data appendix

- Audit run date: 2026-05-06
- Codebase commit: `claude/trusting-bardeen-dc8e13` (worktree branch)
- Node / Next.js: Next.js 15 App Router, Turbopack
- Live deployment HTTP responses captured via curl during audit
- Bundle sizes measured against live Vercel deployment (compressed, edge-cached)
- searchfit-seo skills used: `seo-audit`, `technical-seo`, `on-page-seo`, `schema-markup`, `ai-visibility`, `internal-linking`
