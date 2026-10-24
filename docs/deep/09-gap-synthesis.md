# 09 - Eye-Catching Gap Synthesis: Ranked Upgrades for the Research Portfolio

Task 9/15, deep-analysis track. READ-ONLY except this document.
This synthesis ranks what to build next for visual impact. It does
not re-propose work that already shipped, and it does not present
any unmeasured value as measured.

## 0. Sources and evidence labels

- `docs/motion/01` (motion forensics): 0 animations directly measured
  in that run; 5 claims CARRIED from research/03, not re-verified.
- `docs/motion/02` (visual forensics): values marked VERIFIED (CSS)
  come from reference stylesheets fetched for that task. Values
  marked UNVERIFIED need JavaScript or a live page and are not
  confirmed by CSS alone.
- `docs/motion/04` (motion spec): the binding token system for this
  site (durations 300/400/800ms, ease-out
  cubic-bezier(0.22, 1, 0.36, 1), pop easing
  cubic-bezier(0.34, 1.56, 0.64, 1) for elements 10px or smaller
  only, 80ms stagger steps, rise 24px sections / 14px dense rows).
- `docs/motion/05` (motion QA): PASS, all 21 files carry motion.
- `docs/motion/06` (integration): deliberate divergences that remain.
- Parent live-browser observation (24 Oct 2026): no custom cursor
  (default system cursor; the drifting cursors are decorative fake
  collaborator cursors), no marquee (logo row static across
  screenshots a minute apart), hero word hover hides the selection
  box, service cards are blue gradient panels, quote paint scrubs
  both directions, header wordmark fades out on scroll while the
  fixed CTA stays, hero grid stays pinned while the next section
  scrolls over it. Labeled OBSERVED (live browser) below.
- `research/03` (layout), `research/05` (interaction, evidence tiers
  T/I/R), `research/10` (research visualization rules: no unverified
  numbers, static SVG fallback, data table companion),
  `research/11` (visual language: visuals must derive from research
  artifacts, never from generic templates).

SOURCE GAP: `docs/deep/01` through `docs/deep/08` were not present
in the tree at write time, so this synthesis is built from the
sources above. If a sibling deep-analysis document contradicts an
item here with better evidence, that document wins and this file
needs a revision pass.

## 1. Already shipped (excluded from ranking, do not re-propose)

Hero entrance sequence plus draggable selection frame (desktop
only), pinned scroll-scrubbed quote paint, cursor dot-field halo on
Contact, blue gradient service cards with hover pills, scroll
reveals on every section and archive page, forest-plot draw-in with
plot/table hover sync, route-change fade with scroll-to-top and
smooth anchors, header shadow past 24px scroll, hero word-hover box
hide, static light-blue highlight on the Profile title word
"builds.", underline-draw hovers, and 15 canvas motion variants
(dev only). The ranking below covers only what is still missing.

## 2. Scoring method

Score = (visual impact x fidelity to the reference) / implementation
risk. Each factor is scored 1 to 5. Impact 5 means the change is
visible within the first screen or first scroll. Fidelity 5 means
the behavior is VERIFIED (CSS) or OBSERVED (live browser).
Risk 5 means layout restructuring, new artwork decisions, or
stacking-context danger. A high score means best value, not biggest
spectacle. Where the user asked for maximum visible change
regardless of risk, start with items 1, 4, and 6 instead of following
the score order.

Standing limits applied to every item, no exceptions: no fake
people (no invented collaborators, names, roles, or chat messages),
no invented numbers (no metric, date, or result that is not in a
verified source), no scroll-lock, no custom cursor replacing the
system cursor, no marquee, and every item must respect
prefers-reduced-motion (motion off, content fully visible, never
hidden, never trapped behind scroll).

## 3. Ranked top 10

