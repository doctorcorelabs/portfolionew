# CTA inventory + header structure map

Base: HEAD `3ceb140`. Scope: every "Start a conversation" surface + the full
header structure. Source of truth: `src/components/Header.tsx` (the only
header/nav file), `src/data/content.ts`, literal greps over `src/`.
Layout-fix proposals are out of scope (other analysts own them).

## 1. CTA inventory: exactly 2 hits in all of src/

| # | Site | File:line | Element | Viewports / routes | Removal recommendation |
|---|---|---|---|---|---|
| 1 | Fixed header CTA button | `src/components/Header.tsx:247-265` | `<a>` mailto pill, text "Start a conversation", class `hdr-cta-pulse` | ALL viewports (no hiding media query; only resized at ≤400px) and ALL routes (`<Header />` sits outside `<Routes>` in `src/App.tsx:314`) | DELETE the whole element. It is the button the user screenshot shows overlapping the nav. |
| 2 | Data field | `src/data/content.ts:155` (`Profile` interface field at :37) | `profile.secondaryCta = "Start a conversation"` | No viewport: never rendered | DELETE the field AND the value. Zero consumers of the field exist in `src/` (grep hits: definition + value only), and the parent `profile` object itself has zero importers (`content.ts` importers only pull `researchItems`, `oldPublications`, `researchFocus`, `methodologies`). Leaving it "unrendered" is meaningless: nothing renders it today. |

Consequences of deleting site 1 (all header-local, no other file references
`hdr-cta` or `onlines-cta` classes):

- Orphaned CSS, delete with the button: `@keyframes hdr-cta-glow` + the
  `.hdr-cta-pulse` rules (glow animation, 14px / 10px 18px), the
  reduced-motion `animation: none` for `.hdr-cta-pulse`, and the ≤400px
  rule shrinking the pill to 12px / 8px 12px.
- The `.onlines-cta-spacer` div (`Header.tsx`, width 200, `flexShrink: 0`,
  `aria-hidden`) exists ONLY to reserve row room for this fixed pill.
  It becomes purposeless once the pill is gone; deleting it is part of
  the CTA removal (the layout fixer owns the resulting nav-row reflow).
  It is already hidden at ≤720px.

## 2. Explicitly NOT "Start a conversation" surfaces (do not touch)

| Surface | File:line | Why it stays |
|---|---|---|
| Contact body copy | `src/sections/Contact.tsx:406` | Prose ("supervision conversations ... are welcome"), not the CTA string, not a button. |
| Contact mailto pill | `src/sections/Contact.tsx:411-415` | Link text is the email address itself, not the CTA string. |
| Footer mailto link | `src/components/Footer.tsx:129` | Link text is the email address itself. |
| Profile mailto link | `src/sections/Profile.tsx:440-444` | Link text is the email address itself. |
| Hero | `src/sections/Hero.tsx:6` | No CTA button by design ("no CTA button, no subline, no image inside"). Nothing to remove. |

Note: the email-address links above are contact methods, not the CTA
button. If the parent wants zero contact entry points, that is a separate
scope decision; the user order as written removes the "Start a
conversation" string/button only.

Adjacent dead data (out of scope, flagged not recommended): `primaryCta`
("See the research", `content.ts:36,154`) has the same zero-consumer
status as `secondaryCta`, but it is not part of this order. Leave it
unless the round decides a dead-data sweep.

## 3. Header structure map (`Header.tsx`, one fragment)

| Element | Hook / class | Layout governing it |
|---|---|---|
| `<style>` block | All header CSS lives here, not in a separate stylesheet | See §4 |
| `<header>` | White bg, 1px `#e0e0e0` bottom border | Inner div: `maxWidth: 1160`, `padding: 20px 24px`, flex, `center`, `space-between`, `gap: 24` |
| Logo | `<Link to="/">`, class `hdr-logo` | Inter 700, 20px (18px at ≤400px), `-0.02em`, `nowrap`, text "DaivanLabs." |
| Primary nav | `<nav aria-label="Primary">`, class `onlines-nav` | Flex, `center`, `columnGap: 24`, `rowGap: 8`, `flexWrap: wrap`, `justifyContent: flex-end` |
| Nav links | Class `hdr-nav-link`, from `NAV_LINKS` (§5) | Inter 15px, `#1d1d1f`, no underline; dotted-underline hover motif (repeating-linear-gradient, 300ms, blue on hover/focus-visible) |
| CTA spacer | Class `onlines-cta-spacer`, `aria-hidden` | `width: 200`, `flexShrink: 0`; hidden at ≤720px |
| Hamburger | `<button class="hdr-menu-btn">`, `aria-expanded` / `aria-controls="hdr-mobile-nav"` | `display: none` by default; shown only at ≤720px as its own full-width row under the logo row (44px min-height, top hairline border, "Menu" + 3-bar icon); toggles `menuOpen` state |
| Mobile nav | `<nav id="hdr-mobile-nav" aria-label="Mobile">`, class `hdr-mobile-nav` | Rendered ONLY when `menuOpen`; links stacked (44px each, 15px, class `hdr-mobile-link`, click closes menu). Contains NAV_LINKS only, NO CTA item. |
| Fixed CTA pill | `<a href="mailto:...">`, class `hdr-cta-pulse` | `position: fixed`, `top: 14`, `right: max(16px, calc((100vw - 1160px) / 2))`, `zIndex: 100`, blue `#0859D4`, white 600 text, 5s glow pulse (`hdr-cta-glow`, disabled under reduced-motion). Sits OUTSIDE `<header>` as a fragment sibling, so it ignores header flow; the spacer is its only row reservation. |

## 4. Breakpoints governing the header

| Breakpoint | Effect |
|---|---|
| Default (desktop) | Logo row + wrapping nav row + 200px spacer + fixed pill on top |
| ≤720px | `.onlines-nav` hidden, spacer hidden; hamburger row + (when open) stacked mobile nav shown |
| ≥721px | Belt-and-braces: hamburger + mobile nav forced `display: none` (an open phone menu vanishes on widen) |
| ≤400px | Logo 18px, CTA pill 12px / 8px 12px (comment: pill then clears the wordmark tail, ~9px gap at 320px) |
| 721-1023px (tablet) | Nav links get taller tap targets (`padding: 8px 0 11px`, underline shifted 8px) |
| `prefers-reduced-motion` | Nav-link transitions off, CTA pulse off |

## 5. NAV_LINKS (exact order, `Header.tsx`)

| # | Label | Href |
|---|---|---|
| 1 | Research | `/research` |
| 2 | Awards | `/awards` |
| 3 | Experience | `/experience` |
| 4 | Education | `/education` |
| 5 | Certifications | `/certifications` |
| 6 | Contact | `/#contact` |

Same list feeds both the desktop nav and the mobile menu (single source).

## 6. Why the screenshot breaks (structure, not a fix proposal)

The nav wraps (`flexWrap: wrap`) and the fixed pill sits outside header
flow at `zIndex: 100`. The six links plus gaps need roughly 590px of row
room; the row room is container width minus padding (48px), logo
(~140px), flex gaps (48px), and the 200px spacer, so wrapping starts
roughly below ~1030px viewport width (estimate from 15px label widths).
In that band the nav falls to two rows while the fixed pill (top 14)
still covers the header's top-right, cutting off the first wrapped row's
first link ("Research"). The screenshot shows logo + wrapped links, not
the hamburger, so it sits in that ~721-1030px band, not on a phone.
At ≤720px the nav is replaced by the hamburger menu, but the fixed pill
still floats at top-right over the logo row.
