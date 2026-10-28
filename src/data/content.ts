/**
 * Verified portfolio content for the DaivanLabs rebuild.
 *
 * Sources: research/08-inventaris-riset.md and research/14-copy-draft.md
 * (both built from the live daivanlabs.com content and the documented
 * project record, 24 Oct 2026).
 *
 * Hard rules enforced in this file:
 * - No invented DOI, journal name, result figure, or ROR-to-drug mapping.
 * - FAERS ROR values are stored raw and UNLABELLED only, with
 *   rorUnverified set to true. Components must NOT render labelled ROR
 *   values are displayed only through src/data/faers-plot.json (verified rows only)
 *   mapping, produced by the verification agent. That file did not exist
 *   when this file was written, so canDisplayLabelledRor is false.
 * - The cerclage SR/MA item carries no result numbers at all.
 * - No secret, key, token, or private credential appears here.
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type ResearchStatus =
  | "poster accepted"
  | "live"
  | "manuscript in progress"
  | "archive"
  | "published";

export interface Profile {
  name: string;
  headline: string;
  /** Current status line. The old "fourth year undergraduate" wording is retired. */
  statusLine: string;
  subline: string;
  supportingLine: string;
  primaryCta: string;
  metaStrip: string[];
  principle: string;
  principleTranslation: string;
  tagline: string;
  taglineExpanded: string;
  location: string;
  university: string;
  interests: string[];
  email: string;
}

export interface FaersData {
  /** Total reports in the analysed sample, as recorded in the poster audit. */
  sampleSize: number;
  /** Total reports before the analysis-set filter, as recorded in docs/faers-verification.md (6,601 of 7,519). Anchors the homepage "7,519 reports to 6,601 analysis set" flow line. */
  totalReports: number;
  /** True while any ROR row remains unverified (see docs/faers-verified.json). */
  rorUnverified: boolean;
  /**
   * A percentage figure recorded in the project notes without a verified
   * comparator. It is flagged unverified and must NOT be displayed as a
   * result until its comparator is confirmed from the manuscript or the
   * final poster.
   */
  percentChangeUnverified: {
    verified: boolean;
    displayAllowed: boolean;
  };
  /** Aprocitentan cohort, recorded as sentinel and exploratory. */
  aprocitentanCohort: {
    n: number;
    note: string;
  };
  /** Honesty framing that must accompany any FAERS display. */
  honestyNote: string;
}

export interface ResearchItem {
  id: string;
  kicker: string;
  shortTitle: string;
  /** Full title exactly as submitted or recorded, where one exists. */
  fullTitle?: string;
  description: string;
  status: ResearchStatus;
  venue: string;
  year: number | null; // null = year not recorded in the sources
  role: string;
  coAuthors?: string[];
  linkLabel: string;
  linkUrl?: string;
  /** Discussion sections for detail pages. Rendered when present. */
  methodText?: string;
  resultsText?: string;
  limitationsText?: string;
  /** Key of the native SVG visual rendered in the Results section. */
  visual?: "bpa" | "echinometra" | "amomum" | "lytechinus" | "mirna";
  /** True when the journal (not the individual article) is verified Scopus-indexed. */
  scopusJournal?: boolean;
  /** Present only on the FAERS item. */
  faers?: FaersData;
  /** Guardrail notes for components. Never render these as marketing copy. */
  notes?: string[];
}

export interface Award {
  title: string;
  awardingBody: string;
  year: number;
}

export interface EducationItem {
  institution: string;
  program: string;
  period: string;
  detail: string;
}

export interface TimelineMilestone {
  date: string;
  title: string;
  detail: string;
  category: "education" | "research" | "lab" | "award" | "experience";
}

export interface ToolItem {
  id: string;
  name: string;
  description: string;
  url: string;
  repo: string;
  status: string;
  honestyNote?: string;
}

export interface Certification {
  title: string;
  issuer: string;
  year: number;
}

// ---------------------------------------------------------------------------
// Gate for labelled FAERS ROR display
// ---------------------------------------------------------------------------

/**
 * False while docs/faers-verified.json is absent. The verification
 * agent flips this to true only together with landing that file with a
 * verified drug and outcome mapping for every ROR value.
 */
export const canDisplayLabelledRor = false;

// ---------------------------------------------------------------------------
// Profile
// ---------------------------------------------------------------------------

export const profile: Profile = {
  name: "Daivan Febri Juan Setiya",
  headline: "research.",
  statusLine:
    "Clinical clerk (koas), surgery rotation since 5 October 2026",
  subline:
    "I am Daivan Febri Juan Setiya, a clinical clerk (koas) and researcher in Indonesia, on surgery rotation since 5 October 2026. I study health questions and build tools around them, through DaivanLabs.",
  supportingLine: "Founder, DaivanLabs. Code for Cure.",
  primaryCta: "See the research",
  metaStrip: ["Medicine", "Research", "Public Health", "Cancer"],
  principle: "Ad maiora natus sum",
  principleTranslation: "born for greater things",
  tagline: "Code for Cure",
  taglineExpanded: "Code, Cure, Connect",
  location: "Indonesia",
  university: "Islamic University of Indonesia",
  interests: ["Research", "Public Health", "Cancer"],
  email: "daivanfebrijuansetiya@gmail.com",
};

// ---------------------------------------------------------------------------
// Research items (featured first, then archive)
// ---------------------------------------------------------------------------

