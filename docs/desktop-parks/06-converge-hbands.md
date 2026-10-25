# Converge + reduced-motion H-bands under new desktop FAERS / StrokeSense anchors

Base: HEAD `15c3ed9`. Scope: desktop section chips only;
tablet/miniature appear only as isolation checks. Pills
untouched. Lane direction per lane-search briefs: FAERS away
from docking, SS away from glyphs/search. No new anchor values
prescribed here.

## 1. How converge actually works (loop, Hero.tsx §535-690)

- Hover source: `<h1>` mouse enter/leave, hover-capable only.
  Touch: drift-only. Miniature loop: no word-rect mapping.
- Per frame it reads the live word rect, expands it 20px
  (halo), targets the nearest point on the expanded rect to
  the drifting center, or the nearest edge if the center is
  inside (never onto the word). Blend tau 0.22s plus
  smoothstep; final write is drift + (converge - drift) x
  eased, no CSS transition. Converged left = nx - chipW/2,
  top = ny - chipH/2. Sizes: FAERS 73x21, SS 116x21 (height
  bounds 21-28).
- Parallax moves `.mv-collage` only, so the word rect is
  static: converge-vs-word is parallax-free, but
  converge-vs-card must add parallax +-8px plus card float
  (up-only 8px, correct direction per pair).
- Hover-enter sweeps blend 0 to 1 (~0.7s to ~95%); hover-leave
  sweeps back while drift advances. Endpoints and paths
  differ: a converged chip PARKS at its endpoint while hover
  lasts (unbounded, must be clean); a path crossing lasts
  <1s (must be shallow).

## 2. What anchor moves do to converge

Regimes (center = anchor + half-size + drift, vs expanded
word rect):

(a) Center outside on one axis only: that axis's endpoint
is the edge, the other is the center, so the endpoint TRACKS
the anchor 1:1 on the tracking axis. FAERS today is in this
regime at 1440/H800 (inside horizontally, above vertically):
converged x = rest center x, converged y = expanded top
edge. Moving anchorX by D moves converged x by D; moving
anchorY can flip the regime and switch the edge.

(b) Center inside both axes: the endpoint is the nearest
edge, which FLIPS discontinuously as the anchor moves.
StrokeSense today is in this regime at 1161-1400 (companion
0.45 puts its center inside the rect, hence the glyph rest
park): converge pushes it to the top edge, sweeping glyph
tops on hover-enter. Moving SS off glyphs either exits the
rect (path approaches from outside, never crosses glyphs)
or lands inside with a different nearest edge. Map flip
thresholds per band; do not assume the top edge survives.

Consequences:

- FAERS rightward (away from docking): drift rest clears
  docking, and converged x moves right 1:1 while regime (a)
  holds, so microscope clearance grows. But re-check the
  converged chip against helix (27%/2%), review (1161-1400
  top-center-left), docking's right edge, and the frame's
  top edge per width band, and sample the swept segment,
  not just endpoints: a card between the drift ellipse and
  the word edge is crossed even if both endpoints clear it.
  Sample blend 0 to 1 at multiple drift phases plus
  scrollPhase 0 and 0.25.
- SS off glyphs/search: rest clears glyphs and search, but
  edge selection must be recomputed per band (1161-1400
  companion vs >1400 base): word rect width/position change
  with stage width, so one anchor can converge to different
  edges in different bands. Check it against review, search,
  posterwindow, helix, and the frame top edge. If the new
  center exits the rect, prove the approach segment stays
  outside per candidate; do not assert it in general.
- The old 13px microscope claim is DEAD for new anchors. It
  was computed for anchorX 0.195 at 1440/H800: converged
  left = 0.195 x 1440 = 280.8, microscope right about 267.8,
  and it holds only in regime (a). Worse, "1440/H800" is
  ambiguous: microscope shows only at W>1300 AND VH>800,
  so VH 800 is hidden and only a stage-height reading (VH
  900) is visible. Recompute converged-FAERS vs microscope
  at VH 801+ per band and report the new clearance; never
  quote 13px for a new anchor.
- Trap: the miniature precedent does not transfer.
  Miniature FAERS 0.26 is clear partly because helix is
  miniature-hidden; on desktop helix is visible (1161-1400,
  VH>750) and the old comment gives FAERS only 15px drift
  clearance to the helix box at 0.195. A rightward move eats
  that clearance first. Check FAERS vs helix in drift AND
  converge regimes before adopting any anchor.
- Companion lockstep: if the round changes the 1161-1400
  companions, change JS (`laptopMql` values) AND CSS
  together (StrokeSense `top: 45% !important`, Seoul
  `right: 30% !important`), or JS anchor != CSS base and
  converge targets break on hover desktops, the failure
  fixer 2 warned about for tablets.
- Isolation (verify by inspection): tablet converge reads
  `TABLET_ANCHORS` when heroBand is tablet, so desktop edits
  cannot leak into tablet converge. Miniature loop is
  drift-only. Follow-through: `MINI_CURSOR_CHIPS` derives
  from `CURSOR_CHIPS` with FAERS-X pinned 0.26 and SS pinned
  0.60/0.34, but FAERS-Y follows desktop (0.30 today). If
  the round changes desktop FAERS anchorY, miniature FAERS
  anchorY moves with it: decide explicitly whether to pin
  it or re-verify the miniature.

