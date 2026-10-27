# 08 - Fixer note: waypoint wander implemented

Base HEAD `3ea8892`. Spec: `00-synthesis.md`, implemented exactly except two documented micro-adaptations below (both preserve spec intent). No source file other than `src/sections/Hero.tsx` touched. No commit, no push (parent owns that).

## What changed (file: `src/sections/Hero.tsx` only, +363 / -159)

| Block | Lines (new file) | Change |
|---|---|---|
| Diorama header comment | ~84-96 | Drift + converge description replaced by wander description |
| `CURSOR_CHIPS` type + entries | ~103-110 | `radius, duration, phase` deleted; `speed` added: FAERS 85, StrokeSense 95, Code for Cure 75, Seoul 2026 105; anchors, labels, colors unchanged; FAERS comment updated (converge residuals moot) |
| `TABLET_ANCHORS` type + entries | ~131-162 | `radius` deleted from type and all 12 entries; anchors unchanged |
| `MINI_CURSOR_CHIPS` | ~164-200 | `radius: 40` override deleted (speed flows through spread); anchor overrides and FAERS anchorY pin 0.30 unchanged |
| Wander helpers (new, module level) | 349-485 | `WANDER_INSET`, `WANDER_STEP_MIN/MAX`, `WANDER_MIN_PREV`, `WANDER_DWELL_MIN/MAX`, `WANDER_MINI_STEP_MAX`, `WanderChipState`, `wanderClamp`, `wanderBezierX/Y/DX`, `easeWanderBezier`, `wanderBounds`, `pickWanderTarget` |
| Band effect | ~640-670 | `hoverCapableRef` decl, `hoverMql` wiring, and assignment deleted (no consumer left); band/tablet-sub-band logic untouched |
| `wordHoveredRef` sync effect | deleted | Ref decl and sync effect deleted (no consumer left after converge drop) |
| Section loop comment + body | 679-830 | Rewritten: wander state machine, anchor math unchanged, drift/converge/scrollPhase deleted |
| Miniature loop comment + body | 834-960 | Rewritten: wander in design px, anchor math added, drift/scrollPhase deleted |
| heroBand comment | ~590-600 | Stale hover-capability sentence removed (ref deleted) |

## Parameters shipped (exactly per spec)

| Parameter | Value |
|---|---|
| Step | Uniform 150-400 visual px, direction uniform [0, 2pi), from current pos (local random walk) |
| Speed, mean visual px/s | FAERS 85, StrokeSense 95, Code for Cure 75, Seoul 2026 105; per leg x U(0.9,1.1) |
| Leg duration | dist / per-leg speed, floored at 0.1s (degenerate guard only); typical 2-4s |
| Easing | Cubic-bezier(0.22,1,0.36,1) in JS: Newton 8 iterations from u=t, bisection fallback (24 iters) if \|x(u)-t\| > 1e-4 or derivative < 1e-6 |
| Dwell | Uniform 0.15-0.6s between legs; spawn stagger dwellUntilMs = now + 300 + 250*i ms |
| Bounds | Chip box fully inside stage, top-left [12, W-chipW-12] x [12, S-chipH-12]; degenerate axis centered |
| Out-of-bounds | Mirror across violated edge, up to 3 bounces, then clamped fallback (see adaptation 1) |
| Anti-ping-pong | Candidate >= 80px from prevFrom (from of leg just completed, captured BEFORE from is overwritten); 12 tries, then clamped fallback |
| Spawn | Anchor top-left per device table (wide base, laptop companions, tablet sub-bands, MINI anchors); mode dwell |
| Miniature | Design px; scale = stageRect.width/1160 read live per leg; design step = visual step / scale capped at 1175 design px; design speed = table / scale; dwell same |
| State | Effect-scoped array indexed by chip order, never React state; fields {pos, from, to, prevFrom, legStartMs, legDurS, dwellUntilMs, mode}; pos/from/to absolute stage coords (section) or design px (mini), TOP-LEFT of chip box |
| Deleted from both loops | psi/theta/drift blocks, scrollPhase, converge (wordRect, blends, eased, nearest-point), elapsed/start; dt deleted (no remaining consumer) |
| Kept | Guards (reduced motion, band; early return covers mount), laptopMql, raf, stageRect + offscreen skip, offsetWidth-0 skip, anchor math, chip DOM, direct translate writes (1 decimal), entrance fade (opacity-only) |

## Wiring verification (done before deleting)

