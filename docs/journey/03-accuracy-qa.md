# 03 - Journey accuracy QA (REPORT ONLY, no site edits)

Scope: every factual claim in the new journey section in
`src/sections/Manifesto.tsx` (the five year stations 2021, 2023,
2024, 2025, 2026 plus the undated footnote), checked against two
sources only:

- `~/workspace/daivanlabs-rebuild/old-site-source/CV.md`
- work-tree `src/data/content.ts` (including `awardsArchive`,
  `oldPublications`, `experienceRoles`, `certificationsArchive`,
  `timeline`, `researchItems`, and `siteStats`)

Method: each claim in the section was matched to a source line or
record. A claim is PASS only if a source records it. FAIL is
reserved for invented content: a journal name, DOI, volume,
co-author list, grade, credential ID, result number, or year that
no source records. An omission is not scored as a false claim; it
is listed separately under Coverage gaps. No build was run, per
the task instruction.

## Verdict: PASS on accuracy, with 1 coverage gap and 1 source conflict

- False claims found: 0. No invented journal name, DOI, volume,
  co-author list, grade, credential ID, result number, or year
  appears anywhere in the section.
- FAERS homepage rule: PASS. The 2026 station shows only
  N = 6,601 with the verified honesty framing. No effect value of
  any kind (no ROR, no confidence interval, no p value, no
  percentage result) appears in the file.
- Coverage gap (not a false claim, but a missing record): 1 item
  from CV.md appears in neither the spine nor the section, see
  section 3.
- Source conflict (needs a parent decision, not an implementer
  fix): content.ts assigns year 2024 to three items that CV.md
  records with no year. The section follows CV.md and labels them
  "no recorded year". See section 4.
- Forbidden-pattern greps over `src/sections/Manifesto.tsx`, all
  0 hits: em dash; DOI; journal; volume; ROR; confidence interval;
  p value; phone number digits; home area; "fourth year";
  credential; expiry; co-author names. Percent signs found in the
  file are CSS only (border-radius, offsets), never result
  percentages.

## 1. Claim table

Station column uses the section's own year stations; "Footnote"
is the closing undated paragraph.

