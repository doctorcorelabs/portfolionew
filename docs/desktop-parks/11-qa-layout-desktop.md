# 11 - QA layout desktop (desktop-parks round)

Verdict: **CONDITIONAL SHIP** (conditions §7, all disclosure-only, no code change).
Method: independent model from 02/03 formulas + pill JSX, not fixer numbers.
Grid W 1161-2560 x S 550-1300. Rest = tilted boxes; worst = rest - drift
(20/14, 40/28 chip-chip) - parallax 8 (cards) - float (8 cards / 10 pills,
y only, toward chip). Glyphs/label: drift only. Glyphs pixel-true
column-aware (02 envelope W/2 ±490). Doubly-separated pairs are clear,
never grazes. Lanes confirmed in code: FAERS (0.90, 0.90) / laptop
(0.85, 0.04); SS (0.505, 0.70) / companion (0.55, 0.70); JS == CSS companions.

Heights: chips measure ~28px, not 21px (11px mono line box 16 + padding 10
+ border 2; arrow is 17). All verdicts hold at h=28 (rest scan re-run, zero
parks). Worst margins at h=21 except where noted; h=28 changes only
y-above pairs (-7px, still clear) and extends the gutaxis zone to S~844
(already disclosed).

## 1. FAERS laptop (0.85, 0.04): CLEAN

0 drift problems, 0 converge endpoint problems (converge = top-edge band;
only the frame-border straddle, accepted tuck). Poster confirmed
BOTTOM-RIGHT at 1161-1400.

| Pair (binding axis) | Fixer 1 | QA (mine) | Status |
|---|---|---|---|
| CFC pill y | 205.5 | 210.5 (pill 25) / 207.5 (pill 28 measured) | REFUTED exact, ACCEPTED (>200) |
| Poster y | 259.7 | 259.7 | REPRODUCED exactly |
| Seoul pill x (double, y 109) | 24.9 | 24.9 | REPRODUCED exactly |
| Glyphs y | - | 190.7 / 176.7 | Clear |

The 5px CFC-pill delta is a pill-height assumption (fixer 1: 30px, mine:
25px, font metrics: 28px). Immaterial.

## 2. FAERS wide (0.90, 0.90): DRIFT CLEAN

0 drift problems. Two corrections, neither blocking:

| Pair (binding axis) | Fixer 1 | QA (mine) | Status |
|---|---|---|---|
| Elsevier x | 74.0 | 74.0 | REPRODUCED exactly |
| Posterwindow y | 79.5 worst | 79.5 rest / 57.5 worst at measured H=355 | CORRECTED (see below) |
| CFC pill y | 96.0 | 96.0 | REPRODUCED (y-axis; x 0.2 is doubly-separated, NOT a margin) |
| Glyphs | - | Double (x 1.4, y 128.3) | Clear, NOT a margin |

Posterwindow correction: fixer 1's 79.5 was worst at H=333. Measured render
(title 3 lines, meta 2 lines, PIL on shipped fonts) gives H=355, so rest =
79.5, worst = 57.5. Thinner but clear.

Refutations (neither shipped): synthesis (0.37, 0.35) REST-PARKS inside
search at all wide widths for S<700 (untilted) / S<707 (tilted); at 1401x650
the chip sits fully inside search. 04's (0.91, 0.75) REST-PARKS inside the
bottom-right poster (fully inside at 1300x700 and 1161x550).

## 3. SS base (0.505, 0.70): OLD PARKS GONE

| Pair | Fixer 2 | QA (mine) | Status |
|---|---|---|---|
| Search y | 143.0 / 126.7 | 140.7 / 118.7 (tilted rest, parallax-inclusive worst) | GONE (convention diff.) |
| Label y | 232.3 / 218.3 | 232.3 / 218.3 | EXACT; rest park GONE |
| Review-old x | 67.2 / 35.7 | 63.7 / 35.7 (tilted rest) | Worst EXACT; drift contact GONE |
| Glyphs y | 18.3 / 4.3 | 18.3 / 4.3 | REPRODUCED exactly |
| Desk x | 35.0 / 5.3 | 33.3 / 5.3 (tilted rest) | Worst EXACT |
| Posterwindow x | 378.5 / 350.5 | 378.5 / 350.5 | REPRODUCED exactly |

SS-gutaxis transient CONFIRMED, not worsened: W 1401-1483.5 x S 550-818.1
(to ~844 at h=28), max 21.0px, rest clear (6.9px at 1401x650). Same as 05.

