type Track = "research" | "career";

type Milestone = {
  id: string;
  track: Track;
  dateLabel: string;
  dateTime?: string;
  title: string;
  org: string;
  context: string;
  major?: boolean;
  ongoing?: boolean;
};

// Milestones verified in research/08-inventaris-riset.md and
// research/10-visualisasi-riset.md. Only month precision that is
// verified is shown as a month; other items show the year only.
// Within one year, items follow source order, not implied months.
const MILESTONES: Milestone[] = [
  {
    id: "beasiswa-unggulan",
    track: "career",
    dateLabel: "2023 - now",
    dateTime: "2023",
    title: "Beasiswa Unggulan Awardee",
    org: "Ministry of Education, Culture, Research, and Technology",
    context: "Prestigious national scholarship, still held today.",
    major: true,
    ongoing: true,
  },
  {
    id: "chulalongkorn-summer-school",
    track: "career",
    dateLabel: "2025",
    dateTime: "2025",
    title: "Chulalongkorn Summer School",
    org: "Chulalongkorn University",
    context: "Intensive training in pharmaceutical and clinical development.",
  },
  {
    id: "founder-daivanlabs",
    track: "career",
    dateLabel: "June 2025 - now",
    dateTime: "2025-06",
    title: "Founder, DaivanLabs",
    org: "DaivanLabs",
    context: "Code for Cure: code applied to healthcare tools.",
    major: true,
    ongoing: true,
  },
  {
    id: "most-outstanding-student-uii",
    track: "career",
    dateLabel: "2025",
    dateTime: "2025",
    title: "Most Outstanding Student UII",
    org: "Islamic University of Indonesia",
    context: "Most Outstanding Student 2025.",
    major: true,
  },
  {
    id: "gold-isif",
    track: "career",
    dateLabel: "2025",
    dateTime: "2025",
    title: "Gold Medal ISIF",
    org: "International Science and Invention Fair",
    context: "Gold medal, 2025.",
  },
  {
    id: "gold-wrcso",
    track: "career",
    dateLabel: "2025",
    dateTime: "2025",
    title: "Gold Medal WRCSO",
    org: "World Robotics and Computer Science Olympiad",
    context: "Gold medal, 2025.",
  },
  {
    id: "hypertension-seoul-poster",
    track: "research",
    dateLabel: "November 2026",
    dateTime: "2026-11",
    title: "Poster, Hypertension Seoul 2026",
    org: "Korean Society of Hypertension",
    context: "FAERS study of resistant hypertension, abstract ABST-000034.",
  },
];

const TRACKS: { id: Track; label: string; note: string }[] = [
  {
    id: "research",
    label: "Research",
    note: "Studies and conference output.",
  },
  {
    id: "career",
    label: "Career and education",
    note: "Roles, education, scholarships, and awards.",
  },
];

