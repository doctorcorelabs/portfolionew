# 01 - Horizontal Overflow Hunt

Role: overflow hunter, responsive fix (report only). No site edits, no build.

Work tree: `~/workspace/daivanlabs-rebuild/portfolionew-work` (React 19 + Vite 7 + TS).
Branch checked: `main`, at the Cochrane-swap commit `01aa04c` plus any later local state.

## 1. Method and limits

Method: source inspection plus arithmetic modeling only. No live browser was used.
The sandbox blocks localhost preview, so no pixel measurement was possible. Every
number below is computed from source values (widths, paddings, translate offsets)
against each breakpoint viewport width, not observed on a device.

Breakpoints modeled: 320, 360, 375, 390, 414, 768, 820, 1024, 1280, 1440, 1920.

Shared geometry used in all math: every homepage section uses inline horizontal
padding of 24px per side (Hero, Quote sticky, Services, Manifesto, Profile, Works,
Affiliations, Contact, Footer). Inner content divs use `maxWidth: 1160` with
`margin: 0 auto`. So for viewport width W below 1208, the content box is
`[24, W - 24]`; at W >= 1208 it is `[(W - 1160) / 2, (W + 1160) / 2]`.

## 2. User evidence

Phone screenshot, portrait, preview at awardport.netlify.app:

- Header logo clipped at the left edge: "vanLabs." visible, "Dai" cut off.
- A grey vertical strip along the entire right edge, top to bottom.
- The blue "Start a conversation" CTA sits normally at top right (it is
  `position: fixed`, so it does not move with page scroll).
- The FAERS card at the bottom is not visibly cut on the right.
- The dashed hero frame and its square handles sit at the right edge.

This is the classic signature of a page that is wider than the viewport and is
scrolled right: content at the left is cut, and the rightmost band shows the
canvas background. Two things must both be true for this screenshot: (a) some
element makes the page scrollable to the right, and (b) the canvas background
in the overflow band is grey, not white. Both were found in source.

## 3. The two-part mechanism

### Part A: something extends the page to the right

The Works section header (see contributor R1 below) sits 48px to the right of
its final position before it scrolls into view, and nothing clips it. That
alone makes the page 24px wider than the viewport at every phone and tablet
width. The overflow is present from page load, because the Works header is
below the fold and its reveal observer has not fired yet.

### Part B: the overflow band paints grey

`src/styles.css` (base html/body rule) sets the html background to `#f3f4f6`
(light grey). `src/main.tsx` imports `./styles.css` (line 5) BEFORE
`./styles/global.css` (line 7). `global.css` sets `body { background: #FFFFFF }`
but never sets an html background. Per CSS rules, the body background only
propagates to the canvas when html has a transparent background. Here html
has its own grey background, so the canvas (including every scrollable
overflow band) paints `#f3f4f6`, while the body box itself paints white.

So: scroll right by up to 24px, and the exposed right band is grey from top
to bottom, at every scroll position. That is exactly the screenshot.

Why the strip looks wider than 24px in the screenshot: the 24px figure is the
systematic scrollable overflow. The observed logo cut ("Dai", roughly 29 to
33px by Inter bold metrics at 20px) and strip width (roughly 35 to 40px of a
390px screenshot) exceed it by about 6 to 16px. Two honest explanations:
my font-width estimate carries a few px of error, and an iOS right-swipe can
transiently rubber-band past the scroll maximum during the gesture. The exact
scroll offset in the screenshot is unconfirmed (see section 8). The systematic
cause is 24px; the extra px are transient, not a second systematic contributor
at 390px (all other contributors fit at 390px, see section 4).

## 4. Ranked contributors

Overflow past the viewport right edge, in px, per breakpoint. 0 means fits.
Values are the element right edge minus W, clamped at 0.

| # | Contributor | 320 | 360 | 375 | 390 | 414 | 768 | 820 | 1024 | 1280 | 1440 | 1920 |
|---|-------------|-----|-----|-----|-----|-----|-----|-----|------|------|------|------|
| R1 BLOCKING | Works header, from-right 48px, pre-reveal | 24 | 24 | 24 | 24 | 24 | 24 | 24 | 24 | 0 | 0 | 0 |
| R2 BLOCKING | html grey canvas `#f3f4f6` (paints the band) | - | - | - | - | - | - | - | - | - | - | - |
| R3 minor | Works row meta, minWidth 220 | 12 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| R4 minor | Profile dt, minWidth 320 | 24 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| R5 minor | Profile email dd, unbreakable string (estimate) | 8 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |

Resulting page scrollable overflow (max of contributors, not their sum,
because scrollWidth is set by the single furthest right edge):

| Viewport | 320 | 360 | 375 | 390 | 414 | 768 | 820 | 1024 | 1280 | 1440 | 1920 |
|----------|-----|-----|-----|-----|-----|-----|-----|------|------|------|------|
| Scroll px | 24 | 24 | 24 | 24 | 24 | 24 | 24 | 24 | 0 | 0 | 0 |

R2 has no px value of its own: it does not widen the page, it colors the
overflow band grey. Without R2, the R1 overflow would still exist but would
show a white band (invisible against the white body). Without R1, R2 would
be invisible because there would be no overflow band to paint. Both must be
fixed for the symptom to fully disappear.

## 5. Contributor details

### R1 BLOCKING: Works section header, translateX(48px), unclipped

- File: `src/sections/Works.tsx`, header wrapper line 443:
  `className={`sec-slide from-right${headerIn ? " in" : ""}`}`.
  The file's own comment at line 24 confirms the intent: the section header
  rides a `sec-slide from-right` wrapper.
- Transform: `src/styles/section-slide.css` lines 15-16:
  `.sec-slide.from-right { transform: translateX(48px); }` with `opacity: 0`.
  The `.in` state (added by an IntersectionObserver at threshold 0.15) sets
  `transform: none`. Before the header enters view, the 48px offset is live.
- Why it escapes: the Works `<section>` (lines 264-272) sets only background,
  color, font, and padding `80px 24px 200px`. It has NO `overflow` rule.
  No ancestor clips either: `<main>`, `div#top`, body, and html have no
  overflow rule anywhere in `global.css`, `routing.css`, or `motion.css`.
  Transforms extend the document scrollable overflow area unless an ancestor
  clips, so the translated header extends scrollWidth.
- Math: the slide div is a block child of the maxWidth 1160 container, so
  its width equals the container width and its right edge is
  container-right + 48.
  - W < 1208: container-right = W - 24, slide right = W + 24, overflow 24.
    At 390: 390 - 24 + 48 = 414, which is 24 past 390.
  - 1208 <= W < 1256: container-right = (W + 1160) / 2, slide right =
    (W + 1160) / 2 + 48, overflow = (1256 - W) / 2. At 1240: 8.
  - W >= 1256: slide right <= W, overflow 0. At 1280: container-right =
    1220, slide right = 1268 < 1280, fits with 12px slack.
- Timing: at the top of the page (the screenshot state), the Works header is
  below the fold, the observer has not fired, and `.in` is absent, so the
  24px overflow is active. Once the user scrolls the Works header into view,
  `.in` removes the transform and the overflow disappears. That is why the
  issue can look intermittent: it exists on load and vanishes after Works
  is visited. Under `prefers-reduced-motion`, the stylesheet forces
  `transform: none`, so reduced-motion users never get this overflow.
- Contrast with Manifesto: Manifesto uses the same `from-right` pattern, but
  its `<section>` has `overflow: hidden` (`src/sections/Manifesto.tsx`
  line 371), so its translated child is clipped and harmless. Works is the
  only `from-right` section without that protection. Affiliations uses
  `from-left` (translateX(-48px)); in left-to-right layout, negative-direction
  overflow does not extend scrollWidth, so it is harmless.

### R2 BLOCKING: html background `#f3f4f6` paints the overflow band grey

- File: `src/styles.css`, base html/body rule (background `#f3f4f6` at
  around line 16). Import order in `src/main.tsx`: `./styles.css` line 5,
  then `./styles/tokens.css`, then `./styles/global.css` line 7.
- `global.css` sets `body { background: var(--paper); }` where `--paper` is
  `#FFFFFF` (`src/styles/tokens.css`), and sets body margin 0, but it never
  sets an html background. Because html has its own non-transparent
  background, the body white does not propagate to the canvas. Result: the
  body box is white, the canvas (all area outside the body box, including
  the horizontal overflow band) is `#f3f4f6` grey.
- Why the strip is full height: the overflow band is a vertical slice of the
  canvas, so it shows grey at every scroll position, top to bottom. This
  rules out the Contact section background (`#F5F5F7`, Contact.tsx styles)
  as the strip source: that grey covers only the Contact band, not the full
  page height.
