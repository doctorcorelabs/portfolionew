# Laptop CFC pill lane search (word-tail fix)

Base: HEAD `d05a71c`. Scope: 1161-1400 ONLY. Wide rule
(min-width 1401px, bottom 15% / right 5%) and tablet rules
(right 40%/30%) must NOT change. No chip hide allowed.

## Model (verified against source)

- CFC pill now: bottom 45% !important (laptop rule,
  Hero.tsx ~1503), right 14% inline, 114x25, `mv-float`
  -10px. Rest y [0.55S-25, 0.55S], x [0.86W-114,
  0.86W]. S = stage height (VH - 100).
- Glyphs: webfont envelope [W/2-490, W/2+490] x
  [S/2-49.3, S/2+91.7]; s [W/2+351, W/2+440], period
  [W/2+458, W/2+490]. Label [W/2-84.5, W/2+84.5] x
  [S/2-136.7, S/2-122.3]. Frame y [S/2-90.3, S/2+136.7].
- Widths from font metrics (11px JetBrains Mono, 0.6em
  advance, 0.04em tracking, padding + border 22px):
  CFC 114, Seoul pill 184 (23 chars), FAERS pill 128.
  Chips FAERS 73 / SS 116 / CFC 130 / Seoul 109,
  height 28 governing, drift 20/14. Cards: tilt 4px
  + float 8.
- Laptop-visible (gates applied): docking 230x184,
  helix 100x250 (VH>=751), review-new 220x207,
  poster-new 260x204 (right 2.5% bottom 2%, all
  heights), faers card 240x180, awards 168x124,
  notify (VH>=882), microscope, stickers (both
  1301-1400, tall stages only), db-pubmed 100x50,
  db-elsevier 104x50, db-scopus 100x50, db-cochrane
  69x82, Seoul pill, FAERS pill (VH>1090), laptop
  chips FAERS (0.85, 0.04), SS (0.55, 0.70), Seoul
  (0.70, 0.695), CFC (0.30, 0.695), converged band
  [S/2+114.7, S/2+142.7]. HIDDEN at laptop: gutaxis,
  search, posterwindow, desk (hide-1400).
- Method: Python sweep (W 1161-1400, S 550-1300,
  step 10 + gate boundaries; rest + worst). A pair
  parks only if BOTH axes overlap at the same grid
  point; a small gap on one axis with a huge gap on
  the other is doubly separated, not a risk.
  Script: /tmp/laptop_pill_sweep.py.

## Calibration: current park reproduced

Current pill: glyphs park at every S, both axes
(pill fully inside glyph y-band, x-overlap 100-114px;
s covered, period covered at W>=~1300). All other
pairs clear (thinnest: Seoul pill x 15.5 @1161/550).

## X-only move: PROVEN insufficient for the full band

