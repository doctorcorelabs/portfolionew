/* BeadExpand: glowing bead trigger that opens an inline award card beneath it.
   Used for the 2024/2025 Journey stations. The card is a diagram node that
   opens, connected to its bead by a drawn stem: no portal, no overlay. */
import { useEffect, useRef, useState, type CSSProperties, type ReactElement } from "react";
import "./BeadExpand.css";

export type BeadItem = { id: string; title: string; quartile?: string };

export type BeadExpandProps = {
  items: BeadItem[];
  year: string;
  expanded: boolean;
  onToggle: () => void;
  hintText?: string;
  hintVisible?: boolean;
  hintSide?: "left" | "right";
  hintDelay?: string;
};

export function BeadExpand({
  items,
  year,
  expanded,
  onToggle,
  hintText = "tap me",
  hintVisible = true,
  hintSide = "right",
  hintDelay = "0s",
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

  /* Hint leave: when hintVisible flips false, fade 300ms then unmount. */
  const [leaving, setLeaving] = useState(false);
  const leaveTimer = useRef<number | null>(null);

  useEffect(() => {
    if (hintVisible) {
      if (leaveTimer.current !== null) {
        window.clearTimeout(leaveTimer.current);
        leaveTimer.current = null;
      }
      setLeaving(false);
      return;
    }
    setLeaving(true);
    leaveTimer.current = window.setTimeout(() => {
      leaveTimer.current = null;
      setLeaving(false);
    }, 320);
    return () => {
      if (leaveTimer.current !== null) {
        window.clearTimeout(leaveTimer.current);
        leaveTimer.current = null;
      }
    };
  }, [hintVisible]);

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
        {(hintVisible || leaving) && (
          <span
            className={
              "bead-expand-hint" +
              (hintSide === "left" ? " bead-expand-hint-left" : "") +
              (leaving ? " bead-expand-hint-leave" : "")
            }
            style={{ "--hint-delay": hintDelay } as CSSProperties}
            aria-hidden="true"
          >
            {hintText}
          </span>
        )}
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
                  {item.quartile && (
                    <span className="bead-expand-row-q" aria-hidden="true">
                      {item.quartile}
                    </span>
                  )}
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
