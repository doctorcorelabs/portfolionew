# v8 Visual System - Hero Collage, Non-Flat

## 1. Why v7 looks flat, and what changes

The v7 collage reads flat because every element shares the same recipe:
white card, 1px light border, one soft shadow, zero rotation, and a
narrow size band (mostly 220-230px wide). v8 breaks that sameness with
four independent axes, applied together: tilt, shadow depth, size, and
light/dark contrast. No axis alone carries the effect; a tilted card
with the same shadow as its neighbor still reads flat, and a dark card
next to another dark card still reads monotonous.

This doc is written so the Hero integrator can apply it from this doc
alone. Every value below is exact. Where this doc conflicts with an
earlier collage doc on a visual value, this doc wins for v8.

## 2. Tokens (only these)

Colors: ink #010101, paper #FFF, blue #0859D4, greys #E0E0E0, #98989C,
#F0F0F0, #F5F5F7. Dark-card borders use rgba(255, 255, 255, 0.16), which
is paper at low alpha, not a new color. No other accent color is
introduced in v8. The existing AwardsCard medal dots keep their current
treatment and are not a token for new elements.

Fonts: Inter Display for titles, figures, and card headlines. JetBrains
Mono for labels, microcopy, tab labels, and chip text. Mono labels are
10px, uppercase, letter-spacing 0.12em, unless a component below says
otherwise.

## 3. Shadow scale (exact values)

Shadow lives in each card's own root style, not on a wrapper. The
integrator edits each component's boxShadow string to the value in
section 7. A wrapper shadow would double up behind the card's own
shadow, so wrappers never carry box-shadow.

- soft: `0 2px 8px rgba(1, 1, 1, 0.06)` - background elements, chips,
  small labels.
- medium: `0 8px 24px rgba(1, 1, 1, 0.10)` - standard cards. Note: v7
  cards used 0.08 alpha; v8 normalizes medium to 0.10.
- lifted: `0 16px 40px rgba(1, 1, 1, 0.16)` - focal elements only:
  poster, key data card, browser windows, dark cards, photos.

Rule: at most 2 lifted elements per band (top band, bottom band).
A band with three lifted items loses its focal point and reads noisy,
not rich.

## 4. Rotation classes (exact values)

Rotation lives on an inner tilt wrapper in Hero.tsx, never on the float
wrapper and never as an inline style. Two reasons, both structural:

1. The float wrapper's transform is owned by the mv-collage-float
   keyframes (translateY only). A rotate on that same element would be
   overwritten every frame of the float loop.
2. The mobile stack must zero rotation, and only a stylesheet class can
   be overridden by a media query. An inline rotate cannot.

Structure per item (parallax on the layer, float on the outer wrapper,
tilt on the inner wrapper, card inside):

```
<div class="mv-collage-item mv-collage-float [hideClass]" style="position + float timing">
  <div class="mv-tilt-card-a">
    <item.Card />
  </div>
</div>
```

Classes, all in the Hero stylesheet next to the existing collage CSS.
transform-origin is center (the default) for every tilt class.

Cards (range -4 to 3 degrees; the table in section 7 uses these five):

- .mv-tilt-card-a: `transform: rotate(-3deg)`
- .mv-tilt-card-b: `transform: rotate(2deg)`
- .mv-tilt-card-c: `transform: rotate(-1deg)`
- .mv-tilt-card-d: `transform: rotate(1deg)`
- .mv-tilt-card-e: `transform: rotate(3deg)`

Browser windows (range 0 to 2 degrees; windows stay nearly straight so
their chrome reads as a screen, not a sticker):

- .mv-tilt-window-a: `transform: rotate(0deg)`
- .mv-tilt-window-b: `transform: rotate(1deg)`
- .mv-tilt-window-c: `transform: rotate(2deg)`

Chips (always straight; a rotated pill reads as a mistake, not energy):

- .mv-tilt-chip: `transform: rotate(0deg)`

Stickers (range -6 to 6 degrees; stickers are the loudest tilt in the
system and the only elements allowed past 3 degrees):

- .mv-tilt-sticker-a: `transform: rotate(-5deg)`
- .mv-tilt-sticker-b: `transform: rotate(4deg)`
- A single accent sticker per band may use -6deg or 6deg instead.

Rotated bounding boxes grow. A 230px card at -3deg extends roughly
12px past its unrotated corners on each side. Clearance math in
section 6 therefore adds a 16px margin per side around every rotated
item. Keep at least 8px between a rotated corner and the stage edge;
if a corner would clip more than that under the layer's overflow
hidden, reduce that item's tilt one step.

## 5. Element types

### 5.1 Cards (existing 9)

White cards, radius 10-12px, border 1px solid #E0E0E0, width 200-240px,
tilt from the card classes, shadow from section 7. No card changes
shape in v8; only its tilt class and its boxShadow string change.

### 5.2 Browser windows (new)

The reference hero's most recognizable device: a floating app window,
not another flat card. Anatomy, top to bottom:

- Outer: paper background, radius 12px, border 1px solid #E0E0E0,
  shadow lifted, width 300-340px, tilt from the window classes.
