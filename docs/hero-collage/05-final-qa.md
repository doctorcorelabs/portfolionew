# Final QA - Hero collage (agent 15/15, REPORT ONLY)

Scope: `src/sections/Hero.tsx` plus all 9 collage components in
`src/components/hero-collage/`. No site edits, no build. All findings
are code inspection only; no live-browser check was possible.

Method note: the poll for integration completion first looked for
filenames containing "collage" under `src/`, which missed the real
layout: the components live in a directory named `hero-collage`
while the files themselves are named `FaersCard`, `DockingCard`,
and so on. Integration was detected instead via the Hero imports
(39 "collage" hits in `Hero.tsx`) plus the landing of
`docs/hero-collage/01` to `04`.

## Verdict: FAIL (not sign-off ready)

Every check inside this final QA's own scope passes, but two sibling
QAs returned FAIL verdicts with blocking gaps that are still open
and unaddressed in the tree: accuracy QA (`02`, one blocking gap)
and visual QA (`04`, three blocking gaps). A clean PASS here would
misrepresent the state, so the overall verdict is FAIL until the
items in the missing list are fixed. The FAILs are small and
specified, not structural.

## Per-file PASS/FAIL

| File | Verdict | Notes |
|---|---|---|
| `src/sections/Hero.tsx` | FAIL (carried) | Passes every final-QA grep, the import contract, and the reduced-motion checks below. FAIL is carried from visual QA and lives in this file's collage config: gutaxis/photo overlap (04-G1), mobile stack of 3 cards vs spec 2 (04-G2), helix word-band intrusion (04-G3). The header comment claiming the mobile stack shows only FaersCard and PhotoCard is also inaccurate (DockingCard has no mobile-hide class and stacks too). |
| `src/components/hero-collage/FaersCard.tsx` | PASS | Only verified cohort figures: N = 6,601 and 7,519 reports to 6,601 analysis set, plus the "Hypothesis-generating" note. No effect values, CIs, p-values, journals, or DOIs. Non-blocking provenance note: 7,519 traces to the FAERS audit record, not to content.ts (02-G2). |
| `src/components/hero-collage/DockingCard.tsx` | PASS | Abstract schematic only: pocket outline, generic hexagon ligand, dashed interaction lines. No compound name, no molecule structure, no numbers. |
| `src/components/hero-collage/GutAxisCard.tsx` | PASS | Theme chain only (Microbiome, Gut, Immune, Blood). No results, no numbers, no effect or mechanism claims. Its card-on-card overlap is a Hero placement issue, counted under Hero.tsx, not here. |
| `src/components/hero-collage/ReviewCard.tsx` | FAIL (carried) | Topics and stages verified, funnel widths are styling only with no numerals rendered (accepted per 02-O1). FAIL is carried from accuracy QA 02-G1: the card has no honesty microcopy at all (no "Illustrative schematic" or equivalent footer line), failing the rule that every schematic card carries one. |
| `src/components/hero-collage/PosterCard.tsx` | PASS | Recorded facts only: Works title, ABST-000034, Hypertension Seoul 2026, N = 6,601. No effect values, CIs, p-values, or result percentages. |
| `src/components/hero-collage/AwardsCard.tsx` | PASS | Recorded old-site aggregates only: 29 awards, 12 international. Medal dots are decorative. |
| `src/components/hero-collage/StrokeCard.tsx` | PASS | Honesty language intact: "Education-first stroke learning lab" plus "Observation Sheet, No score, No diagnosis". No detection, diagnosis, or treatment claims. |
| `src/components/hero-collage/PhotoCard.tsx` | PASS | AI lab image presented honestly: caption "Illustrative ambience", alt text matches. Asset `/hero-lab.jpg` exists in `public/` (267,773 bytes) and is the only collage image referenced. Ship-hygiene note 04-G9 is listed below, not counted against this file. |
| `src/components/hero-collage/DnaHelix.tsx` | PASS | Pure static SVG, no animation in the component. Its word-band intrusion is a Hero placement issue (width 150, left 27 percent, top 2 percent), counted under Hero.tsx, not here. |

## Import-contract check: PASS

- All 9 component files in `src/components/hero-collage/` are
  imported by `Hero.tsx` (lines 45 to 53), and each is rendered
  exactly once in `COLLAGE_ITEMS` (docking, helix, review, poster,
  faers, gutaxis, photo, awards, stroke).
- Zero orphan components: no file in the directory is left
  unimported, and no import in `Hero.tsx` points at a missing file.
- No other file in `src/` imports from `hero-collage` (the single
  grep hit outside `Hero.tsx` is a comment inside `AwardsCard`
  itself).
