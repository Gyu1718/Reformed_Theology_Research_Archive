/* History ↔ doctrine topic linking enhancer.
   Resolves history relatedTopics/theologicalIssues into actual topic detail routes. */
(function () {
  var ALIASES = {
    "계시": "revelation",
    "계시론": "revelation",
    "일반계시": "revelation",
    "특별계시": "revelation",
    "하나님의 말씀": "revelation",
    "성경": "scripture",
    "성경론": "scripture",
    "성경 권위": "scripture",
    "영감": "scripture",
    "정경": "scripture",
    "말씀과 선포": "scripture",
    "신학방법론": "theological-method",
    "교의학": "theological-method",
    "신학의 출발점": "theological-method",
    "자연신학": "natural-theology",
    "접촉점": "natural-theology",
    "신론": "doctrine-of-god",
    "삼위일체론": "trinity",
    "삼위일체": "trinity",
    "예정론": "predestination",
    "예정": "predestination",
    "선택": "predestination",
    "유기": "predestination",
    "작정": "predestination",
    "하나님의 작정": "predestination",
    "언약": "creation-covenant",
    "언약신학": "creation-covenant",
    "언약론": "creation-covenant",
    "창조론": "creation-covenant",
    "창조와 언약": "creation-covenant",
    "섭리": "providence-and-evil",
    "섭리론": "providence-and-evil",
    "악": "providence-and-evil",
    "죄론": "sin",
    "죄": "sin",
    "인간론": "humanity",
    "기독론": "christology",
    "그리스도 중심성": "christology",
    "성육신": "christology",
    "화해론": "atonement-reconciliation",
    "화해": "atonement-reconciliation",
    "속죄론": "atonement-reconciliation",
    "속죄": "atonement-reconciliation",
    "구원론": "soteriology",
    "구원의 적용": "soteriology",
    "칭의": "justification",
    "성화": "sanctification",
    "교회론": "ecclesiology",
    "교회": "ecclesiology",
    "교회 정치": "ecclesiology",
    "장로회 정치": "ecclesiology",
    "성례론": "ecclesiology",
    "성례": "ecclesiology",
    "종말론": "eschatology"
  };

  function esc(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function arr(value) {
    return Array.isArray(value) ? value : [];
  }

  function topics() {
    return (typeof DATA !== "undefined" && Array.isArray(DATA.topics)) ? DATA.topics : [];
  }

  function historyItems() {
    return (typeof DATA !== "undefined" && Array.isArray(DATA.history)) ? DATA.history : [];
  }

  function currentHistoryId() {
    var raw = decodeURIComponent((location.hash || "").replace(/^#/, ""));
    var parts = raw.split("=");
    return parts[0] === "history" ? parts[1] : "";
  }

  function currentHistoryItem() {
    var id = currentHistoryId();
    return historyItems().find(function (item) { return item.id === id; });
  }

  function normalize(value) {
    return String(value || "").trim().toLowerCase();
  }

  function topicById(id) {
    return topics().find(function (topic) { return topic.id === id; }) || null;
  }

  function resolveTopic(value) {
    var raw = String(value || "").trim();
    if (!raw) return null;
    var rawNorm = normalize(raw);
    var topicList = topics();

    var exact = topicList.find(function (topic) {
      return normalize(topic.id) === rawNorm || normalize(topic.name) === rawNorm;
    });
    if (exact) return exact;

    if (ALIASES[raw] && topicById(ALIASES[raw])) return topicById(ALIASES[raw]);

    var relatedExact = topicList.find(function (topic) {
      return arr(topic.relatedTopics).some(function (related) { return normalize(related) === rawNorm; });
    });
    if (relatedExact) return relatedExact;

    var aliasKey = Object.keys(ALIASES).find(function (key) {
      return raw.indexOf(key) >= 0 || key.indexOf(raw) >= 0;
    });
    if (aliasKey && topicById(ALIASES[aliasKey])) return topicById(ALIASES[aliasKey]);

    var fuzzy = topicList.find(function (topic) {
      if (raw.indexOf(topic.name) >= 0 || topic.name.indexOf(raw) >= 0) return true;
      return arr(topic.relatedTopics).some(function (related) {
        return raw.indexOf(related) >= 0 || related.indexOf(raw) >= 0;
      });
    });
    return fuzzy || null;
  }

  function routeTopic(topic) {
    if (topic && topic.id) location.hash = "topic=" + encodeURIComponent(topic.id);
  }

  function candidateLabels(historyItem) {
    if (!historyItem) return [];
    var labels = [].concat(
      arr(historyItem.relatedTopics),
      arr(historyItem.theologicalIssues)
    );
    return labels.filter(function (value, index) {
      return value && labels.indexOf(value) === index;
    });
  }

  function resolvedTopicCards(historyItem) {
    var seen = {};
    return candidateLabels(historyItem)
      .map(function (label) {
        var topic = resolveTopic(label);
        if (!topic || seen[topic.id]) return null;
        seen[topic.id] = true;
        return { label: label, topic: topic };
      })
      .filter(Boolean)
      .slice(0, 8);
  }

  function enhanceRelationButtons() {
    var view = document.querySelector("#view");
    if (!view) return;
    view.querySelectorAll("[data-topic-jump]").forEach(function (button) {
      var label = button.getAttribute("data-topic-jump");
      var topic = resolveTopic(label);
      if (!topic) {
        button.classList.add("history-topic-unresolved");
        button.title = "아직 직접 연결된 교리 상세 페이지가 없습니다.";
        return;
      }
      button.classList.add("history-topic-resolved");
      button.setAttribute("data-topic-resolved", topic.id);
      button.title = "교리 상세 페이지로 이동: " + topic.name;
      button.onclick = function (event) {
        event.preventDefault();
        event.stopPropagation();
        routeTopic(topic);
      };
    });
  }

  function installDoctrineGuide() {
    var h = currentHistoryItem();
    if (!h) return;
    var page = document.querySelector(".detail-page");
    var body = page && page.querySelector(".history-detail-body");
    if (!body || body.querySelector(".history-doctrine-guide")) return;

    var cards = resolvedTopicCards(h);
    if (!cards.length) return;

    var section = document.createElement("section");
    section.className = "history-section history-doctrine-guide";
    section.innerHTML =
      '<h4>연결된 교리 페이지</h4>' +
      '<p class="history-doctrine-intro">이 역사 항목과 함께 읽으면 좋은 교리 상세 페이지입니다. 역사적 사건이 어떤 교리 쟁점과 연결되는지 바로 확인할 수 있습니다.</p>' +
      '<div class="history-doctrine-grid">' + cards.map(function (card) {
        return '<article class="history-doctrine-card">' +
          '<span>' + esc(card.topic.category || "교리") + '</span>' +
          '<h5>' + esc(card.topic.name) + '</h5>' +
          '<p>' + esc(card.topic.summary || "") + '</p>' +
          '<button type="button" data-topic-card="' + esc(card.topic.id) + '">교리 페이지 열기 →</button>' +
        '</article>';
      }).join("") + '</div>';

    var relationSection = Array.prototype.slice.call(body.querySelectorAll(".history-section")).find(function (section) {
      var heading = section.querySelector("h4");
      return heading && heading.textContent.trim() === "연결 색인";
    });
    if (relationSection && relationSection.nextSibling) body.insertBefore(section, relationSection.nextSibling);
    else body.appendChild(section);

    section.querySelectorAll("[data-topic-card]").forEach(function (button) {
      button.onclick = function () {
        var topic = topicById(button.getAttribute("data-topic-card"));
        routeTopic(topic);
      };
    });
  }

  function ensureStyles() {
    if (document.querySelector("#history-topic-link-styles")) return;
    var style = document.createElement("style");
    style.id = "history-topic-link-styles";
    style.textContent = "\
      .history-topic-resolved{font-weight:700;}\
      .history-topic-resolved::after{content:' ↗';font-size:.78em;color:var(--muted);}\
      .history-topic-unresolved{opacity:.7;}\
      .history-doctrine-intro{color:var(--muted);line-height:1.75;margin-top:0;}\
      .history-doctrine-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;}\
      .history-doctrine-card{border:1px solid var(--line);background:var(--surface);border-radius:13px;padding:14px;}\
      .history-doctrine-card span{display:block;font-family:var(--font-mono);font-size:.7rem;color:var(--muted);letter-spacing:.08em;margin-bottom:6px;}\
      .history-doctrine-card h5{font-family:var(--font-display);font-size:1rem;margin:0 0 8px;}\
      .history-doctrine-card p{color:var(--muted);font-size:.9rem;line-height:1.65;margin:0 0 12px;}\
      .history-doctrine-card button{border:1px solid var(--line-strong);background:var(--surface-2);border-radius:999px;padding:8px 11px;cursor:pointer;color:var(--ink);font-size:.84rem;}\
      .history-doctrine-card button:hover{border-color:var(--ink);background:var(--surface);}\
      @media(max-width:820px){.history-doctrine-grid{grid-template-columns:1fr;}}\
    ";
    document.head.appendChild(style);
  }

  function install() {
    ensureStyles();
    enhanceRelationButtons();
    installDoctrineGuide();
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
