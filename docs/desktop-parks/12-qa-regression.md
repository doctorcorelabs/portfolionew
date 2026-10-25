# 12 - QA Regression: non-desktop surfaces (desktop-parks round)

Verdict: REGRESSION-PASS. Every non-desktop surface checks out; one
pre-existing finding (§7) is disclosed, not a blocker. Base HEAD
`15c3ed9` plus uncommitted fixers 1-3. Method: full `git diff` hunk
list (11 hunks, all in expected regions) plus base-vs-current
extraction diffs for TABLET_ANCHORS and FACT_PILLS.

## CSS changes found (complete list)

| Change | Scope |
|---|---|
| SS companion rule `top: 45%` to `right: 45%` (1161-1400) | In scope, fixer 2 |
| FAERS laptop rule added `right: 15% / top: 4%` (1161-1400) | In scope, fixer 1 |
| H1/H2/H5 blocks deleted, H-band comment rewritten | In scope, fixer 3 |
| Comment-only edits (MINI pin, laptopMql, review-move) | In scope, docs |
| Everything else in the stylesheet | UNCHANGED (see below) |

No gate, tablet, pill, miniature, seam, or reduced-motion rule was
added, deleted, or moved outside the three items above.

## 1. Tablet: PASS

- TABLET_ANCHORS values byte-identical (lines 133-160 extraction
  diff empty): portrait-narrow FAERS 0.42/0.78 R20, SS 0.02/0.38
  R14, CFC 0.24/0.45 R14, Seoul 0.59/0.67 R20; portrait-wide CFC
  0.38, Seoul 0.685 (others same as narrow); landscape FAERS
  0.30/0.78 R24, SS 0.38/0.70 R24, CFC 0.68/0.6825 R24, Seoul
  0.52/0.78 R24.
- Loop reads TABLET_ANCHORS first in the tablet band (line 632-633:
  `heroBand === "tablet" ? TABLET_ANCHORS[tabletSubBand][...]`),
  so the new laptop companions (FAERS 0.85/0.04, SS 0.55) are
  skipped there; no desktop anchor value can leak into tablet.
- Labels and CURSOR_CHIPS order untouched (first hunk changes only
  the FAERS and SS lines), so the label-string lookup is intact.
- Pill shows intact: pills forced none in the tablet block, CFC
  re-shown right 40% (768-1000) / right 30% (1024-1160), FAERS
  re-shown only at min-height 1091px (both bands), Seoul pill
  never re-shown (hidden at tablet). Strip pill hide intact at
  720-767 + 1001-1023 (line 1659 block).
- Show-rules intact (lines 1523-1569, no hunk touches them):
  stickers 951, notify 882, posterwindow 790 (741-1000) / 810
  (1024-1160), awards 1024-1160 only.

## 2. Miniature: PASS

- FAERS miniature is exactly (0.26, 0.30): anchorX override 0.26
  untouched, anchorY PIN added (fixer 1) evaluating to 0.30,
  which equals the base miniature position (base desktop FAERS
  anchorY was already 0.30). The chip did NOT move.
- SS override (0.60, 0.34) byte-untouched; Seoul anchorX override
  0.70 untouched; Seoul anchorY (0.695) and CFC (0.30, 0.695)
  flow through from untouched CURSOR_CHIPS lines.
- Mini chip JSX (line 2199) carries `className="mv-mini-chip"`
  and no `data-chip` (grep: zero matches), so no H-band can
  touch it, same as base.
- Miniature loop (lines 700-757, no hunk touches it) is
  drift-only by its own comment and code: no converge, no
  word-rect mapping (wordRect appears only in the section loop,
  lines 616-620), runs only when `heroBand === "miniature"`,
  offscreen skip + tab-hidden pause via rAF.
