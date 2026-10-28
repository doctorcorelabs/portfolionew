# Journey: shortened copy + bead + seals + stage lights

Implementation spec. Scope: `src/sections/Manifesto.tsx` ONLY, plus this
doc. No other file changes. The Journey copy lives inline in the
`STATIONS` array in that file; there is no separate journey data file.

## 0. Grounding in the real code (do not re-derive these)

- Section: `id="manifesto"`, background `#111111`, padding `130px 24px`,
  content wrapper `maxWidth: 1160`, `position: relative`, `zIndex: 1`.
  The drift blob is a sibling at `zIndex: 0`. Section style has
  `overflow: hidden`.
- Colors: headings `#FAFAFA`, body `#D8D8D8`, mono labels `#98989C`,
  blue `#0859D4`. Global CSS forces dark `#1D1D1F` on headings, so every
  heading and text element here already carries an explicit light color.
  New elements must do the same where they carry text (none of the new
  elements carry text; all are `aria-hidden`).
- Desktop grid `.journey-grid`: 5 columns `1fr`, rows `auto 48px auto`,
  `column-gap: 24px`, `position: relative`. Route `.journey-line`:
  `grid-column: 1 / -1`, `grid-row: 2`, `align-self: center`, `height: 0`,
  `border-top: 2px dashed rgba(255, 255, 255, 0.35)`, inline
  `transform: scaleX(progress)`. Node wrapper `.journey-node`: `grid-row: 2`,
  centered flex. Node dot: 16px circle, `background: #0859D4`,
  `border: 2px solid #FAFAFA`, `box-sizing: border-box`.
- Node pop: `transform 450ms cubic-bezier(0.34, 1.56, 0.64, 1)`,
  `opacity 300ms ease`, delays `300 + i * 150` ms. Active node pulse:
  `journey-pulse 2s ease-in-out infinite` (box-shadow 0 to 12px,
  `rgba(8, 89, 212, 0.45)` to transparent), applied via
  `.journey-node-active .journey-node-dot` and
  `.journey-station-active .journey-node-mobile`.
- Mobile breakpoint: `max-width: 1100px` (not 1024, not 720). Below it:
  grid becomes `display: block`; `.journey-line` and `.journey-node`
  are `display: none`; `.journey-station` gets `padding-left: 40px`,
  `padding-bottom: 48px` (0 on last); `::before` vertical dashed line at
  `left: 7px`, `top: 14px`, `bottom: 0`, same 2px dashed white 0.35,
  drawn by `scaleY(var(--journey-progress))` from the top; last child
  `::before` is `top: 0`, `height: 14px`. Mobile node
  `.journey-node-mobile`: `display: block`, absolute, `left: 0`,
  `top: 6px` (same 16px dot).
- Existing motion state (REUSE, do not duplicate): one `useEffect` with a
  rAF-throttled passive `scroll` listener plus `resize` routed through
  the same handler. `progress` = `clamp01((vh - rect.top) / (vh +
  rect.height))`, committed only when it moves by 0.005 or more.
  `activeIdx` = index of the `.journey-station` nearest the viewport
  center, or -1 when the section is offscreen. Reduced-motion branch
  already early-returns: adds `mvM-in`, sets `progress` to 1, adds NO
  scroll listener. All new behavior below derives from `progress` and
  `activeIdx` (plus one measured value in section 2.3, computed inside
  the existing `update()`).
- Station article layout: `gridColumn: i + 1`, `gridRow: 1` for even
  index (above route) else `3` (below), `paddingBottom: 28` above /
  `paddingTop: 28` below. Year `<p>`: JetBrains Mono,
  `clamp(28px, 3vw, 40px)`, weight 700, `letterSpacing: -0.02em`,
  `#FAFAFA`, `margin: 0 0 12px`. Title `h3`:
  `clamp(22px, 2vw, 28px)`. Detail: 16px, `lineHeight: 1.65`, `#D8D8D8`.
  Award dots: 8px blue circles. `dotCount`: mono 12px `#98989C`.
