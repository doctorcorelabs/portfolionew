# Hero collage accuracy QA (agent 12/15, REPORT ONLY)

Scope: every factual claim on the 9 hero collage components in
`src/components/hero-collage/` plus the Hero.tsx integration layer,
checked against `~/workspace/daivanlabs-rebuild/old-site-source/CV.md`
and work-tree `src/data/content.ts`. The sibling design doc
`docs/hero-collage/01-collage-system.md` is cited only for design
intent and microcopy rules, never as a source of facts. No site files
were edited and no build was run for this report.

Method: all 9 components read in full; Hero.tsx collage config, render
block, and collage CSS read; targeted greps for numbers, journals,
DOIs, author lists, effect-value patterns, retired lines, and
cerclage/Doppler mentions. Unverified values are never printed in
this report; they are referred to only by category.

## Verdict: FAIL (narrow, one fix)

Every factual claim on every card traces to a recorded source. There
are zero invented numbers, zero journal names, zero DOIs, zero author
lists, zero result values, and zero effect values anywhere in the
collage, and no card plots FAERS effect values on the homepage. The
single FAIL is ReviewCard: it is a diagram card with no honesty
microcopy at all, which fails the brief's check that every schematic
carries its microcopy, and fails doc 01 rule 4 for the pipeline card.
The fix is one line (see G1). Nothing else blocks shipping on
accuracy grounds.

## Per-card results

| Card | Verdict | Notes |
| --- | --- | --- |
| FaersCard | PASS | N = 6,601 and 7,519 to 6,601 flow verified; hypothesis framing present; no effect values |
| PosterCard | PASS | Title, poster code, congress, N all verbatim from content.ts |
| AwardsCard | PASS | 29 awards, 12 international match content.ts siteStats exactly |
| GutAxisCard | PASS | Topic verified; theme diagram only; microcopy present |
| ReviewCard | FAIL | Topics and stages verified, but no honesty microcopy (G1) |
| DockingCard | PASS | Abstract only, no compound, no numbers; microcopy present |
| StrokeCard | PASS | Education-first framing + honesty line match content.ts exactly |
| PhotoCard | PASS | AI lab ambience honestly labeled; claims no real lab |
| DnaHelix | PASS (exempt) | Pure decoration, aria-hidden, no text, no claims |
| Hero.tsx integration | PASS | No new copy introduced; layer aria-hidden and pointer-dead |

## Card-by-card verification

### FaersCard: PASS
- "N = 6,601": content.ts faers-resistant-hypertension, sampleSize
  6601. PASS.
- "7,519 reports, 6,601 analysis set": the 6,601 end matches
  content.ts; the 7,519 end does NOT appear in content.ts or
  faers-plot.json. It does appear in the project's own FAERS audit
  record, docs/faers-verification.md, which states the analysis
  total 6,601 of 7,519 reports. The figure is therefore verified in
  project records, not invented, but it has no anchor in the two
  named sources. See gap G2 for the recommended anchoring fix.
- "Hypothesis-generating": matches the content.ts honesty note
  (FAERS analysis is hypothesis-generating; reporting
  disproportionality, not clinical risk or causality). The card
  carries the short form; the full disclaimer lives on the FAERS
  detail page, which is the correct split for a homepage card.
- Absence checks: no effect values, no confidence intervals, no
  p-values, no drug-outcome pairs with numbers, no event-case
  counts, no journals, no DOIs. The only match for those terms in
  the file is a code comment stating the ban. PASS.
- Wording note: the card says "reports, analysis set", not
  "screened". That is the safer wording, since no screening process
  is recorded for the FAERS flow.

### PosterCard: PASS
- Title "Comparative safety of newer therapies in resistant
  hypertension": content.ts shortTitle, verbatim. PASS.
- "ABST-000034": content.ts notes for the FAERS item. PASS.
- "Hypertension Seoul 2026": content.ts venue (Hypertension Seoul
  2026, Conrad Seoul, 5 to 7 November 2026). PASS.
- "N = 6,601": content.ts sampleSize. PASS.
- The card omits the venue (Conrad Seoul) and the dates (5 to 7
  November 2026). That is an omission, not an error: both appear
  on the Works and Research detail pages. No journal, DOI, author
  list, or effect value appears. PASS.

### AwardsCard: PASS
- "29 awards": content.ts siteStats totalAwards 29, recorded as the
  old-site aggregate. Reconciliation, stated in content.ts itself:
  awardsArchive holds 25 honor, grant, and presentation items and
  the old-site aggregate of 29 counts the 4 separately listed
  publications alongside them. PASS with that attribution
  understood.
