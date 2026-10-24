/* PosterCard: mini poster mock for the hero collage.
   Self-contained, no props. Content is limited to recorded facts:
   the Works title, the poster id and congress, and N = 6,601.
   No effect values, no confidence intervals, no p-values,
   no percentages of results. */

const SANS = '"Inter Display", Inter, sans-serif';
const MONO = '"JetBrains Mono", monospace';

export function PosterCard() {
  return (
    <div
      aria-hidden="true"
      style={{
        width: 260,
        boxSizing: "border-box",
        padding: "16px 18px",
        background: "#FFFFFF",
        border: "1px solid #E0E0E0",
        borderRadius: 10,
        boxShadow: "0 8px 24px rgba(1, 1, 1, 0.08)",
        fontFamily: SANS,
        color: "#010101",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginBottom: 10,
        }}
      >
        <span
          style={{
            width: 8,
            height: 8,
            background: "#0859D4",
            flexShrink: 0,
          }}
        />
        <span
          style={{
            fontFamily: MONO,
            fontSize: 11,
            letterSpacing: "0.12em",
            color: "#0859D4",
          }}
        >
          POSTER
        </span>
      </div>
      <p
        style={{
          margin: "0 0 10px",
          fontSize: 17,
          lineHeight: 1.3,
          fontWeight: 700,
        }}
      >
        Comparative safety of newer therapies in resistant hypertension
      </p>
      <p
        style={{
          margin: "0 0 12px",
          fontFamily: MONO,
          fontSize: 11,
          lineHeight: 1.5,
          color: "#98989C",
        }}
      >
        ABST-000034 · Hypertension Seoul 2026
      </p>
      <div
        style={{
          borderTop: "1px dashed #E0E0E0",
          paddingTop: 10,
          fontFamily: MONO,
          fontSize: 12,
          letterSpacing: "0.04em",
        }}
      >
        N = <span style={{ color: "#0859D4", fontWeight: 700 }}>6,601</span>
      </div>
    </div>
  );
}

export default PosterCard;
