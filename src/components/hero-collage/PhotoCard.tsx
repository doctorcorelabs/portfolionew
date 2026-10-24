const INK = "#010101";
const PAPER = "#FFFFFF";
const BLUE = "#0859D4";
const MONO = "'JetBrains Mono', monospace";

/* Photo card for the hero collage: an AI-generated lab ambience
   image, presented honestly as illustration. The caption bar says
   "Illustrative ambience" so the photo is never read as a real lab
   or real work. No props: the collage parent positions this card. */
export default function PhotoCard() {
  return (
    <figure
      className="hero-photo-card"
      style={{
        margin: 0,
        background: PAPER,
        border: `1px solid ${INK}`,
        borderRadius: 10,
        overflow: "hidden",
        boxSizing: "border-box",
      }}
    >
      <style>{`
        .hero-photo-card img {
          display: block;
          width: 100%;
          aspect-ratio: 4 / 3;
          object-fit: cover;
        }
      `}</style>
      <img
        src="/hero-lab.jpg"
        alt="Blue laboratory glassware and petri dishes, illustrative ambience"
      />
      <figcaption
        style={{
          display: "flex",
          alignItems: "baseline",
          gap: 8,
          padding: "10px 12px",
          background: PAPER,
          borderTop: `1px solid ${INK}`,
        }}
      >
        <span
          aria-hidden="true"
          style={{
            display: "inline-block",
            width: 8,
            height: 8,
            background: BLUE,
            flexShrink: 0,
            transform: "translateY(-1px)",
          }}
        />
        <span
          style={{
            fontFamily: MONO,
            fontSize: 11,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: INK,
          }}
        >
          IN THE LAB
        </span>
        <span
          style={{
            fontFamily: MONO,
            fontSize: 11,
            color: "#98989C",
            marginLeft: "auto",
            textAlign: "right",
          }}
        >
          Illustrative ambience
        </span>
      </figcaption>
    </figure>
  );
}
