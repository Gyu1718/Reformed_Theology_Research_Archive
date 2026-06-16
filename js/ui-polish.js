/* UI polish layer.
   Adds search reset and compact relation sections without rewriting the core app renderer.
   CSS rules live in css/style.css. Passage detail routing is handled by relations.js. */
(function () {
  function loadJson(path, fallback) {
    try {
      var xhr = new XMLHttpRequest();
      xhr.open("GET", path, false);
      xhr.send(null);
      if (xhr.status >= 200 && xhr.status < 300) return JSON.parse(xhr.responseText);
    } catch (error) {
      console.warn(path + " was not loaded for UI polish.", error);
    }
    return fallback;
  }

  var passages = loadJson("./data/passages.json", []);
  var passageById = {};
  passages.forEach(function (passage) {
    if (passage && passage.id) passageById[passage.id] = passage;
  });

  function ensureStyles() {
    // Styles for this layer are maintained in css/style.css.
  }

  function ensureSearchClear() {
    var search = document.querySelector(".search");
    var input = document.querySelector("#q");
    if (!search || !input) return;
    input.classList.add("has-clear");
    var btn = search.querySelector(".search-clear");
    if (!btn) {
      btn = document.createElement("button");
      btn.type = "button";
      btn.className = "search-clear";
      btn.setAttribute("aria-label", "검색어 지우기");
      btn.textContent = "×";
      search.appendChild(btn);
      btn.addEventListener("click", function () {
        input.value = "";
        input.dispatchEvent(new Event("input", { bubbles: true }));
        if ((location.hash || "").indexOf("#passage=") === 0) {
          history.pushState("", document.title, location.pathname + location.search);
        }
        updateSearchClear();
      });
      input.addEventListener("input", updateSearchClear);
    }
    updateSearchClear();
  }

  function updateSearchClear() {
    var input = document.querySelector("#q");
    var btn = document.querySelector(".search-clear");
    if (!input || !btn) return;
    btn.classList.toggle("is-visible", !!input.value.trim());
  }

  function clearFilterFromNotice() {
    var input = document.querySelector("#q");
    if (!input) return;
    input.value = "";
    input.dispatchEvent(new Event("input", { bubbles: true }));
    if ((location.hash || "").indexOf("#passage=") === 0) {
      history.pushState("", document.title, location.pathname + location.search);
    }
    updateSearchClear();
  }

  function ensureFilterNotice() {
    var input = document.querySelector("#q");
    var view = document.querySelector("#view");
    if (!input || !view) return;
    var old = document.querySelector(".filter-notice");
    if (!input.value.trim()) {
      if (old) old.remove();
      return;
    }
    if (!old) {
      old = document.createElement("div");
      old.className = "filter-notice";
      view.parentNode.insertBefore(old, view);
    }
    old.innerHTML = '현재 <b>“' + input.value.trim() + '”</b>로 필터링 중입니다. <button type="button">전체 보기</button>';
    old.querySelector("button").onclick = clearFilterFromNotice;
  }

  function collapseSection(section, label, openOnDetail) {
    if (!section || section.dataset.uiCollapsed === "true") return;
    var card = section.closest(".card");
    var detail = section.closest(".detail-page");
    if (!card && !detail) return;
    if (detail && openOnDetail) return;
    var details = document.createElement("details");
    details.className = "relation-collapse";
    details.dataset.uiCollapsed = "true";
    var summary = document.createElement("summary");
    summary.textContent = label;
    var body = document.createElement("div");
    body.className = "relation-collapse-body";
    section.dataset.uiCollapsed = "true";
    section.parentNode.insertBefore(details, section);
    body.appendChild(section);
    details.appendChild(summary);
    details.appendChild(body);
  }

  function compactRelationSections() {
    document.querySelectorAll("#view .card .passage-theology-section").forEach(function (section) { collapseSection(section, "신학 연결", false); });
    document.querySelectorAll("#view .card .passage-book-section").forEach(function (section) { collapseSection(section, "관련 책", false); });
    document.querySelectorAll("#view .card .book-passage-section").forEach(function (section) { collapseSection(section, "관련 성경 본문", false); });
    document.querySelectorAll("#view .card .author-history-section").forEach(function (section) { collapseSection(section, "관련 역사", false); });
    document.querySelectorAll("#view .card .topic-history-section").forEach(function (section) { collapseSection(section, "관련 역사", false); });
  }

  function applyPassageRoute() {
    if (window.__RELATIONS_HANDLES_PASSAGE_ROUTE__) return;
    var raw = decodeURIComponent((location.hash || "").replace(/^#/, ""));
    if (raw.indexOf("passage=") !== 0) return;
    var id = raw.split("=")[1];
    var passage = passageById[id];
    if (!passage) return;
    var input = document.querySelector("#q");
    if (!input) return;
    input.value = passage.reference;
    input.dispatchEvent(new Event("input", { bubbles: true }));
    var tab = document.querySelector('.tab[data-view="passages"]');
    if (tab) tab.click();
    history.replaceState("", document.title, location.pathname + location.search + "#passage=" + encodeURIComponent(id));
    setTimeout(function () {
      var cards = Array.prototype.slice.call(document.querySelectorAll("#view .card.passage"));
      var target = cards.find(function (card) {
        var title = card.querySelector("h3");
        return title && title.textContent.trim() === passage.reference;
      });
      if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
      updateSearchClear();
      ensureFilterNotice();
    }, 120);
  }

  function install() {
    ensureStyles();
    ensureSearchClear();
    updateSearchClear();
    ensureFilterNotice();
    compactRelationSections();
    applyPassageRoute();
  }

  var view = document.querySelector("#view");
  if (view) {
    var observer = new MutationObserver(function () { install(); });
    observer.observe(view, { childList: true, subtree: true });
  }
  window.addEventListener("hashchange", function () { setTimeout(install, 0); });
  document.addEventListener("DOMContentLoaded", install);
  setTimeout(install, 0);
})();
