# v8 Visual QA - Hero Collage Enrichment

## Verdict: FAIL (not sign-off ready)

Method: code inspection only. No live browser check was possible from
the sandbox, so every number below is modeled from code, not measured
on screen. The word-center check passes everywhere and the mobile stack
has exactly the right 4 items in the right order, but the desktop hero
at 1440px wide is structurally overfull in both bands: 17 items share
bands that fit about 12 without collision. The blocking gaps are all
fixable with hide rules and small position moves (section "Blocking
gaps"); no redesign is needed, but the tree as integrated must not
ship as is.

## Model used

- Hero stage: height calc(100dvh - 100px), min 550px. Test stages are
  stage sizes: 1440x700, 1280x700, 1100x600, 1440x550, plus mobile
  390px wide (and the 320px fit check).
- Word block: label (12px mono + 32px margin) + frame padding (28px top
  and bottom) + glyphs (font clamp(72px, 16vw, 180px), line-height 0.95).
  At 1440/1280 wide the font is 180px, glyphs 171px tall, block about
  273px tall, centered. At 1100 wide the font is 176px, glyphs 167px.
- Glyph x-range is estimated from font metrics, not from the frame:
  "daivanlabs." at 180px is about 941px wide (about 5.33em minus
  letter-spacing), so glyphs span about x 250-1190 at 1440 wide,
  170-1110 at 1280 wide, 90-1010 at 1100 wide (176px font, about 920px
  of glyphs). The frame is wider than the glyphs, so frame overlap
  alone is not scored as glyph overlap; only the glyph rectangle
  counts for word-band intrusion.
- Item sizes (width x height, from code): docking 230x185, helix
  100x250, review 220x231 (topics wrap to 2 lines), poster 260x223,
  faers 240x164, gutaxis 230x175, photo 220x200, awards 168x124, stroke
  260x125, search 260x211, posterwindow 280x330 (title wraps to 3
  lines, not 2), microscope 210x205 (caption wraps to 2 lines),
  desk 220x200, dbchips 240x60 (2 rows), notify 310x50, dbstack
  220x188, stickers 357x26.
- Tilt bounding boxes use the exact rotated-rectangle formula
  (W' = W cos + H sin, H' = W sin + H cos), centered on the unrotated
  box. A 4deg tilt on the 310px notify bubble grows its box to about
  313x72; a 4deg tilt on the 357px sticker row grows its box to about
  358x51. Box overlap therefore overstates ink overlap for tilted
  items; where it matters, the doc says so.
- Worst-case shifts: parallax moves the whole collage layer plus/minus
  8px on both axes, so it counts for item-vs-word, item-vs-pill, and
  item-vs-stage-edge, but NOT for item-vs-item (items on one layer
  move together). Item-vs-item worst case is float only: each item
  floats translateY 0 to -8px independently, so relative shift is at
  most 8px. Bottom-anchored items move up toward the word by up to
  16px combined (float 8 + parallax 8); top-anchored items move down
  toward the word by at most 8px (parallax only, float moves them
  away).
- Overlap caps applied (from docs/hero-v8/02-visual-system.md section
  6): card/window edges may overlap up to 24px at a corner, and no
  card or window may cover more than one third of another card's
  face. Stickers are the edge-layer exception only.
- Z-order reminder: collage is z 0, frame/word z 1, chips/pills z 2.
  A collage item under the word never covers a letter; the letters
  paint over it. Glyph intrusion below is still scored, because a
  photo or a titled card sliding under letter bodies reads as broken
  layering, not depth, when the covered zone holds text or a figure.

## Per-item verdicts

| Item | Verdict | One-line reason |
| --- | --- | --- |
| DockingCard | FAIL | DbChips covers 25-36% of its schematic (F5) |
| DnaHelix | PASS | 12px frame tuck at 700 stages, hidden on short stages |
| ReviewCard | PASS | 17px glyph tuck only at the 1100x600 short stage (accepted class) |
| PosterCard | FAIL | PosterWindow covers 33-37% of it (F1, F2) |
| FaersCard | PASS | Pill touch is transient; short-stage tucks accepted |
| GutAxisCard | PASS | Notify touch resolves with F6; itself well placed |
| PhotoCard | PASS | Desk corner 29-30% sits at the cap (F7) |
| AwardsCard | FAIL | Covered 27% by DbStackCard and 25% by DeskCard (F3, F4) |
| StrokeCard | FAIL | DbStackCard covers 42-43% of its face (F4) |
| SearchWindow | PASS | Clean slot; 19px glyph tuck only at the 550 short stage |
| PosterWindow | FAIL | 107-127px glyph intrusion at 700 stages, covers poster + review (F1, F2) |
| MicroscopeCard | PASS with note | Right edge slides under the 'd' at 1280 wide (N1); caption wraps, no clip |
| DeskCard | FAIL | 40px glyph intrusion at 700 stages (F7) |
| DbChips | FAIL | Covers docking and helix (F5); duplicates DbStackCard |
| NotifyBubble | FAIL | 16-32px glyph intrusion at 700 stages, 65px at 550 (F6) |
| DbStackCard | FAIL | Covers 42-43% of StrokeCard (F3, F4) |
| Stickers | PASS | Edge layer on the microscope photo (N2); clears glyphs at 700 stages |

## Checks that pass

- Word-center coverage: NONE at any tested stage. Closest call is
  DeskCard at 1440x550, which clears the center point (720, 275) by
  8px vertically. At 1100x600 the center (550, 300) is clear of every
  item, and at 1280x700 the center (640, 350) is clear.
- Viewport overflow: no item crosses a stage edge. Worst edge
  margins after tilt plus 8px parallax: docking left 23px, poster and
  stroke right 26px at 1440 wide, poster right 18px at 1100 wide.
  Parallax plus/minus 8px and float stay contained by the layer's
  overflow hidden on desktop.
- Mobile stack: exactly FaersCard, PhotoCard, NotifyBubble,
  DbStackCard, in that DOM order, below the word, tilts zeroed by
  the mobile media query, floats off, 16px gap. Every other item is
  hidden below 720px: hide-mid covers microscope, dbchips, stickers;
  hide-1400 covers search, posterwindow, desk, gutaxis; mobile-hide
  covers the v7 rest. DbStackCard's hide-720-1400 class correctly
  keeps it visible on mobile while hiding it at 720-1400px.
- Photos: /hero-desk.jpg (1920x1280) and /hero-microscope.jpg
  (1920x1280) both exist in public/, both display at 4:3 with
  object-fit cover (side crop only, no distortion). Alt text was
  verified against the actual image files: the desk image is a
  top-down desk with laptop, chart papers, notebook, and coffee; the
  microscope image is a blue microscope with glass slides and petri
  dishes with blue medium. Both captions say "Illustrative ambience".
  /hero-lab.jpg is unchanged from v7.
- Logo chips: legible at small size. DbChip is 11px JetBrains Mono
  with a 14px generic glyph, name-only text, no brand artwork, no
  brand color, no claim verb. Inside DbStackCard the white pills read
  cleanly against the dark card.
- Dark stack card contrast: label #E0E0E0 on #010101 is about 13.5:1;
  footer #98989C on #010101 is about 7.3:1; both pass WCAG AA. Blue
  appears only as a solid bar, never as small text on ink. See N4
  for a doc deviation that does not fail contrast.
- Text clipping: no card clips text. Tight spots that still fit:
  MicroscopeCard caption wraps to 2 lines at 210px wide (min-content
  about 186px, so it fits); ReviewCard "Synthesis" fits its 44%
  funnel bar by about 3px (carried v7 note); PosterWindow title
  wraps to 3 lines and fits inside its padded body.
- Greps over Hero.tsx plus all hero-v8 files: em dash 0, forbidden
  patterns (marquee, scroll-lock, cursor none, scroll-snap,
  overscroll) 0, copied reference copy 0. "Onlines" appears only in
  two pre-existing Hero.tsx header comments attributing style, not
  in any card copy, same as the v7 finding.
- Cursor chips: exempt from overlap scoring per doc 01 section 2
  (transient drift, pointer-dead, top layer, never resting). Anchors
  checked, no action.
- Tilt implementation: tilt lives on inner wrappers via stylesheet
  classes only, never on the float wrapper, and the mobile block
  zeroes every tilt class. No animation is attached to any tilt
  class. Float (translateY only) and parallax (layer transform) do
  not fight each other.

## Blocking gaps (must fix before ship)

- F1 (blocking): PosterCard vs PosterWindow, 33-37% coverage.
  At 1440x700 the window (987-1267, 85-415 after the height
  correction) overlaps PosterCard (1142-1406, 20-247) by 125x182px,
  about 34% of the poster card's face; at 1440x550 it is 125x176px,
  about 37%. The window paints above (later DOM), so it covers the
  poster card's title and code zone. Fix: hide PosterCard at 1400px
  and wider (new min-width hide class, same pattern as
  hide-720-1400). The window IS the poster card upgraded to a window;
  the two must never be visible together. PosterCard stays visible
  below 1400px, where the window hides.
- F2 (blocking): PosterWindow glyph intrusion and review overlap.
  At 1440x700 the window overlaps ReviewCard by 68x182px (22%) and
  intrudes into the glyph band by 203px wide x 127px deep, covering
  the word's right end; its footer (N = 6,601) sits under the word's
  final letters. At 1440x550 the glyph intrusion is 203px wide x
  185px deep. Fix: move posterwindow from right 12% to right 2.5%.
  Together with F1, review overlap goes to zero, and glyph intrusion
  narrows to about 48px wide under the '.' and its trailing space,
  which is mostly empty glyph space (downgraded to an observation
  after this move). The window's title and figure then clear the
  letter bodies.
- F3 (blocking): AwardsCard hidden at 1400px and wider (same new
  min-width class as F1). At 1440 wide the bottom-right corner holds
  awards (168px) + dbstack (220px) + stroke (260px) = 648px of cards
  in about 540px of corner, so no placement of all three avoids a
  cap violation. Awards facts duplicate Journey and the awards
  archive, so it is the item to drop at the widest stage. Awards
  stays visible at 1160-1400px, where it is clear of stroke and
  photo.
- F4 (blocking): DbStackCard covers 42-43% of StrokeCard. Dbstack
  (right 13%, 1031-1254) overlaps stroke (right 2.5%, 1142-1406) by
  113x131px at 1440x700 and 113x131px at 1440x550, over the one-third
  cap; the dark card paints above stroke. Fix: move dbstack from
  right 13% to right 22% (spans about 903-1123), which clears stroke
  by about 19px. This fix only works together with F3: at right 22%
  dbstack would otherwise sit almost entirely on top of awards.
  Remaining desk-by-dbstack corner overlap (about 68x164px, 25% of
  the desk face, under the cap, dark above light) is accepted as
  intentional layering.
- F5 (blocking): DbChips covers DockingCard and DnaHelix. The chip
  row (202-442, 120-180) overlaps docking (31-271, 23-220) by 69x60px
  at 1440 wide, 87x60px (36% of the chip row) at 1280 wide, and
  overlaps helix by 53x60px (22%) at 1440 and 74x60px (31%) at 1280.
  The pills sit on top of the docking schematic's pocket outline.
  Fix: remove the standalone dbchips item from COLLAGE_ITEMS. It
  duplicates DbStackCard, which already carries the same four chips;
  the DbChips component itself stays exported for that import.
  Chips remain visible through DbStackCard at 1400px and wider and
  in the mobile stack. At 1160-1400px no chips show, which is fine:
  chips are connective tissue, not content.
- F6 (blocking): NotifyBubble glyph intrusion. At 1440x700 the
  bubble (left 20%, bottom 28%) intrudes 16px into the glyph band at
  rest and 32px at worst float-plus-parallax; its "Poster accepted"
  title sits under the word's baseline zone. At 1440x550 the
  intrusion is 65px deep. At 1100x600 it is 52px deep and also
  overlaps faers. Fix in three parts: move notify from left 20% to
  left 2.5% and from bottom 28% to bottom 25%, and give it a
  hide-720-1160 class (hidden at 720-1160px, visible at 1160px and
  wider and on mobile, same pattern as hide-720-1400). After the
  move, glyph clearance at 700 stages is about 5px by bounding box
  (the tilted corner tip only grazes baseline whitespace), the
  1100 collision disappears because the bubble hides there, and the
  remaining faers touch is at most about 20px deep at worst float
  alignment, under the cap. The 550-stage intrusion drops to about
  17px and is accepted as a short-stage limitation (see N8).
- F7 (blocking): DeskCard glyph intrusion. At 1440x700 the desk
  photo (left 52%, bottom 9%) intrudes 40px into the glyph band
  across four letter bodies ('n', 'l', 'a', 'b'); at 1440x550 it is
  101px deep. Fix: move desk to left 53%, bottom 3%. After the move,
  glyph clearance at 700 stages is about 4px at worst shift, and
  the 550-stage intrusion drops to about 50px, in line with the v7
  accepted short-stage tuck class. Resulting corner overlaps at
  1440 wide are photo-by-desk about 69x186px (29%) and
  desk-by-dbstack about 80x172px (31%), both under the cap.
- F8 (blocking): mobile stack clips at 320px viewports. NotifyBubble
  is about 310px wide, but the mobile content column at a 320px
  viewport is 320 minus 48px section padding = 272px. The section
  keeps overflow hidden, so the bubble would clip about 19px per
  side when centered. FaersCard (240px), PhotoCard (220px), and
  DbStackCard (220px) fit. Fix: add `.mv-collage-item {
  max-width: 100%; }` inside the existing mobile media query, so the
  bubble wraps its text lines instead of overflowing. Its flex row
  (28px icon + text block with min-content about 145px) wraps
  cleanly inside 272px. After this fix the stack fits 320px and
  wider.

## Non-blocking gaps and observations

- N1 (observation): MicroscopeCard right edge slides under the 'd'
  at 1280 wide. Glyphs start near x 170 there, microscope ends near
  x 244, so about 30-75px of the photo's right strip (depending on
  exact font metrics) sits under the first letter, about 125px deep.
  At 1440 wide it clears by about 2px. Unlike F7, this intrusion is
  at the word's edge (one letter, mostly empty counter space), the
  photo's right edge holds blurred background rather than the
  microscope subject, and no placement fixes it (the card cannot
  narrow below its 186px caption min-content, cannot move further
  left, and moving down deepens the overlap). Accepted as a tuck:
  letters paint above and stay legible. Verify on the live preview.
