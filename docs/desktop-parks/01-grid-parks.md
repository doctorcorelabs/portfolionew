# Desktop chip parks: grid W 1161-2560 x VH 650-1300

Base: HEAD `15c3ed9`, read-only, no source edits. Stage S = VH - 100.
Chips (JSX): FAERS 73x21, StrokeSense 116x21, Code for Cure 130x21,
Seoul 2026 109x21. Drift rx 20 / ry 14, dart-dwell
`theta = psi + 0.35*sin(2*psi)`, parallax 8 (collage only, mouse only),
float 8 up (collage only). Glyphs and label do not move. "Rest" = drift
center. "Worst" = drift + parallax + float at the most favorable phase.
Converge is hover-only, reported separately.

## Anchor convention (load-bearing correction)

Loop and JSX agree: anchorX > 0.5 means right-anchored, so final left =
anchorX*W - chipW. StrokeSense is 0.55W-116, NOT 0.55W. Docs 05 and fixer
3 used 638-754 at W=1160 (left-anchored); code-correct is 522-638. All
StrokeSense numbers below use it.

Sizes (+-3px; tilt included): docking 230x184,
helix 100x250, review 220x209, poster 260x~200, faers 240x180, gutaxis
230x172, awards 168x124, search 260x229, posterwindow 280x357,
microscope 210x192, desk 220x198, notify 312x52, stickers ~371x26, tiles
pubmed 100x50, elsevier 104x50, scopus 100x50, cochrane 69x82. Gates:
helix VH >= 751, cochrane VH >= 751 (1301-1400: >= 801), notify VH >=
882, stickers VH >= 951 and W >= 1301, microscope VH >= 801 and W >=
1301, poster/awards only 1161-1400, search/posterwindow/gutaxis/desk
only above 1400. Glyph geometry pixel-true (fresh Inter VF render,
700/180px/-1.8px tracking, reproduces doc 05): ink 840 wide, rows
S/2-43.3 to S/2+91.7, 'l' stem W/2+90 to W/2+106, x-height top S/2-6.3,
label 167 wide at S/2-136.7 to S/2-122.3.

## The three known parks (re-derived)

1. FAERS vs docking: CONFIRMED. Rest W 1161-1380 x VH 650-803 (analytic
< 1382, < 804), max 37.3x21 at 1161x650, exactly fixer 1's H1. Continuous
100% at the deep corner, 39%/4.8s@1350x780. Worst
to W < 1547 x VH < 856; at 1440x810 (rest-clear) a 10-12% / 1.5s transient.
2. StrokeSense vs glyphs: CORRECTED, see D1. NO rest ink park. 'l'
stem: rest clear 32.9px at W=1161 to 20.0px at W=1400; worst touch only
at exactly W=1400 (0px). True contact is x-height ('a'/'n') ink only,
worst-phase only: depth up to 13.8px at VH 650, zero at VH 926, duration
50%/7.0s@1161x650 (14s cycle), 25%/3.5s@1161x900. Rest
clears x-height by 0.2px at VH 650 (hairline, +-1px tolerance) to 33px
at VH 1300. Above 1400 the 0.33 anchor clears all glyphs by 15px+
worst. Note: the ink-band BOX overlaps at rest (116x21) in 1161-1400 but
includes empty rows; pixel-true contact is x-height only.
3. StrokeSense vs search (above 1400): CONFIRMED, reproduces doc 06
(static 104.0x14.3 at 1440x800 vs their 104.4x14.3; 0.4px tilt rounding).
Rest W 1401-1989 x VH 650-846, max 110.8x21 at short stages. Continuous
100%@VH<=800, 57%/8.0s@VH830, 33%/4.6s@VH880, 0%@VH>=892. Worst (drift + mouse parallax) to W < 2137 x VH < 891
(drift-only W < 2095 per doc 06; +42px is parallax).

## New rest parks (not in prior docs)

