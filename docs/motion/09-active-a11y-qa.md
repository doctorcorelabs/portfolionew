# Active Motion + Accessibility QA - v6

Scope: Hero, Quote, Services, Manifesto, Profile, Works, Affiliations,
Contact, Header, Footer, App, section-slide.css, after the v6 builders
finished. Method: full code inspection plus targeted grep. No live
browser check was possible from this agent, so all findings are
code verified only.

Polling basis: the builders' files were re-read until the target file
set stopped changing for three consecutive 90 second checks, and
docs/motion/08-active-motion.md plus src/styles/section-slide.css
were both present. No site file changed after that point.

## Overall verdict: CONDITIONAL PASS for shipping, FAIL on strict
## property compliance

- Criterion (b) reduced motion: PASS everywhere.
- Criterion (c) touch and scroll hijack: PASS everywhere.
- Criterion (d) banned code: PASS everywhere.
- Criterion (a) loops animate transform/opacity only: FAIL. Six of
  twelve files break the strict rule, and the brief's premise that
  the Services halftone pan is the single exception is wrong: there
  are three background-position loops, three box-shadow loops, one
  top loop, and one stroke-dashoffset loop in the built code.

The failure is a spec compliance failure, not a shipping blocker:
every offending loop animates a paint-only property on a small
decorative element, none changes layout, flow, size, or text
wrapping, and every one of them is killed under reduced motion.
The one true layout-property loop (Works traveler, top) moves a
single 10px absolutely positioned dot, so it has no flow impact.
Recommendation: correct docs/motion/08 to list the real exceptions
(cheaper, preserves the built feel) rather than rebuilding six
devices. Optionally convert the Works traveler to a transform
based travel in a follow-up, since it is the only loop that
touches a layout property at all.

## (a) Every continuous loop, actual animated property

| Loop | File | Property actually animated | Verdict |
| --- | --- | --- | --- |
| Hero grid pan, 24s ease-in-out infinite alternate | Hero.tsx | background-position | FAIL, unlisted exception |
| Hero fact pill float | Hero.tsx | transform translateY | PASS |
| Hero cursor drift | Hero.tsx | transform via rAF, no CSS transition | PASS |
| Quote dot breathe, 8s | Quote.tsx | opacity | PASS |
| Services halftone pan, 24s linear infinite | Services.tsx | background-position | PASS, the briefed exception |
| Manifesto blob drift, 22s | Manifesto.tsx | transform translate3d | PASS |
| Manifesto station pulse, 2s | Manifesto.tsx | box-shadow | FAIL, unlisted exception |
| Profile marching ants, 12s linear | Profile.tsx | stroke-dashoffset | PASS with note, doc 07 path-draw family |
| Profile fact chip float | Profile.tsx | transform translateY | PASS |
| Works traveler dot, 14s | Works.tsx | top (0 percent to 100 percent) | FAIL, layout property |
| Affiliations stamp float, 11s | Affiliations.tsx | transform translateY | PASS |
| Contact pill float | Contact.tsx | transform translateY | PASS |
| Contact pill glow, 5s | Contact.tsx | box-shadow | FAIL, unlisted exception |
| Contact cursor bob, 6s | Contact.tsx | transform translateY | PASS |
| Header CTA glow, 5s | Header.tsx | box-shadow | FAIL, unlisted exception |
| Footer dash travel, 10s linear | Footer.tsx | background-position-x | FAIL, unlisted exception |
| App section sweep, 700ms one shot | App.tsx | transform scaleX plus opacity | PASS, not a loop |
| App route fade, 400ms one shot | App.tsx | transform plus opacity | PASS, not a loop |
| Section header slide, 700ms one shot | section-slide.css | transform plus opacity | PASS, not a loop |

One shot entrances that animate width (Services hairline draw,
Profile highlight grow) are entrance only, not loops, and are
outside criterion (a).

## docs/motion/08 contradicts the built code in 8 places

Section 4 of 08 claims transform and opacity only, with
background-position approved for the Services halftone only, and
section 5 tabulates properties that do not match the code:

1. Hero grid pan: 08 says transform translate. Code animates
   background-position.
2. Services halftone pan: 08 says 16s ease-in-out alternate.
   Code runs 24s linear infinite.
