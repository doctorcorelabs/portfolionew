# QA-layout: cursor consistency (read-only verifier)

Base: HEAD `1255c6f` + fixer 1, 2, 3 uncommitted diffs (nothing reverted).
Scope: layout only. No source edits except this file. Build not re-run
by QA (fixers built; parent re-verifies at push).
Scratch (not in repo): `/tmp/qa_mini_model.py` (independent miniature
model + PIL glyph model), `/tmp/qa_tweak_check.py` (tweak directions),
fixer 3's `/tmp/mini_chip_gaps.py` + `/tmp/Inter-VF.ttf` (both still
present and used as cross-checks, not as truth).

## Method and conventions (read before the numbers)

- Card/chip rects recomputed from `Hero.tsx` source constants (inline
  styles + miniature overrides + tilt classes), NOT copied from fixer
  scripts. Chip sizes verified from JSX: arrow 14 + gap 6 + pill
  (11px JetBrains Mono, 0.04em tracking, 8px padding, 1px border) =
  73 / 116 / 130 / 109 wide, 21 tall. Sensitivity: height 19-22.3 and
  width +-2px change no verdict below (margins are 2-50x larger than
  the uncertainty, except where explicitly called hairline).
- Gap sign in this report: gap > 0 = clear on that axis; overlap
  depth = min penetration over the two axes (distance to separate).
  This differs from fixer 2's tables (negative = clear) and fixer 1's
  "WxH" (intersection dims) - all numbers below were converted to
  this report's convention before comparing.
- Worst phase: chip drift ellipse (rx 40, ry 28 miniature; tablet
  per TABLET_ANCHORS) + card float UP only (0..-8px) applied toward
  the chip only when the card is below the chip; miniature has no
  mouse parallax (correctly excluded). Two modeling notes:
  (a) independent-maxima worst (dx and dy both maxed) overstates
  diagonal corners because the ellipse couples them; sampled
  durations/depths are the true values and are reported alongside
  where they differ; (b) fixer 2's worst applies float 8px toward
  the chip even when the card is ABOVE the chip (float can only
  move it away) - that overstates above-card worst depths by
  exactly 8px, in the safe direction.
- Budget (synthesis section 7): max 3s continuous, max 12px deep
  (stated as 8px visual in the miniature). Depth is ambiguous
  between design and visual px, so both are reported; duration is
  unambiguous and is decisive wherever cited.
- Glyph ink: PIL render of "daivanlabs." in Inter VF weight 700 at
  180px with -1.8px tracking applied char-by-char (both trailing-
  tracking variants computed; they differ by <1px and change
  nothing). Frame geometry verified from source: miniature stage
  1160x600, padding 80/24, label 12px + 32px margin, frame padding
  28/32, word 180px lh 0.95. Result: ink rows 256.7-391.7, ink
  width 840, 'l' stem cols 670.9-685.9 (16px wide). Chips are
  z-index 2, ABOVE the frame (z 1), so the old collage rule
  "glyphs never covered" does NOT protect against chips.

## 1. FAERS vs docking, miniature - CONFIRMED (FAIL)

- Rest: OVERLAP depth 27.9 design (x-pen 37.5, y-pen 27.9). Chip
  (226.2,180)-(299.2,201) vs docking tilted (24.35,12.1)-
  (263.65,207.9). Exact match to fixer 3. Float-independent
  (docking is above the chip, float moves it away).
- Worst: 55.9 analytic bound; 53.5 sampled max (ellipse-true).
  Duration 8.09s of each 12s cycle (my sampler, N=2880,
  dart-dwell, float 0) - exact match to fixer 3.
- Budget: fails depth (27.9 design = 9.4 visual @390, over 8
  visual; over 12 design) AND duration (8.09 vs 3s, 2.7x).
- Desktop, same park: grid W 1161-1400 x VH 650-810 confirms
  fixer 1's H1 band exactly - park for W < ~1380.5 and VH <
  ~803 (at 1161x800: x-pen 37.3, y-pen 0.9; at 1161x810:
  clear). The miniature (frozen S=600 = desktop VH 700 state)
  reproduces it exactly: 27.9 at both.
