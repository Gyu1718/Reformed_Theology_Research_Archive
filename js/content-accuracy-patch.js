/* Content accuracy patch
   Upload path: js/content-accuracy-patch.js
   Runs after preload/enrichment scripts and before app.js renders.
   Scope: correct content-level wording that may cause theological or historical misunderstanding.
   Theological priority: Barth's neo-orthodox, revelation-centered and Christ-centered dogmatics.
*/
(function () {
  if (!window.__DATA__) return;

  function arr(value) {
    return Array.isArray(value) ? value : [];
  }

  function findBook(id) {
    return arr(window.__DATA__.books).find(function (book) { return book && book.id === id; });
  }

  function findChapter(book, ref) {
    var parts = arr(book && book.parts);
    for (var i = 0; i < parts.length; i += 1) {
      var chapter = arr(parts[i].chapters).find(function (item) { return item && item.ref === ref; });
      if (chapter) return chapter;
    }
    return null;
  }

  function unique(items) {
    var seen = {};
    return arr(items).filter(function (item) {
      var key = String(item || "").trim();
      if (!key || seen[key]) return false;
      seen[key] = true;
      return true;
    });
  }

  function replaceInArray(items, fromValue, toValue) {
    return unique(arr(items).map(function (item) {
      return item === fromValue ? toValue : item;
    }));
  }

  function replaceText(value, replacements) {
    var text = String(value || "");
    replacements.forEach(function (pair) {
      text = text.split(pair[0]).join(pair[1]);
    });
    return text;
  }

  function patchTopic(id, patch) {
    var topic = arr(window.__DATA__.topics).find(function (item) { return item && item.id === id; });
    if (topic) Object.assign(topic, patch);
  }

  function patchTopicPosition(topicId, holder, patch) {
    var topic = arr(window.__DATA__.topics).find(function (item) { return item && item.id === topicId; });
    if (!topic) return;
    var position = arr(topic.positions).find(function (item) { return item && item.holder === holder; });
    if (position) Object.assign(position, patch);
  }

  function addTopicReference(topicId, reference) {
    var topic = arr(window.__DATA__.topics).find(function (item) { return item && item.id === topicId; });
    if (!topic) return;
    topic.references = arr(topic.references);
    var exists = topic.references.some(function (item) {
      return item && item.bookId === reference.bookId && item.location === reference.location;
    });
    if (!exists) topic.references.unshift(reference);
  }

  function patchHistory(id, patch) {
    var item = arr(window.__DATA__.history).find(function (entry) { return entry && entry.id === id; });
    if (item) Object.assign(item, patch);
  }

  var calvin = findBook("calvin-institutes");
  var calvinI1 = findChapter(calvin, "I.1");
  if (calvinI1) {
    calvinI1.title = "하나님 지식과 자기 지식의 관계";
    calvinI1.concepts = replaceInArray(calvinI1.concepts, "신지식(duplex cognitio Dei)", "하나님 지식과 자기 지식");
    calvinI1.concepts = replaceInArray(calvinI1.concepts, "신지식", "하나님 지식");
    calvinI1.summary = replaceText(calvinI1.summary, [["신지식", "하나님 지식"], ["자기지식", "자기 지식"]]);
    calvinI1.detail = replaceText(calvinI1.detail, [["신지식", "하나님 지식"], ["자기지식", "자기 지식"]]);
    calvinI1.chapterFunction = "『강요』 전체의 문을 여는 인식론적 출발점이다. 칼빈은 하나님 지식과 자기 지식을 두 개의 독립 과목으로 나누지 않고, 하나님 앞에서 인간이 자신을 바로 아는 구조로 신학을 시작한다.";
    calvinI1.keyPoints = arr(calvinI1.keyPoints).map(function (point) {
      return replaceText(point, [["신지식", "하나님 지식"], ["자기지식", "자기 지식"]]);
    });
    arr(calvinI1.subtopics).forEach(function (subtopic) {
      ["title", "summary", "displaySummary", "explanation", "note", "keyQuestion", "question", "doctrinalFunction", "argumentRole", "reformedContrast", "caution"].forEach(function (key) {
        if (subtopic[key]) subtopic[key] = replaceText(subtopic[key], [["신지식", "하나님 지식"], ["자기지식", "자기 지식"]]);
      });
    });
  }

  var calvinI3 = findChapter(calvin, "I.3");
  if (calvinI3) {
    calvinI3.concepts = replaceInArray(calvinI3.concepts, "자연신학", "자연적 하나님 지식");
    calvinI3.chapterFunction = "일반계시 논의의 출발점이다. 칼빈은 인간 안에 하나님 인식의 흔적이 있다는 점을 인정하면서도, 그것이 곧 구원 지식이나 독립적 자연신학으로 이어지지 않는다는 긴장을 세운다.";
  }

  patchTopic("revelation", {
    diverge: "바르트의 신정통주의는 계시를 예수 그리스도 안에서 일어나는 하나님의 자유로운 자기계시 사건으로 우선 이해한다. 이에 비해 개혁파 정통은 성경에 기록되고 성령이 조명하는 하나님의 규범적 말씀을 계시 인식의 표준으로 강조한다."
  });

  patchTopic("scripture", {
    diverge: "바르트는 성경을 계시 자체와 단순 동일시하지 않고 하나님의 계시를 증언하도록 선택된 정경적 증언으로 이해한다. 이에 비해 개혁파 정통은 성경을 영감된 하나님의 말씀으로서 신앙과 신학의 최종 규범으로 고백한다."
  });

  patchTopic("theological-method", {
    diverge: "바르트에게 교의학은 교회 선포가 하나님의 말씀 앞에서 받는 계속적 자기검토다. 이에 비해 개혁파 정통은 성경 계시의 규범 아래 교회의 신앙고백과 교리 체계를 질서 있게 정리하는 작업으로 신학을 전개한다."
  });

  patchTopic("natural-theology", {
    summary: "창조 세계, 인간 이성, 양심을 통해 하나님에 대해 무엇을 알 수 있는지, 그리고 그것이 신학의 인식 원리로 기능할 수 있는지를 다루는 주제.",
    diverge: "바르트는 그리스도 밖의 독립적 자연신학과 인간 안의 자율적 접촉점을 거부한다. 이에 비해 개혁파 정통은 일반계시와 자연적 하나님 지식의 실재를 인정하되, 죄 아래 제한되어 특별계시의 규범을 필요로 한다고 본다."
  });

  patchTopic("doctrine-of-god", {
    diverge: "바르트는 하나님이 자신을 계시하시는 행위 안에서 하나님의 존재를 말하며, 하나님을 사랑 안에서 자유롭고 자유 안에서 사랑하시는 분으로 해명한다. 이에 비해 개혁파 정통은 하나님의 이름과 속성을 성경 계시와 교의학적 질서 안에서 배열한다."
  });
  addTopicReference("doctrine-of-god", {
    bookId: "calvin-institutes",
    location: "제1권 I.10–18",
    note: "참 하나님, 삼위일체, 창조, 섭리를 통해 창조주 하나님 지식을 다룬다."
  });

  patchTopic("trinity", {
    diverge: "바르트는 삼위일체론을 계시론의 내적 문법으로 전면에 세우며, 하나님이 자신을 계시하시는 방식 자체에서 삼위일체를 말한다. 이에 비해 개혁파 정통은 한 본질과 세 위격의 교리를 신론 안에서 성경적으로 정식화한다."
  });
  patchTopicPosition("trinity", "바르트", {
    claim: "하나님은 자신을 계시하실 때 계시하시는 분, 계시, 계시의 현실성 안에서 자신을 드러내신다. 삼위일체는 계시의 사후 설명이 아니라 계시가 하나님 자신이라는 사실의 문법이다."
  });

  patchTopic("predestination", {
    diverge: "바르트는 선택을 예수 그리스도라는 한 인격 안의 하나님의 자기결정으로 이해한다. 이에 비해 개혁파 정통은 선택을 하나님의 영원한 작정과 은혜의 질서 안에서 설명한다."
  });
  patchTopicPosition("predestination", "칼빈", {
    claim: "칼빈은 예정론을 호기심의 사변이 아니라 구원의 은혜와 확신을 위한 교리로 다루며, 선택과 유기를 하나님의 영원한 작정 안에서 설명한다."
  });

  patchHistory("synod-of-dort", {
    relatedPassages: []
  });
})();
