# Final QA: hero rearrangement — VERDICT: PASS (for the rearrangement)

Date: Sun 2026-10-25 (QA round, uncommitted work on top of `0bb5b16`).
Scope: `src/sections/Hero.tsx` only (213-line diff). QA made NO source
edits; only these three docs were written. Do NOT push on this verdict
alone without reading the pre-existing section below — the parent
decides whether to push now and schedule follow-ups, or fix first.

## Verdict

PASS for the rearrangement itself:

- Every moved pair in every rearrangement band is clear: review-new
  (36%/2% at 1161-1400, 44%/2% at 1024-1160 gated VH >= 850),
  poster-new (bottom-right at 1161-1400, 1024-1160 gated VH >= 810,
  720-1000 gated VH >= 790), logo stack (Cochrane/Scopus 62% at
  1161-1300, Scopus 62%/2% + Cochrane 21%/15% at 1301-1400), and all
  three companions in-band (StrokeSense 0.45, Seoul 0.70, CFC pill
  45%). Zero true overlaps, excluding tuck class.
- Every renderable claimed margin reproduces (see 02-verification.md):
  review-chip +1.72, review-helix +0.91, tablet-review-label +10.20 /
  +2.52, stack +19.20 at first rendered height, Scopus-SeoulPill
  +2.63 / +6.53, poster-SeoulChip +29.51, poster-CFC +14.25,
  poster-awards +21.62. Two claimed figures do not reproduce as
  stated (Cochrane-SeoulChip 3.3px = stale pre-companion anchor;
  1301-Scopus-SeoulChip 13.8px = untied to this pair's geometry) but
  both pairs are clear by wide margins (376px / 408px in y), so
  neither is a blocker.
- No regressions: laptop-logos mechanism, de-overlap gates, mobile
  stack, 719px block, above-1400 layout all intact; B1 gate deleted
  as briefed; 1001-1023 strip coherent for both cards.
- Build PASS (4.72s). Greps clean: dist dialkit 0, dist em dash 0,
  src em dash 0, src sciencedirect 0, src DbLogoRow 0, Hero.tsx
  dialkit 0. FAERS masked check clean (28 src + 9 dist hits, all
  coincidental style literals, no leak).

## Round blockers: NONE

No overlap introduced or worsened by this round. No claimed margin
fails. No scope leak above 1400px or below 720px. No gate, show-rule,
or hide rule deleted except the briefed B1 gate.

## Pre-existing findings (NOT round blockers, parent decision required)

These five true overlaps predate this round and are unchanged by its
diff. They are listed here (not buried) because two of them are
visible at common laptop sizes. Under a strict "zero overlaps
anywhere" gate they would fail; under this round's scope they do not
block shipment, since pushing the rearrangement neither creates nor
worsens them. Recommended: PUSH the rearrangement, then schedule
these as the next fix round, in this order:

1. P1 — Review-old vs Seoul pill above 1400px (rest overlap below
   VH ~834; worst-phase below VH ~896; at 1440x800: 9.78px deep x
   176px wide). Most visible: 1440x800 is a common laptop size.
2. P2 — Review-old vs StrokeSense chip 0.33 above 1400px, widths
   1401-1522 (rest overlap below VH ~856; worst below VH ~883; up
   to 13.18px over review's edge for ~39% of the loop).
3. P4 — Cochrane-fallback vs docking at W 1301-1345, VH 751-800
   (rest overlap 7.69px x 83.19px).
4. P3 — Cochrane vs FAERS chip at 1301-1400 and above 1400,
   VH 751-797 (worst-phase up to 6.95px).
5. P5 — FAERS chip vs docking at W < ~1471, S < ~780 (up to ~9.9px
   rest / ~18px worst over docking's edge for ~33% of the loop;
   neither item is moved by this round).

Plus one correction to a prior flag (not a blocker): the CFC-pill vs
PosterWindow flag's "55.5px rest overlap at VH 650" is a
mismeasurement — the true overlap depth is 25px (the full pill
height); its thresholds (rest zero ~VH 746, worst zero ~VH 776) are
confirmed within ~2px.

## Disclosed residuals (accepted with this shipment)

- Review label tuck below VH ~845 worst (x-lens 146.74px ink, depth
  up to full 14.40px label height at S=550). Tuck class.
- Converge hover-transient: converged StrokeSense chip overlaps
  review-new below VH ~737 (hover-only; drift clean).
- Seoul chip 0.70 vs awards graze: x-lens 148px, rest overlap below
  VH ~706, worst-phase below VH ~766, y-depth up to 14.71px at
  VH 650 (~52% of the drift loop). The most severe disclosed
  residual; watch for a user complaint and nudge awards/chip if so.
- Poster frame/glyph tucks at short stages (frame up to 78.95px deep
  at 1161/VH 650; glyphs up to 50.95px; clear by VH 800). Tuck class.
- Scrollbar-edge converge offset (StrokeSense, classic scrollbars,
  innerWidth 1401-1415 only, hover-only, no card overlap). Minor.
- 720-740 stack hairline H1 (Cochrane-Elsevier worst -0.19px at
  VH 751 only; accepted in laptop-logos).

## Files

- `docs/rearrangement/01-moves.md` — landed positions per band,
  companions, scope table, scrollbar-edge analysis.
- `docs/rearrangement/02-verification.md` — pair grid, claimed
  margins, residuals, pre-existing findings, regression checklist,
  build/greps/FAERS results.
- `docs/rearrangement/03-final-qa.md` — this verdict.
- QA model scripts (scratch, not in the repo): `/tmp/rearrangement_qa.py`,
  `/tmp/rearrangement_qa2.py`.