4. StrokeSense vs LABEL (above 1400): rest W 1401-2560 x VH 820-1028,
max 116x14.4 at 1440x924 (full chip width over the full label height,
continuous 100%@VH924; 50%/7.0s@edges).
Worst to VH 737-1110. Cause: the 0.33 anchor descends through the
centered label band as S grows (0.45 anchor at 1161-1400 sits below
it, clear by 62px+; prior docs modeled label pairs for tablet only).
5. FAERS vs stickers: rest W 1301-2190 x VH >= 951 (stickers width
uncertainty +-8px moves the W bound to 2143; H2's 2190 reproduced with
371px), max 73x16.8 at 1301x955, depth 10-17px tapering with VH.
Continuous 100%@1301x955; 66-100%@1406x1300 by float phase. Worst to W < 2355. This is H2's static band, but it is a
normal-motion rest park at tall stages, not just reduced-motion.
6. Code for Cure vs gutaxis (above 1400): rest all W >= 1401 x VH
650-824 (matches H6 <= 824), max 130x21 at 1406x650, continuous 100% at
short stages, 55-71%/6.1-7.8s@VH810. Worst to VH < 904.
7. Seoul vs posterwindow (above 1400): rest W 1401-1600 x VH 650-710
(matches H4: 1401-1600, <= 708), max 34x21 at 1406x650, continuous 100%
at short stages, 58%/8.8s@VH700. Worst to W < 1760 x VH < 734.
8. Seoul vs awards (1161-1400): rest hairline ONLY: VH < 653, max
109x0.7 at 1161x650 (matches H3 exactly; see D3). Worst transient to
VH < 736, depth up to 21, 26-63%/3.9-9.5s.

## Completeness check

- CFC vs desk: CLEAR (x-separated; overlap would need W < 573).
- Seoul vs awards: park 8. Seoul vs posterwindow: park 7.
- FAERS vs helix: NO rest park; worst-only transient W 1161-1343 x VH
751-1040, 16-30%/1.9-3.5s (touch 1.9s; mouse 3.5s).
- FAERS vs review: CLEAR (x-separated all bands).
- StrokeSense vs review-old (above 1400): NO rest park (rest x-clear
by 0.44px at W=1401, widening with W; see D4). Worst-only transient W
1401-1573 x VH < 856, 28%/3.9s touch, 56%/7.8s mouse.
- StrokeSense vs review-new (1161-1400): CLEAR, rest 23.6px and worst
9.6px (float 0) / 17.6px (float away) at VH 650; see D2.
- Chip-chip: ALL CLEAR at rest and worst (relative drift 40/28).
Thinnest: StrokeSense vs Code for Cure, worst gap 4.3px at W=1161
(rest 44.3px).
- Other worst-only transients: FAERS vs microscope W 1301-1406 x VH
805-860, depth ~19px but 2-19%/0.2-2.3s (inside the 3s budget, over on
depth); CFC vs notify W 1161-1244 x VH >= 882, 30%/3.3s touch, 60%/
6.6s mouse.
- All remaining pairs (full scan: 4 chips x 21 obstacles + 6 chip-chip)
CLEAR at rest and worst. CFC and Seoul clear the glyph band by 1.6px
worst at VH 650 (hairline, not a park); FAERS clears glyphs by 31.7px
worst at VH 650. Poster is x-clear of every chip on the desktop grid.

## Converge transients (hover only, separate from drift)

Converge pulls each chip to the nearest point on the word rect expanded
20px. It does NOT rescue the short-stage parks: converged StrokeSense
parks on search for W < 1989 x VH < 753; converged Code for Cure parks
on gutaxis for all W >= 1401 x VH < 753; converged Seoul parks on
posterwindow for W 1401-1600 x VH < 739. It DOES rescue StrokeSense vs
label (clears by 40px) and vs glyphs (clears cap tops by 18px).
Converged FAERS clears the helix box by 15px (anchor comment reproduced
exactly) and the microscope right edge by 33px (comment claimed 13px;
see D5), but still touches docking for W < 1382 x VH < 680.

## Disagreements with docs 05/06/07/08

