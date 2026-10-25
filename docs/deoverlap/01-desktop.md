# Desktop static-overlap audit: hero collage de-overlap

Report only. No site edits, no build. Code inspection plus px modeling
only; no live browser check was possible (the sandbox blocks localhost
preview), so a pixel check on a real display at viewport height around
900px is still owed, especially for the hairline pair in section 4.

## 1. Method and conventions

Source: `src/sections/Hero.tsx`, `COLLAGE_ITEMS` (lines 185-236), the
section style (line 529 onward, `height: calc(100dvh - 100px)`,
`minHeight: 550`), the collage stylesheet (tilt classes and hide
rules), and the card components under `src/components/hero-collage/`
and `src/components/hero-v8/`.

Stage geometry: the collage layer is `position: absolute; inset: 0` of
the section, so collage coordinates run the full viewport width and
the section height. Section height = viewport height - 100px. This
report uses viewport heights 900 and 1080, i.e. stages 800 and 980.
Widths: 1180, 1280, 1366, 1440, 1536, 1920, 2560. That is 14 size
combos.

Widths are exact (taken from `width` / `maxWidth` props in the card
sources). Heights are estimated from content structure (padding plus
line heights plus image aspect ratios) and carry roughly +/- 5px of
uncertainty on text cards; aspect-ratio images and logo tiles are
exact. Tilt boxes are axis-aligned bounding boxes (AABB) for rotation
about the card center: for a w by h card rotated by angle t, AABB
width = w cos t + h sin t, AABB height = h cos t + w sin t. Tilt
angles: card-a -3deg, card-b +2deg, card-c -1deg, card-d +1deg,
card-e +3deg, window-a 0deg, window-b +1deg, sticker-b +4deg.

Float: each item wrapper animates `translateY` from 0 to -8px
(up only, desynced durations, infinite alternate). Float phases drift,
so worst-phase alignment occurs periodically, not constantly. All
overlap figures below are at rest float phase unless marked
"worst float phase". Pointer parallax translates the whole layer by
up to +/- 8px on each axis; it moves all items together, so it never
changes item-item gaps, and it is included in the edge check only.

Paint order inside the collage layer (z-index 0, same stacking
context): DOM order is paint order, later paints above earlier.
Order: docking, helix, review, poster, m-pubmed, faers, m-elsevier,
gutaxis, awards, stroke, search, posterwindow, microscope, desk,
notify, m-scopus, m-cochrane, db-pubmed, db-elsevier, db-scopus,
db-cochrane, stickers. So stickers is topmost, then db-cochrane,
db-scopus, db-elsevier, db-pubmed, notify, desk, microscope,
posterwindow, search, stroke, awards, gutaxis, faers, poster, review,
helix, docking at the bottom. The mobile-only tiles (m-*) are hidden
on desktop by hide-min-720 and never appear in these tables. The word
and frame sit at z-index 1 above the collage, and cursor chips at
z-index 2 above that, so collage items cannot cover the word but can
cover each other.

Near-miss definition: a pair that does not overlap but whose
separation is under 24px. Separation is the gapped axis when the
other axis overlaps, and the corner distance (hypotenuse) when both
axes are gapped. A near-miss is stable under float and parallax when
its gap is horizontal (float moves items vertically only, parallax
moves the whole layer).

Item rest sizes (width x height, px): docking 230x184, helix 100x250,
review 220x207, poster 260x200, faers 240x167, gutaxis 230x172,
awards 168x124, stroke 260x127, search 260x219, posterwindow 280x353,
microscope 210x205, desk 220x195, notify 319x52, db-pubmed 100x50,
db-elsevier 104x50, db-scopus 100x50, db-cochrane 69x82,
stickers 370x26.

## 2. Visible sets per width

Hide rules that matter on desktop: hide-1300 hides microscope and
stickers at widths 1300 and below; hide-1400 hides gutaxis, search,
posterwindow, desk, db-elsevier, db-scopus, db-cochrane at widths
1400 and below; hide-min-1400 hides poster and awards at widths
1401 and above; hide-short (viewport height 700 and below) and
hide-750 (viewport height 750 and below) never trigger at viewport
heights 900 and 1080, so helix and db-cochrane stay visible; notify
(hide-720-1160) is visible at all desktop widths; review
(hide-1000) is visible at all desktop widths.

