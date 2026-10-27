# 03 - Waypoint wander per device

Base: HEAD `3ea8892`. Target (given): random waypoint wander, 70-110 px/s,
legs 150-400px, 4 chips with OUR labels (FAERS, StrokeSense, Code for Cure,
Seoul 2026), on phone, desktop, everywhere. Current motion it replaces:
ellipse drift (desktop r 20/14, tablet 14-24, miniature 40 design px),
durations 12/14/11/15s, dart-dwell shaping, hover converge (halo 20px,
tau 0.22s), scroll phase mod 0.25, touch drift-only.

## Verdict in one line

Wander in PIXELS from the live stage rect on every device; speeds are
VISUAL px/s everywhere (the miniature loop divides by miniScale);
anchors retire from motion and survive ONLY as reduced-motion parking
positions (plus initial paint). No band-specific waypoint bounds are
needed anywhere: the inset box adapts itself from the live stage size.

## Per-device waypoint bounds, speeds, legs

Stage: section box, S = max(550, VH-100) at >= 720px (minHeight 550,
height calc(100dvh - 100px)). Chip sizes: widths 73/116/130/109px,
height 28 governing. Waypoints are chip-CENTER positions; inset keeps
chips FULLY visible (no off-edge clipping: our chips carry text labels,
unlike onlines' bare cursor arrows, so a clipped label reads as broken,
not playful). Legs ease smoothstep per leg (mean speed = spec, peak
~1.5x mean). Dwell 0.2-0.5s per waypoint (short, so no dwell reads as
a park). Per-chip independent RNG; current phases (0/0.3/0.55/0.8)
survive only as RNG seed offsets so chips never synchronize.

| Device | Waypoint box (centers) | Speed | Leg | Dwell |
|---|---|---|---|---|
| Desktop wide > 1400 | x [w/2+12, W-w/2-12], y [h/2+12, S-h/2-12], live px | 70-110 px/s, redrawn per leg | 150-400 px | 0.2-0.5s |
| Desktop laptop 1161-1400 | SAME inset rule, live px (no laptop-specific bounds) | 70-110 px/s | 150-400 px | 0.2-0.5s |
| Tablet 720-1160, ALL sub-bands | SAME inset rule, live px (no sub-band bounds) | 70-110 px/s | 150-400 px | 0.2-0.5s |
| Phone miniature (< 720) | DESIGN box x [w/2+12, 1160-w/2-12], y [h/2+12, 600-h/2-12] design px | 70-110 VISUAL px/s = design speed / miniScale (see below) | 150-400 DESIGN px | 0.2-0.5s |

Why no band lanes under wander: TABLET_ANCHORS exist because static
parking needs rest clearance, and clearance differs per sub-band (word
cap jumps at 903/904, landscape layout differs). Wander has no parking:
a chip only dwells 0.2-0.5s, then leaves. The inset box needs only the
live stage size, which already differs per band, so one rule covers
portrait-narrow (720-903), portrait-wide (904-1000), and landscape
(1001-1160), including the strips.

## Phone speed math (the binding calculation)

Miniature scale: 0.276 at 320px, 0.336 at 390px, 0.620 at 719px.
Naive 70-110 DESIGN px/s would read as 19-68 visual px/s (0.276-0.620x),
i.e. 10-17s to cross a 390px screen: drift, not onlines. To FEEL like
onlines, visual speed must be 70-110 px/s on the phone screen itself,
so the miniature loop divides by live miniScale:

| Phone width | Scale | Design speed for 70-110 visual px/s | Visual leg (150-400 design px) |
|---|---|---|---|
| 320 | 0.276 | 254-399 design px/s | 41-110 px |
| 390 | 0.336 | 208-327 design px/s | 50-134 px |
| 719 | 0.620 | 113-177 design px/s | 93-248 px |

Leg length stays in DESIGN px (150-400): a visual 150-400px leg would
need up to 1190 design px at 390px, wider than the 1160 stage. Leg
time at 390px is 0.5-1.9s: brisk, onlines-like. Design speeds look
large but are only the scale conversion; the eye sees 70-110 px/s.

