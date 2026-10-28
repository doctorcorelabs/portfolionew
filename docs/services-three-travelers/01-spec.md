# Spec: "Three Travelers" variant, Services section

Base: HEAD `6e42759`. File to change later: `src/sections/Services.tsx` ONLY.
No new dependencies. No new files besides this spec. Wording in `COLUMNS`
stays byte-identical; no new facts, claims, numbers, or project names.

## 0. What the variant is

Three label chips wander the dark Services canvas and periodically dock at
their own card. The docked card answers (motif lights, halftone lifts,
corner ticks go full white). Everything else stays at rest, so the section
reads as a relay, not three things blinking at once. This echoes the Hero
waypoint wander and the Quote sequential lighting, adapted to a dark
section with opaque blue cards.

Fixed numbers from the variant design (do not retune without a new
decision): chip speeds 70, 90, 110 px/s, one per chip; free dwell 0.15 to
0.6s per waypoint; dock pause 0.9s; motif light 0.4s ease-out; card return
to rest 0.6s; halftone 0.5 to 0.65 on dock; chip border 1px white at 0.6
opacity; chip text JetBrains Mono 10px uppercase; dock bias 0.4 (40
percent of waypoint picks are the chip's own dock).

## 1. Chip DOM, CSS, and JS structure

1.1. Layer. As the first child of `<section>`, add:

```jsx
<div className="svc-travelers" aria-hidden="true">
  <span className="svc-chip" data-chip="REVIEW">REVIEW</span>
  <span className="svc-chip" data-chip="CODE">CODE</span>
  <span className="svc-chip" data-chip="MENTOR">MENTOR</span>
</div>
```

1.2. Section positioning. Add `position: "relative"` to the section inline
style (it currently has none). The layer is `position: absolute; inset: 0;
overflow: hidden; pointer-events: none; z-index: 0`. It adds no height and
intercepts no clicks.

1.3. Stacking (this is what keeps chips off card faces). Cards are
`position: relative` and come later in the DOM than the layer, so they
paint above it. Chips pass behind the opaque blue cards and reappear only
in gaps, margins, and the headline zone. Never raise the layer above the
cards, never give a chip a z-index above 0, and never put motion on top of
a card face: white text on blue must never compete with a moving chip.

1.4. Chip CSS. `position: absolute; left: 0; top: 0;` with position driven
only by `transform: translate3d(x, y, 0)`. `display: inline-block;
white-space: nowrap; font-family: JetBrains Mono stack; font-size: 10px;
letter-spacing: 0.08em; text-transform: uppercase; color: #FFFFFF;
border: 1px solid rgba(255, 255, 255, 0.6); background: rgba(1, 1, 1, 0.5);
padding: 6px 10px; border-radius: 0`. Transparent dark fill means the
dark fill above, not a solid chip. Chip width and height are measured live
with `getBoundingClientRect`; never hardcode a chip width (labels differ
in length). On stacked layout only (max-width 1023px), padding becomes
`5px 9px` so chip height is about 24px and keeps at least 10px slack
inside the 45px card gaps.

1.5. JS loop. One `requestAnimationFrame` loop for the whole section, not
one per chip. Per chip, a ref holds: current position, leg start, leg end,
leg start time, leg duration, and dwell-until time. Positions are written
by direct style mutation through chip refs. The loop causes zero React
re-renders per frame. React state is used only for: loop started flag,
reduced-motion flag, and dock coordinates in parked mode (see section 5).

1.6. Leg math. Leg duration = distance / speed, with a 0.1s floor.
Speeds: REVIEW 70, CODE 90, MENTOR 110 px/s. Easing per leg:
`cubic-bezier(0.22, 1, 0.36, 1)`, applied in JS the same way the Hero
wander eases legs (progress through the curve, not a CSS transition, so
mid-leg retargeting stays smooth).

1.7. Waypoint picking. On each pick, with probability 0.4 the waypoint is
the chip's own dock point (section 3); otherwise it is a free waypoint.
Free waypoints are drawn from the section content box minus chip size
minus a 12px inset, with zone bias: 0.5 headline band (y above the grid
top), 0.3 side margin and gutter bands, 0.2 anywhere in the box. Free
dwell after arrival is uniform random 0.15 to 0.6s. A dock arrival pauses
exactly 0.9s instead of a random dwell.

1.8. One dock at a time. A shared ref `dockedChip` (chip id or null)
enforces the relay. While one chip is in its 0.9s dock pause, the other
two chips may only pick free waypoints. Phase offset at start: chips
begin parked at their own docks and are released with staggered initial
dwells of 0ms, 350ms, and 700ms (REVIEW, CODE, MENTOR in that order), so
the first dockings do not collide.

1.9. Listeners, and only these. (a) The existing entrance
IntersectionObserver stays as is. (b) One new IntersectionObserver,
threshold 0.1, that does NOT disconnect: it sets a `running` ref true or
false so the rAF loop pauses while the section is off screen and resumes
on return (chips hold position while paused, they do not jump). (c) One
resize handler, debounced 150ms, that re-measures geometry (section 3.4).
(d) One 1600ms timeout for loop start (section 4). No scroll listener:
wander is time-based, not scroll-driven. No new dependencies, no timers
beyond the start timeout and the rAF loop.

1.10. Dock response wiring. Card elements get refs (one per card, same
order as `COLUMNS`). On dock arrival, add class `svc-docked` to that card
only; on departure, remove it. CSS:

```css
.svc-motif { opacity: 0.35; transition: opacity 0.4s ease-out; }
.svc-card.svc-docked .svc-motif { opacity: 1; }
.svc-card.svc-docked::after { opacity: 0.65; }
.svc-card.svc-docked .svc-tick { opacity: 1; transition: opacity 0.4s ease-out; }
```

The 0.6s return is met as follows: motif and halftone return on 0.6s
transitions (base rules carry `transition: opacity 0.6s ease` for release;
the docked rules above override to 0.4s on arrival), and ticks return on
the existing 0.3s tick transition, which is inside the 0.6s envelope, so
the card as a whole is at rest by 0.6s. Do not change the base tick
transition: hover behavior stays exactly as shipped.

1.11. Halftone transition note. The `.svc-card::after` rule currently has
no opacity transition (its animation is background-position only). Add
`transition: opacity 0.6s ease` to that rule and let the docked rule
override to 0.4s on arrival. The pan animation is untouched and keeps
running under the dock lift.

## 2. Motif placement (no collision with corner ticks)

2.1. Existing ticks occupy 10px squares at 10px inset from each corner
(x from 10 to 20 and from card width minus 20 to card width minus 10, same
for y). Motifs must not touch them.

2.2. Motif box. Per card, one absolutely positioned box, `top: 32px;
right: 32px; width: 40px; height: 40px`, aligned with the card content
padding (32px sides, 36px bottom). This puts the box clear of the
top-right tick (which ends at 20px from the top and right edges) and
clear of the bottom ticks. The box is `aria-hidden`, `pointer-events:
none`, `z-index: 2` (same layer as ticks, no overlap with them).

2.3. Clearance math the fixer must respect. At the tightest desktop
width (viewport 1024px, container 976px, card 312px, content 248px), the
longest label row "03 / TEACHING AND MENTORING" (about 195px at 12px
JetBrains Mono) ends near x 227 from the card left edge, while the motif
box starts at x 240. Slack is about 13px: acceptable, but it is the
tightest point on the site and is a named QA check (section 6). Title
text never reaches the box either: the second title line ("mentoring")
ends near x 212 at that width. On stacked layout the content column is
wide and the box is nowhere near text. The motif box must never grow
beyond 40px and never move to a smaller inset.

2.4. Motif artwork (flat white shapes only, no gradients, no text, no
numbers). Each motif is one inline SVG, 40 by 40, stroke white 1px, fill
none except the Teaching dot:
- Research: abstract dot funnel. Rows of small white dots narrowing
  downward (for example 5, 4, 3, 2, 1 dots top to bottom), dot size 3px,
  row pitch 7px. Dots are uncounted and unlabeled: no number, label, or
  caption anywhere near the motif, so it can never read as a study count.
- Tools: code brackets `< >` with a plus in the middle (Code for Cure).
  Two angle paths plus a plus path, stroke white 1px. No StrokeSense
  motif of any kind (no brain, no FAST reference, no lab flask).
- Teaching: one solid white dot 4px with two concentric arcs beside it
  (speaker and mentor ripple), stroke white 1px.

2.5. Motif rest state. Opacity 0.35 at rest (same dim language as the
ticks), opacity 1 while its card is docked. Motifs never animate on their
own; they only change on dock and release.

## 3. Dock coordinates: desktop vs stacked, and re-measurement

3.1. Coordinate space. All coordinates are section-relative: subtract
the section bounding rect from every card rect. Chip position is the
chip's top-left corner; dock point is converted to top-left by
subtracting half the measured chip width and height.

3.2. Desktop and tablet (3-column grid, width above 1023px). The headline
block ends with an 80px bottom margin on the `h2` (`margin: 0 0 80px`),
so the gap between the headline and the card row is 80px tall. Dock
center-y = grid top minus 40px (the middle of that gap). Dock center-x =
the card's center-x. Chip top-left = (card center-x minus chip width / 2,
grid top minus 40 minus chip height / 2). With a chip height near 28px,
slack is about 26px above and below the chip inside the gap.