- 1180, 1280: 9 items: docking, helix, review, poster, faers,
  awards, stroke, notify, db-pubmed.
- 1366: 11 items: the 9 above plus microscope, stickers.
- 1440, 1536, 1920, 2560: 16 items: docking, helix, review, faers,
  gutaxis, stroke, search, posterwindow, microscope, desk, notify,
  db-pubmed, db-elsevier, db-scopus, db-cochrane, stickers.
  (Poster and awards are gone above 1400.)

## 3. Per-size results

Headline: overlaps happen ONLY at stage 800 (viewport height 900),
never at stage 980. At stage 980 the only recurring issue is the
faers/notify near-miss at 23.6px. Edge extensions: none at any combo
(see section 5).

### 3.1 Width 1180, stage 800 (viewport height 900), 9 items

- OVERLAP faers x notify: x 244.3px, y 14.2px, notify on top.
- NEAR awards x stroke: separation 2.3px (horizontal gap 2.3px,
  vertical ranges overlap).
- Edges: none.

### 3.2 Width 1180, stage 980 (viewport height 1080), 9 items

- Overlaps: none.
- NEAR faers x notify: separation 23.6px (vertical gap, horizontal
  ranges overlap).
- NEAR awards x stroke: separation 2.3px.
- Edges: none.

### 3.3 Width 1280, stage 800, 9 items

- OVERLAP faers x notify: x 244.3px, y 14.2px, notify on top.
- Near-misses: none.
- Edges: none.

### 3.4 Width 1280, stage 980, 9 items

- Overlaps: none.
- NEAR faers x notify: separation 23.6px.
- Edges: none.

### 3.5 Width 1366, stage 800, 11 items

- OVERLAP helix x stickers: x 35.8px, y 22.9px, stickers on top.
- OVERLAP faers x notify: x 244.3px, y 14.2px, notify on top.
- OVERLAP microscope x stickers: x 212.2px, y 13.7px, stickers
  on top.
- Near-misses: none.
- Edges: none.

### 3.6 Width 1366, stage 980, 11 items

- Overlaps: none.
- NEAR faers x notify: separation 23.6px.
- Edges: none.

### 3.7 Width 1440, stage 800, 16 items

- OVERLAP helix x stickers: x 17.7px, y 22.9px, stickers on top.
- OVERLAP faers x notify: x 244.3px, y 14.2px, notify on top.
- OVERLAP gutaxis x notify: x 0.8px, y 13.0px, notify on top.
- OVERLAP microscope x stickers: x 212.2px, y 13.7px, stickers
  on top.
- NEAR docking x db-scopus: 16.9px.
- NEAR docking x db-cochrane: 16.6px.
- NEAR helix x db-scopus: 0.4px (box graze; ink clears, see
  section 4).
- NEAR review x search: 18.6px.
- NEAR desk x db-elsevier: 21.9px.
- Edges: none.

### 3.8 Width 1440, stage 980, 16 items

- Overlaps: none.
- NEAR docking x db-scopus: 16.9px.
- NEAR docking x db-cochrane: 16.6px.
- NEAR helix x db-scopus: 0.4px.
- NEAR review x search: 18.6px.
- NEAR faers x notify: 23.6px.
- NEAR desk x db-elsevier: 21.9px.
- Edges: none.

### 3.9 Width 1536, stage 800, 16 items

- OVERLAP faers x notify: x 244.3px, y 14.2px, notify on top.
- OVERLAP microscope x stickers: x 212.2px, y 13.7px, stickers
  on top.
- NEAR helix x db-scopus: 7.1px.
- NEAR helix x stickers: 5.9px (horizontal gap; vertical ranges
  overlap).
- NEAR gutaxis x notify: 20.8px.
- Edges: none.

### 3.10 Width 1536, stage 980, 16 items

- Overlaps: none.
- NEAR helix x db-scopus: 7.1px.
- NEAR faers x notify: 23.6px.
- Edges: none.

### 3.11 Width 1920, stage 800, 16 items

- OVERLAP faers x notify: x 244.3px, y 14.2px, notify on top.
- OVERLAP microscope x stickers: x 212.2px, y 13.7px, stickers
  on top.
- Near-misses: none.
- Edges: none.

### 3.12 Width 1920, stage 980, 16 items

- Overlaps: none.
- NEAR faers x notify: 23.6px.
- Edges: none.

