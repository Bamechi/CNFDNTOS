# Follow-up work after Round Two

`bd` is not installed, so follow-ups are retained here rather than in beads.

## External configuration needed

- Provide a Claude API key/model in the server environment to activate Knowledge Q&A, conversational Output and generated summaries. Local structured drafts are available and labeled.
- Configure a Google OAuth Web application to activate Calendar connection. Read-only OAuth/import/sync/disconnect are implemented and mocked tests pass; real account authorization has not been exercised.
- Eight supplied focus-music tracks are installed and published.
- Source is published to Bamechi/CNFDNTOS; this app has its own isolated repository.

## Later product phases

- Jev classification, confidence thresholds and hosted transcription. All current captures/actions have explicit review; unresolved captures remain pending.
- Production multi-user auth, background jobs, usage billing and cloud backup restore UI. Single test-profile cloud persistence/private file storage use Neon; quotas are server-enforced.
- Image OCR, audio transcription and richer resource extraction with per-user processing budgets. TXT/DOCX/PDF bounded extraction exists.
- Native push/background delivery. Current reminders/comprehensive browser alerts only run while the web app is open.
- Google Drive selected-file source and file-change/access-revocation policy, after Calendar validation. Notion remains optional/later.
- Expo/App Store client and billing, native Apple review API with neutral rating entry at launch; no five-star request.
- Complete the later icon-design pass recorded in `docs/ICON_INVENTORY.md`, including speaker and recognizable notification symbols. Overall MVP behavior is now implemented and independent of per-World active-three queues.
- Add a user-facing Knowledge conversation history browser if desired. Current-session follow-up works; server conversation records are included in portable backups.

## Cinematic revision handoff
- Beads (`bd`) is unavailable on this machine; follow-up items are recorded here.
- Production database connected to cnfdntos (production only), with sensitive environment variables.
- Live site: https://cnfdntos.vercel.app
- Both password variants, secure session cookies, save/sign-out/sign-in persistence and all eight music byte-range responses verified September 21, 2026.
- Real microphone recognition remains dependent on browser support/permission; automated checks simulate recognition events.
- Optional AI and Google OAuth integrations remain unconfigured.
