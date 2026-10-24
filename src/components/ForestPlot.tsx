/**
 * ForestPlot: native SVG forest plot for FAERS disproportionality results.
 *
 * Design contract (research/10-visualisasi-riset.md section 1, and
 * research/11-arah-visual.md motif B):
 * - One row per verified drug and adverse event pair.
 * - Left column: drug and event names in mono.
 * - Middle: ROR point estimate with a horizontal 95 percent CI line.
 * - Right column: ROR, 95 percent CI, and case count in mono.
 * - Horizontal axis uses a log scale (0.1 to 100) with a dashed reference
 *   line at ROR = 1 (neutral: no reporting disproportionality).
 * - Rows sort by ROR, largest first.
 * - Marker size grows with case count (square root scale). A featured row
 *   uses an Evidence Red diamond instead of an Ink square.
 * - Rows with fewer than 3 cases are NOT plotted: their estimates are
 *   unstable. They still appear in the companion table with a note.
 * - No chart library is used. This component never invents data: it renders
 *   only the rows it receives, and the caller is responsible for verifying
 *   them before passing them in.
 */

export type ForestRow = {
  id: string;
  drug: string;
  drugGroup?: string;
  event: string;
  eventGroup?: string;
  ror: number;
  ciLow: number;
  ciHigh: number;
  cases: number | null; // null = event-case count not verified in available documents
  signal?: boolean;
  featured?: boolean;
  note?: string;
};

type ForestPlotProps = {
  rows: ForestRow[];
  studyLabel?: string;
};

const INK = "#010101";
const GRAPHITE = "#1D1D1F";
const MARGIN_GREY = "#666666";
const HAIRLINE = "#E0E0E0";
const ARCHIVE = "#F5F5F7";
const ACCENT = "#0859D4";

const MONO =
  "'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace";

/* Plot geometry. The SVG scales to its container width. */
const WIDTH = 960;
const LABEL_X = 8;
const PLOT_X = 308;
const PLOT_WIDTH = 412;
const VALUE_X = 732;
const ROW_HEIGHT = 46;
const HEADER_HEIGHT = 34;
const AXIS_HEIGHT = 30;

const LOG_MIN = Math.log10(0.1);
const LOG_MAX = Math.log10(100);

function logX(ror: number): number {
  const clamped = Math.min(Math.max(ror, 0.1), 100);
  return PLOT_X + ((Math.log10(clamped) - LOG_MIN) / (LOG_MAX - LOG_MIN)) * PLOT_WIDTH;
}

function markerSize(cases: number | null): number {
  if (cases === null) return 10; // uniform marker when the case count is unverified
  return Math.min(Math.max(5 + Math.sqrt(Math.max(cases, 0)) * 0.35, 5), 16);
}

function formatNumber(value: number): string {
  return value.toLocaleString("en-US", { maximumFractionDigits: 2 });
}

