# Hero responsive audit (report only, no site edits, no build)

Work tree: `~/workspace/daivanlabs-rebuild/portfolionew-work` (React 19 + Vite 7 + TS).
Scope file: `src/sections/Hero.tsx` (998 lines, read fully), plus
`src/components/hero-collage/FaersCard.tsx`,
`src/components/hero-v8/NotifyBubble.tsx`,
`src/components/hero-v8/DbLogoRow.tsx`,
`src/components/hero-v8/DbLogoFloat.tsx`,
`src/components/Header.tsx`, `src/styles/global.css`, `index.html`.

Method: code inspection + px modeling only. No live browser check
was possible (sandbox blocks localhost preview), so every number
below is modeled, not observed on screen. The user screenshot
(portrait phone, preview at awardport.netlify.app) is used as
validation evidence where the model reproduces it exactly.

## 0. The word-width model (used by every section below)

The giant word is `daivanlabs.` (11 characters), Inter Display 700
(`src/sections/Hero.tsx` line 964: `fontSize: "clamp(72px, 16vw, 180px)"`,
`lineHeight: 0.95`, `letterSpacing: "-1.8px"`, `overflowWrap: "break-word"`).

Advance-sum estimate for Inter Display 700: about 5.60em for the full
string (narrow `i` and `.`, wide `d/b/a/v/n`), minus 10 gaps x 1.8px
= 18px of letterSpacing. So:

- word width = 5.60 x fontSize - 18
- fontSize = 72px for viewport width V <= 450, 0.16V for 450 < V < 1125,
  180px for V >= 1125
- available content width inside the dashed frame = V - 48 (section
  padding, lines 520-534) - 64 (frame padding 32px each side, lines
  893-918) = V - 112

One-line fit requires word width <= V - 112:

- V <= 450: need 385 <= V - 112, i.e. V >= 497. Impossible in range.
  The word wraps at every phone width.
- 450 < V < 1125: need 0.896V - 18 <= V - 112, i.e. V >= 904.
  The word wraps at every viewport below about 904px.
- V >= 1125: font caps at 180px, word = 990px, content = V - 112
  >= 1013px. Always fits.

Validation: at the screenshot width (about 390px), content = 278px.
Prefix "daivanl" = 244px fits, +"a" = 286px does not, so the model
predicts exactly the screenshot: line 1 "daivanl", line 2 "abs.".
The model is consistent with the evidence. Fallback fonts
(Inter/Arial if Inter Display fails to load) shift advances about
+/-3%, moving thresholds about +/-25px; nothing below changes
qualitatively except the fragile cases flagged.

## (a) Giant word font-size rule and the mid-word break

The rule is `clamp(72px, 16vw, 180px)` with NO breakpoint override
anywhere: the mobile media query (lines 745-772) changes section
height, collage layout, tilts, and float animation, but never
touches `.mv-word` font-size. So the 72px floor holds on phones
even though the frame content is only 208-302px wide, while the
word needs 385px at 72px. And `overflowWrap: "break-word"` (line
970) explicitly permits breaking inside a word; there is no
`whiteSpace: nowrap`, no `text-overflow`, no container query, and
no `<wbr>` soft-break point. The browser therefore wraps mid-word
instead of scaling the word down or truncating it. That is the
whole mechanism: floor too high + break-word allowed + no
designed break point.

Per-breakpoint word behavior (content = V - 112, font as above):

- 320: font 72, content 208. Line 1 "daiva" (184px), line 2 "nlabs.".
  BLOCKING (mid-word break, and the break point itself is ugly).
- 360: font 72, content 248. Line 1 "daivanl" (244px, fits by only
  4px, fragile), line 2 "abs.". BLOCKING.
- 375: font 72, content 263. "daivanl" / "abs.". BLOCKING.
- 390 (screenshot width): font 72, content 278. "daivanl" / "abs.",
  exactly as photographed. BLOCKING.
- 414: font 72, content 302. Line 1 "daivanla" (286px), line 2 "bs.".
  BLOCKING.
- 768: font 122.9, content 656. Full word 670px does not fit.
  Line 1 "daivanlabs" (637px), line 2 a lone ".". BLOCKING
  (a lone period on line 2 is worse than a normal wrap; metric
  sensitive: with fallback fonts it may break one char earlier).
