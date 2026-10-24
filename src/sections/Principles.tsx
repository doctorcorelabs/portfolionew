const ink = "#0A0A0A";
const paper = "#FFFFFF";
const graphite = "#3C3C38";
const marginGrey = "#6F6F68";
const hairline = "#D8D8D0";
const red = "#C8102E";

const displayFont = "Archivo, 'Helvetica Neue', Arial, sans-serif";
const serifFont = "Instrument Serif, Georgia, serif";
const monoFont = "'IBM Plex Mono', ui-monospace, SFMono-Regular, Menlo, monospace";

const principles = [
  {
    marker: "P1",
    title: "Transparent methods",
    body: "Every method, source, and choice is written down where a reader can check it. If a step cannot be shown, it is said plainly, not hidden.",
  },
  {
    marker: "P2",
    title: "Honest visualization",
    body: "A figure shows what the data supports and nothing more. Axes are not stretched to exaggerate, and uncertainty is drawn, not smoothed away.",
  },
  {
    marker: "P3",
    title: "Limitations stated",
    body: "Every result carries its limits beside it: sample, bias, and what the study cannot claim. A limit is part of the result, not a footnote to skip.",
  },
  {
    marker: "P4",
    title: "Numbers only from verified sources",
    body: "A number appears only when its source can be named and checked. Unverified figures stay off the page, even when they would look impressive.",
  },
];

export default function Principles() {
  return (
    <section
      aria-labelledby="principles-title"
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
          FIG. 05 - Principles
        </p>
        <h2
          id="principles-title"
          style={{
            margin: "0 0 12px",
            fontSize: "clamp(40px, 6vw, 72px)",
            lineHeight: 1.02,
            fontWeight: 900,
            letterSpacing: "-0.03em",
          }}
        >
          What the work will not do.
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
          Four rules that hold for every study and every tool on this site.
        </p>
        <div style={{ borderTop: `1px solid ${hairline}` }}>
          {principles.map((principle) => (
            <div
              key={principle.marker}
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
                  fontFamily: monoFont,
                  fontSize: 15,
                  fontWeight: 500,
                  lineHeight: 1.6,
                  color: ink,
                }}
              >
                [{principle.marker}]
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
                  {principle.title}
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
                  {principle.body}
                </p>
              </div>
            </div>
          ))}
        </div>
        <p
          style={{
            margin: "32px 0 0",
            fontFamily: monoFont,
            fontSize: 13,
            lineHeight: 1.6,
            color: marginGrey,
          }}
        >
          [1] A principle that is broken once, quietly, is not a principle.
        </p>
      </div>
    </section>
  );
}
