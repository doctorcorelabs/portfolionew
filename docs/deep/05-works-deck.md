# 05 - Works Deck Visualization: Reference Portfolio Fan, Deep Analysis

Task 5/15, deep analysis track. READ-ONLY toward the site: this document
is the only file this task creates, and no site file was edited.

## 0. Method and evidence labels

- This task re-read the reference homepage text fetch (24 Oct 2026) and
  the prior internal forensics doc
  (`docs/motion/02-onlines-visual-forensics.md`, section 7) and layout
  doc (`research/03-onlines-layout.md`), plus the interaction doc
  (`research/05-onlines-interaksi-motion.md`, sections 3.2, 3.3, 6).
- A direct re-fetch of the portfolio stylesheet was NOT possible in
  this task: the homepage text fetch strips stylesheet link tags, and
  no portfolio stylesheet URL appears in any prior tool result, so no
  URL could be used without guessing one, which is not done here.
  Geometry values below are therefore CARRIED from doc 02, where they
  were measured directly from the fetched portfolio stylesheet on
  24 Oct 2026 and labeled VERIFIED (CSS) there. They are labeled
  CARRIED here, not presented as fresh measurements.
- Labels in this document:
  - CARRIED (CSS): measured from the reference portfolio stylesheet by
    the doc 02 task on 24 Oct 2026.
  - CARRIED (text): present in the reference homepage text fetch.
  - DERIVED: arithmetic computed here from carried values (ratios,
    totals, bounds). Derivations are shown so they can be checked.
  - RECONSTRUCTION: a plausible arrangement inferred from carried
    values, explicitly not a measurement.
  - UNVERIFIED: not recoverable from CSS or text; needs a live rendered
    page or JavaScript inspection.
- Deliberate limits: this document describes reference elements
  functionally only. It reproduces no reference headline wording,
  marketing copy, card text, or client names. Measurements are the
  only quoted values.

## 1. Section anatomy (CARRIED)

The reference portfolio section is a two-column split, not a grid and
not a carousel strip:

| Element | Desktop (CARRIED) | Mobile (CARRIED) |
|---|---|---|
| Layout | Text 48 percent left, card area right | Stacked, card area centered |
| Text column | 107px top padding | Stacked above the fan |
| Card area | 477px wide, 500px tall | 310px wide, 400px tall, centered |
| Section padding | 80px top, 200px bottom | 40px top, 55px bottom (per layout doc) |
| Section title | 72px | 38px |
| Title underline | Dotted, 1px squares, repeating gradient, per-line delays 0.3s, 0.6s, 0.9s | Same motif, smaller title |
| Section button | Standard blue pill, 0.4s hover to brighter blue | Same |
| Social icons beside button | Lift 3px on hover over 0.4s | Same |

Note on the slider library: the layout doc records a Swiper
stylesheet (`swiper.min.css`) as present on the reference site.
Whether the fan itself is Swiper-driven, or Swiper serves a different
slider on the page, is UNVERIFIED. The fan as described by CSS is a
class-triggered entrance (a fanned class), not a scrolling strip.

## 2. Fan geometry (CARRIED, with DERIVED ratios)

Five absolutely positioned cards share one 477px by 500px stage on
desktop. All cards: 20px radius, overflow hidden, soft shadow
(0 8px 30px at 15 percent black), images at cover fit, full color.

| Card role | Size desktop (CARRIED) | Size mobile (CARRIED) | Tilt at rest (CARRIED) | Opacity at rest (CARRIED) |
|---|---|---|---|---|
| Center (front) | 290px by 500px | 188px by 346px | 0 degrees (scale 1) | 1.0 |
| Side, left | 188px by 356px | 130px by 246px | About -5.7 degrees | 1.0 (see note) |
| Side, right | 188px by 356px | 130px by 246px | About +5.4 degrees | 1.0 (see note) |
| Rear, first | 188px by 356px (assumed same as sides; see note) | Hidden | UNVERIFIED | 0.5 |
| Rear, second | 188px by 356px (assumed same as sides; see note) | Hidden | UNVERIFIED | 0.35 |

Notes and open points, stated plainly:

- The carried measurements give one size for "side cards" (188px by
  356px) and one opacity each for the two rearmost cards (0.5, 0.35),
  but they do not separately record the rear cards' sizes or tilts.
  The table assumes rear cards reuse the side size; that assumption is
  UNVERIFIED and flagged, not a measurement.
- The carried measurements do not record the side cards' opacity
  separately from the rear pair. The table lists sides at 1.0 because
  only the two rearmost cards are described as dimmed; if the sides
  are in fact slightly dimmed too, that value is UNVERIFIED.
- The carried measurements do not record any card's horizontal offset
  inside the 477px stage. Exact overlap in pixels is therefore
  UNVERIFIED. What can be said from sizes alone (DERIVED):
  - Center width is 60.8 percent of stage width (290 / 477).
  - Side width is 39.4 percent of stage width (188 / 477).
  - Center height equals stage height exactly (500 / 500).
  - Side height is 71.2 percent of stage height (356 / 500), so a
    vertically centered side card leaves about 72px of stage above and
    below it.
  - On mobile, center height is 86.5 percent of stage height
    (346 / 400) and side height is 61.5 percent (246 / 400).
- RECONSTRUCTION (not a measurement): for the fan to read as a fan,
  each side card must overlap one edge of the center card. If the side
  cards sat flush at the stage edges (left card at x 0 to 188, right
  card at x 289 to 477) and the center card sat centered (x 93.5 to
  383.5), the overlap would be about 94.5px per side. This arrangement
  is consistent with the sizes but is NOT confirmed by any recovered
  rule; do not build from it without a live check.
- Depth is produced by four stacked cues, in order of strength:
  size (center taller and wider than sides), tilt (sides rotated,
  center straight), opacity (rear pair dimmed), and shadow (same soft
  shadow on all cards, so overlap order, not shadow strength, sells
  depth). Rotation angles are small (under 6 degrees): the fan reads
  as a slightly fanned hand, not a scattered collage.

## 3. Fan-out entrance (CARRIED)

Start state (before the fanned class lands), end state (after), and
timing, all CARRIED from the portfolio stylesheet:

| Property | Start state | End state |
|---|---|---|
| All cards | Opacity 0 | Opacity per role (see section 2) |
| Side cards | Pushed 120px inward, tilted 2 degrees | Tilted about -5.7 / +5.4 degrees |
| Center card | Scaled 0.95 | Scaled 1 |
| Duration | 0.8s for every card | Same |
| Easing | Overshoot cubic-bezier(0.34, 1.56, 0.64, 1) | Same |
| Stagger | 0.15s per card | Same |

DERIVED total: with 5 cards staggered at 0.15s, the last card starts
at 0.6s and finishes at 1.4s, so the full fan-out spans 1.4s from first
card start to last card settle. The overshoot curve is reserved for
physical objects in this design system (fan cards, app bubbles); text
never uses it. That reservation is itself a carried principle from
doc 02, section 11, and it matches the rebuild's existing motion spec,
which allows pop easing only for 10px-scale elements.

Trigger: a fanned class added by JavaScript. What adds it (scroll
into view, page load, or another trigger) is UNVERIFIED from CSS.

## 4. Card types: what each piece contains

The five fan cards are image cards (CARRIED: images fill their card
at cover fit). Beyond that, the exact mapping of content to the five
fan positions is UNVERIFIED. Separately, live screenshot observation
by the parent track (reported to this task's lineage, not re-verified
here) describes floating collage pieces around the section: a list
card carrying rows of short category words, a portrait-style cover
card with a blur treatment, a small square icon badge, and a rounded
comment pill, plus the blue section button. Whether the badge and the
comment pill are members of the five-card fan or separate floating
overlays around it is UNVERIFIED; CSS proves five cards, screenshots
prove the collage vocabulary, and the join between the two is not
proven by either source.

Functional inventory (no reference copy reproduced):

