/* UI polish layer.
   Adds search reset, compact relation sections, common button styling, and #passage routing
   without rewriting the core app renderer. */
(function () {
  var isRoutingPassage = false;

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
    if (document.querySelector("#ui-polish-styles")) return;
    var style = document.createElement("style");
    style.id = "ui-polish-styles";
    style.textContent = "\
      :root{--scripture:#6F6A2E;--scripture-ink:#4D491D;--scripture-soft:#EEEBD8;--sticky-offset:96px;}\
      .search{display:flex;align-items:center;}\
      .search-clear{position:absolute;right:9px;top:50%;transform:translateY(-50%);border:1px solid var(--line);background:var(--surface-2);border-radius:999px;width:30px;height:30px;display:none;align-items:center;justify-content:center;cursor:pointer;color:var(--muted);font-size:1rem;line-height:1;}\
      .search-clear.is-visible{display:flex;}\
      .search input.has-clear{padding-right:48px;}\
      .filter-notice{margin-top:12px;border:1px solid var(--line);border-radius:999px;background:var(--surface-2);display:inline-flex;align-items:center;gap:8px;padding:7px 11px;color:var(--muted);font-size:.85rem;}\
      .filter-notice button{border:0;background:transparent;cursor:pointer;color:var(--ref-ink);font-weight:600;padding:0;}\
      .card.passage::before{background:var(--scripture);}\
      .card.passage .cat-tag:first-child{color:var(--scripture-ink);}\
      .link-btn,.open-link,.back-btn,.topic-history-btn,.author-history-btn,.passage-link-btn,.passage-book-btn,.book-passage-btn,.history-relations button{border:1px solid var(--line-strong);background:var(--surface);border-radius:11px;padding:10px 12px;text-align:left;cursor:pointer;color:var(--ink);transition:border-color .15s,background .15s,transform .15s;}\
      .link-btn:hover,.open-link:hover,.back-btn:hover,.topic-history-btn:hover,.author-history-btn:hover,.passage-link-btn:hover,.passage-book-btn:hover,.book-passage-btn:hover,.history-relations button:hover{border-color:var(--ink);background:var(--surface-2);}\
      .card .relation-collapse{margin-top:12px;border-top:1px solid var(--line);padding-top:11px;}\
      .relation-collapse>summary{cursor:pointer;list-style:none;font-family:var(--font-display);font-size:.95rem;color:var(--ink);display:flex;align-items:center;justify-content:space-between;gap:8px;}\
      .relation-collapse>summary::-webkit-details-marker{display:none;}\
      .relation-collapse>summary::after{content:'펼치기';font-family:var(--font-mono);font-size:.64rem;color:var(--muted);border:1px solid var(--line);border-radius:999px;padding:2px 8px;background:var(--surface-2);}\
      .relation-collapse[open]>summary::after{content:'접기';}\
      .relation-collapse-body{padding-top:11px;}\
      .relation-collapse-body>section{margin-top:0;border-top:0;padding-top:0;}\
      .passage-depth-section{margin-top:12px;}\
      .detail-toc{top:var(--sticky-offset)!important;}\
      @media(max-width:760px){.wrap{width:min(100% - 24px,1180px);} .masthead-inner{padding:34px 0 24px;} .controls{gap:10px;} .filter{width:100%;overflow-x:auto;padding-bottom:2px;} .chip{white-space:nowrap;} .card{padding:18px 18px 18px 21px;} .card .sum{font-size:.9rem;} .tabs{position:sticky;top:72px;z-index:19;background:var(--paper);padding-top:10px;border-bottom:1px solid var(--line);} }\
    ";
    document.head.appendChild(style);
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
    var raw = decodeURIComponent((location.hash || "").replace(/^#/, ""));
    if (raw.indexOf("passage=") !== 0 || isRoutingPassage) return;
    var id = raw.split("=")[1];
    var passage = passageById[id];
    if (!passage) return;
    var input = document.querySelector("#q");
    if (!input) return;
    isRoutingPassage = true;
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
      isRoutingPassage = false;
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
