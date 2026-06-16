/* Book ↔ Passage linker.
   Uses passages[].relatedBooks to attach passage buttons to book cards/detail pages,
   and book buttons to passage cards, without rewriting app.js. */
(function () {
  function loadJson(path, fallback) {
    try {
      var xhr = new XMLHttpRequest();
      xhr.open("GET", path, false);
      xhr.send(null);
      if (xhr.status >= 200 && xhr.status < 300) return JSON.parse(xhr.responseText);
    } catch (error) {
      console.warn(path + " was not loaded for book-passage linking.", error);
    }
    return fallback;
  }

  var books = loadJson("./data/books.json", []);
  var passages = loadJson("./data/passages.json", []);
  var bookById = {};
  var bookIdByTitle = {};
  var passageByReference = {};
  var passagesByBook = {};

  books.forEach(function (book) {
    if (!book || !book.id) return;
    bookById[book.id] = book;
    if (book.title) bookIdByTitle[book.title.trim()] = book.id;
  });

  passages.forEach(function (passage) {
    if (!passage || !passage.reference) return;
    passageByReference[passage.reference.trim()] = passage;
    (passage.relatedBooks || []).forEach(function (bookId) {
      if (!passagesByBook[bookId]) passagesByBook[bookId] = [];
      passagesByBook[bookId].push(passage);
    });
  });

  function goToPassage(reference) {
    var passage = passageByReference[reference];
    if (passage && passage.id) {
      location.hash = "passage=" + encodeURIComponent(passage.id);
      return;
    }
    var search = document.querySelector("#q");
    var tab = document.querySelector('.tab[data-view="passages"]');
    if (search) {
      search.value = reference;
      search.dispatchEvent(new Event("input", { bubbles: true }));
    }
    if (tab) tab.click();
  }

  function goToBook(bookId) {
    if (bookId) location.hash = "book=" + encodeURIComponent(bookId);
  }

  function passageButtonHtml(passage) {
    return '<button type="button" class="book-passage-btn" data-passage-target="' + passage.reference + '"><span>' + (passage.book || "본문") + '</span><b>' + passage.reference + '</b></button>';
  }

  function bookButtonHtml(bookId) {
    var book = bookById[bookId];
    if (!book) return "";
    return '<button type="button" class="passage-book-btn" data-book-target="' + book.id + '"><span>' + (book.category || "책") + '</span><b>' + book.title + '</b></button>';
  }

  function bookPassageSection(bookId, compact) {
    var items = passagesByBook[bookId] || [];
    if (!items.length) return "";
    var limit = compact ? 6 : 20;
    var buttons = items.slice(0, limit).map(passageButtonHtml).join("");
    var more = items.length > limit ? '<p class="book-passage-more">외 ' + (items.length - limit) + '개 본문은 본문 탭 또는 본문 상세 링크에서 확인할 수 있습니다.</p>' : "";
    return '<section class="book-passage-section' + (compact ? ' is-compact' : '') + '"><h4>관련 성경 본문</h4><div class="book-passage-grid">' + buttons + '</div>' + more + '</section>';
  }

  function passageBookSection(passage) {
    var buttons = (passage.relatedBooks || []).map(bookButtonHtml).filter(Boolean).join("");
    if (!buttons) return "";
    return '<section class="passage-book-section"><h4>관련 책</h4><div class="passage-book-grid">' + buttons + '</div></section>';
  }

  function wire(scope) {
    (scope || document).querySelectorAll("[data-passage-target]").forEach(function (button) {
      button.onclick = function () { goToPassage(button.getAttribute("data-passage-target")); };
    });
    (scope || document).querySelectorAll("[data-book-target]").forEach(function (button) {
      button.onclick = function () { goToBook(button.getAttribute("data-book-target")); };
    });
  }

  function installOnBookCards() {
    var activeTab = document.querySelector('.tab.is-active[data-view="books"]');
    if (!activeTab) return;
    document.querySelectorAll("#view .card").forEach(function (card) {
      if (card.querySelector(".book-passage-section")) return;
      var title = card.querySelector("h3");
      if (!title) return;
      var bookId = bookIdByTitle[title.textContent.trim()];
      if (!bookId) return;
      var html = bookPassageSection(bookId, true);
      if (html) {
        card.insertAdjacentHTML("beforeend", html);
        wire(card);
      }
    });
  }

  function installOnBookDetail() {
    var raw = decodeURIComponent((location.hash || "").replace(/^#/, ""));
    if (raw.indexOf("book=") !== 0) return;
    var bookId = raw.split("=")[1];
    var page = document.querySelector("#view .detail-page");
    if (!page || page.querySelector(".book-passage-section")) return;
    var html = bookPassageSection(bookId, false);
    if (!html) return;
    var hero = page.querySelector(".detail-hero");
    if (hero) hero.insertAdjacentHTML("beforeend", html);
    else page.insertAdjacentHTML("afterbegin", html);
    wire(page);
  }

  function installOnPassageCards() {
    var activeTab = document.querySelector('.tab.is-active[data-view="passages"]');
    if (!activeTab) return;
    document.querySelectorAll("#view .card.passage").forEach(function (card) {
      if (card.querySelector(".passage-book-section")) return;
      var title = card.querySelector("h3");
      if (!title) return;
      var passage = passageByReference[title.textContent.trim()];
      if (!passage) return;
      var html = passageBookSection(passage);
      if (html) {
        card.insertAdjacentHTML("beforeend", html);
        wire(card);
      }
    });
  }

  function install() {
    installOnBookCards();
    installOnBookDetail();
    installOnPassageCards();
  }

  function ensureStyles() {
    if (document.querySelector("#book-passage-linker-styles")) return;
    var style = document.createElement("style");
    style.id = "book-passage-linker-styles";
    style.textContent = "\
      .book-passage-section,.passage-book-section{margin-top:14px;border-top:1px solid var(--line);padding-top:13px;}\
      .detail-hero .book-passage-section{border-top:1px solid var(--line);margin-top:18px;padding-top:16px;}\
      .book-passage-section h4,.passage-book-section h4{margin:0 0 9px;font-family:var(--font-display);font-size:.96rem;}\
      .book-passage-grid,.passage-book-grid{display:grid;grid-template-columns:1fr;gap:8px;}\
      .detail-hero .book-passage-grid{grid-template-columns:repeat(3,minmax(0,1fr));}\
      .book-passage-btn,.passage-book-btn{border:1px solid var(--line);background:var(--surface);border-radius:11px;padding:10px 11px;text-align:left;cursor:pointer;color:var(--ink);}\
      .detail-hero .book-passage-btn{background:var(--surface-2);}\
      .book-passage-btn span,.passage-book-btn span{display:block;font-family:var(--font-mono);font-size:.65rem;letter-spacing:.08em;color:var(--muted);text-transform:uppercase;margin-bottom:3px;}\
      .book-passage-btn b,.passage-book-btn b{font-size:.86rem;}\
      .book-passage-btn:hover,.passage-book-btn:hover{border-color:var(--ink);}\
      .book-passage-more{margin:10px 0 0;color:var(--muted);font-size:.84rem;}\
      @media(max-width:900px){.detail-hero .book-passage-grid{grid-template-columns:1fr;}}\
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
