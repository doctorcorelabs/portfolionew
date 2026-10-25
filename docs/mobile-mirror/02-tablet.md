# 02 - Tablet mirror (720-1160px)

Base: `cbfeb35`. All changes in `src/sections/Hero.tsx` only. No push yet.

## Band rules

Stage `S = max(550, VH - 100)` everywhere, as on desktop. Every tablet
un-hide rule is band-split (741-1000, 1024-1160) with a double-class show
selector (e.g. `.mv-collage-show-tablet-stickers.mv-collage-hide-1300`)
that beats the single-class hide rule regardless of source order. The
1001-1023 strip is covered by neither band, so it keeps the old review
(right 31%) + poster (top-right) layout. The 720-740 band is covered by no
tablet show rule, so its PubMed-only state at VH <= 750 is untouched.

### 741-1000

Base items (unchanged): docking left 2.5%/top 3%, faers left 2.5%/bottom 2%,
PubMed left 43%/bottom 5%, Scopus left 36%/top 4.3%, Cochrane left 51%/top 4.3%
(only VH >= 751), Elsevier left 36%/top 16.5% (top-anchored, `bottom: auto`).
Newly shown:

| Item | Rule | Gate |
|---|---|---|
| stickers | show | VH >= 951 |
| notify | show | VH >= 882 |
| posterwindow | show, scaled 0.90 about its center (tilt replaced by `rotate(0deg) scale(0.9)`, so no tilt expansion) | VH >= 790 |
| poster | bottom-right (poster-new) | VH >= 790, else top-right (poster-old) |

Still hidden: review (hide-1000), awards (hide-mid), search, gutaxis, desk
(all hide-1400), helix, microscope (hide-1300), and all chips/pills except
the CFC pill (see below).

### 1024-1160

Base items (unchanged): docking, faers, PubMed as above, Scopus left 28%/
top 3%, Cochrane left 28%/top 15% (only VH >= 751), Elsevier left 30%/
bottom 5%. Newly shown:

| Item | Rule | Gate |
|---|---|---|
| stickers | show | VH >= 951 |
| notify | show | VH >= 882 |
| poster | bottom-right (poster-new), full size | VH >= 810, else top-right (poster-old) |
| awards | right 29% with poster-new / right 27% with poster-old, scale 1.00 | VH >= 810 switches the pair |
| review | left 44%/top 2% (review-new) | VH >= 850 (UNCHANGED from rearrangement); else right 31%/top 3% (review-old) |
| posterwindow | show, scaled 0.90, ONLY with poster-new | VH >= 810 |

Still hidden: search, gutaxis, desk (hide-1400), helix, microscope
(hide-1300). Posterwindow is deliberately NOT shown with poster-old: the
two share the right column and collide head-on.

## Deviations from the brief, with measured justification

### Awards at scale 1.00, not 0.90 (JUSTIFIED)

The brief suggested awards at 0.90 with poster-new; the fixer kept 1.00 and
shifted awards right 27% -> 29% instead. The binding pair awards-poster-new
at 1024x810 measures x gap 8.53px tilt-adjusted (awards right 728.11,
poster-new left 736.64, y-overlap exists, so the x gap binds) - positive
and clean. Awards vs PubMed (bottom row) is also positive (rest 18.72,
tilt-adjusted ~14.07). The R29% shift alone clears the pair, and keeping
the card at full size keeps it readable. Do not fail this deviation.

### Poster-new at full size, not 0.95 (BENIGN)

The brief said poster-new 0.95 at 1024-1160, but no poster scale rule was
shipped: poster-new at 1024-1160 uses the rearrangement rule (bottom 2%,
full size 260x204). No claimed gap tests a poster-new scale, and every
poster-new pair measures clean at full size (awards 8.53 binding gap above;
CFC pill y-separated by 158px+ worst; posterwindow gated to poster-new).
Recorded as a deviation, not a defect, unless a future check proves a
poster-new overlap.

### Desk stays hidden, awards takes priority (CORRECT DECISION)