| Station | Claim | Source | Verdict |
|---|---|---|---|
| Intro | Started medicine at UII in 2021 | CV.md EDUCATION; content.ts education "2021 to present" and timeline "2021" | PASS |
| Intro | Clinic and Seoul congress poster in 2026 | content.ts timeline "5 Oct 2026" and "5 to 7 Nov 2026" | PASS |
| Intro | Five year stations | The section itself: 2021, 2023, 2024, 2025, 2026 | PASS |
| 2021 | Bachelor of Medicine, Faculty of Medicine, Universitas Islam Indonesia | CV.md EDUCATION; content.ts education | PASS |
| 2021 | GPA 3.91 out of 4.0 | CV.md EDUCATION ("Current GPA: 3,91"); content.ts education detail | PASS, recorded grade, not invented |
| 2021 | Guest speaker for the Blora Regency Government dialogue, Ngobrol Bareng Bupati | CV.md EXPERIENCE; content.ts experienceRoles, period 2021 | PASS |
| 2023 | Beasiswa Unggulan Awardee, from the Ministry of Education, Culture, Research, and Technology | CV.md NATIONAL; content.ts awards, year 2023 | PASS |
| 2023 | Active in SMART FK UII Scientific Division | CV.md EXPERIENCE; content.ts period Jul 2023 to Jun 2024 | PASS, period omitted, not misstated; spine groups it under 2023 |
| 2023 | Active in BAPIN-ISMKI | CV.md EXPERIENCE; content.ts period Feb 2023 to May 2024 | PASS, same note as above |
| 2023 | Public speaking educator at Seni.Bicara | CV.md EXPERIENCE; content.ts period Feb 2023 to Jun 2023 | PASS |
| 2023 | Master of Ceremony for the UII Faculty of Medicine General Assembly XVI | content.ts experienceRoles, period 2023 (CV.md does not list it separately) | PASS |
| 2023 | Dot: 1st Place Scientific Essay, Scientific Fair SMART FK UII | CV.md NATIONAL; content.ts awardsArchive, year 2023 | PASS |
| 2023 | Dot: Bronze Medal IRPOCO 2023 | CV.md NATIONAL; content.ts awardsArchive, year 2023 | PASS |
| 2023 | Dot: 2nd Winner National Essay RJJ Undiksha | CV.md NATIONAL; content.ts awardsArchive, year 2023 | PASS |
| 2023 | Count label: 4 award items in 2023 | Count of the Beasiswa item plus the 3 dots above; dots array length is 4 | PASS |
| 2024 | 20 certifications completed: WHO, UNITAR, Johns Hopkins, and Coursera | CV.md CERTIFICATIONS; content.ts certificationsArchive, all year 2024 | PASS, provider breakdown counts omitted, not misstated |
| 2024 | Four publications recorded | content.ts oldPublications with year 2024: gut-axis Indonesian, gut-axis English, colonoscopy CADe, RAAS IC-CVD | PASS |
| 2024 | First-author ePoster at ENDO 2024 in Seoul | CV.md INTERNATIONAL (1st Author, ENDO 2024); content.ts awardsArchive, year 2024 | PASS, date and venue detail omitted, not misstated |
| 2024 | Poster at ICKSH 2024, first-author | CV.md INTERNATIONAL (1st Author); content.ts awardsArchive, year 2024 | PASS |
| 2024 | Oral presentation at MYHAM 2024, first-author | CV.md INTERNATIONAL (1st Author); content.ts awardsArchive, year 2024 | PASS |
| 2024 | Speaker and mentor at KampusInovatif.id | content.ts experienceRoles, period Sep 2024 to Feb 2025 | PASS |
| 2024 | Speaker and mentor at INTIMATE SMART FK UII | CV.md EXPERIENCE; content.ts experienceRoles, period 2024 | PASS |
| 2024 | Count label: 3 first-author presentations in 2024 | CV.md records 1st Author for ENDO, ICKSH, and MYHAM; dots array length is 3 | PASS |
| 2025 | Most Outstanding Student UII 2025 | CV.md NATIONAL; content.ts awards, year 2025 | PASS |
| 2025 | 3rd Most Outstanding Student LLDIKTI V 2025 | CV.md NATIONAL; content.ts awardsArchive, year 2025 | PASS |
| 2025 | DaivanLabs founded in June 2025 | content.ts experienceRoles "June 2025 to present" and timeline "June 2025" | PASS |
| 2025 | Summer school at Chulalongkorn (AASP-PECT) | CV.md EDUCATION (AASP-PECT Summer School 2025); content.ts education, period 2025 | PASS |
| 2025 | Amomum cardamomum publication recorded this year (2025) | content.ts oldPublications, year 2025 | PASS, spine correctly corrects the brief grouping that put all publications under 2024 |
| 2025 | Dot: Gold Medal and Special Award, IIF 2025 | CV.md NATIONAL (1st Author); content.ts awardsArchive, year 2025 | PASS |
| 2025 | Dots: Gold Medal ISIF 2025, IICYMS 2025, WRCSO 2025, WSEEC 2025 | CV.md INTERNATIONAL (all 1st Author); content.ts awardsArchive, year 2025 | PASS |
| 2025 | Dots: Silver Medal I2ASPO 2025, BISF 2025, JISF 2025 | CV.md INTERNATIONAL (all 1st Author); content.ts awardsArchive, year 2025 | PASS |
| 2025 | Dot: Travel Grant, ICDM 2025 | CV.md INTERNATIONAL; content.ts awardsArchive, year 2025 | PASS |
| 2025 | Count label: 11 award items in 2025 | CV.md 2025 items: 3 national plus 8 international; dots array length is 11 | PASS |
| 2026 | Clinical clerkship (koas), surgery rotation from 5 October 2026 | content.ts profile status line and timeline "5 Oct 2026" | PASS |
| 2026 | Poster ABST-000034 at Hypertension Seoul 2026, Conrad Seoul, 5 to 7 November 2026 | content.ts researchItems venue and timeline "5 to 7 Nov 2026" | PASS |
| 2026 | FAERS resistant hypertension study, N = 6,601 reports analysed | content.ts faers sampleSize 6601 | PASS, the only number on this station besides dates |
| 2026 | Results are hypothesis-generating: reporting disproportionality, not clinical risk or causality | content.ts faers honestyNote | PASS |
| 2026 | No FAERS effect value anywhere in the section | Grep over the file: 0 hits for ROR, confidence interval, or p value patterns | PASS |
| 2026 | StrokeSense and StrokeSense AI Lab built; uploads are AI interpretation of images, not measurement; FAST output is an Observation Sheet with no score and no diagnosis | content.ts researchItems and tools honesty notes, both year 2026 | PASS, no score, classification, or diagnostic claim appears |
| 2026 | Cerclage Table 1 deep analysis completed 18 October 2026; no result numbers published | content.ts cerclage role "completed 18 Oct 2026" and note "No result numbers are recorded" | PASS |
| Footnote | Field Staff for the doctor inauguration of FK UII Periode LIX, no recorded year | CV.md EXPERIENCE; content.ts experienceRoles period "" with note "No period is recorded" | PASS |
| Footnote | 3rd Most Outstanding Student, SMAN 1 Blora, no recorded year | CV.md NATIONAL (no year given); content.ts caveat note says CV.md gives no separate year | PASS, see source conflict note in section 4 |
| Footnote | Head of Research on dietary impacts in women with PCOS, no recorded year | CV.md NATIONAL (no year given) | PASS, see source conflict note in section 4 |
| Footnote | Two Bisphenol A systematic review grants, no recorded year | CV.md NATIONAL (no year given) | PASS, see source conflict note in section 4 |
| Footnote | In silico drug discovery collaboration on Kapulaga and tuberculosis, no recorded year | CV.md NATIONAL (no year given) | PASS, see source conflict note in section 4 |
| Footnote | No journal name, DOI, volume, or author list for any publication | Grep 0; content.ts authorsNote on every oldPublication | PASS |
| Footnote | No credential ID, expiry date, or grade for any certification | Grep 0; CV.md records none | PASS |
| Footnote | No phone number or home area | Grep 0; CV.md header details never appear | PASS |
| Footnote | No "fourth year undergraduate" status line | Grep 0; current status is clinical clerk (koas) | PASS |
| Footnote | Full record lives on the Awards, Education, and Research pages | Routes /awards, /education, /research exist in src/App.tsx | PASS, navigation text, not a CV claim |

