# V2 Content Audit - DaivanLabs Portfolio Rebuild

Date: 24 Oct 2026. Auditor role: report only. No site file was edited by this audit.

## Verdict: FAIL

Reason: 7 gaps plus 1 inferred date (see section 5). No invented journal, DOI,
author, number, or institution was found (see section 4), and the forbidden
content checks all pass (see section 6). The FAIL is driven by missing
rendered items, not by invented content.

## 1. Scope and method

Old-site sources read in full:
- `old-site-source/CV.md` (authoritative old-site record)
- `old-site-source/src/pages/AwardsPage.jsx` (29 items: 13 national, 12
  international, 4 publication entries)
- `old-site-source/src/pages/ResearchPage.jsx` (4 publications, 4 recent honors)
- `old-site-source/src/pages/ExperiencePage.jsx` (8 roles)
- `old-site-source/src/pages/EducationPage.jsx` (3 entries, knowledge map)
- `old-site-source/src/pages/CertificationsPage.jsx` (20 records)
- `old-site-source/src/pages/AboutPage.jsx` (4 focus clusters, 6 methodologies,
  4 key projects, academic journey, achievements log)
- `old-site-source/src/components/Hero.jsx`, `About.jsx`, `Contact.jsx`,
  `Footer.jsx`, `Experience.jsx`, `TrustedBy.jsx`, `Projects.jsx`
- `research/08-inventaris-riset.md` and `src/data/faers-plot.json` for the
  2025-2026 items (FAERS, StrokeSense, cerclage, Doppler e-poster)

V2 tree audited (stable, last writes 06:02-06:03 on 24 Oct 2026):
- `src/data/content.ts`, `src/data/faers-plot.json`
- `src/pages/AwardsPage.tsx`, `CertificationsPage.tsx`, `EducationPage.tsx`,
  `ExperiencePage.tsx`, `ResearchIndex.tsx`, `ResearchDetail.tsx`,
  `NotFound.tsx`
- `src/sections/Hero.tsx`, `Quote.tsx`, `Services.tsx`, `Manifesto.tsx`,
  `Profile.tsx`, `Works.tsx`, `Affiliations.tsx`, `Contact.tsx`
- `src/components/Header.tsx`, `Footer.tsx`, `ForestPlot.tsx`,
  `FaersPlotSection.tsx`
- `src/App.tsx`, `index.html`, `public/sitemap.xml`, `public/robots.txt`,
  `public/og.jpg`
- `src/dev/` was checked only for forbidden patterns (phone, home address,
  Onlines clients), not content-checked, because its data is synthetic by
  design and labelled as such.

How "PRESENT" is judged here: the item is rendered in a page, section, or
component that the router actually serves. Data that exists only in an
unimported export in `src/data/content.ts` does NOT count as present. That
distinction matters for sections 3 and 5: several v2 data exports are never
imported by any page or section (see observation O4).

## 2. Checklist - old-site items

### 2.1 Publications (5 unique titles in CV.md)

| Item | Status | Where in v2 |
|---|---|---|
| Exploration of Amomum cardamomum Seed-Derived Compounds (2025, JOURNAL) | PRESENT | `src/pages/ResearchIndex.tsx` (old publications list), `src/sections/Works.tsx` row 05, `src/data/content.ts` oldPublications |
| Peran Microbiome Gut Axis Dalam Perkembangan Dan Kekambuhan Chronic Myeloid Leukemia: Systematic Review (2024, REVIEW) | PRESENT | `src/pages/ResearchIndex.tsx`, `src/sections/Works.tsx` row 06, `src/data/content.ts` oldPublications (labelled Indonesian version) |
| A Comparative Analysis Of Colonoscopy With Computer-Aided Detection And Standard Colonoscopy (2024, REVIEW) | PRESENT | `src/pages/ResearchIndex.tsx`, `src/sections/Works.tsx` row 07, `src/data/content.ts` oldPublications |
| The role of the microbiome gut axis in the development and relapse of chronic myeloid leukemia: Systematic review (English version) | PRESENT | `src/pages/ResearchIndex.tsx` (with note that it is the English version of the same review), `src/data/content.ts` oldPublications (labelled English version). Not repeated on the homepage Works list, which is correct for a selected-works list. |
| The Significant Roles of The Renin-Angiotensin-Aldosterone System Metabolism on the Development of Hypertension (2024, CONFERENCE, IC-CVD) | PRESENT | `src/pages/ResearchIndex.tsx`, `src/sections/Works.tsx` row 08, `src/data/content.ts` oldPublications |

