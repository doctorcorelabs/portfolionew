/* DeskCard: a photo card for the hero collage (v8 enrichment).
   Self-contained and presentational: no props, no data fetching.
   HONESTY RULE: the image is illustrative ambience only. It does not
   show the user's real desk or real work, and the chart papers in it
   are abstract shapes, not real data. The caption says so plainly. */

const DISPLAY_FONT = "'Inter Display', Inter, Arial, sans-serif";
const MONO_FONT =
  "'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace";

const INK = "#010101";
const PAPER = "#FFFFFF";
const BLUE = "#0859D4";
const GREY = "#98989C";
const FAINT = "#E0E0E0";

export function DeskCard() {
  return (
    <div
      style={{
        background: PAPER,
        border: `1px solid ${FAINT}`,
        borderRadius: 12,
        boxShadow: "0 8px 24px rgba(1, 1, 1, 0.08)",
        overflow: "hidden",
        width: 220,
        boxSizing: "border-box",
        fontFamily: DISPLAY_FONT,
        color: INK,
      }}
    >
      <img
        src="/hero-desk.jpg"
        alt="Top-down view of a research desk with laptop, charts, notebook and coffee, illustrative ambience"
        style={{
          display: "block",
          width: "100%",
          aspectRatio: "4 / 3",
          objectFit: "cover",
        }}
      />
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "10px 12px",
          background: PAPER,
        }}
      >
        <span
          aria-hidden="true"
          style={{
            display: "block",
            width: 8,
            height: 8,
            flexShrink: 0,
            background: BLUE,
          }}
        />
        <span
          style={{
            fontFamily: MONO_FONT,
            fontSize: 10,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: INK,
          }}
        >
          The Work Desk
        </span>
        <span
          style={{
            marginLeft: "auto",
            fontFamily: MONO_FONT,
            fontSize: 10,
            letterSpacing: "0.06em",
            color: GREY,
            whiteSpace: "nowrap",
          }}
        >
          Illustrative ambience
        </span>
      </div>
    </div>
  );
}

export default DeskCard;
