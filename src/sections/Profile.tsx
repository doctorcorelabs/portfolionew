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
 * - The mailto link draws its underline on hover/focus (300ms).
 * - prefers-reduced-motion: everything is shown instantly, no motion.
 */

import { useEffect, useRef } from "react";

const DISPLAY =
  "Inter, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";
const MONO =
  "'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace";

const ANCHORS: Array<{ label: string; value: string }> = [
  { label: "GPA, Bachelor of Medicine, UII", value: "3.91 / 4.0" },
  { label: "Total awards recorded on the old site", value: "29" },
  { label: "Gold medals", value: "6" },
  { label: "International items", value: "12" },
  { label: "Old-site publications", value: "4" },
  { label: "Certifications", value: "20+" },
  { label: "Key roles", value: "8" },
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
@media (prefers-reduced-motion: reduce) {
  .mvP-armed .mvP-reveal {
    opacity: 1 !important;
    transform: none !important;
    transition: none !important;
  }
  .mvP-mailto {
    transition: none;
  }
}
`;

export default function Profile() {
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    section.classList.add("mvP-armed");
    if (typeof IntersectionObserver === "undefined") {
      section.classList.add("mvP-in");
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            section.classList.add("mvP-in");
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
            margin: "0 0 48px",
            maxWidth: 900,
          }}
        >
          A researcher who{" "}
          <span
            style={{
              background: "#DCE9FD",
              borderLeft: "4px solid #0859D4",
              padding: "0 10px 0 8px",
              boxDecorationBreak: "clone",
              WebkitBoxDecorationBreak: "clone",
            }}
          >
            builds.
          </span>
        </h2>
        <div style={{ maxWidth: 680 }}>
          <p
            className="mvP-reveal"
            style={{ fontSize: 18, lineHeight: 1.65, margin: "0 0 24px" }}
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
                  minWidth: 320,
                }}
              >
                {row.label}
              </dt>
              <dd
                style={{
                  fontSize: 18,
                  fontWeight: 700,
                  letterSpacing: "-0.01em",
                  margin: 0,
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
