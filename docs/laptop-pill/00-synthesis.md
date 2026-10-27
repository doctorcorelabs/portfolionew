# Synthesis: laptop CFC pill vs word tail fix

Base: HEAD `d05a71c`. Park: laptop CFC pill vs word tail, W 1161-1400
x all S. Pill today: bottom 45% !important, right 14% inline, 114x25,
float -10px. Pill y [0.55S-25, 0.55S] sits fully inside the glyph
y-band at every S, x-overlapping the ink at every width, covering s
+ period. Reports: 01 (lane), 02 (obstacles), 03 (impact). Model:
chips h=28, drift 20/14; converge rect ±568, tau 0.22.

## Verdict: ADOPT bottom 74%, no override

Edit ONE number in the existing 1161-1400 rule: bottom 45% -> 74%
!important, right stays 14% inline. Zero parks at rest + worst across
the full grid (01 sweep). No flaw justifies a different bottom %.

## Why 74% is the maximin point

At right 14%, three bounds set the above-glyph-band window, all
binding at S=550: glyphs-above needs b > 58.96%, frame needs b >
66.42%, FAERS chip binds above at b < 82%. Clean window: b in
(66.42%, 82%), with the two b-dependent margins moving in opposite
directions: FAERS gap = (0.96-b)S - 77, frame gap = (b-0.5)S - 90.3.
They cross at b = 0.73 + 6.65/S (74.2% at S=550, 73.5% at S=1300).
Bottom 74% sits within 0.5pp of the crossing at every S, balancing
FAERS 44.0px against frame 41.7px at (1161,550) worst. B-independent
margins cannot justify a different bottom %.

## Comparison

| Candidate (right 14%) | Verdict | Binding worst @1161/550 |
|---|---|---|
| 74% | SHIP (primary) | FAERS y 44.0; frame 41.7; glyphs y 82.7; Seoul pill x 15.5 / y 23.0; awards x 32.9; Seoul chip x 51.8; Scopus x 60.6 |
| 75% | Fallback | FAERS y 38.5; frame 47.2; Seoul y 28.5; jump 0.60S. |
| 70% | Last resort only | FAERS y 66.0; frame 19.7; Seoul pill y 1.0 worst (near-touch). |
| 80% | Reject | FAERS y 11.0 (thin). |
| Below band, right 14% | Reject (impossible) | Glyphs-below b < 26.96% vs poster-new b > 40.55%; x-clearance impossible. |
| Below band, right 42% / bottom 16% | Reject (knife's edge) | Zero parks, but two pairs at 0.0, five under 12px. |
| X-only move, any right% | Reject (proven insufficient) | W <= 1208 unclearable in x for ANY right%. |

## Predicted NEW transient: FAERS converge path (QA must confirm)

Unverified prediction (01 checked bottom-edge endpoints only; 03
mandates path checks too). Derivation: FAERS drifts ABOVE the moved
pill (gap 44.0px worst) but converges to the rect TOP edge BELOW it
(gap (b-0.5)S - 96.3 = 35.7px worst at (1161,550), h=28, growing with
S). Opposite-side endpoints mean the blend path MUST cross the
pill's y-band (x-overlap 65-73px throughout). Predicted transient: up
to 73px x / 25px y, ~0.3-0.5s per hover transit, endpoints clean both
sides, zone the whole laptop band x all S. Structural note: the
straddle is shared by EVERY above-band candidate (b > 67.5% at S=550,
inside the clean window), so it is not a reason to pick a different
bottom %. If QA refutes it, drop this disclosure; if confirmed,
disclosure-only.

## (a) Jump growth across 1400/1401

Today: 0.30S down (165px @550, 390px @1300) + 0.09W right (126px
@1400). At 74%: 0.59S down (324px @550, 767px @1300) + 0.09W right
unchanged. Roughly double vertically (FAERS chip jump is 0.86S,
larger still). Disclose the absolute numbers.

## (b) Seoul-pill width sensitivity

Seoul-pill x-gap = 0.27W - 298 (Seoul width 184px) = 15.5px at W=1161,
growing with W, positive iff rendered Seoul width <= 199px. QA must
check the rendered width (184px measured, 191px implied both pass;
191px gives 8.5px at W=1161). Bottom-independent: it constrains right
14%, not 74%.

## (c) Aesthetic: pill above the frame

At 74% the pill floats fully ABOVE the dashed frame top, gap 41.7px
@550 growing with S (0.24S - 90.3). Same class as the wide pill below
the frame, not a park: gap 41.7px+, x-separated from every top-right
neighbor (Scopus x 60.6 worst).

## (d) Implementation spec (fixer implements exactly this)

In `src/sections/Hero.tsx`, edit ONE value in the existing rule
(scope already exactly 1161-1400px; do NOT rewrite the media query):

```css
@media (min-width: 1161px) and (max-width: 1400px) {
  .mv-diorama-pill-cfc {
    bottom: 74% !important;
  }
}
```

Right stays 14% inline: do NOT add a right property. Rewrite THREE
comments, comment-only: (1) laptop rule comment: replace the
poster-clearance rationale with the above-glyph-band window (window
(66.42%, 82%) at S=550; 74% maximin-balanced, FAERS 44.0 / frame 41.7
worst; poster clearance still holds (0.26S vs 0.98S-212) but is no
longer binding; word-tail park gone, pill above glyph top by 82.7px
worst); (2) rearrangement comment (~1427): "(bottom 30% to 45%
below)" -> "(bottom 30% to 74% below)"; (3) wide rule comment
(~1509): "laptop (bottom 45%)" -> "laptop (bottom 74%)".