| Rank | Upgrade | Impact | Fidelity | Risk | Score | Effort |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | Anonymous drifting cursor arrows, hero | 5 | 5 | 2 | 12.5 | Medium |
| 2 | Profile highlight bar growth, 2000ms | 4 | 5 | 2 | 10.0 | Small |
| 3 | Dotted-motif system completion | 3 | 5 | 2 | 7.5 | Small |
| 4 | Hero collage chips (research artifacts only) | 5 | 4 | 3 | 6.7 | Large |
| 5 | Draggable manifesto title + drop zone | 4 | 5 | 3 | 6.7 | Medium |
| 6 | Works fan deck, typographic panels | 5 | 5 | 4 | 6.3 | Large |
| 7 | Header wordmark fade on scroll | 3 | 4 | 2 | 6.0 | Small |
| 8 | Contact collage + watermark monogram | 4 | 4 | 3 | 5.3 | Medium |
| 9 | Sticky hero grid canvas | 4 | 4 | 4 | 4.0 | Large |
| 10 | Theme crossfade + manifesto texture drift | 3 | 4 | 3 | 4.0 | Medium |

### 1. Anonymous drifting cursor arrows, hero (score 12.5, medium)

What: the reference hero's most eye-catching ambient motion, and
the element the user explicitly asked about: small cursor arrows
that drift continuously in slow looping paths around the giant
word, independent of the visitor's mouse.

Where: hero stage only, absolutely positioned, desktop only
(1024px and up), hidden on smaller screens.

Spec: MEASURED (CSS, doc 02 section 2): the reference cursors are
scroll-driven frame by frame through requestAnimationFrame, with
no CSS transition on their transform. OBSERVED (live browser):
they drift continuously in slow looping paths and are independent
of the mouse. UNMEASURED: path shapes, loop durations, arrow
count, and per-cursor colors. DECISION FLAG, value range for
tuning in canvas: 4 to 6 arrows, one loop each of 16 to 24 seconds,
pure CSS keyframe translate/rotate loops (no scroll driving
needed for the adaptation), arrow glyph about 16 to 24px, colors
restricted to ink #010101, blue #0859D4, and mid grey. Arrows
start after the hero entrance sequence completes (about 2.0s),
fade in over 0.8s with the site ease-out, and never loop back
visibly (paths close on themselves).

Must NOT: any name, role, or label on an arrow (no fake people);
arrows must never follow the visitor's mouse, act as click
targets, or replace the system cursor; no fake chat text or
notification pills attached to arrows; under
prefers-reduced-motion the arrows are hidden entirely (they carry
no content, so hiding loses nothing).

### 2. Profile highlight bar growth, 2000ms (score 10.0, small)

What: turn the existing static light-blue highlight on the Profile
title word "builds." into the reference team-title effect: a
highlight bar that grows across the word while caret handles track
its edges.

Where: Profile section title only, once, on scroll into view.

Spec: MEASURED (CSS, doc 02 section 6): highlight bar grows from
width 0 to full width over 2000ms with an ease-out curve, while
two blue handles (4px bars with 16px round knobs) track the
highlight edges. Adaptation: keep the current translucent blue
fill, animate the highlight span width 0 to 100% over 2000ms
ease-out on first view (IntersectionObserver, once), handles
absolutely positioned at the span's left and right edges, word
kept on one line inside the span so wrapping cannot break the
bar. Trigger with the existing reveal system, not a second
observer pattern.

Must NOT: opaque highlight that hides letterforms, a blinking
caret (this is not a text input), the effect on any other title
(it is a once-per-page signature, not a system), or a second
animation replaying on scroll up.

### 3. Dotted-motif system completion (score 7.5, small)

What: the reference's unifying motif, currently used only in
places: 1px-square dotted underlines under titles, dotted
separators, one standard pill button, and small icon lifts.

Where: section titles (Works, ResearchIndex groups, detail
headings), the fixed header CTA hover, footer and contact social
links.

Spec: MEASURED (CSS, doc 02 sections 5 and 7): dotted title
underlines built from 1px-square repeating gradients, with
per-line transition delays of 0.3s, 0.6s, and 0.9s; standard pill
button 50px tall, 100px radius, blue fill, white text, hover to a
brighter blue over 0.34s to 0.4s; social icons lift 3px on hover
over 0.4s. Adaptation: dotted underline under each major section
title (titles only, never body text), drawn left to right on
scroll into view; header CTA keeps its fixed position and gains
the 0.4s brighten hover; social links gain the 3px lift with a
matching focus-visible state.

