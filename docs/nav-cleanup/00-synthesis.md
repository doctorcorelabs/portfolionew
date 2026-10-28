# Synthesis: nav cleanup (CTA removal + tidy nav bar)

Base: HEAD `3ceb140`. User order: (1) REMOVE "Start a conversation" from
ALL UI; (2) tidy the nav bar on ALL devices (mobile, tablet, desktop).
The screenshot shows the nav wrapping with the blue fixed CTA pill
painting over "Research". This spec reconciles docs 01 (CTA inventory),
02 (desktop/tablet), 03 (mobile/tablet menu). The fixer implements
exactly this; no verdict below is left open.

## 1. Conflict verdicts

### (1) Single row vs accepted wrap on tablet: SINGLE ROW >= 721, with the safety band

Doc 02 (single row >= 721) wins; doc 03's "impossible at 721" does not
survive arithmetic reconciliation.

| Figure | Doc 02 (per-link breakdown) | Doc 03 (aggregate) |
|---|---|---|
| Link text, 15px | 62+48+75+65+88+52 = 390 | 526 (no breakdown) |
| Nav total, 15px/24px gaps | 390 + 120 = 510 | 526 + 120 = 646 (if 526 is text-only) |
| One-row threshold, viewport | logo 120 + 24 + 510 + 48 padding = 702 | 137 + 526 + 120 + 48 = 831 |

Doc 03's 526 already approximates doc 02's 510 nav total, so adding
120 again double-counts the inter-link gaps; corrected, doc 03's
threshold is ~711, matching doc 02's 702 within 9px. Doc 01's rough
590 nav figure is consistent with a ~702-720 threshold once row gaps
are counted consistently, not with 831. The most granular evidence
(per-link widths) therefore governs.

Safety-band fit (14px links, columnGap 20, band 721-800): text
390 x 14/15 = 364 + 100 gaps = 464 nav; row = logo 120-137 + 24 gap
+ 464 = 608-625; inner width at W = 721 is 673; slack 48-65px.
At 801+ (15px/24px): row = 120-137 + 24 + 510 = 654-671; inner 753;
slack 82-99px. At 1160: inner 1112; slack ~441-458px.
Sensitivity (preview check, not an open option): 5% font widening
shrinks safety-band slack at 721 to ~30px; 10% to ~2px, confined to
721-730. A wrap there needs a follow-up band adjustment, never a
hamburger or accepted wrap.

### (2) Tablet tap padding: EXTEND to 721-1160 AND RAISE to 12px 0 13px

Doc 03 wins. Doc 02's "retain 721-1023" leaves 1024-1160 at ~22px
(padding-bottom 3px only) and 721-1023 at ~38px, both below the 44px
target. New rule, one media block replacing the old 721-1023 block:
`@media (min-width: 721px) and (max-width: 1160px)`,
`.onlines-nav a.hdr-nav-link { padding: 12px 0 13px;
background-position: 0 calc(100% - 10px); }`.
Box = 12 + ~19 line + 13 = ~44px. Underline math preserves the
motif: text bottom sits at 100% - 13px, underline top at
100% - 10px, i.e. 3px below text, same as the old rule
(11px bottom, position 100% - 8px). Padding is vertical only, so single-row fit is unaffected.

### (3) CTA data: DELETE secondaryCta field + value; LEAVE primaryCta

Confirmed. Delete `secondaryCta` field (`src/data/content.ts:37`) and
value (`:155`, "Start a conversation"): zero consumers, and the
parent `profile` object itself has zero importers (only
`researchItems`, `oldPublications`, `researchFocus`, `methodologies`
are imported). Do NOT delete the `profile` object itself and do NOT
touch `primaryCta` (field `:36`, value `:154`, "See the research"):
same zero-consumer status but NOT part of this order. A dead-data
sweep is a separate decision if the user wants one.

### (4) Mobile menu improvements: ADOPT all, trim two non-proposals

