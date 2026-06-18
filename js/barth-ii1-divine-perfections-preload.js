/* Barth CD II/1 divine perfections comparison preloader.
   Attaches §29–§31 comparison metadata before app.js renders. */
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

  function unique(values) {
    var seen = {};
    return (values || []).filter(function (value) {
      var key = String(value || "").trim();
      if (!key || seen[key]) return false;
      seen[key] = true;
      return true;
    });
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

  function pairSummary(section) {
    return (section.pairs || []).map(function (pair) {
      return pair.nameKo + ': ' + pair.barth;
    });
  }

  function attachComparison(section, frame, doc) {
    var book = findBarthBook();
    var chapter = findChapterByRef(book, section.ref);
    if (!chapter) return;
    var pairLines = pairSummary(section);
    chapter.divinePerfectionsComparison = {
      doc: doc,
      role: section.role,
      classicReformed: section.classicReformed,
      barth: section.barth,
      keyQuestion: frame && frame.keyQuestion,
      pairs: section.pairs || [],
      researchQuestions: section.researchQuestions || [],
      linkedTopics: section.linkedTopics || []
    };
    chapter.detail = [
      chapter.detail || chapter.summary || '',
      '비교 해설: ' + section.role,
      '개혁파 정통: ' + section.classicReformed,
      '바르트: ' + section.barth,
      pairLines.length ? '세부 쌍: ' + pairLines.join(' / ') : '',
      doc ? '별도 비교 문서: ' + doc : ''
    ].filter(Boolean).join(' ');
    chapter.keyPoints = unique((chapter.keyPoints || []).concat([section.role].concat(pairLines).concat(section.researchQuestions || [])));
    chapter.concepts = unique((chapter.concepts || []).concat(section.linkedTopics || []));
  }

  var data = loadJson('./data/barth-cd-ii-1-divine-perfections-comparison.json', { sections: [] });
  (data.sections || []).forEach(function (section) {
    attachComparison(section, data.comparisonFrame || {}, data.doc);
  });
  window.__BARTH_II1_DIVINE_PERFECTIONS_COMPARISON__ = data;
})();
