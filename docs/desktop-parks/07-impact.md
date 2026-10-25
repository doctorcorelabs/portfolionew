# Impact / insulation: what moves when desktop chip anchors change

Base: HEAD `15c3ed9`. Method: code reading of `src/sections/Hero.tsx` only
(no edits, no builds). Scope of this round: desktop `CURSOR_CHIPS`
anchors for FAERS and StrokeSense only. Everything below is verified
against the code, with line numbers.

## (a) MINI_CURSOR_CHIPS: moved chips insulated, with one hole

`MINI_CURSOR_CHIPS` (lines 172-189) is `CURSOR_CHIPS.map(...)` with
hard overrides:

| Chip | Miniature value | Insulated from desktop move? |
|---|---|---|
| FAERS anchorX | hardcoded `0.26` | YES |
| FAERS anchorY | flows through (`chip.anchorY` = 0.30) | NO - see hole |
| StrokeSense anchorX / anchorY | hardcoded `0.60` / `0.34` | YES |
| Seoul anchorX | hardcoded `0.70` | YES |
| Seoul anchorY | flows through (0.695) | N/A - Seoul not moved |
| Code for Cure anchorX / anchorY | flow through (0.30 / 0.695) | N/A - CFC not moved |
| All radii | hardcoded `40` | YES |
| Colors, durations, phases | flow through via spread | N/A - anchors only |

The miniature loop (lines 697-740) iterates `MINI_CURSOR_CHIPS`
only, runs only when `heroBand === "miniature"`, and never touches
`CURSOR_CHIPS`, `laptopMql`, or `TABLET_ANCHORS`. The miniature JSX
(line 2159+) reads the derived anchors directly. So a desktop FAERS
anchorX or StrokeSense anchor move cannot move any miniature chip.

THE HOLE: FAERS anchorY is not overridden. If the H-band fixer moves
FAERS anchorY (not just anchorX) to clear the docking park, the
miniature FAERS chip moves vertically by the same amount, and there
is no H-band safety net for mini chips (they carry no `data-chip`,
so the H1-H6 rules below cannot hide them). Rule: move FAERS anchorX
only, or re-verify the miniature FAERS pair set if anchorY moves.
Same standing trap for the future: CFC and Seoul anchorY flow through
too, so any future CFC/Seoul anchorY move also moves the miniature.

## (b) TABLET_ANCHORS: fully separate, no leakage possible

`TABLET_ANCHORS` (lines 133-158) is a standalone literal table with
three keys (`portrait-narrow`, `portrait-wide`, `landscape`), keyed by
label string. The section loop (line 619-620) and the JSX base
(`chipBaseAnchor`, lines 867-870) both read it whenever
`heroBand === "tablet"`, and the loop skips the laptop companions
entirely in the tablet band. Desktop anchor changes therefore cannot
leak into any tablet lane by any code path.

Two couplings to respect, neither is a leak: (1) tablet lookup is by
`chip.label` string, so do not rename labels (the arrays are
index-based via refs, so do not reorder `CURSOR_CHIPS` either);
(2) durations, phases, and colors still flow from `CURSOR_CHIPS`
even in the tablet band (`TABLET_ANCHORS` carries only anchors and
radii) - irrelevant for anchor-only changes, but a radius or duration
change would not be tablet-insulated.

## (c) Pills, parallax, gating, companions

- Pills: `FACT_PILLS` (lines 191-230) is an independent array with
  independent CSS (Seoul pill left 59% top 32%; CFC pill bottom 30%
  right 14%, 45% in 1161-1400; FAERS pill top 62% left 7%). Chip
  anchor changes cannot move any pill. Only chip-vs-pill proximity
  must be re-checked: StrokeSense vs Seoul pill is a NEAR pair
  (right-anchored SS chip ends ~58px short of the pill at 1440px;
  moving SS anchorX right eats that gap fast), FAERS vs FAERS pill
  is far (y-separated ~235px at S=800).
- Parallax: collage-layer only, +-8px, mouse-only, off under
  reduced-motion (lines 742+). It never moves chips, but it moves
  CARDS relative to chips, so every worst-phase gap must still
  include the 8px parallax term, as prior rounds did.
- Gating: `heroBand` (line 443) is viewport-media based
  (desktop >= 1161px, tablet 720-1160, miniature < 720). The section
  loop early-returns under reduced-motion or in the miniature band;
  the miniature loop runs only in the miniature band. Anchor changes
  do not affect gating, band boundaries, or the 720-734 scrollbar
  seam (a tablet/miniature interaction, untouched by desktop anchors).
