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

## Round 3b (same day) — Monday notes + Vercel landing fix
- **Landing page now shows on Vercel.** Vercel serves `public/` statically before the Express function, so `public/index.html` was always the app. The landing page is now `public/index.html` and the operating system is `public/os.html`; Express routes `/app` → `os.html` and `vercel.json` carries matching rewrites.
- **Pricing and purchase**: Solo $19/mo ($149/yr), Operator $39/mo ($299/yr), White-Glove Setup $999 one-time (three sessions with B. Amechi, up to one hour each). Monthly/yearly toggle. `CHECKOUT` in `landing.js` takes Stripe Payment Link URLs; until they are pasted in, buttons open a pre-filled email to cnfdnt.ai@gmail.com. Account self-signup is a later phase (single-user auth remains).
- **Dala-style hero**: side-profile brain constellation of coloured outlined triangles with ambient particles, twinkle, drift, pointer parallax, sparks on the outline. Device mockups moved to a "Screens" section with theme-following screenshots.
- **Intake brain**: replaced the two-lobe sphere with a hand-set side-profile brain silhouette (cerebrum, cerebellum, stem), sulci traced inside, outline lit. Sits behind the pill on desktop and above it on phone. Lightning arcs race in from both ends while listening.
- **Dimension pass (Liquid Glass)**: dark tokens lifted (`--bg #0a0e16`, `--panel #111723`), radial ambient light on the shell, panels and cards use layered gradient glass with blur, top highlight, inner shadow and lift; hovered card comes forward while siblings soften; rows highlight on hover.
- **Sidebar**: icons sit in lit tiles, labels 14px, selected item gets a blue-violet tile and glass highlight.
- **Arrows removed** from cards, rows, settings links and menus; edit actions use a pencil icon; navigation is implied by hover and design.
- **Fonts**: detail text (notes, descriptions, sub-copy) raised to 14px.
- **Worlds**: clicking the globe opens World settings; On track / Off track / Auto toggle sits beside the World name and saves instantly; Updates panel removed; headline and summary edit inline on the overview (span two-thirds width); Notes cards are ruled and dashed to read differently from Projects and Rocks.
- **Rocks**: textured card faces with a gem glyph; the three MVPs sit on a gold-edged platform with a star-gem glyph and warm tint; other Rocks stay quiet. Rock detail gains "New Project for this Rock" (pre-linked to the Rock and World). When a linked Project reaches its due date and is still open, opening the Rock prompts: complete it, Rock on track, or Rock off track. Prompt repeats once per day per Project.
- **To-Dos**: filter bar on the global tab — World, Project, Rock, and sort (manual, deadline, oldest, newest).
- **Settings → Import**: Excel and CSV templates in `public/templates/`, CSV upload creates Worlds first, then Rocks, Projects, To-Dos, Issues, Notes with validation (dates, 14-day To-Do window, ten-World cap, Rock due date). Report shown inline.
- Verified: `npm run check`, `npm test` 38/38, no console errors, no horizontal overflow at 1440×900 and 390×844 on app and landing, CSV import exercised in browser (5 records from the template).

## Round 3c — light mode fix, landing v3, timeline, login link
- **Light mode repaired.** Round 3b's token override was written as `:root,[data-theme="dark"]`, which outranked `[data-theme=light]` and painted the light theme with the dark background. Now scoped to `[data-theme="dark"]` only; light theme gets its own glass tokens, hover states and ambient light.
- **Timeline "On the horizon"**: glowing dated nodes, date in a glass pill, titles quiet until hover or keyboard focus (then the node grows, the title brightens, neighbours soften). Breadcrumb raised to 14px/500.
- **Landing v3**: brain constellation removed. Hero is a pinned, scroll-driven orbit navigator: six labeled planets (Speak, Worlds, Rocks, Knowledge, Phone, Membership) orbit the CNFDNT core; each is a link into its section; hover pauses the orbit; scrolling shrinks and rotates the system while the copy lifts away. Section 2 is a live Hold-to-speak demo running the app's own `visuals.js` engine (auto-demonstrates every 7s until touched; press/hold/release with keyboard support and step captions). Section 3 pins the desktop and iPhone frames while the feature list scrolls; the screenshots change per feature. Gallery, phone, pricing (yearly default), access, footer follow.
- Nav is transparent over the hero and only picks up glass once scrolled; the top-left glow moved down and dimmed so the header no longer reads as a separate blue band.
- Wordmark on the landing page is embedded as a data URI (the `landing/wordmark.png` asset had been dropped by the WebP conversion step; restored as well).
- `visuals.js` now positions the intake drawing relative to its canvas, so the same engine runs full-screen in the app and inside the landing demo container.
- Login page: the CNFDNT OS logo links to `/`; the "Home" link remains in the form column.
- Verified: `npm run check`, `npm test` 38/38, no landing console errors, no overflow at 1440×900 and 390×844, light mode screenshots for Worlds, Timeline and Output.

