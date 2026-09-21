# Icon inventory — later design pass

Round 2 records the existing vocabulary; it does not commission or replace icons. Source: `public/app.js`, `public/style.css`, `public/assets/wordmark.png`, `public/assets/icon.svg`, and `public/manifest.webmanifest`.

## Navigation and chrome

| Location | Current asset/glyph | Meaning and accessible name | Later review |
| --- | --- | --- | --- |
| Portal logo, phone logo | CNFDNT wordmark PNG + OS | Button: “CNFDNT — open voice intake” | Preserve dark/light inversion and visible focus |
| Intake logo | Same wordmark | “Open home portal” | Preserve inverse navigation |
| Worlds | ◉ | Visible Worlds text | Consistent circle/orb family |
| Rocks | ◇ | Visible Rocks text | Coordinate with MVP star, keep distinct |
| Projects | ▱ | Visible Projects text | Keep distinct from Studio World icon |
| To-Dos | ✓ | Visible To-Dos text | Distinguish unchecked/checked state |
| Issues | ! plus count badge | Visible Issues text and count | Ensure count remains legible |
| Timeline | ▦ | Visible Timeline text | Calendar grid metaphor |
| Knowledge Base | ⌘ | Visible Knowledge Base text | Consider clearer knowledge/book metaphor |
| Output | ✧ | Visible Output text | Distinguish from Spark World asset |
| Brain Dump | ＋ | Visible Brain Dump text; phone circle | Capture rather than generic add ambiguity |
| Archive | ▤ | Visible Archive text | Archive/storage metaphor |
| Settings | ⚙ | Settings & backup | Recognizable gear |
| Mobile More | ☰ | “More navigation” | Preserve keyboard menu navigation |
| Theme | ☼ / ☾ | “Switch to light/dark mode” | Test both themes and contrast |
| Music | ♩ paused / ♫ playing | “Focus music” | **Replace with recognizable speaker in later design pass** |
| Notifications | ♧ | “Notifications” | **Replace with recognizable notification/bell symbol later** |
| Account | BA fallback or supplied image | “Account settings”; image “Your profile” | Initials should eventually derive from profile name |
| App/install icon | assets/icon.svg | Manifest application icon | Check maskable/native variants in phase 2 |

## World choices

The same chosen color and symbol appear on World cards and headers, Project cards, Rock cards, and compact work context. Labels accompany symbols; meaning is not conveyed by color alone.

| Stored choice | Current rendering | Picker label |
| --- | --- | --- |
| orb | Animated blue orb; ◉ in compact tags | Orb |
| brand | ‹ over orb | Brand |
| spark | ✧ over orb | Spark |
| compass | ⌖ over orb | Compass |
| leaf | ❧ over orb | Leaf |
| studio | ▱ over orb | Studio |

Six allowed colors: `#7298ff`, `#65bbcf`, `#a294e8`, `#91bc9c`, `#dab27b`, `#de91a6`. The picker labels color swatches by their hex values. A later pass should add plain-language names (blue, teal, lavender, green, gold, rose), verify contrast for each in both themes, and review the negative-space brand asset at small sizes. Orb motion supports reduced-motion preference; icons in compact World tags are decorative beside the World name.

## Status and actions

| Family | Current glyphs/assets | Accessible treatment / later work |
| --- | --- | --- |
| Overall MVP | ★ / ☆ | “Mark overall MVP” / “Unstar overall MVP”, aria-pressed; empty slots numbered 1–3 |
| Track / review | ● on/off, ◌ review, textual badges | Words accompany color; review badge contrast in light/dark |
| Complete / reopen | Empty square / ✓ | Record-specific Complete/Reopen accessible labels |
| Inactive / finished | Text plus quieter cards | Preserve operability and legibility |
| Age / overdue | Yellow/red text badges | Needs review, Stale — review now, Overdue, Long-dated — review |
| Add / create | ＋ / + | Visible type-specific Add/New text |
| Open / source / edit | ↗ / → | Usually visible label; icon-only controls name record/action |
| Return / previous / next | ← / → | Text back links; period buttons include previous/next unit |
| Priority / MVP reorder | ↑ / ↓ | Named record, direction and separate queue/list/MVP scope |
| Promotion | ↑ | Text “Promoted to Active · review this due date” |
| Timeline Rock / checkpoint / task / event | ◇ / ◆ / ✓ / ◷ | Date and title accompany markers |
| Download / export | ↓ | Visible Download original / JSON / CSV / backup text |
| Upload | ↥ | Visible choose/drop-file text and native file input |
| Search | ⌕ | Inputs have labels; keep small resource browse control |
| Rock help | i | “Learn about Rocks” |
| Close dialog / delete checkpoint | × | “Close dialog” / record-specific Delete checkpoint |
| Delete / archive / restore | Text actions | Destructive confirmation names scope; retained-work explanation |
| Voice / capture | ⌁ | “Hold to speak”; typing alternative and permission status |
| Output / onboarding decoration | ✧, orb and orbit shapes | Decorative; visible titles carry meaning |
| Text disclosure | Native summary marker | Rocks history, extracted text, guide sections use native disclosure |
| Onboarding progress | CSS dots | Text step count also visible |

## Theme and accessibility review

Both existing light/dark token systems are retained. Round 2 browser checks cover desktop Rocks, Rock detail, Knowledge, and phone Worlds/Rocks. Controls added this round have visible labels or accessible names. Future icon artwork must retain these labels, focus indicators, reduced-motion handling and non-color status text. Recheck glyph fallback across Safari/iOS, SVG contrast, touch targets and screen-reader pronunciations in the dedicated design pass. Do not treat this inventory as proof of a full WCAG audit.

## Cinematic update
Sidebar and top-bar controls now use the consistent 22 px SVG icon set in `public/visuals.js`. Music uses a speaker icon, search a magnifier, and notifications a bell. The intake uses the curved CNFDNT brand mark. During music playback, a percentage appears below the speaker; the player dialog provides the slider and measured audio meter.
