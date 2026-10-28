# Journey: balanced package - Contour Drift, Instruments, Step Forward

Implementation spec. Scope: `src/sections/Manifesto.tsx` ONLY, plus this
doc. No other file changes. This package layers on top of the existing
Journey (route draw, node pops, active pulse, drift blob, bead, seals,
stage lights, labeled dots). It changes no copy, no dots, no counts,
no seals, no bead, no lights, and no header or footnote text.

## 0. Grounding in the real code (do not re-derive these)

- Section: `id="manifesto"`, `position: relative`,
  `overflow: hidden`, background `#111111`, padding `130px 24px`.
  Content wrapper: `position: relative`, `zIndex: 1`, `maxWidth: 1160`,
  centered. The wrapper creates a stacking context with a transparent
  background. That is why the existing wells (`zIndex: -1` inside
  `.journey-grid`) paint above the section background and below text.
  Any new negative z-index layer MUST live inside this wrapper (the
  grid is the right host), never as a direct section child: a direct
  section child with negative z-index would paint behind the section
  background in the root stacking context and be invisible.
- Grid `.journey-grid`: 5 columns `1fr`, rows `auto 48px auto`,
  `column-gap: 24px`, `position: relative`. Route `.journey-line`:
  `grid-column: 1 / -1`, `grid-row: 2`, dashed top border, inline
  `transform: scaleX(progress)`. Node dot: 16px `#0859D4` with a 2px
  `#FAFAFA` border.
- Stations: `article` classes `mvM-reveal journey-station`, plus
  `journey-station-active` when active. `onTop = i % 2 === 0`, so
  2022, 2024, 2026 sit in grid row 1 (above the route) and 2023, 2025
  sit in grid row 3 (below the route). Above stations carry
  `paddingBottom: 28`, below stations `paddingTop: 28`.
- Article content order today: mobile glow div (active only), mobile
  node dot, mobile arrival ring, year row div (year `<p>` + seal),
  title `h3`, detail `<p>`, labeled dot list, dotCount `<p>`.
- Existing motion state (REUSE, do not duplicate): one `useEffect`
  with a rAF-throttled passive `scroll` listener plus `resize`
  routed through the same handler. `progress` = section scroll
  progress clamped 0 to 1, committed only on 0.005+ moves.
  `activeIdx` = index of the `.journey-station` nearest the viewport
  center, or -1 when offscreen. The reduced-motion branch
  early-returns: adds `mvM-in`, sets `progress` to 1 and `activeIdx`
  to 4, adds NO scroll listener.
- Mobile breakpoint: `max-width: 1100px` (not 1024, not 720). Below
  it: grid becomes `display: block`; line and desktop nodes are
  `display: none`; stations get `padding-left: 40px`,
  `padding-bottom: 48px` (0 on last); the vertical dashed line is
  `.journey-station::before` at `left: 7px`; the mobile node dot sits
  at `left: 0`, `top: 6px`, 16px.
- Tokens: headings `#FAFAFA`, body `#D8D8D8`, mono labels `#98989C`,
  blue `#0859D4`. Site overshoot curve:
  `cubic-bezier(0.34, 1.56, 0.64, 1)`. Site ease-out:
  `cubic-bezier(0.22, 1, 0.36, 1)`.

## 1. Reconciliation: the article transform is owned by reveal

This is the one structural fact the fixer must respect. The article
carries class `mvM-reveal`, and the stylesheet rules for it own the
article's `transform` property:

- `.mvM-armed .mvM-reveal`: `transform: translateY(18px)`.
- `.mvM-armed.mvM-in .mvM-reveal`: `transform: translateY(0)`,
  with `transition: opacity 600ms ease, transform 600ms
  cubic-bezier(0.22, 1, 0.36, 1)`.
- The article also carries an inline `transitionDelay`
  (`200 + i * 150` ms) that applies to that reveal transition.

