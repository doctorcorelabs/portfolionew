# v10 reference-fidelity QA: free-floating database logos

Report only. No site edits, no build (read-only `npx tsc --noEmit`
was run: clean, 0 errors). Code inspection plus modeled geometry
only; no live browser check was possible from the sandbox, so every
number below is modeled, not seen, and live confirmation stays owed.

## Scope and sources

- Read: `docs/hero-v10/01-free-placement.md` (it exists, so the
  fallback of judging from Hero.tsx alone does not apply),
  `docs/hero-v8/01-reference-mockups.md` (the reference principles),
  `src/sections/Hero.tsx` (COLLAGE_ITEMS, collage CSS, frame and
  word geometry), `src/components/hero-v8/DbLogoFloat.tsx`,
  `src/components/hero-v8/DbLogoRow.tsx`, and the logo files in
  `public/logos/` (dimensions confirmed: PubMed 372x120, Elsevier
  664x202, Scopus 1000x321, SD icon 32x32).
- Geometry model: stage 1440px wide by 700px tall (an 800px viewport,
  since hero height is `calc(100dvh - 100px)`). The frame is 1160px
  wide centered (x 140 to 1300) and, with the label above it,
  roughly y 259 to 486 on a 700px stage. The word sits inside the
  frame with 28px top and 32px side padding. Percentages in
  COLLAGE_ITEMS are of stage width (left/right) and stage height
  (top/bottom). Tile sizes come from DbLogoFloat: wordmark tiles
  100px (PubMed, Scopus) and 104px (Elsevier) wide, 50px tall (24px
  art + 24px padding + 2px border); SD icon tile 52px by 52px
  (28px art). Card widths used for neighbor math: DockingCard 230,
  GutAxisCard 230 (item width), FaersCard 240, DeskCard 220,
  PosterWindow 280, StrokeCard about 125 tall (estimated from its
  three text blocks plus padding; its width is capped at 260).
- One scoping note: v8 doc 01 section 4.5 forbade database logos
  as app-icon glyphs, but v10 doc 01 section 0 explicitly scopes
  that rule to generic glyph tiles and records that real logo
  artwork was already authorized by the user's v9 request and
  stays authorized here. This report therefore judges placement
  language (scatter, variety, periphery, calm mobile), not the
  v8 icon-content rule. Whether real brand artwork should be used
  at all is accuracy QA's territory, not reference fidelity's.

## Verdict: FAIL (3 blocking gaps, all fixable without new assets)

- G1 (blocking): PubMed and Elsevier form a stacked vertical pair
  at nearly the same x, with a gap below the 40px logo-to-logo
  rule at common laptop heights.
- G2 (blocking): the ScienceDirect icon sits about 630px from the
  nearest wordmark, against the v10 doc section 5 rule of about
  120px. It is orphaned on the right edge and cannot be read as
  ScienceDirect in isolation (the v9 finding).
- G3 (blocking): the mobile row renders logo art at 17px tall,
  below the 20px legibility floor that v10 doc 01 section 6
  restates from v9.
- Non-blocking gaps G4 to G7 and observations follow the item
  verdicts. Nothing else in the v10 placement fails a reference
  principle: the dark card is gone, the four tiles are independent
  (no shared container on desktop), sizes vary, the word still
  dominates, the mix stays mixed, and the mobile stack is exactly
  three entries with the logos row last.

## Item 1: scattered at the periphery, not clustered, not re-boxed

Principle: reference doc 01 section 2.1 (nothing sits square,
scatter breaks the grid), section 2.7 and 5.4 (deliberate overlap
only, bounded at 24px, never over glyphs), section 4.5 (icons float
free in the gutters, never in a row and never in a grid), and v10
doc 01 section 1 (no row, no column, no grid, no shared baseline)
and section 2 (logo to logo at least 40px, logo to card at least
24px, at rest and at float peaks).

Verdict: FAIL (blocking, carried by G1 and G2).

What passes:

- No box regrouping: each logo is its own COLLAGE_ITEMS entry with
  its own position, tilt, and float. The desktop hero contains no
  shared logo container: DbStackCard is deleted, LogoTiles is
  deleted, and grep finds 0 references to either in `src/`. The
  mobile row (DbLogoRow) is hidden on desktop by
  `mv-collage-hide-min-720`, a rule that exists in the stylesheet
  (display none at min-width 720px), so desktop never shows 8 logo
  tiles. No row of four, no grid, no shared baseline on desktop.
- Three of the four placements are genuinely scattered: Scopus at
  left 21 percent, top 3 percent (top band, left); ScienceDirect
  at right 2.5 percent, bottom 33 percent (right edge, mid height);
  PubMed at left 42 percent, bottom 5 percent (bottom band,
  center). All four sit in the top or bottom band, none sits over
  the word or the centered label, and none touches the frame (see
  item 3 for clearances).
- Tilts are all non-zero and within the v10 doc section 4 range
  of -4deg to +4deg (PubMed +2, Elsevier -3, Scopus -1,
  ScienceDirect +3), applied through the Hero item tilt classes
  on the inner wrapper while float stays on the outer wrapper,
  exactly as the reference system requires (tilt and float never
  on the same element). Float durations and delays are all
  distinct pairs (13/0.5, 11/1.3, 15/0.9, 12/1.7), so no two logos
  share a float phase.

What fails (G1): PubMed (left 42 percent, bottom 5 percent) and
Elsevier (left 43 percent, bottom 17 percent) share an x position
to within 1 percent of stage width (about 14px at 1440px) and stack
vertically. Edge-to-edge vertical gap at rest equals 12 percent
of stage height minus the 50px tile height: 34px at a 700px stage,
40px at 750px, 46px at 800px. The v10 doc section 2 bar is 40px at
rest AND at float peaks, and float moves tiles up to 8px in
opposite phases, so the pair needs about 48px at rest to survive
peaks. It therefore fails at rest below about a 750px stage
(about an 850px viewport) and fails at peaks below about a 900px
stage (about a 1000px viewport). At common laptop heights the two
tiles read as a mini-column, which is the proximity regrouping
this round was supposed to end. The pair also shares its gutter
with nothing else, so nothing breaks the column reading.

What fails (G2): ScienceDirect sits in the bottom band, which
satisfies the band half of v10 doc 01 section 5, but its nearest
wordmark edge is about 629px away at 1440px (Elsevier right edge
723, icon left edge 1352; PubMed is 647px away; Scopus is 950px
away). The gap formula is 0.57W - 192, so it stays above 600px at
every width where the icon is visible. Section 5 allows about
120px. The icon is alone on the right edge in a way no reference
icon is: reference icons are self-explanatory glyphs, while this
monogram is not self-identifying (v9 finding), so isolation is
not just a spacing miss, it is a readability miss.

Fix for G1 and G2 (one swap fixes both, no new assets, no copy
change): move the ScienceDirect tile to above PubMed at left 42
percent, bottom 19 percent, and move Elsevier into the icon's
current right-column slot (right 2.5 percent, bottom 33 percent,
keeping the icon's hide classes so visibility stays 2 logos at
720 to 1400px and 4 logos above 1400px). At a 700px stage the
PubMed to icon rest gap becomes 98px minus 50px, which is 48px,
landing exactly on the 40px rule at the worst float peak, and
the icon's frame clearance becomes about 29px (icon top edge
about y 515 against frame bottom about 486). The icon's anchor
becomes PubMed, 48px away, satisfying section 5. The stacked pair
reading remains (same x), but with a rule-meeting gap; if the
parent dislikes any vertical pairing on sight, the alternative is
to move Elsevier to the top band instead and accept re-verifying
every top-band separation, which this report does not recommend
blind, because the top band is already full (docking, helix,
search, review, poster, poster window). Update the Hero comment
if the swap changes the "2 visible at every desktop width"
accounting; under this swap it does not change.

## Item 2: size variety across the four logos

