# CNFDNT OS

Responsive web app implementing the September 20, 2026 Round Two revision. The original black intake and animated Worlds remain, with Projects, priority queues, reference uploads, Output, Issues, and retained institutional memory.

## Run

Requires Node.js 22.13 or newer (tested with 24.16). There is no npm install or build step.

```sh
npm start
```

Open http://localhost:4310, or use `Launch CNFDNT OS.command`. The existing authorized test email/password variants still work. Authentication is single-user test access using server-side scrypt hashing and HttpOnly/SameSite session cookies. Production multi-user authentication remains a separate phase.

The database is `.data/cnfdnt.sqlite` (Git-ignored). Schema migration creates a backup under `.data/backups` and retains Worlds, items, captures, originals and existing relationships. JSON/CSV and a portable JSON backup with original file bytes are available in Settings. Never commit the database or `.env`.

## Current behavior

- Worlds are ongoing domains: six recommended, ten active enforced; archived Worlds excluded. Built-in icon/color choices, owner status override or majority of Active Rocks, Needs review for ties/none. Overview shows Headline, Summary, Updates and Critical before Rocks and Next Moves.
- Projects are finishable work in exactly one World. They can support one primary World-level Rock. To-Dos, Issues, notes, resources and events optionally link to a Project.
- Three Active Rocks per World; the rest are labeled Inactive. Completing/deactivating promotes the next eligible Rock with a persistent due-date-review flag. Up to three Active Rocks across Worlds can be starred as overall MVPs. The global display is cross-World, defaults to due-date order, and saves independent manual and MVP orders. Rock cards open detail pages with Projects, To-Dos, checkpoints and chronological notes.
- New checkpoints are dated milestone records, with a reviewed actionable To-Do offered only within the 14-day window. Linked task edits/completion sync with the checkpoint. Legacy checkpoint To-Do IDs and dates are preserved; future ones remain scheduled rather than appearing early in actionable lists. Deleting a new checkpoint preserves and unlinks its actionable task. No automatic task generation or recurrence scheduler is introduced.
- Immutable server-assigned creation/upload timestamps; due dates, event starts and reminders are distinct. A To-Do’s age is not reset by scheduling. Calendar days 7–13 show Needs review; day 14+ shows Stale — review now. Date-only deadlines expire at the end of the user’s local day. New/changed To-Do dates must be today through creation day +14 inclusive; legacy unchanged dates remain intact and flagged. Reminders offer optional relative choices or an independent absolute time. All unfinished items remain until a person resolves them. Review options include breakdown, Project work, reasoned rescheduling, snooze, dismissal and deletion, with an audit trail.
- Completed Rocks/To-Dos archive after seven days. Projects/Worlds require explicit archive confirmation. Archive is searchable/restorable; notes and resources are retained with parents. Global, World and Project priority scopes are independent.
- Navigable timeline horizon, month/year controls and aligned month grid, seven-day weeks, day commitments and calm empty states. Phone month grids scroll horizontally inside the calendar, rather than overflowing the page.
- Knowledge Base separates scoped Ask Knowledge chat, Upload, Resources and Notes. The read-only chat uses only notes/resource text, keeps server-side follow-up context, validates source IDs and exact supporting excerpts, and opens the underlying record. Unsupported answers are source-free. Without a configured model, it shows a setup state.
- Knowledge Base accepts file selection and drag/drop (mobile file picker), preserves original files and extracts TXT/DOCX/PDF text where supported. Initial quota: 20 MB per file, 200 MB stored originals per account; extraction up to 100 PDF pages/100,000 characters per file. Images/audio are stored but not OCR’d/transcribed. Extracted possible actions are keyword suggestions and require review.
- Output has nine requested templates and a conversation option, editable/saved drafts, source records, and a separate confirmation step for actions. Without Claude credentials it explicitly provides structured local drafts, not AI conversation. With credentials, Claude can use scoped records, including archived context, Worlds and Projects.
- Issues are World-linked with optional Project, context and Open/Solved state. Solve records a proposed resolution and opens review forms for follow-up work. A Rock proposal requires explicit strategic-priority confirmation.
- Visible theme/music/notification controls, profile image, alert categories/lead times/frequency/quiet hours, prominent exports. Browser notifications run only while the web app is open; native push is not connected.
- Connections data is preserved but the required tab and Galaxy navigation are removed. Core terminology is fixed; vocabulary renaming is removed.

## Optional integrations

Copy `.env.example` to `.env` and set values on the server, never in browser code.

### Claude

Set `ANTHROPIC_API_KEY` and an `ANTHROPIC_MODEL` available to your account. Knowledge Q&A and Output then use the Messages API with bounded context and source labels. Generated output never mutates records. Live API usage was not tested without credentials. Reference: https://platform.claude.com/docs/en/api/messages/create

