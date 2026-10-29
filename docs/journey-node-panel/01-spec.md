# Spec: Journey Node Diagram + Floating Detail Panel

Status: APPROVED IDEA (user pick, 29 Oct 2026, widget option "Bikin node diagram + panel mengambang").
Applies to: `src/sections/Manifesto.tsx` only. Scope is stations 2024 and 2025 ONLY.
Stations 2022 (2 dots), 2023 (1 dot), 2026 (1 dot) keep their existing vertical dot lists byte-for-byte.

## 1. Problem

The 2025 station renders 11 award rows as a tall vertical dot list; 2024 renders 4 rows. On phones this
eats vertical space and reads as a wall of text. The lists carry real information (each award is a recorded
fact), so they cannot be cut, but they can be compacted into a node cluster: awards become small labeled
nodes scattered in a bounded cloud, and tapping one node opens a floating panel with that item's text.

## 2. What changes and what does NOT

CHANGES:
- In the station article, the dot-list block (`station.dots.map(...)` inside the column flex div) is
  replaced by `<AwardCluster>` for stations whose year is in `CLUSTER_YEARS = new Set(["2024", "2025"])`.
- The `dotCount` mono paragraph ("4 award items in 2024" / "11 award items in 2025") stays exactly where
  it is, right after the cluster, before `JourneyInstrument`.
- One portaled panel root added (see section 5).

DOES NOT CHANGE (hard gate, verify by grep before handoff):
- Route draw, bead (desktop/mobile), bead rings, year pop, seals, stage wells/glows, lanterns, lantern
  pulse, contour rings, ring march, instruments, step-forward wrappers, reveal timing, dotCount text,
  footnote, header block. Grep must still show 0 changes in those CSS blocks except additive additions.
- 2022/2023/2026 markup untouched.

## 3. Data model

Derive items at render time from the existing `STATIONS` array. No new text is authored.

```ts
type ClusterItem = {
  id: string;        // e.g. "2025-03"
  shortLabel: string; // verbatim dot text, shown on the node chip
  title: string;     // verbatim dot text, panel heading
  body: string;      // verbatim dot text today; MAY later hold a longer user-approved
                     // description. Never invent body text: until the user supplies it,
                     // body === shortLabel.
};
```

Construction (inside the station map):

```tsx
const items: ClusterItem[] = station.dots.map((dot, k) => ({
  id: `${station.year}-${k}`,
  shortLabel: dot,
  title: dot,
  body: dot,
}));
```

Byte-identical rule: `shortLabel`, `title`, and `body` are assigned from `station.dots` with no
transformation. Do not trim, reword, or add punctuation.

## 4. AwardCluster component

File: new `src/sections/journey/AwardCluster.tsx` (keeps Manifesto.tsx from bloating).

Props:

```ts
type AwardClusterProps = {
  items: ClusterItem[];
  year: string;                 // "2024" | "2025", used for the panel context line
  dotCount: string | null;      // verbatim dotCount, repeated as the panel footer line
  onTop: boolean;               // station above the route -> desktop panel prefers opening upward
  openId: string | null;        // id of the node whose panel is open, or null
  onToggle: (id: string) => void; // toggle logic lives in Manifesto (single-panel rule)
};
```

### 4.1 Cluster container (desktop, min-width 1101px)

- `div.journey-cluster`, `position: relative`, `width: 100%`, `overflow: visible`.
- Fixed height so opening/closing a panel never shifts section layout:
  `height = clamp(140, 60 + 24 * items.length, 280)` px. That gives 2024 = 156px, 2025 = 280px.
- Nodes are absolutely positioned inside (see 4.3). Container is in-flow: it replaces the dot-list
  div (which had `marginTop: 16`); keep `marginTop: 16`.

### 4.2 Cluster container (mobile, max-width 1100px)

- `div.journey-cluster`, static flow, `display: flex`, `flex-wrap: wrap`, `gap: 8px`, `marginTop: 16`.
- Height auto. Nodes are in-flow chips (no absolute positioning; see 4.4).

### 4.3 Node placement (desktop)

Deterministic golden-angle spiral, seeded per station so each cluster has a stable, distinct layout:

```ts
function nodePosition(i: number, n: number, seed: number): { x: number; y: number } {
  // x, y in percent of the container box
  const golden = 137.508;
  const angle = ((i * golden + seed) * Math.PI) / 180;
  const radius = 42 * Math.sqrt((i + 0.5) / n); // 42% max radius, leaves 8% padding
  return { x: 50 + radius * Math.cos(angle), y: 50 + radius * Math.sin(angle) };
}
```

