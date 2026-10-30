# Quote → Services Transition: Visual Design

**Ink-bleed + dot-inversion, scroll-driven, fully procedural canvas. No image assets.**

## 0. Concept in one paragraph

The white of the Quote section does not wipe away. It is *consumed*. The last
blue spark of the V6 trail (the pulsing `#0859D4` dot) swells, turns black, and
becomes the seed of an ink blot that grows with an organic, never-straight
edge. Ahead of the front, the ambient dot field - the exact same 14px field
the visitor has been staring at - swells, darkens, densifies, and is absorbed
dot by dot. Satellite droplets leap ahead of the front and are reabsorbed.
At progress 1 the viewport is flat `#010101`, and the Services section
continues that black invisibly. One continuous metamorphosis, pure function
of scroll progress, fully reversible on scroll-back.

**Why no image assets:** an image cannot reversibly track scroll, cannot
match the live dot field the Quote section renders in the DOM, and would
band on the soft edge. Everything here is analytic: a distance field for
the ink, per-dot math for the field. Deterministic, seeded, zero network.

## 1. Structure and continuity contract

- A standalone `<section>` sits between `Quote` and `Services` in DOM order.
  It mirrors Quote's pinned pattern: wrapper
  `height: calc(100svh + RUNWAY)` (`RUNWAY` = 1100px desktop, 800px at
  max-width 1023px), sticky child `top: 0; min-height: 100svh`.
  Section background `#FFFFFF` so overscroll above the strip stays white.
- The sticky viewport holds exactly one full-bleed `<canvas>`,
  `aria-hidden="true"`. No text, no headlines, no CTAs inside the strip.
  It is pure atmosphere; the story is told by the ink.
- **Continuity contract:** at p=0 the canvas renders *byte-identical* dot
  aesthetics to Quote's end state (14px pitch, 0.7px dots,
  `rgba(1,1,1,0.30)`, plus the 7px-offset echo layer). The cut from
  Quote's sticky end to the strip's start is white-to-white with the
  same field, so the eye reads it as one unbroken surface. The strip
  then takes over the narrative.
- `prefers-reduced-motion`: no wrapper runway, no pinning, no canvas.
  The section renders at its end state: flat `#010101`, minimal padding.
  Same convention as Quote's static branch. Content is never trapped
  behind scroll.

## 2. The ink edge function

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
  now progress-driven). iPad keeps it; mobile drops it (see §6).

### 3.2 Per-dot lifecycle, driven by distance to the front

For each dot, `d` = signed distance to the ink front (same field as §2.3):

- `d < −band/2`, **absorbed**: not drawn. The ink owns it.
- `−band/2 ≤ d ≤ +band/2`, **being swallowed**: drawn under the soft
  band, radius shrinking `0.7 → 0.3px`, color lerping to `#010101`.
- `0 < d < INFLUENCE` (`INFLUENCE` = 150px desktop/iPad, 110px mobile),
  **the swell**: the signature moment. Dots grow and darken *ahead* of
  the front, as if the ink's gravity reaches forward:

```
t = 1 − d / INFLUENCE
radius = 0.7 + 3.5 * easeOutCubic(t)        // max 4.2px
color  = ramp(t): rgba(1,1,1,0.30) → #6F6F68 → #3C3C38 → #1D1D1F
```

  The 4.2px max is deliberate: it echoes the V6 trail's 4px dots.
  Dots die as trail-dots. The color ramp reuses Quote's own palette
  (`#6F6F68` MARGIN_GREY, `#3C3C38` GRAPHITE), the field literally
  decays through the site's ink scale into `#010101`.
- `d ≥ INFLUENCE`, untouched ambient dot.

### 3.3 Density increase

