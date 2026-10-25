# Desktop Responsive Audit - DaivanLabs Portfolio Hero + Homepage

Scope: desktop widths 1180, 1280, 1366, 1440, 1536, 1920, 2560.
Method: code inspection + geometric modeling only. No live browser was used,
so every px figure below is computed from source values, not measured from a
render. Where a card height cannot be read exactly from source (image cards
with height auto), the figure is marked ESTIMATED and the conclusion is drawn
from the invariant that does not depend on it (z-order: collage z-index 0,
word/frame z-index 1, so the word and frame always paint above collage items).
No site files were edited and no build was run. This report is analysis only.

Reference stage height used throughout: hero section height is
`calc(100dvh - 100px)` with `minHeight: 550` (`src/sections/Hero.tsx:525`),
so a viewport height of 800px gives stage 700px. At stage 700 the centered
word block (label + frame) spans y 213.5 to 486.5, and the glyph band inside
the frame spans y 241.5 to 412.5 (frame padding 28px top/bottom, word line
171px = 180px x 0.95). Taller viewports push the frame down and increase
every clearance below; shorter viewports do the reverse, bounded by the
height hide rules (hide-short at viewport height 700px and below, hide-750
at 750px and below).

## 0. Headline verdict

No blocking desktop issue at any audited width. Nothing exceeds the
container or the viewport, no section overflows horizontally, and no glyph
is occluded at any width. All findings are minor: one composition issue
worth fixing (microscope/stickers buried under the word at narrow desktop),
one 1px-wide hide-rule dip at exactly 1400px, documented near-misses in the
1401-1450 band that were already accepted in v10/Cochrane QA, and expected
diffusion at 2560px. The mobile grey strip reported by the user is NOT
reproduced by any desktop geometry (see section 6).

Per-breakpoint verdicts:

| Width | Verdict | Worst item |
| --- | --- | --- |
| 1180 | Minor only | Microscope card 78% inside glyph x-range (see 2.2) |
| 1280 | Minor only | Microscope card 55% inside glyph x-range |
| 1366 | Minor only | Microscope card 35% inside glyph x-range |
| 1400 | Minor only | 1px hide-rule dip: 9 collage items instead of 11 |
| 1440 | Clean, near-misses only | Scopus/helix box gap 0.8px (ink gap 18.8px) |
| 1536 | Clean | All gaps 7px or more, most 38px or more |
| 1920 | Clean | Comfortable margins everywhere |
| 2560 | Minor only | Hero diffuses; helix/review graze frame edges by 8.8px |

## 1. Container centering and section max-widths

The container token is `--content-max: 1160px`
(`src/styles/tokens.css:28`). Every homepage section centers content with
`maxWidth: 1160, margin: "0 auto"` plus 24px side padding, so effective
content width = min(1160, W - 48):

| Width | Frame/content width | Side margins |
| --- | --- | --- |
| 1180 | 1132 | 24 |
| 1280 | 1160 | 60 |
| 1366 | 1160 | 103 |
| 1440 | 1160 | 140 |
| 1536 | 1160 | 188 |
| 1920 | 1160 | 380 |
| 2560 | 1160 | 700 |

Sections checked, all conform: Hero frame (`Hero.tsx:902`), Services
(`Services.tsx` section padding `130px 24px`), Works (`80px 24px 200px`),
Contact (`130px 24px 200px`), Quote (`120px 24px`), Profile
(`130px 24px`), Affiliations (`80px 24px 130px`), Manifesto
(`Manifesto.tsx:375,396`: `130px 24px`, inner `maxWidth: 1160`),
Footer (`Footer.tsx:175,178`: `40px 24px`, inner `maxWidth: 1160`).
The `.onlines-container` class in `global.css` (max-width 1160 + 1rem
padding) is not used by homepage sections; the inline pattern above gives
the same result.

Overflow guards, all present: hero section `overflow: hidden`
(`Hero.tsx:523`), collage layer `overflow: hidden`, diorama layer
`overflow: hidden` (`Hero.tsx:799`), Contact section `overflow: hidden`,
global `img, svg { max-width: 100% }` (`global.css:71`),
`body { margin: 0 }`. No element with a fixed pixel width larger than its
container was found at desktop widths. The only fixed-width elements near
the container edge are the 300px Profile portrait column and the 266px
Contact watermark, both far inside the container (see section 4).

