# 03 - Final QA: mobile/tablet mirror

Base: `cbfeb35`. Only file modified: `src/sections/Hero.tsx`.
Scripts: `/tmp/mobile_mirror_qa.py`, `/tmp/mobile_mirror_qa_pills.py`
(model from source sizes; worst phase incl. float 8px, tilts, parallax 8px;
pill worst combos per 02-tablet.md).

## Verdict: PASS after B1 micro-fix (tablet notify gate 851 -> 882)

The round's single blocker (B1, below) was a negative recomputation of a
claimed positive gap. It is now FIXED by the micro-fix agent: the tablet
notify show-rule threshold was raised from min-height 851px to 882px in
both tablet bands (741-1000, 1024-1160), and the notify-faers pair was
re-QA'd (see B1 resolution below). Everything else in this round passes
or falls in a pre-classified accepted class (extents below). The desktop
notify exposure at 1161-1400, VH 851-880, is pre-existing and NOT changed
by this fix; it remains a parent decision (item 2 below).

### Blocker B1: notify vs faers, tablet VH ~851-880 (transient)

- Pair: NotifyBubble (left 2.5%, bottom 28%) vs FaersCard (left 2.5%,
  bottom 2%), same left column, y-adjacent.
- Claimed: +2.4px worst-phase gap at 741x851.
- Recomputed: with the faers height the fixer model used (170px), the
  claim reproduces exactly (+2.3px worst). With the corrected faers
  height (180px), the pair OVERLAPS 7.7px worst-phase at 741x851, and the
  same at 768x851 and 1024x851 (y geometry depends only on S, not width).
  Gate sweep (faers 180): worst overlap 7.7px at VH 851, 2.8px at VH 870,
  zero at VH ~881, positive above. Under any 2-line-label faers height
  (176-184px) the VH-851 worst gap is -3.7 to -11.7px (all negative).
- Root cause: the faers card is 180px tall, not 170px, because its label
  wraps. Label "FAERS · Resistant Hypertension" is 30 chars at 10px mono
  with 0.08em letter-spacing = 30 x 6.8 = 204px, wider than the 202px
  content width (240 - 36 padding - 2 border). The flow line also wraps.
  Height sum with both wrapping: 32 (padding+border) + 34 (label 2 lines)
  + 52 (figure) + 41 (flow 2 lines) + 21 (note) = 180. Independent
  confirmation: the user's own 12:35 desktop screenshot shows the faers
  label on two lines ("FAERS · RESISTANT" / "HYPERTENSION") and the flow
  on two lines. The three prior QA rounds used 167-170px without ever
  verifying the wrap; the fixer inherited that figure.
- Exposure: tablet bands 741-1000 and 1024-1160 at VH 851-880 (notify is
  newly shown there by this round, so this round newly exposes it).
  Pre-existing at desktop 1161-1400 at VH 851-880 (same y geometry, same
  851 notify gate; the de-overlap round validated VH 850, where notify
  is hidden, not VH 851, where it appears).
