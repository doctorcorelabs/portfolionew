/* DbStackCard: dark card for the hero collage, giving the database
   chips a high-contrast home (the v7 collage was all white cards;
   the reference hero mixes light and dark elements).
   FRAMING (critical): this card labels workflow search tools only.
   It must NEVER say "indexed in", "affiliated", "partner", or any
   endorsement wording. The database set (PubMed, Elsevier, Scopus,
   ScienceDirect) comes from the user's own 24 Oct request, not from
   CV.md, and is framed here as search tools, not indexing claims. */

import { DbChip } from "./DbChips";

const DISPLAY_FONT = "'Inter Display', Inter, Arial, sans-serif";
const MONO_FONT =
  "'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace";

const INK = "#010101";
const PAPER = "#FFFFFF";
const BLUE = "#0859D4";
const LIGHT_GREY = "#E0E0E0";

export function DbStackCard() {
  return (
    <div
      style={{
        background: INK,
        borderRadius: 12,
        boxShadow: "0 8px 24px rgba(1, 1, 1, 0.35)",
        padding: "14px 16px 16px",
        width: 220,
        boxSizing: "border-box",
        fontFamily: DISPLAY_FONT,
        color: PAPER,
      }}
    >
      <p
        style={{
          margin: "0 0 12px",
          fontFamily: MONO_FONT,
          fontSize: 10,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: LIGHT_GREY,
        }}
      >
        Where the evidence is searched
      </p>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 8,
          margin: "0 0 12px",
        }}
      >
        <DbChip name="PubMed" />
        <DbChip name="Elsevier" />
        <DbChip name="Scopus" />
        <DbChip name="ScienceDirect" />
      </div>
      <p
        style={{
          margin: 0,
          fontFamily: MONO_FONT,
          fontSize: 10,
          letterSpacing: "0.06em",
          color: LIGHT_GREY,
        }}
      >
        Search tools for systematic reviews
      </p>
      <span
        aria-hidden="true"
        style={{
          display: "block",
          width: 24,
          height: 3,
          marginTop: 10,
          background: BLUE,
          borderRadius: 2,
        }}
      />
    </div>
  );
}

export default DbStackCard;