| Piece | Verified status | Content, functionally | Geometry role |
|---|---|---|---|
| Cover image card(s) | CARRIED (CSS) | Full-bleed image at cover fit, full color | Center and/or sides of the fan |
| List card | Screenshot-observed, mapping UNVERIFIED | Rows of short category words, no paragraph text | One of the fan positions, or an overlay |
| Portrait card | Screenshot-observed, mapping UNVERIFIED | Portrait-style image with a blur treatment | One of the fan positions, or an overlay |
| Icon badge | Screenshot-observed, mapping UNVERIFIED | Small square badge carrying a tool icon | Floating accent, likely overlay |
| Comment pill | Screenshot-observed, mapping UNVERIFIED | Rounded chat-style note | Floating accent, likely overlay |
| Section button | CARRIED (CSS) | Blue pill, not a card | Below the text column, not in the fan |

What matters for transfer is the pattern, not the inventory: every
piece is visual first and word-poor. The list card is the only
text-bearing piece, and even it carries single words, not sentences.
There is no piece in the fan designed to carry a title, an abstract,
a method note, or a number. That absence is the core transfer problem
in section 7.

## 5. Hover behavior per card type

CARRIED (CSS absence, stated as a finding, not a gap): no :hover rule
for the fan cards exists in the fetched portfolio stylesheet. Cards
do not scale, lift, or show an overlay on hover in CSS. Their images
are full color, not greyscale, and there is no greyscale-to-color
transition. This holds for every card type in the fan: the visual
payoff is the entrance fan, not a hover state.

| Card type | Hover in CSS | Hover via JavaScript |
|---|---|---|
| Center image card | None (CARRIED absence) | UNVERIFIED (for example, bringing a card forward) |
| Side image card | None (CARRIED absence) | UNVERIFIED |
| Rear image card | None (CARRIED absence) | UNVERIFIED |
| List card / portrait card / badge / pill (if overlays) | No rule recovered | UNVERIFIED |
| Section button | Fill to brighter blue over 0.4s (CARRIED) | Not applicable |
| Social icons beside button | Lift 3px over 0.4s (CARRIED) | Not applicable |

For the rebuild, the no-hover-cards rule is already the house rule:
the current Works rows hover with a 4px title shift and an underline
draw, and nothing lifts. That matches the reference better than any
card-lift hover would, and it should not be changed to imitate a fan
that itself does not lift on hover.

## 6. Section button behavior (CARRIED)

- Form: the site's standard blue pill (50px tall, 100px radius, blue
  fill, white text per the cross-cutting rules in doc 02).
- Hover: fill shifts to a brighter blue over about 0.34s to 0.4s
  (0.4s in the portfolio stylesheet, 0.34s in the team stylesheet;
  the range, not a single value, is what is carried).
- No fill sweep, no shadow change, no scale on hover. The button is
  the calmest interactive element in the section, which is why the
  fan entrance can afford to be the loudest.
- The button sits with the text column, not with the fan, so the
  section reads as: claim on the left, proof object on the right,
  action under the claim. That reading order transfers directly (see
  section 7).

## 7. Transferability to a research portfolio with NO cover images

Verdict first: do NOT transplant the fan. Adopt its structure and
its button, reject its cards. The table below gives one verdict per
element, with the reason stated so the parent can overrule any single
row without reopening the whole question.

