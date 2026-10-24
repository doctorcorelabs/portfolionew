/* DbChips: stylized text wordmarks for four research databases, drawn in
   our own typography (Inter Display / JetBrains Mono). These are NOT
   official logo artwork: no brand mark was traced, copied, or downloaded.
   Each chip is a white pill with the database name in text plus one tiny
   generic SVG glyph (magnifier, book, grid, document), simple geometry
   only.

   Provenance note: the set of four names comes from the user's 24 Oct
   request for the hero enrichment. It is not sourced from CV.md, and the
   chips on their own make no claim of any kind about a relationship
   with any database. The workflow label lives on the stack card, not
   here. */

const MONO_FONT =
  "'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace";

const INK = "#010101";
const PAPER = "#FFFFFF";
const BLUE = "#0859D4";
const BORDER = "#E0E0E0";
const GREY = "#98989C";

export type DbName = "PubMed" | "Elsevier" | "Scopus" | "ScienceDirect";

function Glyph({ name }: { name: DbName }) {
  const common = {
    width: 14,
    height: 14,
    viewBox: "0 0 14 14",
    "aria-hidden": true,
    style: { display: "block", flexShrink: 0 },
  } as const;
  if (name === "PubMed") {
    return (
      <svg {...common}>
        <circle
          cx="6"
          cy="6"
          r="4"
          fill="none"
          stroke={BLUE}
          strokeWidth="1.5"
        />
        <line
          x1="9.5"
          y1="9.5"
          x2="13"
          y2="13"
          stroke={BLUE}
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    );
  }
  if (name === "Elsevier") {
    return (
      <svg {...common}>
        <path
          d="M2 1.5 H8 V12.5 H2 Z M8 1.5 H12 V12.5 H8 Z"
          fill="none"
          stroke={BLUE}
          strokeWidth="1.2"
        />
        <line x1="8" y1="1.5" x2="8" y2="12.5" stroke={BLUE} strokeWidth="1.2" />
      </svg>
    );
  }
  if (name === "Scopus") {
    return (
      <svg {...common}>
        <rect x="1.5" y="1.5" width="4.5" height="4.5" fill={BLUE} />
        <rect x="8" y="1.5" width="4.5" height="4.5" fill="none" stroke={BLUE} strokeWidth="1.2" />
        <rect x="1.5" y="8" width="4.5" height="4.5" fill="none" stroke={BLUE} strokeWidth="1.2" />
        <rect x="8" y="8" width="4.5" height="4.5" fill={GREY} />
      </svg>
    );
  }
  return (
    <svg {...common}>
      <path
        d="M3 1 H9 L12 4 V13 H3 Z"
        fill="none"
        stroke={BLUE}
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      <line x1="5" y1="6.5" x2="10" y2="6.5" stroke={GREY} strokeWidth="1.2" />
      <line x1="5" y1="9" x2="10" y2="9" stroke={GREY} strokeWidth="1.2" />
    </svg>
  );
}

export function DbChip({ name }: { name: DbName }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        background: PAPER,
        border: `1px solid ${BORDER}`,
        borderRadius: 999,
        boxShadow: "0 4px 12px rgba(1, 1, 1, 0.08)",
        padding: "5px 10px 5px 8px",
        fontFamily: MONO_FONT,
        fontSize: 11,
        letterSpacing: "0.02em",
        color: INK,
        whiteSpace: "nowrap",
      }}
    >
      <Glyph name={name} />
      {name}
    </span>
  );
}

const ALL: DbName[] = ["PubMed", "Elsevier", "Scopus", "ScienceDirect"];

export default function DbChips() {
  return (
    <span
      style={{
        display: "inline-flex",
        flexWrap: "wrap",
        gap: 8,
        alignItems: "center",
      }}
    >
      {ALL.map((name) => (
        <DbChip key={name} name={name} />
      ))}
    </span>
  );
}
