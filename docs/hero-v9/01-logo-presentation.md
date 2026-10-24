# v9 Real Logo Presentation Rules

## Purpose

The user asked for the REAL PubMed, Elsevier, Scopus, and ScienceDirect
logos in the hero, presented as designed elements, not as plain pasted
images and not as the v8 text wordmarks. This doc defines how the real
logos are framed so they look intentional and collage-like while
staying honest. It covers presentation only. Sourcing the logo files
(formats, licensing check, file placement in public/) belongs to a
separate task; nothing here authorizes inventing, redrawing, or
tracing a logo.

## What stays unchanged

The dark card itself does not change: ink #010101 background, 220px
wide, padding 14px 16px 16px, radius 12px, lifted shadow
0 8px 24px rgba(1, 1, 1, 0.35), mono label "WHERE THE EVIDENCE IS
SEARCHED" in #E0E0E0, footer "Search tools for systematic reviews"
in #E0E0E0, and the 24px by 3px blue #0859D4 accent bar. The framing
is unchanged: workflow search tools, never indexing, affiliation,
partnership, or endorsement. The database set comes from the user's
own 24 Oct request, not from CV.md. The card keeps its Hero.tsx item
position (right 22%, bottom 5%, tilt card-d, hidden in the 720px to
1400px range, visible on desktop above 1400px and in the mobile
stack below 720px).

## The tile system (the core idea)

Every logo sits inside its own white paper tile. The white tile is
what makes real logos work on a dark card: it gives each logo a clean
stage, hides any white box baked into a logo file, and creates the
light/dark rhythm the v8 collage was missing. A bare logo image
pasted straight onto the ink card is forbidden (see Forbidden below).

Tile recipe:

- Background: paper #FFF, no exceptions.
- Padding: 10px vertical, 12px horizontal. Minimum padding 8px if a
  tile ever has to shrink; never less.
- Radius: 8px, smaller than the card radius so tiles read as inset
  elements, not as competing cards.
- Border: 1px solid #E0E0E0. The border defines the tile edge against
  both the dark card and neighboring tiles.
- Shadow: two levels, assigned per tile (see Variety below). Soft:
  0 2px 6px rgba(0, 0, 0, 0.35). Lifted: 0 6px 16px rgba(0, 0, 0, 0.45).
  Shadows are darker than the v8 card shadows because they sit on
  ink, not on paper. No shadow is animated, and no tile lifts on
  hover.

## 2x2 arrangement inside the 220px card

The four tiles form a 2x2 grid, reading order top left to bottom
right: PubMed, Elsevier, Scopus, ScienceDirect. Geometry is fixed so
the grid never breaks:

- Card inner width: 220px minus 32px horizontal padding = 188px.
- Grid gap: 8px, matching the v8 chip gap.
- Tile width: (188px minus 8px) divided by 2 = 90px per tile.
- Tile heights alternate slightly by position for variety (see
  Variety below), but the logo art height inside every tile is the
  same (see Aspect ratios below).

The grid is a plain wrapping flex or grid layout with gap 8px. If a
fifth logo is ever added, it does not join this grid; the grid is
exactly four tiles, and any addition needs a new layout decision.

## Variety without chaos (tilt and size)

Plain pasted logos look flat because every tile is identical. Two
controlled variations fix that, and both are static, never animated:

- Static tilts, one per tile, within -3deg to +3deg. Assigned
  tilts: PubMed -2deg, Elsevier +1deg, Scopus -1deg, ScienceDirect
  +2deg. Adjacent tiles never share a tilt sign, so the row reads
  as scattered, not slanted. Tilts apply to the tile element
  itself, never to the logo image inside it, and never to a wrapper
  that also carries a float animation (the card floats via its Hero
  wrapper; tile tilts are independent static transforms).
- Size variation comes from tile height only: PubMed and
  ScienceDirect tiles are 44px tall, Elsevier and Scopus tiles are
  40px tall. Widths stay 90px so the grid stays aligned. Shadow
  levels also alternate: PubMed and Scopus use the lifted shadow,
  Elsevier and ScienceDirect use the soft shadow. No tile is both
  the tallest and the most lifted; the variations are spread out.

Reduced motion: tilts are static transforms, so they need no
reduced-motion handling, exactly like the v8 tilt classes. No tile
ever floats, bounces, or lifts on its own.

## Aspect ratios (different logos, one visual weight)

The four logos have different natural aspect ratios: some are wide
wordmarks, some are compact marks. The rules below keep them
looking like equals without distorting any of them:

- Logo art height is fixed at 20px in every tile. Width is auto.
  Nothing sets both width and height on the image element.
- Fit is contain, never cover. No logo is ever cropped to fill a
  tile.
