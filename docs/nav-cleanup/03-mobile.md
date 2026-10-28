# 03 - Mobile + tablet menu diagnosis (nav-cleanup round)

Base HEAD verified `3ceb140`. Single nav file: `src/components/Header.tsx`
(all header CSS lives in its `<style>` block + inline styles; no header
rules in `src/styles/` or `src/styles.css`). Header is used once
(`src/App.tsx:314`), in normal flow (not sticky). Scope: mobile
(<=720px) + tablet menu (720-1160px). Desktop inline layout:
another analyst. CTA element: CTA analyst.

## 1. Mobile header today (<=720px)

| Item | As shipped |
|---|---|
| Hamburger | EXISTS. `.hdr-menu-btn`, full-width row under the logo row, border-top hairline, min-height 44px, padding 0 24px, 15px/600 "Menu" + 3 bars (18x2, gap 4). `aria-expanded` + `aria-controls="hdr-mobile-nav"`, toggles `menuOpen` state |
| Menu panel | `.hdr-mobile-nav`, rendered ONLY when `menuOpen` (unmounted when closed), `aria-label="Mobile"`. In-flow below the button: pushes content down, no overlay, no scroll lock, no animation (instant) |
| Menu links | Same 6 `NAV_LINKS` (Research, Awards, Experience, Education, Certifications, Contact `/#contact`). Stacked vertical full-width rows, `.hdr-mobile-link`: flex, min-height 44px, padding 0 24px, 15px, no underline. 6 x 44px = 264px + 1px border when open |
| Close behavior | Closes on link click and button toggle. NO Escape handler, NO outside-click close, NO focus move on open |
| Tap targets | Button 44px PASS, link rows 44px PASS. Logo tap box ~25px: below 44px but above the 24px WCAG minimum, accepted (padding it would grow header height) |
| Focus styles | Button: `focus-visible` outline (2px blue, offset -2px). Mobile links: NONE (dotted-underline motif targets `.onlines-nav a.hdr-nav-link` only), so only the browser default outline |
| Separators | NONE between menu links (only one border-top on the panel). Rows are distinguishable by 44px height alone |
| 720 seam | Belt-and-braces CSS hides button + mobile nav at >=721px, so an open menu vanishes on widening. BUT `menuOpen` persists: narrowing back restores the menu OPEN (stale state quirk) |

## 2. Where "Start a conversation" appears on mobile

| Site | Present on mobile? |
|---|---|
| Fixed pill (`Header.tsx:262`, `mailto:` link, `hdr-cta-pulse`) | YES, every width. `position: fixed, top 14, right 16px` at viewport <1160, z-index 100, ~39px tall. NOT in the menu, NOT hidden on mobile: floats over scrolled content |
| Inside the opened mobile menu | NO. Menu contains only the 6 `NAV_LINKS`, no CTA entry |
| `content.ts:155` `secondaryCta` | Dead data: zero consumers in `src/` (grep). Flag for the CTA analyst; not removed here |

Mobile pill clearance is tight but positive: at 320px logo ends ~137px, pill starts ~146px (code comment), gap ~9px. It never overlaps a visible mobile element; its mobile cost is the always-on-screen float.

## 3. Tablet menu mode (721-1160px): INLINE, not hamburger

There is NO distinct tablet menu mode. Tablets use the same inline
`.onlines-nav` as desktop; the hamburger exists only at <=720px.

| Item | As shipped |
|---|---|
| Layout | Inline nav, `flexWrap: wrap`, `columnGap 24, rowGap 8, justify flex-end`. Wraps to 2 rows below ~1060px viewport (logo ~137 + links ~526 + gaps 120 + container padding 48 + 200px spacer) |
| Screenshot bug mechanism | Fixed pill spans y 14-53, first nav row spans y ~20-44: the pill sits IN the first-row band. Clearance depends on pill width vs the 200px spacer; at the screenshot's width/rendering it went negative and the pill covers the first row's right link (visible "R"). Pill deletion removes this failure class |
| Spacer | `.onlines-cta-spacer`, 200px + `flexShrink: 0`, hidden only at <=720px. Its SOLE purpose is CTA clearance (keep links out from under the fixed pill). After pill removal it is dead weight that forces early wrapping |
| Tap heights | 721-1023: ~38px (padding 8px 0 11px + ~19px line) - BELOW 44px. 1024-1160: ~22px (padding-bottom 3px only, no vertical padding) - well below 44px |

