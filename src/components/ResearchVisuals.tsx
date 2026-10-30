/**
 * ResearchVisuals: native SVG visuals for the five new 2026 research
 * detail pages. No chart library, no gradients, square corners.
 * Palette matches the site tokens: ink, graphite, paper, off-white,
 * light grey, hairline, muted, margin grey, and blue #0859D4 for small
 * accents only. Each visual renders a desktop SVG and a stacked mobile
 * SVG, swapped by a max-width 720px media rule (same pattern as the
 * Works section styles). Every value below is taken from the paper
 * itself; nothing is invented, and the captions carry the honesty
 * caveats. Labels are English throughout.
 */

import React from "react";

const INK = "#010101";
const PAPER = "#FFFFFF";
const OFFWHITE = "#FAFAFA";
const LIGHTGREY = "#F5F5F7";
const HAIRLINE = "#E0E0E0";
const MUTED = "#98989C";
const MARGIN_GREY = "#666666";
const BLUE = "#0859D4";
const BAR_GREY = "#E0E0E0";

const DISPLAY = "'Inter', -apple-system, 'Segoe UI', Roboto, sans-serif";
const MONO = "'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace";

const SWAP_CSS = `
  .rv-wrap svg { display: block; width: 100%; height: auto; }
  .rv-m { display: none; }
  @media (max-width: 720px) {
    .rv-d { display: none; }
    .rv-m { display: block; }
  }
`;

function Caption({ children }: { children: React.ReactNode }) {
  return (
    <p
      style={{
        fontFamily: MONO,
        fontSize: 12,
        lineHeight: 1.7,
        color: MARGIN_GREY,
        margin: "12px 0 0",
      }}
    >
      {children}
    </p>
  );
}

