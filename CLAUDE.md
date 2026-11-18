# BTL Platform — Project Brief for Claude Code

Save this file in the project folder as **CLAUDE.md**. Read all of it before doing anything.

---

## 0. How to work with us (most important)

We are two Grade 11 students (Kabyltay Nursaya and Uais Nuray, Nurorda Almaty) and **beginners**. Yesterday we hand-coded our first website (HTML + CSS + a little JavaScript). We want you to build this platform **with** us, and we must understand every part, because we will present it to judges at a city-stage project fair and answer their questions.

Rules:
1. **Explain first, then write.** Before each file, say in plain English what the file is for and how it fits the whole project.
2. **Small steps.** Build one module at a time. After each module, stop, tell us how to test it (VS Code → Go Live), and wait for our "OK" before continuing.
3. **Give us one hands-on task per module** (for example: add a book to `books.json`, change a color, add a filter option) so we prove we understand it. Check our work afterwards.
4. **Plain code only:** HTML, CSS, vanilla JavaScript and JSON. No frameworks (no React, Vue, Tailwind), no build tools, no npm. Everything must run by opening it with Live Server and be hostable on GitHub Pages for free.
5. **Comment the code** in simple English, so we can read it later.
6. **Keep `NOTES.md` updated:** a short learning log saying what each file does, written for beginners. We will add our own notes too.
7. **Never invent facts.** No fake reviews, fake statistics, fake quotes or made-up sources. If something is unknown, leave a clearly marked `TODO` for us.
8. We work on a Mac with VS Code and the Live Server extension. We upload to GitHub through the github.com website (Add file → Upload files). Explain any terminal command before using it.

---

## 1. The project

**"Between the Lines" (BTL): an interdisciplinary study-podcast platform for high-school students.**
Each video-podcast episode opens with one scene from a classic English or American book, explains the real science, math or history concept hidden in it, and finds the same pattern in modern pop culture or non-English literature (the "modern echo").

Our research method (show it on the About/Method page):
- **5-step analysis:** 1) Select the scene → 2) Research the outside concept (credible sources) → 3) Research the existing literary scholarship → 4) Find the modern echo → 5) Write the synthesis.
- **CIS framework** (Novis-Deutsch et al., 2024): Comprehension → Integration → Synthesis.
- **Script structure:** The Scene → The Concept → The Echo.

