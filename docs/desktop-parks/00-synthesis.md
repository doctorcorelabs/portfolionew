# Desktop-parks synthesis: fixer-ready package

Base HEAD `15c3ed9`. Sources: 01-07 plus Hero.tsx (CURSOR_CHIPS ~98, TABLET_ANCHORS ~133, MINI ~172, loop companions ~624/633, chipBaseAnchor ~869, CSS companions ~1393/1453).

## Verdict (read first)

- SS package (05) ADOPTED as-is: base (0.505, 0.70), companion (0.55, 0.70), NEW anchorX companion, anchorY companion DELETED.
- FAERS: NEITHER 04 option ships as-is. 04's laptop anchor (0.91, 0.75), shared by primary and split, REST-PARKS on the bottom-right poster at 1161-1400 for S < 978 (§2). ADOPT split structure: wide (0.37, 0.35) kept, laptop anchor RE-SEARCHED (seed: top-right strip).
- Miniature FAERS-Y pin to 0.30 is REQUIRED (§5).

## 1. D1: SS-glyph rest park refuted

01 proves the code-correct SS chip range is right-anchored [0.55W-116, 0.55W], not left-anchored [0.55W, 0.55W+116]. The claimed 'l'-stem REST park (336 ink px, 34.3px deep) therefore does not exist. True contact of the 0.45 companion: x-height ink only, worst-phase only, up to 13.8px deep at VH 650, zero at VH 926, 50%/7.0s at 1161x650; rest clears x-height by 0.2px under 01's narrow render but grazes ~3.8px under 02's wider envelope (dot top S/2-49.3 vs S/2-43.3). Governing rule: lanes must clear 02's wider envelope (W/2 ±490).

What changes: the companion fix is judged on x-height clearance, not stem clearance; the 0.45 lane still moves (worst-phase contact exceeds the transient budget). What does NOT change: the SS base fix (search rest park 104-110px continuous at VH <= 800, label rest park 116x14.4 at VH 820-1028, both reproduced by 01 and found by 05); the companion destination (0.70, below baseline); all other parks, H-bands, miniature/tablet scope.

## 2. FAERS: primary invalid, split structure adopted with laptop re-search

Poster proof (source plus 03, against 04): poster is right 2.5% inline, CSS-overridden to bottom 2% at 1161-1400. At W=1300, S=700 the poster box is (1008,482)-(1268,686); the FAERS (0.91,0.75) chip is (1110,525)-(1183,546), fully inside. At W=1161, S=550: chip (983,412)-(1056,433) inside poster (872,335)-(1132,539). Rest park, full chip, for all S < 978 (VH < 1078) at 1161-1400. 04's "poster (y-clear)" matches the PRE-rearrangement top-right poster (stale geometry).

Consequence: primary REJECTED; split laptop half REJECTED. Split wide half (0.37, 0.35) KEPT: poster hidden above 1400; drift-clean plus converge-clean per 04.

Split-wide thin margins: label worst 3.0px (1401x702), rest 2.3px (1401x800); glyphs box-worst 4.2px (1401x550); helix worst x-clear 12.6px (1401). Caveat: 04's glyph margin is a BOX margin under 01's narrower envelope; under 02's wider envelope the box margin goes negative, but pixel-true column-aware it clears. QA must verify pixel-true, not box margins.

04 corrections: 0.26 parks on helix at EVERY width, S 651-891; mid-right pocket (0.59-0.66, 0.33-0.35) is dead at laptop (Seoul pill, all 84 grid points, 16-19px).

Laptop re-search (fixer task). Must clear docking, helix, review-new, poster, awards, CFC pill (bottom 45%), Seoul pill (59%/32%), Seoul chip (0.70/0.695), glyphs, label, rest+worst, 1161-1400 x S 550-1300. First seed (UNVERIFIED): top-right strip (0.85, 0.04). Top strip right is empty at laptop (poster/awards bottom, pills/chips mid-lower, tiles only at 62%); converge path runs vertically to the word top edge clear of tiles/review. Do not retry the far-right gutter (24.5px gap vs 113px needed) or below poster (anchorY above 0.98 impossible).

## 3. SS package confirmed against 01

