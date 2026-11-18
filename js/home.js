/* =============================================================
   HOME PAGE SCRIPT (home.js)
   -------------------------------------------------------------
   Only index.html loads this file. It fills the bento cards
   with our JSON data, using the shared tools from app.js
   (loadAllData, findById, hasText, saveButton, searchAll…).

   Contents:
     0. Settings (things you can change easily)
     1. Greeting
     2. Latest episode
     3. Featured author
     4. Quote of the day
     5. Continue watching
     6. Featured book
     7. Your study week
     8. Quick search
     9. Start
   ============================================================= */


/* -------------------------------------------------------------
   0. SETTINGS
   ------------------------------------------------------------- */

// FEATURED AUTHOR: changes by itself every few hours.
// How many hours each author stays on the home page:
const FEATURED_AUTHOR_HOURS = 2;

// Authors who are NEVER featured (use ids from data/authors.json).
// They still appear everywhere else (Authors page, Library, episodes).
const NEVER_FEATURE = ['daniel-keyes'];

// true = only authors with a portrait take turns (no initials cards on Home)
const ONLY_WITH_PORTRAIT = true;

// Which book is featured in the wide card at the bottom?
// Use an "id" from data/books.json.
const FEATURED_BOOK_ID = 'frankenstein';

// How many resources the Quick search card shows before you type
const NEW_RESOURCES_COUNT = 3;


/* -------------------------------------------------------------
   1. GREETING: "Good morning / afternoon / evening, reader"
   ------------------------------------------------------------- */
function showGreeting() {
  const hour = new Date().getHours();   // 0–23, from the visitor's clock
  let part = 'evening';
  if (hour >= 5 && hour < 12) part = 'morning';
  else if (hour >= 12 && hour < 18) part = 'afternoon';
  document.getElementById('greeting').textContent = 'Good ' + part + ', reader';
}


/* -------------------------------------------------------------
   2. LATEST EPISODE
   Rule: the newest PUBLISHED episode (highest number).
   If nothing is published yet, the first episode IN PRODUCTION.
   ------------------------------------------------------------- */
function pickLatestEpisode(episodes) {
  const published = episodes
    .filter(function (ep) { return ep.status === 'published'; })
    .sort(function (a, b) { return b.number - a.number; });   // big numbers first
  if (published.length > 0) return published[0];

  const inProduction = episodes
    .filter(function (ep) { return ep.status === 'in-production'; })
    .sort(function (a, b) { return a.number - b.number; });   // small numbers first
  return inProduction[0];
}

function showLatestEpisode(data) {
  const box = document.getElementById('latest-episode');
  const ep = pickLatestEpisode(data.episodes);
  if (!ep) {
    box.innerHTML = '<p>No episodes yet.</p>';
    return;
  }

  // Look up the linked book and its author (linked by id)
  const book = findById(data.books, ep.book);
  const author = book ? findById(data.authors, book.author) : null;
  const bookLine = book ? '<em>' + escapeHTML(book.shortTitle) + '</em>' + (author ? ' · ' + escapeHTML(author.name) : '') : '';

  box.innerHTML =
    '<a class="arrow-btn" href="' + pageUrl('episodes', ep.id) + '" aria-label="Open episode ' + ep.number + '">' + icon('arrow') + '</a>' +
    '<div class="row tags-row">' +
      '<span class="pill pill-light">Episode ' + ep.number + '</span>' +
      statusBadgeHTML(ep.status) +
    '</div>' +
    '<h3 class="episode-title">' + escapeHTML(ep.title) + '</h3>' +
    '<p class="episode-book">' + bookLine + '</p>' +
    '<p><span class="tag tag-green">' + escapeHTML(ep.discipline) + '</span></p>' +
    '<div class="row">' +
      '<a class="btn" href="' + pageUrl('episodes', ep.id) + '">Open episode</a>' +
      saveButton('episodes', ep.id) +
    '</div>';
}


/* -------------------------------------------------------------
   3. FEATURED AUTHOR (changes every FEATURED_AUTHOR_HOURS hours)
   How it works:
   1. Make the list of authors who may be featured ("the pool"):
      not in NEVER_FEATURE, and (if ONLY_WITH_PORTRAIT) with a portrait.
   2. Count how many 2-hour blocks have passed since 1 January 1970
      (that's how computers count time: Date.now() = milliseconds).
   3. Block number % pool size = whose turn it is. % is the remainder,
      so after the last author we start again with the first.
   Everyone who visits in the same 2 hours sees the same author;
   2 hours later it's the next one. No storage needed.
   ------------------------------------------------------------- */
