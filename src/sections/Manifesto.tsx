/**
 * Manifesto: replaced by the JOURNEY visualization (user request,
 * 24 Oct 2026). The generic 4-step method explainer is gone; this
 * section now shows the recorded journey as a dashed route with
 * year stations, built from docs/journey/01-spine.md (every station
 * is a recorded fact, nothing invented, nothing backfilled).
 *
 * Layout: dark #111 section. On desktop the route is horizontal:
 * a dashed line draws left to right on reveal, year stations sit
 * alternating above and below it, and each station node pops with
 * the overshoot curve. Award and presentation clusters render as
 * small blue dots with a visible count label (dots are decorative;
 * the count label carries the information, so nothing is
 * hover-dependent). On mobile (900px and below) the route becomes
 * a vertical dashed line on the left with stations stacked beside
 * it.
 *
 * Colour rule (learned this round): the global stylesheet forces
 * dark #1D1D1F on all h1-h6, which beats section inheritance. EVERY
 * heading and text element here carries an explicit light colour in
 * its own style (#FAFAFA headings, #D8D8D8 body, #98989C mono
 * labels). Never rely on inherited colour on dark.
 *
 * Motion (self-contained, no shared motion file):
 * - A tiny local IntersectionObserver adds mvM-in to the section
 *   once it enters the viewport, then unobserves. Elements are only
 *   hidden after the effect arms the section (mvM-armed), so content
 *   never stays invisible if the observer cannot run.
 * - Dashed route draws on reveal (1.4s); station nodes pop with
 *   cubic-bezier(0.34, 1.56, 0.64, 1), staggered 150ms; station
 *   content fades up with the same stagger.
 * - The blue drift blob from v4 is kept behind the content.
 * - prefers-reduced-motion: full static route, no draw animation,
 *   no pops, content fully visible. Touch: no hover-dependent
 *   content, no scroll hijack, no drag.
 */

import { useEffect, useRef } from "react";
import { Fragment } from "react";

const DISPLAY =
  "Inter, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";
const MONO =
  "'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace";

const PAPER = "#FAFAFA";
const BODY = "#D8D8D8";
const LABEL = "#98989C";
const BLUE = "#0859D4";

type Station = {
  year: string;
  title: string;
  detail: string;
  dots: string[];
  dotCount: string | null;
};

const STATIONS: Station[] = [
  {
    year: "2021",
    title: "Medicine begins",
    detail:
      "Bachelor of Medicine, Faculty of Medicine, Universitas Islam Indonesia. GPA 3.91 out of 4.0. Guest speaker for the Blora Regency Government dialogue, Ngobrol Bareng Bupati.",
    dots: [],
    dotCount: null,
  },
  {
    year: "2023",
    title: "Scholarship, and first wins",
    detail:
      "Beasiswa Unggulan Awardee, from the Ministry of Education, Culture, Research, and Technology. Active in SMART FK UII Scientific Division and BAPIN-ISMKI, public speaking educator at Seni.Bicara, and Master of Ceremony for the UII Faculty of Medicine General Assembly XVI.",
    dots: [
      "Beasiswa Unggulan Awardee",
      "1st Place, Scientific Essay, Scientific Fair SMART FK UII",
      "Bronze Medal, IRPOCO 2023",
      "2nd Winner, National Essay RJJ Undiksha",
    ],
    dotCount: "4 award items in 2023",
  },
  {
    year: "2024",
    title: "Certificates, papers, world stages",
    detail:
      "20 certifications completed: WHO, UNITAR, Johns Hopkins, and Coursera. Four publications recorded. First-author ePoster at ENDO 2024 in Seoul, poster at ICKSH 2024, and oral presentation at MYHAM 2024, plus a Gold Medal at ISIF 2024. Speaker and mentor at KampusInovatif.id and INTIMATE SMART FK UII.",
    dots: [
      "ePoster, ENDO 2024, Seoul",
      "Poster, ICKSH 2024",
      "Oral presentation, MYHAM 2024",
      "Gold Medal, ISIF 2024",
    ],
    dotCount: "4 award items in 2024",
  },
  {
    year: "2025",
    title: "A peak year, and a lab is born",
    detail:
      "Most Outstanding Student UII 2025 and 3rd Most Outstanding Student LLDIKTI V 2025. DaivanLabs founded in June 2025. Summer school at Chulalongkorn (AASP-PECT). The Amomum cardamomum publication recorded this year.",
    dots: [
      "Most Outstanding Student UII 2025",
      "3rd Most Outstanding Student LLDIKTI V 2025",
      "Gold Medal and Special Award, IIF 2025",
      "Gold Medal, ISIF 2025",
      "Gold Medal, IICYMS 2025",
      "Gold Medal, WRCSO 2025",
      "Gold Medal, WSEEC 2025",
      "Silver Medal, I2ASPO 2025",
      "Silver Medal, BISF 2025",
      "Silver Medal, JISF 2025",
      "Travel Grant, ICDM 2025",
    ],
    dotCount: "11 award items in 2025",
  },
  {
    year: "2026",
    title: "Clinic, congress, and tools",
    detail:
      "Clinical clerkship (koas), surgery rotation from 5 October 2026. Poster ABST-000034 at Hypertension Seoul 2026, Conrad Seoul, 5 to 7 November 2026: FAERS resistant hypertension study, N = 6,601 reports analysed. Results are hypothesis-generating: reporting disproportionality, not clinical risk or causality. StrokeSense and StrokeSense AI Lab built: upload results are AI interpretation of images, not measurement, and FAST output is an Observation Sheet with no score and no diagnosis. Cerclage Table 1 deep analysis completed 18 October 2026; no result numbers published.",
    dots: [],
    dotCount: null,
  },
];

