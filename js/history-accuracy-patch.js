/* History content accuracy patch
   Runs after history-preload.js and content-accuracy-patch.js, before app.js renders.
   Scope: history-specific wording and stale relation cleanup.
*/
(function () {
  if (!window.__DATA__) return;

  function arr(value) {
    return Array.isArray(value) ? value : [];
  }

  function patchHistory(id, patch) {
    var item = arr(window.__DATA__.history).find(function (entry) { return entry && entry.id === id; });
    if (item) Object.assign(item, patch);
  }

  arr(window.__DATA__.history).forEach(function (item) {
    if (item && Array.isArray(item.relatedPassages)) item.relatedPassages = [];
  });

  patchHistory("reformed-orthodoxy-and-neo-orthodoxy", {
    keyQuestions: [
      "개혁파 정통주의와 신정통주의는 왜 모두 하나님의 말씀을 강조하는가?",
      "두 전통은 성경의 권위와 계시의 관계를 어떻게 다르게 이해하는가?",
      "바르트의 예정론은 도르트와 웨스트민스터 전통과 어떤 점에서 충돌하는가?",
      "바르트 신정통주의를 해석 우선순위로 둘 때 개혁파 정통은 어떤 비교 배경이 되는가?"
    ],
    misunderstandings: [
      "신정통주의를 넣는다고 해서 개혁파 정통과 동일한 전통으로 승인한다는 뜻은 아니다.",
      "비교는 동일화가 아니라 차이를 정밀하게 보기 위한 방법이다.",
      "바르트를 개혁파 정통의 기준으로만 재단하면 신정통주의의 계시 중심 문제의식이 사라지고, 비교 없이 수용하면 두 전통의 차이가 흐려진다."
    ]
  });
})();
