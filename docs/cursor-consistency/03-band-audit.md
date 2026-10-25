# Cursor consistency: band audit (read-only)

Base: HEAD `1255c6f`, `src/sections/Hero.tsx`. User complaint: cursor
chips show only on desktop; they want them consistent everywhere, with
livelier movement. Fixers implement from the table at the end.

## 1. What shows now, and which rules hide the chips

The diorama is one section-level layer (absolute inset 0, z-index 2,
pointer-events none, aria-hidden) holding 4 chips and 3 pills. Chips
are a 14x17 cursor SVG plus a label pill (JetBrains Mono 11px, padding
3px 8px). Measured native sizes: FAERS ~73px, StrokeSense ~116px,
Code for Cure ~130px, Seoul 2026 ~109px wide; all ~19px tall. Drift
is rAF-driven: radius 20px (drift boxes are chip width + 40 by 47px),
durations 18/22/16/24s, vertical squash 0.7. Converge toward the word
edge happens only while the word is hovered.

Four rules hide chips today:

- `@media (hover: none)` hides the whole diorama, killing chips on
  every touch device, including touch laptops and touch iPads.
- `@media (max-width: 1160px)` hides the whole diorama, killing
  chips on mouse/trackpad iPads and narrow desktop windows.
- The tablet block (768-1000 and 1024-1160 only) returns the container
  with `.mv-diorama-chip { display: none }` and revives only pills
  (see section 5). The 720-767 and 1001-1023 strips have no tablet
  block rule, so the container stays fully hidden there.
- Two `prefers-reduced-motion` guards hide the diorama, the second
  after the tablet block.

The rAF loop itself is gated to `(hover: hover) and (pointer: fine)`
and not reduced-motion, so on tablets and phones it never runs.

Desktop lanes (fractions of stage width and height, S = VH - 100):
above 1400px, FAERS 0.195/0.30, StrokeSense 0.55/0.33, Code for Cure
0.30/0.695, Seoul 0.80/0.695. In 1161-1400 the rearrangement companions
move StrokeSense to 0.45 (CSS base top 45% plus JS lane) and Seoul to
0.70 (CSS base right 30% plus JS anchor), because the moved review and
poster cards would otherwise collide with the chips. These companions
are desktop-only by construction.

## 2. Why desktop lanes do not transfer to tablet or phone

Tablet S still follows VH - 100 (924 at 768x1024, 668 at
1024x768), but cards keep fixed pixel sizes while chip lanes are
fractions of a narrower stage. The
de-overlap round already concluded chips rest on cards at every
tablet width, which is why the 1160px hide exists. One check needing
no card dimensions confirms it: at 768px wide the word is 72px (the
903px cap), so the frame spans roughly x 134-634, and all four chip
x-centers (FAERS 150, Code for Cure 230, StrokeSense 422, Seoul 614)
fall inside that x-range. The lanes are not margin lanes at tablet
width. Fixers must design new per-band anchors and re-measure every
chip-vs-card pair (at minimum: FAERS vs docking, StrokeSense vs
review-new, Code for Cure vs faers card, Seoul vs awards and
poster-new).

On portrait phones the hero is the frozen 1160x600 miniature, scale =
clientWidth/1160: 0.276 at 320px (hero 165.5px tall), 0.336 at 390px
(201.7px), 0.620 at 719px (371.9px). The diorama is rendered OUTSIDE `.mv-mini`, so it is not scaled
today, and it is hidden anyway by hover:none and the 1160px rule. The miniature's 8 cards
keep the 1161-1400 short-state anchors, so desktop fractions would
clear the cards inside the miniature exactly as they do on desktop,
including the known residuals scaled down (StrokeSense vs review
+0.58px at 390px; Seoul vs awards graze ~4.9px).

## 3. The three mechanisms, measured

(a) Chips inside the miniature wrapper (scaled). At 390px a FAERS
chip is ~25px wide with 3.7px label text, drift 6.7px visually; at
320px ~20px wide with 3.0px text and 5.5px drift. Readable: no.
Crowding: none (clearances inherit desktop). Motion: invisible at
radius 20, visible only amplified (section 4).

(b) Native-size chips overlaid on the hero. On tablets this is
feasible with new anchors: at 768px a 73-130px chip is 10-17% of
stage width, and S = 668-924px gives real vertical room. On portrait
phones it is not feasible: at 390px the miniature word is 60px, so
the frame spans ~385px, about 99% of hero width, and the top and
bottom card bands are already full. Only about one native chip fits
in a free pocket (the top-right gap right of Scopus, ~113px visual);
four do not fit without covering the word, the frame, or cards.
Covering the word is unacceptable: desktop never covers it.(c) An intermediate chip scale. On phones 0.5x still gives 5.5px
label text (illegible) while doubling crowding versus (a); on
tablets 0.8x gives 8.8px text (still illegible) while saving almost
no space versus native. It solves neither readability nor crowding,
so it is rejected.