## 3. H-bands: what survives, what must be recomputed

Current bands (stylesheet §1642-1668, all reduced-motion +
min-width 1161px, `[data-chip]`, after the tablet block):

- H1 FAERS 1161-1380 x VH<=803 (docking; worst 37.3x21 at
  1161x650).
- H2 FAERS 1301-2190 x VH>=951 (stickers; 73x16 at 1440x980;
  no max-height, runs to VH ~1780).
- H3 Seoul 1161-1400 x VH<=680 (awards; static zero VH
  ~653).
- H4 Seoul 1401-1600 x VH<=708 (posterwindow; 28x5 at
  1440x700).
- H5 StrokeSense 1401-1990 x VH<=846 (search; 104.4x14.3
  at 1440x800).
- H6 Code for Cure 1401+ x VH<=824 (gutaxis; 130x6.4 at
  1440x800; no max-width).

Model convention (fixer 1, 04-implementation.md): static,
tilted bboxes, float 0, grid W 1161-2560 x VH 650-1300,
boundaries hairline-positive just outside (0.1-0.4px gap at
first shown size). Float still bobs under reduced-motion on
desktop/tablet, so grazes extend just above band edges
(Seoul-awards ~VH 683-703, CFC-gutaxis ~VH 861): a disclosed
caveat, not part of the boxes.

Verdicts:

- H1: RECOMPUTE. If the new anchor clears docking at rest
  across 1161-1380 x VH<=803, DELETE H1. If a residual box
  remains, REPLACE it with the new boundary (binary-searched
  to +-1px). Never leave the old box: it would hide a clean
  chip and miss a shifted park.
- H2: RECOMPUTE. A rightward move likely clears stickers,
  but verify to at least W 2190, and to 2560 if clearance
  is still narrowing there.
- H5: RECOMPUTE across 1401-1990 x VH<=846, and check
  beyond 1990 to 2560: a moved SS anchor must not open a
  new park at wider widths.
- H3, H4, H6: STAY VALID. Seoul and Code for Cure anchors
  are untouched and no card moves. Spot-check each boundary
  (Seoul-awards zero ~VH 653; Seoul-posterwindow W<1600,
  VH<708; CFC-gutaxis VH<824) and confirm selectors and
  source order. If any card moves, recompute these three
  too.
- Chip-chip static gaps are NOT covered by any H-band. New
  FAERS/SS anchors change chip-chip rest geometry. Compute
  them; a chip-chip static overlap needs its own hide or an
  anchor fix, never silent coverage by a card band.
- Deletion discipline: obsolete bands get DELETED, not left
  as dead rules. Replaced bands get exact new boundaries,
  never widened "for safety" (an over-wide band hides clean
  chips).
- Keep the float-0 convention and caveat. Do not fold float
  into the new boxes mid-round: it would invalidate the
  H3/H4/H6 comparisons and over-hide. Float-inclusive bands
  are a separate decision.
- Keep new bands desktop-only (min-width 1161px),
  reduced-motion-scoped, `[data-chip]` (tablet lanes and
  `.mv-mini-chip` spans unaffected; mini chips carry no
  data-chip), placed after the tablet block. Do not touch
  the reduced-motion pill hide.

## 4. Checklist for the H-band fixer

1. Recompute static gaps (float 0, tilted bboxes, chip
   73/116/130/109 x 21, height bounds 21-28) for new FAERS +
   SS anchors, grid W 1161-2560 x VH 650-1300, refinement
   to +-1px, vs all cards + glyphs + label + chip-chip.
2. H1/H2/H5: delete if cleared everywhere, else replace
   with exact new boundaries, hairline-positive just
   outside (0.1-0.4px).
3. H3/H4/H6: spot-check boundaries, selectors, source
   order; recompute only if a card moves.
4. Chip-chip static gaps for new anchors; resolve any
   overlap with its own hide or an anchor fix.
5. Converge re-verification per candidate lane x band
   (1161-1400 companion vs >1400 base) x VH grid: rest,
   drift extremes, endpoint (blend 1), path samples (blend
   0 to 1, drift phases, scrollPhase 0/0.25), hover-enter
   and -leave. Endpoints clean (unbounded hover); paths
   shallow (<1s, within transient budget). Document
   regime-flip thresholds.
6. Recompute converged-FAERS vs microscope at VH 801+ per
   band; report the new clearance; never quote the old
   13px.
7. Check FAERS vs helix in drift AND converge regimes;
   miniature 0.26 precedent does not transfer.
8. Companion lockstep: JS `laptopMql` values and CSS
   `[data-chip]` top/right rules move together, or
   converge targets break.
9. Confirm tablet isolation (`TABLET_ANCHORS` branch) and
   miniature isolation (drift-only); decide FAERS-Y
   follow-through explicitly (pin or re-verify miniature).
10. Keep bands desktop-only, reduced-motion-scoped,
    `[data-chip]`, after the tablet block; pill hide
    untouched; no safety-widening; delete obsolete bands.
11. Update 04-implementation.md H-band section plus the new
    round doc with new boundaries, model, endpoint/path
    tables.