- N2 (observation): Stickers cross the top edge of the microscope
  photo. At 1440x700 the sticker row overlaps the microscope card
  by about 212x35px of ink (about 17% of the microscope face; the
  51px box figure overstates it because the row is tilted 4deg).
  Stickers are the documented edge-layer exception and paint
  topmost, so this reads as a sticker on a photo edge, which is the
  reference behavior. It deepens at 550 stages (about 51px box);
  check the feel live.
- N3 (observation): corner overlaps under the cap, accepted as
  layering: photo-by-desk 29-30%, desk-by-dbstack 31% (after F4/F7),
  awards-by-desk 25-28% (before F3 removes awards at 1400 wide),
  review-by-posterwindow 22% (before F2 moves the window),
  docking-by-microscope about 8% (corner touch), helix-by-stickers
  about 12% (decorative over decorative).
- N4 (minor deviation, one-line fix): DbStackCard's footer ("Search
  tools for systematic reviews") uses #98989C on ink, while
  docs/hero-v8/02-visual-system.md section 5.5 says small text on
  ink should be #E0E0E0. Contrast still passes at about 7.3:1, so
  this does not fail the contrast check; changing the footer color
  to #E0E0E0 removes the deviation.
- N5 (deferred to accuracy QA): SearchWindow's address pill shows
  the real domain pubmed.ncbi.nlm.nih.gov, which conflicts with doc
  02 section 5.2 ("never a URL, never a domain, never a fake address
  bar"). Accuracy QA doc 03 already flags this as observation O1
  with a neutral-placeholder option for the parent. Not scored as a
  visual FAIL here.
- N6 (verify live): MicroscopeCard caption wraps to 2 lines at
  210px wide. It fits (min-content about 186px), but the wrapped
  caption height was estimated, not measured; confirm no squeeze on
  the live preview.
- N7 (carried v7 note): ReviewCard "Synthesis" fits its 44% funnel
  bar by about 3px (font dependent). No clip predicted.
- N8 (accepted limitation, v7 precedent): short-stage glyph-band
  entries at 550-600px stage heights are accepted, because the word
  block and the bottom band collide there no matter the placement
  and the word paints above, staying legible. After the F fixes,
  remaining short-stage intrusions are: notify about 17px, desk
  about 50px, photo about 43-68px, faers about 15-40px, review about
  17px at 1100x600, search about 19px, posterwindow about 48px wide
  under '.' whitespace. The pre-fix posterwindow 166-185px deep
  intrusion and notify 65px intrusion are NOT accepted; F2 and F6
  reduce them.
- N9 (observation): doc 02 section 7 shadow strings were not
  applied to the v7 card roots (those files are unmodified:
  DockingCard and PhotoCard carry no box-shadow at all, the rest
  keep their v7 shadows). The tilt-sign alternation still holds, so
  the anti-monotony rhythm does not fail on shadows alone, but the
  intended medium/lifted differentiation is absent for the v7 set.
  If the parent wants the full doc 02 depth system, the shadow
  strings need a separate pass; it is out of scope for this visual
  QA verdict.
- N10 (observation): fact-pill overlaps are not blocking. Pills
  live in the diorama layer (z 2) and are designed to float over
  everything; pill-seoul statically overlaps the poster window's
  abstract block zone (not its title or figure), pill-cfc overlaps
  DbStackCard, and pill-faers touches FaersCard transiently at
  worst float alignment (about 1px at rest at 1100 wide). Doc 02
  aims for 40px pill clearance, but a floating opaque pill over an
  abstract block is not a readability defect. No fix proposed.

## Stage summary after the F fixes (predicted, not measured)

- 1440x700: all blocking overlaps resolved; remaining overlaps are
  the N2/N3 corner layerings, all under the cap; glyph clearance
  holds for notify (about 5px), desk (about 4px worst), search,
  review, photo, and faers; posterwindow tucks 48px wide under '.'
  whitespace.
- 1280x700: clean after F5 and F6 (dbchips removed, notify hidden
  below 1160 in the new class only at 720-1160, so it shows at 1280
  in its moved slot). Microscope 'd' tuck (N1) remains.
- 1100x600: notify hidden; remaining items are docking, review,
  poster, faers, photo, stroke. Short-stage tucks per N8 only.
- 1440x550: short-stage tucks per N8 only; helix already hidden by
  hide-short.
- Mobile 390px and 320px: stack FaersCard, PhotoCard, NotifyBubble,
  DbStackCard fits after F8; order and counts exact.

## Re-check instruction

After F1-F8 land, re-run this QA (or a targeted re-check) against
the new COLLAGE_ITEMS: the verdicts above are modeled, and the two
most uncertain predictions are the notify/faers tight gap after F6
and the desk/dbstack corner after F4/F7. The live-browser feel check
(overlap feel at mid widths, short stages, sticker-on-photo, and
the poster window behind '.') is still owed, as with every v7/v8
round: the sandbox cannot preview localhost.