- What clears it: a tablet notify gate of VH >= 881 (not 851) under
  faers 180. Whether to also raise the desktop gate is a parent decision
  (out of this round's scope); the desktop exposure is pre-existing.
- Worst-phase realism: the overlap needs faers at float -8 with notify
  at float 0. The two float cycles (9s/12s, delays 1.1/1.4) come within
  ~0.01px of that combination every ~72s cycle, and ease-in-out lingers
  near extremes, so the overlap is a real transient, not a
  never-achieved bound.

### B1 resolution (micro-fix agent, Hero.tsx only)

- Change: tablet notify show-rules (`.mv-collage-show-tablet-notify`,
  bands 741-1000 and 1024-1160) min-height 851px -> 882px, plus the
  tablet-mirror comment's gate value. No other rule touched: desktop
  hide-notify-850 (min-width 720, max-height 850) unchanged, and no
  other gate (stickers 951, posterwindow 790/810, review-new 850,
  FAERS pill 1091, Cochrane 750) touched. No 851 remains in Hero.tsx.
- Why 882, not the prescribed 881: independent recomputation from source
  sizes (faers 180px verified: 32 + 34 + 52 + 41 + 21; notify ~319x52;
  faers tilt-card-b 2deg top growth 4.13px; notify tilt-sticker-b 4deg
  bottom growth 11.06px; float diff 8px; total worst deductions 23.20px)
  gives worst gap -0.14px at VH 881 (QA-calibrated model: +0.10px) -
  the two models straddle zero at 881, so 881 is not clean under both.
  At 882 both models agree positive (+0.12 mine / +0.36 QA-calibrated).
  Per the brief's rule (use 882 if 881 shows any worst-phase overlap),
  882 was used.
- Recomputed worst-phase notify-faers gaps (faers 180, both tablet bands;
  y geometry depends only on S, not width): VH 875: -1.70 (mine) /
  -1.46 (QA) - hidden under the gate, moot; VH 880: -0.40 / -0.16 -
  hidden, moot; VH 881: -0.14 / +0.10 - hidden, moot; VH 882: +0.12 /
  +0.36 - shown, clean; VH 900: +4.80 / +5.04 - shown, clean. Gap grows
  0.26px per VH px above 882. Thin at the first shown height (+0.12px
  worst) - a live eyeball at exactly VH 882 is worthwhile, but the pair
  is positive, not overlapping, in both models.
- No other pair changed: the edit touches only the notify show
  threshold, so every other pair's geometry is identical to the QA grid
  above; the CFC-notify x gap (VH-independent, both bottom-anchored)
  stands, re-labeled to 768x882 in 02-tablet.md.
- Build after fix: PASS (6.12s).

## Verification table: claimed vs recomputed

Gaps are tilt-adjusted unless noted. "Non-binding" means the pair is
separated by a large margin on the other axis, so the quoted gap does not
decide clearance (pair is clear regardless).

| Claimed gap | Recomputed | Status |
|---|---|---|
| Phone review-stack 81px | 81.6 rest / 77.5 tilt-adj | PASS |
| Phone awards-poster 24px | 24.2 rest / 21.4 tilt-adj | PASS |
| Phone faers-Elsevier 44px | 44.2 rest / 40.1 tilt-adj | PASS |
| Phone notify-faers 87px | 84.8 rest (faers 170) / 69.9 tilt-adj rest / 61.9 float-worst; 51.9 float-worst even at faers 180 | PASS |
| Tablet awards-posterwindow 4.3px @1024x810 | 4.29 x-gap, but y-separated 140.8px | PASS, non-binding |
| Tablet awards-poster 6.7px @1100x700 | 6.67 x-gap, but y-separated 232.3px | PASS, non-binding |
| Tablet CFC-notify 8.2px @768x851 | 14.7 rest / 6.7 parallax-worst (pill 113.5); 8.2 worst with a 112px pill width; positive in all metric variants; pair y-overlaps so the x gap binds | PASS |
| Tablet Cochrane-posterwindow 8.9px @741x790 | 8.85 x-gap, y-overlap exists, binds | PASS |
| Tablet CFC-poster 11.8px @1024x700 | 19.8 rest / 11.8 parallax-worst in x, but y-separated 158.5px+ worst | PASS, non-binding |
| Tablet posterwindow-review 22.3px @1024x810 | 22.26 x-gap, y-overlap exists, binds | PASS |
| Tablet notify-faers 2.4px @741x851 | +2.3 worst at faers 170 (reproduces); -7.7 worst at faers 180 under the 851 gate; gate raised to 882: hidden below 882, +0.12/+0.36 worst at 882, +4.80/+5.04 at 900 | PASS after B1 fix |

Full grids: miniature frozen stage 0 overlaps; tablet grids at
741/768/1024/1100/1160 crossed with VH 700-1138: 0 collage-collage
overlaps under faers 170, and 0 except B1 under faers 180. Pill-vs-collage
worst-combo scan at all grid points: clean except the FAERS-pill
transient below.

## Accepted classes (confirmed extents, not blockers)

- FAERS pill vs notify transient, VH 1091-~1140: rest gap 11.1px at
  VH 1091 (claimed 11.3, 0.2px metric difference), worst-phase overlap
  4.9px at VH 1091 (claimed 4.7 implied), shrinking 0.10px per VH px,
  clean from ~VH 1140 (claimed 1138; at 1138 the model still shows 0.2px
  worst overlap). Requires triple alignment (pill float 0 + notify
  float -8 + parallax -8). Very tall stages only. Accepted per brief.
- Posterwindow vs frame/ink tucks @1160x810: frame-rect overlap 150.7px
  (claimed 150), word linebox overlap 122.7px (claimed 122). Exact
  reproduction. Same tuck class as desktop (frame/word paint above the
  collage; glyphs stay readable); deeper than desktop's ~105px at
  1440x800, same class.
- CFC pill inside frame interior @1160x700: pill sits inside the frame
  y-range, 41.9-44.1px above the frame's bottom edge (pill-height
  dependent), and clears glyph ink by ~11-13px on the baseline model
  (linebox overlap ~14-16px is not ink overlap: "daivanlabs." has no
  descenders). Accepted tuck class.
