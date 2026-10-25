# Below-hero sections responsive audit (report only)

Scope: every homepage section below the hero, in page order:
Quote, Services, Manifesto (journey), Profile, Works, Affiliations,
Contact, Footer. Files live under `src/sections/` (Quote, Services,
Manifesto, Profile, Works, Affiliations, Contact) and
`src/components/` (Footer). Homepage order confirmed in
`src/App.tsx` lines 39-45, Footer at line 331.

Method: code inspection plus px modeling only. No live browser
check was possible (sandbox blocks localhost preview), so every
number below is computed from the source, not observed on screen.
Breakpoints tested: 320, 375, 414, 768, 1024, 1440.

## Shared geometry (applies to every section)

- Every section pads `24px` on both sides and centers a
  `maxWidth: 1160` container. Content width is therefore
  `min(viewport - 48, 1160)`:
  320 -> 272, 375 -> 327, 414 -> 366, 768 -> 720, 1024 -> 976,
  1440 -> 1160.
- There is NO `overflow-x: hidden` (or any overflow guard) on
  `html`, `body`, or any shared wrapper (checked
  `src/styles/global.css`, `src/styles/*.css`, `src/App.tsx`).
  Consequence: any section child wider than the content column
  becomes page-level horizontal overflow, which matches the grey
  strip on the right of the user's phone screenshot.
- Global heading trap (standing lesson, verified in
  `src/styles/tokens.css` line 9): `--title: #1D1D1F` forces all
  `h1-h6` dark. Dark sections must carry explicit light colors.
  Result below: no dark-section heading bug was found in these
  sections. Services and Manifesto both carry explicit light
  colors (and Manifesto additionally uses the `.dark-section`
  class, which sets headings to paper).
- Global `p { max-width: 62ch }` (`--measure`, tokens line 29)
  caps line length but never forces width, so it causes no
  overflow anywhere.

## Verdict summary

| Section | 320 | 375 | 414 | 768 | 1024 | 1440 | Worst issue |
|---|---|---|---|---|---|---|---|
| Quote | pass | pass | pass | pass | pass | pass | none |
| Services | pass | pass | pass | pass | pass | pass | none blocking |
| Manifesto | pass | pass | pass | pass | pass | pass | narrow cols 901-1024 (minor) |
| Profile | BLOCK | pass | pass | pass | pass | pass | dt minWidth 320 overflows below 368 |
| Works | BLOCK | pass | pass | pass | pass | pass | meta minWidth 220 overflows below 356 |
| Affiliations | pass | pass | pass | pass | pass | pass | none |
| Contact | pass | pass | pass | pass | pass | pass | email pill wraps (minor) |
| Footer | pass | pass | pass | pass | pass | pass | low contrast footer grey (minor) |

Two sections cause real page horizontal overflow, both only on
narrow phones. Details and fixes below.

## 1. Quote (between hero and Services, bonus section)

Not in the assigned list but it sits below the hero, so it is
covered briefly. File: `src/sections/Quote.tsx`.

- Layout: pinned wrapper (`100svh + 1875px + 240px` runway;
  `100svh + 1125px + 140px` at max-width 1023px) with a sticky
  child (`min-height: 100svh`, padding `70px 24px` at max-width
  1023px). No inner scroll container.
- H1 `clamp(34px, 4.5vw, 64px)`, plain word spans that wrap
  normally. At 320 the claim wraps to many lines and the sticky
  child grows past viewport height; this is intentional per the
  file comment ("min-height, not height") and causes no
  horizontal overflow.
- Dot layers are `position: absolute; inset: 0` repeating
  patterns only, no width.
- Text: 18px mission, maxWidth 640, graphite on white.
- Verdict: PASS at all six breakpoints. No fix needed.

## 2. Services (dark #010101, 3 columns)

File: `src/sections/Services.tsx`.

(a) Layout mechanism. `.svc-grid` is
`grid-template-columns: repeat(3, 1fr)`, gap 20px, switching to
`1fr` with gap 45px at max-width 1023px (CSS block in the file).
Card min-height: 520px desktop, 470px at max-width 1400px,
350px at max-width 1023px. Card padding 32px sides.

