# 00 - Synthesis: waypoint wander replaces elliptical drift

Base HEAD `3ea8892`. Target: onlines-style waypoint wander (desktop, tablet, phone miniature) replacing dart-dwell drift (radii 20/14, durations 12/14/11/15s, speeds 7-10 px/s). Chips keep OUR labels (FAERS, StrokeSense, Code for Cure, Seoul 2026); motion only, never onlines' labels. Verdicts below decide every disagreement; the fixer implements this doc exactly.

## Verdicts on the nine conflicts

| # | Conflict | Verdict | Why |
|---|---|---|---|
| 1 | Converge | DROP | Zero mouse reaction in target; converge caused both FAERS path defects; closes touch/desktop asymmetry |
| 2 | Scope | FREE stage-inset waypoints | Dwell cap 0.6s blocks lingering parks; constrained needs per-band maps, reintroduces lane bias |
| 3 | Easing | Cubic-bezier(0.22,1,0.36,1) in JS | Reference's own ease-out; smoothstep reads as floating, too close to old drift |
| 4 | Dwell | Uniform 0.15-0.6s | 05 mean 0.8s means sitting still 20-25% of time; 1.2s stop on a card reads as a park |
| 5 | Speeds | 01 table + ±10% per leg | Widest spread, preserves identity; redrawn-per-leg erases identity |
| 6 | Miniature speed | DIVIDE by live miniScale | Eye must see 70-110 px/s on phones; naive design px reads 19-68, complaint survives |
| 7 | Spawn | ANCHOR + stagger 300+250i ms | No first-frame jump; preserves JS-anchor == CSS-base and reduced-motion path; random spawn teleports |
| 8 | Bounds | Fully-inside, top-left [12, W-chipW-12] x [12, S-chipH-12]; reflect up to 3x, then clamp | Labels must not clip; dashed frame makes edge-crossing read as a bug; clamp piles waypoints on edges |
| 9 | Step | Local random walk, direction uniform, step uniform 150-400 visual, candidate >=80px from prevFrom | Preserves reversals, blocks oscillation; prevFrom defined below |

## Final parameter table

| Parameter | Value |
|---|---|
| Step | Uniform 150-400 VISUAL px per leg, direction uniform [0, 2pi), from CURRENT position (local random walk, NOT uniform-random target) |
| Speed, mean visual px/s | FAERS 85, StrokeSense 95, Code for Cure 75, Seoul 2026 105; per-leg speed = table x U(0.9,1.1) |
| Leg duration | Distance / per-leg speed; range ~1.3-5.9s, typical 2-4s |
| Easing | Cubic-bezier(0.22,1,0.36,1) in JS (recipe below); duration preserves mean speed; peak ~1.5-2x mean at leg start, decaying to ~0 at landing; no overshoot; no rotation |
| Dwell | Uniform 0.15-0.6s between legs, mean ~0.35s; hard cap 0.6s, enforced by the RNG range |
| Bounds | Chip box fully inside stage; top-left in [12, W-chipW-12] x [12, S-chipH-12]; degenerate (stage narrower than chip+24): center that axis |
| Out-of-bounds | Reflect direction across violated boundary, up to 3 reflections, then clamp into bounds (short leg allowed, smallest phones only) |
| Anti-ping-pong | Candidate >=80px from prevFrom (from of leg just completed); rejection sampling up to 12 tries, then clamped fallback |
| Independence | Per-chip state, speeds, dwell draws, waypoint draws; no shared clock or phase; drift durations/phases deleted |
| Chips | 4, no fake chips; chip-chip meetings rare and coincidental; no separation guarantee |

