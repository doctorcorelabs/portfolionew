# Cursor motion design: one system, three renderings (base 1255c6f)

Read-only design proposal (companions: 01-impl-audit,
03-band-audit). This doc decides HOW chips move. No card,
anchor, or pill position changes; pills out of scope (03 §5).

## 1. Why current motion reads as "gerak dikit"

Extent: every chip shares radius 20px (±20 x, ±14 y after the 0.7
squash). Speed: durations 16-24s, so peak speed is only about
2π·20/20 ≈ 6 px/s, constant. A chip takes ~5s to cross its own
40px box. On tablet/phone the chips do not exist at all (hidden
by `hover: none` and the 1160px rule). Both halves are real and
need different fixes: speed and character on desktop, existence
on tablet and phone.

## 2. Primary path: elliptical patrol with dart-dwell shaping

One path shape everywhere: the existing closed-loop ellipse
with non-uniform angular velocity, so it reads as cursor-like
(dart and pause) rather than orbital. One extra sine in the
tick, transform-only, same bounding box:

- ψ = 2π·(t/T + φ + scrollPhase), the same phase input as today.
- θ = ψ + 0.35·sin(2ψ) for dart-dwell shaping. Instantaneous
  speed varies by a factor of 0.3 to 1.7 around the mean
  (near-pause, then dart), while θ still advances exactly 2π per
  period, so the loop stays closed and the chip never drifts off
  its lane.
- x = anchor + R·cos θ, y = lane + 0.7R·sin θ (keep the squash).

Rejected: pure Lissajous, random wander (unbounded, eventually
parks), triangle patrol (velocity jumps read as glitchy).
Bounding box unchanged, so existing QA margins stay valid.

## 3. Desktop: faster and dartier, same extent (hard limit)

Desktop extent CANNOT grow. Measured binding pairs (03 §4):
StrokeSense vs review is +1.72px worst-phase at VH 650 in
1161-1400, and Seoul vs awards already grazes at short stages.
Growing radius 20 to 34 would invert the first to roughly −12px
overlap: that is parking, not transient crossing. So desktop
activity comes from speed and character only:

- Durations: FAERS 18→12s, StrokeSense 22→14s, Code for Cure
  16→11s, Seoul 24→15s (adopted from 03). Peak mean speeds become
  ~8-11 px/s, dart peaks 10-14 px/s: ~1.5x faster on average, ~1.9x
  at dart moments, inside the same ±20/±14 box. No clearance
  changes.
- Phases stay 0 / 0.3 / 0.55 / 0.8. Spread by 0.25 or more, chips
  never dart in lockstep; different phases also mean different
  dart moments.
- Bigger desktop extent later requires re-anchoring the
  StrokeSense and Seoul lanes (new lanes, new QA), not a radius
  edit: a radius edit alone ships parks.

## 4. Tablet: new lanes, bigger radius, designed clearance

Tablet chips are native-size (73-130px wide, ~19px tall) with NEW
per-band lanes (03 §6). Radius budget is 34px, but only under
this rule: each lane's rest clearance to its nearest neighbor
in the binding direction must be at least 34 (radius) + 8
(parallax) + 10 (float) = 52px. If a lane cannot clear 52px,
shrink that chip's radius first, never the lane, and never accept
an unbudgeted crossing. Portrait stages (S = 924 at 768x1024)
have ~200px card-gap bands; short landscape (S = 668 at
1024x768) only ~30-35px gaps, so landscape lanes must sit in
x-gaps between cards or accept budgeted transients (§7).
Durations and phases match desktop. Paint order stays z-index
2; residuals fall under the §7 budget.

## 5. Phone: chips inside the miniature, amplified in design pixels

Phone chips render as a second set INSIDE `.mv-mini` (the diorama
is currently a sibling of the wrapper, so it cannot scale with
it; 01 §3). Same 4 chips, colors, and labels, same desktop
1161-1400 short-state anchors (FAERS 0.195/0.30, StrokeSense
0.55/0.45, Code for Cure 0.30/0.695, Seoul 0.70/0.695),
drift-only, transforms in design pixels so the wrapper scale
applies them. Radius 40 design px (adopted from 03): visually
11.0 / 13.4 / 24.8px at 320 / 390 / 719. Durations and phases
match desktop. Honest tradeoff: at 0.28-0.62 scale the label
text (3-7px) is texture, not reading matter; the phone chip
reads as a colored cursor mark moving actively. Fixers must not
"fix" that by enlarging phone chips (a native-size chip does
not fit the phone hero: 03 §3b). The section-level layer stays
hidden below 720px.

## 6. Converge, scroll, parallax

- Converge: KEEP on desktop and hover-capable tablets (the
  signature interaction and only hover payoff). Strengthen
  slightly: blend time constant 0.30 → 0.22s. Target unchanged:
  nearest point on the word rect expanded by 20px, never on
  glyph ink. On touch: drift-only.
