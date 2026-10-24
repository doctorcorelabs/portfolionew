# Hero collage system (v7, doc 01)

Reference-style floating cards scattered around the giant word, so the
hero stops being plain text plus moving cursors. Every card is built
from recorded facts only. Nothing here is a data visualization: every
drawn diagram is an illustrative schematic, never a plot of results.

## 1. Concept and layer order

The hero keeps its existing structure: faint graph-paper grid, the
giant word "daivanlabs." in a dashed selection frame with 6 handles,
the mono label above the frame, 4 rAF cursor chips, and 3 floating
fact pills. The collage is one new layer added to that stack, never a
replacement for any of it.

Z-order, bottom to top:

1. Grid (existing `.mv-grid`, absolute, inset 0).
2. Collage layer (new, absolute, inset 0, z-index 0).
3. Word and frame (existing, z-index 1). The frame has no background
   fill, so collage cards show through its transparent area; only the
   word glyphs themselves can cover a card.
4. Diorama layer (existing `.mv-diorama`, z-index 2): cursor chips
   and fact pills stay on top.

Rules that follow from this order:

- Collage cards NEVER sit under the center of the word. Cards live in
  the top strip above the frame, the bottom strip below the frame,
  and the far side gutters. A card may tuck at most 30px under the
  dashed frame border on short stages, never under word glyphs.
- The collage layer is `pointer-events: none` everywhere, exactly
  like the diorama layer, so frame drag (fine pointers only) keeps
  working and page scroll is never hijacked.
- Cards are `aria-hidden` decoration plus a short visible caption.
  No card carries information that exists nowhere else on the site;
  each card repeats a fact the Works, Journey, or archive sections
  already state. Nothing is hover-only and nothing is click-only.
- Entrance: the collage layer fades in (0.8s) once the frame fade is
  underway (1.6s delay), after the word and before the diorama chips
  finish entering. Under reduced motion it is visible immediately.

## 2. Existing positions the collage must avoid

Read from `src/sections/Hero.tsx` (do not move these):

- Cursor chip anchors (drift radii 32 to 56px around each anchor,
  rAF-driven, top layer, pointer-dead): FAERS (4%, 16%), StrokeSense
  (96%, 20%), Code for Cure (5%, 82%), Seoul 2026 (95%, 76%).
- Fact pills (float plus/minus 10px): "Hypertension Seoul 2026"
  (top 30%, right 10%), "Code for Cure" (bottom 30%, right 14%),
  "FAERS N = 6,601" (top 64%, left 7%).
- Frame: centered, max-width 1160px, padding 28px 32px, word
  clamp(72px, 16vw, 180px) at line-height 0.95, label above the frame.
  Stage: min-height 550px, height calc(100dvh - 100px), padding
  80px 24px.

Consequences for placement:

- Collage cards must keep clear of the three fact pill boxes by at
  least 40px in both axes (pill float included). The positions in
  section 3 satisfy this at stage widths 1280px and 1600px and at
  stage heights 700px and 900px; the builder must re-verify at those
  four sizes and shift a card by up to 2% if a pill box is touched.
- Drifting cursor chips are exempt from the no-overlap rule: they
  are small, pointer-dead, top-layer, and transient. A chip may cross
  a card corner while drifting; it must never rest on a card. Card
  positions keep at least 60px from chip anchor points where the
  layout allows (FAERS flow card, section 3, is the tightest case
  and is handled by its compact height).
- Collage cards must not overlap each other. The positions below
  leave at least 30px between neighbouring cards at 1280px width.

## 3. The 9 components and their desktop positions

All positions are percentages of the hero stage. All cards: white
background, 1px solid #E0E0E0 border, 10px radius, soft shadow
(0 2px 8px rgba(1, 1, 1, 0.06)), mono microcopy in JetBrains Mono,
pointer-events none, aria-hidden on decorative drawing parts. Card
widths are fixed px so text never reflows into neighbours.

### C1. FAERS flow card (top strip, left)
- Position: left 3%, top 22%, width 250px, max-height 92px, compact.
- Content: two-step flow in mono microcopy. Step 1: "7,519 reports
  screened". Step 2: "6,601 analysed". Caption: "FDA FAERS, resistant
  hypertension". No third step, no outcome, no effect value.
- Why here: the FAERS chip anchor (4%, 16%) drifts above it; the
  compact height keeps a gap of about 20px to the chip drift zone,
  and the card clears the frame top border on tall stages. On short
  stages it may tuck under the dashed border by up to 30px, which
  the z-order allows.
- Source: content.ts research item faers-resistant-hypertension
  (sampleSize 6601) and the recorded 7,519 to 6,601 flow. FAERS
  homepage rule applies (section 5).

