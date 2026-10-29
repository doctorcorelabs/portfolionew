# Journey: Three Lanterns background spec

Status: spec only. No site file was changed while writing this spec.
Base: HEAD `bfdff87` plus the balanced package (`a0b4a23`).
File in scope: `src/sections/Manifesto.tsx` ONLY, plus this spec doc.
Rule for all text below: 0 em dashes, 0 en dashes.

## 1. Grounding in the real code

Journey lives in `src/sections/Manifesto.tsx` (1201 lines at spec time).
Facts the fixer must build on, all read from the file:

- Section element (around line 875): `position: relative`, `overflow: hidden`,
  `background: "#111111"`, `color: PAPER`, `padding: "130px 24px"`, no z-index
  of its own, so it creates no stacking context.
- Content wrapper (around line 909): `position: relative`, `zIndex: 1`,
  `maxWidth: 1160`, centered. This wrapper IS a stacking context, which is
  why the grid children at negative z-index (rings -2, wells -1) still paint.
- Existing drift blob: one JSX div (around line 892) with class `mvM-drift`,
  `position: absolute`, `top: "-10%"`, `right: "-8%"`, 900x900,
  `borderRadius: "50%"`, `zIndex: 0`, background
  `radial-gradient(circle, rgba(8, 89, 212, 0.22) 0%, rgba(255, 255, 255, 0.08) 45%, rgba(255, 255, 255, 0) 70%)`,
  `filter: blur(80px)`. Its CSS class and keyframes live in `REVEAL_CSS`
  (around lines 357-366): `.mvM-drift` with
  `animation: mvM-drift 22s ease-in-out infinite alternate`, and
  `@keyframes mvM-drift` from `translate3d(0, 0, 0)` to
  `translate3d(-120px, 60px, 0)`. A reduced-motion rule for `.mvM-drift`
  (around line 697) sets `animation: none !important`.
- Grep at spec time shows `mvM-drift` used nowhere else: the class, the
  keyframes, the reduced-motion rule, and one file-header comment (around
  line 43, "The blue drift blob from v4 is kept behind the content") are
  the only occurrences. No other element uses the `mvM-drift` class or the
  `mvM-drift` keyframes.
- Mobile breakpoint: exactly one `@media (max-width: 1100px)` block and one
  `@media (min-width: 1101px)` block. The reduced-motion branch in the
  effect sets `progress` to 1 and `activeIdx` to 4 with no listener.
- Tokens: PAPER `#FAFAFA`, BODY `#D8D8D8`, LABEL `#98989C`, BLUE `#0859D4`.
  DISPLAY is the Inter stack, MONO is the JetBrains Mono stack.
- Everything else in the section is KEPT untouched: scroll route draw,
  node pops, active pulse ring, bead, station seals, stage light wells,
  labeled dots, dotCounts, contour rings, instruments, step-forward
  wrapper, copy, and the undated footnote.

## 2. Base: section background becomes a navy gradient

Replace the section inline style `background: "#111111"` with:

```
background: "linear-gradient(180deg, #111111 0%, #0E1626 100%)"
```

Rules:

- The gradient is painted always, with zero motion and zero scroll
  dependence. A still screenshot at any scroll position shows a dark navy
  field, not flat black.
- Direction is vertical, top to bottom, so the top of the section (header
  zone) stays closest to the old black and the bottom (2026 zone) is the
  darkest navy. No horizontal gradient, no bright zone anywhere.
- The gradient replaces the flat color; it does not sit on top of it.
- Contrast of the base alone: body `#D8D8D8` over `#111111` is 13.25:1,
  over `#0E1626` is 12.69:1. Both far above the AA bar of 4.5:1.

## 3. The three lanterns

Three new divs, direct children of the section element, placed where the
old drift blob div sits (before the content wrapper, so DOM order matches
paint order). Shared rules for all three:

- `aria-hidden="true"`, `position: "absolute"`, `borderRadius: "50%"`,
  `pointerEvents: "none"`, `zIndex: 0`.
- Background is a radial gradient with feather only. NO `filter: blur`
  anywhere on any lantern (the wells deliberately avoid blur; keep it so).
- No `mvM-armed` opacity gate. The lanterns render from first paint,
  exactly like the old blob did. Motion only translates them; the fields
  themselves are painted permanently, so a still screenshot shows blue
  top-left, navy bottom-right, and a pale glow at right.
