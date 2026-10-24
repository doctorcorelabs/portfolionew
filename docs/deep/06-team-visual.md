# 06 - Team + Profile Visualization: Deep Analysis

Deep analysis 6/15. Scope: the reference team stage (the section that
presents the team around one oversized title) compared with v2's
Profile section, the one-person equivalent. This doc contains
measurements and deltas only. It does not reproduce reference copy:
no headline wording, no member names, no role labels, and no
testimonial text appear here. Elements are described functionally.

## 0. Method and evidence key

Sources used for this doc, in order of weight:

- `docs/motion/02-onlines-visual-forensics.md` section 6 (team stage),
  section 2 (grid), section 9 (dot field), section 11 (cross-cutting
  rules). These are measurements from production stylesheets fetched
  on 24 Oct 2026.
- `research/03-onlines-layout.md` (section order, container 1160px,
  breakpoints 1432px and 1023px).
- `src/sections/Profile.tsx` (v2 Profile as built, including the
  motion v3 highlight).
- A homepage text fetch on 24 Oct 2026, used only to confirm section
  order and that the team stage exists. It renders no CSS, so nothing
  in it counts as a measurement.
- A targeted web search for the team block stylesheet returned no
  usable asset URL, so no new stylesheet was fetched for this doc.
  Every value below that is not in the sources above is marked
  UNVERIFIED rather than filled in.

Evidence labels:

- VERIFIED (CSS): present in a stylesheet fetched for the earlier
  forensics task and quoted in doc 02.
- VERIFIED (v2): read directly from `src/sections/Profile.tsx`.
- UNVERIFIED: could not be confirmed from CSS or v2 source. It needs
  a live-browser check, not a guess.

## 1. Reference team stage: measurement tables

### 1.1 Stage geometry

| Element | Desktop | Below 1400px | Mobile (1023px and below) |
|---|---|---|---|
| Stage height | 747px fixed | Not separately stated (UNVERIFIED) | 620px fixed |
| Stage max width | 1520px, wider than the 1160px content container | Not separately stated (UNVERIFIED) | Re-anchored coordinates (see 1.3) |
| Background | Its own faint grid, at full opacity | UNVERIFIED | UNVERIFIED |
| Layout model | Absolute positioning for floating elements around a centered title column | Percentage coordinates | Re-anchored coordinates |
| Content column interaction | pointer-events none, except for its button, so floating cards never block reading the title | UNVERIFIED | UNVERIFIED |

Notes on the grid: doc 02 states the team stage has "its own faint
grid background at full opacity" but gives no pitch, line weight, or
color for the team grid itself. The hero grid measurements (40px
pitch, 1px lines at 3 percent black in the editor variant; white at
8 percent in dark mode, 5 percent in the lit variant) belong to the
hero, not the team stage. Do not transfer them. Team grid pitch,
color, and opacity values are UNVERIFIED.

Stage background color (light or dark) is UNVERIFIED from CSS. Doc 02
does not state it for this section.

### 1.2 Title and selection highlight

| Property | Value | Evidence |
|---|---|---|
| Title size, desktop | 96px, one line, nowrap, deliberately wider than the viewport | VERIFIED (CSS) |
| Title size, below 1400px | 72px | VERIFIED (CSS) |
| Title size, mobile | 38px, wrapped and centered | VERIFIED (CSS) |
| Highlight coverage | The second half of the title | VERIFIED (CSS) |
| Highlight behavior | A translucent blue bar grows from width 0 to full width | VERIFIED (CSS) |
| Highlight duration and easing | 2000ms, ease-out curve | VERIFIED (CSS) |
| Highlight edge handles | Two blue handles that track the highlight edges: 4px bars with 16px round knobs | VERIFIED (CSS) |
| Highlight exact color (hex or rgba) | UNVERIFIED | Not stated in the fetched CSS summary |
| Highlight trigger (scroll, load, or class) | UNVERIFIED | The visible-class mechanism is known for cards (see 1.3); the highlight trigger itself is not separately confirmed |
| Title button | Standard pill: 50px tall, 100px radius, blue fill, white text | VERIFIED (CSS) |
| Button hover | To a brighter blue over about 0.34s | VERIFIED (CSS) |

