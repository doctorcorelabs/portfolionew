# Active Motion - v6 (Motion Spec Companion)

Status: the v6 active-motion system. This document extends
`docs/motion/04-motion-spec.md` and `docs/motion/07-journey-motion.md`;
it does not replace either. Where this document and spec 04 disagree,
spec 04 wins and this document is corrected on the next pass. The
v6 additions below are flagged as new, not silently folded into the
spec 04 token table: one new duration, one new easing, both scoped
to exactly the devices named here.

Design rule for v6: every section stays visibly alive, the way the
hero already is. Before v6, only the hero had continuous motion;
other sections animated once on entrance and then went still. v6
adds a second layer so no section ever reads as dead on arrival,
while keeping the spec 04 discipline: slow, restrained, and rare.
If a proposed loop is not in this document, it does not ship.

## 1. The two motion layers

### Layer 1: entrance slide (one shot, per section)

When a section enters view, its header group (kicker, heading,
intro line) slides in from one side plus a fade. This is the
section-to-section slide rhythm the user asked for: as the visitor
scrolls down the page, headers arrive from alternating sides, so
moving between sections always has a visible slide, not just a
fade.

- Duration: 700ms. This is a new token, `--duration-slide`,
  700ms, used only for section header slides. It sits between
  `--duration-base` (400ms) and `--duration-slow` (800ms) and
  does not change either of those tokens.
- Easing: `--ease-out`, `cubic-bezier(0.22, 1, 0.36, 1)`, the
  spec 04 default. Entrances never use the loop easing.
- Properties: opacity 0 to 1 plus `translateX` 24px to 0. The
  24px magnitude reuses the spec 04 section rise value, applied
  on the horizontal axis, so no new distance token is needed.
  The sign of the offset comes from the direction map in
  section 2.
- Trigger: one IntersectionObserver per section header,
  threshold 0.15, fires once, then disconnects. Same observer
  discipline as spec 04 section 2. The slide never replays on
  scroll up.
- Body content keeps its existing reveal (800ms rise from
  spec 04, or the v5 device reveals from doc 07). The header
  slide replaces only the header's own plain fade; it does not
  change body timing, stagger caps (80ms, max 3 steps), or
  reduced-motion behavior.
- Reduced motion: header renders fully visible at once, no
  slide, no fade delay.

### Layer 2: continuous active loops (infinite, slow)

After entrance, each section keeps one small continuous motion
running, so the page never goes fully static. All loops share:

- Duration: 8s to 24s per loop. Nothing loops faster than 8s.
  A loop that fast would read as nervous, not alive.
- Easing: `ease-in-out`, alternate direction, for every loop
  except marching dashes (see section 4). This is a new token,
  `--ease-loop`, `ease-in-out`, scoped to continuous loops only.
  It does not change spec 04 section 1: entrances, reveals,
  hovers, and draws still use `--ease-out` only, and `ease-in`
  alone is still banned everywhere. The alternate direction is
  what makes a loop read as breathing rather than spinning:
  every loop returns along its own path instead of jumping back
  to its start.
- Marching dashes are the single linear exception: a marching
  dash must move at constant speed, so it uses `linear`,
  infinite, with no alternate. Any other use of `linear` is
  still banned, exactly as in spec 04.
- Loops are pure CSS animations on decorative layers and
  non-text elements. No loop ever moves body text, changes
  layout, or carries information. If a loop stopped, no content
  would be lost.
- Loops run on all devices, including touch. They are never
  hover-triggered, so there is no hover-only path to lose.
- Reduced motion: every loop stops (`animation: none`) and its
  element renders in its final, fully visible static state.
  Details per device are in section 3.

## 2. Slide direction map (Layer 1)

Headers slide from alternating sides down the page. The alternation
is the rhythm: left, right, left, right, so no two consecutive
section headers arrive from the same side.

