# 05 - Final QA, v5 journey round (REPORT ONLY, no site edits, no build)

Scope: every file edited this round, at the finished v5 state.
Polling ended when no source file had changed since 07:15 UTC and
the sibling QA docs (03 accuracy, 04 motion and accessibility) had
landed at 07:20 UTC. Files below are the full edited set from
`git status` against v4 commit 510b238, plus the new portrait
asset. No build was run, per the task instruction; the parent
build remains the gate for type errors. No live browser check was
possible from this agent; all findings are code verified only.

## Verdict: 9 PASS, 1 FAIL, 1 asset PASS

The single FAIL is Services, for two blocking defects that are not
grep failures: card titles render in the wrong color, and card
pills have no guaranteed touch path (see G1 and G2 below). Every
enumerated grep check passes in every file, including Services.
The missing list at the end is therefore NOT empty.

## 1. Checks applied to every file

- Em dash count: must be 0.
- Unverified FAERS effect values: must be 0. Values are never
  printed in this doc. The check loads the unverified rows from
  `docs/faers-verified.json` and matches their numeric values
  against each file with word boundaries, then reviews each
  match context. Matches found inside CSS literals (opacity,
  gradient stops, pixel sizes) are short decimal coincidences,
  not leaks: no match sits inside a data row with a drug,
  outcome, or confidence interval structure.
- Invented person names: must be 0. Method: all added lines were
  scanned for person patterns (titles, roles, bylines) and for
  proper name bigrams. The only personal name appearing is the
  user's own name in the Profile caption. All other capitalized
  names are recorded institutions, events, awards, or places.
- Copied reference copy or client names: must be 0. Method:
  blocklist grep over each edited file. Counts only are reported
  here; blocklist strings are not reproduced in this doc.
- Scroll lock, custom cursor, marquee code: must be 0. Patterns
  checked include scroll lock variants, custom cursor variants,
  marquee, Lenis, and smooth scroll libraries. Native CSS smooth
  scrolling and native `scrollTo` with a smooth behavior are
  allowed and are not counted. Sticky pinning in Quote is not
  scroll lock: the page scrollbar remains the only scrollbar.
- Prefers-reduced-motion handling: must be present in each edited
  file. The pre-existing dead `mv-marquee` keyframe in
  `src/styles/motion.css` was not edited this round, contains no
  use, and is not counted here.

## 2. Per-file results

