/* Improve Books tab search coverage without changing the generic app renderer.
   It makes Barth study-note fields searchable: question, thesis, argumentFlow,
   subtopicNotes, reformedContrast, studyQuestions, and translated quote metadata. */
(function () {
  function list(value) { return Array.isArray(value) ? value : []; }
  function quoteText(quote) {
    if (!quote) return "";
    return [quote.text, quote.source, quote.ref, quote.topic].filter(Boolean).join(" ");
  }
  function chapterSearchText(chapter) {
    if (!chapter) return "";
    return [
      chapter.ref,
      chapter.title,
      chapter.summary,
      chapter.detail,
      chapter.question,
      chapter.thesis,
      chapter.reformedContrast,
      chapter.subtopicSearchText,
      list(chapter.keyPoints).join(" "),
      list(chapter.concepts).join(" "),
      list(chapter.argumentFlow).join(" "),
      list(chapter.studyQuestions).join(" "),
      list(chapter.subtopicNotes).map(function (item) { return [item.title, item.summary, item.note].filter(Boolean).join(" "); }).join(" "),
      list(chapter.quotes).map(quoteText).join(" ")
    ].filter(Boolean).join(" ");
  }
  function bookSearchText(book) {
    var parts = list(book.parts).map(function (part) {
      return [
        part.title,
        part.summary,
        list(part.quotes).map(quoteText).join(" "),
        list(part.chapters).map(chapterSearchText).join(" ")
      ].filter(Boolean).join(" ");
    }).join(" ");
    var chapters = list(book.chapters).map(chapterSearchText).join(" ");
    return [
      book.title,
      book.author,
      book.originalAuthor,
      book.summary,
      book.researchUse,
      book.edition,
      book.category,
      book.tradition,
      list(book.topics).join(" "),
      list(book.bibleReferences).join(" "),
      parts,
      chapters
    ].filter(Boolean).join(" ");
  }
  function renderBooksWithDeepSearch() {
    var items = DATA.books.filter(function (book) {
      return matchTrad(book.tradition) && matchQ(bookSearchText(book));
    });
    if (!items.length) return emptyState("책");
    view.innerHTML = '<div class="grid">' + items.map(function (book) {
      var total = book.parts ? book.parts.reduce(function (n, part) { return n + (part.chapters ? part.chapters.length : 0); }, 0) : list(book.chapters).length;
      return '<article class="card t-' + tradClass(book.tradition) + '">' +
        '<div class="meta-row">' + tradTag(book.tradition) + '<span class="cat-tag">' + (book.category || "") + '</span>' + (book.edition ? '<span class="cat-tag">· ' + book.edition + '</span>' : "") + '</div>' +
        '<h3>' + book.title + '</h3>' +
        '<p class="by">' + book.author + (book.originalAuthor ? ' · ' + book.originalAuthor : "") + '</p>' +
        '<p class="sum">' + (book.summary || "") + '</p>' +
        '<div class="tags">' + list(book.topics).slice(0, 12).map(function (topic) { return '<span class="tag">' + topic + '</span>'; }).join("") + (total ? '<span class="tag">' + total + '개 §/장</span>' : "") + '</div>' +
        '<div class="card-actions"><button class="open-link" data-book-open="' + book.id + '">상세 페이지 열기 →</button></div>' +
      '</article>';
    }).join("") + '</div>';
    view.querySelectorAll("[data-book-open]").forEach(function (button) {
      button.onclick = function () { setRoute("book", button.dataset.bookOpen); };
    });
  }
  try {
    if (typeof VIEWS !== "undefined" && typeof DATA !== "undefined") {
      VIEWS.books = renderBooksWithDeepSearch;
      window.__BOOK_SEARCH_TEXT__ = bookSearchText;
      if (state && state.view === "books" && !state.route) render();
    }
  } catch (error) {
    console.warn("Books search enhancer could not be applied.", error);
  }
})();
