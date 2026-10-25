# 03 - Cursor layer (diorama) overlap analysis

Report only. No site edits, no build. Code inspection plus px
modeling only; no live browser check was possible (the sandbox
blocks localhost preview), so every figure below is modeled from
source and stated as such.

## 1. What the layer is

File: `src/sections/Hero.tsx`. The ambient diorama layer is a
decorative, pointer-dead overlay:

- Chip definitions: `CURSOR_CHIPS`, lines 99-113. 4 chips, labels
  are topic/project names only, never person names.
- rAF drift + converge loop: lines 315-404. Positions are written
  straight to each chip's `transform` every frame; no CSS
  transition on transform.
- Layer CSS: lines 606-646. `.mv-diorama` is `position: absolute;
  inset: 0; z-index: 2; pointer-events: none; overflow: hidden`.
- Chip render: lines 857-913. Each chip is a 14x17 cursor SVG
  plus a mono label pill (11px JetBrains Mono, letter-spacing
  0.04em, padding 3px 8px, 1px border, `whiteSpace: nowrap`).
- Z order: grid below, collage `z-index: 0`, word/frame
  `z-index: 1`, diorama `z-index: 2`. Chips paint ABOVE cards
  and above the frame. That is why a chip sitting on a card reads
  as overlap: it literally covers card text.
- Gating: the loop runs only on `(hover: hover) and
  (pointer: fine)` without `prefers-reduced-motion` (lines
  317-323); `.mv-diorama` is `display: none` under
  `@media (hover: none)` and under reduced motion. So mobile has
  no cursors by design (touch has no hover cursor), and this
  report is desktop-only.
- Extra motion on top of drift: scroll modulates loop phase by up
  to 0.25 loop (lines 347-351); the collage layer has mouse
  parallax of plus/minus 8px; each card floats vertically 0 to
  -8px. These shift rects by at most 8px and do not change any
  conclusion below (the permanent overlaps have 50px or more of
  slack in every direction).
- Converge mode: while the giant word is hovered, each chip eases
  (0.3s time constant, smoothstepped) from its drifting position
  to the nearest point on the word rect expanded by 20px (lines
  371-394). Converge targets are computed from the live word
  rect, so they move if the word moves.

## 2. Modeling assumptions

- Stage width W = 1440 or 1920. Stage height H = 800 at 1440
  (viewport 900, stage = `100dvh - 100px`, Hero.tsx lines
  536-537) and H = 900 at 1920 (viewport 1000). AnchorY
  fractions scale with real stage height; all conclusions were
  checked at both heights.
- Chip sizes modeled from 11px JetBrains Mono metrics
  (0.6em advance = 6.6px plus 0.04em tracking = 0.44px, so about
  7.0px per character), pill padding 16px plus 2px border, cursor
  14px plus 6px gap. Chip height about 21px (pill text plus
  padding plus border; cursor is 17px).
- Card widths are from source. Card heights are estimated from
  content structure and marked EST wherever they matter; widths
  and positions are exact.
- Drift box = union of chip positions over one full loop:
  x from `anchorLeft - radius` to `anchorLeft + radius + chipW`,
  y from `anchorTop - 0.7 * radius` to
  `anchorTop + 0.7 * radius + chipH`. Note the box overstates
  corner occupancy (the true path is an ellipse), so "chip is
  over card X for its whole loop" below means the chip rect
  intersects the card rect at every point of the loop, which was
  verified separately from the box, not just read off it.
- At 1440 and 1920 the visible desktop collage set is the same
  16 items: poster and awards hide at 1401px and above
  (`hide-min-1400`), everything else visible (height rules
  `hide-750`/`hide-short` are inert at H = 800/900).

## 3. Chip inventory

| Chip | Color | Anchor (fraction) | Radius | Duration | Phase | Modeled size |
| ---- | ----- | ----------------- | ------ | -------- | ----- | ------------ |
| FAERS | #0859D4 | x 0.04, y 0.16 | 40 | 18s | 0 | 73 x 21 |
| StrokeSense | #177245 | x 0.96, y 0.20 | 56 | 22s | 0.3 | 115 x 21 |
| Code for Cure | #A63A2E | x 0.05, y 0.82 | 32 | 16s | 0.55 | 130 x 21 |
| Seoul 2026 | #7A5A00 | x 0.95, y 0.76 | 48 | 24s | 0.8 | 108 x 21 |