Reading of the highlight: this is the section's main event, not a
decoration. It takes a full 2 seconds, longer than any entrance on
the page except the hero sequence, and it has moving parts (the two
handles) that visibly track the growth. The first half of the title
is plain; only the second half is selected. That asymmetry is the
point: the highlight reads as an editor selection made by an unseen
hand, which is why the handles exist at all.

Comparison with the quote paint (doc 02 section 3): the quote paints
word by word on scroll over a long pinned runway; the team highlight
grows as one continuous bar over 2 seconds. Same editor-selection
language, two different timings: scrubbed and fragmented in the
quote, smooth and continuous in the team title.

### 1.3 Floating member cards

| Property | Value | Evidence |
|---|---|---|
| Count | Six cards | VERIFIED (CSS) |
| Card size, desktop | 90px square | VERIFIED (CSS) |
| Card size, mobile | 70px square | VERIFIED (CSS) |
| Card image | Photo filling the card at cover fit | VERIFIED (CSS) |
| Card corner | 8px radius, except for a 1px bottom-left corner | VERIFIED (CSS) |
| Card shadow | Tiny soft shadow (exact blur and spread UNVERIFIED) | VERIFIED (CSS), values partial |
| Card label | Mono 8px uppercase role label underneath each card | VERIFIED (CSS) |
| Card positioning, desktop | Absolute, fixed pixel coordinates | VERIFIED (CSS) |
| Card positioning, below 1400px | Percentage coordinates | VERIFIED (CSS) |
| Card positioning, mobile | Re-anchored coordinates | VERIFIED (CSS) |
| Card entry | From scale 0.5 and opacity 0 to scale 1 and opacity 1 | VERIFIED (CSS) |
| Card entry duration and easing | 0.6s, ease-out curve, when a visible class is added | VERIFIED (CSS) |
| Card entry stagger | UNVERIFIED | No per-card delay is stated for this section |
| Card hover | No hover rule stated for these cards in the fetched CSS | UNVERIFIED (absence in one stylesheet is not proof of no JS hover) |
| Exact card coordinates | UNVERIFIED | Positions are described as fixed/percentage/re-anchored, but no coordinate list is recorded in doc 02 |

### 1.4 Comment bubbles and notification pills

| Property | Value | Evidence |
|---|---|---|
| Comment bubbles near cards | Start 12px down, rise into place over the same 0.6s duration as the cards | VERIFIED (CSS) |
| Bubble text, count, and positions | UNVERIFIED | Not recorded in the fetched CSS summary |
| Notification pills floating around the stage | Present as a floating layer in the rendered page, but no size, position, duration, or drift values are recorded in the fetched CSS summary | UNVERIFIED |
| Drift or loop motion on cards or pills | UNVERIFIED from CSS | The hero's floating cursors are documented as scroll-driven via requestAnimationFrame (doc 02 section 2); no equivalent statement exists for the team stage |

Do not confuse the two floating layers. The cards are the measured
layer (90px, pop entrance, mono labels). The bubbles are measured
only for their rise (12px, 0.6s). The pills are confirmed to exist
in the rendered page but are otherwise unmeasured. Any pill size,
drift speed, or loop path quoted elsewhere without a CSS source is
a guess.

### 1.5 Balance: how a giant title survives many floating elements

The stage avoids clutter with five measurable disciplines, not with
restraint in element count:

1. One dominant size. The 96px title is larger than any floating
   element (90px cards). The eye lands on type first; cards read as
   satellites, not competitors.
2. Edge placement. Cards are absolutely positioned around the stage,
   not interleaved with the title text. The title column keeps the
   center; the collage keeps the margins.
3. Interaction priority. The content column is pointer-events none
   except its button. Even where a card overlaps the title area, it
   cannot block reading or clicking the button.
4. One accent, one motif. Blue appears only in the highlight, its
   handles, and the pill button. Cards are photos with tiny mono
   labels, not colored panels. Nothing else competes for color.
5. One motion family, then stillness. Cards pop once (0.6s ease-out)
   and bubbles rise once (0.6s). No hover rule is recorded for the
   cards, and no loop is recorded for this stage. After entrance the
   stage is calm, which is why the 2-second highlight can hold
   attention instead of fighting six drifting objects.

