/* NotifyBubble: a reference-style notification bubble for the hero v8
   collage. Self-contained and presentational: no props, no data
   fetching. The facts shown are verified: the FAERS abstract was
   accepted as a poster, poster code ABST-000034, at Hypertension Seoul
   2026. No timestamp, no invented details, and no numbers beyond the
   poster code itself (a code, not a result). The bubble itself is
   unrotated; the Hero integrator applies any tilt via its wrapper. */

const DISPLAY_FONT = "'Inter Display', Inter, Arial, sans-serif";
const MONO_FONT =
  "'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace";

const INK = "#010101";
const PAPER = "#FFFFFF";
const BLUE = "#0859D4";
const GREY = "#98989C";
const BORDER = "#E0E0E0";

export function NotifyBubble() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        background: PAPER,
        border: `1px solid ${BORDER}`,
        borderRadius: 14,
        boxShadow: "0 12px 28px rgba(1, 1, 1, 0.12)",
        padding: "10px 14px",
        boxSizing: "border-box",
        fontFamily: DISPLAY_FONT,
        color: INK,
      }}
    >
      <span
        aria-hidden="true"
        style={{
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: 28,
          height: 28,
          borderRadius: "50%",
          background: BLUE,
        }}
      >
        <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
          <path
            d="M2 7.5 L5.5 11 L12 3.5"
            fill="none"
            stroke={PAPER}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      <span style={{ display: "block", lineHeight: 1.3 }}>
        <span
          style={{
            display: "block",
            fontSize: 13,
            fontWeight: 700,
            color: INK,
          }}
        >
          Poster accepted
        </span>
        <span
          style={{
            display: "block",
            fontFamily: MONO_FONT,
            fontSize: 10,
            letterSpacing: "0.06em",
            color: GREY,
          }}
        >
          Hypertension Seoul 2026 · ABST-000034
        </span>
      </span>
    </div>
  );
}

export default NotifyBubble;
