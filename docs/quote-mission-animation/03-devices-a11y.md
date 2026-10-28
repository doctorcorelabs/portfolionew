# 03 - Devices, accessibility, performance constraints

CONSTRAINTS ONLY. Treatment (which mission sub-parts animate, in what order) belongs to another analyst. No treatment design, no code. Base: HEAD `edb7bd6`, `src/sections/Quote.tsx` read in full.

## Facts

- Mission `<p>`: 18px, 1.65, GRAPHITE `#3C3C38`, maxWidth 640, margin 0. Blue span `CodeCureConnect:` is `#0859D4`, already inline.
- Current entrance: opacity 0 at progress 0.9 or below, linear to 1 at 1.0, plus 14px rise, transform `none` at opacity 1.
- Claim precedent: 15 plain inline word spans, unpainted = PALE `#D6D6D6` plus `1px rgba(1, 1, 1, 0.15)` stroke, painted = INK `#010101`, 0.35s color transition, reversible on scroll-up.
- Scroll: ONE ticking rAF pattern (passive scroll + resize listeners, `progress` in React state, one rect read per tick). No timers.
- Geometry: wrapper `100svh+1875+240` (narrow ≤1023: `+1125+140`); sticky `min-height: 100svh`, `overflow: visible`, padding 120/24 desktop, 70/24 narrow; container 1160; gutter 32.
- Dots: base breathe 8s (0.85 to 1) base-only; lit layer cursor-only.

## 1. Per-device behavior

| Band | Runway / padding | Width | Constraint |
|---|---|---|---|
| Phone portrait 320-430 | Narrow 1125+140; 70/24 | 240-350px, 6-9 lines | Inline spans only, like claim words. No block/flex/grid splits; whitespace stays as text nodes. |
| Phone landscape 667-932 | Narrow 1125+140; 70/24 | 587-640px, ~4 lines | Short viewport; sticky may exceed it. Progress ONLY: no IntersectionObserver, no scroll-jacking. |
| Tablet portrait 768-834 | Narrow 1125+140; 70/24 | 640 capped, ~4 lines | Same mapping as phone portrait. No band-specific parameters. |
| Tablet landscape 1024-1180 | Desktop 1875+240; 120/24 | 640 capped, ~4 lines | Seam 1023/1024 changes runway/padding only. Thresholds MUST be progress fractions, never pixels. |
| Desktop 1280+ | Desktop 1875+240; 120/24 | 640 capped, ~4 lines | Identical mapping. Container 1160 centered. |

Identical every band: 18px, 1.65, maxWidth 640, 24px padding, 32px gutter, inline spans, progress fractions, reversible painting.

## 2. Readability at every rest position

A rest position is any scroll stop.

- At 1.0: 100% final, GRAPHITE body, BLUE `CodeCureConnect:`, zero pale residue.
- Above 0.9, NO part may be opacity 0, `display: none`, or `visibility: hidden` at any rest stop. Unpainted parts stay legible-pale: PALE plus 1px stroke.
- Only allowed invisible state: pre-existing whole-paragraph entrance (opacity 0 at or below 0.9). Never extend it to sub-parts.
- No stacked fades: parts paint by color only inside the existing ramp, or the treatment replaces the ramp. Stacked fades double-ghost early parts.
- BLUE span needs an explicit pale state (stated in treatment). Never ambiguous; lands on BLUE at 1.0.

Contrast on white (18px needs 4.5:1, approx):

| Color | Ratio | Status |
|---|---|---|
| INK `#010101` | ~20:1 | Pass |
| GRAPHITE `#3C3C38` | ~11:1 | Pass |
| BLUE `#0859D4` | ~6:1 | Pass |
| PALE `#D6D6D6` (ghost) | ~1.4:1 | FAILS as text: transient pre-paint ghost only, never final state |

## 3. Reduced motion

Already guaranteed (verify, do not re-implement):