- 820: font 131.2, content 708. Full word 717px does not fit.
  Line 1 "daivanlabs" (681px), line 2 a lone ".". BLOCKING.
- 1024: font 163.8, content 912. Full word 899px fits by only
  13px. MINOR but fragile: fallback metrics (+3%) flip it to a
  wrap (926px > 912px).
- 1440: font 180 (capped), content 1328. Full word 990px fits by
  338px. PASS.

Fix (blocking, in `src/sections/Hero.tsx`): insert a soft break
after "daivan" in the `h1` (line ~973, `<wbr/>` between "daivan"
and "labs."), and add a mobile word rule in the max-width 719px
block: `.mv-word { font-size: clamp(64px, 18vw, 72px); }`.
Resulting lockup, verified against the model: at 320px, font 64px,
"daivan" = 200px <= 208px content and "labs." = 143px, so a clean
"daivan" / "labs." two-liner; at 375px, font 67.5px, "daivan" =
211px <= 263px; at 414px, font 72px, "daivan" = 226px <= 302px; at
768-904px the 16vw rule is unchanged but the break now lands on
the `<wbr/>` instead of mid-word or on a lone period; at 904px
and above the full word fits on one line and the `<wbr/>` is
inert (it only breaks when needed). Alternative if the user
insists on one line on phones: mobile-only
`font-size: min(72px, 12.5vw)` gives 40px at 320px, 47px at 375px,
52px at 414px, all one line, but the word loses most of its
giant-word drama at 40px. The `<wbr/>` option is recommended
because it keeps 64-72px type and turns the wrap into a designed
lockup.

## (b) Dashed frame + six handles

Frame (`lines 893-918`): `position: relative`, `display: inline-block`,
`width: 100%`, `maxWidth: 1160`, `padding: 28px 32px`,
`boxSizing: border-box`. The border itself is a separate absolute
div (`inset: 0`, `1px dashed rgba(18,18,19,0.2)`). No dimension is
fixed px except the padding; the frame outer width is
min(V - 48, 1160), so it cannot overflow the section on its own.

Handles (`lines 74-82`, rendered lines 935-952): six 10px squares
at -5px offsets (corners + mid-left + mid-right). They extend
5px beyond the frame on each side, but the section padding is
24px, so handles always sit 19px inside the section edge at
every width. No overflow from handles at any breakpoint.

Why the screenshot looks edge-hugging: on phones the frame spans
V - 48, so the dashed border sits only 24px (about 6% of a 390px
screen) from the screen edge, and the right handles read as
sitting on the edge. That is by design (the reference frame spans
its container), not an overflow. Optional cosmetic fix, not
blocking: on mobile only, set the frame to
`width: calc(100% - 16px)` with `margin: 0 auto` for 8px extra
breathing room per side.

## (c) Hero height on mobile browsers

Section style (`lines 520-534`): `minHeight: 550`,
`height: calc(100dvh - 100px)`, `padding: 80px 24px`,
`boxSizing: border-box`, `overflow: hidden`. The mobile media
query (`lines 745-746`) overrides height to `auto !important`
but does NOT override `minHeight: 550`.

Consequences:

- On phones the hero height is content-driven, not dvh-driven,
  so iOS Safari URL-bar collapse/expand does NOT resize the
  hero. The dvh question is moot on mobile.
- Estimated mobile hero height at 390px: padding 160 + label
  (12px type + 32px bottom margin = 44) + frame (2 word lines at
  72px x 0.95 = 137 + 56 padding = 193) + stack (Faers ~190 +
  Notify ~60 + row ~32 + 2 gaps x 16 = 314) = about 711px. The
  550px min-height never binds because content is taller.
  No clipping of in-flow content; `overflow: hidden` only clips
  absolute children, and on mobile the collage is in-flow.
- On tablet/desktop (720px and up) the `calc(100dvh - 100px)`
  rule applies. 100dvh is supported on iOS 15.4 and up; on older
  iOS the declaration is invalid and falls back to minHeight
  550 with centered content, an acceptable degradation.
  Minor robustness fix: add a `height: calc(100svh - 100px)` line
  before the dvh line for older browsers.
- Short landscape phones (height under 550px) are covered by
  `height: auto` on mobile, so the section grows rather than
  clipping. No height defect found on mobile.

## (d) Collage on mobile (below 720px)

