# 07 - QA motion (laptop CFC pill bottom 45% -> 74%)

Verdict: **CONDITIONAL SHIP** (conditions §6, all disclosure-only, no
code change). Method: independent model from the loop source
(`Hero.tsx` 610-693), not fixer numbers. Base HEAD `d05a71c` +
fixer diff (2 hunks, stylesheet only: one value line 45% -> 74%
plus comment rewrites, lines 1424 and 1492).

## 1. Loop untouched: byte-identical by construction

The diff touches no JS line, so every loop value is inherited,
verified present in source:

| Mechanism | Shipped value | Source |
|---|---|---|
| Durations / phases | 12/14/11/15s, 0/0.3/0.55/0.8 | CURSOR_CHIPS 107-110 |
| Dart-dwell | theta = psi + 0.35*sin(2*psi), drift 20/14 | 653-660 |
| Converge | tau 0.22s, smoothstep, halo 20px (word rect +-20) | 616-620, 687-690 |
| Converge target | nearest point on expanded rect; inside centers push to nearest edge | 668-683 |
| Touch | drift-only, early return, no converge | 662-665 |
| Miniature | drift-only, no word-rect mapping, below 720px only | 705-711 comment |
| Scroll modulation | phase cap 0.25 loop | 610-614 |
| Gating | reduced-motion early return, offscreen skip, offsetWidth 0 skip | 569, 603-607, 624 |
| JS anchor == CSS base | laptop companions Seoul 0.70, FAERS 0.85/0.04, SS 0.55 | 634-650 |

Speed profile (7.2-9.8 mean / 10-14 peak, cursor round) is unchanged:
formula, radii, durations, phases are byte-identical, so no
recomputation is needed or claimed.

## 2. Pill float: -10px governing, fixer correct

`mv-float` keyframes (992-995): 0 to -10px to 0. Pills use `mv-float`
(2060). The -8px keyframe (1079-1081) is `mv-collage-float`
(cards), not pills. All margins below use -10px, applied
direction-correctly per pair: for chip-above-pill, floated pill
top is worst; for chip-below-pill, float-0 pill bottom is worst.

## 3. CONFIRMED: FAERS converge PATH crosses the moved pill

The synthesis prediction is confirmed on zone and depths, corrected
on duration (see below). Model: converge rect W/2 +-568 x
[S/2-82.3, S/2+128.7] (h1 + 20 halo, as in seoul-pill 07); FAERS
laptop chip (0.85, 0.04), right-anchored, 73 wide, h=28 governing
(also 21). Script `/tmp/qa_motion_laptop.py` (scratch).

Why the crossing is forced: FAERS drift center x sits inside the
rect horizontally at every laptop width (cx range inside
[W/2-568, W/2+568] asserted across the grid), so converged x equals
drift x: the path's x is CONSTANT during blend, and x-overlap with
the pill never leaves the 64.6-73.0px band. Vertically the
endpoints straddle the pill: drift endpoint ABOVE it, converged
endpoint BELOW it. Endpoints, (1161,550), h=28, recomputed:

| Endpoint | Gap | Side |
|---|---|---|
| Drift worst | 44.0px | chip above pill (chip bottom 0.04S+42 vs floated pill top 0.26S-35) |
| Converged (float-0) | 35.7px | chip below pill (converged top S/2-96.3 vs pill bottom 0.26S) |

Drift gap = 0.22S-77 > 0 for S > 350; converged gap = 0.24S-96.3
> 0 for S > 401; both hold for all S >= 550. Zone: the WHOLE
laptop band W 1161-1400 x all S (x-overlap never reaches 0:
minimum 64.6px at W=1161, driftX=+20; 67.0px at W=1400).

Crossing depths and duration (blend b(t) = 1-exp(-t/0.22),
smoothstep eased, sampled 0-3s at 1ms, float extremes):

| Case | x-overlap | Max y-overlap | Duration per transit |
|---|---|---|---|
| h=28, grid | 64.6-73.0px | 25.0px (full pill height; chip 28 > pill 25) | 0.03-0.13s |
| h=21, corner | 64.6-73.0px | 21.0px (full chip height) | 0.10-0.11s |

CORRECTION to synthesis: the predicted duration 0.3-0.5s is an
overestimate borrowed from the seoul-pill geometry. Here the blend
always settles in ~1s regardless of distance, and the pill band
sits in the fast middle of a 143-488px y-travel, so the chip
crosses the 53px overlap window in 0.13s at S=550, shrinking to
0.03s at S=1300. The crossing is real but briefer than predicted.

Retrace: loop semantics (target = hovering ? 1 : 0, same tau and
smoothstep) make the transit retrace on hover-leave, so the zone
applies both ways. Hover-only, transient, endpoints clean both
sides, never a rest or endpoint park: same class as the
seoul-pill FAERS path finding. It does NOT block shipment, but
the final report MUST carry it: it is a new transient introduced
by this fix, and it is structural (shared by every above-band
candidate, since the straddle holds for all b > 67.5% at S=550),
not a reason to pick a different bottom %.

## 4. SS/CFC/Seoul paths stay below the pill, no crossing

All three converge to the rect BOTTOM edge (drift centers below
the rect bottom or pushed to it; nearest edge is the bottom in
every case), box [S/2+114.7, S/2+142.7]. Gap to the pill:
(S/2+114.7) - 0.26S = 0.24S + 114.7 = 246.7px at S=550, growing
with S. Drift boxes are below the pill too (drift top vs pill
bottom 225.3px at 1161/550 for the 0.695 anchors, 228px for SS
0.70). A path between two below-pill endpoints stays below the
pill bottom, and x separates as well (Seoul converged x-gap
51.8px drift-worst at W=1161). No crossing for any of the three.

## 5. Reduced motion, H-bands, new mechanisms: all clean

- Pills hide under reduced motion (block ~1741: all three pill
  classes + base selector, display none). The move therefore has
  ZERO reduced-motion impact.
- H3 (1161-1400, Seoul, VH<=680), H4, H6 are outside the diff
  hunks: byte-identical, standing, no change needed or made.
- No new motion mechanism: the diff carries only one bottom
  value + comments. No animation, no transition, no transform,
  no loop change. The pill jump across 1400/1401 (0.59S down +
  0.09W right) is a static position step, same class as existing
  chip companion jumps, not a motion change.

## 6. Conditions for ship (disclosure-only)

1. Final report carries the §3 FAERS path crossing: whole laptop
   band W 1161-1400 x all S, x 64.6-73.0px, y up to full pill
   height (25px at h=28, 21px at h=21), ~0.03-0.13s per transit,
   endpoints clean both sides (44.0 drift worst, 35.7
   converged).
2. Final report corrects the synthesis duration prediction:
   0.03-0.13s recomputed, not 0.3-0.5s.
3. Final report carries the §4 endpoint result: bottom-band
   converged chips clear the pill by 246.7px at S=550, growing.
