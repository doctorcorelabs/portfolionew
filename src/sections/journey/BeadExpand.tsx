/* BeadExpand: glowing bead trigger that opens an inline award card beneath it.
   Used for the 2024/2025 Journey stations. The card is a diagram node that
   opens, connected to its bead by a drawn stem: no portal, no overlay. */
import { useEffect, type CSSProperties, type ReactElement } from "react";
import "./BeadExpand.css";

export type BeadItem = { id: string; title: string };

export type BeadExpandProps = {
  items: BeadItem[];
  year: string;
  expanded: boolean;
  onToggle: () => void;
};

export function BeadExpand({
  items,
  year,
  expanded,
  onToggle,
}: BeadExpandProps): ReactElement {
  const regionId = `bead-expand-${year}`;

  useEffect(() => {
    if (!expanded) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onToggle();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [expanded, onToggle]);

  return (
    <div className={"bead-expand" + (expanded ? " bead-expand-open" : "")}>
      <div className="bead-expand-beadrow">
        <button
          type="button"
          className="bead-expand-bead"
          aria-expanded={expanded}
          aria-controls={regionId}
          aria-label={expanded ? `Hide ${year} awards` : `Show ${year} awards`}
          onClick={onToggle}
        >
          <span className="bead-expand-orbit" aria-hidden="true" />
          <span className="bead-expand-halo" aria-hidden="true" />
          <span className="bead-expand-core" aria-hidden="true" />
        </button>
        <span className="bead-expand-stem" aria-hidden="true" />
      </div>
      <div className="bead-expand-body">
        <div className="bead-expand-body-inner">
          <div
            className="bead-expand-card"
            role="region"
            id={regionId}
            aria-label={`${year} awards`}
          >
            <p className="bead-expand-kicker">{year} HIGHLIGHTS</p>
            <ul className="bead-expand-rows">
              {items.map((item, i) => (
                <li
                  key={item.id}
                  className="bead-expand-row"
                  style={{ "--row-delay": `${260 + i * 40}ms` } as CSSProperties}
                >
                  <span className="bead-expand-row-dot" aria-hidden="true" />
                  <span className="bead-expand-row-title">{item.title}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BeadExpand;