### 3.13 Width 2560, stage 800, 16 items

- OVERLAP faers x notify: x 244.3px, y 14.2px, notify on top.
- OVERLAP microscope x stickers: x 212.2px, y 13.7px, stickers
  on top.
- Near-misses: none.
- Edges: none.

### 3.14 Width 2560, stage 980, 16 items

- Overlaps: none.
- NEAR faers x notify: 23.6px.
- Edges: none.

## 4. Ranked overlapping pairs with fix suggestions

Fixes are suggestions only, not implemented. All line references are
to `src/sections/Hero.tsx` COLLAGE_ITEMS unless noted.

### Pair 1 (BLOCKING, user-visible): notify x faers

Occurs at ALL widths at stage 800 (viewport height 900). This is the
overlap in the user screenshot: the bubble covers the top edge of
the FaersCard, and notify paints above faers because notify (line
203) comes later in DOM order than faers (line 191).

Math: both are left-anchored at 2.5%. Notify is bottom 25%, faers is
bottom 4%. Rest vertical gap = 0.21 x stage - 167px: 1.0px at stage
800, 38.8px at stage 980. The positions were clearly chosen with a
1px rest gap, and the tilts defeat it: notify tilt sticker-b (+4deg)
expands its box by 11.1px top and bottom, faers tilt card-b (+2deg)
by 4.1px, so the tilt-adjusted gap is rest gap minus 15.3px: an
overlap of 14.2px vertically (244.3px horizontally, the full faers
width) at stage 800, and a 23.6px near-miss at stage 980. Worst float
phase (faers up 8px while notify rests) grows the stage-800 overlap
to about 22px and shrinks the stage-980 gap to about 15.6px.
Threshold: tilt overlap exists for stage below 868px, i.e. viewport
height below 968px.

Fix: move notify up, bottom 25% to 30% (line 203). At stage 800 the
notify tilt box becomes 496.9-571.1 against the faers tilt top of
596.9, a 25.8px clearance; at stage 980 the clearance becomes
72.6px. Side effects, both acceptable: the microscope/notify gap
becomes 7.1px at stage 800 (near-miss, not overlap), and pair 4
below clears to 27px. Do NOT move faers down instead: at stage 800
it would need its bottom edge past the stage. Do NOT just remove
the notify tilt: the rest gap is 1px against the faers tilt
expansion of 4.1px, so a tilt-less notify would still overlap by
about 3px.

### Pair 2 (BLOCKING at short stages): stickers x microscope

Occurs at widths 1301 and above (both hidden at 1180/1280) at stage
800 only. Stickers (line 235, top 32%) sits on the top edge of the
microscope photo (line 201, bottom 39%); stickers paints above
because it is last in DOM order.

Math: rest vertical gap = 0.29 x stage - 231px: 1.0px at stage 800
(again a designed 1px rest gap defeated by tilt), 53.2px at stage
980. Tilt expansions (stickers 4deg: 12.9px; microscope 1deg: 1.9px)
turn the stage-800 gap into a 13.7px vertical overlap over 212.2px
horizontally (the full microscope width); worst float phase about
21.7px. Threshold: tilt overlap for stage below 847px, i.e.
viewport height below 947px. At stage 980 the tilt gap is 38.5px
(clear).

Fix options, in order of least visual change:
(a) Nudge stickers up, top 32% to 29%. At stage 800 the gaps become
7.0px to docking above and 10.4px to microscope below: no overlap
anywhere, but two near-misses. This does NOT fix pair 3.
(b) Gate stickers on short stages with a new hide rule (for
example hide below viewport height 950px). This removes pairs 2
and 3 entirely at short stages, at the cost of the stickers
vanishing there. Note the existing hide-short threshold (700px)
is far too low to help.
(c) Do NOT move microscope down to clear stickers: once notify
moves up per pair 1, microscope-down collides with notify (the
microscope tilt bottom would pass the notify tilt top by about
9px at stage 800).

### Pair 3 (BLOCKING at narrow-wide plus short stage): stickers x helix box

Occurs at 1366 (35.8 x 22.9px) and 1440 (17.7 x 22.9px) at stage 800
only; at 1536/stage 800 it is a 5.9px near-miss; at stage 980 it
clears (31.1px vertical gap). Stickers paints above the helix.

