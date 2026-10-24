# v10 recheck QA: free-floating database logos after parent fixes

Report only. No site edits, no build (read-only `npx tsc --noEmit`
was run: clean, 0 errors). Code inspection plus modeled geometry
only; no live browser check was possible from the sandbox, so every
number below is modeled, not seen, and live confirmation stays owed.

## Verdict: FAIL (2 blocking gaps, both in Elsevier's new slot)

The parent's fixes close every blocking gap listed in visual QA
(04) and reference-fidelity QA (05): the SD isolation (B1/G2),
the old Elsevier frame violation (B2), the stacked-pair gap (G1),
and the mobile row art floor (G3) are all closed on the current
tree, and all five applied fixes check out exactly as briefed.
But the swap moves Elsevier into a slot dimensioned for a 52px
tile, and that slot fails in two places the earlier docs did not
model: Elsevier collides with the poster window at short stages
(R1), and it touches or overlaps the frame's right edge in the
1401-1440 width band (R2). Both are real, both have concrete
fixes, and neither should ship silently.

## 0. Tree state verified before scoring

- COLLAGE_ITEMS positions and hide classes match the brief
  exactly: db-pubmed left 43% bottom 5% (mobile-hide);
  db-elsevier right 2.5% bottom 33% (mobile-hide + hide-1400);
  db-scopus left 20% top 3% (mobile-hide + hide-1400);
  db-sciencedirect left 43% bottom 19% (mobile-hide +
  hide-short); db-row hide-min-720.
- DbLogoFloat: radius 8px, wordmark shadows 0 8px 20px
  rgba(1, 1, 1, 0.14), icon shadow 0 4px 12px rgba(1, 1, 1, 0.12),
  wordmark art 24px, icon art 28px, tile widths 100/104/100/52.
- DbLogoRow: art 20px, tile padding 4px, gap 6px.
- Doc 01 correction present: section 3 now states the as-built
  24px wordmark art with the 28px history noted (lines 100-110).
- Logo files present: pubmed.png, elsevier.png, scopus.png,
  sciencedirect.png, sciencedirect-icon.png.

## 1. Geometry model (same as doc 04, restated for rechecking)

- Stage height H = 100dvh - 100px, minHeight 550. A 700px stage
  is an 800px viewport; a 600px stage is a 700px viewport; a
  550px stage is a viewport at or below 650px.
- Word block 273px tall, centered: frame top = H/2 - 90, frame
  bottom = H/2 + 136.5, glyph bottom about H/2 + 125.
- Frame width = min(1160, stage width), centered. At 1440 the
  frame spans x 140 to 1300; glyphs end near x 1261-1268 (frame
  edge minus 32px side padding).
- Tile sizes: wordmark tiles 50px tall (24px art + 24px padding
  + 2px border), widths pubmed 100, elsevier 104, scopus 100;
  SD icon tile 52 by 52px.
- Motion budget: float translateY 0 to -8px (upward only) per
  item, parallax plus/minus 8px on BOTH axes applied to the whole
  layer. Consequence the task budget needs: parallax cancels
  for item-to-item gaps (both items move together) but counts
  in full for item-to-frame and item-to-glyph clearances. So
  the peak budget is 8px (float differential) plus about
  2.5-3px tilt bounding box for relative gaps, and 8 + 8 + about
  2.5 = about 18.5px for absolute clearances. Tilt classes:
  pubmed +2deg, elsevier -3deg, scopus -1deg, SD +3deg.

## 2. Per-item results

### (a) SD-to-PubMed edge gap: PASS (with a peak caveat)

- Both at left 43%, so they share a left edge and stack
  vertically. SD bottom edge = 0.81H, PubMed top edge =
  0.95H - 50, so the rest gap = 0.14H - 50: 48px at H=700,
  62px at H=800. Width-independent (same at 1440, 1400, 1160,
  wherever both render).
- Peak: SD floats up 8px while PubMed rests, minus about 3px
  of combined tilt bounding box, giving about 37px in the most
  adversarial phase alignment (about 40px on the doc 05 model,
  which counts float only). Parallax does not narrow this gap
  because it moves the whole layer. No contact at any phase,
  both tiles stay fully legible.
- The 40px logo-to-logo rule passes at rest (48px) and lands
  0-3px under it only in adversarial peak alignment. That is
  the same crowding-not-collision class doc 04 treated as
  non-blocking (N1), and it meets doc 05's own fix criterion
  (48px rest, 40px worst peak on the doc model). The stacked
  pair reading remains (same x), as doc 05 anticipated, but
  with a rule-meeting rest gap.