- Intro paragraph: 18px, `lineHeight: 1.65`, `#D8D8D8`, `maxWidth: 680`,
  `margin: 0 0 80px`. Heading: `clamp(48px, 7vw, 72px)`.

## 1. Shortened copy (byte-identical requirement)

Replace exactly the six strings below. Station titles, years, `dots`
arrays, `dotCount` lines, and the undated-items footnote paragraph at the
bottom of the section are UNCHANGED.

### 1.1 Intro paragraph

OLD: "From starting medicine at UII in 2021 to the clinic and a Seoul
congress poster in 2026, in five year stations."

NEW: "Medicine at UII in 2021, clinic and Seoul congress poster in 2026:
five stations."

### 1.2 Station 2021 detail

OLD: "Bachelor of Medicine, Faculty of Medicine, Universitas Islam
Indonesia. GPA 3.91 out of 4.0. Guest speaker for the Blora Regency
Government dialogue, Ngobrol Bareng Bupati."

NEW: "Bachelor of Medicine, Faculty of Medicine, Universitas Islam
Indonesia, GPA 3.91/4.0. Guest speaker, Blora Regency Government
dialogue Ngobrol Bareng Bupati."

### 1.3 Station 2023 detail

OLD: "Beasiswa Unggulan Awardee, from the Ministry of Education, Culture,
Research, and Technology. Active in SMART FK UII Scientific Division and
BAPIN-ISMKI, public speaking educator at Seni.Bicara, and Master of
Ceremony for the UII Faculty of Medicine General Assembly XVI."

NEW: "Beasiswa Unggulan Awardee, Ministry of Education, Culture,
Research, and Technology. SMART FK UII Scientific Division and
BAPIN-ISMKI, public speaking educator at Seni.Bicara, Master of
Ceremony, UII Faculty of Medicine General Assembly XVI."

### 1.4 Station 2024 detail

OLD: "20 certifications completed: WHO, UNITAR, Johns Hopkins, and
Coursera. Four publications recorded. First-author ePoster at ENDO 2024
in Seoul, poster at ICKSH 2024, and oral presentation at MYHAM 2024,
plus a Gold Medal at ISIF 2024. Speaker and mentor at KampusInovatif.id
and INTIMATE SMART FK UII."

NEW: "20 certifications: WHO, UNITAR, Johns Hopkins, Coursera. Four
publications recorded. First-author ePoster, ENDO 2024 Seoul; poster,
ICKSH 2024; oral presentation, MYHAM 2024; Gold Medal, ISIF 2024.
Speaker and mentor, KampusInovatif.id and INTIMATE SMART FK UII."

### 1.5 Station 2025 detail

OLD: "Most Outstanding Student UII 2025 and 3rd Most Outstanding Student
LLDIKTI V 2025. DaivanLabs founded in June 2025. Summer school at
Chulalongkorn (AASP-PECT). The Amomum cardamomum publication recorded
this year."

NEW: "Most Outstanding Student UII 2025; 3rd Most Outstanding Student
LLDIKTI V 2025. DaivanLabs founded June 2025. Summer school,
Chulalongkorn (AASP-PECT). Amomum cardamomum publication recorded this
year."

### 1.6 Station 2026 detail

OLD: "Clinical clerkship (koas), surgery rotation from 5 October 2026.
Poster ABST-000034 at Hypertension Seoul 2026, Conrad Seoul, 5 to 7
November 2026: FAERS resistant hypertension study, N = 6,601 reports
analysed. Results are hypothesis-generating: reporting
disproportionality, not clinical risk or causality. StrokeSense and
StrokeSense AI Lab built: upload results are AI interpretation of
images, not measurement, and FAST output is an Observation Sheet with no
score and no diagnosis. Cerclage Table 1 deep analysis completed 18
October 2026; no result numbers published. Five further 2026 papers
followed: BPA and hormone-related disorders, Amomum cardamomum for
breast cancer, Lytechinus variegatus peptides for obesity, miRNA
diagnostics for endometrial cancer, and Echinometra lucunter peptides
for lung cancer."

