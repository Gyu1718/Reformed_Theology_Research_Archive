/* Calvin Institutes chapter renderer
   Makes Calvin chapter output match the Barth-style study layout used in the archive.
   Requires: js/app.js must run first. */
(function () {
  if (typeof chapterHTML !== "function") return;

  var originalChapterHTML = chapterHTML;

  function valueText(value, fallback) {
    if (value == null) return fallback || "";
    if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") return String(value);
    if (Array.isArray(value)) return value.map(function (item) { return valueText(item); }).filter(Boolean).join(" · ");
    if (typeof value === "object") {
      return value.title || value.label || value.name || value.text || value.summary || value.displaySummary || value.explanation || value.note || value.thesis || fallback || "";
    }
    return fallback || "";
  }

  function arr(value) {
    return Array.isArray(value) ? value : [];
  }

  function esc(value) {
    return valueText(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function unique(items) {
    var seen = {};
    return arr(items).map(valueText).filter(function (item) {
      var key = String(item || "").trim();
      if (!key || seen[key]) return false;
      seen[key] = true;
      return true;
    });
  }

  function listHTML(items, className) {
    var rows = unique(items);
    if (!rows.length) return "";
    return '<ul class="' + className + '">' + rows.map(function (item) { return '<li>' + esc(item) + '</li>'; }).join("") + '</ul>';
  }

  function tags(items) {
    var rows = unique(items);
    if (!rows.length) return "";
    return '<div class="tags calvin-study-tags">' + rows.map(function (item) {
      return '<span class="tag">' + esc(item) + '</span>';
    }).join("") + '</div>';
  }

  function quoteTargetsHTML(items) {
    var rows = unique(items);
    if (!rows.length) return "";
    return '<p class="calvin-study-meta"><b>인용 확인 위치</b> ' + rows.map(esc).join(' · ') + '</p>';
  }

  function subtopicTitle(item, index) {
    return valueText(item && item.title) || valueText(item && item.label) || "소주제 " + (index + 1);
  }

  function subtopicSummary(item) {
    return valueText(item && (item.displaySummary || item.summary));
  }

  function subtopicExplanation(item) {
    return valueText(item && (item.explanation || item.note || item.description)) || subtopicSummary(item);
  }

  function subtopicQuestion(item) {
    return valueText(item && (item.keyQuestion || item.question || item.studyPrompt));
  }

  function subtopicRole(item) {
    return valueText(item && (item.doctrinalFunction || item.argumentRole || item.function));
  }

  function subtopicContrast(item) {
    return valueText(item && item.reformedContrast);
  }

  function subtopicsHTML(chapter) {
    var items = arr(chapter.subtopics);
    if (!items.length) return "";
    return '<div class="calvin-study-subtopics">' + items.map(function (item, index) {
      var title = subtopicTitle(item, index);
      var summary = subtopicSummary(item);
      var explanation = subtopicExplanation(item);
      var question = subtopicQuestion(item);
      var role = subtopicRole(item);
      var contrast = subtopicContrast(item);
      return '<article class="calvin-study-subtopic">' +
        '<h6>' + esc(title) + '</h6>' +
        (summary ? '<p><b>요약</b> ' + esc(summary) + '</p>' : '') +
        (explanation ? '<p><b>설명</b> ' + esc(explanation) + '</p>' : '') +
        (question ? '<p><b>핵심 질문</b> ' + esc(question) + '</p>' : '') +
        (role ? '<p><b>교리적 기능</b> ' + esc(role) + '</p>' : '') +
        (contrast ? '<p><b>개혁파 비교</b> ' + esc(contrast) + '</p>' : '') +
        tags(item && item.connections) +
        quoteTargetsHTML(item && item.quoteTargets) +
        (valueText(item && item.caution) ? '<p class="calvin-study-caution"><b>오독 주의</b> ' + esc(item.caution) + '</p>' : '') +
      '</article>';
    }).join("") + '</div>';
  }

  function card(title, html) {
    if (!html) return "";
    return '<section class="calvin-study-card"><h5>' + esc(title) + '</h5>' + html + '</section>';
  }

  function noteOf(chapter) {
    return chapter.studyNote || {};
  }

  function questionOf(chapter) {
    var note = noteOf(chapter);
    return valueText(note.question) || subtopicQuestion(arr(chapter.subtopics)[0]) || "이 장은 『기독교 강요』 전체 논증 안에서 어떤 교리적 기능을 하는가?";
  }

  function thesisOf(chapter) {
    var note = noteOf(chapter);
    return valueText(note.thesis) || valueText(chapter.chapterFunction) || valueText(chapter.detail) || valueText(chapter.summary);
  }

  function argumentFlowOf(chapter) {
    var note = noteOf(chapter);
    var rows = arr(note.argumentFlow).length ? arr(note.argumentFlow) : arr(chapter.keyPoints);
    if (rows.length) return rows;
    return arr(chapter.subtopics).map(function (item) { return subtopicRole(item) || subtopicExplanation(item); }).filter(Boolean);
  }

  function reformedContrastOf(chapter) {
    var note = noteOf(chapter);
    return valueText(note.reformedContrast) || "칼빈은 이 장을 개혁파 정통 교리 체계 안에서 성경의 증언, 경건의 목적, 교회의 가르침이 결합되는 방식으로 배치한다.";
  }

  function studyQuestionsOf(chapter) {
    var note = noteOf(chapter);
    var rows = arr(note.studyQuestions).length ? arr(note.studyQuestions) : arr(chapter.subtopics).map(subtopicQuestion).filter(Boolean);
    return unique(rows).slice(0, 6);
  }

  function hasCalvinStudy(chapter) {
    return chapter && (chapter.studyNote || arr(chapter.subtopics).length || chapter.subtopicSource);
  }

  function renderCalvinStudy(chapter) {
    var blocks = [];
    blocks.push(card("핵심 질문", '<p>' + esc(questionOf(chapter)) + '</p>'));
    blocks.push(card("핵심 주장", '<p>' + esc(thesisOf(chapter)) + '</p>'));
    blocks.push(card("논증 흐름", listHTML(argumentFlowOf(chapter), "calvin-study-list")));
    blocks.push(card("소주제 요약·설명", subtopicsHTML(chapter)));
    blocks.push(card("개혁파 정통과의 비교", '<p>' + esc(reformedContrastOf(chapter)) + '</p>'));
    blocks.push(card("학습 질문", listHTML(studyQuestionsOf(chapter), "calvin-study-list")));
    blocks.push(tags(chapter.concepts));
    return '<div class="calvin-study-blocks">' + blocks.join("") + '</div>';
  }

  chapterHTML = function (chapter) {
    if (!hasCalvinStudy(chapter)) return originalChapterHTML(chapter);

    var ref = '<span class="cref">' + esc(chapter.ref || '·') + '</span>';
    var head = ref + '<div class="chap-head"><b>' + esc(chapter.title || '') + '</b>' + (chapter.summary ? '<p>' + esc(chapter.summary) + '</p>' : '') + '</div>';
    var body = renderCalvinStudy(chapter);
    return '<details class="chap-x calvin-study-chapter"><summary class="chap chap-sum">' + head + '</summary><div class="chap-detail">' + body + '</div></details>';
  };

  var style = document.createElement("style");
  style.id = "calvin-study-main-style";
  style.textContent =
    '.calvin-study-chapter .chap-detail{display:block}' +
    '.calvin-study-blocks{display:grid;gap:12px;margin-top:2px}' +
    '.calvin-study-card{border:1px solid var(--line);border-radius:13px;background:var(--surface);padding:14px 15px}' +
    '.calvin-study-card h5{margin:0 0 8px;font-family:var(--font-mono);font-size:.74rem;letter-spacing:.11em;color:var(--muted);text-transform:uppercase}' +
    '.calvin-study-card p{margin:7px 0;color:var(--muted);line-height:1.7}' +
    '.calvin-study-list{margin:0;padding-left:20px;color:var(--muted)}' +
    '.calvin-study-list li{margin:6px 0;line-height:1.65}' +
    '.calvin-study-subtopics{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}' +
    '.calvin-study-subtopic{border:1px solid var(--line);border-radius:12px;background:var(--surface-2);padding:12px}' +
    '.calvin-study-subtopic h6{margin:0 0 8px;font-family:var(--font-display);font-size:1rem;color:var(--ink)}' +
    '.calvin-study-subtopic p{font-size:.92rem}' +
    '.calvin-study-subtopic b,.calvin-study-meta b{color:var(--ink);font-weight:700}' +
    '.calvin-study-caution{border-top:1px dashed var(--line);padding-top:8px}' +
    '.calvin-study-tags{margin-top:8px}' +
    '@media(max-width:860px){.calvin-study-subtopics{grid-template-columns:1fr}}';
  document.head.appendChild(style);

  if (typeof render === "function") render();
})();
