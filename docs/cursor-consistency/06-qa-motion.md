# QA-motion: cursor-consistency (independent verification)

Scope: motion claims only (loop code, speeds, gating, crossing durations).
Layout gaps, pill rules, and tablet lane geometry are layout QA's domain.
Method: traced `src/sections/Hero.tsx` directly (no fixer report taken on
trust) + an independent Python model of the drift ellipse, tilt bboxes,
and float (script scratch in `/tmp`, not in repo). Base: HEAD `1255c6f`
+ fixer 1/2/3 uncommitted diffs. Nothing reverted, nothing pushed.

Model assumptions (stated so the numbers can be reproduced): chip sizes
73/116/130/109 x 21px (pill: 11px font + 3px padding + 1px border; a
28px height was run as sensitivity - every verdict below is identical at
both heights, and the two places they differ are named). Tilt bboxes are
exact (rotate about center: card-a -3deg, card-b 2deg, card-c -1deg,
card-d 1deg, window-b 1deg). Card sizes from component source where
fixed (docking 230, awards 168, review 220, poster 260, faers 240 wide)
and from the fixer models where content-driven (docking 184, awards 124,
search 260x229, faers 180 tall). Float is modeled at worst phase unless
noted (float moves a card toward or away from a chip depending on the
pair; rest=float 0 is worst for FAERS-docking, float -8 is worst for
Seoul-awards). scrollPhase is set to 0: it is a phase offset, so it
cannot change any per-cycle fraction. Collage parallax (+-8px, collage
layer only) is excluded from the fractions except where noted.

## 1. Durations - PASS

Code: `CURSOR_CHIPS` - FAERS 12s, StrokeSense 14s, Code for Cure 11s,
Seoul 2026 15s. `MINI_CURSOR_CHIPS = CURSOR_CHIPS.map(...)` overrides
only radius + 2 anchors, so durations/phases/colors stay in sync by
construction. `TABLET_ANCHORS` carries no duration, so the tablet band
uses the same 12/14/11/15s through the section loop. All three loops
verified: section, miniature, tablet (shared section loop).

## 2. Dart-dwell - PASS (with a corrected speed claim)

Code: `theta = psi + 0.35 * Math.sin(2 * psi)` in BOTH loops (section
and miniature). `dtheta/dpsi = 1 + 0.7*cos(2*psi)` lies in [0.3, 1.7]
and is always positive, so theta covers exactly 2pi per cycle: the
bounding box is exactly the old ellipse (+-rx, +-0.7*rx). Angular-rate
variation 0.3x-1.7x confirmed analytically.

Computed speeds (numeric integration over one cycle):

| chip (desktop rx20/ry14) | old mean | old peak | new mean | new peak |
|---|---|---|---|---|
| FAERS 12s | 5.98 | 6.98 | 8.97 | 12.88 |
| StrokeSense 14s | 4.89 | 5.71 | 7.69 | 11.04 |
| Code for Cure 11s | 6.73 | 7.85 | 9.79 | 14.05 |
| Seoul 2026 15s | 4.49 | 5.24 | 7.18 | 10.30 |

CORRECTION: the motion doc's "dart peaks ~19 px/s" does NOT reproduce.
19 would require the geometric peak (theta = pi/2, factor 20) and the
angular peak (factor 1.7) to coincide; they are anti-aligned (at
theta = pi/2 the angular factor is near its 0.3 minimum). Actual dart
peaks are 10.3-14.1 px/s desktop - still x1.79-1.97 vs the old peaks,
and mean speed is up ~1.5x, plus the near-pause/dart character. The
design intent (visibly more active) holds; the doc number should be
corrected to 10-14, not 19.

Tablet: portrait SS/CFC (r14, 14s) mean 5.38 / peak 7.73 - the least
active of the new set, but still above old desktop StrokeSense
(4.89/5.71). Landscape (r24) mean 8.61 / peak 12.36.
Miniature (design px): mean 14.4-19.6, peak 20.6-28.1; visual at 390px
mean 4.8-6.6 / peak 6.9-9.4 px/s, at 719px mean 8.9-12.1 / peak
12.8-17.4 px/s. Phone chips move visibly on screen, not just in
design coordinates.

## 3. Converge - PASS

