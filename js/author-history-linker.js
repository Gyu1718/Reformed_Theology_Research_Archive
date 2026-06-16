/* Author → History linker.
   Adds related history links to author cards without rewriting app.js. */
(function () {
  function loadJson(path, fallback) {
    try {
      var xhr = new XMLHttpRequest();
      xhr.open("GET", path, false);
      xhr.send(null);
      if (xhr.status >= 200 && xhr.status < 300) return JSON.parse(xhr.responseText);
    } catch (error) {
      console.warn(path + " was not loaded for author history linking.", error);
    }
    return fallback;
  }

  var authors = loadJson("./data/authors.json", []);
  var links = loadJson("./data/author-history-links.json", []);
  var historyItems = [].concat(
    loadJson("./data/tradition-history.json", []),
    loadJson("./data/neo-orthodoxy-history.json", []),
    loadJson("./data/neo-orthodoxy-doctrine-history.json", [])
  ).filter(function (item) { return item && item.id; });

  var authorByLabel = {};
  var linkMap = {};
  var historyMap = {};

  authors.forEach(function (author) {
    if (!author || !author.id) return;
    if (author.koreanName) authorByLabel[author.koreanName.trim()] = author.id;
    if (author.name) authorByLabel[author.name.trim()] = author.id;
  });
  links.forEach(function (entry) {
    if (entry && entry.authorId) linkMap[entry.authorId] = entry;
  });
  historyItems.forEach(function (entry) {
    historyMap[entry.id] = entry;
  });

  function buttonHtml(historyId) {
    var item = historyMap[historyId];
    if (!item) return "";
    return '<button type="button" class="author-history-btn" data-history-target="' + item.id + '"><span>' + (item.category || "역사") + '</span><b>' + item.title + '</b></button>';
  }

  function sectionHtml(entry) {
    if (!entry || !entry.historyIds || !entry.historyIds.length) return "";
    var buttons = entry.historyIds.map(buttonHtml).filter(Boolean).join("");
    if (!buttons) return "";
    return '<section class="author-history-section"><h4>관련 역사 항목</h4>' +
      (entry.note ? '<p class="author-history-note">' + entry.note + '</p>' : '') +
      '<div class="author-history-grid">' + buttons + '</div></section>';
  }

  function wireButtons(scope) {
    (scope || document).querySelectorAll("[data-history-target]").forEach(function (button) {
      button.onclick = function () {
        var target = button.getAttribute("data-history-target");
        if (target) location.hash = "history=" + encodeURIComponent(target);
      };
    });
  }

  function install() {
    var activeTab = document.querySelector('.tab.is-active[data-view="authors"]');
    if (!activeTab) return;

    document.querySelectorAll("#view .card").forEach(function (card) {
      if (card.querySelector(".author-history-section")) return;
      var title = card.querySelector("h3");
      if (!title) return;
      var label = title.textContent.trim();
      var authorId = authorByLabel[label];
      if (!authorId || !linkMap[authorId]) return;
      card.insertAdjacentHTML("beforeend", sectionHtml(linkMap[authorId]));
      wireButtons(card);
    });
  }

  function ensureStyles() {
    if (document.querySelector("#author-history-linker-styles")) return;
    var style = document.createElement("style");
    style.id = "author-history-linker-styles";
    style.textContent = "\
      .author-history-section{margin-top:14px;border-top:1px solid var(--line);padding-top:13px;}\
      .author-history-section h4{margin:0 0 8px;font-family:var(--font-display);font-size:.95rem;}\
      .author-history-note{margin:0 0 10px;color:var(--muted);font-size:.86rem;}\
      .author-history-grid{display:grid;grid-template-columns:1fr;gap:8px;}\
      .author-history-btn{border:1px solid var(--line);background:var(--surface);border-radius:11px;padding:10px 11px;text-align:left;cursor:pointer;color:var(--ink);}\
      .author-history-btn span{display:block;font-family:var(--font-mono);font-size:.65rem;letter-spacing:.08em;color:var(--muted);text-transform:uppercase;margin-bottom:3px;}\
      .author-history-btn b{font-size:.86rem;}\
      .author-history-btn:hover{border-color:var(--ink);}\
    ";
    document.head.appendChild(style);
  }

  ensureStyles();
  var view = document.querySelector("#view");
  if (view) {
    var observer = new MutationObserver(function () { install(); });
    observer.observe(view, { childList: true, subtree: true });
  }
  window.addEventListener("hashchange", function () { setTimeout(install, 0); });
  document.addEventListener("DOMContentLoaded", install);
  setTimeout(install, 0);
})();
