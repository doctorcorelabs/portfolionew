# v8 reference mockups: why the reference hero feels alive, and the rules that bring that feel to our hero

Doc only, no site edits. This doc translates the reference hero mockup
language into implementable rules for our hero. It does not copy any
reference copy, client name, or marketing wording. All card words in
the examples below are Daivan's own recorded facts, and every honesty
rule from the v7 collage system still applies.

## 1. Diagnosis: why v7 reads flat and monotonous

V7 shipped 9 correct cards, but they all share one visual voice. That
is the monotony the user reported. Measured against Hero.tsx as
shipped in v7:

- Same material: every card is white, 1px solid #E0E0E0 border, 10px
  or 12px radius, one soft shadow (0 2px 8px to 0 8px 24px at low
  opacity). Nothing reads as an object made of a different material.
- Same angle: every card sits at 0 degrees. The reference never does
  this (section 3).
- Same size family: most cards are 220px to 250px wide. The eye finds
  no big anchor and no small accent.
- Same content type: text plus a simple flat SVG. Only one card is a
  photo, and it sits axis-aligned like the rest.
- No chrome: no window bar, no tabs, no URL pill, no notification
  bubble, no app icon. A flat card with text looks like a label; the
  same content inside a window frame looks like a tool someone uses.
- No overlap: v7 mandated 30px gaps between cards. The reference
  deliberately overlaps cards (fan, tilted collage), which is what
  creates depth. Gaps read as a shelf; overlap reads as a desk.
- One motion: every card floats translateY only, 9s to 16s, same
  8px amplitude. Float without tilt, pop, or shadow depth feels like
  wallpaper, not objects.

Conclusion: v8 is not "more cards". V8 is "same facts, more object
types". Each card gets one mockup type from section 4, one tilt, one
shadow depth, and one size tier. No new facts are needed.

## 2. What makes the reference hero mockups interesting

Evidence comes from docs/motion/02-onlines-visual-forensics.md (CSS
measured from the reference stylesheets) and the known reference hero
anatomy (floating app icons, browser windows, notification bubbles,
role-labeled cursor chips, laptop and phone photos). Traits, with the
mechanism that makes each one work:

### 2.1 Tilt: nothing sits square

- Portfolio fan cards settle at about -5.7 and +5.4 degrees, with the
  center card straight (forensics section 7). Contact collage cards
  sit at about -8 and -12 degrees, and a chat card at about +5 degrees
  (section 9).
- Mechanism: a small rotation breaks the grid. The eye reads a tilted
  card as a physical thing placed by hand, while a square card reads
  as layout. Tilt also creates varied negative space between cards,
  which is why a scattered hero never looks like a table.

### 2.2 Layered shadow and dimmed rear cards: depth without 3D

- Fan cards carry a soft shadow (0 8px 30px at 15 percent black).
  The two rearmost cards settle at opacity 0.5 and 0.35 (section 7),
  so the stack reads as front to back, not five equal tiles.
- Mechanism: shadow depth plus a dimmed rear layer tells the eye
  which card is on top. Flat design with one shadow everywhere has
  no front or back, so everything feels equally far away.

### 2.3 Browser chrome: a frame that says "tool", not "label"

- The reference hero and manifesto surround content with device
  mockups: a screen inside a frame, a drifting oversized texture
  behind it (section 4). Its floating elements include app icons and
  small windows, not bare text boxes.
- Mechanism: a top bar with three dots plus a URL pill or tab strip
  turns any rectangle into a window. The viewer instantly parses it
  as software, which is more interesting than a caption because it
  implies use. Chrome costs almost nothing: one 28px bar, three
  10px dots, one pill.

### 2.4 Notification bubbles: small, round, off-axis

- Comment bubbles near team cards start 12px down and rise into
  place (section 6). Contact app bubbles pop from scale 0.7 to 1
  (section 9). Bubbles are small, white, rounded, soft-shadowed, and
  sit at an angle to the card they annotate.
- Mechanism: a bubble is a second voice in the scene. It breaks the
  card rhythm because it is smaller, rounder, and offset from the
  grid. It also carries the shortest text, which the eye reads
  first.

### 2.5 Photos in tilted white frames: mixed media

- Contact collage photos sit in white frames with 1px grey borders
  and 8px radius, images at cover fit, rotated -8 and -12 degrees
  (section 9). Team cards are 90px photo squares with a tiny soft
  shadow and a mono role label (section 6).
