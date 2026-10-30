# Quote to Services Transition: Implementation Spec

## Revision (2026-10-30)

Per user order 2026-10-30, two changes, reflected throughout:

1. The ink bleed is REMOVED. The transition is now dot-field inversion
   only: the Quote's ambient dot field grows, darkens, and densifies with
   scroll progress until the dots merge and a fill floor takes the screen
   to flat `#010101`. Every ink-specific passage (seed blob, rising front,
   tendrils, satellite droplets, seed vignette, blue spark, V6 seed stash)
   is marked SUPERSEDED and no longer describes the shipped component.
2. The scroll runway is 15% shorter: 1400/1100/900 px becomes 1190/935/765
   px for desktop/tablet/mobile.

## 0. Goal

Replace the hard cut between the white Quote section and the black Services
section (`#010101`) with one continuous scroll-driven metamorphosis: the
Quote's ambient dot field inverts, dots grow, darken, and densify with
scroll progress until the field merges into flat black.

SUPERSEDED 2026-10-30: the original design fused a second idea, an organic
ink-bleed with an irregular blobby edge that spread and swallowed the white,
bound to the dots by a shared noise field and seeded at the V6 trail ring's
remembered position. The user ordered the ink bleed removed; the transition
is now dot-field inversion only. Every ink-specific passage in this spec is
marked SUPERSEDED and no longer describes the shipped component.

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

- `.q2s-wrap`: `position: relative; height: calc(100svh + ZONE); background: #FFFFFF; margin-bottom: -2px; width: calc(100% + 2px);` (the -2px margin overlaps the wrap/Services junction by 2px of black-on-black, killing iOS fractional-rounding hairlines at that seam; the +2px width extends the zone past the right viewport edge so no 1px body-background peek can appear there, fix 2026-10-30)
  where ZONE is the per-breakpoint scroll runway (section 6). The extra page
  height is intentional: the choreography needs scroll distance. It does not
  shift Services content, it only pushes it further down the page.
- `.q2s-sticky`: `position: sticky; top: -1px; height: calc(100svh + 2px); overflow: hidden;
  background: #FFFFFF;` (the 1px overlap top and bottom hides subpixel hairlines of the wrap background, fix 2026-10-30)
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
  ambient dot pulse, which is cosmetic and stateless.
- Rendering gate: an `IntersectionObserver` on the wrap sets an `active`
  flag. The rAF draw loop runs only while `active` is true. When the zone is
  off-screen, no frames are drawn.

## 3. Rendering architecture

A single 2D canvas draws all layers each frame, back to front:

1. White ground fill (`#FFFFFF`).
2. Offset dot grid (the Quote's second dot layer: half-pitch-shifted, faint,
   slow pulse). Drawn first so it sits under the base grid, matching Quote.
3. Base dot grid (the Quote's primary dot layer: 14px pitch, 0.7px dots,
   30% alpha at rest), inverting with progress per section 5.
4. Global fill floor: `F(p) = smoothstep(0.72, 1.0, p)` maxed over the dot
   field, guaranteeing flat `#010101` at p = 1.

SUPERSEDED 2026-10-30: the original stack had four more layers, a seed
vignette, a seed blob, a rising ink front, and an optional blue rim (old
items 4-7). All removed with the ink bleed.

Why canvas instead of DOM layers: per-dot radius, alpha, and pitch as
continuous functions of progress is one loop in canvas; in DOM it would
require thousands of nodes updated per frame, worse on mobile.

DPR handling: `dpr = min(window.devicePixelRatio || 1, DPR_CAP)` per
breakpoint (section 6). Canvas backing store = CSS size * dpr; `ctx.scale`
(or `setTransform`) maps CSS px to device px. All spec units below are CSS
px. Recompute on resize (debounced, ~150ms).

## 4. Shared noise field

SUPERSEDED 2026-10-30. The noise field existed to shape the ink front's
edge and to modulate the dot swell ahead of that front. With the ink bleed
removed there is no front, so this section no longer describes the shipped
component. The deterministic easing `smootherstep(a, b, p)` below is still
used for the dot inversion curves. (Original text kept as design history.)

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

### Phase A: dot-field inversion, p in [0, 1]

The canvas opens in the Quote's exact dot-field visual language so the seam
(section 1.3) is continuous: white ground, base grid 14px pitch / 0.7px
radius / 30% black alpha, offset grid shifted by half pitch at low alpha
with the slow pulse.

With `inv = smootherstep(0, 1, p)`:

- Dot radius: `0.7 + 1.5 * inv` CSS px.
- Dot alpha: `0.30 + 0.58 * inv` (cap 0.88).
- Grid pitch: `14 - k * inv`, k per breakpoint (section 6). The grid is
  recomputed each frame from the current pitch; dots fade in/out implicitly
  as the lattice resamples (no popping: radius/alpha are continuous).
