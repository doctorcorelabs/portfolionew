# Synthesis: one nav mode per viewport (nav-symmetry round)

Base HEAD `0384060` (nav-cleanup push). Sources reconciled: `01-cascade.md`
(mechanism + fix), `02-portrait.md` (portrait spec), `03-landscape.md`
(landscape spec), plus `src/components/Header.tsx` read in full. All three
analysts agree on mechanism and post-fix geometry; the only correction is
section 9 (the nav-cleanup record).

## 1. The bug, in one paragraph

On phone portrait the header shows TWO nav modes stacked: the desktop
inline nav, truncated at the right edge ("Experien"), above the hamburger
"Menu" row. Cause, verified in source: inline `display: flex` on the nav (Header.tsx)
beats the `<=720px` rule `.onlines-nav { display: none; }` unconditionally
(inline beats any non-`!important` rule regardless of selector or order). The 6 links (~510px) plus the nowrap logo
(~137px) plus 48px padding plus 24px gap cannot fit a ~390px portrait
phone, and nav-cleanup's `wrap` -> `nowrap` change means the row overflows
instead of wrapping. Ruled out: viewport meta is correct
(`index.html:5`); `Header` is rendered once (`App.tsx:314`).

## 2. Fix mechanism: CONFIRM option (a)

| Option | Verdict | Reasoning |
|---|---|---|
| (a) `!important` on the `<=720px` hide rule | ADOPT | One word, media-scoped, zero effect at `>=721px`; `!important` beats inline regardless of source order, so zero placement risk. Precedent: the safety band already uses `!important` for inline font-size/gap. |
| (b) Stylesheet-base refactor (remove inline `display`, add base `.onlines-nav { display: flex; }`) | REJECT for this round | Placement footgun: base rule must sit BEFORE the `<=720px` block or it re-breaks the hide; removing inline `display` WITHOUT a base flex rule stacks links vertically. Viable later, not minimal. |
| (c) Conditional render via matchMedia at `>=721px` | REJECT | Duplicates the breakpoint in JS, adds a second matchMedia subscription, risks a flash of the wrong nav on mount/resize, and fixes a one-line cascade bug with render logic. |

Sweep result (01): the nav is the ONLY inline-display vs stylesheet-hide
conflict in Header.tsx. The hamburger button and mobile panel obey their
show/hide rules precisely because they carry no inline `display`.

### What the fix does NOT change

Nothing at `>=721px` (rule lives only in the `<=720px` block); hamburger
button, mobile panel, and seam-reset effect untouched (they already
work); no viewport-meta or `App.tsx` change (both hypotheses refuted);
no JSX, inline-style, or other-rule change.

## 3. Governing rule

Exactly one nav mode per viewport at every width: inline OR hamburger,
never both, never neither, never a truncated inline row.

| Width | Mode shown | Fully absent |
|---|---|---|
| `<=720px` | Hamburger button row (+ stacked menu when open) | Inline `.onlines-nav`, all 6 links |
| `>=721px` | Inline single row | Hamburger button + mobile menu (CSS hide `>=721px` + matchMedia seam reset) |

A phone that still shows any inline link next to the logo fails, even if
the hamburger also works.

## 4. Portrait table (from 02)

Heights are border-box rule math (global `box-sizing: border-box`).

| Band | Composition | Header height | Share of viewport height |
|---|---|---|---|
| Phone portrait 320-430px | Logo row + button row; menu stacks below when open, in flow (no overlay, scroll lock, or animation) | Closed ~109px (65 + 44); open ~374px (109 + 265 = 1 border + 6 x 44) | Closed 11.7-19.2%; open 40.1-65.8% |
| Tablet portrait 768px (safety band 721-800) | Inline single row, 14px links `!important`, gap 20 `!important` | ~83px (43 + 40) | 8.1% of 768x1024 |
| Tablet portrait 834px (band 801+) | Inline single row, 15px links, gap 24 | ~84px (44 + 40) | 7.0% of 834x1194 |