The media query (`lines 745-772`) turns `.mv-collage` from
absolute inset 0 into a static flex column (`gap: 16px`,
`align-items: center`, `width: 100%`), zeroes all tilts, and
stops float animation. DOM order inside the section is: grid,
diorama (hidden on touch, see scatter section), label, frame
(word), then collage. So the stack sits BELOW the word, in flow,
never overlapping it.

Visible stack entries on mobile (all other items carry
`mv-collage-mobile-hide`, lines 700-744, or are hidden by their
own hide class):

1. FaersCard (no hide class). Fixed width 240px
   (`FaersCard.tsx` line 15, `box-sizing: border-box`).
2. NotifyBubble (`hide-720-1160`: hidden 720-1160, visible below
   720). Content-driven width, no `nowrap` on its text spans, so
   the "Hypertension Seoul 2026 - ABST-000034" line wraps instead
   of overflowing; estimated height about 60px at 2 text lines.
3. DbLogoRow (`hide-min-720`: visible below 720 only). Art 20px,
   padding 4, gap 6 (`DbLogoRow.tsx` lines 46, 67, 83). Tiles
   about 72 / 75.7 / 72.3 / 25.5px = row total about 263.5px
   (253.5px with the img `maxWidth: 60` cap applied).

Column width = V - 48 (section padding). Slack per breakpoint:

- 320: column 272px. Faers 240 (slack 32), row 263.5 (slack 8.5),
  Notify wraps to fit. VERDICT: minor. The row slack of 8.5px
  is fragile: any wider replacement logo asset breaks the
  one-row layout (it wraps to two rows via flexWrap, never
  overflows, but the design intent breaks).
- 375: column 327px. Faers slack 87, row slack 63.5. PASS.
- 414: column 366px. Faers slack 126, row slack 102.5. PASS.

No mobile stack overflow found: `.mv-collage-item` has
`max-width: 100%` on mobile (line 761), Faers is fixed 240px,
Notify wraps, the row fits. The stack is not a grey-strip
candidate.

## (e) Collage on tablet (720-1160px)

The collage stays absolute (the static-stack query only applies
below 720px), so items float around the word. Visible items by
band, from the hide rules (lines 700-744):

- 720-1000: docking (230 wide), poster (260), faers (240),
  stroke (max 260), db-pubmed (100). Hidden: review (hide-1000),
  notify (hide-720-1160), helix/awards/microscope/stickers
  (hide-mid, max 1160), and everything with hide-1400
  (gutaxis, elsevier, scopus, cochrane, search, posterwindow,
  desk). Total 5 floating items.
- 1001-1160: the same 5 plus review (220). Total 6.
- 1161-1400 (for reference): plus helix (100), awards,
  microscope (210), stickers, notify. Total 11. Search,
  posterwindow, desk, gutaxis, elsevier, scopus, cochrane stay
  hidden until above 1400px.

Crowding check at 768px (viewport height 1024 assumed, stage =
924px): word wraps (see section (a)), frame block = label 44 +
frame (2 lines x 0.95 x 122.9 = 234 + 56 padding = 290) = 334px,
centered, so the frame spans about y 339-629. Faers (bottom 4%,
about 190 tall) spans about y 697-887: clear by 68px. Docking
(top 3%, about 150 tall) ends about y 178: clear by 161px.
Poster (top 2%) similar. Db-pubmed (bottom 5%) spans about
y 828-878: clear. Horizontally at 720px: docking spans x 18-248,
poster spans x 442-702, gap 194px. No word overlap and no
item-to-item overlap found on tablet. VERDICT for tablet
collage: PASS, with two notes: (1) the word wrap at 720-904px
is the same blocking word defect as phones, fixed by the same
`<wbr/>` change; (2) the notify bubble is deliberately absent
at 720-1160px (hide-720-1160), so tablet shows no notification
entry. That is by design, not a defect, but the parent should
confirm it is still intended.

## (f) Faint grid background extent, and the grey strip

Grid (`lines 786-797`): absolute, `inset: 0`, inside the section
(`overflow: hidden`), 40px tiles, `rgba(18,18,19,0.06)` lines
(line 63), with a slow background-position pan (0 to 40px over
24s). Because it is inset 0 of a section that grows with its
content, it covers the FULL hero on every breakpoint, including
the mobile stack area. It does not stop short anywhere, and it
cannot produce a right-edge strip: it is clipped by the section
box, which is full width.

