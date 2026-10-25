# Synthesis: Seoul-chip vs CFC-pill fix

Base: HEAD `5fd1ccf`. Park: Seoul-base chip vs CFC pill REST overlap,
W 1401-1900 x all S (Seoul (0.80, 0.695) right-anchored 109x21; CFC pill
bottom 30% right 14%, 114x25; x-overlap 114 - 0.06W, y-overlap 0.005S).
Chip hide is rejected by the brief. Reports reconciled: 01 (Seoul lane),
02 (pill move), 03 (impact).

## Verdict: OPTION 2 (CFC pill move), no override

Option 2 wins on mechanics by every measure that governs shipment. No
flaw was found in it under governing chip height 28 or posterwindow
height sensitivity (see flaw check below), so the default steer stands.
Option 1 is documented as the fallback only if the parent dislikes the
pill jump on visibility grounds, not on mechanics.

## Comparison

| Measure | Option 1: Seoul 0.80 -> 0.77 | Option 2: pill bottom 15% / right 5% (1401+) |
|---|---|---|
| Target park | Fixed at rest; worst transient pill 7.91px | Fixed at rest AND worst (Seoul x 76.2px @1401/550) |
| Worst overlaps left | Desk 14.46, posterwindow 12.80 (drift-only, under 16px standard) | ZERO worst overlaps, full grid W 1401-2560 x S 550-1300 |
| Parks fixed | One | THREE: Seoul target, glyphs graze (rest W<1678 x S<584, ~100 x 6.7px), posterwindow (rest W<2435 x S<644, ~119 x 55.5px) |
| Converge | Improved, NOT eliminated: pill zone shrinks to W 1401-1486 / max 7.91, posterwindow shrinks, but desk hover zone is NEW, and converged-FAERS zone extends to 2560 | FIXES the disclosed FAERS-converge-vs-CFC-pill residual (S 591-871): moved pill clears every converged chip in y by >= ~15px @550 |
| Parallax-extreme | Desk 22.46, posterwindow 20.80 (over standard, mouse-only) | None disclosed (pills ignore parallax) |
| Mechanism touched | CURSOR_CHIPS base + H4 deletion (after independent rest scan) | ONE scoped CSS rule; no loop, no converge, no H-band, no miniature, no tablet |
| Thinnest rest margins | Desk 5.54 tilt-incl., posterwindow 7.20, pill x 12.09 | Rest >= 250px (all pairs @1401/550) |
| Visibility cost | Low (drifting cursor moves 0.03W) | Higher (labeled fact moves corner); pill jumps across 1400/1401, same class as existing chip companion jumps |

## Flaw check: no Option 1 override

- Chip height 28 (governing): 02 states it changes NO primary binding
  margin (all are x-gaps or pill-top gaps); it matters only for the
  rejected fallback (right 14% / bottom 15%: Seoul y 8.3 at h=28).
- Posterwindow height: the 17.0px worst margin at (1401,550) survives
  posterwindow height to 372px (measured 355, QA-layout). No sensitivity
  failure.
- Rest margins: >= 250px, so no rest park can hide in an unmodeled
  corner of the grid. The sweep covered W 1401-2560 plus boundaries
  (1438/1510/1678/1900/2233/2435) and S 550-1300 plus boundaries
  (583/634/661/700/782/851), rest + worst.
- The one genuine Option 2 cost is aesthetic (a labeled fact visibly
  relocates, and it jumps across 1400/1401). That is a parent taste
  call, not a mechanics flaw, and the codebase already accepts
  companion jumps of the same class.

## (a) Laptop pill vs word: OUT OF SCOPE, disclose only

02 found the laptop CFC pill (bottom 45% at 1161-1400) sits fully
inside the glyph y-band at every S, covering the s column nearly fully
and part of the period. NOT fixed here: the brief forbids laptop
changes, and a laptop fix is non-trivial (word tail above, bottom-right
poster below, laptop Seoul chip to the left). The fixer MUST scope the
new rule to exactly `min-width: 1401px`, disjoint from the laptop
1161-1400 rule by construction, so laptop is untouched. Flag it as its
own follow-up round.

