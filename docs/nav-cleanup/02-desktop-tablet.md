# Desktop + tablet nav layout diagnosis

Base HEAD verified `3ceb140`. Scope: desktop + tablet only (mobile hamburger/menu owned by another analyst; CTA inventory owned by another analyst). All header CSS lives in `src/components/Header.tsx` (`<style>` block + inline styles); grep finds NO header rules in `src/styles/` and NO Inter webfont load (stack falls back to system fonts), so widths below are estimates with a fallback margin, not DOM measurements.

## 1. How the header is built

| Piece | Mechanism |
|---|---|
| Row | `maxWidth: 1160`, `margin: 0 auto`, `padding: 20px 24px`, flex, `space-between`, `alignItems: center`, `gap: 24` |
| Logo | `DaivanLabs.`, 20px Inter 700, tracking -0.02em, `nowrap`, ~120px wide |
| Nav `.onlines-nav` | Flex, `columnGap: 24`, `rowGap: 8`, **`flexWrap: wrap`**, `justifyContent: flex-end`; 6 links at 15px: Research, Awards, Experience, Education, Certifications, Contact |
| Spacer `.onlines-cta-spacer` | `width: 200`, `flexShrink: 0`, empty, aria-hidden; exists ONLY to reserve space for the CTA |
| CTA | **Not in the row.** `position: fixed`, `top: 14`, `right: max(16px, calc((100vw - 1160px) / 2))`, `zIndex: 100`, opaque blue, 14px semibold, padding 10px 18px, ~176-186px wide, ~37-39px tall |

Link text widths at 15px (estimated): Research ~62, Awards ~48, Experience ~75, Education ~65, Certifications ~88, Contact ~52; text sum ~390px; plus 5 x 24px gaps = 120px; **one-row nav ~510px**.

## 2. Why it wraps

The row needs logo 120 + gap 24 + nav 510 + gap 24 + spacer 200 = **878px** of inner width. Inner width = W - 48 (W <= 1208). One-row fit needs **W >= 926**. Below that, the nav is the only shrinkable item (logo is nowrap min-content ~120px; spacer has `flexShrink: 0`; nav min-content is just the longest link, ~88px, because wrap is allowed), so it shrinks and wraps:

| Viewport W | Nav width available | Rows |
|---|---|---|
| >= 926 | >= 510 | 1 row, all 6 links |
| ~900 | ~484 | 5 + 1 (Contact drops to row 2) |
| ~800 | ~384 | 4 + 2 (Certifications, Contact on row 2) |
| 721-730 | ~305-314 | 3 + 3 (Education, Certifications, Contact on row 2) |

So every tablet width 721-925 wraps to 2 rows, and header height jumps with it. The wrap is not a bug in one breakpoint; it is the designed outcome of `flexWrap: wrap` + a fixed 200px spacer eating 200px of a narrowing row.

## 3. Why the CTA covers links

**"Research" is NOT clipped by overflow.** No overflow rule touches the header. It is **painted over**: the CTA is opaque blue at `zIndex: 100`, fixed at `top: 14`, spanning y ~14-53, exactly the header's first-row band (row content starts at padding-top 20). The visible "R" is the part of the link left of the CTA's left edge; the rest sits under the button.

In-flow, the CTA never touches the nav, but only by a thin clearance that exists solely because the spacer stays in flow at exactly 200px:

| Viewport | CTA left edge | Nav right edge | Clearance |
|---|---|---|---|
| W < 1192 (right: 16px) | ~W - 192 to W - 202 | W - 248 (spacer left minus 24px gap) | ~46-56px |
| W >= 1192 (right: (W-1160)/2) | container right - 186 | container right - 248 | ~62px |

Lose the spacer reservation (older build, missing spacer, wider fallback font, wider CTA) and the first-row links slide under the opaque button. The photographed pattern (3 rows + covered first row) implies a nav box of ~165-200px, which current code only produces below W = 721 (nav avail = W - 416), where `.onlines-nav` is `display: none`. So the photo is either a build predating the spacer/menu-hide rules or a transitional/zoomed state. Either way, current code reproduces the wrap at 721-925 and the cover whenever the spacer reservation is lost; deleting CTA + spacer + wrap removes the whole failure class, not just the photographed instance.

## 4. Breakpoints affecting the header

| Breakpoint | Effect on header |
|---|---|
| max-width 400px | Logo 18px, CTA 12px/8px 12px (narrow phones; out of desktop scope, dies with CTA) |
| max-width 720px | `.onlines-nav` hidden, spacer hidden, hamburger row shown (mobile analyst owns) |
| min-width 721px | Hamburger + mobile nav forced hidden; desktop nav returns |
| 721-1023px | Link tap padding 8px 0 11px (~37-40px targets); vertical only, no width effect; retained |
| 1160 (container maxWidth, not a media query) | Row stops growing above viewport 1208; header identical at 1161-1400 and 1400+ |
| 1192 (CTA right-formula pivot) | CTA right switches from 16px to (W-1160)/2; dies with CTA |
| 1400 | **No header rule.** Hero breakpoint only; header is unchanged across 1400/1401 |

## 5. Tidied desktop + tablet spec (after CTA removal)

Delete: CTA anchor, `.hdr-cta-pulse` CSS + glow keyframes, spacer div (it exists only for the CTA; the CTA element itself is inventoried by the CTA analyst). Then:

| Band | Nav | Row | Fit check (inner = W - 48) |
|---|---|---|---|
| 721-800 (safety band) | 14px links, `columnGap: 20`, `flexWrap: nowrap` | Keep maxWidth 1160, padding 20px 24px, `space-between`, `gap: 24` | Row = 120 + 24 + ~464 = ~608; slack at W = 721 is ~65px, absorbs system-font fallback widening |
| 801+ (tablet large, desktop, wide) | 15px links, `columnGap: 24`, `flexWrap: nowrap` | Same | Row = 120 + 24 + 510 = 654; slack at W = 801 is ~99px, at 1160 inner 1112 is ~458px |

Layout rules: single row everywhere >= 721, logo left, links right, vertically centered. With 2 items, `space-between` gives exactly that; no new alignment code needed. Header height becomes stable within each band (~80px at 721-1023 with tap padding, ~65px at 1024+), with no wrap-induced jumps. Retain: dotted-underline hover, reduced-motion transition kill, 721-1023 tap padding, border-bottom, logo styles, header in normal flow.

Seam notes for the fixer: at 720/721 the nav returns as a single row (mobile rules unchanged); the `max-width: 720px` spacer-hide rule becomes dead after spacer deletion and may be removed as cleanup; the `rowGap: 8` on the nav becomes moot under `nowrap` and may be dropped. Do not add a second nav row, a scrollable nav, or a smaller logo: the 721-800 safety band already fits with margin.
