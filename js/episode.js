/* =============================================================
   EPISODE PAGE SCRIPT (episode.js)
   -------------------------------------------------------------
   episode.html is ONE page for EVERY episode:
   episode.html?id=ep1

   1. Top: title, status, linked book
   2. Video (YouTube) or "Video coming soon"
   3. Show notes: concept, technique, echo, synthesis
   4. Transcript
   5. Quiz (the quiz engine is in app.js)
   6. Linked book and resources
   7. Start
   ============================================================= */


/* 1. TOP PART */
function headerHTML(ep, book, author) {
  const bookLine = book
    ? '<a href="' + pageUrl('books', book.id) + '"><em>' + escapeHTML(book.shortTitle) + '</em></a>' + (author ? ' · ' + escapeHTML(author.name) : '')
    : 'Book to be announced';

  return '<a class="more-link" href="episodes.html">← All episodes</a>' +
    '<header class="page-head episode-head" style="margin-top:20px">' +
      '<div class="row tags-row"><span class="pill">Episode ' + ep.number + '</span>' + statusBadgeHTML(ep.status) +
        (ep.discipline !== 'TBA' ? '<span class="tag tag-green">' + escapeHTML(ep.discipline) + '</span>' : '') +
        (ep.duration ? '<span class="tag tag-cream">' + escapeHTML(ep.duration) + '</span>' : '') +
      '</div>' +
      '<h1>' + escapeHTML(ep.title) + '</h1>' +
      '<p class="lead">' + bookLine + '</p>' +
    '</header>';
}


/* 2. VIDEO ("youtubeId" in episodes.json)
   Two stages, so the page stays fast and private:
   1. First we show only YouTube's preview picture with our own
      play button (a normal <button>, so it works with the keyboard too).
   2. When the visitor clicks it, setupPlayer() swaps the picture for
      the real YouTube player (an <iframe>) that starts playing at once.
   youtube-nocookie.com is YouTube's privacy-friendly address.
   Under the player: "Watch on YouTube" and "Test yourself" (only if
   "quizUrl" is filled in). Both open in a new tab. */
function videoHTML(ep) {
  const id = episodeVideoId(ep);   // app.js
  if (!id) {
    return '<div class="video video-soon"><span>Video coming soon</span></div>';
  }

  const newTab = icon('external') + '<span class="visually-hidden"> (opens in a new tab)</span>';
  const quizButton = hasText(ep.quizUrl) && ep.quizUrl.startsWith('https://')
    ? '<a class="btn btn-ghost" href="' + escapeHTML(ep.quizUrl) + '" target="_blank" rel="noopener">Test yourself ' + newTab + '</a>'
    : '';

  return '<section class="card player-card" id="player" aria-label="Video: Episode ' + ep.number + '">' +
    '<div class="video" data-video-id="' + id + '" data-video-title="Between the Lines – Episode ' + ep.number + '">' +
      '<button type="button" class="video-play">' +
        '<img src="' + youtubeThumbUrl(id) + '" alt="" width="480" height="360">' +
        '<span class="play-circle" aria-hidden="true">' + icon('playSolid') + '</span>' +
        '<span class="visually-hidden">Play Episode ' + ep.number + ': ' + escapeHTML(ep.title) + '</span>' +
      '</button>' +
    '</div>' +
    '<div class="row player-actions">' +
      '<a class="btn" href="' + youtubeWatchUrl(id) + '" target="_blank" rel="noopener">Watch on YouTube ' + newTab + '</a>' +
      quizButton +
    '</div>' +
  '</section>';
}

// Click on the preview → put the real YouTube player in its place.
//   autoplay=1 → it starts at once (the visitor already pressed play)
//   rel=0      → suggested videos at the end come from our channel
function setupPlayer() {
  const box = document.querySelector('.video[data-video-id]');
  if (!box) return;   // no video on this episode
  const button = box.querySelector('.video-play');

  button.addEventListener('click', function () {
    const iframe = document.createElement('iframe');
    iframe.src = 'https://www.youtube-nocookie.com/embed/' + box.dataset.videoId + '?autoplay=1&rel=0';
    iframe.title = box.dataset.videoTitle;   // "Between the Lines – Episode 1"
    iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
    iframe.allowFullscreen = true;
    // YouTube needs to know which website the player is on, or it refuses to play
    iframe.referrerPolicy = 'strict-origin-when-cross-origin';
    box.replaceChildren(iframe);   // the picture and button disappear
    iframe.focus();                // keyboard users continue inside the player
  });
}


/* 3. SHOW NOTES: one card per part. TODO notes show "Coming soon". */
const NOTE_PARTS = [
  { key: 'concept',   label: 'The concept',        hint: 'The real science, math or history idea' },
  { key: 'technique', label: 'Literary technique', hint: 'How the author builds the scene' },
  { key: 'echo',      label: 'Modern echo',        hint: 'The same pattern today or in another literature' },
  { key: 'synthesis', label: 'Synthesis',          hint: 'What they reveal together' }
];

