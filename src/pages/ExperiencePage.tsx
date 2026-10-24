import { Link } from "react-router-dom";

/**
 * Experience page, ONLINES styling: container 1160px, Inter display type,
 * JetBrains Mono year labels, hairline separators, blue only for links.
 * All roles are recorded exactly as in the old site (ExperiencePage.jsx
 * and CV.md). No role is invented, and no contact details from CV.md
 * are reproduced here.
 */

const INK = "#010101";
const GREY = "#555555";
const HAIRLINE = "#e0e0e0";
const BLUE = "#0859D4";

const DISPLAY = "'Inter', -apple-system, 'Segoe UI', Roboto, sans-serif";
const MONO = "'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace";

type Role = {
  role: string;
  org: string;
  period: string;
  description: string;
  outcomes: string[];
};

const ROLES: Role[] = [
  {
    role: "Founder",
    org: "DaivanLabs",
    period: "June 2025 - Present",
    description:
      "Founder of DaivanLabs, applying coding skills ('Code') to develop healthcare-related tools ('Cure') and build professional connections ('Connect'). Managing project development and operations.",
    outcomes: [
      "Developing 'Cure' healthcare tools",
      "Building 'Connect' professional network",
      "Managing full-stack development and operations",
    ],
  },
  {
    role: "Speaker and Mentor",
    org: "KampusInovatif.id",
    period: "Sep 2024 - Feb 2025",
    description:
      "Served as a speaker and mentor through the KampusInovatif.id platform, sharing insights and guidance on successfully applying for the Beasiswa Unggulan scholarship.",
    outcomes: [
      "Mentored scholarship applicants",
      "Delivered public speaking sessions",
      "Shared Beasiswa Unggulan insights",
    ],
  },
  {
    role: "Awardee Beasiswa Unggulan",
    org: "Ministry of Education, Culture, Research, and Technology",
    period: "Oct 2023 - Present",
    description:
      "Recipient of the scholarship 'Beasiswa Unggulan' awarded by the Indonesian Ministry of Education, Culture, Research, and Technology for outstanding academic potential and achievement.",
    outcomes: [
      "Prestigious national scholarship",
      "Academic excellence recognition",
      "Fully funded education",
    ],
  },
  {
    role: "Active Member and Contributor",
    org: "SMART FK UII",
    period: "Jul 2023 - Jun 2024",
    description:
      "Actively involved in SMART FK UII, focused on promoting research, scientific activities, and technology alongside medical students. Roles included Scientific Division member, Event Coordinator, and Liaison Officer.",
    outcomes: [
      "SMART Of The Year - Best Staff (Scientific)",
      "Coordinated Scientific Fair 1 and 2",
      "Moderated Lab Class 2023",
      "Liaison Officer Temilnas X",
    ],
  },
  {
    role: "Coordinator and Administrator",
    org: "BAPIN-ISMKI",
    period: "Feb 2023 - May 2024",
    description:
      "Engaged with BAPIN-ISMKI (Assisting Body regarding International ISMKI). Led the 'Jas Merah' initiative, managed internal division administration, and moderated national training sessions.",
    outcomes: [
      "Coordinator, 'Jas Merah' initiative",
      "National Daily Administrator (Internal)",
      "Staff, Internal Division, IMSS 2023",
    ],
  },
  {
    role: "Speaker, Public Speaking",
    org: "Seni.Bicara",
    period: "Feb 2023 - Jun 2023",
    description:
      "Delivered educational content and presentations on public speaking techniques as part of the program offered by Seni.Bicara.",
    outcomes: [
      "Public speaking education",
      "Content delivery",
      "Skill sharing",
    ],
  },
  {
    role: "Master of Ceremony",
    org: "Universitas Islam Indonesia",
    period: "2023",
    description:
      "Served as the Master of Ceremony for the 16th General Assembly ('Sidang Umum XVI') of the Student Family of the Faculty of Medicine UII.",
    outcomes: [
      "Guided formal proceedings",
      "Host of the General Assembly",
      "Professional communication",
    ],
  },
  {
    role: "Guest Speaker",
    org: "Blora Regency Government",
    period: "2021",
    description:
      "Invited as a guest speaker for 'Ngobrol Bareng Bupati,' a dialogue event featuring the Regent of Blora Regency and local social media influencers and activists.",
    outcomes: [
      "Guest speaker with the Regent",
      "Community engagement",
      "Social dialogue",
    ],
  },
];

