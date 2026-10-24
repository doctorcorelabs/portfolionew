/**
 * Hero, Onlines style (research/03-onlines-layout.md section 5).
 *
 * One giant word only: "daivanlabs." in Inter 700, framed by a dashed
 * selection box with 6 small square handles, on a faint graph-paper grid.
 * Exactly like the reference: no CTA button, no subline, no image inside
 * the hero. The word is the visual. The identity claim lives in the quote
 * section that follows, not here.
 *
 * Entrance sequence (Onlines feel: calm, editorial, no bounce):
 *   1. Graph grid fades in (0s, 1.4s)
 *   2. Giant word fades and rises 24px (0.15s, 0.9s)
 *   3. Dashed selection box fades in (0.5s delay, 1s ease-in-out),
 *      matching the reference frame fade. It stays pointer-dead until
 *      the fade completes, then lands in its selected/active state.
 *   4. 6 handles pop in with a stagger (0.95s + 0.07s each, 0.35s)
 *   5. Mono label fades in last (1.35s, 0.7s)
 *
 * Drag (fine pointers only):
 *   Once active, the frame + word move as one object under the
 *   pointer. The offset is clamped against the hero stage rect, so
 *   the box can never leave the stage. The 6 handles stay visual
 *   only (no resize). Drag starts only when the device reports
 *   hover:hover and pointer:fine, and never from a touch pointer, so
 *   page scroll is never hijacked on touch devices. With
 *   prefers-reduced-motion the fade is skipped and the frame is
 *   active immediately; drag itself is user-driven, so it stays
 *   available.
 *
 * The visible state is triggered once by a local IntersectionObserver
 * (hero is at the top, so this fires on mount in practice). With
 * prefers-reduced-motion the content is shown immediately with no
 * animation, and the observer is skipped.
 *
 * Deliberate deviations from the reference, for accessibility:
 * - No nowrap trap: the word may wrap on narrow screens.
 * - No scroll lock. The cursor stays standard until the frame is
 *   active; after that it is `move` on the frame, but only on
 *   hover-capable fine-pointer devices.
 * - All values are inline, so this file works standalone even while the
 *   shared token file is being rewritten by a parallel agent.
 */

import { useEffect, useRef, useState } from "react";

const INK = "#010101";
const GRID_LINE = "rgba(18, 18, 19, 0.06)";
const DASH = "rgba(18, 18, 19, 0.2)";
const HANDLE_BORDER = "#98989c";
const MICRO_GREY = "rgba(66, 66, 66, 0.6)";

const DISPLAY_FONT =
  "'Inter Display', Inter, Arial, sans-serif";
const MONO_FONT =
  "'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace";

/* 6 handles: 4 corners + left and right side midpoints. */
const HANDLES: Array<React.CSSProperties> = [
  { top: -5, left: -5 },
  { top: -5, right: -5 },
  { top: "50%", left: -5, transform: "translateY(-50%)" },
  { top: "50%", right: -5, transform: "translateY(-50%)" },
  { bottom: -5, left: -5 },
  { bottom: -5, right: -5 },
];

const HANDLE_STAGGER_START = 0.95;
const HANDLE_STAGGER_STEP = 0.07;

