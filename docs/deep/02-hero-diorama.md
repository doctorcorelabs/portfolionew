# 02 - Hero Diorama: Floating Canvas Inventory and Sparse-Equivalent Spec

Deep analysis 2/15. READ-ONLY toward the site: this document is the
only file this task creates, and no site file was edited.

## 0. Method and Evidence Key

Sources used for this document, 24 Oct 2026:

- `docs/motion/02-onlines-visual-forensics.md` (production CSS
  measurements for the hero frame, grid, and cursor behavior).
- `research/03-onlines-layout.md` (hero stage, type scale, breakpoints,
  container width, all measured from production CSS).
- `research/05-onlines-interaksi-motion.md` (motion discipline: slow
  0.4s to 1s range, transform and opacity only, no heavy parallax).
- A fresh homepage text fetch for this task. It confirms the hero
  carries no readable floating-item text: the floating items are
  images and icons, so text extraction cannot inventory them. Their
  inventory below therefore rests on the parent agent's live-browser
  observation (screenshots during reloads, slow scrolling, and
  hovers), cited as OBSERVED, plus the CSS facts in doc 02.
- A web search for the hero stylesheet returned no usable asset URL,
  and no stylesheet URL was guessed. Anything that would need the
  hero JavaScript or a pixel measurement is marked UNVERIFIED.

Evidence labels:

- VERIFIED (CSS): present in a production stylesheet fetched by a
  prior task and quoted in doc 02 or research/03.
- OBSERVED (live): seen in live-browser screenshots by the parent
  agent. Zones and order are approximate, not pixel measurements.
- UNVERIFIED: could not be confirmed from CSS, text, or screenshots.
  No value is invented to fill these cells.

Deliberate limits: this document describes items functionally only.
It reproduces no headline wording, no pill or label wording, no
product or brand names, and no client names. Measurements are the
only quoted values.

## 1. The Stage the Diorama Sits On

VERIFIED (CSS), from doc 02 and research/03:

- Stage: white background, min-height 550px, height
  calc(100dvh - 100px). Content container max width 1160px.
- Anchor: one giant word, 700 weight sans, 180px size, 95px line
  height, -1.8px tracking, forced to one line, absolutely centered.
  Below 1023px it drops to 64px size with 64px line height, the
  stage height becomes auto with a 400px minimum, and the frame
  becomes 80 percent wide and 100px tall.
- Selection frame: 727px by 189px, 1px dashed border in
  rgba(18, 18, 19, 0.2), six 10px square handles (four corners plus
  top-center and bottom-center), white fill, grey border, offset
  -5px so each handle straddles the border. It fades in over 1000ms
  ease-in-out, is pointer-dead until a selected class lands, then
  carries a move cursor and can be dragged. The word itself has
  user-select none and touch-action none while draggable.
- Grid: covers the whole hero at z-index 0 behind the word, 40px
  pitch, 1px lines at 3 percent black, one-time fade to full opacity
  over 0.8s ease-out when a started class is added. No scroll-linked
  grid rule exists in the fetched stylesheet.
- Header overlay: a wordmark at top-left and a fixed pill call to
  action at top-right aligned to the container edge. The wordmark
  fades or slides out on scroll while the pill stays pinned
  (OBSERVED live; the exact header rule is UNVERIFIED from CSS).

What this means: the diorama is not a background image. It is a
layered canvas with at least four depths: grid (back), floating
items (middle), giant word plus frame (front-center), header overlay
(front-top). The word is the only element that must stay readable;
everything else is set dressing that must never cover it.

## 2. Inventory Table: Every Floating Item Type

Position zones are quadrants of the full viewport stage, not pixel
coordinates: exact coordinates are UNVERIFIED. "Around the word"
means in the gutters and margins outside the centered 1160px
container, plus the near margins inside it. Sizes are qualitative
because no floating-item stylesheet was recovered: exact pixel sizes
are UNVERIFIED for every row except where a CSS value is quoted.

