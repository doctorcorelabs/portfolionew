# Quote implementation: N2 + V6 + V13 + B15

Base: HEAD fcd6188. Changed file: src/sections/Quote.tsx only (228 insertions, 63 deletions). No commit, no push. This doc is the integration record.

## Variant components

- Narrative N2 (claim + mission, verbatim below).
- V6 Dots to Next Problem: dot trail below the mission.
- V13 Reading Light: dot band sweeping behind the paragraph.
- B15 Tap Bloom: tap bloom plus scroll drift ring in the background.
- No selection frame (no B4). No other section touched.

## Narrative texts (verbatim, verified byte-identical)

Claim (17 words, bold: ward, keyboard,, tools):

"Between the ward and the keyboard, I turn everyday clinical problems into tools people can actually use."

Mission (blue span exactly on "CodeCureConnect:"):

"Through DaivanLabs, I work on CodeCureConnect: code that becomes healthcare tools, and connections that carry them further toward higher health standards and lasting change in Indonesia. Curiosity and diverse experiences keep pointing me to the next problem worth solving."

No old mission phrases remain (checked: "I aim to", "enhance health standards in Indonesia", "sustainable change", "lasting positive impacts", "clinical clerk" all absent).

## What changed in Quote.tsx

Narrative swap:

- WORDS array: 15 entries replaced with 17 N2 words. The paint expression already uses WORDS.length, so no threshold edit was needed. Word i paints at progress >= ((i + 1) / 17) * 0.8, so the last word still lands at progress 0.8 and the per-word step tightens from 5.33 percent to 4.71 percent. The 0.35s color transition per word is unchanged.
- Mission paragraph: plain segments plus one blue span on "CodeCureConnect:". The mission ramp is unchanged: opacity 0 at progress at or below 0.8, ramping to 1 at 0.85, with a 14px rise over the same interval.

Bars retired:

- The four blue underline bars from the quote-anim round (barGrowth and barStyle helpers, plus all call sites and their comment block) are deleted. They anchored to the old mission phrases and are not stacked under the new effects. Grep counts for barGrowth and barStyle are both 0, which matters because the build runs tsc with noUnusedLocals.

V6 dot trail (below the mission, inside the text column):

- Box: marginTop 24, maxWidth 640, width 100 percent, height 40, aria-hidden, pointer-events none. Left edges align with the mission (same 640 max width).
- 12 dots, 3px circles at left i * 14, top 18.5, spanning 0 to 157px. Dot i lights (ink, else 20 percent ink) at progress >= 0.82 + i * 0.012, so all are lit by about 0.95.
- Target ring: 24 by 24px at left 182, top 8, 1px ink border at 30 percent, transparent fill. Center dot: 8px blue circle at left 190, top 16. Ring and center dot opacity = clamp01((drawn - 0.95) / 0.05), so both arrive over progress 0.95 to 1.00.
- No transition anywhere in the trail: dots are a step function of scroll progress, fully reversible on scroll back. The trail takes the same drawn value as the rule, so the static branch (drawn 1) renders it fully lit automatically.

V13 reading-light band (behind the paragraph):

- The mission paragraph is wrapped in a position relative div. Before the paragraph, a third dot layer sits absolute inset 0, zIndex 0, pointer-events none, 14px pitch 0.4px dots at 44 percent, masked by a vertical linear-gradient with about 8 percent feather on each side.
- Sweep geometry: band height 40 percent of the mission block, band top = f * 60 percent, where f = clamp01((progress - 0.8) / 0.2). Band top runs 0 to 60 percent as progress runs 0.8 to 1.0. The paragraph itself sits at zIndex 1 above the band.
- The band is rendered only when reducedMotion is false. Because the wrapper tracks the mission block exactly, the band follows wrapped lines on any width with no separate narrow positioning.

B15 background layer (inside the sticky child, before the body, zIndex 0, overflow hidden, pointer-events none, clipped to section bounds):

