# Integration: one nav mode per viewport (nav-symmetry round)

Base HEAD `0384060` (nav-cleanup push). All three QA verdicts are SHIP
with no code blocker: 05-portrait SHIP, 06-landscape SHIP,
07-regression CONDITIONAL SHIP (disclosure-only: the concurrent
unrelated `Quote.tsx` edit, excluded from this commit per section 6).
No redesign, no rule change beyond the fixer's one rule + one comment.

## What was integrated

Fixer (`04-fix.md`): exactly synthesis section 10's change list, in
`src/components/Header.tsx`, style block only. Inside the existing
`@media (max-width: 720px)` block:

```diff
-  .onlines-nav { display: none; }
+  /* !important required because display is set inline below. */
+  .onlines-nav { display: none !important; }
```

Measured diff: 1 file, 2 insertions, 1 deletion, one hunk
(`@@ -74,7 +74,8 @@`). The nav's inline `display: flex` is unchanged;
`!important` overrides it at `<=720px` only, and at `>=721px` the
inline row renders exactly as before. No JSX, inline-style, or
other-rule change; hamburger button, mobile panel, seam-reset effect,
viewport meta, and `App.tsx` untouched.

## QA verdicts

- **05-portrait SHIP:** cascade fix verified (`!important` beats
  normal inline style regardless of selector or order); phone
  portrait 320/390/430 closed ~109px / open ~374px, hamburger only,
  zero inline links, 6 menu rows in `NAV_LINKS` order, 24px insets,
  no horizontal scroll at 320px; tablet portrait 768/834 inline-only,
  ~83/~84px, 14/20 vs 15/24, ~44px taps; zero effect at `>=721px`;
  symmetry (balanced insets, centered rhythm, even rows, no
  truncation) PASS.
- **06-landscape SHIP:** phone landscape closed/open 667x375 and
  720x360 (hamburger only, ~109/~374px, close via link/Escape/button,
  in-flow scrolling); inline 736x414/844x390/932x430 (single row, no
  truncation, ~83/~84px, ~44px taps); tablet landscape 1024x768/
  1180x820 (single row, ~84px, symmetric margins); desktop
  1280x720/1440x900 (single row, ~65px, symmetric margins); all
  three seams PASS on both sides; header-level overflow PASS at
  every listed width.
- **07-regression CONDITIONAL SHIP (disclosure-only):** diff exactly
  synthesis section 10; every `>=721px` item content-identical to
  base (safety band, tap block, inline nav style, `>=721px` hides,
  seam-reset effect); `NAV_LINKS`, logo, motif, reduced-motion kill,
  container, hamburger/panel rules and menu behavior intact;
  nav-cleanup deletions intact; build PASS; em dash 0; FAERS N/A.

## Build and hygiene (re-run by integration)

- Build: PASS, vite built in 7.47s (tsc + vite). `dist/` gitignored,
  working tree unchanged by the build.
- Em dash in the Header.tsx diff: 0.
- Greps over `src/`: "Start a conversation" 0, `onlines-cta-spacer`
  0, `hdr-cta-pulse` 0, `hdr-cta-glow` 0, `secondaryCta` 0.
  Over-deletion check: `primaryCta` still present (field
  `content.ts:36`, value `:153`, "See the research").
- FAERS masked check: NOT applicable. The diff touches Header.tsx
  only; no FAERS data file or value was modified.

## Commit and push

This doc is written BEFORE committing so it is included in the
commit; a doc cannot contain its own commit's hash, so the commit
hash and the local-vs-remote HEAD verification live in the
integration report to the parent. Push target: `doctorcorelabs/
portfolionew` main, via ssh.github.com:443 with the working proxy
pattern. Staging used explicit paths only
(`git add src/components/Header.tsx docs/nav-symmetry/`) and was
verified with `git status` and `git diff --cached --stat` before
committing.

## Concurrent-work exclusion (section 6 of 07-regression, honored)

