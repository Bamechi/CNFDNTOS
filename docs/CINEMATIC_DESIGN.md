# CNFDNT OS cinematic revision

The supplied dark/light home references govern composition: quiet glass, real textured worlds, a large readable headline, a restrained orbital system, and five World cards across wide screens. At phone widths, the composition stacks above a two-column World grid. Functional views inherit the same materials and controls.

## Motion
- 160-second orbital loops; 3-pixel card float over 9 seconds, paused on hover/focus.
- 420 ms page entrance. No scroll hijacking or long scroll-scrub sequences.
- Voice intake: cyan/violet pill energy; translucent particle brain coheres during recording. Canvas stops when navigating away and skips hidden pages. Reduced-motion preferences suppress animated travel.
- Exact copy: `Hold to speak`, `OR WRITE`, `...LISTENING...`, and `HOME`. Empty captures return quietly to idle.

## Artwork
`public/assets/planet-sapphire.webp` is original generated artwork, compressed from the generated transparent PNG. Generated with the built-in image tool on 2026-09-20: a single obsidian/sapphire planet, irregular hexagonal stone facets, dark center, brilliant restrained blue atmospheric rim, transparent background, no labels or surrounding scene. CSS hue variations give each World a consistent material family. The central world desaturates to onyx.

Future motion prompts should preserve this composition: slow luminous rim, minimal drifting particles, locked camera, no typography baked into footage, seamless loop, dark and light variants. Avoid video backgrounds behind working text and excessive neon outside voice intake.

## Music
Eight user-supplied MP3 originals are included under their exact titles. Audio is off on launch, loops with 2.5-second edge fades, fades on pause/start/track change, and pauses immediately for microphone capture. Web Audio provides gain control and an actual signal level meter; the volume slider also shows percentage. No simulated equalizer.

## Hosting
Express serves the existing app. SQLite remains the local store; DATABASE_URL selects durable Neon Postgres in Vercel. State saves use an atomic comparison to reject stale simultaneous writes. Files upload in 2 MB parts to preserve the existing 20 MB limit within serverless request limits. PDF, DOCX, and TXT extraction runs in Node. Private local records and secrets are excluded from Git.
