# Journey Motion - v5 Devices (Motion Spec Companion)

Status: motion tokens and specs for the new v5 journey devices only.
This document extends `docs/motion/04-motion-spec.md`; it does not
replace it. Where this document and spec 04 disagree, spec 04 wins
and this document is corrected on the next pass. No new duration,
easing, distance, or stagger token is introduced here: every device
below maps to a spec 04 token. If a device seems to need a value
outside the token table, the device is redesigned to fit a token,
not the other way around.

## 1. Tokens reused (no new tokens)

Duration tokens, from spec 04 section 1:

| Token | Value | v5 use |
| --- | --- | --- |
| `--duration-fast` | 300ms | Corner ticks, route fade+rise |
| `--duration-base` (`--duration-hover`) | 400ms | Contact cursor chip entrance |
| `--duration-slow` (`--duration-fade`) | 800ms | Route-path draw, station card fade, giant numerals |
| `--duration-pop` | 350ms | Station node dot pop (duration only, see section 3), stamp entrance (duration only, see section 5) |

Easing tokens, from spec 04 section 1:

| Token | Value | v5 use |
| --- | --- | --- |
| `--ease-out` | `cubic-bezier(0.22, 1, 0.36, 1)` | Default for every v5 device |
| `--ease-pop` | `cubic-bezier(0.34, 1.56, 0.64, 1)` | ONLY the 10px station node dot, nothing else in this document |

Distance and stagger tokens, from spec 04 section 1:

| Token | Value | v5 use |
| --- | --- | --- |
| Rise, section | 24px | Giant numerals, route fade+rise |
| Rise, dense row | 14px | Station card fade, contact cursor chip entrance |
| Reveal stagger step | 80ms | All v5 staggers, max 3 steps per reveal batch |
| Observer threshold | 0.15, fires once | All scroll-triggered v5 devices except the progress hairline and the route transition |

## 2. Property rule (applies to every device below)

Each v5 device animates opacity and transform only, with exactly one
exception: the route-path draw also animates `stroke-dashoffset`,
because a path cannot be drawn with opacity or transform. No v5
device animates width, height, top, left, margin, padding, color, or
background-size. The reading-progress hairline grows with
`transform: scaleX`, never with width, for the same reason.

## 3. Device specs

### 3.1 Route-path draw

The journey spine: one continuous SVG path per route.

- Duration: 800ms (`--duration-slow`).
- Easing: `--ease-out`.
- Properties: `stroke-dashoffset` from the full path length to 0.
  The path keeps full opacity throughout; only the dash offset
  moves. No fade is layered on top of the draw.
- Trigger: one IntersectionObserver per path, threshold 0.15,
  fires once, then disconnects. The path stays drawn. It never
  undraws on scroll up and never loops.
- Stagger: none for a single path. If a route has multiple branch
  paths entering together, 80ms steps, max 3 steps.
- Reduced motion: the path renders fully drawn at once
  (`stroke-dashoffset: 0`), with no animation.

### 3.2 Station pop

A station has two parts with two different motions, and the split
is deliberate: the node dot is a small physical object, the card
is text-bearing content.

- Node dot (10px, physical object):
  - Duration: 350ms (`--duration-pop`).
  - Easing: `--ease-pop`. This is the only v5 device allowed to
    use overshoot easing, because the dot is 10px, matching the
    spec 04 limit exactly.
  - Properties: opacity 0 to 1 plus `scale` 0.4 to 1.
- Station card and text:
  - Duration: 800ms (`--duration-slow`).
  - Easing: `--ease-out`, never overshoot. Text never uses
    `--ease-pop`, at any size.
  - Properties: opacity 0 to 1 plus `translateY(14px)` to 0
    (dense-row rise token).
- Sequence within one station: dot at 0ms, card at 80ms (one
  stagger step).
- Stagger across stations: stations that enter view in the same
  observer fire stagger in 80ms steps, max 3 steps (0ms, 80ms,
  160ms). A long journey must give each station its own observer
  fire as it enters view, so delays never accumulate down the
  page: stations in a later fire start at 0ms again.
- Reduced motion: dot at full size, card fully visible, no
  animation on either part.

### 3.3 Giant outlined numerals

Large section numerals rendered as outlined text (transparent
fill, visible stroke). They are text, so the overshoot ban for
text applies in full.

