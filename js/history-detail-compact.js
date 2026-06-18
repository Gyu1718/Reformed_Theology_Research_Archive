/* Compact history detail layout.
   Keeps history detail pages readable while reducing tall, low-content cards. */
(function () {
  function isHistoryDetailRoute() {
    var raw = decodeURIComponent((location.hash || "").replace(/^#/, ""));
    return raw.indexOf("history=") === 0;
  }

  function markHistoryDetailPage() {
    var page = document.querySelector("#view .detail-page");
    if (!page) return;
    if (isHistoryDetailRoute()) page.classList.add("history-detail-page");
    else page.classList.remove("history-detail-page");
  }

  function ensureStyles() {
    if (document.querySelector("#history-detail-compact-styles")) return;
    var style = document.createElement("style");
    style.id = "history-detail-compact-styles";
    style.textContent = "\
      .history-detail-page .detail-hero{padding:18px 22px 16px;}\
      .history-detail-page .detail-hero h2{font-size:1.55rem;margin:6px 0 3px;}\
      .history-detail-page .detail-hero .by{margin:0 0 8px;}\
      .history-detail-page .detail-hero .sum{margin:0;color:var(--muted);line-height:1.6;}\
      .history-detail-page .detail-hero .diverge{margin-top:10px;}\
      .history-detail-page .history-detail-body{padding:14px 18px 20px;}\
      .history-detail-page .history-section{margin-top:10px;padding:12px 14px;border-radius:12px;}\
      .history-detail-page .history-section h4{font-size:.98rem;margin:0 0 8px;}\
      .history-detail-page .history-section .muted{margin:0;line-height:1.65;}\
      .history-detail-page .history-list li{margin:4px 0;}\
      .history-detail-page .history-grid{grid-template-columns:1fr;gap:6px;}\
      .history-detail-page .history-mini{display:grid;grid-template-columns:minmax(120px,1.2fr) auto minmax(0,2fr);align-items:center;gap:8px;padding:8px 10px;border-radius:10px;}\
      .history-detail-page .history-mini b{margin:0;font-size:.94rem;}\
      .history-detail-page .history-mini span{font-family:var(--font-mono);font-size:.8rem;color:var(--muted);}\
      .history-detail-page .history-mini p{margin:0;color:var(--muted);font-size:.86rem;line-height:1.5;}\
      .history-detail-page .history-relations{gap:6px;}\
      .history-detail-page .history-relations button,.history-detail-page .history-relations span{padding:6px 9px;font-size:.82rem;}\
      @media(max-width:720px){.history-detail-page .detail-hero{padding:15px 16px 13px;}.history-detail-page .detail-hero h2{font-size:1.34rem;}.history-detail-page .history-detail-body{padding:10px 12px 16px;}.history-detail-page .history-section{padding:10px 11px;margin-top:8px;}.history-detail-page .history-mini{grid-template-columns:1fr;gap:3px;padding:8px 9px;}.history-detail-page .history-mini span{font-family:var(--font-sans);}}\
    ";
    document.head.appendChild(style);
  }

  function install() {
    ensureStyles();
    markHistoryDetailPage();
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
