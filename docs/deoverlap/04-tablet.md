# Tablet overlap audit: hero collage at 720-1160px

Scope: tablet slice of the hero de-overlap task. Desktop is covered
by other analysts; mobile (below 720px) is a static stack, not
floats, and is out of scope here. This report covers ONLY the hero
collage floats at tablet widths. Method: code inspection plus px
modeling only. No live browser check was possible (the sandbox
blocks localhost preview), so every number below is computed from
source and every live confirmation is listed at the end.

## 1. Model

### 1.1 Stage geometry

The hero section (`src/sections/Hero.tsx` lines 529-550) is
`position: relative`, `overflow: hidden`, height
`calc(100dvh - 100px)`, `minHeight: 550`, padding `80px 24px`,
content centered by flex column. The collage layer
(lines 1038-1057) is `position: absolute, inset: 0`, so item
percentages resolve against the full stage box (width W, height H).

Stage height H = viewport height - 100 (all three audited heights
exceed the 550px floor):

| Viewport height | Stage height H |
|---|---|
| 1024 | 924 |
| 1180 | 1080 |
| 1366 | 1266 |

### 1.2 Card sizes

Widths are exact from source. Heights are content math (padding
plus font lines plus SVG aspect ratios), marked EST. Tilt classes
rotate the inner wrapper, so each box below is the tilt-adjusted
bounding box (bbox = W cos t + H sin t, t = tilt angle), which is
the box that can actually touch a neighbor. Float animation moves
items straight up 0 to 8px only (keyframes lines 690-693), desynced,
so it can never create a horizontal overlap and changes vertical
gaps by at most 8px. All conclusions below hold at worst float
phase.

| Item | Source | Rest W x H | Tilt | Bbox W x H |
|---|---|---|---|---|
| docking | hero-collage/DockingCard.tsx (width 230, SVG 200x118, 2 caption lines) | 230 x 185 EST | -3deg (card-a) | 239 x 197 |
| review | hero-collage/ReviewCard.tsx (width 220, 3 funnel bars + 2 arrows) | 220 x 209 EST | +2deg (card-b) | 227 x 217 |
| poster | hero-collage/PosterCard.tsx (width 260, 3-line title + meta + footer) | 260 x 202 EST | -1deg (card-c) | 264 x 207 |
| faers | hero-collage/FaersCard.tsx (width 240, 40px figure + 2-line flow) | 240 x 167 EST | +2deg (card-b) | 246 x 175 |
| stroke | hero-collage/StrokeCard.tsx (maxWidth 260, 2-line title + 2-line meta) | 260 x 125 EST | +2deg (card-b) | 264 x 134 |
| db-pubmed | hero-v8/DbLogoFloat.tsx CONFIG (tile 100, art 24 + padding 24 + border 2) | 100 x 50 | +2deg (card-b) | 102 x 54 |

Rotation is about each card center, so a left-anchored card grows
about half its expansion past its anchor edge, and a
right-anchored card grows past its anchor edge the same way. The
x bands in section 3 already include that shift.

### 1.3 Word and frame band

The frame (`maxWidth: 1160`, `width: 100%`, padding `28px 32px`)
spans x = 24 to x = W - 24 at every tablet width. Word size:
72px at 768/820 (the max-width 903px cap, lines 775-779), about
164px at 1024 (16vw), 180px at 1160 (cap). Frame height =
56 + 0.95 x word size; label adds 46px above it (12px text +
32px margin). The frame paints at z-index 1, above the collage
(z-index 0), so an item behind the frame is crowding, not a true
overlap. Frame vertical bands:

| Width | Word | Frame height | Frame y at H=924 | Frame y at H=1080 | Frame y at H=1266 |
|---|---|---|---|---|---|
| 768, 820 | 72px | 124 | 423 to 547 | 501 to 625 | 594 to 718 |
| 1024 | 164px | 212 | 379 to 591 | 457 to 669 | 550 to 762 |
| 1160 | 180px | 227 | 372 to 599 | 450 to 677 | 543 to 770 |