- Verdict: FAIL. This is a rest park, not a transient.

## 2. StrokeSense vs word glyph 'l', miniature - CONFIRMED, worse
## than fixer 3's script line (FAIL)

- PIL pixel-verified, miniature stage: 'l' stem cols 670.9-
  685.9 sit fully inside the chip x-range 638-754 at every
  phase. Rest: 336 ink px under the chip (alpha > 0; 315 at
  alpha > 128) vs fixer 3's claimed 352 - within 5%, same
  park (difference = chip-height/antialiasing convention).
  Drift-down: 1101 ink px (alpha > 0; 1032 at alpha > 128)
  vs claimed 1110 - match (at drift-down the chip also
  covers neighboring 'n'/'a'/'b' ink, not just the 'l' stem).
- Correction to fixer 3's script: its glyph-band box
  (276.2-411.2) is shifted +19.5px down from the true ink
  rows (256.7-391.7, confirmed by PIL). Its box line
  ("y-pen 14.8") therefore UNDERSTATES the rest overlap:
  true rest y-penetration is 34.3px (chip 270-291 fully
  inside the ink band vertically). The doc's rows, not the
  script's box, are correct.
- Desktop, same park: grid W 1161-1400 x VH 650-1300, all
  PARK. Chip (0.55W, 0.45S) vs ink band (W/2-420.1 to
  W/2+419.9, S/2-43.3 to S/2+91.7): x-overlap holds at every
  width (stem at W/2+90.9 to W/2+105.9, always inside chip
  x-range); y-overlap holds to S < 1286 (VH < 1386), i.e.
  all realistic heights (at VH 1300 the chip still covers
  4px of ink rows x full stem width). Cause confirmed:
  the 0.45 companion (rearrangement round) pushed the chip
  into the glyph band; the 0.33 anchor cleared glyphs.
- Verdict: FAIL. A rest glyph park, permanent at rest and
  worse drifting. The word is the brand lockup; a chip
  sitting on it is not a texture detail.

## 3. Seoul vs awards, miniature - CONFIRMED (FAIL on duration)

- Rest: clear, y-gap 12.5px. Worst: OVERLAP depth 23.5
  design (7.9 visual @390), x-pen 104.9. Exact match.
- Duration: 7.04s/cycle at peak float (match to fixer 3's
  7.03); 6.17s/cycle at float 0 (lower bound). Either way
  over the 3s budget by 2.1-2.3x.
- Depth nuance, stated honestly: under the design reading
  (12 design px) it fails (23.5, and 15.5 even at float 0);
  under the visual reading (8 visual px) the peak depth
  7.9 visual squeaks inside - but duration fails under
  every reading, so the violation stands regardless.
- This AMPLIFIES the disclosed desktop residual (radius 20:
  ~14.7px deep, ~52% of loop at short stages); the
  miniature radius 40 deepens it to 23.5px at similar
  duration. Same class as desktop, deeper.
- Verdict: FAIL (duration-decisive).

## 4. All other miniature chip pairs - PASS (one hairline note)