Row fit: 768 inner 720 vs row 608-625, slack 95-112; 834 inner 786 vs
row 654-671, slack 115-132. Tap targets ~44px. No-overflow at 320px:
inner 272, logo ~137 (slack ~135), longest label "Certifications"
~153px. No fixed element remains in the header.

## 5. Landscape table (from 03)

Inner width = min(W, 1160) - 48 padding. Row = logo (120-137) + gap 24 +
nav box (464 at 14px/gap 20; 510 at 15px/gap 24).

| Band | Width | Mode | Header | Slack / fit |
|---|---|---|---|---|
| Phone landscape, small | 667-720 | Hamburger | ~109 closed, ~374 open | Logo only; no fit issue |
| Phone landscape, large | 721-932 | Inline single row | ~83 (721-800), ~84 (801-932) | 721: 48-65; 800: 127-144; 844: 125-142; 932: 213-230 |
| Tablet landscape | 1024-1180 | Inline single row | ~84 | 1024: 305-322; 1180: 441-458 (capped) |
| Desktop | 1280+ | Inline single row | ~65 | 441-458 (capped at 1160 container) |

No overflow or truncation at any landscape width. `nowrap` turns extreme
future overflow into padding absorption, never a wrap. Thin zone is
721-730 ONLY: at 10% font widening the row can exceed the content box by
~2px at W=721, absorbed by the 24px right padding (22px from the edge);
visible clipping needs ~15%+ widening. Preview check only.

## 6. What "symmetrical" concretely means

NOT mirrored: logo-left / nav-right and logo-row-over-menu are the
intended Onlines asymmetry and stay. Symmetrical here means balanced,
even, aligned:

- **Balanced insets:** 24px left AND 24px right on every row: logo row
  (container padding 20px 24px), button row (padding 0 24px), menu link
  rows (padding 0 24px). Logo text, "Menu" text, and menu link text all
  start at the same 24px left inset. Above 1160px the 1160 container is
  auto-centered (identical margins left and right: 10px at 1180, 60px at
  1280, 140px at 1440) plus the same 24px padding.
- **Centered vertical rhythm:** every row vertically centers its content
  (logo row, button, menu links in 44px rows; container padding 20px top
  and bottom).
- **Even spacing:** uniform 44px rows (button + each menu link), uniform
  1px `#e0e0e0` hairlines between rows (button top, panel top, link
  separators, header bottom border), even gaps (container gap 24, nav
  gaps 24, or 20 in the safety band; icon bars 2px with 4px gaps).
- **No truncation, no drift:** nothing clips at the right edge, no row
  is wider than the viewport, and the single-row / stacked-menu geometry
  is identical at every width inside its band.

The screenshot fails all four: two modes stack, the inline row
truncates, its inset mismatches the button row, and the extra row breaks
vertical rhythm.

## 7. Proportion verdicts (no adjustment within tidy scope)

| Case | Header / viewport height | Verdict |
|---|---|---|
| Phone portrait closed | 11.7-19.2% | Modest band, no action |
| Phone portrait open | 40.1-65.8% | User-invoked, in flow, dismissed by one tap, Escape, or link tap; never traps scroll, never persists past 720px |
| Phone landscape closed (667x375) | 29% | Heavy but inherent, NO adjustment: 44px button is the touch floor, ~65px logo row is the shared container rhythm; shrinking either breaks tap targets or cross-band symmetry. Mitigation holds: header is not sticky, so the cost lasts only until scroll |
| Phone landscape open (667x375) | ~100% | Transient menu state, not a layout loss: the open menu IS the content while open |
| Phone landscape inline (844x390, 932x430) | 22%, 20% | Heavy but inherent, same reasoning as 29% closed |
| Tablet landscape + desktop | 7-11% | Proportional |

## 8. Seam behavior (all expected, none a defect)

| Seam | Change | Verdict |
|---|---|---|
| 720/721 | Hamburger -> inline single row; exactly one mode each side (post-fix), no both/neither gap; height step 109 -> 83 | Band change, not a defect; check both sides |
| 800/801 | Safety -> standard (14/20 -> 15/24); row +~46px; slack 127-144 -> 82-99, still positive, no wrap; header ~83 -> ~84 | Clean |
| 1160/1161 | Tap block ends; header ~84 -> ~65 (19px step); no horizontal shift (container capped at 1160, inner 1112) | Clean |

