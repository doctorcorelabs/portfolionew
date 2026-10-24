# v10 free placement: database logos scattered freely in the hero

Doc only, no site edits. This doc sets the rules for moving the four
REAL database logos out of the v9 dark card and scattering them
freely in the hero, the way the reference hero scatters app icons,
windows, and bubbles around one giant word. It does not copy any
reference copy, client name, or marketing wording.

## 0. What changes, and what it supersedes

V9 put the four real logos (PubMed, Elsevier, Scopus, ScienceDirect)
inside one dark card, DbStackCard, as a 2x2 tile grid. The user now
wants them out of any box, placed freely in the hero section like
the reference example. So:

- DbStackCard goes away entirely: no dark card, no label, no
  footer, no 2x2 grid. The v9 glyph-clearance problem (a tall dark
  card intruding into the giant word glyphs) is moot, because the
  card no longer exists. It is replaced by four independent logo
  items, not by a different container.
- The v8 doc 01 section 7 database strip (one wide bar, text
  wordmarks) stays superseded, as it already was in v9. The v8 doc
  01 section 4.5 app-icon rule ("never a database logo") applied
  to generic glyph tiles, not to real logo tiles; it does not block
  this work. Real logo artwork is already authorized by the user's
  v9 request and stays authorized here.
- What does NOT change: the logos themselves (same files in
  public/logos/, same trademark note in docs/logo-sources.md),
  the search-tools-only framing (section 7 below), the FAERS
  homepage rule, the StrokeSense education-first rule, and every
  honesty rule from v7 and v8 that is not about the card.

## 1. Where logos may sit: scattered periphery only

- Logos live in the top band or the bottom band of the hero stage
  only. Top band means the top 0 percent to 35 percent of the
  stage height; bottom band means the bottom 0 percent to 40
  percent of the stage height. The middle zone, including the
  giant word, the dashed selection frame, and the centered label,
  is off limits.
- No logo tile may overlap any word glyph, the selection frame,
  or the centered label, at any breakpoint. Keep at least 24px of
  clear space between a logo tile edge and the frame edge. This
  rule is stricter than the v7 and v8 card tuck precedent: cards
  were allowed to tuck under the frame edge because the word
  paints above them, but a logo tile overlapping a glyph would
  read as a sticker pasted on the word, not as a free object.
- Logos scatter, they do not line up. No row of four, no column
  of four, no grid, no even spacing, no shared baseline on
  desktop. Each logo gets its own position, its own tilt, and its
  own size tier (section 3), like the reference icons, which sit
  at different spots, angles, and sizes around the word.
- Current collage map the builder must fit around (from
  src/sections/Hero.tsx): top band holds docking (left 2.5
  percent, top 3 percent), helix (left 27 percent, top 2 percent),
  search window (left 36 percent, top 2 percent), review (right
  27 percent, top 3 percent), poster (right 2.5 percent, top 2
  percent), poster window (right 2.5 percent, top 11 percent),
  and stickers (left 2.5 percent, top 32 percent). Bottom band
  holds faers (left 2.5 percent, bottom 4 percent), gut axis (left
  25 percent, bottom 3 percent), desk (left 53 percent, bottom 3
  percent), stroke (right 2.5 percent, bottom 5 percent), notify
  (left 2.5 percent, bottom 25 percent), microscope (left 2.5
  percent, bottom 39 percent), and the freed dbstack slot (right
  22 percent, bottom 5 percent). The freed slot is one natural
  home for one logo, not for all four.

## 2. Separation: no crowding, no new overlaps

- Logo to logo: at least 40px edge to edge between any two logo
  tiles, measured at rest (before float and parallax). Logos must
  never touch, never overlap each other, and never read as a
  cluster or a row. If two logos end up in the same band, they sit
  at opposite ends of it.
- Logo to existing card: at least 24px edge to edge between a logo
  tile and any other collage item, measured at rest. A corner graze
  of at most 12px against a neighboring card corner is tolerated
  only if the logo tile stays fully legible and sits clearly on
  top (deeper shadow, full opacity). Anything beyond a graze is a
  new overlap and fails review. The small corner grazing accepted
  in v7 and v8 (cards layering under the one-third cap) is the
  ceiling, not the target; the target for logos is clear space.
- Logo to word and frame: section 1 applies (no overlap, 24px
  clearance from the frame edge).
- Separation is checked at rest and at float peaks: float moves
  tiles vertically, so a pair that clears by exactly 24px at rest
  but collides at a float peak fails. Leave float amplitude in
  the budget when placing tiles near other items.
