/* PosterWindow: browser-window mockup card for the hero collage.
   Self-contained, no props. It shows a mini preview of the user's
   real poster: title, poster code, congress, and N = 6,601 only.
   Everything else is abstract blocks and bars: no body text, no
   charts with values, no effect values, no confidence intervals,
   no p-values, no journal names, no DOIs, no author lists. */

const SANS = '"Inter Display", Inter, sans-serif';
const MONO = '"JetBrains Mono", monospace';

export function PosterWindow() {
  return (
    <div
      aria-hidden="true"
      style={{
        width: 280,
        boxSizing: "border-box",
        background: "#FFFFFF",
        border: "1px solid #E0E0E0",
        borderRadius: 10,
        boxShadow: "0 8px 24px rgba(1, 1, 1, 0.08)",
        fontFamily: SANS,
        color: "#010101",
        overflow: "hidden",
      }}
    >
      {/* Browser chrome bar: three dots plus an address pill. */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          padding: "10px 12px",
          background: "#F0F0F0",
          borderBottom: "1px solid #E0E0E0",
        }}
      >
        <span
          style={{
            width: 10,
            height: 10,
            borderRadius: "50%",
            background: "#98989C",
            flexShrink: 0,
          }}
        />
        <span
          style={{
            width: 10,
            height: 10,
            borderRadius: "50%",
            background: "#98989C",
            flexShrink: 0,
          }}
        />
        <span
          style={{
            width: 10,
            height: 10,
            borderRadius: "50%",
            background: "#0859D4",
            flexShrink: 0,
          }}
        />
        <span
          style={{
            marginLeft: 6,
            padding: "3px 10px",
            background: "#FFFFFF",
            border: "1px solid #E0E0E0",
            borderRadius: 20,
            fontFamily: MONO,
            fontSize: 10,
            letterSpacing: "0.08em",
            color: "#98989C",
            whiteSpace: "nowrap",
          }}
        >
          Poster preview
        </span>
      </div>
      {/* Mini poster body: real facts only, rest abstract blocks. */}
      <div style={{ padding: "16px 18px 14px" }}>
        <div
          style={{
            width: 56,
            height: 6,
            marginBottom: 10,
            background: "#0859D4",
          }}
        />
        <p
          style={{
            margin: "0 0 8px",
            fontSize: 16,
            lineHeight: 1.3,
            fontWeight: 700,
          }}
        >
          Comparative safety of newer therapies in resistant hypertension
        </p>
        <p
          style={{
            margin: "0 0 14px",
            fontFamily: MONO,
            fontSize: 11,
            lineHeight: 1.5,
            color: "#98989C",
          }}
        >
          ABST-000034 · Hypertension Seoul 2026
        </p>
        {/* Abstract poster blocks: no text, no chart values. */}
        <div
          style={{
            height: 64,
            marginBottom: 10,
            background: "#F0F0F0",
            border: "1px solid #E0E0E0",
            borderRadius: 6,
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              left: 12,
              bottom: 12,
              width: 60,
              height: 28,
              background: "#0859D4",
              borderRadius: 4,
            }}
          />
          <div
            style={{
              position: "absolute",
              right: 12,
              top: 12,
              width: 80,
              height: 8,
              background: "#E0E0E0",
              borderRadius: 4,
            }}
          />
          <div
            style={{
              position: "absolute",
              right: 12,
              top: 28,
              width: 52,
              height: 8,
              background: "#E0E0E0",
              borderRadius: 4,
            }}
          />
        </div>
        <div
          style={{
            height: 8,
            width: "100%",
            marginBottom: 6,
            background: "#E0E0E0",
            borderRadius: 4,
          }}
        />
        <div
          style={{
            height: 8,
            width: "72%",
            marginBottom: 6,
            background: "#E0E0E0",
            borderRadius: 4,
          }}
        />
        <div
          style={{
            height: 8,
            width: "48%",
            marginBottom: 14,
            background: "#E0E0E0",
            borderRadius: 4,
          }}
        />
        <div
          style={{
            borderTop: "1px dashed #E0E0E0",
            paddingTop: 10,
            display: "flex",
            alignItems: "baseline",
            justifyContent: "space-between",
          }}
        >
          <span
            style={{
              fontFamily: MONO,
              fontSize: 12,
              letterSpacing: "0.04em",
            }}
          >
            N = <span style={{ color: "#0859D4", fontWeight: 700 }}>6,601</span>
          </span>
          <span
            style={{
              fontFamily: MONO,
              fontSize: 10,
              letterSpacing: "0.08em",
              color: "#98989C",
            }}
          >
            Poster preview mockup
          </span>
        </div>
      </div>
    </div>
  );
}

export default PosterWindow;