Header check (`src/components/Header.tsx`): inner `maxWidth: 1160`,
wordmark 20px bold nowrap, 6 nav links 15px with gap 24 and flexWrap wrap,
200px spacer (`Header.tsx:130`) reserving room for the fixed CTA
(`Header.tsx:140`, right `max(16px, calc((100vw - 1160px) / 2))`, about
176px wide). Estimated header row at 1180px: about 1016px against 1132px
available, about 116px slack. The nav wraps only below desktop widths.
Verdict for section 1: PASS at all widths, no fix needed.

## 2. Hero composition

### 2.1 Word vs frame: measured, fits everywhere

The word font size is inline `clamp(72px, 16vw, 180px)`
(`Hero.tsx:964`), so at every desktop width it is capped at 180px
(16vw exceeds 180px from W = 1125 up). The word width was MEASURED with
fontTools against the shipped Inter 700 font file
(`node_modules/@fontsource/inter/files/inter-latin-700-normal.woff2`,
the fallback actually used since "Inter Display" is not bundled):
"daivanlabs." at 180px with -1.8px tracking = 1026.3px.

| Width | Frame width | Text area (frame minus 64px padding) | Word | Slack total |
| --- | --- | --- | --- | --- |
| 1180 | 1132 | 1068 | 1026.3 | 41.7 (about 21 per side) |
| 1280 and above | 1160 | 1096 | 1026.3 | 69.7 (about 35 per side) |

No wrap at any desktop width, even allowing for small metric differences
if a visitor system substitutes "Inter Display" (a display cut is, if
anything, slightly narrower at large sizes). The h1 also carries
`overflowWrap: break-word`, so the failure mode of an unexpectedly wide
render would be a wrap, not an overflow. Verdict: PASS.

### 2.2 Visible collage sets and narrow-desktop tuck

Collage items are positioned against full viewport width (layer
`position: absolute, inset: 0` over the section), while the frame is
centered. At narrow desktop the frame is nearly full-bleed (24px margins
at 1180), so viewport-relative items land much deeper inside the frame
zone than at wide widths. Visible sets (viewport height above 750px):

- 1180-1366: 11 items (docking, helix, review, poster, faers, awards,
  stroke, microscope, notify, stickers, pubmed) + 1 logo (PubMed).
- 1400: 9 items (poster and awards drop out, see 2.4) + 1 logo.
- 1401-2560: 16 items (the 11 above minus poster/awards, plus gutaxis,
  search, posterwindow, desk, elsevier, scopus, cochrane) + 4 logos.

Top-band tuck (all widths, deepest at 1180): docking (left 2.5%, 230
wide), helix (left 27%, 100 wide, 250 tall: viewBox 80x200), review
(right 27%, 220 wide, `ReviewCard.tsx` width 220), and poster (right
2.5%, 260 wide) descend into the frame top padding zone. The hard number
is the helix: at stage 700 its box spans y 14-264 against frame top
213.5 and glyph top 241.5, so helix ink overlaps the glyph vertical band
by about 22px, horizontally inside the glyph x-range. This is the
established v8/v10 behavior, not a defect: the frame and glyphs paint
above the collage (z-index 1 vs 0), glyphs are opaque, so ink is hidden
behind glyph pixels and visible only in gaps, reading as background
texture. The hide-short rule (helix hidden at viewport heights 700px and
below) bounds the worst case: at the shortest stage where the helix
shows (stage 601), ink overlap is about 72px; it shrinks to zero by
stage about 800. No fix recommended for the top band.

Microscope/stickers tuck (the one issue worth fixing): microscope
(`Hero.tsx:193`: left 2.5%, bottom 39%, 210 wide, about 210 tall
ESTIMATED from the 4/3 image plus caption) sits in the frame vertical
band at every width, and its horizontal overlap with the glyph x-range
grows as the viewport narrows:

| Width | Microscope x-range | Word x-range | Overlap with glyph x-range |
| --- | --- | --- | --- |
| 1180 | 29.5-239.5 | 77-1103 | 162.5px (78% of the card) |
| 1280 | 32-242 | 127-1153 | 115px (55%) |
| 1366 | 34.2-244.2 | 170-1196 | 74px (35%) |
| 1440 | 36-246 | 207-1233 | 39px (19%) |
| 2560 | 64-274 | 767-1793 | 0px (fully left of the frame) |

