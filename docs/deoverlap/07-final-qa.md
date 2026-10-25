# De-overlap final QA: FAIL (one blocker, one constant away)

Method: code inspection plus px modeling from source, no live
browser (sandbox blocks localhost preview). Card heights below
are summed from component source, not reused estimates, where
they decide a verdict: review 209px (padding 30 + kicker 16 +
title 27.8 + bars 81.6 + arrows 28 + footer 24 + border 2),
faers 167px, gutaxis 173px, stroke 125px, posterwindow about
338px, microscope 194px (4/3 image at 210px + caption),
stickers 26px. Tilt boxes are axis-aligned bounding boxes.
Float moves cards up 0-8px only; parallax moves the whole
collage layer plus/minus 8px per axis (chips are NOT in that
layer, so parallax DOES shift chip-vs-card gaps). Stage S =
viewport height minus 100px, floor 550px.

## Item 1: static moves - PASS

Verified in source (Hero.tsx COLLAGE_ITEMS): faers bottom 2%,
notify bottom 28%, stroke bottom 2%, awards right 27%.

- notify/faers (both left 2.5%): rest gap 0.26S - 168.
  VH 850: notify hidden by gate, no pair. VH 900 (S 800):
  rest +40px, worst float+tilt +16.7px. VH 1080 (S 980):
  rest +86.8px, worst +63.5px. Clear at rest and worst
  phase wherever visible; worst-phase zero is VH 836,
  inside the gate (hidden at VH 850 and below).
- gutaxis/notify at 1440/S 800: rest vertical gap 28px,
  tilt-adjusted 11.0px (notify tilt bottom 587.1 vs
  gutaxis tilt top 598.1). Clear; near-miss, watch live.
- microscope/notify at VH 851 and above: rest 0.11S - 52
  (+30.6px at VH 851, +36px at VH 900), worst +9.7px and
  +15px. Clear. Between VH 801-850 notify is hidden, so
  no pair there either.
- awards/stroke at 1180: tilt-adjusted x-gap 25.9px
  (awards 692.3-862.5, stroke 888.4-1152.6). Was 2.3px.
- stroke/posterwindow at VH 600 (S 550, true heights):
  rest gap +15.5px (stroke top 414 vs posterwindow
  bottom 398.5). Tilt-adjusted +11.0px, worst float
  +3.0px, worst float+parallax graze 5.0px, VH 600 only.
  This matches the accepted criterion exactly (rest
  positive; worst-phase transient graze at most 5px at
  VH 600 only). Documented, not failed.

## Item 2: guards - PASS

All verified in source with exact scopes:

- Notify gate `@media (min-width: 720px) and
  (max-height: 850px)`: min-width 720px scoped, so the
  mobile stack keeps all six items on short phones.
- Stickers gate (720px + 950px), microscope gate (720px
  + 800px): same scoping, same mobile-stack safety.
- Helix hide class is hide-750 (750px), hide-short no
  longer carried by any item.
- Review 31% override is `@media (max-width: 1160px)`
  ONLY; base inline right stays 29%. Desktop 1440
  review/search gap stays 18.6px (review tilt right
  1025.9 vs search tilt left 516.5 is not the binding
  pair; the binding review/search pair is review right
  vs search right: 18.6px per the desktop audit,
  unchanged because base 29% is intact).
- Mobile 719px block: gap 24px, `.mv-collage`
  margin-top 16px. Both only increase separation.
- Tablet visible sets unchanged: no tablet-visible item
  gained or lost a class (hide-mid, hide-1300,
  hide-1400, hide-720-1160, hide-min-720, hide-1000
  all untouched in the diff). Logo counts unchanged:
  1 PubMed at 720-1400, 4 above 1400 at heights over
  750px (no logo tile carries any new class).

## Item 3: cursor layer - FAIL (single blocker)

Verified in source: chips FAERS (0.195, 0.30, r20),
StrokeSense (0.55, 0.30, r20), Code for Cure (0.30,
0.695, r20), Seoul 2026 (0.80, 0.695, r20); diorama
hidden at max-width 1160px; hover:none rule intact;
drift formula driftX = r cos, driftY = 0.7r sin,
chip sizes measured from DOM (115px wide StrokeSense
chip: 11 chars at 7.04px + 16px padding + 2px border
+ 14px cursor + 6px gap).