Consequence: Step Forward MUST NOT set a transform on the article.
Doing so would fight the reveal rules (specificity and ordering),
inherit the reveal transition delay, and break the entrance. The
fix is an inner wrapper (section 4): the article keeps its reveal
transform, the wrapper carries the step transform, and the two
compose (parent translate plus child translate) with no conflict.
The same logic protects the year pop (transform on the year `<p>`)
and the seal snap (transform on the seal span): both are descendants
of the wrapper, so their transforms compose with the step instead of
fighting it.

## 2. Contour Drift background

One SVG element, rendered as a direct child of `.journey-grid`
(inside the wrapper stacking context, see section 0), before the
wells in DOM order so it paints below them.

### 2.1 Element and geometry

- Element: `<svg aria-hidden="true" className="journey-rings">`,
  `width: 2400`, `height: 2400`, `viewBox: "0 0 2400 2400"`,
  `position: absolute`, `pointer-events: none`, `zIndex: -2`.
  Seven `<circle>` children, all `cx: 1200`, `cy: 1200`, radii
  300, 400, 500, 600, 700, 850, 1000 (diameters 600, 800, 1000,
  1200, 1400, 1700, 2000). No fill on any circle.
- Stroke: 1px, `stroke: rgba(255, 255, 255, 0.06)` on every ring,
  `vector-effect: non-scaling-stroke` so the stroke stays 1px at
  every scale and on mobile. HARD CAP: no ring stroke alpha above
  0.08, ever. If preview finds arcs distracting over the 2026
  column, the fix is to move the anchor further right (section
  2.3), never to raise alpha, and never to dim body text.
- Desktop anchor: the SVG center sits 120px beyond the right edge
  of the grid: `left: calc(100% + 120px)`, `top: 50%`, with
  `transform: translate(-50%, -50%) scale(s)` (see 2.2). The
  translate centers the 2400px box on the anchor point; the scale
  applies about the center, so the anchor never moves. Only the
  left arcs of the rings cross the content area, which is the
  intended faint map texture; the bulk of the rings sits off
  canvas, and the section `overflow: hidden` clips the rest.
- Z-order (all inside the wrapper stacking context): section
  background, then rings (`-2`), then wells (`-1`), then drift
  blob (`0`, section sibling), then content (`1`). Rings never
  paint above text.
- Pre-reveal gate, mirroring the wells:
  `.mvM-armed:not(.mvM-in) .journey-rings { opacity: 0 }`.
  Otherwise opacity 1 (faintness comes from stroke alpha, not
  element opacity).

### 2.2 Scroll-driven expansion (no time loop)

Derive one scale value in render from the existing `progress`
state. No new state, no measurement, no listener.

- `k = Math.min(4, Math.floor(progress * 5))` (station window
  index, 0 to 4; at `progress = 1`, `k = 4`).
- `s = 1 + 0.04 * k` (so 1.00, 1.04, 1.08, 1.12, 1.16 across the
  five windows).
- Inline style on the SVG: `transform:
  translate(-50%, -50%) scale(s)`, with CSS `transition:
  transform 800ms ease-out`. Each window step therefore eases
  over 800ms instead of jumping, which is the per-window easing
  feel from the approved description. Reconciliation note: the
  rings share one SVG transform, so per-ring stagger is not
  separately animated; the window-quantized scale plus the 800ms
  ease-out is the specified behavior. Do not split the rings into
  seven separately transformed elements to fake stagger.
- At rest (progress constant) the scale holds and the rings sit
  still as a faint map texture. Scrolling back reverses the
  scale through the same windows, same as every other
  scroll-driven value in this section.

### 2.3 Mobile (max-width 1100px)

- Same SVG element, re-anchored: `left: 7px` (the vertical route
  line x within the grid; articles are in normal flow in the
  block grid, so the line x equals the grid x), `top: 50%`,
  `width: 1200`, `height: 1200`, same translate/scale transform.
  Rendering the same 2400 viewBox at 1200px halves all diameters
  (visual 300 to 1000), which is the specified smaller size.