export default function Hero() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const frameRef = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);
  /* Selected/active state: lands only once the 1s frame fade ends. */
  const [frameActive, setFrameActive] = useState(false);
  const [wordHovered, setWordHovered] = useState(false);
  /* Drag gate: hover-capable fine-pointer devices only. */
  const [canDrag, setCanDrag] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const dragRef = useRef<{
    pointerId: number;
    startX: number;
    startY: number;
    startOffsetX: number;
    startOffsetY: number;
    minX: number;
    maxX: number;
    minY: number;
    maxY: number;
  } | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    if (
      typeof window === "undefined" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      typeof IntersectionObserver === "undefined"
    ) {
      setVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (
      typeof window === "undefined" ||
      typeof window.matchMedia === "undefined"
    ) {
      return;
    }
    setCanDrag(
      window.matchMedia("(hover: hover) and (pointer: fine)").matches,
    );
  }, []);

  /* The frame fade is 1s at a 0.5s delay, so the active state lands
     1500ms after the entrance starts. Reduced motion skips the fade,
     so the frame is active at once. */
  useEffect(() => {
    if (!visible) return;
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setFrameActive(true);
      return;
    }
    const timer = window.setTimeout(() => setFrameActive(true), 1500);
    return () => window.clearTimeout(timer);
  }, [visible]);

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!frameActive || !canDrag) return;
    /* Touch pointers never start a drag, on any device. */
    if (event.pointerType === "touch") return;
    if (event.pointerType === "mouse" && event.button !== 0) return;
    const frame = frameRef.current;
    const stage = sectionRef.current;
    if (!frame || !stage) return;
    const frameRect = frame.getBoundingClientRect();
    const stageRect = stage.getBoundingClientRect();
    /* Base position without the current transform, so the clamp is
       computed against the frame's resting box, not its dragged box. */
    const baseLeft = frameRect.left - offset.x;
    const baseTop = frameRect.top - offset.y;
    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      startOffsetX: offset.x,
      startOffsetY: offset.y,
      minX: stageRect.left - baseLeft,
      maxX: stageRect.right - (baseLeft + frameRect.width),
      minY: stageRect.top - baseTop,
      maxY: stageRect.bottom - (baseTop + frameRect.height),
    };
    event.currentTarget.setPointerCapture(event.pointerId);
    setDragging(true);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    const clamp = (value: number, low: number, high: number) =>
      Math.min(high, Math.max(low, value));
    setOffset({
      x: clamp(
        drag.startOffsetX + event.clientX - drag.startX,
        drag.minX,
        drag.maxX,
      ),
      y: clamp(
        drag.startOffsetY + event.clientY - drag.startY,
        drag.minY,
        drag.maxY,
      ),
    });
  };

  const endDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    dragRef.current = null;
    setDragging(false);
  };

  return (
    <section
      ref={sectionRef}
      aria-label="DaivanLabs"
      className={visible ? "mv-hero is-visible" : "mv-hero"}
      style={{
        position: "relative",
        overflow: "hidden",
        minHeight: 550,
        height: "calc(100dvh - 100px)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#ffffff",
        padding: "80px 24px",
        boxSizing: "border-box",
      }}
    >
      <style>{`
        .mv-hero .mv-grid {
          opacity: 0;
          transition: opacity 1.4s ease-out 0s;
        }
        .mv-hero.is-visible .mv-grid {
          opacity: 1;
        }
        .mv-hero .mv-word {
          opacity: 0;
          transform: translateY(24px);
          transition:
            opacity 0.9s cubic-bezier(0.22, 1, 0.36, 1) 0.15s,
            transform 0.9s cubic-bezier(0.22, 1, 0.36, 1) 0.15s;
        }
        .mv-hero.is-visible .mv-word {
          opacity: 1;
          transform: none;
        }
        .mv-hero .mv-frame-border {
          opacity: 0;
          transition: opacity 1s ease-in-out 0.5s;
        }
        .mv-hero.is-visible .mv-frame-border {
          opacity: 1;
        }
        .mv-hero .mv-frame-border.is-word-hovered,
        .mv-hero .mv-handle.is-word-hovered {
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        .mv-hero .mv-handle {
          opacity: 0;
          scale: 0.4;
          transition:
            opacity 0.35s ease,
            scale 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .mv-hero.is-visible .mv-handle {
          opacity: 1;
          scale: 1;
        }
        .mv-hero .mv-label {
          opacity: 0;
          transition: opacity 0.7s ease 1.35s;
        }
        .mv-hero.is-visible .mv-label {
          opacity: 1;
        }
        @media (prefers-reduced-motion: reduce) {
          .mv-hero .mv-grid,
          .mv-hero .mv-word,
          .mv-hero .mv-frame-border,
          .mv-hero .mv-handle,
          .mv-hero .mv-label {
            opacity: 1 !important;
            transform: none !important;
            scale: 1 !important;
            transition: none !important;
          }
        }
      `}</style>
      <div
        aria-hidden="true"
        className="mv-grid"
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          backgroundImage: `linear-gradient(${GRID_LINE} 1px, transparent 1px), linear-gradient(90deg, ${GRID_LINE} 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />
      <p
        className="mv-label"
        style={{
          position: "relative",
          zIndex: 1,
          margin: "0 0 32px",
          fontFamily: MONO_FONT,
          fontSize: 12,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: MICRO_GREY,
        }}
      >
        Portfolio - Est. 2025
      </p>
      <div
        ref={frameRef}
        className={frameActive ? "mv-frame is-active" : "mv-frame"}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        style={{
          position: "relative",
          zIndex: 1,
          display: "inline-block",
          maxWidth: 1160,
          width: "100%",
          padding: "28px 32px",
          boxSizing: "border-box",
          textAlign: "center",
          transform: `translate(${offset.x}px, ${offset.y}px)`,
          cursor:
            frameActive && canDrag
              ? dragging
                ? "grabbing"
                : "move"
              : undefined,
          /* Text selection is disabled on the box itself only, and
             only once it is draggable. The label and page stay
             selectable. */
          userSelect: frameActive && canDrag ? "none" : undefined,
        }}
      >
        <div
          aria-hidden="true"
          className={
            wordHovered ? "mv-frame-border is-word-hovered" : "mv-frame-border"
          }
          style={{
            position: "absolute",
            inset: 0,
            border: `1px dashed ${DASH}`,
            /* Pointer-dead until the fade completes and the
               selected/active state lands. Events on the border
               bubble to the wrapper drag handlers. */
            pointerEvents: frameActive ? "auto" : "none",
          }}
        />
        {HANDLES.map((position, index) => (
          <span
            key={index}
            aria-hidden="true"
            className={
              wordHovered ? "mv-handle is-word-hovered" : "mv-handle"
            }
            style={{
              position: "absolute",
              width: 10,
              height: 10,
              background: "#ffffff",
              border: `1px solid ${HANDLE_BORDER}`,
              boxSizing: "border-box",
              transitionDelay: `${HANDLE_STAGGER_START + index * HANDLE_STAGGER_STEP}s`,
              ...position,
            }}
          />
        ))}
        <h1
          className="mv-word"
          onMouseEnter={() => setWordHovered(true)}
          onMouseLeave={() => setWordHovered(false)}
          style={{
            position: "relative",
            margin: 0,
            fontFamily: DISPLAY_FONT,
            fontWeight: 700,
            fontSize: "clamp(72px, 16vw, 180px)",
            lineHeight: 0.95,
            letterSpacing: "-1.8px",
            color: INK,
            overflowWrap: "break-word",
          }}
        >
          daivanlabs.
        </h1>
      </div>
    </section>
  );
}
