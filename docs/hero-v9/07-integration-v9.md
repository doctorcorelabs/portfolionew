# v9 integration: real database logos + photo card removal

## What the user asked (20:09 WIB, 24 Oct 2026)

1. Delete the "IN THE LAB" photo card (the v7 PhotoCard rendering
   `/hero-lab.jpg`).
2. Replace the v8 stylized text database wordmarks with the REAL
   PubMed, Elsevier, Scopus, and ScienceDirect logos, pasted into the
   hero but presented more interestingly, not as plain text.

Point 2 explicitly supersedes the v8 framing decision (stylized text
wordmarks instead of official artwork). The logos stay framed as
search tools for systematic reviews only: no "indexed in",
"affiliated", "partner", or endorsement wording anywhere in rendered
copy. Trademark note lives in `docs/logo-sources.md` (nominative use;
remove on rights-holder objection).

## What changed

- `src/sections/Hero.tsx`: PhotoCard item and import removed; mobile
  stack is now FaersCard, NotifyBubble, DbStackCard (no replacement
  item); header comment corrected to 15 items, 8 v7 cards, 7 v8
  mockups (was stale: 17 / 9 / 8 with a chip row removed in v8 F5).
- Deleted: `src/components/hero-collage/PhotoCard.tsx`,
  `public/hero-lab.jpg`, `src/components/hero-v8/DbChips.tsx`
  (orphaned after the swap; grep confirms zero references).
- New: `src/components/hero-v8/LogoTiles.tsx` (LogoTile named export,
  brand prop) rendering real logo images inside white rounded tiles
  (radius 8px, 1px #E0E0E0 border, alternating shadows, static
  per-brand tilts via classes with a max-width 719px override to
  0deg, art 20px tall capped at 66px, object-fit contain, alt text
  "Brand logo", onError hides a failed tile, no claim text).
- `src/components/hero-v8/DbStackCard.tsx`: DbChip wordmarks replaced
  by four LogoTiles in a true 2x2 grid (90 + 8 + 90 = 188px = card
  inner width). Card dark, label, and footer unchanged.
- New assets in `public/logos/`: pubmed.png (official NLM file),
  elsevier.png, scopus.png (Commons vector render), sciencedirect.png
  (official Elsevier toolkit download), sciencedirect-icon.png
  (official SD favicon mark, 32x32, from ScienceDirect's own CDN,
  byte-identical to sciencedirect.com/favicon.ico).
- `docs/logo-sources.md`: per-logo source URL, verification note,
  trademark note, including the icon entry (line 66).

## Sourcing honesty (disclose, do not hide)

- Elsevier's logo does NOT come from an official press kit or
  Commons (no current Elsevier logo file exists on Commons; only the
  old Reed Elsevier logo, rejected as outdated). It is the official
  artwork vector from the logo library logotyp.us, verified visually
  twice (sourcing agent + accuracy QA) against the known Elzevir
  tree mark. Provenance is documented, not laundered.
- ScienceDirect's rendered asset is the favicon SD monogram, not the
  wordmark: the horizontal wordmark is 162px wide at 20px tall and
  cannot fit a 90px tile (at 66px wide it would be 8px tall and
  illegible). The monogram is genuine and sharp (32px downscaled to
  20px), but it identifies ScienceDirect only in context (card
  label, neighboring wordmarks, alt text). The full wordmark file
  stays on disk unrendered as provenance.
- No logo was redrawn, traced, or typeset. No text fallback exists
  anywhere in LogoTiles.

## QA reconciliation

- Accuracy QA (02): PASS, no blocking gaps. All four wordmarks
  verified as real brand artwork; framing search-tools only;
  PhotoCard removal complete; FAERS homepage rule intact (masked
  check: 8 hits, all pre-existing Hero.tsx animation math, 0 in
  hero-v8 files). Note: doc 02 predates the SD icon swap, so it does
  not cover sciencedirect-icon.png; the icon's provenance is in
  docs/logo-sources.md and was verified visually by the sourcing
  agent, the restyle agent, and final QA.
- Motion/a11y QA (03): PASS, no blocking gaps (alt texts, static
  tiles, pointer-dead layer, 3-item mobile stack fits 320px,
  reduced-motion gating unchanged, banned code 0).
- Visual QA (04): FAIL with two blocking gaps. G2 (grid 2+1+1, not
  2x2) fixed by the SD icon + fixed 90px tiles. G1 (card 233-257px
  tall, top edge intruding 43-67px into the giant word glyphs on
  700px stages) narrowed by the grid fix (card about 211px) and
  then by parent fix F1 below. G3 (row-1 slack 0.3px) fixed by 10px
  horizontal tile padding + fixed widths. G4 (doc 01 tile treatment
  missing) fixed by tilts, alternating shadows, radius 8px. G5
  (stale Hero comment) fixed by the parent.
- Final QA (05): FAIL carried-narrowed. All its own checks passed
  (import contract, tsc, greps, FAERS, reduced-motion); the FAIL was
  carried from visual QA G1, narrowed to "re-verification of G1
  owed". Its missing-list item 2 (icon provenance in
  docs/logo-sources.md) was already satisfied when checked by the
  parent (entry at line 66); the item is closed, not outstanding.
- Re-QA (06): FAIL, one blocking gap narrowed. Grid, legibility,
  mobile, import contract, tsc, greps, FAERS all PASS. Remaining:
  G1, with corrected calibration: the true card range after the grid
  fix is 187-211px (not 183-207px), and the consistent bar for zero
  static clearance at stage 700 is 190px, not 207px. Realistic
  wrapped model gave 211px, intruding about 21px statically.
- Parent fix F1 (applied after 06, no new QA round): tile vertical
  padding 10px to 6px and tile heights 44/40px to 36/32px (saves
  16px across two rows), label and tile-row margins 12px to 8px
  (saves 8px). Modeled wrapped card height is now about 187px
  (card padding 30 + label 32 + tile block 80 + tile margin 8 +
  footer 24 + accent bar 13), giving about 3px static clearance at
  stage 700. Art breathing room: 20px art in a 32px tile leaves
  5px to the border (same 1px-into-padding pattern the 40px tiles
  already used), so no visible overflow.

## What was NOT chosen

- Visual QA's alternative F2 (hide the dbstack item below about
  1000px viewport height) was NOT applied: it would remove the
  flagship dark card on most laptops, and both visual QA and final
  QA flagged it as needing an explicit parent decision. It stays
  available if the live preview shows the thin clearance failing.
- Art was NOT shrunk below 20px tall (legibility failure) and the
  horizontal ScienceDirect wordmark was NOT forced into 66px (8px
  tall, illegible).

## Accepted limitations (live preview still owed)

- Static glyph clearance after F1 is modeled at about 3px on a
  700px stage: thin. Font metrics shift card height, so the live
  render is the real verdict. Float/parallax peaks may transiently
  graze glyph bottoms on 700px stages, and stages below about
  750px still tuck (same class of limitation accepted in v7/v8 for
  short stages, but this card is dark, so overlapped glyph pixels
  vanish rather than showing through).
- The SD monogram's recognizability in real collage context is
  unconfirmed until the Netlify preview.
- As in every round, localhost preview is blocked from the sandbox;
  the owed live checks are: desktop at a common laptop height,
  short stages, the mobile stack, and the SD icon in context.
