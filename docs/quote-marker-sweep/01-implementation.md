# Quote marker sweep: implementation

Base HEAD `31d56f8`. File changed: `src/sections/Quote.tsx` only
(37 insertions, 2 deletions, verified by git diff). No commit, no push
from this round. Build PASS (tsc plus vite, built in 4.34s, Quote chunk
11.92 kB, up from 11.51 kB, consistent with the new helpers and
segmentation).

## What was implemented

The mission paragraph gains a pale blue marker wash behind three key
phrases, in reading order, after the mission has fully faded in. The
wash is a pure function of scroll progress, so scrolling back reverses
every sweep exactly, and there is no transition on the wash path.

Helper (one new function plus one style helper, both in Quote.tsx):

- `markerGrowth(start)` returns `reducedMotion ? 1 : 1 - Math.pow(1 -
  clamp01((progress - start) / 0.05), 3)`, which is easeOutCubic inside
  each 0.05 window. The reducedMotion guard forcing 1 is essential:
  in the static branch progress stays 0, so without it the wash would
  render at 0.
- `markerWash(growth)` returns only background properties:
  backgroundImage `linear-gradient(rgba(8, 89, 212, 0.12), rgba(8, 89,
  212, 0.12))`, backgroundSize `(growth * 100)% 100%`,
  backgroundRepeat no-repeat, backgroundPosition `0 0`,
  boxDecorationBreak clone plus WebkitBoxDecorationBreak clone.
  No padding, margin, border, display, font, or color change. No
  pointer-events style on the spans, so the sticky child tap handler
  (the bloom trigger) is unaffected. No aria-hidden on the spans.

Phrases and windows (call sites at 0.85, 0.90, 0.95):

1. "code that becomes healthcare tools": 0.85 to 0.90.
2. "connections that carry them further": 0.90 to 0.95.
3. "higher health standards and lasting change in Indonesia": 0.95
   to 1.00.

Windows start at 0.85, exactly when mission opacity reaches 1, so the
wash never paints over semi-transparent text. At progress 1.0 all
three markers sit full and still, with no time-based motion. The
spans stay inline with spaces outside them, so wrapped fragments of
one phrase sweep together and line breaks cannot shift at any
progress value: background-size changes paint only.

Segmentation is byte-identical. Concatenating the paragraph segments
in order gives exactly the previous 272 character mission text
(verified by script), with the blue span exactly once on
"CodeCureConnect:". The 17-word claim is untouched, with bold on
"ward", "keyboard,", and "tools".

## Untouched, verified by reading and by the diff

- Mission ramp 0.80 to 0.85 with the same 14px rise; claim factor
  0.8 with the 0.35s color transition.
- V13 band (0.60 alpha, 0.6px dots, 14px pitch, sweep 0.80 to 1.00,
  opacity gated on missionOpacity, zIndex 0 behind the paragraph at
  zIndex 1). The wash sits inside the paragraph and lightly veils
  band dots only within phrase fragments.
- V6 trail (12 dots at 4px lighting 0.82 to 0.952, ring 32px fading
  0.95 to 1.00, center dot 10px with the 3s pulse at full ring
  opacity).
- Dot layers (base 0.7px at 0.30 constant, offset layer pulsing 0 to
  0.25 over 9s inside the 350px cursor disc, lit halo 0.44 with the
  50px cursor mask and 600ms fade-out).
- B15 layer (drift ring 200px at 0.25 opacity, right 6 percent,
  hidden below 1024px; bloom 240px, 1.4s, peak 0.35, tap plus one
  auto bloom at first progress 1.0 anchored on the ring).
- Retired bars stay dead: `barGrowth` and `barStyle` grep 0.
- Em dash count 0, en dash count 0.

## QA verdicts

- Layout: SHIP.
- Motion: SHIP.
- Regression: SHIP.
- Mobile-plus-contrast: CONDITIONAL SHIP, disclosure-only. On phone
  widths the wrapped fragments of one phrase sweep together, so the
  marker can read as a near-continuous pale block rather than three
  distinct beats. A preview check at mid-sweep on a phone is owed.
- Device-regression: CONDITIONAL SHIP, disclosure-only. All
  conditions are preview-only items (listed below), not code defects.

## Device optimization: guaranteed by code versus preview-only

Guaranteed by code on all three classes:

- Paint-only animation (background-size only). No width, height,
  margin, padding, weight, or letter-spacing change, so the V13 band
  tracking and the trail row below the paragraph cannot shift.
- Inline spans fragment per wrapped line automatically, so no
  per-line tuning exists to break on any width.
- No new state, scroll listener, resize listener, timer, or JS
  loop. The wash derives from the existing progress state.
- Reduced-motion guard on every derived value, plus the static
  branch rendering full markers with fully visible text and no
  animation.
- No pointer-events change, so tap blooms keep working everywhere.

Mobile, up to 720px:

- Column is viewport width minus 80px of padding: 240px at 320px,
  310px at 390px. The mission wraps to about 8 to 10 lines.
  V6 ring ends at 210px inside the 240px column at 320px, 30px
  slack, computed not DOM-measured.
- Dot disc stays centered on touch (no cursor), so the density
  pulse and the center-dot pulse are the only ambient motion.
  Drift ring hidden below 1024px.

Tablet, 721px to 1160px:

- Mission column is capped at 640px, about 4 lines, matching
  desktop. Drift ring appears at 1024px and wider and can pass
  behind lower text at 1024px to 1160px (zIndex 0, no reflow, but
  crowding is preview-only).

Desktop, 1161px and wider:

- Container capped at 1160px, claim max 960px, mission max 640px,
  about 4 lines. Drift ring travels through the empty right margin.

Preview-only (the sandbox cannot render, so only the user preview
can prove these):

- True wrapped line counts on each width.
- Marker wash reading on phone widths at mid-sweep.
- Legibility at pulse peak on bright screens, with the documented
  fallback of lowering the offset keyframe peak from 0.25 to 0.15.
- Drift ring crowding at 1024px to 1160px.
- Tall-content pinning on short phones (claim plus a tall mission
  plus trail inside the pinned section).
- Any horizontal overflow.
- Reduced-motion static rendering with full markers.
- 320px fit (computed, not DOM-measured).

## Live checks still owed on the user preview

1. Slow-scroll sweep order: phrase 1, then phrase 2, then phrase 3,
   settling full and still at progress 1.0.
2. Phone fragment reading at mid-sweep (the mobile-plus-contrast
   disclosure).
3. Pulse-peak readability on a bright screen.
4. Reduced-motion static rendering with full markers.
5. 320px fit.
6. Regression sweep on all three device classes: mobile, tablet,
   desktop.

## Verdict

READY FOR PUSH APPROVAL. Zero blockers. Both conditional verdicts
are disclosure-only and map to preview checks, not to code changes.
