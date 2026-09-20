# CNFDNT OS

Responsive, runnable local beta based on CNFDNT OS Source of Truth v3 and the supplied visual references. Built with browser-native JavaScript, CSS animation, Node.js and SQLite. No npm dependencies or build step.

## Run

Requires Node.js 22.13 or newer (tested with 24.16).

```sh
npm start
```

Open http://localhost:4310. Sign in with the test email supplied in the project brief and either of the two supplied password variants. Authentication runs on the server; passwords are hashed with scrypt and sessions use HttpOnly, SameSite cookies. This is a single-user test account, not public signup or production authentication.

The first login leads through onboarding. Returning users enter voice intake. Select the CNFDNT logo to open the portal. Voice recognition is browser-dependent and may use the browser vendor's online speech service; typed input is always available. Allow microphone access to test voice.

## Implemented

- Responsive desktop and phone layouts, dark/light preference, original supplied logo, animated procedural Worlds and particle intake.
- Login, logout, saved sessions, seven-step onboarding with resume progress.
- Worlds with purpose and status; Rocks with definition of done, dates, priority, comments and dated checkpoints; to-dos with completion, priority, comments, one extension, age indicators and conversion after 14 days.
- Notes, resources (links and downloadable files up to 4 MB), World connections, global keyword search, interactive World galaxy.
- Timeline list/day/week/month filters, month grid, events, Brain Dump history, typed capture with explicit destination review.
- JSON/CSV export and printable to-do lists.

Data lives in `.data/cnfdnt.sqlite`, excluded from Git. Back up through Settings. Bind defaults to localhost. Do not expose the test account to the public Internet. For an HTTPS deployment set `SECURE_COOKIE=1` and replace test authentication with a production provider.

## Validation

```sh
npm run check
npm test
```

Tests run against a separate temporary database on port 4312; they do not alter the user's profile. They cover login variants, session revocation, persistence, origin checks, input validation, and static delivery.

## Integration boundaries

This is a local beta rather than the proposed cloud architecture. It does not call Jev, Claude, Supabase, hosted transcription, billing, Google Calendar, or Notion. Capture is explicitly user-routed; Knowledge is keyword search and does not claim AI answers. Uploaded files are retained for download, not scanned or indexed. Music requires supplied/licensed tracks. Calendar day/week views are filtered agendas; month is a date grid. Galaxy shows Worlds and their item counts; item-level graph expansion remains follow-up work. Onboarding introduces all seven concepts, with World/Rock/to-do entry; checkpoints and uploads are completed inside a World.

See FOLLOW_UP.md for the production and App Store handoff.
