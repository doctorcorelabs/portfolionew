# 04 - Fix: laptop CFC pill bottom 45% -> 74%

Base: HEAD `d05a71c`. Implements synthesis verdict (00) exactly.
No push (parent commits + pushes). Diff: `src/sections/Hero.tsx`
only, 15 insertions / 10 deletions; every deletion is a comment
line or the one value line; 0 rule deletions.

## 1. Exact change

One value in the existing laptop rule (scope already exactly
1161-1400px; media query NOT rewritten):

```css
@media (min-width: 1161px) and (max-width: 1400px) {
  .mv-diorama-pill-cfc {
    bottom: 74% !important;
  }
}
```

Right stays 14% inline: NO right property added. `!important`
stays. Class `.mv-diorama-pill-cfc` only. Position-only, never
`display`. FACT_PILLS inline untouched (not in diff). Chips,
H-bands, gates, durations, phases, radii, every other pill rule
untouched (none in diff).

## 2. Three comment rewrites (comment-only, verified)

1. Laptop rule comment: poster-clearance rationale replaced with
   the above-glyph-band window (window (66.42%, 82%) at S=550;
   74% maximin-balanced, FAERS 44.0 / frame 41.7 worst; poster
   clearance still holds (0.26S vs 0.98S-212) but is no longer
   binding; word-tail park gone, pill above glyph top by 82.7px
   worst).
2. Rearrangement comment (~1427): "(bottom 30% to 45% below)" ->
   "(bottom 30% to 74% below)".
3. Wide rule comment (~1509): "laptop (bottom 45%)" ->
   "laptop (bottom 74%)".

Grep after edit: NO pill-45% citation remains. The three surviving
`45%` sites are all StrokeSense chip rules (comments ~1390/~1401,
rule `right: 45% !important` ~1413) - untouched, as required.

## 3. Verification (recomputed, script /tmp/verify_laptop_pill.py)

Model from 02: pill 114x25, float -10px; chips h=28 governing
(also 21), drift 20/14; cards tilt + float up 8, direction-correct;
glyphs W/2 +-490; gates VH -> S (S = VH-100): helix S>=651,
notify S>=782, stickers S>=851 (1301+ only), microscope S>=701
(1301+ only), Cochrane S>=651 (1161-1300) / S>=701 (1301-1400),
FAERS pill S>=991. Grid W 1161-1400 (step 10 + 1161/1300/1301/
1400) x S 550-1300 (step 10 + gate boundaries), rest + worst,
split by sub-band 1161-1300 / 1301-1400.

Binding worst margins at (1161,550), h=28 (all match 00/01):

| Pair | Worst margin | Axis |
|---|---|---|
| FAERS laptop chip | 44.0px | y (drift chip above pill, gap to floated pill top) |
| Frame gap | 41.7px | y (pill fully above frame top) |
| Glyphs (envelope, s-col) | 82.7px | y (pill above glyph top) |
| Period | 40.0px x / 82.7px y | doubly separated |
| Seoul pill | 15.5px x / 23.0px y | doubly separated |
| Awards | 35.8px | x (analysts: 32.9; ~3px tile-width assumption, immaterial) |
| Seoul chip | 51.8px | x |
| Scopus | 64.2px | x (analysts: 60.6; ~4px tile-width assumption, immaterial) |
| Converged bottom band | 246.7px | y |
| Converged FAERS top | 35.7px | y (below pill; drift above at 44.0: STRADDLE, see 5) |
| Label | 219.5px x | x separates (y touches 4.7px only below S=570) |
| Poster-new | 181.7px | y (mine subtracts tilt+float: 0.72S-214.3; synthesis 0.72S-212) |

Spot grid: ZERO overlaps at h=28 AND h=21, rest + worst, both
sub-bands, gated items only where open.

Word-tail park GONE at every S: pill gap above glyph top 82.7px
at S=550, growing to 262.7px at S=1300 (0.24S-49.3). Old pill
overlapped the glyph band by 35.0px worst at every S (full worst
box inside the band). s + period clear at rest + worst, all S.

## 4. Jump disclosure (1400/1401)

Vertical 0.59S DOWN (324px at S=550, 767px at S=1300), horizontal
0.09W RIGHT (126px at W=1400, unchanged from before). Roughly
double the old vertical jump (0.30S); same class as chip
companion jumps (FAERS chip jump is 0.86S, larger still). Seam
adjacent: laptop scope ends max-width 1400px, wide rule starts
min-width 1401px; no gap, no overlap.

## 5. Wide + tablet byte-identical; hides intact

Wide rule (1401px+, bottom 15% / right 5%) appears only as
unchanged context below the edited comment; its body lines are
outside the diff. Tablet rules (right 40% / 30%) outside the diff.
Hide rules (touch, 900px, strips, reduced-motion), H3/H4/H6,
loop code, TABLET_ANCHORS, MINI_CURSOR_CHIPS: none in diff.
Pills hide under reduced motion, so the move has ZERO
reduced-motion impact and needs NO H-band work.

## 6. Build

PASS (5.52s). Em dash in diff: 0.

## Handoff for QA

- Thinnest worst margins: Seoul pill x 15.5px (doubly separated,
  y 23.0px) and frame 41.7px / FAERS 44.0px, all at (1161,550),
  all growing with W and/or S except Seoul-pill x (grows with W).
- Seoul-pill width sensitivity: x-gap 15.5px at W=1161 holds iff
  rendered Seoul width <= 199px (184px measured -> 15.5; 191px
  implied -> 8.5; 199 -> 0.5; 200 -> -0.5). QA must check the
  rendered width.
- Predicted FAERS converge-path crossing (for QA-motion to confirm
  or refute): endpoints STRADDLE the pill (drift above, gap 44.0
  worst; converged top-edge below, gap 35.7 worst at (1161,550),
  h=28, growing with S), x-overlap 65-73px throughout, so the
  blend path must cross the pill's y-band. Same structural class
  as the seoul-pill FAERS path finding. If confirmed,
  disclosure-only (hover-only transient, endpoints clean).
- Small modeling deltas vs analysts (non-binding, no verdict
  impact): awards x 35.8 vs 32.9, Scopus x 64.2 vs 60.6 (tile
  widths +-4px); poster-new y 181.7 vs 184.0 (tilt+float included).