## What replaces each current structure

| Current structure | Under wander |
|---|---|
| CURSOR_CHIPS anchors (FAERS 0.90/0.90, SS 0.505/0.70, CFC 0.30/0.695, Seoul 0.80/0.695) | Retired from motion. Survive as reduced-motion parking + spawn fallback only. |
| Laptop companions (Seoul 0.70, FAERS 0.85/0.04, SS 0.55 + CSS rules) | DELETED from the JS wander path (wander has no orbit center). CSS rules KEPT as reduced-motion parking for 1161-1400. |
| TABLET_ANCHORS (3 sub-bands) | DELETED from motion. KEPT as reduced-motion parking per sub-band (static positions still need band-correct clearance). JSX base positions become spawn positions. |
| MINI_CURSOR_CHIPS overrides (FAERS 0.26/0.30, SS 0.60/0.34, Seoul 0.70, r 40) | DELETED from motion (wander uses the design-stage inset box). KEPT as reduced-motion parking inside .mv-mini. |
| Durations 12/14/11/15, dart-dwell theta shaping | RETIRED. Speed-based legs + smoothstep easing replace them; the "active" feel now comes from legs, not ellipse shaping. |
| Hover converge (halo 20, tau 0.22) | RETIRED on all devices, including hover tablets. Wander is the interactive channel now; converge would fight it (a chip mid-leg yanked to the word edge, then released). |
| Scroll phase mod 0.25, touch drift-only rule | RETIRED (no loop phase left to modulate). Touch needs no special case: wander runs on touch exactly as on desktop, which is the user's ask. |
| Radii (20/14/24/40) | RETIRED. Replaced by the inset margins (half chip size + 12px). |
| Collage parallax +-8px, pills, gates, H-bands | UNTOUCHED. Parallax is collage-layer only; pills never wander; gates/H-bands concern cards and reduced-motion, not chips. |

Spawn: on mount and on band change, place each chip at a RANDOM
waypoint immediately (no animation), then wander. This avoids a
choreographed first-leg sweep from anchors. Reduced-motion paint still uses
anchors, so motion and reduced-motion initial paint differ by design.

## Pass-through: the old park regime retires for chips

Wander crosses cards and the word by design (chips are z 2,
pointer-events none, and already converge onto the word edge today).
Chip-vs-card and chip-vs-word contact under wander is TRANSIENT
pass-through, not a park: a 400px leg crosses a 230px card in ~2-4s
at most, then leaves. Chip-chip crossing is likewise transient and
allowed (independent RNG, no avoidance system). QA must NOT flag transient contact. New QA
rules for wander: (a) chips fully inside the stage at all times
(inset enforced, checked at waypoints AND mid-leg); (b) no dwell
over 1s anywhere; (c) speeds within 70-110 visual px/s per device;
(d) reduced-motion static positions keep their verified clearances
(anchors unchanged, so prior H-band work stands).

## Seams

- 720 seam (miniature vs tablet): chip SETS swap (mini chips hide,
  section chips show), so a position-preserving handoff is fragile
  and NOT attempted. On band change, the new set spawns at random
  waypoints: a one-frame jump, same class as existing seam jumps
  (the whole miniature layout already appears/disappears here).
- 1400/1401 seam: BETTER than today. Chips do NOT jump: waypoints
  are computed from the live stage rect, so a resize only re-bounds
  the NEXT leg; a chip mid-leg keeps its transform, and a waypoint
  outside the new inset box is clamped to the next in-bounds
  waypoint (eases in, never teleports). Pills still jump here
  (CSS rules, unchanged, already disclosed in prior rounds).
- 1160/1161 seam (desktop vs tablet): same as the 720 seam (chip
  set swap, spawn jump acceptable). No special handling.

## Open items for the fixer (not decided here)

RNG source and seed strategy (per-chip seed from phase offsets);
leg-speed redraw per leg (recommended) vs per chip;
whether dwell randomizes per waypoint (recommended, 0.2-0.5s uniform);
confirming the miniature loop reads live miniScale each leg (scale
changes on resize, so a cached scale would mis-speed the wander).
