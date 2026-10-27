# 03 - Impact / insulation: laptop CFC pill vs word tail fix

Base: HEAD `d05a71c`, tree clean. Read-only; no source touched, no build, no push. Lines: Hero.tsx at base. Prior round: `docs/seoul-pill/`. Sizes: `docs/desktop-parks/03-card-boxes.md`.

## The park

Laptop CFC pill vs word tail, W 1161-1400 x all S. Pill 114x25, inline `bottom: 30%`, `right: 14%`, laptop override `bottom: 45% !important`: box y [0.55S-25, 0.55S], x [0.86W-114, 0.86W]. Glyph y-band [S/2-49.3, S/2+91.7] (envelope W/2 +-490): the pill sits FULLY inside it at every S ([277.5, 302.5] vs [225.7, 366.7] at S=550) and x-overlaps the ink at every laptop width (W<1678), covering the s column nearly fully plus part of the period. The pill paints above the word. Visible ONLY on hover-capable, non-reduced-motion desktops.

## 1. Rule stack for .mv-diorama-pill-cfc

- FACT_PILLS inline (227): bottom 30%, right 14% (base; loses to any `!important`).
- Laptop rule (1504), 1161-1400: bottom 45% `!important`; right stays inline 14%.
- Wide rule (1512, seoul-pill), 1401+: bottom 15%, right 5%, both `!important`; disjoint from laptop.
- Tablet shows (1605, 1620), 768-1000 / 1024-1160: display block, right 40% / 30% `!important`; bottom stays inline 30%.
- Hide rules, all pills: touch (1009), 900px (1026), strips 720-767 and 1001-1023 (1670), reduced-motion (1735).
- FAERS pill gates: FAERS class only; untouched by a CFC rule.

## 2. Scope traps for the fixer (all must hold)

- BOTH bounds required: scope EXACTLY `min-width: 1161px` and `max-width: 1400px`. Missing max-width collides with the wide rule at 1401+ (later source wins). Missing min-width leaks `bottom` into tablet (tablet rules set only `right`).
- `!important` on EVERY property set (inline base must be beaten; precedent: laptop 45%, wide 15%/5%).
- Target `.mv-diorama-pill-cfc` ONLY, never `.mv-diorama-pill`: the base selector hits all three pills.
- Position-only, never `display`: display is the hide/show mechanism (touch / 900px / strip / tablet / reduced-motion).
- Do NOT edit FACT_PILLS inline: that moves the tablet pill (bottom 30% there) and the wide pill's fallback.
- Do NOT confuse the two "Code for Cure" elements: the CHIP (anchor 0.30/0.695, H6 covers it) vs the PILL (class mv-diorama-pill-cfc, this fix). H6 is chip-vs-gutaxis, not pill-vs-anything.
- Comment hygiene (comment-only): the laptop rule comment, the rearrangement comment (1426), and the wide rule comment all cite bottom 45%; update them in the same diff.

## 3. The 1400/1401 jump

Today: at 1400 the pill is bottom 45% / right 14% (edges 0.55S, 0.86W); at 1401 it is 15% / 5% (0.85S, 0.95W). Jump: 0.30S DOWNWARD (165px at S=550) and 0.09W RIGHTWARD (126px at W=1400). For new laptop bottom B% and right R%: jump = (B-15)% x S downward (negative = upward) and (R-5)% x W rightward. Example: B=35, R=14 keeps the rightward jump and shrinks the drop to 0.20S (110px at S=550). The fixer MUST disclose the jump; QA verifies the seam (adjacent, no gap/overlap; verified in seoul-pill 06).

## 4. What does NOT move

- Loop code: FACT_PILLS is referenced only by its definition (204) and the JSX map (2039); the rAF loop iterates chips only. Pills have NO loop transform, NO drift, NO converge, NO parallax; only CSS mv-float (0 to -10px, CFC 8s).
- H-bands H3/H4/H6: all are `[data-chip]` rules; pills carry no `data-chip`. H3 (Seoul chip vs awards, 1161-1400, VH<=680) is laptop-band but its park is chip-vs-card, both unmoved, so H3 stands (spot-check only). H4/H6 are above-1400 bands, untouched.
- Miniature (<720): a 1161+ rule cannot match below 720; pills hide below 900px anyway.
- Tablet (768-1160): disjoint scopes (section 2); tablet CFC bottom stays inline 30%, right 40%/30%.
- Other pills: Seoul pill (left 59%, top 32%) and FAERS pill (top 62%, left 7%) use different selectors; a CFC-class rule cannot touch them.
- Gates: helix, microscope, stickers, notify, Cochrane, FAERS pill gates live on other elements/classes. Thresholds need NO change; count gated items only where open.
- Wide pill (1401+): byte-identical requirement; bottom 15% / right 5% must appear unchanged in the diff.

