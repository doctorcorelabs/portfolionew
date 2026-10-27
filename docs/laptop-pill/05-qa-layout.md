# 05 - QA layout: laptop CFC pill bottom 74%

Verdict: **SHIP** (no blockers). No source file edited, no push.
Fixer diff re-verified: `src/sections/Hero.tsx` only, 15 insertions /
10 deletions; every deletion is a comment line or the one value line
(bottom 45% -> 74% !important, scope 1161-1400px unchanged, right
stays 14% inline). Build re-run: PASS (7.79s). Em dash in Hero.tsx: 0.

## Method (independent, not copied from 01/04)

Model rebuilt from source: pill 114x25, float -10px (shipped
`mv-float`); chips FAERS 73 / SS 116 / CFC 130 / Seoul 109 wide,
drift 20/14, heights 28 governing and 21; cards tilt per class +
float up 8, direction-correct; glyphs W/2 +-490 x [S/2-49.3,
S/2+91.7]; s [W/2+351, W/2+440]; period [W/2+458, W/2+490]; label
W/2 +-84.5 x [S/2-136.7, S/2-122.3]; frame width min(W-48,1160),
height 227, y [S/2-90.3, S/2+136.7]. Grid W 1161-1400 (step 10 +
1161/1300/1301/1400) x S 550-1300 (step 10 + gate boundaries
651/701/782/851/991), rest + worst, split by sub-band
1161-1300 / 1301-1400, gated items only where open.
Script: /tmp/qa_laptop_pill.py (scratch, uncommitted).

## Calibration: old park reproduced

Old pill (bottom 45%): worst box [0.55S-35, 0.55S] sits fully
inside the glyph y-band at every S (top above glyph top, bottom
below glyph bottom, since S < 1834 throughout), overlap depth
35.0px worst (25.0 rest). The model reproduces the park before
it verifies the fix.

## Binding pairs at (1161,550), h=28 (rest x/y, worst x/y)

| Pair | Rest | Worst | Governs |
|---|---|---|---|
| FAERS laptop chip | -84.6, 68.0 | -104.6, **44.0** | y |
| Frame gap | -252.5, 41.7 | -252.5, **41.7** | y (pill above frame top) |
| Glyphs envelope | -186.0, 82.7 | -186.0, **82.7** | y |
| s column | -67.0, 82.7 | -67.0, **82.7** | y (same band) |
| Period | 40.0, 82.7 | 40.0, 82.7 | doubly separated |
| Seoul pill | 15.5, 33.0 | **15.5**, 23.0 | doubly separated |
| Seoul chip | 71.8, 239.3 | **51.8**, 225.3 | x |
| Scopus | 64.6, -36.5 | **64.2**, -47.4 | x |
| Awards | 36.9, 261.0 | **35.8**, 251.5 | x |
| Poster-new | -126.5, 192.0 | -128.2, **181.7** | y |
| Label | 219.5, -4.7 | 219.5, -4.7 | x separates (see below) |
| Converged bottom band | -264.0, 246.7 | -264.0, **246.7** | y |
| Converged FAERS top | -84.6, 35.7 | -84.6, **35.7** | y |

At h=21 every binding worst figure is unchanged or larger
(FAERS y 51.0, conv bottom 250.2, conv FAERS top 39.2), so h=28
governs. All figures match the fixer exactly.

## Full-grid verdict: ZERO overlaps

Zero parks at rest + worst, h=28 AND h=21, both sub-bands,
gated items only where open. Thinnest worst separations, all at
(1161,550) and growing with W and/or S: Seoul pill 15.5 x /
23.0 y; conv FAERS top 35.7 y; frame 41.7 y; FAERS chip 44.0 y;
Seoul chip 51.8 x; Scopus 64.2 x. No other pair under 94px
worst (Cochrane 94.9 at its gate boundary).

## Adjudications (all immaterial, verdict unaffected)

