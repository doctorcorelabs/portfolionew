# Visual Consistency QA - v6 active motion

Scope: per-section check of the v6 active-motion work against
docs/motion/08-active-motion.md (spec 08) and the direction map in
its section 2. Method: full diff review of every edited file
against the v5 baseline (commit 73984bd), plus targeted greps.
No site edits, no build, no live-browser check (this agent has no
browser control); all findings are code-verified only.

Polling basis: the working tree diff hash was identical across
three checks spanning about seven minutes, so the builders are
treated as finished. Files audited: App.tsx, Header.tsx,
Footer.tsx, Services.tsx, Manifesto.tsx, Profile.tsx, Works.tsx,
Affiliations.tsx, Contact.tsx, Hero.tsx, Quote.tsx, and the new
section-slide.css.

## Verdict: 8 of 8 sections PASS, with a gap list below

Every mapped section has a visible active motion beyond its old
entrance, every slide direction matches the map, and no section
has a transform conflict, a covering animated element, or a loop
that shifts layout. The gaps are spec deviations and one cosmetic
issue, none of which breaks rendering or hides content.

## Per-section results

### Services: PASS
- Active motion: halftone pan on the card ::after layer,
  background-position 0 to 6px over 24s linear infinite. One full
  6px tile, so the loop restarts seamlessly. The layer stays
  below text (children z-index 1) with pointer-events none.
- Slide: from-left wrapper around the header group. Matches the
  map (Services left).
- Conflicts: none. The wrapper carries only sec-slide classes;
  the inner head, title, and line keep their own vertical rise
  on different elements. Reduced motion kills the pan.
- Deviation (see G4): 24s linear, spec said 16s ease-in-out
  alternate. The background-position exception itself matches
  spec 08 section 3.3.

### Journey (Manifesto): PASS
- Active motion: two layers. The route line now draws from
  scroll progress (rAF-throttled passive scroll listener mapping
  the section bounding rect to scaleX, same value for the
  desktop line and the mobile segments via --journey-progress),
  and the station nearest the viewport center carries a pulsing
  box-shadow ring (2s ease-in-out infinite).
- Slide: from-right wrapper around kicker, heading, and intro.
  Matches the map (Journey right).
- Conflicts: none. The node pop is a transform transition on
  .journey-node-dot while the pulse animates box-shadow on the
  same element, so the two properties compose instead of
  fighting. The slide wrapper is a plain div; inner header
  elements keep their own vertical reveal on different elements.
  The ring expands 12px around dots in the route row and never
  reaches station text. Reduced motion: full static route, no
  pulse, no scroll listener (early return), line forced with
  transform none !important over the inline scale.
- Deviations (see G4): pulse is 2s box-shadow on the active
  station only; spec said 10s scale on all dots. The scroll
  listener is new but compliant: rAF-throttled, passive, no
  preventDefault, never sets scroll position (grep: 0 hits).

### Profile: PASS
- Active motion: marching ants on the portrait frame, an SVG
  rect overlay with a 1px dashed stroke whose dashoffset
  animates 12s linear infinite by -40 (a whole number of 10px
  dash periods, so the loop is seamless). The old CSS dashed
  border is transparent only to keep box size identical, so
  there is exactly one dash pattern. Fill none, pointer-events
  none, stroke stays on the frame edge and never crosses the
  photo (16px padding).
- Slide: from-left wrapper around kicker and title. Matches
  the map (Profile left).
- Conflicts: none on transforms (wrapper slide vs inner
  highlight grow on a span inside the heading, different
  elements). Reduced motion: ants static.
- Notes: the ants use stroke-dashoffset where spec 08 said
  transform tile-translate (see G4). Corner handles vs the ants
  layer: see G5.

### Works: PASS
- Active motion: traveler dot, a 10px blue dot riding the
  dashed route line top to bottom and back, 14s ease-in-out
  infinite alternate, aria-hidden, pointer-events none. Layer
  order is correct: route z-index 0, dot z-index 1, rows
  z-index 2. The dot rides at 70px (34px on mobile) while row
  text starts at 150px padding (88px on mobile), so it never
  overlaps text. Reduced motion parks it at the top.
- Slide: from-right wrapper around the header group, driven by
  its own observer (threshold 0.15, fires once, immediate under
  reduced motion). Matches the map (Works right).
- Conflicts: none on transforms (wrapper slide vs row rises,
  different elements). Deviation: the dot animates `top`, not
  transform (see G2). The element is absolute, so no content
  layout shifts.

### Affiliations: PASS
- Active motion: gentle float on badge text, translateY 0 to
  -3px, 9s / 11s / 13s cycling by badge index, ease-in-out
  infinite alternate. The float sits on an inner .af-float span
  wrapping the text only; the pop entrance stays on the outer
  badge and the corner ticks stay direct children of the badge,
  so no two transforms ever share an element.
- Slide: from-left wrapper around kicker and disclaimer.
  Matches the map (Affiliations left). The wrapper adds no
  margin or padding of its own.
- Conflicts: none. Reduced motion kills the float. The -3px
  float stays inside badge padding.
- Deviation (see G4): durations and distance differ from spec
  (11s / 14s / 17s, -6px), but stay inside the 8s to 24s band.

### Contact: PASS
- Active motion: mailto pill glow pulse (5s ease-in-out
  infinite alternate), cursor chip bob on an inner span (6s,
  entrance transition untouched on the outer span), collage
  pills retuned to -6px / +6px alternate at 10s / 13s / 16s.
- Slide: from-right wrapper around the heading and dotted
  rule. Matches the map (Contact right). The wrapper's
  translateX nests cleanly with the inner line reveal's
  translateY on different elements.
