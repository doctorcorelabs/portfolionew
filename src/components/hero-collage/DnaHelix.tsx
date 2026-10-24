/* Decorative DNA double helix for the hero collage. Purely
   presentational: no animation lives here, the integrator owns
   any float. Blue and grey strokes on transparent. */

export default function DnaHelix() {
  return (
    <svg
      viewBox="0 0 80 200"
      style={{ display: "block", width: "100%", height: "auto" }}
      fill="none"
      aria-hidden="true"
    >
      {/* Strand A, blue */}
      <path
        d="M 40 0 C 64 20, 64 40, 40 60 C 16 80, 16 100, 40 120 C 64 140, 64 160, 40 180 C 52 190, 52 195, 40 200"
        stroke="#0859D4"
        strokeWidth="2"
        strokeLinecap="round"
      />
      {/* Strand B, grey, antiphase to strand A */}
      <path
        d="M 40 0 C 16 20, 16 40, 40 60 C 64 80, 64 100, 40 120 C 16 140, 16 160, 40 180 C 28 190, 28 195, 40 200"
        stroke="#98989C"
        strokeWidth="2"
        strokeLinecap="round"
      />
      {/* Rungs where the strands are farthest apart */}
      <line x1="22" y1="30" x2="58" y2="30" stroke="#E0E0E0" strokeWidth="2" strokeLinecap="round" />
      <line x1="22" y1="90" x2="58" y2="90" stroke="#E0E0E0" strokeWidth="2" strokeLinecap="round" />
      <line x1="22" y1="150" x2="58" y2="150" stroke="#E0E0E0" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
