# Laptop logos final QA

Verdict: PASS after re-QA (see addendum below). The first
QA round failed on 2 blockers (B1, B2, both label overlaps
at short viewport heights); both are fixed and re-verified
below. Everything else passed in the first round, including
all mechanism, selector, position-value, corner, and
regression items. No source edits made by QA; the parent
pushes after this re-verification.

Method: every claim verified from source (COLLAGE_ITEMS,
render structure, stylesheet blocks, DbLogoFloat CONFIG,
card component sizes, section geometry). Overlaps
recomputed with a script over widths 720, 740, 741, 768,
820, 1001, 1024, 1160, 1161, 1280, 1301, 1366, 1400 crossed
with heights 650, 700, 751, 800, 850, 900, 1000, 1080, plus
hand-checked extra corners (W 941/960/1000/1023, VH 801/810,
VH 702/705). Model: S = max(550, VH - 100); label top =
(S - blockH)/2 with blockH = 102.4 + 0.95 x font; worst
boxes include float up-only 8px, exact rotated-box tilt
expansion (Elsevier -3deg is the big one), chip drift
(+-20 x, +-14 y), pill float 10px, and 8px parallax on
tile-vs-chip/pill pairs only (parallax cancels
collage-vs-collage). The model reproduces the recorded
1440/S=800 label top (263.5) and frame bottom (536.5)
within 0.2px.

## Item 1, mechanism: PASS

- db-scopus and db-elsevier hideClass contain
  mv-collage-show-laptop with existing classes kept;
  db-cochrane contains mv-collage-show-laptop-cochrane
  AND still contains mv-collage-hide-750.
- Show rules exactly as specified: Scopus/Elsevier split
  (720-740 + min-height 751) and (741-1400, no height
  scope); Cochrane split (720-1300 + min-height 751) and
  (1301-1400 + min-height 801). No other show rule exists.
- hide-1400 and hide-750 definitions untouched (diff);
  DbLogoFloat CONFIG untouched (file not in diff); 719px
  mobile block, hide-min-720, and m- stack entries
  untouched (diff).

## Item 2, selector correctness: PASS

Render: outer wrapper (hideClass) > direct child div
(tiltClass) > Card. `:has(> .mv-tilt-card-c)` matches
exactly Scopus, `:has(> .mv-tilt-card-a)` exactly
Elsevier; no other item carries show-laptop, so no other
card-a/card-c tile can match. Cochrane needs no :has().

## Item 3, position blocks: PASS

Every value in all six bands matches the brief exactly
(see 01-slots.md). Every override uses !important;
Elsevier top rules set bottom:auto in bands 1-3; no
position block sets display.

## Item 4, overlap recomputation: FAIL (2 blockers)

BLOCKER B1, Scopus vs label, band 1161-1300, VH at or
below about 705: at VH 650 the tile covers the full label
height (14.4px vertical x 58-70px horizontal across the
band); at VH 700 the graze is 1.6px; at VH 705 it is
0.03px; at VH 751 the gap is 14.2px. Root cause: at S=550
the slot between Cochrane bottom and label top is 44.7px
but Scopus is 50px tall, so no top% fits there. Note on
the brief's "claimed worst about 10px at stage 660": this
model gives a 17px CLEARANCE at stage 660 (S=660, VH 760);
a 10-13px overlap matches VH about 660 (S=560) instead,
so the claim was likely computed at VH 660 or with a
different label model. Suggested fixes (fixer to verify):
keep top 19% and gate Scopus below VH 706 in 1161-1300,
or move Scopus to about top 17.5% and gate below about
VH 685 (17.5% also improves the StrokeSense-chip gap
from 4.1px to about 12px at 1161x650).

BLOCKER B2, Elsevier vs label, band 741-1000, W above
about 905 at VH 650: worst 7.3px vertical x 51px
horizontal at 1000x650 (4.2px at 960x650, 2.8px at
941x650). Clear at VH 700 (gap 8.4px at W=1000) and at
W <= 905 at VH 650. Suggested fix (fixer to verify):
move Elsevier in 741-1000 from top 18.6% to about top
16.5% (worst-corner margins become about 5.5px to Scopus
above and 4.3px to label below at 1000x650; all other
bands unaffected).

HAIRLINE H1 (not a standalone blocker): Cochrane vs
Elsevier, band 720-740, VH 751-753 only: 0.3px vertical
graze, gone by VH 754. Sub-pixel and transient; parent
may accept it or nudge Elsevier 28.6% to 28.8%.

HAIRLINE PASS H2: Cochrane vs FAERS chip, band
1301-1400, VH 801: rest gap 9.2px, worst-case gap 0.5px
with parallax + tilt + drift extremes combined (1.9px at
VH 810). Positive, but eyeball it live.

All other pairs clear across the grid. Thinnest
non-hairline clearances: Cochrane-docking 5.0px at
1301x850; Cochrane-Elsevier x-gap 4.0px at 1001x751;
Scopus-Cochrane 5.6px at 720x751; Elsevier-label 1.2px
at 720x751 (band 1 stack vs label: PASS, thin);
Elsevier-docking 9.0px at 1001x650; Scopus-docking
10.0px at 1001x650.

## Item 5, corners: PASS

- 720-740 at VH 750 or below: only PubMed shows (show
  rules need min-height 751; hide-750 hides Cochrane).
- Cochrane hidden at VH 750 or below at every laptop
  width (hide-750 + show rules need 751+).
- Cochrane hidden at VH 751-800 in 1301-1400 only
  (720-1300 show rule needs 751+; 1301-1400 needs 801+).
