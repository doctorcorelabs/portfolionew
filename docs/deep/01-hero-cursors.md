# 01 - Hero Cursors: Deep Analysis

Scope: the reference homepage hero's fake collaborator cursors only.
This is the flagship ambient element of the hero: small colored
arrow-plus-label chips that drift around the giant word. This doc
does not cover the hero selection frame, grid, or collage cards in
full; those live in the sibling deep doc on the hero diorama. It also
does not cover the cursor-following dot-field halo, which is a
separate mechanism documented in the quote and dot-field deep doc.

## 0. Method and honesty banner

Read this first. A generic subagent has no live browser and no raw
HTML view, so this analysis triangulates three evidence kinds:

- Prior internal measurements: docs/motion/02 (visual forensics, 9
  production stylesheets fetched 24 Oct 2026), research/03 (layout,
  live HTML plus active theme stylesheet), research/04 (type and
  color, including theme.json palette values).
- Parent live-browser observation report, 24 Oct 2026 (screenshots
  during reload, slow scroll, and hover on the real homepage).
- Web search, which returned no reference asset URL and no new
  cursor measurement in this run. No asset URL was guessed or
  constructed here.

Confidence labels used in the table, exactly three:

- VERIFIED (CSS): the rule or comment is present in a stylesheet
  fetched by a prior internal task and quoted in doc 02 or
  research/03 or 04.
- VERIFIED (text): the fact appears in a text source (homepage text
  fetch, theme.json palette measurement in research/04, or the
  parent live-browser observation report). The source column always
  says which one, so the two text kinds are never confused.
- UNVERIFIED: no source above establishes it. It is listed so a
  builder can see the gap instead of inheriting a guess.

Deliberate limits: this doc describes the pattern functionally only.
It does not reproduce the reference site's headline wording,
marketing copy, client names, or the actual words on the cursor
labels. Labels are described only as short role-style labels (team
function words). Measurements (counts, sizes, durations, colors) are
the only quoted values. Anything marked SPEC in section 3 is a
proposed build value, not a reference measurement; SPEC values are
never presented as measured.

## 1. Measurement table

