# Laptop logos integration: what changed in Hero.tsx

Only `src/sections/Hero.tsx` changed (140 insertions, 3 deletions
in the diff). No other source file, no data file, no asset, no
component changed. DbLogoFloat CONFIG, the 719px mobile block,
the hide-min-720 rule, the m- stack entries, and the hide-1400
and hide-750 rule definitions are all untouched (confirmed by
the diff hunks: only COLLAGE_ITEMS lines 215-242 and the
stylesheet block after line 746).

## 1. Marker classes on COLLAGE_ITEMS (3 lines)

- db-elsevier: hideClass gains `mv-collage-show-laptop`
  (existing mobile-hide + hide-1400 kept), tilt stays
  mv-tilt-card-a.
- db-scopus: hideClass gains `mv-collage-show-laptop`
  (existing mobile-hide + hide-1400 kept), tilt stays
  mv-tilt-card-c.
- db-cochrane: hideClass gains
  `mv-collage-show-laptop-cochrane` (existing mobile-hide +
  hide-1400 + hide-750 kept), tilt stays mv-tilt-card-d.

## 2. Show rules (display only, no positions)

Double-class selectors beat the single-class hide-1400 rule
regardless of order:

- (720-740 + min-height 751px) and (741-1400, no height
  scope): `.mv-collage-show-laptop.mv-collage-hide-1400`
  display block. Covers Scopus and Elsevier.
- (720-1300 + min-height 751px) and (1301-1400 +
  min-height 801px):
  `.mv-collage-show-laptop-cochrane.mv-collage-hide-1400`
  display block. Covers Cochrane. The hide-750 gate still
  hides Cochrane at VH 750 or below everywhere, because the
  show rules never apply there.

No other show rule exists in the file.

## 3. Position blocks (positions only, no display)

Every override uses !important (required to beat inline
styles). Elsevier top rules also set bottom:auto, because
its inline bottom would otherwise stretch the tile. No
position block sets display, so visibility stays owned by
the show rules and hide-750.

Bands F1 (720-1160):

- 720-740 (min-height 751): Scopus 41%/4.3%, Cochrane
  41%/14.3%, Elsevier 41%/28.6% + bottom auto.
- 741-1000: Scopus 36%/4.3%, Cochrane 51%/4.3%, Elsevier
  36%/18.6% + bottom auto.
- 1001-1023: Scopus 27%/4.3%, Cochrane 38%/4.3%, Elsevier
  27%/18.6% + bottom auto.
- 1024-1160: Scopus 28%/3%, Cochrane 28%/15%, Elsevier
  30%/bottom 5%.

Bands F2 (1161-1400):

- 1161-1300: Cochrane 40%/2%, Scopus 40%/19%, Elsevier
  27%/bottom 5%.
- 1301-1400: Scopus 36%/2%, Elsevier 30%/bottom 5%.
- 1301-1400 + min-height 801: Cochrane 21%/15%.

Band edges are disjoint (740/741, 1000/1001, 1023/1024,
1160/1161, 1300/1301), so no two position blocks fight.

## 4. Selector correctness (why :has() works)

The render is: outer wrapper div carrying hideClass, whose
DIRECT child is a div carrying tiltClass, which wraps the
Card. So `.mv-collage-show-laptop:has(> .mv-tilt-card-c)`
matches exactly the Scopus wrapper and
`.mv-collage-show-laptop:has(> .mv-tilt-card-a)` matches
exactly the Elsevier wrapper. No other item carries
show-laptop, so other card-a/card-c tiles (docking,
gutaxis, poster, awards, microscope) cannot match. Cochrane
uses its own class and needs no :has(). The F2 blocks use
the same :has() selectors without the hide-1400 qualifier;
that is safe because the media scope already restricts
them to 1161-1400 and the class is present on the wrapper
there anyway.

## 5. What did NOT change (verified from the diff)

- No card component, no data file, no asset, no other
  section, no router, no global stylesheet.
- No COLLAGE_ITEMS entry besides the three logo tiles, and
  only their hideClass strings (positions, floats, tilts
  untouched).
- No change to the parallax code (collage layer only,
  mouse only, plus/minus 8px), the float keyframes (0 to
  -8px), the tilt classes, the chip anchors, the pill
  positions, or any height gate.
- Above 1400px the show and position blocks do not apply
  (all are max-width 1400 scoped), so desktop behavior is
  identical to before. Below 720px the mobile stack is
  untouched in order and membership.
- Later, at user request, the hero StrokeSense card
  (StrokeCard, formerly bottom-right) was deleted from
  Hero.tsx: zero `id: "stroke"` entries, zero StrokeCard
  imports anywhere in src/. This frees the bottom-right
  hero area and supersedes the de-overlap stroke position
  by design; the StrokeSense cursor chip is unaffected.