- Scopus/Elsevier visible at 741-1400 at all heights
  and at 720-740 at VH 751+.

## Item 6, no regressions: PASS

- Above 1400px: show/position blocks are all max-width
  1400 scoped, so behavior is identical (inline slots;
  Cochrane still hide-750 gated).
- Below 720px: mobile stack unchanged in order and
  membership (PubMed, FaersCard, Elsevier, NotifyBubble,
  Scopus, Cochrane).
- De-overlap intact: faers 2%, notify 28%, stroke 2%,
  awards 27%, all height gates (850/950/800/1090),
  chip anchors (FAERS 0.195/0.30, StrokeSense 0.55/0.33,
  Code for Cure 0.30/0.695, Seoul 0.80/0.695), Seoul pill
  59%/32%, FAERS pill gate 1090.
- `npm run build` PASS. Dist bundle 0 dialkit strings.
  Em dash 0 in Hero.tsx and new docs. `sciencedirect`
  0 and `DbLogoRow` 0 in src/. Only Hero.tsx changed,
  so no FAERS data file changed. Masked check (all
  non-verified rows in docs/faers-verified.json, values
  as standalone numbers, counts only): 22 src hits +
  13 dist hits, all coincidental style/animation
  literals (rgba, letterSpacing, opacity, grid ticks).
  No leak.

## Item 7, pre-existing review-vs-label: PASS, not worsened

Review and label are untouched, so the pre-existing
review-vs-label overlap (up to about 14px rest at
1024-1160 short stages) is byte-identical. Tiles are
x-separated from that pair's region (closest: Elsevier
ends 35px short of it at W=1024). Note: B1/B2 above are
NEW tile-vs-label overlaps, distinct from this pair.

## Live checks still owed after deploy (and after B1/B2 fixes)

- 1366x768 laptop (browser chrome leaves VH about
  680: B1 region, Scopus vs label) and 1280x800.
- 1024 tablet and 768 tablet (tablet bands, review gap).
- 720-740 narrow widths at VH 751-754 (H1 hairline) and
  VH 751 Elsevier-label 1.2px gap.
- 1000x650 window (B2 region) and 1301-1400 at VH 801
  (H2 hairline, Cochrane vs FAERS chip over a full drift
  cycle with mouse at stage edges).
- Confirmation the deployed preview matches the new commit.

## Addendum: re-QA verdict PASS

Re-verified from source (no fixer claims trusted). Worst-
phase model: float up-only 8px, exact rotated-box tilt
expansion, chip drift, pill float, parallax only vs
chip/pill pairs (parallax lives on the .mv-collage layer
only, so tile-vs-label gaps do not move under parallax;
this matches the first round's validated label model).

B1 FIXED: Scopus in 1161-1300 moved 19% to 17.5%, plus a
display gate hiding only Scopus in 1161-1300 at max-height
686px (3-class :has(card-c) selector beats the 2-class
show-rule, matches only Scopus, width-scoped so other
bands and above-1400 are untouched). Worst-phase gaps,
all positive and growing: Scopus-vs-label +3.2px at VH 687
(first shown height), +7.4 at VH 700, +24.0 at VH 751,
+39.9 at VH 800; Cochrane-above +9.4 at VH 751 (first
Cochrane appearance); StrokeSense-chip-below +18.1 at
VH 687. X-overlaps confirmed at widths 1161 and 1300, so
the y-gaps decide everywhere.

B2 FIXED: Elsevier in 741-1000 moved 18.6% to 16.5%.
Worst-phase gaps, all positive at every combination of
widths 741/905/960/1000 and heights 650/700: vs Scopus
above +5.5 at VH 650, +11.6 at VH 700; vs label below
+46.6/+11.8/+7.6/+4.5 at VH 650 (widths ascending),
+63.3/+28.5/+24.3/+21.3 at VH 700.

STROKE CARD REMOVED (user request, done by parent):
zero `id: "stroke"` entries and zero StrokeCard references
in Hero.tsx, zero StrokeCard imports anywhere in src/
(the component file itself remains on disk unimported).
The bottom-right hero area no longer renders that card;
mobile stack membership and order unchanged; all other
sections unaffected. Note: the de-overlap stroke position
(bottom 2%) is superseded by this deletion by design.
The StrokeSense cursor chip and pill are untouched (the
request covered only the card).

NO REGRESSIONS on re-QA: full laptop-logo mechanism
intact (markers, all four show-rules, all six band
position blocks, Cochrane height gates, FAERS pill gate
1090, de-overlap positions/gates/chip anchors/pills,
Seoul pill 59%/32%); build PASS; dist dialkit 0; em dash
0 in Hero.tsx and new docs; sciencedirect/DbLogoRow 0 in
src/; FAERS masked check clean (28 src + 8 dist hits,
all coincidental style/animation literals, counts only).
Accepted hairlines unchanged: 720-740 Cochrane-vs-
Elsevier 0.3px sub-pixel graze at VH 751-753 only;
1301-1400 Cochrane-vs-FAERS-chip rest 8.6px, worst
0.6px positive at VH 801 (live-check only).

Live checks still owed after deploy: 1366x768 laptop
(VH about 680 after browser chrome: Scopus gated hidden
in 1161-1300 only if the window narrows into that band;
at full 1366 width the 1301-1400 slots apply), 1280x800,
1024/768 tablets, 720-740 at VH 751-754 (H1), 1000x650
(B2 region, now fixed), 1301-1400 at VH 801 (H2 over a
full chip drift cycle), and confirmation the deployed
preview matches the new commit.
