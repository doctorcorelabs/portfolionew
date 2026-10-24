# 01 - Onlines Motion Forensics

Date: 2026-10-24. Target: https://onlines.com.ar/ homepage.
Scope: motion facts only. No site copy text and no client names are reproduced here beyond short functional labels needed to identify elements.

## Method and honesty banner (read first)

This run used only text web fetch and web search, because a generic subagent has no live browser and no raw HTML view.

What that means in practice:

- The homepage text fetch returned rendered page text only. It exposed section order and image asset URLs, but it stripped every `<link>` and `<script>` tag, so no theme CSS or JS file URL was exposed by the fetch itself.
- Targeted web searches for the theme assets returned no Onlines asset URL. No asset URL was guessed or constructed in this run.
- Consequence: **zero keyframes, durations, easings, or transition rules were directly measured from Onlines CSS or JS in this run.** Every row below marked UNMEASURED is unmeasured for that reason, not because the effect does not exist.
- Rows marked CARRIED are claims from the prior v1 analysis in `~/workspace/daivanlabs-rebuild/research/03-onlines-layout.md` (24 Oct 2026), which states it fetched the live homepage HTML and the active theme stylesheet. Those values were NOT re-verified in this run. Treat them as leads for the live-browser check, not as fresh measurements.
- Rows marked LIBRARY DEFAULT come from public library documentation, not from Onlines code. They describe what the library does out of the box, not what Onlines configured.

Directly measured from Onlines in this run: 0 animations.
Carried from prior analysis: 5 claims.
Library defaults cited for reference: 2 libraries (Lenis, Swiper).

## Table: element | trigger | duration | easing | transform/opacity | source

| Element | Trigger | Duration | Easing | Transform / opacity | Source file / selector |
|---|---|---|---|---|---|
| Page scroll (smooth scroll layer) | Wheel and touch scroll | UNMEASURED (Onlines config) | UNMEASURED (Onlines config) | Scroll position interpolation, transform-free (library works on native scroll) | CARRIED: research/03 section 10, stylesheet name `lenis.css` only, no selector or value quoted there |
| Hero giant word | Page load | UNMEASURED | UNMEASURED | UNMEASURED (entrance form unknown: fade, rise, or static) | UNMEASURED: text fetch shows the word present, but no animation state |
| Hero dashed selection box and handles | Page load or scroll into view | UNMEASURED | UNMEASURED | UNMEASURED (draw-in, fade-in, or static unknown) | UNMEASURED |
| Claim and mission text blocks | Scroll into view | UNMEASURED | UNMEASURED | UNMEASURED (reveal form unknown) | UNMEASURED |
| Dark services section (3 columns) | Scroll into view | UNMEASURED | UNMEASURED | UNMEASURED | UNMEASURED |
| Dark manifesto section | Scroll into view | UNMEASURED | UNMEASURED | UNMEASURED | UNMEASURED |
| Profile section | Scroll into view | UNMEASURED | UNMEASURED | UNMEASURED | UNMEASURED |
| Works cards | Scroll into view, swipe or drag on carousel | UNMEASURED (Onlines config) | UNMEASURED | UNMEASURED (slide translation is the library default pattern, not a measured Onlines value) | CARRIED: research/03 section 10, stylesheet name `swiper.min.css` only |
| Logo wall (9 monochrome SVG marks) | Hover on a mark; scroll into view | UNMEASURED | UNMEASURED | UNMEASURED (static grid vs marquee vs fade unknown from text fetch) | UNMEASURED: text fetch lists 9 static image references, which proves presence only, not motion |
| Logo mark hover | Pointer hover | UNMEASURED | UNMEASURED | UNMEASURED (opacity change is a common pattern, not measured here) | UNMEASURED |
| Primary CTA button (fixed, top right) | Pointer hover | 0.4s (CARRIED, not re-measured) | UNMEASURED | UNMEASURED (property changed on hover not stated in the carried source) | CARRIED: research/03 section 10, "transisi hover tombol 0.4s" in the prior analysis wording |
| General motion range across the page | All triggers | 0.4s to 1s (CARRIED, not re-measured) | UNMEASURED | UNMEASURED | CARRIED: research/03 section 10, "gerakan dipakai hemat dan lambat (0.4s sampai 1s), tidak ada animasi dekoratif beruntun" in the prior analysis wording |
| Custom cursor | Pointer movement on hover-capable devices | UNMEASURED | UNMEASURED | Custom SVG cursor replaces or augments the system cursor (form UNMEASURED) | CARRIED: research/03 section 10, "kursor kustom SVG di perangkat hover" only |
| Nav links and text links | Pointer hover, keyboard focus | UNMEASURED | UNMEASURED | UNMEASURED (underline growth is a common editorial pattern, not measured here) | UNMEASURED |
| Giant contact block | Scroll into view | UNMEASURED | UNMEASURED | UNMEASURED | UNMEASURED |
| Footer micro text | None observed | None (static) | None | None | Observed: text fetch shows static footer text with no motion cue |
| Page and route transitions | Navigation between pages | UNMEASURED | UNMEASURED | UNMEASURED (site behaves as a single page in the fetch; transition form unknown) | UNMEASURED |
| Marquee or continuous loop | Automatic loop | UNMEASURED (existence unconfirmed) | Linear would be the standard for a loop, but loop existence itself is UNMEASURED | UNMEASURED | UNMEASURED: no looping text appears in the static fetch |

