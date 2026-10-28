# QA-MOTION: mission paragraph animation

**Verdict: SHIP, no blockers.**

Read-only throughout: no source edited, no build run, no push. Base HEAD `edb7bd6` verified; `00-synthesis.md` and `04-fix.md` read first, then `src/sections/Quote.tsx` read in full. `git status` shows only `M src/sections/Quote.tsx` plus untracked `docs/quote-mission-animation/`; diff stat 37 insertions / 11 deletions matches the fixer. All values below are code + progress math (sandbox cannot render).

## 1. Sub-window fractions and mappings: PASS

Paragraph ramp (`Quote.tsx:122`, `216-220`): `missionOpacity = progress <= 0.8 ? 0 : clamp01((progress - 0.8) / 0.05)`, opacity 0 to 1 linear over 0.80-0.85, rise `translateY((1 - opacity) * 14)` to 0 (transform `"none"` once opacity >= 1). Bar growth (`:192-193`): `1 - (1 - clamp01((progress - start) / 0.05)) ** 3`, starts 0.80 (`:224`), 0.85 (`:226`), 0.90 (`:228`), 0.95 (`:230`, blue). Fractions are exactly 0.80/0.85/0.90/0.95/1.00.

Bar span spec (`:194-206`): plain inline (no `display` property), `backgroundImage: linear-gradient(#0859D4, #0859D4)` (`BLUE = "#0859D4"`, `:43`), `no-repeat`, position `0 100%`, size `<growth * 100>% 3px`, `paddingBottom: 3`, no horizontal padding. Bar 4 keeps `color: BLUE` in both branches (accent-first). Concatenation independently re-checked in Python: nine segments join to the original sentence exactly, 234 characters both, spaces outside spans, `impacts.I` join exact.

## 2. Scroll budgets: PASS

Wrapper heights in the style block are `100svh + 1875px + 240px` (desktop) and `100svh + 1125px + 140px` (narrow, `max-width: 1023px`); runway = height minus viewport, so 2115px / 1265px (header comment `:8`, `:10` confirms). Progress is `clamp01(-rect.top / runway)` (`:105`), so the svh term cancels and these budgets hold at any viewport height.

| Quantity | Desktop | Narrow |
|---|---|---|
| Mission window 0.8-1.0 (0.2 of runway) | 423px | 253px |
| Per-bar sub-window / ramp (0.05 of runway) | 105.75px (105.8) | 63.25px (63.3) |
| Claim per-word step (0.8/15 = 5.333%) | 112.8px | 67.5px |

WORDS count confirmed 15 (array `:50-66`; the 16th `text:` grep hit is the type annotation line). Claim threshold (`:163`): `progress >= ((i + 1) / 15) * 0.8`; last word lands at exactly 0.8. No old-threshold remnant: grep for `* 0.9` / `<= 0.9` returns nothing (the only `/ 0.1` hit is the pre-existing dot entrance `:128`); remaining `0.9` matches are exactly the three specified new constants (comment ranges `:24`, `barStyle(0.9)`, `barStyle(0.95, true)`).

## 3. Ease-out mapping: PASS

`t = 0.5` gives `1 - (1 - 0.5)^3 = 1 - 0.125 = 0.875`. Monotonic: as progress rises, `clamp01` rises, `(1 - clamp01)^3` falls, so growth rises; no flat or reversing segment. A fast fling jumps progress to 1.0, where every `clamp01` term is 1 and every bar lands full, and `missionOpacity` clamps to 1. Mid-window spot check: at 0.825, opacity is 0.5, rise 7px, bar 1 growth 0.875.

## 4. Reversibility: PASS

Every animated value is a pure function of `progress` (`missionOpacity`, `barGrowth`, claim `painted`), and `progress` itself is a pure function of scroll position. No value depends on scroll direction, velocity, or history; there is no per-bar state to go stale. Scrolling up shrinks bars in reverse order (4, 3, 2, 1), fades the paragraph from 0.85 down to 0 at 0.80, and unpaints the claim in reverse. The rAF throttle on the scroll listener only coalesces updates; it cannot change any landed value.

