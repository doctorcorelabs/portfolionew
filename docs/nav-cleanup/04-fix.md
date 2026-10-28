# Fix note: nav cleanup (CTA removal + tidy nav bar)

Base: HEAD `3ceb140`. Spec: `docs/nav-cleanup/00-synthesis.md`, implemented
exactly except the three documented notes in §4 (all forced or comment-only,
zero behavior change beyond the spec). No commit, no push (parent owns that).

## 1. What changed

| File | Diff | Content |
|---|---|---|
| `src/components/Header.tsx` | +49 / -69 (16 hunks) | All deletions, new rules, menu improvements, effects |
| `src/data/content.ts` | -2 (2 hunks) | `secondaryCta` field + value only |

### Deletions (Header.tsx, spec §2 items 1-8)

| # | What | Old location | New state |
|---|---|---|---|
| 1 | Fixed CTA anchor (`<a>` mailto pill, "Start a conversation", `hdr-cta-pulse`) | ~247-265 | Gone, whole element |
| 2 | Spacer div (`width: 200`, `flexShrink: 0`, `aria-hidden`) | ~205-209 | Gone, whole element |
| 3 | `.hdr-cta-pulse` rules (glow animation, 14px / 10px 18px) | ~46, ~63-72 | Gone |
| 4 | `@keyframes hdr-cta-glow` + its comment | ~50-61 | Gone |
| 5 | Reduced-motion `.hdr-cta-pulse { animation: none }` | ~47-49 | Gone; nav-link `transition: none` kept (:59) |
| 6 | `@media (max-width: 400px)` block + comment | ~130-135 | Gone, whole block; logo 20px at all widths |
| 7 | Spacer-hide line | ~87 | Gone, line only; rest of 720px block stays |
| 8 | Nav `flexWrap: "wrap"` | ~185 | `"nowrap"` (:189) |
| 9 | Nav `rowGap: 8` | ~185 | Dropped (moot under nowrap) |

### Deletions (content.ts, spec §2 item 8)

| What | Old location | New state |
|---|---|---|
| `secondaryCta` field | :37 | Gone |
| `secondaryCta` value ("Start a conversation") | :155 | Gone |

`profile` object kept; `primaryCta` field (:36) + value (:153,
"See the research") kept as the over-deletion regression check.

### New / changed rules (Header.tsx)

| Rule | Location | Values |
|---|---|---|
| Tap-target block, replaces old 721-1023 block | :132-140 | `@media (min-width: 721px) and (max-width: 1160px)`, `.onlines-nav a.hdr-nav-link { padding: 12px 0 13px; background-position: 0 calc(100% - 10px); }` (box ~44px; underline 3px below text) |
| Safety band | :142-149 | `@media (min-width: 721px) and (max-width: 800px)`: nav links `font-size: 14px !important`, `.onlines-nav { column-gap: 20px !important; }` (see §4 note 2) |
| Mobile separators | :113-115 | `.hdr-mobile-link + .hdr-mobile-link { border-top: 1px solid #e0e0e0; }`; panel border-top stays |
| Mobile hover | :116-118 | `.hdr-mobile-link:hover { color: #0859D4; }` |
| Mobile focus-visible | :119-122 | `outline: 2px solid #0859D4; outline-offset: -2px` (matches button :95-98) |
| Menu/Close label swap | :225 | `{menuOpen ? "Close" : "Menu"}`; `aria-expanded` stays; 3-bar icon unchanged |
| Escape closes | :19-26 | `useEffect` on `[menuOpen]`; keydown listener only when open; cleanup on close/unmount |
| `matchMedia` seam reset | :27-36 | `useEffect` on mount; clears `menuOpen` above 720px; cleanup on unmount |
| Import | :1 | `useEffect` added to the React import |

Kept, byte-identical in effect: `NAV_LINKS` order/labels/hrefs; logo
(20px); dotted-underline hover motif; reduced-motion nav-link kill;
1px `#e0e0e0` bottom border; CSS hide at >= 721px for hamburger +
mobile nav (:126-129); close-on-link-click; button toggle; no scroll
lock; no open/close animation.

