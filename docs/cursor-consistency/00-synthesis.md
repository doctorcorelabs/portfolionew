# Cursor consistency - synthesis (parent, 2026-10-25)

Source reports: `01-impl-audit.md`, `02-motion-design.md`, `03-band-audit.md`.
Base: HEAD `1255c6f`. All edits in `src/sections/Hero.tsx` only (plus docs).
User ask: cursor chips on every device (not just desktop), motion more active
(not just small drift). Scope: the 4 `data-chip` cursor chips only. Pills
(Seoul / FAERS / CFC) are OUT of scope - no pill rule changes.

## Decisions (all three reports agree unless noted)

1. One system, two renderings. Same 4 chips, same colors, same phases
   (0 / 0.3 / 0.55 / 0.8), same durations, same scroll modulation everywhere.
   Tablet: native-size chips, NEW per-band anchors. Phone (<720px): a second
   chip set INSIDE `.mv-mini` (scaled with the miniature), same short-state
   anchors as the desktop 1161-1400 miniature, drift-only.
2. Faster everywhere (safe, zero clearance impact): durations 18/22/16/24s
   become 12/14/11/15s (FAERS / StrokeSense / CFC / Seoul).
3. Dart-dwell phase shaping everywhere: theta = psi + 0.35*sin(2*psi), so
   speed varies 0.3x-1.7x around the mean (near-pause, then dart) with the
   bounding box unchanged. This is what makes motion read as active.
4. Radius per band (hard limits, measured):
   - Desktop: stays 20px H / 14px V. Growing it would park chips on cards
     (StrokeSense vs review rest margin only +1.72px at VH 650, 1161-1400;
     Seoul vs awards already grazes). Desktop activity comes from speed +
     dart-dwell, NOT extent. Bigger desktop extent needs re-anchoring two
     lanes first (future work, not this round).
   - Tablet: 34px, but only where rest clearance is >= 52px in the binding
     direction (34 radius + 8 parallax + 10 float). Otherwise shrink that
     chip's radius first.
   - Miniature: 40 design px (visual 11.0 / 13.4 / 24.8 at 320 / 390 / 719).
     Crossing budget: max 3s continuous, max 12px deep (8px visual).
     The StrokeSense-review residual will cross transiently (~6-8px visual,
     ~1-3s/cycle) - inside budget, not zero-overlap.
5. Touch: drift-only, no converge (no hover on touch, no tap-to-converge).
   Scroll modulation KEPT (cap 0.25 loop) - it is the interactive channel
   on touch. Hover-capable tablets keep converge like desktop.
6. Converge (desktop + hover tablets): time constant 0.30 -> 0.22s, halo
   20px unchanged. Mouse parallax KEPT at +-8px, do not bump.
7. JS gating: the loop runs ONLY in bands where chips are visible (cached
   matchMedia, not per-frame queries); skip DOM writes for display:none
   chips; keep offscreen and hidden-tab pauses. The old gate
   `(hover: hover) and (pointer: fine)` must go - it is why touch never
   animated. Miniature needs its own loop mode: design coordinates
   (stage 1160x600), transforms written in design px, drift-only, no
   word-rect mapping.
8. Companion band evaluation unified to ONE method (today Seoul uses
   matchMedia, StrokeSense uses window.innerWidth - they can disagree at
   the scrollbar seam). Fixer 1 picks one and applies it to both.
9. Pills: no rule changes. If the container is revived in the 720-767 and
   1001-1023 strips for chips, pills must STAY hidden there (do not extend
   any pill show-rule).

## Conflict resolved: reduced-motion

Analyst 03 says keep diorama hidden under reduced-motion; analyst 02 says
static-visible. DECISION: static-visible (drop the diorama `display: none`
under reduced-motion, keep `animation: none`, run no loop), because the
user asked for consistency and reduced-motion objects to motion, not to
chips. PROVISO: the fixer must prove rest gaps clean at every band; any
chip whose rest gap is negative at a common size stays hidden under
reduced-motion in that band (implement per-band if needed). Note the
known risk: Seoul vs awards rest gap goes negative below VH ~706 on
desktop (rearrangement residual) - verify before shipping static-visible
there.

## Fixer sequence (ONE file, so strictly sequential)

- Fixer 1 (JS core + desktop motion): durations, dart-dwell, converge
  constant, per-band radius mechanism, JS gating, touch drift-only,
  reduced-motion static-visible (desktop rest gaps), unified band eval.
  Desktop anchors and all gates untouched.
- Fixer 2 (tablet): revive container in 768-1000, 1024-1160, 720-767,
  1001-1023; show chips native with NEW per-band anchors (52px budget);
  pills untouched; converge only where hover-capable.
- Fixer 3 (phone): chip set inside `.mv-mini`, miniature loop mode,
  radius 40 design px, drift-only; desktop/tablet untouched.
- QA (2, parallel, read-only + reports): layout QA (static gaps, pill
  rules intact, reduced-motion static gaps) and motion QA (amplitude,
  speed, crossing budget over full cycles, loop gating, perf).
- Integration/docs agent: final `04-implementation.md`, then parent
  builds, verifies, pushes.
