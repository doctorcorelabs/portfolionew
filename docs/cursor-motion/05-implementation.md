# 05 - Implementation: waypoint wander loop

Base: HEAD `3ea8892`. Target (brief, live onlines observation): random waypoint wander, 70-110 px/s, legs 150-400px, independent chips, rigid sprites (no rotation), on desktop, tablet, phone miniature. Labels stay ours (FAERS, StrokeSense, Code for Cure, Seoul 2026).

## Decision table

| Mechanism | Fate | Reason |
|---|---|---|
| Ellipse drift (psi/theta/radius) | DELETE (section ~656-659, mini ~749-751) | Replaced by waypoint interpolation |
| Scroll phase (0.25 loop) | DELETE (both loops) | No phase under time-driven wander; speed-multiplier variant breaks 70-110 spec |
| Converge (tau 0.22, halo 20, smoothstep) | KEEP as hover override | Only pointer interaction; see §5 |
| rAF owns transform, no CSS transition | KEEP | CSS transition would double-ease writes |
| Anchors, companions, TABLET_ANCHORS, MINI | KEEP as reference + static layout | See §7; bounds are stage inset, not anchor lanes |
| H-bands (H3/H4/H6), entrance fade, parallax ±8 | UNTOUCHED | Static / unrelated layers |
| start/elapsed | DELETE | Timers use performance.now directly; dt stays only for converge blend |

## 1. Per-chip state

One component-level ref, never React state (per-frame writes must not re-render), never re-created by effect re-runs:

```
wanderRef = useRef<ChipWander[] | null>(null)  // indexed by CURSOR_CHIPS order, never reordered
ChipWander = { pos, from, to, legStartMs, legDurS, dwellUntilMs, mode, frozenPos, frozenRemainingS, speed }
```

- pos/from/to: absolute px, stage coords (section) or design px (mini), TOP-LEFT of chip box. mode: "move" | "dwell".
- speed: per chip, px/s in loop coords (§4). Per-leg jitter xU(0.9,1.1).
- Spawn: on first tick, pos = anchor position (§2 step 2), mode dwell, dwellUntilMs = now + (300 + 250*i) ms (stagger so chips never launch together).
- Survival: ref lives outside both effects, so band changes never reset it. Every frame, clamp pos and to into current bounds (§3); a clamped `to` keeps its legDur. No reset on resize.
- Rigid: transform string is translate only, never rotate/scale (mini wrapper scale sits outside the chip).

## 2. Section tick rewrite (effect ~571-697, deps unchanged)

Keep: guard (reduced motion, miniature band), laptopMql, blends, raf/last, dt clamp 0.05, stageRect + offscreen skip, canHover/wordRect/halo, offsetWidth-0 skip, anchor math (~632-654). Delete: elapsed, scrollPhase, psi/theta/drift.

Per chip, per frame:

1. anchorPx from existing math; chipW/H from offsetWidth/Height; bounds [8, W-chipW-8] x [8, H-chipH-8] (degenerate: center axis if W-chipW-16 < 0).
2. Init state if null (§1); clamp pos, to into bounds.
3. If mode dwell and now >= dwellUntilMs: pick waypoint (§3); from=pos; legStartMs=now; legDurS=dist/speed; mode=move.
4. If mode move: t=(now-legStartMs)/1000/legDurS; if t>=1: pos=to; mode=dwell; dwellUntilMs=now+U(0.4,1.2)*1000; else pos=from+(to-from)*easeOutCubic(t).
5. Converge override (§5), else write translate(pos.x-anchorX, pos.y-anchorY) to 1 decimal.

## 3. Waypoint picker

Bounds per device: desktop/tablet = stage px inset 8; miniature = design px inset 8. Leg 150-400px; new point >=80px from previous waypoint (anti ping-pong).

```
pick(pos, prev, B):
  for k in 1..12:
    c = { x: U(B.x0,B.x1), y: U(B.y0,B.y1) }
    d = dist(c, pos)
    if 150 <= d <= 400 and dist(c, prev) >= 80: return c
  // fallback: best try, then clamp its leg length
  if d < 150: c = pos + (c-pos) * (150/d) clamped into B
  if d > 400: c = pos + (c-pos) * (400/d)
  return c
```

At the smallest stages (tablet W>=720, section H>=550, mini design 1160x600) a 150-400px leg always fits inside inset bounds; fallback fires only near corners.

## 4. Easing, duration, dwell

