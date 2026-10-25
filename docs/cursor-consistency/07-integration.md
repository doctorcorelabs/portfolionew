# Integration: cursor-consistency final tweaks + re-verification

Status: integration agent, 2026-10-25. Base: HEAD `1255c6f` + fixer 1,
2, 3 uncommitted diffs (tree arrived dirty; my edits are ONLY the
lines listed below, verified by inspection - desktop anchors,
companions, gates, pill rules, collage values grep-proven unchanged).
No push (parent pushes). Build PASSES (6.71s). Diff em dash: 0.

## Edits (exactly three anchor tweaks + doc correction)

1. FAERS MINIATURE anchorX 0.195 -> 0.26 (`MINI_CURSOR_CHIPS` only).
2. StrokeSense MINIATURE (0.55, 0.45) -> (0.60, 0.34) (`MINI_CURSOR_CHIPS`
   only). Comment on the const updated to note the divergence from
   desktop short-state anchors.
3. CFC TABLET PORTRAIT anchorY 0.38 -> 0.45 (`TABLET_ANCHORS`
   portrait only). JSX follows the table via `chipBaseAnchor`, so
   CSS and JS stay in sync with no second edit.
4. Seoul miniature: NO change (no clean miniature-only fix exists,
   per QA-layout §9).
5. `02-motion-design.md` speed correction (QA-motion §2): dart peaks
   are 10-14 px/s, NOT ~19 (geometric and angular peaks are
   anti-aligned and never coincide). Fixed both occurrences (body
   text + parameter table); the tablet column was also corrected to
   ~8-12 px/s (QA-motion measured landscape peak 12.36, portrait
   peak 7.73), and the body multipliers to ~1.5x mean / ~1.9x peak.
   Anchor lists in `02` still describe the pre-tweak design anchors;
   the as-shipped anchors are in this file and in `04`.

## Miniature re-verification (stage 1160x600, new anchors)

Model: QA box geometry + ellipse-true sampler (dart-dwell, N=2880,
float toward chip only when the card is below the chip, no parallax)
+ PIL pixel-true glyph check (Inter VF 700, 180px, tracking -1.8,
both trailing-tracking variants - identical verdicts). Chip sizes
73/116/130/109 x 21; drift rx 40 / ry 28. Rest table lists pairs
within 40px x / 80px y; all other pairs separate by more.

### Rest (all clear)

FAERS vs docking x-clear 37.9, vs review x-clear 39.5; StrokeSense
vs scopus y-clear 39.1, vs glyph-band y-clear 31.7, vs label
x-clear 34.5; CFC vs elsevier y-clear 79.3; Seoul vs awards
y-clear 12.5, vs glyph-band y-clear 25.3. FAERS and StrokeSense
rest parks are GONE (were 27.9 deep and 336 ink px respectively).

### Sampled worst + durations (ellipse-true)

| Pair | Worst depth | Max continuous | Budget | Verdict |
|---|---|---|---|---|
| FAERS vs docking | 2.1 design | 0.73s / 12s cycle | 12px / 3s | PASS |
| FAERS vs review | 0.5 design | 0.18s | 12px / 3s | PASS |
| StrokeSense vs scopus | clear (worst y 11.1) | 0 | - | PASS |
| StrokeSense vs review | clear (worst x 14.9) | 0 | - | PASS |
| StrokeSense vs label | clear | 0 | - | PASS |
| CFC vs elsevier / pubmed / faers | clear (worst y 43.3 / 44.3 / 35.9) | 0 | - | PASS |
| Seoul vs poster | clear (worst x 17.3) | 0 | - | PASS |
| Seoul vs awards | 23.5 design (7.9 visual @390) | 7.04s / 15s | 12px / 3s | FAIL, disclosed |
| Chip-chip (all 6 pairs) | clear (thinnest FAERS-SS y 13.0 worst) | 0 | - | PASS |

### Pixel-true glyph check (governs over box artifacts)

