# 10 - Deep Implementation QA

Scope: verify the deep-visual implementation landed by sibling agents
in five section files, plus the existence of the nine deep-analysis
docs. Report only; no site file was edited by this task, and no
production build was run (the parent builds).

Method: polled the work tree until every marker below was present,
then read the implemented code and ran count-only greps per file.
Counts are reported as numbers; no forbidden value is reproduced here.

## Verdict: PASS - missing list empty

Every assigned file contains its assigned new work, every forbidden
pattern grep returns 0, and every edited file handles
prefers-reduced-motion. The nine deep docs all exist.

## Per-file PASS/FAIL table

| File | Assigned work | Result | Evidence |
|---|---|---|---|
| src/sections/Hero.tsx | Drifting cursor chips + floating pills | PASS | 4 chips, 3 pills, all present and animated |
| src/sections/Services.tsx | Gradient animation | PASS | svc-shimmer 18s alternate on highlight layers only |
| src/sections/Works.tsx | Hover wash + arrow | PASS | Wash on hover/focus-within, arrow fades and slides in |
| src/sections/Contact.tsx | Collage pills | PASS | 3 pills, floating, aria-hidden |
| src/sections/Manifesto.tsx | Drift texture | PASS | 22s drift loop, aria-hidden, pointer-events none |
| docs/deep/01-09 | Deep-analysis docs | PASS | All 9 files exist, 261-440 lines each |

## What was verified per file

### Hero.tsx - PASS

- Cursor chips (4): labels FAERS, StrokeSense, Code for Cure,
  Seoul 2026. All are topic/project words. Invented person names: 0.
  Drift durations 9-14s, staggered delays, ease-in-out, infinite.
- Floating pills (3): Hypertension Seoul 2026, Code for Cure,
  FAERS N = 6,601. All repeat facts already shown elsewhere on the
  site; the FAERS figure matches the verified cohort size.
- Safety: the whole diorama wrapper is aria-hidden and
  pointer-events none, so the decoration never intercepts clicks and
  is never read out as content. Chips and pills hide on hover-none
  devices; pills hide below 900px; the diorama is display none under
  prefers-reduced-motion.
- Forbidden greps: em dash 0, unverified FAERS ROR values 0,
  scroll-lock / custom-cursor / marquee code 0, copied reference copy
  or client names 0.

### Services.tsx - PASS

- Gradient animation: svc-shimmer, 18s ease-in-out infinite
  alternate, moves only the two white radial highlight layers
  (background-position shifts). The base blue gradient never moves,
  so white-text contrast is unaffected by the animation.
- Reduced motion: animation none and highlight positions reset.
- Forbidden greps: em dash 0, unverified FAERS ROR values 0,
  scroll-lock / custom-cursor / marquee code 0, copied reference copy
  or client names 0.

### Works.tsx - PASS

- Hover wash: row hover and focus-within set background #EFF4FE,
  a light blue consistent with the plot hover elsewhere on the site.
- Arrow: an arrow glyph sits after each row link, opacity 0 and
  translated 8px right at rest, fading and sliding to place over
  300ms with the spec easing on row hover, focus-within, link hover,
  and link focus-visible.
- Reduced motion: full block disables the reveal, wash transition,
  arrow transition, title shift, and underline draw.
- Forbidden greps: em dash 0, unverified FAERS ROR values 0,
  scroll-lock / custom-cursor / marquee code 0, copied reference copy
  or client names 0.

### Contact.tsx - PASS

- Collage pills (3): Seoul 2026, UII, Code for Cure. All are real
  affiliation/topic words, aria-hidden, floating at 9s, 11s, and 13s
  durations with staggered delays.
- Reduced motion: pills are display none, the dot-field lit layer is
  removed, and the dot-field mask is removed (static faint field).
- Forbidden greps: em dash 0, unverified FAERS ROR values 0,
  scroll-lock / custom-cursor / marquee code 0, copied reference copy
  or client names 0.

### Manifesto.tsx - PASS

- Drift texture: a 900px circular texture layer, aria-hidden and
  pointer-events none, translating -120px / 60px over a 22s
  ease-in-out infinite alternate loop, matching the reference's
  slowly drifting blurred texture. The section clips overflow, so the
  oversized layer cannot cause horizontal scrolling.
- Reduced motion: drift animation none, reveal elements forced
  visible with no transition.
- Forbidden greps: em dash 0, unverified FAERS ROR values 0,
  scroll-lock / custom-cursor / marquee code 0, copied reference copy
  or client names 0.

### docs/deep/01-09 - PASS

- 01-hero-cursors.md (261 lines), 02-hero-diorama.md (336),
  03-services-visual.md (375), 04-quote-dotfield.md (315),
  05-works-deck.md (267), 06-team-visual.md (307),
  07-contact-collage.md (300), 08-motion-system.md (440),
  09-gap-synthesis.md (433). Em dash count is 0 in every doc.
- Doc 01 states its own evidence limits honestly (no live browser,
  no raw HTML view; triangulated from prior internal measurements,
  the parent live-browser observation, and web search with no new
  asset URL found).

## Gap list

None blocking. Two items remain for the parent, both outside this
task's scope:

1. No live-browser visual check was possible from this subagent.
   Code-verified only: chip drift paths and pill placement at
   intermediate viewport widths, shimmer visibility against the blue
   cards, and the wash/arrow feel all still deserve one visual pass
   in a real browser before the parent calls the deep-visual pass
   done.
2. No production build was run, per the task instruction. The parent
   build remains the gate for type errors in the new code.