Must NOT: dotted underlines on body copy or links (noise, not
motif); brand colors anywhere in the motif (mono plus the one
blue only); a dim-siblings hover on the affiliation wordmarks,
which is UNVERIFIED and was only a recommendation in prior docs,
never an observed reference behavior.

### 4. Hero collage chips, research artifacts only (score 6.7, large)

What: the reference hero surrounds its giant word with floating
tool icons, wireframe cards, and mockups that pop in staggered.
The adaptation uses only real research artifacts, never decoration.

Where: hero stage edges around the word, desktop only (1024px
and up), maximum 4 chips, hidden on smaller screens so the word
never gets covered.

Spec: MEASURED (CSS, doc 02 section 9): app bubbles start at
scale 0.7 and pop to 1 over 0.55s opacity and 0.7s transform with
the overshoot curve cubic-bezier(0.34, 1.56, 0.64, 1); collage
cards rise 26 to 28px over 0.75s opacity and 0.85s transform.
Adaptation: chips pop in after the hero sequence (start about
2.0s, stagger 0.15s per chip, DECISION FLAG for exact start).
Allowed chip contents, each honest: a mini forest-plot glyph
drawn from the 3 verified FAERS rows (no numbers printed on the
chip itself, linking to the FAERS detail page); a code card
carrying the real tagline "Code for Cure"; a StrokeSense card
carrying its real name and "education-first" label, linking to
its detail page; a DaivanLabs wordmark chip (no link, or link to
home). Chips are entrance-only: after popping in they stay
still, so the hero keeps exactly one looping motion (item 1).

Must NOT: fake screenshots, fake photos, fake charts with
invented data, fake notifications or chat messages, fake
collaborator names, chips that overlap the giant word at any
breakpoint, or chips linking nowhere (every linked chip goes to
an existing internal page).

### 5. Draggable manifesto title + drop zone (score 6.7, medium)

What: extend the hero's selection-box system to the dark
manifesto title, exactly as the reference reuses it there.

Where: Manifesto section title "From question to tool." only.

Spec: MEASURED (CSS, doc 02 section 1): the manifesto title
carries the same dashed frame with 10px handles, becomes
draggable only on desktop (JavaScript enabled at 1024px and
above), and while draggable a translucent blue dashed drop zone
appears behind it. Adaptation: reuse the hero drag logic
(pointer capture, clamp to the title's own box, move cursor,
user-select none on the title only), desktop only, drop zone
shown only while dragging is possible, title motion confined to
its own reserved box so siblings never shift.

Must NOT: drag on touch devices (scroll hijack), a drop zone
that looks like a button or call to action, dragging that moves
or resizes surrounding content, or any drag interaction on the
method rows below the title. DECISION FLAG: release behavior
is UNVERIFIED in the reference; recommend snap-back to the
resting position on release (keeps the layout intact) unless
the user explicitly asks for free placement.

### 6. Works fan deck, typographic panels (score 6.3, large)

What: replace the hairline Works index rows, on desktop, with
the reference's physical fan of tilted cover cards. This is the
largest visual change on the page and the riskiest, because the
portfolio has no cover images.

Where: Works section, desktop two-column split (text 48 percent
left, fan area right); mobile becomes a centered stacked fan
with rear cards hidden, per the reference responsive behavior.

Spec: MEASURED (CSS, doc 02 section 7): five cards, 20px radius,
soft shadow 0 8px 30px at 15 percent black; center card 290px
by 500px, side cards 188px by 356px (mobile: center 188px by
346px, sides 130px by 246px, rearmost cards hidden); entrance
from offset and rotated with opacity 0 (side cards pushed 120px
inward, tilted 2 degrees, center scaled 0.95) to side rotations
about -5.7 and +5.4 degrees and center scale 1, over 0.8s with
the overshoot curve, staggered 0.15s per card; rearmost cards
settle at opacity 0.5 and 0.35. Adaptation: five featured items
(FAERS, StrokeSense AI Lab, StrokeSense education-first,
cerclage, one old publication) as panels. Cover art DECISION
FLAG, needs a user pick: option A, typographic panels (giant
title text on paper or blue, no images, safest); option B,
research-artifact panels (FAERS mini forest plot from verified
rows only, cerclage flow glyph, StrokeSense abstract wireframe
drawn as SVG lines, no screenshots). Recommended: A for all
panels, B only for FAERS. The hairline index stays as the
accessible list below the fan on desktop and as the sole list
on the research index page.

