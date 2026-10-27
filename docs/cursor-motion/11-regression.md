# 11 - QA regression: waypoint wander diff

Base HEAD `3ea8892`. Spec: `00-synthesis.md`. Fixer note: `08-fix.md`. Read-only except the build (build output is gitignored, status unchanged after).

## Verdict: SHIP

The diff is exactly what the spec allows: `src/sections/Hero.tsx` loop + chip param tables + comments only. No protected rule changed. One non-blocking debt: 5 stylesheet comments still say "drift-only" / "converge" (table below); all are comment-only, their rules byte-identical. The spec required only the loop header comment update, so this debt does not block ship. A comment-only wording pass is recommended, not required.

## 1. Diff scope

| Check | Result |
|---|---|
| `git status` | Only `M src/sections/Hero.tsx` + untracked `docs/cursor-motion/` |
| `git diff --stat` | 1 file, +363 / -159 (matches fixer note) |
| Other source files | 0 touched, including `src/data/faers-plot.json` |
| Hunk regions (old-file lines) | Header comment 88; chip tables 103-178; new helpers at 339 (+146); wiring deletions 347, 495-542; loops 542-760 (new 679-960) |
| Regions with NO hunks | Chip JSX (~2199 new) and mini chip JSX; all stylesheet rules (companions, H-bands, pills, parallax, gates, card boxes); all other sections |

## 2. Complete change list

| Block | Change |
|---|---|
| Diorama header comment (~84-96) | Drift + converge description replaced by wander description |
| `CURSOR_CHIPS` type + entries | `radius, duration, phase` deleted; `speed` added (FAERS 85, StrokeSense 95, Code for Cure 75, Seoul 2026 105) |
| `TABLET_ANCHORS` type + 12 entries | `radius` deleted; anchors unchanged |
| `MINI_CURSOR_CHIPS` | `radius: 40` override deleted; anchor overrides unchanged, FAERS anchorY pin 0.30 kept |
| Wander helpers (new, module level, 349-485) | `WANDER_INSET`, step/dwell constants, `WanderChipState`, `wanderClamp`, bezier solver, `wanderBounds`, `pickWanderTarget` |
| Band effect (~640-670) | `hoverCapableRef` decl, `hoverMql` wiring, assignment deleted; band/sub-band logic untouched |
| `wordHoveredRef` sync effect | Decl + sync effect deleted |
| Section loop (679-830) + mini loop (834-960) | Rewritten as the spec state machine; anchor math unchanged; drift/converge/scrollPhase deleted |
| heroBand comment (~590-600) | Stale hover-capability sentence removed |

## 3. Chip identity (unchanged)

| Chip | Label | Color | Anchors |
|---|---|---|---|
| 1 | FAERS | #0859D4 | 0.90 / 0.90 |
| 2 | StrokeSense | #177245 | 0.505 / 0.70 |
| 3 | Code for Cure | #A63A2E | 0.30 / 0.695 |
| 4 | Seoul 2026 | #7A5A00 | 0.80 / 0.695 |

Order unchanged (index-based refs safe). TABLET anchor pairs HEAD vs work: identical sorted multiset. MINI overrides verified by read: FAERS (0.26, 0.30 pinned), SS (0.60, 0.34), Seoul anchorX 0.70, CFC base. DOM structure unchanged (no JSX hunks): `span.mv-diorama-chip` + arrow SVG + label pill, `data-chip` hook, z-index 2, pointer-events none.

## 4. Deletions complete

| Symbol | Count in work file | Count repo-wide |
|---|---|---|
| scrollPhase, blends, wordHoveredRef, hoverCapableRef, hoverMql, theta, psi, chip.radius/duration/phase | 0 each | 0 refs to deleted wiring |
| drift / converge mentions | Comments only (see debt table) | n/a |

Kept and still used by JSX: `wordRef` (decl 489, h1 ref 2361) and `wordHovered` state (decl 495, frame/handle classes 2329/2346). The deleted sync effect only fed the removed ref, so no JSX behavior changed. Build passed under tsc, confirming no dangling references.

## 5. Invariants

| Invariant | Result |
|---|---|
| JS-anchor == CSS-base | Anchor math logic identical to HEAD (only change: `chipW0` renamed to `chipW` with offsetWidth read moved to block top, plus an UNCHANGED comment). `chipBaseAnchor`: 0 occurrences in diff. Laptop companions (FAERS 0.85/0.04, SS 0.55, Seoul 0.70) and TABLET_ANCHORS logic preserved, including the 0.5 right-anchor flip. |
| No CSS transition on chip transform | 0 transition lines matching chip/diorama; entrance fade remains opacity-only |
| No React state in loop | 0 setState calls in loop region 679-960; direct `translate()` writes only |
| Reduced-motion guards | Early return kept per fixer note (behavior QA owns the check) |
| Two fixer micro-adaptations | Accepted as spec-intent-preserving: reflection = bounce mirror (not direction-flip recompute); speed computed at pick time (not stored in state, so miniature live scale stays fresh). Neither changes a shipped parameter value. |

## 6. Stale-comment debt (comment-only, rules byte-identical)

| Spot (new-file line) | Stale wording | Rule status |
|---|---|---|
| Touch pill-hide comment ~1207-1214 | "chips must show on touch (drift-only, no converge)" | Rule unchanged, no hunk |
| Tablet diorama hide comment ~1223 | "chips show drift-only once revived" | Rule unchanged, no hunk |
| Cochrane slot comment ~1373 | "FAERS chip drift box" | Rule unchanged, no hunk |
| Review companion comment ~1607 | "drift and converge stay consistent" | Rule unchanged, no hunk |
| Tablet revival comment ~1860 | "loop's converge math stays consistent" | Rule unchanged, no hunk |

These describe behavior that no longer exists and could mislead a future reader, but they change no runtime behavior and the spec mandated only the loop header comment update. Recommendation: integration may fix wording in a comment-only pass + rebuild; not a ship condition.

## 7. Build and hygiene (re-run by this QA)

| Check | Result |
|---|---|
| `npm run build` (tsc + vite) | PASS, vite built in 7.77s, Hero chunk 86.34 kB (matches fixer note) |
| Em dash in diff | 0 |
| En dash in added lines | 0 |
| Dialkit strings in dist | 0 (dialkit / DialRoot / dial-panel) |
| sciencedirect in src | 0 |
| FAERS masked check | NOT run. Basis: diff touches only Hero.tsx loop + param tables + comments; no FAERS data file or value modified (git status proves it). |

## Not covered by this QA (other agents own it)

Motion parameters (speeds, legs, dwell, easing shape, bounds), seams, tab-hidden resume, band-change reset, reduced-motion static positions, and any live render. This report covers diff scope and regression only.