| Item | Size | Position zone | Entrance | Ambient motion | Source / confidence |
|---|---|---|---|---|---|
| Design-tool icon chips (small square app icons, several distinct tools) | Icon scale, clearly smaller than the word; exact px UNVERIFIED | Scattered around the word, mostly upper and side margins | Pop in with stagger, late in the load sequence, after the word and grid | None detected in still frames; continuous bob or float UNVERIFIED | OBSERVED (live) for presence and stagger; size and exact spots UNVERIFIED |
| Wireframe layout cards (small white cards carrying grey wireframe bars and blocks) | Small card scale, wider than tall; exact px UNVERIFIED | Side margins, left and right of the word | Pop in with stagger, late in the sequence | None detected in still frames; drift UNVERIFIED | OBSERVED (live) |
| Device photo card (a photo of a laptop on a desk, framed as a card) | Largest floating item, still subordinate to the giant word; exact px UNVERIFIED | One side margin, mid to lower height | Pop in with stagger, late in the sequence | None detected in still frames | OBSERVED (live) |
| Poster or mural card (tall card with a short headline and an image) | Tall card scale; exact px UNVERIFIED | One side margin, opposite the device photo card | Pop in with stagger, late in the sequence | None detected in still frames | OBSERVED (live) |
| Phone mockup card (small device mockup showing an image) | Small card scale; exact px UNVERIFIED | Lower side margin | Pop in with stagger, late in the sequence | None detected in still frames | OBSERVED (live) |
| Code snippet card (small card carrying lines of code) | Small card scale; exact px UNVERIFIED | Near the word, side margin | Pop in with stagger, late in the sequence | None detected in still frames | OBSERVED (live) |
| Toggle pill (small pill-shaped toggle control) | Pill scale, smaller than the cards; exact px UNVERIFIED | Near the word | Pop in with stagger, late in the sequence | State change on interaction UNVERIFIED; no continuous motion detected | OBSERVED (live) |
| Notification pills (small pills with a dot plus short status text) | Pill scale; exact px UNVERIFIED | Scattered, upper and side margins | Pop in with stagger, late in the sequence | None detected in still frames | OBSERVED (live) |
| Role-labeled collaborator cursor chips (colored arrow plus a short role label, several distinct colors and roles) | Small chip scale; exact px UNVERIFIED | Drifting across the whole canvas, passing near the word | Present once the hero settles; individual pop timing UNVERIFIED | Continuous slow looping drift, independent of the mouse; scroll-driven frame by frame with no CSS transition on transform (stylesheet comment, doc 02); on word hover the chips converge toward the word, and return on mouse out (OBSERVED live) | OBSERVED (live) for drift and converge; scroll-driven mechanism VERIFIED (CSS comment) |
| Faint grid layer (full-stage graph paper) | Full stage, 40px pitch, 1px lines at 3 percent black | Whole stage, z-index 0, behind everything | One-time fade over 0.8s ease-out | No scroll-linked motion in CSS; pinned behavior while the next section scrolls over it is OBSERVED live, mechanism UNVERIFIED (see section 3) | VERIFIED (CSS) for fade and pitch; pinned behavior OBSERVED (live) |
| Selection frame plus word (the anchor, not a floating item) | Frame 727px by 189px desktop, 80 percent by 100px mobile; word 180px desktop, 64px mobile | Centered in the stage | Word first, then grid fade, then frame fade 1000ms, then handles stagger; whole load sequence about 2 to 3s, ease-out feel | Draggable on fine pointers after activation (move cursor, clamped to stage in the rebuild); hover on the word hides the frame and returns on mouse out (OBSERVED live; the rebuild already implements both) | VERIFIED (CSS) for sizes and fade; OBSERVED (live) for sequence and hover |

Count note: the live observation lists roughly a dozen floating
elements (icons, cards, pills, chips). The table groups them into
nine item types because several icons and pills repeat the same type.
The exact element count is UNVERIFIED: still frames cannot prove
whether a repeated icon is one element or several.

## 3. Entrance Order and Stagger (What Is Known)

OBSERVED (live) order on reload, with CSS durations where measured:

1. Blank stage.
2. Giant word appears first.
3. Header wordmark draws in at top-left.
4. Faint grid fades in (VERIFIED CSS: 0.8s ease-out).
5. Floating canvas items pop in with stagger (per-item order
   UNVERIFIED; the stagger itself is OBSERVED).
6. Selection frame fades in (VERIFIED CSS: 1000ms ease-in-out),
   then its six handles appear.

Total load sequence: about 2 to 3 seconds, smooth ease-out feel,
no bounce or high-velocity motion (OBSERVED live). This matches the
site-wide discipline in research/05: motion is slow (0.4s to 1s),
uses transform and opacity only, and never chains decorative
animations.

What is NOT known: the per-item stagger step for floating items
(UNVERIFIED), whether the pop uses scale, fade, or both per item
(UNVERIFIED), and whether any floating item animates again after
load (no second animation detected in still frames).

## 4. Ambient Motion: Only Two Things Actually Move

- Collaborator cursor chips: continuous slow looping drift,
  independent of the mouse, plus scroll-driven frame-by-frame
  movement with no CSS transition on transform (stylesheet comment).
  On word hover they converge toward the word; on mouse out they
  resume drifting. This is the only verified continuous ambient
  motion in the hero.
- Everything else: no continuous motion detected. Tool icons,
  wireframe cards, photo cards, pills, and the grid show no bob,
  float, spin, or shimmer in still frames. Any claim that they float
  would be invented; their life comes from the entrance pop and from
  the drifting cursors passing among them, not from their own motion.

