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
 *   values until docs/faers-verified.json exists with a verified
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
  subline: string;
  supportingLine: string;
  primaryCta: string;
  secondaryCta: string;
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
  year: number;
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
  subline:
    "I am Daivan Febri Juan Setiya, a medical student and researcher in Indonesia. I study health questions and build tools around them, through DaivanLabs.",
  supportingLine: "Founder, DaivanLabs. Code for Cure.",
  primaryCta: "See the research",
  secondaryCta: "Start a conversation",
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
    year: 2026,
    role: "Role unconfirmed in the sources",
    linkLabel: "Read the study",
    notes: [
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
