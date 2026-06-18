/* Bavinck preloader v2.
   Loads Herman Bavinck's Reformed Dogmatics Outline with chapter profiles before app.js renders.
   This keeps the archive at the same data depth as the Barth and Berkhof book work without embedding full copyrighted text. */
(function () {
  function loadJson(path, fallback) {
    try {
      var xhr = new XMLHttpRequest();
      xhr.open("GET", path, false);
      xhr.send(null);
      if (xhr.status >= 200 && xhr.status < 300) return JSON.parse(xhr.responseText);
    } catch (error) {
      console.warn(path + " was not preloaded.", error);
    }
    return fallback;
  }

  function uniq(values) {
    var seen = {};
    return (values || []).filter(function (value) {
      if (!value || seen[value]) return false;
      seen[value] = true;
      return true;
    });
  }

  function profileMap(profiles) {
    var map = {};
    (profiles && profiles.chapters || []).forEach(function (item) {
      if (item && item.ref) map[item.ref] = item;
    });
    return map;
  }

  function defaultSubtopicExplanations(title, subtopics) {
    return (subtopics || []).map(function (item) {
      return item + "은(는) ‘" + title + "’ 장을 실제 학습 단위로 나눈 항목입니다. 이 소주제는 바빙크의 유기적 개혁파 신학 안에서 무엇을 구별하고 무엇을 연결해야 하는지 보여 줍니다.";
    });
  }

  function defaultSubtopicQuestions(subtopics) {
    return (subtopics || []).map(function (item) {
      return item + "을 통해 이 장에서 반드시 붙들어야 할 교리적 기준은 무엇인가?";
    });
  }

  function chapterFromString(raw, partTitle, profiles) {
    var m = String(raw).match(/^([IVX]+\.\d+)\s+(.+)$/);
    var ref = m ? m[1] : String(raw);
    var title = m ? m[2] : String(raw);
    var profile = profiles[ref] || {};
    var subtopics = profile.subtopics || [];
    var concepts = profile.concepts || ["개혁파 정통", "개혁교의학", "유기적 신학"];
    if (/계시|성경|신앙고백/.test(title)) concepts = concepts.concat(["계시론", "성경론"]);
    if (/하나님|삼위일체/.test(title)) concepts = concepts.concat(["신론", "삼위일체"]);
    if (/창조|섭리|사람|인간/.test(title)) concepts = concepts.concat(["창조론", "인간론"]);
    if (/죄|언약|중보자|그리스도/.test(title)) concepts = concepts.concat(["죄론", "기독론", "구속론"]);
    if (/성령|소명|칭의|성화/.test(title)) concepts = concepts.concat(["구원론", "성령론"]);
    if (/교회/.test(title)) concepts = concepts.concat(["교회론"]);
    if (/영생/.test(title)) concepts = concepts.concat(["종말론"]);
    return {
      ref: ref,
      title: title,
      summary: profile.summary || ("바빙크는 『개혁교의학 개요』 " + ref + "에서 ‘" + title + "’을 개혁파 교의학의 질서 안에서 다룹니다."),
      detail: profile.detail || ("이 장은 " + partTitle + "에 속합니다. 바빙크의 특징은 성경적 계시와 개혁파 고백, 교회사적 전통, 철학적 사유를 분리하지 않고 유기적으로 종합한다는 데 있습니다. 칼빈·벌코프·바르트와 비교할 때 이 항목은 개혁파 정통의 신학적 균형을 확인하는 기준점이 됩니다."),
      subtopics: subtopics,
      subtopicExplanations: profile.subtopicExplanations || defaultSubtopicExplanations(title, subtopics),
      subtopicOverview: profile.subtopicOverview || (subtopics.length ? "이 장의 소주제들은 ‘" + title + "’을 단순한 장 제목이 아니라 학습 경로로 읽게 하기 위해 배열되어 있습니다." : ""),
      subtopicQuestions: profile.subtopicQuestions || defaultSubtopicQuestions(subtopics),
      keyPoints: profile.keyPoints || ["성경적 계시", "개혁파 고백 전통", "유기적 교의학", "근대 신학과의 비판적 대화"],
      concepts: uniq(concepts)
    };
  }

  function buildBavinckBook(map, profiles) {
    if (!map || !Array.isArray(map.parts)) return null;
    return {
      id: "bavinck-reformed-dogmatics",
      title: "개혁교의학 개요",
      author: "헤르만 바빙크",
      originalAuthor: "Herman Bavinck",
      tradition: "개혁파 정통",
      traditionKey: "ref",
      category: "Reformed Dogmatics / Systematic Theology",
      language: "Korean",
      summary: "바빙크의 『개혁교의학 개요』는 인간의 최고선에서 출발해 계시와 성경, 하나님과 창조, 죄와 그리스도, 성령과 교회와 영생까지 개혁파 교의학의 핵심 흐름을 압축적으로 제시합니다.",
      researchUse: "칼빈과 비교하면 바빙크는 종교개혁의 교리 구조를 더 넓은 계시론·언약론·교회론의 유기적 질서로 압축합니다. 벌코프와 비교하면 더 교과서적으로 세분화되기보다 교리의 큰 흐름을 개요형으로 보여 주며, 바르트와 비교하면 계시 중심성의 접점과 일반 계시·창조·고백 전통의 차이를 함께 확인하기 좋습니다.",
      topics: ["계시론", "성경론", "신론", "삼위일체", "창조론", "인간론", "죄론", "언약신학", "기독론", "구원론", "교회론", "종말론"],
      authorsMentioned: ["John Calvin", "Louis Berkhof", "Augustine", "Thomas Aquinas", "Karl Barth"],
      edition: "『개혁교의학 개요』 24장 구조 한국어 연구색인",
      parts: map.parts.map(function (part) {
        return {
          title: part.title,
          summary: part.summary,
          chapters: (part.chapters || []).map(function (chapter) { return chapterFromString(chapter, part.title, profiles); })
        };
      })
    };
  }

  function upsertBook(data, book) {
    if (!data || !Array.isArray(data.books) || !book) return data;
    var replaced = false;
    data.books = data.books.map(function (item) {
      if (item && item.id === book.id) {
        replaced = true;
        return book;
      }
      return item;
    });
    if (!replaced) data.books.push(book);
    return data;
  }

  var map = loadJson("./data/books-bavinck-structure-map.json", null);
  var profiles = profileMap(loadJson("./data/books/bavinck-chapter-profiles.json", null));
  var book = buildBavinckBook(map, profiles);
  window.__DATA__ = upsertBook(window.__DATA__, book);
})();