| Section | Slide direction | Sign of the 24px offset |
| --- | --- | --- |
| Services | From left | `translateX(-24px)` to 0 |
| Journey (Manifesto) | From right | `translateX(24px)` to 0 |
| Profile | From left | `translateX(-24px)` to 0 |
| Works | From right | `translateX(24px)` to 0 |
| Affiliations | From left | `translateX(-24px)` to 0 |
| Contact | From right | `translateX(24px)` to 0 |

Exempt, with reasons:

- Hero: exempt because it is the top of the page. It plays its
  spec 04 section 5 entrance sequence on mount (grid fade,
  word rise, frame draw, handle pops, label fade). A header
  slide would fight that fixed sequence.
- Quote: exempt because it is pinned. Its word-paint is
  scroll-driven (spec 04 behavior, v4 dot field): words fill
  from pale to ink as scrolling progresses through a runway.
  Sliding the pinned block sideways would fight the pin and
  the paint mapping. Quote gets a Layer 2 loop instead
  (section 3.2), not a Layer 1 slide.

Route changes (page-level navigation) are separate from section
slides and unchanged: the doc 07 route fade plus rise, 300ms,
`--ease-out`, keyed by pathname, instant scroll, no animation
under reduced motion.

## 3. Per-section active devices (Layer 2)

### 3.1 Hero: grid pan

The faint graph grid behind the giant word drifts slowly, so the
hero stays alive after its entrance sequence finishes.

- Duration: 24s, `ease-in-out`, alternate.
- Properties: `transform` only. The grid pattern lives on a
  layer larger than the hero, and the layer translates a few
  pixels each way. The grid itself is never re-rendered or
  resized by the animation.
- Reduced motion: grid layer static at its centered position,
  full opacity, no animation.

### 3.2 Quote: dot breathe

The dot field behind the pinned quote text breathes: the whole
field gently fades between its base opacity and a slightly
stronger opacity, like slow breathing.

- Duration: 8s, `ease-in-out`, alternate.
- Properties: opacity only, on the dot layers as a group. The
  per-dot lit halo under the cursor is unchanged: it still
  appears instantly under the cursor and fades out over 600ms
  on leave. The breathe is a slow global swell underneath that
  interaction, never a replacement for it.
- Reduced motion: dot layers static at full entrance opacity,
  no breathe, cursor halo behavior unchanged.

### 3.3 Services: halftone pan

The halftone dot texture on the blue cards drifts slowly across
the cards, so the flat fill never reads as a static slab.

- Duration: 16s, `ease-in-out`, alternate.
- Properties: `background-position` pan. This is the single
  flagged exception to the transform/opacity-only rule
  (section 4): a halftone texture cannot be panned with
  transform without moving the card itself, so the background
  position moves instead. The pan distance is small (a few
  tile periods at most), so dots never visibly jump.
- Reduced motion: halftone static at its centered position,
  no pan.

### 3.4 Journey: scroll-driven route plus station pulse

Journey keeps its v5 scroll-driven route (doc 07 section 3.1:
path draws with `stroke-dashoffset` as the section enters view,
then stays drawn) and adds a pulse on the station nodes, so the
route stays alive after the draw finishes.

- Route: unchanged from doc 07. Scroll-driven, fires once,
  never undraws, never loops. Its `stroke-dashoffset` is a
  pre-existing exception carried over from doc 07 (a path
  cannot be drawn with opacity or transform); it is not a new
  v6 exception.
- Station pulse: each station node dot scales gently.
  Duration 10s, `ease-in-out`, alternate, with per-station
  offsets so nodes do not pulse in unison (offsets in 80ms
  steps, max 3 steps, reusing the stagger cap).
- Properties: `transform` scale only (dot scales around its
  own center, roughly 1 to 1.15). Station cards and text never
  pulse. Only the dots move.
- Reduced motion: route fully drawn at once, dots at full
  size, no pulse.

### 3.5 Profile: marching ants

The dashed selection frame around the portrait marches: its
dashes crawl slowly around the frame, like the marching ants
of an image editor selection.

