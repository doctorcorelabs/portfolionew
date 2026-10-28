# Mission paragraph animation: design

Read-only design. No wording changes, no code.
Source: Quote.tsx at HEAD edb7bd6.

## Current state (measured, not assumed)

| Element | Behavior today |
|---|---|
| Claim (H1, 15 words) | Paints pale `#D6D6D6` to ink `#010101`, progress 0 to 0.9, 0.35s per word, reversible |
| Mission paragraph (18px, graphite `#3C3C38`, maxWidth 640) | Opacity 0 at progress <= 0.9, linear to 1 at 1.0, 14px rise; blue span `CodeCureConnect:` in `#0859D4` |
| Mission window | Progress 0.9 to 1.0 = 187.5px desktop, 112.5px narrow |
| Rest of section | Rule draws with progress; dots breathe 8s; reduced-motion: plain static text |
| Palette lock | Ink `#010101`, white, greys, ONE blue `#0859D4`. No new colors or fonts |

The complaint is precise: the mission is the only flat element. Around it, the
claim paints, the rule draws, and the dots breathe; the mission just fades
in, uniform graphite at rest. On a mobile screenshot, nothing catches
the eye.

## Treatment A: clause-by-clause scroll paint

Paint the mission's natural beats pale to graphite in sequence.

| Beat | Text |
|---|---|
| 1 | I aim to enhance health standards in Indonesia, |
| 2 | bring about sustainable change, |
| 3 | and create lasting positive impacts. |
| 4 | I founded DaivanLabs on CodeCureConnect: |
| 5 | code that becomes healthcare tools, |
| 6 | and connections that carry them further. |

- Property: color, pale `#D6D6D6` to graphite `#3C3C38`, 0.35s per beat.
- Window: 0.9 to 1.0 does NOT suffice. Six beats in 187.5px = 31px per beat
  desktop, 19px narrow. One scroll tick can skip a beat; the sequence reads
  as flicker. Widen to 0.75 to 1.0 (468.75px desktop, 281.25px narrow; 78px /
  47px per beat).
- Cost: claim window shrinks 0-0.9 to 0-0.75; per-word step 6% to 5% of
  runway (112.5px to 93.75px desktop, 67.5px to 56.25px narrow). The claim
  paints faster.
- Reversibility: beats unpaint in reverse, like the claim.
- Eye-catching on mobile: weak to moderate. Pale to graphite is a
  low-contrast swing at 18px, far weaker than the claim's pale to ink at
  34-64px.
- Fit: poor. It repeats the claim's mechanism on the next paragraph, so the
  section reads as one trick used twice.
- Readability: weakest. Unpainted beats sit pale over the dot field on
  mobile, and at any mid-window rest position later beats are still pale.
- Reduced-motion: all beats graphite, plain text.

## Treatment B: sequential blue highlight bars (RECOMMENDED)

Grow a blue underline bar under each key phrase in reading order, in the
Onlines-native manner (the reference team section grows a highlight bar 0 to
full; here a flat 3px underline, since the targets are inline
phrases).

| Order | Phrase | Bar window (progress) |
|---|---|---|
| 1 | enhance health standards in Indonesia | 0.80 to 0.85 |
| 2 | sustainable change | 0.85 to 0.90 |
| 3 | lasting positive impacts | 0.90 to 0.95 |
| 4 | CodeCureConnect: | 0.95 to 1.00 |

- Property: one new moving property only, bar scaleX 0 to 1, origin left,
  in sequence. Text color never changes (graphite throughout;
  `CodeCureConnect:` stays blue). Under the already-blue term the bar still
  reads, because growth itself is the event.
- Wrap: on mobile these phrases wrap, so each line fragment carries its own
  growing segment. Rejected: a behind-text highlight band, which fragments
  badly across wraps.
- Window and entrance: widen the mission window 0.9 to 0.8 (claim keeps 0
  to 0.8; per-word step 6% to 5.33%: negligible). Mission window becomes 375px desktop / 225px narrow
  (93.75px / 56.25px per bar). The paragraph fades in over 0.35s (the
  claim's duration, rise 14px to 0) as the window opens at 0.8; bars then
  grow scroll-driven. No bar grows under fading text.
- Easing: ease-out mapping inside each sub-window (fast launch, gentle
  settle).
- Reversibility: bars shrink in reverse; below 0.8 there are no bars and
  the paragraph is out, as today below 0.9.
- Eye-catching on mobile: strongest of the three treatments that animate
  the text itself. Horizontal blue growth is visible in peripheral vision,
  works at small sizes, and blue is the only accent, so it pops against
  graphite and leads the eye to the coined term.
- Fit: distinct yet complementary. Growth versus color flip is a second
  motion vocabulary sharing the claim's grammar (scroll-driven, sequential,
  reversible). The section gains a climax instead of a repeat.
- Readability: safest. Text is fully graphite at every position in the
  window; bars are additive, never cover text; nothing is ever invisible at
  a rest position in the window.
- Reduced-motion: plain text, no bars.
- Minimalism: no new element enters the layout (bars attach to existing
  spans); one existing color, one moving property, four short growths at
  the climax. Nothing loops, nothing autoplays.

## Treatment C: CodeCureConnect chip flow

Three small mono chips below the paragraph (JetBrains Mono, already in use),
lighting in sequence: `Code` -> `Cure` -> `Connect`, with static grey
arrows.

- Property: per chip, unlit = 1px grey border (`#98989C`) + margin-grey
  text; lit = ink border + ink text + blue square bullet.
- Window: 0.9 to 1.0 suffices at a pinch (62.5px / 37.5px per chip);
  0.85 to 1.0 is better (93.75px / 56.25px). Claim cost if widened:
  per-word step 6% to 5.67%.
- Reversibility: chips dim in reverse.
- Eye-catching on mobile: moderate. Novel, but small, and below the
  paragraph, where the eye may not travel after reading.
- Fit: distinct vocabulary, but reads as UI chrome in an editorial
  section: the biggest minimalism cost.
- Readability: the paragraph is untouched, so the mission text stays flat;
  decoration carries all motion while the boring part stays boring. It
  visualizes only the coined term, not the mission's aims: the first
  sentence gets nothing.
- Reduced-motion: chips hidden, paragraph plain.

## Recommendation: Treatment B

| Parameter | Value |
|---|---|
| Spans | enhance health standards in Indonesia; sustainable change; lasting positive impacts; CodeCureConnect: |
| Bar | 3px, `#0859D4`, underline, scaleX 0 to 1, origin left, per line fragment on wrap |
| Windows | Paragraph fades in over 0.35s at 0.8 (rise 14px to 0); bars 0.80-0.85, 0.85-0.90, 0.90-0.95, 0.95-1.00 |
| Claim window cost | 0-0.9 becomes 0-0.8; per-word step 6% to 5.33% of runway |
| Easing | Ease-out mapping inside each bar sub-window |
| Reversibility | Bars shrink in reverse; paragraph fades out below 0.8 |
| Reduced-motion | Plain graphite text, no bars |
| Colors / fonts | No new colors, no new fonts; blue `#0859D4` only |

What A loses: it repeats the claim's mechanism, needs the biggest widening
for six beats, and is weakest on mobile readability (unpainted beats sit
pale). What C loses: it decorates around the paragraph instead of animating
it, covers only the coined term, and adds a UI-chrome row. B alone makes the
mission text itself eye-catching while keeping it fully readable at every
scroll position, distinct from the claim, and inside the existing palette and
motion grammar.
