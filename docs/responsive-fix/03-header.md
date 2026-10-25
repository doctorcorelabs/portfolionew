# Header / nav responsive audit (report only)

Scope: `src/components/Header.tsx` (full file read), `src/App.tsx`
header wrapper, `src/styles/global.css` (reset and body rules).
Method: code inspection plus px modeling only. No live browser
was available, so all widths below are modeled from Inter
metrics, not measured on screen. Inter estimates used throughout:
logo "DaivanLabs." at 20px/700 is about 125px wide; nav labels at
15px are Research about 65, Awards about 50, Experience about 82,
Education about 72, Certifications about 110, Contact about 57
(text sum about 436, plus 5 gaps of 24px gives a nav block of
about 556px); the "Start a conversation" CTA at 14px/600 with
10px 18px padding is about 192px wide and about 40px tall. Treat
every derived number as accurate within about plus or minus 8px.

## 0. The screenshot does not match this tree (read first)

The user screenshot (phone portrait, preview at
awardport.netlify.app) shows: logo clipped at the left edge
("vanLabs." visible, "Dai" cut), nav visible and wrapped to two
lines (Experience/Education, then Certifications/Contact), and a
blue "Start a conversation" CTA at top right. Research and Awards
are missing from the visible nav, which is consistent with the
page being scrolled right: the first two links scrolled out on
the left together with "Dai".

The current tree cannot produce that screenshot on a phone.
`Header.tsx` lines 64-67 hide the whole nav and the CTA spacer
at widths of 720px and below:

```css
@media (max-width: 720px) {
  .onlines-nav { display: none; }
  .onlines-cta-spacer { display: none; }
}
```

So on a phone the current tree shows logo only, never a wrapped
nav. Conclusion: either the deployed awardport build is stale
(built before the 720px hide rule, or from another branch), or
the screenshot was taken with the page zoomed or horizontally
scrolled. Fix recommendation 4 covers the deployment parity
check. The rest of this report audits the current tree per
breakpoint, then models the nav-visible variant that matches the
screenshot, because that variant is where the clip mechanism
lives.

## 1. Header layout mechanism

- `Header.tsx` lines 73-135: a `header` element in normal flow
  (not fixed, not sticky) with a 1px bottom hairline, containing
  one inner div: `maxWidth: 1160`, `margin: 0 auto`, `padding:
  20px 24px`, `display: flex`, `alignItems: center`,
  `justifyContent: space-between`, `gap: 24` (lines 77-83).
- Three flex children: (1) the wordmark link "DaivanLabs."
  (lines 85-99: 20px/700, `whiteSpace: nowrap`, line 95);
  (2) the `nav` (lines 100-124: flex row, `gap: 24`,
  `flexWrap: wrap`, `justifyContent: flex-end`, lines 106-108)
  with 6 links (lines 9-16); (3) an empty spacer div, 200px
  wide, `flexShrink: 0` (lines 125-131), whose only job is to
  reserve room for the fixed CTA.
- The CTA (lines 136-154) is a separate fixed anchor, not part
  of the header flow: `position: fixed`, `top: 14`,
  `right: max(16px, calc((100vw - 1160px) / 2))` (line 140),
  `zIndex: 100`, blue pill, with a 5s glow pulse animation
  (disabled under reduced motion, lines 45-49).
- `App.tsx` wraps `<Header />` in a plain div that only adds a
  shadow once scrolled past 24px. It adds no height, no padding,
  and no width constraint, so it contributes nothing to any
  overflow or clip.
- `src/styles/global.css` sets `box-sizing: border-box` globally
  (line 17) and `body { margin: 0 }` (line 25). There is no
  `overflow-x` rule on html or body anywhere in global.css,
  styles.css, App.tsx, or main.tsx. The two `overflow: hidden`
  hits in styles.css are canvas-dev classes only, irrelevant
  here. Consequence: any section that overflows horizontally
  makes the whole page horizontally scrollable, and a scrolled
  page clips content at the left edge. That is the mechanism
  behind the screenshot, not a header negative margin (there is
  none) and not a fixed-width header (the header is a normal
  block at viewport width).