export const researchItems: ResearchItem[] = [
  {
    id: "bpa-hormone-disorders",
    kicker: "Systematic review and meta-analysis",
    shortTitle: "Bisphenol A and hormone-related disorders",
    fullTitle:
      "Association of Bisphenol A exposure on hormone-associated benign and malignant disorders: A systematic review and meta-analysis",
    description:
      "Bisphenol A (BPA) is common in plastics and food packaging, and it can mimic estrogen in the body. This review asked whether higher BPA exposure is linked to hormone-related conditions such as PCOS, breast cancer, and endometrial disorders. Pooling 22 case-control studies, it found higher BPA levels in people with PCOS, breast cancer, and benign endometrial disorders than in controls, but results varied widely between studies, so this is evidence of association, not proof of causation.",
    status: "published",
    venue: "Toxicology Letters",
    year: 2026,
    role: "Co-author, 3rd of 8",
    linkLabel: "Read the paper",
    linkUrl: "https://doi.org/10.1016/j.toxlet.2026.113213",
    methodText:
      "The team searched PubMed and EBSCO from inception to February 2024 following PRISMA, with the protocol registered on PROSPERO (CRD42024530177). From 1095 records, 44 studies entered the qualitative synthesis and 22 case-control studies entered the meta-analysis, analyzed with a random-effects model in RevMan 5.4.",
    resultsText:
      "Pooled standardized mean differences showed higher BPA in cases for PCOS (1.19, 95% CI 0.70 to 1.67), benign endometrial disorders (0.94, 0.15 to 1.73), and breast cancer (0.68, 0.44 to 0.92). Endometrial cancer showed no clear difference (-0.28, -1.15 to 0.59, p 0.53). Heterogeneity was considerable (I-squared 93% for PCOS, 95% for benign endometrial disorders), so read the pooled numbers as averages over diverse studies, not precise effects.",
    limitationsText:
      "Small case and control groups, different sample types and lab methods, and possible publication bias limit confidence. Evidence on BPA analogs and prostate cancer was too thin to pool. Funded by the Faculty of Medicine UII Systematic Review Grant 2024.",
    visual: "bpa",
    scopusJournal: true,
    notes: [
      "Published 2026, Toxicology Letters 426, article 113213, online 19 October 2026.",
      "Journal verified Scopus-indexed (coverage 1977-2026, Q2). This is a journal-level verification; the page does not claim the individual article is indexed.",
    ],
  },
  {
    id: "echinometra-lucunter-nsclc",
    kicker: "Bioinformatics, multi-target",
    shortTitle: "Sea urchin peptides against lung cancer",
    fullTitle:
      "Integrated Bioinformatics Analysis of Marine-Derived Peptides from Echinometra lucunter as Multi-Target Inhibitors in Non-Small Cell Lung Cancer",
    description:
      "Non-small cell lung cancer is often driven by several signaling pathways at once, so blocking one protein is rarely enough. This study screened 13 short peptides from the sea urchin Echinometra lucunter against four cancer drivers: EGFR, BRAF V600E, VEGFR2, and AKT1. One candidate, peptide A (FLMLVDGHN), bound more strongly than the reference inhibitor on all four targets, but this is simulation only and no lab test has confirmed it yet.",
    status: "published",
    venue: "Tropical Journal of Natural Product Research",
    year: 2026,
    role: "Co-author, 6th of 14",
    linkLabel: "Read the paper",
    linkUrl: "https://doi.org/10.26538/tjnpr/v10i9.40",
    methodText:
      "Peptide shapes were built in UCSF Chimera and MOE 2022.02, toxicity and half-life predicted with ToxinPred, PlifePred, and CellPPD, docking run in MOE with redocking validation (all RMSD under 2.0 A), and stability checked with 50 ns dynamics in YASARA.",
    resultsText:
      "Peptide A versus reference inhibitor: EGFR -10.17 vs -8.06 (erlotinib), BRAF V600E -10.60 vs -7.66 (vemurafenib), VEGFR2 -10.33 vs -8.43, AKT1 -11.79 vs -8.22 (ipatasertib) kcal/mol. Mean RMSD over 50 ns favored VEGFR2 (1.88 A) and EGFR (2.11 A) over AKT1 (2.99 A) and BRAF (3.17 A). All 13 peptides were predicted non-toxic and non-cell-penetrating, with blood half-life 714.01 to 852.11 seconds.",
    limitationsText:
      "Findings are entirely computational, and a 50 ns simulation cannot capture slower rearrangements, cell uptake, enzyme breakdown, or effects in a tumor environment. The non-cell-penetrating prediction also means delivery into cells would need formulation work.",
    visual: "echinometra",
    scopusJournal: true,
    notes: [
      "Published online 1 October 2026, Tropical Journal of Natural Product Research 10(9), pages 11744 to 11751.",
      "Journal verified Scopus-indexed (Q3). This is a journal-level verification; the page does not claim the individual article is indexed.",
      "For the VEGFR2 reference, the page names it neutrally as reference inhibitor because the paper text and table disagree on the name. The vemurafenib value used is the Table 4 value -7.66, not the text value -7.96.",
      "Peptide M has no docking row in the paper, so only 12 peptides have reported docking scores.",
    ],
  },
  {
    id: "amomum-cardamomum-breast-cancer",
    kicker: "Computational drug discovery",
    shortTitle: "Java cardamom compounds for breast cancer",
    fullTitle:
      "Exploration of Compounds Identified from Amomum cardamomum Seed Extract: LC-MS Profiling, Network Pharmacology, and Computational Analyses for Innovative Multi-Targeted Breast Cancer Therapy",
    description:
      "Seeds of Amomum cardamomum (Java cardamom) may hit breast cancer from several angles at once. The team profiled the seed extract, mapped its compounds onto breast cancer biology, and tested the best candidates by computer simulation. Two compounds, C17 and C20, emerged as leads that bind and stay stable on four key cancer proteins. All of this is still prediction: no cell or animal test has confirmed it yet.",
    status: "published",
    venue: "F1000Research",
    year: 2026,
    role: "Co-author, 10th of 17",
    linkLabel: "Read the paper",
    linkUrl: "https://doi.org/10.12688/f1000research.168214.2",
    methodText:
      "LC-MS profiling identified 22 compounds, then network pharmacology (SwissTargetPrediction, STRING, Cytoscape, DAVID) narrowed them to 36 shared targets. Docking in MOE 2022.02 and 50 ns molecular dynamics in YASARA tested the leads against TNF, SRC, EGFR, and CASP3, with ADMET predicted by SwissADME and ProTox-II.",
    resultsText:
      "C20 beat its control on SRC (-8.58 vs -7.89 kcal/mol) and nearly matched erlotinib on EGFR (-6.43 vs -6.47); C17 beat its control on Casp3 (-6.70 vs -6.53) and nearly matched its control on TNF-alpha (-6.91 vs -7.00). Hub centrality ranked TNF (28.35) and SRC (27.13) far above EGFR (4.39) and CASP3 (2.87). Twenty of 22 compounds met Lipinski drug-likeness rules.",
    limitationsText:
      "Docking cannot prove inhibition or efficacy, and the LC-MS identifications are putative database annotations, not confirmed structures. The study does not separate breast cancer subtypes, and experimental validation in cells and animals is still required.",
    visual: "amomum",
    scopusJournal: true,
    notes: [
      "F1000Research 14:1374, version 2 (peer review: 1 approved, 2 approved with reservations), updated 20 October 2026.",
      "Journal verified Scopus-indexed (Active, coverage 2012-2026). This is a journal-level verification; the page does not claim the individual article is indexed.",
      "This 2026 journal version is the same study as the old-site archive record amomum-cardamomum-breast-cancer-therapy; the old record is kept on the research index, but its Works row is dropped so the homepage shows the study once, as the 2026 version.",
    ],
  },
  {
    id: "lytechinus-variegatus-obesity",
    kicker: "In silico peptide study",
    shortTitle: "Sea urchin peptides against obesity",
    fullTitle:
      "Integrated In silico Analysis of Multi-Target Marine-Derived Peptide from Lytechinus variegatus as a Potential Anti-Obesity Therapeutic",
    description:
      "Obesity involves appetite, fat metabolism, and energy balance together, so a single-target drug often falls short. This study tested 11 peptides from the sea urchin Lytechinus variegatus against five obesity targets at once, entirely by computer simulation. One candidate, peptide 7 (VDSAHA), bound more strongly than the reference inhibitor on every target. It is a promising lead on screen, not a treatment: lab and animal tests are still needed.",
    status: "published",
    venue: "Tropical Journal of Natural Product Research",
    year: 2026,
    role: "Co-author, 3rd of 13",
    linkLabel: "Read the paper",
    linkUrl: "https://doi.org/10.26538/tjnpr/v10i4.57",
    methodText:
      "Peptide structures were prepared in MOE 2022.02, ADME predicted with SwissADME, toxicity with ProTox v3.0, docking validated by redocking, dynamics run for 50 ns in YASARA, and membrane permeability modeled with the PerMM server.",
    resultsText:
      "Peptide 7 beat every reference inhibitor: FTO -8.95 vs -6.26, HPL -7.96 vs -6.44, PPARgamma -10.09 vs -9.12, PTP1B -7.84 vs -6.40, CB1 -10.72 vs -10.09 kcal/mol. Complexes stayed stable over 50 ns for FTO, PTP1B, and PPARgamma (about 1.0 to 1.5 A RMSD), less so for HPL (about 2.5 A) and CB1 (about 4.5 A). The catch: predicted oral bioavailability is poor, and the PerMM profile shows a steep energy barrier of about 35 kcal/mol at the membrane center, so delivery would be a problem to solve.",
    limitationsText:
      "Everything here is computational; enzyme breakdown, real membrane crossing, and safety in a living system are untested. Toxicity prediction places peptide 7 in ProTox Class 4 (harmful) with LD50 3000 mg/kg, so this page does not call it non-toxic.",
    visual: "lytechinus",
    scopusJournal: true,
    notes: [
      "Published online 1 May 2026, Tropical Journal of Natural Product Research 10(4), pages 8729 to 8740.",
      "Journal verified Scopus-indexed (Q3). This is a journal-level verification; the page does not claim the individual article is indexed.",
      "Peptide 7 was chosen for consistency across all five targets, not for the strongest score on each target.",
    ],
  },
  {
    id: "mirna-endometrial-cancer",
    kicker: "Diagnostic meta-analysis",
    shortTitle: "miRNA tests for endometrial cancer",
    fullTitle:
      "Diagnostic Performance of Micro-RNAs as Biomarkers for Endometrial Cancer: A Systematic Review and Meta-Analysis",
    description:
      "Endometrial cancer is usually confirmed by biopsy, an invasive step many women with bleeding would rather avoid. This meta-analysis asked how well tiny RNA molecules (miRNAs) measured in blood or tissue can flag the disease. Across 52 studies, miRNAs caught most cancers and kept false positives modest, with blood serum and multi-miRNA panels performing best. The honest framing is triage aid, not biopsy replacement: the underlying studies were mostly small and retrospective.",
    status: "published",
    venue: "F1000Research",
    year: 2026,
    role: "Co-author, 7th of 18",
    linkLabel: "Read the paper",
    linkUrl: "https://doi.org/10.12688/f1000research.179155.1",
    methodText:
      "The team searched PubMed/MEDLINE, ScienceDirect, Embase, and Web of Science to August 2025 under a PROSPERO protocol (CRD420261280267), following PRISMA 2020. Twelve articles covering 52 studies (1098 cases, 957 controls) were pooled with a bivariate random-effects model in Stata/BE 18.0, using histopathology as the reference standard.",
    resultsText:
      "Pooled sensitivity was 0.86 (0.82 to 0.89) and specificity 0.81 (0.75 to 0.85), with AUC 0.91 and diagnostic odds ratio 20.9. Panels beat single miRNAs (0.90/0.93 vs 0.85/0.75) and serum beat plasma (0.91/0.92 vs 0.71/0.81). In plain terms, at a 25% pre-test probability a positive test raises the probability to 60% while a negative test drops it to 5%.",
    limitationsText:
      "Heterogeneity was substantial (I-squared 77.30% for sensitivity, 81.99% for specificity) because platforms, sample types, and normalization methods differed. Most studies were retrospective case-control designs that can overstate accuracy, so prospective studies with standard protocols are still needed.",
    visual: "mirna",
    scopusJournal: true,
    notes: [
      "F1000Research 15:530, version 1 (peer review: 1 approved with reservations, 1 not approved), first published 16 April 2026.",
      "Journal verified Scopus-indexed (Active, coverage 2012-2026). This is a journal-level verification; the page does not claim the individual article is indexed.",
      "The paper's printed AUC confidence interval is not shown: it looks like a typesetting error in the paper. Search record counts from the PRISMA figure are not shown: they are not stated in extractable text.",
    ],
  },
  {
    id: "faers-resistant-hypertension",
    kicker: "Pharmacovigilance - FAERS analysis",
    shortTitle: "Comparative safety of newer therapies in resistant hypertension",
    fullTitle:
      "Comparative Safety of Next-Generation Non-Steroidal MRA (Finerenone), ARNI (Sacubitril/Valsartan), and Sentinel Dual ERA (Aprocitentan) Versus Conventional Regimens in Resistant Hypertension: A Disproportionality and Time-to-Onset Analysis from FDA FAERS",
    description:
      "How do finerenone, sacubitril/valsartan, and aprocitentan compare with conventional regimens on reported adverse events in resistant hypertension? This study uses disproportionality and time-to-onset analysis on reports from the FDA Adverse Event Reporting System (FAERS) to look for safety signals that deserve closer study.",
    status: "poster accepted",
    venue: "Hypertension Seoul 2026, Korean Society of Hypertension annual congress, Conrad Seoul, 5 to 7 November 2026",
    year: 2026,
    role: "Lead researcher and poster presenter",
    coAuthors: ["Dinda Ashilah Putri Kusnan"],
    linkLabel: "Read the study",
    faers: {
      sampleSize: 6601,
      totalReports: 7519,
      rorUnverified: true,
      percentChangeUnverified: {
        verified: false,
        displayAllowed: false,
      },
      aprocitentanCohort: {
        n: 17,
        note: "Sentinel and exploratory cohort, as recorded in the poster Q and A sheet of 12 Oct 2026.",
      },
      honestyNote:
        "ROR measures disproportionality of reporting, not clinical risk and not causality. FAERS analysis is hypothesis-generating.",
    },
    notes: [
      "Abstract accepted as a poster, poster code ABST-000034, final poster version v3.",
      "Do NOT publish any ROR row until it is verified in docs/faers-verified.json and copied to src/data/faers-plot.json.",
      "Do NOT display the unverified percentage figure as a result.",
      "No DOI and no journal are recorded for this item in the sources, so none are shown.",
    ],
  },
  {
    id: "strokesense-ai-lab",
    kicker: "Health technology - Stroke education",
    shortTitle: "StrokeSense AI Lab",
    description:
      "Stroke care depends on fast recognition, and fast recognition depends on what the public knows. StrokeSense AI Lab explores interactive ways to teach stroke signs and first response, with an AI-assisted lab for asking questions and checking observations.",
    status: "live",
    venue: "DaivanLabs, strokesenseai.daivanlabs.com",
    year: 2026,
    role: "Creator and owner, under DaivanLabs",
    linkLabel: "Explore the project",
    linkUrl: "https://strokesenseai.daivanlabs.com",
    notes: [
      "R1 rebuild live 22 Oct 2026: 28 features reduced to 13 user-facing features, Ask the Lab as the single AI entry point, FAST Live Check as flagship.",
      "Honesty note that must accompany the tool: upload results are AI interpretation of images, not MediaPipe measurement. FAST output is an Observation Sheet without a score and without a diagnosis.",
      "Deployment is recorded as temporary, for a competition.",
    ],
  },
  {
    id: "strokesense-education-first",
    kicker: "Health technology - Stroke education",
    shortTitle: "StrokeSense",
    description:
      "StrokeSense is a web project that explores interactive ways to teach stroke signs and first response, so learning the material is more active than reading a leaflet.",
    status: "live",
    venue: "DaivanLabs",
    year: 2026,
    role: "Creator",
    linkLabel: "Explore the project",
    notes: [
      "Education-first framing only. Modules recorded: Brain Lab 3D with 14 modules, Movement Lab, Simulator, DocumentLens, CarePlan, Neuro, FAST.",
      "Do NOT cite symmetry scores or central versus Bell palsy classification from Face Lab. An audit of 20 Oct 2026 found those claims conflict with the education-first scope.",
    ],
  },
  {
    id: "cerclage-twin-pregnancies",
    kicker: "Clinical research - Systematic review and meta-analysis",
    shortTitle: "Emergency cervical cerclage in twin pregnancies",
    fullTitle:
      "Pregnancy Outcomes and Clinical Predictors of Success Following Emergency Cervical Cerclage in Twin Pregnancies",
    description:
      "What are the pregnancy outcomes and clinical predictors of success following emergency cervical cerclage in twin pregnancies? Daivan contributed a deep analysis of Table 1 to this collaborative systematic review and meta-analysis.",
    status: "manuscript in progress",
    venue: "Collaborative manuscript, Results writing team",
    year: 2026,
    role: "Deep analysis of Table 1, completed 18 Oct 2026",
    linkLabel: "Read the study",
    notes: [
      "No result numbers are recorded for this item in the sources, so none are shown.",
      "Group deadline of 19 Oct 2026 passed; delivery of the Table 1 draft to the group is unconfirmed in the sources.",
      "Must be labelled manuscript in progress, never as a publication.",
    ],
  },
  {
    id: "ophthalmic-artery-doppler-poster",
    kicker: "Archive - e-poster",
    shortTitle: "Ophthalmic Artery Doppler e-poster",
    description:
      "An e-poster on Ophthalmic Artery Doppler, code ABST-000171, held in archive until Daivan's role and the full title are confirmed.",
    status: "archive",
    venue: "e-poster ABST-000171",
    year: null,
    role: "Role unconfirmed in the sources",
    linkLabel: "Read the study",
    notes: [
      "Year not recorded in the sources.",
      "Dinda Ashilah Putri Kusnan is recorded as corresponding author. Daivan's role is not detailed in the sources.",
      "Do not promote this item to featured until the role and full title are confirmed.",
    ],
  },
];

