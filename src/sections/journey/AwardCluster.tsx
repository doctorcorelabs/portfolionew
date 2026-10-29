import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import type { CSSProperties, RefObject } from "react";
import { createPortal } from "react-dom";
import "./AwardCluster.css";

export type ClusterItem = {
  id: string;
  shortLabel: string;
  title: string;
  body: string;
};

export type AwardClusterProps = {
  items: ClusterItem[];
  year: string;
  dotCount: string | null;
  onTop: boolean;
  openId: string | null;
  onToggle: (id: string) => void;
};

/**
 * Deterministic golden-angle spiral. Same (i, n, seed) always yields the same
 * position, so each station's node cloud is stable across renders and reloads.
 * x and y are percentages of the container box.
 */
function nodePosition(i: number, n: number, seed: number): { x: number; y: number } {
  const golden = 137.508;
  const s = Number.isNaN(seed) ? 0 : seed;
  const angle = ((i * golden + s) * Math.PI) / 180;
  const radius = 42 * Math.sqrt((i + 0.5) / n);
  return { x: 50 + radius * Math.cos(angle), y: 50 + radius * Math.sin(angle) };
}

function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState<boolean>(
    () =>
      typeof window !== "undefined" &&
      typeof window.matchMedia !== "undefined" &&
      window.matchMedia(query).matches
  );
  useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia === "undefined") return;
    const mq = window.matchMedia(query);
    const onChange = (event: MediaQueryListEvent) => setMatches(event.matches);
    setMatches(mq.matches);
    mq.addEventListener("change", onChange);
    return () => {
      mq.removeEventListener("change", onChange);
    };
  }, [query]);
  return matches;
}

type ClusterPanelProps = {
  item: ClusterItem;
  index: number;
  count: number;
  year: string;
  dotCount: string | null;
  onTop: boolean;
  anchorEl: HTMLButtonElement | null;
  isMobile: boolean;
  entered: boolean;
  panelRef: RefObject<HTMLDivElement | null>;
  closeRef: RefObject<HTMLButtonElement | null>;
  onClose: () => void;
};

const PANEL_W = 320;
const VIEWPORT_MARGIN = 16;
const NODE_GAP = 12;

function ClusterPanel({
  item,
  index,
  count,
  year,
  dotCount,
  onTop,
  anchorEl,
  isMobile,
  entered,
  panelRef,
  closeRef,
  onClose,
}: ClusterPanelProps) {
  const [coords, setCoords] = useState<{ x: number; y: number; above: boolean } | null>(null);

  // Two-pass desktop placement: the panel first renders hidden at a guess
  // position, is measured, then commits final flipped/clamped coordinates.
  // All of it happens inside a layout effect, so no intermediate state is
  // ever painted. Mobile skips anchor math entirely (bottom sheet).
  useLayoutEffect(() => {
    if (isMobile) {
      setCoords(null);
      return;
    }
    const panelEl = panelRef.current;
    if (!anchorEl || !panelEl) return;
    const nodeR = anchorEl.getBoundingClientRect();
    const h = panelEl.getBoundingClientRect().height;
    let x = nodeR.left + nodeR.width / 2 - PANEL_W / 2;
    let y: number;
    let above: boolean;
    if (onTop) {
      above = true;
      y = nodeR.top - h - NODE_GAP;
      if (y < VIEWPORT_MARGIN) {
        y = nodeR.bottom + NODE_GAP;
        above = false;
      }
    } else {
      above = false;
      y = nodeR.bottom + NODE_GAP;
      if (y + h > window.innerHeight - VIEWPORT_MARGIN) {
        y = nodeR.top - h - NODE_GAP;
        above = true;
      }
    }
    x = Math.max(VIEWPORT_MARGIN, Math.min(x, window.innerWidth - PANEL_W - VIEWPORT_MARGIN));
    y = Math.max(VIEWPORT_MARGIN, Math.min(y, window.innerHeight - h - VIEWPORT_MARGIN));
    setCoords({ x, y, above });
  }, [item.id, anchorEl, isMobile, onTop, panelRef]);

  const visible = isMobile || coords !== null;
  const style: CSSProperties = { visibility: visible ? "visible" : "hidden" };
  if (coords && !isMobile) {
    style.left = coords.x;
    style.top = coords.y;
    style.transformOrigin = coords.above ? "50% 100%" : "50% 0%";
  }

  return (
    <div
      ref={panelRef}
      id="journey-cluster-panel"
      className={"journey-cluster-panel" + (entered ? " journey-cluster-panel-entered" : "")}
      role="dialog"
      aria-label={item.title}
      aria-modal={isMobile || undefined}
      tabIndex={-1}
      style={style}
    >
      <p className="journey-cluster-panel-kicker">
        {year} - item {index + 1} of {count}
      </p>
      <p className="journey-cluster-panel-title">{item.title}</p>
      <p className="journey-cluster-panel-body">{item.body}</p>
      {dotCount ? <p className="journey-cluster-panel-footer">{dotCount}</p> : null}
      <button
        ref={closeRef}
        type="button"
        className="journey-cluster-panel-close"
        onClick={onClose}
      >
        Close
      </button>
    </div>
  );
}

