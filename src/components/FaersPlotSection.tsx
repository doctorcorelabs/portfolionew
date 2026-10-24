/**
 * FaersPlotSection: the verified FAERS forest plot for the FAERS detail page.
 *
 * Data logic, fail closed per row:
 * - The ONLY plot data source is src/data/faers-plot.json, loaded through a
 *   build-safe glob. The full verification record in docs/faers-verified.json
 *   is never imported here, so unverified values cannot leak into the
 *   shipped bundle through this component.
 * - Each row is gated on its own: status must be "verified", and it must
 *   carry a drug name, an outcome name, a finite ROR, and a finite 95
 *   percent CI with 0 < ciLow <= ror <= ciHigh. Any row that fails a check
 *   is dropped, never plotted, never tabulated, and never named with a
 *   value in prose.
 * - Event-case counts are null for every verified row (manuscript Table 2
 *   is not in the available documents), so ForestPlot renders uniform
 *   markers and the table shows cases as "not verified".
 * - Withheld rows are named by drug and outcome only, with the reason they
 *   are withheld. Their values are never rendered here.
 * - If no verified row loads (file missing, malformed, or all rows gated
 *   out), the honest "Forest plot pending" panel renders instead of a plot.
 */

import React from "react";
import ForestPlot, { type ForestRow } from "./ForestPlot";

const INK = "#010101";
const GRAPHITE = "#1D1D1F";
const HAIRLINE = "#E0E0E0";
const ARCHIVE = "#F5F5F7";
const ACCENT = "#0859D4";

const DISPLAY =
  "'Inter', -apple-system, 'Segoe UI', Roboto, sans-serif";
const MONO =
  "'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace";

type WithheldRow = {
  drug: string;
  outcome: string;
  reason: string;
};

type PlotData = {
  rows: ForestRow[];
  withheld: WithheldRow[];
  source: string;
  verifiedDate?: string;
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
    cases:
      typeof cases === "number" && Number.isFinite(cases) ? cases : null,
    featured: drug === "Aprocitentan",
    note:
      drug === "Aprocitentan"
        ? "Sentinel, exploratory (cohort n = 17)."
        : "",
  };
}

function toWithheldRow(value: unknown): WithheldRow | null {
  if (!isRecord(value)) return null;
  const { drug, outcome, reason } = value;
  if (typeof drug !== "string" || drug.length === 0) return null;
  if (typeof outcome !== "string" || outcome.length === 0) return null;
  if (typeof reason !== "string" || reason.length === 0) return null;
  return { drug, outcome, reason };
}

function loadPlotData(): PlotData | null {
  const modules = import.meta.glob("../data/faers-plot.json", {
    eager: true,
  }) as Record<string, { default?: unknown }>;
  const raw = Object.values(modules)[0]?.default;
  if (!isRecord(raw)) return null;
  if (!Array.isArray(raw.rows)) return null;
  const rows: ForestRow[] = [];
  for (const row of raw.rows) {
    const valid = toValidRow(row);
    if (valid) rows.push(valid);
  }
  if (rows.length === 0) return null;
  const withheld: WithheldRow[] = [];
  if (Array.isArray(raw.withheld)) {
    for (const row of raw.withheld) {
      const valid = toWithheldRow(row);
      if (valid) withheld.push(valid);
    }
  }
  return {
    rows,
    withheld,
    source:
      typeof raw.source === "string" && raw.source.length > 0
        ? raw.source
        : "Poster ABST-000034 final (v3)",
    verifiedDate:
      typeof raw.verifiedDate === "string" ? raw.verifiedDate : undefined,
  };
}

export default function FaersPlotSection() {
  const data = loadPlotData();
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => {
    const raf = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  if (!data) {
    return (
      <div
        style={{
          border: `1px dashed ${HAIRLINE}`,
          background: ARCHIVE,
          padding: "28px 24px",
          margin: "24px 0",
        }}
      >
        <p
          style={{
            fontFamily: MONO,
            fontSize: 12,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: ACCENT,
            margin: "0 0 12px",
          }}
        >
          Forest plot pending
        </p>
        <p
          style={{
            fontFamily: DISPLAY,
            fontSize: 17,
            lineHeight: 1.65,
            color: INK,
            maxWidth: 640,
            margin: "0 0 12px",
          }}
        >
          Full effect table to follow after manuscript verification.
        </p>
        <p
          style={{
            fontFamily: DISPLAY,
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
          here before that check.
        </p>
      </div>
    );
  }

  return (
    <div
      className={`mv-reveal${mounted ? " is-visible" : ""}`}
      style={{ margin: "24px 0" }}
    >
      <ForestPlot
        rows={data.rows}
        studyLabel="Forest plot - reporting odds ratios"
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
        Source: {data.source}
        {data.verifiedDate ? `, verified ${data.verifiedDate}.` : "."} The
        dashed line at ROR = 1 is neutral. Points to its right show higher
        reporting disproportionality, points to its left show lower. An
        interval touching the line is not yet convincing.
      </p>
      {data.withheld.length > 0 ? (
        <p
          style={{
            fontFamily: MONO,
            fontSize: 12,
            lineHeight: 1.7,
            color: GRAPHITE,
            margin: "12px 0 0",
          }}
        >
          Withheld pending manuscript Table 2, named without values:{" "}
          {data.withheld
            .map((row) => `${row.drug}, ${row.outcome} (${row.reason})`)
            .join("; ")}
        </p>
      ) : null}
      <p
        style={{
          fontFamily: MONO,
          fontSize: 12,
          lineHeight: 1.7,
          color: GRAPHITE,
          margin: "12px 0 0",
        }}
      >
        Event-case counts are not verified for any row, so markers are
        uniform and the table shows cases as not verified. Aprocitentan is
        sentinel and exploratory (cohort n = 17). ROR measures reporting
        disproportionality, not clinical risk or causality. FAERS analysis
        is hypothesis-generating.
      </p>
    </div>
  );
}