- Show only 4 rings on mobile: circles with radii 300, 400, 500
  (the three smallest) get `display: none` below 1100px; radii
  600, 700, 850, 1000 stay (visual diameters 600, 700, 850,
  1000). Give each circle a class `journey-ring-0` through
  `journey-ring-6` in radius order so the media query can target
  them.
- The section `overflow: hidden` is a backstop only: the left
  arcs extend past the section's left edge and are clipped, as
  intended.

### 2.4 Reduced motion

Inside the existing `prefers-reduced-motion` block:
`.journey-rings { transform: translate(-50%, -50%) scale(1.08)
!important; transition: none !important; }`. Scale 1.08 is the
middle size (`k = 2`), so the rings render statically at their
middle size with no expansion. No animation, no transition.

## 3. The Instruments assets

One line-drawn tool per station, in its own block inside the step
wrapper (section 4), after the dotCount paragraph. Placement
reconciliation: the approved description says "after the dot
list"; the dotCount label belongs glued to its list, so the
instrument block goes after the dotCount paragraph (end of
article content), not between the list and its count. The block
is in normal flow, so it adds about 88px (72px art plus 16px
top margin) to each article; grid rows are `auto`, so rows grow
and the alternating layout is preserved. This is a one-time
layout addition, not a shift: text above the block never moves
when the instrument animates, because instrument motion is
opacity, stroke, and dashoffset only.

### 3.1 Component and shared style

- Component `JourneyInstrument({ index, active })`, following the
  existing `JourneySeal` pattern. Rendered once per station.
- Element: `<span aria-hidden="true"
  className={active ? "journey-instrument
  journey-instrument-active" : "journey-instrument"}>` containing
  one inline SVG: `width: 72`, `height: 72`,
  `viewBox: "0 0 72 72"`, `display: block`.
- Shared SVG style: `stroke-linecap: round`,
  `stroke-linejoin: round`, `fill: none`, `stroke-width: 1.5`.
  Lock the weight: 1.5 on every shape, no exceptions. The block
  style: `marginTop: 16`, left-aligned (no centering), same on
  mobile (in-flow, so no mobile override is needed). No hover
  state exists and none is added.
- Rest state (all five, always visible): every shape stroke
  `rgba(255, 255, 255, 0.7)`, accent element unlit (white stroke
  or no fill, per shape below). The rest state reads as quiet
  outlines.
- Active state (when `activeIdx === i`, the EXISTING
  active-station signal, not bead arrival): the wrapper span gets
  `journey-instrument-active`, and: (a) all shapes stroke
  `#FAFAFA` at full opacity; (b) the single accent element per
  asset takes BLUE (stroke BLUE for line accents, fill BLUE for
  the bubble accent); (c) the draw animation runs once (see
  3.3). When the station deactivates, the active class drops and
  the asset fades back to its quiet outline over a 300ms
  opacity/stroke transition. It is never erased.
- Accent budget (hard rule): at most ONE blue accent element per
  asset. The fixer must count accents per asset and keep the
  total at five (one each), matching the seal rule that already
  governs this file.

### 3.2 Shapes (paths in the 72x72 box, all coords within 6..66)

- 2022, open book (entering medicine). Spine:
  `M36 14 V54`. Left page:
  `M36 18 C28 12 18 12 10 16 V50 C18 46 28 46 36 52`.
  Right page:
  `M36 18 C44 12 54 12 62 16 V50 C54 46 44 46 36 52`.
  Accent: the spine (stroke BLUE when active).
- 2023, pen nib with three short motion lines. Nib outline:
  `M36 6 L52 38 C52 52 46 62 36 62 C26 62 20 52 20 38 Z`.
  Slit: `M36 20 V44`. Motion lines: `M8 28 H16`,
  `M6 40 H14`, `M8 52 H16`. Accent: the slit (stroke BLUE
  when active).