// ---------------------------------------------------------------------------
// Awards
// ---------------------------------------------------------------------------

export const awards: Award[] = [
  {
    title: "Most Outstanding Student 2025",
    awardingBody: "Islamic University of Indonesia",
    year: 2025,
  },
  {
    title: "Gold Medal, International Science and Invention Fair (ISIF)",
    awardingBody: "International Science and Invention Fair",
    year: 2025,
  },
  {
    title: "Gold Medal, World Robotics and Computer Science Olympiad (WRCSO)",
    awardingBody: "World Robotics and Computer Science Olympiad",
    year: 2025,
  },
  {
    title: "Beasiswa Unggulan Awardee",
    awardingBody:
      "Ministry of Education, Culture, Research, and Technology",
    year: 2023,
  },
];

// ---------------------------------------------------------------------------
// Education
// ---------------------------------------------------------------------------

export const education: EducationItem[] = [
  {
    institution: "Islamic University of Indonesia",
    program: "Bachelor of Medicine",
    period: "2021 to present",
    detail: "GPA 3.91 out of 4.0. Most Outstanding Student 2025 and Beasiswa Unggulan Awardee.",
  },
  {
    institution: "Chulalongkorn University",
    program: "Summer School Program",
    period: "2025",
    detail:
      "Intensive training in Pharmaceutical and Clinical Development (AASP-PECT).",
  },
  {
    institution: "SMAN 1 Blora",
    program: "Senior High School",
    period: "Graduated",
    detail:
      "Top 3 Student and 3rd Most Outstanding Student based on the final exam.",
  },
];

