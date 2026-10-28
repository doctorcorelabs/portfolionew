# Integration: nav cleanup (CTA removal + tidy nav bar)

Base: HEAD `3ceb140` (cursor-motion push). Spec:
`docs/nav-cleanup/00-synthesis.md`. Fixer note: `04-fix.md`. QA:
`05-layout-desktop.md`, `06-layout-mobile.md`, `07-regression.md`
(all SHIP, no blockers). This doc is written BEFORE committing, so
it cannot contain its own commit's hash (a doc cannot contain the
hash of the commit that contains it); the hash and the remote
verification live in the integration report delivered with the
push, and the parent's final report carries them.

## 1. What was integrated

Fixer implementation in `src/components/Header.tsx` +
`src/data/content.ts` only, exactly per spec, plus three
QA-accepted notes (all verified by QA-regression):

- Deletions: fixed CTA anchor (mailto pill, "Start a
  conversation", `hdr-cta-pulse`), 200px spacer div,
  `.hdr-cta-pulse` rules, `@keyframes hdr-cta-glow` + comment,
  reduced-motion pulse `animation: none` (nav-link
  `transition: none` kept), whole `@media (max-width: 400px)`
  block (logo returns to 20px at all widths), spacer-hide line
  only (rest of the 720px block stays), nav `flexWrap: "wrap"`
  to `"nowrap"`, `rowGap: 8` dropped, `secondaryCta` field
  (`content.ts:37`) + value (`:155`) deleted.
- New/changed: tap-target block `@media (min-width: 721px)
  and (max-width: 1160px)` (`.onlines-nav a.hdr-nav-link {
  padding: 12px 0 13px; background-position:
  0 calc(100% - 10px); }`, box ~44px, underline 3px below
  text); safety band `@media (min-width: 721px) and
  (max-width: 800px)` (links `font-size: 14px !important`,
  `.onlines-nav { column-gap: 20px !important; }`);
  mobile separators (1px `#e0e0e0` border-top on each
  `.hdr-mobile-link` except the first), mobile hover color
  `#0859D4`, mobile focus-visible 2px `#0859D4` outline
  offset -2px, Menu/Close label swap, Escape closes when open
  (listener only when open, cleanup on close/unmount),
  `matchMedia` seam reset (clears `menuOpen` above 720px,
  cleanup on unmount), `useEffect` added to the import.
  Close-on-link-click, button toggle, no scroll lock, no
  animation all kept.
- Fixer notes, all QA-accepted: (a) `EMAIL` const deleted,
  FORCED (`tsc --noEmit` + `noUnusedLocals: true`; the const
  was used only by the deleted CTA anchor; the address
  survives in `content.ts` `profile.email` and in
  Contact/Footer/Profile). (b) Safety band `!important`
  REQUIRED (nav font size and gap are set inline; without
  it the 721-800 block would have zero effect; values
  exactly per spec). (c) Two extra comment-only rewords
  (sizes comment, menu-button comment) citing the deleted
  CTA; zero rule change.

## 2. Diff stat (measured by integration, not copied)

`git status`: only `M src/components/Header.tsx` +
`M src/data/content.ts` + untracked `docs/nav-cleanup/`.
`git diff --stat`: 2 files, 51 insertions, 71 deletions.
Header: 51 insertions / 69 deletions (120 changed lines).
content.ts: 0 insertions / 2 deletions. This confirms
QA-regression's 51/71 total; the fixer's "+49/-69 for
Header.tsx" was off by 2 insertions. No other file touched:
`App.tsx`, `Hero`, `Contact`, `Footer`, `Profile` absent
from status and diff.

## 3. QA verdicts (all SHIP, no blockers)

- 05-layout-desktop: single row >= 721 at every width
  (safety-band slack 48-65px nominal at W=721; 82-99px at
  801+; 441-458px at 1160); tap block replaces (not
  duplicates) the old 721-1023 block, coverage 721-1160;
  header heights match the spec table; seam 720/721 PASS;
  CTA removal on desktop/tablet PASS.
- 06-layout-mobile: fixed pill gone at every width (no
  `position: fixed` remains in the header); hamburger +
  stacked in-flow menu kept; all menu improvements verified
  in code; seam reset PASS (open, widen, narrow back =
  closed); tap targets PASS (button 44px, links 44px,
  logo ~25px accepted); header heights exact under
  border-box (~109px closed, ~374px open); 320px
  no-overflow PASS.
- 07-regression: diff exactly spec-allowed; deletion
  completeness all 0; over-deletion checks all PASS
  (`primaryCta` field :36 + value :153 present, `profile`
  object kept, email-address mailto links untouched,
  Contact body copy untouched, Hero untouched, `App.tsx`
  header placement untouched); retained rules verified in
  the current file; build PASS.

## 4. Build + hygiene (re-run by integration)

- `npm run build` (tsc + vite): PASS, vite built in 9.14s.
  (Fixer reported 7.54s; QA-regression 8.26s vite; variance
  is machine timing, not a code difference.)
- Em dash in diff: 0.
- Greps over `src/`: "Start a conversation" 0;
  `onlines-cta-spacer` 0; `hdr-cta-pulse` 0; `hdr-cta-glow`
  0; `secondaryCta` 0.
- Over-deletion check: `primaryCta` still present (field
  `content.ts:36`, value `:153`, "See the research").
- FAERS masked check: NOT applicable. Basis: the diff
  touches Header + content only; no FAERS data file or
  value was modified.
- `git status` unchanged after build (dist gitignored).

## 5. Commit + push

Commit message (established style, short summary):
"Remove Start a conversation CTA and tidy header nav on all
devices". Identity: `-c user.name="Muse" -c
user.email="muse@daivanlabs.local"`. Files: `Header.tsx`,
`content.ts`, `docs/nav-cleanup/` (all 9 files: 00-08).
Push: `doctorcorelabs/portfolionew` main via
`ssh://git@ssh.github.com:443/doctorcorelabs/portfolionew.git`
with the proxy pattern (ssh.github.com:443, never port 22).
Remote HEAD == local HEAD verified via `git ls-remote`
after push; both hashes are in the integration report
delivered with the push. No retry was needed unless the
report says otherwise; no history rewritten; no force-push.

## 6. Disclosure list for the final report (do not drop)

(a) The fixed pill is gone from every viewport and every
route: it floated at top-right on all routes and all
widths, over scrolled content on mobile too. The
screenshot's overlap class (opaque fixed element over
the first nav row) is gone, not just patched.
(b) Nav is a single row at every width >= 721 (no more
2-row wrap on tablets); small tablets 721-800 get
slightly smaller links (14px, gap 20) as a safety band;
801+ keeps 15px/24px.
(c) Tablet header gets taller where tap targets grew:
721-1160 now ~83-84px (was ~78px at 721-1023, ~65px at
1024-1160); desktop 1161+ stays ~65px.
(d) Tablet tap targets fixed: ~44px across 721-1160
(was ~38px at 721-1023 and ~22px at 1024-1160; realized
box is ~41-45px depending on the fallback font's normal
line-height, values exactly per spec).
(e) Mobile menu tidied: separators between links, focus
outlines, hover color, Menu/Close label, Escape closes,
no stale reopen after widening; logo returns to 20px on
narrow phones (was 18px at <= 400px); mobile header
~109px closed / ~374px open.
(f) Accepted residuals: thin slack at 721-730 under
worst-case system fonts - REFINED by QA-layout-desktop:
the spec's ~2px at 10% widening is a content-box
exceedance at exactly W=721 absorbed invisibly by the
24px right padding (still 22px from the viewport edge);
true visible clipping needs ~15%+ widening; with nowrap
any extreme overflow becomes padding absorption, never
a wrap; preview check owed, and any future fix is a
band adjustment (e.g. gap 20 to 18), never a hamburger;
logo tap box ~25px stays below 44px (accepted, above
the 24px WCAG minimum); no focus move on open, no
outside-click close (scope kept to tidy).
(g) Unchanged: `NAV_LINKS`, email-address contact links
(Contact, Footer, Profile), Hero, `primaryCta` dead data
(still present, still unrendered - a dead-data sweep is
a separate decision), reduced-motion behavior for links.
(h) Live-preview checks owed: single row at 721-730
(thin-slack zone), tablet tap targets, mobile menu
open/close/Escape/seam-reset, 320px no-overflow, header
heights per band.