Mouse and scroll behavior, separated honestly:

- Mouse: word hover hides the frame and converges the cursors
  (OBSERVED live). No floating item showed a hover change in still
  frames; hover lift, zoom, or overlay on floating items is
  UNVERIFIED, and the site-wide CSS recovered elsewhere shows no
  card lift or image zoom on hover, so none should be assumed.
- Scroll: cursors are scroll-driven frame by frame (stylesheet
  comment). The grid shows no scroll-linked rule in CSS, yet live
  screenshots show the grid canvas staying pinned while the next
  section scrolls up over it, a sticky or parallax feel. The
  mechanism (sticky positioning of a canvas layer, a fixed
  background, or a scroll-driven transform) is UNVERIFIED. The
  rebuild must not claim a mechanism it has not measured.

## 5. Decorative Versus Interactive

| Item | Role | Evidence |
|---|---|---|
| Selection frame plus word | Interactive: draggable on fine pointers after activation; hover on the word hides the frame | VERIFIED (CSS) for drag states; OBSERVED (live) for hover hide |
| Header pill call to action | Interactive: fixed, stays visible on scroll | VERIFIED (CSS) for fixed placement; OBSERVED (live) for pinned behavior |
| Toggle pill | Presumed decorative in the hero context; no toggle behavior was observed or tested | UNVERIFIED: do not build it as a working control without a behavior spec |
| All other floating items (icons, wireframe cards, photo cards, poster card, phone mockup, code card, notification pills) | Decorative: no click, link, or hover change observed | OBSERVED (live) still frames; interaction UNVERIFIED |
| Collaborator cursor chips | Decorative: they drift and converge, but no click behavior was observed; they depict other people, which is a content claim, not just a shape | OBSERVED (live) |
| Grid layer | Decorative: one-time fade, no interaction | VERIFIED (CSS) |

The key judgment: the reference hero feels alive through exactly
two interactive facts (a draggable frame, a pinned call to action)
plus one ambient fact (drifting cursors). The dozen floating items
contribute almost nothing by themselves; they are static set
dressing that the cursors move through. A rebuild that adds many
floating items but skips drag and drift will still feel dead, while
a rebuild with few items plus real drag and one slow ambient motion
will feel closer.

## 6. Implementation-Ready Spec: A Sparser Equivalent (4 Items Max)

Goal: keep the design-canvas feel on a research portfolio without
faking a team, faking tools, or covering the word. Hard cap: four
floating items, desktop wide screens only (see rule 6 below). All
four use only verified facts about the owner's own work; nothing
implies a collaborator, a client, or a tool the owner does not use.

Shared rules for all four items:

1. Layering: grid z-index 0, floating items z-index 1, word plus
   frame z-index 2. Items never overlap the word on any viewport
   where they render.
2. Entrance: items pop in after the word and grid, inside the
   existing hero sequence, at delays 1.50s, 1.65s, 1.80s, and 1.95s,
   each 0.35s, ease-out cubic-bezier(0.22, 1, 0.36, 1), fade plus a
   10px rise. No bounce, no overshoot on these items.
3. Ambient motion: none. Items are static after entrance. The only
   continuous motion in the hero stays the draggable frame (user
   driven) plus the existing grid fade. No fake drifting cursors.
