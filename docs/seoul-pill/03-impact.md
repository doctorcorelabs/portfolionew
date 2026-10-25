# 03 - Impact / insulation: Seoul chip vs CFC pill fix

Base: HEAD `5fd1ccf`, tree clean. Read-only; no source touched, no build, no push. Line numbers: `src/sections/Hero.tsx` at base.

## The park

Seoul-base chip vs CFC pill, REST overlap, W 1401-1900 x all S. Seoul chip `(0.80, 0.695)`, right-anchored, 109x21. CFC pill inline `bottom: 30%`, `right: 14%`, 114x25. X overlap `114 - 0.06W` (29.9px at W=1401, 0 at W=1900); Y overlap `0.005S` (2.8px at S=550, 6.5px at S=1300). (Pill paints above: pills render after chips, 2029 vs 1974.) The park exists ONLY on hover-capable desktop (pills hide on touch and reduced motion, 1725-1727). No H-band covers chip-vs-pill pairs (H-bands are `[data-chip]`; pills lack it).

## Option 1: Seoul chip move (base only)

Mechanism, because everything follows from it. Laptop: JS companion `Seoul && laptopMql -> 0.70` (637-638) plus CSS `right: 30% !important` (1472 block); NO Seoul anchorY companion, so laptop Y is the inline `top`, i.e. base anchorY. Miniature: MINI pins anchorX 0.70 but anchorY FLOWS THROUGH base (~186-190). Tablet: standalone `TABLET_ANCHORS` literal (Seoul 0.59/0.67 narrow, 0.59/0.685 wide, 0.52/0.78 landscape); loop/JSX read it first.

- Laptop, anchorX-only: FULLY INSULATED. JS X stays 0.70, CSS X stays `right: 30%`, Y untouched both sides. H3 stands, spot-check only.
- Laptop, anchorY move: PARTIALLY FOLLOWS. Laptop Seoul becomes `(0.70, newY)`. H3 MUST be recomputed (Seoul vs awards geometry in 1161-1400 changes).
- Miniature, anchorX-only: FULLY INSULATED. Mini X pinned 0.70, mini Y unchanged 0.695. Chip does not move.
- Miniature, anchorY move: FOLLOWS unless pinned. Mini Y flows through base, so the miniature Seoul chip moves and no H-band can hide it (mini chips carry no `data-chip`). (The FAERS-Y trap.) Required if Y moves: add a Seoul branch to MINI `anchorY` (pin 0.695, same pattern as the FAERS pin), then re-verify miniature Seoul pairs.
- Tablet: FULLY INSULATED always. Couplings: lookup by `chip.label` (do not rename); arrays index-based via refs (do not reorder).
- H4: RECOMPUTE MANDATORY for any base move. H4 is Seoul/posterwindow, reduced-motion + 1401-1600 + max-height 708. Full rest-park scan (checklist item 3). H4 is DELETABLE only on zero Seoul rest parks vs posterwindow there. H4 covers only to W=1600; a new park above that needs a NEW band or lane fix.
- H6 (CFC/gutaxis): STANDS, spot-check only.
- Converge: MUST BE RE-VERIFIED, edge-flip risk. Loop targets nearest point on word rect expanded 20px (halo), blend tau 0.22s + smoothstep, hover-only; touch drift-only. A Seoul move shifts rest, drift center, start points, and possibly the converged edge: if the chip center crosses a rect-edge threshold, the nearest edge flips discontinuously (06-converge-hbands). Re-verify converged Seoul vs every card, glyphs, label, ALL pills, SS/FAERS/CFC chips, drift AND converge.
- Chip-chip and chip-pill: FULL RE-SCAN. Seoul vs SS/FAERS/CFC chips at rest + worst (relative drift 40/28). Seoul vs every pill at rest + worst (chip drift 20/14 + pill float 10 up, direction-correct: for this pair worst is float 0, since float moves the pill AWAY from the chip below it). Scan all pairs.
- 0.5 flip guardrail. Seoul anchorX 0.80 is right-anchored. A move must stay above 0.5 unless the flip is modeled: crossing shifts rendered x by a full chip width, and the JSX right/left switch plus the laptop `right: 30%` rule assume right-anchoring. Above 1400 an X move needs no CSS.

