# QA landscape (nav-symmetry round)

Verdict: **SHIP, no blockers.**

Read-only throughout: no source edited, no build run, no push. Base HEAD
`0384060` verified; `00-synthesis.md`, `03-landscape.md`, and
`04-fix.md` read first, then `src/components/Header.tsx` read in full.
Diff scope confirmed: only `M src/components/Header.tsx` (2 insertions,
1 deletion) plus untracked `docs/nav-symmetry/`; em dash in diff: 0.
Heights are border-box rule math (confirmed `src/styles.css:2`,
`src/styles/global.css:17`); the sandbox cannot render, so live-preview
checks remain owed (listed at the end).

## Fix verified in code

The `<=720px` block now carries `.onlines-nav { display: none
!important; }` with the comment "`!important` required because display
is set inline below." The nav's inline `display: flex` is unchanged, so
at `<=720px` the `!important` hide finally beats it, and at `>=721px`
the rule does not apply and the inline row renders exactly as before.
No other rule, JSX element, or inline style changed. The hamburger
button carries no inline `display` (base `none`, `flex` at `<=720px`,
`none` at `>=721px`), and the mobile panel is conditionally rendered
plus stylesheet `block` at `<=720px` / `none` at `>=721px`, so both
obeyed their rules already and are untouched. Governing rule holds by
cascade at every width: exactly one nav mode, never both, never
neither, never a truncated inline row.

## 1. Phone landscape closed: 667x375, 720x360: PASS

At both widths the inline nav is fully absent (`!important` hide
applies at `<=720px`), so the header is logo row + Menu row only:
logo ~137px in a 619px (667) / 672px (720) inner width, button row
full-width at `padding: 0 24px`, no fixed element, no element wider
than the viewport. Header ~109px (logo row ~65 + button 44). No
header-level horizontal overflow at either width. The screenshot's
truncated inline row cannot recur: the row that overflowed is gone,
not re-wrapped.

## 2. Phone landscape open: 667x375, 720x360: PASS

Menu opens as a normal-flow stacked panel below the button row (6
links in `NAV_LINKS` order, 44px rows, 1px separators, panel border
included in the 44px rows under border-box): header ~374px
(109 + 265). Closes via link tap (`onClick` sets `menuOpen` false),
Escape (keydown listener only when open, with cleanup), and button
toggle. No overlay, no scroll lock, no animation, so the menu scrolls
with the page. No inline nav is visible while open, closed, or
mid-toggle, since the hide is cascade-level, not state-dependent.

## 3. Phone landscape inline: 736x414, 844x390, 932x430: PASS

Single row only at all three widths; no hamburger button, no menu
panel (CSS hide at `>=721px` plus the matchMedia seam reset clearing
`menuOpen`). No truncation: row 608-625 vs inner 688 at 736 (slack
63-80); row 654-671 vs inner 796 at 844 (slack 125-142) and inner 884
at 932 (slack 213-230). Headers: ~83px at 736 (safety band 14px/gap
20), ~84px at 844 and 932 (15px/gap 24). Tap boxes ~44px
(`padding: 12px 0 13px`, realized ~41-45px by fallback line-height),
with the dotted underline 3px below text.

## 4. Tablet landscape: 1024x768, 1180x820: PASS

Single row only; no hamburger, no menu. Header ~84px at both widths.
Row 654-671 vs inner 976 at 1024 (slack 305-322) and inner 1112 capped
at 1180 (slack 441-458). Tap boxes ~44px. Symmetric margins: at 1180
the 1160 container is auto-centered (10px margin each side) plus
24px padding, identical left and right; at 1024 the container spans
full width with 24px padding both sides.

## 5. Desktop: 1280x720, 1440x900: PASS

Single row only; no hamburger, no menu. Header ~65px at both widths
(logo box ~25 drives over the ~22px link box; 25 + 40 padding).
Row 654-671 vs inner 1112 capped (slack 441-458). Symmetric margins:
60px each side at 1280, 140px each side at 1440, plus 24px padding,
identical left and right. Vertical centering holds (`align-items:
center` on the container row).

## 6. Seams, both sides: PASS

- **720/721:** at 720, hamburger mode (nav hidden by `!important`,
  button `flex`); at 721, inline single row (hide rule no longer
  applies, button/panel hidden by the `>=721px` rules, seam reset
  clears any open menu). Exactly one mode each side, no both/neither
  gap. Height step 109 -> 83 is the band change, not a defect.
- **800/801:** inline both sides; safety band (14px/gap 20) -> standard
  (15px/gap 24). Row grows ~46px (608-625 -> 654-671) while inner grows
  1px (752 -> 753); slack falls 127-144 -> 82-99, still positive, no
  wrap. Header ~83 -> ~84.
- **1160/1161:** inline both sides; tap block ends, header ~84 -> ~65
  (19px step). No horizontal shift: the container is already capped
  at 1160 on both sides, inner stays 1112, so the row does not move.

## 7. Proportions per case (disclosure, not defects)

| Case | Header / viewport height | Verdict |
|---|---|---|
| 667x375 closed | 109 / 375 = 29% | Heavy but inherent: 44px button is the touch floor, ~65px logo row is the shared container rhythm; header is not sticky, so the cost lasts only until scroll |
| 720x360 closed | 109 / 360 = 30% | Same inherent reasoning as 29%; the 1-point rise is the shorter viewport, not a layout change |
| 667x375 / 720x360 open | 374 / 375 = ~100% | Transient menu state, not a layout loss: the open menu IS the content while open |
| 736x414 inline | 83 / 414 = 20% | Heavy but inherent, same reasoning |
| 844x390 inline | 84 / 390 = 22% | Heavy but inherent, same reasoning |
| 932x430 inline | 84 / 430 = 20% | Heavy but inherent, same reasoning |
| 1024x768 / 1180x820 | 84 / 768 = 11%, 84 / 820 = 10% | Proportional |
| 1280x720 / 1440x900 | 65 / 720 = 9%, 65 / 900 = 7% | Proportional |

No header shrinking is warranted within tidy scope: shrinking the
button row breaks the 44px touch floor, and shrinking the logo row
breaks cross-band symmetry.

## 8. Horizontal overflow: PASS (header scope)

No header element overflows at any listed width: slack is positive at
every inline width, the hamburger rows are full-width with 24px
padding, and the longest menu label (~105px + 48px padding) fits the
narrowest landscape width with room. Caveat, stated honestly: this
verifies the header's geometry only. Page-level `scrollWidth` also
depends on hero and section content, which this QA did not re-audit;
confirming zero page-level horizontal scroll is a live-preview check.

## Live-preview checks owed (sandbox cannot render)

Phone-landscape eyeball at 667x375 closed (hamburger only, no inline
row) and open (stacked menu, close paths); inline single row at
736/844/932; seam 720/721 on both sides; thin zone 721-730;
page-level horizontal scroll at 667 and 720 landscape widths.

Out of scope for this QA (other agents own it): portrait behavior,
build re-run, full diff scope beyond the stat above, and any live
render.
