# Accuracy QA v10 - free-floating database logos

## Verdict: PASS, no blocking gaps

Scope: `public/logos/*.png`, `src/components/hero-v8/DbLogoFloat.tsx`,
`src/components/hero-v8/DbLogoRow.tsx`, `src/sections/Hero.tsx`
(v10 edits only). Sources of truth: `src/data/content.ts` and
`docs/logo-sources.md`. The database set (PubMed, Elsevier, Scopus,
ScienceDirect) comes from the user's own request, not from CV.md.

Method: code inspection plus direct viewing of each rendered logo
file. No site edits, no build (read-only `npx tsc --noEmit` only,
clean, 0 errors). No live browser check was possible from the
sandbox, as in every prior round; live confirmation remains owed via
the Netlify preview. Tree stability: md5 of Hero.tsx, DbLogoFloat.tsx,
and DbLogoRow.tsx identical across two checks 60 seconds apart.

## What v10 changed (accuracy-relevant)

The v9 dark database card is gone. The four logos now float free in
the hero like the reference's floating app icons: four desktop items
(`db-pubmed`, `db-elsevier`, `db-scopus`, `db-sciencedirect`, all
with `mv-collage-mobile-hide`) plus one compact mobile row item
(`db-row`, `mv-collage-hide-min-720`, so it renders only below
720px). The mobile stack comment now reads FaersCard, NotifyBubble,
DbLogoRow. The "search tools" label and footer went away with the
dark card. Per the brief, that loss is the user's own direction
(reference-style free placement, no labels) and is NOT scored as an
accuracy gap; this report judges only whether the new placement adds
any endorsement implication.

## Per-item results

- **Rendered logos are the real brand artwork: PASS.** Each file was
  opened and viewed directly, not trusted from its filename:
  - `pubmed.png`: blue "PubMed.gov" wordmark with the open-book mark,
    the official NLM lockup.
  - `elsevier.png`: gray Elzevir tree mark ("Non Solus" banner) plus
    orange "ELSEVIER" wordmark, the real lockup.
  - `scopus.png`: orange "Scopus" wordmark with registered mark.
  - `sciencedirect-icon.png`: orange SD favicon mark on transparent
    background, ScienceDirect's own compact mark (same 32x32 file as
    v9, 504 bytes). Both new components render exactly these four
    files (wordmarks at 24px tall desktop / 17px tall mobile, SD icon
    at 28px / 17px), with `object-fit: contain`, so nothing is
    stretched, cropped, or redrawn. No text wordmark substitute and
    no redrawn imitation exists anywhere in the new code. Alt texts
    are exactly "PubMed logo", "Elsevier logo", "Scopus logo",
    "ScienceDirect logo".
- **Endorsement/indexing wording: PASS, 0 in rendered text.**
  Grep over all of `src/` for "indexed in", "affiliated", "partner",
  "endorsed", "featured in", "as seen in", "approved by" returns 0
  hits. (During the check window the only hit was the prohibition
  comment in the old DbStackCard header; that file is now deleted,
  so even the comment is gone.)
- **Badge/seal/checkmark treatment: PASS, none.** Grep for badge,
  seal, checkmark, check glyphs, links, href, onClick, and button
  across both new files returns 0. Tiles are plain white rounded
  boxes (border + shadow only) with no added marks, no links, and
  no hover actions. A failed image hides its tile via onError; there
  is no broken-image icon and no text fallback.
- **DbStackCard and LogoTiles removal: PASS, complete.** Git status
  shows both files deleted (`D`), Hero.tsx no longer imports either,
  and the `dbstack` collage item is gone. The only remaining
  "LogoTile" string in `src/` is `DbLogoTile`, the new internal
  component inside DbLogoRow.tsx that renders real logo images; it
  is not a reference to the deleted v9 files. Do not let a future
  naive grep for "LogoTile" confuse the two.
- **FAERS homepage rule: PASS, intact.** FaersCard still shows only
  "N = 6,601" plus the 7,519 to 6,601 report flow; PosterWindow still
  shows "N = 6,601" as its only number. No effect values, confidence
  intervals, p-values, or event-case counts appear in either new
  file or in the Hero v10 edits. (A grep for effect-value terms
  matched only the substring inside the identifier "onError", not
  any value.) No unverified FAERS value is printed in this report.
- **Invented content: PASS, none.** The new files and the Hero v10
  edits add no journal names, DOIs, author lists, institutions, or
  factual claims of any kind: only brand names, the word "logo" in
  alt text, and positioning values. All other hero copy is
  pre-existing and unchanged by v10.
- **Em dash: PASS, 0** in DbLogoFloat.tsx, DbLogoRow.tsx, and
  Hero.tsx by grep.
- **Endorsement implication of free placement: PASS, none added.**
  The logos carry no claim text, no links, no headings, and no
  "trusted by" / client-row framing. They sit inside the collage
  layer, which is aria-hidden and pointer-dead, among other purely
  decorative floating mockups (app icons, browser windows, stickers)
  in the reference style. Nothing about the placement asserts that
  the author is affiliated with, endorsed by, or indexed in any of
  these databases. The removed "search tools" label was clarifying,
  not load-bearing: its absence does not create a claim, it just
  removes an explanation, which is what the user directed.

## Gap list

No blocking gaps. No code fix is owed on accuracy grounds.

## Observations (non-blocking, for the parent / visual QA)

- **O1 (SD identifiability context is thinner than v9).** In v9 the
  SD monogram sat inside a labeled card ("WHERE THE EVIDENCE IS
  SEARCHED" / "Search tools for systematic reviews"), which told a
  viewer what the mark was. Free-floating, it relies on the
  neighboring wordmarks and its alt text. The artwork itself is
  genuine and legible at display size, so this is not an accuracy
  failure, but whether the mark reads clearly in the real collage
  should be confirmed on the live preview.
- **O2 (Elsevier provenance caveat, carried unchanged from v9).**
  The Elsevier file is the official artwork vector from the
  logotyp.us library, not an official press-kit download (no current
  Elsevier logo file exists on Commons; elsevier.com serves its
  header logo as inline SVG). Artwork verified visually twice in v9
  and re-verified here. Documented in `docs/logo-sources.md`, not
  laundered.
- **O3 (unrendered wordmark file).** `public/logos/sciencedirect.png`
  (the full horizontal wordmark) remains on disk but is rendered by
  neither new component; both use `sciencedirect-icon.png`. It is
  provenance only, not dead rendered code, and adds no claim.
  Removing it is optional cleanup, not an accuracy fix.

## Limits and what is still owed

Code inspection plus direct file viewing only; no live browser
check was possible from the sandbox. Still owed via the Netlify
preview, as in every round: the free-floating logos in real collage
context (especially the SD mark per O1), the mobile logo row, and
confirmation that no floating logo reads as an affiliation claim in
situ. No build was run, per the brief.