- "12 international": content.ts siteStats international 12, and
  it matches an independent count of the INTERNATIONAL section of
  CV.md (12 items). PASS.
- Medal dots: 12 dots total (6 gold, 3 blue, 3 grey), decorative
  per the file comment. The 6 gold dots match content.ts
  goldMedals 6; the 12-dot total is consistent with the 12
  international figure. No dot carries a label, so no dot can state
  a false claim. PASS.
- Design deviation (accuracy-neutral): doc 01 C4 deliberately
  avoided totals on the award card, but the built card shows
  totals that are verified in siteStats, so this is not an
  accuracy failure. See G4.

### GutAxisCard: PASS
- Title "Gut axis and leukemia": content.ts key project "Gut Axis
  and Leukemia" and CV.md publication titles on the microbiome gut
  axis in chronic myeloid leukemia (recorded in both Indonesian
  and English as one study topic, shown once here). PASS.
- Nodes (Microbiome, Gut, Immune, Blood): theme labels only, joined
  by arrows, with no mechanism text, no effect text, and no
  numbers. The chain shape could be read as a pathway, but the
  card labels itself "Research theme" plus "Illustrative
  schematic", which is exactly the mitigation the microcopy rule
  exists for. PASS.
- Microcopy: "Research theme, Illustrative schematic" present in
  11px mono. PASS.
- Omission, not error: the card does not say "systematic review",
  although the gut-axis works are systematic reviews per CV.md.
  Nothing on the card contradicts that.

### ReviewCard: FAIL (microcopy only)
- Topics "PCOS, Bisphenol A, Gut axis": all verified. CV.md
  records Head of Research for dietary impacts in women with PCOS
  and two Bisphenol A systematic review grants, plus the gut-axis
  systematic reviews; content.ts key projects record the same
  three topics. PASS on topics.
- Stages (Identification, Screening, Synthesis): generic
  systematic-review stages, no study named, no counts rendered.
  The funnel widths in code are styling only (wide to narrow);
  no numerals are displayed on the card, so no count is invented.
  See observation O1 about future count labels.
- Microcopy: NONE. The card carries no "Illustrative schematic"
  (the brief's check) and no "Method diagram, not data" (doc 01
  rule 4 for the pipeline card). A funnel diagram without
  microcopy risks being read as data from a specific review,
  which is precisely what the microcopy rule guards against.
  FAIL on this single check; everything else on the card passes.
  Fix: add one 10px mono footer line (see G1).

### DockingCard: PASS
- Visual: abstract protein-pocket outline, generic hexagon ligand,
  dashed interaction lines. No real molecule structure, no
  compound name, no pathway, no numbers. PASS.
- Labels: "IN SILICO DRUG DISCOVERY" plus "Illustrative
  schematic" in 11px mono. PASS.
- Topic fit: CV.md records two in silico drug discovery
  collaborations (Kapulaga on breast cancer, tuberculosis). The
  card names neither, so it claims nothing about either. Generic
  in silico framing is accurate for both. PASS.
- Coverage note: because the card is generic, no card names
  Amomum cardamomum or breast cancer, although doc 01 C5
  specified an Amomum schematic. See gap G3.

### StrokeCard: PASS
- "STROKESENSE AI LAB": content.ts tool id
  strokesense-ai-lab. PASS.
- "Education-first stroke learning lab": matches the
  education-first framing required by content.ts (education tool
  language only). PASS.
- "Observation Sheet, No score, No diagnosis": matches the
  content.ts honesty notes verbatim in substance (FAST output is
  an Observation Sheet without a score and without a diagnosis;
  upload results are AI interpretation, not measurement). PASS.
- Absence checks: the card never says the tool detects, scores,
  classifies, or diagnoses stroke, and carries no symmetry or
  central-versus-Bell-palsy claim. The audited Face Lab claims
  stay out of the hero entirely, as required. PASS.
- Wording note: the card does not use the literal string
  "Education only", but "Education-first" plus "No score, No
  diagnosis" conveys the same honesty line.

### PhotoCard: PASS (brief's check)
- Image: /hero-lab.jpg, described in the component comment as an
  AI-generated lab ambience image. The caption bar reads "IN THE
  LAB" plus "Illustrative ambience", and the alt text reads
  "illustrative ambience". The photo therefore never claims to be
  a real lab or real work. PASS.