Pill left (1-r)W-114 clears ink right (W/2+490) iff
(0.5-r)W > 604. At r=14%: W > 1678 (matches 02).
At r=0% (flush-right): W > 1208, so even flush-right
parks 23.5px at W=1161. At r=5%: W > 1342. No
single right% clears glyphs across 1161-1400; the
narrow end (W<=1208) is unclearable in x for ANY
right%. Flush-right is additionally unacceptable
(straddles the frame border, past poster-new's edge).

## ABOVE the glyph band: clean window exists

Pill bottom (1-b)S clears glyph top (S/2-49.3) iff
(b-0.5)S > 49.3; binding at S=550: b > 58.96%.
FAERS chip binds above: pill top floated (1-b)S-35
clears chip bottom worst 0.04S+42 iff (0.96-b)S >
77; binding at S=550: b < 82%. Frame: pill fully
above frame top iff (b-0.5)S > 90.3; binding at
S=550: b > 66.42%. Clean window at right 14%:
b in (66.42%, 82%). What sits above is all
x-separated (binding: Scopus 60.6 worst, Seoul pill
15.5; rest 200px+). Converged clears in y by 246.7px.

| Candidate (right 14%) | Verdict | Binding worst margins @1161/550 |
|---|---|---|
| bottom 74% | SHIP (primary) | FAERS y 44.0; Scopus x 60.6; glyphs y 82.7; Seoul pill doubly sep. x 15.5 / y 23.0; awards x 32.9; Seoul chip x 51.8; frame gap 41.7 (fully above frame) |
| bottom 70% | Viable alt | FAERS y 66.0; glyphs y 60.7; Scopus x 60.6; Seoul pill doubly sep. x 15.5 / y 1.0 worst; frame 19.7 |
| bottom 75% | Viable alt | FAERS y 38.5; glyphs y 88.2; Scopus x 60.6; Seoul pill x 15.5 / y 28.5; frame 47.2 |
| bottom 80% | Viable, thin | FAERS y 11.0; glyphs y 115.7; Scopus x 60.6; frame 74.7 |

Zero parks at rest + worst across the full grid for
all four. Primary 74% is maximin-balanced: sole
separator min 44.0px (FAERS), no axis under 15.5px
at the binding point. All margins grow with W and/or
S except Seoul-pill x (grows with W).

## BELOW the glyph band: impossible at right 14%

Glyphs-below needs pill top floated (1-b)S-35 >
S/2+91.7, i.e. (0.5-b)S > 126.7; binding at S=550:
b < 26.96%. Poster-new y-clearance needs
(b-0.02)S > 212; binding at S=550: b > 40.55%.
Poster-new x-clearance at right 14% is impossible
(pill right < poster left needs W > 2261).
Contradiction: b must be both < 26.96% and >
40.55%. Sweep confirms:

| Candidate | Verdict | Parks / binding |
|---|---|---|
| bottom 25%, right 14% | REJECT | poster-new -85.5 worst @1161/550; converged band -30.3 worst @1161/580 (hover-only) |
| bottom 15%, right 14% | REJECT | poster-new -123.4 worst @1161/680 (poster binds) |
| bottom 25%, right 30% | REJECT | Seoul chip -45.4 worst @1161/570; awards -16.5 worst @1161/550; converged -30.3 (poster x-cleared, but Seoul chip + awards bind) |
| bottom 16%, right 42% | REJECT (knife's edge) | Zero parks, but NOT shippable: SS chip 0.0 touch @1161/550; awards y-touch 0.0 / x 2.2; pubmed/elsevier y 2.5; Seoul chip y 2.8 / x 10.3; seoul-pill x 11.6; converged y 9.3. Five pairs under 12px, two at 0.0; any model error flips it to a park. |

## 1400/1401 jump consequence

Today the pill jumps bottom 45% -> wide 15%:
vertical 0.30S (165px @550, 390px @1300). At bottom
74% it jumps 0.59S (324px @550, 767px @1300),
roughly double. Horizontal jump unchanged (right
14% -> 5%, 0.09W). Same class as companion jumps,
but larger. Bottom 70% jumps 0.55S, 75% jumps 0.60S.

## Aesthetic notes (not parks)

Above-band pill floats fully ABOVE the dashed frame
top (41.7px gap @550 at b=74%). H3 stands; pills hide
under reduced motion, so ZERO reduced-motion impact,
NO H-band work.

## Candidate table (fixer implements the first row)

| Pill | Band | Rule | Binding worst margin |
|---|---|---|---|
| CFC pill | 1161-1400 | bottom 74% !important (edit existing laptop rule; right stays 14% inline) | FAERS y 44.0px, Scopus x 60.6px, glyphs y 82.7px (all @1161/550, worst); Seoul pill doubly sep. x 15.5 / y 23.0 |
| CFC pill | above 1400 | UNCHANGED (bottom 15% / right 5%, min-width 1401px) | Regression must confirm |
| CFC pill | tablet | UNCHANGED (right 40%/30%) | Regression must confirm |
| Alt (if parent dislikes 74%) | 1161-1400 | bottom 70% !important | FAERS y 66.0, glyphs y 60.7, Scopus x 60.6; Seoul pill x 15.5 / y 1.0 worst |
| Alt 2 | 1161-1400 | bottom 75% !important | FAERS y 38.5, glyphs y 88.2, Scopus x 60.6; Seoul pill x 15.5 / y 28.5 |

Hard constraints: edit ONE number in the existing
1161-1400 `.mv-diorama-pill-cfc` rule (bottom 45% ->
74%) + rewrite its comment (poster-clearance rationale
now stale; new rationale is the above-glyph-band
window). !important stays (inline bottom 30%).
Position-only, never `display`. Do NOT edit FACT_PILLS
inline styles (that would move wide and tablet pills
too). Do NOT touch chips, H-bands, gates, durations,
or other pill rules.

QA must re-verify: binding pairs at (1161,550)
worst + full-grid zero-park; scope exactly
1161-1400; wide + tablet rules byte-identical.
Sensitivity: Seoul-pill x-gap = 0.27W - 298, i.e.
15.5px at W=1161 for Seoul width 184px; it stays
positive iff Seoul width <= 199px. QA should
sanity-check the rendered Seoul pill width.
