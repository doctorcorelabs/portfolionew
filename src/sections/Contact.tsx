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
          will-change: transform;
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
        .contact-mv-root .contact-mv-action {
          background-image: linear-gradient(currentColor, currentColor);
          background-repeat: no-repeat;
          background-position: 0 100%;
          background-size: 0% 2px;
          transition: background-size 400ms ease, opacity 700ms ease 500ms, transform 700ms ease 500ms;
        }
        .contact-mv-root .contact-mv-action:hover {
          background-size: 100% 2px;
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
          .contact-mv-root .contact-mv-action,
          .contact-mv-root .contact-mv-social {
            transition: none !important;
            opacity: 1 !important;
            transform: none !important;
            background-size: 100% 2px;
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
        .contact-dot-base {
          background-image: radial-gradient(circle, rgba(0, 0, 0, 0.2) 0.4px, transparent 0.5px);
        }
        .contact-dot-lit {
          background-image: radial-gradient(circle, rgba(0, 0, 0, 0.44) 0.4px, transparent 0.5px);
          -webkit-mask-image: radial-gradient(circle at var(--dot-x, 50%) var(--dot-y, 50%), rgba(0, 0, 0, 0.9) 0px, rgba(0, 0, 0, 0.65) 50px, rgba(0, 0, 0, 0) 350px);
          mask-image: radial-gradient(circle at var(--dot-x, 50%) var(--dot-y, 50%), rgba(0, 0, 0, 0.9) 0px, rgba(0, 0, 0, 0.65) 50px, rgba(0, 0, 0, 0) 350px);
        }
        @media (hover: none) {
          .contact-dot-base {
            -webkit-mask-image: radial-gradient(circle at 50% 50%, rgba(0, 0, 0, 1) 0px, rgba(0, 0, 0, 0) 300px);
            mask-image: radial-gradient(circle at 50% 50%, rgba(0, 0, 0, 1) 0px, rgba(0, 0, 0, 0) 300px);
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
        <p className="contact-mv-fade" style={{ ...styles.body, transitionDelay: "350ms" }}>
          Collaboration, supervision conversations, and project discussions
          are welcome. Send one email describing the work, who it is for,
          and its current status.
        </p>
        <a
          href={`mailto:${EMAIL}`}
          style={styles.action}
          className="contact-mv-fade contact-mv-action"
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
    margin: "0 0 40px",
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
    color: "#0859D4",
    textDecoration: "none",
    overflowWrap: "anywhere",
  },
};
