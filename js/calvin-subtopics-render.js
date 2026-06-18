/* Calvin Institutes subtopics renderer
   Upload path: js/calvin-subtopics-render.js
   Requires: js/app.js must run first. This file extends chapterHTML() to show subtopic cards.
*/
(function () {
  if (typeof chapterHTML !== "function") return;

  var originalChapterHTML = chapterHTML;

  function valueText(value, fallback) {
    if (value == null) return fallback || "";
    if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") return String(value);
    if (Array.isArray(value)) return value.map(function (item) { return valueText(item); }).filter(Boolean).join(" · ");
    if (typeof value === "object") {
      return value.title || value.label || value.name || value.text || value.summary || value.displaySummary || value.explanation || value.note || fallback || "";
    }
    return fallback || "";
  }

  function esc(value) {
    return valueText(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function list(items, className) {
    if (!Array.isArray(items) || !items.length) return "";
    var rows = items.map(function (item) { return valueText(item); }).filter(Boolean);
    if (!rows.length) return "";
    return '<ul class="' + className + '">' + rows.map(function (item) {
      return "<li>" + esc(item) + "</li>";
    }).join("") + "</ul>";
  }

  function tags(items) {
    if (!Array.isArray(items) || !items.length) return "";
    var rows = items.map(function (item) { return valueText(item); }).filter(Boolean);
    if (!rows.length) return "";
    return '<div class="subtopic-tags">' + rows.map(function (item) {
      return '<span class="tag">' + esc(item) + '</span>';
    }).join("") + '</div>';
  }

  function subtopicId(item, index) {
    var raw = valueText(item && item.id, "subtopic-" + index);
    return raw.replace(/[^a-zA-Z0-9_-]+/g, "-").replace(/^-+|-+$/g, "") || ("subtopic-" + index);
  }

  function subtopicTitle(item) {
    return valueText(item && item.title) || valueText(item && item.label) || valueText(item && item.displaySummary) || "소주제";
  }

  function subtopicHTML(chapter) {
    var items = Array.isArray(chapter.subtopics) ? chapter.subtopics : [];
    if (!items.length) return "";

    var intro = chapter.chapterFunction
      ? '<p class="subtopics-intro">' + esc(chapter.chapterFunction) + '</p>'
      : "";

    var cards = items.map(function (item, index) {
      var displaySummary = valueText(item && item.displaySummary) || valueText(item && item.summary);
      var keyQuestion = valueText(item && item.keyQuestion) || valueText(item && item.question);
      var explanation = valueText(item && item.explanation) || valueText(item && item.note) || valueText(item && item.description) || displaySummary;
      var doctrinalFunction = valueText(item && item.doctrinalFunction) || valueText(item && item.argumentRole);
      var caution = valueText(item && item.caution);

      return '<article class="subtopic-card" id="subtopic-' + esc(subtopicId(item, index)) + '">' +
        '<div class="subtopic-head">' +
          '<span class="subtopic-label">소주제</span>' +
          '<h5>' + esc(subtopicTitle(item)) + '</h5>' +
        '</div>' +
        (displaySummary ? '<p class="subtopic-summary"><b>요약</b> ' + esc(displaySummary) + '</p>' : '') +
        (keyQuestion ? '<p class="subtopic-question"><b>핵심 질문</b> ' + esc(keyQuestion) + '</p>' : '') +
        (explanation ? '<p class="subtopic-explanation"><b>소주제 설명</b> ' + esc(explanation) + '</p>' : '') +
        (doctrinalFunction ? '<p class="subtopic-function"><b>교리적 기능</b> ' + esc(doctrinalFunction) + '</p>' : '') +
        tags(item && item.connections) +
        (Array.isArray(item && item.quoteTargets) && item.quoteTargets.length ? '<div class="subtopic-quotes"><b>인용 확인 위치</b>' + list(item.quoteTargets, 'quote-targets') + '</div>' : '') +
        (caution ? '<p class="subtopic-caution"><b>오독 주의</b> ' + esc(caution) + '</p>' : '') +
      '</article>';
    }).join("");

    return '<section class="subtopics-block"><h5>소주제 설명</h5>' + intro + '<div class="subtopic-grid">' + cards + '</div></section>';
  }

  chapterHTML = function (chapter) {
    var html = originalChapterHTML(chapter);
    var subtopics = subtopicHTML(chapter);
    if (!subtopics) return html;

    if (html.indexOf('</div></details>') !== -1) {
      return html.replace('</div></details>', subtopics + '</div></details>');
    }

    var ref = '<span class="cref">' + esc(chapter.ref || '·') + '</span>';
    var head = ref + '<div class="chap-head"><b>' + esc(chapter.title || '') + '</b>' + (chapter.summary ? '<p>' + esc(chapter.summary) + '</p>' : '') + '</div>';
    return '<details class="chap-x"><summary class="chap chap-sum">' + head + '</summary><div class="chap-detail">' + subtopics + '</div></details>';
  };

  var style = document.createElement("style");
  style.id = "calvin-subtopics-style";
  style.textContent =
    '.subtopics-block{margin-top:16px;border-top:1px solid var(--line);padding-top:16px}' +
    '.subtopics-block>h5{margin:0 0 8px;font-family:var(--font-display);font-size:1.02rem}' +
    '.subtopics-intro{color:var(--muted);margin:0 0 14px}' +
    '.subtopic-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}' +
    '.subtopic-card{border:1px solid var(--line);border-radius:12px;background:var(--surface);padding:14px}' +
    '.subtopic-head{display:flex;gap:8px;align-items:center;margin-bottom:8px}' +
    '.subtopic-label{font-family:var(--font-mono);font-size:.68rem;letter-spacing:.08em;color:var(--muted);border:1px solid var(--line);border-radius:999px;padding:3px 7px}' +
    '.subtopic-card h5{margin:0;font-family:var(--font-display);font-size:1rem}' +
    '.subtopic-card p{margin:8px 0;color:var(--muted);font-size:.92rem;line-height:1.65}' +
    '.subtopic-summary{color:var(--ink)!important}' +
    '.subtopic-tags{display:flex;gap:6px;flex-wrap:wrap;margin:10px 0}' +
    '.quote-targets{margin:6px 0 0;padding-left:18px;color:var(--muted);font-size:.9rem}' +
    '.subtopic-caution{border-top:1px dashed var(--line);padding-top:8px}' +
    '@media(max-width:860px){.subtopic-grid{grid-template-columns:1fr}}';
  document.head.appendChild(style);

  if (typeof render === "function") render();
})();
