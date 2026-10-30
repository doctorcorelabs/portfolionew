# Quote → Services Transition: Visual Design

**Dot-field inversion, scroll-driven, fully procedural canvas. No image assets.**
*(Ink-bleed removed per user order 2026-10-30; ink passages below are marked SUPERSEDED.)*

## Revision (2026-10-30)

Per user order 2026-10-30:

1. The ink bleed is REMOVED. The transition is now dot-field inversion
   only: the Quote's dot field grows, darkens, and densifies with scroll
   progress, the dots merge, and a fill floor `smoothstep(0.72, 1.0, p)`
   guarantees flat `#010101` at the end. Every ink-specific passage
   (seed, front, tendrils, droplets, vignette, blue spark) is marked
   SUPERSEDED below.
2. The scroll runway is 15% shorter: desktop 1400 -> 1190px, tablet
   1100 -> 935px, mobile 900 -> 765px.

## 0. Concept in one paragraph

The white of the Quote section does not wipe away. It is *absorbed* by its
own dot field. The ambient dot field, the exact same 14px field the visitor
has been staring at, swells, darkens, and densifies with scroll progress:
dots grow from 0.7 to 2.2px, alpha rises, the pitch tightens, neighbors
touch and merge until the field reads as black texture, and a fill floor
`smoothstep(0.72, 1.0, p)` guarantees flat `#010101` at progress 1, where
the Services section continues that black invisibly. One continuous
metamorphosis, pure function of scroll progress, fully reversible on
scroll-back.

SUPERSEDED 2026-10-30: the original concept fused an ink blot grown from
the last blue spark of the V6 trail, with tendrils, satellite droplets, and
a noisy organic edge. The user ordered the ink bleed removed.

**Why no image assets:** an image cannot reversibly track scroll, cannot
match the live dot field the Quote section renders in the DOM, and would
band on gradients. Everything here is analytic: per-dot math for the field,
deterministic, seeded, zero network.

## 1. Structure and continuity contract

- A standalone `<section>` sits between `Quote` and `Services` in DOM order.
  It mirrors Quote's pinned pattern: wrapper
  `height: calc(100svh + RUNWAY)` (`RUNWAY` = 1190px desktop, 935px at
  max-width 1100px, 765px at max-width 720px), sticky child `top: 0;
  min-height: 100svh`.
  Section background `#FFFFFF` so overscroll above the strip stays white.
- The sticky viewport holds exactly one full-bleed `<canvas>`,
  `aria-hidden="true"`. No text, no headlines, no CTAs inside the strip.
  It is pure atmosphere; the story is told by the field inverting.
- **Continuity contract:** at p=0 the canvas renders *byte-identical* dot
  aesthetics to Quote's end state (14px pitch, 0.7px dots,
  `rgba(1,1,1,0.30)`, plus the 7px-offset echo layer). The cut from
  Quote's sticky end to the strip's start is white-to-white with the
  same field, so the eye reads it as one unbroken surface. The strip
  then takes over the narrative.
- `prefers-reduced-motion`: no wrapper runway, no pinning, no canvas.
  The page goes straight from Quote to Services with the previous hard
  cut. Same convention as Quote's static branch. Content is never trapped
  behind scroll.

## 2. The ink edge function

SUPERSEDED 2026-10-30. The entire ink edge system below (seed, star-shaped
front, tendrils, soft band, low-res mask, coverage guarantee) was removed
with the ink bleed. Kept as design history; none of it describes the
shipped component.

### 2.1 Seed

