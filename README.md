# CNFDNT OS

Responsive web app implementing the September 20, 2026 Round One revision. The original black intake and animated Worlds remain, with Projects, priority queues, reference uploads, Output, Issues, and retained institutional memory.

## Run

Requires Node.js 22.13 or newer (tested with 24.16). There is no npm install or build step.

```sh
npm start
```

Open http://localhost:4310, or use `Launch CNFDNT OS.command`. The existing authorized test email/password variants still work. Authentication is single-user test access using server-side scrypt hashing and HttpOnly/SameSite session cookies. Production multi-user authentication remains a separate phase.

The database is `.data/cnfdnt.sqlite` (Git-ignored). Schema migration creates a backup under `.data/backups` and retains Worlds, items, captures, originals and existing relationships. JSON/CSV and a portable JSON backup with original file bytes are available in Settings. Never commit the database or `.env`.

## Round One behavior

- Worlds are ongoing domains: six recommended, ten active enforced; archived Worlds excluded. Built-in icon/color choices, owner status override or majority of Active Rocks, Needs review for ties/none. Overview shows Headline, Summary, Updates and Critical before Rocks and Next Moves.
- Projects are finishable work in exactly one World. They can support one primary World-level Rock. To-Dos, Issues, notes, resources and events optionally link to a Project.
- Three Active Rocks per World; the rest are labeled Inactive. Completing/deactivating promotes the next eligible Rock with a persistent due-date-review flag. Global Focus Three is optional and explicitly labeled a recommended display rule pending confirmation.
- Checkpoints are canonical linked To-Do records with required description/date. Completion, reopening, editing and deletion are shared across the Rock, Project, World, global To-Dos and Timeline. Deletion warns that the shared checkpoint is removed.
- Immutable server-assigned creation/upload timestamps; due dates, event starts and reminders are distinct. A To-Do’s age is not reset by scheduling. Days 7–13 show Attention; day 14+ shows Critical review. All unfinished items remain until a person resolves them. Review options include breakdown, Project work, reasoned rescheduling, snooze, dismissal and deletion, with an audit trail.
- Completed Rocks/To-Dos archive after seven days. Projects/Worlds require explicit archive confirmation. Archive is searchable/restorable; notes and resources are retained with parents. Global, World and Project priority scopes are independent.
- Navigable timeline horizon, month/year controls and aligned month grid, seven-day weeks, day commitments and calm empty states. Phone month grids scroll horizontally inside the calendar, rather than overflowing the page.
- Knowledge Base accepts file selection and drag/drop (mobile file picker), preserves original files and extracts TXT/DOCX/PDF text where supported. Initial quota: 20 MB per file, 200 MB stored originals per account; extraction up to 100 PDF pages/100,000 characters per file. Images/audio are stored but not OCR’d/transcribed. Extracted possible actions are keyword suggestions and require review.
- Output has nine requested templates and a conversation option, editable/saved drafts, source records, and a separate confirmation step for actions. Without Claude credentials it explicitly provides structured local drafts, not AI conversation. With credentials, Claude can use scoped records, including archived context, Worlds and Projects.
- Issues are World-linked with optional Project, context and Open/Solved state. Solve records a proposed resolution and opens review forms for follow-up work. A Rock proposal requires explicit strategic-priority confirmation.
- Visible theme/music/notification controls, profile image, alert categories/lead times/frequency/quiet hours, prominent exports. Browser notifications run only while the web app is open; native push is not connected.
- Connections data is preserved but the required tab and Galaxy navigation are removed. Core terminology is fixed; vocabulary renaming is removed.

## Optional integrations

Copy `.env.example` to `.env` and set values on the server, never in browser code.

### Claude

Set `ANTHROPIC_API_KEY` and an `ANTHROPIC_MODEL` available to your account. Output then uses the Messages API with bounded context and source labels. Generated output never mutates records. Live API usage was not tested without credentials. Reference: https://platform.claude.com/docs/en/api/messages/create

### Google Calendar

Set `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, and `GOOGLE_REDIRECT_URI`. The redirect URI must match the OAuth Web application's authorized URI exactly. Connect through Settings, choose calendars and assign a World to each. The only requested scope is `calendar.readonly`; events are visibly external and uneditable in CNFDNT. Sync is user-triggered, paginated and incremental, handles expired sync tokens by rebuilding selected-calendar copies, deduplicates by calendar/event ID, and removes only imported copies when calendars are deselected/disconnected. OAuth tokens stay in the local database. Live authorization requires the user's Google OAuth setup. Reference: https://developers.google.com/identity/protocols/oauth2/web-server and https://developers.google.com/workspace/calendar/api/guides/sync

### Extraction and music

TXT and DOCX extraction use Python's standard library; PDF extraction requires `pypdf`. Set `EXTRACTOR_PYTHON` if necessary. The local Codex runtime is detected when present. Failed extraction retains the original and reports an explicit status.

Place supplied, rights-cleared MP3/WAV/M4A tracks in `public/music/`. No music has been supplied with this build. Track discovery is local; audio starts manually and pauses during voice capture.

## Verification

```sh
npm run check
npm test
```

The tests use a separate temporary SQLite database and port 4312. Browser acceptance uses a separate database on 4313; never seed test data into the live profile. See `VALIDATION.md` for scope and results and `FOLLOW_UP.md` for external dependencies and later phases.

## Deployment boundaries

The app binds to localhost by default. Data and preferences can be shared by clients of the same server; cloud hosting, multi-user access, push infrastructure and App Store packaging are not included. For hosted HTTPS, configure secure cookies and proper production authentication before allowing public access. Automatic Jev routing and hosted speech remain unconnected. Google Drive selected-file integration is a later option, not a dependency of the core app. Native rating UI is deferred to the iOS launch; no custom/five-star solicitation exists.