export function AwardCluster({
  items,
  year,
  dotCount,
  onTop,
  openId,
  onToggle,
}: AwardClusterProps) {
  const isMobile = useMediaQuery("(max-width: 1100px)");
  const clusterRef = useRef<HTMLDivElement | null>(null);
  const nodeRefs = useRef<Map<string, HTMLButtonElement>>(new Map());
  const panelRef = useRef<HTMLDivElement | null>(null);
  const closeRef = useRef<HTMLButtonElement | null>(null);
  const [entered, setEntered] = useState(false);
  const lastOpenRef = useRef<string | null>(null);

  const openItem = openId ? items.find((item) => item.id === openId) ?? null : null;
  const openIndex = openItem ? items.indexOf(openItem) : -1;
  const seed = parseInt(year, 10);
  const cloudHeight = Math.min(280, Math.max(140, 60 + 24 * items.length));

  const handleClose = useCallback(() => {
    if (openId) onToggle(openId);
  }, [openId, onToggle]);

  // Entrance animation flag plus focus management: on open, focus moves into
  // the panel (desktop) or onto the Close button (mobile sheet); on close,
  // focus returns to the node button that opened it.
  useEffect(() => {
    if (openId) {
      lastOpenRef.current = openId;
      const raf = window.requestAnimationFrame(() => {
        setEntered(true);
        if (isMobile) {
          closeRef.current?.focus();
        } else {
          panelRef.current?.focus();
        }
      });
      return () => {
        window.cancelAnimationFrame(raf);
      };
    }
    setEntered(false);
    const lastId = lastOpenRef.current;
    lastOpenRef.current = null;
    if (lastId) {
      const node = nodeRefs.current.get(lastId);
      if (node) {
        const raf = window.requestAnimationFrame(() => {
          node.focus();
        });
        return () => {
          window.cancelAnimationFrame(raf);
        };
      }
    }
    return undefined;
  }, [openId, isMobile]);

  // Dismiss paths while a panel is open: ESC key, any window scroll (bubble
  // phase only, so scrolling inside the panel itself does not close it), and
  // pointer down outside both the panel and the node cluster.
  useEffect(() => {
    if (!openId) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") handleClose();
    };
    const onScroll = () => handleClose();
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node | null;
      if (!target) return;
      if (panelRef.current?.contains(target)) return;
      if (clusterRef.current?.contains(target)) return;
      handleClose();
    };
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("scroll", onScroll);
    };
  }, [openId, handleClose]);

  const setNodeRef = (id: string) => (el: HTMLButtonElement | null) => {
    if (el) {
      nodeRefs.current.set(id, el);
    } else {
      nodeRefs.current.delete(id);
    }
  };

  const canPortal = typeof document !== "undefined";
  const anchorEl = openId ? nodeRefs.current.get(openId) ?? null : null;

  return (
    <>
      <div
        ref={clusterRef}
        className="journey-cluster"
        style={{ "--journey-cluster-h": `${cloudHeight}px` } as CSSProperties}
      >
        {items.map((item, i) => {
          const isOpen = openId === item.id;
          const pos = isMobile ? null : nodePosition(i, items.length, seed);
          return (
            <button
              key={item.id}
              ref={setNodeRef(item.id)}
              type="button"
              className={"journey-cluster-node" + (isOpen ? " journey-cluster-node-active" : "")}
              style={pos ? { left: `${pos.x}%`, top: `${pos.y}%` } : undefined}
              aria-expanded={isOpen}
              aria-controls="journey-cluster-panel"
              onClick={() => onToggle(item.id)}
            >
              <span className="journey-cluster-node-dot" aria-hidden="true" />
              <span className="journey-cluster-node-label">{item.shortLabel}</span>
            </button>
          );
        })}
      </div>
      {canPortal && openItem
        ? createPortal(
            <>
              {isMobile ? (
                <div
                  className="journey-cluster-backdrop"
                  aria-hidden="true"
                  onClick={handleClose}
                />
              ) : null}
              <ClusterPanel
                item={openItem}
                index={openIndex}
                count={items.length}
                year={year}
                dotCount={dotCount}
                onTop={onTop}
                anchorEl={anchorEl}
                isMobile={isMobile}
                entered={entered}
                panelRef={panelRef}
                closeRef={closeRef}
                onClose={handleClose}
              />
            </>,
            document.body
          )
        : null}
    </>
  );
}

export default AwardCluster;
