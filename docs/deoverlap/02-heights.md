# Viewport-height overlap audit: hero collage

Scope: desktop hero only (widths 1440 and 1920). Mobile is a static
stack and cannot overlap this way; tablet is covered in
docs/deoverlap/04-tablet.md. Report only: no site edits, no build.
Method: code inspection plus px modeling only. No live browser check
was possible (the sandbox blocks localhost preview), so every figure
below is computed from source, not measured on screen. Heights marked
EST are summed from each card's own padding, font sizes, line heights,
and image aspect ratios; they are accurate to roughly plus or minus
5px, and every threshold below inherits that tolerance.

## 1. The stage model

The collage layer is absolute inset 0 (Hero.tsx line 672), so its
percentage top/bottom positions resolve against the section height,
not the viewport height. The section (Hero.tsx lines 537-549) is
height calc(100dvh - 100px) with minHeight 550 and 80px top/bottom
padding, so the stage height S is:

| Viewport height VH | 600 | 700 | 768 | 800 | 860 | 900 | 1080 |
| Stage S = max(550, VH - 100) | 550 | 600 | 668 | 700 | 760 | 800 | 980 |

At VH 600 the minHeight binds: the stage is 550 tall, not 500.

The centered word block: label about 46px (12px text plus 32px
margin) plus frame 227px (28px padding top and bottom plus the word
at 180px cap times 0.95 line height). The frame is centered in the
content box (S minus 160px padding), so, with S as the stage height:

- Label band: [0.5S - 136.5, 0.5S - 90.5]
- Frame band: [0.5S - 90.5, 0.5S + 136.5]
- Glyph band: [0.5S - 62.5, 0.5S + 108.5]
- Word width at the 180px cap: 1026px (measured in the earlier
  desktop audit with fontTools). Glyph x-range: 207 to 1233 at width
  1440; 447 to 1473 at width 1920. Frame x-range: 140 to 1300 at
  1440; 380 to 1540 at 1920.

Float (Hero.tsx lines 684-689) is translateY only, 0 to -8px, with
desynced durations and delays per item. Worst phase for any vertical
gap is therefore 8px: the upper item at rest and the lower item 8px
up. Tilt (inner wrapper, static rotate) grows each item's bounding
box vertically by about W times sin(angle): card-a -3deg about 12px
on a 230px card (6px per side), card-b 2deg about 8px on 240px
(4px per side), card-c -1deg about 4px on 210px (2px per side),
card-d 1deg about 1px on 69px, sticker-b 4deg about 25px on 363px
(13px per side), window-b 1deg about 5px on 260px (2px per side),
window-a 0deg zero. "Worst" in this report means rest gap minus
8px float minus both items' tilt extensions. Worst-phase alignment
is transient but recurring, since float periods differ (9 to 16s).

Z-order (Hero.tsx lines 672-676, 939, 959): collage z 0, frame and
word z 1, diorama z 2. A collage item behind the word is therefore
never covered glyph-wise, but it still reads as crowded, which is
why section 4 (word-band intrusions) is reported separately from
section 3 (true item-item overlaps, same z layer).

The diorama (cursor chips and pills, z 2) is excluded from the
tables: it follows the pointer by design, so its overlaps with cards
are transient pointer behavior, not layout bugs. The "Powered by
Netlify" badge in the screenshot is injected by Netlify, not part
of the site, and is also excluded.

## 2. Card heights (EST) and positions

Heights are content sums from each component file. Widths are the
COLLAGE_ITEMS style widths or the component's own width.

