/* Passage detail route.
   Renders #passage=<passage-id> as a real detail page after the core app render cycle. */
(function () {
  function loadJson(path, fallback) {
    try {
      var xhr = new XMLHttpRequest();
      xhr.open("GET", path, false);
      xhr.send(null);
      if (xhr.status >= 200 && xhr.status < 300) return JSON.parse(xhr.responseText);
    } catch (error) {
      console.warn(path + " was not loaded for passage detail route.", error);
    }
    return fallback;
  }

  var books = loadJson("./data/books.json", []);
  var topics = loadJson("./data/topics.json", []);
  var passages = loadJson("./data/passages.json", []);
  var passageLinks = loadJson("./data/passage-theology-links.json", []);
  var historyItems = [].concat(
    loadJson("./data/tradition-history.json", []),
    loadJson("./data/neo-orthodoxy-history.json", []),
    loadJson("./data/neo-orthodoxy-doctrine-history.json", [])
  ).filter(function (item) { return item && item.id; });

  var bookMap = {};
  var topicMap = {};
  var historyMap = {};
  var passageMap = {};
  var passageLinkMap = {};

  books.forEach(function (book) { if (book && book.id) bookMap[book.id] = book; });
  topics.forEach(function (topic) { if (topic && topic.id) topicMap[topic.id] = topic; });
  historyItems.forEach(function (item) { if (item && item.id) historyMap[item.id] = item; });
  passages.forEach(function (passage) { if (passage && passage.id) passageMap[passage.id] = passage; });
  passageLinks.forEach(function (entry) { if (entry && entry.passageId) passageLinkMap[entry.passageId] = entry; });

  function routeId() {
    var raw = decodeURIComponent((location.hash || "").replace(/^#/, ""));
    if (raw.indexOf("passage=") !== 0) return null;
    return raw.split("=")[1] || null;
  }

  function esc(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function tags(items) {
    if (!items || !items.length) return "";
    return '<div class="topic-meta-tags">' + items.map(function (item) {
      return '<span class="tag">' + esc(item) + '</span>';
    }).join("") + '</div>';
  }

  function list(title, items) {
    if (!items || !items.length) return "";
    return '<section class="passage-detail-section"><h4>' + esc(title) + '</h4><ul class="topic-list">' +
      items.map(function (item) { return '<li>' + esc(item) + '</li>'; }).join("") +
      '</ul></section>';
  }

  function miniButton(kind, id, label, sub) {
    return '<button type="button" class="passage-detail-link ' + kind + '" data-' + kind + '-jump="' + esc(id) + '"><span>' + esc(sub || kind) + '</span><b>' + esc(label) + '</b></button>';
  }

  function relatedSection(title, html) {
    if (!html) return "";
    return '<section class="passage-detail-section"><h4>' + esc(title) + '</h4><div class="passage-detail-grid">' + html + '</div></section>';
  }

  function render(id) {
    var passage = passageMap[id];
    var view = document.querySelector("#view");
    if (!passage || !view) return;

    document.querySelectorAll(".tab").forEach(function (tab) {
      tab.classList.toggle("is-active", tab.dataset.view === "passages");
    });

    var search = document.querySelector("#q");
    if (search) search.value = "";
    var notice = document.querySelector(".filter-notice");
    if (notice) notice.remove();
    var clear = document.querySelector(".search-clear");
    if (clear) clear.classList.remove("is-visible");

    var linkEntry = passageLinkMap[id] || {};
    var topicIds = linkEntry.topicIds || [];
    var historyIds = linkEntry.historyIds || [];

    var topicButtons = topicIds.map(function (topicId) {
      var topic = topicMap[topicId];
      if (!topic) return "";
      return miniButton("topic", topic.id, topic.name || topic.id, "주제");
    }).join("");

    var historyButtons = historyIds.map(function (historyId) {
      var item = historyMap[historyId];
      if (!item) return "";
      return miniButton("history", item.id, item.title || item.id, item.category || "역사");
    }).join("");

    var bookButtons = (passage.relatedBooks || []).map(function (bookId) {
      var book = bookMap[bookId];
      if (!book) return "";
      return miniButton("book", book.id, book.title || book.id, book.category || "책");
    }).join("");

    view.innerHTML = '<article class="detail-page passage-detail-page">' +
      '<header class="detail-hero passage-hero">' +
        '<button type="button" class="back-btn" data-back-passages>← 본문 목록</button>' +
        '<span class="loci-label" style="display:block;margin-top:14px">SCRIPTURE · 본문 상세</span>' +
        '<h2>' + esc(passage.reference) + '</h2>' +
        '<p class="by">' + esc(passage.testament || "") + ' · ' + esc(passage.book || "") + '</p>' +
        (passage.summary ? '<p class="sum">' + esc(passage.summary) + '</p>' : '') +
        tags(passage.topics || []) +
      '</header>' +
      '<div class="passage-detail-body">' +
        (linkEntry.note ? '<section class="passage-detail-section is-note"><h4>신학 연결 메모</h4><p class="muted">' + esc(linkEntry.note) + '</p></section>' : '') +
        relatedSection('관련 주제', topicButtons) +
        relatedSection('관련 역사', historyButtons) +
        relatedSection('관련 책', bookButtons) +
        list('핵심 질문', passage.keyQuestions) +
        list('전통별 활용', passage.traditionUses) +
        list('설교 활용', passage.sermonUses) +
        list('연구 활용', passage.researchUses) +
      '</div>' +
    '</article>';

    view.querySelectorAll('[data-topic-jump]').forEach(function (button) {
      button.onclick = function () { location.hash = 'topic=' + encodeURIComponent(button.getAttribute('data-topic-jump')); };
    });
    view.querySelectorAll('[data-history-jump]').forEach(function (button) {
      button.onclick = function () { location.hash = 'history=' + encodeURIComponent(button.getAttribute('data-history-jump')); };
    });
    view.querySelectorAll('[data-book-jump]').forEach(function (button) {
      button.onclick = function () { location.hash = 'book=' + encodeURIComponent(button.getAttribute('data-book-jump')); };
    });
    var back = view.querySelector('[data-back-passages]');
    if (back) {
      back.onclick = function () {
        history.pushState('', document.title, location.pathname + location.search);
        var tab = document.querySelector('.tab[data-view="passages"]');
        if (tab) tab.click();
      };
    }
  }

  function ensureStyles() {
    if (document.querySelector("#passage-detail-route-styles")) return;
    var style = document.createElement("style");
    style.id = "passage-detail-route-styles";
    style.textContent = "\
      .passage-hero{background:linear-gradient(90deg,var(--scripture-soft,#EEEBD8),transparent 58%,var(--surface))!important;}\
      .passage-detail-body{padding:22px 28px 30px;}\
      .passage-detail-section{margin-top:18px;border:1px solid var(--line);border-radius:14px;background:var(--surface-2);padding:18px;}\
      .passage-detail-section:first-child{margin-top:0;}\
      .passage-detail-section h4{margin:0 0 12px;font-family:var(--font-display);font-size:1.04rem;}\
      .passage-detail-section .muted{color:var(--muted);margin:0;}\
      .passage-detail-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;}\
      .passage-detail-link{border:1px solid var(--line);background:var(--surface);border-radius:12px;padding:11px 12px;text-align:left;cursor:pointer;color:var(--ink);} \
      .passage-detail-link span{display:block;font-family:var(--font-mono);font-size:.65rem;letter-spacing:.08em;color:var(--muted);text-transform:uppercase;margin-bottom:3px;}\
      .passage-detail-link b{font-size:.88rem;}\
      .passage-detail-link:hover{border-color:var(--ink);background:var(--surface-2);}\
      @media(max-width:900px){.passage-detail-grid{grid-template-columns:1fr;}.passage-detail-body{padding:18px;}}\
    ";
    document.head.appendChild(style);
  }

  function scheduleRender() {
    var id = routeId();
    if (!id) return;
    ensureStyles();
    [0, 80, 180, 360].forEach(function (delay) {
      setTimeout(function () {
        if (routeId() === id) render(id);
      }, delay);
    });
  }

  window.addEventListener("hashchange", scheduleRender);
  document.addEventListener("DOMContentLoaded", scheduleRender);
  setTimeout(scheduleRender, 0);
})();