NEW: "Clinical clerkship (koas), surgery rotation from 5 October 2026.
Poster ABST-000034, Hypertension Seoul 2026, Conrad Seoul, 5-7 November
2026: FAERS resistant hypertension study, N = 6,601 reports analysed
(hypothesis-generating: reporting disproportionality, not clinical
risk or causality). StrokeSense and StrokeSense AI Lab: uploads are AI
image interpretation, not measurement; FAST output is an Observation
Sheet, no score, no diagnosis. Cerclage Table 1 analysis completed 18
October 2026, no result numbers published. Five further 2026 papers: BPA
and hormone-related disorders; Amomum cardamomum, breast cancer;
Lytechinus variegatus peptides, obesity; miRNA diagnostics, endometrial
cancer; Echinometra lucunter peptides, lung cancer."

### 1.7 Deliberate wording notes for QA

- "Four publications recorded" is UNCHANGED. Do not renumber it.
- The 2026 honesty disclaimers are preserved, only re-punctuated: the
  FAERS disclaimer now sits in parentheses after "analysed", and the
  StrokeSense disclaimer keeps both halves (AI interpretation, not
  measurement; Observation Sheet, no score, no diagnosis).
- "Cerclage Table 1 deep analysis" becomes "Cerclage Table 1 analysis"
  (the word "deep" is dropped); this is the approved text, not a fixer
  edit, so QA must not "restore" it.
