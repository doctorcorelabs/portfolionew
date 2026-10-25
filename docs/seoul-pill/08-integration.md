# Integration: Seoul-chip vs CFC-pill fix

Base: HEAD `5fd1ccf` + fixer change (uncommitted). QA verdicts:
layout SHIP, regression SHIP, motion CONDITIONAL SHIP (disclosure
only). This pass adjudicates the one disagreement, fixes the stale
comment, and re-verifies. NOT pushed (parent owns commit/push).

## 1. Adjudication: QA-motion governs, QA-layout endpoint reasoning fails

The disagreement is real and decidable from first principles.
FAERS drift sits BELOW the moved pill (drift gap 13.5px worst:
chip top 0.90S vs pill bottom 0.85S) while FAERS converged sits
ABOVE it (converged gap 14.8px worst: rect bottom edge S/2+128.7
vs pill top 0.85S-25, floated). A blend path between two endpoints
on OPPOSITE sides of an obstacle MUST cross the obstacle's y-band;
whether it overlaps is decided by x during that window, not by the
endpoint gaps. QA-layout's "endpoints clear therefore path clear"
holds only when both endpoints are on the SAME side of the pill,
which is true for Seoul (see below) and false for FAERS.

Independent recompute (script `/tmp/adjudicate_path.py`, smoothstep
blend, rest-center drift, float 0) confirms QA-motion exactly at
the binding corner: at 1401/550 the FAERS path crosses the pill
with 44.0px x-overlap and full 25px y-overlap. One refinement:
my box-worst model gives a WIDER zone edge than QA-motion
(1401-1760 at S=550, widening to 1401-1848 at S=1300, vs
QA-motion's 1401-1651 short to 1401-1776 tall), and drift-blended
box-worst 64.0px at 1401/550 (vs QA-motion's ellipse-aware ~53px).
The disclosure below carries the WIDER, conservative bounds.

Seoul paths are clear under BOTH analyses, as expected: Seoul
drift and converged sit on the same side of the pill (drift y
[382.25, 410.25] vs converged y [382.2, 410.2] at 1401/550) and are
x-separated by 96.2px rest / 76.2px worst. SS/CFC paths sit far left
of the pill. The FAERS path crossing is therefore the ONLY new
transient this fix introduces, and it is hover-only, transient
(~0.3-0.5s per transit, retrace on hover-leave), never a rest or
endpoint park: same class as prior disclosed blend effects. It
does NOT block shipment.

## 2. Stale comment fixed (comment-only, verified)

The laptop CFC rule comment said "Above 1400px the pill stays at
bottom 30% (status quo)". Replaced with "Above 1400px the pill
moves to bottom 15% / right 5% (wide rule below, min-width
1401px)". Diff proof: the comment edit changes 2 comment lines
to 3 comment lines; NO rule, value, scope, or selector changed.
`grep "status quo"` in Hero.tsx now returns 0.

## 3. Final diff + verification

Final diff: `src/sections/Hero.tsx` ONLY (one hunk: comment fix +
9-line fixer rule, 0 rule deletions). No other file modified
(round docs untracked). Build: PASS (5.53s, after comment fix).
Em dash in diff: 0. En dash in diff: 0. Dialkit strings in dist:
0. Sciencedirect references in src: 0. FAERS masked check: NOT
run, same basis as the desktop-parks round: the diff is a CSS
pill-position rule plus a comment, no FAERS data file or value
is touched, so there is nothing to leak.

## 4. Corrections carried (not re-litigated)

(a) Elsevier rest figures are tilt-inclusive in QA-layout
(x 131.0, y 2.3) vs untilted in the fixer (132.3/5.0); worst
figures agree exactly (131.0, -5.7). (b) The "rest >= 250px"
claim in 02/synthesis is WRONG: thinnest rest margins are
glyphs x 26.5, posterwindow y 27.0, FAERS y 27.5 (all at
1401/550); worst-phase margins govern, all positive, sweep
clean - documentation fix only. (c) Synthesis item (d5)
">=450px @1401" corrected: converged Seoul vs moved pill is
96.2px rest / 76.2px worst (doubly separated), SS 509.4/489.4,
CFC 666.7/646.7.

## Verdict: SHIP (disclosure-only conditions)

All three QA verdicts allow shipment; the only conditions are
the disclosures in section 5. No code blocker exists.

## 5. Disclosure list for the final report

- FIXED: Seoul-chip vs CFC-pill rest park (W 1401-1900, all S,
  up to 29.9 x 6.5px), PLUS two previously unnoticed pill parks
  the move also clears: glyphs graze (rest W<1678 x S<584, up
  to ~100 x 6.7px) and posterwindow (rest W<2435 x S<644, up to
  ~119 x 55.5px). Prior scans covered chip-vs-card and
  chip-vs-pill only, never pill-vs-card or pill-vs-glyph.
- FIXED as a side effect: FAERS-converge-vs-CFC-pill ENDPOINT
  residual (S 591-871) from the desktop-parks round. Moved pill
  clears every converged chip in y at every S (14.8px at S=550,
  growing). Other FAERS converge residuals (Seoul chip,
  posterwindow) are chip-vs-chip / chip-vs-card and unaffected.
- NEW transient introduced by this fix (QA-motion, confirmed by
  independent recompute): FAERS converge PATH crosses the moved
  pill on hover, W 1401-1760 at short stages widening to
  W 1401-1848 at tall stages, up to 44.0px x / 25px y rest-center
  (up to ~64px x box-worst drift-blended, ~53px ellipse-aware),
  ~0.3-0.5s per transit, endpoints clean both sides (drift
  13.5px, converged 14.8px). Hover-only, never a rest park.
- OPEN follow-up, NOT fixed here: laptop CFC pill vs word tail
  (bottom 45% at 1161-1400 sits fully inside the glyph y-band
  at every S, covering the s column + period). Needs its own
  round; this fix cannot touch it (scope disjoint by
  construction).
- Accepted costs: pill jumps across 1400/1401 (bottom 45% /
  right 14% to bottom 15% / right 5%, same class as chip
  companion jumps); pill relocation is more visible than a chip
  move (labeled fact vs drifting cursor); thinnest worst
  margins FAERS y 13.5px / posterwindow y 17.0px at (1401,550),
  both growing with W/S (posterwindow margin survives height
  to 372px, measured 355).
- UNCHANGED by construction: Seoul chip (all bands), all other
  pills, H3/H4/H6, tablet, miniature, loop code, gates,
  durations, phases, dart-dwell, converge tau 0.22 / halo 20.
- Live-preview items: desktop 1401x550-650 (thinnest margins),
  1440x800-900 (pill corner spot-check), 1400/1401 jump,
  FAERS hover transit at W 1401-1760 (new path crossing),
  tablet + phone spot-check only.