Right-anchored chips (anchorX above 0.5) hang from their right
edge: the code sets `anchorX = anchorX * W - chipW` (line 361),
so the anchor is the chip's right edge position, not its left.

## 4. Card rects used for overlap tests (1440 x 800 stage)

Positions are COLLAGE_ITEMS percents of stage size; widths from
source; heights EST.

| Card | x | y | Notes |
| ---- | - | - | ----- |
| DockingCard | 36-266 (w 230) | 24 to about 199 EST | left 2.5%, top 3% |
| DnaHelix | 389-489 (w 100) | 16 to about 166 EST | left 27%, top 2% |
| ReviewCard | 802-1022 (w 220) | 24 to about 214 EST | right 29%, top 3% |
| SearchWindow | 518-778 (w 260) | 16 to about 186 EST | left 36%, top 2% |
| PosterWindow | 1124-1404 (w 280) | 88 to about 318 EST | right 2.5%, top 11% |
| MicroscopeCard | 36-246 (w 210) | about 338-488 EST | left 2.5%, bottom 39% |
| Stickers | 36 to about 356 EST | 256-288 EST | left 2.5%, top 32% |
| FaersCard | 36-276 (w 240) | 603-768 | left 2.5%, bottom 4%, height about 165 from padding plus 40px figure plus flow plus note |
| NotifyBubble | 36 to about 366 EST | 550-600 EST | left 2.5%, bottom 25% |
| GutAxisCard | 360-590 (w 230) | about 606-776 EST | left 25%, bottom 3% |
| DeskCard | 763-983 (w 220) | about 626-776 EST | left 53%, bottom 3% |
| StrokeCard | 1144-1404 (maxW 260) | about 610-760 EST | right 2.5%, bottom 5% |
| db-pubmed tile | 619-723 (w about 104) | about 710-760 | left 43%, bottom 5% |
| db-elsevier tile | 1008-1112 (w about 104) | about 710-760 | left 70%, bottom 5% |
| db-scopus tile | 288-392 (w about 104) | 24 to about 74 | left 20%, top 3% |
| db-cochrane tile | 288-357 (w 69) | 120-202 | left 20%, top 15%, h 82 |

Word/frame at 1440: frame x 140-1300, frame y about 307-534
(content is vertically centered: label plus frame total about
273px inside a 640px content area). Word x 207-1233 (1026px at
the 180px cap), word y about 335-506. Expanded word rect
(plus/minus 20px): x 187-1253, y 315-526.

## 5. Drift boxes and overlap list (1440 x 800)

### FAERS (73 x 21, anchor left 57.6, top 128, r 40)

- Drift box: x 17.6-170.6, y 100-177.
- Overlap: DockingCard (x 36-266, y 24 to about 199).
  Chip left range 17.6-97.6 (always below 266), chip right
  range 90.6-170.6 (always above 36), chip y range 100-177
  (always inside 24-199). The chip is over DockingCard for its
  ENTIRE loop. This is not a graze: at every instant the 73x21
  chip covers docking-card pixels.
- No overlap with Stickers (y 256-288, box bottom 177) or
  Helix (x 389-489).

### StrokeSense (115 x 21, anchor left 1267.4, top 160, r 56)

- Drift box: x 1211.4-1438.4, y 120.8-220.2.
- Overlap: PosterWindow (x 1124-1404, y 88 to about 318).
  Chip left range 1211.4-1323.4 (always below 1404), chip
  right range 1326.4-1438.4 (always above 1124), chip y range
  120.8-220.2 (always inside 88-318). The chip is over
  PosterWindow for its ENTIRE loop.
- This matches the user screenshot: the StrokeSense chip sits on
  the poster card at top right.

### Code for Cure (130 x 21, anchor left 72, top 656, r 32)