## 2. Values shipped per band

| Band | Nav | Header height (rule math) |
|---|---|---|
| 721-800 (safety) | 14px links, columnGap 20, nowrap, single row | ~83px (nav box 43 + 40 padding) |
| 801-1160 | 15px links, columnGap 24, nowrap, single row | ~84px (nav box 44 + 40 padding) |
| 1161+ (desktop, wide) | 15px links, columnGap 24, nowrap, single row | ~65px (logo box ~25 + 40 padding) |
| <= 720 closed | Hamburger row under logo row | ~109px (logo row ~65 + button 44) |
| <= 720 open | + stacked in-flow menu (6 links) | ~374px (closed 109 + menu 265) |

Tap targets: nav links 721-1160 ~44px; hamburger 44px; mobile links
44px; logo ~25px (accepted, above the 24px WCAG minimum).

## 3. Verification

- `npm run build` (tsc + vite): PASS, 7.54s.
- Greps over `src/`: "Start a conversation" 0; `onlines-cta-spacer` 0;
  `hdr-cta-pulse` 0; `hdr-cta-glow` 0; `secondaryCta` 0;
  `primaryCta` present (field :36, value :153).
- Em dash in diff: 0.
- `git status`: only `M src/components/Header.tsx` +
  `M src/data/content.ts` (+ untracked `docs/nav-cleanup/`).
  No other file touched. No `App.tsx`, `Hero`, `Contact`, `Footer`,
  or `Profile` change; email-address mailto links untouched.

## 4. Notes (not spec deviations in behavior)

1. **`EMAIL` const deleted (forced).** It was used only by the deleted
   CTA anchor (`mailto:${EMAIL}`). `tsconfig.json` sets
   `noUnusedLocals: true` and the build runs `tsc --noEmit`, so
   keeping it would fail the build. One dead const removed, zero
   behavior change; the email address itself still exists in
   `content.ts` (`profile.email`) and in Contact/Footer/Profile.
2. **Safety band uses `!important`.** Nav font size (15) and gap (24)
   are set inline, so a plain stylesheet rule cannot override them.
   Without `!important` the 721-800 block would have zero effect.
   Values are exactly per spec (14px / 20px); the flags are the
   only way to ship them.
3. **Two extra comment-only rewords.** Beyond the two spec-named
   touch-ups (dotted-underline comment, 721-1023 comment replaced),
   two more comments cited the deleted CTA and were reworded,
   zero rule change: the sizes comment (cited CTA sizes + the
   deleted narrow-phone rule) now reads "Wordmark size lives here
   (not inline). Desktop value unchanged: wordmark 20px."; the
   menu-button comment (cited the fixed CTA as the reason for its
   own row) now ends at "under the logo row." This serves the
   spec's end state that no comment cites CTA behavior.

## 5. What QA must verify

1. Single row >= 721 at every width, including the thin-slack
   721-730 zone (nominal slack 48-65px; ~30px at 5% font widening,
   ~2px at 10%); no wrap >= 721; mobile menu stacked, never a row.
2. Tap targets: nav links 721-1160 ~44px, hamburger 44px, mobile
   links 44px.
3. Menu: open/close via button with Menu/Close label swap; close on
   link click; Escape closes when open; seam reset (open at
   <= 720, widen past 720, narrow back: menu closed); CSS hide at
   >= 721 intact.
4. Focus styles: button + mobile links `focus-visible` 2px blue,
   offset -2px; desktop links keep dotted underline on
   `focus-visible`.
5. Reduced motion: nav-link `transition: none` intact; pulse
   `animation: none` deleted WITH the pulse (no orphan); menu has
   no animation (instant).
6. Seam 720/721: nav returns as a single row; no stale open menu;
   no layout jump beyond the band change.
7. 320px no-overflow (logo ~137 + 48 padding; longest menu label
   ~105 + 48); header heights per §2.