Word fit check: at 768/820 the word needs about 385px at 72px
against 656/708px of frame content (fits one line). At 1024 it
fits by about 23 to 62px and at 1160 by about 85px (prior tablet
report, same model). No wrap, no frame growth, at any audited
width.

## 2. Visibility at tablet widths

Hide rules (Hero.tsx lines 713-767) applied to COLLAGE_ITEMS
(lines 185-235):

- hide-mid (none at max-width 1160px): hides helix (line 186)
  and awards (line 197) at ALL tablet widths.
- hide-1300 (none at max-width 1300px): hides microscope
  (line 201) and stickers (line 235) at ALL tablet widths.
- hide-1400 (none at max-width 1400px): hides gutaxis (196),
  search (199), posterwindow (200), desk (202), db-elsevier
  (210), db-scopus (211), db-cochrane (234) at ALL tablet
  widths.
- hide-720-1160 (none at 720-1160px): hides notify (203) at
  ALL tablet widths.
- hide-min-720 (none at min-width 720px): hides the four
  mobile-only logo tiles (193, 195, 207, 208) at ALL tablet
  widths.
- hide-1000 (none at max-width 1000px): hides review (187)
  at 768/820 only; review SHOWS at 1024/1160.
- hide-min-1400 (none at min-width 1401px): poster (188)
  shows at tablet (it hides only above 1400).
- hide-short (height max 700px) and hide-750 (height max
  750px): never fire at heights 1024/1180/1366.

Visible collage set:

| Width | Visible items (5 or 6) |
|---|---|
| 768, 820 | docking, poster, faers, stroke, db-pubmed |
| 1024, 1160 | docking, review, poster, faers, stroke, db-pubmed |

The only logo tile visible at tablet is db-pubmed (left 43%,
bottom 5%, line 209). Elsevier, Scopus, and Cochrane return
only above 1400px.

## 3. Bounding boxes

### 3.1 X bands per width (tilt-adjusted, px from stage left)

| Item | W=768 | W=820 | W=1024 | W=1160 |
|---|---|---|---|---|
| docking (left 2.5%) | 15 to 254 | 16 to 255 | 21 to 260 | 24 to 264 |
| review (right 29%) | hidden | hidden | 503 to 731 | 600 to 827 |
| poster (right 2.5%) | 487 to 751 | 538 to 801 | 737 to 1000 | 869 to 1133 |
| faers (left 2.5%) | 16 to 262 | 18 to 263 | 23 to 269 | 26 to 272 |
| stroke (right 2.5%) | 487 to 751 | 537 to 802 | 736 to 1001 | 869 to 1133 |
| db-pubmed (left 43%) | 329 to 431 | 352 to 454 | 439 to 541 | 498 to 600 |

Stage edge margins: left-anchored items sit 15-26px inside the
left edge; right-anchored items sit 17-24px inside the right
edge (tilt-adjusted). Nothing crosses the stage edge.

Note at 1160: db-pubmed right edge (600) exactly meets review
left edge (600) in x, but pubmed is a bottom-band item and
review is a top-band item (section 3.2), so they never touch.

### 3.2 Y bands per stage height (tilt-adjusted, px from stage top)

| Item | H=924 | H=1080 | H=1266 |
|---|---|---|---|
| docking (top 3%) | 22 to 219 | 27 to 223 | 32 to 229 |
| review (top 3%) | 24 to 241 | 28 to 245 | 34 to 251 |
| poster (top 2%) | 16 to 223 | 19 to 226 | 23 to 230 |
| faers (bottom 4%) | 716 to 891 | 866 to 1041 | 1044 to 1219 |
| stroke (bottom 5%) | 748 to 882 | 897 to 1031 | 1073 to 1207 |
| db-pubmed (bottom 5%) | 826 to 880 | 974 to 1028 | 1151 to 1205 |

Top band bottoms reach at most 251px; bottom band tops start
at 716px or lower. Cross-band vertical separation is at least
465px at the shortest stage and grows with H.

## 4. Per-size verdict grid

One row per width x height combo. "Overlap" means true box
overlap between two collage items. "Near-miss" means a gap
under 24px.