- Early-return branch: `reducedMotion` renders a plain static section (`130px 24px`, `body(1)`): no wrapper, pinning, scroll listener, or rAF. Claim fully painted via `||` guard; mission opacity 1, transform `none`.
- CSS backstop (dormant; pinned JSX never renders here): wrap height auto, sticky static, dot breathe `none`. Must not become the mechanism.
- `matchMedia` listener updates `reducedMotion` live; mid-session toggle must switch branches instantly.

Treatment MUST:

- `reducedMotion ||` guard on EVERY part: when true, all parts final color, no thresholds, no opacity below 1, no transform.
- No CSS animation or keyframes on mission elements. CSS kill list is a backstop, not the mechanism.
- Never derive part states from `progress` alone. Trap: under reduced motion progress stays 0 (scroll effect never runs), so unguarded thresholds render ALL parts pale. Guard forces final state.
- No wrapper, height, or pinning dependency on the mission. Never gate parts on `dotEntrance` or `cursorLit`.

## 4. Touch

- Scroll-driven ONLY from existing `progress`; advances on touch scroll (passive listener already fires). No hover, tap, or tap-to-reveal gate.
- Never depend on `cursorLit` (mouse-only, never fires on touch). Dot lit stays background-only; mission parts independent of it.
- No separate touch mapping: same thresholds, order, final state on touch and mouse.
- Fast flings may jump progress far. Part states must be pure functions of `progress` (monotonic thresholds); a fling to the bottom still lands every part final.

## 5. Performance

- ONLY opacity, color, transform (scale via transform). NEVER width, height, margin, padding, font-size, line-height. No layout shift, any band.
- No new scroll listeners, timers, or rect reads in the mission path. Read existing `progress`; derive part states during render, like the claim loop. No per-part state.
- Trivial cost: a handful of parts (3-4 clauses; even 6-8 fine), one threshold comparison per tick. No `will-change` on spans.
- Color transitions, if any, match the claim's 0.35s cap so scroll-up unpaints promptly.
- Part transforms, if any, compose with (do not replace) the paragraph's 14px rise unless the treatment replaces it. They must never move a part across lines.

## 6. Vestibular and flashing

- No flashing: part states are monotonic functions of progress. No oscillation, strobe, or rapid cycling. Scroll-driven reversible is safe; autoplay prohibited.
- No infinite text animation: no loops, breathing, or pulsing on mission text. Only infinite animation is dot breathe (8s, background dots only, 0.85 to 1).
- No layout-changing transform. Any transform is transform-only, subtle, reversible with scroll.
- Reduced motion is the mitigation (section 3). Without the preference, users see a user-paced reversible sequence, not autoplay.

## 7. Pass/fail QA checks

| # | Check | Pass condition |
|---|---|---|
| D1 | Inline-only | No block/flex/grid part. Line counts 320-1440 equal current build. |
| D2 | Final state | At 1.0: every part GRAPHITE, `CodeCureConnect:` BLUE, zero pale residue, all bands. |
| D3 | Mid-sequence rest | Above 0.9, no part opacity 0 or hidden. Unpainted parts pale plus stroke. |
| D4 | Reversibility | Up unpaints in reverse; down repaints; fling to bottom lands all final. |
| D5 | Reduced motion, static | Emulated: static section, fully GRAPHITE plus BLUE, no wrapper, pinning, animation, hidden text. |
| D6 | Reduced motion, toggle | Mid-session toggle to static instantly, no mid-flight animation, no pale/hidden text. |
| D7 | Touch | Touch scroll advances parts, no hover, no tap. `cursorLit` never required. |
| D8 | Listeners/timers | Existing scroll plus resize only. Zero new listeners, timers, rect reads, per-part state. |
| D9 | Properties | Only opacity, color, transform. Zero layout properties or keyframes on mission text. |
| D10 | Seam 1023/1024 | Same mapping, order, final state both sides. Runway/padding change only. |
| D11 | Blue span | Explicit pale state; lands on BLUE at 1.0. |
| D12 | Geometry | maxWidth 640, 24px padding, 32px gutter, 18px, 1.65 identical all bands, no layout shift. |
| D13 | Live preview | Phone portrait, 1.0 final-state, reduced-motion eyeballs; touch-scroll spot check. (Sandbox cannot render.) |
