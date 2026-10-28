/**
 * Profile: the "team" equivalent for a one-person lab, Onlines
 * section 6 equivalent. Title at team-section scale (64-96px),
 * bio from the old site, anchor numbers as plain text rows,
 * never as KPI cards. Blue #0859D4 only for the email link.
 *
 * Motion (self-contained, no shared motion file):
 * - Title reveals on scroll, bio paragraphs fade up in 80ms steps,
 *   anchor-number text rows stagger in at 80ms steps.
 * - A tiny local IntersectionObserver adds mvP-in to the section
 *   once it enters the viewport, then unobserves. Elements are only
 *   hidden after the effect arms the section (mvP-armed), so content
 *   never stays invisible if the observer cannot run.
 * - The title highlight is the reference team highlight, measured
 *   in docs/deep/06: a light-blue bar grows from width 0 to full
 *   over 2000ms ease-out when the title reveals, with a 4px blue
 *   bar at its left edge and 16px round blue knobs tracking both
 *   edges (the right knob rides the growing bar). The period after
 *   "builds" sits outside the highlight, as in the reference.
 * - The mailto link draws its underline on hover/focus (300ms).
 * - Portrait card, hero-style: the photo (the user's own public
 *   photo from the old site, optimized to public/profile.webp)
 *   sits in a card framed like the hero selection box (1px dashed
 *   border, 4 small 10px square handles at the corners), beside
 *   the bio on desktop and stacked above it on mobile. Floating
 *   fact chips carry only real recorded facts, never new numbers.
 * - The frame border is drawn by an SVG rect overlay (marching
 *   ants: 1px dashed stroke in the frame grey, dashoffset animated
 *   12s linear infinite), not by a CSS border, so there is exactly
 *   one dash pattern and it crawls. The CSS border is transparent
 *   only to keep the card's box size identical. Under
 *   prefers-reduced-motion the dashes render static.
 * - The header block (kicker + title) sits in a "sec-slide
 *   from-left" wrapper that gains " in" when the section enters
 *   view; the slide CSS itself lives in section-slide.css.
 * - prefers-reduced-motion: everything is shown instantly, no motion.
 * - Explicit colors on all text: a global h1-h6 rule forces dark
 *   #1D1D1F, so headings and values never rely on inheritance.
 */

import { useEffect, useRef, useState } from "react";

const DISPLAY =
  "Inter, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";
const MONO =
  "'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace";

const ANCHORS: Array<{ label: string; value: string }> = [
  { label: "GPA, Bachelor of Medicine, UII", value: "3.90 / 4.0" },
  { label: "Total awards recorded on the old site", value: "29" },
  { label: "Gold medals", value: "6" },
  { label: "International items", value: "12" },
  { label: "Old-site publications", value: "4" },
  { label: "Certifications", value: "20+" },
  { label: "Key roles", value: "8" },
];

/* Floating fact chips: only real recorded facts, decorative
   duplicates of facts already shown on the site (aria-hidden,
   pointer-events none). */
const FACT_CHIPS: Array<{
  text: string;
  style: React.CSSProperties;
  duration: number;
  delay: number;
}> = [
  {
    text: "GPA 3.90 / 4.0",
    style: { top: -14, right: 16 },
    duration: 9,
    delay: 0,
  },
  {
    text: "Most Outstanding Student UII 2025",
    style: { bottom: 72, left: -14 },
    duration: 11,
    delay: 1.2,
  },
  {
    text: "Beasiswa Unggulan 2023",
    style: { bottom: -14, right: 24 },
    duration: 13,
    delay: 2.4,
  },
];

/* 4 corner handles for the portrait selection frame. */
const FRAME_HANDLES: Array<React.CSSProperties> = [
  { top: -5, left: -5 },
  { top: -5, right: -5 },
  { bottom: -5, left: -5 },
  { bottom: -5, right: -5 },
];