The working tree also contains `M src/sections/Quote.tsx` (the
clinical-clerkship manifesto narrative from a separate user text
task) and untracked `docs/manifesto-narrative/`. NEITHER was staged
or committed here. They belong to a separate task and their push is
separately gated on the user's wording approval. This commit contains
only `src/components/Header.tsx` plus `docs/nav-symmetry/` (00-08).

## Disclosures for the final report (do not drop)

(a) **Root cause and the one-line fix.** The nav element carries
inline `display: flex`, which beats any non-`!important`
stylesheet rule regardless of selector or order, so the `<=720px`
hide rule never applied and mobile showed BOTH the truncated inline
nav and the hamburger row. Adding `!important` to the hide rule
makes it apply. This is the FIRST time the `<=720px` hide has ever
applied: nav-cleanup's mobile analysis assumed it applied but it
never did; the defect predates nav-cleanup (present at `d05a71c`
and `3ceb140`) and nav-cleanup only changed the symptom, from
wrapped rows to one overflowing row (`wrap` -> `nowrap`). What
STANDS from nav-cleanup: CTA deletion, single-row `>=721px`,
safety band, tap block, mobile menu improvements, all on
unaffected code paths.

(b) **Governing rule.** Exactly one nav mode per viewport at every
width: inline OR hamburger, never both, never neither, never a
truncated inline row. `<=720px`: hamburger button row (+ stacked
menu when open), inline fully absent. `>=721px`: inline single row,
hamburger + menu fully absent (CSS hide + matchMedia seam reset).

(c) **Portrait and landscape.** Phone portrait 320-430: hamburger
only, closed ~109px, open ~374px. Tablet portrait 768-834: inline
single row, ~83/~84px. Phone landscape 667-720: hamburger
(~109/~374px); 721-932: inline single row (~83/~84px). Tablet
landscape 1024-1180: inline ~84px. Desktop 1280+: inline ~65px.
Tap boxes ~44px at 721-1160 (realized ~41-45px by fallback
line-height, values exactly per spec).

(d) **Symmetrical means** balanced 24px insets on every row (logo,
"Menu", and menu links all start at the same 24px left inset;
above 1160px the container is auto-centered with equal margins),
centered vertical rhythm (every row centers its content, 20px
container padding top/bottom), even 44px rows and 1px `#e0e0e0`
hairlines, no truncation or drift. NOT a mirrored layout:
logo-left / nav-right and logo-row-over-menu are the intended
Onlines asymmetry and stay.

(e) **Proportion verdicts, no header shrinking within tidy scope.**
Phone landscape closed ~29-30% and inline 20-22% of short viewport
height are heavy but INHERENT: the 44px button is the touch floor,
the ~65px logo row is the shared container rhythm, the header is
not sticky (so the cost lasts only until scroll). Phone landscape
open ~100% is a transient menu state: the open menu IS the content
while open. Phone portrait open 40.1-65.8% is user-invoked, in
flow, dismissed by tap, Escape, or link tap. Tablet landscape
~10-11% and desktop ~7-9% are proportional.

(f) **Seams are band changes, not defects.** 720/721: hamburger ->
inline single row, height step 109 -> 83, exactly one mode each
side. 800/801: safety -> standard (14/20 -> 15/24), slack
127-144 -> 82-99, still positive, no wrap, header ~83 -> ~84.
1160/1161: tap block ends, header ~84 -> ~65 (19px step), no
horizontal shift (container capped at 1160, inner 1112).

(g) **Live-preview checks owed (sandbox cannot render).**
Phone-portrait eyeball of the fixed layout (hamburger only, no
inline row); thin zone 721-730; 720/721 seam on both sides;
page-level horizontal scroll at 667 and 720 landscape widths
(QA verified header geometry only; page-level `scrollWidth` also
depends on hero and section content, which this round did not
re-audit).

(h) **Concurrent-work note.** `src/sections/Quote.tsx` (manifesto
narrative) was deliberately EXCLUDED from this commit; it belongs
to a separate user text task and its push is separately gated on
the user's wording approval.
