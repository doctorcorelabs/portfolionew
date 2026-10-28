# QA portrait: nav-symmetry round

**Verdict: SHIP, no blockers.**

Base HEAD `0384060` verified; `git status` shows only `M src/components/Header.tsx` plus untracked `docs/nav-symmetry/`; diff is exactly 2 insertions / 1 deletion (comment + rule). Read-only throughout: no source edited, no build run, no push. Method: full code read plus border-box rule math; the sandbox cannot render, so all heights below are computed, not measured.

## 1. The fix actually fixes the cascade (PASS)

- Changed rule, inside `@media (max-width: 720px)` only: `.onlines-nav { display: none !important; }` with the comment "`!important` required because display is set inline below."
- Nav inline style unchanged: `display: "flex"`, `alignItems: "center"`, `columnGap: 24`, `flexWrap: "nowrap"`, `justifyContent: "flex-end"`.
- Cascade: an `!important` author rule beats a normal inline style regardless of selector or order. So at `<=720px` the nav hides; at `>=721px` the media rule does not apply and the inline row renders exactly as before. The governing rule (exactly one nav mode) is satisfiable by this one line.
- No other inline-display vs stylesheet-hide conflict exists in `Header.tsx` (re-confirmed by full read: the button carries no inline style, the panel carries none, and the logo-row div has inline flex but no rule targets it).

## 2. Phone portrait 320 / 390 / 430, closed AND open (PASS)

Closed header = logo row + button row, nothing else. The inline nav is fully absent (`display: none !important` at `<=720px`), so zero inline links render next to the logo and no truncated row can exist. The screenshot's double-nav defect is gone by construction, not by viewport luck.

Heights (border-box confirmed: `src/styles.css:2`, `src/styles/global.css:17`, so `min-height` includes borders):

- Logo row ~65px (20 + ~25 logo box + 20 padding).
- Button row 44px (`min-height: 44`, padding 0 24, border-top 1px inside the 44).
- Closed header ~109px (65 + 44) at all three widths.
- Open header ~374px (109 + panel border 1 + 6 x 44 links; separator borders inside the 44).

Open menu: exactly 6 rows in `NAV_LINKS` order (Research, Awards, Experience, Education, Certifications, Contact), from the single `NAV_LINKS` map (no forked list). Each link: `display: flex`, `align-items: center`, `min-height: 44`, padding 0 24, 15px. Separators: `border-top: 1px` on links 2-6 (sibling rule) plus the panel border-top for link 1. The panel renders only when open (`{menuOpen && ...}`), in flow below the button: pushes content down, no overlay, no scroll lock, no animation.

No horizontal scroll at 320px, closed or open: inner width 272px; logo ~137px fits with ~135px slack; longest menu label "Certifications" ~105px + 48px padding = ~153px, well inside 320px; button `width: 100%` with border-box padding (no 48px overflow); no `position: fixed` anywhere in `Header.tsx` (grep 0); desktop nav absent, menu stacks vertically.

Proportions: closed 19.2% (320x568), 12.9% (390x844), 11.7% (430x932); open 65.8% / 44.3% / 40.1%. Closed is a modest band; open dominates short viewports by design (user-invoked, dismissed in one action).

## 3. Menu behavior re-verified in code (PASS)

- Label swap: `{menuOpen ? "Close" : "Menu"}`; 3-bar icon unchanged.
- Link tap closes: each mobile link has `onClick={() => setMenuOpen(false)}`.
- Escape closes: `useEffect` on `[menuOpen]`, early return when closed, window keydown listener only when open, `removeEventListener` cleanup.
- Seam reset: `matchMedia("(min-width: 721px)")` effect, `onChange()` on mount, clears `menuOpen` when the query matches, removes the listener on unmount. Sequence verified: open at `<=720`, widen past 720 (change fires, matches true, cleared), narrow back (matches false, no-op) yields a CLOSED menu, no stale reopen.
- Belt and braces: the `>=721px` CSS hide for button + panel stays, and the panel unmounts when closed, so a stale open state cannot render above 720px anyway.
- Button toggle kept: `onClick` flips `menuOpen`.

## 4. Tablet portrait 768 / 834: inline-only (PASS)

- 768 (safety band 721-800): inline single row, 14px links `!important`, gap 20 `!important`; row 608-625 vs inner 720 (768 - 48), slack 95-112; header ~83px (nav box ~43 + 40 padding); 8.1% of 768x1024.
- 834 (band 801+): 15px links, gap 24; row 654-671 vs inner 786, slack 115-132; header ~84px (nav box ~44 + 40); 7.0% of 834x1194.
- No hamburger button (base `display: none` + `>=721px` hide), no menu panel (CSS hide + unmounted when closed + seam reset clears state), even with a menu previously opened on a narrower width: widening clears `menuOpen`, and the CSS hide covers any residual.
- Tap targets ~44px (padding 12px 0 13px + normal line-height); logo 20px (`.hdr-logo` stylesheet rule, no narrow-phone shrink rule remains); 24px insets both sides (container padding 20px 24px); vertical centering holds (logo row and nav both `align-items: center`).
- Single row, no wrap (`nowrap`), no truncation (slack positive at both widths).

## 5. Zero effect at `>=721px` (PASS)

The changed rule lives only inside the `<=720px` block. The diff is that block only (2 insertions / 1 deletion). Nav inline style, safety band, tap block, `>=721px` hide rules, `NAV_LINKS`, logo, motif, and the reduced-motion nav-link `transition: none` rule are all byte-identical to base (the diff proves it; the reduced-motion block was read intact in the current file).

## 6. "Symmetrical" as defined in the synthesis (PASS)

- Balanced insets: logo row (padding 20px 24px), button row (0 24px), menu links (0 24px). Logo, "Menu", and menu link text all start at the same 24px left inset; the right inset is also 24px on every row.
- Centered vertical rhythm: logo row, button, and menu links all vertically center their content; container padding 20px top and bottom.
- Even spacing: uniform 44px rows (button + 6 menu links), uniform 1px `#e0e0e0` hairlines (button top, panel top, link separators, header bottom border), even gaps (container gap 24; nav gaps 24, or 20 in the safety band; icon bars 2px with 4px gaps).
- No truncation, no drift: nothing clips at the right edge at any portrait width; geometry is identical at every width inside its band.
- NOT mirrored: logo-left / nav-right (tablet) and logo-row-over-menu (phone) stay as the intended Onlines asymmetry.

## Disclosures (not blockers) and preview checks owed

- Tap boxes realize at ~41-45px depending on the fallback font's `normal` line-height; the shipped padding values are exactly per spec, so the px variance is font-dependent, not a deviation. Same for logo-row height (~63-67px vs spec ~65px) and closed/open totals (~107-111 / ~372-376 vs ~109 / ~374).
- All heights are border-box rule math; the sandbox cannot render. Preview check owed: phone-portrait eyeball of the fixed layout (hamburger only, no inline row) and the 720/721 seam on both sides.

Out of scope for this QA (other agents own it): landscape behavior, build re-run, full regression diff scope beyond the one rule verified here, live rendering.