- When a hide rule removes a neighboring card at a narrower
  breakpoint (for example gut axis below 1400px, review below
  1000px), the builder must not slide a logo into the freed slot
  to re-tighten the layout. Logos keep their desktop positions
  until their own hide rule applies; freed space stays empty.

## 3. Size variety: wordmarks large, icon small

The reference icons vary in size, and that variety is part of the
scattered feel. The four logos must not share one tile size.

- Wordmark tier (PubMed, Elsevier, Scopus): art height 24px, width
  auto, object-fit contain, never stretched or cropped. At 24px
  tall the wordmarks render about 74px to 79px wide (PubMed about
  74px, Elsevier about 79px, Scopus about 75px), so wordmark tiles
  land around 100px to 104px wide with padding. This is
  deliberately larger than the v9 card tiles (20px art), because
  the logos are now standalone objects, not grid cells.
  As-built correction: this spec originally said 28px art and
  110-120px tiles; the builder shipped 24px to protect the
  PubMed-to-gut-axis gap, and reference-fidelity QA recommended
  keeping 24px (28px would shrink that gap from about 15px to
  about 7px).
- Icon tier (ScienceDirect): the compact SD favicon monogram from
  public/logos/sciencedirect-icon.png, art height 28px, in a tile
  around 52px to 56px wide. The icon tile is roughly half the
  width of a wordmark tile, which is the small accent in the
  scatter. The horizontal ScienceDirect wordmark stays unused for
  free placement: at 28px tall it is about 227px wide, which would
  dominate the scatter and break the size variety. It stays on
  disk as provenance only, as in v9.
- One logo may go one step larger as the scatter anchor (art up to
  32px tall, tile up to about 135px wide), but at most one logo,
  and never the icon. Two anchors cancel each other out.
- Minimum legibility floor, unchanged from v9: no logo art below
  20px tall at any breakpoint, including mobile. If a tile size
  would push art below 20px, the tile is too small, not the art.

## 4. The tile is the ground, not a box

- Every logo still sits in its own small white tile: paper #FFF
  fill, 1px #E0E0E0 border, 8px radius, padding 12px. The tile is what makes a
  transparent logo readable against the faint grid and the word:
  bare transparent logos placed directly on the grid are
  forbidden, because grid lines and glyph edges compete with the
  logo strokes and the logo dissolves into the background.
- The tile is a ground, not a container: one logo per tile, no
  shared tile, no tile holding two logos, no tile with text in it.
  A tile that groups logos is the v9 card returning in miniature,
  and it fails this doc.
- Shadow and tilt per tile, static, never animated: wordmark
  tiles use mid depth (0 8px 20px rgba(1, 1, 1, 0.14)); the icon
  tile uses near depth (0 4px 12px rgba(1, 1, 1, 0.12)), because a
  small tile with a deep shadow looks like a hole. Tilts stay in
  the -4deg to +4deg range, adjacent tiles never share a tilt
  sign, and tilt lives on a separate wrapper element from float,
  exactly as the existing collage items do. Never put tilt and
  float on the same element.
- Float: logos join the existing collage float system (translateY
  only, desynced durations in the 9s to 16s range, one duration
  per logo, never two logos sharing a duration and delay).
  Parallax moves the whole layer only, never a single logo.
  Under prefers-reduced-motion, floats stop and tiles render at
  rest, as with every other collage item.

## 5. The SD monogram must never sit alone

- The ScienceDirect icon identifies ScienceDirect only in
  context (v9 finding: a viewer who does not know the SD monogram
  cannot read the word "ScienceDirect" from the tile alone). So
  the icon tile must sit in the same band as, and within about
  120px edge distance of, at least one wordmark tile. The
  neighboring wordmark is what makes the monogram readable.
- Never place the icon alone in a band while all three wordmarks
  sit in the other band. Never place the icon as the sole logo
  visible at any breakpoint where wordmarks hide (see section 6:
  mobile shows all four together, so this cannot happen there
  either).
- If a breakpoint hides the wordmark that anchors the icon, the
  icon hides with it. An orphaned monogram is worse than a
  missing logo.

## 6. Mobile: one compact row in the stack, floats off

- Below 720px the collage becomes a static vertical stack below
  the word, as in v7 through v9. The four logos collapse into ONE
  compact horizontal row inside that stack, in the order PubMed,
  Elsevier, Scopus, ScienceDirect. The row is a single stack
  entry, not four entries: four separate logo entries would bury
  the word under a second screen of tiles.
- The row sits where the dbstack entry sat: last in the stack,
  after faers and notify. Stack order on mobile is faers, notify,
  logos row.
