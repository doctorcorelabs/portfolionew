# Laptop obstacle map (CFC pill vs word tail fix)

Base: HEAD `d05a71c`. Scope: laptop ONLY, W 1161-1400 x
S 550-1300 (S = max(550, VH-100); S=550 covers VH <= 650,
else VH = S+100). Coords: x from section left, y from
section top, px. Collage `%` resolves against W (x) and
S (y). Floats: cards 0 to -8px up; pills 0 to -10px up
(shipped keyframes, verified). Worst phase = box-expanded
extremes, direction-correct. Chips: height 28 governing
(21 nominal), drift 20 H / 14 V. MAP only; no pill
position is proposed here.

## 1. Word, label, frame (governing model, prior rounds)

| Object | Box formula | Notes |
|---|---|---|
| Glyphs envelope | x [W/2-490, W/2+490], y [S/2-49.3, S/2+91.7] | Governing |
| s column | x [W/2+351, W/2+440], same y-band | Tail |
| Period | x [W/2+458, W/2+490], same y-band | Tail |
| Label | x [W/2-84.5, W/2+84.5], y [S/2-136.7, S/2-122.3] | Above word |
| Frame | width min(W-48,1160) centered, height 227, y [S/2-90.3, S/2+136.7] | pills (z 2) above it: border contact IS a park |

## 2. The park being fixed

CFC pill at laptop: bottom 45% !important (1161-1400
rule), right 14% inline, 114x25. Rest box x [0.86W-114,
0.86W], y [0.55S-25, 0.55S]; worst top min 0.55S-35.
Pill y is FULLY inside the glyph y-band at every S
(overlap 51.7-89.2px, deeper than the 25px pill).
X-overlap with ink at every laptop width (ink edge
W/2+490 beats pill left 0.86W-114 throughout). Covered
tail columns depend on W (W=1161: mostly s; W=1400: s
partly, period fully); check columns per-W.

## 3. Cards visible at laptop

Worst box = tilt-expanded (ex, ey) + up 8px.
L/R/T/B = left/right/top/bottom %.

| Card | Position | Size / tilt (ex, ey) | Gates | Rest box |
|---|---|---|---|---|
| docking | L2.5, T3 | 230x184, a-3 (4.7, 5.9) | none | x [0.025W, 0.025W+230], y [0.03S, 0.03S+184] |
| helix | L27, T2, w100 | 100x250, none | VH>=751 | x [0.27W, 0.27W+100], y [0.02S, 0.02S+250] |
| review-new | L36, T2, R auto | 220x207*, b+2 (3.5, 3.8) | none | x [0.36W, 0.36W+220], y [0.02S, 0.02S+207] |
| poster-new | R2.5, B2 | 260x204, c-1 (1.7, 2.3) | none | x [0.975W-260, 0.975W], y [0.98S-204, 0.98S] |
| faers | L2.5, B2 | 240x180, b+2 (3.1, 4.1) | none | x [0.025W, 0.025W+240], y [0.98S-180, 0.98S] |
| awards | R27, B4 | 168x124, c-1 (1.1, 1.5) | none | x [0.73W-168, 0.73W], y [0.96S-124, 0.96S] |
| microscope | L2.5, B39 (y1 0.61S) | 210x192, c-1 (1.7, 1.8) | W>=1301, VH>=801 | x [0.025W, 0.025W+210], y [0.61S-192, 0.61S] |
| notify | L2.5, B28 (y1 0.72S) | ~306x52, s+4 (1.4, 10.6) | VH>=882 (class says 850, rule is 881) | x [0.025W, 0.025W+306], y [0.72S-52, 0.72S] |
| stickers | L2.5, T32 | ~363x26, s+4 (0.5, 12.6) | W>=1301, VH>=951 | x [0.025W, 0.025W+363], y [0.32S, 0.32S+26] |

* Review height 207 (03) vs 209 (01 header); wraps to
223. Use 207, sensitivity 223.

## 4. Cards HIDDEN at laptop (exclude from the sweep)

gutaxis, search, posterwindow, desk: all hide-1400,
show only above 1400. Their wide-band boxes are moot
here; do not import them.

## 5. Logos at laptop (tiles exact from DbLogoFloat CONFIG)