## Libraries detected (attribution strength noted per row)

| Library | Evidence in this run | Version on Onlines | Notes |
|---|---|---|---|
| Lenis (smooth scroll) | CARRIED only: prior analysis names a `lenis.css` stylesheet on the page | UNMEASURED | Prior analysis also names the active WordPress theme as `onlines-web-2026` with block CSS version 7.1.3. Neither the theme version nor the Lenis version was re-verified in this run. |
| Swiper (works carousel) | CARRIED only: prior analysis names a `swiper.min.css` stylesheet on the page | UNMEASURED | No slide count, speed, autoplay, or loop setting was stated in the carried source. |
| GSAP / ScrollTrigger | None found | UNMEASURED | No GSAP or ScrollTrigger string surfaced in any fetch or search result tied to Onlines in this run. Do not assume GSAP is used. |
| Locomotive Scroll | None found | UNMEASURED | No Locomotive string surfaced tied to Onlines in this run. Do not assume it is used. |
| AOS / IntersectionObserver reveal library | None found | UNMEASURED | No reveal library string surfaced tied to Onlines in this run. |

## Library defaults (reference only, NOT Onlines measurements)

These values are useful for the motion build only as starting points, and must not be cited as Onlines values:

- Lenis default scroll animation: duration 1.2 seconds, easing function `(t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))`, lerp 0.1, smooth wheel on, smooth touch off, touch multiplier 2. Source: public Lenis package documentation.
- Lenis recommended CSS classes: `html.lenis` (height auto), `.lenis.lenis-smooth` (scroll-behavior auto with important flag), `.lenis.lenis-smooth [data-lenis-prevent]` (overscroll-behavior contain), `.lenis.lenis-stopped` (overflow hidden), `.lenis.lenis-scrolling iframe` (pointer-events none). Source: public Lenis package documentation.
- Swiper default slide speed in documentation examples: 300 ms. Source: public Swiper usage examples. Onlines speed is UNMEASURED.

## What the text fetch DID establish (measured, non-motion)

- Homepage section order, in order: header with fixed CTA, hero with one giant word, claim block, dark services block, dark manifesto block, profile block, works block, logo wall block, giant contact block, small mono footer. Source: homepage text fetch, 2026-10-24.
- Logo wall presence: 9 monochrome SVG marks in the static fetch. Motion state (static grid vs scrolling strip) is UNMEASURED.
- The page is a WordPress site (media URLs under a standard uploads path). Theme name and version are CARRIED, not re-measured.

## Dominant easing and duration pattern (verdict)

No dominant easing or duration pattern can be established from direct measurement in this run, because zero Onlines animation rules were exposed to the fetch and search tools.

The only pattern available is the carried one from prior analysis: motion is sparse and slow, with button hover transitions at 0.4s and an overall range of 0.4s to 1s, and no chained decorative animations. If that carried claim holds, the pattern for the rebuild is: slow ease-out style motion, sub-second durations, one motion per section at most, no bounce, no spring overshoot. That pattern still needs live confirmation before it is locked as a token.

## Required follow-up (live browser delegation, not doable from here)

To convert UNMEASURED rows into measured rows, a live-browser session must record, on the real homepage:

1. The full list of loaded stylesheets and scripts (network panel), including the theme stylesheet, `lenis.css`, and `swiper.min.css`, with versions and query strings.
2. Computed `transition` and `animation` values for: hero word, selection box, nav links, CTA button, works cards, logo marks, and section headings, in rest, hover, and focus states.
3. All `@keyframes` names in the theme stylesheet, with their durations, easings (cubic-bezier values where present), delays, and animated properties.
4. Whether any scroll-triggered reveal exists (class changes on scroll, IntersectionObserver hooks, or a scroll library driving transforms), and whether the logo wall moves.
5. The Lenis configuration actually instantiated on the page (duration, easing, lerp, smoothTouch), if Lenis is confirmed present.
6. A screen recording or frame notes for hero entrance and any marquee, so duration and easing can be timed rather than guessed.

Until that session runs, no value in the UNMEASURED rows above may be filled from inference, from other agency sites, or from library defaults.
