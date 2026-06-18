/* Barth book detail enhancer.
   Runs after preload-data.js and before app.js. It keeps source-translation quotes separate from editorial study notes. */
(function () {
  if (!window.__DATA__ || !Array.isArray(window.__DATA__.books)) return;

  function loadJson(path, fallback) {
    try {
      var xhr = new XMLHttpRequest();
      xhr.open("GET", path, false);
      xhr.send(null);
      if (xhr.status >= 200 && xhr.status < 300) return JSON.parse(xhr.responseText);
    } catch (error) {
      console.warn(path + " was not loaded by Barth enhancer.", error);
    }
    return fallback;
  }
  function arr(value) { return Array.isArray(value) ? value : []; }
  function norm(text) { return String(text || "").replace(/\s+/g, " ").replace(/—.*$/, "").trim(); }
  function noteMatches(note, chapter) {
    var refs = [note.ref].concat(arr(note.aliases)).map(norm);
    var ref = norm(chapter.ref);
    return refs.indexOf(ref) >= 0 || refs.some(function (item) { return item && ref.indexOf(item) === 0; });
  }
  function mergeUnique(a, b) {
    return arr(a).concat(arr(b)).filter(function (item, idx, list) { return item && list.indexOf(item) === idx; });
  }
  function attachNotes(book, notes) {
    book.parts.forEach(function (part) {
      arr(part.chapters).forEach(function (chapter) {
        var note = notes.find(function (candidate) { return noteMatches(candidate, chapter); });
        if (!note) return;
        chapter.studyNoteApplied = true;
        chapter.question = note.question;
        chapter.thesis = note.thesis;
        chapter.argumentFlow = note.argumentFlow;
        chapter.subtopicNotes = note.subtopicNotes;
        chapter.reformedContrast = note.reformedContrast;
        chapter.studyQuestions = note.studyQuestions;
        chapter.concepts = mergeUnique(chapter.concepts, note.concepts);
      });
    });
  }
  function cleanQuotes(book) {
    book.parts.forEach(function (part) {
      arr(part.chapters).forEach(function (chapter) {
        var seen = {};
        var quotes = arr(chapter.quotes).filter(function (quote) {
          if (!quote || !quote.text) return false;
          if (/해설문/.test(quote.source || "")) return false;
          var key = norm(quote.text);
          if (seen[key]) return false;
          seen[key] = true;
          return true;
        });
        if (quotes.length) chapter.quotes = quotes;
        else delete chapter.quotes;
      });
    });
  }

  var notePack = loadJson("./data/barth-study-notes.json", null);
  var notes = notePack && Array.isArray(notePack.notes) ? notePack.notes : [];
  window.__DATA__.books.forEach(function (book) {
    if (!book || book.id !== "barth-church-dogmatics" || !Array.isArray(book.parts)) return;
    cleanQuotes(book);
    if (notes.length) attachNotes(book, notes);
  });
})();