/**
 * Further CV.md items that are NOT already covered as standalone entries
 * in the main list above. Items the CV also records but which already
 * appear in the main list (Seni.Bicara speaking, the Blora guest talk,
 * Temilnas X liaison work, SMART scientific division work, and the
 * BAPIN-ISMKI national daily administrator role) are not repeated here.
 */
const ALSO_RECORDED: string[] = [
  "Field Staff, Pelantikan dan Pengambilan Sumpah Dokter FK UII Periode LIX",
  "Staff, Internal Division, Indonesian Medical Student Summit (IMSS) 2023, BAPIN-ISMKI",
  "Moderator, Upgrading BAPIN-ISMKI: Systematic Review, The Beginning of Our Journey",
  "Speaker and Scientific Essay Mentor, INTIMATE SMART FK UII 2024",
];

export default function ExperiencePage() {
  return (
    <main
      style={{
        background: "#ffffff",
        color: INK,
        fontFamily: DISPLAY,
        padding: "80px 24px 130px",
      }}
    >
      <div style={{ maxWidth: 1160, margin: "0 auto" }}>
        <p
          style={{
            fontFamily: MONO,
            fontSize: 12,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: GREY,
            margin: "0 0 16px",
          }}
        >
          Experience
        </p>
        <h1
          style={{
            fontSize: "clamp(56px, 9vw, 96px)",
            lineHeight: 1,
            letterSpacing: "-0.03em",
            fontWeight: 700,
            margin: "0 0 24px",
          }}
        >
          Experience.
        </h1>
        <p
          style={{
            fontSize: 18,
            lineHeight: 1.65,
            color: GREY,
            maxWidth: 640,
            margin: "0 0 80px",
          }}
        >
          A chronological record of contributions to healthcare, research,
          and education.
        </p>

        <div style={{ borderTop: `1px solid ${HAIRLINE}` }}>
          {ROLES.map((item) => (
            <article
              key={`${item.role}-${item.org}`}
              style={{
                borderBottom: `1px solid ${HAIRLINE}`,
                padding: "32px 0",
                display: "grid",
                gridTemplateColumns: "180px 1fr",
                gap: "24px",
              }}
            >
              <p
                style={{
                  fontFamily: MONO,
                  fontSize: 12,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: GREY,
                  margin: 0,
                }}
              >
                {item.period}
              </p>
              <div>
                <h2
                  style={{
                    fontSize: 28,
                    letterSpacing: "-0.02em",
                    fontWeight: 700,
                    margin: "0 0 4px",
                  }}
                >
                  {item.role}
                </h2>
                <p
                  style={{
                    fontFamily: MONO,
                    fontSize: 13,
                    color: GREY,
                    margin: "0 0 16px",
                  }}
                >
                  {item.org}
                </p>
                <p
                  style={{
                    fontSize: 17,
                    lineHeight: 1.65,
                    color: INK,
                    maxWidth: 680,
                    margin: "0 0 16px",
                  }}
                >
                  {item.description}
                </p>
                <ul
                  style={{
                    margin: 0,
                    paddingLeft: 20,
                    fontSize: 15,
                    lineHeight: 1.7,
                    color: GREY,
                  }}
                >
                  {item.outcomes.map((outcome) => (
                    <li key={outcome}>{outcome}</li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>

        <section style={{ marginTop: 80 }}>
          <h2
            style={{
              fontSize: 32,
              letterSpacing: "-0.02em",
              fontWeight: 700,
              margin: "0 0 8px",
            }}
          >
            Also recorded in the CV.
          </h2>
          <p
            style={{
              fontSize: 16,
              lineHeight: 1.65,
              color: GREY,
              maxWidth: 640,
              margin: "0 0 24px",
            }}
          >
            Further roles from the CV that are not standalone entries in the
            list above. Roles already covered above are not repeated here.
          </p>
          <ul
            style={{
              margin: 0,
              padding: 0,
              listStyle: "none",
              borderTop: `1px solid ${HAIRLINE}`,
            }}
          >
            {ALSO_RECORDED.map((item) => (
              <li
                key={item}
                style={{
                  borderBottom: `1px solid ${HAIRLINE}`,
                  padding: "16px 0",
                  fontSize: 17,
                  lineHeight: 1.6,
                }}
              >
                {item}
              </li>
            ))}
          </ul>
        </section>

        <p style={{ marginTop: 80, fontSize: 15, lineHeight: 1.65 }}>
          <Link to="/" style={{ color: BLUE }}>
            Back to the homepage
          </Link>
          {" | "}
          <Link to="/education" style={{ color: BLUE }}>
            Education
          </Link>
        </p>
      </div>
    </main>
  );
}