Vertically the card also overlaps the glyph band (bottom 39% at stage
700 puts its bottom edge at y 427, glyph band ends 412.5, so the card
spans the glyph band). At 1180 the card is mostly hidden behind the
giant word, reading as a card peeking out from behind "d" rather than a
deliberate layer. Glyphs stay fully visible (they paint above), so this
is minor, not blocking. Stickers (`Hero.tsx:223`: left 2.5%, top 32%)
follow the same pattern at smaller scale. Both items are hidden at
widths 1160px and below by hide-mid, so the fix is to extend that
threshold (see recommendation R1).

Bottom band (all widths): faers (left 2.5%, bottom 4%, 240 wide),
pubmed (left 43%, bottom 5%, 100-wide tile), gutaxis (left 25%, bottom
3%, 230 wide, wide widths only), desk (left 53%, bottom 3%, 220 wide,
wide widths only), elsevier (left 70%, bottom 5%, 104-wide tile, wide
widths only), awards (right 25%, bottom 4%), stroke (right 2.5%,
bottom 5%, 260 maxWidth). All sit below the frame bottom (486.5 at
stage 700) except faers, whose top edge (about y 472-500 ESTIMATED)
grazes the frame bottom padding zone by up to about 14px. Same tuck
class, no glyph contact (glyphs end at 412.5). Verdict: PASS.

### 2.3 The 1401-1450 band (hide-rule flip zone)

Crossing 1400-1401px swaps 7 items in (gutaxis, search, posterwindow,
desk, elsevier, scopus, cochrane) and 2 out (poster, awards): net
11 to 16 items, plus logos 1 to 4. The swap is instant on resize (the
collage entrance animation runs on mount only), so a user dragging a
window across 1400px sees a sudden density jump. That is inherent to
breakpoint design and affects only the decorative layer; no content
shifts. The thinnest gaps in the band, computed from source positions
(all at stage 700 unless noted):

| Pair | Gap at 1401 | Gap at 1440 | Note |
| --- | --- | --- | --- |
| Docking right / Cochrane left | 15.2px | 22px | Cochrane doc, accepted |
| Desk right / Elsevier left | 18.2px | 24.8px | v10 doc, accepted |
| Gutaxis right / PubMed left | 22.2px | 29.2px | v10 doc, accepted |
| Scopus right / Helix box left | -1.9px (box overlap) | 0.8px | Ink gap 16.1px at 1401, 18.8px at 1440; faint motif, frame paints above |
| Search left / Helix right | 26.1px | 30px | Clear |
| Search right / Review left | 38.3px | 42px | Clear |

No NEW collision appears in the band beyond these documented
near-misses; all were accepted in v10/Cochrane QA on modeled geometry.
Float animation adds up to about 5px of vertical drift (tilt-adjusted
worst case about 10px on the Cochrane tile per the Cochrane doc), which
does not close any horizontal gap. Verdict: minor, carry the live-preview
confirmation (recommendation R4) rather than changing positions.

### 2.4 The exactly-1400px dip

At exactly W = 1400, BOTH hide-1400 (max-width 1400px) and
hide-min-1400 (min-width 1400px) apply, so poster and awards are hidden
while the 1400-group is still hidden: 9 visible items instead of 11.
One pixel narrower (1399) shows 11; one pixel wider (1401) shows 16.
In practice invisible except while resizing, but it is a genuine
off-by-one. See recommendation R2.

### 2.5 Mid widths 1536 and 1920

Clean. Gaps grow with width (docking/cochrane 38.8px at 1536,
elsevier/desk 41.1px, gutaxis/pubmed 46.5px, scopus/helix box 7.5px).
Side margins (188px at 1536, 380px at 1920) give the collage breathing
room; the frame zone and collage zone separate clearly. No action.

## 3. Logo visibility accounting

Rules from source (`Hero.tsx:196-198,221` and stylesheet lines
701-741): pubmed visible at all desktop widths; elsevier, scopus, and
cochrane hidden at widths 1400px and below (hide-1400); cochrane
additionally hidden at viewport heights 750px and below (hide-750);
all four hidden on mobile (mobile-hide) where the separate mobile row
renders instead.

| Width | Viewport height above 750px | Viewport height 750px and below |
| --- | --- | --- |
| 1180, 1280, 1366, 1400 | 1 logo (PubMed) | 1 logo (PubMed) |
| 1440, 1536, 1920, 2560 | 4 logos (PubMed, Cochrane, Elsevier, Scopus) | 3 logos (Cochrane hidden) |