3.3. Stacked mobile (single column, max-width 1023px). Cards stack with
a 45px gap. Dock for card N (N above 0) is centered in the gap above it:
dock center-y = card top minus 22.5px. Dock for card 01 uses the headline
gap formula from 3.2 (grid top minus 40px). Chip top-left = (card
center-x minus chip width / 2, dock center-y minus chip height / 2).
With the stacked chip height near 24px (section 1.4), slack inside each
45px gap is about 10px above and below. Chip height near 25px is the
design target; if measured height exceeds 28px on any device, reduce
stacked padding to 4px 8px rather than letting the chip touch a card edge.

3.4. Re-measurement. A single `measure()` function reads: section rect,
grid rect, and the three card rects, then recomputes all three docks and
the wander bounds. It runs: on mount, on the debounced resize handler
(150ms), and whenever the column mode changes. Column mode is derived
from `window.innerWidth` against the 1023px breakpoint (the file's own
breakpoint; the 1400px breakpoint only changes card min-height and needs
no special handling). On a column-mode change, snap all chips to their
docks with the section 1.8 stagger and resume wander from there; never
let a chip keep a stale cross-mode target. On a same-mode resize, only
clamp current chip positions into the new bounds and let legs finish;
the next waypoint pick uses fresh geometry.

3.5. Wander bounds. Free waypoints are clamped to the section content
box (section rect minus its 24px side padding) minus chip size minus a
12px inset on every side. A chip must never be positioned so that any
part of it leaves the section box.

