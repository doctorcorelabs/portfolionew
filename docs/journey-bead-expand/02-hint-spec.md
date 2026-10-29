# 02 - Animated "tap me" hint + 2026 bead conversion

Companion to `01-spec.md`. Build-ready. The user annotated the live preview
with "Click me" arrows pointing at the beads: every bead gets a small animated
hint pill inviting interaction, and the 2026 station's single dot becomes a
bead too.

## 1. Wording (4 options, do NOT pick - user chooses)

The implementer exposes a `hintText` prop (default `"tap me"`). Manifesto
passes one shared constant `BEAD_HINT_TEXT` to all three beads so the word is
swappable in exactly one place. Each option is at most 12 chars.

1. `"tap me"` - mobile-native, thumb-friendly connotation; reads fine on
   desktop too. Proposed default.
2. `"click me"` - desktop/mouse connotation; matches the user's own
   annotation wording ("Click me").
3. `"open me"` - neutral and device-agnostic; describes the action, not the
   input device.
4. `"peek inside"` - playful, curiosity-driven; longest option (11 chars),
   still fits the pill.

Render uppercase via CSS (`text-transform: uppercase`), mono 11px, so the
source string stays lowercase.

## 2. Placement

The hint floats beside the bead, vertically centered on the bead button. It
must clear the stem (below), the card (below), dotCount (below), and
neighboring stations (sides).

- Container: `.bead-expand-beadrow` gains `position: relative`. The hint is
  `position: absolute` inside it, so it takes zero flow space: **0 layout
  shift from the hint itself**, ever.
- Vertical: `top: calc(var(--bead-btn) / 2)` with `translateY(-50%)` baked
  into the float keyframes (see section 3).
- Horizontal (default, right side): `left: calc(50% + var(--bead-btn) / 2 + 6px)`.
  The 6px gap is measured from the *button* edge, so the pill slightly
  overlaps the orbit-ring zone (orbit is a 1px dashed ring, mostly
  transparent - overlapping it is intentional and saves ~16px vs clearing
  the full orbit radius). At a ~213px desktop column this keeps the pill
  inside the column: bead center ~106px + 24px + 6px = 136px start, pill
  ~70px wide ends ~206px < 213px.
- 2026 (rightmost desktop column) flips to the left: prop
  `hintSide?: "left" | "right"` (default `"right"`); with `"left"` the
  wrapper gets class `bead-expand-hint-left` and the rule becomes
  `right: calc(50% + var(--bead-btn) / 2 + 6px); left: auto`. Manifesto
  passes `hintSide="left"` only for 2026, at all breakpoints (consistent,
  no breakpoint exceptions).
- Tablet (721-1100px) and mobile (<=720px): identical rules; the CSS vars
  (`--bead-btn` 52px/48px) scale the offsets automatically. No extra
  media-query overrides needed.
- Caret: a 5px CSS triangle on the bead-facing edge of the pill
  (`.bead-expand-hint::before`, pointing toward the bead; mirrored for
  `-left`), colored to match the pill background. Pure decoration.
- `pointer-events: none` on the hint: it can never intercept bead taps.
- `aria-hidden="true"`: decorative; the button already carries its label.

## 3. Animation

Delightful but subtle. Unique keyframe name `bead-hint-float` (grep
site-wide before finalizing).

- Idle: gentle float + breathing, combined in one keyframe so they stay in
  sync:
  ```css
  .bead-expand-hint {
    animation: bead-hint-float 2.2s ease-in-out infinite;
    animation-delay: var(--hint-delay, 0s);
  }
  @keyframes bead-hint-float {
    0%, 100% { transform: translateY(calc(-50% + 4px)); opacity: 0.75; }
    50%      { transform: translateY(calc(-50% - 4px)); opacity: 1; }
  }
  ```
  (The `-50%` preserves the vertical centering from section 2.)
- Stagger per station so the three hints do not pulse in lockstep. Parent
  passes `hintDelay` (inline `--hint-delay`): 2024 `"0s"`, 2025 `"0.7s"`,
  2026 `"1.4s"`.
- First expand: the hint fades out over 300ms, then unmounts, and stays
  hidden for the rest of the session (no localStorage, per requirement).
  Suggested mechanism: parent owns `seenBeads` (section 5); BeadExpand keeps
  a tiny local `leaving` state - when `hintVisible` flips false, apply
  class `bead-expand-hint-leave` (`animation: none; opacity: 0; transition:
  opacity 300ms ease; transform: translateY(-50%)`) and unmount after
  320ms via timeout with cleanup. If the implementer finds a simpler
  equivalent, that is acceptable as long as the 300ms fade is preserved.