- Base (0.505, 0.70): fixes search rest park, label rest park (01 park 4), review-old drift contact (all y-clear). Converge bottom edge, clear of glyphs; converged gutaxis 6.95px.
- Companion (0.55, 0.70): fixes 0.45 x-height contact (0.70S below baseline; worst glyph 4.3px at S=550); review-new y-clear; awards 12.9px, Seoul pill 26.4px, Seoul chip 25.2px (worst, W=1161).
- Residual (structural, NOT fixed by anchors): SS-gutaxis transient, W 1401-1483 x S < 818, max 21px at W=1401/S=550, tapering to 0 at zone edges. Cause: gutaxis-right to desk-left gap is 158px at W=1401 but a drifting chip needs 172px (116+40+16), so no anchorX clears both cards in x there while both overlap SS in y. Fix needs a card move or a width-plus-height companion (both out of scope). Trade accepted: replaces a 104px continuous search park plus a label rest park.
- Thin margins (all positive, re-verify pixel-true): glyphs 4.3px (both lanes, S=550); desk 5.3px (base, W=1401); CFC chip-chip 4.25px (companion, W=1161; the same ~4.3px pair appears in 01's old-anchor table, so the SS-CFC pair is tight at narrow widths under any lane set). Flip fragility: base anchorX 0.505 sits 0.005 above the 0.5 flip; future tweaks must not cross 0.5 (a=0.51 trades desk 5.3px to ~0px).

## 4. Cross-package checks (not jointly verified before)

- FAERS-wide vs SS-base chip-chip: CLEAR. x-hairline 0.1px rest at W=1401 is immaterial: y-separated by 171.5px at S=550, growing with S. For the record, rejected (0.91,0.75) vs SS-companion also clears (x 345px rest at W=1161).
- FAERS-laptop (TBD) vs SS-companion chip-chip: fixer must verify; the seed clears by 275px-plus in x.
- FAERS vs Seoul chip/pill, CFC pill in DRIFT: wide clears all by 169px-plus (y) / 235px-plus (x). Laptop: fixer verifies for the new anchor (Seoul pill 59%/32%, CFC pill bottom 45% bind).
- FAERS vs stickers (old H2 rest park, W 1301-2190 x VH >= 951): CLEARED by every new lane in x. Stickers sit left; FAERS-wide x starts 0.37W (gap 120px rest at W=1401, 80px worst). H2 deletable if the rest scan confirms zero FAERS rest parks; else H2 stays with recomputed bounds.

## 5. Implementation spec

JS (src/sections/Hero.tsx):

| Change | From | To |
|---|---|---|
| CURSOR_CHIPS FAERS | (0.195, 0.30) | base (0.37,0.35); laptop TBD (loop+CSS) |
| CURSOR_CHIPS StrokeSense | (0.55, 0.33) | (0.505, 0.70) |
| Loop effAnchorX | Seoul-only laptop branch | ADD SS+laptopMql→0.55; FAERS+laptopMql→laptopX TBD |
| Loop effAnchorY | SS+laptopMql→0.45 | DELETE SS branch (plain chip.anchorY); ADD FAERS+laptopMql→laptopY TBD |
| MINI_CURSOR_CHIPS anchorY | SS→0.34, else chip.anchorY | SS→0.34, FAERS→0.30 (PIN), else chip.anchorY |
| chipBaseAnchor | - | UNCHANGED (desktop returns chip; companions in loop+CSS) |
| Labels, order, radii, durations, phases | - | UNCHANGED |

CSS (same file, 1161-1400 block):

| Change | Rule |
|---|---|
| DELETE | .mv-diorama-chip[data-chip="StrokeSense"] { top: 45% !important; } |
| ADD | .mv-diorama-chip[data-chip="StrokeSense"] { right: 45% !important; } (mirrors Seoul right 30%) |
| ADD | .mv-diorama-chip[data-chip="FAERS"] laptop rule for TBD anchor (left/right % plus top %) |
| UNCHANGED | Seoul right 30%, CFC pill bottom 45% |

REQUIRED miniature pin: MINI_CURSOR_CHIPS overrides FAERS anchorX (0.26) and SS fully (0.60/0.34) but NOT FAERS anchorY (07). Both new FAERS anchors differ from 0.30, so without the pin the miniature FAERS chip moves vertically and no H-band can hide it (mini chips carry no data-chip). Pin FAERS-Y to 0.30 in the same edit, then re-verify miniature FAERS pairs.

## 6. H-bands

- H1 (FAERS/docking) plus H2 (FAERS/stickers): RECOMPUTE for the new FAERS lanes. DELETE each if the rest-park scan (W 1161-2560 x VH 650-1300, tilted bboxes, float 0, ±1px boundaries) shows zero FAERS rest parks; else REPLACE with exact new bounds.
- H5 (SS/search): DELETABLE after the rest-park scan confirms zero SS rest parks (gutaxis is drift-only).
- H3/H4/H6 (Seoul awards/posterwindow, CFC gutaxis): STAND, spot-check only (Seoul/CFC unmoved, no card moves). H6's CFC-gutaxis park is real, NOT fixed here.
- No new H-bands if the rest scan confirms zero rest parks for both moved chips. Chip-chip static gaps are not covered by any H-band: compute them for the shipped lanes; any overlap needs its own hide or an anchor fix.

## 7. Out-of-scope residuals (disclose, do not fix this round)

- CFC vs gutaxis rest park above 1400 (W >= 1401 x VH 650-824, up to 130x21, H6) - needs a CFC lane move.
- Seoul vs posterwindow rest park (W 1401-1600 x VH 650-710, up to 34x21, H4) - needs a Seoul lane move.
- SS-gutaxis transient (section 3) - needs a card move or width-plus-height companion.
- Seoul vs awards worst transient (to VH ~736, up to 21px deep; rest hairline below VH ~653, H3).
- FAERS laptop converge: TBD with the new laptop anchor (wide converge is clean under split-wide).
- Thin margins (§2, §3): glyph 4.3px, desk 5.3px, CFC chip-chip 4.25px, split-wide label 3.0px worst / 2.3px rest, helix 12.6px, awards 12.9px - all positive, all need QA pixel-true re-verification.

## Recommended package (fixer implements exactly this)

| Chip | Band | Anchor | Mechanism |
|---|---|---|---|
| FAERS | above 1400 | (0.37, 0.35) | CURSOR_CHIPS base |
| FAERS | 1161-1400 | TBD, fixer search (seed ~0.85/0.04) | NEW laptop companion (JS+CSS) |
| StrokeSense | above 1400 | (0.505, 0.70) | CURSOR_CHIPS base |
| StrokeSense | 1161-1400 | (0.55, 0.70) | NEW anchorX companion (JS+CSS right 45%); anchorY DELETED |
| Miniature | below 720 | FAERS-Y pinned 0.30; other overrides unchanged | MINI_CURSOR_CHIPS pin (REQUIRED) |
| H-bands | desktop | H1/H2 recompute-or-delete; H5 delete after scan; H3/H4/H6 stand | Section 6 |

Fixer order (sequential, one shared file): 1. FAERS (laptop search, wide, miniature pin), 2. SS (base, companion, deletions), 3. H-band (rest scan, H1/H2/H5 actions, H3/H4/H6 spot-check). Then QA (layout-desktop, layout-regression, motion) in parallel, then integration.
