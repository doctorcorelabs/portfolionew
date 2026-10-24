/**
 * Quote.tsx - Onlines home-quote-block, translated for DaivanLabs.
 * The H1 claim block directly after the hero: one big claim sentence,
 * one short mission line, and the Onlines dashed vertical rule with
 * square nodes at both ends (a measuring-line motif, not decoration).
 * All copy is the user's own positioning; no credentials are invented.
 */

const INK = "#010101";
const GRAPHITE = "#3C3C38";
const MARGIN_GREY = "#6F6F68";
const BLUE = "#0859D4";
const DISPLAY =
  "'Inter', 'Inter Display', Arial, -apple-system, 'Segoe UI', sans-serif";
const MONO =
  "'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace";

export default function Quote() {
  return (
    <section
      aria-labelledby="quote-heading"
      style={{
        background: "#FFFFFF",
        color: INK,
        fontFamily: DISPLAY,
        padding: "130px 24px",
      }}
    >
      <div style={{ maxWidth: 1160, margin: "0 auto" }}>
        <div style={{ position: "relative", paddingLeft: 32 }}>
          {/* Dashed vertical rule with a square node at each end. */}
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              left: 5,
              top: 0,
              bottom: 0,
              borderLeft: "1px dashed rgba(18, 18, 19, 0.2)",
            }}
          />
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              left: 0,
              top: -5,
              width: 10,
              height: 10,
              background: "#FFFFFF",
              border: "1px solid #98989C",
            }}
          />
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              left: 0,
              bottom: -5,
              width: 10,
              height: 10,
              background: "#FFFFFF",
              border: "1px solid #98989C",
            }}
          />
          <p
            style={{
              fontFamily: MONO,
              fontSize: 12,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: MARGIN_GREY,
              margin: "0 0 24px",
            }}
          >
            DaivanLabs, in one sentence
          </p>
          <h1
            id="quote-heading"
            style={{
              fontSize: "clamp(34px, 4.5vw, 64px)",
              lineHeight: 1.05,
              letterSpacing: "-0.02em",
              fontWeight: 700,
              margin: "0 0 32px",
              maxWidth: 960,
            }}
          >
            I am a medical student and researcher in Indonesia. I study{" "}
            <strong>health questions</strong> and build{" "}
            <strong>tools</strong> around them, through DaivanLabs.
          </h1>
          <p
            style={{
              fontSize: 18,
              lineHeight: 1.65,
              color: GRAPHITE,
              maxWidth: 640,
              margin: 0,
            }}
          >
            Founder, DaivanLabs.{" "}
            <span style={{ color: BLUE }}>Code for Cure:</span> code that
            becomes healthcare tools, and connections that carry them
            further, toward sustainable health systems for Indonesia.
          </p>
        </div>
      </div>
    </section>
  );
}