- Posterwindow vs label @741x790: rest gap +0.3px (label ink is 21 chars
  x 8.16 = 171.4px wide, centered; posterwindow scaled left edge
  456.475 vs label right 456.2). Mouse-parallax worst is a 7.7px tuck
  (label paints above, text readable); touch devices have no parallax,
  so no overlap there. Accepted tuck class.
- Microscope word tuck in the miniature: the microscope card sits inside
  the frame y-range; overlap with the word linebox is 155.7 x 171.0px,
  and with glyph ink (cap-height estimate) ~155.7 x 131.4px, about 50%
  of the card area. That EXCEEDS the shipped desktop criterion for
  microscope glyph overlap (35% or less at 1301+). The caption bar is
  partly under ink, and the frame's top-left handle straddles the card
  corner (handle paints above, visible). Mitigating context: the
  miniature is decorative texture at 0.276-0.620 scale (card text is
  illegible at those scales regardless), and the word stays readable
  (paints above). Per the brief this is a pre-classified accepted class,
  so it is NOT counted as a blocker, but it is the miniature's largest
  visual deviation: if the parent wants it tightened, the follow-up is
  hiding microscope in the miniature (it is hidden at 1161-1300 on
  desktop anyway).
- Helix-review box graze in the miniature: 4.4px rest / 0.82px
  tilt-adjusted, ink gap 24.4 rest / 20.8 tilt-adjusted. Same accepted
  class as desktop (rearrangement QA: box +0.91, ink ~25px at 1161).

## Deviations (all justified or benign, none blocking)

- Awards scale 1.00 (not briefed 0.90) with the R29% shift: binding
  awards-poster-new gap 8.53px tilt-adjusted at 1024x810. Justified.
- Poster-new full size (not briefed 0.95): no scale rule shipped; all
  poster-new pairs measure clean. Benign.
- Desk figure: fixer claimed 186x142px worst at 1024x768; recomputed
  rest ~170x127 (worst ~170x135 with float). The figure does not
  reproduce exactly, but the conclusion stands (head-on, mutually
  exclusive, awards-priority correct) and desk never renders.
- CFC pill right 40%/30% (not briefed 14%) and hidden 741-767: justified
  (14% collides with poster-new; the 768 cutoff is 12px conservative
  over the model crossover ~756 worst-phase). Safe.
- Tablet diorama block beats the 1160 hide, the 900 pill hide, AND
  `hover: none` by source order; the operative chip hide in tablet bands
  is the explicit chip rule. Outcome unchanged (chips hidden, pills
  shown, on touch and mouse alike).