- Offset grid: pitch = base pitch * 1.6, alpha = base alpha * 0.25 *
  pulse(t), `pulse(t) = 0.5 + 0.5 * sin(2 * PI * t / 9000)` (the Quote's 9s
  pulse, same period so it feels like the same field).

As the dots grow and the pitch tightens, neighboring dots touch and merge;
the field stops reading as discrete points and becomes a thickening black
texture.

### Swell band ahead of the front (the fusion detail), active p > 0.32

SUPERSEDED 2026-10-30. There is no ink front anymore, so there is nothing
for the dots to anticipate. The per-dot swell ahead of a moving front is
removed; dot growth is now a pure function of progress (Phase A above).

### Phase B: ink-bleed, p in [0.30, 1.0]

SUPERSEDED 2026-10-30. The seed vignette, seed blob, rising ink front, and
blue rim were removed with the ink bleed. This section no longer describes
the shipped component.

### End state, p = 1

The dots have merged into a near-solid field and the global fill floor
`F(p) = smoothstep(0.72, 1.0, p)` is maxed over the canvas, so at p = 1 the
screen is flat `#010101` with margin to spare. The sticky child's own
background is `#FFFFFF` at rest but the canvas is opaque full-bleed, so no
ground shows through at any point. Behind the canvas, set the sticky
background to `#010101` as a belt-and-braces measure against sub-pixel
seams on overscroll.

### Ambient life (cosmetic, stateless)

- The offset-grid 9s pulse (above) continues through the transition.

## 6. Per-breakpoint parameters

Breakpoints follow the task brief: mobile <= 720px, tablet 721-1100px,
desktop > 1100px. (Quote's own narrow breakpoint is 1023px; the zone uses
the brief's bands independently since it is a separate component.)

| Parameter | Mobile <=720px | Tablet 721-1100px | Desktop >1100px |
|---|---|---|---|
| Zone scroll runway ZONE | 765px | 935px | 1190px |
| DPR cap | 1.5 | 1.75 | 2 |
| Dot pitch floor (k in `14 - k*inv`) | 11px (k=3) | 11.5px (k=2.5) | 12px (k=2) |
| Offset grid pitch | base * 1.6 | base * 1.6 | base * 1.6 |
| Swell band height | SUPERSEDED | SUPERSEDED | SUPERSEDED |
| Swell radius bonus | SUPERSEDED | SUPERSEDED | SUPERSEDED |
| Blob max radius | SUPERSEDED | SUPERSEDED | SUPERSEDED |
| Front edge sample step | SUPERSEDED | SUPERSEDED | SUPERSEDED |
| Front traversal (p window) | SUPERSEDED | SUPERSEDED | SUPERSEDED |

Rationale for zone lengths: 15% shorter than the original 1400/1100/900 px
per user order 2026-10-30. 765px on mobile keeps it snappy (about one full
swipe), 1190px on desktop gives the dot field room to densify without
dragging. With no ink front to traverse, zone length only sets how
gradually the field inverts.

## 7. Narrative seed plumbing

SUPERSEDED 2026-10-30. The seed existed to originate the ink at the V6
trail ring's remembered position. With the ink bleed removed there is no
seed, no blob, and no front, so the seed stash and the
`src/lib/transitionSeed.ts` module are no longer required by the
transition. (Original text kept as design history.)

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
  `globalCompositeOperation` changes mid-frame). No SVG filters, no
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
  density, then the DPR cap, in that order.

## 10. Integration constraints and acceptance checklist

- [ ] No existing copy or wording is touched anywhere (the component renders
      no text).
- [ ] No em dashes appear in the component source, its comments, or this
      spec's implementation notes.
- [ ] `Quote.tsx`: SUPERSEDED 2026-10-30, the seed stash (section 7) is no
      longer required. If the stash already shipped, it is harmless but
      unused. Bloom, marker sweep, trail, pin geometry, and all styles
      byte-identical.
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
- [ ] The dot merge is perceptible: at p ~0.6 on desktop the field reads as
      a thickening black texture rather than discrete dots in a Netlify
      preview screen recording.
- [ ] 60fps sustained through the zone on a mid-range phone per section 9.

## 11. Files

- New: `src/sections/QuoteToServices.tsx` (component + canvas renderer).
- New: `src/lib/transitionSeed.ts` (tiny get/set module).
- Edit: `src/App.tsx` (lazy import + insertion).
- Edit: `src/sections/Quote.tsx` (seed stash only, inside the existing
  auto-bloom effect).
- This spec: `docs/quote-to-services-transition/SPEC.md`.
