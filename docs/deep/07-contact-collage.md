# 07 - Contact Collage + Footer: Deep Analysis

Task 7/15, deep analysis track. READ-ONLY toward the site: this document
is the only file this task creates, and no site file was edited.

## 0. Method and evidence labels

Sources used for this document:

- `docs/motion/02-onlines-visual-forensics.md` section 9 (contact) and
  section 10 (footer), which fetched the reference contact stylesheet
  and dot-pattern stylesheet directly on 24 Oct 2026.
- `research/03-onlines-layout.md` (section anatomy, footer treatment)
  and `research/04-onlines-tipografi-warna.md` (type scale, watermark
  row, button radius, blue accent usage).
- Fresh homepage text fetch on 24 Oct 2026, used only to confirm
  section order and footer content structure (copyright line, legal
  links, structured business data). It exposes no stylesheet code.
- Current v2 source, read directly: `src/sections/Contact.tsx` and
  `src/components/Footer.tsx`.

Labels used below:

- CARRIED (doc 02 CSS): the rule was verified from a stylesheet
  fetched by the doc 02 task and is repeated here unchanged. It was
  not re-measured by this task.
- CARRIED (research 03/04): measured in the earlier research docs
  from the same production CSS.
- FRESH (v2 source): read from the current v2 files by this task.
- UNVERIFIED: the claim needs a live rendered page or JavaScript
  inspection and could not be confirmed from CSS, text, or v2 source.

Direct stylesheet refetch limitation: the text fetch strips link and
script tags, so it exposes no stylesheet URL, and no verbatim contact
stylesheet URL appears in the prior docs (only block names). No URL
was constructed or guessed for this task. All reference CSS values
below therefore carry the CARRIED label, not a fresh measurement.

Deliberate limits: this document describes elements functionally only.
It does not reproduce reference headline wording, marketing copy,
client names, logos, business addresses, or phone numbers.
Measurements (sizes, durations, colors, rotations) are the only quoted
reference values, because those are what a rebuild needs.

## 1. Reference contact layout: two columns, not one centered stack

| Item | Reference value | Evidence |
| --- | --- | --- |
| Section structure | Two-column split: animation column left, text column right | CARRIED (doc 02 CSS) |
| Animation column size | 525px wide, 659px tall | CARRIED (doc 02 CSS) |
| Text column padding | 107px top padding, 100px left padding | CARRIED (doc 02 CSS) |
| Mobile behavior | Columns stack; animation column becomes full width at 420px tall | CARRIED (doc 02 CSS) |
| Section background | Light grey #F5F5F7 | CARRIED (research 03/04) |
| Section position in page rhythm | Closing section, directly above the footer | FRESH (homepage fetch) |

Reading: the contact section is a stage with two actors (animated
collage left, text right), not a centered poster. The text column is
pushed right by a full 100px of left padding, so the headline does not
sit on the container edge. The animation column is nearly as tall as
it is wide in proportion (525 by 659), which is what gives the collage
room to float without crowding the text.

## 2. The giant watermark: a background glyph, not the headline

This is the single most misunderstood element of the reference
contact section. The giant type is NOT the headline. It is a
background watermark behind the text column.

| Item | Reference value | Evidence |
| --- | --- | --- |
| Glyph form | Two-letter monogram (brand initials), treated as a graphic | CARRIED (doc 02 CSS) |
| Size, desktop | 266px | CARRIED (doc 02 CSS, research 04) |
| Size, mobile | 170px | CARRIED (doc 02 CSS) |
| Weight | 700 | CARRIED (research 04) |
| Line height | 0.82 | CARRIED (doc 02 CSS, research 04) |
| Tracking | -10px | CARRIED (doc 02 CSS, research 04) |
| Fill | Near-white at 92 percent opacity | CARRIED (doc 02 CSS) |
| Outline | 1px stroke at 8 percent dark | CARRIED (doc 02 CSS) |
| Shadow | 1px white text shadow | CARRIED (doc 02 CSS) |
| Entrance, start state | 20px down, 0.98 scale, opacity 0 | CARRIED (doc 02 CSS) |
| Entrance, timing | 0.8s opacity, 1s transform, on a visible class | CARRIED (doc 02 CSS) |
| Layer order | Background layer, behind the text column content | CARRIED (doc 02 CSS) |

