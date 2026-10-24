# Cochrane swap integration: ScienceDirect logo replaced by Cochrane

## What shipped

- User direction, 24 Oct 2026: replace the ScienceDirect logo with
  Cochrane. The swap is a logo replacement only: no layout system,
  no copy, and no other hero item changed for this swap.
- The four shipped database logos are now PubMed, Elsevier, Scopus,
  and Cochrane. ScienceDirect is fully gone: both files deleted
  from disk (`public/logos/sciencedirect.png`, the 729 x 90
  horizontal wordmark, and `public/logos/sciencedirect-icon.png`,
  the 32 x 32 SD favicon monogram), zero `sciencedirect` or
  `ScienceDirect` references in `src/`, and the old bottom-center
  slot above PubMed (left 43%, bottom 19%) retired with zero
  references in `src/`.
- Components: `DbLogoFloat` brand `"cochrane"` (desktop float) and
  `DbLogoRow` last tile Cochrane (mobile-stack row). Hero item
  `db-cochrane`. The v9 and v10 hero docs were deliberately not
  rewritten; they are historical records of the ScienceDirect
  arrangement. `docs/logo-sources.md` is the current provenance
  record.

## The asset

- File: `public/logos/cochrane.png` (361 x 466, RGB, portrait
  lockup). Navy forest-plot C mark above the navy "Cochrane"
  wordmark on white.
- Source: the embedded PNG inside Wikimedia Commons file
  `Cclogo.svg` (current revision 22 January 2020, described as
  "Updated to the new version with permission from Cochrane",
  author Cochrane Collaboration). Extracted as-is from the
  embedded raster inside the SVG wrapper, with no pixel changes.
- Deliberately NOT used: cochrane.org's own header logo
  (400 x 83, white on navy, made for dark headers), wrong for
  the white tiles.
- Trademark note carried from `docs/logo-sources.md`: the Commons
  file is marked public-domain-as-textlogo, but the Cochrane name
  and mark are trademarked; that mark covers copyright only and
  grants no trademark rights. On this site the logo is used
  nominatively only, to identify a search tool the author uses,
  with no endorsement, affiliation, indexing, or partnership
  claim, same framing as the other database logos.

## Tile geometry (as built)

- Desktop float tile: 69 wide x 82 tall, art 56px tall (lockup
  43.4px wide at that height, art max width 44px), padding 12px,
  8px radius, 1px #E0E0E0 border, white paper, object-fit contain,
  mid shadow (0 8px 20px rgba(1, 1, 1, 0.14)), alt "Cochrane logo",
  tile hides itself on load error. All four desktop tiles use the
  mid shadow in this round.
- The portrait tile is taller than the wordmark tiles (82px vs
  about 50px). That height is what drove the slot history below:
  the tile needs a taller vertical home than the old 52px SD
  icon tile did.
- Mobile row tile: art 20px tall, lockup only about 15.5px wide
  at that height, tile about 26px wide. Row order: PubMed,
  Elsevier, Scopus, Cochrane. Row total about 263.5px against
  the 272px mobile column at a 320px viewport (one row, 8.5px
  slack), wrapping only on narrower columns, never overflowing.

## Slot history (read this before moving the tile again)

### Slot 1: left 29%, top 3% - FAILED visual QA (04), never shipped

- Placed between Scopus (left 20%, 100 wide) and the search
  window (left 36%, 260 wide). Its own neighbors passed: Scopus
  gap 26.1px at rest at 1401px (24.9px tilt-adjusted, over the
  24px rule at every modeled width).
- Blocking failure: the tile sat inside the helix box (helix at
  left 27%, 100 wide) and covered about 85% of helix ink at every
  width where Cochrane is visible and every stage where the
  helix is visible. An opaque tile on top of the helix motif is
  an overlap, not a graze, so visual QA (04) verdict was FAIL
  with relocation (or explicit parent acceptance) required.

### Slot 2: left 66%, top 3% - REJECTED BY THE PARENT, never shipped

- A relocation agent proposed left 66% top 3%, between the
  search window and the review card.
- The parent rejected it before shipping after verifying from
  source that the review card sits at right 27%, not right 2.5%,
  so a 66% tile would sit inside the review card span. The 66%
  slot must be recorded as rejected, not as a shipped position
  and not as a fallback: it was never in the shipped tree.

### Slot 3 (FINAL): left 20%, top 15% - stacks under Scopus

- Cochrane stacks under Scopus in the same left column, both
  left-anchored at 20%: Scopus tile 100 wide at top 3%, Cochrane
  tile 69 wide at top 15%, so the column reads aligned.
- Float 14s / 2.1s, tilt card-d (+1deg) alternating with Scopus
  card-c (-1deg) above it.