Adopt (doc 03, unopposed, all within "tidy" scope): separators (1px
`#e0e0e0` border-top on each `.hdr-mobile-link` except the first;
panel's existing border-top stays); focus-visible 2px `#0859D4`
outline, offset -2px (matches the button); hover color `#0859D4`
(matches the desktop motif); Menu/Close label swap on toggle
(`aria-expanded` stays, 3-bar icon unchanged); Escape closes the
menu when open (keydown listener, only when open, cleanup on close /
unmount); keep close-on-link-click + button toggle; no scroll lock
(in-flow menu needs none); no open/close animation (instant =
reduced-motion safe by construction); `matchMedia` state reset
(effect clears `menuOpen` above 720px, so re-narrowing never
restores a stale menu; add `useEffect` to the Header import).
Trim (not proposed, out of scope): NO focus move on open, NO
outside-click close. Logo tap box ~25px stays accepted (above the
24px WCAG minimum; padding it would grow header height).

### (5) Logo at <= 400px: RETURNS to 20px at all mobile widths

Confirmed. The whole `@media (max-width: 400px)` block
(`Header.tsx:133-135`, `.hdr-logo` 18px + `.hdr-cta-pulse` 12px /
8px 12px, plus its comment) is deleted: both rules exist only to
clear the CTA pill. At 320px the container is 272px and the ~137px
wordmark fits with room. No logo shrink anywhere.

### (6) The <= 720px spacer-hide rule: DELETE the line, not the block

Confirmed. Delete ONLY `Header.tsx:87`
(`.onlines-cta-spacer { display: none; }`); the rest of the
`@media (max-width: 720px)` block (hamburger shown, mobile nav,
mobile links) stays. The spacer element itself is deleted in §2.

## 2. Exact deletion list (`src/components/Header.tsx` unless noted)

| # | What | Location | Action |
|---|---|---|---|
| 1 | Fixed CTA anchor (`<a>` mailto pill, text "Start a conversation", class `hdr-cta-pulse`) | ~247-265 (className ~249, text ~262) | DELETE whole element |
| 2 | Spacer div (`width: 200`, `flexShrink: 0`, `aria-hidden`) | ~205-209 | DELETE whole element |
| 3 | `.hdr-cta-pulse` rules (glow animation, 14px / 10px 18px) | ~46, ~63-72 | DELETE |
| 4 | `@keyframes hdr-cta-glow` + its comment | ~50-61 | DELETE |
| 5 | Reduced-motion `.hdr-cta-pulse { animation: none }` | ~47-49 inside the reduced-motion block | DELETE (keep nav-link `transition: none`) |
| 6 | `@media (max-width: 400px)` block + comment | ~130-135 | DELETE whole block |
| 7 | Spacer-hide line | ~87 | DELETE line only |
| 8 | `secondaryCta` field + value | `src/data/content.ts:37`, `:155` | DELETE both |
| 9 | Nav `flexWrap: "wrap"` | inline nav style ~185 | CHANGE to `"nowrap"` |
| 10 | Nav `rowGap: 8` | inline nav style ~185 | DROP (moot under `nowrap`, zero visual effect) |

Comment-only touch-ups (no rule change): reword the
dotted-underline comment (~24-28) clause citing "the fixed CTA"
(the wordmark is untouched; only nav links carry the treatment).
The old 721-1023 comment (~137-138) is replaced by the new
rule's comment. No other comment cites CTA behavior.

## 3. Tidied layout per device

Kept everywhere: flex row, `maxWidth: 1160`, `padding: 20px 24px`,
`space-between`, container `gap: 24`, `justifyContent: flex-end`,
dotted-underline hover motif, reduced-motion transition kill,
1px `#e0e0e0` bottom border, logo styles. `NAV_LINKS`
order/labels/hrefs UNCHANGED: Research `/research`, Awards
`/awards`, Experience `/experience`, Education `/education`,
Certifications `/certifications`, Contact `/#contact`. Single
source feeds both desktop nav and mobile menu; do not fork it.

| Band | Nav | Header height | Driver |
|---|---|---|---|
| 721-800 (safety) | 14px links, columnGap 20, nowrap, single row | ~83px | nav box 43 (12+~18+13) + 40 padding |
| 801-1160 | 15px links, columnGap 24, nowrap, single row | ~84px | nav box 44 (12+19+13) + 40 padding |
| 1161+ (desktop, wide) | 15px links, columnGap 24, nowrap, single row | ~65px | logo box ~25 + 40 padding (nav box 22) |
| <= 720 closed | Hamburger row under logo row | ~109px | logo row ~65 + button 44 |
| <= 720 open | + stacked in-flow menu (6 links) | ~374px | closed 109 + menu 265 (6 x 44 + 1 border) |

Mobile (<= 720): hamburger + stacked in-flow menu stay (6 links
cannot fit one phone row). Menu improvements from §1(4) apply.
Seam 720/721: the single-row inline nav returns, the CSS hide
(`:126-128`) stays, and the `matchMedia` reset clears `menuOpen`,
so no stale menu returns on re-narrowing. No tablet hamburger,
scrollable nav, logo shrink, scroll lock, or animation. The
1400/1401 seam is unaffected (no header rule at 1400).

NOT the CTA, stay untouched: email-address mailto links in Contact
(`Contact.tsx:411-415`), Footer (`Footer.tsx:129`), Profile
(`Profile.tsx:440-444`); Contact body copy (`Contact.tsx:406`);
Hero (no CTA by design). `Header` stays outside `<Routes>`
(`App.tsx:314`), so the pill's removal covers every route.

## 4. Hard constraints for the fixer

- `NAV_LINKS` unchanged (order, labels, hrefs); logo unchanged
  except the <= 400px 18px rule dying (20px at all widths).
- No rule changes beyond this spec: no new breakpoints, no
  hamburger on tablet, no scrollable nav, no logo shrink, no
  scroll lock, no animation, no focus move on open, no
  outside-click close.
- The `matchMedia` reset and Escape listener must clean up on
  unmount / close; existing toggle and close-on-link-click stay.
- No em dash anywhere in code comments or docs.
- Do not touch: `App.tsx` header placement, reduced-motion
  nav-link kill, border-bottom, dotted-underline motif, `Hero`,
  `primaryCta`, the `profile` object, any other section.

## 5. QA axes

1. CTA string 0 in `src/` (grep "Start a conversation" returns
   nothing); `onlines-cta-spacer`, `hdr-cta-pulse`, `hdr-cta-glow`
   all 0; `secondaryCta` 0; `primaryCta` still present (field +
   value) as a regression check against over-deletion.
2. Single row >= 721 at every width (rule math per §1(1));
   preview check at 721-730 for the thin-slack zone; no wrap
   >= 721; mobile menu stacked, never a row.
3. Tap targets >= 44px: nav links 721-1160 (~44px), hamburger
   44px, mobile links 44px; logo ~25px accepted (above the 24px
   WCAG minimum).
4. Menu: open/close via button with Menu/Close label swap;
   close on link click; Escape closes when open; seam reset
   (open at <= 720, widen past 720, narrow back: menu closed);
   CSS hide at >= 721 intact.
5. Focus: button + mobile links `focus-visible` 2px blue,
   offset -2px; desktop links keep dotted underline on
   `focus-visible`.
6. Reduced motion: nav-link `transition: none` intact; pulse
   `animation: none` rule deleted WITH the pulse (no orphan);
   menu has no animation (instant).
7. Seam 720/721: nav returns as a single row; no stale open
   menu; no layout jump beyond the band change.
8. Header heights per §3 (rule math; sandbox cannot render);
   no horizontal overflow at 320px (logo ~137 + 48 padding;
   longest menu label ~105 + 48).
9. Build passes; em dash 0 in diff; diff = `Header.tsx` +
   `content.ts` (+ docs) only.

## 6. Disclosure list for the final report

- The fixed pill is gone from every viewport and every route:
  it floated at top-right on all routes and all widths, over
  scrolled content on mobile too. The screenshot's overlap class
  (opaque fixed element over the first nav row) is gone, not
  just patched.
- Nav is a single row at every width >= 721: no more 2-row wrap
  on tablets. Small tablets (721-800) get slightly smaller
  links (14px, gap 20) as a safety band; 801+ keeps 15px/24px.
- Tablet header gets taller where tap targets grew: 721-1160
  is now ~83-84px (was ~78px at 721-1023, ~65px at 1024-1160);
  desktop 1161+ stays ~65px.
- Tablet tap targets fixed: 44px across 721-1160 (was ~38px at
  721-1023 and ~22px at 1024-1160).
- Mobile menu tidied: separators between links, focus outlines,
  hover color, Menu/Close label, Escape closes, no stale
  reopen after widening. Logo returns to 20px on narrow
  phones (was 18px at <= 400px).
- Accepted residuals: (a) single-row slack at 721-730 is thin
  under worst-case system fonts (nominal 48-65px, ~30px at 5%
  widening, ~2px at 10%) - preview check owed; a wrap there
  needs a follow-up band adjustment, not a hamburger.
  (b) Logo tap box ~25px stays below 44px (accepted, above
  the 24px WCAG minimum). (c) No focus move on open, no
  outside-click close (scope kept to tidy).
- Unchanged: `NAV_LINKS`, email-address contact links, Hero,
  `primaryCta` dead data (still present, still unrendered -
  a dead-data sweep is a separate decision), reduced-motion
  behavior for links.
- Live-preview checks owed: single row at 721-730 (thin-slack
  zone), tablet tap targets, mobile menu open/close/Escape/
  seam-reset, 320px no-overflow, header heights per band.
