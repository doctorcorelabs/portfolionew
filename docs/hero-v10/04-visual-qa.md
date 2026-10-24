# v10 visual QA: free-floating database logos

## Verdict: FAIL (2 blocking gaps, 6 non-blocking gaps)

Method: code inspection plus direct viewing of the four logo files.
No live browser check was possible from the sandbox, so every
conclusion below is modeled, not seen, and live confirmation is
still owed via the Netlify preview (same standing limitation as
every v7 to v9 round).

## 0. What was checked, and the tree state

The integrated tree was verified before scoring: Hero.tsx renders
19 collage items, the v9 dark card is gone (DbStackCard.tsx and
LogoTiles.tsx deleted, grep 0 in src/), and the new items are
DbLogoFloat tiles (db-pubmed, db-elsevier, db-scopus,
db-sciencedirect) plus the mobile-only DbLogoRow (db-row).
Read-only `npx tsc --noEmit` is clean. Greps over Hero.tsx plus all
hero-v8 files: em dash 0, forbidden patterns (marquee, scroll-lock,
cursor none) 0, stale references (DbStackCard, LogoTiles, chip row)
0 in src/.

## 1. Geometry model (stated so the numbers can be rechecked)

- Stage heights H are hero stage heights, as in the v9 model. The
  section height is calc(100dvh - 100px) with minHeight 550, so a
  700px stage is an 800px viewport, a 600px stage is a 700px
  viewport, and a 550px stage is any viewport at or below 650px.
- Word block: 273px tall, centered. This was re-derived, not
  assumed: label 12px mono (about 14px line) plus 32px bottom
  margin plus frame (word line box 171px at 180px font plus 56px
  padding) totals about 273px.
- Frame top = H/2 - 90, frame bottom = H/2 + 136.5, glyph bottom
  about H/2 + 125 (475 at H=700, 425 at H=600, 400 at H=550, matching
  the v9 calibration).
- Frame width = min(1160, stage width), centered. At 1440 the frame
  spans x 140 to 1300; at 1280, x 60 to 1220; at 1100, x 0 to 1100.
- Logo tile sizes from DbLogoFloat.tsx: wordmarks 100 to 104px
  wide by 50px tall (24px art, 12px padding, 2px border); SD icon
  tile 52 by 52px (28px art). Tilts: pubmed +2deg, elsevier -3deg,
  scopus -1deg, sciencedirect +3deg (tilt bbox adds about 3 to 5px
  of vertical extent).
- Motion budget at peaks: float translateY 0 to -8px (upward only)
  plus layer parallax plus/minus 8px, so a bottom-band tile can
  rise about 18.5px above its rest position (float 8 + parallax 8
  + tilt about 2.5). Top-band tiles float away from the word, so
  their worst case is parallax alone (8px toward the word).
- Placement rules applied: doc hero-v10/01-free-placement.md
  section 1 (top band = top 0 to 35 percent of stage height,
  bottom band = bottom 0 to 40 percent; no overlap with glyphs,
  frame, or label; 24px clearance from the frame edge), section 2
  (logo to logo at least 40px, logo to card at least 24px, 12px
  corner graze at most), section 3 (wordmark art 28px, icon art
  28px, floor 20px), section 5 (SD icon within about 120px of a
  wordmark in the same band).

## 2. Per-item results

### db-pubmed (left 42 percent, bottom 5 percent, 100 by 50px)

- 1440x700: x 604.8 to 704.8, y 615 to 665. Frame bottom clearance
  128.5px. Word center and label clear. Desk gap 58.4px (desk left
  53 percent = 763.2). Faers and stroke gaps are hundreds of px.
- 1280x700: x 537.6 to 637.6, same y. Gutaxis and desk hidden at
  this width, so no neighbor conflicts.
- 1100x600: x 462 to 562, y 520 to 570. Frame clearance 83.5px.
- 1440x550: y 472.5 to 522.5. Frame clearance 61px.
- Verdict: PASS at every modeled stage. Its only issue is the
  gutaxis gap below (N2).

### db-elsevier (left 43 percent, bottom 17 percent, 104 by 50px)

- 1440x700: x 619.2 to 723.2, y 531 to 581. Frame clearance 44.5px
  at rest, about 26px at float plus parallax peaks. PASS, but thin.
- 1100x600: y 448 to 498. Frame clearance 11.5px at rest, below
  the 24px rule, and about 7px of overlap with the frame border
  at peaks. Glyphs stay clear at rest (23px) but the tile enters
  the glyph band by about 4.5px at peaks.
