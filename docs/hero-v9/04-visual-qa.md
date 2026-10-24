# v9 Visual QA - Real Database Logos

## Verdict: FAIL (not sign-off ready)

Two blocking gaps, both fixed by the same preferred fix: the dark
stack card intrudes into the hero word's glyph band (G1), because
the ScienceDirect tile spans its own full-width row instead of
fitting the 2x2 grid (G2). Every logo is legible at its shipped
size, the white tiles read clearly on the dark card, the mobile
stack fits, and the PhotoCard deletion is clean. But the card grew
about 45-70px taller than v8, and at common laptop heights its top
edge slides behind the lower part of the giant word. Because the
card is dark ink and the glyphs are ink, the overlapped glyph parts
do not stay readable the way v8's light-card tucks did. That is a
real legibility break, not a tuck.

## Method

Code inspection plus viewing the actual logo image files. No live
browser was possible from the sandbox (localhost preview is
blocked), so all geometry is modeled from code and all font
dependent heights are given as ranges, not false precision. Stages
modeled: 1440x700, 1280x700, 1100x600, 1440x550 (same stages as the
v8 visual QA). The v8 visual QA model is reused: word block about
273px tall centered, glyphs 171px tall at 180px font (1440 and 1280
wide), glyphs spanning about x 250-1190 at 1440 wide. Glyph bottom
is calibrated from the v8 QA's own desk measurement (DeskCard top
479px at stage 700 with about 4px clearance), giving glyph bottom
about 475px at stage 700, about 400px at stage 550, about 525px at
stage 800. Card height is the main uncertainty: label and footer
wrapping depends on real font metrics, so the v9 card height is
233px on the conservative model (single-line label and footer) and
257px on the wrapped model (both wrap to two lines at 10px mono in
a 188px inner width). The verdict does not depend on which end of
the range is true: both ends intrude materially at stage 700.

Files viewed directly (not just named): public/logos/pubmed.png,
elsevier.png, scopus.png, sciencedirect.png, plus a rendered
tile-size preview built from the actual implementation geometry
(2x scale, real logo files, computed tile sizes). Site files
checked for stability across two md5 snapshots: Hero.tsx,
DbStackCard.tsx, LogoTiles.tsx unchanged between them. tsc
--noEmit is clean (0 errors) for the whole tree.

## Logo files (viewed, measured, judged at shipped size)

| Logo | File size | Aspect | Art at 20px tall | Legibility verdict |
| --- | --- | --- | --- | --- |
| PubMed | 372x120, RGBA | 3.10 to 1 | 62x20 | PASS. Blue PubMed.gov wordmark plus book mark. "PubMed" reads at 20px; ".gov" is small but secondary. This is the official lockup, including ".gov". |
| Elsevier | 664x202, RGBA | 3.29 to 1 | 66x20 | PASS with note. Orange ELSEVIER wordmark reads at 20px. The grey tree mark softens to texture at this size, which is expected for a mark (it carries no text). Sits exactly at the 66px max-width bound (65.7px). |
| Scopus | 1000x321, RGBA | 3.12 to 1 | 62x20 | PASS. Bold orange wordmark, the clearest of the four at 20px. |
| ScienceDirect | 729x90, RGB on white | 8.10 to 1 | 162x20 in its own full-width row | PASS for legibility, FAIL for grid (see G2). Bold orange wordmark reads clearly at 20px tall. But at 20px tall it is 162px wide, so it cannot fit a 90px tile: scaled to 66px it would be 8px tall and unreadable. The builder avoided that by giving it a full-width row, which is what breaks the grid and grows the card. |

ScienceDirect's file has a baked white background (RGB, not
transparent). That is acceptable here only because the tile is
white: the box edge disappears into the tile, per doc 01. No logo
is stretched, cropped, filtered, or recolored in the
implementation: height 20px, width auto, object-fit contain, no
filters. Alt texts are exactly "PubMed logo", "Elsevier logo",
"Scopus logo", "ScienceDirect logo", matching doc 01.

## What the implementation actually builds (vs doc 01)

The shipped LogoTiles.tsx does NOT follow docs/hero-v9/01's tile
system in full. Differences that matter:

- Tiles are content-width, not fixed 90px: PubMed 88px, Elsevier
  about 92px, Scopus 88px, ScienceDirect 188px (full inner width).
- Grid is 2+1+1 rows, not 2x2: row 1 PubMed plus Elsevier, row 2
  Scopus alone, row 3 ScienceDirect full width. Row 2 leaves a
  conspicuous empty slot where a fourth tile would sit in a 2x2
  grid; a viewer can read it as a missing logo.
- No per-tile tilts (doc 01: PubMed -2deg, Elsevier +1deg, Scopus
  -1deg, ScienceDirect +2deg). All tiles are 0deg.
- One faint shadow on every tile (0 2px 8px at 0.06 alpha) instead
  of doc 01's two dark levels (soft 0.35, lifted 0.45, alternating).
  On ink, a 0.06 black shadow is nearly invisible; tile edges are
  carried by the 1px border alone.
