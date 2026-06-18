/* Berkhof detailed TOC preloader v2.
   Loads an uploaded-English-EPUB-derived section index for Louis Berkhof's Systematic Theology.
   This file renders structural headings only; it does not embed full copyrighted text. */
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

  function safeText(text) {
    return String(text || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\"/g, "&quot;");
  }

  function attachDetailedToc(data, toc) {
    if (!data || !Array.isArray(data.books) || !toc) return data;
    var book = data.books.find(function (item) { return item && item.id === "berkhof-systematic-theology"; });
    if (!book) return data;
    var stats = toc.stats || {};
    book.detailedToc = toc;
    book.edition = "영어판 『Systematic Theology』 EPUB 상세 목차 연구색인";
    book.summary = book.summary || "벌코프의 『Systematic Theology』는 개혁파 조직신학의 표준 교과서입니다.";
    var note = " 업로드된 영어 EPUB 목차 기준으로 " + (stats.divisions || 0) + "개 교리 영역, " + (stats.sections || 0) + "개 중간 단위, " + (stats.chapters || 0) + "개 장, " + (stats.subheads || 0) + "개 A/B/C급 세부 표제를 별도 상세 목차로 탐색할 수 있습니다.";
    if (!book.researchUse || book.researchUse.indexOf("업로드된 영어 EPUB 목차 기준") === -1) {
      book.researchUse = (book.researchUse || "") + note;
    }
    return data;
  }

  function chapterHTML(chapter) {
    var subheads = Array.isArray(chapter.subheads) ? chapter.subheads : [];
    var items = subheads.map(function (subhead) { return '<li>' + safeText(subhead) + '</li>'; }).join("");
    var count = subheads.length ? '<span>' + subheads.length + '개 세부 표제</span>' : '';
    return '<details class="berkhof-toc-chapter"><summary><b>' + safeText(chapter.title) + '</b>' + count + '</summary>' +
      (items ? '<ol>' + items + '</ol>' : '') +
      (chapter.src ? '<p class="berkhof-toc-src">EPUB file: ' + safeText(chapter.src) + '</p>' : '') +
      '</details>';
  }

  function sectionHTML(section) {
    var chapters = Array.isArray(section.chapters) ? section.chapters : [];
    var chapterList = chapters.map(chapterHTML).join("");
    var label = section.titleKo ? '<span class="berkhof-toc-ko">' + safeText(section.titleKo) + '</span>' : '';
    return '<details class="berkhof-toc-section"><summary>' + label + safeText(section.title) + '<span>' + chapters.length + '개 장</span></summary>' + chapterList + '</details>';
  }

  function detailedTocHTML(toc) {
    if (!toc || !Array.isArray(toc.divisions)) return "";
    var stat = toc.stats || {};
    var body = toc.divisions.map(function (division, dIdx) {
      var sections = (division.sections || []).map(sectionHTML).join("");
      var ko = division.titleKo ? '<span class="berkhof-toc-ko">' + safeText(division.titleKo) + '</span>' : '';
      return '<details class="berkhof-toc-division" ' + (dIdx < 2 ? 'open' : '') + '><summary>' + ko + safeText(division.title) + '</summary>' + sections + '</details>';
    }).join("");
    return '<section class="part berkhof-deep-toc" id="berkhof-detailed-toc">' +
      '<h4 class="part-h">EPUB 상세 목차 색인</h4>' +
      '<p class="part-sum">업로드된 영어판 벌코프 『Systematic Theology』 EPUB 목차를 기준으로 대영역 ' + (stat.divisions || 0) + '개, 중간 단위 ' + (stat.sections || 0) + '개, 장 ' + (stat.chapters || 0) + '개, A/B/C급 세부 표제 ' + (stat.subheads || 0) + '개를 접기/펼치기 색인으로 정리했습니다. 원문 전문은 포함하지 않습니다.</p>' +
      '<div class="berkhof-toc-grid">' + body + '</div>' +
      '</section>';
  }

  function installDetailedTocRenderer() {
    if (window.__BERKHOF_DETAILED_TOC_RENDERER_INSTALLED__) return;
    if (typeof window.render !== "function" || typeof window.bookStructure !== "function") return;
    window.__BERKHOF_DETAILED_TOC_RENDERER_INSTALLED__ = true;

    var style = document.createElement("style");
    style.id = "berkhof-detailed-toc-styles";
    style.textContent = "\n.berkhof-deep-toc{margin-top:30px;border-top:1px solid var(--line);padding-top:24px}.berkhof-toc-grid{display:grid;gap:12px}.berkhof-toc-division{border:1px solid var(--line);border-radius:14px;background:var(--surface-2);padding:10px 12px}.berkhof-toc-division>summary{cursor:pointer;font-family:var(--font-display);font-weight:700}.berkhof-toc-ko{display:block;color:var(--muted);font-size:.82rem;font-weight:500;margin-bottom:2px}.berkhof-toc-section{margin:10px 0 0;border:1px solid var(--line);border-radius:12px;background:var(--surface);padding:8px 10px}.berkhof-toc-section>summary{cursor:pointer;font-weight:700}.berkhof-toc-section>summary span:last-child,.berkhof-toc-chapter>summary span{float:right;color:var(--muted);font-size:.82rem;font-weight:400}.berkhof-toc-chapter{margin:8px 0 0;border:1px solid var(--line);border-radius:10px;background:var(--surface-2);padding:8px 10px}.berkhof-toc-chapter>summary{cursor:pointer}.berkhof-toc-chapter>summary b{font-size:.92rem}.berkhof-toc-chapter ol{margin:8px 0 2px;padding-left:22px}.berkhof-toc-chapter li{margin:5px 0;color:var(--muted);font-size:.9rem}.berkhof-toc-src{margin:8px 0 0;color:var(--muted);font-family:var(--font-mono);font-size:.72rem}\n";
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

  var toc = loadJson("./data/books/berkhof-detailed-toc.json", null);
  window.__DATA__ = attachDetailedToc(window.__DATA__, toc);
  window.setTimeout(installDetailedTocRenderer, 0);
  window.setTimeout(installDetailedTocRenderer, 50);
  window.setTimeout(installDetailedTocRenderer, 250);
})();
