# Spec: Journey lantern pulse, denser colors, whiter animated rings

Scope: `src/sections/Manifesto.tsx` ONLY, plus this spec doc.
Base: HEAD after the Three Lanterns round (`bde3448`).
User request (Indonesian, paraphrased without changing its meaning):
the BLUE lanterns should pulse like alive, their colors should read
more visibly (currently they look foggy and blurry), and the contour
rings should be whiter and animated.

## 1. Grounding: what exists today

Read from `src/sections/Manifesto.tsx` (1289 lines) before writing this
spec. Line numbers below are from that read.

- Section background (line 966): inline style
  `linear-gradient(180deg, #111111 0%, #0E1626 100%)`, painted always.
  Section is `position: relative`, `overflow: hidden`, no stacking
  context of its own.
- Lantern shared class (lines 359 to 366): `position: absolute`,
  `border-radius: 50%`, `pointer-events: none`, `z-index: 0`,
  `will-change: transform`.
- Lantern A (lines 368 to 381): 1100px circle, `top: -6%`,
  `left: -8%`, `animation: journey-lantern-a 28s ease-in-out infinite
  alternate`, keyframes `translate3d(0, 0, 0)` to
  `translate3d(70px, 70px, 0)`. Inline background (lines 975 to 980):
  `radial-gradient(circle, rgba(8, 89, 212, 0.35) 0%,
  rgba(8, 89, 212, 0.18) 45%, rgba(8, 89, 212, 0) 70%)`.
- Lantern B (lines 383 to 396): 1300px circle, `bottom: -12%`,
  `right: -10%`, `animation: journey-lantern-b 36s ease-in-out
  infinite alternate`, keyframes `translate3d(0, 0, 0)` to
  `translate3d(-60px, -60px, 0)`. Inline background (lines 983 to
  988): `radial-gradient(circle, rgba(8, 89, 212, 0.25) 0%,
  rgba(8, 89, 212, 0) 70%)`, deliberately no 45% mid stop.
- Lantern C (lines 398 to 411): 800px circle, `top: 38%`,
  `right: 2%`, `animation: journey-lantern-c 24s ease-in-out infinite
  alternate`, vertical keyframes `translate3d(0, -40px, 0)` to
  `translate3d(0, 40px, 0)`. Inline background (lines 991 to 995):
  `radial-gradient(circle, rgba(255, 255, 255, 0.08) 0%,
  rgba(255, 255, 255, 0) 70%)`.
- Mobile block (`@media (max-width: 1100px)`, lines 723 to 755):
  A becomes 700px at `top: -4%`, `left: -20%` with its own
  `journey-lantern-a-mobile` 28s drift to `translate3d(35px, 35px, 0)`;
  B becomes 900px at `bottom: -8%`, `right: -25%` with its own
  `journey-lantern-b-mobile` 36s drift to
  `translate3d(-30px, -30px, 0)`; C is `display: none`.
  TRAP FOR THE FIXER: these mobile rules REPLACE the `animation`
  shorthand, they do not extend it. Any pulse added to the base
  shorthand must be added to the mobile shorthands too, or the pulse
  silently disappears on mobile.
- Reduced-motion block (`@media (prefers-reduced-motion: reduce)`,
  lines 770 to 850): lantern classes get `animation: none !important`
  (lines 776 to 779) and no rule hides any lantern or touches the
  section background. Rings park at `scale(1.08)` with no transition
  (lines 828 to 831). The branch pins `progress = 1` and
  `activeIdx = 4` with no listener.
- Rings SVG (lines 1046 to 1067): direct `.journey-grid` child,
  2400x2400, viewBox `0 0 2400 2400`, seven circles centered
  1200,1200 with radii 300, 400, 500, 600, 700, 850, 1000, no fill,
  `stroke="rgba(255, 255, 255, 0.06)"`, `strokeWidth={1}`,
  `vectorEffect="non-scaling-stroke"`, classes
  `journey-ring-0` to `journey-ring-6`. Ring CSS (lines 651 to 660):
  `position: absolute`, `left: calc(100% + 120px)`, `top: 50%`,
  `z-index: -2`, `transition: transform 800ms ease-out`, inline
  transform `translate(-50%, -50%) scale(ringScale)` where ringScale
  is window-quantized from existing `progress` state
  (1.00, 1.04, 1.08, 1.12, 1.16). Pre-reveal gate:
  `.mvM-armed:not(.mvM-in) .journey-rings { opacity: 0; }`.
  Mobile: same SVG at 1200x1200 re-anchored to `left: 7px`, rings
  0 to 2 hidden, rings 3 to 6 kept.
