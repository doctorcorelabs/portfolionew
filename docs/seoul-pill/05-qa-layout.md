# QA-layout: moved CFC pill above 1400px (independent recompute)

Base: HEAD `5fd1ccf` + fixer diff (1 hunk, 9 insertions, verified:
new `@media (min-width: 1401px)` rule, `bottom: 15% !important`,
`right: 5% !important`, after the laptop CFC rule). Model rebuilt from
source, not copied: pill 114x25, float -10px (shipped `mv-float`
keyframes, verified); chips FAERS 73 / SS 116 / CFC 130 / Seoul 109
wide, drift 20/14, heights 28 governing and 21; cards tilt per class
(rotated bbox) + float union [top-8, bottom]; glyphs W/2 ±490 x
[S/2-49.3, S/2+91.7]; label W/2 ±84.5 x [S/2-136.7, S/2-122.3];
posterwindow 280x355; frame bottom S/2+136.7. Pair overlaps iff BOTH
axes intersect. Grid: W 1401-2560 (step 10 + boundaries 1438/1510/
1678/1900/2233/2435) x S 550-1300 (step 10 + boundaries 583/634/661/
700/782/851), rest + worst, all above-1400 obstacles with gates
(helix/cochrane S>=751, microscope S>=801, notify S>=882,
stickers S>=951). Script: `/tmp/qa_layout_pill.py` (scratch, uncommitted).

## Calibration: baseline reproduces exactly (model trusted)

Current pill (bottom 30% / right 14%) at 1401/550, h=28:

| Park | Rest | Worst |
|---|---|---|
| Seoul (target) | x -29.9, y -2.8 | x -49.9, y -16.8 |
| Glyphs graze | x -99.6, y -6.7 | x -99.6, y -16.7 |
| Posterwindow | x -118.9, y -55.5 | x -118.9, y -65.5 |

All three match 02/04 to 0.1px. Zone edges also match (Seoul x 0 at
W=1900, glyphs x 0 at W=1678, posterwindow x 0 at W=2435).

## Binding pairs, moved pill @1401/550

| Pair | Rest (x, y) | Worst (x, y) | Binding |
|---|---|---|---|
| FAERS chip | -44.0, 27.5 | -64.0, 13.5 | y 13.5 |
| Posterwindow | -149.0, 27.0 | -149.0, 17.0 | y 17.0 |
| Seoul chip | 96.2, 32.2 | 76.2, 8.2 | x 76.2 (y 8.2 also) |
| Glyphs | 26.5, 75.8 | 26.5, 65.8 | x 26.5 |
| Elsevier | 131.0, 2.3 | 131.0, -5.7* | x 131.0 |
| SS chip | 509.4, 29.5 | 489.4, 5.5 | doubly separated |
| CFC chip | 666.7, 32.2 | 646.7, 8.2 | doubly separated |
| Label | 432.0, 289.8 | 432.0, 279.8 | doubly separated |

\* Elsevier worst y is negative below S~607 (0.10S-60.7 tilt+float
inclusive: -5.7 @550, 0.0 @607, +0.3 @610) but x separates by
131.0px throughout, so the pair is CLEAR. The fixer reasoning is
CONFIRMED: y-adjacency is not an overlap when x separates by 131px.
Same logic holds for SS/CFC (y 5.5/8.2 worst, x 489.4/646.7).

At h=21 the binding worst figures are unchanged (FAERS 13.5,
posterwindow 17.0, Seoul x 76.2, glyphs x 26.5, elsevier x 131.0);
only chip y-gaps grow (Seoul 15.2, SS 12.5, CFC 15.2).

## Full-grid verdict: ZERO overlaps

Moved pill, rest + worst, h=28 AND h=21: **0 overlaps** across the
whole grid. All three parks are gone at rest and worst everywhere.
Thinnest worst margins both sit at (1401,550) and grow with W and/or
S (FAERS y = 0.05S-14, posterwindow y = 0.74S-35-H).

## Posterwindow height sensitivity: confirmed

Worst y gap at S=550: 17.0 @H=355 (measured), 12.0 @360, 7.0 @365,
2.0 @370, 0.0 @372, -1.0 @373. Margin survives height to 372px,
as claimed. No sensitivity failure.

## Frame and label: confirmed

Pill top min vs frame bottom (S/2+136.7): 20.8px @550, 73.3 @700,
143.3 @900, 283.3 @1300 (formula 0.35S-171.7). Pill sits fully below
the frame bottom at every S>=550: no frame-border crossing. Label
is doubly separated (432.0 x / 279.8 y worst).

## Converge (hover-only): residual fixed, Seoul correction confirmed

Moved pill vs converged band [S/2+114.7, S/2+142.7] (h=28) in y:
14.8 @550, 32.3 @600, 67.3 @700, 277.3 @1300 (h=21: 18.3 @550).
Current pill overlaps that band for S~574-888 (h=28) / 591-871
(h=21): the disclosed FAERS-converge-vs-CFC-pill residual is GONE
for the moved pill at all S. Converged Seoul x-separation @1401:
96.2 rest, 76.2 worst (drift) - NOT the synthesis ">=450px"
figure, which holds only for SS (489.4 worst) and CFC (646.7
worst). The fixer correction is CONFIRMED: converged Seoul is
still clear, doubly separated (x 76.2 + y 14.8 worst). Path
argument: FAERS endpoints both clear in y (13.5 drift, 14.8
converged), Seoul endpoints clear in both axes, so blend paths
stay clear; no mid-path excess.

## Corrections to the record (non-blocking)

1. Elsevier rest figures are tilt-inclusive here (x 131.0, y 2.3);
   the fixer 132.3/5.0 are untilted rest. Worst figures agree
   exactly (131.0, -5.7). No verdict impact.
2. The "rest >= 250px" claim in 02/synthesis is WRONG: thinnest
   rest margins are glyphs x 26.5, posterwindow y 27.0, FAERS y
   27.5 (all @1401/550). Worst-phase margins govern, all positive,
   sweep clean - documentation fix only.
3. Synthesis item (d5) ">=450px @1401" corrected per above (Seoul
   76.2 worst, doubly separated).
4. Non-blocker, parent's call: the laptop rule's comment still says
   "Above 1400px the pill stays at bottom 30% (status quo)" - now
   stale. Fixer left it per the exactly-one-rule spec.

## Verdict: SHIP

No blockers. The moved pill clears the target park, both newly found
pill parks, and the FAERS converge residual, with zero worst-phase
overlaps on the full grid and both thinnest margins positive and
growing with W/S. Live-preview items for the parent: desktop
1401x550-650 (thinnest margins) and 1440x800-900 (spot-check pill
corner position); no tablet/miniature re-check needed from layout
(the rule is 1401px+ scoped, no loop/H-band/gate touched).
