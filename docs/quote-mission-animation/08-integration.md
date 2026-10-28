# Mission paragraph animation: integration

Base HEAD `edb7bd6` + uncommitted `Quote.tsx` fix. Synthesis
(`00-synthesis.md`), fixer note (`04-fix.md`), and all three QA docs
(05-motion SHIP, 06-layout-devices CONDITIONAL SHIP disclosure-only,
07-regression CONDITIONAL SHIP disclosure-only) read first. No QA
blocker existed and none was introduced.

## What was integrated

Fixer (04): `Quote.tsx` only, 37 insertions / 11 deletions, 4 hunks,
synthesis implemented exactly, no deviation: header comment 0.9
bullets become 0.8; claim threshold `* 0.9` becomes `* 0.8`; mission
opacity `progress <= 0.9 ? 0 : (progress - 0.9) / 0.1` becomes
`progress <= 0.8 ? 0 : clamp01((progress - 0.8) / 0.05)` with the
`reducedMotion ? 1` ternary and `translateY((1 - opacity) * 14)` /
`none` pattern untouched; mission `<p>` split into nine segments
with four bar spans (starts 0.80/0.85/0.90/0.95, easeOutCubic growth,
`paddingBottom: 3`, plain inline, no `display` property); two derived
helpers only (`barGrowth`, `barStyle`); no new state, listeners,
timers, rect reads, classes, keyframes, transitions, or `will-change`.

QA verdicts: motion SHIP (fractions 0.80/0.85/0.90/0.95/1.00, budgets
423/105.8 desktop and 253/63.3 narrow, ease-out `t = 0.5` gives
0.875, reversibility, final state at 1.0, no transition in the
mission path, reduced-motion guards); layout-devices CONDITIONAL
SHIP (D1-D12 code conditions PASS, disclosures are live-preview
items only: D1 line-count render equality and descender clearance);
regression CONDITIONAL SHIP (wording byte-identical, WORDS untouched,
claim change ONLY the factor, untouched areas byte-identical, build
PASS, disclosure is one NEW comment block for the bar helpers,
additive documentation, no behavior change).

## Integration verification (measured by me, not copied)

- `git status`: only `M src/sections/Quote.tsx` plus untracked
  `docs/quote-mission-animation/`. No other file.
- `git diff --stat`: 1 file, 37 insertions, 11 deletions (matches
  fixer and QA-regression).
- Build re-run by me: PASS, vite built in 7.10s (tsc + vite).
  `git status` unchanged after the build (`dist/` gitignored).
- Em dash in diff: 0.
- Wording concatenation re-verified by me in node: nine segments
  join to the base sentence exactly, 234 characters both, spaces
  outside spans, `impacts.I` join exact.
- WORDS array untouched: no `WORDS[` hunk in the diff; claim change
  is ONLY the `* 0.9` to `* 0.8` factor (`Quote.tsx:163`).
- `0.9` check, interpreted honestly: `grep "0.9"` returns exactly
  three lines, each a specified new constant (comment bar windows
  `:24`; `barStyle(0.9)` `:228`; `barStyle(0.95, true)` `:230`).
  Zero old-threshold occurrences remain: no `(progress - 0.9)`, no
  `* 0.9` claim factor, no `<= 0.9` mission threshold, no `/ 0.1`
  mission ramp. The sole `/ 0.1` in the file is the pre-existing
  `dotEntrance` (`:128`), untouched.
- FAERS masked check: NOT applicable (no FAERS data file or value
  modified).

## Commit and push

- Commit hash: recorded in the integration report (a doc cannot
  contain its own commit's hash). Message: "Animate Quote mission:
  sequential blue underline bars".
- Push: `edb7bd6..` new HEAD on `main`, repo
  `doctorcorelabs/portfolionew`, via ssh.github.com:443 (working
  proxy pattern).
- Verification: local HEAD == remote HEAD (checked with `git
  rev-parse HEAD` and `git ls-remote` after the push); working tree
  clean after the commit.

## Disclosures for the final report (do not drop)

(a) Treatment B: four 3px `#0859D4` underline bars growing in
reading order under "enhance health standards in Indonesia",
"sustainable change", "lasting positive impacts", and
"CodeCureConnect:", via background-size growth on plain inline
spans (transforms do not apply to plain inline boxes, so
background-size is the paint-only implementation; on wrap the
background fragments per line box automatically). Text color never
changes, so the mission stays fully readable at every scroll
position. What A lost: clause paint repeats the claim's mechanism
and has the weakest mobile readability. What C lost: chip flow
decorates around the paragraph, covers only the coined term, and
carries the biggest minimalism cost.

(b) Window change 0.9 to 0.8: claim per-word step 6% to 5.33% (last
claim word lands at 0.8), mission window 423px desktop / 253px
narrow, per-bar sub-window 105.8px / 63.3px (true runway 2115/1265,
correcting the design doc's 1875/1125-based budgets).

(c) Envelope: paragraph ramp 0.80-0.85 (opacity 0 to 1 linear, 14px
rise to 0) sharing its window with bar 1 by design, NOT
double-ghosting (exactly one opacity in the mission; bars are
background-size, not fades); no transition in the mission path
(paragraph opacity and bar growth are continuous progress
mappings); easeOutCubic (`t = 0.5` gives 0.875, monotonic, flings
land final); scrolling back up reverses everything; at 1.0 the
mission is 100% final (graphite body, blue `CodeCureConnect:`,
four bars full, zero rise offset).

(d) Reduced motion: guards on every derived value, NO backgrounds
under reducedMotion, static branch fully visible with no bars, no
wrapper, no pinning, no scroll listener, live preference toggles
re-render correctly (critical trap avoided: under reduced motion
progress stays 0, so unguarded thresholds would have rendered the
mission wrong).

(e) Wording byte-identical (234 characters, spaces outside spans,
`impacts.I` join exact), WORDS array untouched, claim change ONLY
the 0.9-to-0.8 factor, runway/padding/rule/dots/kicker/dot-entrance/
cursor-plumbing untouched, no new state/listeners/timers/classes/
keyframes/transitions/display/will-change (two derived helpers
only).

(f) Live-preview checks owed (sandbox cannot render): D1 line
counts at 320-1440 equal to the current build (code-side conditions
all pass; if D1 fails, the fallback ladder applies: audit
whitespace first, then step reveal, then drop bars and keep the
paragraph entrance only); descender clearance (bars below the `p`
in `impacts`/`positive`; prescribed adjustment `paddingBottom` 3
to 4 if touched, paint-only, no layout impact); bar growth sequence
in reading order; final state at 1.0; phone portrait final state;
touch-scroll spot check.

(g) Two honest footnotes: the floating-point edge at exactly 0.85
(`(0.85 - 0.8) / 0.05` computes a hair under 1, rise ~2e-14px,
renders as final, no visible effect); and the 0.9-substring check
reinterpretation (a literal "grep 0.9 returns nothing" is
unsatisfiable alongside the specified 0.90/0.95 constants - the
honest check is that every remaining match is a specified new
constant and zero old thresholds remain); plus the regression
disclosure that one NEW comment block for the bar helpers was added
(additive documentation of new code, no behavior change, no
pre-existing comment altered besides the two 0.9 bullets).