## (e) Hard constraints

Scope EXACTLY 1161-1400px (missing max-width collides with wide;
missing min-width leaks into tablet); !important stays; class
`.mv-diorama-pill-cfc` ONLY; position-only, never display; do NOT edit
FACT_PILLS inline; do NOT touch chips, H-bands, gates, durations,
other pill rules; wide 15%/5% and tablet 40%/30% byte-identical.
WARNING: grep "45%" also hits StrokeSense chip rules (right 45%,
~1390-1413): do NOT touch them.

## (f) QA must re-verify

1. Full grid split by sub-band 1161-1300 / 1301-1400 (stickers /
   microscope only 1301+), heights 28 and 21, rest + worst, gated
   items only where open; zero overlaps; binding pairs as in the
   table.
2. Converged endpoints AND paths: bottom-edge chips clear pill in y
   by 246.7px @550; FAERS top-edge gap (predicted 35.7px @1161/550,
   h=28); FAERS path crossing (confirm or refute, with zone +
   duration); SS/CFC/Seoul paths below pill.
3. Word-tail park gone at every S (pill above glyph top at rest +
   worst; s + period clear).
4. Jump: 0.59S down + 0.09W right; seam adjacent, no gap/overlap.
5. Hide rules intact; wide + tablet byte-identical; rendered Seoul
   pill width <= 199px.
6. H3/H4/H6, loop code, TABLET_ANCHORS, MINI_CURSOR_CHIPS, miniature
   untouched by grep; build passes; no em dash.
7. Flags moot by separation: notify/stickers (left side),
   poster ±4px, review 207 vs 223, Cochrane VH 751-800 hidden per 03.

## Fixer order

Single fixer (one number + three comments): implement (d) under (e),
verify binding pairs + build, write the note. Then QA (parallel, path
check explicit), then parent commit + push.

## Disclosure list for the final report

- Fixed: laptop CFC pill vs word tail (W 1161-1400 x all S), gone at
  rest + worst, via one number, bottom 45% -> 74% (1161-1400 rule);
  right stays 14%.
- Why 74%: maximin of (66.42%, 82%); FAERS 44.0 / frame 41.7; 75%
  fallback, 70% last resort (1.0px), 80% thin.
- Costs: jump doubles vertically (0.59S down; 324px @550, 767px @1300;
  horizontal unchanged); pill floats above frame top (41.7px @550,
  growing), aesthetic only.
- Predicted transient (QA to confirm): FAERS path crosses the moved
  pill on hover (65-73px x, up to 25px y, ~0.3-0.5s, whole band x all
  S); endpoints clean (44.0, 35.7). Structural, not 74%-specific.
- Sensitivity: Seoul x-gap 15.5px holds iff rendered Seoul width <=
  199px; QA check required.
- Unchanged: wide, tablet, chips, H3/H4/H6, loop, gates, durations,
  miniature, tablet lanes; no H-band work.
- Live-preview: laptop 1161x550-650, 1400/1401 jump, FAERS hover
  transit at laptop widths, tablet + phone spot-check.
