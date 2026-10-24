# 02 - Visual Forensics: Reference Homepage (Beyond Motion)

Task 2/15, motion track. READ-ONLY toward the site: this document is the
only file this task creates, and no site file was edited.

## 0. Method and Evidence Key

Sources fetched for this document on 24 Oct 2026:

- Homepage text fetch (structure and section order only; it does not
  render CSS or JavaScript).
- Production stylesheets of the reference theme, fetched directly:
  home-hero, home-quote-block, home-servicios, card-servicio,
  home-bloque-dark-mode, home-portfolio, home-equipo, home-contacto,
  patron-puntos. The theme root stylesheet contains only a header
  comment, so header rules were not recovered from it.
- Prior internal research docs 03 (layout), 04 (type and color), and 05
  (interaction and motion) for values already measured from the same
  stylesheets.

Evidence labels used in this document:

- VERIFIED (CSS): the rule is present in a stylesheet fetched for this
  task. Values are quoted as measurements, not as style to copy.
- VERIFIED (text): the element exists in the homepage text fetch.
- UNVERIFIED: the behavior needs JavaScript or a live rendered page and
  could not be confirmed from fetched CSS or text. No live browser was
  available to this task, so every runtime trigger below that depends on
  JavaScript is marked this way even when its CSS classes are known.

Deliberate limits of this document: it describes elements functionally
only. It does not reproduce the reference site's headline wording,
marketing copy, client names, or logos. Measurements (sizes, durations,
colors) are the only quoted values, because those are what a rebuild
needs and they are not creative copy.

## 1. Hero Selection Box: Draggable, Not Decorative

VERIFIED (CSS), from the hero stylesheet:

- The hero stage is white, min-height 550px, height
  calc(100dvh - 100px). The giant word sits absolutely centered, set in
  a 700 weight sans at 180px with a 95px line height and -1.8px tracking,
  forced to one line (nowrap). The tight line height is part of the look:
  the glyphs sit denser than the font size suggests.
- Around the word sits a selection frame: 727px by 189px, 1px dashed
  border in rgba(18, 18, 19, 0.2), with six 10px square handles (four
  corners plus top-center and bottom-center), white fill, same grey
  border, offset -5px so each handle straddles the border.
- Behavior, from the class states:
  - The frame starts at opacity 0 with a 1000ms ease-in-out fade. It
    becomes interactive only when a selected class is added: before
    that it has pointer-events none, after that pointer-events auto.
  - The cursor is `move` on the frame and on the word when a draggable
    class is present. The word itself has user-select none and
    touch-action none, so dragging it never selects text.
  - No :hover rule for the frame exists in the fetched stylesheet. Hover
    alone does nothing visible; the frame is a drag affordance, not a
    hover effect.
- UNVERIFIED: the exact JavaScript trigger that adds the selected and
  draggable classes (first click, first drag attempt, or a timed intro),
  the drag bounds, and whether the word can be dropped anywhere or snaps
  back. The stylesheet proves draggability is real; it does not prove
  the trigger.
- The same selection-box language repeats on the dark manifesto block:
  a dashed frame with 10px handles around the section title, and its
  title becomes draggable only on desktop (a code comment states drag is
  enabled by JavaScript only at 1024px and above). While a title is
  draggable there, a translucent blue dashed drop zone appears behind
  it. That reuse is the key insight: the selection box is a site-wide
  visual system, not a one-off hero decoration.
- Mobile (1023px and below): the word drops to 64px with a 64px line
  height, and the frame becomes 80 percent wide and 100px tall. The
  frame survives on mobile; it does not disappear.

What this means for the rebuild: a static dashed box, which is what v2
currently renders, reads as a picture of the reference. The reference
feels alive because the box is an object the visitor can grab. If drag
is out of scope for the rebuild, the honest substitute is a frame that
at least fades in on load and reacts to focus or keyboard, not a frame
that simply sits there.

## 2. Faint Grid Background: A One-Time Fade, Not a Scroll Effect

VERIFIED (CSS), from the hero stylesheet and its editor variant:

- The grid layer covers the whole hero, sits at z-index 0 behind the
  word, starts at opacity 0, and fades to opacity 1 over 0.8s with an
  ease-out curve when a started class is added. The editor variant of
  the same grid draws 1px lines at 3 percent black on a 40px pitch.
