# Mission paragraph animation: synthesis

Base HEAD `edb7bd6`. `src/sections/Quote.tsx` read in full; 01-design, 02-implementation, 03-devices-a11y read first. No wording changes. `Quote.tsx` only.

## Verdict

| Decision | Value |
|---|---|
| Treatment | B: sequential blue underline bars under key phrases |
| Mission window | Progress 0.8 to 1.0 (claim factor 0.9 becomes 0.8) |
| Paragraph ramp | Progress 0.80 to 0.85: opacity 0 to 1, rise 14px to 0 |
| Bars | 3px `#0859D4`, one per phrase, sub-windows 0.05 each, ease-out mapped |
| Transitions in mission path | None (see section 4) |
| Reduced motion | Static text, fully visible, no bars |
| Colors / fonts | No new colors, no new fonts; blue `#0859D4` only |

## 1. Treatment B adopted; what A and C lose

B grows a 3px blue underline bar under each key phrase in reading order, scale 0 to 1, origin left. Text color never changes, so the mission stays fully readable at every scroll position.

| Treatment | Why it loses (per 01) |
|---|---|
| A: clause-by-clause paint | Repeats the claim's mechanism (one trick twice); needs the widest window (six beats; even widened to 0.75-1.0 only 78px/47px per beat); weakest mobile readability: pale beats over the dot field at 18px, a low-contrast swing versus the claim's 34-64px pale-to-ink swing; any mid-window rest leaves later beats pale. |
| C: chip flow | Decorates around the paragraph instead of animating it: three mono chips below the text, covering only the coined term, while the first sentence gets nothing; the paragraph stays flat; adds a UI-chrome row, the biggest minimalism cost. |

## 2. Runway correction: restated budgets

02 measures the true runway as wrapper height minus viewport: desktop 2115px, narrow 1265px. 01's budgets (375/225px window, 93.75/56.25px per bar) assumed runway 1875/1125, ignoring the 240/140px padding. Those figures are superseded.

| Quantity | Desktop | Narrow (max-width 1023px) |
|---|---|---|
| True runway | 2115px | 1265px |
| Mission window 0.8-1.0 (0.2 of runway) | 423px | 253px |
| Per bar sub-window (0.05 of runway) | 105.8px | 63.3px |
| Paragraph ramp 0.80-0.85 (0.05 of runway) | 105.8px | 63.3px |
| Claim per-word step, new (0.8/15 = 5.33%) | 112.8px | 67.5px |
| Claim per-word step, old (0.9/15 = 6%) | 126.9px | 75.9px |

The correction is favorable: each bar gets more scroll than 01 assumed.

## 3. Window change: 0.9 becomes 0.8

Mission window moves 0.9-1.0 to 0.8-1.0, so the claim factor must move with it, or the claim tail overlaps the mission head.

| Value | Old | New |
|---|---|---|
| Claim word i paints at | `((i+1)/15) * 0.9` | `((i+1)/15) * 0.8` |
| Claim per-word step | 6% of runway | 5.33% of runway |
| Last claim word lands at | Progress 0.9 | Progress 0.8 |
| `missionOpacity` | `progress <= 0.9 ? 0 : (progress - 0.9) / 0.1` | `progress <= 0.8 ? 0 : min(1, (progress - 0.8) / 0.05)` |
| Mission rise | 14px over 0.9-1.0 | 14px over 0.80-0.85, same `translateY((1 - opacity) * 14)` pattern, `none` when `reducedMotion` or opacity >= 1 |

Sequencing holds: at exactly 0.8 the claim is fully painted and mission opacity is 0. Rule, dots, runway, padding, sticky CSS, kicker, dot entrance (0-0.1), and cursor plumbing stay byte-identical.

Header comment MUST be updated (comments track constants):

- "Progress maps to words over the first 90 percent of the runway: word i (0-indexed) paints when progress >= ((i + 1) / 15) * 0.9, so the last word lands at progress 0.9." becomes first 80 percent, `* 0.8`, lands at progress 0.8.
- "The mission line fades in only near the end of the runway: opacity 0 at progress <= 0.9, ramping linearly to 1 at progress 1." becomes: opacity 0 at progress <= 0.8, ramping to 1 at progress 0.85 with a 14px rise over the same interval; four blue underline bars then grow over 0.80-0.85, 0.85-0.90, 0.90-0.95, 0.95-1.00.

