# 01 - Reference motion model: onlines waypoint wander, translated to our canvas

Base HEAD `3ea8892`. Observation: 30+ s live watch, 2-3 s samples, 1920x1080 view. Our chips keep OUR labels (FAERS, StrokeSense, Code for Cure, Seoul 2026); motion only, never onlines' labels.

## Observed, not inferred

| Property | Observed value |
|---|---|
| Chips | 7, fully independent; arrow ~12x12 px always pointing up-left + label 55-120x20 px; footprint ~95-125x30-35 px |
| Path | Random waypoint wander across the FULL canvas; no ellipse, circle, or fixed loop; no chip repeated a position in 7 samples; pointer never rotates, rigid sprite translation |
| Step per move | 45-408 px, typically 150-400 px |
| Speed | Per-chip means 71-106 px/s; typical 70-110 px/s at a 3 s interval (105-165 if the interval was 2 s) |
| Dwell | No pause longer than 2-3 s resolvable; within-move ease/pause below snapshot resolution, cannot be claimed |
| Mouse / scroll | NO reaction to the real mouse (hover over the word did nothing); scroll does not change the wandering (chips ride the hero, not the viewport) |
| Edges | Chips go partly off-edge; they cross the word, mockups, and cards freely |
| Sync | None; every interval shows different directions and distances per chip |

## Key insight: local random walk, not global teleport

Mean distance between two uniform-random points on a 1920x1080 canvas is ~1000 px. Observed legs are 150-400 px. So each new waypoint is LOCAL: 150-400 px from the current position, direction roughly uniform. This explains the reversals, zone reuse, absence of repeats, and absence of a loop. The fixer implements a random walk, NOT uniform-random targets.

## Parameter set (visual px; one set for all devices)

| Parameter | Value | Justification |
|---|---|---|
| Step length | Uniform random 150-400 px per leg | Observed typical band (45 min, 408 max are outliers) |
| Speed (mean per leg) | Per chip, spread across 75-105 px/s: FAERS 85, StrokeSense 95, Code for Cure 75, Seoul 2026 105; ±10% jitter per leg | Observed per-chip means span 71-106; distinct tempos make independence visible instead of a marching band |
| Leg duration | distance / speed, typically 1.5-5 s | 150/100 = 1.5 s; 400/75 = 5.3 s; the common case is 2-4 s |
| Easing within a leg | Ease-out cubic-bezier(0.22,1,0.36,1), evaluated in JS (the loop is JS, not CSS) | See easing note; mean speed is preserved by duration = distance / speed, the curve only shapes within-leg velocity (peak ~1.5-2x mean at leg start, decaying to ~0 at landing) |
| Dwell between legs | Uniform random 0.15-0.6 s (mean ~0.35 s) | Observation bounds dwell above by "no pause >2-3 s" only, so 0 is allowed but wrong: zero dwell feels machine-gun, >0.6 s feels parked. At leg 2-4 s + dwell 0.35 s, a chip is mid-leg in ~90% of any 2-3 s window, consistent with "every chip moved every interval" |
| Direction | Uniform [0, 2pi) per leg | Reversals and free wandering observed; no preferred axis |
| Bounds | Full stage, chip box fully inside: x in [0, W-chipW], y in [0, S-chipH] | Deliberate deviation (onlines allows partial off-edge): our dashed frame makes a crossing chip read as a bug |
| Out-of-bounds step | Reflect (mirror) the direction, never clamp | Clamping piles waypoints onto edges; reflection preserves the step-length distribution |
| Initial position | Current per-band anchors | No first-frame jump; the CSS base stays meaningful for any converge math that survives |
| Independence | Per-chip state, no shared clock or phase | Drift durations/phases (12/14/11/15 s, 0/0.3/0.55/0.8) become obsolete; do NOT reuse phases as a sync mechanism |
| Rotation | None | Pointer stays up-left while the chip translates, as observed |

## Per-device translation

| Device | Stage | Speed and step | Notes |
|---|---|---|---|
| Desktop W 1161-2560, S 550-1300 | Stage px = visual px | 75-105 px/s, steps 150-400 px, as tabulated | Reflections handle the 400 px leg (34% of width at 1161, 16% at 2560) |
| Tablet W 720-1160 | Stage px = visual px | Same absolute values | Reflections handle the 400 px leg (up to 55% of width at 720 px); do NOT shrink steps for tablet or the onlines feel breaks |
| Phone miniature, design stage 1160x600, visual scale 0.276 (320 px) to 0.620 (719 px) | Design px via wrapper scale | Define everything in VISUAL px, convert per frame: scale = stageRect.width / 1160; designSpeed = visualSpeed / scale; designStep = visualStep / scale, upper-clamped to 0.9 x design diagonal (1306 px -> 1175 px) | At 320 px this reads as 150-324 visual px at 75-105 visual px/s; at 719 px, 150-400 visual px. Without conversion, phone speeds would read as only 19-68 visual px/s and the complaint would survive on phones |

## Easing note: why ease-out, and what the user perceives differently

Observation cannot confirm onlines' within-move easing, so this choice comes from the reference's own ease-out curve, not from the screenshots. Ease-out reads as a person moving a mouse to a target: fast launch, decisive landing before the dwell. Ease-in-out (rejected) is symmetric slow-fast-slow and reads as floating, too close to the old drift feel. Linear (rejected) is constant velocity and reads robotic, with no landing.

## Chip count: 4, not 7

Onlines has 7 chips; we have 4 real topics and add NO fake chips (labels must stay real). Consequence: sparser feel, each chip more visible, chip-chip meetings rare and coincidental (as on onlines, where two chips were close in two samples then diverged). No lane geometry can or should guarantee chip-chip separation under wander; separation becomes statistical.

## Code check: attempted, not quotable

A text fetch of onlines.com.ar was attempted to name the animation mechanism and failed (service restart, then aborted); it was not retried repeatedly. No keyframe name, duration, or easing function is quoted here and none is invented. This does not block the model: the parameters above rest on the motion observation, and the mechanism (JS waypoint state machine in our rAF loop) is specified in doc 05 regardless of how onlines implements theirs.

## Fixer-ready parameter table

| Parameter | Desktop / tablet (visual px) | Phone miniature (design px, via scale = stageRect.width / 1160) |
|---|---|---|
| Step length | Uniform 150-400 px | Uniform 150/scale to 400/scale px, upper-clamped to 1175 px |
| Speed (mean) | FAERS 85, StrokeSense 95, Code for Cure 75, Seoul 2026 105 px/s, ±10% per leg | visualSpeed / scale |
| Leg duration | distance / speed (typically 2-4 s) | designDistance / designSpeed (identical visual duration) |
| Easing | Ease-out cubic-bezier(0.22,1,0.36,1) in JS | Same |
| Dwell | Uniform 0.15-0.6 s between legs | Same (time, not distance) |
| Direction | Uniform [0, 2pi) per leg | Same |
| Bounds | Full stage, chip box fully inside, reflect on exit | Same, in design px |
