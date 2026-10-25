# 01 - Phone miniature (zoom-out hero, below 720px)

Base: `cbfeb35`. All changes in `src/sections/Hero.tsx` only. No push yet.

UPDATE (short freeze, base `e6b8830`): the frozen state changed from the
TALL desktop state (1160x980, all gates open) to the SHORT 1161-1400
desktop state (1160x600, equiv. VH ~700), because the user's own
desktop window is short (VH <= 750: no helix, Cochrane, notify,
stickers, or microscope visible in their screenshot) and the tall
freeze showed 5 items their desktop hides. Visible set is now 8
items; Scopus keeps its shipped 1161-1300 anchor (top 19%, stack NOT
collapsed). Details below replace the tall-freeze values wherever
they differ.

## Mechanism

The phone hero is NOT a scaled screenshot and NOT the old vertical stack. It is
the real collage, rendered on a frozen 1160x600 design stage and shrunk with a
CSS transform to the phone width.

- JS: `MINI_STAGE_W = 1160`, `MINI_STAGE_H = 600`. `miniScale` state is
  `section.clientWidth / 1160` while `clientWidth < 720`, else `null`.
  A `ResizeObserver` on the section re-measures on mount and every resize and
  disconnects on cleanup. Initial state comes from `window.innerWidth`
  (`innerWidth < 720` only), so the first frame is already miniature on phones.
- Section: class `mv-hero-mini` when `miniScale !== null`, plus inline custom
  property `--mv-mini-h = (600 x miniScale).toFixed(1)px`. The miniature
  section rule sets `height` and `min-height` to `var(--mv-mini-h) !important`,
  `padding: 0 !important`, `display: block !important`, beating the base
  section style and the 719px block.
- Wrapper: a `<div class="mv-mini">` wraps label + frame + collage. At
  desktop/tablet it is `display: contents` (layout-neutral; no child-selector
  depends on section direct children, verified by grep). In miniature it
  becomes a positioned 1160x600 flex stage (`padding: 80px 24px`,
  `box-sizing: border-box`) carrying inline
  `transform: scale(miniScale)` with `transformOrigin: "top left"`.
  Because `scale = clientWidth / 1160`, the scaled stage is exactly the
  section width, and its scaled height is exactly `--mv-mini-h`, so there is
  no overflow and no gap. No oscillation: under `border-box`, padding does
  not change `clientWidth`, so the gate value is stable across the
  padding-to-0 switch.
- Stylesheet hooks are DESCENDANT selectors (`.mv-hero-mini .mv-frame`,
  `.mv-hero-mini .mv-collage`, ...), matching the section hook plus the
  wrapper/items beneath it. The frozen rules beat the 719px stack block and
  the laptop band blocks by specificity (0,2,0 vs 0,1,0, plus `!important`
  where the base rule has it) and by source order (miniature block is last).
- Reduced motion: a miniature override at the very end
  (`.mv-hero-mini .mv-collage { animation: none !important; }` and the same
  for `.mv-collage-float`) beats the base reduced-motion block, so the
  miniature is still on phones.

## Frozen state (1160x600, equiv. VH ~700, short-window state)

Anchors are the shipped 1161-1400 anchors, frozen, independent of
the phone's real viewport height. The visible set matches what the
user's short desktop window shows (VH <= 750):

| Item | Frozen anchor |
|---|---|
| docking | left 2.5%, top 3% |
| review | left 36%, top 2% (`right: auto`) |
| poster | right 2.5%, bottom 2% (`top: auto`) |
| faers | left 2.5%, bottom 2% |
| awards | right 27%, bottom 4% |
| db-pubmed | left 43%, bottom 5% |
| db-elsevier | left 27%, bottom 5% |
| db-scopus | left 62%, top 19% |

Scopus keeps its shipped 1161-1300 anchor (top 19%). The stack is NOT
collapsed upward: the empty slot above Scopus (where Cochrane sits at
62%/2% in the tall state) is correct 1161-1300 behavior, since
Cochrane is hidden below VH 750 there too.

Excluded from the miniature via `mv-mini-exclude` (rule placed AFTER the
show-all item rule, same specificity, later wins): search, posterwindow,
gutaxis, desk (the >1400-only items) PLUS the short-window hidden set:
helix, db-cochrane, notify, stickers, microscope. The four `m-*` mobile
tiles are hidden via `mv-collage-hide-min-720`, and the `db-*` floats
are shown, so no logo appears twice. Chips and pills are hidden (the
1160px diorama hide plus `hover: none`; the miniature adds no diorama
rule). The old mobile stack block (719px) remains in source but is
fully overridden whenever `mv-hero-mini` is present: section height,
frame width/padding, collage position/display, item
position/max-width/display, float animation, and tilt zeroing are
each beaten specificity-by-specificity (verified). The stack is gone
in effect, not by deletion.

