/**
 * transitionSeed.ts - tiny shared store for the Quote to Services
 * transition's narrative seed point.
 *
 * Quote stashes the V6 trail ring's viewport center here when its
 * auto bloom fires (first time progress hits 1.0). The transition
 * zone reads it back and passes it to the canvas as the ink's
 * origin, so the darkness grows from the remembered spot of the
 * ring: same screen position, later moment.
 *
 * Coordinates are viewport CSS px, matching the transition canvas
 * which is exactly viewport-sized. Null until Quote stashes a
 * value; the transition falls back to its art-directed default.
 */

let seedX: number | null = null;
let seedY: number | null = null;

export function setSeed(x: number, y: number): void {
  seedX = x;
  seedY = y;
}

export function getSeed(): { x: number | null; y: number | null } {
  return { x: seedX, y: seedY };
}
