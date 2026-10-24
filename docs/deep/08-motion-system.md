# 08 - Global Motion System: Reference vs v2

Deep analysis track, task 8/15. Scope: the reference site's global
motion language (theme crossfade, easing and duration families,
smooth-scroll evidence, entrance choreography, reduced-motion
handling, performance techniques) compared with the v2 motion system
in this tree. No reference copy text, headlines, client names, or
logos are reproduced here. Elements are named functionally only.

## 0. Method and evidence labels (read first)

This task is READ-ONLY toward the reference and toward v2 source,
except for this document.

- A fresh text fetch of the reference homepage was attempted for
  this task. As in doc 01, it returned rendered text and image URLs
  only and stripped every stylesheet and script tag, so no
  stylesheet URL was exposed and no stylesheet could be re-fetched
  from this subagent. No asset URL was guessed or constructed.
- CSS values in this document therefore come from earlier runs that
  did fetch the reference stylesheets directly: doc 02 (visual
  forensics, stylesheets named by block) and research/03 (layout
  analysis, theme stylesheet). Those values are labeled
  VERIFIED-CSS (via doc 02 or research/03) and were not re-measured
  here.
- PARENT-LIVE means the parent agent's live-browser observation of
  the reference homepage (screenshots during reload, slow scroll,
  and hover). It is observation, not a CSS measurement.
- V2-MEASURED means a value read from the current v2 source in this
  tree (tokens.css, motion.css, App.tsx, section files, doc 04,
  doc 06) during this task.
- UNVERIFIED means the claim could not be confirmed from any of the
  above. UNVERIFIED claims are listed as gaps, never filled by
  inference or by library defaults.

## 1. The 0.8s theme crossfade (deep dive)

### 1.1 What it is

The reference has a site-wide theme switch, not a per-section
entrance effect. VERIFIED-CSS (via doc 02): nearly every section
carries a background-color transition of 0.8s with easing
cubic-bezier(0.4, 0, 0.2, 1), plus a matching 0.8s color transition
on titles, descriptions, and borders. Toggling a dark class on the
body crossfades the whole page at once: section backgrounds go to
near-black, cards to dark grey, text to white, dashed borders to
white at 20 percent opacity, and frosted bubbles to a dark
translucent fill.

### 1.2 What toggles it: UNVERIFIED

The stylesheets prove the dark-class mechanism (a class on the body
drives the change) but do not, in the material available here, name
the control that toggles it (a visible theme switch, a
section-driven trigger, or something else) or the exact class name.
Do not build a toggle control by guessing. Any future dark-mode
work must first confirm the trigger in a live browser.

### 1.3 What transitions and what is exempted

| Element group | Crossfade behavior | Evidence |
|---|---|---|
| Section backgrounds | background-color, 0.8s, cubic-bezier(0.4, 0, 0.2, 1) | VERIFIED-CSS (via doc 02) |
| Titles, descriptions, borders | color, 0.8s, same easing | VERIFIED-CSS (via doc 02) |
| Dashed borders | Recolored to white at 20 percent as part of the fade | VERIFIED-CSS (via doc 02) |
| Frosted bubbles | Fill goes to a dark translucent fill | VERIFIED-CSS (via doc 02) |
| Elements with backdrop blur | EXEMPTED during the switch: a switching class removes their blur while the switch runs | VERIFIED-CSS (via doc 02) |
| Hero grid border color | NOT transitioned: the border color change in dark mode is instant | VERIFIED-CSS (via doc 02) |

### 1.4 Why the exemptions exist (performance reasoning)

Both exemptions are frame-budget decisions, stated in the reference
material itself:

- Blur exemption: re-blurring blurred elements on every frame of
  the switch would stall the toggle, so blur is stripped for the
  duration of the switch and restored after.
- Grid border exemption: animating roughly 500 grid cells at once
  would stall the toggle, so the grid border color flips instantly
  instead of fading.
- The general lesson: the crossfade is allowed to be slow (0.8s)
  precisely because the two most expensive properties (blur and
  mass grid recolor) are taken out of the animated set.

