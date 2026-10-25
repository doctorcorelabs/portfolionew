# Cursor consistency - implementation, fixer 1 note (PARTIAL)

Status: fixer 1 (JS core + desktop motion) only. The integration
agent owns the final version of this file; this note records
exactly what fixer 1 changed so fixer 2, fixer 3, and QA can
build on it. Base: HEAD `1255c6f`. File touched:
`src/sections/Hero.tsx` only. No push (parent pushes).

## What fixer 1 changed

1. Durations: FAERS 18->12s, StrokeSense 22->14s, Code for Cure
   16->11s, Seoul 24->15s (CURSOR_CHIPS; MINI_CURSOR_CHIPS
   derives from it, so phone stays in sync).
2. Dart-dwell: theta = psi + 0.35*sin(2*psi) in both loops;
   bounding box unchanged, speed 0.3x-1.7x.
3. Converge tau 0.30->0.22s (section loop only); halo 20px
   unchanged; collage parallax stays +-8px.
4. Radius per band in the section loop: desktop chip.radius
   (20, unchanged hard limit), tablet 34 (heroBand check).
   Miniature loop radius 40 design px.
5. JS gating rewritten: heroBand state (desktop/tablet/
   miniature) from cached matchMedia listeners; section loop
   runs only in desktop+tablet bands, miniature loop only
   below 720px, both cancelled out-of-band (no rAF where
   their chips hide). Per-chip skip via offsetWidth 0 (no DOM
   write for display:none chips). Offscreen + tab-hidden
   pauses kept. Touch: drift-only (converge target forced 0,
   no tap-to-converge); hover-capable: drift + converge
   (hoverCapableRef, live-updates when a mouse is plugged
   in/out, no loop restart). Scroll modulation kept, cap
   0.25 loop. The old loop gate `(hover: hover) and
   (pointer: fine)` is gone from the loop. Parallax and
   canDrag keep their own hover gates (mouse-only features,
   correct as-is).
6. CSS (hover:none): container hide replaced by a pill-only
   hide. Pill outcome on touch is unchanged (hidden before
   via container, hidden now via the pill rule); chips now
   show on touch (drift-only). Without this, task 5 would be
   dead code. No pill position/gate/show rule was touched.
