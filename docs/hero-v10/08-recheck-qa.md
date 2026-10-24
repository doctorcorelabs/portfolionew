# v10 recheck QA, round 2: db-elsevier relocation (final QA 06 gap F1)

Scope: `src/sections/Hero.tsx`, `src/components/hero-v8/DbLogoFloat.tsx`,
`src/components/hero-v8/DbLogoRow.tsx`, and neighboring collage cards.
Method: code inspection plus the established doc 07 model. No live
browser check was possible from the sandbox; live confirmation remains
owed (see section 8).

## Verdict: PASS

Final QA 06 gap F1 is closed on the current tree, and no new blocking
gap was found. The relocation puts db-elsevier below the frame band
entirely (bottom 5% slot), so the old F1 mechanism, a horizontal
frame-edge overlap inside the frame's vertical band, cannot recur in
this slot. Minimum clearances anywhere are positive daylight, not
touches: 15.2px tilt-adjusted (desk side, width 1401) is the tightest
number in this report, and it is a gap, not a collision.

One reported near-miss is non-blocking and structural (see section 1):
in the 1401 to about 1453 width band the desk-side gap is 15 to 24px
rather than 24px or more. At width 1401 no left-percent placement
achieves 24px on both sides at once (total slack 39.5px, best split
19.7px each), so this band cannot be fixed by nudging the slot; it
would need a hide rule, which is a parent decision, not something to
apply silently. It is not a collision and it does not block shipping.

## 0. Geometry inputs (read from code, not assumed)

- db-elsevier: left 70%, bottom 5%, tile 104 by 50px (24px art plus
  24px padding plus 2px border), tilt -3deg (mv-tilt-card-a).
  Tilt bounding box: width 106.5px (plus 1.24px per side), height
  55.4px (plus 2.7px per side).
- DeskCard: left 53%, bottom 3%, width 220 fixed, height about 198px
  (218px image at 4/3 = 163.5px plus caption row about 32px plus
  2px border), tilt -1deg (width plus 1.7px per side).
- StrokeCard: right 2.5%, bottom 5%, maxWidth 260 (used as the
  worst case; content wants more than the content width, so the
  card renders at maxWidth), height about 123px, tilt +2deg
  (width plus 2.1px per side).
- GutAxisCard: left 25%, bottom 3%, width 230, height about 151px.
- db-pubmed: left 43%, bottom 5%, tile 100 by 50px, tilt +2deg.
- db-sciencedirect: left 43%, bottom 19%, tile 52 by 52px,
  tilt +3deg.
- PosterWindow: right 2.5%, top 11%, width 280, height about 346px
  (chrome 31px, body padding 30px, bar 16px, title 3 lines 70px,
  subtitle 2 lines 47px, skeleton block 76px, bars 50px, footer
  26px; font-metric uncertainty about 10px, immaterial here).
- Frame band (doc 07 model): frame width = min(1160, stage width),
  centered; vertical band top = H/2 - 90, bottom = H/2 + 136.5;
  glyph bottom about H/2 + 125. Stage height H = 100dvh - 100px:
  H 700 = 800px viewport, H 600 = 700px viewport, H 550 = viewport
  650px or less.
- Motion budget (doc 07 model): float translateY 0 to -8px
  (upward only, per item, desynced); parallax plus/minus 8px on
  both axes applied to the whole layer, so it cancels for
  item-to-item gaps and counts in full only for absolute
  (item-to-frame, item-to-glyph) clearances: absolute peak budget
  8 + 8 + 2.7 = 18.5px; relative peak budget 8px float
  differential plus about 2.5 to 3px tilt.

## 1. (a) db-elsevier horizontal clearances: PASS, no overlap

The collage layer moves as one under parallax and floats move
vertically only, so horizontal item-to-item gaps erode only by
tilt bounding boxes (about 3px combined). Static gap first,
tilt-adjusted gap second.

To DeskCard (left): gap = 0.70W - (0.53W + 220) = 0.17W - 220.
Both items share the bottom band at every stage (desk spans
0.97H - 198 to 0.97H; elsevier spans 0.95H - 50 to 0.95H, inside
the desk band), so the horizontal gap is the binding clearance.

