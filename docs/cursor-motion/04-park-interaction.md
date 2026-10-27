# 04 - Park / interaction decisions: cursor wander redesign

Base: HEAD `3ea8892`. Sources: Hero.tsx loop, CURSOR_CHIPS, FACT_PILLS,
H-bands, desktop-parks/00, seoul-pill/00, laptop-pill/00. Target motion
(onlines hero): random waypoint wander across the full canvas, 70-110
px/s, NO reaction to the real mouse, NO scroll effect, chips pass OVER
word/mockups/cards freely as rigid sprites, z above content.

Motion being replaced: 4 chips on fixed anchors (FAERS, StrokeSense,
Code for Cure, Seoul; wide + laptop companions) with dart-dwell drift
(radius 20/14, 7.2-9.8 mean / 10-14 peak px/s), converge on word hover
(halo 20px, tau 0.22s), scroll phase modulation (cap 0.25 loop). Chips
z 2 above frame z 1, pointer-events none.

## (a) FREE WANDER vs CONSTRAINED WANDER

RECOMMENDATION: CONSTRAINED WANDER. Waypoints ONLY in verified free
space (the existing obstacle grid); paths between waypoints are free
and may cross content transiently. Continuous motion, no dwell at
waypoints (or dwell only at free-space waypoints); speed 70-110 px/s,
matching the target range.

REASONING: the park history rested on one premise: chips REST at
anchors, so a rest park is a permanent defect, while drift transients
up to 16px are tolerated as brief. Wander kills "rest" by definition,
since a chip never sits anywhere. But wander crossings are
categorically larger than drift transients: a 73-130px chip crossing
a 260px card at 70-110 px/s takes 2-4s, not a 16px graze. Free wander
would therefore not relax the old standard but abandon it: a free
waypoint can land mid-poster, where a turning chip lingers, which is
a moving rest park. Constrained wander keeps the one property the
history actually protected: the chip never STOPS on content.
Waypoints are verified like anchors (same grid, same margins); the
speed floor bounds crossing time and waypoints bias travel into open
lanes, so most travel is in free space and crossings are short
perpendicular traversals. The old 16px transient standard is
SUPERSEDED, not violated: it governed drift around fixed anchors;
under wander the governing standard is a DWELL standard: no stopping
on content, no crawling on content.

CONSEQUENCE: anchor lanes retire for normal motion; the obstacle grid,
card boxes, gates, and measurement methods survive as the waypoint
machinery; rest-park scans re-run once against waypoint sets as a
regression guard; pill positions survive as layout (see (e));
converge-path findings go moot if converge drops (see (b)); QA's axis
changes from anchor margins to waypoint freeness plus crossing-time
bounds.

## (b) CONVERGE FATE

RECOMMENDATION: DROP. Delete converge math entirely (wordRect,
blends, eased, nearest-point on the expanded rect, wordHoveredRef for
chips). Verify wordHoveredRef has no other consumer before removing
its wiring.

REASONING: the target has zero mouse reaction, and converge is the
single most mouse-reactive behavior in the current loop. It fights
wander: chips abandon random paths to pile onto the word on hover,
which is the mouse-dependence the user called ugly. It is also the
source of an entire defect class: converge endpoints, paths,
edge-flip risk, and the two disclosed FAERS path crossings (seoul-pill
wide band; laptop-pill whole band x all S). Dropping it kills that
class outright. MODIFY (pause wander on hover without converging) is
worse: a frozen chip mid-canvas ON content is a rest park. KEEP
preserves the defect class and contradicts the target.

CONSEQUENCE: the loop no longer needs wordRef or hoverCapableRef for
chips; touch and hover become identical (wander-only), closing the
touch/desktop asymmetry; the converge QA axis disappears. Word hover
itself (if used elsewhere) is unaffected.

## (c) SCROLL MODULATION FATE

RECOMMENDATION: DROP. No replacement.

