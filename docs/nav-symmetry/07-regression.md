# QA-Regression: nav-symmetry round

**Verdict: CONDITIONAL SHIP** (one disclosure-only item, section 6; no code
blocker in the nav-symmetry change itself). Read-only except the build:
no source edited, no push. Base HEAD `0384060` verified.

## 1. Diff scope (measured by me, not copied)

- `git status` at first check: only `M src/components/Header.tsx` plus
  untracked `docs/nav-symmetry/`.
- `git diff --stat`: 1 file, 2 insertions, 1 deletion.
- `git diff` shows exactly ONE hunk (`@@ -74,7 +74,8 @@`), inside the
  existing `@media (max-width: 720px)` block:
  `.onlines-nav { display: none; }` becomes a comment
  (`!important required because display is set inline below.`) plus
  `.onlines-nav { display: none !important; }`.
- That is precisely synthesis section 10's one rule + one comment.
  No additional rule, JSX, or inline-style change exists in the
  Header.tsx diff. The diff contains `important` exactly twice (the
  comment word + the rule); no other `!important` was added.

## 2. No behavior change at >=721px

Verified in the current file AND against base
(`git show HEAD:src/components/Header.tsx`): every item below is
content-identical to base, shifted by exactly +1 line from the inserted
comment line (the base-vs-current grep diff shows only line numbers
differing, zero content differences).

- Safety band, 721-800: links `font-size: 14px !important`,
  `column-gap: 20px !important`.
- Tap block, 721-1160: links `padding: 12px 0 13px`,
  `background-position: 0 calc(100% - 10px)`.
- Inline nav style object: `display: "flex"`,
  `alignItems: "center"`, `columnGap: 24`, `flexWrap: "nowrap"`,
  `justifyContent: "flex-end"` (unchanged; `!important` overrides it
  at `<=720px` only).
- `>=721px` hide rules: `.hdr-menu-btn { display: none; }` and
  `.hdr-mobile-nav { display: none; }` intact.
- matchMedia seam-reset effect intact: queries `(min-width: 721px)`,
  runs `onChange()` on mount, clears `menuOpen` when matched, listener
  with cleanup on unmount.

## 3. Retained and intact

- `NAV_LINKS` exact, in order: Research `/research`, Awards `/awards`,
  Experience `/experience`, Education `/education`, Certifications
  `/certifications`, Contact `/#contact`.
- Logo: 20px, weight 700, letter-spacing `-0.02em`, nowrap.
- Dotted-underline hover motif (`repeating-linear-gradient`) plus
  focus-visible intact.
- Reduced motion: nav-link `transition: none` intact; no orphan pulse
  rule (pulse died with nav-cleanup).
- Container: `maxWidth: 1160`, `padding: "20px 24px"`,
  `justifyContent: "space-between"`, `gap: 24`; header bottom border
  `1px solid` hairline.
- Hamburger button + mobile panel rules and menu behavior: panel
  `display: block` with top hairline at `<=720px`; link rows 44px,
  `padding: 0 24px`; separators between links; hover blue;
  focus-visible 2px blue outline, offset -2px; Menu/Close label swap;
  Escape closes (listener only when open, cleanup present);
  close-on-link-click (`onClick={() => setMenuOpen(false)}`);
  conditional render (`{menuOpen && ...}`, unmounted when closed);
  no scroll lock mechanism and no menu animation in code.

## 4. Nav-cleanup deletions still intact (greps over src/)

"Start a conversation" 0; `onlines-cta-spacer` 0; `hdr-cta-pulse` 0;
`hdr-cta-glow` 0; `secondaryCta` 0. Over-deletion check:
`primaryCta` still present (field `content.ts:36`, value `:153`,
"See the research").

## 5. Build and hygiene

- Build re-run by me: PASS, vite built in 12.80s (tsc + vite).
  The fixer previously reported PASS in 8.50s on the clean tree; the
  Header.tsx change is stylesheet-only and cannot affect compilation,
  so the PASS stands on either tree (see timing note in section 6).
- `dist/` never appears in `git status` (gitignored).
- Em dash in the Header.tsx diff: 0.
- FAERS masked check: NOT applicable. The nav-symmetry diff touches
  Header.tsx only; no FAERS data file or value was modified.

## 6. Disclosure-only item: concurrent unrelated Quote.tsx edit

During my build window, `git status` gained a second modified file,
`M src/sections/Quote.tsx`, that was NOT present at my first check.
Evidence it is concurrent unrelated work, not part of this fix:

- Its diff rewrites the Quote section's word array and mission line to
  the clinical-clerkship narrative (clinical clerk in Indonesia,
  new knowledge, diverse experiences; aiming to enhance health
  standards, sustainable change, lasting positive impacts; founded
  DaivanLabs on CodeCureConnect). That matches a separate user text
  request, not any nav item. It touches no nav rule, link, or header
  code.
- File mtimes: `Header.tsx` 02:38:00 UTC (the fixer), `Quote.tsx`
  02:40:27 UTC (after my first clean status check, inside my build
  window). A vite build does not edit source files.
- The nav-symmetry verdict above is unaffected: the Header.tsx diff
  is still exactly one hunk, and every section 2-5 check was run
  against Header.tsx and base, not against Quote.tsx.

**Condition for integration:** commit ONLY `src/components/Header.tsx`
plus `docs/nav-symmetry/` for this round. Do NOT sweep `Quote.tsx`
into the nav-symmetry commit; it belongs to its own in-flight task
and may still be edited there. If integration uses a broad add, it
must exclude `Quote.tsx` explicitly.

## Out of scope for this QA (other agents own it)

Portrait/landscape rendering checks, single-row fit math at 721-730,
menu open/close/Escape/seam behavior in a live browser, and any live
render (the sandbox cannot render). Preview check owed: phone-portrait
eyeball of the fixed layout (hamburger only, no inline row) plus the
thin zone 721-730.
