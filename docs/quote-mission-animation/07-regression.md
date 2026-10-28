# QA regression: mission paragraph animation

**Verdict: CONDITIONAL SHIP** (one disclosure-only item, no code blocker in the change itself).

Read-only except the build; no source edited, no push. Base HEAD `edb7bd6` verified; `00-synthesis.md` and `04-fix.md` read first, then `git diff` and `src/sections/Quote.tsx` in full.

## Scope checks

**(1) Diff scope.** `git status`: only `M src/sections/Quote.tsx` plus untracked `docs/quote-mission-animation/`. `git diff --stat` measured by me (not copied): 1 file, 37 insertions, 11 deletions, 4 hunks. No other file touched.

**(2) Wording byte-identical.** The nine mission segments joined equal the base sentence exactly, 234 characters both, re-verified by script (not copied from the fixer). Honest note on method: a first naive extraction mismatched, because my script dropped spaces that JSX collapses from newlines inside text runs. Re-run with correct JSX semantics (a newline inside a text run collapses to one space; newline-containing whitespace at element boundaries strips) gives identical strings. Segments per spec, spaces outside spans, never trailing inside a span; the `impacts.I` join is exact (span 3 ends `impacts`, next segment starts `. I founded`).

**(3) WORDS array untouched.** No `WORDS[` hunk exists in the diff; the claim map line changed only the factor (see 4).

**(4) Claim change is ONLY the 0.9-to-0.8 factor.** `((i + 1) / WORDS.length) * 0.9` becomes `* 0.8`; the formula is otherwise identical. The claim's 0.35s transition is untouched (`transition: reducedMotion ? undefined : "color 0.35s"`).

**(5) Header comment updated, one disclosure.** The two 0.9 bullets become 0.8 exactly per spec (first 80 percent, `* 0.8`, last word lands at 0.8; mission opacity 0 at `<= 0.8`, ramping to 1 at 0.85 with a 14px rise, bars over 0.80-0.85, 0.85-0.90, 0.90-0.95, 0.95-1.00). Disclosure (the reason for CONDITIONAL rather than plain SHIP): one NEW comment block was added for the bar helpers. No pre-existing comment besides the two bullets was altered, and the new block's values match the spec (0.05 sub-window, easeOutCubic, no backgrounds under reduced motion). It is additive documentation of new code, not a drift in existing documentation, and it changes no behavior.

**(6) Untouched.** The diff's four hunks are only: header comment, `missionOpacity`, claim threshold, bar helpers plus mission `<p>`. Outside them, and therefore byte-identical: runway/padding/sticky CSS, dashed rule, dot layers, dot entrance (0-0.1), cursor plumbing, kicker, and the reduced-motion branch structure. Evidence: `dotEntrance` is identical to base (base line 126, current line 128; the +2 shift comes from the header hunk alone). The mission `<p>` style keeps `opacity: reducedMotion ? 1 : missionOpacity` and the `translateY((1 - opacity) * 14)` / `none` pattern. Scroll/resize listeners and the `[reducedMotion]` effect deps are unchanged.

**(7) Mission-path additions: two derived helpers only.** `barGrowth` and `barStyle` derive from `progress` and `reducedMotion`. Added-lines grep for `useState`, `useEffect`, `addEventListener`, `setTimeout`, `setInterval`, `getBoundingClientRect`, `className`, `@keyframes`, `transition`, `display:`, `willChange` returns NONE (the `getBoundingClientRect` in the file is pre-existing cursor plumbing, untouched). Bar spans are plain inline (no `display` property): `linear-gradient(BLUE, BLUE)`, `no-repeat`, `0 100%`, `backgroundSize` `<growth * 100>% 3px`, `paddingBottom: 3`, no horizontal padding. Growth is `1 - (1 - clamp01((progress - start) / 0.05))^3` with starts 0.80/0.85/0.90/0.95. Bar 4 keeps `color: BLUE` at all times; under `reducedMotion`, `barStyle` returns `{}` (or `{ color: BLUE }` for bar 4): no background properties at all.

**(8) The 0.9 check, interpreted honestly.** A literal "grep 0.9 returns nothing" is unsatisfiable alongside the specified 0.90/0.95 constants, so the correct check is per-match classification. `grep "0.9"` in `Quote.tsx` returns exactly three lines, each a specified new constant:

| Line | Match | Classification |
|---|---|---|
| 24 (comment) | `0.80-0.85, 0.85-0.90, 0.90-0.95, 0.95-1.00` | Specified bar windows (synthesis section 3) |
| 228 | `barStyle(0.9)` | Specified bar 3 start |
| 230 | `barStyle(0.95, true)` | Specified bar 4 start (matches via the 0.95 substring) |

Zero old-threshold occurrences remain: no `(progress - 0.9)`, no `* 0.9` claim factor, no `<= 0.9` mission threshold, no `/ 0.1` mission ramp. The sole `/ 0.1` in the file is the pre-existing `dotEntrance` (0-0.1), untouched per (6).

**(9) Build (re-run by me).** PASS, vite built in 8.02s (fixer reported 7.79s). `git status` after the build is unchanged (`dist/` gitignored).

**(10) Hygiene.** Em dash in diff: 0. FAERS masked check: NOT applicable (no FAERS data file or value modified).

## Live-preview items owed (not blockers; sandbox cannot render)

- D1 line counts at 320-1440 equal to the current build (not verifiable by reading). If D1 fails, the synthesis fallback ladder applies: audit whitespace first, then step reveal, then drop bars and keep the paragraph entrance only.
- Descender clearance: if a bar touches descenders (the `p` in `impacts`/`positive`), raise `paddingBottom` from 3 to 4 (paint-only, no layout impact).
- Bar growth sequence in reading order, final state at 1.0 (graphite body, blue `CodeCureConnect:`, four bars full), touch-scroll spot check.

Out of scope for this QA (other agents own it): motion sub-window fractions and ease-out spot values, layout-devices bands, and any live render.
