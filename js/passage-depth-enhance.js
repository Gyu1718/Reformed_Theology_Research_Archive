/* Passage depth enhancer.
   Renders key questions, tradition uses, sermon uses, and research uses on passage cards. */
(function () {
  function loadJson(path, fallback) {
    try {
      var xhr = new XMLHttpRequest();
      xhr.open("GET", path, false);
      xhr.send(null);
      if (xhr.status >= 200 && xhr.status < 300) return JSON.parse(xhr.responseText);
    } catch (error) {
      console.warn(path + " was not loaded for passage depth enhancement.", error);
    }
    return fallback;
  }

  var passages = loadJson("./data/passages.json", []);
  var passageByReference = {};
  passages.forEach(function (passage) {
    if (passage && passage.reference) passageByReference[passage.reference.trim()] = passage;
  });

  function listHtml(title, items) {
    if (!items || !items.length) return "";
    return '<div class="passage-depth-block"><b>' + title + '</b><ul>' +
      items.map(function (item) { return '<li>' + item + '</li>'; }).join("") +
      '</ul></div>';
  }

  function sectionHtml(passage) {
    var html = "";
    html += listHtml("핵심 질문", passage.keyQuestions);
    html += listHtml("전통별 활용", passage.traditionUses);
    html += listHtml("설교 활용", passage.sermonUses);
    html += listHtml("연구 활용", passage.researchUses);
    if (!html) return "";
    return '<details class="passage-depth-section"><summary>본문 연구 노트</summary><div class="passage-depth-body">' + html + '</div></details>';
  }

  function install() {
    var activeTab = document.querySelector('.tab.is-active[data-view="passages"]');
    if (!activeTab) return;
    document.querySelectorAll("#view .card.passage").forEach(function (card) {
      if (card.querySelector(".passage-depth-section")) return;
      var title = card.querySelector("h3");
      if (!title) return;
      var reference = title.textContent.trim();
      var passage = passageByReference[reference];
      if (!passage) return;
      var html = sectionHtml(passage);
      if (html) card.insertAdjacentHTML("beforeend", html);
    });
  }

  function ensureStyles() {
    if (document.querySelector("#passage-depth-enhance-styles")) return;
    var style = document.createElement("style");
    style.id = "passage-depth-enhance-styles";
    style.textContent = "\
      .passage-depth-section{margin-top:14px;border-top:1px solid var(--line);padding-top:12px;}\
      .passage-depth-section summary{cursor:pointer;font-family:var(--font-display);font-size:.96rem;color:var(--ink);} \
      .passage-depth-body{margin-top:12px;display:grid;gap:12px;}\
      .passage-depth-block{border:1px solid var(--line);border-radius:11px;background:var(--surface-2);padding:12px;}\
      .passage-depth-block>b{display:block;margin-bottom:7px;font-size:.88rem;}\
      .passage-depth-block ul{margin:0;padding-left:18px;}\
      .passage-depth-block li{margin:6px 0;color:var(--muted);font-size:.87rem;line-height:1.55;}\
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
