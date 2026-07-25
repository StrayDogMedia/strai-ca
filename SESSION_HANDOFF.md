# SESSION_HANDOFF — strAI.ca

**Last session:** 2026-07-22

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
