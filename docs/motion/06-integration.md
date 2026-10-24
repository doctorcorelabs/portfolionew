# Motion integration (main agent, 2026-10-24)

All 19 motion agents landed (15 original + hero-drag, quote-paint,
contact-dotfield, services-blue). Integration edits by the main agent:

- motion.css `.mv-page` 0.5s eased -> 0.3s spec easing, matching the
  App route fade.
- Works reveal/hover easings aligned from plain `ease` to the spec
  ease-out cubic-bezier(0.22, 1, 0.36, 1).
- Hero: hovering the giant word hides the dashed selection box and
  its handles (live-observed Onlines behavior), returning on mouse out.
- Profile: the word "builds." in the title carries a light-blue
  selection highlight with a blue caret bar (Onlines team-title motif).

Deliberate divergences that remain (evidence-based, not oversights):

- Works stay a hairline index, not a tilted fan-out card deck: the
  reference deck needs cover images this portfolio does not have.
- Header keeps its navigation visible on scroll: the reference fades
  its wordmark out, but this site needs persistent archive navigation.
  The fixed "Start a conversation" CTA already matches the reference.
- No custom cursor: live observation shows the reference uses the
  default system cursor; its drifting cursors are decorative fake
  collaborator cursors, which are not added because they would imply
  collaborators who are not there.
- No marquee: the reference logo row is static (verified across
  screenshots a minute apart).
- No scroll-lock, no Lenis smooth-scroll library, no fake-cursor
  layer: native smooth anchor scrolling is used instead; Lenis would
  need a live-browser test before adoption.
- Hero grid is not sticky: the reference pins its grid while the next
  section scrolls over it; v2's grid fades in with the hero and scrolls
  away with it. Sticky-grid restructuring is left for a later pass.