const REVEAL_CSS = `
.mvP-armed .mvP-reveal {
  opacity: 0;
  transform: translateY(18px);
  transition: opacity 600ms ease, transform 600ms cubic-bezier(0.22, 1, 0.36, 1);
}
.mvP-armed.mvP-in .mvP-reveal {
  opacity: 1;
  transform: translateY(0);
}
.mvP-mailto {
  text-decoration: none;
  background-image: linear-gradient(currentColor, currentColor);
  background-repeat: no-repeat;
  background-position: 0 100%;
  background-size: 0% 1px;
  transition: background-size 300ms ease;
  padding-bottom: 2px;
}
.mvP-mailto:hover,
.mvP-mailto:focus-visible {
  background-size: 100% 1px;
}
.mvP-highlight {
  position: relative;
  padding: 0 10px 0 8px;
}
.mvP-highlight-bar {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 0;
  background: #DCE9FD;
  border-left: 4px solid #0859D4;
}
.mvP-armed.mvP-in .mvP-highlight-bar {
  animation: mvP-grow 2000ms ease-out forwards;
}
@keyframes mvP-grow {
  to { width: 100%; }
}
.mvP-knob {
  position: absolute;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #0859D4;
  top: 50%;
  transform: translateY(-50%);
  z-index: 2;
}
.mvP-grid {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 48px;
  align-items: start;
}
@media (max-width: 900px) {
  .mvP-grid {
    grid-template-columns: 1fr;
  }
}
.mvP-frame {
  position: relative;
  /* Transparent: the visible dashed frame is the SVG rect below,
     so the crawl has a single dash pattern. Size unchanged. */
  border: 1px solid transparent;
  padding: 16px;
  background: #FFFFFF;
  box-sizing: border-box;
}
/* Marching ants overlay: same rect as the old dashed frame,
   1px dashed stroke in the frame grey, crawling slowly. The
   -40 offset is a whole number of 10px dash periods, so the
   12s loop restarts with no visible jump. */
.mvP-ants {
  position: absolute;
  inset: -1px;
  overflow: visible;
  pointer-events: none;
  z-index: 1;
}
.mvP-ants rect {
  fill: none;
  stroke: rgba(18, 18, 19, 0.2);
  stroke-width: 1;
  stroke-dasharray: 5 5;
  animation: mvP-ants 12s linear infinite;
}
@keyframes mvP-ants {
  to { stroke-dashoffset: -40; }
}
.mvP-handle {
  position: absolute;
  width: 10px;
  height: 10px;
  background: #FFFFFF;
  border: 1px solid #98989C;
  box-sizing: border-box;
  /* Above the marching-ants SVG (z-index 1) so dashes never cross the handles. */
  z-index: 2;
}
.mvP-chip {
  position: absolute;
  pointer-events: none;
  white-space: nowrap;
  font-family: 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 11px;
  letter-spacing: 0.04em;
  color: #1D1D1F;
  background: #FFFFFF;
  border: 1px solid #E0E0E0;
  border-radius: 999px;
  padding: 5px 10px;
  box-shadow: 0 2px 8px rgba(1, 1, 1, 0.06);
  z-index: 1;
  animation-name: mvP-float;
  animation-timing-function: ease-in-out;
  animation-iteration-count: infinite;
}
@keyframes mvP-float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
}
@media (hover: none) {
  .mvP-chip {
    display: none;
  }
}
@media (prefers-reduced-motion: reduce) {
  .mvP-armed .mvP-reveal {
    opacity: 1 !important;
    transform: none !important;
    transition: none !important;
  }
  .mvP-mailto {
    transition: none;
  }
  .mvP-highlight-bar {
    animation: none;
    width: 100%;
  }
  .mvP-chip {
    display: none;
    animation: none;
  }
  .mvP-ants rect {
    animation: none;
  }
}
`;

