# Final QA: Cochrane swap (hero logo set)

## Verdict: PASS

The current Cochrane slot (left 20%, top 15%) has no blocking
gap, and every check in the brief passes. The visual QA (04)
blocking gap (Cochrane occluding the helix at the old left 29%
slot) is closed by the relocation: Cochrane no longer sits
inside the helix box at all. Code inspection only; no live
browser was used (the sandbox blocks localhost preview), so
every number below is modeled from source, not observed on
screen.

## QA chain and the status of each report

- 02 accuracy: PASS (real Cochrane lockup, zero endorsement
  wording, zero sciencedirect in src/, exactly four logo files).
- 03 motion/a11y: PASS (distinct float pairs, tilt on wrapper
  only, reduced-motion gating, no double render at the time).
- 04 visual: FAIL on the old slot (left 29%, top 3%): the opaque
  tile covered about 85% of helix ink. That slot is gone.
- 05 visual re-QA: NOT AVAILABLE to this check. It was still
  running in parallel and no 05 file existed in
  docs/hero-cochrane/ when this report was written, so the
  current slot was judged from source here, not from 05.
- This report (06): PASS on the current tree.

## The 66% slot is not shipped anywhere

The rejected left 66% slot appears only as rejected history:
the explanatory comment above the db-cochrane item in Hero.tsx
("left 66% sat inside the review card span (right 27%)") and
docs/hero-cochrane/01-integration.md Slot 2 ("REJECTED BY THE
PARENT, never shipped"). No file claims 66% as a current or
shipped position. The shipped slot is left 20%, top 15%.

## Tree verified

- db-cochrane: left 20%, top 15%, tile 69 wide x 82 tall,
  tilt card-d (+1deg), float 14s / 2.1s, hide mobile-hide +
  hide-1400 + hide-750. Visible only above 1400px width AND
  above 750px viewport height (i.e. stages above 650).
- hide-750 is a real stylesheet rule: `@media (max-height:
  750px) { .mv-collage-hide-750 { display: none; } }`.
- Neighbors confirmed from source: db-scopus left 20% top 3%
  (tile 100 wide, about 50 tall: 24 art + 24 padding + 2
  border); helix left 27% top 2%, width 100, 250 tall, no tilt
  class; docking 230 wide at left 2.5% top 3%, about 146 tall
  (svg 200x118 on a 204 inner width plus padding and border),
  tilt card-a (-3deg); search window left 36% top 2%, width
  260; review card right 27% top 3%.
- Model used: stage H = 100dvh - 100px; frame band is the
  centered 273px block (frame top (H-273)/2); glyphs are 171px
  tall centered in the 227px frame, so glyph top is frame top
  + 28px; float amplitude 8px, tilt extension about 2.5px
  absolute (parallax moves the whole layer, so it cancels for
  relative gaps and only the 18.5px absolute budget applies
  against the frame).

## (a) Per-file table

- Hero.tsx: PASS. The db-cochrane item, the portrait-lockup
  comment, the hide-750 rule, and the header visibility
  accounting are all correct for the current slot. One minor
  doc-accuracy note (non-blocking, see observations): the
  comment's Scopus-gap figures (28px at stage 700, 34px at
  stage 800) differ from this check's recomputation (34px and
  46px); the comment understates the gap, i.e. the conservative
  direction, and the safety conclusion stands under both
  models.
- DbLogoFloat.tsx: PASS. Cochrane config is correct: tile
  69 x 82, art 56px, artMaxWidth 44, mid shadow (0 8px 20px
  rgba(1, 1, 1, 0.14)) matching the other wordmarks, object-fit
  contain, no transform/animation/transition on the tile.
- DbLogoRow.tsx: PASS. Cochrane is the last row tile
  (PubMed, Elsevier, Scopus, Cochrane), src
  /logos/cochrane.png, same tile behavior as the other logos.
- docs/logo-sources.md: PASS. Cochrane entry records the
  provenance (embedded PNG inside Commons file Cclogo.svg,
  22 January 2020 revision, "with permission from Cochrane"),
  the portrait-lockup note, the trademark caveat (the Commons
  public-domain mark covers copyright only, not trademark
  rights), and nominative-only framing with no endorsement,
  affiliation, indexing, or partnership claim. ScienceDirect
  is marked REMOVED 24 Oct 2026, not shipped.

## (b) Import contract: PASS

- Hero.tsx imports DbLogoFloat and DbLogoRow and renders
  DbLogoFloat brand "cochrane" through the module-level
  DbCochraneFloat wrapper (item db-cochrane, once), and
  DbLogoRow through db-row (once).
- Zero dangling imports: grep for DbSciencedirect,
  db-sciencedirect, DbStackCard, LogoTiles returns 0 in src/.
