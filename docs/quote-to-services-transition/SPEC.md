# Quote to Services Transition: Implementation Spec

## 0. Goal

Replace the hard cut between the white Quote section and the black Services
section (`#010101`) with one continuous scroll-driven metamorphosis that fuses
two ideas into a single read:

- (2) the Quote's ambient dot field inverts: dots grow, darken, and densify
  until the screen goes black;
- (1) an organic ink-bleed with an irregular blobby edge spreads and swallows
  the white.

The two must read as ONE event, not two stacked effects. The binding
mechanism is a **shared noise field**: the same deterministic noise function
shapes the ink front's edge and makes dots swell just ahead of that front, so
the dots appear to sense the ink coming. Narrative seed: the darkness is born
from the spot where the V6 trail ring pulsed at the end of the Quote runway,
so the black feels grown from the Quote itself, not dropped on top of it.

This spec covers placement, progress mapping, choreography, parameters,
performance, reduced motion, and integration constraints. It does not change
any existing copy, Quote mechanics, or Services reveal behavior.

## 1. Placement

### 1.1 Exact insertion point

In `src/App.tsx`, between the existing adjacent lines:

```jsx
<Quote />
<QuoteToServicesTransition />   // NEW
<Services />
```

### 1.2 Component structure

```jsx
<div className="q2s-wrap" aria-hidden="true">
  <div className="q2s-sticky">
    <canvas className="q2s-canvas" />
  </div>
</div>
```

- `.q2s-wrap`: `position: relative; height: calc(100svh + ZONE); background: #FFFFFF;`
  where ZONE is the per-breakpoint scroll runway (section 6). The extra page
  height is intentional: the choreography needs scroll distance. It does not
  shift Services content, it only pushes it further down the page.
- `.q2s-sticky`: `position: sticky; top: 0; height: 100svh; overflow: hidden;
  background: #FFFFFF;`
- `.q2s-canvas`: `position: absolute; inset: 0; width: 100%; height: 100%;
  display: block;` Sized in JS to `clientWidth * DPR` / `clientHeight * DPR`.
- The whole component is `aria-hidden`; it renders no text and no
  interactive elements.
- No z-index is set anywhere in this component. It lives in normal document
  flow between two sections, so no stacking context is created and nothing
  can cover the header or other UI.

### 1.3 What the seam looks like (accepted, by design)

Scroll positions on desktop (Quote runway = 1875px, wrapper = 100svh + 1875):

- `s = 1875`: Quote pin releases at progress 1.0. Claim fully painted,
  mission fully visible, marker washes complete, V6 ring pulsing, auto bloom
  fired. The transition zone's top edge reaches the viewport bottom at this
  exact scroll position.
- `s in [1875, 1875 + 100svh]`: the Quote section scrolls away upward in its
  static end state (normal scroll, sticky not yet pinned because the zone top
  has not reached the viewport top). The zone's white dot-field ground
  scrolls in from the bottom. Quote text exits naturally upward; the dot
  field and the white ground continue uninterrupted into the zone.
- `s = 1875 + 100svh`: zone top hits viewport top, `.q2s-sticky` pins,
  choreography progress 0 -> 1 runs over the next ZONE px.
- `s = 1875 + 100svh + ZONE`: progress 1.0, canvas fully `#010101`. The
  sticky unpins and scrolls away; Services (`#010101`) follows. The boundary
  between zone end and Services start is invisible (identical color).

The text-exit seam is accepted because Quote mechanics must stay untouched
(section 8): fading Quote content out would alter the pinned section. The
continuity carriers are the white ground and the dot field, which persist
across the seam.

### 1.4 Bundle

Lazy-load the component in `App.tsx` with `React.lazy`, consistent with how
`Quote` and `Services` are already imported. The canvas code must not bloat
the initial bundle.

## 2. Scroll progress mapping

Copy the proven pattern from `Quote.tsx`:

- One passive `scroll` listener plus `resize`, rAF-throttled with a `ticking`
  flag. No wheel hijacking, no scroll snapping, no programmatic scrolling.
  Touch momentum works because progress derives from actual scroll position,
  not from gesture events.
- `progress = clamp01(-rect.top / ZONE)` where `rect` is the wrap's
  `getBoundingClientRect()` and `ZONE = rect.height - window.innerHeight`.
- Progress is a pure function of scroll position, so scrolling back reverses
  every phase exactly. No timers drive progress; time is used only for the
  ambient dot pulse and edge shimmer (section 4.4), which are cosmetic and
  stateless.
- Rendering gate: an `IntersectionObserver` on the wrap sets an `active`
  flag. The rAF draw loop runs only while `active` is true. When the zone is
  off-screen, no frames are drawn.

## 3. Rendering architecture

