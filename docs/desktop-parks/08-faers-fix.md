# 08 - Fixer 1: FAERS lanes (desktop-parks round)

Shipped: laptop (0.85, 0.04), wide (0.90, 0.90), miniature FAERS-Y pinned 0.30.
Drift is fully clean at both desktop bands. Wide converge has three hover-only
residuals, disclosed below, which no drift-clean wide anchor can avoid.
(0.91, 0.75) was not used anywhere. SS, Seoul, CFC, tablet, pills, gates,
durations, phases, radii, labels, and CURSOR_CHIPS order are untouched.

## DEVIATION: synthesis wide (0.37, 0.35) is REFUTED, not shipped

Independent model (boxes validated against 03, current anchor reproduces
01's parks) shows (0.37, 0.35) REST-PARKS on the search window at ALL wide
widths for S <= 701 (VH <= 801), worst-phase to S = 750. At 1401x650 the chip
(518.4, 192.5)-(591.4, 213.5) sits entirely inside search (502.4, 8.7)-
(766.4, 244.3). Coarse grid: 45 rest + 10 worst search problems, plus 3 glyph
worst contacts (i-dot, dx 10-29px, dy 1.8px at S = 550, W >= 1800). Root cause:
04's "search worst y-clear 34.5px" implies a ~147px search height; the shipped
search is 231px tall (component part sum, 03 table, 01 sizes). Same error
class as 04's laptop anchor. Shipping (0.37, 0.35) would trade a fixed drift
park for a new, unconditional one on the very card the SS fix clears. The
wide lane was therefore re-searched (sweep below) instead of implemented
as briefed. QA must treat the synthesis wide adoption as superseded.

## Laptop (0.85, 0.04): verified clean

Model: dense grid W 1161-1400 step 5, S 550-1300 step 5, chip heights 21/24/28,
stage-minus-15 (classic scrollbar) sensitivity. Result: 0 drift problems,
0 converge endpoint problems (footprint method, cards/pills/chips).

Binding worst margins (singly-separated, the true constraints): CFC pill
y 205.5px, poster y 259.7px (both at 1161x650). Doubly-separated thin axes
(robust, other axis large): Seoul pill x 24.9px (y 109px), cochrane y 25.5px,
scopus y 30.6px, awards x 37.2px. Chip-chip: vs SS-current worst 176.5px (y),
vs SS-new companion (0.55, 0.70) worst 235.3px (x; rest 275.3px), both at
1161x650. Converge: clean vs every card, pill, and chip; only the frame
top-border straddle (2.5px, accepted tuck class: border only, transparent
interior, chip is z2 above frame z1). Sweep clean region: aX 0.78-0.98 x
aY 0.02-0.09, widening to aY 0.41 at aX >= 0.88 (capped by the CFC pill:
worst gap 2.0px at the boundary). The seed sits well inside, not at an edge.

## Wide (0.90, 0.90): drift clean, converge residuals disclosed

Drift: dense grid W 1401-2560 step 10, S 550-1300 step 5, heights 21/24/28,
stage-minus-15: 0 problems. Binding worst margins (all at 1401x650):
elsevier x 74.0px, posterwindow y 79.5px, CFC pill y 96.0px. Chip-chip:
0 problems (SS-new, SS-current, Seoul, CFC). Sweep clean region is ONLY
the bottom-right corner: aX 0.85-0.98 x aY 0.76-0.98 (no mid-right, top,
or left lane). Clipping: aY <= 0.936 at S = 550 (0.90 gives 20px bottom
guard worst); aX <= 0.9857 at W = 1401 (0.90 gives 140.1px right guard rest).

Converge residuals (hover-only, sampled blend/drift/scrollPhase, footprint
method): (1) CFC pill, W < 1996 x S 591-896 (VH 691-996), up to full chip
(73x21; min 11.8px through the pill float cycle at S = 700). (2) Seoul
chip (drifting), W 1705-2445 x S < 786 (VH < 886), up to full chip;
persistent at some sizes (2000x700: full overlap all cycle, Seoul paints
above FAERS). (3) Posterwindow, W < 1862 x S 550-571 (VH 650-671), <= 8.3px
deep. Structural: drift-clean forces bottom-right, bottom-right forces
bottom-edge converge, and the converged y-band [S/2+118.2, S/2+139.2] is
anchor-independent. Converge-from-above needs aY <= 0.31 at S = 550, but
drift-clean needs aY >= 0.76: no single anchor is both. Recommendation:
ship drift-clean and disclose, same class as the pre-existing SS-search
converged park. Full converge-clean needs a CFC pill move, a
height-companion, or a converge-behavior change: all out of fixer 1 scope,
for parent/QA decision, not a reason to block the drift fix.

## Miniature pin: verified unchanged

MINI_CURSOR_CHIPS now pins FAERS anchorY to 0.30 (anchorX override 0.26
untouched). Without the pin, miniature FAERS would follow the desktop
base to 0.90; mini chips carry no data-chip, so no H-band could hide it.
With the pin, miniature FAERS stays exactly (0.26, 0.30), so its verified
pairs are unchanged: docking rest 37.9 / worst 2.1px 0.73s; review rest
39.5 / worst 0.5px 0.18s; reduced-motion static = rest exactly. Note for
fixer 2: miniature SS is already pinned (0.60, 0.34), so the SS move is
miniature-safe without a second pin.

## Diff (src/sections/Hero.tsx only, 40 insertions / 4 deletions)

1. CURSOR_CHIPS FAERS (line ~107): (0.195, 0.30) -> (0.90, 0.90); old
microscope/helix comment replaced with the new-lane comment.
2. MINI_CURSOR_CHIPS anchorY (line ~190): `StrokeSense ? 0.34 : anchorY`
-> `StrokeSense ? 0.34 : FAERS ? 0.30 : anchorY`, with pin comment.
3. Loop effAnchorX (line ~639): added `FAERS && laptopMql ? 0.85`.
4. Loop effAnchorY (line ~650): added `FAERS && laptopMql ? 0.04`.
5. CSS 1161-1400 block (after the Seoul rule, line ~1473): added
`.mv-diorama-chip[data-chip="FAERS"] { right: 15% !important;
top: 4% !important; }`. Right-anchored (0.85 > 0.5, like Seoul), never
left % (that would stretch the chip against the inline right). JS
anchor == CSS base exactly (0.85 -> right 15%, 0.04 -> top 4%),
so converge targets follow the companion.

## Build and handoffs

Build: PASS (10.43s). Em dash in diff: 0. Dialkit in dist: 0.
Only Hero.tsx modified. Not pushed (parent owns commit/push).

Fixer 2 (SS): re-verify SS vs FAERS chip-chip against the NEW SS lanes
after your edit. Pre-verified clean in my sweep for both bands, drift
and converge (laptop converge vs all chips clean; wide converged vs
SS-new clean), but the joint check is yours once SS moves. Synthesis
SS package stands: base (0.505, 0.70), companion (0.55, 0.70) with the
new anchorX companion, anchorY companion deleted.

Fixer 3 (H-bands): my rest scan shows zero FAERS rest parks at desktop
(both bands), so H1 (docking) and H2 (stickers) are deletable after your
independent rest scan confirms; do not just shift their bounds. H3/H4/H6
stand (Seoul/CFC unmoved). No new H-band is needed for FAERS drift.
