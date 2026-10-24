# 11 - v4 integration notes (parent pass after docs/deep/01-10)

v4 keeps everything the 5 implementation agents built, then applies
the highest-value corrections from the 9 deep-analysis docs. Where a
later doc contradicts an earlier one, the later measurement wins;
those resolutions are listed in section 2.

## 1. What the parent changed (after the QA PASS in doc 10)

- Hero: cursor chips moved from CSS drift keyframes to a
  requestAnimationFrame loop (no CSS transition on chip transform,
  per doc 01). Each chip loops on a closed ellipse (16-24s, radius
  32-56px, scroll modulates phase by up to a quarter loop) and
  converges to the nearest edge of the giant word while the word is
  hovered, easing back over about 0.9s when the pointer leaves.
  Labels stay topic/project words only (FAERS, StrokeSense, Code for
  Cure, Seoul 2026); no person names, no roles. Chip layer raised
  above the word/frame layer (z-index 2) so converged chips stay
  visible; pointer-events none everywhere, so drag still works.
  Right-anchored chips hang from the right edge, never clipped.
  Hero grid fade corrected 1400ms to 800ms (doc 08).
- Services: full doc 03 spec applied. Flat #0859D4 fill plus a CSS
  halftone dot layer (1px dots, 6px tile, 50 percent opacity,
  multiply) replaces the gradient and the 18s highlight drift, which
  is deleted. Radius 16px to 10px; min-heights 520px desktop, 470px
  below 1400px, 350px at or below 1023px; gaps 20px desktop, 45px
  mobile; single column at or below 1023px; card titles stepped
  36px/28px; body text 80 percent white; pill transition 0.3s with
  fill never changing (transparent outline in every state, the
  earlier white-fill hover was the reference's horizontal variant,
  not the homepage vertical one); dotted rule is now 1px square
  tiles per title line via a repeating gradient on an inline span;
  entrance 0.6s from 40px. Section padding kept at 130px top/bottom
  (doc 03 note 1: the reference 30px top belongs to a different
  predecessor section).
- Works: dotted title rule (160px, 1px square tiles) added under the
  heading (doc 05 motif adoption). The fan deck itself is NOT built:
  doc 05 verdict is REJECT as a replacement for the 9-row index
  (tilted text at 188px is unreadable, dimming implies entries matter
  less, and a fan curates while an index completes).
- Profile: highlight rebuilt per doc 06 - the light-blue bar now
  grows width 0 to full over 2000ms ease-out on title reveal, with a
  4px blue left bar and 16px round blue knobs tracking both edges
  (right knob rides the growing bar). The period after "builds" now
  sits outside the highlight.
- Contact: watermark monogram "DL" (the site's own initials, 266px
  desktop / 170px mobile, 0.82 line height, -10px tracking, 92
  percent white with a faint 1px outline, 20px rise on entrance)
  added behind the content; dotted title rule under the heading;
  mailto action changed from an underline-draw text link to a solid
  blue pill (hover brightens over 0.4s); social links lift 3px over
  0.4s. Dot field masks split per doc 04: base field exists only
  within 350px of the cursor on hover devices, lit halo is a 50px
  falloff from 65 percent, no-hover park radius corrected 300px to
  200px. The giant headline is deliberately kept (user-approved v2
  element); the watermark stays a faint texture behind it, not a
  second competing headline. The two-column split from doc 07 is
  NOT built: it is the precondition for a full collage, which is
  deferred (see section 3).
- Quote: dot field added behind the pinned text (same 14px/0.4px/
  20/44 percent geometry, cursor-gated like Contact) per doc 04;
  inactive words now carry a light outline stroke (exact reference
  stroke color is UNVERIFIED, so this is a subtle reading).
  Sticky overflow-y auto kept (doc 04 flagged it low, not a fix).
- Tokens: --ease-theme cubic-bezier(0.4, 0, 0.2, 1) added as a
  reserve token for future theme changes (doc 08).
- Performance: will-change removed from the shared reveal CSS, the
  archive pages, NotFound, and the contact line-mask (doc 08). The
  only remaining will-change is the Manifesto drift blob, the one
  continuous loop, where the hint is justified.

## 2. Conflicts resolved (later evidence wins)

- Hero grid pinned vs scrolling: the first live observation said
  pinned; the second live observation (deep pass) says the grid
  scrolls 1:1 with the hero content. v4 keeps the grid scrolling
  normally, matching the second observation. Synthesis item 9
  (sticky grid) is dropped, not deferred.
- Headline hover: the first live observation said the dashed box
  hides and cursors converge on hover; the second said no visible
  reaction. Doc 01 sides with the first (no CSS hover rule exists,
  so the convergence must be JS-driven). v4 keeps box-hide on hover
  and now implements converge, matching doc 01.
- Cursor count: synthesis left it unmeasured; doc 01 measures 6 hero
  chips plus 1 separate contact cursor (the deep browser pass
  counted 7 in the hero viewport, likely including the contact one
  in frame). v4 uses 4 chips, a sparser honest set.
- Services gradient vs flat: v3 shipped gradient plus 18s drift as
  an interpretation; doc 03 measures flat plus static halftone.
  Flat plus halftone wins; drift deleted.
- Synthesis doc 09 was written before docs 01-08 landed (stated in
  the doc itself). Where this file and docs 01-08 disagree with doc
  09, docs 01-08 and this file win.

## 3. Deliberately deferred (need a user decision, not an implementer guess)

- Fan deck cover art (synthesis decision 2): typographic panels vs
  research-artifact panels vs deferred entirely. Doc 05 says
  postpone until at least one real artifact exists; do NOT generate
  AI cover images for papers.
- Manifesto title drag (synthesis item 5): needs the release
  behavior decision (snap-back recommended vs free placement) and a
  shared drag hook extracted from Hero.
- Collage placement (synthesis decision 3): hero vs contact vs one
  small set each. v4 has text-only pills in both places, which are
  not collage cards, so no duplication issue arises yet.
- Header wordmark fade (synthesis item 7): meaningless while the
  header is in normal flow (it scrolls away anyway). It only matters
  with a sticky header, which would need background handling over
  the dark sections.
- Lenis smooth scroll (doc 08 priority 1): the largest remaining
  global-feel gap, but adoption needs a live-browser test covering
  the pinned quote, anchor scrolling, and reduced motion. Not
  adopted on CSS evidence alone.
- Theme crossfade (doc 08): needs a real dark mode first; the
  easing token is reserved, no toggle is built from a guessed
  trigger.

## 4. Standing bans, unchanged

No scroll-lock, no custom cursor (system cursor everywhere), no
marquee (reference logo row verified static), no fake people, no
invented numbers, reduced-motion fallbacks on every new layer.