Principle: reference doc 01 section 2.6 (contrast in size creates
a reading order: big elements anchor, small elements decorate)
and section 5.3 (three tiers, no neighbours alike), plus section
4.5 (two icons at different sizes read better than four equal
icons).

Verdict: PASS.

- Wordmark tiles are 100px, 104px, and 100px wide with 24px art;
  the icon tile is 52px square with 28px art. Width contrast is
  about 2 to 1, which is real variety, not four identical tiles.
  Tile heights are uniform at about 50 to 52px, but the variety
  that reads at a glance is width here, and it is present.
- The hierarchy the reference wants holds: giant word (180px type,
  1160px frame) above medium cards (220 to 280px) above logo
  tiles (about 100px) above the icon tile (52px, exactly inside
  the reference app-icon size range of 44 to 56px).
- No anchor tier is used (v10 doc 01 section 3 allows at most one
  logo at up to 32px art). That is optional, not required, and
  skipping it is correct restraint: a larger anchor would push
  the bottom-center tiles closer to the frame and to each other.

Non-blocking note (G6, part): wordmark art is 24px, not the 28px
v10 doc 01 section 3 specifies (tiles about 100 to 104px instead
of about 110 to 120px). This is a doc deviation, not a reference
failure, and this report recommends keeping 24px: raising art to
28px would widen every wordmark tile by about 8 to 10px and push
the PubMed to gut-axis gap (already a near miss, see G4) from
about 15px to about 7px at 1440px. If the parent wants the doc's
28px anyway, positions must move with it and G4 must be rechecked.

## Item 3: the giant word still dominates

Principle: reference hero anatomy (one giant word, everything else
a satellite) and reference doc 01 section 5.4 (overlap never
covers word glyphs) plus v10 doc 01 section 1 (no logo over a
glyph, the frame, or the label, with at least 24px clearance from
the frame edge).

Verdict: PASS.

- No logo is larger than the reference's largest floating element
  relative to the word in any way that competes: the largest logo
  tile is 104px wide against a 180px word inside a 1160px frame,
  and logo art is at most 28px tall against 171px glyphs. The
  tiles read as accents, not rivals.
- No logo sits over the word: the collage layer paints at z-index
  0 below the word and frame at z-index 1, and every logo position
  clears the frame by a modeled margin. On a 1440 by 700 stage:
  PubMed to frame bottom about 130px; Elsevier to frame bottom
  about 45px; Scopus to frame top about 187px; ScienceDirect to
  frame right edge about 52px horizontally (its vertical span
  overlaps the frame's vertical span, but it sits 52px to the
  right of the frame edge, and the word's right glyph edge sits
  a further 32px inside the frame, so glyph clearance is about
  84px). The word center is never covered.
- Caveat, not a gap: these clearances are modeled from the
  centered-frame assumption (section is flex column, centered,
  padding 80px 24px). Font metrics and the drag offset shift the
  frame by a few pixels, but the smallest margin (Elsevier, about
  45px) absorbs that. The live preview should still confirm it,
  as with every round.

## Item 4: the collage still reads as mixed element types

Principle: reference doc 01 section 2 (the interesting hero mixes
windows, bubbles, photos, icons, and schematics; one visual voice
is the v7 monotony diagnosis) and section 4 (each element gets
exactly one mockup type).

Verdict: PASS.

- Desktop above 1400px shows 18 items spanning cards, browser
  windows (search, poster window), photos (microscope, desk),
  bubble (notify), stickers, helix motif, schematics, and the
  four logo tiles. Each logo sits among other types, not in a
  logo-only area: Scopus between docking, helix, and search;
  PubMed between faers, gut axis, and desk; Elsevier between gut
  axis and desk; ScienceDirect between poster window and stroke.
  No separate logo zone exists.
- The one exception is the PubMed and Elsevier pair (G1), which
  is a mini-grouping inside the mix, not a zone. It is counted
  under item 1, not double-counted here.

## Item 5: mobile keeps the reference's calm

Principle: reference restraint (the reference hero never turns
into a wall of small elements) and v10 doc 01 section 6 (one
compact row in the stack, order PubMed, Elsevier, Scopus,
ScienceDirect, after faers and notify, art 20px, tilts 0deg,
floats off, no enclosing box, no label).