- FAERS chip: PASS. At 1440/S 800 worst gaps are
  docking 4.1px (parallax down), helix 7.0px
  (parallax left), microscope x-gap 5.0px combined.
  Zero overlap at 1440 and 1920.
- Seoul 2026 chip: PASS. At 1440/S 800 worst gap is
  stroke 21.5px (float + parallax up); frame gap 8px
  above. Zero overlap at 1440 and 1920.
- Code for Cure chip: PASS with the accepted note.
  Vs gutaxis at 1440/S 800: rest gap 6.1px
  (chip bottom max 591 vs gutaxis tilt top 597.1),
  worst float phase about 2px overlap, matching
  the accepted "about 1px worst" within height
  error. Observation (not a fail): adding worst
  parallax on top reaches about 10px, but only when
  mouse-at-top, chip-at-bottom-extreme, and
  gutaxis-at-float-peak coincide; list as a
  live-check item.
- StrokeSense chip vs review card at 1440: FAIL.
  Chip right range 772-812px vs review tilt left
  edge 798.8px; chip top range 226-254px vs review
  tilt bottom 236.6px (true height 209px, not the
  190px the lane math assumed). The chip overlaps
  review's bottom-left corner for about 16% of
  every 22s loop at rest (lens up to about 12px
  wide by 7px tall; at the diagonal phase about
  7x7px), and under worst parallax (review
  shifted left 8px and down 8px) the lens grows
  to about 17px by 13px for up to about 31% of
  the loop. This exceeds the accepted note
  ("worst-parallax about 8px"): the overlap
  exists at rest, not only under parallax, and
  is roughly twice the claimed size at worst.
  At 1920 the same chip is clear (63.7px to
  review; only a 0-1px worst-parallax graze to
  search).
- Converge positions: PASS. All four converged
  chips land on the expanded word-rect border
  (20px expansion) with no card overlap: FAERS
  clears microscope by about 33px in x, StrokeSense
  clears search by 67px in y and review by 6.9px
  in x, Code for Cure and Seoul clear desk/stroke
  by 40px or more in y. The old 14px StrokeSense
  poster-window converge clip is gone.

BLOCKER FIX (one constant, not applied by QA):
StrokeSense anchorY 0.30 to 0.33. Then at 1440/S 800
chip top range is 250-278px vs review bottom max
244.6px (worst parallax + float 0) for a 5.4px
minimum gap, chip bottom max 299px vs frame top
307px for an 8px gap, and search bottom max
245.3px vs chip top min 250px for a 4.7px gap.
At 1920/S 900 all gaps exceed 25px. Re-verify
after the change; no other constant needs to move.

## Item 4: pills - PASS

- Seoul pill left 59%, top 32% in source. At 1440:
  label x-gap about 44-51px (pill left 849.6 vs
  label right about 799-806 depending on label
  width estimate), posterwindow x-gap about 83-88px
  (pill right about 1035.6 vs window left 1124),
  review vertical gap 11.2px rest at S 800 (pill
  float peak 246 vs review tilt bottom 234.8).
  At 1920: db-elsevier x-gap 20-24px (pill right
  about 1318.8 vs elsevier left 1342.8). All
  claimed margins reproduce within estimate error.
  At S 900 the pill clears search (y gap 67px)
  and the frame (30px above frame top).
- FAERS pill top 62% with the 1090px gate, verified
  in source AND in dist (Hero chunk contains
  `mv-diorama-pill-faers` twice and `1090` three
  times). Above 1090px: pill-vs-word gap grows
  with height (0.3px at the gate boundary by the
  central estimate, widening 0.12px per px of
  viewport height); pill-vs-microscope transient
  is at most about 2px, vanishing by about VH 1285.
  Matches the "at most about 2px" criterion.
- No other pill moved: the diff touches only the
  Seoul and FAERS pill entries; Code for Cure
  (bottom 30%, right 14%) is byte-identical.

## Item 5: no new overlaps - PASS (with two honest notes)

