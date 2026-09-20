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