## Option 2: CFC pill move (CSS, above-1400 scoped)

- Must beat inline, so `!important` is REQUIRED. Pill base is inline (`bottom: 30%`, `right: 14%`); plain CSS loses. Precedent: laptop 45% !important, tablet 40%/30% !important. Target `.mv-diorama-pill-cfc` (0,1,0 + `!important` beats inline).
- Scope must be exactly `min-width: 1401px`. Rules it must avoid, all disjoint from 1401+ only if scope is exact: laptop 45% (1161-1400); tablet 40%/30%; strip hides; 900px hide; `hover: none` hide; FAERS gates (different class). A careless `min-width: 1161px` scope WOULD collide with the laptop rule.
- Position-only, never `display`. `display` is the hide/show mechanism (touch/900px/strip/tablet/reduced-motion hides and shows). A position-only rule leaves all intact. Since pills hide under reduced motion, a pill move has ZERO reduced-motion impact and needs NO H-band work.
- Does NOT affect: loop code (pills never iterated, never drift, never converge); H4 (Seoul chip and posterwindow unmoved; pills carry no `data-chip`); miniature (1401+ scope cannot match below 720; pills hide below 900 anyway); tablet (disjoint scopes); other pills (CFC class only); the seam.
- DOES affect: pill vs every chip in drift, converge, float (Seoul, SS, FAERS, CFC). Pill vs every above-1400 visible card (rest + worst, card parallax +-8, card float up 8, pill float up 10, direction-correct). Pill vs label/glyphs (z 2 above frame; ink contact is a park). Pill vs pills (Seoul pill left 59% top 32%, FAERS pill top 62% left 7%).

## Comparison

Option 1 touches CURSOR_CHIPS base (+ MINI pin if Y moves) and the chip system: converge edge-flip risk, mandatory H4 recompute, conditional H3 recompute, conditional miniature pin, full chip-vs-everything re-scan. Option 2 touches one scoped CSS rule and no mechanism (no loop, no converge, no H-band, no miniature, no tablet). Re-verification is pill vs chips, cards, label/glyphs, pills.

**Verdict: Option 2 has the smaller regression surface, clearly.** Caveat: the lane search decides feasibility. If the pill has nowhere clean above 1400, Option 1 becomes necessary despite its larger surface. The aesthetic trade runs the other way: a pill move is more visible than a chip move, since the pill is a labeled fact and the chip is a drifting cursor. If both verify clean, prefer Option 2 on mechanics; if invisibility matters more, say so first.

## Re-verification checklist

### Option 1 (Seoul chip move)
1. New Seoul lane, grid W 1401-2560 x S 550-1300 (plus laptop grid if Y moves): vs all cards, glyphs, label, pills, chips; rest + worst per terms above.
2. Converge per band: rest, drift extremes, endpoint at blend 1, path samples, hover-enter/-leave; endpoints clean, paths shallow; flip thresholds documented.
3. H4 recompute (mandatory) per above; delete only on zero rest parks, else replace with exact new bounds; check W above 1600.
4. H3 recompute ONLY if anchorY moves; else spot-check H3 stands.
5. Miniature: if anchorY moves, confirm Seoul-Y pin and miniature Seoul pairs re-verify; if X-only, confirm miniature Seoul byte-unchanged.
6. Tablet untouched (grep + spot gaps); no rename or reorder; 0.5 flip not crossed (or modeled); H6 stands.
7. Build passes; no em dash; docs updated (H-band section + new round doc).

### Option 2 (CFC pill move)
1. New pill rule scope exactly `min-width: 1401px`, `!important`, position-only (no `display`): grep no other rule touched or shadowed.
2. Pill vs every chip at rest + worst (drift + float + converged positions). Binding: Seoul converge path vs moved pill.
3. Pill vs every above-1400 visible card at rest + worst; pill vs label/glyphs; pill vs both other pills.
4. Laptop pill, tablet pill shows, strip hides, touch hide, 900px hide, reduced-motion hide: all confirmed intact (no rule added outside 1401+).
5. Miniature, tablet lanes, loop code, H3/H4/H6: untouched by grep (only the new pill rule added).
6. Build passes; no em dash; docs updated (pill rule + new round doc; no H-band change needed).
