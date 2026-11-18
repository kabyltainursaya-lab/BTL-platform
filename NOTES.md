# BTL Platform — Learning Log

A beginner-friendly diary of how our platform works. Claude writes the
technical parts; we add our own notes at the bottom of each step.

---

## The big picture (in one minute)

Our platform has four layers, like a library building:

| Layer | Files | Library comparison |
|---|---|---|
| **Content** (the "database") | `data/*.json` | The books and the catalogue cards |
| **Structure** | `*.html` | The rooms and the shelves |
| **Design** | `css/style.css` | The paint, the furniture, the lights |
| **Engine** | `js/app.js` + `js/<page>.js` | The librarian who fetches books and puts them on the shelves |

When someone opens a page, the browser:
1. reads the **HTML** (the empty rooms),
2. applies the **CSS** (the design),
3. runs the **JavaScript**, which **fetches** the JSON files and builds
   the cards, lists and links from them.

That's why adding **one record** to a JSON file makes it appear
everywhere it belongs: we never type the same book into five pages.

### Why we need Live Server
JavaScript reads the JSON files with `fetch()`. For security, browsers
only allow `fetch()` when the page comes from a **server**:
- ✅ VS Code → **Go Live** (Live Server runs a mini server on our Mac)
- ✅ GitHub Pages (a real server on the internet)
- ❌ Double-clicking `index.html` (address starts with `file://`). The
  page will show a red message explaining this.

---

## What each file does

| File | What it's for |
|---|---|
| `index.html` | Home page. **Step 1:** a temporary style guide + "database check". **Step 2:** the bento dashboard. |
| `library.html`, `book.html`, `authors.html`, `author.html` | Books and authors (built in Step 3). |
| `episodes.html`, `episode.html` | Episodes, show notes, quiz (Step 4). |
| `resources.html` | Research database (Step 5). |
| `shelf.html`, `about.html` | My Shelf and About (Step 6). |
| `css/style.css` | The **design system**. Section 1 holds the **design tokens** (colours, fonts, corner sizes). Change a token → the whole site changes. |
| `js/app.js` | The **shared engine**, loaded on every page. Builds the menu, loads JSON data, adds the footer, runs the fade-in. |
| `js/home.js` | Code only for the home page: fills the bento cards. Settings at the top (`FEATURED_AUTHOR_HOURS`, `NEVER_FEATURE`, `ONLY_WITH_PORTRAIT`, `FEATURED_BOOK_ID`, `NEW_RESOURCES_COUNT`). |
| `js/library.js` | Library: fills the filter menus from the data, filters the books, shows shelves or grid. |
| `js/book.js` | Book page: reads `?id=` from the address and builds the page for that one book. |
| `js/authors.js`, `js/author.js` | All authors / one author (same idea as the book page). |
| `js/episodes.js` | Episodes list: one card per episode, status filter buttons. |
| `js/episode.js` | Episode page (`?id=ep1`): video, show notes, transcript, quiz, book, sources. |
| `js/resources.js` | Research database: filters, resource cards, Copy APA citation. |
| `js/shelf.js` | My Shelf: saved items in 3 groups, Mark as watched/read, Remove, Clear (asks first), progress bar. |
| `about.html` | About: mission, Scene → Concept → Echo, 5-step method, CIS circles, Why listen, team, contact, stage 2, image credits. Plain HTML (no data file). |
| `404.html` | Friendly "page not found". GitHub Pages shows it automatically for addresses that don't exist. |
| `data/team.json` | Our team: name, role and `photo` path (empty = paper card with initials). |
| `js/about.js` | Builds the "Meet the team" cards from `team.json`. |
| `data/quotes.json` | Quotes for "Quote of the day". Copied word for word from the 1831 *Frankenstein* (Project Gutenberg #42324), with the chapter. |
| `data/books.json` | Our books. `author` holds an author **id** (like `"mary-shelley"`), which links to `authors.json`. |
| `data/authors.json` | Our authors. `portrait` is empty when there's no public-domain picture (we'll show an initials card). |
| `data/episodes.json` | Our episodes, with show notes and quiz questions. `status` = `published`, `in-production` or `coming-soon`. |
| `data/resources.json` | Extra learning materials (link out only, never upload PDFs). |
| `data/reviews.json` | Real reviews by real people. Empty for now: `[]`. |
| `images/` | Logo, author portraits (`mary-shelley.jpg`, `poe.jpg`, `stevenson.jpg`, `wells.jpg`, `gilman.jpg`, `eliot.jpg`), `frankenstein-engraving.jpg`, book photo. File names: lowercase, no spaces. (Two photos of living authors are stored but **not used**: see the 18 Nov evening update.) |

