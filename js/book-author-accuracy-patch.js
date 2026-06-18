/* Book and author content accuracy patch
   Runs after book preload/standardization and before app.js renders.
   Scope: Barth-first wording for author cards and book research descriptions.
*/
(function () {
  if (!window.__DATA__) return;

  function arr(value) { return Array.isArray(value) ? value : []; }

  function unique(values) {
    var seen = {};
    return arr(values).filter(function (value) {
      var key = String(value || "").trim();
      if (!key || seen[key]) return false;
      seen[key] = true;
      return true;
    });
  }

  function patchAuthor(id, patch) {
    var author = arr(window.__DATA__.authors).find(function (item) { return item && item.id === id; });
    if (author) Object.assign(author, patch);
  }

  function patchBook(id, patch) {
    var book = arr(window.__DATA__.books).find(function (item) { return item && item.id === id; });
    if (book) Object.assign(book, patch);
  }

  patchAuthor("karl-barth", {
    summary: "바르트 신정통주의의 중심 인물. 『교회교의학』에서 하나님의 말씀, 계시, 삼위일체, 선택, 창조, 화해, 교회의 증언을 예수 그리스도 중심으로 재구성했다.",
    keyTopics: unique(["계시론", "하나님의 말씀", "그리스도 중심 예정론", "자연신학 비판", "화해론", "교회교의학"]),
    majorWorks: ["교회교의학", "로마서 주석", "바르멘 신학선언", "Nein!"]
  });

  patchAuthor("john-calvin", {
    summary: "제네바 종교개혁을 이끌며 개혁신학의 교리적·목회적 질서를 세운 신학자. 이 아카이브에서는 바르트의 계시론·예정론·교회론 재구성을 비교하기 위한 고전적 개혁파 배경으로 읽는다.",
    keyTopics: unique(["하나님 지식", "성경론", "그리스도와의 연합", "예정론", "교회론", "성례론"])
  });

  patchAuthor("herman-bavinck", {
    summary: "개혁파 교의학을 성경, 신앙고백, 교회사, 철학, 근대 사상과의 대화 속에서 유기적으로 종합한 신학자. 바르트와 비교할 때 계시 중심 문제의식은 접하지만 자연·은혜·창조·문화의 관계에서는 더 고전적 개혁파 종합을 보인다.",
    keyTopics: unique(["계시론", "일반계시", "삼위일체", "창조", "은혜", "교회론", "개혁교의학"])
  });

  patchAuthor("louis-berkhof", {
    summary: "개혁파 조직신학을 교육용 표준 구조로 간명하게 정리한 신학자. 바르트의 계시 중심·그리스도 중심 재구성과 비교할 때, 개혁파 정통의 교과서적 배열을 확인하는 기준점 역할을 한다.",
    keyTopics: unique(["조직신학", "신론", "예정론", "구원론", "교회론", "종말론", "개혁파 정통"])
  });

  patchAuthor("emil-brunner", {
    summary: "바르트와 함께 신정통주의의 주요 인물로 분류되지만, 자연신학과 인간 안의 접촉점 문제에서 바르트와 결정적으로 갈라진 신학자. 바르트의 계시론을 선명하게 이해하기 위한 핵심 비교 대상이다.",
    keyTopics: unique(["계시론", "자연신학", "접촉점", "인간론", "변증법적 신학", "신정통주의"])
  });

  patchAuthor("rudolf-bultmann", {
    tradition: "현대신학 / 신정통주의 비교 대상",
    summary: "신약성서 해석과 비신화화 논의로 20세기 신학에 큰 영향을 준 신약학자. 바르트와 같은 자유주의 이후의 문제 지평을 공유하지만, 계시·역사·실존 해석에서는 다른 방향을 보이는 비교 대상이다."
  });

  patchBook("barth-church-dogmatics", {
    summary: "바르트의 『교회교의학』은 하나님의 말씀, 삼위일체, 하나님의 존재와 선택, 창조, 화해, 교회의 증언을 예수 그리스도 안의 하나님의 자기계시에서 전개하는 20세기 개신교 교의학의 중심 문헌이다. 이 아카이브의 신학적 우선 기준으로 사용한다.",
    researchUse: "이 아카이브에서는 『교회교의학』을 단순한 비교 대상이 아니라 해석의 우선축으로 둔다. 칼빈·바빙크·벌코프는 바르트의 계시 중심·그리스도 중심 재구성이 개혁파 정통과 어디서 만나고 갈라지는지 확인하는 비교 배경으로 읽는다."
  });

  patchBook("calvin-institutes", {
    summary: "칼빈의 『기독교 강요』는 창조주 하나님 지식, 구속주 그리스도 지식, 성령을 통한 은혜의 적용, 교회와 성례와 시민 정부를 4권 구조로 배열한 개혁파 신학의 고전 문헌이다.",
    researchUse: "바르트 우선 관점에서 『강요』는 성경 권위, 하나님 지식, 그리스도와의 연합, 예정, 교회와 성례를 둘러싼 고전적 개혁파 질서를 확인하는 비교 배경이다. 특히 바르트의 계시론·예정론·교회론 재구성과 대비해 읽는다."
  });

  patchBook("bavinck-reformed-dogmatics", {
    summary: "바빙크의 『개혁교의학』은 계시와 성경, 하나님과 창조, 죄와 그리스도 안의 구원, 성령과 교회와 새 창조를 유기적으로 배열한 근대 개혁파 교의학의 대표 문헌이다.",
    researchUse: "바르트 우선 관점에서 바빙크는 계시 중심 문제의식을 공유하면서도 일반계시, 자연과 은혜, 창조와 문화의 관계를 더 고전적·유기적 개혁파 방식으로 종합하는 비교 배경이다."
  });

  patchBook("berkhof-systematic-theology", {
    summary: "벌코프의 『조직신학』은 개혁파 교리를 서론, 신론, 인간론, 기독론, 구원론, 교회론, 종말론의 표준 구조로 압축한 대표적 교과서형 조직신학이다.",
    researchUse: "바르트 우선 관점에서 벌코프는 개혁파 정통의 표준 교리 배열을 확인하는 기준점이다. 바르트의 계시 중심·그리스도 중심 재구성이 전통적 조직신학 구조와 어디서 달라지는지 항목별로 비교하기 좋다."
  });
})();
