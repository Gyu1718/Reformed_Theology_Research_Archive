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

  function bookQuality(book) {
    var parts = Array.isArray(book.parts) ? book.parts : [];
    var chapters = parts.reduce(function (n, part) {
      return n + (Array.isArray(part.chapters) ? part.chapters.length : 0);
    }, 0);
    return parts.length * 100 + chapters * 10 + ((book.summary || "").length);
  }

  function dedupeBooks(books) {
    var best = {};
    (books || []).forEach(function (book) {
      if (!book || !book.id) return;
      if (!best[book.id] || bookQuality(book) >= bookQuality(best[book.id])) best[book.id] = book;
    });
    return Object.keys(best).map(function (id) { return best[id]; });
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
        ref: section,
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
        book.summary = "바르트의 『교회교의학』은 하나님의 말씀, 삼위일체, 하나님 인식, 선택, 창조, 화해, 교회의 증언을 중심으로 전개되는 20세기 개신교 교의학의 대표 문헌입니다. 이 항목은 원문 전체가 아니라 권별·§별 구조와 핵심 논지, 한국어 번역 인용, 개혁파 정통과의 비교 지점을 색인합니다.";
        book.researchUse = "칼빈·벌코프·바빙크와 비교할 때, 바르트는 신학의 출발점을 인간의 종교 의식이나 자연신학이 아니라 예수 그리스도 안에서 일어나는 하나님의 자기계시에 둡니다. 계시론, 성경론, 예정론, 창조론, 화해론, 교회론 비교에 특히 중요합니다.";
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
  var combinedBooks = dedupeBooks(books.concat(Array.isArray(extraBooks) ? extraBooks : []));

  var barthStructure = loadJson("./data/books-barth-structure-map.json", null);
  combinedBooks = dedupeBooks(applyBarthStructureMap(combinedBooks, barthStructure));

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
