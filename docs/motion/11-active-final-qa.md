# Final QA v6 - active animation and section slides

Scope: every file edited this round (Hero, Quote, Services, Manifesto,
Profile, Works, Affiliations, Contact, Header, Footer, App,
section-slide.css). Method: code inspection plus targeted greps only.
No live browser check was possible for this agent, so entrances, loop
timing, and slide feel are code-verified, not visually verified.
Polling basis: no target file changed between two consecutive checks
(last edit 07:33 UTC, re-checked 07:37 UTC), so this covers the finished
v6 state.

## Verdict: 11 PASS, 1 PASS with noted exception, 0 FAIL

## Per-file table

| File | Verdict | Notes |
|---|---|---|
| src/sections/Hero.tsx | PASS | No sec-slide wrapper, exempt per docs/motion/08-active-motion.md (top of page). Reduced-motion handling present (8 mentions). The `cursor` rule is grab/grabbing/move on the draggable frame only, a drag affordance, not a custom cursor and never cursor none. |
| src/sections/Quote.tsx | PASS | No sec-slide wrapper, exempt per 08 doc (pinned section). Reduced-motion handling present (5 mentions). Word-paint and dot breathe are opacity/transform only. |
| src/sections/Services.tsx | PASS | Slide wrapper `sec-slide from-left`, `in` wired to `visible` state driven by IntersectionObserver with a true fallback when the API is absent. Reduced-motion handling present (3 mentions). |
| src/sections/Manifesto.tsx | PASS | Slide wrapper `sec-slide from-right`, `in` wired to `inView` state driven by IntersectionObserver. Reduced-motion handling present (3 mentions). Zero FAERS numeric matches in this file. |
| src/sections/Profile.tsx | PASS | Slide wrapper `sec-slide from-left`, `in` wired to `inView` state driven by IntersectionObserver. Reduced-motion handling present (3 mentions). |
| src/sections/Works.tsx | PASS | Slide wrapper `sec-slide from-right`, `in` wired to `headerIn` state driven by IntersectionObserver with a true fallback. Reduced-motion handling present (2 mentions). |
| src/sections/Affiliations.tsx | PASS | Slide wrapper `sec-slide from-left`, `in` wired to `headerIn` state driven by IntersectionObserver with a true fallback. Reduced-motion handling present and substantive (forces items visible, kills animation and transform). |
| src/sections/Contact.tsx | PASS | Slide wrapper `sec-slide from-right`, `in` wired to `inView` state driven by IntersectionObserver. Reduced-motion handling present (5 mentions). |
| src/components/Header.tsx | PASS | No section slide wrapper (navigation, not a section). Reduced-motion handling present (nav underline transition removed under reduced motion). |
| src/components/Footer.tsx | PASS | No section slide wrapper (footer, not a section). Reduced-motion handling present in CSS and in JS (Back to top scrolls instantly under reduced motion). |
| src/App.tsx | PASS with exception E1 | Imports section-slide.css, so the slide contract is live. Route fade, progress hairline, and section sweep all respect reduced-motion (7 mentions). See E1 for the smooth-scroll exception. |
| src/styles/section-slide.css | PASS | Defines every used class. Reduced-motion block forces all slides fully visible with no transition. Never touches scrolling or the cursor. |

## Class-contract check: PASS

- Used classes across section files: `sec-slide`, `from-left`,
  `from-right`, `in`. All four are defined in section-slide.css.
- Every slide wrapper (6 total, in Services, Manifesto, Profile,
  Works, Affiliations, Contact) wires its `in` class to a real
  IntersectionObserver state variable, each with a fallback that sets
  the state true when the API is absent, so content is never stuck
  hidden.
- `from-bottom` is defined in section-slide.css but used by no file.
  Harmless unused definition, not a contract break.
- Hero and Quote carry no slide wrapper by design (08 doc exemptions),
  not by omission.

## Grep results over the 12 edited files

- Em dash: 0.
- Unverified FAERS effect values: 0 real leaks. 10 unverified numeric
  values from the verification record were matched against the edited
  files: 17 hits, every one a style literal with masked context
  (rgba alpha, pixel sizes, opacity, animation durations and delays,
  gradient mask stops, anchor fractions). No drug, outcome, or
  interval structure surrounds any hit. The values themselves are not
  printed in this document.
- Invented person names: 0. Added lines in the v6 diff contain no
  person names at all; the only personal name in these files is the
  user's own, pre-existing.
- Copied reference copy: 0. The only reference mentions are internal
  identifiers and code comments naming the reference (class names,
  section notes, "translated for" notes). No reference marketing copy,
  no Spanish copy, no client names.
- Scroll-lock: 0. No wheel handlers, no scroll snapping, no
  overscroll rules, no body overflow locking.
- Custom cursor: 0. No cursor none anywhere; the single `cursor` rule
  is the hero drag affordance described above.
- Marquee: 0.
- Smooth-scroll code: 2 sites, both in App.tsx, both pre-existing v5
  code (absent from the v6 diff) and both reduced-motion gated. See E1.

## Missing list (not empty)

- E1 (exception, needs a parent decision): App.tsx still contains
  smooth-scroll code from v5: the #contact landing uses smooth
  behavior except under reduced motion (where it uses auto), and an
  `html { scroll-behavior: smooth; }` rule sits inside a
  `prefers-reduced-motion: no-preference` media block. No NEW
  smooth-scroll code was added this round, and reduced-motion users
  never receive smooth scrolling, so the accessibility intent holds.
  But the letter of the "smooth-scroll code 0" criterion is not met.
  Parent options: accept the gated v5 behavior, or remove both sites
  in a follow-up (the #contact landing would then be instant for
  everyone, and the route fade still covers the transition feel).
- E2 (trivial, no action needed): `from-bottom` is defined but unused
  in section-slide.css. Leave it for future sections or delete it in
  a cleanup pass.
- E3 (live-browser check still owed): slide entrances, loop timing,
  and the section-to-section slide feel could not be verified without
  a live browser. Code inspection confirms the wiring and the
  reduced-motion fallbacks, not the visual result.
- E4 (by design, confirm intent): Hero and Quote are exempt from the
  slide system per 08 doc. If the parent wants literally every section
  on a slide wrapper, those two need a follow-up that respects the
  pinning (Quote) and top-of-page (Hero) reasons for exemption.