Contrast math that matters: 92 percent white on a #F5F5F7 ground is
almost invisible as a fill, which is the point. The glyph reads
through its 1px dark outline and its 1px white shadow, not through
its fill. It is texture, not text. A watermark rendered in solid ink
would fight the headline; this one does not.

## 3. The real headline versus the watermark

| Item | Reference value | Evidence |
| --- | --- | --- |
| Real headline size, desktop | 72px | CARRIED (doc 02 CSS, research 04) |
| Real headline size, mobile | 40px | CARRIED (doc 02 CSS) |
| Headline weight | 600 to 700 | CARRIED (research 04) |
| Headline decoration | Same dotted title underline as the portfolio section | CARRIED (doc 02 CSS) |
| Ratio, watermark to headline | 266 / 72 = about 3.7x | Derived from the two rows above |

The hierarchy is therefore: watermark 266px (texture) > headline
72px (message) > body copy (standard 16 to 18px). Any rebuild that
makes the headline itself 200px inverts this hierarchy: it promotes
the message to texture size and leaves no room for a watermark layer
behind it.

## 4. The floating collage around the watermark

| Element | Reference treatment | Evidence |
| --- | --- | --- |
| Tilted image cards | Rotated about -8 and -12 degrees; white frames with 1px grey borders, 8px radius, images at cover fit | CARRIED (doc 02 CSS) |
| Chat card | Rotated about 5 degrees | CARRIED (doc 02 CSS) |
| Card entrance, start state | 26 to 28px down, opacity 0 | CARRIED (doc 02 CSS) |
| Card entrance, timing | 0.75s opacity, 0.85s transform | CARRIED (doc 02 CSS) |
| App bubbles | Start at scale 0.7, pop to 1; 0.55s opacity, 0.7s transform, same overshoot curve as the portfolio fan | CARRIED (doc 02 CSS) |
| Collaborator cursor element | Fades and rises 10px over 0.6s; shrinks to 0.9 scale while clicking | CARRIED (doc 02 CSS) |
| Individual card sizes and coordinates | Not stated in the fetched CSS summaries | UNVERIFIED |
| Card count and exact placement grid | Not stated in the fetched CSS summaries | UNVERIFIED |
| Entrance trigger (scroll position vs class timing) | CSS visible class known; JavaScript trigger timing not confirmed | UNVERIFIED |

What the numbers say about feel: the collage does not slide in from
far away. 26 to 28px of rise is a short, calm lift, and the only
playful motion is reserved for small physical objects (bubbles
popping from 0.7 scale with overshoot). Text never overshoots. The
tilt angles are small (-12 to +5 degrees), so the collage reads as
casually placed paper, not as a scattered explosion.

## 5. The dot field (already matched by v2)

| Item | Reference value | v2 Contact.tsx value | Match |
| --- | --- | --- | --- |
| Construction | Two repeating radial-gradient layers, not DOM elements | Two layered divs with repeating radial gradients | Yes |
| Pitch | 14px | 14px | Yes |
| Dot radius | 0.4px | 0.4px | Yes |
| Base layer opacity | Black at 20 percent | rgba(0, 0, 0, 0.2) | Yes |
| Lit layer opacity | Black at 44 percent | rgba(0, 0, 0, 0.44) | Yes |
| Halo radius | 50px, fading from 65 percent outward | 50px at 0.65 strength | Yes |
| Reveal mask, desktop | 350px radius around cursor, written as CSS variables | 350px mask at cursor variables | Yes |
| Reveal mask, mobile | 200px radius | Not separately set (no-hover rule parks at center, see next row) | Partial |
| Turn-on / fade-out | Instant on, 600ms fade on cursor leave | 0ms on, 600ms off | Yes |
| No-hover behavior | Mask parks at center (300px radius), lit layer removed | Center mask 300px, lit layer display none | Yes |
| Reduced motion | No rule in fetched stylesheets | Lit layer removed, base mask removed, handler early-returns | v2 goes further, correctly |

The dot field is the one contact element v2 already reproduces at
full fidelity. It should not be reworked. The only gap is the mobile
reveal mask radius (200px in the reference versus the center-parked
300px mask v2 uses on no-hover devices), which is a minor tuning
note, not a rebuild item.

## 6. Buttons and social links

