# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

`strai.ca` is a single-page marketing website for a Quebec-based AI consulting service targeting nonprofits (OBNLs) and small businesses. The entire site lives in one file: `index.html` (≈2 360 lines). There is no build system, no package manager, no test suite, and no CI pipeline — it is plain HTML/CSS/JS deployed via GitHub Pages using the `CNAME` record (`strai.ca`).

## Running the site locally

Open `index.html` directly in a browser, or serve it with any static server:

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

There are no install steps, no compilation, and no linting commands.

## File structure

```
index.html   — entire site (HTML + embedded <style> + embedded <script>)
CNAME        — GitHub Pages custom domain: strai.ca
.gitignore   — excludes .DS_Store and .claude/
```

## Architecture of `index.html`

The file is structured in three consecutive blocks:

1. **`<head>` → CSS** (`<style>` tag, lines ~14–1258) — all styles are inline; no external stylesheet.
2. **`<body>` → HTML** (lines ~1260–1858) — seven named sections used as navigation anchors.
3. **`<script>` tag** (lines ~1863–2357) — all interactive behaviour inline.

### Sections and their IDs

| ID | Purpose |
|----|---------|
| `#hero` | Landing headline, CTAs, animated particles |
| `#probleme` | Pain-point cards |
| `#assessment` | 4-step interactive survey with result logic |
| `#approche` | 3-step process walkthrough |
| `#forfaits` | Three pricing tiers + two monthly retainers |
| `#pour-qui` | Target audience (OBNLs vs small business) |
| `#apropos` | About Jesse / Stray Dog Media |
| `#contact` | Contact form (Formspree) + phone/email |

### CSS design system (CSS custom properties)

All colours, fonts, and radii are defined as variables in `:root`. The key tokens:

```css
--golden / --golden-lt   /* primary accent: #D4AF37 / #EDC16A */
--teal / --teal-lt       /* secondary accent: #2A7A6A / #34A08C */
--bg                     /* page background: #1A1A1A */
--surface / --surface-2  /* card backgrounds */
--cream                  /* primary text: #FDFDFA */
--body-text / --muted    /* secondary text shades */
--font-d                 /* Playfair Display (serif, headings) */
--font-b                 /* Inter (sans-serif, body) */
--radius / --radius-sm   /* 20px / 12px */
--max                    /* max content width: 1120px */
```

Always use these variables rather than hardcoded colour values.

### Animation system

- **GSAP + ScrollTrigger** loaded from CDN. Three reveal classes drive scroll animations:
  - `.gs-reveal` — fade up from below
  - `.gs-reveal-left` / `.gs-reveal-right` — slide in from sides
- The hero section animates on page load; all other sections animate on scroll entry (each `ScrollTrigger` is `once: true`).
- Particle canvas (`#particles`) fills the hero section and re-sizes on window resize.
- Cursor glow (`#cursor-glow`) follows the mouse on non-touch devices.

### Bilingual (FR/EN) system

Language state is held in the `lang` variable (default `'fr'`). All user-visible text that needs translation carries two data attributes:

```html
<span data-fr="Texte en français" data-en="English text">Texte en français</span>
```

`applyLang(l)` iterates every `[data-fr]` element and sets `el.innerHTML` to the appropriate attribute. Switching is triggered by `#lang-btn`. When adding or editing content:
- Always add both `data-fr` and `data-en` attributes.
- The initial `innerHTML` of an element should be the French text (default language).
- Form `placeholder` strings are handled separately inside `applyLang()` as special cases, not via data attributes.

### Survey logic (`#assessment`)

The 4-step survey is entirely client-side. State lives in:

```js
let currentStep = 1;          // 1–4
const surveyAnswers = {};     // { stepNum: selectedValue }
```

`selectOption(el)` records the answer and auto-advances after 350 ms. After step 4, `showResults()` calls `getRecommendations()` which branches on `surveyAnswers[1–4]` to return up to 4 recommendation objects (each with `title_fr`, `title_en`, `desc_fr`, `desc_en`).

### Contact form

Uses [Formspree](https://formspree.io) — `action="https://formspree.io/f/mjgpqgkz"`. The fetch submission shows `#form-success` on a 200 response and also on network failure (fallback). No server-side code is involved.

## Responsive breakpoints

- **920 px** — hides desktop nav, shows hamburger; collapses multi-column grids to single column.
- **600 px** — smaller typography, stacked hero CTAs, single-column form rows.

## Deployment

Push to the `main` branch of `straydogmedia/strai-ca`. GitHub Pages serves the root `index.html` automatically. The `CNAME` file routes `strai.ca` to the Pages deployment.