(b) Fixed widths / unbreakable strings. None. Card titles and
body are block text that wraps. The pill link text is the short
word "View" (the long label is only an aria-label, not rendered).

(c) Readability and contrast. Section heading
`clamp(40px, 6vw, 72px)` with explicit `color: #FFFFFF` (the file
comment names the global-heading trap and beats it). Card
titles 36px desktop, 28px at max-width 1023px, explicit white.
Body 17px, line-height 1.65, `rgba(255, 255, 255, 0.8)` on
`#0859D4`: roughly 4.6:1, a borderline AA pass for normal text.
Kicker `#98989C` on `#010101`: roughly 7.4:1, pass.
At 320 the column is 272px, card text width 208px after
padding; "Teaching and mentoring" wraps to 3 lines at 28px, no
overflow. At 1024 the three cards are (976 - 40) / 3 = 312px
each, comfortable.

(d)-(f) No watermark, no footer role, no overflow contribution
at any breakpoint. Card `::after` halftone and corner ticks are
absolute `inset: 0` / inside-corner, and the hairline animates
to 100% width, all inside the card.

Verdict: PASS at all six breakpoints. No fix needed.
Minor note only: on phones the three 350px-minimum cards plus
45px gaps make a very tall section (about 1300px plus header),
which is a design property, not a defect.

## 3. Manifesto (dark #111, journey route)

File: `src/sections/Manifesto.tsx`.

(a) Layout mechanism. Desktop: `.journey-grid` is
`grid-template-columns: repeat(5, 1fr)`, column-gap 24px, with
rows `auto 48px auto` (stations alternate above/below the
dashed line). At max-width 900px the grid becomes `display:
block` and stations stack beside a vertical dashed line
(`padding-left: 40px`, node dot at left 0, line at left 7px).
Station articles carry `minWidth: 0`, so grid items shrink
correctly instead of forcing column width.

(b) Fixed widths / unbreakable strings. None. Column widths:
1440 -> (1160 - 96) / 5 = 212.8px; 1024 -> 176px; 901 ->
151.2px. No overflow at any width because text wraps and
`minWidth: 0` is set. Mobile text column at 320 is
272 - 40 = 232px, fine.

(c) Readability and contrast. All colors explicit per the file
header comment: headings `#FAFAFA`, body `#D8D8D8`, labels
`#98989C`. Body on `#111` is roughly 13:1, labels roughly
6.6:1, both pass. Year `clamp(28px, 3vw, 40px)`, station title
`clamp(22px, 2vw, 28px)`, detail 16px.
Minor readability note: at 901-1024px the five desktop
columns are only 151-176px wide with 16px text, so the long
2026 detail wraps very tall and reads cramped. The 900px
switch to the vertical layout is late; moving it to about
1100px would fix the cramped band. Not blocking, no overflow.

(d)-(f) No watermark or footer role. The 900x900 drift blob
(`top: -10%`, `right: -8%`) is clipped by the section's own
`overflow: hidden`, so it cannot cause page overflow.

Verdict: PASS at all six breakpoints, one minor improvement
(vertical switch threshold 900px -> about 1100px).

## 4. Profile (light #FAFAFA)

File: `src/sections/Profile.tsx`.

(a) Layout mechanism. `.mvP-grid` is
`grid-template-columns: 300px 1fr`, gap 48px, switching to
`1fr` at max-width 900px. Portrait frame scales (`img width:
100%`), so the photo column is 272px wide at 320 with the
image 238px after 16px frame padding. Bio column maxWidth 680.

(b) Fixed widths / unbreakable strings. BLOCKING: the anchor
rows (`<dl>`, near the end of the file) render each `<dt>`
with `minWidth: 320` inside a flex row with `flexWrap: wrap`.
At 320 viewport the content column is 272px, so the 320px
`<dt>` alone overflows the column by 48px, and because the
section has no overflow guard, that becomes 48px of page
horizontal overflow. At 360 viewport the content column is
312px, so it overflows by 8px. Threshold: any viewport below
368px overflows (content width below 320px). At 375 (content
327px) the `<dt>` fits with 7px slack and the `<dd>` wraps
below it, so 375 and up are clean.
Other strings checked: the email link
(`daivanfebrijuansetiya@gmail.com`, 32 chars at 13px mono,
about 250px) fits the 272px column at 320. The H2
`clamp(48px, 8vw, 96px)`: "researcher" at 48px is about 264px,
just inside 272px, and the "builds" highlight (padding 18px
plus 16px knobs) fits on its own wrapped line. No other fixed
widths.

