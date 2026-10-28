# Cascade analysis: inline nav visible on mobile (nav-symmetry round)

Base HEAD `0384060` verified. `src/components/Header.tsx` read in full (style block + JSX + inline styles); `index.html` and `src/App.tsx` checked.

## Verdict: lead CONFIRMED

The `<=720px` stylesheet hide rule for the inline nav never applies, because the nav element carries an inline `display: flex` that beats it. On mobile portrait the page therefore shows BOTH the desktop inline nav row (overflowing, truncated at the right edge) AND the hamburger row below it, exactly as in the user screenshot.

## The conflict, exactly

| Side | Location | Rule |
|---|---|---|
| Inline (wins) | `Header.tsx:184-191`, `<nav aria-label="Primary" className="onlines-nav">` | `display: "flex"`, `alignItems: "center"`, `columnGap: 24`, `flexWrap: "nowrap"`, `justifyContent: "flex-end"` |
| Stylesheet (loses) | `Header.tsx:76-77`, inside `@media (max-width: 720px)` | `.onlines-nav { display: none; }` |

CSS specificity decides it: an inline style beats any non-`!important` stylesheet rule regardless of selector or source order. The hide rule is specificity 0,1,0; the inline style wins unconditionally. No `!important` on the hide rule, no conditional rendering on the nav, so nothing else rescues it.

## Why the screenshot looks exactly like that

1. The nav stays `display: flex` at every width, including `<=720px`.
2. The nav-cleanup round changed its inline `flexWrap` from `"wrap"` to `"nowrap"`, so the 6 links (about 510px at 15px plus gaps) plus the nowrap logo (about 137px) plus 48px padding plus 24px gap cannot compress on a roughly 390px portrait phone. The row overflows past the right edge instead of wrapping, truncating the last visible link to "Experien" at the edge.
3. The hamburger button is a separate row inside `<header>` after the logo-row div, shown by its own stylesheet rule at `<=720px` (see below), so it renders below the leaked nav row. The mobile menu panel itself is closed in the screenshot, so only the two rows show.

## Timeline: the defect predates nav-cleanup

Inline `display: "flex"` on the nav is present at `3ceb140` (nav-cleanup base) AND at `d05a71c` (pre-cleanup). The cascade defect is therefore old; nav-cleanup only changed the mobile symptom from wrapped rows to a single overflowing row (wrap to nowrap). Correction to the nav-cleanup record: its mobile analysis assumed the `<=720px` hide rule applied. It never did.

## Ruled-out hypotheses (with evidence)

| Hypothesis | Verdict | Evidence |
|---|---|---|
| Viewport meta missing/wrong | REFUTED | `index.html:5`: `<meta name="viewport" content="width=device-width, initial-scale=1.0" />`, the correct standard value |
| Duplicate header rendered | REFUTED | `src/App.tsx:4` imports `Header` once, `:314` renders `<Header />` once; grep for `<Header` across `src/` returns only that one render; header sits in normal flow outside `<Routes>` |

## Sweep: every other inline-display vs stylesheet-hide pair in Header.tsx

Only ONE conflict exists. All other elements checked:

| Element | Inline display? | Stylesheet hide/show rule? | Conflict? |
|---|---|---|---|
| Primary nav `.onlines-nav` | Yes: `display: "flex"` (:186) | Yes: `display: none` at `<=720px` (:77) | YES, the bug |
| Logo link `.hdr-logo` | No (font/weight/spacing/color only) | No hide rule (font-size rule only) | No |
| Nav links `.hdr-nav-link` | No (font/color only) | No hide rule (hover/padding/safety-band `font-size !important` only) | No |
| `<header>` element | No (background/border only) | No | No |
| Logo-row div | Yes: `display: "flex"` (:162) | No rule targets it (it has no class) | No; on mobile it becomes the logo-only row once the nav hides, which is the intended layout |
| Hamburger button `.hdr-menu-btn` | No inline style on the button itself | Base `display: none` (:70-72); `display: flex` at `<=720px` (:78); `display: none` at `>=721px` (:127) | No; show/hide works |
| Hamburger icon spans | Yes: wrapper `display: "flex"`, bars `display: "block"` (:219-223) | No rule targets them | No |
| Mobile panel `.hdr-mobile-nav` | No inline style | Base `display: none` (:73-75); `display: block` at `<=720px` (:99); `display: none` at `>=721px` (:128) | No; show/hide works, and the panel is additionally unmounted when closed (`{menuOpen && ...}` at :227) |
| Mobile links `.hdr-mobile-link` | No inline style | `display: flex` at `<=720px` only | No |

Note the asymmetry that proves the mechanism: the hamburger and the panel obey their stylesheet show/hide rules precisely because they carry no inline `display`. The nav disobeys its hide rule precisely because it does.

## Fix approach: recommendation

**Recommend (a): add `!important` to the `<=720px` nav hide rule.**

```css
@media (max-width: 720px) {
  .onlines-nav { display: none !important; }
}
```

Add the same style of explanatory comment the safety band already carries ("`!important` required because display is set inline below").

| Option | Change size | Why it wins / loses |
|---|---|---|
| (a) `!important` on the hide rule | One word, media-scoped | RECOMMENDED. Smallest diff; zero effect at `>=721px` (the rule only exists inside the `<=720px` block); zero placement risk (`!important` beats inline regardless of source order); consistent with the safety-band precedent in the same file, where `!important` already overrides inline font-size/gap for exactly this reason. Cost: one more `!important` in the cascade, which is honest about this file's inline-style reality. |
| (b) Remove `display` from the nav inline style, add a stylesheet base `.onlines-nav { display: flex; }` | Medium | Cleaner cascade in principle, but carries a placement footgun: same-specificity rules resolve by source order, so the base rule must sit BEFORE the `<=720px` block or it re-breaks the hide. Also note the task brief's warning is exact: removing inline `display` WITHOUT a stylesheet base flex rule would stack the links vertically. Viable as a later stylesheet refactor, not the minimal fix. |
| (c) Conditionally render the nav only at `>=721px` via matchMedia | Largest | Rejected. Duplicates the CSS breakpoint in JS, adds a second matchMedia subscription, risks a flash of the wrong nav on mount/resize, and fixes a one-line cascade bug with render logic. |

What the fix does NOT change: nothing at `>=721px` (media-scoped); the hamburger button, the mobile panel, and the seam-reset effect are untouched because they already work; no viewport-meta or `App.tsx` change is needed (both hypotheses refuted).

## Portrait / landscape note (mechanism only; layout values belong to other analysts)

- Portrait phone (`<=720px` wide): the broken case. After fix (a), the logo row holds only the logo and the hamburger row below it, as designed.
- Landscape phone wider than 720px: in the tablet band, where the inline nav is legitimately shown as a single row per the nav-cleanup round; not affected by this bug.
- Landscape phone `<=720px` wide (small/older phones): hits the same bug as portrait and is fixed by the same one-line change.