- `seed` = parseInt(year, 10) (2024 or 2025). Same input, same output, every render and reload.
- Render: `<button class="journey-cluster-node" style={{ left: x + "%", top: y + "%" }}>`
  with `transform: translate(-50%, -50%)` in CSS.
- No two nodes share a position because radius grows with i and the angle never repeats exactly.
- Nodes may visually overflow the container horizontally (`overflow: visible`); that is intended, the
  column gutters have room. They must not overlap the year numeral or seal above: the container sits
  below `marginTop: 16` of the detail paragraph, so fine.

### 4.4 Node visuals

Button content: an 8px blue dot (`#0859D4`, same as old dots) + the shortLabel text.

Desktop CSS (`.journey-cluster-node`):
- `position: absolute; transform: translate(-50%, -50%);`
- `display: flex; align-items: center; gap: 8px;`
- `padding: 6px 12px; border-radius: 999px; white-space: nowrap;`
- `background: rgba(255, 255, 255, 0.06); border: 1px solid rgba(255, 255, 255, 0.18);`
- `color: #D8D8D8; font-size: 13px; line-height: 1.4; font-family: inherit; cursor: pointer;`
- `min-height: 40px` (touch target rule, desktop included for touch laptops).
- Open state (`.journey-cluster-node-active`): `border-color: #FAFAFA; background: rgba(8, 89, 212, 0.35);`
- Text color explicit `#D8D8D8` (never inherited; dark-section rule).

Mobile CSS: same chip styling, `position: static; transform: none;` in-flow inside the flex wrap.
`min-height: 40px` mandatory.

Reduced motion: no transitions on the chips.

### 4.5 A11y on nodes

- `type="button"`, `aria-expanded={openId === item.id}`, `aria-controls="journey-cluster-panel"`.
- Keyboard: native button behavior (Enter/Space toggles). No hover-dependent behavior anywhere.

## 5. Floating panel

### 5.1 Mounting

The panel is rendered by Manifesto via `createPortal(<ClusterPanel .../>, document.body)`.
Rationale: the section has `overflow: hidden`, which would clip a fixed-position panel; the portal
escapes it. Guard for SSR: only portal when `typeof document !== "undefined"`.

### 5.2 Panel content

- Kicker (mono 11px, `#98989C`, uppercase, letter-spacing 0.08em):
  `{year} - item {index + 1} of {items.length}` (example: `2025 - item 3 of 11`). Hyphen, never a dash.
- Title: `item.title` verbatim, `#FAFAFA`, 18px, weight 700.
- Body: `item.body` verbatim, `#D8D8D8`, 15px, line-height 1.65.
- Footer (mono 11px, `#98989C`): the verbatim `dotCount` string ("11 award items in 2025"), tying the
  item back to the station summary.
- Close affordance: a small "Close" text button top-right (tap), in addition to all dismiss paths in 5.5.
- Width 320px; `max-height: 60vh; overflow-y: auto` for long bodies.
- Colors: `background: rgba(17, 17, 17, 0.96); border: 1px solid rgba(255, 255, 255, 0.16);`
  `border-radius: 14px; padding: 18px 18px 14px;` `box-shadow: 0 18px 50px rgba(0, 0, 0, 0.55);`
- `z-index: 60` (above section content, lanterns, rings).

### 5.3 Desktop placement algorithm (min-width 1101px)

Two-pass: render panel at `visibility: hidden` at a first guess, measure with `getBoundingClientRect()`,
then commit the final `left`/`top` in state.

```ts
const PANEL_W = 320;
const M = 16; // viewport margin
const nodeR = nodeEl.getBoundingClientRect();
let x = nodeR.left + nodeR.width / 2 - PANEL_W / 2;
let y: number;
const h = panelR.height; // measured
if (onTop) {
  y = nodeR.top - h - 12;
  if (y < M) y = nodeR.bottom + 12;          // flip below the node
} else {
  y = nodeR.bottom + 12;
  if (y + h > window.innerHeight - M) y = nodeR.top - h - 12; // flip above
}
x = Math.max(M, Math.min(x, window.innerWidth - PANEL_W - M));
y = Math.max(M, Math.min(y, window.innerHeight - h - M)); // final clamp
```

`position: fixed; left: x; top: y;` via inline style.

### 5.4 Mobile presentation (max-width 1100px)

