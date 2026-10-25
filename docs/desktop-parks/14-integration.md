# 14 - Integration: final gate (desktop-parks round)

Base `15c3ed9` + fixers 1-3 uncommitted. Read 00, 08-13. Read-only except this report; build + greps run by me.

## 1. Diff review: clean, one file

- `git status`: modified `src/sections/Hero.tsx` only; untracked `docs/desktop-parks/` only. Diff: 78 insertions, 44 deletions, 11 hunks.
- No FAERS data file in the diff (no `faers-plot.json`, no `faers-verified.json`, no FAERS detail component). Per the cursor-round precedent, the FAERS masked check is NOT re-run: the diff touches chip anchors only, no FAERS values.
- Hunk purposes, one line each: 104 CURSOR_CHIPS FAERS + SS anchors; 158 MINI header comment (stale 0.45 dropped); 174 MINI FAERS-Y pin; 563 laptopMql comment; 623 loop companions (effAnchorX FAERS 0.85 / SS 0.55, effAnchorY FAERS 0.04, SS branch deleted); 1370/1379 companion comments; 1390 CSS SS right 45%; 1453 CSS FAERS right 15% / top 4%; 1622 H-band comment + H1/H2 deletions; 1659 H5 deletion.
- Nothing else moved: TABLET_ANCHORS values identical (sole line difference in the 133-171 window is the MINI comment); FACT_PILLS values identical; CFC/Seoul chip lines identical (anchors, radii, durations, phases); FAERS/SS durations (12/14), phases (0/0.3), radii (20), labels, and CURSOR_CHIPS order unchanged; no gate, pill, miniature, seam, or reduced-motion rule touched outside the in-scope items.

## 2. Shipped lanes: all match fixer reports, zero mismatches

| Chip | Band | Shipped | Mechanism | Report |
|---|---|---|---|---|
| FAERS | laptop | (0.85, 0.04) | loop companion + CSS right 15% / top 4% | 08 |
| FAERS | wide | (0.90, 0.90) | CURSOR_CHIPS base | 08 |
| StrokeSense | base | (0.505, 0.70) | CURSOR_CHIPS base | 09 |
| StrokeSense | companion | (0.55, 0.70) | loop anchorX + CSS right 45%; anchorY branch DELETED (effAnchorY falls to chip.anchorY; no top 45% rule anywhere, grep 0) | 09 |
| Miniature | FAERS-Y | pinned 0.30 | MINI_CURSOR_CHIPS ternary; miniature FAERS stays (0.26, 0.30) | 08 |
| H-bands | desktop | H1/H2/H5 DELETED; H3/H4/H6 present, appearing only as unchanged context in the diff (byte-identical) | 10 |