- public/logos/ contains exactly four files: cochrane.png,
  elsevier.png, pubmed.png, scopus.png. No ScienceDirect file
  remains on disk.

## (c) TypeScript: PASS

`npx tsc --noEmit` runs clean, 0 errors, on the current tree.

## (d) Greps over Hero.tsx + hero-v8 files: PASS

- Em dash: 0. En dash: 0.
- Forbidden patterns (marquee, scroll-lock / scrollLock,
  cursor none, scroll-snap, overscroll, Lenis): 0.
- Endorsement / indexing wording (endors, affiliat, indexing,
  indexed, partner, sponsor, powered by, collaboration): 0 in
  rendered text and in the checked files.
- "sciencedirect" (case-insensitive) in src/: 0.

## (e) FAERS masked check: PASS, no leak

Method: loaded docs/faers-verified.json, took the 2 rows with
status != "verified", checked their ror/ciLow/ciHigh numeric
fields as standalone numbers in the changed files. Results:
Hero.tsx 9 hits, all pre-existing style and animation math
(fade delays, percentage positions, float durations and
delays, anchor and parallax math, transitions); DbLogoFloat
0 hits; DbLogoRow 0 hits; docs/logo-sources.md 0 hits. Masked
contexts show no drug, outcome, or interval structure. No
unverified value is printed in this report.

## (f) Reduced-motion gating covers the new item: PASS

- The `@media (prefers-reduced-motion: reduce)` stylesheet
  block sets `animation: none` on both .mv-collage and
  .mv-collage-float. The Cochrane item renders through the
  same mv-collage-float wrapper class as every other collage
  item, so it is covered with no new code.
- The JS parallax path gates on reduced motion (returns early
  on match, and requires hover plus fine pointer), so no
  parallax motion reaches the Cochrane tile for
  reduced-motion users.
- Under reduced motion the Cochrane tile renders at rest with
  its static +1deg tilt, the same treatment as every other
  tilted item. This re-verifies 03's finding on the current
  tree.

## (g) Full hide audit: PASS, no double render

All 19 items audited by hideClass:

- Below 720px width: hidden are every mobile-hide item
  (docking, helix, review, poster, gutaxis, awards, stroke,
  db-pubmed, db-elsevier, db-scopus, db-cochrane), every
  hide-1400 item (search, posterwindow, desk), and every
  hide-mid item (microscope, stickers). Visible are exactly
  faers (no hide class), notify (hide-720-1160 does not cover
  below 720px), and db-row (hide-min-720 does not cover below
  720px). Mobile stack is exactly FaersCard, NotifyBubble,
  DbLogoRow, in DOM order.
- Widths 720-1400px: db-row hidden (hide-min-720);
  db-cochrane, db-elsevier, db-scopus hidden (hide-1400);
  db-pubmed visible. Exactly 1 logo.
- Widths above 1400px, viewport heights above 750px: all four
  logo floats visible.
- Widths above 1400px, viewport heights at or below 750px:
  db-cochrane hidden by hide-750; 3 logos visible.
- Boundary checks: 719/720px is clean (row only below, floats
  only at and above, with hide-1400 still suppressing
  Cochrane/Elsevier/Scopus until 1401px); viewport 750/751px
  is clean (Cochrane hidden at and below 750px, shown above).
- No width/height renders any logo twice: the Cochrane float
  (width above 1400px and viewport above 750px) and the
  Cochrane row tile (width below 720px) are mutually
  exclusive, and the four floats are distinct brands.

## (h) Header comment visibility accounting: PASS

The Hero header comment now reads: 1 logo visible at
720-1400px (PubMed only, all heights); 4 above 1400px at
viewport heights above 750px (PubMed, Cochrane, Elsevier,
Scopus); 3 above 1400px on viewports at or below 750px
height, where Cochrane hides via hide-750; plus the
mobile-only logo row. That matches the audited hide rules
exactly. Carried pre-existing caveat, unchanged from 04:
"18 visible on desktop" holds only as "18 desktop items",
since no single width shows all 18 at once (hide-1400 items
and the mobile-only row are mutually exclusive).

## Slot geometry (current slot, modeled)

- Scopus to Cochrane (vertical, same left column): gap =
  0.12H - 50 (Scopus bottom 0.03H + 50, Cochrane top 0.15H).
  At rest: 46px at stage 800, 34px at stage 700, 28.1px at
  stage 651 (shortest shown stage). At worst float phase
  (relative float 16px + tilt about 1.5px): about 10.6px at
  stage 651, about 16.5px at stage 700. The gap never closes
  at any shown stage, and the 24px rule holds at rest from
  about stage 617 up. Tilt signs alternate correctly (Scopus
  card-c -1deg, Cochrane card-d +1deg). PASS.
