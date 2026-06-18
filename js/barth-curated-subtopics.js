/* Load curated Barth content packs before the fallback completion layer.
   Pack paths are declared in data/barth-content-packs.json, not hard-coded here. */
(function () {
  if (!window.__DATA__ || !Array.isArray(window.__DATA__.books)) return;

  function arr(value) { return Array.isArray(value) ? value : []; }
  function clean(text) { return String(text || "").replace(/\s+/g, " ").trim(); }
  function loadJson(path, fallback, options) {
    options = options || {};
    try {
      var xhr = new XMLHttpRequest();
      xhr.open("GET", path, false);
      xhr.send(null);
      if (xhr.status >= 200 && xhr.status < 300) return JSON.parse(xhr.responseText);
      if (!options.optional) console.warn(path + " returned " + xhr.status + " in Barth content pack loader.");
    } catch (error) {
      if (!options.optional) console.warn(path + " was not loaded by Barth content pack loader.", error);
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
  function clearGeneratedDisplayFields(chapter) {
    chapter.summary = "";
    chapter.detail = "";
    chapter.keyPoints = [];
    chapter.quotes = [];
    chapter.concepts = [];
  }
  function replaceSubtopics(chapter, incoming) {
    var curated = arr(incoming).map(normalizeSubtopic).filter(function (item) {
      return item && item.title;
    });
    if (!curated.length) return;
    clearGeneratedDisplayFields(chapter);
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
  function packEntries() {
    var manifest = loadJson("./data/barth-content-packs.json", { packs: [] }, { optional: false });
    return arr(manifest && manifest.packs).filter(function (entry) {
      return entry && entry.active !== false && entry.path;
    });
  }

  var packs = packEntries().map(function (entry) {
    return loadJson(entry.path, null, { optional: entry.required === false });
  }).filter(Boolean);

  window.__DATA__.books.forEach(function (book) {
    if (!book || book.id !== "barth-church-dogmatics") return;
    packs.forEach(function (pack) { applyPack(book, pack); });
  });
})();