- Full pair scan (4 chips x 8 cards + 6 chip-chip pairs,
  rest + worst, tilt + direction-correct float): every pair
  except items 1-3 above separates on at least one axis.
  Binding clears: SS vs review rest y 48.2 / worst y 20.2
  (the synthesis "known residual" does NOT reproduce in
  the short miniature - fixer 3's correction stands);
  CFC vs elsevier worst y-clear 43.3; CFC vs pubmed worst
  y-clear 44.3; Seoul vs poster worst x-clear 17.3;
  chip-chip worst all clear (thinnest: FAERS vs SS
  y-clear 13.0).
- Hairline observation (not a violation): shipped CFC and
  Seoul chips graze the glyph BAND BOX by 2.7px at extreme
  up-drift, but pixel-true local ink bottom at their
  x-ranges is ~baseline 388.7 vs chip top min 389, i.e.
  ~0-0.3px (antialiasing-level), at extreme drift only.
  Not a park.
- Verdict: PASS.

## 5. Tablet lanes - card tables PASS, with one NEW finding

Spot-recomputed (rest / worst, direction-correct float +
parallax in the binding direction; fixer 2's sign
convention converted):
- Portrait FAERS vs pubmed @720x700: rest y-clear 29.3 /
  worst overlap 0.7. EXACT match.
- Portrait CFC vs elsevier @720x768: rest y-clear 10.1.
  EXACT match. Worst: claimed 15.7, direction-correct
  7.7 (their +8 is the float misdirection for an
  above-card pair; safe direction, verdict unchanged).
- Portrait Seoul vs notify @768x882: rest x-clear 13.5 /
  worst overlap 14.5 (parallax in binding direction).
  EXACT match.
- Portrait SS vs stickers @768x951: rest y-clear 12.4.
  EXACT match. Worst: claimed 13.4, direction-correct
  ~5.4 (same +8 conservatism).
- Landscape FAERS vs elsevier @1024x700: rest y-clear
  28.3 / worst overlap 4.5. EXACT match.
- Landscape CFC vs awards @1024x700: rest y-clear 20.0
  (claimed 19.6, diff 0.4 = rounding/tile size) / worst
  overlap 12.8. MATCH.
- Chip-chip portrait SS vs CFC worst: claimed clear 14.4,
  mine clear 25.0. Discrepancy 10.6px unexplained (possibly
  a wider measured chip width in their model), but both
  are clear by >14px and converge-on-hover is modeled by
  neither; immaterial to every verdict.
- No tablet chip parks on a CARD at rest: CONFIRMED.
- NEW FINDING (not in fixer 2's tables - they list no
  label pairs): portrait CFC chip parks on the LABEL strip
  ("PORTFOLIO - EST. 2025"). Derivation from source:
  label top = S/2 - 85.4 (flow 170.8: label 14.4 + margin
  32 + frame 124.4 at 72px word, centered in S-160);
  CFC top = 0.38S. Y-overlap for S in (592, 887), x-overlap
  for W < 827 (chip right 0.24W+130 vs label left
  (W-163..170)/2). Park zone: portrait W 720-826 x VH
  692-987. Measured: 720x800 -> 24.3 x 13.0px; 720x768 ->
  24.3 x 9.2; 768x951 -> 11.8 x 4.3 (15.3 x 4.3 at label
  width 170). Label line-height/width uncertainty (14.4-
  15.6 / 163-170) moves edges by <4px; the zone stands.
  At 768x1024 (S=924) it is rest-clear by 4.5px but has a
  5.3px / 3.8s transient label touch on down-drift (over
  budget on duration). Only CFC is affected (SS same y
  but x-clear; FAERS/Seoul below the label band).
  Severity: moderate-low (covers 1-3 chars of grey 12px
  microcopy with a white pill), but it violates the
  project's own "never over the centered label" rule and
  persists statically under reduced-motion.
- Verdict: PASS on cards; NEW FINDING on label (see ship
  recommendation).

## 6. Pill rules intact - PASS

Verified by rule inspection (all bands, normal motion):
CFC tablet right 40% (768-1000) / 30% (1024-1160), bottom
30%; FAERS tablet only at VH >= 1091 (min-height 1091
rules); Seoul hidden at tablet (no show rule anywhere in
the tablet block); strip pill hides 720-767 / 1001-1023
(explicit rule, :not(.mv-hero-mini) scoped); desktop pills
unchanged (Seoul 59%/32%, CFC 30% with 45% companion at
1161-1400, FAERS top 62% left 7% with VH > 1090 gate);
pills hidden at max-width 900px and under hover:none
(fixer 1's pill-only hide preserves the prior outcome).
No pill show rule was extended into any strip.

## 7. Reduced-motion - mechanisms PASS, static parks FAIL
## (miniature + portrait tablet)

- Loops: section loop and miniature loop both return early
  under prefers-reduced-motion (code lines ~520, ~664);
  chips sit at base; entrance fades killed by
  animation:none (section chips, mini chips, pills).
- Pills hidden everywhere under reduced-motion (fixer 2
  rule, after the tablet block, beats pill shows by source
  order at equal specificity for CFC/FAERS; base selector
  covers Seoul). Pre-fixer-1 behavior restored; desktop
  normal-motion pills untouched.
- Desktop static: H1-H6 [data-chip] hide bands verified
  present (all min-width 1161px+). H1 boundary re-derived
  exactly (W ~1380.5, VH ~803); H3 static zero at VH
  ~653 re-derived exactly (0.7px overlap at 650). Caveat
  (disclosed by fixer 1, magnitude corrected): desktop
  collage float still runs under reduced-motion, so
  grazes extend just above band edges - my model puts the
  H3 float extension at ~VH 683, not fixer 1's ~VH 703;
  either way hairline (<=1px) and negligible.
- Miniature static: miniature collage float IS killed
  under reduced-motion (miniature stylesheet block), so
  static gaps = rest gaps exactly. Consequence: BOTH rest
  parks (FAERS-docking, SS-glyph) persist statically.
  No miniature reduced-motion chip hide exists. FAIL.
- Tablet static: rest gaps +- float bob (tablet collage
  float is NOT killed under reduced-motion; only the
  <=719 block kills it). Portrait CFC label park persists
  statically in its zone. FAIL (same finding as item 5).
- Verdict: FAIL for miniature + portrait-tablet static;
  PASS for desktop static (hairline caveat) and for all
  loop/pill mechanisms.

## 8. Seam behavior - PASS (one pre-existing flash note)

Reasoned from code (heroBand from viewport matchMedia:
>=1161 desktop, >=720 tablet, else miniature; miniScale
from section clientWidth via ResizeObserver; tablet chip
revival scoped :not(.mv-hero-mini); section loop skips
display:none chips via offsetWidth 0):
- Viewport 720-734 + classic scrollbar (clientWidth
  705-719): mv-hero-mini active, heroBand tablet ->
  miniature renders, miniature loop OFF (requires
  heroBand miniature), mini chips STATIC, section chips
  hidden (1160 hide + :not scope). No doubles. PASS.
- At/above 735 (clientWidth >= 720): miniScale null, no
  mv-hero-mini class, mini chips base display:none,
  section chips follow tablet rules, section loop runs.
  PASS.
- Below 720: mv-hero-mini + heroBand miniature, mini
  chips animate, section chips hidden (1160 hide +
  viewport < 720 excludes the revival block). PASS.
- Pre-existing note (same class as the mobile-mirror
  round's first-mount flash): on first mount at the seam,
  miniScale initializes from window.innerWidth, so one
  frame may show the section path before the observer
  fires. One frame, same mechanism as before, not new.

## 9. Fixer 3 touched desktop/tablet - PASS (with caveat)

Caveat: the working-tree diff is combined (fixers 1+2+3
uncommitted), so hunks cannot be attributed by git;
verification is by content inspection:
- All 7 "mv-mini-chip" occurrences: 3 comments, base
  display:none (leak guard - hides only the new spans
  themselves), .mv-hero-mini-scoped show rule,
  .mv-hero-mini-scoped reduced-motion animation:none,
  JSX spans. No mini-chip rule applies at desktop/tablet
  (base hide is inert there; show/reduced-motion rules
  require the mv-hero-mini class).
- JSX spans render inside .mv-mini (after the collage,
  before </div></section>), carry NO data-chip (no
  cross-talk with fixer 1's [data-chip] hide bands),
  aria-hidden, z-index 2, pointer-events none.
- MINI_CURSOR_CHIPS is a derived const (no section
  behavior change); the miniature loop runs only when
  heroBand is miniature (fixer 1's mechanism).
- Miniature stylesheet non-mini rules match the prior
  rounds' specs exactly (review 36%/2%, poster bottom
  2%, Scopus 62%/19%, Elsevier 27%/bottom 5%, excludes).
- Verdict: PASS. Nothing fixer 3 added renders at
  desktop/tablet.

## Ship recommendation: (b) miniature-only anchor tweaks,
## extended with one tablet-only CFC tweak; Seoul-mini
## disclosed as transient

Why not (a) accept-as-faithful-mirror: the miniature does
faithfully reproduce desktop geometry - but it
CONCENTRATES desktop's conditional parks into
unconditional phone parks. Desktop FAERS-docking parks
only at W < 1380 + VH < 804; desktop SS-glyph parks only
at 1161-1400. On phones both park on EVERY phone, every
cycle (FAERS 8.09s/cycle; SS permanently at rest). A
faithful mirror of a defect is still a defect, and the
phone hero is the most-viewed surface. (a) is not
recommended.

Recommended (b), with directions QA-verified (integration
agent must still re-run the full models before shipping;
directions below are binding-pair verified, not a
substitute for that run):
- FAERS miniature anchorX 0.195 -> 0.26 (fixer 3's
  direction, confirmed): rest clear 37.9 (docking) /
  39.5 (review); worst transient 2.1 deep, 0.73s/cycle
  (docking) and 0.5 (review) - inside budget. Label
  (2.3 clear) and glyph clearances unchanged.
- StrokeSense miniature (0.55, 0.45) -> (0.60, 0.34)
  (QA direction, ellipse-true): fully clear of every
  miniature card, glyph band, and label at all phases.
  Thinnest margins: glyph 3.7px, review 14.9px, scopus
  11.1px, poster ~19px. Note: naive independent-maxima
  worst shows a 4.3px glyph touch and 1.7px label touch,
  but both are artifacts (float applied to non-floating
  glyphs; dx/dy maxima that cannot co-occur on the
  ellipse - up-drift happens at cos ~ 0, not cos -1).
  On-ellipse analysis shows zero overlap. The 3.7px
  glyph margin is thin and must be re-verified by the
  integration run, but it is positive at every phase.
- CFC tablet portrait anchorY 0.38 -> 0.45 (QA direction):
  label-clear at all realistic portrait sizes (at
  768x1024: clear 24.8 rest; at S=924 glyph clear 12.4);
  card pairs clear by the same checks as item 5.
  Caveat: at short portrait stages S < 676 (VH < 776)
  a glyph transient up to 6.3px / 4.2s appears (S=550);
  at S=600 it is 3.8px / 3.2s (marginally over budget),
  at S=668 it is 0.4px / 1.0s (inside). This trades a
  wide-zone rest label park for a short-window shallow
  glyph transient - strictly better, and the common
  sizes (768x1024, 720x768) are fully clean.
- Seoul miniature: NO clean miniature-only fix found
  (quantified trade-offs, all modeled): move up ->
  glyph touch ~6s/cycle; move down -> rest park on
  awards; shrink radius to ~22 or less -> motion killed
  or hairline glyph touch, and duration still marginal.
  Recommend DISCLOSE as transient (same class as the
  desktop residual the user already accepted in the
  rearrangement round, deeper: 23.5 vs ~14.7px). If the
  user wants Seoul fully clean, that requires (c) a
  global Seoul lane re-anchor (desktop + miniature
  together), since the miniature mirrors desktop anchors
  by design.
- Also disclosed for a future (c) decision (not this
  round's scope, anchors frozen): desktop normal-motion
  parks the user has not yet been told about - FAERS vs
  docking (W < 1380, VH < 804, drifting) and SS vs glyph
  (1161-1400, all realistic heights). Fixing those
  globally would also fix the miniature at the source,
  but it is a larger round (new lanes + full re-QA) and
  must not be snuck into this ship.

Bottom line: do NOT ship the miniature as-is (two rest
parks on every phone). Ship after the three tweaks above
(FAERS-mini, SS-mini, CFC-tablet) with Seoul-mini
disclosed as transient; desktop parks disclosed for a
later global round if the user wants them fixed.