// ---------------------------------------------------------------------------
// Timeline milestones
// ---------------------------------------------------------------------------

export const timeline: TimelineMilestone[] = [
  {
    date: "2021",
    title: "Bachelor of Medicine begins",
    detail: "Islamic University of Indonesia, ongoing.",
    category: "education",
  },
  {
    date: "2023",
    title: "Beasiswa Unggulan Awardee",
    detail:
      "Ministry of Education, Culture, Research, and Technology scholarship.",
    category: "award",
  },
  {
    date: "Sep 2024 to Feb 2025",
    title: "Speaker and Mentor, KampusInovatif.id",
    detail:
      "Shared guidance on applying for the Beasiswa Unggulan scholarship.",
    category: "experience",
  },
  {
    date: "June 2025",
    title: "DaivanLabs founded",
    detail:
      "Research lab applying coding skills to healthcare-related tools and building professional connections.",
    category: "lab",
  },
  {
    date: "2025",
    title: "Chulalongkorn Summer School",
    detail:
      "Pharmaceutical and Clinical Development (AASP-PECT), Thailand.",
    category: "education",
  },
  {
    date: "2025",
    title: "Most Outstanding Student, ISIF Gold, WRCSO Gold",
    detail:
      "Islamic University of Indonesia, International Science and Invention Fair, World Robotics and Computer Science Olympiad.",
    category: "award",
  },
  {
    date: "5 Oct 2026",
    title: "Clinical clerkship, surgery rotation begins",
    detail: "Co-assistant rotation in surgery.",
    category: "education",
  },
  {
    date: "5 to 7 Nov 2026",
    title: "Hypertension Seoul 2026 poster",
    detail:
      "FAERS resistant hypertension study presented as poster ABST-000034 at Conrad Seoul.",
    category: "research",
  },
];