## 5. Sequencing: PASS

| Progress | Claim | Paragraph | Bars |
|---|---|---|---|
| Below 0.80 | Painting | Opacity 0, invisible | All 0 |
| Exactly 0.80 | Fully painted (last word threshold 15/15 x 0.8) | Opacity 0 | Bar 1 at 0 |
| 0.80-0.85 | Painted | Ramping 0 to 1, rise 14px to 0 | Bar 1 growing (shared window by design, not double-ghosting: one paragraph opacity only; bars are background-size, not fades) |
| 0.85 | Painted | Opacity 1, rise 0 | Bar 1 full, bar 2 at 0 |
| 0.90 / 0.95 | Painted | Opacity 1 | Bar 2 / bar 3 full, next bar at 0 |
| 1.00 | Painted | Opacity 1, no rise | All four full |

Bars 2-4 grow under fully visible text (opacity already 1 from 0.85 on). Text color is constant graphite (`#3C3C38`) at every visible position; there are no pale mission states at all.

## 6. Final state at 1.0: PASS

Opacity `clamp01(0.2 / 0.05) = 1`, transform `"none"` (zero rise offset), all four bars at `backgroundSize: 100% 3px`, graphite body, blue `CodeCureConnect:`.

## 7. No transition in the mission path: PASS

The mission `<p>` style (`:211-222`) and the bar spans carry no `transition` property. The only `transition` hits in the file are the claim's pre-existing `color 0.35s` (`:176`, guarded by `reducedMotion`, byte-untouched) and the pre-existing cursor-lit dot opacity (`:438`, dot layer, not the mission path). Paragraph opacity and bar growth are continuous progress mappings, so scroll-up reversal cannot lag.

## 8. No new machinery in the mission path: PASS

State is only the three pre-existing values (`cursorLit`, `progress`, `reducedMotion`, `:75-77`). Listeners are only the pre-existing matchMedia change and scroll + resize handlers; no `setTimeout`/`setInterval`; rect reads only the two pre-existing ones (scroll update `:103`, cursor handler `:143`). The mission path adds exactly two derived helpers (`barGrowth`, `barStyle`, `:192-206`), no classes, no `display` changes, no `will-change` (grep: 0 occurrences). The file's only keyframes (`q-dot-breathe`) belong to the pre-existing dot layers, not to mission elements.

## 9. Reduced-motion guards: PASS

The scroll effect early-returns on `reducedMotion` (above the `:103` rect read), so `progress` stays 0. `barStyle` under `reducedMotion` returns `{}` (or `{ color: BLUE }` for bar 4): no background properties at all, not scale 1. Paragraph opacity is 1 and transform `"none"` (`:216-220`); claim guard `reducedMotion || ...` is intact (`:163`). The static branch returns a plain section with `body(1)`, no `q-pin-wrap` class, no pinning, no scroll listener. Every static value comes from a `reducedMotion` ternary, not progress, so the window change cannot leak into it. Mid-session preference toggles re-render through the existing matchMedia state, so no stale animation exists to clear.

## Disclosures (not blockers)

- D1 line counts (320-1440 equal to the current build) and descender clearance (`paddingBottom: 3`, raise to 4 if a bar touches a descender) are live-preview items; the sandbox cannot render them. The fixer's fallback ladder (whitespace audit, then step reveal, then drop bars) stands if D1 fails.
- Floating-point edge at exactly 0.85: `(0.85 - 0.8) / 0.05` computes to 0.9999999999999986, so opacity is a hair under 1 and rise is ~2e-14px; it renders as final. No visible effect.
- Live-preview eyeballs owed: bar growth sequence in reading order, phone portrait final state, touch-scroll spot check (bars advance on scroll, no hover/tap gate; nothing in code gates them on pointer state).

## Out of scope for this QA (other agents own it)

Build re-run, wording/WORDS byte-identity and full diff scope (regression), layout-devices D1-D13 beyond the motion values above, and any live render.