- Side note: `src/styles.css` otherwise looks like a leftover generic
  stylesheet (`.app`, `.app-header`, `.canvas-shell`, `.canvas-item` rules)
  imported unconditionally in production. Its only load-bearing production
  effects are the html/body margin, padding, font, and background resets,
  most of which `global.css` already duplicates. The builder should verify
  no production route uses its classes before removing the import.

### R3 minor: Works row meta, minWidth 220, only at 320px

- File: `src/sections/Works.tsx`, row padding line 488
  (`padding: "32px 0 32px 150px"`), mobile media line 382
  (`@media (max-width: 700px) { .wk-row { padding-left: 88px !important; } }`),
  meta span line 521 (`minWidth: 220`). Rows use `flexWrap: wrap`, so the
  meta wraps to its own line on narrow screens, but it keeps its 220px
  minimum on that line.
- Math at W <= 700: meta left = 24 (section padding) + 88 (row padding-left)
  = 112. Meta right = 112 + 220 = 332, independent of W. Overflow =
  332 - W: at 320, 12px; at 360 and up, fits.
- Math at W > 700: row padding-left is back to 150, and the meta shares a
  line with the 32px index plus 32px gaps: meta right = 24 + 150 + 32 + 32
  + 220 = 458. That overflows only if W < 458, but this layout applies only
  above 700px, so the range is empty. Safe at 768 and up.
- The giant index numeral (`.wk-giant`, absolute, left 0, 56px font at
  <= 700px) sits inside the row padding area and does not extend past the
  row box. Not a contributor.

### R4 minor: Profile anchor dt, minWidth 320, only at 320px

- File: `src/sections/Profile.tsx`, line 469 (`minWidth: 320`) on the `dt`
  inside wrapping flex rows (`flexWrap: wrap`, gap `8px 48px`).
- Math: dt left = 24 (section padding), dt right = 24 + 320 = 344.
  Overflow = 344 - W: at 320, 24px; at 360 and up, fits.
- The Profile `<section>` (line 278, padding `130px 24px`) has no overflow
  rule, so this reaches the page at 320px. The section's own `from-left`
  header is harmless (leftward, see R1 contrast note).

### R5 minor: Profile email dd, unbreakable string, only at 320px (estimate)

- File: `src/sections/Profile.tsx`, anchor rows. The email value
  `daivanfebrijuansetiya@gmail.com` is a 32-character string with no spaces
  and no `overflow-wrap` on the `dd`, so its minimum width is its full
  rendered width, roughly 304px at 18px bold (estimate, font-metric
  dependent). On its wrapped line: dd right is roughly 24 + 304 = 328.
  Overflow at 320 is roughly 8px; at 360 and up it fits (content width 312
  at 360 versus about 304). The footer email already uses
  `overflowWrap: anywhere`; the Profile dd does not. This is the weakest
  number in the report because it rests on a font estimate, and it is
  masked at 320px by the larger R4 24px anyway.

## 6. Checked and cleared

These were audited and do NOT widen the page at any listed breakpoint:

- Viewport meta: `index.html` has
  `<meta name="viewport" content="width=device-width, initial-scale=1.0" />`.
  Not a viewport-meta issue.
- Hero section: `<section>` style has `overflow: hidden`
  (`src/sections/Hero.tsx` line 523). Desktop `.mv-collage` is absolute
  inset 0 with `overflow: hidden`, and the diorama layer is absolute inset 0
  with `overflow: hidden` plus `display: none` under `@media (hover: none)`.
  Below 720px the collage becomes a static flex column with
  `overflow: visible`, but the section's own `overflow: hidden` still clips
  it, so hero-internal spill cannot create page scroll on mobile either.
- Hero word and frame: word uses `clamp(72px, 16vw, 180px)` with
  `overflowWrap: break-word`, so it wraps (as the screenshot shows:
  "daivanl" / "abs."). The frame wrapper is `width: 100%` of the hero
  content box (viewport minus 48px section padding) with
  `boxSizing: border-box`, so the frame equals, never exceeds, the content
  width. The six 10px handles at -5px offsets sit inside the section clip
  (frame right = W - 24, handle right edge = W - 19).
- Hero collage cards (desktop, all inside the clipped hero): FaersCard
  fixed 240px, DockingCard 230, ReviewCard 220, PosterCard 260, AwardsCard
  168, StrokeCard maxWidth 260, GutAxisCard 230, MicroscopeCard 210,
  DeskCard 220, SearchWindow 260, PosterWindow 280, DnaHelix 100.
  Their absolute left% plus width values can exceed 100% on paper, but the
  hero section and collage layer both clip, so none of them reach the page.