function showNotesHTML(ep) {
  const cards = NOTE_PARTS.map(function (part, i) {
    const text = ep.showNotes[part.key];
    return '<div class="card note-card">' +
      '<span class="num">' + (i + 1) + '</span>' +
      '<h3>' + part.label + '</h3>' +
      '<p class="meta">' + part.hint + '</p>' +
      (hasText(text) ? '<p>' + escapeHTML(text) + '</p>' : '<p class="meta"><em>Coming soon.</em></p>') +
    '</div>';
  }).join('');

  return '<section class="section" aria-labelledby="notes-title">' +
    '<h2 class="section-title" id="notes-title">Show notes</h2>' +
    '<div class="notes-grid">' + cards + '</div>' +
  '</section>';
}


/* 4. TRANSCRIPT: an empty line in the text = a new paragraph */
function transcriptHTML(ep) {
  const content = hasText(ep.transcript)
    ? ep.transcript.split(/\n\s*\n/).map(function (para) { return '<p>' + escapeHTML(para) + '</p>'; }).join('')
    : '<p class="meta">The transcript will be added after recording.</p>';

  return '<section class="section">' +
    '<details class="card transcript">' +
      '<summary><span class="section-title">Transcript</span></summary>' +
      '<div class="transcript-text">' + content + '</div>' +
    '</details>' +
  '</section>';
}


/* 5. QUIZ: intro + Google Form buttons (only when the links are real) */
function quizSectionHTML(ep) {
  const forms = ep.quizForms || {};
  function formButton(link, label, extraClass) {
    return hasText(link) && link.startsWith('http')
      ? '<a class="btn ' + extraClass + '" href="' + escapeHTML(link) + '" target="_blank" rel="noopener">' + label + '<span class="visually-hidden"> (Google Form, opens in a new tab)</span></a>'
      : '';
  }
  const buttons = formButton(forms.before, 'Before watching', '') + formButton(forms.after, 'After watching', 'btn-ghost');

  return '<section class="section card card-cream" aria-labelledby="quiz-title">' +
    '<h2 class="section-title" id="quiz-title">Test yourself</h2>' +
    '<p>Take a 2-minute quiz before you watch, then again after. See how much you learned, and help our research.</p>' +
    (buttons ? '<div class="row" style="margin-bottom:24px">' + buttons + '</div>' : '') +
    '<div id="quiz"></div>' +
  '</section>';
}


/* 6. LINKED BOOK AND RESOURCES */
function linksHTML(ep, book, data) {
  const resources = resourcesForEpisode(data, ep);   // from app.js

  // The book's cover card, plus its public-domain illustration if it has
  // one (illustrationHTML() is in app.js; it returns '' if there is none)
  const bookPart = book
    ? '<div class="linked-book">' + bookCardHTML(book, data) + '</div>' + illustrationHTML(book)
    : '<p class="meta">Book to be announced.</p>';

  const resourcePart = resources.length === 0
    ? '<p class="notice">No resources for this episode yet.</p>'
    : '<ul class="mini-list resource-list">' + resources.map(resourceItemHTML).join('') + '</ul>' +
      '<a class="more-link" href="resources.html?episode=' + encodeURIComponent(ep.id) + '">See all in the research database (with APA citations) →</a>';

  return '<div class="links-grid section">' +
    '<section aria-labelledby="book-title"><h2 class="section-title" id="book-title">The book</h2>' + bookPart + '</section>' +
    '<section class="card" aria-labelledby="sources-title"><h2 class="section-title" id="sources-title">Sources and further reading</h2>' + resourcePart + '</section>' +
  '</div>';
}


/* 7. START */
async function startEpisode() {
  const box = document.getElementById('episode');
  let data;
  try {
    data = await loadAllData();
  } catch (error) {
    showDataError(box, error);
    return;
  }

  const id = getIdFromUrl();
  const ep = findById(data.episodes, id);
  if (!ep) {
    box.innerHTML = notFoundHTML('Episode', id, 'episodes.html', 'Back to all episodes');
    return;
  }

  document.title = 'Episode ' + ep.number + ' · Between the Lines';
  const book = findById(data.books, ep.book);
  const author = book ? findById(data.authors, book.author) : null;

  // "Coming soon" episodes: only a short message
  if (ep.status === 'coming-soon') {
    box.innerHTML = headerHTML(ep, book, author) +
      '<p class="notice">This episode is still being planned. Check back soon!</p>';
    return;
  }

  box.innerHTML =
    headerHTML(ep, book, author) +
    videoHTML(ep) +
    '<div class="row" style="margin-top:18px">' + saveButton('episodes', ep.id) + doneButton('episodes', ep.id) + '</div>' +
    showNotesHTML(ep) +
    transcriptHTML(ep) +
    quizSectionHTML(ep) +
    linksHTML(ep, book, data);

  setupPlayer();                                         // preview → player on click
  buildQuiz(document.getElementById('quiz'), ep.quiz);   // quiz engine from app.js
  updateSaveButtons();
}

startEpisode();