Desk vs awards at 1024x768, if desk were shown: rest overlap ~170x127
(tilt-adjusted ~170x135 worst with float). The fixer's claimed 186x142
does not reproduce exactly under any desk/awards size variant tried
(off by ~16px x, ~6-13px y), but the conclusion stands: the two are both
bottom-anchored in the same band and collide head-on, so they are mutually
exclusive and awards (the user's own award card) correctly wins. Desk
stays hidden at tablet. The figure discrepancy is a measurement note, not
a defect, since desk never renders.

### CFC pill returns at right 40% / 30%, not 14% (JUSTIFIED)

The brief's right 14% collides with poster-new at short stages. The
shipped rule (bottom 30% kept, right 40% at 768-1000, right 30% at
1024-1160) measures clean: CFC vs notify at 768x882 (notify's first
shown height under the 882 gate; the x gap is VH-independent since both
are bottom-anchored) is x gap 14.7 rest /
6.7 parallax-worst (8.2 worst with a 112px pill width; positive in all
metric variants, and the pair y-overlaps so the x gap binds); CFC vs
poster at 1024x700 is x gap 19.8 rest / 11.8 parallax-worst, and the pair
is y-separated by 158px+ worst anyway (non-binding, clear). The 741-767
range keeps the pill hidden: the tablet diorama block starts at 768, and
the model crossover for a worst-phase CFC-notify overlap at right 40% is
around width 756, so the 768 cutoff is conservative (12px margin), not
exact, but safe.

### FAERS pill returns only at VH >= 1091 (GATE SURVIVES)

The tablet FAERS show rule (`.mv-diorama-pill.mv-diorama-pill-faers`,
0,2,0) beats the tablet block's pill-none (0,1,0) only where the shipped
gate does not apply: min-width 720 + max-height 1090 -> display none. At
VH <= 1090 both the gate and pill-none hide it; at VH >= 1091 it shows.
At desktop >= 1161 the pill shows at VH >= 1091 by the base rule. The
gate threshold is unchanged.

### Chips hidden everywhere, Seoul pill hidden

The tablet diorama block revives only the container and the two pills
(`.mv-diorama-chip { display: none; }` plus the base hides). Chips stay
hidden on touch tablets (via `hover: none` and the explicit chip rule)
and on mouse/trackpad tablets (via the explicit chip rule; the laptop
lanes do not transfer to tablet geometry). The Seoul pill has no marker
class and no show rule, so it stays hidden at tablet. The reduced-motion
guard placed AFTER the tablet block re-hides the diorama for
reduced-motion users at every width, repeating existing desktop behavior.

## Gates: kept exactly as shipped

notify 850 desktop hide / 882 tablet show, stickers 950/951, posterwindow 789/790 and 809/810, FAERS
pill 1090/1091, review-new 849/850, Cochrane 750/751 - all confirmed from
rule text (min-height thresholds). Consequence, unchanged from the
analysis: landscape tablets (VH ~768) are partial mirrors (notify,
stickers, microscope still hide below 882/950/800), portrait tablets
(VH 1024+) are full mirrors. Do not lower the gates for tablets: that
would reintroduce the desktop short-stage overlaps they were built to
kill. The ungated returnees (awards, poster-new, posterwindow-with-new)
were validated at short stages as part of this round.

## Integration notes

- The tablet diorama block beats BOTH the 1160 hide and the 900 pill hide
  by source order at equal specificity (0,1,0 for the container rule), so
  the CFC/FAERS pills revive on touch tablets too, not just mouse tablets;
  the operative chip hide in tablet bands is the explicit chip rule, not
  `hover: none`. Outcome unchanged: chips hidden, pills shown.
- The posterwindow tablet rule and the miniature exclude rule do not
  conflict: the exclude rule is class-scoped (`.mv-hero-mini`), the show
  rule is media-scoped (741-1000 / 1024-1160); they never apply together.
- The 719px stack block and the tablet blocks are separate systems; the
  miniature class gate (clientWidth) is what decides between them below
  720, per 01-phone-miniature.md.

## QA result for tablet

Full pair grids at 741/768/1024/1100/1160 crossed with VH 700-1138: 0
collage-collage overlaps under the fixer's model, and 0 under the
corrected faers height after the B1 micro-fix (tablet notify gate raised
851 -> 882; see 03-final-qa.md, B1 resolution). All claimed tablet gaps reproduce (see the
verification table there); two of them (awards-posterwindow 4.3,
awards-poster 6.7) reproduce as x-gaps on pairs that are y-separated by
140px+, so they are non-binding but clear, not binding margins.
