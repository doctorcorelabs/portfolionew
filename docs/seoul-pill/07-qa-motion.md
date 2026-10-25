# 07 - QA motion (Seoul-chip vs CFC-pill fix)

Verdict: **CONDITIONAL SHIP** (conditions §6, all disclosure-only, no
code change). Method: independent model from the loop source
(`Hero.tsx` 616-620, 653-693), not fixer numbers. Base HEAD `5fd1ccf`
+ fixer diff (1 hunk, 9 insertions, CSS only, lines 1507-1515).

## 1. Loop untouched: byte-identical by construction

The diff is one CSS hunk; no JS line changed, so every loop value is
inherited, verified present in source:

| Mechanism | Shipped value | Source |
|---|---|---|
| Durations / phases | 12/14/11/15s, 0/0.3/0.55/0.8 | CURSOR_CHIPS 107-110 |
| Dart-dwell | theta = psi + 0.35*sin(2*psi), radii 20/14 | 653-660 |
| Converge | tau 0.22s, smoothstep, halo 20px (h1 rect +-20) | 616-620, 687-690 |
| Converge target | nearest point on expanded rect to drifting center; inside centers push to nearest edge | 668-683 |
| Touch | drift-only, early return, no converge | 662-665 |
| Miniature | drift-only, no word-rect mapping | 705-711 comment |
| Scroll modulation | phase cap 0.25 loop | 610-614, 739-743 |
| Gating | visible chips only (offsetWidth 0 skip, offscreen skip, reduced-motion check) | 624, 564, 569 |
| JS anchor == CSS base | chipBaseAnchor + laptop companions (Seoul 0.70, FAERS 0.85/0.04, SS 0.55) | 634-650, 886 |

Speed profile (7.2-9.8 mean / 10-14 peak, cursor round) is unchanged:
the formula, radii, durations, and phases are byte-identical, so no
recomputation is needed or claimed.

## 2. Pill float: -10px governing, fixer correct

`mv-float` keyframes (992-995): 0 to -10px to 0. Pills use `mv-float`
(2054). The -8px keyframe (1080-1081) is `mv-collage-float` (cards),
not pills. The brief's -8px was wrong; fixer used -10px (conservative:
-8px would add 2px to every pill-top margin). All margins below use
-10px. Pill float moves the pill UP, so for pairs where the pill sits
above the chip, float-0 is worst; where the pill sits below, float-10
is worst. Direction applied per pair.

## 3. Converge endpoints: residual GONE, separations confirmed

Model: converge rect W/2 +-568 x [S/2-82.3, S/2+128.7] (01, verified
vs loop h1+20 halo); chip widths FAERS 73, SS 116, CFC 130, Seoul 109;
height 28 governing. Converged center = point on rect edge; box =
center +- half-size.

FAERS converged vs moved pill (W=1401, y-gap worst, floated pill top):

| S | Converged box y | Pill top (float) | y-gap |
|---|---|---|---|
| 550 | [389.7, 417.7] | 432.5 | 14.8 |
| 600 | [414.7, 442.7] | 475.0 | 32.3 |
| 700 | [464.7, 492.7] | 560.0 | 67.3 |
| 871 | [550.2, 578.2] | 705.4 | 127.1 |
| 1300 | [764.7, 792.7] | 1070.0 | 277.3 |

Reproduces fixer exactly. The disclosed FAERS-converge-vs-CFC-pill
residual (S 591-871, desktop-parks §7) is GONE at every S: gap =
0.35S - 177.7, positive for S > 508, growing with S. x overlaps
(44px at W=1401) but y separates, so the pair is clear.

Converged chips vs moved pill, x-gap at W=1401, S=550:

| Chip | Converged box right | Pill left | x-gap rest / drift-worst |
|---|---|---|---|
| Seoul | 1120.8 | 1217.0 | 96.2 / 76.2 |
| StrokeSense | 707.5 | 1217.0 | 509.4 / 489.4 |
| Code for Cure | 550.3 | 1217.0 | 666.7 / 646.7 |

CORRECTION to synthesis (d5): converged Seoul is 96.2px rest /
76.2px drift-worst x-separated, NOT ">= 450px". That figure holds
for SS (509.4) and CFC (666.7) only. Seoul is still doubly
separated (x 76.2 worst + y 14.8 worst), so the correction changes
no verdict.

## 4. NEW: FAERS converge PATH crosses the moved pill (disclose)

Endpoints are clean on both sides (drift clear by 13.5px, converged
clear by 14.8px), but the blend path between them passes through the
pill. Reason: the pill (y 0.85S) sits vertically between FAERS drift
(y 0.90S) and its converged position (rect bottom edge S/2+128.7),
and at narrow-wide widths the path x sits inside the pill x-range.
Loop semantics (fx = drift + (converge - drift) * eased) make the
transit retrace on hover-leave, so the zone applies both ways.

| S | Path x-overlap at W=1401 | Zone edge (x-overlap 0) |
|---|---|---|
| 550 | 44.0px (rest-center), ~53px drift-blended worst | W ~1651 |
| 1300 | 44.0px (rest-center) | W ~1776 |

Zone: W 1401-1651 at short stages, widening to W 1401-1776 at tall
stages, all S. During crossing, y-overlap reaches up to the full
pill height (25px) transiently; duration ~0.3-0.5s per transit
(blend tau 0.22s, smoothstep, ~1s settle; 53px of ~105px y-travel
at S=550). Hover-only, transient, never a rest or endpoint park:
same class as the disclosed blend effects in prior rounds (01's
~1s full-pill-height blend touch; desktop-parks hover-only
converge residuals to 73px depth). It does NOT block shipment, but
the final report MUST carry it: it is a new transient introduced
by this fix, not a pre-existing residual.

Other chips' paths do NOT cross the moved pill: Seoul path box
right max = 0.80W, pill left = 0.95W-114, gap >= 96px at W >= 1401;
SS/CFC paths sit far left of the pill. Checked, not assumed.

## 5. Reduced motion, H-bands, new mechanisms: all clean

- Pills hide under reduced motion (1733-1740 block: all three pill
  classes + base selector, display none). The move therefore has
  ZERO reduced-motion impact.
- H3 (1700), H4 (1705), H6 (1710) are outside the diff: byte-identical,
  standing, no change needed or made.
- No new motion mechanism: the new rule carries only bottom/right +
  !important. No animation, no transition, no transform, no loop
  change. The pill jump across 1400/1401 (bottom 45% -> 15%,
  right 14% -> 5%) is a static position step, same class as existing
  chip companion jumps, not a motion change.

## 6. Conditions for ship (disclosure-only)

1. Final report carries the §4 FAERS converge-path crossing zone
   (W 1401-1651 short stages to W 1401-1776 tall stages, up to
   ~44px x / 25px y transient, ~0.3-0.5s per hover transit,
   endpoints clean both sides).
2. Final report corrects synthesis (d5): converged Seoul vs moved
   pill is 96.2px rest / 76.2px worst, not >= 450px (SS 509.4 and
   CFC 666.7 confirmed as stated).
3. Final report carries the §3 endpoint result: FAERS-converge
   residual gone at every S (y-gap 14.8px at S=550, growing).