## 2. FAERS homepage rule, checked separately

- The 2026 station contains exactly one FAERS number: N = 6,601.
- It carries the verified honesty framing in full.
- No ROR, confidence interval, p value, or percentage result
  appears anywhere in the file. The only percentages in the file
  are CSS values (border-radius, offsets).
- The unverified FAERS values are not reproduced in this report
  either; this section refers to them only by category.

## 3. Coverage gap: 1 record missing from both spine and section

- Gold Medal, International Science and Invention Fair (ISIF)
  2024, 1st Author. Source: CV.md INTERNATIONAL; content.ts
  awardsArchive, year 2024. It appears in no spine station
  (docs/journey/01-spine.md stations S9 to S15 cover 2024 without
  it) and in no journey station. The 2024 station's dot list
  covers only the three presentations, so the medal is absent
  from the journey entirely. This is an omission, not a false
  claim, so it does not change the accuracy PASS, but the journey
  is not the full record without it. Suggested fix: add it to the
  2024 station dots with the label "Gold Medal, ISIF 2024" (it
  would then be the fourth 2024 dot, and the dot-count label
  would need rewording since it is not a presentation).
- Deliberately omitted, not a gap: the Ophthalmic Artery Doppler
  e-poster (ABST-000171) in content.ts has year null and an
  unconfirmed role, and is held in archive until both are
  confirmed. Leaving it out of the journey is correct; promoting
  it to a station would invent a year and a role.

## 4. Source conflict: content.ts year 2024 vs CV.md no year

- content.ts awardsArchive assigns year 2024 to five items that
  CV.md records with no year at all: Head of Research on dietary
  impacts in women with PCOS; the Bisphenol A grant on canned and
  plastic food and beverage; the Bisphenol A grant on cancers;
  the Kapulaga drug discovery collaboration; and the tuberculosis
  drug discovery collaboration. The spine document states that
  content.ts records no year for these items; that statement is
  incorrect for awardsArchive, as the grep above proves.
- The journey section follows CV.md and puts all five in the
  undated footnote. That is the conservative choice and is scored
  PASS here, because CV.md is the CV document and it records no
  year, so "no recorded year" is true against CV.md and invents
  nothing. But the parent should decide explicitly whether the
  old site's 2024 grouping (as carried into content.ts) should
  instead be honored; if so, these five items move to the 2024
  station and the footnote shrinks.
- Same pattern, smaller: the SMAN 1 Blora item carries year 2021
  in content.ts awardsArchive, but with an explicit caveat note
  that the year is the graduation period and CV.md gives no
  separate year. The section correctly keeps it undated.

## 5. Completeness notes (omissions inside PASS rows, not FAILs)

- Sub-roles folded out of the visible text: SMART FK UII details
  (Scientific Fair coordinator, Lab Class moderator, Temilnas X
  Liaison Officer) and BAPIN-ISMKI details (Jas Merah initiative,
  IMSS 2023 staff, Upgrading moderator) are not named in the 2023
  station detail. The spine and design allow folding; nothing
  stated is false, but a reader of the journey alone will not
  learn these sub-roles.
- Periods omitted but not misstated: SMART FK UII runs to June
  2024 and BAPIN-ISMKI to May 2024, while both sit under the 2023
  station; KampusInovatif.id runs to February 2025 while it sits
  under the 2024 station. This matches the spine grouping.
- Provider breakdown counts for the 20 certifications (WHO 2,
  UNITAR 1, Johns Hopkins 3, other Coursera providers 14) are not
  shown in the 2024 station, only the provider names. The total
  20 is correct.

## 6. Design deviations observed (out of scope for accuracy, flagged)

- Section title reads "The journey so far." while the design doc
  specifies "The route so far." Wording only, not a factual
  claim.
- Medal dots are uniform solid blue for every dot, so medal type
  (gold, silver, bronze, travel grant) is not encoded by dot style
  as the design specifies. The visible count labels and dot
  titles carry the information in text, so nothing is conveyed by
  color alone, but the encoding itself is absent.
- The three branch lines (publications, research, tools) and the
  certifications provider-dot row are collapsed into year-station
  prose; there is no "Now" terminus node and no closing aggregate
  note (29 awards, 6 gold medals, 12 international items).
  None of this affects the accuracy verdict.
