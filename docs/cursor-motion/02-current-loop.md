# 02 - Current cursor loop, as shipped (base `3ea8892`)

File: `src/sections/Hero.tsx` only. Two rAF loops + one parallax effect.
No source edited here.

## 1. Motion core (section loop; miniature loop identical except noted)

| Piece | Shipped value |
|---|---|
| Phase | `psi = 2π(elapsed/duration + phase + scrollPhase)`; `dt` clamped to 0.05s |
| Dart-dwell | `theta = psi + 0.35*sin(2*psi)`; speed 0.3x-1.7x around mean, box unchanged (desktop mean 7.2-9.8, peaks 10-14 px/s) |
| Drift ellipse | `driftX = r*cos(theta)`, `driftY = r*0.7*sin(theta)`; desktop `r = 20` (box ±20 H, ±14 V, hard limit); tablet `r` from TABLET_ANCHORS; miniature `r = 40` design px |
| Durations / phases | FAERS 12s/0, StrokeSense 14s/0.3, Code for Cure 11s/0.55, Seoul 15s/0.8 (all bands; miniature derives them) |
| Scroll modulation | `scrollPhase = clamp(-stageRect.top / stageRect.height, 0, 1) * 0.25`; same in miniature loop |
| Converge (hover-only) | Word rect expanded 20px halo; nearest point on expanded rect to drifting center; if inside, push to nearest edge; `convergeX/Y = nearest - chipW/2 - anchor` |
| Converge blend | Per-chip `blends[i] += (target - blends[i]) * (1 - exp(-dt/0.22))`, `target = hovering ? 1 : 0`; `eased = b²(3-2b)` smoothstep; `fx = driftX + (convergeX - driftX) * eased` |
| Parallax | Collage layer only, mouse only, ±8px from pointer offset off stage center |
| DOM writes | Direct `el.style.transform = translate(x, y)` per frame; no React state; no CSS transition on chip transform (entrance fade is opacity-only) |

Anchor math uses the rendered section box.

## 2. Anchors (fractions of stage; right-anchored when anchorX > 0.5)

| Chip | Desktop base | Laptop companion (1161-1400, JS + CSS `!important`) |
|---|---|---|
| FAERS | (0.90, 0.90) | (0.85, 0.04); CSS `right: 15%`, `top: 4%` |
| StrokeSense | (0.505, 0.70) | anchorX 0.55 only; CSS `right: 45%`; anchorY stays 0.70 (old 0.45 companion deleted) |
| Code for Cure | (0.30, 0.695) | none |
| Seoul 2026 | (0.80, 0.695) | anchorX 0.70; CSS `right: 30%` |

Loop resolution: tablet reads TABLET_ANCHORS; else companions via ONE cached
`laptopMql` (1161-1400); else base. Right-anchored: `anchorX = effAnchorX *
stageWidth - chipW`, else `effAnchorX * stageWidth`. JSX uses
`chipBaseAnchor` (tablet table or base), so JS anchor == CSS base is a HARD
invariant (converge math assumes it). Lookup by `chip.label`; refs
index-based: never rename, never reorder. 0.5 flip guardrail: crossing 0.5
shifts rendered x by a full chip width.

TABLET_ANCHORS (native-size, revived 720-1160 via `:not(.mv-hero-mini)`):
portrait-narrow 720-903: FAERS (0.42, 0.78, r20), SS (0.02, 0.38, r14), CFC
(0.24, 0.45, r14), Seoul (0.59, 0.67, r20); portrait-wide 904-1000: same
except CFC (0.24, 0.38, r14), Seoul (0.59, 0.685, r20); landscape 1001-1160:
FAERS (0.30, 0.78, r24), SS (0.38, 0.70, r24), CFC (0.68, 0.6825, r24),
Seoul (0.52, 0.78, r24).

MINI_CURSOR_CHIPS (derived, same colors/phases/durations, radius 40 design
px, stage 1160x600 design px): FAERS (0.26, 0.30 PINNED - anchorY would
otherwise follow base 0.90; mini chips carry no `data-chip`, so no H-band
can hide them), SS (0.60, 0.34), Seoul anchorX 0.70 (anchorY flows through
base 0.695), CFC flows through base (0.30, 0.695). Mini loop: drift-only,
no converge, no word-rect mapping, only below 720px.

## 3. DOM structure

