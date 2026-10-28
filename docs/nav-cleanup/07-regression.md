# QA regression: nav cleanup

Verdict: **SHIP**. No blockers, no conditions. The diff is exactly
what `00-synthesis.md` allows, plus two justified items (one forced
deletion, two comment-only rewords), each verified below. Read-only
except the build; no source edited, no push. Base HEAD `3ceb140`
verified.

## 1. Diff scope

| Check | Result |
|---|---|
| `git status` | Only `M src/components/Header.tsx` + `M src/data/content.ts` + untracked `docs/nav-cleanup/` |
| `git diff --stat` | 2 files, 51 insertions, 71 deletions (Header +120/-69 across 16 hunks per fixer note; content -2) |
| Other files | None. `App.tsx`, `Hero`, `Contact`, `Footer`, `Profile` untouched by construction (absent from `git status` and `git diff --name-only`) |
| Build | `npm run build` PASS, vite built in 8.26s (wall 19.68s incl. tsc); `git status` unchanged after build (dist gitignored) |

## 2. Deletions complete (all grep counts over `src/`)

| Item | Spec | Count |
|---|---|---|
| "Start a conversation" | Delete everywhere | 0 |
| `onlines-cta-spacer` | Delete div + hide line | 0 |
| `hdr-cta-pulse` | Delete rules + anchor | 0 |
| `hdr-cta-glow` | Delete keyframes + comment | 0 |
| `secondaryCta` | Delete field + value | 0 |
| Fixed CTA anchor (mailto pill) | Delete whole element | Gone (diff hunk, no remnant) |
| Spacer div (width 200) | Delete whole element | Gone |
| `@media (max-width: 400px)` block | Delete whole block + comment | Gone |
| Spacer-hide line | Delete line only | Gone; rest of the 720px block stays (`.onlines-nav` hide, `.hdr-menu-btn` flex, mobile links all context lines) |
| Nav `flexWrap: "wrap"` | Change to `"nowrap"` | Changed (:189); `rowGap: 8` dropped (moot under nowrap) |

## 3. Over-deletion checks (all PASS)

| Item | Result |
|---|---|
| `primaryCta` field + value | Still present: field `content.ts:36`, value `:153` ("See the research") |
| `profile` object | Kept; only the `secondaryCta` field (:37) and value (:155) removed |
| Email-address mailto links | Untouched (files unmodified): Contact `:411-415` (own EMAIL const), Footer `:129` (own EMAIL const), Profile `:440-444` (literal mailto) |
| Contact body copy (`Contact.tsx:406`) | Untouched (file unmodified) |
| Hero (no CTA by design) | Untouched (file unmodified) |
| `App.tsx` header placement | Untouched (file unmodified); Header still outside `<Routes>` |

## 4. Retained (all verified in current file, not just in diff context)

| Item | Evidence |
|---|---|
| NAV_LINKS order/labels/hrefs | Byte-identical list: Research `/research`, Awards `/awards`, Experience `/experience`, Education `/education`, Certifications `/certifications`, Contact `/#contact` |
| Logo | `.hdr-logo` 20px retained; the 18px <= 400px rule died with its block (20px at all widths) |
| Dotted-underline motif | Rule retained (:44-48, repeating-linear-gradient, 300ms hover/focus treatment) |
| Reduced-motion nav-link kill | `transition: none` retained (:58-60); pulse `animation: none` deleted WITH the pulse (no orphan) |
| Bottom border | `borderBottom: 1px solid ${HAIRLINE}` (:154, `#e0e0e0`) |
| >= 721px CSS hide | Belt-and-braces block retained: hamburger + mobile nav `display: none` |
| Row geometry | `maxWidth: 1160` (:159), `padding: "20px 24px"` (:161), `space-between` (:164), `gap: 24` (:165), `justifyContent: "flex-end"` (diff context) |
| Tap block (spec §1(2)) | `@media (min-width: 721px) and (max-width: 1160px)`, `padding: 12px 0 13px`, `background-position: 0 calc(100% - 10px)` (:132-136) |
| Safety band (spec §1(1)) | `@media (min-width: 721px) and (max-width: 800px)`, `font-size: 14px !important`, `column-gap: 20px !important` (:142-149) |
| Mobile menu additions (spec §1(4)) | Separators (`+ a.hdr-mobile-link` border-top), hover `#0859D4`, focus-visible 2px `#0859D4` offset -2px, Menu/Close swap, Escape effect (only when open, cleanup), matchMedia seam-reset effect (mount, cleanup), `useEffect` import |
| Menu behavior kept | Close-on-link-click, button toggle, no scroll lock, no animation |

## 5. Fixer notes requiring justification: all three check out

### (a) EMAIL const deleted: FORCED, correct

HEAD version used `EMAIL` exactly twice: declaration (`:8`) and
the deleted CTA anchor href (`:248`, `mailto:${EMAIL}`). Current
file: 0 occurrences. `package.json` build is
`tsc --noEmit -p tsconfig.json && vite build`, and `tsconfig.json`
sets `noUnusedLocals: true` with `noEmit: true`, so keeping the
const would fail the build. The address itself survives in
`content.ts` (`profile.email`, `:162`) and in Contact/Footer/
Profile (see §3). One dead const removed, zero behavior change.

### (b) Safety band `!important`: REQUIRED, values exact

Nav font size (15) and gap (24) are set INLINE: link `fontSize: 15`
(:200) and nav `columnGap: 24` (:188). A plain stylesheet rule
cannot override inline styles, so without `!important` the
721-800 block would have zero effect. The flagged values are
exactly per spec (14px, 20px). No conflict with the tap block,
which sets padding + background-position only.

### (c) Two extra comment rewords: COMMENT-ONLY, zero rule change

Beyond the two spec-named touch-ups (dotted-underline comment,
721-1023 comment replaced), the fixer reworded two more comments
that cited the deleted CTA. Verified from the diff hunks: the
sizes comment (now "Wordmark size lives here (not inline).
Desktop value unchanged: wordmark 20px.") leaves the `.hdr-logo`
rule untouched and the CTA rule deleted per spec; the menu-button
comment (now ends "under the logo row.") leaves the
`.hdr-menu-btn` rule untouched. No rule line changed in either
hunk. Acceptable under the spec's end state (no comment cites
CTA behavior).

## 6. Hygiene

Em dash in diff: 0. No other file modified. FAERS masked check:
not applicable (no FAERS data file or value touched; diff is
Header + content only).

## 7. Not covered by this QA (other agents own it)

Single-row rule math at 721-730 (thin-slack zone), tap-target
rendering, menu open/close/Escape/seam-reset behavior, focus
rendering, reduced-motion emulation, 320px no-overflow, and any
live render (sandbox cannot render). This QA covers diff scope,
deletion completeness, over-deletion, retained rules, and build
only, and all of those PASS.