### Google Calendar

Set `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, and `GOOGLE_REDIRECT_URI`. The redirect URI must match the OAuth Web application's authorized URI exactly. Connect through Settings, choose calendars and assign a World to each. The only requested scope is `calendar.readonly`; events are visibly external and uneditable in CNFDNT. Sync is user-triggered, paginated and incremental, handles expired sync tokens by rebuilding selected-calendar copies, deduplicates by calendar/event ID, and removes only imported copies when calendars are deselected/disconnected. OAuth tokens stay in the local database. Live authorization requires the user's Google OAuth setup. Reference: https://developers.google.com/identity/protocols/oauth2/web-server and https://developers.google.com/workspace/calendar/api/guides/sync

### Stripe delivery

Product delivery is mapped in `data/delivery-products.json`. Each Stripe Payment Link, Product ID and Price ID is matched to a CNFDNT product, with delivery records for PDFs, bundles, GPT links, services and community access. Product-specific `assetUrl` values should point to the final customer-facing Google Drive or storage links. Until an `assetUrl` is set, delivery pages fall back to `DELIVERY_FALLBACK_URL` or the configured Drive folder.

Set these production environment variables:

```sh
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
DELIVERY_TOKEN_SECRET=<long random string>
PUBLIC_BASE_URL=https://cnfdnt.co
DELIVERY_FALLBACK_URL=https://drive.google.com/drive/folders/1uHjxD_U1ZvbK3_AF_NE0BMGyLzkZkROY
```

Optional email delivery uses Resend:

```sh
RESEND_API_KEY=re_...
DELIVERY_EMAIL_FROM="CNFDNT <delivery@cnfdnt.co>"
```

After deploying the server, set every Stripe Payment Link to redirect after successful payment:

```sh
PUBLIC_BASE_URL=https://cnfdnt.co STRIPE_SECRET_KEY=sk_live_... npm run configure:stripe-delivery
```

That script finds the 68 mapped Stripe Payment Links and updates their after-payment redirect to `/delivery?session_id={CHECKOUT_SESSION_ID}`. The delivery page verifies the Checkout Session with Stripe before showing products. The webhook endpoint `/api/stripe/webhook` also records the order, generates a 30-day signed access link and sends the optional delivery email when Resend is configured.

### Extraction and music

TXT and DOCX extraction use Python's standard library; PDF extraction requires `pypdf`. Set `EXTRACTOR_PYTHON` if necessary. The local Codex runtime is detected when present. Failed extraction retains the original and reports an explicit status.

The supplied, rights-cleared focus tracks are included in `public/music/`. Track discovery is local; audio starts manually and pauses during voice capture.

## User guide and icon follow-up

Settings → App guide contains the working flows and examples. `docs/ICON_INVENTORY.md` records sidebar, status, action, World, music and notification icons for a later design pass.

## Verification

```sh
npm run check
npm test
```

The tests use a separate temporary SQLite database and port 4312. Browser acceptance uses a separate database on 4313; never seed test data into the live profile. Run `PLAYWRIGHT_MODULE=/absolute/path/to/playwright node scripts/browser-round-two.cjs` against that isolated server for desktop/phone acceptance. See `VALIDATION.md` for scope and results and `FOLLOW_UP.md` for external dependencies and later phases.

## Deployment boundaries

The app binds to localhost by default. Data and preferences can be shared by clients of the same server; cloud hosting, multi-user access, push infrastructure and App Store packaging are not included. For hosted HTTPS, configure secure cookies and proper production authentication before allowing public access. Automatic Jev routing and hosted speech remain unconnected. Google Drive selected-file integration is a later option, not a dependency of the core app. Native rating UI is deferred to the iOS launch; no custom/five-star solicitation exists.

## Cinematic revision / hosting

Run `npm install`, then `npm start` with Node 24. The app keeps local SQLite records under `.data/`; never commit this directory. A Vercel deployment uses a dedicated Neon Postgres `DATABASE_URL` provisioned through the Storage integration. The Express entrypoint is `server.mjs`, with configuration in `vercel.json`. The database adapter refuses to start on Vercel without a durable database.

Eight supplied focus tracks are available under their song titles, with looping edge fades, volume percentage, and a real audio level meter. Music starts only on request. See `docs/CINEMATIC_DESIGN.md` for reference alignment, generated artwork provenance, motion, and mobile behavior.

Validation: `npm run check`, `npm test` (38 tests), and the isolated browser suites on port 4313. Use a separate `DB_PATH` for those suites: they intentionally replace the test profile.

Production: https://cnfdntos.vercel.app — Express on Vercel with dedicated Neon persistence. Optional AI and Google OAuth require separate configuration.
