/* Complete Barth subtopic coverage.
   Every Barth chapter subtopic receives a distinct summary and note.
   Curated study notes remain authoritative; this layer fills only missing summary/note fields. */
(function () {
  if (!window.__DATA__ || !Array.isArray(window.__DATA__.books)) return;

  function arr(value) { return Array.isArray(value) ? value : []; }
  function clean(text) { return String(text || "").replace(/\s+/g, " ").trim(); }
  function unique(items) {
    var seen = {};
    return arr(items).filter(function (item) {
      var key = clean(item && item.title ? item.title : item);
      if (!key || seen[key]) return false;
      seen[key] = true;
      return true;
    });
  }
  function volumeOf(ref) {
    var match = clean(ref).match(/^CD\s+([IV]+\/\d|IV\/4)/);
    return match ? match[1] : "";
  }
  function volumeFrame(volume) {
    var frames = {
      "I/1": "말씀론과 계시론의 기초를 세우는 자리",
      "I/2": "성육신·성령·성경·교회 선포를 통해 하나님의 말씀이 교회에 주어지는 방식을 해명하는 자리",
      "II/1": "하나님 인식과 하나님의 현실성을 계시의 빛 아래 해명하는 자리",
      "II/2": "예수 그리스도 안에서 선택과 명령을 복음과 윤리의 질서로 배열하는 자리",
      "III/1": "창조를 언약 목적 안에서 읽는 자리",
      "III/2": "인간을 예수 그리스도 안의 참 인간성에서 이해하는 자리",
      "III/3": "섭리와 무, 천사론을 창조주 하나님의 주권 아래 다루는 자리",
      "III/4": "창조주 하나님의 명령이 피조물의 자유와 책임을 형성하는 자리",
      "IV/1": "화해론의 첫 형식, 곧 낮아지신 주님과 칭의를 해명하는 자리",
      "IV/2": "화해론의 둘째 형식, 곧 높아지신 종과 성화를 해명하는 자리",
      "IV/3": "화해론의 셋째 형식, 곧 참된 증인과 교회의 파송을 해명하는 자리",
      "IV/4": "그리스도인의 삶의 기초와 세례 이해를 비교하는 자리"
    };
    return frames[volume] || "바르트 『교회교의학』의 논증 흐름 안에서 읽어야 하는 자리";
  }
  function lensFor(title) {
    var t = clean(title);
    var rules = [
      [/말씀|선포|설교/, "하나님의 자유로운 말하심과 교회의 증언 사이의 질서"],
      [/성경|정경|기록/, "계시의 증언과 교회 선포의 규범 문제"],
      [/계시|신비|성육신|성령/, "하나님이 자신을 알리시는 사건과 인간에게 현실이 되는 방식"],
      [/삼위|성부|성자|아버지|아들/, "계시하시는 하나님과 영원한 하나님을 분리하지 않는 삼위일체적 질서"],
      [/종교|불신앙|참 종교/, "인간의 종교성이 계시 앞에서 심판받고 새롭게 규정되는 문제"],
      [/하나님 지식|인식|숨겨짐|준비/, "하나님 인식의 가능성과 한계를 하나님 자신의 계시에 두는 문제"],
      [/은혜|거룩|자비|의|인내|지혜|완전성/, "하나님의 사랑이 추상 속성이 아니라 살아 있는 완전성으로 나타나는 방식"],
      [/자유|통일성|무소부재|불변성|전능|영원성|영광/, "하나님의 자유가 사랑과 분리되지 않고 피조물과 관계하는 방식"],
      [/선택|예정|이스라엘|교회|약속|버려진/, "예수 그리스도 안에서 선택이 복음으로 재배열되는 방식"],
      [/명령|윤리|요구|결정|판단/, "하나님의 명령이 인간 행위의 신학적 기준이 되는 방식"],
      [/창조|언약|유익|현실화|정당화/, "창조가 언약 목적과 분리되지 않는 신학적 질서"],
      [/인간|예수|영혼|몸|시간|형상|소망/, "예수 그리스도 안에서 참 인간성과 피조성이 해명되는 방식"],
      [/섭리|보존|동행|통치/, "피조 세계가 하나님의 보존과 통치 아래 있음을 고백하는 방식"],
      [/무|악|천사|하늘나라|사자|대적자/, "창조주 하나님의 주권 아래 피조 세계의 위협과 보이지 않는 질서를 다루는 방식"],
      [/거룩한 날|고백|기도|남자|여자|부모|자녀|이웃|생명|소명|명예/, "창조주 하나님의 명령이 일상적 자유와 책임을 구체화하는 방식"],
      [/화해|언약|중보자|은혜/, "예수 그리스도 안에서 하나님과 인간의 깨어진 관계가 회복되는 방식"],
      [/순종|심판|판결|교만|타락|칭의|사면|믿음/, "낮아지신 하나님의 아들 안에서 죄와 칭의가 드러나는 방식"],
      [/높아지심|귀향|왕적|게으름|비참|성화|제자도|회심|사랑/, "높임받은 인자 안에서 인간의 새 삶과 성화가 드러나는 방식"],
      [/공동체|교회|성도|질서|성장|보존/, "성령이 그리스도의 몸을 모으고 세우시는 방식"],
      [/증인|거짓|정죄|소명|파송|소망|승리자|빛/, "참된 증인이신 그리스도와 교회의 증언이 연결되는 방식"],
      [/세례|물 세례|성령 세례/, "하나님의 선행적 은혜와 인간의 응답을 구별해 읽는 방식"]
    ];
    for (var i = 0; i < rules.length; i += 1) if (rules[i][0].test(t)) return rules[i][1];
    return "해당 §의 중심 논지가 구체적 소주제로 전개되는 방식";
  }
  function makeSummary(subtopic, chapter) {
    var title = clean(subtopic.title || subtopic);
    var chapterTitle = clean(chapter.title);
    return "「" + title + "」은 「" + chapterTitle + "」 논의 안에서 " + lensFor(title) + "을 요약하는 소주제입니다.";
  }
  function makeNote(subtopic, chapter) {
    var title = clean(subtopic.title || subtopic);
    var chapterTitle = clean(chapter.title);
    var ref = clean(chapter.ref);
    var volume = volumeOf(ref);
    return ref + "의 「" + chapterTitle + "」에서 이 항목은 " + volumeFrame(volume) + "입니다. 바르트는 「" + title + "」을 단순한 항목명이 아니라, 앞뒤 논증을 연결하며 하나님이 먼저 행하시고 인간이 그 앞에서 응답한다는 교의학적 질서를 드러내는 지점으로 사용합니다.";
  }
  function normalizeSubtopic(item, chapter) {
    var title = clean(item && item.title ? item.title : item);
    if (!title) return null;
    return {
      title: title,
      summary: clean(item && item.summary) || makeSummary(item, chapter),
      note: clean(item && item.note) || makeNote(item, chapter)
    };
  }
  function completeChapter(chapter) {
    if (chapter.curatedSubtopicsApplied) return;
    var existing = {};
    var notes = arr(chapter.subtopicNotes).map(function (item) { return normalizeSubtopic(item, chapter); }).filter(Boolean);
    notes.forEach(function (item) { existing[item.title] = item; });
    unique(chapter.keyPoints).forEach(function (title) {
      title = clean(title && title.title ? title.title : title);
      if (!title || existing[title]) return;
      var generated = normalizeSubtopic({ title: title }, chapter);
      existing[title] = generated;
      notes.push(generated);
    });
    if (!notes.length && chapter.title) notes.push(normalizeSubtopic({ title: chapter.title }, chapter));
    chapter.subtopicNotes = notes;
    if (notes.length) chapter.studyNoteApplied = true;
    chapter.subtopicSearchText = notes.map(function (item) {
      return [item.title, item.summary, item.note].join(" ");
    }).join(" ");
  }
  window.__DATA__.books.forEach(function (book) {
    if (!book || book.id !== "barth-church-dogmatics") return;
    arr(book.parts).forEach(function (part) {
      arr(part.chapters).forEach(completeChapter);
    });
  });
})();
