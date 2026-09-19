# SESSION_HANDOFF — strAI.ca

**Last session:** 2026-09-18

## 2026-09-18 — Bilingual copy refresh + positioning (branch `claude/copy-refresh-2026-09-18`, NOT merged/deployed)

Implemented the approved copy refresh end-to-end on a review branch. **`main` and the live
site at strai.ca are unchanged** — this branch was pushed to origin for review only.

**Revised brand hierarchy (now used consistently):**
- Brand: strAI (visible spelling standardized everywhere — titles, meta, nav, headings, form
  copy, assessment copy; was inconsistently "StrAI" before)
- Primary tagline — FR: *L'IA qui enlève du travail, pas du contrôle.* / EN: *AI that takes
  work off your plate—not control out of your hands.*
- Homepage headline — FR: *Moins d'administration. Plus de mission.* / EN: *Less
  administration. More time for your mission.*
- Descriptor — FR: *Automatisation et IA pour les OBNL du Québec* / EN: *Automation and AI
  for Quebec nonprofits*

**Sections changed (index.html):**
- Hero: eyebrow, headline, new `.hero-tagline` between H1 and description, description copy,
  both CTAs (primary now links to `#assessment`, secondary to `#examples`)
- About: eyebrow, heading, lead paragraph (secondary schools/business invitation left as-is,
  per brief)
- Outcomes: EN heading only ("Spend less time on..."), FR heading unchanged per brief
- Process: heading
- Example cards (OrmstownGPT, Automated intake): descriptions
- Why strAI: section label casing, "defined scope and price" item now says human review
  stays essential rather than naming what stays the client's responsibility
- Assessment: final-question hint rewritten, both result-heading labels casing-fixed
  ("A tool strAI could build" / "What strAI would need from you")
- Contact form: heading, dropdown (see below), success message

**Pricing dropdown correction:** the contact form's package dropdown showed *regular* prices
while the pricing cards lead with the *nonprofit* prices — a mismatch. Removed prices from
Ancrage/Momentum/Autonomie entirely; each option now shows its outcome instead (e.g.
"Momentum — Subventions, rapports et suivis" / "Momentum — Grants, reports, and follow-up").
Option `value`s unchanged. (Untouched: the two `cours1`/`cours2` options added 2026-09-17 for
the new `/cours/` page — no pricing mismatch there, out of scope for this brief.)

**SEO/social metadata:** homepage title + meta description (FR/EN) and OG title/description
updated to the new positioning. All three example subpages (`ormstown-observer`,
`ormstowngpt`, `automation`) had their title/meta casing fixed to `strAI.ca`; `automation`'s
meta description was also rewritten from "visible follow-up" to "tracked task" framing
(FR + EN) per the brief. `ormstown-observer`'s and `ormstowngpt`'s EN visible intro copy was
also improved per the brief (FR intros and all other subpage copy left untouched). The
`/cours/` page (added 2026-09-17, not part of this brief) also got its `StrAI.ca` → `strAI.ca`
casing fixed for consistency while in here.

**Minimal CSS change:** added `.hero-tagline` (Orbitron, weight 500, `clamp(1rem, 1.6vw,
1.2rem)`, heading color, 0.02em letter-spacing, `margin-top: 1.4rem`) and reduced
`.hero-sub`'s top margin from `1.8rem` to `1rem` so the tagline and description read as one
hierarchy under the H1. No other design/layout/animation/theme changes.

**Tests performed:**
- `git diff --check` — clean
- `node --check` on `assets/app.js` and `assets/survey.js` — both OK (neither file's content
  was touched; only header comments there still say "StrAI.ca", left alone as non-visible)
- `data-fr`/`data-en` attribute counts matched on every touched page (index.html 194/194,
  cours/index.html 48/48, ormstown-observer 34/34, ormstowngpt 40/40, automation 35/35)
- No duplicate HTML `id`s on any page
- All homepage `#anchor` links (`assessment`, `capabilities`, `contact`, `examples`,
  `forfaits`, `pourquoi`) resolve to an existing `id`
- Language toggle exercised on homepage + all 3 example pages (FR↔EN), confirmed via
  `document.title` and rendered text, not just attribute inspection
