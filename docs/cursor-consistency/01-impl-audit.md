# Cursor chips: implementation audit (base 1255c6f)

Source: `src/sections/Hero.tsx` (1747 lines) at base `1255c6f`, working
tree clean when read. Scope: the 4 drifting cursor chips only. The 3 fact
pills share the container but have separate motion; pill changes are out
of scope except where a shared container rule forces them.

## 1. Element structure and selectors

- Container: `<div class="mv-diorama" aria-hidden="true">`, lines
  1534-1539. Inline style and CSS block (700-706) agree: `position:
  absolute; inset: 0; z-index: 2; pointer-events: none; overflow:
  hidden`. Layer order: collage 0, frame 1, diorama 2, so chips paint
  above cards and the word frame.
- Chips: one `<span class="mv-diorama-chip" data-chip={label}>` per entry,
  lines 1540-1588. `data-chip` values are the labels: `FAERS`,
  `StrokeSense`, `Code for Cure`, `Seoul 2026`. It is the only per-chip
  CSS hook, used by exactly two rules (section 3).
- Chip content: a 14x17 arrow SVG (colored fill, white stroke) plus a
  label pill (11px JetBrains Mono, `padding: 3px 8px`, 1px `#E0E0E0`
  border, `border-radius: 999`, `white-space: nowrap`). Chips are
  content-sized; no fixed chip width or height exists in CSS or JS.
- Pills (contrast only): `<span class="mv-diorama-pill">`, lines
  1589-1613, same container. CSS-animated (`mv-float`, 8/10/12s), never
  rAF-driven, never converge, never drift.

## 2. JS motion code

- Definitions: `CURSOR_CHIPS`, lines 106-111. All four share radius 20.
  FAERS: anchor 0.195/0.30, 18s, phase 0. StrokeSense: 0.55/0.33, 22s,
  0.3. Code for Cure: 0.30/0.695, 16s, 0.55. Seoul 2026: 0.80/0.695, 24s,
  0.8. Anchors are stage fractions; radius px; duration seconds per
  loop; phase a loop fraction.
- Refs and hover: `chipRefs` (254), `wordHoveredRef` (255),
  `wordHovered` state (259). Hover comes from `onMouseEnter` /
  `onMouseLeave` on the `<h1 class="mv-word">` itself (1705-1706),
  synced into the ref at 354-356 so the frame callback never goes stale.
- rAF loop: lines 358-490. Gate (367-373): runs only when `(hover:
  hover) and (pointer: fine)` matches AND `prefers-reduced-motion` does
  NOT match; otherwise the effect returns early and no loop ever starts.
  Per frame: `dt` clamped to 0.05s; DOM writes skip while the hero is
  offscreen (403-409) but rAF keeps scheduling; tab-hidden pause comes
  free from rAF.
- Drift: `angle = 2π (elapsed/duration + phase + scrollPhase)` (454),
  `driftX = radius * cos(angle)`, `driftY = radius * 0.7 * sin(angle)`
  (455-456): an ellipse, +-20px horizontal, +-14px vertical.
  `scrollPhase` (414-418) adds up to 0.25 loop from scroll position.
- Converge: target is the nearest point on the word rect expanded by
  20px on all sides (419-421, 459-475); a center already inside is
  pushed to the nearest edge, never onto the word. Blend:
  `blends[i] += (target - blends[i]) * (1 - exp(-dt / 0.3))`, then
  smoothstep `eased = b*b*(3-2*b)` (479-484). Final write (485):
  `el.style.transform = translate(fx, fy)`. No React state per frame,
  no CSS transition on chip transform (deliberate, matches the Onlines
  reference). The only CSS animation on chips is the entrance fade
  `mv-diorama-in 0.8s ease 2.2s both` (1555), opacity only.
- Per-band anchor overrides (1161-1400, rearrangement companions).
  Seoul 0.80 -> 0.70 via `matchMedia("(min-width: 1161px) and
  (max-width: 1400px)")` (377-389, 427-430); the comment states
  matchMedia keeps the JS band identical to the CSS evaluation,
  scrollbar included. StrokeSense 0.33 -> 0.45 via `window.innerWidth >
  1160 && <= 1400` (436-451): note the two companions use different
  band-evaluation methods. Both exist because base anchors collide with
  moved cards (Seoul 0.80 sits on the bottom-right poster; StrokeSense
  0.33 overlaps the top-center-left review). Above 1400px both stay at
  base anchors; at or below 1160px the diorama is hidden, so the
  overrides are moot.
- Does the loop run when chips are hidden? Yes, in one case. The effect
  never checks `display`: on a hover-capable fine-pointer device at
  widths <= 1160px it still runs and writes transforms to `display:
  none` elements, wasted work with invisible output. On touch
  (`hover: none`) and under reduced motion it returns early, so no
  loop exists at all. Consequence: touch visibility needs a JS gate
  change, not just CSS.
- Collage parallax (492-540) does NOT move chips: rAF-throttled
  mousemove translates only the `.mv-collage` layer (+-8px), so
  chip-vs-card relative motion is parallax 8px plus card float 8px.

## 3. Every hide/show rule

