# v9 Re-check QA - Logo Tile Restyle and Compact ScienceDirect Icon

## Verdict: FAIL (one blocking gap remains, narrowed)

The restyle closed the grid gap completely and applied every
polish item from visual QA, but the glyph-clearance gap (visual QA
G1) is narrowed, not closed. The dark stack card is now about
211px tall in the realistic wrapped model, versus 233-257px before
the fix and 188px in v8. At a 700px stage that still intrudes
about 21px statically into the glyph band (about 39px worst case
with motion peaks), and the card is dark ink over ink glyphs, so
overlapped glyph pixels vanish. The card clears glyphs statically
only on stages about 750px and taller. This is a real, smaller
legibility break, not a tuck, so it stays blocking under the rule
that PASS requires every blocking gap closed.

## What changed since visual QA (verified in the tree)

- `src/components/hero-v8/LogoTiles.tsx` restyled: tiles fixed
  90px wide, art 20px tall capped at 66px wide, radius 8px,
  horizontal padding 10px, per-brand static tilts (PubMed -2deg,
  Elsevier +1deg, Scopus -1deg, ScienceDirect +2deg) via CSS
  classes with a max-width 719px override to 0deg, alternating
  shadows (PubMed and Scopus lifted, Elsevier and ScienceDirect
  soft), alternating tile heights (PubMed and ScienceDirect 44px,
  Elsevier and Scopus 40px).
- ScienceDirect tile now uses
  `public/logos/sciencedirect-icon.png` (official SD favicon
  mark, 32x32, transparent) instead of the 162px-wide horizontal
  wordmark. The horizontal file stays in `public/logos/` unused
  by the tile.
- Hero header comment corrected: 15 items, 8 v7 cards, 7 v8
  mockups (verified by grep).
- `DbStackCard.tsx` unchanged since the swap: same 220px card,
  same label, same footer, same bottom 5% and right 22% item
  position in Hero.tsx.

## Per-item results

### (1) True 2x2 grid: PASS

Tile rows are [PubMed, Elsevier] and [Scopus, ScienceDirect].
Row width is 90 + 8 + 90 = 188px, exactly the card inner width
(220px minus 16px side padding). Widths are fixed integers, so
the fit is deterministic: no content-dependent width can re-wrap
a row. No overflow. The empty row-2 slot from the 2+1+1 layout
is gone.

### (2) Card height and glyph clearance: FAIL (G1 remains)

Card height arithmetic from current code (DbStackCard):

- Padding: 14px top + 16px bottom = 30px.
- Label: 10px mono, letter-spacing 0.12em, 30 characters at
  about 7.2px each = about 216px wide against a 188px inner
  width, so it wraps to 2 lines: 24px + 12px margin = 36px.
- Tile block: row 1 max(44, 40) = 44px, gap 8px, row 2
  max(40, 44) = 44px, total 96px + 12px margin = 108px.
- Footer: 10px mono, letter-spacing 0.06em, 35 characters at
  about 6.6px each = about 231px wide against 188px, so it
  wraps to 2 lines: 24px.
- Blue bar: 10px margin + 3px height = 13px.
- Total wrapped (realistic): 14 + 24 + 12 + 96 + 12 + 24 +
  10 + 3 + 16 = 211px.
- Total conservative (single-line label and footer, which the
  widths above contradict): 187px.

Calibration correction to visual QA's estimate: visual QA put
the fixed card at 183-207px, but its tile-block figure was
92px (44 + 8 + 40). Row height is the max item height in the
row, so the correct block is 44 + 8 + 44 = 96px, and the true
range is 187-211px. Its bar was also inconsistent: a
bottom-anchored card at bottom 5% must be at most about 190px
tall for zero static clearance at stage 700 (665px bottom edge
minus 475px glyph bottom), so 207px would still intrude 17px.
The consistent bar is 190px, not 207px.

Stage model (visual QA calibration reused: card bottom 665px
at stage 700, glyph bottom about 475px at 700, about 400px at
550, about 525px at 800; wrapper tilt mv-tilt-card-d is 1deg,
about 2px above the top edge; float moves the card up 8px;
parallax moves the layer up to 8px; worst upward displacement
about 18px):

- Stage 700, wrapped 211px: top edge 454px, static intrusion
  about 21px; worst case about 39px.
