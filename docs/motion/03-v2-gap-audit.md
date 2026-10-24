# 03 - Gap Audit: Motion v2 vs Onlines

Scope: production v2 only (`src/sections/*.tsx`, `src/pages/*.tsx`,
`src/components/*.tsx`, `src/App.tsx`, plus the shared styles those files
load in `src/main.tsx`). DEV-only canvas code (`src/dev/`) is excluded.
Method: grep for `animation`, `transition`, `@keyframes`,
`IntersectionObserver`, `onScroll`, and hover rules, then read every hit
in full. FAERS data and plot logic were not touched; this file is an
audit only.

Sources for the Onlines column:

- `research/03-onlines-layout.md`: facts read from production CSS and
  live page fetch on 24 Oct 2026. Motion facts verified there: hero
  grid fade-in 0.8s, selection-box opacity transition 1000ms, button
  hover transitions 0.4s, Lenis smooth scroll, custom cursor SVG,
  hero scroll lock. Motion on Onlines is described there as spare and
  slow (0.4s to 1s), no decorative animation chains.
- `research/05-onlines-interaksi-motion.md`: motion catalog with
  evidence tiers. (T) = observed from fetched page text, (I) =
  inference from comparable editorial sites, not yet verified live,
  (R) = recommendation for DaivanLabs, not a claim about Onlines.
- `docs/motion/01` and `docs/motion/02`: TBD. Neither file exists yet
  at audit time, so no value is taken from them and nothing here
  pretends otherwise.
- Live-browser verification of Onlines hover, scroll reveal, and
  marquee speed is still outstanding (research/05 section 12). Any
  Onlines value marked (I) below must be re-checked live before it is
  treated as fact.

Headline finding: v2 motion exists in three islands only (Hero, Works,
Contact). Everything between them is static. A shared motion
foundation exists (`src/styles/motion.css`, `src/hooks/useReveal.ts`)
but almost none of it is wired to any rendered element.

## What v2 already does (passes, keep these)

- Hero (`src/sections/Hero.tsx`): frame fade-in 0.8s ease-out, with a
  `prefers-reduced-motion` override. The 0.8s timing matches the
  Onlines hero grid fade-in timing from research/03.
- Works (`src/sections/Works.tsx`): per-row reveal via
  IntersectionObserver (threshold 0.15, rise 500ms, stagger 60ms per
  row), row-hover title shift 4px in 300ms, link underline sweep
  300ms, full reduced-motion block. This is the closest match in v2
  to research/05 pattern B2 (row shift 4-8px, underline sweep).
- Contact (`src/sections/Contact.tsx`): IntersectionObserver reveal
  (threshold 0.2, once), giant title word-by-word rise 900ms with
  0/90/180ms stagger, body fade 700ms, social links stagger
  650/750/850ms, mailto underline sweep 400ms on hover, full
  reduced-motion block.
- Global links (`src/styles/global.css`): color transition 400ms on
  `a`, turning blue on hover. The 400ms duration matches the Onlines
  button hover transition (0.4s) from research/03.
- Smooth anchor scrolling: `html { scroll-behavior: smooth; }` in
  global.css, with `auto` under reduced motion.
- Reduced motion is handled in four places (global.css, motion.css,
  Hero, Works, Contact). No scroll lock and no custom cursor anywhere
  in v2, which matches the deliberate deviations recorded in
  research/03 section 13 (both Onlines behaviors were rejected for
  accessibility). Their absence is a pass, not a gap.
- Motion tokens already exist and match the reference timing:
  `--duration-hover: 400ms`, `--duration-fade: 800ms`,
  `--ease-out: cubic-bezier(0.22, 1, 0.36, 1)` (research/05 section 7
  uses the same bezier).

## Gap table

