# Landscape header audit (nav-symmetry round)

Base HEAD `0384060` verified, tree clean. Scope: landscape composition AFTER
the fix, assuming (given, not verified here) exactly one nav mode per
viewport. No fix mechanism proposed; portrait is a separate analyst's scope.

## Shipped geometry (from `src/components/Header.tsx`, read in full)

- Container: `maxWidth: 1160`, `margin: 0 auto`, `padding: 20px 24px`,
  flex, `align-items: center`, `space-between`, `gap: 24`.
- Logo: "DaivanLabs.", Inter 700, 20px, `-0.02em`, nowrap, ~120-137px wide.
- Inline nav: 6 links (Research, Awards, Experience, Education,
  Certifications, Contact). Text at 15px: 62+48+75+65+88+52 = 390px.
  Box at 15px/gap 24: 390 + 5x24 = 510px. Box at 14px/gap 20 (safety band):
  364 + 5x20 = 464px. `flexWrap: nowrap`, `justify-content: flex-end`.
- Tap block 721-1160: links `padding: 12px 0 13px` (box ~44px, realized
  41-45px). At 1161+ links carry only `padding-bottom: 3px` (box ~22px).
- Hamburger mode (<=720): button own row, 44px, `padding: 0 24px`;
  open menu = 6 x 44px rows + 1px panel border = 265px.
- Header heights: 721-800 ~83px; 801-1160 ~84px; 1161+ ~65px;
  <=720 closed ~109px (logo row ~65 + button 44); <=720 open ~374px.
- Header is in normal flow (not sticky): it scrolls away.

## Mode per landscape band (post-fix: exactly one mode each)

| Band | Width | Mode shown | Other mode | Header |
|---|---|---|---|---|
| Phone landscape, small | 667-720 | Hamburger (logo row + Menu row) | Inline nav fully absent | ~109 closed, ~374 open |
| Phone landscape, large | 721-932 | Inline single row | Hamburger + menu fully absent | ~83 (721-800), ~84 (801-932) |
| Tablet landscape | 1024-1180 | Inline single row | Hamburger + menu fully absent | ~84 |
| Desktop narrow/wide | 1280+ | Inline single row | Hamburger + menu fully absent | ~65 |

At 667-720 the truncated inline nav must be gone entirely. At 721+ no
hamburger row or menu panel may appear, open or closed.

## Single-row fit math (inner width = min(W,1160) - 48 padding)

Row = logo (120-137) + gap 24 + nav box. Slack = inner - row.

| W | Band | Nav box | Row | Inner | Slack | Verdict |
|---|---|---|---|---|---|---|
| 667 | Hamburger | n/a (absent) | Logo only | 619 | Large | No fit issue |
| 721 | Safety 14/20 | 464 | 608-625 | 673 | 48-65 | Fits, thin zone |
| 800 | Safety 14/20 | 464 | 608-625 | 752 | 127-144 | Fits |
| 844 | Inline 15/24 | 510 | 654-671 | 796 | 125-142 | Fits |
| 932 | Inline 15/24 | 510 | 654-671 | 884 | 213-230 | Fits |
| 1024 | Inline 15/24 | 510 | 654-671 | 976 | 305-322 | Fits |
| 1180 | Inline 15/24 | 510 | 654-671 | 1112 (capped) | 441-458 | Fits |
| 1280 | Inline 15/24 | 510 | 654-671 | 1112 (capped) | 441-458 | Fits |
| 1440 | Inline 15/24 | 510 | 654-671 | 1112 (capped) | 441-458 | Fits |

No overflow or truncation at any landscape width; `nowrap` turns extreme
future overflow into padding absorption, never a wrap. Thin zone
is 721-730 only: at 10% font widening the row can exceed the content box
by ~2px at W=721, absorbed by the 24px right padding (22px from the
edge); visible clipping needs ~15%+ widening. Preview check only.

## Proportion: header vs SHORT landscape viewport height

| Case | Header | Viewport H | Ratio | Verdict |
|---|---|---|---|---|
| Phone 667x375, closed | 109 | 375 | 29% | Heavy but inherent |
| Phone 667x375, open | 374 | 375 | ~100% | Transient menu state |
| Phone 844x390, inline | 84 | 390 | 22% | Heavy but inherent |
| Phone 932x430, inline | 84 | 430 | 20% | Heavy but inherent |
| Tablet 1024x768 | 84 | 768 | 11% | Proportional |
| Tablet 1180x820 | 84 | 820 | 10% | Proportional |
| Desktop 1280x720 | 65 | 720 | 9% | Proportional |
| Desktop 1440x900 | 65 | 900 | 7% | Proportional |

Phone landscape at 29% closed is heavy, but NO adjustment is warranted
within "tidy" scope: the 44px button row is the touch floor and the
~65px logo row is the shared container rhythm; shrinking either breaks
tap targets or cross-band symmetry (redesign, not tidy). Mitigations
already hold: the header is not sticky, so the 29% cost lasts only until
scroll; and the open menu IS the content while open (closes on link
click or Escape), so ~100% is a menu state, not a layout loss. Tablet
and desktop need no adjustment.

## Symmetry (horizontal + vertical)

- Horizontal: at W < 1160 the container spans full width with 24px
  padding on both sides. At W > 1160 the 1160 container is auto-centered:
  margins 10px each side at 1180, 60px at 1280, 140px at 1440, plus 24px
  padding, identical left and right.
- Vertical: 20px padding top and bottom; `align-items: center` centers
  logo against nav box (44px vs ~25px at 721-1160; ~22px vs ~25px
  at 1161+).
- Hamburger alignment: button `padding: 0 24px` and menu links
  `padding: 0 24px` match the container's 24px, so logo, Menu label,
  and menu links share one left edge line.

## Seams in landscape widths (clean single-mode switch)

- 720/721: hamburger -> inline single row; exactly one mode each side
  (post-fix), no both/neither gap. Height step 109 -> 83 is the band
  change, not a defect. QA must check both sides.
- 800/801: safety -> standard inline (14px/gap 20 -> 15px/gap 24).
  Row grows ~46px, inner width 1px; slack falls 127-144 -> 82-99,
  still positive, no wrap. Header ~83 -> ~84; inline both sides.
- 1160/1161: tap block ends -> desktop link box (`padding-bottom: 3px`
  only). Header ~84 -> ~65 (19px step). No horizontal shift:
  container already capped at 1160 both sides, inner stays 1112.
  Inline both sides.

## Exact landscape checks QA must run

1. Phone landscape closed, 667x375 and 720x360: logo row + Menu row
   only; inline nav fully absent (no truncated link at right edge);
   header ~109px; no horizontal overflow
   (`scrollWidth == viewport width`).
2. Phone landscape open, 667x375 and 720x360: stacked 6-link menu,
   header ~374px; close via link, Escape, button; menu scrolls with
   page (in-flow); no inline nav.
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
