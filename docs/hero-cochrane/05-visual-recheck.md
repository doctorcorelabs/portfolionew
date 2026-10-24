# Visual recheck: Cochrane slot, fix round 2

## Verdict: PASS

The current slot (db-cochrane left 20%, top 15%, tile 69x82,
tilt card-d +1deg, float 14s / 2.1s, hide mobile-hide + hide-1400
+ hide-750) has no overlap and no glyph touch at any modeled
width or stage. All remaining deviations are near-misses with
daylight, listed with their exact widths and stages below.

## Method (read-only, no live browser)

Every number below was recomputed from source, not taken from
the parent comment or the relocation note. Components read:
DbLogoFloat (tile geometry), DockingCard, DnaHelix, MicroscopeCard,
Stickers, NotifyBubble, and the Hero stylesheet + item list.

Model constants, all from source:

- Stage H = hero section height = calc(100dvh - 100px), min
  550px. The collage layer is absolute inset 0, so item
  percentages are percentages of H.
- Frame: maxWidth 1160px centered, padding 28px, word 180px
  font at 0.95 line-height = 171px tall, so frame height 227px.
  Centered block = label (~12-14px) + 32px margin + 227px
  frame = ~273px. Frame top = H/2 - 92.5 (label line-height
  uncertainty +-2-3px, immaterial at these clearances),
  frame bottom = H/2 + 134.5. Glyphs sit 28px inside the frame
  edge by the standing convention, so glyph top = frame top + 28.
- Cochrane tile: 69 wide x 82 tall (portrait lockup art 56px,
  maxWidth 44; 56 x 361/466 = 43.4px, fits). BoxSizing
  border-box, so 82 is the full height.
- Scopus tile: 100 wide, height auto = 24 art + 24 padding +
  2 border = 50 tall.
- Docking card: 230 wide, ~184 tall (svg 120.4 + two caption
  lines ~37 + padding 24 + border 2; +-2px font uncertainty).
- Helix box: item width 100, svg viewBox 80x200, so 250 tall.
  Ink: strands reach x = 16 and x = 64 in the 80-wide viewBox,
  so ink spans 20-80px inside the 100px box.
- Microscope card: item width 210, image 4/3 = 157.5 + caption
  ~33 + borders ~3 = ~193 tall.
- Stickers row: three pills, ~364 wide x ~26 tall (10px mono
  pills, padding 6px 10px, gap 8).
- Notify bubble: ~296 wide x ~51 tall (28px icon vs two text
  lines, padding 10px 14px).
- Motion peak budget per the brief: float 8px + parallax 8px +
  tilt ~1.2px = 17.2px for frame clearance; for inter-item gaps
  parallax cancels (whole layer moves together), so the worst
  shrink is float 16px (both items adversarial) + tilt growth
  on the facing edges.
- Conservatism note: the actual collage float keyframes run
  translateY(0) to translateY(-8px), i.e. items move UP only,
  never down. The brief's bidirectional model (one item down
  8px, the other up 8px) therefore overstates every worst-phase
  shrink below. Verdicts use the brief's model; real behavior
  is strictly better.

## (a) Cochrane-to-Scopus vertical gap: PASS

Scopus spans [0.03H, 0.03H + 50]; Cochrane spans [0.15H,
0.15H + 82]. Rest gap = 0.12H - 50.

| Stage | Rest | Worst float phase (-16) | Worst + tilt (~-1.5) |
|-------|------|-------------------------|----------------------|
| 651 (worst shown) | 28.1px | 12.1px | ~10.6px |
| 700 | 34.0px | 18.0px | ~16.5px |
| 800 | 46.0px | 30.0px | ~28.5px |

The 24px rule holds at rest at every shown stage (rest-rule
threshold is H = 617, below the worst shown stage 651). The
gap never closes: rest zero would need H = 417, far below the
550px section minimum and below the hide-750 cutoff anyway.
Below 24px only at adversarial float peaks (10.6-16.5px at
stages 651-700), which is daylight, not a touch, and matches
how prior rounds treated peak gaps.

Discrepancy flagged, not a defect: the parent comment claims
28px at stage 700 and 34px at stage 800. Source-derived values
are 34px and 46px. The parent numbers are conservative (they
match a ~56-62px Scopus tile, which the source does not
support). The parent's worst-phase floor of "at least 12px"
does match this recompute at stage 651 (12.1px, pre-tilt).

## (b) Cochrane frame clearance: PASS, by wide margins

Cochrane bottom = 0.15H + 82. Frame top = H/2 - 92.5.
Cochrane's x-span (280-349px at width 1401) sits inside the
frame's x-span (120-1280px), so vertical clearance is the
operative dimension.