Note (supersedes the old composite note): the tall freeze showed
microscope and stickers despite hide-1300, which is what produced the
microscope word tuck. The short freeze removes that deviation
entirely: microscope is not in the miniature at all, exactly as it is
hidden at 1161-1300 on desktop.

## Scale table

| Phone width | Scale (clientWidth / 1160) | Section height (600 x scale) |
|---|---|---|
| 320 | 0.276 | 165.5px |
| 390 | 0.336 | 201.7px |
| 719 | 0.620 | 371.9px |

Readability at these scales (for orientation, not a QA gate): the word
"daivanlabs." (180px) renders at ~50-111px and stays readable; hero numbers
such as N = 6,601 render at ~11-25px and stay readable; card titles (~13px)
render at ~4-8px and captions (~10px) at ~3-6px, i.e. texture, not text.
Logos stay recognizable by color and shape. This matches the approved
design: the phone hero is a miniature of the desktop layout, decorative
(the collage is `aria-hidden`), while the same information stays readable
in the sections below.

## The 719/720 seam

The miniature is CLASS-gated (`clientWidth < 720`), not media-gated, so the
seam has two paths:

- No scrollbar: miniature iff viewport < 720. At exactly 720 the float
  layout is live (719px block does not apply, 720-740 laptop rules do).
- Classic 15px scrollbar: `clientWidth = viewport - 15`, so miniature iff
  viewport < 735. At viewport 720-734 the miniature is active while CSS
  min-width-720 rules also apply. The miniature wins there by source order
  at equal specificity with `!important` on both sides, verified per tile:
  Scopus (laptop 41%/4.3% vs miniature 62%/19%), Cochrane (laptop
  41%/14.3% vs miniature `display: none` via `mv-mini-exclude`),
  Elsevier (41%/28.6% + `bottom: auto` vs 27%/bottom 5%).
  The 720-740 VH <= 750 PubMed-only state therefore holds on the
  CSS-viewport path (no scrollbar) and is replaced by the miniature on the
  scrollbar path; that is documented seam behavior, not a violation.

Two transients, neither a blocker: (1) at viewport exactly 720 with a
classic scrollbar, the initial state (`innerWidth`, not `< 720`) renders
one frame of float layout before the observer switches to the miniature;
(2) the background grid (`.mv-grid`, a section child outside `.mv-mini`)
is NOT scaled with the miniature, so its 40px tiles stay phone-scale under
the shrunk cards. Faint background only; the cards and word carry the
miniature read.

## QA result for the miniature (short freeze, stage 600)

Full pair scan of the 8 remaining items: 0 overlaps (worst phase,
float + tilt). Binding gaps (rest / tilt-adjusted worst): poster vs
awards 24.2 / 21.4 (thinnest), review vs awards 41.2 / 36.6,
faers vs Elsevier 44.2 / 39.9, docking vs Elsevier 54.2 / 48.3,
review vs Scopus 81.6 / 77.6, awards vs PubMed 80.0 / 78.1,
PubMed vs Elsevier 81.6 / 79.5, docking vs review 158.6 / 150.3.
One non-binding graze: review vs Elsevier has a 0.4px rest x-gap
(-4.4 tilt-adjusted) but the pair is y-separated by 284.5px worst,
so it is clear, not an overlap (a pair overlaps only if both axes
close). Helix-review graze and the microscope word tuck from the
tall freeze are both gone with the excluded items.

Frame/label interactions (accepted tuck class, same as short
desktop): review tucks under the label strip (label paints above,
text readable; x-lens ~143px, same class as the desktop review
tuck below VH ~845); poster tucks ~53px and faers ~29px under the
frame's bottom dashed border (interior transparent, only the 1px
line crosses the cards); docking clears the frame top by ~1px
tilt-adjusted (thin, positive). Scopus clears the label ink in x
by ~50px. Desktop/tablet visibility of the 5 excluded items is
unchanged (no rule definition touched; the marker has exactly one
CSS rule, inside `.mv-hero-mini`): helix visible at desktop
VH > 750; Cochrane visible at desktop VH > 750 (1161-1300) /
VH > 801 (1301-1400); notify visible at desktop and tablet
VH >= 882; stickers visible at tablet/desktop above their gates;
microscope visible at 1301-1400 VH > 800.
