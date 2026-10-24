# v8 Motion + Accessibility QA - Hero Collage Enrichment

Scope: `src/sections/Hero.tsx` collage layer plus all 8 files in
`src/components/hero-v8/` (SearchWindow, PosterWindow, MicroscopeCard,
DeskCard, DbChips, NotifyBubble, DbStackCard, Stickers). The v8 change
adds 8 mockups to the 9 v7 cards (17 items total), static tilt on
wrappers, and a 4-item mobile stack.

Method: code inspection only. No live browser check was possible from
the sandbox (localhost preview is blocked), so float/parallax/tilt
composition, drag feel, and mobile stack feel still need one live
look on the Netlify preview. `npx tsc --noEmit` is clean (0 errors).

## Verdict: PASS, no blocking gaps

Every check (a) through (h) passes. The gap list below holds
observations only, none blocking, none needing a fix before ship.

## Check results

### (a) Tilt is static and never fights float: PASS

Tilt classes (`.mv-tilt-card-a` through `-e`, `.mv-tilt-window-a`
through `-c`, `.mv-tilt-chip`, `.mv-tilt-sticker-a/b`) are plain
stylesheet rules containing only `transform: rotate(...)` (-5deg to
3deg). No animation is ever attached to a tilt class, and no hero-v8
file contains `animation`, `@keyframes`, `transition`, or `:hover`
at all. The composition is safe by nesting, not by transform merging:
the float keyframes own the outer item wrapper's transform
(`.mv-collage-item.mv-collage-float`, translateY only), the tilt
class sits on a separate inner `<div>` wrapping the card, and the
parallax transform lives one level higher on the collage layer
itself. Three nested elements, three independent transforms, nothing
to fight. Every tilt class used by `COLLAGE_ITEMS` is defined; the
unused ones (card-e, window-c, sticker-a) are dead CSS, see O3.

### (b) Floats, parallax, entrance stay in their lanes: PASS

- Float: `mv-collage-float` keyframes are translateY 0 to -8px only,
  desynced 9-16s per item via inline `animationDuration`/`animationDelay`.
- Parallax: writes `transform` only, on the layer element only
  (`layer.style.transform = translate(...)`), never on items.
- Entrance: `mv-collage-in` is opacity 0 to 1 only, 0.8s at 2.2s delay.
- The only other `transform` in hero-v8 is a static
  `translateY(-1px)` nudging the MicroscopeCard caption dot. No
  animated transforms anywhere in the new components.

### (c) Parallax gating unchanged: PASS

The parallax effect in Hero.tsx is byte-identical in structure to
v7: it returns early unless `(hover: hover) and (pointer: fine)`
matches, returns early under `prefers-reduced-motion: reduce`, uses
a pending-flag rAF throttle (no React state per frame), resets px/py
to 0 on `mouseleave`, and the cleanup removes both listeners and
cancels the rAF. Tilt and the new items do not touch this effect.

### (d) Pointer-dead layer, no interactive elements, no hover reveals: PASS

- `.mv-collage` carries `pointer-events: none`, and every item
  wrapper repeats it inline (`pointerEvents: "none"` in the render).
- Grep over all hero-v8 files: zero `<button>`, `<a>`, `<input>`,
  `<select>`, `<textarea>`, `onClick`, or `pointerEvents` (so no
  child re-enables pointer events under the dead layer).
- Grep over all hero-v8 files: zero `:hover` rules, so there are no
  hover reveals. Cards are divs, spans, figures, and images only.
- Hero drag is unaffected: the frame paints at z-index 1 above the
  collage at z-index 0, and the layer cannot capture pointers.

### (e) Z order and contrast: PASS

- Paint order inside the hero: grid (first, z auto) < collage
  (`z-index: 0`) < word/frame (`zIndex: 1`) < cursor-chip diorama
  (`zIndex: 2`). The word and frame still paint above every card,
  including the new tall poster window and the tilted items.
- Primary text on every new card is strong: ink #010101 on white
  (windows, pills, captions, photo captions), blue #0859D4 on white
  (labels, accents), and on the dark DbStackCard, light grey #E0E0E0
  labels plus white pills with ink text on the #010101 card (both
  very high contrast). The stack card footer in #98989C on black is
  about 7:1, also strong.
- Secondary micro text in #98989C on white (window footers, address
  pill labels, the GUT AXIS sticker, the NotifyBubble subline) sits
  near 2.9:1, below WCAG AA. This is the same site-wide secondary
  mono pattern already accepted in v7, and the whole layer is
  aria-hidden decoration whose facts duplicate real sections. Kept
  as observation O1, not a FAIL.

