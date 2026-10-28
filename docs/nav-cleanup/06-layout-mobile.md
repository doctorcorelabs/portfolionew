# QA layout mobile: nav cleanup

Scope: widths <= 720px only, against `00-synthesis.md` and `04-fix.md`.
Base HEAD `3ceb140` verified; `git status` shows only `M
src/components/Header.tsx` + `M src/data/content.ts` (+ untracked
`docs/nav-cleanup/`). All header styling lives in `Header.tsx`
itself. Verdict: **SHIP, no blockers.**

## 1. CTA removal on mobile: PASS

| Check | Evidence |
|---|---|
| "Start a conversation" in `src/` | grep 0 hits |
| `hdr-cta-pulse`, `hdr-cta-glow`, `onlines-cta-spacer`, `secondaryCta` | grep 0 hits in `Header.tsx` + `content.ts` |
| Fixed pill at mobile widths | Element deleted; no `position: fixed` remains in the header. The always-on-screen float over scrolled phone content is gone at every width, not just hidden |
| `<= 400px` block | Deleted whole; grep `400px` 0 hits in `Header.tsx` |
| Logo size | `.hdr-logo` is 20px, the only logo size rule; grep `font-size: 18px` 0 hits. Logo returns to 20px at all mobile widths |
| `primaryCta` regression check | Still present (field `:36`, value `:153`, "See the research") - no over-deletion |

## 2. Hamburger + stacked menu kept: PASS

- Button row: `.hdr-menu-btn` is `display: none` by default and
  `display: flex` at <= 720px, `min-height: 44px`, `padding: 0 24px`,
  `width: 100%`, sitting inside `<header>` after the logo-row div,
  so it is its own row under the logo row. Label + 3-bar icon
  (3 spans, 18x2) unchanged.
- Panel: `{menuOpen && <nav id="hdr-mobile-nav">}` renders only
  when open and unmounts when closed. It is a normal-flow sibling
  after the button: pushes content down, no overlay (no absolute
  or fixed positioning), no scroll lock (no overflow manipulation
  anywhere in the file), no open/close animation (no transition
  or animation on the panel, links, or button).
- Links: the same 6 `NAV_LINKS` as desktop (Research, Awards,
  Experience, Education, Certifications, Contact), stacked
  vertical full-width rows. No forked link list.

## 3. Menu improvements, each verified in code: PASS

| Improvement (spec 1(4)) | Code evidence |
|---|---|
| Separators, 1px `#e0e0e0`, each link except the first | `.hdr-mobile-link + .hdr-mobile-link { border-top: 1px solid #e0e0e0; }`; panel's own border-top stays |
| Focus-visible 2px `#0859D4`, offset -2px, on mobile links | `.hdr-mobile-link:focus-visible { outline: 2px solid #0859D4; outline-offset: -2px; }`, matching the button rule |
| Hover color `#0859D4` | `.hdr-mobile-link:hover { color: #0859D4; }` |
| Menu/Close label swap | `{menuOpen ? "Close" : "Menu"}`; `aria-expanded={menuOpen}` stays; 3-bar icon unchanged |
| Escape closes when open, cleanup on close/unmount | `useEffect` on `[menuOpen]`, early return when closed, `window` keydown listener only when open, `removeEventListener` cleanup |
| Close-on-link-click kept | `onClick={() => setMenuOpen(false)}` on every mobile link |
| Button toggle kept | `onClick={() => setMenuOpen((open) => !open)}` |

Spec-trimmed items correctly ABSENT (verified by grep: only two
listeners in the file, keydown + matchMedia, zero `.focus()`
calls): no focus move on open, no outside-click close.

## 4. Seam reset: PASS

- `matchMedia` effect: queries `(min-width: 721px)`, runs
  `onChange()` on mount, listens for `change`, clears `menuOpen`
  whenever the query matches, removes the listener on unmount.
- Sequence verified by logic: open at <= 720, widen past 720
  (change fires, matches true, `setMenuOpen(false)`), narrow
  back (matches false, no-op) yields a CLOSED menu. No stale
  reopen.
- CSS hide at >= 721px intact: `@media (min-width: 721px)` sets
  both `.hdr-menu-btn` and `.hdr-mobile-nav` to `display: none`.

## 5. Tap targets: PASS

| Element | Size | Verdict |
|---|---|---|
| Hamburger button | `min-height: 44px`, full width | PASS |
| Mobile links | `min-height: 44px`, full width rows | PASS |
| Logo tap box | ~137px wide x ~24-25px tall (20px font, default line-height) | ACCEPTED per spec: above the 24px WCAG minimum, no change |

## 6. Header heights: PASS (exact under border-box)

Global `box-sizing: border-box` (`styles.css:2`,
`styles/global.css:17`) means `min-height: 44px` already includes
each element's border, so the spec table reproduces exactly:

| State | Math | Total |
|---|---|---|
| Closed | logo row ~65 (40 padding + ~25 logo) + button 44 (border included) | ~109px |
| Open | closed 109 + menu 265 (panel border 1 + 6 x 44 links, separator borders included in their 44) | ~374px |

## 7. Reduced motion on mobile: PASS

- Nav-link `transition: none` under `prefers-reduced-motion`
  intact.
- Pulse `animation: none` rule deleted WITH the pulse (grep 0
  for both `hdr-cta-pulse` and `hdr-cta-glow`): no orphan rule.
- Menu is instant (no animation), so it is reduced-motion safe
  by construction; no separate reduced-motion menu rule is
  needed.

## 8. 320px no-overflow: PASS

Inner width 272px (320 - 48 padding). Logo ~137px fits with
~135px slack. Longest menu label "Certifications" ~105px at
15px + 48 padding = ~153px, well inside 320px. No fixed element
remains in the header, the desktop nav is `display: none` at
<= 720px, the mobile menu stacks vertically, and the logo
(~137px, nowrap) cannot overflow the 272px inner width.

## Notes (not blockers)

- The fixer deleted the `EMAIL` const (used only by the deleted
  CTA anchor); it is outside mobile scope and required by
  `noUnusedLocals`, with the address still present in
  `content.ts` and in Contact/Footer/Profile.
- Live-preview checks owed (sandbox cannot render): menu
  open/close/Escape/seam-reset by hand, 320px no-overflow by
  eye, header heights closed/open.

## Out of scope for this QA (other agents own it)

Desktop/tablet single-row behavior, tablet tap targets, diff
scope beyond the two files above, build result (fixer reports
PASS, 7.54s), and any live render.