Nit, non-blocker: the FAERS base code comment still cites posterwindow worst 79.5px (fixer 1's pre-correction number); QA-layout's corrected drift worst is 57.5. Comment only, no behavior; parent may leave it or fix it pre-commit.

## 3. Build + greps: all pass

- `npm run build` PASS (7.99s). Em dash in diff 0; en dash in diff 0; dialkit strings in dist 0; sciencedirect in src 0.

## 4. QA reconciliation: no open code blocker

- 12 regression: PASS. Sole action is disclosure of the Seoul-chip vs CFC-pill park.
- 13 motion: CONDITIONAL, conditions disclosure-only (FAERS-wide converge endpoints, SS-gutaxis parallax-worst transient, SS-CFC 1.2px, Seoul-chip vs CFC-pill park). No motion-code change required. All 7 mechanism items PASS (durations/phases, dart-dwell 0.3x-1.7x, converge tau 0.22 / halo 20px, scroll modulation 0.25, loop gating, reduced-motion, crossing durations).
- 11 layout-desktop: CONDITIONAL SHIP, conditions disclosure-only (see section 5). All lanes confirmed in code, JS == CSS companions, zero rest parks at h=21 AND h=28.
- Numbers reconciliation, corrected numbers govern: QA-motion's FAERS-wide posterwindow converge zone (S 550-571) is SUPERSEDED by QA-layout's measurement at true posterwindow height 355: zone S to ~628, depth ~30.3px at S=550 (not 8.3px). Likewise drift worst 57.5 (not 79.5); FAERS-lap CFC-pill worst ~207.5 at pill height 28 (not 205.5); SS base CFC chip-chip worst 1.2px (not 21.2px); SS companion awards worst 11.9px tilt-inclusive (not 12.9px); H4 COVERED at height 355 (park ends VH ~707 inside the VH <= 708 band; the 357-height 2px under-coverage was hypothetical). Chips measure ~28px, so h=28 governs; every verdict holds at h=28.
- Seoul-chip vs CFC-pill width: motion ~26px vs layout/regression ~30px (29.9 at W=1401); report as ~26-30px wide, 2.8-6.5px deep.

## 5. Disclosure list (final report must carry all of these)

Fixed parks, old -> new: FAERS-docking (0.195/0.30 -> laptop 0.85/0.04, wide 0.90/0.90); SS-glyph x-height contact (0.45 companion -> 0.55/0.70 companion, below baseline); SS-search continuous rest park + label rest park (0.55/0.33 base -> 0.505/0.70 base).
Structural residuals, not fixed here: SS-gutaxis transient, W 1401-1483 x S 550-818 (to ~844 at h=28), rest clear (6.9px tilt-inclusive), drift-only 13.4px inside the 16px standard, parallax-inclusive worst ~21.0-21.4px, needs a card move; FAERS-wide converge endpoint parks, hover-only, short stages (CFC pill W < ~1996-2051 x S 591-896, Seoul chip W 1705-2445 x S < 786, posterwindow W < 1862 x S to ~628, depth to ~30.3px at S=550), no anchor is both drift-clean and converge-clean (drift needs aY >= 0.76, converge-from-above needs aY <= 0.31 at S=550); Seoul-chip vs CFC-pill pre-existing rest park, W 1401-1900 x all S, ~26-30px wide, 2.8-6.5px deep, pill paints above, no H-band covers chip-vs-pill, needs a parent decision (pill move, chip move, or band).
Thin margins, all positive, explicitly accepted: SS-CFC 1.2px (fleeting dart alignment, ~51s cycle, never a rest park); SS glyphs 4.3px at S=550; SS desk 5.3px at W=1401; SS awards 11.9px; FAERS-wide posterwindow drift worst 57.5px.
Out-of-scope residuals carried: CFC-gutaxis H6 (rest park above 1400, VH <= 824; h=28 graze VH 825-848); Seoul-posterwindow H4 (covered at measured height 355); Seoul-awards worst transient to VH ~736; Seoul-miniature transient (rest clear 12.5, worst 23.5 design / 7.9 visual at 390px, 7.04s/cycle); float-bob caveats (Seoul-awards to ~VH 703, CFC-gutaxis to ~VH 861).
Refuted candidates, do not retry: synthesis wide (0.37, 0.35) rest-parks inside search at all wide widths for S < 707; 04's laptop (0.91, 0.75) rest-parks inside the bottom-right poster at 1161-1400 for S < 978.
D1 correction: the desktop SS-glyph 'l'-stem rest park (336 ink px, 34.3px deep) was refuted; the 0.55W chip is right-anchored, so true contact of the old 0.45 companion was worst-phase x-height ink only (to 13.8px at VH 650, zero at VH 926).

## 6. Live-check list (Netlify preview, fresh deploy)

- Desktop 1440x800-900: SS chip vs search/gutaxis over a full 14s loop (search park gone; gutaxis transient visible only at W <= 1483).
- Desktop 1161-1400 short stages: FAERS chip top-right vs poster bottom-right (clean by 259.7px worst).
- Desktop 1401-1483 x VH 650-800: SS-gutaxis transient visibility (drift-only 13.4px; deeper only with pointer pinned at parallax extreme).
- Hover converge at wide widths: FAERS converged vs CFC pill / Seoul chip / posterwindow (hover-only, short stages).
- Reduced-motion desktop: chips static, H1/H2/H5 gone so FAERS/SS chips now SHOW statically where they used to hide; confirm they sit clean.
- Tablet + phone: spot-check only, regression PASS (anchors, pills, gates, seam unchanged).

## Verdict: SHIP

Items 1-3 are clean and item 4 has no open code blocker. All QA conditions are satisfied by disclosure in section 5, not by code changes.