- Mobile hero stack (below 720px): visible items are FaersCard (240px),
  NotifyBubble (intrinsic width, short text), and DbLogoRow (wraps, about
  263.5px at 320px viewport per the Cochrane QA). Each sits on its own
  flex line inside the hero content box (272px wide at 320px viewport:
  320 - 48 section padding). Every item fits its line; the binding check
  is per item, not summed. FaersCard 240 < 272, DbLogoRow 263.5 < 272.
- Header, current source: wordmark is 20px bold with `whiteSpace: nowrap`,
  about 115px wide; below 720px (`src/components/Header.tsx` line 64
  media query) the nav and the 200px CTA spacer are `display: none`,
  leaving only the wordmark (115 + 48 padding = 163 < 320). At 720 to
  768px the nav wraps (`flexWrap: wrap`) and flex items shrink to content
  minimums, staying inside the container. The fixed CTA uses
  `right: max(16px, calc((100vw - 1160px) / 2))`; fixed elements never
  create scroll overflow, and the max() floor keeps it at 16px below
  1160px. The 5s glow pulse animates box-shadow only.
- Manifesto: section `overflow: hidden` (line 371) clips both the
  `from-right` header and the absolute 900px blue drift glow (top -10%,
  right -8%, blur 80px). Safe regardless of inner sizes.
- Services: grid is `repeat(3, 1fr)` collapsing to `1fr` at
  max-width 1023px, with card padding 32px and wrapping text. Safe at all
  breakpoints.
- Affiliations: strip uses `flexWrap: wrap`, gap 48px 80px, items
  maxWidth 260. Corner ticks are absolute at -5px around `.af-item`, which
  is `position: relative`, so the furthest a tick can reach is 5px past an
  item edge. No row ends flush with the container right edge at any
  breakpoint (260px items plus 80px gaps never tile exactly to the
  container width), so ticks never cross the viewport edge in practice.
  Theoretical worst case is 5px, only if a row ended exactly flush.
- Quote: sticky wrapper with `overflow: visible`, but inner text blocks
  are maxWidth 960 and 640 with words at `clamp(34px, 4.5vw, 64px)` that
  wrap normally; dot layers are absolute inset 0 inside the sticky box.
  No fixed width, no nowrap span found. Safe.
- Contact: section `overflow: hidden` (Contact.tsx styles, line 434),
  giant title uses `overflowWrap: break-word`, body maxWidth 620, links
  wrap. Safe. Its `#F5F5F7` background is section-local, not the strip.
- Footer: nav uses `flexWrap: wrap` and links use
  `overflowWrap: anywhere`. Safe.
- App chrome: the fixed 2px reading-progress bar and 3px section-sweep bar
  are fixed with scaleX transforms (no scroll effect). The route fade
  animates opacity plus translateY only (vertical). Works row hover shifts
  the title 4px right and the arrow from translateX(8px) to 0, but that is
  hover-only (no touch effect), tiny, and absorbed by row padding.
- Global CSS: no `overflow-x` rule on html or body anywhere in
  `global.css`, `routing.css`, or `motion.css`. No `width: 100vw` width
  rule, no negative margins, and no other `translateX` beyond section
  slides, Works hover, and the App route fade were found by grep.

## 7. Single most-likely cause of the grey right strip on mobile

R1 plus R2 together, with R1 as the trigger and R2 as the color:

1. The Works `from-right` header (Works.tsx:443, section-slide.css:15-16)
   extends the page 24px to the right at every viewport below 1256px,
   including the user's phone, from page load until the Works header is
   scrolled into view. No section or ancestor clips it.
2. The page is therefore scrollable right by 24px. Swiped or scrolled
   right, the header wordmark shifts left ("Dai" cut) and the exposed
   right band shows the canvas background.
3. The canvas background is grey (`#f3f4f6` from `src/styles.css`) because
   `global.css` never sets an html background, so the body white does not
   propagate to the canvas. Hence a grey strip, full height, top to bottom.

Why not the other candidates: at the user's roughly 390px phone, R3 fits
(332 < 390), R4 fits (344 < 390), R5 fits, the hero is clipped by its
section, the header nav is hidden in current source, and Contact grey is
section-local. R1 is the only contributor active at 390px, and it is
active precisely in the screenshot state (top of page, Works below the
fold, reveal not yet fired).

