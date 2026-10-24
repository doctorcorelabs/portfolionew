# v9 Final QA - Real Database Logos

## Verdict: FAIL (carried, narrowed) - G1 re-verification outstanding

No code defect of mine blocks shipping, and every check in my own scope
passes. The FAIL is carried from visual QA (doc 04), but NARROWED by a
late fix that landed during this check: at 13:32 a sibling edit
implemented visual QA's preferred fix (compact ScienceDirect icon plus
a true 2x2 grid). That resolves G2 outright. What remains is G1
re-verification: no re-QA has signed off the new 2-row card geometry,
and no live browser check is possible from the sandbox, so the glyph
clearance of the new card is plausible but unproven. Everything else
is green: accuracy PASS, motion/a11y PASS, tsc clean, all greps clean,
FAERS clean, import contract clean, PhotoCard removal clean.

## Late fix at 13:32 (during this check window)

`LogoTiles.tsx` was rewritten (3543 to 4349 bytes) after this QA's
first verification pass:

- ScienceDirect now renders `public/logos/sciencedirect-icon.png`
  (32x32, 504 bytes, valid PNG, viewed: orange SD monogram) instead
  of the 162px-wide horizontal wordmark.
- Tiles are now fixed 90px wide, so 90 + 8 + 90 = 188px inner width:
  a true 2x2 grid. Art stays 20px tall, capped at 66px wide, with
  object-fit contain.
- The G3/G4 treatment from the 13:28/13:29 edits is kept (padding
  10px, per-tile tilts, alternating shadows/heights, radius 8px,
  mobile zero override).

Effect on visual QA's gaps: G2 is FIXED in the tree (the grid is
2x2; the empty row-2 slot is gone). G1's structural cause (the
third tile row, about 50px of card height) is REMOVED, which by
visual QA's own estimate returns the card to about 183-207px tall.
What is NOT proven: whether that height clears the glyph band at
common laptop heights under real font metrics. Visual QA's
clearance range for the fixed card ("about 7-17px static at stage
700") and its height range (183-207px) do not pin down the worst
font-metric case, where both the label and the footer wrap to two
lines; a 207px card at bottom 5% of a 700px stage may still intrude
on the order of 17px statically, more at float/parallax peaks, and
on a dark card any intrusion is illegible (the reason G1 was
blocking). This QA models geometry from code only and cannot
resolve that residual; it needs a targeted visual re-check or a
live-browser look.

## Missing list

1. **G1 re-verification (blocking until signed off).** Targeted
   visual re-QA of the new 2-row DbStackCard geometry at 1440x700
   and 1440x550 (or a live-browser look at those heights):
   confirm the card top clears the glyph bottom statically, and
   note worst-case float/parallax-peak intrusion. If re-QA still
   finds material intrusion, the remaining options are further
   height reduction or visual QA's inferior alternative (hide the
   dbstack item below about viewport 1000px, shown on tall
   desktops and in the mobile stack), which needs the parent's
   explicit call and must not be chosen silently.
2. **Icon provenance line (non-blocking, recommended).** The
   ScienceDirect icon's provenance lives only in a LogoTiles code
   comment ("compact official SD icon, verified visually"). It is
   not in `docs/logo-sources.md` and postdates accuracy QA (02),
   so no QA has signed off its source. Add one provenance entry
   to logo-sources.md (source URL, verification note) for the
   record. This does not block shipping: the file exists, is a
   valid 32x32 PNG, renders as an orange SD monogram, and the tile
   hides itself on load failure rather than showing a broken
   image.
3. **Live-browser confirmation (standing caveat, not a code gap).**
   The sandbox blocks localhost preview, so glyph clearance and
   the new 2x2 grid's feel still need one real-browser look.

## Sibling QA reconciliation

- **Accuracy QA (02): PASS, no blocking gaps.** All four wordmark
  logos verified as real brand artwork, LogoTiles renders only
  real logo images with contain (no stretch, no crop), DbStackCard
  framing search-tools only, PhotoCard removal complete,
  logo-sources.md provenance verified, FAERS homepage rule kept.
  NOTE: doc 02 predates the 13:32 icon swap, so it does not cover
  sciencedirect-icon.png (see missing list item 2).
- **Motion/a11y QA (03): PASS, with minor gaps (none blocking).**
  Logo images (meaningful alts, contain fit, explicit height),
  tiles static, pointer-dead layer, mobile stack readable at 320px,
  reduced-motion gating unchanged, banned code 0, tsc clean.