function pickFeaturedAuthor(authors) {
  const pool = authors.filter(function (a) {
    if (NEVER_FEATURE.includes(a.id)) return false;
    if (ONLY_WITH_PORTRAIT && !hasText(a.portrait)) return false;
    return true;
  });
  if (pool.length === 0) return null;

  const blockLength = FEATURED_AUTHOR_HOURS * 60 * 60 * 1000;   // hours → milliseconds
  const blockNumber = Math.floor(Date.now() / blockLength);
  return pool[blockNumber % pool.length];
}

function showFeaturedAuthor(data) {
  const box = document.getElementById('featured-author');
  const author = pickFeaturedAuthor(data.authors);
  if (!author) {
    box.innerHTML = '<p class="notice">No author to feature. Check NEVER_FEATURE and ONLY_WITH_PORTRAIT in js/home.js.</p>';
    return;
  }

  // Picture: portrait or initials (building block from app.js),
  // plus the source of the portrait if we have one
  const picture =
    '<figure class="author-figure">' +
      authorPictureHTML(author) +
      (author.portrait && hasText(author.portraitSource) ? '<figcaption>' + escapeHTML(author.portraitSource) + '</figcaption>' : '') +
    '</figure>';

  // Their books in our library
  const books = booksByAuthor(data, author.id);
  const bookLinks = books.map(function (b) {
    return '<a href="' + pageUrl('books', b.id) + '"><em>' + escapeHTML(b.shortTitle) + '</em></a>';
  }).join(', ');

  box.innerHTML =
    '<div class="author-feature">' +
      picture +
      '<div>' +
        '<h3>' + escapeHTML(author.name) + '</h3>' +
        '<p class="meta">' + lifeYears(author) + ' · ' + escapeHTML(author.country) + '</p>' +
        (hasText(author.bio) ? '<p>' + escapeHTML(author.bio) + '</p>' : '<p class="meta">Biography coming soon.</p>') +
        (books.length ? '<p>In our library: ' + bookLinks + '</p>' : '') +
        '<a class="btn btn-ghost" href="' + pageUrl('authors', author.id) + '">About the author</a>' +
      '</div>' +
    '</div>';
}


/* -------------------------------------------------------------
   4. QUOTE OF THE DAY
   Every day shows the next quote in data/quotes.json.
   We count the days since 1 January 1970 and use the
   remainder (%) so the list starts again at the end.
   ------------------------------------------------------------- */
function showQuote(data) {
  const box = document.getElementById('quote');
  if (data.quotes.length === 0) {
    box.innerHTML = '<p>No quotes yet.</p>';
    return;
  }
  const now = new Date();
  const dayNumber = Math.floor(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()) / 86400000);
  const quote = data.quotes[dayNumber % data.quotes.length];
  const book = findById(data.books, quote.book);
  const bookTitle = book ? '<a href="' + pageUrl('books', book.id) + '"><cite>' + escapeHTML(book.shortTitle) + '</cite></a>' : '';

  box.innerHTML =
    '<blockquote class="quote">' +
      '<p>“' + escapeHTML(quote.text) + '”</p>' +
      '<footer>— ' + escapeHTML(quote.speaker) + ', ' + bookTitle + '<br><span class="meta">' + escapeHTML(quote.where) + '</span></footer>' +
    '</blockquote>';
}


/* -------------------------------------------------------------
   5. CONTINUE WATCHING
   Episodes saved on My Shelf that are not marked as watched yet.
   ------------------------------------------------------------- */
function showContinueWatching(data) {
  const box = document.getElementById('continue-watching');
  const shelf = getShelf();   // from app.js

  const episodes = shelf.episodes
    .map(function (id) { return findById(data.episodes, id); })
    .filter(function (ep) { return ep && !isDone('episodes', ep.id); });

  if (episodes.length === 0) {
    box.innerHTML = '<p class="meta">Nothing here yet. Press <strong>Save</strong> on an episode and it will wait for you here.</p>';
    return;
  }

  box.innerHTML = '<ul class="mini-list">' + episodes.map(function (ep) {
    return '<li>' +
      '<a href="' + pageUrl('episodes', ep.id) + '">' + escapeHTML(ep.title) + '</a>' +
      '<span class="meta">Episode ' + ep.number + ' · ' + escapeHTML(ep.discipline) + '</span>' +
    '</li>';
  }).join('') + '</ul>';
}


/* -------------------------------------------------------------
   6. FEATURED BOOK
   One book from data/books.json, chosen with FEATURED_BOOK_ID.
   Shows: CSS cover, title, author, year, era, subjects,
   its episode(s), and buttons (Open book, Read it free, Save).
   ------------------------------------------------------------- */
