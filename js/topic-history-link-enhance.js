/* Adds related history cards to doctrine topic detail pages. */
(function () {
  var MAP = {
    "revelation": ["계시", "계시론", "일반계시", "특별계시", "하나님의 말씀"],
    "scripture": ["성경", "성경론", "성경 권위", "영감", "정경"],
    "theological-method": ["신학방법론", "교의학", "신학의 출발점"],
    "natural-theology": ["자연신학", "접촉점", "일반계시"],
    "doctrine-of-god": ["신론", "하나님", "하나님의 초월성", "하나님의 주권"],
    "trinity": ["삼위일체", "삼위일체론"],
    "predestination": ["예정론", "예정", "선택", "유기", "작정", "도르트"],
    "creation-covenant": ["창조", "창조론", "언약", "언약신학", "언약론"],
    "christology": ["기독론", "그리스도", "성육신", "그리스도 중심성"],
    "atonement-reconciliation": ["화해", "화해론", "속죄", "속죄론"],
    "soteriology": ["구원론", "구원의 적용", "은혜", "회심"],
    "justification": ["칭의", "믿음", "그리스도의 의"],
    "sanctification": ["성화", "윤리", "제자도", "회개"],
    "ecclesiology": ["교회", "교회론", "교회 정치", "장로회 정치", "성례"],
    "eschatology": ["종말", "종말론", "부활"]
  };

  var PRIORITY = {
    "predestination": ["synod-of-dort", "barth-election-doctrine", "reformed-orthodoxy-and-neo-orthodoxy"],
    "natural-theology": ["natural-theology-debate", "barth-and-neo-orthodoxy"],
    "ecclesiology": ["reformed-and-presbyterian", "westminster-assembly"],
    "revelation": ["modern-liberal-theology-background", "dialectical-theology", "barth-and-neo-orthodoxy"],
    "scripture": ["reformation-to-reformed", "barth-and-neo-orthodoxy"],
    "soteriology": ["synod-of-dort", "reformed-orthodoxy"],
    "theological-method": ["reformed-orthodoxy", "modern-liberal-theology-background"]
  };

  function esc(v) { return String(v || "").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/\"/g,"&quot;").replace(/'/g,"&#39;"); }
  function arr(v) { return Array.isArray(v) ? v : []; }
  function norm(v) { return String(v || "").trim().toLowerCase(); }
  function topics() { return (typeof DATA !== "undefined" && Array.isArray(DATA.topics)) ? DATA.topics : []; }
  function histories() { return (typeof DATA !== "undefined" && Array.isArray(DATA.history)) ? DATA.history : []; }
  function currentTopicId() {
    var raw = decodeURIComponent((location.hash || "").replace(/^#/, ""));
    var parts = raw.split("=");
    return parts[0] === "topic" ? parts[1] : "";
  }
  function currentTopic() {
    var id = currentTopicId();
    return topics().find(function (t) { return t.id === id || t.name === id; }) || null;
  }
  function labels(topic) {
    return [].concat(topic.id, topic.name, arr(topic.relatedTopics), arr(topic.keywords), MAP[topic.id] || []).filter(Boolean).map(String);
  }
  function historyText(h) {
    return [h.title, h.category, h.summary, h.definition, h.historicalBackground, arr(h.relatedTopics).join(" "), arr(h.theologicalIssues).join(" "), arr(h.keyQuestions).join(" ")].join(" ");
  }
  function score(topic, h) {
    var text = norm(historyText(h));
    var s = 0;
    labels(topic).forEach(function (label) {
      var key = norm(label);
      if (!key) return;
      if (arr(h.relatedTopics).some(function (x) { return norm(x) === key; })) s += 6;
      if (arr(h.theologicalIssues).some(function (x) { return norm(x) === key; })) s += 5;
      if (norm(h.title).indexOf(key) >= 0) s += 4;
      if (text.indexOf(key) >= 0) s += 2;
    });
    var p = PRIORITY[topic.id] || [];
    var i = p.indexOf(h.id);
    if (i >= 0) s += 12 - i;
    return s;
  }
  function related(topic) {
    return histories().map(function (h) { return { h: h, s: score(topic, h) }; })
      .filter(function (x) { return x.s > 0; })
      .sort(function (a, b) { return b.s - a.s; })
      .slice(0, 6)
      .map(function (x) { return x.h; });
  }
  function go(id) { if (id) location.hash = "history=" + encodeURIComponent(id); }

  function installGuide() {
    var topic = currentTopic();
    if (!topic) return;
    var body = document.querySelector(".topic-detail-body");
    if (!body || body.querySelector(".topic-history-guide")) return;
    var items = related(topic);
    if (!items.length) return;
    var section = document.createElement("section");
    section.className = "topic-section topic-history-guide";
    section.innerHTML = '<h4>관련 역사 항목</h4><p class="topic-history-intro">이 교리 주제와 함께 읽으면 좋은 역사 항목입니다. 교리가 어떤 논쟁과 전통 형성 과정 속에서 중요해졌는지 확인할 수 있습니다.</p><div class="topic-history-grid">' +
      items.map(function (h) {
        return '<article class="topic-history-card"><span>' + esc(h.period || h.category || "역사 항목") + '</span><h5>' + esc(h.title) + '</h5><p>' + esc(h.summary || h.definition || "") + '</p><button type="button" data-history-card="' + esc(h.id) + '">역사 항목 열기 →</button></article>';
      }).join("") + '</div>';
    var refs = body.querySelector(".refs");
    if (refs) body.insertBefore(section, refs); else body.appendChild(section);
    section.querySelectorAll("[data-history-card]").forEach(function (b) { b.onclick = function () { go(b.getAttribute("data-history-card")); }; });
  }

  function ensureStyles() {
    if (document.querySelector("#topic-history-link-styles")) return;
    var style = document.createElement("style");
    style.id = "topic-history-link-styles";
    style.textContent = "\
      .topic-history-intro{color:var(--muted);line-height:1.75;margin-top:0;}\
      .topic-history-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;}\
      .topic-history-card{border:1px solid var(--line);background:var(--surface);border-radius:13px;padding:14px;}\
      .topic-history-card span{display:block;font-family:var(--font-mono);font-size:.7rem;color:var(--muted);letter-spacing:.08em;margin-bottom:6px;}\
      .topic-history-card h5{font-family:var(--font-display);font-size:1rem;margin:0 0 8px;}\
      .topic-history-card p{color:var(--muted);font-size:.9rem;line-height:1.65;margin:0 0 12px;}\
      .topic-history-card button{border:1px solid var(--line-strong);background:var(--surface-2);border-radius:999px;padding:8px 11px;cursor:pointer;color:var(--ink);font-size:.84rem;}\
      .topic-history-card button:hover{border-color:var(--ink);background:var(--surface);}\
      @media(max-width:820px){.topic-history-grid{grid-template-columns:1fr;}}\
    ";
    document.head.appendChild(style);
  }
  function install() { ensureStyles(); installGuide(); }
  var view = document.querySelector("#view");
  if (view) new MutationObserver(function () { install(); }).observe(view, { childList:true, subtree:true });
  window.addEventListener("hashchange", function () { setTimeout(install, 0); });
  document.addEventListener("DOMContentLoaded", install);
  setTimeout(install, 0);
})();
