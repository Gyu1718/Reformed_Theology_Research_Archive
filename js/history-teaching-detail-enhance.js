/* History teaching detail enhancer.
   Keeps the existing history card/list structure intact and adds lightweight teaching scaffolding inside detail pages. */
(function () {
  var REFORMATION_TEACHING = {
    "reformation-to-reformed": {
      guide: [
        {
          title: "종교개혁을 하나의 사건으로만 보지 않기",
          body: "1517년 루터의 면죄부 논쟁은 중요한 출발점이지만, 종교개혁 전체는 독일·스위스·제네바·스코틀랜드·네덜란드 등 여러 지역에서 서로 다른 쟁점으로 전개되었다."
        },
        {
          title: "루터파와 개혁파의 공통점과 차이 함께 보기",
          body: "두 전통은 은혜와 복음의 회복이라는 공통 기반을 공유하지만, 성찬론·예배 개혁·교회 질서·권징 이해에서 서로 다른 강조점을 발전시켰다."
        },
        {
          title: "교리와 교회 질서를 분리하지 않기",
          body: "개혁파 전통은 교리 명제를 정리하는 데 그치지 않고, 예배·성례·교육·권징·도시 공동체의 질서를 함께 개혁하려 했다."
        }
      ],
      timeline: [
        {
          year: "1517",
          title: "루터의 95개조 반박문",
          note: "면죄부 논쟁을 계기로 복음, 회개, 교회 권위의 문제가 전면화되었다."
        },
        {
          year: "1520s",
          title: "취리히 종교개혁",
          note: "츠빙글리를 중심으로 성경 설교, 예배 개혁, 성찬 이해의 문제가 부각되었다."
        },
        {
          year: "1536",
          title: "칼빈 『기독교강요』 초판",
          note: "개혁파 신학이 교리교육과 변증의 형태로 체계화되기 시작했다."
        },
        {
          year: "1541 이후",
          title: "제네바 교회 개혁",
          note: "목회, 권징, 교육, 예배 질서가 개혁파 교회론의 실제 무대가 되었다."
        },
        {
          year: "1563",
          title: "하이델베르크 요리문답",
          note: "개혁파 신앙이 위로, 감사, 교리교육의 언어로 정리되었다."
        },
        {
          year: "1566",
          title: "제2스위스 신앙고백",
          note: "스위스 개혁파 전통이 신앙고백적 형태로 넓게 수용되었다."
        }
      ],
      checkpoints: [
        "종교개혁을 루터 한 사람의 사건으로 축소하지 않는다.",
        "개혁파 전통의 특징을 성경 권위, 예배 개혁, 성례 이해, 교회 질서의 결합으로 읽는다.",
        "칼빈의 신학을 단순히 예정론으로 환원하지 않고 교회 개혁 전체의 맥락에서 읽는다.",
        "신앙고백 문헌이 왜 교리교육과 교회 질서 형성에 중요했는지 확인한다."
      ]
    }
  };

  function arr(value) {
    return Array.isArray(value) ? value : [];
  }

  function esc(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function currentHistoryId() {
    var raw = decodeURIComponent((location.hash || "").replace(/^#/, ""));
    var parts = raw.split("=");
    return parts[0] === "history" ? parts[1] : "";
  }

  function historyItems() {
    if (window.__DATA__ && Array.isArray(window.__DATA__.history)) return window.__DATA__.history;
    return [];
  }

  function itemById(id) {
    return historyItems().find(function (item) { return item && item.id === id; });
  }

  function installListButtonText() {
    if (currentHistoryId()) return;
    document.querySelectorAll("[data-history-open]").forEach(function (button) {
      if (button.dataset.historyTeachText === "true") return;
      button.dataset.historyTeachText = "true";
      if (button.textContent.indexOf("역사 항목 열기") >= 0) {
        button.textContent = "역사 배우기 →";
      }
    });
  }

  function makeOverview(h) {
    var issues = arr(h.theologicalIssues).slice(0, 5).map(function (issue) {
      return '<span class="history-teach-pill">' + esc(issue) + '</span>';
    }).join("");

    var questions = arr(h.keyQuestions).slice(0, 2).map(function (question) {
      return '<li>' + esc(question) + '</li>';
    }).join("");

    return '' +
      '<section class="history-section history-study-overview" id="history-study-overview">' +
        '<h4>한눈에 보는 시대</h4>' +
        '<div class="history-study-grid">' +
          '<div class="history-study-card"><span>시대</span><b>' + esc(h.period || "시대 정보 없음") + '</b></div>' +
          '<div class="history-study-card"><span>분류</span><b>' + esc(h.category || "역사 항목") + '</b></div>' +
          '<div class="history-study-card wide"><span>핵심 요약</span><p>' + esc(h.definition || h.summary || "") + '</p></div>' +
        '</div>' +
        (issues ? '<div class="history-teach-pills">' + issues + '</div>' : '') +
        (questions ? '<div class="history-study-question"><b>먼저 붙잡을 질문</b><ul>' + questions + '</ul></div>' : '') +
      '</section>';
  }

  function makeReadingGuide() {
    return '' +
      '<section class="history-section history-reading-guide" id="history-reading-guide">' +
        '<h4>읽는 순서</h4>' +
        '<ol class="history-teach-steps">' +
          '<li><b>정의와 배경</b><span>이 시대가 왜 등장했는지 먼저 봅니다.</span></li>' +
          '<li><b>질문과 인물</b><span>그 시대 사람들이 실제로 씨름한 문제를 확인합니다.</span></li>' +
          '<li><b>문헌과 쟁점</b><span>대표 문헌과 핵심 신학 쟁점을 연결합니다.</span></li>' +
          '<li><b>연결 색인</b><span>관련 교리·책·학자로 이동해 더 깊게 읽습니다.</span></li>' +
        '</ol>' +
      '</section>';
  }

  function makeTeachingGuide(teaching) {
    if (!teaching || !arr(teaching.guide).length) return "";
    var cards = teaching.guide.map(function (item) {
      return '<article class="history-teach-card"><b>' + esc(item.title) + '</b><p>' + esc(item.body) + '</p></article>';
    }).join("");
    return '' +
      '<section class="history-section history-teaching-guide" id="history-teaching-guide">' +
        '<h4>처음 배울 때 붙잡을 것</h4>' +
        '<div class="history-teach-card-grid">' + cards + '</div>' +
      '</section>';
  }

  function makeTimeline(h, teaching) {
    var timeline = teaching && arr(teaching.timeline).length
      ? arr(teaching.timeline)
      : arr(h.keyDocuments).slice(0, 6).map(function (doc) {
          return { year: doc.year || "", title: doc.title || "", note: doc.note || "" };
        });

    if (!timeline.length) return "";
    var rows = timeline.map(function (item) {
      return '<div class="history-teach-time-row">' +
        '<span>' + esc(item.year || "시대") + '</span>' +
        '<b>' + esc(item.title || "사건") + '</b>' +
        '<p>' + esc(item.note || "") + '</p>' +
      '</div>';
    }).join("");

    return '' +
      '<section class="history-section history-teaching-timeline" id="history-teaching-timeline">' +
        '<h4>핵심 사건 흐름</h4>' +
        '<div class="history-teach-timeline">' + rows + '</div>' +
      '</section>';
  }

  function makeCheckpoints(h, teaching) {
    var points = teaching && arr(teaching.checkpoints).length
      ? arr(teaching.checkpoints)
      : arr(h.researchUses).slice(0, 4);

    if (!points.length) return "";
    return '' +
      '<section class="history-section history-learning-checkpoints" id="history-learning-checkpoints">' +
        '<h4>학습 체크포인트</h4>' +
        '<ul class="history-teach-checks">' + points.map(function (point) { return '<li>' + esc(point) + '</li>'; }).join("") + '</ul>' +
      '</section>';
  }

  function stableId(title, index) {
    var source = String(title || "").trim();
    var known = {
      "한눈에 보는 시대": "history-study-overview",
      "읽는 순서": "history-reading-guide",
      "처음 배울 때 붙잡을 것": "history-teaching-guide",
      "핵심 사건 흐름": "history-teaching-timeline",
      "학습 체크포인트": "history-learning-checkpoints",
      "역사적 배경": "history-background",
      "핵심 질문": "history-key-questions",
      "주요 인물": "history-key-figures",
      "주요 문헌": "history-key-documents",
      "핵심 신학 쟁점": "history-theological-issues",
      "연결 색인": "history-relations-index",
      "자주 생기는 오해": "history-misunderstandings",
      "연구 활용": "history-research-uses",
      "인용 위치 메모": "history-quote-pointers",
      "개인 연구 메모": "history-personal-note",
      "학습 흐름": "history-learning-flow"
    };
    return known[source] || ("history-section-" + index);
  }

  function ensureSectionIds(body) {
    var sections = Array.prototype.slice.call(body.children).filter(function (node) {
      return node.classList && node.classList.contains("history-section") && !node.classList.contains("history-page-toc");
    });

    sections.forEach(function (section, index) {
      var title = section.querySelector("h4");
      if (!section.id) section.id = stableId(title ? title.textContent : "", index + 1);
    });
  }

  function sectionSignature(body) {
    var sections = Array.prototype.slice.call(body.children).filter(function (node) {
      return node.classList && node.classList.contains("history-section") && !node.classList.contains("history-page-toc");
    });
    return sections.map(function (section) { return section.id || ""; }).join("|");
  }

  function buildToc(body, signature) {
    var sections = Array.prototype.slice.call(body.children).filter(function (node) {
      return node.classList && node.classList.contains("history-section") && !node.classList.contains("history-page-toc");
    });

    var buttons = sections.map(function (section, index) {
      var title = section.querySelector("h4");
      if (!title || !section.id) return "";
      return '<button type="button" data-history-scroll="' + esc(section.id) + '">' +
        '<span>' + esc(String(index + 1).padStart(2, "0")) + '</span>' + esc(title.textContent) +
      '</button>';
    }).join("");

    return '' +
      '<section class="history-section history-page-toc" data-history-toc-signature="' + esc(signature || "") + '">' +
        '<h4>이 페이지에서 배울 내용</h4>' +
        '<div class="history-page-toc-grid">' + buttons + '</div>' +
      '</section>';
  }

  function bindTocButtons(scope) {
    scope.querySelectorAll("[data-history-scroll]").forEach(function (button) {
      if (button.dataset.historyScrollBound === "true") return;
      button.dataset.historyScrollBound = "true";
      button.onclick = function () {
        var target = document.getElementById(button.getAttribute("data-history-scroll"));
        if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
      };
    });
  }

  function installDetailTeaching() {
    var id = currentHistoryId();
    if (!id) return;

    var h = itemById(id);
    if (!h) return;

    var page = document.querySelector("#view .detail-page");
    var body = page && page.querySelector(".history-detail-body");
    if (!page || !body) return;

    page.classList.add("history-teaching-page");

    var teaching = REFORMATION_TEACHING[id] || null;

    if (!body.querySelector(".history-study-overview")) {
      body.insertAdjacentHTML("afterbegin", makeOverview(h));
    }

    if (!body.querySelector(".history-reading-guide")) {
      var overview = body.querySelector(".history-study-overview");
      if (overview) overview.insertAdjacentHTML("afterend", makeReadingGuide());
    }

    if (teaching && !body.querySelector(".history-teaching-guide")) {
      var readingGuide = body.querySelector(".history-reading-guide");
      if (readingGuide) readingGuide.insertAdjacentHTML("afterend", makeTeachingGuide(teaching));
    }

    if (!body.querySelector(".history-teaching-timeline")) {
      var anchor = body.querySelector(".history-teaching-guide") || body.querySelector(".history-reading-guide");
      if (anchor) anchor.insertAdjacentHTML("afterend", makeTimeline(h, teaching));
    }

    if (!body.querySelector(".history-learning-checkpoints")) {
      var timeline = body.querySelector(".history-teaching-timeline");
      if (timeline) timeline.insertAdjacentHTML("afterend", makeCheckpoints(h, teaching));
    }

    ensureSectionIds(body);

    var tocSignature = sectionSignature(body);
    var toc = body.querySelector(".history-page-toc");
    if (!toc) {
      body.insertAdjacentHTML("afterbegin", buildToc(body, tocSignature));
      toc = body.querySelector(".history-page-toc");
    } else if (toc.dataset.historyTocSignature !== tocSignature) {
      toc.outerHTML = buildToc(body, tocSignature);
      toc = body.querySelector(".history-page-toc");
    }

    if (toc) bindTocButtons(toc);
  }

  function ensureStyles() {
    if (document.querySelector("#history-teaching-detail-styles")) return;
    var style = document.createElement("style");
    style.id = "history-teaching-detail-styles";
    style.textContent = "\
      #view .history-teaching-page .history-page-toc{background:var(--surface);border-color:var(--line-strong);}\
      #view .history-page-toc-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:7px;}\
      #view .history-page-toc-grid button{border:1px solid var(--line);background:var(--surface-2);border-radius:999px;padding:8px 10px;text-align:left;color:var(--muted);cursor:pointer;font-size:.84rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}\
      #view .history-page-toc-grid button:hover{border-color:var(--ink);color:var(--ink);background:var(--surface);}\
      #view .history-page-toc-grid button span{font-family:var(--font-mono);font-size:.68rem;margin-right:6px;color:var(--muted);}\
      #view .history-study-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;}\
      #view .history-study-card{border:1px solid var(--line);border-radius:12px;background:var(--surface);padding:12px;}\
      #view .history-study-card.wide{grid-column:1/-1;}\
      #view .history-study-card span{display:block;font-family:var(--font-mono);font-size:.7rem;letter-spacing:.08em;color:var(--muted);text-transform:uppercase;margin-bottom:5px;}\
      #view .history-study-card b{display:block;font-size:.95rem;line-height:1.45;}\
      #view .history-study-card p{margin:0;color:var(--muted);line-height:1.68;font-size:.92rem;}\
      #view .history-teach-pills{display:flex;flex-wrap:wrap;gap:6px;margin-top:10px;}\
      #view .history-teach-pill{border:1px solid var(--line);border-radius:999px;background:var(--surface);padding:6px 9px;color:var(--muted);font-size:.82rem;}\
      #view .history-study-question{border-top:1px solid var(--line);margin-top:12px;padding-top:12px;}\
      #view .history-study-question b{display:block;margin-bottom:6px;}\
      #view .history-study-question ul{margin:0;padding-left:18px;}\
      #view .history-study-question li{margin:4px 0;color:var(--muted);line-height:1.6;}\
      #view .history-teach-steps{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px;list-style:none;margin:0;padding:0;}\
      #view .history-teach-steps li{border:1px solid var(--line);border-radius:12px;background:var(--surface);padding:11px;}\
      #view .history-teach-steps b{display:block;margin-bottom:5px;font-size:.9rem;}\
      #view .history-teach-steps span{display:block;color:var(--muted);font-size:.84rem;line-height:1.55;}\
      #view .history-teach-card-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:9px;}\
      #view .history-teach-card{border:1px solid var(--line);border-radius:12px;background:var(--surface);padding:13px;}\
      #view .history-teach-card b{display:block;margin-bottom:7px;line-height:1.45;}\
      #view .history-teach-card p{margin:0;color:var(--muted);font-size:.9rem;line-height:1.68;}\
      #view .history-teach-timeline{display:grid;gap:7px;}\
      #view .history-teach-time-row{display:grid;grid-template-columns:96px minmax(150px,.8fr) minmax(0,1.6fr);gap:10px;align-items:start;border:1px solid var(--line);border-radius:10px;background:var(--surface);padding:9px 11px;}\
      #view .history-teach-time-row span{font-family:var(--font-mono);font-size:.78rem;color:var(--muted);}\
      #view .history-teach-time-row b{font-size:.9rem;line-height:1.45;}\
      #view .history-teach-time-row p{margin:0;color:var(--muted);font-size:.86rem;line-height:1.55;}\
      #view .history-teach-checks{margin:0;padding-left:19px;}\
      #view .history-teach-checks li{margin:6px 0;color:var(--muted);line-height:1.68;}\
      @media(max-width:980px){#view .history-page-toc-grid{grid-template-columns:repeat(2,minmax(0,1fr));}#view .history-teach-steps{grid-template-columns:repeat(2,minmax(0,1fr));}#view .history-teach-card-grid{grid-template-columns:1fr;}#view .history-teach-time-row{grid-template-columns:1fr;gap:3px;}}\
      @media(max-width:680px){#view .history-page-toc-grid{grid-template-columns:1fr;}#view .history-study-grid{grid-template-columns:1fr;}#view .history-study-card.wide{grid-column:auto;}#view .history-teach-steps{grid-template-columns:1fr;}#view .history-page-toc-grid button{padding:7px 9px;font-size:.82rem;}}\
    ";
    document.head.appendChild(style);
  }

  function install() {
    ensureStyles();
    installListButtonText();
    installDetailTeaching();
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