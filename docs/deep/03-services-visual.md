# 03 - Services Visualization: Deep Analysis

Deep analysis 3/15. READ-ONLY toward the site: this document is the
only file this task creates, and no site file was edited.

Scope: the reference services cards (the three vertical cards on the
dark services section), measured as deeply as text-fetch tools allow,
plus an implementation-ready spec for applying the same treatment to
the three text columns of the rebuild. No reference card copy, card
headings, or offering names are reproduced here; elements are described
functionally only.

## 0. Method and provenance (read this first)

Evidence labels used below:

- VERIFIED (CSS, carried): the rule was measured from a production
  stylesheet fetched by the earlier forensics task and recorded in
  `docs/motion/02-onlines-visual-forensics.md` section 5. It is carried
  here, not re-measured this run.
- VERIFIED (stills): observed in live-browser screenshots taken by the
  parent's browser pass over the reference homepage.
- VERIFIED (v2): read directly from the current rebuild file
  `src/sections/Services.tsx` during this task.
- UNVERIFIED: could not be confirmed from any fetched source this run.

Honest limitation on the stylesheet re-fetch: the task brief asked for
direct fetches of the referenced production stylesheets, especially the
service-card stylesheet. That re-fetch was NOT possible this run, and no
URL was invented to fake it. Prior docs name the stylesheets only
(`home-servicios`, `card-servicio`) and record no verbatim stylesheet
URL; the homepage text fetch strips all stylesheet links, and web
search for the stylesheet names returned no asset URL. Constructing a
theme path from the domain would be guessing, so it was not done. Every
reference value below therefore traces to the carried forensics
measurements in doc 02 (which did fetch those stylesheets), to
`research/03-onlines-layout.md`, or to the parent's live-stills
observations. A live-browser pass that records loaded stylesheet URLs
from the network panel is the only way to re-verify the raw rules, and
it is listed as follow-up work in section 8.

## 1. Measurement table

| Property | Reference value | Evidence | Current v2 value | Verdict |
|---|---|---|---|---|
| Section background | Near-black `#010101` (vertical variant) | VERIFIED (CSS, carried) | `#010101` | Match |
| Section padding, desktop | 30px top, 160px bottom | VERIFIED (CSS, carried) | 130px top and bottom | Delta, see section 6 note 1 |
| Grid | 3 columns desktop, 1 column mobile | VERIFIED (CSS, carried) | Same | Match |
| Grid gap | 20px desktop; 45px single-column mobile | VERIFIED (CSS, carried) | 24px both | Delta, adopt 20px / 45px |
| Breakpoints | Stepped: 1400px, then 1023px | VERIFIED (CSS, carried) | Single 900px breakpoint | Delta, adopt stepped breakpoints |
| Card fill | Solid single accent blue, not a multi-stop gradient | VERIFIED (CSS, carried) | 160deg 3-stop gradient (`#0B63E5` to `#0859D4` at 52 percent to `#0649A8`) plus two white radial highlights | Delta, see section 2 |
| Shader layer | Halftone texture layer, 50 percent opacity, multiply blend mode, over the panel | VERIFIED (CSS, carried) | Two white radial highlight layers, no halftone, no multiply | Delta, see section 2 |
| Card radius | 10px | VERIFIED (CSS, carried) | 16px | Delta, adopt 10px |
| Card min-height | 520px desktop; 470px below 1400px; 350px mobile | VERIFIED (CSS, carried) | 480px desktop; auto mobile | Delta, adopt all three steps |
| Card padding | Not recorded | UNVERIFIED | 32px sides, 36px bottom | Keep v2 value, do not invent |
| Title size | 36px desktop; 28px mobile | VERIFIED (CSS, carried) | Fluid clamp 28px to 42px | Delta, adopt stepped 36px / 28px |
| Title color | White | VERIFIED (CSS, carried) | White | Match |
| Description color | White at 80 percent opacity | VERIFIED (CSS, carried) | White at 90 percent opacity | Delta, adopt 80 percent |
| Dotted rule | 1px squares in a repeating gradient, under each title line | VERIFIED (CSS, carried) | 1px dotted border on an `hr` under the whole heading block | Delta, see section 3 |
| Card-top label | Structure not recorded | UNVERIFIED | Mono 12px uppercase "NN / Title" label | Keep as v2 adaptation |
| Card icon | Not recorded in any fetched card CSS | UNVERIFIED | None inside cards | Keep icon-free |
| Pill position | At the card foot, bottom-left | VERIFIED (CSS, carried) | Pinned with `margin-top: auto`, bottom-left | Match |
| Pill geometry | Not recorded | UNVERIFIED | Padding 10px 22px, mono 12px uppercase, 999px radius, 1px white border | Keep v2 geometry |
| Pill default state | Opacity 0, invisible | VERIFIED (CSS, carried) | Opacity 0, visibility hidden | Match |
| Pill reveal trigger | Card hover or focus-within | VERIFIED (CSS, carried) | Hover or focus-within | Match |
| Pill reveal timing | Fade 0.3s | VERIFIED (CSS, carried) | 0.25s | Delta, adopt 0.3s |
| Pill fill on hover, vertical variant | Never changes: transparent background, white border and text throughout; only visibility changes | VERIFIED (CSS, carried) | Changes to white background with blue text on hover | CORRECTION, see section 4 |
| Pill fill on hover, horizontal variant | Outline pill fills blue, title turns blue, both 0.3s | VERIFIED (CSS, carried) | Not applicable (v2 uses the vertical form) | Do not import |
| Dimmed sibling pills | No such rule in fetched card CSS | UNVERIFIED, conflicting stills, see section 4 | None (non-hovered pills stay invisible) | Keep; do not implement |
| Card hover lift | None | VERIFIED (CSS, carried) | None | Match |
| Card hover shadow change | None | VERIFIED (CSS, carried) | None | Match |
| Image zoom on hover | None | VERIFIED (CSS, carried) | None (no images in cards) | Match |
| Card entrance | Wrapper opacity 0 and 40px down, animating to full opacity and position over 0.6s, per-card delay variable | VERIFIED (CSS, carried) | 0.7s rise from 20px, stagger 0.15s steps from 0.1s | Close; adopt 0.6s / 40px |
| Animated gradient / shader loop | No loop duration in fetched CSS; texture reads static | UNVERIFIED (loop), VERIFIED (stills) for a subtle shimmer impression only | 18s ease-in-out alternate drift of the two highlight layers | Delta, see section 2 |
| Reduced motion | Cards render fully visible with no transition | VERIFIED (CSS, carried) | Full visibility, no transitions, shimmer disabled | Match |

