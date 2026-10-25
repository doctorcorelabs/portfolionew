# Word / frame / glyph map (desktop-parks anchor round)

Base: HEAD `15c3ed9`. Geometry verified from `src/sections/Hero.tsx`
plus a fresh PIL render of the SHIPPED webfont. Chip box:
73/116/130/109 x 21px (FAERS / StrokeSense / Code for Cure /
Seoul), anchor = top-left. Desktop drift: ±20 H / ±14 V.
Parallax (±8px) moves the collage only, never word/frame/
label, so chip-vs-glyph/label motion is drift only. Converge
pulls chips toward the h1 rect expanded 20px (§5).

## 1. Verified rules (no guessing)

- Section: `height: calc(100dvh - 100px)`, `minHeight: 550`, flex
  column, centered both axes, padding 80px top/bottom, 24px sides.
  Stage S = max(550, VH - 100); content = S - 160 tall,
  W - 48 wide. Flow children: only label + frame
  (collage/diorama absolute).
- Word (h1): `font-size: clamp(72px, 16vw, 180px)`, weight 700,
  `line-height: 0.95`, `letter-spacing: -1.8px`, margin 0.
  16vw hits the 180px cap at W = 1125, so on ALL desktop
  bands (W >= 1161) the word is constant 180px, one line
  (frame content >= 1049px > ink width). The 903px cap
  rule is tablet-only. Drag offset defaults to
  (0,0); lanes assume rest state.
- Frame: `maxWidth: 1160`, `width: 100%`, padding 28px top/bottom,
  32px sides, border-box. Frame height = 171 + 56 = 227px,
  constant on desktop. Frame width = min(W - 48, 1160);
  frame left = (W - frame width) / 2 (24px for W <= 1207,
  then (W - 1160) / 2). Dashed 1px border, transparent
  interior; 10px handles at corners/midpoints (offset -5).
- Label: `<p>` 12px JetBrains Mono, uppercase, tracking
  0.08em, margin `0 0 32px`. Line-box 14.4px (calibrated).
  Flow total = 14.4 + 32 + 227 = 273.4px, centered.

## 2. PIL render: shipped webfont governs, and it disagrees with QA

The site self-hosts Fontsource Inter (`global.css` imports
`@fontsource/inter/700.css`; the stack resolves to `Inter`
since no Display webfont is loaded). I converted the
shipped `dist/assets/inter-latin-700-normal-*.woff2` to TTF
and rendered `daivanlabs.` at 180px, -1.8px tracking, plus
shipped JetBrains Mono 400 for the label:

- Word ink: 980px wide, 141px tall (dot top to baseline).
  Per-letter ink x (offsets from W/2): d [-490,-394],
  a [-380,-291], i [-273,-244], v [-234,-130], a [-125,-36],
  n [-16,+74], l [+95,+122], a [+135,+224], b [+244,+340],
  s [+351,+440], . [+458,+490].
- 'l' stem: 27px wide, x = W/2 + 94.5 to +121.5.
- Label ink: 169px wide, 10px tall (line-box 14.4
  governs the zone, per prior convention).

DISCREPANCY (flagged, not hidden): QA-layout's PIL render
gave ink width 840px and a 15px 'l' stem. My render of the
file the browser actually downloads gives 980px and a
27px stem. QA's `/tmp/Inter-VF.ttf` is gone with the VM swap. CONSEQUENCE: forbidden
zones below use the WIDER webfont envelope (W/2 ± 490).
Any lane clearing it also clears QA's narrower envelope
(W/2 ± 420). The SS-glyph park verdict is robust under
both: the stem sits at W/2 + ~95..+122 in both renders,
inside the SS chip x-range.

## 3. Y-geometry per stage height (W-independent on desktop)

| S (VH) | Label top-bottom | Frame top-bottom | Glyph top-bottom |
|---|---|---|---|
| 550 (<=650) | 138.3 - 152.7 | 184.7 - 411.7 | 225.7 - 366.7 |
| 600 (700) | 163.3 - 177.7 | 209.7 - 436.7 | 250.7 - 391.7 |
| 700 (800) | 213.3 - 227.7 | 259.7 - 486.7 | 300.7 - 441.7 |
| 900 (1000) | 313.3 - 327.7 | 359.7 - 586.7 | 400.7 - 541.7 |
| 1100 (1200) | 413.3 - 427.7 | 459.7 - 686.7 | 500.7 - 641.7 |

Formulas: label S/2 - 136.7 to S/2 - 122.3; frame
S/2 - 90.3 to S/2 + 136.7; glyph ink S/2 - 49.3 (dot top)
to S/2 + 91.7 (baseline); h1 line box S/2 - 62.3 to
S/2 + 108.7. Label-to-frame gap is constant 32px.

## 4. The glyph band is a skyline, not a rectangle

Ink tops by column (page y; all bottoms = baseline
S/2 + 91.7; no descenders in `daivanlabs.`):

- Tall columns: d [-490,-394] and b [+244,+340]:
  S/2 - 41.3; i dot [-273,-244]: S/2 - 49.3 (stem gap
  below; treat as full-height to be safe); l [+95,+122]:
  S/2 - 41.3.
- X-height columns: S/2 - 10.3. Period [+458,+490]:
  S/2 + 60.7.