Inside the influence band, a **second fine grid** fades in: same 14px
pitch offset by (7px, 7px) (the Quote offset-layer geometry), alpha
`0 → 0.5 * easeOutCubic(t)`, radius 0.5px, same color ramp. The field
visibly *thickens* just before absorption, then vanishes. Desktop and
iPad only, mobile conveys density through the swell alone
(§6: why this doesn't look cheap).

## 4. Easing curves (whole 0 → 1)

All curves are named; implementers use these exact functions.

| What | Curve | Notes |
|---|---|---|
| `R(p)` base radius | Piecewise: `easeOutCubic` on p∈[0,0.10] (seed 5→46px); `easeInOutCubic` on p∈[0.10,0.90] (46px→R_max); `easeOutQuad` settle on p∈[0.90,1.0] | Slow birth, confident middle, gentle landing. The middle must feel *inevitable*, not rushed. |
| Fill floor `F(p)` | `smoothstep(0.72, 1.0, p)` | Coverage guarantee; invisible below 0.72 |
| Seed spark pulse | `easeOutCubic` on p∈[0,0.06] | One breath, then swallowed |
| Tendril growth | `easeInOutSine` on p∈[0.15,0.85] | Fingers reach mid-journey |
| Dot swell | `easeOutCubic` | Snappy growth, soft landing into absorption |
| Droplet envelope | `smoothstep` in, `easeInQuad` out | Quick reabsorption snap (see below) |
| Echo layer alpha | linear on p∈[0,0.15] | Quiet entrance, no drama |

### Micro-detail: satellite droplets

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
| 0.00 | White field, ambient dots, one blue spark | bg `#FFFFFF`; dots `rgba(1,1,1,0.30)`; spark `#0859D4` 10px |
| 0.06 | Spark swallowed; ink seed born | ink core `#010101` r≈18px; band `#010101`→`#FFFFFF` over ~64px |
| 0.25 | Splat established, tendrils reaching | interior `#010101`; dots ahead ramping `#6F6F68`→`#3C3C38` |
| 0.45 | Front past mid-screen; droplets aloft | droplets `#010101`; fine grid at 0.5 alpha in band |
| 0.65 | Majority black; white pocket upper-right | pocket edge band dark-biased (`t^1.6`) |
| 0.85 | Fill floor engaged; last white remnant | remnant shrinks; no gray halo wider than band |
| 1.00 | Flat black | `#010101` everywhere. Services continues `#010101`. |

**Rules:** the ink is always `#010101`, never `#000000` (pure black
would bloom against Services' `#010101` on OLED and break the seam).
The soft band is alpha-composited ink-over-white with dark bias,
never a literal gray fill. Blue appears exactly once (the seed spark,
p < 0.06) and never tints the ink, the band, or the dots: blue is
reserved for the spark's memory and Services' cards.

## 6. Breakpoint tuning and perf

| Param | Desktop (>1024) | iPad (721-1100) | Mobile (≤720) |
|---|---|---|---|
| Dot pitch | 14px (Quote match) | 14px | 16px |
| Canvas DPR cap | 1.5 | 1.5 | 1.25 |
| Noise octaves | 4 | 3 | 2 |
| Noise A0 | 0.16·R | 0.17·R | 0.20·R |
| Tendrils | 5 | 4 | 3 |
| Droplets | 6 | 4 | 3 |
| Fine grid layer | yes | yes | **no** |
| Edge band | 64+0.02R | 56+0.02R | 44+0.02R |
| Influence band | 150px | 150px | 110px |
| Runway | 100svh + 1100px | 100svh + 800px | 100svh + 800px |
| Mask offscreen scale | 1/3 | 1/3 | 1/4 |

**Why mobile doesn't look cheap:** the two most expensive things
(octaves 3-4, fine grid) are detail the eye can't resolve at 390px
anyway. What mobile *keeps* is the signature: the swell-absorb
lifecycle, the tendril fingers (3 is plenty at small scale), the
droplets, and the dark-biased band. Bigger `A0` (0.20) compensates
for fewer octaves, the edge stays dramatic, just chunkier, which
reads *better* on a phone.

**Perf rules (non-negotiable):**
- Scroll handler rAF-throttled, `{ passive: true }`, exactly like
  Quote's. Redraw only when progress changed since last frame.
- Dot count at 1440×900, 14px pitch: ~6,600 base (+~6,600 echo/fine
  when fully faded in), fine for canvas arcs during scroll.
  Mobile 390×844 at 16px: ~1,300 dots. Trivial.
- Ink mask per-pixel work happens at 1/3-1/4 scale: ~480×300 px
  worst case. Negligible.
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
3. **No blue ink.** The `#0859D4` accent belongs to the seed spark
   (p < 0.06) and to Services' cards. Blue-tinted ink, blue edge
   glow, blue droplets, all forbidden. They would fight the one
   accent the site owns.
4. **No text in the strip.** No captions, no counters, no "scroll"
   hints. The metamorphosis is the content.
5. **No wall-clock animation.** Every quantity is a pure function of
   scroll progress `p`. Scroll-back must reverse every frame exactly:
   droplets un-merge, dots un-absorb, the spark un-swallows. Test
   this by scrubbing, not just scrolling down.
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
