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
  | "archive";

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
    topics: "PCOS, Cancer, and Gut Microbiome.",
  },
  {
    name: "Drug Discovery",
    topics: "In Silico studies for TB and Breast Cancer.",
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
