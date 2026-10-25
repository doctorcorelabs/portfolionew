# 04 - Tablet (iPad) responsive audit

Scope: homepage only, at iPad breakpoints 768 (portrait), 820 (portrait),
1024 (landscape), plus the rule-flip edges 719/720, 1000, 1160, 1400.
Work tree: `portfolionew-work` (React 19 + Vite 7 + TS).

Method: code inspection plus geometry modeling only. No live browser check
was possible: the sandbox blocks localhost preview, so every pixel number
below is computed from source values, not observed on screen. Live
verification on a real iPad (or the Netlify preview) is still owed for the
items marked "verify live".

Viewport assumptions used in the math: 768x1024, 820x1180, 1024x768
(CSS pixels). Section side padding is 24px everywhere on the homepage, so
content width is viewport minus 48: 720 / 772 / 976. Stage height for the
hero is `max(550, 100dvh - 100)`: 924 / 1080 / 668
(`src/sections/Hero.tsx`, section style).

## Verdict summary

- Blocking tablet issues found: 0.
- Minor issues found: 7 (M1-M7 below). None breaks layout, none causes
  horizontal scroll, none hides content. Two are worth fixing before
  ship: the thin hero word fit at 768/820 (M1) and the review/poster
  graze at 1024 (M2).
- No tablet-only horizontal overflow contributor was found. The grey
  strip on the right edge reported on mobile does not reproduce at
  768/820/1024 from any element inspected (see "Overflow audit").
- Touch iPads lose three decorative layers by design (diorama, fact
  pills, cursor chips) and keep the floating collage. That is correct
  behavior, not a bug.

## 1. Hero: the word

Word: `fontSize: clamp(72px, 16vw, 180px)`, lineHeight 0.95,
letterSpacing -1.8px, `overflowWrap: break-word`, no nowrap
(`src/sections/Hero.tsx`, word render). The frame is full content width
with 32px side padding, so frame inner width is viewport minus 112:
656 / 708 / 912.

Word width is font-metric sensitive, so it is given as a range, not a
single number. Lower bound uses a 5.31em advance model for "daivanlabs.",
upper bound uses a 5.55em model (Inter Bold advances). Both subtract
about 18px of tracking.

| Viewport | Word size | Word width model | Frame inner | Slack |
| --- | --- | --- | --- | --- |
| 768 | 122.9px | 633-662px | 656px | -6 to +23px |
| 820 | 131.2px | 677-708px | 708px | 0 to +31px |
| 1024 | 163.8px | 850-889px | 912px | +23 to +62px |

Reading: at 1024 the word fits on one line under either model. At 768
and 820 the fit is inside font-metric noise: under the wide model the
word wraps to two lines at 768 and sits exactly at the edge at 820.
A wrap is not a break (the frame grows taller, still centered), but it
changes the hero from a one-line wordmark to a two-line stack, which is
a visible regression on portrait iPads. See M1 for the fix.

Note: the global `.hero-title` 64px rule at max-width 1023px
(`src/styles/global.css`) does NOT apply here, because the hero h1 uses
class `mv-word`, not `hero-title`. The hero word is governed only by
its inline clamp.

## 2. Hero: collage visibility per breakpoint

Hide rules (`src/sections/Hero.tsx`, stylesheet): hide-mid at
max-width 1160px, hide-1000 at max-width 1000px, hide-1400 at
max-width 1400px, hide-720-1160 at 720-1160px, hide-min-1400 at
min-width 1400px, hide-min-720 at min-width 720px, hide-short at
max-height 700px, hide-750 at max-height 750px, mobile-hide below
720px (mobile block at max-width 719px). Items
(`src/sections/Hero.tsx`, COLLAGE_ITEMS lines 174-223).

Height rules are inert on iPad: every iPad viewport height (768, 834,
1024, 1180, 1366) exceeds 750px, so hide-short and hide-750 never fire.
Width rules decide everything at tablet sizes.

### 768 and 820 (identical sets)

Visible, 5 items: docking (left 2.5%, top 3%, 230 wide), poster
(right 2.5%, top 2%, 260 wide), faers (left 2.5%, bottom 4%, 240 wide),
stroke (right 2.5%, bottom 5%, max 260 wide), db-pubmed (left 43%,
bottom 5%, 100 wide tile).

Hidden: helix, awards, microscope, stickers (hide-mid); review
(hide-1000); search, posterwindow, desk, gutaxis, db-elsevier,
db-scopus, db-cochrane (hide-1400); notify (hide-720-1160); db-row
(hide-min-720).