Math: horizontal box gap = 0.245 x width - 371.9px, so box overlap
exists for widths below 1518px; vertical overlap exists for stage
below 876px (viewport below 976px). The helix box is 100px wide
but its ink is thin strands: at 1440/stage 800 the closest strand
in the sticker band sits about 2px from the sticker edge (a graze,
nearly invisible); at 1366/stage 800 the stickers cross ink by
about 16px (visible crossing of thin strands).

Fix: stickers cannot be nudged clear of both neighbors: moving
stickers up increases the helix overlap, moving them down
collides with microscope (pair 2). The practical minimal options
are the short-stage gate from pair 2(b), or accepting the faint
motif crossing at 1366-1440 short stages (the helix is decorative
and transparent, so the crossing reads far weaker than pairs 1
and 2). Do NOT move helix right to clear stickers: at 1440 that
pushes helix into search (about 15px overlap).

### Pair 4 (MARGINAL, one combo): gutaxis x notify

Occurs only at 1440/stage 800: 0.8 x 13.0px, notify on top (notify
line 203 comes after gutaxis line 196).

Math: rest horizontal gap is exactly 5.0px (notify right edge
355px, gutaxis left edge 360px at width 1440) and rest vertical
gap is 4.0px; the tilts close both (notify right +1.4px, gutaxis
left +4.3px). At 1536/stage 800 it is a 20.8px near-miss; at stage
980 it clears (26.6px vertical separation). This hairline sits
inside the height-estimate error band: if either card is 3px
taller than estimated, the overlap grows to about 4px; if 3px
shorter, it becomes a roughly 2px gap. Either way it is a touch,
not a clear gap.

Fix: the pair 1 notify move (bottom 25% to 30%) clears this pair
too (27px gap at stage 800). No separate move is needed.

### Structural note on the left column at stage 800

The left column is overfull at stage 800: docking 184 + stickers
26 + microscope 205 + notify 52 + faers 167 = 634px of content in
a 800px stage, and the chosen positions leave only 1px rest gaps
at the stickers/microscope and notify/faers joints. Any pure-nudge
fix therefore leaves near-misses somewhere in the column; a fully
clean result at stage 800 needs either the stickers short-stage
gate or accepting 7-10px near-misses after the nudges in pairs 1
and 2(a). At stage 980 the column breathes and only the
faers/notify near-miss remains, which the notify move clears.

## 5. Near-misses (under 24px, no overlap)

All of these are stable under float and parallax except where
noted, because their gaps are horizontal (float moves items
vertically only; parallax moves the whole layer). Ranked by
tightness:

- awards x stroke, 2.3px, at 1180 (both heights). Vertical ranges
  overlap; horizontal gap 2.3px. Fragile but stable. Optional fix:
  awards right 25% to 27% (line 197): gap becomes 25.9px at 1180,
  50.4px at 1280, 71.4px at 1366, and the awards vs db-pubmed gap
  stays 84px. Safe and cheap; the only reason to skip it is
  keeping the bottom band exactly as is.
- helix x db-scopus box graze, 0.4px at 1440 (both heights) and
  7.1px at 1536. Box-only: the closest helix ink clears the
  Scopus tile by about 28px at 1440, so this reads as fine on
  screen. Scopus sits in a 118px slot between docking (right tilt
  270.7px) and helix (left 388.8px) at 1440, so no single left%
  gives 24px on both sides; leave as is.
- docking x db-scopus, 16.9px, and docking x db-cochrane,
  16.6px, at 1440 (both heights). Same sandwich as above; moving
  either tile trades one near-miss for another; leave as is.
- review x search, 18.6px, at 1440 (both heights). Do NOT move
  review: its right 29% was set by the responsive fix to clear
  poster at tablet width 1024, and moving it back to 28% would
  reintroduce a 1.1px graze there. Moving search left trades
  against helix (13.3px). Leave as is.
- desk x db-elsevier, 21.9px, at 1440 (both heights). Moving
  elsevier right trades against stroke (14.3px). Leave as is.
- helix x stickers, 5.9px, at 1536/stage 800: see pair 3 (gate
  fix) or leave.
- gutaxis x notify, 20.8px, at 1536/stage 800: fixed by the pair
  1 notify move.
- faers x notify, 23.6px, at stage 980 (all widths): fixed by the
  pair 1 notify move (72.6px). Worst float phase shrinks it to
  about 15.6px, still no overlap.

