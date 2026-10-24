import { Link, useParams } from "react-router-dom";
import { researchItems, oldPublications } from "../data/content";
import FaersPlotSection from "../components/FaersPlotSection";

/**
 * Research detail page, pattern: breadcrumb, abstract, method, results,
 * limitations (always present), links.
 *
 * Honesty rules, enforced here, not in prose:
 * - Only fields that exist in src/data/content.ts are rendered, plus the
 *   FAERS plot, which comes only from src/data/faers-plot.json through
 *   FaersPlotSection. That component gates every row on its own: only
 *   rows marked verified, with a finite ROR and a finite 95 percent CI,
 *   are plotted. Unverified rows are never rendered with a value.
 * - The unverified percentage figure is never rendered as a result.
 * - A slug with no matching item renders an honest "detail menyusul"
 *   page. Nothing about that item is invented.
 */

function formatSampleSize(n: number): string {
  return n.toLocaleString("en-US");
}

export default function ResearchDetail() {
  const { slug } = useParams<{ slug: string }>();
  const item = researchItems.find((entry) => entry.id === slug);
  const oldPub = !item
    ? oldPublications.find((entry) => entry.id === slug)
    : undefined;

  if (oldPub) {
    return (
      <main className="container research-detail">
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <Link to="/">Home</Link> / <Link to="/research">Research</Link> /{" "}
          {oldPub.title}
        </nav>
        <p className="research-meta">{oldPub.type}</p>
        <h1>{oldPub.title}</h1>
        <p className="research-meta">
          {oldPub.year} | {oldPub.venue ? `${oldPub.venue} | ` : ""}Old-site
          status: {oldPub.oldSiteStatus}
        </p>
        {oldPub.versionNote ? <p>{oldPub.versionNote}</p> : null}
        <h2>About this entry</h2>
        <p>
          Title as recorded on the old site. No journal, DOI, volume, or
          full author list is shown, because none is recorded in that
          source. {oldPub.authorsNote}
        </p>
        <p>
          <Link to="/research">Back to research</Link>
        </p>
      </main>
    );
  }

  if (!item) {
    return (
      <main className="container research-detail">
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <Link to="/">Home</Link> / Research
        </nav>
        <h1>Detail to follow.</h1>
        <p>
          Detail for this item has not been written yet. This page
          deliberately shows no summary, number, or link until the data is
          available from a verified source.
        </p>
        <p>
          <Link to="/">Back to home</Link>
        </p>
      </main>
    );
  }

  const title = item.fullTitle ?? item.shortTitle;

  // Method is only stated where the source states it. The FAERS method
  // comes from its full title; the cerclage method comes from its kicker.
  // For other items no separate method is recorded, and none is invented.
  const methodText =
    item.id === "faers-resistant-hypertension"
      ? "Disproportionality and time-to-onset analysis on reports from the FDA Adverse Event Reporting System (FAERS)."
      : item.id === "cerclage-twin-pregnancies"
        ? "Systematic review and meta-analysis."
        : null;

  return (
    <main className="container research-detail">
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <Link to="/">Home</Link> / <Link to="/research">Research</Link> /{" "}
        {item.shortTitle}
      </nav>

      <p className="research-meta">{item.kicker}</p>
      <h1>{title}</h1>
      <p className="research-meta">
        {item.status} | {item.venue} | {item.year ?? "Year not recorded"} | {item.role}
      </p>
      {item.coAuthors && item.coAuthors.length > 0 && (
        <p className="research-meta">
          Co-authors: {item.coAuthors.join(", ")}
        </p>
      )}

      <h2>Abstract</h2>
      <p>{item.description}</p>

      <h2>Method</h2>
      {methodText ? (
        <p>{methodText}</p>
      ) : (
        <p>
          No separate method is recorded for this item in a verified
          source, so none is shown here.
        </p>
      )}

      <h2>Results</h2>
      {item.faers ? (
        <>
          <p>
            Sample analysed: {formatSampleSize(item.faers.sampleSize)}{" "}
            FAERS reports.
          </p>
          <p>
            Aprocitentan cohort: n = {item.faers.aprocitentanCohort.n},{" "}
            {item.faers.aprocitentanCohort.note}
          </p>
          <FaersPlotSection />
        </>
      ) : (
        <p>
          No results are recorded for this item in a verified source,
          so no result numbers are shown here.
        </p>
      )}

      <h2>Limitations</h2>
      {item.faers ? (
        <p>{item.faers.honestyNote}</p>
      ) : (
        <p>
          Limitations for this item have not been written separately from
          the description above in a verified source. This section is
          deliberately left without additional claims until that note is
          available.
        </p>
      )}

      <h2>Links</h2>
      {item.linkUrl ? (
        <ul className="research-links">
          <li>
            <a href={item.linkUrl} target="_blank" rel="noreferrer">
              {item.linkLabel}
            </a>
          </li>
        </ul>
      ) : (
        <p>
          No outbound link is recorded for this item in a verified
          source.
        </p>
      )}
    </main>
  );
}