Grey-strip diagnosis (right edge of the screenshot): the hero
is ruled OUT as the source. Section `overflow: hidden` (line
523) contains every hero child; all mobile children fit their
column (section (d)); handles sit 19px inside the section edge
(section (b)); the fixed header CTA is viewport-relative
(`right: max(16px, ...)`) and cannot offset the page. Two
remaining explanations, both outside hero: (1) some other
section below hero has fixed or min-width content that forces
page-level horizontal overflow (note: no `overflow-x` rule
exists anywhere in `src/styles/*.css`, `src/main.tsx`, or
`src/App.tsx` per grep, so nothing guards against it), and the
screenshot was captured with the page horizontally scrolled,
which also explains the left-clipped "vanLabs." header logo in
the same screenshot (a scrolled page clips the left and exposes
background on the right); (2) a capture/crop artifact of the
screenshot itself. Fix recommendations: add `overflow-x: clip`
to `html, body` in `src/styles/global.css` (cheap global guard,
zero visual change when nothing overflows), and in a live
browser run a per-section `scrollWidth vs innerWidth` audit to
name the overflowing section. Do NOT chase this inside Hero.tsx:
nothing there overflows.

## Mobile logo scatter (special section, per added user direction)

### Why desktop has cursors and mobile does not

On desktop the scattered, living feel comes substantially from
the cursor layer, not just from logo placement. `CURSOR_CHIPS`
(lines 100-114) defines 4 chips (FAERS, StrokeSense, Code for
Cure, Seoul 2026) with anchor points and drift radii 32-56px;
a rAF loop (lines 314-380) tracks `mousemove`, computes each
chip position from the mouse plus a slow closed-loop drift, and
writes transforms per frame. That mechanism needs a persistent
pointer position stream and a hover state. Touch devices have
neither: there is no cursor position between taps, and no hover
to sustain. The code already encodes this: `.mv-diorama` is
`display: none` under `@media (hover: none)` (line ~623), and
fact pills are hidden below 900px (line ~630). So on mobile the
diorama is entirely absent by design, and the hero feels
different for a structural reason, not a bug. The user request
follows from this: since cursor scatter cannot exist on mobile,
the scattered feel must come from logo placement itself.

### Current mobile DOM facts (the baseline to change)

Below 720px the collage is a static flex column (lines 745-772)
rendering, in DOM order: FaersCard, NotifyBubble, DbLogoRow.
The word, label, and dashed frame are OUTSIDE the collage and
sit above it in flow. The four database logos therefore appear
as ONE block (the row, about 32px tall) at the very bottom of
the hero, below both cards. That is the "numpuk dalam satu
baris di bawah hero section" the user objects to. Single-logo
tiles already exist and are reusable: `DbLogoFloat` tiles are
PubMed 100x50, Elsevier 104x50, Scopus 100x50 (art 24px, padding
12, `DbLogoFloat.tsx` lines 42-57), Cochrane 69x82 (art 56px,
lines 63-65). The desktop floats are hidden on mobile by
`mv-collage-mobile-hide`; the row is shown on mobile by
`hide-min-720` (hidden at 720px and up). Any scatter design
must respect: column width = V - 48 (272 / 327 / 366px at
320 / 375 / 414px), stack gap 16px, and the word block above
the stack (frame about 193px tall on phones: 2 word lines at
72px x 0.95 = 137 + 56 padding; label adds 44px above it).

### Option (a): interleave single logos between the stack cards

Design: delete the `db-row` item (otherwise logos duplicate:
singles + row both below 720px) and add four mobile-only items
using the existing `DbLogoFloat` wrappers with hide class
`hide-min-720` (shown below 720px only, the same class the row
uses, so desktop is untouched). DOM order becomes: single
PubMed, FaersCard, single Elsevier, NotifyBubble, single
Scopus, single Cochrane. Hidden desktop items sitting between
these in DOM order are `display: none`, so the visual order is
exactly as listed.

Px math (identical at 320/375/414 because tiles are fixed px):

- Widths: widest single tile 104px vs columns 272 / 327 / 366px.
  Slack per side at 320px: (272 - 104) / 2 = 84px. No horizontal
  overflow is possible at any phone width.