### C2. Systematic review pipeline strip (top strip, right)
- Position: right 3%, top 6%, width 260px, height about 64px.
- Content: four mini nodes joined by a dashed line: Search, Screen,
  Extract, Synthesize. Microcopy under the strip: "Method diagram,
  not data".
- Source: recorded methodologies in content.ts (Systematic Review)
  and the CV.md systematic review grants. No counts, no dates.

### C3. Seoul congress card (top strip, left-center)
- Position: left 30%, top 6%, width 240px, height about 110px.
- Content: "Hypertension Seoul 2026", "Poster ABST-000034",
  "Conrad Seoul, 5 to 7 November 2026". A small blue dot marks the
  poster line. No result, no effect value.
- Source: content.ts faers-resistant-hypertension venue and notes
  (poster code ABST-000034, final poster v3).
- Clearance: bottom edge clears the centered label zone above the
  frame at 700px and 900px stage heights.

### C4. Award badge card (top strip, right-center)
- Position: right 20%, top 6%, width 230px, height about 110px.
- Content: two lines, no counts, no totals. Line 1: "Most
  Outstanding Student UII 2025". Line 2: "Beasiswa Unggulan 2023".
  A small gold dot decorates line 1, a small blue dot line 2.
- Source: CV.md national honors and content.ts awards. The card
  deliberately shows no award total: totals are not stated on the
  card, so no total can be wrong.

### C5. Amomum breast cancer schematic (bottom strip, left)
- Position: left 3%, bottom 8%, width 230px, height about 150px.
- Content: abstract compound diagram in pure SVG: one large circle
  (a cell, outline only), three small circles (compounds), thin
  lines joining them, no axis, no scale, no numbers. Microcopy:
  "Illustrative schematic". Caption: "Amomum cardamomum, breast
  cancer, in silico".
- Source: CV.md publication title on Amomum cardamomum seed-derived
  compounds for breast cancer therapy, and content.ts publication
  amomum-cardamomum-breast-cancer-therapy. The drawing shows no
  compound, no pathway, and no result.
- Clearance: top edge clears the "FAERS N = 6,601" pill box
  (top 64%, left 7%) by at least 40px at 700px stage height.

### C6. Gut-axis schematic (bottom strip, left-center)
- Position: left 28%, bottom 6%, width 230px, height about 150px.
- Content: a winding dashed line (the gut axis) with three hollow
  nodes along it, no axis, no scale, no numbers. Microcopy:
  "Illustrative schematic". Caption: "Gut axis and leukemia,
  systematic review".
- Source: CV.md publication titles on the microbiome gut axis in
  chronic myeloid leukemia (both language versions recorded as one
  study topic, shown once) and content.ts key project "Gut Axis and
  Leukemia". No outcome, no result.

### C7. StrokeSense FAST card (bottom strip, center)
- Position: left 52%, bottom 6%, width 230px, height about 110px.
- Content: a mini interface mock: three letter tiles F, A, S and a
  line reading "Observation Sheet". Microcopy: "Illustrative
  interface mock". Honesty line in 10px mono: "No score, no
  diagnosis. Education only."
- Source: content.ts strokesense-ai-lab notes (FAST Live Check as
  flagship, Observation Sheet without a score and without a
  diagnosis) and strokesense-education-first (education-first
  framing only). The card must never say the tool detects, scores,
  classifies, or diagnoses stroke.
- Clearance: left edge clears the "Code for Cure" pill box
  (bottom 30%, right 14%) and the C6 card.

### C8. Photo card (bottom strip, right)
- Position: right 4%, bottom 8%, width 180px.
- Content: the existing public portrait asset /profile.webp
  (already used by the Profile section, already optimized), with
  caption "Daivan Febri Juan Setiya, Founder, DaivanLabs".
  Meaningful alt text on the image; the card frame is a white
  border card, not a dashed selection frame (only the giant word
  gets the selection frame).
- Source: the portrait already published on the old site and in
  Profile. No new photo, no generated portrait.
- Clearance: the Seoul 2026 chip drifts near its top-right corner
  transiently (chips exempt, section 2); the card itself clears
  the "Code for Cure" pill box.

### C9. Research threads card (wide screens only)
- Position: right 1.5%, top 44%, width 200px, height about 130px.
  Visible only at stage width 1400px and above (media query);
  display none below that.
- Content: three thread labels, one per line, each with a small
  hollow dot: "PCOS", "Bisphenol A and cancer", "TB drug discovery".
  No years on this card: CV.md records no year for these items, so
  none is shown (see section 5, undated items rule).
- Source: content.ts key projects (Dietary Impacts on PCOS,
  Bisphenol A and Cancer, TB Drug Discovery).
- Clearance: on 1400px and wider stages the word's right edge
  (final period glyph) clears the card's left edge; the card may
  tuck at most 12px under that glyph, never under word center.

## 4. Mobile behavior

Below 900px stage width, the desktop scatter does not fit, so the
collage collapses:

- Show only C1 (FAERS flow card) and C8 (photo card). Hide C2, C3,
  C4, C5, C6, C7, and C9 (display none).
- The two surviving cards leave the absolute layer and stack in
  normal flow BELOW the frame, in order C1 then C8, centered, each
  max-width 320px, with 16px vertical gap. The section height
  becomes auto (min-height 550px kept) so the stacked cards are
  never clipped and never overlap the word.
- The existing rules still apply on mobile: the diorama layer is
  already hidden on touch devices and pills already hide below
  900px, so the stacked cards are the only floating-style elements
  left, and they are static, not floating.
- The FAERS homepage rule and the schematic honesty rules apply
  unchanged on mobile. The photo caption stays with the photo.

## 5. Motion

- Float loops: every card floats translateY only, ease-in-out,
  infinite alternate, with desynced durations and delays. Assigned
  durations: C1 11s, C2 14s, C3 9s, C4 16s, C5 12s, C6 15s, C7 10s,
  C8 13s, C9 16s with a 2.4s delay (so C4 and C9 never share a
  phase). Amplitudes: plus/minus 6px for text cards, plus/minus
  8px for the photo card. Float starts after the entrance fade
  (animation-delay covers entrance plus float offset, same pattern
  as the existing fact pills).
- Pointer parallax: on mouse devices only (matchMedia hover:hover
  and pointer:fine), a mousemove listener on the hero section
  translates the whole collage layer by at most plus/minus 8px in
  each axis, proportional to pointer distance from stage center.
  The listener is rAF-throttled and passive in effect (it only
  writes one transform, never reads layout per frame beyond the
  cached stage rect, refreshed on resize). Parallax moves the
  layer as one unit; individual cards keep their own float on top
  via inner elements, so the two transforms never fight.
- Reduced motion: all float loops off, parallax listener never
  attached, collage layer fully visible and static. The existing
  reduced-motion block pattern (display none for diorama, visible
  static for content) is extended, not replaced.
- Touch: float loops off and parallax never attached, matching the
  existing diorama behavior. On touch at 900px and wider the cards
  render statically in their desktop positions; below 900px the
  mobile stacking rule governs instead.
- Performance: float and parallax use transform only. No card
  animates width, height, top, left, margin, or box-shadow. The
  single allowed exception is the existing grid pan
  (background-position, already shipped), which this layer does
  not touch.

## 6. HARD content rules (builder must verify each card against these)

1. No invented numbers. Every number on a card must already appear
   in CV.md or content.ts for that item. Allowed numbers in this
   system: 7,519 and 6,601 (FAERS flow), 2025 and 2023 (award card
   years), 2026 and ABST-000034 and 5 to 7 November 2026 (Seoul
   card). No other number may appear on any card.
2. FAERS homepage rule: the hero may show only N = 6,601 and the
   7,519 to 6,601 flow, with the hypothesis-generating framing the
   site already uses. NEVER any effect value, confidence interval,
   or p-value, and never any event-case count (none is recorded).
   The FAERS detail page keeps the full verified plot; the hero
   does not.
3. No journal names, no DOIs, no volumes, no author lists. None
   are recorded for these items, so none are shown. The Seoul card
   names the congress and the poster code, not a journal.
4. Every schematic carries its honesty microcopy in 10px mono:
   "Illustrative schematic" (C5, C6), "Method diagram, not data"
   (C2), "Illustrative interface mock" (C7). A schematic without
   its microcopy fails review.
5. StrokeSense only as an education-first lab. The FAST card says
   "Observation Sheet" and "No score, no diagnosis. Education
   only." Never: detects, diagnoses, scores, classifies, or any
   symmetry or central versus Bell palsy claim. The 20 Oct 2026
   audit finding (Face Lab claims conflict with the education-first
   scope) is the reason, and it stays out of the hero entirely.
6. Undated items stay undated. PCOS, Bisphenol A grants, and TB
   drug discovery carry no year on C9, because CV.md records no
   year for them. Do not borrow the old-site grouping year.
7. Cerclage and the Doppler e-poster do not appear in the hero.
   Cerclage has no result numbers and is a manuscript in progress;
   the Doppler e-poster is archived with an unconfirmed role. Both
   stay out of the collage.
8. Retired lines stay retired. Do not use "fourth year
   undergraduate" (superseded by the clinical clerkship recorded
   in content.ts timeline). Do not use the phone number or home
   area recorded in CV.md anywhere, on any card or in any doc.
9. No em dash anywhere: in the doc, in card copy, in microcopy.
   Use a hyphen or reword. The existing hero copy already follows
   this rule.
10. No reference copy and no reference client names. The concept
    (scattered floating cards around one giant word) is the
    reference language; its words, labels, and client material are
    not copied. All card words above are Daivan's own recorded
    facts.
