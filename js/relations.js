/* Relations layer.
   Consolidates topic-history, author-history, passage-theology, book-passage,
   and passage detail routing into one enhancement script.
   CSS rules live in css/style.css. */
(function () {
  window.__RELATIONS_HANDLES_PASSAGE_ROUTE__ = true;

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

  var books = loadJson("./data/books.json", []);
  var authors = loadJson("./data/authors.json", []);
  var topics = loadJson("./data/topics.json", []);
  var passages = loadJson("./data/passages.json", []);
  var topicHistoryLinks = loadJson("./data/topic-history-links.json", []);
  var authorHistoryLinks = loadJson("./data/author-history-links.json", []);
  var passageTheologyLinks = loadJson("./data/passage-theology-links.json", []);
  var historyItems = [].concat(
    loadJson("./data/tradition-history.json", []),
    loadJson("./data/neo-orthodoxy-history.json", []),
    loadJson("./data/neo-orthodoxy-doctrine-history.json", [])
  ).filter(function (item) { return item && item.id; });

  var bookMap = {};
  var bookIdByTitle = {};
  var authorIdByLabel = {};
  var topicMap = {};
  var topicIdByLabel = {};
  var passageMap = {};
  var passageByReference = {};
  var passagesByBook = {};
  var historyMap = {};
  var topicHistoryMap = {};
  var authorHistoryMap = {};
  var passageTheologyMap = {};

  books.forEach(function (book) {
    if (!book || !book.id) return;
    bookMap[book.id] = book;
    if (book.title) bookIdByTitle[book.title.trim()] = book.id;
  });

  authors.forEach(function (author) {
    if (!author || !author.id) return;
    if (author.koreanName) authorIdByLabel[author.koreanName.trim()] = author.id;
    if (author.name) authorIdByLabel[author.name.trim()] = author.id;
  });

  topics.forEach(function (topic) {
    if (!topic || !topic.id) return;
    topicMap[topic.id] = topic;
    if (topic.name) topicIdByLabel[topic.name.trim()] = topic.id;
    if (topic.latin) topicIdByLabel[topic.latin.trim()] = topic.id;
  });

  passages.forEach(function (passage) {
    if (!passage || !passage.id) return;
    passageMap[passage.id] = passage;
    if (passage.reference) passageByReference[passage.reference.trim()] = passage;
    (passage.relatedBooks || []).forEach(function (bookId) {
      if (!passagesByBook[bookId]) passagesByBook[bookId] = [];
      passagesByBook[bookId].push(passage);
    });
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
  passageTheologyLinks.forEach(function (entry) {
    if (entry && entry.passageId) passageTheologyMap[entry.passageId] = entry;
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

  function topicButton(topicId, className) {
    var item = topicMap[topicId];
    if (!item) return "";
    return relationButton("topic", item.id, item.name || item.id, "주제", className || "topic-link-btn");
  }

  function bookButton(bookId, className) {
    var item = bookMap[bookId];
    if (!item) return "";
    return relationButton("book", item.id, item.title || item.id, item.category || "책", className || "book-link-btn");
  }

  function passageButton(passage, className) {
    if (!passage || !passage.id) return "";
    return relationButton("passage", passage.id, passage.reference || passage.id, passage.book || "본문", className || "passage-link-btn");
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

  function passageTheologySection(entry) {
    if (!entry) return "";
    var topicButtons = (entry.topicIds || []).map(function (id) { return topicButton(id, "passage-link-btn topic-link"); }).filter(Boolean).join("");
    var historyButtons = (entry.historyIds || []).map(function (id) { return historyButton(id, "passage-link-btn history-link"); }).filter(Boolean).join("");
    if (!topicButtons && !historyButtons) return "";
    return '<section class="passage-theology-section"><h4>신학 연결</h4>' +
      (entry.note ? '<p class="relation-note passage-theology-note">' + esc(entry.note) + '</p>' : '') +
      (topicButtons ? '<div class="relation-group"><b>관련 주제</b><div class="relation-grid passage-link-grid">' + topicButtons + '</div></div>' : '') +
      (historyButtons ? '<div class="relation-group"><b>관련 역사</b><div class="relation-grid passage-link-grid">' + historyButtons + '</div></div>' : '') +
      '</section>';
  }

  function passageBookSection(passage) {
    var buttons = (passage.relatedBooks || []).map(function (id) { return bookButton(id, "passage-book-btn"); }).filter(Boolean).join("");
    if (!buttons) return "";
    return '<section class="passage-book-section"><h4>관련 책</h4><div class="relation-grid passage-book-grid">' + buttons + '</div></section>';
  }

  function installPassageCardRelations() {
    var activeTab = document.querySelector('.tab.is-active[data-view="passages"]');
    if (!activeTab) return;
    document.querySelectorAll("#view .card.passage").forEach(function (card) {
      var title = card.querySelector("h3");
      if (!title) return;
      var passage = passageByReference[title.textContent.trim()];
      if (!passage) return;
      if (!card.querySelector(".passage-theology-section")) {
        var theology = passageTheologySection(passageTheologyMap[passage.id]);
        if (theology) card.insertAdjacentHTML("beforeend", theology);
      }
      if (!card.querySelector(".passage-book-section")) {
        var booksHtml = passageBookSection(passage);
        if (booksHtml) card.insertAdjacentHTML("beforeend", booksHtml);
      }
      wire(card);
    });
  }

  function bookPassageSection(bookId, compact) {
    var items = passagesByBook[bookId] || [];
    if (!items.length) return "";
    var limit = compact ? 6 : 20;
    var buttons = items.slice(0, limit).map(function (passage) { return passageButton(passage, "book-passage-btn"); }).join("");
    var more = items.length > limit ? '<p class="book-passage-more">외 ' + (items.length - limit) + '개 본문은 본문 상세 링크에서 확인할 수 있습니다.</p>' : "";
    return '<section class="book-passage-section' + (compact ? ' is-compact' : '') + '"><h4>관련 성경 본문</h4><div class="relation-grid book-passage-grid">' + buttons + '</div>' + more + '</section>';
  }

  function installBookPassages() {
    var bookRoute = route("book");
    if (bookRoute) {
      var page = document.querySelector("#view .detail-page");
      if (!page || page.querySelector(".book-passage-section")) return;
      var detailHtml = bookPassageSection(bookRoute, false);
      if (!detailHtml) return;
      var hero = page.querySelector(".detail-hero");
      if (hero) hero.insertAdjacentHTML("beforeend", detailHtml);
      else page.insertAdjacentHTML("afterbegin", detailHtml);
      wire(page);
      return;
    }

    var activeTab = document.querySelector('.tab.is-active[data-view="books"]');
    if (!activeTab) return;
    document.querySelectorAll("#view .card").forEach(function (card) {
      if (card.querySelector(".book-passage-section")) return;
      var title = card.querySelector("h3");
      if (!title) return;
      var bookId = bookIdByTitle[title.textContent.trim()];
      var html = bookPassageSection(bookId, true);
      if (html) {
        card.insertAdjacentHTML("beforeend", html);
        wire(card);
      }
    });
  }

  function tags(items) {
    if (!items || !items.length) return "";
    return '<div class="topic-meta-tags">' + items.map(function (item) { return '<span class="tag">' + esc(item) + '</span>'; }).join("") + '</div>';
  }

  function list(title, items) {
    if (!items || !items.length) return "";
    return '<section class="passage-detail-section"><h4>' + esc(title) + '</h4><ul class="topic-list">' +
      items.map(function (item) { return '<li>' + esc(item) + '</li>'; }).join("") +
      '</ul></section>';
  }

  function relatedSection(title, html) {
    if (!html) return "";
    return '<section class="passage-detail-section"><h4>' + esc(title) + '</h4><div class="passage-detail-grid">' + html + '</div></section>';
  }

  function renderPassageDetail(id) {
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

    var linkEntry = passageTheologyMap[id] || {};
    var topicButtons = (linkEntry.topicIds || []).map(function (topicId) { return topicButton(topicId, "passage-detail-link topic"); }).filter(Boolean).join("");
    var historyButtons = (linkEntry.historyIds || []).map(function (historyId) { return historyButton(historyId, "passage-detail-link history"); }).filter(Boolean).join("");
    var bookButtons = (passage.relatedBooks || []).map(function (bookId) { return bookButton(bookId, "passage-detail-link book"); }).filter(Boolean).join("");

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

    wire(view);
    var back = view.querySelector('[data-back-passages]');
    if (back) {
      back.onclick = function () {
        history.pushState('', document.title, location.pathname + location.search);
        var tab = document.querySelector('.tab[data-view="passages"]');
        if (tab) tab.click();
      };
    }
  }

  function installPassageDetailRoute() {
    var id = route("passage");
    if (!id) return;
    [0, 80, 180].forEach(function (delay) {
      setTimeout(function () {
        if (route("passage") === id) renderPassageDetail(id);
      }, delay);
    });
  }

  function ensureStyles() {
    // Styles for this layer are maintained in css/style.css.
  }

  function installRelations() {
    ensureStyles();
    installTopicHistory();
    installAuthorHistory();
    installPassageCardRelations();
    installBookPassages();
    installPassageDetailRoute();
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
