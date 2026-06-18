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
      #view .history-detail-body{padding:10px 14px 16px !important;}\
      #view .history-detail-body .history-section{margin-top:8px !important;padding:9px 11px !important;border-radius:10px !important;}\
      #view .history-detail-body .history-section h4{font-size:.94rem !important;margin:0 0 6px !important;}\
      #view .history-detail-body .history-section .muted{margin:0 !important;line-height:1.55 !important;}\
      #view .history-detail-body .history-list{margin:0 !important;padding-left:17px !important;}\
      #view .history-detail-body .history-list li{margin:3px 0 !important;}\
      #view .history-detail-body .history-grid{display:block !important;}\
      #view .history-detail-body .history-mini{display:grid !important;grid-template-columns:minmax(150px,1.1fr) 86px minmax(0,2fr) !important;align-items:center !important;gap:8px !important;min-height:0 !important;margin:0 0 4px !important;padding:6px 8px !important;border-radius:8px !important;background:var(--surface) !important;}\
      #view .history-detail-body .history-mini:last-child{margin-bottom:0 !important;}\
      #view .history-detail-body .history-mini b{margin:0 !important;font-size:.9rem !important;line-height:1.25 !important;}\
      #view .history-detail-body .history-mini span{display:block !important;margin:0 !important;font-family:var(--font-mono) !important;font-size:.78rem !important;color:var(--muted) !important;line-height:1.25 !important;}\
      #view .history-detail-body .history-mini p{margin:0 !important;color:var(--muted) !important;font-size:.82rem !important;line-height:1.35 !important;}\
      #view .history-detail-body .history-relations{gap:5px !important;}\
      #view .history-detail-body .history-relations button,#view .history-detail-body .history-relations span{padding:5px 8px !important;font-size:.8rem !important;}\
      #view .history-detail-page .detail-hero{padding:16px 18px 14px !important;}\
      #view .history-detail-page .detail-hero h2{font-size:1.45rem !important;margin:5px 0 2px !important;}\
      #view .history-detail-page .detail-hero .by{margin:0 0 7px !important;}\
      #view .history-detail-page .detail-hero .sum{margin:0 !important;line-height:1.55 !important;}\
      @media(max-width:720px){#view .history-detail-body{padding:8px 8px 12px !important;}#view .history-detail-body .history-section{padding:8px !important;margin-top:6px !important;}#view .history-detail-body .history-grid{display:block !important;}#view .history-detail-body .history-mini{grid-template-columns:1fr !important;gap:2px !important;margin-bottom:4px !important;padding:7px 8px !important;}#view .history-detail-body .history-mini span{font-family:var(--font-sans) !important;}#view .history-detail-page .detail-hero{padding:13px 14px 11px !important;}#view .history-detail-page .detail-hero h2{font-size:1.28rem !important;}}\
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
