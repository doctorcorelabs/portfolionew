# FAERS desktop lane: new anchor search

## Verdict

A single anchor exists. (0.91, 0.75) clears docking, helix, review, label, glyphs, and every other desktop obstacle at rest and worst phase across the full desktop grid (W 1161-2560, VH 650-1300, stage S 550-1200), with no companion split needed for drift. Thinnest worst-phase clearance on any pair: 36px (glyphs, 1161x550). No near-home anchor works: the best near-home candidates are rest-clean at best and fail worst phase on helix. A split is offered only as a converge-clean alternative for wide band, not because drift needs it.

## Why home fails

The current (0.195, 0.30) parks on docking at W below about 1380 and S below about 703 (fixer 1 H1 band, reproduced exactly: rest depth 37.3px x at 1161x550, 27.9 at 1161x600, 0.4 at 1161x702, clear at 1161x750). At aY 0.30, the docking/helix x-window opens only above W about 1485: docking worst needs aX above 0.025 + 262.7/W, helix worst needs aX below 0.27 - 101/W, and the two cross at W about 1484. The y-threading window (below docking, below helix, above glyphs) opens only above S about 735. Between those two thresholds, no home-region anchor survives the full grid.

Best near-home on a 0.01 grid, laptop band: (0.20, 0.38) is rest-clean but hairline (thinnest rest 1.7px, glyphs, 1161x550; it flips to a glyph park at chip height 28) and fails worst phase on helix by 19.7px at 1161x651, over the 12px budget and the 16px tablet precedent. Best near-home, wide band: (0.35, 0.30) is rest-clean (thinnest rest 2.0px, helix, 1401x900) but fails worst phase on helix by 15.9px at 1401x651. Neither is recommendable as clean.

## The 0.26 trap, stated precisely

Miniature FAERS 0.26 works because the miniature freezes S = 600 (helix hidden: S at or below 650) and hides helix anyway. On desktop, 0.26 parks on helix at EVERY width for S 651-891 (VH 751-991): chip x 0.26W-0.26W+73 always overlaps helix x 0.27W-0.27W+100 (0.26W+73 above 0.27W whenever W below 7300), and chip y 0.30S overlaps helix y while S below 892. Rest depths reach 61.4px x (1161x651). So 0.26 is not a desktop candidate at any width, not just wide widths.

## Primary: (0.91, 0.75), single anchor, no split

Drift: 0 rest parks, 0 worst overlaps on the full grid, on a dense boundary sweep (W 1161/1300/1301/1400/1401/2000/2560 x S including 650/651/701/702/782/851/852/991, plus S step 25 at W 1161/1401/2000), in the classic-scrollbar case (stage W-15, bands keyed on viewport), and at chip height 28. No pair is close on both axes at any grid point. Binding obstacles, all clear: glyphs (x-clear, 36px worst at the narrow edge, growing with W); posterwindow (y-clear, chip below it, 60px worst at S = 550); poster (y-clear); awards (x-clear, chip right of awards); Seoul and CFC chips (x-clear); CFC pill (x-clear, 38px worst at W = 1161); pubmed (y-clear, chip above the bottom band); faers card, notify, FAERS pill (x-clear). Frame: chip left worst clears the frame right border by 4px at W = 1161 (no border tuck) and chip right stays inside section content by 7.5px (1129.5 vs content edge 1137 at W = 1161).

Cost, stated plainly: the chip sits in the empty far-right gutter between poster (top-right) and awards (bottom-right), far from the FAERS card (bottom-left). The constellation gains a right-edge cursor disconnected from its card. If that reads wrong visually, use the split below.

Converge (hover-only, disclosed, not clean): laptop band converge-clean (0 parks). Wide band converge parks on the Seoul chip (up to 18.8px, 20 grid points) and the CFC pill (up to 21.2px, 18 grid points), because a far-right anchor converges to the word rect bottom-right corner, which the wide Seoul chip (0.80W) and wide CFC pill (bottom 30%) both approach. Zone on grid points W 1401-1800 x S 550-800 (Seoul chip to 1800/702, CFC pill to 1600/800). This is still better than the current anchor's converge (15 parks: docking up to 23.2px at short/narrow, helix up to 29.3px at wide/mid), but it is NOT converge-clean. Fixing converge needs a pill or chip move, out of this lane's scope. Do not ship the primary as converge-clean.

## Split alternative (only if converge-clean wide matters)

