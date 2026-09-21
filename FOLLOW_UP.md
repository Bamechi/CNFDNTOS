# Follow-up work after Round Two

`bd` is not installed, so follow-ups are retained here rather than in beads.

## External configuration needed

- Provide a Claude API key/model in the server environment to activate Knowledge Q&A, conversational Output and generated summaries. Local structured drafts are available and labeled.
- Configure a Google OAuth Web application to activate Calendar connection. Read-only OAuth/import/sync/disconnect are implemented and mocked tests pass; real account authorization has not been exercised.
- Supply a local folder of rights-cleared focus-music tracks. Player controls and recording pause are implemented; no tracks have been supplied.
- Supply the destination Git remote. The parent repository is the unrelated FactoryKeys home-directory repository; this app remains isolated and locally committed.

## Later product phases

- Jev classification, confidence thresholds and hosted transcription. All current captures/actions have explicit review; unresolved captures remain pending.
- Production multi-user auth, cloud persistence/private file storage, background jobs, usage billing and cloud backup restore UI. Current quota policy is explicit and server-enforced.
- Image OCR, audio transcription and richer resource extraction with per-user processing budgets. TXT/DOCX/PDF bounded extraction exists.
- Native push/background delivery. Current reminders/comprehensive browser alerts only run while the web app is open.
- Google Drive selected-file source and file-change/access-revocation policy, after Calendar validation. Notion remains optional/later.
- Expo/App Store client and billing, native Apple review API with neutral rating entry at launch; no five-star request.
- Complete the later icon-design pass recorded in `docs/ICON_INVENTORY.md`, including speaker and recognizable notification symbols. Overall MVP behavior is now implemented and independent of per-World active-three queues.
- Add a user-facing Knowledge conversation history browser if desired. Current-session follow-up works; server conversation records are included in portable backups.

## Cinematic revision handoff
- Beads (`bd`) is unavailable on this machine; follow-up items are recorded here.
- Hosted production verification pending while connecting the newly created cnfdnt-os Neon database to Vercel.
- Real microphone recognition remains dependent on browser support/permission; automated checks simulate recognition events.

- GitHub push blocked twice by automatic approval review despite the supplied screenshot and publishing request. Explicit text confirmation requested for public Bamechi/CNFDNTOS main + all eight tracks, then Vercel. Do not retry until that confirmation arrives.
- New Neon database cnfdnt-os exists on the free plan. Its Connect Project dialog is waiting for a Vercel app project. Keep its optional auth add-on enabled: automatic review rejected disabling it.
