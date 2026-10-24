# v10 motion + accessibility QA: free-floating database logos

Scope: `src/components/hero-v8/DbLogoFloat.tsx`,
`src/components/hero-v8/DbLogoRow.tsx`, and the collage layer in
`src/sections/Hero.tsx`. The v10 change removes the dark database
card (DbStackCard.tsx and LogoTiles.tsx are deleted) and scatters
four logo tiles freely: Hero wrapper float + tilt own the motion,
the tiles themselves must not move on their own, plus a
mobile-stack logo row.

Method: code inspection only. No live browser check was possible
from the sandbox, so live confirmation of float composition and
the mobile stack is still owed via the Netlify preview.

## Verdict: PASS, no blocking gaps

No site edits made, no build run (read-only `npx tsc --noEmit` is
clean, 0 errors, on the final tree after Hero integration landed).

## Check results

### (a) Logo images: PASS

Every `<img>` in both new files has a meaningful alt built from the
brand label plus "logo": "PubMed logo", "Elsevier logo", "Scopus
logo", "ScienceDirect logo". Sizing is explicit everywhere, with
`objectFit: contain`, so nothing stretches, crops, or overflows:

- DbLogoFloat wordmarks: art 24px tall, width auto, capped at
  74px (PubMed, Scopus) and 78px (Elsevier). The caps exactly equal
  the fixed tile content-box widths (100/104px tiles minus 24px
  padding minus 2px border), so the art cannot overflow its tile.
- DbLogoFloat SD icon: art 28px tall in a 52px square tile.
  See observation O1.
- DbLogoRow tiles: art 17px tall, width auto, capped at 60px,
  contain fit, row wraps (never overflows).

All four logo files exist in `public/logos/` (pubmed, elsevier,
scopus, sciencedirect-icon).

### (b) Tiles carry no motion of their own: PASS

Grep for `animation`, `@keyframes`, `transition`, `:hover`,
`transform`, `rotate` across both new files returns exactly one
hit, and it is a comment ("Small white tiles, no tilt, no
animation"). There is no animation, transition, hover effect, or
self-tilt in code. Motion lives only where it belongs: the Hero
wrapper's `mv-collage-float` class (translateY keyframes) and the
static `mv-tilt-*` classes on the inner wrapper. The `useState` in
both files is only the load-error path (tile hides itself on
`onError`), not motion. The module-level brand wrappers in Hero
(`DbPubmedFloat` etc.) exist so tiles never remount on re-render.

### (c) Pointer-dead, non-interactive: PASS

`.mv-collage` and `.mv-collage-item` both carry
`pointer-events: none`, and the render also sets
`pointerEvents: "none"` inline on every item. The new files have
0 hits for `<button`, `<a `, `onClick`, `href=`. The image
`onError` handler is load-failure handling, not user interaction.
The layer is `aria-hidden="true"`, so the inert alt texts match
the v7/v8/v9 pattern.

### (d) Mobile stack and no double render: PASS

Hide rules verified in code, both directions:

- Float items hidden on mobile: all four float items
  (`db-pubmed`, `db-elsevier`, `db-scopus`, `db-sciencedirect`)
  carry `mv-collage-mobile-hide`, which is `display: none`
  inside the `max-width: 719px` block.
- Row item hidden on desktop: `db-row` carries
  `mv-collage-hide-min-720`, defined as `display: none` inside
  `@media (min-width: 720px)`.
- Boundary is clean: at 719px the row shows and the floats hide;
  at 720px the row hides and the floats show. No viewport width
  renders both.
- Visible mobile-stack items below 719px are exactly three:
  FaersCard (hide class empty), NotifyBubble
  (`mv-collage-hide-720-1160`, inactive below 720px), and
  DbLogoRow. Every other collage item carries
  `mv-collage-mobile-hide`.
- Floats off below 720px: the mobile block sets
  `.mv-collage-float { animation: none; }`. Tilts zeroed: all
  `mv-tilt-*` classes map to `transform: none` in the same block.
  `db-row` has an empty tilt class, so it never tilts.
- Row width math at a 320px viewport: the mobile column is
  272px; the four row tiles total about 258.5px (art widths
  about 52.7 + 55.9 + 53.0 + 17px, plus 14px padding/border per
  tile, plus 3 x 8px gaps), fitting on one row with about 13.5px
  slack. The row still wraps on narrower columns, so it never
  overflows.
- Note: `db-scopus` and `db-sciencedirect` additionally carry
  `mv-collage-hide-1400`, so on desktop widths 720-1400px only
  the PubMed and Elsevier floats show. This is a visibility
  range, not a double render: the row is hidden at all of those
  widths.

### (e) Reduced-motion gating unchanged: PASS

- The CSS block still kills the collage entrance
  (`.mv-collage { animation: none; }`) and all floats
  (`.mv-collage-float { animation: none; }`) under
  `prefers-reduced-motion: reduce`.
- The parallax effect early-returns unless the device reports
  hover plus fine pointer, and early-returns again under
  `prefers-reduced-motion: reduce`; it uses rAF throttling, a
  mouseleave reset, and listener cleanup on unmount.
- All tilts are static transforms, not animations.

### (f) Word/frame paint above the collage: PASS

`.mv-collage` has `z-index: 0`; the word and frame elements
carry `zIndex: 1`; the diorama layer carries `zIndex: 2`. The
z-order is unchanged from v9, and no new positioned element
sits outside it.

### (g) Banned code: PASS

0 real hits across Hero.tsx plus all hero-v8 files for marquee,
scroll-lock, cursor none, scroll-snap, overscroll, scrollTo,
scrollIntoView, wheel handlers, preventDefault, or Lenis. The
only `cursor` usage is the pre-existing frame-only `move` /
`grabbing` cursor for drag (not `cursor: none`). The parallax
`mousemove` listener is not a banned pattern: it is not a wheel
handler, it does not hijack scroll, and it is gated as in (e).

### Supporting checks

- `npx tsc --noEmit`: clean, 0 errors, on the final tree.
- Em dash grep: 0 in Hero.tsx, DbLogoFloat.tsx, DbLogoRow.tsx.
- Dangling references: 0 for DbStackCard, LogoTiles, hero-lab
  in `src/` (DbStackCard.tsx and LogoTiles.tsx are deleted;
  the only `DbLogoTile` hits are the row component's own
  internal definition and usage).
- DbLogoFloat and DbLogoRow are both imported by Hero.tsx and
  rendered as collage items; the brand wrapper components are
  module-level, not inline in the render loop.

## Gap list

None blocking. Observations only, no fix required before ship:

- O1 (geometry note): the SD icon art is 28px tall inside a
  52px tile with 12px padding, so the art extends 1px into the
  padding on each side (content box is 26px). It stays 11px
  clear of the border, so there is no visible overflow; this is
  the same 1px-into-padding pattern the v9 tiles already used.
- O2 (rounding note): the wordmark width caps (74/78px) shave
  at most about 1.1% off the natural width at 24px tall
  (Elsevier 78.9px natural). `object-fit: contain` letterboxes
  instead of distorting, so the effect is invisible.
- O3 (dead motion note): `db-row` still carries the
  `mv-collage-float` class and a 12s float duration, but it is
  `display: none` at 720px and up, and floats are killed below
  719px, so it never actually floats. Harmless.
- O4 (live check owed): float composition, the 719/720px
  boundary, and the mobile stack still need one look in a real
  browser, as in every prior round.
