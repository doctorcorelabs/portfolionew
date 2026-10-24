# Motion QA - v2 portfolio (report only, no site edits)

Scope: motion work landing in parallel from the other motion agents.
Method: filesystem polling (3 polls; sections and footer landed on poll 2,
pages and plot components on poll 3), then static greps over `src/`.
No build was run (parent builds). No live-browser check was possible
from this subagent, so timing, easing feel, and on-screen behaviour
against the Onlines reference are NOT verified here - only that motion
code is present, wired, and free of the forbidden patterns below.

## Verdict: PASS - all 21 files carry motion, no missing files

## Per-file table

| File | Motion evidence (grep counts) | Verdict |
|---|---|---|
| src/sections/Hero.tsx | IntersectionObserver x3, animation x1, transition x7; reduced-motion guard via matchMedia + media query | PASS |
| src/sections/Quote.tsx | @keyframes x4, IntersectionObserver x2, animation x7 | PASS |
| src/sections/Services.tsx | @keyframes x2, IntersectionObserver x2, animation x11, transition x1 | PASS |
| src/sections/Manifesto.tsx | IntersectionObserver x3, transition x4 | PASS |
| src/sections/Profile.tsx | IntersectionObserver x3, transition x8 | PASS |
| src/sections/Works.tsx | @keyframes x1, IntersectionObserver x2, animation x3, transition x4 | PASS |
| src/sections/Affiliations.tsx | @keyframes x1, IntersectionObserver x2, animation x3, transition x2; reduced-motion media query | PASS |
| src/sections/Contact.tsx | IntersectionObserver x2, transition x12 | PASS |
| src/components/Footer.tsx | IntersectionObserver x2, transition x7; reduced-motion media query | PASS |
| src/pages/ResearchIndex.tsx | IntersectionObserver x3, mv-reveal x2, transition x1 | PASS |
| src/pages/ResearchDetail.tsx | IntersectionObserver x3, mv-reveal x2, transition x1 | PASS |
| src/pages/AwardsPage.tsx | IntersectionObserver x2, transition x5 | PASS |
| src/pages/ExperiencePage.tsx | IntersectionObserver x2, transition x6 | PASS |
| src/pages/EducationPage.tsx | IntersectionObserver x2, transition x7 | PASS |
| src/pages/CertificationsPage.tsx | IntersectionObserver x2, transition x5 | PASS |
| src/pages/NotFound.tsx | IntersectionObserver x2, transition x6 | PASS |
| src/components/FaersPlotSection.tsx | animation x2, mv-reveal x1 | PASS |
| src/components/ForestPlot.tsx | @keyframes x3, animation x7, transition x1; reduced-motion media query (renders fully and statically) | PASS |
| src/App.tsx | @keyframes x1, animation x4; reduced-motion matchMedia + no-preference media query | PASS |
| src/styles/motion.css | @keyframes x6, animation x5, mv-reveal x7, transition x6; .mv-reveal/.is-visible reveal system with delay classes; reduced-motion media query at line 99 forcing static | PASS |
| src/hooks/useReveal.ts | IntersectionObserver x4, mv-reveal x2 | PASS |

Shared pattern confirmed: `useReveal` flips `.is-visible` on `.mv-reveal`
elements (defined in `src/styles/motion.css`), with delay classes
`.mv-reveal-delay-1/2/3`.

## Forbidden-pattern greps (all over `src/`)

| Check | Required | Found | Verdict |
|---|---|---|---|
| Em dash | 0 | 0 | PASS |
| Unverified FAERS ROR values | 0 occurrences | 0 | PASS |
| Scroll-lock code | 0 | 0 implementations (see note) | PASS |
| Custom cursor code | 0 | 0 implementations (see note) | PASS |
| prefers-reduced-motion handling | present | present in motion.css (line 99), ForestPlot, Footer, App, Hero, Affiliations | PASS |
| Copied Onlines client names or copy | 0 | 0 | PASS |

Note on scroll-lock / custom cursor: the only grep hits are comments
that state the prohibition itself ("No scroll lock, no custom cursor")
in `src/styles/tokens.css`, `src/styles/global.css`, and
`src/styles/motion.css`. There is no scroll-locking or custom-cursor
implementation in `src/`.

## Gap list

None. Missing list is empty - every file on the watch list contains
motion at the final poll.

## Limitations (not gaps, for the parent)

- Static greps only: whether the motion actually feels like Onlines
  (timing, easing, scroll behaviour, hero animation) needs a
  live-browser visual check, which this subagent cannot perform.
- Build not run here by instruction; the parent build is the gate
  for type errors in the motion edits.