- Tile radius 10px instead of doc 01's 8px. Trivial.
- Card height grows from v8's measured 188px to about 233-257px
  (conservative to wrapped model). Tiles alone grow from v8's chip
  rows to 142px (3 rows of 42px plus 2 gaps of 8px).

## Per-item results

- PubMed tile: PASS (see table).
- Elsevier tile: PASS with note (see table).
- Scopus tile: PASS (see table).
- ScienceDirect tile: PASS for legibility, FAIL for grid (G2).
- White tiles on the dark card: PASS. Paper #FFF tiles with a 1px
  #E0E0E0 border read clearly against the #010101 card. The faint
  shadow contributes almost nothing on ink (see G4), but no tile
  edge is ambiguous.
- DbStackCard: FAIL (G1 glyph intrusion).
- Word center point: PASS. The card's x-range at 1440 is about
  903-1123 (62.7-78% of stage width); the word center point at x
  50% is never inside it, at any modeled stage. The failure is
  glyph-band intrusion at the word's right end, not center
  coverage.
- Desk-by-dbstack overlap: PASS with note. Box model gives about
  34% static (about 35% worst float phase) versus v8 QA's about
  31% ink-adjusted. The v9 delta is about +1 point worst-case,
  within modeling tolerance: this overlap is driven by the shared
  x-overlap (80px) and the desk top edge binding the y-overlap,
  so the card's extra height does not materially change it. v8
  accepted about 31%; this is structurally the same overlap, not
  a new one.
- Mobile stack (FaersCard, NotifyBubble, DbStackCard): PASS. The
  220px card fits the 272px column at a 320px viewport with room
  to spare. Tiles wrap inside the card with no overflow and no
  clipping; art stays 20px tall; no tilts exist so the mobile
  tilt-zero rule is trivially satisfied. Static flow absorbs the
  taller card with no overlap. Below about 260px viewport width,
  the card is capped by max-width 100% (v8 F8 rule) and the grid
  falls back to a single column via wrapping, matching doc 01's
  safety valve.
- PhotoCard deletion: PASS. Hero.tsx import and COLLAGE_ITEMS
  entry removed, src/components/hero-collage/PhotoCard.tsx
  deleted, public/hero-lab.jpg deleted. Grep over src/ for
  PhotoCard, hero-lab, and DbChips returns 0 hits: no dangling
  references, and no reserved DOM space (the item is removed, not
  hidden). Composition note (not a failure): the centered bottom
  slot the photo occupied is now open water, about 170px at 1440
  between gutaxis (ends about 590) and desk (starts 763). The
  bottom band still reads as a band (faers, gutaxis, desk,
  dbstack), and the gap relieves v8's crowding; scatter gaps are
  normal, and the user asked for the deletion.
- Stack card text: PASS, no clipping. Label and footer wrap to
  two lines each in the 188px inner width (no nowrap, no overflow
  clipping anywhere on the card). The wrapping is already counted
  in the card-height range above.
- Hero.tsx integration: PASS with note (comment staleness is G5).
  15 items render (8 v7 cards plus 7 v8 mockups); the photo item
  is gone; the mobile stack comment was correctly updated to
  FaersCard, NotifyBubble, DbStackCard.

## Gap list

- G1 (blocking): Dark stack card intrudes into the glyph band.
  At 1440x700, card bottom edge 665px (bottom 5%), card top about
  432px (conservative 233px card) to about 408px (wrapped 257px
  card), versus glyph bottom about 475px: static intrusion about
  43-67px. With tilt bounding box (about 2px) plus float and
  parallax peaks (up to 16px), worst case about 61-85px. At
  1440x550 the static intrusion is about 110-135px. The card
  covers roughly the right end of the word (the "labs." region at
  1440). Why this is blocking while v8's light-card tucks were
  accepted: v8's tucking cards were white, so ink glyphs stayed
  readable on top of them. This card is ink #010101 and the
  glyphs are ink, so overlapped glyph pixels vanish into the
  card background. The frame painting above the collage does not
  rescue this, because the frame is a dashed border, not a
  backdrop. The card only clears glyphs statically on stages
  about 900px and taller (viewport about 1000px and up), so the
  intrusion is present at common laptop heights. Note the bound:
  a bottom-anchored card at bottom 5% must be at most about
  190px tall to clear glyphs statically at stage 700; this card
  is about 233-257px.
  Fix (preferred): source a compact official ScienceDirect asset
  (a stacked lockup or SD icon) that fits a 90px tile at 18px
  tall or more, and restore the 2x2 grid (tiles 90px, art 20px,
  max width 66px). That returns the card to about 183-207px tall
  and restores roughly v8-level glyph clearance (about 7-17px
  static at stage 700). This is exactly doc 01's own rule: a logo
  that cannot fit at 18px tall within 66px wide is the wrong
  asset and must be replaced, not squeezed around.
  Fix (inferior alternative, only if no compact asset exists):
  keep the 3-row card but add a max-height hide rule for the
  dbstack item (hidden below about viewport 1000px, shown on
  tall desktops and in the mobile stack). Trade-off: the flagship
  dark card disappears on most laptops, which guts the point of
  v9 on the screens users actually use. Do not choose this
  silently; it needs the parent's call.
