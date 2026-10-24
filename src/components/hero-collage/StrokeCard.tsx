export default function StrokeCard() {
  return (
    <div
      style={{
        background: "#FFFFFF",
        border: "1px solid #E0E0E0",
        borderRadius: 10,
        padding: "14px 16px",
        boxShadow: "0 8px 24px rgba(1, 1, 1, 0.08)",
        fontFamily: "'Inter Display', Inter, Arial, sans-serif",
        color: "#010101",
        maxWidth: 260,
        boxSizing: "border-box",
      }}
    >
      <p
        style={{
          margin: 0,
          fontFamily: "'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace",
          fontSize: 11,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: "#0859D4",
        }}
      >
        STROKESENSE AI LAB
      </p>
      <p style={{ margin: "8px 0 0", fontSize: 15, lineHeight: 1.4, fontWeight: 600 }}>
        Education-first stroke learning lab
      </p>
      <p
        style={{
          margin: "8px 0 0",
          fontFamily: "'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace",
          fontSize: 10,
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          color: "#98989C",
        }}
      >
        Observation Sheet · No score · No diagnosis
      </p>
    </div>
  );
}