- No new state, no new listener, no new dependency. Drift is pure CSS
  keyframes, one per lantern, `ease-in-out infinite alternate`.

### Lantern A: North Blue

- Size: 1100px by 1100px. Position: `top: "-6%"`, `left: "-8%"`.
- Background:
  `radial-gradient(circle, rgba(8, 89, 212, 0.35) 0%, rgba(8, 89, 212, 0.18) 45%, rgba(8, 89, 212, 0) 70%)`.
- Drift: class `.journey-lantern-a`, 28s loop, keyframes from
  `translate3d(0, 0, 0)` to `translate3d(70px, 70px, 0)` (down and right,
  toward the section center), `ease-in-out infinite alternate`.

### Lantern B: South Navy

- Size: 1300px by 1300px. Position: `bottom: "-12%"`, `right: "-10%"`.
- Background:
  `radial-gradient(circle, rgba(8, 89, 212, 0.25) 0%, rgba(8, 89, 212, 0) 70%)`.
  Note: only two stops. The 45% mid stop is intentionally absent, so B
  fades more slowly than A and reads as a deeper, wider navy field.
- Drift: class `.journey-lantern-b`, 36s loop, keyframes from
  `translate3d(0, 0, 0)` to `translate3d(-60px, -60px, 0)` (up and left,
  toward the section center, opposite direction and opposite phase to A),
  `ease-in-out infinite alternate`.

### Lantern C: Pale Moon

- Size: 800px by 800px. Position: `top: "38%"`, `right: "2%"`.
- Background:
  `radial-gradient(circle, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0) 70%)`.
- Drift: class `.journey-lantern-c`, 24s loop, keyframes from
  `translate3d(0, -40px, 0)` to `translate3d(0, 40px, 0)` (vertical only,
  80px total travel centered on the home position),
  `ease-in-out infinite alternate`.

## 4. Retirement of the old drift blob (mandatory, not optional)

Delete all of the following, and verify with grep afterwards:

1. The JSX drift blob div (class `mvM-drift`, 900x900, blur 80px).
2. The `.mvM-drift` class rule in `REVEAL_CSS`.
3. The `@keyframes mvM-drift` block in `REVEAL_CSS`.
4. The `.mvM-drift` rule in the `prefers-reduced-motion` block.
5. The file-header comment line stating the v4 drift blob is kept
   (rewrite it to state the blob was retired by the Three Lanterns spec,
   or delete it; comment-only change).

After deletion, `grep -n "mvM-drift" src/sections/Manifesto.tsx` must
return 0 lines. If any other element is found using the class or the
keyframes, stop and report it instead of deleting: the spec-time grep
found no such element, so a hit means the file changed since spec time.

## 5. Z-order: nothing paints above text

Paint order from back to front:

1. Section background gradient (the section element itself).
2. Lanterns A, B, C at section level, `zIndex: 0`.
3. Content wrapper at `zIndex: 1`, which creates its own stacking
   context. Inside it, in order: contour rings at -2, stage wells at -1,
   then grid content (route, nodes, stations, instruments) at normal flow.
4. Text sits above all background layers by construction.

Consequences the fixer must preserve:

- Lanterns are section children, NOT grid children. A negative z-index
  on a direct section child would risk painting behind the page
  background, because the section creates no stacking context. `zIndex: 0`
  is the correct value and must not be changed to -1.
- Rings and wells keep their existing negative z-index values inside the
  wrapper. They paint above the lanterns (wrapper at 1 beats lanterns at
  0) and below text. That is intended: lanterns are the backmost light
  field, rings and wells are texture above them.
- Lanterns must never receive a z-index above 0, and no lantern may be
  moved inside the content wrapper.

## 6. Mobile: below 1100px

In the existing `@media (max-width: 1100px)` block:

- Lantern A: 700px by 700px, `top: "-4%"`, `left: "-20%"`, same alphas
  (0.35 core, 0.18 at 45%, transparent at 70%), drift halved: keyframes
  from `translate3d(0, 0, 0)` to `translate3d(35px, 35px, 0)`, still 28s.
- Lantern B: 900px by 900px, `bottom: "-8%"`, `right: "-25%"`, same alpha
  (0.25 core, transparent at 70%), drift halved: keyframes from
  `translate3d(0, 0, 0)` to `translate3d(-30px, -30px, 0)`, still 36s.
- Lantern C: `display: none` below 1100px. The stacked layout has no
  right gutter, so the pale moon has nowhere to sit without landing
  behind stacked text. Do not re-anchor C to a mobile position; drop it.