## 2. Why the logo clips in the screenshot (modeled)

In the current tree, on a phone, the header cannot clip the logo
by itself: the only visible child is the logo (about 125px) plus
48px of container padding, total about 173px, far below even a
320px viewport. The fixed CTA also cannot expand the scroll
area: `position: fixed` elements never contribute to scroll
overflow.

In the nav-visible variant shown in the screenshot (nav plus
spacer both rendered on a phone), the header row minimum content
width is: logo about 125 + gap 24 + nav minimum (its longest
single word, "Certifications", about 110, since wrapping cannot
break a word) + gap 24 + spacer 200 (flexShrink 0, never
shrinks) = about 483px of content width. Against phone content
widths (viewport minus 48px padding), the header alone overflows
to the right by:

| Viewport | Content width | Header min content | Right overflow from header alone |
|---|---|---|---|
| 320 | 272 | about 483 | about 211px |
| 360 | 312 | about 483 | about 171px |
| 375 | 327 | about 483 | about 156px |
| 390 | 342 | about 483 | about 141px |
| 414 | 366 | about 483 | about 117px |

A page that scrolls horizontally by 117-211px, viewed while
scrolled right by roughly 40-200px, shows exactly the
screenshot: "Dai" (about 40px) cut at the left, Research and
Awards scrolled out on the left, Experience/Education and
Certifications/Contact wrapped on the right, CTA pinned top
right, and a grey overscroll strip at the far right edge.
Corroboration inside the same screenshot: the hero word wraps
as "daivanl" / "abs.", which is also consistent with a page
rendered wider than the viewport or zoomed, and belongs to the
hero analyst, not to this report. Bottom line: the clip is a
page horizontal-scroll state, driven in nav-visible builds by
the header row minimum width (spacer 200px plus nav minimum),
and possibly by other sections in the current build. The header
in the current tree contributes 0px of overflow at every
breakpoint in section 5, so if the deployed build equals this
tree, the overflow source is elsewhere on the page.

## 3. Per-breakpoint verdicts (current tree)

Content width below means viewport width minus 48px of header
padding, except at 1440 where the 1160px maxWidth binds.

### 320px: BLOCKING (CTA covers the logo)

- Header row: logo only (nav and spacer hidden). Logo right
  edge at 24 + 125 = 149px. Header height about 65px.
- CTA: left edge = 320 - 16 - 192 = 112px. Overlap with the
  logo = 149 - 112 = about 37px. The fixed blue pill covers the
  tail of "DaivanLabs." (roughly the "s."). Tap target of the
  CTA itself is fine (about 192 x 40px), but it hides logo text.
- The overlap band is viewports below about 357px (logo right
  149 plus CTA width 192 plus right offset 16 = 357). At 320 it
  is a real overlap; see fix 1.
- Header overflow contribution: 0px.

### 360px: MINOR (CTA nearly touches the logo)

- CTA left edge = 360 - 16 - 192 = 152px. Gap to logo right
  edge (149px) = about 3px. No overlap, but one font-metrics
  rounding away from touching. Same fix as 320px covers it.

### 375px: PASS (minor: no nav on phones)

- CTA left edge = 167px, gap to logo about 18px. Header clean.
- The standing phone issue (all phones, not specific to 375):
  there is no mobile navigation at all. No hamburger, menu
  button, or mobile nav exists anywhere in `src/` (the only
  "menu" hit is a dev canvas comment). The footer has social
  links only (LinkedIn, ORCID, Instagram) and zero internal
  route links. A phone visitor cannot reach Research, Awards,
  Experience, Education, or Certifications from the homepage.
  Blocking as a UX gap, minor as a layout gap. See fix 2.

### 390px: PASS (same phone note as 375px)

