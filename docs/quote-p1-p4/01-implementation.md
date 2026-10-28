# Quote P1-P4 implementation

Base HEAD: d8cd5fd. Only file changed: src/sections/Quote.tsx. No commit, no push.

## P1: presence boost

- V13 reading-light band: dot alpha 0.44 to 0.60, dot size 0.4px to 0.6px, band height 40 to 50 percent of the mission block. Sweep still runs top 0 to 60 percent, so at f = 1 the bottom edge is 110 percent, capped by the mask at 100 percent: the end-state visible band is the bottom 40 percent of the mission block, denser than before. Feather kept at about 8 percent each side. Band stays at z-index 0 behind the paragraph.
- V6 dot trail: dots 3px to 4px, unlit dots 20 to 30 percent ink, ring 24px to 32px at left 178, center dot 8px to 10px at left 189. Ring ends at 210px, inside the 240px text column at 320px viewport width.
- B15 drift ring: 160px to 200px, opacity 0.15 to 0.25, still right 6 percent, still hidden below 1024px.

## P2: rest-state life

- Auto bloom: a new effect fires once per mount when progress first reaches 1.0, centered on the V6 target ring via ringRef, reusing the bloom state and the q-bloom class. The fired flag is set only after both rects read successfully, so a failed measure can retry on the next crossing of 1.0. No fire under reduced motion, no re-fire on scroll back, and a tap before 1.0 does not consume it; a later tap replaces it via the key remount.
- Pulse: the V6 center dot carries class q-pulse-dot only when ringOpacity >= 1, so the ring fade itself stays inline-opacity-driven. Keyframes: 3s ease-in-out infinite alternate, opacity 1 to 0.6. Reduced-motion CSS sets the pulse animation to none.

## P3: bloom discoverability

- Bloom duration 1s to 1.4s, peak opacity 0.25 to 0.35. Size stays 240px, stroke stays 1px rgba(96, 110, 130, 0.45), one bloom at a time with key remount on a new tap.
- Pointer-entry bloom was NOT implemented: it was optional in the proposal and the QA noted its absence as disclosure-only.

## P4: spread the climax

- Claim paint factor 0.8 to 0.7: word i paints at progress >= ((i + 1) / 17) * 0.7, last word at 0.7.
- Mission ramp 0.80-0.85 to 0.70-0.78: opacity 0 at progress <= 0.70, 1 at 0.78, with the same 14px rise.
- V6 dots 0.82-0.952 to 0.72-0.90: dot i lights at 0.72 + i * (0.18 / 11).
- V6 ring and center dot fade 0.95-1.00 to 0.90-1.00.
- V13 sweep 0.80-1.00 to 0.70-1.00: f = clamp01((progress - 0.7) / 0.3), still gated on missionOpacity, so the band is invisible below 0.70 and fully present at 0.78.
- The climax now spans 30 percent of the runway instead of 20 percent. Claim painting and mission motion overlap by design in the 0.70 window.

## Wording, verified byte-identical

- Claim: 17 words, bold on ward, keyboard,, tools.
- Mission: 272 chars, blue span exactly on CodeCureConnect:.
- No em dash, no en dash in Quote.tsx.

## QA verdicts received

- Threshold: SHIP.
- Motion: SHIP.
- Layout: SHIP.
- Regression: CONDITIONAL SHIP, disclosure-only: pointer-entry bloom not implemented as it was optional; V13 end-state band is the bottom 40 percent of the mission block, denser, as commented; live checks owed.
- Mobile-plus-contrast: CONDITIONAL SHIP, disclosure-only: 320px fit computed not DOM-measured with 30px slack; auto bloom at 320px is clipped about 50px on the right by section overflow with center and most of the ring visible, fully fitting at 370px and wider; band stays background texture at 0.60 alpha.

## Integration re-verification (independent)

- git status: only src/sections/Quote.tsx modified before this doc was written; base HEAD d8cd5fd.
- Build: PASS (tsc plus vite, 4.13s, Quote chunk 10.84 kB).
- All P1, P2, P3, P4 values above re-read from Quote.tsx and confirmed present. No pointerenter handler present. Em dash count 0, en dash count 0. Claim 17 words, mission 272 chars, blue span on CodeCureConnect: confirmed by script.

## Live checks still owed on the user preview

- Slow-scroll sequence: claim paints word by word to 0.7, mission fades and rises 0.70-0.78, band sweeps down behind the paragraph 0.70-1.00, dots light in order 0.72-0.90, ring draws last 0.90-1.00.
- Auto bloom at first progress 1.0, centered on the V6 target ring.
- Tap bloom: 1.4s, peak 0.35, single ring, replaced by a new tap.
- Rest-state pulse: center dot breathing 1 to 0.6 after the ring is fully drawn.
- Reduced-motion static rendering: fully ink claim, visible mission, fully lit trail with ring, no pinning, no pulse, no bloom.
- 320px fit: trail plus ring inside the column (computed 30px slack, not DOM-measured); auto bloom partially clipped at 320px, fully fitting at 370px and wider.
- Text contrast at progress 1.0: denser band behind the mission paragraph must stay background texture, not compete with the text.