---

## Words to know (glossary)

- **HTML tag**: a label like `<h1>` or `<nav>` that says what a piece of content *is*.
- **CSS variable / design token**: a named value like `--green: #C3C985;`. Used with `var(--green)`.
- **Class**: a name we give to HTML elements (`class="card"`) so CSS can style them.
- **JSON**: a text format for data. Lists use `[ ]`, records use `{ }`, every name is in `"quotes"`, items are separated by commas. **No comma after the last item!**
- **id**: a short, unique name for a record (`"frankenstein"`). Lowercase, no spaces; use dashes.
- **fetch()**: JavaScript asking the server for a file.
- **async / await**: "wait for the file to arrive, then continue".
- **try / catch**: "try this; if it fails, do the catch part instead of crashing".
- **innerHTML**: putting HTML inside an element with JavaScript.
- **escapeHTML()**: our helper that makes text safe before putting it in HTML.
- **Media query** (`@media (max-width: 900px)`): CSS rules that only apply on smaller screens.
- **aria-label / aria-current**: hidden hints for screen readers (accessibility).

---

## Step 1: Setup and design system ✅

**What was built**
- Folder structure, 10 HTML pages sharing one layout.
- `css/style.css` with tokens, fonts, buttons, pills, tags, cards, sidebar, mobile bottom bar, focus outlines, fade-in.
- `js/app.js`: menu builder, data loader, friendly error message, footer, fade-in.
- All five JSON files with the seed data from our brief.

**How the menu works**
Every page has an empty `<nav id="sidebar"></nav>`. `app.js` fills it
from the `NAV_ITEMS` list. `<body data-page="library">` tells it which
link to highlight. On a laptop it's a slim sidebar; under 900px wide the
**same** menu becomes a bar at the bottom (only the CSS changes).

**TODOs left for us in the data**
- All `summary`, `bio` and `note` fields.
- Ep1: literary technique, modern echo, synthesis (after we confirm the wording), quiz model answer, Google Form links.
- Gutenberg links for the candidate books (the site was down on 17 Nov).
- `galvani-1792-account`: check the author; `ure-1818-linda-hall`: check the year; `piccolino-1998`: verify the DOI; `piccolino-2006`: add issue and pages.
- Subjects for candidate books are **suggestions**: check them.

**Our notes (write here)**
-

---

## Step 2: Home dashboard ✅

**What was built**
- The home page is now a **bento grid**: 8 cards of different sizes in a 6-column grid (2 columns on tablets, 1 on phones).
- Every card except the welcome card is built by `js/home.js` from the JSON files.

**How each card decides what to show**
| Card | Rule |
|---|---|
| Latest episode | Newest `published` episode. If none is published yet → the first `in-production` one (now: Ep 1). |
| Featured author | *(changed 18 Nov)* A different author every 2 hours, from the authors with a portrait (see the "Update 18 Nov (late)" section). |
| Quote of the day | A different quote from `quotes.json` each day, in order, then starts again. |
| Continue watching | Episodes you **saved** that are not marked as watched. |
| Featured book *(added 18 Nov, replaced "New resources")* | The book whose id is in `FEATURED_BOOK_ID`. Shows its CSS cover, title, author, year, era, subjects, its episodes and the buttons Open book / Read it free / Save. |
| Your study week | Days you opened the site this week (remembered in `localStorage`). |
| Quick search | Before typing: the 3 newest resources (the **last 3** records in `resources.json`, so add new ones at the end!). While typing: results from books, authors, episodes and resources. **Suggestion chips** (galvanism, Mary Shelley…) type their words into the box; click again to clear. To change the chips, edit the `<button class="chip" data-query="…">` lines in `index.html`. |
| Hero picture | Fixed in `index.html` (for now our public-domain Mary Shelley portrait, in an arched frame). To swap it: change `src`, `alt` and the caption. Missing file → paper texture. |

