# 07 - Responsive Fix Integration

What changed, file by file, for the mobile / tablet / desktop
responsive fix. Base: commit `01aa04c` (Cochrane swap). Analysis
inputs: reports `01` through `06` in this folder. This doc records
the as-built state verified from source by the final QA pass
(see `08-final-qa.md`); it does not repeat the fix agents' claims
without a source check.

## Files changed

| File | Change |
|---|---|
| `src/styles/global.css` | `html { background: #FFFFFF; }` (loads after `styles.css`, so it wins over the grey `#f3f4f6` canvas); `html, body { overflow-x: clip; }` (clip, not hidden, so Quote sticky pinning survives). |
| `src/sections/Works.tsx` | Section style gains `overflow: "hidden"` (clips the header's pre-reveal `from-right` 48px slide); media block below 700px gains `.wk-meta { min-width: 0 !important; }` (220px kept above 700px). |
| `src/sections/Profile.tsx` | Anchor `dt` `minWidth: 320` becomes `minWidth: "min(320px, 100%)"`; anchor `dd` gains `overflowWrap: "anywhere"` (email string can break). |
| `src/sections/Hero.tsx` | `h1` gains `<wbr/>` between "daivan" and "labs."; new max-width 903px rule sets `.mv-word` to `clamp(64px, 18vw, 72px) !important`; mobile frame becomes `width: calc(100% - 16px)`, centered, with side padding 24px; `db-row` item deleted; four mobile-only single logo tiles added (`m-pubmed`, `m-elsevier`, `m-scopus`, `m-cochrane`, all `hide-min-720`); review moves from right 27% to right 29%; microscope and stickers move from `hide-mid` to new `hide-1300` (max-width 1300px); `hide-min-1400` becomes min-width 1401px. |
| `src/components/hero-v8/DbLogoRow.tsx` | Deleted. Zero references remain in `src/`. |
| `src/components/Header.tsx` | Wordmark and CTA sizes move to stylesheet classes (`.hdr-logo` 20px, `.hdr-cta-pulse` 14px + 10px 18px); narrow-phone rule at max-width 400px shrinks them to 18px and 12px + 8px 12px; hamburger button (`.hdr-menu-btn`, 44px tall, `aria-expanded`, `aria-controls`) plus collapsible mobile nav (`.hdr-mobile-nav`, 6 links at 44px rows, closes on link click) shown only at 720px and below; nav uses `column-gap: 24px; row-gap: 8px`; tablet link padding 8px 0 11px at 721-1023px. Desktop CTA formula and 200px spacer unchanged. |
| `src/sections/Manifesto.tsx` | Vertical-layout switch moves from max-width 900px to max-width 1100px (`.journey-grid` becomes `display: block`). |
| `src/components/Footer.tsx` | Text color alpha 0.6 becomes 0.85 in both `styles.line` and `styles.link`. |
| `src/sections/Contact.tsx` | Mailto pill below 480px: 16px font, 24px side padding (`!important` over the inline style). |
| `src/sections/Services.tsx` | Untouched on purpose. The sections fixer deliberately skipped the optional 2-column step at 1024px as risky; the 3-column layout has no overflow at 1024px (312px cards, wrapping text), so the skip is recorded as accepted. |

## Before / after per breakpoint

### Grey right strip (mobile)

- Before: Works header pre-reveal slide extended page scrollWidth
  by 24px below 1256px, and the exposed canvas band painted grey
  (`#f3f4f6` from `styles.css`, because `global.css` never set an
  html background). At 320px, Profile `dt` (320px) and Works meta
  (220px) added further overflow.
- After: Works section clips its own slide; html background is
  white; `overflow-x: clip` guards every section. Modeled page
  overflow after all fixes: 0px at 320, 390, 768, 1024, and 1440.
  Even if a future element spills, the band now paints white.

### Hero word

- Before: `clamp(72px, 16vw, 180px)` with `overflow-wrap:
  break-word` and no designed break point, so phones showed
  "daivanl" / "abs." and tablets 720-904px risked a lone "."
  second line.
- After: below 904px the word is capped at 72px and breaks at
  the `<wbr/>` only when it must. Actual behavior, recomputed
  from the rule: below about 450px the lockup is two lines
  ("daivan" / "labs."); from about 450px to 903px it is one
  line at 64-72px; at 904px and above the rule is inert and the
  inline clamp (180px cap) applies unchanged. Note: this makes
  the tablet word much smaller than before (72px instead of
  115-163px via 16vw). That trade is inherent to the rule as
  specified; the parent should eyeball the tablet hero on the
  preview (see `08-final-qa.md`, observation O1). The code
  comment says "two-line lockup below 904px", which overstates
  it: the two-line case only occurs below about 450px.
- Mobile frame: 8px extra breathing room per side (frame width
  `calc(100% - 16px)`, centered), with side padding cut 32px
  to 24px so frame content stays exactly V - 112 (208px at
  320px; "daivan" at 64px needs 200px, slack 8px).

### Mobile logo scatter

- Before: the four database logos sat in one `DbLogoRow` block
  at the very bottom of the mobile hero stack.
- After: the row is gone and four single tiles interleave the
  stack in DOM order PubMed, FaersCard, Elsevier, NotifyBubble,
  Scopus, Cochrane. Each tile (100 / 104 / 100 / 69px wide)
  fits the 272px column at 320px with at least 84px slack per
  side. No logo appears twice at any width: mobile tiles hide
  at 720px and above (`hide-min-720`), desktop tiles hide on
  mobile (`mobile-hide`). Desktop logo counts unchanged:
  1 (PubMed) at 720-1400px, 4 above 1400px at viewport heights
  over 750px, 3 at 750px and below (Cochrane hidden).

### Tablet / desktop hero

- Review moves right 27% to 29%: the 1001-1061px review/poster
  graze becomes a real gap (about 5px at 1001px, about 11px at
  1024px, about 21px at 1061px). Side effect, flagged as a
  live check rather than a fail: the search/review gap at
  1401px shrinks to about 10px (search right edge about 764px,
  review left edge about 775px at 1401px).
- Microscope and stickers now hide at 1300px and below, so the
  narrow-desktop tuck (card mostly hidden behind the word at
  1180-1280px) is gone; they return at 1301px and above, where
  glyph overlap is 35% or less. Helix and awards keep
  `hide-mid` (1160px). `hide-min-1400` is now min-width
  1401px, closing the exactly-1400px dip (poster and awards
  no longer drop out for one pixel).

### Header

- Before: no navigation at all on phones; at 320-356px the
  fixed CTA covered the wordmark tail.
- After: at 320px the logo right edge sits about 137px and
  the CTA left edge about 146px (positive gap about 9px).
  Phones get a hamburger (44px button, keyboard focus-visible
  outline) opening a 6-link panel at 44px rows that closes on
  link click; both vanish at 721px and above. The 200px spacer
  stays hidden on phones, so the old 117-211px phone overflow
  cannot return. Tablet nav wraps with 24px column gap and
  8px row gap, and tablet link tap height rises to about 37px.
  Desktop CTA placement and spacer are byte-identical to
  before.

### Sections

- Profile: no overflow at 320px any more (`dt` caps at 100%
  of the 272px column; email `dd` wraps anywhere).
- Works: meta wraps below 700px instead of forcing 220px into
  a 184px mobile row area; header slide clipped.
- Manifesto: landscape iPads at 1024px now get the vertical
  layout instead of five 176px columns; widths 901-1100px on
  desktop get the vertical layout too (accepted side effect).
- Footer: text contrast rises from about 2.4:1 to about 4.6:1
  (alpha 0.85).
- Contact: email pill breaks into cleaner lines below 480px.
- Services: untouched, no overflow at 1024px, 2-column step
  skipped by design (see table above).

## What was NOT changed

- No FAERS numbers, text, or data files changed. `src/data/`,
  `src/components/ForestPlot.tsx`, and `docs/faers-verified.json`
  are untouched (verified via git status). The masked check in
  `08-final-qa.md` confirms no withheld value leaked.
- No dark-section text colors changed. Services and Manifesto
  are untouched, so their explicit light colors stand; the
  only Manifesto edit is the breakpoint line. Hero `h1` keeps
  its explicit ink color.
- No "sciencedirect" references in `src/`; no `DbLogoRow`
  references in `src/`; no em dash in any touched source file.
- Production bundle contains 0 dialkit strings; the canvas
  tooling remains dev-only.
