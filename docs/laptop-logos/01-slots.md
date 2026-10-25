# Laptop logo slots: position tables and gaps

Model (validated against recorded 1440/S=800 label top 263.5, frame
bottom 536.5; this model reproduces both within 0.2px): stage
S = max(550, VH - 100); tile % are of stage W x S; word font is 72px
at W <= 903, 16vw at 904-1125, 180px above; label is 12px mono
(14.4 line box) + 32px margin above the frame; frame padding is
28px vertical; label top = (S - blockH)/2, blockH = 102.4 +
0.95 x font. Tile sizes from DbLogoFloat CONFIG: Scopus 100x50
(tilt -1deg), Elsevier 104x50 (tilt -3deg), Cochrane 69x82
(tilt +1deg), PubMed 100x50 (tilt +2deg). Worst boxes include
float up-only 8px and exact rotated-box tilt expansion. Collage
vs collage parallax cancels; tile vs chip/pill adds 8px parallax.

Visibility summary (from the show rules, verified in source):
- 720-740: all three need VH >= 751; below that, only PubMed.
- 741-1400: Scopus/Elsevier at all heights; Cochrane needs
  VH >= 751, except 1301-1400 where it needs VH >= 801.
- Above 1400: unchanged desktop slots (Scopus 20%/3%, Cochrane
  20%/15%, Elsevier 70%/bottom 5%, PubMed 43%/bottom 5%).
- Below 720: mobile stack unchanged (PubMed, FaersCard,
  Elsevier, NotifyBubble, Scopus, Cochrane).

## Band 720-740 (VH >= 751 only)

| Tile | Slot | Tightest gaps |
|---|---|---|
| Scopus | 41% / 4.3% | Cochrane below: 5.6px tilt-adjusted at VH 751; docking: 47px |
| Cochrane | 41% / 14.3% | Elsevier below: -0.3px (HAIRLINE, see QA doc); label: 64px |
| Elsevier | 41% / 28.6% | Label above: 1.2px tilt-adjusted at VH 751 (hairline PASS); poster: 38px |

## Band 741-1000 (all heights)

| Tile | Slot | Tightest gaps |
|---|---|---|
| Scopus | 36% / 4.3% | Cochrane right: 10.0px at W=741; docking: 13.0px at W=741 |
| Cochrane | 51% / 4.3% | Elsevier left: 5.0px at W=741; poster: 12.3px at W=741 |
| Elsevier | 36% / 18.6% | Scopus above: 17.0px at VH 650; FAIL REGION (see QA doc) |

FAIL REGION, band 741-1000: Elsevier overlaps the label for
W above about 905 at VH 650, worst 7.3px vertical x 51px
horizontal at 1000x650. Clear at VH 700 (gap 8.4px at W=1000)
and at W <= 905 at VH 650. Cause: label top falls as font
grows with W (16vw) while Elsevier bottom is fixed at
0.186S + 50.

## Band 1001-1023

| Tile | Slot | Tightest gaps |
|---|---|---|
| Scopus | 27% / 4.3% | Cochrane right: 8.9px at W=1001; docking: 10.0px at W=1001 |
| Cochrane | 38% / 4.3% | Elsevier left: 4.0px at W=1001; review right: 17.2px at W=1001 |
| Elsevier | 27% / 18.6% | Label: y-overlap 4.5px at VH 650 but x-saved by 38.6px; Scopus above: 17.0px |

## Band 1024-1160

| Tile | Slot | Tightest gaps |
|---|---|---|
| Scopus | 28% / 3% | Cochrane below: 6.5px tilt-adjusted at VH 650; label: 79px |
| Cochrane | 28% / 15% | Label: y-overlap 18.6px at VH 650 but x-saved by 69px; frame: 27.2px |
| Elsevier | 30% / bottom 5% | Faers left: 37px at W=1024; PubMed right: 26.8px at W=1024 |

## Band 1161-1300

| Tile | Slot | Tightest gaps |
|---|---|---|
| Cochrane | 40% / 2% | Label: 45px at VH 650; review right: 70px |
| Scopus | 40% / 19% | Label: FAIL REGION (see QA doc); StrokeSense chip below: 4.1px at 1161x650 (parallax worst) |
| Elsevier | 27% / bottom 5% | Helix above: 297px; notify above: 116px; CodeCure chip above: 36.5px |

FAIL REGION, band 1161-1300: Scopus overlaps the label for
VH at or below about 705. At VH 650 the tile covers the full
label height (14.4px vertical x 58-70px horizontal). At VH 700
the graze is 1.6px; at VH 705 it is 0.03px; at VH 751 the gap
is 14.2px. Cause: the slot between Cochrane bottom and label
top is 44.7px at S=550, but Scopus is 50px tall, so no top%
fits there at VH 650.

## Band 1301-1400

| Tile | Slot | Tightest gaps |
|---|---|---|
| Scopus | 36% / 2% | Helix left: 16.7px at W=1301; review right: 135px |
| Cochrane | 21% / 15% (VH >= 801) | Docking left: 5.0px at W=1301; FAERS chip below: 0.5px worst at VH 801 (hairline PASS, rest gap 9.2px); helix right: 8.3px |
| Elsevier | 30% / bottom 5% | Faers left: 118px; PubMed right: 65px |

Cochrane is HIDDEN at VH 751-800 in this band only (show rule
needs min-height 801), so the inline-position fallback the F2
comment mentions never renders.