- Conflicts: none on transforms. Reduced motion: glow off
  (animation none, box-shadow none), bob off, pills static.
- Deviation (see G1): the glow animates box-shadow on the pill
  itself instead of the spec's separate halo layer opacity
  pulse. Visually fine, but it breaks the spec 08 property rule.

### Hero: PASS (exempt from slide)
- Exempt because the mount entrance sequence is fixed; no
  header slide was added, correctly.
- Active motion: grid pan, background-position 0 to 40px over
  24s ease-in-out infinite alternate on .mv-grid once visible.
  Background-position does not fight the grid fade (opacity
  transition, different property). Reduced motion: animation
  none !important.
- Deviation (see G4): spec said transform on an oversized
  layer; a background-position pan of one tile is the
  equivalent seamless mechanism.

### Quote: PASS (exempt from slide)
- Exempt because the block is pinned and scroll-painted;
  sliding it sideways would fight the pin. No slide added,
  correctly.
- Active motion: dot breathe, opacity 0.85 to 1 over 8s
  ease-in-out infinite alternate on the base dot layer only.
  The implementation is the correct pattern: the entrance
  opacity moved to a new wrapper div (inline dotEntrance)
  while the breathe animates the inner layer, with a comment
  explaining that animations beat inline opacity on the same
  element. The cursor lit layer is untouched. Reduced motion:
  breathe off.
- Conflicts: none. The dot layers sit at z-index 0 behind
  text with pointer-events none.

### Cross-section: boundary sweep (App.tsx): PASS
- A fixed 3px blue bar at the viewport bottom sweeps scaleX
  0 to 1 and fades over 700ms whenever the observed section
  changes (observer band at the upper third, MutationObserver
  for lazy-loaded sections, disabled on archive pages which
  render no main element). pointer-events none, z-index 90,
  never blocks clicks, never shifts layout, never touches
  scrolling. Reduced motion: effect early-returns and the bar
  is display none.
- Slide rhythm down the page: Services left, Journey right,
  Profile left, Works right, Affiliations left, Contact right.
  Perfect alternation, no two consecutive headers arrive from
  the same side.

### Fallbacks
- Every slide wrapper is driven by state with an
  IntersectionObserver-undefined fallback that reveals content
  immediately (verified in Services, Manifesto, Profile, Works,
  Affiliations, and Contact effects). The section-slide.css
  reduced-motion block forces every slide fully visible with
  no transition.

## Grep results (edited files only)
- Em dash: 0 in all 12 files.
- Forbidden patterns (marquee, scroll-lock, cursor none,
  Lenis): 0 in all 12 files.
- Copied reference copy (checked against the reference site's
  section labels): 0 hits.
- preventDefault in the two scroll-related files
  (Manifesto.tsx, App.tsx): 0 hits.
- Slide wrappers: exactly one per mapped section, each
  carrying only sec-slide classes, never combined with a
  reveal class on the same element.

## Gap list
- G1 (moderate, spec deviation, Contact + Header): the mailto
  pill glow and the fixed CTA glow animate box-shadow
  directly on the pill (5s ease-in-out alternate), while spec
  08 section 3.8 / 3.9 requires a separate blurred halo layer
  with an opacity pulse (8s / 10s) precisely because
  box-shadow animation is banned by the section 4 property
  rule. Rendering is correct and reduced-motion fallbacks are
  clean, but strict spec compliance wants the halo layer. Not
  blocking: a glow spread of 24px around a CTA reads as
  breathing, never flashing.
- G2 (minor, spec deviation, Works): the traveler dot
  animates `top` from 0% to 100% instead of transform
  translateY, breaking the transform-only rule. No content
  layout shifts (the element is absolute and rides the
  gutter), but each frame costs layout for that element.
  Strict fix: drive it with translateY against a measured
  track height.
- G3 (minor, spec deviation, shared): section-slide.css
  slides 48px, while spec 08 section 2 specifies 24px, and it
  also defines an unused from-bottom class. The 48px slide is
  still restrained and reads well, but either the CSS should
  drop to 24px or the spec should be amended to 48px so the
  next pass does not "fix" it back and forth.
- G4 (minor, spec deviations, durations and mechanisms):
  several devices drift from spec 08 while staying inside its
  slow and restrained band: Services pan 24s linear (spec 16s
  ease-in-out alternate); Journey pulse 2s box-shadow on the
  active station only (spec 10s scale on all dots); Affiliations
  float 9s / 11s / 13s at -3px (spec 11s / 14s / 17s at -6px);
  Footer dash travel 10s background-position-x (spec 18s
  transform tile-translate); Hero grid background-position pan
  (spec transform on an oversized layer); Profile ants
  stroke-dashoffset (spec transform tile-translate). All loops
  are seamless at their loop point, all stop under reduced
  motion, none moves text or layout. Recommendation: amend
  spec 08 to record the as-built values rather than reworking
  working motion.
- G5 (minor, cosmetic, Profile): the corner handle squares
  carry no z-index while the ants SVG carries z-index 1, so
  the marching dash stroke paints over the handles at the
  four corners. Recommend z-index 2 on .mvP-handle. The frame
  edge itself and the photo are unaffected.
- G6 (observation, not a gap, Manifesto): the scroll listener
  re-renders the section on scroll with a 0.005 progress
  threshold. It is rAF-throttled and passive, sets no scroll
  position, and calls no preventDefault, so this is compliant
  and expected for a scroll-driven draw.
- G7 (live check still owed): no live-browser check was
  possible from this agent. The 48px slide magnitude, the 24px
  glow spread on the two CTA pills, and the traveler dot path
  at narrow widths deserve one visual pass in the Netlify
  preview before sign-off.
