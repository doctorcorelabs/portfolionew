# v9 Accuracy QA - Real Database Logos

## Verdict: PASS, no blocking gaps

Scope checked: public/logos/*.png (all four files viewed directly),
src/components/hero-v8/LogoTiles.tsx, src/components/hero-v8/DbStackCard.tsx,
src/sections/Hero.tsx (photo removal), and docs/logo-sources.md.
Sources of truth: src/data/content.ts and docs/logo-sources.md.
The database set (PubMed, Elsevier, Scopus, ScienceDirect) comes from
the user's own request, not from CV.md. Tree stability: md5s of
DbStackCard.tsx, Hero.tsx, and LogoTiles.tsx identical across two
checks. No site edits, no build (read-only tsc only). Code and source
inspection only; no live browser check was possible from the sandbox.

## Per-item results

| Item | Verdict | Notes |
| --- | --- | --- |
| public/logos/pubmed.png | PASS | Real brand logo, viewed: blue "PubMed.gov" wordmark with the open-book mark. Legible, genuine artwork, not a wordmark or redraw. Source per logo-sources.md: official NLM file via Wikimedia Commons. |
| public/logos/elsevier.png | PASS | Real brand logo, viewed: Elzevir tree mark (man under a vine, "Non Solus" banner) in gray plus orange "ELSEVIER" wordmark. Legible, genuine lockup, not a redraw. |
| public/logos/scopus.png | PASS | Real brand logo, viewed: orange "Scopus" wordmark with registered mark. Legible, genuine artwork, not a redraw. |
| public/logos/sciencedirect.png | PASS | Real brand logo, viewed: orange "ScienceDirect" wordmark with registered mark. Legible, genuine artwork, not a redraw. |
| LogoTiles.tsx | PASS | Renders only the real logo images from /logos/*.png with object-fit contain (no stretch, no crop). Alt texts exactly "PubMed logo", "Elsevier logo", "Scopus logo", "ScienceDirect logo" per doc 01. No claim text anywhere in the component. Failed loads hide the tile (no broken image, no text fallback). |
| DbStackCard.tsx | PASS | Label "WHERE THE EVIDENCE IS SEARCHED" and footer "Search tools for systematic reviews" unchanged from v8. Chip row replaced by all four LogoTile renders in the documented order. Framing is search-tools only. Card geometry unchanged (220px, padding, radius, shadow, accent bar). |
| Hero.tsx (photo removal) | PASS | PhotoCard fully removed: no PhotoCard import, no PhotoCard item, no /hero-lab.jpg reference anywhere in src/, component file deleted from src/components/hero-collage/, and public/hero-lab.jpg deleted. No broken image remains. DbStackCard still a Hero item (right 22%, bottom 5%, tilt card-d, hide-720-1400), so the logo tiles render on desktop above 1400px and in the mobile stack. |
| docs/logo-sources.md | PASS | Per-file sources, dimensions, and verification notes for all four logos, plus a trademark note (marks belong to NLM and Elsevier/RELX; nominative use only; remove on objection). No invented provenance. |
| FAERS homepage rule | PASS | Only homepage FAERS figures are N = 6,601 and the 7,519 to 6,601 flow (FaersCard) and N = 6,601 (PosterWindow), all matching content.ts. No effect values, CI, p-values, or event-case counts in any scope file. Masked numeric check below confirms no unverified values. |
| Invented content / journals / DOIs / authors | PASS | Zero DOI patterns, journal names, or author lists in scope files. All visible strings inventoried: four database names, workflow labels, verified poster facts, photo captions (remaining photos), and recorded method/topic stickers. Nothing else. |
| Em dash | PASS | 0 in LogoTiles.tsx, DbStackCard.tsx, and Hero.tsx. |

## Endorsement / indexing wording check

Rendered text: 0 matches for "indexed in", "affiliated", "partner",
"endorsed", "featured in", "as seen in", "approved by" across
LogoTiles.tsx, DbStackCard.tsx, and Hero.tsx. The only matches in
scope are prohibition text: the DbStackCard header comment stating
the card must never use such wording, and the logo-sources.md
trademark note stating site copy must never say them. Neither is
rendered site copy. Stack framing remains search-tools only.

## FAERS masked numeric check (counts and masked contexts only)

Method: loaded docs/faers-verified.json, took rows with status not
verified, checked their ror/ciLow/ciHigh as standalone numbers in
Hero.tsx plus all hero-v8 and hero-collage components. Unverified
numeric tokens checked: 2 (both rows have null CI, so only their
ROR tokens apply). Matches: 8, all in pre-existing Hero.tsx code,
0 in any hero-v8 or hero-collage file. Masked contexts show only
style/code literals: frame fade delays, chip anchor arithmetic,
parallax math, and transition durations. No drug/outcome/CI
structure, not a leak. No unverified value is printed in this
report.

## Gap list

None blocking. No code fix is owed on accuracy grounds.

## Observations (not gaps, for parent / visual QA)

- O1 (presentation, visual QA scope): LogoTiles does not implement
  doc 01's tile recipe. Art height is 28px, not the specified 20px;
  tiles have no fixed 90px width, no assigned 44/40px heights, no
  assigned tilts, and no two shadow levels; the layout is a
  wrapping flex, not the fixed 2x2 grid. Inside the 220px card the
  tiles (about 111px, 116px, 111px, and up to 214px wide) mostly
  stack one per row rather than forming 2x2. This is not an
  accuracy FAIL: the logos are real and remain legible (arguably
  more legible at the larger size), and no claim is added. But if
  the parent wants doc 01's exact tile look, LogoTiles needs a
  restyle, and that is a visual decision, not an accuracy fix.
- O2 (sourcing note): the Elsevier file comes from the
  third-party library logotyp.us, not an official or Commons
  source (logo-sources.md explains why: no current Elsevier logo
  file exists on Commons, and elsevier.com serves its header logo
  as inline SVG). The artwork itself was verified visually twice:
  once by the sourcing agent and once here. Genuine lockup, but
  the parent should know the route was a library vector, not an
  official download.
- O3 (file note): the ScienceDirect PNG is RGB on white, not
  transparent. Acceptable per doc 01 because the tiles are white;
  the background edge disappears into the tile.
- O4 (orphan file, no rendered impact): DbChips.tsx (the v8 text
  wordmarks) is no longer imported anywhere in src/ after the tile
  replacement. It renders nothing. Whether to delete it is a
  cleanup decision for the parent, not an accuracy gap.
- O5 (live check still owed): as in every v7/v8 round, the final
  look of the tiles inside the dark card at real widths can only
  be confirmed on the user's Netlify preview; this QA is code and
  source inspection only.
