import type { CSSProperties } from "react";

const ink = "#0A0A0A";
const paper = "#FFFFFF";
const archive = "#F2F2EF";
const graphite = "#3C3C38";
const marginGrey = "#6F6F68";
const hairline = "#D8D8D0";
const red = "#C8102E";

const sectionStyle: CSSProperties = {
  background: paper,
  color: ink,
  fontFamily: "Archivo, system-ui, sans-serif",
  padding: "72px 24px",
};

const innerStyle: CSSProperties = {
  margin: "0 auto",
  maxWidth: "1160px",
};

const figStyle: CSSProperties = {
  color: marginGrey,
  fontFamily: "'IBM Plex Mono', ui-monospace, monospace",
  fontSize: "13px",
  letterSpacing: "0.08em",
  textTransform: "uppercase",
};

const titleStyle: CSSProperties = {
  fontSize: "clamp(56px, 10vw, 144px)",
  fontWeight: 900,
  letterSpacing: "-0.03em",
  lineHeight: 0.95,
  margin: "16px 0 8px",
};

const serifStyle: CSSProperties = {
  fontFamily: "'Instrument Serif', Georgia, serif",
  fontSize: "clamp(20px, 2.4vw, 30px)",
  fontStyle: "italic",
  margin: "0 0 24px",
};

const introStyle: CSSProperties = {
  color: graphite,
  fontSize: "18px",
  lineHeight: 1.65,
  maxWidth: "56ch",
};

const rowStyle: CSSProperties = {
  borderTop: `1px solid ${hairline}`,
  display: "grid",
  gap: "16px",
  gridTemplateColumns: "minmax(0, 7fr) minmax(0, 3fr)",
  padding: "32px 0",
};

const rowTitleStyle: CSSProperties = {
  fontSize: "clamp(26px, 3.4vw, 44px)",
  fontWeight: 800,
  letterSpacing: "-0.02em",
  lineHeight: 1.05,
  margin: "8px 0 12px",
};

const metaStyle: CSSProperties = {
  color: marginGrey,
  fontFamily: "'IBM Plex Mono', ui-monospace, monospace",
  fontSize: "13px",
  letterSpacing: "0.08em",
  textTransform: "uppercase",
};

const bodyStyle: CSSProperties = {
  color: graphite,
  fontSize: "17px",
  lineHeight: 1.65,
  maxWidth: "56ch",
};

const plotTrackStyle: CSSProperties = {
  alignItems: "center",
  display: "flex",
  gap: "12px",
};

const plotLineStyle: CSSProperties = {
  background: hairline,
  flex: 1,
  height: "1px",
  position: "relative",
};

const plotMarkerStyle: CSSProperties = {
  background: ink,
  height: "14px",
  left: "50%",
  position: "absolute",
  top: "-7px",
  width: "14px",
};

const plotDiamondStyle: CSSProperties = {
  background: red,
  height: "14px",
  left: "50%",
  position: "absolute",
  top: "-7px",
  transform: "rotate(45deg)",
  width: "14px",
};

const noteStyle: CSSProperties = {
  background: archive,
  borderLeft: `3px solid ${red}`,
  color: graphite,
  fontSize: "15px",
  lineHeight: 1.6,
  margin: "20px 0 0",
  padding: "16px 20px",
};

const linkStyle: CSSProperties = {
  color: ink,
  textDecoration: "underline",
  textDecorationColor: red,
  textUnderlineOffset: "4px",
};

const tagStyle: CSSProperties = {
  border: `1px solid ${hairline}`,
  color: graphite,
  display: "inline-block",
  fontFamily: "'IBM Plex Mono', ui-monospace, monospace",
  fontSize: "12px",
  letterSpacing: "0.08em",
  margin: "0 8px 8px 0",
  padding: "6px 10px",
  textTransform: "uppercase",
};

type ToolRowProps = {
  index: string;
  name: string;
  status: string;
  description: string;
  featured?: boolean;
  children?: React.ReactNode;
};

