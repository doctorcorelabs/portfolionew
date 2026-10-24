import { lazy, Suspense, useEffect, useRef, useState } from "react";
import type { ComponentType } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import NotFound from "./pages/NotFound";
import ResearchDetail from "./pages/ResearchDetail";
import ResearchIndex from "./pages/ResearchIndex";
import AwardsPage from "./pages/AwardsPage";
import ExperiencePage from "./pages/ExperiencePage";
import EducationPage from "./pages/EducationPage";
import CertificationsPage from "./pages/CertificationsPage";

/**
 * Homepage section order, Onlines anatomy: hero giant word, quote claim,
 * dark services, dark manifesto, profile, selected works, affiliation
 * strip, giant contact, footer. Every section is a default-export,
 * no-props component in src/sections/, loaded lazily so a slow section
 * never blocks the rest. Pages are imported directly, as in the
 * previous App, so route components resolve without an extra boundary.
 */
const Hero = lazy(() => import("./sections/Hero"));
const Quote = lazy(() => import("./sections/Quote"));
const Services = lazy(() => import("./sections/Services"));
const Manifesto = lazy(() => import("./sections/Manifesto"));
const Profile = lazy(() => import("./sections/Profile"));
const Works = lazy(() => import("./sections/Works"));
const Affiliations = lazy(() => import("./sections/Affiliations"));
const Contact = lazy(() => import("./sections/Contact"));

function HomePage() {
  return (
    <main>
      <Suspense
        fallback={<p className="page-loading">Memuat bagian...</p>}
      >
        <Hero />
        <Quote />
        <Services />
        <Manifesto />
        <Profile />
        <Works />
        <Affiliations />
        <Contact />
      </Suspense>
    </main>
  );
}

export default function App() {
  /* CANVAS_ROUTE_BEGIN - DEV-only, tidak masuk navigasi.
   * Route #canvas dimuat lewat dynamic import di dalam guard
   * import.meta.env.DEV. Di build produksi cabang ini gugur, jadi
   * CanvasPage dan DialKit tidak ikut terbit. Jangan pindahkan import
   * ini ke atas file dan jangan tambahkan prop productionEnabled. */
  const [CanvasPage, setCanvasPage] = useState<ComponentType | null>(null);

  useEffect(() => {
    if (!import.meta.env.DEV) return;
    const load = () => {
      if (window.location.hash === "#canvas") {
        void import("./dev/CanvasPage").then((m) =>
          setCanvasPage(() => m.CanvasPage),
        );
      } else {
        setCanvasPage(null);
      }
    };
    load();
    window.addEventListener("hashchange", load);
    return () => window.removeEventListener("hashchange", load);
  }, []);

  /* Route-change motion: App renders inside BrowserRouter (see
   * main.tsx), so useLocation is available here. All hooks below run
   * before the CanvasPage early return, so hook order stays stable. */
  const location = useLocation();

  /* Reading-progress hairline: a fixed 2px bar at the very top of
   * the viewport. Its scaleX is written straight to the element by
   * a rAF-throttled scroll listener, so no React state changes per
   * scroll frame. Fixed positioning means it never shifts layout,
   * and pointer-events none means it never blocks clicks. */
  const progressRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const bar = progressRef.current;
    if (!bar) return;
    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }
    let ticking = false;
    const update = () => {
      ticking = false;
      const max =
        document.documentElement.scrollHeight - window.innerHeight;
      const p =
        max > 0
          ? Math.min(1, Math.max(0, window.scrollY / max))
          : 0;
      bar.style.transform = `scaleX(${p})`;
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
  }, []);

  /* (d) Header shadow: the header sits in normal flow, so its wrapper
   * carries the shadow once the page is scrolled past 24px. The
   * wrapper adds no height or padding of its own. */
  const [scrolledPast, setScrolledPast] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const next = window.scrollY > 24;
      setScrolledPast((prev) => (prev === next ? prev : next));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* (b) Scroll position on route change. A #contact hash lands on the
   * contact anchor instead of the top; the anchor section is lazy, so
   * the landing retries via requestAnimationFrame until the element
   * exists (bounded, about one second). The #canvas hash is owned by
   * the DEV canvas effect above and is left alone here. Route-change
   * scrolling is instant even though (c) makes anchor scrolling
   * smooth, by briefly overriding the inline scroll behavior. */
  useEffect(() => {
    if (location.hash === "#canvas") return;
    if (location.hash === "#contact") {
      const reduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      const behavior: ScrollBehavior = reduced ? "auto" : "smooth";
      let tries = 0;
      let raf = 0;
      const land = () => {
        const el = document.getElementById("contact");
        if (el) {
          el.scrollIntoView({ behavior });
          return;
        }
        if (tries < 60) {
          tries += 1;
          raf = requestAnimationFrame(land);
        }
      };
      land();
      return () => cancelAnimationFrame(raf);
    }
    const root = document.documentElement;
    const previous = root.style.scrollBehavior;
    root.style.scrollBehavior = "auto";
    window.scrollTo(0, 0);
    root.style.scrollBehavior = previous;
  }, [location.pathname, location.hash]);

  if (CanvasPage) {
    return <CanvasPage />;
  }
  /* CANVAS_ROUTE_END */

  return (
    <div id="top">
      <div
        aria-hidden="true"
        ref={progressRef}
        className="app-read-progress"
      />
      {/* (a) Route-change fade plus 8px rise keyframes and (c) smooth
       * in-page anchor scrolling. Both are disabled under
       * prefers-reduced-motion, and neither locks scrolling nor
       * replaces the cursor. */}
      <style>{`
        .app-read-progress {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: #0859D4;
          transform: scaleX(0);
          transform-origin: left;
          z-index: 100;
          pointer-events: none;
        }
        @media (prefers-reduced-motion: reduce) {
          .app-read-progress { display: none; }
        }
        @media (prefers-reduced-motion: no-preference) {
          html { scroll-behavior: smooth; }
          .app-route-fade { animation: app-route-fade 400ms cubic-bezier(0.22, 1, 0.36, 1); }
        }
        @keyframes app-route-fade {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: none; }
        }
      `}</style>
      <div
        style={
          scrolledPast
            ? {
                boxShadow:
                  "0 1px 0 rgba(1, 1, 1, 0.06), 0 8px 24px rgba(1, 1, 1, 0.06)",
              }
            : undefined
        }
      >
        <Header />
      </div>
      {/* (a) Keyed by pathname so each route change replays the fade
       * and rise. Header and Footer sit outside, so they stay stable. */}
      <div key={location.pathname} className="app-route-fade">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/research" element={<ResearchIndex />} />
          <Route path="/research/:slug" element={<ResearchDetail />} />
          <Route path="/awards" element={<AwardsPage />} />
          <Route path="/experience" element={<ExperiencePage />} />
          <Route path="/education" element={<EducationPage />} />
          <Route path="/certifications" element={<CertificationsPage />} />
          {/* Canvas DEV-only memakai hash #canvas (ditangani di atas, sebelum Routes). Bukan rute navigasi. */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}
