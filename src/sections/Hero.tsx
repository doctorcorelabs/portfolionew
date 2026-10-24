/**
 * Hero, Onlines style (research/03-onlines-layout.md section 5).
 *
 * One giant word only: "daivanlabs." in Inter 700, framed by a dashed
 * selection box with 6 small square handles, on a faint graph-paper grid.
 * Exactly like the reference: no CTA button, no subline, no image inside
 * the hero. The word is the visual. The identity claim lives in the quote
 * section that follows, not here.
 *
 * Deliberate deviations from the reference, for accessibility:
 * - No nowrap trap: the word may wrap on narrow screens.
 * - No scroll lock, standard cursor.
 * - All values are inline, so this file works standalone even while the
 *   shared token file is being rewritten by a parallel agent.
 */

const INK = "#010101";
const GRID_LINE = "rgba(18, 18, 19, 0.06)";
const DASH = "rgba(18, 18, 19, 0.2)";
const HANDLE_BORDER = "#98989c";
const MICRO_GREY = "rgba(66, 66, 66, 0.6)";

const DISPLAY_FONT =
  "'Inter Display', Inter, Arial, sans-serif";
const MONO_FONT =
  "'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace";

/* 6 handles: 4 corners + left and right side midpoints. */
const HANDLES: Array<React.CSSProperties> = [
  { top: -5, left: -5 },
  { top: -5, right: -5 },
  { top: "50%", left: -5, transform: "translateY(-50%)" },
  { top: "50%", right: -5, transform: "translateY(-50%)" },
  { bottom: -5, left: -5 },
  { bottom: -5, right: -5 },
];

export default function Hero() {
  return (
    <section
      aria-label="DaivanLabs"
      style={{
        position: "relative",
        overflow: "hidden",
        minHeight: 550,
        height: "calc(100dvh - 100px)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#ffffff",
        backgroundImage: `linear-gradient(${GRID_LINE} 1px, transparent 1px), linear-gradient(90deg, ${GRID_LINE} 1px, transparent 1px)`,
        backgroundSize: "40px 40px",
        padding: "80px 24px",
        boxSizing: "border-box",
      }}
    >
      <style>{`
        @keyframes onlines-hero-fade {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @media (prefers-reduced-motion: reduce) {
          .onlines-hero-frame { animation: none !important; }
        }
      `}</style>
      <p
        style={{
          margin: "0 0 32px",
          fontFamily: MONO_FONT,
          fontSize: 12,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: MICRO_GREY,
        }}
      >
        Portfolio - Est. 2025
      </p>
      <div
        className="onlines-hero-frame"
        style={{
          position: "relative",
          display: "inline-block",
          maxWidth: 1160,
          width: "100%",
          border: `1px dashed ${DASH}`,
          padding: "28px 32px",
          boxSizing: "border-box",
          textAlign: "center",
          animation: "onlines-hero-fade 0.8s ease-out both",
        }}
      >
        {HANDLES.map((position, index) => (
          <span
            key={index}
            aria-hidden="true"
            style={{
              position: "absolute",
              width: 10,
              height: 10,
              background: "#ffffff",
              border: `1px solid ${HANDLE_BORDER}`,
              boxSizing: "border-box",
              ...position,
            }}
          />
        ))}
        <h1
          style={{
            margin: 0,
            fontFamily: DISPLAY_FONT,
            fontWeight: 700,
            fontSize: "clamp(72px, 16vw, 180px)",
            lineHeight: 0.95,
            letterSpacing: "-1.8px",
            color: INK,
            overflowWrap: "break-word",
          }}
        >
          daivanlabs.
        </h1>
      </div>
    </section>
  );
}