3. Journey station pulse: 08 says transform scale, 10s. Code
   animates box-shadow, 2s.
4. Profile marching ants: 08 says transform tile translate. Code
   animates stroke-dashoffset (12s matches).
5. Works traveler: 08 says transform translateY. Code animates
   top (14s matches).
6. Contact glow: 08 says opacity of a halo layer, 8s. Code
   animates box-shadow, 5s.
7. Header CTA glow: 08 says opacity of a halo layer, 10s. Code
   animates box-shadow, 5s.
8. Footer dash travel: 08 says transform tile translate, 18s.
   Code animates background-position-x, 10s linear.
9. Affiliations float: 08 lists 11s, 14s, 17s variants. Code has
   a single 11s float (minor, durations only).

Gap G1 below covers the fix: correct 08, do not silently pass it.

## Per-file verdicts

| File | Verdict | Notes |
| --- | --- | --- |
| Hero.tsx | FAIL (a only) | Grid pan is background-position, not transform as 08 claims. Reduced motion, touch, and banned-code checks all pass. |
| Quote.tsx | PASS | Opacity-only loop. Static branch under reduced motion. |
| Services.tsx | PASS | Halftone pan is the briefed exception. Reduced motion kills it via .svc-card::after animation none. |
| Manifesto.tsx | FAIL (a only) | Station pulse animates box-shadow, not transform scale as 08 claims. Reduced motion, touch, and banned-code checks all pass. |
| Profile.tsx | PASS with note | Ants use stroke-dashoffset, the doc 07 path-draw property family, not transform as 08 claims. Float is transform only. |
| Works.tsx | FAIL (a only) | Traveler animates top, the only layout-property loop. Parked at top 0 under reduced motion. |
| Affiliations.tsx | PASS | Transform-only float. Minor: 08's 14s and 17s variants do not exist in code. |
| Contact.tsx | FAIL (a only) | Pill glow animates box-shadow, not an opacity halo as 08 claims. Floats and bob are transform only. |
| Header.tsx | FAIL (a only) | CTA glow animates box-shadow, not an opacity halo as 08 claims. |
| Footer.tsx | FAIL (a only) | Dash travel animates background-position-x, not transform as 08 claims. |
| App.tsx | PASS | Sweep and route fade are transform plus opacity. All scroll listeners passive and rAF-throttled. |
| section-slide.css | PASS | Opacity plus transform only. Reduced-motion block forces full visibility with or without .in. |

## (b) Reduced motion: PASS in all 12 files

- Every loop above is killed under prefers-reduced-motion:
  Hero grid pan and diorama hidden, Quote breathe off plus the
  sticky section rendered static with height auto, Services pan
  off, Manifesto drift and pulse off plus the journey line
  forced to full draw (transform none !important beats the
  inline scroll progress), Profile ants and chips off, Works
  traveler parked at top with animation none, Affiliations
  float off, Contact glow/bob/pills/chip off, Header pulse
  off, Footer dash travel off, App hairline and sweep hidden.
- No scroll listener is required for reduced-motion users:
  Manifesto returns early and sets progress to full, Quote
  returns early from its scroll effect, App returns early
  from both the hairline and sweep effects, and Hero cursor
  rAF never starts. Content is fully visible without
  scrolling in every section.
- section-slide.css forces opacity 1, transform none, and
  transition none under reduced motion, so headers are
  visible even if the .in class never lands.
- All six sec-slide usages (Affiliations, Manifesto, Profile,
  Services, Works, Contact headers only, never whole sections)
  have an IntersectionObserver-undefined fallback that marks
  the header visible immediately. Pure no-JS invisibility is
  moot: this is a React SPA that renders nothing without JS.
- Global backstop intact: global.css forces animation and
  transition durations to 0.01ms under reduced motion, and
  scroll-behavior auto overrides the base smooth rule.

## (c) Touch and scroll hijack: PASS in all 12 files

- Scroll listeners found: Manifesto, Quote, App (hairline,
  sweep observer, header shadow). Every scroll listener is
  passive, every scroll-driven update is rAF-throttled, and
  the header shadow listener only flips a boolean past 24px.
