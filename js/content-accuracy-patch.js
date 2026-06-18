/* Content accuracy patch
   Upload path: js/content-accuracy-patch.js
   Runs after preload/enrichment scripts and before app.js renders.
   Scope: correct content-level wording that may cause theological or historical misunderstanding.
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
    diverge: "계시를 성경에 기록되고 성령이 조명하는 하나님의 규범적 말씀으로 보느냐, 예수 그리스도 안에서 일어나는 하나님의 자유로운 자기계시 사건으로 보느냐."
  });

  patchTopic("natural-theology", {
    summary: "창조 세계, 인간 이성, 양심을 통해 하나님에 대해 무엇을 알 수 있는지, 그리고 그것이 신학의 인식 원리로 기능할 수 있는지를 다루는 주제.",
    diverge: "일반계시와 자연적 하나님 지식이 실제로 존재하지만 죄 아래 제한되어 특별계시의 규범을 필요로 하느냐, 혹은 그리스도 밖의 독립적 자연신학 자체가 신학적으로 불가능하다고 보느냐."
  });

  patchHistory("synod-of-dort", {
    relatedPassages: []
  });
})();
