const ink = "#0A0A0A";
const paper = "#FFFFFF";
const graphite = "#3C3C38";
const marginGrey = "#6F6F68";
const hairline = "#D8D8D0";
const red = "#C8102E";

const displayFont = "Archivo, 'Helvetica Neue', Arial, sans-serif";
const serifFont = "Instrument Serif, Georgia, serif";
const monoFont = "'IBM Plex Mono', ui-monospace, SFMono-Regular, Menlo, monospace";

const steps = [
  {
    number: "01",
    title: "Question",
    body: "Start from a clinical question, not from a dataset or a tool. Define who it concerns, what is compared, and what outcome matters, before any analysis begins.",
  },
  {
    number: "02",
    title: "Data",
    body: "Gather and check the data with its method stated in the open: source, inclusion rules, and known gaps. A result is only as honest as the data behind it.",
  },
  {
    number: "03",
    title: "Visualization",
    body: "Turn the result into a figure that can be read and checked: a forest plot, a curve, or a timeline with axes, labels, and a plain-language reading note.",
  },
  {
    number: "04",
    title: "Tool",
    body: "Build the finding into a tool only when the evidence supports it, so the work leaves the manuscript and becomes usable, with its limits still attached.",
  },
];

export default function Methods() {
  return (
    <section
      aria-labelledby="methods-title"
      style={{
        background: paper,
        color: ink,
        borderTop: `1px solid ${hairline}`,
        padding: "80px 24px",
        fontFamily: displayFont,
        borderRadius: 0,
      }}
    >
      <div style={{ maxWidth: 960, margin: "0 auto" }}>
        <p
          style={{
            margin: "0 0 16px",
            fontFamily: monoFont,
            fontSize: 13,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: marginGrey,
          }}
        >
          FIG. 02 - Methods
        </p>
        <h2
          id="methods-title"
          style={{
            margin: "0 0 12px",
            fontSize: "clamp(40px, 6vw, 72px)",
            lineHeight: 1.02,
            fontWeight: 900,
            letterSpacing: "-0.03em",
          }}
        >
          How the work is done.
        </h2>
        <div
          aria-hidden="true"
          style={{ width: 48, height: 3, background: red, margin: "0 0 20px" }}
        />
        <p
          style={{
            margin: "0 0 48px",
            fontFamily: serifFont,
            fontStyle: "italic",
            fontSize: "clamp(20px, 2.5vw, 28px)",
            lineHeight: 1.4,
            color: graphite,
            maxWidth: 620,
          }}
        >
          From a clinical question to a tool people can use.
        </p>
        <ol style={{ listStyle: "none", margin: 0, padding: 0, borderTop: `1px solid ${hairline}` }}>
          {steps.map((step) => (
            <li
              key={step.number}
              style={{
                display: "grid",
                gridTemplateColumns: "64px 1fr",
                gap: 24,
                padding: "32px 0",
                borderBottom: `1px solid ${hairline}`,
              }}
            >
              <span
                aria-hidden="true"
                style={{
                  fontSize: 28,
                  fontWeight: 900,
                  lineHeight: 1.1,
                  color: ink,
                }}
              >
                {step.number}
              </span>
              <div>
                <h3
                  style={{
                    margin: "0 0 8px",
                    fontSize: 24,
                    fontWeight: 800,
                    lineHeight: 1.2,
                  }}
                >
                  {step.title}
                </h3>
                <p
                  style={{
                    margin: 0,
                    fontSize: 17,
                    lineHeight: 1.65,
                    fontWeight: 400,
                    color: graphite,
                    maxWidth: 640,
                  }}
                >
                  {step.body}
                </p>
              </div>
            </li>
          ))}
        </ol>
        <p
          style={{
            margin: "32px 0 0",
            fontFamily: monoFont,
            fontSize: 13,
            lineHeight: 1.6,
            color: marginGrey,
          }}
        >
          [1] The order is fixed. A step is never skipped to reach a tool faster.
        </p>
      </div>
    </section>
  );
}