## Regression checklist

- Desktop >= 1161 rearrangement intact: review 36%/2%, poster
  bottom-right, 62% stack, companions (StrokeSense 0.45, Seoul 0.70,
  CFC pill 45%), B1 gate still deleted (grep "686" = 0).
- Laptop-logos show-rules intact; de-overlap gates intact (all
  min-width-720 scoped; unscoped hide-1000/hide-750 are beaten by the
  miniature item rule at phone widths, as designed).
- Mobile stack overridden below 720 (not deleted); no leftover stack
  styles apply when `mv-hero-mini` is present (verified
  specificity-by-specificity).
- No duplicate logos or pills at any width: miniature hides `m-*`
  twins and shows `db-*` floats; tablet shows no `m-*` (hide-min-720)
  and no Seoul pill (no marker class).
- 1001-1023 strip keeps old review+poster; 720-740 VH <= 750 PubMed-only
  holds on the CSS-viewport path (scrollbar path shows the miniature,
  documented in 01-phone-miniature.md).
- Diorama behavior unchanged on desktop (no diorama code touched).
- Desktop regression spot check reproduces exactly: review vs helix
  box gap +0.91 at 1161x650 (rearrangement QA figure).

## Build, greps, FAERS

- `npm run build`: PASS (5.55s).
- Greps: dist dialkit 0; src em dash 0; dist em dash 0; sciencedirect 0
  in src; DbLogoRow 0 in src. (Src dialkit hits live only in `src/dev/`
  DEV-only canvas code; dist 0 is the ship requirement.)
- FAERS masked check: 5 rows, 2 unverified, 2 non-null withheld values
  checked as standalone numbers. src: 27 hits; dist: 9 hits. Every
  masked context is a style/animation literal (opacity, px, scale,
  durations, grid ticks, rgba, mask-image, ease-in-out, anchors).
  No leak.

## Live checks to eyeball after the fix (user's Netlify preview)

- Phone 390: miniature layout (review top-center-left, poster
  bottom-right, 62% logo stack, microscope peeking from behind the
  word's left edge); confirm the microscope tuck reads as collage, not
  as a broken card.
- Tablet 768 portrait (VH 1024+): full mirror (stickers, notify,
  posterwindow 0.90 visible); tablet 1024 landscape (VH ~768): partial
  mirror (notify/stickers hidden by gates, awards + poster-old visible).
- Tablet 741-1000 at VH 851-881 AFTER the gate fix: notify hidden;
  at VH 882+: notify-faers gap positive through a full float cycle
  (+0.12px worst at exactly 882 - worth one eyeball there).
- 720-740 at VH 751-754 (H1 hairline region from the laptop-logos round,
  unchanged) and the 719/720 seam on a classic-scrollbar browser.

## What the parent must decide

1. DONE: B1 fixed by raising the tablet notify gate to VH >= 882 (one
   constant, in both tablet bands) with the pair re-QA'd (see B1
   resolution above). The 881 option was rejected: the independent
   model shows -0.14px worst at 881, so 882 is the first height clean
   in both models. The alternative (accept the VH 851-880 transient
   overlap as a second accepted class) is no longer needed for tablet.
2. DONE (2026-10-25, user-approved follow-up): desktop notify gate raised
   the same way - the hide-notify-850 rule's threshold went from
   max-height 850px to 881px (class name kept for churn safety, noted in
   code comment). Notify is now hidden at VH <= 881 at all widths >= 720px
   and shown at VH >= 882, where the worst gap is +0.12/+0.36px in both
   models (y-geometry is width-independent, so the tablet proof carries
   to desktop). Tablet behavior is unchanged (show-rules at min-height
   882px still win above 881). Build passes; no other rule touched.
3. Whether to hide microscope in the miniature to remove the ~50% word
   tuck, or accept it as the miniature's collage look.