Verdict: FAIL (blocking, carried by G3 only).

What passes:

- The stack is exactly three entries: faers, notify, db-row, in
  that order. Every other item carries a mobile-hide class except
  faers (no hide class), notify (hidden only at 720 to 1160px),
  and db-row (hidden at min-width 720px by a rule that exists in
  the stylesheet). The row is the last entry, as specified.
- The row is a layout arrangement, not a container: plain flex
  div, gap 8px, no background, no border, no label above it, no
  shared frame. Tiles are independent, hide individually on load
  failure, and wrap instead of overflowing.
- Tilts are 0deg (the row item has no tilt class, and the mobile
  block zeroes every tilt class anyway) and floats are off (the
  mobile block sets animation none on collage floats; the row's
  12s duration is inert). Order is PubMed, Elsevier, Scopus,
  ScienceDirect, as specified.
- Row width at a 320px viewport is about 259px against the 272px
  column (wordmark tiles about 67 to 70px, icon tile 31px, three
  8px gaps), so all four tiles fit on one row at 320px.

What fails (G3): row art is 17px tall (DbLogoRow sets height 17
with a 60px cap), below the 20px legibility floor that v10 doc 01
section 6 restates from v9 for every breakpoint including mobile.
At 17px the wordmarks render about 53 to 56px wide and the SD
mark 17px, noticeably less legible than the desktop tiles and
below the floor the project already accepted. This is blocking
because the floor exists precisely to stop mobile from quietly
degrading the logos.

Fix for G3: raise row art to 20px and tighten the row so one row
at 320px survives: tile padding 6px to 4px and gap 8px to 6px.
Row math at 20px art becomes (62 + 10) + (66 + 10) + (62 + 10) +
(20 + 10) + (3 times 6), which is 268px against the 272px column.
If the parent prefers the current padding and gap, the fallback
is to accept a two-pair wrap at 320px, which is still one stack
entry and still calm, but it is not the one row section 6 asks
for, so the padding and gap change is the recommended fix.

Observation (not a gap): below about 268px viewport width the
row wraps 3 plus 1 rather than two pairs (the first three tiles
plus two gaps fit 220px, the icon drops alone). Section 6 says
two pairs below about 320px; the actual wrap pattern is 3 plus 1
until the column narrows below 220px. Either pattern is still one
stack entry and still calm, so this is a doc wording imprecision,
not a fidelity failure.

## Gap list (complete)