| Tile | Position | Size / tilt (ex, ey) | Gates | Rest box |
|---|---|---|---|---|
| db-pubmed | L43, B5 | 100x50, b+2 (0.8, 1.7) | none | x [0.43W, 0.43W+100], y [0.95S-50, 0.95S] |
| db-elsevier | L27/B5 (1161-1300), L30/B5 (1301-1400) | 104x50, a-3 (1.2, 2.7) | Show-laptop | x [0.27W or 0.30W, +104], y [0.95S-50, 0.95S] |
| db-scopus | L62/T19 (1161-1300), L62/T2 (1301-1400) | 100x50, c-1 (0.4, 0.9) | Show-laptop (B1 DELETED) | x [0.62W, 0.62W+100], y [0.19S or 0.02S, +50] |
| db-cochrane | L62/T2 (1161-1300), L21/T15 (1301-1400) | 69x82, d+1 (0.7, 0.6) | 1161-1300: VH>=751; 1301-1400: VH>=801 ONLY (flag 3) | x [0.62W or 0.21W, +69], y [0.02S or 0.15S, +82] |

Stack (1161-1300): Cochrane T2 above Scopus T19;
worst gaps 2.0px internal, 2.6px Scopus-pill at S=550
only; no collapse on Cochrane hide.

## 6. Cursor chips at laptop

Right-anchored iff anchorX > 0.5. Companions are
laptopMql branches; tablet/miniature do NOT apply.

| Chip | Laptop anchor | Width | Rest box (drift +-20/+-14) |
|---|---|---|---|
| FAERS | (0.85, 0.04), right | 73 | x [0.85W-73, 0.85W], y [0.04S, 0.04S+28] |
| StrokeSense | X 0.55 companion, Y base 0.70, right | 116 | x [0.55W-116, 0.55W], y [0.70S, 0.70S+28] |
| Code for Cure | (0.30, 0.695) base, no companion, left | 130 | x [0.30W, 0.30W+130], y [0.695S, 0.695S+28] |
| Seoul 2026 | X 0.70 companion, Y base 0.695, right | 109 | x [0.70W-109, 0.70W], y [0.695S, 0.695S+28] |

Converge (hover-only): converged chips land on expanded
word-rect edges, rect W/2 +-568 x [S/2-82.3, S/2+128.7].
Pill must clear converged positions too; H3's premise
stands (no chip moves).

## 7. Pills (mv-float 0 to -10px; worst top = rest top -10)

| Pill | Position (laptop) | Size | Gates | Rest box |
|---|---|---|---|---|
| CFC (subject) | B45% !important, R14% | 114x25 | none | x [0.86W-114, 0.86W], y [0.55S-25, 0.55S] |
| Seoul | L59%, T32% | 184x25* | none | x [0.59W, 0.59W+184], y [0.32S, 0.32S+25] |
| FAERS | T62%, L7% | 128x25* | VH>=1091 only | x [0.07W, 0.07W+128], y [0.62S, 0.62S+25] |

* Content-sized estimates (Seoul comment implies 191;
flag 4). Not applicable at laptop: touch, 900px,
reduced-motion hides (park is normal-motion only),
tablet hides/shows. The 1401+ wide rule is disjoint.

## 8. H-bands and flags

H-bands are reduced-motion-only [data-chip] rules; pills
carry no data-chip and hide under reduced motion, so no
H-band covers pill pairs. At laptop only H3 stands
(Seoul/awards, VH<=680); H4/H6 are above-1400 only.

Flags (uncertainties the lane search must handle):
1. Notify ~306x52 (+-5 wide, +-2 tall) and stickers
   ~363x26 (+-8 wide) are content-sized. Y exact; x
   carries that tolerance.
2. Poster 260x204 recomputed (+-4); earlier miniature
   model used 200. Use 204.
3. Cochrane 1301-1400, VH 751-800: hidden entirely
   per 03 (no show rule matches) despite a comment
   suggesting an inline fallback "when shown". Treat as
   hidden; sensitivity if shown: x [0.20W, +69],
   y [0.15S, +82].
4. Pill widths content-sized: Seoul 184 (comment implies
   191, +7px on x1); FAERS 128, CFC 114 (+-few px).
   Lane margins under ~7px on a pill x-edge need
   re-verification against rendered widths.
5. Chip widths (73/116/130/109) and height 28 are prior
   rounds' measurements, not re-measured from DOM here.
6. Helix box (100x250) is conservative: ink is narrower
   (prior round: Cochrane clears box by 29px, ink by
   47px at 1401). Box clearance implies ink clearance.
7. Posterwindow/search/gutaxis/desk heights are moot at
   laptop (all hidden); do not import wide-band boxes.
