import React from "react";

/* ReviewCard: a qualitative systematic-review funnel for the hero collage.
   Self-contained and presentational: no props, no data fetching.
   HARD RULE: no counts or numbers appear on this card. The sources record
   the review topics and stages, but no screened/included counts, so the
   funnel shows shape only (wide to narrow), never figures. */

const DISPLAY_FONT = "'Inter Display', Inter, Arial, sans-serif";
const MONO_FONT =
  "'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace";

const INK = "#010101";
const PAPER = "#FFFFFF";
const BLUE = "#0859D4";
const GREY = "#98989C";
const DARK_GREY = "#4A4A4A";
const FAINT = "#F0F0F0";

const STAGES: Array<{ label: string; width: string; fill: string }> = [
  { label: "Identification", width: "100%", fill: BLUE },
  { label: "Screening", width: "72%", fill: "#3A7DE0" },
  { label: "Synthesis", width: "44%", fill: "#7FA8E8" },
];

function FunnelArrow() {
  return (
    <svg
      aria-hidden="true"
      width="12"
      height="10"
      viewBox="0 0 12 10"
      style={{ display: "block", margin: "2px auto" }}
    >
      <path d="M6 10 L0 0 H12 Z" fill={GREY} />
    </svg>
  );
}

export default function ReviewCard() {
  return (
    <div
      aria-label="Systematic review funnel"
      style={{
        background: PAPER,
        border: `1px solid ${FAINT}`,
        borderRadius: 12,
        boxShadow: "0 8px 24px rgba(1, 1, 1, 0.08)",
        padding: "14px 16px 16px",
        width: 220,
        boxSizing: "border-box",
        fontFamily: DISPLAY_FONT,
        color: INK,
      }}
    >
      <p
        style={{
          margin: "0 0 4px",
          fontFamily: MONO_FONT,
          fontSize: 10,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: GREY,
        }}
      >
        Systematic Review
      </p>
      <p
        style={{
          margin: "0 0 12px",
          fontSize: 13,
          fontWeight: 600,
          color: DARK_GREY,
        }}
      >
        PCOS · Bisphenol A · Gut axis
      </p>
      <div>
        {STAGES.map((stage, index) => (
          <React.Fragment key={stage.label}>
            {index > 0 && <FunnelArrow />}
            <div
              style={{
                width: stage.width,
                margin: "0 auto",
                background: stage.fill,
                borderRadius: 6,
                padding: "7px 10px",
                boxSizing: "border-box",
                fontFamily: MONO_FONT,
                fontSize: 11,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                color: PAPER,
                whiteSpace: "nowrap",
                overflow: "hidden",
              }}
            >
              {stage.label}
            </div>
          </React.Fragment>
        ))}
      </div>
      <p
        style={{
          margin: "12px 0 0",
          fontFamily: MONO_FONT,
          fontSize: 10,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: GREY,
        }}
      >
        Illustrative schematic
      </p>
    </div>
  );
}