Never co-visible (checked, no action): poster vs posterwindow,
poster vs search, poster vs gutaxis, poster vs db-elsevier,
poster vs db-scopus, poster vs db-cochrane (hide-min-1400 vs
hide-1400 split at 1400/1401); awards vs gutaxis, awards vs
search, awards vs posterwindow, awards vs desk, awards vs
db-elsevier (same split).

## 6. Viewport edge check (poster card especially)

No item extends past any viewport edge at any of the 14 combos,
tilt-adjusted. Worst cases, all with clearance remaining: left
edge docking tilt 24.8px at width 1180 (16.8px after worst parallax
shift of -8px); right edge posterwindow tilt 1404.0px at width
1440 (36px clear, 28px after parallax +8px); top edge poster tilt
13.7px at stage 800 (5.7px after parallax -8px); bottom edge
faers tilt 772.1px at stage 800 (27.9px clear, 19.9px after
parallax +8px). The poster card (right 2.5%, top 2%, 260px wide)
specifically: right edge at 97.5% of width plus about 1.8px of
tilt, clearing the edge by 27.8px at width 1180 and more at wider
widths. The cropped right side in the user screenshot is the
capture crop, not page geometry.

## 7. Out of scope but visible in the screenshot

The diorama layer (cursor chips and fact pills, z-index 2,
requestAnimationFrame-driven) drifts over cards by design and is
not part of the collage tables. In the screenshot the "Code for
Cure" pill sits on the FaersCard and a "FAERS N = 6,601" pill sits
near Notify. That overlap is transient by design, not a static
collage defect. If the user wants zero overlap ever, the pills
would need smaller orbits, but that changes the scattered look
and is outside this audit. The word/frame layering (frame above
collage) is also by design: several items tuck under the frame
edge, which the reference behavior accepts, and no item covers
the word itself.

## 8. Caveats

- Card heights are estimated (see section 1); a 5px height error
  moves vertical gaps by the same amount but cannot create a new
  overlap class beyond the hairline pair 4, and cannot remove
  pairs 1-3 (their overlaps are 13-14px, well above the error).
- Float phases drift, so worst-phase figures occur periodically;
  rest-phase figures are the most common state.
- The stage heights assume the browser chrome implied by
  `calc(100dvh - 100px)`; a browser whose dynamic toolbar shrinks
  the viewport below 900px pushes the stage below 800px and
  deepens pairs 1-3 (each 10px of stage loss costs about 2.1px of
  notify/faers gap, 2.9px of stickers/microscope gap).
- Live pixel confirmation is still owed at viewport height around
  900px on a real display, for pairs 1-4 and for the general
  scattered composition after any fix.

## Appendix: tilt-adjusted boxes per combo (x0 y0 x1 y1, px)

Format per line: item, left, top, right, bottom. Boxes are the
tilt AABBs at rest float phase.

### W 1180, stage 800

docking 24.8 18.1 264.2 213.9; helix 318.6 16.0 418.6 266.0;
review 614.3 20.2 841.3 234.8; poster 888.8 13.7 1152.2 218.3;
faers 26.7 596.9 272.3 772.1; awards 715.9 642.5 886.1 769.5;
stroke 888.4 628.5 1152.6 764.5; notify 28.1 536.9 349.9 611.1;
db-pubmed 506.6 708.3 608.2 761.7.

### W 1180, stage 980

docking 24.8 23.5 264.2 219.3; helix 318.6 19.6 418.6 269.6;
review 614.3 25.6 841.3 240.2; poster 888.8 17.3 1152.2 221.9;
faers 26.7 769.7 272.3 944.9; awards 715.9 815.3 886.1 942.3;
stroke 888.4 799.5 1152.6 935.5; notify 28.1 671.9 349.9 746.1;
db-pubmed 506.6 879.3 608.2 932.7.

### W 1280, stage 800

docking 27.3 18.1 266.7 213.9; helix 345.6 16.0 445.6 266.0;
review 685.3 20.2 912.3 234.8; poster 986.3 13.7 1249.7 218.3;
faers 29.2 596.9 274.8 772.1; awards 790.9 642.5 961.1 769.5;
stroke 985.9 628.5 1250.1 764.5; notify 30.6 536.9 352.4 611.1;
db-pubmed 549.6 708.3 651.2 761.7.

### W 1280, stage 980