- Lanterns anchor to section edges only, never per station, so they
  survive the tall stacked layout unchanged.
- The base gradient (section 2) is unchanged on mobile. Even where a
  lantern is clipped or hidden behind a block, the section still reads
  navy, not black.

## 7. Reduced motion: lanterns STAY, statically

Deliberate break from past rounds. In past rounds, motion elements hid
under reduced motion. Hiding the lanterns would return the section to
exactly the plain black the user complained about, so:

- In the existing `prefers-reduced-motion` block, add:
  `.journey-lantern-a, .journey-lantern-b, .journey-lantern-c { animation: none !important; }`
- Add NO `display: none`, NO `opacity: 0`, and NO visibility rule for any
  lantern in the reduced-motion block. The static state equals the frozen
  screenshot state: gradient at full strength, all three lanterns at
  their home positions.
- Home positions under `animation: none`: A and B render at their base
  transform (none, i.e. the drift start point). C renders at its base
  transform (none, i.e. the midpoint of its -40px to 40px vertical range).
  All three home positions sit inside their stated drift ranges.
- The base gradient also stays at full strength under reduced motion.
  No reduced-motion rule may touch the section background.
- The reduced-motion branch in the effect already pins `progress` to 1
  and `activeIdx` to 4 with no listener. Lanterns do not depend on either
  value, so no branch change is needed for them.

## 8. Contrast guardrails (re-verified, not copied blindly)

Method: WCAG relative luminance, body `#D8D8D8` (luminance 0.687),
small mono label `#98989C` (luminance 0.314), AA bar 4.5:1. Composites
were recomputed against the real gradient base (top `#111111`, bottom
`#0E1626`), not against flat black. The ideation-round numbers were
computed over flat `#111111`; the re-verified values below are slightly
lower where the lantern sits over the navy end of the gradient, and they
still pass.

| Zone | Composite background | Body contrast | Mono label contrast |
|---|---|---|---|
| Lantern A core (0.35 blue over `#111111`) | rgb(14, 42, 85) | 9.95:1 | 4.93:1 |
| Lantern A 45% stop (0.18 blue over `#111111`) | rgb(15, 30, 52) | 11.73:1 | 5.82:1 |
| Lantern B core (0.25 blue over `#0E1626`) | rgb(12, 39, 82) | 10.32:1 | 5.12:1 |
| Lantern B core (0.25 blue over `#111111`, upper area) | rgb(15, 35, 66) | 11.0:1 | 5.46:1 |
| Lantern C core (0.08 white over mid gradient) | rgb(34, 42, 57) | 10.1:1 | 5.01:1 |
| Base top `#111111`, no lantern | rgb(17, 17, 17) | 13.25:1 | n/a |
| Base bottom `#0E1626`, no lantern | rgb(14, 22, 38) | 12.69:1 | n/a |

Hard guardrails:

- Blue alpha behind text is hard-capped at 0.35 (Lantern A core). No
  lantern, stop, or fallback may exceed it. Reason: solid `#0859D4`
  itself would fail for body text (about 4.4:1), which is why these are
  gradients over a dark base, never solid blue panels.
- Cores anchor to section corners and margins (A top-left, B
  bottom-right, C right edge at 38% height), so typical text overlap is
  feathered edge, not core. At feathered edges (alpha at or below 0.15)
  the mono label contrast rises to about 5.9:1.
- Worst case anywhere is the mono label behind the strongest core at
  4.93:1, still above AA. If a preview ever shows a label sitting on a
  core, move the lantern, never dim the text and never raise the alpha.
- Fallback if preview finds the section too blue: Lantern A core 0.35
  to 0.28, single number. Re-verified effect: composite rgb(14, 37, 72),
  body contrast 10.7:1, still clearly visible. Do not touch B or C in
  that fallback, and do not add a new effect.

## 9. Scope and global constraints

- `Manifesto.tsx` ONLY, plus this spec doc. No other file.
- Contour rings, stage wells, seals, bead, instruments, step wrapper,
  copy, dot labels, dotCounts, header, and footnote are untouched.
  Byte-identity of copy is a hard gate (script-verify if in doubt).
- No new dependencies. No new scroll, resize, or pointer listeners.
  No new state. No scroll locking.
- Paint-only properties for the new layers: `opacity` (not used by the
  lanterns except implicitly), `transform` (drift keyframes only),
  `background` (static gradients). No width, height, margin, or padding
  animation.