- Chrome bar: height 30px, background #F5F5F7, bottom border 1px
  solid #E0E0E0, containing 3 dots (10px circles, #98989C, 6px gaps)
  on the left and one mono tab label (10px, uppercase, ink) on the
  right. The tab label is a section name only (for example RESEARCH,
  POSTER, AWARDS). Never a URL, never a domain, never a fake address
  bar.
- Body: paper background, content as designed by the content agents.

Windows hide below 1160px (hide-mid). A 300px window cannot survive
mid widths without crowding the band, and the card set already covers
those widths.

### 5.3 Chips (new, including database and publisher names)

Chips are the small connective tissue: pills that sit between cards
and windows. Spec: pill radius 999px, paper background, border 1px
solid #E0E0E0, padding 6px 12px, mono 10px uppercase ink text, shadow
soft, tilt 0 always. An optional 6px blue square dot may lead the
text. Height lands at 28-32px.

Database and publisher chips (PubMed, Elsevier, Scopus, ScienceDirect)
follow a hard honesty rule: the chip shows the name only, in mono
text, with no logo artwork, no brand color, and no claim verb. Never
add copy such as "indexed in", "published in", or "featured in"
unless that claim is verified in the sources, and never trace or
recolor a trademarked logo mark. A name-only typographic chip makes
no claim; a claim sentence would. The content agents own the wording
decision; this doc owns only the treatment.

### 5.4 Stickers (new)

Stickers are loud labels, not cards. Spec: paper background, border
1.5px solid #010101, radius 10px, padding 8px 12px, mono 11-12px bold
ink text, shadow medium, tilt from the sticker classes. Width is
content-driven, roughly 90-150px. Sticker text uses only already
recorded vocabulary (for example FAERS, SEOUL 2026, N = 6,601). No
new claim, no new number, no invented label.

Stickers are the overlap exception in section 6: a sticker may sit
partly on top of a card edge. Nothing else may.

### 5.5 Dark cards (new)

One dark card per band at most, never two dark cards adjacent. Spec:
background #010101, text #FFF, border 1px solid
rgba(255, 255, 255, 0.16), radius 12px, shadow lifted, tilt -2 to 2
degrees (use mv-tilt-card-b, mv-tilt-card-c, or mv-tilt-card-d).

Text rules on ink, because the v7 palette was tuned for light cards:

- Title and figure: #FFF, Inter Display.
- Label and microcopy: #E0E0E0, JetBrains Mono. Do not use #98989C
  for small text on ink; #E0E0E0 is the safer secondary on dark.
- Blue #0859D4 on ink appears only as solid shapes (dot, bar, or a
  pill background with white text on it). Never blue small text on
  ink; the contrast is too low for 10-11px mono.
- No gold, no extra accent color. Blue shapes and white text carry
  the whole dark card.

A dark card is a focal point, so it always takes lifted shadow and
paints above any light card it overlaps (DOM order, section 6).

### 5.6 Photos (existing PhotoCard, plus any new photo)

Photo treatment: 6px paper frame around the image, 1px solid #E0E0E0
outer edge, caption bar below (the existing PhotoCard pattern),
tilt -2 to 2 degrees, shadow lifted. Photos are focal, so they keep
lifted shadow even when the band already has one lifted card, but
then the band takes no browser window: a band holds at most 2 lifted
items including its photo.

## 6. Composition rules

Bands: top band and bottom band only, as in v7. No item box may enter
the vertical middle third of the hero stage on desktop, and no item
box may cover the word center point at any viewport where it is
visible. The word and frame paint above the collage (z 1 vs collage
z 0), so a tuck under the frame edge stays legible, but the middle
third rule is what keeps the composition from collapsing into the
word. Rotated boxes count with their 16px per side margin from
section 4.

Overlap: card and window edges may touch, and may overlap up to 24px
at a corner or edge, but no card or window may cover more than one
third of another card's face. Stickers are exempt from the 24px cap
only where they sit on a card edge, and a sticker never covers a
figure, a title, or the word band. The v7 pill clearance guidance
(aim 40px from fact pills and cursor chips, never below 16px after
the rotation margin) still applies.

DOM order is paint order inside the collage layer (all items share
z 0, so later DOM paints above earlier DOM). Order each band's items
so the layering reads intentionally: cards first, windows above
cards, dark cards above light cards they overlap, stickers last and
therefore topmost. Never rely on z-index inside the collage layer;
reorder DOM instead.

Anti-monotony rhythm (check per band, not per item):

- No two adjacent items in a band share both tilt sign and shadow
  level. Same sign with a different shadow is fine; same shadow with
  a different sign is fine; both the same reads as a repeated stamp.
- Each band mixes sizes: at least one small element (chip or sticker)
  and one wide element (window, or a 240px card) wherever the band
  has room. A band of identical 220px cards is the v7 flatness
  returning, and the integrator must break it with a chip, a sticker,
  or a window.
- Tilt signs alternate across the band. Two same-sign tilts in a row
  are allowed only if their shadow levels differ (see above).
- At most 1 dark card per band, at most 2 lifted items per band.

## 7. Assignment table for the 9 existing items