| v2 element | Current motion | Onlines equivalent | Severity |
|---|---|---|---|
| Quote section (`src/sections/Quote.tsx`) | NONE. No reveal, no rule draw-in, no hover. | Reveal: fade plus translateY 16-24px, 500-700ms, stagger 60-90ms, once via IntersectionObserver (research/05 section 4, I/R). Dashed rule draw-in scaleX 600-800ms (research/05 A2, R). | high |
| Services section, dark 3-column (`src/sections/Services.tsx`) | NONE. Grid is layout-only CSS, no reveal, no column hover. | Same reveal pattern as Quote (research/05 section 4, I/R). | high |
| Manifesto section, dark (`src/sections/Manifesto.tsx`) | NONE. Numbered rows are static. | Same reveal pattern (research/05 section 4, I/R). | high |
| Profile section (`src/sections/Profile.tsx`) | NONE. Anchor numbers are plain text rows, no count-up. | Same reveal pattern (research/05 section 4, I/R). Count-up 900-1200ms only for verified data (research/05 A4, R). Count-up is optional here because the numbers are anchors, not KPIs. | high for reveal, low for count-up |
| Affiliations wordmark wall (`src/sections/Affiliations.tsx`) | NONE. No hover rule of any kind. | Wall itself is static in the recommendation: academic names sit in a still grid, not a moving marquee (research/05 section 5.1, R). Missing only the hover: hovered name to full opacity, others dimmed to 0.4, 200ms, no scale (research/05 section 3.4, I). | low |
| Archive pages: Awards, Experience, Education, Certifications, ResearchIndex (`src/pages/*.tsx`) | NONE. No reveal, no page fade, no row hover beyond the global link color change. | Reveal pattern per section (research/05 section 4, I/R) plus page cross-fade 320ms (research/05 D3, R). | high |
| ResearchDetail page (`src/pages/ResearchDetail.tsx`) | NONE. Breadcrumb, headings, and FAERS section all render statically. | Same reveal pattern (research/05 section 4, I/R). No accordion exists on the page, so pattern D5 (expandable abstract, 280ms) is not applicable unless collapsible sections are added. | medium |
| FAERS forest plot (`src/components/ForestPlot.tsx`, `src/components/FaersPlotSection.tsx`) | NONE. Static SVG: fixed opacity values, one static rotated marker, no draw-in, no per-study stagger. | No chart exists on Onlines, so there is no Onlines equivalent to copy. The applicable pattern is research/05 C3 (R): confidence intervals grow from the center point, then the estimate dot appears, staggered about 90ms per study, full plot shown at once under reduced motion. | high |
| Marquee / continuous motion element (site-wide) | NONE. No marquee element exists anywhere in production code. | Onlines logo wall existence is observed (T), but whether it moves is unverified from text fetch. Research/05 C1 (R) proposes exactly one slow text marquee for DaivanLabs: linear, 30-45s per loop, pause on hover and focus, static wrapped list under reduced motion. Research/05 section 14 leaves this as a decision for the user, so it is a gap against the motion language, not a confirmed Onlines behavior. | medium |
| Header (`src/components/Header.tsx`) | Static. No shrink on scroll, no active-section indicator. Nav hover is color-only via the global link rule. Fixed "Start a conversation" CTA has no hover treatment beyond the global link color change. | Header shrink past 80px scroll, 200ms (research/05 D1, R). Active-section indicator sliding between nav items, 250ms (research/05 D2, R). CTA sweep fill 220-280ms (research/05 B5, R); Onlines button hover is 0.4s (research/03, CSS-observed). | medium |
| Page transitions (`src/App.tsx`) | NONE. Routes swap instantly. The `.mv-page` fade-in class exists in motion.css but is applied to no element. | Page cross-fade 320ms (research/05 D3, R). | medium |
| Smooth scrolling (site-wide) | Native `scroll-behavior: smooth` only, for anchor jumps. | Onlines uses Lenis smooth scroll (research/03, stylesheet-observed). Native smooth is a functional subset: no inertia, no scroll-driven easing. | low |
| Quote dashed rule and section hairlines (site-wide) | Static. No draw-in on any rule or hairline. | Rule grows from the left, scaleX, 600-800ms on section entry (research/05 A2, R). | low |
| NotFound page (`src/pages/NotFound.tsx`) | NONE. Static 404 text. | No Onlines equivalent recorded. Page fade D3 (R) would cover it if page transitions are added. | low |

## Dead motion code (root cause of the gap pattern)

These exist, ship in the bundle, and are used by nothing rendered:

- `src/styles/motion.css`: keyframes `mv-draw-line`, `mv-marquee`,
  `mv-grid-fade`, and `mv-pop` have zero users. Classes `.mv-reveal`
  (with delay variants) and `.mv-page` have zero users.
- `src/hooks/useReveal.ts`: a complete IntersectionObserver reveal
  hook (threshold 0.15, once, safe fallback) imported by no component.
  Contact and Works each re-implemented their own observer instead.
- `src/sections/Works.tsx` is not an example of this: its `wkRise`
  animation and observer are live and working.

Consequence: the three motioned islands each carry their own
one-off implementation (Hero inline keyframe, Works `wkRise`,
Contact `contact-mv-*`), with three different reveal timings
(800ms, 500ms, 700/900ms) and three different stagger schemes.
Nothing enforces the single consistent reveal pattern that
research/05 section 4 calls the main source of the calm feel.

## Deliberately not gaps

- No custom cursor, no hero scroll lock: rejected on purpose for
  accessibility (research/03 section 13). Do not re-add them to
  close a perceived gap.
- No bounce, spring, card lift, glow, parallax, or preloader: all on
  the research/05 section 10 reject list, and consistent with the
  user's earlier rejection of generic template motion.
- No count-up on Profile numbers unless the user wants it: the
  numbers are recorded anchors, and research/05 A4 restricts count-up
  to real data, which these are, but the effect is decorative here.

## Notes for the motion build tasks

1. The highest-value fix is wiring one shared reveal (the existing
   `useReveal` plus `.mv-reveal`) into Quote, Services, Manifesto,
   Profile, Affiliations, and the five archive pages, and deleting
   the one-off implementations or aligning their timings to it.
2. The FAERS plot animation must be built without touching plot
   values or gate logic: animate only opacity and transform of
   already-verified rows.
3. Marquee, header shrink, active-section indicator, and page
   transition are each one small addition, but each needs a user
   decision first where research/05 marks it as such (marquee in
   particular, research/05 section 14 item 1).
4. Audit state is as found at write time. If sibling motion tasks
   land changes after this file, re-run the grep set in the Scope
   section before treating this table as current.
