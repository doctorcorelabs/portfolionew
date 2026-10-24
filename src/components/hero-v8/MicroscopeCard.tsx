const INK = "#010101";
const PAPER = "#FFFFFF";
const BLUE = "#0859D4";
const GREY = "#98989C";
const BORDER = "#E0E0E0";
const MONO = "'JetBrains Mono', monospace";

/* Microscope card for the v8 hero collage: an AI-generated lab
   ambience image, presented honestly as illustration. The caption
   bar says "Illustrative ambience" so the photo is never read as a
   real lab or real work. No props: the collage parent positions
   this card. */
export function MicroscopeCard() {
  return (
    <figure
      className="hero-microscope-card"
      style={{
        margin: 0,
        background: PAPER,
        border: `1px solid ${BORDER}`,
        borderRadius: 10,
        boxShadow: "0 8px 24px rgba(1, 1, 1, 0.10)",
        overflow: "hidden",
        boxSizing: "border-box",
      }}
    >
      <style>{`
        .hero-microscope-card img {
          display: block;
          width: 100%;
          aspect-ratio: 4 / 3;
          object-fit: cover;
        }
      `}</style>
      <img
        src="/hero-microscope.jpg"
        alt="Blue microscope with glass slides and petri dishes, illustrative ambience"
      />
      <figcaption
        style={{
          display: "flex",
          alignItems: "baseline",
          gap: 8,
          padding: "10px 12px",
          background: PAPER,
          borderTop: `1px solid ${BORDER}`,
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
          UNDER THE MICROSCOPE
        </span>
        <span
          style={{
            fontFamily: MONO,
            fontSize: 11,
            color: GREY,
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

export default MicroscopeCard;