## Round 4 (September 23, 2026) — Orí rebrand, power surfaces, world labels
- **Brand**: the app is Orí. Wordmark (O-ring with gold dot + "rí", inline SVG, `oriWordmark()` in visuals.js) replaces the CNFDNT wordmark in the sidebar, login, intake and footer; `mark()` is now the Orí ring and replaces the crescent in the home core, hold pill and the "brand" World icon. Titles, manifest, guide, login copy updated. CNFDNT OS is not mentioned in the product.
- **Landing**: hero copy from the brand package (Orí / Your inner head. / Capture. Organize. Become. / A second brain. A higher you.); core is an animated Orí mark (eight orbiting dots settle into the ring, then the ring draws in); no pinned hero, so the Speak section follows immediately; feature scroller condensed; gold accent on eyebrows and the Setup plan; light/dark screenshots recaptured for every frame including the intake screens.
- **Home**: the five orbit satellites now represent the user's first five active Worlds, colored by World, labeled with the World's short name (new "Short name · orbit label" field in World settings, up to 14 characters; defaults to the first word of the name) and clickable into the World.
- **Output**: new waveform icon (no stars anywhere); the empty state is a glowing wavelength stage ("Orí Output · A clearer next move."); "What should I do today?" is a power CTA with a rotating gradient ring, light sweep and pulsing icon; Generate draft is a gradient button.
- **Rocks/MVP**: Rocks icon is a boulder; MVP icon is the three-point crown arc from the brand package; MVP · Active is a gold flag badge; heading and slot icons updated; star glyphs removed.
- **Intake**: brain background removed; halo, rings and dust remain.
- Knowledge Base chat requires ANTHROPIC_API_KEY and ANTHROPIC_MODEL in the Vercel environment; the send button is intentionally disabled until they exist.
- Verified: `npm run check`, `npm test` 38/38, no landing console errors, no overflow at 1440×900 and 390×844.

## Round 4c — accent unification, example-World orbit, PAS copy
- Gold (#C9A227) retired everywhere. Single accent #7c7cff (between the hero's "Your inner" blue and "head." violet) on the Orí dot, the acute on the í (rendered as a clipped overlay glyph so it colors only the accent), MVP badges, power surfaces, intro and pricing.
- Landing orbit labels are example Worlds: Personal, Job, Hobby, Money, Relationships, Brand; all link to the Features section. Core is the dark planet with the Orí ring centered, no glow smear.
- Landing copy rewritten on the PAS structure: Problem ("Your best ideas die in the wrong app."), Agitate ("Dropped balls cost more than time."), Solution (Hold to speak; phone section "The idea shows up in the car. So does Orí."); pricing subhead anchors price against one lost deal. Gallery captions state outcomes.
- Logo PNG set regenerated in the accent color, plus an indigo-with-accent variant.

## Round 4d — full wordmark everywhere, demo completes the flow
- The full Orí wordmark (ring, accent dot, "rí" with accent) replaces the ring-only mark on the home core in the app and on the landing core.
- Hero headline is the animated Orí logo: dots orbit in, fuse into the ring, "rí" arrives; then "Your inner head." beneath. Timed to start after the intro (or immediately when the intro was already seen this session).
- Landing demo now completes the real flow: hold (lightning, rings), release ("Captured"), then the stage transitions to the Worlds home screen in a device frame for three seconds before resetting. Auto-demo every 9s until touched.
- Screenshots recaptured (home core shows the wordmark).

## Round 4e — centering, phone orbit, World short name, Output legibility
- Wordmark viewBoxes trimmed to the artwork (`2 0 70 48`, hero/intro `11 0 166 120`) so the logo centers optically on the planet cores, in the intro, and in exported PNGs.
- Landing orbit nodes and app satellites have static base positions; with iOS Reduce Motion (or any reduced-motion setting) they no longer collapse onto one point. Smaller phone orbit and labels; rings stay centered without animation.
- World page shows the World's short name under its globe.
- Output stage: waves moved below the copy, softened and masked out behind the text; copy sits on a soft dark plate with stronger text shadow.

## Round 5 — two accounts (Amechi, Phoenix)
- Multi-account server: login by email; sessions carry the profile id; state, files, knowledge threads, storage quota and Google Calendar integration are scoped per account (AsyncLocalStorage per request). Existing data stays on profile 1; migrations add columns and backfill on first boot; existing sessions keep working.
- Accounts: amechi@addcolormedia.com (AMECHI_PASSWORD / TEST_PASSWORD, default vanta) and hello@iamphoenixwhite.com (PHOENIX_PASSWORD, default phoenix). Seeds in /seeds; vercel.json includeFiles now covers public and seeds.
- Avatar initials derive from the display name (no more hard-coded "BA").
- Importer: past-due To-Dos import dated today with the original date noted; To-Dos more than 14 days out import as Projects; both are listed in the import report.
- Verified: 38/38 tests; account isolation (each account sees only its own Worlds and files; cross-account file request returns 404); migration from a pre-Round-5 database keeps Amechi's login, data and live session.
