/* History support-script accuracy patch
   Runs after history-question-explanations, history-overview-enhance, and history-topic-link-enhance.
   Scope: Barth-first wording in helper UI and question explanations.
*/
(function () {
  var didRerender = false;

  function arr(value) { return Array.isArray(value) ? value : []; }

  function currentRoute() {
    var raw = decodeURIComponent((location.hash || "").replace(/^#/, ""));
    var parts = raw.split("=");
    return { type: parts[0] || "", id: parts[1] || "" };
  }

  function replaceQuestion(historyId, matchText, replacement) {
    var store = window.__HISTORY_QUESTION_EXPLANATIONS__;
    var list = store && Array.isArray(store[historyId]) ? store[historyId] : null;
    if (!list) return;
    var item = list.find(function (entry) { return entry && String(entry.question || "").indexOf(matchText) >= 0; });
    if (item) Object.assign(item, replacement);
    else list.push(replacement);
  }

  function patchQuestionExplanations() {
    replaceQuestion("barth-and-neo-orthodoxy", "신정통주의를 개혁신학 연구 아카이브", {
      question: "바르트 신정통주의를 우선순위로 둘 때 개혁파 정통은 어떤 비교 배경이 되는가?",
      answer: "이 아카이브에서 바르트 신정통주의는 단순 부록이나 비교 대상이 아니라 계시 중심·그리스도 중심으로 개혁신학을 다시 읽게 하는 우선 관점이다. 개혁파 정통은 바르트가 성경론, 자연신학, 예정론, 교회론에서 무엇을 계승하고 무엇을 재배열했는지 드러내는 비교 배경이 된다. 따라서 비교 기준은 바르트를 개혁파 정통에 종속시키는 방식이 아니라, 바르트의 문제의식을 먼저 세우고 두 전통의 차이를 정밀하게 드러내는 방식이어야 한다."
    });

    replaceQuestion("reformed-orthodoxy-and-neo-orthodoxy", "개혁신학 연구 아카이브", {
      question: "바르트 신정통주의를 해석 우선순위로 둘 때 개혁파 정통은 어떤 비교 배경이 되는가?",
      answer: "바르트 신정통주의를 우선순위로 둘 때 개혁파 정통은 배제해야 할 낡은 체계가 아니라, 바르트의 전환이 얼마나 급진적인지 보여 주는 비교 배경이 된다. 두 전통은 하나님의 말씀과 자유주의 비판이라는 공통 관심을 공유하지만, 성경과 계시의 관계, 자연신학, 예정론, 신앙고백의 역할에서 다르게 배열된다. 그러므로 이 비교는 개혁파 정통의 기준으로 바르트를 재단하는 작업이 아니라, 바르트의 계시 중심 문제의식을 먼저 세우고 개혁파 정통과의 차이를 읽는 작업이다."
    });
  }

  function patchHistoryData() {
    if (!window.__DATA__ || !Array.isArray(window.__DATA__.history)) return;
    var item = window.__DATA__.history.find(function (entry) { return entry && entry.id === "reformed-orthodoxy-and-neo-orthodoxy"; });
    if (!item) return;
    item.keyQuestions = arr(item.keyQuestions).map(function (question) {
      return String(question || "").indexOf("개혁신학 연구 아카이브") >= 0
        ? "바르트 신정통주의를 해석 우선순위로 둘 때 개혁파 정통은 어떤 비교 배경이 되는가?"
        : question;
    });
  }

  function textOfFlow(flow) {
    var title = flow.querySelector("h4,strong");
    return title ? title.textContent.trim() : "";
  }

  function orderOverviewFlows(container) {
    if (!container) return;
    var order = ["신정통주의 기본 흐름", "주요 논쟁·교리 비교 흐름", "개혁전통 기본 흐름"];
    var nodes = Array.prototype.slice.call(container.children);
    nodes.sort(function (a, b) {
      var ai = order.indexOf(textOfFlow(a));
      var bi = order.indexOf(textOfFlow(b));
      if (ai < 0) ai = order.length;
      if (bi < 0) bi = order.length;
      return ai - bi;
    });
    nodes.forEach(function (node) { container.appendChild(node); });
  }

  function patchOverviewText() {
    document.querySelectorAll(".history-overview-head p").forEach(function (node) {
      node.textContent = "처음 읽는다면 바르트와 신정통주의 기본 흐름을 먼저 보고, 이후 개혁전통과 주요 논쟁 흐름으로 이동하는 순서가 좋습니다.";
    });

    document.querySelectorAll(".history-overview-flow").forEach(function (flow) {
      var title = textOfFlow(flow);
      var paragraph = flow.querySelector("p");
      if (!paragraph) return;
      if (title === "개혁전통 기본 흐름") {
        paragraph.textContent = "바르트와 신정통주의를 읽기 위한 비교 배경으로서 종교개혁, 장로교, 도르트, 웨스트민스터, 정통주의의 기본 골격을 정리합니다.";
      }
      if (title === "신정통주의 기본 흐름") {
        paragraph.textContent = "근대 자유주의 신학의 배경에서 바르트와 신정통주의가 어떻게 등장하고 개혁파 정통과 긴장을 형성했는지 읽는 기본 흐름입니다.";
      }
      if (title === "주요 논쟁·교리 비교 흐름") {
        paragraph.textContent = "자연신학과 예정론처럼 바르트의 계시 중심·그리스도 중심 전환이 개혁파 정통과 가장 선명하게 갈라지는 논쟁형 학습 흐름입니다.";
      }
    });

    document.querySelectorAll(".history-overview-flows").forEach(orderOverviewFlows);
  }

  function install() {
    patchQuestionExplanations();
    patchHistoryData();
    patchOverviewText();
  }

  function rerenderHistoryOnce() {
    var route = currentRoute();
    if (didRerender || route.type !== "history" || typeof render !== "function") return;
    didRerender = true;
    render();
  }

  var view = document.querySelector("#view");
  if (view) {
    var observer = new MutationObserver(function () { install(); });
    observer.observe(view, { childList: true, subtree: true });
  }

  window.addEventListener("hashchange", function () { setTimeout(install, 0); });
  document.addEventListener("DOMContentLoaded", install);
  install();
  setTimeout(function () {
    install();
    rerenderHistoryOnce();
  }, 0);
})();
