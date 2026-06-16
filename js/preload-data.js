/* Supplemental data preloader.
   Loads the default archive data plus supplemental book and quote files before app.js starts. */
(function () {
  function loadJson(path, fallback) {
    try {
      var xhr = new XMLHttpRequest();
      xhr.open("GET", path, false);
      xhr.send(null);
      if (xhr.status >= 200 && xhr.status < 300) return JSON.parse(xhr.responseText);
    } catch (error) {
      console.warn(path + " was not preloaded.", error);
    }
    return fallback;
  }

  function normalizeBarthQuote(quote) {
    return {
      text: quote.textKo || quote.text || "",
      source: quote.source || "칼 바르트, 『교회교의학』 영어판에서 한국어 번역",
      ref: quote.ref || [quote.volume, quote.section, quote.chapter, quote.subtopic].filter(Boolean).join(" "),
      topic: quote.topic || quote.subtopic || quote.chapter || "바르트 교회교의학"
    };
  }

  function attachQuotesToBooks(books, quotePacks) {
    var allQuotes = [];
    quotePacks.forEach(function (pack) {
      if (pack && Array.isArray(pack.quotes)) allQuotes = allQuotes.concat(pack.quotes);
    });
    if (!allQuotes.length) return books;

    books.forEach(function (book) {
      if (!book || !Array.isArray(book.parts)) return;
      var bookQuotes = allQuotes.filter(function (quote) { return quote.book === book.id; });
      if (!bookQuotes.length) return;

      book.parts.forEach(function (part) {
        (part.chapters || []).forEach(function (chapter) {
          var matched = bookQuotes.filter(function (quote) {
            var quoteRef = [quote.volume, quote.section].filter(Boolean).join(" ").trim();
            return chapter.ref === quoteRef || (quote.ref && quote.ref.indexOf(chapter.ref) === 0);
          });
          if (!matched.length) return;
          var existing = Array.isArray(chapter.quotes) ? chapter.quotes : [];
          var merged = existing.concat(matched.map(normalizeBarthQuote));
          var seen = {};
          chapter.quotes = merged.filter(function (item) {
            var key = [item.text, item.ref].join("|");
            if (seen[key]) return false;
            seen[key] = true;
            return true;
          });
        });
      });
    });
    return books;
  }

  var books = loadJson("./data/books.json", []);
  var extraBooks = loadJson("./data/books-barth.json", []);
  var combinedBooks = books.concat(Array.isArray(extraBooks) ? extraBooks : []);

  var quotePacks = [
    loadJson("./data/quotes/barth-translated-sentence-quotes-v1.json", null)
  ].filter(Boolean);

  window.__DATA__ = {
    books: attachQuotesToBooks(combinedBooks, quotePacks),
    authors: loadJson("./data/authors.json", []),
    topics: loadJson("./data/topics.json", []),
    passages: loadJson("./data/passages.json", []),
    notes: loadJson("./data/notes.json", []),
    taxonomy: loadJson("./data/taxonomy.json", {})
  };
})();
