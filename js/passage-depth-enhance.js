/* Passage depth enhancer.
   Renders key questions, tradition uses, sermon uses, and research uses on passage cards.
   CSS rules live in css/style.css. */
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
    // Styles for this layer are maintained in css/style.css.
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