A single 2D canvas draws all layers each frame, back to front:

1. White ground fill (`#FFFFFF`).
2. Offset dot grid (the Quote's second dot layer: half-pitch-shifted, faint,
   slow pulse). Drawn first so it sits under the base grid, matching Quote.
3. Base dot grid (the Quote's primary dot layer: 14px pitch, 0.7px dots,
   30% alpha at rest).
4. Seed vignette (one cached radial gradient at the seed point, section 5).
5. Seed blob (expanding noisy black disc at the seed point).
6. Ink front (black region rising from the bottom with a noisy top edge).
7. Optional faint blue rim along the front edge (2px, `rgba(8, 89, 212, 0.22)`,
   tunable, default on). It echoes the V6 blue center dot and the brand
   accent without fighting the ink metaphor.

Why canvas instead of DOM layers: the "dots swell just ahead of the front"
behavior needs per-dot radius/alpha as a function of distance to the moving
front, modulated by the shared noise field. That is one loop in canvas; in
DOM it would require mask juggling plus an SVG filter whose per-frame cost
on mobile is worse and whose edge the mask pipeline would straighten out.

DPR handling: `dpr = min(window.devicePixelRatio || 1, DPR_CAP)` per
breakpoint (section 6). Canvas backing store = CSS size * dpr; `ctx.scale`
(or `setTransform`) maps CSS px to device px. All spec units below are CSS
px. Recompute on resize (debounced, ~150ms).

## 4. Shared noise field

One deterministic function drives the front edge, the blob edge, and the
dot swell, which is what makes the two phases read as one event.

```ts
// x in CSS px, seed fixed per mount (e.g. 1.7)
const field = (x: number, seed: number): number =>
  Math.sin(x * 0.011 + seed) * 0.55 +
  Math.sin(x * 0.023 + seed * 1.7) * 0.3 +
  Math.sin(x * 0.047 + seed * 2.3) * 0.15; // range approx [-1, 1]
```

- Front edge displacement at horizontal position x: `field(x, seed) * amp(p)`.
- Blob edge (angle theta): reuse with `x = theta * 40` or an angular
  variant: `sin(3t+s)*0.5 + sin(5t+s*1.3)*0.3 + sin(8t)*0.2`, scaled by
  `0.18 * radius`.
- Dot swell modulation: multiply the swell amount by `(0.75 + 0.5 * field(x,
  seed))` so dots above an ink lobe swell slightly more than dots above a
  trough. The dots visibly anticipate the lobes.

Easing used throughout: `smootherstep(a, b, p)` =
`t = clamp01((p - a) / (b - a)); t*t*t*(t*(t*6 - 15) + 10)`.

## 5. Phase choreography (progress 0..1)

### Phase A: dot-field inversion, p in [0, 0.55]

The canvas opens in the Quote's exact dot-field visual language so the seam
(section 1.3) is continuous: white ground, base grid 14px pitch / 0.7px
radius / 30% black alpha, offset grid shifted by half pitch at low alpha
with the slow pulse.

With `inv = smootherstep(0, 0.55, p)`:

- Dot radius: `0.7 + 1.5 * inv` CSS px.
- Dot alpha: `0.30 + 0.58 * inv` (cap 0.88).
- Grid pitch: `14 - k * inv`, k per breakpoint (section 6). The grid is
  recomputed each frame from the current pitch; dots fade in/out implicitly
  as the lattice resamples (no popping: radius/alpha are continuous).
- Offset grid: pitch = base pitch * 1.6, alpha = base alpha * 0.25 *
  pulse(t), `pulse(t) = 0.5 + 0.5 * sin(2 * PI * t / 9000)` (the Quote's 9s
  pulse, same period so it feels like the same field).

### Swell band ahead of the front (the fusion detail), active p > 0.32

For each base-grid dot at `(x, y)`, let `d = frontMeanY(p) - y` (positive
when the dot is above the front). When `0 < d < 160`:

```
swell = exp(-((d / 160) ** 2) * 3) * (0.75 + 0.5 * field(x, seed))
radius += 1.8 * swell
alpha = min(0.95, alpha + 0.30 * swell)
```

Dots within ~160px above the ink front grow up to ~4px and near-black just
before the front reaches them, then are swallowed. This is the single most
important detail for fusing the two ideas: the field reacts to the ink.

### Phase B: ink-bleed, p in [0.30, 1.0]

Overlaps Phase A from p = 0.30 so the inversion is well underway when the
first black appears, and the swell band (active from 0.32) is already alive.

1. **Seed vignette**, p in [0.30, 0.60]: a soft radial darkening centered on
   the seed point (section 7), radius `18vmin * smootherstep(0.30, 0.42, p)`,
   alpha `0.32 * (1 - smootherstep(0.42, 0.60, p))`. It reads as the ink
   gathering before it breaks the surface, then hands off to the blob.

