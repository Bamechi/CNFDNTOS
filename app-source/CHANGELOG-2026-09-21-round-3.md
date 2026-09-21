# CNFDNT OS — Round 3 (Cinematic polish + landing page), September 21, 2026

## Routing
- `/` now serves `public/landing.html` (marketing landing page with its own light/dark toggle).
- `/app` and `/app/` serve the operating system (`public/index.html`). Login lives there. `express.static` no longer auto-serves `index.html` at `/`.
- `manifest.webmanifest` `start_url` is `/app`. Browser scripts and tests point at `/app`.
- Login page has a small "About CNFDNT OS" link back to `/`.

## Voice intake (public/visuals.js, public/cinematic.css)
- Pulsating neural-cell network drawn inside the pill at all times (blue left, violet/magenta right), faster and brighter while listening.
- Low-opacity wireframe brain (two lobes, nearest-neighbour mesh, glowing nodes) and concentric signal rings behind the pill at idle; coheres while listening.
- Neon rim breathes continuously (`hold-pulse`, `edge-breathe`), amplified in `.recording`.
- Copy unchanged: `Hold to speak`, `OR WRITE`, `...LISTENING...`, `HOME`.

## Motion
- Satellite orbit loop 160s → 75s; orbit rings drift (240–360s); primary planet rotates slowly (420s).
- Floating cards: World cards, Rock/Project cards, MVP slots, glass CTA, login art and onboarding planet drift ~6px with a slight tilt on staggered phases; paused on hover/focus. Reduced-motion still disables all of it.

## Icons (public/visuals.js `paths`)
- Redrawn 24px stroke set: Worlds (planet + ring), Rocks (faceted gem), Projects (layers), To-Dos (circle check), Issues (alert circle), Timeline (calendar), Knowledge (book), Output (sparkle), Brain Dump (plus circle), Archive (box), Settings (gear), sun/moon, speaker, bell, search, star, more.

## Dimension pass
- Layered card lighting/shadows in both themes, glass topbar, hero halo, page-wide soft top light, hover lift on top actions.
- Fixed the visible square around the login planet (`.hero-orb` inset shadow removed).

## Typography
- Manrope is now self-hosted (`public/fonts/`, from @fontsource/manrope, SIL OFL). Previously the stylesheet named Manrope but no font file was loaded, so production rendered fallback type. `server.mjs` mime map gained `.woff2` and `.jpg`.

## Landing page (public/landing.html, landing.css, landing.js, public/landing/*)
- Sections: nav with theme toggle + Log in + Enter, hero with desktop + iPhone frames on orbit rings, proof strip, 8 feature cards, 3 deep dives (Worlds, Rocks, Knowledge), Speak/Sort/Move steps with the intake screenshot, phone section (App Store noted as Phase 2), private-access CTA (mailto cnfdnt.ai@gmail.com), footer.
- Screenshots in `public/landing/` are real captures of this build at 1440×900 (desktop, 2×) and 390×844 (phone, 3×), both themes, WebP. Re-capture after visual changes.
- Theme is stored in `localStorage` key `cnfdnt-landing-theme`; default dark.

## Verified
- `npm run check` passes; `npm test` 38/38.
- Desktop 1440×1000 and phone 390×844: no horizontal overflow on app or landing page; no console errors on landing.