Recommendation: one system, two renderings, because no literal
single mechanism satisfies both bands. Tablets get (b), native-size
chips with new per-band anchors. Portrait phones get (a), the same
4 chips in the same lanes inside the miniature, with drift amplified
in design pixels so motion stays visible. Identity, lanes, colors,
and drift behavior are identical across bands; only rendered size
adapts, exactly as the collage itself already does. The user-visible
promise is: same 4 chips, same places, same motion, everywhere.

## 4. Livelier movement, and what is safe

Two separate knobs. Duration sets speed only; radius sets extent.

Safe now, zero clearance impact: shorten durations. The drift box
depends on radius alone, so faster loops stay inside every
QA-verified margin. Recommended: FAERS 18s to 12s, StrokeSense 22s
to 14s, Code for Cure 16s to 11s, Seoul 2026 24s to 15s, about 1.6x
faster everywhere, desktop included.Not safe on desktop: growing radius 20px to 34px. The desktop
binding margins are thinner than the growth: StrokeSense vs review
is +1.72px at VH 650 in 1161-1400, so +14px radius inverts it to
roughly -12px overlap, and the Seoul vs awards graze deepens.
Desktop keeps radius 20 until those two pairs are re-anchored.
New tablet and phone anchors must be designed with a 34px drift
budget from the start. For the miniature, radius 40 design px gives
11.0px visual drift at 320px, 13.4px at 390px, 24.8px at 719px,
which reads as real motion without breaking miniature clearances
(binding miniature gaps are 21px or more worst-phase).

Touch has no hover, so converge can never fire there; phones and
touch tablets get drift-only motion. The loop math already modulates
phase by scroll (up to a quarter loop), so scrolling drives visible
motion once the loop runs on touch. On hover-capable tablets,
converge works as desktop.JS gating and perf: today the loop does not run where chips are
hidden, which is correct. When chips return, the fixer must gate the
loop to chip-visible bands only, using cached matchMedia listeners,
and skip DOM writes for any chip whose computed display is none. Keep the existing offscreen pause and the
tab-hidden rAF pause. The miniature needs a loop mode of its own:
design coordinates (1160x600 stage), transforms written in design
pixels so the wrapper scale applies them, drift-only (no converge,
no word-rect mapping). An ungated loop on every phone would cost
battery for invisible chips, so the gate is mandatory, not optional.

## 5. Pills: out of scope, do not touch

Do not move, rename, or re-scope these rules. CFC pill at tablet: right 40% (768-1000)
and right 30% (1024-1160), bottom 30%. FAERS pill: hidden at VH at
most 1090px on desktop and shown at tablet only at VH at least
1091px. Seoul pill: hidden at tablet (no show rule) and at left
59%, top 32% on desktop. CFC pill laptop companion: bottom 45% in
1161-1400. Pills hidden at max-width 900px, under reduced-motion,
and everywhere the container is hidden. If the fixer returns the
container in the 720-767 and 1001-1023 strips for chips, pills must
stay hidden there: do not extend any pill show rule into the strips.## 6. Per-band table

| Band | Chips now | Chips target | Pills (unchanged) | Loop mode |
|---|---|---|---|---|
| Above 1400px | 4 shown | Unchanged | Seoul left 59% top 32%; CFC bottom 30%; FAERS VH above 1090 | Drift + converge, hover:fine only |
| 1161-1400px | 4 shown, 0.45/0.70 companions | Unchanged | CFC bottom 45%; Seoul left 59%; FAERS VH above 1090 | Drift + converge, hover:fine only |
| 1024-1160px | Container returns, chips hidden | 4 chips native, NEW anchors, radius 34, durations 12/14/11/15s | CFC right 30%; FAERS VH at least 1091; Seoul hidden | Drift-only touch; +converge hover |
| 768-1000px | Container returns, chips hidden | 4 chips native, NEW portrait anchors, radius 34, durations 12/14/11/15s | CFC right 40%; FAERS VH at least 1091; Seoul hidden | Drift-only touch; +converge hover |
| 720-767px and 1001-1023px | Container fully hidden | Container returns, 4 chips native, NEW anchors | Stay hidden (do not extend pill rules) | Drift-only touch; +converge hover |
| Below 720px miniature | Diorama outside wrapper, hidden | 4 chips INSIDE `.mv-mini`, drift-only, radius 40 design px, durations 12/14/11/15s | None, stay hidden | Miniature-mode rAF, design coords, no converge |
