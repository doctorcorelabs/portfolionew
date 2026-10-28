# Research 2026: five new papers, implementation record

Base HEAD: 88b7aec. Changed files: src/App.tsx, src/data/content.ts,
src/pages/ResearchDetail.tsx, src/pages/ResearchIndex.tsx,
src/sections/Manifesto.tsx, src/sections/Services.tsx,
src/sections/Works.tsx, plus new src/components/ResearchVisuals.tsx.
No commit, no push. Build passes (tsc plus vite, 8.83s).

## The five papers

All five are 2026, all carry a journal-level Scopus marker (see the
wording rule below), and each detail page has Abstract, Method, Results
with a native SVG visual, Limitations, and a DOI link. Order on the
research index and in Works is newest first.

1. bpa-hormone-disorders: Association of Bisphenol A exposure on
   hormone-associated benign and malignant disorders, Toxicology
   Letters 426 (2026) 113213, DOI 10.1016/j.toxlet.2026.113213.
   Systematic review and meta-analysis, 22 case-control studies pooled.
   Headline: higher BPA in PCOS, breast cancer, and benign endometrial
   disorders, with considerable heterogeneity, so association, not
   proof of causation.
2. echinometra-lucunter-nsclc: Integrated Bioinformatics Analysis of
   Marine-Derived Peptides from Echinometra lucunter as Multi-Target
   Inhibitors in Non-Small Cell Lung Cancer, Tropical Journal of
   Natural Product Research 10(9): 11744-11751,
   DOI 10.26538/tjnpr/v10i9.40. In silico only. Peptide A (FLMLVDGHN)
   strongest on EGFR, BRAF V600E, VEGFR2, and AKT1.
3. amomum-cardamomum-breast-cancer: Exploration of Compounds Identified
   from Amomum cardamomum Seed Extract, F1000Research 14:1374,
   version 2, DOI 10.12688/f1000research.168214.2. LC-MS found 22
   compounds; leads C17 and C20 against TNF, SRC, EGFR, and CASP3.
   Computational prediction only.
4. lytechinus-variegatus-obesity: Integrated In silico Analysis of
   Multi-Target Marine-Derived Peptide from Lytechinus variegatus as a
   Potential Anti-Obesity Therapeutic, Tropical Journal of Natural
   Product Research 10(4): 8729-8740, DOI 10.26538/tjnpr/v10i4.57.
   In silico only. Peptide 7 (VDSAHA) beat every reference inhibitor on
   all five targets; toxicity is reported from the table (ProTox
   Class 4), not the abstract wording.
5. mirna-endometrial-cancer: Diagnostic Performance of Micro-RNAs as
   Biomarkers for Endometrial Cancer, F1000Research 15:530,
   DOI 10.12688/f1000research.179155.1. Diagnostic meta-analysis,
   12 articles, 52 studies, 1098 cases, 957 controls. Sensitivity
   0.86, specificity 0.81, AUC 0.91. Framed as a triage aid, not a
   biopsy replacement.

New data fields on ResearchItem: methodText, resultsText,
limitationsText, visual, scopusJournal. ResearchDetail renders the
generic fields and keeps the FAERS special case intact.

## The five visuals (native SVG, ResearchVisuals.tsx)

BPA: forest-plot-style bars with SMD points and 95 percent CI whiskers
plus a screening-flow strip. Echinometra: hub-spoke diagram with
Peptide A at the center. Amomum: compound-to-target network with hub
centrality values and lead paths. Lytechinus: paired affinity bars
plus a 50 ns stability strip. miRNA: sensitivity and specificity bars
with an AUC badge and a panel-versus-single and serum-versus-plasma
comparison strip. All use site tokens only (ink, graphite, paper,
hairline, muted, one blue accent), square corners, no gradients, no
chart library.

## Works renumbering

Featured rows are now 01-09: the five new papers first, then FAERS,
StrokeSense AI Lab, StrokeSense, and cerclage. Archive rows are 10-13
with no gaps or duplicates. The old Amomum archive row is dropped from
Works only, with an explanatory note on the new 2026 entry; its detail
page stays reachable from the research index old-site list, so the
study appears once on the homepage, as the 2026 version.

## Cross-section updates

ResearchIndex intro gains a pointer line naming the five new 2026
papers. Manifesto 2026 station appends the same five titles. Services
Research column extends two lines to cover endocrine disruption and
obesity plus lung cancer. No other section copy changed.

## English sweep

Translated user-visible strings: App.tsx loading fallback to "Loading
section...", ResearchIndex breadcrumb to "Home" and "/ Research", and
the ResearchIndex H1 to "Research.". Kept untranslated, as required:
the verbatim Indonesian gut-axis CML title, "Pelantikan dan
Pengambilan Sumpah Dokter FK UII Periode LIX", "Beasiswa Unggulan",
institution and program names, "Ngobrol Bareng Bupati", "koas", and
"dr.".

## Scope decisions

Old-site counts are untouched, per the user's focus on these five
papers only: Profile still shows 29 and 4, Manifesto line 94 still
reads "Four publications recorded.", siteStats stays 29/4, and no
publications total was added anywhere. FAERS plot data is untouched
with only the 3 verified rows. The Scopus marker is journal-level
only: the wording is "Scopus-indexed journal" plus a note that the
page does not claim the individual article is indexed. No new
dependencies.

## QA verdicts

Layout SHIP. Visual CONDITIONAL SHIP, disclosure-only: desktop
Amomum dashed route lines cross near hub boxes; mobile Echinometra
dashed connectors appear only above the top card row; rendered label
fit is preview-only. Regression CONDITIONAL SHIP: its condition was
the miRNA limitations sentence printing an erroneous AUC interval
value; the parent fixed it, and integration re-verified the value is
absent from all of src. Mobile-plus-contrast CONDITIONAL SHIP,
disclosure-only: muted #98989C secondary labels sit below AA for
small text, matching existing site tokens; wrapped-line appearance is
preview-only. English-and-device CONDITIONAL SHIP, disclosure-only:
rendered line breaks and SVG appearance are preview-only since the
sandbox cannot render. No blockers remain.

## Live checks still owed on the user preview

Rendered wrapping of the extended Services lines; stacked mobile SVG
appearance on all five detail pages; Amomum route-line crossings on
desktop; Echinometra mobile connectors; Works meta wrapping at 320px;
all five detail pages on phone, tablet, and desktop.
