// FAERS hero collage card: presentational only, no props, no data imports.
// Shows only the verified cohort sizes. Never add effect values, confidence
// intervals, p-values, drug-outcome pairs with numbers, journals, or DOIs here.
export default function FaersCard() {
  return (
    <>
      <style>{`
        .faers-card {
          background: #FFFFFF;
          border: 1px solid #E0E0E0;
          border-radius: 10px;
          box-shadow: 0 8px 24px rgba(1, 1, 1, 0.08);
          box-sizing: border-box;
          padding: 16px 18px 14px;
          width: 240px;
          color: #010101;
        }
        .faers-card-label {
          font-family: 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace;
          font-size: 10px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #98989C;
          margin: 0 0 10px;
        }
        .faers-card-label span {
          color: #0859D4;
        }
        .faers-card-figure {
          font-family: 'Inter Display', Inter, Arial, sans-serif;
          font-size: 40px;
          font-weight: 700;
          line-height: 1;
          letter-spacing: -0.02em;
          margin: 0 0 12px;
        }
        .faers-card-flow {
          font-family: 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace;
          font-size: 11px;
          line-height: 1.5;
          color: #4A4A4A;
          margin: 0 0 8px;
        }
        .faers-card-flow b {
          color: #010101;
          font-weight: 700;
        }
        .faers-card-flow i {
          font-style: normal;
          color: #0859D4;
          padding: 0 4px;
        }
        .faers-card-note {
          font-family: 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace;
          font-size: 10px;
          letter-spacing: 0.04em;
          color: #98989C;
          margin: 0;
          border-top: 1px dashed #E0E0E0;
          padding-top: 8px;
        }
      `}</style>
      <div className="faers-card" aria-label="FAERS resistant hypertension study cohort size">
        <p className="faers-card-label">
          <span>FAERS</span> &middot; Resistant Hypertension
        </p>
        <p className="faers-card-figure">N = 6,601</p>
        <p className="faers-card-flow">
          <b>7,519</b> reports <i>&rarr;</i> <b>6,601</b> analysis set
        </p>
        <p className="faers-card-note">Hypothesis-generating</p>
      </div>
    </>
  );
}
