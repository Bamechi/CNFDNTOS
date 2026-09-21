# Round Two validation

Verified September 20, 2026 with Node.js 24.16 and Chromium. Tests use separate databases on ports 4312/4313; the live profile is never seeded with QA work.

## Automated checks

35 tests pass, including all prior domain/server/Google tests plus:

- Five Worlds with three Active Rocks each; only three overall MVPs; invalid/inactive star rejection; completion removes the star without starring a promoted replacement.
- Separate manual global, per-World and MVP ordering; due sort does not erase manual order.
- Inclusive To-Do day-0/day-14 window, day-15/past rejection, server creation timestamps, unchanged legacy long dates.
- Calendar aging at day 7 and day 14, midnight and DST boundaries, date-only local end-of-day and explicit-time overdue rules.
- Future scheduled checkpoints, within-window actionable task linkage and synchronized completion; preserved legacy checkpoint IDs/timestamps.
- Optional Project-to-Rock associations and cross-World rejection.
- Knowledge scope restriction, follow-up context, exact-quote/ID validation, rejected invented/out-of-scope citations, source-free unknown answer, truthful missing-model API response, no record mutation.
- Portable backups include originals and conversation records.

`npm run check` passes for server, shared domain, UI, guide and integration modules.

## Browser acceptance

`scripts/browser-round-two.cjs` passes on the isolated QA profile:

- Logo → voice intake → portal from Projects, Rocks and Knowledge; Rocks before Projects; phone intake logo.
- Compact World work selector restricts Rocks and Projects to the selected World.
- Twenty Rocks across five Worlds: fifteen active, five inactive, exactly three MVP slots; fourth star rejected. MVP and manual orders persist independently across refresh and due-sort changes.
- Rock card opens detail (not edit modal); notes persist with the Rock; future checkpoint stays scheduled; nearby checkpoint offers a reviewed linked To-Do.
- Same-World Project linking and correct Project-page heading.
- Relative reminder with explicitly chosen time, separate stored reminder/due/creation timestamps.
- Four Knowledge areas, truthful disabled chat setup, TXT upload/extraction/filter and original download.
- Existing Output draft generation and source links remain available.
- Settings guide has fourteen working-flow sections and expands correctly.
- 1440×1000 desktop, 390×844 phone; dark/light views; no document-width overflow or uncaught JavaScript errors in exercised flows.

Visual inspection covered Rock detail, Knowledge, cross-World/MVP cards and phone Worlds/Rocks. Fixed the new phone logo’s light-mode contrast after screenshot review.

## Data and setup boundaries

Schema 3 preserves all preexisting records and legacy checkpoint relationships. A pre-Round-Two live JSON snapshot and an automatic schema-2 migration snapshot are retained under `.data/backups`; no originals or credentials are committed. After restart, verified all 5 Worlds, 13 items, 1 Project and 1 capture were field-for-field unchanged; only the schema version changed.

Live model calls require `ANTHROPIC_API_KEY` and `ANTHROPIC_MODEL`; no real model call is claimed. Grounding/scoping tests use mocked responses; unconfigured browser/API behavior is verified. Google credentials, actual microphone permissions, native background notifications and supplied music remain external setup as recorded in `FOLLOW_UP.md`. No app-store binary or production hosting was created.

---

# Round One validation

Verified September 20, 2026 with Node.js 24.16 and Chromium. Tests used isolated databases; the live profile was not seeded with QA records.

## Automated checks

23 tests pass, covering:

- Legacy migration and preserved relationships, fixed terminology, orphan Inbox preservation.
- Per-World Active three, completion/deactivation queue promotion, majority/tie/override status.
- Stale To-Do retention, independent overdue state, immutable creation timestamps, seven-day archive boundary and no implicit Project/World archival.
- Ten active Worlds, parent association constraints, checkpoint description/date/uniqueness, independent priority scopes.
- Login variants, unauthenticated/invalid-password rejection, HttpOnly/SameSite sessions, logout, state persistence/validation, origin rejection and optimistic revision conflicts.
- Original upload retention, bounded searchable extraction, server-stamped provenance, read-only Output generation and valid source references.
- Mocked Google read-only authorization/sync, pagination-compatible import, duplicate prevention, expired sync token rebuild and disconnect. No Google write requests are made.

## Browser acceptance

- Created a Project in a World and a linked To-Do; persisted correct shared associations.
- Four Rocks: three Active, fourth Inactive; completion promoted queued work with due-date review cue.
- Created a described/dated checkpoint, completed it in global To-Dos, verified completion under its Rock, and reopened it from the Rock.
- Navigated month/year, verified all seven days of Week view and inspected light-mode labels.
- Uploaded TXT through file picker, extracted text, and found the resource by a word present only in extracted content.
- Generated editable Output, verified source links and no record mutation when an action proposal is canceled.
- Created and solved an Issue.
- Checked 390 × 844 phone and 1440 × 1000 desktop views, mobile More navigation, dark/light layouts, calendar scrolling, and no document-width overflow or uncaught JavaScript errors in the tested flows.
- Visually inspected desktop Project overview, light-mode calendar and Output, and phone light/dark home and calendar.

## Live migration

Backups were created before live migration. Verified all five existing World IDs, all eleven existing item IDs, and capture history remained after schema migration. The local app continues on port 4310.

## Limits

Live Claude and Google account calls require credentials and were not claimed as tested. Actual microphone hardware, OS notification delivery and music playback require device permission/supplied tracks; their external behavior was not end-to-end validated. Browser speech remains vendor-dependent. No native App Store client was built in this revision.

## Cinematic revision (2026-09-21)
- Syntax and whitespace checks passed.
- 38 unit/API tests passed, including simultaneous-save conflict protection, exact large-file reconstruction through 2 MB chunks, music inventory, and HTTP range seeking.
- Full Round 2 browser workflow passed with reduced motion at desktop and 390 px phone width.
- Separate cinematic/music verification runs real MP3 playback, exact intake copy, simulated listening events, theme layouts, World controls and measured audio levels.
- Free dedicated Neon database `cnfdnt-os` provisioned; hosted verification is recorded after deployment.

- Cinematic/music browser suite passed after fixing a voice-first silent-playback bug; both desktop themes and phone screenshots reviewed. Exact intake copy and real audio meter verified.