- Companions are DUAL, and this is the most important interaction.
  The 1161-1400 companions exist twice: JS (`laptopMql`, line 575;
  Seoul anchorX 0.70 at line 624, StrokeSense anchorY 0.45 at line
  633) AND CSS `!important` rules (StrokeSense `top: 45%`, line
  1392; Seoul `right: 30%`, line 1452). The loop assumes JS anchor
  == CSS base; changing one without the other breaks converge
  targets on hover desktops. Band-split consequence:
  - FAERS has NO companion: a base change applies at ALL desktop
    widths (1161px and up).
  - StrokeSense anchorX change applies at ALL desktop widths
    (the companion overrides anchorY only).
  - StrokeSense anchorY base change (0.33) applies ONLY above
    1400px; the 1161-1400 glyph park is governed by the companion
    0.45, not the base.
  - Changing the companion itself affects ONLY 1161-1400, and
    requires the JS + CSS edit together.
  - The same split holds for Seoul (base 0.80 above 1400,
    companion 0.70 in 1161-1400), though Seoul is not moved.
- Converge: targets are computed from the (possibly companion
  overridden) anchor plus the word rect expanded 20px. New anchors
  change which word edge a hovered chip converges to and where it
  rests while hovered. The old FAERS comment (line 111) shows why
  this matters: anchorX 0.195 was chosen partly because the
  CONVERGED chip parks 13px past MicroscopeCard's right edge.
  Hover-converged positions must be re-verified at the new
  anchors, not just drift positions.
- The 0.5 flip trap: JSX base and loop math both switch between
  left-anchored (anchorX <= 0.5) and right-anchored (anchorX > 0.5).
  JS and JSX agree, but a move crossing 0.5 shifts the chip's
  rendered x by a full chip width discontinuously. Keep
  StrokeSense anchorX > 0.5 unless the flip is explicitly modeled.

## (d) Reduced-motion H1-H6 bands: scope and what must be recomputed

All six bands (lines 1642-1668) are `prefers-reduced-motion`
ONLY and desktop-ONLY (every one carries `min-width: 1161px`).
Tablet and miniature reduced-motion behavior is untouched by
desktop anchor changes. The reduced-motion pill hide (lines
1690-1693) targets `.mv-diorama-pill` only and is anchor-independent.

| Band | Chip / park | Recompute? |
|---|---|---|
| H1: 1161-1380, VH <= 803 | FAERS / docking | YES - FAERS moved |
| H2: 1301-2190, VH >= 951 | FAERS / stickers | YES - FAERS moved |
| H3: 1161-1400, VH <= 680 | Seoul / awards | NO - Seoul unmoved |
| H4: 1401-1600, VH <= 708 | Seoul / posterwindow | NO - Seoul unmoved |
| H5: 1401-1990, VH <= 846 | StrokeSense / search | YES - SS base moved |
| H6: 1401+, VH <= 824 | Code for Cure / gutaxis | NO - CFC unmoved |

Recomputing means more than shifting boundaries: the H-band fixer
must scan the full desktop grid for NEW rest parks of FAERS and
StrokeSense at the new anchors (a moved chip can park somewhere
nobody has measured), then set or delete bands accordingly. Carry
forward the standing caveat from the H-band comment: collage float
still bobs under reduced-motion on desktop/tablet (the float-kill
rules live only in the mobile/miniature blocks), so cards can
transiently graze a static chip just above a band edge
(Seoul-awards to ~VH 703, CFC-gutaxis to ~VH 861) - recomputed
bands should either include float margin or keep that caveat.

## Re-verification checklist (priority order)

1. New desktop anchors: full grid W 1161-2560 x VH 650-1300, moved
   chips vs all 8+ desktop cards, glyphs (pixel-true, not box),
   label strip, pills (esp. SS vs Seoul pill), and each other -
   rest, worst-phase (drift + parallax 8 + float 8), and durations.
2. Band split: verify 1161-1400 (companions) and >1400 (base)
   separately for StrokeSense; verify FAERS at all desktop widths
   (no companion). Confirm JS companion == CSS companion wherever
   a companion value changed.
3. Hover-converged positions at new anchors (all desktop widths):
   converged rest vs microscope, helix, desk, search, review,
   posterwindow; confirm no converged park replaces a drift park.
4. H1, H2, H5 recompute + full rest-park scan for FAERS and SS;
   confirm H3, H4, H6 still stand; confirm the float-bob caveat
   still holds or is fixed.
5. Miniature: confirm FAERS anchorX / SS anchors still overridden
   (0.26 / 0.60 / 0.34) and unchanged; IF FAERS anchorY moved,
   re-verify miniature FAERS pairs (motion + reduced-motion static,
   which has no H-band coverage).
6. Tablet: confirm `TABLET_ANCHORS` untouched and tablet lanes
   unchanged (grep + spot gaps); confirm no label rename or array
   reorder broke the label-string lookup.
7. Pills, parallax, gating, seam: confirm untouched (pill positions,
   +-8px parallax, heroBand boundaries, 720-734 seam behavior).
8. Build passes; no em dash in the diff; docs updated
   (`04-implementation.md` H-band section + the new round's doc).
