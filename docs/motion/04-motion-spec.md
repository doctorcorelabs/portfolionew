# Motion Spec - DaivanLabs Portfolio v2 (Onlines System)

Status: the single motion system implementation agents must follow.
Where an existing file disagrees with this spec, this spec wins and the
file is aligned on the next pass. Sources are listed at the end.

Design rule from the reference: motion is slow, restrained, and rare.
Onlines uses 0.4s to 1s transitions, simple fades, and no decorative
animation chains. Every animation below exists to help reading, never
to decorate. If a proposed animation is not in this spec, it does not
ship.

Tokens: ink #010101, dark #111, paper #FFF, #FAFAFA, #F5F5F7,
hairline #E0E0E0, blue #0859D4 for small accents only, Inter for
display and body, JetBrains Mono for labels and metadata.

## 1. Token table

Duration scale (CSS custom properties live in `src/styles/tokens.css`):

| Token | Value | Used for |
| --- | --- | --- |
| `--duration-fast` | 300ms | Hover states, underline draw, row shift, route-change fade, header shadow |
| `--duration-base` (`--duration-hover`) | 400ms | Link color transitions, header shadow, reference-line and label fades |
| `--duration-slow` (`--duration-fade`) | 800ms | Section reveals, hairline and rule draw-ins, CI whisker draw |
| `--duration-pop` | 350ms | Handle pops, forest-plot point pops |
| `--duration-hero-grid` | 1400ms | Hero graph-grid fade only, nothing else |

Easing tokens:

| Token | Value | Used for |
| --- | --- | --- |
| `--ease-out` | `cubic-bezier(0.22, 1, 0.36, 1)` | Default for every entrance, reveal, draw, hover, and fade |
| `--ease-pop` | `cubic-bezier(0.34, 1.56, 0.64, 1)` | ONLY the 10px selection-box handle pop and forest-plot point pops |
| `linear` | `linear` | Reserved for a marquee, which v2 production does not use |

No other easing is allowed. In particular: no ease-in, no bounce, and
no spring physics anywhere except the single `--ease-pop` exception
above, which is confined to elements 10px or smaller.

Distance and stagger tokens:

| Token | Value | Used for |
| --- | --- | --- |
| Rise, section | 24px | Section reveals and the hero word |
| Rise, dense row | 14px | Works rows and other dense index rows |
| Row shift | 4px | Works title shift on row hover |
| Image scale | 1.03 | Image hover only, inside an overflow-hidden frame |
| Reveal stagger step | 80ms | `.mv-reveal-delay-1/2/3` = 80ms / 160ms / 240ms, never more than 3 steps |
| Handle stagger step | 70ms | Hero selection-box handles, starting at 950ms |
| Header shadow trigger | 24px | Page scroll distance before the header shadow appears |

## 2. Reveal pattern (scroll reveals)

Class system (already in `src/styles/motion.css`):

- Hidden state: `opacity: 0` plus `translateY(24px)` for sections,
  `translateY(14px)` for dense rows.
- Visible state (`.is-visible`): `opacity: 1`, `transform: none`.
- Transition: opacity and transform, `800ms` with `--ease-out`.
- Trigger: one IntersectionObserver per reveal root, threshold `0.15`,
  fires once, then disconnects. Do not re-trigger on scroll up.
- Fallback rule (mandatory): the hidden state must only be applied
  when JavaScript and IntersectionObserver are both available. With
  no JavaScript, no observer, or `prefers-reduced-motion: reduce`,
  content renders fully visible immediately. A reveal must never be
  able to hide content permanently.
- Stagger: at most 3 delay steps of 80ms inside one section. Stagger
  applies to sibling rows or cards, never to body paragraphs.
- Trigger mechanism: use the existing `src/hooks/useReveal.ts`
  hook (threshold 0.15, fires once, disconnects, and returns visible
  immediately when IntersectionObserver is unavailable). Do not write
  a second reveal trigger.
- Contact giant heading (the one heading that does not use the plain
  reveal): word-by-word line mask. Each word sits in an
  `overflow: hidden` line; the inner word starts at
  `translateY(115%)` and moves to 0 over 900ms with `--ease-out`,
  staggered 90ms per word (0ms, 90ms, 180ms). Body text then fades
  over 700ms with a 350ms delay and a 12px rise. The email action
  fades over 700ms with a 500ms delay and carries the section 4
  underline draw (400ms). Social links fade over 600ms with an 8px
  rise, staggered from 650ms in 100ms steps.

## 3. Line-draw pattern (hairlines, dashed rules, frames)

Two techniques, chosen by element type:

- Hairlines and dashed rules: `transform: scaleX(0)` to `scaleX(1)`,
  `transform-origin: left`, `800ms` with `--ease-out`. This is the
  `mv-draw-line` keyframe in `src/styles/motion.css`.
- The hero dashed selection box: `clip-path: inset(0 100% 0 0)` to
  `inset(0 0 0 0)` over `800ms` with `--ease-out`, starting at 500ms,
  with a 300ms opacity fade on the same start. A dashed border cannot
  be drawn with stroke-dashoffset, so clip-path is the mechanism.
  Do not animate the border itself.

## 4. Hover patterns

- Link underline draw: the underline grows left to right via
  `background-size` transition, `300ms` with `--ease-out`, in blue
  #0859D4. Color-only link transitions use `400ms` with `--ease-out`.
- Row hover (Works index): the row title shifts `translateX(4px)`
  over `300ms` with `--ease-out`. The row itself does not lift, does
  not change background, and does not scale.
- Image hover: `scale(1.03)` over `400ms` with `--ease-out`, inside
  an `overflow: hidden` frame, only where a real image exists.
  v2 production currently has no content images, so this pattern is
  reserved for future images, not applied to text or wordmarks.
- Header shadow: once the page is scrolled past 24px, the header
  wrapper gains a hairline shadow (`0 1px 0 rgba(1,1,1,0.06)` plus a
  soft `0 8px 24px rgba(1,1,1,0.06)` drop). Transition `300ms`.
  The shadow adds no height or padding.
- Hover never moves layout: no element changes size, position in
  flow, or text wrapping on hover.

## 5. Hero entrance sequence

One fixed sequence, fired once when the hero enters view (it is at
the top, so this fires on mount in practice). Values are taken from
the implemented `src/sections/Hero.tsx`:

| Step | Element | Start | Duration | Motion |
| --- | --- | --- | --- | --- |
| 1 | Faint graph grid | 0ms | 1400ms | Opacity fade only |
| 2 | Giant word `daivanlabs.` | 150ms | 900ms | Opacity fade plus rise 24px, `--ease-out` |
| 3 | Dashed selection box | 500ms | 800ms | Clip-path draw left to right, `--ease-out`, plus 300ms opacity fade |
| 4 | 6 square handles (10px) | 950ms, then 70ms per handle | 350ms each | Pop with `--ease-pop` (the only overshoot easing in the system) |
| 5 | Mono label | 1350ms | 700ms | Opacity fade only |

Total sequence: about 2 seconds, then the hero is completely static.
The word may wrap on narrow screens. No CTA, no subline, no image
inside the hero. Under `prefers-reduced-motion` the whole sequence is
skipped and every element renders in its final state at once.

## 6. Forest-plot draw-in

The forest plot on the FAERS detail page is currently static. When
it is animated, it follows this order only (motion values only; the
plot data itself is governed by the FAERS verification gate, and no
value is ever animated into existence that the gate has not passed):