- easeOutCubic(t) = 1-(1-t)^3, in JS. A CSS cubic-bezier cannot implement this: the loop computes positions per frame, so easing must be a JS function of normalized leg time. easeOutCubic (fast start, soft landing, no overshoot) fits cursor-like glides; easeInOutCubic (sluggish starts) and bounce/overshoot (rigid sprites) rejected.
- legDurS = dist / (speed * U(0.9,1.1)). Dwell per stop U(0.4,1.2)s. Example: 250px at 85px/s = 2.9s + ~0.8s dwell.

| Chip | Speed px/s |
|---|---|
| FAERS | 80 |
| StrokeSense | 105 |
| Code for Cure | 70 |
| Seoul 2026 | 95 |

Independence: separate state, speeds, dwell draws, waypoint draws. Miniature uses the same table in design px; visual speed = speed x miniScale (~0.28-0.62), so it reads gentler, correct for a scaled stage. If QA finds it sleepy, the single knob is a mini multiplier (x1.5), not a second table.

## 5. Converge: kept as hover override

Hover-capable only; touch runs wander uninterrupted (as today). On hover enter: freeze leg (frozenPos=pos, frozenRemainingS=legDurS-(now-legStartMs)/1000; dwell timer frozen too). Glide: converge target exactly as today (~667-685: nearest point on expanded word rect, inside center pushed to nearest edge) but from wander pos (cx=pos.x+chipW/2, cy=pos.y+chipH/2), NOT from drift; recomputed per frame from frozenPos. Blend with existing blends[i], tau 0.22, smoothstep b*b*(3-2*b): render pos = lerp(frozenPos, convergePos, eased). On hover leave: blend back to frozenPos the same way, then resume once blends[i] < 0.01 (legStartMs = now - (legDurS-frozenRemainingS)*1000); waypoint picking pauses while hovering. QA note: converge-path transients change character under wander (waypoint glides, not ellipse blends); reduced-motion rest parks are unchanged (reduced motion never wanders).

## 6. Scroll modulation: dropped

scrollPhase (up to 0.25 loop) coupled drift phase to scroll position. Wander has no phase; the only keep-variant (speed multiplier by scroll) would break the 70-110 px/s spec. The hero is one viewport-height section, so the visible loss is nil. Delete from both loops.

## 7. Reduced motion + fate per structure

Reduced motion: both loop guards stay. No transform is written, so chips sit at CSS base positions (JSX inline left/right/top %); no new positions needed. H-bands (H3/H4/H6) keep hiding static parks (wander never runs there).

| Structure | Fate |
|---|---|
| CURSOR_CHIPS anchors/labels/colors | KEPT: spawn point, transform reference, reduced-motion layout |
| CURSOR_CHIPS radius/duration/phase | DELETE: ellipse parameters; add speed per §4 |
| Laptop companions (loop ~637-650 + CSS) | KEPT: define laptop CSS base (anchor math + reduced-motion); they do NOT bound wander |
| TABLET_ANCHORS | KEPT, same roles in tablet band; radii deleted, speeds shared |
| MINI_CURSOR_CHIPS | KEPT, same roles in mini loop; radius deleted, speeds shared; FAERS anchorY pin 0.30 stays |
| chipBaseAnchor (~887) | UNCHANGED: JSX base must equal loop anchor reference |
| H-bands, entrance fade, parallax | UNTOUCHED |

## 8. Miniature loop deltas (effect ~700-760, deps [heroBand])

Same state machine in design px (stage 1160x600, inset 8). Delete psi/theta/radius-40 drift and scrollPhase. No converge (as today), no word-rect mapping. Spawn = MINI anchors; reduced motion = static MINI anchors. One speed table (§4).

## 9. Tick pseudocode (section; mini identical minus converge)

```
for each chip i:
  el = chipRefs.current[i]; if (!el || el.offsetWidth === 0) continue
  anchor = anchorMath(chip, stageRect)   // unchanged ~632-654
  st = wanderRef.current[i] ??= spawn(anchor)
  clampIntoBounds(st, stageRect, el)
  if (st.mode === "dwell" && now >= st.dwellUntilMs) startLeg(st, now)
  if (st.mode === "move") advanceLeg(st, now)   // easeOutCubic, §2 step 4
  render = st.pos
  if (canHover) render = convergeBlend(st, now, dt)  // §5, else st.pos
  el.style.transform = `translate(${(render.x-anchor.x).toFixed(1)}px, ${(render.y-anchor.y).toFixed(1)}px)`
```

Fixer notes: update the loop header comment (ellipse/dart-dwell/scroll text goes stale); no CSS transition on .mv-diorama-chip/.mv-mini-chip transform; keep the offsetWidth-0 and offscreen skips; QA must re-verify converge endpoints AND paths, and reduced-motion static parks.