const REVEAL_CSS = `
.mvM-armed .mvM-reveal {
  opacity: 0;
  transform: translateY(18px);
  transition: opacity 600ms ease, transform 600ms cubic-bezier(0.22, 1, 0.36, 1);
}
.mvM-armed.mvM-in .mvM-reveal {
  opacity: 1;
  transform: translateY(0);
}
.mvM-drift {
  animation: mvM-drift 22s ease-in-out infinite alternate;
  will-change: transform;
}
@keyframes mvM-drift {
  from {
    transform: translate3d(0, 0, 0);
  }
  to {
    transform: translate3d(-120px, 60px, 0);
  }
}
.journey-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-template-rows: auto 48px auto;
  column-gap: 24px;
  position: relative;
}
.journey-line {
  grid-column: 1 / -1;
  grid-row: 2;
  align-self: center;
  height: 0;
  border-top: 2px dashed rgba(255, 255, 255, 0.35);
  transform-origin: left center;
}
.mvM-armed .journey-line {
  transform: scaleX(0);
}
.mvM-armed.mvM-in .journey-line {
  transform: scaleX(1);
  transition: transform 1400ms ease 100ms;
}
.journey-node {
  grid-row: 2;
  display: flex;
  align-items: center;
  justify-content: center;
}
.journey-node-dot {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #0859D4;
  border: 2px solid #FAFAFA;
  box-sizing: border-box;
  flex-shrink: 0;
}
.mvM-armed .journey-node-dot {
  opacity: 0;
  transform: scale(0.4);
}
.mvM-armed.mvM-in .journey-node-dot {
  opacity: 1;
  transform: scale(1);
  transition:
    transform 450ms cubic-bezier(0.34, 1.56, 0.64, 1),
    opacity 300ms ease;
}
.journey-node-mobile {
  display: none;
}
@media (max-width: 900px) {
  .journey-grid {
    display: block;
  }
  .journey-line,
  .journey-node {
    display: none;
  }
  .journey-station {
    position: relative;
    padding-left: 40px;
    padding-bottom: 48px;
    margin: 0;
  }
  .journey-station:last-child {
    padding-bottom: 0;
  }
  .journey-station::before {
    content: "";
    position: absolute;
    left: 7px;
    top: 14px;
    bottom: 0;
    border-left: 2px dashed rgba(255, 255, 255, 0.35);
  }
  .journey-station:last-child::before {
    top: 0;
    bottom: auto;
    height: 14px;
  }
  .mvM-armed .journey-station::before {
    transform: scaleY(0);
    transform-origin: top;
  }
  .mvM-armed.mvM-in .journey-station::before {
    transform: scaleY(1);
    transition: transform 1200ms ease;
  }
  .journey-node-mobile {
    display: block;
    position: absolute;
    left: 0;
    top: 6px;
  }
}
@media (prefers-reduced-motion: reduce) {
  .mvM-armed .mvM-reveal {
    opacity: 1 !important;
    transform: none !important;
    transition: none !important;
  }
  .mvM-drift {
    animation: none !important;
  }
  .mvM-armed .journey-line {
    transform: none !important;
    transition: none !important;
  }
  .mvM-armed .journey-node-dot {
    opacity: 1 !important;
    transform: none !important;
    transition: none !important;
  }
  .mvM-armed .journey-station::before {
    transform: none !important;
    transition: none !important;
  }
}
`;

