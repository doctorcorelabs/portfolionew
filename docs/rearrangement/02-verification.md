# Rearrangement: verification (model from source, QA round)

Model: stage S = max(550, VH-100); widths 720/768/1001/1024/1161/1280/
1300/1301/1366/1400/1440/1920 crossed with VH 650-1080 (plus boundary
heights 687/744/750/751/775/790/800/801/810/844/850/880/890/967/1010/
1090). Boxes are tilt-expanded bboxes. Overlap requires BOTH axes to
close: if one axis already overlaps, only the other axis's gap matters;
if neither overlaps, both gaps must be closable by relative motion.

## Motion rules (corrected vs earlier rounds)

- Parallax moves the WHOLE collage layer as one unit: it CANCELS
  collage-vs-collage (relative motion = independent float phases only,
  max 8px vertically, 0 horizontally). Earlier rounds' col-col worst
  figures that added parallax (24px) were conservative, not wrong in
  the safe direction for every pair; this round uses 8px.
- Collage vs chip/pill/static: collage moves [-16, +8] vertically
  (float up-only 8 + parallax +-8) and +-8 horizontally vs the other
  layer. Pill float is up-only 10px. Chip drift boxes already include
  +-20px x / +-14px y, so chip motion beyond the box is 0.
- Static layers (label, frame, glyphs) do not move.

## Component sizes used (re-measured from source)

Review 220x209, poster 260x204, awards 168x124, posterwindow 280x356,
faers 240x168, docking 230x184, desk 220x198, helix 100x250 (no tilt),
PubMed 100x50, Elsevier 104x50, Scopus 100x50, Cochrane 69x82.
Tilts: card-a -3deg, card-b +2deg, card-c -1deg, card-d +1deg,
window-a 0deg, window-b +1deg, sticker-b +4deg. Chips (drift boxes):
FAERS 73x21, StrokeSense 115x21, Code for Cure 130x21, Seoul 108x21.
Pills: Seoul 184x25 (in-source comment implies 191; see note),
Code for Cure 114x25, FAERS 114x25 (gated out of the whole grid).
Estimates (do not bind any verdict): gutaxis 230x174, search 260x233,
notify 200x50, stickers 371x30, microscope 210x190.
Label: 12px mono, ink width ~171px centered (box 180px used as
conservative bound in prior rounds; this round reports ink).
Frame: width min(1160, W-48), centered. Word font: 72px at W <= 903,
16vw at 904-1125, 180px above; label top = S/2 - (51.2 + 0.475*font).

## Claimed thinnest margins: recomputed

| Pair | Claimed | Recomputed | Verdict |
|---|---|---|---|
| Review vs StrokeSense chip 0.45, VH 650, 1161-1400 | +1.7 | worst +1.72 (rest 9.72; gap = 0.43S - 234.78) | CONFIRMED (binding case VH 650; +14.62 at VH 680, +44.72 at VH 750) |
| Review vs helix box, 1161 | +0.9 box / ~25 ink | box worst +0.91 (x-decided, col-col x-motion 0) | CONFIRMED (ink gap larger: helix box mostly empty) |
| Tablet review vs label, VH 850 | +10.4 at 1024, +2.7 at 1160 | worst +10.20 at 1024, +2.52 at 1160 | CONFIRMED (diff <= 0.2px rounding) |
| Stack Cochrane-Scopus, VH 650 / 680 | 2.0 / 7.1 worst | ARITHMETIC confirmed (2.03 / 7.13 at S=550/580) BUT Cochrane is hidden at VH <= 750 (hide-750), so both cells are moot | MOOT, not a blocker: first rendered case VH 751 gives worst +19.20 |
| Scopus vs Seoul pill, VH 650 / 680 | 2.6 / 6.5 | worst +2.63 / +6.53 | CONFIRMED |
| Cochrane vs Seoul chip, W=1161 | 3.3 | y-clear by 375.90 rest (pair is y-separated by a wide margin) | DOES NOT REPRODUCE: stale arithmetic (3.3px reproduces exactly with the PRE-companion 0.80 anchor: drift left 800.8 - Cochrane right 789.5 = 11.3 rest, minus parallax 8 = 3.3). Under landed 0.70 anchor the pair is clear by ~376px. NOT a blocker, NOT a live overlap. |
| 1301-1400 Scopus vs Seoul chip, VH 801 | 13.8 | y-clear by 408.31 rest | DOES NOT REPRODUCE as stated (no geometry ties 13.8 to this pair; y-gap is 408px). Pair is clear by a wide margin. NOT a blocker. |
| Poster vs Seoul chip 0.70, 1161 | 33.3 | worst +29.51 (x-decided; rest 37.51) | CONFIRMED within ~4px (tilt/parallax accounting). PASS either way. |
| Poster vs CFC pill 45%, S=550 | 16.5 | worst +14.25 (rest 30.25) | CONFIRMED within ~2px (fixer used poster height ~202; source sum is 204). PASS. |
| Poster vs awards, 1161 | 20.4 | worst +21.62 (x-decided) | CONFIRMED within ~1.2px. PASS. |

