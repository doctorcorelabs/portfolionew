# v7 Integration Notes - Hero Collage

## What shipped

Hero now carries a 9-piece research collage around the giant word, between
the grid (z auto) and the word/frame (z 1), below the cursor chips (z 2).
The layer is pointer-dead and aria-hidden, so frame drag still works and
no card is interactive. Cards float on desynced translateY loops (9-16s)
and the whole layer parallaxes plus/minus 8px on mouse devices only
(rAF-throttled, off on touch and under prefers-reduced-motion).

Desktop scatter (top band): DockingCard left, DnaHelix, ReviewCard,
PosterCard right. Bottom band: FaersCard left, GutAxisCard,
PhotoCard centered, AwardsCard, StrokeCard right. Cards:

- FaersCard: N = 6,601 plus the 7,519 reports to 6,601 analysis set flow,
  labeled hypothesis-generating. No effect value, CI, or p-value anywhere.
- DockingCard: abstract in silico pocket plus ligand schematic, labeled
  illustrative. No real molecule, no compound name, no numbers.
- GutAxisCard: Microbiome, Gut, Immune, Blood theme chain, labeled
  research theme plus illustrative schematic. No results or claims.
- ReviewCard: qualitative SR funnel (Identification, Screening,
  Synthesis) for PCOS, Bisphenol A, Gut axis. No counts anywhere, plus an
  "Illustrative schematic" footer (added at integration, see G1).
- PosterCard: poster title, ABST-000034, Hypertension Seoul 2026,
  N = 6,601. No effect values.
- AwardsCard: recorded aggregates only, 29 awards and 12 international,
  decorative medal dots. No award names.
- StrokeCard: education-first stroke learning lab, Observation Sheet,
  No score, No diagnosis. No detection or diagnosis language.
- PhotoCard: AI lab ambience photo (/hero-lab.jpg, 1920x1280), captioned
  "IN THE LAB" plus "Illustrative ambience". It never claims a real lab.
- DnaHelix: purely decorative SVG double helix, aria-hidden, no text.

## QA gaps fixed at integration (parent, no new agents)

- 02-G1 (accuracy, blocking): ReviewCard had no honesty microcopy. Added
  one 10px mono footer line, "Illustrative schematic".
- 04-G1 (visual, blocking): GutAxisCard had no explicit width and
  overlapped PhotoCard below about 1700px. Fixed with width 230 plus a
  new hide rule below 1400px (mv-collage-hide-1400).
- 04-G2 (visual, blocking): mobile stack showed 3 cards (DockingCard
  lacked the mobile-hide class). Added mv-collage-mobile-hide to the
  docking item, so mobile is FaersCard then PhotoCard only, as briefed.
  The header comment is accurate again after this fix.
- 04-G3 (visual, blocking): helix (150 wide, 375 tall) intruded into the
  word band at desktop heights. Shrunk to width 100 and hidden entirely
  on short stages (mv-collage-hide-short, viewport height 700px and
  below). Residual tuck under the frame edge at mid heights is a
  documented limitation below, not a cover: the frame paints above it.
- 04-G6 (minor): awards/stroke 12px overlap at widths 1101-1155. Fixed
  by moving the hide-mid breakpoint from 1100px to 1160px.
- Motion G1 (moderate): top-right review/poster overlap below about
  1000px. Fixed with a hide rule for ReviewCard below 1000px
  (mv-collage-hide-1000).
- 04-G8 (minor): mobile stack cards still floated and gap was 12px vs
  the doc 16px. Float disabled inside the mobile media query, gap set
  to 16px.
- 04-G9 (hygiene): raw generated image plus generation JSON removed
  from public/. Only /hero-lab.jpg ships as a collage asset.
- 02-G2 (provenance): 7,519 previously traced only to
  docs/faers-verification.md. Added totalReports: 7519 to the FaersData
  interface and literal in src/data/content.ts. ResearchDetail renders
  only sampleSize, the aprocitentan cohort, and the honesty note, so
  the new field is inert there.

## Deviations from doc 01 (accuracy-neutral, recorded)

Doc 01 specified a different 9-card set (Seoul congress card with dates,
named award badges, an Amomum schematic, a portrait photo card, a
research threads card). What was built instead: PosterCard (Seoul facts
without venue dates, which live on Works and the research detail page),
AwardsCard (verified aggregates, not named badges), DockingCard (generic
in silico theme, not Amomum-specific), PhotoCard (AI lab ambience, not
/profile.webp), DnaHelix (decorative motif, not a threads card). Two
recorded topics are named on no hero card: TB drug discovery and
Amomum cardamomum / breast cancer. DockingCard covers the drug
discovery method generically; naming TB or Amomum would need a new
caption, not invented data. Left as a follow-up, not silently filled.

## Accepted limitations (not fixed, by decision)

- Short stages (hero height below about 680px): bottom cards may tuck
  into the word text zone (faers about 48px, photo about 53px at the
  550px minimum). The word paints above the collage, so glyphs stay
  legible; no max-height collapse rule was added because it would gut
  the collage on common laptop heights.
- Pill clearance at 700px stage height falls short of doc 01's 40px rule
  (poster/pill 6px, faers/pill 5px, stroke/pill 14px), with real overlap
  only at short stages. Standard stages are clear.
- No live-browser visual check was possible from the sandbox (localhost
  preview is blocked). Mid-width behavior, slide feel, and collage
  overlap must still be confirmed on the user's Netlify preview.
- Touch devices at 720px and wider keep the float loops running
  (transform-only, pointer-dead, harmless). Parallax itself never
  attaches on touch.
- Inner aria-labels on FaersCard, ReviewCard, and the GutAxisCard SVG
  are inert under the layer's aria-hidden. Harmless: every card fact
  duplicates Works, Journey, or an archive page.

## Re-verification by the parent after the fixes

- npx tsc --noEmit: clean, 0 errors.
- npm run build: passes.
- Grep src for em dash: 0. Grep dist for dialkit/DialRoot/useDialKit/
  dial-panel/CanvasPage: 0. Grep Hero plus collage files for marquee,
  scroll-lock, cursor none, scroll-snap, overscroll: 0.
- FAERS numeric check (counts only, masked contexts): the 2 unverified
  numeric tokens produce 9 matches in dist, every one a coincidental
  CSS/style literal (rgba alpha, padding, opacity keyframes, transition
  durations, mask gradients). No drug/outcome/CI structure, not a leak.
  Same verdict pattern as v5 and v6.

## Files changed in v7

- src/sections/Hero.tsx (collage layer, items, breakpoints, parallax)
- src/components/hero-collage/*.tsx (9 components)
- src/data/content.ts (FaersData.totalReports)
- public/hero-lab.jpg (AI lab ambience, the only collage photo shipped)
- docs/hero-collage/01-collage-system.md, 02-accuracy-qa.md,
  03-motion-a11y-qa.md, 04-visual-qa.md, 05-final-qa.md,
  06-integration-v7.md (this file)