- StrokeSense: 0 ink px over the full cycle; min y-gap 4.7px
  (local ink top 257.7 in its columns; QA's 3.7px used the global
  ink top 256.7 - the local figure is the correct one). FULLY
  CLEAR. The naive box "4.3px glyph touch" is an artifact: it
  applied card float to non-floating glyphs (glyphs do not
  float) - without float the box is clear by 3.7px, and pixels
  by 4.7px.
- StrokeSense vs label: CLEAR on-ellipse. The naive "1.7px
  label touch" is an artifact: it combined dx -40 with dy -28,
  which cannot co-occur on the ellipse (up-drift happens at
  cos ~ 0, where dx = 0 and x-clear is 34.5px).
- Code for Cure glyph: 0 ink px; min y-gap 1.3px at extreme
  up-drift only (hairline, not a park). The box "2.7px" is the
  box-bottom overstatement (local ink bottom 387.7, not 391.7).
- Seoul glyph: 36 ink px (alpha > 0), 19 px (alpha > 128),
  max continuous 2.99s, depth 0.7px design (0.24px visual).
  INSIDE budget on both axes, but duration sits at the budget
  edge (2.99 vs 3.00s) and placement uncertainty is ~1px, so
  it could tip marginally over - at sub-visible depth either
  way. Disclosed as a hairline, not a park. (Box bound for the
  same pair is 2.7px / 3.79s; pixel-true governs.)
- FAERS glyph: 0 ink px, min y-gap 27.7px.

MINIATURE VERDICT: FAERS and StrokeSense fixes CONFIRMED.
Seoul-awards is the ONLY visible over-budget miniature pair
(rest clear 12.5, worst 23.5 design, 7.04s continuous - same
numbers as fixer 3 / QA, unchanged because Seoul was not
touched). No new miniature pair broke.

## Tablet portrait CFC at anchorY 0.45 (radius 14, ry 9.8)

Model: `tablet_chip_model` cards + frame/glyph box + label strip
(top = frame_top - 46, height 14.4, width 170 centered); drift
only for glyph/label, drift + parallax 8 + float 8
(direction-correct) for cards; durations sampled (dart-dwell,
11s cycle). W grid 720-1000, S = 550 / 600 / 668 / 924.

### W <= 903 (72px word): label park GONE, short-S glyph caveat

| S (VH) | Label rest / worst | Glyph rest / worst / duration | Worst card |
|---|---|---|---|
| 550 (650) | 43.3 / 33.5 clear | 3.3 / 6.5 park / 4.78s OVER | docking 23.3 clear |
| 600 (700) | 40.8 / 31.0 clear | 5.8 / 4.0 park / 4.14s OVER | docking 44.3 clear |
| 668 (768) | 37.4 / 27.6 clear | 9.2 / 0.6 park / 2.40s inside | elsevier 39.1 clear |
| 924 (1024) | 24.6 / 14.8 clear | 22.0 / clear / 0s | stickers 63.7 clear |

Label park is gone at every S (was a rest park at W 720-826,
VH 692-987). At 768x1024: label rest 24.6 (QA: 24.8, 0.2 =
rounding), glyph rest 22.0 (QA: 12.4 - model-box difference,
both clear). Short-stage glyph caveat CONFIRMED, slightly
worse than QA's estimate (QA: 6.3/4.2s, 3.8/3.2s, 0.4/1.0s;
mine: 6.5/4.78s, 4.0/4.14s, 0.6/2.40s) - same verdicts:
over at S=550/600, inside at S=668/924. Chip-chip CFC vs
FAERS/SS/Seoul: all clear (thinnest CFC-SS worst 14.4 at
720x550). Cards: all clear at every S.

### NEW FINDING: W 904-1000 glyph park (regression from this tweak)

The portrait table (720-1000) spans the 903px word-size
discontinuity: above 903px the word is `clamp(72px, 16vw,
180px)` = 144-160px, NOT 72px (verified from the inline h1
style + the max-width 903px cap rule). QA's CFC direction was
derived and checked at 72px-word widths only. At W 904-1000
the OLD anchor (0.38) was fully clear; the NEW anchor (0.45)
parks on the glyph band at rest, full cycle:

| W (word) | S | OLD 0.38: glyph / label | NEW 0.45: glyph / label |
|---|---|---|---|
| 904 (145px) | 550 | clear 15.4 / clear 39.3 | PARK 23.1 / clear 77.8 |
| 904 (145px) | 668 | clear 29.6 / clear 25.1 | PARK 17.2 / clear 71.9 |
| 904 (145px) | 924 | clear 60.3 / clear 20.0 | PARK 4.4 / clear 59.1 |
| 960 (154px) | 550 | clear 12.2 / clear 43.6 | PARK 26.3 / clear 82.1 |
| 960 (154px) | 668 | clear 26.3 / clear 34.6 | PARK 20.4 / clear 76.2 |
| 960 (154px) | 924 | clear 57.0 / clear 34.6 | PARK 7.6 / clear 63.4 |
| 1000 (160px) | 550 | clear 9.8 / clear 46.6 | PARK 28.7 / clear 85.1 |
| 1000 (160px) | 668 | clear 24.0 / clear 45.0 | PARK 22.8 / clear 79.2 |
| 1000 (160px) | 924 | clear 54.7 / clear 45.0 | PARK 10.0 / clear 66.4 |

Depths are rest depths (box); the chip sits inside the glyph
band vertically at all drift phases (chip y-range stays
inside the band), so this is a continuous park, not a
transient. W 904-1000 includes half-screen desktop windows
(e.g. 960px on a 1920 screen) - realistic, not rare. The
tweak fixes the label park where it existed (W <= 903) and
breaks glyphs where the old anchor was clear (W 904-1000).

TABLET VERDICT: CONDITIONAL. The prescribed tweak works at
W <= 903 but introduces a new glyph park at W 904-1000. A
clean fix needs a sub-band split (portrait <= 903: CFC 0.45;
portrait 904-1000: CFC 0.38 or a new value) - that requires
a third TABLET_ANCHORS key + state/loop/JSX wiring, which is
beyond this integration brief ("exactly three tweaks"). The
parent must decide: (a) ship with this disclosed, or
(b) hold for the split follow-up.

## Desktop untouched (grep proof)

- `CURSOR_CHIPS` unchanged: FAERS 0.195/0.30, StrokeSense
  0.55/0.33, CFC 0.30/0.695, Seoul 0.80/0.695 (lines 107-110).
- Section-loop companions intact: `laptopMql` serves Seoul
  0.70 and StrokeSense 0.45.
- `TABLET_ANCHORS` landscape fully unchanged; portrait
  FAERS/SS/Seoul unchanged; only portrait CFC anchorY moved.
- `MINI_CURSOR_CHIPS`: only FAERS anchorX and StrokeSense
  anchorX/anchorY overrides changed; CFC = desktop base,
  Seoul = 0.70 override kept.
- No gate, pill rule, collage value, or desktop anchor was
  touched by this agent (the combined tree diff also contains
  fixers 1-3, which the parent already reviewed).

## Handoff for parent push

Final state: miniature FAERS + StrokeSense FIXED (pixel-proven);
Seoul-miniature transient DISCLOSED (23.5 design / 7.9 visual,
7.04s - only visible over-budget miniature pair); Seoul-glyph
hairline DISCLOSED (0.7px, 2.99s, at budget edge, sub-visible);
tablet label park FIXED at W <= 903 with short-S glyph caveat
DISCLOSED (S=550: 6.5px/4.78s; S=600: 4.0/4.14s; S=668:
0.6/2.40s inside; S=924: clean); NEW tablet glyph park at
W 904-1000 DISCLOSED (rest 4.4-28.7, continuous) - parent
decision required before shipping as clean (ship-with-
disclosure vs hold-for-split). Pre-existing desktop parks
NOT touched and still disclosed for a later global round:
FAERS-docking drifting (W < 1380, VH < 804), SS-glyph
1161-1400 all realistic heights, SS-search above 1400
(continuous park at VH <= 800).