## 4. SS companion (0.55, 0.70): ZERO REST, ZERO WORST

| Pair | Fixer 2 | QA (mine) | Status |
|---|---|---|---|
| Glyphs y | 18.3 / 4.3 | 18.3 / 4.3 | EXACT; old contact GONE |
| CFC chip x | 44.3 / 4.3 | 44.3 / 4.3 | REPRODUCED exactly |
| Awards x | 41.0 / 11.9 | 39.9 / 11.9 (tilted rest) | Worst EXACT |
| Seoul pill x | 46.4 / 26.4 | 46.4 / 26.4 | REPRODUCED exactly |
| Seoul chip x | 65.1 / 25.1 | 65.1 / 25.1 | REPRODUCED exactly |
| Review-new y | 167.0 / 149.2 | 163.2 / 141.2 (tilted rest, parallax-inclusive worst) | Convention diff., both clear |

## 5. Thin margins: explicit accept/reject

- SS base vs CFC chip-chip worst 1.2px: ACCEPT. Positive, rest 41.2, fleeting dart alignment (~51s cycle). Replaces a
  104px park. Caveat: font-dependent widths; ~2px wider CFC chip erases
  it, but transient-only, never a rest park.
- SS companion awards worst 11.9px: ACCEPT. Tilt-inclusive, comfortable.
- SS glyphs worst 4.3px at S=550: ACCEPT. Pixel-true, grows with S; rest 18.3.
- SS desk worst 5.3px at W=1401: ACCEPT. Tilt-inclusive, grows with W; rest 33.3.
- FAERS-wide posterwindow worst 57.5px (corrected): ACCEPT.
- FAERS-wide CFC-pill "0.2" and glyphs "1.4": REJECTED as margins.
  Both doubly-separated (other axis 96 / 128.3px). Clear, not thin.

## 6. H-bands: deletions CORRECT, H3/H4/H6 standing

H1, H2, H5 deleted (verified: no reduced-motion FAERS/StrokeSense hide
rule remains; surviving 951px rules are tablet stickers shows).
Deletion CORRECT: rest scans show zero rest parks for all four lanes at
h=21 AND h=28. H3/H4/H6 byte-identical to base and standing.

- H4: at measured posterwindow height 355, the Seoul/posterwindow park
  ends at VH~707, inside the VH<=708 band: COVERED. The 357px case (2px
  miss at <=1px depth) sits above the measured height. Does not block.
- H6: a <=7px static graze at VH 825-848 is REAL at h=28, but it is the
  same class as the accepted float-bob caveat (CFC-gutaxis float reaches
  ~VH 861 regardless). Does not block; disclose.

## 7. Converge: SS clean, FAERS-wide residuals disclosed with one correction

SS endpoints reproduce exactly: search 148.9+, label 240.5, glyphs 26.5
below baseline. Gutaxis zero-drift endpoint -1.0px reproduces; full-phase
range equals drift worst (21.0px), so converge creates NO new gutaxis zone. Swept paths never exceed drift
worst for any SS pair.

FAERS-wide converge residuals (hover-only; drift fully clean, same class
as pre-existing SS-search converged park):

- CFC pill: approximately as disclosed (mine W to ~2051, S 591-871;
  fixer 1 W<1996, S 591-896). Same zone. Acceptable.
- Seoul chip: W 1705-2445, S<787: REPRODUCED EXACTLY.
- Posterwindow: W<1862 REPRODUCED, but zone CORRECTED at true H=355: S to ~628 (not
  571), depth to ~30.3px at S=550 (not 8.3px). Hover-only, short stages.
  Does not block; final report must carry corrected numbers.

FAERS-laptop converge: clean (only the frame-border straddle). No
converge-created chip-chip park in either band.

## 8. Carried disclosure (not this round, not a blocker)

Seoul chip vs CFC pill rest park, W 1401-1900, all S (x-pen to ~30px,
y-pen 2.8-6.5px), confirmed here. Pre-existing, unmoved, no H-band
covers chip-vs-pill. Needs a parent decision.

## Conditions for ship (all disclosure-only)

1. Final report carries corrected posterwindow converge zone (S to ~628,
   depth to ~30px at S=550), not fixer 1's 571/8.3px.
2. Final report carries corrected FAERS-wide posterwindow drift worst
   (57.5, not 79.5) and FAERS-lap CFC-pill worst (~207.5 at pill height
   28, not 205.5).
3. Final report carries the Seoul-chip vs CFC-pill park as an open parent
   decision, plus the §5 thin-margin list.