- Scopus 64.2 (fixer) vs 60.6 (analysts): fixer governs.
  CONFIG in DbLogoFloat.tsx says tileWidth 100 (verified in
  source); 100 + tilt 0.4 gives 64.24. Analysts' 60.6 implies
  width 104 with no tilt, which is Elsevier's width, not
  Scopus's. The 3.6px delta is a width slip, not a risk.
- Awards 35.8 (fixer) vs 32.9 (analysts): fixer governs. My
  recompute from the collage entry (right 27%, 168 wide, tilt
  1.1) gives 35.83. Analysts' 32.9 is ~2.9px more conservative
  with no source basis identified in their doc.
- Poster-new 181.7 (fixer) vs 184 (synthesis): fixer governs.
  181.7 is tilt + float inclusive (0.72S-214.3); 184 is
  float-only (0.72S-212). Both hugely positive.

## Word tail, frame, label: all confirmed

- Word-tail park GONE at every S: pill gap above glyph top
  82.7px at S=550, growing to 262.7px at S=1300 (0.24S-49.3).
  s column clears in y by 82.7+; period is doubly separated
  at narrow W (x 40.0 + y 82.7) and y-separated at wide W
  (x overlaps past W~1272, y gap 82.7+ always).
- Pill sits fully ABOVE the frame top at all S: gap 41.7px
  at S=550, growing (0.24S-90.3). No frame-border contact.
  Aesthetic only, same class as the wide pill below the
  frame: the pill floats above the dashed frame.
- Label: x separates by 219.5px at W=1161, growing with W.
  y touches by at most 4.7px, only below S=570 (pill bottom
  0.26S vs label top S/2-136.7 cross at S=569.6), but x
  governs, so the pair is clear at every S.

## Converged endpoints (paths belong to QA-motion)

- Converged bottom band clears the pill in y by 246.7px at
  S=550, growing (0.24S+114.7).
- Converged FAERS top-edge gap is 35.7px at (1161,550),
  h=28, growing (0.24S-96.3).
- Straddle noted for QA-motion: FAERS drift sits ABOVE the
  pill (gap 44.0 worst) while FAERS converged sits BELOW it
  (gap 35.7 worst). Endpoints are clean on both sides; the
  blend path between them is motion's to confirm or refute
  (synthesis predicts a crossing, same structural class as
  the seoul-pill FAERS path finding). This layout verdict
  covers endpoints + rest + drift only.

## Seoul-pill width sensitivity: estimate, not measurement

The 184px Seoul pill width is a MODEL estimate, not a DOM
measurement: label text "Hypertension Seoul 2026" counted
from FACT_PILLS in source = 23 chars x 6.6px (11px JetBrains
Mono, 0.6em advance) + tracking + padding/border 22px =
~184px. The x-gap formula is 199.47 - w at W=1161: w=184
gives 15.5px, w=191 (comment-implied) gives 8.5px, w=199
gives 0.5px, w=200 parks (-0.5px). Both source-derived
estimates pass with headroom, but the margin is thin
enough that the definitive check is a live render: the
parent's preview list must include a Seoul-pill vs CFC-pill
gap eyeball at W=1161-1200. If the rendered width ever
exceeds 199px, the x-gap closes and right 14% must move.

## Sensitivity flags: all moot by separation

Review height 207 vs 223 (x-gap 243px, moot); Cochrane
1301-1400 at VH 751-800 if shown despite the hide rule
(x-gap 662px, moot); notify/stickers content tolerances
(x-gaps 548px+/608px+, moot); poster height +-4px
(y-gap 181.7px, moot).

## Handoff

Layout is SHIP. Still owed by the other QA agents:
regression (laptop scope exact, wide + tablet byte-identical,
hide rules, H3/H4/H6, loop, TABLET_ANCHORS, MINI_CURSOR_CHIPS
untouched by grep) and motion (durations/dart-dwell/converge
unchanged; FAERS path crossing confirm-or-refute with zone +
duration). Live-preview items for the parent: laptop
1161x550-650 (thinnest margins), Seoul-pill gap eyeball at
W=1161-1200, 1400/1401 jump, FAERS hover transit at laptop
widths, tablet + phone spot-check only.