- Every new animated element (three lantern classes, three keyframe
  blocks) needs a reduced-motion rule per section 7.
- Em dash count 0, en dash count 0 in the diff. The spec itself obeys
  the same rule.
- Comment-only header updates are allowed (section 4 item 5). Copy
  changes are forbidden.

## 10. Acceptance checklist (fixer and QA verify every item)

1. Section background is exactly
   `linear-gradient(180deg, #111111 0%, #0E1626 100%)`, painted always,
   with no scroll or motion dependence.
2. Lantern A geometry: 1100px circle, top -6%, left -8%, stops 0.35 at
   0%, 0.18 at 45%, transparent at 70%.
3. Lantern A drift: 28s, ease-in-out infinite alternate, from
   `translate3d(0, 0, 0)` to `translate3d(70px, 70px, 0)`.
4. Lantern B geometry: 1300px circle, bottom -12%, right -10%, stops
   0.25 at 0%, transparent at 70%, no 45% mid stop.
5. Lantern B drift: 36s, ease-in-out infinite alternate, from
   `translate3d(0, 0, 0)` to `translate3d(-60px, -60px, 0)`.
6. Lantern C geometry: 800px circle, top 38%, right 2%, stops 0.08 white
   at 0%, transparent at 70%.
7. Lantern C drift: 24s, ease-in-out infinite alternate, from
   `translate3d(0, -40px, 0)` to `translate3d(0, 40px, 0)`.
8. All three lanterns are section children, `zIndex: 0`,
   `pointer-events: none`, `aria-hidden`, `borderRadius: 50%`, with NO
   `filter: blur` on any of them.
9. Old blob fully retired: `grep -n "mvM-drift"` returns 0 lines
   (JSX div, class rule, keyframes, reduced-motion rule, header comment
   all handled per section 4).
10. Z-order holds: gradient, then lanterns at 0, then wrapper at 1 with
    rings at -2 and wells at -1 inside it, then text. No lantern has a
    z-index above 0 and none moved inside the wrapper.
11. Mobile: A is 700px at top -4% left -20% with halved drift
    (35px, 35px); B is 900px at bottom -8% right -25% with halved drift
    (-30px, -30px); C is `display: none` below 1100px; base gradient
    unchanged.
12. Reduced motion: all three lantern classes carry
    `animation: none !important`, and NO reduced-motion rule hides any
    lantern or touches the section background. Static render shows
    gradient plus all three lanterns at home positions.
13. Contrast: worst case (mono label behind Lantern A core) is 4.93:1,
    above AA; blue alpha behind text never exceeds 0.35; no text is
    dimmed to compensate.
14. No interference: route draw, bead, seals, wells, rings, instruments,
    step, pulse, and reveal all still present and byte-identical in
    behavior; the diff contains no deletions outside section 4.
15. Copy byte-identical: intro, 5 station titles and details, dot
    labels, dotCounts, and footnote unchanged.
16. No new dependency, listener, or state; only CSS keyframes added.
17. Build passes with `noUnusedLocals` clean (the deleted blob must not
    leave an unused import, variable, or class behind).
18. `git status` shows only `Manifesto.tsx` modified plus this spec doc
    untracked (or, at commit time, only those two files in the commit).

## 11. Known risks and accepted trade-offs

- The blue cast softens the section's strict monochrome editorial feel.
  Mitigation is built in: cores live in corners and margins, the base
  stays very dark, and the single-number fallback (A core 0.35 to 0.28)
  exists if preview finds it too blue.
- Lantern B at 1300px and A at 1100px are larger than the viewport on
  narrow desktop widths. That is intended: only their feathered inner
  arcs cross the content, and section `overflow: hidden` clips the rest.
- Lantern C at top 38% right 2% sits in the right gutter zone on desktop
  but will overlap the 2026 column's right edge on narrow desktop
  widths. Its peak alpha is only 0.08 white, and the contrast table
  covers text sitting directly on it (10.1:1 body), so this is accepted,
  not a defect. If preview finds the pale glow distracting over the
  2026 text, the fallback is to move C further right (right 2% to
  right -4%), never to raise its alpha.
- The old blob's 80px blur is gone with it. Lantern gradients feather
  over 70% of their radius instead, which keeps them cheap to paint
  (no filter cost) and consistent with the wells.
- The bead-versus-`activeIdx` divergence accepted in earlier specs is
  unaffected: lanterns depend on neither signal.