// ---------------------------------------------------------------------------
// Tools
// ---------------------------------------------------------------------------

export const tools: ToolItem[] = [
  {
    id: "strokesense-ai-lab",
    name: "StrokeSense AI Lab",
    description:
      "AI-assisted stroke education lab: Ask the Lab as a single AI entry point and FAST Live Check producing an Observation Sheet.",
    url: "https://strokesenseai.daivanlabs.com",
    repo: "doctorcorelabs/strokesenseai",
    status: "Live, temporary deployment for a competition",
    honestyNote:
      "Upload results are AI interpretation of images, not MediaPipe measurement. FAST output carries no score and no diagnosis.",
  },
  {
    id: "strokesense",
    name: "StrokeSense",
    description:
      "Education-first stroke learning web project with interactive labs for signs and first response.",
    // Live URL not recorded in the sources. Do not copy the AI Lab URL here.
    url: "",
    repo: "doctorcorelabs/strokesense",
    status: "Live",
    honestyNote:
      "Education tool language only. Do not describe it as detecting, diagnosing, or treating stroke.",
  },
];

// ---------------------------------------------------------------------------
// Certifications (archive, from the live site, all 2024)
// ---------------------------------------------------------------------------

export const certifications: Certification[] = [
  {
    title: "Antimicrobial Resistance and Infection Prevention and Control",
    issuer: "World Health Organization (WHO)",
    year: 2024,
  },
  {
    title: "Inequality Monitoring in Sexual Reproductive Health",
    issuer: "World Health Organization (WHO)",
    year: 2024,
  },
  {
    title: "Gender Equality and Human Rights in Climate Action",
    issuer: "UNITAR",
    year: 2024,
  },
  {
    title: "Chemicals and Health",
    issuer: "The Johns Hopkins University",
    year: 2024,
  },
];

// ---------------------------------------------------------------------------
// FULL OLD-SITE CONTENT (v2 data task)
// Source of truth: old-site-source/CV.md, cross-checked against the old
// components and pages in old-site-source/src. Nothing below invents a
// journal name, DOI, volume, or co-author list: where the old site records
// none, the field is an empty string with a comment saying so.
// No phone number and no home address from CV.md appears anywhere here.
// ---------------------------------------------------------------------------

export interface OldPublication {
  id: string;
  title: string;
  year: number;
  /** Type as recorded on the old site (JOURNAL, REVIEW, CONFERENCE). */
  type: string;
  /** Venue only where the old site names a real one (IC-CVD). Empty otherwise. */
  venue: string;
  /** Status label as recorded on the old site, NOT independently verified. */
  oldSiteStatus: string;
  /** Why no author list is shown: the old site records authors only as DFJS/DF. */
  authorsNote: string;
  /** Used to label the Indonesian and English versions of the same review. */
  versionNote?: string;
}

export interface ResearchFocus {
  name: string;
  topics: string;
}

export interface KeyProject {
  title: string;
  kind: string;
  role: string;
  description: string;
}

export interface ArchiveAward {
  title: string;
  awardingBody: string;
  year: number;
  /** Category exactly as CV.md groups it (see note on IRPOCO below). */
  category: "national" | "international";
  role?: string;
  note?: string;
}

export interface ExperienceRole {
  role: string;
  organization: string;
  /** Empty string where CV.md records no period for the item. */
  period: string;
  description: string;
  details?: string[];
}

export interface SiteStats {
  totalAwards: number;
  goldMedals: number;
  international: number;
  publicationsOldSite: number;
  certifications: string;
  keyRoles: number;
}

export const LINKEDIN_URL = "https://www.linkedin.com/in/daivan-febri-juan-setiya/";
export const ORCID_URL = "https://orcid.org/0009-0000-2528-8459";
export const INSTAGRAM_URL = "https://www.instagram.com/ddaiivan/";

// ---------------------------------------------------------------------------
// Old publications: all 5 CV.md entries, verbatim titles, in CV.md order.
// The gut-axis CML review appears twice in CV.md (Indonesian and English);
// both versions are kept and labelled, not merged and not deduplicated.
// ---------------------------------------------------------------------------