- 1440x550: y 406.5 to 456.5. Frame bottom is 411.5, so the tile
  overlaps the frame border by 5px at rest and about 23.5px at
  peaks. Glyph bottom is 400, so the tile clears glyphs by 6.5px
  at rest but enters the glyph band by about 12px at peaks.
- Mitigating fact, stated precisely: the tile is white and the
  word layer paints above the collage (z 1 versus 0), so glyphs
  remain visible above the tile. This does NOT recreate the v9
  dark-card glyph-vanishing risk. It is still a composition
  break: a white tile jutting into the frame zone, which the
  placement doc forbids at any breakpoint.
- Verdict: FAIL at stages 600 and 550. See blocking gap B2.

### db-scopus (left 21 percent, top 3 percent, 100 by 50px)

- Visible only above 1400px (hide-1400) and at or above 720px
  (mobile-hide). No 1280 or 1100 case exists.
- 1440x700: x 302.4 to 402.4, y 21 to 71. Frame top clearance
  188.9px. Docking gap 36.4px (docking spans 36 to 266). Search
  window gap 116px. Review gap about 429px. Word center and label
  clear.
- 1440x550: y 16.5 to 66.5. Frame top clearance 118.4px.
- Helix: the helix bounding box (x 388.8 to 488.8, y 14 to 264)
  overlaps the tile box by 13.6px horizontally, which on paper
  exceeds the 12px graze tolerance. But the helix SVG viewBox is
  0 0 80 200 rendered 100px wide, and its ink starts at viewBox
  x 16, i.e. 20px inside the box, so actual ink starts at x 408.8
  and clears the tile right edge (402.4) by 6.4px. No ink
  collision; the tile paints above (later DOM order) and stays
  fully legible. See non-blocking gap N3.
- Verdict: PASS at every stage where it renders.

### db-sciencedirect (right 2.5 percent, bottom 33 percent, 52 by 52px)

- Visible only above 1400px and at or above 720px, like scopus.
- 1440x700: x 1352 to 1404, y 417 to 469. Frame right edge is
  1300, so the horizontal gap is 52px. Stroke gap 71px at rest
  (stroke top about 540, height estimated about 125 from its
  three paragraphs). Poster window gap at least 190px. Glyphs are
  x-disjoint (glyphs end near x 1261). Word center and label
  clear.
- 1440x600: y 350 to 402. Stroke gap 43px at rest.
- 1440x550: y 316.5 to 368.5. Stroke gap 29px at rest, about 18
  to 21px at float peaks (stroke floats on a different duration,
  so the pair closes by up to 8px plus about 3px of tilt). Below
  the 24px rule at peaks, but no overlap. See non-blocking N4.
- Bottom-band membership: the tile is bottom-anchored at 33
  percent and its center sits at 36.7 to 37.7 percent from the
  bottom at all stages, so it is a bottom-band item; its top edge
  straddles the 40 percent band line by 3px at H=700, 10px at
  H=600, and 13.5px at H=550. Negligible; not scored as a gap.
- Isolation: nearest wordmark edge distance is about 632px at
  1440 (to elsevier: dx 628.8, dy 62) and grows with stage width
  (about 890px at 1920). The placement doc requires the icon to
  sit in the same band as, and within about 120px of, at least
  one wordmark tile. It fails that rule at every width where it
  renders. See blocking gap B1.
- Verdict: FAIL on isolation alone; its clearances otherwise pass.

### db-row (mobile only, below 720px)

- Stack order is faers, notify, db-row by DOM order, matching the
  placement doc. Order inside the row is PubMed, Elsevier, Scopus,
  ScienceDirect, matching the doc.
- Fit: row total about 259px against the 272px column at a 320px
  viewport, so all four tiles fit on one row. flexWrap plus
  maxWidth 100 percent means it wraps into two pairs on narrower
  columns and never overflows or clips. Tilts are absent (0deg by
  construction) and floats are off (mobile block sets animation
  none). No enclosing background, border, or label: the row div
  carries only flex layout. Proximity holds on mobile: all four
  tiles sit together with 8px gaps.
- Art height is 17px, below the placement doc 20px floor (doc
  sections 3 and 6). Bold wordmarks at 17px tall (about 53 to
  56px wide) and the SD mark at 17px remain legible in row
  context. See non-blocking gap N6.
