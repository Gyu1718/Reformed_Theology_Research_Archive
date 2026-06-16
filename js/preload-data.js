/* Supplemental data preloader.
   Loads the default archive data plus supplemental book, structure, and quote files before app.js starts. */
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

  function sectionToChapter(section) {
    if (typeof section === "string") {
      return {
        ref: section.replace(/^§/, "CD ").split(" ")[0] === "CD" ? section : section,
        title: section,
        summary: section,
        detail: "이 항목은 바르트 『교회교의학』의 실제 목차 구조를 반영한 § 단위 색인입니다.",
        keyPoints: [],
        concepts: ["교회교의학"]
      };
    }
    var keyPoints = Array.isArray(section.subtopics) ? section.subtopics : [];
    return {
      ref: section.ref || "",
      title: section.title || "",
      summary: keyPoints.length ? keyPoints.join(" / ") : (section.title || ""),
      detail: "이 §는 『교회교의학』의 실제 목차에서 ‘" + (section.title || "") + "’로 제시되는 단락입니다. 주요 소주제는 " + (keyPoints.length ? keyPoints.join(", ") : "추가 정리 필요") + "입니다.",
      keyPoints: keyPoints,
      concepts: keyPoints.slice(0, 4).concat([section.title || "교회교의학"]).filter(Boolean)
    };
  }

  function partFromMap(volume, part) {
    var sections = Array.isArray(part.sections) ? part.sections : [];
    return {
      title: [volume.volume, part.largeTopic].filter(Boolean).join(" — "),
      summary: (volume.theme ? volume.theme + ": " : "") + (part.largeTopic || ""),
      chapters: sections.map(sectionToChapter)
    };
  }

  function applyBarthStructureMap(books, structureMap) {
    if (!structureMap || !Array.isArray(structureMap.volumes)) return books;
    var parts = [];
    structureMap.volumes.forEach(function (volume) {
      (volume.parts || []).forEach(function (part) {
        parts.push(partFromMap(volume, part));
      });
    });
    if (!parts.length) return books;

    books.forEach(function (book) {
      if (book && book.id === "barth-church-dogmatics") {
        book.summary = book.summary || "바르트 『교회교의학』 한국어 구조 색인";
        book.researchUse = book.researchUse || "권/분권/장/§/소주제 구조를 따라 개혁파 정통과 비교 연구할 수 있도록 정리한 항목입니다.";
        book.parts = parts;
        book.edition = "『교회교의학』 영어판 기반 한국어 구조 색인 · " + parts.length + "개 대주제 / " + parts.reduce(function (n, p) { return n + (p.chapters || []).length; }, 0) + "개 §";
      }
    });
    return books;
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

  var barthStructure = loadJson("./data/books-barth-structure-map.json", null);
  combinedBooks = applyBarthStructureMap(combinedBooks, barthStructure);

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