No claimed margin recomputes negative. No rearrangement-band pair
(1161-1400 all heights, 1024-1160 gated, 720-1000 gated, 1001-1023
strip) has a true overlap.

## Full pair grid result

Grid: every moved item (review, poster, cochrane, scopus) vs every
visible neighbor (all collage items, all 4 chips with in-band AND
above-1400 anchors, all 3 pills, label ink, frame, glyphs) at every
width/height cell. Result: ZERO true overlaps in any rearrangement
band. All 47 flagged cells are pre-existing in UNCHANGED bands (see
"Pre-existing findings" below) plus tuck-class cells (label/frame/
glyphs, paints-above layer, listed under residuals).

Other thin-but-clear pairs (positive, noted for the record):
- Scopus vs helix box above 1400 at 1440/VH 751: worst +0.37 x
  (pre-existing; window W 1401-1435 for box contact, ink clear by
  ~10px+; same class as the accepted stickers/helix box graze).
- Cochrane vs label ink at 1301/VH 751 (fallback slot): worst +0.55 y
  (pre-existing fallback geometry; positive).
- Review vs microscope at 1301/VH 801: y-margin worst +1.00 but
  x-separated by ~225px, so not load-bearing.
- Scopus vs posterwindow at 1440/VH 850: y-margin worst +1.13 but
  x-separated by ~736px, not load-bearing.
- Cochrane vs faers at 1400/VH 751: x-margin worst +1.43 but
  y-separated by ~290px, not load-bearing.
- Review vs elsevier at 1280/VH 650: x-margin worst +6.38, y-separated.
- Review vs search above 1400: worst +18.41 x (status quo; prior
  rounds: 18.6).
- 768 cochrane-elsevier (741-1000 band): x-margin +9.25, y-gap 0.12
  rest (thin in y, x-protected; pre-existing laptop-logos band).

## Disclosed residuals (confirmed extents, do not fail alone)

1. Review label tuck (1161-1400, 36% slot): rest overlap below S=728
   (VH 828); worst-phase overlap below S=745 (VH 845). X-lens (ink)
   146.74px at 1161. Depth: full label height 14.40px at S=550;
   13.48px at VH 800; 8.68px at VH 810; clear at VH 850 (worst +2.52).
   Tuck class (label z 1 paints above the card, text stays readable).
   Pre-existing in class at the old slot (x-lens 66px), widened by the
   move (x-lens ~147px ink, ~154px box).
2. Converge hover-transient: converged StrokeSense chip (top-edge
   park) overlaps review-new below VH ~737 (S=637: gap +0.18px;
   S=636: overlap 0.30px). At VH 650: full chip 115x21 over review;
   at VH 700: 115x17.6. Hover-only; drift is clean (worst +1.72 at
   VH 650). Converged CFC/Seoul (bottom-edge park) clear of
   poster-new in x at all heights; converged FAERS (top-edge park
   when above the word rect) clear of review/label in x.
