# v10 final QA: free-floating database logos

## Verdict: FAIL (blocking, one new gap F1)

No code defect was found in the components themselves, and every
check in this report's scope passes except the one blocking item
below. The FAIL is not carried from the sibling reports in their
original form: their blocking gaps are closed in the current tree
(see reconciliation), but the fix round that closed them
introduced a new frame-clearance violation of the same class, and
that violation is what blocks shipping.

Report only. No site edits, no build (read-only `npx tsc --noEmit`
was run: clean, 0 errors). Code inspection plus direct viewing of
the logo files only; no live browser check was possible from the
sandbox, so all geometry is modeled, not seen, and live
confirmation stays owed.

## 1. Per-file verdicts

| File | Verdict | Notes |
| --- | --- | --- |
| `src/sections/Hero.tsx` | FAIL (carried by F1) | Imports, render, hide classes, tilts, reduced-motion, parallax gate all pass. FAIL because the db-elsevier item position (right 2.5 percent, bottom 33 percent) violates frame clearance at stage widths 1401-1490 (see F1). |
| `src/components/hero-v8/DbLogoFloat.tsx` | PASS | Real logo images only, alt text brand plus "logo", contain fit, no claim text, onError hides failed tiles, no self-animation, tiered shadows, radius 8. |
| `src/components/hero-v8/DbLogoRow.tsx` | PASS | Row art 20px (G3 fixed), padding 4, gap 6, row about 268px against the 272px column at a 320px viewport, wraps safely, no tilt, no animation, no claim text. |
| `public/logos/pubmed.png` | PASS | Viewed: blue "PubMed.gov" wordmark with book mark. 372x120 RGBA, valid PNG. Rendered by float and row. |
| `public/logos/elsevier.png` | PASS | Viewed: Elzevir tree mark plus orange "ELSEVIER" wordmark. 664x202 RGBA, valid PNG. Rendered by float and row. |
| `public/logos/scopus.png` | PASS | Viewed: orange "Scopus" wordmark with registered mark. 1000x321 RGBA, valid PNG. Rendered by float and row. |
| `public/logos/sciencedirect-icon.png` | PASS | Viewed: orange SD monogram on transparent ground. 32x32 RGBA, valid PNG. Rendered by float and row. |
| `public/logos/sciencedirect.png` | PASS (unrendered) | Viewed: orange "ScienceDirect" wordmark with registered mark. 729x90 RGB, valid PNG. Zero references in `src/` since v10 renders the icon instead; it ships in `public/` as provenance only (see O4). |

## 2. Import contract: PASS

- Hero.tsx imports DbLogoFloat and DbLogoRow (lines 58-59) and
  renders them: four module-level brand wrappers (DbPubmedFloat,
  DbElsevierFloat, DbScopusFloat, DbSciencedirectFloat, never
  inline in the render loop, so tiles never remount) plus db-row
  (DbLogoRow, rendered once).
- DbStackCard.tsx and LogoTiles.tsx are DELETED by design (git
  status `D`), and grep finds 0 references to DbStackCard,
  LogoTiles, dbstack, hero-lab, PhotoCard, or chip row anywhere
  in `src/`. No dangling import. No other orphan: every hero-v8
  import resolves; the only unused export is DbLogoFloat's
  default export (DbLogoRow's default is likewise unused by
  Hero, which uses named imports), harmless, same class as v8.
- Render loop applies each item's hideClass and tiltClass
  (line 952 outer wrapper, line 960 tilt wrapper), so hide and
  tilt behavior below is real, not declarative-only.

## 3. TypeScript and greps: PASS

- `npx tsc --noEmit`: clean, 0 errors, whole tree, re-run on the
  current (post-fix) tree.
- Em dash: 0 across Hero.tsx plus all hero-v8 files. En dash: 0.
- Forbidden patterns (marquee, scroll-lock, cursor none,
  scroll-snap, overscroll, Lenis): 0.
- Endorsement/indexing wording in rendered text ("indexed in",
  "affiliated", "partner", "endorsed", "as seen in",
  "featured in"): 0, including comments.
- Invented names: 0. The new files contain only the four brand
  names plus generic layout words; no person names, no invented
  institutions.
- Reference copy: 0 in rendered copy. "Onlines" appears only in
  the pre-v7 Hero header comment attributing style, as in v9.

## 4. FAERS masked check: PASS, no leak

