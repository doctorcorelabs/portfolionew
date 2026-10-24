# Logo sources - v9 real database logos

All four files below are the brands' real logo artwork, downloaded from public
sources. Nothing here was redrawn, retyped, or typeset by us. Normalization was
limited to format conversion (JPG/SVG to PNG), resolution, and trimming of
transparent padding on the Elsevier file. Colors and proportions are unchanged.

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

## ScienceDirect

- File: `public/logos/sciencedirect.png` (729 x 90, RGB on white, 38 KB)
- Source: Elsevier's own ScienceDirect toolkit page
  https://www.elsevier.com/en-au/librarian/promote-library-resources/toolkit-sciencedirect,
  whose Logo download resolves to
  https://images.ctfassets.net/o78em1y1w4i4/GWC8bFpqraM97YtVIXsIy/9b7d32d7210a3927c6585b82d8c19fe9/ScienceDirect-Librarian-Promo-Toolkit_Logo.jpg
- Verified: viewed after download. Orange "ScienceDirect" wordmark with
  registered mark, the current logo. Converted from JPG to PNG with no pixel
  changes (white background kept).
- Note: Wikipedia's ScienceDirect article carries no logo. A WikiMD mirror
  references a "ScienceDirect_logo_2020" image but exposes no downloadable
  file URL, and its file page timed out from the sandbox. The official
  toolkit file supersedes those routes.

## ScienceDirect (compact icon, for the 90 px tile)

- File: `public/logos/sciencedirect-icon.png` (32 x 32, RGBA, 504 bytes)
- Source: ScienceDirect's own static assets CDN,
  https://sdfestaticassets-us-east-1.sciencedirectassets.com/shared-assets/103/images/favSD.ico,
  the site icon referenced by sciencedirect.com pages. Downloaded copy is
  byte-identical to https://www.sciencedirect.com/favicon.ico (same MD5).
- Verified: viewed after extraction (32 px entry taken as-is, converted
  from ICO to PNG with no pixel changes). Orange abstract SD favicon mark
  on a transparent background. This is ScienceDirect's own compact mark,
  not a redraw and not a crop of the horizontal wordmark.
- Caveats, stated plainly: 32 px is the largest size ScienceDirect
  publishes for this mark, below the 200 px bar used for the other logos.
  The tile displays it at 20 px tall, so it renders as a downscale and
  stays sharp. At 20 px it reads as a small orange mark, not a wordmark,
  so a casual viewer identifies it mainly from context (the card label,
  the neighboring wordmarks, and the alt text "ScienceDirect logo"). If
  that reads too weak in the visual re-check, the fallback is the visual
  QA alternative (hide the card on short stages) or keeping the taller
  card, not inventing a new mark.
- Dead ends checked for a larger compact asset: Wikimedia Commons holds
  only horizontal ScienceDirect wordmarks (683 x 88 and 1038 x 165);
  Elsevier's toolkit page offers only the horizontal wordmark download;
  the ScienceDirect mobile app is delisted from both app stores (no icon
  retrievable from iTunes Search or Play listings); logo libraries
  (logotyp.us, seeklogo, brandfetch, worldvectorlogo) carry only the
  horizontal wordmark; the Internet Archive CDX API was temporarily
  offline; the Facebook Graph picture endpoint returned 400 without a
  token; Clearbit's logo endpoint did not connect from the sandbox.

## Trademark note

All four marks belong to their owners: PubMed to the U.S. National Library
of Medicine; Elsevier, Scopus, and ScienceDirect to Elsevier / RELX. On this
site they are used nominatively only, to identify the search tools the author
uses. Nothing on the site claims endorsement, affiliation, partnership, or
indexing. Site copy must never say "indexed in", "affiliated", "partner", or
"endorsed" in connection with these logos. If a rights holder objects, remove
the logo.
