# Fix: one nav mode per viewport (nav-symmetry round)

Base HEAD `0384060` (nav-cleanup push). Implemented exactly the change
list in `00-synthesis.md` section 10: one rule change + one comment, in
`src/components/Header.tsx`, style block only. Nothing else touched.
No push (per task).

## The bug this fixes

On phone portrait the header showed TWO nav modes stacked: the desktop
inline nav, truncated at the right edge ("Experien"), above the hamburger
"Menu" row. Cause, verified in source: the nav element carries inline
`display: flex`, which beats any non-`!important` stylesheet rule
regardless of selector or order, so the `<=720px` hide rule never
applied. Combined with nav-cleanup's `wrap` -> `nowrap` change, the row
overflowed instead of wrapping.

## Exact diff

```diff
 @media (max-width: 720px) {
-  .onlines-nav { display: none; }
+  /* !important required because display is set inline below. */
+  .onlines-nav { display: none !important; }
```

File: `src/components/Header.tsx`, lines 76-78 (the existing
`@media (max-width: 720px)` block). The rule text found in source
matched the synthesis exactly, so no improvisation was needed.

What was deliberately NOT touched: any JSX, any inline style (the nav's
inline `display: flex` stays exactly as shipped; `!important` overrides
it at `<=720px` only), any other stylesheet rule, `App.tsx`,
`index.html`, `NAV_LINKS`, logo, motif, reduced-motion rules, hamburger
button, mobile panel, seam-reset effect. No stylesheet-base refactor,
no matchMedia conditional render, no header-height or spacing redesign.

## Verification

1. **Diff scope:** `git diff` shows only the one rule + comment in
   `Header.tsx` (1 insertion replaced by 2 lines: comment + rule).
   `git status` shows only `M src/components/Header.tsx` plus untracked
   `docs/nav-symmetry/`. No other file modified.
2. **Nav-cleanup deletions still intact** (grep counts over `src/`):
   "Start a conversation" 0, `onlines-cta-spacer` 0, `hdr-cta-pulse` 0,
   `hdr-cta-glow` 0, `secondaryCta` 0.
3. **Inline display unchanged:** the nav element's inline style object
   still sets `display: "flex"` (plus `alignItems: "center"`,
   `columnGap: 24`, `flexWrap: "nowrap"`, `justifyContent: "flex-end"`).
   It stays; the `!important` hide overrides it at `<=720px` only, and
   at `>=721px` the inline row renders exactly as before.
4. **Build:** PASS. `npm run build` completed, vite built in 8.50s
   (wall 18.65s including tsc). Em dash in diff: 0.

## Expected behavior per band after the fix

- **<=720px (phone portrait, phone landscape small 667-720):**
  hamburger button row only, plus the stacked 6-link menu when open.
  The inline nav is fully absent: no truncated row next to the logo,
  no second nav mode. Closed header ~109px (logo row ~65 + button 44);
  open header ~374px (109 + panel border 1 + 6 x 44 links). Left insets
  align at 24px (logo, "Menu", menu links); no horizontal overflow at
  320px.
- **>=721px (tablet, desktop):** inline single row only, hamburger
  button and mobile panel fully absent (CSS hide at `>=721px` plus the
  matchMedia seam reset). This fix has zero effect here: the changed
  rule lives only inside the `<=720px` block. Header ~83px (721-800,
  safety band 14px/gap 20), ~84px (801-1160), ~65px (1161+).
- **Seams (all band changes, not defects):** 720/721 switches hamburger
  to inline single row, height step 109 -> 83, exactly one mode each
  side, no both/neither gap. 800/801 switches safety band to standard
  (14/20 -> 15/24), header ~83 -> ~84, slack stays positive, no wrap.
  1160/1161 ends the tap block, header ~84 -> ~65, no horizontal shift
  (container capped at 1160).
- **Proportions:** phone portrait closed 11.7-19.2% of viewport height,
  open 40.1-65.8% (user-invoked, in flow, dismissed by tap, Escape, or
  link tap); phone landscape closed ~29% at 667x375 is inherent and
  unchanged (44px button is the touch floor, ~65px logo row is the
  shared container rhythm; the header is not sticky, so the cost lasts
  only until scroll). Tablet landscape and desktop stay at 7-11%.

## Correction to the nav-cleanup record

This is the FIRST time the `<=720px` hide has ever applied.
Nav-cleanup's mobile analysis assumed the hide rule applied; it never
did. The inline `display: flex` defect predates nav-cleanup (present at
`d05a71c` and `3ceb140`); nav-cleanup only changed the symptom, from
wrapped rows to one overflowing row (`wrap` -> `nowrap`). Every
nav-cleanup mobile claim depending on the hide rule was therefore
invalid, in particular "desktop nav is `display: none` at `<=720px`"
and the 320px no-overflow reasoning built on it. What stands from
nav-cleanup: the CTA pill deletion, single-row `>=721px` behavior, the
safety band, the tap-target block, and the mobile menu improvements,
all on unaffected code paths.

## Live-preview checks owed (sandbox cannot render)

Phone-portrait eyeball of the fixed layout (hamburger only, no inline
row), thin zone 721-730, and the 720/721 seam on both sides.