- In the dark theme variant, the grid lines switch to white at 8
  percent opacity, and the lit variant to white at 5 percent. The grid
  border color change in dark mode is deliberately instant, not
  animated: a code comment explains that animating roughly 500 grid
  cells at once would stall the theme toggle.
- No scroll-linked rule for the grid exists in the fetched stylesheet.
  The grid does not parallax, stretch, or redraw on scroll as far as CSS
  can show. UNVERIFIED: whether JavaScript moves the grid or the
  floating collage elements with scroll. A code comment in the hero
  stylesheet does say the floating collaborator cursors are
  scroll-driven frame by frame through requestAnimationFrame, with no
  CSS transition on their transform (a transition on top would make
  them lag). So scroll does move things in the hero, but the grid
  itself is not one of the things CSS proves to move.
- Separate scroll fact, VERIFIED (CSS): while the hero intro runs, the
  page can carry a scroll-lock class that sets overflow hidden,
  overscroll-behavior none, and touch-action none on html and body.
  UNVERIFIED: what releases the lock (intro completion, first scroll
  attempt, or a timer). For the rebuild this lock should NOT be copied:
  it is listed in the standing research as an accessibility cost, and
  the rebuild already decided against it.

## 3. Quote Block: Pinned Word-by-Word Paint Over a Long Scroll

VERIFIED (CSS), from the quote-block stylesheet. This is the single
largest behavioral difference from a normal editorial page, and it is
entirely structural:

- The block is deliberately taller than one viewport: its height is
  100svh plus a 1875px scroll distance plus 240px of separation padding
  (120px top and bottom). On mobile the scroll distance drops to
  1125px and the padding to 70px.
- Inside it, a sticky child pins the content to the top of the viewport
  at full viewport height while the visitor scrolls through that extra
  distance. The headline stays put; the scroll travel is spent on the
  headline itself.
- During the pinned phase, every word of the headline starts in a pale
  grey with a light outline stroke, and words flip one by one to full
  ink as the scroll position advances (a revealed class per word, color
  transition 0.35s). The subtitle sits below at 36px and does not take
  part in the paint.
- Behind the pinned text sits the shared dot pattern (section 9): a
  field of dots with a cursor-following reveal mask and a lit halo.
- UNVERIFIED: the exact scroll-to-word mapping (linear per word, eased,
  or grouped by line) and whether the paint reverses when scrolling back
  up. CSS proves the pinned structure and the two word states; the
  mapping lives in JavaScript.

## 4. Dark Mid-Page Sections: Theme Crossfade, Not Scroll Reveals

There are two different dark behaviors, and confusing them is a mistake:

- (a) Site-wide theme toggle. VERIFIED (CSS): nearly every section
  carries `transition: background-color 0.8s cubic-bezier(0.4, 0, 0.2, 1)`
  plus a matching 0.8s color transition on titles, descriptions, and
  borders. Toggling a dark class on body crossfades the whole page:
  section backgrounds go to near-black, cards to a dark grey, text to
  white, dashed borders to white at 20 percent, and frosted bubbles to
  a dark translucent fill. Elements with backdrop blur are exempted
  during the switch (a switching class removes their blur) because
  re-blurring every frame would stall the toggle. This is a slow,
  deliberate, whole-page fade, not a per-section entrance.
- (b) The dark manifesto block itself. VERIFIED (CSS): in light mode
  the section background is a very pale pink-grey and the card inside
  is light grey; in dark mode the section goes near-black and the card
  goes dark grey. The card is a 20px radius panel, 100px of internal
  padding, with a 72px title on the left and a device mockup on the
  right. The mockup screen carries a blurred, oversized texture image
  (130 percent size, blur 16px) that drifts slowly on a 22 second
  ease-in-out alternate loop, moving up to 100px sideways. That drifting
  texture is the only continuously moving background on the page
  outside the hero.
- Entry behavior of the dark-adjacent sections is covered in section 5
  and section 7. The dark sections themselves have no scroll-triggered
  entrance in CSS; their drama comes from the background switch and the
  slow texture drift.

## 5. Service Cards: Solid Color Panels With a Hover-Revealed Button