- Cochrane to helix (horizontal): box gap = 0.07W - 69:
  29.1px at 1401, 31.8px at 1440, 36.0px at 1500, 65.4px at
  1920, at rest; tilt-adjusted (Cochrane +1deg extends its
  left edge about 0.7px, helix has no tilt) about 28.4px at
  1401. Ink gap (helix ink starts 20px inside its box, per
  04) about 49.1px at 1401. The 24px rule holds at every
  visible width. The vertical bands overlap, but the
  horizontal separation is the binding separator, and the
  helix is visible whenever Cochrane is (helix hides at
  viewport heights 700px and below, Cochrane at 750px and
  below, and both require widths above 1400px). The 04
  blocking occlusion is fully closed. PASS.
- Cochrane to docking (horizontal): docking right edge =
  0.025W + 230, Cochrane left = 0.20W, gap = 0.175W - 230:
  15.2px at 1401, 22.0px at 1440, 27.3px at 1470, 32.5px at
  1500, at rest; tilt-adjusted (docking card-a -3deg extends
  its right edge about 3.8px, Cochrane +1deg extends its left
  edge about 0.7px) about 10.7px at 1401, about 17.5px at 1440,
  about 22.8px at 1470, about 28px at 1500. The vertical bands
  overlap (docking about 146 tall from top 3%, Cochrane 82
  tall from top 15%), so the horizontal gap is binding.
  Result: daylight, never a touch, at every width; below the
  24px rule at 1401 to about 1452 (rest) / about 1470
  (tilt-adjusted). NON-BLOCKING near-miss, the same class as
  v10's accepted Elsevier desk-side 15-24px band, and already
  documented in the builder comment ("clears the docking card
  by 15px there (near-miss, full clearance above about
  1470px)").
- Cochrane to frame and glyphs: clearance to the frame top
  edge = 0.35H - 218.5: 9.4px at rest at stage 651, 26.5px at
  stage 700, 61.5px at stage 800; at the 18.5px absolute peak
  budget: -9.1px at stage 651, 8.0px at stage 700, 43.0px at
  stage 800. So at float peaks in the stage 651-677 band only,
  the tile bottom grazes up to about 9px into the frame's top
  edge zone (dashed border; the frame paints above the
  collage, so the dashed line stays visible over the tile).
  Glyph clearance is a further 28px: 37.4px at rest and
  18.9px at peak at stage 651, 54.5px / 36.0px at stage 700.
  Glyphs are never touched at any shown stage, even at peaks.
  NON-BLOCKING (border-zone graze only, same accepted class
  as v10's frame grazes and the helix tuck). Optional
  hardening, parent's choice, not required: raise hide-750 to
  hide-780 (hide at viewport heights 780px and below, i.e.
  stages 680 and below) for peak-clean frame clearance at all
  shown stages.
- Cochrane to search window: gap = 0.16W - 69 = 155px at
  1401, larger above. PASS.
- Cochrane to review card, poster window, desk, stroke,
  gutaxis, faers: separated by hundreds of pixels in the
  other band or column. PASS.
- PubMed alone bottom-center: the retired ScienceDirect slot
  has zero references in src/; removing it leaves no visual
  hole (it was an added tile, not a layout anchor). PASS.
- Mobile row: order PubMed, Elsevier, Scopus, Cochrane;
  geometry carried from 04 (253.5-263.5px against the 272px
  column at a 320px viewport, one row; wraps below about
  312px viewport, never overflows). The row code is unchanged
  since 04, so its math stands. PASS with the carried
  legibility caveat from 04: at 20px row art the Cochrane
  wordmark is about 3.5px and illegible on its own; in the row
  Cochrane reads via its neighboring wordmarks and via the
  desktop presentation, not standalone. Non-blocking.

## Observations (non-blocking)

- Docking near-miss band (1401 to about 1470px, tilt-adjusted)
  as detailed above: daylight, documented, no fix required.
- Frame-border graze at peaks in the stage 651-677 band (up to
  about 9px into the dashed border zone, glyphs at least about
  19px clear): documented, no fix required; hide-780 is the
  optional hardening.
- Builder comment Scopus-gap figures (28px at stage 700, 34px
  at stage 800) vs this check's recomputation (34px, 46px):
  the comment understates the gap and is conservative for the
  rule claim; the conclusion (gap never closes, rule holds at
  rest from stage 700 up) stands under both models. Correcting
  the two numbers in the comment is optional.
- "18 visible on desktop" header caveat carried from 04, as
  noted in (h).
- Row legibility caveat carried from 04, as noted above.

## Still owed (live confirmation, not defects)

Desktop above 1400px, the 1401-1450 width band (thinnest
docking gap), the 720-1160 band, short stages (including the
750/751px viewport boundary where Cochrane appears and the
651-677 stage band where the frame graze peaks), the mobile
stack at 320px and below, and the Cochrane tile in real
collage context (including how the 69x82 portrait tile reads
next to Scopus in the left column).
