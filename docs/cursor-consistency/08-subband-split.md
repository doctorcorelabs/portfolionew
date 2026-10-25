# Sub-band split: tablet portrait 720-903 vs 904-1000

Status: sub-band split follow-up agent, 2026-10-25. Base: HEAD
`1255c6f` + fixer 1, 2, 3 + integration uncommitted diffs (tree
arrived dirty; my edits are ONLY the three hunks below). No push
(parent pushes). Build PASSES (5.83s). Diff em dash: 0.
Sign convention in all tables: negative = clearance px, positive
= overlap depth px. "Worst (expanded)" = box expansion (cards:
drift + parallax 8 + float 8; glyph/label: drift only) - it
overstates vs ellipse-true because max dx and max dy cannot
co-occur on the ellipse; "drift-only" columns are ellipse-true
(dart-dwell sampler, N=2880).

## Problem (integration-verified, 07-integration.md)

The integration CFC portrait anchorY 0.38 -> 0.45 fixed the label
park at W <= 903 but parks CFC on the word glyphs at REST, full
cycle, at W 904-1000, where the word is clamp(72px, 16vw, 180px)
= 144-160px (not 72px): rest depths 23.1 / 17.2 / 4.4 (904),
26.3 / 20.4 / 7.6 (960), 28.7 / 22.8 / 10.0 (1000) at
S = 550 / 668 / 924. The old 0.38 anchor was fully clear there.

## Exact edits (src/sections/Hero.tsx only)

1. `TABLET_ANCHORS` gains a third key. Portrait-narrow
   (720-903px) = fixer 2's portrait lanes exactly (CFC 0.45).
   Portrait-wide (904-1000px) = same lanes except CFC
   anchorY 0.38 (restored) and Seoul anchorY 0.67 -> 0.685
   (see decision below). Landscape (1001-1160px) unchanged.
2. `tabletSubBand` state becomes three-way
   ("portrait-narrow" | "portrait-wide" | "landscape") from
   two cached matchMedia listeners (max-width 903px /
   904-1000px) - never per-frame innerWidth queries, consistent
   with fixer 2's approach. The 903/904 boundary is exactly
   the word-cap rule's boundary (max-width 903px), so the lane
   switch and the word-size jump happen at the same width.
3. No other code touched. The section loop (line 620) and the
   JSX `chipBaseAnchor` (line 870) both index by
   `tabletSubBand`, so JS anchor == CSS base is preserved
   automatically, including converge targets on hover tablets.

## Model + calibration

Reused /tmp/tablet_chip_model.py (card rects, frame/glyph
from CSS) + label strip (top = frame_top - 46, h 14.4,
w 170 centered). Calibration first: CFC 0.45 at the wide
grid reproduces integration's 9 glyph-park values EXACTLY
(23.1 / 17.2 / 4.4, 26.3 / 20.4 / 7.6, 28.7 / 22.8 / 10.0),
so the model is validated before trusting the fix.

## Seoul-wide anchorY decision (step 3 proof)

At 0.67, Seoul touches glyph ink at 1000x650: box 1.7px,
2.75s drift-only - a glyph-standard violation (worst <= 0).
Scan over the wide dense grid (W 904/960/1000 x VH
650-1024):

| anchorY | Glyph worst | FAERS chip-chip worst | Card worst |
|---|---|---|---|
| 0.67 | +1.7 at 1000x650 FAIL | -11.5 | -51.3 |
| 0.675 | -1.1 (hairline) | -8.8 | -48.5 |
| 0.68 | -3.8 | -6.0 | -45.8 |
| 0.685 | -6.6 | -3.2 | -43.0 |
| 0.69 | -9.3 | -0.5 (hairline) | -40.3 |

Chosen 0.685: best balanced minimum margin (glyph 6.6 box,
chip-chip 3.2 solid) and robust to ~4px of glyph-band
placement uncertainty. Moving Seoul down is safe because
every card below it is x-clear or far below (card worst
-43.0). Narrow keeps 0.67 (72px glyph band is far above).

## Portrait-wide FINAL tables (CFC 0.38, Seoul 0.685)

Grid: specified W 904/960/1000 x VH 650/768/1024 (S 550/668/
924) + dense VH 650-1024 robustness sweep. CFC glyph park:
GONE (see glyph table).

### Cards (pairs with worst > 0; all other pairs clear by >40)

| Pair | Rest | Worst (expanded) | Drift-only depth / duration | Binding point |
|---|---|---|---|---|
| FAERS vs pubmed | -20.8 | +9.2 | never touches (-6.8) | 904x650 |
| StrokeSense vs docking | -2.6 | +23.2 | +7.2 / 6.29s | 904x650, S=550 only |
| StrokeSense vs stickers | -12.4 | +13.4 | never touches (-2.6) | 904x951 |
| Code for Cure vs docking | -2.6 | +23.2 | +7.2 / 4.67s | 904x650, S=550 only |
| Code for Cure vs stickers | -12.4 | +13.4 | never touches (-2.6) | 904x951 |
| Seoul vs any card | - | all clear | - | - |

