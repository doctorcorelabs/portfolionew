# Visual QA: Cochrane swap (hero)

## Verdict: FAIL (1 blocking gap)

One genuine overlap: the opaque Cochrane tile sits on top of the
DNA helix motif at every width where Cochrane is visible and every
stage where the helix is visible. All brief items (a) to (i) pass
on their own terms, but the helix collision is an overlap under the
verdict criterion, so it blocks shipping until the parent either
relocates Cochrane or explicitly accepts the layering. Code
inspection only; no live browser was used (sandbox blocks localhost
preview), so every number below is modeled, not observed on screen.

## Tree verified

- `db-cochrane`: left 29%, top 3%, tile 69 wide x 82 tall, tilt
  card-d (+1deg), float 14s / 2.1s, hide mobile-hide + hide-1400
  (visible only above 1400px width, all heights).
- `db-scopus`: left 20%, top 3%, tile 100 wide, tilt card-c (-1deg),
  hide-1400. `search` window: left 36%, top 2%, width 260, tilt
  window-b (+1deg), hide-1400.
- `db-pubmed` stands alone bottom-center (left 43%, bottom 5%).
- The old bottom-center slot above PubMed (left 43%, bottom 19%)
  is retired with zero references in `src/`.
- `public/logos/` now holds only cochrane.png, elsevier.png,
  pubmed.png, scopus.png. The old ScienceDirect files are gone
  from disk, not just unrendered.
- Cochrane artwork viewed directly: real Cochrane portrait lockup
  (navy forest-plot C mark above the navy "Cochrane" wordmark).

## (a) Cochrane to Scopus: PASS (thinnest at 1401px)

Gap = 0.09W - 100 (Cochrane left 29% W minus Scopus right 20% W +
100px). At rest: 26.1px at 1401, 29.6px at 1440, 35.0px at 1500,
72.8px at 1920. Tilt-adjusted (Scopus card-c -1deg on a 100x50 tile
extends its right edge about 0.4px; Cochrane card-d +1deg on a
69x82 tile extends its left edge about 0.7px; total erosion about
1.1px): 24.9 / 28.5 / 33.9 / 71.7px. The 24px rule holds at every
modeled width, thinnest at 1401px (24.9px, just over the rule).
Float is vertical-only and parallax moves the whole layer, so
neither narrows a horizontal gap.

## (b) Cochrane to search window: PASS

Gap = 0.07W - 69 (search left 36% W minus Cochrane right 29% W +
69px). At rest: 29.1px at 1401, 31.8px at 1440, 36.0px at 1500,
65.4px at 1920. Tilt-adjusted (Cochrane right +0.7px; search
window-b +1deg on a 260-wide window extends its left edge about
1.3px at a 150px assumed height, 1.8px even at 200px height):
about 27.1 / 29.8 / 34.0 / 63.4px. The 24px rule holds at every
modeled width. Only the search window's left edge matters here,
and its item style (left 36%) is confirmed in Hero.tsx.

## (c) Cochrane frame clearance: PASS

Tile spans top 3% to top 3% + 82px. Frame top edge is
(stage - 273) / 2 from top. Clearance to the frame top at rest and
at the 18.5px motion peak (float 8 + parallax 8 + tilt about 2.5):
- Stage 700: tile [21, 103], frame top 213.5: 110.5px rest, 92.0px
  peak.
- Stage 600: tile [18, 100], frame top 163.5: 63.5px rest, 45.0px
  peak.
- Stage 550: tile [16.5, 98.5], frame top 138.5: 40.0px rest,
  21.5px peak.
Glyph clearance is a further 28px (171px glyphs centered in the
227px frame). Cochrane never touches the frame or the glyphs.

## (d) Tilt-sign alternation: PASS with a non-blocking note

Cochrane card-d is +1deg. Scopus card-c is -1deg (opposite sign,
correct alternation on the left). Search window-b is +1deg (same
sign as Cochrane on the right). The shared sign with the search
window is non-blocking: different element types (logo tile vs
window), at least 27px apart even at peaks, and 1deg each is
visually imperceptible as a pair. Precedent: v10 G7 treated shared
tilt signs as non-blocking.

## (e) PubMed alone bottom-center: PASS

The retired SD slot has zero references (grep for db-sciencedirect
and bottom 19% returns 0; the Brand type in both logo components
is now pubmed | elsevier | scopus | cochrane). Removing the slot
leaves no visual hole: it was an added tile, not a layout anchor,
and the bottom-center column simply has one tile. The Hero header
comment accounting is accurate: 1 logo at 720-1400px (PubMed only,
all heights), 4 above 1400px (PubMed, Cochrane, Elsevier, Scopus,
all heights), no short-viewport logo hiding anymore (no logo
carries hide-short now). Minor pre-existing caveat, unchanged:
"18 visible on desktop" holds only as "18 desktop items", since
no single width shows all 18 at once (hide-1400 items and the
mobile-only row are mutually exclusive).

## (f) Mobile row: PASS (recomputed, one row at 320px)

Order confirmed in code: PubMed, Elsevier, Scopus, Cochrane.
Recomputed from actual art widths at 20px art height, padding 4px
each side, border 1px each side, gap 6px:
- PubMed 372x120: 62.0px wide; Elsevier 664x202: 65.7px; Scopus
  1000x321: 62.3px; Cochrane 361x466: 15.5px.
