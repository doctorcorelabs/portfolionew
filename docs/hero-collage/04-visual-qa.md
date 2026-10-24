# Visual QA: hero collage (04)

Scope: `src/sections/Hero.tsx` (collage layer only) plus the 9 files in
`src/components/hero-collage/`. REPORT ONLY: no site edits, no build.
Method: code inspection of positions, sizes, z-index, and media
queries, plus a geometry model. No live browser check was possible,
so every pixel figure below is computed, not screenshotted.

## Geometry model and assumptions

- Stage: height `calc(100dvh - 100px)`, min-height 550px, padding
  80px top/bottom, 24px sides. Tested stages (width x hero height):
  1440x700, 1280x700, 1100x600, 1440x550.
- Word block: label about 46px (12px font plus 32px margin) plus
  frame padding 56px plus word 171px (180px font at line-height
  0.95) = about 273px tall, vertically centered. Word text band:
  top = H/2 minus 62.5, bottom = H/2 plus 108.5. Word center point =
  (50% width, H/2 plus 23). The word is centered text, so the center
  point is exact even though the word width is estimated.
- Card heights are estimated from padding plus content (table
  below). Card widths are exact from code, except GutAxisCard (see
  G1): its root and its item both lack a width, and its SVG is
  `width: 100%` inside a shrink-to-fit absolute box, which resolves
  to roughly 300px, giving a card about 308 to 328px wide. The
  overlap conclusions for that card hold across that whole range.
- Layer order: grid (auto) below collage (z-index 0) below
  frame/label (z-index 1) below diorama chips and pills (z-index 2).
  The collage layer is pointer-events none and aria-hidden, with
  overflow hidden; the section itself also has overflow hidden.
- At 1100px width and below, helix and awards are hidden by
  `mv-collage-hide-mid`, so their 1100 numbers below describe
  widths just above 1100.
- Baseline check: the Hero.tsx diff is 175 insertions, 0 deletions,
  so the pre-existing hero (word, frame, drag, chips, pills, grid
  pan) is untouched.

## Per-card verdicts

| Card | Size (w x h) | Position | Verdict | Evidence |
| --- | --- | --- | --- | --- |
| docking (DockingCard) | 230 x ~186 | left 2.5%, top 3% | PASS | Clear of word text by ~80px at 700 height. At 550 height the bottom edge sits ~10px above word text; worst case parallax (8px down) leaves ~2px. No card neighbor (helix starts at x 389 at 1440). No text clipped: labels fit one line. |
| helix (DnaHelix) | 150 x 375 | left 27%, top 2% | FAIL | Intrudes into the word text band at every realistic desktop height: ~101px at 1440x700, ~171px at 1440x550. It never covers the word center point (x range 27% to 37%), and the word paints above it (z-index 1 vs 0) so letters stay legible, but blue/grey strands cross the word's left letters, contradicting the integration comment ("never over the word band in the middle"). Hidden below 1100px, so tablet/mobile are unaffected. See G3. |
| review (ReviewCard) | 220 x ~197 | right 27%, top 3% | PASS | Clear of word text by ~69px at 700. At 550, about 1.5px into word text: negligible and the word paints above. Synthesis bar fits by ~3px (see G7). |
| poster (PosterCard) | 260 x ~190 | right 2.5%, top 2% | PASS | Clear of word text by ~83px at 700; at 550 only the frame padding zone is touched, not text. Pill gap note, see G5. |
| faers (FaersCard) | 240 x ~193 | left 2.5%, bottom 4% | PASS with gap | Clear of word text by ~20px at 700. Intrudes ~48px into word text at 550 (see G4). No card neighbor. No text clipped. |
| gutaxis (GutAxisCard) | ~308 to 328 x ~222 | left 25%, bottom 3% | FAIL | Overlaps the photo card at every desktop width below about 1700px: 68px at 1440, 108px at 1280, 153px at 1100 (widths measured horizontally; full card height overlaps). Also touches word text at 700 (~2px) and intrudes ~71px at 550. Root cause: no explicit width plus a centered photo slot. See G1. |
| photo (PhotoCard) | 220 x ~204 | left calc(50% minus 110px), bottom 3% | PASS with gaps | Clear of word text by ~16px at 700; intrudes ~53px at 550 (see G4). Image path, aspect, and alt text all PASS (see photo section). Caption wraps to two lines at 220px width (see G7); nothing is clipped. |
| awards (AwardsCard) | 168 x ~122 | right 25%, bottom 4% | PASS | Clear of word text by ~91px at 700 and ~22px at 550. Hidden below 1100px. Narrow-window note, see G6. |
| stroke (StrokeCard) | up to 260 x ~135 | right 2.5%, bottom 5% | PASS | Clear of word text by ~71px at 700; ~4px margin at 550. Pill gap note, see G5. |