- Full 5-question assessment flow run through in FR — result headings and hint text
  confirmed correct; diagnosis body copy (from survey.js) contains no brand-name string to
  fix
- Dark and light themes checked on the homepage hero (including computed styles of the new
  `.hero-tagline`: Orbitron/500/19.2px/white/0.02em/22.4px margin — all match spec)
- Desktop (1440px) and mobile (375px) widths checked on the homepage hero — no overflow on
  the longer FR hero headline or About heading in either width
- Contact dropdown option text confirmed in both languages (FR and EN) — see pricing
  correction above
- Console + network requests checked on every page touched — no errors, no failed requests
- **The contact form was not submitted during testing.**

**Outstanding — do NOT invent, still blocked on business input from Stray** (per the brief;
carries forward the same open list from 2026-07-22/07-24, now scoped as the future FAQ):
1. Workflow / file ownership
2. Portability
3. Third-party subscription fees
4. Data storage or processing
5. Quebec Law 25 compliance
6. Setup timelines
7. Post-support arrangements
8. Google Workspace or Microsoft 365 scope

The FAQ itself was deliberately **not implemented** this session — leave it out until Stray
confirms these facts.

---

## 2026-07-28 — Logo lockup, favicon, light/dark theme toggle (branch `examples-subpages`, NOT deployed)
- **Logo:** text wordmark → four-pill mark + wordmark lockup (nav + footer, all 4 pages);
  shared `.logo`/`.footer-logo` rules in styles.css. New `/favicon.svg` linked site-wide.
- **Light/dark theme toggle:** sun/moon sliding switch in the nav (`.theme-toggle`/`.tt-*`),
  persisted in localStorage as `strai-theme` (default dark), applied via `data-theme` on <html>.
  Light palette = brand light variants (`:root[data-theme="light"]`): accent `#0B6FA8`, teal
  `#0A8FA6` replacing neon cyan, dark type on `#EEF3F9` bg; logo pills recolor to `#0B6FA8`/tip
  `#00AEEF`. Anti-flash inline `<head>` script sets the theme before first paint on every page.
  `app.js` gained `applyTheme()` next to `applyLang()`. Verified both themes render clean via
  headless-Chrome screenshots (hero + OrmstownGPT card/mock contrast checked). Nav "Contacter"
  button now hidden ≤600px (redundant with mobile menu) to make room for the two switches.

## 2026-07-24 — Asset refactor + example subpages (branch `examples-subpages`, NOT merged/deployed)
Two things landed on this branch:
- **Refactor:** index.html inline CSS/JS extracted to `/assets/styles.css`, `/assets/app.js`,
  `/assets/survey.js` (index.html now 680 lines, down from ~2300). app.js is guarded to run
  on homepage + subpages; lang toggle persists via localStorage.
- **Three example subpages built** (design system was already in styles.css): 
  `/examples/ormstown-observer/`, `/examples/ormstowngpt/`, `/examples/automation/`.
  Each: shared nav/footer, bilingual FR/EN, `.subhero` → `.ex-block` problem/how-it-works
  (`.flow` diagram, human step highlighted) → `.example-cta`. Copy expands on the already-approved
  homepage card + survey language only — NO invented metrics or testimonials. Subhero kept
  visible-by-default (no gs-reveal) to avoid any invisible-hero risk.

**OrmstownGPT preview (not yet public):** since OrmstownGPT isn't published, its example page
now shows an *illustrative* product-preview mock (`.gpt-demo` in styles.css) — a static sample
chat exchange with a source-link card — under an "Aperçu / A glimpse" block, framed "beta · not
yet open to the public" and captioned as illustrative. The subhero "See a preview ↓" ghost button
scrolls to it. When OrmstownGPT ships, swap in the live "Ask" URL and drop the coming-soon framing
(TODO comment marks the spot).

**Observer example — DONE:** live "Voir le média ↗ / Visit the newsroom ↗" button now links to
https://www.ormstownobserver.ca (confirmed by Stray 2026-07-28).

