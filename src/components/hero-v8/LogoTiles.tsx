import { useState } from "react";

/* LogoTiles: framed tiles showing the REAL database logo images from
   public/logos/ (sourced by a sibling agent), never a text wordmark
   or a drawn imitation. Each tile is a white rounded box; the image
   uses contain so the different logo aspect ratios never stretch or
   crop. Tiles are 90px wide and form a true 2x2 grid inside the
   220px dark stack card (90 + 8 + 90 = 188px inner width). If a logo
   file fails to load, its tile hides itself entirely (no broken
   image, no text fallback). Tiles carry no claim text. */

const PAPER = "#FFFFFF";
const BORDER = "#E0E0E0";

type Brand = "pubmed" | "elsevier" | "scopus" | "sciencedirect";

const BRANDS: Array<{ brand: Brand; label: string }> = [
  { brand: "pubmed", label: "PubMed" },
  { brand: "elsevier", label: "Elsevier" },
  { brand: "scopus", label: "Scopus" },
  { brand: "sciencedirect", label: "ScienceDirect" },
];

/* Logo source per brand. ScienceDirect uses the compact official SD
   icon (public/logos/sciencedirect-icon.png, 32x32, verified visually
   as the orange SD mark) instead of the horizontal wordmark: at 20px
   tall the wordmark is about 162px wide and cannot fit a 90px tile,
   while the icon fits at 20px tall and stays legible. The other three
   brands use their horizontal wordmarks, which fit at 20px tall
   within the 66px art cap. */
const SRC: Record<Brand, string> = {
  pubmed: "/logos/pubmed.png",
  elsevier: "/logos/elsevier.png",
  scopus: "/logos/scopus.png",
  sciencedirect: "/logos/sciencedirect-icon.png",
};
/* Per-tile treatment from docs/hero-v9/01-logo-presentation.md: static
   tilts (adjacent tiles never share a sign), alternating shadow
   levels (PubMed and Scopus lifted, Elsevier and ScienceDirect soft),
   and alternating tile heights (PubMed and ScienceDirect 36px,
   Elsevier and Scopus 32px). Heights were tightened by the v9 re-QA
   fix F1 (was 44/40px): with 6px vertical padding and 20px art, the
   two tile rows total 72px plus the 8px gap, keeping the whole dark
   card near 187px tall so its top edge clears the giant word glyphs
   on a 700px stage. Tilts are class-based so the Hero mobile
   block convention (max-width 719px) can zero them; never use an
   inline transform here, or the mobile override cannot win. */
const TILE_CONFIG: Record<
  Brand,
  { tilt: string; shadow: string; height: number }
> = {
  pubmed: { tilt: "-2deg", shadow: "0 6px 16px rgba(0, 0, 0, 0.45)", height: 36 },
  elsevier: { tilt: "1deg", shadow: "0 2px 6px rgba(0, 0, 0, 0.35)", height: 32 },
  scopus: { tilt: "-1deg", shadow: "0 6px 16px rgba(0, 0, 0, 0.45)", height: 32 },
  sciencedirect: { tilt: "2deg", shadow: "0 2px 6px rgba(0, 0, 0, 0.35)", height: 36 },
};

export function LogoTile({ brand }: { brand: Brand }) {
  const [failed, setFailed] = useState(false);
  const entry = BRANDS.find((b) => b.brand === brand);
  if (failed || !entry) {
    return null;
  }
  const config = TILE_CONFIG[brand];
  return (
    <>
      <style>{`.mv-logo-tile-${brand} { transform: rotate(${config.tilt}); } @media (max-width: 719px) { .mv-logo-tile-${brand} { transform: rotate(0deg); } }`}</style>
      <div
        className={`mv-logo-tile mv-logo-tile-${brand}`}
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          background: PAPER,
          border: `1px solid ${BORDER}`,
          borderRadius: 8,
          boxShadow: config.shadow,
          padding: "6px 10px",
          height: config.height,
          width: 90,
          boxSizing: "border-box",
        }}
      >
      <img
        src={SRC[brand]}
        alt={`${entry.label} logo`}
        onError={() => setFailed(true)}
        style={{
          display: "block",
          /* Art height 20px, width auto, capped at 66px: the tile is
             90px wide minus 20px padding minus 2px border, so two
             tiles plus the 8px gap fill the 188px card inner width
             exactly and the four tiles form a true 2x2 grid. Do not
             raise the height or the cap without re-checking the
             card width and the glyph clearance. */
          height: 20,
          width: "auto",
          maxWidth: 66,
          objectFit: "contain",
        }}
      />
      </div>
    </>
  );
}

export default function LogoTiles() {
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: 8,
        alignItems: "center",
      }}
    >
      {BRANDS.map((b) => (
        <LogoTile key={b.brand} brand={b.brand} />
      ))}
    </div>
  );
}