Must NOT: stock photos, fake screenshots, invented metrics or
dates printed on covers, grayscale-to-color hover (the
reference CSS has no card hover rule), autoplay or carousel
motion (the fan is static after entrance; the Swiper stylesheet
presence does not prove autoplay), or hiding the index list
entirely (screen-reader and keyboard users keep the list).

### 7. Header wordmark fade on scroll (score 6.0, small)

What: the reference header wordmark fades and slides out as
soon as the visitor scrolls, while the fixed CTA stays pinned.

Where: site header, all pages.

Spec: OBSERVED (live browser): wordmark fades/slides out on
scroll, CTA stays fixed, header has no background bar.
UNMEASURED: exact fade duration and trigger distance. DECISION
FLAG, value range: fade over 0.3s to 0.5s with the site
ease-out, triggered past 24px scroll (matches the existing
header shadow trigger, so the two effects stay in sync).
Adaptation (deliberate deviation, flagged): fade the wordmark
only and keep the navigation links visible, because this site
needs persistent archive navigation and the reference is a
single page. Use opacity and visibility only, never display
none mid-transition, and reserve the header height so no layout
shift occurs.

Must NOT: hide the navigation entirely with no replacement, add
a background bar or border the reference does not have, shrink
type sizes on scroll (reflow), or fade the fixed CTA (it must
stay visible, as observed).

### 8. Contact collage + watermark monogram (score 5.3, medium)

What: the reference contact section pairs a giant watermark
monogram with tilted collage cards beside the real headline.

Where: Contact section, desktop two-column split (collage left,
text right); stacks on mobile with the collage above the text
at reduced size.

