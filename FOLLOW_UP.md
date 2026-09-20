# Follow-up work after Round One

`bd` is not installed, so follow-ups are retained here rather than in beads.

## External configuration needed

- Provide a Claude API key/model in the server environment to activate conversational Output and generated summaries. Local structured drafts are available and labeled.
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
- Confirm the optional global Focus Three display recommendation. Per-World Active three is independent and enforced.