- Drift box: x 40-234, y 633.6-699.4.
- Overlap: FaersCard (x 36-276, y 603-768). Chip x range is
  fully inside FaersCard x, chip y range fully inside
  FaersCard y. The chip is over FaersCard for its ENTIRE loop,
  covering the "7,519 reports" flow line band.
- This matches the user screenshot: the Code for Cure chip sits
  on the FaersCard text.
- No overlap with NotifyBubble (y 550-600, box top 633.6,
  33.6px clearance).

### Seoul 2026 (108 x 21, anchor left 1260, top 608, r 48)

- Drift box: x 1212-1416, y 574.4-662.6.
- Overlap: StrokeCard (x 1144-1404, y about 610-760). Chip x
  always overlaps StrokeCard x. Chip bottom exceeds 610
  whenever chip top exceeds 589, i.e. driftY above -19, i.e.
  sin term above -0.565: about 69% of the loop. The chip is
  over StrokeCard for roughly two thirds of its loop and in
  empty band above the card for the rest.
- No overlap with DeskCard (x 763-983) or db-elsevier
  (x 1008-1112).

### Summary at 1440

Three of four chips overlap a card permanently, one about 69%
of its loop. The root cause is not the drift radius: all four
anchor points already sit inside (or, for Seoul 2026, 2px
above) a card rect before any drift is applied. FAERS anchor
(57.6, 128) is inside DockingCard; StrokeSense anchor right
edge (1382.4, 160) is inside PosterWindow; Code for Cure
anchor (72, 656) is inside FaersCard; Seoul 2026 anchor top
(608) is 2px above StrokeCard top (610) with a 21px tall chip,
so it overlaps from the first frame.

### 1920 x 900 stage (same pattern, one fraction changes)

Word x 447-1473, frame y about 357-584. Card rects shift with
percents; the same four overlaps reproduce:

- FAERS: anchor left 76.8, top 144, box x 36.8-189.8, y
  116-195; DockingCard x 48-278, y 27 to about 202. Permanent.
- StrokeSense: anchor left 1728.2, top 180, box x
  1672.2-1899.2, y 140.8-242.2; PosterWindow x 1592-1872, y
  99 to about 329. Permanent.
- Code for Cure: anchor left 96, top 738, box x 64-258, y
  715.6-783.4; FaersCard x 48-288, y 699-864. Permanent.
- Seoul 2026: anchor left 1716, top 684, box x 1668-1872, y
  650.4-738.6; StrokeCard x 1612-1872, y about 705-855.
  Chip bottom exceeds 705 exactly when driftY exceeds 0:
  50% of the loop (vs 69% at 1440).

### Converge mode (word hover) at 1440

Converged chips land on the expanded word rect edges, which is
mostly clean because the frame-adjacent bands are empty:

- FAERS converges to about (151, 304): clears Stickers bottom
  (288) by 16px and MicroscopeCard top (338) by 13px. Clean.
- StrokeSense converges to about (1196, 304): its 21px height
  spans 304-325 against PosterWindow bottom (about 318), so it
  clips the poster window's bottom edge band by about 14px.
  Minor, and only while hovering.
- Code for Cure converges to about (432, 515): clears
  FaersCard top (603) by 68px; it grazes the frame bottom
  border (534), which is a dashed line, not a card. Clean
  enough.
- Seoul 2026 converges to about (1199, 515): clears StrokeCard
  top (610) by 95px; same frame-border graze as above.

So converge is NOT the problem; free drift is.

## 6. Same-layer pills (secondary finding, same z 2 layer)

FACT_PILLS (lines 115-137, rendered lines 914-936) float
plus/minus 10px on CSS animation and are hidden below 900px
width, but they share the overlap problem:

- "Hypertension Seoul 2026" (top 30%, right 10%): at 1440 about
  x 1120-1296, y 240-265, which sits ON PosterWindow
  (x 1124-1404, y 88-318) permanently. Same class of bug as
  the chips.
- "FAERS N = 6,601" (top 64%, left 7%): at 1440 about x
  101-228, y 512-537; float peak pushes its bottom to 547
  against NotifyBubble top (550): a 3px near miss, not an
  overlap today, but one card-height revision away from one.
