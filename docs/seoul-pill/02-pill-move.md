# CFC pill move search (Seoul-chip vs CFC-pill fix)

Base: HEAD `5fd1ccf`. Scope: above 1400px ONLY.
Laptop pill (bottom 45% at 1161-1400) and tablet
pill (right 40%/30%) must NOT change. No chip
hide allowed.

## Model (verified against source, not assumed)

- CFC pill now: bottom 30%, right 14% inline, 114x25,
  `mv-float`. Rest box x [0.86W-114, 0.86W],
  y [0.70S-25, 0.70S]; worst float top min 0.70S-35.
  NOTE: the brief said float 0 to -8px, but shipped
  keyframes say -10px; all worst numbers use -10px
  (conservative; -8px would add 2px to every
  pill-top margin).
- Seoul chip: (0.80, 0.695), right-anchored, 109 wide.
  Rest x [0.80W-109, 0.80W], y [0.695S, 0.695S+21].
  Drift +-20 H / +-14 V. Chip height 28 (governing)
  does not change any primary binding margin (all
  are x-gaps or pill-top gaps); it matters only
  for the fallback.
- Glyphs: wider webfont envelope (02), box [W/2-490,
  W/2+490] x [S/2-49.3, S/2+91.7]; columns s [+351,+440],
  . [+458,+490]. Box clearance implies column clearance.
- Posterwindow: right 2.5%, top 11%, measured height
  355 (QA-layout; 03 assumed 333). Width-only gate
  above 1400 (hide-1400, no height gate), so it
  stands at all S. Box x [0.975W-280, 0.975W],
  y [0.11S, 0.11S+355]. Tilt 0.
- All other above-1400 boxes per 03 (desk, gutaxis,
  search, review-old, faers card, elsevier, pubmed,
  scopus/cochrane, FAERS/SS/CFC chips, Seoul/FAERS
  pills, label) were swept; none binds.
- Method: independent Python sweep (W 1401-2560 +
  boundaries 1438/1510/1678/1900/2233/2435, S
  550-1300 + boundaries 583/634/661/700/782/851;
  rest + worst: pill float 0/-10, chip drift
  box-expanded 20/14, card tilt + float up 8).
  Depths are sweep outputs at the binding point,
  zones are analytic.

## Baseline: the current pill has THREE parks, not one

| Park | Rest zone / depth | Worst zone / depth |
|---|---|---|
| Seoul chip (TARGET) | W<1900, all S; up to 29.9 x 6.5 @1401/1300 | W<2233, all S; up to 49.9 x 20.5 @1401/1300 |
| Glyphs (s/.) graze, NEW | W<1678, S<584; up to ~100 x 6.7 @1401/550 | W<1678, S<634; up to ~100 x 16.7 @1401/550 |
| Posterwindow, NEW, deepest | W<2435, S<644; up to ~119 x 55.5 @1401/550 | W<2435, S<661; up to ~119 x 65.5 @1401/550 |

All other current-pill pairs are clear at rest +
worst (thinnest: elsevier 76.8, FAERS chip 96.0,
desk 126.6, Seoul pill 149.0, all @1401/550).
Pill-vs-card and pill-vs-glyph pairs were never
scanned before (prior scans covered chip-vs-card
and chip-vs-pill only), which is why the glyph
and posterwindow parks survived unnoticed.

## NEW finding, OUT OF SCOPE: laptop pill vs word tail

Laptop CFC pill (bottom 45% !important at 1161-1400,
right still 14%): box y [0.55S-25, 0.55S] sits FULLY
inside the glyph y-band [0.5S-49.3, 0.5S+91.7] at
every S (y-overlap 116.7-0.05S = 51.7-89.2px,
deeper than the 25px pill height), and x-overlaps
the ink range at every laptop width (W<1678),
covering the s column [+351,+440] nearly fully
and part of . [+458,+490]. NOT fixed here (brief
forbids laptop changes, and a laptop fix is
non-trivial: word tail above, bottom-right poster
below, laptop Seoul chip to the left). The fixer
MUST scope the new rule to min-width 1401px so
laptop is untouched by construction. Flag for a
separate follow-up round.

## Candidates (all above-1400 only, worst phase)

