# 04 - Deep Analysis: Pinned Quote Scrub and Cursor Dot Field

Deep analysis 4/15. READ-ONLY toward the site: this document is the
only file this task creates, and no site file was edited.

## 0. Method, evidence labels, and one honest limitation

Sources for this document:

- `docs/motion/02-onlines-visual-forensics.md` sections 3 and 9, which
  record a verified fetch of the reference production stylesheets
  (quote block, shared dot pattern) from the earlier motion track.
- `src/sections/Quote.tsx` (pinned paint) and
  `src/sections/Contact.tsx` (dot field) as built in v2, read in full.
- A fresh homepage text fetch in this run, used only to confirm
  section order and the presence of the claim block and the contact
  block. It carries no CSS, so it adds no new measurements.
- Live browser observation from the parent track: the claim fill is
  scrubbed in both directions (scrolling up unpaints words). That
  observation is cited as OBSERVED (live), not as this task's own
  measurement, because this subagent has no live browser.

Limitation, stated plainly: a direct re-fetch of the reference
stylesheets was NOT achieved in this run. The text fetch strips head
link and script tags, so no stylesheet URL is exposed, and web search
does not index the theme CSS URLs, so none could be recovered
verbatim. No stylesheet URL was guessed. Every reference measurement
below is therefore carried from doc 02's verified stylesheet fetch,
cross-checked against the v2 source and the live observation above.
Anything doc 02 already marked UNVERIFIED stays UNVERIFIED here.

Evidence labels:

- VERIFIED (CSS, doc 02): present in a reference stylesheet fetched in
  the earlier track.
- VERIFIED (v2 source): present in the v2 file named.
- OBSERVED (live, parent track): seen in a live browser session.
- UNVERIFIED: not established by any source above.

Deliberate limit: this document quotes measurements only. It does not
reproduce the reference headline wording or any reference marketing
copy. The reference claim is referred to only as "the reference claim
headline".

## 1. Pinned quote mechanics: measurement table

| # | Property | Reference value | Evidence |
|---|---|---|---|
| Q-M1 | Block height, desktop | 100svh + 1875px scroll runway + 240px separation padding (120px top and bottom), total 100svh + 2115px | VERIFIED (CSS, doc 02) |
| Q-M2 | Block height, mobile | 100svh + 1125px runway + 70px padding top and bottom, total 100svh + 1195px | VERIFIED (CSS, doc 02) |
| Q-M3 | Mobile breakpoint | 1023px and below (desktop values hold above it) | VERIFIED (CSS, doc 02) |
| Q-M4 | Sticky child | position sticky, pinned to viewport top, full viewport height (100svh), while the visitor scrolls the runway | VERIFIED (CSS, doc 02) |
| Q-M5 | Paint unit | One word at a time, each word carrying its own revealed class | VERIFIED (CSS, doc 02) |
| Q-M6 | Inactive word treatment | Pale grey fill PLUS a light outline stroke on the glyphs | VERIFIED (CSS, doc 02) |
| Q-M7 | Active word treatment | Full ink color | VERIFIED (CSS, doc 02) |
| Q-M8 | Per-word transition | Color transition 0.35s | VERIFIED (CSS, doc 02) |
| Q-M9 | Subtitle behavior | The subtitle below the headline does NOT take part in the paint | VERIFIED (CSS, doc 02) |
| Q-M10 | Dot field behind pinned text | The shared dot pattern sits behind the pinned text | VERIFIED (CSS, doc 02) |
| Q-M11 | Scroll-to-word mapping | Linear per word, eased, or grouped by line | UNVERIFIED |
| Q-M12 | Reversibility in reference code | Whether paint reverses on scroll up, as a code fact | UNVERIFIED (but OBSERVED (live, parent track): the fill scrubs in both directions) |
| Q-M13 | Trigger that starts the pin | Scroll position thresholds, IntersectionObserver, or a JS scroll handler | UNVERIFIED |
| Q-M14 | Reduced-motion rule for the quote paint | None found in the fetched stylesheets | UNVERIFIED (absence of evidence, not proof of absence) |
| Q-M15 | Headline size in the quote block | Not separately measured in doc 02; the block's H1 is the page's semantic claim headline, distinct from the 180px hero word | UNVERIFIED |

### 1.1 Scroll budget arithmetic (derived, not measured)

The runway math matters because it sets the reading pace:

- Desktop scroll travel available to the pinned phase = block height
  minus one viewport = 1875px + 240px = 2115px of scroll.
