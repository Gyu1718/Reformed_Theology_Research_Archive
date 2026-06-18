/* Berkhof detailed TOC preloader v1.
   Adds an EPUB-derived section index for Louis Berkhof's Systematic Theology.
   This file stores only structural headings for navigation; it does not embed full copyrighted text. */
(function () {
  var TOC = {
    id: "berkhof-detailed-toc-v1",
    book: "berkhof-systematic-theology",
    sourceBasis: "업로드된 벌코프 『조직신학』 EPUB toc.ncx 기준 연구용 상세 목차입니다. 원문 전문은 포함하지 않습니다.",
    stats: { divisions: 7, parts: 26, units: 81 },
    divisions: [
      { title: "서론", parts: [
        { title: "제1부 교의신학의 개념과 역사", units: ["I 신학의 조직적 제시에 붙여진 명칭", "II 교의의 성격", "III 교의신학의 개념", "IV 교의학의 과제, 방법론 및 분류", "V 교의학의 역사"] },
        { title: "제2부 교의학의 원리", units: ["I 원리 일반", "II 종교", "III 외적 인식의 원리(계시)", "IV 성경의 영감", "V 내적 인식의 원리"] }
      ]},
      { title: "신론", parts: [
        { title: "제1부 하나님의 존재", units: ["I 하나님의 존재", "II 하나님에 관한 인식의 가능성", "III 하나님의 존재와 속성의 관계", "IV 하나님의 이름들", "V 하나님의 속성 개요", "VI 비공유적(非共有的) 속성 (절대 존재로서의 하나님)", "VII 공유적 속성 (인격적인 영으로서의 하나님)", "VIII 성 삼위일체"] },
        { title: "제2부 하나님의 사역", units: ["I 하나님의 작정 개요", "II 예정 (Predestination)", "III 창조 개요", "IV 영적인 세계의 창조", "V 창조에 대한 성경의 설명", "VI 섭리 (Providence)"] }
      ]},
      { title: "인간론", parts: [
        { title: "제1부 원시 상태의 인간", units: ["I 인간의 기원", "II 인간의 구성적 본질", "III 하나님의 형상으로서의 인간", "IV 행위 언약 속에 있는 인간"] },
        { title: "제2부 죄의 상태 안에 있는 인간", units: ["I 죄의 기원", "II 죄의 본질적 특성", "III 죄의 전이", "IV 인류의 삶에 나타난 죄", "V 죄의 형벌"] },
        { title: "제3부 은혜 언약 안에 있는 인간", units: ["I 언약의 명칭과 개념", "II 구속 언약", "III 은혜 언약의 성질", "IV 언약의 이중적 국면", "V 언약의 여러 세대"] }
      ]},
      { title: "기독론", parts: [
        { title: "제1부 그리스도의 위격(位格)", units: ["I 기독론의 역사", "II 그리스도의 명칭과 성질", "III 그리스도의 일위성(一位性) (The Unipersonality of Christ)"] },
        { title: "제2부 그리스도의 신분", units: ["I 비하의 신분 (The State of Humiliation)", "II 승귀의 신분 (The State of Exaltation)"] },
        { title: "제3부 그리스도의 직분", units: ["I 서론 : 선지자직 (The Prophetic Office)", "II 제사장직 (The Priestly Office)", "III 속죄의 원인과 필요성", "IV 속죄의 성질", "V 속죄의 제반 이론들", "VI 속죄의 목적과 범위", "VII 그리스도의 중보 사역", "VIII 왕직 (The Kingly Office)"] }
      ]},
      { title: "구원론", parts: [
        { title: "구원 적용의 질서", units: ["I 구원론 개요", "II 성령의 사역 개관", "III 보통 은혜 (Common Grace)", "IV 신비적 연합", "V 부르심 일반과 외적(外的) 부르심", "VI 중생과 유효한 부르심", "VII 회심 (Conversion)", "VIII 신앙", "IX 칭의", "X 성화", "XI 성도의 견인"] }
      ]},
      { title: "교회론", parts: [
        { title: "제1부 교회에 관한 교리", units: ["서론", "I 성경에 나타난 교회의 명칭과 교회론의 역사적 개요", "II 교회의 성질", "III 교회의 정치", "IV 교회의 권세"] },
        { title: "제2부 은혜의 방편에 관한 교리", units: ["I 은혜의 방편 개요", "II 은혜의 방편으로서의 말씀", "III 성례 개요", "IV 기독교 세례", "V 성찬"] }
      ]},
      { title: "종말론", parts: [
        { title: "개요", units: ["서론"] },
        { title: "제1부 개인적 종말론", units: ["I 육체적 죽음", "II 영혼의 불멸성 (The Immortality of the Soul)", "III 중간 상태"] },
        { title: "제2부 일반적 종말론", units: ["I 그리스도의 재림", "II 천년왕국에 관한 견해들", "III 죽은 자의 부활", "IV 최후의 심판", "V 최후의 상태"] }
      ]}
    ]
  };

  function safeText(text) {
    return String(text || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\"/g, "&quot;");
  }

  function attachDetailedToc(data) {
    if (!data || !Array.isArray(data.books)) return data;
    var book = data.books.find(function (item) { return item && item.id === "berkhof-systematic-theology"; });
    if (book) {
      book.detailedToc = TOC;
      book.edition = book.edition || "『조직신학』 EPUB 상세 목차 연구색인";
      book.researchUse = (book.researchUse || "") + " 실제 EPUB 목차 기준으로 7개 교리 영역, 26개 중간 단위, 81개 세부 단위를 별도 상세 목차로 탐색할 수 있습니다.";
    }
    return data;
  }

  function detailedTocHTML(toc) {
    if (!toc || !Array.isArray(toc.divisions)) return "";
    var stat = toc.stats || {};
    var body = toc.divisions.map(function (division, dIdx) {
      var parts = (division.parts || []).map(function (part) {
        var units = (part.units || []).map(function (unit) {
          return '<li>' + safeText(unit) + '</li>';
        }).join("");
        return '<details class="berkhof-toc-part"><summary>' + safeText(part.title) + '<span>' + (part.units || []).length + '개 단위</span></summary><ol>' + units + '</ol></details>';
      }).join("");
      return '<details class="berkhof-toc-division" ' + (dIdx < 2 ? 'open' : '') + '><summary>' + safeText(division.title) + '</summary>' + parts + '</details>';
    }).join("");
    return '<section class="part berkhof-deep-toc" id="berkhof-detailed-toc"><h4 class="part-h">EPUB 상세 목차 색인</h4><p class="part-sum">벌코프 『조직신학』의 실제 EPUB 목차를 기준으로 대영역 ' + (stat.divisions || 0) + '개, 중간 단위 ' + (stat.parts || 0) + '개, 세부 단위 ' + (stat.units || 0) + '개를 접기/펼치기 색인으로 정리했습니다. 원문 전문은 포함하지 않습니다.</p><div class="berkhof-toc-grid">' + body + '</div></section>';
  }

  function installDetailedTocRenderer() {
    if (window.__BERKHOF_DETAILED_TOC_RENDERER_INSTALLED__) return;
    if (typeof window.render !== "function" || typeof window.bookStructure !== "function") return;
    window.__BERKHOF_DETAILED_TOC_RENDERER_INSTALLED__ = true;

    var style = document.createElement("style");
    style.id = "berkhof-detailed-toc-styles";
    style.textContent = "\n.berkhof-deep-toc{margin-top:30px;border-top:1px solid var(--line);padding-top:24px}.berkhof-toc-grid{display:grid;gap:12px}.berkhof-toc-division{border:1px solid var(--line);border-radius:14px;background:var(--surface-2);padding:10px 12px}.berkhof-toc-division>summary{cursor:pointer;font-family:var(--font-display);font-weight:700}.berkhof-toc-part{margin:10px 0 0;border:1px solid var(--line);border-radius:12px;background:var(--surface);padding:8px 10px}.berkhof-toc-part>summary{cursor:pointer;font-weight:600}.berkhof-toc-part>summary span{float:right;color:var(--muted);font-size:.82rem;font-weight:400}.berkhof-toc-part ol{margin:8px 0 2px;padding-left:22px}.berkhof-toc-part li{margin:5px 0;color:var(--muted);font-size:.91rem}\n";
    document.head.appendChild(style);

    var previousBookStructure = window.bookStructure;
    window.bookStructure = function (book) {
      var base = previousBookStructure ? previousBookStructure(book) : "";
      if (!book || book.id !== "berkhof-systematic-theology" || !book.detailedToc) return base;
      return base + detailedTocHTML(book.detailedToc);
    };

    var previousBookToc = window.bookToc;
    if (typeof previousBookToc === "function") {
      window.bookToc = function (book) {
        var base = previousBookToc(book);
        if (!book || book.id !== "berkhof-systematic-theology" || !book.detailedToc || !base) return base;
        return base.replace("</aside>", '<a href="#berkhof-detailed-toc">EPUB 상세 목차</a></aside>');
      };
    }

    if (typeof window.render === "function") window.render();
  }

  window.__DATA__ = attachDetailedToc(window.__DATA__);
  window.setTimeout(installDetailedTocRenderer, 0);
  window.setTimeout(installDetailedTocRenderer, 50);
  window.setTimeout(installDetailedTocRenderer, 250);
})();
