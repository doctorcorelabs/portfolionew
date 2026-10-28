# 06 - QA layout, devices, accessibility, performance

Verdict: **CONDITIONAL SHIP** (disclosure-only items, no code blocker).

Base HEAD `edb7bd6` verified; `00-synthesis.md`, `03-devices-a11y.md`,
`04-fix.md` read first, then `src/sections/Quote.tsx` read in full.
Read-only throughout: no source edited, no build run, no push.
Diff scope confirmed: only `M src/sections/Quote.tsx`
(37 insertions / 11 deletions, matching the fix doc) plus untracked
`docs/quote-mission-animation/`. All checks below are code + reasoning;
the sandbox cannot render, so every render-dependent item is marked
live-preview explicitly and never claimed as rendered.

## D1: inline spans, whitespace, padding — code conditions PASS

Bar spans are plain inline: `barStyle` (lines 194-206) sets
`backgroundImage`, `backgroundRepeat`, `backgroundPosition`,
`backgroundSize`, `paddingBottom: 3` only — no `display` property
(the file's only `display` is line 357, the pre-existing sticky flex).
No block/flex/grid/inline-block splits anywhere in the mission path.
Whitespace is exact: `I aim to{" "}` + span 1 + `{", bring about "}` +
span 2 + `{", and create "}` + span 3 + `{". I founded DaivanLabs on "}` +
span 4 + `{" code that becomes healthcare tools, and connections that
carry them further."}`. Spaces live outside spans, no trailing space
inside any span, and the `impacts.I` boundary is exact (span 3 ends
`impacts`, next segment starts `. I founded`). `paddingBottom` is
vertical-only; no horizontal padding exists. Render equality of line
counts at 320-1440 itself is NOT provable by reading — see disclosure
(1) below. The code-side determinants (inline spans, no
layout-affecting properties) all pass, and vertical padding on inline
spans is paint-only per CSS, so the residual risk is low.

## D2: final state at 1.0 — PASS, all bands

At progress 1.0: `missionOpacity = clamp01((1 - 0.8) / 0.05) = 1`,
transform `none`; every `barGrowth` is
`1 - (1 - clamp01((1 - start) / 0.05))^3 = 1`, so all four bars render
`backgroundSize: 100% 3px`. Body color is constant `GRAPHITE`,
`CodeCureConnect:` is `BLUE`. No band-specific parameters exist, so
the final state is identical on every band.

## D3: no hidden text above 0.85 — PASS

Paragraph opacity is 1 at every rest position at or above 0.85
(`clamp01` saturates at exactly 0.85). Text color is constant
`GRAPHITE` in the mission path; `barStyle` adds background only and
never touches text color (except the blue span, which is always
`BLUE`). The pale-plus-stroke clause does not apply: this treatment
has no paint states, and the mission never goes pale. Below 0.80 the
paragraph is invisible as a whole — the pre-existing single-ramp
entrance, not a per-part hide. Bars at 0 below their sub-windows are
decoration, not text; no part of the text is ever hidden per-part.

## D4: reversibility including fling — PASS

Every mission value is a monotonic pure function of progress:
`missionOpacity` (linear ramp), `barGrowth` (easeOutCubic over a
clamped sub-window), and the claim threshold. Scroll-up reverses all
of them; a fling to the bottom lands progress 1.0, hence every value
final. No `transition` exists in the mission path (the file's only
transitions are the pre-existing claim word color 0.35s and the
dot-lit opacity), so nothing lags scroll-up reversal.

## D5: static reduced-motion section — PASS

The early-return branch renders a plain section (`130px 24px`,
`body(1)`): no wrapper, no pinning, no scroll listener (the scroll
effect early-returns when `reducedMotion` is true). Mission opacity
is 1 and transform `none` via ternaries; `barStyle` under
`reducedMotion` returns `{}` (or `{ color: BLUE }` for bar 4) — no
background properties at all, not scale 1. Result: fully visible
mission, no bars, no wrapper, no pinning, no animation.

## D6: mid-session preference toggle — PASS

`reducedMotion` is React state from the pre-existing `matchMedia`
listener (change handler plus cleanup, mount sync). Every mission
value derives from that state, never from stale animation: toggling
to reduced motion swaps to the static branch instantly with mission
opacity 1 and no bars; toggling back re-runs the scroll effect, which
calls `update()` synchronously on mount, so progress recomputes
immediately rather than waiting for a scroll event. No pale or hidden
text at either side of the toggle (claim uses the `reducedMotion ||`
guard; mission uses ternaries). No mission keyframes exist to clear.

## D7: touch — PASS

Bars advance on touch scroll through the existing passive scroll
listener; the mission path depends only on `progress` and
`reducedMotion`. No hover, tap, tap-to-reveal, or `cursorLit` gate
exists in the mission path (`cursorLit` affects only dot-lit opacity;
`handleMouseMove` is mouse-only and touches dot CSS variables only).

## D8: listeners, timers, rect reads, state — PASS

Grep confirms the only listeners are pre-existing: `matchMedia`
change, `scroll` (passive), `resize`. Zero new listeners, zero
timers (no `setTimeout`/`setInterval` in the file), zero new rect
reads (the single `getBoundingClientRect` per tick is pre-existing),
zero per-part state (`barGrowth`/`barStyle` are pure render
derivations). Zero `will-change` in the file.

## D9: paint-only properties — PASS

Mission animation uses only `backgroundSize` growth plus
vertical-only inline `paddingBottom`. No width, height, margin,
font-size, or line-height change occurs on any mission element at any
progress (the paragraph's 18px / 1.65 / maxWidth 640 / margin 0 are
constants). No keyframes touch mission text (the only keyframes are
the pre-existing dot breathe on the dot layer). No old thresholds
remain: grep `0.9` returns exactly three lines, all specified new
constants (comment bar windows, `barStyle(0.9)`, `barStyle(0.95,
true)`).

## D10: seam 1023/1024 — PASS

All thresholds are progress fractions (0.80/0.85/0.90/0.95/1.00),
never pixels, and progress is runway-relative, so the fraction
mapping, bar order, and final state are identical on both sides. The
only changes across the seam are runway/padding CSS (wrapper height
and sticky padding in the `max-width: 1023px` block).

## D11: blue span — PASS

`barStyle(0.95, true)` keeps `color: BLUE` at all times (both
branches); the blue span is never painted, so the pale-state clause
does not apply. At 1.0 it lands `BLUE` with its bar full.

## D12: geometry identical all bands — PASS

Mission paragraph: 18px, 1.65, `maxWidth` 640, margin 0, constant on
every band. Side padding 24px on both bands (sticky padding 120/24
desktop, 70/24 narrow); gutter `paddingLeft` 32 constant; container
`maxWidth` 1160 centered. No layout shift: bars are background-size
only, and vertical inline padding does not change line-box heights.

## Disclosures (not blockers)

1. D1 line-count render equality at 320-1440 is unproven by reading
   (sandbox cannot render). Code-side conditions all pass; confirm
   on live preview. If it fails, the synthesis fallback ladder
   applies: audit whitespace first, then step reveal, then drop bars
   and keep the paragraph entrance only.
2. D13 live-preview eyeballs owed: phone portrait final state, bar
   growth sequence in reading order, descender clearance (bars below
   the `p` in `impacts`/`positive`; prescribed adjustment
   `paddingBottom` 3 to 4 if touched, no layout impact),
   reduced-motion static, touch-scroll spot check.

Out of scope for this QA (other agents own it): motion fractions and
px budgets, build re-run, full regression diff scope beyond the stat
above, and any live render.
