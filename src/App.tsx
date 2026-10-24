import { lazy, Suspense, useEffect, useState } from "react";
import type { ComponentType } from "react";
import { Link, Route, Routes } from "react-router-dom";
import NotFound from "./pages/NotFound";
import ResearchDetail from "./pages/ResearchDetail";

/**
 * Homepage section order, narrative first: hero, featured research,
 * method, timeline, tools, principles, awards, affiliations, about,
 * contact. Every section is a default-export, no-props component in
 * src/sections/, loaded lazily so a slow section never blocks the rest.
 */
const Hero = lazy(() => import("./sections/Hero"));
const Results = lazy(() => import("./sections/Results"));
const Methods = lazy(() => import("./sections/Methods"));
const Timeline = lazy(() => import("./sections/Timeline"));
const Tools = lazy(() => import("./sections/Tools"));
const Principles = lazy(() => import("./sections/Principles"));
const Awards = lazy(() => import("./sections/Awards"));
const Affiliations = lazy(() => import("./sections/Affiliations"));
const About = lazy(() => import("./sections/About"));
const Contact = lazy(() => import("./sections/Contact"));

function HomePage() {
  return (
    <main>
      <Suspense
        fallback={<p className="page-loading">Memuat bagian...</p>}
      >
        <Hero />
        <Results />
        <Methods />
        <Timeline />
        <Tools />
        <Principles />
        <Awards />
        <Affiliations />
        <About />
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

  if (CanvasPage) {
    return <CanvasPage />;
  }
  /* CANVAS_ROUTE_END */

  return (
    <div>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/research/:slug" element={<ResearchDetail />} />
        {/* Canvas DEV-only memakai hash #canvas (ditangani di atas, sebelum Routes). Bukan rute navigasi. */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      <footer className="container" style={{ padding: "24px 0 48px" }}>
        <p className="research-meta">
          <Link to="/">DaivanLabs.</Link> Research and healthcare tools from
          Indonesia. Code for Cure.
        </p>
      </footer>
    </div>
  );
}