| Rule | Lines | Effect |
|---|---|---|
| `.mv-diorama` base | 700-706 | absolute, inset 0, z-index 2, pointer-events none, overflow hidden |
| `.mv-diorama-chip` base | 707-713 | absolute, flex, gap 6px, pointer-events none |
| `.mv-diorama-pill` base | 714-717 | absolute, pointer-events none, nowrap |
| `(hover: none)` | 728-732 | `.mv-diorama { display: none }` (all touch) |
| `(max-width: 1160px)` | 738-742 | `.mv-diorama { display: none }` (tablet + phone) |
| `(max-width: 900px)` | 743-746 | `.mv-diorama-pill { display: none }` (pills only; chips already gone via 1160) |
| `(prefers-reduced-motion: reduce)` | 761-765 | `.mv-diorama { display: none }` |
| FAERS pill height gate | 1075-1077 | `(min-width: 720px) and (max-height: 1090px)` hides `.mv-diorama-pill-faers` |
| StrokeSense base top | 1118-1121 | 1161-1400: `[data-chip="StrokeSense"] { top: 45% !important }` |
| Seoul base right | 1177-1183 | 1161-1400: `[data-chip="Seoul 2026"] { right: 30% !important }` (base 20%) |
| CFC pill base bottom | 1190-1194 | 1161-1400: `.mv-diorama-pill-cfc { bottom: 45% !important }` (base 30%) |
| Tablet block | 1272-1311 | Container `display: block` in 768-1000 and 1024-1160 only. Chips forced `display: none` in both. Pills `display: none`, then CFC re-shown (right 40% / 30%, `!important`). FAERS pill only at `min-height: 1091px`. Seoul pill: NO show rule. 741-767 keeps CFC hidden. |
| Reduced-motion guard, repeated | 1317-1321 | `.mv-diorama { display: none }` after the tablet block, so the revival cannot resurrect the layer for reduced-motion users |
| Miniature reduced-motion | 1512-1519 | Kills `.mv-collage` animation inside `.mv-hero-mini` only; no diorama rule |

- Phone miniature exclusion: the diorama JSX (line 1534) is a SIBLING
  placed BEFORE the `.mv-mini` wrapper (line ~1618), not inside it. The
  miniature stylesheet (lines 1405-1519) contains zero diorama rules.
  `miniScale` (lines 326-344) applies only to `.mv-mini` below 720px
  layout width (`scale = clientWidth / 1160`, section height = `600 *
  scale`). Chips therefore never scale with the miniature, and their
  `%` anchors would resolve against the short phone section, not the
  1160x600 design stage. Any phone chip implementation must either move
  the layer inside the wrapper or re-anchor it for the phone section.
## 4. Sizes and positioning resolution

- Chip size is content-derived and measured live: the tick reads
  `el.offsetWidth` / `el.offsetHeight` every frame (426, 457-458).
  Rough size: 14px arrow + 6px gap + 11px mono label with 3px/8px
  padding and 1px border, about 23px tall, roughly 100-150px wide.
- Base position comes from inline styles (1547-1551): `left:
  anchorX*100%` when anchorX <= 0.5, else `right: (1-anchorX)*100%`,
  plus `top: anchorY*100%`. Containing block is the section (diorama is
  `absolute; inset: 0` inside it). FAERS (0.195) and Code for Cure (0.30)
  are left-anchored; StrokeSense (0.55) and Seoul (0.80) are
  right-anchored. JS anchor math (431-452): left-anchored chips use
  `anchorX * stageRect.width`; right-anchored chips use `anchorX *
  stageRect.width - chipW0` (right edge on the anchor). Vertical anchor
  is always `anchorY * stageRect.height`. Drift and converge offsets
  are px added via `transform: translate(...)`, never by changing base
  position.

## 5. What must change (for the fixers)

1. Decide the per-surface contract first: which surfaces show chips
   (desktop only today) and whether pills change at all.
2. To show chips on touch, replace the rAF effect's hover gate
   (367-373) with a gate that actually starts the loop there. On touch
   there is no word hover, so converge needs a substitute (drift-only,
   tap-to-converge, or scroll-driven) or must be dropped on that
   surface. CSS alone cannot revive a loop that never started.
3. To show chips on phones, resolve the wrapper problem: the diorama is
   outside `.mv-mini`, so chips will not scale with the miniature and
   will anchor to the short phone section. Either move the layer inside
   the wrapper (then the rAF stage rect must become the design stage)
   or design phone anchors for the phone section.
4. To make motion "more active", change `radius` (all 20) and/or
   `duration` (16-24s) in `CURSOR_CHIPS`, not the easing or transform
   discipline. Bigger radius or shorter duration eats the chip-vs-card
   margins the 0.195 / 0.45 / 0.70 anchors were tuned to protect;
   re-verify every pair at every band after any change.
5. Keep chip-targeted CSS on `.mv-diorama-chip` / `[data-chip="..."]`,
   never on bare `.mv-diorama`, or pills change as a side effect. Keep
   the repeated reduced-motion guard after any new show rule, as at
   lines 1317-1321.
6. Unify the two band-evaluation methods (Seoul matchMedia, 388-389;
   StrokeSense `window.innerWidth`, 447-449) for any new band override,
   so JS and CSS bands cannot disagree at the scrollbar seam.
7. Re-verify the tablet block: any chip show rule for 768-1160 must beat
   the `display: none` at 1277/1292 by specificity or source order, and
   must survive the reduced-motion guard at 1317-1321.

## Closing constraint

The single most important implementation constraint: chips are
decorative-only, pointer-dead, aria-hidden elements whose anchors, radius,
and hide rules exist to keep them off cards and off the word glyphs, so no
visibility or motion change may ship without re-verifying chip-vs-card
gaps at every width and height band it touches.