REASONING: the target says scroll does not change wandering. Under
wander there is no natural quantity for scroll to modulate: waypoints
are absolute stage positions and speed is bounded 70-110. Adding the
current scrollPhase (clamp(-stageRect.top / stageRect.height, 0, 1) *
0.25, added to psi in both the section loop and the miniature loop)
to a waypoint path would either do nothing or distort paths as you
scroll, which is scroll-coupled motion against the target.

CONSEQUENCE: the tick no longer reads stageRect.top for phase;
offscreen skip stays, since that is visibility, not modulation; the
miniature loop's scrollPhase goes too; wander is scroll-independent
by design.

## (d) H-BAND FATE

RECOMMENDATION: KEEP H3/H4/H6 byte-identical; reduced-motion static
spots = CURRENT anchors; re-verify ONLY that the refactor preserves
the static fallback path.

REASONING: H-bands are reduced-motion-scoped; they never governed
normal motion. Under reduced motion the loop does not run, so chips
sit static at CSS base positions (JSX inline anchor % + CSS
companions). Those static spots are already verified: H1/H2/H5 were
deleted when lanes went rest-clean, and H3/H4/H6 cover the remaining
static parks (Seoul/awards, Seoul/posterwindow, Code for Cure/gutaxis).
Wander changes normal motion only, not the static spots. Inventing
new static spots would force a full re-verification for zero benefit
to users who do not see motion. Anchors therefore stay in the code as
static fallback plus initial render positions, even though the loop
stops using them for motion. Same for TABLET_ANCHORS and MINI
overrides.

CONSEQUENCE: hard constraint on the refactor: JSX anchor % + CSS
companions must render identically with the loop off; if the
refactor changes static computation, H-bands must be recomputed
(flag, not done here). Carried caveat, unchanged: collage float
still bobs cards under reduced motion, so just above a band edge a
card can transiently graze a static chip (Seoul-awards to ~VH 703,
CFC-gutaxis to ~VH 861); separate round, not this one.

## (e) PILLS

RECOMMENDATION: UNCHANGED. Pills are not loop-driven and the wander
redesign does not touch them.

REASONING: FACT_PILLS render as .mv-diorama-pill spans with CSS
mv-float (0 to -10px) plus mv-diorama-in; the loop iterates
CURSOR_CHIPS only, and FACT_PILLS appears only in its definition and
the JSX map. Pills have no drift, converge, parallax, scroll
modulation, or loop transform. Their hides (touch, 900px, strips,
reduced-motion) are CSS-only.

CONSEQUENCE: the seoul-pill wide 15% / 5% and laptop-pill 74%
positions stand as layout; no pill re-verification needed. One new
interaction, accepted under the dwell standard: wandering chips
cross pills more often (chips roam the full canvas, pills sit fixed);
pills paint above chips, so a chip slides UNDER a pill, a traversal,
not a park, same class as chip-vs-card crossings.

## Retires / survives / new

| Retires (normal motion) | Survives | New (fixer builds) |
|---|---|---|
| Anchor lanes, laptop companions as motion (stay as static fallback) | Obstacle grid, card boxes, gates, measurement methods | Waypoint sets per band (wide, laptop, tablet sub-bands, miniature) verified against the grid |
| Drift ellipse, dart-dwell, durations/phases as motion params | Chip visuals, sizes, colors, z 2, pointer-events none, aria-hidden | Wander engine: waypoint picker, path interpolation, 70-110 px/s, turn smoothing, speed floor |
| scrollPhase, both loops | Pill positions, float, hides | Waypoint-freeness + crossing-time QA axis |
| Converge math, residuals, path crossings | H3/H4/H6, reduced-motion hides, offscreen skip, tab-hidden pause | Dwell standard replaces the 16px transient standard |
| Rest-park scans for normal motion (re-run once vs waypoints as guard) | | |

Adjacent flag, not a decision here: collage pointer parallax (+-8px,
mouse-only, collage layer) is NOT chip motion and is untouched by
this redesign, but it IS a mouse reaction. Full onlines fidelity
(zero mouse reaction) would require dropping it too; that is a
separate decision, default keep.
