# Logo sources - real database logos

The four files currently shipped below are the brands' real logo artwork,
downloaded from public sources. Nothing here was redrawn, retyped, or
typeset by us. Normalization was limited to format conversion (JPG/SVG to
PNG), resolution, and trimming of transparent padding on the Elsevier file.
Colors and proportions are unchanged.

Note on history: the v9 and v10 hero docs (docs/hero-v9/, docs/hero-v10/)
describe the earlier arrangement, which shipped ScienceDirect instead of
Cochrane. Those docs are historical records and were deliberately not
rewritten. This file is the current provenance record: Cochrane is shipped,
ScienceDirect is removed.

## PubMed

- File: `public/logos/pubmed.png` (372 x 120, RGBA, 11 KB)
- Source: https://www.nlm.nih.gov/bsd/pubmed_logo.png (official NLM file,
  found via its Wikimedia Commons file page
  https://commons.wikimedia.org/wiki/File:Pubmed_logo.png)
- Verified: viewed after download. Blue "PubMed.gov" wordmark with the
  open-book mark. This is the official current lockup, not an icon, favicon,
  or screenshot. Commons lists the file as U.S. Government public domain,
  with the word "PubMed" itself trademarked.

## Scopus

- File: `public/logos/scopus.png` (1000 x 321, RGBA, 25 KB)
- Source: original vector from Wikimedia Commons file `Scopus_logo.svg`:
  https://upload.wikimedia.org/wikipedia/commons/2/26/Scopus_logo.svg,
  rendered to PNG at 1000 px wide with cairosvg. Cross-checked against the
  Scopus Wikipedia article infobox thumbnail, which shows the same artwork.
- Verified: viewed after render. Orange "Scopus" wordmark with registered
  mark. This is the full wordmark, not the separate small icon file on Commons
  (a 71 x 72 user-drawn icon, not used).
- Note: the Commons file page itself returned HTTP 403 from the sandbox
  browser, but the original file downloaded cleanly from the Wikimedia upload
  server and matches the Wikipedia infobox render.

## Elsevier

- File: `public/logos/elsevier.png` (664 x 202, RGBA, 56 KB, transparent
  padding trimmed)
- Source: https://logotyp.us/file/elsevier.svg (vector of the official
  artwork, from the logotyp.us logo library page
  https://logotyp.us/logo/elsevier/)
- Verified: viewed after render. The Elzevir tree mark (man under a vine,
  "Non Solus" banner) in gray plus the orange "ELSEVIER" wordmark. This is
  Elsevier's real logo lockup, not a redraw. Corroboration: Wikipedia's
  Elsevier article notes that the original Elzevir family seal is used as
  Elsevier's logo.
- Why not official or Commons: no current Elsevier logo file exists on
  Wikimedia Commons (only the old "Reed Elsevier" corporate logo from
  2008/2015, not used), and elsevier.com serves its header logo as inline
  SVG, not a downloadable image file. The library-hosted vector of the
  official artwork was therefore used, and its content was verified visually.

## Cochrane

- File: `public/logos/cochrane.png` (361 x 466, RGB, portrait lockup)
- Source: the embedded PNG inside Wikimedia Commons file `Cclogo.svg`
  (https://commons.wikimedia.org/wiki/File:Cclogo.svg), current revision
  22 January 2020, described as "Updated to the new version with permission
  from Cochrane", author Cochrane Collaboration. Extracted as-is from the
  embedded raster inside the SVG wrapper, with no pixel changes.
- Verified: navy forest-plot C mark above the navy "Cochrane" wordmark on
  white. This is a portrait lockup (taller than wide), unlike the horizontal
  wordmarks of the other three logos, and it is the current Cochrane
  lockup, not a redraw.
- Trademark note: the Commons file is marked public-domain-as-textlogo,
  but the Cochrane name and mark are trademarked. That public-domain mark
  covers copyright only and grants no trademark rights. On this site the
  logo is used nominatively only, to identify a search tool the author
  uses, with no endorsement, affiliation, indexing, or partnership claim,
  same framing as the other database logos.
- Deliberately not used: cochrane.org's own header logo
  (themes/custom/cochrane_hs/img/logo.png, 400 x 83), because it is a white
  logo on a navy background made for dark headers, wrong for our white
  tiles.
- Swap note: Cochrane replaced ScienceDirect on user direction,
  24 Oct 2026.

## ScienceDirect (wordmark) - REMOVED, not shipped

- REMOVED 24 Oct 2026 in the Cochrane swap (user direction: replace
  ScienceDirect with Cochrane). History: `public/logos/sciencedirect.png`
  was the 729 x 90 horizontal wordmark from Elsevier's ScienceDirect
  toolkit page.

## ScienceDirect (compact icon) - REMOVED, not shipped

- REMOVED 24 Oct 2026 in the Cochrane swap. History:
  `public/logos/sciencedirect-icon.png` was the 32 x 32 SD favicon monogram
  from ScienceDirect's own CDN, used in the small tiles because the
  horizontal wordmark did not fit.

## Trademark note

All four marks belong to their owners: PubMed to the U.S. National Library
of Medicine; Elsevier and Scopus to Elsevier / RELX; Cochrane to the
Cochrane Collaboration (trademarked; the Commons public-domain-as-textlogo
mark covers copyright only). On this site they are used nominatively only,
to identify the search tools the author uses. Nothing on the site claims
endorsement, affiliation, partnership, or indexing. Site copy must never say
"indexed in", "affiliated", "partner", or "endorsed" in connection with
these logos. If a rights holder objects, remove the logo.