- Without the img maxWidth cap: tiles 72 + 75.7 + 72.3 + 25.5 =
  245.5, plus 3 gaps x 6 = 18, total 263.5px (matches the component
  comment).
- With the img maxWidth: 60px cap (the three wordmarks clamp
  62.0 / 65.7 / 62.3 to 60): tiles 70 + 70 + 70 + 25.5 = 235.5,
  plus 18 = 253.5px.
Either way the row fits the 272px column at a 320px viewport in
one row (slack 8.5px unclamped, 18.5px clamped). Below about
312px viewport (about 302px on clamped math) it wraps via
flexWrap, never overflows (maxWidth 100%). Graceful wrap: the
Cochrane tile drops to a second row first (3 + 1), not a column
of four.

## (g) Legibility: PASS with the row-size caveat

Desktop (56px art): the C mark is about 45px tall and the
wordmark about 10px (confirmed from the viewed lockup, where the
mark occupies roughly the top 80% and the wordmark the bottom
20%). The mark dominates and the 10px bold navy wordmark is
legible in context. Row size (20px art): the mark is about 16px
and carries recognition, while the wordmark is about 3.5px and
illegible on its own. This is the same context-reading caveat as
the old SD icon: in the row, Cochrane reads via its neighboring
wordmarks and via the desktop presentation, not standalone.
Non-blocking, but the caveat must stay documented.

## (h) TypeScript: PASS

`npx tsc --noEmit` clean, 0 errors, on the current tree.

## (i) Greps: PASS

Over Hero.tsx plus the hero-v8 files: em dash 0,
"sciencedirect" 0 (case-insensitive) across all of `src/`.

## No double render: PASS

Cochrane carries mobile-hide (hidden below 720px) and hide-1400
(hidden at 1400px and below); the row carries hide-min-720
(hidden at 720px and up). Boundary at 719/720px is clean: at
719px only the row shows, at 720-1400px only PubMed shows, above
1400px all four floats show. No width renders any logo twice.

## BLOCKING GAP: Cochrane occludes the helix motif

- Helix box: left 27%, top 2%, 100 wide x 250 tall (viewBox
  80x200, item width 100). Cochrane box: left 29%, top 3%,
  69 wide x 82 tall. Cochrane's box sits essentially fully inside
  the helix's box: horizontally, Cochrane's left edge is 0.02W
  inside the helix's left edge (28.0px at 1401, 28.8px at 1440,
  30.0px at 1500, 38.4px at 1920) and its right edge stays inside
  the helix's right edge up to about width 1550 (3.0px inside at
  1401, 0 at about 1550, only 7.4px past at 1920); vertically,
  Cochrane's [0.03H, 0.03H+82] band is fully inside the helix's
  [0.02H, 0.02H+250] band at every stage.
- Ink, not just box: helix ink spans 20-80px from the helix box
  left edge (strands at viewBox x 16-64 scaled by 1.25, plus
  2.5px rendered stroke). Cochrane covers 28.0-97.0px relative to
  the helix left edge at 1401px, i.e. about 52px of the 60px ink
  width (about 85%), including the rung at viewBox y 30
  (rendered at helix top + 37.5px, inside Cochrane's band at
  every stage).
- Z-order: Cochrane is the 17th collage item, helix the 2nd, and
  DOM order is paint order, so the opaque white Cochrane tile
  paints above the helix. The strands vanish behind the tile
  over its full 82px height and resume below it. This reads as an
  interruption, not layering: the tile erases motif ink rather
  than grazing its box (contrast v10 G5, where a 13px box graze
  left the ink 6.4px clear and was still fixed).
- When it occurs: widths above 1400px (where Cochrane is visible)
  combined with stages above 600 (where the helix is visible;
  hide-short hides the helix at viewport height 700px and below,
  i.e. stages 600 and below). At stages 600 and below there is
  no collision because the helix is hidden. Float does not
  separate them: helix and Cochrane share a 14s float duration
  with different delays (1.1s vs 2.1s), so their relative offset
  oscillates but the 82px tile never leaves the 250px helix band.
- The builder's placement comment modeled only the two named
  neighbors (Scopus and the search window) and did not account
  for the helix, which occupies the same slot.
- Concrete fixes, parent's choice: (1) relocate Cochrane out of
  the helix box - note the top band is full (Scopus 20%, helix
  27%, search 36%), so no free 69px + 48px slot exists between
  Scopus and search once the helix is counted, and shifting the
  helix left collides with Scopus; any new slot needs fresh
  modeling; (2) move Cochrane to another band (bottom band
  would need fresh modeling against PubMed, desk, Elsevier, and
  stroke); (3) explicitly accept the occlusion as designed
  collage layering (opaque tile over a decorative motif). Do not
  ship it silently as clean.

## Still owed (live confirmation, not defects)

- Desktop above 1400px, the 1401-1450 width band (thinnest
  Scopus gap, 24.9px tilt-adjusted), short stages, the mobile
  stack at 320px and below, and the Cochrane tile in real
  collage context (including how the helix occlusion reads on
  screen, if the parent leans toward accepting it as layering).