| Property | Value | Source | Confidence |
|---|---|---|---|
| Hero cursor chip count | 6 distinct arrow-plus-label pairings visible in live screenshots | Parent live-browser observation report, 24 Oct 2026 | VERIFIED (text) |
| Hero chip count, caveat | Still frames cannot prove whether a repeated chip is one element or several; 6 is the count of distinct pairings seen, not a proven DOM count | Sibling deep doc 02, count note | VERIFIED (text) |
| Contact section cursor count | 1 cursor element | Doc 02 section 9, contact stylesheet | VERIFIED (CSS) |
| Chip anatomy | Colored arrow plus a short role-style label pill beside it | Parent live-browser observation; doc 02 section 2; research/04 section 4 | VERIFIED (text) |
| Label palette, entries | 7 entries in theme.json under custom-figma- slugs: green #1BC47D, violet #6465ED, pink #EE46D3, turquoise #00B5CE, yellow #FFC700, orange #EF5533, light blue #18A0FB | Research/04 section 3.2, theme.json palette measurement | VERIFIED (text) |
| Label palette vs hero count | 7 palette entries against 6 hero pairings: no source maps one color to one chip, and the 7th entry may belong to the contact cursor or be unused in the hero | Counted from the two rows above; mapping is inference, not measurement | UNVERIFIED |
| Arrow size in px | Not stated in any fetched stylesheet or observation | None | UNVERIFIED |
| Label font family | Not stated for cursor labels specifically; the site's label scale generally uses the sans display face for labels and JetBrains Mono for micro text, but neither is tied to cursor labels in a fetched rule | Research/03 type scale (general, not cursor-specific) | UNVERIFIED |
| Label font size in px | Not stated for cursor labels specifically; the site's general label scale is 12px to 13px | Research/03 type scale (general, not cursor-specific) | UNVERIFIED |
| Label pill padding, radius, height | Not stated in any fetched stylesheet or observation | None | UNVERIFIED |
| Drift path shape | Closed looping paths around the hero canvas, passing near the giant word; exact geometry (circle, ellipse, Lissajous, or hand-drawn loop) not recoverable from stills or CSS | Parent live-browser observation (looping, whole-canvas drift) | VERIFIED (text) for looping drift; UNVERIFIED for exact geometry |
| Drift amplitude in px | Not measured; chips traverse the whole canvas rather than vibrating in place | Parent live-browser observation | UNVERIFIED |
| Drift loop duration | Not measured; described only as slow and continuous | Parent live-browser observation | UNVERIFIED |
| Drift easing | No CSS transition on cursor transform at all, so there is no CSS easing to quote; motion is produced per frame in JavaScript | Doc 02 section 2, hero stylesheet comment | VERIFIED (CSS) for the no-transition fact; UNVERIFIED for any JS easing curve |
| Drift driver | Scroll-driven frame by frame through requestAnimationFrame | Doc 02 section 2, hero stylesheet comment | VERIFIED (CSS) |
| Drift vs mouse | Independent of the visitor's mouse position during normal drift | Parent live-browser observation | VERIFIED (text) |
| Stagger between chips | Chips do not move in lockstep (distinct phases), but no stagger value in seconds is measured | Parent live-browser observation (distinct paths) | UNVERIFIED for the value |
| Entrance order | Cursors appear late in the hero load sequence, with the other floating collage items, after the giant word, the logo, and the grid fade; whole sequence about 2 to 3 seconds with an ease-out feel | Parent live-browser observation | VERIFIED (text) |
| Entrance form per chip | Pop in with stagger; individual chip delay, scale-from value, and fade duration not measured | Parent live-browser observation (pop with stagger); sibling deep doc 02 | VERIFIED (text) for pop with stagger; UNVERIFIED for per-chip values |
| Hover convergence | On hovering the giant word, the dashed selection box disappears and the chips converge toward the word; moving the mouse away returns the box and the chips to drift | Parent live-browser observation | VERIFIED (text) |
| Hover convergence speed | Not measured; no timing value exists in CSS or observation | None | UNVERIFIED |
| Hover convergence mechanism | Not a CSS :hover rule: no :hover rule for the frame exists in the fetched hero stylesheet, and cursor motion has no CSS transition, so convergence must be JavaScript-driven like the drift | Doc 02 section 1 and section 2 | VERIFIED (CSS) for the absence; mechanism inferred, see note |
| Click behavior, hero chips | No click behavior observed; chips are not links or buttons in any observation | Parent live-browser observation (no click tested as action, no link behavior seen) | UNVERIFIED |
| Click behavior, contact cursor | Shrinks to 0.9 scale while clicking | Doc 02 section 9, contact stylesheet | VERIFIED (CSS) |
| Contact cursor entrance | Fades and rises 10px over 0.6s | Doc 02 section 9, contact stylesheet | VERIFIED (CSS) |
| Hero grid z-index | 0, behind everything in the hero | Doc 02 section 2, hero stylesheet | VERIFIED (CSS) |
| Cursor layer z-order vs grid, word, frame | Exact z-index values not stated; chips remain visible while converging onto the word area, which requires them to sit above the word and frame layer in practice | Parent live-browser observation (visibility during convergence) | UNVERIFIED for values |
| Touch and no-hover behavior, cursors | Not stated in any fetched rule; the hero frame itself survives on mobile (80 percent wide, 100px tall) but cursor behavior there is not documented | Doc 02 section 1 (frame mobile size only) | UNVERIFIED |
| Reduced-motion behavior, cursors | No reduced-motion rule for cursors appears in the fetched stylesheets (same gap as quote paint, fan-out, and dot field) | Doc 02 section 11 | UNVERIFIED |
| System cursor replacement | Claimed in prior analysis (custom SVG brand cursor on hover devices, research/03 section 10 and research/04 section 4) but contradicted by live observation: default system cursor everywhere in screenshots | Research/03 and 04 (claim) vs parent live-browser observation (default cursor) | CONFLICT, see section 2 |

## 2. Conflicts and traps a builder must not fall into

1. Custom system cursor: do NOT build it. The carried claim of a
   custom SVG cursor replacing the system cursor is overridden by
   live observation (default black arrow in every screenshot). The
   most likely explanation is that the earlier claim conflated the
   decorative collaborator arrows with the system cursor. The
   collaborator chips are page content, not a pointer replacement.
   The rebuild must keep the default system cursor.