This matches the documented rule exactly (1 at 720-1400px, 4 above
1400px, Cochrane hidden at heights 750px and below). Boundary notes:
at exactly 1400px the count is 1, because hide-1400 applies at
max-width 1400; 4 logos start at 1401. At exactly 750px viewport height
Cochrane is hidden (hide-750 applies at max-height 750); 4 logos need
751px or more. The mobile row (widths 719px and below) is outside this
report's scope but is 4 logos in one row per the Cochrane doc.
Verdict: PASS, no discrepancy found.

## 4. Below-hero sections at desktop

Services (`Services.tsx:125`): 3-column grid `repeat(3, 1fr)`, gap 20px,
card min-height 520px (470px at max-width 1400px), padding 32px 32px
36px, title 36px. At 1180 (content 1132): columns (1132 - 40) / 3 =
364px each, text width 300px after padding. The longest title
("Teaching and mentoring") wraps to 2 lines, which is acceptable and
does not change card height (min-height dominates). No unbreakable
content found. Verdict: PASS at 1180-1280 and above.

Works (`Works.tsx`): rows flex wrap, padding-left 150px, route line at
left 70px, giant outlined numerals `clamp(64px, 9vw, 120px)`
(`Works.tsx:289`: 106px at 1180, about 120px wide for two digits, inside
the 150px padding), meta minWidth 220, title flex `1 1 320px`, link
nowrap. Row arithmetic at 1132px content fits with room; long titles
wrap inside the flex item. Verdict: PASS.

Contact (`Contact.tsx`): headline `clamp(56px, 13vw, 200px)`
(`Contact.tsx:448`): 153px at 1180, capped at 200px from 1539px up.
"together." measures about 760px at 1180 and about 990px at the 200px
cap, both inside content width, wrapping to 2 lines as designed.
Watermark "DL" 266px font (about 370px wide) centered, section
overflow hidden; email pill 18px bold (about 376px wide); social links
and decorative pills at left/right 6%; cursor chip left 42% (62% at
max-width 1200px, so 62% at 1180). No overflow or imbalance at
1180-1280. Verdict: PASS.

Quote (`Quote.tsx`): pinned wrapper `calc(100svh + 1875px + 240px)`,
sticky child min-height 100svh, padding 120px 24px; claim
`clamp(34px, 4.5vw, 64px)` (53px at 1180, capped 64px from 1423px up),
maxWidth 960; mission maxWidth 640. Text wraps normally. Verdict: PASS.

Profile (`Profile.tsx`): grid `300px 1fr`, gap 48px (1 column below
900px); portrait frame 300px + 16px padding; bio maxWidth 680. At
1132px content: 300 + 48 + 680 = 1028px, about 104px slack. Fact chips
are positioned relative to the 300px portrait column (left -14,
right 16/24, top/bottom -14) and stay inside the column span and
section padding; no viewport overflow. Verdict: PASS.

Affiliations (`Affiliations.tsx`): flex wrap, gap 48px 80px, badges
maxWidth 260. Wraps cleanly at all desktop widths. Verdict: PASS.

Manifesto (`Manifesto.tsx`): inner maxWidth 1160, text blocks maxWidth
900 / 680 / 760, chip row flex wrap. Verdict: PASS.

Footer (`Footer.tsx`): inner maxWidth 1160, flex wrap, gap 12px 24px.
Verdict: PASS.

## 5. Ultra-wide behavior (2560px)

The design holds together below the hero by construction: full-bleed
section backgrounds with content centered at 1160, so at 2560 the
below-hero sections are identical to 1920 except for 700px side
margins. The header CTA (right 700px) stays aligned with the container
edge. The hero is the exception: its collage layer spans full viewport
width while the word stays capped at 180px in the central 1160px frame,
so item density drops about 33% from 1180 to 2560 (16 items over
2560px vs 11 over 1180px, item count up 1.45x against width up 2.17x).
Consequences, all minor:

- The hero reads sparser and more diffuse; the word no longer dominates
  the stage the way it does at 1180-1440.
- Helix box (x 691.2-791.2) crosses the frame left edge (700) by
  8.8px; the frame left border line passes through the helix box for
  y 213.5-264. Faint motif, frame paints above: tuck class, no glyph
  occlusion.
