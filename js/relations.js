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

  function wire(scope) {
    (scope || document).querySelectorAll("[data-relation-kind][data-relation-id]").forEach(function (button) {
      button.onclick = function () {
        go(button.getAttribute("data-relation-kind"), button.getAttribute("data-relation-id"));
      };
    });
  }

  function historySection(entry, className, title) {
    if (!entry || !entry.historyIds || !entry.historyIds.length) return "";
    var buttons = entry.historyIds.map(function (id) { return historyButton(id, className || "history-link-btn"); }).filter(Boolean).join("");
    if (!buttons) return "";
    return '<section class="' + esc(className || "history-relation-section") + '"><h4>' + esc(title || "관련 역사 항목") + '</h4>' +
      (entry.note ? '<p class="relation-note">' + esc(entry.note) + '</p>' : '') +
      '<div class="relation-grid">' + buttons + '</div></section>';
  }

  function installTopicHistory() {
    var topicId = route("topic");
    if (topicId) {
      var detailBody = document.querySelector("#view .topic-detail-body");
      if (detailBody && !detailBody.querySelector(".topic-history-section")) {
        var html = historySection(topicHistoryMap[topicId], "topic-history-section", "관련 역사 항목");
        if (html) {
          detailBody.insertAdjacentHTML("beforeend", html);
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
    var html = historySection(topicHistoryMap[id], "topic-history-section", "관련 역사 항목");
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
      var html = historySection(authorHistoryMap[authorId], "author-history-section", "관련 역사 항목");
      if (html) {
        card.insertAdjacentHTML("beforeend", html);
        wire(card);
      }
    });
  }

  function installRelations() {
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