| Item | Reference value | Evidence |
| --- | --- | --- |
| Button form, site-wide | 50px tall pill, 100px radius, blue fill, white text | CARRIED (doc 02 section 11, research 04) |
| Button hover | 0.34s to 0.4s to a brighter blue | CARRIED (doc 02 section 11) |
| Contact button width | Wider here: 85px horizontal padding | CARRIED (doc 02 CSS) |
| Social icon hover | Lift 3px, 0.4s | CARRIED (doc 02 section 11) |
| Blue usage rule | Blue appears only for actions and interactive states, never for titles, decoration, or illustration | CARRIED (research 04) |

The contact button is therefore the widest, most generous pill on the
site. It is a solid object, not a text link. Its hover changes color
only; it does not lift, grow, or gain shadow.

## 7. Footer: a footnote, not a second navigation

| Item | Reference value | Evidence |
| --- | --- | --- |
| Type | JetBrains Mono, 10px, uppercase | CARRIED (research 03/04) |
| Color | Muted grey, about 40 percent dark | CARRIED (research 03) |
| Layout | Full-width background with a constrained inner wrapper at the same 1160px container edge as the header | CARRIED (research 03) |
| Content | Copyright line, legal links, structured business data | FRESH (homepage fetch) |
| Navigation re-presentation | None: it does not repeat the site navigation | CARRIED (doc 02 section 10) |
| Second call to action | None | CARRIED (doc 02 section 10) |
| Entrance animation in CSS | None found | CARRIED (doc 02 section 10) |
| Hover, layout, and responsive rules | No footer stylesheet was recovered | UNVERIFIED |
| Footer vertical padding | Not stated in the recovered summaries | UNVERIFIED |

The footer works because it refuses to compete. It is set at 10px,
in mono, in muted grey, and it says only what a footnote must say.
Anything louder turns the last thing the visitor sees into a second
homepage.

## 8. v2 contact and footer as built today

From direct reads of the current v2 files:

Contact (`src/sections/Contact.tsx`):

- Single centered column, max width 1160px, no animation column.
- Giant heading as the headline itself: clamp(56px, 13vw, 200px),
  weight 700, line height 1, tracking -0.02em, revealed word by word
  with a clip rise (900ms, 90ms stagger), body fading at 350ms.
- Body line 18px, max width 620px, graphite #1D1D1F.
- Primary action is a blue text link (the email address, 18px bold
  #0859D4) with a 400ms underline draw on hover. No pill button.
- Social links are blue text links (LinkedIn, ORCID, Instagram)
  fading in staggered at 650/750/850ms. No hover lift or underline
  rule is defined for them.
- Dot field implemented at full fidelity (see section 5).
- Section padding 130px top, 200px bottom, background #F5F5F7.
- Section stays reachable at the #contact anchor.

Footer (`src/components/Footer.tsx`):

- White background, 1px #E0E0E0 top border, padding 40px 24px,
  inner max width 1160px. Structure matches the reference alignfull
  pattern in spirit.
- Three mono lines at 11px uppercase muted (brand line, copyright
  line, affiliation line), fading and rising on scroll at 0/90/180ms.
- Navigation block repeating all six archive links plus the email
  address plus all three social links, at 11px mono uppercase muted,
  with a 350ms underline draw on hover, fading in at 270ms.
- Footer size is 11px versus the reference 10px, and it animates in
  where the reference does not animate at all.

## 9. Side-by-side delta table

| Element | Reference | v2 today | Delta |
| --- | --- | --- | --- |
| Watermark layer | 266px monogram watermark behind the text, 92 percent white fill, 1px dark outline, 20px rise on entry | No watermark layer at all | Missing entirely |
| Headline size | 72px (40px mobile) beside the watermark | Up to 200px as the headline itself | v2 headline is about 2.8x the reference headline, and it occupies the watermark's job |
| Layout | Two columns: 525 by 659px animation column plus text column with 100px left padding | Single centered column | Missing animation column; text sits on the container edge instead of pushed right |
| Collage | Tilted framed cards (-8/-12 deg), chat card (+5 deg), app bubbles popping from 0.7 scale, cursor element | None; the section is pure type plus the dot field | Missing entirely |
| Dot field | 14px pitch, 0.4px dots, 20/44 percent layers, 50px halo, 350px mask, 600ms fade | Same values, same masks, same fade | Match; keep as is |
| Primary action | Solid blue pill, 50px tall, 85px side padding, white text, 0.4s hover brighten | Blue text link with underline draw | Wrong form: text link instead of a solid pill |
| Social hover | Icons lift 3px over 0.4s | Text links with no hover rule | Missing hover feedback |
| Headline decoration | Dotted title underline under the headline | None | Missing motif |
| Footer type size | 10px mono uppercase muted | 11px mono uppercase muted | 1px larger; negligible alone |
| Footer content | Copyright, legal links, business data only | Full archive navigation plus email plus socials | v2 footer re-presents the whole site |
| Footer motion | No entrance animation in CSS | Fade and rise on scroll, underline draws | v2 footer animates where the reference is still |
| Section padding | Exact contact padding not recovered | 130px top, 200px bottom | Within the reference section scale; treat as aligned, exact value UNVERIFIED |

## 10. Ranked delta list (by eye-catching impact)

1. Add the watermark layer. Put a giant background glyph behind the
   contact text at 266px (170px mobile), line height 0.82, tracking
   -10px, weight 700, 92 percent white fill with a 1px dark outline
   and 1px white shadow, rising 20px and fading in over 0.8s opacity
   and 1s transform. For this portfolio the glyph must be the site's
   own brand mark, not the reference letters. This one change restores
   the reference depth hierarchy (texture behind message) and is the
   largest single visual gap in the section.
2. Add the floating collage. Place tilted framed cards (about -8 and
   -12 degrees, white frames, 1px grey borders, 8px radius), one chat
   card (about +5 degrees), and small app bubbles popping from 0.7
   scale with the overshoot curve, all rising 26 to 28px over 0.75s
   opacity and 0.85s transform. For a research portfolio the card
   faces should carry the site's own visuals (a forest plot figure,
   a tool screenshot, a paper figure), not invented imagery. The
   collage is what makes the reference contact feel alive rather
   than typed.