`.mv-diorama`: absolute, inset 0, z-index 2 (frame 1, collage 0),
pointer-events none, overflow hidden, aria-hidden. Chip:
`span.mv-diorama-chip`, `data-chip={label}`, absolute, flex row, gap 6px,
pointer-events none. Arrow: SVG 14x17 (viewBox 0 0 14 18), path fill = chip
color, white stroke 0.75. Label pill: JetBrains Mono 11px, ink on white,
1px `#E0E0E0` border, radius 999, padding 3px 8px, nowrap. Base position:
right-anchored if anchorX > 0.5 (`right: (1-anchorX)*100%`), else left;
`top: anchorY*100%`. Measured box sizes (prior rounds, not re-measured
here): FAERS ~73px, SS ~116px, CFC ~130px, Seoul ~109px wide; height
~28px governing (21px content). Mini chips: same arrow + label, z-index 2, hidden at >= 720px.

Pills are NOT loop-driven: FACT_PILLS (Seoul 59%/32%, CFC 30%/14% inline +
laptop 74% / wide 15%/5% / tablet right 40%/30% CSS, FAERS 62%/7%) use CSS
`mv-float` (0 to -10px) only, never drift, never converge, no `data-chip`.

## 4. Gating (cached, never per-frame)

- Effect guards: section loop returns early on SSR, reduced-motion, or
  `heroBand === "miniature"`; mini loop on SSR, reduced-motion, or
  `heroBand !== "miniature"`. Band changes re-run the effect (deps
  `[heroBand, tabletSubBand]` / `[heroBand]`), RESETTING `start` and
  `blends`.
- Offscreen skip per frame: stage outside viewport or width 0 returns
  without writes; tab-hidden pauses via rAF natively.
- Per-chip display:none skip via `offsetWidth === 0` (no DOM write).
- Hover: cached `hoverCapableRef` (`(hover: hover) and (pointer: fine)`);
  `wordHoveredRef` mirrors hover state. Touch: drift-only write + return,
  no converge math (wordRect null); hover-capable tablets converge like
  desktop.
- Bands: desktop >= 1161 / tablet 720-1160 / miniature else; `tabletSubBand` portrait-narrow 720-903 / portrait-wide
  904-1000 / landscape else. Seam: at viewport 720-734 with a classic
  scrollbar, clientWidth drops below 720 so the miniature path is active;
  `:not(.mv-hero-mini)` stops section chips leaking over it.

## 5. Reduced motion + H-bands

- Reduced motion: BOTH loops never run; chips static at base (`animation:
  none !important`); pills hidden EVERYWHERE (all pill classes + base
  selector); grid/word/frame/label forced opacity 1, transform none,
  animation none.
- H-bands: reduced-motion-only `[data-chip] display: none`. H3: Seoul, 1161-1400, VH <= 680. H4: Seoul, 1401-1600,
  VH <= 708. H6: Code for Cure, 1401+, VH <= 824. H1/H2/H5 (FAERS/docking,
  FAERS/stickers, SS/search) were DELETED in desktop-parks after three
  independent rest scans found zero rest parks; do not re-add without a
  new rest park. Pills carry no `data-chip`, so no H-band touches a pill.

## 6. WHAT MUST CHANGE for waypoint wander vs WHAT STAYS

MUST CHANGE (redesign surface; new model belongs to other analysts):
- Drift computation: the `theta` / `driftX` / `driftY` ellipse block in
  BOTH loops is what waypoint travel replaces or extends; a waypoint path
  is not an ellipse around a fixed anchor.
- Anchor/companion semantics: fixed anchor + radius must become a waypoint
  list or path definition. Companions, TABLET_ANCHORS, and MINI overrides
  are all anchor-based and need waypoint equivalents per band, or wander
  defined relative to existing anchors.
- Converge: nearest-point-on-rect + blend must coexist with waypoint
  travel. Open: does hover freeze, override, or append a waypoint; what
  happens to progress during the 0.22s blend and on hover-leave.
- Scroll modulation: the additive 0.25-loop phase assumes a cyclic phase.
  Waypoint progress needs a defined scroll mapping (time-based + scroll
  nudge vs scroll-driven).
- Gating/state: per-chip waypoint state must survive offscreen skips and band changes; today a band change resets
  `start` and `blends`, desyncing a path.

STAYS (do not redesign, do not break):
- Chip DOM: `span.mv-diorama-chip` + arrow + label, `data-chip` hook,
  labels, colors, sizes, z-index 2, pointer shape.
- Write path: direct `translate()` per frame, no React state, no CSS
  transition on chip transform, entrance fade opacity-only.
- Reduced-motion framework: loops never run, chips static, pills hidden,
  H-band mechanism (H3/H4/H6 stand unless lanes move).
- Band structure: TABLET_ANCHORS shape, MINI derivation, mini loop mode,
  `:not(.mv-hero-mini)` seam scope, hover/touch split.
- Parallax ±8px collage effect (separate, untouched) and the JS-anchor ==
  CSS-base invariant: whatever replaces anchors must keep JS position ==
  CSS base, or converge math breaks.
- Lookup by label + index-based refs discipline; 0.5 flip guardrail.