- CTA left edge = 182px, gap to logo about 33px. Header clean.
- Mobile nav gap from 375px applies unchanged.

### 414px: PASS

- CTA left edge = 206px, gap to logo about 57px. Header clean.
- Mobile nav gap applies unchanged.

### 768px (tablet portrait): MINOR (tall wrapped header, no overlap)

- Content width 720px. Fixed items: logo about 125 + spacer
  200 + 2 gaps of at least 24 = about 373px. Nav available =
  720 - 373 = 347px, below the nav block of about 556px, so the
  nav wraps to 2 lines. Greedy line break with 24px gaps: line 1
  = Research + Awards + Experience + Education (65 + 24 + 50 +
  24 + 82 + 24 + 72 = 341px, fits 347); line 2 = Certifications
  + Contact (110 + 24 + 57 = 191px). Both lines right-aligned
  inside the nav box.
- Positions: logo 24-149px; nav box 173-520px; spacer 544-744px.
  CTA spans 560-752px, which overlaps only the empty spacer
  zone, not the nav box (nav ends at 520px). CTA right edge sits
  8px past the content box (744px) but inside the viewport;
  harmless.
- Header height = 20 + (21 + 24 row gap + 21) + 20 + 1 border =
  about 107px, versus 65px single-line. The 24px row gap between
  wrapped nav lines is what inflates it.
- Tap targets: nav links are about 21-24px tall (15px font plus
  3px underline padding, no vertical padding). Below the 44px
  touch guidance; horizontal 24px gaps help but do not fix the
  height. Minor.
- Header overflow contribution: 0px (nav wraps; its minimum
  width of about 110px fits the 347px available easily).

### 820px (tablet portrait, large): MINOR (same as 768px)

- Content width 772px. Nav available = 772 - 373 = 399px.
  Line 1 = the same 4 links (341px; adding Certifications would
  need 341 + 24 + 110 = 475px, over 399px). Line 2 =
  Certifications + Contact (191px). Header height about 107px.
- Positions: nav box 173-572px; spacer 596-796px; CTA 612-804px,
  again over the empty spacer only. No nav overlap.
- Tap targets: same 21-24px minor note as 768px.
- Header overflow contribution: 0px.

### 1024px (tablet landscape / small laptop): PASS

- Content width 976px. Nav available = 976 - 373 = 603px, above
  the nav block of about 556px, so the nav fits on ONE line.
  Header height back to about 65px.
- Positions (space-between distributes the 81px of free space
  into the two gaps, about 40px each): logo 24-149px, nav about
  190-760px, spacer about 800-1000px. CTA right offset is 16px
  (the max() formula picks 16px while viewport is below 1160px
  plus margins), so CTA spans 816-1008px, over the spacer only.
  No nav overlap, no overflow.
- Tap targets: same 21-24px minor note (desktop mouse users,
  so lower weight here).

### 1440px (desktop): PASS (aligned by design)

- Container maxWidth 1160px binds: outer box 140-1300px,
  content box 164-1276px (1112px). Nav fits on one line.
  Positions: logo 164-289px; free space 1112 - 125 - 556 - 200
  = 231px, split into two gaps of about 115px; nav about
  404-961px; spacer 1076-1276px.
- CTA right offset = max(16, (1440 - 1160) / 2) = 140px, so CTA
  spans 1108-1300px. Its right edge lands exactly on the
  container outer edge (1300px), and it sits over the spacer
  zone. The 8px difference between CTA width (about 192px) and
  spacer width (200px) shows as an 8px inset on the CTA left
  side, which reads as intentional alignment, not a bug.
- Header aligns with the 1160px container used by the sections.
  No change needed.
- Header overflow contribution: 0px.

## 4. Header horizontal overflow summary

| Breakpoint | Current tree header overflow | Nav-visible variant header overflow |
|---|---|---|
| 320 | 0px | about 211px right |
| 360 | 0px | about 171px right |
| 375 | 0px | about 156px right |
| 390 | 0px | about 141px right |
| 414 | 0px | about 117px right |
| 768 | 0px | 0px (wraps) |
| 820 | 0px | 0px (wraps) |
| 1024 | 0px | 0px (one line) |
| 1440 | 0px | 0px (one line) |

