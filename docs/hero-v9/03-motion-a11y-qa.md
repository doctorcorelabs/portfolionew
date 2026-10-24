# v9 Motion + Accessibility QA - Real Database Logos

## Verdict: PASS, with minor gaps (none blocking)

Scope: `src/components/hero-v8/LogoTiles.tsx`,
`src/components/hero-v8/DbStackCard.tsx`, and the
`src/sections/Hero.tsx` collage layer. The v9 change swaps the v8
text chips for real logo images inside the dark stack card and
removes the PhotoCard item, so the mobile stack becomes FaersCard,
NotifyBubble, DbStackCard.

Method: code inspection only. No live browser check was possible
from the sandbox (localhost preview is blocked), so live
confirmation of tile rendering, float composition, and the 3-item
mobile stack is still owed via the Netlify preview. Timing note:
the v9 code landed 9 minutes into polling, and `public/logos/`
landed after that; this verdict is on the final tree, where all
four logo files were verified present. Read-only
`npx tsc --noEmit` is clean (0 errors).

## Check results

### (a) Logo images: alt, sizing, shift, overflow - PASS with minor gaps

- Every logo `<img>` has a meaningful alt: "PubMed logo",
  "Elsevier logo", "Scopus logo", "ScienceDirect logo" (brand name
  plus "logo", built from the brand label).
- Explicit sizing is present: `height: 20`, `width: auto`,
  `maxWidth: 190`, `objectFit: "contain"`, so no logo ever
  stretches or crops.
- Real file dimensions verified in `public/logos/` (all PNG):
  PubMed 372x120 (3.10:1), Elsevier 664x202 (3.29:1), Scopus
  1000x321 (3.12:1), ScienceDirect 729x90 (8.10:1). At 20px
  height the rendered tiles are 88px, 92px, 88px, and 188px
  wide (image width plus 24px tile padding plus 2px border)
  against the dark card inner width of 188px (220px card minus
  32px padding). No tile overflows in practice. Tile rows
  inside the card resolve to [PubMed, Elsevier] (88 + 8 + 92 =
  188), [Scopus], [ScienceDirect], all within the card.
- No vertical layout shift is possible from image loading: the
  image height is fixed at 20px, so the tile row height never
  changes. A horizontal reflow of sibling tiles on image load
  remains possible because width is `auto` with no
  width/height attributes or aspect-ratio (see G1, minor).
  The layer is decorative and aria-hidden, and the files are
  local, so this is bounded and low impact.
- ScienceDirect is exactly 188px, zero slack against the card
  inner width (see G2, minor). It fits, but with no margin for
  rounding differences.

### (b) Tiles are static - PASS

- Zero hits for `animation`, `@keyframes`, `transition`, or
  `:hover` across all `src/components/hero-v8/` files.
- `LogoTile` uses `useState` only for the load-error path
  (hide the tile if its file fails), which is not motion and
  not user interaction. No hover effects exist on tiles.
- The float loop still lives only on the outer item wrapper
  (translateY, 9-16s desynced) and tilt only on the inner
  wrapper (static rotate classes), unchanged from v8.

### (c) Pointer-dead, non-interactive - PASS

- `.mv-collage` and `.mv-collage-item` both carry
  `pointer-events: none` (stylesheet plus inline
  `pointerEvents: "none"` on every item wrapper), and the
  collage layer div is `aria-hidden="true"`.
- Zero hits for `<button`, `<a `, `onClick`, or `href=` in
  LogoTiles.tsx and DbStackCard.tsx. The `onError` handler on
  the logo images is load-failure handling, not an interactive
  element, and it cannot be triggered by the user through the
  pointer-dead layer.
- Frame (zIndex 1) still paints above the collage (z-index 0),
  diorama above that (zIndex 2), so hero drag is unaffected.

### (d) Mobile stack readable at 320px - PASS

- The PhotoCard item is gone from COLLAGE_ITEMS (grep count
  0). Items without a mobile-hiding class are exactly three:
  FaersCard (no hide class), NotifyBubble
  (`mv-collage-hide-720-1160`, visible below 720px), and
  DbStackCard (`mv-collage-hide-720-1400`, visible below
  720px). Every other item carries `mv-collage-mobile-hide`
  or a wider hide class that covers below 720px
  (hide-mid, hide-1400). Mobile stack is exactly FaersCard,
  NotifyBubble, DbStackCard, in DOM order.
- Mobile rules are unchanged from v8: static position, 16px
  gap, float off, tilts zeroed (`transform: none`), and
  `.mv-collage-item { max-width: 100%; }` (the v8 F8 fix).
