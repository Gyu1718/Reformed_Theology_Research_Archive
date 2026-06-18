/* Load curated Barth subtopic files before the fallback completion layer.
   Curated files are organized by CD volume and replace generated fallback subtopic notes. */
(function () {
  if (!window.__DATA__ || !Array.isArray(window.__DATA__.books)) return;

  function arr(value) { return Array.isArray(value) ? value : []; }
  function clean(text) { return String(text || "").replace(/\s+/g, " ").trim(); }
  function loadJson(path, fallback) {
    try {
      var xhr = new XMLHttpRequest();
      xhr.open("GET", path, false);
      xhr.send(null);
      if (xhr.status >= 200 && xhr.status < 300) return JSON.parse(xhr.responseText);
    } catch (error) {
      console.warn(path + " was not loaded by Barth curated subtopic loader.", error);
    }
    return fallback;
  }
  function normalizeSubtopic(item) {
    if (!item || !item.title) return null;
    return {
      title: clean(item.title),
      summary: clean(item.summary),
      note: clean(item.note),
      argumentRole: clean(item.argumentRole),
      reformedContrast: clean(item.reformedContrast),
      studyPrompt: clean(item.studyPrompt),
      curated: true
    };
  }
  function replaceSubtopics(chapter, incoming) {
    var curated = arr(incoming).map(normalizeSubtopic).filter(function (item) {
      return item && item.title;
    });
    if (!curated.length) return;
    chapter.subtopicNotes = curated;
    chapter.studyNoteApplied = true;
    chapter.curatedSubtopicsApplied = true;
    chapter.subtopicSearchText = chapter.subtopicNotes.map(function (item) {
      return [item.title, item.summary, item.note, item.argumentRole, item.reformedContrast, item.studyPrompt].filter(Boolean).join(" ");
    }).join(" ");
  }
  function applyPack(book, pack) {
    arr(pack && pack.chapters).forEach(function (entry) {
      arr(book.parts).forEach(function (part) {
        arr(part.chapters).forEach(function (chapter) {
          if (clean(chapter.ref) !== clean(entry.ref)) return;
          replaceSubtopics(chapter, entry.subtopics);
        });
      });
    });
  }

  var packs = [
    loadJson("./data/barth-subtopics-i-1.json", null),
    loadJson("./data/barth-subtopics-i-1-trinity.json", null),
    loadJson("./data/barth-subtopics-i-2-incarnation-spirit.json", null),
    loadJson("./data/barth-subtopics-i-2-scripture-proclamation.json", null),
    loadJson("./data/barth-subtopics-ii-1.json", null)
  ];
  window.__DATA__.books.forEach(function (book) {
    if (!book || book.id !== "barth-church-dogmatics") return;
    packs.forEach(function (pack) { applyPack(book, pack); });
  });
})();