- Zero wheel listeners, zero touch listeners, zero
  preventDefault on wheel or touch anywhere. The single
  preventDefault in the tree is Footer's Back to top click
  handler, which is a click, not a scroll gesture.
- Zero scroll-snap, zero overscroll rules, zero touch-action
  rules in production section code. The one touch-action hit
  in the repo is pre-existing: touch-action none on
  .canvas-item-handle in src/styles.css, a v1 file for the
  DEV-only canvas drag handle, not a production section
  (see G6).
- No hover-only content: Services pills are forced visible
  under hover none (v5 fix retained), Profile chips and Hero
  diorama are hidden on touch (decorative, pointer-events
  none), Works arrow reveal is decorative and aria-hidden
  while the row link itself is always visible, Affiliations
  hover only restyles border and text, Contact pills are
  pointer-events none decoration and the cursor chip is
  hidden on touch, Hero drag explicitly rejects touch
  pointers so touch scrolling is never captured.
- Mouse-only enhancements (Quote and Contact dot-field lit
  layers, Hero word-hover converge) are guarded by a
  reduced-motion check and never gate content.

## (d) Banned code: PASS in all 12 files

- No scroll-lock: the only overflow hidden rules are
  clipping on the Hero diorama container and the Contact
  root, not viewport locks. No body or html overflow lock.
- No custom cursor: no cursor none anywhere, no
  cursor-following element. Hero cursor chips and the
  Contact arrow chip are decorative page content with
  pointer-events none, never cursor replacements.
- No marquee: no marquee element, no translateX minus 50
  percent loop. The dead mv-marquee keyframe removed in v5
  has not returned.
- No smooth-scroll library: no Lenis, no Locomotive, no
  smoothscroll package in source. The global
  scroll-behavior smooth rule is native CSS, not a library,
  and it is overridden to auto under reduced motion.

## Gap list

- G1 (spec correction, blocking for doc accuracy, not for
  shipping): correct docs/motion/08 sections 4 and 5 to the
  real properties and durations in the table above, and list
  the real exceptions: background-position times 3 (Hero
  grid, Services halftone, Footer dash), box-shadow times 3
  (Manifesto pulse, Contact glow, Header glow), top times 1
  (Works traveler), stroke-dashoffset times 1 (Profile ants,
  doc 07 family). Do not ship 08 as written: it certifies
  properties the code does not use.
- G2 (Works traveler, low severity): the only loop on a
  layout property. Either accept it (one 10px absolute dot,
  no flow impact) or convert travel to a transform based
  path in a follow-up. Note the dot already uses transform
  translate for centering, so a conversion needs a wrapper
  element to avoid transform conflicts.
- G3 (box-shadow loops, low severity): Manifesto pulse,
  Contact glow, Header glow repaint a glow each frame. Cheap
  at these sizes, but they are paint work, not composited
  transform/opacity work.
- G4 (background-position loops, low severity): Hero grid,
  Services halftone, Footer dash repaint tiled backgrounds
  each frame. Cheap for small repeating tiles, but again
  paint work, and two of the three were never listed as
  exceptions anywhere.
- G5 (duration mismatches vs 08, trivial): Services 24s vs
  16s, Manifesto 2s vs 10s, Contact 5s vs 8s, Header 5s vs 10s,
  Footer 10s vs 18s, Affiliations single 11s vs three
  variants. Fold into the G1 correction.
- G6 (pre-existing, not v6, no action): touch-action none on
  the DEV-only canvas handle (src/styles.css, since v1),
  mobile nav hidden below 720px (pre-existing), native
  scroll-behavior smooth in global.css (not a library).
- G7 (observation, no fix proposed): live-browser feel of
  the six new loops (especially traveler position against
  the route line at mid widths, and glow visibility on the
  blue CTA) still needs one visual pass in the user's
  preview, since this audit is code inspection only.

## Coverage statement

Checked: all 12 listed files, every infinite animation and
its keyframe body, every reduced-motion block, every scroll
listener and its options, every hover reveal and its touch
fallback, and the banned-pattern grep set (cursor none,
marquee, scroll-lock, smooth-scroll libraries, wheel/touch
preventDefault, scroll-snap, overscroll, touch-action).
Not checked: live-browser rendering, frame rates, or motion
on a physical touch device.
