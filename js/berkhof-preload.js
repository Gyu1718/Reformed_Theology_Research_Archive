/* Berkhof preloader v2.
   Upload this file to js/berkhof-preload.js.
   It loads Berkhof structure, chapter profiles, and explained quotations before app.js renders.
   It also patches the book detail renderer after app.js loads so subtopic and quote explanations are visible. */
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

  function safeText(text) {
    return String(text || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\"/g, "&quot;");
  }

  function completeSentence(text) {
    var t = String(text || "").trim();
    if (!t) return "";
    return /[.!?。！？다요임됨함니다습니다]$/.test(t) ? t : t + "입니다.";
  }

  function profileMap(profiles) {
    var map = {};
    (profiles && profiles.chapters || []).forEach(function (item) {
      if (item && item.ref) map[item.ref] = item;
    });
    return map;
  }

  function chapterFromString(raw, partTitle, profiles) {
    var m = String(raw).match(/^([IVX]+\.\d+)\s+(.+)$/);
    var ref = m ? m[1] : String(raw);
    var title = m ? m[2] : String(raw);
    var profile = profiles[ref] || {};
    return {
      ref: ref,
      title: title,
      summary: profile.summary || ("벌코프는 『조직신학』 " + ref + "에서 ‘" + title + "’을 개혁파 조직신학의 질서 안에서 정리합니다."),
      detail: profile.detail || ("이 장은 " + partTitle + "에 속합니다. 칼빈의 고전적 진술, 바빙크의 유기적 종합, 바르트의 신정통주의적 재구성과 비교할 때 기준점 역할을 합니다."),
      subtopics: profile.subtopics || [],
      subtopicExplanations: profile.subtopicExplanations || [],
      keyPoints: profile.keyPoints || ["개혁파 표준 교리", "교과서형 조직신학", "장별 비교 색인"],
      concepts: uniq(profile.concepts || ["개혁파 정통", "조직신학", "교과서형 교의학"])
    };
  }

  function buildBerkhofBook(map, profiles) {
    if (!map || !Array.isArray(map.parts)) return null;
    return {
      id: "berkhof-systematic-theology",
      title: "조직신학",
      author: "루이스 벌코프",
      originalAuthor: "Louis Berkhof",
      tradition: "개혁파 정통",
      traditionKey: "ref",
      category: "Reformed Systematic Theology / Dogmatics",
      language: "Korean",
      summary: "벌코프의 『조직신학』은 개혁파 교리를 서론, 신론, 인간론, 기독론, 구원론, 교회론, 종말론의 표준 구조로 압축한 대표적 교과서형 조직신학입니다.",
      researchUse: "칼빈과 비교하면 벌코프는 종교개혁 교리의 체계를 교과서적 순서로 정리합니다. 바빙크와 비교하면 더 짧고 명료한 요약형 구조를 제공하며, 바르트와 비교하면 개혁파 정통의 표준 명제와 신정통주의의 계시 중심 재구성을 항목별로 대조하기 좋습니다.",
      topics: ["성경론", "신론", "삼위일체", "창조론", "인간론", "죄론", "기독론", "구원론", "교회론", "성례론", "종말론"],
      authorsMentioned: ["John Calvin", "Herman Bavinck", "Charles Hodge", "A. A. Hodge", "Augustine", "Thomas Aquinas", "Karl Barth"],
      edition: "『조직신학』 구조 한국어 연구색인",
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

  function normalizeBerkhofQuote(quote) {
    return {
      text: completeSentence(quote.textKo || quote.text || ""),
      source: quote.source || "루이스 벌코프, 『조직신학』 한국어판",
      ref: quote.ref || [quote.section, quote.chapter, quote.subtopic].filter(Boolean).join(" — "),
      topic: quote.topic || quote.subtopic || quote.chapter || "조직신학",
      subtopic: quote.subtopic || "",
      subtopicExplanation: quote.subtopicExplanation || "",
      quoteExplanation: quote.quoteExplanation || quote.explanation || "",
      teachingUse: quote.teachingUse || "",
      compareNote: quote.compareNote || ""
    };
  }

  function collectQuotes(pack) {
    if (pack && Array.isArray(pack.quotes)) return pack.quotes;
    return [];
  }

  function attachBerkhofQuotes(data, quotes) {
    if (!data || !Array.isArray(data.books) || !quotes.length) return data;
    var book = data.books.find(function (item) { return item && item.id === "berkhof-systematic-theology"; });
    if (!book || !Array.isArray(book.parts)) return data;
    quotes = quotes.filter(function (quote) { return quote.book === "berkhof-systematic-theology"; });
    book.parts.forEach(function (part) {
      (part.chapters || []).forEach(function (chapter) {
        var matched = quotes.filter(function (quote) {
          return chapter.ref === quote.section || (quote.ref && quote.ref.indexOf(chapter.ref) === 0);
        });
        if (!matched.length) return;
        var existing = Array.isArray(chapter.quotes) ? chapter.quotes : [];
        var merged = existing.concat(matched.map(normalizeBerkhofQuote));
        var seen = {};
        chapter.quotes = merged.filter(function (item) {
          var key = [item.text, item.ref].join("|");
          if (seen[key]) return false;
          seen[key] = true;
          return true;
        });
      });
    });
    return data;
  }

  function installBerkhofDetailRenderer() {
    if (window.__BERKHOF_DETAIL_RENDERER_INSTALLED__) return;
    if (typeof window.render !== "function" || typeof window.setRoute !== "function") return;
    window.__BERKHOF_DETAIL_RENDERER_INSTALLED__ = true;

    var style = document.createElement("style");
    style.id = "berkhof-detail-explanation-styles";
    style.textContent = "\n.subtopic-box{margin:12px 0 14px;border:1px solid var(--line);background:var(--surface-2);border-radius:12px;padding:12px 14px}.subtopic-box h5{margin:0 0 8px;font-family:var(--font-mono);font-size:.75rem;letter-spacing:.08em;color:var(--muted);text-transform:uppercase}.subtopic-list{display:grid;gap:8px;margin:0}.subtopic-item{padding:8px 10px;border:1px solid var(--line);border-radius:10px;background:var(--surface)}.subtopic-item b{display:block;font-size:.9rem}.subtopic-item span{display:block;color:var(--muted);font-size:.86rem;margin-top:3px}.chap-quote .quote-meta{display:block;margin-top:8px;font-size:.78rem;color:var(--muted);font-family:var(--font-mono)}.quote-explain{margin-top:9px;padding:9px 10px;border-left:3px solid var(--line-strong);background:var(--surface-2);border-radius:8px;color:var(--muted);font-style:normal}.quote-explain b{color:var(--ink);font-size:.82rem}.quote-teaching{margin-top:6px;color:var(--muted);font-size:.86rem;font-style:normal}\n";
    document.head.appendChild(style);

    window.quotesHTML = function quotesHTML(items) {
      if (!items || !items.length) return "";
      var html = items.filter(function (q) { return q.text && q.source; }).map(function (q) {
        var sub = q.subtopic ? '<span class="quote-meta">소주제 · ' + safeText(q.subtopic) + '</span>' : '';
        var subExp = q.subtopicExplanation ? '<div class="quote-explain"><b>소주제 설명</b><br>' + safeText(q.subtopicExplanation) + '</div>' : '';
        var qExp = q.quoteExplanation ? '<div class="quote-explain"><b>인용 설명</b><br>' + safeText(q.quoteExplanation) + '</div>' : '';
        var teach = q.teachingUse ? '<div class="quote-teaching">활용: ' + safeText(q.teachingUse) + '</div>' : '';
        return '<blockquote class="chap-quote">' + safeText(q.text) + sub + '<cite>— ' + safeText(q.source) + (q.ref ? ' · ' + safeText(q.ref) : '') + '</cite>' + subExp + qExp + teach + '</blockquote>';
      }).join("");
      return html ? '<div class="quotes">' + html + '</div>' : '';
    };

    window.chapterHTML = function chapterHTML(ch) {
      var ref = '<span class="cref">' + safeText(ch.ref || "·") + '</span>';
      var head = ref + '<div class="chap-head"><b>' + safeText(ch.title) + '</b>' + (ch.summary ? '<p>' + safeText(ch.summary) + '</p>' : '') + '</div>';
      var tags = (ch.concepts && ch.concepts.length) ? '<div class="tags">' + ch.concepts.map(function (x) { return '<span class="tag">' + safeText(x) + '</span>'; }).join("") + '</div>' : '';
      var subtopics = '';
      if (ch.subtopics && ch.subtopics.length) {
        var overview = ch.subtopicOverview ? '<p class="subtopic-overview">' + safeText(ch.subtopicOverview) + '</p>' : '';
        subtopics = '<div class="subtopic-box"><h5>소주제 설명</h5>' + overview + '<div class="subtopic-list">' + ch.subtopics.map(function (s, idx) {
          var exp = ch.subtopicExplanations && ch.subtopicExplanations[idx] ? '<span>' + safeText(ch.subtopicExplanations[idx]) + '</span>' : '';
          var question = ch.subtopicQuestions && ch.subtopicQuestions[idx] ? '<em class="subtopic-question">질문: ' + safeText(ch.subtopicQuestions[idx]) + '</em>' : '';
          return '<div class="subtopic-item"><b>' + safeText(s) + '</b>' + exp + question + '</div>';
        }).join("") + '</div></div>';
      }
      var quotes = window.quotesHTML(ch.quotes);
      var hasDetail = ch.detail || (ch.keyPoints && ch.keyPoints.length) || quotes || subtopics;
      if (!hasDetail) return '<div class="chap">' + head + '</div>' + (tags ? '<div class="chap-tagrow">' + tags + '</div>' : '');
      var kp = (ch.keyPoints && ch.keyPoints.length) ? '<ul class="keypoints">' + ch.keyPoints.map(function (k) { return '<li>' + safeText(k) + '</li>'; }).join("") + '</ul>' : '';
      return '<details class="chap-x"><summary class="chap chap-sum">' + head + '</summary><div class="chap-detail">' + (ch.detail ? '<p class="chap-body">' + safeText(ch.detail) + '</p>' : '') + subtopics + kp + quotes + tags + '</div></details>';
    };

    if (typeof window.render === "function") window.render();
  }

  var map = loadJson("./data/books-berkhof-structure-map.json", null);
  var profiles = profileMap(loadJson("./data/books/berkhof-chapter-profiles.json", null));
  var book = buildBerkhofBook(map, profiles);
  window.__DATA__ = upsertBook(window.__DATA__, book);

  var explainedPack = loadJson("./data/quotes/berkhof-systematic-theology-quotes-explained-v2.json", null) || loadJson("./data/quotes/berkhof-systematic-theology-quotes-explained-v1.json", null);
  var quotes = collectQuotes(explainedPack);
  if (!quotes.length) {
    ["v1", "v2", "v3", "v4", "v5", "v6"].forEach(function (v) {
      quotes = quotes.concat(collectQuotes(loadJson("./data/quotes/berkhof-systematic-theology-quotes-" + v + ".json", null)));
    });
  }
  window.__DATA__ = attachBerkhofQuotes(window.__DATA__, quotes);

  window.setTimeout(installBerkhofDetailRenderer, 0);
  window.setTimeout(installBerkhofDetailRenderer, 50);
  window.setTimeout(installBerkhofDetailRenderer, 250);
})();