Code: `1 - exp(-dt / 0.22)` (tau 0.22s, was 0.30); word rect expanded
by exactly 20px on all sides (halo 20px, unchanged). Converge runs
only when `canHover` (live `(hover: hover) and (pointer: fine)` ref)
is true. Touch path returns drift-only before any converge math, and
`wordHovered` is set only by `onMouseEnter`/`onMouseLeave` on the h1,
so there is no tap-to-converge (even a synthetic tap hover cannot
converge: `hovering = canHover && wordHoveredRef` is false on touch).
Mouse parallax stays +-8px: `((offset - 0.5) * 16)`, mouse-only effect
with its own hover gate, off under reduced motion.

## 4. Scroll modulation - PASS

Code: `scrollPhase = clamp(-stageRect.top / stageRect.height, 0, 1)
* 0.25` in BOTH loops, computed before the touch branch in the section
loop and with no hover gate in the miniature loop. Cap 0.25 loop
confirmed. On touch it is the interactive channel, as briefed.

## 5. Loop gating - PASS (one disclosed seam quirk)

Code: section loop early-returns on reduced motion or `heroBand ===
"miniature"`; `heroBand` takes exactly 3 values from cached matchMedia
listeners, so the section loop runs desktop+tablet only. Miniature
loop early-returns on reduced motion or `heroBand !== "miniature"`.
Both cancel rAF on cleanup (deps `[heroBand, tabletSubBand]` /
`[heroBand]`), skip offscreen stages, skip `offsetWidth === 0`
(display:none) chips, and pause in hidden tabs via rAF semantics.
The old `(hover: hover) and (pointer: fine)` run-gate is GONE from
both cursor loops (remaining uses are the hover-capability ref for
converge branching, the mouse-only parallax effect, and canDrag -
all correct). Touch animates: the loop has no hover gate, and chips
are visible via the pill-only `(hover: none)` rule + the tablet
revival block.

Seam quirk (already disclosed in 04, confirmed): at viewport 720-734px
with a classic scrollbar, `heroBand` is tablet (viewport media) while
`.mv-hero-mini` is active (clientWidth), so mini chips render STATIC
(miniature loop inactive) and section chips stay hidden (scoped
revival + offsetWidth skip). No double chips, no broken state - just
no animation in a 14px viewport window.

## 6. Crossing durations (measured from motion math) - 2 FAILS + 1 CONFIRMED

### 6a. Miniature FAERS vs docking - FAIL, budget exceeded (CONFIRMS fixer 3)

Stage 1160x600. Chip base (226.2, 180), 73xh; docking tilted box
(24.34, 12.11, 263.66, 207.89). Rest overlap x 37.46, y 21.00 (h21) /
27.89 (h28) - matches fixer 3's (37.5, 27.9) at h28. Longest
continuous run 8.09s of the 12s cycle (my model reproduces fixer 3's
8.09s exactly), total overlap 84.8% (10.18s/cycle). Budget: 3s
continuous, 12px deep. FAILED on both: 8.09s > 3s, depth 21-28
design px > 12 (visual 7.1-9.4px at 390px, 13.0-17.4px at 719px -
fails the 8px visual budget at 719px too). This is pre-existing
desktop geometry (the H1 reduced-motion band is the same park at
W < 1380, VH < 804), faithfully reproduced by the miniature, NOT
introduced by this round's motion changes (anchors frozen).

### 6b. Miniature Seoul vs awards - FAIL, budget exceeded (CONFIRMS fixer 3)

