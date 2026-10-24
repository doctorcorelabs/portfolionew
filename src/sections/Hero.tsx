import SurvivalCurve from "../components/SurvivalCurve";

const INK = "#0A0A0A";
const PAPER = "#FFFFFF";
const GRAPHITE = "#3C3C38";
const MARGIN_GREY = "#6F6F68";
const HAIRLINE = "#D8D8D0";
const RED = "#C8102E";

const DISPLAY_FONT =
  "Archivo, 'Helvetica Neue', Arial, sans-serif";
const MONO_FONT =
  "'IBM Plex Mono', 'SFMono-Regular', Menlo, monospace";

export default function Hero() {
  return (
    <section
      style={{
        position: "relative",
        overflow: "hidden",
        background: PAPER,
        color: INK,
        padding: "64px 24px 48px",
      }}
    >
      <img
        src="/img/hero-curve.webp"
        alt=""
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          opacity: 0.12,
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "relative",
          maxWidth: "1160px",
          margin: "0 auto",
        }}
      >
        <p
          style={{
            margin: "0 0 24px",
            fontFamily: MONO_FONT,
            fontSize: "13px",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: MARGIN_GREY,
          }}
        >
          FIG. 00 - Portfolio, 2021 to present
        </p>
        <h1
          style={{
            margin: 0,
            fontFamily: DISPLAY_FONT,
            fontWeight: 900,
            fontSize: "clamp(72px, 16vw, 210px)",
            lineHeight: 0.92,
            letterSpacing: "-0.03em",
            color: INK,
          }}
        >
          research.
        </h1>
        <p
          style={{
            maxWidth: "56ch",
            margin: "32px 0 0",
            fontFamily: DISPLAY_FONT,
            fontWeight: 500,
            fontSize: "18px",
            lineHeight: 1.65,
            color: GRAPHITE,
          }}
        >
          I am Daivan Febri Juan Setiya, a medical student and researcher in
          Indonesia. I study health questions and build tools around them,
          through DaivanLabs.
        </p>
        <p
          style={{
            margin: "16px 0 0",
            fontFamily: DISPLAY_FONT,
            fontWeight: 500,
            fontSize: "17px",
            lineHeight: 1.65,
            color: INK,
          }}
        >
          Founder, DaivanLabs. Code for Cure.
        </p>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "12px",
            marginTop: "32px",
          }}
        >
          <a
            href="#research"
            style={{
              display: "inline-block",
              padding: "14px 24px",
              background: INK,
              color: PAPER,
              fontFamily: DISPLAY_FONT,
              fontWeight: 700,
              fontSize: "16px",
              textDecoration: "none",
              borderRadius: 0,
            }}
          >
            See the research
          </a>
          <a
            href="#contact"
            style={{
              display: "inline-block",
              padding: "14px 24px",
              background: "transparent",
              color: INK,
              fontFamily: DISPLAY_FONT,
              fontWeight: 700,
              fontSize: "16px",
              textDecoration: "none",
              border: `1px solid ${INK}`,
              borderRadius: 0,
            }}
          >
            Start a conversation
          </a>
        </div>
        <p
          style={{
            margin: "40px 0 0",
            fontFamily: MONO_FONT,
            fontSize: "13px",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: MARGIN_GREY,
          }}
        >
          Medicine / Research / Public Health / Cancer
        </p>
        <div
          style={{
            marginTop: "48px",
            borderTop: `1px solid ${HAIRLINE}`,
            paddingTop: "24px",
          }}
        >
          <SurvivalCurve />
          <p
            style={{
              margin: "8px 0 0",
              fontFamily: MONO_FONT,
              fontSize: "13px",
              color: MARGIN_GREY,
            }}
          >
            <span style={{ color: RED }}>◆</span> Motif only. This curve
            carries no study data.
          </p>
        </div>
      </div>
    </section>
  );
}