Laptop: (0.91, 0.75) unchanged. Laptop has no other clean region once pills are modeled (see below). Wide: (0.37, 0.35). Drift-clean (0 parks, 0 worst) AND converge-clean (0 parks) at wide band. Margins are tight, all at W = 1401: helix worst x-clear 12.6px, StrokeSense chip-chip worst x-clear 23.2px, label worst 3.0px (y, 1401x702) and rest 2.3px (y, 1401x800), glyphs worst 4.2px (y, 1401x550), search worst y-clear 34.5px (S = 550). Scrollbar-safe (0/0 at viewport 1401, stage 1386). Cost: one companion branch for FAERS (laptopMql pattern, same as Seoul 0.70 and StrokeSense 0.45), and the chip jumps from 0.91W to 0.37W across the 1400/1401 boundary (same class as existing companion jumps; static per window, no live animation).

Variant: (0.37, 0.36) buys label room (rest 10.3px) for a 1.3px glyph worst transient at S = 550 only, all widths (inside budget, disclosed), converge still clean. Pick only if the label hairline worries QA more than the glyph hairline.

## Rejected, so the fixer does not retry them

- Mid-right pocket (0.59-0.66, 0.33-0.35) laptop: looks clean until pills are modeled, then parks on the Seoul pill (left 59%, top 32%) at all 84 laptop grid points, depth 16-19px. The pill sits exactly in that pocket. Dead.
- Far-left wide (0.03-0.13, 0.42-0.55): drift-clean with huge margins (rest 57.6px, worst 35.6px at 0.08, 0.48) but converge parks on glyphs at every grid point (16.6px): a far-left anchor converges to the word left edge, which sits inside the glyph band. Dead for converge; usable only if converge is waived.
- Far-left at laptop: dead on drift (microscope plus stickers plus notify triple bind at 1301-1400, S above 700/850/781; e.g. aY 0.42 parks microscope at 1301-1400 tall, aY 0.75 parks the faers card at S 781-874).

## Model

Chip 73x21 (QA-layout JSX sizes; height 28 sensitivity run: primary unchanged, near-home (0.20, 0.38) flips to a glyph park). Drift rx20/ry14, parallax 8, float up 8 direction-correct (card above chip: float moves away, 0 penalty; card below: 16 toward). Chip-chip worst 40/28 (both drift). Pills float-only, no parallax. Tilt expansion by rotation formula (docking 3deg, review 2deg, and so on). Visibility gates exactly as shipped: helix S above 650; microscope/cochrane/stickers only 1301-1400 above S 700/701/850; search/posterwindow only above 1400; poster/awards/desk/gutaxis/elsevier/scopus only at or below 1400; notify S above 781; FAERS pill S above 990; review 36%/2% at or below 1400 else right 29%/3%; companions Seoul 0.70 and StrokeSense 0.45 only 1161-1400. Posterwindow height 270 derived from component parts (chrome 39 plus body 230 plus borders); plus or minus 30px changes no verdict (posterwindow margins 45px or more at S = 550). Pill boxes estimated 150x30 (same as FAERS pill); Seoul pill width uncertainty plus or minus 20px flips neither the mid-right verdict (park depth 16-19px) nor the primary (x-gaps 38px or more). Converge model: center clamped to h1 box plus 20px expansion; center inside rect pushed to nearest edge; other chips and pills held at drift positions except where noted (simultaneous-converge check for the Seoul chip confirms the park: both chips end on the bottom edge 74px apart in center-x vs 91px needed).

## Candidate table (fixer-ready)

| Option | Band | anchorX | anchorY | Drift (rest parks / worst overlaps) | Converge | Thinnest margins |
|---|---|---|---|---|---|---|
| PRIMARY single | all desktop | 0.91 | 0.75 | 0 / 0 | laptop clean; wide parks Seoul chip up to 18.8px, CFC pill up to 21.2px (hover-only) | worst clearance 36px (glyphs, 1161x550) |
| SPLIT laptop | 1161-1400 | 0.91 | 0.75 | 0 / 0 | clean | same as primary at laptop |
| SPLIT wide | above 1400 | 0.37 | 0.35 | 0 / 0 | clean | worst 3.0px label (1401x702), 4.2px glyphs (1401x550), 12.6px helix x (1401) |
| SPLIT wide variant | above 1400 | 0.37 | 0.36 | 0 parks / glyph worst 1.3px at S = 550 only | clean | label rest 10.3px; glyph worst 1.3px (S = 550) |
