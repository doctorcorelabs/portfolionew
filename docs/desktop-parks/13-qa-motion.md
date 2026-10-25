# 13 - QA-motion: desktop-parks anchor round

Base `15c3ed9` + fixers 1-3 uncommitted changes. Method: independent code read
of `src/sections/Hero.tsx` (all line numbers below are post-fix) + own Python
model (`/tmp/qa_motion.py`, not committed). Read-only: no source edited, no
build, no push. Companion docs: 00, 06, 08, 09, 10.

## Verdict: CONDITIONAL

All 7 motion-mechanism items PASS. The conditions are disclosures, not motion
changes: the FAERS-wide converge endpoint parks, the SS-gutaxis parallax-worst
transient, the SS-CFC 1.2px thin margin, and fixer 3's pre-existing
Seoul-chip vs CFC-pill rest park must stay disclosed in the final report.
No motion-code change is required. A flat PASS would misrepresent the
converge endpoints (item 7), so I do not flatten them.

## Items

| # | Item | Verdict | Evidence |
|---|---|---|---|
| 1 | Durations/phases | PASS | CURSOR_CHIPS: FAERS 12/0, SS 14/0.3, CFC 11/0.55, Seoul 15/0.8 (unchanged; fixers touched anchors only). MINI derives via `...chip` spread, overriding radius/anchors only, so durations/phases/colors stay in sync. TABLET_ANCHORS carries anchorX/anchorY/radius only; both loops read `chip.duration` (section line 655, miniature line 748). |
| 2 | Dart-dwell | PASS | Formula intact in both loops: `theta = psi + 0.35*sin(2*psi)` (lines 656, 749). Angular factor `1+0.7cos(2psi)` spans exactly 0.3x-1.7x. Recomputed linear speeds (r=20): FAERS mean 8.97/peak 12.88, SS 7.69/11.04, CFC 9.79/14.05, Seoul 7.18/10.30 px/s - matches the corrected cursor-round numbers (mean 7.2-9.8, peak 10-14), NOT the old ~19 claim. Speed formula has no anchor term: anchor moves change the ellipse center only. Boxes unchanged: desktop ±20/±14, miniature 40 design px, tablet radii 14-24. |
| 3 | Converge + companion wiring | PASS | Tau 0.22 (line 687: `1-exp(-dt/0.22)`), halo exactly 20px (lines 617-620, all four edges), hover via h1 enter/leave (2144-2145) + live ref (545-546, 621). Touch: `if (!canHover)` writes drift and returns BEFORE any converge math. Miniature loop has no word-rect mapping at all. Parallax ±8 mouse-only + reduced-motion early return (771-778). Wiring table below: JS == CSS base in both bands, no mismatch, hence no blocker. |
| 4 | Scroll modulation | PASS | `clamp(-top/height, 0, 1) x 0.25` in both loops (610-614, 739-742), computed before the forEach/touch branch. Miniature loop has no hover gate. |
| 5 | Loop gating | PASS | Section loop early-returns under reduced-motion or heroBand miniature; miniature loop under reduced-motion or heroBand != miniature. Band state from cached matchMedia listeners (never per-frame queries; laptopMql is one object, `.matches` is a live flag). `offsetWidth === 0` skip in both loops; offscreen skip via stageRect checks; rAF gives tab-hidden pause inherently. Deps `[heroBand, tabletSubBand]` / `[heroBand]` re-run effects on band change. Tablet revival scoped `:not(.mv-hero-mini)`: the 720-734 seam is unchanged (mini chips static, section chips hidden, no doubles). |
| 6 | Reduced-motion | PASS | Both loops return early; chips sit at base; entrance fades killed (section chips/pills `animation: none !important` 1051-1055; mini chips 1953-1956; miniature collage float killed). Pills hidden everywhere under reduced-motion (1721-1727, after the tablet block). H1/H2/H5 deleted: grep confirms only 3 reduced-motion desktop bands remain (680/708/824). Deletion valid: fixer 3's rest scan is zero parks at h=21 and h=28, and I spot-verified the thinnest pair (SS-gutaxis rest 6.6px mine, tilt-inclusive, vs 6.9 fixer 3 - positive). H3/H4/H6 present with unchanged selectors. Carried sensitivities, not blockers: H4 under-covers 2px VH if posterwindow is 357 tall; H6 h=28 graze VH 825-848; collage float still bobs (Seoul-awards to ~VH 703, CFC-gutaxis to ~VH 861). |
| 7 | Crossing durations (spot) | PASS* | Cyclic motion passes; two structural residuals exceed (see table). Standard applied: desktop transient depth ~16px (cursor round). The miniature 3s/12px budget does NOT apply to desktop - different surface, different governing standard. |