export default function Timeline() {
  return (
    <section className="tl" aria-labelledby="tl-heading">
      <style>{`
        .tl {
          --tl-ink: #0a0a0a;
          --tl-paper: #ffffff;
          --tl-archive: #f2f2ef;
          --tl-graphite: #3c3c38;
          --tl-margin: #6f6f68;
          --tl-hairline: #d8d8d0;
          --tl-red: #c8102e;
          background: var(--tl-paper);
          color: var(--tl-ink);
          padding: 48px 24px;
        }
        .tl-kicker {
          margin: 0 0 8px;
          font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
          font-size: 12px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--tl-margin);
        }
        .tl h2 {
          margin: 0 0 8px;
          font-size: 40px;
          line-height: 1.02;
          letter-spacing: -0.03em;
        }
        .tl-intro {
          margin: 0 0 32px;
          max-width: 56ch;
          font-size: 17px;
          line-height: 1.65;
          color: var(--tl-graphite);
        }
        .tl-track {
          margin: 0 0 32px;
        }
        .tl-track-head {
          display: flex;
          align-items: baseline;
          gap: 12px;
          border-bottom: 1px solid var(--tl-hairline);
          padding-bottom: 8px;
        }
        .tl-track-head h3 {
          margin: 0;
          font-size: 18px;
        }
        .tl-track-note {
          margin: 0;
          font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
          font-size: 12px;
          color: var(--tl-margin);
        }
        .tl-lane {
          list-style: none;
          margin: 0;
          padding: 24px 0 0;
          display: flex;
          gap: 24px;
          overflow-x: auto;
          border-top: 1px solid var(--tl-hairline);
        }
        .tl-item {
          position: relative;
          flex: 0 0 220px;
          padding-top: 20px;
        }
        .tl-item::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: var(--tl-ink);
          transform: translateY(-5px);
        }
        .tl-item--major::before {
          width: 12px;
          height: 12px;
          background: var(--tl-red);
          transform: translateY(-6px) rotate(45deg);
          border-radius: 0;
        }
        .tl-date {
          display: block;
          margin-bottom: 6px;
          font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
          font-size: 12px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--tl-margin);
        }
        .tl-item h4 {
          margin: 0 0 4px;
          font-size: 17px;
          line-height: 1.3;
        }
        .tl-item--major h4 {
          font-size: 19px;
        }
        .tl-org {
          margin: 0 0 4px;
          font-size: 14px;
          color: var(--tl-graphite);
        }
        .tl-context {
          margin: 0;
          font-size: 14px;
          line-height: 1.55;
          color: var(--tl-graphite);
        }
        .tl-ongoing {
          display: inline-block;
          margin-top: 8px;
          padding: 2px 6px;
          background: var(--tl-archive);
          font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
          font-size: 11px;
          color: var(--tl-graphite);
        }
        .tl-footnote {
          margin: 8px 0 0;
          font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
          font-size: 12px;
          line-height: 1.5;
          color: var(--tl-margin);
        }
        @media (max-width: 640px) {
          .tl {
            padding: 32px 20px;
          }
          .tl h2 {
            font-size: 32px;
          }
          .tl-lane {
            flex-direction: column;
            overflow-x: visible;
            border-top: none;
            border-left: 1px solid var(--tl-hairline);
            padding: 0 0 0 24px;
            gap: 28px;
          }
          .tl-item {
            flex: 1 1 auto;
            padding-top: 0;
          }
          .tl-item::before {
            top: 4px;
            left: -24px;
            transform: translateX(-5px);
          }
          .tl-item--major::before {
            transform: translateX(-6px) rotate(45deg);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .tl-lane {
            scroll-behavior: auto;
          }
        }
      `}</style>
      <p className="tl-kicker">FIG. 03 - Timeline</p>
      <h2 id="tl-heading">From student to researcher.</h2>
      <p className="tl-intro">
        Verified milestones only: education, scholarships, awards, roles,
        and conference output, in chronological order.
      </p>
      {TRACKS.map((track) => (
        <div className="tl-track" key={track.id}>
          <div className="tl-track-head">
            <h3>{track.label}</h3>
            <p className="tl-track-note">{track.note}</p>
          </div>
          <ol className="tl-lane">
            {MILESTONES.filter((m) => m.track === track.id).map((m) => (
              <li
                key={m.id}
                className={
                  m.major ? "tl-item tl-item--major" : "tl-item"
                }
              >
                <time className="tl-date" dateTime={m.dateTime}>
                  {m.dateLabel}
                </time>
                <h4>{m.title}</h4>
                <p className="tl-org">{m.org}</p>
                <p className="tl-context">{m.context}</p>
                {m.ongoing ? (
                  <span className="tl-ongoing">Ongoing</span>
                ) : null}
              </li>
            ))}
          </ol>
        </div>
      ))}
      <p className="tl-footnote">
        Note: a month is shown only where the source gives one. Items in
        the same year follow source order.
      </p>
    </section>
  );
}