No rest parks anywhere. All transients are inside fixer 2's
~16px card-transient budget on depth (see docking note).

### Glyph + label (worst over specified grid)

| Chip | Glyph rest / worst | Label rest / worst |
|---|---|---|
| FAERS | -72.8 / -58.8 | -259.3 / -245.3 |
| StrokeSense | -9.8 / -0.0 (hairline, zero overlap) | -232.9 / -218.9 |
| Code for Cure | -9.8 / -0.0 (hairline, zero overlap) | -20.0 / -6.0 at 904x1024 |
| Seoul 2026 | -20.6 / -6.6 at 1000x650 | -207.1 / -193.1 |

SS/CFC glyph worst exactly 0.0 at 1000x650: the pinned slot
(rest margin 9.8 = vertical drift 9.8). Zero ink touched,
but any radius increase would break it (already known from
fixer 2). CFC label is clear at every wide point (the old
0.38 label numbers from integration reproduce: rest -20.0
at 904x1024).

### Chip-chip (specified + dense grid, all clear)

Thinnest: FAERS vs Seoul rest -31.2 / worst -3.2 at 904x650.
All other pairs worst <= -54.9.

## Portrait-narrow re-verification (CFC 0.45, unchanged)

Grid W 720/768/820/903 x VH 650/768/1024. Values reproduce
integration exactly - the edit did not disturb narrow:

- CFC glyph: rest -3.3 / worst +6.5 / 4.78s at 720x650 =
  integration's short-S glyph caveat (over at S=550/600,
  inside at S=668/924). UNCHANGED, still disclosed.
- CFC label: clear at every narrow point (the 0.45 fix
  holds). SS-docking transient identical to wide (below).
- Seoul vs notify: rest -13.5 / worst +14.5, drift-only
  ~0.5px / 2.51s (fixer 2's numbers, unchanged, inside
  budget).
- Chip-chip: all clear (thinnest SS-CFC rest -42.4 /
  worst -14.4).

## Docking transient disclosure (pre-existing, NOT from this split)

At S=550 (VH 650) only, SS and CFC (both at anchorY 0.38)
sit 2.6px below docking at rest (docking bottom 206.4,
chip top 209.0). Drift-only overlap max 7.2px, 6.29s (SS) /
4.67s (CFC) per cycle; with mouse parallax held at the
extreme, ~15.2px. Inside fixer 2's ~16px transient budget
on depth; rest is clear (not a park). Bounds: drift-only
touch for VH < ~671, drift+parallax touch for VH < ~693;
clear by >= 20px at S >= 600. It exists IDENTICALLY in
narrow (same SS anchor) and in the shipped pre-split state
(fixer 2's grid started at VH 700, so S=550 was never
checked before) - it is NOT a regression from this split,
and fixing it would require moving SS/CFC anchors in BOTH
portrait keys (they are pinned between docking above and
the glyph band below at S=550; any move trades one side
for the other). Left as disclosed; a global anchor round
can revisit it with the desktop parks below.

## Untouched (grep proof)

- Desktop: CURSOR_CHIPS anchors identical (FAERS 0.195/
  0.30, StrokeSense 0.55/0.33, CFC 0.30/0.695, Seoul 0.80/
  0.695); laptopMql companions intact (Seoul 0.70,
  StrokeSense 0.45). The vs-HEAD diff's CURSOR_CHIPS lines
  differ only in fixer 1's durations (18/22/16/24 ->
  12/14/11/15), not anchors.
- Landscape TABLET_ANCHORS unchanged (fixer 2 values).
- MINI_CURSOR_CHIPS + miniature loop untouched (no
  "portrait-narrow"/"portrait-wide" reference outside the
  three edited regions; new keys occur only in the const,
  the state init, and the effect).
- No pill rule, gate, or collage value touched (no such
  lines in my hunks; my hunks are const + state + effect
  only). The 720-734 classic-scrollbar seam is unaffected
  (heroBand/miniature logic untouched).

## Handoff for parent push

Final state: tablet portrait is now clean in both sub-bands
under the governing standards (rest clear everywhere; glyph
worst <= 0 everywhere except the disclosed narrow short-S
caveat; card transients inside ~16px). The integration
904-1000 glyph park is FIXED. Remaining disclosures to
carry into the push report (all pre-existing, none from
this split): (1) Seoul-miniature transient (rest clear
12.5, worst 23.5 design / 7.9 visual @390, 7.04s/cycle -
only visible over-budget miniature pair); (2) Seoul-glyph
miniature hairline (0.7px, 2.99s, at budget edge,
sub-visible); (3) narrow short-S glyph caveat (CFC 6.5px /
4.78s at S=550, 4.0px / 4.14s at S=600); (4) SS/CFC docking
short-stage transient (above; S=550 only, both portrait
keys); (5) desktop parks for a later global round
(FAERS-docking drifting W < 1380 / VH < 804; SS-glyph
1161-1400 all realistic heights; SS-search above 1400
continuous park at VH <= 800). No new fix needed before
push unless the parent wants (4) or (5) addressed first.