| Width | Static gap | Tilt-adjusted gap | 24px rule |
| 1401 | 18.2px | 15.2px | Miss (both) |
| 1440 | 24.8px | 21.9px | Static pass, tilt-adj miss |
| 1500 | 35.0px | 32.1px | Pass |
| 1920 | 106.4px | 103.5px | Pass |

24px thresholds: static at W 1435 and up; tilt-adjusted at
W 1453 and up.

To StrokeCard (right): gap = 0.975W - 260 - (0.70W + 104)
= 0.275W - 364. Both items share the bottom 5% band
(elseiver vertically inside the stroke band), so the horizontal
gap binds. Stroke width uses the 260px maxWidth worst case;
a narrower real width only widens this gap.

| Width | Static gap | Tilt-adjusted gap | 24px rule |
| 1401 | 21.3px | 18.1px | Miss (both) |
| 1440 | 32.0px | 28.7px | Pass |
| 1500 | 48.5px | 45.2px | Pass |
| 1920 | 164.0px | 160.7px | Pass |

24px thresholds: static at W 1411 and up; tilt-adjusted at
W 1423 and up.

No overlap anywhere: the minimum static gap is 18.2px (desk,
width 1401) and the minimum tilt-adjusted gap is 15.2px. The
near-miss band 1401 to about 1453 (desk side) is structural:
at width 1401 the total slack between desk-right and
stroke-left is 39.5px for a 104px tile, so the best balanced
split is 19.7px per side; no placement reaches 24px on both
sides there. Recorded as a non-blocking observation and a
live-preview watch item, not a blocking gap: 15px of daylight
is not a touch, and the alternative (hiding elsevier below a
wider threshold) is a parent decision.

## 2. (b) db-elsevier clearance to the frame band: PASS

Elsevier top edge = 0.95H - 50. Frame bottom = H/2 + 136.5.
Clearance = 0.45H - 186.5. Glyph clearance = 0.45H - 175.

| Stage H | Frame clearance, rest | Frame clearance, absolute peak (minus 18.5) | Glyph clearance, rest |
| 700 | 128.5px | 110.0px | 140.0px |
| 600 | 83.5px | 65.0px | 95.0px |
| 550 | 61.0px | 42.5px | 72.5px |

Clears at rest and at absolute peaks at every stage. The tile
sits below the frame band at every stage, so F1's old
horizontal-overlap mechanism cannot apply here: even though
the tile's x-range falls inside the frame's x-range (for
example 980.7 to 1084.7 against frame 120.5 to 1280.5 at width
1401), the vertical spans never meet. F1 is closed
structurally, not marginally.

## 3. (c) db-elsevier clearance to neighbors: PASS

- PosterWindow: vertical gap = 0.84H - 396 (poster bottom =
  0.11H + 346; elsevier top = 0.95H - 50): 192px at H 700,
  108px at H 600, 66px at H 550. Worst relative peak (elsevier
  float up 8px plus 2.7px tilt; parallax cancels; poster float
  moves up only, away): 181.3px, 97.3px, 55.3px. No overlap.
  Observation (inert): at width 1401 the poster left edge
  (1086.0px) and the elsevier right edge (1084.7px) are 1.3px
  apart horizontally, but their vertical bands are at least
  66px apart; the bands would meet only below H 471, under
  the 550px stage minimum. Not a gap.
- GutAxisCard: horizontal gap = 0.45W - 230: 400.5px,
  418.0px, 445.0px, 634.0px at widths 1401, 1440, 1500, 1920.
  Vertical bands overlap (elsevier inside the gutaxis band),
  so the horizontal gap binds. Huge margin.
- db-pubmed: horizontal gap = 0.27W - 100: 278.3px, 288.8px,
  305.0px, 418.4px. Same bottom 5% band; horizontal binds.
- db-sciencedirect: vertical gap = 0.14H - 50 = 48px at
  H 700; worst relative peak about 36px. At H 600 and H 550
  the icon is hidden by hide-short (viewport 700px or less),
  so no overlap is possible there. Horizontal separation is
  at least 326px regardless. No overlap.