- "Code for Cure" (bottom 30%, right 14%): at 1440 about x
  1128-1238, y 535-560; clears StrokeCard top (610) and DeskCard
  (x ends 983). Clean.

Fix for pills (one line each, for the fix agent): move the
Seoul pill to left 40%, top 27% (x 576-752, y 216-241 at 1440:
clears SearchWindow bottom 186 by 30px; at 1920 x 768-944, y
243-268: clears SearchWindow bottom 188 by 55px) and move the
FAERS pill to top 62% (y 496-521, float bottom 531: clears
NotifyBubble top 550 by 19px and MicroscopeCard bottom 488 by
8px at 1440).

## 7. Options to eliminate chip-on-card overlap

### Option A (PRIMARY): re-anchor all four chips into the two
frame-adjacent empty lanes, cap radius at 20px

The hero is densely packed; there is no unused margin band at
the edges (side gutters are 24-36px, cards run to 3-5% from
every edge). The only genuinely empty horizontal lanes are
above the frame (between top-card bottoms and frame top) and
below the frame (between frame bottom and bottom-card tops):

- Above-frame lane at 1440: y 214-307 (93px tall; bounded by
  ReviewCard bottom 214 and frame top 307). At 1920: y
  217-357 (140px tall).
- Below-frame lane at 1440: y 534-598 (64px tall; bounded by
  frame bottom 534 and GutAxisCard float-adjusted top 598).
  At 1920 for x 400-1600: y 584-699 (115px tall; NotifyBubble
  intrudes only at x below 378).

A chip with radius 20 needs 21 + 2 x 14 = 49px of vertical
room, which fits both lanes. Proposed anchors:

| Chip | AnchorX | AnchorY | Radius | Drift box at 1440 | Tightest clearance at 1440 |
| ---- | ------- | ------- | ------ | ----------------- | -------------------------- |
| FAERS | 0.15 | 0.30 | 20 | x 196-289, y 226-275 | 32px to frame top (307); SearchWindow bottom 186 is 40px above |
| StrokeSense | 0.55 | 0.30 | 20 | x 657-812, y 226-275 | 12px vertical to ReviewCard bottom (214); x overlap with ReviewCard is 10px but vertically clear |
| Code for Cure | 0.30 | 0.69 | 20 | x 412-562, y 538-587 | 4px to frame bottom (534); 11px to GutAxisCard float-adjusted top (598) |
| Seoul 2026 | 0.68 | 0.69 | 20 | x 851-999, y 538-587 | 4px to frame bottom (534); 39px to DeskCard top (626); db-elsevier starts at 1008, 9px past box end |

Verified at 1920 as well: FAERS box x 268-381, y 256-307
(clears frame top 357 by 50px); StrokeSense box x 921-1076,
y 256-307 (x overlaps SearchWindow by 30px but clears its
bottom 188 vertically by 68px); Code for Cure box x 556-706,
y 607-658 (clears frame bottom 584 by 23px, GutAxisCard top
703 by 45px); Seoul 2026 box x 1178-1326, y 607-658 (clears
frame bottom by 23px, DeskCard top 723 by 65px, db-elsevier
starts 1344).

Notes for the fix agent: keep the existing anchorX above/below
0.5 left/right hang logic (StrokeSense and Seoul 2026 stay
right-anchored, so their computed anchor-left values above
already include the chip width subtraction). AnchorY 0.695
instead of 0.69 balances the below-frame lane clearances at
1440 to about 8px (frame) and 5px (GutAxisCard) if the 4px
frame clearance reads as too tight. Converge behavior under
this option stays clean (section 5, converge paragraph: only
frame-border grazes, no card overlap except the 14px
StrokeSense poster-window clip, which this re-anchor also
removes because the converged point moves with the anchor).

- Pros: zero chip-on-card overlap by construction at both
  modeled widths; keeps all four chips, all four labels, the
  rAF drift, the durations, and the converge behavior; no new
  code paths, just four constant changes; pills fix is two
  more constant changes.