- Seed center, as a fraction of the sticky viewport (matches where the
  V6 trail's blue dot sat in the Quote layout: left of center, below middle):
  - Desktop / iPad: `(0.34w, 0.64h)`
  - Mobile: `(0.36w, 0.60h)`
- p = 0 → 0.06, "the last spark": a single 10px `#0859D4` dot pulses once
  at the seed (one `easeOutCubic` swell to 14px, then the ink covers it).
  This is the *only* blue in the entire transition. After p=0.06 the ink
  seed (black, radius ~18px) has swallowed it. Narrative beat: the blue
  spark becomes the origin of the black.

### 2.2 Front shape (never a straight line)

The front is a star-shaped blob: radius as a function of angle around
the seed.

```
r(θ, p) = R(p) * ( 1 + N(θ, p) + T(θ, p) )
```

- `R(p)`, base radius, see §4.
- `N(θ, p)`, layered sine noise, the organic wobble:

```
N(θ, p) = Σ_{k=1..OCT} A_k * sin( f_k * θ + φ_k + p * drift_k )
```

  - `f_k = 3 * 2^(k-1)` (3 big lobes, then doubling detail)
  - `A_k = A0 / 2^(k-1)` with `A0 = 0.16` desktop / `0.20` mobile
    (amplitude as a fraction of R; mobile gets bigger, simpler lobes)
  - `φ_k` from `mulberry32(20261029)`, fixed seed, identical every load
  - `drift_k = 0.6 / k` radians, the edge "breathes" as you scroll;
    pure function of p, so scroll-back reverses exactly. **No wall-clock
    time anywhere in this file's math.**
- `T(θ, p)`, **tendrils**: 3-5 seeded angular sectors whose lobes
  outrun the main front, the "faster fingers" that sell ink:

```
T(θ, p) = Σ_{t} 0.22 * gauss(θ - θ_t, σ_t) * easeInOutSine(clamp01((p - 0.15) / 0.7))
```

  - `θ_t`, `σ_t` (0.25-0.45 rad) from the same seeded PRNG
  - Each tendril has its own phase so they peak at slightly different p.
- Early stage (p < 0.12): the blob is a cluster of 3 merged lobes, not
  a circle, implement by clamping `N`'s lowest octave dominance:
  multiply `A_1` by 1.6 while `p < 0.12`, blending to 1.0 by p=0.2.
  The seed should read as a *splat*, never a coin.

### 2.3 Edge softness

The boundary is a soft band, not a hard line, rendered from the signed
distance `d(x,y) = dist((x,y), seed) − r(θ,p)` (negative = inside ink):

- Ink alpha over the band: `alpha = 1 − smoothstep(−band/2, +band/2, d)`
  with a **dark-biased** easing inside the smoothstep
  (`t^1.6` remap) so the band reads as *soft ink*, not gray fog.
- Band width: `band = 64 + 0.02 * R(p)` px desktop; `56 + 0.02*R` iPad;
  `44 + 0.02*R` mobile. Narrow enough to avoid muddiness, wide enough
  to hide the low-res mask upscale (see §6).
- Render path: the ink mask is computed per-pixel on a **low-res
  offscreen canvas at 1/3 scale**, then `drawImage`-upscaled with
  smoothing onto the main canvas. At 1/3 scale a 1440px viewport is
  480px wide, trivial per-pixel cost, and the band hides all
  upscaling artifacts.

### 2.4 Guaranteed full coverage

`R_max = 1.12 * maxDist(seed → 4 viewport corners) + band`. At p=1,
`R(p) = R_max`, so even the noisiest lobe configuration covers every
pixel. Belt and suspenders: a global fill floor
`F(p) = smoothstep(0.72, 1.0, p)` is maxed with the front mask,
`ink = max(frontMask, F(p))`. The last 28% of the runway cannot leave
a white corner, and the handoff to Services is pixel-perfect `#010101`.

## 3. Dot field behavior

### 3.1 Base grid (matches Quote exactly at p=0)

- Pitch 14px, dot radius 0.7px, `rgba(1,1,1,0.30)`, the `q-dot-base` recipe.
- Echo layer: same pitch, offset (7px, 7px), alpha ramping
  `0 → 0.25` over p = 0 → 0.15 (a one-way echo of Quote's 9s pulse,
  now progress-driven). Kept on all breakpoints.

### 3.2 Per-dot lifecycle, driven by progress

Each dot's radius, alpha, and color are pure functions of progress `p`,
shared across the field with slight per-dot variation from the seeded noise
so the field never pulses in lockstep:

- Radius: `0.7 + 1.5 * smootherstep(0, 1, p)` px (0.7 -> 2.2px).
- Alpha: `0.30 + 0.58 * smootherstep(0, 1, p)`, capped at 0.88.
- Color: the field decays through Quote's own palette as it densifies,
  `rgba(1,1,1,0.30)` -> `#6F6F68` -> `#3C3C38` -> `#010101`, so the dots
  die as ink, never as gray.
- Pitch: `14 - k * smootherstep(0, 1, p)` px (`k` per breakpoint, §6);
  the lattice resamples continuously, no popping.

SUPERSEDED 2026-10-30: the original lifecycle was driven by signed distance
to the ink front (absorbed / being-swallowed / swell / untouched bands).
With no front the bands are gone; the palette decay above is retained.

### 3.3 Density increase

SUPERSEDED 2026-10-30. The second fine grid was not implemented; density
is conveyed through the base grid's growth and the pitch tightening alone
on all breakpoints.

## 4. Easing curves (whole 0 → 1)

All curves are named; implementers use these exact functions.

| What | Curve | Notes |
|---|---|---|
| Dot inversion | `smootherstep(0, 1, p)` | Radius 0.7->2.2px, alpha 0.30->0.88, pitch 14->floor |
| Fill floor `F(p)` | `smoothstep(0.72, 1.0, p)` | Coverage guarantee; invisible below 0.72 |
| Echo layer alpha | linear on p in [0,0.15] | Quiet entrance, no drama |
| Seed spark pulse | SUPERSEDED | Removed with the ink bleed |
| `R(p)` base radius | SUPERSEDED | Removed with the ink bleed |
| Tendril growth | SUPERSEDED | Removed with the ink bleed |
| Droplet envelope | SUPERSEDED | Removed with the ink bleed |

### Micro-detail: satellite droplets

SUPERSEDED 2026-10-30. Removed with the ink bleed. (Original text kept as
design history.)

4-6 droplets (desktop), 4 (iPad), 3 (mobile). Each droplet `j` has
seeded `(θ_j, distFactor_j ∈ [1.08, 1.35], spawnP_j ∈ [0.30, 0.55],
maxR_j ∈ [14, 34]px)`:

- Position: fixed at angle `θ_j`, distance `distFactor_j * R(p)` from
  seed, so it rides *ahead* of the front as the front grows.
- Lifecycle: invisible until `spawnP_j`; radius grows
  `0 → maxR_j` via `easeOutCubic` over `Δp = 0.10`; holds briefly;
  then the advancing front reaches it and it shrinks to 0 via
  `easeInQuad` over `Δp = 0.06`, visibly *reabsorbed*, not popped.
- Rendered with the same soft-band edge as the main front, same
  `#010101`. A droplet mid-shrink overlapping the front reads as a
  tendril tip detaching and rejoining. That is the money shot of
  "this is ink, not a wipe."

## 5. Color discipline

Exact values at key progress stops. Background starts `#FFFFFF`
(Quote's white), ends `#010101` (Services' black). Nothing in between
is ever blue, ever warm, ever muddy-gray.

| p | State | Exact colors |
|---|---|---|
| 0.00 | White field, ambient dots | bg `#FFFFFF`; dots `rgba(1,1,1,0.30)` |
| 0.30 | Field thickening | dots larger, ramping `#6F6F68` |
| 0.60 | Majority dark texture | dots near-merged, `#3C3C38` -> `#010101` |
| 0.85 | Fill floor engaged | last white remnant shrinks; no gray halo |
| 1.00 | Flat black | `#010101` everywhere. Services continues `#010101`. |

**Rules:** the black is always `#010101`, never `#000000` (pure black
would bloom against Services' `#010101` on OLED and break the seam).
The mid-transition field is dots-over-white with dark bias, never a
literal gray fill. SUPERSEDED 2026-10-30: the seed-spark blue exception
is gone with the ink; the transition contains no blue at all. Blue
remains reserved for Services' cards.

## 6. Breakpoint tuning and perf

| Param | Desktop (>1100) | iPad (721-1100) | Mobile (≤720) |
|---|---|---|---|
| Dot pitch | 14px (Quote match) | 14px | 16px |
| Canvas DPR cap | 1.5 | 1.5 | 1.25 |
| Noise octaves | SUPERSEDED | SUPERSEDED | SUPERSEDED |
| Noise A0 | SUPERSEDED | SUPERSEDED | SUPERSEDED |
| Tendrils | SUPERSEDED | SUPERSEDED | SUPERSEDED |
| Droplets | SUPERSEDED | SUPERSEDED | SUPERSEDED |
| Fine grid layer | SUPERSEDED | SUPERSEDED | SUPERSEDED |
| Edge band | SUPERSEDED | SUPERSEDED | SUPERSEDED |
| Influence band | SUPERSEDED | SUPERSEDED | SUPERSEDED |
| Runway | 100svh + 1190px | 100svh + 935px | 100svh + 765px |
| Mask offscreen scale | SUPERSEDED | SUPERSEDED | SUPERSEDED |

**Why mobile doesn't look cheap:** the dot field is the whole show, and
dots are cheap. What mobile *keeps* is the signature: the swell-darken
lifecycle of every dot and the pitch tightening, at the same curves as
desktop. The shorter 765px runway keeps it snappy on a phone.

**Perf rules (non-negotiable):**
- Scroll handler rAF-throttled, `{ passive: true }`, exactly like
  Quote's. Redraw only when progress changed since last frame.
- Dot count at 1440×900, 14px pitch: ~6,600 base (+~6,600 echo/fine
  when fully faded in), fine for canvas arcs during scroll.
  Mobile 390×844 at 16px: ~1,300 dots. Trivial.
- Never exceed the DPR caps; never run per-pixel at full res.
- No `shadowBlur`, no gradients-as-fill on the main canvas per frame
  (the band is the alpha mask, precomputed).

## 7. What NOT to do

1. **No straight lines, ever.** No horizontal/diagonal wipes, no
   linear-gradient sweeps, no clip-path polygons. If the edge ever
   reads as a line, the noise amplitude is too low, raise `A0`.
2. **No muddy mid-tones.** The band is dark-biased (`t^1.6`) and
   narrow. A wide soft gray transition reads as fog, not ink.
   When in doubt, shrink the band, don't widen it.
3. **No blue ink.** The `#0859D4` accent belongs to Services' cards.
   SUPERSEDED 2026-10-30: the seed-spark exception is gone with the
   ink; the transition contains no blue at all.
4. **No text in the strip.** No captions, no counters, no "scroll"
   hints. The metamorphosis is the content.
5. **No wall-clock animation.** Every quantity is a pure function of
   scroll progress `p`. Scroll-back must reverse every frame exactly:
   dots un-grow and un-darken. Test this by scrubbing, not just
   scrolling down.
6. **No competing pattern at the handoff.** The strip ends in *flat*
   `#010101`, no halftone, no dots, no texture, so Services'
   halftone pan and card entrance read as a fresh event, not a
   continuation of noise.
7. **Don't re-run Quote's animations.** No word-painting, no marker
   sweep, no bloom rings here. Quote already said its line; the
   strip is the silence after it.
8. **Don't fight the pin.** The strip owns its runway exclusively;
   keep Services' entrance animations (`svc-anim`) as they are,
   they trigger on intersection and will play as the black arrives.