## (b) Pill float: governing value is -10px

The brief said -8px; shipped `mv-float` keyframes say -10px. All 02
margins use -10px (conservative; -8px would add 2px to every pill-top
margin). QA must use -10px too.

## (c) Implementation spec (fixer implements exactly this)

Add immediately AFTER the laptop CFC rule (`@media (min-width: 1161px)
and (max-width: 1400px)` block, `Hero.tsx` near line 1503):

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

- `!important` on BOTH properties is required: the inline style sets
  bottom 30% / right 14%.
- Do NOT edit FACT_PILLS inline styles: that would move the laptop and
  tablet pills too.
- Do NOT touch chips, H-bands, gates, durations, or any other pill
  rule. Position-only, never `display` (display is the hide/show
  mechanism for touch / 900px / strip / tablet / reduced-motion).
- No H-band work: pills hide under reduced motion, so a pill move has
  ZERO reduced-motion impact. H3/H4/H6 stand untouched.
- If the parent dislikes right 5%, the viable alt is right 8% /
  bottom 15% (Seoul x 34.1px, glyphs y 65.8px, same FAERS /
  posterwindow margins). Do NOT use right 14% / bottom 15% (elsevier
  x 5.0px tilt-incl., too thin).

## (d) QA must re-verify

1. Worst-phase gaps at (1401,550): FAERS y 13.5, posterwindow y 17.0,
   Seoul x 76.2, glyphs x 26.5, elsevier x 131.1; plus a spot grid over
   W 1401-2560 x S 550-1300; plus build.
2. Laptop pill byte-identical (bottom 45% at 1161-1400); word-tail
   finding unchanged and still open as its own follow-up.
3. Tablet pill shows (right 40%/30%), strip hides, touch hide, 900px
   hide, reduced-motion hide: all intact (no rule added outside 1401+).
4. Miniature, tablet lanes, loop code, H3/H4/H6: untouched by grep
   (only the new pill rule added). No H-band change needed.
5. Converge spot-check: FAERS-converge-vs-CFC-pill residual gone;
   converged Seoul/SS/CFC chips x-separated from the moved pill by
   >= 450px @1401.

## Fixer order

Single fixer (one CSS rule, no sequencing constraint): implement the
rule above, verify item (d1) + build, write the implementation note.
Then QA (layout + regression in parallel, or one combined pass), then
parent commit + push. No synthesis-level second phase is needed.

## Disclosure list for the final report

- Fixed: Seoul-chip vs CFC-pill rest park (W 1401-1900, all S), PLUS
  two previously unnoticed pill parks the move also clears: glyphs
  graze and posterwindow (deepest, ~119 x 55.5px rest). Prior scans
  covered chip-vs-card and chip-vs-pill only, never pill-vs-card or
  pill-vs-glyph, which is why they survived.
- Fixed as a side effect: FAERS-converge-vs-CFC-pill residual
  (S 591-871) from the desktop-parks round. Other FAERS converge
  residuals (Seoul chip, posterwindow) are chip-vs-chip / chip-vs-card
  and are unaffected by a pill move.
- Open follow-up (NOT fixed here): laptop CFC pill vs word tail
  (bottom 45% sits fully inside the glyph y-band at every S, covering
  the s column + period). Needs its own round.
- Accepted costs: pill jumps across 1400/1401 (bottom 45% -> 15%,
  right 14% -> 5%); pill relocation is more visible than a chip move
  (labeled fact vs drifting cursor); thinnest worst margins FAERS y
  13.5px and posterwindow y 17.0px at (1401,550), both growing with W
  and S.
- Unchanged by construction: Seoul chip (all bands), all other pills,
  H3/H4/H6, tablet, miniature, loop, gates, durations.
