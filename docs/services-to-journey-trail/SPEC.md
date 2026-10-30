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

RUNWAY per breakpoint: 420px mobile (<=720px), 520px tablet (<=1100px),
700px desktop. Shorter than the dot zone's runway (689/842/1071)
because the comet is a calmer gesture.

## Scene (all a pure function of p)

- p = 0: canvas flat #010101, matching Services. Comet head alpha 0.
- p in (0, 0.82]: comet climbs from 92% to 16% of viewport height with
  easeOutCubic, plus a gentle sinusoidal x sway (amplitude 1.5% of
  width). Behind it: a 14-sample fading trail (radius and alpha shrink
  with distance), a fainter echo trail offset 0.6% of width (skipped on
  canvases over 1.3M px, same pixel-count gate as sparkles), a subtle vertical light column wash (alpha <= 0.10,
  fades in 0.35 to 0.5, out 0.78 to 0.92), and 6 seeded sparkle flecks
  near the trail (visible 0.25 to 0.85, drift phase from p only).
- p in [0.82, 1]: comet rests at the top; the bloom grows into the
  next section's lantern glow instead of fading out: radius 24 to
  max(w,h) with easeOutCubic, center drifts from the comet end
  position (x ~= w/2, y ~= 0.16h) to (driftX*w, 0.06h) upper-left,
  driftX 0.22 desktop/tablet, 0.70 mobile (mobile Lantern A center
  near 0.70w: 700px wide, left -20%), alpha 0.55 to 0.38 (never
  reaches 0), gradient RGB eases (91,155,255) to (8,89,212) as e
  rises, stops a / 0.25a / transparent, landing on #111111 to
  meet Journey's Lantern A (1100px, top -6%/left -8%,
  rgba(8,89,212,0.40)); comet head swells 2.6x then fades out by
  p = 1.
- st.params.bloomScale is now unused by drawBloom; kept in the
  params interface for compatibility.
- Background crossfade: smoothstep(0.55, 1.0, p) blends #010101 to
  #111111. At p = 1 the frame is flat #111111, pixel identical to the
  Journey section's top edge, so the sticky hand-off is invisible.

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