2. **Seed blob**, p in [0.36, 0.62]: a black disc growing from the seed
   point, radius `38vmin * smootherstep(0.36, 0.62, p)`, edge displaced by
   the angular noise at `0.18 * radius`. Drawn as a 64-segment path. Same
   `#010101` as the front, so where blob and front overlap they merge
   seamlessly with no compositing trick.

3. **Ink front**, p in [0.45, 1.0]: the main black mass rising from below.
   Mean front position: `frontMeanY(p) = H * (1.08 - 1.16 *
   smootherstep(0.45, 1.0, p))`, H = viewport height. Starts 8% below the
   viewport, ends 8% above it, so at p = 1 the screen is fully black with
   margin. Edge shape at horizontal x:

   ```
   edgeY(x) = frontMeanY
            + field(x, seed) * amp(p)          // organic wobble
            - lobeH(p) * gauss(x - seedX)      // seed lobe reaches up first
   amp(p)   = 12 + 24 * smootherstep(0.45, 1.0, p)   // 12px -> 36px
   lobeH(p) = 22vh * smootherstep(0.45, 0.70, p)
   gauss(x) = exp(-((x) / (0.12 * W)) ** 2)          // sigma 12% of width
   ```

   The seed lobe means the first tendril of black visibly reaches upward
   from the exact remembered spot of the V6 ring before the broad front
   follows. Draw the front as a filled path: start at `(0, edgeY(0))`,
   sample every ~24 CSS px across the width, line down to bottom corners,
   close, fill `#010101`.

4. **End state**, p = 1: front above viewport, blob merged, canvas fully
   `#010101`. The sticky child's own background is `#FFFFFF` at rest but
   the canvas is opaque full-bleed, so no ground shows through at any point.
   Behind the canvas, set the sticky background to `#010101` as a
   belt-and-braces measure against sub-pixel seams on overscroll.

### Ambient life (cosmetic, stateless)

- The offset-grid 9s pulse (above) continues through the transition.
- Optional edge shimmer: `field(x, seed + t * 0.0002)` adds a barely
  perceptible living wobble to the front edge, amplitude included in
  `amp(p)`. Keep it subtle; it must never read as animation for its own
  sake. Under reduced motion the whole component is absent anyway.

## 6. Per-breakpoint parameters

Breakpoints follow the task brief: mobile <= 720px, tablet 721-1100px,
desktop > 1100px. (Quote's own narrow breakpoint is 1023px; the zone uses
the brief's bands independently since it is a separate component.)

| Parameter | Mobile <=720px | Tablet 721-1100px | Desktop >1100px |
|---|---|---|---|
| Zone scroll runway ZONE | 900px | 1100px | 1400px |
| DPR cap | 1.5 | 1.75 | 2 |
| Dot pitch floor (k in `14 - k*inv`) | 11px (k=3) | 11.5px (k=2.5) | 12px (k=2) |
| Offset grid pitch | base * 1.6 | base * 1.6 | base * 1.6 |
| Swell band height | 140px | 160px | 180px |
| Swell radius bonus | 1.6px | 1.8px | 2.0px |
| Blob max radius | 38vmin | 38vmin | 38vmin |
| Front edge sample step | 24px | 24px | 24px |
| Front traversal (p window) | 0.45 -> 1.0 | 0.45 -> 1.0 | 0.45 -> 1.0 |

Rationale for zone lengths: the choreography has ~5 overlapping sub-phases;
900px on mobile keeps it snappy (about one full swipe-plus-a-bit), 1400px on
desktop gives the front time to feel weighty without dragging. Front speed
is implicit: it traverses 116% of viewport height over 55% of the zone, so
roughly 1.9 viewport-heights per zone on desktop, 2.1 on mobile. Slightly
faster on mobile compensates for shorter attention spans.

## 7. Narrative seed plumbing

The ink must originate where the V6 trail ring pulsed at Quote progress 1.0.

- Quote already measures the ring's viewport rect when the auto bloom fires
  (`ringRect` in the `progress >= 1` effect). Add one behavior-preserving
  line there: stash the viewport-center into a tiny shared module,
  e.g. `src/lib/transitionSeed.ts` exporting `setSeed(x, y)` / `getSeed()`.
  No visual or timing change to Quote; the effect already runs exactly once
  per mount at first progress 1.0, which every visitor passes on the way to
  the zone (the zone is unreachable without scrolling through s = 1875).
- The transition component reads `getSeed()` when its `IntersectionObserver`
  first fires. The seed is stored in viewport CSS px; the transition canvas
  is exactly viewport-sized, so the coordinates transfer 1:1. This places
  the darkness at the *remembered* spot of the ring, which is the narrative
  point: same screen position, later moment.
- Fallback if no seed was stashed (e.g. fast load edge cases): `{ x: 0.5 *
  W, y: 0.62 * H }`, art-directed to sit in the lower-middle content band
  where the trail lives on all breakpoints.
- The ONLY Quote.tsx change allowed by this spec is this seed stash (plus
  the shared module). No changes to bloom, marker sweep, trail, pin, copy,
  or styles.

## 8. Reduced motion

- The component checks `window.matchMedia("(prefers-reduced-motion:
  reduce)")` on mount (same pattern as Quote) and renders `null` when it
  matches. No zone element exists in the DOM, so the page goes from the
  static Quote straight to Services: an instant hard cut, exactly matching
  the site's existing convention (Quote renders its static branch, Services
  renders statically).