- Hide classes: mobile-hide + hide-1400 + hide-750. The hide-750
  rule is new in the stylesheet (`@media (max-height: 750px)`,
  display none): Cochrane hides at viewport heights 750px and
  below, because below stage 651 the Scopus gap would close and
  the tile would graze glyphs. The plain hide-short threshold
  (700px) is not enough for this taller tile.
- The old SD hide-short behavior is gone with the SD tile; do
  not re-add hide-short to Cochrane, it would hide the tile at
  the wrong threshold.

## Final slot near-miss bands (modeled, verified by visual re-QA 05 and final QA 06)

All numbers below are modeled, not observed on screen (sandbox
blocks localhost preview). They are stated here as verified
bands, pending live confirmation only.

- Scopus gap: 24px-plus below the Scopus tile at rest at taller
  stages (34px at stage 700, 46px at stage 800), at least 10px
  even at worst float phase (tilt-adjusted). The gap never closes
  at any shown stage (recomputed by visual re-QA 05; the earlier
  28/34px figures were conservative in the same direction).
- Helix clearance: tile clears the helix box by 29px and helix
  ink by 47px at the tightest width (1401px).
- Docking gap: clears the docking card by 15px at 1401px
  (near-miss; full clearance above about 1470px).
- Glyph clearance floor: at least 64px clear of glyphs even at
  float peaks, frame clearance at least 36px at peaks, at every
  shown stage (recomputed by visual re-QA 05; the earlier 19px
  floor and 9px frame-graze figures were conservative, and no
  frame graze occurs at any shown stage).
- Hidden stages: below stage 651 the tile is hidden by hide-750,
  so the Scopus-gap and glyph-graze failure modes below that
  stage are unreachable in the shipped tree.

## Visibility accounting (final)

- Widths 720-1400px: PubMed only, all heights (Elsevier, Scopus,
  and Cochrane all carry hide-1400).
- Widths above 1400px: 4 logos (PubMed, Cochrane, Elsevier,
  Scopus) at viewport heights above 750px; 3 logos (PubMed,
  Elsevier, Scopus) at viewport heights 750px and below, where
  Cochrane hides via hide-750.
- Below 720px width: the mobile stack row only (FaersCard,
  NotifyBubble, DbLogoRow), in that order, tilts zeroed and
  floats off. No width renders any logo twice: floats hide below
  720px, the row hides at 720px and up.
- Item counts unchanged from v10: 19 COLLAGE_ITEMS total, 18
  visible on desktop at normal heights (the count includes the
  mobile-only row, so no single width shows all 18 at once).

## Deviations kept, deliberately

- Portrait tile taller than wordmark tiles (82px vs about 50px).
  This is the asset's own shape, not a styling choice; shrinking
  the art to match wordmark tile height would push the lockup
  below useful legibility.
- Row wordmark small at 20px art: the Cochrane wordmark is
  small in the mobile row (about 15.5px wide), and recognition
  there rides on the C mark. Same context-reading caveat as the
  old SD icon: the small logo reads through its neighbors in
  the row, not on its own.
- Near-miss bands accepted as modeled tolerance (no overlap):
  docking gap 15px at 1401px (tilt-adjusted about 10px, full
  clearance above about 1470px); Scopus gap about 10px at worst
  float phase on the shortest shown stage.

## QA chain

- 02 accuracy: PASS (real Cochrane artwork, zero endorsement /
  indexing wording, zero ScienceDirect references in src/,
  shipped logo files exactly the four expected, no invented
  content, tsc clean, em dash 0, FAERS masked check no leak).
- 03 motion/a11y: PASS (float durations/desync, tilt on the
  Hero wrapper only, hide audit with no double render, reduced
  motion gating, pointer-dead and aria-hidden layer, alt text).
- 04 visual: FAIL on slot 1 (helix collision, about 85% of helix
  ink covered). Slot 1 never shipped.
- Slot 2 (left 66%): rejected by the parent before shipping
  (review card span conflict, verified from source). Not a QA
  verdict; a parent decision, recorded here so it is not retried.
- 05 visual re-QA (final slot): PASS (no overlap, no glyph touch
  at any modeled width or stage; docking near-miss band and
  Scopus worst-phase gap documented; parent comment figures
  corrected upward from its recomputation).
- 06 final QA: PASS (per-file table, import contract, tsc, greps,
  FAERS masked check, reduced motion, full hide audit, comment
  accounting all pass; slot geometry judged from source).

## Still owed (live checks, sandbox blocks localhost preview)

- Desktop above 1400px, the 1401-1450 width band (docking gap
  near-miss), short stages (hide-750 boundary at viewport
  height 750px), mobile stack at 320px and below, and the
  Cochrane tile in real collage context under Scopus.