function Shell({
  label,
  children,
  caption,
}: {
  label: string;
  children: React.ReactNode;
  caption: React.ReactNode;
}) {
  return (
    <div className="rv-wrap" style={{ margin: "24px 0" }}>
      <style>{SWAP_CSS}</style>
      <div role="img" aria-label={label}>
        {children}
      </div>
      <Caption>{caption}</Caption>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* BPA forest plot                                                    */
/* ------------------------------------------------------------------ */

type BpaRow = {
  label: string;
  point: number;
  lo: number;
  hi: number;
  counts: string;
  hetero: string;
};

const BPA_ROWS: BpaRow[] = [
  { label: "PCOS", point: 1.19, lo: 0.7, hi: 1.67, counts: "625 cases / 745 controls", hetero: "I-squared 93%" },
  { label: "Benign endometrial disorders", point: 0.94, lo: 0.15, hi: 1.73, counts: "318 cases / 451 controls", hetero: "I-squared 95%" },
  { label: "Breast cancer", point: 0.68, lo: 0.44, hi: 0.92, counts: "585 cases / 512 controls", hetero: "I-squared 58%" },
  { label: "Hormone-related malignancies overall", point: 0.37, lo: 0.05, hi: 0.7, counts: "810 cases / 705 controls", hetero: "I-squared 84%" },
  { label: "Endometrial cancer", point: -0.28, lo: -1.15, hi: 0.59, counts: "counts not reported", hetero: "I-squared 89%" },
];

function bpaX(v: number): number {
  return 320 + (v + 1.5) * 160;
}

function BpaVisual() {
  const rowY = [70, 150, 230, 310, 390];
  const flowBoxes = [
    { n: "1095", label: "records identified" },
    { n: "52", label: "eligible after full-text review" },
    { n: "44", label: "in qualitative synthesis" },
    { n: "22", label: "in meta-analysis" },
  ];
  const mobileRowTop = [30, 220, 410, 600, 790];
  const mobileX = (v: number) => 20 + (v + 1.5) * 194.2857;
  const flowTop = [980, 1080, 1180, 1280];
  return (
    <Shell
      label="Forest plot of pooled standardized mean differences for BPA exposure by outcome, with a screening flow strip."
      caption="Association, not proof of causation. Heterogeneity was considerable."
    >
      <svg className="rv-d" viewBox="0 0 1160 640" role="presentation">
        {[-1, 0, 1, 2].map((g) => (
          <g key={g}>
            <line x1={bpaX(g)} y1={36} x2={bpaX(g)} y2={420} stroke={HAIRLINE} strokeWidth={1} />
            <text x={bpaX(g)} y={24} textAnchor="middle" fontFamily={MONO} fontSize={11} fill={MUTED}>
              {g}
            </text>
          </g>
        ))}
        <line x1={bpaX(0)} y1={36} x2={bpaX(0)} y2={420} stroke={INK} strokeWidth={2} />
        {BPA_ROWS.map((row, i) => (
          <g key={row.label}>
            <text x={8} y={rowY[i] + 5} fontFamily={DISPLAY} fontSize={14} fontWeight={600} fill={INK}>
              {row.label}
            </text>
            <line x1={bpaX(row.lo)} y1={rowY[i]} x2={bpaX(row.hi)} y2={rowY[i]} stroke={INK} strokeWidth={1.5} />
            <line x1={bpaX(row.lo)} y1={rowY[i] - 4} x2={bpaX(row.lo)} y2={rowY[i] + 4} stroke={INK} strokeWidth={1.5} />
            <line x1={bpaX(row.hi)} y1={rowY[i] - 4} x2={bpaX(row.hi)} y2={rowY[i] + 4} stroke={INK} strokeWidth={1.5} />
            <rect x={bpaX(row.point) - 5} y={rowY[i] - 5} width={10} height={10} fill={BLUE} />
            <text x={900} y={rowY[i] - 14} fontFamily={MONO} fontSize={13} fill={INK}>
              {row.point.toFixed(2)} ({row.lo.toFixed(2)} to {row.hi.toFixed(2)})
            </text>
            <text x={900} y={rowY[i] + 4} fontFamily={MONO} fontSize={12} fill={MARGIN_GREY}>
              {row.counts}
            </text>
            <text x={900} y={rowY[i] + 22} fontFamily={MONO} fontSize={12} fill={MARGIN_GREY}>
              {row.hetero}
            </text>
          </g>
        ))}
        {flowBoxes.map((box, i) => (
          <g key={box.n}>
            <rect x={8 + i * 290} y={470} width={274} height={80} fill={OFFWHITE} stroke={HAIRLINE} />
            <text x={24 + i * 290} y={502} fontFamily={DISPLAY} fontSize={20} fontWeight={800} fill={INK}>
              {box.n}
            </text>
            <text x={24 + i * 290} y={526} fontFamily={MONO} fontSize={11} fill={MARGIN_GREY}>
              {box.label}
            </text>
            {i < 3 && (
              <text x={286 + i * 290} y={515} fontFamily={MONO} fontSize={16} fill={MUTED}>
                &gt;
              </text>
            )}
          </g>
        ))}
      </svg>
      <svg className="rv-m" viewBox="0 0 720 1400" role="presentation">
        {[-1, 0, 1, 2].map((g) => (
          <text key={g} x={mobileX(g)} y={20} textAnchor="middle" fontFamily={MONO} fontSize={20} fill={MUTED}>
            {g}
          </text>
        ))}
        {BPA_ROWS.map((row, i) => {
          const top = mobileRowTop[i];
          return (
            <g key={row.label}>
              <text x={20} y={top + 24} fontFamily={DISPLAY} fontSize={20} fontWeight={600} fill={INK}>
                {row.label}
              </text>
              {[-1, 0, 1, 2].map((g) => (
                <line key={g} x1={mobileX(g)} y1={top + 50} x2={mobileX(g)} y2={top + 100} stroke={g === 0 ? INK : HAIRLINE} strokeWidth={g === 0 ? 2 : 1} />
              ))}
              <line x1={mobileX(row.lo)} y1={top + 75} x2={mobileX(row.hi)} y2={top + 75} stroke={INK} strokeWidth={1.5} />
              <line x1={mobileX(row.lo)} y1={top + 71} x2={mobileX(row.lo)} y2={top + 79} stroke={INK} strokeWidth={1.5} />
              <line x1={mobileX(row.hi)} y1={top + 71} x2={mobileX(row.hi)} y2={top + 79} stroke={INK} strokeWidth={1.5} />
              <rect x={mobileX(row.point) - 5} y={top + 70} width={10} height={10} fill={BLUE} />
              <text x={20} y={top + 128} fontFamily={MONO} fontSize={20} fill={MARGIN_GREY}>
                {row.point.toFixed(2)} ({row.lo.toFixed(2)} to {row.hi.toFixed(2)}) | {row.counts}
              </text>
              <text x={20} y={top + 156} fontFamily={MONO} fontSize={20} fill={MARGIN_GREY}>
                {row.hetero}
              </text>
            </g>
          );
        })}
        {flowBoxes.map((box, i) => (
          <g key={box.n}>
            <rect x={20} y={flowTop[i]} width={680} height={80} fill={OFFWHITE} stroke={HAIRLINE} />
            <text x={40} y={flowTop[i] + 32} fontFamily={DISPLAY} fontSize={20} fontWeight={800} fill={INK}>
              {box.n}
            </text>
            <text x={40} y={flowTop[i] + 60} fontFamily={MONO} fontSize={20} fill={MARGIN_GREY}>
              {box.label}
            </text>
            {i < 3 && (
              <text x={360} y={flowTop[i] + 98} textAnchor="middle" fontFamily={MONO} fontSize={20} fill={MUTED}>
                v
              </text>
            )}
          </g>
        ))}
      </svg>
    </Shell>
  );
}

/* ------------------------------------------------------------------ */
/* Amomum compound to target network                                  */
/* ------------------------------------------------------------------ */

const AMOMUM_LEADS = [
  "C17 to TNF-alpha -6.91 (control -7.00)",
  "C17 to Casp3 -6.70 (control -6.53)",
  "C20 to SRC -8.58 (control quinazoline -7.89)",
  "C20 to EGFR -6.43 (control erlotinib -6.47)",
];

function AmomumVisual() {
  const hubs = [
    { name: "TNF", centrality: "28.35", x: 800, y: 120 },
    { name: "SRC", centrality: "27.13", x: 950, y: 120 },
    { name: "EGFR", centrality: "4.39", x: 800, y: 290 },
    { name: "CASP3", centrality: "2.87", x: 950, y: 290 },
  ];
  const mobileHubs = [
    { name: "TNF", centrality: "28.35", x: 20, y: 450 },
    { name: "SRC", centrality: "27.13", x: 370, y: 450 },
    { name: "EGFR", centrality: "4.39", x: 20, y: 560 },
    { name: "CASP3", centrality: "2.87", x: 370, y: 560 },
  ];
  return (
    <Shell
      label="Network diagram from 22 cardamom compounds to 36 shared targets and four hub proteins, with lead compound docking values."
      caption="Computational prediction, not lab results."
    >
      <svg className="rv-d" viewBox="0 0 1160 560" role="presentation">
        <text x={8} y={56} fontFamily={MONO} fontSize={12} fill={MARGIN_GREY}>
          22 compounds (C1 to C22)
        </text>
        <text x={8} y={74} fontFamily={MONO} fontSize={12} fill={MARGIN_GREY}>
          LC-MS identified
        </text>
        {Array.from({ length: 22 }, (_, i) => (
          <circle
            key={i}
            cx={24 + (i % 11) * 26}
            cy={i < 11 ? 120 : 160}
            r={8}
            fill={LIGHTGREY}
            stroke={INK}
            strokeWidth={1}
          />
        ))}
        <text x={24} y={198} fontFamily={MONO} fontSize={11} fill={MARGIN_GREY}>
          Lead compounds:
        </text>
        <rect x={24} y={210} width={90} height={34} fill={PAPER} stroke={BLUE} strokeWidth={1.5} />
        <text x={69} y={232} textAnchor="middle" fontFamily={MONO} fontSize={13} fill={INK}>
          C17
        </text>
        <rect x={134} y={210} width={90} height={34} fill={PAPER} stroke={BLUE} strokeWidth={1.5} />
        <text x={179} y={232} textAnchor="middle" fontFamily={MONO} fontSize={13} fill={INK}>
          C20
        </text>
        <line x1={224} y1={227} x2={340} y2={227} stroke={BLUE} strokeWidth={1.5} strokeDasharray="6 4" />
        <text x={340} y={70} fontFamily={MONO} fontSize={12} fill={MARGIN_GREY}>
          36 shared targets
        </text>
        <rect x={340} y={90} width={400} height={280} fill={OFFWHITE} stroke={HAIRLINE} />
        {Array.from({ length: 36 }, (_, i) => (
          <circle
            key={i}
            cx={380 + (i % 6) * 60}
            cy={130 + Math.floor(i / 6) * 40}
            r={5}
            fill={INK}
          />
        ))}
        <line x1={740} y1={185} x2={800} y2={185} stroke={BLUE} strokeWidth={1.5} strokeDasharray="6 4" />
        <line x1={740} y1={185} x2={950} y2={185} stroke={BLUE} strokeWidth={1.5} strokeDasharray="6 4" />
        <line x1={740} y1={355} x2={800} y2={355} stroke={BLUE} strokeWidth={1.5} strokeDasharray="6 4" />
        <line x1={740} y1={355} x2={950} y2={355} stroke={BLUE} strokeWidth={1.5} strokeDasharray="6 4" />
        {hubs.map((hub) => (
          <g key={hub.name}>
            <rect x={hub.x} y={hub.y} width={130} height={130} fill={PAPER} stroke={INK} strokeWidth={1.5} />
            <text x={hub.x + 65} y={hub.y + 58} textAnchor="middle" fontFamily={DISPLAY} fontSize={20} fontWeight={800} fill={INK}>
              {hub.name}
            </text>
            <text x={hub.x + 65} y={hub.y + 84} textAnchor="middle" fontFamily={MONO} fontSize={12} fill={MARGIN_GREY}>
              centrality {hub.centrality}
            </text>
          </g>
        ))}
        <text x={8} y={450} fontFamily={MONO} fontSize={12} fill={BLUE}>
          {AMOMUM_LEADS[0]}
        </text>
        <text x={8} y={478} fontFamily={MONO} fontSize={12} fill={BLUE}>
          {AMOMUM_LEADS[1]}
        </text>
        <text x={580} y={450} fontFamily={MONO} fontSize={12} fill={BLUE}>
          {AMOMUM_LEADS[2]}
        </text>
        <text x={580} y={478} fontFamily={MONO} fontSize={12} fill={BLUE}>
          {AMOMUM_LEADS[3]}
        </text>
      </svg>
      <svg className="rv-m" viewBox="0 0 720 810" role="presentation">
        <text x={20} y={40} fontFamily={MONO} fontSize={20} fill={MARGIN_GREY}>
          22 compounds (C1 to C22), LC-MS identified
        </text>
        {Array.from({ length: 22 }, (_, i) => (
          <circle key={i} cx={30 + i * 30} cy={90} r={8} fill={LIGHTGREY} stroke={INK} strokeWidth={1} />
        ))}
        <text x={20} y={150} fontFamily={MONO} fontSize={20} fill={MARGIN_GREY}>
          36 shared targets
        </text>
        <rect x={20} y={170} width={680} height={240} fill={OFFWHITE} stroke={HAIRLINE} />
        {Array.from({ length: 36 }, (_, i) => (
          <circle key={i} cx={80 + (i % 6) * 110} cy={210 + Math.floor(i / 6) * 38} r={6} fill={INK} />
        ))}
        {mobileHubs.map((hub) => (
          <g key={hub.name}>
            <rect x={hub.x} y={hub.y} width={330} height={90} fill={PAPER} stroke={INK} strokeWidth={1.5} />
            <text x={hub.x + 16} y={hub.y + 38} fontFamily={DISPLAY} fontSize={20} fontWeight={800} fill={INK}>
              {hub.name}
            </text>
            <text x={hub.x + 16} y={hub.y + 66} fontFamily={MONO} fontSize={20} fill={MARGIN_GREY}>
              centrality {hub.centrality}
            </text>
          </g>
        ))}
        {AMOMUM_LEADS.map((lead, i) => (
          <text key={lead} x={20} y={690 + i * 34} fontFamily={MONO} fontSize={20} fill={BLUE}>
            {lead}
          </text>
        ))}
      </svg>
    </Shell>
  );
}

/* ------------------------------------------------------------------ */
/* Lytechinus paired affinity bars                                    */
/* ------------------------------------------------------------------ */

type LytRow = {
  target: string;
  peptide: number;
  reference: number;
  stability: string;
};

const LYT_ROWS: LytRow[] = [
  { target: "FTO", peptide: -8.95, reference: -6.26, stability: "FTO 1.0 to 1.5 A" },
  { target: "HPL", peptide: -7.96, reference: -6.44, stability: "HPL about 2.5 A" },
  { target: "PPARgamma", peptide: -10.09, reference: -9.12, stability: "PPARgamma about 1.5 A" },
  { target: "PTP1B", peptide: -7.84, reference: -6.4, stability: "PTP1B about 1.5 A" },
  { target: "CB1", peptide: -10.72, reference: -10.09, stability: "CB1 about 4.5 A" },
];

function LytechinusVisual() {
  const rowY = [80, 160, 240, 320, 400];
  const scale = 640 / 12;
  const mobileTop = [110, 260, 410, 560, 710];
  const mobileScale = 680 / 12;
  return (
    <Shell
      label="Paired docking affinity bars for peptide 7 against reference inhibitors across five obesity targets, with a dynamics stability strip."
      caption={
        <>
          Peptide 7 was chosen for consistency across all five targets, not
          for the strongest score on each target. Computational prediction
          pending lab validation.
        </>
      }
    >
      <svg className="rv-d" viewBox="0 0 1160 620" role="presentation">
        <text x={8} y={30} fontFamily={MONO} fontSize={11} fill={MARGIN_GREY}>
          kcal/mol, more negative means stronger predicted binding
        </text>
        <rect x={8} y={44} width={14} height={14} fill={BLUE} />
        <text x={30} y={56} fontFamily={MONO} fontSize={12} fill={INK}>
          Peptide 7
        </text>
        <rect x={140} y={44} width={14} height={14} fill={BAR_GREY} />
        <text x={162} y={56} fontFamily={MONO} fontSize={12} fill={INK}>
          Reference inhibitor
        </text>
        {LYT_ROWS.map((row, i) => (
          <g key={row.target}>
            <text x={8} y={rowY[i] + 5} fontFamily={DISPLAY} fontSize={15} fontWeight={600} fill={INK}>
              {row.target}
            </text>
            <rect x={200} y={rowY[i] - 18} width={Math.abs(row.peptide) * scale} height={14} fill={BLUE} />
            <text x={200 + Math.abs(row.peptide) * scale + 8} y={rowY[i] - 7} fontFamily={MONO} fontSize={13} fill={INK}>
              {row.peptide.toFixed(2)}
            </text>
            <rect x={200} y={rowY[i] + 2} width={Math.abs(row.reference) * scale} height={14} fill={BAR_GREY} />
            <text x={200 + Math.abs(row.reference) * scale + 8} y={rowY[i] + 13} fontFamily={MONO} fontSize={13} fill={INK}>
              {row.reference.toFixed(2)}
            </text>
          </g>
        ))}
        {[0, 4, 8, 12].map((t) => (
          <g key={t}>
            <line x1={200 + t * scale} y1={440} x2={200 + t * scale} y2={450} stroke={MUTED} strokeWidth={1} />
            <text x={200 + t * scale} y={468} textAnchor="middle" fontFamily={MONO} fontSize={11} fill={MUTED}>
              -{t}
            </text>
          </g>
        ))}
        {LYT_ROWS.map((row, i) => (
          <g key={row.target}>
            <rect x={8 + i * 232} y={490} width={224} height={80} fill={OFFWHITE} stroke={HAIRLINE} />
            <text x={24 + i * 232} y={520} fontFamily={MONO} fontSize={12} fontWeight={700} fill={INK}>
              {row.target}
            </text>
            <text x={24 + i * 232} y={544} fontFamily={MONO} fontSize={12} fill={MARGIN_GREY}>
              {row.stability.replace(row.target + " ", "")}
            </text>
          </g>
        ))}
        <text x={8} y={482} fontFamily={MONO} fontSize={11} fill={MARGIN_GREY}>
          50 ns dynamics, C-alpha RMSD
        </text>
      </svg>
      <svg className="rv-m" viewBox="0 0 720 1140" role="presentation">
        <text x={20} y={20} fontFamily={MONO} fontSize={20} fill={MARGIN_GREY}>
          kcal/mol, more negative means stronger predicted binding
        </text>
        <rect x={20} y={38} width={16} height={16} fill={BLUE} />
        <text x={44} y={52} fontFamily={MONO} fontSize={20} fill={INK}>
          Peptide 7
        </text>
        <rect x={220} y={38} width={16} height={16} fill={BAR_GREY} />
        <text x={244} y={52} fontFamily={MONO} fontSize={20} fill={INK}>
          Reference inhibitor
        </text>
        {LYT_ROWS.map((row, i) => {
          const top = mobileTop[i];
          return (
            <g key={row.target}>
              <text x={20} y={top + 22} fontFamily={DISPLAY} fontSize={20} fontWeight={600} fill={INK}>
                {row.target}
              </text>
              <rect x={20} y={top + 36} width={Math.abs(row.peptide) * mobileScale} height={16} fill={BLUE} />
              <text x={20 + Math.abs(row.peptide) * mobileScale + 8} y={top + 50} fontFamily={MONO} fontSize={20} fill={INK}>
                {row.peptide.toFixed(2)}
              </text>
              <rect x={20} y={top + 60} width={Math.abs(row.reference) * mobileScale} height={16} fill={BAR_GREY} />
              <text x={20 + Math.abs(row.reference) * mobileScale + 8} y={top + 74} fontFamily={MONO} fontSize={20} fill={INK}>
                {row.reference.toFixed(2)}
              </text>
            </g>
          );
        })}
        <text x={20} y={880} fontFamily={MONO} fontSize={20} fill={MARGIN_GREY}>
          50 ns dynamics, C-alpha RMSD
        </text>
        {LYT_ROWS.map((row, i) => (
          <text key={row.target} x={20} y={910 + i * 40} fontFamily={MONO} fontSize={20} fill={MARGIN_GREY}>
            {row.stability}
          </text>
        ))}
      </svg>
    </Shell>
  );
}

/* ------------------------------------------------------------------ */
/* miRNA test performance                                             */
/* ------------------------------------------------------------------ */

function MirnaVisual() {
  const pairs = [
    { label: "Panel", sens: 0.9, spec: 0.93, x: 8 },
    { label: "Single miRNA", sens: 0.85, spec: 0.75, x: 600 },
    { label: "Serum", sens: 0.91, spec: 0.92, x: 8 },
    { label: "Plasma", sens: 0.71, spec: 0.81, x: 600 },
  ];
  const mobilePairs = [
    { label: "Panel", sens: 0.9, spec: 0.93 },
    { label: "Single miRNA", sens: 0.85, spec: 0.75 },
    { label: "Serum", sens: 0.91, spec: 0.92 },
    { label: "Plasma", sens: 0.71, spec: 0.81 },
  ];
  return (
    <Shell
      label="Summary of miRNA diagnostic performance: sensitivity, specificity, AUC, and subgroup comparisons."
      caption="12 articles, 52 studies, 1098 cases, 957 controls. I-squared about 77 to 82%."
    >
      <svg className="rv-d" viewBox="0 0 1160 560" role="presentation">
        <text x={8} y={108} fontFamily={DISPLAY} fontSize={18} fontWeight={600} fill={INK}>
          Sensitivity
        </text>
        <rect x={200} y={80} width={0.86 * 660} height={40} fill={INK} />
        <text x={200 + 0.86 * 660 + 16} y={110} fontFamily={DISPLAY} fontSize={36} fontWeight={800} fill={BLUE}>
          0.86
        </text>
        <text x={8} y={208} fontFamily={DISPLAY} fontSize={18} fontWeight={600} fill={INK}>
          Specificity
        </text>
        <rect x={200} y={180} width={0.81 * 660} height={40} fill={INK} />
        <text x={200 + 0.81 * 660 + 16} y={210} fontFamily={DISPLAY} fontSize={36} fontWeight={800} fill={BLUE}>
          0.81
        </text>
        <rect x={980} y={80} width={140} height={140} fill={PAPER} stroke={INK} strokeWidth={2} />
        <text x={1050} y={122} textAnchor="middle" fontFamily={MONO} fontSize={12} fill={MARGIN_GREY}>
          AUC
        </text>
        <text x={1050} y={178} textAnchor="middle" fontFamily={DISPLAY} fontSize={40} fontWeight={800} fill={BLUE}>
          0.91
        </text>
        <text x={8} y={270} fontFamily={MONO} fontSize={11} fill={MARGIN_GREY}>
          First value sensitivity, second specificity.
        </text>
        {pairs.map((pair, i) => {
          const top = i < 2 ? 300 : 400;
          return (
            <g key={pair.label}>
              <text x={pair.x} y={top} fontFamily={MONO} fontSize={12} fontWeight={700} fill={INK}>
                {pair.label} {pair.sens.toFixed(2)} / {pair.spec.toFixed(2)}
              </text>
              <rect x={pair.x} y={top + 12} width={pair.sens * 300} height={10} fill={INK} />
              <rect x={pair.x} y={top + 28} width={pair.spec * 300} height={10} fill={BLUE} />
            </g>
          );
        })}
        <text x={8} y={510} fontFamily={MONO} fontSize={12} fill={MARGIN_GREY}>
          12 articles, 52 studies, 1098 cases, 957 controls. I-squared about 77 to 82%.
        </text>
        <text x={8} y={544} fontFamily={DISPLAY} fontSize={17} fontWeight={800} fill={INK}>
          Not yet a biopsy replacement.
        </text>
      </svg>
      <svg className="rv-m" viewBox="0 0 720 860" role="presentation">
        <text x={20} y={40} fontFamily={DISPLAY} fontSize={18} fontWeight={600} fill={INK}>
          Sensitivity
        </text>
        <rect x={20} y={55} width={0.86 * 680} height={36} fill={INK} />
        <text x={20 + 0.86 * 680 + 12} y={84} fontFamily={DISPLAY} fontSize={30} fontWeight={800} fill={BLUE}>
          0.86
        </text>
        <text x={20} y={130} fontFamily={DISPLAY} fontSize={18} fontWeight={600} fill={INK}>
          Specificity
        </text>
        <rect x={20} y={145} width={0.81 * 680} height={36} fill={INK} />
        <text x={20 + 0.81 * 680 + 12} y={174} fontFamily={DISPLAY} fontSize={30} fontWeight={800} fill={BLUE}>
          0.81
        </text>
        <rect x={290} y={210} width={140} height={120} fill={PAPER} stroke={INK} strokeWidth={2} />
        <text x={360} y={250} textAnchor="middle" fontFamily={MONO} fontSize={20} fill={MARGIN_GREY}>
          AUC
        </text>
        <text x={360} y={302} textAnchor="middle" fontFamily={DISPLAY} fontSize={40} fontWeight={800} fill={BLUE}>
          0.91
        </text>
        <text x={20} y={360} fontFamily={MONO} fontSize={20} fill={MARGIN_GREY}>
          First value sensitivity, second specificity.
        </text>
        {mobilePairs.map((pair, i) => {
          const top = 390 + i * 90;
          return (
            <g key={pair.label}>
              <text x={20} y={top} fontFamily={MONO} fontSize={20} fontWeight={700} fill={INK}>
                {pair.label} {pair.sens.toFixed(2)} / {pair.spec.toFixed(2)}
              </text>
              <rect x={20} y={top + 12} width={pair.sens * 400} height={10} fill={INK} />
              <rect x={20} y={top + 28} width={pair.spec * 400} height={10} fill={BLUE} />
            </g>
          );
        })}
        <text x={20} y={772} fontFamily={MONO} fontSize={20} fill={MARGIN_GREY}>
          12 articles, 52 studies, 1098 cases, 957 controls.
        </text>
        <text x={20} y={800} fontFamily={MONO} fontSize={20} fill={MARGIN_GREY}>
          I-squared about 77 to 82%.
        </text>
        <text x={20} y={836} fontFamily={DISPLAY} fontSize={17} fontWeight={800} fill={INK}>
          Not yet a biopsy replacement.
        </text>
      </svg>
    </Shell>
  );
}

/* ------------------------------------------------------------------ */
/* Echinometra hub and spoke                                          */
/* ------------------------------------------------------------------ */

function EchinometraVisual() {
  const cards = [
    { name: "EGFR", value: "-10.17 kcal/mol", stab1: "mean RMSD 2.11 A", stab2: "most stable group", x: 8, y: 20 },
    { name: "BRAF V600E", value: "-10.60 kcal/mol", stab1: "mean RMSD 3.17 A", stab2: "least stable", x: 912, y: 20 },
    { name: "VEGFR2", value: "-10.33 kcal/mol", stab1: "mean RMSD 1.88 A", stab2: "most stable", x: 8, y: 440 },
    { name: "AKT1", value: "-11.79 kcal/mol", stab1: "mean RMSD 2.99 A", stab2: "", x: 912, y: 440 },
  ];
  const spokes = [
    { x1: 480, y1: 300, x2: 248, y2: 85, dx: 248, dy: 85 },
    { x1: 680, y1: 300, x2: 912, y2: 85, dx: 912, dy: 85 },
    { x1: 480, y1: 300, x2: 248, y2: 505, dx: 248, dy: 505 },
    { x1: 680, y1: 300, x2: 912, y2: 505, dx: 912, dy: 505 },
  ];
  const mobileCards = [
    { name: "EGFR", value: "-10.17 kcal/mol", stab1: "mean RMSD 2.11 A,", stab2: "most stable group", x: 20, y: 220 },
    { name: "BRAF V600E", value: "-10.60 kcal/mol", stab1: "mean RMSD 3.17 A,", stab2: "least stable", x: 370, y: 220 },
    { name: "VEGFR2", value: "-10.33 kcal/mol", stab1: "mean RMSD 1.88 A,", stab2: "most stable", x: 20, y: 380 },
    { name: "AKT1", value: "-11.79 kcal/mol", stab1: "mean RMSD 2.99 A", stab2: "", x: 370, y: 380 },
  ];
  return (
    <Shell
      label="Hub and spoke diagram of peptide A against four lung cancer targets, with docking values and dynamics stability."
      caption="13 peptides tested, all predicted non-toxic, 50 ns simulation, in silico only, lab validation still needed."
    >
      <svg className="rv-d" viewBox="0 0 1160 620" role="presentation">
        {spokes.map((s, i) => (
          <g key={i}>
            <line x1={s.x1} y1={s.y1} x2={s.x2} y2={s.y2} stroke={HAIRLINE} strokeWidth={1.5} strokeDasharray="6 4" />
            <circle cx={s.dx} cy={s.dy} r={4} fill={BLUE} />
          </g>
        ))}
        {cards.map((card) => (
          <g key={card.name}>
            <rect x={card.x} y={card.y} width={240} height={130} fill={PAPER} stroke={INK} strokeWidth={1.5} />
            <text x={card.x + 16} y={card.y + 34} fontFamily={DISPLAY} fontSize={18} fontWeight={800} fill={INK}>
              {card.name}
            </text>
            <text x={card.x + 16} y={card.y + 64} fontFamily={MONO} fontSize={15} fill={BLUE}>
              {card.value}
            </text>
            <text x={card.x + 16} y={card.y + 90} fontFamily={MONO} fontSize={12} fill={MARGIN_GREY}>
              {card.stab1}
            </text>
            {card.stab2 && (
              <text x={card.x + 16} y={card.y + 108} fontFamily={MONO} fontSize={12} fill={MARGIN_GREY}>
                {card.stab2}
              </text>
            )}
          </g>
        ))}
        <rect x={480} y={200} width={200} height={200} fill={PAPER} stroke={INK} strokeWidth={2} />
        <text x={580} y={285} textAnchor="middle" fontFamily={DISPLAY} fontSize={24} fontWeight={800} fill={INK}>
          Peptide A
        </text>
        <text x={580} y={315} textAnchor="middle" fontFamily={MONO} fontSize={14} fill={MARGIN_GREY}>
          FLMLVDGHN
        </text>
        <rect x={8} y={580} width={1144} height={38} fill={LIGHTGREY} />
        <text x={580} y={603} textAnchor="middle" fontFamily={MONO} fontSize={12} fill={INK}>
          13 peptides tested, all predicted non-toxic, 50 ns simulation, in silico only, lab validation still needed.
        </text>
      </svg>
      <svg className="rv-m" viewBox="0 0 720 640" role="presentation">
        <rect x={260} y={20} width={200} height={160} fill={PAPER} stroke={INK} strokeWidth={2} />
        <text x={360} y={95} textAnchor="middle" fontFamily={DISPLAY} fontSize={24} fontWeight={800} fill={INK}>
          Peptide A
        </text>
        <text x={360} y={125} textAnchor="middle" fontFamily={MONO} fontSize={20} fill={MARGIN_GREY}>
          FLMLVDGHN
        </text>
        <line x1={185} y1={180} x2={185} y2={220} stroke={HAIRLINE} strokeWidth={1.5} strokeDasharray="6 4" />
        <line x1={535} y1={180} x2={535} y2={220} stroke={HAIRLINE} strokeWidth={1.5} strokeDasharray="6 4" />
        {mobileCards.map((card) => (
          <g key={card.name}>
            <rect x={card.x} y={card.y} width={330} height={130} fill={PAPER} stroke={INK} strokeWidth={1.5} />
            <text x={card.x + 16} y={card.y + 34} fontFamily={DISPLAY} fontSize={18} fontWeight={800} fill={INK}>
              {card.name}
            </text>
            <text x={card.x + 16} y={card.y + 64} fontFamily={MONO} fontSize={20} fill={BLUE}>
              {card.value}
            </text>
            <text x={card.x + 16} y={card.y + 94} fontFamily={MONO} fontSize={20} fill={MARGIN_GREY}>
              {card.stab1}
            </text>
            {card.stab2 && (
              <text x={card.x + 16} y={card.y + 118} fontFamily={MONO} fontSize={20} fill={MARGIN_GREY}>
                {card.stab2}
              </text>
            )}
          </g>
        ))}
        <rect x={20} y={530} width={680} height={110} fill={LIGHTGREY} />
        <text x={360} y={556} textAnchor="middle" fontFamily={MONO} fontSize={20} fill={INK}>
          13 peptides tested, all predicted non-toxic,
        </text>
        <text x={360} y={584} textAnchor="middle" fontFamily={MONO} fontSize={20} fill={INK}>
          50 ns simulation, in silico only,
        </text>
        <text x={360} y={612} textAnchor="middle" fontFamily={MONO} fontSize={20} fill={INK}>
          lab validation still needed.
        </text>
      </svg>
    </Shell>
  );
}

/* ------------------------------------------------------------------ */
/* Dispatcher                                                           */
/* ------------------------------------------------------------------ */

export type ResearchVisualKind = "bpa" | "echinometra" | "amomum" | "lytechinus" | "mirna";

export default function ResearchVisual({ kind }: { kind: ResearchVisualKind }) {
  switch (kind) {
    case "bpa":
      return <BpaVisual />;
    case "echinometra":
      return <EchinometraVisual />;
    case "amomum":
      return <AmomumVisual />;
    case "lytechinus":
      return <LytechinusVisual />;
    case "mirna":
      return <MirnaVisual />;
  }
}