No journal name, DOI, volume, or full author list is shown for any of these
in v2, matching the old source, which records authors only as DFJS/DF.
`src/data/content.ts` and `src/pages/ResearchIndex.tsx` both state this
explicitly. Old-site status labels (Published / Completed / Presented) are
kept in `src/data/content.ts` oldPublications.

### 2.2 National honors and grants (13 items, CV.md NATIONAL + AwardsPage.jsx n1-n13)

All 13 PRESENT in `src/pages/AwardsPage.tsx` NATIONAL list and in
`src/data/content.ts` awardsArchive:

1. 3rd Most Outstanding Student LLDIKTI V 2025
2. Most Outstanding Student UII 2025
3. Awardee Beasiswa Unggulan 2023 (Ministry of Education, Culture, Research,
   and Technology)
4. Head of Research: Dietary Impacts in Women with PCOS (Review Research
   Grant, 2024)
5. Grant: Bisphenol A in Canned Food (Faculty of Medicine UII, led by dr. Eko
   Andriyanto M.Sc, 2024)
6. Grant: Bisphenol A on Cancers (Faculty of Medicine UII, led by dr.
   Kuswati, 2024)
7. Research Collaborator: Drug Discovery Kapulaga (Breast Cancer Study, 2024)
8. Research Collaborator: Drug Discovery Tuberculosis (In Silico Study, 2024)
9. Gold Medal and Special Award, Invention and Innovation Fair (IIF) 2025,
   1st Author
10. 1st Place Scientific Essay, Scientific Fair SMART FK UII 2023
11. Bronze Medal, Innovation And Research Poster Competition (IRPOCO) 2023
    (CV.md groups it under NATIONAL while describing it as International
    Scale; v2 preserves that grouping and notes it)
12. 2nd Winner National Essay, RJJ Undiksha 2023
13. 3rd Most Outstanding Student, SMAN 1 Blora (based on Final Student
    Examination; year rendered as 2021, sourced from AwardsPage.jsx n13;
    CV.md itself gives no separate year for this item)

Grants as a subgroup: items 4, 5, 6, 7, 8 above are all present. No grant
amount, grant ID, or funder beyond the old source is added.

### 2.3 International honors and presentations (12 items, CV.md INTERNATIONAL + AwardsPage.jsx i1-i12)

All 12 PRESENT in `src/pages/AwardsPage.tsx` INTERNATIONAL list and in
`src/data/content.ts` awardsArchive:

1. Silver Medal, Indonesia International Applied Science Project Olympiad
   (I2ASPO) 2025, 1st Author
2. Gold Medal, International Science and Invention Fair (ISIF) 2025,
   1st Author
3. Travel Grant Recipient, International Congress of Diabetes and Metabolism
   (ICDM) 2025
4. Gold Medal, International Invention Competition for Young Moslem Scientists
   (IICYMS) 2025, 1st Author
5. Gold Medal, World Robotics and Computer Science Olympiad (WRCSO) 2025,
   1st Author
6. Silver Medal, Bali International Science Fair (BISF) 2025, 1st Author
7. Gold Medal, World Science, Environment and Engineering Competition (WSEEC)
   2025, 1st Author
8. Silver Medal, Jakarta International Science Fair (JISF) 2025, 1st Author
9. Gold Medal, International Science and Invention Fair (ISIF) 2024,
   1st Author