## 4. (d) Hide audit: PASS

Verified from the stylesheet block in Hero.tsx and every
item's hideClass:

- Floats hidden below 720px: all four db floats carry
  mv-collage-mobile-hide (display none at max-width 719px).
- Row hidden at 720px and up: db-row carries
  mv-collage-hide-min-720 (display none at min-width 720px).
  Boundary is clean: at exactly 720px the row is hidden and
  the floats are visible; at 719px the reverse.
- db-elsevier and db-scopus hidden at 1400px and below: both
  carry mv-collage-hide-1400 (display none at max-width
  1400px, inclusively), so they show only above 1400px, as
  the brief states. At exactly 1400px they are hidden.
- db-sciencedirect hidden on short viewports: hide-short
  (display none at viewport max-height 700px, inclusively),
  so hidden at stages 600 and below, visible at stages 601
  and up.
- No width renders any logo twice: below 720px only the row
  renders (4 logos once each); 720 to 1400px only floats
  render (pubmed plus sciencedirect at tall stages, pubmed
  only at short stages); above 1400px only floats render
  (4 at tall stages, 3 at short stages). No other collage
  item renders a database logo (SearchWindow is a query
  mockup, PosterWindow is a poster preview, Stickers are
  method/topic pills).
- Mobile stack is exactly FaersCard, NotifyBubble, DbLogoRow:
  every other item is hidden below 720px via mobile-hide,
  hide-1400 (covers mobile widths), hide-mid, or hide-1000.

## 5. (e) Hero header comment visibility accounting: PASS

The comment states 4 free-floating logo tiles: 2 visible at
every desktop width at normal heights, 2 more above 1400px;
on short viewports at or below 700px height the ScienceDirect
icon hides, leaving 3 above 1400px and 1 at 720 to 1400px;
plus 1 mobile-only logo row. Verified exact:

- 720 to 1400px, tall: pubmed plus sciencedirect = 2.
- Above 1400px, tall: pubmed, elsevier, scopus,
  sciencedirect = 4.
- 720 to 1400px, short (viewport 700px or less): pubmed = 1.
- Above 1400px, short: pubmed, elsevier, scopus = 3.
- Below 720px: the row only, floats hidden.

Minor observation (non-blocking, comment precision only):
the comment's "19 items, 18 visible on desktop" holds only
under the "18 desktop items" reading (db-row is mobile-only);
no single width shows all 18 at once because hide classes
remove more at every band (for example 16 at above-1400
tall stages: minus poster, awards, db-row). The logo
accounting itself is exact, so this does not affect the
verdict. Suggested reword if the parent wants it: drop the
"18 visible" clause and keep the per-band accounting.

## 6. (f) TypeScript: PASS

`npx tsc --noEmit`: clean, 0 errors for the whole tree.

## 7. (g) Greps (Hero.tsx plus all hero-v8 files): PASS

- Em dash: 0.
- Forbidden patterns (marquee, scroll-lock, cursor none,
  scroll-snap, overscroll, scrollTo, scrollIntoView, wheel
  handlers, preventDefault, Lenis): 0.
- Endorsement/indexing wording in rendered text ("indexed
  in", "affiliated", "partner", "endorsed"): 0, including
  in comments.
- Stale references (DbStackCard, LogoTiles, dbstack),
  case-insensitive, across all of src/: 0. The v9 dark card
  and its tile module are fully gone; the v10 float and row
  modules carry no reference to them.

## 8. Carried observations (not new gaps)

- Doc 07 observation persists unchanged and is unrelated to
  this relocation: in the 601 to 668 stage band the
  ScienceDirect icon is visible and can graze the frame
  border by up to about 2px at rest near stage 601 (white
  tile, word paints above, glyphs stay visible). The modeled
  stages for this report (700, 600, 550) do not include that
  band; at stage 700 the icon clears the frame by 28.5px at
  rest.
- Live-browser confirmation remains owed, as in every round
  (sandbox blocks localhost preview): the 1401 to 1450 width
  band gaps (desk side 15 to 24px), short stages, the mobile
  stack, and the ScienceDirect icon in real collage context.