## 8. Fix recommendations (not implemented by this report)

F1. `src/sections/Works.tsx` (section style, lines 264-272): add
    `overflow: "hidden"` to the section style, mirroring Manifesto
    (line 371) and Contact (line 434). One line. This alone removes R1
    at every breakpoint, including the pre-reveal state, without touching
    the reveal animation. Alternative: change the Works header wrapper
    (line 443) from `from-right` to `from-bottom` or `from-left`;
    leftward and vertical pre-reveal offsets do not extend scrollWidth
    in left-to-right layout. Prefer the section overflow fix because it
    also guards future absolute or translated children in Works.

F2. `src/styles/global.css`: add `html { background: #FFFFFF; }`, or
    equivalently remove the grey html background from `src/styles.css`.
    This removes R2: the canvas becomes white, so any residual overflow
    band is invisible. If the builder prefers removing the `styles.css`
    import from `src/main.tsx` (line 5), first verify no production route
    uses its classes (`.app`, `.canvas-shell`, `.canvas-item` look
    dev-canvas-only; `global.css` already covers body margin, font, and
    background).

F3. `src/styles/global.css` (safety net, same pass): add
    `html, body { overflow-x: clip; }`. Clip, not hidden: `overflow-x:
    hidden` on html or body can interfere with the Quote section's
    `position: sticky` pinning in some browsers, while `clip` does not
    create a scroll container and preserves sticky behavior. This nets
    any future spill from any section.

F4. `src/sections/Profile.tsx`, line 469: change the `dt`
    `minWidth: 320` to a flexible minimum (for example `minWidth: 0`
    with `flexBasis: 320` or `flex: "1 1 200px"`), so the label column
    shrinks below 320px instead of forcing a 24px overflow at 320px
    viewports. Add `overflowWrap: anywhere` to the anchor `dd` values
    so the 32-character email string can break (R5).

F5. `src/sections/Works.tsx`, media block line 382: extend the existing
    max-width 700px rule with a very-narrow guard, for example at
    max-width 360px set `.wk-row { padding-left: 56px !important; }`
    (meta left becomes 80, meta right 300 < 320, R3 gone) or set the meta
    `minWidth: 0` at that breakpoint. Either is one line inside the
    existing media block.

F6. Process, not code: confirm the deployed preview matches current main
    before re-testing. The screenshot shows nav links on a phone portrait
    (Experience, Education, Certifications, Contact visible), while
    current source hides the nav below 720px (Header.tsx line 64) and has
    six links, not four. The preview at awardport.netlify.app may be an
    older build or a different deploy. Re-check on a fresh deploy after
    F1 to F5; if the deployed build predates the 720px nav-hide, its
    mobile header (wordmark plus wrapped nav plus 200px spacer) would
    itself overflow by over 100px, which is a separate, larger problem
    confined to that stale build.

## 9. Verdict: what must be fixed before ship

Must fix before ship: F1 (Works overflow) and F2 (grey canvas). Together
they fully explain the reported symptom and remove it at the user's phone
width. F4 and F5 must also be fixed before ship: they are one-line changes
each, and without them the page still scrolls 24px at 320px viewports
(iPhone SE class, small Android) even after F1, because R4 alone holds the
page 24px wide there. F3 is recommended in the same pass as cheap insurance
for every section. F6 is a verification step, not a code change: do not
declare the fix verified until the user re-checks a fresh deploy, since
the screenshot's nav does not match current source.

After F1 to F5, modeled page scrollable overflow is 0px at every listed
breakpoint (320, 360, 375, 390, 414, 768, 820, 1024, 1280, 1440, 1920),
with the canvas white, so no grey band can appear even if a future element
spills.

## 10. Open and unconfirmed items

- The deployed preview may be a stale build (screenshot nav versus
  current source, see F6). Unconfirmed; the parent should check the
  deploy commit.
- The exact horizontal scroll offset in the screenshot is unconfirmed.
  The systematic overflow is 24px; the extra few px of observed logo cut
  are attributed to font-estimate error plus transient iOS rubber-band
  overscroll, not to a second systematic contributor at 390px.
- The Profile email width (R5, about 304px) is a font-metric estimate, not
  a measured value. It does not change the verdict: R4 masks it at 320px.
- All numbers are modeled from source, not measured on device. A live
  check on a fresh deploy (phone 390px, small phone 320px, tablet 768px,
  desktop 1440px) is still owed, because the sandbox blocks localhost
  preview.