The stepped breakpoints protect the same balance on small screens:
instead of shrinking everything fluidly, the stage re-anchors its
cards, drops the title to a wrapped centered 38px, and shrinks cards
to 70px. The hierarchy (title bigger than cards) survives because
both sides step down together.

## 2. V2 Profile section: measured as built

Read from `src/sections/Profile.tsx` (VERIFIED (v2)):

| Property | V2 value |
|---|---|
| Section background | #FAFAFA, ink #010101 |
| Section padding | 130px vertical, 24px horizontal |
| Container | 1160px centered, single column, no stage |
| Section height | Content-driven (no fixed stage height) |
| Mono kicker | "Profile", JetBrains Mono 12px, uppercase, letter-spacing 0.08em, muted #666666 |
| Title | "A researcher who builds.", clamp(48px, 8vw, 96px), line-height 1.02, letter-spacing -0.02em, weight 700, max-width 900px, wrapped (not nowrap), not wider than the viewport |
| Title highlight (motion v3) | Static: light-blue background #DCE9FD on one word only, 4px solid blue left bar (#0859D4), padding 0 10px 0 8px, box-decoration-break clone. No growth animation, no travelling handles, no caret bar that moves |
| Bio column | Max-width 680px, 18px text, 1.65 line height, three paragraphs plus a mono 13px status line with a mailto link |
| Anchor numbers | Seven plain text rows (label + value) separated by #E0E0E0 hairlines, flex baseline layout, label mono 13px muted, value 18px bold |
| Floating elements | None. No cards, no bubbles, no pills, no grid background, no collage layer |
| Button | None. The only action is the mailto link, which draws its underline on hover/focus over 300ms |
| Entrance motion | Scroll reveal: fade plus 18px rise over 600ms, cubic-bezier(0.22, 1, 0.36, 1), 80ms stagger steps for bio paragraphs and anchor rows, IntersectionObserver threshold 0.15, fires once |
| Reduced motion | Everything shown instantly, no transitions |
| Title scale match | The 96px maximum matches the reference title size; the 48px minimum is above the reference mobile 38px |

## 3. Delta list: reference vs v2 Profile

Ordered by visual impact, largest first. Each delta states the
reference value, the v2 value, and what closing it would take.

1. No floating layer at all. Reference: six 90px cards plus bubbles
   and pills scattered on a 747px stage. V2: zero floating elements
   on a content-height section. This is the largest single gap: the
   reference stage reads as a scene, v2 reads as a document. Closing
   it needs a real collage layer, not more text styling.
2. Highlight is static and small. Reference: a 2000ms growing bar
   over the second half of the title with two travelling handles
   (4px bars, 16px knobs). V2: an instant light-blue background on
   one word with a fixed 4px left bar and no handles. Closing it
   needs a width-animated highlight span plus two handle elements
   that track its edges, triggered on scroll into view.
3. No stage geometry. Reference: fixed 747px stage (620px mobile),
   1520px wide, faint grid at full opacity, absolute positioning.
   V2: content-height section, 1160px container, flat #FAFAFA,
   no grid. Closing it needs a fixed-height stage wrapper with a
   faint grid layer behind the title column.
4. Title is wrapped and contained. Reference: 96px nowrap, wider
   than the viewport on desktop, 38px wrapped and centered on
   mobile. V2: clamp(48px, 8vw, 96px) wrapped at max-width 900px,
   48px minimum on mobile. Closing it needs nowrap at desktop with
   intentional overflow, and a 38px centered mobile rule.
5. No title button. Reference: 50px blue pill, 100px radius, hover
   to brighter blue in about 0.34s, and the only pointer-events
   exception in the title column. V2: no button; only a mailto link
   in the status line. Closing it needs a pill button under the
   title (destination must be an existing internal page or the
   mailto address; no invented destination).
6. No pointer-events discipline. Reference: content column
   pointer-events none except the button, so collage never blocks
   reading. V2: normal pointer events everywhere, which is fine
   today only because v2 has no collage to collide with. This delta
   becomes a bug the moment delta 1 is closed; it must be fixed in
   the same change as any floating layer.
