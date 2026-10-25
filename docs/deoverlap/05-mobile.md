# Mobile overlap audit: hero de-overlap (report only)

Scope: mobile hero only, viewports below 720px wide. Question: does
the new scattered mobile stack (responsive fix, replacing the old
single logo row) truly have zero asset/logo/card overlap, and does
anything else in the mobile hero collide with it?

Method: code inspection plus px modeling only. No live browser check
was possible (the sandbox blocks localhost preview), so every figure
below is computed from source values, not measured pixels. Files
read in full: `src/sections/Hero.tsx`, `src/components/Header.tsx`,
`src/components/hero-v8/DbLogoFloat.tsx`,
`src/components/hero-collage/FaersCard.tsx`,
`src/components/hero-v8/NotifyBubble.tsx`. A grep for `mv-collage`,
`mv-frame`, and `mv-word` rules outside `Hero.tsx` returned nothing,
and a grep for absolute/fixed positioning, negative margins, and
transforms inside the three stack components returned nothing: all
overlap-relevant rules live in `Hero.tsx`.

## Verdict: PASS. Mobile is fully clean at every audited width.

Box-model overlap between any two mobile hero elements is zero at
320, 360, 375, 390, and 414px. The only two observations are
non-overlaps: a 0px nominal gap between the frame and the first
stack tile (tight, but the protruding corner handles miss the
centered tile by 73px or more), and soft box-shadow tails bleeding
a few px into the 16px stack gaps at low alpha (paint only, never
covering art or text). Both have fix suggestions at the end; neither
is a FAIL.

## 1. What is actually visible below 720px

The mobile stack is the `max-width: 719px` block in `Hero.tsx`
(lines 790 to 843): `.mv-collage` becomes `position: static`, a
flex column, `align-items: center`, `gap: 16px`, `width: 100%`
(lines 809 to 817). Items become `position: static` with
`max-width: 100%` (lines 818 to 821). Float animation is off
(line 823) and all tilt transforms are zeroed (lines 824 to 830).
Desktop floats are hidden by `mv-collage-mobile-hide`, and every
other desktop item is hidden by its own width rule
(`hide-1400`, `hide-1300`, `hide-mid`, `hide-1000`), so exactly
six items survive, in DOM order:

| Order | Item | COLLAGE_ITEMS line | Width | Height |
|---|---|---|---|---|
| 1 | PubMed tile (mobile-only) | 193 | 100px | 50px |
| 2 | FaersCard | 194 | 240px | about 171px |
| 3 | Elsevier tile (mobile-only) | 195 | 104px | 50px |
| 4 | NotifyBubble | 203 | column width, wraps | about 63px at 320, about 50px at 390 |
| 5 | Scopus tile (mobile-only) | 207 | 100px | 50px |
| 6 | Cochrane tile (mobile-only) | 208 | 69px | 82px |

Tile geometry is from `DbLogoFloat.tsx` lines 42 to 64: wordmark
tiles are 100/104/100px wide with 12px padding and 24px art, so
50px tall; Cochrane is 69px wide and 82px tall with 56px art.
The four mobile-only tiles carry `hide-min-720` (hidden at 720px
and above, `Hero.tsx` lines 741 to 745), so no logo appears twice
at any width. FaersCard is a fixed 240px box
(`FaersCard.tsx` line 15) with no absolute children and no
negative margins. NotifyBubble is a block-level flex row with no
fixed width and no `nowrap` anywhere, so on narrow columns its
subtitle wraps instead of overflowing (see check (c)).

Column width is viewport minus 48px (section padding 24px each
side, `Hero.tsx` line 543): 272px at 320, 312px at 360, 327px at
375, 342px at 390, 366px at 414.

## 2. Check (a): stack items vs each other - PASS at all widths

All six items are in normal flow inside a column flex container
with a fixed 16px gap and no negative margins, no absolute
children, and no transforms on mobile:

- Float keyframes (`mv-collage-float`, 0 to -8px) are disabled on
  mobile: `.mv-collage-float { animation: none; }` in the 719px
  block (`Hero.tsx` line 823). The desktop float that moves items
  up 8px cannot break a mobile item out of its slot.
- Tilt classes are zeroed on mobile (`Hero.tsx` lines 824 to 830),
  so no rotation shifts a tile sideways into a neighbor.
- The collage entrance animation is opacity only
  (`mv-collage-in`, lines 649 to 652), and the grid pan animates
  background-position only. Neither moves boxes.
- The diorama layer (cursor chips, fact pills) is `display: none`
  under `@media (hover: none)` (`Hero.tsx` lines 665 to 669), so
  on touch phones there is no drifting chip layer at all.
- Drag cannot shift the frame on mobile: drag starts only when
  `canDrag` is true, which requires hover plus fine pointer
  (`Hero.tsx` lines 395 to 405 and the pointer-down guard), so
  the frame offset stays 0 on touch.

Result: vertical clearance between every adjacent pair of stack
items is exactly the 16px flex gap at every audited width, and
horizontal clearance is the centering slack in the table above
(16px per side for FaersCard at 320px, 84px or more per side for
every logo tile). Box-model overlap: 0px, all widths.

If a logo file fails to load, `DbLogoFloat` returns null
(`DbLogoFloat.tsx` lines 78 to 80), leaving an empty wrapper of
0px height with the 16px gaps preserved. No broken-image box, no
overlap.

## 3. Check (b): word/frame block vs first stack item - PASS at all widths

The section is a column flex container with no `gap` property, so
the collage starts exactly where the frame ends: nominal vertical
gap 0px between the frame border and the PubMed tile. That is
tight but not an overlap, because the only elements that protrude
past the frame box are the six 10px square handles, and the bottom
two sit at the frame corners, far from the centered tile:

- Frame geometry on mobile (`Hero.tsx` lines 801 to 807): width
  `calc(100% - 16px)`, centered, padding 28px 24px. Frame outer
  edges sit at x = 32 and x = viewport minus 32. Frame content
  width is viewport minus 112px.
- Word rule (`Hero.tsx` lines 776 to 780 and line 1030):
  `clamp(64px, 18vw, 72px)` below 903px with `<wbr/>` between
  "daivan" and "labs.". Word sizes: 64px at 320, 64.8px at 360,
  67.5px at 375, 70.2px at 390, 72px at 414. "daivan" at 64px needs
  about 200px against 208px of frame content at 320px (8px slack);
  slack grows at every larger width (248, 263, 278, 302px of
  content against "daivan" widths of about 202, 211, 219, 225px).
- One-line threshold for the full word: the measured advance sum
  is 5.70em (1026.3px at the 180px cap, per the desktop audit),
  so "daivanlabs." at 72px needs about 391px after letter-spacing,
  against content of viewport minus 112px. That puts the one-line
  threshold near 503px, so all phones 320 to 414 show the designed
  two-line lockup ("daivan" / "labs."). Note: this differs from
  the final-QA observation that put the threshold near 450px; the
  difference comes from the advance-sum estimate, and it does not
  change the overlap verdict, since both lockups are in-flow boxes
  with no protruding children. Either way the word never breaks
  mid-word and never escapes the frame.
- Bottom handles (`Hero.tsx` lines 100 to 107): 10px squares at
  `bottom: -5`, so they protrude 5px below the frame edge, at x
  ranges 27 to 37 (left) and viewport minus 37 to viewport minus
  27 (right). PubMed tile x ranges, centered: 110 to 210 at 320,
  130 to 230 at 360, 137.5 to 237.5 at 375, 145 to 245 at 390,
  157 to 257 at 414. The tile misses the left handle by 73px at
  320px and by more at every larger width, and misses the right
  handle by the same amounts. The side-midpoint handles protrude
  5px left/right of the frame (x = 27 to 37 and viewport minus 37
  to viewport minus 27) at mid-height, where the only vertical
  neighbors are empty section padding. No handle touches any
  stack item at any width.