- If paint were spread evenly over the whole travel, each word would
  get 2115px / N words of scroll, where N is the headline word count.
  The reference headline is longer than v2's 20-word claim, so its
  per-word budget is smaller than v2's (see delta Q-D5).
- The 240px separation padding is part of the travel, not free space
  outside it: the sticky child pins for the full 2115px, so the last
  240px of travel still shows pinned content. Any mapping that spends
  the paint over only part of the travel leaves a pinned-but-static
  tail (or head) by design.

### 1.2 What the CSS proves vs what it cannot prove

Proven by CSS: the tall structure, the sticky pin, the two word
states (pale plus outline, full ink), the 0.35s color transition, the
subtitle's non-participation, and the dot field behind the text.

Not proven by CSS: the mapping function (Q-M11), the trigger
(Q-M13), the exact pale grey hex value and the exact outline stroke
width and color (doc 02 records the treatment qualitatively, not as
hex values, so no hex is claimed here), and any reduced-motion
behavior (Q-M14). A rebuild that claims to match the mapping exactly
is claiming something no fetched source establishes.

## 2. Cursor dot field: measurement table

| # | Property | Reference value | Evidence |
|---|---|---|---|
| D-M1 | Rendering method | Two repeating radial-gradient layers, not DOM elements | VERIFIED (CSS, doc 02) |
| D-M2 | Dot pitch | 14px in both axes | VERIFIED (CSS, doc 02) |
| D-M3 | Dot size | 0.4px radius | VERIFIED (CSS, doc 02) |
| D-M4 | Base layer opacity | Black at 20 percent | VERIFIED (CSS, doc 02) |
| D-M5 | Lit layer opacity | Black at 44 percent | VERIFIED (CSS, doc 02) |
| D-M6 | Field-reveal mask | Radius 350px on desktop, 200px on mobile, centered on the cursor, position written by JS as CSS variables | VERIFIED (CSS, doc 02) |
| D-M7 | Lit halo mask | Radius 50px around the cursor, fading outward from 65 percent | VERIFIED (CSS, doc 02) |
| D-M8 | Lit layer switch-on | Instant under the cursor | VERIFIED (CSS, doc 02) |
| D-M9 | Lit layer fade-out | 600ms after the cursor leaves | VERIFIED (CSS, doc 02) |
| D-M10 | No-hover fallback | Mask parks at center (300px radius) and the lit layer is removed entirely | VERIFIED (CSS, doc 02) |
| D-M11 | Where the field appears | Behind the pinned quote text AND in the contact section (shared pattern) | VERIFIED (CSS, doc 02) |
| D-M12 | Exact mask gradient stops | The full stop list of either mask | UNVERIFIED (only the radii and the 65 percent halo start are recorded) |
| D-M13 | CSS variable names the reference JS writes | Not recorded | UNVERIFIED |
| D-M14 | Reduced-motion rule for the dot field | None found in the fetched stylesheets | UNVERIFIED |
| D-M15 | Field background color behind the dots | Not separately recorded for the quote block; the contact section is a light section | UNVERIFIED |

### 2.1 The two-mask system, spelled out

The reference does not use one mask. It uses two, with different
jobs:

1. Field-reveal mask (350px desktop, 200px mobile): decides WHERE
   dots are visible at all. Outside this radius the dot field does
   not render. The field therefore appears to materialize around the
   cursor and vanish behind it.
2. Lit halo mask (50px): decides where dots render BRIGHTER (the
   44 percent layer). Inside 50px the dots light up; outside it they
   fall back to the 20 percent base, but only where the field-reveal
   mask already shows them.

Composite alpha note (derived, approximate): if the halo mask starts
at 65 percent alpha at its center and the lit layer itself is 44
percent black, the peak effective dot darkness inside the halo is
roughly 0.65 x 0.44, about 29 percent, not 44 percent and not 65
percent. The exact composite depends on the unrecorded mask stops
(D-M12), so this is an estimate, not a measurement.

### 2.2 Why the dot field reads as alive

Three properties do the work, and all three are needed together:

- The field is cursor-gated (D-M6): dots exist only near the cursor,
  so moving the mouse feels like carrying a lamp.
- The halo is small (50px) relative to the field (350px): the bright
  spot is a tight core inside a wide faint field, which reads as
  depth rather than a flat highlight.
- The timing is asymmetric (D-M8, D-M9): instant on, 600ms fade-out.
  The dots linger briefly after the cursor leaves, which sells the
  physical metaphor. A symmetric fade would feel like a tooltip.

## 3. What v2 already built (verified from source)

### 3.1 Quote: `src/sections/Quote.tsx`

