# 01 - Phone miniature (zoom-out hero, below 720px)

Base: `cbfeb35`. All changes in `src/sections/Hero.tsx` only. No push yet.

## Mechanism

The phone hero is NOT a scaled screenshot and NOT the old vertical stack. It is
the real collage, rendered on a frozen 1160x980 design stage and shrunk with a
CSS transform to the phone width.

- JS: `MINI_STAGE_W = 1160`, `MINI_STAGE_H = 980`. `miniScale` state is
  `section.clientWidth / 1160` while `clientWidth < 720`, else `null`.
  A `ResizeObserver` on the section re-measures on mount and every resize and
  disconnects on cleanup. Initial state comes from `window.innerWidth`
  (`innerWidth < 720` only), so the first frame is already miniature on phones.
- Section: class `mv-hero-mini` when `miniScale !== null`, plus inline custom
  property `--mv-mini-h = (980 x miniScale).toFixed(1)px`. The miniature
  section rule sets `height` and `min-height` to `var(--mv-mini-h) !important`,
  `padding: 0 !important`, `display: block !important`, beating the base
  section style and the 719px block.
- Wrapper: a `<div class="mv-mini">` wraps label + frame + collage. At
  desktop/tablet it is `display: contents` (layout-neutral; no child-selector
  depends on section direct children, verified by grep). In miniature it
  becomes a positioned 1160x980 flex stage (`padding: 80px 24px`,
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

## Frozen state (1160x980, equiv. VH 1080, all gates open)

Anchors are the shipped 1161-1400 tall-stage anchors, frozen, independent of
the phone's real viewport height:

| Item | Frozen anchor |
|---|---|
| docking | left 2.5%, top 3% |
| helix | left 27%, top 2% |
| review | left 36%, top 2% (`right: auto`) |
| poster | right 2.5%, bottom 2% (`top: auto`) |
| faers | left 2.5%, bottom 2% |
| awards | right 27%, bottom 4% |
| notify | left 2.5%, bottom 28% |
| stickers | left 2.5%, top 32% |
| microscope | left 2.5%, bottom 39% |
| db-pubmed | left 43%, bottom 5% |
| db-elsevier | left 27%, bottom 5% |
| db-scopus | left 62%, top 19% |
| db-cochrane | left 62%, top 2% |

Excluded from the miniature via `mv-mini-exclude` (rule placed AFTER the
show-all item rule, same specificity, later wins): search, posterwindow,
gutaxis, desk (the >1400-only items). The four `m-*` mobile tiles are hidden
via `mv-collage-hide-min-720`, and the `db-*` floats are shown, so no logo
appears twice. Chips and pills are hidden (the 1160px diorama hide plus
`hover: none`; the miniature adds no diorama rule). The old mobile stack
block (719px) remains in source but is fully overridden whenever
`mv-hero-mini` is present: section height, frame width/padding, collage
position/display, item position/max-width/display, float animation, and
tilt zeroing are each beaten specificity-by-specificity (verified). The
stack is gone in effect, not by deletion.

Note: the frozen state is a composite, not a literal 1161-1300 freeze.
Microscope and stickers are hidden at 1161-1300 on desktop (hide-1300) and
shown at 1301-1400; the miniature shows them at all phone widths because
the miniature item rule beats hide-1300. That is the briefed "all gates
open" state, and it is what produces the microscope word tuck (see QA doc).

## Scale table

| Phone width | Scale (clientWidth / 1160) | Section height (980 x scale) |
|---|---|---|
| 320 | 0.276 | 270.4px |
| 390 | 0.336 | 329.5px |
| 719 | 0.620 | 607.6px |

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
  Scopus (laptop 41%/4.3% vs miniature 62%/19%), Cochrane (41%/14.3% vs
  62%/2%), Elsevier (41%/28.6% + `bottom: auto` vs 27%/bottom 5%).
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

## QA result for the miniature

Full pair scan of the frozen stage: 0 overlaps (worst phase, float only).
Claimed gaps reproduce (rest / tilt-adjusted): review-stack 81.6 / 77.5,
awards-poster 24.2 / 21.4, faers-Elsevier 44.2 / 40.1, notify-faers 84.8 /
69.9 rest (61.9 float-worst; 51.9 even with the corrected 180px faers
height, still wide). Helix-review box graze: 4.4 rest / 0.82 tilt-adjusted,
ink gap 24.4 rest / 20.8 tilt-adjusted, same accepted class as desktop.
Microscope word tuck: see 03-final-qa.md (extent ~50% ink overlap, the
miniature's largest visual deviation, flagged for a parent decision).
