/* SearchWindow: a browser-window mockup for the hero collage.
   Self-contained and presentational: no props, no data fetching.
   HARD RULES: the results area is skeleton bars only, never fake paper
   titles; no result count is ever written; no numbers appear in any
   visible copy. The "Interface mockup" footer keeps it from ever being
   mistaken for a real screenshot. */

const DISPLAY_FONT = "'Inter Display', Inter, Arial, sans-serif";
const MONO_FONT =
  "'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace";

const INK = "#010101";
const PAPER = "#FFFFFF";
const BLUE = "#0859D4";
const BORDER = "#E0E0E0";
const GREY = "#98989C";
const FAINT = "#F0F0F0";

/* Skeleton row widths only (styling, never content): a long title bar
   plus two short meta bars, in decreasing widths for a natural feel. */
const ROWS: Array<{ title: string; meta: [string, string] }> = [
  { title: "92%", meta: ["38%", "24%"] },
  { title: "76%", meta: ["44%", "20%"] },
  { title: "84%", meta: ["32%", "28%"] },
];

function Magnifier() {
  return (
    <svg
      aria-hidden="true"
      width="14"
      height="14"
      viewBox="0 0 14 14"
      style={{ display: "block", flexShrink: 0 }}
    >
      <circle
        cx="6"
        cy="6"
        r="4"
        fill="none"
        stroke={GREY}
        strokeWidth="1.5"
      />
      <line
        x1="9.5"
        y1="9.5"
        x2="13"
        y2="13"
        stroke={GREY}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function SearchWindow() {
  return (
    <div
      aria-label="Search interface mockup"
      style={{
        background: PAPER,
        border: `1px solid ${BORDER}`,
        borderRadius: 12,
        boxShadow: "0 12px 32px rgba(1, 1, 1, 0.12)",
        width: 260,
        maxWidth: 260,
        boxSizing: "border-box",
        fontFamily: DISPLAY_FONT,
        color: INK,
        overflow: "hidden",
      }}
    >
      {/* Browser chrome: three dots plus an address pill. */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "10px 12px",
          borderBottom: `1px solid ${FAINT}`,
        }}
      >
        <span
          aria-hidden="true"
          style={{
            display: "flex",
            gap: 5,
          }}
        >
          <i
            style={{
              display: "block",
              width: 10,
              height: 10,
              borderRadius: "50%",
              background: BORDER,
            }}
          />
          <i
            style={{
              display: "block",
              width: 10,
              height: 10,
              borderRadius: "50%",
              background: GREY,
            }}
          />
          <i
            style={{
              display: "block",
              width: 10,
              height: 10,
              borderRadius: "50%",
              background: BLUE,
            }}
          />
        </span>
        <span
          style={{
            flex: 1,
            background: FAINT,
            borderRadius: 999,
            padding: "4px 10px",
            fontFamily: MONO_FONT,
            fontSize: 10,
            letterSpacing: "0.04em",
            color: INK,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          pubmed.ncbi.nlm.nih.gov
        </span>
      </div>

      {/* Search field showing a recorded research topic as the query. */}
      <div style={{ padding: "12px 12px 10px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            border: `1px solid ${BORDER}`,
            borderRadius: 999,
            padding: "8px 12px",
          }}
        >
          <Magnifier />
          <span style={{ fontSize: 13, fontWeight: 500 }}>
            gut axis leukemia
          </span>
        </div>
      </div>

      {/* Results area: skeleton bars only, never title text. */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 14,
          padding: "2px 12px 12px",
        }}
      >
        {ROWS.map((row, index) => (
          <div key={index} aria-hidden="true">
            <div
              style={{
                width: row.title,
                height: 10,
                borderRadius: 4,
                background: BORDER,
              }}
            />
            <div
              style={{
                display: "flex",
                gap: 6,
                marginTop: 6,
              }}
            >
              <div
                style={{
                  width: row.meta[0],
                  height: 6,
                  borderRadius: 3,
                  background: FAINT,
                }}
              />
              <div
                style={{
                  width: row.meta[1],
                  height: 6,
                  borderRadius: 3,
                  background: FAINT,
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Honesty footer. */}
      <p
        style={{
          margin: 0,
          padding: "0 12px 12px",
          fontFamily: MONO_FONT,
          fontSize: 10,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: GREY,
        }}
      >
        Interface mockup
      </p>
    </div>
  );
}

export default SearchWindow;