docking 27.3 23.5 266.7 219.3; helix 345.6 19.6 445.6 269.6;
review 685.3 25.6 912.3 240.2; poster 986.3 17.3 1249.7 221.9;
faers 29.2 769.7 274.8 944.9; awards 790.9 815.3 961.1 942.3;
stroke 985.9 799.5 1250.1 935.5; notify 30.6 671.9 352.4 746.1;
db-pubmed 549.6 879.3 651.2 932.7.

### W 1366, stage 800

docking 29.5 18.1 268.8 213.9; helix 368.8 16.0 468.8 266.0;
review 746.3 20.2 973.4 234.8; poster 1070.1 13.7 1333.6 218.3;
faers 31.3 596.9 277.0 772.1; awards 855.4 642.5 1025.6 769.5;
stroke 1069.7 628.5 1334.0 764.5; microscope 32.4 281.2 245.9
489.8; notify 32.7 536.9 354.6 611.1; db-pubmed 586.5 708.3
688.2 761.7; stickers 33.7 243.1 404.6 294.9.

### W 1366, stage 980

docking 29.5 23.5 268.8 219.3; helix 368.8 19.6 468.8 269.6;
review 746.3 25.6 973.4 240.2; poster 1070.1 17.3 1333.6 221.9;
faers 31.3 769.7 277.0 944.9; awards 855.4 815.3 1025.6 942.3;
stroke 1069.7 799.5 1334.0 935.5; microscope 32.4 391.0 245.9
599.6; notify 32.7 671.9 354.6 746.1; db-pubmed 586.5 879.3
688.2 932.7; stickers 33.7 300.7 404.6 352.5.

### W 1440, stage 800

docking 31.3 18.1 270.7 213.9; helix 388.8 16.0 488.8 266.0;
review 798.9 20.2 1025.9 234.8; faers 33.2 596.9 278.8 772.1;
gutaxis 355.7 598.1 594.3 781.9; stroke 1141.9 628.5 1406.1
764.5; search 516.5 13.7 780.3 237.3; posterwindow 1124.0 88.0
1404.0 441.0; microscope 34.2 281.2 247.8 489.8; desk 761.5
579.1 984.9 777.9; notify 34.6 536.9 356.4 611.1; db-pubmed
618.4 708.3 720.0 761.7; db-elsevier 1006.8 707.3 1113.2 762.7;
db-scopus 287.6 23.1 388.4 74.9; db-cochrane 287.3 119.4 357.7
202.6; stickers 35.5 243.1 406.5 294.9.

### W 1440, stage 980

docking 31.3 23.5 270.7 219.3; helix 388.8 19.6 488.8 269.6;
review 798.9 25.6 1025.9 240.2; faers 33.2 769.7 278.8 944.9;
gutaxis 355.7 772.7 594.3 956.5; stroke 1141.9 799.5 1406.1
935.5; search 516.5 17.3 780.3 240.9; posterwindow 1124.0 107.8
1404.0 460.8; microscope 34.2 391.0 247.8 599.6; desk 761.5
753.7 984.9 952.5; notify 34.6 671.9 356.4 746.1; db-pubmed
618.4 879.3 720.0 932.7; db-elsevier 1006.8 878.3 1113.2 933.7;
db-scopus 287.6 28.5 388.4 80.3; db-cochrane 287.3 146.4 357.7
229.6; stickers 35.5 300.7 406.5 352.5.

### W 1536, stage 800

docking 33.7 18.1 273.1 213.9; helix 414.7 16.0 514.7 266.0;
review 867.0 20.2 1094.1 234.8; faers 35.6 596.9 281.2 772.1;
gutaxis 379.7 598.1 618.3 781.9; stroke 1235.5 628.5 1499.7
764.5; search 551.1 13.7 814.9 237.3; posterwindow 1217.6 88.0
1497.6 441.0; microscope 36.6 281.2 250.2 489.8; desk 812.4
579.1 1035.8 777.9; notify 37.0 536.9 358.8 611.1; db-pubmed
659.6 708.3 761.3 761.7; db-elsevier 1074.0 707.3 1180.4 762.7;
db-scopus 306.8 23.1 407.6 74.9; db-cochrane 306.5 119.4 376.9
202.6; stickers 37.9 243.1 408.9 294.9.

### W 1536, stage 980