### 1.5 What v2 has instead

v2 has no dark mode and no theme toggle, so there is no v2
equivalent of the crossfade. What v2 has in the same problem space:

- Fixed section backgrounds (light, dark #010101, dark #111,
  #F5F5F7) that change as hard cuts when the user scrolls from one
  section to the next. The cuts are softened only by the reveal
  animations on the content, not by any background transition.
- A 300ms opacity route fade (V2-MEASURED, App.tsx), keyed by
  pathname. This is an opacity fade on route change, not a
  background-color crossfade, and it runs at less than half the
  reference crossfade duration.
- Consequence: v2 feels calm for the same reason the reference
  does (slow fades, no jumps), but the specific calm of a whole-page
  color crossfade is absent. It cannot be added without a real dark
  theme to crossfade into, so it belongs to a future dark-mode
  project, not to a motion polish pass. If that project happens, the
  0.8s cubic-bezier(0.4, 0, 0.2, 1) discipline plus the two
  exemptions (strip blur during the switch, flip mass grid colors
  instantly) should be copied as a package.

## 2. Easing and duration families

### 2.1 Reference families (from docs 02 and 03)

| Family | Duration | Easing | Used for |
|---|---|---|---|
| Theme family | 0.8s | cubic-bezier(0.4, 0, 0.2, 1) | Whole-page background and text color crossfade |
| Entrance family | 0.6s to 0.8s | ease-out curves (exact bezier values mostly UNVERIFIED) | Section entrances, card entries, collage rises, watermark rise (0.8s opacity, 1s transform) |
| Hover family | 0.3s to 0.4s | UNVERIFIED bezier; brighter-blue fill change | Pill button visibility (0.3s), button fill (0.34s to 0.4s), social icon lift 3px (0.4s), dotted underline delays (0.3s, 0.6s, 0.9s per line) |
| Physical overshoot family | 0.8s (fan), 0.55s to 0.7s (bubbles) | cubic-bezier(0.34, 1.56, 0.64, 1) | Fan-out cards, app bubbles, collaborator cursors at 0.5 to 0.7 scale |
| Scrub family | 0.35s per word | color transition, scrub-driven | Pinned quote word paint (progress-driven, not timed) |
| Ambient family | 22s loop | ease-in-out alternate | Drifting blurred texture inside the manifesto mockup (130 percent size, blur 16px, up to 100px sideways) |
| Cursor halo family | 600ms fade-out, instant on | UNVERIFIED easing | Dot-field lit layer fade-out on cursor leave |
| Hero frame family | 1000ms | opacity transition | Dashed selection frame fade-in |
| Hero grid family | 0.8s | ease-out | Faint grid fade-in on hero start |
| Team highlight family | 2000ms | ease-out | Selection highlight bar growing across the team title |

Overall reference range (CARRIED via research/03, consistent with
doc 02 values): 0.4s to 1s for interactive motion, with the 22s
texture drift and the 2000ms highlight grow as the only long
exceptions. No chained decorative animations.

### 2.2 v2 families (V2-MEASURED)

| Family | Duration | Easing | Used for |
|---|---|---|---|
| Reveal family | 800ms | cubic-bezier(0.22, 1, 0.36, 1) | Section reveals, row reveals, plot container fade |
| Hover family | 300ms (draw, shift), 400ms (color) | Same cubic-bezier(0.22, 1, 0.36, 1) | Underline draws, row shift 4px, link color |
| Route family | 300ms | Same cubic-bezier(0.22, 1, 0.36, 1) | Route-change opacity fade |
| Pop family | 350ms | cubic-bezier(0.34, 1.56, 0.64, 1) | 10px selection handles, forest-plot point markers |
| Hero family | 1400ms grid, 900ms word, 1000ms frame, 350ms handles, 700ms label | cubic-bezier(0.22, 1, 0.36, 1) except handles (pop) | Hero entrance sequence, total about 2s |
| Scrub family | 0.35s per word | color transition, scroll-progress-driven | Pinned quote paint (runway 1875px desktop, 1125px mobile) |
| Plot family | 400ms axes and reference line, 700ms CI grow, 450ms point pop | ease for reference line, spec ease-out elsewhere | Forest-plot draw-in, 120ms stagger per row |
| Contact family | 900ms word mask, 700ms body and action, 600ms socials | cubic-bezier(0.22, 1, 0.36, 1) | Giant heading line mask, social stagger |
| Stagger family | 80ms steps (rows), 70ms (handles), 90ms (contact words, plot cycle) | n/a | Sibling stagger across sections |

### 2.3 Comparison: easing

| Point | Verdict | Detail |
|---|---|---|
| Single default ease-out | MATCH in spirit, DIVERGE in value | v2 uses one ease-out everywhere (0.22, 1, 0.36, 1). The reference uses ease-out curves for entrances but its exact bezier values are mostly UNVERIFIED, so no numeric match can be claimed. |
| Theme easing | MISSING | The reference theme family cubic-bezier(0.4, 0, 0.2, 1) (standard ease-in-out) has no v2 counterpart. v2 has no ease-in-out family at all. If a theme-like change is ever added, it should use this family, not the reveal ease-out. |
| Overshoot placement | DIVERGE (inverted scale) | The reference reserves overshoot cubic-bezier(0.34, 1.56, 0.64, 1) for large physical objects (fan cards, app bubbles). v2 uses the identical bezier but only for tiny objects (10px handles, plot points). The value matches; the application scale is inverted. v2's choice is spec-sanctioned internally, but it is not a reference measurement. |
| Hover easing | CLOSE | Reference hover is 0.3s to 0.4s; v2 hover is 300ms to 400ms. Same band, bezier UNVERIFIED on the reference side. |
| Scrub easing | MATCH | Both use a 0.35s color transition per word, driven by scroll progress rather than by time. |

### 2.4 Comparison: durations

| Point | Verdict | Detail |
|---|---|---|
| Interactive band | MATCH | Reference 0.4s to 1s; v2 300ms to 900ms for the same classes of motion. |
| Hero grid fade | DIVERGE (v2 slower) | Reference 0.8s; v2 1400ms. v2's grid is nearly twice as slow. Aligning it to 0.8s is the single cheapest duration fix in this document. |
| Hero frame fade | MATCH | Reference 1000ms opacity; v2 1000ms opacity (after the motion-v3 drag task replaced the earlier clip-path draw). Doc 04 section 3 still describes the clip-path version and is stale on this point. |
| Hero total sequence | CLOSE | Reference hero entrance observed at roughly 2s to 3s staged (PARENT-LIVE); v2 totals about 2s. |
| Service card entry | CLOSE | Reference 0.6s plus per-card delay variable; v2 cards stagger via the same reveal pattern at 800ms with 80ms steps. Same shape, slightly slower base. |
| Service card size and pill | DIVERGE (3 details) | Reference cards: 520px min height, 10px radius, homepage pill stays transparent outline and only changes visibility on hover. v2 cards: 480px min height, 16px radius, pill turns solid white on hover (that fill behavior belongs to the reference horizontal card variant, not the homepage vertical variant). |
| Route fade | v2 INVENTION (justified) | The reference is a single page, so it has no route transition to copy. v2's 300ms opacity fade is a reasonable SPA translation, not a reference value. |
| Ambient loop | MISSING | Reference has one 22s drifting texture loop. v2 has no looping ambient motion at all. This is a deliberate v2 gap, not an oversight in one file. |

## 3. Smooth-scroll implementation evidence

### 3.1 What is evidenced

| Evidence | Strength | Detail |
|---|---|---|
| A stylesheet named lenis.css is present on the reference page | CARRIED (via research/03 and doc 01) | Stylesheet presence only. No rule, version, or configuration was recovered in the material available here. |
| Smooth scrolling feel | PARENT-LIVE (qualitative) | The live observation describes calm, smooth scrolling and a scrub-linked word fill, but did not record a scroll library, a scroll position curve, or a configuration. |
| Lenis configuration (duration, easing, lerp, smoothTouch, wheel vs touch behavior) | UNVERIFIED | No instantiation code was recovered. Do not cite any Lenis setting as a reference value. |
| GSAP, ScrollTrigger, Locomotive | NO EVIDENCE | No string tied to the reference surfaced in doc 01's fetches or searches. Do not assume them. |

### 3.2 Library defaults (NOT reference values)

Public Lenis documentation defaults, for orientation only: duration
1.2s, an exponential easing function, lerp 0.1, smooth wheel on,
smooth touch off. These describe the library out of the box. They
must never be quoted as the reference configuration.

### 3.3 v2 position

v2 uses native CSS smooth scrolling for in-page anchors only,
instant scroll on route change, and no smooth-scroll library.
Doc 04 bans smooth-scroll libraries as a design decision, and the
motion-v3 integration kept that ban. Assessment: v2's scroll feels
close to the reference for anchor jumps, but it has no momentum or
inertia layer, so long wheel scrolls feel native rather than
studio-smooth. Closing that gap would mean adopting Lenis (or
equivalent) and testing it in a live browser first, because a
momentum layer interacts with the pinned quote paint, the sticky
hero grid behavior, and anchor scrolling. It is the largest
remaining global-motion divergence that is not blocked by an
accessibility ban.

## 4. Entrance choreography rules

### 4.1 Reference rules (from docs 02 and 03)

1. One motion per section at most. The page is mostly still and
   typographic; motion appears as a response to a visitor action
   (hover, scroll, click) or as one slow ambient element, never as
   competing effects in the same viewport.
2. Staged hero, then stillness. The hero runs one staged entrance
   (word, frame, grid, collage items) and then stops. Nothing loops
   in the hero except the slow drift of decorative collaborator
   cursors (JavaScript-driven, frame by frame).
3. Visible-class pattern. Entrances are CSS states switched by a
   class added when an element becomes visible (service cards start
   at opacity 0 and 40px down, team cards at scale 0.5 and opacity
   0, watermark at 20px down and 0.98 scale). The class, not a
   timeline, is the trigger. The JavaScript that adds the class is
   UNVERIFIED in detail (observer vs scroll handler).
4. Per-card delay variables. Stagger is expressed as a delay
   variable per card (service cards, fan cards at 0.15s steps,
   dotted underline delays at 0.3s, 0.6s, 0.9s per line), not as
   separate animations per element.
5. Overshoot is for physical objects only. Fan cards and app
   bubbles get the overshoot curve; text gets plain ease-out. Text
   never bounces.
6. Hover is not the payoff for cards. The fan cards have no hover
   rule in the fetched CSS: no scale, no lift, no overlay. The
   payoff is the entrance fan. Service cards likewise change only
   pill visibility on hover, not lift or shadow.
7. The quote paint is the exception to one-shot entrances. It is a
   scrub: pinned, progress-driven, reversible in principle (the
   exact scroll-to-word mapping is UNVERIFIED in CSS; the mapping
   lives in JavaScript).
8. Dark sections have no scroll entrance in CSS. Their drama comes
   from the theme crossfade and the slow texture drift, not from
   reveal-on-scroll.

### 4.2 v2 rules (V2-MEASURED, doc 04 plus motion-v3)

1. Reveal everywhere. Every section and archive page reveals on
   scroll (IntersectionObserver, threshold 0.15, fires once,
   disconnects). This is the largest philosophical divergence from
   rule 1 above: v2 chose consistent reveals over selective
   stillness, because a multi-page research portfolio has many more
   sections than the reference homepage.
2. Fires-once everywhere except the quote. All v2 reveals fire once
   and never replay on scroll up, matching the reference's
   one-shot character and the doc 05 principle that replays cause
   dizziness. The quote paint is the deliberate exception: it is
   progress-driven and reverses when scrolling back up, matching
   the reference quote behavior.
3. Staged hero, then stillness, plus drag. v2's hero runs one
   staged sequence (grid, word, frame, handles, label, about 2s)
   and then stops, except that the frame becomes draggable on
   fine-pointer devices. Drag is user-driven, not ambient, so it
   does not violate the stillness rule.
4. Stagger steps are uniform (80ms rows, 70ms handles, 90ms contact
   words) rather than per-card delay variables. Same effect, less
   flexible token.
5. Plot draw-in follows a fixed order (axes, reference line,
   whiskers from center, point pops, labels) with 80ms to 120ms
   staggers. The reference has no forest plot, so this order is a
   v2 translation of the entrance rules, not a copied pattern.
6. Hover changes one property only (underline draw, 4px title
   shift, pill visibility, dot halo), never lift or shadow. This
   matches reference rule 6 closely, except for the service pill
   fill detail noted in section 2.4.

### 4.3 Choreography comparison table

| Rule | Reference | v2 | Verdict |
|---|---|---|---|
| Motion per section | At most one | One reveal per section, plus hover | CLOSE (v2 adds hover as a second, quiet layer) |
| Reveal trigger | Visible class, JS detail UNVERIFIED | IntersectionObserver, threshold 0.15, once | CLOSE (mechanism plausibly identical in effect) |
| Replay on scroll up | Not evidenced for entrances | Never (except quote scrub) | MATCH in effect |
| Stagger | Per-card delay variables, 0.15s fan steps | Uniform 80ms steps | CLOSE |
| Dark sections entrance | None in CSS | Full reveal like every section | DIVERGE (v2 animates what the reference leaves still) |
| Card hover payoff | None (fan), pill visibility only (services) | Underline draw, title shift, pill fill (services) | CLOSE except services pill fill |
| Continuous motion | One 22s texture drift, cursor-driven dot halo, drifting cursors | None looping; dot halo is cursor-driven only | PARTIAL (halo matches, drift missing) |
| Hero after entrance | Static except drifting cursors | Static except draggable frame | CLOSE (different second life: drag vs drift) |

## 5. Reduced-motion handling

| Aspect | Reference | v2 | Verdict |
|---|---|---|---|
| Service cards | Render fully visible with no transition (VERIFIED-CSS via doc 02) | Same, via global block plus per-component guards | MATCH |
| Card hover transitions | Removed under reduced motion (VERIFIED-CSS via doc 02) | Same (hover underlines render static) | MATCH |
| Quote paint | NO reduced-motion rule found in fetched stylesheets (UNVERIFIED) | Static fallback: fully ink words, no tall wrapper, no pinning | v2 EXCEEDS reference coverage |
| Fan-out, dot field | NO reduced-motion rule found in fetched stylesheets (UNVERIFIED) | Dot field: lit layer removed, static faint field, no cursor tracking; fan-out not applicable (v2 has no fan) | v2 EXCEEDS reference coverage where applicable |
| Global kill switch | Not evidenced as a single block | Global block forces durations to 0.01ms, kills animations and transitions, forces reveal visibility; code skips observers and uses instant anchor scrolling | v2 EXCEEDS reference coverage |
| Baseline principle | UNVERIFIED whether the reference defaults to stillness | Doc 05 (internal guidance, not a reference measurement) recommends motion only inside a no-preference query so the default is still; v2 implements motion first with a reduce override, which is weaker than that recommendation | GAP (process, not visual): v2's override approach works when the query is honored, but the no-preference-first pattern is safer |

## 6. Performance techniques

### 6.1 Reference techniques (from docs 02 and 03)

- Transform and opacity only for entrances. Cards move with
  opacity plus translate or scale; the watermark uses opacity plus
  transform; the fan uses rotation, scale, and opacity. No layout
  property (width, height, margin, top, left) is animated for
  entrances.
- Cursor motion without CSS transitions. The decorative
  collaborator cursors are moved frame by frame through
  requestAnimationFrame with no CSS transition on their transform,
  because a transition on top would make them lag behind the
  scroll-driven position.
- Blur and mass-recolor exemptions during the theme switch
  (section 1.4). The two most expensive operations are removed
  from the animated set rather than optimized.
- One slow loop only. The 22s texture drift is the only
  continuously running background animation. Everything else is
  triggered and finite.
- Dotted underlines and hairlines use background gradients and
  scale transforms, not layout changes.
- will-change: NO EVIDENCE in the fetched CSS summaries available
  here. Whether the reference uses will-change anywhere is
  UNVERIFIED; do not claim it does.

### 6.2 v2 techniques (V2-MEASURED)

- Transform and opacity dominate: reveals (opacity plus
  translateY), plot CI bars (scaleX from center), point pops
  (scale), route fade (opacity), hero sequence (opacity plus
  translateY plus scale on handles).
- Two non-transform exceptions: underline draws animate
  background-size (cheap, no layout), and the quote paint animates
  color per word (cheap, no layout). Neither triggers reflow of
  surrounding text.
- will-change is used broadly: motion.css sets will-change
  opacity and transform on reveal roots, and several archive pages
  and sections repeat it. This is heavier than necessary:
  will-change on many simultaneous roots costs memory, and the
  reference material shows the opposite instinct (remove expensive
  work instead of pre-allocating for it). Recommendation: restrict
  will-change to the hero sequence and the plot draw-in, and let
  ordinary reveals run without it.
- Scroll handling: one IntersectionObserver per reveal root
  (threshold 0.15, disconnect after firing) plus one
  requestAnimationFrame-throttled scroll listener for the quote
  paint. No raw scroll listener per row. This matches the
  reference's trigger economy in effect.
- No backdrop blur anywhere in v2, so no blur exemption is needed.
  If blur is ever introduced (for example a frosted header), the
  reference exemption pattern should be copied with it.
- No looping ambient animation in v2. That is good for battery
  and for reduced-motion compliance, and it is also the reason v2
  can feel slightly more static than the reference between
  interactions: the reference always has one slow thing moving
  (the texture drift), while v2 is fully still between scrolls.

## 7. Master comparison table

| Area | Match | Diverge | Missing in v2 |
|---|---|---|---|
| Duration band (0.4s to 1s interactive) | Yes | | |
| Ease-out as default | In spirit (exact reference bezier mostly UNVERIFIED) | | |
| Hero frame fade 1000ms | Yes | | |
| Hero staged entrance then stillness | Yes | | Draggable frame is a v2 addition, not a reference deviation in spirit |
| Quote pinned word paint, 0.35s per word | Structure and timing | Mapping (linear per word to 0.9 progress) is a v2 choice; reference mapping UNVERIFIED | |
| Dot field (14px pitch, 0.4px dots, 20 percent base, 44 percent lit, 50px halo, 350px mask, 600ms fade-out, center park on no-hover) | Yes, all numbers | | |
| Service card entry stagger | Shape | | |
| Service card size, radius, pill fill | | 480px vs 520px, 16px vs 10px radius, solid pill on hover vs visibility-only outline | |
| Hero grid fade | | 1400ms vs 0.8s | |
| Theme crossfade 0.8s cubic-bezier(0.4, 0, 0.2, 1) | | | Entire mechanism (no dark mode in v2) |
| Theme easing family (ease-in-out) | | | No ease-in-out family in v2 tokens |
| Ambient 22s texture drift | | | No looping ambient motion in v2 |
| Overshoot scale | Value identical (0.34, 1.56, 0.64, 1) | Applied to tiny objects in v2, large physical objects in reference | |
| Dark sections entrance | | Reference has none in CSS; v2 reveals them like everything else | |
| Smooth scroll (Lenis) | | Native CSS anchors only; no momentum layer | Lenis config itself is UNVERIFIED, so this is a known-unknown gap |
| Reduced-motion coverage | Service cards and hover | | v2 exceeds reference coverage overall; the no-preference-first pattern is the remaining process gap |
| Performance: transform and opacity only | Mostly | Underline background-size and word color are cheap exceptions | |
| Performance: will-change | | v2 uses it broadly; reference use UNVERIFIED | |
| Performance: blur and mass-recolor exemptions | Not applicable (no blur in v2) | | Becomes applicable only if blur or a theme switch is added |
| Marquee | Both absent (reference logo row verified static by PARENT-LIVE) | | |
| Custom cursor | Both absent (reference uses default cursor per PARENT-LIVE; earlier carried claim of a custom SVG cursor is contradicted by live observation) | | |
| Scroll-lock | Both absent (v2 by accessibility decision; reference lock is an intro behavior v2 deliberately does not copy) | | |

## 8. What is still missing, prioritized

Ordered by how much each item would close the gap without breaking
a standing ban (no scroll-lock, no custom cursor, no marquee, no
invented facts):

1. Confirm the Lenis question in a live browser (stylesheet
   presence is carried, configuration is UNVERIFIED). If Lenis is
   confirmed, adopt it behind a test pass that covers the pinned
   quote, anchor scrolling, and reduced motion. This is the
   largest global-feel gap.
2. Align the hero grid fade from 1400ms to 0.8s. One-line change,
   directly measured reference value.
3. Align the service cards to the homepage variant: 520px min
   height, 10px radius, pill stays transparent outline and only
   changes visibility on hover. Three small values, all measured.
4. Restrict will-change to the hero sequence and the plot draw-in.
   Removes a broad memory cost with no visual change.
5. Add the theme easing family cubic-bezier(0.4, 0, 0.2, 1) to the
   tokens as a reserved token for theme-like changes, even before
   any dark mode exists, so a future theme switch does not reuse
   the reveal easing by accident.
6. Consider one slow ambient element, modeled on the 22s texture
   drift, inside a single dark panel (for example behind the
   manifesto content), with a reduced-motion static fallback and
   no loop anywhere else. This is a proposal, not a reference
   measurement for v2's content, and it should be user-approved
   before building because it adds the only looping motion v2
   would have.
7. Adopt the no-preference-first pattern for any new motion code
   (motion defined inside a no-preference query, stillness as the
   default), per internal doc 05 guidance, instead of the current
   motion-first plus override pattern.
8. Do not chase: a theme crossfade (needs a dark mode first), a
   fan-out deck (needs cover images), a marquee (reference has
   none), a custom cursor (reference uses the default cursor per
   live observation), or scroll-lock (accessibility ban stands).

## Sources

- docs/motion/01-onlines-motion-forensics.md (method limits,
  carried claims, library defaults labeled as non-measurements).
- docs/motion/02-onlines-visual-forensics.md (direct stylesheet
  measurements: theme crossfade, grid fade, quote structure, card
  entry, fan overshoot, dot field, watermark, collage pops).
- docs/motion/04-motion-spec.md (v2 token table, reveal pattern,
  hero sequence, plot order, route fade, reduced-motion block,
  exclusions).
- docs/motion/06-integration.md (motion-v3 integration edits and
  deliberate divergences).
- research/03-onlines-layout.md (theme stylesheet measurements:
  frame fade 1000ms, grid fade 0.8s, scroll-lock class, lenis.css
  presence, custom cursor claim now contradicted by live
  observation, 0.4s hover transitions, 0.4s to 1s range).
- research/05-onlines-interaksi-motion.md (internal guidance, not
  reference measurement: one reveal pattern, fires-once,
  no-preference-first pattern, overshoot ban for text).
- Current v2 source read for this task: src/styles/tokens.css
  (duration and easing tokens), src/styles/motion.css (keyframes,
  reveal classes, will-change, reduced-motion block), and the
  motion-v3 agent reports for Hero, Quote, Services, Contact, and
  the forest plot (timings and behaviors as implemented).
- Fresh reference homepage text fetch for this task: returned
  rendered text and image URLs only, no stylesheet or script URLs,
  so no stylesheet value in this document was re-measured here.
