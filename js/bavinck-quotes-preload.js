/* Bavinck quote preloader v2.
   Adds short, complete-sentence Korean quotations to Bavinck's Reformed Dogmatics Outline before app.js renders.
   Older quote packs are remapped to the 24-chapter uploaded-outline refs to prevent misplaced quotations. */
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

  function completeSentence(text) {
    var t = (text || "").trim();
    if (!t) return "";
    return /[.!?。！？다요임됨함니다습니다]$/.test(t) ? t : t + "입니다.";
  }

  var outlineMap = {
    "I.1":  { section: "I.1",  chapter: "사람의 최고선" },
    "I.2":  { section: "I.2",  chapter: "하나님을 아는 지식" },
    "I.3":  { section: "I.2",  chapter: "하나님을 아는 지식" },
    "I.4":  { section: "I.2",  chapter: "하나님을 아는 지식" },
    "I.5":  { section: "I.3",  chapter: "일반 계시" },
    "I.6":  { section: "I.7",  chapter: "성경" },
    "I.7":  { section: "I.7",  chapter: "성경" },
    "I.8":  { section: "I.8",  chapter: "성경과 신앙고백" },

    "II.1": { section: "II.1", chapter: "하나님의 존재" },
    "II.5": { section: "II.2", chapter: "삼위일체" },
    "II.7": { section: "II.3", chapter: "창조와 섭리" },
    "II.9": { section: "II.4", chapter: "사람의 기원, 본질, 그리고 목적" },
    "II.10": { section: "II.4", chapter: "사람의 기원, 본질, 그리고 목적" },
    "II.11": { section: "II.3", chapter: "창조와 섭리" },

    "III.1": { section: "III.1", chapter: "죄와 사망" },
    "III.2": { section: "III.1", chapter: "죄와 사망" },
    "III.3": { section: "III.2", chapter: "은혜 언약" },
    "III.4": { section: "III.4", chapter: "그리스도의 신성과 인성" },
    "III.5": { section: "III.5", chapter: "낮아지심에서의 그리스도의 사역" },
    "III.7": { section: "III.5", chapter: "낮아지심에서의 그리스도의 사역" },
    "III.8": { section: "III.6", chapter: "높아지심에서의 그리스도의 사역" },
    "III.9": { section: "III.6", chapter: "높아지심에서의 그리스도의 사역" },

    "IV.1": { section: "IV.1", chapter: "성령을 주심" },
    "IV.2": { section: "IV.2", chapter: "그리스도인의 소명" },
    "IV.4": { section: "IV.3", chapter: "칭의" },
    "IV.5": { section: "IV.4", chapter: "성화" },
    "IV.6": { section: "V.1",  chapter: "그리스도의 교회" },
    "IV.8": { section: "V.1",  chapter: "그리스도의 교회" },
    "IV.10": { section: "V.2", chapter: "영생" },
    "IV.12": { section: "V.2", chapter: "영생" }
  };

  function remapBavinckQuote(quote) {
    var mapped = outlineMap[quote.section];
    if (!mapped) return quote;
    var next = Object.assign({}, quote);
    next.originalSection = quote.section;
    next.originalRef = quote.ref || "";
    next.section = mapped.section;
    next.chapter = mapped.chapter;
    next.ref = [mapped.section, mapped.chapter, quote.subtopic].filter(Boolean).join(" — ");
    return next;
  }

  function normalizeBavinckQuote(quote) {
    return {
      text: completeSentence(quote.textKo || quote.text || ""),
      source: quote.source || "헤르만 바빙크, 『개혁교의학 개요』 한국어판",
      ref: quote.ref || [quote.section, quote.chapter, quote.subtopic].filter(Boolean).join(" — "),
      topic: quote.topic || quote.subtopic || quote.chapter || "개혁교의학",
      context: quote.context || "",
      purpose: quote.purpose || "",
      placement: quote.placement || "quote-block",
      priority: quote.priority || "",
      originalRef: quote.originalRef || ""
    };
  }

  function attachBavinckQuotes(data, quotePacks) {
    if (!data || !Array.isArray(data.books)) return data;
    var packs = Array.isArray(quotePacks) ? quotePacks : [quotePacks];
    var quotes = [];
    packs.forEach(function (pack) {
      if (pack && Array.isArray(pack.quotes)) quotes = quotes.concat(pack.quotes);
    });
    if (!quotes.length) return data;

    var book = data.books.find(function (item) { return item && item.id === "bavinck-reformed-dogmatics"; });
    if (!book || !Array.isArray(book.parts)) return data;

    quotes = quotes.filter(function (quote) { return quote.book === "bavinck-reformed-dogmatics"; }).map(remapBavinckQuote);
    book.parts.forEach(function (part) {
      (part.chapters || []).forEach(function (chapter) {
        var matched = quotes.filter(function (quote) {
          return chapter.ref === quote.section || (quote.ref && quote.ref.indexOf(chapter.ref) === 0);
        });
        if (!matched.length) return;
        var existing = Array.isArray(chapter.quotes) ? chapter.quotes : [];
        var merged = existing.concat(matched.map(normalizeBavinckQuote));
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

  var quotePacks = [
    loadJson("./data/quotes/bavinck-reformed-dogmatics-quotes-v1.json", null),
    loadJson("./data/quotes/bavinck-reformed-dogmatics-quotes-v2.json", null),
    loadJson("./data/quotes/bavinck-reformed-dogmatics-quotes-v3.json", null),
    loadJson("./data/quotes/bavinck-reformed-dogmatics-quotes-v4.json", null)
  ].filter(Boolean);
  window.__DATA__ = attachBavinckQuotes(window.__DATA__, quotePacks);
})();