docking 33.7 23.5 273.1 219.3; helix 414.7 19.6 514.7 269.6;
review 867.0 25.6 1094.1 240.2; faers 35.6 769.7 281.2 944.9;
gutaxis 379.7 772.7 618.3 956.5; stroke 1235.5 799.5 1499.7
935.5; search 551.1 17.3 814.9 240.9; posterwindow 1217.6 107.8
1497.6 460.8; microscope 36.6 391.0 250.2 599.6; desk 812.4
753.7 1035.8 952.5; notify 37.0 671.9 358.8 746.1; db-pubmed
659.6 879.3 761.3 932.7; db-elsevier 1074.0 878.3 1180.4 933.7;
db-scopus 306.8 28.5 407.6 80.3; db-cochrane 306.5 146.4 376.9
229.6; stickers 37.9 300.7 408.9 352.5.

### W 1920, stage 800

docking 43.3 18.1 282.7 213.9; helix 518.4 16.0 618.4 266.0;
review 1139.7 20.2 1366.7 234.8; faers 45.2 596.9 290.8 772.1;
gutaxis 475.7 598.1 714.3 781.9; stroke 1609.9 628.5 1874.1
764.5; search 689.3 13.7 953.1 237.3; posterwindow 1592.0 88.0
1872.0 441.0; microscope 46.2 281.2 259.8 489.8; desk 1015.9
579.1 1239.3 777.9; notify 46.6 536.9 368.4 611.1; db-pubmed
824.8 708.3 926.4 761.7; db-elsevier 1342.8 707.3 1449.2 762.7;
db-scopus 383.6 23.1 484.4 74.9; db-cochrane 383.3 119.4 453.7
202.6; stickers 47.5 243.1 418.5 294.9.

### W 1920, stage 980

docking 43.3 23.5 282.7 219.3; helix 518.4 19.6 618.4 269.6;
review 1139.7 25.6 1366.7 240.2; faers 45.2 769.7 290.8 944.9;
gutaxis 475.7 772.7 714.3 956.5; stroke 1609.9 799.5 1874.1
935.5; search 689.3 17.3 953.1 240.9; posterwindow 1592.0 107.8
1872.0 460.8; microscope 46.2 391.0 259.8 599.6; desk 1015.9
753.7 1239.3 952.5; notify 46.6 671.9 368.4 746.1; db-pubmed
824.8 879.3 926.4 932.7; db-elsevier 1342.8 878.3 1449.2 933.7;
db-scopus 383.6 28.5 484.4 80.3; db-cochrane 383.3 146.4 453.7
229.6; stickers 47.5 300.7 418.5 352.5.

### W 2560, stage 800

docking 59.3 18.1 298.7 213.9; helix 691.2 16.0 791.2 266.0;
review 1594.1 20.2 1821.1 234.8; faers 61.2 596.9 306.8 772.1;
gutaxis 635.7 598.1 874.3 781.9; stroke 2233.9 628.5 2498.1
764.5; search 919.7 13.7 1183.5 237.3; posterwindow 2216.0 88.0
2496.0 441.0; microscope 62.2 281.2 275.8 489.8; desk 1355.1
579.1 1578.5 777.9; notify 62.6 536.9 384.4 611.1; db-pubmed
1100.0 708.3 1201.6 761.7; db-elsevier 1790.8 707.3 1897.2
762.7; db-scopus 511.6 23.1 612.4 74.9; db-cochrane 511.3
119.4 581.7 202.6; stickers 63.5 243.1 434.5 294.9.

### W 2560, stage 980

docking 59.3 23.5 298.7 219.3; helix 691.2 19.6 791.2 269.6;
review 1594.1 25.6 1821.1 240.2; faers 61.2 769.7 306.8 944.9;
gutaxis 635.7 772.7 874.3 956.5; stroke 2233.9 799.5 2498.1
935.5; search 919.7 17.3 1183.5 240.9; posterwindow 2216.0
107.8 2496.0 460.8; microscope 62.2 391.0 275.8 599.6; desk
1355.1 753.7 1578.5 952.5; notify 62.6 671.9 384.4 746.1;
db-pubmed 1100.0 879.3 1201.6 932.7; db-elsevier 1790.8 878.3
1897.2 933.7; db-scopus 511.6 28.5 612.4 80.3; db-cochrane
511.3 146.4 581.7 229.6; stickers 63.5 300.7 434.5 352.5.