Literal word-center check: no card covers the word center point
(50% width, H/2 plus 23) at any tested stage. The closest approach
is gutaxis, which misses the center point vertically at every
height. The FAILs above are word-band intrusion (helix, short
stages) and card-on-card overlap (gutaxis/photo), not center-point
coverage.

## Layer, overflow, and responsive behavior

- Viewport overflow: PASS. Desktop: the section and the collage
  layer both clip (overflow hidden), so parallax (plus/minus 8px)
  and float (minus 8px) can never push a card outside the viewport.
  Right-anchored cards sit at 97.5% of stage width, inside the edge.
  Mobile: the layer becomes a static centered column; intrinsic
  widths (230, 240, 220) fit viewports 288px and wider. Below 288px
  the faers card edge clips inside the section; the viewport still
  does not overflow (see G8).
- Mobile count: FAIL. At 719px and below, the visible stack is
  docking, faers, photo (3 cards). The spec (brief plus doc 01
  section 4 plus the code comment itself) is 2 cards: faers then
  photo. Docking has an empty hide class where the others carry
  `mv-collage-mobile-hide`. See G2.
- Mobile placement: PASS. The collage div renders after the frame
  in DOM order, so the static stack sits BELOW the word, as
  intended. The section height becomes auto, so stacked cards are
  never clipped by a fixed stage height.
- Z-index: PASS. Cards never paint over word text (collage 0 below
  frame 1); chips and pills paint above cards (diorama 2), which is
  the intended overlay order.
- Reduced motion: PASS (noted, not scored). Collage fade-in and
  float are killed under prefers-reduced-motion, and the pointer
  parallax effect is off there.

## Photo card: path, aspect, alt text

- Path: PASS. `PhotoCard.tsx` references exactly `/hero-lab.jpg`
  (single reference in `src/`), and `public/hero-lab.jpg` exists:
  1920x1280 JPEG, 3:2, 267,773 bytes.
- Aspect: PASS. Displayed at 220px wide with `aspect-ratio: 4 / 3`
  plus `object-fit: cover`, giving a 220x165 image: sane, no
  distortion, only a slight side crop from the 3:2 source.