| File | What changed this round | Em dash | FAERS unverified | Invented names | Reference copy | Bans | Reduced motion | Verdict |
|---|---|---|---|---|---|---|---|---|
| `src/sections/Manifesto.tsx` | Method explainer replaced by the Journey route: 5 year stations (2021, 2023, 2024, 2025, 2026) on a dashed line, alternating above and below on desktop, vertical line on mobile, award dots with count labels, undated items in a closing note, explicit light colors throughout, drift blob kept behind content | 0 | 0 (only the allowed N = 6,601 appears, with the hypothesis generating disclaimer) | 0 | 0 | 0 | Present, full static fallback | PASS |
| `src/sections/Profile.tsx` | Portrait card in a hero style selection frame with 4 corner handles and 3 floating fact chips (recorded facts only), explicit heading colors | 0 | 0 | 0 (caption names only the user) | 0 | 0 | Present, chips hidden | PASS |
| `src/sections/Works.tsx` | Giant outlined index numerals per row, vertical dashed route line drawing on reveal, per row type tag with an abstract shape glyph | 0 | 0 | 0 | 0 | 0 | Present, numerals solid and route drawn | PASS |
| `src/sections/Affiliations.tsx` | Affiliations as dashed frame stamp badges with corner ticks, pop entrance, border solidifies on hover and focus | 0 | 0 | 0 | 0 | 0 | Present, badges visible with no animation | PASS |
| `src/sections/Services.tsx` | Corner ticks on cards, explicit white section heading color | 0 | 0 real (1 short decimal coincidence inside the halftone opacity literal, no data context) | 0 | 0 | 0 | Present | FAIL (G1, G2) |
| `src/sections/Quote.tsx` | Second scrollbar fix: sticky child changed to min-height with visible overflow, dot field entrance fade over the first 10 percent of scroll progress | 0 | 0 real (2 short decimal coincidences inside gradient stop literals, no data context) | 0 | 0 | 0 | Present, static branch | PASS |
| `src/sections/Contact.tsx` | Anonymous cursor chip (arrow only, no label pill, so it cannot imply a person), below the content layer, static after entrance | 0 | 0 real (2 short decimal coincidences inside gradient stop literals, no data context) | 0 | 0 | 0 | Present, chip hidden | PASS |
| `src/App.tsx` | Reading progress hairline (fixed 2px bar, scaleX written per scroll frame, pointer events none), route fade plus 8px rise, `id="top"` anchor for back to top | 0 | 0 | 0 | 0 | 0 | Present, bar hidden and fade gated to no-preference | PASS |
| `src/components/Header.tsx` | Dotted underline draw on nav links (300ms, hover and focus visible), wordmark and fixed CTA untouched | 0 | 0 | 0 | 0 | 0 | Present, transition removed | PASS |
| `src/components/Footer.tsx` | Dotted title rule, Back to top link (instant scroll under reduced motion, smooth otherwise) | 0 | 0 | 0 | 0 | 0 | Present | PASS |
| `public/profile.webp` | New portrait asset referenced by Profile.tsx as `/profile.webp` | N/A | N/A | N/A (user's own photo per the Profile comment) | N/A | N/A | N/A | PASS |

## 3. Journey content check (Manifesto, summary of sibling doc 03)

Sibling doc 03 verified every station claim against CV.md and
`src/data/content.ts`: 0 false claims. Station facts check out:
2021 medicine start and GPA plus the Blora dialogue; 2023
scholarship, SMART, BAPIN-ISMKI, Seni.Bicara, and MC roles with
4 award items; 2024 with 20 certifications, 4 publications, and
3 first-author presentations; 2025 with the two Most Outstanding
results, DaivanLabs founded June 2025, Chulalongkorn summer
school, the Amomum publication, and 11 award items; 2026 with
the clerkship start, the Seoul poster with only N = 6,601, the
StrokeSense honesty note, and the cerclage Table 1 note with no
result numbers. The closing note correctly carries all 5 items
with no recorded year (Field Staff FK UII Periode LIX, SMAN 1
Blora 3rd Most Outstanding, PCOS Head of Research, two
Bisphenol A grants, Kapulaga and tuberculosis collaborations)
without assigning them a year. No stale "fourth year
undergraduate" line, no phone number, no home area, no journal
name, no DOI, no credential ID, no grade, no expiry date.

## 4. Missing list (NOT empty)

- G1 (blocking, Services): the three card h3 titles still lack
  an explicit light color. Their inline style sets line height,
  letter spacing, weight, margin, and animation delay only, and
  neither `.svc-title` nor `.svc-card-title` sets a color, so
  the global h1-h6 rule renders them dark #1D1D1F on the blue
  #0859D4 cards, next to white body text. Fix: add
  `color: "#FFFFFF"` to the h3 inline style (or to
  `.svc-card-title`). This is the same trap the round fixed for
  the Manifesto title and the Services section heading, missed
  for the card titles.
- G2 (blocking for touch, Services): the card pill links
  ("View") are the only path from a card to its destination
  page, and they stay invisible until card hover or
  focus-within. Touch devices have no hover, and the hidden link
  cannot receive focus first, so reaching it depends on
  tap-to-hover emulation, which is not a guaranteed path. Fix
  options: show the pills under `@media (hover: none)`
  (opacity 1, visibility visible), or make the whole card a
  link. The first option is the smaller change.
- G3 (coverage gap, Manifesto): the Gold Medal at ISIF 2024 is
  recorded in CV.md and content.ts but appears in neither the
  spine nor the journey. The 2024 station dot list covers only
  the 3 presentations. Suggested fix from sibling doc 03: add
  it as a fourth 2024 dot and reword the count label, since it
  is not a presentation.
- G4 (parent decision, Manifesto): content.ts assigns year 2024
  to the 5 undated items, while CV.md records no year for them.
  The section follows CV.md and keeps them undated, which is
  the conservative choice and invents nothing. The parent
  should decide explicitly whether the old site 2024 grouping
  should instead be honored; if so, those items move to the
  2024 station and the footnote shrinks. Same pattern, smaller:
  the SMAN 1 Blora item carries year 2021 in content.ts only as
  a graduation period caveat, and the section correctly keeps
  it undated.
- G5 (live browser check still owed): no visual check in a real
  browser was possible from this agent. Worth one pass at
  desktop, 1023px, and mobile widths for: the Journey route
  grid at narrow desktop widths, the Services card title color
  after the G1 fix, the Quote pinned content on a very short
  viewport (landscape phone), and the Manifesto award dot
  tooltips, which are hover-only supplementary detail (the
  count labels carry the essential information, so nothing
  essential is trapped).

## 5. Non-blocking deviations and observations

- Manifesto motion tokens differ from `docs/motion/07`:
  node pop 450ms (spec: 350ms for a 10px dot; the built dot is
  16px), stagger 150ms per station (spec: 80ms steps capped at
  3 per batch), route line draw 1400ms (spec: 800ms). Content
  and reduced-motion behavior are correct; only the token
  values differ.
- Manifesto dot encoding differs from `docs/journey/02`:
  all dots are uniform blue with count labels, instead of the
  fill, ring, grey, and square encoding with a legend, and the
  2025 dot list counts 11 items including the two Most
  Outstanding results, while the design doc cluster counts 9
  marks plus a travel square. The built list and its count
  label agree with each other (11 items listed, label says
  11), so this is a design deviation, not an accuracy error.
- Affiliations stamp pop uses 500ms with the overshoot curve,
  while `docs/motion/07` section 3.4 requires 350ms ease-out
  with no overshoot for stamps (overshoot is reserved for
  10px dots). Visual behavior is fine; the token differs.
- App route fade runs 400ms, while `docs/motion/07` section
  3.8 calls 300ms authoritative. Contact cursor chip entrance
  runs 600ms with a 10px rise, while the spec calls 400ms with
  a 14px rise. Both are token deviations only.
- App and global CSS: `src/styles/global.css` sets
  `html { scroll-behavior: smooth; }` unconditionally, so the
  App route effect's reduced-motion instant behavior for the
  contact landing can still be smoothed by the stylesheet.
  Content visibility is unaffected. Fix: add a reduced-motion
  rule setting `html { scroll-behavior: auto; }` in
  global.css.
- Header: primary nav is display none below 720px. This
  predates v5 and is not a v5 regression, but mobile visitors
  currently navigate only via page content and the fixed CTA.
- No new Journey component file exists beyond the Manifesto
  replacement: Hero.tsx was not edited this round, and the
  journey narrative lives in Manifesto plus
  `docs/journey/01-spine.md` and `02-design.md`.

## 6. Asset confirmation

`public/profile.webp` exists, is a valid WebP image (VP8), is
675 by 900 pixels, and is 146,750 bytes (about 143 KB). That is
a sane size for a portrait shown at 300px wide in the Profile
card. Profile.tsx references it as `/profile.webp` with an alt
text naming the user as founder of DaivanLabs.