- Seoul-miniature transient UNCHANGED: every input to its
  geometry (miniature overrides, Seoul/CFC anchors, radius 40,
  durations/phases) is identical to base, so rest clear 12.5,
  worst 23.5 design / 7.9 visual at 390px, 7.04s/cycle all stand
  exactly as disclosed in the cursor round. Not worsened, not
  fixed (out of this round's scope, as briefed).

## 3. Pills: PASS

- FACT_PILLS byte-identical (extraction diff empty): Seoul pill
  left 59% top 32%, CFC pill bottom 30% right 14%, FAERS pill
  top 62% left 7%.
- CFC pill laptop rule bottom 45% (1161-1400) intact; FAERS
  pill 1090 hide (line 1365) and 1091 tablet shows intact.
- Reduced-motion pill hide present at lines 1724-1727, after
  the tablet pill shows (1616-1621), so source order still
  beats them. No pill rule added, deleted, or moved.

## 4. Gates: PASS

All gate thresholds present at their shipped values, in regions
no hunk touches: notify 881 hide / 882 show, stickers 951,
microscope 800 (via 801 rules), helix 750, Cochrane 751/801,
review-new 850, poster-new 810/790, FAERS pill 1090/1091.
The only @media changes are the in-scope items in the table
above. No @media rule definition changed otherwise.

## 5. Seam + gating: PASS

- `heroBand` (line 456) and `tabletSubBand` (line 478) defs,
  `miniScale` clientWidth logic (lines 420-448), and the
  `:not(.mv-hero-mini)` scope (lines 1643-1660) are all in
  untouched regions. The 720-734 classic-scrollbar seam
  mechanism is therefore identical: miniature active via
  clientWidth, section chips suppressed by the scope, mini
  chips static (miniature loop gated on viewport-media
  heroBand), no doubles.
- Loop gating intact: section loop early-returns in the
  miniature band and under reduced motion; miniature loop
  gated to its band; IntersectionObserver visible-state
  logic present in both base and current (line shift only).

## 6. Reduced-motion (non-desktop): PASS

- Miniature guard intact: `animation: none !important` for
  mini-chip, collage, and float under reduced motion.
- Tablet reduced-motion intact (loop early-return, no hunk
  in that region).
- H3 (Seoul/awards, 1161-1400, VH <= 680), H4
  (Seoul/posterwindow, 1401-1600, VH <= 708), H6 (CFC/gutaxis,
  1401+, VH <= 824) appear as unchanged context lines in the
  H-band hunk, in place after the tablet block, with the
  reduced-motion pill hide after them. Fixer 3's spot-check
  confirmed. Note (not a regression item): H4's 2px VH
  under-coverage sensitivity at posterwindow height 357
  stands as fixer 3 disclosed it; selectors are intact.

## 7. New finding review: Seoul-base chip vs CFC pill

Reproduced from BASE values, so pre-existing: Seoul chip
(0.80, 0.695), right-anchored, 109x21; CFC pill bottom 30%
right 14%, 114x25. X overlap width = 114 - 0.06W, positive
for W < 1900 (29.9px at W=1401, 0 at W=1900). Y overlap
depth = 0.005S, i.e. 2.8px at S=550 to 6.5px at S=1300.
Zone: W 1401-1900, all S. Below 1400 the CFC pill sits at
bottom 45% (clear); above 1900 x-clear. Proof of
pre-existence: the Seoul CURSOR_CHIPS line is an unchanged
context line in the first diff hunk, FACT_PILLS is
byte-identical, and no prior scan covered chip-vs-pill
pairs (H-bands are chip-vs-card only). Neither element
moved in this round.

Judgment: DISCLOSE as a residual, DO NOT BLOCK shipment.
Reasons: it predates this round and no fixer caused it; it
is shallow (max 6.5px deep) and the pill paints above, so
it reads as the pill slightly covering a chip corner, not
a broken layout; and every fix needs a parent decision
(Seoul move touches H3/H4, CFC pill move touches pill
clearances, a W 1401-1900 all-height chip hide is a large
behavioral change). It is the most visible of this round's
residuals only because it is a rest overlap rather than a
transient, but it is the same disclosure class as the
SS-gutaxis transient, the FAERS converge residuals, and
the Seoul-miniature transient. Recommend a separate
follow-up decision (pill move vs chip move vs band);
do not sneak a fix into this ship.

## Verdict

REGRESSION-PASS. No condition on shipment from the
non-desktop surfaces. The single action for the parent is
the §7 disclosure in the final report.
