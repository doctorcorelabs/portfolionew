/**
 * DockingCard: a small illustrative schematic of in silico drug
 * discovery. The shapes are abstract only: a protein-pocket outline,
 * a generic ligand shape, and dashed interaction lines. No real
 * molecule structure, no compound name, no numbers.
 */
export function DockingCard() {
  return (
    <div
      aria-hidden="true"
      style={{
        background: "#FFFFFF",
        border: "1px solid #E0E0E0",
        borderRadius: 12,
        boxSizing: "border-box",
        padding: 12,
        width: 230,
      }}
    >
      <svg
        viewBox="0 0 200 118"
        width="100%"
        height="auto"
        style={{ display: "block" }}
      >
        {/* Protein pocket: rounded blob outline with an open notch. */}
        <path
          d="M 30 78 C 12 58, 22 30, 52 22 C 78 15, 108 16, 132 26 C 160 36, 176 56, 168 78 C 160 100, 128 108, 96 106 C 64 104, 46 96, 30 78 Z"
          fill="#F5F5F7"
          stroke="#010101"
          strokeWidth="1.5"
        />
        {/* Inner pocket curve where the ligand sits. */}
        <path
          d="M 78 62 C 88 74, 112 74, 122 62 C 112 56, 88 56, 78 62 Z"
          fill="#FFFFFF"
          stroke="#98989C"
          strokeWidth="1"
        />
        {/* Abstract ligand shape: a plain hexagon, no chemistry. */}
        <polygon
          points="100,44 114,52 114,68 100,76 86,68 86,52"
          fill="#0859D4"
          opacity="0.9"
        />
        {/* Dashed interaction lines from ligand to pocket edge. */}
        <line
          x1="100"
          y1="44"
          x2="100"
          y2="26"
          stroke="#0859D4"
          strokeWidth="1"
          strokeDasharray="4 4"
        />
        <line
          x1="86"
          y1="68"
          x2="64"
          y2="82"
          stroke="#0859D4"
          strokeWidth="1"
          strokeDasharray="4 4"
        />
        <line
          x1="114"
          y1="68"
          x2="138"
          y2="82"
          stroke="#0859D4"
          strokeWidth="1"
          strokeDasharray="4 4"
        />
      </svg>
      <p
        style={{
          color: "#010101",
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 10,
          letterSpacing: "0.08em",
          margin: "10px 0 2px",
          textTransform: "uppercase",
        }}
      >
        IN SILICO DRUG DISCOVERY
      </p>
      <p
        style={{
          color: "#98989C",
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 11,
          margin: 0,
        }}
      >
        Illustrative schematic
      </p>
    </div>
  );
}

export default DockingCard;
