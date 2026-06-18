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

  function text(value, fallback) {
    if (value == null) return fallback || "";
    if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") return String(value).trim();
    if (Array.isArray(value)) return value.map(function (item) { return text(item); }).filter(Boolean).join(" · ");
    if (typeof value === "object") {
      return text(value.title || value.label || value.name || value.text || value.summary || value.displaySummary || value.explanation || value.note || value.description, fallback);
    }
    return fallback || "";
  }

  function textArray(items) {
    if (!Array.isArray(items)) return [];
    return items.map(function (item) { return text(item); }).filter(Boolean);
  }

  function unique(items) {
    var seen = {};
    return (items || []).filter(function (item) {
      var key = text(item).trim();
      if (!key || seen[key]) return false;
      seen[key] = true;
      return true;
    });
  }

  function slug(value, fallback) {
    var raw = text(value, fallback || "subtopic").toLowerCase();
    return raw.replace(/[^a-z0-9가-힣]+/g, "-").replace(/^-+|-+$/g, "") || (fallback || "subtopic");
  }

  function normalizeSubtopic(item, index, ref) {
    var displaySummary = text(item && (item.displaySummary || item.summary));
    var explanation = text(item && (item.explanation || item.note || item.description)) || displaySummary;
    var title = text(item && (item.title || item.label || item.name)) || displaySummary || "소주제 " + (index + 1);
    var keyQuestion = text(item && (item.keyQuestion || item.question));
    var doctrinalFunction = text(item && (item.doctrinalFunction || item.argumentRole || item.function));
    var caution = text(item && item.caution);
    var connections = unique(textArray(item && (item.connections || item.tags || item.concepts || item.refs || item.chapters)));
    var quoteTargets = unique(textArray(item && item.quoteTargets));

    return {
      id: text(item && item.id) || slug(ref + "-" + title, "subtopic-" + index),
      title: title,
      displaySummary: displaySummary || explanation,
      summary: displaySummary || explanation,
      explanation: explanation || displaySummary,
      note: explanation || displaySummary,
      keyQuestion: keyQuestion,
      question: keyQuestion,
      doctrinalFunction: doctrinalFunction,
      argumentRole: doctrinalFunction,
      connections: connections,
      quoteTargets: quoteTargets,
      caution: caution,
      _normalized: true
    };
  }

  function normalizePatch(patch) {
    var ref = normalizeRef(patch && patch.ref);
    var subtopics = Array.isArray(patch && patch.subtopics) ? patch.subtopics : [];
    return {
      ref: ref,
      title: text(patch && patch.title),
      chapterFunction: text(patch && (patch.chapterFunction || patch.summary || patch.explanation)),
      subtopics: subtopics.map(function (item, index) { return normalizeSubtopic(item, index, ref); })
    };
  }

  var pack = loadJson("./data/books-calvin-subtopics-expanded-v3.json");
  if (!pack || !Array.isArray(pack.chapterPatches)) return;
  if (!window.__DATA__ || !Array.isArray(window.__DATA__.books)) return;

  var book = window.__DATA__.books.find(function (item) { return item && item.id === (pack.bookId || "calvin-institutes"); });
  if (!book || !Array.isArray(book.parts)) return;

  var patchMap = {};
  pack.chapterPatches.forEach(function (patch) {
    var normalized = normalizePatch(patch);
    if (normalized.ref) patchMap[normalized.ref] = normalized;
  });

  book.parts.forEach(function (part) {
    (part.chapters || []).forEach(function (chapter) {
      var patch = patchMap[normalizeRef(chapter.ref)];
      if (!patch) return;

      chapter.chapterFunction = patch.chapterFunction || chapter.chapterFunction || "";
      chapter.subtopics = patch.subtopics;
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