- Mechanism: a photo is the only element with real texture. One
  photo among text cards lifts the whole scene; a photo in a tilted
  white frame reads as a snapshot pinned to a board, while the same
  photo axis-aligned reads as a thumbnail in a list.

### 2.6 Size variety: one anchor, several accents

- Fan sizes: center card 290px by 500px, side cards 188px by 356px
  (section 7). Team cards are 90px squares against a 96px title
  (section 6). The contact animation column is 525px wide against a
  266px watermark (section 9).
- Mechanism: contrast in size creates a reading order. Big elements
  anchor, small elements decorate. Nine similar widths create no
  order, so the eye skims past all of them equally.

### 2.7 Deliberate overlap: a desk, not a shelf

- The fan is five cards occupying one 477px by 500px area, edges
  crossing (section 7). The contact collage stacks tilted cards,
  bubbles, and a cursor around one watermark (section 9).
- Mechanism: overlap with a clear top card proves depth. It only
  works when one card is unambiguously on top (bigger shadow, full
  opacity) and the overlapped card still shows enough to be read.

### 2.8 Staggered overshoot entrances: objects arrive, text fades

- Fan cards enter over 0.8s with overshoot easing
  (cubic-bezier(0.34, 1.56, 0.64, 1)), staggered 0.15s per card,
  from offset and rotated positions (section 7). App bubbles pop
  from scale 0.7 to 1 over 0.55s opacity and 0.7s transform with the
  same overshoot curve (section 9). Team cards pop from scale 0.5
  (section 6).
- Mechanism: overshoot easing is reserved for physical objects only
  (forensics section 11). A card that pops slightly past its rest
  size then settles feels thrown onto the desk. Text must never use
  overshoot; only mockups, bubbles, and icons may.

### 2.9 Texture behind everything: dot field and halftone

- The dot field is two repeating radial-gradient layers, dots on a
  14px pitch, with a lit halo around the cursor (section 9). Service
  cards carry a halftone layer at 50 percent opacity in multiply
  blend mode (section 5).
- Mechanism: texture stops flat color areas from looking empty. Our
  hero already has the grid and the dot field in later sections;
  v8 does not need new texture, it needs the cards to stop
  competing with the grid by all being flat white. Tilt, shadow,
  and chrome do that job.

## 3. Design tokens v8 may use (and nothing else)

Palette stays monochrome plus the one blue, exactly as v7: ink
#010101, paper #FFFFFF, blue #0859D4, greys #E0E0E0, #98989C,
#4A4A4A, #F0F0F0, #F5F5F7. Gold #C9A227 stays restricted to award
dots only, as in v7. No brand colors, ever (section 7 explains why).

Fonts stay Inter Display for card text and JetBrains Mono for
microcopy, labels, URL pills, and bubble text. No new font.

## 4. The v8 mockup kit: six object types

Every collage card gets exactly one type. A card with two types
(for example a window that is also a bubble) reads as clutter.

### 4.1 Window (browser chrome)