export default function ForestPlot({ rows, studyLabel }: ForestPlotProps) {
  const plotted = [...rows]
    .filter((row) => row.cases === null || row.cases >= 3)
    .sort((a, b) => b.ror - a.ror);
  const unstable = rows.filter((row) => row.cases !== null && row.cases < 3);
  const height = HEADER_HEIGHT + plotted.length * ROW_HEIGHT + AXIS_HEIGHT + 8;
  const axisTicks = [0.1, 1, 10, 100];
  const gridTicks = [0.1, 0.25, 0.5, 1, 2, 5, 10, 25, 50, 100];

  return (
    <figure style={{ margin: 0, width: "100%" }}>
      {studyLabel ? (
        <figcaption
          style={{
            fontFamily: MONO,
            fontSize: 12,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: MARGIN_GREY,
            marginBottom: 12,
          }}
        >
          {studyLabel}
        </figcaption>
      ) : null}
      <svg
        viewBox={`0 0 ${WIDTH} ${height}`}
        width="100%"
        role="img"
        aria-label="Forest plot of reporting odds ratios with 95 percent confidence intervals on a log scale"
        style={{ display: "block", background: "#FFFFFF" }}
      >
        {/* Column headers */}
        <text
          x={LABEL_X}
          y={20}
          fontFamily={MONO}
          fontSize={11}
          letterSpacing="0.08em"
          fill={MARGIN_GREY}
        >
          DRUG AND EVENT
        </text>
        <text
          x={PLOT_X + PLOT_WIDTH / 2}
          y={20}
          textAnchor="middle"
          fontFamily={MONO}
          fontSize={11}
          letterSpacing="0.08em"
          fill={MARGIN_GREY}
        >
          ROR (LOG SCALE)
        </text>
        <text
          x={VALUE_X}
          y={20}
          fontFamily={MONO}
          fontSize={11}
          letterSpacing="0.08em"
          fill={MARGIN_GREY}
        >
          ROR [95% CI] - CASES
        </text>
        <line
          x1={0}
          y1={HEADER_HEIGHT - 6}
          x2={WIDTH}
          y2={HEADER_HEIGHT - 6}
          stroke={HAIRLINE}
          strokeWidth={1}
        />

        {/* Gridlines and the neutral reference line at ROR = 1 */}
        {gridTicks.map((tick) => (
          <line
            key={`grid-${tick}`}
            x1={logX(tick)}
            y1={HEADER_HEIGHT}
            x2={logX(tick)}
            y2={HEADER_HEIGHT + plotted.length * ROW_HEIGHT}
            stroke={HAIRLINE}
            strokeWidth={tick === 1 ? 0 : 1}
          />
        ))}
        <line
          x1={logX(1)}
          y1={HEADER_HEIGHT}
          x2={logX(1)}
          y2={HEADER_HEIGHT + plotted.length * ROW_HEIGHT}
          stroke={ACCENT}
          strokeWidth={1.5}
          strokeDasharray="6 4"
        />
        <text
          x={logX(1)}
          y={HEADER_HEIGHT + plotted.length * ROW_HEIGHT + 20}
          textAnchor="middle"
          fontFamily={MONO}
          fontSize={10}
          fill={ACCENT}
        >
          1 = neutral
        </text>

        {/* Rows */}
        {plotted.map((row, index) => {
          const y = HEADER_HEIGHT + index * ROW_HEIGHT + ROW_HEIGHT / 2;
          const size = markerSize(row.cases);
          const center = logX(row.ror);
          const low = logX(row.ciLow);
          const high = logX(row.ciHigh);
          const label = `${row.drug}: ${row.event}. ROR ${formatNumber(row.ror)}, 95% CI ${formatNumber(row.ciLow)} to ${formatNumber(row.ciHigh)}, ${row.cases === null ? "event-case count not verified" : row.cases + " cases"}.`;
          return (
            <g key={row.id} tabIndex={0} aria-label={label}>
              <title>{label}</title>
              {index % 2 === 0 ? (
                <rect
                  x={0}
                  y={HEADER_HEIGHT + index * ROW_HEIGHT}
                  width={WIDTH}
                  height={ROW_HEIGHT}
                  fill={ARCHIVE}
                  opacity={0.45}
                />
              ) : null}
              <text
                x={LABEL_X}
                y={y - 2}
                fontFamily={MONO}
                fontSize={12}
                fontWeight={600}
                fill={INK}
              >
                {row.drug}
              </text>
              <text x={LABEL_X} y={y + 15} fontFamily={MONO} fontSize={11} fill={GRAPHITE}>
                {row.event}
              </text>
              <line x1={low} y1={y} x2={high} y2={y} stroke={INK} strokeWidth={1.5} />
              <line x1={low} y1={y - 5} x2={low} y2={y + 5} stroke={INK} strokeWidth={1.5} />
              <line x1={high} y1={y - 5} x2={high} y2={y + 5} stroke={INK} strokeWidth={1.5} />
              {row.featured ? (
                <rect
                  x={center - size / 2}
                  y={y - size / 2}
                  width={size}
                  height={size}
                  fill={ACCENT}
                  transform={`rotate(45 ${center} ${y})`}
                />
              ) : (
                <rect
                  x={center - size / 2}
                  y={y - size / 2}
                  width={size}
                  height={size}
                  fill={INK}
                />
              )}
              <text x={VALUE_X} y={y + 4} fontFamily={MONO} fontSize={12} fill={INK}>
                {formatNumber(row.ror)} [{formatNumber(row.ciLow)} - {formatNumber(row.ciHigh)}]
                {"  "}
                <tspan fill={GRAPHITE}>n = {row.cases === null ? "not verified" : row.cases}</tspan>
              </text>
            </g>
          );
        })}

        {/* Axis labels */}
        {axisTicks.map((tick) => (
          <text
            key={`axis-${tick}`}
            x={logX(tick)}
            y={HEADER_HEIGHT + plotted.length * ROW_HEIGHT + AXIS_HEIGHT - 2}
            textAnchor="middle"
            fontFamily={MONO}
            fontSize={11}
            fill={MARGIN_GREY}
          >
            {tick === 0.1 ? "0.1" : String(tick)}
          </text>
        ))}
      </svg>

      {/* Static companion table: the plot stays complete without hover. */}
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          marginTop: 20,
          fontFamily: MONO,
          fontSize: 12,
        }}
      >
        <thead>
          <tr style={{ borderBottom: `1px solid ${HAIRLINE}`, textAlign: "left" }}>
            <th style={{ padding: "8px 8px 8px 0", color: MARGIN_GREY }}>DRUG</th>
            <th style={{ padding: 8, color: MARGIN_GREY }}>EVENT</th>
            <th style={{ padding: 8, color: MARGIN_GREY }}>ROR</th>
            <th style={{ padding: 8, color: MARGIN_GREY }}>95% CI</th>
            <th style={{ padding: 8, color: MARGIN_GREY }}>CASES</th>
            <th style={{ padding: 8, color: MARGIN_GREY }}>NOTE</th>
          </tr>
        </thead>
        <tbody>
          {[...rows]
            .sort((a, b) => b.ror - a.ror)
            .map((row) => (
              <tr key={row.id} style={{ borderBottom: `1px solid ${HAIRLINE}` }}>
                <td style={{ padding: "8px 8px 8px 0", color: INK }}>{row.drug}</td>
                <td style={{ padding: 8, color: GRAPHITE }}>{row.event}</td>
                <td style={{ padding: 8, color: INK }}>{formatNumber(row.ror)}</td>
                <td style={{ padding: 8, color: INK }}>
                  {formatNumber(row.ciLow)} - {formatNumber(row.ciHigh)}
                </td>
                <td style={{ padding: 8, color: INK }}>{row.cases === null ? "not verified" : row.cases}</td>
                <td style={{ padding: 8, color: GRAPHITE }}>
                  {row.cases !== null && row.cases < 3
                    ? "Unstable estimate: shown in the table only, not plotted."
                    : (row.note ?? "")}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
      {unstable.length > 0 ? (
        <p style={{ fontFamily: MONO, fontSize: 12, color: MARGIN_GREY, lineHeight: 1.6 }}>
          {unstable.length} row{unstable.length === 1 ? "" : "s"} with fewer than 3 cases
          {unstable.length === 1 ? " is" : " are"} listed in the table only, because
          estimates from very few cases are unstable.
        </p>
      ) : null}
    </figure>
  );
}