3. Seoul chip 0.70 vs awards graze (widened companion side effect):
   x-lens 148px at 1161 (full chip width inside awards x-span).
   Rest overlap for S < 605.5 (VH < ~706); worst-phase overlap for
   S < 665.9 (VH < ~766). Y-depth: 14.71px at S=550, 6.76px at VH 680,
   1.46px at VH 700. At VH 650 the chip overlaps awards' top edge
   for ~52% of its drift loop (chip y fully inside awards y-span at
   rest phases). This is the most severe disclosed residual: it is a
   recurring drift overlap, not worst-phase-only. It was disclosed by
   the poster fixer and is listed here as a residual per the brief,
   but it is the one residual most likely to draw a user complaint;
   recommend a follow-up nudge (e.g., awards right 27% -> 28%, or a
   Seoul lane tweak) if the user notices it.
4. Poster frame/glyph tucks (price of the bottom-right slot):
   at 1161/VH 650: frame intrusion 78.95px deep, glyph intrusion
   50.95px deep (poster top slides under frame bottom and glyph
   bottom). At 1161/VH 800: frame 6.95px, glyphs clear (worst +5.05).
   At 1024/VH 650: frame 24.88px, glyphs worst -4.88px (rest gap
   +3.12). At 1024/VH 800: clear. Tuck class (frame/glyphs paint
   above; letters stay visible). Do not fail alone.

## Pre-existing flag from the poster fixer (verified, out of scope)

Code for Cure pill at ORIGINAL bottom 30% vs PosterWindow (356px)
above 1400px: CONFIRMED with one correction. Rest zero at VH ~746
(flag said 744, diff ~2px); worst zero at VH ~776 (flag said 775,
diff ~1px). At VH 650 the pill sits ENTIRELY inside PosterWindow's
y-span: true overlap depth is 25px (the full pill height), NOT
55.5px — the flag's 55.5px was PosterWindow-bottom minus pill-top,
which counts PosterWindow's extension below the pill and is not the
overlap depth. X-lens: 114px at 1440 (full pill width), 59px at 1920;
at 2560 the pair is x-clear at all heights. Pre-existing (both
positions predate the rearrangement; the rearrangement does not
touch the above-1400 pill position). Out of scope, do not fix here.

## Pre-existing findings (NEW in this round; NOT caused by the rearrangement)

All five predate commit 0bb5b16's shipped layout and are unchanged by
this round's diff. They are NOT round blockers (the round introduces
none of them and worsens none), but they are true overlaps, so they
are listed here prominently for a parent decision. Under a strict
"zero overlaps anywhere" gate they would fail; under this round's
scope (rearrangement pairs + no regressions) the verdict is PASS
with these scheduled as follow-ups.

- P1 (most visible): Review-old vs Seoul pill above 1400px.
  X-overlap at all widths (review left 0.71W-223.58 vs pill
  [0.59W, 0.59W+184/191]). Rest overlap below VH ~834 (S=733.7);
  worst-phase overlap below VH ~896 (S=795.8). At 1440x800 (a common
  laptop size): rest overlap 9.78px deep x 176px wide. At VH 850:
  rest gap +4.72, worst -13.28. Cause: de-overlap moved the pill to
  left 59%/top 32% and checked S=800 (where worst is +1.22 by this
  model, +11.1 by theirs because their worst phase omitted pill
  float) but not shorter stages. Follow-up: move the pill or gate
  review-old; do NOT touch the 1161-1400 companions (they are clear).
- P2: Review-old vs StrokeSense chip 0.33 above 1400px, widths
  1401-1522 (grid: 1440; at 1920 x-clear by ~64px). Rest (drift-box)
  overlap below VH ~856 (S=755.9); worst-phase overlap below VH
  ~883 (S=782.6). At 1440/VH 650: chip slides up to 13.18px over
  review-old's left edge for ~39% of its 22s loop (21px tall).
  Cause: de-overlap fixed the chip at stage 800 (worst +5.22 there)
  but the 0.33 lane re-enters review's y-span at short stages.
