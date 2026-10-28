# QA layout desktop: nav cleanup

**Verdict: SHIP, no blockers.**

Scope: desktop + tablet inline nav, widths >= 721px. Basis: spec
`docs/nav-cleanup/00-synthesis.md`, fixer note `04-fix.md`, and the
shipped `src/components/Header.tsx` (read in full) plus grep
verification. Base HEAD `3ceb140`; `git status` shows only
`M src/components/Header.tsx` + `M src/data/content.ts` (+ untracked
`docs/nav-cleanup/`). Diff stat: Header 51 insertions / 69 deletions,
content.ts 0 / 2. Sandbox cannot render, so all widths below are
rule math from code, not pixel measurement; the 721-730 preview
check stays owed.

## 1. Single row >= 721: PASS

Nav inline style (`Header.tsx`, nav element): `display: flex`,
`alignItems: center`, `columnGap: 24`, `flexWrap: "nowrap"`,
`justifyContent: "flex-end"`. `rowGap` is gone. No rule anywhere
reintroduces wrap at >= 721. Safety band
(`@media 721-800px`): links `font-size: 14px !important`,
`.onlines-nav { column-gap: 20px !important; }` (flags required:
size and gap are set inline). Tap block (`@media 721-1160px`) sets
only padding/background-position, so the two blocks do not fight.

Row math, using the spec's per-link text widths (15px):
62+48+75+65+88+52 = 390. Container: `maxWidth: 1160`,
`padding: 20px 24px`, `space-between`, `gap: 24` (minimum gap;
space-between absorbs positive free space).

| Band | Nav width | Row (logo 120-137 + 24 + nav) | Inner width | Slack |
|---|---|---|---|---|
| 721-800 safety (14px, gap 20) | 364 text + 100 gaps = 464 | 608-625 | 673 at W=721 | 48-65px |
| 801-1160 (15px, gap 24) | 390 text + 120 gaps = 510 | 654-671 | 753 at W=801 | 82-99px |
| 1161+ (15px, gap 24) | 510 | 654-671 | 1112 at W=1160 | 441-458px |

Single row holds at every width >= 721 on nominal metrics. The
old wrap thresholds (~926-1060px, driven by the 200px spacer) are
gone with the spacer.

### Thin-slack zone 721-730: PASS, with a refined disclosure

Nominal slack at W=721 is 48-65px (worst case: widest logo, 137px).
With 5% system-font widening (text only): nav 482, row 626-643,
slack 30-47px. With 10% widening (text + logo): nav 500, logo
132-151, row 656-675, slack -2 to +17px. So the spec's "~2px at
10%" is the content-box exceedance at exactly W=721 with the
widest logo rendering, and it is NOT a visible clip: the row
overflows 2px into the 24px right padding, still 22px from the
viewport edge. True viewport-edge clipping needs ~15%+ widening
(row over 721px, i.e. 96px+ past nominal). With `nowrap`, any
future extreme overflow becomes padding absorption, never a wrap.
If a wrap or clip ever appears at 721-730 on a real device, the
fix is a follow-up band adjustment (e.g. gap 20 to 18, or safety
band extended), never a hamburger. Font caveat: no Inter webfont
loads, so rendered widths are system-fallback dependent; the
721-730 preview check is the real proof, code math is the model.

## 2. Tap targets 721-1160: PASS

One media block, `@media (min-width: 721px) and
(max-width: 1160px)`: `.onlines-nav a.hdr-nav-link { padding: 12px
0 13px; background-position: 0 calc(100% - 10px); }`. Grep finds
no surviving 721-1023 block: the old block was replaced, not
duplicated, and coverage is 721-1160 (not just 721-1023).

Box math: 12 + line-height + 13. Line-height is unset (browser
`normal`, ~1.15-1.35 for this stack), so the realized box is
~41-45px across fonts (spec's "~44px" assumes ~1.27). Values are
exactly per spec; the px variance is font-dependent, not a
deviation. Underline: base position `0 100%` is overridden to
`0 calc(100% - 10px)`; text bottom sits at 100% - 13px, so the
1px dotted underline lands ~3px below the text, motif preserved
(gradient, hover/focus-visible to 100% size, blue on hover).

## 3. Header heights (rule math): PASS

Height = max(logo box, nav box) + 40px vertical padding
(`alignItems: center`; taller item drives).

| Band | Driver | Height |
|---|---|---|
| 721-800 | nav box ~43 (12 + ~18 + 13 at 14px) | ~83px |
| 801-1160 | nav box ~44 (12 + ~19 + 13 at 15px) | ~84px |
| 1161+ | logo box ~25 (20px x ~1.22); nav box ~22 | ~65px |

Matches the spec table exactly. The 721-1160 header is taller
than before (~78px at 721-1023, ~65px at 1024-1160); that is the
intended tap-target growth, not a regression.

## 4. Seam 720/721: PASS

`@media (min-width: 721px)` hide block intact: `.hdr-menu-btn`
and `.hdr-mobile-nav` both `display: none`. At >= 721 the inline
nav returns (inline `display: flex`, never hidden by a >= 721
rule) as a single row via `nowrap` + safety band. The
`matchMedia("(min-width: 721px)")` effect clearing `menuOpen`
above 720px is present in code (menu behavior itself is mobile
QA's scope). Height step at the seam (closed mobile ~109px to
tablet ~83px) is the band change itself, not a jump defect.

## 5. CTA removal on desktop/tablet: PASS

Grep over `src/`: "Start a conversation" 0; `hdr-cta-pulse`,
`hdr-cta-glow`, `onlines-cta-spacer`, `secondaryCta` all 0.
`fixed`, `zIndex`, `rowGap`, `1023`, `400px` all 0 in
`Header.tsx`. The JSX fragment now holds only `<style>` and
`<header>` (logo + nav + button + conditional mobile nav). No
fixed element can paint over the first nav row, and no 200px
dead reservation forces early wrap. `secondaryCta` field and
value are gone from `content.ts`; `primaryCta` survives (field
:36, value :153, "See the research") as the over-deletion
regression check.

## 6. Retained: PASS

- `NAV_LINKS` exact: Research `/research`, Awards `/awards`,
  Experience `/experience`, Education `/education`,
  Certifications `/certifications`, Contact `/#contact`.
- Logo: `.hdr-logo` 20px, weight 700, `-0.02em`, `nowrap`; the
  <= 400px 18px rule is gone with its block.
- Dotted-underline hover motif + `focus-visible` treatment
  intact; reduced-motion block contains only the nav-link
  `transition: none` (pulse `animation: none` deleted with the
  pulse, no orphan).
- Border-bottom 1px `#e0e0e0`; container `maxWidth: 1160`,
  `padding: 20px 24px`, `space-between`, `gap: 24`; nav
  `justifyContent: flex-end`.

## Disclosures and preview checks owed (not blockers)

1. 721-730 thin slack: worst-case 10% widening gives ~2px
   content-box exceedance at W=721, absorbed invisibly by the
   24px right padding; visible clipping needs ~15%+ widening.
   Eyeball 721-730 on the live preview; any wrap there is a
   band-adjustment follow-up, not a hamburger.
2. Tap targets realize at ~41-45px depending on the fallback
   font's `normal` line-height; the shipped values are exactly
   per spec.
3. All widths here are rule math (sandbox cannot render);
   confirm header heights per band and the single row at
   721-730 on the preview.

Out of scope for this QA (other agents own it): mobile menu
behavior, build re-run, full diff scope, reduced-motion
rendering under emulation.
