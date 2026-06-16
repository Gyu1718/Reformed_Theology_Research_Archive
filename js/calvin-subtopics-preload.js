/* Calvin Institutes subtopics preload
   Upload path: js/calvin-subtopics-preload.js
   Requires: js/preload-data.js must run first. This file mutates window.__DATA__.books before app.js renders.
*/
(function () {
  function loadJson(path) {
    try {
      var xhr = new XMLHttpRequest();
      xhr.open("GET", path, false);
      xhr.send(null);
      if (xhr.status >= 200 && xhr.status < 300) return JSON.parse(xhr.responseText);
    } catch (error) {
      console.warn("Calvin subtopics preload failed:", path, error);
    }
    return null;
  }

  function normalizeRef(ref) {
    return String(ref || "").trim();
  }

  function unique(items) {
    var seen = {};
    return (items || []).filter(function (item) {
      var key = String(item || "").trim();
      if (!key || seen[key]) return false;
      seen[key] = true;
      return true;
    });
  }

  var pack = loadJson("./data/books-calvin-subtopics-expanded-v3.json");
  if (!pack || !Array.isArray(pack.chapterPatches)) return;
  if (!window.__DATA__ || !Array.isArray(window.__DATA__.books)) return;

  var book = window.__DATA__.books.find(function (item) { return item && item.id === (pack.bookId || "calvin-institutes"); });
  if (!book || !Array.isArray(book.parts)) return;

  var patchMap = {};
  pack.chapterPatches.forEach(function (patch) {
    if (patch && patch.ref) patchMap[normalizeRef(patch.ref)] = patch;
  });

  book.parts.forEach(function (part) {
    (part.chapters || []).forEach(function (chapter) {
      var patch = patchMap[normalizeRef(chapter.ref)];
      if (!patch) return;

      chapter.chapterFunction = patch.chapterFunction || chapter.chapterFunction || "";
      chapter.subtopics = Array.isArray(patch.subtopics) ? patch.subtopics : [];
      chapter.subtopicCount = chapter.subtopics.length;
      chapter.subtopicSource = "data/books-calvin-subtopics-expanded-v3.json";

      var connectionTerms = [];
      chapter.subtopics.forEach(function (subtopic) {
        connectionTerms = connectionTerms.concat(subtopic.connections || []);
      });
      chapter.concepts = unique((chapter.concepts || []).concat(connectionTerms).slice(0, 12));
    });
  });
})();