- Label clearance: the "PORTFOLIO - EST. 2025" label carries
  `margin: 0 0 32px`, so 32px separates it from the frame top.

PASS, with one spacing suggestion (see section 7): the 0px
frame-to-first-tile gap is the tightest joint in the mobile hero
even though nothing overlaps there.

## 4. Check (c): logo tiles vs adjacent cards - PASS at all widths

Every logo tile is narrower than the column with wide slack, and
every adjacent card is either fixed-narrow or wrapping:

- At 320px (tightest column, 272px): PubMed 100px (86px slack per
  side), FaersCard 240px (16px per side), Elsevier 104px (84px
  per side), Scopus 100px (86px per side), Cochrane 69px (101.5px
  per side). Slack only grows at 360 to 414px.
- NotifyBubble between Elsevier and Scopus: block-level flex, so
  it takes the column width and its text wraps. At 320px the
  available text width is 272 minus 28px icon minus 10px gap
  minus 28px padding = 206px, against a subtitle line of about
  251px at 10px mono, so the subtitle wraps to two lines and the
  bubble grows to about 63px tall. At 390px the available width
  is 276px, so the subtitle fits on one line (about 50px tall).
  Wrapping, not overflowing: no `nowrap` exists in the component,
  and the item wrapper caps at `max-width: 100%`.
- No tile shares a row with any card on mobile: the column stacks
  one item per row, so there is no horizontal adjacency to
  collide. Vertical separation is the uniform 16px gap.

PASS at 320, 360, 375, 390, and 414px.

## 5. Check (d): open hamburger panel vs hero content - PASS

The header is normal flow (no fixed or sticky positioning on the
`header` element itself, `Header.tsx` lines 168 to 172), and the
panel is a conditionally rendered `nav` inside it (lines 224 to
240). Opening it grows the header taller and pushes the hero
down; it cannot cover hero content:

- Closed header height on mobile is about 109px: logo row
  (20px padding top plus about 23px wordmark line plus 20px
  padding bottom) plus the 44px menu-button row plus borders.
- Open panel adds 6 links at 44px rows (`Header.tsx` lines 113
  to 117) = 264px plus a 1px border, all in flow. Longest link
  "Certifications" is about 110px wide at 15px inside 24px side
  padding, fitting the 272px column at 320px with about 138px
  slack. No panel row overflows horizontally.
- Panel vs fixed CTA: the CTA sits at y = 14 to about 44
  (`Header.tsx` lines 251 to 252), while the panel starts below
  the logo row and button row (y about 109 and below). No
  vertical intersection.
- Panel vs hero on scroll: the panel scrolls with the page
  (normal flow), so it never floats over hero content. The panel
  also vanishes at 721px and above (`Header.tsx` lines 127 to
  128), so a menu left open cannot leak into tablet layout.

PASS, closed and open, at all audited widths.

## 6. Check (e): fixed CTA pill vs wordmark and hero - PASS at all widths

The CTA is `position: fixed`, `top: 14`, `right: max(16px,
calc((100vw - 1160px) / 2))`, z-index 100 (`Header.tsx` lines
249 to 262). Below 400px both the wordmark and the CTA shrink
(`Header.tsx` lines 133 to 136): wordmark 20px to 18px, CTA 14px
to 12px with padding 10px 18px to 8px 12px.

CTA width estimate: "Start a conversation" (21 chars) at 12px
weight 600 is about 131px of text plus 24px padding = about
155px; at 14px it is about 153px plus 36px padding = about
189px. Wordmark right edge at 320px is about 137px (header audit
figure; an independent Inter-bold estimate gives about 129px,
so 137px is the conservative value used here).