**New shared tools in `app.js`** (later pages reuse them)
- `findById(list, id)`: finds one record by id. This is how a book finds its author.
- `hasText(value)`: false for empty fields and `TODO` notes, so visitors never see our TODOs.
- **My Shelf**: `getShelf()`, `isSaved()`, `toggleSaved()`, `saveButton()`. Data lives in `localStorage` under `btl-shelf`.
- `searchAll(data, query)`: the global search.

**Words to know**
- **localStorage**: a small storage box in the browser. It remembers things after you close the tab, but only on that device and browser.
- **Event delegation**: one click listener for the whole page that checks *what* was clicked. That's why Save buttons added later by JavaScript still work.
- **`%` (remainder)**: `7 % 6 = 1`. We use it so the quote list starts again after the last quote.

**Our notes (write here)**
-

---

## Step 3: Library, book pages, authors ✅

**What was built**
- **Library**: search + filters (subject, era, author, only-with-episode, include-proposed) and a Shelves / Grid switch.
- **Book page** `book.html?id=…`: CSS cover, facts, subject tags, summary, Save, "Read it free", linked episodes, linked resources.
- **Authors** and **author page** `author.html?id=…`: portrait or initials card, life years, bio, their books.

**Key ideas**
- **One page, many books.** `book.html` is a template. `getIdFromUrl()` reads `?id=frankenstein`, `findById()` finds the record, and JavaScript fills in the page. A wrong id → friendly "not found".
- **Links between records use ids.** A book stores `"author": "mary-shelley"`; the page looks up that id in `authors.json`. Change the author's name once → it changes on every page.
- **Filter menus come from the data.** Add `"astronomy"` to a book's `subjects` → it appears in the Subject menu automatically.
- **CSS covers.** `coverHTML()` makes a `<div>` coloured with `coverColor`. The gold frame and the spine line are drawn by CSS (`::before` and `::after`). No copyrighted images.
- **Building blocks.** `coverHTML`, `bookCardHTML`, `authorPictureHTML`, `resourceItemHTML` live in `app.js`, so the home page, library, book and author pages all look the same.
- **Subject tags are links**: `library.html?subject=ethics` opens the library already filtered.

**Our notes (write here)**
-

---

## Step 4: Episodes and the episode page ✅

**What was built**
- **Episodes list** with coloured status badges (green = Published, pink = In production, outlined = Coming soon) and filter buttons.
- **Episode page** `episode.html?id=ep1`: video, Save, 4 show-note cards, transcript (opens/closes), quiz, linked book, sources.
- **Quiz engine** `buildQuiz()` in `app.js`.

**How to publish a video**: paste the YouTube link into `"youtube"` in `episodes.json` (full link or just the 11-letter id). The "Video coming soon" box becomes a player. We use `youtube-nocookie.com`, YouTube's privacy-friendly version.