## 9. CORRECTION to the nav-cleanup record (read before fixing or QA-ing)

Nav-cleanup's mobile analysis assumed the `<=720px` hide rule applied.
It never did. The inline `display: flex` defect predates nav-cleanup
(present at `d05a71c` and `3ceb140`); nav-cleanup only changed the
symptom, from wrapped rows to one overflowing row (`wrap` -> `nowrap`).

Consequence: every nav-cleanup mobile claim depending on the hide rule
is INVALID, in particular "desktop nav is `display: none` at `<=720px`"
and the 320px no-overflow reasoning built on it. What STANDS: the CTA
pill deletion, single-row `>=721px` behavior, the safety band, the
tap-target block, and the mobile menu improvements, all on unaffected
code paths. This fix is the first time the `<=720px` hide has ever
applied.

## 10. Exact change list for the fixer

One rule change + one comment, in `src/components/Header.tsx`, style
block only. Nothing else.

```css
@media (max-width: 720px) {
  /* !important required because display is set inline below. */
  .onlines-nav { display: none !important; }
}
```

Comment wording follows the safety band's existing style ("`!important`
flags are required because the nav font size and gap are set inline
below"). Do NOT touch: any JSX, any inline style, any other stylesheet
rule, `App.tsx`, `index.html`, `NAV_LINKS`, logo, motif, reduced-motion
rules, hamburger button, mobile panel, seam-reset effect. Do NOT run a
build as part of the fix (QA re-runs it); do NOT push.

## 11. QA checklists

### Portrait (from 02)

Phone portrait, each of 320 / 390 / 430, closed AND open:
1. Only the hamburger mode is visible; zero inline nav links render
   next to the logo (no truncated row).
2. Closed header ~109px; open header ~374px; open menu shows exactly 6
   rows in `NAV_LINKS` order with separators and 44px rows.
3. Left insets align: logo, "Menu", and menu link text all at 24px;
   right edge shows no overflow or clipping.
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

### Landscape (from 03)

1. Phone landscape closed, 667x375 and 720x360: logo row + Menu row
   only; inline nav fully absent; header ~109px; no horizontal overflow
   (`scrollWidth == viewport width`).
2. Phone landscape open, 667x375 and 720x360: stacked 6-link menu,
   header ~374px; close via link, Escape, button; menu scrolls with
   page; no inline nav.
3. Phone landscape inline, 736x414, 844x390, 932x430: single row only,
   no hamburger, no menu; no truncation; header ~83 (736) /
   ~84 (844, 932); tap boxes ~44px.
4. Tablet landscape, 1024x768 and 1180x820: single row, no hamburger;
   header ~84px; tap boxes ~44px; symmetric margins (1180: 10px +
   24px each side).
5. Desktop, 1280x720 and 1440x900: single row, no hamburger;
   header ~65px; symmetric margins (60px / 140px + 24px each side).
6. Seams, checked on both sides: 720<->721 (one mode each side,
   109 -> 83 step expected), 800<->801 (slack stays positive, no
   wrap), 1160<->1161 (84 -> 65 step, no horizontal shift).
7. Proportion recorded per case; phone-landscape closed ~29%
   disclosed as inherent (non-sticky header scrolls away), not a
   defect for this round.
8. No horizontal overflow at any listed width.

### Regression scope (applies to all QA)

- Diff = `Header.tsx` + docs only; source change is exactly section 10's
  one rule + comment.
- No rule/behavior change at `>=721px` (changed rule lives only in the
  `<=720px` block).
- `NAV_LINKS`, logo, motif, reduced-motion kill untouched.
- Build PASS (re-run by QA); em dash 0 in diff.
- Live rendering is not available in the sandbox; all heights above are
  border-box rule math. Preview check owed: thin zone 721-730 plus a
  phone-portrait eyeball of the fixed layout.
