# Motion + accessibility QA: Cochrane swap (hero logos)

Scope: the Cochrane-for-ScienceDirect swap in the hero collage.
Files checked: `src/sections/Hero.tsx`,
`src/components/hero-v8/DbLogoFloat.tsx`,
`src/components/hero-v8/DbLogoRow.tsx`.
Method: code inspection only. No live browser check was possible
(the sandbox blocks localhost preview), so nothing here is a
rendering observation.

## Verdict: PASS

Every item below passes. No blocking gap, no fix required.

## Per-item results

### (a) Float durations/delays across the four logo floats: PASS

From `COLLAGE_ITEMS` in Hero.tsx (lines 195-197, 204):

- db-pubmed: duration 13s, delay 0.5s
- db-elsevier: duration 11s, delay 1.3s
- db-scopus: duration 15s, delay 0.9s
- db-cochrane: duration 14s, delay 2.1s

All four durations are distinct (13, 11, 15, 14) and all four
delays are distinct (0.5, 1.3, 0.9, 2.1), so no two logos share
a duration AND delay pair. The Cochrane pair (14/2.1) is new
and collides with nothing. The mobile row item (12s/0s) is not
a logo float and its float is disabled in the mobile stack
anyway, so it is out of scope for this rule.

### (b) Tilt lives only on the Hero wrapper, never on the tile: PASS

- `DbLogoFloat` carries no `transform`, `animation`, or
  `transition` in its styles. The single grep hit for those
  words in the tile files is a comment in DbLogoRow stating
  "no tilt, no animation". The tile's own header comment states
  it stays upright by design and the Hero wrapper owns motion.
- The render loop applies tilt on an inner wrapper div
  (`className={item.tiltClass}`) around `<item.Card />`, while
  float lives on the outer item wrapper, so the two never fight.
- `mv-tilt-card-d` (Cochrane's class) is defined in the
  stylesheet as `rotate(1deg)`, inside the established -4deg to
  +4deg range.
- Below 720px, the `max-width: 719px` block sets `transform:
  none` on `mv-tilt-card-d` together with the other tilt
  classes, so Cochrane's tilt is zeroed in the mobile stack
  exactly like the other logos.

### (c) Hide audit, no double render of Cochrane: PASS

- db-cochrane hideClass is `mv-collage-mobile-hide
  mv-collage-hide-1400`. `mv-collage-mobile-hide` is `display:
  none` inside the `max-width: 719px` block, and
  `mv-collage-hide-1400` is `display: none` inside the
  `max-width: 1400px` block. Combined, the Cochrane float
  renders only when width is at least 720px AND above 1400px,
  i.e. only above 1400px.
- db-row hideClass is `mv-collage-hide-min-720`, which is
  `display: none` at `min-width: 720px`, so the row renders
  only below 720px.
- Boundary check: at 719px the row shows and all floats are
  hidden; at 720px the row hides and the Cochrane float is
  still hidden (by hide-1400); at 1400px the float is still
  hidden; at 1401px it first appears. No width renders the
  Cochrane float and the Cochrane row tile simultaneously.
- The old ScienceDirect item is fully gone: zero references to
  sciencedirect, DbSciencedirect, or db-sciencedirect in
  Hero.tsx or either tile file.

### (d) Reduced-motion gating unchanged and covers Cochrane: PASS

- The `@media (prefers-reduced-motion: reduce)` block sets
  `animation: none` on both `.mv-collage` (entrance) and
  `.mv-collage-float` (the float keyframes). The Cochrane item
  renders through the same `mv-collage-float` wrapper class as
  every other collage item, so it is covered with no new code.
- The JS parallax path also gates on reduced motion: it returns
  early when `prefers-reduced-motion: reduce` matches (and
  requires hover plus fine pointer), so no parallax motion
  reaches the Cochrane tile for reduced-motion users.
- Under reduced motion the Cochrane tile renders at rest:
  float off, tilt still applies as a static 1deg rotate (same
  treatment as every other tilted item; tilt is a static
  transform, not motion).

### (e) Layer pointer-dead and aria-hidden, Cochrane img alt: PASS

- The collage layer div carries `aria-hidden="true"`, and the
  stylesheet sets `pointer-events: none` on both `.mv-collage`
  and `.mv-collage-item`; each item also sets inline
  `pointerEvents: "none"`.
- The Cochrane image alt is `Cochrane logo`, produced by the
  shared `${entry.label} logo` template with label `Cochrane`
  in both `DbLogoFloat` and `DbLogoRow`.
- No interactive elements in either tile file: zero matches for
  `<a`, `<button`, `onClick`, `onMouse`, `onHover`, `:hover`,
  or `transition`. The Cochrane tile is a static image in a
  white tile, same as the other logos. The mobile row tile is
  likewise static with no tilt and no animation.

### (f) TypeScript: PASS

- `npx tsc --noEmit` runs clean, 0 errors, on the current tree
  including the new Cochrane brand entry.

### (g) Greps over Hero.tsx + hero-v8 files: PASS

- Em dash: 0.
- Forbidden patterns (marquee, scroll-lock / scrollLock,
  cursor none, scroll-snap, overscroll, Lenis): 0.

## Non-blocking observations

- The helix item shares Cochrane's 14s float duration (14s /
  1.1s vs Cochrane's 14s / 2.1s), but the delays differ, so no
  logo pair shares both values and the stated rule is met.
  Helix is not a logo float, so this is not a gap.
- Cochrane's float tile is 69x82px with 56px art (portrait
  lockup), taller than the 100-104px wide, roughly 50px tall
  wordmark tiles. That size difference is a visual-layout
  matter for the visual QA round, not a motion or
  accessibility issue: the tile itself carries no motion.
- The Cochrane row tile at 20px art is only about 15.5px wide
  (portrait lockup 361x466), so in the mobile row the C mark
  carries recognition while the wordmark is small. Same
  context-reading caveat as the old SD icon; again a visual
  matter, not motion or accessibility.

## Still owed (not defects)

Live-browser confirmation, as in every round since the sandbox
blocks localhost preview: the Cochrane float's motion and
tilt in real collage context above 1400px, the 719/720px
handoff, and reduced-motion behavior in a real browser.