| Stage | Frame clearance, rest | Frame clearance, peak (-17.2) | Glyph clearance, rest | Glyph clearance, peak |
|-------|----------------------|-------------------------------|----------------------|----------------------|
| 651 | 53.4px | 36.2px | 81.4px | 64.2px |
| 700 | 70.5px | 53.3px | 98.5px | 81.3px |
| 800 | 105.5px | 88.3px | 133.5px | 116.3px |

No frame touch and no glyph touch at any stage, at rest or
at peak. Discrepancy flagged, not a defect: the parent comment
claims "at least 19px clear of glyphs" with a "frame-padding
graze up to 9px at float peaks on the shortest shown stages".
Source-derived geometry is ~45px more generous; no frame
graze occurs at any shown stage under either the brief's
model or the actual up-only keyframes. The parent understated
the clearances; the slot is safer than the comment says.

Out of scope, one line: the frame itself is user-draggable,
so dragging the frame upward could in principle reduce these
clearances, but that is interaction, not layout, and no prior
round models drag offsets.

## (c) Cochrane-to-docking horizontal gap: PASS, near-miss band

Docking (left 2.5%, 230 wide) and Cochrane (left 20%) overlap
vertically at every stage (docking ~184 tall: at stage 651 it
spans 19.5-203.5px vs Cochrane 97.7-179.7px; at stage 800,
24-208px vs 120-202px), so the horizontal gap is operative.
Gap = 0.175W - 230.

| Width | Rest | Tilt-adjusted (~-5.5: docking -3deg, Cochrane +1deg) |
|-------|------|-----------------------------------------------------|
| 1401 | 15.2px | ~9.7px |
| 1440 | 22.0px | ~16.5px |
| 1500 | 32.5px | ~27.0px |
| 1920 | 106.0px | ~100.5px |

The 24px rule holds at rest from width 1451 and
tilt-adjusted from width ~1483. The 1401-1440 band (tilt-
adjusted 9.7-16.5px) is a near-miss with daylight, no touch.
Non-blocking; it matches the parent's "full clearance above
about 1470px" within tilt-modeling tolerance. Live-check the
1401-1450 band, since this is the tightest adjacency in the
slot.

## (d) Cochrane-to-helix box and ink: PASS

Helix box (left 27%, 100 wide) and Cochrane overlap
vertically at every stage (helix 250 tall: at stage 651 it
spans 13-263px vs Cochrane 97.7-179.7px), so the horizontal
gaps are operative. Helix is visible at all modeled stages
and widths (hide-short only hides at viewport <= 700px, i.e.
stage <= 600; hide-mid only at width <= 1160px).

| Width | Box gap (0.07W - 69) | Ink gap (0.07W - 49) | Ink gap, stroke + tilt |
|-------|---------------------|---------------------|------------------------|
| 1401 | 29.1px | 49.1px | ~47.1px |
| 1440 | 31.8px | 51.8px | ~49.8px |
| 1500 | 36.0px | 56.0px | ~54.0px |
| 1920 | 65.4px | 85.4px | ~83.4px |

All pass the 24px rule at every width. The ink figure with
stroke half-width (~1.3px) and Cochrane tilt (~0.7px)
reproduces the parent's 47px at width 1401 exactly.

Rejected-slot consistency (background only, not re-judged):
the left 29% slot would put Cochrane at x 406-475px at width
1401, inside the helix box (378-478px) and ink (398-458px),
consistent with the reported ~85% ink coverage failure. The
left 66% rejection is consistent with the review card sitting
at right 27% (verified in the item list), not right 2.5%.

## (e) Cochrane to microscope, stickers, notify: PASS

- Microscope (left 2.5%, bottom 39%, 210 wide, ~193 tall,
  visible at all modeled widths: hide-mid only): horizontal
  gap = 0.175W - 210 = 35.2 / 42.0 / 52.5 / 126.0px at widths
  1401 / 1440 / 1500 / 1920 (tilt-adjusted ~32.8px at 1401).
  Horizontal daylight alone guarantees no overlap at any
  width. The vertical gap is also positive: microscope top =
  0.61H - 193, so rest gaps are ~24.5 / 46 / 92px at stages
  651 / 700 / 800, worst-phase ~8.5px at stage 651
  (tilt-adjusted ~6px). The stage-651 vertical figure is
  borderline at the 24px rule (font-metric uncertainty
  +-2px puts rest at ~23-26px), but it is a second, redundant
  separator: the horizontal 32.8px+ already rules out any
  touch. Listed as a near-miss for live confirmation, not a
  gap.
