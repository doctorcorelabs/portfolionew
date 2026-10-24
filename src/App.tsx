import { lazy, Suspense, useEffect, useState } from "react";
import type { ComponentType } from "react";
import { Route, Routes } from "react-router-dom";
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

  if (CanvasPage) {
    return <CanvasPage />;
  }
  /* CANVAS_ROUTE_END */

  return (
    <div>
      <Header />
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
      <Footer />
    </div>
  );
}
