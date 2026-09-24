# Account seeds

Loaded once, the first time the server starts and finds no profile with that id. Never overwrites an existing account.

| id | Email | Password env var (default) | Seed |
|----|-------|----------------------------|------|
| 1 | amechi@addcolormedia.com | AMECHI_PASSWORD or TEST_PASSWORD (vanta) | built-in demo Worlds |
| 2 | hello@iamphoenixwhite.com | PHOENIX_PASSWORD (phoenix) | phoenix-state.json + phoenix-files.json |

Phoenix seed (seed_version 2, from Phoenix-White_Ori-Import_v2.csv, Sept 24, 2026): six Worlds (Retreats, Events & Partnerships; Origin; Products; Content / Branding; Websites / Apps; Personal Life), 7 Rocks, 17 Projects, 90 To-Dos, 17 Checkpoints, 38 Issues, 3 Notes, plus two searchable resources (Orí Knowledge Base, Down the Rabbit Hole deck text) in the Retreats World.
Import rules applied: past-due To-Dos dated Sept 24 with "Originally due" noted; To-Dos more than 14 days out became Checkpoints on their Rock (or their Project's Rock); the six with no Rock were kept as undated To-Dos with "Target date" in the description.
Reseed: when this file's seed_version is higher than the stored workspace's, the server replaces Phoenix's workspace once on boot (clean break). Password, uploaded files and Knowledge chats are kept. Any Worlds, Rocks or To-Dos created in her account before the reseed are replaced.
Not seeded: source PDFs, DOCX and images (upload in Knowledge Base → Upload; the 42 MB deck PDF exceeds the 20 MB limit, its text is seeded).