- Verdict: PASS on fit, wrap, order, and proximity; one
  non-blocking doc deviation (N6).

### Dark card removal

- DbStackCard.tsx and LogoTiles.tsx are deleted; grep for
  DbStackCard, LogoTiles, and chip row returns 0 in src/. No dark
  element remains in the collage, so the v9 glyph-intrusion risk
  (dark card covering ink glyphs) is gone. The elsevier
  short-stage issue (B2) is a white tile entering the frame zone,
  a different and lesser failure mode, and it is scored as such.

### System checks (all PASS)

- Float desync: durations 13, 11, 15, 12 seconds, all distinct;
  delays 0.5, 1.3, 0.9, 1.7 seconds, all distinct. Tilt lives on
  the inner wrapper, float on the outer wrapper, never the same
  element. Tilts are within minus 4deg to plus 4deg, and the
  adjacent stacked pair (pubmed +2deg, elsevier -3deg) has
  opposite signs.
- Alt texts are brand plus "logo" in both new components. No
  links, buttons, or hover actions on any tile. The layer stays
  pointer-dead and aria-hidden. onError hides a failed tile with
  no text fallback, as in v9.
- Double rendering: floats carry mobile-hide (hidden at or below
  719px) and db-row carries hide-min-720 (hidden at or above
  720px, definition verified at the stylesheet). At 719px only
  the row shows; at 720px only the floats show. No width renders
  both.
- No text clipping anywhere in the new items (tiles contain only
  images). No new visible label or caption. No brand color hex
  values outside the logo image files.

## 3. Blocking gaps

### B1 (blocking): SD monogram isolated from every wordmark on desktop

- Evidence: at 1440 the nearest wordmark edge is about 632px
  away (elsevier); at 1920 it is about 890px away. The placement
  doc (section 5) requires the same band and within about 120px.
  The monogram identifies ScienceDirect only in context, so an
  isolated monogram on the far right reads as an unexplained
  orange mark, not as ScienceDirect.
- Why no cheap fix exists: the bottom-center slot between the
  pubmed/elsevier stack and the desk card is only 58.4px wide at
  1440, while a 52px SD tile needs 40px to the nearest wordmark
  plus 24px to the desk card (116px total). The slot only fits
  that geometry at widths at or above about 1964px. The top band
  is equally crowded (helix ink, search window, docking).
- Concrete fix: move the desk card right (left 53 percent to 60
  percent; desk to stroke gap stays about 60px, desk to poster
  window gap about 40px, awards never co-visible with desk) and
  place the SD tile at left about 53.5 percent, bottom about 12
  percent. At 1440 that gives SD x about 770 to 822: 46.8px to
  elsevier (at least 40, within 120), 65.2px to pubmed, and about
  42px to the moved desk. Re-verify the SD to stroke gap after
  the move, since the tile moves into the desk/stroke neighborhood.
  Alternative, if the parent prefers not to move the desk: accept
  SD isolation explicitly as a deviation from section 5, and do
  not ship it silently as compliant.

### B2 (blocking): elsevier violates frame clearance at stages 600 and 550

- Evidence: frame bottom is 436.5 at H=600 and 411.5 at H=550.
  Elsevier top is 448 at H=600 (11.5px clearance at rest, below
  the 24px rule, about 7px of frame-border overlap at peaks) and
  406.5 at H=550 (5px overlap at rest, about 23.5px at peaks).
  At H=700 it passes (44.5px at rest, about 26px at peaks).
- Why it cannot be fixed by nudging alone: at H=550, two 50px
  tiles need a 40px gap (140px of stack) plus 24px of frame
  clearance, but the frame bottom sits at 411.5 and the stage is
  only 550 tall, so the stack would need to end at 575.5px. With
  percentage positioning, no placement of the pair satisfies
  both the 40px logo-logo gap and the 24px frame clearance at
  H=550 (it would require elsevier bottom at or below 11.7
  percent while the gap requires a 16.4 percent split, forcing
  pubmed below the stage). Proof of impossibility, not a lack of
  trying.
- Concrete fix: add a short-stage hide for elsevier (a new class,
  for example max-height 620px), so the pair unstacks on short
  stages and pubmed stands alone in the bottom center. Keep the
  700px layout untouched, since it passes. Do not fix by moving
  elsevier down alone: that trades the frame violation for a
  pubmed overlap at short stages (same impossibility). Do not
  fix by shrinking art below 20px (legibility failure).

## 4. Non-blocking gaps