| Item | Size (W x H, px) | Position (Hero.tsx) | Hide rules |
| DockingCard | 230 x 183 | left 2.5%, top 3% | mobile-hide |
| DnaHelix | 100 x 250 | left 27%, top 2% | hide-mid, mobile-hide, hide-short |
| ReviewCard | 220 x 207 | right 29%, top 3% | mobile-hide, hide-1000 |
| FaersCard | 240 x 168 | left 2.5%, bottom 4% | none (always visible) |
| StrokeCard | 260 x 115 | right 2.5%, bottom 5% | mobile-hide |
| SearchWindow | 260 x 229 | left 36%, top 2% | hide-1400 |
| PosterWindow | 280 x 355 | right 2.5%, top 11% | hide-1400 |
| MicroscopeCard | 210 x 194 | left 2.5%, bottom 39% | hide-1300 |
| DeskCard | 220 x 199 | left 53%, bottom 3% | hide-1400 |
| NotifyBubble | 319 x 52 | left 2.5%, bottom 25% | hide-720-1160 |
| Stickers | 363 x 26 | left 2.5%, top 32% | hide-1300 |
| DbPubmedFloat | 100 x 50 | left 43%, bottom 5% | mobile-hide |
| DbElsevierFloat | 104 x 50 | left 70%, bottom 5% | mobile-hide, hide-1400 |
| DbScopusFloat | 100 x 50 | left 20%, top 3% | mobile-hide, hide-1400 |
| DbCochraneFloat | 69 x 82 | left 20%, top 15% | mobile-hide, hide-1400, hide-750 |
| PosterCard | 260 x 197 | right 2.5%, top 2% | mobile-hide, hide-min-1400 |
| GutAxisCard | 230 x 172 | left 25%, bottom 3% | mobile-hide, hide-1400 |
| AwardsCard | 168 x 124 | right 25%, bottom 4% | hide-mid, mobile-hide, hide-min-1400 |

Visible set at widths 1440 AND 1920 (identical, since every
width rule flips at 1400 or below): docking, helix (only when
VH above 700), review, faers, stroke, search, posterwindow,
microscope, desk, notify, db-pubmed, db-elsevier, db-scopus,
db-cochrane (only when VH above 750), stickers. That is 15 items,
14 when VH is 700 or below (no helix, no cochrane). PosterCard,
GutAxisCard, and AwardsCard are hidden at 1401px and above, so
pairs involving them cannot occur at the modeled widths. In
particular poster and posterwindow never coexist (poster shows at
1400 and below, posterwindow above 1400), so the tall window's
collision partner on the right is stroke, not poster.

Top-anchored spans are [pS, pS + H]; bottom-anchored spans are
[(1 - p)S - H, (1 - p)S], with p the percentage and H the height.

## 3. True item-item overlaps (same z layer)

All five left-column items share x from 2.5% of width (docking 230,
stickers 363, microscope 210, notify 319, faers 240), so every left
pair x-overlaps and the vertical gap decides. The right column
(right 2.5%: posterwindow 280, stroke 260) likewise x-overlaps. All
other pairs either x-clear or have vertical gaps that never close;
they are listed after the tables. Positive numbers are gaps,
negative numbers are overlaps, in px, at rest position.

### 3a. Left column, rest position

| Pair (gap formula) | S 550 (VH 600) | S 600 (VH 700) | S 668 (VH 768) | S 700 (VH 800) | S 760 (VH 860) | S 800 (VH 900) | S 980 (VH 1080) |
| Docking / stickers (0.29S - 183) | -24 | -9 | +11 | +20 | +37 | +49 | +101 |
| Stickers / microscope (0.29S - 220) | -61 | -46 | -26 | -17 | 0 | +12 | +64 |
| Microscope / notify (0.14S - 52) | +25 | +32 | +42 | +46 | +54 | +60 | +85 |
| Notify / faers (0.21S - 168) | -53 | -42 | -28 | -21 | -8 | 0 | +38 |
| Microscope / faers, non-adjacent (0.35S - 168) | +25 | +42 | +66 | +77 | +98 | +112 | +175 |

### 3b. Left column, worst float plus tilt phase

Subtract 27px (docking/stickers), 23px (stickers/microscope),
21px (microscope/notify), 23px (notify/faers), 14px
(microscope/faers) from the rest gaps:

| Pair | S 550 | S 600 | S 668 | S 700 | S 760 | S 800 | S 980 |
| Docking / stickers | -51 | -36 | -16 | -7 | +10 | +22 | +74 |
| Stickers / microscope | -84 | -69 | -49 | -40 | -23 | -11 | +41 |
| Microscope / notify | +4 | +11 | +21 | +25 | +33 | +39 | +64 |
| Notify / faers | -76 | -65 | -51 | -44 | -31 | -23 | +15 |
| Microscope / faers | +11 | +28 | +52 | +63 | +84 | +98 | +161 |

### 3c. Right column: posterwindow / stroke

Gap formula 0.84S - 470, rest: S 550: -8 (overlap 8px);
S 600: +34; S 668: +91; S 700: +118; S 760: +168; S 800: +202;
S 980: +353. Worst phase (minus 13px): S 550: -21; S 600: +21
and clear above. So this pair collides only at VH 600.

### 3d. Threshold heights per pair

"Rest zero" is the VH where the rest gap hits zero; "worst zero"
is the VH where even the worst float plus tilt phase clears.
Below the rest zero the pair overlaps constantly; between rest
zero and worst zero it overlaps transiently at float extremes.

| Pair | Rest zero (VH) | Worst zero (VH) | Verdict |
| Docking / stickers | 731 | 824 | Overlaps constantly below VH 731, transiently to VH 824 |
| Stickers / microscope | 859 | 938 | Overlaps constantly below VH 859, transiently to VH 938 |
| Microscope / notify | never (worst zero S 521, below the 550 stage floor) | never | Safe at every stage |
| Notify / faers | 900 | 1010 | Overlaps constantly below VH 900, transiently to VH 1010 |
| Posterwindow / stroke | 660 | 675 | Overlaps only at VH 600 (rest 8px, worst 21px) |
| Microscope / faers | never (worst zero S 520, below floor) | never | Safe, thinnest worst gap +11px at VH 600 |
| Scopus / helix (x gap, width 1440) | 1px rest gap at every height, 0px at worst tilt | n/a | Graze, not an overlap; clear 34px at width 1920 |

All other visible pairs clear at every modeled height. The
checked-and-clear list: docking against microscope, notify, and
faers; stickers against notify and faers; search against review
(24px x-gap at 1440, 192px at 1920), helix (29px at 1440, 73px at
1920), and db-pubmed (vertical gap never closes); review against
desk (vertical gap never closes), db-pubmed (83px x-gap at 1440),
stroke, and posterwindow (122px x-gap at 1440); desk against
db-elsevier (25px x-gap at 1440, 106px at 1920), db-pubmed (44px at
1440), and stroke (161px at 1440); db-elsevier against stroke
(32px x-gap at 1440); db-scopus against cochrane (vertical gap
16px at S 550 growing to 68px at S 980, worst phase still
positive); cochrane against helix (32px x-gap at 1440, 65px at
1920); db-scopus against search and review (x-clear).

Headline: the left column is over-constrained at short stages.
Percentage positions shrink with S while card heights stay fixed,
so no repositioning of one item clears the chain: moving notify up
to clear faers squeezes it into microscope, and moving stickers up
to clear microscope squeezes them into docking. Section 6 gives
the hide-based fix that actually clears it.

## 4. Word-band and frame-zone intrusions (z-masked, still crowded)

The frame and word paint above the collage (z 1 vs z 0), so no
glyph is ever covered. But a card sitting behind the word or
straddling the dashed frame edge still reads as crowded, which is
what the user is complaining about. These are intrusions, not
same-layer overlaps. Rest figures; worst phase extends each by
roughly the item's float plus tilt where noted.

### 4a. Into the glyph band (x-overlap with the 1026px word)