- **Visual QA (04): FAIL, G1 + G2 blocking (as written).** Its
  non-blocking gaps are FIXED in the current tree by the late
  edits (verified by the parent, not just claimed):
  - G3 (row-1 fragile 0.3px fit): FIXED. Tile padding is now
    10px 10px (was 12px), giving about 8px of slack.
  - G4 (missing "more interesting" treatment): FIXED. Per-tile
    static tilts (-2, +1, -1, +2 degrees), alternating shadows
    (PubMed and Scopus lifted, Elsevier and ScienceDirect soft),
    alternating tile heights (44/40/44/40px), radius 8px, mobile
    zero override below 719px.
  - G5 (stale header comment): FIXED. Hero comment now reads
    15 items, 8 v7 cards, 7 v8 mockups, no chip row.
  - G2 (2+1+1 grid): FIXED by the 13:32 edit (true 2x2 grid, icon
    for ScienceDirect). This narrows, but does not by itself
    close, G1 (see above).
  - G1 (glyph intrusion): STRUCTURAL CAUSE REMOVED, clearance
    UNVERIFIED (see missing list item 1).

## Per-file table

| File | Verdict | Notes |
| --- | --- | --- |
| `src/sections/Hero.tsx` | FAIL (carried, narrowed) | All own checks pass (imports, greps, reduced-motion, parallax gate). FAIL carried because this file owns the dbstack position (right 22%, bottom 5%) behind G1, and G1's clearance is unverified on the new card (see missing list item 1). PhotoCard import, item, and mobile-stack mention all removed; mobile stack is now exactly FaersCard, NotifyBubble, DbStackCard. Stale-comment fix (G5) verified in the current diff. |
| `src/components/hero-v8/LogoTiles.tsx` | PASS | Code is clean (tsc, greps, no animation, no claims, onError hides failed tiles, no text fallback). Implements the prescribed fix: true 2x2 grid (tiles 90px wide, 90 + 8 + 90 = 188px inner width), ScienceDirect via the compact icon, art 20px tall capped at 66px, per-tile tilts/shadows/heights, radius 8px, mobile zero override. G2 is fixed in this file. Default export `LogoTiles` is unused (DbStackCard uses named `LogoTile`); harmless unused export, not a dangling import. |
| `src/components/hero-v8/DbStackCard.tsx` | FAIL (carried, narrowed) | Code is clean and framing is search-tools only ("WHERE THE EVIDENCE IS SEARCHED" / "Search tools for systematic reviews"). FAIL carried narrowly: its rendered height on the new 2-row grid (about 183-207px by visual QA's estimate) still needs clearance re-verification at 1440x700/550 (see missing list item 1). Geometry otherwise unchanged from v8 (220px wide, same padding/radius/shadow/accent bar). |
| `public/logos/pubmed.png` | PASS | Real logo, viewed: blue "PubMed.gov" wordmark with open-book mark. 372x120 RGBA, 11 KB, valid PNG. Legible at 20px tall (62x20 art). Source per logo-sources.md: official NLM file via Wikimedia Commons. |
| `public/logos/elsevier.png` | PASS | Real logo, viewed: grey Elzevir tree mark ("Non Solus" banner) plus orange "ELSEVIER" wordmark. 664x202 RGBA, 56 KB, valid PNG. Legible at 20px tall (66x20 art). Transparent padding trimmed; colors/proportions unchanged. |
| `public/logos/scopus.png` | PASS | Real logo, viewed: orange "Scopus" wordmark with registered mark. 1000x321 RGBA, 25 KB, valid PNG. Legible at 20px tall (62x20 art). Rendered from the Commons vector with cairosvg. |
| `public/logos/sciencedirect.png` | PASS | Real logo, viewed: orange "ScienceDirect" wordmark with registered mark. 729x90 RGB on white, 38 KB, valid PNG. Legible at 20px tall (162x20 art) but too wide for a 90px tile, which is why it is no longer the rendered asset (see icon row). White baked background is invisible inside the white tile. Source: Elsevier's official ScienceDirect toolkit download. |
| `public/logos/sciencedirect-icon.png` | PASS with provenance caveat | The rendered ScienceDirect asset since the 13:32 edit. Valid PNG, 32x32, 504 bytes, viewed: orange SD monogram. Fits a 90px tile at 20px tall and stays legible, which is what makes the 2x2 grid possible. Caveat: provenance lives only in a LogoTiles code comment and postdates accuracy QA (02); see missing list item 2 for the recommended logo-sources.md entry. If this file 404s, its tile hides itself (onError) and the grid degrades to 3 tiles; no broken image ever shows. |

## Import contract: PASS

- `LogoTiles` is imported by `DbStackCard` (named import
  `{ LogoTile }` from `./LogoTiles`); all four brands render via
  `<LogoTile brand="..." />`. Import resolves.
- `DbStackCard` is imported and rendered by `Hero.tsx`
  (item `dbstack`, right 22%, bottom 5%, tilt card-d,
  hide-720-1400), so the logo tiles render on desktop above 1400px
  and in the mobile stack.
- `PhotoCard` has NO remaining imports or references anywhere in
  `src/` (grep 0): import removed from Hero.tsx, item removed from
  COLLAGE_ITEMS, component file deleted from
  `src/components/hero-collage/`, `public/hero-lab.jpg` deleted.
  No broken image remains. (The v7 PhotoCard file is gone; the
  remaining v7 photo cards MicroscopeCard and DeskCard are
  untouched.)
- `DbChips.tsx` is DELETED by design (git status `D`), and grep
  finds ZERO references to `DbChips` or `DbChip` anywhere in `src/`.
  No dangling import. No other orphan files: every other hero-v8
  import resolves, and every hero-v8 file is imported by Hero.tsx
  except `LogoTiles.tsx`'s unused default export (noted above).
- `npx tsc --noEmit`: clean, 0 errors for the whole tree
  (re-run on the current tree after the late edits).

## Greps (Hero.tsx plus all hero-v8 files)

- Em dash: 0. En dash in visible copy: 0.
- Forbidden patterns (marquee, scroll-lock, cursor none,
  scroll-snap, overscroll): 0.
- Endorsement/indexing wording in rendered text ("indexed in",
  "affiliated", "partner", "endorsed"): 0. The only hits are
  prohibitive code comments (DbStackCard's "must NEVER say..."
  comment and the trademark note in docs/logo-sources.md), never
  rendered copy.
- Invented names: 0. Reference copy: 0 ("Onlines" appears only in
  pre-existing Hero.tsx header comments attributing style, as in
  v7/v8).
- Stale references (chip row, "17 research", PhotoCard, hero-lab,
  DbChips): 0 in `src/`.

## FAERS check (counts only, masked contexts, values never printed)

Method: loaded `docs/faers-verified.json`, took rows with status !=
verified, checked their ror/ciLow/ciHigh as standalone numbers in
the new/changed source files (Hero.tsx plus all hero-v8 files).

- Unverified numeric tokens checked: 2 (both rows have null CI, so
  only their ROR tokens apply).
- Matches in new/changed sources: 8, ALL in pre-existing Hero.tsx
  code, 0 in any hero-v8 file. Masked contexts show only style/code
  literals: fade delays, cursor-chip config, parallax math,
  transition durations. No drug/outcome/CI structure, not a leak.
  Same verdict pattern as v7 and v8.
- Homepage rule kept: the only homepage FAERS figures remain
  N = 6,601 and the 7,519 to 6,601 flow (FaersCard) and N = 6,601
  (PosterWindow). No effect values, CI, p-values, or event-case
  counts in any v9 file.

## Reduced-motion: PASS

- Hero.tsx reduced-motion blocks set `animation: none` on
  `.mv-collage` (entrance) and `.mv-collage-float` (all float
  wrappers, old and new, since every collage item shares the class).
- Parallax JS gate unchanged: early return unless hover plus fine
  pointer, early return under `prefers-reduced-motion: reduce`,
  rAF-throttled, mouseleave reset, cleanup on unmount.
- LogoTiles tilts are static transforms (class-based rotate, with
  a max-width 719px override to 0deg), not animations; no hero-v8
  file animates on its own. LogoTiles' `useState` only hides a tile
  whose image fails to load, which is not motion.

## Stability

Combined md5 of Hero.tsx plus all hero-v8 files across checks:
`b7972b...` (pre-refinement), `0d63bac...` (twice, post-refinement
at 13:19/13:22), `ac47a61...` (twice, a few minutes apart, after the
13:28/13:29 G3/G4/G5 fixes), then a further change at 13:32 (the
2x2-grid plus icon fix). The tree changed three times during this
check window, so ALL final checks above (tsc, greps, FAERS,
reduced-motion, file reads, logo views) were re-run on the current
tree after the last change (13:32 edit: tsc clean, em dash 0,
icon file verified). One last md5 was taken after this doc was
written; if it differs from the check-time value, the parent
should re-verify before shipping, because a fourth change would
mean the tree moved again after this report.

## Outstanding (not code defects)

- Live-browser confirmation is still owed for every batch (the
  sandbox blocks localhost preview): the new 2-row card's glyph
  clearance and the 2x2 grid's feel still need one real-browser
  look (see missing list item 1).
- Parent decision required ONLY if re-QA still finds intrusion:
  further height reduction versus visual QA's hide-below-1000px
  alternative. Final QA makes no call here; it only records that
  the prescribed fix is in and its clearance is unverified.
- No build was run, per the brief. Code inspection only; no live
  browser check was possible.
