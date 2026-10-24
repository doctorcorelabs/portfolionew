# v8 Accuracy QA - Hero Enrichment

Scope: every new file in src/components/hero-v8/ plus the Hero.tsx
integration (diff against v7 HEAD). Sources of truth: src/data/content.ts,
the old-site CV (old-site-source/CV.md), and docs/faers-verification.md.
Method: full file reads, image verification against the two new photos,
count-only checks for sensitive strings, and a diff review of Hero.tsx.
No site edits, no build.

## Verdict: FAIL (one blocking gap, narrow and fixable)

Every factual claim on every new card traces to a recorded source, the
database set is framed correctly as search tools, and the integration
adds no new copy and drops no v7 card. The single FAIL is DbStackCard:
its chip row cannot render as written (see G1). Nothing else blocks
shipping on accuracy grounds.

## Per-item results

| Item | Verdict | Notes |
| --- | --- | --- |
| DbChips (logo chips) | PASS | Stylized text wordmarks in site type, one tiny generic SVG glyph each (magnifier, book, grid, document). No official artwork traced, copied, or downloaded. No affiliation wording anywhere in visible copy. Provenance comment is correct: the four-name set comes from the user's own 24 Oct request, not from CV.md. |
| DbStackCard (dark card) | FAIL (G1) | Framing text itself is correct: "Where the evidence is searched" plus "Search tools for systematic reviews". Never says "indexed in", "affiliated", "partner", or any endorsement wording. But the chip row is broken as written (see G1). Dark card and workflow label are otherwise as briefed. |
| SearchWindow | PASS | Results area is skeleton bars only, never fake paper titles. No result count is written. No numbers appear in visible copy (the ROWS percentages are CSS widths, not text). Query "gut axis leukemia" is a recorded research topic (CV.md gut axis CML review, content.ts key project). "Interface mockup" footer present, plus aria-label "Search interface mockup". |
| PosterWindow | PASS | Title verbatim from content.ts shortTitle. Poster code ABST-000034 and Hypertension Seoul 2026 verified in content.ts notes and venue. The only result number is N = 6,601. Footer "Poster preview mockup" present. No effect values, CI, p-values, event counts, journal names, DOIs, or author lists. Note on digits: "2026" and "000034" are name and code digits, not results, the same reading as the v7 PosterCard PASS. |
| NotifyBubble | PASS | "Poster accepted" plus "Hypertension Seoul 2026" plus ABST-000034, all verified in content.ts. No timestamp, no invented details. The poster code is a code, not a result number. |
| MicroscopeCard | PASS | Caption "Illustrative ambience" present, alt text verified against the actual file public/hero-microscope.jpg (1920x1280): blue microscope, glass slides, petri dishes with blue medium, matching the alt exactly. No real-lab or real-work claim. |
| DeskCard | PASS | Caption "Illustrative ambience" present, alt text verified against the actual file public/hero-desk.jpg (1920x1280): top-down laptop, chart papers, notebook, coffee, matching the alt. Comment states plainly the image is not the user's real desk and the chart papers are abstract shapes, not real data. |
| Stickers | PASS | SYSTEMATIC REVIEW, IN SILICO, GUT AXIS: all recorded methods and topics (CV.md, content.ts). No numbers, no claims beyond the labels. |
| Hero.tsx integration | PASS | Diff against v7 HEAD: 78 insertions, 21 deletions. All 9 v7 imports and all 9 v7 items intact (docking, helix, review, poster, faers, gutaxis, photo, awards, stroke), including their v7 hide classes. All 8 v8 components imported and each rendered exactly once (search, posterwindow, microscope, desk, dbchips, notify, dbstack, stickers). The only removed line is the bare item render, re-wrapped in a tilt div; additions are tilt CSS, comments, and responsive hide rules. No new visible copy, no removed copy. Tilt is a visual matter, not an accuracy one. |

## Gap list

- **G1 (blocking): DbStackCard chip row renders the wrong thing.**
  DbStackCard does `import DbChip from "./DbChips"`, which binds the
  DEFAULT export: the DbChips set component that renders all four chips
  and ignores props and children. Its four `<DbChip>PubMed</DbChip>`
  style elements therefore each render the full four-chip set, and the
  name text is never rendered by that path. Net visible result: the
  four database names duplicated four times (16 chips), not one row of
  four named chips. The names themselves are still the correct four,
  so this is a rendering defect, not an invented fact, but the card
  cannot ship as written.
  Fix: change the import to the named export,
  `import { DbChip } from "./DbChips"`, and render each chip by prop:
  `<DbChip name="PubMed" />`, `<DbChip name="Elsevier" />`,
  `<DbChip name="Scopus" />`, `<DbChip name="ScienceDirect" />`.
  The standalone dbchips collage item already uses the correct path
  and renders fine, so no change is needed there.

## Observations (not gaps)

- **O1:** SearchWindow's address pill shows the real PubMed domain
  (pubmed.ncbi.nlm.nih.gov) as browser chrome. This is plain text in a
  labeled mockup, not copied artwork and not an affiliation claim; the
  "Interface mockup" footer and aria-label guard it. No action unless
  the parent wants a neutral placeholder domain instead.
- **O2:** DbStackCard's prohibition words ("indexed in", "affiliated",
  "partner") appear only inside its own code comment stating the ban,
  never in visible copy. Grep hits for those terms are comment-only.
- **O3:** The v8 collage item for the chip set (dbchips) and the chip
  row inside DbStackCard show the same four names in two places. After
  G1 is fixed this is a deliberate echo (chips as floating elements
  plus chips homed on the dark card), not a factual duplication.

## Grep checks (hero-v8 files plus Hero.tsx integration)

- Em dash: 0.
- Affiliation or endorsement wording in visible copy ("indexed in",
  "affiliated", "partner", "endorsed", "official partner"): 0.
  Comment-only hits for the ban itself: 2 lines in DbStackCard, 1 line
  in DbChips, none rendered.
- Journal names, DOIs, DOI patterns, author lists: 0.
- Invented names: 0. Every visible string was inventoried; the full
  list is the database names, the workflow labels, the recorded topic
  query, the verified poster facts, the photo captions, and the
  recorded method and topic stickers. Nothing else appears.
- CV.md phone number or home area: 0 matches (count-only check: 3
  digit sequences taken from CV.md, 0 found in hero-v8 files, 0
  standalone long digit runs in hero-v8 files).
- Reference copy or client names: 0.
- FAERS homepage rule: held. The only FAERS number anywhere in v8 is
  N = 6,601 on PosterWindow, matching content.ts sampleSize. No effect
  value, CI, p-value, or event-case count appears in any v8 file, and
  no unverified FAERS value is printed in this report.

## Method note

Alt texts were verified by viewing the actual image files, not by
trusting filenames. The Hero.tsx verdict rests on the git diff against
v7 HEAD plus the item and import inventory above. No live-browser check
was possible; this QA is code and source inspection only.