- Duration: 12s, `linear`, infinite. This is the marching-dash
  exception to the loop easing rule: constant speed, no
  alternate, no easing curve.
- Properties: `transform` only. The dashed pattern lives on
  an oversized tile layer behind the frame edge, and the layer
  translates by exactly 6 dash periods over each 12s loop.
  Because the travel is an integer number of periods, the
  loop point is seamless: no jump, no reset flash.
- The portrait photo, caption, fact chips, and bio never move
  with the march. Only the dashed frame layer travels.
- Reduced motion: frame static, dashes fully drawn, no march.
- Touch: the march runs on touch too; it is not hover-gated.

### 3.6 Works: traveler dot

A single small blue dot travels down the vertical dashed route
line beside the Works rows, then back up, like a reader moving
down the index.

- Duration: 14s, `ease-in-out`, alternate.
- Properties: `transform` `translateY` only. The dot starts
  parked at the top of the route line, travels to the bottom,
  and returns. It never leaves the line, never overlaps row
  text (the line sits in the numeral gutter), and it is
  `aria-hidden` and `pointer-events: none`.
- Reduced motion: dot parked statically at the top of the
  line, fully visible, no travel.

### 3.7 Affiliations: stamp float

The dashed stamp badges float gently, each on its own timing,
so the row reads as a set of objects resting on the page
rather than a printed list.

- Duration: 11s, 14s, and 17s across badges (assigned by
  badge index, cycling through the three values), `ease-in-out`,
  alternate.
- Properties: `transform` `translateY` only, roughly 0 to
  minus 6px. Badges never rotate, never scale, and never change
  border or color with the float. Hover and focus-within still
  do exactly what doc v5 specifies (border solidifies, text
  darkens); the float is independent of hover.
- Reduced motion: badges static at their resting position,
  no float.

### 3.8 Contact: pill float plus glow pulse

The mailto pill floats gently, and a soft blue halo behind it
pulses, so the call to action stays the warmest moving thing
on the page without ever shouting.

- Pill float: duration 12s, `ease-in-out`, alternate,
  `transform` `translateY` only, roughly 0 to minus 6px.
- Glow pulse: duration 8s, `ease-in-out`, alternate, opacity
  only, on a blurred blue halo layer behind the pill. The glow
  is a separate layer, not an animated box-shadow: box-shadow
  animation is banned by the property rule, so the halo layer
  carries the pulse while the pill itself only floats.
- The decorative cursor chip, watermark, dotted rule, dot
  field, and social links are unchanged. Only the pill and its
  halo move.
- Reduced motion: pill static, halo layer hidden (opacity 0),
  no float, no pulse. The pill itself stays fully visible.

### 3.9 Header: CTA glow pulse

The fixed "Start a conversation" pill carries the same soft
halo pulse as the contact pill, so the call to action stays
recognizable at every scroll position.

- Duration: 10s, `ease-in-out`, alternate, opacity only, on
  a blurred blue halo layer behind the CTA pill. Same
  box-shadow ban applies: halo layer only, never an animated
  box-shadow on the pill itself.
- The CTA label, size, position, and click behavior never
  change with the pulse. The nav dotted-underline hover is
  unchanged.
- Reduced motion: halo layer hidden, CTA fully visible and
  static, no pulse.

### 3.10 Footer: dash travel

The dotted rule above the footer travels: its dashes crawl
slowly from left to right, echoing the profile marching ants
at a calmer pace.

- Duration: 18s, `linear`, infinite. This is the second use of
  the marching-dash exception: constant speed, no alternate.
- Properties: `transform` only, same tile-translate mechanism
  as section 3.5: the dotted tile layer translates by exactly
  6 dash periods per loop, so the loop point is seamless.
- Footer copy, links, and the "Back to top" behavior are
  unchanged. Only the rule's dashes move.
- Reduced motion: rule static, dashes fully drawn, no travel.