- B1/G2 closed: the icon's anchor is PubMed at 48px, inside
  the doc 01 section 5 limit of about 120px, in the same band.

### (b) SD frame clearance and hide-short: PASS

- At H=700 (viewport 800, SD visible): SD top = 515, frame
  bottom = 486.5, clearance 28.5px at rest, about 11px at the
  absolute peak (28.5 - 18.5). Clears at rest and at peaks.
  Glyph clearance is 40px at rest, about 23px at peaks.
- At H=600 (viewport exactly 700): the hide-short rule
  (@media max-height 700px, verified in the stylesheet) applies
  inclusively, so SD is hidden. At H=550 (viewport at or below
  650px): hidden. Both required stages are covered.
- Threshold note: hide-short keys on viewport height, so SD
  is hidden at stages 600 and below and visible at stages 601
  and up. Observation (non-blocking): in the 601-668 stage band
  SD is visible and its absolute peak can graze the frame
  border (rest overlap up to about 2px at stage 601, peak graze
  shrinking to zero near stage 668). The tile is white and the
  word paints above, so glyphs stay visible; this is the lesser
  failure mode doc 04 already accepted for white tiles, not the
  v9 dark-card glyph-vanishing risk. Live preview should still
  confirm the 601-668 band looks clean.

### (c) Elsevier's new slot: FAIL (R1 and R2 below)

Frame (horizontal, since the tile sits inside the frame's
vertical band at every stage):

- At W=1440: elsevier left edge = 1300, frame right edge =
  1300, gap exactly 0px at rest. Tilt bounding box (about
  1.25px per side) plus parallax x (8px) intrude about 9px past
  the frame edge at absolute peaks. Glyph clearance is 32-39px
  at rest and about 23-30px at peaks: no glyph overlap at rest
  or at peaks. The task's glyph bar passes.
- In the 1401-1440 width band the tile overlaps the frame's
  right edge at rest: gap formula 0.475W - 684 gives -18.5px
  at W=1401 and 0px at W=1440, and the 24px frame rule is not
  met until about W=1491. Glyphs still clear (about 13.5px at
  rest and about 4px at peaks at W=1401), but the tile
  straddles the dashed frame border. See R2.

Poster window (both right 2.5%, poster window about 310-348px
tall from its chrome, padding, title, blocks, and footer; the
range covers 2-line vs 3-line title and 1-line vs 2-line mono
wrapping, so font metrics decide the exact number):

- At H=700: elsevier top = 419, poster bottom = 387-425, gap
  -6 to +32px, most likely about +12px. Below the 24px rule in
  most of the range, likely no overlap at rest, possible slight
  touch at the tall end. At peaks the gap can narrow by about
  11px (float differential 8 plus tilt 2.7), so a small overlap
  is possible at H=700 in the worst font-metric case.
- At H=600: elsevier top = 352, poster bottom = 376-414,
  overlap 24-62px. At H=550: elsevier top = 318.5, poster bottom
  = 370.5-408.5, overlap 52-90px. Both definite overlaps at
  rest, worse at peaks. The tile paints above (later DOM order)
  and covers the poster window's footer line, including the
  right-hand "Poster preview mockup" text. See R1.

Stroke (both right 2.5%, stroke about 125px tall per doc 05):

- Gaps at rest: 71px (H=700), 43px (H=600), 29px (H=550).
  At peaks: about 60px, 32px, 18px. No overlap at any stage;
  the H=550 peak value is below the 24px rule but without
  contact, N4-class. PASS for stroke.

### (d) PubMed neighbor gaps: PASS

- PubMed-to-gutaxis at 1440: gutaxis ends at x 590 (left 25%
  plus 230 width), PubMed starts at 619.2 (left 43%), gap
  29.2px, passing the 24px rule. The 42-to-43% move fixed the
  pre-fix 14.8px near-miss. Gutaxis hides at or below 1400px,
  so this only applies above 1400px.
- PubMed-to-desk at 1440: desk starts at 763.2 (left 53%),
  PubMed ends at 719.2, gap 44px, passing (was 58.4px before
  the move; still passing).

### (e) Scopus-to-helix: PASS (with a docking trade-off noted)

- Scopus left edge at 1440 is 288 (left 20%), helix box starts
  at 388.8 (left 27%), box gap 0.8px, about 0 as required (was
  13.6px box overlap at 21%). Helix ink starts 20px inside its
  box (viewBox x 16 of 80 at 100px wide), so real ink clears
  the tile by about 20.8px. The tile paints above and stays
  fully legible.
