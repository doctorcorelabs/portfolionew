/* AwardsCard: small hero-collage card, presentational only.
   Shows only recorded old-site aggregate stats: 29 awards total,
   12 of them international. Medal dots are decorative. */

const INK = "#010101";
const PAPER = "#FFFFFF";
const BLUE = "#0859D4";
const GOLD = "#C9A227";
const GREY = "#98989C";
const LIGHT_GREY = "#E0E0E0";

const DOTS: string[] = [
  GOLD, GOLD, GOLD, GOLD, GOLD, GOLD,
  BLUE, BLUE, BLUE,
  GREY, GREY, GREY,
];

export default function AwardsCard() {
  return (
    <div
      aria-hidden="true"
      style={{
        background: PAPER,
        border: `1px solid ${LIGHT_GREY}`,
        borderRadius: 10,
        boxShadow: "0 2px 12px rgba(1, 1, 1, 0.08)",
        padding: "14px 16px 12px",
        width: 168,
        boxSizing: "border-box",
        pointerEvents: "none",
      }}
    >
      <p
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 10,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: GREY,
          margin: "0 0 10px",
        }}
      >
        Awards
      </p>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 5,
          maxWidth: 110,
          marginBottom: 10,
        }}
      >
        {DOTS.map((color, i) => (
          <span
            key={i}
            style={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              background: color,
              display: "inline-block",
            }}
          />
        ))}
      </div>
      <p
        style={{
          fontFamily: "'Inter Display', Inter, sans-serif",
          fontSize: 22,
          fontWeight: 700,
          lineHeight: 1.1,
          color: INK,
          margin: "0 0 2px",
        }}
      >
        29 awards
      </p>
      <p
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 11,
          color: BLUE,
          margin: 0,
        }}
      >
        12 international
      </p>
    </div>
  );
}