- 2024, globe (world stages). Circle: `cx: 36`, `cy: 36`,
  `r: 22`. Horizontal orbit ellipse: `cx: 36`, `cy: 36`,
  `rx: 30`, `ry: 10`. Vertical orbit ellipse: `cx: 36`,
  `cy: 36`, `rx: 10`, `ry: 30`. Meridian arc:
  `M36 14 C48 24 48 48 36 58`. Accent: the horizontal orbit
  ellipse (stroke BLUE when active).
- 2025, Erlenmeyer flask with three small bubble circles.
  Flask outline (single path):
  `M30 8 H42 V26 L58 56 Q60 62 54 62 H18 Q12 62 14 56 L30 26 Z`.
  Bubbles (white outline circles): `(28, 48, r 2.5)`,
  `(44, 42, r 2.5)`. Accent bubble: `(36, 54, r 3)`, stroke
  white at rest, fill BLUE and stroke BLUE when active.
- 2026, poster frame (clinic and congress). Frame:
  `M12 8 H48 L62 18 V62 H12 Z`. Fold: `M48 8 V18 H62`.
  Text hairlines: `M20 30 H54`, `M20 40 H54`. Accent: the
  fold path (stroke BLUE when active).

### 3.3 Draw-on activation (700ms, no erasure)

- Every stroked shape in the instrument SVG carries
  `pathLength: 100`. (SVG `pathLength` applies to path, circle,
  ellipse, and rect alike.)
- Base style (no active class): no dash array, fully drawn at
  rest opacity. This is what makes "never erased" true: removing
  the active class returns the asset to a fully drawn outline,
  not to an empty box.
- Active class only:
  `.journey-instrument-active svg * { stroke-dasharray: 100;
  animation: journey-instrument-draw 700ms ease-out forwards; }`
  with `@keyframes journey-instrument-draw { from {
  stroke-dashoffset: 100; } to { stroke-dashoffset: 0; } }`.
  The animation runs once per activation (class toggling
  restarts it on re-activation, same as the seal snap). The
  `forwards` fill holds the drawn state while active.
- Opacity/stroke transitions: the instrument span transitions
  `opacity 300ms ease` and its shapes transition `stroke
  300ms ease` and `fill 300ms ease` in both directions, so
  deactivation fades the asset back to quiet instead of
  snapping.
- The draw animation runs on the SVG shapes only. It never
  touches the article, the year row, the title, the detail, or
  the dot list, so text never moves during a draw.

### 3.4 Reduced motion

Inside the existing `prefers-reduced-motion` block:
`.journey-instrument-active svg * { animation: none !important; }`
and instrument span/shape transitions `none !important`.
Result: fully drawn static outlines everywhere, the active
station's instrument at full opacity with its accent lit
(`activeIdx` is 4 under reduced motion from the existing
branch, so the 2026 instrument renders lit statically), no draw
animation. No draw logic changes are needed in the effect.

## 4. Step Forward transition

### 4.1 Structure: the step wrapper

Wrap the article's flow content in one new div, and nothing
else:

- New element inside each `article`, after the mobile glow,
  mobile node dot, and mobile ring elements (those three stay
  direct children of the article, because they are positioned
  relative to the article box and must NOT step):
  `<div className={onTop ? "journey-step journey-step-top" :
  "journey-step journey-step-bottom"}>` containing, in order:
  year row div, title `h3`, detail `<p>`, dot list div,
  dotCount `<p>` (when present), instrument block (section 3).
- The wrapper is a plain block div in normal flow. It carries
  no margin, no padding, no width. The article keeps its grid
  placement, its `paddingBottom`/`paddingTop` (28px), its
  `minWidth: 0`, and its `mvM-reveal` class with the inline
  `transitionDelay`. The wrapper has its own transition (4.2)
  and no transition delay, so the step never inherits the
  reveal delay.
- The glow, mobile node dot, and mobile ring stay outside the
  wrapper on purpose: the glow marks the active station's
  position on the line, and the node dot and ring sit on the
  line itself. Stepping them would move the markers off the
  route. Only the reading content steps.

### 4.2 Distances, directions, timing

- Base rule: `.journey-step { transition: transform 500ms
  cubic-bezier(0.34, 1.56, 0.64, 1); }` (the site overshoot
  curve). No transform in the base rule: inactive stations sit
  at their natural position.