- Tap bloom: a section-scoped pointer handler records tap coordinates in sticky-child space and bumps a key, which remounts a single 240px ring element (border 1px grey-blue at 45 percent) with the q-bloom keyframe: scale 0.2 to 1, opacity 0.25 to 0, over 1s ease-out forwards. A new tap replaces the previous bloom instead of stacking rings.
- Drift ring: 160px ring, 1px ink border at 15 percent opacity, positioned right 6 percent, top 10 percent + progress * 60 percent, so it travels down the right empty area as scroll advances. It is hidden at max-width 1023px via the q-drift-ring display none rule.
- Reduced motion: the whole B15 layer lives only in the motion return, so it is absent from the static branch. The q-bloom animation is also set to none in the reduced-motion CSS backstop.

Untouched: kicker, dashed rule and nodes, both existing dot layers (base 20 percent with 350px mask and 8s breathe, lit 44 percent with 50px halo and 600ms fade-out), dot entrance over progress 0 to 0.1, cursor plumbing (CSS variables, mouse leave clears lit state), wrapper and sticky CSS, runway heights (2115px desktop, 1265px narrow), the 1023px block, all constants, clamp01, and the scroll and resize effects.

## QA verdicts and the B1 fix

- Layout QA: CONDITIONAL SHIP, disclosure-only (no blocker).
- Motion QA: FAIL on blocker B1.
- Regression QA: CONDITIONAL SHIP, disclosure-only (no blocker).
- B1 (found by motion QA): the V13 band div had no entrance gate, so a static dot strip showed behind the mission while the mission text itself was still at opacity 0 below progress 0.8. The band sweep geometry was correct, but its visibility was not tied to the mission ramp.
- B1 fix: the V13 band div now carries opacity missionOpacity (0 at progress at or below 0.8, 1 at 0.85). Sweep geometry f, top, and height are untouched. Verified boundary after the fix: opacity 0 at progress 0, 0.5, 0.79, and 0.8; about 0.40 at 0.82; 1.00 at 0.85 and above (floating-point hair under 1 at exactly 0.85, renders as final, no visible effect). Reduced motion intact: the band div is still rendered only when reducedMotion is false, and the static branch has no band, no bloom, and no drift ring.

## Build results (integration re-run)

- Command: npm run build (script is tsc --noEmit -p tsconfig.json && vite build).
- Result: PASS. Vite output ends "built in 4.27s", exit code 0, so typecheck and bundle both pass.
- Git status: only "M src/sections/Quote.tsx" modified, plus this doc file untracked (expected; the doc is the one file this integration round was allowed to create).
- Grep counts in Quote.tsx: barGrowth 0, barStyle 0, em dash 0, en dash 0.
- Wording: WORDS join equals the N2 claim byte-identical; mission segments join equals the N2 mission byte-identical.

## Reduced-motion static state (verified by reading)

- Static branch renders body(1): claim fully ink, mission fully visible with no rise, trail fully lit with ring drawn and blue center dot, V13 band absent, B15 layer absent, no tall wrapper, no pinning, no scroll listener.
- CSS backstop confirms: wrap height auto, sticky static, dot breathe none, bloom animation none.

## Live preview checks still owed (Netlify preview, not verifiable in sandbox)

- Three-layer crowding at progress 1.0 and at mid states: V13 band plus V6 trail plus B15 rings in one section. Check the mission stays readable and the layers stay distinct.
- Bloom versus target ring distinction: blooms must stay faint, grey-blue, and large (240px); the target ring stays small (24px) with its blue center dot. If blooms read as a second target, the combination fails.
- Narrow band reading: the V13 band is progress-driven, not phrase-anchored, so on wrap-heavy narrow screens it must read as ambient light, never as exact phrase highlighting.
- 320px fit: computed, not DOM-measured. Text column 240px (320 minus 48px sticky padding minus 32px gutter) fits the trail plus ring ending at 206px (182 + 24). Confirm no clipping on a real 320px device.
- Drift ring placement at wide widths: right 6 percent, travelling from 10 percent to 70 percent of sticky height. Confirm it stays in the empty right area and never crosses the text column.
- V13 band fade-in with the mission ramp: band invisible below 0.8, fading in with the mission to full at 0.85. Confirm no static dot strip shows before the mission appears.

## Verdict

READY FOR PUSH APPROVAL. The parent agent will ask the user separately before any commit or push, per the standing commit-gating rule. No blockers remain in code, wording, build, or reduced-motion handling. The only open items are the live preview eyeballs listed above.