## 2. Gradient deep dive: solid accent plus halftone, not a gradient

This is the largest visual delta in the section, and it is easy to
misread, so it gets its own section.

What the reference actually does, per carried CSS measurements:

- The panel fill is a single flat accent blue. There is no
  multi-stop linear gradient in the fetched card CSS. The accent is the
  site's single accent color, measured elsewhere in the research as
  `#0859D4`.
- Over that flat fill sits one halftone shader layer at 50 percent
  opacity in multiply blend mode. Multiply darkens the blue under the
  texture dots and leaves it unchanged between them, which is what
  keeps the panel reading as one solid color instead of a gradient.
- No animation loop duration for this layer exists in the fetched CSS.
  The texture is, as far as CSS can show, static.

What the live stills add, and what they do not prove:

- Stills show a soft, organic blue texture that looks as if it shimmers
  or moves subtly. That impression is VERIFIED (stills) only as an
  impression. It does not establish a loop duration, a keyframe set, or
  even that the texture moves at all; a static halftone over a flat
  fill can read as shimmer in still frames. Any loop duration quoted
  for the reference would be invented, so none is quoted here.

What v2 currently does, per direct read of `Services.tsx`:

- A 160deg three-stop gradient (`#0B63E5` to `#0859D4` at 52 percent to
  `#0649A8`) with two white radial highlight layers on top.
- The highlight layers drift on an 18s ease-in-out infinite alternate
  loop that animates background position; the base gradient layer
  itself is pinned at 0 percent 0 percent in both keyframes, so only the
  highlights move. The drift is disabled under prefers-reduced-motion,
  which is correct.
- The 18s value is a v2 interpretation, not a reference measurement.
  It is defensible as a slow ambient motion, but it must not be
  reported as matching the reference.

Implementation recommendation (faithful option, preferred):