export default function Manifesto() {
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    section.classList.add("mvM-armed");
    if (typeof IntersectionObserver === "undefined") {
      section.classList.add("mvM-in");
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            section.classList.add("mvM-in");
            observer.disconnect();
          }
        });
      },
      { threshold: 0.15 },
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="manifesto"
      ref={sectionRef}
      aria-labelledby="manifesto-heading"
      className="dark-section"
      style={{
        position: "relative",
        overflow: "hidden",
        background: "#111111",
        color: PAPER,
        fontFamily: DISPLAY,
        padding: "130px 24px",
      }}
    >
      <style>{REVEAL_CSS}</style>
      <div
        aria-hidden="true"
        className="mvM-drift"
        style={{
          position: "absolute",
          top: "-10%",
          right: "-8%",
          width: 900,
          height: 900,
          borderRadius: "50%",
          pointerEvents: "none",
          zIndex: 0,
          background:
            "radial-gradient(circle, rgba(8, 89, 212, 0.22) 0%, rgba(255, 255, 255, 0.08) 45%, rgba(255, 255, 255, 0) 70%)",
          filter: "blur(80px)",
        }}
      />
      <div style={{ position: "relative", zIndex: 1, maxWidth: 1160, margin: "0 auto" }}>
        <p
          style={{
            fontFamily: MONO,
            fontSize: 12,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: LABEL,
            margin: "0 0 24px",
          }}
        >
          Journey
        </p>
        <h2
          id="manifesto-heading"
          className="mvM-reveal"
          style={{
            fontSize: "clamp(48px, 7vw, 72px)",
            lineHeight: 1.02,
            letterSpacing: "-0.02em",
            fontWeight: 700,
            margin: "0 0 24px",
            maxWidth: 900,
            color: PAPER,
          }}
        >
          The journey so far.
        </h2>
        <p
          className="mvM-reveal"
          style={{
            fontSize: 18,
            lineHeight: 1.65,
            color: BODY,
            maxWidth: 680,
            margin: "0 0 80px",
            transitionDelay: "80ms",
          }}
        >
          From starting medicine at UII in 2021 to the clinic and a Seoul
          congress poster in 2026, in five year stations.
        </p>
        <div className="journey-grid">
          <div aria-hidden="true" className="journey-line" />
          {STATIONS.map((station, i) => {
            const onTop = i % 2 === 0;
            return (
              <Fragment key={station.year}>
                <div
                  aria-hidden="true"
                  className="journey-node"
                  style={{ gridColumn: i + 1 }}
                >
                  <span
                    aria-hidden="true"
                    className="journey-node-dot"
                    style={{ transitionDelay: `${300 + i * 150}ms` }}
                  />
                </div>
                <article
                  className="mvM-reveal journey-station"
                  style={{
                    gridColumn: i + 1,
                    gridRow: onTop ? 1 : 3,
                    alignSelf: onTop ? "end" : "start",
                    paddingBottom: onTop ? 28 : 0,
                    paddingTop: onTop ? 0 : 28,
                    minWidth: 0,
                    transitionDelay: `${200 + i * 150}ms`,
                  }}
                >
                  <span
                    aria-hidden="true"
                    className="journey-node-dot journey-node-mobile"
                    style={{ transitionDelay: `${300 + i * 150}ms` }}
                  />
                  <p
                    style={{
                      fontFamily: MONO,
                      fontSize: "clamp(28px, 3vw, 40px)",
                      fontWeight: 700,
                      letterSpacing: "-0.02em",
                      color: PAPER,
                      margin: "0 0 12px",
                    }}
                  >
                    {station.year}
                  </p>
                  <h3
                    style={{
                      fontSize: "clamp(22px, 2vw, 28px)",
                      lineHeight: 1.15,
                      letterSpacing: "-0.01em",
                      fontWeight: 700,
                      color: PAPER,
                      margin: "0 0 12px",
                    }}
                  >
                    {station.title}
                  </h3>
                  <p
                    style={{
                      fontSize: 16,
                      lineHeight: 1.65,
                      color: BODY,
                      margin: 0,
                    }}
                  >
                    {station.detail}
                  </p>
                  {station.dots.length > 0 && (
                    <div
                      aria-hidden="true"
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 6,
                        marginTop: 16,
                      }}
                    >
                      {station.dots.map((dot) => (
                        <span
                          key={dot}
                          title={dot}
                          style={{
                            width: 8,
                            height: 8,
                            borderRadius: "50%",
                            background: BLUE,
                            flexShrink: 0,
                          }}
                        />
                      ))}
                    </div>
                  )}
                  {station.dotCount && (
                    <p
                      style={{
                        fontFamily: MONO,
                        fontSize: 12,
                        letterSpacing: "0.04em",
                        color: LABEL,
                        margin: "10px 0 0",
                      }}
                    >
                      {station.dotCount}
                    </p>
                  )}
                </article>
              </Fragment>
            );
          })}
        </div>
        <p
          className="mvM-reveal"
          style={{
            fontFamily: MONO,
            fontSize: 13,
            lineHeight: 1.7,
            color: LABEL,
            maxWidth: 760,
            margin: "80px 0 0",
            transitionDelay: "400ms",
          }}
        >
          Items with no recorded year: Field Staff for the doctor
          inauguration of FK UII Periode LIX; 3rd Most Outstanding
          Student, SMAN 1 Blora; Head of Research on dietary impacts in
          women with PCOS; two Bisphenol A systematic review grants;
          in silico drug discovery collaboration on Kapulaga and
          tuberculosis. The full record lives on the Awards, Education,
          and Research pages.
        </p>
      </div>
    </section>
  );
}