- P3: Cochrane vs FAERS chip at 1301-1400 and above 1400, VH 751-797.
  Rest gap +1.05px at VH 751; worst-phase overlap up to 6.95px at
  VH 751, shrinking to 0 at VH ~797. Cause: laptop-logos scoped the
  21%/15% block to VH >= 801 because of a 6px overlap at stage 600
  (VH 700), but at VH 700 Cochrane is hidden anyway; the overlap
  persists through VH 751-797 at the same 15% top (both the 21%
  block and the 20% fallback share it). The 801 scope does not fix it.
- P4: Cochrane-fallback (inline 20%/15%) vs docking at W 1301-1345,
  VH 751-800. Rest overlap 7.69px wide x 83.19px tall (full Cochrane
  height inside docking's y-span). At VH >= 801 the 21% block clears
  docking by 5.34px rest (x-decided, col-col x-motion 0). Cause:
  laptop-logos fallback position; the 21% block was verified at
  1401 (gap ~10px) but not at the 1301 narrow edge.
- P5 (out of moved-item scope, noted once): FAERS chip vs docking at
  W < ~1471, S < ~780. At 1440/VH 650: chip slides up to ~9.9px rest
  (~18px worst with parallax+tilt) over docking's right edge for
  ~33% of its 18s loop. Cause: de-overlap chose anchorX 0.195 for
  helix clearance (15px) and microscope converge, but did not check
  docking on the drift-left side (rest gap only 14.8px at 1440,
  eaten by 20px drift). Neither item is moved by this round.
- P6 (box graze, ink clear): Scopus vs helix box above 1400 at
  W 1401-1435, VH > 750 (helix shown). Box contact up to ~2.4px at
  1401; helix ink clears by ~10px+ (strands inset from box edges).
  Same class as the accepted stickers/helix box graze. Note only.
- Known accepted hairline (not new): 720-740 stack Cochrane-Elsevier
  worst -0.19px at VH 751 only (laptop-logos H1, 0.3px graze; nudging
  Elsevier was rejected because it would eat the 1.2px
  Elsevier-label gap at 720x751). Scopus-Cochrane in the same stack
  is clear (worst +5.64 at VH 751).

## No-regression checklist (all verified from source/diff)

- Laptop-logos mechanism intact: show-rules, band slots 720-1160,
  Cochrane hide-750, Elsevier/PubMed slots, 720-740 height scopes —
  all present and unchanged (diff touches no show-rule or gate line).
- De-overlap state intact: notify/stickers/microscope/helix gates
  (VH 850/950/800/750, all min-width 720px scoped), chip lanes
  outside companion bands (FAERS, Code for Cure anchors unchanged;
  StrokeSense/Seoul original anchors unchanged in source),
  FAERS pill gate 1090, 31% review fallback.
- Mobile stack order and mobile-hide classes untouched; 719px block
  has 0 diff lines.
- Above-1400 layout unchanged: every rearrangement block is scoped
  to max-width 1400px or narrower; JS band checks exclude > 1400.
- Only file changed: src/sections/Hero.tsx (git status: 1 modified
  file). B1 gate deleted (0 occurrences of 686px). 1001-1023 strip
  keeps the old layout for BOTH review and poster (verified gaps
  above).

## Build, greps, FAERS masked check

- `npm run build`: PASS (4.72s, built output in dist/).
- Greps: src em dash 0, src sciencedirect 0, src DbLogoRow 0,
  Hero.tsx dialkit 0, dist dialkit 0, dist em dash 0. (Src dialkit
  34 hits are all in src/dev/ DEV-only canvas code + comments, which
  the production bundle excludes; dist dialkit 0 is the ship
  requirement and it passes.)
- FAERS masked check: docs/faers-verified.json has 5 rows, 2 with
  status != verified. Their ror/ciLow/ciHigh as standalone numbers:
  only one value hits (rows[4] ror): 28 hits in src, 9 in dist, ALL
  coincidental style/animation literals (gridTicks, opacity, scale,
  durations, rgba, padding) shown masked (digits replaced by #).
  All other unverified values: 0 hits. NO LEAK (same pattern as
  every prior round).