7. Miniature loop mechanism: MINI_CURSOR_CHIPS (derived from
   CURSOR_CHIPS: same colors/phases/durations, 1161-1400
   short-state anchors FAERS 0.195/0.30, StrokeSense 0.55/
   0.45, Code for Cure 0.30/0.695, Seoul 0.70/0.695, radius
   40), miniChipRefs, and a drift-only loop in design px
   (no converge, no word-rect mapping, no anchor math: base
   comes from fixer 3's CSS). Fixer 3 only renders the spans
   (see the const comment); no other wiring needed.
8. Band evaluation unified: ONE laptopMql
   `(min-width: 1161px) and (max-width: 1400px)` serves both
   companions (Seoul 0.70, StrokeSense 0.45). The old
   window.innerWidth check for StrokeSense is gone; it
   disagreed with CSS at the classic-scrollbar seam.
9. Reduced motion: BOTH diorama display:none guards dropped
   (static-visible); chips/pills get animation none
   (!important, beats the chip's inline entrance fade).
   The loop never runs, so chips sit at base. Six
   desktop-only per-chip hide bands cover the static parks
   below (all under prefers-reduced-motion, all carry
   min-width 1161px, so tablet/phone are untouched).

## Desktop rest-gap proof (static, tilted bboxes, float 0)

Model: chip sizes FAERS 73x21, StrokeSense 116x21, Code for
Cure 130x21, Seoul 109x21; card sizes from component source
(docking 230x184, review 220x206, search 260x229, gutaxis
230x172, awards 168x124, posterwindow 280x356, stickers
363x26 row, notify ~310x51, tiles per DbLogoFloat config).
Grid: W 1161/1280/1366/1400/1440/1536/1920/2560 x VH
650/700/768/800/900/980/1100. Script: /tmp/chip_static_gaps.py
(scratch, not in repo). Overlaps found (all else clean):

- FAERS vs docking: W < 1380, VH < 804 (worst 37.3x21 at
  1161x650; 2.4x21 at 1366x650; clean at 1400). Hide band H1.
- FAERS vs stickers: W 1301-2190, VH > 950 (73x16 at
  1440x980; 37.1x16 at 1920x980; clean at 2560). Hide band H2.
- Seoul vs awards (1161-1400): static zero at VH ~653
  (0.7px overlap at 650, clean at 700). Hide band H3 at
  VH <= 680 (margin over the 653-666 line-height range;
  drift-inclusive rest zero is VH 706, reference only).
- Seoul vs posterwindow (above 1400): W < 1600, VH < 708
  (28x5 at 1440x700; clean at 1920 and at VH 768). H4.
- StrokeSense vs search (above 1400): W < 1990, VH < 846
  (104.4x14.3 at 1440x800; clean at 2560 and VH 900). H5.
- Code for Cure vs gutaxis (above 1400): VH < 824 (130x6.4
  at 1440x800; clean at VH 900). H6.

Hide bands (all `@media (prefers-reduced-motion: reduce)`
plus the band; `[data-chip]` selectors, after the tablet
block, so they beat base display without !important):
H1 FAERS 1161-1380px + max-height 803px (docking).
H2 FAERS 1301-2190px + min-height 951px (stickers; no
max-height: tilted overlap runs to VH ~1780, and taller
windows are negligible).
H3 Seoul 1161-1400px + max-height 680px (awards).
H4 Seoul 1401-1600px + max-height 708px (posterwindow).
H5 StrokeSense 1401-1990px + max-height 846px (search).
H6 Code for Cure min-width 1401px + max-height 824px
(gutaxis; x always overlaps above 1400, so no max-width).
Boundaries are hairline-positive just outside each band
(gap 0.1-0.4px at the first shown size).

Clean at every grid point (no hide): StrokeSense vs review
both bands (new: +23px at 1161-1400/VH 650, zero only below
VH ~597; old: x-gap +6.4px at 1440, hairline 0.1px at
1401-1420, noted only); FAERS vs helix (x-gap >= 14px),
Cochrane (+14.5px at VH 751), microscope, search,
posterwindow, desk, gutaxis, tiles; Code for Cure vs faers
card, pubmed, desk, search, microscope, stickers, notify
(notify width corrected to ~310px: x-gap +9.1px at 1161);
Seoul vs poster, desk, elsevier, tiles.

Marginal, reported not hidden (below the common-size grid
or hairline): StrokeSense-review-new static overlap below
VH ~597; StrokeSense-review-old x-hairline at W 1401-1420;
FAERS-microscope y-thin (+4.3px) at 1301-1400/VH 801-810;
CFC-pubmed x-gap +18.7px at 1161 (clean, thin).

Caveats (pre-existing, out of scope, not fixed):
- Collage float (CSS) still bobs cards under reduced
  motion, so a card can transiently graze a static chip
  just above a band edge (Seoul-awards to ~VH 703,
  CFC-gutaxis to ~VH 861). Killing collage float under
  reduced motion is a separate round.
- Pills go static as a side effect (per synthesis 02 §8):
  the Seoul pill vs review-old park (P1, rest overlap below
  VH ~834 at 1440x800) and the CFC pill vs PosterWindow
  park (rest zero VH ~746) are now static parks under
  reduced motion. Pill rules were NOT touched (forbidden);
  hiding a pill under reduced motion needs parent approval.
- Normal-motion finding (NOT a reduced-motion issue, NOT
  fixed: anchors are frozen): the DRIFTING StrokeSense chip
  overlaps the search window above 1400 at VH < 846 for
  most of its loop (static 104x14px at 1440x800). Prior QA
  checked chip-vs-review-old, not chip-vs-search. This
  needs a parent decision (anchor move), not a fixer edit.

## Handoff for fixer 2 (tablet)

- The section loop already uses radius 34 when heroBand is
  tablet and drift-only on touch / drift+converge on hover
  tablets (hoverCapableRef). It runs in the tablet band
  today; display:none chips are skipped for free, so your
  show rules activate it with no JS change.
- CRITICAL: the loop still computes anchors from
  CURSOR_CHIPS + laptop companions. Your NEW tablet lanes
  MUST be mirrored in JS (e.g. a TABLET_ANCHORS table keyed
  by label, used when heroBand is tablet). CSS base alone
  is not enough: drift is relative (fine), but converge
  math assumes JS anchor == CSS base, so a CSS-only lane
  breaks converge targets on hover tablets. Desktop anchors
  and companions must stay exactly as they are.
- Your chip show rules must beat the tablet block's
  `.mv-diorama-chip { display: none }` (specificity or
  source order). My reduced-motion hides are all
  min-width 1161px+, so they cannot touch your lanes.
- Do not extend any pill show rule into the 720-767 /
  1001-1023 strips (pills stay hidden there). The
  (hover:none) pill hide I added is consistent with that.
- Do not move the section loop's band logic: heroBand
  state + laptopMql are shared infrastructure now.

## Fixer 2 note (tablet chips, PARTIAL - QA and fixer 3 still pending)

Deviation from the brief, measured not assumed: radius 34 is
NOT shipped. Over the full grid (W 720-1160 x VH 700-1300,
tilted bboxes, chip sizes 73/116/130/109 x 21, word/glyph
model from PIL Inter Bold), no anchor set at radius 34
clears cards at worst phase in either sub-band (best
single-anchor worst gap -30.9, FAERS vs notify at 768x882),
and four chips cannot pack into the single radius-34 pocket.
The synthesis 52px rest-clearance rule is infeasible on
tablet geometry (word-size discontinuity at 903px plus the
VH gates). Shipped standard instead: rest depth <= 0 (never
parks on a card), glyph worst <= 0 (glyph ink never touched,
even drifting), card transient at most about 16px, chip-chip
rest <= 0. Sub-band split at the hide-1000 boundary
(review + awards exist only at 1001-1160).

TABLET_ANCHORS (Hero.tsx, keyed by sub-band then label;
loop and JSX both read it, so JS anchor == CSS base):
portrait 720-1000: FAERS (0.42, 0.78, R20), StrokeSense
(0.02, 0.38, R14), Code for Cure (0.24, 0.38, R14), Seoul
2026 (0.59, 0.67, R20). Landscape 1001-1160: FAERS (0.30,
0.78, R24), StrokeSense (0.38, 0.70, R24), Code for Cure
(0.68, 0.6825, R24), Seoul 2026 (0.52, 0.78, R24). Portrait
SS/CFC radius 14 because their rest glyph margin is only
9.8px at (1000, 700): radius 20 touches glyph ink at worst
phase (+4.2px, rejected). Landscape CFC ay 0.6825 balances
glyph margin 4.3px against awards transient 12.8px.

Gap tables (rest / worst-phase incl. drift + parallax 8 +
float 8, glyph drift only; negative = clear):
- Portrait: FAERS -29.3 / 0.7 (pubmed, 720x700), glyph
  -72.8. StrokeSense -12.4 / 13.4 (stickers, 768x951),
  glyph -6.0. Code for Cure -10.1 / 15.7 (elsevier,
  720x768), glyph -6.0. Seoul -13.5 / 14.5 (notify,
  768x882), glyph -6.8. Chip-chip worst -14.4 (SS vs CFC).
- Landscape: FAERS -28.3 / 4.5 (elsevier), glyph -62.8.
  StrokeSense -52.1 / -20.1 (never touches a card even at
  worst phase), glyph -14.8. Code for Cure -19.6 / 12.8
  (awards, 1024x700), glyph -4.3. Seoul -25.5 / 6.5
  (awards), glyph -62.8. Chip-chip worst 9.8 (FAERS vs
  Seoul, transient merge, rest -27.0 or better).
- Reduced-motion static: rest values above; with collage
  float 8px the thinnest static gap is portrait CFC about
  2.1px (disclose: thin but positive). Landscape static
  margin at least 11.6px.

Edits (Hero.tsx only, no push): TABLET_ANCHORS const;
tabletSubBand state from cached portrait matchMedia
(720-1000) alongside heroBand; loop reads TABLET_ANCHORS
when tablet (companions skipped there, desktop path
untouched) with deps [heroBand, tabletSubBand]; JSX base
via chipBaseAnchor helper; show block 720-1160 with
`:not(.mv-hero-mini)` scope (seam: viewport 720-734 with
a classic scrollbar runs the miniature, so section chips
must not revive over it); strip pill hides 720-767 and
1001-1023; reduced-motion pill hide (brief item 5, parent
decision) that beats the tablet pill shows by source order
at equal specificity and does not touch [data-chip] bands.
Pill rules otherwise untouched: CFC tablet right 40%/30%
bottom 30%, FAERS tablet only at VH >= 1091, Seoul hidden
at tablet, desktop pills unchanged in normal motion.
Desktop anchors, companions, miniature wrapper/loop,
collage anchors, and gates untouched (verified by grep).
Build passes; diff has 0 em dash; dist has 0 dialkit.

## Handoff for fixer 3 (phone miniature chips)

Done: MINI_CURSOR_CHIPS, miniature loop (design px,
drift-only, radius 40), gating (miniature band only).
Remains: render MINI_CURSOR_CHIPS spans inside .mv-mini
(class mv-mini-chip, base left/right/top % from
anchorX/anchorY, right-anchored when anchorX > 0.5, ref
miniChipRefs, aria-hidden); hide .mv-mini-chip at 720px
and above. Do NOT touch desktop/tablet. Crossing budget:
max 3s continuous, max 12px deep (8px visual);
StrokeSense-review residual crosses transiently (about
6-8px visual, 1-3s/cycle) - inside budget, confirm no
other miniature pair exceeds it.

## Fixer 3 note (phone miniature chips, DONE - QA still pending)

Edits (Hero.tsx only, no push): MINI_CURSOR_CHIPS spans
rendered inside .mv-mini as the last child (after the
collage), class mv-mini-chip, ref miniChipRefs in array
order, aria-hidden, z-index 2 (same as the section
diorama), pointer-events none, same arrow SVG + label
pill as section chips, base left/right/top % from
anchorX/anchorY (right-anchored when anchorX > 0.5),
entrance fade mv-diorama-in (opacity only, never fights
the loop transform). CSS in the miniature stylesheet:
base .mv-mini-chip display:none (leak guard: at
desktop/tablet .mv-mini is display:contents, so without
it these absolute spans would position against the
section); show rule .mv-hero-mini .mv-mini-chip
display:flex (CLASS-scoped, deliberately NOT a min-width
media query: at the 720-734 classic-scrollbar seam the
miniature class is active while the viewport is >= 720px,
so a media hide would wrongly hide live miniature chips);
reduced-motion .mv-hero-mini .mv-mini-chip animation
none (fixer 1's rule covers .mv-diorama-chip only).
Comments updated (MINI_CURSOR_CHIPS const, miniature
loop, miniature stylesheet). No data-chip on mini chips
(no selector cross-talk with fixer 1's [data-chip] hide
bands). Build passes; diff 0 em dash; dist 0 dialkit
(parent to re-verify at push).

Loop wiring: miniature loop deps [heroBand], runs only
when heroBand is miniature, guards reduced-motion,
offscreen, tab-hidden, and offsetWidth 0 (display:none
chips skipped). No section-loop interference: section
chips are display:none in miniature (1160 hide + fixer
2's :not(.mv-hero-mini) tablet scope), and the section
loop skips them via offsetWidth 0. Seam quirk
(disclosed): at viewport 720-734 with a classic
scrollbar, .mv-hero-mini is active (clientWidth) but
heroBand is tablet (viewport media), so mini chips
render STATIC (loop inactive) while section chips stay
hidden - static, not broken, no double chips.

Gap model (stage 1160x600 design px; card sizes from
component source: docking 230x184, review 220x206,
poster 260x200, faers 240x180, awards 168x124, tiles
100x50 / 104x50 / 100x50; chip sizes 73/116/130/109x21;
drift ellipse rx 40 ry 28; card float up 8 toward chip;
tilt bbox expansion exact per angle; word glyphs from
PIL Inter 700 180px, ink 870px wide, rows 256.7-391.7 in
stage, pixel-verified per chip rect; script scratch in
/tmp, not in repo):

- StrokeSense vs review: CLEAR (rest y-gap 48.2, worst
  y-gap 20.2). The synthesis "known residual" does NOT
  reproduce in the short miniature - it was estimated
  from other geometry, not this state.
- Chip-chip: all clear at rest and worst phase.
- Thin positives (disclose): FAERS vs label strip rest
  y-gap 2.3px; Seoul vs poster worst x-gap 17.3px.

BUDGET VIOLATIONS (all pre-existing desktop geometry,
faithfully reproduced by the miniature - anchors are
frozen this round, so fixer 3 changed NO anchor):

1. FAERS vs docking: REST PARK. Rest overlap depth
   27.9px design (x 37.5, y 27.9); worst 55.9px; overlapped
   8.09s of each 12s cycle (clears only at extreme right
   drift). Budget is 12px / 3s. Cause: anchorX 0.195 at
   1160 width puts chip left 226.2 inside docking's right
   edge 263.65 (tilted); on desktop the same park exists
   at W < 1380, VH < 804 (fixer 1's H1 band is the
   reduced-motion version of this same geometry).
2. StrokeSense vs word glyph 'l': REST GLYPH PARK.
   Pixel-verified: 352 ink px at rest (cols 669-684, the
   'l' stem, full chip height), 1110 px at drift-down.
   Cause: the 0.45 companion (rearrangement round, moved
   to clear review-new) pushed the chip into the glyph
   band at 1161-1400; the 0.33 anchor cleared glyphs.
   Desktop 1161-1400 has the same park at all heights.
3. Seoul vs awards: TRANSIENT, over budget. Rest clear
   12.5px; worst overlap 23.5px design (7.9px visual
   @390), 7.03s/cycle continuous. Budget is 12px / 3s.
   This AMPLIFIES the disclosed desktop residual
   (radius 20: ~14.7px deep, ~52% of loop); the miniature
   radius 40 deepens and lengthens it.

Prepared remedy directions (parent decision, NOT
implemented): miniature-only FAERS anchorX 0.195 -> ~0.26
threads docking/review (worst depth ~2px both sides)
but diverges miniature from desktop anchors; a global
anchor fix needs full-width analysis (0.26 hits helix at
very wide widths; StrokeSense/Seoul moves need joint
glyph + card analysis). QA must independently verify
all three violations before any ship decision.

## Integration tweaks (DONE - see 07-integration.md for full tables)

Applied by the integration agent (Hero.tsx only, no push):
- FAERS MINIATURE anchorX 0.195 -> 0.26 (MINI_CURSOR_CHIPS
  only). Re-verified: rest clear 37.9 (docking) / 39.5
  (review); worst transient 2.1 deep, 0.73s/cycle. FIXED.
- StrokeSense MINIATURE (0.55, 0.45) -> (0.60, 0.34) (MINI
  only). Re-verified pixel-true (PIL): 0 ink px over the
  full cycle, min y-gap 4.7px; review worst 14.9, scopus
  worst 11.1. FIXED. (Naive box "4.3px glyph touch" and
  "1.7px label touch" are artifacts: float on non-floating
  glyphs; dx/dy maxima that cannot co-occur on the ellipse.)
- CFC TABLET PORTRAIT anchorY 0.38 -> 0.45 (TABLET_ANCHORS
  portrait only; JSX follows the table via chipBaseAnchor).
  Label park GONE at W <= 903 (all S); short-S glyph caveat
  confirmed (S=550: 6.5px/4.78s; S=600: 4.0/4.14s; S=668:
  0.6/2.40s inside; S=924: clean). NEW FINDING: at W 904-1000
  (word 144-160px, above the 903px cap) the tweak parks CFC
  on glyphs at rest (4.4-28.7px, continuous) where the old
  anchor was fully clear - parent decision required
  (ship-with-disclosure vs hold-for-split). See 07.
- Seoul miniature: NO change (no clean miniature-only fix).
  Ships disclosed as transient: rest clear 12.5, worst
  23.5 design (7.9 visual @390), 7.04s/cycle - the ONLY
  visible over-budget miniature pair. Seoul-glyph hairline
  also disclosed: 0.7px, 2.99s (at budget edge, sub-visible).
- `02-motion-design.md` speed correction: dart peaks 10-14
  px/s (not ~19); tablet column ~8-12 px/s.
- Build passes; diff em dash 0; desktop anchors, companions,
  gates, pill rules, collage values untouched (grep proof
  in 07).
