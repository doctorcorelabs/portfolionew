# 10 - QA layout devices (tablet + phone)

Base HEAD `3ea8892` + uncommitted Hero.tsx wander. Read-only QA, tablet + phone only. Spec: `00-synthesis.md`; implementation: `08-fix.md`.

## Verdict: SHIP

No blockers. Every spec item in scope verified in code; one non-blocking observation at the end (minPrev units in the mini loop).

## Tablet 720-1160: verified

| Spec item | Evidence | Result |
|---|---|---|
| Bounds from live stage, inset 12, NO sub-band bounds | Section loop: `wanderBounds(stageRect.width, stageRect.height, chipW, chipH)`, inset constant 12; bounds do not branch on sub-band | PASS |
| Spawn = TABLET_ANCHORS per sub-band | Loop reads `TABLET_ANCHORS[tabletSubBand][chip.label]` with precedence over laptop companions; `chipBaseAnchor` reads the same table in tablet band, so JS anchor == CSS base | PASS |
| Radii deleted, anchors unchanged | All 12 TABLET_ANCHORS entries carry only anchorX/anchorY; values match the pre-round table (portrait-narrow, portrait-wide, landscape) | PASS |
| Wander runs on touch tablets | No hover gate remains in the loop (`hoverCapableRef` deleted); loop comment states wander runs identically on touch and hover devices | PASS |
| Stage size | Section CSS: `minHeight 550`, `height calc(100dvh - 100px)`, so S = max(550, VH-100); bounds y span >= 510, x span >= 566 (widest chip 130 at W=720); 400px legs fit without routine clamping | PASS |
| Sub-band seams 903/904, 1000/1001 | `tabletSubBand` is a loop dep, so a sub-band change restarts the effect and re-spawns at the new sub-band anchors with stagger; one-frame jump, same class as existing seam jumps | PASS |

## Phone miniature <720: visual speeds (the binding calculation)

The mini loop reads scale live per leg (`stageRect.width / 1160`), never the cached `miniScale`. `miniScale` itself is measured from section `clientWidth` via ResizeObserver, and for a borderless section `getBoundingClientRect().width` equals `clientWidth` (padding is internal under border-box), so loop scale == wrapper scale to subpixel rounding. Design speed = table / scale, so visual speed = table exactly, scale cancels. Per-leg jitter U(0.9,1.1) applies on top.

| Phone width | Scale | Design speeds FAERS / SS / CFC / Seoul (px/s) | Visual speeds (px/s, table +/-10%) |
|---|---|---|---|
| 320 | 0.276 | 308 / 344 / 272 / 381 | 76.5-93.5 / 85.5-104.5 / 67.5-82.5 / 94.5-115.5 |
| 390 | 0.336 | 253 / 283 / 223 / 312 | same as above |
| 719 | 0.620 | 137 / 153 / 121 / 169 | same as above |

Naive design-px speeds (19-68 visual px/s) do NOT occur: the divide-by-scale is present in code, read live per leg. Leg durations match desktop (scale cancels in dist/speed); dwell is the same 0.15-0.6s.

Design steps and visual legs:

| Phone width | Design step range | Visual leg range |
|---|---|---|
| 320 | 544-1175 (150/0.276=544; 400/0.276=1450 capped to 1175) | 150-324 |
| 390 | 446-1175 (400/0.336=1190 capped to 1175) | 150-395 |
| 719 | 242-645 | 150-400 |

The 1175 cap trims the top visual leg slightly at 320/390 (324/395 vs 400). Negligible, spec-allowed.

## 320px fallback path (worst case, worked through)

Bounds: x span up to 1018 (widest chip 130: [12, 1018]), y span 548 ([12, 560]). Design step up to 1175 can overshoot both axes. Mirror bounce covers it within the 3-bounce cap: worst y case, pos 560 + step 1175 = 1735, mirror to -615, mirror to 639, mirror to 481, in bounds (3 bounces); worst x case needs 2. Clamped fallback fires only if all 12 tries fail acceptance (in bounds AND >=80 from prevFrom). A short leg can therefore occur ONLY via the reflect+clamp fallback, which is exactly the spec-allowed exception. No edge-piling by construction: reflection is primary, clamp is fallback-only.

Degenerate centering is unreachable on shipped stages (tablet min 720x550 and mini 1160x600 vs chip+24 max 154x52); it is defensive code only.

## Seams

| Seam | Behavior | Verdict |
|---|---|---|
| 720 (miniature/tablet) | `heroBand` (matchMedia) and `miniScale` null switch agree at 720; section loop stops, mini loop starts (and reverse); chip set swaps; re-spawn at new anchors with stagger | PASS, one-frame jump acceptable |
| 1160/1161 (tablet/desktop) | `heroBand` change restarts the section loop (dep); re-spawn at desktop base/companions vs tablet anchors, stagger | PASS, one-frame jump acceptable |
| Within-band resize | Per-frame clamp re-bounds pos/to; a shrink can shift an out-of-bounds chip to the new edge mid-leg, which is the spec's clamp behavior, not a seam jump | PASS |

## Gates unchanged

Diff grep for added/removed lines containing `mv-collage-show`, `hideClass`, `mv-collage-hide`, `mv-mini-exclude`: 0 (the single `display` match is a loop comment about skipping display:none chips). COLLAGE_ITEMS hideClass strings are byte-identical: miniature short-state exclusions (helix, Cochrane, notify, stickers, microscope) intact, tablet show-markers intact. Wander does not bypass any gate: chips are independent of card gates by design, and gated cards are display:none while chips pass over the stage under the pass-through standard.

## Pass-through standard (not parks)

Dwell is capped by construction in both loops: `dwellUntilMs = now + U(0.15,0.6)*1000`, spawn stagger 300+250i ms. No chip can stop over 0.6s anywhere, on any device. Transient chip-vs-card/word/pill/chip-chip contact is therefore EXPECTED and must not be flagged; the governing rule is the dwell cap, not clearance. `prevFrom` is captured BEFORE `from` is overwritten in both loops, so the >=80 anti-ping-pong rule is not vacuous.

## Non-blocking observation: minPrev units in the mini loop

`pickWanderTarget` receives `WANDER_MIN_PREV = 80` in the loop's coordinate frame, so in the mini loop it means 80 design px = 22 visual px at 320, 27 at 390, 50 at 719, vs 80 visual px in the section loop. The spec's picker text states ">= 80" without a mini conversion (step and speed conversions are specified; minPrev is not), so the fixer followed the letter of the spec. Practical impact is negligible: design steps are >= 544px at 320px, and the 12-try rejection makes repeated near-prevFrom landings vanishingly unlikely; true A-B-A oscillation needs consecutive landings within 80 design px of prevFrom. Optional hardening, NOT required for ship: pass minPrev/scale in the mini loop for strict visual-px parity. If it is ever changed, regression QA must re-check mini leg acceptance, since it alters acceptance, not layout.

## What QA-a11y still owns (not this report)

Reduced-motion static positions and mount behavior under emulation, and the vestibular disclosure. The guards are present in code (both loops early-return on `prefers-reduced-motion: reduce`), but the emulated-render check belongs to QA-a11y.
