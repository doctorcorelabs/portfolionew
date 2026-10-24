# Accuracy QA: Cochrane swap (hero logo set)

Scope: the ScienceDirect-to-Cochrane swap only (user direction,
24 Oct 2026). Code inspection plus direct viewing of the logo
file. No live-browser check was possible (the sandbox blocks
localhost preview), so no pixel-level live confirmation is
claimed here.

## Verdict: PASS

Every item below passes. No gap, no fix required before ship
on accuracy grounds.

## (a) Rendered Cochrane logo is the real brand artwork: PASS

Viewed `public/logos/cochrane.png` directly (361 x 466, RGB,
portrait lockup, 129,365 bytes). It shows the genuine Cochrane
lockup: a navy forest-plot C mark (navy C ring broken by a
magenta forest-plot column with effect bars and a diamond) above
the navy "Cochrane" wordmark on white. This is the brand's own
artwork, extracted as-is from the embedded raster inside
Wikimedia Commons file `Cclogo.svg`, not a redraw and not a
text wordmark. It matches the provenance record in
`docs/logo-sources.md` (2020 revision, "with permission from
Cochrane") exactly.

## (b) Zero endorsement / indexing / affiliation / partnership wording: PASS

Greps over `src/sections/Hero.tsx`, `src/components/hero-v8/`,
and `src/components/hero-collage/` for partner, affiliat,
endors, indexing, indexed, "official partner", "in
collaboration", sponsored, and "powered by" return zero hits.
The rendered logo output carries no claim text at all: each
tile renders only an `<img>` with alt "<Brand> logo" (factual
identification, e.g. "Cochrane logo"), and the components'
comments state "Tiles carry no claim text." The provenance
record in `docs/logo-sources.md` frames the use explicitly as
nominative only ("to identify a search tool the author uses,
with no endorsement, affiliation, indexing, or partnership
claim, same framing as the other database logos") and records
the trademark caveat honestly (the Commons public-domain
mark covers copyright only, not trademark rights). No rendered
copy contradicts that framing.

## (c) Zero remaining "sciencedirect" references in src/: PASS

Case-insensitive grep for `sciencedirect` over all of `src/`
returns zero hits. No historical comment in src/ mentions it,
so there is nothing to list as an exception. The only
remaining ScienceDirect mentions are in `docs/logo-sources.md`
as clearly marked REMOVED history sections ("REMOVED 24 Oct
2026 in the Cochrane swap"), which is documentation, not code,
and is the correct place for that record. The v10-era docs
under `docs/hero-v10/` are historical records and were
deliberately not rewritten, per the provenance file's own note.

## (d) Shipped logo files are exactly the four expected: PASS

`public/logos/` contains exactly four files: `cochrane.png`,
`elsevier.png`, `pubmed.png`, `scopus.png`. Both ScienceDirect
files are deleted (`sciencedirect.png` and
`sciencedirect-icon.png` show as deleted in git status, and
neither exists on disk). Every `/logos/` reference in code
resolves to one of the four shipped files (cochrane, elsevier,
pubmed, scopus); the only other "logos/" matches are directory
mentions inside code comments ("logo files live in
public/logos/"), not file references. No orphan files, no
missing files.

## (e) No invented content: PASS

The git diff of the swap touches exactly six paths: the two
deleted ScienceDirect files, the new `cochrane.png`, and the
three code files plus `docs/logo-sources.md`. The Hero.tsx
diff is only a wrapper rename (`DbSciencedirectFloat` to
`DbCochraneFloat`), one item swap (db-sciencedirect to
db-cochrane with its position, float, and hide classes), and
an explanatory comment about the portrait lockup's top-band
slot. DbLogoFloat gains one brand config (cochrane: tile
69 x 82, art 56px, artMaxWidth 44, same mid shadow as the other
wordmarks) and DbLogoRow gains Cochrane as its last tile. No
new claims, names, numbers, labels, captions, or copy of any
kind were introduced; the swap changes only the logo set, as
directed. PubMed now stands alone bottom-center, which the
comment records explicitly.

## (f) TypeScript: PASS

`npx tsc --noEmit` runs clean, 0 errors, on the swapped tree.

## (g) Em dash: PASS

Grep for em dash over the changed files (`src/sections/Hero.tsx`,
`src/components/hero-v8/DbLogoFloat.tsx`,
`src/components/hero-v8/DbLogoRow.tsx`,
`docs/logo-sources.md`) returns 0 hits.

## (h) FAERS masked check: PASS, no leak

Method: loaded `docs/faers-verified.json`, took the 2 rows with
status != "verified", and checked their numeric fields as
standalone numbers in the changed files. Only the ror field is
non-null on those rows (ciLow, ciHigh, and cases are null),
giving 2 distinct numeric tokens. Results: `Hero.tsx` 9 hits,
all pre-existing style and animation math (fade delays,
percentage positions, float durations and delays, anchor and
parallax math, transitions), with masked contexts showing no
drug, outcome, or interval structure; `DbLogoFloat.tsx` 0 hits;
`DbLogoRow.tsx` 0 hits; `docs/logo-sources.md` 0 hits. No
unverified value is printed in this report, and no leak was
found.

## Notes (non-blocking)

- The Cochrane tile is portrait (69 x 82), unlike the three
  horizontal wordmark tiles. That shape difference is inherent
  to the real lockup and is handled by the top-band slot, not by
  cropping or stretching (object-fit contain, art 56px tall
  with artMaxWidth 44).
- The mobile row order is now PubMed, Elsevier, Scopus,
  Cochrane. Row geometry re-verification belongs to the visual
  QA round, not this accuracy check.
- Live-browser confirmation of the Cochrane tile in real
  collage context remains owed, as in every round, because the
  sandbox blocks localhost preview.
