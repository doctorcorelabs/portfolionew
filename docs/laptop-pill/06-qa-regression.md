# 06 - QA regression: laptop CFC pill bottom 45% -> 74%

Base: HEAD `d05a71c` + fixer diff, uncommitted. Method: diff + grep
only, no trust in 04-fix.md numbers. Verdict: **SHIP** (no conditions;
jump growth + Seoul-width sensitivity are disclosed by synthesis and
belong to layout/motion QA, not regression blockers).

## 1. Diff scope: Hero.tsx only, one value + three comments

| Check | Result |
|---|---|
| Files changed | `src/sections/Hero.tsx` only (`git diff --name-only`) |
| Stat | 15 insertions / 10 deletions, 2 hunks (`@@ -1424`, `@@ -1492`) |
| Value changed | Exactly one: laptop rule `bottom: 45% !important` -> `bottom: 74% !important` (line 1510) |
| Comment rewrites | Exactly three: rearrangement comment (1427, "30% to 74% below"); laptop rule comment (1496-1507, poster rationale -> above-glyph-band window); wide rule comment (1514, "laptop (bottom 74%)") |
| Rule deletions | 0 (all 10 deletions are comment lines or the one value line) |
| Scope changes | 0 (laptop media query line is diff context, unchanged) |
| Selector changes | 0 (class stays `.mv-diorama-pill-cfc`) |
| Em / en dash in diff | 0 / 0 |

Deletions reconcile: 1 (rearrangement comment) + 7 (old laptop
comment block) + 1 (value) + 1 (wide comment) = 10. Insertions:
1 + 12 (new laptop comment) + 1 (value) + 1 (wide comment) = 15.

## 2. Wide, tablet, inline: byte-identical

| Rule | Verified present, outside diff hunks |
|---|---|
| Wide (1401px+) | Lines 1516-1520: `bottom: 15% !important; right: 5% !important` |
| Tablet 768-1000 | Lines 1610-1612: `right: 40% !important` |
| Tablet 1024-1160 | Lines 1625-1627: `right: 30% !important` |
| FACT_PILLS inline | Line 225: `bottom: "30%", right: "14%"` |

No wide/tablet/inline line appears in either diff hunk.

## 3. No pill-45% citation remains

`grep "45%"` returns exactly three hits, all StrokeSense chip,
all outside the diff, all untouched:

| Line | Site |
|---|---|
| 1390 | Comment: "anchorX companion, right 45%, in the same band" |
| 1401 | Comment: "chip's base right to 45% in 1161-1400px" |
| 1413 | Rule: `right: 45% !important` (StrokeSense chip companion) |

`grep "74%"` returns exactly the five expected sites: 1427
(rearrangement comment), 1496/1499 (laptop comment), 1510 (rule),
1514 (wide comment). No stray 74% anywhere.

## 4. Everything else untouched by grep

Diff hunks touch only lines 1424-1520 (pill comments + one value).
All of the following sit outside the hunks and are byte-identical:

- Loop: `CURSOR_CHIPS` (98-110, durations 12/14/11/15, phases
  0/0.3/0.55/0.8, anchors FAERS 0.90/0.90, SS 0.505/0.70, CFC
  0.30/0.695, Seoul 0.80/0.695); `laptopMql` companions (637-650);
  converge halo 20px / tau 0.22s (556); `TABLET_ANCHORS` (133);
  `MINI_CURSOR_CHIPS` (172, 744); chip CSS companions Seoul
  (1472) and FAERS (1490) sit just above the hunk start, untouched.
- H-bands: H3/H4/H6 are `[data-chip]` rules; pills carry no
  `data-chip`, and no H-band line is in the diff. H3 stands (its
  park is chip-vs-card, both unmoved).
- Other pills: Seoul pill line 219 (`left: "59%", top: "32%"`);
  FAERS pill line 232 (`top: "62%", left: "7%"`); both outside diff.
- Gates: helix/microscope/stickers/notify/Cochrane/FAERS-pill
  thresholds live on other elements/classes, none in the diff.
- Miniature/tablet lanes: no line in the diff; a 1161+ rule cannot
  match below 720, and pills hide below 900px anyway.
- No rule outside 1161-1400 changed: the only non-comment change
  is inside the 1161-1400 media query block itself.

## 5. Hide rules + seam + jump

| Item | Verified |
|---|---|
| Touch hide | `@media (hover: none)` line 1009, outside diff |
| 900px hide | `@media (max-width: 900px)` line 1026, outside diff |
| Strip hides | Line 1674: `(min-width: 720px) and (max-width: 767px), (min-width: 1001px) and (max-width: 1023px)`, outside diff |
| Reduced-motion hide | Block ~1741: `.mv-diorama-pill-cfc/.mv-diorama-pill-faers/.mv-diorama-pill { display: none }`, outside diff |
| Seam | Laptop scope ends `max-width: 1400px` (rule line 1508, context); wide starts `min-width: 1401px` (1516). Adjacent, no gap, no overlap |
| Jump (new) | Vertical (74-15)% = 0.59S down: 324px @550, 767px @1300. Horizontal (14-5)% = 0.09W right: 126px @1400, unchanged (right stays 14%) |

The jump roughly doubles vertically vs the old 0.30S (165px @550).
Same class as chip companion jumps (FAERS chip jump is 0.86S,
larger still), but larger than before: disclosed, not hidden.

## 6. Reduced-motion story

Pills hide under reduced motion (block ~1741, intact), so the
position change has ZERO reduced-motion impact. No H-band change
is needed or was made. The new rule is position-only (`bottom`
+ `!important`); it carries no `display`, no animation, no
transition, so it cannot disturb any hide/show mechanism.

## Verdict: SHIP

All six regression checks pass with zero exceptions. The diff is
exactly what synthesis specified: one number + three comments,
nothing else. Live-preview items for the parent (not regression):
laptop 1161x550-650, 1400/1401 jump, FAERS hover transit at
laptop widths, tablet + phone spot-check.
