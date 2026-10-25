# Seoul chip lane: fix for the Seoul-chip vs CFC-pill rest park

Base: HEAD `5fd1ccf`. Scope: Seoul BASE anchor above 1400 only; laptop
companion (0.70), tablet, miniature, pills untouched.
Model: chip 109x28 governing, drift 20/14, cards float 8 up, pills float
10 up (shipped `mv-float`), mouse parallax 8, chip-chip relative drift
40/28, posterwindow height 355 (measured, doc 11), glyph envelope W/2
+-490, converge rect W/2 +-568 x [S/2-82.3, S/2+128.7] (h1 block in the
1160 frame + 20 halo, verified against Hero.tsx). Rest = intrinsic boxes
(doc 03 convention); worst = tilt + drift + direction-correct float.
Range scanned: W 1401-2560 x S 550-1300, full obstacle set.

## Verdict

Move Seoul base anchorX 0.80 -> **0.77**, anchorY unchanged 0.695. Zero
rest parks in range. All drift-only transients under the 16px desktop
standard. H4 becomes deletable.

## Rest at the binding corner (W=1401, S=550; all x-gaps grow with W)

| Pair | Separating axis and margin | Note |
|---|---|---|
| CFC pill | x +12.09px | y overlaps 2.8-6.5px all S; x separates |
| Desk | x +7.24px (5.54 tilt-incl.) | y overlaps S < 822; x separates |
| Posterwindow | x +7.20px | y overlaps S < 607; x separates |
| Glyphs | y +15.55px | grows with S (0.195S-91.7); x inside envelope |
| Label | x +184.77px, y +229.55px | both clear |
| FAERS wide chip | x +109.13px, y +84.75px | both clear |
| SS chip | x +262.26px | same y-band; x separates |
| CFC chip | x +419.47px | same y-band; x separates |
| Review-old | y +158.75px | x overlaps 24.94px; y separates |
| Search | x +205.41px, y +140.25px | both clear |
| Elsevier | y +62.25px | x overlaps; y separates |
| Gutaxis | x +389.52px | y overlaps; x separates |

Full scan: zero Seoul rest parks at 0.77. Rest-clear window at W=1401 is
anchorX (0.7649, 0.7752) (desk below, posterwindow above, pill bound
0.7786 looser). Maximin is 0.7706 (6.37px); 0.77 gives 5.54px
tilt-inclusive and is cleaner.

## Worst transients at 0.77 (x-depth; y-overlap is full chip height for desk/posterwindow, 2.8-6.5px for pill)

| Pair | Drift-only | Parallax-extreme | Zone (drift-only) |
|---|---|---|---|
| Desk | 14.46px | 22.46px | W 1401-1461 x S < 909 (ellipse-true S < 858) |
| Posterwindow | 12.80px | 20.80px | W 1401-1463 x S < 631 (ellipse-true S < 607) |
| CFC pill | 7.91px | 7.91px (pills ignore parallax) | W 1401-1489 x all S |

Ellipse-true x-depths equal box-worst here (pill 7.91 x 2.75 at
1401x550, desk 14.46 x 28, posterwindow 12.80 x 28). Parallax-extreme is
disclosure-only, same class as accepted SS-gutaxis.

## Converge (hover): converged Seoul sits in the band [S/2+114.7, S/2+142.7], 23.0px below the glyph baseline, x sweeping with drift

| Pair | At 0.77 (new) | At 0.80 (current) |
|---|---|---|
| vs CFC pill | W 1401-1486 x S 575-885, max-x 7.91 | W 1401-2041 x S 575-885, max-x 49.94 |
| vs desk | W 1401-1461 x S < 746, max-x 14.46 | none |
| vs posterwindow | W 1401-1461 x S < 616, max-x 12.80 | W 1401-1711 x S < 616, max-x 54.83 |
| vs conv. FAERS | W 1896-2560, max-x 73 (full cover W >= 2166) | W 1706-2556, max-x 73 (full cover W >= 1951) |
| conv. FAERS vs drift Seoul | W 1896-2556 x S < 801, max-x 73 | W 1706-2441 x S < 801, max-x 73 |
| vs drift chips (SS/CFC/FAERS) | x-clear (222/379/69px at W=1401) | same class |
| vs glyphs / label | 23.0px below baseline / clear | unchanged |