1. Set the card background to flat `#0859D4`.
2. Add a halftone layer as a CSS-only dot pattern, not by reusing the
   reference's own texture asset: a `radial-gradient` dot tile
   (for example, a 1px dot in a 6px tile) at 50 percent opacity with
   `mix-blend-mode: multiply`, layered above the flat fill and below
   the text. Keep the dots white or near-white at low alpha if a dark
   multiply dot proves too heavy on small screens; the structural
   requirement is one texture layer at 50 percent in multiply, not the
   exact dot color, which is UNVERIFIED at pixel level.
3. Delete the three-stop gradient and the drifting radial highlights,
   or keep them only if the team consciously prefers the livelier v2
   look and labels it as a deliberate deviation in the file comment.
   If the drift is kept, keep it exactly as it is now (highlights only,
   18s alternate, reduced-motion off), because it is the one drift form
   that cannot drop white-text contrast: the base fill never moves.
4. Contrast guard, either way: white title and 80 percent white body
   text over `#0859D4` pass comfortably at card title and body sizes;
   re-check contrast only if the halftone dot color or opacity changes
   from the recipe above.

## 3. Dotted rule deep dive: squares under each title line

Reference behavior, per carried CSS measurements:

- The rule is not a border. It is a repeating gradient made of 1px
  squares, placed under each title line. That "each line" detail
  matters: on a two-line title, each line gets its own dotted
  underline, not one rule under the whole block.
- The same 1px-square repeating-gradient motif appears under titles in
  other reference sections, so it is a site-wide motif, not a card
  decoration.

What v2 currently does:

- A single `hr` with a 1px dotted border under the whole heading block
  (title plus label as one block). Browsers render `dotted` borders as
  round dots with UA-chosen spacing, so the result differs from square
  tiles in both shape and rhythm, and a wrapped title gets one rule
  instead of one per line.

Implementation recipe (CSS only, no asset):

- For the faithful per-line effect, apply the rule to an inline span
  inside the title, not to a block element: `background-image:
  repeating-linear-gradient(to right, rgba(255,255,255,0.9) 0 1px,
  transparent 1px 4px)`, `background-size: 4px 1px`,
  `background-repeat: repeat-x`, `background-position: 0 100%`, and
  enough `padding-bottom` (about 6px) for the rule to sit clear of
  descenders. Because the span is inline, the background repeats per
  line box automatically when the title wraps.
- Keep the rule white at high opacity (the reference rule is white;
  exact alpha is UNVERIFIED, 0.9 is a safe reading of the v2 value and
  of the stills).
- If the per-line span proves fragile in a given browser, the accepted
  fallback is one repeating-gradient rule under the whole title block
  (same tile recipe, block element, 1px tall). That fallback loses the
  per-line property but keeps the square-tile property, which is the
  more visible of the two.

## 4. Pill button deep dive: visibility only, plus two discrepancies

State table for the vertical (homepage) variant, per carried CSS:

| State | Opacity / visibility | Fill | Border / text | Timing |
|---|---|---|---|---|
| Default | 0 / invisible | Transparent | White border, white text | n/a |
| Card hover | 1 / visible | Transparent (unchanged) | White border, white text (unchanged) | Fade 0.3s |
| Card focus-within | 1 / visible | Transparent (unchanged) | White border, white text (unchanged) | Fade 0.3s |
| Link focus-visible | 1 / visible | Transparent (unchanged) | White outline offset for keyboard users (v2 addition, keep) | n/a |
| Reduced motion | 1 / visible, no transition | Transparent | White border, white text | n/a |

Correction 1 (actionable): v2 currently changes the pill to a white
fill with blue text on hover. That is the reference's horizontal
variant behavior, not the vertical variant the homepage uses. The
vertical spec is visibility only: the pill fades from invisible to
visible over 0.3s and its fill never changes. Fix by deleting the
hover/focus-within fill and color overrides on the pill link and
changing the pill transition from 0.25s to 0.3s. This is the single
most clear-cut correction in this document.

Discrepancy 1 (unresolved, do not build on it): live stills from the
parent's browser pass report the hovered card's pill rendering
bright/solid while the other cards' pills render dimmed/ghosted. That
reading conflicts with the CSS rule (opacity 0 by default). Possible
explanations, in order of likelihood: the stills caught pills
mid-transition at partial opacity; the "dimmed" pills are a different
element (for example a persistent ghost outline in another layer); or
the production CSS served to browsers differs from the stylesheet
fetched for forensics. None of these can be distinguished from stills.
Do NOT implement dimmed siblings. The follow-up that resolves it is a
live computed-style check of a non-hovered card's pill (opacity and
visibility values at rest), listed in section 8.

