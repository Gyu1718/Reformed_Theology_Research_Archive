/* Topic → History linker.
   Adds related history links to topic detail and compare views without rewriting app.js. */
(function () {
  function loadJson(path, fallback) {
    try {
      var xhr = new XMLHttpRequest();
      xhr.open("GET", path, false);
      xhr.send(null);
      if (xhr.status >= 200 && xhr.status < 300) return JSON.parse(xhr.responseText);
    } catch (error) {
      console.warn(path + " was not loaded for topic history linking.", error);
    }
    return fallback;
  }

  var links = loadJson("./data/topic-history-links.json", []);
  var historyItems = [].concat(
    loadJson("./data/tradition-history.json", []),
    loadJson("./data/neo-orthodoxy-history.json", []),
    loadJson("./data/neo-orthodoxy-doctrine-history.json", [])
  ).filter(function (item) { return item && item.id; });

  var linkMap = {};
  var historyMap = {};
  links.forEach(function (entry) {
    if (entry && entry.topicId) linkMap[entry.topicId] = entry;
  });
  historyItems.forEach(function (entry) {
    historyMap[entry.id] = entry;
  });

  function currentTopicId() {
    var raw = decodeURIComponent((location.hash || "").replace(/^#/, ""));
    var parts = raw.split("=");
    if (parts[0] === "topic") return parts[1];
    var openButton = document.querySelector("[data-topic-open]");
    return openButton ? openButton.getAttribute("data-topic-open") : "";
  }

  function buttonHtml(historyId) {
    var item = historyMap[historyId];
    if (!item) return "";
    return '<button type="button" class="topic-history-btn" data-history-target="' + item.id + '"><span>' + (item.category || "역사") + '</span><b>' + item.title + '</b></button>';
  }

  function sectionHtml(entry, mode) {
    if (!entry || !entry.historyIds || !entry.historyIds.length) return "";
    var buttons = entry.historyIds.map(buttonHtml).filter(Boolean).join("");
    if (!buttons) return "";
    var compact = mode === "compact" ? " topic-history-section-compact" : "";
    return '<section class="topic-history-section' + compact + '"><h4>관련 역사 항목</h4>' +
      (entry.note ? '<p class="topic-history-note">' + entry.note + '</p>' : '') +
      '<div class="topic-history-grid">' + buttons + '</div></section>';
  }

  function wireButtons(scope) {
    (scope || document).querySelectorAll("[data-history-target]").forEach(function (button) {
      button.onclick = function () {
        var target = button.getAttribute("data-history-target");
        if (target) location.hash = "history=" + encodeURIComponent(target);
      };
    });
  }

  function installOnTopicDetail() {
    var topicId = currentTopicId();
    var entry = linkMap[topicId];
    if (!entry) return;
    var body = document.querySelector(".topic-detail-body");
    if (!body || body.querySelector(".topic-history-section")) return;
    body.insertAdjacentHTML("beforeend", sectionHtml(entry, "detail"));
    wireButtons(body);
  }

  function installOnCompareCard() {
    if ((location.hash || "").indexOf("#topic=") === 0) return;
    var topicId = currentTopicId();
    var entry = linkMap[topicId];
    if (!entry) return;
    var head = document.querySelector(".compare-head");
    if (!head || head.querySelector(".topic-history-section")) return;
    var actions = head.querySelector(".card-actions");
    if (actions) actions.insertAdjacentHTML("afterend", sectionHtml(entry, "compact"));
    else head.insertAdjacentHTML("beforeend", sectionHtml(entry, "compact"));
    wireButtons(head);
  }

  function install() {
    installOnTopicDetail();
    installOnCompareCard();
  }

  function ensureStyles() {
    if (document.querySelector("#topic-history-linker-styles")) return;
    var style = document.createElement("style");
    style.id = "topic-history-linker-styles";
    style.textContent = "\
      .topic-history-section{margin-top:18px;border:1px solid var(--line);border-radius:14px;background:var(--surface-2);padding:18px;}\
      .topic-history-section h4{margin:0 0 10px;font-family:var(--font-display);font-size:1.02rem;}\
      .topic-history-note{margin:0 0 12px;color:var(--muted);font-size:.92rem;}\
      .topic-history-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;}\
      .topic-history-btn{border:1px solid var(--line);background:var(--surface);border-radius:12px;padding:12px 13px;text-align:left;cursor:pointer;color:var(--ink);}\
      .topic-history-btn span{display:block;font-family:var(--font-mono);font-size:.68rem;letter-spacing:.08em;color:var(--muted);text-transform:uppercase;margin-bottom:4px;}\
      .topic-history-btn b{font-size:.9rem;}\
      .topic-history-btn:hover{border-color:var(--ink);}\
      .topic-history-section-compact{padding:14px;margin-top:14px;}\
      .topic-history-section-compact .topic-history-grid{grid-template-columns:repeat(3,minmax(0,1fr));}\
      @media(max-width:900px){.topic-history-grid,.topic-history-section-compact .topic-history-grid{grid-template-columns:1fr;}}\
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