function showFeaturedBook(data) {
  const box = document.getElementById('featured-book');
  const book = findById(data.books, FEATURED_BOOK_ID);
  if (!book) {
    box.innerHTML = '<p class="notice">No book with the id “' + escapeHTML(FEATURED_BOOK_ID) + '”. Check FEATURED_BOOK_ID in js/home.js.</p>';
    return;
  }

  // Look up the author by id (the same way the book page does)
  const author = findById(data.authors, book.author);
  const authorName = author ? author.name : '';
  const authorLink = author
    ? '<a href="' + pageUrl('authors', author.id) + '">' + escapeHTML(author.name) + '</a>'
    : '';

  // Year, plus the extra note if there is one: "1818 (revised edition 1831)"
  const year = book.year + (book.yearNote ? ' (' + escapeHTML(book.yearNote) + ')' : '');

  // Subject tags: each one opens the library filtered by that subject
  const subjects = book.subjects.map(function (s) {
    return '<a class="tag tag-cream tag-link" href="library.html?subject=' + encodeURIComponent(s) + '">' + escapeHTML(s) + '</a>';
  }).join('');

  // Linked episodes (episodesForBook is in app.js; it skips "coming soon" ones)
  const episodes = episodesForBook(data, book.id);
  const episodeList = episodes.length
    ? '<ul class="mini-list">' + episodes.map(function (ep) {
        return '<li>' +
          '<span class="row tags-row"><span class="pill">Episode ' + ep.number + '</span>' + statusBadgeHTML(ep.status) + '</span>' +
          '<a href="' + pageUrl('episodes', ep.id) + '">' + escapeHTML(ep.title) + '</a>' +
          '<span class="meta">' + escapeHTML(ep.discipline) + '</span>' +
        '</li>';
      }).join('') + '</ul>'
    : '<p class="meta">No episode yet' + (book.candidate ? ': this book is proposed for a future episode.' : '.') + '</p>';

  // "Read it free" (public domain) or "Find this book" (Open Library).
  // bookLinkButton() is in app.js; the book page uses it too.
  const freeButton = bookLinkButton(book, authorName, 'btn-ghost');

  box.innerHTML =
    '<div class="book-feature">' +
      // The cover is a link to the book page (hidden from screen readers:
      // the title link below says the same thing)
      '<a class="book-feature-cover" href="' + pageUrl('books', book.id) + '" tabindex="-1" aria-hidden="true">' +
        coverHTML(book, authorName) +
      '</a>' +

      '<div class="book-feature-info">' +
        (book.candidate ? '<span class="tag tag-cream">Proposed</span>' : '') +
        '<h3><a href="' + pageUrl('books', book.id) + '">' + escapeHTML(book.shortTitle) + '</a></h3>' +
        (book.title !== book.shortTitle ? '<p class="meta"><em>' + escapeHTML(book.title) + '</em></p>' : '') +
        '<p>' + authorLink + (authorLink ? ' · ' : '') + year + '</p>' +
        '<p class="meta">' + escapeHTML(book.era) + '</p>' +
        '<p class="row tags-row">' + subjects + '</p>' +
        (hasText(book.summary) ? '<p>' + escapeHTML(book.summary) + '</p>' : '') +
        '<div class="row">' +
          '<a class="btn btn-dark" href="' + pageUrl('books', book.id) + '">Open book</a>' +
          freeButton +
          saveButton('books', book.id) +
        '</div>' +
      '</div>' +

      '<div class="book-feature-episodes">' +
        '<p class="list-label">' + (episodes.length === 1 ? 'Episode' : 'Episodes') + '</p>' +
        episodeList +
      '</div>' +
    '</div>';
}


/* -------------------------------------------------------------
   7. YOUR STUDY WEEK
   Remembers (in localStorage) which days you opened BTL,
   and shows this week from Monday to Sunday.
   ------------------------------------------------------------- */
const VISITS_KEY = 'btl-visits';

// A date as text: "2026-11-18"
function dateKey(date) {
  return date.getFullYear() + '-' +
    String(date.getMonth() + 1).padStart(2, '0') + '-' +
    String(date.getDate()).padStart(2, '0');
}

function showStudyWeek() {
  const box = document.getElementById('study-week');
  const today = new Date();
  const todayKey = dateKey(today);

  // Read the saved visits and add today
  let visits = [];
  let canRemember = true;
  try {
    visits = JSON.parse(localStorage.getItem(VISITS_KEY)) || [];
    if (!visits.includes(todayKey)) visits.push(todayKey);
    visits = visits.slice(-60);   // keep only the last 60 visits
    localStorage.setItem(VISITS_KEY, JSON.stringify(visits));
  } catch (error) {
    canRemember = false;
    visits = [todayKey];
  }

  // Find Monday of this week (getDay(): Sunday = 0, Monday = 1 …)
  const daysSinceMonday = (today.getDay() + 6) % 7;
  const monday = new Date(today.getFullYear(), today.getMonth(), today.getDate() - daysSinceMonday);

  const names = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  let days = '';
  let count = 0;
  for (let i = 0; i < 7; i++) {
    const day = new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + i);
    const key = dateKey(day);
    const visited = visits.includes(key);
    if (visited) count++;
    let classes = 'day';
    if (visited) classes += ' visited';
    if (key === todayKey) classes += ' today';
    days +=
      '<li class="' + classes + '">' +
        '<span class="day-name">' + names[i] + '</span>' +
        '<span class="day-num">' + day.getDate() + '</span>' +
        '<span class="visually-hidden">' + (visited ? ' visited' : ' not visited') + '</span>' +
      '</li>';
  }

  box.innerHTML =
    '<ol class="week">' + days + '</ol>' +
    '<p class="meta">' + (canRemember
      ? 'You opened Between the Lines on ' + count + (count === 1 ? ' day' : ' days') + ' this week.'
      : 'Your browser is blocking storage, so we can’t remember your visits.') + '</p>';
}