Composition math at 768: top band docking [19, 249] and poster
[489, 749], gap 240px. Bottom band faers [19, 259], pubmed
[330, 430], stroke [489, 749], gaps 71px and 59px. No overlaps.
Vertical: top items end near y 230, the frame starts near y 397
(content centered in a 924px stage); bottom items start near y 747,
the frame ends near y 570. So the word sits in a large empty middle
with about 170px of clear space above and below, and the collage reads
as "corners only". At 820 the gaps grow (frame starts near y 471,
top items still end near y 230, so about 240px of clear space above
the word). Sparse, but clean: no crowding, no overlap, no hole that
swallows the word. The corners-only look is the designed tablet
falloff, not a defect.

Floats still run on touch iPads (CSS keyframes, no hover gate), and
they move items UP by up to 8px only, so floats never push a top item
into the frame or a bottom item off the bottom edge.

### 1024 (landscape)

Visible, 6 items: the same 5 as portrait, plus review (right 27%,
top 3%, 220 wide), because 1024 is above the 1000px flip.

Composition math at 1024, stage height 668: top band docking
[26, 256], review [528, 748], poster [738, 998]. Bottom band faers
[26, 266], pubmed [440, 540], stroke [738, 998]. Bottom gaps are
174px and 198px, fine. Top band has one defect, see M2.

Frame vertical position at 1024: label plus frame block is about
256px tall, centered in a 508px content area, so the frame spans
about y 250-462. Top items start at y 13-20 and are at most about
200px tall, so they end near y 213 at the latest, leaving at least
about 35px of clearance to the frame top. Bottom items start near
y 501, leaving about 39px below the frame bottom. No frame collision.

### Bonus check: 1366 (iPad Pro 12.9 landscape)

Not in the brief, checked because it sits between the 1160 and 1400
edges. Visible, 10 items: hide-mid lifts (helix, microscope, stickers,
notify appear) while hide-1400 still hides the rest. Top band gaps
are 109px, 304px, 75px. Left column stacks cleanly (stickers
[296, 356], microscope [414, 564], notify [633, 693] at stage height
924). Bottom gaps are large. No overlaps. Fine.

## 3. Rule-flip edges

- 719/720: at 719 the hero is a static vertical stack showing only
  FaersCard, NotifyBubble, DbLogoRow, and the header nav hides
  (max-width 720px in `src/components/Header.tsx`). At 720 the
  desktop collage returns (floats, 5 items as at 768) and the nav
  reappears. The 720 state is the tightest word fit on the tablet
  side: word 592-611px modeled vs frame inner 608px, so the word may
  wrap at exactly 720 under the wide font model. M1 covers it.
  No reflow hazard: collage items are absolutely positioned, so
  flips add or remove decor without moving text.
- 1000: review hides at 1000 and below, shows at 1001. No other item
  flips here. The review/poster graze (M2) exists from 1001 up to
  1061, so the 1024 landscape breakpoint sits inside the graze band.
- 1160: crossing 1160 to 1161 adds five items at once (helix, awards,
  microscope, stickers, notify), because hide-mid and hide-720-1160
  both lift. Absolute decor only, no reflow, but the composition
  changes abruptly. Acceptable; no fix proposed.
- 1400: crossing 1400 to 1401 swaps poster out (hide-min-1400) and
  seven items in (hide-1400 lifts: search, posterwindow, desk,
  gutaxis, db-elsevier, db-scopus, db-cochrane). Same note as 1160:
  abrupt but reflow-free.

## 4. Below-hero sections at tablet widths

### Header (`src/components/Header.tsx`)

Inner row: maxWidth 1160, padding 20px 24px, flex, gap 24. Children:
wordmark (nowrap, about 120px), nav (6 links, about 575px total
including 24px gaps), spacer 200px (flexShrink 0). Nav width available
is inner width minus 368: 352px at 768, 404px at 820, 608px at 1024.

- 768/820: nav wraps to 2 right-aligned rows. Header grows to about
  112px tall. Functional, slightly ungainly. Single-row nav is
  impossible at these widths without dropping links (even at 14px
  font and 16px gaps the links need about 505px vs 352px available).
  See M3 for the optional restructure.
- 1024: nav fits on one row with about 33px slack. Tight; wider font
  rendering could push it to 2 rows. Same M3 note.
- Fixed CTA ("Start a conversation"): `right: max(16px,
  calc((100vw - 1160px) / 2))`, so right is 16px at all tablet
  widths, top 14px, about 181px wide, z-index 100. It sits over the
  200px spacer zone, not over nav links: at 768 the CTA spans about
  x [571, 752] while the nav box ends near x 496. No text is covered.
  The spacer is doing its job; do not remove it without a replacement.

