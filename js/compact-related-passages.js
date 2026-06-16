/* Compact related Bible passage cards on list views.
   Keeps full related-passage lists on detail pages, but prevents book cards from becoming too tall.
   CSS rules live in css/style.css. */
(function () {
  var CARD_PASSAGE_LIMIT = 3;
  var passages = [];
  var books = [];
  var passagesByBook = {};
  var bookIdByTitle = {};
  var ready = false;

  function esc(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function loadJson(path) {
    return fetch(path, { cache: "no-cache" })
      .then(function (response) {
        if (!response.ok) throw new Error(path + " (" + response.status + ")");
        return response.json();
      })
      .catch(function (error) {
        console.warn(path + " was not loaded for compact related passage cards.", error);
        return [];
      });
  }

  function go(type, id) {
    if (id) location.hash = type + "=" + encodeURIComponent(id);
  }

  function relationButton(kind, id, label, className) {
    return '<button type="button" class="' + esc(className || "compact-relation-btn") + '" data-compact-kind="' + esc(kind) + '" data-compact-id="' + esc(id) + '"><b>' + esc(label) + '</b></button>';
  }

  function wire(scope) {
    (scope || document).querySelectorAll("[data-compact-kind][data-compact-id]").forEach(function (button) {
      button.onclick = function () {
        go(button.getAttribute("data-compact-kind"), button.getAttribute("data-compact-id"));
      };
    });
  }

  function buildIndexes() {
    passagesByBook = {};
    bookIdByTitle = {};

    books.forEach(function (book) {
      if (!book || !book.id) return;
      if (book.title) bookIdByTitle[book.title.trim()] = book.id;
    });

    passages.forEach(function (passage) {
      if (!passage || !passage.id) return;
      (passage.relatedBooks || []).forEach(function (bookId) {
        if (!passagesByBook[bookId]) passagesByBook[bookId] = [];
        passagesByBook[bookId].push(passage);
      });
    });
  }

  function compactBookPassageSection(section, bookId) {
    var items = passagesByBook[bookId] || [];
    if (!items.length) return;

    var shown = items.slice(0, CARD_PASSAGE_LIMIT);
    var hiddenCount = Math.max(0, items.length - shown.length);
    var buttons = shown.map(function (passage) {
      return relationButton("passage", passage.id, passage.reference || passage.id, "compact-passage-chip");
    }).join("");

    var more = hiddenCount > 0
      ? '<button type="button" class="compact-more-link" data-compact-kind="book" data-compact-id="' + esc(bookId) + '">전체 ' + items.length + '개 본문은 상세 페이지에서 보기 →</button>'
      : '<button type="button" class="compact-more-link" data-compact-kind="book" data-compact-id="' + esc(bookId) + '">본문 상세 연결 보기 →</button>';

    section.dataset.compacted = "true";
    section.innerHTML = '<h4>대표 성경 본문</h4><div class="compact-passage-row">' + buttons + '</div>' + more;
    wire(section);
  }

  function compactBookCards() {
    if (!ready) return;
    var activeBooksTab = document.querySelector('.tab.is-active[data-view="books"]');
    if (!activeBooksTab) return;

    document.querySelectorAll("#view .card .book-passage-section.is-compact").forEach(function (section) {
      if (section.dataset.compacted === "true") return;
      var card = section.closest(".card");
      var title = card && card.querySelector("h3");
      if (!title) return;
      var bookId = bookIdByTitle[title.textContent.trim()];
      if (!bookId) return;
      compactBookPassageSection(section, bookId);
    });
  }

  function ensureStyles() {
    // Styles for this layer are maintained in css/style.css.
  }

  function init() {
    ensureStyles();
    Promise.all([
      loadJson("./data/books.json"),
      loadJson("./data/passages.json")
    ]).then(function (results) {
      books = Array.isArray(results[0]) ? results[0] : [];
      passages = Array.isArray(results[1]) ? results[1] : [];
      buildIndexes();
      ready = true;
      compactBookCards();
    });
  }

  var view = document.querySelector("#view");
  if (view) {
    var observer = new MutationObserver(function () {
      setTimeout(compactBookCards, 0);
    });
    observer.observe(view, { childList: true, subtree: true });
  }

  window.addEventListener("hashchange", function () { setTimeout(compactBookCards, 0); });
  document.addEventListener("DOMContentLoaded", init);
  setTimeout(init, 0);
})();