- Also subscribe to changes and unmount/remount accordingly, mirroring
  Quote's media listener.
- No CSS animation or transition is used anywhere in this component even in
  the motion-ok path; everything is progress-driven canvas drawing, so there
  is nothing to disable beyond the mount gate.

## 9. Mobile performance budget (explicit)

- Worst-case dots per frame (both grids, densest pitch, largest common
  phone 390x844): base `(390/11) * (844/11)` = ~2,700; offset at 1.6x pitch
  ~1,050. Total < 4,000 arcs. Budget caps: mobile 7,000, tablet 9,000,
  desktop 14,000 dots/frame. The pitch floors in section 6 are chosen to
  stay under these caps at 390x844, 820x1180, and 1440x900 reference
  viewports.
- Primitives: dots drawn with `ctx.arc` + `fill` (batched by alpha bucket
  where trivially possible; no shadows, no gradients per dot, no
  `globalCompositeOperation` changes mid-frame). The single seed-vignette
  radial gradient is created once per resize and cached. No SVG filters, no
  `backdrop-filter`, no CSS blur anywhere in the zone.
- DPR caps per section 6 keep backing-store memory bounded (e.g. 390x844 at
  1.5 = 585x1266, trivial).
- The rAF loop runs only while the `IntersectionObserver` reports the zone
  visible; it is cancelled otherwise. Scroll updates are rAF-throttled with
  the `ticking` pattern, identical to Quote.
- Target: 60fps on mid-range phones during the zone; jank here is the
  highest-visibility failure mode of the whole feature, so the implementer
  must test on a real mid-range Android device (or Chrome DevTools 4x CPU
  throttle as a proxy) and, if frames drop, first reduce the offset grid
  density, then the DPR cap, in that order. Do not reduce the front-edge
  sample step below 32px as a first resort; edge fidelity is the feature.

## 10. Integration constraints and acceptance checklist

- [ ] No existing copy or wording is touched anywhere (the component renders
      no text).
- [ ] No em dashes appear in the component source, its comments, or this
      spec's implementation notes.
- [ ] `Quote.tsx`: exactly one addition, the seed stash (section 7), plus
      the new `transitionSeed.ts` module. Bloom, marker sweep, trail, pin
      geometry, and all styles byte-identical.
- [ ] `Services.tsx`: zero changes. Its scroll-triggered card reveal fires
      as before when the section enters the viewport.
- [ ] `App.tsx`: one lazy import + one JSX line between `<Quote />` and
      `<Services />`.
- [ ] No layout shift: the zone is a plain block with deterministic height;
      Services content position relative to page bottom is unchanged apart
      from the added zone height (intended).
- [ ] Z-index discipline: the component sets no z-index and creates no
      stacking context; canvas is absolutely positioned inside its own
      sticky parent only.
- [ ] At p = 1 the canvas is fully `#010101` and the handoff to Services
      (`#010101`) is pixel-invisible on desktop, tablet, and mobile widths.
- [ ] Scrolling back from Services through the zone to Quote reverses every
      phase smoothly (progress is a pure function of scroll).
- [ ] `prefers-reduced-motion: reduce` renders no zone at all (hard cut).
- [ ] The swell band is perceptible: at p ~0.5 on desktop, dots within the
      band above the front are visibly larger and darker than the field
      average in a Netlify preview screen recording.
- [ ] 60fps sustained through the zone on a mid-range phone per section 9.

## 11. Files

- New: `src/sections/QuoteToServices.tsx` (component + canvas renderer).
- New: `src/lib/transitionSeed.ts` (tiny get/set module).
- Edit: `src/App.tsx` (lazy import + insertion).
- Edit: `src/sections/Quote.tsx` (seed stash only, inside the existing
  auto-bloom effect).
- This spec: `docs/quote-to-services-transition/SPEC.md`.
