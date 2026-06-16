/* Passage → Topic/History linker.
   Adds related topic and history links to passage cards without rewriting app.js. */
(function () {
  function loadJson(path, fallback) {
    try {
      var xhr = new XMLHttpRequest();
      xhr.open("GET", path, false);
      xhr.send(null);
      if (xhr.status >= 200 && xhr.status < 300) return JSON.parse(xhr.responseText);
    } catch (error) {
      console.warn(path + " was not loaded for passage theology linking.", error);
    }
    return fallback;
  }

  var links = loadJson("./data/passage-theology-links.json", []);
  var topics = loadJson("./data/topics.json", []);
  var historyItems = [].concat(
    loadJson("./data/tradition-history.json", []),
    loadJson("./data/neo-orthodoxy-history.json", []),
    loadJson("./data/neo-orthodoxy-doctrine-history.json", [])
  ).filter(function (item) { return item && item.id; });

  var linkByReference = {};
  var topicMap = {};
  var historyMap = {};

  links.forEach(function (entry) {
    if (entry && entry.reference) linkByReference[entry.reference.trim()] = entry;
  });
  topics.forEach(function (topic) {
    if (topic && topic.id) topicMap[topic.id] = topic;
  });
  historyItems.forEach(function (entry) {
    historyMap[entry.id] = entry;
  });

  function topicButtonHtml(topicId) {
    var item = topicMap[topicId];
    if (!item) return "";
    return '<button type="button" class="passage-link-btn topic-link" data-topic-target="' + item.id + '"><span>주제</span><b>' + item.name + '</b></button>';
  }

  function historyButtonHtml(historyId) {
    var item = historyMap[historyId];
    if (!item) return "";
    return '<button type="button" class="passage-link-btn history-link" data-history-target="' + item.id + '"><span>' + (item.category || "역사") + '</span><b>' + item.title + '</b></button>';
  }

  function sectionHtml(entry) {
    if (!entry) return "";
    var topicButtons = (entry.topicIds || []).map(topicButtonHtml).filter(Boolean).join("");
    var historyButtons = (entry.historyIds || []).map(historyButtonHtml).filter(Boolean).join("");
    if (!topicButtons && !historyButtons) return "";
    return '<section class="passage-theology-section"><h4>신학 연결</h4>' +
      (entry.note ? '<p class="passage-theology-note">' + entry.note + '</p>' : '') +
      (topicButtons ? '<div class="passage-link-group"><b>관련 주제</b><div class="passage-link-grid">' + topicButtons + '</div></div>' : '') +
      (historyButtons ? '<div class="passage-link-group"><b>관련 역사</b><div class="passage-link-grid">' + historyButtons + '</div></div>' : '') +
      '</section>';
  }

  function wireButtons(scope) {
    (scope || document).querySelectorAll("[data-topic-target]").forEach(function (button) {
      button.onclick = function () {
        var target = button.getAttribute("data-topic-target");
        if (target) location.hash = "topic=" + encodeURIComponent(target);
      };
    });
    (scope || document).querySelectorAll("[data-history-target]").forEach(function (button) {
      button.onclick = function () {
        var target = button.getAttribute("data-history-target");
        if (target) location.hash = "history=" + encodeURIComponent(target);
      };
    });
  }

  function install() {
    var activeTab = document.querySelector('.tab.is-active[data-view="passages"]');
    if (!activeTab) return;
    document.querySelectorAll("#view .card.passage").forEach(function (card) {
      if (card.querySelector(".passage-theology-section")) return;
      var title = card.querySelector("h3");
      if (!title) return;
      var reference = title.textContent.trim();
      var entry = linkByReference[reference];
      if (!entry) return;
      card.insertAdjacentHTML("beforeend", sectionHtml(entry));
      wireButtons(card);
    });
  }

  function ensureStyles() {
    if (document.querySelector("#passage-theology-linker-styles")) return;
    var style = document.createElement("style");
    style.id = "passage-theology-linker-styles";
    style.textContent = "\
      .passage-theology-section{margin-top:14px;border-top:1px solid var(--line);padding-top:13px;}\
      .passage-theology-section h4{margin:0 0 8px;font-family:var(--font-display);font-size:.95rem;}\
      .passage-theology-note{margin:0 0 10px;color:var(--muted);font-size:.86rem;}\
      .passage-link-group{margin-top:10px;}\
      .passage-link-group>b{display:block;margin-bottom:7px;font-size:.82rem;color:var(--muted);}\
      .passage-link-grid{display:grid;grid-template-columns:1fr;gap:8px;}\
      .passage-link-btn{border:1px solid var(--line);background:var(--surface);border-radius:11px;padding:10px 11px;text-align:left;cursor:pointer;color:var(--ink);}\
      .passage-link-btn span{display:block;font-family:var(--font-mono);font-size:.65rem;letter-spacing:.08em;color:var(--muted);text-transform:uppercase;margin-bottom:3px;}\
      .passage-link-btn b{font-size:.86rem;}\
      .passage-link-btn:hover{border-color:var(--ink);}\
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