| Candidate | Verdict | Binding worst margins @1401/550 |
|---|---|---|
| right 5%, bottom 15% | SHIP (primary) | FAERS y 13.5; posterwindow y 17.0; glyphs x 26.5; Seoul x 76.2; elsevier x 131.1; rest >= 250 |
| right 8%, bottom 15% | Viable alt | FAERS y 13.5; posterwindow y 17.0; Seoul x 34.1; glyphs y 65.8 (x-overlap 15.6 @W<1438 only); elsevier x 89.0 |
| right 14%, bottom 15% | Fallback, thin | elsevier x 5.0 (tilt-inclusive); Seoul y 8.3 (h=28; 15.2 at h=21); FAERS y 13.5; posterwindow y 17.0 |
| right 10%, bottom 30% | REJECT | Seoul fixed (x-gap 6.1) but glyphs + posterwindow remain (-16.7, -65.5) |
| right 30%, bottom 30% | REJECT | Seoul fixed (x-gap 11.1) but glyphs remain (-16.7) AND new desk park (-59.4: pill x overlaps desk x, pill y overlaps desk top region) |
| right 14%, bottom 35% | REJECT | Seoul fixed (y-gap 10.8) but glyphs WORSEN (-44.2) and posterwindow WORSENS (-93.0) |
| right 14%, bottom 12% | REJECT | Rest clean but FAERS chip worst -3.0 @1401/550 (pill bottom 0.88S vs FAERS top min 0.90S-14: gap 0.02S-14 < 0 for S<700) |

Reading the primary: bottom 15% puts pill top min
0.85S-35 against posterwindow bottom 0.11S+355,
giving 0.74S-390 = 17.0 @550, and pill bottom max
0.85S against FAERS chip top min 0.90S-14, giving
0.05S-14 = 13.5 @550. Right 5% clears Seoul in x
(0.15W-134 = 76.2 @1401) and glyphs in x
(0.45W-604 = 26.5 @1401, wider envelope). All
margins grow with W and/or S. Posterwindow-height
sensitivity: the 17.0px margin survives posterwindow
height up to 372px at S=550 (measured 355). The
pill sits below the frame bottom at all S (gap
0.35S-171.7 > 0 for S>491), so no frame-border
crossing.

## Converge (hover-only) improves too

Pills are not converge targets, but converged chips
can land on them. The disclosed FAERS-converge-vs-
CFC-pill residual (S 591-871) exists because
converged chip y [S/2+114.7, S/2+142.7] (bottom
edge + halo 20, h=28) overlaps current pill y
[0.70S-35, 0.70S] for S<889. Moved pill y
[0.85S-35, 0.85S] clears every converged chip in y
by >= ~15px @550 (h=28; 18.3 at h=21), growing
with S. So the move FIXES that converge residual
as a side effect. Converged Seoul/SS/CFC chips are
x-separated from the moved pill by >= 450px @1401.

## Implementation spec (fixer)

Add immediately AFTER the laptop CFC rule
(`@media (min-width: 1161px) and (max-width: 1400px)`
block, `Hero.tsx` near line 1503):

```css
/* CFC pill wide position (Seoul-chip vs CFC-pill fix):
   above 1400px only; laptop (bottom 45%) and tablet
   (right 40%/30%) untouched by construction. */
@media (min-width: 1401px) {
  .mv-diorama-pill-cfc {
    bottom: 15% !important;
    right: 5% !important;
  }
}
```

- `!important` on BOTH properties is required: the
  inline style sets bottom 30% / right 14%.
- Do NOT edit FACT_PILLS inline styles: that would
  move the laptop and tablet pills too.
- Do NOT touch chips, H-bands, gates, durations,
  or any other pill rule.
- Pill jumps across 1400/1401 (bottom 45% to 15%,
  right 14% to 5%): accepted, same class as
  existing chip companion jumps.
- Fixer must verify worst-phase gaps at (1401,550)
  (FAERS 13.5, posterwindow 17.0, Seoul x 76.2,
  glyphs x 26.5) + a spot grid + build. QA must
  re-verify the laptop pill is byte-identical
  (bottom 45% at 1161-1400; word-tail finding
  unchanged, open as its own follow-up).

## Candidate table (fixer implements the first row)

| Chip/pill | Band | Rule | Binding worst margin |
|---|---|---|---|
| CFC pill | above 1400 | bottom 15% !important, right 5% !important (min-width 1401px) | FAERS y 13.5px, posterwindow y 17.0px, glyphs x 26.5px, Seoul x 76.2px (all @1401/550, worst) |
| CFC pill | 1161-1400 | UNCHANGED | Word-tail park disclosed above, open follow-up |
| CFC pill | tablet | UNCHANGED (right 40%/30%) | Regression must confirm |
| Alt (if parent dislikes right 5%) | above 1400 | bottom 15% !important, right 8% !important | FAERS y 13.5px, posterwindow y 17.0px, Seoul x 34.1px, glyphs y 65.8px |
