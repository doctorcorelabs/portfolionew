# Portrait audit: header composition after the fix

Base: HEAD `0384060` (nav-cleanup push). Source: `src/components/Header.tsx`
only (style block + JSX + inline styles). Global `box-sizing: border-box`
(`src/styles.css:2`, `src/styles/global.css:17`), so every `min-height`
below already includes its borders.

## The bug being fixed (context, not this doc's scope)

On phone portrait the screenshot shows TWO nav modes stacked: the desktop
inline nav (truncated at the right edge) above the hamburger "Menu" row.
Cause per the verified lead: the inline nav carries inline
`display: flex`, which beats the `<=720px` stylesheet rule
`.onlines-nav { display: none; }`, so the hide never applies. This doc
assumes the fix makes exactly one nav mode appear per viewport (the fix
mechanism belongs to another analyst) and specifies what portrait must
look like once it does.

## Rule: exactly one nav mode per viewport

| Band | Shows | Fully absent |
|---|---|---|
| Phone portrait 320-430px (<=720px) | Hamburger button row + stacked menu when open | Inline `.onlines-nav` (all 6 links, no truncated row) |
| Tablet portrait 768-834px (>=721px) | Inline single row | Hamburger button + mobile menu (CSS hide `>=721px` + matchMedia seam reset) |

No viewport may show both modes, and no viewport may show a truncated
inline row. A phone that still shows any inline link next to the logo
fails, even if the hamburger also works.

## Phone portrait (320-430px): hamburger composition

Closed header = logo row + button row, nothing else. Open header adds
the stacked menu below the button row, in flow (pushes content down, no
overlay, no scroll lock, no animation).

| Element | Value (code) |
|---|---|
| Logo row | Container `padding: 20px 24px`, flex, `center`, `space-between`, `gap: 24`; logo 20px, 700, `-0.02em`, nowrap, "DaivanLabs." ~137px |
| Button row | Full width, `min-height: 44px`, `padding: 0 24px`, `border-top: 1px #e0e0e0`, 15px/600, left-aligned; icon 3 bars 18px wide, 2px tall, 4px gaps |
| Menu panel (open) | `border-top: 1px #e0e0e0`; 6 links stacked, same `NAV_LINKS` order (Research, Awards, Experience, Education, Certifications, Contact) |
| Menu link row | `min-height: 44px`, `padding: 0 24px`, 15px, vertically centered; separator `border-top: 1px #e0e0e0` between links (first link carries the panel border) |
| Menu behavior (already shipped, re-verify) | Label swaps Menu/Close, click closes, Escape closes, widening past 720px clears `menuOpen` (no stale reopen on narrowing back) |

Heights (border-box, exact): logo row ~65px (20 + ~25 logo box + 20);
closed header ~109px (65 + 44); open header ~374px (109 + 265, where
menu = 1 panel border + 6 x 44 rows, separator borders inside the 44).

Proportion to viewport height (tall portrait viewports):

| Viewport | Closed 109px | Open 374px |
|---|---|---|
| 320x568 | 19.2% | 65.8% |
| 390x844 | 12.9% | 44.3% |
| 430x932 | 11.7% | 40.1% |

The closed header is a modest band on every phone. The open menu is
supposed to dominate short viewports (65.8% at 320x568): it is
user-invoked, in flow, and dismissed by one tap, Escape, or a link tap.
It must never trap scroll or persist after the user widens past 720px.

No-overflow at 320px: inner width 272px. Logo ~137px fits with ~135px
slack. Longest menu label "Certifications" ~105px + 48px padding = ~153px,
well inside 320px. No fixed element remains in the header (the CTA pill
was deleted in nav-cleanup), desktop nav is absent at <=720px, and the
menu stacks vertically, so nothing can truncate at the right edge.

## Tablet portrait (768-834px): inline single row

No hamburger, no menu. The inline nav is the only mode, one row, logo
left, links right.

| Width | Nav | Row math | Header height | Share of viewport height |
|---|---|---|---|---|
| 768 (safety band 721-800) | 14px links `!important`, gap 20 `!important` | Row 608-625px vs inner 720px (768 - 48 padding), slack 95-112px | ~83px (nav box ~43 + 40 padding) | 8.1% of 768x1024 |
| 834 (band 801+) | 15px links, gap 24 | Row 654-671px vs inner 786px (834 - 48), slack 115-132px | ~84px (nav box ~44 + 40 padding) | 7.0% of 834x1194 |

Tap targets at tablet portrait are ~44px (padding 12px 0 13px), fixing
the old ~38px / ~22px bands. The dotted-underline motif, reduced-motion
link kill, and 1px bottom border carry over unchanged.

## What "symmetrical" concretely means here

NOT a mirrored layout. Logo-left / nav-right (tablet) and logo-row-over-
menu (phone) are the intended Onlines-style asymmetry and stay.
Symmetrical here means balanced, even, and aligned:

- **Balanced insets:** 24px left AND 24px right on every row: logo row
  (container padding), button row (padding 0 24px), menu link rows
  (padding 0 24px). Logo text, "Menu" text, and menu link text all start
  at the same 24px left inset; no row is inset differently from the
  others.
- **Centered vertical rhythm:** every row vertically centers its
  content (logo row `align-items: center`, button `center`, menu links
  `center` in 44px rows). No row's text sits high or low relative to
  its row.
- **Even spacing:** uniform 44px rows (button + each menu link),
  uniform 1px `#e0e0e0` hairlines between rows (button top, panel top,
  link separators, header bottom border), even gaps (container gap 24,
  nav gaps 24, or 20 in the safety band; icon bars 2px with 4px gaps).
- **No truncation, no drift:** nothing clips at the right edge, no row
  is wider than the viewport, and the single-row / stacked-menu geometry
  is identical at every width inside its band (no width where a row
  suddenly shifts).

The screenshot fails all four: two modes stack, the inline row truncates
at the right edge, its inset does not match the button row's, and the
vertical rhythm is broken by the extra row.

## Portrait QA checklist (exact checks, expected results)

Phone portrait, each of 320 / 390 / 430, closed AND open:
1. Only the hamburger mode is visible; zero inline nav links render
   next to the logo (grep-equivalent visual check: no truncated row).
2. Closed header ~109px; open header ~374px; open menu shows exactly 6
   rows in `NAV_LINKS` order with separators and 44px rows.
3. Left insets align: logo text, "Menu" text, and menu link text all at
   24px from the left edge; right edge shows no overflow or clipping.
4. Menu/Close label swaps; link tap closes; Escape closes; widen past
   720px then narrow back leaves the menu closed.
5. No horizontal scroll at 320px, closed or open.

Tablet portrait, each of 768 / 834:
6. Only the inline single row is visible; no hamburger button, no menu
   panel, even with a menu previously opened on a narrower width.
7. Single row, no wrap, no truncation: 768 header ~83px, 834 header
   ~84px; nav links 14px/gap 20 at 768, 15px/gap 24 at 834.
8. Tap targets ~44px; logo 20px; 24px insets both sides; vertical
   centering holds in the logo row and the nav row.

Out of scope for this doc: landscape (another analyst), the fix
mechanism (another analyst), live rendering (sandbox cannot render;
all heights above are rule math from border-box code values).