| Width | CTA left edge | Wordmark right edge | Gap |
|---|---|---|---|
| 320 | about 149px | about 137px | about 12px |
| 360 | about 189px | about 137px | about 52px |
| 375 | about 204px | about 137px | about 67px |
| 390 | about 219px | about 137px | about 82px |
| 414 | about 209px | about 144px | about 65px |

(At 414px the desktop sizes resume, since the shrink rule ends
at 400px.) The gap is positive at every width, so the pill never
covers the wordmark tail.

CTA vs hero content: at the top of the page the pill floats over
the header's empty right zone (nav and spacer are hidden below
720px, `Header.tsx` lines 86 to 87), not over hero content. The
menu-button row starts at about y = 65, while the pill ends at
about y = 44, giving about 21px of vertical clearance. On scroll
the pill floats over hero content by design (it is fixed on
desktop too), which is overlay-by-design, not a layout collision:
it is a 30px pill at the very top edge, and no hero element is
positioned to sit under it at rest.

PASS at 320, 360, 375, 390, and 414px.

## 7. Observations (not overlaps) and fix suggestions

O1. Shadow bleed into stack gaps (paint only, not a FAIL). Card
shadows extend past the 16px gap at low alpha: FaersCard shadow
`0 8px 24px` reaches about 20px below the card (about 4px of
faint tail into the next tile's top padding zone); NotifyBubble
shadow `0 12px 28px` reaches about 26px below the bubble (about
10px of faint tail into the Scopus tile's top padding and border
zone, where Scopus art starts 13px below the tile top, so the
tail stays off the art); logo-tile shadows `0 8px 20px` reach
about 18px (about 2px of tail). Alphas are 0.08 to 0.14, so this
reads as normal card shadow, not as one asset covering another.
If zero shadow contact is wanted, raise the mobile stack gap
from 16px to 24px in the 719px block (`Hero.tsx` line 814);
that clears every shadow tail with margin to spare. Not
implemented (report only).

O2. Zero frame-to-first-tile gap (tight, not a FAIL). The
collage starts exactly at the frame's bottom edge. Nothing
overlaps there (section 3 proves the handles miss the tile), but
the joint reads as crowded: a dashed border directly touching a
tile top border. Suggested one-line change, not implemented:
add `margin-top: 16px` to `.mv-collage` inside the 719px block
(`Hero.tsx` lines 809 to 817), matching the 16px stack rhythm
and giving the 5px handle protrusion full clearance.

## 8. Per-width, per-check scoreboard

| Width | (a) Stack vs stack | (b) Frame vs first tile | (c) Tiles vs cards | (d) Hamburger panel | (e) Fixed CTA |
|---|---|---|---|---|---|
| 320 | PASS | PASS | PASS | PASS | PASS |
| 360 | PASS | PASS | PASS | PASS | PASS |
| 375 | PASS | PASS | PASS | PASS | PASS |
| 390 | PASS | PASS | PASS | PASS | PASS |
| 414 | PASS | PASS | PASS | PASS | PASS |

## 9. Boundary notes (out of the mobile slice)

- On hover-capable narrow viewports (a desktop browser squeezed
  below 720px), the diorama chips stay visible, since they hide
  only under `@media (hover: none)`. That is desktop-narrow
  behavior, not the touch-mobile slice, and the chips are
  pointer-dead decoration; it is flagged here only so a narrow
  desktop window is not mistaken for a mobile failure.
- The overlaps visible in the user's desktop screenshot (cards
  and cursor chips crossing the giant word) belong to the desktop
  slice, not this report. Nothing in this mobile audit contradicts
  or explains them.

## 10. Live checks still owed (sandbox cannot render pixels)

Re-confirm on a real phone after deploy: the stack order reads
PubMed, Faers, Elsevier, Notify, Scopus, Cochrane with even
16px gaps; the word shows "daivan" / "labs." on two lines at
320 to 414px; the hamburger opens to six 44px rows and pushes
the hero down; and no horizontal scroll exists at 320px.