| Width | Height | Item-item overlaps | Near-misses under 24px | Frame-band clearance (min) |
|---|---|---|---|---|
| 768 | 1024 | none | none | 169px (frame bottom to faers top) |
| 768 | 1180 | none | none | 247px |
| 768 | 1366 | none | none | 326px |
| 820 | 1024 | none | none | 169px |
| 820 | 1180 | none | none | 247px |
| 820 | 1366 | none | none | 326px |
| 1024 | 1024 | none | review/poster 6px (tilt-adj) / 11px (rest) | 125px (frame bottom to faers top) |
| 1024 | 1180 | none | review/poster 6px / 11px | 203px |
| 1024 | 1366 | none | review/poster 6px / 11px | 282px |
| 1160 | 1024 | none | none | 117px (frame bottom to faers top) |
| 1160 | 1180 | none | none | 195px |
| 1160 | 1366 | none | none | 274px |

Headline: ZERO true item-item overlaps among collage items at
any of the 12 tablet combos. The single sub-24px pair is
review/poster at width 1024, and it is height-independent
(both items are top-anchored, so their gap does not move with
H). Frame-band clearance is at least 109px even at worst
float phase (117px rest minus 8px float rise at 1160 x 1024).
Top-band clearance above the frame is at least 138px
(review bottom 241 to frame top 379 at 1024 x 1024).

## 5. Ranked pairs

### P1. review vs poster at 1024 (NEAR-MISS, the only one)

- Boxes: review 503 to 731, poster 737 to 1000 (tilt-adjusted).
  Gap 6px. Rest (untilted) boxes: review 500 to 727, poster
  738 to 998, gap 11px. Either way under the 24px rule.
- Why: the responsive fix moved review right 27% to 29%
  (Hero.tsx line 187), which closed the pre-fix 9px overlap
  into an 11px rest gap, but tilt expansion eats about 5px
  of it (review grows 3.6px right, poster grows 1.7px left
  plus 1.7px right shift of its box center math; net gap
  6px). Float cannot change it (vertical motion only).
- Vertical overlap exists (review 24-241, poster 16-223)
  but does not matter while the horizontal gap holds.
  This is a graze risk, not a current overlap: any future
  widening of either card (longer title, larger art) closes
  it.
- Fix (see section 7, R1): review right 29% to 31%.

### P2. review vs poster at 1160 (PASS, watch)

- Boxes: review 600 to 827, poster 869 to 1133. Gap 42px
  tilt-adjusted (47px rest). Passes with margin. No action
  required; listed because it is the same pair as P1 and the
  R1 fix improves it to about 65px.

### P3. db-pubmed vs stroke at 768 (PASS, tightest logo gap)

- Boxes: pubmed 329 to 431, stroke 487 to 751. Gap 56px.
  Vertical overlap exists (pubmed 826-880 inside stroke
  748-882) but the horizontal gap holds. Passes. This is
  the tightest logo-to-card gap at tablet.

### P4. faers vs db-pubmed at 768 (PASS)

- Boxes: faers 16 to 262, pubmed 329 to 431. Gap 67px.
  Vertical overlap exists (pubmed inside faers band) but
  the horizontal gap holds. Passes.

### All other pairs

- Docking vs poster: 233px (768) to 605px (1160). Docking vs
  review: 243px (1024), 336px (1160). Faers vs stroke: 225px
  (768) and up. Pubmed vs faers/stroke at 820 and above:
  83px and up. Top vs bottom bands: at least 465px vertical
  separation. No pair other than P1-P4 is within 100px
  except review/poster at 1160 (42px, P2).

## 6. Logo tiles vs nearby cards (tablet)

Only db-pubmed shows at tablet (section 2). Its gaps:

| Width | To faers (left) | To stroke (right) | Verdict |
|---|---|---|---|
| 768 | 67px | 56px | PASS |
| 820 | 89px | 83px | PASS |
| 1024 | 170px | 195px | PASS |
| 1160 | 226px | 269px | PASS |

No logo tile overlaps or grazes any card at tablet. The
tightest logo geometry in the whole tablet slice is P3
(56px, pubmed to stroke at 768). Elsevier, Scopus, and
Cochrane are hidden at tablet by hide-1400, so their
desktop near-misses (docking/Cochrane, desk/Elsevier) do
not exist here.