Converge adds no new x-depth beyond drift worst for desk/posterwindow;
the desk hover zone is new (current converged Seoul is x-clean vs
desk) but equals the existing drift desk transient in depth. Hover
path is vertical (converged x = drift x), so no mid-path excess for
desk/posterwindow; one path effect: at W 1401-1489 x S > 804 the blend
deepens the pill touch to full pill height (25px y) for ~1s, x-depth
unchanged at 7.91px.

## H4 verdict: DELETE

At 0.77 the Seoul/posterwindow rest x-gap is 0.205W-280 >= 7.20px for
all W >= 1401, and the full rest scan shows zero Seoul rest parks, so
the H4 park class (Seoul/posterwindow 1401-1600 x VH<=708) is gone.
Delete H4 after an independent rest scan confirms zero Seoul rest parks
(same discipline as H1/H2/H5). No replacement band needed. H3 stands
(laptop untouched), H6 stands (CFC untouched). Reduced motion = rest,
so no new static band either.

## Rejected candidates

| Candidate | Why rejected (numbers at W=1401 unless noted) |
|---|---|
| anchorX 0.75 | Desk rest park 20.78 x 28px (S < 822) |
| anchorX 0.76 | Desk rest park 6.77 x 28px |
| anchorX 0.78 | Pill rest park 1.92px + posterwindow rest park 6.81 x 28px |
| anchorX 0.775 | Rest-clear but posterwindow hairline 0.20px; drift transient 19.80px over the 16px standard |
| anchorX 0.772 | Rest-clear but strictly dominated by 0.77: min rest 4.40px (vs 5.54) and max transient 15.60px (vs 14.46) |
| anchorY 0.746 (x 0.80) | Clears pill via y (worst y-gap 11.3px at S=550) but keeps posterwindow rest park 34.83 x 5.20px (S < 558), so H4 only shrinks to VH<=658; and as a pure base change it regresses laptop: awards park extends to VH<=817 (now VH<=679), forcing H3 to ~817 or a new laptop Y companion |
| anchorX 0.77 + anchorY 0.71 | Rest-clear, but a second changed number for marginal benefit only (pill rest fully clear, worst x-depth still 7.91px); laptop awards park extends to VH<=714, still needing a companion or H3 change |

## Residual disclosures (pre-existing or accepted class)

- Parallax-extreme transients over standard: desk 22.46px, posterwindow 20.80px (mouse only; drift-only is inside standard).
- Converged FAERS zones above (hover-only, same class QA11 disclosed for the current lane; the move clears W 1706-1896 but the drift-Seoul zone now reaches 2560 instead of 2441).
- Frame bottom-border straddle W 1401-2552 x S 558-701: pre-existing (y unchanged by this move), accepted class per QA11.
- No Seoul move clears everything: 0.77 is the best single-number move. Fully eliminating the converged FAERS overlap needs a converge-behavior change, out of scope.

## Fixer table

| # | Change | Value |
|---|---|---|
| 1 | `CURSOR_CHIPS` Seoul `anchorX` | 0.80 -> 0.77 (anchorY stays 0.695; update the line comment) |
| 2 | Laptop CSS override (`right: 30%`, 1161-1400) | No change; JS companion 0.70 already matches it |
| 3 | Chip JSX / loop | No change; both derive from `CURSOR_CHIPS`, so JS anchor == CSS base is preserved |
| 4 | H4 band (Seoul/posterwindow, 1401-1600 x VH<=708) | DELETE, after an independent rest scan confirms zero Seoul rest parks |
| 5 | H3, H6, tablet, miniature, pills | No change |
| 6 | Verify after edit | Rest scan zero parks; transients <= 14.46px; live preview 1401x650-800 over a full 15s loop |