Discrepancy 2 (unresolved, minor): the pill's exact padding, height,
border width, and font are UNVERIFIED. V2's geometry (10px 22px, mono
12px uppercase, 999px radius, 1px border) is a reasonable adaptation
of the site's standard pill language and is kept. Do not present it as
a reference measurement.

What must not change about the pill: its position pinned to the card
foot at bottom-left (`margin-top: auto` in a column flex card), its
link destinations (existing internal pages only), and its
keyboard behavior (focus-within reveals it, focus-visible outlines it).

## 5. Typography inside the cards

- Title: white, 36px desktop, 28px mobile, stepped at the 1023px
  breakpoint, not fluid. V2's fluid clamp (28px to 42px) overshoots the
  reference at large widths (42px vs 36px) and undershoots the stepped
  behavior. Adopt 36px above 1023px and 28px at or below 1023px.
  Title weight and family are not separately recorded for the card;
  the v2 values (700 weight, Inter stack) are consistent with the
  site-wide title treatment and are kept.
- Description: white at 80 percent opacity. V2 uses 90 percent; adopt
  80 percent. Line height and size for card body text are UNVERIFIED;
  v2's 17px at 1.65 line height is kept.
- Mono label: whether the reference cards carry a number label at all
  is UNVERIFIED (no label rule appears in the carried card
  measurements). V2's mono 12px uppercase "NN / Title" label is an
  adaptation that matches the site's mono-label language elsewhere; it
  is kept, and it must not be described as a reference element.
- Section heading above the cards ("Three ways of working." in v2) is
  a rebuild element, not a reference element, and is out of scope for
  this card spec except for one note: the reference section heading
  treatment is a separate measurement and must not be conflated with
  the card title treatment above.

## 6. Implementation-ready spec for the three text columns

Apply to `src/sections/Services.tsx` only. Column copy, column order,
line copy, pill destinations, and pill labels do not change. No
reference copy is introduced at any step.

Ordered edits:

1. Card fill: replace the three-stop gradient plus radial highlights
   with flat `#0859D4` plus a CSS halftone dot layer at 50 percent
   opacity in multiply blend mode (section 2 recipe). If the team
   rejects the flat fill, keep the current gradient and record the
   deviation in the file comment; do not mix both (gradient plus
   halftone reads muddy).
2. Card radius: 16px to 10px.
3. Card min-height: 480px desktop to 520px; add 470px below 1400px;
   mobile (at or below 1023px) 350px instead of auto.
4. Breakpoints: replace the single 900px breakpoint with stepped
   1400px and 1023px breakpoints. At or below 1023px: single column,
   45px gaps, title 28px, min-height 350px. Desktop gap becomes 20px
   (from 24px).
5. Title size: fluid clamp to stepped 36px desktop / 28px mobile.
6. Description color: white at 90 percent to white at 80 percent.
7. Dotted rule: replace the `hr` dotted border with the
   repeating-gradient square tile, applied per title line via an
   inline title span (section 3 recipe); block-level repeating rule
   is the accepted fallback.
8. Pill transition: 0.25s to 0.3s (opacity and visibility).
9. Pill hover fill: delete the hover/focus-within overrides that set
   a white background and blue text. The pill stays transparent with
   a white border and white text in every state; only opacity and
   visibility animate.
10. Entrance: card rise from 20px over 0.7s to 40px over 0.6s, keeping
    the 0.15s per-card stagger steps. Keep the existing hairline draw
    and title/line fade sequence; those are v2 motion-layer additions
    and do not conflict with the card measurements.
11. Shimmer: if edit 1 adopts the flat fill plus halftone, delete the
    18s drift animation (the reference texture is static as far as CSS
    shows). If edit 1 keeps the gradient, keep the drift exactly as
    it is (highlights only, 18s alternate, disabled under
    prefers-reduced-motion) and label it as a v2 enhancement in the
    file comment.
12. Reduced motion: keep the existing block (full visibility, no
    transitions, drift disabled). No change needed.

Notes and judgment calls (do not silently override):