## 5. Laptop obstacles (W 1161-1400, S 550-1300, rest + worst)

Worst terms (prior convention): pill float -10px (swept box top-10, bottom float-0); chip drift 20/14, heights 28/21, relative drift 40/28; card tilt + float up 8, direction-correct; glyph/label/frame envelopes per seoul-pill 02/05.

Visible at laptop: review-new (left 36%, top 2%); poster-new (right 2.5%, bottom 2%); docking (left 2.5%, top 3%); faers card (left 2.5%, bottom 2%); awards (right 27%, bottom 4%); db-pubmed (left 43%, bottom 5%); db-elsevier (left 70%, bottom 5% inline); db-scopus (62%/19% at 1161-1300, 62%/2% at 1301-1400); db-cochrane (62%/2% at 1161-1300, 21%/15% at 1301-1400 min-height 801px); glyphs; label; frame. Chips at laptop: FAERS (0.85, 0.04); StrokeSense (0.55, 0.70); Code for Cure chip (0.30, 0.695); Seoul (0.70, 0.695). Pills: Seoul (59%/32%), FAERS (62%/7%).

Gated (count only where open): notify at VH>=882 only; stickers at 1301-1400 + VH>=951 only; microscope at 1301-1400 + S>=701 only; helix at S>=751 only; Cochrane per its two height gates above.

HIDDEN at laptop (hide-1400): gutaxis, search, posterwindow, desk; they return above 1400.

Converge (seoul-pill lesson, mandatory): check the moved pill vs converged positions AND paths, not just drift. The wide round proved endpoints-clean does not imply path-clean when endpoints straddle the pill. Laptop chips converge to the word rect (halo 20, tau 0.22, hover-only); the moved pill must clear every converged chip in x or y at every S, and every path whose endpoints straddle it.

## 6. Why the laptop surface is LARGER

Same mechanism (one scoped CSS rule), but a longer re-verification list: (a) a denser band (review-new, poster-new, awards, docking, faers card, four db tiles); (b) two sub-bands with different logo stacks and gated sets (stickers/microscope only 1301+), so the grid must be split; (c) the Seoul companion (0.70) sits close left (x-gap 0.16W-114 rest, 51.8px worst at W=1161), re-clear in drift AND converge; (d) the glyph problem is structural: the pill starts INSIDE the glyph y-band at every S, so every candidate must clear the word tail in x or y, with escapes boxed in (up: review-new + Seoul pill + logo stack; down: poster-new + awards + db-elsevier; left: Seoul companion + glyphs; right: stage edge); (e) the 1400/1401 jump is fully determined by the new laptop position and must be disclosed (section 3).

## Re-verification checklist

1. New laptop rule scope EXACTLY `min-width: 1161px` and `max-width: 1400px`, `!important` on every set property, class `.mv-diorama-pill-cfc` only, position-only: grep no leak into tablet/wide.
2. Moved pill vs every section-5 obstacle at rest + worst, split by sub-band, gated items only where open; zero overlaps at heights 28 and 21.
3. Moved pill vs converged chips (endpoints AND paths, every S); no straddle-path crossing like the seoul-pill FAERS case.
4. Moved pill vs glyphs/label/frame: the word tail park gone at every S (x or y separation at rest + worst); no new ink contact.
5. 1400/1401 jump: disclose size + direction from section 3 formulas; seam adjacent, no gap or overlap.
6. Hide rules intact; wide pill byte-identical (15%/5%); tablet pill byte-identical.
7. H3/H4/H6, loop code, TABLET_ANCHORS, MINI_CURSOR_CHIPS, miniature: untouched by grep.
8. Build passes; no em dash; docs updated (laptop pill rule + this impact note; no H-band change needed).