- Stickers (left 2.5%, top 32%, ~364 wide, ~26 tall, visible
  at all modeled widths: hide-mid only): x-ranges overlap
  (row reaches ~399px at width 1401 vs Cochrane left 280px),
  so vertical separation is operative. Rest gaps:
  28.7 / 37.0 / 54.0px at stages 651 / 700 / 800. Worst float
  phase: 12.7 / 21.0 / 38.0px. Tilt-adjusted worst at stage
  651 is ~16px: the +4deg sticker row rotates away from
  Cochrane at Cochrane's column (right of row center), so
  tilt widens rather than narrows this gap. No touch.
- Notify (left 2.5%, bottom 25%, ~296 wide, ~51 tall, visible
  at all modeled widths: hide-720-1160 only hides 720-1160px):
  vertical gap is enormous: notify top = 0.75H - 51, so rest
  gaps are ~257.6 / 276 / 315px at stages 651 / 700 / 800.
  Pass by two orders of magnitude over the rule.

## (f) hide-750 rule and header comment: PASS

- Stylesheet verified: `@media (max-height: 750px) {
  .mv-collage-hide-750 { display: none; } }`. Threshold is
  exactly as stated: hidden at viewport height 750px and
  below, shown at 751px and above, i.e. worst shown stage
  651 (stage = viewport - 100). Cochrane's hide classes are
  mobile-hide + hide-1400 + hide-750, as stated.
- Header comment accounting verified exact against the item
  list: at 720-1400px, PubMed only at all heights (Elsevier,
  Scopus, Cochrane all carry hide-1400); above 1400px at
  viewport heights above 750px, all four (PubMed, Cochrane,
  Elsevier, Scopus); above 1400px at viewport heights at or
  below 750px, three (Cochrane hidden via hide-750).
- Carried note, not a defect: the comment's "19 items, 18
  visible on desktop" is an item count (db-row is
  mobile-only); no single width shows all 18 at once, as
  already noted in recheck 08. The logo accounting itself is
  exact.
- Mobile row verified to carry the swap: DbLogoRow brands are
  PubMed, Elsevier, Scopus, Cochrane, in that order.

## (g) Tilt-sign alternation: PASS

Scopus uses mv-tilt-card-c = -1deg; Cochrane uses
mv-tilt-card-d = +1deg. Signs alternate across the shared
left column. Horizontal neighbors also alternate or are
untilted (docking card-a = -3deg, helix untilted).

## (h) TypeScript: PASS

`npx tsc --noEmit` clean, 0 errors (read-only run, no build).

## (i) Greps: PASS

- Em dash: 0 in Hero.tsx + hero-v8 files.
- "sciencedirect": 0 in all of src/ (case-insensitive).
  The swap is complete in source: DbLogoFloat brands are now
  pubmed, elsevier, scopus, cochrane, and DbLogoRow carries
  Cochrane. public/logos/ contains cochrane.png (129 KB) and
  no sciencedirect file at all (the v10 wordmark/icon files
  were removed, not merely left unrendered).

## Near-misses, all non-blocking (daylight, no touch)

1. Docking horizontal gap, tilt-adjusted 9.7-16.5px at widths
   1401-1440; 24px rule only above ~1483px tilt-adjusted
   (~1451px at rest).
2. Microscope vertical gap ~24px at rest at stage 651
   (+-2px font uncertainty), ~6px worst-phase; horizontal
   daylight >= 32.8px makes overlap impossible regardless.
3. Stickers vertical gap ~16px tilt-adjusted worst-phase at
   stage 651 (rest 28.7px).
4. Cochrane-Scopus gap 10.6-16.5px tilt-adjusted worst-phase
   at stages 651-700 (rest 28.1-34.0px passes the rule).
5. Parent comment numbers understate the source-derived
   clearances (Scopus rest gaps, frame/glyph clearances).
   Conservative, not a defect; the comment could be corrected
   to 34px / 46px (Scopus rest at stages 700 / 800) and to the
   frame/glyph figures in (b).

## Live confirmation still owed (sandbox blocks localhost preview)

- Width band 1401-1450: the docking near-miss in person.
- Stage 651 (viewport 751px): the microscope vertical
  borderline and the stickers worst-phase gap.
- Cochrane portrait lockup legibility at 56px art in real
  collage context (the lockup is taller and narrower than the
  wordmarks it replaced; modeled art width 43.4px).
- Mobile stack row with Cochrane at 320px and below.
- The 720-1160px band (PubMed only expected) and short
  stages at or below viewport 750px (Cochrane hidden
  expected).
