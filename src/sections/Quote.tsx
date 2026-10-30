/**
 * Quote.tsx - Onlines home-quote-block, translated for DaivanLabs.
 * Scroll-driven PINNED word-by-word paint, matching the reference
 * structure measured in docs/motion/02-onlines-visual-forensics.md
 * section 3 (the pinned quote findings):
 *
 * - Outer wrapper height: 100svh + 1875px of scroll runway + 240px of
 *   separation padding (120px top and bottom), i.e. 100svh + 2115px.
 *   On narrow screens (max-width 1023px) the reference drops to
 *   1125px of runway + 70px padding top and bottom, i.e. 100svh + 1265px.
 * - Inner child: position sticky, top 0, min-height 100svh with
 *   overflow visible, so the content stays pinned while the
 *   visitor scrolls through the runway and no second scrollbar
 *   appears (no inner scroll container anywhere in this file).
 * - The H1 claim is split into 17 word spans. Each word starts pale
 *   grey and flips to full ink as scroll progress advances, with a
 *   0.35s color transition per word. Progress maps to words over the
 *   first 80 percent of the runway: word i (0-indexed) paints when
 *   progress >= ((i + 1) / 17) * 0.8, so the last word lands at
 *   progress 0.8. Scrolling back up unpaints words in reverse.
 * - The mission line fades in only near the end of the runway:
 *   opacity 0 at progress <= 0.80, ramping to 1 at progress 0.85
 *   with a 14px rise over the same interval. After it fades in,
 *   three key phrases gain a pale blue marker wash in reading
 *   order (0.85-0.90, 0.90-0.95, 0.95-1.00). The mission animation
 *   is a dot trail below the paragraph, a reading-light dot band
 *   behind it, and tap blooms in the background.
 * - The dashed vertical rule draws in step with progress (its height
 *   is progress * 100 percent of the content block), the top square
 *   node sits at the rule start, and the bottom node travels with the
 *   rule tip.
 * - Wording and bold key phrases are the N2 narrative; words
 *   are plain inline spans, so on narrow screens they wrap normally and
 *   the mapping still works by word index.
 * - prefers-reduced-motion: the plain static quote renders instead
 *   (fully ink words, mission visible, no tall wrapper, no pinning),
 *   so content is never trapped behind scroll.
 */

import { useEffect, useRef, useState } from "react";
import { setSeed } from "../lib/transitionSeed";

const INK = "#010101";
const GRAPHITE = "#3C3C38";
const MARGIN_GREY = "#6F6F68";
const PALE = "#D6D6D6";
const BLUE = "#0859D4";
const DISPLAY =
  "'Inter', 'Inter Display', Arial, -apple-system, 'Segoe UI', sans-serif";
const MONO =
  "'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace";

/** The H1 claim, split by word. bold marks the key phrases. */
const WORDS: { text: string; bold: boolean }[] = [
  { text: "Between", bold: false },
  { text: "the", bold: false },
  { text: "ward", bold: true },
  { text: "and", bold: false },
  { text: "the", bold: false },
  { text: "keyboard,", bold: true },
  { text: "I", bold: false },
  { text: "turn", bold: false },
  { text: "everyday", bold: false },
  { text: "clinical", bold: false },
  { text: "problems", bold: false },
  { text: "into", bold: false },
  { text: "tools", bold: true },
  { text: "people", bold: false },
  { text: "can", bold: false },
  { text: "actually", bold: false },
  { text: "use.", bold: false },
];

function clamp01(value: number): number {
  return Math.min(1, Math.max(0, value));
}