### N1: pubmed to elsevier logo-logo gap below the 40px rule

- Gap is 0.12H - 50: 34px at H=700, 22px at H=600, 16px at H=550.
  At float plus tilt peaks it narrows to about 21.5px, 9.5px, and
  3.5px respectively. The tiles never touch or overlap at any
  stage, and both stay fully legible, so this is crowding, not
  collision. Fix with B2: the short-stage hide for elsevier also
  removes the 550 crowding; at H=700 the 34px gap is a 6px
  shortfall the parent may accept as-is. If the parent wants the
  full 40px at H=700, move elsevier bottom 17 percent to 19
  percent (gap 48px at H=700, frame clearance 30.5px at rest,
  about 12px at peaks, so still a peak graze) and re-verify.

### N2: pubmed to gutaxis gap 14.8px at 1440 (rule 24px)

- Gutaxis (left 25 percent, width 230) ends at x 590; pubmed
  starts at 604.8. Gap is 0.17W - 230, so it passes at widths at
  or above 1494px and fails only in the 1400 to 1494px band.
  Vertical float does not change a horizontal gap, and tilt
  shrinks it only to about 13px. No overlap, both fully legible.
- Concrete fix: move pubmed left 42 percent to 43 percent. At
  1440 the gutaxis gap becomes 29.2px and the desk gap becomes
  44px, both passing. Elsewhere the geometry only improves with
  width.

### N3: scopus to helix bounding-box overlap 13.6px, no ink collision

- The helix box overlaps the scopus tile box by 13.6px
  horizontally, just over the 12px graze tolerance on paper. But
  helix ink starts 20px inside its box (viewBox x 16 of 80,
  rendered 100px wide), so real ink clears the tile by 6.4px, the
  tile paints above, and the logo stays fully legible. No fix
  required unless the helix artwork changes; if the parent wants
  zero box overlap, move scopus left 21 percent to 19.5 percent
  (gap to docking becomes about 15px, which trades one near-miss
  for another, so this is not recommended).

### N4: SD to stroke gap narrows to about 18 to 21px at 550 peaks

- Rest gaps are 71px (H=700), 43px (H=600), 29px (H=550). At H=550
  the desynced floats plus SD tilt close it to about 18 to 21px,
  below the 24px logo-to-card rule but with no overlap. No fix
  required; re-verify if SD moves per B1.

### N5: DbLogoFloat deviates from placement doc size and finish specs

- Wordmark art is 24px, not the doc 28px; wordmark tiles are 100
  to 104px wide, not 110 to 120px; radius is 14px, not 8px;
  shadow is a uniform 0 10px 28px rgba(1, 1, 1, 0.14), not the
  tiered mid (0.10) and near (0.06) depths; padding is 12px, not
  10px 12px. Legibility holds (24px is above the 20px floor) and
  all clearance math in this report was done at the as-built
  24px sizes, so do not "fix" the sizes without re-verifying
  every clearance: raising art to 28px would grow tiles to about
  54px tall and 110 to 120px wide and invalidate sections 2 and
  3 above. Recommend keeping 24px and correcting the doc, not
  the tiles.

### N6: mobile row art is 17px, below the 20px floor

- DbLogoRow renders art at 17px so the row totals about 259px
  and fits the 272px column at a 320px viewport on one row. At
  20px the row would total about 290px and wrap into two pairs
  at 320px, which contradicts the doc "wraps only below about
  320px" line. The doc rules conflict at exactly 320px: one-row
  fit requires 17px, the floor requires 20px. Legibility at 17px
  holds for bold wordmarks and the SD mark in row context, and
  the row wraps safely, so this is a doc-rule deviation, not a
  visual defect. Fix is a parent choice: keep 17px one-row, or
  raise to 20px and accept two-pair wrap at 320px.

## 5. What must happen before ship

1. Fix B1 (relocate SD per the desk-shift plan, or explicitly
   accept isolation as a deviation).
2. Fix B2 (short-stage hide for elsevier, or another placement
   that provably clears the frame at H=600 and H=550).
3. Apply or explicitly accept N1, N2, and N6 (each has a concrete
   fix above; N2 is a one-line position change).
4. Re-run this visual check against the moved tiles: confirm the
   new SD position clears stroke, desk, and the frame, and that
   the elsevier hide does not strand any breakpoint.
5. Live-browser confirmation remains owed for everything modeled
   here: desktop at a common laptop height, short stages, the
   mobile row, and the SD mark in real collage context.
