import { useState } from "react";

/* DbLogoRow: the four REAL database logos as one compact flex row,
   for the hero mobile stack (below 720px the collage becomes a
   static stack, so the free-floating desktop logos need one compact
   row item). Small white tiles, no tilt, no animation. Each tile
   shows a real logo image from public/logos/, never a text wordmark
   or a drawn imitation. ScienceDirect uses the compact official SD
   icon (sciencedirect-icon.png): the horizontal wordmark is too wide
   for small tiles. If a logo file fails to load, its tile hides
   itself entirely (no broken image, no text fallback). Tiles carry
   no claim text. */

const PAPER = "#FFFFFF";
const BORDER = "#E0E0E0";

type Brand = "pubmed" | "elsevier" | "scopus" | "sciencedirect";

const BRANDS: Array<{ brand: Brand; label: string; src: string }> = [
  { brand: "pubmed", label: "PubMed", src: "/logos/pubmed.png" },
  { brand: "elsevier", label: "Elsevier", src: "/logos/elsevier.png" },
  { brand: "scopus", label: "Scopus", src: "/logos/scopus.png" },
  {
    brand: "sciencedirect",
    label: "ScienceDirect",
    src: "/logos/sciencedirect-icon.png",
  },
];

function DbLogoTile({ brand }: { brand: Brand }) {
  const [failed, setFailed] = useState(false);
  const entry = BRANDS.find((b) => b.brand === brand);
  if (failed || !entry) {
    return null;
  }
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        background: PAPER,
        border: `1px solid ${BORDER}`,
        borderRadius: 8,
        boxShadow: "0 2px 8px rgba(1, 1, 1, 0.06)",
        padding: 4,
        boxSizing: "border-box",
      }}
    >
      <img
        src={entry.src}
        alt={`${entry.label} logo`}
        onError={() => setFailed(true)}
        style={{
          display: "block",
          /* Art 20px tall, width auto, capped at 60px: wordmark
             tiles land at about 72-76px wide, the square SD icon
             tile at 30px, and the whole row totals about 268px
             against the 272px mobile column, so all four tiles fit
             on one row at a 320px viewport (4px slack). The row
             still wraps (never overflows) on narrower columns or
             if a tile image is ever replaced by a wider asset. */
          height: 20,
          width: "auto",
          maxWidth: 60,
          objectFit: "contain",
        }}
      />
    </div>
  );
}

export function DbLogoRow() {
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: 6,
        alignItems: "center",
        maxWidth: "100%",
        boxSizing: "border-box",
      }}
    >
      {BRANDS.map((b) => (
        <DbLogoTile key={b.brand} brand={b.brand} />
      ))}
    </div>
  );
}

export default DbLogoRow;