- G2 (blocking): The tile grid is 2+1+1, not doc 01's 2x2. Row 1
  holds PubMed plus Elsevier, row 2 holds Scopus alone with an
  empty slot beside it, row 3 holds ScienceDirect full width.
  This is the structural cause of G1 (the third row adds about
  50px of card height versus a 2-row grid). It also reads as an
  unfinished grid: the empty row-2 slot looks like a missing
  fourth tile.
  Fix: the same preferred fix as G1 (compact ScienceDirect asset
  plus a true 2x2 grid). Do not fix by shrinking ScienceDirect
  art below 20px tall in its row: that trades a grid failure for
  a legibility failure.
- G3 (non-blocking): Row-1 exact fit is fragile. PubMed tile
  88px plus gap 8px plus Elsevier tile about 91.7px equals about
  187.7px against a 188px inner width: about 0.3px of slack.
  It fits today (flexbox lays out fractionally), but any
  re-trim of the Elsevier file or metric shift wraps Elsevier to
  a second row, adding a fourth tile row and about 50px of card
  height, which would worsen G1 by the same amount.
  Fix: reduce tile horizontal padding from 12px to 10px (doc 01
  allows shrinking to a minimum of 8px). Row 1 becomes about
  180px, leaving about 8px of slack. Apply together with the G1
  fix.
- G4 (non-blocking): Doc 01's "more interesting" treatment is
  missing. Tiles have no static tilts (doc 01 assigned -2, +1,
  -1, +2 degrees), one faint shadow on all tiles instead of the
  alternating soft and lifted dark shadows, and radius 10px
  instead of 8px. The tiles still beat v8's text chips (real
  logos, white tiles on dark, varied row widths), so this is
  polish, not a legibility or overlap failure.
  Fix: add doc 01's per-tile static tilts (with the below-720px
  zero override from doc 01's mobile rule), shadow levels
  (PubMed and Scopus lifted, Elsevier and ScienceDirect soft,
  at doc 01's dark alphas), and radius 8px. Apply together with
  the G1 fix, since tilts grow bounding boxes by about 2-4px and
  glyph clearance must be re-checked after adding them.
- G5 (minor, non-blocking): Hero collage header comment is stale.
  It still says "17 research mockups", "The 9 v7 cards", and "8
  v8 mockups join them (2 windows, 2 photos, 1 dark database
  card, 1 bubble, 1 chip row, 1 sticker row)". Actual: 15 items,
  8 v7 cards, 7 v8 mockups, no chip row (removed in v8 F5).
  Fix: update the comment to 15 items, 8 v7 cards, 7 v8 mockups,
  and drop "1 chip row". Comments do not affect rendering.

## Observations (not gaps)

- O1: LogoTiles' default export (all four tiles in a wrapping
  flex) is unused; DbStackCard uses the named LogoTile imports.
  Harmless, same pattern as v8's DbChips default after F5.
- O2: A tile whose image fails to load hides itself entirely
  (onError sets failed and returns null). No broken-image icon
  ever shows, and the grid reflows. If ScienceDirect failed, the
  card would shrink by one row. Acceptable resilience; no action.
- O3: The ScienceDirect file's baked white background is
  invisible on the white tile, as doc 01 allows. No action.
- O4: The PubMed art includes ".gov" because that is the
  official lockup. Correct, not an error.
- O5: No endorsement or indexing wording appears in rendered
  copy. The only occurrences of "indexed in", "affiliated",
  "partner", or "endorsed" in the checked files are inside
  prohibitive code comments stating the ban.

## Greps (Hero.tsx plus all hero-v8 files)

- Em dash: 0.
- Forbidden patterns (marquee, scroll-lock, cursor none,
  scroll-snap, overscroll): 0.
- Copied reference copy: 0 in rendered copy. No new copy was
  introduced by the tile change; the only brand strings are the
  four database names and the pre-existing verified labels.
- Dangling references: grep over src/ for PhotoCard, hero-lab,
  DbChips returns 0 hits.

## What must happen before ship

Apply G1's preferred fix (compact ScienceDirect asset plus a true
2x2 grid), G3's padding slack, and G4's tilt and shadow treatment
in one edit, then re-run this QA (or a targeted re-check) against
the new card: confirm card height at or below about 207px,
glyph clearance positive at stage 700, row-1 slack at least
several pixels, and all four logos still legible at 20px art
height. Live-browser confirmation remains owed for every v9
conclusion here (font metrics move the card height by up to about
24px, and the row-1 fit is subpixel-tight), same as all prior
rounds: check wide desktop at a common laptop height, a short
stage, and the mobile stack.
