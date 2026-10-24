import { useState } from "react";

/* DbLogoRow: the four REAL database logos as one compact flex row,
   for the hero mobile stack (below 720px the collage becomes a
   static stack, so the free-floating desktop logos need one compact
   row item). Small white tiles, no tilt, no animation. Each tile
   shows a real logo image from public/logos/, never a text wordmark
   or a drawn imitation. Cochrane uses its portrait lockup
   (cochrane.png): a navy forest-plot C mark above the navy
   "Cochrane" wordmark on white. If a logo file fails to load, its
   tile hides itself entirely (no broken image, no text fallback).
   Tiles carry no claim text. */

const PAPER = "#FFFFFF";
const BORDER = "#E0E0E0";

type Brand = "pubmed" | "elsevier" | "scopus" | "cochrane";

const BRANDS: Array<{ brand: Brand; label: string; src: string }> = [
  { brand: "pubmed", label: "PubMed", src: "/logos/pubmed.png" },
  { brand: "elsevier", label: "Elsevier", src: "/logos/elsevier.png" },
  { brand: "scopus", label: "Scopus", src: "/logos/scopus.png" },
  {
    brand: "cochrane",
    label: "Cochrane",
    src: "/logos/cochrane.png",
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
             tiles land at about 72-76px wide, the portrait Cochrane
             lockup (361x466) is only about 15.5px wide at 20px tall
             so its tile lands around 26px wide, and the whole row
             totals about 263.5px against the 272px mobile column,
             so all four tiles fit on one row at a 320px viewport
             (8.5px slack). The C mark carries recognition in the
             row; the wordmark is small at this size, the same
             context-reading caveat as the old SD icon. The row
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