Old version (keep it online as a backup, don't modify it): https://kabyltainursaya-lab.github.io/btl-website/
It's a one-page site. Reuse its colors, fonts, images and texts in the new platform.

**Deadline:** about 4 days.

---

## 2. What the platform must be

Not a "website" but a **data-driven study platform**: content lives in JSON "database" files, and JavaScript builds the pages, search, filters and links from them. Adding one record to a JSON file should make it appear everywhere it belongs.

### Pages
| File | Purpose |
|---|---|
| `index.html` | **Home dashboard**: bento grid (latest episode, featured author, "continue watching", new resources, quick search, quote of the day from a public-domain book) |
| `library.html` | **Book database**: shelves and grid, search, filters (subject, era, author, has-episode) |
| `book.html?id=…` | One book: designed cover, author, year, our summary, subjects, linked episodes, linked resources, reviews, "Save to shelf" |
| `authors.html` and `author.html?id=…` | Authors: portrait (public domain only) or designed card, short bio, their books |
| `episodes.html` | All episodes (published and coming soon) |
| `episode.html?id=…` | One episode: video (YouTube embed when ready), show notes (concept, literary technique, modern echo, synthesis), transcript, quiz, linked book, linked resources |
| `resources.html` | **Research database** of extra learning materials: search, filter by type, topic, episode and level, "Copy APA citation", link out (DOI or URL), "Save" |
| `shelf.html` | **My Shelf**: saved books, episodes and resources (stored in `localStorage`), "mark as watched/read" |
| `about.html` | About the project, method (5 steps and CIS), team, contact |

### Shared features (in `js/app.js`)
- Load JSON data with `fetch()`. **Explain to us** that fetch needs a server, so it works with Live Server and GitHub Pages but not by double-clicking the file.
- Sidebar navigation (desktop) plus a bottom or ☰ menu (mobile).
- Global search across books, authors, episodes and resources.
- Save to shelf / remove from shelf (`localStorage`, wrapped in try/catch).
- Read `?id=` from the URL for detail pages, with a friendly "not found" state.
- Quiz engine: multiple choice and yes/no with instant feedback; open questions show a model answer. Quiz links to our Google Forms (URLs are `TODO` for now) for collecting research data.
- Fade-in on scroll (respect `prefers-reduced-motion`).

### Later ("stage 2", not now; just mention it in About)
Online accounts and shared reviews using a real database (for example Supabase).

---

## 3. Folder structure

```
btl-platform/
├── index.html
├── library.html
├── book.html
├── authors.html
├── author.html
├── episodes.html
├── episode.html
├── resources.html
├── shelf.html
├── about.html
├── css/style.css
├── js/app.js          (shared logic)
├── js/<page>.js       (one small script per page, if needed)
├── data/books.json
├── data/authors.json
├── data/episodes.json
├── data/resources.json
├── data/reviews.json
├── images/
├── CLAUDE.md          (this file)
└── NOTES.md           (learning log)
```

---

## 4. Design direction: "a classic library meets a modern study app"

We liked the **layouts** of two modern edtech designs but **not** their digital, neon look. Our theme is classic literature and science, so combine:

- **From an edtech dashboard ("SmartClass")**: a bento grid of differently sized rounded cards on the home page, a big confident headline with a short intro, small pill tags like "/episode", and round arrow buttons.
- **From a reading app ("Happy reading, Harvey")**: a slim left **sidebar with icons** (Home, Library, Episodes, Resources, Shelf, About), a greeting ("Good evening, reader"), "Continue watching", **book shelves with covers in rows**, a **reading schedule** strip (week days), and a book detail panel (title, pages or year, synopsis).
- **From our own v1 site (keep)**: colors, fonts and classic feel.

### Design tokens (from v1)
```
--pink:  #DBB8B2   (hero / highlights)
--cream: #FBF4EA   (main background, paper)
--green: #C3C985   (buttons, accents)
--ink:   #1a1a1a   (text, dark cards)
```
You may add 2–3 supporting shades (a darker brown/burgundy for covers, a muted gold for stars), but stay classic.

### Fonts (Google Fonts)
- **Playfair Display**: headings
- **Pinyon Script**: small decorative words only (like "where" in "where Story meets Science")
- **Jost**: body text and UI

### Classic details
Paper-like cream surfaces, thin ink borders, serif headings, subtle shadows, rounded corners (16–28px), a quiet elegance. No neon, no heavy gradients, no emoji icons (use simple inline SVG line icons).

### Images rules (important)
- **Allowed:** public-domain portraits of historical authors (Mary Shelley, Poe, Stevenson…) and public-domain illustrations (for example Theodor von Holst's 1831 Frankenstein frontispiece). Record the source in the data.
- **Not allowed:** modern book covers, photos of living or recent authors (for example Stephen King), film or TV screenshots, any copyrighted image.
- **Book covers:** generate **designed covers in CSS** (title and author in Playfair, a colored "cloth" background chosen per book, a thin gold frame or spine line). Each book gets a `coverColor` in the data.
- **Authors without a public-domain portrait:** a designed card with initials.

### Existing images in `images/`
- `mary-shelley.jpg`: public-domain portrait painting (Richard Rothwell)
- `book.jpg`: open book photo (decorative)
- `nuray.jpg`, `nursaya.jpg`: our own photos (team section)
- `favicon-3-black-script.png`: logo (black square with a script "B" and a pink line). Use it as the favicon, the apple-touch-icon and the sidebar logo.

---

## 5. Data model (JSON)

Use these fields. Keep the data clean, because we will edit these files ourselves.

### `authors.json`
```json
{
  "id": "mary-shelley",
  "name": "Mary Shelley",
  "born": 1797,
  "died": 1851,
  "country": "England",
  "bio": "TODO: 2–3 sentences written by the students.",
  "portrait": "images/mary-shelley.jpg",
  "portraitSource": "Richard Rothwell, oil portrait (public domain)"
}
```

### `books.json`
```json
{
  "id": "frankenstein",
  "title": "Frankenstein; or, The Modern Prometheus",
  "shortTitle": "Frankenstein",
  "author": "mary-shelley",
  "year": 1818,
  "era": "Romantic / Gothic (19th century)",
  "subjects": ["history of science", "electricity", "ethics"],
  "summary": "TODO: students write 2–3 sentences in their own words.",
  "coverColor": "#3b2f2f",
  "freeText": "https://www.gutenberg.org/ebooks/42324",
  "episodes": ["ep1"],
  "candidate": false
}
```
`freeText` is only for public-domain books. `candidate: true` marks books we're still deciding on (show them with a small "proposed" label, or hide them; ask us).

### `episodes.json`
```json
{
  "id": "ep1",
  "number": 1,
  "title": "What did science actually believe was possible in 1818?",
  "book": "frankenstein",
  "discipline": "History of Science",
  "status": "in-production",
  "youtube": "",
  "duration": "",
  "showNotes": {
    "concept": "TODO",
    "technique": "TODO",
    "echo": "TODO",
    "synthesis": "TODO"
  },
  "transcript": "",
  "resources": ["shelley-1831-introduction", "aldini-1803", "galvani-1791"],
  "quiz": []
}
```
`status` is one of: `published`, `in-production`, `coming-soon`.

### `resources.json` (extra learning materials, NOT the references from our report)
```json
{
  "id": "parent-2004",
  "title": "Giovanni Aldini: From Animal Electricity to Human Brain Stimulation",
  "authors": "Parent, A.",
  "year": 2004,
  "type": "journal article",
  "source": "Canadian Journal of Neurological Sciences, 31(4), 576–584",
  "link": "https://doi.org/10.1017/S0317167100003851",
  "access": "check",
  "topics": ["galvanism", "Aldini", "neuroscience history"],
  "episodes": ["ep1"],
  "books": ["frankenstein"],
  "level": "advanced",
  "note": "TODO: students explain in their own words why this is useful."
}
```
- `type`: `primary source`, `journal article`, `book`, `article`, `video`, `digital archive`
- `access`: `free`, `paywalled` or `check`
- `level`: `beginner`, `intermediate` or `advanced`
- The "Copy APA citation" button builds the citation from these fields.
- **Link out only.** Never upload PDFs of copyrighted articles.

### `reviews.json`
```json
{
  "book": "frankenstein",
  "reviewer": "Kabyltay Nursaya",
  "stars": 5,
  "text": "TODO: real review written by the reviewer.",
  "date": "2026-11-18"
}
```
Only real reviews by real people, with their permission to show their name.

---

## 6. Seed data (start with this)

### Authors
| id | name | years | notes |
|---|---|---|---|
| mary-shelley | Mary Shelley | 1797–1851 | portrait available: `images/mary-shelley.jpg` |
| daniel-keyes | Daniel Keyes | 1927–2014 | no portrait, use an initials card |
| edgar-allan-poe | Edgar Allan Poe | 1809–1849 | candidate, public-domain portraits exist (students will add one with its source) |
| robert-louis-stevenson | Robert Louis Stevenson | 1850–1894 | candidate |
| hg-wells | H. G. Wells | 1866–1946 | candidate |
| stephen-king | Stephen King | born 1947 | candidate, **no photo** (initials card only) |

### Books
| id | title | author | year | episode | status |
|---|---|---|---|---|---|
| frankenstein | Frankenstein; or, The Modern Prometheus | Mary Shelley | 1818 (revised 1831) | ep1 | confirmed |
| flowers-for-algernon | Flowers for Algernon | Daniel Keyes | short story 1959, novel 1966 | ep2 | confirmed |
| tell-tale-heart | The Tell-Tale Heart | Edgar Allan Poe | 1843 | — | candidate |
| jekyll-and-hyde | Strange Case of Dr Jekyll and Mr Hyde | Robert Louis Stevenson | 1886 | — | candidate |
| time-machine | The Time Machine | H. G. Wells | 1895 | — | candidate |
| the-stand | The Stand | Stephen King | 1978 | — | candidate |

The students will confirm or replace the candidates and write all summaries. Don't write summaries for them; leave `TODO`.

### Episodes
| id | title | book | discipline | status |
|---|---|---|---|---|
| ep1 | What did science actually believe was possible in 1818? | frankenstein | History of Science | in-production (script written) |
| ep2 | Can a mind really rewire itself overnight? | flowers-for-algernon | Neuroscience | in-production |
| ep3 | Episode 3 | TBA | TBA | coming-soon |
| ep4 | Episode 4 | TBA | TBA | coming-soon |
| ep5 | Episode 5 | TBA | TBA | coming-soon |

**Ep1 key idea (from our script):** Victor panics not because his experiment failed, but because the boundary between dead matter and a living subject collapsed faster than his ethics could catch up. *Frankenstein* is a recurring psychological blueprint for every era in which technical skill outpaces moral readiness. (Use it for the synthesis field only after we confirm the final wording.)

**Ep1 quiz** (from our report's appendix; the pre- and post-listening check):
1. *What did experiments associated with galvanism demonstrate?* (multiple choice)
   - ✅ Electricity could cause muscles to contract, including in recently dead tissue.
   - Electricity could reliably restore a dead person to life.
   - Electricity could reveal a person's DNA.
   - Electricity could prevent all infectious diseases.
2. *By 1818, had scientists demonstrated that they could restore a dead human being to life?* (yes/no) → ✅ **No**
3. *In one or two sentences, explain one possible connection between early nineteenth-century science and the creation of the creature in Frankenstein.* (open; show a model answer that the students write, `TODO`)

### Resources for Episode 1 (verified links)
Our script promises listeners "primary sources on Luigi Galvani, Giovanni Aldini's 1803 London demonstration, and Mary Shelley's 1831 introduction".

| id | citation | type | link | access | level |
|---|---|---|---|---|---|
| shelley-1831-introduction | Shelley, M. (1831). *Frankenstein; or, The Modern Prometheus* (revised ed., with the author's new Introduction). London: Henry Colburn and Richard Bentley. | primary source | https://www.gutenberg.org/ebooks/42324 | free | beginner |
| shelley-1818-text | Shelley, M. (1818). *Frankenstein; or, The Modern Prometheus* (1st ed.). London: Lackington, Hughes, Harding, Mavor & Jones. | primary source | https://www.gutenberg.org/ebooks/41445 | free | beginner |
| aldini-1803 | Aldini, J. [Giovanni] (1803). *An Account of the Late Improvements in Galvanism, with a Series of Curious and Interesting Experiments…* London: Cuthell and Martin, and J. Murray. | primary source | https://www.gutenberg.org/ebooks/57267 | free | intermediate |
| aldini-1803-scans | Same book, original page scans with engravings (Wellcome Collection). | digital archive | https://wellcomecollection.org/works/mnbyxtjm | free | intermediate |
| galvani-1791 | Galvani, L. (1791). *De viribus electricitatis in motu musculari commentarius*. Bologna. (Latin) | primary source | https://library.si.edu/digital-library/book/aloysiigalvanid00galv | free | advanced |
| galvani-1792-account | *An account of the experiments and discoveries of Lewis Galvani… relative to the powers of electricity in muscular motion* (1792). English summary of Galvani's 1791 work, on PubMed Central. | primary source | https://www.ncbi.nlm.nih.gov/pmc/articles/PMC5110082/ | free | intermediate |
| parent-2004 | Parent, A. (2004). Giovanni Aldini: From animal electricity to human brain stimulation. *Canadian Journal of Neurological Sciences, 31*(4), 576–584. | journal article | https://doi.org/10.1017/S0317167100003851 | check | advanced |
| piccolino-2006 | Piccolino, M. (2006). Luigi Galvani's path to animal electricity. *Comptes Rendus Biologies, 329*. | journal article | https://doi.org/10.1016/j.crvi.2006.03.002 | check | advanced |
| piccolino-1998 | Piccolino, M. (1998). Animal electricity and the birth of electrophysiology: The legacy of Luigi Galvani. *Brain Research Bulletin, 46*(5), 381–407. | journal article | TODO: verify DOI before adding a link | check | advanced |
| ure-1818-linda-hall | Linda Hall Library. "Andrew Ure" (Scientist of the Day). Background on Ure's 4 November 1818 galvanic experiment in Glasgow, the same year *Frankenstein* was published. | article | https://www.lindahall.org/about/news/scientist-of-the-day/andrew-ure/ | free | beginner |

All `note` fields are `TODO` for the students. Before publishing, open every link once to confirm it works (we'll do this together).

### Content to reuse from v1
- Tagline: "where Story meets Science" / "A story-first approach to science, math & history" / "Step inside a scene from literature — and discover the real idea hiding behind it"
- Team text: "Together, we started Between the Lines because we kept noticing the same thing: the best stories are usually hiding a real idea, and the best science usually has a story behind it. So we decided to stop separating the two. Our goal is to create a space to explore literature through different disciplines."
- Contact: uaisnurai@gmail.com, kabyltainursaya@gmail.com (as `mailto:` links); Nurorda Almaty
- "Why listen?" points: short and clear (about 10 minutes); two subjects at once; full transcripts; real sources; fresh ideas for essays; free, anytime

---

## 7. Build plan (stop and wait for us after each step)

**Step 1: setup and design system**
Folder structure, `css/style.css` (tokens, fonts, typography, cards, buttons, tags, sidebar layout, mobile), `js/app.js` (data loading, sidebar, mobile menu), empty pages sharing the same layout, `NOTES.md`. *Our task:* change one design token and see it update everywhere.

**Step 2: Home dashboard**
Bento grid built from data (latest episode, featured author, new resources, quick search, "continue watching" from the shelf). *Our task:* change which author is featured.

**Step 3: Library, book pages, authors**
Shelves, CSS covers, filters, search, `book.html?id=`, `author.html?id=`. *Our task:* add a new book to `books.json`.

**Step 4: Episodes and episode page**
List, status badges, show notes, transcript, quiz engine, linked resources. *Our task:* add a quiz question.

**Step 5: Resources database**
Search, filters (type, topic, episode, level, access), Copy APA citation, save. *Our task:* add a new resource with a real link.

**Step 6: My Shelf, About, reviews**
Saved items, watched/read marks, about/method/team, reviews on book pages. *Our task:* add our own review.

**Step 7: Polish and publish**
Accessibility (contrast, focus states, alt text), mobile check, empty states, link check, then publishing to a new GitHub repository `btl-platform` with GitHub Pages (explain every step), and a QR code.

---

## 8. Quality rules
- Every page works on phones (from 360px wide) and laptops.
- Clear empty and loading states ("No results found", "Your shelf is empty").
- Semantic HTML, alt text on images, visible keyboard focus.
- No console errors. If JSON fails to load, show a friendly message.
- Accuracy over decoration: every fact, date and link must be real and checkable.

---

## 9. Your first reply

1. In a few sentences, explain how the platform works (HTML pages + CSS + JS engine + JSON database) as you would to a beginner.
2. Show the folder structure you'll create.
3. Ask us anything that's unclear (for example the candidate books).
4. Then start **Step 1 only** and stop when it's ready for us to test.