- Stage 700, conservative 187px: top edge 478px, static
  clearance about 3px; worst case about 15px intrusion.
- Stage 550, wrapped: static intrusion about 88px.
- Stage 800, wrapped: top edge 549px, static clearance about
  24px; worst case about 6px clearance.
- Crossover: the wrapped card clears statically on stages
  about 750px and taller, and intrudes below that. Common
  laptop stages sit on both sides of that line, so the
  intrusion is present on many laptops, not a corner case.

Why this stays blocking while v8 tucks were accepted: v8's
tucking cards were white, so ink glyphs stayed readable on top
of them. This card is ink #010101 and the glyphs are ink, so
overlapped glyph pixels vanish. The fix cut the intrusion from
43-67px static to about 21px static, but did not eliminate it.

### (3) Logo legibility at display size: PASS with note

All five files viewed directly:

- PubMed (372x120, 62x20 at display): PASS. Blue PubMed.gov
  wordmark plus book mark reads; ".gov" is small but
  secondary.
- Elsevier (664x202, 66x20): PASS with note. Orange ELSEVIER
  reads at 20px; the grey tree mark softens to texture, as
  expected for a mark. It sits exactly at the 66px cap
  (65.7px).
- Scopus (1000x321, 62x20): PASS. Bold orange wordmark, the
  clearest of the four.
- ScienceDirect icon (32x32, 20x20 at display): PASS with
  note. The orange SD monogram is sharp at 20px (a downscale
  from 32px, so no upscaling blur) and reads as an SD mark.
  It identifies ScienceDirect only in context: the card label
  ("Where the evidence is searched"), the three neighboring
  database wordmarks, and the alt text "ScienceDirect logo".
  A viewer who does not know the SD monogram will not read
  the word "ScienceDirect" from this tile alone. This is the
  best genuine compact asset available after exhaustive
  sourcing (no stacked lockup or larger icon exists from
  legitimate sources), and the grid fix depends on it, so it
  is not a blocking gap by itself. Live-preview confirmation
  of how it reads in the real collage is owed.
- No logo is stretched, cropped, filtered, or recolored:
  height 20px, width auto, maxWidth 66px, object-fit contain.
  Alt texts are exactly "PubMed logo", "Elsevier logo",
  "Scopus logo", "ScienceDirect logo".

### (4) Mobile behavior: PASS

- Tile tilts are class-based with a per-tile style tag whose
  max-width 719px rule sets rotate(0deg). Base rule and media
  rule share specificity and the media rule comes later in the
  same style element, so the override wins at 719px and below.
  No inline transform is used on tiles (verified: the only
  transform occurrences are the style-tag lines and a comment).
- Hero mobile block zeroes wrapper tilts at 719px and below,
  so the dbstack wrapper tilt is zeroed too.
- Mobile stack is exactly three items: FaersCard (no hide
  class), NotifyBubble (hide-720-1160, visible below 720px),
  DbStackCard (hide-720-1400, visible below 720px). Every
  other item carries a class hiding it below 720px
  (mobile-hide, hide-1400, or hide-mid).
- At a 320px viewport the 220px card fits the 272px column;
  the 2x2 grid holds (188px = 188px inner width); art stays
  20px tall; static flow absorbs the taller card with no
  overlap. Below about 260px the v8 F8 max-width 100% rule
  caps the card and the grid falls back to one column.

### (5) Import contract: PASS

- `LogoTile` is imported by `DbStackCard.tsx` (line 10) and
  all four brands render there.
- `DbStackCard` is imported by `Hero.tsx` (line 58) and
  rendered as item id "dbstack" (right 22%, bottom 5%,
  hide-720-1400).
- Grep over src/ for PhotoCard, hero-lab, DbChip returns 0
  hits. `DbChips.tsx` is deleted (confirmed absent), so no
  dangling import exists. `PhotoCard.tsx` and `hero-lab.jpg`
  are deleted.
