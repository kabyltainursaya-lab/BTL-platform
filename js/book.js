/* =============================================================
   BOOK PAGE SCRIPT (book.js)
   -------------------------------------------------------------
   book.html is ONE page for EVERY book. The address tells us
   which book to show:  book.html?id=frankenstein

   1. Find the book (or show "not found")
   2. Build the top part: cover + details
   3. Linked episodes
   4. Linked resources
   5. Start
   ============================================================= */


/* -------------------------------------------------------------
   2. TOP PART: cover + details
   ------------------------------------------------------------- */
function bookDetailsHTML(book, data) {
  const author = findById(data.authors, book.author);
  const authorName = author ? author.name : 'Unknown author';

  // Author link with a tiny picture
  const authorLink = author
    ? '<a class="author-chip" href="' + pageUrl('authors', author.id) + '">' + authorPictureHTML(author) + '<span>' + escapeHTML(author.name) + '</span></a>'
    : '';

  // Subject tags: each one opens the library filtered by that subject
  const subjects = book.subjects.map(function (s) {
    return '<a class="tag tag-link" href="library.html?subject=' + encodeURIComponent(s) + '">' + escapeHTML(s) + '</a>';
  }).join(' ');

  // Year, plus the note if there is one, e.g. "1818 (revised edition 1831)"
  const year = book.year + (book.yearNote ? ' <span class="meta" style="display:inline">(' + escapeHTML(book.yearNote) + ')</span>' : '');

  // Collection tags: each one opens the library showing that collection
  const collections = (book.collections || []).map(function (c) {
    return '<a class="tag tag-cream tag-link" href="library.html?collection=' + encodeURIComponent(c) + '">' + escapeHTML(c) + '</a>';
  }).join(' ');

  // "Read it free" (public-domain books) or "Find this book" (books still
  // under copyright). bookLinkButton() is in app.js.
  const freeButton = bookLinkButton(book, authorName, '');

  return '<a class="more-link" href="library.html">← Back to the library</a>' +
    '<article class="detail section" style="margin-top:20px">' +
      '<div class="detail-cover">' + coverHTML(book, authorName) + '</div>' +
      '<div>' +
        '<div class="row tags-row"><span class="pill">/book</span>' +
          (book.candidate ? '<span class="tag tag-cream">Proposed</span>' : '') +
        '</div>' +
        '<h1>' + escapeHTML(book.title) + '</h1>' +
        authorLink +
        '<dl class="facts">' +
          '<div><dt>Year</dt><dd>' + year + '</dd></div>' +
          '<div><dt>Era</dt><dd>' + escapeHTML(book.era) + '</dd></div>' +
          (author ? '<div><dt>Country</dt><dd>' + escapeHTML(author.country) + '</dd></div>' : '') +
        '</dl>' +
        '<p class="row tags-row">' + subjects + '</p>' +
        (collections ? '<p class="row tags-row">' + collections + '</p>' : '') +
        '<h2 class="section-title" style="margin-top:24px">Summary</h2>' +
        (hasText(book.summary) ? '<p>' + escapeHTML(book.summary) + '</p>' : '<p class="meta">Summary coming soon.</p>') +
        '<div class="row" style="margin-top:20px">' + saveButton('books', book.id) + doneButton('books', book.id) + freeButton + '</div>' +
        // "Public-domain text from Standard Ebooks." (only under a Read it free button)
        freeReadCreditHTML(book) +
      '</div>' +
    '</article>';
}


/* -------------------------------------------------------------
   2b. ILLUSTRATION (only books with an "illustration" in books.json)
   ------------------------------------------------------------- */
function illustrationSectionHTML(book) {
  const figure = illustrationHTML(book);   // from app.js
  if (!figure) return '';
  return '<section class="section" aria-labelledby="ill-title">' +
    '<h2 class="section-title" id="ill-title">From the book</h2>' + figure +
  '</section>';
}


/* -------------------------------------------------------------
   2c. PAIRS WELL WITH
   "pairsWith": ["frankenstein"] in books.json → a small card for each
   paired book, plus "pairingNote" (why they belong together).
   ------------------------------------------------------------- */
function pairingHTML(book, data) {
  const pairs = (book.pairsWith || [])
    .map(function (id) { return findById(data.books, id); })
    .filter(Boolean);   // skip ids that don't exist (typos)
  if (pairs.length === 0) return '';

  return '<section class="section card card-cream" aria-labelledby="pair-title">' +
    '<h2 class="section-title" id="pair-title">Pairs well with</h2>' +
    '<div class="pairing">' +
      pairs.map(function (b) { return bookCardHTML(b, data); }).join('') +
      (hasText(book.pairingNote) ? '<p>' + escapeHTML(book.pairingNote) + '</p>' : '') +
    '</div>' +
  '</section>';
}


/* -------------------------------------------------------------
   3. LINKED EPISODES
   ------------------------------------------------------------- */