2. Seven colors, six hero chips: do NOT force a one to one mapping.
   Nothing maps a palette entry to a specific chip, and the contact
   cursor may use the seventh entry. A builder that assigns colors by
   list order is inventing a mapping.
3. Scroll-driven vs ambient loop: both descriptions are true at
   different levels. The stylesheet comment proves positions are
   written per frame in JavaScript and tied to scroll. The live
   observation proves continuous drift even without deliberate mouse
   movement (during slow scrolling). What is NOT proven is a pure
   ambient loop with zero scroll input, because the observation
   scrolled throughout. Section 3 therefore implements drift as a
   scroll-modulated loop, not as either pure extreme.
4. Count: 6 is the number of distinct pairings visible, not a proven
   DOM count. A builder should parameterize the chip count (see
   section 3) rather than hard-coding layout math that breaks if the
   count is actually 5 or 7.
5. Content claim, not just shape: role-labeled chips depict other
   people collaborating. That is a content claim about a team, not a
   neutral decoration. The sibling gap synthesis already flags this:
   for the rebuild, anonymous arrows (no names, no roles, no fake
   people) are the honest adaptation, and omitting the chips entirely
   is also honest. Copying the reference label words would fabricate
   collaborators. This doc is analysis only; whether to build any
   cursor layer at all is the parent's decision, and this doc does
   not override it.
6. Dot-field halo is not a cursor: the 350px reveal mask and 50px lit
   halo around the visitor's own pointer (quote and contact
   sections) are a separate mechanism from these drifting chips.
   Do not merge their implementations or their timings.

## 3. Implementation-ready spec (SPEC values are proposals)

Everything in this section marked SPEC is a proposed build value
chosen to be consistent with the measurements above. Nothing marked
SPEC is a reference measurement. A builder following this section
should need no further guessing, but must still tune against live
screenshots, because the reference values for size, duration, and
amplitude are UNVERIFIED.

### 3.1 Element structure

Hero cursor layer, one layer for the whole hero stage:

- Container: absolutely positioned, inset 0, overflow visible within
  the hero stage, pointer-events none, aria-hidden true, no
  keyboard focus, never a link or button. It sits above the
  selection frame layer and below the fixed header call-to-action.
  Order bottom to top inside the hero: grid (z-index 0, MEASURED),
  giant word, selection frame with handles, cursor layer (SPEC
  order, consistent with chips staying visible during convergence).
- One chip element per arrow. Each chip is a positioned wrapper
  containing exactly two parts: an SVG arrow and a label pill.
  The wrapper's position is written by JavaScript every frame
  (transform translate), never by CSS transition or animation, to
  match the reference mechanism (MEASURED: no CSS transition on
  cursor transform).
- Arrow: a standard pointer arrow polygon (SPEC path, a filled
  arrowhead pointing up and left, roughly 20px tall, 16px wide at
  the head, with a short stem). Fill uses one palette color per
  chip, taken from the measured palette in section 1, with no two
  adjacent chips sharing a color.
- Label pill: SPEC dimensions anchored to the reference label
  scale (12px to 13px general label size): font 12px, line height
  1, padding 4px 8px, height about 22px, radius 10px, background
  the chip's palette color, text white, positioned to the right
  of the arrow tip with a 2px overlap so arrow and pill read as
  one object. For the rebuild, the pill text must be anonymous
  (no names, no roles) or the chip must be arrow-only; see the
  content flag in section 2 item 5.
- Contact cursor (separate, single element): same arrow-plus-pill
  construction, MEASURED entrance (fade and rise 10px over 0.6s)
  and MEASURED click behavior (scale 0.9 while clicking). It is
  not part of the hero drift system and must not share its loop.

### 3.2 Motion system (JavaScript-driven, one rAF loop)

- One requestAnimationFrame loop owns all hero chips. Each frame
  it writes each chip's transform directly. No CSS transition or
  animation touches chip transform at any time (MEASURED mechanism).
- Drift path (SPEC): each chip follows a closed parametric loop
  around its own anchor point inside the hero stage. Anchor points
  are spread across the stage margins (left, right, upper, lower),
  never covering the center of the giant word at rest, so the word
  stays readable. Loop radius (SPEC): 24px to 64px from the anchor,
  varying per chip. Loop duration (SPEC): 16 to 24 seconds per
  chip, each chip with a different duration and a different phase
  offset so chips never move in lockstep. Phase progression is
  linear (constant drift speed); there is no CSS easing on the
  loop itself.
