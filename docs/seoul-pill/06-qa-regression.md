# QA regression: Seoul-chip vs CFC-pill fix

Base: HEAD `5fd1ccf` + fixer change (uncommitted). Verified by diff
and grep, not by trusting the fixer. No source file edited by QA.

## Verdict: SHIP

The diff is exactly the specified rule and nothing else. No blocker.
One optional parent follow-up (comment-only, zero behavior): the
stale laptop-rule comment, see item 6.

## 1. Diff: exactly 1 hunk, 9 insertions, 0 deletions

`git status`: only `M src/sections/Hero.tsx` plus untracked
`docs/seoul-pill/`. `git diff --stat`: 1 file, 9 insertions.
Hunk count: 1. Added lines, complete (old lines 1507-1515):

```css
/* CFC pill wide position (Seoul-chip vs CFC-pill fix):
   above 1400px only; laptop (bottom 45%) and tablet
   (right 40%/30%) untouched by construction. */
@media (min-width: 1401px) {
  .mv-diorama-pill-cfc {
    bottom: 15% !important;
    right: 5% !important;
  }
}
```

Zero deletions anywhere. Every added line sits inside the
`min-width: 1401px` block. No rule outside 1401+ changed, by
construction of the diff itself. Em dash in diff: 0.

## 2. Laptop pill byte-identical; word-tail finding unchanged, open

- The laptop rule (`@media (min-width: 1161px) and
  (max-width: 1400px)`, `.mv-diorama-pill-cfc`, `bottom: 45%
  !important`) appears as unchanged context directly above the
  new hunk. No laptop line added, deleted, or modified.
- The laptop pill-vs-word finding is therefore UNCHANGED and
  still open as its own follow-up (OUT OF SCOPE, NOT fixed
  here): bottom 45% puts the pill at y [0.55S-25, 0.55S],
  fully inside the glyph y-band at every S, covering the s
  column nearly fully plus part of the period. The new rule
  cannot touch it: its scope is disjoint from 1161-1400.
- FACT_PILLS inline CFC style untouched: `bottom: "30%",
  right: "14%"`. The new rule beats it only above 1400
  (both properties `!important`, as required).

## 3. Tablet shows, strip hides, touch hide, 900px hide intact

All in untouched regions (outside the single hunk):

| Mechanism | Location | State |
|---|---|---|
| Tablet CFC show, 768-1000 | `.mv-diorama-pill.mv-diorama-pill-cfc`, `display: block`, `right: 40% !important` | Intact |
| Tablet CFC show, 1024-1160 | Same selector, `display: block`, `right: 30% !important` | Intact |
| 1001-1023 strip | `@media (min-width: 1001px) and (max-width: 1023px)` + strip hide rule (720-767 / 1001-1023) | Intact |
| Touch hide | `@media (hover: none)`, `.mv-diorama-pill { display: none }` | Intact |
| 900px hide | `@media (max-width: 900px)`, `.mv-diorama-pill { display: none }` | Intact |
| Reduced-motion pill hide | `@media (prefers-reduced-motion: reduce)`, all three pill classes `display: none` | Intact |
| Reduced-motion animation kill | Same media query, chip + pill `animation: none !important` | Intact |
| FAERS pill gates | Tablet 1091px shows (768-1000, 1024-1160), desktop gate rule, reduced-motion hide | Intact |

The new rule is position-only (no `display`), so it cannot
interfere with any hide/show mechanism even in principle.

## 4. Untouched by grep

Single-hunk diff already proves byte-identity, confirmed by
grep presence at shipped values:

| Item | Shipped value, present and unmodified |
|---|---|
| Seoul base | `CURSOR_CHIPS`: anchorX 0.80, anchorY 0.695, radius 20, duration 15, phase 0.8 |
| Seoul laptop companion | Loop `Seoul && laptopMql -> 0.70` + CSS `right: 30%` (1161-1400) |
| TABLET_ANCHORS Seoul | 0.59/0.67 narrow, 0.59/0.685 wide, 0.52/0.78 landscape |
| MINI_CURSOR_CHIPS | Present, overrides untouched (miniature cannot match a 1401px rule anyway) |
| Other chips | FAERS (0.90, 0.90), SS base (0.505, 0.70) + companion, CFC chip: all untouched |
| Loop code | Durations 12/14/11/15, phases, radii, dart-dwell, converge tau 0.22, halo 20: untouched |
| H3 | Reduced-motion + 1161-1400 + max-height 680, Seoul hide: present |
| H4 | Reduced-motion + 1401-1600 + max-height 708, Seoul hide: present |
| H6 | Reduced-motion + 1401+ + max-height 824, Code for Cure hide: present |
| Gates | Notify, stickers, microscope, helix, Cochrane, FAERS pill: untouched |
| Other pills | Seoul pill (left 59% top 32%), FAERS pill (top 62% left 7%): untouched |

H-bands are `[data-chip]` rules; pills carry no `data-chip`,
so a pill move cannot interact with H3/H4/H6. No H-band
change was needed or made.

## 5. Seam, jump, reduced-motion story

- 719/720 seam: JS band checks (`min-width: 720px`) and CSS
  bands untouched; the new rule starts at 1401px, so it
  cannot match the seam or the miniature at any width.
- 1400/1401 jump: scopes exactly adjacent (laptop
  `max-width: 1400px`, new rule `min-width: 1401px`).
  No gap, no overlap. At 1400 the pill is bottom 45% /
  right 14%; at 1401 it is bottom 15% / right 5%. The jump
  is accepted: same class as the existing chip companion
  jumps (FAERS, SS, Seoul all jump across band edges).
- Reduced motion: pills hide under reduced motion, so the
  new position has ZERO reduced-motion effect. Rest =
  reduced-motion layout, and the pill is absent there.
  No H-band work needed. Correct as shipped.

## 6. Stale comment (comment-only, not a blocker)

The laptop rule's comment still says "Above 1400px the pill
stays at bottom 30% (status quo)". That sentence is now
false above 1400px (bottom 15% / right 5%). It is comment
text only: the rule itself (`bottom: 45% !important`,
1161-1400 scope) is correct and byte-identical. The fixer
left it per the "exactly one rule" spec. Optional parent
one-line comment fix; it must NOT gate shipment.

## Notes for the parent (not regressions)

- Synthesis QA item (d5) quoted converged Seoul x-separation
  >= 450px @1401; the fixer corrected this to 96.2px
  (SS 509.4, CFC 666.7). Seoul is still clear, doubly
  separated. Layout QA owns the converge numbers, not
  this regression pass.
- Live checks still owed (Netlify preview, same as every
  round): wide desktop 1401-1900 pill position, the
  1400/1401 jump, tablet + phone spot-check only.