- Heights: singles 50 / 50 / 50 / 82px. New stack height =
  Faers ~190 + Notify ~60 + singles 232 + 5 gaps x 16 = 80,
  about 562px, vs about 314px today (Faers ~190 + Notify ~60 +
  row ~32 + 2 gaps x 16 = 32). Cost: about +248px of hero
  height on phones.
- Safe distances: every vertical gap is exactly the 16px
  collage gap; no logo touches the word or frame because the
  stack is in-flow below the frame; horizontal slack is at
  least 84px per side at the narrowest width.
- Order rationale: PubMed opens (most recognized mark);
  Elsevier alternates card/logo/card/logo; Scopus then
  Cochrane close, preserving the desktop pairing (Cochrane
  sits under Scopus on desktop) with Cochrane's tall portrait
  tile anchoring the bottom.

Pros: reuses existing tile components with zero new artwork;
no absolute positioning, so no overlap or overflow risk class
at all; no word/frame contact; works at every phone width with
identical math; desktop completely untouched (new items hide
at 720px and up). Cons: hero grows about 248px taller on
phones; logos still sit below the word along the scroll axis
rather than surrounding it (see why options (b) and (c) cannot
do better below); requires deleting `db-row` and adding four
items (small, contained change).

### Option (b): absolute logos around the word on mobile

Design: override the mobile static rule for logo items and
position them absolutely around the word block.

Why it fails, with numbers:

- Side gutters are the 24px section padding. The narrowest
  logo tile is Cochrane at 69px wide. A side-placed tile
  overlaps the frame/word zone by at least 69 - 24 = 45px.
  There is no side space on phones, period.
- Top zone: the section top padding is 80px. Wordmark tiles
  (50px tall) fit with 30px slack, but only above the label,
  and only 2 tiles fit there (left/right) before they collide
  with each other and with the fixed header CTA zone. Cochrane
  (82px tall) does not fit the 80px zone at all.
- Bottom zone: the gap between frame and stack is the 16px
  collage gap. Nothing fits.
- Positioning context is unstable: on mobile `.mv-collage`
  is static with auto height (it grows with the stack), and
  the media query forces items static (lines 745-772), so
  absolute placement needs a query override plus a new
  positioned ancestor; percentage tops would be relative to
  a section height that itself includes the stack, so tiles
  drift as content changes.
- The word wraps to 2 lines at every phone width (320:
  "daiva" / "nlabs."; 360/375/390: "daivanl" / "abs."; 414:
  "daivanla" / "bs."), so mid-frame tiles would sit on glyphs
  in addition to the gutter problem.

Verdict: REJECT as the main approach. It is only feasible in a
reduced form (at most 2 small tiles in the top padding zone),
which is invasive for little scatter value.

### Option (c): logos at the corners of the dashed frame

Design: place one logo tile at each corner of the dashed frame.

Why it fails, with numbers (frame width = V - 48 = 272 / 327 /
366px; frame content = frame minus 64px padding = 208 / 263 /
302px; word line 1 widths at 72px from section (a)):

- Top-left corner tile (100px wide) vs glyphs: at 320px, line 1
  "daiva" (184px) is centered in 208px content, so glyphs span
  content x 12-196; the corner tile spans frame x 0-100, i.e.
  content x -32 to 68, covering glyphs x 12-68 (56px of glyphs
  covered). At 375px: line 1 "daivanl" (244px) in 263px content,
  glyphs x ~10-254; tile covers content x -32 to 68, covering
  about 58px of glyphs. At 414px: line 1 "daivanla" (286px) in
  302px content, glyphs x ~9-294; tile covers about 59px of
  glyphs. Every top corner covers glyphs at every phone width.
- Bottom corners: a 50px tile centered on the corner extends
  25px into the frame (covering line-2 glyphs and padding) and
  25px below it (covering the 16px gap plus 9px of the Faers
  card top).
- The six 10px handles sit at -5px on the same corners; corner
  tiles bury them entirely.
- Tiles placed OUTSIDE the frame instead: side margin is 24px
  against a 69px minimum tile width, so 45px sticks out past
  the section and is clipped by `overflow: hidden` (tile cut
  off) or, if overflow were changed, becomes page overflow.
  Above the frame is the 32px label gap plus 80px padding,
  already occupied by the label; below the frame is the 16px
  stack gap.

Verdict: REJECT. Corners are the worst placement: maximum glyph
collision, handle collision, border collision, and no outside
room to escape into.

### Recommendation