- Duration: 800ms (`--duration-slow`).
- Easing: `--ease-out`, never `--ease-pop`.
- Properties: opacity 0 to 1 plus `translateY(24px)` to 0
  (section rise token). The outline stroke itself is never
  animated: no stroke draw, no stroke-width change, no fill
  transition. Only the numeral as a whole fades and rises.
- Trigger: one IntersectionObserver per numeral, threshold 0.15,
  fires once, then disconnects.
- Stagger: one numeral per section, so normally none. If several
  numerals enter together, 80ms steps, max 3 steps.
- Reduced motion: numeral fully visible at once, no transform.

### 3.4 Stamp pop

A stamp is a small badge or seal element marking a completed
stage. The name says "pop" but the easing does not follow the
name: a stamp is larger than 10px, so it fails the spec 04 test
for overshoot easing, and it must not use it.

- Duration: 350ms (`--duration-pop` duration token only).
- Easing: `--ease-out`, not `--ease-pop`.
- Properties: opacity 0 to 1 plus `scale` 0.92 to 1. A static
  tilt may be part of the stamp final state, but the tilt itself
  is never animated: it is present from the first frame, and
  only opacity and scale move.
- Trigger: one IntersectionObserver per stamp, threshold 0.15,
  fires once, then disconnects. A stamp never replays.
- Stagger: one stamp per section, so normally none. If several
  stamps enter together, 80ms steps, max 3 steps.
- Reduced motion: stamp at full size and full opacity at once.

### 3.5 Card corner ticks

Small crop-style ticks at the four corners of a journey card.
Each tick is a short line segment, so it is drawn with transform,
not with a border or width animation.

- Duration: 300ms (`--duration-fast`).
- Easing: `--ease-out`.
- Properties: opacity 0 to 1 plus `scale` 0 to 1, with
  `transform-origin` at the tick corner, so each tick grows out
  of its own corner. No tick changes layout on any state.
- Stagger: all four ticks on one card animate together, with no
  stagger inside a card. Across cards entering together, 80ms
  steps, max 3 steps.
- Reduced motion: all ticks fully visible at once.

### 3.6 Contact cursor chip entrance

The single decorative cursor chip in the contact section. This
spec covers its entrance only; after entrance the chip is
static. No loop is specified for the contact chip in this
document.

- Duration: 400ms (`--duration-base`).
- Easing: `--ease-out`, never `--ease-pop`. The chip exceeds
  10px once its label pill is included, so it fails the spec 04
  test for overshoot easing.
- Properties: opacity 0 to 1 plus `translateY(14px)` to 0
  (dense-row rise token).
- Trigger: one IntersectionObserver, threshold 0.15, fires once,
  then disconnects.
- Stagger: one chip, so none. If a later design adds more chips
  entering together, 80ms steps, max 3 steps.
- Reduced motion: chip fully visible at once, no transform.
- Note: this chip is a decorative element, not a cursor
  replacement. The system cursor is never replaced; see
  section 6.

### 3.7 Reading-progress hairline

A thin progress line that tracks how far the visitor has moved
through the journey. It is scroll-driven, not time-driven, so it
has no duration and no easing token.

- Duration: none. Progress maps directly to `transform: scaleX`
  from 0 to 1, with `transform-origin: left`.
- Easing: none. No CSS transition is applied to the fill: the
  fill must track scroll position directly, in the same way the
  spec 04 quote paint tracks scroll progress, so scrolling up
  reverses it exactly. Any smoothing is a frame-budget choice in
  code, never a CSS easing token.
- Properties: `transform: scaleX` only, plus opacity of the
  static track. Width is never animated.
- Trigger: scroll position, not an observer. The fill updates
  while scrolling and holds its position when scrolling stops.
  It never loops and never auto-plays.
- Stagger: none.
- Reduced motion: the progress fill is hidden entirely and only
  the static track hairline renders, so no motion is conveyed.
  The fill must not render as a static full line, which would
  misrepresent progress.

### 3.8 Route fade+rise

The route-change transition from spec 04 section 7, extended
with a rise. The duration stays authoritative; only the rise is
added.

- Duration: 300ms (`--duration-fast`). This value is
  authoritative and is not lengthened to accommodate the rise.
- Easing: `--ease-out`.
- Properties: opacity 0 to 1 plus `translateY(24px)` to 0
  (section rise token), keyed by pathname so it replays on
  every navigation. Header and Footer sit outside the faded
  region and stay stable, exactly as in spec 04 section 7.
- Scroll on route change stays instant, never animated.
- Stagger: none.
- Reduced motion: no animation, content visible immediately,
  scroll instant.

## 4. Summary table

