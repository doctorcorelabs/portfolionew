/**
 * CertificationsPage: the complete /certifications archive.
 *
 * ONLINES styling, inline so the file works standalone: container 1160px,
 * Inter for text, JetBrains Mono for provider labels, ink #010101 on white,
 * hairline #e0e0e0 separators, blue #0859D4 for links only.
 *
 * Data rule: all 20 records exactly as recorded on the old site (CV and the
 * old CertificationsPage). No credential IDs, expiry dates, or grades are
 * shown, because none are verified beyond the old site's own framing.
 * Every record is dated 2024 as recorded.
 */

import { useEffect } from "react";

function useMvReveal() {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>(".mv-rv"));
    if (els.length === 0) return;
    if (typeof IntersectionObserver === "undefined") {
      els.forEach((el) => el.classList.add("mv-in"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).classList.add("mv-in");
            io.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -4% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

const MV_CSS = `
.mv-rv {
  opacity: 0;
  transform: translateY(14px);
  transition: opacity 600ms ease, transform 600ms cubic-bezier(0.22, 1, 0.36, 1);
}
.mv-rv.mv-in {
  opacity: 1;
  transform: none;
}
.mv-link {
  background-image: linear-gradient(currentColor, currentColor);
  background-size: 0% 1px;
  background-repeat: no-repeat;
  background-position: 0 100%;
  transition: background-size 350ms ease;
  text-decoration: none;
}
.mv-link:hover, .mv-link:focus-visible {
  background-size: 100% 1px;
}
@media (prefers-reduced-motion: reduce) {
  .mv-rv {
    opacity: 1;
    transform: none;
    transition: none;
  }
  .mv-link {
    transition: none;
  }
}
`;

type CertGroup = {
  provider: string;
  note?: string;
  titles: string[];
};

const GROUPS: CertGroup[] = [
  {
    provider: "World Health Organization (WHO)",
    titles: [
      "Antimicrobial Resistance and Infection Prevention and Control",
      "Inequality Monitoring in Sexual Reproductive, Maternal, Newborn, Child, and Adolescent Health",
    ],
  },
  {
    provider: "United Nations Institute for Training and Research (UNITAR)",
    titles: [
      "Gender Equality and Human Rights in Climate Action and Renewable Energy",
    ],
  },
  {
    provider: "The Johns Hopkins University",
    note: "Courses completed via Coursera, as recorded.",
    titles: [
      "Chemicals and Health",
      "Psychological First Aid",
      "COVID-19 Contact Tracing",
    ],
  },
  {
    provider: "Stanford University",
    note: "Course completed via Coursera, as recorded.",
    titles: ["Stanford Introduction to Food and Health"],
  },
  {
    provider: "University of Colorado Boulder",
    note: "Course completed via Coursera, as recorded.",
    titles: ["Science of Exercise"],
  },
  {
    provider: "Yale University",
    note: "Course completed via Coursera, as recorded.",
    titles: ["Introduction to Psychology"],
  },
  {
    provider: "The George Washington University",
    note: "Course completed via Coursera, as recorded.",
    titles: ["Leading Healthcare Quality and Safety"],
  },
  {
    provider: "Vanderbilt University",
    note: "Course completed via Coursera, as recorded.",
    titles: ["Case Studies in Personalized Medicine"],
  },
  {
    provider: "The University of Chicago (Northshore)",
    note: "Course completed via Coursera, as recorded.",
    titles: ["Understanding the Brain: The Neurobiology of Everyday Life"],
  },
  {
    provider: "University of Minnesota",
    note: "Courses completed via Coursera, as recorded.",
    titles: ["Medical Technology and Evaluation", "Healthcare Marketplace"],
  },
  {
    provider: "University of California, San Diego - School of Medicine",
    note: "Courses completed via Coursera, as recorded.",
    titles: [
      "Drug Discovery",
      "Drug Development",
      "Drug Commercialization",
      "Drug Development Product Management Specialization",
    ],
  },
  {
    provider: "Imperial College London",
    note: "Course completed via Coursera, as recorded.",
    titles: ["A Guide to Healthcare Innovation: Principles and Practice"],
  },
  {
    provider: "University of Washington",
    note: "Course completed via Coursera, as recorded.",
    titles: [
      "Speaking to Persuade: Motivating Audiences with Solid Arguments and Moving Language",
    ],
  },
];

const TOTAL = GROUPS.reduce((sum, group) => sum + group.titles.length, 0);

const INK = "#010101";
const GREY = "#6b6b6b";
const HAIRLINE = "#e0e0e0";
const BLUE = "#0859D4";
const DISPLAY =
  "'Inter', 'Inter Display', -apple-system, 'Segoe UI', Roboto, sans-serif";
const MONO =
  "'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace";

export default function CertificationsPage() {
  useMvReveal();
  return (
    <main
      style={{
        background: "#ffffff",
        color: INK,
        fontFamily: DISPLAY,
        padding: "80px 24px 130px",
      }}
    >
      <style>{MV_CSS}</style>
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
          Archive / Certifications
        </p>
        <h1
          data-mv
          style={{
            fontSize: "clamp(56px, 9vw, 96px)",
            lineHeight: 0.95,
            letterSpacing: "-0.03em",
            fontWeight: 700,
            margin: "0 0 24px",
          }}
        >
          Certifications.
        </h1>
        <p
          style={{
            fontSize: 18,
            lineHeight: 1.65,
            color: "#1d1d1f",
            maxWidth: 640,
            margin: "0 0 16px",
          }}
        >
          Authenticated records, as framed on the old site: a ledger of
          professional accreditations and technical competencies. All{" "}
          {TOTAL} records below were issued in 2024, as recorded.
        </p>
        <p
          style={{
            fontFamily: MONO,
            fontSize: 12,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: GREY,
            margin: "0 0 64px",
          }}
        >
          {TOTAL} records
        </p>

        {GROUPS.map((group) => (
          <section
            key={group.provider}
            data-mv
            style={{
              borderTop: `1px solid ${HAIRLINE}`,
              padding: "32px 0",
            }}
          >
            <p
              data-mv
              style={{
                fontFamily: MONO,
                fontSize: 12,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: GREY,
                margin: "0 0 20px",
              }}
            >
              {group.provider}
              {group.note ? ` - ${group.note}` : ""}
            </p>
            <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
              {group.titles.map((title, ti) => (
                <li
                  key={title}
                  data-mv
                  style={{
                    transitionDelay: `${Math.min(ti, 11) * 80}ms`,
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "16px 32px",
                    alignItems: "baseline",
                    justifyContent: "space-between",
                    borderTop: `1px solid ${HAIRLINE}`,
                    padding: "20px 0",
                  }}
                >
                  <span
                    style={{
                      fontSize: 20,
                      lineHeight: 1.4,
                      fontWeight: 600,
                      letterSpacing: "-0.01em",
                      maxWidth: 820,
                    }}
                  >
                    {title}
                  </span>
                  <span
                    style={{
                      fontFamily: MONO,
                      fontSize: 12,
                      letterSpacing: "0.08em",
                      color: GREY,
                    }}
                  >
                    2024
                  </span>
                </li>
              ))}
            </ul>
          </section>
        ))}

        <p
          style={{
            fontSize: 16,
            lineHeight: 1.65,
            color: "#1d1d1f",
            maxWidth: 640,
            borderTop: `1px solid ${HAIRLINE}`,
            paddingTop: 32,
            margin: "32px 0 0",
          }}
        >
          Note: these short online courses are shown here as an archive,
          distinct from research credentials such as publications, grants,
          and conference presentations. No credential ID, expiry date, or
          grade is claimed for any record above.
        </p>
        <p style={{ margin: "32px 0 0" }}>
          <a
            href="/"
            className="mv-link"
            style={{
              fontFamily: MONO,
              fontSize: 13,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: BLUE,
            }}
          >
            Back to home
          </a>
        </p>
      </div>
    </main>
  );
}