- `wordHoveredRef`: consumers were decl, sync effect, section loop only. Deleted decl + sync effect. `wordHovered` STATE kept (JSX frame/handle classes + mouse handlers use it).
- `hoverCapableRef`: consumers were decl, band-effect assignment, section loop only. Deleted decl + hoverMql wiring.
- `wordRef`: KEPT (JSX h1 ref at line 2361 uses it; only the loop's read was removed).
- Old chip fields (`radius, duration, phase`): consumers were the two loops + loop comment only. No JSX or other code reads them.
- `chipBaseAnchor` unchanged; JSX base positions unchanged; CSS companions, H-bands, pills, parallax, gates, card boxes untouched (rules byte-identical; see stale-comment debt below).

## Micro-adaptations (spec intent preserved, not verdict changes)

1. **Reflection = bounce mirror, not direction-flip-recompute-from-pos.** The spec says "reflect direction across the violated boundary and recompute". Flipping the step component and recomputing from pos can oscillate (example: pos.y=150, step dy=+400 on a 550 stage: 550 out, flip to -250 out, flip to 550 out) and would end in a clamped short leg on desktop. Mirroring the candidate across the violated edge is the physically correct bounce (direction flips, position mirrors) and always lands in bounds when overshoot is smaller than the stage span, which holds for all shipped stages; the 3-bounce cap covers the miniature diagonal-step corner case, and the clamped fallback remains for anything beyond it. Leg lengths stay in the 150-400 range in the normal case.
2. **Speed computed at pick time, not stored in state.** The spec lists `speed` in the state fields, but the miniature design speed depends on the live scale, which changes on resize; storing it at spawn would freeze a stale scale. Section legs use `chip.speed x U(0.9,1.1)` at pick time; miniature legs use `(chip.speed / scale) x U(0.9,1.1)` at pick time. Same values, always live. State therefore omits the `speed` field.

## Build and greps

- `npm run build` (tsc --noEmit + vite build): PASS, 8.44s, Hero chunk 86.34 kB.
- Diff: `src/sections/Hero.tsx` only (+363 / -159); `git status` otherwise clean except untracked `docs/cursor-motion/`.
- Loop code remnants: `converge, scrollPhase, blends, wordHoveredRef, hoverCapableRef, chip.radius, chip.duration, chip.phase, theta, psi` = 0 in code (remaining matches are comments only, see debt).
- Em dash in diff: 0. En dash in added lines: 0. Dialkit strings in dist: 0. `sciencedirect` in src: 0.
- FAERS masked check: NOT run (no FAERS data file or value touched; diff is loop + param tables + comments only).

## Stale-comment debt (left intentionally, rules untouched)

Stylesheet comments still say "drift-only" / "converge" in these spots; the RULES they annotate are unchanged and correct, so they were left byte-identical for the regression check. QA may fix wording in a comment-only pass, but must not change the rules: touch pill-hide comment (~1209-1214), tablet diorama hide comment (~1225), Cochrane slot comment (~1375, "FAERS chip drift box"), review companion comment (~1609, "drift and converge stay consistent"), tablet revival comment (~1862, "loop's converge math stays consistent"). The invariant behind 1609/1862 (JS anchor == CSS base) still holds; only the motion words are stale.

## QA must verify

1. Motion params: speeds within table ±10% (visual px/s; miniature via live scale); legs 150-400 visual (short-leg exception only via reflect+clamp fallback); dwell 0.15-0.6s, never over 0.6s; ease-out shape (fast launch, soft landing, no overshoot); no rotation; independence (no shared clock/phase).
2. Bounds: chip box fully inside stage at waypoints AND mid-leg (inset 12); no edge-piling (reflection primary, clamp fallback only); degenerate safety.
3. Pass-through, NOT parks: transient chip-vs-card/word/pill/chip-chip contact is EXPECTED; governing rule is dwell (no stop over 0.6s anywhere). Rest-park scans for normal motion retire; H-bands remain for reduced-motion only.
4. Reduced-motion static: chips at anchors per device; H3/H4/H6 hiding Seoul/CFC in bands; pills hidden everywhere; no loop running (incl. mount); no transform writes under emulation.
5. Seams: 720 and 1160/1161 (chip set swap, re-spawn at new anchors with stagger, one-frame jump acceptable); 1400/1401 (chips do NOT jump; pills still jump per CSS, unchanged).
6. Tab-hidden resume: one re-pick per chip from the last written position, no jump (t >= 1 fires once, pos = to, then a new leg).
7. Band-change reset: resize across 720/1161 restarts the effect; chips re-spawn at new anchors with stagger, no stale-waypoint leg.
8. Regression: diff = Hero.tsx loop + param tables + comments only; JSX base, CSS companions, H-bands, pills, parallax, gates, card boxes byte-identical (rules); build passes.