| Device | Duration | Easing | Stagger | Reduced-motion fallback |
| --- | --- | --- | --- | --- |
| Route-path draw | 800ms | `--ease-out` | None, or 80ms max 3 steps for branches | Fully drawn at once |
| Station node dot | 350ms | `--ease-pop` (only device allowed) | 80ms, max 3 steps per batch | Full size at once |
| Station card | 800ms | `--ease-out` | 80ms after its dot | Fully visible at once |
| Giant outlined numerals | 800ms | `--ease-out` | None, or 80ms max 3 steps | Fully visible at once |
| Stamp | 350ms | `--ease-out` | None, or 80ms max 3 steps | Full size at once |
| Card corner ticks | 300ms | `--ease-out` | Together per card, 80ms max 3 steps across cards | Fully visible at once |
| Contact cursor chip | 400ms | `--ease-out` | None, or 80ms max 3 steps | Fully visible at once |
| Reading-progress hairline | None (scroll-driven) | None | None | Fill hidden, track only |
| Route fade+rise | 300ms | `--ease-out` | None | No animation, instant scroll |

## 5. Rules that apply to all eight devices

- Fire once, never loop, never replay on scroll up. The two
  exceptions are the scroll-driven devices, which track position
  in both directions by definition: the progress hairline
  (section 3.7) and the existing quote paint from spec 04.
- Stagger is capped at 3 steps of 80ms per reveal batch. Long
  journeys use one observer fire per station or per card, so
  the cap is never worked around with cumulative delays.
- Hidden states are applied only when JavaScript and
  IntersectionObserver are both available. With no JavaScript,
  no observer, or `prefers-reduced-motion: reduce`, every device
  renders in its final state immediately. No device may ever
  hide content permanently.
- Numerals never count up, bars never grow to a value, and no
  number is ever animated into existence. Journey numerals
  appear whole, by fade and rise only.
- Hover never moves layout on these devices: no element changes
  size, position in flow, or text wrapping on hover.
- Every device must include the mandatory reduced-motion block
  from spec 04 section 8, copied verbatim, plus its own
  per-device fallback from section 3 above and the observer-skip
  logic from spec 04 section 2.

## 6. Standing bans (unchanged from spec 04)

These are hard bans, not preferences, and they apply to every v5
device without exception:

- No scroll-lock at any point, for any reason. The page stays
  fully scrollable while any device animates.
- No custom cursor. The platform cursor is never replaced, and
  no custom cursor asset, element, or stylesheet may be added.
  Decorative cursor chips (hero chips, the contact chip) are
  page content, not cursor replacements, and they never move
  with the system pointer.
- No marquee in production. The `mv-marquee` keyframe stays dead
  code until a real use is approved.
- No smooth-scroll library. Native CSS scrolling only for
  anchors; instant scroll on route change.
- No overshoot easing outside spec 04 section 1 and section 3.2
  of this document. In particular: no overshoot on text, on
  stamps, on chips, on ticks, on cards, on paths, or on the
  route transition.

## 7. Implementation checklist for v5 motion agents

1. Read the token table in section 1 and use those values only.
   Do not invent a new duration, easing, distance, or stagger.
2. Put shared keyframes and classes in `src/styles/motion.css`;
   keep component-local motion inline only where that pattern
   already exists, using the same tokens.
3. Add the spec 04 section 8 block to every new motion
   stylesheet or `<style>` block, and the observer-skip logic
   to every new reveal.
4. Verify: build passes; no scroll-lock, custom cursor, Lenis,
   or marquee code in the production bundle; with
   `prefers-reduced-motion` emulated, every journey device
   renders in its final state with zero animation; the progress
   hairline shows track only; no numeral counts up; no path
   undraws on scroll up.

## Sources

- `docs/motion/04-motion-spec.md`: the authoritative token
  table, reveal pattern, line-draw pattern, hover patterns,
  route-change fade, reduced-motion block, and bans that this
  document extends.
- `src/styles/tokens.css`: `--duration-fast` 300ms,
  `--duration-base` 400ms, `--duration-slow` 800ms,
  `--ease-out` `cubic-bezier(0.22, 1, 0.36, 1)`.
- `src/styles/motion.css`: shared reveal classes, draw-line
  keyframe, and reduced-motion block.
- `src/hooks/useReveal.ts`: threshold 0.15, fires once,
  visible immediately without IntersectionObserver.
- No user fact, number, or claim is stated in this spec beyond
  the motion values above. Research content values are out of
  scope for this document.