| Item | Width 1440 (glyphs 207-1233) | Width 1920 (glyphs 447-1473) |
| Microscope (x 36-246 / 48-258) | Overlaps at EVERY height: 123px vertical at S 550 rising to 170px at S 980, times 39px horizontal (the word's first glyphs) | Clear (card ends 258, glyphs start 447) |
| Posterwindow (x 1144-1424 / 1592-1872) | Overlaps at EVERY height: 171px vertical at S 550 shrinking to 35px at S 980, times 89px horizontal (the word's last glyphs); clears only above VH 1170 | Clear (no x-overlap) |
| Notify (x 36-355 / 48-367) | Rest overlap to VH 742 (23px at VH 600, 11px at VH 700); worst phase to VH 818 | Clear (no x-overlap) |
| Desk (x 763-983 / 1018-1238) | Rest overlap to VH 754 (49px at VH 600, 26px at VH 700); worst phase to VH 776 | Same vertical figures (x inside glyph range at both widths) |
| Faers (x 36-276 / 48-288) | Rest overlap to VH 701 (24px at VH 600, 1px graze at VH 700); worst phase to VH 727 | Clear (no x-overlap) |
| Search (x 518-778 / 691-951) | Rest overlap to VH 707 (28px at VH 600, 4px at VH 700); worst phase to VH 711 | Same vertical figures |
| Review (x 802-1022 / 1143-1363) | Rest overlap to VH 673 (11px at VH 600 only) | Same vertical figures |
| Helix (x 389-489 / 518-618) | No overlap at modeled heights, BUT see the unmodeled window in section 5: VH 701 to 750 overlaps up to 24px | Same window |
| Stickers, docking, db-scopus, db-cochrane, db-pubmed, db-elsevier, stroke | Clear of glyphs at every modeled height (docking clears by 13px rest, 7px worst, at VH 600) | Same, except stickers clear of glyphs entirely at 1920 |

### 4b. Straddling the dashed frame edge

| Item | Behavior |
| Notify vs frame bottom edge | Tucks under the frame bottom edge at rest to VH 854 (51px at VH 600, 39px at VH 700, 22px at VH 768, 14px at VH 800); worst phase to VH 930 |
| Faers vs frame bottom edge | Tucks at rest to VH 762 (52px at VH 600, 29px at VH 700); worst phase to VH 788 (9px at VH 768) |
| Desk vs frame bottom edge | Tucks at rest to VH 814 (77px at VH 600, 54px at VH 700, 22px at VH 768, 7px at VH 800); worst phase to VH 835 |
| Stroke vs frame bottom edge | Tucks only at VH 600 (4px rest, 17px worst) |
| Search vs frame top edge | Tucks at rest to VH 766 (56px at VH 600, 32px at VH 700); worst phase graze about 1px at VH 768 |
| Review vs frame top edge | Tucks at rest to VH 733 (39px at VH 600, 16px at VH 700) |
| Helix vs frame top edge | Tucks at rest to VH 809 (20px at VH 768, 5px at VH 800); hidden at VH 700 and below, so the tuck is visible at VH 768 and 800 |
| Stickers vs frame top edge | Tucks at rest to VH 747 (18px at VH 600, 9px at VH 700); worst phase to VH 819; x-overlap with the frame edge is 259px at 1440 but only 31px at 1920 |
| Docking vs frame top edge | Tucks at rest to VH 682 (15px at VH 600); worst phase to VH 695 |
| Posterwindow vs frame right edge (width 1440 only) | Crosses the frame's right edge (x 1300) at every height: crossing band 227px vertical at S 550 shrinking to 63px at S 980; clear at 1920 (window starts 1592, frame ends 1540) |
| Search vs label band | Sits behind the centered label (label paints above, so text stays readable) to VH 861: 46px of the label band at VH 600, 45px at VH 768, 30px at VH 800, 1px graze at VH 860; x-overlap 137px at 1440, 70px at 1920 |
| Review vs label band | 3px x-gap from the label zone at 1440 and vertical overlap to VH 831, so only a 1px tilt graze at VH 600 to 700; clear at 1920 |

## 5. Deep dives

### 5a. NotifyBubble vs FaersCard (the screenshot pair)

Both sit in the left column at left 2.5%: notify is 319 wide and
52 tall at bottom 25%, faers is 240 wide and 168 tall at bottom 4%.
Their x-ranges fully overlap (notify covers faers' full width), so
the vertical gap is the whole story: rest gap 0.21S - 168.

| Stage | S 550 (VH 600) | S 600 (VH 700) | S 668 (VH 768) | S 700 (VH 800) | S 760 (VH 860) | S 800 (VH 900) | S 980 (VH 1080) |
| Notify span | 361-413 | 398-450 | 449-501 | 473-525 | 518-570 | 548-600 | 683-735 |
| Faers span | 360-528 | 408-576 | 473-641 | 504-672 | 562-730 | 600-768 | 773-941 |
| Rest gap | -53 | -42 | -28 | -21 | -8 | 0 | +38 |
| Worst gap | -76 | -65 | -51 | -44 | -31 | -23 | +15 |

The pair overlaps at rest at every modeled height except VH 1080
(and exactly touches at VH 900), and in worst float plus tilt
phase at every modeled height except VH 1080. Rest zero is VH 900,
worst zero is VH 1010. No hide rule touches either item: notify
hides only by width (720 to 1160), faers never hides. This is a
rest-position layout bug, not an animation artifact: at the
screenshot's short stage the bubble sits on the card even with
float frozen.

### 5b. Do hide-short and hide-750 help or hurt?

hide-short (Hero.tsx lines 756-760, max-height 700px) hides only
the helix among visible items. It helps: without it the helix
would overlap the glyph band by 49px at VH 600 and 25px at VH 700.
But its threshold is about 50px too low. The helix bottom crosses
the glyph top at S 651 (VH 751), so the window VH 701 to 750 is
exposed: the helix is visible there and overlaps the glyph band by
up to 24px (at VH 701, shrinking to zero at VH 751). The frame-top
tuck persists further, to VH 809, but that is z-masked edge
crossing, not glyph overlap. Verdict: hide-short helps, but it
should be max-height 750px for the helix (the same reasoning that
already gave Cochrane its hide-750 rule).

hide-750 (lines 761-765, max-height 750px) hides only Cochrane.
In this model it removes no actual overlap: the Scopus/Cochrane
vertical gap is 16px at S 550 and grows with S, and Cochrane never
reaches the glyph band (its bottom crosses the glyph top only
below S 413, under the 550 stage floor) or the frame top edge
(only below S 493). The comment on the Cochrane item claims the
Scopus gap would close below stage 651; this model computes a
28px rest gap at S 651 (18px worst phase), so that rationale does
not reproduce from the current tile geometry (69x82 Cochrane,
50px Scopus). hide-750 is harmless safety margin, not load-bearing,
and it costs one logo on short screens. Leave it or drop it; it
does not affect any overlap in the tables.

Neither rule helps the headline pairs: notify/faers,
stickers/microscope, and docking/stickers have no height-based
hide at all, which is why they collide at short heights.

## 6. Concrete suggestions (not implemented)

Ranked by impact. All keep the scattered collage feel on tall
screens; hides are height-gated so the full collage returns above
the threshold. File for every change: src/sections/Hero.tsx
(COLLAGE_ITEMS styles plus the stylesheet hide rules around lines
713-765).

S1. Notify/faers (headline fix). Three coordinated changes:
(a) faers bottom 4% to 2%; (b) notify bottom 25% to 28%;
(c) new rule hiding notify at max-height 850px. Predicted: the
pair gap becomes 0.26S - 168, clearing at rest from VH 746 and in
worst phase from VH 835, and notify is hidden below VH 850
anyway, so the pair overlaps at no height, rest or worst phase.
Microscope/notify stays clear (gap 0.11S - 52, worst-phase
positive from S 664, so clear wherever notify is visible). Costs: notify invisible
on 768 and 800 tall screens (its facts also appear on the poster
card, so nothing informational is lost); faers sits 11 to 20px
from the section bottom edge instead of 22 to 39px. Compromise if
that cost is too high: hide below VH 800 instead of 850, which
keeps the bubble on 800 tall screens and accepts at most a 9px
transient worst-phase graze at VH 800 to 835.

S2. Stickers/microscope (second headline fix). New rule hiding
stickers at max-height 860px. Predicted: removes the rest overlap
below VH 859 and the worst-phase overlap below VH 938 for this
pair, removes the stickers frame-top tuck, and also clears
docking/stickers (rest zero VH 731, worst zero VH 824, both below
860). Cost: the three topic pills vanish on shorter screens.
Alternative with the same clearance: hide microscope below VH 860
instead, but that removes a large photo card rather than three
small pills, so stickers is the cheaper hide. After S2, one
residual remains: docking/microscope worst-phase graze up to 6px
at VH 768 only (rest gap +10px). Accept it, or add a microscope
hide below VH 800 for strict zero.

S3. Posterwindow/stroke (right column, VH 600 only). Primary:
stroke bottom 5% to 2%. Predicted: rest gap becomes 0.87S - 470,
clear at every stage (8px at S 550); worst phase clears from
VH 655, leaving at most a 5px transient graze at VH 600. Strict
alternative: hide posterwindow below VH 700. That guarantees zero
but removes the poster preview on short screens, where the 355px
window eats 65% of the stage height.

S4. Helix window. Change the helix hide from hide-short
(max-height 700px) to a max-height 750px rule. Predicted: closes
the VH 701 to 750 glyph-overlap window (up to 24px) with no other
effect, since the helix already hides below VH 700. The frame-top
tuck to VH 809 remains; it is z-masked and small (20px at VH 768,
5px at VH 800), so accept it unless the user wants zero tuck
everywhere (see S7).

S5. Scopus/helix graze at width 1440 (optional, cosmetic). Move
db-scopus and db-cochrane together from left 20% to left 19%
(both must move, or the aligned column breaks). Predicted: the
1px rest gap at 1440 becomes about 15px; the 1920 gap grows from
34px to about 53px; the Cochrane/Scopus vertical gap is
unchanged.

S6. What NOT to do: do not fix the left column by moving notify
up alone. Proof from the chain: clearing notify/faers in worst
phase at VH 768 needs notify bottom minus faers bottom at least
0.286, while clearing microscope/notify in worst phase at VH 768
needs notify bottom at most 0.278. No single notify position
satisfies both, so any pure repositioning just moves the collision
to the neighboring pair. The hide in S1 plus the hide in S2 is
what breaks the chain.

S7. Word-band tucks (structural, only if the user wants zero tuck
as well as zero item-item overlap). The 1440-only tucks
(microscope behind the first glyphs at every height, posterwindow
behind the last glyphs at every height) come from the 1026px word
leaving only 207px side margins at width 1440. Options, each with
a cost: (a) hide microscope below 1500px width (it already hides
at 1300px and below; at 1920 it is clear anyway); (b) hide
posterwindow below 1500px width (loses the poster preview in the
1440 to 1500 band, where the poster card is already hidden above
1400); (c) shrink the word at short heights with a max-height
rule (a smaller word lifts the glyph band and frame bottom,
buying bottom-band clearance everywhere, but changes the hero's
signature scale); (d) grow the stage (raise minHeight above 550
or reduce the -100px offset), which buys clearance at short
heights only. The center items' short-height glyph intrusions
(search, review, desk) shrink with any of (c) or (d) and vanish
above VH 800 either way. Do not pursue S7 until S1 to S4 land;
S1 to S4 fix every same-layer overlap, and the remaining tucks
are all z-masked (glyphs always paint above the collage).

## 7. Screenshot consistency and live checks owed

The user's screenshot (wide, short desktop stage) is consistent
with a stage around S 700 or below (VH 800 or below): there the
notify/faers rest overlap is 21px or worse and the
stickers/microscope rest overlap is 17px or worse, which matches
a bubble visibly sitting on the faers card plus general vertical
crowding. These are rest-position overlaps, so freezing the float
animation would not remove them.

Live checks owed after the fix (sandbox cannot render pixels):
at width 1440, heights 600, 768, 860, and 1080, confirm no left
column card touches another, the notify bubble clears the faers
card, stickers and microscope separate, and the poster window
clears stroke; at width 1920, same heights, confirm the same plus
the Scopus/helix gap; at any height, confirm the word glyphs read
clean with no card edge visibly crossing a glyph (the z-masked
tucks in section 4 are the residual to eyeball, especially
microscope at 1440 and posterwindow at 1440).
