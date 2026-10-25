# Rearrangement: landed positions (QA-verified from source)

Base: commit `0bb5b16`. Only file changed: `src/sections/Hero.tsx`
(213-line diff: 178 insertions, 35 deletions). No other file touched.
Deletions verified: poster line (marker added back), old 1161-1300 logo
slots (40% / 17.5%), old 1301-1400 Scopus slot (36%), the B1 gate block,
old chip-anchor lines (replaced by companion-aware code). No hide rule,
show-rule, gate, or mobile-stack line was deleted.

## Review card (marker `mv-collage-review`, tilt card-b +2deg, 220x209)

| Width band | Position | Scope |
|---|---|---|
| 1161-1400 | left 36%, top 2% (`right: auto`) | all heights |
| 1024-1160 | left 44%, top 2% (`right: auto`) | only VH >= 850px |
| 1001-1023 | right 31%, top 3% (old fallback) | all heights (no band claims this strip) |
| 1024-1160, VH < 850 | right 31%, top 3% (old fallback) | fallback |
| Above 1400 | right 29%, top 3% (inline, unchanged) | all heights |
| At/below 1000 | hidden (`hide-1000`) | unchanged |
| Below 720 | hidden (`mobile-hide`) | unchanged |

The 31% override rule (`@media (max-width: 1160px)`) stays as fallback.

## Poster card (marker `mv-collage-poster`, tilt card-c -1deg, 260x204)

| Width band | Position | Scope |
|---|---|---|
| 1161-1400 | right 2.5%, bottom 2% | all heights |
| 1024-1160 | right 2.5%, bottom 2% | only VH >= 810px |
| 720-1000 | right 2.5%, bottom 2% | only VH >= 790px |
| 1001-1023 | right 2.5%, top 2% (old top-right) | all heights (no band claims this strip) |
| Below-threshold cases in 720-1160 | right 2.5%, top 2% (old top-right) | fallback |
| Above 1400 | hidden (`hide-min-1400` intact) | unchanged |
| Below 720 | hidden (`mobile-hide`), NOT a stack member | unchanged |

1001-1023 strip coherence (verified by model): review-old (right 31%)
plus poster-old (top-right) plus logos Scopus 27%/4.3%, Cochrane
38%/4.3%, Elsevier 27%/18.6% — gaps: review-cochrane 17.02px,
review-scopus 96.41px, poster-review 19.94px, poster-cochrane 264.12px.
The strip keeps the old layout for BOTH cards coherently.

## Logo tiles (tilt: Scopus card-c -1deg 100x50, Cochrane card-d +1deg 69x82, Elsevier card-a -3deg 104x50)

| Width band | Scopus | Cochrane | Elsevier | PubMed |
|---|---|---|---|---|
| 1161-1300 | left 62%, top 19% | left 62%, top 2% | left 27%, bottom 5% | left 43%, bottom 5% (unchanged) |
| 1301-1400 | left 62%, top 2% | left 21%, top 15% (only VH >= 801px; inline 20%/15% fallback below) | left 30%, bottom 5% | unchanged |
| 1024-1160 | left 28%, top 3% (unchanged) | left 28%, top 15% (unchanged) | left 30%, bottom 5% (unchanged) | unchanged |
| 1001-1023 | left 27%, top 4.3% (unchanged) | left 38%, top 4.3% (unchanged) | left 27%, top 18.6% (unchanged) | unchanged |
| 741-1000 | left 36%, top 4.3% (unchanged) | left 51%, top 4.3% (unchanged) | left 36%, top 16.5% (unchanged) | unchanged |
| 720-740 | left 41%, top 4.3% (only VH >= 751px) | left 41%, top 14.3% (only VH >= 751px) | left 41%, top 28.6% (only VH >= 751px) | unchanged |
| Above 1400 | left 20%, top 3% (inline, unchanged) | left 20%, top 15% (inline, unchanged) | left 70%, bottom 5% (inline, unchanged) | unchanged |

