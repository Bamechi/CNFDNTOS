# Account seeds

Loaded once, the first time the server starts and finds no profile with that id. Never overwrites an existing account.

| id | Email | Password env var (default) | Seed |
|----|-------|----------------------------|------|
| 1 | amechi@addcolormedia.com | AMECHI_PASSWORD or TEST_PASSWORD (vanta) | built-in demo Worlds |
| 2 | hello@iamphoenixwhite.com | PHOENIX_PASSWORD (phoenix) | phoenix-state.json + phoenix-files.json |

Phoenix seed contents: World "Phoenix White" (short name Phoenix), 15 Rocks (3 active, rest queued), 107 Projects, 77 To-Dos, 137 Issues, 218 Notes, plus two searchable resources: the Orí Knowledge Base and the Down the Rabbit Hole sponsorship deck (text).
Import adjustments: past-due To-Dos were dated Sept 24, 2026 with "Originally due …" in the description; To-Dos dated more than 14 days out became Projects (Orí's To-Do rule).
Not seeded (upload in the app, Knowledge Base → Upload): the source PDFs, DOCX and images in Phoenix-White-Ori/sources, and the Breakout workbook tabs the importer does not take (People, Money, Media Quotes, Links, Flags, Afterparty Qs, Website Spec). The 42 MB sponsorship-deck PDF exceeds the 20 MB per-file limit; its text version is already seeded.