- At 320px viewport the content column is 272px (320 minus
  48px section padding). FaersCard is 240px, NotifyBubble
  unwidthed with a wrapping subline, DbStackCard is 220px,
  and its tiles wrap (flexWrap on both the card row and the
  LogoTiles row). Nothing overflows at 320px.

### (e) Reduced-motion gating unchanged - PASS

- The reduced-motion CSS block still sets `animation: none`
  on `.mv-collage` (entrance) and `.mv-collage-float` (all
  item wrappers, old and new, since all items share the
  class).
- Parallax still gates on hover plus fine pointer and
  returns early under `prefers-reduced-motion: reduce`, with
  rAF throttling, mouseleave reset, and listener cleanup
  (removeEventListener on mousemove and mouseleave).
- Tilts are static transforms and need no motion handling.
  No hero-v8 file animates on its own.

### (f) Word/frame paint above the collage - PASS

- Z order confirmed in code: grid below, collage layer
  z-index 0, word/frame zIndex 1, diorama zIndex 2. The v9
  change adds no new positioned element outside this order,
  and the logo tiles sit inside DbStackCard, which itself
  sits inside the collage layer.

### (g) Banned code - PASS

- Grep over Hero.tsx plus all hero-v8 files: 0 hits for
  marquee, scroll-lock, cursor none, scroll-snap, overscroll,
  scrollTo, scrollIntoView, wheel handlers, preventDefault,
  Lenis.

## Per-item results

| Item | Verdict | Notes |
| --- | --- | --- |
| LogoTiles.tsx | PASS | Meaningful alts, contain fit, explicit height, no motion, no interactivity. Minor gaps G1, G2 below. |
| DbStackCard.tsx | PASS | Now renders four LogoTile images in a wrapping row; width 220, tiles wrap, no motion, no interactivity. |
| Hero.tsx collage layer | PASS | PhotoCard removed, mobile stack exactly 3 items, z order, pointer-dead layer, reduced-motion and parallax gating intact. |
| tsc (whole tree) | PASS | Clean, 0 errors. DbChips.tsx is gone and nothing references it. |

## Gap list (none blocking, no fix required before ship)

- G1 (minor, layout shift on load): logo images use
  `width: auto` with no width/height attributes or
  aspect-ratio, so sibling tiles can reflow horizontally
  when an image arrives. Height is fixed, so there is no
  vertical shift, and the layer is decorative and
  aria-hidden. Fix (optional): add a per-brand
  `aspectRatio` style (3.10, 3.29, 3.12, 8.10) or
  width/height attributes matching the real files.
- G2 (minor, zero slack): the ScienceDirect tile is exactly
  188px wide, equal to the card inner width (162px image
  plus 24px padding plus 2px border). It fits, but with no
  margin for rounding. Fix (optional): cap the image
  maxWidth at 160 (tile 186px) or reduce image height to
  19px.
- O1 (observation, dead export): the default `LogoTiles`
  export (all four tiles in a row) is imported nowhere;
  only the named `LogoTile` is used, by DbStackCard.
  Harmless, same class as the dead tilt classes accepted
  in v8.
- O2 (observation, inert alts): the logo alt texts are
  inert under the layer's `aria-hidden="true"`, the same
  pattern as v7/v8. The alts are still correct for
  code-level accessibility and if the layer is ever
  unhidden.
- O3 (observation, failure mode): if a logo file 404s in
  production, its tile hides itself via onError, so there
  is no broken-image icon; the card simply renders with
  fewer tiles (a one-time bounded collapse, decorative
  layer only). All four files were verified present at
  audit time, so this is a safety net, not a live defect.
  Asset presence itself belongs to accuracy/visual QA,
  not to this motion/a11y verdict.
- O4 (observation): live-browser confirmation is still
  owed (code inspection only), as in every v7/v8 round:
  tile rendering at real pixel sizes, float composition
  with the taller dark card, and the 3-item mobile stack
  feel.

## What was NOT checked here

- Whether the logo artwork is the correct official artwork
  for each brand, and whether its use is licensed or
  permitted: that belongs to accuracy QA, not motion/a11y.
  This report covers only alt text, sizing, motion,
  pointer behavior, mobile fit, reduced-motion, z order,
  and banned code.
- Whether the logo files are the ones the user wanted:
  also accuracy QA's scope. Motion/a11y verified only
  that four PNGs exist at the referenced paths with the
  dimensions above.