### Quote (`src/sections/Quote.tsx`)

Pinned word-paint section. At 768/820 (max-width 1023px branch):
runway 1125px plus 140px padding, sticky padding 70px 24px, claim
clamp(34px, 4.5vw, 64px) gives 34.6px / 36.9px. At 1024 (above 1023px):
desktop runway 1875px plus 240px padding, claim 46.1px, sticky
padding 120px 24px. Text wraps by word, no fixed widths, no overflow.
Minor note: landscape iPads scroll about 750px further through the
pinned quote than portrait iPads because of the 1023/1024 flip (M6).
Sticky plus overflow visible is fine on iPad Safari (svh supported
iOS 15.4 and up). Dot layers are inset 0, no overflow.

### Services (`src/sections/Services.tsx`, breakpoints lines 129/134)

- 768/820: single column (max-width 1023px branch), cards full
  content width, title 28px, min-height 350px. Roomy, readable.
- 1024: 3 columns (above 1023px). Card width is (976 minus 40px
  gaps) / 3 = 312px; after 32px card padding, text width is 248px.
  Body 17px gives about 30 characters per line; 36px titles wrap to
  2-3 lines; min-height 470px. Readable but narrow. See M4.
- Section padding is inline 130px 24px, so it does not step down at
  1023px (the global section-pad-mobile rule does not apply to this
  inline style). Generous, not a bug.

### Manifesto (`src/sections/Manifesto.tsx`, breakpoint line 219)

- 768/820: vertical layout (max-width 900px branch). Stations stack
  full width with 40px left padding for the connector. Readable.
- 1024: horizontal 5-column grid (above 900px). Column width is
  (976 minus 96px gaps) / 5 = 176px. Detail text 16px gives about
  19 characters per line. The long 2026 station detail (about 650
  characters) becomes about 34 lines, roughly 900px tall, and the
  whole section becomes very tall with five narrow ragged columns.
  No overflow (stations have minWidth 0), text stays readable, but
  it is the weakest below-hero layout at tablet widths. See M5.
- Drift blob (900px, top -10%, right -8%) is clipped by the
  section's overflow hidden. No page overflow.
- Title clamp(40px, 7vw, 96px): 53.8 / 57.4 / 71.7px. Fine.

### Profile (`src/sections/Profile.tsx`, breakpoint line 153)

- 768/820: stacked (max-width 900px branch). Portrait image full
  content width (about 688px at 768 after 16px frame padding),
  tall but fine.
- 1024: side by side, 300px portrait plus 48px gap plus 628px bio.
  Anchor rows (dt minWidth 320 plus wrapping dd) fit: 320 plus
  16 gap plus about 200px dd is 536px, inside 628px; longer dd text
  wraps gracefully.
- Title clamp(48px, 8vw, 96px): 61.4 / 65.6 / 81.9px. Fine.
- Fact chips: hidden on hover:none (touch iPads), which is correct
  because they duplicate bio facts. On trackpad iPads the chips show
  at left -14px, which is x = 24 minus 14 = 10px from the viewport
  edge: on screen, no overflow.

### Works (`src/sections/Works.tsx`)

Rows are flex with wrap, padding-left 150px, giant numeral
clamp(64px, 9vw, 120px), route line at left 70px, meta minWidth 220,
index minWidth 32, title flex 1 1 320px with minWidth 0, link nowrap.
The 700px media query (padding-left 88px) does not apply at tablet
widths.

- 768: row inner width after the 150px indent is 570px. Index plus
  meta plus gaps need 316px; title basis 320px brings the total to
  636px, above 570px, so rows wrap to two lines (title drops below
  index plus meta, or the link drops). Flex-wrap plus minWidth 0
  makes this graceful: no overflow, text stays readable, rows just
  get taller. Acceptable.
- 1024: row inner width is 826px. 316 plus 320 plus link (about
  150px with gap) is about 786px, inside 826px, so most rows stay on
  one line; only the longest titles wrap inside the title span.
  Fine.
- Numeral at 9vw: 69px at 768 ("09" about 76px wide, inside the
  150px indent), 92px at 1024 (about 101px, inside 150px). Fine.

### Affiliations (`src/sections/Affiliations.tsx`)

Flex wrap, gap 48px 80px, badge maxWidth 260. At 768: 2 per row
(260 x 2 plus 80 = 600, inside 720). At 820: 2 per row (600, inside
772). At 1024: 3 per row (260 x 3 plus 160 = 940, inside 976).
7 badges lay out 2+2+2+1, 2+2+2+1, 3+3+1. No overflow, last row
left-aligned. Fine.