- Trade-off, non-blocking: the 21-to-20% move shrank the
  scopus-to-docking gap from 36.4px to 22px (docking ends at
  266, scopus starts at 288), now just under the 24px rule
  with no overlap. This is the exact trade doc 04 N3 warned
  about (a further move would trade one near-miss for
  another); 22px with no contact is acceptable, but it should
  not be moved left again without re-checking docking.

### (f) Mobile row geometry: PASS

- Row math at a 320px viewport: tile widths are pubmed 72px
  (62 art + 8 padding + 2 border), elsevier 75.7px (65.7 + 8 +
  2), scopus 72.3px (62.3 + 8 + 2), SD icon 30px (20 + 8 + 2),
  plus 3 gaps of 6px = 18px, totaling about 268px against the
  272px column. One row, 4px slack, as required.
- Safety: the row wraps (flexWrap) inside maxWidth 100% and
  the mobile block caps items at max-width 100%, so narrower
  columns degrade to a wrap, never an overflow or clip. Tilts
  are 0deg by construction and floats are off in the mobile
  block. Order is PubMed, Elsevier, Scopus, ScienceDirect.
- G3 closed: art is 20px, meeting the floor, with the one-row
  fit preserved by the 4px padding and 6px gap.

### (g) Radius and split shadows: PASS

- DbLogoFloat sets borderRadius 8 (was 14), wordmark shadows
  exactly 0 8px 20px rgba(1, 1, 1, 0.14), icon shadow exactly
  0 4px 12px rgba(1, 1, 1, 0.12), matching the briefed values.
  The icon no longer carries the deepest shadow in the set.

### (h) No width renders logos twice: PASS

- Floats carry mv-collage-mobile-hide (hidden at or below
  719px) and db-row carries mv-collage-hide-min-720 (hidden at
  or above 720px, rule verified in the stylesheet). At 719px
  only the row shows; at 720px only the floats show. No width
  renders both.
- Visibility accounting holds: 720-1400px shows pubmed + SD
  (2 logos; elsevier and scopus hide at or below 1400px);
  above 1400px shows all 4 at tall stages. At short viewports
  SD also hides (hide-short), so a wide short stage shows
  pubmed, elsevier, scopus (3). No breakpoint shows SD without
  its anchor: SD visible implies pubmed visible, because
  pubmed hides only below 720px while SD hides below 720px
  and on short viewports. No orphaned monogram anywhere.

### (i) TypeScript: PASS

- `npx tsc --noEmit` clean, 0 errors, on the current tree.

### (j) Greps: PASS

- Over Hero.tsx plus all hero-v8 files: em dash 0, forbidden
  patterns (marquee, scroll-lock, cursor none, scroll-snap,
  overscroll, scrollTo, scrollIntoView, Lenis) 0, endorsement
  and indexing wording in rendered text ("indexed in",
  "affiliated", "partner", "endorsed", "featured in",
  "as seen in", "approved by") 0, stale references
  (DbStackCard, LogoTiles, dbstack) 0 in src/.

### (k) FAERS masked check: PASS

- Method: loaded docs/faers-verified.json, took the 2 rows
  with status not equal to verified, checked their
  ror/ciLow/ciHigh values as standalone numbers in Hero.tsx
  plus all hero-v8 files.
