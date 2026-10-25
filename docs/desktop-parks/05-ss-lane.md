# StrokeSense lane search (desktop-parks anchor round)

Base: HEAD `15c3ed9`. Sources: `02/03/06/07-impact.md`, plus
source checks of `CURSOR_CHIPS`, companions, pills, and section
flex/padding (border-box confirmed, so `02`'s y-math stands).
SS chip 116x21 (bounds 21-28); drift +-20 H / +-14 V; cards add
parallax 8 (float up-only 8, toward chip only). SS is right-anchored
for anchorX > 0.5: box `[aW-116, aW] x [bS, bS+21]`. Margins are
worst-phase unless marked rest.

## Verdict

One package fixes all three named parks. No single base anchor
does (see squeeze). Recommended:

| Lane | Anchor | Mechanism change |
|---|---|---|
| Base (>1400) | (0.505, 0.70) | SS anchorX 0.55 -> 0.505, anchorY 0.33 -> 0.70 |
| Companion (1161-1400) | (0.55, 0.70) | NEW anchorX companion (JS `laptopMql` + CSS `right: 45% !important`, precedented by Seoul's `right: 30%`); DELETE anchorY companion 0.45 (JS + CSS `top: 45%`); update `chipBaseAnchor` to match |

## Two new findings constraining the base

- **Label park (unreported until now).** Label "Portfolio - Est. 2025"
  renders on desktop (flow child, z 1, chips z 2 above it) at
  y `[S/2-136.7, S/2-122.3]`, x `[W/2-84.5, W/2+84.5]`. Current base
  overlaps it at rest for S 719-928 (VH 819-1028) and on drift
  for S 637-1010. Any b near 0.33 keeps it; the package clears
  it in y (0.70S below label).
- **Review-old drift contact (unreported).** Current base vs
  review-old: rest gap `0.16W-223.5` (positive above 1400) but
  drift gap goes negative for W < 1572 at S < 707.
  Rightward moves worsen it 1:1; the package clears it in y.

## Why no single base anchor works

Search (left) needs SS right: x-clear needs `(a-0.36)W > 406`
(a > 0.65 at W=1400). The pill (right, y-overlapping at b ~ 0.33)
allows only `a < 0.59-20/W` (0.576 at W=1401); review-old also
blocks rightward moves. Below search in y is impossible at
S < 707 (search bottom and glyph top overlap), and the label
splits the below-search window at taller S. Correction to `02`: at anchorX
0.55 the glyph contact is the `n` column (all widths), not `l`
at every width (that belongs to the miniature's 0.60 anchor).

## Primary package margins (binding pairs only)

Base (0.505, 0.70), W 1401-2560 x S 550-1300: search y-clear
all S; review-old y-clear all S; glyphs 18.3 / 4.3px (S=550,
below baseline, thin at shortest stage); label y-clear all S;
pill y-clear all S; desk x-clear, worst 5.3px (W=1401, thin);
CFC chip worst 21.2px; other cards clear.

Companion (0.55, 0.70), W 1161-1400 x S 550-1300: glyphs 18.3 /
4.3px (S=550; also fixes the unbanded reduced-motion rest park
of the 0.45 companion, which no H-band ever covered);
review-new y-clear all S; CFC chip worst 4.25px (W=1161,
binding, grows to 64px at 1400); awards worst 12.9px (W=1161);
Seoul chip worst 25.2px; Seoul pill worst 26.4px; other
cards clear.

Converge (both lanes): hover converges to the bottom edge
(center below rect for S > 591, nearest-to-bottom-edge below
that), clear of glyphs. Converged chip keeps rest x: desk gap
35px, gutaxis 6.95px at W=1401, no drift term.

## Residual and fragilities (disclose, do not hide)

- **Gutaxis transient (structural, unfixable by anchors).** Base
  (0.505, 0.70) vs gutaxis: W 1401-1483 x S < 818 (VH < 918),
  max 21px deep at W=1401, S=550, tapering to 0 at zone edges.
  Cause: gutaxis-right to desk-left gap is 158px at W=1401 but
  the drifting chip needs 172px (116 + 40 drift + 16 parallax),
  so no anchorX clears both cards in x there; at S < 818 both
  cards also overlap SS in y. Fixing it needs a card move
  (out of scope) or a width+height companion (new JS logic).
  It replaces a 104px continuous search park and a label rest
  park, so the trade is strongly favorable, but it is a new
  contact the current base does not have.
- **Flip fragility.** Base anchorX 0.505 sits 0.005 above the 0.5
  flip (crossing it shifts rendered x by a full chip width).
  Deterministic as coded; future tweaks must respect it.
  Alternative a=0.51 trades desk 5.3px -> ~0px; rejected.
- **Thin margins.** Glyph 4.3px (both lanes, S=550), desk 5.3px
  (base, W=1401), CFC chip-chip 4.25px (companion, W=1161). All
  positive; re-verify with pixel-true glyphs.

## Alternative: companion-only (minimal change)

If the parent rejects the base move, ship companion (0.55, 0.70)
alone: the SS-glyph park is fixed, no anchorX companion needed.
Search, label, and review-old drift parks remain as disclosed
pre-existing issues. Do not ship base (0.575, 0.33) or
(0.56, 0.33): both open a review-old REST park (W < 1656 /
W < 1490 at S < 707), and 0.575 leaves a 1px pill gap at W=1401.

## H-band consequences

H5 deletable after a rest-park scan of the new SS lanes
(gutaxis is drift-only). H1/H2 untouched by SS moves. H3/H4/H6
stand.