- D1 (major): doc 05 section 2 claimed a StrokeSense vs 'l'-stem REST
park (336 ink px, 34.3px deep, 1161-1400 all heights). REFUTED: it used
the left-anchored chip range 638-754. Code-correct range 522-638 plus
the fresh Inter render gives stem clear 20-33px rest and x-height
transient only. Do NOT design against a stem park.
- D2: rearrangement QA claimed review vs StrokeSense chip 0.45 at
+1.72px at VH 650. NOT reproduced: rest 23.6px, worst 9.6px at VH 650
(review 209px from source). Verdict still CLEAR, margin ~10-24px.
- D3: rearrangement QA claimed Seoul-awards rest below VH ~706 and
worst below VH ~766. Rest NOT reproduced (zero at VH ~653, matches H3).
Worst reproduced to VH ~736 (30px less; float/parallax treatment).
- D4: rearrangement QA P2 claimed review-old vs StrokeSense 0.33 as a
REST park (1401-1522 x VH < 856). NOT reproduced as rest: rest x-clear
by 0.44px at W=1401. Worst-only W 1401-1573 x VH < 856.
- D5 (minor): FAERS anchor comment claimed converged chip 13px past
MicroscopeCard's right edge at 1440/H800; model gives 33px. Helix 15px
reproduced exactly. Converge clears both either way.
- D6 (minor): stickers 363px (source-derived) vs ~371px (H2 implied),
so FAERS-stickers W bound is 2143-2190. Search 229 (doc 06) vs ~231
(source-derived); posterwindow 356 (H4) vs ~358. Chip height 21
(JSX-verified) vs 28 (doc 06 upper bound) shifts VH bounds up to ~25px
for fully-inside pairs. None changes a verdict.

## Ranked park table (worst first)

| # | Pair | Type | W | VH | Max | Duration |
|---|------|------|---|----|-----|-----------|
| 1 | StrokeSense vs search (C) | rest | 1401-1989 | 650-846 | 110.8x21 | 100%<=800; 57%@830 |
| 2 | Code for Cure vs gutaxis (C) | rest | 1401-2560 | 650-824 | 130x21 | 100%@650; 55-71%@810 |
| 3 | FAERS vs docking (A/B) | rest | 1161-1380 | 650-803 | 37.3x21 | 100%@1161x650; 39%@1350x780 |
| 4 | StrokeSense vs label (C) | rest | 1401-2560 | 820-1028 | 116x14.4 | 100%@924; 50%@edges |
| 5 | FAERS vs stickers (B/C) | rest | 1301-2190 | >=951 | 73x16.8 | 100%@1301x955; 66-100%@1300 |
| 6 | Seoul vs posterwindow (C) | rest | 1401-1600 | 650-710 | 34x21 | 100%@650; 58%@700 |
| 7 | Seoul vs awards (A/B) | rest-hairline | 1161-1400 | 650 only | 109x0.7 | 0.7px rest; worst 26-63% to VH 735 |
| 8 | StrokeSense vs x-height (A/B) | worst-only | 1161-1400 | 650-926 | 13.8 deep | 50%/7.0s@650; 25%/3.5s@900 |
| 9 | StrokeSense vs review-old (C) | worst-only | 1401-1573 | 650-856 | 27.4 wide | 28% touch; 56% mouse@1440x700 |
| 10 | Code for Cure vs notify (A) | worst-only | 1161-1244 | >=882 | 22.2 wide | 30% touch; 60% mouse@1161x900 |
| 11 | FAERS vs docking extension | worst-only | 1401-1539 | 801-855 | transient | 10-12%/1.5s@1440x810 |
| 12 | FAERS vs helix (A/B) | worst-only | 1161-1343 | 751-1040 | 13.9 wide | 16% touch; 30% mouse@1161x900 |
| 13 | FAERS vs microscope (B/C) | worst-only | 1301-1406 | 805-860 | ~19 deep | 2-19%/0.2-2.3s@1301x830 |
| 14 | FAERS vs stickers extension | worst-only | 2184-2344 | >=951 | transient | edge of park 5 |
| 15 | StrokeSense vs search extension | worst-only | 1990-2134 | 847-891 | transient | edge of park 1 |