10. ePoster Presentation, ENDO 2024, 4th World Congress of GI Endoscopy,
    4 to 6 July 2024, COEX Convention and Exhibition Center, Seoul, Korea,
    1st Author
11. Poster Presenter, ICKSH 2024 (2024 Korean Society of Hematology
    International Conference and 65th Annual Meeting), 1st Author
12. Oral Presentation, MYHAM 2024 (The 1st International Conference MYHAM,
    Muhammadiyah Yogyakarta, Hospital and Healthcare Management), 1st Author

### 2.4 Experience (8 roles + CV-only items)

All 8 roles PRESENT in `src/pages/ExperiencePage.tsx` ROLES, verbatim in
substance (role, organization, period, description, outcomes), and in
`src/data/content.ts` experienceRoles:

1. Founder, DaivanLabs, June 2025 to present (Code, Cure, Connect)
2. Speaker and Mentor, KampusInovatif.id, Sep 2024 to Feb 2025
3. Awardee Beasiswa Unggulan, Ministry of Education, Oct 2023 to present
4. Active Member and Contributor, SMART FK UII, Jul 2023 to Jun 2024
   (including SMART Of The Year Best Staff Scientific, Scientific Fair 1
   and 2, Lab Class 2023, Temilnas X liaison work)
5. Coordinator and Administrator, BAPIN-ISMKI, Feb 2023 to May 2024
   (including Jas Merah initiative, National Daily Administrator Internal,
   IMSS 2023 staff, Upgrading moderator work)
6. Speaker Public Speaking, Seni.Bicara, Feb 2023 to Jun 2023
7. Master of Ceremony, Universitas Islam Indonesia, 2023 (Sidang Umum XVI)
8. Guest Speaker, Blora Regency Government, 2021 (Ngobrol Bareng Bupati)

CV-only items PRESENT:
- Field Staff, Pelantikan dan Pengambilan Sumpah Dokter FK UII Periode LIX:
  `src/pages/ExperiencePage.tsx` Also list and `src/data/content.ts`
  experienceRoles (period honestly left empty, as CV.md records none).
- Speaker and Scientific Essay Mentor, INTIMATE SMART FK UII 2024:
  same two locations.
- IMSS 2023 Staff Internal Division and Moderator of Upgrading
  BAPIN-ISMKI: present twice on ExperiencePage (once as BAPIN role
  outcomes, once in the Also list). Duplication, not omission; see
  observation O5.

### 2.5 Education (3 entries)

All 3 PRESENT in `src/pages/EducationPage.tsx` ENTRIES and in
`src/data/content.ts` education and educationItems:

1. Islamic University of Indonesia, Bachelor of Medicine, 2021 to present,
   GPA 3.91 out of 4.0, Most Outstanding Student UII 2025, Beasiswa
   Unggulan Awardee 2023.
2. Chulalongkorn University, Summer School Program, 2025, intensive
   training in Pharmaceutical and Clinical Development (AASP-PECT / CPDT).
3. SMAN 1 Blora, Senior High School, Graduated, Top 3 Student, 3rd Most
   Outstanding Student based on the Final Student Examination.

Current-status handling is honest: EducationPage keeps the degree line as
recorded and adds a separate note that since 5 October 2026 Daivan is a
clinical clerk (koas) on surgery rotation. The old "fourth year
undergraduate" wording appears in v2 only inside a code comment in
`src/data/content.ts` stating it is retired; it is not rendered copy.

### 2.6 Certifications (20 records, all 2024)

All 20 PRESENT in `src/pages/CertificationsPage.tsx` (grouped by provider,
count computed as 20) and in `src/data/content.ts` certificationsArchive,
with full titles (the v1 `certifications` export truncates two titles, but
no page renders that export; see observation O4):

- WHO x2: Antimicrobial Resistance and Infection Prevention and Control;
  Inequality Monitoring in Sexual Reproductive, Maternal, Newborn, Child,
  and Adolescent Health.
- UNITAR x1: Gender Equality and Human Rights in Climate Action and
  Renewable Energy.