**How to write quiz questions** (in the episode's `"quiz"` list):
```json
{ "type": "multiple-choice", "question": "…", "options": ["A", "B", "C", "D"], "answer": 0 }
{ "type": "yes-no", "question": "…", "answer": "no" }
{ "type": "open", "question": "…", "modelAnswer": "…" }
```
⚠️ `"answer": 0` means the **first** option (computers count from 0!). `1` = second, `2` = third.

**Google Forms**: replace the `TODO` in `"quizForms"` with real links → "Before watching / After watching" buttons appear by themselves.

**Transcript**: paste the text into `"transcript"`. Write `\n\n` (an empty line) between paragraphs.

**Words to know**
- **`<details>` / `<summary>`**: an HTML box that opens and closes without any JavaScript.
- **`<fieldset>` / `<legend>`**: groups the answers of one question, so screen readers read the question with each answer.
- **iframe**: a window that shows another website (YouTube) inside our page.

**Our notes (write here)**
-

---

## Step 5: Resources database ✅

**What was built**
- `resources.html`: search + 6 filters (type, topic, episode, book, level, access), one card per resource.
- Each card: tags, title (links to the real source), authors (year), source, description, our note, topics, "Used in" links, **Open source**, **Copy APA citation**, **Save**.
- Episode and book pages link here, already filtered: `resources.html?episode=ep1`, `resources.html?book=frankenstein`.
- Search results open `resources.html?id=…`, which scrolls to that resource and gives it a gold outline.

**How the APA citation is built** (`apaCitation()` in `app.js`)
`Authors. (Year). Title. Source. Link`
- No year → `(n.d.)` ("no date").
- No author → the title goes first.
- TODO notes are removed (`cleanTodo()`), so they never end up in a citation.
- If the automatic citation isn't right, add a `"citation"` field with the exact text: it is used instead.
- Plain text can't hold italics. Add italics to book titles and journal names in your document.

**Fields in `resources.json`** (new ones marked ★)
| Field | Meaning |
|---|---|
| `source` | Only the real source (journal + volume/pages, publisher, or archive). Used in the citation. |
| ★ `description` | Optional. A short factual description shown on the card, **not** in the citation. |
| `note` | Our own words: why this resource is useful (shown as "Why it's useful"). |
| ★ `citation` | Optional. The exact citation text, if the automatic one isn't right. |

**Words to know**
- **Clipboard**: where "copied" text waits until you paste. `navigator.clipboard.writeText()` puts text there.
- **`scrollIntoView()`**: scrolls the page until an element is visible.

**Our notes (write here)**
-

---

## Step 6: My Shelf, About, reviews ✅

**What was built**
- **My Shelf**: saved episodes, books and resources; "Mark as watched / read"; Remove; "Clear my shelf" (asks "Are you sure?" on the page); progress bar; empty state.
- **Mark as watched / read** buttons also on episode, book and resource pages. Marking something also saves it.
- **About page** with all our v1 texts, the method and CIS framework, the team, contact and "stage 2".
- **Reviews** on book pages: average stars + each review from `reviews.json`.

**Team photos**: now in `data/team.json` (see "Images: how to swap in our photos" below).

**How to add a review** (`data/reviews.json`, a list):
```json
[
  {
    "book": "frankenstein",
    "reviewer": "Kabyltay Nursaya",
    "stars": 5,
    "text": "Our real review, in our own words.",
    "date": "2026-11-19"
  }
]
```
- `book` = a book id. `stars` = 1 to 5. `date` = year-month-day.
- Only real reviews by real people, with their permission to show their name.
- A review whose text starts with `TODO` is not shown.

**Words to know**
- **`<progress>`**: an HTML progress bar. `max` = total, `value` = how much is done.
- **`role="alert"`**: screen readers read this text out loud immediately (we use it for "Are you sure?").
- **Keeping focus**: after the shelf redraws, we put the keyboard focus back on the same button, so keyboard users don't lose their place.

**Our notes (write here)**
-

---

## Step 7: Polish and publish ✅ (waiting for our OK)

**What Claude checked (with Chrome, on 18 Nov 2026)**
- **Screenshots** of every page at laptop size and at a true 360px phone width.
- **Bugs found and fixed:**
  - The sidebar styles never worked: the CSS used the class `.sidebar`, but the page only had the id `sidebar`. On phones the bottom menu was missing! Fixed in `buildSidebar()`.
  - Cards could be wider than a phone screen. Fixed with `minmax(0, 1fr)` in the grid columns.
  - The quiz divider line crossed the question text (a `<legend>` quirk). Fixed by floating the legend.
- **Colour contrast** (WCAG, at least 4.5 : 1 for text): 4 pairs were too light and were fixed (grey text on pink/green cards, faded "coming soon" cards, search-box hint text).
- **Accessibility audit** of all 11 finished pages: every image has alt text, every link/button has a readable name, one `<h1>` per page, no skipped heading levels.
- **Console**: no JavaScript errors and no missing files on any page.
- **Links**: 6 of 10 open (code 200). The 4 Project Gutenberg links returned 503 because Gutenberg was down for maintenance; their content was checked on Gutenberg's official mirror (#42324 = 1831 Frankenstein, #41445 = 1818 edition, #57267 = Aldini 1803). **We still open every link ourselves once before the fair.**

---

## Update 18 Nov: Featured book on Home

**What changed**
- The wide card at the bottom of Home is now **Featured book** (our decision "A"). It replaced "New resources", which showed the same 3 resources as the Quick search card.
- The newest resources are still on Home: in the Quick search card, before you type.
- Checked: the **About** page has all six "Why listen?" points from v1 (short and clear, two subjects at once, full transcripts, real sources, fresh ideas, free anytime).

**How the Featured book card works** (`showFeaturedBook()` in `js/home.js`)
1. Reads `FEATURED_BOOK_ID` (now `'frankenstein'`) and finds that book with `findById()`.
2. Finds the author through the book's `author` id, like the book page does.
3. Draws the cover with `coverHTML()`, the same building block as the Library, so the cover looks the same everywhere.
4. Subject tags are links to `library.html?subject=…`.
5. Episodes come from `episodesForBook()`. "Coming soon" episodes are skipped.
6. "Read it free" only appears if `freeText` is a real link (public-domain books only).
7. The summary is hidden while it still says `TODO`. When we write it in `books.json`, it appears here by itself.

**Layout**: laptop = 3 columns (cover | info | episodes); tablet = episodes move under the cover; phone = everything stacked.

**Our notes (write here)**
-

---

## Update 18 Nov (evening): Women writers & science

**What changed**
- **3 new authors** in `authors.json`: Charlotte Perkins Gilman, George Eliot, Rebecca Skloot (bios are `TODO` for us).
- **3 new books** in `books.json`: *The Yellow Wallpaper* (1892), *The Lifted Veil* (1859), *The Immortal Life of Henrietta Lacks* (2010). Summaries are `TODO` for us. *(Later the same evening: we confirmed them as Episodes 3–5, so they are now `"candidate": false`. See the next update.)*
- **Portraits connected**: Poe, Stevenson, Wells, Gilman, Eliot now show real portraits instead of initials cards.
- **Image files renamed** to clean lowercase names (spaces, commas and apostrophes break links online):

| Old file name (= Wikimedia Commons file) | New file name |
|---|---|
| `Charlotte_Perkins_Gilman_3.jpg` | `gilman.jpg` |
| `George_Eliot,_por_François_D'Albert_Durade.jpg` | `eliot.jpg` |
| `Edgar_Allan_Poe,_circa_1849,_restored,_squared_off.jpg` | `poe.jpg` |
| `Robert_Louis_Stevenson_1885.jpg` | `stevenson.jpg` |
| `H_G_Wells_pre_1922.jpg` | `wells.jpg` |
| `Frankenstein_engraved.jpg` | `frankenstein-engraving.jpg` |

  The old name is kept as the source: `"portraitSource": "Wikimedia Commons, File:<old name>"`. It appears under the portrait on the author page.
- **Frankenstein engraving** is shown on the Frankenstein book page and on the Episode 1 page, with a caption. The caption only says what is printed on the plate itself ("T. Holst, del." = drawn by T. Holst, "W. Chevalier, sculp." = engraved by W. Chevalier).
- **Library**: new **Collection** menu plus a "Women writers & science" chip (Frankenstein, The Yellow Wallpaper, The Lifted Veil, Henrietta Lacks). Link straight to it: `library.html?collection=Women%20writers%20%26%20science`.
- **"Pairs well with"** box on *The Lifted Veil* page, linking to *Frankenstein*.
- **"Find this book"** button for books still under copyright (Henrietta Lacks, Flowers for Algernon, The Stand). It opens an Open Library search. We never link to free copies of copyrighted books.

**New fields in `books.json`**
| Field | Meaning |
|---|---|
| `publicDomain` | `true` = free to read (out of copyright) → "Read it free" button if `freeText` is a real link. `false` = still under copyright → "Find this book" button (Open Library search), never a free copy. |
| `collections` | Optional list, e.g. `["Women writers & science"]`. Every collection name appears in the Library's Collection menu and as a chip, all by itself. |
| `pairsWith` + `pairingNote` | Optional: book ids that go well with this one, and why. Shows the "Pairs well with" box. |
| `illustration`, `illustrationAlt`, `illustrationCaption`, `illustrationSource` | Optional public-domain picture (see the images guide below). |

**New field in `authors.json`**: `realName` (optional), for pen names. George Eliot's page now says "Pen name of Mary Ann Evans".

**What was checked**
- Project Gutenberg numbers: **#1952 = *The Yellow Wallpaper*, Charlotte Perkins Gilman** and **#2165 = *The Lifted Veil*, George Eliot**. gutenberg.org itself gave error 503 on 18 Nov (down again), so this was checked on Gutenberg's official mirror (gutenberg.pglaf.org). **We open both links ourselves once.**
- The Open Library search for *The Immortal Life of Henrietta Lacks* works and finds Rebecca Skloot's book.
- All JSON files load; every portrait file exists; every book's author id exists; no copyrighted book has a free-read link.
- Pages tested in Chrome: Library (with and without the collection), the 3 new book pages, Frankenstein, Episode 1, Authors, George Eliot, Rebecca Skloot, Home. No error messages and no broken images.

**TODOs for us**
- [ ] **Stephen King and Rebecca Skloot photos** (`images/Stephen_King_(cropped).jpg`, `images/Rebecca_Skloot_(7981284630).jpg`): living authors, NOT used yet (initials cards). **Check Wikimedia license (CC BY / CC BY-SA requires attribution) before using.**
- [ ] Frankenstein engraving: confirm the source (which edition + the Wikimedia Commons page) and write it in `"illustrationSource"` in `books.json`. Until then the source line is hidden. Then add it to "Image credits" on `about.html`.
- [ ] Open the Wikimedia Commons page of each portrait and check its licence says public domain (a few Commons files are "restored" versions with their own licence).
- [ ] Bios for Gilman, Eliot, Skloot; summaries for the 3 new books.
- [ ] The `era` of the 3 new books (*Gothic*, *Victorian / Gothic*, *Non-fiction (21st century)*) and the cover colours are **suggestions**: change them if you like.
- [x] Decide: should the 3 new books become Episodes 3, 4 and 5? → **Yes** (see below).

**Our notes (write here)**
-

---

## Update 18 Nov (late): Episodes 3–8 and the rotating featured author

**Episodes** (`data/episodes.json`)
| Episode | Book | Status |
|---|---|---|
| 3 | *The Yellow Wallpaper* (`the-yellow-wallpaper`) | coming soon |
| 4 | *The Lifted Veil* (`the-lifted-veil`) | coming soon |
| 5 | *The Immortal Life of Henrietta Lacks* (`immortal-life-of-henrietta-lacks`) | coming soon |
| 6, 7, 8 | Book to be announced (empty placeholders, like 3–5 used to be) | coming soon |

- The three books now have `"episodes": ["ep3"]` (and ep4, ep5) and `"candidate": false`. In the Library they moved from "Proposed books" to the "In our library" shelf.
- Their book pages now say "Episode 3 about this book is coming soon." instead of "No episode yet." (new code in `episodesHTML()` in `js/book.js`).
- **Titles and disciplines are still placeholders** ("Episode 3", `"TBA"`). When we have the episode question, write it in `"title"` and the subject in `"discipline"`. We didn't use `TODO` here because the title is shown to visitors.

**Featured author on Home now changes every 2 hours** (`js/home.js`)
- The settings at the top of `home.js` replace the old `FEATURED_AUTHOR_ID`:
  - `FEATURED_AUTHOR_HOURS = 2`: how long each author stays.
  - `NEVER_FEATURE = ['daniel-keyes']`: authors who are never featured. Daniel Keyes is **not deleted**: he, *Flowers for Algernon* and Episode 2 stay everywhere else.
  - `ONLY_WITH_PORTRAIT = true`: only authors with a portrait take turns, so Home never shows an initials card. Right now that's 6 authors: Mary Shelley, Poe, Eliot, Stevenson, Gilman, Wells. 6 × 2 hours = everyone is shown once every 12 hours.
- **How it decides (for the judges):** `Date.now()` is the number of milliseconds since 1 January 1970. We divide it by the length of 2 hours to get a "block number" that goes up by 1 every 2 hours. `blockNumber % 6` (the remainder) is always 0–5, which picks one author from the list. Every visitor in the same 2 hours sees the same author; no storage needed.
- Add a portrait to an author in `authors.json` → they join the rotation by themselves.

**Our notes (write here)**
-

---

## Images: how to swap in our photos

**Rule:** we never download images from the internet. Where we have no image yet, the site shows a **designed placeholder** made only with CSS. When a photo is ready, we change **one line**, and the placeholder is replaced. If we make a typo in the path, the placeholder comes back (never a broken-image icon).

| Image slot | Where to change it | Placeholder until then |
|---|---|---|
| **Our team photos** | `data/team.json` → `"photo": "images/nursaya.jpg"` | Paper-texture oval with initials (KN, UN) |
| **Author portraits** (public domain only!) | `data/authors.json` → `"portrait"` + `"portraitSource"` | Dark card with gold frame and initials |
| **Book covers** | Never images: `data/books.json` → `"coverColor"` | CSS cover (cloth colour, gold frame, spine) |
| **Book illustration** (public domain only!) *(added 18 Nov)* | `data/books.json` → `"illustration"`, `"illustrationAlt"`, `"illustrationCaption"`, `"illustrationSource"`. Shown on the book page ("From the book") **and** on every episode page about that book. | Nothing is shown if `"illustration"` is empty; paper texture if the file is missing |
| **Hero picture on Home** | `index.html` → the `<img>` inside `<figure class="hero-figure">` (change `src`, `alt`, caption) | Paper texture if the file is missing |
| **Decorative photo on About** | Replace `images/book.jpg` with our own photo (same name) | Paper texture with "Between the Lines" if the file is missing |
| **Logo / favicon** | `images/favicon-3-black-script.png` | — (we already have it) |

**How to add a team photo (example)**
1. Save the photo as `images/nursaya.jpg` (all **lowercase**, no spaces).
2. In `data/team.json`, change `"photo": ""` to `"photo": "images/nursaya.jpg"`.
3. Save, refresh (Live Server). The paper oval becomes the photo, same size and shape.

**Tips**
- Size: about 800 px wide is plenty; keep each file under ~300 KB so phones load fast (Preview → Tools → Adjust Size).
- Portrait (upright) photos work best; faces near the top are kept when cropping.
- Online, capital letters matter: `Nursaya.JPG` ≠ `nursaya.jpg`.
- Author portraits: only public-domain images, and always fill in `portraitSource` (it is shown under the picture).

**How it works (for the judges)**: `pictureHTML()` in `app.js` checks the path. Empty → it builds the placeholder `<div>`. Filled → it builds an `<img>`. If the browser can't load that image, an `error` listener swaps in the placeholder. The paper texture is three CSS gradients layered on top of each other, with no image file.

---

## How to publish on GitHub Pages (step by step)

We use the same GitHub account as the v1 site (**kabyltainursaya-lab**). The v1 site stays online untouched.

**A. Create the repository** (a "repository" = a project folder on GitHub)
1. Go to github.com and sign in.
2. Click **+** (top right) → **New repository**.
3. Repository name: `btl-platform`. Choose **Public** (GitHub Pages is free for public repositories). Don't tick anything else.
4. Click **Create repository**.

**B. Upload the files**
1. On the new empty page, click the link **"uploading an existing file"**.
2. In Finder, open our `btl-platform` folder and press **Cmd + A** to select everything inside it: all `.html` files, `NOTES.md`, `CLAUDE.md` and the folders `css`, `js`, `data`, `images`.
3. **Drag** them into the GitHub box. Wait until every file is listed. Check that folders appear as `css/style.css`, `js/app.js`, `data/books.json`, `images/…`.
4. Below, in "Commit changes", write: `First version of the BTL platform` and click **Commit changes**. ("Commit" = save a version.)

**C. Switch on GitHub Pages**
1. In the repository, click **Settings** (top menu) → **Pages** (left menu).
2. Under "Build and deployment": Source = **Deploy from a branch**, Branch = **main**, folder = **/ (root)** → **Save**.
3. Wait 1–3 minutes, then refresh. GitHub shows: *"Your site is live at https://kabyltainursaya-lab.github.io/btl-platform/"*. (The **Actions** tab shows the progress.)
4. Open it on a laptop **and** a phone, and click through every page.

**D. Updating the site later**
- Small change: open the file on GitHub → pencil icon ✏️ → edit → **Commit changes**.
- Replace a file: go into the right folder on GitHub (e.g. `data`) → **Add file → Upload files** → drop the file with the **same name** → Commit.
- The site updates after 1–3 minutes. If you still see the old version, press **Cmd + Shift + R** (reload without cache).

**⚠️ Watch out**
- **Capital letters matter online!** On our Mac, `Nuray.jpg` and `nuray.jpg` are the same file; on GitHub Pages they are different, and the photo breaks. Keep all file names lowercase, exactly as in the code.
- Don't upload `.DS_Store` files (hidden Mac files; Cmd + A in Finder doesn't select them, so this is usually fine).
- Everything in a public repository is public, including `CLAUDE.md` and `NOTES.md`. That's fine for us (no passwords, and our names/emails are already on the site).

