# Bead Expand Inline - Journey 2024/2025 award interaction
`docs/journey-bead-expand/01-spec.md` - build-ready spec for the implementer.

## 0. Status and scope

This REPLACES the spiral node cluster from the node-diagram round
(`docs/journey-node-panel/01-spec.md`). The spiral overlapped badly on
desktop (verified on the Netlify preview: 2025 chips collided into
unreadable stacks). The user picked the bead-expand mockup
(`~/workspace/daivanlabs-rebuild/journey-options/mockup-bead.png`).

Scope: stations 2024 ("Certificates, papers, world stages", 4 items)
and 2025 ("A peak year, and a lab is born", 11 items) ONLY. Stations
2022, 2023, 2026 keep their existing dot lists byte for byte. All
existing Journey systems (route draw, traveling bead, seals, wells,
lanterns + pulse, contour rings + march, instruments, step-forward,
reveal) are untouched.

Hard gates (non-negotiable):
- NO em dashes or en dashes anywhere (code, strings, comments, docs).
  Use hyphens or commas.
- All text on the dark section carries explicit light colors
  (#FAFAFA headings, #D8D8D8 body, #98989C mono labels). The global
  stylesheet forces #1D1D1F on h1-h6, so never rely on inheritance.
- Award titles are byte-identical strings from STATIONS dots. No
  invented details, no extra sentences about awards.
- 48px minimum touch target on the bead button (40px absolute floor).
- The card must NOT read as a dropdown menu or a floating overlay:
  it is a diagram node that opens, physically connected to its bead
  by a drawn stem.

## 1. Concept

Each of the 2024/2025 stations gets a prominent glowing bead docked in
the award area (where the dot list used to be, after the detail
paragraph). The bead is a diagram node, larger than the 16px timeline
nodes: a blue core, a pulsing halo, and a slowly rotating dashed orbit
ring. Tapping it expands an INLINE detail card directly beneath it,
attached by a connector stem that draws itself from the bead down to
the card. The card blooms open with spring physics; award rows cascade
in with a stagger. Tapping the bead again collapses everything in
reverse, quickly. Only one station expanded at a time (parent-owned
state). The card lives in normal document flow inside the station
column: it pushes the dotCount line and the instrument down with a
smooth height animation. Nothing is portaled, nothing floats over
other content.

Anti-dropdown differentiators (the implementer must preserve all four):
1. The trigger is a glowing diagram node with orbit and halo, not a
   menu button or chevron.
2. A physical stem draws a visible connector between bead and card.
3. The card blooms with spring overshoot plus a staggered row cascade,
   not a fade/slide menu reveal.
4. The card docks: its top edge carries a small blue tab where the
   stem lands (see 2.4).

## 2. Layout per breakpoint

Breakpoints: desktop >1100px, tablet 721-1100px, mobile <=720px.
(The section's existing stacked layout already kicks in at <=1100px;
tablet and mobile share the stacked system but get different card
density.)

### 2.1 Desktop (>1100px)

Station columns are ~213px wide ((1160 - 4*24) / 5). Vertical order
inside the article, after the detail paragraph:

1. `.bead-expand-beadrow`: margin-top 20px. The bead button is
   horizontally centered in the column. Button 48x48px. Visuals
   (centered, absolutely positioned inside the button):
   - `.bead-expand-orbit`: 76px dashed circle
     (border 1px dashed rgba(255,255,255,0.25), border-radius 50%),
     centered on the button, pointer-events none.
   - `.bead-expand-halo`: 44px circle
     (border 2px solid rgba(8,89,212,0.55), border-radius 50%),
     centered, pointer-events none.
   - `.bead-expand-core`: 20px circle, radial gradient
     (#5B9BFF center to #0859D4 edge), 2px solid #FAFAFA border,
     box-shadow 0 0 12px rgba(8,89,212,0.6).
2. `.bead-expand-stem`: 2px wide, 20px tall, centered, background
   linear-gradient(180deg, #0859D4, rgba(8,89,212,0.15)). Draws via
   scaleY (see 3.3).
3. `.bead-expand-body` + `.bead-expand-card`: full column width
   (100%, min-width 0). Card: background rgba(17,17,17,0.94),
   border 1px solid rgba(255,255,255,0.14), border-radius 16px,
   padding 18px 16px, box-shadow 0 12px 32px rgba(0,0,0,0.45).
   Rows may wrap to multiple lines (column is narrow); row layout is
   flex with the dot pinned to the first line.

The route line and neighboring stations: expansion grows the station's
grid row in-flow. The dashed route line and below-route stations
translate down smoothly with the grid (same easing as the card, no JS
needed). This is animated reflow, not a jump. No horizontal shift
anywhere.

### 2.2 Tablet (721-1100px)

Stacked layout (existing). Content area is wide, so the card uses it:
- Bead button 52x52px, core 22px, halo 48px, orbit 84px. Bead row
  stays centered in the content area.
- Stem 24px tall.
- Card: full content width, padding 20px 22px. Award rows in two
  columns: `.bead-expand-rows { display: grid;
  grid-template-columns: 1fr 1fr; column-gap: 24px; row-gap: 12px; }`.
  Row stagger still runs in DOM order (left column top to bottom,
  then right column), which reads as a cascade.
- Kicker and dock tab unchanged.

### 2.3 Mobile (<=720px)

- Bead button 48x48px (same as desktop), core 20px, halo 44px.
  Orbit ring: keep it but static (no rotation) to save GPU on small
  devices? No: keep the rotation, it is one composited layer. Keep.
- Stem 20px tall.
- Card: full content width (inside the 40px-padded station),
  padding 18px 16px, rows single column.
- No fixed or absolute positioning anywhere in this component, so
  safe-area insets need no special handling. The bead is in-flow.

### 2.4 Card internals (all breakpoints)

```
.bead-expand-card
  ::before  (dock tab: 28px wide, 3px tall, background #0859D4,
             border-radius 2px, positioned top -2px, centered;
             this is where the stem visually lands)
  .bead-expand-kicker   ("2025 HIGHLIGHTS": mono 11px, uppercase,
                         letter-spacing 0.08em, pill with
                         background rgba(8,89,212,0.28),
                         border 1px solid rgba(110,168,254,0.35),
                         color #9CC2FF, padding 5px 12px,
                         display inline-block, margin-bottom 14px)
  ul.bead-expand-rows
    li.bead-expand-row
      span.bead-expand-row-dot (8px circle, #0859D4, flex-shrink 0,
                                margin-top 7px to align with first
                                text line)
      span (title text, 14px/1.6, color #D8D8D8)
```

Row separators: none (keep it airy); row gap 10px desktop/mobile,
12px tablet.

The dotCount line ("11 award items in 2025") keeps rendering in
Manifesto AFTER the component, unchanged, followed by the
instrument. Do not duplicate the count inside the card.

## 3. Animations

All durations and easings are exact. "Spring-ish" means the
cubic-bezier values below, never linear, never plain ease.

### 3.1 Bead idle (collapsed state)

- `.bead-expand-halo`: `bead-halo` 2.4s ease-out infinite:
  0% { transform: scale(1); opacity: 0.6; }
  100% { transform: scale(1.55); opacity: 0; }
  A breath, not a blink: opacity never snaps.
- `.bead-expand-orbit`: `bead-orbit-spin` 26s linear infinite
  (rotate 360deg). Decorative.
- `.bead-expand-core`: static glow (box-shadow from 2.1). No idle
  transform animation on the core (keeps the tap target stable).

### 3.2 Tap feedback

- `.bead-expand-bead:active .bead-expand-core { transform: scale(0.88); }`
  with `transition: transform 120ms ease-out` on the core.
- On expand, the bead morphs (150ms ease-out, delay 0ms):
  core scales to 1.12, box-shadow intensifies to
  0 0 20px rgba(8,89,212,0.85); halo animation-play-state paused,
  halo held at scale(1.15) opacity 0.85 (a steady ring, "the eye is
  open"); orbit opacity fades to 0.35.

### 3.3 Expand sequence (total ~620ms)

Ordered, overlapping:
1. Bead morph: 150ms ease-out, delay 0ms (see 3.2).
2. Stem draw: `.bead-expand-stem { transform: scaleY(0);
   transform-origin: top; }`
   `.bead-expand-open .bead-expand-stem { transform: scaleY(1);
   transition: transform 260ms cubic-bezier(0.22,1,0.36,1) 90ms; }`
3. Card bloom: the body uses the grid 0fr/1fr height trick
   (no JS measuring):
   `.bead-expand-body { display: grid; grid-template-rows: 0fr;
   opacity: 0; transition: grid-template-rows 500ms
   cubic-bezier(0.34,1.25,0.64,1) 120ms, opacity 280ms ease 120ms; }`
   `.bead-expand-open .bead-expand-body { grid-template-rows: 1fr;
   opacity: 1; }`
   `.bead-expand-body-inner { overflow: hidden; min-height: 0; }`
   Card rise: `.bead-expand-card { transform: translateY(14px); }`
   `.bead-expand-open .bead-expand-card { transform: translateY(0);
   transition: transform 480ms cubic-bezier(0.34,1.3,0.64,1) 140ms; }`
   (base transition for the card is a fast 200ms ease-in, used on
   collapse; the open rule above overrides it with delay).
4. Row cascade: rows start at opacity 0, translateY(10px).
   `.bead-expand-open .bead-expand-row { opacity: 1; transform: none;
   transition: opacity 300ms ease-out, transform 320ms
   cubic-bezier(0.22,1,0.36,1); transition-delay: var(--row-delay); }`
   where `--row-delay` is set inline per row as
   `${260 + i * 40}ms` (i = 0-based index). 11 rows in 2025 finish
   the cascade at ~260 + 10*40 + 320 = ~980ms after tap; the card
   itself is fully open by ~620ms, so rows keep trickling in after
   the bloom, which is the desired cascade feel.
   Base (collapsed) row rule: `transition: opacity 120ms ease-in,
   transform 120ms ease-in;` with NO delay, so collapse is instant
   per row.

### 3.4 Collapse sequence (total ~380ms, brisk reverse)

- Rows: 120ms ease-in, no stagger (all at once).
- Card: body grid-template-rows to 0fr, 320ms
  cubic-bezier(0.55,0,0.55,0.2) (ease-in, accelerating shut), opacity
  220ms ease-in; card translateY 200ms ease-in.
- Stem: scaleY to 0, 200ms ease-in, delay 60ms.
- Bead morph back: 150ms ease-out.
Stagger delays must NOT apply on collapse: because the delay lives
only in the `.bead-expand-open` rule via var(--row-delay), removing
the open class drops the delay automatically. The implementer must
not put transition-delay on the base row rule.

### 3.5 Reduced motion

```css
@media (prefers-reduced-motion: reduce) {
  .bead-expand *,
  .bead-expand *::before,
  .bead-expand *::after {
    animation: none !important;
    transition: none !important;
  }
  .bead-expand-halo { opacity: 0.5; }
  .bead-expand-orbit { opacity: 0.5; }
  .bead-expand-row { opacity: 1; transform: none; }
}
```
With transitions killed, the grid 0fr/1fr flip is instant and rows
are visible when open (the `.bead-expand-open` row rule still sets
opacity 1). The bead is fully static but still clearly a button.

## 4. Component contract

New files: `src/sections/journey/BeadExpand.tsx`,
`src/sections/journey/BeadExpand.css`. No other new files.

```ts
export type BeadItem = { id: string; title: string };
export type BeadExpandProps = {
  items: BeadItem[];
  year: string;
  expanded: boolean;
  onToggle: () => void;
};
export function BeadExpand({ items, year, expanded, onToggle }: BeadExpandProps): JSX.Element;
export default BeadExpand;
```

Notes:
- `dotCount` is NOT a prop. Manifesto keeps rendering the dotCount
  line after the component exactly as today.
- `title` is the verbatim dot string. The component renders it
  as-is; it never trims, shortens, or decorates it.
- `onTop` is not needed (the card always expands downward in-flow).

Structure:

```tsx
<div className={"bead-expand" + (expanded ? " bead-expand-open" : "")}>
  <div className="bead-expand-beadrow">
    <button type="button"
      className="bead-expand-bead"
      aria-expanded={expanded}
      aria-controls={regionId}
      aria-label={expanded ? `Hide ${year} awards` : `Show ${year} awards`}>
      <span className="bead-expand-orbit" aria-hidden="true" />
      <span className="bead-expand-halo" aria-hidden="true" />
      <span className="bead-expand-core" aria-hidden="true" />
    </button>
    <span className="bead-expand-stem" aria-hidden="true" />
  </div>
  <div className="bead-expand-body">
    <div className="bead-expand-body-inner">
      <div className="bead-expand-card" role="region" id={regionId}
           aria-label={`${year} awards`}>
        <p className="bead-expand-kicker">{year} HIGHLIGHTS</p>
        <ul className="bead-expand-rows">
          {items.map((item, i) => (
            <li key={item.id} className="bead-expand-row"
                style={{ "--row-delay": `${260 + i * 40}ms` } as CSSProperties}>
              <span className="bead-expand-row-dot" aria-hidden="true" />
              <span>{item.title}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  </div>
</div>
```

regionId: `bead-expand-${year}` (years are unique, so ids are unique).

Behavior:
- Click bead: onToggle(). Parent flips expanded for that year and
  collapses the other (single-open rule lives in Manifesto state).
- ESC: when expanded, a document keydown listener collapses via
  onToggle(). Focus stays on the bead the whole time (it never
  leaves), so no focus restoration is needed.
- No scroll-dismiss (the card is inline page content; dismissing on
  scroll would fight the user).
- `aria-hidden` on the body region when collapsed? The 0fr grid with
  overflow hidden clips it visually; also set `visibility` via CSS:
  `.bead-expand-body { visibility: hidden; }`
  `.bead-expand-open .bead-expand-body { visibility: visible;
  transition: ..., visibility 0s 120ms; }` so screen readers and
  keyboard skip the collapsed card. Add `inert` handling? Keep it
  simple: visibility hidden removes it from the a11y tree and tab
  order. The rows contain no focusable elements anyway.

Manifesto integration (exact):

```tsx
import { BeadExpand } from "./journey/BeadExpand";
/* Bead-expand round (docs/journey-bead-expand/01-spec.md): the 2024
   and 2025 award lists open from a glowing bead with an inline
   expanding card. Every other station keeps its dot list. */
const BEAD_YEARS = new Set(["2024", "2025"]);
...
const [expandedBead, setExpandedBead] = useState<string | null>(null);
const toggleBead = (year: string) =>
  setExpandedBead((prev) => (prev === year ? null : year));
...
{BEAD_YEARS.has(station.year) ? (
  <BeadExpand
    items={station.dots.map((dot, k) => ({
      id: `${station.year}-${k}`,
      title: dot,
    }))}
    year={station.year}
    expanded={expandedBead === station.year}
    onToggle={() => toggleBead(station.year)}
  />
) : (
  ... existing dot-list div, byte-identical ...
)}
```

Also update the file header comment block: replace the node-diagram
paragraph with a bead-expand paragraph (no behavior change, comment
only).

## 5. Z-index and stacking

- The component uses NO z-index and NO portal. Everything is in-flow.
  Decorative spans (orbit, halo) are absolutely positioned inside the
  button (position relative) with pointer-events none; they never
  intercept taps.
- The station content wrapper already sits at z-index 1 above the
  lanterns (0), wells (-1), and rings (-2). The bead and card inherit
  that. No conflicts with the fixed header (there is none; the header
  is in normal flow) or the Netlify badge.
- The dock tab (`::before` on the card) must paint above the card's
  own top border: it is a child pseudo-element, no z-index needed.

## 6. Kill list

Delete:
- `src/sections/journey/AwardCluster.tsx`
- `src/sections/journey/AwardCluster.css`

Remove from `src/sections/Manifesto.tsx`:
- `import { AwardCluster, type ClusterItem } from "./journey/AwardCluster";`
- The `CLUSTER_SHORT_LABELS` record (becomes unused).
- `openNode` state and `toggleClusterNode`.
- The `clusterItems` derivation (replaced by the BeadItem mapping
  in section 4).
- Rename `CLUSTER_YEARS` to `BEAD_YEARS` and update its comment.

Keep:
- `docs/journey-node-panel/` (archive of the superseded round; do
  not delete docs).
- dotCount rendering, instruments, and every other Journey system.

## 7. QA checklist for the implementer (do not ship without these)

1. `npm run build` passes; `tsc --noEmit` clean.
2. Grep all new/changed files for em dash and en dash: 0 hits.
3. Titles in the card match STATIONS dots byte for byte (script it:
   extract rendered titles and diff against the dots arrays).
4. Expand 2025 on desktop: rows cascade 40ms apart; card never
   overlaps the neighboring station column; route line moves down
   smoothly (no snap).
5. Expand 2024 then tap 2025's bead: 2024 collapses while 2025
   expands; never two cards open.
6. ESC collapses the open card; focus remains on the bead.
7. `prefers-reduced-motion`: open/close is instant, bead static,
   rows fully visible when open.
8. Mobile 390px: bead tappable (>=48px), card full width, no
   horizontal page scroll, rows wrap cleanly.
9. Tablet 834px: rows in two columns, cascade still in DOM order.
10. Collapse is brisk (<400ms) with no stagger.

## 8. Deliberately left to the implementer

- The exact radial-gradient stops for the bead core (stays within
  the #5B9BFF to #0859D4 range, white 2px border fixed).
- Whether the kicker pill uses inline-block or inline-flex; visual
  result is what matters.
- Micro-copy of aria-labels beyond the patterns in section 4.
- The file header comment wording in BeadExpand.tsx (one short
  paragraph, no em dashes).
