import { useState } from "react";

/* DbLogoFloat: one REAL database logo as a free-floating app-icon
   tile for the hero collage. The logo files live in public/logos/
   and are the brands' own artwork, never a text wordmark or a drawn
   imitation. Cochrane uses its portrait lockup (cochrane.png):
   the navy forest-plot C mark with the navy Cochrane wordmark
   stacked under it, so it needs a taller tile than the horizontal
   wordmarks - a horizontal-wordmark tile would shrink the stacked
   lockup unreadably. Each tile is a white rounded box; the
   image uses contain so aspect ratios never stretch or crop. If a
   logo file fails to load, the tile hides itself entirely (no broken
   image, no text fallback). Tiles carry no claim text.
   This tile stays upright by design: the Hero collage wrapper owns
   all motion, so nothing here moves on its own. */

const PAPER = "#FFFFFF";
const BORDER = "#E0E0E0";

type Brand = "pubmed" | "elsevier" | "scopus" | "cochrane";

const BRANDS: Array<{ brand: Brand; label: string }> = [
  { brand: "pubmed", label: "PubMed" },
  { brand: "elsevier", label: "Elsevier" },
  { brand: "scopus", label: "Scopus" },
  { brand: "cochrane", label: "Cochrane" },
];

/* Per-brand tile geometry. Wordmark art is 24px tall with 12px side
   padding, giving tiles about 100-104px wide. Cochrane is a
   portrait lockup, not a horizontal wordmark: at 56px art height
   the lockup is 43.4px wide, so the tile is 69 wide and 82 tall
   with padding and border. Widths are fixed so each tile keeps
   its app-icon footprint wherever the Hero wrapper places it.
   All four tiles use the mid shadow. */
const CONFIG: Record<
  Brand,
  { src: string; tileWidth: number; tileHeight?: number; artHeight: number; artMaxWidth: number; shadow: string }
> = {
  pubmed: {
    src: "/logos/pubmed.png",
    tileWidth: 100,
    artHeight: 24,
    artMaxWidth: 74,
    shadow: "0 8px 20px rgba(1, 1, 1, 0.14)",
  },
  elsevier: {
    src: "/logos/elsevier.png",
    tileWidth: 104,
    artHeight: 24,
    artMaxWidth: 78,
    shadow: "0 8px 20px rgba(1, 1, 1, 0.14)",
  },
  scopus: {
    src: "/logos/scopus.png",
    tileWidth: 100,
    artHeight: 24,
    artMaxWidth: 74,
    shadow: "0 8px 20px rgba(1, 1, 1, 0.14)",
  },
  cochrane: {
    src: "/logos/cochrane.png",
    tileWidth: 69,
    tileHeight: 82,
    artHeight: 56,
    artMaxWidth: 44,
    shadow: "0 8px 20px rgba(1, 1, 1, 0.14)",
  },
};

export function DbLogoFloat({ brand }: { brand: Brand }) {
  const [failed, setFailed] = useState(false);
  const entry = BRANDS.find((b) => b.brand === brand);
  if (failed || !entry) {
    return null;
  }
  const config = CONFIG[brand];
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        background: PAPER,
        border: `1px solid ${BORDER}`,
        borderRadius: 8,
        boxShadow: config.shadow,
        padding: 12,
        width: config.tileWidth,
        height: config.tileHeight,
        boxSizing: "border-box",
      }}
    >
      <img
        src={config.src}
        alt={`${entry.label} logo`}
        onError={() => setFailed(true)}
        style={{
          display: "block",
          height: config.artHeight,
          width: "auto",
          maxWidth: config.artMaxWidth,
          objectFit: "contain",
        }}
      />
    </div>
  );
}

export default DbLogoFloat;
