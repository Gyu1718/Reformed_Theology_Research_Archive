(function () {
  function loadJson(path, fallback) {
    try {
      var xhr = new XMLHttpRequest();
      xhr.open("GET", path, false);
      xhr.send(null);
      if (xhr.status >= 200 && xhr.status < 300) return JSON.parse(xhr.responseText);
    } catch (error) {
      console.warn(path + " was not loaded for relation linking.", error);
    }
    return fallback;
  }

  function esc(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  var authors = loadJson("./data/authors.json", []);
  var topics = loadJson("./data/topics.json", []);
  var topicHistoryLinks = loadJson("./data/topic-history-links.json", []);
  var authorHistoryLinks = loadJson("./data/author-history-links.json", []);
  var historyItems = [].concat(
    loadJson("./data/tradition-history.json", []),
    loadJson("./data/neo-orthodoxy-history.json", []),
    loadJson("./data/neo-orthodoxy-doctrine-history.json", [])
  ).filter(function (item) { return item && item.id; });

  var authorIdByLabel = {};
  var topicIdByLabel = {};
  var historyMap = {};
  var topicHistoryMap = {};
  var authorHistoryMap = {};

  authors.forEach(function (author) {
    if (!author || !author.id) return;
    if (author.koreanName) authorIdByLabel[author.koreanName.trim()] = author.id;
    if (author.name) authorIdByLabel[author.name.trim()] = author.id;
  });

  topics.forEach(function (topic) {
    if (!topic || !topic.id) return;
    if (topic.name) topicIdByLabel[topic.name.trim()] = topic.id;
    if (topic.latin) topicIdByLabel[topic.latin.trim()] = topic.id;
  });

  historyItems.forEach(function (item) {
    if (item && item.id) historyMap[item.id] = item;
  });

  topicHistoryLinks.forEach(function (entry) {
    if (entry && entry.topicId) topicHistoryMap[entry.topicId] = entry;
  });
  authorHistoryLinks.forEach(function (entry) {
    if (entry && entry.authorId) authorHistoryMap[entry.authorId] = entry;
  });

  function rawHash() {
    return decodeURIComponent((location.hash || "").replace(/^#/, ""));
  }

  function route(type) {
    var raw = rawHash();
    if (raw.indexOf(type + "=") !== 0) return null;
    return raw.split("=")[1] || null;
  }

  function go(type, id) {
    if (id) location.hash = type + "=" + encodeURIComponent(id);
  }

  function relationButton(kind, id, label, sub, className) {
    return '<button type="button" class="' + esc(className || "relation-btn") + '" data-relation-kind="' + esc(kind) + '" data-relation-id="' + esc(id) + '"><span>' + esc(sub || kind) + '</span><b>' + esc(label) + '</b></button>';
  }

  function historyButton(historyId, className) {
    var item = historyMap[historyId];
    if (!item) return "";
    return relationButton("history", item.id, item.title || item.id, item.category || "역사", className || "history-link-btn");
  }

  function historyCard(historyId) {
    var item = historyMap[historyId];
    if (!item) return "";
    return '<article class="history-relation-card">' +
      '<span class="history-relation-meta">' + esc(item.period || item.category || "역사 항목") + '</span>' +
      '<h5>' + esc(item.title || item.id) + '</h5>' +
      (item.summary || item.definition ? '<p>' + esc(item.summary || item.definition) + '</p>' : '') +
      '<button type="button" data-relation-kind="history" data-relation-id="' + esc(item.id) + '">역사 항목 열기 →</button>' +
    '</article>';
  }

  function wire(scope) {
    (scope || document).querySelectorAll("[data-relation-kind][data-relation-id]").forEach(function (button) {
      button.onclick = function () {
        go(button.getAttribute("data-relation-kind"), button.getAttribute("data-relation-id"));
      };
    });
  }

  function historySection(entry, sectionClass, title, mode) {
    if (!entry || !entry.historyIds || !entry.historyIds.length) return "";
    var isCard = mode === "card";
    var body = entry.historyIds.map(function (id) {
      return isCard ? historyCard(id) : historyButton(id, "history-link-btn");
    }).filter(Boolean).join("");
    if (!body) return "";
    return '<section class="' + esc(sectionClass || "history-relation-section") + '"><h4>' + esc(title || "관련 역사 항목") + '</h4>' +
      (entry.note ? '<p class="relation-note">' + esc(entry.note) + '</p>' : '') +
      '<div class="' + (isCard ? 'history-relation-card-grid' : 'relation-grid') + '">' + body + '</div></section>';
  }

  function ensureRelationStyles() {
    if (document.querySelector("#relation-card-styles")) return;
    var style = document.createElement("style");
    style.id = "relation-card-styles";
    style.textContent = "\
      .topic-history-section{margin-top:18px;}\
      .relation-note{color:var(--muted);line-height:1.7;margin:0 0 12px;}\
      .history-relation-card-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;}\
      .history-relation-card{border:1px solid var(--line);background:var(--surface);border-radius:13px;padding:14px;}\
      .history-relation-card .history-relation-meta{display:block;font-family:var(--font-mono);font-size:.7rem;color:var(--muted);letter-spacing:.08em;margin-bottom:6px;}\
      .history-relation-card h5{font-family:var(--font-display);font-size:1rem;margin:0 0 8px;}\
      .history-relation-card p{color:var(--muted);font-size:.9rem;line-height:1.65;margin:0 0 12px;}\
      .history-relation-card button{border:1px solid var(--line-strong);background:var(--surface-2);border-radius:999px;padding:8px 11px;cursor:pointer;color:var(--ink);font-size:.84rem;}\
      .history-relation-card button:hover{border-color:var(--ink);background:var(--surface);}\
      .relation-grid{display:flex;gap:8px;flex-wrap:wrap;}\
      .relation-grid .history-link-btn{border:1px solid var(--line);background:var(--surface);border-radius:999px;padding:8px 12px;cursor:pointer;color:var(--ink);}\
      .relation-grid .history-link-btn span{font-family:var(--font-mono);font-size:.68rem;color:var(--muted);margin-right:6px;}\
      @media(max-width:820px){.history-relation-card-grid{grid-template-columns:1fr;}}\
    ";
    document.head.appendChild(style);
  }

  function installTopicHistory() {
    var topicId = route("topic");
    if (topicId) {
      var detailBody = document.querySelector("#view .topic-detail-body");
      if (detailBody && !detailBody.querySelector(".topic-history-section")) {
        var html = historySection(topicHistoryMap[topicId], "topic-section topic-history-section", "관련 역사 항목", "card");
        if (html) {
          var refs = detailBody.querySelector(".refs");
          if (refs) refs.insertAdjacentHTML("beforebegin", html);
          else detailBody.insertAdjacentHTML("beforeend", html);
          wire(detailBody);
        }
      }
      return;
    }

    var compareHead = document.querySelector("#view .compare .compare-head");
    if (!compareHead || compareHead.querySelector(".topic-history-section")) return;
    var title = compareHead.querySelector("h3");
    if (!title) return;
    var label = title.childNodes && title.childNodes.length ? title.childNodes[0].textContent.trim() : title.textContent.trim();
    var id = topicIdByLabel[label];
    var html = historySection(topicHistoryMap[id], "topic-history-section", "관련 역사 항목", "button");
    if (html) {
      compareHead.insertAdjacentHTML("beforeend", html);
      wire(compareHead);
    }
  }

  function installAuthorHistory() {
    var activeTab = document.querySelector('.tab.is-active[data-view="authors"]');
    if (!activeTab) return;
    document.querySelectorAll("#view .card").forEach(function (card) {
      if (card.querySelector(".author-history-section")) return;
      var title = card.querySelector("h3");
      if (!title) return;
      var authorId = authorIdByLabel[title.textContent.trim()];
      var html = historySection(authorHistoryMap[authorId], "author-history-section", "관련 역사 항목", "button");
      if (html) {
        card.insertAdjacentHTML("beforeend", html);
        wire(card);
      }
    });
  }

  function installRelations() {
    ensureRelationStyles();
    installTopicHistory();
    installAuthorHistory();
  }

  var view = document.querySelector("#view");
  if (view) {
    var observer = new MutationObserver(function () { installRelations(); });
    observer.observe(view, { childList: true, subtree: true });
  }
  window.addEventListener("hashchange", function () { setTimeout(installRelations, 0); });
  document.addEventListener("DOMContentLoaded", installRelations);
  setTimeout(installRelations, 0);
})();
