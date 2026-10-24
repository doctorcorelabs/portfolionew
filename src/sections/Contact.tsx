import { useEffect, useRef, useState, type MouseEvent as ReactMouseEvent } from "react";

const EMAIL = "daivanfebrijuansetiya@gmail.com";

export default function Contact() {
  const [inView, setInView] = useState(false);
  const [cursorLit, setCursorLit] = useState(false);
  const rootRef = useRef<HTMLElement | null>(null);

  const handleMouseMove = (event: ReactMouseEvent<HTMLElement>) => {
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }
    const node = rootRef.current;
    if (!node) return;
    const rect = node.getBoundingClientRect();
    node.style.setProperty("--dot-x", `${event.clientX - rect.left}px`);
    node.style.setProperty("--dot-y", `${event.clientY - rect.top}px`);
    setCursorLit(true);
  };

  const handleMouseLeave = () => {
    setCursorLit(false);
  };

  useEffect(() => {
    const node = rootRef.current;
    if (!node) return;
    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      style={styles.section}
      ref={rootRef}
      className={`contact-mv-root${inView ? " is-inview" : ""}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <style>{`
        .contact-mv-root .contact-mv-line {
          display: inline-block;
          overflow: hidden;
          vertical-align: bottom;
          padding-bottom: 0.14em;
          margin-bottom: -0.14em;
        }
        .contact-mv-root .contact-mv-line-inner {
          display: inline-block;
          transform: translateY(115%);
          transition: transform 900ms cubic-bezier(0.22, 1, 0.36, 1);
        }
        .contact-mv-root.is-inview .contact-mv-line-inner {
          transform: translateY(0);
        }
        .contact-mv-root .contact-mv-fade {
          opacity: 0;
          transform: translateY(12px);
          transition: opacity 700ms ease, transform 700ms ease;
        }
        .contact-mv-root.is-inview .contact-mv-fade {
          opacity: 1;
          transform: translateY(0);
        }
        /* Mailto pill: solid blue, 50px-class height, brightens
           to a lighter blue over 0.4s on hover/focus. */
        .contact-mv-root .contact-mv-pill {
          background-color: #0859D4;
          transition: background-color 400ms ease;
        }
        .contact-mv-root .contact-mv-pill:hover,
        .contact-mv-root .contact-mv-pill:focus-visible {
          background-color: #1A6BE8;
        }
        .contact-mv-root .contact-mv-pill:focus-visible {
          outline: 2px solid #0859D4;
          outline-offset: 3px;
        }
        /* Social links lift 3px over 0.4s on hover/focus. */
        .contact-mv-social a {
          display: inline-block;
          transition: transform 400ms ease;
        }
        .contact-mv-social a:hover,
        .contact-mv-social a:focus-visible {
          transform: translateY(-3px);
        }
        /* Watermark monogram: the site's own initials at 266px
           (170px mobile), 0.82 line height, -10px tracking, 92
           percent white fill with a faint 1px outline, rising 20px
           over 0.8s opacity / 1s transform on entrance. */
        .contact-watermark {
          position: absolute;
          left: 50%;
          top: 50%;
          z-index: 0;
          pointer-events: none;
          font-family: 'Inter Display', Inter, Arial, sans-serif;
          font-size: 266px;
          font-weight: 700;
          line-height: 0.82;
          letter-spacing: -10px;
          color: rgba(255, 255, 255, 0.92);
          -webkit-text-stroke: 1px rgba(1, 1, 1, 0.08);
          text-shadow: 0 0 1px #ffffff;
          opacity: 0;
          transform: translate(-50%, calc(-50% + 20px)) scale(0.98);
          transition: opacity 0.8s ease, transform 1s ease;
        }
        .contact-mv-root.is-inview .contact-watermark {
          opacity: 1;
          transform: translate(-50%, -50%) scale(1);
        }
        @media (max-width: 1023px) {
          .contact-watermark {
            font-size: 170px;
          }
        }
        .contact-dotted-rule {
          width: 160px;
          height: 1px;
          background-image: repeating-linear-gradient(to right, rgba(1, 1, 1, 0.55) 0 1px, transparent 1px 4px);
          background-size: 4px 1px;
          background-repeat: repeat-x;
        }
        .contact-mv-root .contact-mv-social {
          opacity: 0;
          transform: translateY(8px);
          transition: opacity 600ms ease, transform 600ms ease;
        }
        .contact-mv-root.is-inview .contact-mv-social {
          opacity: 1;
          transform: translateY(0);
        }
        @media (prefers-reduced-motion: reduce) {
          .contact-mv-root .contact-mv-line-inner,
          .contact-mv-root .contact-mv-fade,
          .contact-mv-root .contact-mv-pill,
          .contact-mv-root .contact-mv-social {
            transition: none !important;
            opacity: 1 !important;
            transform: none !important;
          }
          .contact-mv-root .contact-mv-pill {
            background-color: #0859D4;
          }
          .contact-mv-social a {
            transition: none !important;
            transform: none !important;
          }
          .contact-watermark {
            transition: none;
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
          }
        }
        .contact-dot-base,
        .contact-dot-lit {
          position: absolute;
          inset: 0;
          pointer-events: none;
          background-size: 14px 14px;
          background-repeat: repeat;
          z-index: 0;
        }
        /* Two masks with different jobs (docs/deep/04): the base
           field exists only within 350px of the cursor, and the lit
           layer is a 50px halo falling from 65 percent to nothing.
           Before the first mousemove the vars park at center. */
        .contact-dot-base {
          background-image: radial-gradient(circle, rgba(0, 0, 0, 0.2) 0.4px, transparent 0.5px);
          -webkit-mask-image: radial-gradient(circle 350px at var(--dot-x, 50%) var(--dot-y, 50%), rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 1) 60%, rgba(0, 0, 0, 0) 100%);
          mask-image: radial-gradient(circle 350px at var(--dot-x, 50%) var(--dot-y, 50%), rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 1) 60%, rgba(0, 0, 0, 0) 100%);
        }
        .contact-dot-lit {
          background-image: radial-gradient(circle, rgba(0, 0, 0, 0.44) 0.4px, transparent 0.5px);
          -webkit-mask-image: radial-gradient(circle 50px at var(--dot-x, 50%) var(--dot-y, 50%), rgba(0, 0, 0, 0.65) 0%, rgba(0, 0, 0, 0) 100%);
          mask-image: radial-gradient(circle 50px at var(--dot-x, 50%) var(--dot-y, 50%), rgba(0, 0, 0, 0.65) 0%, rgba(0, 0, 0, 0) 100%);
        }
        @media (hover: none) {
          .contact-dot-base {
            -webkit-mask-image: radial-gradient(circle at 50% 50%, rgba(0, 0, 0, 1) 0px, rgba(0, 0, 0, 0) 200px);
            mask-image: radial-gradient(circle at 50% 50%, rgba(0, 0, 0, 1) 0px, rgba(0, 0, 0, 0) 200px);
          }
          .contact-dot-lit {
            display: none;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .contact-dot-base {
            -webkit-mask-image: none;
            mask-image: none;
          }
          .contact-dot-lit {
            display: none;
          }
        }
        @keyframes contact-pill-float {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-8px);
          }
        }
        .contact-pill {
          position: absolute;
          z-index: 0;
          pointer-events: none;
          font-family: 'JetBrains Mono', ui-monospace, monospace;
          font-size: 11px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #666666;
          border: 1px solid #E0E0E0;
          background: rgba(255, 255, 255, 0.75);
          border-radius: 999px;
          padding: 8px 14px;
          white-space: nowrap;
          animation-name: contact-pill-float;
          animation-timing-function: ease-in-out;
          animation-iteration-count: infinite;
        }
        @media (hover: none) {
          .contact-pill {
            display: none;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .contact-pill {
            display: none;
          }
        }
        /* Decorative cursor chip: one colored arrow only, no label
           pill, so it cannot imply a person. It sits just right of
           the mailto pill row, below the content wrapper (z-index
           1), so it never covers text. Entrance reuses the section
           inView state: fade plus 10px rise over 0.6s, then static
           (no drift, no click behavior). */
        .contact-cursor-chip {
          position: absolute;
          left: 42%;
          top: 62%;
          z-index: 0;
          pointer-events: none;
          opacity: 0;
          transform: translateY(10px);
          transition: opacity 0.6s ease, transform 0.6s ease;
        }
        .contact-mv-root.is-inview .contact-cursor-chip {
          opacity: 1;
          transform: translateY(0);
        }
        @media (max-width: 1200px) {
          .contact-cursor-chip {
            left: 62%;
          }
        }
        @media (hover: none) {
          .contact-cursor-chip {
            display: none;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .contact-cursor-chip {
            display: none;
          }
        }
      `}</style>
      <div aria-hidden="true" className="contact-dot-base" />
      <div
        aria-hidden="true"
        className="contact-dot-lit"
        style={{
          opacity: cursorLit ? 1 : 0,
          transition: `opacity ${cursorLit ? 0 : 600}ms ease`,
        }}
      />
      <div aria-hidden="true" className="contact-watermark">
        DL
      </div>
      <span aria-hidden="true" className="contact-cursor-chip">
        <svg
          width="16"
          height="20"
          viewBox="0 0 14 18"
          aria-hidden="true"
          style={{ display: "block" }}
        >
          <path
            d="M1 1 L1 16 L4.8 12.2 L7 16.8 L9.2 15.4 L7.2 11.2 L13 11.2 Z"
            fill="#0859D4"
            stroke="#ffffff"
            strokeWidth="0.75"
          />
        </svg>
      </span>
      <span
        aria-hidden="true"
        className="contact-pill"
        style={{ top: 44, left: "6%", animationDuration: "9s", animationDelay: "0s" }}
      >
        Seoul 2026
      </span>
      <span
        aria-hidden="true"
        className="contact-pill"
        style={{ top: 44, right: "6%", animationDuration: "11s", animationDelay: "1.2s" }}
      >
        UII
      </span>
      <span
        aria-hidden="true"
        className="contact-pill"
        style={{ bottom: 64, right: "6%", animationDuration: "13s", animationDelay: "2.4s" }}
      >
        Code for Cure
      </span>
      <div style={styles.inner}>
        <h2 id="contact-heading" style={styles.giant}>
          <span className="contact-mv-line">
            <span className="contact-mv-line-inner" style={{ transitionDelay: "0ms" }}>
              Let&apos;s
            </span>
          </span>{" "}
          <span className="contact-mv-line">
            <span className="contact-mv-line-inner" style={{ transitionDelay: "90ms" }}>
              build
            </span>
          </span>{" "}
          <span className="contact-mv-line">
            <span className="contact-mv-line-inner" style={{ transitionDelay: "180ms" }}>
              together.
            </span>
          </span>
        </h2>
        <div
          aria-hidden="true"
          className="contact-mv-fade contact-dotted-rule"
          style={{ transitionDelay: "250ms", margin: "0 0 24px" }}
        />
        <p className="contact-mv-fade" style={{ ...styles.body, transitionDelay: "350ms" }}>
          Collaboration, supervision conversations, and project discussions
          are welcome. Send one email describing the work, who it is for,
          and its current status.
        </p>
        <a
          href={`mailto:${EMAIL}`}
          style={styles.action}
          className="contact-mv-fade contact-mv-pill"
        >
          {EMAIL}
        </a>
        <p style={styles.links}>
          <span className="contact-mv-social" style={{ transitionDelay: "650ms" }}>
            <a href="https://www.linkedin.com/in/daivan-febri-juan-setiya/" target="_blank" rel="noreferrer" style={styles.link}>
              LinkedIn
            </a>
          </span>
          <span className="contact-mv-social" style={{ transitionDelay: "750ms" }}>
            {" | "}
            <a href="https://orcid.org/0009-0000-2528-8459" target="_blank" rel="noreferrer" style={styles.link}>
              ORCID
            </a>
          </span>
          <span className="contact-mv-social" style={{ transitionDelay: "850ms" }}>
            {" | "}
            <a href="https://www.instagram.com/ddaiivan/" target="_blank" rel="noreferrer" style={styles.link}>
              Instagram
            </a>
          </span>
        </p>
      </div>
    </section>
  );
}

const styles: Record<string, React.CSSProperties> = {
  section: {
    position: "relative",
    overflow: "hidden",
    background: "#F5F5F7",
    color: "#010101",
    padding: "130px 24px 200px",
  },
  inner: {
    position: "relative",
    zIndex: 1,
    maxWidth: 1160,
    margin: "0 auto",
  },
  giant: {
    margin: "0 0 16px",
    fontFamily: "'Inter Display', Inter, Arial, sans-serif",
    fontSize: "clamp(56px, 13vw, 200px)",
    fontWeight: 700,
    lineHeight: 1,
    letterSpacing: "-0.02em",
    overflowWrap: "break-word",
  },
  body: {
    margin: "0 0 40px",
    maxWidth: 620,
    fontFamily: "'Inter Display', Inter, Arial, sans-serif",
    fontSize: 18,
    lineHeight: 1.65,
    color: "#1D1D1F",
  },
  links: {
    margin: "32px 0 0",
    fontFamily: "'Inter Display', Inter, Arial, sans-serif",
    fontSize: 16,
    color: "#1D1D1F",
  },
  link: {
    color: "#0859D4",
    textDecoration: "none",
  },
  action: {
    display: "inline-block",
    fontFamily: "'Inter Display', Inter, Arial, sans-serif",
    fontSize: 18,
    fontWeight: 700,
    color: "#FFFFFF",
    backgroundColor: "#0859D4",
    borderRadius: 999,
    padding: "14px 36px",
    textDecoration: "none",
    overflowWrap: "anywhere",
  },
};
