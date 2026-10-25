# 10 - Fixer 3: reduced-motion H-bands (desktop-parks round)

Shipped lanes verified in place before starting (git diff): FAERS laptop
(0.85, 0.04) + wide (0.90, 0.90), SS companion (0.55, 0.70) + base
(0.505, 0.70), miniature FAERS-Y pin 0.30. This edit touches ONLY the
H-band block. Not pushed (parent owns commit/push).

## Method (independent of fixers 1-2)

Analytic rest scan, not grid sampling: every box position is linear in W
(x) or S (y), so each pair's overlap region is exact interval
intersection. Static model: reduced-motion, float 0, tilted bboxes,
stage S = VH - 100, stage width W, grid W 1161-2560 x S 550-1300,
chip heights 21 AND 28. Glyphs on 02's wider envelope (W/2 ±490,
column-aware); label W/2 ±84.5. Pill sizes pinned from JSX (11px mono,
0.04em tracking, 5px 10px padding, 1px border): CFC 114x25, Seoul
184x25, FAERS 128x25. "Binding gap" = separation on the axis that
separates, where the other axis overlaps; doubly-separated pairs are
clear, period (a 0px min-axis value with 100px+ on the other axis is
not a graze).

## Rest scan: moved chips have ZERO rest parks

| Chip | Thinnest singly-separated rest gaps (h=21) | Parks |
|---|---|---|
| FAERS-lap | cochrane-lap1 124.3 (x), scopus-lap2 125.8 (x), pill-cfc-lap 234.5 (y), review-new 272.3 (x); glyphs/label clear | none |
| FAERS-wide | posterwindow 77.5 (y), elsevier-wide 102.0 (x), pill-cfc 110.0 (y), desk 223.7 (x); glyphs 128.3, label 342.3 | none |
| SS-comp | awards 39.9 (x) @1161x650, pubmed 64.8 (y), review-new 163.2 (y); glyphs 18.3, label 232.3 | none |
| SS-base | gutaxis 6.9 (x) @1401x650, desk 33.3 (x), pubmed 64.8 (y), search 140.7 (y); glyphs 18.3, label 232.3 | none |

Zero rest overlaps at h=21 AND h=28, vs every card, glyphs, label, and
pills. Two numbers differ from fixer 2 by tilt treatment only (mine
includes tilt, so conservative): SS-base gutaxis rest 6.9 vs fixer 2's
11.3 untilted; SS-comp awards rest 39.9 vs 41.0 untilted. Both clear.

## Decisions: H1, H2, H5 DELETED; H3, H4, H6 STAND

- H1 (FAERS/docking, 1161-1380 x VH<=803): DELETED. Scan confirms zero
  FAERS rest parks in the band, and everywhere else on desktop.
- H2 (FAERS/stickers, 1301-2190 x VH>=951): DELETED. Same confirmation.
- H5 (SS/search, 1401-1990 x VH<=846): DELETED. Same confirmation;
  gutaxis is drift-only (rest clear 6.9), so it does not block deletion.
- Deletion discipline kept: no band widened "for safety", no new band
  created. Remaining bands stay desktop-only, reduced-motion-scoped,
  `[data-chip]`, after the tablet block. Pill hide untouched.
- H3 (Seoul/awards, 1161-1400 x VH<=680): STANDS. Spot-check: rest
  park to VH 653 (h=21) / 679 (h=28); band 680 is hairline-positive
  over the h=28 edge. Selectors and source order confirmed.
- H4 (Seoul/posterwindow, 1401-1600 x VH<=708): STANDS, with a
  disclosed sensitivity. Spot-check: rest park to VH 710 at
  posterwindow height 357, so the band under-covers by 2px VH at
  <=1px depth (VH 709-710 only). But posterwindow height is uncertain
  (333 one-line vs 350 wrapped vs 357 in 01): at 350 the park ends VH
  698 (band over-covers), at 333 VH 669. No card moved, so no
  recompute per brief; QA should pin the true height by render. W
  bound matches (x-touching at exactly W=1600, band includes 1600).
- H6 (CFC/gutaxis, 1401+ x VH<=824): STANDS. Spot-check: rest park to
  VH 823 (h=21, the true height) / 849 (h=28 sensitivity); band 824 is
  hairline-positive over the h=21 edge (0.7px). No card moved.
  Sensitivity: if chips render at 28px, a <=7px static graze shows at
  VH 825-848 (same class as the float-bob caveat, carried forward:
  Seoul-awards to ~VH 703, CFC-gutaxis to ~VH 861).

## Chip-chip static gaps (h=21, rest)

SS-comp vs CFC 44.3 (x) @1161x650; SS-base vs CFC 41.2 (x) @1401x650;
SS-comp vs Seoul-lap 65.1 (x); SS-base vs Seoul-base 304.3 (x); CFC vs
Seoul-base 461.5 (x); CFC vs Seoul-lap 225.4 (x). Every other pair
(including FAERS vs SS in both bands) is doubly separated throughout.
ZERO chip-chip rest overlaps at h=21 and h=28. No chip-chip overlap
needs its own hide or anchor fix.

## NEW pre-existing finding (not caused by this round, not fixed here)

Seoul-base chip vs CFC PILL rest overlap, W 1401-1900 x all S (up to
~26px wide, 2.8-6.5px deep; pills render after chips, so the pill paints
above the chip corner). Both elements unmoved since long before this
round; no prior scan covered chip-vs-pill pairs. No H-band covers
chip-vs-pill, and hiding the Seoul chip across W 1401-1900 at all
heights would be a large behavioral change needing a parent decision
(pill move, chip move, or new band). Reported, not silently covered,
not fixed here.

## Diff (src/sections/Hero.tsx only)

1. Comment block above the bands rewritten (remaining bands + deletion
   rationale + carried caveats).
2. H1 block deleted (1161-1380 x max-height 803, FAERS).
3. H2 block deleted (1301-2190 x min-height 951, FAERS).
4. H5 block deleted (1401-1990 x max-height 846, StrokeSense).
5. H3, H4, H6 blocks byte-identical. No lane, tablet, miniature, pill,
   gate, duration, or radius value touched.

Build: PASS (9.93s). Em dash in diff: 0.

## Handoff for QA (thin margins carried forward)

- SS base vs CFC chip-chip worst 1.2px drift clearance (fixer 2
  correction; rest 41.2) - must be explicitly accepted, not 21.2px.
- SS companion awards worst 11.9px tilt-inclusive (fixer 2); rest 39.9
  mine / 41.0 fixer 2.
- SS-gutaxis drift transient zone W 1401-1483 x S 550-818 (rest clear
  6.9 tilt-inclusive) - structural, needs a card move to fix.
- FAERS wide converge residuals, hover-only (fixer 1): CFC pill W<1996
  x S 591-896; Seoul chip W 1705-2445 x S<786; posterwindow W<1862 x
  S 550-571. Drift is fully clean; converge is not.
- New items from this fix: Seoul-chip vs CFC-pill rest park above
  (parent decision needed); H4 edge sensitivity (pin posterwindow
  height by render); H6 h=28 sensitivity (VH 825-848 graze if chips
  render at 28px).
