# v8 Final QA - Hero Enrichment

Scope: `src/sections/Hero.tsx` plus every file in
`src/components/hero-v8/`. Method: file reads, import/render inventory,
`npx tsc --noEmit`, greps, and a counts-only masked FAERS check. No site
edits, no build. No live-browser check was possible from the sandbox
(localhost preview is blocked); this QA is code inspection only and is
NOT a visual geometry pass (overlap/overflow of the 17 collage items
is the visual QA's job, see the verdict below).

## Verdict: FAIL (carried) - visual sign-off outstanding

No code defect found in this QA blocks shipping, and the one blocking
gap from accuracy QA does not reproduce in the current tree (see G1
below). The FAIL is carried on coverage: the dedicated visual QA
report never landed. `docs/hero-v8/` contains only 01 (reference
mockups), 02 (visual system), 03 (accuracy QA), and 04 (motion/a11y
QA). There is no 05 visual QA document, so the overlap, overflow,
tilt-composition, and mobile-stack geometry of the 17-item collage
has no dedicated sign-off. For a batch whose user complaint was
specifically visual ("ilustrasinya ngga semenarik yang reference"),
shipping without that pass would be a gap, not a judgment call this
QA can make on code alone.

Missing list (the only items standing between this report and PASS):

1. Visual QA sign-off (docs/hero-v8/05 or equivalent): per-item
   overlap/overflow at desktop, mid, and mobile widths; tilt
   composition against the word band; 4-item mobile stack feel.
2. Live-browser confirmation on the Netlify preview (owed by every
   QA in this batch, sandbox limitation, not a code gap).

## Sibling QA reconciliation

- Accuracy QA (03): FAIL on one blocking gap, G1 (DbStackCard chip
  row rendering the wrong thing via the default DbChips import).
  NOT REPRODUCED in the tree at check time. The current
  `DbStackCard.tsx` uses exactly the prescribed fix:
  `import { DbChip } from "./DbChips"` plus
  `<DbChip name="PubMed" />`, `<DbChip name="Elsevier" />`,
  `<DbChip name="Scopus" />`, `<DbChip name="ScienceDirect" />`.
  The hero-v8 file set changed between monitor polls at 12:40 and
  12:43 UTC (combined hash f25d... to aa05...), before the accuracy
  document landed (~12:52 UTC), so the accuracy report most likely
  describes a superseded mid-edit version. Verified by direct read
  of the current file, not by trusting either report. No code fix
  is outstanding on accuracy grounds.
- Motion/a11y QA (04): PASS, no blocking gaps. Its findings were
  spot-confirmed here (reduced-motion block, parallax gating,
  pointer-dead layer, no interactive elements in hero-v8 files).
- Visual QA: NO REPORT. See the verdict. This is the carried item.

## Stability (poll twice, as briefed)

Tree snapshots identical across three checks: monitor polls at
12:55 and 12:58 UTC, plus this QA's own re-check afterwards
(combined md5 of Hero.tsx plus all hero-v8 files unchanged).
`git status` shows only the v8 work: `M src/sections/Hero.tsx`
plus untracked `docs/hero-v8/`, `src/components/hero-v8/`,
`public/hero-desk.jpg`, `public/hero-microscope.jpg`. No stray
files, no raw generation intermediates in `public/`.

## Per-file results

| File | Verdict | Notes |
| --- | --- | --- |
| `src/sections/Hero.tsx` | FAIL (carried) | All checks below pass for this file itself; the FAIL is carried from the missing visual sign-off, because this file owns the 17-item layout, positions, and hide rules. Imports 17/17, renders 17/17, reduced-motion and parallax gating present. |
| `SearchWindow.tsx` | PASS | Skeleton bars only, no fake titles, no result count, query is a recorded topic, "Interface mockup" footer present. |
| `PosterWindow.tsx` | PASS | Title verbatim, ABST-000034, Hypertension Seoul 2026, N = 6,601 only. Abstract blocks carry no values. |
| `MicroscopeCard.tsx` | PASS | Photo honestly captioned "Illustrative ambience"; references /hero-microscope.jpg, which exists (422,098 bytes). |
| `DeskCard.tsx` | PASS | Photo honestly captioned "Illustrative ambience"; references /hero-desk.jpg, which exists (488,630 bytes). |
| `DbChips.tsx` | PASS | Stylized text wordmarks in site type with tiny generic glyphs; no official logo artwork traced, copied, or downloaded; no affiliation wording in visible copy. Named export DbChip and default export DbChips both present. |
| `NotifyBubble.tsx` | PASS | "Poster accepted" plus Hypertension Seoul 2026 plus ABST-000034, all verified facts; no timestamp, no invented details. |
| `DbStackCard.tsx` | PASS | Accuracy G1 verified fixed in-tree (named DbChip import, one chip per name by prop). Framing is search-tools only, never indexing or endorsement wording. |
| `Stickers.tsx` | PASS | SYSTEMATIC REVIEW, IN SILICO, GUT AXIS: recorded methods and topics only, no numbers, no claims. |

v7 components (`src/components/hero-collage/`, all 9): PASS, still
imported and rendered (docking, helix, review, poster, faers,
gutaxis, photo, awards, stroke), including their v7 hide classes.
No v7 card was dropped or reworded by the v8 integration.

## Import contract: PASS

- All 8 hero-v8 files are imported by Hero.tsx (lines 54-61) and
  each is rendered exactly once via the single COLLAGE_ITEMS map
  (line 923: float wrapper, then tilt div, then `<item.Card />`).
  Every import is a default import and every file has a matching
  default export. Zero orphans, every import resolves.
- All 9 hero-collage files are imported (lines 45-53) and rendered
  in the same map. Zero v7 orphans, zero v7 drops.
- `npx tsc --noEmit`: clean, 0 errors for the whole tree.

## Grep checks (Hero.tsx plus all hero-v8 files)

- Em dash: 0.
- En dash in visible copy: 0 (no en dash character anywhere in the
  checked files).
- Forbidden patterns (marquee, scroll-lock, cursor none, scroll-snap,
  overscroll): 0.
- Invented names: 0. Visible strings inventoried: the four
  user-requested database names, workflow labels ("Where the
  evidence is searched", "Search tools for systematic reviews"),
  the recorded topic query, verified poster facts, photo captions,
  and recorded method/topic stickers. No person names, journal
  names, DOIs, or author lists.
- Reference copy: 0 in visible copy. "Onlines" appears only in 2
  pre-existing Hero.tsx header comments attributing style, not in
  rendered text; no Spanish copy, no reference client names.
- Affiliation/endorsement wording in visible copy ("indexed in",
  "affiliated", "partner", "endorsed"): 0 (accuracy QA confirms
  the ban words appear only inside DbStackCard/DbChips code
  comments stating the prohibition).

## FAERS check (counts only, masked contexts, values never printed)

Method: loaded `docs/faers-verified.json`, took rows with status
!= "verified", checked their ror/ciLow/ciHigh as standalone numbers
in the new/changed source files (Hero.tsx plus all hero-v8 files).

- Unverified numeric tokens checked: 2 (both rows carry null CIs,
  so only their ROR tokens apply).
- Standalone matches in new/changed sources: 8, all in Hero.tsx
  pre-existing code, 0 in any hero-v8 file. Masked contexts show
  only style/code literals: fade delays, chip anchor arithmetic,
  parallax math, and transition durations. No drug/outcome/CI
  structure, not a leak. Same verdict pattern as v7.
- Homepage rule held: the only FAERS number in v8 is N = 6,601 on
  PosterWindow, matching content.ts sampleSize. No effect value,
  CI, p-value, or event-case count in any v8 file.

## Reduced-motion: PASS

- Hero.tsx CSS reduced-motion block sets `animation: none` on both
  `.mv-collage` (entrance) and `.mv-collage-float` (every float
  wrapper, old and new, since all 17 items share the class).
- The parallax effect returns early under
  `prefers-reduced-motion: reduce` (JS gate) and only attaches on
  hover plus fine-pointer devices, with rAF throttle and
  mouseleave reset. Tilt is static rotation, so it needs no
  motion handling. No hero-v8 file animates on its own.
- Mobile block zeroes tilt (`transform: none`) and disables float
  animation, so the mobile stack is upright and static.

## Notes for the parent

- Do not re-raise accuracy G1: it is fixed in the current tree.
  If the accuracy agent re-checks, it should read DbStackCard.tsx
  fresh rather than reusing its earlier read.
- The visual QA agent may still be running; if its report lands
  after this one, its verdict supersedes the carried FAIL here
  provided it clears the geometry, otherwise its gap list becomes
  the new missing list.
- The two new photos are untracked additions (hero-desk.jpg,
  hero-microscope.jpg); they must be committed with the v8 batch
  or the DeskCard and MicroscopeCard images will 404.
