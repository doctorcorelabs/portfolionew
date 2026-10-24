/**
 * Manifesto: the dark methods block, Onlines section 5 equivalent.
 * Onlines tokens: dark #111, light text #FAFAFA, hairline on dark,
 * Inter for display, JetBrains Mono for labels, blue #0859D4 only
 * for the tiny step numbers. One idea per section, plain numbered
 * rows, no cards, no rounded corners.
 */

const DISPLAY =
  "Inter, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";
const MONO =
  "'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace";

const STEPS: Array<{ num: string; title: string; body: string }> = [
  {
    num: "01",
    title: "Question",
    body: "Start from the clinical question. Define who is studied, what is compared, and which outcome matters, before any analysis runs.",
  },
  {
    num: "02",
    title: "Data",
    body: "Gather and check the data with the methods, sources, inclusion rules, and gaps stated openly, not buried in a footnote.",
  },
  {
    num: "03",
    title: "Visualization",
    body: "Turn results into figures that can be read and checked: forest plots, curves, or timelines with axes, labels, and reading notes.",
  },
  {
    num: "04",
    title: "Tool",
    body: "Build findings into a tool only when the evidence supports it, with the limitations attached to the tool itself, not hidden from it.",
  },
];

export default function Manifesto() {
  return (
    <section
      id="manifesto"
      aria-labelledby="manifesto-heading"
      style={{
        background: "#111111",
        color: "#FAFAFA",
        fontFamily: DISPLAY,
        padding: "130px 24px",
      }}
    >
      <div style={{ maxWidth: 1160, margin: "0 auto" }}>
        <p
          style={{
            fontFamily: MONO,
            fontSize: 12,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "#98989C",
            margin: "0 0 24px",
          }}
        >
          Method
        </p>
        <h2
          id="manifesto-heading"
          style={{
            fontSize: "clamp(48px, 7vw, 72px)",
            lineHeight: 1.02,
            letterSpacing: "-0.02em",
            fontWeight: 700,
            margin: "0 0 64px",
            maxWidth: 900,
          }}
        >
          From question to tool.
        </h2>
        <ol style={{ listStyle: "none", margin: 0, padding: 0 }}>
          {STEPS.map((step) => (
            <li
              key={step.num}
              style={{
                borderTop: "1px solid rgba(255, 255, 255, 0.15)",
                padding: "32px 0",
                display: "flex",
                flexWrap: "wrap",
                gap: "16px 48px",
                alignItems: "baseline",
              }}
            >
              <span
                style={{
                  fontFamily: MONO,
                  fontSize: 13,
                  color: "#0859D4",
                  minWidth: 40,
                }}
              >
                {step.num}
              </span>
              <span
                style={{
                  fontSize: "clamp(28px, 4vw, 42px)",
                  fontWeight: 700,
                  letterSpacing: "-0.02em",
                  minWidth: 200,
                }}
              >
                {step.title}
              </span>
              <span
                style={{
                  fontSize: 18,
                  lineHeight: 1.65,
                  color: "#D8D8D8",
                  maxWidth: 640,
                }}
              >
                {step.body}
              </span>
            </li>
          ))}
        </ol>
        <p
          style={{
            fontFamily: MONO,
            fontSize: 13,
            lineHeight: 1.7,
            color: "#98989C",
            maxWidth: 640,
            margin: "48px 0 0",
          }}
        >
          [1] The order is fixed. No step is skipped to reach a tool faster.
        </p>
      </div>
    </section>
  );
}