B1 gate DELETED: no rule hides Scopus in 1161-1300 anymore (verified:
0 occurrences of `686px` in Hero.tsx). Scopus is visible at ALL heights
in 1161-1300. Show-rules UNCHANGED: Scopus/Elsevier (720-740 + VH >=
751) and (741-1400); Cochrane (720-1300 + VH >= 751) and (1301-1400 +
VH >= 801). Cochrane keeps `hide-750` (hidden at VH <= 750 everywhere);
when Cochrane hides, Scopus stays at its stack/solo position (no
upward collapse).

## Companions (all scoped to widths 1161-1400 ONLY)

| Item | Original | In-band (1161-1400) | Above 1400 | Mechanism |
|---|---|---|---|---|
| StrokeSense chip (115x21) | anchorY 0.33, CSS top 33% | anchorY 0.45, CSS top 45% | 0.33 / 33% (reverts) | `window.innerWidth > 1160 && <= 1400` check in rAF tick (drift AND converge) + CSS `data-chip="StrokeSense"` rule |
| Seoul 2026 chip (108x21) | anchorX 0.80, CSS right 20% | anchorX 0.70, CSS right 30% | 0.80 / 20% (reverts) | `matchMedia("(min-width: 1161px) and (max-width: 1400px)")` in rAF tick (drift AND converge) + CSS `data-chip="Seoul 2026"` rule |
| Code for Cure pill (114x25) | bottom 30%, right 14% | bottom 45% | 30% (reverts) | CSS `mv-diorama-pill-cfc` override, band-scoped |
| Seoul pill (184x25, in-source comment implies 191) | left 59%, top 32% | unchanged | unchanged | - |
| FAERS pill | top 62%, left 7% | unchanged | unchanged | gated hidden at VH <= 1090 (whole QA grid) |

Original anchors UNCHANGED in source: FAERS (0.195, 0.30), StrokeSense
(0.55, 0.33), Code for Cure (0.30, 0.695), Seoul 2026 (0.80, 0.695),
radius 20 for all. Diorama hidden at/below 1160px untouched.

## JS/CSS band-check agreement (scrollbar edges)

- Seoul: JS uses `matchMedia` with the IDENTICAL query string as its CSS
  block, so JS and CSS agree exactly (same media-query evaluation,
  scrollbar included). `.matches` is read per tick, so it is live.
- StrokeSense: JS uses `window.innerWidth` (includes a classic
  scrollbar) while CSS media width excludes it. The two disagree in
  the innerWidth window (1400, 1400+scrollbarWidth] (typically
  1401-1415px on classic-scrollbar systems; no window on
  overlay-scrollbar systems). The low-edge window is MOOT (diorama
  hidden at CSS <= 1160px). In the high-edge window: CSS base top is
  45% but JS anchor stays 0.33. Drift is UNAFFECTED (drift = base +
  small offsets, base 45% is the intended laptop position). Converge
  parking is offset by 0.12S vertically during word hover ONLY
  (final top = intended border point + 0.12S). Checked parking cases:
  no card overlap in any case (top-edge park at S=550: chip top
  ~248 vs review-new bottom ~224, clear by ~24px; bottom-edge park:
  chip x stays center, clear of poster-new/faers/awards).
  Classification: minor
  hover-only visual offset in a ~15px viewport window on
  classic-scrollbar systems only. NOT a blocker.
- Code for Cure pill: CSS only, no JS, so no mismatch possible.
- Above 1400, all three companions revert: Seoul 0.70 would hit the
  desk card there (x-overlap at 1440, y-overlap below VH ~947), so the
  <=1400 scope is load-bearing and verified intact.

## Above 1400 and mobile: unchanged

- Every rearrangement block is scoped to max-width 1400px or narrower;
  every JS band check excludes > 1400. Above-1400 layout (review-old
  right 29%, search 36%/2%, posterwindow 2.5%/11%, desk 53%/bottom 3%,
  gutaxis 25%/bottom 3%, inline logo slots) is untouched.
- Mobile (< 720px): 719px block has 0 diff lines; mobile-hide classes
  untouched; stack order unchanged (PubMed, FaersCard, Elsevier,
  NotifyBubble, Scopus, Cochrane); review/poster carry mobile-hide and
  are not stack members.
