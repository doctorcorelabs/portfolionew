# v10 integration: free-floating database logos (no box)

## What shipped

- The v9 dark database card is gone entirely: `DbStackCard.tsx` and
  `LogoTiles.tsx` deleted, zero references in `src/`, and the v9
  "IN THE LAB" photo card stays deleted.
- The four real database logos now float freely in the hero, each in
  its own small white app-icon-like tile (paper #FFF, 1px #E0E0E0
  border, 8px radius, padding 12px, object-fit contain, alt
  "<Brand> logo", tile hides itself on load error). No regrouping
  container, no label, no caption, no endorsement or indexing
  wording anywhere in rendered text.
- Components: `src/components/hero-v8/DbLogoFloat.tsx` (desktop
  floats, brand prop) and `src/components/hero-v8/DbLogoRow.tsx`
  (mobile-stack row). ScienceDirect renders via its official 32px
  SD favicon monogram (`public/logos/sciencedirect-icon.png`); the
  horizontal ScienceDirect wordmark (`public/logos/sciencedirect.png`)
  stays on disk unrendered as provenance only.
- Hero item counts: 19 COLLAGE_ITEMS total, 18 visible on desktop
  at normal heights; mobile stack is exactly FaersCard,
  NotifyBubble, DbLogoRow.

## Final positions (Hero.tsx, after all fix rounds)

- db-pubmed: left 43%, bottom 5%, tilt card-b, float 13s / 0.5s,
  mobile-hide. Visible at every desktop width.
- db-sciencedirect: left 43%, bottom 19%, tilt card-e, float 12s /
  1.7s, mobile-hide + hide-short (hidden at viewport height 700px
  and below, i.e. stages 600 and below). Visible at every desktop
  width at normal heights. Sits 48px above PubMed at rest (about
  37px at worst float peak), inside the 120px anchor rule, so the
  monogram reads through its PubMed neighbor.
- db-elsevier: left 70%, bottom 5%, tilt card-a, float 11s / 1.3s,
  mobile-hide + hide-1400. Visible only above 1400px width, in the
  bottom band between DeskCard (220px, left 53%) and StrokeCard
  (260px maxWidth, right 2.5%).
- db-scopus: left 20%, top 3%, tilt card-c, float 15s / 0.9s,
  mobile-hide + hide-1400. Visible only above 1400px width.
- db-row: mobile-only row, hide-min-720, order PubMed, Elsevier,
  Scopus, ScienceDirect. Row totals about 268px against the 272px
  column at a 320px viewport (one row, 4px slack).

## Fix history (why the final positions are what they are)

1. First integration (agent 3): PubMed left 42% bottom 5%, Elsevier
   left 43% bottom 17% (stacked pair), Scopus left 21% top 3%,
   ScienceDirect right 2.5% bottom 33%.
2. Reference-fidelity QA (05) failed on three blocking gaps: the
   PubMed/Elsevier pair read as a mini-column (34px gap vs the
   40px rule), the SD icon sat about 629px from any wordmark, and
   the mobile row art was 17px (below the 20px floor). The
   prescribed swap fixed the first two at once.