- Scroll modulation: KEEP, recommend FOR. Reference-faithful
  (Onlines modulates hero cursors with scroll), and the ONLY
  interactive motion channel on touch devices. Cap stays
  0.25 loop (~3s of motion shift with shorter durations).
  Do not raise it.
- Mouse parallax: KEEP at ±8px, do not bump. It already adds up
  to 8px of chip-vs-card relative motion; raising it deepens
  the two desktop binding pairs and adds background chaos
  without making the CURSOR read as more active. One active
  channel (chips).

## 7. The tension, stated as a rule (hard limit)

Bigger amplitude means more card crossings. The budget that keeps
crossings transient instead of parks:

- Max crossing: 3 seconds continuous, 12px deep (8px visual in
  the miniature). Beyond either number is a park: cut that chip's
  radius first, then its vertical amplitude, never accept it and
  never move the lane to compensate.
- Rest rule (the hard limit): no chip's rest excursion may
  consume its rest gap to the nearest neighbor. Desktop radius
  20 is the ceiling because the gaps are already spent (§3).
  Tablet radius 34 is allowed only where the 52px clearance
  rule (§4) holds. Miniature radius 40 is allowed only as
  budgeted transient on decorative texture: the StrokeSense vs
  review residual (+0.58px visual at 390 with radius 20) will
  cross transiently at radius 40 (up to ~6-8px visual, ~1-3s per
  cycle). That is inside the budget; it is not zero-overlap, and
  the fixer must confirm no other miniature pair exceeds it.
- Beyond ~70px desktop radius, the Code for Cure vs faers
  x-gap and the FAERS vs helix y-gap go negative at rest: the
  chip would sit on a card even before drift. That ceiling is
  why §3 forbids radius edits on desktop.

## 8. Reduced motion: static-visible, not hidden

Recommend static-visible at anchors/lanes on all devices. Reason:
the problem is motion, not the chips. When the loop does not run,
chips sit at their base left/top, which IS their anchor; desktop
anchors are verified clear at rest (the grazes were drift-caused:
StrokeSense vs review is +1.72px WITH drift, so at rest the gap
is larger, likewise Seoul vs awards). Static chips park on
nothing, and showing them preserves the composition.
Implementation: drop the diorama `display: none` under
`prefers-reduced-motion` (both guards), keep `animation: none`
and no loop. Fixer must verify static clearance for NEW tablet
lanes and guard ordering (01 §5.7). Pills go static as a side
effect; positions untouched.

## 9. Parameter table (implement directly)

Fixer checks: desktop margins unchanged at radius 20; tablet
lanes clear 52px; no miniature pair exceeds §7 at radius 40;
loop never runs where chips hide; build passes, zero em dashes.

| Parameter | Desktop (>1160px) | Tablet (720-1160px) | Phone (<720px, miniature) |
|---|---|---|---|
| Chip layer | Section-level, z2 (unchanged) | Section-level, z2, NEW lanes | Second set INSIDE `.mv-mini` (scaled) |
| Anchors / lanes | Unchanged incl. 0.45 / 0.70 companions | NEW per-band lanes, rule §4 | Desktop 1161-1400 short anchors: 0.195/0.30, 0.55/0.45, 0.30/0.695, 0.70/0.695 |
| Radius R (x) / y (0.7R) | 20px / 14px (UNCHANGED, hard limit §3) | 34px / 24px | 40 / 28 design px (visual 11.0 / 13.4 / 24.8 at 320 / 390 / 719) |
| Periods T (FAERS / SS / CFC / Seoul) | 12 / 14 / 11 / 15s | 12 / 14 / 11 / 15s | 12 / 14 / 11 / 15s |
| Phases φ | 0 / 0.3 / 0.55 / 0.8 | 0 / 0.3 / 0.55 / 0.8 | 0 / 0.3 / 0.55 / 0.8 |
| Path | Ellipse + dart-dwell: θ = ψ + 0.35·sin(2ψ), ψ = 2π(t/T + φ + scroll) | Same | Same (design px) |
| Peak mean speed | ~8-11 px/s (dart peaks 10-14) | ~8-12 px/s | Visual ~7 / 9 / 17 px/s (dart peaks ~1.7x) |
| Converge | Yes, halo 20px, τ 0.30→0.22s | Hover-capable only; touch drift-only | Never (drift-only) |
| Scroll modulation | 0.25 loop max (keep) | 0.25 loop max (keep) | 0.25 loop max (keep) |
| Mouse parallax | ±8px (keep) | ±8px where mouse exists | None (no hover) |
| Reduced motion | Static at anchors | Static at lane centers | Static at miniature anchors |
| Max crossing budget | 3s, 12px deep | 3s, 12px deep | 3s, 8px visual deep |
| Loop gate | Unless reduced-motion; converge hover-gated | Same; skip hidden chips; gate to visible bands | Miniature rAF, design coords, drift-only, <720px |