### Contact (`src/sections/Contact.tsx`, breakpoint line 143)

- Giant heading clamp(56px, 13vw, 200px): 99.8 / 106.6 / 133.1px.
  Longest line "together." is about 494 / 527 / 658px, inside
  720 / 772 / 976px. Lines are separate masked spans, so wrapping
  is by construction. Fine.
- Email pill: about 400px wide (33 characters at 18px bold plus
  padding), inside all tablet content widths, with overflowWrap
  anywhere as a safety net. Fine.
- Watermark "DL": 170px at 768/820 (about 200px wide, centered),
  266px at 1024 (about 320px wide, centered). Section overflow
  hidden clips it. Fine.
- Cursor chip and pills: hidden on hover:none (touch iPads). On
  trackpad iPads they sit inside the overflow-hidden section. Fine.

### Footer (`src/components/Footer.tsx`)

Nav flex wrap, gap 12px 24px; email link has overflowWrap anywhere;
lines are 11px JetBrains Mono uppercase. Wraps cleanly at all three
widths. Fine.

## 5. Container behavior

Every homepage section sets its own inline maxWidth 1160 plus margin
0 auto plus 24px side padding (no homepage section uses the global
`.onlines-container` class; grep finds zero uses in sections,
Header, Footer, App). Token `--content-max` is 1160px
(`src/styles/tokens.css`). At tablet widths the 1160px cap never
engages, so content width is viewport minus 48, centered with equal
left and right margins. There is no side-margin or centering defect
at 768/820/1024. The only width where the cap matters is above 1160,
outside tablet scope.

## 6. Overflow audit (tablet-only contributors)

Checked element by element, with the reason each cannot cause
page-level horizontal scroll at 768/820/1024:

- Hero collage: section has overflow hidden and the collage layer
  itself has overflow hidden. Absolutely positioned items that extend
  past the section edge are clipped, not scrolled.
- Manifesto drift blob: section overflow hidden.
- Contact watermark and cursor chip: section overflow hidden.
- Profile chips: worst case 14px outside the frame, still 10px
  inside the viewport edge, and hidden on touch iPads.
- Fixed CTA: position fixed does not expand the scroll area; right
  is guarded by max(16px, ...) so the 100vw term never applies at
  tablet widths.
- Quote dot layers: absolute inset 0 inside the sticky child.
- Works rows, Services grid, Affiliations flex, Footer nav: all wrap
  (flex-wrap or grid) with minWidth 0 where it matters; no fixed
  width exceeds its container. Widest fixed card visible at tablet
  widths is PosterCard at 260px, far below 720px.
- Header nav: wraps; wordmark is nowrap but only about 120px.
- No `overflow-x` rule exists on html/body in `src/styles/global.css`
  (grep finds zero hits), so page-level horizontal scroll is NOT
  suppressed globally. That makes the clean result above meaningful:
  nothing overflows, so nothing needs suppressing, but there is also
  no safety net if a future edit introduces an overflow. See M7.

