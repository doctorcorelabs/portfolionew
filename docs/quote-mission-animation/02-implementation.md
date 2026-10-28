# 02 - Implementation: how a mission animation hooks into Quote.tsx

Base HEAD `edb7bd6`. `src/sections/Quote.tsx`, read in full. Feasibility only: no treatment design, no code.

## 1. Current mission structure and the split

Current: one `<p>` (18px, lineHeight 1.65, GRAPHITE `#3C3C38`, maxWidth 640, margin 0) with whole-block `missionOpacity` + translateY, and one blue `<span>` (`#0859D4`) on "CodeCureConnect:" mid-sentence, plus one `{" "}` after "on".

Split rule: mirror the claim's WORDS pattern. One inline `<span>` per part, exactly one space text node (`{" "}`) between adjacent spans, no trailing space inside spans. Inline spans break at those spaces exactly as the current text node does, so wrapping is unchanged.

| Part (wording unchanged) | Blue span? |
|---|---|
| 1. I aim to enhance health standards in Indonesia, | No |
| 2. bring about sustainable change, | No |
| 3. and create lasting positive impacts. | No |
| 4. I founded DaivanLabs on CodeCureConnect: | YES, nested |
| 5. code that becomes healthcare tools, | No |
| 6. and connections that carry them further. | No |

Coarser: 2 parts (by sentence) or 3 (sentence 1 as one + founded + mechanism). Finer than 6 (per word) buys nothing the claim does not already do.

Nested-color flag: an explicit child color always wins over inherited parent color, so part 4's parent cannot paint over the blue child. The blue span is either (a) always BLUE while siblings paint (accent-first, zero extra code) or (b) given its own ramp (pale-blue to BLUE) from the same threshold (one extra derived value). The implementation must pick one.

## 2. Progress math

`progress` is React state from the existing rAF-throttled scroll/resize listener (wrapper `getBoundingClientRect`, runway = rect height minus viewport). No new listener, timer, or state is needed: per-part values are pure derived values in render, like the claim's `painted` boolean. Scrolling back reverses them for free.

Measured runway (wrapper height minus viewport): desktop about 2115px (`100svh + 1875 + 240`); narrow (max-width 1023px) about 1265px (`100svh + 1125 + 140`). Mission window = progress 0.9-1.0, i.e. 0.1 of runway:

| | Desktop | Narrow |
|---|---|---|
| Window (0.9-1.0) | ~211.5px | ~126.5px |
| Per step, k=2 | ~105.8px | ~63.3px |
| Per step, k=3 | ~70.5px | ~42.2px |
| Per step, k=6 | ~35.3px | ~21.1px |

Correction to the brief: 187.5/112.5px assumed runway 1875/1125, ignoring the 240/140px padding inside the measured runway; true window is 211.5/126.5px.

Mission-local t = (progress - 0.9)/0.1, clamped 0-1. Part j of k paints at t >= (j+1)/k, the same shape as claim thresholds, rescaled. The 0.35s transition reuses directly: each part span gets `transition: "color 0.35s"` (undefined under reducedMotion, mirroring the claim) and color PALE to final. Narrow caveat: at 126.5px, 6 steps give ~21px each; momentum scrolling can flash past intermediate states (they still land correctly). Claim words already live with ~76px per word narrow; mission steps are tighter, same class.

Widening the window: constants only, no runway change. If the mission starts at m < 0.9, `missionOpacity` becomes (progress - m)/(1 - m) and the claim factor 0.9 must become m (word i paints at ((i+1)/15)*m), or the claim tail overlaps the mission head and breaks the "claim completes, then mission appears" sequencing. Claim then paints faster (step 0.06 becomes m/15; m = 0.75 gives 0.05, ~17% faster). Rule, dots, runway, padding are untouched (they key off progress or CSS, not 0.9). Do not widen unless the treatment needs more than ~211/127px of scroll.

## 3. Composing with existing mechanisms

| Mechanism | Interaction | Verdict |
|---|---|---|
| `missionOpacity` + translateY (14px) on `<p>` | Outer envelope over 0.9-1.0 | Keep, replace, or compose (below) |
| Dot entrance (0-0.1) + breathe (8s) | Background layers, z-index 0; body z-index 1 | No conflict; mission sits above dots |
| Dashed rule (drawn = progress) | `body(progress)`, full 0-1 | Unaffected; keys off progress, not mission constants |
| Sticky / padding / runway | CSS: sticky top 0, min-height 100svh, padding 120/70px, runway 1875+240 / 1125+140 | Byte-identical |
| Kicker, cursor-lit dots | Static kicker; cursor plumbing on stickyRef | Unaffected |
| Claim paint | 0-0.9, 0.35s, reversible | Unaffected unless window widened (see section 2) |

Envelope options:

- Keep: `<p>` keeps opacity + translateY; part paints ride inside the fading block. Smallest diff, but early parts paint while block opacity is still low, so the sequence reads as fade plus paint.
- Replace: drop `<p>` opacity/translateY; each part span carries its own ramp. Cleanest sequencing; removes the 14px slide unless re-added per part.
- Compose: keep translateY on `<p>`, drop `<p>` opacity, let part paints carry visibility. Slide preserved, paint clean.

Animation-vs-inline-opacity footgun (documented in the file for dots): CSS keyframes beat inline opacity on the SAME element for the animation's duration. The file avoids it by putting entrance opacity on a wrapper div and breathe on the inner dot layer. Same rule for mission: keyframe motion needs opacity on a different element than the animated one; inline transitions (the claim pattern) have no conflict. Prefer the claim pattern.

## 4. Reduced motion

Two layers, both must cover the new animation:

- Early-return branch: reducedMotion renders `body(1)` in a plain section (no tall wrapper, no pinning, no scroll listener, since the scroll effect returns early). The mission `<p>` already renders opacity 1, transform none. Every per-part derived value MUST include the claim's escape hatch: `painted = reducedMotion || progress >= threshold`. With it, the reduced-motion mission is fully visible and static, with no hidden text, including live OS-preference toggles (matchMedia re-renders to the other branch; derived values carry no stale state).
- CSS block: `@media (prefers-reduced-motion: reduce)` kills `.q-dot-breathe` and unpins the wrapper. Any NEW CSS animation class for mission parts must add `animation: none` here (belt-and-braces: the early-return branch never renders `.q-pin-wrap`, but the rule must exist if the class is ever used outside it).

## 5. Risks and footguns

- No new state/timers/listeners: per-part values derive from existing `progress`. Staggered setTimeout/useState per part would break reversibility (scroll-up must unpaint) and add cleanup. Do not.
- Whitespace: omitting `{" "}` between spans joins words ("impacts.I"); the existing `{" "}` after "on" must survive the split. HTML collapses double spaces, so spacing is forgiving, but keep it exact.
- Narrow runway: ~21px per step at k=6; momentum scroll flashes intermediate states. Same class as claim words; caps sensible granularity.
- Nested blue span: see section 1; handle explicitly or it renders full BLUE while siblings are pale.
- svh vs innerHeight: wrapper uses svh, runway uses rect vs innerHeight; mobile toolbars can shift progress slightly. Pre-existing.

## Must NOT change

Wording (both sentences, exact); WORDS array; claim thresholds (unless widening forces the 0.9 to m change, section 2); runway/padding/sticky CSS; kicker; dashed rule; dot layers, entrance, breathe, cursor plumbing; reduced-motion branch structure; dot entrance window (0-0.1). What MAY change: mission `<p>` internals (split spans), the `missionOpacity`/translateY composition (section 3), and, only if the treatment demands a wider window, the 0.9 constant in claim thresholds and `missionOpacity`.
