# 12 - QA motion: waypoint wander parameters

Verdict: SHIP. Method: read the section loop (679-830), miniature loop (834-960), helpers (349-485), and chip tables in `src/sections/Hero.tsx`; recomputed the easing function and example legs independently; grepped the deletions. All 9 scope items pass. Two spec characterizations are corrected below (curve itself is exact, so neither blocks ship); both go to the live-preview checklist.

## Item checks

| # | Item | Result |
|---|---|---|
| 1 | Speeds, visual px/s | PASS. Table in code: FAERS 85, StrokeSense 95, Code for Cure 75, Seoul 2026 105. Per-leg speed = table x (0.9 + random x 0.2), i.e. table ±10%. Miniature: design speed = table / live scale, so visual speed stays table ±10% on phones. |
| 2 | Legs, local random walk | PASS. Picker draws direction uniform [0, 2pi) and step uniform 150-400 visual from current pos, not a uniform-random target. Miniature: step / scale, capped at 1175 design px, giving visual legs 150-324 px at 320 px width, 150-395 at 390, 150-400 at 719. Short legs occur only via the reflect+clamp fallback. |
| 3 | Dwell cap 0.6s | PASS. Between-leg dwell = 0.15 + random x 0.45 s, so the range itself enforces the cap; no code path can dwell longer between legs. Spawn stagger (300+250i ms, max 1050 ms) is a spec-mandated launch delay at anchor rest positions, once per mount/band change, not a between-leg dwell. |
| 4 | Easing bezier(0.22,1,0.36,1) in JS | PASS, with correction below. Newton 8 iterations from u=t plus 24-iteration bisection fallback (thresholds 1e-4, derivative 1e-6) exactly as specified. Monotonic, y in [0,1], no overshoot. |
| 5 | No rotation | PASS. Chip writes are translate only (lines 827, 956, 1 decimal). No transition on chip classes (grep: none). Line 987 is the collage parallax layer, untouched. |
| 6 | Independence | PASS. Per-chip effect-scoped state, separate speeds, dwell draws, waypoint draws. Drift durations/phases deleted from all tables. No shared phase. |
| 7 | Anti-ping-pong | PASS. Both loops capture prevFrom = {...from} BEFORE pickWanderTarget, then set from = {...pos}. Accept requires dist(candidate, prevFrom) >= 80 px, 12 tries, then clamped fallback. The capture order is correct; comparing against current pos would make the rule vacuous, and the code does not do that. |
| 8 | Spawn, resume, reset | PASS. Spawn at anchor top-left, mode dwell, stagger 300+250i ms. Re-pick uses from = last written pos. Tab-hidden resume: t >= 1 fires once, pos = to, then a new leg from pos, no jump. Band change restarts the effect (deps [heroBand, tabletSubBand] / [heroBand]) and re-spawns; no stale-waypoint leg. |
| 9 | Converge and scrollPhase gone | PASS. Grep for converge, scrollPhase, blends, wordHoveredRef, hoverCapableRef, theta, psi, chip.radius/duration/phase returns comment lines only (old round notes, pill animation line); zero code references. Reduced-motion guards sit at the top of both effects (lines 696, 851), before any rAF scheduling, so they cover mount. |

## Easing profile (recomputed from the shipped function)

| Leg time t | Distance covered | Instant speed / mean |
|---|---|---|
| 0 | 0% | 4.55 (limit at launch) |
| 0.25 | 76.5% | 1.56 |
| 0.5 | 96.1% | 0.31 |
| 0.75 | 99.7% | 0.04 |
| 1 | 100% | 0 |

## Example legs (mean speed, ±10% range)

| Leg | Mean duration | Duration range | Plus dwell |
|---|---|---|---|
| FAERS 250 px at 85 px/s | 2.94 s | 2.67-3.27 s | 0.15-0.6 s |
| Seoul 2026 400 px at 105 px/s | 3.81 s | 3.46-4.23 s | 0.15-0.6 s |
| Code for Cure 150 px at 75 px/s | 2.00 s | 1.82-2.22 s | 0.15-0.6 s |

Spec leg-duration range (~1.3-5.9 s) reproduces exactly: 150 px at 115.5 px/s = 1.30 s; 400 px at 67.5 px/s = 5.93 s.

## Miniature speed check

Scale = section bounding width / 1160, read live per leg. The wrapper scale (miniScale) is measured the same way (section clientWidth / 1160 via ResizeObserver), so the two agree to sub-pixel rounding; speed error under 0.3%. At 390 px: FAERS design speed 253 px/s, visual 85 px/s. Durations match desktop because scale cancels (design distance / design speed = visual distance / visual speed).

## Corrections and observations (disclosure, not blockers)

1. Spec peak-speed note corrected: the synthesis says peak ~1.5-2x mean at leg start. The shipped curve actually launches at 4.55x mean and decays to 0. The curve itself is exactly the specified reference ease-out, so this is a characterization error, not an implementation error. Perceptual consequence: a leg reads as dart then crawl, with 96% of distance covered by mid-leg and the second half moving at drift-like speeds (about 3 px/s at t=0.75 for FAERS). Live preview must judge whether that reads as intended ease-out or as the old drift returning in each leg's second half. Do not change the curve without a new decision; it would reopen a synthesis verdict.
2. Leg-duration floor 0.1 s (both loops) is absent from the spec but is a degenerate guard, not a parameter change: it prevents NaN when a clamped-fallback leg has zero distance. Correct as shipped.
3. Offscreen skip returns before the per-chip loop, so a mid-leg chip frozen offscreen lands at its leg endpoint (t >= 1) on re-entry. The jump is invisible (chip was offscreen) and matches the tab-hidden resume path. Not a defect.
4. Bounds: per-frame clamp of pos and to, clamped to keeps its legDur, degenerate axis centered. Reflection is a bounce mirror (up to 3 bounces), then clamped fallback, per the fixer note; edge-piling cannot occur because clamping is fallback-only.

## Live-preview checks owed (motion)

Full wander cycle on desktop, tablet, and phone: speed feel versus the 75-105 px/s table, leg lengths, dwell visibility, and the dart-then-crawl profile in item 4 above. Seams 720/1160/1400, tab-hidden resume, and band-change re-spawn per the synthesis QA axes (other QA agents own layout, regression, and a11y).