- Between letters: no ink (gaps 10-20px, too narrow
  for 73px+ chips).

So: above S/2 - 49.3 is fully clear; the band
S/2 - 49.3 to S/2 - 10.3 is blocked ONLY at the four
tall columns; the band S/2 - 10.3 to S/2 + 91.7 is
blocked across the full ink width; below baseline
(S/2 + 91.7) is fully clear. Lanes may thread the
dot/ascender band between tall columns, never the
x-height band.

## 5. Forbidden zones for chip lanes (rest + drift margin)

A chip box (anchor = top-left) must not enter at rest,
nor its drift ellipse (±20 H / ±14 V). In anchor terms: keep anchorX*W + chipW + 20 <
zone left, or anchorX*W - 20 > zone right, or
anchorY*S + 21 + 14 < zone top, or anchorY*S - 14 >
zone bottom, per zone:

- GLYPH INK: x [W/2 - 490, W/2 + 490],
  y [S/2 - 49.3, S/2 + 91.7]. (§4 skyline may open the
  dot/ascender band between tall columns; the rectangle
  is the safe default.)
- LABEL: x [W/2 - 84.5, W/2 + 84.5],
  y [S/2 - 136.7, S/2 - 122.3] (line-box).
- FRAME BORDER: 1px dashed line at the frame box
  (§3) plus 10px handles. Crossing it is the accepted
  tuck class, NOT forbidden - but the ink inside it is.
- LABEL-FRAME GAP: 32px constant, cannot host a
  drifting chip (needs 21 + 28 = 49px). Not a lane.
- CONVERGE WARNING: a hover-converged chip is pulled
  toward the h1 rect expanded 20px; converged position
  + drift can reach ~2px into ink top from above.
  Converge is hover-only and transient (prior rounds'
  accepted class), but any lane within ~60px of the
  h1 rect edge needs a converged-position check, not
  just a drift check.

## 6. The review squeeze that trapped the StrokeSense lane

Review card: ~208px tall from JSX (prior model 206),
tilt adds ~4px, so tilted bottom = top + 212. Top 2%
at 1161-1400, 3% above 1400. Review x [0.36W,
0.36W+220] / [0.71W-220, 0.71W].

| S | 1161-1400 box gap / ink-true gap | >1400 box gap / ink-true gap |
|---|---|---|
| 550 | 2.7 / 41.7 | -2.8 (box overlap) / 5.2 |
| 600 | 26.7 / 65.7 | 20.7 / 28.7 |
| 700 | 74.7 / 113.7 | 67.7 / 75.7 |
| 900 | 170.7 / 209.7 | 161.7 / 169.7 |
| 1100 | 266.7 / 305.7 | 255.7 / 263.7 |

Box gap = glyph-band top minus review bottom; ink-true
gap uses the tallest ink inside review's x-range
(x-height top at 1161-1400, 'b' ascender above 1400).
A drifting chip needs 57px (21 + 28 drift + 8
parallax): 1161-1400 drift-fits only at S >= 582 (rest
fits at all S); above 1400 rest-fits only at S >= 584,
drift-fits only at S >= 661. At S = 550 no drifting chip
fits in either band, and above 1400 review nearly
touches the 'b' ascender even at rest (5.2px). The trap:
the 0.45 companion jumped over this ~42px ink-true gap
straight into the glyph band (SS chip top 0.45S is below
glyph top for all S < 986, and its x-range covers the
'l' stem at every width), while the old 0.33 anchor
cleared glyphs at all S and only hairline-touched review
x at W ≈ 1161. At S <= 600 no robust horizontal lane
exists between review and glyphs; the replacement SS
lane must go above review, below the baseline, or to a
different x.

## 7. Forbidden-zone table per width band

Drift margin ±20 H / ±14 V throughout. Y formulas
are shared (word is 180px everywhere); X scales with
W/2 except the frame box. Shared Y per S (§3): glyph
ink S/2 - 49.3 to S/2 + 91.7; label S/2 - 136.7 to
S/2 - 122.3; frame S/2 - 90.3 to S/2 + 136.7. Tall-column
x offsets (dot/ascender band only): d [-490,-394],
i [-273,-244], l [+95,+122], b [+244,+340]; all other
ink tops at S/2 - 10.3. Example (W = 1400, S = 600):
glyph ink x 210-1190, y 250.7-391.7; label x 615.5-784.5,
y 163.3-177.7; frame x 120-1280, y 209.7-436.7; 'l' stem
x 794.5-821.5, y 258.7-389.7.

| Band | Frame box x | Glyph ink x | Label x | Review x (squeeze) |
|---|---|---|---|---|
| 1161-1400 | 24 to W-24 (W<=1207); (W-1160)/2 to (W+1160)/2 above | W/2 ± 490 | W/2 ± 84.5 | 0.36W to 0.36W+220 |
| 1401-1600 | (W-1160)/2 to (W+1160)/2 | W/2 ± 490 | W/2 ± 84.5 | 0.71W-220 to 0.71W |
| 1601-2000 | (W-1160)/2 to (W+1160)/2 | W/2 ± 490 | W/2 ± 84.5 | 0.71W-220 to 0.71W |
| 2000+ | (W-1160)/2 to (W+1160)/2 | W/2 ± 490 | W/2 ± 84.5 | 0.71W-220 to 0.71W |