## 7. Repositioning suggestions (not implemented)

### R1. review right 29% to 31% (Hero.tsx line 187) - RECOMMENDED

Moves review left by 2% of W: 20px at 1024, 23px at 1160.
Result: review/poster gap 6px to about 26px tilt-adjusted
at 1024 (31px rest), and 42px to about 65px at 1160.
Side effects checked: review left edge at 1024 moves 503
to 483, still 223px clear of docking right (260); review
stays in the top band, so frame clearance is unchanged;
review vs poster at 1160 stays comfortable. Do NOT move
poster right instead: poster tilt-adjusted right margin
is already 24px at 1024, and moving it right eats that
margin. Do NOT shrink review width: the funnel bars are
sized to 220px and would reflow.

### R2. db-pubmed left 43% to 41% (Hero.tsx line 209) - OPTIONAL

Only if the owner wants more air around PubMed at 768:
pubmed/stroke gap 56px to about 71px, faers/pubmed gap
67px to about 52px. Both stay above 24px either way, so
this is polish, not a fix. Skip unless the live preview
reads as crowded.

### R3. No action for the rest

Docking, poster, faers, stroke need no moves at tablet.
The hidden set (helix, awards, microscope, stickers,
gutaxis, search, posterwindow, desk, notify, other logos)
needs no tablet change; their hide rules already produce
the clean 5/6-item compositions above.

## 8. Appendix: diorama layer (not COLLAGE_ITEMS, flagged separately)

The cursor-chip and fact-pill layer (Hero.tsx lines 100-135,
z-index 2, above cards) is NOT part of the collage audit
above, but it can sit on top of cards on hover-capable
tablets, so it is flagged here for the owner's absolute
zero-overlap rule:

- The layer is `display: none` under `@media (hover:
  none)` and pills hide below 900px width, so a
  touch-only iPad never sees it. An iPad with a
  trackpad or mouse does.
- Chips rest at anchors and drift on radii up to 56px:
  FAERS chip (left 4%, top 16%) drifts over the docking
  card region at every tablet width; StrokeSense chip
  (right 4%, top 20%) drifts over the poster card region;
  Code for Cure chip (left 5%, top 82%) drifts over the
  faers card region; Seoul 2026 chip (right 5%, top 76%)
  grazes the stroke card top edge by about 6px at rest
  (drift varies it). Chips paint above cards by design
  (z-index 2), so this is layering, not a collage bug.
- Fact pills at 1024/1160 clear all cards: Seoul pill
  (top 30%, right 10%) sits at least 32px below review
  bottom at the shortest stage; Code for Cure pill
  (bottom 30%, right 14%) sits at least 73px above
  stroke top; FAERS pill (top 64%, left 7%) sits at
  least 97px above faers top.
- If the owner's rule is absolute zero overlap
  anywhere, the clean fix is hiding `.mv-diorama` at
  max-width 1160px (one rule, mirrors the existing
  below-900px pill rule). If cursor chips are wanted
  on mouse-equipped tablets, re-anchor them into the
  empty middle bands instead. Either way this is a
  product decision, not a collage repositioning, so no
  change is proposed here beyond this note.

## 9. Sensitivity and live checks owed

- Card heights are estimates (section 1.2, about plus or
  minus 10px). The binding gaps in this report are
  horizontal (P1-P4) or frame clearances with at least
  109px margin, so a 10px height error changes no
  verdict. A width error would matter only for P1: if
  review or poster renders 18px wider than modeled, P1
  becomes a true overlap at 1024.
- Tilt is included in every box. Without tilt, P1 reads
  11px instead of 6px; no other verdict changes.
- Float phase is included as worst case (8px vertical).
  No verdict changes across float phase.
- Live checks owed on a real iPad or the Netlify
  preview (sandbox cannot render pixels): (a) 1024px
  width, review/poster gap reads as a clean gap, not a
  touch; (b) 768px width, PubMed tile clear of faers
  and stroke; (c) a mouse-equipped iPad, whether
  diorama chips resting on cards reads as intended
  layering or as clutter (decides R-appendix action);
  (d) 1160px width, review/poster gap comfortable.