- Active rules (keyed off the article's existing
  `journey-station-active` class, which already reflects
  `activeIdx`):
  - `.journey-station-active .journey-step-top { transform:
    translateY(12px); }` (above-route stations: 2022, 2024,
    2026, grid row 1, step DOWN toward the route).
  - `.journey-station-active .journey-step-bottom { transform:
    translateY(-12px); }` (below-route stations: 2023, 2025,
    grid row 3, step UP toward the route).
- Clearance math (desktop): above stations hold 28px of bottom
  padding to the route row, so a 12px step leaves 16px clear;
  below stations hold 28px of top padding, so a -12px step
  leaves 16px clear. Content never touches the route line.
- Departure: when `activeIdx` moves on, the old article loses
  `journey-station-active`, its wrapper's transform returns to
  none, and it relaxes back over the same 500ms overshoot.
  Arrival and departure are the same transition in opposite
  directions; there is no separate departure timing.
- At rest: the active station sits 12px closer to the route,
  every inactive station sits at its natural position.
- Fast scroll: each new `activeIdx` simply retargets the CSS
  transition mid-flight. Transitions retarget automatically;
  there is no JS timer, no queue, and no queued animation to
  drain. The spec forbids adding any: no timeout, no
  animationend chaining, no step state beyond `activeIdx`.
  A fast scroll may therefore cut a step short mid-flight, and
  that is accepted: the parked position always matches the
  current active station.

### 4.3 Mobile (max-width 1100px)

- One override, inside the existing 1100px media block:
  `.journey-station-active .journey-step-top,
  .journey-station-active .journey-step-bottom { transform:
  translateX(-8px); }`. Every station steps 8px LEFT toward
  the 7px vertical line, regardless of above/below (the
  distinction does not exist in the stacked layout).
- Clearance math (mobile): stations carry 40px of left padding,
  so an 8px step leaves the content 32px inside the article
  box, still clear of the line and of the viewport edge
  (section side padding is 24px). The section
  `overflow: hidden` is a backstop only.
- The step wrapper needs no other mobile rule: it is in normal
  flow inside the stacked article, so it steps with the
  content it wraps.

### 4.4 Reduced motion

Inside the existing `prefers-reduced-motion` block:
`.journey-step { transform: none !important; transition: none
!important; }`. This rule is mandatory, not optional: under
reduced motion the branch sets `activeIdx` to 4, so without it
the 2026 wrapper would step. With it, stations are fully
static and the active station is still marked by the existing
active class (and by the filled seal and lit instrument, whose
static states are covered by their own backstop rules).

## 5. Global constraints (all three changes)

- Files touched: `src/sections/Manifesto.tsx` only (plus this
  spec). No new files, no new dependencies, no new scroll or
  resize listeners, no scroll locking, no scroll hijack, no
  drag. Rings scale derives from `progress` in render; step and
  instruments derive from `activeIdx` in render. No new state
  is needed; if the fixer adds any, it must justify it against
  this section and QA must flag it.
- Paint-only properties for all new motion: `opacity`,
  `transform`, `stroke`, `fill`, `stroke-dashoffset`. Never
  `width`, `height`, `margin`, `padding`, `top`/`left`
  animation. (The rings SVG `left`/`top`/`width`/`height` are
  set once per breakpoint, not transitioned; the mobile bead
  `top` precedent does not apply here.)
- No layout shift of animated text: rings are absolute, the
  step is a transform on a wrapper, instruments animate
  opacity/stroke/dashoffset only. The instrument block itself
  is a one-time in-flow addition (section 3 preamble), not a
  shift during animation.
- No new content, no new facts, no new numbers anywhere. The
  only numbers added are geometry, alpha, timing, and path
  values in this spec. Instruments and rings carry no labels
  (`aria-hidden`), no counts, no years beyond the stations
  they belong to.