export default function Profile() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    section.classList.add("mvP-armed");
    if (typeof IntersectionObserver === "undefined") {
      section.classList.add("mvP-in");
      setInView(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            section.classList.add("mvP-in");
            setInView(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.15 },
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="profile"
      ref={sectionRef}
      aria-labelledby="profile-heading"
      style={{
        background: "#FAFAFA",
        color: "#010101",
        fontFamily: DISPLAY,
        padding: "130px 24px",
      }}
    >
      <style>{REVEAL_CSS}</style>
      <div style={{ maxWidth: 1160, margin: "0 auto" }}>
        <div className={inView ? "sec-slide from-left in" : "sec-slide from-left"}>
        <p
          style={{
            fontFamily: MONO,
            fontSize: 12,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "#666666",
            margin: "0 0 24px",
          }}
        >
          Profile
        </p>
        <h2
          id="profile-heading"
          className="mvP-reveal"
          style={{
            fontSize: "clamp(48px, 8vw, 96px)",
            lineHeight: 1.02,
            letterSpacing: "-0.02em",
            fontWeight: 700,
            color: "#010101",
            margin: "0 0 48px",
            maxWidth: 900,
          }}
        >
          A researcher who{" "}
          <span className="mvP-highlight">
            <span aria-hidden="true" className="mvP-highlight-bar">
              <span
                aria-hidden="true"
                className="mvP-knob"
                style={{ right: -8 }}
              />
            </span>
            <span
              aria-hidden="true"
              className="mvP-knob"
              style={{ left: -8 }}
            />
            <span style={{ position: "relative", zIndex: 1 }}>builds</span>
          </span>
          .
        </h2>
        </div>
        <div className="mvP-grid">
          <div className="mvP-reveal">
            <div className="mvP-frame">
              <svg aria-hidden="true" className="mvP-ants">
                <rect x="0" y="0" width="100%" height="100%" />
              </svg>
              {FRAME_HANDLES.map((position, index) => (
                <span
                  key={index}
                  aria-hidden="true"
                  className="mvP-handle"
                  style={position}
                />
              ))}
              <img
                src="/profile.webp"
                alt="Portrait of Daivan Febri Juan Setiya, founder of DaivanLabs"
                style={{ display: "block", width: "100%", height: "auto" }}
              />
              {FACT_CHIPS.map((chip) => (
                <span
                  key={chip.text}
                  aria-hidden="true"
                  className="mvP-chip"
                  style={{
                    ...chip.style,
                    animationDuration: `${chip.duration}s`,
                    animationDelay: `${chip.delay}s`,
                  }}
                >
                  {chip.text}
                </span>
              ))}
            </div>
            <p
              style={{
                fontFamily: MONO,
                fontSize: 12,
                lineHeight: 1.7,
                color: "#666666",
                margin: "16px 0 0",
              }}
            >
              Daivan Febri Juan Setiya - Founder, DaivanLabs
            </p>
          </div>
          <div style={{ maxWidth: 680 }}>
          <p
            className="mvP-reveal"
            style={{
              fontSize: 18,
              lineHeight: 1.65,
              color: "#010101",
              margin: "0 0 24px",
            }}
          >
            I am Daivan Febri Juan Setiya, a medical student and researcher
            in Indonesia. Guided by the principle{" "}
            <em>Ad maiora natus sum</em> (born for greater things), I view
            medicine as a pathway to transformative service.
          </p>
          <p
            className="mvP-reveal"
            style={{
              fontSize: 18,
              lineHeight: 1.65,
              color: "#010101",
              margin: "0 0 24px",
              transitionDelay: "80ms",
            }}
          >
            My goal is to move beyond immediate solutions and create
            sustainable health systems for Indonesia, through research
            done carefully, tools that are actually useful, and work
            finished properly.
          </p>
          <p
            className="mvP-reveal"
            style={{
              fontSize: 18,
              lineHeight: 1.65,
              color: "#010101",
              margin: "0 0 24px",
              transitionDelay: "160ms",
            }}
          >
            I founded DaivanLabs in June 2025 to apply coding skills
            (Code) to healthcare-related tools (Cure) and to build
            professional connections (Connect).
          </p>
          <p
            className="mvP-reveal"
            style={{
              fontFamily: MONO,
              fontSize: 13,
              lineHeight: 1.7,
              color: "#3C3C38",
              margin: "0 0 24px",
              transitionDelay: "240ms",
            }}
          >
            Current status: clinical clerk (koas), surgery rotation from
            5 October 2026. Based in Indonesia.{" "}
            <a
              href="mailto:daivanfebrijuansetiya@gmail.com"
              className="mvP-mailto"
              style={{ color: "#0859D4" }}
            >
              daivanfebrijuansetiya@gmail.com
            </a>
          </p>
          </div>
        </div>
        <dl style={{ margin: "64px 0 0", padding: 0 }}>
          {ANCHORS.map((row, i) => (
            <div
              key={row.label}
              className="mvP-reveal"
              style={{
                borderTop: "1px solid #E0E0E0",
                padding: "16px 0",
                display: "flex",
                flexWrap: "wrap",
                gap: "8px 48px",
                alignItems: "baseline",
                transitionDelay: `${i * 80}ms`,
              }}
            >
              <dt
                style={{
                  fontFamily: MONO,
                  fontSize: 13,
                  color: "#666666",
                  minWidth: "min(320px, 100%)",
                }}
              >
                {row.label}
              </dt>
              <dd
                style={{
                  fontSize: 18,
                  fontWeight: 700,
                  letterSpacing: "-0.01em",
                  color: "#010101",
                  margin: 0,
                  overflowWrap: "anywhere",
                }}
              >
                {row.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
