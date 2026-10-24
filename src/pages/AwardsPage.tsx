/**
 * AwardsPage: complete /awards archive, ONLINES styling.
 *
 * All items are copied exactly as recorded in the old site source
 * (CV.md HONORS-AWARDS sections and the old AwardsPage.jsx list).
 * Nothing is invented and no recorded item is dropped.
 * National: 13 items. International: 12 items. Listed total: 25.
 * The old-site aggregate of 29 also counts 4 publications, which are
 * listed on /research, not repeated here.
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

const INK = "#010101";
const GRAPHITE = "#1D1D1F";
const MUTED = "#666666";
const HAIRLINE = "#E0E0E0";
const PAPER = "#FFFFFF";
const LIGHT_BG = "#F5F5F7";
const BLUE = "#0859D4";

const DISPLAY =
  "'Inter', 'Inter Display', -apple-system, 'Segoe UI', Roboto, sans-serif";
const MONO =
  "'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace";

type AwardItem = {
  title: string;
  detail: string;
  year: string;
};

const NATIONAL: AwardItem[] = [
  {
    title: "3rd Most Outstanding Student LLDIKTI V 2025",
    detail: "LLDIKTI Region V",
    year: "2025",
  },
  {
    title: "Most Outstanding Student UII 2025",
    detail: "Islamic University of Indonesia",
    year: "2025",
  },
  {
    title: "Awardee Beasiswa Unggulan 2023",
    detail: "Ministry of Education, Culture, Research, and Technology",
    year: "2023",
  },
  {
    title: "Head of Research: Dietary Impacts in Women with PCOS",
    detail: "Review Research Grant",
    year: "2024",
  },
  {
    title: "Grant: Bisphenol A in Canned Food",
    detail:
      "Grant for Systematic Review: Bisphenol A in canned and plastic food/beverage. Led by dr. Eko Andriyanto M.Sc, funded by the Faculty of Medicine, Universitas Islam Indonesia.",
    year: "2024",
  },
  {
    title: "Grant: Bisphenol A on Cancers",
    detail:
      "Grant for Systematic Review: Bisphenol A on cancers. Led by dr. Kuswati, funded by the Faculty of Medicine, Universitas Islam Indonesia.",
    year: "2024",
  },
  {
    title: "Research Collaborator: Drug Discovery Kapulaga",
    detail: "In Silico Study of Kapulaga on Breast Cancer.",
    year: "2024",
  },
  {
    title: "Research Collaborator: Drug Discovery Tuberculosis",
    detail: "In Silico Study of Tuberculosis drug discovery.",
    year: "2024",
  },
  {
    title: "Gold Medal and Special Award, Invention and Innovation Fair (IIF) 2025",
    detail: "1st Author.",
    year: "2025",
  },
  {
    title: "1st Place Scientific Essay, Scientific Fair SMART FK UII 2023",
    detail: "Scientific Fair SMART FK UII.",
    year: "2023",
  },
  {
    title: "Bronze Medal, Innovation and Research Poster Competition (IRPOCO) 2023",
    detail: "International Scale competition.",
    year: "2023",
  },
  {
    title: "2nd Winner National Essay, RJJ Undiksha 2023",
    detail: "National essay competition.",
    year: "2023",
  },
  {
    title: "3rd Most Outstanding Student, SMAN 1 Blora",
    detail: "Based on Final Student Examination.",
    year: "2021",
  },
];

const INTERNATIONAL: AwardItem[] = [
  {
    title: "Silver Medal, Indonesia International Applied Science Project Olympiad (I2ASPO) 2025",
    detail: "1st Author.",
    year: "2025",
  },
  {
    title: "Gold Medal, International Science and Invention Fair (ISIF) 2025",
    detail: "1st Author.",
    year: "2025",
  },
  {
    title: "Travel Grant Recipient, International Congress of Diabetes and Metabolism (ICDM) 2025",
    detail: "Travel grant to attend the congress.",
    year: "2025",
  },
  {
    title: "Gold Medal, International Invention Competition for Young Moslem Scientists (IICYMS) 2025",
    detail: "1st Author.",
    year: "2025",
  },
  {
    title: "Gold Medal, World Robotics and Computer Science Olympiad (WRCSO) 2025",
    detail: "1st Author.",
    year: "2025",
  },
  {
    title: "Silver Medal, Bali International Science Fair (BISF) 2025",
    detail: "1st Author.",
    year: "2025",
  },
  {
    title: "Gold Medal, World Science, Environment and Engineering Competition (WSEEC) 2025",
    detail: "1st Author.",
    year: "2025",
  },
  {
    title: "Silver Medal, Jakarta International Science Fair (JISF) 2025",
    detail: "1st Author.",
    year: "2025",
  },
  {
    title: "Gold Medal, International Science and Invention Fair (ISIF) 2024",
    detail: "1st Author.",
    year: "2024",
  },
  {
    title: "ePoster Presentation, ENDO 2024",
    detail:
      "1st Author. 4th World Congress of GI Endoscopy, 4 to 6 July 2024, COEX Convention and Exhibition Center, Seoul, Korea.",
    year: "2024",
  },
  {
    title: "Poster Presenter, ICKSH 2024",
    detail:
      "1st Author. 2024 Korean Society of Hematology International Conference and 65th Annual Meeting.",
    year: "2024",
  },
  {
    title: "Oral Presentation, MYHAM 2024",
    detail:
      "1st Author. The 1st International Conference MYHAM 2024 (Muhammadiyah Yogyakarta, Hospital and Healthcare Management).",
    year: "2024",
  },
];

function AwardList({ items }: { items: AwardItem[] }) {
  return (
    <div>
      {items.map((item, i) => (
        <div
          key={item.title}
          data-mv
          style={{
            transitionDelay: `${Math.min(i, 11) * 80}ms`,
            display: "flex",
            flexWrap: "wrap",
            gap: "8px 32px",
            alignItems: "baseline",
            padding: "20px 0",
            borderTop: `1px solid ${HAIRLINE}`,
          }}
        >
          <div style={{ flex: "1 1 480px", minWidth: 0 }}>
            <p
              style={{
                fontSize: 18,
                fontWeight: 700,
                letterSpacing: "-0.01em",
                lineHeight: 1.35,
                color: INK,
                margin: 0,
              }}
            >
              {item.title}
            </p>
            <p
              style={{
                fontSize: 15,
                lineHeight: 1.6,
                color: GRAPHITE,
                margin: "6px 0 0",
              }}
            >
              {item.detail}
            </p>
          </div>
          <p
            style={{
              fontFamily: MONO,
              fontSize: 13,
              color: MUTED,
              margin: 0,
            }}
          >
            {item.year}
          </p>
        </div>
      ))}
    </div>
  );
}

export default function AwardsPage() {
  useMvReveal();
  return (
    <main
      style={{
        background: PAPER,
        color: INK,
        fontFamily: DISPLAY,
      }}
    >
      <style>{MV_CSS}</style>
      <div
        style={{
          maxWidth: 1160,
          margin: "0 auto",
          padding: "80px 24px 130px",
        }}
      >
        <p
          style={{
            fontFamily: MONO,
            fontSize: 12,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: MUTED,
            margin: "0 0 16px",
          }}
        >
          Archive / Awards
        </p>
        <h1
          data-mv
          style={{
            fontSize: "clamp(48px, 7vw, 96px)",
            lineHeight: 0.95,
            letterSpacing: "-0.03em",
            fontWeight: 700,
            margin: "0 0 24px",
          }}
        >
          Honors and awards.
        </h1>
        <p
          style={{
            fontSize: 18,
            lineHeight: 1.65,
            color: GRAPHITE,
            maxWidth: 640,
            margin: "0 0 80px",
          }}
        >
          As recorded on the previous site: 29 total awards, 6 gold medals,
          12 international.
        </p>

        <section style={{ marginBottom: 130 }}>
          <h2
            data-mv
            style={{
              fontSize: "clamp(32px, 4vw, 56px)",
              lineHeight: 1.02,
              letterSpacing: "-0.02em",
              fontWeight: 700,
              margin: "0 0 8px",
            }}
          >
            National honors.
          </h2>
          <p
            style={{
              fontFamily: MONO,
              fontSize: 12,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: MUTED,
              margin: "0 0 32px",
            }}
          >
            {NATIONAL.length} items
          </p>
          <AwardList items={NATIONAL} />
        </section>

        <section style={{ marginBottom: 130 }}>
          <h2
            data-mv
            style={{
              fontSize: "clamp(32px, 4vw, 56px)",
              lineHeight: 1.02,
              letterSpacing: "-0.02em",
              fontWeight: 700,
              margin: "0 0 8px",
            }}
          >
            International honors.
          </h2>
          <p
            style={{
              fontFamily: MONO,
              fontSize: 12,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: MUTED,
              margin: "0 0 32px",
            }}
          >
            {INTERNATIONAL.length} items
          </p>
          <AwardList items={INTERNATIONAL} />
        </section>

        <section
          style={{
            background: LIGHT_BG,
            padding: "32px 24px",
            borderTop: `1px solid ${HAIRLINE}`,
          }}
        >
          <p
            style={{
              fontSize: 16,
              lineHeight: 1.65,
              color: GRAPHITE,
              maxWidth: 640,
              margin: 0,
            }}
          >
            Note: the old-site count of 29 mixes honors, grants,
            presentations, and publications. As computed on the old site:
            success rate 31%, peak year 2025. The total of 29 counts the
            gut-axis review once, although it appears in both Indonesian
            and English versions. Publications themselves are listed on{" "}
            <a
              href="/research"
              className="mv-link"
              style={{ color: BLUE }}
            >
              /research
            </a>
            .
          </p>
        </section>
      </div>
    </main>
  );
}