Recomputed pair set, desktop 1440/1920 crossed with
stages 700/800/900/980, spot widths 1180/1280/1366/
1536/2560, tablet 768/820/1024/1160, mobile
320/375/414. No remaining true item-item overlap
besides the item-3 chip residual and the item-1
accepted VH-600 graze. Near-misses carried over
unchanged (all pre-existing, none created by this
round): helix/db-scopus box graze 0.4px at 1440
(ink clears about 28px), docking/db-scopus 16.9px,
docking/db-cochrane 16.6px, review/search 18.6px,
desk/db-elsevier 21.9px, review/poster 26px at
tablet 1024 (was 6px) and 65px at 1160 (was 42px).

VH 950-975 band at 1366-1440 (stickers return
above the 950px gate while stages are still
short): stickers/helix box overlap reaches about
36px by 8px at 1366/VH 951, shrinking to zero at
VH 977. Actual ink: at 1440 the overlap band
contains ZERO helix ink (strands in the helix's
bottom 8px sit at rendered x 423.8-453.8, right
of the sticker row's 406.5 edge). At 1366 the
ink crossing is a sub-1px strand tip (x
403.8-404.6) that sits UNDER the opaque third
sticker pill (stickers paint last in DOM order),
so it is invisible. Verdict for the band:
box-level graze only, zero visible ink crossing.
Eyeball it live at 1366x960 as a sanity check,
but it is not a fail.

Tablet: zero item-item overlaps at all 12 combos
(unchanged); diorama hide at 1160px removes the
chip-on-card layer for mouse iPads, which is the
intended product decision, not a regression.
Mobile: stack order and membership unchanged,
gaps only grew (16 to 24px, plus 16px top margin);
shadow tails and the 0px frame joint from the
mobile audit are both closed by this round.

## Item 6: no regressions - PASS

- `npm run build`: PASS (exit 0, 4.31s).
- Dist bundle: 0 dialkit strings.
- Em dash: 0 in Hero.tsx and in docs/deoverlap/.
- `sciencedirect`: 0 in src/. `DbLogoRow`: 0 in src/.
- FAERS data files: 0 changed (only Hero.tsx is
  modified). Masked check (2 withheld rows from
  docs/faers-verified.json, values checked as
  standalone numbers, counts only): 28 hits in
  src/, 9 in dist/, all coincidental style or
  animation literals (grid ticks, durations,
  opacities, paddings, mask gradients). No leak.
- Dark-section text colors: untouched (no
  dark-section file modified; the single #1D1D1F
  hit in Hero.tsx is an explicit light-section
  text color).
- Mobile stack order verified from DOM order:
  PubMed, FaersCard, Elsevier, NotifyBubble,
  Scopus, Cochrane.

## Verdict: PASS after one-constant fix (applied post-QA)

QA found one ship-blocker: StrokeSense chip vs review
card at 1440px (item 3). Everything else passed. The
parent applied the fix (StrokeSense anchorY 0.30 to
0.33), the rebuild passed, and the gaps match QA's
math (review 5.4px, frame 8px, search 4.7px at
1440/S 800; over 25px at 1920/S 900). Converge was
re-checked by the parent: converged positions derive
from the expanded word rect, not the raw anchor, so
the anchor move does not break converge. Shipped
state: PASS.

## Live checks still owed after deploy (real device)

- Desktop 1440x800-900: StrokeSense chip never
  touches review (re-check after the anchorY fix);
  Code for Cure chip vs gutaxis at float peak.
- Desktop 1920x900: chip drift over a full
  slowest loop (24s); pill positions (Seoul pill
  right of label, FAERS pill above 1090px only).
- Short desktop 1440x800-900: left column chain
  (docking/stickers/microscope/notify/faers)
  fully separated; stickers hidden at VH 950 and
  below, notify hidden at VH 850 and below.
- Tablet 1024: review/poster gap reads as a clean
  gap (about 26px tilt-adjusted).
- 1366x960: stickers/helix band shows no visible
  ink crossing (box graze only, per analysis).
- Mobile stack: order and 24px gaps, 16px top
  margin, hamburger unaffected (untouched).
- Confirm the deployed preview matches the new
  commit before judging any of the above.