- Max width for the art is the tile inner width: 90px minus 24px
  horizontal padding = 66px. A logo wider than that at 20px tall
  scales down proportionally until it fits; it never overflows
  the tile and never shrinks below 18px tall to do so. If a logo
  cannot fit at 18px tall within 66px wide, that logo file is the
  wrong asset (wrong version or wrong orientation) and must be
  replaced, not squeezed.
- The art is centered both horizontally and vertically in its
  tile. Wide wordmarks and compact marks therefore share the same
  optical center line.
- Preferred file: the brand's published SVG where one exists, else
  a transparent-background PNG at 2x display size (about 132px
  wide). A logo file with a baked-in white box is acceptable only
  because the tile is white; the box edge disappears into the
  tile. A logo file with a baked-in colored background is not
  acceptable: source a transparent or white-background version
  instead.
- Reversed (white art) logo versions are never used on these white
  tiles. Always use the standard color version, since the tile
  provides the light background the color version needs.

## Mobile behavior

DbStackCard is a mobile stack member (visible below 720px in the
Hero mobile stack: static column, centered, gap 16px, item
max-width 100%, floats off, wrapper tilts zeroed by the existing
mobile media query). Tile rules on mobile:

- The 2x2 grid is kept. At a 320px viewport the stack column is
  272px wide (320px minus 48px section padding), and the 220px card
  fits with room to spare, so the grid does not need to change.
- Tile tilts go to 0deg below 720px, matching the Hero mobile rule
  that zeroes wrapper tilts. Implement this the same way: tile tilt
  classes get a max-width 719px override to rotate(0deg), or tile
  tilts reuse the existing mv-tilt classes that the mobile block
  already zeroes. Do not leave tilted tiles in a centered stack;
  they read as misaligned, not playful, at that size.
- Logo art height stays 20px on mobile. Never shrink logos to
  save space; the card is already narrow, and legibility is the
  point of showing real logos.
- Below about 260px viewport width (rarer than 320px, but possible
  on very small devices), the grid is allowed to fall back to a
  single column via wrapping, since the card itself is capped by
  max-width 100%. This is a safety valve, not a layout: the 2x2
  grid is the design at every realistic width.

## Alt text and accessibility

Logos are informative, not decorative: they identify the tools by
name. Alt text is therefore the brand name plus the word "logo":

- "PubMed logo"
- "Elsevier logo"
- "Scopus logo"
- "ScienceDirect logo"

Do not use empty alt text, do not use generic alt like "logo" or
"database", and do not stuff keywords into alt text. The Hero
collage layer is aria-hidden today, so these alt texts matter most
if a tile is ever reused outside the collage; write them correctly
regardless. The tile div itself carries no interactive semantics:
no link, no button, no hover action. If a future task wants these
tiles to link out, that is a separate decision with its own
framing review, not something to add silently here.

## Forbidden

- Brand-color tile backgrounds. No orange tile for Scopus, no blue
  tile for PubMed, no green or red tile for anyone. Tiles are
  always white #FFF. Brand colors appear only inside the logo art
  itself.
- Stretching, squashing, or cropping any logo. Contain fit only,
  fixed height with auto width, no exceptions.
- Recoloring, filtering, or fading logos: no grayscale, no
  hue-rotate, no opacity below 1, no drop-shadow filter on the
  logo image itself (tile box-shadow is the only shadow).
- Drawing extra decoration on top of logo art: no badges, no
  checkmarks, no seals, no ribbons, no added text overlapping a
  logo.
- Endorsement or indexing wording anywhere near the tiles: no
  "indexed in", "affiliated", "partner", "featured in", "as seen
  in", "approved by", or any equivalent. The only permitted
  framing is the card's existing label and footer (search tools
  for systematic reviews).
- Bare unframed logo images: every logo sits in a white tile.
  Never place a logo directly on the ink card background.
- Logos competing with the hero word: tiles stay inside the 220px
  card, logo art stays at 20px tall, and the card keeps its
  collage position. The logos are supporting tools, not the
  headline.
- Adding a fifth logo, a tagline, or a caption to the grid without
  a new layout decision. The grid is exactly four tiles.

## Builder checklist

1. Replace the DbChip row inside DbStackCard with the 2x2 tile
   grid. Keep the card width, padding, radius, shadow, label,
   footer, and accent bar exactly as they are.
2. Each tile: white background, 8px radius, 1px #E0E0E0 border,
   assigned shadow level, assigned static tilt, 90px wide,
   44px or 40px tall per the Variety section.
3. Each image: fixed height 20px, width auto, max-width 66px,
   object-fit contain, centered, correct alt text from the list
   above.
4. Mobile: tile tilts zero below 720px, 2x2 grid kept, art stays
   20px tall.
5. Verify: no stretched or cropped logo, no brand-color tile, no
   endorsement wording, no bare logo outside a tile, em dash grep
   0 in every touched file.
