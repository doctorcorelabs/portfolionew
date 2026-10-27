# 09 - QA layout desktop: waypoint wander

Scope: desktop only, wide above 1400px and laptop 1161-1400px, S 550-1300px. Method: code plus geometry verification against 00-synthesis.md and 08-fix.md (helpers 349-485, section loop 679-830, CURSOR_CHIPS table, CSS companions 1616/1676/1694, effect deps 832). No live render: the sandbox cannot paint, so live preview checks are owed and listed below.

## Verdict: SHIP

No blockers. All six scope items verified from code. Two disclosures (spawn stagger, tab-hidden tick) are spec-mandated behavior, not violations.

## Checks

| # | Item | Result | Evidence |
|---|---|---|---|
| 1a | Bounds at waypoints | PASS | wanderBounds: top-left [12, W-chipW-12] x [12, S-chipH-12]; degenerate axis centered at (stage-chip)/2. pickWanderTarget returns in-bounds or a clamped fallback. |
| 1b | Bounds mid-leg | PASS | from and to are both in bounds, and pos is clamped per frame; linear interpolation between two in-box points stays in the box. Chip box fully inside stage at every frame. |
| 1c | Reflection, no oscillation, no edge-piling | PASS | Mirror across the violated edge, up to 3 bounces, then clamped fallback. On desktop one bounce always suffices (see numbers), so the cap never binds and oscillation is impossible. Mirroring is measure-preserving, so waypoints do not pile on edges. |
| 2a | Dwell cap 0.6s | PASS | Dwell RNG is 0.15 + random x 0.45, range exactly [0.15, 0.6]s. No other dwell path exists between legs. |
| 2b | Cannot stop on content | PASS | No pause mechanism: legs advance on wall clock; offscreen skip keeps state; t >= 1 completes the leg. Transient crossings are pass-through under the new standard, not parks; rest-park scans for normal motion retire. |
| 3 | Seam 1400/1401, chips do not jump | PASS | Effect deps [heroBand, tabletSubBand] (832) do not change across 1400/1401: heroBand stays "desktop", tabletSubBand stays "landscape". State survives. Anchor math reads laptopMql.matches live per frame, and CSS companions use the identical query, so rendered position = CSS base + (pos - JS anchor) = pos on both sides. rAF runs before paint, so no mixed frame paints. Pills still jump per CSS (unchanged, disclosed in prior rounds). |
| 4 | Tab-hidden resume | PASS | rAF pauses while hidden; first tick after return: t >= 1 fires once, pos = to, mode dwell, then a new leg from pos. No anchor reset, no stale target. The mid-leg to endpoint step happens while hidden (unobserved). |
| 5 | Band-change reset at 1161 | PASS | Wander state is declared inside the effect, so a heroBand change restarts the effect and re-spawns every chip at its new anchor with stagger. No stale-waypoint leg. |
| 6 | Spawn anchors plus stagger | PASS | Spawn pos = anchor top-left, dwellUntilMs = now + 300 + 250 x i. Anchors match the spec table for both bands; stagger order is FAERS, StrokeSense, Code for Cure, Seoul 2026. |
| 7 | No converge or scroll remnants | PASS | Grep for scrollPhase, blends, wordHoveredRef, hoverCapableRef in Hero.tsx: 0 matches. Grep for transition on chip/diorama rules: 0. Transform writes are the only per-frame chip mutation. |

## Binding numbers

| Check | Worst case | Value |
|---|---|---|
| X span, smallest desktop (W 1161, CFC 130 wide) | [12, 1019] | 1007px span, above the 400px max step |
| Y span, smallest desktop (S 550, chipH 28) | [12, 510] | 498px span, above the 400px max step |
| Bounces needed on desktop | Overshoot at most one step (400px) | 1 bounce always suffices; 3-bounce cap never binds |
| Spawn in bounds, all 4 chips, both bands, S 550 and 1300 | Tightest: FAERS laptop y = 0.04S (22px at S 550, minY 12); FAERS wide y = 0.90S (495px at S 550, maxY 510) | All spawns inside bounds, no first-frame clamp jump |
| Seam 1400/1401 anchor deltas, absorbed by the base switch | FAERS (0.05W, 0.86S); StrokeSense (0.045W, 0); Seoul (0.10W, 0); Code for Cure (0, 0) | Net rendered delta 0 on both sides |
| Anti-ping-pong | 12 tries, candidate at least 80px from prevFrom | Fallback is clamped in-bounds; a stuck chip is impossible (no loop, bounded tries) |

## Disclosures (not blockers)

1. Spawn stagger exceeds the between-leg dwell cap for chips 2 and 3 (800ms, 1050ms vs the 0.6s cap). Both numbers are spec-mandated. Benign by the dwell standard's intent: spawn sits at verified-clean anchors (the reduced-motion rest positions), one time per mount or band change, not a stop on random content. Between-leg dwell itself is capped at 0.6s by the RNG range.
2. Tab-hidden resume tick sets pos to the leg endpoint while hidden. Unobserved; the next leg starts from pos, with no anchor reset and no stale target. This matches the spec hard constraint exactly.
3. Transient crossings are now expected: chips pass over cards, the word, pills, and each other. Under the new dwell standard these are pass-through, not parks. QA must not flag them. H-bands remain for reduced-motion only.
4. The seam verdict rests on the JS-anchor equals CSS-base invariant, verified here on both sides: JS companion branches plus CSS rules 1616/1676/1694 plus JSX chipBaseAnchor (1090, 2206-2209) all agree. Regression QA confirms the CSS rules are byte-identical to base.
5. Live preview owed (sandbox cannot render): full wander cycle at 1400/1401 (chips must not jump while pills do), at 1161x550 (thinnest spans), tab-hidden resume, band-change re-spawn at 1161.

## Out of scope (other QA owns it)

Tablet plus miniature (QA-layout-devices); speeds, easing, leg lengths (QA-motion); reduced-motion static plus touch (QA-a11y); diff scope plus build (QA-regression).