- Note 1, section padding: the reference section padding is 30px top
  and 160px bottom, while v2 uses 130px top and bottom. This spec does
  NOT adopt the 30px top value, because the reference section follows
  a different predecessor section and v2's 130px top keeps the rebuild's
  own section rhythm consistent. If the parent wants strict section
  fidelity, adopting 30px top / 160px bottom is a one-line change, but
  it must then be re-checked against the tall pinned quote section
  that now precedes services on the homepage.
- Note 2, card padding: UNVERIFIED, so v2's 32px sides and 36px bottom
  are kept. Do not copy a padding value from another reference section.
- Note 3, the top hairline draw on each card is a v2 motion addition
  (translucent white, drawing left to right). It has no reference
  counterpart in the carried card measurements and is kept as a v2
  enhancement, not presented as reference behavior.

Do-not-change list: column copy and order; pill destinations (existing
internal pages only); no card lift; no shadow change on hover; no
image zoom (there are no images); reduced-motion behavior; dark
`#010101` section background; keyboard focus-within reveal and
focus-visible outline on the pill link.

## 7. Acceptance checklist for the implementing agent

- [ ] Cards render flat `#0859D4` with a visible halftone texture in
  multiply (or the gradient deviation is recorded in the file comment).
- [ ] Radius 10px; min-heights 520px / 470px / 350px at the stepped
  breakpoints; gaps 20px desktop / 45px mobile; single column at or
  below 1023px.
- [ ] Titles 36px desktop / 28px mobile; body text white at 80 percent.
- [ ] Dotted rule is square tiles from a repeating gradient, per title
  line if the span technique holds, else one block rule with the same
  tile recipe (no `border-top: dotted`).
- [ ] Pill invisible at rest; fades in over 0.3s on card hover or
  focus-within; fill stays transparent with white border and text in
  every state (no white-fill hover state anywhere).
- [ ] No transform, box-shadow, or background change on the card
  itself in any hover state.
- [ ] Entrance is 0.6s from 40px down with per-card stagger; cards are
  fully visible with no transition under prefers-reduced-motion, and
  the drift (if kept) is disabled there too.
- [ ] Keyboard: tabbing into a card reveals its pill; the pill link
  shows a visible focus outline.
- [ ] `npx tsc --noEmit` clean for the file; grep 0 em dash in the file;
  no reference copy, offering names, or client names introduced.
- [ ] Visual check in a real browser at desktop, 1400px, and mobile
  widths (subagent check is static only; the parent owns this step).

## 8. Open questions and follow-up measurements

1. Stylesheet re-verification: record the loaded `home-servicios` and
   `card-servicio` stylesheet URLs from the live browser network panel
   and re-read the raw rules, especially the shader layer definition
   (dot size, tile pitch, blend mode, opacity) and the pill geometry.
2. Pill rest state: live computed-style check of a non-hovered card's
   pill (opacity, visibility) to resolve the dimmed-siblings
   discrepancy in section 4.
3. Texture motion: a screen recording (not stills) of the reference
   cards at rest, to settle whether the blue texture moves and, if so,
   its loop duration. Until then, no loop duration may be quoted for
   the reference.
4. Card padding, pill padding/height/border width, title weight, and
   mono-label presence: all UNVERIFIED; each needs one computed-style
   read from the live page.
5. Section padding decision: confirm whether to adopt the reference
   30px top / 160px bottom against the rebuild's pinned-quote
   predecessor (see section 6 note 1).

## 9. Sources

- `docs/motion/02-onlines-visual-forensics.md` section 5 (carried
  fetched-CSS measurements for the services and service-card
  stylesheets) and section 11 (site-wide motif and easing rules).
- `research/03-onlines-layout.md` (section grid, dark variant, theme
  and motion context) and `research/04-onlines-tipografi-warna.md`
  (single accent color, halftone texture usage in dark blocks).
- Parent browser pass over the live reference homepage (stills
  observations: tall rounded blue cards, subtle organic texture
  impression, hovered pill bright vs dimmed siblings impression).
- Current rebuild file `src/sections/Services.tsx` (v2 values quoted
  in the measurement table).
- Attempted this run, no asset URL recovered: homepage text fetch
  (stylesheet links stripped) and web search for the stylesheet names
  (no asset URL returned). No URL was constructed or guessed.
