# Hero collage motion + accessibility QA (agent 13/15, REPORT ONLY)

Scope: `src/sections/Hero.tsx` (collage layer, pointer parallax, float
loops) and all 9 components in `src/components/hero-collage/`
(FaersCard, DockingCard, GutAxisCard, ReviewCard, PosterCard,
AwardsCard, StrokeCard, PhotoCard, DnaHelix). No site files were
edited and no build was run for this report. `npx tsc --noEmit` was
run read-only and is clean.

Method: all 9 components read in full; the Hero.tsx collage config,
parallax effect, collage CSS, and render block read; targeted greps
for forbidden patterns, animation/transition inventory, pointer
events, aria attributes, and matchMedia gates. Tree stability was
confirmed by identical md5 hashes of Hero.tsx and all 9 components
across two checks about 7 minutes apart, so this audits the finished
integration, not a mid-edit state. All findings are code inspection
only; no live browser check was possible.

## Verdict: PASS, with a gap list (none blocking on motion/a11y grounds)

| Check | Verdict | Notes |
| --- | --- | --- |
| (a) Float/parallax transform/opacity only | PASS | Float is translateY only; parallax writes transform only; entrance is opacity only. The grid pan (background-position) is a pre-existing v6 exception, not collage code. |
| (b) Parallax mouse only, rAF-throttled, off in reduced motion and on touch | PASS | Gated on hover:hover + pointer:fine AND NOT reduced-motion before listeners attach; pending-flag rAF throttle; no React state per frame; mouseleave resets to zero; cleanup removes listeners and cancels rAF. |
| (c) Collage pointer-dead, drag intact, nothing hover-only | PASS | Layer, items, and AwardsCard are all pointer-events none; layer is z-index 0 below frame z-index 1; no hover reveals and no interactive elements exist in any card. |
| (d) Giant word readable, card contrast sane | PASS | Word/frame paint above collage (z 1 vs 0) and every card is white, so ink glyphs stay high contrast even where a card tucks under the frame. Primary card text is ink or blue on white. See G4/G5 observations. |
| (e) No scroll-lock, custom cursor, marquee, smooth-scroll | PASS | Grep over Hero.tsx + all collage files: 0 hits for marquee, scroll-lock, cursor none, scroll-behavior, scrollTo, scrollIntoView, overscroll, scroll-snap, touch-action, wheel handlers, preventDefault, Lenis. The move/grabbing cursors are pre-existing system cursors on the draggable frame only. Section overflow hidden is own-box clipping, not scroll locking. |

## Per-component results

| Component | Verdict | Notes |
| --- | --- | --- |
| FaersCard | PASS | Fully static, no animation, no handlers. Inner aria-label is inert under the layer aria-hidden (see G3). |
| DockingCard | PASS | aria-hidden, static SVG schematic, no motion, no handlers. |
| GutAxisCard | PASS | Static; SVG carries role img + aria-label, inert under layer aria-hidden (see G3). No explicit card width; rendered width is browser-dependent (see G1). |
| ReviewCard | PASS | Static, no motion, no handlers. The missing honesty microcopy is an accuracy finding owned by doc 02 (G1 there); it is not repeated as a motion/a11y FAIL here. |
| PosterCard | PASS | aria-hidden, static, no motion, no handlers. |
| AwardsCard | PASS | aria-hidden plus its own pointer-events none, static, no motion. |
| StrokeCard | PASS | Static, no motion. No aria-hidden on its own root, but it sits inside the aria-hidden layer, so it is hidden the same way. Honesty line is visual text duplicated by the Works section. |
| PhotoCard | PASS | Static image + caption, no motion. Img alt text is present but inert under layer aria-hidden on desktop and in the mobile stack (see G6). Caption honestly labels the image as illustrative ambience. |
| DnaHelix | PASS | aria-hidden, static SVG, no animation in the component; its float lives on the parent wrapper in Hero.tsx. |
| Hero.tsx collage layer | PASS | Parallax, float, entrance, reduced-motion, and touch gates all as specified in checks (a) through (e). Entrance delay is 2.2s vs doc 01's 1.6s; trivial, no a11y impact. |

## Gap list (not empty)

- G1 (moderate, layout, needs a live visual check): card-to-card
  overlap is plausible at mid widths. Top-right pair: ReviewCard
  (right 27%) and PosterCard (right 2.5%) overlap horizontally
  below roughly 1000px stage width. Bottom band: FaersCard,
  GutAxisCard, and the centered PhotoCard crowd each other below
  roughly 1100px, and GutAxisCard sets no explicit width, so its
  rendered width is browser-dependent. This is not a motion/a11y
  FAIL (the word stays readable via z-order and all cards are
  pointer-dead, so nothing interactive is obscured), but the
  integration should be checked visually at 720px, 900px, and
  1100px widths, and the parent should consider extending the
  hide-mid rule or adding a mid-width stacking rule.
- G2 (minor, deviation from doc 01 section 5): float loops keep
  running on touch devices at 720px and wider (only the diorama
  layer is hidden under hover:none; no rule kills
  .mv-collage-float on touch), and the mobile stack at 719px and
  below still floats and shows three cards (DockingCard,
  FaersCard, PhotoCard), not doc 01's two static cards. Harmless:
  float is transform-only and pointer-dead. Either accept it or
  add a hover:none kill for .mv-collage-float and hide DockingCard
  on mobile. Parallax itself correctly never attaches on touch.
- G3 (minor, dead code): the inner aria-labels on FaersCard,
  ReviewCard, and the GutAxisCard SVG are inert because the whole
  collage layer carries aria-hidden=true. Harmless, since every
  card fact is duplicated in the Works, Journey, or archive
  sections, but the labels should either be removed or documented
  as intentionally hidden decoration.
- G4 (observation, contrast): muted grey #98989C micro labels and
  notes measure about 2.9:1 on white, below WCAG AA for normal
  text. It is used only for secondary notes (for example
  "Hypothesis-generating", "Illustrative ambience"); every primary
  figure and label is ink or blue on white with strong contrast,
  and the grey matches the site-wide mono micro style. No action
  unless the parent wants micro text darkened site-wide.
- G5 (observation, short stages): on hero heights near the 550px
  minimum, top-band cards may tuck under the dashed frame border
  and slightly into the glyph zone. The word stays readable
  because frame/word (z-index 1) paint above collage (z-index 0)
  and all cards are white. Verify once visually at short viewport
  heights.
- G6 (observation, mobile assistive tech): the mobile stacked cards
  at 719px and below stay inside the aria-hidden layer, so their
  captions are unavailable to assistive tech. Acceptable because
  all facts duplicate real sections (and the real portrait lives
  in Profile), but flag it if the parent ever wants the mobile
  stack readable, in which case aria-hidden should lift at the
  mobile breakpoint.
- Cross-reference: content accuracy for these cards is owned by
  docs/hero-collage/02-accuracy-qa.md (verdict FAIL narrow, one
  ReviewCard microcopy fix). Nothing in that doc changes this
  motion/a11y verdict, and nothing here re-scores accuracy.
