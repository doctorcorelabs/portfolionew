# Fix: CFC pill move above 1400px (Option 2)

Base: HEAD `5fd1ccf`. Spec: `docs/seoul-pill/00-synthesis.md` (c),
implemented exactly, nothing else. NOT pushed (parent owns commit/push).

## Rule added (verbatim, one place)

Immediately AFTER the laptop CFC rule (`@media (min-width: 1161px)
and (max-width: 1400px)`, `bottom: 45% !important`, closing brace
at old line 1506), BEFORE the "Tablet native mirror" comment.
New lines 1507-1515 in `src/sections/Hero.tsx`:

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

## Hard-constraint compliance (all verified from the diff)

- `!important` on BOTH properties: yes (inline sets bottom 30% /
  right 14%, plain CSS would lose).
- Scope EXACTLY `min-width: 1401px`: yes (disjoint from the laptop
  1161-1400 rule by construction; no 1161px scope anywhere).
- Position-only, NEVER `display`: yes (no display property in the
  new rule; hide/show mechanisms untouched).
- FACT_PILLS inline styles untouched: yes (CFC still `bottom: "30%",
  right: "14%"` at line 227).
- Chips (Seoul, FAERS, SS, CFC), H-bands (H3/H4/H6), gates,
  durations, phases, radii, every other pill rule: untouched.
  Proof: `git diff` is ONE hunk, 9 insertions, 0 deletions,
  `src/sections/Hero.tsx` only.

## Verification (recomputed myself, script `/tmp/verify_pill.py`)

Model: pill 114x25, float -10px (shipped `mv-float` keyframes,
verified in source); chips drift 20/14, heights 28 (governing)
and 21; cards tilt per class + float up 8 direction-correct;
glyphs wider webfont envelope (W/2 ±490); posterwindow 280x355
measured. Worst = box-expanded extremes (pill swept box:
top -10, bottom float-0), the prior rounds' convention.

Calibration first: my model reproduces the CURRENT pill's three
parks exactly (Seoul -29.9 x -2.8 @1401/550; posterwindow
-118.9 x -55.5 @1401/550; glyphs -99.6 x -6.7 @1401/550;
zone edges W=1900 Seoul x 0.0, W=1678 glyphs x 0.1,
W=2435 posterwindow x 0.0). The "fixed" verdict below is
therefore trustworthy, not assumed.

Binding worst margins at (1401,550), h=28, moved pill
(all match 02; tilt convention accounts for 0.1px deltas):

| Pair | Rest | Worst | Binding axis |
|---|---|---|---|
| FAERS chip | x -44.0, y 27.5 | x -64.0, y 13.5 | y 13.5 |
| Posterwindow | x -149.0, y 27.0 | x -149.0, y 17.0 | y 17.0 |
| Seoul chip | x 96.2, y 32.2 | x 76.2, y 8.2 | x 76.2 |
| Glyphs box | x 26.5, y 75.8 | x 26.5, y 65.8 | x 26.5 |
| db-elsevier | x 132.3, y 5.0 | x 131.0, y -5.7* | x 131.0 |

\* elsevier/pubmed worst y goes slightly negative at S~600-610
(0.3px at closest), but x separates by 131+/513+px, so the
pair is clear: y adjacency is irrelevant when x separates
by that much. Do NOT misread the y figure as a hairline.
Same for SS chip (x 489.4, y 5.5) and CFC chip (x 646.7,
y 8.2): doubly separated, x decides.

Spot grid, moved pill, W 1401-2560 (step 10 + boundaries
1438/1510/1678/1900/2233/2435) x S 550-1300 (step 10 +
boundaries 583/634/661/700/782/851), rest + worst, all
above-1400 obstacles (4 chips, 2 pills, 12 cards, glyphs,
label), gated items only where their gates are open:
ZERO overlaps at h=28 AND at h=21. All three parks
(Seoul target, glyphs graze, posterwindow) are gone
at rest AND worst across the full grid.

Posterwindow height sensitivity: worst y 17.0 at H=355;
at H=372 exactly 0.0 (touching, not overlapping). The
margin survives height to 372px, as 02 claimed.

Converge (hover-only): moved pill clears the converged
band (center S/2+128.7, 02's band) in y at every S:
14.8px (h=28) / 18.3px (h=21) at S=550, growing with S
(32.3 at 600, 67.3 at 700, 277.3 at 1300). The current
pill's FAERS-converge residual is reproduced by my model
(overlap S~600-871, boundary ~889 by my convention;
brief says 591-871, same zone) and is GONE for the moved
pill at all S. Correction to synthesis wording: converged
Seoul is 96.2px x-separated from the moved pill @1401,
not 450px+ (that figure holds for SS 509.4 and CFC 666.7).
Seoul is still clear, doubly separated (x 96.2 + y 14.8).

## Laptop / tablet / hide confirmations

- Laptop pill byte-identical: the 1161-1400 rule
  (`bottom: 45% !important`) appears as unchanged context
  in the diff; no laptop line added, deleted, or modified.
- Tablet pill shows intact: right 40% (768-1000) and
  right 30% (1024-1160) rules present, untouched region.
- Strip hides, touch hide (`hover: none`), 900px hide,
  reduced-motion pill hide: all present, untouched regions.
  The diff's single hunk proves nothing else changed.
- Pills hide under reduced motion, so the move has ZERO
  reduced-motion impact; no H-band work needed or done.
- Miniature, tablet lanes, loop code, H3/H4/H6: untouched
  by grep (only the new pill rule added).

## Diff + build

- Diff: `src/sections/Hero.tsx`, 1 hunk, 9 insertions,
  0 deletions. No other file modified (round docs untracked).
- Build: PASS (5.92s). Em dash in diff: 0.

## Notes for the parent (not blockers)

1. The laptop rule's comment still says "Above 1400px the pill
   stays at bottom 30% (status quo)". That sentence is now
   stale. I left it untouched per the "exactly one rule"
   spec; an optional one-line comment fix is yours to take.
2. The viable alt (right 8% / bottom 15%) was NOT used;
   primary right 5% shipped as specified.

## Handoff for QA

- Thinnest worst margins: FAERS y 13.5px, posterwindow
  y 17.0px, both at (1401,550), both growing with W/S.
- Re-verify: the five binding pairs above, the spot-grid
  zero-overlap result, laptop pill byte-identical, and
  that no rule outside 1401+ changed.
- OUT OF SCOPE, must stay open (not fixed here): laptop
  CFC pill vs word tail (bottom 45% sits fully inside
  the glyph y-band at every S, covering the s column +
  period). It needs its own follow-up round; this fix
  does not touch it by construction.