VERIFIED (CSS), from the services and service-card stylesheets. Note
that the homepage uses the vertical card variant on a dark section,
which changes the reading of the section completely versus a text list:

- Layout: a 3-column grid with 20px gaps on desktop, collapsing to one
  column with 45px gaps below 1023px. Section padding is 30px top and
  160px bottom on desktop.
- Card: a solid blue panel (the site's single accent color), 10px
  radius, minimum height 520px (470px below 1400px, 350px on mobile),
  white title at 36px (28px on mobile) and white description at 80
  percent opacity, with a halftone shader layer at 50 percent opacity
  in multiply blend mode over the panel. A dotted white rule (1px
  squares, repeating gradient) underlines each title line.
- Entry: each card wrapper starts at opacity 0 and 40px down, and
  animates to full opacity and position over 0.6s with a per-card delay
  variable, so the three cards arrive staggered. Under
  prefers-reduced-motion the cards render fully visible with no
  transition at all.
- Hover, homepage-specific: the pill button at the card foot starts at
  opacity 0 on the homepage and fades in over 0.3s on card hover or
  focus-within. The button itself never changes fill on the homepage
  variant (transparent background, white border and text throughout);
  only its visibility changes. The horizontal card variant behaves
  differently: its outline pill fills with blue on hover and its title
  turns blue, both over 0.3s.
- No card lift, no shadow change, and no image zoom on hover anywhere
  in the fetched card CSS. The interaction is restrained to one
  property: button visibility (vertical) or button fill (horizontal).

## 6. Team Stage: Scattered Cards Around an Oversized Title

VERIFIED (CSS), from the team stylesheet:

- The section is a fixed 747px tall stage (620px on mobile), wider than
  the content container at 1520px max width, with its own faint grid
  background at full opacity.
- Six small member cards are absolutely positioned around the stage
  (fixed pixel coordinates on desktop, percentage coordinates below
  1400px, re-anchored coordinates on mobile). Each card is 90px square
  (70px on mobile) with a photo filling it at cover fit, an 8px radius
  except for a 1px bottom-left corner, a tiny soft shadow, and a mono
  8px uppercase role label underneath.
- Entry: each member card starts at scale 0.5 and opacity 0, and pops
  to scale 1 and opacity 1 over 0.6s with an ease-out curve when a
  visible class is added. Comment bubbles near the cards start 12px
  down and rise into place over the same duration.
- The section title is 96px on one line (nowrap), deliberately wider
  than the viewport on desktop, dropping to 72px below 1400px and to
  38px wrapped and centered on mobile. Its second half carries a
  text-selection effect: a translucent blue highlight bar grows from
  width 0 to full width over 2000ms with an ease-out curve, while two
  blue handles (4px bars with 16px round knobs) track the highlight
  edges. The content column has pointer-events none except for its
  button, so the scattered cards never block reading the title.
- The section title and button use the standard pill button: 50px tall,
  100px radius, blue fill, white text, hover to a brighter blue over
  about 0.34s.

## 7. Portfolio Work Items: A Fan of Cards, Not a Grid

VERIFIED (CSS), from the portfolio stylesheet. This is the most
distinctive visual on the page after the hero, and it is not a grid,
not a carousel strip, and not a list:

- Layout: a two-column split. Text occupies 48 percent on the left with
  107px top padding; a 477px wide by 500px tall card area sits on the
  right. On mobile the split stacks, and the card area becomes a fixed
  310px wide by 400px tall centered fan.
- Cards: five absolutely positioned cards with 20px radius,
  overflow hidden, and a soft shadow (0 8px 30px at 15 percent black).
  Images fill their card at cover fit. Sizes: the center card is
  290px by 500px (188px by 346px on mobile); the side cards are
  188px by 356px (130px by 246px on mobile). The two rearmost cards
  are hidden on mobile.
- Entrance (the fan-out): all cards start offset and rotated with
  opacity 0 (side cards pushed 120px inward and tilted 2 degrees, the
  center card scaled to 0.95). When a fanned class is added, the side
  cards rotate to about -5.7 and +5.4 degrees and the center card
  scales to 1, over 0.8s with an overshoot easing curve
  (cubic-bezier(0.34, 1.56, 0.64, 1)), staggered 0.15s per card. The two
  rearmost cards settle at opacity 0.5 and 0.35, so the fan reads as a
  physical stack with depth, not five equal tiles.
- Hover: no :hover rule for the cards exists in the fetched
  stylesheet. Cards do not scale, lift, or show an overlay on hover in
  CSS. Their images are full color, not greyscale, and there is no
  grayscale-to-color transition. UNVERIFIED: whether JavaScript adds a
  hover interaction (for example, bringing a card forward) that CSS
  alone cannot show. What CSS proves is that the visual payoff is the
  entrance fan, not a hover state.
- Title treatment: the section title is 72px (38px on mobile), and each
  title line carries a dotted underline made of 1px squares in a
  repeating gradient, with per-line transition delays of 0.3s, 0.6s,
  and 0.9s. The section button is the standard blue pill with a 0.4s
  hover to the brighter blue; small social icons beside it lift 3px on
  hover over 0.4s.

## 8. Logo Wall: Monochrome Marks, Production Hover Unknown

VERIFIED (text): the homepage carries nine monochrome black SVG marks
after the work items and before the contact section, each served as a
separate black-variant file. VERIFIED (CSS, editor preview only): the
editor preview for the same block lays marks out in a wrapping flex
row with 20px gaps, each mark 30px tall at contain fit, greyscale
filtered, at 0.6 opacity, above a dashed top border.

- Production layout rules for the wall were not recovered from the
  fetched block stylesheets, and no hover rule for the marks appears in
  any stylesheet fetched for this task. UNVERIFIED: production gap,
  alignment, wrapping behavior, and any hover effect (dim-siblings,
  full-opacity-on-hover, or none). The earlier internal motion doc
  proposes a dim-siblings hover as a recommendation, not as an observed
  fact; that proposal must not be reported as the reference behavior.
- What is certain is the treatment: one color, no brand colors, no
  boxes, no captions, no case-study links attached to the marks. The
  wall reads as a list of names rendered as marks, and its quietness is
  the point. For the rebuild, the equivalent is text wordmarks with a
  relationship label, which is what v2 already does.

## 9. Giant Contact Text: A Watermark, Not Just a Headline

VERIFIED (CSS), from the contact stylesheet:

- The section is a two-column split: a 525px wide animation column on
  the left (659px tall) and the text column on the right with 107px top
  padding and 100px left padding. On mobile it stacks, and the animation
  column becomes full width at 420px tall.
- The giant text is a background watermark, not the headline. It is a
  two-letter monogram set at 266px (170px on mobile) with a 0.82 line
  height and -10px tracking, in near-white at 92 percent opacity with
  a 1px outline stroke at 8 percent dark and a 1px white text shadow.
  It starts 20px down at 0.98 scale and opacity 0, and rises and fades
  in over 0.8s opacity and 1s transform when a visible class is added.
  The real headline beside it is 72px (40px on mobile) with the same
  dotted title underline as the portfolio section.
- Around the watermark sit tilted collage cards (rotated about -8 and
  -12 degrees, white frames with 1px grey borders, 8px radius, images
  at cover fit) and a chat card rotated about 5 degrees. Each starts
  26 to 28px down at opacity 0 and rises over 0.75s opacity and 0.85s
  transform. Small app bubbles start at scale 0.7 and pop to 1 over
  0.55s opacity and 0.7s transform with the same overshoot curve as
  the portfolio fan. A collaborator cursor element fades and rises
  10px over 0.6s, and shrinks to 0.9 scale while clicking.
- The dot field: VERIFIED (CSS), from the shared dot-pattern
  stylesheet used by both the quote block and the contact section. It
  is drawn with two repeating radial-gradient layers, not with DOM
  elements: dots on a 14px pitch, 0.4px radius, base color black at 20
  percent opacity, with a second lit layer at 44 percent opacity
  clipped by a 50px radius radial mask around the cursor (fading from
  65 percent outward). A second, larger mask (350px radius on desktop,
  200px on mobile) reveals the whole dot field around the cursor
  position, which JavaScript writes as CSS variables. The lit layer
  turns on instantly under the cursor and fades out over 600ms when the
  cursor leaves. On devices without hover, the mask parks at the center
  (300px radius) and the lit layer is removed entirely.
- The contact button is the standard blue pill, wider here (85px
  horizontal padding), with the same 0.4s hover to the brighter blue.
  Social icons lift 3px on hover.

## 10. Header and Footer: What Could and Could Not Be Verified

- Header, partially verified: prior internal research doc 03, measured
  from the same production CSS, records the call-to-action button as
  fixed positioned at the top right, aligned to the content container
  edge. The rebuild already implements this. UNVERIFIED from this
  task's own fetches: whether the header bar itself is fixed or scrolls
  away, whether it shrinks, gains a background, or gains a border on
  scroll, and the button's exact scroll behavior. The theme root
  stylesheet holds no header rules, and no separate header stylesheet
  was recovered. Any claim about header shrinking on scroll is
  UNVERIFIED and must be checked in a live browser before it is built.
- Footer, UNVERIFIED in detail: the homepage text fetch confirms the
  footer is a small administrative footnote (copyright line, legal
  links, and structured business data), and prior research docs 03 and
  04 record 10px mono uppercase micro-text in muted grey. No footer
  stylesheet was fetched for this task, so no hover, layout, or
  responsive rule for the footer is verified here. Functionally it
  behaves as a footnote: it does not re-present navigation, it does
  not carry a second call to action, and it does not animate in CSS.

## 11. Cross-Cutting Rules Worth Copying as Principles

- One easing family for theme changes: 0.8s cubic-bezier(0.4, 0, 0.2, 1)
  on background and text color across every section. One faster family
  for entrances: 0.6s to 0.8s ease-out curves, with overshoot reserved
  for physical objects only (fan cards, app bubbles), never for text.
- One button everywhere: 50px tall pill, 100px radius, blue fill, white
  text, 0.34s to 0.4s hover to a brighter blue. Social icons: 0.4s,
  lift 3px.
- One dotted motif everywhere: 1px square repeating gradients under
  titles, 1px dashed borders on selection frames, dotted separators
  between horizontal list rows. The motif, not any single animation, is
  what makes the sections feel like one site.
- Breakpoints are stepped, not fluid: desktop values hold until
  1023px, then a single mobile set replaces them (hero word 180px to
  64px, section titles 72px to 38px or 40px, watermark 266px to
  170px). Sizes jump rather than interpolate.
- Reduced motion is honored where CSS shows it: service cards render
  fully visible with no transition, and card hover transitions are
  removed. No reduced-motion rule for the quote paint, fan-out, or dot
  field appears in the fetched stylesheets, so their reduced-motion
  behavior is UNVERIFIED and must be defined by the rebuild, not
  assumed from the reference.

## 12. Gap List: What V2 Currently Misses Most

Ordered by how much each item contributes to the reference feel, for
the parent agent to assign:

1. Draggable selection frames. V2 renders a static dashed box. The
   reference box is an object with move cursor, selected state, and a
   1000ms fade-in.
2. Pinned quote paint. V2 has a static quote block. The reference pins
   its claim headline for an extra 1875px of scroll and paints it word
   by word over a dot field.
3. Fan-out work cards. V2 lists works as hairline rows. The reference
   shows a physical fan of tilted cover cards with staggered overshoot
   entrance and dimmed rear cards.
4. Cursor-following dot field. V2 has no dot layer. The reference
   reveals dots around the cursor with a 350px mask and lights them in
   a 50px halo, in both the quote block and the contact section.
5. Collage layer. V2 sections are pure type. The reference surrounds
   its giant type with tilted mockups, chat cards, app bubbles, and
   collaborator cursors that pop in at 0.5 to 0.7 scale and fade over
   0.6s to 0.8s.
6. Theme crossfade discipline. V2 has no dark mode, so this is
   optional, but the 0.8s whole-page color fade is part of why the
   reference feels calm rather than jumpy.
7. Header scroll behavior. UNVERIFIED, so it cannot be assigned as a
   build item until a live browser check confirms whether the header
   shrinks or changes on scroll at all.

## 13. Sources

- Reference homepage text fetch, 24 Oct 2026.
- Reference stylesheets fetched for this task: home-hero,
  home-quote-block, home-servicios, card-servicio,
  home-bloque-dark-mode, home-portfolio, home-equipo, home-contacto,
  patron-puntos.
- Internal research docs 03, 04, 05 in
  ~/workspace/daivanlabs-rebuild/research/ (layout, type and color,
  interaction and motion).