- Review card (right edge 1868.8) crosses the frame right edge (1860)
  by 8.8px horizontally while its bottom edge (about y 221-241
  ESTIMATED) grazes the frame top padding zone; the dashed frame border
  draws across the card's bottom-right corner area. Cosmetic only.
- All other wide-width items clear the frame comfortably:
  posterwindow x 2216-2496 (356px clear of frame right), desk
  1356.8-1576.8, elsevier 1792-1896, pubmed 1100.8-1200.8 (bottom band,
  below frame), cochrane x 512-581, y 105-187 against frame top 213.5
  (26.5px clearance at stage 700, growing with stage height).
- Diorama chips (right-anchored at 4% from stage right, drift radius
  up to 56px) stay inside the layer, which has overflow hidden; no page
  overflow is possible from them.

Verdict: minor aesthetic note, not a defect. Optional hardening in
recommendation R3; leaving it as is preserves reference fidelity (the
Onlines container is fixed-width too).

## 6. The mobile grey strip: desktop verdict

No desktop horizontal-overflow source was found in any section read
for this audit. Every candidate (collage, diorama, watermark, dot
fields, fixed CTA) is either inside the container or guarded by
overflow hidden, and the container math leaves no remainder at any
desktop width. The strip is therefore not reproduced by desktop
geometry; it is a mobile/tablet-specific overflow (or a fixed element
at mobile widths) and belongs to the mobile analyst's slice, not this
one. Desktop widths are cleared of involvement.

## Recommendations (not implemented)

R1. Narrow-desktop microscope/stickers tuck (minor, highest value).
File: `src/sections/Hero.tsx`. Change the microscope item (line 193)
and stickers item (line 223) from hideClass `mv-collage-hide-mid` to a
new rule, e.g. `mv-collage-hide-1300`, defined alongside the other
hide rules (lines 701-741) as `@media (max-width: 1300px) { display:
none; }`. Effect: at 1180-1280 the two most-buried items disappear
and the hero reads clean; at 1366 and above they return with 35% or
less glyph overlap. Do not just move the microscope down: the frame
band is vertically centered, so a vertical shift cannot escape it at
1180.

R2. Exactly-1400px dip (minor, one line). File: `src/sections/Hero.tsx`
stylesheet (near lines 701-741). Change the
`mv-collage-hide-min-1400` media query from `min-width: 1400px` to
`min-width: 1401px`. Effect: at exactly 1400px poster and awards stay
visible (11 items), and the boundary transition becomes 11 to 16
instead of 11 to 9 to 16.

R3. Ultra-wide diffusion (minor, optional, only if the user finds
2560 sparse). File: `src/sections/Hero.tsx`. Option A: cap the
collage layer to a centered max-width 1920 container (change the
inset-0 layer to left 50% plus translateX(-50%) plus width
min(100%, 1920px); note all % positions would then resolve against
1920px, so re-check the 1401-1450 gaps after the change). Option B:
scale the word and frame up at min-width 1920 (word clamp max 180px
to 200px, frame maxWidth 1160 to 1280). Default advice: leave as is.

R4. Live-preview confirmation (not a code change). On the Netlify
preview at 1440px width, confirm the four documented near-misses read
as intentional layering and not collisions: docking/cochrane 22px,
desk/elsevier 24.8px, gutaxis/pubmed 29.2px, scopus/helix ink 18.8px.
Also confirm the microscope tuck at 1180 reads acceptably if R1 is
declined. This audit could not render pixels (sandbox localhost
preview is blocked); only the user's preview can close this item.

## Caveats

- All px figures are modeled from source values, not rendered pixels.
  Card heights marked ESTIMATED (docking, review, poster, posterwindow,
  search, microscope, faers, awards, stroke) are inferred from content
  structure (padding plus line counts plus image aspect where known);
  conclusions that depend on them are stated as ranges or as the
  z-order invariant, which holds regardless of exact height.
- Word width 1026.3px was measured with fontTools on the shipped Inter
  700 woff2; a visitor system with "Inter Display" installed may render
  a few px narrower or wider, which the 41.7px slack at 1180 absorbs.
- Stage heights assume the hero section height formula; real viewport
  chrome (browser UI, bookmarks bar) shifts stage height and therefore
  all vertical clearances, which is why short-stage behavior is bounded
  by hide-short and hide-750 rather than by exact numbers.