Chip base (703, 417), 109xh; awards tilted box (677.73, 450.54,
847.87, 577.46). Rest gap 12.54px (h21, matches fixer 3's 12.5) /
5.54px (h28) - clear at rest either way. Worst phase (float -8):
longest continuous run 7.04s (h21, matches fixer 3's 7.03s) /
7.75s (h28); worst depth 23.46 design px (h21, matches fixer 3's
23.5) / 30.46 (h28). Budget: 3s, 12px. FAILED on both (7.0-7.8s >
3s; 23.5-30.5 design px > 12; visual 14.5-18.9px at 719px > 8px).
The miniature radius 40 deepens vs the desktop residual (~14.7px
at radius 20) but the pair is pre-existing geometry (desktop
Seoul-awards graze), not a new anchor.

### 6c. Desktop StrokeSense vs search, above 1400 - CONFIRMED, with refinement

Static overlap at 1440x800 reproduces fixer 1 exactly: 104.4 x 14.3px
(my tilted model: 104.38 x 14.25). Static range: W < 1989, VH < 846
(matches fixer 1's W < 1990, VH < 846). Drift-inclusive range (my
extension): W < 2095, VH < 891. Overlap fraction at W=1440 (float 0,
worst phase; search float and parallax would only reduce/extend it
marginally):

| VH | static | drift fraction | longest run |
|---|---|---|---|
| <=800 | 104.4 x 14.3px park | 100% (continuous park) | full cycle |
| 830 | 104.4 x 5.0px | 56.9% | 7.96s |
| 846 | 104.4 x ~0px | 50.0% | 7.00s |
| 880 | clear | 32.7% | 4.58s |
| 891 | clear | 7.5% | 1.05s |
| >=892 | clear | 0% | 0s |

Fixer 1's "most of its loop at VH < 846" is confirmed and understated
at VH <= 800 (there it is 100%, a permanent park, not "most"). This
is pre-existing (anchors frozen, drift box unchanged by dart-dwell)
and needs the parent anchor decision fixer 1 flagged; it is NOT a
regression of this round.

## 7. Reduced motion - PASS (two disclosed exceptions)

Code: BOTH loops early-return on `prefers-reduced-motion: reduce`;
parallax effect early-returns too. Section chips/pills get
`animation: none !important` (kills the entrance fade); mini chips
get `animation: none` in the miniature reduced-motion block; pills
are hidden under reduced motion (fixer 2 rule, pill-only, after the
tablet block). H1-H6 per-chip hide bands verified present in code,
all reduced-motion-scoped and min-width 1161px+.

Exceptions (both pre-existing/disclosed, not motion regressions):
(a) Collage float still bobs on desktop/tablet under reduced motion:
the float-kill rule lives inside the max-width 719px block (and the
miniature block), so above 720px cards can transiently graze static
chips just above hide-band edges (Seoul-awards to ~VH 703,
CFC-gutaxis to ~VH 861, per fixer 1).
(b) Miniature FAERS rest park shows statically under reduced motion:
no hide band covers mini chips (H1-H6 target `[data-chip]` section
chips only), so reduced-motion phone users see the FAERS chip parked
on docking permanently. Same geometry as 6a, static instead of
drifting.

## 8. Radii - PASS (briefed 34 confirmed NOT shipped, with reason)

Code: desktop radius 20 (ry = 0.7 x 20 = 14, via `r * 0.7` in the
loop). `TABLET_ANCHORS`: portrait 20/14/14/20 (FAERS/SS/CFC/Seoul),
landscape 24 all. Miniature radius 40 design px
(`MINI_CURSOR_CHIPS` spread override). The briefed tablet 34 is
confirmed absent from the code. Reason (code comment + 04, not
independently re-derived here - a full tablet grid search is layout
QA's domain): no anchor set at radius 34 clears cards at worst
phase in either tablet sub-band (best single-anchor worst gap
-30.9, FAERS vs notify at 768x882), and four chips cannot pack into
the single radius-34 pocket; shipped radii are the largest keeping
rest-clean, glyph-clear at worst phase, and card transient at most
about 16px.

## Ship recommendation (motion side)

Motion itself is SHIP-READY: it is verifiably more active than before
on desktop (mean +50%, peak +90%, plus dart-dwell variation),
tablet (native chips animate where none existed), and phone
(miniature chips animate at 5-12 visual px/s mean). All loop, gating,
converge, scroll, parallax, and reduced-motion claims verified from
code, except the corrected dart-peak number (10-14 px/s, not ~19).

But the stated crossing budgets are NOT met: miniature FAERS-docking
(8.09s continuous, 21-28px deep) and miniature Seoul-awards
(7.0-7.8s continuous, 23.5-30.5px deep) both exceed the 3s / 12px
budget, and desktop StrokeSense-search is a continuous park at
VH <= 800 above 1400px. All three are pre-existing geometry (anchors
frozen this round), disclosed with numbers above - the motion round
did not create them, but it does not fix them either.

Recommendation: CONDITIONAL SHIP from the motion side - ship only
with the three violations disclosed as known issues, or hold for the
miniature/desktop anchor remedy (fixer 3's prepared directions:
miniature-only FAERS anchorX 0.195 -> ~0.26; Seoul/awards joint
glyph+card analysis; desktop StrokeSense >1400 lane move). Do not
ship as clean.
