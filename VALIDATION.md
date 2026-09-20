# Validation

Verified September 20, 2026 with Node.js 24.16 and Chromium.

- Syntax checks passed for server and browser JavaScript.
- Eight isolated server tests passed: unauthenticated rejection, incorrect-password rejection, both authorized password variants, HttpOnly/SameSite cookie settings, persisted profile writes, invalid data rejection, cross-origin rejection, static delivery and logout revocation.
- 390 × 844 phone viewport: no horizontal overflow, no uncaught browser JavaScript errors, World navigation, notes, galaxy, Settings and logout succeeded.
- 1440 × 1000 desktop browser on a separate database: completed all seven onboarding steps, created World/Rock/to-do, added Rock checkpoint and comment, created note and reloaded; onboarding, checkpoint to-do, comment and note remained persisted.
- Visually inspected phone portal, desktop World page and intake.
- Microphone hardware and vendor speech service were not end-to-end validated. Browser-denied/unsupported states have typed fallback.
- Main profile was preserved; write-flow browser tests ran against a separate database on port 4313.

Git commit is local. Push attempt returned `No configured push destination`. The inherited home-directory repository points to FactoryKeys; a new isolated app repository avoids publishing this project to that unrelated destination. Beads is not installed, so follow-ups are tracked in FOLLOW_UP.md.