## 4. Interaction with existing entrance animations

4.1. Keep them, do not replace them. The `svc-anim` / `svc-visible`
entrance (cards rise 0.6s, heads 0.7s, titles and lines in sequence,
hairlines draw 0.8s, delays from `base = 0.1 + columnIndex * 0.15`) stays
exactly as shipped. The travelers layer must not stack a second entrance
on top of it.

4.2. Sequence. Chips render parked at their docks with opacity 0 from
mount. The loop starts 1600ms after `visible` becomes true (the entrance
choreography's longest path is about 1500ms: card delay 0.4s plus line
delays plus 0.6s rise). At loop start, chips fade to opacity 1 over 0.4s
and wander begins with the section 1.8 stagger. If the section leaves
view before the timeout fires, the timeout is cleared and re-armed on
return; chips stay parked and invisible until a real start.

4.3. What keeps running alongside. The halftone pan (24s), the hairline
draw, the corner ticks, and the pills are untouched. The only behavior
change to an existing element is the added opacity transition on
`.svc-card::after` (section 1.11) and the docked-state rules (section
1.10), neither of which alters rest appearance.

4.4. Stale comment cleanup (single line, optional but recommended).
The file header comment still says the Tools pill goes to
`/research/strokesense-ai-lab`; that has been false since HEAD `6e42759`
(Tools has no pill). The fixer may correct that one comment line while
editing; it is not a behavior change and must not be bundled with any
other comment rewrite.

## 5. Reduced-motion branch

