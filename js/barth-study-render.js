/* Render structured Barth study notes in the Books detail page without modifying the generic book renderer. */
(function () {
  function arr(value) { return Array.isArray(value) ? value : []; }
  function esc(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }
  function injectStyles() {
    if (document.querySelector("#barth-study-render-styles")) return;
    var style = document.createElement("style");
    style.id = "barth-study-render-styles";
    style.textContent = "\n" +
      ".barth-study-blocks{margin-top:16px;display:grid;gap:10px}\n" +
      ".barth-study-card{border:1px solid var(--line);background:var(--surface);border-radius:12px;padding:13px 14px}\n" +
      ".barth-study-card h5{margin:0 0 7px;font-family:var(--font-mono);font-size:.76rem;letter-spacing:.08em;color:var(--muted);text-transform:uppercase}\n" +
      ".barth-study-card p{margin:0;color:var(--muted);line-height:1.75}\n" +
      ".barth-study-card ol,.barth-study-card ul{margin:0;padding-left:20px;color:var(--muted)}\n" +
      ".barth-study-card li{margin:6px 0;line-height:1.65}\n" +
      ".barth-study-card b{color:var(--ink)}\n" +
      ".barth-study-subtopics{display:grid;gap:8px}\n" +
      ".barth-study-subtopics div{border:1px solid var(--line);border-radius:10px;background:var(--surface-2);padding:10px 11px}\n" +
      ".barth-study-subtopics span{display:block;color:var(--ink);font-weight:700;margin-bottom:3px}\n";
    document.head.appendChild(style);
  }
  function barthBook() {
    return arr(window.__DATA__ && window.__DATA__.books).find(function (book) { return book.id === "barth-church-dogmatics"; });
  }
  function noteMap() {
    var book = barthBook();
    var map = {};
    if (!book) return map;
    arr(book.parts).forEach(function (part) {
      arr(part.chapters).forEach(function (chapter) {
        if (!chapter.studyNoteApplied) return;
        map[chapter.ref] = chapter;
      });
    });
    return map;
  }
  function card(title, html) {
    return html ? '<section class="barth-study-card"><h5>' + esc(title) + '</h5>' + html + '</section>' : "";
  }
  function render(chapter) {
    var blocks = [];
    blocks.push(card("핵심 질문", chapter.question ? "<p>" + esc(chapter.question) + "</p>" : ""));
    blocks.push(card("핵심 주장", chapter.thesis ? "<p>" + esc(chapter.thesis) + "</p>" : ""));
    blocks.push(card("논증 흐름", arr(chapter.argumentFlow).length ? "<ol>" + arr(chapter.argumentFlow).map(function (item) { return "<li>" + esc(item) + "</li>"; }).join("") + "</ol>" : ""));
    blocks.push(card("소주제 설명", arr(chapter.subtopicNotes).length ? '<div class="barth-study-subtopics">' + arr(chapter.subtopicNotes).map(function (item) { return "<div><span>" + esc(item.title) + "</span><p>" + esc(item.note) + "</p></div>"; }).join("") + "</div>" : ""));
    blocks.push(card("개혁파 정통과의 비교", chapter.reformedContrast ? "<p>" + esc(chapter.reformedContrast) + "</p>" : ""));
    blocks.push(card("학습 질문", arr(chapter.studyQuestions).length ? "<ul>" + arr(chapter.studyQuestions).map(function (item) { return "<li>" + esc(item) + "</li>"; }).join("") + "</ul>" : ""));
    return '<div class="barth-study-blocks" data-barth-study-rendered="true">' + blocks.join("") + "</div>";
  }
  function apply() {
    injectStyles();
    var map = noteMap();
    if (!Object.keys(map).length) return;
    document.querySelectorAll(".chap-x").forEach(function (node) {
      if (node.querySelector('[data-barth-study-rendered="true"]')) return;
      var refNode = node.querySelector(".cref");
      var detail = node.querySelector(".chap-detail");
      if (!refNode || !detail) return;
      var ref = refNode.textContent.trim();
      var chapter = map[ref];
      if (!chapter) return;
      detail.insertAdjacentHTML("beforeend", render(chapter));
    });
  }
  var scheduled = false;
  function schedule() {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(function () { scheduled = false; apply(); });
  }
  document.addEventListener("DOMContentLoaded", schedule);
  window.addEventListener("hashchange", schedule);
  var view = document.querySelector("#view");
  if (view) new MutationObserver(schedule).observe(view, { childList: true, subtree: true });
  schedule();
})();