- No em dashes anywhere in new or edited text. (This package
  adds no user-visible text at all, so this is a doc hygiene
  rule for the spec and for any comment the fixer touches.)
- The existing entrance behavior is untouched: `mvM-armed` /
  `mvM-in` reveal, node pops with existing delays, route draw
  from `progress`, active pulse, drift blob, header slide-in,
  bead, seals, wells, glow. New elements gate on `mvM-in`
  where stated (rings) and otherwise layer on top. The fixer
  may update the file header comment to mention the three new
  layers; comment-only changes are allowed, copy changes are
  not.
- New motion lives in the motion path only. Every new animated
  element has a reduced-motion rule in the existing
  `prefers-reduced-motion` block (rings static middle scale,
  instruments fully drawn static, step none).

## 6. Acceptance checklist (fixer self-check, QA verifies each line)

Rings:

1. One `.journey-rings` SVG, direct child of `.journey-grid`,
   before the wells, `aria-hidden`, `pointer-events: none`,
   `zIndex: -2`, 2400x2400 box, viewBox `0 0 2400 2400`,
   seven circles centered 1200,1200 with radii 300, 400, 500,
   600, 700, 850, 1000, no fill, 1px stroke
   `rgba(255, 255, 255, 0.06)`, `vector-effect:
   non-scaling-stroke`, classes `journey-ring-0` through
   `journey-ring-6` in radius order.
2. Desktop anchor: `left: calc(100% + 120px)`, `top: 50%`,
   `transform: translate(-50%, -50%) scale(s)`. No ring stroke
   alpha above 0.08 anywhere.
3. Scale follows `s = 1 + 0.04 * min(4, floor(progress * 5))`
   from the existing `progress` state, with `transition:
   transform 800ms ease-out`; stepping progress 0, 0.1, 0.25,
   0.35, 0.5, 0.85, 0.95, 1 yields scales 1.00, 1.00, 1.04,
   1.04, 1.08, 1.12, 1.12, 1.16 (verify by the window formula,
   noting progress 0.1 is still window 0 and progress 0.5 is
   window 2).
4. Mobile: same SVG at 1200x1200, `left: 7px`, `top: 50%`,
   same translate/scale transform; rings 0, 1, 2 hidden below
   1100px, rings 3, 4, 5, 6 visible; desktop rings hidden
   above 1100px only if a separate desktop element exists
   (one shared element needs no such rule, but the media
   query must still re-anchor and resize it).
5. Rings opacity 0 until `mvM-in` (armed gate), 1 after.
   Reduced motion: scale fixed 1.08, transition none, rings
   visible and static.

Instruments:

6. One `JourneyInstrument` per station, block after the
   dotCount paragraph inside the step wrapper, `marginTop: 16`,
   left-aligned, `aria-hidden`, 72x72 SVG, viewBox
   `0 0 72 72`, `stroke-width: 1.5` on every shape, round
   caps and joins, `fill: none` except the 2025 accent bubble.
7. All five shape sets match section 3.2 exactly (book spine
   and pages; nib, slit, and three motion lines; globe circle,
   two orbit ellipses, meridian arc; flask outline and three
   bubbles; frame, fold, two hairlines). Verify by path
   string, not by eye.
8. Exactly one blue accent per asset (2022 spine, 2023 slit,
   2024 horizontal orbit ellipse, 2025 middle bubble fill,
   2026 fold), BLUE only when active, white/unlit at rest.
   Rest strokes `rgba(255, 255, 255, 0.7)`; active strokes
   `#FAFAFA` full opacity.
9. Draw animation: `pathLength: 100` on every stroked shape,
   active class only sets `stroke-dasharray: 100` with
   `journey-instrument-draw` 700ms ease-out forwards from
   offset 100 to 0; base style has no dash array, so
   deactivation returns a fully drawn outline (never erased),
   fading via 300ms opacity/stroke/fill transitions.
10. Mobile: same 72px size and in-flow position, no override,
    no hover state. Reduced motion: draw animation none,
    transitions none, fully drawn static outlines, active
    instrument full opacity with accent lit.