- Alt text: PASS, verified against the actual image file (not just
  the code). The image shows blue Erlenmeyer flasks with blue
  liquid and petri dishes with blue medium, which matches the alt
  text ("Blue laboratory glassware and petri dishes, illustrative
  ambience") exactly. The caption ("IN THE LAB" plus "Illustrative
  ambience") keeps the photo honest as illustration.

## Text clipping

PASS for all 9 items. Every label either wraps (poster title,
stroke lines, faers flow) or fits its box (docking labels, awards
figures, gut-axis node labels inside their rects, faers figure).
Two tightness notes, neither a clip: ReviewCard "Synthesis" fits
its 44% funnel bar by about 3px (nowrap plus overflow hidden, so a
wider font render would clip it); PhotoCard's caption needs about
238px on one line but has 196px, so "Illustrative ambience" wraps
to a second line and the caption grows taller instead of clipping.

## Cursor chips and fact pills

- Chips: EXEMPT, not scored as failures. Doc 01 section 2 states
  drifting chips are exempt from the no-overlap rule (small,
  pointer-dead, top-layer, transient, never resting on a card).
  For the record, all four chip drift zones do cross a card corner:
  FAERS chip over the docking zone, StrokeSense chip over the
  poster zone, Code for Cure chip over the faers zone, Seoul 2026
  chip over the stroke zone. No action unless the parent revokes
  the exemption (see G10).
- Pills: no overlap at standard stages (700 and 900 heights), but
  gaps at 700 fall short of doc 01's 40px rule: poster/pill 6px,
  faers/pill 5px, stroke/pill 14px. At 550 stages the poster/pill
  and faers/pill pairs truly overlap (pills paint above, text
  stays readable). See G5.

## Greps (Hero.tsx plus all collage components)

- Em dash: 0.
- Forbidden patterns (marquee, scroll-lock, cursor none): 0. Note:
  the draggable frame's `move`/`grabbing` cursor on fine pointers
  is pre-existing behavior, not a custom cursor.
- Copied reference copy: 0. "Onlines" appears only in 2 Hero.tsx
  comments attributing style. No Spanish copy, no client names,
  no reference text in any card. All card content is the user's
  own recorded research material.

## Gap list (ordered by severity)

- G1 (blocking): gutaxis/photo overlap below about 1700px stage
  width, plus gutaxis has no explicit width. Fix: set GutAxisCard
  width to 230 and add `mv-collage-hide-mid` to its hide class.
  At 1440 that gives about 49px clearance; at 1280 about 6px;
  below 1100 the card hides. Re-verify geometry after the fix.
- G2 (blocking for spec): mobile shows 3 cards, spec is 2. Fix:
  add `mv-collage-mobile-hide` to the docking item. This also
  restores the intended stack order (faers then photo).
- G3 (blocking for the word-band promise): helix intrudes into
  word text at all desktop heights (101px at 700, 171px at 550).
  Fix options: shrink the item width to about 100 (height 250;
  clears at 700, still about 14px intrusion below 620) or hide
  the helix on short stages with a max-height media query. The
  word paints above, so this is visual noise, not illegibility.
- G4 (short-stage crowding): at hero heights below about 680
  (viewport below about 780), bottom cards intrude into word
  text: faers ~48px, photo ~53px, gutaxis ~71px at 550. At the
  common 700-plus case only gutaxis touches (about 2px). Consider
  a max-height rule that shrinks or hides bottom cards on short
  stages.
- G5 (pill clearance): gaps below doc 01's 40px rule at 700 height
  (poster 6px, faers 5px, stroke 14px); real overlap only at
  short stages. If 40px is enforced, shift poster up or faers
  down; otherwise accept the near-miss (pills paint above and
  stay readable).
- G6 (minor, narrow window): awards/stroke overlap about 12px
  for stage widths 1101 to 1155 (awards hides at 1100 and below;
  the gap opens above 1156). Fix: nudge awards to right 26% or
  cap stroke width.
- G7 (minor, tight text): ReviewCard Synthesis bar fits by about
  3px (font dependent); PhotoCard caption wraps to two lines at
  220px width. Neither clips.
- G8 (minor, mobile deviations): stacked cards still float on
  mobile (doc 01 says static); stack gap is 12px vs doc 16px;
  faers at 240px exceeds the content box below 288px viewports
  (contained by section overflow, no viewport overflow).
- G9 (minor, ship hygiene): the untracked raw generated image
  plus its generation JSON sit in `public/` and would deploy,
  although only `/hero-lab.jpg` is referenced. Remove them
  before ship.
- G10 (note, not a gap): chip-over-card crossings are exempt per
  doc 01 section 2. No action unless the parent revokes that
  exemption.

## Verdict: FAIL (not sign-off ready)

Per-card: 6 PASS (docking, review, poster, awards, stroke, plus
photo and faers with short-height gaps noted), 2 FAIL (helix for
word-band intrusion, gutaxis for card-on-card overlap), and 1 spec
FAIL (mobile shows 3 cards, not 2). Greps all PASS (em dash 0,
forbidden patterns 0, copied reference copy 0). Photo path, aspect,
and alt text all PASS with the alt verified against the actual
image. The failures are small and specified: G1 (gutaxis width
plus hide-mid), G2 (one hide class on docking), G3 (helix size or
short-stage hiding). Re-run this QA after those three fixes; the
short-stage crowding (G4) and pill gaps (G5) may be accepted as
documented limitations if the parent prefers not to add a
max-height rule.