## 4. Entrance envelope: one ramp, four bars, no double-ghosting

Settled values:

| Element | Interval (progress) | Mapping |
|---|---|---|
| Paragraph opacity + rise | 0.80-0.85 | Opacity 0 to 1 linear in progress; `translateY((1 - opacity) * 14)` to 0 |
| Bar 1: enhance health standards in Indonesia | 0.80-0.85 | `t = clamp01((progress - 0.80) / 0.05)`, growth `1 - (1 - t)^3` |
| Bar 2: sustainable change | 0.85-0.90 | Same mapping, start 0.85 |
| Bar 3: lasting positive impacts | 0.90-0.95 | Same mapping, start 0.90 |
| Bar 4: CodeCureConnect: | 0.95-1.00 | Same mapping, start 0.95 |

Ease-out mapping is `easeOutCubic`, `1 - (1 - t)^3` (`t = 0.5` gives 0.875; monotonic, so flings land correctly).

Ramp and bar 1 share 0.80-0.85 by design, and this is NOT double-ghosting: there is exactly one opacity in the mission (the paragraph's); bars contribute zero opacity, they are background-size growth, not fades, so no multiplicative fade exists anywhere. Text color is constant graphite at every position once visible, with no pale text states at all. The bar is a 3px underline below the text, never covering glyphs. Bars 2-4 then grow under fully visible text. Below 0.80 the paragraph is invisible and all bars are 0; scrolling back up reverses everything. At progress 1.0 the mission is 100% final: graphite body, blue `CodeCureConnect:`, all four bars full.

Note on 0.35s: 01's "fades in over 0.35s" is NOT carried as a time constant. The claim's 0.35s transition exists because word paint is a boolean flip; paragraph opacity and bar growth are continuous progress mappings that need none. No `transition` is added anywhere in the mission path. Adding one would make rendered values time-dependent and lag scroll-up reversal. The 0.35s allowance is recorded but not used; the claim's transition is untouched.

## 5. Wrapping-bar technique

Bars live on plain inline spans that wrap across lines, with line counts at 320-1440 equal to the current build (D1). No block/flex/grid splits, no inline-block units, exact whitespace.

Specified technique: background gradient (transforms do not apply to plain inline boxes, so "scaleX" is the concept and background-size is the paint-only implementation):

- Each bar span (plain inline, no `display` property): `backgroundImage: linear-gradient(#0859D4, #0859D4)`, `backgroundRepeat: "no-repeat"`, `backgroundPosition: "0 100%"`, `backgroundSize: <growth * 100>% 3px`, `paddingBottom: 3`.
- On wrap, the background fragments per line box automatically; each fragment carries its own growing segment.
- `paddingBottom: 3` drops the bar below descenders (the `p` in `impacts`/`positive`). Vertical padding on inline spans is paint-only: it does not change line-box heights or line counts, which reconciles 03 section 5 / D9 (this use cannot shift layout; D1's line-count check enforces it). Horizontal padding is forbidden. Live-preview check: descender clearance; if the bar touches descenders, raise `paddingBottom` to 4 (no layout impact).
- Blue span: the existing `CodeCureConnect:` span keeps color BLUE at all times (accent-first, per 02 option (a)); only the bar background is added.

Span inventory (concatenation must equal the current sentence byte-for-byte; spaces live outside spans, never trailing inside a span):

| Segment | Type |
|---|---|
| `I aim to ` | Plain text |
| `enhance health standards in Indonesia` | Bar span 1 |
| `, bring about ` | Plain text |
| `sustainable change` | Bar span 2 |
| `, and create ` | Plain text |
| `lasting positive impacts` | Bar span 3 |
| `. I founded DaivanLabs on ` | Plain text |
| `CodeCureConnect:` | Bar span 4 (existing blue span) |
| ` code that becomes healthcare tools, and connections that carry them further.` | Plain text |

Fallback ladder if D1 fails: (1) audit whitespace first (exact `{" "}` nodes at every span boundary, no trailing space inside any span; the `impacts.I` footgun from 02 is the most likely cause, since backgrounds cannot change layout); (2) step reveal: each bar appears at full width when its sub-window opens, no growth; (3) drop bars, keep the paragraph entrance only, and report.

## 6. Reduced motion (hard)

- Guard on EVERY new derived value. Critical trap: under reduced motion the scroll effect never runs, so `progress` stays 0.
- Bars: when `reducedMotion` is true, bar spans get NO background properties at all (undefined), not scale 1. The early-return static branch therefore renders the mission fully visible with no bars: graphite body, blue `CodeCureConnect:`, plain text.
- Paragraph and claim guards already exist and stay: mission opacity 1 / transform `none` under `reducedMotion`; claim `painted = reducedMotion || ...`. The static branch uses `body(1)` with no wrapper, pinning, or scroll listener; the window change cannot leak into it because every static value comes from a `reducedMotion` ternary, not progress.
- No CSS keyframes or animation classes on mission elements, ever, so no `animation: none` backstop is needed. Any animation class added (forbidden by this spec) must add the reduced-motion kill.
- Live OS-preference toggles re-render correctly: `reducedMotion` is React state from the existing `matchMedia` listener, and all values are derived, so no stale animation exists to clear.

## 7. Fixer change list (Quote.tsx only)

1. Header comment: the two 0.9 bullets become 0.8 per section 3. No other comment changes.
2. Claim threshold: `((i + 1) / WORDS.length) * 0.9` becomes `* 0.8`. WORDS array untouched.
3. `missionOpacity`: `progress <= 0.9 ? 0 : (progress - 0.9) / 0.1` becomes `progress <= 0.8 ? 0 : min(1, (progress - 0.8) / 0.05)` (via `clamp01`), keeping the `reducedMotion ? 1` ternary and transform pattern.
4. Mission `<p>` internals: split per section 5; bar spans get the background spec and `paddingBottom: 3`; bar 4 is the existing blue span plus the background; growth is `1 - (1 - clamp01((progress - start) / 0.05))^3`, starts 0.80/0.85/0.90/0.95; under `reducedMotion`, bar backgrounds are undefined.
5. Forbidden: no new state, listeners, timers, rect reads, CSS classes, keyframes, `transition` properties, `display` changes, or `will-change`; no wording or WORDS change; no change to rule, dots, runway/padding/sticky CSS, kicker, dot entrance (0-0.1), cursor plumbing, or the reduced-motion branch structure.
6. Verify before writing the fix doc: concatenated rendered text equals the current sentence byte-for-byte; grep `0.9` in `Quote.tsx` returns nothing; diff is `Quote.tsx` plus docs only.

## 8. QA checklists

Motion: sub-window fractions 0.80/0.85/0.90/0.95/1.00 and px budgets 423/105.8 desktop, 253/63.3 narrow; ease-out mapping (`t = 0.5` gives 0.875, monotonic); reversibility (scroll-up shrinks bars in reverse, paragraph fades below 0.80, fling lands all final); paragraph ramp 0.80-0.85 with 14px rise; claim completes at 0.8; final state at 1.0 (graphite, blue `CodeCureConnect:`, four bars full).

Layout-devices (03 D1-D13 substance, all bands, no band-specific parameters): D1 line counts 320-1440 equal current build (bar spans plain inline, exact whitespace); D2 final state at 1.0 all bands; D3 no hidden text at any rest position above 0.85 (paragraph opacity 1, text color constant; the pale-plus-stroke clause does not apply to B, which has no paint states); D4 reversibility incl. fling; D5 static reduced-motion section (fully visible, no bars, no wrapper/pinning/animation); D6 mid-session preference toggle switches instantly with no pale/hidden text; D7 touch scroll advances bars, no hover/tap/cursorLit gate; D8 existing scroll plus resize listeners only, zero new listeners/timers/rect reads/per-part state; D9 paint-only properties (background-size growth plus vertical-only inline `paddingBottom`; no width/height/margin/font-size/line-height change, no keyframes); D10 seam 1023/1024 (same fraction mapping, order, final state both sides; runway/padding change only); D11 blue span always BLUE, lands BLUE at 1.0 (the pale-state clause does not apply to B, which never paints the blue span); D12 geometry identical all bands (maxWidth 640, 24px padding, 32px gutter, 18px, 1.65, no layout shift); D13 live-preview eyeballs owed (sandbox cannot render): phone portrait final state, bar growth sequence, descender clearance, reduced-motion static, touch-scroll spot check.

Regression: diff is `Quote.tsx` plus docs only; wording byte-identical; WORDS array untouched; claim change is ONLY the 0.9-to-0.8 factor; runway/padding/rule/dots/kicker/dot-entrance/cursor-plumbing untouched; build PASS; em dash 0; live-preview eyeballs owed as in D13.