- Scroll coupling (SPEC implementation of the MEASURED scroll
  driver): scroll progress through the hero (0 at hero top, 1 at
  hero bottom leaving the viewport) advances each loop's phase by
  up to one extra quarter loop. Scrolling therefore visibly moves
  the chips without ever teleporting them, and scrolling back
  reverses the offset. This keeps the reference's scroll-driven
  character while preserving the continuous loop the live
  observation shows.
- Entrance (SPEC): chips start hidden. After the hero entrance
  sequence completes (about 2.0 seconds after mount, matching the
  observed late pop), each chip fades in over 0.8s with the site
  ease-out cubic-bezier(0.22, 1, 0.36, 1), staggered 120ms per chip
  in anchor order. Opacity only; transform stays under rAF
  control from the first visible frame.
- Hover convergence (SPEC speed for an OBSERVED behavior): while
  the pointer hovers the giant word, each chip's target position
  lerps from its loop position toward a point on the word's edge
  nearest that chip, over about 0.9s with the site ease-out.
  Convergence is a position target inside the same rAF loop, not
  a CSS transition. On mouse out, targets return to loop positions
  over the same 0.9s. Simultaneously the selection frame hides
  (already implemented in the rebuild) and returns on mouse out.
  Convergence applies on fine pointers only; it never triggers
  from touch or keyboard focus.
- Click: hero chips have no click behavior (SPEC, matching the
  absence of observed click behavior). The contact cursor alone
  scales to 0.9 while clicking (MEASURED).

### 3.3 Responsive and reduced-motion rules (SPEC decisions)

- Fine pointers at 1024px and up: full system above.
- Below 1024px, or on no-hover devices: hero chips are not
  rendered at all. Rationale: the reference cursor behavior on
  touch is UNVERIFIED, chips would clutter the small hero stage,
  and convergence has no hover trigger there. The selection frame
  still renders (MEASURED: it survives on mobile).
- prefers-reduced-motion: hero chips are not rendered at all.
  Rationale: the reference reduced-motion rule for cursors is
  UNVERIFIED, chips carry no content, and hiding them loses
  nothing. The contact cursor, if rendered, must be static (no
  rise animation, no click scale) under reduced motion.
- Performance guard: chips are transform-only, will-change
  transform, and the rAF loop pauses when the hero leaves the
  viewport (IntersectionObserver gate) and when the tab is hidden.

### 3.4 Tuning checklist for the builder (against live screenshots)

- Chip count parameter (default 6, tunable 4 to 6) and anchor spread
  across the full stage, not clustered near the word.
- Arrow height (SPEC default 20px) and pill height (SPEC default
  22px) checked at 100 percent zoom: chips must read as small
  annotations, clearly subordinate to the giant word, never
  competing with it.
- Loop durations (SPEC 16 to 24 seconds) checked for the reference
  feel: slow, calm, continuous; if motion reads as busy, lengthen
  durations before shrinking amplitudes.
- Convergence checked by hovering the word: chips must glide to
  the word edge and glide back, never jump, and the frame must hide
  and return in sync.
- Reduced-motion and narrow-viewport checks: no chips rendered,
  hero still complete without them.

## 4. Sources

- docs/motion/02-onlines-visual-forensics.md sections 1, 2, 9, 11
  (hero frame and grid, scroll-driven cursor comment, contact
  cursor entrance and click scale, reduced-motion gap).
- research/03-onlines-layout.md sections 5 and 10 (hero sizes,
  frame fade 1000ms, carried custom-cursor claim, motion range
  0.4s to 1s).
- research/04-onlines-tipografi-warna.md sections 3.2 and 4
  (theme.json custom-figma- palette values, collage inventory,
  carried custom-cursor claim).
- Parent live-browser observation report, 24 Oct 2026 (hero
  entrance order, 6 drifting chips, whole-canvas looping drift,
  hover convergence and frame hide, default system cursor).
- Sibling deep docs: 02-hero-diorama.md (chip row and count
  caveat), 07-contact-collage.md (contact cursor row),
  09-gap-synthesis.md (anonymous-arrow recommendation and the
  custom-cursor override by live observation).
- Web search in this run: no reference asset URL and no new cursor
  measurement returned; no URL was guessed or constructed.
