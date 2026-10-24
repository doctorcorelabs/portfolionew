/* Stickers: tiny floating tag elements for the hero v8 collage.
   Each sticker is a small pill, not a full card. Labels are recorded
   topics and methods only, with no numbers and no claims beyond the
   label itself. Stickers are unrotated here; the Hero integrator
   applies tilt via its own wrapper. */

const MONO_FONT =
  "'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace";

const INK = "#010101";
const PAPER = "#FFFFFF";
const BLUE = "#0859D4";
const GREY = "#98989C";
const FAINT = "#E0E0E0";

type StickerStyle = {
  color: string;
  borderColor: string;
  dotColor: string;
};

function StickerBase({
  label,
  style,
}: {
  label: string;
  style: StickerStyle;
}) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        background: PAPER,
        border: `1px solid ${style.borderColor}`,
        borderRadius: 999,
        boxShadow: "0 4px 12px rgba(1, 1, 1, 0.08)",
        padding: "6px 10px",
        fontFamily: MONO_FONT,
        fontSize: 10,
        letterSpacing: "0.12em",
        textTransform: "uppercase",
        whiteSpace: "nowrap",
        color: style.color,
      }}
    >
      <span
        aria-hidden="true"
        style={{
          width: 6,
          height: 6,
          borderRadius: "50%",
          background: style.dotColor,
          flexShrink: 0,
        }}
      />
      {label}
    </span>
  );
}

export function StickerSR() {
  return (
    <StickerBase
      label="SYSTEMATIC REVIEW"
      style={{ color: BLUE, borderColor: BLUE, dotColor: BLUE }}
    />
  );
}

export function StickerInSilico() {
  return (
    <StickerBase
      label="IN SILICO"
      style={{ color: INK, borderColor: INK, dotColor: INK }}
    />
  );
}

export function StickerGutAxis() {
  return (
    <StickerBase
      label="GUT AXIS"
      style={{ color: GREY, borderColor: FAINT, dotColor: GREY }}
    />
  );
}

export default function Stickers() {
  return (
    <span style={{ display: "inline-flex", gap: 8, alignItems: "center" }}>
      <StickerSR />
      <StickerInSilico />
      <StickerGutAxis />
    </span>
  );
}