### (f) Reduced-motion coverage: PASS

- The Hero.tsx reduced-motion block sets `animation: none` on both
  `.mv-collage` (entrance) and `.mv-collage-float` (every float,
  old and new). The parallax effect never starts under
  reduced-motion (JS gate, check (c)).
- Tilt needs no reduced-motion handling: it is a static rotation,
  not motion. Nothing in any hero-v8 file animates on its own, so
  there is no per-component motion escaping the Hero-level blocks.
- The v7 grid pan and cursor drift remain gated the same way they
  were; v8 adds no new motion source outside the collage blocks.

### (g) Mobile stack readable: PASS

Below 719px the layer becomes a static flex column (gap 16px) and
the visible stack is exactly FaersCard, PhotoCard, NotifyBubble,
and DbStackCard, in that DOM order. This works out because the
hide rules compose: hide-mid (max-width 1160px) and hide-1400
(max-width 1400px) also cover the mobile range, so microscope,
dbchips, and stickers hide; hide-720-1400 hides DbStackCard only
between 720px and 1400px, leaving it visible below 720px; notify
has no hide class. In the mobile block, every tilt class is zeroed
(`transform: none`) and `.mv-collage-float` gets `animation: none`,
so the stack is upright and static, matching the header comment.
Widths fit a 320px viewport: FaersCard 240px, PhotoCard 220px,
DbStackCard 220px (chips wrap), and NotifyBubble has no fixed
width (its subline wraps; icon is shrink-proof). Below about
288px the 240px FaersCard may clip against section padding, but
the section keeps `overflow: hidden`, so the clip is contained
with no viewport overflow, the same accepted v7 behavior (O5).

### (h) Banned code grep: PASS, 0 hits

Grep over Hero.tsx plus all hero-v8 files for marquee, scroll-lock,
cursor none, scroll-snap, overscroll, scrollTo, scrollIntoView,
wheel handlers (onWheel, wheel listeners), preventDefault, and
Lenis: 0 matches. The only cursor rules are the pre-existing
system cursors on the draggable frame.

## Per-component results (all PASS)

- SearchWindow: no animation, no hover, no interactive elements;
  skeleton bars only, ink primary text on white.
- PosterWindow: same; root is aria-hidden; abstract blocks only.
- MicroscopeCard: static img sizing style block only; honest
  caption, ink primary text; no animation.
- DeskCard: fixed 220px width, cover image, ink primary text;
  no animation.
- DbChips: white pills, ink text, decorative glyphs only; no
  animation. (Trademark note is out of this QA's scope; the file
  itself states the wordmarks are own typography, not logo art.)
- NotifyBubble: flex row, wraps on narrow widths, ink title on
  white; no animation.
- DbStackCard: dark card, strong contrast on every text element
  including the white pills; no animation.
- Stickers: three white pills, no animation; GUT AXIS pill text is
  the #98989C secondary grey noted in O1.

## Gap list (observations, none blocking)

- O1 (minor, contrast): secondary mono #98989C on white (~2.9:1)
  appears on window footers, the SearchWindow address label, the
  PosterWindow meta lines, the NotifyBubble subline, and the GUT
  AXIS sticker. Primary text everywhere is strong. No fix required;
  matches the v7 accepted pattern. If the parent ever tightens
  micro-text contrast, darken these to #4A4A4A.
- O2 (minor, touch): float loops keep running on touch devices at
  720px and wider (transform-only, pointer-dead, harmless). Parallax
  itself correctly never attaches on touch. Same as v7.
- O3 (minor, dead code): tilt classes card-e, window-c, and
  sticker-a are defined but unused, and window-a and chip are
  rotate(0deg) no-ops. Harmless; leave or prune on a cleanup pass.
- O4 (minor, inert labels): SearchWindow's root `aria-label` is
  inert under the layer's `aria-hidden`, the same v7 pattern.
  Harmless: every card fact duplicates Works, Journey, or an
  archive page.
- O5 (minor, very narrow viewports): below about 288px the 240px
  FaersCard may clip against section padding; contained by the
  section's `overflow: hidden`, no viewport overflow. Same as v7.
- O6 (owed, not a gap): live-browser confirmation of tilt/float/
  parallax composition, drag feel with 17 items, and the 4-item
  mobile stack is still owed, since the sandbox cannot preview
  localhost. All verdicts here are code inspection only.
