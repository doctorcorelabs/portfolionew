const INK = "#0A0A0A";
const BAND = "#F2F2EF";
const RED = "#C8102E";
const MARGIN_GREY = "#6F6F68";

const CURVE_PATH =
  "M 0 28 H 140 V 52 H 270 V 82 H 390 V 110 H 510 V 138 H 630 V 166 H 800";

const BAND_PATH =
  "M 0 14 H 140 V 38 H 270 V 68 H 390 V 96 H 510 V 124 H 630 V 152 H 800 " +
  "V 196 H 630 V 180 H 510 V 152 H 390 V 124 H 270 V 96 H 140 V 66 H 0 Z";

function CensorMark({ x, y }: { x: number; y: number }) {
  return (
    <g stroke={INK} strokeWidth="1.6" strokeLinecap="square">
      <line x1={x - 5} y1={y} x2={x + 5} y2={y} />
      <line x1={x} y1={y - 5} x2={x} y2={y + 5} />
    </g>
  );
}

export default function SurvivalCurve() {
  return (
    <svg
      className="survival-curve"
      viewBox="0 0 800 220"
      width="100%"
      role="img"
      aria-label="Decorative stepped survival curve motif"
      preserveAspectRatio="none"
    >
      <style>{`
        .survival-curve .curve-line {
          stroke-dasharray: 1;
          stroke-dashoffset: 1;
          animation: survival-draw 1.2s ease-out forwards;
        }
        @keyframes survival-draw {
          to { stroke-dashoffset: 0; }
        }
        @media (prefers-reduced-motion: reduce) {
          .survival-curve .curve-line {
            animation: none;
            stroke-dashoffset: 0;
          }
        }
      `}</style>
      <path d={BAND_PATH} fill={BAND} stroke="none" />
      <path
        className="curve-line"
        d={CURVE_PATH}
        fill="none"
        stroke={INK}
        strokeWidth="2.5"
        pathLength={1}
      />
      <CensorMark x={70} y={28} />
      <CensorMark x={205} y={52} />
      <CensorMark x={330} y={82} />
      <CensorMark x={450} y={110} />
      <CensorMark x={570} y={138} />
      <CensorMark x={715} y={166} />
      <rect
        x="504"
        y="104"
        width="12"
        height="12"
        fill={RED}
        transform="rotate(45 510 110)"
      />
      <text
        x="0"
        y="214"
        fill={MARGIN_GREY}
        fontFamily="'IBM Plex Mono', 'SFMono-Regular', Menlo, monospace"
        fontSize="12"
        letterSpacing="0.08em"
      >
        FIG. 00
      </text>
    </svg>
  );
}
