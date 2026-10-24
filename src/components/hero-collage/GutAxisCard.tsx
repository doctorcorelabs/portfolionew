/* Gut axis schematic card for the hero collage.
   Theme diagram only: four labeled nodes in a chain. No results,
   no numbers, no claims about effects or mechanisms. */

const MONO = "'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace";
const SANS = "'Inter', system-ui, -apple-system, sans-serif";

export default function GutAxisCard() {
  return (
    <div
      style={{
        background: "#FFFFFF",
        border: "1px solid #E0E0E0",
        borderRadius: 10,
        padding: "12px 14px 10px",
        boxShadow: "0 2px 12px rgba(1, 1, 1, 0.06)",
        boxSizing: "border-box",
      }}
    >
      <p
        style={{
          fontFamily: MONO,
          fontSize: 10,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: "#98989C",
          margin: "0 0 8px",
        }}
      >
        Gut axis and leukemia
      </p>
      <svg
        viewBox="0 0 280 150"
        width="100%"
        role="img"
        aria-label="Schematic chain: Microbiome, Gut, Immune, Blood"
        style={{ display: "block" }}
      >
        <defs>
          <marker
            id="gut-axis-arrow"
            markerWidth="8"
            markerHeight="8"
            refX="7"
            refY="3"
            orient="auto"
          >
            <path d="M0,0 L7,3 L0,6 Z" fill="#0859D4" />
          </marker>
        </defs>
        {/* Connectors */}
        <line x1="132" y1="38" x2="158" y2="38" stroke="#0859D4" strokeWidth="1.5" markerEnd="url(#gut-axis-arrow)" />
        <line x1="210" y1="56" x2="210" y2="92" stroke="#0859D4" strokeWidth="1.5" markerEnd="url(#gut-axis-arrow)" />
        <line x1="158" y1="112" x2="114" y2="112" stroke="#0859D4" strokeWidth="1.5" markerEnd="url(#gut-axis-arrow)" />
        {/* Microbiome */}
        <g>
          <rect x="10" y="20" width="120" height="36" rx="8" fill="#FFFFFF" stroke="#010101" strokeWidth="1" />
          <circle cx="26" cy="38" r="4" fill="#0859D4" />
          <text x="38" y="42" fontFamily={SANS} fontSize="13" fontWeight="600" fill="#010101">Microbiome</text>
        </g>
        {/* Gut (hub node) */}
        <g>
          <rect x="160" y="20" width="100" height="36" rx="8" fill="#0859D4" stroke="#0859D4" strokeWidth="1" />
          <text x="210" y="42" fontFamily={SANS} fontSize="13" fontWeight="700" fill="#FFFFFF" textAnchor="middle">Gut</text>
        </g>
        {/* Immune */}
        <g>
          <rect x="160" y="94" width="100" height="36" rx="8" fill="#FFFFFF" stroke="#010101" strokeWidth="1" />
          <circle cx="176" cy="112" r="4" fill="#0859D4" />
          <text x="188" y="116" fontFamily={SANS} fontSize="13" fontWeight="600" fill="#010101">Immune</text>
        </g>
        {/* Blood */}
        <g>
          <rect x="10" y="94" width="102" height="36" rx="8" fill="#FFFFFF" stroke="#010101" strokeWidth="1" />
          <circle cx="26" cy="112" r="4" fill="#0859D4" />
          <text x="38" y="116" fontFamily={SANS} fontSize="13" fontWeight="600" fill="#010101">Blood</text>
        </g>
      </svg>
      <p
        style={{
          fontFamily: MONO,
          fontSize: 11,
          color: "#98989C",
          margin: "8px 0 0",
        }}
      >
        Research theme · Illustrative schematic
      </p>
    </div>
  );
}