export const oldPublications: OldPublication[] = [
  {
    id: "amomum-cardamomum-breast-cancer-therapy",
    title:
      "Exploration of Amomum cardamomum Seed-Derived Compounds: LC-MS Profiling, Network Pharmacology, and Computational Analyses for Innovative Multi-Targeted Breast Cancer Therapy",
    year: 2025,
    type: "JOURNAL",
    venue: "",
    oldSiteStatus: "Published",
    authorsNote:
      "Old site records authors only as DFJS and Et al.; no journal name, DOI, volume, or full author list is recorded.",
  },
  {
    id: "gut-axis-chronic-myeloid-leukemia",
    title:
      "Peran Microbiome Gut Axis Dalam Perkembangan Dan Kekambuhan Chronic Myeloid Leukemia: Systematic Review",
    year: 2024,
    type: "REVIEW",
    venue: "",
    oldSiteStatus: "Completed",
    authorsNote:
      "Old site records authors only as DFJS; no journal name, DOI, volume, or full author list is recorded.",
    versionNote: "Indonesian version of the gut-axis CML systematic review.",
  },
  {
    id: "colonoscopy-computer-aided-detection",
    title:
      "A Comparative Analysis Of Colonoscopy With Computer-Aided Detection And Standard Colonoscopy In The Detection Of Colorectal Adenomas And Polyps: A Systematic Review",
    year: 2024,
    type: "REVIEW",
    venue: "",
    oldSiteStatus: "Completed",
    authorsNote:
      "Old site records authors only as DFJS; no journal name, DOI, volume, or full author list is recorded.",
  },
  {
    id: "gut-axis-chronic-myeloid-leukemia-en",
    title:
      "The role of the microbiome gut axis in the development and relapse of chronic myeloid leukemia: Systematic review",
    year: 2024,
    type: "REVIEW",
    venue: "",
    oldSiteStatus: "Completed",
    authorsNote:
      "Old site records authors only as DFJS; no journal name, DOI, volume, or full author list is recorded.",
    versionNote: "English version of the gut-axis CML systematic review.",
  },
  {
    id: "raas-hypertension-ic-cvd",
    title:
      "The Significant Roles of The Renin-Angiotensin-Aldosterone System Metabolism on the Development of Hypertension",
    year: 2024,
    type: "CONFERENCE",
    venue: "The 4th International Conference on Cardiovascular Diseases (IC-CVD)",
    oldSiteStatus: "Presented",
    authorsNote:
      "Old site records authors only as DFJS; no DOI, volume, or full author list is recorded.",
  },
];

// ---------------------------------------------------------------------------
// Research focus (4 clusters) and methodologies (6), from old About page.
// ---------------------------------------------------------------------------

export const researchFocus: ResearchFocus[] = [
  {
    name: "Systematic Review",
    topics: "PCOS, Cancer, Gut Microbiome, and Endocrine Disruption.",
  },
  {
    name: "Drug Discovery",
    topics: "In Silico studies for TB, Breast Cancer, Obesity, and Lung Cancer.",
  },
  {
    name: "Public Health",
    topics: "Stunting prevention and Health Standards.",
  },
  {
    name: "MedTech",
    topics: "AI in Diagnostics (Colonoscopy).",
  },
];

export const methodologies: string[] = [
  "Systematic Review",
  "In Silico",
  "Clinical Research",
  "Public Speaking",
  "Data Analysis",
  "Mentoring",
];

// ---------------------------------------------------------------------------
// Key research projects (4), from the old About page project cards.
// ---------------------------------------------------------------------------

export const keyProjects: KeyProject[] = [
  {
    title: "Dietary Impacts on PCOS",
    kind: "SYSTEMATIC REVIEW",
    role: "Head of Research",
    description:
      "Head of Research examining dietary interventions for women with PCOS.",
  },
  {
    title: "Bisphenol A and Cancer",
    kind: "SYSTEMATIC REVIEW",
    role: "Grantee researcher",
    description:
      "Systematic review on Bisphenol A in food and beverage containers and cancer risk.",
  },
  {
    title: "TB Drug Discovery",
    kind: "IN SILICO STUDY",
    role: "Research Collaborator",
    description:
      "Collaborative research on drug discovery for Tuberculosis.",
  },
  {
    title: "Gut Axis and Leukemia",
    kind: "SYSTEMATIC REVIEW",
    role: "Researcher",
    description:
      "Role of microbiome gut axis in development of Chronic Myeloid Leukemia.",
  },
];

// ---------------------------------------------------------------------------
// Education (full old-site entries). The existing `education` export above
// is left untouched; this array adds the CPDT detail for Chulalongkorn.
// ---------------------------------------------------------------------------

export const educationItems: EducationItem[] = [
  {
    institution: "Islamic University of Indonesia",
    program: "Bachelor of Medicine",
    period: "2021 to present",
    detail:
      "GPA 3.91 out of 4.0. Most Outstanding Student 2025 and Beasiswa Unggulan Awardee.",
  },
  {
    institution: "Chulalongkorn University",
    program: "Summer School Program",
    period: "2025",
    detail:
      "Intensive training in Pharmaceutical and Clinical Development (AASP-PECT / CPDT).",
  },
  {
    institution: "SMAN 1 Blora",
    program: "Senior High School",
    period: "Graduated",
    detail:
      "Top 3 Student and 3rd Most Outstanding Student based on the final exam.",
  },
];

// ---------------------------------------------------------------------------
// Awards archive: every CV.md NATIONAL (13) + INTERNATIONAL (12) item = 25.
// CV.md groups IRPOCO under NATIONAL while describing it as International
// Scale; that grouping is preserved and noted, not silently corrected.
// ---------------------------------------------------------------------------