- Untouched by this round: seals, bead, wells, instruments, step,
  copy, dots, counts, route draw, pulse ring, header, footnote.

## 2. Lantern pulse: breathing, drift untouched

Mechanism (this is the whole trick, and it is mandatory): drift owns
`transform`, pulse owns `opacity`. Two animations on one element
animate different properties, so they never fight. Do NOT put the
pulse on a wrapper div, do NOT animate transform for the pulse, and
do NOT touch the drift keyframes.

Keyframes (one shared definition, used by both blue lanterns):

```css
@keyframes journey-lantern-pulse {
  0% { opacity: 0.8; }
  50% { opacity: 1; }
  100% { opacity: 0.8; }
}
```

Opacity range is 0.8 to 1. That is a breath, not a blink: the
lantern never dims below 80% of its gradient, so the section never
flashes back toward plain black at the trough.

Phase staggering (A and B must never breathe in unison):

- A: `journey-lantern-pulse 6s ease-in-out infinite`, delay 0s.
  At t = 0, A sits at the trough (0.8) and rises.
- B: `journey-lantern-pulse 7s ease-in-out infinite`, with a pulse
  delay of -3.5s (half of B's 7s period). At t = 0, B sits at the
  peak (1) and falls, exactly opposite to A.
- Different periods (6s vs 7s) mean the phase relationship drifts
  slowly after t = 0, so the pair only briefly coincides (every
  42s) and never settles into unison.

Animation lists (the fixer must write all four, because of the
mobile shorthand trap in section 1):

- A base: `animation: journey-lantern-a 28s ease-in-out infinite
  alternate, journey-lantern-pulse 6s ease-in-out infinite;`
- B base: `animation: journey-lantern-b 36s ease-in-out infinite
  alternate, journey-lantern-pulse 7s ease-in-out infinite;`
  with `animation-delay: 0s, -3.5s;` (first value is the drift
  delay, second is the pulse delay; order must match the animation
  list order).
- A mobile: `animation: journey-lantern-a-mobile 28s ease-in-out
  infinite alternate, journey-lantern-pulse 6s ease-in-out infinite;`
- B mobile: `animation: journey-lantern-b-mobile 36s ease-in-out
  infinite alternate, journey-lantern-pulse 7s ease-in-out infinite;`
  with `animation-delay: 0s, -3.5s;`

C (pale white) keeps drift ONLY, no pulse entry anywhere, so the
blue pair reads as the living element and C stays a quiet moon.

Also extend the shared lantern class `will-change` from `transform`
to `transform, opacity`. One word, same line, no other change to
that class.

Why opacity, not a second transform: the drift already owns
transform on these elements, and a second transform animation would
override it. Opacity is also paint-only, so the pulse costs nothing
in layout.

## 3. Colors more visible, less foggy: denser gradients

Diagnosis (why the current lanterns read as fog): the color is
spread thin over a huge area. Lantern A fades from 0.35 to
transparent across 70% of its 1100px radius, so most of its visible
disc sits below 0.18 alpha. The fix is concentration, not just a
higher peak: pull the transparent stop inward and raise the mid
stop, so the same blue occupies a smaller, denser disc.

New gradient stops (exact values, replace the three inline
backgrounds in JSX; nothing else about the lantern divs changes):

- A (over the dark top of the section): `radial-gradient(circle,
  rgba(8, 89, 212, 0.40) 0%, rgba(8, 89, 212, 0.22) 30%,
  rgba(8, 89, 212, 0) 55%)`. Peak 0.35 to 0.40, mid 0.18 at 45% to
  0.22 at 30%, transparent 70% to 55%. Visible disc area shrinks to
  about 62% of before ((55/70) squared), while peak and mid rise.
- B (over the navy bottom of the section): `radial-gradient(circle,
  rgba(8, 89, 212, 0.35) 0%, rgba(8, 89, 212, 0) 55%)`. Peak 0.25 to
  0.35, transparent 70% to 55%. B keeps its two-stop structure
  (no mid stop), per the lantern spec.
- C (pale white, drift only): `radial-gradient(circle,
  rgba(255, 255, 255, 0.10) 0%, rgba(255, 255, 255, 0) 60%)`. Peak
  0.08 to 0.10, transparent 70% to 60%. C is deliberately changed
  least: it is not one of the blue lanterns the user complained
  about, and white lifts faster than blue (see the contrast table).

Old hard cap SUPERSEDED: the lantern round capped blue alpha
behind text at 0.35. This request explicitly supersedes it for A
(0.40) and keeps B exactly at the old cap value (0.35). The caps
below are set by the contrast math, not by the old rule.

Contrast table (WCAG relative luminance, alpha compositing, computed
at pulse PEAK, opacity 1, which is the worst case; at pulse trough,
opacity 0.8 scales every effective alpha by 0.8 and every contrast
below improves, so the peak numbers govern):

- A core 0.40 over #111111: body #D8D8D8 9.36:1, mono label
  #98989C 4.62:1. Both above AA (4.5:1).
- A mid stop 0.22 at 30% over #111111: body 11.34:1, mono 5.60:1.
- B core 0.35 over #0E1626: body 9.33:1, mono 4.61:1. Both above AA.
- C core 0.10 over #0E1626: body 9.65:1, mono 4.76:1. Both above AA.
- For reference, the old values: A core 0.35 gave mono 4.93:1, B
  core 0.25 gave mono 5.12:1.

Honest statement the fixer and QA must carry: the mono-label
margins above AA are now thin (about 0.1, down from about 0.4 to
0.6). Body text stays comfortable at about 9.3:1 and above in every
zone. The caps above (A 0.40, B 0.35) are the highest round values
that keep mono at or above 4.5:1 under this computation; A at 0.42
would already fall to about 4.52:1 (margin 0.02, too thin to ship)
and B at 0.38 to about 4.45:1 (below AA). If QA recomputes any
worst-case mono value below 4.5:1, the single-number fallback is A
0.40 to 0.38 and B 0.35 to 0.33, no other change. Text is NEVER
dimmed to compensate; the caps ARE the compensation.

## 4. Rings whiter and animated

### 4a. Whiter alpha: 0.06 to 0.15

Change the single `stroke` attribute value on the rings map in JSX
from `rgba(255, 255, 255, 0.06)` to `rgba(255, 255, 255, 0.15)`.
One token, all seven rings, desktop and mobile (mobile keeps the
same attribute; only rings 0 to 2 are hidden there).

Justification against the known crossing fact: ring arcs DO cross
text columns on desktop (left arcs reach into the 2026 column, and
at the narrowest desktop width nearly full-width) and the full
mobile text column. 0.15 is chosen because: it is 2.5x the old
value, so it reads as plainly whiter in a still screenshot; it is
still a 1px hairline (stroke width unchanged, `non-scaling-stroke`
preserved, no fill), so it cannot compete with 16px body glyphs;
and it matches the magnitude of the already-approved dot texture
behind text (the Quote dot field runs at 0.12, the journey dot
field base at 0.30 for 0.7px dots). If preview finds any arc
reading as a stray line through body text, the single-number
fallback is 0.15 to 0.10, never dimming text.

### 4b. Marching dashes (rotation is impossible on circles)

Concentric circles cannot show rotation: a rotated circle looks
identical. So the animation is marching dashes via
`stroke-dasharray` plus animated `stroke-dashoffset`, NOT rotation
and NOT opacity (opacity is excluded on purpose: the SVG carries
the `.mvM-armed:not(.mvM-in)` opacity gate, and an opacity
animation on the same element would fight that gate; dashoffset
lives on the child circles and never touches the gate).

CSS to add (in the same stylesheet block as the rings):

```css
.journey-rings circle {
  stroke-dasharray: 60 40;
  animation: journey-ring-march 12s linear infinite;
}
.journey-ring-1,
.journey-ring-3,
.journey-ring-5 {
  animation-direction: reverse;
}
@keyframes journey-ring-march {
  from { stroke-dashoffset: 0; }
  to { stroke-dashoffset: -100; }
}
```

Parameters, each chosen deliberately:

- Dash pattern `60 40` in viewBox units: 60 units on, 40 off,
  period exactly 100 units. Dashes read as orbit segments, not a
  dotted line, and the pattern is long enough that individual
  dashes stay visible on the largest ring (circumference about
  6283 units, about 63 dashes) and the smallest (about 1885 units,
  about 19 dashes).
- Duration 12s linear, offset 0 to -100: exactly one pattern
  period per loop, so the loop is seamless by construction, and
  the pattern creeps at about 8.3 units per second, visible within
  a few seconds of watching without shimmering.
- Direction alternates by ring parity: even rings (0, 2, 4, 6)
  march forward, odd rings (1, 3, 5) march in reverse via
  `animation-direction: reverse` on the parity classes only (the
  property composes with the shorthand; do NOT repeat the full
  animation shorthand there or it will reset the duration).
- No new keyframes for the reverse direction: one keyframes
  definition serves both directions.

### 4c. Scroll scale stays intact

The scroll window-quantized scale (1.00 to 1.16 from `progress`,
inline transform on the SVG) is UNTOUCHED. It cannot conflict with
the dash animation: scale lives on the SVG element's transform,
dashoffset lives on the child circles. The dash pattern is defined
in viewBox units, so it scales proportionally with ringScale
(1.00 to 1.16) and with the mobile 1200px rendering (visual dash
length halves there, pattern unchanged), and the march loop stays
seamless at every scale because the offset period equals the
pattern period in user units. The fixer must NOT move the scale to
CSS, must NOT add a second transform to the SVG, and must NOT
touch the `ringScale` derivation.

## 5. Mobile (below 1100px)

- Pulse and new colors apply to mobile A and B identically: same
  pulse keyframes, same new gradient stops, same animation lists
  (base mobile drift plus pulse, with the -3.5s pulse delay on B).
  The mobile sizes (A 700px, B 900px) and anchors are unchanged.
- C stays hidden (`display: none` in the mobile block, untouched).
- Rings: the 0.15 stroke and the dash animation apply to the 4
  kept mobile rings (3 to 6) identically, because both rules live
  outside any media block. Directions stay parity-based (3
  reverse, 4 forward, 5 reverse, 6 forward). Visual dash length
  halves at the 1200px rendering; that is expected, not a defect.
- Base gradient unchanged on mobile (section inline style is not
  overridden in the mobile block).

## 6. Reduced motion

- Pulse: NO new rule needed and NO new rule allowed that would
  break the existing one. The existing block already sets
  `animation: none !important` on all three lantern classes, and
  because the pulse rides in the same `animation` shorthand as the
  drift, that single rule kills both. With animation none, lantern
  opacity returns to its default 1, so lanterns freeze at full new
  alphas (pulse peak equivalent), never hidden, never dimmed.
- Rings: ADD one rule to the existing reduced-motion block:
  `.journey-rings circle { animation: none !important; }`. With
  animation none, dashoffset returns to its default 0, so rings
  freeze as fully dashed circles at the new 0.15 alpha. The
  existing rings scale rule (parked at 1.08, no transition) and
  the pre-reveal gate are untouched.
- Forbidden in the reduced-motion block for this round: any
  `display: none`, `opacity: 0`, or visibility rule for any lantern
  or ring, and any rule touching the section background. The whole
  point of the lantern round was that the visible background
  survives reduced motion; this round extends that to the new
  alphas and the frozen dashes.
- The reduced-motion branch pins `progress = 1` and `activeIdx =
  4` with no listener, so the static render is: gradient at full
  strength, A and B at new alphas and full opacity, C at 0.10,
  rings parked at scale 1.08, fully dashed at 0.15.

## 7. Scope and non-goals

- Files: `src/sections/Manifesto.tsx` ONLY, plus this spec doc.
- Untouched, explicitly: seals, bead, wells, instruments, step,
  copy, dots, counts, route draw, pulse ring, header, footnote,
  base gradient endpoints (#111111 to #0E1626), lantern sizes and
  anchors, ring radii and anchor, ringScale derivation, mobile
  lantern sizes and anchors, mobile ring subset.
- No new dependencies, no new scroll/resize/pointer listeners, no
  new state. The pulse and the march are pure CSS keyframes; the
  colors are static gradient stops; the scale still derives from
  existing `progress` state in render.
- Paint-only properties throughout: `opacity` (pulse),
  `stroke-dashoffset` (march). Gradient stops are values, not
  animations. No width, height, margin, padding, or layout change
  anywhere.
- The old 0.35 blue-alpha cap is superseded ONLY as stated in
  section 3 (A 0.40, B 0.35, both justified by the contrast table).
  No other cap or rule from earlier rounds is reopened.

## 8. Risks and fallbacks (single numbers, no new effects)

- Mono-label margin is thin (about 0.1 above AA at pulse peak).
  Fallback if QA recomputes below 4.5:1: A 0.40 to 0.38, B 0.35 to
  0.33. Do not dim text, do not shrink the transparent stop
  further as a substitute.
- Rings at 0.15 could read as stray lines on bright screens.
  Fallback: 0.15 to 0.10. Do not remove the dashes as a first
  resort: dashes (broken arcs) read less like rule lines than a
  solid arc does.
- Pulse plus drift on one element: if any browser shows the two
  animations interfering (they animate different properties, so
  they must not), the fallback is to move the pulse to opacity on
  the same element via a separate `animation` list entry order
  check, never to a wrapper div and never to transform.
- If the march reads as shimmer on small screens, the single
  number is duration 12s to 20s (slower creep), never a pattern
  change plus a duration change at once.

## 9. Acceptance checklist

The fixer must verify every item from code and report pass/fail;
QA re-verifies. DOM/visual items that cannot be verified from code
are marked preview-only.

1. Pulse keyframes exist exactly as section 2 (0.8 to 1 to 0.8,
   ease-in-out, infinite, not alternate) and are shared by A and B.
2. All four animation lists carry drift plus pulse (A base, B
   base, A mobile, B mobile); no list omits the pulse.
3. B pulse delay is -3.5s in the second delay position (drift
   delay 0s first); A pulse delay is 0s. At t = 0, A is at trough
   and B at peak.
4. C has no pulse entry in any animation list (base or mobile).
5. New gradient stops match section 3 exactly for A, B, and C
   (A 0.40 / 0.22 at 30% / transparent 55%; B 0.35 / transparent
   55%; C 0.10 / transparent 60%).
6. Contrast table recomputed by the fixer (not copied): worst-case
   mono at or above 4.5:1 behind every new core at pulse peak,
   body at or above 9:1; fallback numbers recorded if any value
   lands below.
7. Ring stroke attribute is exactly `rgba(255, 255, 255, 0.15)` on
   the rings map (single token change, all seven rings).
8. Dash CSS exists exactly as section 4b (pattern 60 40, 12s
   linear infinite, offset 0 to -100, odd rings reversed via
   `animation-direction` only, no second keyframes definition).
9. Scroll scale intact: `ringScale` derivation untouched, inline
   SVG transform untouched, scale values still 1.00 to 1.16 from
   `progress`, pre-reveal opacity gate untouched.
10. Mobile: pulse present on mobile A and B lists, C still
    `display: none` below 1100px, rings 0 to 2 still hidden there,
    rings 3 to 6 marching with parity directions.
11. Reduced motion: existing lantern `animation: none !important`
    still kills drift and pulse together; new rule
    `.journey-rings circle { animation: none !important; }`
    present; no rule in the block hides any lantern or ring or
    touches the section background.
12. No interference: seals, bead, wells, instruments, step, route
    draw, pulse ring, header, footnote, copy, dots, and counts all
    byte-identical (diff shows no deletions outside this spec's
    own edits); no new dependency, listener, or state.
13. Build passes (`npm run build`, tsconfig `noUnusedLocals`
    clean); Manifesto chunk size reported.
14. `git status` shows only `M src/sections/Manifesto.tsx` plus
    untracked `docs/journey-lantern-pulse-rings/`.

Preview-only (cannot be verified from code, goes to QA as
eyeball items): pulse reads as breathing rather than flicker;
blue reads denser and less foggy without feeling like solid
panels; dashes visibly creep on desktop and mobile; rings at
0.15 never read as stray lines through body text; reduced-motion
static render (full alphas, frozen dashes, 2026 instrument lit).