3. Split the layout into two columns. Give the collage its own
   525px wide, 659px tall animation column on the left and the text
   column 100px of left padding on the right, stacking on mobile
   with the animation column full width at 420px tall. This is the
   structural precondition for deltas 1 and 2; without it the
   watermark and collage have nowhere to sit except on top of the
   headline.
4. Demote the headline to 72px (40px mobile) and add the dotted
   title underline. The current 200px headline must shrink once the
   watermark exists, or the section will carry two giant elements
   fighting each other. The dotted underline reconnects the headline
   to the portfolio section motif.
5. Replace the mailto text link with a solid blue pill button: 50px
   tall, 100px radius, blue fill, white text, 85px horizontal
   padding, 0.4s hover to the brighter blue. Keep the email address
   itself visible as secondary text nearby, since a portfolio contact
   must show the address, not hide it behind a button label.
6. Give social links a hover lift of 3px over 0.4s. Small, cheap,
   and it is the reference social behavior; it also fixes the one
   interactive element in the section that currently has no hover
   feedback at all.
7. Quiet the footer. Reduce it to 10px mono uppercase muted, remove
   the entrance animation, and cut the repeated archive navigation
   down to footnote content (copyright, affiliation, legal-style
   links). Judgment call flagged for the parent: v2's footer
   navigation genuinely helps archive discovery on a multi-page
   portfolio, while the reference is a single page that needs no
   such repetition. If navigation is kept, keep it at 10px muted
   with no entrance animation so it still reads as a footnote.
8. Do not change: the dot field (full fidelity match), the #F5F5F7
   background, the 130px/200px section padding (within the reference
   scale), the 1160px container, and the blue-only-for-actions rule.

## 11. Open questions for the parent (not build items yet)

- Watermark glyph choice: brand monogram, brand word fragment, or a
  giant background figure? The reference uses a two-letter monogram;
  the portfolio equivalent needs a decision before delta 1 is built.
- Collage card faces: which of the site's own figures and tool
  screenshots go on the tilted cards? Card sizes and coordinates
  are UNVERIFIED, so a build agent must choose them and record the
  choice rather than claim a reference measurement.
- Footer navigation tradeoff (see delta 7): footnote purity versus
  archive discovery. The parent should rule before the footer is
  quieted.
- Reduced motion for the new layers: the reference stylesheets show
  no reduced-motion rule for the collage or watermark. The rebuild
  must define one (static watermark visible, collage fully visible
  with no entrance, dot field static), not assume the reference
  behavior.