Conclusion: the mobile grey strip on the right edge does not
reproduce at tablet widths from any inspected element. The mobile
symptom belongs to below-720px layout (mobile analyst's scope) or to
a viewport artifact, not to a tablet overflow. Do not chase it with a
tablet-side fix.

## 7. Portrait vs landscape differences worth handling separately

- Collage density: portrait shows 5 corner items with large empty
  bands above and below the word; landscape adds review (6 items)
  and packs the bands tighter (about 35-39px frame clearance vs
  170-240px in portrait). One layout rule serves both, but the
  visual result is sparse portrait vs balanced landscape.
- Manifesto: portrait gets the vertical layout (good); landscape
  gets the cramped 5-column grid (M5). This is the one section where
  portrait and landscape genuinely need different treatment.
- Services: portrait gets a single column (roomy); landscape gets
  3 narrow columns (M4). Same breakpoint story as Manifesto, less
  severe.
- Quote: portrait gets the short runway (1125px); landscape gets
  the long runway (1875px) because of the 1023/1024 flip (M6).
- Header: portrait wraps the nav to 2 rows; landscape fits 1 row
  with 33px slack (M3).
- Contact watermark: 170px portrait, 266px landscape (1023px flip).
  Both fit; no action.
- Height rules: inert on all iPad sizes (all viewport heights above
  750px). No portrait/landscape height handling is needed.

## 8. Findings: blocking vs minor

Blocking: none.

Minor:

- M1 (hero word fit, 768/820, riskiest at 720): modeled slack is
  -6 to +23px at 768 and 0 to +31px at 820 depending on which Inter
  cut renders. The word may wrap at portrait widths under the wide
  model. Visual regression only (frame grows taller, still
  centered), not a break.
- M2 (review/poster graze, 1001-1061, including 1024): review right
  edge 747.5px vs poster left edge 738.4px at 1024, a 9.1px horizontal
  overlap in the same top band. Poster paints above review (later in
  DOM), so review's right border and padding sit under poster's left
  edge. Overlap is 260 minus 0.245 x viewport width: 14.8px at 1001,
  9.1px at 1024, zero at 1061. Decorative cards only.
- M3 (header nav wrap, 768/820, tight at 1024): 2-row right-aligned
  nav at portrait widths; 1 row with 33px slack at landscape.
  Functional, no overlap with the fixed CTA. Cosmetic.
- M4 (Services 3 columns, 1024): 312px cards, 248px text width,
  about 30 characters per line at 17px. Readable, narrow.
- M5 (Manifesto 5 columns, 1024): 176px stations, about 19
  characters per line at 16px, about 34 lines for the 2026 station,
  very tall section. Readable, cramped. Weakest tablet layout.
- M6 (Quote runway flip, 1023/1024): landscape iPads scroll about
  750px further through the pinned quote than portrait iPads.
  Cosmetic inconsistency, no break.
- M7 (no overflow-x safety net): no `overflow-x` rule on html/body.
  Nothing overflows today, but a future wide element would produce
  page-level horizontal scroll with no guard.

## 9. Fix recommendations (not implemented)

- M1: in `src/sections/Hero.tsx`, in the max-width 719px stylesheet
  block or a new max-width 900px block, reduce frame side padding
  from 32px to 24px (buys 16px of word slack at 768/820/720) and/or
  change the word clamp from 16vw to 15vw below 900px (buys about
  40px at 768). Either one moves the fit out of font-metric noise;
  both together are safest. Verify live on a real iPad after the
  change, because the model cannot resolve which Inter cut renders.
- M2: in `src/sections/Hero.tsx` COLLAGE_ITEMS, change review right
  from "27%" to "29%" (line 185). At 1024 that moves review's right
  edge from 747.5px to 727px, giving an 11px gap to poster's left
  edge at 738.4px; at 1001 the gap becomes about 5px; at 1061 about
  21px. Alternative: add a narrow media query for 1001-1061px that
  moves poster right from 2.5% to 1.5%. Either closes the graze
  band; the one-line change is preferred.
- M3 (optional): in `src/components/Header.tsx`, add a max-width
  900px block: header inner flex-wrap wrap, nav order 3 with width
  100% and justify-content flex-start, spacer display none. The nav
  then gets the full row (720px at 768, inside the 575px it needs)
  and renders as one row below the wordmark. The fixed CTA still
  overlaps only the empty top-right of the wordmark row. Keep the
  spacer above 900px so the CTA zone stays protected.
- M4 (optional): in `src/sections/Services.tsx`, accept the 3-column
  layout at 1024, or add a 2-column step for 1024-1100px
  (grid-template-columns repeat(2, 1fr)), giving about 468px cards.
  Not required for readability.
- M5: in `src/sections/Manifesto.tsx`, change the vertical-layout
  media query from max-width 900px to max-width 1100px (line 219).
  Landscape iPads at 1024 then get the vertical layout, and the
  176px-column problem disappears. Widths 901-1100 on desktop get
  the vertical layout too, which is acceptable.
- M6 (optional): in `src/sections/Quote.tsx`, move the runway
  breakpoint from max-width 1023px to max-width 1100px, or accept
  the difference. Only worth doing if the pinned-quote scroll length
  should match across iPad orientations.
- M7 (defense in depth): in `src/styles/global.css`, add
  `html, body { overflow-x: clip; }`. This hides any future
  horizontal overflow without affecting vertical scroll. It is a
  guard, not a substitute for fixing a real overflow if one appears.

## 10. Live checks still owed (real iPad or Netlify preview)

- Hero word on one line at 768 and 820, and at exactly 720.
- Review/poster top-right corner at 1024 (confirm the 9px graze, then
  confirm the fix).
- Manifesto at 1024 before and after the M5 breakpoint change.
- Header nav rows at 768 and 820.
- No horizontal scroll at 768/820/1024 (swipe right at page bottom;
  the audit predicts none).
- The mobile grey strip is out of tablet scope; confirm with the
  mobile analyst whether it reproduces below 720px.