Method: loaded `docs/faers-verified.json`, took the 2 rows with
status not verified, took their 2 distinct numeric tokens
(ror/ciLow/ciHigh values; CI fields are null for these rows, so
only the ROR tokens apply), and searched them as standalone
numbers in Hero.tsx plus all hero-v8 files. Counts only, contexts
masked (digits replaced by #). No values are printed here.

- Hero.tsx: 9 hits, all pre-existing style/animation math:
  fade-delay comments, percentage positions, floatDuration and
  floatDelay literals, cursor-anchor math, parallax math,
  transition durations. No drug, outcome, or CI structure.
- DbLogoFloat.tsx: 0 hits. DbLogoRow.tsx: 0 hits. Every other
  hero-v8 file: 0 hits.
- Homepage rule intact: the only FAERS numbers on the homepage
  remain N = 6,601 and the 7,519 to 6,601 flow in FaersCard, plus
  N = 6,601 in PosterWindow. No effect values, CI, p-values, or
  event-case counts in any v10 file.

## 5. Reduced-motion: PASS

- CSS: the reduced-motion block kills the collage entrance and
  all collage floats, kills the hero entrance pieces
  (grid/word/frame/handles/label), and hides the diorama.
- JS parallax gate: early return unless hover plus fine pointer,
  early return under prefers-reduced-motion, rAF-throttled
  mousemove, mouseleave reset, listener cleanup on unmount.
- Logo tilts are static class transforms, zeroed below 720px by
  the mobile block (all tilt classes including mv-tilt-card-e,
  which is defined). Float durations and delays are all distinct
  pairs (13/0.5, 11/1.3, 15/0.9, 12/1.7). No file animates itself.

## 6. Hide-rule audit: PASS, no width renders logos twice

Definitions verified in the Hero stylesheet:

- `.mv-collage-mobile-hide` is `display: none` inside
  `@media (max-width: 719px)`. All four float items carry it, so
  all four are hidden below 720px.
- `.mv-collage-hide-min-720` is `display: none` inside
  `@media (min-width: 720px)`. db-row carries it, so the row is
  hidden on desktop (720px and up).
- Handoff is clean: at 719px only the row shows; at 720px only
  the floats show. No width shows both, and no width shows
  neither via the handoff itself (db-pubmed carries only
  mobile-hide, so it shows at every desktop width and height).
- Mobile stack below 720px is exactly three entries by DOM
  order: faers (no hide class), notify (hidden only at
  720-1160px), db-row. Every other item is hidden below 720px
  by at least one class (mobile-hide, hide-mid, or hide-1400).
- The row's own hide behavior is correct in the other direction:
  it never renders on desktop, so desktop never shows 8 logos.
- Caveat inside this PASS: db-sciencedirect additionally carries
  hide-short (`display: none` at max-height 700px), so the icon
  does not render at stage heights of 700px or less, including
  exactly 700px where it clears the frame by about 29px (see O1).
  That is a visibility choice, not a double render.

## 7. Blocking gap

### F1 (blocking, NEW, introduced by the G1/G2 swap fix): Elsevier violates frame clearance at stage widths 1401-1490

- Evidence: Elsevier moved to the icon's old right-column slot
  (right 2.5 percent, bottom 33 percent, 104px wide). Frame width
  is min(1160, stage width), centered. Horizontal gap from the
  tile's left edge to the frame's right edge equals
  0.475W - 684, where W is stage width:
  - W 1401: gap -18.5px (18.5px overlap with the frame zone)
  - W 1420: gap -9.5px (overlap)
  - W 1440: gap 0.0px (abutment, no clearance)
  - W 1450: gap 4.8px
  - W 1470: gap 14.2px
  - W 1490: gap 23.8px
  - W 1491: gap 24.2px (first passing width)
- The tile's vertical span sits inside the frame's vertical span
  at every stage height (bottom 33 percent), so the horizontal
  numbers above are real frame-zone intrusions, not near misses
  in a disjoint band. The frame paints above the collage (z 1
  versus 0), so glyphs stay visible above the tile, exactly the
  mitigating fact visual QA recorded for B2; it is still a
  composition break of the class visual QA scored as blocking
  (B2 was blocking for a 7px peak overlap; this is 18.5px static
  overlap at 1401).
- Why the swap missed it: the reference-fidelity fix specified
  the swap and asked only to re-verify the pair gap, the icon's
  frame clearance, and the SD-to-stroke gap. It never asked to
  verify Elsevier's frame clearance in its new slot. A
  right-anchored 104px tile cannot satisfy the 24px rule just
  above 1400px at all: at W just above 1400 the frame (1160px)
  leaves only about 120px of total side margin, and tile plus
  clearance need 128px.
- Concrete fixes (parent picks one; do not ship silently):
  - (a) Hide Elsevier below about 1500px (new hide class, e.g.
    display none at max-width 1500px). At 1401-1500 the visible
    set becomes PubMed, Scopus, and the icon (tall stages only),
    with no frame violation anywhere. Cost: Elsevier vanishes
    in the 1401-1500 band, and the Hero comment's "2 more above
    1400px" accounting must be updated.
  - (b) Relocate Elsevier to a slot that provably clears the
    frame, poster window, and stroke at every visible width and
    height, and re-verify all three neighbors plus the pair gap.
    The top band is full (docking, helix, search, review,
    poster, poster window), so this is not a one-line move.
  - (c) Explicitly accept the 1401-1490 violation band as a
    documented deviation, noting the frame paints above the tile
    so nothing becomes illegible. This is a parent call, not a
    silent default.
- Secondary facet of the same slot (modeled, needs live
  confirmation if the slot stays): Elsevier to poster window is
  about 23px at H=700 (1px under the rule, content-height
  dependent) and may overlap at short stages (poster window
  bottom about 385px at H=600 against Elsevier top 352px, with
  roughly 30px of font-metric uncertainty either way).
  Elsevier to stroke is clean (71px at H=700, 29px at H=550 at
  rest, about 18-21px at peaks, same non-blocking band as old
  N4).

## 8. Sibling reconciliation

- Accuracy QA (02): PASS, no blocking gaps. Nothing carried.
- Motion/a11y QA (03): PASS, no blocking gaps. Nothing carried.
- Visual QA (04): FAIL with B1 and B2, both addressed in the
  current tree, but not cleanly closed:
  - B1 (SD isolated about 632px from the nearest wordmark):
    FIXED. SD now sits at left 43 percent, bottom 19 percent,
    above PubMed: rest gap 48px (0.14H - 50 at H=700), 40px at
    worst float peaks, exactly meeting the 40px rule. Its frame
    clearance is about 29px at H=700.
  - B2 (stacked Elsevier frame violation at stages 600/550):
    STRUCTURALLY FIXED (the stack no longer exists; SD's new
    position is protected by hide-short at H at or below 700).
    But the swap that fixed it created F1 above, so visual's
    FAIL is superseded in its original items, not closed overall.
  - Visual N1 (pair gap): gone with the pair. N2 (PubMed to
    gutaxis 14.8px): FIXED, PubMed moved to 43 percent, gap
    29.2px at 1440 (desk gap 44px, still passing). N3 (Scopus to
    helix box overlap): IMPROVED, Scopus moved to 20 percent,
    box gap 0.8px, ink clearance about 21px; docking gap is now
    22px (new near-miss, see O3). N4 (SD to stroke peaks):
    unchanged in character for the new Elsevier slot (see F1
    secondary facet). N5 (doc size deviations): as-built sizes
    kept, correctly not "fixed". N6 (row art 17px): FIXED, art
    20px (see G3).
- Reference-fidelity QA (05): FAIL with G1, G2, G3, all fixed in
  the current tree:
  - G1 (stacked pair gap 34px): FIXED, 48px rest, 40px peaks.
  - G2 (SD orphaned about 629px): FIXED, anchor is PubMed at
    48px.
  - G3 (row art 17px below the 20px floor): FIXED, art 20px,
    padding 4, gap 6, row about 268px against the 272px column
    (4px slack), one row at a 320px viewport.
  - G4 (near-miss separations): PubMed to gutaxis fixed;
    Elsevier to gutaxis gone; SD to poster window gone;
    Elsevier to poster window is the new near-miss in F1's
    secondary facet.
  - G5 (Scopus to helix box overlap): IMPROVED as in N3 above.
  - G6 (shadow tiers, radius): FIXED in substance, wordmarks
    0 8px 20px at 0.14 alpha, icon 0 4px 12px at 0.12 alpha,
    radius 8 (values differ slightly from the doc's 0.10/0.06
    but the tiering principle is applied).
  - G7 (tilt-sign sharing): CHANGED, not closed. The stacked
    pair now shares a sign (PubMed +2deg, SD +3deg). Non-blocking;
    flip SD to a negative tilt class only if strict alternation
    is wanted, and re-verify mobile zeroing still covers it.

## 9. Observations (non-blocking)

- O1: SD hides at H at or below 700px (hide-short) although it
  clears the frame by about 29px at exactly H=700. At the most
  common laptop height (700px stage, 800px viewport) the icon
  does not render: 3 logos above 1400px, 1 logo at 720-1400px.
  The Hero comment's "2 visible at every desktop width, 2 more
  above 1400px" accounting is therefore inaccurate at short
  stages. Fix: narrow the hide to max-height 699px, or update
  the comment to state the short-stage behavior.
- O2: Elsevier to poster window, see F1 secondary facet.
- O3: Scopus to docking gap is now 22px (was 36.4px) after the
  21 percent to 20 percent shift. Under the 24px rule, no
  overlap, both fully legible: G4-class near-miss, no fix
  required.
- O4: `public/logos/sciencedirect.png` (38KB) still ships
  unreferenced. Harmless provenance; delete it or keep it as
  documented, but do not let it drift from logo-sources.md.
- O5: Pair tilt signs now shared (PubMed +2deg, SD +3deg); see
  G7 above.

## 10. Stability and what must happen before ship

- Tree movement during this check: the first snapshot (taken
  after Hero wiring) differed from the second snapshot (taken
  after the fix round landed). The post-fix md5s for Hero.tsx,
  DbLogoFloat.tsx, and DbLogoRow.tsx are identical across the
  stability re-check and this final pass, so the verdict above
  is on a stable tree.
- Must happen before ship:
  1. Resolve F1 by fix (a) or (b), or explicit parent acceptance
     under (c). Re-run visual geometry on the new Elsevier
     position if it moves: frame, poster window, stroke.
  2. Apply or explicitly accept O1 (SD short-stage hide
     boundary and comment accounting).
  3. Live-browser confirmation, still owed as in every round:
     desktop above 1400px, the 1401-1500px band (where F1
     bites), the 720-1160px band, short stages, and the mobile
     row at 320px and below.
- Build was NOT run, per the brief. Code inspection only.
