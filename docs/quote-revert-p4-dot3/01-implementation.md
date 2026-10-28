# Quote: P4 revert plus dot option 3 (density pulse)

Base: HEAD `f6666b7`. File changed: `src/sections/Quote.tsx` only.
No commit, no push. Build PASS on integration re-run
(tsc plus vite, built in 4.07s, Quote chunk 11.51 kB).

## 1. P4 revert: restored pre-P4 progress windows

The runway heights never changed in P4 and stay untouched
(2115px desktop, 1265px narrow). Only the windows revert:

- Claim paint: factor back to 0.8. Word i paints at
  `((i + 1) / 17) * 0.8`, step 0.0471, last word at 0.8.
  Color transition 0.35s unchanged.
- Mission ramp: opacity 0 at progress at or below 0.80,
  1 at 0.85 via `clamp01((progress - 0.80) / 0.05)`,
  same 14px rise.
- V6 dots: light at `0.82 + i * 0.012`, dot 0 at 0.82,
  dot 11 at 0.952, step 0.012.
- Ring and center dot: fade via `clamp01((drawn - 0.95) / 0.05)`,
  full at 1.00.
- V13 band: `f = clamp01((progress - 0.80) / 0.20)`,
  top `f * 60`, bottom top + 50 (the +50 height is a P1 value
  and stays). Band opacity still follows missionOpacity
  (B1 gate: 0 below 0.80, 1 at 0.85).
- Restored pacing: claim word step about 100px desktop,
  mission ramp about 106px, climax back to the final
  20 percent of the runway (about 423px desktop).
  Claim ends at 0.8 exactly when the mission starts at 0.8
  (touching, not overlapping); the ring starts at 0.95 while
  the last dot lights at 0.952, the same trivial overlap
  as before P4.

Retired P4 windows return zero matches in code paths
(no 0.70 mission start, no 0.72 dot start, no 0.90 ring start,
no (progress - 0.70) / 0.30 sweep).

## 2. Dot option 3: density pulse

- Base layer: 0.7px dots at 0.30 alpha, 14px pitch, constant.
  The old `q-dot-breathe` class and keyframes are gone
  (zero matches).
- Offset layer: new `q-dot-offset` layer inside the entrance
  wrapper, same 14px pitch shifted 7px 7px so each offset dot
  sits at the center of a base-grid cell, same 350px cursor
  disc mask as the base layer. Animation
  `q-dot-offset 9s ease-in-out infinite alternate`,
  keyframes opacity 0 to 0.25.
- The entrance fade lives on the wrapper, so the pulse
  animation on the inner layer never overrides it.
- Lit layer untouched: 0.44 alpha, 0.4px dots, 50px cursor
  halo, 600ms fade-out, cursor plumbing unchanged.
- Reduced motion: `q-dot-offset` gets `animation: none`
  in the existing backstop, and the static branch renders
  no dot layers at all.

## 3. Untouched: P1, P2, P3, wording

- P1: V13 band 0.60 alpha, 0.6px dots; V6 dots 4px,
  unlit 0.3 ink, ring 32px at left 178, center dot 10px
  at left 189; drift ring 200px at 0.25 opacity.
- P2: auto bloom once per mount at first progress 1.0
  anchored on the ring, center-dot pulse 3s.
- P3: bloom 1.4s, peak opacity 0.35, 240px, stroke kept.
- Wording byte-identical, script-verified: 17-word N2 claim,
  bold on ward, keyboard,, tools; 272-char N2 mission,
  blue span exactly on `CodeCureConnect:`.
- Em dash count 0, en dash count 0.

## 4. QA verdicts

- Layout: SHIP.
- Threshold: SHIP.
- Regression: SHIP.
- Motion: CONDITIONAL SHIP, disclosure-only: the offset
  pulse is time-based and keeps running at rest by design;
  three dot systems stack behind the mission at progress 1.0,
  so busyness needs a live preview check; the pulse is
  visible only inside the 350px cursor disc on desktop
  (centered on touch).
- Mobile-plus-contrast: CONDITIONAL SHIP, disclosure-only:
  320px fit computed, not DOM-measured, with 30px slack
  (ring ends at 210px in the 240px column); the lower
  mission lines are the busiest zone at pulse peak and
  could feel speckled on a bright screen; the documented
  fallback is lowering the keyframe peak from 0.25 to 0.15.

## 5. Live checks still owed on the user preview

Slow-scroll sequence with restored pacing (claim to 0.8,
mission 0.80 to 0.85, dots 0.82 to 0.952, ring last);
density pulse at rest; mission readability at progress 1.0
at pulse peak on a bright screen; reduced-motion static
rendering; 320px fit.