**OrmstownGPT roadmap (Stray, 2026-07-28) — before it can be presented as live:**
1. Full data audit — verify every bylaw/regulation in the corpus is the LATEST version.
2. Redesign the interface — Stray is leaning toward making OrmstownGPT its own product with a
   distinct look & feel, separate from the Observer's journalistic identity.
Until then the strai.ca example page stays as the illustrative "beta / not yet public" preview
(that framing is still accurate). Don't flip it to "live" yet. See memory `project_ormstowngpt.md`.
- Still worth confirming the "~130 documents" figure once the data audit runs.
- Any real proof (a quote, a concrete before/after) you're willing to publish — the example
  pages are the natural home for it.

**Next actions:** get URLs above → wire buttons → review branch → merge `examples-subpages` → main → deploy.

---

## 2026-07-22 — Copy pass 2 (deployed, commit 62d009b)
Second messaging-audit copy-only tier: package + retainer cards now LEAD with
the nonprofit price (regular price muted below; FR format "478 $"); removed the
duplicate "Prêt pour la suite?" pitch so the CTA block leads straight into the
contact form; softened over-automatic feature language to human-review framing
(board report / meeting summary / donor thank-yous = drafts validated by team),
including in the survey recommendations; fixed FR anglicisms (Support→Soutien,
Hub→Espace, Pipeline→Processus, Surveillance→Suivi des dates limites, "Tout le
forfait X"); tightened About to the "knowledge → reusable tools" angle instead
of restating the hero; English consistency fixes.

**Open strategic question for Stray (audit 2 raised, not decided):** whether the
permanent 20% "nonprofit discount" should just BECOME the standard advertised
price (with other sectors quoted separately) rather than framed as a discount.

**Still blocked on business facts (do not invent — highest-value next work):**
proof block (case example + testimonial or honest demo), trust/privacy section
+ FAQ (data handling, human review, which subscriptions clients pay for,
account ownership/portability, client time commitment, timelines per package),
funding-program names, per-package "Idéal si / À la fin vous aurez" + scope
limits, whether donor thank-yous / other items are actually auto-sent (I set
them to human-review — correct me if any are truly automated).

## 2026-07-21

## 2026-07-21 — Copy overhaul (deployed, commit 51618be)
Applied the messaging audit's "immediate copy-only" tier: nonprofit-first hero
("Moins de tâches répétitives. Plus de temps pour votre mission."), positioning
statement in About with schools/SMB as secondary path, capabilities → 5 outcome
cards, new 3-step process section, verifiable Why StrAI grid, qualified claims
(Claude context, grant-draft timing, funding eligibility), consultative package
CTAs, "Accompagnement mensuel", new final CTA (30-min call agenda), updated
title/meta/OG. Note: "Smart tools for a connected future" tagline removed per
audit — restorable from git if Stray wants it back as a brand line.

**Still needs business input from Stray (blocked on facts, do not invent):**
proof (case example + testimonial), FAQ answers (privacy/data handling, human
review, third-party subscription costs, ownership/portability, client time
commitment, timelines), funding-program names, whether 20-min draft claim is
demonstrable, per-package "Idéal si / À la fin vous aurez" details.

---

## 2026-07-20 session

## What happened
- Rebuilt the site to the "stealth tech" brand brief (navy #0A0F1C, electric blue #00AEEF, cyan #3DFFF3, Orbitron headings, third-person copy, tagline "Smart tools for a connected future").
- Kept: AI assessment survey (+ new "school" option with its own recommendation), packages/pricing, retainers, Formspree contact form, FR/EN toggle, GSAP + particle animations (recolored).
- Dropped: problem / approach / for-whom / personal-bio sections (per brief's third-person tone). Phone + email kept in contact.
- Fixed a latent bug that made the hero invisible (gsap.from + CSS opacity 0) — it affected the old live site too.
- Footer year updated to 2026.

## State
- **DEPLOYED 2026-07-20**: merged `redesign-stealth` → `main`, pushed, confirmed live at strai.ca.
- Old gold design preserved in git at 62876d8.
- Stray's verdict: "Needs some work, but I like what I see" — expect refinement requests.

## Next actions
1. Collect Stray's refinement notes on the new design.
2. Real submission test of the Formspree form now that it's live.
3. Optional: og:image for social sharing.