- Wrapper heights match the reference exactly: desktop
  `calc(100svh + 1875px + 240px)`, mobile (max-width 1023px)
  `calc(100svh + 1125px + 140px)` (1125px runway + 70px top and
  bottom padding). Breakpoint 1023px matches Q-M3.
- Sticky child matches: `position: sticky; top: 0; height: 100svh`,
  flex-centered, with 120px vertical padding desktop and 70px mobile.
- Paint unit matches: the claim is split into 20 word spans, each
  flipping pale to ink, with a `color 0.35s` transition (matches Q-M8).
- Progress is computed from the wrapper rect on scroll and resize,
  rAF-throttled, passive listener: `progress = clamp01(-rect.top /
  (rect.height - innerHeight))`. Because progress is a pure function
  of scroll position, scrolling up unpaints words in reverse, which
  matches the OBSERVED (live) reference behavior even though the
  reference code mapping is UNVERIFIED.
- Reduced-motion fallback exists: the plain static quote renders
  instead (fully ink words, mission visible, no tall wrapper, no
  pinning), plus a CSS override. This goes beyond the reference, where
  no reduced-motion rule was found (Q-M14).

### 3.2 Contact dot field: `src/sections/Contact.tsx`

- Dot geometry matches: 14px pitch, 0.4px dot radius, base
  `rgba(0, 0, 0, 0.2)`, lit `rgba(0, 0, 0, 0.44)` (matches D-M2 through
  D-M5).
- Cursor plumbing matches the mechanism: `onMouseMove` writes
  `--dot-x` / `--dot-y` in px relative to the section, via
  `style.setProperty` (no re-render per mousemove; only the lit
  on/off state re-renders).
- Switch timing matches: lit layer turns on instantly (0ms) and
  fades out over 600ms on mouse leave (matches D-M8, D-M9).
- No-hover fallback matches: under `@media (hover: none)` the lit
  layer is `display: none` and the base layer is masked to a 300px
  center park (matches D-M10).
- Reduced-motion handling exists: lit layer removed, base layer
  unmasked (static full faint field), mousemove handler early-returns.
  Again this goes beyond the reference, where no rule was found
  (D-M14).

## 4. Precise delta list (reference vs v2)

### Quote deltas

- Q-D1 (visual, medium): inactive words lack the outline stroke.
  Reference inactive words are pale grey PLUS a light outline stroke
  (Q-M6). V2 inactive words are flat `#D6D6D6` fill with no
  `-webkit-text-stroke` or equivalent. Fix: add a light stroke
  (width and color to be tuned visually; no hex is established for
  the reference stroke, so do not claim a matched value).
- Q-D2 (behavior, medium): the paint window is a v2 interpretation.
  V2 paints over the first 90 percent of travel (word i paints at
  `((i + 1) / 20) * 0.9`) and reserves the last 10 percent for the
  mission fade. The reference mapping is UNVERIFIED (Q-M11), so the
  90/10 split cannot be called a match or a mismatch, only an
  interpretation. It has one real consequence: the last 10 percent of
  travel (about 211px desktop) shows a fully painted headline with
  only the mission line still animating.
- Q-D3 (behavior, low): the dashed rule progress-draw is a v2
  invention. V2 draws the vertical dashed rule in step with scroll
  progress, with the bottom square node traveling with the rule tip.
  The reference quote block's dashed rule is documented as a static
  vertical annotation (research 03); no progress-linked draw is
  recorded for it. The effect is plausible and consistent with the
  site's dashed motif, but it is not reference behavior.
- Q-D4 (missing layer, high): the quote block has no dot field.
  The reference paints its claim over the shared dot pattern
  (Q-M10). V2's Quote.tsx contains no dot layer at all; the only dot
  field in v2 lives in Contact. This is the largest quote gap after
  the stroke: the pinned text currently floats on plain white.
- Q-D5 (pace, low): per-word scroll budget differs by headline
  length. V2's 20-word claim over a 2115px travel with a 90 percent
  paint window gives about 95px of scroll per word. The reference
  headline is longer, so its per-word budget is smaller and its paint
  feels denser per scroll distance. This is arithmetic, not a defect:
  shortening or lengthening the v2 claim would change it, and the
  claim wording is the user's own content, not to be edited for pace
  alone.
- Q-D6 (content, informational): the reference subtitle does not
  participate in the paint (Q-M9). V2's mission line is not part of
  the word paint either, which matches, but its fade-in over the
  final 10 percent of travel is v2's invention (see Q-D2), not a
  recorded reference behavior for the subtitle.
