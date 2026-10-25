# 08 - Final QA (responsive fix)

Role: final QA verifier, agent 10 of 10. No source edits were
made by this pass. Every item below was verified from source
(file + line), not from the fix agents' claims. Method: code
inspection plus px modeling only; the sandbox blocks localhost
preview, so live-device checks remain owed after deploy (see
section "Live checks still owed").

## Verdict: PASS (ship)

All seven verification items pass. Two observations (O1, O2)
are noted for the parent's eye on the preview; neither blocks
shipment.

## Item 1: Grey strip - PASS

- Works section style carries `overflow: "hidden"`
  (`src/sections/Works.tsx` line 275, with a comment naming the
  from-right pre-reveal slide it clips). This removes the 24px
  scrollWidth extension below 1256px.
- `src/styles/global.css` sets `html { background: #FFFFFF; }`
  (line 25). Import order in `src/main.tsx` is `styles.css`
  (line 5), `tokens.css` (line 6), `global.css` (line 7), so
  the white rule wins over `styles.css` line 16 (`#f3f4f6`).
  Any residual overflow band now paints white.
- `src/styles/global.css` lines 31-34 set `html, body {
  overflow-x: clip; }`. Clip, not hidden: it creates no scroll
  container, so the Quote sticky pinning survives and the fixed
  CTA is unaffected.
- Recomputed modeled page overflow after all fixes: 0px at
  320, 390, 768, 1024, and 1440. At 320px the binding
  constraints are Profile `dt` = min(320, 272) = 272 (fits the
  272px column exactly), Works meta min-width 0 below 700px,
  and the clipped Works header; at 390px and above every
  contributor fits with slack; at 1440px the 1160px container
  leaves margins on both sides.

## Item 2: Hero word - PASS

- `h1` renders `daivan<wbr />labs.` (`src/sections/Hero.tsx`
  line 1029).
- Max-width 903px rule (`Hero.tsx` lines 775-779) sets
  `.mv-word` to `font-size: clamp(64px, 18vw, 72px)
  !important`. The `!important` is required because the h1
  font size is inline. The rule is inert at 904px and above
  (media query bound), where the inline clamp and 180px cap
  apply unchanged.
- Mobile frame (`Hero.tsx` mobile block): `width: calc(100%
  - 16px) !important`, `margin: 0 auto`, `padding: 28px 24px
  !important`. Frame content at 320px is 320 - 48 (section
  padding) - 16 (frame shrink) - 48 (frame side padding) =
  208px; "daivan" at 64px needs about 200px, slack 8px.
- Observation O1 (not a fail): the 903px rule caps the word
  at 72px for all widths below 904px, so the tablet word is
  much smaller than before (72px instead of 115-163px via
  16vw), and the two-line lockup only occurs below about
  450px; from about 450px to 903px the word is one line at
  64-72px. The code comment's "two-line lockup below 904px"
  overstates this. The rule matches the brief exactly, so
  this passes, but the parent should confirm the smaller
  tablet word looks right on the preview.

## Item 3: Mobile logo scatter - PASS

- `db-row` item is gone from `COLLAGE_ITEMS` (no `db-row`
  id in `Hero.tsx`); `DbLogoRow.tsx` is deleted and grep
  finds 0 references in `src/`.
- Four mobile-only single tiles in DOM order: `m-pubmed`
  (line 193), `m-elsevier` (line 195), `m-scopus` (line 207),
  `m-cochrane` (line 208), all with hide class
  `mv-collage-hide-min-720` (hidden at 720px and above).
  Mobile-visible DOM order is therefore PubMed, FaersCard,
  Elsevier, NotifyBubble, Scopus, Cochrane, as specified.
  (Items sitting between them in DOM order all carry
  `mobile-hide`, `hide-1400`, or `hide-1300`, so they are
  hidden below 720px too.)
- Each tile fits the 272px column at 320px: PubMed 100px,
  Elsevier 104px, Scopus 100px, Cochrane 69px wide
  (`DbLogoFloat.tsx` tile configs), with at least 84px slack
  per side; the mobile stack centers items and caps them at
  `max-width: 100%`.
- No logo appears twice at any width: mobile tiles hide at
  720px and above, desktop tiles (`db-pubmed`,
  `db-elsevier`, `db-scopus`, `db-cochrane`) all carry
  `mobile-hide`.
- Desktop logo counts unchanged: PubMed only at 720-1400px;
  4 above 1400px at viewport heights over 750px; 3 at 750px
  and below (Cochrane `hide-750`).

## Item 4: Tablet / desktop hero - PASS

- Review is at right 29% (`Hero.tsx` line 187, was 27%).
  Recomputed gaps to poster (right 2.5%, 260 wide): about 5px
  at 1001px, about 11px at 1024px, about 21px at 1061px. The
  1001-1061px graze is closed.
- Microscope (line 201) and stickers (line 235) carry
  `hide-1300`, defined as max-width 1300px (lines 722-726):
  hidden at 1300px and below, returning at 1301px and above.
  Helix (line 186) and awards (line 197) keep `hide-mid`
  (1160px).
- `hide-min-1400` is min-width 1401px (lines 737-740),
  closing the exactly-1400px dip.
