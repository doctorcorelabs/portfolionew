import { Link, useParams } from "react-router-dom";
import { researchItems } from "../data/content";

/**
 * Research detail page, pattern: breadcrumb, abstract, method, results,
 * limitations (always present), links.
 *
 * Honesty rules, enforced here, not in prose:
 * - Only fields that exist in src/data/content.ts are rendered.
 * - The FAERS ROR values are stored unlabelled in the data file and are
 *   never rendered here, labelled or otherwise, until a verified mapping
 *   lands in docs/faers-verified.json. The unverified percentage
 *   figure is likewise never rendered as a result.
 * - A slug with no matching item renders an honest "detail menyusul"
 *   page. Nothing about that item is invented.
 */

function formatSampleSize(n: number): string {
  return n.toLocaleString("en-US");
}

export default function ResearchDetail() {
  const { slug } = useParams<{ slug: string }>();
  const item = researchItems.find((entry) => entry.id === slug);

  if (!item) {
    return (
      <main className="container research-detail">
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <Link to="/">Beranda</Link> / Riset
        </nav>
        <h1>Detail menyusul.</h1>
        <p>
          Detail untuk riset ini belum ditulis. Halaman ini sengaja tidak
          menampilkan ringkasan, angka, atau tautan sampai datanya tersedia
          di sumber yang terverifikasi.
        </p>
        <p>
          <Link to="/">Kembali ke beranda</Link>
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
        <Link to="/">Beranda</Link> / <Link to="/">Riset</Link> /{" "}
        {item.shortTitle}
      </nav>

      <p className="research-meta">{item.kicker}</p>
      <h1>{title}</h1>
      <p className="research-meta">
        {item.status} | {item.venue} | {item.year} | {item.role}
      </p>
      {item.coAuthors && item.coAuthors.length > 0 && (
        <p className="research-meta">
          Co-authors: {item.coAuthors.join(", ")}
        </p>
      )}

      <h2>Abstrak</h2>
      <p>{item.description}</p>

      <h2>Metode</h2>
      {methodText ? (
        <p>{methodText}</p>
      ) : (
        <p>
          Metode terpisah belum tercatat untuk item ini di sumber yang
          terverifikasi, jadi tidak ada metode yang ditampilkan di sini.
        </p>
      )}

      <h2>Hasil</h2>
      {item.faers ? (
        <>
          <p>
            Sampel yang dianalisis: {formatSampleSize(item.faers.sampleSize)}{" "}
            laporan FAERS.
          </p>
          <p>
            Kohort aprocitentan: n = {item.faers.aprocitentanCohort.n},{" "}
            {item.faers.aprocitentanCohort.note}
          </p>
          <p>
            Nilai efek per obat dan per kejadian belum ditampilkan, karena
            pemetaan nilai ke obat dan kejadian masih menunggu verifikasi
            dari manuskrip atau poster final.
          </p>
        </>
      ) : (
        <p>
          Hasil belum tercatat untuk item ini di sumber yang terverifikasi,
          jadi tidak ada angka hasil yang ditampilkan di sini.
        </p>
      )}

      <h2>Keterbatasan</h2>
      {item.faers ? (
        <p>{item.faers.honestyNote}</p>
      ) : (
        <p>
          Keterbatasan untuk item ini belum ditulis terpisah dari deskripsi
          di atas di sumber yang terverifikasi. Bagian ini sengaja dibiarkan
          tanpa klaim tambahan sampai catatan itu tersedia.
        </p>
      )}

      <h2>Tautan</h2>
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
          Tautan keluar belum tercatat untuk item ini di sumber yang
          terverifikasi.
        </p>
      )}
    </main>
  );
}