- The 2026 paper list uses semicolons and short forms ("Amomum
  cardamomum, breast cancer", not "Amomum cardamomum for breast
  cancer"). QA must verify the short forms, not expand them.

## 2. Bead on the route

One solid blue bead, 16px, visually identical to the existing node dots:
`width: 16px`, `height: 16px`, `border-radius: 50%`,
`background: #0859D4`, `border: 2px solid #FAFAFA`,
`box-sizing: border-box`, `aria-hidden="true"`, `pointer-events: none`.
When the bead dwells on a node it coincides with that node dot exactly
(same center, same size, same fill, same border), so the two merge into
one dot. That merge is intended, not a double-dot bug.

### 2.1 Position parameter (five station windows)

Derive everything in render from the existing `progress` state (0 to 1).
No new state, no measurement, for the parameter itself.

- `w = progress * 5`
- `k = min(4, floor(w))` (window index, one per station)
- `l = w - k` (position inside the window, 0 to 1; at `progress = 1`,
  `w = 5`, `k = 4`, `l = 1`)
- `from = (k === 0) ? 0 : k - 1`, `to = k`
- `frac = (l < 0.5) ? easeOutCubic(l * 2) : 1`, where
  `easeOutCubic(t) = 1 - (1 - t) ^ 3`
- `beadIndex = from + frac * (to - from)` (float, 0 to 4)

Reading: inside window `k`, the bead travels from node `k - 1` to node
`k` during the first half of the window, then dwells on node `k` during
the second half. Window 0 travel is degenerate (node 0 to node 0), so
the bead starts parked on 2021. At `progress = 1` the bead is parked on
2026. Fast scroll may jump the bead between distant nodes instead of
traveling; that is ACCEPTED, because the parked position still always
shows the current station.

Arrival index (used by 2.4 and 2.5), also derived in render:

- `arrivalIdx = (l >= 0.5) ? k : max(0, k - 1)`

During a travel half, the last arrived node is still the previous one;
during a dwell half, the arrived node is the dwelled node.

### 2.2 Desktop bead (above 1100px)

- Render one bead element as a child of `.journey-line` (add
  `position: relative` to `.journey-line` in the stylesheet block; the
  line currently sets no position).
- Position: `position: absolute`, `top: 50%`,
  `transform: translate(-50%, -50%)`, `left` from the column geometry:
  column width `colW = (100% - 96px) / 5` (4 gaps of 24px), center of
  column `i = i * (colW + 24px) + colW / 2`. For float `beadIndex = b`,
  inline style left is:
  `calc(b * ((100% - 96px) / 5 + 24px) + (100% - 96px) / 10)`
  with `b` substituted as a number. Percentages resolve against the
  line width, which spans the full grid width.
- Hidden at `max-width: 1100px` via media query.
- Opacity gate: `.mvM-armed:not(.mvM-in) .journey-bead { opacity: 0 }`,
  full opacity once `mvM-in` is present, so the bead never shows while
  the nodes are still hidden pre-reveal.

### 2.3 Mobile bead (1100px and below)

The desktop line is `display: none` here, so the bead rides the
vertical line instead.

- Render a second bead element as a child of `.journey-grid`
  (already `position: relative`), `position: absolute`, `left: 7px`
  (the mobile line x), `transform: translateX(-50%)`, `top` from state
  `beadTop` (see below). Hidden above 1100px via media query.
- Measurement (inside the EXISTING `update()` only, no new listener):
  read the centers of the `.journey-node-mobile` dots relative to the
  grid rect: `center = dotRect.top + 8 - gridRect.top`. Interpolate by
  `beadIndex`: `i0 = floor(b)`, `i1 = min(4, ceil(b))`,
  `top = c[i0] + (b - i0) * (c[i1] - c[i0])`. Store in state `beadTop`,
  committed under the same change threshold spirit as progress (skip
  when it moves less than 0.5px). When the grid or the dots are
  missing, `beadTop` is null and the mobile bead is not rendered.
- The 7px line x sits inside the 40px station left padding, and the
  bead extends 8px to either side of it, so it stays inside the 24px
  section side padding. Section `overflow: hidden` is a backstop, not
  the mechanism.

### 2.4 Year numeral pop on arrival

- Give the year `<p>` a class `journey-year` (keeping all existing
  inline styles). When `arrivalIdx === i`, add class
  `journey-year-pop`.
- CSS: `.journey-year-pop { animation: journey-bead-pop 450ms
  cubic-bezier(0.34, 1.56, 0.64, 1); }` with
  `@keyframes journey-bead-pop { from { transform: scale(0.9); } to
  { transform: scale(1); } }`. The numeral rests at scale 1; the pop
  runs once per arrival (class toggling restarts the animation when
  the bead arrives at a station again after leaving it). The year
  `<p>` is a child of the article, so its transform never fights the
  article-level `mvM-reveal` translate.
- Scrolling back replays the pop for the re-arrived station. That is
  correct and reversible, same as the bead itself.

### 2.5 Node ring expansion on arrival

Do NOT touch the node dot's existing pulse animation. Instead render a
separate one-shot ring element, only when the bead has arrived:

- Condition: `arrivalIdx === i AND progress > 0` (the progress gate
  stops a stray ring before any scroll has happened).
- Desktop: `<span aria-hidden className="journey-bead-ring" />` inside
  the `.journey-node` wrapper (add `position: relative` to that
  wrapper), centered: `position: absolute`, `left: 50%`, `top: 50%`,
  `width: 16px`, `height: 16px`, `border-radius: 50%`,
  `transform: translate(-50%, -50%)`,
  `animation: journey-bead-ring 450ms ease-out forwards`.
  Keyframes: `from { transform: translate(-50%, -50%) scale(1);
  opacity: 0.6; box-shadow: 0 0 0 0 rgba(8, 89, 212, 0.45); } to
  { transform: translate(-50%, -50%) scale(1.9); opacity: 0;
  box-shadow: 0 0 0 14px rgba(8, 89, 212, 0); }`.
  The element stays mounted (invisible) through the dwell and unmounts
  on departure; remounting on re-arrival replays it.
- Mobile: the same ring element rendered inside the station article
  (articles are already `position: relative` below 1100px),
  `position: absolute`, `left: 0`, `top: 6px`, `width: 16px`,
  `height: 16px`, same animation.
- Gate the two placements by media query: desktop ring hidden at
  `max-width: 1100px`, mobile ring hidden above 1100px.

### 2.6 Bead reduced motion

Both bead elements: `display: none !important` inside the existing
`prefers-reduced-motion` block. The route stays fully drawn and the
stations static, exactly as the current reduced-motion branch already
does. No bead logic changes are needed in the effect, because the
reduced-motion branch never runs the scroll listener.

## 3. Station seals

One small thin-outline line seal beside each year numeral, never behind
body text, at the same locked position relative to its numeral on every
station.

### 3.1 Placement

- Wrap the year `<p>` and the seal in a row div:
  `display: flex`, `alignItems: center`, `gap: 10px`,
  `margin: 0 0 12px`. Move the year `<p>` margin to `0` (its current
  `0 0 12px` moves to the row, so vertical rhythm is unchanged).
- Seal order: year text first, seal immediately to its right, on every
  station, desktop and mobile alike. Same size on mobile (the row sits
  in normal flow inside the stacked station, so no mobile override is
  needed).
- Seal element: inline SVG, `width: 28`, `height: 28`,
  `viewBox: "0 0 28 28"`, `aria-hidden="true"`, `flex-shrink: 0`,
  `stroke-width: 1.5`, `stroke-linecap: round`,
  `stroke-linejoin: round`. Because the seal lives in the year row
  above the title and detail, it can never sit behind body text.

### 3.2 Shapes (paths in the 28x28 box)

- 2021, open doorway (entering medicine): open path
  `M6 24 V6 H22 V24` (two uprights and a lintel, no bottom).
- 2023, three ascending steps (first wins): open polyline
  `M4 24 H10 V18 H16 V12 H22 V6`.
- 2024, world stages: circle `cx=14 cy=14 r=9` plus ellipse
  `cx=14 cy=14 rx=9 ry=3.5` (the horizontal ellipse line).
- 2025, peak year and lab: triangle `M4 24 L14 6 L24 24 Z` plus a small
  square at the apex, `x=11 y=3 w=6 h=6`.
- 2026, clinic and tools joined: two overlapping squares, rear square
  `x=4 y=10 w=12 h=12`, front square `x=12 y=4 w=12 h=12`.
  Reconciliation note: the "one blue-filled" square in the approved
  description is the ACTIVE-state fill of the rear square, not a
  rest-state fill. At rest both squares are outlines (see 3.3).

### 3.3 Rest and active styles

- Rest (all five, always visible): `fill: none`,
  `stroke: rgba(255, 255, 255, 0.6)`. At rest the seals read as quiet
  white outlines.
- Active (when `activeIdx === i`, the EXISTING active-station signal,
  not the bead arrival): wrapper span gets class
  `journey-seal-active`, and:
  - stroke becomes `#0859D4` on every shape;
  - closed shapes fill `#0859D4` (mark them with class `seal-closed`:
    2024 circle, 2025 triangle, 2026 rear square);
  - open shapes (2021 doorway, 2023 steps) stay unfilled and instead
    bump `stroke-width` from 1.5 to 2, so line art still reads as
    "filled blue";
  - the 2024 ellipse keeps a `#FAFAFA` stroke when active, so the cross
    line stays visible across the filled disc;
  - the 2025 apex square keeps a `#FAFAFA` stroke when active, so it
    stays visible as an accent on the filled triangle;
  - the 2026 front square stays outline-only when active; only the
    rear square fills.
  - `fill` and `stroke` transition `300ms ease` in both directions, so
    the previous seal drains back to outline as the new one fills.
- Snap: `.journey-seal-active` also carries
  `animation: journey-seal-snap 300ms cubic-bezier(0.34, 1.56, 0.64, 1)`
  with `@keyframes journey-seal-snap { from { transform: scale(1.25); }
  to { transform: scale(1); } }` on the seal span. The snap runs once
  per activation (class toggling restarts it) and settles at scale 1.
- Trigger is scroll position through the existing `activeIdx` only.
  Never tap, never hover. There is no hover state on touch and none is
  added.

### 3.4 Seal reduced motion

Inside the existing `prefers-reduced-motion` block: seal snap
`animation: none !important`, seal fill/stroke `transition: none
!important`. Separately, the reduced-motion effect branch must set
`activeIdx` to 4 (last station) alongside its existing `setProgress(1)`
change, so the end state renders statically with the 2026 seal filled
and the other four as outlines. Without this, `activeIdx` would stay -1
and no seal would ever fill under reduced motion. The 2026 article
also gains `journey-station-active` from this, which is harmless
because the pulse animation is already forced off in the same block.

## 4. Stage lights

Five soft vertical light wells, one per station column, behind content,
at very low alpha. They reuse `activeIdx`; they add no listener.

### 4.1 Desktop wells (above 1100px)

- Render five absolute divs as children of `.journey-grid` (already
  `position: relative`), `top: 0`, `bottom: 0`, `zIndex: -1`,
  `pointer-events: none`, `aria-hidden="true"`. Negative z-index inside
  a non-stacking-context parent puts the wells above the section
  background and below the in-flow station text. Do NOT use `zIndex: 0`
  here: a positioned `z-index: 0` element paints above static text.
- Column geometry (same as the bead): well `i` has
  `left: calc(i * ((100% - 96px) / 5 + 24px))` and
  `width: calc((100% - 96px) / 5)`, with `i` substituted as a number.
- Gradient (identical on all five; state comes from element opacity,
  not from changing the gradient):
  `radial-gradient(ellipse 70% 45% at 50% 28%,
  rgba(255, 255, 255, 0.10) 0%, rgba(8, 89, 212, 0.07) 45%,
  rgba(255, 255, 255, 0) 70%)`.
  Feathering comes from the gradient stops only. Do NOT add
  `filter: blur` (perf cost on full-height elements for no visual gain
  over the feathered gradient).
- Opacity states: active well (`activeIdx === i`) `opacity: 1`;
  inactive wells `opacity: 0.3`; when `activeIdx === -1` (section
  offscreen) all wells sit at `0.3`. Effective values are therefore
  exactly the approved ones: active white core 0.10 with a 0.07 blue
  tint, inactive white core 0.03 (0.10 times 0.3).
- Transition: `opacity 800ms ease` in both directions. Slow crossfade,
  never a flash.
- At rest the active well simply holds its glow steady.
- Opacity gate like the bead: wells are `opacity: 0` until `mvM-in`
  is present (combine with the state opacity via the armed rule, so
  pre-reveal wells never flash).

### 4.2 Mobile glow (1100px and below)

Below 1100px the five wells are `display: none`, and a single vertical
glow takes over.

- Render the glow div inside each station article, but only the
  article whose index equals `activeIdx` renders it (conditional
  render, same signal as the seals).
- Geometry: `position: absolute`, `left: -13px`, `width: 40px`,
  `top: 0`, `bottom: 0`, `zIndex: -1`, `pointer-events: none`,
  `aria-hidden="true"`. The mobile route line sits at `left: 7px`
  inside the article, so a 40px band at `left: -13px` centers exactly
  on it (7 - 20 = -13). The band extends 13px left of the article box,
  which stays inside the 24px section side padding; section
  `overflow: hidden` is a backstop only.
- Gradient: `radial-gradient(ellipse 50% 50% at 50% 50%,
  rgba(255, 255, 255, 0.10) 0%, rgba(8, 89, 212, 0.07) 50%,
  rgba(255, 255, 255, 0) 70%)`, `opacity: 1` (the gradient itself is
  the faint value; no extra multiplication on mobile).
- As the active station changes, the glow unmounts from the old
  article and mounts in the new one, so it "slides" by reappearing
  behind the newly active station. No top animation is specified;
  do not add one (it would need measurement the spec deliberately
  avoids on mobile).
- Gate the two light placements by media query: wells hidden at
  `max-width: 1100px`, glow hidden above 1100px.

### 4.3 Lights reduced motion (HARD limits)

- Inside the existing `prefers-reduced-motion` block: all wells
  `opacity: 0.3 !important`, `transition: none !important`; the mobile
  glow `opacity: 0.3 !important`, `transition: none !important`.
  Under reduced motion the reduced-motion branch sets `activeIdx` to
  4 (see 3.4), so the glow renders statically behind the 2026 station
  at the uniform faint level, and the wells render uniformly faint.
  There is no brightening under reduced motion, on any viewport.
- HARD CAPS (not starting points): gradient white stop never above
  0.10, blue stop never above 0.07, inactive element opacity never
  above 0.3, active element opacity never above 1. If the `#D8D8D8`
  body text ever looks washed out in preview, the fix is to lower
  these numbers, never to raise them, and never to dim the body text
  to compensate. Body text opacity is never animated anywhere in this
  section.

## 5. Global constraints (all four changes)

- Files touched: `src/sections/Manifesto.tsx` only (plus this spec).
  No new files, no new dependencies, no new scroll or resize
  listeners, no scroll locking, no scroll hijack, no drag.
- New motion lives in the motion path only. Every new animated element
  has a reduced-motion rule in the existing `prefers-reduced-motion`
  block (bead hidden, seal snap off, lights uniform faint).
- Paint-only properties for all new motion: `opacity`, `transform`,
  `color`/`fill`/`stroke`, `box-shadow` keyframes on the one-shot ring.
  Never `width`, `height`, `margin`, `padding`, `top`/`left` animation
  (the mobile bead `top` is set discretely from state on the existing
  throttled update, not transitioned).
- No layout shift of text: the year row keeps the year `<p>` vertical
  rhythm (row margin equals the old paragraph margin); seals are
  `flex-shrink: 0` and never wrap; wells and glows are absolute with
  negative z-index; the bead is absolute; the ring is absolute.
- No new content, no new facts, no new numbers anywhere. The only
  numbers added are geometry and alpha values in this spec. The seals
  carry no labels, the bead carries no label, the lights carry no
  label.
- No em dashes anywhere in new or edited text (the approved copy
  contains none; "5-7 November" uses a hyphen).
- The existing entrance behavior is untouched: `mvM-armed` /
  `mvM-in` reveal, node pops with existing delays, route draw from
  `progress`, active pulse, drift blob, header slide-in. New elements
  gate on `mvM-in` where stated and otherwise layer on top.

## 6. Acceptance checklist (fixer self-check, QA verifies each line)

Copy:

1. Intro paragraph and all five `detail` strings are byte-identical to
   section 1 (script-diff the strings against this spec; whitespace
   inside a string counts).
2. Titles, years, `dots` arrays, `dotCount` lines ("4 award items in
   2023", "4 award items in 2024", "11 award items in 2025"), and the
   undated-items footnote are byte-identical to the pre-change file.
3. No em dash anywhere in the file; "Four publications recorded" still
   reads exactly that; "Cerclage Table 1 analysis" (not "deep
   analysis"); 2026 paper list uses semicolons and the short forms.

Bead:

4. One desktop bead, one mobile bead, both 16px, `#0859D4` fill, 2px
   `#FAFAFA` border, `aria-hidden`, `pointer-events: none`.
5. Desktop bead `left` follows the section 2.2 calc with `beadIndex`
   from the five-window formula in 2.1; at `progress = 0` it sits on
   the 2021 column center, at `progress = 1` on the 2026 column
   center; inside each window it travels in the first half and dwells
   in the second half (verify by stepping progress 0, 0.1, 0.25, 0.35,
   0.5, 0.85, 0.95, 1 and checking the bead column each time).
6. Mobile bead `left` is 7px, `top` interpolates the measured mobile
   node centers by the same `beadIndex`; it is hidden above 1100px
   and the desktop bead is hidden at or below 1100px.
7. Year numeral pops `scale(0.9)` to `1` over 450ms with the overshoot
   curve once per bead arrival, and settles at scale 1 (no perpetual
   animation).
8. Arrival ring plays once per arrival (450ms, expanding to 14px
   spread and fading out), only when `progress > 0`, without
   disturbing the existing 2s pulse on the active node.
9. Fast scroll: bead may jump between distant nodes; its parked
   position still matches the current station window.

Seals:

10. All five seals render 28x28 beside their year numeral, year first,
    seal second, gap 10px, same position on every station, desktop and
    mobile, never overlapping title or body text.
11. Shapes match section 3.2 exactly (doorway, steps, circle plus
    ellipse, triangle plus apex square, two overlapping squares).
12. Rest state is white outline (`rgba(255, 255, 255, 0.6)`, no fill)
    on all five; active state (by `activeIdx`) is blue stroke, blue
    fill on closed shapes only, stroke-width 2 on the two open shapes,
    white stroke on the 2024 ellipse and the 2025 apex square, front
    2026 square outline-only; previous seal drains back on change.
13. Seal snap is `scale(1.25)` to `1` over 300ms with the overshoot
    curve, once per activation, settling at scale 1.

Lights:

14. Five desktop wells, one per column, using the section 4.1 calc
    geometry, `zIndex: -1`, gradient stops exactly as specified
    (white 0.10, blue 0.07, transparent 70%).
15. Active well opacity 1, inactive wells 0.3, all wells 0.3 when
    `activeIdx` is -1; crossfade `800ms ease`; no well ever exceeds
    the section 4.3 hard caps.
16. Mobile: wells hidden, single 40px glow centered on the 7px line
    behind the active station only, using the section 4.2 gradient.
17. Body text (`#D8D8D8`) is never dimmed, never animated, and stays
    fully legible over the brightest well at the active station.

Reduced motion and build:

18. Under `prefers-reduced-motion`: both beads hidden; seals static
    (no snap, no fill/stroke transition) with the 2026 seal filled
    and the rest outlines; wells uniformly 0.3 with no transition;
    mobile glow at 0.3 behind the 2026 station; route fully drawn;
    no scroll listener runs. Verify the reduced-motion branch sets
    `activeIdx` to 4.
19. No new dependency, no new scroll/resize listener, no scroll
    locking, no new listener of any kind; the only measurement added
    is the mobile node-center read inside the existing `update()`.
20. Production build passes (`npm run build` in
    `portfolionew-work/`), no TypeScript error, no unused variable
    (the repo uses `noUnusedLocals`), and `git status` shows only
    `src/sections/Manifesto.tsx` modified besides this spec doc.

## 7. Known risks and accepted trade-offs

- Bead vs `activeIdx` divergence: the bead follows scroll progress
  while seals and lights follow nearest-to-center. On a tall viewport
  the two signals can briefly disagree (bead parked on one station
  while another is nearest center). This is expected: each signal
  keeps its own meaning, and both converge at rest.
- The mobile glow does not animate its `top` between stations; it
  reappears behind the newly active station. A sliding glow would
  need per-frame measurement the spec avoids.
- The 2024 seal's ellipse line is visible at rest and as a white
  stroke over the filled disc when active; it is not a separate
  filled shape. If preview finds it muddy, the fallback is to keep
  the ellipse stroke-only in both states (already the case) and lower
  nothing else.
- Seal snap and year pop both use the site overshoot curve; if they
  ever fire in the same frame on the same station (bead arrival and
  active change coinciding), the two animations run on different
  elements (seal span vs year text) and do not interfere.