- Re-opening a seen bead: hint stays gone (no re-animation, no flash).
- `prefers-reduced-motion`: `animation: none`, static
  `transform: translateY(-50%)`, `opacity: 1`; the leave transition becomes
  `none` (instant hide). The hint still hides after first open.

## 4. 2026 bead conversion

- `BEAD_YEARS` becomes `new Set(["2024", "2025", "2026"])`.
- The 2026 dot `"Five further 2026 papers"` becomes a 1-item BeadExpand:
  `items={[{ id: "2026-0", title: dot }]}` derived verbatim like the others.
  Kicker renders `"2026 HIGHLIGHTS"` with a single row - no special-casing
  needed in the component.
- The dot text stays **byte-identical**. Do NOT expand it into five paper
  topics; the user has not approved listing them.
- 2026 has no `dotCount`, so nothing changes around the dotCount line.
- Layout consequence: the 2026 column is the same narrow width as the
  others; a 1-row card is short and wraps cleanly (`overflow-wrap:
  break-word` already in place). No overflow risk.

## 5. Component contract changes

`BeadExpand.tsx`:

```tsx
export type BeadExpandProps = {
  items: BeadItem[];
  year: string;
  expanded: boolean;
  onToggle: () => void;
  hintText?: string;        // default "tap me"
  hintVisible?: boolean;    // default true
  hintSide?: "left" | "right"; // default "right"
  hintDelay?: string;       // default "0s", sets --hint-delay
};
```

Render (inside `.bead-expand-beadrow`, after the stem):

```tsx
{(hintVisible || leaving) && (
  <span
    className={
      "bead-expand-hint" +
      (hintSide === "left" ? " bead-expand-hint-left" : "") +
      (leaving ? " bead-expand-hint-leave" : "")
    }
    style={{ "--hint-delay": hintDelay } as CSSProperties}
    aria-hidden="true"
  >
    {hintText ?? "tap me"}
  </span>
)}
```

`Manifesto.tsx`:

```tsx
const BEAD_YEARS = new Set(["2024", "2025", "2026"]);
const BEAD_HINT_TEXT = "tap me"; // swap the wording in one place
const [seenBeads, setSeenBeads] = useState<Set<string>>(() => new Set());
const toggleBead = (year: string) => {
  const opening = expandedBead !== year;
  if (opening) {
    setSeenBeads((s) => {
      const n = new Set(s);
      n.add(year);
      return n;
    });
  }
  setExpandedBead(opening ? year : null);
};
```

JSX per bead station:

```tsx
<BeadExpand
  items={...}
  year={station.year}
  expanded={expandedBead === station.year}
  onToggle={() => toggleBead(station.year)}
  hintText={BEAD_HINT_TEXT}
  hintVisible={!seenBeads.has(station.year)}
  hintSide={station.year === "2026" ? "left" : "right"}
  hintDelay={station.year === "2024" ? "0s" : station.year === "2025" ? "0.7s" : "1.4s"}
/>
```

Class names: `bead-expand-hint`, `bead-expand-hint-left`,
`bead-expand-hint-leave`. Keyframes: `bead-hint-float`. All unique
site-wide (verify with grep; must not collide with `bead-halo`,
`bead-orbit-spin`, lantern or ring keyframes).

## 6. Hard rules

- NO em dashes or en dashes anywhere (code, strings, comments, this spec
  is already clean - keep it that way). The caret is a CSS triangle, not a
  character; do not use arrow characters in the hint.
- Explicit light colors on the pill: text `#9CC2FF`, background
  `rgba(8, 89, 212, 0.28)`, border `1px solid rgba(110, 168, 254, 0.35)`
  (same treatment as the card kicker).
- `pointer-events: none` on the hint, always.
- Zero layout shift: hint is absolutely positioned; the beadrow needs no
  size change.
- A11y: `aria-hidden="true"`; keyboard and screen-reader users get the
  button's existing `aria-label` ("Show 2025 awards").
- Reduced-motion path from section 3 is mandatory, not optional.
- The 2026 dot title must remain byte-identical to the current source
  string; the component must not invent topic names.