export default function Quote() {
  const wrapperRef = useRef<HTMLElement | null>(null);
  const stickyRef = useRef<HTMLDivElement | null>(null);
  const ringRef = useRef<HTMLDivElement | null>(null);
  const autoBloomFiredRef = useRef(false);
  const [cursorLit, setCursorLit] = useState(false);
  const [bloom, setBloom] = useState<{
    x: number;
    y: number;
    key: number;
  } | null>(null);
  const [progress, setProgress] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(
    () =>
      typeof window !== "undefined" &&
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );

  useEffect(() => {
    if (typeof window === "undefined") return;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setReducedMotion(media.matches);
    setReducedMotion(media.matches);
    if (typeof media.addEventListener === "function") {
      media.addEventListener("change", onChange);
      return () => media.removeEventListener("change", onChange);
    }
    return undefined;
  }, []);

  useEffect(() => {
    if (reducedMotion) return;
    const wrapper = wrapperRef.current;
    if (!wrapper) return;
    let ticking = false;
    const update = () => {
      ticking = false;
      const rect = wrapper.getBoundingClientRect();
      const runway = rect.height - window.innerHeight;
      setProgress(runway > 0 ? clamp01(-rect.top / runway) : 1);
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [reducedMotion]);

  /* P2 auto bloom: once per mount, when progress first reaches 1.0,
     fire one bloom centered on the V6 target ring, reusing the
     bloom state and the q-bloom class. The flag is set only after
     both rects read successfully, so a failed measure can retry on
     the next crossing of 1.0. No fire under reduced motion, no
     re-fire on scroll back, and a tap before 1.0 does not consume
     it; a later tap replaces it via the key remount. */
  useEffect(() => {
    if (reducedMotion) return;
    if (progress < 1 || autoBloomFiredRef.current) return;
    const ring = ringRef.current;
    const sticky = stickyRef.current;
    if (!ring || !sticky) return;
    const ringRect = ring.getBoundingClientRect();
    const stickyRect = sticky.getBoundingClientRect();
    autoBloomFiredRef.current = true;
    /* Transition seed: stash the ring's viewport center for the
       Quote to Services ink zone. Behavior-preserving: the rects are
       already measured above, so this adds no visual or timing
       change to the bloom itself. */
    setSeed(
      ringRect.left + ringRect.width / 2,
      ringRect.top + ringRect.height / 2,
    );
    setBloom((prev) => ({
      x: ringRect.left + ringRect.width / 2 - stickyRect.left,
      y: ringRect.top + ringRect.height / 2 - stickyRect.top,
      key: (prev?.key ?? 0) + 1,
    }));
  }, [progress, reducedMotion]);

  const missionOpacity = progress <= 0.8 ? 0 : clamp01((progress - 0.8) / 0.05);

  /* Marker sweep: a pale blue wash grows left to right behind three
     key mission phrases in reading order, after the mission has fully
     faded in: 0.85-0.90, 0.90-0.95, 0.95-1.00, easeOutCubic within each
     window. Pure function of progress, no transition on the wash path,
     so scrolling back reverses every sweep. The reducedMotion guard
     forcing 1 is essential: in the static branch progress stays 0,
     so without it the wash would render at 0. */
  const markerGrowth = (start: number) =>
    reducedMotion
      ? 1
      : 1 - Math.pow(1 - clamp01((progress - start) / 0.05), 3);
  const markerWash = (growth: number): React.CSSProperties => ({
    backgroundImage:
      "linear-gradient(rgba(8, 89, 212, 0.12), rgba(8, 89, 212, 0.12))",
    backgroundSize: `${growth * 100}% 100%`,
    backgroundRepeat: "no-repeat",
    backgroundPosition: "0 0",
    boxDecorationBreak: "clone",
    WebkitBoxDecorationBreak: "clone",
  });

  /* Dot-field entrance: the base and offset dot layers fade from opacity 0 to
     full over the first 10 percent of scroll progress, then stay
     full. The cursor-lit fade (instant on, 600ms out) is unchanged
     and multiplies on top of this entrance factor. */
  const dotEntrance = progress < 0.1 ? progress / 0.1 : 1;

  /* Dot field cursor plumbing, same geometry as Contact (14px
     pitch, 0.7px dots, 30 percent base, 44 percent lit, 350px field
     mask, 50px lit halo, 600ms fade-out). Coordinates are relative
     to the sticky child, which is the layer the dots live in. */
  const handleMouseMove = (event: React.MouseEvent<HTMLElement>) => {
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }
    const node = stickyRef.current;
    if (!node) return;
    const rect = node.getBoundingClientRect();
    node.style.setProperty("--qdot-x", `${event.clientX - rect.left}px`);
    node.style.setProperty("--qdot-y", `${event.clientY - rect.top}px`);
    setCursorLit(true);
  };

  /* B15 tap handler: section-scoped pointer coordinates. Bumping
     the key remounts the single bloom element, so a new tap
     replaces the previous bloom instead of stacking rings. */
  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    const node = stickyRef.current;
    if (!node) return;
    const rect = node.getBoundingClientRect();
    setBloom((prev) => ({
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
      key: (prev?.key ?? 0) + 1,
    }));
  };

  const claim = (
    <h1
      id="quote-heading"
      style={{
        fontSize: "clamp(34px, 4.5vw, 64px)",
        lineHeight: 1.05,
        letterSpacing: "-0.02em",
        fontWeight: 700,
        margin: "0 0 32px",
        maxWidth: 960,
      }}
    >
      {WORDS.map((word, i) => {
        const painted =
          reducedMotion || progress >= ((i + 1) / WORDS.length) * 0.8;
        return (
          <span key={`w-${i}`}>
            <span
              style={{
                color: painted ? INK : PALE,
                /* Inactive words carry a light outline stroke, as
                   in the reference; the exact stroke color is
                   UNVERIFIED, so this is a subtle reading of it. */
                WebkitTextStroke: painted
                  ? undefined
                  : "1px rgba(1, 1, 1, 0.15)",
                fontWeight: word.bold ? 700 : undefined,
                transition: reducedMotion ? undefined : "color 0.35s",
              }}
            >
              {word.text}
            </span>
            {i < WORDS.length - 1 ? " " : ""}
          </span>
        );
      })}
    </h1>
  );

  /* V13 reading-light band geometry: the band is 50 percent of the
     mission block height and travels from the top (progress 0.80)
     to the bottom (progress 1.0), so its top edge runs from 0 to 60
     percent. At f = 1 the bottom edge is 110 percent, capped by the
     mask at 100 percent, so the end-state visible band is the
     bottom 40 percent of the mission block, denser than before.
     The mask feathers about 8 percent on each side. */
  const v13f = clamp01((progress - 0.8) / 0.2);
  const v13Top = v13f * 60;
  const v13Bottom = v13Top + 50;
  const v13FadeIn = Math.max(0, v13Top - 8);
  const v13FadeOut = Math.min(100, v13Bottom + 8);
  const v13Mask = `linear-gradient(to bottom, transparent 0%, transparent ${v13FadeIn}%, rgba(0, 0, 0, 1) ${v13Top}%, rgba(0, 0, 0, 1) ${v13Bottom}%, transparent ${v13FadeOut}%, transparent 100%)`;

  /* Mission paragraph wrapped for the V13 band: the wrapper tracks
     the mission block exactly, so the band follows wrapped lines on
     any width. The paragraph itself sits above the band. */
  const mission = (
    <div style={{ position: "relative", margin: 0 }}>
      {!reducedMotion && (
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 0,
            pointerEvents: "none",
            /* Gated on the mission entrance: the band is invisible
               below progress 0.80 and fades in with the mission ramp
               (fully present at 0.85), so no static dot strip shows
               while the mission text itself is still at opacity 0. */
            opacity: missionOpacity,
            backgroundImage:
              "radial-gradient(circle, rgba(0, 0, 0, 0.60) 0.6px, transparent 0.7px)",
            backgroundSize: "14px 14px",
            backgroundRepeat: "repeat",
            maskImage: v13Mask,
            WebkitMaskImage: v13Mask,
          }}
        />
      )}
      <p
        style={{
          fontSize: 18,
          lineHeight: 1.65,
          color: GRAPHITE,
          maxWidth: 640,
          margin: 0,
          position: "relative",
          zIndex: 1,
          opacity: reducedMotion ? 1 : missionOpacity,
          transform:
            reducedMotion || missionOpacity >= 1
              ? "none"
              : `translateY(${(1 - missionOpacity) * 14}px)`,
        }}
      >
        {"Through DaivanLabs, I work on "}
        <span style={{ color: BLUE }}>CodeCureConnect:</span>
        {" "}
        <span style={markerWash(markerGrowth(0.85))}>
          code that becomes healthcare tools
        </span>
        {", and "}
        <span style={markerWash(markerGrowth(0.9))}>
          connections that carry them further
        </span>
        {" toward "}
        <span style={markerWash(markerGrowth(0.95))}>
          higher health standards and lasting change in Indonesia
        </span>
        {". Curiosity and diverse experiences keep pointing me to the next problem worth solving."}
      </p>
    </div>
  );

  const rule = (drawn: number) => (
    <>
      {/* Dashed vertical rule, drawn in step with scroll progress. */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          left: 5,
          top: 0,
          bottom: 0,
          width: 0,
        }}
      >
        <div
          style={{
            height: `${drawn * 100}%`,
            borderLeft: "1px dashed rgba(18, 18, 19, 0.2)",
          }}
        />
      </div>
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          left: 0,
          top: -5,
          width: 10,
          height: 10,
          background: "#FFFFFF",
          border: "1px solid #98989C",
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          left: 0,
          top: `calc(${drawn * 100}% - 5px)`,
          width: 10,
          height: 10,
          background: "#FFFFFF",
          border: "1px solid #98989C",
        }}
      />
    </>
  );

  /* V6 dot trail below the mission: 12 dots of 4px light in step
     order from 0.82 to 0.952, then a 32px hollow ring fades in with
     a 10px blue center dot from 0.95 to 1.00. At full ring opacity
     the center dot carries the q-pulse-dot class (3s ease-in-out
     infinite alternate, opacity 1 to 0.6); below full it stays
     inline-opacity-driven. Takes the same drawn value as the rule,
     so the static branch (drawn 1) renders it fully lit
     automatically. No transition anywhere: the dots are a step
     function of scroll progress. */
  const trail = (drawn: number) => {
    const ringOpacity = clamp01((drawn - 0.95) / 0.05);
    return (
      <div
        aria-hidden="true"
        style={{
          position: "relative",
          marginTop: 24,
          maxWidth: 640,
          width: "100%",
          height: 40,
          pointerEvents: "none",
        }}
      >
        {Array.from({ length: 12 }, (_, i) => (
          <div
            key={`d-${i}`}
            style={{
              position: "absolute",
              left: i * 14,
              top: 18,
              width: 4,
              height: 4,
              borderRadius: "50%",
              background:
                drawn >= 0.82 + i * 0.012 ? INK : "rgba(1, 1, 1, 0.3)",
            }}
          />
        ))}
        <div
          ref={ringRef}
          style={{
            position: "absolute",
            left: 178,
            top: 4,
            width: 32,
            height: 32,
            borderRadius: "50%",
            border: "1px solid rgba(1, 1, 1, 0.3)",
            background: "transparent",
            opacity: ringOpacity,
          }}
        />
        <div
          className={ringOpacity >= 1 ? "q-pulse-dot" : undefined}
          style={{
            position: "absolute",
            left: 189,
            top: 15,
            width: 10,
            height: 10,
            borderRadius: "50%",
            background: BLUE,
            opacity: ringOpacity,
          }}
        />
      </div>
    );
  };

  const body = (drawn: number) => (
    <div
      style={{
        maxWidth: 1160,
        margin: "0 auto",
        width: "100%",
        position: "relative",
        zIndex: 1,
      }}
    >
      <div style={{ position: "relative", paddingLeft: 32 }}>
        {rule(drawn)}
        <p
          style={{
            fontFamily: MONO,
            fontSize: 12,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: MARGIN_GREY,
            margin: "0 0 24px",
          }}
        >
          DaivanLabs, in one sentence
        </p>
        {claim}
        {mission}
        {trail(drawn)}
      </div>
    </div>
  );

  /* Reduced motion: plain static quote, no tall wrapper, no pinning. */
  if (reducedMotion) {
    return (
      <section
        aria-labelledby="quote-heading"
        style={{
          background: "#FFFFFF",
          color: INK,
          fontFamily: DISPLAY,
          padding: "130px 24px",
        }}
      >
        {body(1)}
      </section>
    );
  }

  /* Pinned scroll-driven quote. */
  return (
    <section
      ref={wrapperRef}
      aria-labelledby="quote-heading"
      className="q-pin-wrap"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setCursorLit(false)}
      style={{
        background: "#FFFFFF",
        color: INK,
        fontFamily: DISPLAY,
      }}
    >
      <style>{`
        .q-pin-wrap {
          height: calc(100svh + 1875px + 240px);
        }
        .q-pin-sticky {
          position: sticky;
          top: 0;
          /* min-height, not height, and no inner scrollbar: the
             old height + overflow-y auto pair rendered a second
             scrollbar beside the page scrollbar ("2 scroll") and
             trapped wheel scrolling inside the pinned section.
             Now the child grows past viewport height when needed
             and only the page scrollbar exists. */
          min-height: 100svh;
          display: flex;
          align-items: center;
          padding: 120px 24px;
          box-sizing: border-box;
          overflow: visible;
        }
        .q-dot-base,
        .q-dot-lit,
        .q-dot-offset {
          position: absolute;
          inset: 0;
          pointer-events: none;
          background-size: 14px 14px;
          background-repeat: repeat;
          z-index: 0;
        }
        .q-dot-base {
          background-image: radial-gradient(circle, rgba(0, 0, 0, 0.30) 0.7px, transparent 0.8px);
          -webkit-mask-image: radial-gradient(circle 350px at var(--qdot-x, 50%) var(--qdot-y, 50%), rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 1) 60%, rgba(0, 0, 0, 0) 100%);
          mask-image: radial-gradient(circle 350px at var(--qdot-x, 50%) var(--qdot-y, 50%), rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 1) 60%, rgba(0, 0, 0, 0) 100%);
        }
        .q-dot-offset {
          background-image: radial-gradient(circle, rgba(0, 0, 0, 0.30) 0.7px, transparent 0.8px);
          background-position: 7px 7px;
          -webkit-mask-image: radial-gradient(circle 350px at var(--qdot-x, 50%) var(--qdot-y, 50%), rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 1) 60%, rgba(0, 0, 0, 0) 100%);
          mask-image: radial-gradient(circle 350px at var(--qdot-x, 50%) var(--qdot-y, 50%), rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 1) 60%, rgba(0, 0, 0, 0) 100%);
          animation: q-dot-offset 9s ease-in-out infinite alternate;
        }
        @keyframes q-dot-offset {
          from { opacity: 0; }
          to { opacity: 0.25; }
        }
        .q-dot-lit {
          background-image: radial-gradient(circle, rgba(0, 0, 0, 0.44) 0.4px, transparent 0.5px);
          -webkit-mask-image: radial-gradient(circle 50px at var(--qdot-x, 50%) var(--qdot-y, 50%), rgba(0, 0, 0, 0.65) 0%, rgba(0, 0, 0, 0) 100%);
          mask-image: radial-gradient(circle 50px at var(--qdot-x, 50%) var(--qdot-y, 50%), rgba(0, 0, 0, 0.65) 0%, rgba(0, 0, 0, 0) 100%);
        }
        /* Density pulse: the ambient dot field is a constant base
           layer plus an offset layer (same 14px pitch, shifted 7px
           so each offset dot sits at the center of a base-grid
           cell) whose opacity pulses 0 to 0.25 over 9s ease-in-out
           infinite alternate. The wrapper above carries the
           entrance fade, so the pulse never fights it. The lit
           layer keeps its cursor-only behavior. */
        /* B15 bloom: expands from a small faint ring to full
           size while fading out over 1.4s. The key bump on each tap
           remounts the element, so the animation restarts. The P2
           auto bloom at first progress 1.0 reuses this class, so
           it shares the same size, stroke, and duration. */
        .q-bloom {
          animation: q-bloom 1.4s ease-out forwards;
        }
        @keyframes q-bloom {
          from { transform: scale(0.2); opacity: 0.35; }
          to { transform: scale(1); opacity: 0; }
        }
        /* P2 pulse: the V6 center dot breathes once its ring fade
           is complete. Applied only when ringOpacity >= 1, so the
           fade itself stays inline-opacity-driven. */
        .q-pulse-dot {
          animation: q-pulse-dot 3s ease-in-out infinite alternate;
        }
        @keyframes q-pulse-dot {
          from { opacity: 1; }
          to { opacity: 0.6; }
        }
        @media (max-width: 1023px) {
          .q-pin-wrap {
            height: calc(100svh + 1125px + 140px);
          }
          .q-pin-sticky {
            padding: 70px 24px;
          }
          .q-drift-ring {
            display: none;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .q-pin-wrap {
            height: auto;
          }
          .q-pin-sticky {
            position: static;
            height: auto;
            min-height: auto;
            overflow: visible;
          }
          .q-dot-offset {
            animation: none;
          }
          .q-bloom {
            animation: none;
          }
          .q-pulse-dot {
            animation: none;
          }
        }
      `}</style>
      <div
        ref={stickyRef}
        className="q-pin-sticky"
        onPointerDown={handlePointerDown}
      >
        {/* Entrance opacity lives on the wrapper so the offset
            pulse animation on an inner dot layer never overrides it:
            animations beat inline opacity on the same element. */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            zIndex: 0,
            opacity: dotEntrance,
          }}
        >
          <div aria-hidden="true" className="q-dot-base" />
          <div aria-hidden="true" className="q-dot-offset" />
        </div>
        <div
          aria-hidden="true"
          className="q-dot-lit"
          style={{
            opacity: cursorLit ? dotEntrance : 0,
            transition: `opacity ${cursorLit ? 0 : 600}ms ease`,
          }}
        />
        {/* B15 background layer: one tap bloom plus one slow drift
            ring through the right empty area. Clipped to the section
            by its own overflow, behind the text block. */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 0,
            overflow: "hidden",
            pointerEvents: "none",
          }}
        >
          {bloom && (
            <div
              key={bloom.key}
              aria-hidden="true"
              className="q-bloom"
              style={{
                position: "absolute",
                left: bloom.x - 120,
                top: bloom.y - 120,
                width: 240,
                height: 240,
                borderRadius: "50%",
                border: "1px solid rgba(96, 110, 130, 0.45)",
              }}
            />
          )}
          <div
            aria-hidden="true"
            className="q-drift-ring"
            style={{
              position: "absolute",
              right: "6%",
              top: `${10 + progress * 60}%`,
              width: 200,
              height: 200,
              borderRadius: "50%",
              border: `1px solid ${INK}`,
              opacity: 0.25,
            }}
          />
        </div>
        {body(progress)}
      </div>
    </section>
  );
}