/* -------------------------------------------------------------
   8. QUICK SEARCH
   - Before typing: the 3 newest resources (so the card isn't empty)
   - While typing: results from searchAll() (in app.js)
   - Suggestion chips: clicking one types its words into the box
   ------------------------------------------------------------- */

// The 3 newest resources, in a short form (title + type · authors)
function newestResourcesHTML(data) {
  const newest = data.resources.slice(-NEW_RESOURCES_COUNT).reverse();   // the LAST 3 in the file, newest first
  if (newest.length === 0) return '';
  return '<p class="list-label">Newest resources</p>' +
    '<ul class="mini-list compact-list">' + newest.map(function (res) {
      const title = res.link
        ? '<a href="' + escapeHTML(res.link) + '" target="_blank" rel="noopener">' + escapeHTML(res.title) + ' ' + icon('external') + '<span class="visually-hidden"> (opens in a new tab)</span></a>'
        : '<a href="' + pageUrl('resources', res.id) + '">' + escapeHTML(res.title) + '</a>';
      return '<li>' + title +
        '<span class="meta">' + escapeHTML(res.type) + ' · ' + escapeHTML(authorsAndYear(res)) + '</span></li>';
    }).join('') + '</ul>';
}

function setupSearch(data) {
  const form = document.getElementById('search-form');
  const input = document.getElementById('search-input');
  const box = document.getElementById('search-results');
  const chips = document.querySelectorAll('.chip');

  // Shows the right thing for what is in the search box
  function update() {
    const query = input.value;

    // Highlight the chip that matches the current search (if any)
    chips.forEach(function (chip) {
      chip.setAttribute('aria-pressed', chip.dataset.query.toLowerCase() === query.trim().toLowerCase());
    });

    if (query.trim().length < 2) {
      box.innerHTML = newestResourcesHTML(data);   // nothing typed yet
      return;
    }
    const results = searchAll(data, query);
    if (results.length === 0) {
      box.innerHTML = '<p class="meta">No results found for “' + escapeHTML(query) + '”.</p>';
      return;
    }
    box.innerHTML = '<ul class="mini-list search-results">' + results.slice(0, 8).map(function (r) {
      return '<li>' +
        '<span class="tag tag-cream">' + r.type + '</span> ' +
        '<a href="' + r.href + '">' + escapeHTML(r.title) + '</a>' +
        '<span class="meta">' + escapeHTML(r.detail) + '</span>' +
      '</li>';
    }).join('') + '</ul>' +
    (results.length > 8 ? '<p class="meta">Showing 8 of ' + results.length + ' results.</p>' : '');
  }

  // Pressing Enter should not reload the page
  form.addEventListener('submit', function (event) { event.preventDefault(); });
  input.addEventListener('input', update);

  // Chips: put the words in the box and search. Clicking the active chip again clears it.
  chips.forEach(function (chip) {
    chip.addEventListener('click', function () {
      const isActive = chip.getAttribute('aria-pressed') === 'true';
      input.value = isActive ? '' : chip.dataset.query;
      update();
    });
  });

  update();   // first view: the newest resources
}


/* -------------------------------------------------------------
   9. START
   ------------------------------------------------------------- */
async function startHome() {
  showGreeting();
  showStudyWeek();   // doesn't need the JSON files

  try {
    const data = await loadAllData();   // from app.js
    showLatestEpisode(data);
    showFeaturedAuthor(data);
    showQuote(data);
    showContinueWatching(data);
    showFeaturedBook(data);
    setupSearch(data);
    updateSaveButtons();   // give the new Save button its look

    // When something is saved or removed, refresh "Continue watching"
    document.addEventListener('shelfchange', function () { showContinueWatching(data); });
  } catch (error) {
    showDataError(document.getElementById('home-error'), error);
    // Replace every "Loading…" with a short note
    ['latest-episode', 'featured-author', 'quote', 'continue-watching', 'featured-book'].forEach(function (id) {
      document.getElementById(id).innerHTML = '<p class="meta">Not available right now.</p>';
    });
  }
}

startHome();