- G1 (blocking): PubMed and Elsevier stacked pair, gap 34px at a
  700px stage against a 40px rule that also applies at float
  peaks (needs about 48px at rest). Fix: the G1 and G2 swap above
  (ScienceDirect to left 42 percent, bottom 19 percent;
  Elsevier to right 2.5 percent, bottom 33 percent, keeping the
  icon's hide classes). Re-verify the pair gap and the icon's
  frame clearance (about 29px modeled) after the move.
- G2 (blocking): ScienceDirect icon orphaned about 629px from
  the nearest wordmark at 1440px (formula 0.57W - 192, above 600px
  at every visible width) against a section 5 rule of about
  120px. Fix: same swap as G1; the icon's anchor becomes PubMed
  at a 48px rest gap.
- G3 (blocking): mobile row art 17px, below the 20px floor. Fix:
  art 20px, tile padding 4px, gap 6px (row about 268px, fits the
  272px column at a 320px viewport); fallback is a two-pair wrap
  at 320px, still one stack entry.
- G4 (minor): near-miss logo-to-card separations, all under the
  24px rule but with no overlap and full legibility. PubMed to
  gut axis: 15px at 1440px (formula 0.17W - 230, clears above about
  1500px). Elsevier to gut axis: about 22px at 1401px (formula
  0.18W - 230, clears above about 1428px). ScienceDirect to
  poster window: about 21px modeled (poster window height
  estimated at about 319px from its chrome, padding, title,
  blocks, and footer; font metrics move this by roughly 30px
  either way, so it may in fact clear or touch). Fix: nudge the
  logo positions a few percent where the band allows, or accept
  these three as the documented tolerance band; do not chase
  them by shrinking art below 20px on desktop.
- G5 (minor): Scopus to helix box overlap of about 13px above
  1400px (Scopus right edge 402 against helix left edge 389 at
  1440px, with vertical overlap), just over the 12px corner-graze
  ceiling. The helix is a decorative SVG whose ink may not fill
  its 100px box, so real ink may not touch at all. Fix: shift
  Scopus left by about 1 percent or confirm from the live render
  that helix ink clears the tile; do not move the helix, which
  is a v7 anchor.
- G6 (minor): doc deviations in DbLogoFloat that do not break a
  reference principle but break v10 doc 01 section 4: one deep
  shadow (0 10px 28px at 0.14 alpha) on all four tiles instead of
  mid depth for wordmarks (0 8px 24px at 0.10) and near depth for
  the icon (0 2px 8px at 0.06), and radius 14px instead of 8px.
  Against the reference, the icon shadow is the real point:
  section 4.5 warns that a deep shadow on a small tile looks like
  a hole, and the 52px icon tile carries the deepest shadow in
  the set. Fix: split the shadow per tier as section 4 specifies
  and set radius to 8px (14px happens to sit near the reference
  app-icon radius of 12px, so radius alone would not block).
- G7 (minor): tilt-sign sharing with nearest card neighbors.
  Scopus (-1deg) sits next to docking (-3deg), Elsevier (-3deg)
  next to desk (-1deg), and ScienceDirect (+3deg) next to stroke
  (+2deg). Reference doc 01 section 5.1 wants adjacent cards on
  opposite signs. The logo tiles themselves alternate as a set
  (+2, -3, -1, +3) and the PubMed and Elsevier pair alternates,
  so the scatter cue survives; magnitudes differ within each
  shared-sign pair, so no two neighbors look aligned. Fix only
  if the parent wants strict alternation: flip one tilt class
  per pair and re-verify the mobile zeroing still covers it.

## Global checks (all pass)

- DbStackCard gone: file deleted, 0 references in `src/` to
  DbStackCard, LogoTiles, or dbstack. The v10 doc 01 section 9
  checklist item 1 is satisfied.
- Import contract: Hero imports DbLogoFloat and DbLogoRow; the
  four brand wrappers are module-level components, not inline in
  the render loop, so tiles never remount on re-render. DbLogoRow
  is rendered once as db-row. No orphan component remains.
- TypeScript: `npx tsc --noEmit` clean, 0 errors, on the
  integrated tree.
- Greps over Hero.tsx, DbLogoFloat.tsx, and DbLogoRow.tsx: em
  dash 0; endorsement and indexing wording ("indexed in",
  "affiliated", "partner", "endorsed") 0 in code and comments;
  hex colors only #FFFFFF and #E0E0E0, so no brand color leaks
  into code (brand colors live only inside the logo image files).
- Alt texts are brand plus "logo" in both components. Tiles
  carry no link, button, or hover action. The collage layer stays
  pointer-dead and aria-hidden. Failed tiles hide themselves via
  onError with no text fallback and no broken-image icon.
- Reduced motion: collage floats stop via the existing media
  block; logo tilts are static transforms and stay, as section
  5.1 allows. Parallax still moves the whole layer only.

## What live confirmation still owes

Code inspection cannot settle: the modeled frame clearances
(especially Elsevier at about 45px and ScienceDirect at about
52px); the ScienceDirect to poster window gap (modeled about
21px, content-height dependent); whether helix ink touches the
Scopus tile; whether the PubMed and Elsevier pair reads as a
column or as two scattered tiles in a real render; whether the
SD monogram reads in context once it sits next to PubMed; and
the mobile row at 320px and below. The owed live checks are:
desktop above 1400px, the 1401 to 1500px band (where G4 bites),
the 720 to 1160px band (where only PubMed and the icon's
replacement remain visible), short stages, and the mobile stack.
