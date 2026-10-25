# 09 - Fixer 2: StrokeSense lanes (desktop-parks round)

Shipped exactly the synthesis SS package. Base (0.55, 0.33) -> (0.505, 0.70);
new anchorX companion 1161-1400 (0.55, 0.70); anchorY companion DELETED.
Fixer 1's FAERS lanes, Seoul, CFC, tablet, pills, gates, durations, phases,
radii, labels, and CURSOR_CHIPS order untouched. Not pushed (parent owns it).

## Shipped lanes and margins (rest / worst)

Model: dense grid W 1161-2560 x S 550-1300, chip 116x21 (h=28 re-run changes
nothing material), drift +-20/+-14, cards tilt + parallax 8 + float 8 toward
chip, chip-chip relative drift 40/28, glyphs on 02's wider envelope (W/2
+-490, column-aware). Worst = most adverse phase. All margins below are the
binding axis; the other axis is stated only where it matters.

Companion (0.55, 0.70), 1161-1400: ZERO rest parks, ZERO worst overlaps.
Glyphs (below baseline) 18.3 / 4.3; CFC chip 44.3 / 4.3 (x, y overlaps);
awards 41.0 / 11.9 (x; 05's 12.9 was untilted, mine is tilt-inclusive);
Seoul pill 46.4 / 26.4 (x); Seoul chip 65.1 / 25.1 (x); review-new 167.0 /
149.2 (y, y-clear confirmed); label 232.3 / 218.3 (y). All other pairs
>= 42.8 worst. The old 0.45 x-height contact (worst 13.8px) is gone.

Base (0.505, 0.70), above 1400: ZERO rest parks; ONE worst overlap (gutaxis,
below). Search 143.0 / 126.7 (y): the 104px continuous rest park is GONE.
Label 232.3 / 218.3 (y): the 116x14.4 rest park is GONE. Review-old x 67.2 /
35.7 (y 161.5+, never binds): the old drift contact is GONE. Glyphs 18.3 /
4.3. Desk 35.0 / 5.3 (x). Seoul chip 304.3 / 264.3; Seoul pill x 119.1 /
99.1; posterwindow 378.5 / 350.5. All other pairs >= 42.8 worst.

## Two corrections to 05 (both positive, both thinner than briefed)

- Base CFC chip-chip worst is 1.2px, not 21.2px. 05's 21.2 = rest 41.2
  minus SINGLE drift (20). Under 01's governing relative-drift standard
  (40), 41.2 - 40 = 1.2 at W=1401/S=550. It is the thinnest margin of the
  round: positive, but a fleeting dart alignment (SS 14s/0.3 vs CFC 11s/0.55;
  worst alignment recurs on a ~51s cycle and passes fast, since dart-dwell
  is fastest at the extremes). It replaces the 104px search park, so the
  trade is favorable, but QA must explicitly accept 1.2px, not 21.2px.
- Companion awards worst is 11.9px, not 12.9px (tilt ex 1.1 included).

## Joint SS vs FAERS (fixer 1's NEW lanes, drift AND converge)

- Laptop, FAERS (0.85, 0.04) vs SS companion: rest x 275.3 / worst x 235.3
  (y-separated by 314.0+ worst). Reproduces 08 exactly. Converge: FAERS
  goes to the word top edge, SS to the bottom edge, so they are
  y-separated by ~190px+ at full blend; no converge contact.
- Wide, FAERS (0.90, 0.90) vs SS base: rest x 480.4 / y 89.0; worst x 440.4
  / y 61.0 (doubly separated, both axes large). Converge: both go to the
  bottom edge band, so y overlaps and x decides: 480.4 endpoint / 440.4
  swept. Clean in both bands, both regimes. No joint change needed.

## Converge (hover endpoints clean, paths shallow)

Converged SS = bottom edge band [S/2+118.2, S/2+139.2], x = rest x +- drift
(center is inside the word rect horizontally at every desktop width, and
the bottom edge is nearest at every S). Endpoints clear of search (148.9+),
label (240.5), glyphs (26.5 below baseline), review-old/new, posterwindow,
and all pills. Swept path (blend 0->1 over all drift phases, scrollPhase
covered by the drift box) equals drift worst for every card pair: desk
5.3, awards 11.9, CFC 4.3/1.2, Seoul 25.1/264.3. Path glyph gap >= 4.3
everywhere (drift-bound below S=661, converged-bound 26.5 above). The
only converge overlap is gutaxis endpoint -1.0px (parallax-inclusive, at
W=1401/S=550; 6.95px clear without parallax), inside the drift zone below,
not a new zone. No converge-created chip-chip park anywhere.

## Structural residual: SS vs gutaxis transient (CONFIRMED, not worsened)

Base worst overlap 21.0px deep, zone W 1401-1483 x S 550-818 (h=21; to ~844
at the h=28 upper bound), tapering to 0 at W=1483. Rest is CLEAR (x 11.3
at W=1401/S=550), so it is drift-only. Cause confirmed: gutaxis-right to
desk-left gap is ~158-162px at W=1401 (tilt treatment dependent) but a
drifting chip needs 172px (116 + 40 drift + 16 parallax), so no anchorX
clears both cards in x while both overlap SS in y. Fixing it needs a card
move or a width-plus-height companion, both out of scope. It is disclosed,
not fixed, and my implementation matches 05's package exactly (same zone,
same 21.0 depth), so it is not worsened by this edit.

## Miniature: untouched

MINI_CURSOR_CHIPS SS override (0.60, 0.34) is byte-untouched by this edit
(only a stale-comment clarifier nearby); the miniature SS chip does not
move. No second pin needed: SS is fully overridden, unlike FAERS-Y.

## Diff (src/sections/Hero.tsx only)

1. CURSOR_CHIPS StrokeSense: (0.55, 0.33) -> (0.505, 0.70) + comment
   (0.51 rejected: trades desk 5.3px to ~0px; 0.5 flip must not be crossed).
2. Loop effAnchorX: added `StrokeSense && laptopMql -> 0.55`.
3. Loop effAnchorY: DELETED `StrokeSense && laptopMql -> 0.45` branch
   (companion anchorY is now the plain base 0.70).
4. CSS 1161-1400 block: SS rule `top: 45% !important` -> `right: 45%
   !important` (mirrors Seoul's right-30% precedent) + comment rewrite.
5. Comments only: laptopMql comment (anchorY 0.45 -> anchorX 0.55), MINI
   header (dropped stale 0.45), MINI override comment ("old desktop").
JS anchor == CSS base in both bands (wide: right 49.5% / top 70% inline;
laptop: right 45% / top 70%), so drift and converge stay consistent.
chipBaseAnchor unchanged (desktop returns chip).

Build: PASS (7.81s). Em dash in diff: 0. Only Hero.tsx modified, not pushed.

## Handoff for fixer 3 (H-bands)

Rest scan: ZERO SS rest parks in both bands (gutaxis rest x 11.3 clear),
so H5 (SS/search) is DELETABLE after your independent rest scan confirms;
gutaxis is drift-only, so it does not block H5 deletion. H1/H2 are fixer
1's domain (FAERS); H3/H4/H6 stand (Seoul/CFC unmoved, no card moves).
Carry forward for QA: the two thin-margin corrections above (CFC base 1.2,
awards companion 11.9) and the gutaxis transient zone.
