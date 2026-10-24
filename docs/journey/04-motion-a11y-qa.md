# 04 - Motion and accessibility QA (v5 journey round)

Report only. No site file was edited and no build was run; the parent
build remains the gate for type errors. Method: full read of every
target file plus targeted greps (overflow, forbidden terms,
touch-action, reduced-motion presence, heading inventory). Live
browser behavior was not checked; all findings below are
code-verified only. Polling ended when no target file changed
across two consecutive checks, so this QA covers the finished v5
state of each file.

Scope: Manifesto, Profile, Works, Affiliations, Services, Quote,
Contact, App, Header. Footer was also modified in this round but is
out of scope for this QA and was not audited.

Global rule used for check (c): `src/styles/global.css` forces
`color: var(--title)` (dark #1D1D1F) on all h1-h6. That direct rule
beats color inherited from a section element, so a heading on a
dark surface passes check (c) only if it carries an explicit light
color in its own inline style or its own scoped class. The
`.dark-section` global rule (paper color for h1-h3) is not counted
as the heading's own style, but it is noted where it applies.

## Verdict: 8 PASS, 1 FAIL

The single FAIL is Services. Everything else passes, with minor
observations and gaps listed in section 3.

## 1. Per-file results

| File | (a) Reduced motion | (b) Touch | (c) Dark headings | (d) Bans | Verdict |
|---|---|---|---|---|---|
| Manifesto | PASS | PASS (see G4) | PASS | PASS | PASS |
| Profile | PASS | PASS | N/A (light bg) | PASS | PASS |
| Works | PASS | PASS | N/A (light bg) | PASS | PASS |
| Affiliations | PASS | PASS | N/A (no headings) | PASS | PASS |
| Services | PASS | FAIL (see G2) | FAIL (see G1) | PASS | FAIL |
| Quote | PASS | PASS (see G5) | N/A (light bg) | PASS | PASS |
| Contact | PASS | PASS | N/A (light bg) | PASS | PASS |
| App | PASS (see G3) | PASS | N/A (no headings) | PASS | PASS |
| Header | PASS | PASS (see G6) | N/A (no headings) | PASS | PASS |

## 2. Evidence per file

### Manifesto (dark #111 section) - PASS

- (a) Reduced-motion block covers every animated element: reveal
  (opacity 1, transform none, transition none), drift blob
  (animation none), dashed route line (transform none), station
  node dots (opacity 1, transform none), and the mobile station
  line. The armed pattern (hidden only after `mvM-armed` is added
  by the effect) means content is never hidden if the observer
  cannot run. Content is fully visible without animation.
- (b) No hover-dependent content in the main flow: no hover
  reveals, no drag, no scroll hijack, no touch-action rules, no
  inner scroll container (section uses `overflow: hidden` clipping
  only). One observation, G4: award dots carry `title` attributes
  with item names, which only appear on hover.
- (c) PASS. The h2 carries `color: PAPER` (#FAFAFA) in its own
  inline style, and all five station h3 titles carry `color:
  PAPER` in their own inline styles. The section also carries the
  `dark-section` class, but the headings do not need it.
- (d) No marquee, scroll-lock, or custom-cursor code. The drift
  blob is a looping transform, not a marquee, and it is disabled
  under reduced motion.

### Profile (light #FAFAFA section) - PASS

- (a) Reduced-motion block forces reveals visible, highlight bar
  to full width with animation none, and hides the decorative
  fact chips (they are duplicates of facts shown elsewhere).
  Content is fully visible without animation.
- (b) Fact chips are hidden on touch (`hover: none`) and under
  reduced motion; they are decorative duplicates, so nothing is
  lost. The mailto underline draw has a `focus-visible` mirror.
  No scroll hijack, no inner scroll container.
- (c) N/A for the dark rule (light background), but the h2 still
  carries its own `color: #010101`, which is good practice.
- (d) No forbidden code.

### Works (white section) - PASS

- (a) Reduced-motion block forces rows visible, giant numerals
  visible with a solid light fill, and the route line fully drawn
  (transform none). Content is fully visible without animation.
- (b) Row hover effects (wash, index color, arrow, title shift)
  all have `focus-within` or `focus-visible` mirrors; the row
  link itself is always visible text, so only the decorative
  arrow is hover-revealed. Giant numerals and the route line are
  decorative and pointer-events none. No inner scroll container.
- (c) N/A (light background). The h2 relies on the global dark
  rule, which is correct on white.
- (d) No forbidden code.

### Affiliations (white section) - PASS

- (a) Reduced-motion block forces badge items visible with
  animation and transition none. The observer fallback adds the
  visible class when IntersectionObserver is unavailable.
- (b) Hover only changes border style and wordmark color, and
  both have `focus-within` mirrors. No content depends on hover.
  No inner scroll container.
- (c) N/A: the section contains no heading elements at all.
- (d) No forbidden code.

### Services (dark #010101 section, blue cards) - FAIL

- (a) PASS. Reduced-motion block forces head, column, title, and
  line reveals visible with animation none, the hairline to full
  width, and ticks to full opacity. Content is fully visible
  without animation.
- (b) FAIL (G2). The pill links ("View") are the only path from a
  card to its destination page, and they are invisible until card
  hover or focus-within. Touch devices have no hover, and
  focus-within only fires once a focusable element inside the
  card already has focus, which the hidden link cannot receive.
  Reaching the link on touch depends on tap-to-hover emulation,
  which is not a guaranteed path. Corner ticks are fine (faint
  at rest, decorative, with a focus-within mirror).
- (c) FAIL (G1). The section h2 correctly carries its own
  `color: #FFFFFF`, but the three card h3 titles do not: their
  inline style sets line height, letter spacing, weight, margin,
  and animation delay only, and neither `.svc-title` nor
  `.svc-card-title` sets a color. The section does not carry the
  `dark-section` class, so nothing overrides the global h1-h6
  rule, and the titles render dark #1D1D1F on the blue #0859D4
  cards. This is a real contrast defect, not just a rule miss:
  dark grey titles on medium blue, next to white body text.
- (d) PASS. No marquee, scroll-lock, or custom-cursor code; the
  halftone texture is static.

### Quote (white section) - PASS

- (a) PASS. Under reduced motion the component renders a plain
  static branch: fully ink words, mission visible, no tall
  wrapper, no pinning. The reduced-motion media query also
  flattens the sticky child. Content is fully visible without
  animation.
- (b) PASS. The v5 fix for the reported "2 scroll" issue is
  verified in code: the sticky child is now `min-height: 100svh`
  with `overflow: visible`, and grep finds no `overflow-y: auto`
  anywhere in this file (only a comment describing the old
  pair). No scroll hijack: the scroll listener is passive and
  rAF-throttled, and pinning is standard CSS sticky, not a lock.
  One observation, G5: on very short viewports the pinned
  content can exceed viewport height, so its bottom part is only
  fully visible as the section exits the pin at the end of the
  runway.
- (c) N/A (light background). Word spans carry their own ink and
  pale colors in any case.
- (d) PASS. No forbidden code. Sticky pinning is not scroll-lock:
  the page scrollbar remains the only scrollbar.

### Contact (light #F5F5F7 section) - PASS

- (a) PASS. Reduced-motion block forces line masks, fades, pill,
  and socials to opacity 1 with no transition or transform, the
  watermark to its final state, the dot base mask removed, the
  lit layer hidden, and the decorative pills and cursor chip
  hidden. Content is fully visible without animation.
- (b) PASS. Decorative pills and the cursor chip are hidden on
  touch; the dot lit layer is hidden on touch and the base field
  parks at center. The mailto pill and social links are always
  visible; lift on socials is a hover and focus enhancement only.
  Section `overflow: hidden` is clipping, not a scroll container.
- (c) N/A (light background). The h2 relies on the global dark
  rule, which is correct on light grey.
- (d) PASS. No forbidden code.

### App - PASS

- (a) PASS, with gap G3. The route fade animation runs only
  inside a `no-preference` media query, so under reduced motion
  routes render at natural opacity with no animation. The
  reading-progress bar effect returns early under reduced
  motion and is display none in CSS. Route-change scrolling
  uses instant behavior under reduced motion.
- (b) PASS. Scroll listeners are passive; route-change scrolling
  is standard `scrollTo` and `scrollIntoView`, not a hijack. The
  progress bar is fixed, 2px, and pointer-events none. No inner
  scroll containers.
- (c) N/A: App renders no headings itself.
- (d) PASS. The file comment states the fade and smooth anchor
  scrolling neither lock scrolling nor replace the cursor, and
  the code matches that claim.

### Header - PASS

- (a) PASS. The only motion is the nav underline draw and color
  transition, disabled under reduced motion. No content is
  hidden by animation.
- (b) PASS. The underline draw has a `focus-visible` mirror.
  Pre-existing observation G6: the primary nav is display none
  below 720px, which predates v5 (confirmed by diff, not a v5
  regression), so mobile visitors currently have no in-site
  navigation beyond the fixed mailto CTA.
- (c) N/A: no heading elements. The wordmark is a link with its
  own ink color.
- (d) PASS. No forbidden code. The fixed CTA is a normal fixed
  link, not a cursor or lock.

## 3. Gap list (ordered by severity)

- G1 (blocking, Services): card h3 titles lack an explicit light
  color and render dark on blue. Fix: add `color: "#FFFFFF"` to
  the h3 inline style in Services.tsx (or to `.svc-card-title`).
  Verify visually that all three titles read white on the cards.
- G2 (blocking for touch, Services): pill links are hover and
  focus only, with no guaranteed touch path. Fix options: show
  the pills under `@media (hover: none)` (opacity 1, visibility
  visible), or make the whole card a link. The first option is
  the smaller change and keeps the desktop behavior intact.
- G3 (minor, App and global CSS): `src/styles/global.css` sets
  `html { scroll-behavior: smooth; }` unconditionally, so the
  App route effect's reduced-motion instant behavior for the
  #contact landing can still be smoothed by the stylesheet.
  Fix: add a reduced-motion rule setting `html {
  scroll-behavior: auto; }` in global.css. Content visibility is
  unaffected; this is about scroll animation only.
- G4 (minor, Manifesto): award dot `title` attributes are
  hover-only supplementary detail. The count labels and the
  footer note (full record on the Awards, Education, and
  Research pages) mean no essential content is trapped, but the
  item names themselves are unreachable on touch. Fix options:
  accept as-is, or drop the `title` attributes so the dots are
  purely decorative as the file comment claims.
- G5 (observation, Quote): tall-sticky quirk on very short
  viewports (see Quote section above). No fix proposed; worth
  one visual check on a landscape phone, where the pinned
  content is tallest relative to the viewport.
- G6 (pre-existing, Header): primary nav hidden below 720px.
  Not a v5 regression. Consider a compact menu or a
  horizontally scrolling nav in a later round; mobile visitors
  currently navigate only via page content and the fixed CTA.

## 4. Grep summary (target files only)

- `overflow-y: auto`: 0 occurrences. `overflow: hidden` appears
  only as section clipping (Manifesto, Contact), and Quote uses
  `overflow: visible` on the sticky child.
- Forbidden terms (`marquee`, `scroll-lock`, `scrolllock`,
  `cursor: none`, `preventDefault`): 0 occurrences.
- `touch-action`, `onWheel`, `overscroll`, `scroll-snap`: 0
  occurrences. No scroll hijack mechanism exists in these files.
- `prefers-reduced-motion`: present in all 9 files (Manifesto 2,
  Profile 2, Works 1, Affiliations 1, Services 2, Quote 5,
  Contact 5, App 5, Header 1).
- Headings inventoried: Manifesto h2 plus 5 h3, Profile h2,
  Works h2, Services h2 plus 3 h3, Quote h1, Contact h2. Of these,
  only the Services card h3 titles fail the dark-heading rule.