(c) Readability. Light section, headings explicitly `#010101`,
body 18px/1.65, anchors 13px mono labels with 18px bold values.
Contrast is high throughout (ink on `#FAFAFA`, about 20:1).
Fact chips (`white-space: nowrap`, e.g. "Most Outstanding
Student UII 2025", about 205px) are hidden on touch devices
(`@media (hover: none) { display: none }`) and under
reduced motion, so they cannot overflow phones. On a
mouse-driven narrow desktop window the left chip extends to
10px from the viewport edge at 320px (tight, not overflowing),
and the bottom chip can overlap the caption by about 14px
(cosmetic, desktop only).

(d)-(e) Not applicable (no watermark, no footer role).

(f) Overflow contribution: YES, blocking, viewports below
368px: 48px at 320, 8px at 360, 0 at 375 and up.

Fix (blocking): `src/sections/Profile.tsx`, anchor `<dt>`
style: change `minWidth: 320` to `minWidth: "min(320px, 100%)"`
(or drop the min-width and let the label wrap). One-line
change, no layout impact at 375px and up.

Verdict: BLOCKING at 320 (and any viewport below 368);
PASS at 375, 414, 768, 1024, 1440.

## 5. Works (light, 9 rows)

File: `src/sections/Works.tsx`.

(a) Layout mechanism. Rows are flex with `flexWrap: wrap`,
gap `16px 32px`, `padding: 32px 0 32px 150px` desktop and
`padding-left: 88px` at max-width 700px. Row children: index
(`minWidth: 32`), meta (`minWidth: 220`), title block
(`flex: 1 1 320px`, `minWidth: 0`), link (`whiteSpace:
nowrap`). A vertical dashed route sits at left 70px desktop,
34px mobile, with a 10px traveler dot on the same x; row text
starts at 150px/88px, so the route never touches text.

(b) Fixed widths / unbreakable strings. BLOCKING: the meta
span (`minWidth: 220`) is wider than the mobile row content
area. Mobile row content = content width minus 88px left
padding = viewport - 136px. At 320 that is 184px, so the
220px meta span overflows by 36px, and with no section
overflow guard that becomes 36px of page overflow. Threshold:
viewports below 356px overflow (viewport - 136 < 220). At 360
the area is 224px, so the meta fits with only 4px slack
(tight, passes). At 375 the area is 239px (19px slack) and at
414 it is 278px, both clean. Long titles (row 05 is about 150
characters) wrap safely because the title block has
`minWidth: 0` and `flex: 1 1 320px`.
Giant outlined numerals: desktop `clamp(64px, 9vw, 120px)`,
"01" is about 132px wide at 120px font, inside the 150px left
padding; mobile 56px, about 62px wide, inside the 88px left
padding. No overlap with text at any breakpoint.

(c) Readability. H2 `clamp(48px, 8vw, 96px)` wraps cleanly
("Selected works." breaks to two lines at 320). Titles 28px,
descriptions 17px/1.6, graphite `#1d1d1f` on white (about
16:1). Meta 12px mono uppercase, muted `#98989c` on white
(about 2.9:1, low but it is metadata, and the same treatment
is used site-wide; the row titles and descriptions carry the
real content). At 768 the row wraps (index + meta + title
stack across lines) with no overflow.

(d)-(e) Not applicable.

(f) Overflow contribution: YES, blocking, viewports below
356px: 36px at 320, 0 at 360 and up (4px slack at 360).
Transient minor: the section header rides a `sec-slide
from-right` wrapper (`translateX(48px)` for 700ms, see
`src/styles/section-slide.css`), and this section has no
overflow guard, so during the header entrance the page can
show up to 48px of transient right overflow at any width.
It settles to zero once the slide finishes.

Fix (blocking): `src/sections/Works.tsx`, row meta span
style: change `minWidth: 220` to `minWidth: 0` (the text
inside, e.g. "2024 - Conference paper, IC-CVD", then wraps
within the available width) or, if a fixed meta column is
wanted on desktop, keep 220px above 700px and set 0 below it
in the existing max-width 700px media block.
Fix (minor, transient): add `overflow: hidden` to the Works
`<section>` (same one-line pattern Manifesto and Contact
already use), which also guards any future wide child.

Verdict: BLOCKING at 320; tight but passing at 360-375;
PASS at 414, 768, 1024, 1440.

## 6. Affiliations (light, logo wall)

File: `src/sections/Affiliations.tsx`.

(a) Layout mechanism. Flex strip, `flexWrap: wrap`, gap
`48px 80px`, items `maxWidth: 260`, no min-width. Badges are
dashed-frame boxes with 10px corner ticks at -5px offsets.

(b) Fixed widths / unbreakable strings. None that overflow.
Longest name ("Universitas Islam Indonesia", 29 chars, 16px
bold mono uppercase, about 297px unconstrained) wraps inside
the 260px max-width badge. At 320 the badge is 260px inside
the 272px column, and the -5px ticks sit at 19px from the
viewport edge, inside. Column counts fall out naturally: 1
per row at 320-375, 2 per row at 768 (2 x 260 + 80 = 600, fits
720), 3 per row at 1024 (3 x 260 + 160 = 940, fits 976).

(c) Readability. Names 16px bold mono uppercase, relations
12px mono uppercase muted, intro 18px/1.6. Mark color
`#4a4a4a` on white is about 9:1. The pop entrance and the
11s text float are decorative only and disabled under
reduced motion.

(d)-(f) No watermark or footer role, no overflow at any
breakpoint.

Verdict: PASS at all six breakpoints. No fix needed.

## 7. Contact (light #F5F5F7, watermark + giant headline)

File: `src/sections/Contact.tsx`.

(a) Layout mechanism. Section `position: relative`,
`overflow: hidden`, padding `130px 24px 200px`; inner
container maxWidth 1160. All decorative layers (dot fields,
watermark, pills, cursor chip) are absolutely positioned
inside the clipped section.

(b) Fixed widths / unbreakable strings. None that escape.
The email pill is the only wide element: 18px bold text
(about 320px) plus 72px horizontal padding is about 392px,
wider than the 272px column at 320, but the pill carries
`overflowWrap: "anywhere"`, so the address breaks across
lines instead of overflowing. Cosmetic consequence: on
phones the email wraps mid-string over two lines. Social
links wrap naturally (a " | " separator can strand at a
line start, cosmetic only).

(c) Readability. Headline `clamp(56px, 13vw, 200px)`, three
line-masked words ("Let's", "build", "together."). At 320 the
longest word "together." at 56px is about 267px after -0.02em
tracking, inside the 272px column with 5px slack, and the
headline also carries `overflowWrap: "break-word"` as a
backstop. At 768 it is about 476px, at 1024 about 640px, at
1440 about 908px, all inside their columns. Body 18px/1.65,
maxWidth 620, `#1D1D1F` on `#F5F5F7` (about 15:1).

(d) Watermark monogram. `.contact-watermark` is "DL" at
266px desktop and 170px at max-width 1023px, line-height
0.82, tracking -10px, centered with translate(-50%, -50%).
At 170px it is about 200px wide (spans roughly 60-260px on a
320px viewport, inside). At 266px it is about 320px wide,
centered, fine on desktop. Because the section has
`overflow: hidden`, even a wider render could not cause page
overflow. It does not crowd the headline: it sits at z-index
0 behind the content wrapper (z-index 1) at 92 percent white
fill with a faint outline, so it reads as background.
Decorative pills and the cursor chip are `display: none`
on touch (`@media (hover: none)`) and under reduced motion.

(e) Not applicable (no footer role).

(f) Overflow contribution: none at any breakpoint.

Verdict: PASS at all six breakpoints.
Minor improvements (optional, cosmetic only): shrink the
email pill below about 480px (16px font, 24px side padding)
so the address breaks into two cleaner lines instead of
wrapping mid-string at an arbitrary point; the wrap itself
is already safe.

## 8. Footer

File: `src/components/Footer.tsx`.

(a) Layout mechanism. Footer padding `40px 24px`, inner
container maxWidth 1160. Nav is flex with `flexWrap: wrap`,
gap `12px 24px`.

(b) Fixed widths / unbreakable strings. None. The email link
(32 chars at 11px mono, about 211px) fits the 272px column
at 320 and also carries `overflowWrap: "anywhere"` as a
backstop. Link labels are short words.

(c) Readability. Lines and links are 11px JetBrains Mono
uppercase, letter-spacing 0.08em, line-height 1.7 (the task
brief said 10px; the code uses 11px). Color is
`rgba(66, 66, 66, 0.6)` on white, which blends to about
`#A3A3A3`, roughly 2.4:1: below AA for normal text. This is
a minor accessibility note, not an overflow issue; the
footer lines are meta text, but raising the alpha to 0.85
(about 4.6:1) would pass AA with no layout change.

(d)-(e) No watermark. The mono lines wrap cleanly at 320
("Faculty of Medicine, Universitas Islam Indonesia" breaks
across lines, no overflow).

(f) Overflow contribution: none at any breakpoint.

Verdict: PASS at all six breakpoints for layout.
Minor: footer grey contrast about 2.4:1 (fix: alpha 0.6 ->
0.85 in `styles.line` and `styles.link`).

## Overflow attribution for the user's screenshot

The screenshot shows a phone page with a persistent grey
strip on the right edge. For viewports 375px and wider, NONE
of the below-hero sections overflow: Profile fits from 375
up (content 327px beats the 320px `<dt>`) and Works fits
from 360 up (content area beats the 220px meta). So if the
user's phone viewport is 375-430px (typical modern phones),
the grey strip is almost certainly NOT coming from these
sections; it is more likely coming from the hero collage or
the header, which are outside this report's scope. If the
user's phone viewport is 320-360px, Profile (up to 48px)
and Works (up to 36px) are real contributors and their
fixes above close the gap. Either way, adding a global
`overflow-x: hidden` guard (see fix 3 below) would mask any
remaining section overflow, but it should not replace the
two min-width fixes, which are genuine layout bugs.

## Fix list, in priority order

1. BLOCKING, Profile: `src/sections/Profile.tsx`, anchor
   `<dt>` style: `minWidth: 320` -> `minWidth: "min(320px,
   100%)"`. Closes up to 48px page overflow below 368px
   viewports.
2. BLOCKING, Works: `src/sections/Works.tsx`, row meta span
   style: `minWidth: 220` -> `minWidth: 0` (or keep 220px
   above 700px and set 0 inside the existing max-width
   700px media block). Closes up to 36px page overflow
   below 356px viewports.
3. DEFENSIVE, global: add `overflow-x: hidden` on `body`
   (or a page wrapper) in `src/styles/global.css`, so no
   future section child can reopen a page-level horizontal
   scroll. Do this in addition to fixes 1 and 2, not
   instead of them.
4. MINOR, Works: add `overflow: hidden` to the Works
   `<section>` to kill the transient 48px right overflow
   during the 700ms from-right header slide.
5. MINOR, Manifesto: move the vertical-layout switch from
   max-width 900px to about 1100px in
   `src/sections/Manifesto.tsx`, to relieve the cramped
   151-176px desktop columns at 901-1024px.
6. MINOR, Footer: raise footer text alpha from 0.6 to 0.85
   in `src/components/Footer.tsx` (`styles.line` and
   `styles.link`) for roughly 4.6:1 contrast.
7. MINOR, Contact: optionally shrink the email pill below
   about 480px (16px font, 24px side padding) so the address
   wraps more cleanly on phones; the current wrap is safe.

## Method note

Code inspection and px modeling only. No live browser check
was possible, so all widths are computed from the source
and should be confirmed once against the Netlify preview on
a real phone, especially the 320px Profile and Works
overflow and the 375-430px grey strip, whose cause this
report places outside the below-hero sections.
