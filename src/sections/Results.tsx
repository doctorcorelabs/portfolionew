/**
 * Results section: the FAERS resistant hypertension study.
 *
 * Data logic, fail closed per row (2026-10-24 integration fix):
 * - The section reads src/data/faers-plot.json, which contains ONLY the
 *   verified rows. The full verification record (including the unverified
 *   rows) lives in docs/faers-verified.json and is never imported, so
 *   unverified values cannot leak into the shipped bundle.
 *   status is "unverified" because 2 of 5 rows are unverified, so an
 *   all-or-nothing gate would hide the 3 verified rows too.
 * - Instead each row is gated on its own: status must be "verified", and
 *   it must carry a drug name, an outcome name, a finite ROR, and a finite
 *   95 percent CI with 0 < ciLow <= ror <= ciHigh. Unverified rows are
 *   never rendered as plot points, table rows, or prose values.
 * - Event-case counts are null for every row (manuscript Table 2 is not in
 *   the goal folder), so markers are uniform and the table shows cases as
 *   "not verified". The 2 withheld rows are named in prose (without their
 *   values plotted) so the reader knows the plot is partial.
 */
import ForestPlot, { type ForestRow } from "../components/ForestPlot";

const INK = "#0A0A0A";
const GRAPHITE = "#3C3C38";
const MARGIN_GREY = "#6F6F68";
const HAIRLINE = "#D8D8D0";
const ARCHIVE = "#F2F2EF";
const RED = "#C8102E";

const DISPLAY =
  "Archivo, Inter, -apple-system, 'Segoe UI', Roboto, sans-serif";
const MONO =
  "'IBM Plex Mono', ui-monospace, SFMono-Regular, Menlo, monospace";

const STUDY_TITLE =
  "Comparative Safety of Next-Generation Non-Steroidal MRA (Finerenone), ARNI (Sacubitril/Valsartan), and Sentinel Dual ERA (Aprocitentan) Versus Conventional Regimens in Resistant Hypertension: A Disproportionality and Time-to-Onset Analysis from FDA FAERS";