- The Johns Hopkins University x3: Chemicals and Health; Psychological
  First Aid; COVID-19 Contact Tracing.
- Stanford University x1, University of Colorado Boulder x1, Yale
  University x1, The George Washington University x1, Vanderbilt
  University x1, The University of Chicago (Northshore) x1, University of
  Minnesota x2, University of California San Diego School of Medicine x4,
  Imperial College London x1, University of Washington x1.

No credential ID, expiry date, or grade is claimed, matching the old
source. The old page's "LIFETIME" validity label is not rendered in v2;
that is a framing omission, not a factual change, and is not counted as a
gap.

### 2.7 Research focus clusters (4, old About page)

- Systematic Review (PCOS, Cancer, Gut Microbiome): PRESENT, compressed,
  in `src/sections/Services.tsx` column 01 ("from PCOS and cancer to the
  gut microbiome") and in `src/data/content.ts` researchFocus.
- Drug Discovery (In Silico, TB and Breast Cancer): PRESENT, compressed,
  in `src/sections/Services.tsx` column 01 and in
  `src/data/content.ts` researchFocus.
- MedTech (AI in Diagnostics, Colonoscopy): PARTIAL. The colonoscopy work
  itself is present (`src/pages/ResearchIndex.tsx`,
  `src/sections/Works.tsx` row 07), but the cluster label "MedTech / AI in
  Diagnostics" is not rendered anywhere.
- Public Health (Stunting prevention, Health Standards): MISSING from
  rendered UI. Present only in the unimported `src/data/content.ts`
  researchFocus export. See gap G3.

### 2.8 Methodologies (6, old About page)

- Systematic Review: PRESENT (`src/sections/Services.tsx`,
  `src/pages/ResearchIndex.tsx`, `src/sections/Works.tsx`).
- In Silico: PRESENT (`src/sections/Services.tsx` column 01,
  `src/pages/AwardsPage.tsx` grant details).
- Public Speaking: PRESENT (`src/pages/ExperiencePage.tsx` Seni.Bicara
  role).
- Mentoring: PARTIAL. Present as a concept (`src/sections/Services.tsx`
  column 03 title "Teaching and mentoring", INTIMATE mentor in
  `src/pages/ExperiencePage.tsx`), but not rendered as a methodology item.
- Clinical Research: MISSING from rendered UI. Present only in the
  unimported `src/data/content.ts` methodologies export. See gap G4.
- Data Analysis: MISSING from rendered UI. Present only in the unimported
  `src/data/content.ts` methodologies export. See gap G4.

### 2.9 Key projects (4, old About page)

All 4 PRESENT in `src/pages/ResearchIndex.tsx` key projects and in
`src/data/content.ts` keyProjects:

1. Dietary Impacts on PCOS (Head of Research, systematic review, 2024).
2. Bisphenol A and Cancer (systematic review; two Faculty of Medicine UII
   grants, 2024). Minor label variance: ResearchIndex lists the role as
   "Systematic review" while content.ts lists "Grantee researcher"; both
   trace to the old source and neither invents a fact.
3. TB Drug Discovery (in silico, research collaborator, 2024).
4. Gut Axis and Leukemia (systematic review, microbiome gut axis in
   chronic myeloid leukemia).

### 2.10 Site stats (old site aggregates)

PRESENT in `src/sections/Profile.tsx` anchors and
`src/pages/AwardsPage.tsx` intro, and in `src/data/content.ts` siteStats:
29 total awards, 6 gold medals, 12 international, 4 old-site
publications, 20+ certifications, 8 key roles, GPA 3.91 out of 4.0.
Missing computed extras: see gaps G5 and G6.

Reconciliation note (not a gap on its own): the old site itself counts
"4 publications" differently on different pages. ResearchPage lists 4
(Amomum, CML Indonesian, Colonoscopy, RAAS). AwardsPage lists 4
publication entries (CML Indonesian, Colonoscopy, CML English, RAAS).
Combined unique titles = 5. V2 lists all 5 unique titles and keeps the
old "29" headline (13 + 12 + 4). A reader counting distinct titles across
v2 pages will count 25 awards + 5 publications = 30 distinct works
against the headline 29. The parent should decide whether to keep the old
29 headline or update it; v2 does not currently explain this arithmetic
anywhere a reader can see it (the explanation exists only in code
comments).

### 2.11 Contact identity

- Name Daivan Febri Juan Setiya: PRESENT (Header, Profile, Footer,
  content.ts profile).
- Email: PRESENT (`src/components/Header.tsx` fixed CTA,
  `src/sections/Contact.tsx`, `src/sections/Profile.tsx`,
  `src/components/Footer.tsx`, `src/data/content.ts` profile).
- Location Indonesia, University Islamic University of Indonesia,
  Interests Research / Public Health / Cancer: PRESENT in
  `src/data/content.ts` profile and in Profile section copy (Indonesia,
  UII, research). The interests triple as a labelled list is not
  rendered; the substance is.
- Principle "Ad maiora natus sum" (born for greater things): PRESENT
  (`src/sections/Profile.tsx`, `src/data/content.ts` profile).
- Tagline Code for Cure / Code, Cure, Connect: PRESENT in substance
  (Quote, Services, Profile, Footer, ExperiencePage Founder role).
- LinkedIn: PRESENT in `src/components/Footer.tsx` and
  `src/data/content.ts` LINKEDIN_URL, using the CV.md long form. Note:
  old Contact.jsx and Footer.jsx use a short form without the numeric
  suffix. Both forms exist in the old source, so neither is invented,
  but the parent should confirm which one is canonical (see
  observation O6).
- ORCID: MISSING. Old Contact.jsx links an ORCID profile. No ORCID link
  appears anywhere in v2. See gap G1.
- Instagram: MISSING. Old Contact.jsx links an Instagram profile. No
  Instagram link appears anywhere in v2. See gap G2.
- Old-site hero bio ("fourth year undergraduate..."): retired with a
  dated koas status note, as documented in section 2.5. Not counted as
  missing, because the v2 brief explicitly updates status.

### 2.12 2025-2026 items (research/08, faers-plot.json)

- FAERS resistant hypertension study, poster ABST-000034, Hypertension
  Seoul 2026, Conrad Seoul, 5 to 7 November 2026, N = 6,601, lead
  researcher and poster presenter, co-author Dinda Ashilah Putri Kusnan:
  PRESENT (`src/sections/Works.tsx` row 01, `src/pages/ResearchIndex.tsx`,
  `src/pages/ResearchDetail.tsx` with `src/components/FaersPlotSection.tsx`).
  Verified ROR rows only (1.03, 6.06, 9.00 with CIs) are plotted; see
  section 6.
- StrokeSense AI Lab (live, strokesenseai.daivanlabs.com, Ask the Lab,
  FAST Observation Sheet, no score, no diagnosis): PRESENT
  (`src/sections/Works.tsx` row 02, ResearchIndex, ResearchDetail, Tools
  data). No diagnostic claim is made.
- StrokeSense education-first (repo doctorcorelabs/strokesense, no Face
  Lab score or classification claims): PRESENT (`src/sections/Works.tsx`
  row 03, ResearchIndex, ResearchDetail). The Face Lab guardrail appears
  only as a do-not-cite comment in content.ts, not as a claim.
- Emergency cervical cerclage in twin pregnancies (SR/MA, manuscript in
  progress, Table 1 deep analysis completed 18 Oct 2026, no result
  numbers): PRESENT (`src/sections/Works.tsx` row 04, ResearchIndex,
  ResearchDetail). Title matches research/08 verbatim.
- Ophthalmic Artery Doppler e-poster ABST-000171 (archive, role
  unconfirmed, Dinda as corresponding author): PRESENT as archive
  (`src/data/content.ts` researchItems, ResearchIndex featured list).
  Not promoted to featured. Year rendered as 2026 in content.ts is
  inferred from the October 2026 timeline, not explicitly recorded in
  research/08 item 8; see observation O1.
- Seoul travel grant (research/08: Indonesia Region B, confirmed after
  full registration): NOT rendered anywhere in v2 except as the ICDM
  2025 travel grant award, which is a different grant. This is a minor
  omission from the FAERS context, not an old-site gap; listed here for
  completeness, not counted in the gap list.
- StrokeSense slim variant and ssense repo (research/08 item 9, archive):
  NOT rendered. Research/08 itself flags these as archive with a name
  confusion risk, so their absence is consistent with that note, not a
  gap.

### 2.13 Deliberately excluded old-site material (correctly absent)

- Nucleus pages: the old Nucleus page was publicly empty (0 nodes). Its
  absence from v2 is correct, not a gap.
- TrustedBy (Google, Microsoft, Stripe, Amazon wordmarks): template
  filler in the old source, not a real endorsement. Correctly absent.
- Projects.jsx demo items (Project Aura, Neural Synth, Quantum Canvas,
  Sentinel Core): template filler with stock images, not Daivan's work.
  Correctly absent.
- Unsplash stock photos on old About project cards: not carried over.
  Correct, since they were not documentation of the research.

## 3. Rendered versus data-only

The following v2 data exists in `src/data/content.ts` but is not imported
by any page, section, or component, so it does not reach the reader:
awardsArchive, educationItems, certificationsArchive, oldPublications,
researchFocus, methodologies, keyProjects, experienceRoles, siteStats,
LINKEDIN_URL (Footer hard-codes the same URL instead of importing it),
and the v1 exports awards, education, timeline, tools, certifications
(the last two with truncated titles, superseded by the archive exports).
Pages render their own local copies instead. The local copies were checked
individually and match the old source (see section 2), so this is a
maintainability observation, not a content gap, except where the rendered
copy is thinner than the data copy: focus clusters (G3) and methodologies
(G4).

## 4. INVENTED list

No invented journal name, DOI, author, institution, or result number was
found in rendered v2 output. Specifically checked and clean:
- DOI: the only occurrences of the string are in comments stating that no
  DOI is invented or shown.
- Journal names: none shown for any publication, old or new.
- Authors: FAERS co-author Dinda Ashilah Putri Kusnan is recorded in
  research/08; old publications show no author list, matching the old
  source; cerclage shows no author list.
- Numbers: every rendered number traces to CV.md, an old page, or
  research/08 (29, 6, 12, 4, 20+, 8, 3.91, 6,601, 17, 2021-2026 dates).
- Institutions: every rendered institution traces to the old source or
  research/08 (UII, Chulalongkorn, WHO, UNITAR, Johns Hopkins, KSH,
  Ministry of Education). Affiliation wordmarks carry relationship labels
  and are explicitly not presented as clients.

One inferred date, flagged rather than counted as invented fact:
- O1. Doppler e-poster year 2026 in `src/data/content.ts` researchItems
  (ophthalmic-artery-doppler-poster). Research/08 item 8 records no year.
  The year is consistent with the October 2026 e-poster timeline, but it
  is an inference, and the parent should confirm it or remove the year.

## 5. Gap list (drives the FAIL verdict)

- G1. ORCID link missing. Old Contact.jsx links an ORCID profile.
  Absent from Header, Footer, Contact section, and Profile in v2.
- G2. Instagram link missing. Old Contact.jsx links an Instagram
  profile. Absent from all v2 pages and sections.
- G3. Public Health focus cluster not rendered. Stunting prevention and
  Health Standards do not appear in any rendered page or section. They
  exist only in the unimported `src/data/content.ts` researchFocus
  export. Services column 01 covers Systematic Review and Drug Discovery
  but has no Public Health column or line.
- G4. Methodologies incompletely rendered. Clinical Research and Data
  Analysis do not appear in any rendered page or section. Mentoring
  appears only as the Services column title "Teaching and mentoring"
  and as the INTIMATE mentor role, not as a methodology item. All six
  exist only in the unimported `src/data/content.ts` methodologies
  export, except Systematic Review, In Silico, and Public Speaking,
  which are rendered.
- G5. Old-site computed stats missing. Success rate 31 percent and peak
  year 2025, both computed and displayed on old AwardsPage.jsx, do not
  appear in v2. Core aggregates (29, 6, 12, 4) are present.
- G6. Knowledge-map skill percentages missing. Old EducationPage.jsx
  shows Systematic Review 95 percent, Meta-Analysis 90 percent, Clinical
  Diagnostics 85 percent, Public Health 90 percent. None appears in v2
  EducationPage or anywhere else. These are old-site self-assessments;
  if carried over they should keep that framing.
- G7. Homepage Works archive rows link to detail slugs with no matching
  item. `src/sections/Works.tsx` rows 05 to 08 link to four detail slugs
  that do not exist in `src/data/content.ts` researchItems, so
  `src/pages/ResearchDetail.tsx` renders its honest "Detail menyusul"
  fallback for them. This contradicts `src/pages/ResearchIndex.tsx`,
  which deliberately renders the same publications without links. Fix
  by linking those rows to /research or by creating the detail pages;
  do not invent detail content to fill them.

## 6. Forbidden-content grep results (explicit)

All greps run over `src/`, `index.html`, and `public/` (including
`src/dev/` synthetic data):

- Phone from CV.md: ABSENT. No match in any file.
- Home address from CV.md: ABSENT. No match in any file, including for
  the locality and region words.
- Unverified ROR values 5.47 and 0.50: ABSENT from `src/`, `index.html`,
  and `public/`, and absent from the shipped data file
  `src/data/faers-plot.json`, which contains only the 3 verified rows
  (1.03, 6.06, 9.00) plus 2 withheld rows named by drug and outcome
  without values. The full record in `docs/faers-verified.json` is
  exempt per the brief and is not imported by any component.
- Onlines client names and copy: ABSENT. No match for the Onlines client
  list, Spanish homepage copy, or the reference hero word. The v2 hero
  word is "daivanlabs.", not the reference word.
- Template filler (TrustedBy companies, Projects.jsx demo items):
  ABSENT.
- Face Lab score or classification claims: ABSENT as claims. The only
  match is a guardrail comment in `src/data/content.ts` stating those
  claims must not be cited.
- Stitch filler institutions: ABSENT (matches found were only the words
  inside "Indonesian Medical Student Summit", not an institution claim).
- Em dash in v2 source: ABSENT from `src/` (grep for the character
  returned nothing).
- Secrets: none found in the audited tree. No phone or home address
  value is quoted anywhere in this report either, per the brief.

## 7. Observations (not gaps, for the parent)

- O2. Stale gate flag. `src/data/content.ts` exports
  `canDisplayLabelledRor = false` with a header comment saying the
  verification file did not exist when the file was written. The
  verification file now exists and verified rows ARE displayed through
  `src/data/faers-plot.json` and `src/components/FaersPlotSection.tsx`,
  which gates rows independently. No component imports the flag, so
  nothing renders wrong, but the flag and comment are stale and
  misleading.
- O3. Style inconsistency (not content). `src/pages/ResearchIndex.tsx`,
  `src/pages/ResearchDetail.tsx`, `src/components/ForestPlot.tsx`,
  `src/components/FaersPlotSection.tsx`, and `src/pages/NotFound.tsx`
  still use the v1 MANUSKRIP tokens (Archivo, IBM Plex Mono, ink
  #0A0A0A, red #C8102E), while the rest of v2 uses Onlines tokens
  (Inter, JetBrains Mono, ink #010101, blue #0859D4). ResearchIndex and
  ResearchDetail also use Indonesian UI copy ("Beranda", "Riset",
  "Kembali ke beranda") while the new pages use English. Index.html
  meta description still says "medical student" from v1.
- O4. Duplicate data (see section 3). Pages carry local copies of data
  that also exists in `src/data/content.ts`. Both copies were checked
  and agree, except: ResearchIndex renders the English CML review year
  as "Not separately recorded" while content.ts records 2024 (sourced
  from AwardsPage.jsx p3); ResearchIndex lists the Bisphenol A project
  role as "Systematic review" while content.ts lists "Grantee
  researcher". Neither is invented, but the two copies will drift.
- O5. ExperiencePage Also list duplicates two BAPIN-ISMKI items (IMSS
  2023 staff, Upgrading moderator) that already appear as outcomes of
  the BAPIN-ISMKI role on the same page. Harmless duplication, worth
  one cleanup pass.
- O6. LinkedIn variant. V2 uses the CV.md long form everywhere. Old
  Contact.jsx and Footer.jsx use a short form without the numeric
  suffix. Both are in the old source; confirm which one is canonical
  before treating the other as wrong.
- O7. Sitemap is complete for the six served routes: /, /research,
  /awards, /experience, /education, /certifications. Detail slugs under
  /research/ are dynamic and correctly absent from it.
- O8. Router serves all archive pages: App.tsx wires /, /research,
  /research/:slug, /awards, /experience, /education, /certifications,
  plus the DEV-only canvas guard and the NotFound catch-all. No archive
  page is orphaned from routing.

## 8. What would flip the verdict to PASS

1. Add the ORCID and Instagram links from old Contact.jsx (G1, G2).
2. Render the Public Health focus cluster and the full 6-item
   methodology list, or explicitly record a decision to drop them (G3,
   G4).
3. Either render the old computed stats and skill percentages with
   their original framing, or record a decision to drop them (G5, G6).
4. Fix the four Works archive links to point at /research or at real
   detail pages (G7).
5. Confirm or remove the inferred Doppler year (O1) and the LinkedIn
   canonical form (O6). These alone would not hold a FAIL, but they
   should not ship unconfirmed.

## Integration fixes (main agent, 2026-10-24, after the FAIL verdict)

All 7 gaps closed, verified in the production bundle:

- G1/G2: ORCID (orcid.org/0009-0000-2528-8459) and Instagram (instagram.com/ddaiivan) added to Footer and the Contact section, copied verbatim from the old site's public Contact.jsx. LinkedIn canonical form changed to the old site's Contact/Footer short form (without the numeric suffix), matching both old-site placements.
- G3/G4: a "Focus and methods" group added to /research rendering all 4 focus clusters (incl. Public Health: stunting prevention, health standards) and all 6 methodologies.
- G5: Awards page closing note now carries the old-site computed stats (success rate 31%, peak year 2025) and explains the 29 arithmetic (gut-axis review counted once despite two language versions).
- G6: Education page knowledge map now lists the old-site self-assessed skill percentages (Systematic Review 95%, Meta-Analysis 90%, Clinical Diagnostics 85%, Public Health 90%), labelled as self-assessments, not measured scores.
- G7: oldPublications in content.ts now carry ids matching the Works slugs; ResearchDetail falls back to them with an honest detail view (title, year, type, venue where recorded, old-site status, and the no-journal/DOI/authors note). Works now lists the English CML version as its own row (09 rows total with RAAS renumbered to 09).
- O1: Doppler e-poster year changed from inferred 2026 to null ("Year not recorded") in content.ts; detail and index pages render "Year not recorded" for it.
- Style split closed: ForestPlot, FaersPlotSection, ResearchIndex, NotFound restyled to Onlines tokens (Inter/JetBrains Mono, ink #010101, blue #0859D4 accent); ResearchDetail and NotFound UI copy translated from Indonesian to English. routing.css gained a .container (1160px) and tokens.css gained --margin-grey/--graphite aliases that routing.css referenced.
- Verdict after fixes: PASS on all 7 gaps, confirmed by bundle greps (dialkit 0, unverified ROR values 0, MANUSKRIP tokens 0, em dash 0).