function episodesHTML(book, data) {
  const episodes = episodesForBook(data, book.id);   // from app.js

  // "Coming soon" episodes about this book (episodesForBook skips them,
  // because they have no page yet) → we just name them, e.g. "Episode 3"
  const planned = data.episodes.filter(function (ep) {
    return ep.status === 'coming-soon' && (ep.book === book.id || book.episodes.includes(ep.id));
  });

  let content;
  if (episodes.length === 0 && planned.length > 0) {
    content = '<p class="notice">' + planned.map(function (ep) { return 'Episode ' + ep.number; }).join(', ') +
      ' about this book is coming soon.</p>';
  } else if (episodes.length === 0) {
    content = '<p class="notice">No episode yet' + (book.candidate ? ': this book is proposed for a future episode.' : '.') + '</p>';
  } else {
    content = '<div class="grid">' + episodes.map(function (ep) {
      return '<a class="card episode-link" href="' + pageUrl('episodes', ep.id) + '">' +
        '<span class="arrow-btn" aria-hidden="true">' + icon('arrow') + '</span>' +
        '<span class="row tags-row"><span class="pill">Episode ' + ep.number + '</span>' +
        statusBadgeHTML(ep.status) + '</span>' +
        '<h3>' + escapeHTML(ep.title) + '</h3>' +
        '<span class="tag tag-green">' + escapeHTML(ep.discipline) + '</span>' +
      '</a>';
    }).join('') + '</div>';
  }

  return '<section class="section" aria-labelledby="ep-title">' +
    '<h2 class="section-title" id="ep-title">Episodes about this book</h2>' + content +
  '</section>';
}


/* -------------------------------------------------------------
   4. LINKED RESOURCES (resources whose "books" list has this id)
   ------------------------------------------------------------- */
function resourcesHTML(book, data) {
  const resources = data.resources.filter(function (r) { return r.books.includes(book.id); });

  const content = resources.length === 0
    ? '<p class="notice">No resources for this book yet.</p>'
    : '<ul class="mini-list resource-list">' + resources.map(resourceItemHTML).join('') + '</ul>' +
      '<a class="more-link" href="resources.html?book=' + encodeURIComponent(book.id) + '">See all in the research database →</a>';

  return '<section class="section card" aria-labelledby="res-title">' +
    '<h2 class="section-title" id="res-title">Learning resources</h2>' + content +
  '</section>';
}


/* -------------------------------------------------------------
   4b. REVIEWS (from reviews.json)
   Only real reviews by real people, shown with their permission.
   A review whose text is still "TODO" is not shown.
   ------------------------------------------------------------- */
function reviewsHTML(book, data) {
  const reviews = data.reviews.filter(function (r) { return r.book === book.id && hasText(r.text); });

  if (reviews.length === 0) {
    return '<section class="section" aria-labelledby="rev-title">' +
      '<h2 class="section-title" id="rev-title">Reviews</h2>' +
      '<p class="notice">No reviews yet.</p>' +
    '</section>';
  }

  // Average stars, e.g. 4.5
  const total = reviews.reduce(function (sum, r) { return sum + Number(r.stars); }, 0);
  const average = Math.round((total / reviews.length) * 10) / 10;

  const cards = reviews.map(function (r) {
    // "2026-11-18" → "18 November 2026"
    const date = r.date ? new Date(r.date + 'T12:00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : '';
    return '<figure class="card review">' +
      starsHTML(r.stars) +
      '<blockquote><p>' + escapeHTML(r.text) + '</p></blockquote>' +
      '<figcaption><strong>' + escapeHTML(r.reviewer) + '</strong>' + (date ? ' · <span class="meta" style="display:inline">' + date + '</span>' : '') + '</figcaption>' +
    '</figure>';
  }).join('');

  return '<section class="section" aria-labelledby="rev-title">' +
    '<h2 class="section-title" id="rev-title">Reviews</h2>' +
    '<p class="review-summary">' + starsHTML(average) + ' <strong>' + average + '</strong> · ' + reviews.length + (reviews.length === 1 ? ' review' : ' reviews') + '</p>' +
    '<div class="grid">' + cards + '</div>' +
  '</section>';
}


/* -------------------------------------------------------------
   5. START
   ------------------------------------------------------------- */
async function startBook() {
  const box = document.getElementById('book');
  let data;
  try {
    data = await loadAllData();
  } catch (error) {
    showDataError(box, error);
    return;
  }

  // 1. Find the book from the ?id= in the address
  const id = getIdFromUrl();
  const book = findById(data.books, id);
  if (!book) {
    box.innerHTML = notFoundHTML('Book', id, 'library.html', 'Back to the library');
    return;
  }

  document.title = book.shortTitle + ' · Between the Lines';   // the browser tab title
  box.innerHTML = bookDetailsHTML(book, data) + illustrationSectionHTML(book) + pairingHTML(book, data) +
    episodesHTML(book, data) + resourcesHTML(book, data) + reviewsHTML(book, data);
  updateSaveButtons();
}

startBook();
