/* Barth CD II/1 featured guide preloader.
   Attaches section-level guide metadata, especially CD II/1 §28, before app.js renders. */
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

  function findBarthBook() {
    var books = window.__DATA__ && Array.isArray(window.__DATA__.books) ? window.__DATA__.books : [];
    return books.find(function (book) { return book && book.id === "barth-church-dogmatics"; });
  }

  function findChapterByRef(book, ref) {
    if (!book || !Array.isArray(book.parts)) return null;
    for (var i = 0; i < book.parts.length; i += 1) {
      var chapters = Array.isArray(book.parts[i].chapters) ? book.parts[i].chapters : [];
      for (var j = 0; j < chapters.length; j += 1) {
        if (chapters[j] && chapters[j].ref === ref) return chapters[j];
      }
    }
    return null;
  }

  function attachGuide(guide) {
    var book = findBarthBook();
    var chapter = findChapterByRef(book, guide.ref);
    if (!chapter) return;
    chapter.featuredGuide = {
      doc: guide.doc,
      role: guide.role,
      coreFormulaKo: guide.coreFormulaKo,
      linkedTopics: guide.linkedTopics || [],
      researchQuestions: guide.researchQuestions || []
    };
    chapter.detail = [
      chapter.detail || chapter.summary || "",
      guide.coreFormulaKo ? "핵심 공식: " + guide.coreFormulaKo : "",
      guide.doc ? "별도 해설 문서: " + guide.doc : ""
    ].filter(Boolean).join(" ");
    chapter.keyPoints = (chapter.keyPoints || []).concat([guide.coreFormulaKo, guide.role].filter(Boolean));
    chapter.concepts = (chapter.concepts || []).concat(guide.linkedTopics || []);
  }

  var data = loadJson("./data/barth-cd-ii-1-featured-guides.json", { guides: [] });
  (data.guides || []).forEach(attachGuide);
  window.__BARTH_II1_FEATURED_GUIDES__ = data;
})();