Easing recipe (JS): bezier P0=(0,0), P1=(0.22,1), P2=(0.36,1), P3=(1,1). x(u) = 3(1-u)^2 u(0.22) + 3(1-u)u^2(0.36) + u^3. y(u) = 3(1-u)^2 u + 3(1-u)u^2 + u^3. Given normalized leg time t, solve x(u)=t by Newton (initial u=t, 4-8 iterations; x'(u) > 0 here, so monotonic; bisection fallback if derivative near zero), return y(u).

## State machine + tick

Per-chip state, EFFECT-SCOPED (a band change restarts the effect and re-spawns, so no stale-waypoint leg runs), indexed by CURSOR_CHIPS order, never React state:

`{ pos, from, to, prevFrom, legStartMs, legDurS, dwellUntilMs, mode, speed }`

pos/from/to: absolute px stage coords (section) or design px (mini), TOP-LEFT of chip box.

Spawn (first tick after mount or band change): pos = anchor top-left (device table); mode dwell; dwellUntilMs = now + 300 + 250*i ms (staggered launch).

Per chip per frame (section loop ~560-697, mini loop ~708-760):

1. Skip if el is null or offsetWidth is 0. Anchor from existing math, unchanged (~622-654, incl. companions and TABLET_ANCHORS). chipW/H from offsetWidth/Height. Bounds from live stageRect (section) or 1160x600 design stage (mini).
2. Clamp pos and to into bounds (a clamped to keeps its legDur).
3. If mode is dwell and now >= dwellUntilMs: prevFrom = from; pick a candidate (picker below); from = pos; to = candidate; legStartMs = now; legDurS = dist / (speed x U(0.9,1.1)); mode = move.
4. If mode is move: t = (now - legStartMs)/1000/legDurS; if t >= 1: pos = to, mode = dwell, dwellUntilMs = now + U(0.15,0.6)*1000; else pos = from + (to - from) x easeBezier(t).
5. Write translate(pos.x - anchorX, pos.y - anchorY) to 1 decimal. No converge blend, no scroll phase.

Picker, up to 12 tries: draw direction uniform [0, 2pi) and step uniform 150-400 visual (mini: step/scale, clamped to 1175 design px); candidate = pos + step x (cos, sin); if out of bounds, reflect direction across the violated boundary and recompute, up to 3 reflections; accept if in bounds and dist(candidate, prevFrom) >= 80. Fallback: last candidate clamped into bounds.

Delete from both loops: psi/theta/drift blocks (section ~655-659, mini ~744-751); scrollPhase (section ~610, mini ~739); converge (wordRect, blends ~591/687-688, eased, nearest-point, wordHoveredRef for chips; FIRST verify wordHoveredRef, wordRef, hoverCapableRef have no other consumer); elapsed/start (timers use performance.now directly; delete dt unless another consumer needs it).

Keep: guards (reduced motion, band), laptopMql, raf/last, stageRect + offscreen skip, offsetWidth-0 skip, anchor math, chip DOM, direct translate writes, entrance fade (opacity-only).

## Per-device rules

| Device | Coords and bounds | Speed and step | Spawn anchors |
|---|---|---|---|
| Wide >1400 | Stage px = visual px; top-left [12, W-chipW-12] x [12, S-chipH-12] | Table, visual px/s; step 150-400 visual | Base: FAERS (0.90, 0.90), SS (0.505, 0.70), CFC (0.30, 0.695), Seoul (0.80, 0.695) |
| Laptop 1161-1400 | Same, live stage px | Same | Companions: FAERS (0.85, 0.04), SS anchorX 0.55, Seoul anchorX 0.70, CFC base; CSS rules KEPT (reduced-motion parking) |
| Tablet 720-1160, all sub-bands | Same, live stage px; NO sub-band bounds (inset rule adapts from live stage) | Same | TABLET_ANCHORS per sub-band |
| Phone miniature <720 | Design px; top-left [12, 1160-chipW-12] x [12, 600-chipH-12] design; scale = stageRect.width/1160 read live per leg | Design speed = table / scale; design step = step / scale, clamped to 1175 design px; leg durations as desktop (scale cancels); dwell same | MINI anchors: FAERS (0.26, 0.30 pinned), SS (0.60, 0.34), Seoul anchorX 0.70, CFC base |
| Touch (tablet and phone) | Same as above | Same | Wander runs on touch (no hover gate, no tap gate); no converge anywhere |
| Reduced motion (all devices) | Loops never run; early return covers mount (no mount flash) | None | Chips static at anchors per device; pills hidden everywhere; H3/H4/H6 stand; entrance fade killed; parallax off |

CURSOR_CHIPS / TABLET_ANCHORS / MINI changes: radius, duration, phase DELETE; speed ADDED per table; anchors, labels, colors KEPT (spawn, transform reference, reduced-motion layout); FAERS MINI anchorY pin 0.30 stays; chipBaseAnchor (~886) UNCHANGED; JSX base UNCHANGED; loop header comment updated (ellipse, dart-dwell, scroll, converge text goes stale).

## Locked verdicts (unanimous, do not reopen)

- Scroll modulation: DROPPED, no replacement. No phase exists under wander; a speed-multiplier variant would break the 70-110 px/s spec.
- Pills: UNCHANGED. CSS mv-float only; seoul-pill wide 15%/5%, laptop 74%, tablet right 40%/30% stand. Pills paint above chips, so a chip slides UNDER a pill: traversal, not a park.
- Collage parallax ±8: UNTOUCHED. Collage layer only, not chip motion. Full zero-mouse-reaction fidelity would drop it too; separate decision, default keep.
- H3/H4/H6: STAND byte-identical, iff anchors stay as rest positions. Trigger for a full rest-park re-scan: any rest-position change.
- Performance: non-issue. Same rAF cadence, transform-only writes, no new timers, no React state in loop, tab-hidden pause preserved.

## Hard constraints for the fixer

- JS-anchor == CSS-base invariant: anchor math and chipBaseAnchor unchanged.
- Index-based refs, lookup by label; never rename or reorder CURSOR_CHIPS.
- No CSS transition on chip transform; transform writes only; no React state in the loop.
- Effect-scoped wander state; re-spawn on band change; absolute stage coords + per-frame clamp (NOT anchor-offset storage: waypoints are stage positions, and per-frame clamping handles within-band resize).
- From on re-pick = last written position (pos), never a stale target. Tab-hidden resume: t >= 1 fires once, pos = to, then a new leg from pos, no jump.
- Reduced-motion early return covers mount.
- Do NOT touch: JSX base positions, CSS companions, H-bands, pills, parallax, gates, card boxes, other sections.
- No em dash anywhere in code comments or docs; no en dash in new text.

## QA axes

1. Motion params: speeds within table ±10% (visual px/s; miniature via live scale); legs 150-400 visual (short-leg exception only at 320px phone after reflect+clamp fallback); dwell 0.15-0.6s, never over 0.6s; ease-out shape (fast launch, soft landing, no overshoot); no rotation; independence (no shared clock/phase).
2. Bounds: chip box fully inside stage at waypoints AND mid-leg (inset 12); no edge-piling (reflection primary, clamp fallback only); degenerate safety (center an axis if stage narrower than chip+24).
3. Pass-through, NOT parks: transient chip-vs-card/word/pill/chip-chip contact is EXPECTED; QA must NOT flag it. Governing rule is dwell: no stop over 0.6s on content, no crawling. Rest-park scans for normal motion retire; H-bands remain for reduced-motion only.
4. Reduced-motion static: chips at anchors per device; H3/H4/H6 hiding Seoul/CFC in bands; pills hidden everywhere; no loop running (incl. mount); no transform writes under emulation.
5. Seams: 720 and 1160/1161: chip set swap, re-spawn at new anchors with stagger, one-frame jump acceptable (same class as existing seam jumps). 1400/1401: chips do NOT jump (within-band resize only re-bounds the next leg via per-frame clamp; pills still jump per CSS, unchanged, disclosed).
6. Tab-hidden resume: one re-pick per chip from the last written position, no jump.
7. Band-change reset: resize across 720/1161 restarts the effect; chips re-spawn at new anchors with stagger, no stale-waypoint leg.
8. Regression: diff = Hero.tsx loop + chip param tables + loop comment only (+ docs). JSX base, CSS companions, H-bands, pills, parallax, gates, card boxes byte-identical. Build passes. Em dash 0, en dash 0, dialkit in dist 0, sciencedirect 0. FAERS masked check not needed (no FAERS data touched); state that basis.

## Disclosure list for the final report

- Chips now wander the whole hero (150-400px legs at 75-105 px/s) instead of trembling in 20px ellipses at 7-10 px/s, on all devices.
- Converge dropped: hovering the word no longer gathers chips. Onlines has no mouse reaction, and converge caused both FAERS path-crossing defects (seoul-pill wide, laptop-pill whole band); both moot now.
- Scroll no longer modulates chip motion.
- Transient crossings expected: chips pass over cards, word, pills, each other; pass-through like onlines, not a park. Governing rule is dwell (never stops over 0.6s anywhere).
- Deliberate deviations from onlines: chips stay fully inside stage (no partial off-edge; labels must not clip; dashed frame makes edge-crossing read as a bug); 4 chips, not 7 (no fake chips); easing is the reference's own ease-out curve, since onlines' within-move easing was unobservable at snapshot resolution.
- Unchanged: reduced-motion (static anchors, H3/H4/H6 stand, pills hidden), pills, parallax, gates, card layout.
- Vestibular: full wander is the most provocative decorative motion short of flashing (06); reduced-motion is the mitigation; no speed cap invented (no evidence threshold exists); users without the OS preference set still see full wander.
- Carried unverified: onlines mobile 390px behavior (observation browser could not resize; phone motion is our own design per the user's order); onlines exact animation code (unquotable; not needed, model rests on motion observation).
- Live-preview checks owed: full wander cycle on desktop/tablet/phone (speed feel, leg lengths, dwell), seams 720/1160/1400, reduced-motion static, tab-hidden resume.