- Live-check note O2 (not a fail): the review move shrinks
  the search/review gap at 1401px to about 10px (search right
  edge about 764px, review left edge about 775px at 1401px).
  Verify on the preview that it reads as intentional
  layering, not a collision.

## Item 5: Header - PASS

- `.hdr-logo` 20px desktop, 18px at max-width 400px
  (`Header.tsx` lines 69-71, 134); `.hdr-cta-pulse` 14px +
  10px 18px desktop, 12px + 8px 12px at 400px (lines 72-75,
  135).
- At 320px: logo right edge about 137px, CTA left edge about
  146px, positive gap about 9px. The CTA overlap below 357px
  is closed.
- Hamburger button at 720px and below: `type="button"`,
  `aria-expanded={menuOpen}`, `aria-controls="hdr-mobile-nav"`,
  focus-visible outline, 44px min-height (lines 214-215 and
  the max-width 720px block). The panel renders only when
  open, holds all 6 `NAV_LINKS` at 44px rows, and each link
  closes the panel on click. Both button and panel are forced
  hidden at 721px and above.
- The 200px spacer stays hidden on phones (max-width 720px
  block); the button and panel use `width: 100%` inside the
  border-box header, so no new overflow at 320px.
- Tablet nav: `column-gap: 24px; row-gap: 8px` (inline nav
  style) with link padding 8px 0 11px at 721-1023px.
- Desktop CTA formula (`right: max(16px, calc((100vw -
  1160px) / 2))`) and 200px spacer unchanged.

## Item 6: Sections - PASS

- Profile: `dt` `minWidth: "min(320px, 100%)"` (line 469);
  `dd` `overflowWrap: "anywhere"` (line 481).
- Works: meta `min-width: 0` below 700px (media block),
  220px kept above 700px (inline style line 531, class
  `wk-meta` line 523).
- Manifesto: vertical switch at max-width 1100px (line 219,
  `.journey-grid` becomes `display: block`).
- Footer: text alpha 0.85 in both `styles.line` (line 173)
  and `styles.link` (line 200).
- Contact: mailto pill 16px font with 24px side padding
  below 480px (stylesheet lines 146-151, `!important` over
  the inline style).
- Services untouched (not in git status) and has no overflow
  at 1024px: 3 columns of (976 - 40) / 3 = 312px with
  wrapping text and no fixed widths (per report 06). The
  deliberate skip of the optional 2-column step is recorded
  as accepted in `07-integration.md`.

## Item 7: No regressions - PASS

- Dark-section text colors still explicit: Services and
  Manifesto are untouched (their explicit light colors
  stand; the only Manifesto edit is the breakpoint line);
  Hero `h1` keeps its explicit ink color. The global
  `h1-h6` dark rule therefore cannot wash out any dark
  section.
- No FAERS numbers, text, or data files changed: git status
  shows no changes to `src/data/`, `src/components/
  ForestPlot.tsx`, or `docs/faers-verified.json`.
- Masked FAERS check: loaded `docs/faers-verified.json`,
  took only the 2 rows with status != verified, and checked
  their ror/ciLow/ciHigh values as standalone numbers in
  `src/` and `dist/`. Counts only: 28 hits in `src/`, 9 in
  `dist/`. Every masked context (digits replaced by #) is a
  coincidental style or animation literal (keyframes
  percentages, durations, rgba values, grid ticks). Six hits
  flagged by a nearby-term sweep were individually inspected
  and explained: `.fp-ci` CSS class names in the generic plot
  component, the allowed "FAERS N = 6,601" homepage label, and
  "Error" substrings in the router error boundary. No withheld
  value appears with FAERS semantics anywhere. No leak.
- No "sciencedirect" references in `src/` (grep 0); no
  `DbLogoRow` references in `src/` (grep 0).
- No em dash in any touched source file (grep 0) or in the
  six analysis reports (grep 0).
- Build: `npm run build` PASSED (exit 0, built in 4.10s).
  The transient Hero `DbLogoRow` tsc error reported by the
  header fixer while the hero agent was mid-edit is gone:
  the row component is deleted and nothing references it.
- Dist bundle: 0 dialkit strings (grep over `dist/`).

## Live checks still owed (real device, after deploy)

These cannot be closed from the sandbox; check them on the
fresh Netlify preview, which must match the new commit:

1. 320px phone: no horizontal scroll, no grey right strip,
   hero word "daivan" / "labs.", logo scatter order PubMed,
   FAERS, Elsevier, notification, Scopus, Cochrane.
2. 390px phone: same as above; CTA clears the wordmark.
3. Hamburger open/close: panel opens, all 6 links work,
   panel closes on link click, button and panel vanish when
   widened past 720px.
4. 768px tablet: hero word on one line at 72px (see O1),
   Manifesto vertical layout, header nav rows.
5. 1401px desktop: search/review gap about 10px reads as
   intentional layering, not a collision (see O2).
6. Confirm the deployed preview matches the new commit
   (the earlier screenshot's phone nav did not match source,
   suggesting a stale build at that time).

## Notes for the parent (do not push from this pass)

This pass makes no source edits and no push, per the brief.
The parent pushes. Untracked docs in `docs/responsive-fix/`
(01-08) are part of the change set and should be committed
with the fix.