export const awardsArchive: ArchiveAward[] = [
  {
    title: "3rd Most Outstanding Student LLDIKTI V",
    awardingBody: "LLDIKTI V",
    year: 2025,
    category: "national",
  },
  {
    title: "Most Outstanding Student UII",
    awardingBody: "Islamic University of Indonesia",
    year: 2025,
    category: "national",
  },
  {
    title: "Awardee Beasiswa Unggulan",
    awardingBody:
      "Ministry of Education, Culture, Research, and Technology",
    year: 2023,
    category: "national",
  },
  {
    title: "Head of Research: Dietary Impacts in Women with PCOS",
    awardingBody: "Review Research",
    year: 2024,
    category: "national",
    role: "Head of Research",
  },
  {
    title: "Grant for Systematic Review: Bisphenol A in canned and plastic food/beverage",
    awardingBody:
      "Faculty of Medicine, Universitas Islam Indonesia (led by dr. Eko Andriyanto M.Sc)",
    year: 2024,
    category: "national",
    role: "Grantee researcher",
  },
  {
    title: "Grant for Systematic Review: Bisphenol A on cancers",
    awardingBody:
      "Faculty of Medicine, Universitas Islam Indonesia (led by dr. Kuswati)",
    year: 2024,
    category: "national",
    role: "Grantee researcher",
  },
  {
    title: "Research Collaborator: Drug Discovery In Silico Study Kapulaga on Breast Cancer",
    awardingBody: "Drug Discovery In Silico Study",
    year: 2024,
    category: "national",
    role: "Research Collaborator",
  },
  {
    title: "Research Collaborator: Drug Discovery In Silico Study Tuberculosis",
    awardingBody: "Drug Discovery In Silico Study",
    year: 2024,
    category: "national",
    role: "Research Collaborator",
  },
  {
    title: "Gold Medal and Special Award - Invention and Innovation Fair (IIF)",
    awardingBody: "Invention and Innovation Fair (IIF)",
    year: 2025,
    category: "national",
    role: "1st Author",
  },
  {
    title: "1st Place Scientific Essay - Scientific Fair SMART FK UII",
    awardingBody: "SMART FK UII",
    year: 2023,
    category: "national",
  },
  {
    title: "Bronze Medal - Innovation And Research Poster Competition (IRPOCO)",
    awardingBody: "Innovation And Research Poster Competition (IRPOCO)",
    year: 2023,
    category: "national",
    note: "CV.md lists this under NATIONAL and describes it as International Scale.",
  },
  {
    title: "2nd Winner National Essay - RJJ Undiksha",
    awardingBody: "RJJ Undiksha",
    year: 2023,
    category: "national",
  },
  {
    title: "3rd Most Outstanding Student based on Final Student Examination",
    awardingBody: "Senior High School 1 Blora",
    year: 2021,
    category: "national",
    note: "Year recorded as the high school graduation period; CV.md gives no separate year for this item.",
  },
  {
    title: "Silver Medal - Indonesia International Applied Science Project Olympiad (I2ASPO)",
    awardingBody:
      "Indonesia International Applied Science Project Olympiad (I2ASPO)",
    year: 2025,
    category: "international",
    role: "1st Author",
  },
  {
    title: "Gold Medal - International Science and Invention Fair (ISIF)",
    awardingBody: "International Science and Invention Fair (ISIF)",
    year: 2025,
    category: "international",
    role: "1st Author",
  },
  {
    title: "Travel Grant Recipient - International Congress of Diabetes and Metabolism (ICDM)",
    awardingBody:
      "International Congress of Diabetes and Metabolism (ICDM)",
    year: 2025,
    category: "international",
  },
  {
    title: "Gold Medal - International Invention Competition For Young Moslem Scientists (IICYMS)",
    awardingBody:
      "International Invention Competition For Young Moslem Scientists (IICYMS)",
    year: 2025,
    category: "international",
    role: "1st Author",
  },
  {
    title: "Gold Medal - World Robotics and Computer Science Olympiad (WRCSO)",
    awardingBody: "World Robotics and Computer Science Olympiad (WRCSO)",
    year: 2025,
    category: "international",
    role: "1st Author",
  },
  {
    title: "Silver Medal - Bali International Science Fair (BISF)",
    awardingBody: "Bali International Science Fair (BISF)",
    year: 2025,
    category: "international",
    role: "1st Author",
  },
  {
    title: "Gold Medal - World Science, Environment and Engineering Competition (WSEEC)",
    awardingBody:
      "World Science, Environment and Engineering Competition (WSEEC)",
    year: 2025,
    category: "international",
    role: "1st Author",
  },
  {
    title: "Silver Medal - Jakarta International Science Fair (JISF)",
    awardingBody: "Jakarta International Science Fair (JISF)",
    year: 2025,
    category: "international",
    role: "1st Author",
  },
  {
    title: "Gold Medal - International Science and Invention Fair (ISIF)",
    awardingBody: "International Science and Invention Fair (ISIF)",
    year: 2024,
    category: "international",
    role: "1st Author",
  },
  {
    title: "ePoster Presentation - ENDO 2024, 4th World Congress of GI Endoscopy",
    awardingBody: "ENDO 2024, COEX Convention and Exhibition Center, Seoul, Korea, 4 to 6 July 2024",
    year: 2024,
    category: "international",
    role: "1st Author",
  },
  {
    title: "Poster Presenter - 2024 Korean Society of Hematology International Conference and 65th Annual Meeting (ICKSH 2024)",
    awardingBody: "Korean Society of Hematology",
    year: 2024,
    category: "international",
    role: "1st Author",
  },
  {
    title: "Oral Presentation - The 1st International Conference MYHAM 2024 (Muhammadiyah Yogyakarta - Hospital and Healthcare Management)",
    awardingBody: "MYHAM 2024",
    year: 2024,
    category: "international",
    role: "1st Author",
  },
];

// ---------------------------------------------------------------------------
// Experience: the 8 old Experience roles, plus 2 CV.md-only items.
// Sub-roles recorded only in CV.md are folded into the matching role's
// details instead of becoming invented standalone roles.
// ---------------------------------------------------------------------------