**E. Make the QR code** (no extra website needed)
1. Open the live site in **Google Chrome**.
2. Right-click on the page → **"Create QR Code for this page"** (or the share icon in the address bar → *Create QR code*).
3. Click **Download**. You get a PNG for our poster and slides.
4. Test it: scan it with a phone camera.

**Our notes (write here)**
-

---

## Practice tasks (do these before the fair!)

The judges will probably ask "How does it work?" Each task proves we can answer.

- [ ] **Step 1:** In `css/style.css`, change `--green` to `#A8B58A`. Which parts of the site change, and why? (Hint: search for `var(--green)`.)
- [ ] **Step 2:** In `js/home.js`, set `FEATURED_AUTHOR_HOURS` to `0.01` (36 seconds) and refresh Home every half minute: the author changes. Then set `ONLY_WITH_PORTRAIT` to `false`: which authors join the rotation now, and why do they show initials cards? Put both settings back afterwards!
- [ ] **Step 3:** Add one real book to `data/books.json` (copy a `{ … }` record, give it a new unique `id`, `"candidate": true`, an `author` id that exists in `authors.json`). Before checking, predict the 5+ places it will appear.
- [ ] **Step 4:** Add a 4th multiple-choice question to Episode 1's `"quiz"`, based on our real research. Remember: `"answer": 0` = the FIRST option. Test that the green answer is the right one.
- [ ] **Step 5:** Add one real resource to the END of `data/resources.json`, with a link we opened and checked. Then check: is it first under "Newest resources" in the Quick search card on Home? Is its APA citation correct?
- [ ] **Home update:** In `js/home.js`, set `FEATURED_BOOK_ID` to `'flowers-for-algernon'`. What changes on the card (cover colour, subjects, episode)? Why is there no "Read it free" button now? (Hint: look at `freeText` in `books.json`.)
- [ ] **Collections:** Add `"collections": ["Women writers & science"]` to one more real book by a woman writer (or start a new collection on another book, e.g. `"Victorian science"`). Predict: where does the new name appear without changing any HTML or JavaScript?
- [ ] **Step 6:** Each of us writes a real review of *Frankenstein* (or *Flowers for Algernon*) in `data/reviews.json`. Check the stars and average on the book page. 

### Before the fair (checklist)
- [ ] Open every resource link once ourselves (especially the 4 Gutenberg links).
- [ ] When we've chosen our photos: add them to `images/` and fill in `"photo"` in `data/team.json` (see the images guide).
- [ ] Write the TODOs we want visible: summaries, bios, resource notes, Ep1 show notes, quiz model answer.
- [ ] Add the Google Form links in `"quizForms"` (the buttons appear by themselves).
- [ ] Publish (guide above), test on a phone, make the QR code.
