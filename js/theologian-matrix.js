/* Theologian comparison matrix
   Educational summary only: Calvin, Berkhof, Bavinck, and Barth by major loci. */
(function () {
  function esc(value) {
    return String(value == null ? "" : value).replace(/[&<>"']/g, function (ch) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch];
    });
  }

  var SCHOLARS = [
    { key: "calvin", name: "칼빈", full: "John Calvin", role: "종교개혁 신학의 고전적 원천" },
    { key: "berkhof", name: "벌코프", full: "Louis Berkhof", role: "개혁파 조직신학의 교과서적 정리" },
    { key: "bavinck", name: "바빙크", full: "Herman Bavinck", role: "개혁파 정통과 근대 문제의 유기적 종합" },
    { key: "barth", name: "바르트", full: "Karl Barth", role: "신정통주의의 계시·그리스도 중심 재구성" }
  ];

  var MATRIX = [
    {
      locus: "계시와 성경",
      question: "하나님은 어떻게 알려지는가?",
      calvin: "성경은 하나님 인식의 안경이며, 성령의 내적 증거로 그 권위가 확증됩니다.",
      berkhof: "일반계시와 특별계시를 구분하고, 성경의 영감과 권위를 교리적으로 정리합니다.",
      bavinck: "계시를 창조와 역사 전체의 유기적 질서 안에서 보되, 성경의 규범성을 붙듭니다.",
      barth: "계시는 인간이 소유한 자료가 아니라 예수 그리스도 안에서 일어나는 하나님의 자유로운 자기계시입니다."
    },
    {
      locus: "자연신학",
      question: "그리스도 밖에서 하나님을 알 수 있는가?",
      calvin: "신성의 감각과 창조 세계의 증언을 말하지만, 죄로 인해 참된 하나님 인식은 왜곡됩니다.",
      berkhof: "일반계시는 실제하지만 구원 지식을 주지 못하며 특별계시가 필요합니다.",
      bavinck: "일반계시를 폭넓게 인정하면서도 특별계시와 성경의 완성을 강조합니다.",
      barth: "독립적 자연신학을 거부하고, 참된 하나님 인식은 그리스도 안의 계시에서만 가능하다고 봅니다."
    },
    {
      locus: "신론",
      question: "하나님은 어떤 분인가?",
      calvin: "하나님은 창조주와 구속주로 알려지며, 경건한 하나님 인식은 예배와 순종으로 이어집니다.",
      berkhof: "하나님의 존재, 속성, 삼위일체를 고전적 조직신학의 항목으로 명료하게 배열합니다.",
      bavinck: "하나님의 불가해성과 참된 계시 가능성을 함께 붙들며 속성론을 풍성하게 전개합니다.",
      barth: "하나님은 사랑 안에서 자유롭고 자유 안에서 사랑하시는 분이며, 예수 그리스도 안에서 자신을 알리십니다."
    },
    {
      locus: "예정론",
      question: "선택은 어디에서 보아야 하는가?",
      calvin: "예정은 신자를 겸손과 확신으로 이끄는 하나님의 은혜로운 작정입니다.",
      berkhof: "선택과 유기를 하나님의 영원한 작정 안에서 체계적으로 설명합니다.",
      bavinck: "예정의 신비와 복음의 위로를 함께 붙들며 사변을 경계합니다.",
      barth: "예수 그리스도가 선택하시는 하나님이자 선택받은 인간입니다. 예정론은 그리스도 안의 복음으로 재배열됩니다."
    },
    {
      locus: "인간과 죄",
      question: "인간은 누구이며 죄는 무엇인가?",
      calvin: "인간은 하나님의 형상으로 창조되었지만 타락으로 전적으로 부패했습니다.",
      berkhof: "하나님의 형상, 원죄, 죄책과 부패를 교리적으로 구분하여 정리합니다.",
      bavinck: "인간의 존엄과 비참을 창조와 타락의 큰 질서 안에서 유기적으로 설명합니다.",
      barth: "참 인간은 예수 그리스도 안에서 드러나며, 죄는 화해를 거부하는 인간의 교만과 불신입니다."
    },
    {
      locus: "기독론",
      question: "그리스도는 교리 전체에서 어떤 위치를 갖는가?",
      calvin: "그리스도는 선지자, 왕, 제사장으로서 중보 사역을 이루십니다.",
      berkhof: "그리스도의 인격과 신분, 삼중직과 속죄 사역을 구분하여 설명합니다.",
      bavinck: "성육신과 중보 사역을 삼위일체와 언약, 구속사의 중심에서 통합합니다.",
      barth: "그리스도는 계시, 선택, 화해, 참 인간 이해의 중심입니다. 교리 전체가 그리스도 안에서 다시 배열됩니다."
    },
    {
      locus: "칭의와 구원",
      question: "죄인은 어떻게 의롭다 하심을 받는가?",
      calvin: "믿음으로 그리스도와 연합한 신자는 값없이 의롭다 하심을 받고 새 삶으로 부름받습니다.",
      berkhof: "소명, 중생, 회심, 믿음, 칭의, 성화 등 구원의 서정을 질서 있게 정리합니다.",
      bavinck: "구원의 적용을 그리스도와의 연합, 성령의 사역, 언약의 맥락에서 풍성하게 설명합니다.",
      barth: "칭의와 성화는 예수 그리스도 안에서 일어난 화해의 서로 다른 형식입니다."
    },
    {
      locus: "교회론",
      question: "교회는 무엇을 위해 존재하는가?",
      calvin: "교회는 말씀과 성례로 신자를 낳고 기르는 어머니입니다.",
      berkhof: "교회의 본질, 표지, 직분, 권징, 은혜의 방편을 조직적으로 정리합니다.",
      bavinck: "교회는 그리스도의 몸이며, 제도와 유기체의 성격을 함께 지닙니다.",
      barth: "교회는 예수 그리스도를 증언하도록 부름받고 세상으로 파송된 공동체입니다."
    },
    {
      locus: "성례론",
      question: "세례와 성찬은 무엇을 하는가?",
      calvin: "성례는 하나님의 약속을 보이고 인치는 표이며, 성령의 사역 안에서 믿음을 확증합니다.",
      berkhof: "성례를 은혜의 방편으로 정리하고 세례와 성찬의 표지 기능을 설명합니다.",
      bavinck: "성례를 말씀, 언약, 교회 공동체와 연결하여 이해합니다.",
      barth: "특히 세례를 은혜의 자동 전달보다 성령의 세례에 응답하는 인간의 순종으로 강조합니다."
    },
    {
      locus: "종말론",
      question: "기독교의 소망은 무엇인가?",
      calvin: "신자는 부활과 최종 완성을 바라보며 현재의 고난을 견딥니다.",
      berkhof: "죽음, 중간상태, 재림, 부활, 심판, 최종 상태를 교리적으로 배열합니다.",
      bavinck: "새 창조와 하나님 나라의 완성을 창조와 구속의 완성으로 설명합니다.",
      barth: "종말은 예수 그리스도의 부활 안에서 열린 하나님의 미래이며, 교회는 그것을 소유하지 않고 증언합니다."
    }
  ];

  function ensureStyles() {
    if (document.querySelector("#matrix-page-styles")) return;
    var style = document.createElement("style");
    style.id = "matrix-page-styles";
    style.textContent = "\
      .matrix-wrap{margin-top:24px;}\
      .matrix-intro{background:var(--surface);border:1px solid var(--line);border-radius:var(--radius);padding:22px 26px;background-image:linear-gradient(90deg,var(--ref-soft),transparent 42%,var(--neo-soft));}\
      .matrix-intro h3{font-family:var(--font-display);font-size:1.44rem;margin:6px 0 8px;}\
      .matrix-intro p{margin:0;color:var(--muted);max-width:930px;}\
      .scholar-row{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px;margin-top:18px;}\
      .scholar-card{background:var(--surface);border:1px solid var(--line);border-radius:14px;padding:15px 16px;}\
      .scholar-card.barth{border-color:rgba(140,47,34,.45);box-shadow:0 0 0 3px rgba(140,47,34,.055);}\
      .scholar-card b{display:block;font-family:var(--font-display);font-size:1.04rem;}\
      .scholar-card span{display:block;font-family:var(--font-mono);font-size:.7rem;color:var(--faint);margin-top:2px;}\
      .scholar-card p{margin:8px 0 0;color:var(--muted);font-size:.88rem;}\
      .matrix-table-wrap{margin-top:18px;overflow:auto;border:1px solid var(--line);border-radius:var(--radius);background:var(--surface);}\
      .matrix-table{width:100%;border-collapse:collapse;min-width:980px;}\
      .matrix-table th,.matrix-table td{vertical-align:top;text-align:left;border-bottom:1px solid var(--line);border-right:1px solid var(--line);padding:13px 14px;font-size:.9rem;}\
      .matrix-table th{position:sticky;top:0;background:var(--surface-2);font-family:var(--font-mono);font-size:.72rem;letter-spacing:.08em;text-transform:uppercase;color:var(--muted);z-index:1;}\
      .matrix-table th:last-child,.matrix-table td:last-child{border-right:none;}\
      .matrix-table tr:last-child td{border-bottom:none;}\
      .matrix-locus b{display:block;font-family:var(--font-display);font-size:1rem;margin-bottom:5px;}\
      .matrix-locus span{display:block;color:var(--muted);font-size:.84rem;}\
      .matrix-table td{color:var(--muted);line-height:1.65;}\
      .matrix-table td.barth-cell{color:var(--ink);background:rgba(240,226,223,.36);}\
      @media(max-width:900px){.scholar-row{grid-template-columns:1fr 1fr;}}\
      @media(max-width:620px){.scholar-row{grid-template-columns:1fr;}}\
    ";
    document.head.appendChild(style);
  }

  function textPool(row) {
    return [row.locus, row.question, row.calvin, row.berkhof, row.bavinck, row.barth].join(" ");
  }

  function matchQuery(text) {
    if (typeof state === "undefined" || !state.q) return true;
    return text.toLowerCase().indexOf(state.q.toLowerCase()) !== -1;
  }

  function renderScholar(card) {
    var cls = card.key === "barth" ? "scholar-card barth" : "scholar-card";
    return '<article class="' + cls + '"><b>' + esc(card.name) + '</b><span>' + esc(card.full) + '</span><p>' + esc(card.role) + '</p></article>';
  }

  function renderRow(row) {
    return '<tr>' +
      '<td class="matrix-locus"><b>' + esc(row.locus) + '</b><span>' + esc(row.question) + '</span></td>' +
      '<td>' + esc(row.calvin) + '</td>' +
      '<td>' + esc(row.berkhof) + '</td>' +
      '<td>' + esc(row.bavinck) + '</td>' +
      '<td class="barth-cell">' + esc(row.barth) + '</td>' +
    '</tr>';
  }

  function renderMatrix() {
    ensureStyles();
    var rows = MATRIX.filter(function (row) { return matchQuery(textPool(row)); });
    var body = rows.length ? rows.map(renderRow).join("") : '<tr><td colspan="5">검색 조건에 맞는 비교 항목이 없습니다.</td></tr>';
    view.innerHTML = '<section class="matrix-wrap">' +
      '<div class="matrix-intro">' +
        '<span class="loci-label">THEOLOGIAN MATRIX</span>' +
        '<h3>칼빈 · 벌코프 · 바빙크 · 바르트 핵심 차이 표</h3>' +
        '<p>개혁파 정통의 흐름과 바르트의 신정통주의적 재구성을 주요 교리별로 나란히 비교합니다. 이 표는 입문자가 네 신학자의 차이를 한눈에 파악하도록 만든 학습용 요약입니다.</p>' +
      '</div>' +
      '<div class="scholar-row">' + SCHOLARS.map(renderScholar).join("") + '</div>' +
      '<div class="matrix-table-wrap"><table class="matrix-table">' +
        '<thead><tr><th>교리 주제</th><th>칼빈</th><th>벌코프</th><th>바빙크</th><th>바르트</th></tr></thead>' +
        '<tbody>' + body + '</tbody>' +
      '</table></div>' +
    '</section>';
  }

  function installTab() {
    var tabs = document.querySelector(".tabs");
    if (!tabs || document.querySelector('[data-view="matrix"]')) return;
    var button = document.createElement("button");
    button.className = "tab";
    button.dataset.view = "matrix";
    button.innerHTML = '학자 비교표<span class="lat">Matrix</span>';
    var books = document.querySelector('[data-view="books"]');
    if (books) tabs.insertBefore(button, books);
    else tabs.appendChild(button);
    button.onclick = function () {
      document.querySelectorAll(".tab").forEach(function (tab) { tab.classList.remove("is-active"); });
      button.classList.add("is-active");
      state.view = "matrix";
      clearRoute(state.view);
    };
  }

  function appendCount() {
    var bar = document.querySelector("#countbar");
    if (!bar || bar.querySelector(".matrix-count")) return;
    bar.insertAdjacentHTML("beforeend", '<span class="sep matrix-count">·</span><b class="matrix-count">' + MATRIX.length + '</b><span class="matrix-count"> 학자비교</span>');
  }

  if (typeof VIEWS !== "undefined") VIEWS.matrix = renderMatrix;
  installTab();
  appendCount();
}());
