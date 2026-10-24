/**
 * Token dan helper motion canvas DEV-only, gaya v2 Onlines.
 *
 * Token motion: durasi cepat 0.3s (hover), durasi lambat 0.8s
 * (entrance dan reveal), easing cubic-bezier(0.22,1,0.36,1), naik
 * entrance 24px, angkat hover -4px, langkah stagger reveal 0.08s.
 * Warna dan tipografi mengikuti token Onlines yang sama: tinta
 * #010101, aksen biru #0859D4, Inter dan JetBrains Mono.
 *
 * Cara pakai: komponen presentasi di components.tsx menerima prop
 * motion ("entrance" | "hover" | "reveal") dan merender MotionStyle
 * plus class yang sesuai. MotionStyle menyuntikkan keyframes dan
 * class CSS sekali per kartu; tidak ada dependensi animasi baru,
 * tidak ada impor dialkit di sini, dan tidak ada nilai produksi
 * yang berubah. Varian motion di registry memakai nilai bawaan
 * komponen (bukan slider DialKit) supaya motion bisa dibandingkan
 * apa adanya; setelah satu motion terpilih, prop itu yang
 * diteruskan ke wrapper tuning dan dikunci di produksi.
 *
 * Aksesibilitas: prefers-reduced-motion menonaktifkan semua animasi
 * dan transisi motion di sini.
 */

export const MOTION_EASE = "cubic-bezier(0.22,1,0.36,1)";
export const MOTION_FAST = 0.3;
export const MOTION_SLOW = 0.8;
export const MOTION_RISE_PX = 24;
export const MOTION_LIFT_PX = -4;
export const MOTION_STAGGER_STEP = 0.08;

export type MotionKind = "entrance" | "hover" | "reveal";

export function motionClassName(
  motion: MotionKind | undefined,
): string | undefined {
  if (motion === "entrance") return "onlines-motion-entrance";
  if (motion === "hover") return "onlines-motion-hover";
  if (motion === "reveal") return "onlines-motion-reveal";
  return undefined;
}

export function MotionStyle() {
  return (
    <style>{`
      @keyframes onlines-fade-rise {
        from { opacity: 0; transform: translateY(24px); }
        to { opacity: 1; transform: translateY(0); }
      }
      .onlines-motion-entrance {
        animation: onlines-fade-rise 0.8s cubic-bezier(0.22,1,0.36,1) both;
      }
      .onlines-motion-hover {
        transition: transform 0.3s cubic-bezier(0.22,1,0.36,1);
      }
      .onlines-motion-hover:hover {
        transform: translateY(-4px);
      }
      .onlines-motion-reveal > * {
        animation: onlines-fade-rise 0.8s cubic-bezier(0.22,1,0.36,1) both;
      }
      .onlines-motion-reveal > *:nth-child(1) { animation-delay: 0s; }
      .onlines-motion-reveal > *:nth-child(2) { animation-delay: 0.08s; }
      .onlines-motion-reveal > *:nth-child(3) { animation-delay: 0.16s; }
      .onlines-motion-reveal > *:nth-child(4) { animation-delay: 0.24s; }
      .onlines-motion-reveal > *:nth-child(5) { animation-delay: 0.32s; }
      .onlines-motion-reveal > *:nth-child(6) { animation-delay: 0.4s; }
      .onlines-motion-reveal > *:nth-child(7) { animation-delay: 0.48s; }
      .onlines-motion-reveal > *:nth-child(8) { animation-delay: 0.56s; }
      .onlines-motion-reveal > *:nth-child(9) { animation-delay: 0.64s; }
      .onlines-motion-reveal > *:nth-child(10) { animation-delay: 0.72s; }
      .onlines-motion-reveal > *:nth-child(11) { animation-delay: 0.8s; }
      .onlines-motion-reveal > *:nth-child(12) { animation-delay: 0.88s; }
      @media (prefers-reduced-motion: reduce) {
        .onlines-motion-entrance,
        .onlines-motion-hover,
        .onlines-motion-reveal > * {
          animation: none;
          transition: none;
        }
        .onlines-motion-hover:hover {
          transform: none;
        }
      }
    `}</style>
  );
}