- Q-D7 (robustness, low): v2's sticky child sets `overflow-y: auto`
  on the pinned 100svh box, so over-tall content on short viewports
  can scroll inside the pin. Reference behavior for over-tall pinned
  content is UNVERIFIED. The v2 choice is safe but means a short
  viewport can show an inner scrollbar the reference may not have.

### Dot field deltas

- D-D1 (behavior, high): the base dot field is always visible on
  hover devices in v2. The reference reveals the field only within
  350px of the cursor (D-M6); away from the cursor there are no
  dots. V2's `.contact-dot-base` has no mask on hover devices, so
  the full faint field covers the whole contact section at all
  times and the cursor only brightens a core. The lamp-carrying
  effect is therefore absent; v2 reads as a static dotted texture
  with a bright spot, not a field that materializes around the
  cursor. Fix: mask the base layer with the same 350px cursor mask
  (desktop) that the lit layer already uses.
- D-D2 (structure, medium): v2 merges the two reference masks into
  one gradient. V2's lit mask is a single radial gradient: 0.9 alpha
  at 0px, 0.65 at 50px, transparent at 350px. The reference keeps the
  350px field mask and the 50px halo mask conceptually separate
  (section 2.1). The merged gradient approximates both at once but
  conflates their falloffs: in v2 the brightness falls continuously
  from the cursor to 350px, while in the reference the halo should
  fall to base brightness by 50px and the field should then persist
  at base brightness out to 350px. A two-layer implementation (base
  masked at 350px, lit masked at 50px) would reproduce the step.
- D-D3 (value, low): the lit core alpha is stronger than recorded.
  V2's lit mask starts at 0.9 alpha at the cursor point; the
  reference halo is recorded as fading from 65 percent outward
  (D-M7). Combined with the 44 percent lit layer, v2's peak
  effective darkness is about 0.9 x 0.44 (about 40 percent) versus
  roughly 0.65 x 0.44 (about 29 percent) on the most plausible
  reading of the reference. The exact reference stops are UNVERIFIED
  (D-M12), so this is an approximation gap, not a proven mismatch.
- D-D4 (missing layer, high): no dot field in the quote block (same
  gap as Q-D4, counted once here for the dot-field track). The
  reference shares the pattern between quote and contact; v2 has it
  only in contact.
- D-D5 (mobile, low): v2 has no 200px mobile field mask. The
  reference field-reveal mask shrinks to 200px on mobile (D-M6).
  V2's mobile-relevant rule is the no-hover 300px center park, which
  matches the no-hover fallback (D-M10) but is a different case from
  a hover-capable small viewport. On a small hover-capable viewport
  v2 shows the unmasked full field (see D-D1) rather than a 200px
  cursor field.
- D-D6 (context, negligible): v2's contact section background is
  `#F5F5F7` (light grey), so 20 percent black dots sit on grey rather
  than on white. The reference contact background value was not
  separately recorded in this track, so no mismatch is claimed; the
  practical effect is only that v2's dots are slightly lower
  contrast than they would be on white.

## 5. Ranked fix list for the parent

1. Add the dot field behind the pinned quote text (Q-D4, D-D4).
   Same geometry as Contact (14px pitch, 0.4px dots, 20 percent
   base), behind the sticky content, cursor-gated as in fix 2.
2. Mask v2's contact base layer to the 350px cursor radius on hover
   devices (D-D1), and split the lit mask back into two layers: base
   masked at 350px (200px mobile), lit masked at 50px (D-D2).
3. Add a light outline stroke to inactive quote words (Q-D1).
   Tune width and color visually; no reference hex is established.
4. Soften the lit mask core from 0.9 toward 0.65 alpha (D-D3),
   accepting that the exact reference stops are UNVERIFIED.
5. Leave as is: the 90/10 paint window (Q-D2, interpretation, no
   reference value to match), the progress-drawn dashed rule (Q-D3,
   consistent invention), the reduced-motion fallbacks (beyond
   reference, keep), and the per-word scroll budget (Q-D5, follows
   from the user's own claim length).

## 6. Sources

- `docs/motion/02-onlines-visual-forensics.md` sections 3 and 9
  (reference stylesheet measurements, carried, not re-fetched; see
  section 0 for why).
- `research/03-onlines-layout.md` (quote block structure, dashed
  rule as static annotation).
- `src/sections/Quote.tsx` and `src/sections/Contact.tsx` (v2
  implementation, read in full).
- Parent-track live browser observation (claim fill scrubs in both
  directions; cited as OBSERVED (live), not measured here).