function ToolRow({ index, name, status, description, featured, children }: ToolRowProps) {
  return (
    <article style={rowStyle}>
      <div>
        <p style={metaStyle}>
          {index} / {status}
        </p>
        <h3 style={rowTitleStyle}>{name}</h3>
        <p style={bodyStyle}>{description}</p>
        {children}
      </div>
      <div>
        <div style={plotTrackStyle} aria-hidden="true">
          <span style={metaStyle}>FIG</span>
          <span style={plotLineStyle}>
            <span style={featured ? plotDiamondStyle : plotMarkerStyle} />
          </span>
          <span style={metaStyle}>{index}</span>
        </div>
        <p style={{ ...metaStyle, marginTop: "16px", textTransform: "none", letterSpacing: "0" }}>
          {featured
            ? "Featured entry. Red diamond marks the featured tool in this index."
            : "Index entry. Square marks a tool in this index."}
        </p>
      </div>
    </article>
  );
}

export default function Tools() {
  return (
    <section style={sectionStyle} aria-labelledby="tools-heading">
      <div style={innerStyle}>
        <p style={figStyle}>FIG. 04 - Tools</p>
        <h2 id="tools-heading" style={titleStyle}>
          tools.
        </h2>
        <p style={serifStyle}>built from research, for learning and practice.</p>
        <p style={introStyle}>
          DaivanLabs is the umbrella for everything below. Founded in June 2025, it applies
          code to healthcare problems under the tagline Code for Cure: Code, Cure, Connect.
          The tools here are presented as an index, in the order they matter, not as a grid of
          equal cards.
        </p>

        <div style={{ marginTop: "48px" }}>
          <ToolRow
            index="T-01"
            name="StrokeSense AI Lab"
            status="Live / Featured"
            description="The most mature AI product under DaivanLabs. Its R1 rebuild, live since 22 October 2026, condensed the catalogue from 28 to 13 user-facing features, with Ask the Lab as the single AI entry point and FAST Live Check as the flagship. Its main vision is upload-based: a user uploads images or video, presses Analyze with AI, and the Cloudflare Worker analyzes them. Nothing is sent before that button is pressed."
            featured
          >
            <p style={{ ...bodyStyle, marginTop: "16px" }}>
              <a
                href="https://strokesenseai.daivanlabs.com"
                target="_blank"
                rel="noreferrer"
                style={linkStyle}
              >
                Visit StrokeSense AI Lab
              </a>{" "}
              <span style={{ color: marginGrey }}>(opens in a new tab)</span>
            </p>
            <p style={noteStyle}>
              <strong>Honesty note, labelled Live AI:</strong> upload results are an AI
              interpretation of the image, not a measurement. The FAST output is an
              Observation Sheet with no score and no diagnosis. Camera live checks are a
              secondary option; upload analysis is the main path.
            </p>
            <p style={{ marginTop: "20px" }}>
              <span style={tagStyle}>Ask the Lab</span>
              <span style={tagStyle}>FAST Live Check</span>
              <span style={tagStyle}>Upload analysis</span>
              <span style={tagStyle}>13 features</span>
            </p>
          </ToolRow>

          <ToolRow
            index="T-02"
            name="StrokeSense"
            status="Education-first / Featured origin"
            description="The original StrokeSense, and the origin of the StrokeSense line. It is presented here strictly as education: Brain Lab 3D with 14 modules, Movement Lab, Simulator, DocumentLens, CarePlan, Neuro, and FAST, for learning how stroke presents and how care is organized. No diagnostic or classification claim is made for it on this page."
          >
            <p style={{ marginTop: "20px" }}>
              <span style={tagStyle}>Brain Lab 3D</span>
              <span style={tagStyle}>Movement Lab</span>
              <span style={tagStyle}>Simulator</span>
              <span style={tagStyle}>DocumentLens</span>
              <span style={tagStyle}>FAST education</span>
            </p>
          </ToolRow>

          <ToolRow
            index="T-03"
            name="DaivanLabs"
            status="Umbrella / Since June 2025"
            description="The lab that frames both tools above. Founder Daivan Febri Juan Setiya. Code is the method, Cure is the direction of the work, and Connect is the network that moves work forward. This portfolio is the lab home: research first, tools as what research becomes when it can be used."
          />
        </div>

        <p
          style={{
            ...metaStyle,
            borderTop: `1px solid ${hairline}`,
            marginTop: "8px",
            paddingTop: "24px",
            textTransform: "none",
            letterSpacing: "0",
          }}
        >
          [1] Live status and feature counts reflect the R1 rebuild record of 22 October
          2026. [2] Deployment of StrokeSense AI Lab is recorded as temporary, for a
          competition. [3] Education-only framing for StrokeSense is deliberate: this page
          makes no clinical claim for it.
        </p>
      </div>
    </section>
  );
}