4. Hover: no lift, no scale, no shadow change (matching the
   reference's restrained hover). The one linked item (item 1) gets
   only a blue underline draw on its caption on hover or focus.
5. Pointer events: decorative items get pointer-events none so they
   never block dragging the frame or selecting page text. The
   linked item gets pointer-events auto on its caption link only.
6. Visibility: items render only at viewport width 1432px and above
   (the reference's large breakpoint from research/03), where side
   gutters are wide enough to hold them without crowding the word.
   Below that width they are removed entirely, not shrunk, so the
   hero stays readable and the word keeps its wrap behavior.
7. Accessibility: every floating item is aria-hidden except the
   linked item's caption link. Under prefers-reduced-motion all four
   render fully visible with no entrance animation, and none moves.
   Under no-hover devices the items still render (they are static),
   but the frame drag stays gated to fine pointers as today.

Item 1: mini forest-plot card (the research anchor).

- Content: a small white card titled only with a mono figure label
  and three tiny confidence-interval rows (dot plus horizontal bar
  plus a vertical reference line), drawn from the already verified
  plot data. No numbers on the card itself; the card is a visual
  echo of the plot, not a second copy of it.
- Size: about 280px wide by 180px tall, 1px hairline border, 8px
  radius, soft shadow at 15 percent black (matching the reference
  card shadow language).
- Position: right gutter, vertically centered on the word, right
  edge inset about 48px from the stage edge.
- Behavior: the caption link goes to the existing research detail
  page for the plot study. Entrance delay 1.50s.

Item 2: figure annotation card (the methods anchor).

- Content: a small dashed-border card in the selection-frame
  language (1px dashed, 20 percent ink) carrying a mono figure label
  and three short method steps as plain text rows (question, data,
  tool). The steps repeat the owner's published method wording
  only; no new method claim is introduced.
- Size: about 240px wide by 150px tall.
- Position: left gutter, vertically centered on the word, left
  edge inset about 48px from the stage edge.
- Behavior: decorative, pointer-events none, aria-hidden.
  Entrance delay 1.65s.

Item 3: verified-fact pill (the evidence anchor).

- Content: one mono pill (hairline border, white fill, ink text)
  carrying a single verified anchor fact from the owner's record
  (for example a poster code or a total sample size already
  published on the site). The pill must reuse a fact already
  present on the site; it must not introduce a new number.
- Size: pill height about 32px, width set by its text, 999px
  radius.
- Position: left gutter, above item 2 by about 40px, or right
  gutter above item 1 if the left gutter is crowded; pick one side
  at build time and keep it fixed.
- Behavior: decorative, pointer-events none, aria-hidden.
  Entrance delay 1.80s.

Item 4: reading-progress or section marker (the orientation anchor).

- Content: a small vertical mono marker at the stage edge showing
  the current section label and a thin progress hairline that
  fills as the visitor scrolls the page. Unlike the reference's
  fake cursors, this marks the visitor's own position, so it makes
  no claim about other people.
- Size: about 120px tall by 24px wide, fixed to the right stage
  edge, vertically centered.
- Position: right stage edge, outside item 1 if both share a side;
  if they collide, drop this item first (it is the lowest
  priority of the four).
- Behavior: the fill updates on scroll with transform scaleY only
  (compositor-safe). Under prefers-reduced-motion it renders as a
  static label with no fill animation. Entrance delay 1.95s.
  Priority: optional. If the build gets crowded, ship items 1 to 3
  only.

Explicitly excluded from the spec, with reasons:

- Fake collaborator cursors: they depict other people being
  present. A one-person research portfolio must not imply a live
  team. The ambient-motion slot they filled is intentionally left
  empty; stillness here is honest.
- Tool icon chips naming products: they imply endorsements or a
  toolchain the page does not document. The forest-plot card and
  the methods card carry the same "working canvas" signal with
  the owner's own content.
- Any floating photograph of people, offices, or clients: no such
  asset is verified for this portfolio, and a stock substitute
  would misrepresent the work.
- Scroll-lock during intro, nowrap trapping of the giant word, and
  a custom cursor: all excluded by the standing accessibility
  decisions for this rebuild, unchanged by this analysis.

## 7. What Changes in the Current Hero (Delta List)

Current v2 hero already has: stage, grid, mono label, giant word,
draggable dashed frame with six handles, entrance sequence to
about 2.05s, word-hover frame hide, reduced-motion handling. The
spec above adds, in priority order:

1. Item 1 (forest-plot card) and item 2 (methods card) in the side
   gutters at 1432px and above, entrance delays 1.50s and 1.65s.
2. Item 3 (verified-fact pill) at 1.80s.
3. Item 4 (scroll marker) at 1.95s, droppable on collision.
4. No change to the word, frame, grid, label, drag, or entrance
   timings already shipped. The floating items extend the existing
   sequence; they do not restart or re-time it.

## 8. Open Questions for the Parent Agent

1. Sticky grid mechanism: is the pinned grid a sticky canvas layer,
   a fixed background, or a scroll-driven transform? Needs a live
   measurement before it is built; the spec above does not include
   it.
2. Exact floating-item coordinates on the reference: UNVERIFIED.
   The spec uses gutter zones instead of copied coordinates, which
   is the honest substitute.
3. Whether item 1's caption link is wanted: the spec assumes yes
   (it is the only interactive floating item). If the parent
   prefers a fully decorative hero, make item 1 pointer-events
   none as well.
4. Whether the scroll marker (item 4) is wanted at all, given the
   header already carries a fixed call to action. Dropping it
   leaves a clean three-item hero.

## 9. Sources

- `docs/motion/02-onlines-visual-forensics.md` (hero frame, grid,
  cursor, dot-field, and collage measurements).
- `research/03-onlines-layout.md` (stage, type scale, breakpoints,
  container, rhythm).
- `research/05-onlines-interaksi-motion.md` (slow motion discipline,
  transform and opacity only, no heavy parallax).
- Fresh homepage text fetch, 24 Oct 2026 (confirms floating items
  carry no extractable text; no stylesheet URL recovered, none
  guessed).
- Parent agent's live-browser observation of the reference homepage
  (entrance order, floating-item types, drifting and converging
  cursors, pinned grid feel, static logo row, default system
  cursor). Cited as OBSERVED (live) throughout.
