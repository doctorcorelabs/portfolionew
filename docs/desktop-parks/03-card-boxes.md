# Desktop card boxes (desktop-parks anchor round)

Base: HEAD `15c3ed9`. Source: `src/sections/Hero.tsx`
(COLLAGE_ITEMS inline styles, stylesheet overrides, tilt classes)
plus each card component's own sizing. All boxes computed, none
measured live.

## Method

Coords: x from section left, y from section top, px. Section is
`position: relative`, height `calc(100dvh - 100px)`, minHeight
550, so stage height S = max(550, VH - 100) and stage width =
viewport width W. Collage is absolute `inset: 0`, so every `%`
anchor resolves against W (x) and S (y). Check: review-old
(right 29%) vs search (left 36%) at W=1440 recomputes to an
18.5px tilt-adjusted gap, matching the documented 18.6px, so
W-based resolution is confirmed. S map: S=550 means VH <= 650;
S=600 means VH=700; S=700 means VH=800; S=900 means VH=1000;
S=1100 means VH=1200. Rest box = anchor + intrinsic size:
left p% gives x0 = pW, x1 = pW + w; right p% gives
x1 = (1-p)W, x0 = (1-p)W - w; top p% gives y0 = pS,
y1 = pS + h; bottom p% gives y1 = (1-p)S, y0 = (1-p)S - h.
Tilt expansion (inner rotate, symmetric): W' = w*cos + h*sin,
H' = h*cos + w*sin; ex = (W'-w)/2, ey = (H'-h)/2. Worst-phase
box = tilt-expanded box shifted up 8px (float runs 0 to -8px,
alternate, per-item duration/delay); apply the shift only toward
the chip, since a card below the chip floats away from it.
The m-* mobile tiles hide at min-width 720px and never appear
on desktop, so they are omitted below.

## Intrinsic sizes and tilt expansions

| Card | Size | Tilt | ex | ey |
|---|---|---|---|---|
| docking | 230 x 184 | card-a -3deg | 4.7 | 5.9 |
| helix | 100 x 250 | none | 0 | 0 |
| review | 220 x 207 | card-b 2deg | 3.5 | 3.8 |
| poster | 260 x 204 | card-c -1deg | 1.7 | 2.3 |
| faers | 240 x 180 | card-b 2deg | 3.1 | 4.1 |
| gutaxis | 230 x 172 | card-a -3deg | 4.3 | 5.9 |
| awards | 168 x 124 | card-c -1deg | 1.1 | 1.5 |
| search | 260 x 231 | window-b 1deg | 2.0 | 2.3 |
| posterwindow | 280 x 333 | window-a 0deg | 0 | 0 |
| microscope | 210 x 192 | card-c -1deg | 1.7 | 1.8 |
| desk | 220 x 198 | card-c -1deg | 1.7 | 1.9 |
| notify | ~306 x 52 | sticker-b 4deg | 1.4 | 10.6 |
| pubmed tile | 100 x 50 | card-b 2deg | 0.8 | 1.7 |
| elsevier tile | 104 x 50 | card-a -3deg | 1.2 | 2.7 |
| scopus tile | 100 x 50 | card-c -1deg | 0.4 | 0.9 |
| cochrane tile | 69 x 82 | card-d 1deg | 0.7 | 0.6 |
| stickers | ~363 x 26 | sticker-b 4deg | 0.5 | 12.6 |

Faers 180 is the B1-verified true height; tiles are exact from
DbLogoFloat CONFIG; helix 100x250 is exact from its 80x200
viewBox at inline width 100; microscope and desk are exact from
their 4/3 image ratios plus captions. Other heights are summed
from padding, borders, and content lines with line-height
normal = 1.2 (see flags).

## Height gates (VH thresholds, S in parens)

- helix: shown iff VH >= 751 (S >= 651). Hidden at S=550, 600.
- cochrane 1161-1300: shown iff VH >= 751 (S >= 651).
- cochrane 1301-1400: shown iff VH >= 801 (S >= 701); at VH
  751-800 it is hidden entirely (no show rule matches).
- cochrane above 1400: shown iff VH >= 751 (S >= 651).
- microscope: shown iff W >= 1301 AND VH >= 801 (S >= 701).
- stickers: shown iff W >= 1301 AND VH >= 951 (S >= 851).
- notify: shown iff VH >= 882 (S >= 782). The 850 in its class
  name is stale; the rule threshold is 881.
- Width-only: gutaxis, search, posterwindow, desk shown iff
  W >= 1401; poster, awards shown iff W <= 1400.

## Band 1161-1300 at W=1300, S=700 (VH 800)

| Card | Rest box |
|---|---|
| docking | (33,21)-(263,205) |
| helix | (351,14)-(451,264) |
| review-new | (468,14)-(688,221) |
| poster | (1008,482)-(1268,686) |
| faers | (33,506)-(273,686) |
| awards | (781,548)-(949,672) |
| pubmed | (559,615)-(659,665) |
| elsevier | (351,615)-(455,665) |
| scopus | (806,133)-(906,183) |
| cochrane | (806,14)-(875,96) |

Hidden here: gutaxis, search, posterwindow, desk (W <= 1400);
microscope (W <= 1300); stickers, notify (VH gates).

## Band 1301-1400 at W=1350, S=700 (VH 800)

| Card | Rest box |
|---|---|
| docking | (34,21)-(264,205) |
| helix | (365,14)-(465,264) |
| review-new | (486,14)-(706,221) |
| poster | (1056,482)-(1316,686) |
| faers | (34,506)-(274,686) |
| awards | (818,548)-(986,672) |
| pubmed | (581,615)-(681,665) |
| elsevier | (405,615)-(509,665) |
| scopus | (837,14)-(937,64) |

Hidden here: gutaxis, search, posterwindow, desk (W <= 1400);
cochrane (VH 800 < 801); microscope (VH 800 <= 800); stickers,
notify (VH gates).

## Band 1401-1600 at W=1500, S=700 (VH 800)

| Card | Rest box |
|---|---|
| docking | (38,21)-(268,205) |
| helix | (405,14)-(505,264) |
| review-old | (845,21)-(1065,228) |
| faers | (38,506)-(278,686) |
| gutaxis | (375,507)-(605,679) |
| search | (540,14)-(800,245) |
| posterwindow | (1183,77)-(1463,410) |
| desk | (795,481)-(1015,679) |
| pubmed | (645,615)-(745,665) |
| elsevier | (1050,615)-(1154,665) |
| scopus | (300,21)-(400,71) |
| cochrane | (300,105)-(369,187) |

Hidden here: poster, awards (W >= 1401); microscope (VH <= 800);
stickers, notify (VH gates).

## Band 1601-2000 at W=1800, S=700 (VH 800)

| Card | Rest box |
|---|---|
| docking | (45,21)-(275,205) |
| helix | (486,14)-(586,264) |
| review-old | (1058,21)-(1278,228) |
| faers | (45,506)-(285,686) |
| gutaxis | (450,507)-(680,679) |
| search | (648,14)-(908,245) |
| posterwindow | (1475,77)-(1755,410) |
| desk | (954,481)-(1174,679) |
| pubmed | (774,615)-(874,665) |
| elsevier | (1260,615)-(1364,665) |
| scopus | (360,21)-(460,71) |
| cochrane | (360,105)-(429,187) |

Hidden here: poster, awards (W >= 1401); microscope (VH <= 800);
stickers, notify (VH gates).

## Band 2000+ at W=2200, S=700 (VH 800)

| Card | Rest box |
|---|---|
| docking | (55,21)-(285,205) |
| helix | (594,14)-(694,264) |
| review-old | (1342,21)-(1562,228) |
| faers | (55,506)-(295,686) |
| gutaxis | (550,507)-(780,679) |
| search | (792,14)-(1052,245) |
| posterwindow | (1865,77)-(2145,410) |
| desk | (1166,481)-(1386,679) |
| pubmed | (946,615)-(1046,665) |
| elsevier | (1540,615)-(1644,665) |
| scopus | (440,21)-(540,71) |
| cochrane | (440,105)-(509,187) |

Hidden here: poster, awards (W >= 1401); microscope (VH <= 800);
stickers, notify (VH gates).

## Boxes at other stage heights

X anchors, left % unless noted right: docking 2.5, helix 27,
review-new 36, faers 2.5, gutaxis 25, search 36, desk 53,
microscope 2.5, notify 2.5, pubmed 43, stickers 2.5; right %:
review-old 29, poster 2.5, awards 27, posterwindow 2.5.
Top-anchored y0 = pS (y1 = y0 + h): docking 0.03S, helix 0.02S,
review-new 0.02S, review-old 0.03S, search 0.02S, posterwindow
0.11S, stickers 0.32S, scopus 0.19S (1161-1300) / 0.02S
(1301-1400) / 0.03S (above 1400), cochrane 0.02S (1161-1300) /
0.15S (1301-1400 and above 1400). Bottom-anchored y1 = qS
(y0 = y1 - h): faers 0.98S, poster 0.98S, awards 0.96S, gutaxis
0.97S, desk 0.97S, microscope 0.61S, notify 0.72S, pubmed 0.95S,
elsevier 0.95S. X anchors are W-independent except the logo
sub-bands: elsevier 0.27W (1161-1300), 0.30W (1301-1400), 0.70W
(above 1400); scopus 0.62W (1161-1400), 0.20W (above 1400);
cochrane 0.62W (1161-1300), 0.21W (1301-1400, VH >= 801),
0.20W (above 1400). At S=550 every height-gated card is hidden
in every band; at S=900 and S=1100 every width-visible card is
shown in every band.

## Flags: boxes not pinned exactly

- notify ~306x52 and stickers ~363x26 are content-sized (no
  fixed width in source): notify +-5px wide, +-2px tall;
  stickers +-8px wide. Y positions are exact; x extents carry
  that tolerance.
- review 220x207 assumes the 13px title fits one line (182px of
  text vs 186px inner width, 4px margin). If it wraps, height
  becomes ~223 (+16px on y1).
- poster 260x204 recomputed from current source; the earlier
  miniature model used 200. Use 204, tolerance +-4px.
- posterwindow 280x333 assumes the 11px meta line fits one line
  (238px vs 242px inner width, 4px margin). If it wraps, height
  becomes ~350 (+17px on y1).
- search 260x231, gutaxis 230x172: summed from source, tolerance
  +-4px and +-3px (line-height normal assumed).
- Everything else is exact from CONFIG, viewBox/aspect ratios,
  or prior verified models (faers 180, docking 184, awards 124).