11. Instruments step with their station (inside the step
    wrapper) and never sit behind body text (in-flow block
    below the dotCount, never absolute, never negative
    z-index).

Step:

12. One `.journey-step` wrapper per article, class
    `journey-step-top` for above-route stations (2022, 2024,
    2026) and `journey-step-bottom` for below-route stations
    (2023, 2025), wrapping exactly the year row, title,
    detail, dot list, dotCount, and instrument block. Glow,
    mobile node dot, and mobile ring stay OUTSIDE the wrapper
    as direct article children.
13. Active top stations translate `translateY(12px)`, active
    bottom stations `translateY(-12px)`, both over 500ms with
    the overshoot curve, no transition delay (the wrapper has
    no inline delay; the article's delay does not transfer).
    Inactive wrappers have no transform.
14. Mobile override below 1100px: every active wrapper
    translates `translateX(-8px)` regardless of top/bottom.
    Content stays 32px inside the article box (40px padding
    minus 8px step).
15. Fast scroll: no timer, no queue, no animationend chain;
    retargeting is the CSS transition restarting toward the
    new active station. Verify by code inspection that no
    step-related timeout or listener was added.
16. Reduced motion: `.journey-step` transform none and
    transition none with `!important`, so the 2026 wrapper
    does not step even though `activeIdx` is 4.
17. No interference: article reveal transform, year pop, seal
    snap, node pop, pulse, bead, and ring animations are all
    byte-identical in behavior (wrapper transform composes
    with descendant transforms; it does not replace them).
    Verify the reveal CSS block and the article's inline
    styles are untouched except for the wrapper insertion.

Scope, copy, and build:

18. Copy byte-identity: intro, all five station titles, years,
    details, dots arrays, dotCount lines, undated-items
    footnote, header block, and the bead/seal/well/glow code
    paths are unchanged; the diff touches only the rings
    element, the instrument component and block, the step
    wrapper and its CSS, the reduced-motion additions, and
    optionally the file header comment. No em dash anywhere
    in added or edited lines.
19. No new dependency, no new scroll/resize listener, no
    scroll locking, no new listener of any kind; the only
    state read by the new code is the existing `progress`
    and `activeIdx`. No new user-visible text, no new facts,
    no new numbers outside this spec.
20. Production build passes (`npm run build` in
    `portfolionew-work/`), no TypeScript error, no unused
    variable (the repo uses `noUnusedLocals`), and `git
    status` shows only `src/sections/Manifesto.tsx` modified
    besides this spec doc.

## 7. Known risks and accepted trade-offs

- Rings versus the 2026 column: the left arcs of the larger
  rings cross the rightmost content column at 0.06 alpha. This
  is the intended map texture, not a defect, but if preview
  finds it distracting, move the desktop anchor further right
  (raise the 120px offset) instead of raising alpha or dimming
  text.
- Single-SVG rings: per-ring stagger is not separately
  animated (section 2.2). The window-quantized scale plus the
  800ms ease-out is the approved feel; do not split the SVG to
  chase stagger.
- Step and reveal overlap: on first entrance, a station can
  be both revealing (article translateY 18px to 0 over 600ms)
  and stepping (wrapper translate over 500ms) at once. The two
  transforms compose on different elements, so the result is a
  slightly longer combined arrival, not a glitch. This is
  accepted.
- Instruments add height: each article grows by about 88px.
  The grid rows are `auto`, so the section grows uniformly
  and the alternating layout holds. On short viewports this
  makes the section taller; that is the cost of per-station
  artwork, stated here so QA does not file it as a regression.
- Bead versus step divergence: the bead follows scroll
  progress while the step follows `activeIdx`, the same
  accepted divergence already documented for seals and lights
  (previous spec section 7). Each signal keeps its own
  meaning, and both converge at rest.
- Mobile rings are mostly off-canvas left: with the anchor on
  the 7px line, only the right arcs sweep the content. That is
  intentional; a centered mobile anchor would put ring arcs
  behind every paragraph row.
