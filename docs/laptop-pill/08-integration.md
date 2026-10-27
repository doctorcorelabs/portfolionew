# 08 - Integration: laptop CFC pill bottom 45% -> 74%

Verdict: **SHIP** (disclosure-only conditions, no code blocker).
Base `d05a71c` + fixer diff, uncommitted. Parent commits + pushes.
Integration edited no source file and pushed nothing.

## 1. Reconciled verdict

Layout SHIP (no blockers), regression SHIP (no conditions), motion
CONDITIONAL SHIP (conditions §6 of 07, all disclosure-only). No QA
report contains a code blocker, so the reconciled verdict is SHIP:
the fix ships with the disclosures in §6 carried into the user's
final report, and no further code change is required or authorized
by this round.

## 2. Adjudications carried (settled, not re-litigated)

- Scopus 64.2px (fixer) governs over analysts' 60.6px: DbLogoFloat
  CONFIG tileWidth 100 + tilt 0.4 gives 64.24; 60.6 implies width
  104 with no tilt, which is Elsevier's width, not Scopus's.
  A 3.6px width slip, immaterial.
- Awards 35.8px (fixer) governs over analysts' 32.9px: recompute
  from the collage entry (right 27%, 168 wide, tilt 1.1) gives
  35.83; 32.9 is ~2.9px more conservative with no source basis.
- Poster-new 181.7px (fixer) governs over synthesis 184px: 181.7
  is tilt + float inclusive (0.72S-214.3); 184 is float-only
  (0.72S-212). Both hugely positive.

All three deltas are immaterial: every binding margin stays
positive under either figure, and the full-grid zero-overlap
verdict is unchanged.

## 3. Motion finding: FAERS path crossing CONFIRMED (duration corrected)

Synthesis predicted a FAERS converge-path crossing; QA-motion
confirms it on zone and depths and corrects it on duration.
Forced geometry: FAERS drift center x sits inside the converge
rect horizontally at every laptop width, so converged x equals
drift x and the path's x is CONSTANT during blend, with x-overlap
64.6-73.0px throughout. Vertically the endpoints straddle the
pill: drift ABOVE it (44.0px worst at (1161,550), h=28),
converged BELOW it on the rect top edge (35.7px worst). Both gaps
hold for all S >= 550 (drift gap 0.22S-77 > 0 for S > 350;
converged gap 0.24S-96.3 > 0 for S > 401).

Zone: whole laptop band W 1161-1400 x all S (x-overlap never
reaches 0: minimum 64.6px at W=1161). Depths: x 64.6-73.0px, y up
to full pill height (25.0px at h=28, 21.0px at h=21). Duration:
0.03-0.13s per transit (h=28 grid; 0.10-0.11s at h=21 corner),
CORRECTING the synthesis prediction of 0.3-0.5s, which was an
overestimate borrowed from seoul-pill geometry: here the blend
always settles in ~1s regardless of distance, and the pill band
sits in the fast middle of a 143-488px y-travel, so the chip
crosses the 53px overlap window in 0.13s at S=550, shrinking to
0.03s at S=1300. Retrace on hover-leave (same tau and smoothstep),
so the zone applies both ways. Hover-only, transient, endpoints
clean both sides, never a rest or endpoint park, structural
(shared by every above-band candidate, since the straddle holds
for all b > 67.5% at S=550), disclosure-only, not a reason to
pick a different bottom %.

SS/CFC/Seoul paths stay below the pill, no crossing: all three
converge to the rect bottom edge, box [S/2+114.7, S/2+142.7],
gap to the pill 246.7px at S=550, growing with S; their drift
boxes are below the pill too. Bottom-band converged chips clear
the pill by 246.7px at S=550, growing.

## 4. Seoul-pill width sensitivity: estimate, not measurement

The 184px Seoul pill width is a MODEL ESTIMATE from source
(label "Hypertension Seoul 2026" = 23 chars x 6.6px at 11px
JetBrains Mono 0.6em advance + tracking + padding/border 22px),
NOT a DOM measurement. The x-gap formula at W=1161 is
199.47 - w: w=184 gives 15.5px, w=191 (comment-implied) gives
8.5px, w=199 gives 0.5px, w=200 parks (-0.5px). Both
source-derived estimates pass with headroom, but the margin is
thin enough that the definitive check is a live render: the
parent's preview list MUST include a Seoul-pill vs CFC-pill gap
eyeball at W=1161-1200, and if rendered width ever exceeds 199px
the x-gap closes and right 14% must move. This sensitivity
constrains right 14%, not bottom 74%.

## 5. Final verification (integration re-run)

Diff: `src/sections/Hero.tsx` ONLY, 15 insertions / 10 deletions,
2 hunks; every deletion is a comment line or the one value line
(bottom 45% -> 74% !important, scope 1161-1400px unchanged, right
stays 14% inline); 0 rule deletions; 0 scope changes; 0 selector
changes. Build: PASS (6.24s, re-run after fixer). Em dash in
diff: 0. En dash in diff: 0. Dialkit strings in dist: 0.
Sciencedirect references in src: 0. FAERS masked check: NOT run,
same basis as the seoul-pill round: the diff is a CSS
pill-position value plus comments only, no FAERS data file or
value is touched, so there is nothing to leak.

## 6. Disclosure list for the user's final report

- Fixed: laptop CFC pill vs word tail (W 1161-1400 x all S),
  gone at rest + worst, via one number, bottom 45% -> 74%
  (1161-1400 rule); right stays 14%.
- Why 74%: maximin of (66.42%, 82%); FAERS 44.0 / frame 41.7;
  75% fallback, 70% last resort (1.0px), 80% thin, below-band
  impossible, x-only insufficient.
- Costs: jump doubles vertically (0.59S down = 324px @550 /
  767px @1300; horizontal unchanged 0.09W right); pill floats
  above frame top (41.7px @550, growing), aesthetic only.
- NEW transient confirmed: FAERS converge path crosses the
  moved pill on hover, whole band x all S, x 64.6-73.0px, y up
  to 25px, duration 0.03-0.13s per transit (CORRECTED from the
  0.3-0.5s prediction); endpoints clean (44.0 drift, 35.7
  converged); structural, not 74%-specific.
- Sensitivity: Seoul x-gap 15.5px holds iff rendered Seoul
  width <= 199px; live eyeball required at W=1161-1200; if width
  exceeds 199px, right 14% must move.
- Unchanged by construction: wide 15%/5%, tablet 40%/30%,
  chips, H3/H4/H6, loop, gates, durations, miniature, tablet
  lanes; no H-band work; zero reduced-motion impact (pills hide
  under reduced motion).
- Live-preview items: laptop 1161x550-650 (thinnest margins),
  Seoul-pill gap eyeball W=1161-1200, 1400/1401 jump, FAERS
  hover transit at laptop widths, tablet + phone spot-check
  only.