type VerifiedData = {
  source: string;
  verifiedDate?: string;
  rows: ForestRow[];
  withheld: number;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function slug(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function toValidRow(value: unknown): ForestRow | null {
  if (!isRecord(value)) return null;
  const { status, drug, outcome, ror, ciLow, ciHigh, cases } = value;
  if (status !== "verified") return null;
  if (typeof drug !== "string" || drug.length === 0) return null;
  if (typeof outcome !== "string" || outcome.length === 0) return null;
  if (typeof ror !== "number" || !Number.isFinite(ror)) return null;
  if (typeof ciLow !== "number" || !Number.isFinite(ciLow)) return null;
  if (typeof ciHigh !== "number" || !Number.isFinite(ciHigh)) return null;
  if (!(ciLow > 0 && ciLow <= ror && ror <= ciHigh)) return null;
  return {
    id: slug(`${drug}-${outcome}`),
    drug,
    event: outcome,
    ror,
    ciLow,
    ciHigh,
    cases: typeof cases === "number" && Number.isFinite(cases) ? cases : null,
    featured: drug === "Aprocitentan",
    note:
      drug === "Aprocitentan"
        ? "Sentinel, exploratory (cohort n = 17)."
        : "",
  };
}

function loadVerifiedData(): VerifiedData | null {
  const modules = import.meta.glob("../data/faers-plot.json", {
    eager: true,
  }) as Record<string, { default?: unknown }>;
  const raw = Object.values(modules)[0]?.default;
  if (!isRecord(raw)) return null;
  if (!Array.isArray(raw.rows) || raw.rows.length === 0) return null;
  const rows: ForestRow[] = [];
  for (const row of raw.rows) {
    const valid = toValidRow(row);
    if (valid) rows.push(valid);
  }
  const withheld = Array.isArray(raw.withheld) ? raw.withheld.length : 0;
  if (rows.length === 0) return null;
  const verifiedDate =
    typeof raw.verifiedDate === "string" ? raw.verifiedDate : undefined;
  return {
    source:
      "Poster ABST-000034 final (v3), cross-checked with the abstract and the 7-minute presentation script",
    verifiedDate,
    rows,
    withheld,
  };
}

const METHOD_TEXT =
  "FAERS is a spontaneous reporting database. A disproportionality analysis compares how often a drug and event pair is reported against a comparator, and the reporting odds ratio (ROR) summarises that reporting imbalance. An ROR measures disproportionality of reporting, not clinical risk and not causality, and FAERS results are hypothesis generating: they point to signals worth studying further, they do not prove that a drug caused an event.";

export default function Results() {
  const verified = loadVerifiedData();

  return (
    <section
      aria-labelledby="results-heading"
      style={{
        background: "#FFFFFF",
        color: INK,
        fontFamily: DISPLAY,
        padding: "72px 24px",
      }}
    >
      <div style={{ maxWidth: 960, margin: "0 auto" }}>
        <p
          style={{
            fontFamily: MONO,
            fontSize: 12,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: MARGIN_GREY,
            margin: "0 0 16px",
          }}
        >
          Results
        </p>
        <h2
          id="results-heading"
          style={{
            fontSize: "clamp(40px, 7vw, 84px)",
            lineHeight: 0.95,
            letterSpacing: "-0.03em",
            fontWeight: 900,
            margin: "0 0 24px",
          }}
        >
          Results.
        </h2>

        <p
          style={{
            fontSize: 18,
            lineHeight: 1.65,
            color: GRAPHITE,
            maxWidth: 640,
            margin: "0 0 40px",
          }}
        >
          {STUDY_TITLE}. Poster ABST-000034, Hypertension Seoul 2026.
        </p>

        <div
          style={{
            borderTop: `1px solid ${HAIRLINE}`,
            borderBottom: `1px solid ${HAIRLINE}`,
            padding: "24px 0",
            marginBottom: 40,
            display: "flex",
            flexWrap: "wrap",
            gap: "32px 64px",
            alignItems: "baseline",
          }}
        >
          <div>
            <p
              style={{
                fontSize: "clamp(56px, 10vw, 96px)",
                lineHeight: 1,
                fontWeight: 900,
                letterSpacing: "-0.03em",
                margin: 0,
              }}
            >
              6,601
            </p>
            <p
              style={{
                fontFamily: MONO,
                fontSize: 12,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: MARGIN_GREY,
                margin: "8px 0 0",
              }}
            >
              FAERS reports analysed
            </p>
          </div>
          <p
            style={{
              fontFamily: MONO,
              fontSize: 13,
              lineHeight: 1.7,
              color: GRAPHITE,
              maxWidth: 420,
              margin: 0,
            }}
          >
            [1] Sample size from the audited final poster. Only rows verified against the poster, abstract, and presentation script are plotted below; 2 rows are withheld pending manuscript Table 2.
          </p>
        </div>

        {verified ? (
          <>
            <ForestPlot
              rows={verified.rows}
              studyLabel="FIG. 01 - Forest plot, reporting odds ratios"
            />
            <p
              style={{
                fontFamily: MONO,
                fontSize: 12,
                lineHeight: 1.7,
                color: GRAPHITE,
                margin: "24px 0 0",
              }}
            >
              Source: {verified.source}
              {verified.verifiedDate ? `, verified ${verified.verifiedDate}.` : "."}{" "}
              The dashed line at ROR = 1 is neutral. Points to its right show
              higher reporting disproportionality, points to its left show
              lower. An interval touching the line is not yet convincing.
              {verified.withheld > 0
                ? ` ${verified.withheld} rows are withheld pending manuscript Table 2: finerenone hyperkalemia (published without a CI in the available documents) and sacubitril/valsartan hyperkalemia (poster-only, uncorroborated).`
                : ""}{" "}
              Event-case counts are not verified for any row, so markers are
              uniform and the table shows cases as not verified. Aprocitentan
              is sentinel and exploratory (cohort n = 17). ROR measures
              reporting disproportionality, not clinical risk or causality.
            </p>
          </>
        ) : (
          <div
            style={{
              border: `1px dashed ${HAIRLINE}`,
              background: ARCHIVE,
              padding: "28px 24px",
            }}
          >
            <p
              style={{
                fontFamily: MONO,
                fontSize: 12,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: RED,
                margin: "0 0 12px",
              }}
            >
              Forest plot pending
            </p>
            <p
              style={{
                fontSize: 17,
                lineHeight: 1.65,
                color: INK,
                maxWidth: 640,
                margin: "0 0 12px",
              }}
            >
              Tabel efek lengkap menyusul setelah verifikasi manuskrip.
            </p>
            <p
              style={{
                fontSize: 15,
                lineHeight: 1.65,
                color: GRAPHITE,
                maxWidth: 640,
                margin: 0,
              }}
            >
              Once the manuscript table is verified, this space becomes the
              forest plot: one row per drug and event pair, with the ROR, its
              95 percent confidence interval, and the case count, on a log
              scale with a reference line at 1. No effect value is published
              here before that check, because the recorded ROR values are not
              yet mapped to their drug and event pairs.
            </p>
          </div>
        )}

        <h3
          style={{
            fontSize: 22,
            fontWeight: 800,
            letterSpacing: "-0.02em",
            margin: "48px 0 12px",
          }}
        >
          How to read this study
        </h3>
        <p
          style={{
            fontSize: 17,
            lineHeight: 1.65,
            color: GRAPHITE,
            maxWidth: 680,
            margin: 0,
          }}
        >
          {METHOD_TEXT}
        </p>
      </div>
    </section>
  );
}