3. Swap round: ScienceDirect moved to the bottom-center column
   (left 42% bottom 19%, PubMed's neighbor, 48px rest gap) and
   Elsevier took the icon's old right-column slot (right 2.5%
   bottom 33%, with the icon's hide classes). Mobile row art
   raised to 20px with padding 6px to 4px and gap 8px to 6px
   (row about 268px, still one row at 320px). Float radius 14px
   to 8px with split shadows (wordmarks mid 0 8px 20px
   rgba(1,1,1,0.14), icon near 0 4px 12px rgba(1,1,1,0.12)).
   PubMed and ScienceDirect moved left 42% to 43% (PubMed-to-gutaxis
   gap 14.8px to 29.2px, desk gap 44px) and Scopus left 21% to 20%
   (helix box overlap 13.6px to about 0.8px, ink gap about 21px).
   ScienceDirect gained hide-short after visual QA showed the
   bottom-center column violates frame clearance at stages 600
   and 550 (overlap 2.5px and 18px at rest); at stage 700 it
   clears by 28.5px at rest and about 11px at peak.
4. Final QA (06) failed with one new gap F1: Elsevier in the
   right-column slot overlapped the centered 1160px frame's right
   edge zone by up to 18.5px at widths 1401-1490 (a 104px
   right-anchored tile cannot clear the frame there at all).
   Re-QA (07) confirmed the swap fixes but re-reported F1 as R2
   plus a poster-window overlap R1, both on the old slot.
5. Relocation round: Elsevier moved to left 70% bottom 5%, the
   bottom-band slot between DeskCard and StrokeCard. It sits
   below the frame band entirely (clearance 128.5 / 83.5 / 61.0px
   at rest at stages 700 / 600 / 550; 110 / 65 / 42.5px at peaks),
   so the F1 mechanism cannot recur. Horizontal gaps:
   to DeskCard 18.2 / 24.8 / 35.0 / 106.4px and to StrokeCard
   21.3 / 32.0 / 48.5 / 164.0px at widths 1401 / 1440 / 1500 /
   1920 (tilt-adjusted 15.2 / 21.9 / 32.1 / 103.5 and 18.1 /
   28.7 / 45.2 / 160.7). The 24px rule holds from width 1453
   (desk side) and 1423 (stroke side); in the 1401-1453 band the
   desk-side gap is 15-24px, daylight not a touch, accepted as a
   structural near-miss (no placement reaches 24px on both sides
   there, since the total slack is only 39.5px).
6. Re-QA (08) on the relocated tree: PASS. No new blocking gap.
   Hide audit clean (floats hidden below 720px, row hidden at
   720px and up, Elsevier and Scopus hidden at 1400px and below,
   ScienceDirect hidden on short viewports, no width renders any
   logo twice). Header comment visibility accounting corrected
   (2 logos at 720-1400px normal heights, 4 above 1400px, 1 and 3
   respectively on short viewports).

## Deviations kept, deliberately

- Desktop wordmark art is 24px (tiles 100-104px), not the 28px /
  110-120px the placement doc originally specified. Reference QA
  recommended keeping 24px: 28px would shrink the PubMed-to-gutaxis
  gap from about 15px to about 7px. Doc 01 corrected to as-built
  (art, tile widths, padding 12px, split shadows, row gap 6px).
- The stacked PubMed + ScienceDirect pair shares a tilt-sign
  direction (PubMed +2deg, SD +3deg). Non-blocking; the scatter
  cue survives through position, size, and float desync.
- Near-miss bands accepted as documented tolerance (no overlap):
  Elsevier desk-side gap 15-24px at widths 1401-1453; SD frame
  graze up to about 2px at rest in the 601-668 stage band (white
  tile, word paints above, glyphs stay visible); Scopus-to-docking
  gap 22px (trade-off of the helix fix; do not shift Scopus left
  again).

## Visibility accounting (final)

- Widths 720-1400px, normal heights: PubMed + ScienceDirect.
- Widths above 1400px, normal heights: all four.
- Short viewports (height 700px and below): ScienceDirect hidden,
  so 1 logo at 720-1400px and 3 above 1400px.
- Below 720px width: the mobile stack row only (FaersCard,
  NotifyBubble, DbLogoRow).

## QA chain

- 02 accuracy: PASS. 03 motion/a11y: PASS.
- 04 visual: FAIL (B1 SD isolation, B2 stacked Elsevier frame
  violation) on the pre-swap tree; both fixed by the swap and
  hide-short, confirmed by 07.
- 05 reference-fidelity: FAIL (G1 pair, G2 SD isolation, G3 row
  art); all fixed, confirmed by 06 and 07.
- 06 final: FAIL (F1 Elsevier frame intrusion, new); closed by
  relocation, confirmed by 08.
- 07 recheck: FAIL (R1/R2) on the pre-relocation tree; both moot
  after relocation (new slot clears poster window by 66px+ and
  sits below the frame band).
- 08 recheck round 2: PASS.

## Still owed (live checks, sandbox blocks localhost preview)

- Desktop above 1400px, the 1401-1450 width band gaps, the
  720-1160 band, short stages, mobile stack at 320px and below,
  and the ScienceDirect monogram in real collage context next to
  PubMed.
- Elsevier provenance caveat carried from v9: the Elsevier logo
  file is official artwork vector via logotyp.us, not an official
  press kit; no current Elsevier logo exists on Wikimedia Commons.
  Documented honestly in docs/logo-sources.md.