## Companion wiring: JS anchor == CSS base

| Chip | Band | JS (loop effAnchor) | CSS base | Match |
|---|---|---|---|---|
| FAERS | wide | (0.90, 0.90) | JSX right 10% / top 90% | yes |
| FAERS | laptop | (0.85, 0.04) | right 15% / top 4% `!important` | yes |
| StrokeSense | wide | (0.505, 0.70) | JSX right 49.5% / top 70% | yes |
| StrokeSense | laptop | (0.55, 0.70) | right 45% `!important` + inline top 70% | yes |
| Seoul 2026 | laptop | 0.70 (unchanged) | right 30% `!important` | yes |

SS anchorY companion branch is deleted from effAnchorY (falls to
`chip.anchorY` = 0.70); the old CSS `top: 45%` rule is gone. Right-anchor
math agrees on both sides (CSS `right: X%` = loop `anchorX*W - chipW0`).
Tablet path is untouched (loop and JSX read the same TABLET_ANCHORS table).

## Crossing durations (my model, worst case 1401x650 unless noted)

| Pair | Depth | Duration | Judgment |
|---|---|---|---|
| SS-gutaxis, drift-only (px=0) | 13.4px | 3.98s continuous per 14s cycle (28.4%) | Inside 16px standard |
| SS-gutaxis, parallax held at extreme (px=8) | 21.4px (fixer 2: 21.0) | longest run 6.79s | Exceeds depth, but requires pointer pinned at extreme + worst drift phase at once; not cyclic. Disclosed structural residual (needs a card move), not a motion failure |
| SS-CFC base | never overlaps; min gap 1.28px (fixer 2: 1.2) | <2px for 0.44s per 154s beat; longest <5px run 1.02s | Fleeting instant, explicitly accepted - not 21.2px |
| FAERS-wide converge (hover endpoints) | up to full chip | unbounded while hover lasts | FAILS 06's "endpoints must be clean" as geometry: CFC pill (W<1996, S 591-896), Seoul chip (W 1705-2445, S<786; persistent at 2000x700), posterwindow (W<1862, S 550-571). Mechanism-confirmed by me: converged band is bottom-edge and anchor-independent in y, and FAERS-wide center sits right of the expanded word rect for all W>=1401, so it converges to the bottom-right word corner. No anchor is both drift-clean and converge-clean (drift needs aY>=0.76, converge-from-above needs aY<=0.31 at S=550). Needs a pill move, height-companion, or converge-behavior change - all out of scope |

## Conditions for ship

1. Final report discloses: FAERS-wide converge endpoint parks (above);
   SS-gutaxis parallax-worst 21px transient (drift-only 13.4px is in budget);
   SS-CFC 1.2px thin margin; fixer 3's pre-existing Seoul-chip vs CFC-pill
   rest park (W 1401-1900, all S, up to ~26px wide, 2.8-6.5px deep, pill
   paints above the chip corner, no H-band covers chip-vs-pill).
2. No motion-code change. If the parent wants the converge endpoints fixed,
   that is a new round (pill move or converge-behavior change), not a QA
   condition on this one.