export const experienceRoles: ExperienceRole[] = [
  {
    role: "Founder",
    organization: "DaivanLabs",
    period: "June 2025 to present",
    description:
      "Founder of DaivanLabs, applying coding skills ('Code') to develop healthcare-related tools ('Cure') and build professional connections ('Connect'). Managing project development and operations.",
  },
  {
    role: "Speaker and Mentor",
    organization: "KampusInovatif.id",
    period: "Sep 2024 to Feb 2025",
    description:
      "Served as a speaker and mentor through the KampusInovatif.id platform, sharing insights and guidance on successfully applying for the Beasiswa Unggulan scholarship.",
  },
  {
    role: "Awardee Beasiswa Unggulan",
    organization: "Ministry of Education, Culture, Research, and Technology",
    period: "Oct 2023 to present",
    description:
      "Recipient of the prestigious scholarship 'Beasiswa Unggulan' awarded by the Indonesian Ministry of Education, Culture, Research, and Technology.",
  },
  {
    role: "Active Member and Contributor",
    organization: "SMART FK UII",
    period: "Jul 2023 to Jun 2024",
    description:
      "Actively involved in SMART FK UII, focused on promoting research, scientific activities, and technology alongside medical students.",
    details: [
      "Scientific Division member (CV.md: Scientific Division - SMART FK UII)",
      "SMART Of The Year - Best Staff (Scientific)",
      "Coordinator of Scientific Fair 1 and 2",
      "Moderator of Lab Class 2023",
      "Liaison Officer - Temilnas X Intermedisco 2023",
    ],
  },
  {
    role: "Coordinator and Administrator",
    organization: "BAPIN-ISMKI",
    period: "Feb 2023 to May 2024",
    description:
      "Engaged with BAPIN-ISMKI (Assisting Body regarding International ISMKI). Led 'Jas Merah' initiative, managed internal division administration, and moderated national training sessions.",
    details: [
      "National Daily Administrator - Internal Division BAPIN-ISMKI",
      "Staff Internal Division - Indonesian Medical Student Summit (IMSS) 2023",
      "Moderator - Upgrading BAPIN-ISMKI: Systematic Review The Beginning of Our Journey",
    ],
  },
  {
    role: "Speaker Public Speaking",
    organization: "Seni.Bicara",
    period: "Feb 2023 to Jun 2023",
    description:
      "Delivered educational content and presentations on public speaking techniques as part of the program offered by Seni.Bicara.",
  },
  {
    role: "Master of Ceremony",
    organization: "Universitas Islam Indonesia",
    period: "2023",
    description:
      "Served as the Master of Ceremony for the 16th General Assembly ('Sidang Umum XVI') of the Student Family of the Faculty of Medicine UII.",
  },
  {
    role: "Guest Speaker",
    organization: "Blora Regency Government",
    period: "2021",
    description:
      "Invited as a guest speaker for 'Ngobrol Bareng Bupati,' a dialogue event featuring the Regent of Blora Regency and local social media influencers and activists.",
  },
  {
    role: "Speaker and Scientific Essay Mentor",
    organization: "INTIMATE SMART FK UII",
    period: "2024",
    description:
      "Speaker and scientific essay mentor for INTIMATE SMART FK UII 2024, as recorded in CV.md.",
  },
  {
    role: "Field Staff",
    organization: "FK UII",
    period: "",
    description:
      "Field Staff for 'Pelantikan dan Pengambilan Sumpah Dokter FK UII Periode LIX', as recorded in CV.md. No period is recorded for this item.",
  },
];

// ---------------------------------------------------------------------------
// Certifications archive: all 20 CV.md records, all 2024, grouped by provider.
// WHO x2, UNITAR x1, Johns Hopkins x3, Coursera rest x14.
// ---------------------------------------------------------------------------

export const certificationsArchive: Certification[] = [
  {
    title: "Antimicrobial Resistance and Infection Prevention and Control",
    issuer: "World Health Organization (WHO)",
    year: 2024,
  },
  {
    title: "Inequality Monitoring in Sexual Reproductive, Maternal, Newborn, Child, and Adolescent Health",
    issuer: "World Health Organization (WHO)",
    year: 2024,
  },
  {
    title: "Gender Equality and Human Rights in Climate Action and Renewable Energy",
    issuer: "United Nations Institute for Training and Research (UNITAR)",
    year: 2024,
  },
  {
    title: "Chemicals and Health",
    issuer: "The Johns Hopkins University",
    year: 2024,
  },
  {
    title: "Psychological First Aid",
    issuer: "The Johns Hopkins University",
    year: 2024,
  },
  {
    title: "COVID-19 Contact Tracing",
    issuer: "The Johns Hopkins University",
    year: 2024,
  },
  {
    title: "Stanford Introduction to Food and Health",
    issuer: "Stanford University",
    year: 2024,
  },
  {
    title: "Science of Exercise",
    issuer: "University of Colorado Boulder",
    year: 2024,
  },
  {
    title: "Introduction to Psychology",
    issuer: "Yale University",
    year: 2024,
  },
  {
    title: "Leading Healthcare Quality and Safety",
    issuer: "The George Washington University",
    year: 2024,
  },
  {
    title: "Case Studies in Personalized Medicine",
    issuer: "Vanderbilt University",
    year: 2024,
  },
  {
    title: "Understanding the Brain: The Neurobiology of Everyday Life",
    issuer: "The University Of Chicago (Northshore)",
    year: 2024,
  },
  {
    title: "Medical Technology and Evaluation",
    issuer: "University of Minnesota",
    year: 2024,
  },
  {
    title: "Drug Discovery",
    issuer: "University of California, San Diego - School of Medicine",
    year: 2024,
  },
  {
    title: "Drug Development",
    issuer: "University of California, San Diego - School of Medicine",
    year: 2024,
  },
  {
    title: "Drug Commercialization",
    issuer: "University of California, San Diego - School of Medicine",
    year: 2024,
  },
  {
    title: "Healthcare Marketplace",
    issuer: "University of Minnesota",
    year: 2024,
  },
  {
    title: "A Guide to Healthcare Innovation: Principles and Practice",
    issuer: "Imperial College London",
    year: 2024,
  },
  {
    title: "Speaking to Persuade: Motivating Audiences with Solid Arguments and Moving Language",
    issuer: "University of Washington",
    year: 2024,
  },
  {
    title: "Drug Development Product Management Specialization",
    issuer: "University of California, San Diego - School of Medicine",
    year: 2024,
  },
];

// ---------------------------------------------------------------------------
// Site stats exactly as recorded on the old site.
// Note on reconciliation: awardsArchive holds 25 honor, grant, and
// presentation items; the old-site aggregate of 29 counts the publications
// listed separately in oldPublications alongside them.
// ---------------------------------------------------------------------------

export const siteStats: SiteStats = {
  totalAwards: 29,
  goldMedals: 6,
  international: 12,
  publicationsOldSite: 4,
  certifications: "20+",
  keyRoles: 8,
};