- The unused default `LogoTiles` export remains (same harmless
  pattern as v8's DbChips default after F5).

### (6) TypeScript: PASS

`npx tsc --noEmit` clean, 0 errors, whole tree.

### (7) Greps: PASS

Over Hero.tsx plus all hero-v8 files: em dash 0; forbidden
patterns (marquee, scroll-lock, cursor none, scroll-snap,
overscroll) 0; endorsement or indexing wording in rendered
copy 0. The single grep hit for those words is the
prohibitive header comment in DbStackCard.tsx stating the ban,
not visible copy.

### (8) FAERS masked check: PASS

Loaded docs/faers-verified.json: 2 rows with status other
than verified, 2 distinct numeric tokens across their
ror/ciLow/ciHigh fields. Standalone-token check (digits in
contexts masked to # below, values never printed):

- LogoTiles.tsx: 0 hits.
- DbStackCard.tsx: 0 hits.
- Hero.tsx: 8 hits, all pre-existing code (frame fade delays,
  cursor-chip anchor arithmetic, parallax math, transition
  durations), 0 in the changed card or tile code, no
  drug/outcome/CI structure. Not a leak. Contexts (masked):
  "ashed selection box fades in (#.#s delay, #s ease-in-out)",
  "duration: ##, delay: #.#", "chip.anchorX > #.#",
  "X - rect.left) / rect.width - #.#) * ##",
  "Y - rect.top) / rect.height - #.#) * ##",
  "The frame fade is #s at a #.#s delay",
  "ition: opacity #s ease-in-out #.#s",
  "chip.anchorX > #.#".

## Unchanged items (still PASS)

- Word center point: card x-range unchanged (right 22%,
  width 220px), never covers x 50%.
- Desk-by-dbstack overlap: unchanged at about 34-35%. The
  overlap is bottom-anchored (desk top edge binds it, stack
  bottom edge is fixed), so shrinking the stack card from the
  top does not change it. Same structure v8 accepted.
- G3 (row-1 slack): closed in substance. Fixed 90px widths
  make the row exactly 188px with integer math; the fragility
  visual QA feared (a content re-trim re-wrapping a row) cannot
  occur, because widths no longer depend on file content.
- G4 (tilt/shadow/radius treatment): closed. All doc 01 values
  verified in code (see "What changed" above).
- G5 (stale Hero comment): closed. Comment now reads 15 items,
  8 v7 cards, 7 v8 mockups.

## Gap list (one blocking item remains)

- G1-remaining (blocking): dark stack card, about 211px tall
  in the realistic wrapped model, intrudes about 21px
  statically into the glyph band at stage 700 (about 39px
  worst case with float, parallax, and wrapper tilt), and
  clears statically only on stages about 750px and taller.
  Fix F1 (preferred, no copy change, no logo change):
  shrink the card by about 25px to reach the 190px bar, or
  about 30px for v8-level clearance: reduce tile vertical
  padding from 10px to 6px (tile heights 44 to 36px and 40 to
  32px, saving 16px across two rows) AND reduce the
  label/tile/footer margins from 12px to 8px (saving 8px),
  giving about 187px wrapped and about 3px static clearance
  at stage 700. Re-verify row fit and glyph clearance after
  the change, since tile padding also affects the art
  breathing room (20px art in a 36px tile leaves 7px padding
  per side plus the 2px border).
  Fix F2 (alternative, needs the parent's decision, do not
  choose silently): keep the 211px card but hide the dbstack
  item below about 1000px viewport height, as visual QA
  proposed. Trade-off: the flagship dark card disappears on
  most laptops.
  Do NOT fix by shrinking art below 20px tall (legibility
  failure) or by forcing the horizontal ScienceDirect wordmark
  into 66px (8px tall, illegible).

## Method and limits

Code inspection plus viewing the actual logo files. No live
browser check was possible from the sandbox (localhost preview
is blocked), so all geometry is modeled from code and all font
dependent heights are given as ranges with the wrapped model
marked as the realistic one. Files checked for stability: this
report was written against the tree after the restyle landed;
no site edits were made by this QA (read-only tsc only).

## Live confirmation still owed (unchanged from prior rounds)

- Desktop at a common laptop height: whether the 21px modeled
  intrusion reads as a real glyph break, and whether F1 (if
  applied) restores clearance.
- Short stages: intrusion grows (about 88px static at stage
  550 in the wrapped model).
- Mobile stack: three items, tiles untilted, grid intact.
- ScienceDirect icon: whether the SD mark reads clearly in the
  real collage context.