| Reference element | Verdict | Reason |
|---|---|---|
| Five-card tilted fan as the Works display | REJECT | The fan is a container for images. With no cover images, fanning five panels means fanning five empty or text-stuffed boxes. Tilted text at 188px width turns long research titles into unreadable diagonal fragments, and rotation plus dimming actively fight the academic requirement that every entry be equally legible. |
| Fan count (5) versus Works count (9) | REJECT as a replacement | A fan curates; an index completes. The rebuild's Works section carries 9 rows (4 featured, 5 archive). Forcing 9 works into a 5-card fan hides 4 of them. For an assessor scanning a record, completeness beats curation. Curation belongs in a featured strip, not as a substitute for the index. |
| Rear-card dimming (0.5, 0.35 opacity) | REJECT for entries | Dimming real entries to 0.35 opacity implies they matter less and drops them below comfortable reading contrast. Depth cues must never encode importance in a research record. Keep dimming only inside a hypothetical image fan, where the dimmed object is a picture, not a claim. |
| Overshoot fan entrance (0.8s, 0.15s stagger) | ADOPT AS PATTERN ONLY | The stagger-plus-overshoot rhythm already lives in the rebuild for 10px-scale elements (selection handles, plot points). Scaling it up to full work rows would feel toy-like and would break the calm editorial register the rest of the site now uses. Do not apply overshoot to rows. |
| Card size, 20px radius, soft shadow | RESERVE FOR IMAGE CARDS ONLY | These values are directly reusable the day a work has a real visual: a poster thumbnail or a tool screenshot in a 20px-radius card with the carried soft shadow would be faithful. Applied to text panels without images, the same values produce the generic SaaS card look the rebuild's taste rules reject. |
| No-hover-cards rule | ADOPT (already adopted) | The reference fan does not lift or overlay on hover, and neither should the rebuild's rows. Current behavior (4px title shift, underline draw) is the correct translation of this rule to a text index. |
| Dotted title underline, per-line delays 0.3s / 0.6s / 0.9s | ADOPT | This is the site's shared motif (selection frames, dotted rules, dotted underlines) and it carries no image requirement. It can be added to the Works heading lines as they are. |
| Blue pill button, 0.4s hover, icon lift 3px | ADOPT (already adopted) | The section button pattern is content-free and directly reusable: a pill under the Works heading leading to the full research index already exists in spirit on this site. |
| Two-column split (48 percent text, visual area right) | ADOPT IN MODIFIED FORM | The split itself is the right shape for a research Works section, but the right area must hold a data visualization, not a photo fan. The honest replacement for the fan is a small live figure: a mini forest plot, a timeline of outputs, or a methods diagram. The layout doc already states this principle: in a research portfolio, visualization is the content, not the decoration. |
| Mobile behavior (hide rearmost cards, 310px by 400px fan) | ADOPT AS PRINCIPLE | On narrow screens the reference sheds decorative layers instead of shrinking them. The rebuild's rows already stack; if a visual fan is ever built, its rear cards must be hidden on mobile exactly as the reference does, not scaled down into illegibility. |
| Collage vocabulary (badge, comment pill, floating accents) | REJECT for Works | Badges and comment pills imply a design-agency collage: tools used, client feedback, work-in-progress notes. On a research record they read as decoration pasted onto evidence. The one collage element worth keeping site-wide is the selection frame, which the rebuild already uses in the hero. |

## 8. Recommendation: what to build instead of the fan

1. Keep the 9-row hairline index as the Works section. It is the
   correct display for a record an assessor must scan completely, and
   its current motion (staggered reveal, 4px title shift, underline
   draw, no lift) is already the faithful translation of the
   reference's restrained hover language.
2. If a visual anchor is still wanted beside the index, use the
   reference's two-column split with a real figure in the right
   column: a mini forest plot of the three verified FAERS rows, or a
   timeline of the nine works by year. Both are data the site already
   owns and verifies; neither needs an invented image.
3. If a fan is ever built, limit it to three cards maximum, placed
   above the index as a featured strip (never replacing it), and
   restrict its cards to real artifacts only: a rendered poster
   thumbnail or a genuine tool-interface screenshot. Do NOT generate
   AI cover images for papers or projects: a fabricated cover would
   present decoration as if it were evidence, which is worse than no
   image at all. With only one or two real artifacts available today,
   the honest choice is to postpone the fan, not to fill it.
4. Add the dotted title underline with per-line delays to the Works
   heading, and keep the blue pill button behavior as the section
   action. These two adoptions close most of the remaining visual gap
   with the reference without touching the index that carries the
   record.

## 9. Sources

- `docs/motion/02-onlines-visual-forensics.md`, section 7 (portfolio
  fan geometry, entrance, hover absence, button) and section 11
  (cross-cutting rules), plus section 8 (logo wall, for contrast).
- `research/03-onlines-layout.md` (section padding, two-column split,
  Swiper stylesheet presence, whitespace discipline, and the
  visualization-as-content principle for research portfolios).
- `research/05-onlines-interaksi-motion.md`, sections 3.2 (list rows),
  3.3 (cards and images), 3.5 (buttons), and 6 (motion catalog).
- Reference homepage text fetch, 24 Oct 2026 (section order; portfolio
  card content itself is absent from the text fetch, which is why
  card-type mapping is marked UNVERIFIED above).
- Current rebuild Works section
  (`src/sections/Works.tsx`, 9 rows: 4 featured, 5 archive) as the
  transfer target.
