# De-overlap integration: what changed in Hero.tsx

Only `src/sections/Hero.tsx` changed (101 insertions, 16 deletions).
No other source file, no data file, no asset changed. All line
numbers below are post-fix.

## 1. Static collage moves (COLLAGE_ITEMS)

| Item | Before | After | Effect |
|---|---|---|---|
| faers | bottom 4% | bottom 2% | Sits 0.02S lower; notify/faers rest gap becomes 0.26S - 168 |
| notify | bottom 25% | bottom 28% | Lifts the bubble off FaersCard (see QA doc) |
| stroke | bottom 5% | bottom 2% | Sits 0.03S lower; posterwindow/stroke rest gap becomes 0.87S - 463 (true heights) |
| awards | right 25% | right 27% | awards/stroke x-gap at 1180 goes 2.3px to 25.9px |
| review | right 29% base | base 29% intact, plus `mv-collage-review` hook | The 31% override below applies at tablet only |
| helix | hide-short (700px) | hide-750 (750px) | Closes the VH 701-750 glyph-overlap window |
| microscope | hide-1300 only | + hide-microscope-800 | Hidden at VH 800 and below (min-width 720px scoped) |
| stickers | hide-1300 only | + hide-stickers-950 | Hidden at VH 950 and below (min-width 720px scoped) |
| notify | hide-720-1160 only | + hide-notify-850 | Hidden at VH 850 and below (min-width 720px scoped) |

No other COLLAGE_ITEMS entry moved. Desktop logo tiles
(db-pubmed, db-elsevier, db-scopus, db-cochrane) are untouched;
tablet visible sets are unchanged (the new height gates are moot
at tablet widths, where notify/stickers/microscope already hide
by width rules).

## 2. Width-scoped review override

`@media (max-width: 1160px) { .mv-collage-review { right: 31%
!important; } }`. Base inline right stays 29%, so desktop keeps
its 18.6px review/search gap at 1440px. At tablet 1024px the
tilt-adjusted review/poster gap goes 6px to about 26px; at
1160px, 42px to about 65px. Below 720px review is display:none
via mobile-hide, so the override cannot leak into the mobile
stack.

## 3. Height gates (all min-width 720px scoped)

- `@media (min-width: 720px) and (max-height: 850px)` hides
  notify. The mobile stack is untouched: without the 720px
  scope, short phones would lose NotifyBubble from the stack.
- `@media (min-width: 720px) and (max-height: 950px)` hides
  stickers. Above 950px the stickers gaps are wide (53.2px
  rest to microscope at stage 980).
- `@media (min-width: 720px) and (max-height: 800px)` hides
  microscope. This kills the residual docking/microscope
  worst-phase graze (about 6px) that otherwise survives at
  VH 768.
- `@media (min-width: 720px) and (max-height: 1090px)` hides
  the FAERS pill (class `mv-diorama-pill-faers`, new `cls`
  field on FACT_PILLS plus a template className in the pill
  render). Above 1090px only sub-3px float transients remain
  (see QA doc).

## 4. Cursor chips (CURSOR_CHIPS constants only, no logic change)

| Chip | Before (x, y, r) | After (x, y, r) |
|---|---|---|
| FAERS | 0.04, 0.16, 40 | 0.195, 0.30, 20 |
| StrokeSense | 0.96, 0.20, 56 | 0.55, 0.33, 20 |
| Code for Cure | 0.05, 0.82, 32 | 0.30, 0.695, 20 |
| Seoul 2026 | 0.95, 0.76, 48 | 0.80, 0.695, 20 |

Chips move from on-card anchors into the two frame-adjacent
empty lanes. The rAF drift formula, durations, phases,
converge behavior, and the hover:none / reduced-motion gates
are untouched. New rule: `.mv-diorama { display: none; }` at
max-width 1160px, so mouse/trackpad tablets no longer show
chips resting on cards; touch devices already hid the layer
via hover:none.

## 5. Fact pills (FACT_PILLS constants only)

- "Hypertension Seoul 2026": top 30% / right 10% to left 59% /
  top 32%. It now sits right of the centered label instead of
  on PosterWindow.
- "FAERS N = 6,601": top 64% to top 62%, plus the 1090px
  height gate above.
- "Code for Cure" (bottom 30% / right 14%): UNCHANGED.

## 6. Mobile stack (719px block only)

- `.mv-collage` gap 16px to 24px: clears every shadow tail
  (longest tail was NotifyBubble, about 10px into the gap).
- `.mv-collage` margin-top 16px: the frame-to-first-tile
  joint goes from 0px to 16px, giving the 5px handle
  protrusion full clearance.
- Stack order, membership, and all widths are unchanged:
  PubMed, FaersCard, Elsevier, NotifyBubble, Scopus,
  Cochrane. Mobile word/frame rules are untouched.

## 7. What did NOT change (verified from the diff)

- No card component, no data file, no asset, no other
  section, no router, no global stylesheet.
- No COLLAGE_ITEMS entry besides the nine listed above.
- No change to the parallax code (still plus/minus 8px),
  the float keyframes (0 to -8px), or the tilt classes.
- The hide-short rule definition still exists in the
  stylesheet but nothing carries it anymore; helix now
  uses hide-750.