5.1. Detection. In the same effect that sets up the loop, check
`window.matchMedia("(prefers-reduced-motion: reduce)").matches` once on
mount and store it in state. No loop, no start timeout, and no wander
observers run when it matches.

5.2. Parked static render. Measurement still runs on mount and on resize
(section 3.4), because dock coordinates are needed even in static mode.
Chips are placed at their docks via state-driven transforms (not ref
mutation) with opacity 1. All three motifs render fully lit (opacity 1).
No observer wait: placement happens on mount, not on section entry.

5.3. CSS backstop. Extend the existing `prefers-reduced-motion` block
with: `.svc-chip { animation: none; }`, `.svc-motif { opacity: 1;
transition: none; }`, `.svc-card.svc-docked::after { opacity: 0.5; }`
(halftone at rest, never lifted), and `.svc-travelers` keeps
`pointer-events: none`. The existing static entrance, full-width
hairline, full-opacity ticks, and halted halftone pan all stay as
shipped.

5.4. What must never happen under reduced motion. No rAF loop, no
waypoint timer, no dock class toggling, no chip fading, no scroll
listener. A reduced-motion visitor sees three parked chips above the
three cards and three fully lit motifs, and nothing moves.

## 6. Acceptance checks (fixer and QA must verify all of them)

6.1. Wording byte-identical. Diff every user-visible string in
`Services.tsx` against HEAD `6e42759`: kicker, headline, all card
titles, all card lines, pill labels. Zero changes. The only new strings
are the chip labels REVIEW, CODE, MENTOR, which are words already present
in the section copy (Research, Code for Cure, mentoring).

6.2. No new facts. No new link, no new project name, no number, no
caption near any motif. The funnel motif in particular must carry no
count and no label. The Tools motif must contain no StrokeSense
reference.

6.3. Chip never above a card face. By construction (section 1.3) and by
check: in the shipped DOM, the travelers layer precedes the card grid,
has z-index 0, and cards are positioned. QA verifies visually that a chip
disappears behind a card it passes and never paints over blue.

6.4. Dock relay. Only one card carries `svc-docked` at any moment.
Dock pause is exactly 0.9s. On departure the card is fully at rest
within 0.6s (motif and halftone on 0.6s release, ticks on the existing
0.3s). No two cards light at once outside a transition overlap of at
most 0.4s during handoff.

6.5. Motif legibility and clearance. Motif box exactly 40 by 40 at top
32px, right 32px. At viewport 1024px the gap between the Teaching label
row end and the motif box start is at least 10px. At 320px the motif box
sits fully inside the card with no overflow. Motif rest opacity 0.35,
dock opacity 1.

6.6. 320px fit. Section side padding is 24px, so the content box is
272px wide. Longest chip (REVIEW or MENTOR, about 56px) fits with room.
Wander bounds inset is 12px. `scrollWidth` of the section must equal its
`clientWidth`: no horizontal overflow at 320px, 390px, or 719px.

6.7. Breakpoint seams. At 1023px and 1024px, docks recompute to the right
mode (stacked gaps vs headline gap) with no chip stranded mid-card. At
1400px nothing changes except card min-height, and docks still track
card centers. Resize from desktop to phone and back leaves all chips
inside bounds.

6.8. Reduced-motion static. With reduced motion emulated: no rAF loop
running, chips parked at docks at opacity 1, motifs fully lit, no dock
class toggling over time, entrance static as shipped. Re-check after a
resize: parked positions update, motion does not start.

6.9. Performance and thrash. Transform and opacity only; no width,
height, margin, padding, or layout-affecting change anywhere in the
variant. One rAF loop, zero React re-renders per frame, loop paused off
screen, resize debounced 150ms. No new dependencies, no new scroll
listener, no new timers beyond the single start timeout.

6.10. Existing behaviors preserved. Entrance rise, hairline draw,
corner ticks (rest 0.35, hover and focus 1), halftone pan, pills
(Research to `/research`, Teaching to `/experience`, Tools none),
grid gaps (20px desktop, 45px stacked), and breakpoints (1023px, 1400px)
all behave as at HEAD `6e42759`.

6.11. Build and scope. `npm run build` passes. `git status` shows only
`src/sections/Services.tsx` modified plus this spec file. Nothing is
committed or pushed by the fixer.