The current tree header never overflows at any audited
breakpoint. The fixed CTA never contributes to scroll overflow
at any breakpoint. Any horizontal scroll in the current build
comes from another section (hero or later sections), and the
screenshot clip additionally requires a scrolled or zoomed
viewport state. Do not "fix" the header to chase a clip it does
not cause in this tree; fix the phone CTA overlap (320px) and
the missing mobile nav, and verify the deploy (fix 4).

## 5. Fix recommendations (not implemented by this report)

1. BLOCKING, phones 320-356px, CTA covering the logo.
   File: `src/components/Header.tsx`. Add a class to the
   wordmark link (it currently uses only inline styles, so a
   stylesheet rule cannot target it today) and add to the
   existing `<style>` block:
   `@media (max-width: 400px) { .hdr-logo { font-size: 18px; }
   .hdr-cta-pulse { font-size: 12px; padding: 8px 12px; } }`.
   Result at 320px: logo right edge about 137px, CTA width
   about 158px, CTA left edge about 146px, gap about 9px.
   Alternative if the CTA must stay prominent: hide the fixed
   CTA at 400px and below (the contact section already exists
   as the conversion path); do not just shrink the logo, since
   logo 18px alone still leaves about a 24px overlap at 320px
   with the current CTA size.

2. BLOCKING, all phones, no navigation at all.
   File: `src/components/Header.tsx`. Add one of: (a) a
   hamburger button visible only at 720px and below, toggling a
   dropdown panel with the same 6 links at 44px row height
   (preferred: keeps the header 65px tall and gives full
   navigation); or (b) a cheaper scroll-row: at 720px and below,
   change the hide rule to `.onlines-nav { display: flex;
   flex-wrap: nowrap; overflow-x: auto; }` with the spacer
   still hidden, rendering the 6 links as a horizontally
   scrollable strip under the logo row. Option (b) costs one
   CSS rule but leaves a scrollable strip and keeps the 200px
   spacer problem out of phones only because the spacer stays
   hidden; do not re-enable the spacer on phones, or the
   117-211px overflow from section 2 returns.

3. MINOR, tablets 768-820px, tall wrapped header and small tap
   targets. File: `src/components/Header.tsx`. Change the nav
   style `gap: 24` (line 106) to separate axes,
   `column-gap: 24px; row-gap: 8px`, so the two-line header
   drops from about 107px to about 91px. Separately, give nav
   links vertical padding (for example `padding: 8px 0 11px`
   in the link style, keeping the 3px underline offset) to lift
   tap height from about 21-24px toward 37-40px. Do not shrink
   the nav font or gap to force one line at 768-820px: the
   available widths (347px, 399px) are far below the nav block
   (about 556px), so it would still wrap and only look tighter.

4. BLOCKING, deployment parity (do before any header restyle).
   Verify the deployed awardport.netlify.app build equals the
   current tree (the screenshot nav-visible-on-phone state
   contradicts lines 64-67). Rebuild and redeploy from the
   current commit, then re-screenshot at 390px. If horizontal
   overflow persists after redeploy, the source is another
   section, not this header. Optional safety net only, in
   `src/styles/global.css`: add `html, body { overflow-x: clip;
   }` (clip, not hidden, so it cannot break sticky positioning;
   the fixed CTA is unaffected). Treat it as a net, never as a
   substitute for fixing the overflowing section.

5. NO CHANGE, desktop and tablet CTA placement. The
   `right: max(16px, calc((100vw - 1160px) / 2))` formula
   (line 140) correctly tracks the 1160px container edge, and
   the 200px spacer (line 130) correctly reserves room for the
   about 192px CTA. The CTA overlapping the spacer zone is the
   design working, not a bug, at 768px and above.