## 4. Property rule (applies to every v6 device)

- Transform and opacity only. No device animates width,
  height, top, left, margin, padding, color, border, font,
  box-shadow, or background-size.
- The single flagged exception is `background-position`
  panning, approved for the services halftone pan (section
  3.3) only. No other device uses it.
- Two pre-existing mechanisms are carried over, not newly
  approved here: the journey route draw's `stroke-dashoffset`
  (doc 07 section 3.1, path drawing only) and the section
  header slide's `translateX` (which is a transform, so it
  already complies).
- Marching dashes (sections 3.5 and 3.10) use transform
  tile-translate, not background-position, so they stay inside
  the transform-only rule while keeping constant linear speed.
- Loops never move layout: no element changes size, position
  in flow, or text wrapping at any point in a loop cycle.

## 5. Summary table

| Device | Layer | Duration | Easing | Properties | Reduced-motion fallback |
| --- | --- | --- | --- | --- | --- |
| Section header slide | Entrance | 700ms | `--ease-out` | Opacity plus translateX 24px | Fully visible at once |
| Hero grid pan | Loop | 24s | ease-in-out alternate | Transform translate | Static centered grid |
| Quote dot breathe | Loop | 8s | ease-in-out alternate | Opacity | Static full opacity |
| Services halftone pan | Loop | 16s | ease-in-out alternate | Background-position (flagged exception) | Static centered halftone |
| Journey station pulse | Loop | 10s | ease-in-out alternate | Transform scale | Full size dots |
| Profile marching ants | Loop | 12s | Linear infinite | Transform tile translate | Static dashed frame |
| Works traveler dot | Loop | 14s | ease-in-out alternate | Transform translateY | Parked at line top |
| Affiliations float | Loop | 11s, 14s, 17s | ease-in-out alternate | Transform translateY | Static resting position |
| Contact pill float | Loop | 12s | ease-in-out alternate | Transform translateY | Static pill |
| Contact glow pulse | Loop | 8s | ease-in-out alternate | Opacity of halo layer | Halo hidden, pill visible |
| Header CTA glow pulse | Loop | 10s | ease-in-out alternate | Opacity of halo layer | Halo hidden, CTA visible |
| Footer dash travel | Loop | 18s | Linear infinite | Transform tile translate | Static dotted rule |

## 6. Hard rules

- Every loop stops under `prefers-reduced-motion: reduce`
  (`animation: none`) with its element in its final, fully
  visible static state, per the per-device fallbacks in
  section 3. The spec 04 section 8 block must be copied
  verbatim into every new motion stylesheet or `<style>`
  block, plus the per-device fallbacks above. No loop may
  ever hide content, and no element may be left transparent,
  translated, clipped, or scaled under reduced motion.
- Nothing hover-only, on any device. Loops run on touch and
  on desktop alike, and no content, link, or affordance is
  gated behind hover. Any hover enhancement on a v6 device
  must have a focus-visible mirror and must not change layout.
- No scroll-lock at any point, for any reason. The page stays
  fully scrollable while any entrance or loop runs.
- No custom cursor. The platform cursor is never replaced.
  Decorative cursor chips remain page content and never move
  with the system pointer.
- No marquee in production. The `mv-marquee` keyframe was
  removed in v5 and must not return. Footer dash travel and
  profile marching ants are tile-translate dash crawls on
  decorative rules, not marquees: they move no text, no
  content, and no element across the viewport.
- No smooth-scroll library. Native CSS scrolling only for
  anchors; instant scroll on route change, exactly as in
  spec 04 section 7.
- No scroll hijack. Scroll listeners exist only for
  scroll-driven devices (the journey route progress and the
  reading-progress hairline). Every scroll listener must be
  rAF-throttled and registered with `passive: true`, must
  never call `preventDefault` on scroll or wheel, and must
  never set scroll position. Loops are CSS animations and
  need no scroll listener at all.