- The "IN THE LAB" label on its own could be misread, but the
  disclaimer sits in the same caption bar, not behind a hover or
  a click. PASS.
- Design deviation (accuracy-neutral): doc 01 C8 specified the
  existing /profile.webp portrait with a founder caption. The
  built card uses an AI lab ambience image instead. Because it is
  honestly labeled, this is not an accuracy failure, but the
  parent should confirm the swap is intended. See G4.

### DnaHelix: PASS (exempt)
- Purely decorative double helix, aria-hidden, no text, no
  numbers, no claims. It is ornament, not a schematic carrying
  facts, so the microcopy check does not apply. PASS.

### Hero.tsx integration: PASS
- The integration imports all 9 components and adds no new copy:
  only positions, float durations (9s to 16s, desynced), and
  hide classes. No new number, name, or claim enters through the
  integration layer. PASS.
- The collage layer is aria-hidden and pointer-events none, per
  doc 01, so no card carries information that exists nowhere
  else in an accessible form: every card fact repeats Works,
  Journey, or archive content. PASS.
- Mobile stacking shows docking, faers, and photo (items without
  the mobile-hide class). The Hero comment claims only faers and
  photo show; see observation O2. Accuracy impact: none, since
  DockingCard is honest and microcopied.

## Cross-cutting checks

- FAERS homepage rule: PASS. The only FAERS numbers on the
  homepage collage are N = 6,601 and the 7,519 to 6,601 flow, with
  hypothesis-generating framing. No card plots effect values, and
  no event-case count appears (none is recorded).
- Schematic microcopy: FAIL (one card). GutAxisCard and
  DockingCard carry "Illustrative schematic"; PhotoCard carries
  "Illustrative ambience"; ReviewCard carries nothing; DnaHelix
  is exempt decoration; StrokeCard and PosterCard and AwardsCard
  and FaersCard are text/number cards, not diagrams.
- Retired lines: PASS. No card uses "fourth year undergraduate"
  (superseded by the clinical clerkship in content.ts timeline).
  No phone number or home area from CV.md appears on any card or
  in this report.
- Cerclage and Doppler e-poster: PASS. Neither appears in the
  collage, as required (cerclage has no result numbers and is a
  manuscript in progress; the Doppler e-poster is archived with
  an unconfirmed role).
- Em dash: PASS. Grep over all 9 components and the Hero collage
  block returns 0.
- Reference copy: PASS. No reference words, labels, or client
  material appear on any card; only the scattered-card concept
  is shared, which is the reference language, not its copy.

## Gap list

- G1 (blocking for this QA, trivial fix): ReviewCard has no
  honesty microcopy. Add one footer line in 10px mono, either
  "Illustrative schematic" (brief's wording) or "Method diagram,
  not data" (doc 01 rule 4 wording for the pipeline card). Either
  satisfies the rule; do not add both.
- G2 (source anchoring, not a FAIL): 7,519 appears in no
  content.ts record, only in docs/faers-verification.md. Recommend
  adding a total-reports figure to the content.ts faers block so
  every homepage number traces to content.ts. Until then, the
  figure's provenance is the FAERS audit record, which is
  documented above.
- G3 (coverage, not a FAIL): TB drug discovery and Amomum
  cardamomum / breast cancer are named on no card. Doc 01 C5
  specified an Amomum schematic and C9 specified a threads card
  including TB drug discovery; the built set covers PCOS,
  Bisphenol A, and gut axis instead, with DockingCard generic.
  If the parent wants full topic coverage, add captions only,
  never invented compounds or results.
- G4 (design deviations, accuracy-neutral, parent awareness):
  AwardsCard shows totals doc 01 C4 avoided (verified in
  siteStats, so fine); PosterCard omits Conrad Seoul and the
  5 to 7 November 2026 dates (present on Works and Research
  detail pages); PhotoCard uses an AI lab image instead of doc
  01's portrait (honestly labeled, so fine); mobile stacking
  shows 3 cards, not the 2 doc 01 section 4 states.

## Observations (not gaps)

- O1: ReviewCard funnel widths exist only as styling; no
  numerals are rendered. If count labels are ever added to the
  funnel, they need sources, and none are recorded for these
  reviews, so counts must stay off.
- O2: The Hero comment says mobile stacking shows only FaersCard
  and PhotoCard, but DockingCard has no mobile-hide class and
  also stacks. Either hide DockingCard on mobile or correct the
  comment and doc 01 section 4. No accuracy impact either way.
