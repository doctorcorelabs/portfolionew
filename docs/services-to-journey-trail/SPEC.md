# ServicesToJourney: Trail of light, SPEC

Scroll-driven pinned transition zone between the Services section
(black #010101) and the Journey section (top edge #111111, the first
stop of its 180deg gradient to #0E1626). IDE 4 from the 2026-10-30
ideation round, picked by the user.

Files:
- `src/sections/ServicesToJourney.tsx` (wrapper: pinning, progress, reduced-motion gate)
- `src/sections/ServicesToJourney/TrailOfLight.tsx` (canvas, pure function of progress)
- Wired in `src/App.tsx` between `<Services />` and `<Manifesto />`

## Mechanics

Wrap height = `calc(100svh + RUNWAY)` per breakpoint, sticky height =
`calc(100lvh + 2px)` with `calc(100svh + 2px)` fallback, `top: -1px`.
Progress: `p = clamp01(-wrapRect.top / (wrapRect.height - stickyRect.height + 1))`,
measured live via getBoundingClientRect on every scroll (rAF-throttled,
passive listener, IntersectionObserver gate). p = 1 exactly at unstick.

RUNWAY per breakpoint: 218px mobile (<=720px), 270px tablet (<=1100px),
364px desktop. Shorter than the dot zone's runway (689/842/1071)
because the comet is a calmer gesture.

## Scene (all a pure function of p)

- p = 0: canvas flat #010101, matching Services. Comet head alpha 0.
- p in (0, 0.82]: comet climbs from 92% to 16% of viewport height with
  easeOutCubic, plus a gentle sinusoidal x sway (amplitude 1.5% of
  width). Behind it: a 14-sample fading trail (radius and alpha shrink
  with distance), a fainter echo trail offset 0.6% of width (skipped on
  canvases over 1.3M px, same pixel-count gate as sparkles), 6 seeded
  sparkle flecks near the trail (visible 0.25 to 0.85, drift phase from
  p only), and a full-height light pillar the comet charges as it climbs.
  The old weak column wash (alpha <= 0.10, faded in 0.35-0.5, out
  0.78-0.92) is gone, replaced by the pillar.
- Light pillar: pillarStrength(p) = smoothstep(0.05, 0.67, p). 0 until
  the comet is underway, full by p = 0.67, holds through the bloom phase.
  Full-height vertical beam centered on the comet head's x, including the
  sway term (recomputed identically so it stays under the head). Width
  ramps 10px to 16% of viewport width; alpha ramps to 0.55 with a brighter
  core stop (rgba(140,180,255, aMax) flanked by rgba(8,89,212, ...) edges).
  Fades out over the bloom phase: fade = 1 - easeOutCubic(b), yielding to
  the flood.
- Trail/echo yield: every trail and echo sample's alpha is multiplied by
  (1 - 0.65 * pillarStrength(p)), so the dot trail recedes as the beam
  takes over.
- Comet boost: outer glow radius +50% over the column-era design, core
  slightly brighter, so the head reads over the pillar.
- p in [0.82, 1]: comet rests at the top; the bloom grows into an
  exact clone of Journey's Lantern A (no fade-out) so the joint (canvas bottom
  edge = Journey top edge) is invisible. Mid-phase the bloom floods the
  frame: flood = sin(pi*b), 0 at both ends (explicit guard at b = 1 for
  float-exactness), radius overshoots toward max(w,h), alpha boosted up to
  1.5x via aBoost = 1 + 0.5*flood, then settles into the exact lantern
  clone. Start and end states unchanged. End state at p = 1: gradient stops
  (0, rgba(8,89,212,0.40)), (0.30, rgba(8,89,212,0.22)), (0.55, transparent);
  radius = CSS farthest-corner = (divSize/2)*sqrt(2): 495 mobile/tablet
  (700px div), 778 desktop (1100px div); center joint-relative, matching the
  lantern's center above Journey's top edge.
  Key insight: a CSS radial-gradient on a square div centers IN THE DIV, at
  (left + divSize/2, top + divSize/2), not (left, top). The previous code
  aimed at the div's top-left corner, a systematic 550px desktop /
  350px mobile offset, and that was the visible seam line.
  Geometry from measureLantern(): live #manifesto and .journey-lantern-a rects
  (captures the drift translate3d and the pulse opacity phase); when the
  elements are missing, falls back to the CSS values (lanternR/lanternCX/
  lanternCYK/lanternHalf in TLParams). journeyH null/zero-guarded with a 4000
  fallback. bloomScale and driftX were removed from TLParams (dead params);
  comet head swells 2.6x then fades out by p = 1.
- Background crossfade: smoothstep(0.55, 1.0, p) blends #010101 to
  #111111. At p = 1 the frame is flat #111111, pixel identical to the
  Journey section's top edge, so the sticky hand-off is invisible.

## Draw order

background, pillar, echo trail, trail, comet head, sparkles, bloom.

## Colors

- #010101 Services black (zone wrap and sticky background too)
- #111111 Journey top edge (canvas target at p = 1)
- #5B9BFF lantern blue core, rgba(91,155,255, x) glows
- rgba(120,170,255, x) trail, rgba(160,195,255, x) head mid glow
- rgba(255,255,255, x) comet core

## Performance

- DPR caps: mobile 1.25, tablet 1.5, desktop 2 (same pattern as the
  dot zone). Breakpoint taken from window.innerWidth, not canvas width,
  so it agrees with the CSS media queries.
- Echo trail and sparkles are skipped when canvas pixel count exceeds
  1.3M (1080p desktop), gated on pixel count so behavior below the
  threshold is identical everywhere.
- Per frame: ~35 arcs and at most 5 radial gradients; trail uses plain
  fills, no shadow blur. Frame cache key = p.toFixed(5) + size, so
  unchanged frames never redraw; canvas is skipped while off screen.

## Reduced motion

Wrapper returns null, so the page keeps the hard cut from Services to
Journey with zero layout difference versus before. The media listener
updates live if the preference changes mid session.

## iOS

Sticky sized to 100lvh (stable) with svh fallback; travel measured
from the sticky's live height, never window.innerHeight, so pin timing
is exact whether the Safari toolbar is shown or hidden. Wrap and sticky
backgrounds are #010101, so no white band or gap can show.

## Guarantees

- Scroll-back bit exact: every layer is a function of p only.
- The zone sits after Services' pullUp margin (commit 37404f8, which
  shortened the dead-black scroll before Services by 25%). Both surfaces
  at the junction are #010101 (Services background, zone wrap
  background), so the overlap is seamless.
- No copy changes, no changes to Services, Journey, Quote, or the dot
  zone. Zone wrapper is a div, so the App section sweep (which observes
  main > section) is unaffected.
- 0 em dashes, 0 en dashes anywhere in the added files.

## Float safety

In drawBloom, `b = (p - 0.82) / 0.18` evaluated to
1.0000000000000002 at p = 1 exactly (IEEE754), so `1 - b` went tiny
negative, `Math.pow(negative, 1.4)` returned NaN, the `a < 0.004` guard
missed it, and the color string "rgba(91,155,255,NaN)" made Safari's
addColorStop throw, white-screening the page on iPhone. Rule: clamp
any normalized progress to [0,1] with clamp01 before feeding it to
Math.pow with a fractional exponent or into a color string. Fix:
`const b = clamp01((p - 0.82) / 0.18);`. Note that `< epsilon` guards
never catch NaN (all NaN comparisons are false), so guards alone are
not sufficient.