Spec: MEASURED (CSS, doc 02 section 9): watermark monogram
266px (170px mobile), 0.82 line height, -10px tracking, near
white at 92 percent opacity with a 1px outline stroke at 8
percent dark and a 1px white text shadow, rising 20px with
0.8s opacity and 1s transform; collage cards rotated about -8
and -12 degrees, chat card about 5 degrees, each rising 26 to
28px over 0.75s opacity and 0.85s transform; app bubbles 0.55s
opacity and 0.7s transform with the overshoot curve.
Adaptation: monogram "DL" (the site's real initials) as a
background watermark behind the text column, never above it;
tilted cards reuse the honest artifact chips from item 4 (mini
forest plot, StrokeSense card) rather than inventing new ones.
DECISION FLAG: use the collage in either the hero or the
contact section, not both, to respect one motion family per
section and to avoid repeating the same chips twice. This
synthesis recommends contact, since the hero already carries
items 1 and 4.

Must NOT: fake photos, fake chat messages, fake client badges,
a watermark that sits above text or reduces contrast (it stays
z-index below content, faint by design), collage covering the
mailto action or social links, or a second looping animation
(the collage is entrance-only).

### 9. Sticky hero grid canvas (score 4.0, large)

What: the reference hero grid stays pinned while the next
section scrolls over it, instead of scrolling away with the
hero.

Where: hero grid layer, spanning the hero and the start of the
quote section.

Spec: OBSERVED (live browser): the grid remains pinned while
the statement section scrolls over it; it does not scroll away
with the headline. UNMEASURED: the exact stacking mechanism
(fixed layer versus sticky wrapper, and how the quote
section's background covers it). DECISION FLAG: the honest
implementation is a grid layer fixed behind content until the
quote section (opaque background) slides over it, with opacity
fading out as the quote paint completes. This interacts with
the already-built pinned quote section, which is why the risk
is high: two pinned systems stacked can produce z-index and
scroll-jacking bugs that only a live-browser pass can clear.

Must NOT: parallax speed differences (the reference grid does
not parallax per CSS; it is pinned, not parallaxed), grid drawn
over text at any point (it stays z-index 0 behind content),
or any scroll-locking used to stage the effect. Recommended
sequencing: defer to wave 3, prototyped in canvas first.

### 10. Theme crossfade + manifesto texture drift (score 4.0, medium)

What: the reference's calm whole-page color discipline plus
its one continuously moving background: a slowly drifting
blurred texture inside the dark manifesto block.

Where: Manifesto section background; crossfade transitions on
section wrappers site-wide.

Spec: MEASURED (CSS, doc 02 section 4): nearly every section
carries background-color and color transitions of 0.8s with
cubic-bezier(0.4, 0, 0.2, 1); the manifesto mockup texture is
oversized at 130 percent, blurred 16px, and drifts on a 22
second ease-in-out alternate loop, moving up to 100px sideways.
Adaptation: add the 0.8s color transitions to section wrappers
(small, safe, future-proofs any theme change); add one abstract
blurred gradient blob (CSS/SVG only, no image) drifting inside
the Manifesto background on the same 22 second loop. The blob
must be abstract color, never a photo, screenshot, or figure.

Must NOT: a whole-page dark-mode toggle presented as reference
parity (v2 has no dark mode; this item is section-level only),
drift applied to text or cards, drift that cannot be fully
stopped under prefers-reduced-motion, or a second continuous
loop in the same section (the drift is the section's only loop).

## 4. Do not build, even though eye-catching

- Named or role-labeled drifting cursors. The reference labels
  its fake cursors with team roles. Copying that fabricates
  collaborators. Anonymous arrows (item 1) are the honest form.
- Any marquee. OBSERVED: the reference logo row is static. A
  marquee would be less faithful, not more, and it is a banned
  pattern in the motion spec.
- Scroll-lock during the hero intro. VERIFIED (CSS) as a
  reference class, but a standing accessibility rejection for
  this site. Never reintroduce it as polish.
- Custom cursor replacing the system cursor. OBSERVED (live
  browser): the reference uses the default cursor. The earlier
  CARRIED custom-cursor claim is overridden by live observation.
- Fake screenshots, photos, notifications, or chat messages in
  any collage, fan, or card. If an artifact is not real work, it
  does not appear as work.
- Grayscale-to-color hover on affiliation wordmarks or logos.
  No such rule exists in the reference CSS fetched for doc 02;
  it is an invented effect, not a reference behavior.
- Dim-siblings hover on the affiliation strip. UNVERIFIED and
  recorded in doc 02 as a recommendation only, never as observed
  behavior. Do not present it as reference fidelity.
- Counting-up numbers, growing bars to a value, or any animation
  that draws a result into existence. The forest plot animates
  only rows the FAERS gate already passed, and research/10
  forbids unverified numbers in any visualization.

## 5. Recommended build sequence

Wave 1 (small, safe, high score): items 2, 3, and 7, plus item 1
as the user-requested centerpiece. All four can land without
layout restructuring.
Wave 2 (medium, needs the canvas): items 5 and 8, with the
item 4 versus item 8 collage placement decided first (this
synthesis recommends collage in Contact, not hero, if both are
wanted; hero keeps cursors plus at most 2 chips).
Wave 3 (large, needs decisions and a live-browser pass): items
6 and 9, plus item 10's drift texture. Item 6 needs the cover-art
pick (option A versus B); item 9 needs the stacking prototype.

## 6. Open decisions for the user (not for implementers to guess)

1. Cursor arrows: anonymous (recommended) versus topic-labeled
   with real site topics (Research, Tools, Teaching). Role
   labels are off the table.
2. Fan deck cover art: typographic panels (option A) versus
   research-artifact panels (option B), or fan deck deferred.
3. Collage placement: hero, contact, or one small set in each
   with no repeated chip.
4. Manifesto drag release: snap-back (recommended) versus free
   placement.
5. Header fade: wordmark only (recommended) versus full header
   except CTA.
6. Sticky hero grid: build the stacking prototype, or defer it
   as a known divergence.