- Cons: chips no longer roam the full hero; they live in two
  horizontal lanes near the word, so the scattered feel is
  somewhat reduced (they still drift, desynced, at four
  different x positions and two heights). The 4px frame-bottom
  clearances at 1440 are thin; a card-height revision could
  eat them (mitigation: use anchorY 0.695, or shrink radius
  to 16px, which buys 5.6px of vertical room per side).
- Effort: trivial (constants only, no logic change).

### Option B (BACKUP): Option A plus collision-aware fade

Keep the Option A anchors, and add a per-frame overlap test in
the rAF loop: if a chip rect intersects any collage card rect
(a static rect list computed on resize, expanded by 8px for
float and parallax), fade that chip's opacity to 0 over about
200ms; fade back only after the chip clears every card rect
by a 12px hysteresis margin. This converts any future
boundary graze (from a card resize or a new item) into a
brief fade instead of visible overlap.

- Pros: self-healing against future layout drift; invisible
  when nothing overlaps.
- Cons: new per-frame rect math and opacity state; fade
  in/out at lane boundaries could read as flicker if the
  hysteresis margin is too small; as a standalone option
  (without Option A) it is useless, because three chips sit
  on cards for their whole loop and would simply be hidden
  almost always, which is deletion by another name.
- Effort: small to moderate (rect list plus opacity blend in
  the existing loop).

### Option C (NOT RECOMMENDED as primary): chips under cards
(z-order swap)

Move the diorama layer below the collage (diorama z-index
below 0, or keep z 0 with collage painted later in DOM order)
so chips slide UNDER cards instead of over card text. Card
text is never covered, which literally satisfies "no overlap
on top of".

- Pros: one-line change; drift, anchors, and count untouched.
- Cons: chips vanish behind cards for most of each loop
  (FAERS, StrokeSense, Code for Cure are over cards nearly
  100% of the time, so they would be visible only in the
  gaps), which guts the scattered feel worse than Option A;
  and converge-to-word visibility is lost, because the frame
  (z 1) would also paint above the chips, contradicting the
  spec comment that converging chips stay visible.
- Effort: trivial, but the feel cost is the highest of the
  three options.

### Rejected without a full write-up

- Shrinking radii alone: fails, because all four anchors
  already sit inside card rects (section 5). A radius of zero
  would still overlap.
- Parking chips only in top/bottom margin bands: no such
  band exists (cards run to 3-5% from every edge).
- Deleting the cursor layer: the user asked to fix overlap,
  not to remove the layer, and the layer is part of the
  desktop feel they approved in earlier rounds. Only if
  Options A and B both fail in live testing should deletion
  be reconsidered.
- Hiding chips on desktop widths where overlap is worst:
  overlap is permanent at every desktop width modeled, so
  this is deletion with extra steps.

## 8. Recommendation

Implement Option A as primary (four constant changes in
CURSOR_CHIPS plus the two pill moves in section 6), with
anchorY 0.695 for the below-frame pair if the fix agent wants
the 1440 clearances balanced rather than frame-tight. Add
Option B only if live preview shows a remaining graze after
Option A (for example from a card whose real height exceeds
the EST heights used here). Do not implement Option C: it
preserves motion on paper while hiding the chips in practice.

## 9. Live checks owed (sandbox cannot render pixels)

- Desktop 1440 and 1920: no chip or pill sits on any card
  text at any point in the drift loop (watch at least one
  full slowest loop, 24s, or scrub via the phase values).
- Hover the word: converged chips sit on the frame border
  only, not on cards.
- Confirm the two-lane composition still reads as scattered
  rather than lined up; if it reads as a row, increase the
  phase spread (phases are currently 0, 0.3, 0.55, 0.8) rather
  than moving anchors back onto cards.
- Card heights marked EST (DockingCard, ReviewCard,
  PosterWindow, MicroscopeCard, Stickers, GutAxisCard,
  DeskCard, StrokeCard, NotifyBubble) should be confirmed
  against the live render; if any real height exceeds the
  EST value by more than the stated clearance, re-check that
  lane.