Anchor math is skipped. The panel becomes a bottom sheet:
- `position: fixed; left: 12px; right: 12px; bottom: 12px;` (not centered card: the sheet reads
  better one-handed and never covers the node row ambiguity).
- `max-height: 55vh; overflow-y: auto;` same card styling, `border-radius: 16px`.
- A backdrop `div.journey-cluster-backdrop` covers the viewport (`position: fixed; inset: 0;`
  `background: rgba(0, 0, 0, 0.5); z-index: 59`); tapping it closes the panel.
- `role="dialog"`, `aria-modal="true"`, `aria-label={item.title}`.

Desktop panel: `role="dialog"`, `aria-label={item.title}` (no aria-modal; it is a popover, focus stays
free, but ESC still closes).

### 5.5 Dismiss rules (all must work)

1. Tap the open node again -> closes.
2. Tap a different node -> panel content switches to that node (no close/open flicker).
3. Tap outside the panel and outside any node (desktop: document pointerdown outside both refs;
   mobile: backdrop tap) -> closes.
4. ESC key -> closes (document keydown listener active only while open).
5. Any scroll of the window -> closes (passive listener; keeps fixed placement from going stale).
6. Focus: on open, focus moves to the panel (`tabIndex={-1}` + `ref.focus()`); on close, focus
   returns to the node button that opened it. On mobile sheet, focus the Close button instead.

Single-panel rule: state lives in Manifesto:

```ts
const [openNode, setOpenNode] = useState<{ clusterId: string; nodeId: string } | null>(null);
```

`onToggle(id)`: if `openNode?.nodeId === id` -> null; else -> `{ clusterId: year, nodeId: id }`.
Because there is exactly one `openNode` state, two panels can never be open at once, even across
the 2024 and 2025 clusters.

### 5.6 Open animation

- Desktop: `opacity: 0 -> 1`, `scale(0.96) -> scale(1)`, 180ms ease-out,
  `transform-origin` on the edge nearest the anchor node. No layout shift: the panel is fixed and
  portaled, so nothing in the section reflows.
- Mobile sheet: `translateY(16px) -> translateY(0)` + opacity, 220ms ease-out.
- Reduced motion (`prefers-reduced-motion: reduce`): no animation, panel appears instantly
  (media query kills transitions; the JS also skips the two-pass measure and sets final coords
  immediately).

## 6. Interaction summary (tap-driven)

| Action | Result |
|---|---|
| Tap node | Panel opens anchored near it (desktop) / sheet rises (mobile) |
| Tap same node | Panel closes |
| Tap another node | Panel switches content |
| Tap outside / backdrop | Panel closes |
| ESC | Panel closes |
| Scroll | Panel closes |
| Hover (desktop) | Chip border brightens only. No content, no panel, nothing hover-dependent |

## 7. Hard rules checklist (verify at handoff)

- [ ] No em dash or en dash in spec, code, or copy. Hyphens and commas only.
- [ ] Every heading and text element in the cluster and panel carries an explicit light color
      (#FAFAFA headings, #D8D8D8 body, #98989C mono labels). Never inherited color on dark.
- [ ] All panel text is byte-identical to the existing `station.dots` strings. No invented detail.
- [ ] `CLUSTER_YEARS` gates the change to 2024 and 2025; 2022/2023/2026 markup untouched.
- [ ] `dotCount` paragraph stays in place, after the cluster, before the instrument.
- [ ] No changes to route/bead/seals/lanterns/rings/instruments/step-forward behavior or CSS.
- [ ] Mobile chips are >= 40px tall touch targets; no horizontal overflow of the page.
- [ ] Reduced-motion path renders the panel instantly with no animation.
- [ ] Panel never causes section layout shift (fixed/portal positioning, fixed cluster height on desktop).

## 8. Suggested QA before push

1. Desktop 1440px: open each of the 11 nodes in 2025 and 4 in 2024; confirm panel stays inside the
   viewport (flip/clamp cases: leftmost and rightmost nodes, top-row 2024 station).
2. Confirm only one panel at a time across both clusters.
3. Mobile 390px: cluster wraps without horizontal scroll; sheet opens, backdrop closes it; body
   scrolls inside the sheet when the panel content is long.
4. ESC closes; focus returns to the node.
5. Reduced-motion emulation: instant appearance, no slide/scale.
6. Text audit: panel strings equal `STATIONS[i].dots` byte-for-byte; zero em/en dashes in the diff.
7. Regression: bead, seals, instruments, lanterns, rings unchanged visually.