7. Entrance language differs. Reference: cards pop from scale 0.5
   (0.6s ease-out) and bubbles rise 12px (0.6s). V2: text fades and
   rises 18px over 600ms with 80ms staggers. Durations coincide
   (0.6s) but the transform does not: v2 has no scale pop anywhere
   in this section. Closing it needs a scale-based pop reserved for
   floating objects only, never for text (per doc 02 section 11:
   overshoot and pop belong to physical objects, not text).
8. Mono label scale differs. Reference role labels: mono 8px
   uppercase under 90px cards. V2 kicker and row labels: mono
   12-13px. V2 labels are roughly 1.5x the reference label size,
   which fits a text section but would look heavy under small cards.
   Any future card labels should use the 8px scale, not the 12-13px
   scale.
9. Grid background missing. Reference: faint grid layer on the team
   stage. V2: no grid in Profile (the hero grid exists, but it
   belongs to the hero and scrolls away with it). Closing it needs
   the shared faint-grid treatment inside the Profile stage, with
   pitch and color measured for this section rather than copied
   from the hero.
10. Mobile behavior is untested against the reference pattern.
    Reference: re-anchored card coordinates, 70px cards, 38px
    centered wrapped title. V2: single column stacking, which is
    correct for text but has no floating layer to re-anchor. Any
    collage added for delta 1 needs its own mobile re-anchoring
    plan; desktop coordinates must not simply be scaled down.

What already matches and should not be changed:

- Title maximum size (96px) and weight 700.
- Single blue accent discipline (#0859D4 for links and highlight).
- Mono micro-labels for metadata (only the size differs, see
  delta 8).
- Calm after entrance: v2 reveals once and stops, which matches
  the reference stage's stillness after its 0.6s pops.
- Reduced-motion handling (v2 forces everything visible; the
  reference honors it for service cards, and its team-stage
  reduced-motion rule is UNVERIFIED, so v2's stricter behavior is
  the safer choice).

## 4. Honest adaptation notes for a one-person lab

These are proposals for the parent agent, not measurements. The
reference shows six people; v2 represents one person, so its
floating layer cannot be a literal copy. Any adaptation must use
only facts already recorded on the site:

- One portrait card at the reference 90px size (70px mobile) can
  anchor the collage, using the portrait already published on the
  old site. Six invented member cards must never be fabricated.
- Floating pills, if added, should carry recorded facts only, for
  example degree, scholarship, or affiliation labels already on
  the awards and education pages. No invented role, quote, or
  testimonial may be attached to them.
- The anchor-number rows are v2's honest substitute for a team
  roster: they prove scale (awards, publications, roles) without
  inventing people. If a collage layer is added, the rows should
  stay; the collage should frame the title, not replace the rows.
- The highlight growth (delta 2) is the cheapest high-impact fix:
  it needs no new content, no images, and no layout restructure,
  only a width animation plus two handle elements on the existing
  title.
- The stage (delta 3) is the most expensive fix: it changes the
  section from document flow to a fixed-height positioned stage
  and needs mobile re-anchoring. It should land together with
  delta 1 and delta 6, not alone.

## 5. UNVERIFIED list (do not build from guesses)

- Team stage background color (light or dark).
- Team grid pitch, line weight, and color.
- Highlight exact blue value (hex or rgba) and its trigger.
- Member card exact coordinates on desktop, percentage positions
  below 1400px, and mobile re-anchored positions.
- Member card entry stagger, if any.
- Member card hover behavior (CSS shows none; JS behavior unknown).
- Comment bubble text, count, and positions.
- Notification pill sizes, positions, drift paths, and durations.
- Team stage reduced-motion behavior.
- Whether the title button label or destination pattern matches
  any other section's button (only size, radius, fill, and hover
  timing are verified).

## 6. Sources

- `docs/motion/02-onlines-visual-forensics.md` sections 2, 6, 9,
  11, 12 (production stylesheet measurements, 24 Oct 2026).
- `research/03-onlines-layout.md` (section order, 1160px container,
  1432px and 1023px breakpoints).
- `src/sections/Profile.tsx` (v2 Profile as built through motion
  v3).
- Reference homepage text fetch, 24 Oct 2026 (section order only).
- Targeted web search for the team block stylesheet, 24 Oct 2026
  (no usable asset URL returned; no new stylesheet fetched).