- Numbers never count up, bars never grow to a value, and no
  number is ever animated into existence. The traveler dot
  carries no value; the station pulse marks positions, not
  quantities.
- Stagger cap unchanged: 80ms steps, max 3 steps per reveal
  batch, including header slides and station pulse offsets.
  Long sections give each element its own observer fire so
  delays never accumulate down the page.

## 7. Implementation checklist for v6 motion agents

1. Read spec 04, doc 07, and this document before touching
   any file. Use the token values here only; do not invent a
   new duration, easing, distance, or stagger step. The two
   flagged v6 additions (`--duration-slide` 700ms and
   `--ease-loop` `ease-in-out`) are the only new tokens.
2. Put shared keyframes and classes in `src/styles/motion.css`;
   keep component-local motion inline only where that pattern
   already exists, using the same tokens.
3. Add the spec 04 section 8 block to every new motion
   stylesheet or `<style>` block, plus the per-device
   reduced-motion fallback from section 3.
4. Wire each loop to its decorative layer only, never to body
   text or layout. Verify each loop is invisible to assistive
   technology where it is purely decorative (`aria-hidden`).
5. Verify: build passes; no scroll-lock, custom cursor,
   Lenis, marquee, or smooth-scroll library code in the
   production bundle; with `prefers-reduced-motion` emulated,
   every section renders fully visible with zero animation;
   on a touch-width viewport, every loop still runs and no
   content depends on hover; no scroll listener calls
   `preventDefault` or sets scroll position.

## Sources

- `docs/motion/04-motion-spec.md`: the authoritative token
  table, reveal pattern, line-draw pattern, hover patterns,
  hero entrance sequence, route-change fade, reduced-motion
  block, and bans that this document extends.
- `docs/motion/07-journey-motion.md`: the v5 device specs,
  including the journey route draw and its
  `stroke-dashoffset` mechanism, carried over unchanged.
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

## Koreksi as-built v6 (integrasi, 24 Okt 2026)

Dokumen ini ditulis paralel dengan builder v6, sehingga beberapa nilai
di atas berbeda dengan yang benar-benar dibangun. Yang berlaku adalah
nilai as-built di bawah ini; jangan rework kode untuk mengejar tabel
di atas.

- Slide antar section: 48px dari kiri/kanan, 32px dari bawah, 700ms
  ease-out (bukan 24px). Class `from-bottom` terdefinisi tapi tidak
  terpakai; keenam section berslide memakai from-left/from-right
  selang-seling sesuai peta.
- Pengecualian aturan transform/opacity (semua kecil, dekoratif,
  paint-only, dan mati di reduced-motion): background-position x3
  (grid Hero 24s, halftone Services 24s linear, dash Footer 10s
  linear); box-shadow x3 (pulse stasiun Journey 2s di stasiun aktif
  saja, glow pill Contact 5s, glow CTA Header 5s - glow dibangun
  sebagai animasi box-shadow langsung, bukan halo layer opacity);
  `top` x1 (traveler dot Works 14s, satu dot absolut 10px di gutter,
  tidak menggeser layout konten); stroke-dashoffset x1 (marching ants
  Profile 12s linear, keluarga yang sama dengan path draw doc 07).
- Durasi as-built lainnya: breathe Quote 8s, float Affiliations
  9s/11s/13s di -3px, pill Contact 10s/13s/16s di plus/minus 6px,
  bob chip Contact 6s di plus/minus 4px.
- Perilaku smooth-scroll v5 yang tersisa di App.tsx (landing #contact
  dan aturan `html smooth` di blok no-preference) DITERIMA apa adanya:
  itu CSS native, bukan library, dan pengguna reduced-motion tidak
  pernah mendapat smooth scrolling.
- Hero dan Quote dikecualikan dari sistem slide karena alasan
  struktural (hero di puncak halaman, quote adalah section pin);
  keduanya tetap punya motion aktif (grid pan, dot breathe).
