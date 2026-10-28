# Mission paragraph animation: fix

Base HEAD `edb7bd6`. `src/sections/Quote.tsx` only (37 insertions / 11 deletions, 4 hunks). No push. Synthesis `00-synthesis.md` implemented exactly; no deviation.

## Exact diff

1. Header comment: the two 0.9 bullets become 0.8. Claim bullet: first 80 percent, `* 0.8`, last word lands at progress 0.8. Mission bullet: opacity 0 at progress <= 0.8, ramping to 1 at progress 0.85 with a 14px rise over the same interval, four bars over 0.80-0.85, 0.85-0.90, 0.90-0.95, 0.95-1.00. No other comment changes.
2. Claim threshold: `((i + 1) / WORDS.length) * 0.9` becomes `* 0.8`. WORDS array byte-identical.
3. `missionOpacity`: `progress <= 0.9 ? 0 : (progress - 0.9) / 0.1` becomes `progress <= 0.8 ? 0 : clamp01((progress - 0.8) / 0.05)`. The `reducedMotion ? 1` ternary and the `translateY((1 - opacity) * 14)` / `none` transform pattern are untouched.
4. Mission `<p>` internals, per the synthesis span inventory, with two derived helpers (`barGrowth`, `barStyle`; no new state, listeners, timers, rect reads, classes, keyframes, transitions, display changes, or will-change):
   - `I aim to{" "}` + bar span 1 `enhance health standards in Indonesia` (start 0.80) + `{", bring about "}` + bar span 2 `sustainable change` (0.85) + `{", and create "}` + bar span 3 `lasting positive impacts` (0.90) + `{". I founded DaivanLabs on "}` + bar span 4 `CodeCureConnect:` (0.95, existing blue span) + `{" code that becomes healthcare tools, and connections that carry them further."}`.
   - Bar spans are plain inline (no `display` property): `backgroundImage: linear-gradient(#0859D4, #0859D4)`, `backgroundRepeat: "no-repeat"`, `backgroundPosition: "0 100%"`, `backgroundSize: <growth * 100>% 3px`, `paddingBottom: 3`. No horizontal padding anywhere.
   - Bar 4 keeps `color: BLUE` at all times (accent-first); only the bar background is added.
   - Growth: `1 - (1 - clamp01((progress - start) / 0.05))^3` (easeOutCubic; t = 0.5 gives 0.875, monotonic, flings land correctly).
   - Under `reducedMotion`, `barStyle` returns `{}` (or `{ color: BLUE }` for bar 4): NO background properties at all, not scale 1. The static branch therefore renders fully visible text with no bars.
5. No transition added anywhere in the mission path (paragraph opacity and bar growth are continuous progress mappings; a transition would lag scroll-up reversal). The claim's 0.35s transition is untouched. Rule, dots, runway/padding/sticky CSS, kicker, dot entrance (0-0.1), cursor plumbing, and the reduced-motion branch structure are untouched. No band-specific thresholds, durations, or splits.

## Verification

- (a) Concatenation: the nine new segments were joined in node and compared to the original sentence: equal, 234 characters both. Spaces live outside spans (never trailing inside a span); the `impacts.I` join is exact (span 3 ends `impacts`, next segment starts `. I founded`). Old body sentences: 0 hits remaining.
- (b) `0.9` grep, reported precisely: plain `grep "0.9"` matches exactly three lines, all specified new constants (comment bar-window ranges `0.90-0.95, 0.95-1.00`; `barStyle(0.9)` bar 3 start; `barStyle(0.95, true)` bar 4 start). Zero old-threshold occurrences remain (claim `* 0.9`, mission `<= 0.9` / `/ 0.1`, comment 0.9 bullets all gone). A literal "grep 0.9 returns nothing" is unsatisfiable alongside the specified 0.90/0.95 starts, since those constants contain the substring; the honest check is that every remaining match is a specified new constant.
- (c) `git status`: only `M src/sections/Quote.tsx` plus untracked `docs/quote-mission-animation/`. No other file.
- (d) Build: PASS, vite built in 7.79s (tsc + vite).
- (e) Em dash in diff: 0.
- D1 line-count check (line counts 320-1440 equal to the current build): NOT verified by reading; the sandbox cannot render. This is a live-preview/QA item, not something proved here. The fallback ladder from the synthesis applies if D1 fails: audit whitespace first, then step reveal, then drop bars and keep the paragraph entrance only.

## Settled envelope

Paragraph ramp 0.80-0.85 (opacity 0 to 1 linear, rise 14px to 0, same translateY pattern) shares its window with bar 1 by design, and this is not double-ghosting: exactly one opacity exists in the mission (the paragraph's); bars are background-size growth, not fades. At progress 0.8 the claim is fully painted and mission opacity is 0; below 0.80 the paragraph is invisible and all bars are 0; scrolling back up reverses everything. At progress 1.0 the mission is 100 percent final: graphite body, blue `CodeCureConnect:`, all four bars full. Under reduced motion: fully visible, no bars, no wrapper, no pinning, no scroll listener; the window change cannot leak into the static branch because every static value comes from a `reducedMotion` ternary, not progress.

## Live-preview items (sandbox cannot render)

- Descender clearance: if a bar touches descenders (the `p` in `impacts`/`positive`), raise `paddingBottom` from 3 to 4. No layout impact (vertical padding on inline spans is paint-only).
- Bar growth sequence in reading order: bar 1 with the paragraph ramp (0.80-0.85), then bar 2 (0.85-0.90), bar 3 (0.90-0.95), bar 4 (0.95-1.00), each ease-out.
- Final state at 1.0: graphite body, blue `CodeCureConnect:`, four bars full, paragraph at full opacity with no rise offset.
- D1 line counts at 320-1440 equal to the current build; phone portrait final state; touch-scroll spot check (bars advance on scroll, no hover/tap gate).