PRIMARY: option (a), interleave singles. It is the only option
with zero overlap risk, zero overflow risk, and exact px math
at all three phone widths, and it directly answers the user
request (logos no longer in one row at the bottom; they are
spread through the hero stack at six rhythm points instead of
three). Implementation, all in `src/sections/Hero.tsx`
COLLAGE_ITEMS plus deleting the `db-row` item: add `m-pubmed`
before `faers`, `m-elsevier` between `faers` and `notify`,
`m-scopus` and `m-cochrane` after `notify`, each rendering the
existing `DbLogoFloat` wrapper with hide class `hide-min-720`
and empty tilt class. No new artwork, no stylesheet surgery
beyond what already exists, desktop untouched.

BACKUP: split-row pairs. Keep row-style tiles (art 20px) but
split `DbLogoRow` into two stack entries: pair 1 PubMed +
Elsevier (72 + 6 + 75.7 = 153.7px) and pair 2 Scopus + Cochrane
(72.3 + 6 + 25.5 = 103.8px), ordered Faers, pair 1, Notify,
pair 2. Both pairs fit the 272px column easily; total stack
height becomes about 362px (only about +48px vs today) with
two scatter points instead of one. Trade-off vs primary: much
less height growth, but smaller, less legible tiles (art 20px
vs 24/56px) and only two logo positions instead of four, and
it needs a new split-row component or prop rather than reusing
`DbLogoFloat` directly. Choose the backup only if the parent
judges +248px of hero height unacceptable on phones.

## Prioritized fix list (file + change, not implemented here)

1. BLOCKING, `src/sections/Hero.tsx` h1 (~line 973): insert
   `<wbr/>` between "daivan" and "labs."; in the max-width 719px
   block add `.mv-word { font-size: clamp(64px, 18vw, 72px); }`.
   Fixes the mid-word wrap on all phones and the lone-period
   wrap on tablets 720-904px; inert at 904px and above.
   Alternative (single-line, less drama): mobile-only
   `font-size: min(72px, 12.5vw)`.
2. BLOCKING-ADJACENT, `src/styles/global.css`: add
   `overflow-x: clip` to `html, body`, and audit per-section
   `scrollWidth vs innerWidth` in a live browser to name the
   grey-strip source outside hero. Hero itself is clean.
3. PRIMARY SCATTER, `src/sections/Hero.tsx` COLLAGE_ITEMS:
   implement option (a) as specified above (four mobile-only
   single tiles, delete `db-row`). Backup: split-row pairs.
4. MINOR, `src/sections/Hero.tsx` mobile block: optional frame
   breathing room (`width: calc(100% - 16px)`, centered) so the
   dashed border does not read as sitting on the screen edge.
5. MINOR, `src/sections/Hero.tsx` section style: add
   `height: calc(100svh - 100px)` before the dvh line for older
   iOS on tablet/desktop.
6. NOTE (no action unless the parent decides otherwise): the
   notify bubble is deliberately absent at 720-1160px
   (hide-720-1160); the DbLogoRow one-row slack at 320px is
   only 8.5px, which option (a) removes along with the row.

## Per-breakpoint hero verdicts (summary)

- 320: BLOCKING (word wraps "daiva" / "nlabs."); stack PASS
  except fragile 8.5px row slack (minor).
- 360: BLOCKING (word wraps "daivanl" / "abs.", fits by 4px).
- 375: BLOCKING (word wraps "daivanl" / "abs.").
- 390 (screenshot width): BLOCKING (word wraps exactly as
  photographed); frame, handles, grid, stack all PASS.
- 414: BLOCKING (word wraps "daivanla" / "bs.").
- 768: BLOCKING (word wraps with lone "." line 2); tablet
  collage PASS (5 floats, no word/item overlap).
- 820: BLOCKING (word wraps with lone "." line 2); tablet
  collage PASS.
- 1024: MINOR (word fits by 13px, fragile to fallback fonts);
  tablet collage PASS (6 floats).
- 1440: PASS (word fits by 338px; desktop collage per the
  v10/Cochrane QA chain, unchanged by this report).

No em dash appears in this report. All modeling assumes Inter
Display loads; fallback fonts move word thresholds about
+/-25px but change no verdict except the flagged fragile cases.
Live-browser confirmation remains owed for: the exact word
break at 360px (4px margin), the grey-strip source section,
and the scatter options in real mobile context.