- Result: 9 hits, all in pre-existing Hero.tsx code, 0 in any
  hero-v8 file. Masked contexts (digits replaced by #) show
  only animation math: fade delays, float durations and
  delays, anchor and parallax arithmetic. No drug, outcome,
  or CI structure. Not a leak. No unverified value is printed
  in this report.

## 3. Blocking gaps (remaining)

### R1 (blocking, new): Elsevier overlaps the poster window at short stages

- Evidence: section 2(c) above. Overlap 24-62px at H=600 and
  52-90px at H=550, widths above 1400px, covering the poster
  window's footer. This is a collision, not a near-miss, and it
  is the same severity class as doc 04 B2 (which was blocking
  for a 5px frame overlap). It is not one of the listed 04/05
  gaps: the old SD slot had the same overlap and docs 04/05
  missed it (doc 04 claimed a 190px poster gap at H=700 that
  does not survive a recount; doc 05 modeled about 21px at
  H=700 but never computed H=600 or H=550).
- Why a move cannot fix it: the right column at H=600 cannot
  fit poster window (about 330px) plus elsevier (50px) plus
  stroke (about 125px) with 24px gaps (66 + 330 + 24 + 50 + 24
  + 125 = 619 > 600), and moving elsevier down trades poster
  overlap for stroke overlap. Same impossibility structure as
  B2.
- Concrete fix: add mv-collage-hide-short to db-elsevier, so
  it hides when the viewport is at or below 700px (stages 600
  and below), exactly mirroring B2's fix pattern. At short
  wide stages the right column then shows poster window +
  stroke only. Visibility accounting changes to: above 1400px,
  4 logos at tall stages, 2 logos (pubmed, scopus) at short
  stages. Update doc 01 section 5 and the Hero comment if the
  accounting line changes.
- Alternative (needs an explicit parent call, do not choose
  silently): move the poster window (a v8 anchor; every
  neighbor clearance must be re-verified) or explicitly accept
  the overlap as a short-stage deviation.

### R2 (blocking, narrow band): Elsevier touches or overlaps the frame's right edge at widths 1401-1440

- Evidence: section 2(c) above. Rest gap 0px at W=1440 and
  -18.5px at W=1401; the 24px frame rule is not met until about
  W=1491. Glyphs still clear (about 13.5px at rest and about
  4px at peaks at W=1401; 32-39px at rest at W=1440), the frame
  is a dashed border, and the word paints above, so no glyph
  vanishes. But the placement doc forbids frame overlap, and
  18.5px of rest overlap is material, worse than the 5px that
  made B2 blocking.
- Why a nudge cannot fix it: a 104px tile at the right edge
  cannot reach 24px of frame clearance in this band at any
  right offset (even right 0% gives only about 16.5px at
  W=1401, and it would sit flush against the stage edge).
- Concrete fix, parent's choice: (i) explicitly accept the
  1401-1440 band as a documented tolerance, on the grounds
  that the glyph bar holds and only the dashed border is
  touched; or (ii) extend elsevier's hide to about 1490px
  (a new hide class or a widened hide-1400 for this item),
  changing visibility accounting to 2 logos until about 1490
  and 4 above, which needs a doc 01 update. Do not fix by
  nudging right % and do not fix by shrinking art below 20px.

## 4. Non-blocking observations

- O1: SD-to-PubMed peak gap about 37px in adversarial phase
  alignment, 3px under the 40px rule, no contact. See 2(a).
- O2: SD absolute peak frame graze in the 601-668 stage band
  (rest overlap only at 601-608, at most about 2px). White
  tile, word above, no glyph vanishing. See 2(b).
- O3: H=700 elsevier-to-posterwindow gap is font-metric
  dependent (-6 to +32px, most likely about +12px). The live
  preview must confirm whether it clears or touches at a
  common laptop height, even after R1 is fixed (R1 only hides
  elsevier at short stages; H=700 stays visible).
- O4: Scopus-to-docking gap 22px, just under the 24px rule,
  no overlap. Do not move scopus left again. See 2(e).
- O5: Elsevier-to-stroke peak gap about 18px at H=550, below
  the 24px rule, no overlap. N4-class. See 2(c).
- O6: Doc 01 residual staleness (doc-only, not render): the
  mobile row section still says gap 8px (as-built 6px), and
  the tile spec lines still say mid shadow 0 8px 24px at 0.10
  and near shadow 0 2px 8px at 0.06 with padding 10px 12px
  (as-built 0 8px 20px at 0.14, 0 4px 12px at 0.12, padding
  12px). The 24px art correction the brief asked for IS
  present; these other lines were not updated with it. Fix by
  correcting the doc, not the tiles.
- O7: The SD monogram still identifies ScienceDirect only in
  context (v9 finding, unchanged). Its anchor is now PubMed
  at 48px, so the context requirement is met on desktop; the
  live preview should still confirm it reads in the new
  bottom-center position.

## 5. What must happen before ship

1. Fix R1 (add hide-short to db-elsevier, or an explicit
   parent decision to move the poster window or accept the
   overlap).
2. Resolve R2 (explicit parent acceptance of the 1401-1440
   band, or a hide extension to about 1490px with a doc
   update).
3. Re-run this check against the fixed tree: confirm the
   elsevier hide removes the poster overlap without stranding
   any breakpoint, and confirm the H=700 elsevier-to-poster
   gap on the live render (O3).
4. Correct the doc 01 residual lines (O6).
5. Live-browser confirmation remains owed for everything
   modeled here: desktop above 1400px, the 1401-1490 band,
   the 720-1400 band, short stages, the mobile row at 320px,
   and the SD monogram in its new bottom-center context.