Structure, top to bottom: a 28px bar in #F5F5F7 with three 10px
dots (left to right: #E0E0E0, #98989C, #0859D4), then a URL pill
(18px tall, white fill, 1px #E0E0E0 border, 9px mono text, one
topic word, for example "faers" or "review"), then the card body.
Optional tab strip under the bar: 2 to 4 tabs, 20px tall, active
tab white with a blue underline bar, inactive tabs grey text.
Body content is unchanged recorded fact, never fake data.

Window rules:

- Window chrome is decoration, not a claim that the pictured
  software exists. Every window card carries "Interface mockup" in
  10px mono at its foot, unless the card already carries
  "Illustrative schematic" for a diagram body.
- URL pill text is a topic word only, never a real domain, never a
  real path, never a login or account reference.
- Tab labels are stage words (Search, Screen, Extract, Synthesize)
  or topic words, never fake counts or fake results.
- Window shadow is mid depth (section 5.2). Window radius stays
  12px; the bar inherits the top radius.

### 4.2 Bubble (notification)

Structure: white card, 14px radius, mid shadow, one short line
(11px to 12px, ink or dark grey) plus a 20px avatar dot (solid blue
or solid grey circle, no face, no initials of any real person) at
the left. Optional second line in 9px mono grey. Width 160px to
220px, never wider than its parent card.

Bubble rules:

- Bubble text must be a recorded fact or a generic workflow label.
  Allowed examples: "ABST-000034 accepted", "Screening", "New
  thread: review". Never a fake message from a real person,
  institution, journal, or database. Never a fake sender name.
- A bubble always sits off-axis from its parent card (overlapping
  a corner by 12px to 24px, tilted opposite to the parent), never
  centered on it and never in a row with other bubbles.
- At most 2 bubbles in the whole hero. More bubbles turn the hero
  into a chat log.

### 4.3 Photo frame (tilted snapshot)

Structure: white frame, 8px radius, 1px #E0E0E0 border, 6px white
padding around the image (polaroid style), image at cover fit,
caption bar below in 9px mono grey. Caption always ends with the
honesty label (section 8).

Photo rules:

- Tilt -8 to -12 degrees for the main photo, +5 degrees for a
  second photo if one is added. Never beyond 12 degrees in either
  direction; beyond that, captions stop reading.
- Photos are research-related supplementary assets only: lab
  glassware, microscope slides, journal pages, a poster wall, a
  pipette bench. No people, no faces, no identifiable institution
  signage, no real lab claim. The existing /hero-lab.jpg stays;
  any new photo is AI-generated or stock and labeled the same way.
- At most 3 photo frames in the hero. Photos are the strongest
  texture; more than 3 drowns the word.
- Photo shadow is hero depth (section 5.2), the deepest in the
  collage, because photos sit on top of the stack.

### 4.4 Sticker (rotated badge)

Structure: small pill or rounded rectangle, solid blue fill with
white mono text, or white fill with 1px dashed #98989C border and
ink mono text. Height 22px to 28px, padding 6px 10px, mono uppercase
10px to 11px, letter-spacing 0.08em.

Sticker rules:

- Sticker text is a recorded short fact only: "N = 6,601",
  "ABST-000034", "29 AWARDS". Never a claim, never a verb, never a
  brand name.
- Tilt -4 to +4 degrees, always opposite to the card it sits on.
  A sticker on a -6 degree card tilts +3 degrees, and vice versa.
- A sticker overlaps its parent card corner by 8px to 16px and
  carries the strongest shadow for its size (hero depth scaled
  down: 0 4px 12px at 15 percent black).
- At most 3 stickers in the hero. Stickers are accents; a hero of
  stickers is a coupon sheet.

### 4.5 App icon (free-floating glyph tile)

Structure: 44px to 56px square, 12px radius, solid blue or solid
ink fill, one white abstract SVG glyph centered (flask, book,
nodes, funnel, chart bars). No text inside the tile. A 9px mono
label may sit below the tile, never inside it.

App icon rules:

- Glyphs are abstract shapes drawn for this site, never a brand
  glyph, never a database logo, never a journal mark.
- Icons float free in the gutters, never in a row and never in a
  grid. Two icons at different sizes (for example 56px and 44px)
  read better than four equal icons.
- Icon shadow is near depth (section 5.2). Icons are small, so a
  deep shadow looks like a hole.
- At most 3 icons in the hero.

### 4.6 Schematic (diagram card, kept from v7, upgraded)

Structure: unchanged v7 diagram body (docking pocket, gut-axis
chain, review funnel), but now with a tilt, a deeper shadow, and
optionally one sticker or one bubble attached.

Schematic rules:

- Tilt -6 to +6 degrees, one fixed angle per card, never animated.
- Every schematic keeps its honesty microcopy in 10px mono:
  "Illustrative schematic" for diagrams, "Method diagram, not
  data" for the review pipeline. A schematic without its microcopy
  fails review, as in v7.
- Schematic lines stay thin (1px to 1.5px), dashed where they show
  a relationship, solid where they show a structure. No axis, no
  scale, no numbers beyond the recorded facts the card already
  carries.

## 5. Composition rules (apply to every card)

### 5.1 Tilt assignments

- Allowed tilt range for cards: -6 to +6 degrees. Photo frames
  only: -12 to +5 degrees (section 4.3).
- Adjacent cards never share a tilt sign: a -5 degree card sits
  next to a +4 degree card, never next to another negative card.
  Alternation is what makes scatter read as placed, not random.
- Tilt lives on an OUTER wrapper. Float lives on an INNER wrapper.
  Never put tilt and float on the same element, or the float
  keyframes will overwrite the rotation. The v7 float wrapper
  becomes the inner wrapper; the builder adds one outer tilt
  wrapper per card.
- On the mobile stack (below 720px), tilt resets to 0 degrees.
  Tilted cards in a vertical stack waste horizontal space and clip
  captions. The stack is for reading, not for showing off.
- Under prefers-reduced-motion, tilts stay (they are static
  transforms, not motion) but entrance pops and floats are removed
  and cards render at rest immediately.

### 5.2 Shadow depths (static, never animated)

- Near: 0 2px 8px rgba(1, 1, 1, 0.06). Use for icons and small
  text cards.
- Mid: 0 8px 24px rgba(1, 1, 1, 0.10). Use for windows, bubbles,
  and schematic cards. This is the default.
- Hero: 0 16px 40px rgba(1, 1, 1, 0.15). Use for photo frames and
  the single top card of any overlap pair.
- Never animate box-shadow. Never add a hover lift or hover shadow
  change: the reference has no hover lift on its cards (forensics
  sections 5 and 7), and restraint here keeps the hero calm.

### 5.3 Size variety (three tiers, no neighbours alike)

- Small: 150px to 180px wide. Bubbles, icons with labels, stickers
  on cards, the helix motif.
- Medium: 220px to 260px wide. Most cards, as in v7.
- Large: 300px to 340px wide. Exactly one or two cards: the FAERS
  window and the photo frame are the natural anchors.
- Rule: no two neighbouring cards (sharing a band edge) may be in
  the same tier. A medium card next to a medium card is the v7
  monotony returning; break it with a small bubble or a large
  window beside it.

### 5.4 Overlap (deliberate, bounded)

- Overlap is allowed up to 24px: one card edge may cross a
  neighbouring card corner by at most 24px in either axis.
- The top card of an overlap pair is declared in code (z-index
  inside the collage layer: base 0, overlap top 1, photo top 2).
  The top card always has the deeper shadow and full opacity; the
  card underneath keeps full opacity too (no dimming below 1.0 in
  the hero, unlike the reference fan, because hero cards carry
  text that must stay readable).
- Overlap never covers word glyphs, never covers a fact pill box
  (keep the v7 40px pill clearance), and never covers a card's
  honesty microcopy or its headline line. If an overlap would
  cover microcopy, move the top card, not the microcopy.
- Overlap is desktop only. Below 1160px, the existing hide rules
  already thin the collage; below 720px the stack has zero
  overlap by construction.

### 5.5 Entrance (staggered overshoot pop, objects only)

- Each mockup enters with scale 0.7 to 1 over 0.55s to 0.7s, using
  overshoot cubic-bezier(0.34, 1.56, 0.64, 1), staggered 0.12s to
  0.15s per card, after the layer fade (v7: 0.8s fade at 2.2s delay).
- Entrance transform lives on the outer tilt wrapper, composed as
  rotate plus scale in one transform. Float lives on the inner
  wrapper and starts only after entrance completes (use
  animation-delay equal to entrance duration plus stagger).
- Text elements (word, label, pill text) never use overshoot.
  Under reduced motion, entrance is removed entirely: cards render
  at scale 1, tilt applied, no animation.
- Parallax stays exactly as v7: whole layer plus/minus 8px,
  mouse devices only, rAF-throttled, off on touch and reduced
  motion. Parallax moves the layer; it never moves single cards.

## 6. Mapping: each v7 card becomes one v8 mockup

| v7 card | v8 type | Tilt | Size tier | Notes |
| --- | --- | --- | --- | --- |
| FaersCard | Window (large anchor) | -3 deg | Large (300-320px) | Chrome bar plus URL pill "faers". Flow lines unchanged. One sticker "N = 6,601" is NOT added here because the figure already headlines the body; a duplicate sticker would repeat the same number twice. |
| DockingCard | Schematic plus sticker | +4 deg | Medium | Sticker "IN SILICO" in dashed-border style on the top corner. Body unchanged. |
| GutAxisCard | Schematic | -5 deg | Medium (230px, as fixed in v7) | No attachment; the chain is the visual. Keep the hide below 1400px rule. |
| ReviewCard | Window with tab strip | +3 deg | Medium | Tabs: Search, Screen, Extract, Synthesize. Funnel stays below the tabs. Microcopy "Method diagram, not data" stays at the foot. |
| PosterCard | Window plus bubble | -4 deg | Medium | Bubble "ABST-000034 accepted" overlapping the top-right corner at +3 deg. Body facts unchanged. |
| AwardsCard | Sticker cluster | +5 deg | Small-medium | Gold and blue medal dots stay; add one solid blue sticker "29 AWARDS" at -3 deg on the corner. No award names added. |
| StrokeCard | Window (phone-style frame) | +4 deg | Medium | Rounded 16px frame, chrome bar, FAST tiles, Observation Sheet line, honesty line "No score, no diagnosis" stays. This is an interface mockup, labeled as such. |
| PhotoCard | Photo frame | -8 deg | Large (220-240px frame) | Polaroid padding, caption "IN THE LAB" plus "Illustrative ambience". Hero shadow. This is the tilt anchor of the bottom band. |
| DnaHelix | Decorative motif | +3 deg | Small (100px, as fixed in v7) | Stays behind the top band, lowest z inside the layer. No text added. |

New elements allowed by this doc (not replacements):

- At most 2 app icons in the gutters (flask glyph near the docking
  card, book glyph near the review card), sizes 56px and 44px.
- At most 1 extra photo frame if the builder has a second honest
  research image (microscope slide or journal pages), tilted +5
  degrees, placed opposite the main photo frame. If no second image
  is honestly available, ship with one photo; never stretch one
  image into two frames by cropping it twice.

## 7. Database strip: the requested PubMed, Elsevier, Scopus, ScienceDirect element, in compliant form

The user asked for these four names in the hero. They may appear,
but only in the form below. Any other form risks implying something
untrue, so the builder must not improvise around it.

### 7.1 What the strip is

One single wide bar, not four scattered logos. Placement: bottom
edge of the hero, below the collage bands, full content width,
or as the foot of the mobile stack (section 9). The bar is white,
1px #E0E0E0 border, 10px radius, 12px vertical padding. Inside,
the four names sit in one row in JetBrains Mono, 11px, grey
#4A4A4A, separated by 24px gaps and small blue square bullets
(4px). Above the names, a 9px mono label reads "LITERATURE
DATABASES". Below the names, a 9px mono microcopy line reads
"Reference only, not an affiliation or endorsement."

### 7.2 Hard rules for the strip

- Names are PLAIN TEXT wordmarks set in JetBrains Mono. Never
  download, trace, or embed any brand logo artwork, and never use
  any brand color. The reference logo wall treatment is the model
  here: one color, no brand colors, no boxes, no captions per mark
  (forensics section 8). Our strip adds one shared label and one
  shared microcopy line, which the reference wall does not need
  because it shows no third-party names as topics.
- Never claim indexing, affiliation, partnership, or endorsement.
  Banned phrasings anywhere near the strip, on the hero, or in
  docs describing it: "indexed in", "published in", "featured in",
  "as seen in", "partner", "in collaboration with", "approved by".
  No checkmark, badge, star, or seal next to any name. No name
  sits adjacent to a publication claim (for example, never place
  the strip directly under the poster card in a way that reads as
  "this poster is indexed here").
- Never imply Daivan's own papers are in any of these databases.
  The strip is a topic bar about the literature landscape that
  systematic review work moves through. It is not a credential.
  The microcopy line in 7.1 is mandatory, not optional, and must
  stay visible at every breakpoint.
- Never add a fifth name, a journal name, or a publisher slogan.
  The four names are the complete set the user requested.
- If a future builder wants real logo artwork instead of text
  wordmarks, that is a separate trademark and permission check,
  not a v8 build decision. This doc does not authorize it.

### 7.3 Why text wordmarks, not logos

Three reasons, in order: first, brand artwork carries brand colors
that break the monochrome plus one blue system; second, artwork
implies a relationship that text with an explicit disclaimer does
not; third, text wordmarks cannot be mistaken for screenshots of
real database pages, while a copied logo lockup easily can. If
the user dislikes the text treatment on sight, the fallback is to
remove the strip, not to upgrade it to artwork without the check
in 7.2.

## 8. Honesty microcopy rules (v7 rules, extended to mockups)

- Every window: "Interface mockup" at the foot in 10px mono,
  unless the body is a diagram, in which case "Illustrative
  schematic" or "Method diagram, not data" applies instead. One
  label per card, never two.
- Every schematic: "Illustrative schematic" (diagrams) or "Method
  diagram, not data" (review pipeline), 10px mono, always visible,
  never covered by an overlap (section 5.4).
- Every photo: caption ends with "Illustrative ambience", and alt
  text says the same. Never a real lab, never a real workplace,
  never a real event.
- Every bubble: text is a recorded fact or a generic workflow
  label (section 4.2). No fake sender, no fake institution.
- Database strip: "Reference only, not an affiliation or
  endorsement." (section 7.1). Mandatory at all breakpoints.
- FAERS homepage rule, unchanged: the hero may show only N =
  6,601 and the 7,519 to 6,601 flow, with hypothesis-generating
  framing. Never any effect value, confidence interval, p-value,
  or event-case count. The FAERS window shows the flow, not a
  plot, and its URL pill says "faers", never a drug or outcome
  name with a number.
- StrokeSense rule, unchanged: education-first only, Observation
  Sheet, No score, No diagnosis. The phone-style frame must never
  say the tool detects, scores, classifies, or diagnoses.
- No invented numbers anywhere. The allowed hero numbers remain
  the v7 set: 6,601 and 7,519 (FAERS), 29 and 12 (awards
  aggregates), 2025 and 2023 (award years, if shown), 2026 and
  ABST-000034 (Seoul). Mockup chrome, tabs, bubbles, stickers,
  and icons add zero numbers.
- No reference copy, no reference client names, no Spanish text.
  The concept (scattered mockups around one giant word) is the
  reference language; its words are not copied.

## 9. Breakpoints: what survives where

- Desktop (above 1400px): full scatter, all tilts, all overlaps,
  strip at the hero foot, icons visible.
- Mid (1160px and below): existing hide-mid rules thin the
  collage (helix, awards hide); gut axis already hides below
  1400px; review hides below 1000px. Surviving cards keep their
  tilt and shadow. Overlap pairs where one card hid resolve
  themselves; the builder must not reintroduce overlap by moving
  a surviving card into a hidden card's slot.
- Narrow desktop (720px to 1160px): strip stays, but names wrap
  to two lines (two names per line), label and microcopy stay on
  their own lines, never wrapped into the name row.
- Mobile (below 720px): collage stacks statically below the word
  as in v7 (FaersCard window, then PhotoCard frame), tilts reset
  to 0, floats off, overlap zero. The database strip stacks last,
  full width, names in a 2 by 2 arrangement, label above,
  microcopy below, both fully visible. No other card, bubble,
  icon, or sticker appears on mobile: the stack is already the
  hero's second screen, and more mockups would bury the word.

## 10. What the builder must NOT do

- No tilt beyond 12 degrees anywhere, no tilt on the word or the
  frame itself (the selection frame is the stable anchor; tilting
  it breaks the drag metaphor).
- No hover lift, hover shadow change, or hover scale on any card
  (reference restraint, forensics sections 5 and 7).
- No animated shadows, no animated widths, no layout properties
  in any loop. Float and entrance use transform and opacity only.
- No new colors, no gradients on cards (service-card gradients
  were rejected in v4; flat blue plus halftone is the only blue
  texture allowed, and it belongs to Services, not to hero cards).
- No fake browser content: no fake search results, no fake result
  counts, no fake messages, no fake user names, no fake timestamps
  that imply a real event.
- No second photo made by re-cropping the first photo. No stock
  photo of a person presented as Daivan or as a collaborator.
- No em dash anywhere, in the doc or in card copy. Use a hyphen
  or reword. This doc follows that rule.
- No moving any existing anchor to make room: cursor chip anchors,
  fact pill positions, frame geometry, and the word itself stay
  exactly as shipped in v7. Mockups fit around them; they do not
  push them.

## 11. Verification checklist for the v8 QA agents

- Each card has exactly one mockup type from section 4, one tilt
  from section 5.1, one shadow from section 5.2, one size tier
  from section 5.3. Neighbouring cards differ in tier and tilt
  sign.
- Tilt wrapper (outer) and float wrapper (inner) are separate
  elements on every card; no element carries both rotate and the
  float keyframes.
- Overlap pairs measure at most 24px, top card declared, microcopy
  uncovered, pill clearance 40px kept, word glyphs uncovered.
- Entrance uses overshoot only on mockups, stagger 0.12s to 0.15s,
  removed under reduced motion with cards at rest.
- Window URL pills contain topic words only; tab labels contain
  stage or topic words only; bubble text traces to a recorded fact
  or a generic workflow label.
- Database strip: plain text wordmarks, one shared label, one
  mandatory microcopy line, no banned phrasing in code, copy, or
  comments near the strip, no fifth name, no brand artwork file
  in public/ or src/.
- Honesty labels present on every window, schematic, photo, and
  the strip. FAERS numbers limited to 6,601 and 7,519. StrokeSense
  language education-first only.
- Mobile stack: FaersCard window, PhotoCard frame, database strip
  last; tilts 0, floats off, overlap zero, strip microcopy
  visible.
- Greps: em dash 0 across the doc and all touched files; no
  reference copy; no invented numbers; no brand color hex values
  outside the allowed palette (gold #C9A227 only on award dots).