## 4. Tidied spec (fixer implements)

### Mobile (<=720px), after CTA removal

| Change | Value |
|---|---|
| Delete pill + pulse | Remove the fixed `<a>` element, `.hdr-cta-pulse` rules, and `hdr-cta-glow` keyframes. The <=400px CTA shrink rule dies with it; logo returns to 20px at all mobile widths (320px container 272px fits the ~137px wordmark with room) |
| Keep | Hamburger button + stacked in-flow menu (no redesign to visible links: 6 links cannot fit one phone row). Button/links 44px, padding 0 24px, font 15px, unchanged |
| Separators | 1px `#e0e0e0` border-top on each `.hdr-mobile-link` except the first (panel already has border-top) |
| Link focus/hover | `focus-visible`: 2px `#0859D4` outline, offset -2px (matches button). Hover: color `#0859D4` (matches desktop motif) |
| Button label | Swap text Menu/Close on toggle (`aria-expanded` stays). Sighted users currently get no open-state cue |
| Close behavior | Keep close-on-link-click + button toggle. ADD Escape closes the menu when open (keydown listener, only when open). No scroll lock (in-flow menu needs none). No open/close animation (instant = reduced-motion safe by construction) |
| Seam fix | Keep belt-and-braces CSS hide at >=721px. ADD state reset: a `matchMedia` effect sets `menuOpen` false when the viewport crosses above 720px, so re-narrowing never restores a stale open menu |
| After removal | Mobile header = logo row + hamburger row + optional menu. Nothing fixed, nothing overlapping, nothing floating over scrolled content |

### Tablet (721-1160px), after CTA removal

| Change | Value |
|---|---|
| Mode | Stays INLINE (no hamburger). Do not invent a tablet hamburger; the tidy is removal + tap targets, not a redesign |
| Delete spacer | Remove `.onlines-cta-spacer` element AND its <=720px hide rule (dead with the element). Single-row threshold moves from ~1060px down to ~850px viewport (137 + 526 + 120 + 48 = 831, rounded up for font-rendering margin) |
| Wrap below ~850 | ACCEPTED 2-row wrap (rowGap 8, no clipping, no overlap once the pill is gone). One row at 721px is impossible without a hamburger (needs ~831px), so do not chase it with smaller fonts |
| Tap targets | Extend the padded rule from 721-1023 to 721-1160 AND raise it: padding `12px 0 13px` (12 + ~19 line + 13 = ~44px). Underline position becomes `0 calc(100% - 10px)` to keep the 3px gap below text (text bottom at 100%-13px, underline top at 100%-10px). This fixes both the ~38px band and the ~22px band (1024-1160) |
| Screenshot bug | Fixed by pill deletion (overlap class gone) + spacer deletion (no early wrap). No other tablet nav geometry change is needed for it |

## 5. Out of scope / cross-checks

- Desktop inline geometry (base `padding-bottom 3px`, underline at `100%`): other analyst's; this spec only extends the tablet override to 1160px.
- CTA element, `mailto:` target, and `content.ts` `secondaryCta` (dead data) belong to the CTA analyst; this doc only verifies the mobile sites.
- Reduced-motion: menu has no animation, so nothing changes there; the pill's `animation: none` rule dies with the pill. The nav-link `transition: none` rule stays for desktop/tablet links.
- No horizontal-overflow risk on mobile: logo nowrap ~137px, longest menu label ~105px, all fit 320px with 24px side padding.