Apply tilt class on the inner wrapper and boxShadow string on the
card root. Helix is decorative SVG with no card surface, so it takes
neither.

| Item | Tilt class | Shadow |
| --- | --- | --- |
| DockingCard (top left) | mv-tilt-card-a (-3deg) | medium |
| DnaHelix (top) | none (0deg) | none |
| ReviewCard (top right) | mv-tilt-card-b (2deg) | soft |
| PosterCard (top right) | mv-tilt-card-c (-1deg) | lifted |
| FaersCard (bottom left) | mv-tilt-card-b (2deg) | lifted |
| GutAxisCard (bottom) | mv-tilt-card-a (-3deg) | soft |
| PhotoCard (bottom center) | mv-tilt-card-d (1deg) | medium |
| AwardsCard (bottom right) | mv-tilt-card-c (-1deg) | soft |
| StrokeCard (bottom right) | mv-tilt-card-b (2deg) | medium |

New v8 elements take their tilt and shadow from section 5, not from
this table: windows use window classes plus lifted, chips use
mv-tilt-chip plus soft, stickers use sticker classes plus medium,
dark cards use a card class in -2 to 2 degrees plus lifted.

## 8. Responsive rules

Existing hide classes stay exactly as built: hide-mid below 1160px,
hide-1400 below 1400px, hide-1000 below 1000px, hide-short at
viewport height 700px and below, mobile-hide below 720px. New rules:

- Browser windows and stickers take hide-mid (hidden below 1160px)
  unless the sticker is selected for the mobile stack.
- Logo chips take hide-mid as well, unless selected for the mobile
  stack. Chips are small, but a band of chips at mid widths crowds
  the cards they are meant to separate.
- Mobile stack (below 720px): rotation 0, static, at most 4 items.
  Implement rotation 0 as a media query rule, not by removing
  classes:

```
@media (max-width: 719px) {
  .mv-tilt-card-a, .mv-tilt-card-b, .mv-tilt-card-c,
  .mv-tilt-card-d, .mv-tilt-card-e, .mv-tilt-window-a,
  .mv-tilt-window-b, .mv-tilt-window-c, .mv-tilt-chip,
  .mv-tilt-sticker-a, .mv-tilt-sticker-b {
    transform: none;
  }
}
```

  This rule sits inside the existing mobile block, next to the
  existing float-off rule. The stack keeps its 16px gap and its
  static flow. Default stack order, first to last: FaersCard,
  PhotoCard, PosterCard, StrokeCard. The integrator may swap the
  third and fourth picks for a chip or sticker if the v8 content set
  makes that read better, but the stack never exceeds 4 items and
  FaersCard plus PhotoCard always lead it.
- Shadows stay as assigned on the mobile stack. Shadows are static
  and do not need a mobile override.
- Short stages: the existing hide-short rule still hides the helix
  at viewport height 700px and below. Rotated cards tuck slightly
  further under the frame edge on short stages; that tuck is
  accepted (frame paints above), but no rotated item may cross the
  word center point, short stage or not.

## 9. Reduced-motion and touch

Rotations are static transforms, not animation, so they stay under
prefers-reduced-motion and on touch devices. Do not add any tilt
class to the existing reduced-motion block (which sets animation
none on the collage layer and float wrappers). Float and parallax
keep their existing gating exactly: float is off under
prefers-reduced-motion and on the mobile stack; parallax attaches
only on hover-capable fine-pointer devices and never under
prefers-reduced-motion, with the existing rAF throttle and
mouseleave reset. No new motion is introduced by this doc, so no new
reduced-motion rule is needed.

## 10. Integrator checklist

1. Add the tilt classes from section 4 to the Hero stylesheet, next
   to the existing collage CSS.
2. Add the inner tilt wrapper div per item in the COLLAGE_ITEMS map
   (section 4). Do not touch the float wrapper's classes, the layer,
   the parallax code, the drag code, or the cursor chips.
3. Apply the section 7 boxShadow strings to the 9 card roots, and
   the section 5 treatments to every new element.
4. Add the mobile rotation-zero rule from section 8 inside the
   existing mobile block.
5. Assign hide classes to new elements per section 8 (windows,
   stickers, and chips default to hide-mid).
6. Check each band against section 6: middle third clear, word
   center clear, overlap caps respected, no adjacent pair sharing
   both tilt sign and shadow level, at most 2 lifted and at most 1
   dark card per band, DOM order cards, windows, dark cards,
   stickers.
7. Verify: `npx tsc --noEmit` clean; grep src for em dash 0; grep
   the new CSS for animation on any tilt class 0 (tilt is static,
   never animated).

## 11. Hard rules

- No em dash anywhere in code or docs (also avoid en dash). Use a
  hyphen or reword.
- No invented content: no new number, no new name, no new claim.
  Sticker and chip text uses recorded vocabulary only.
- Logo chips are name-only typographic chips. No copied logo
  artwork, no brand colors, no claim verbs unless verified.
- No reference copy and no client names anywhere in the collage.
- Tokens only: the colors and fonts in section 2. If a treatment
  needs a color outside that list, it is out of scope for v8 and
  goes back to the parent, not into the stylesheet.