| Step | Element | Duration | Motion |
| --- | --- | --- | --- |
| 1 | Axes and faint grid | 400ms | Opacity fade |
| 2 | Reference line (ROR = 1, blue #0859D4) | 400ms | Opacity fade |
| 3 | CI whiskers, one row at a time | 800ms each | `scaleX` draw from the row center, `--ease-out`, 80ms stagger per row |
| 4 | Point markers | 350ms each | Pop with `--ease-pop`, 80ms stagger per row, after that row's whisker |
| 5 | Row labels and notes | 400ms | Opacity fade |

The plot never animates numbers counting up, never draws a bar
growing to a value, and never loops. If the gate passes zero rows,
the honest "Forest plot pending" panel shows with no animation.

## 7. Route-change fade and scrolling

- Each route change replays one fade: `opacity: 0` to `1` over
  `300ms` with `ease-out`, keyed by pathname so it replays on every
  navigation. Header and Footer sit outside the faded region and
  stay stable. This 300ms value is authoritative; the 500ms
  `.mv-page` animation in `src/styles/motion.css` is a pre-spec
  leftover and must be aligned to 300ms on the next pass.
- Scroll on route change is instant (`scrollTo(0, 0)` with
  `scroll-behavior: auto` for that jump), never animated.
- In-page anchor scrolling (`/#contact`) is smooth native CSS
  scrolling only. No smooth-scroll library is used.
- Under `prefers-reduced-motion`, anchor scrolling is instant
  (`behavior: auto`).

## 8. Mandatory prefers-reduced-motion block

Every implementation must include this block, and it must cover
both the shared classes and any component-local motion. Copy it
verbatim into new motion code; do not weaken it:

```css
@media (prefers-reduced-motion: reduce) {
  .mv-reveal,
  .mv-reveal.is-visible {
    opacity: 1;
    transform: none;
    transition: none;
    animation: none;
  }

  .mv-page {
    animation: none;
  }

  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

Plus, in code: skip IntersectionObserver setup and show content
immediately; set anchor scrolling to `auto`; keep `scroll-behavior`
off for the document. Net effect: all motion off, all content fully
visible, no element left transparent, translated, clipped, or
scaled, and no animation ever loops or replays.

## 9. Explicitly EXCLUDED

These two Onlines behaviors are NOT adopted, as an accessibility
decision. They must not appear in any implementation, token, or
variant, and must not be reintroduced as a "closer to the reference"
polish item:

- Scroll-lock: Onlines locks page scrolling while the hero intro
  plays (`is-hero-scroll-lock`, `overflow: hidden`). v2 never locks
  scrolling, at any point, for any reason. The hero sequence plays
  while the page remains fully scrollable.
- Custom cursor: Onlines replaces the cursor with a custom SVG on
  hover devices. v2 always uses the standard platform cursor. No
  custom cursor asset, element, or stylesheet may be added.

Both exclusions are pending user confirmation as a final design
decision. Until the user confirms otherwise, they are hard bans, not
preferences. Also excluded by the same reasoning: any smooth-scroll
library (native CSS scrolling only) and any marquee in production
(the `mv-marquee` keyframe is dead code until a real use is approved).

## 10. Implementation checklist for motion agents

1. Read the token table in section 1 and use those values only. Do
   not invent a new duration, easing, distance, or stagger step.
2. Put shared keyframes and classes in `src/styles/motion.css`;
   keep component-local motion (hero, contact) inline in the
   component only where it already exists, using the same tokens.
3. Add the section 8 block to every new motion stylesheet or
   `<style>` block, and the observer-skip logic to every new reveal.
4. Align known pre-spec leftovers: `.mv-page` 500ms to 300ms
   (section 7); Works title and underline transitions and Contact
   fade transitions from plain `ease` to `--ease-out` (section 4).
5. Wire the reveal to every section and archive page. The gap audit
   (docs/motion/03) found motion only in three islands (Hero, Works,
   Contact) while the shared foundation in `motion.css` and
   `useReveal.ts` sits almost entirely unwired. Quote, Services,
   Manifesto, Profile, Affiliations, and the archive pages get the
   section 2 reveal; no section stays fully static on scroll.
5. Verify: build passes; no `scroll-lock`, custom cursor, Lenis, or
   marquee code in the production bundle; with
   `prefers-reduced-motion` emulated, every page renders fully
   visible with zero animation.

## Sources

- `~/workspace/daivanlabs-rebuild/research/03-onlines-layout.md`:
  hero selection box with 1000ms opacity transition, grid fade-in,
  scroll-lock class, custom SVG cursor on hover devices, 0.4s hover
  transitions, motion used sparingly at 0.4s to 1s, and the
  accessibility rejection of scroll-lock, custom cursor, and nowrap
  giant type.
- `src/styles/tokens.css`: `--duration-hover` 400ms,
  `--duration-fade` 800ms, `--ease-out`
  `cubic-bezier(0.22, 1, 0.36, 1)`, Onlines palette.
- `src/styles/motion.css`: `mv-fade-up` (24px), `mv-fade-in`,
  `mv-draw-line` (scaleX), `mv-grid-fade`, `mv-pop`,
  `mv-reveal` with 80ms delay steps, and its reduced-motion block.
- `src/sections/Hero.tsx`: the implemented entrance sequence
  (grid 1400ms, word 900ms from 150ms with 24px rise, frame clip-path
  800ms from 500ms, handles 350ms from 950ms in 70ms steps with the
  pop easing, label 700ms from 1350ms) and its reduced-motion rules.
- `src/App.tsx`: 300ms route fade keyed by pathname, instant scroll
  on route change, smooth native anchor scrolling, 24px header
  shadow trigger, reduced-motion handling.
- `src/sections/Works.tsx`: row title shift 4px, underline draw,
  dense-row rise 14px, reduced-motion rules.
- `src/sections/Contact.tsx`: line-mask giant heading (900ms, 90ms
  word stagger), body fade 700ms delayed 350ms, action fade 700ms
  delayed 500ms with 400ms underline draw, social fades 600ms from
  650ms.
- `src/hooks/useReveal.ts`: threshold 0.15, fires once, visible
  immediately without IntersectionObserver.
- `docs/motion/03-v2-gap-audit.md`: motion exists only in Hero,
  Works, and Contact; the shared foundation is unwired elsewhere.
- No user fact, number, or claim is stated in this spec beyond the
  motion values above. Research content values (FAERS numbers,
  awards, publications) are out of scope for this document.