- In the row, tiles shrink but stay legible: art height 20px for
  wordmarks (the v9 floor), icon art 20px, gap 6px, tilts reset to
  0deg, floats off (animation none, as the existing mobile block
  already does for every collage item). The row wraps only below
  about 320px viewport width, into two pairs, never into a
  column of four.
- The row is a layout arrangement, not a container: no shared
  background, no shared border, no label above it, no box around
  it. Four independent tiles sitting in a row because the screen
  is narrow is not the same thing as a box grouping them, and
  the distinction must stay visible: gap between tiles, no
  enclosing frame.

## 7. Framing and forbidden treatments

- Framing stays search-tools only, exactly as in v9. The logos
  appear with no label, no caption, and no surrounding copy, so
  there is nothing near them that could claim indexing,
  affiliation, partnership, or endorsement. Banned phrasings
  anywhere near the logos, in code, copy, or comments: "indexed
  in", "affiliated", "partner", "endorsed", "featured in",
  "as seen in", "approved by".
- Forbidden treatments: any container grouping the four logos
  back into one box (dark card, light card, bar, strip, panel,
  shared background); any badge, seal, checkmark, star, or ribbon
  on or next to a logo; any brand-color tile background (tiles
  stay white; brand colors appear only inside the logo art
  itself); any recoloring, filtering, fading, or drop-shadow on
  the logo image itself; any stretching, squashing, or cropping
  of logo art; any new visible label or caption (the reference
  does not label its icons, and these logos are self-identifying,
  except for the SD monogram, which section 5 handles by
  proximity, not by a caption).
- Alt text rule: brand name plus "logo" ("PubMed logo", "Elsevier
  logo", "Scopus logo", "ScienceDirect logo"). Never empty, never
  generic. Tiles carry no link, button, or hover action. The
  layer stays pointer-dead and aria-hidden, as in v7 through v9.
- If a logo file fails to load, its tile hides itself entirely
  (the v9 onError pattern), leaving the remaining logos in place.
  No broken-image icon, no text fallback, no placeholder box.

## 8. What the builder must NOT do

- No box of any kind around the four logos, and no box around
  any subset of them. This is the whole point of v10; a "lighter"
  or "borderless" grouping is still a grouping.
- No moving the word, the frame, the cursor chips, or any
  existing anchor to make room. Logos fit around the existing
  collage; the collage does not move for them.
- No tilt beyond 4deg on a logo tile, no tilt on the word or the
  frame, no hover lift, no hover shadow change, no animated
  shadows, no animated widths, no layout properties in any loop.
  Float and entrance use transform and opacity only.
- No new colors, no gradients on tiles. Palette stays ink
  #010101, paper #FFF, blue #0859D4, greys #E0E0E0 and #98989C.
  No brand color hex values outside the logo image files
  themselves.
- No em dash anywhere, in the doc or in tile code. Use a hyphen
  or reword. This doc follows that rule.
- No new numbers, no new facts, no new copy of any kind. The
  logos add zero text to the hero.

## 9. Verification checklist for the v10 QA agents

- DbStackCard is gone: no import, no item, no dark card, no
  label, no footer, no 2x2 grid anywhere in Hero.tsx or
  hero-v8 files.
- Four independent logo items exist on desktop, each in the top
  band or the bottom band, none overlapping a glyph, the frame,
  or the centered label, with at least 24px clearance from the
  frame edge.
- Logo to logo gaps measure at least 40px at rest; logo to card
  gaps measure at least 24px at rest (12px corner graze at most,
  fully legible, on top); gaps still clear at float peaks.
- Size tiers: three wordmark tiles around 100px to 104px wide
  (24px art), one icon tile around 52px to 56px wide (28px art),
  at most one anchor at up to 32px art. No logo art below 20px
  tall at any breakpoint.
- Tiles are white, 8px radius, 1px #E0E0E0 border, correct shadow
  per tier, static tilts in -4deg to +4deg with alternating
  signs, tilt and float on separate elements, floats desynced.
- SD icon sits in the same band as, and within about 120px of,
  at least one wordmark tile, at every breakpoint where it is
  visible.
- Mobile: exactly one logos row in the stack, order PubMed,
  Elsevier, Scopus, ScienceDirect, after faers and notify, art
  20px, tilts 0deg, floats off, no enclosing box, no label.
- Alt texts are brand plus "logo"; no links, buttons, or hover
  actions on tiles; layer stays pointer-dead and aria-hidden.
- Greps: em dash 0 across the doc and all touched files; no
  endorsement or indexing wording in rendered copy; no reference
  copy; no invented numbers; no brand color hex values outside
  the logo image files.
