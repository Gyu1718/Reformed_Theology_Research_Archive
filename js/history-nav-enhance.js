/* History previous/next navigation enhancer.
   Keeps app.js stable and adds navigation to #history=... detail pages. */
(function () {
  function loadJson(path, fallback) {
    try {
      var xhr = new XMLHttpRequest();
      xhr.open("GET", path, false);
      xhr.send(null);
      if (xhr.status >= 200 && xhr.status < 300) return JSON.parse(xhr.responseText);
    } catch (error) {
      console.warn(path + " was not loaded for history navigation.", error);
    }
    return fallback;
  }

  var historyItems = [].concat(
    loadJson("./data/tradition-history.json", []),
    loadJson("./data/neo-orthodoxy-history.json", [])
  ).filter(function (item) { return item && item.id; });

  function currentHistoryId() {
    var raw = decodeURIComponent((location.hash || "").replace(/^#/, ""));
    var parts = raw.split("=");
    return parts[0] === "history" ? parts[1] : "";
  }

  function installNav() {
    var id = currentHistoryId();
    if (!id || !historyItems.length) return;
    var page = document.querySelector(".detail-page");
    if (!page || page.querySelector(".history-flow-nav")) return;
    var index = historyItems.findIndex(function (item) { return item.id === id; });
    if (index < 0) return;

    var prev = historyItems[index - 1];
    var next = historyItems[index + 1];
    var nav = document.createElement("nav");
    nav.className = "history-flow-nav";
    nav.setAttribute("aria-label", "역사 항목 이동");
    nav.innerHTML =
      '<button type="button" class="history-flow-btn" data-target="' + (prev ? prev.id : "") + '" ' + (!prev ? "disabled" : "") + '><span>이전</span><b>' + (prev ? prev.title : "처음 항목") + '</b></button>' +
      '<button type="button" class="history-flow-btn" data-target="' + (next ? next.id : "") + '" ' + (!next ? "disabled" : "") + '><span>다음</span><b>' + (next ? next.title : "마지막 항목") + '</b></button>';

    var hero = page.querySelector(".detail-hero");
    if (hero && hero.parentNode) hero.parentNode.insertBefore(nav, hero.nextSibling);
    else page.insertBefore(nav, page.firstChild);

    nav.querySelectorAll("[data-target]").forEach(function (button) {
      button.onclick = function () {
        var target = button.getAttribute("data-target");
        if (target) location.hash = "history=" + encodeURIComponent(target);
      };
    });
  }

  function ensureStyles() {
    if (document.querySelector("#history-flow-nav-styles")) return;
    var style = document.createElement("style");
    style.id = "history-flow-nav-styles";
    style.textContent = "\
      .history-flow-nav{display:grid;grid-template-columns:1fr 1fr;gap:10px;padding:14px 18px;border-bottom:1px solid var(--line);background:var(--surface-2);}\
      .history-flow-btn{border:1px solid var(--line);background:var(--surface);border-radius:12px;padding:12px 14px;text-align:left;cursor:pointer;color:var(--ink);}\
      .history-flow-btn span{display:block;font-family:var(--font-mono);font-size:.7rem;color:var(--muted);letter-spacing:.08em;text-transform:uppercase;margin-bottom:4px;}\
      .history-flow-btn b{font-size:.92rem;}\
      .history-flow-btn:hover:not(:disabled){border-color:var(--ink);}\
      .history-flow-btn:disabled{opacity:.48;cursor:not-allowed;}\
      @media(max-width:720px){.history-flow-nav{grid-template-columns:1fr;}}\
    ";
    document.head.appendChild(style);
  }

  function loadWscEnhancer() {
    if (document.querySelector('script[src$="wsc-index-enhance.js"]')) return;
    var script = document.createElement("script");
    script.src = "./js/wsc-index-enhance.js";
    script.defer = true;
    document.body.appendChild(script);
  }

  ensureStyles();
  var observer = new MutationObserver(function () { installNav(); });
  var view = document.querySelector("#view");
  if (view) observer.observe(view, { childList: true, subtree: true });
  window.addEventListener("hashchange", function () { setTimeout(installNav, 0); });
  document.addEventListener("DOMContentLoaded", function () { installNav(); loadWscEnhancer(); });
  setTimeout(installNav, 0);
  setTimeout(loadWscEnhancer, 0);
})();