- All imports resolve: `npx tsc --noEmit` reports 0 errors for the
  full tree, including `Hero.tsx` and all 9 components.

## Grep totals (10 files)

- Em dash: 0. En dash: 0.
- Forbidden patterns (marquee, scroll-lock, cursor none,
  scroll-snap, overscroll): 0.
- Smooth-scroll code: 0.
- Invented person names: 0. Copied reference copy: 0 (no reference
  labels, slogans, or client names appear in any collage file).
- FAERS: 2 distinct unverified row values were checked against
  all 10 files (values taken only from rows with an explicit
  non-verified status in `docs/faers-verified.json`). Result: 8
  standalone matches, all inside pre-existing `Hero.tsx` code
  (fade-timing comments, cursor-chip config fractions, parallax
  arithmetic), 0 inside any collage component, and 0
  leak-indicating after masked-context review (contexts show
  comments, config numbers, and arithmetic only, no drug or
  outcome structure). No values are printed in this document.
- The single "animation" string inside the component directory is
  a comment in `DnaHelix.tsx` stating that no animation lives
  there. The components contain zero keyframes and zero animated
  properties.

## Reduced-motion handling: PASS (by construction, stated plainly)

- `Hero.tsx` carries the handling: three `prefers-reduced-motion`
  CSS blocks (general, diorama, collage-specific, which kills both
  the collage entrance fade and the float), plus JavaScript gates
  that skip the cursor rAF loop, the drag setup, and the collage
  parallax effect entirely under reduced motion.
- No collage component file contains its own
  `prefers-reduced-motion` rule, because no component animates:
  all motion (float, collage entrance, pointer parallax, grid pan,
  cursor drift) lives in `Hero.tsx` and is gated there. The
  criterion is therefore satisfied by construction, not by a rule
  repeated in each file. Float wrappers and parallax transforms
  live on separate elements (item wrapper vs layer), so they never
  fight, and the collage layer is `aria-hidden` and pointer-dead,
  so drag still works.
- Touch: parallax requires hover plus fine pointer and never runs
  on touch; the collage layer never intercepts pointer events.

## Missing list (not empty)

Blocking, in fix order:

1. ReviewCard honesty microcopy (02-G1, accuracy): add one 10px
   mono footer line, either "Illustrative schematic" or "Method
   diagram, not data". Do not add both.
2. Gutaxis/photo overlap below about 1700px stage width (04-G1,
   visual): set an explicit width of 230 on the gutaxis item and
   add `mv-collage-hide-mid` to its hide class.
3. Mobile stack shows 3 cards, spec says 2 (04-G2, visual): add
   `mv-collage-mobile-hide` to the docking item. This also fixes
   the inaccurate Hero header comment and restores the intended
   faers-then-photo stack order.
4. Helix word-band intrusion at desktop heights (04-G3, visual):
   shrink the helix item to about width 100, or hide it on short
   stages with a max-height media query. The word paints above
   it, so this is visual noise, not illegibility.

Non-blocking:

5. Short-stage crowding (04-G4): bottom cards intrude into word
   text on short stages; consider a max-height rule that shrinks
   or hides bottom cards.
6. Pill clearance below the 40px rule at 700 height (04-G5):
   near-miss only; accept it or shift poster up / faers down.
7. Awards/stroke overlap of about 12px for stage widths 1101 to
   1155 (04-G6): nudge awards to right 26 percent or cap stroke
   width.
8. Mobile deviations (04-G8): stacked cards still float, stack
   gap is 12px vs spec 16px, faers at 240px exceeds the content
   box below 288px viewports (contained by section overflow, no
   viewport overflow).
9. Ship hygiene (04-G9): the untracked raw generated image plus
   its generation JSON sit in `public/` and would deploy,
   although only `/hero-lab.jpg` is referenced. Remove them
   before ship.
10. Provenance (02-G2): add a total-reports figure to the
    content.ts faers block so every homepage number traces to
    content.ts; until then 7,519 traces to the FAERS audit record.
11. Live-browser visual check of entrances, loops, parallax, and
    slide feel is still owed; every verdict here is code
    inspection only.

## Cross-reference

- System spec: `docs/hero-collage/01-collage-system.md`.
- Accuracy QA: `docs/hero-collage/02-accuracy-qa.md` (FAIL, narrow).
- Motion/a11y QA: `docs/hero-collage/03-motion-a11y-qa.md` (PASS
  with a non-blocking gap list; its findings agree with the
  reduced-motion section above).
- Visual QA: `docs/hero-collage/04-visual-qa.md` (FAIL, not
  sign-off ready; blocking gaps G1, G2, G3 are carried above).
