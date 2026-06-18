/* Calvin Institutes renderer compatibility shim.
   Calvin chapter data is normalized before app.js by book-description-standardize.js.
   This file keeps the shared Barth-style book detail page and adds a small
   enhancement layer for Calvin subtopic detail cards after app.js renders. */
(function () {
  function esc(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function arr(value) {
    return Array.isArray(value) ? value : [];
  }

  function installStyles() {
    if (document.querySelector("#calvin-subtopic-detail-styles")) return;
    var style = document.createElement("style");
    style.id = "calvin-subtopic-detail-styles";
    style.textContent = "\n" +
      ".calvin-subtopic-details{margin-top:14px;border-top:1px solid var(--line);padding-top:12px;display:grid;gap:10px}\n" +
      ".calvin-subtopic-title{font-family:var(--font-mono);font-size:.72rem;letter-spacing:.1em;text-transform:uppercase;color:var(--muted);margin:0 0 2px}\n" +
      ".calvin-subtopic-card{border:1px solid var(--line);border-radius:12px;background:var(--surface-2);padding:12px 13px}\n" +
      ".calvin-subtopic-card b{display:block;color:var(--ink);margin-bottom:5px}\n" +
      ".calvin-subtopic-card p{margin:4px 0;color:var(--muted);line-height:1.72}\n" +
      ".calvin-subtopic-card .mini-label{font-weight:700;color:var(--ink)}\n" +
      ".calvin-subtopic-card .quote-targets{margin-top:7px;display:flex;gap:6px;flex-wrap:wrap}\n" +
      ".calvin-subtopic-card .quote-targets span{border:1px solid var(--line);border-radius:999px;background:var(--surface);padding:4px 8px;font-family:var(--font-mono);font-size:.74rem;color:var(--muted)}\n";
    document.head.appendChild(style);
  }

  function findBook() {
    var books = window.__DATA__ && Array.isArray(window.__DATA__.books) ? window.__DATA__.books : [];
    return books.find(function (book) { return book && book.id === "calvin-institutes"; });
  }

  function buildMap(book) {
    var map = {};
    arr(book && book.parts).forEach(function (part) {
      arr(part.chapters).forEach(function (chapter) {
        if (!chapter || !chapter.ref) return;
        map[chapter.ref] = chapter;
      });
    });
    return map;
  }

  function field(label, value) {
    return value ? '<p><span class="mini-label">' + esc(label) + ':</span> ' + esc(value) + '</p>' : "";
  }

  function quoteChip(value) {
    if (!value) return "";
    if (typeof value === "string") return '<span>' + esc(value) + '</span>';
    return '<span>' + esc(value.target || value.ref || value.location || value.topic || "인용 후보") + '</span>';
  }

  function subtopicHTML(item) {
    var quoteTargets = arr(item.quoteTargets || item.refs || item.connections).slice(0, 6);
    return '<section class="calvin-subtopic-card">' +
      '<b>' + esc(item.title || "소주제") + '</b>' +
      field("설명", item.explanation || item.note || item.summary) +
      field("핵심 질문", item.keyQuestion || item.question || item.studyPrompt) +
      field("논증 역할", item.doctrinalFunction || item.argumentRole) +
      field("오독 방지", item.caution) +
      (quoteTargets.length ? '<div class="quote-targets">' + quoteTargets.map(quoteChip).join("") + '</div>' : "") +
      '</section>';
  }

  function quoteTargetHTML(item) {
    if (!item) return "";
    if (typeof item === "string") {
      return '<section class="calvin-subtopic-card"><b>인용 후보 위치</b>' + field("위치", item) + '</section>';
    }
    return '<section class="calvin-subtopic-card"><b>' + esc(item.topic || "인용 후보 위치") + '</b>' +
      field("위치", item.target || item.ref || item.location) +
      field("선별 이유", item.reason || item.note || item.context) +
      '</section>';
  }

  function renderForChapter(chapter) {
    var details = arr(chapter && chapter.subtopicsRaw).length ? chapter.subtopicsRaw : arr(chapter && chapter.subtopicDetails);
    var quoteTargets = arr(chapter && chapter.quoteTargets);
    if (!details.length && !quoteTargets.length) return "";
    return '<div class="calvin-subtopic-details" data-calvin-subtopic-rendered="true">' +
      (details.length ? '<p class="calvin-subtopic-title">Subtopic Notes</p>' + details.map(subtopicHTML).join("") : "") +
      (quoteTargets.length ? '<p class="calvin-subtopic-title">Quote Targets</p>' + quoteTargets.map(quoteTargetHTML).join("") : "") +
      '</div>';
  }

  function refFromNode(node) {
    var text = node && node.querySelector(".cref") ? node.querySelector(".cref").textContent : "";
    return String(text || "").trim();
  }

  function apply() {
    installStyles();
    var book = findBook();
    if (!book) return;
    var map = buildMap(book);
    document.querySelectorAll("details.chap-x").forEach(function (node) {
      if (node.querySelector('[data-calvin-subtopic-rendered="true"]')) return;
      var ref = refFromNode(node);
      var chapter = map[ref];
      var html = renderForChapter(chapter);
      var target = node.querySelector(".chap-detail");
      if (target && html) target.insertAdjacentHTML("afterbegin", html);
    });
  }

  document.addEventListener("DOMContentLoaded", apply);
  window.addEventListener("hashchange", function () { setTimeout(apply, 0); });
  var view = document.querySelector("#view");
  if (view) new MutationObserver(apply).observe(view, { childList: true, subtree: true });

  if (typeof render === "function") render();
  apply();
})();
