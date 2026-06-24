/* Barth CD II/1 topic index preloader.
   Merges the II/1 topic index into DATA.topics and TOPIC_GUIDES before app.js starts. */
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

  function unique(values) {
    var seen = {};
    return (values || []).filter(function (value) {
      var key = typeof value === "string" ? value : JSON.stringify(value);
      if (!key || seen[key]) return false;
      seen[key] = true;
      return true;
    });
  }

  function mergeArrays(current, incoming) {
    return unique((Array.isArray(current) ? current : []).concat(Array.isArray(incoming) ? incoming : []));
  }

  function upsertTopic(topic) {
    if (!topic || !topic.id) return;
    window.__DATA__ = window.__DATA__ || {};
    window.__DATA__.topics = Array.isArray(window.__DATA__.topics) ? window.__DATA__.topics : [];
    var existing = window.__DATA__.topics.find(function (item) { return item.id === topic.id; });
    if (!existing) {
      window.__DATA__.topics.push(topic);
      return;
    }
    ["references", "positions", "relatedTopics"].forEach(function (key) {
      existing[key] = mergeArrays(existing[key], topic[key]);
    });
    ["name", "category", "summary", "latin", "diverge"].forEach(function (key) {
      if (!existing[key] && topic[key]) existing[key] = topic[key];
    });
  }

  function upsertGuide(guide) {
    if (!guide || !guide.id) return;
    window.__TOPIC_GUIDES__ = Array.isArray(window.__TOPIC_GUIDES__) ? window.__TOPIC_GUIDES__ : [];
    var existing = window.__TOPIC_GUIDES__.find(function (item) { return item.id === guide.id; });
    if (!existing) {
      window.__TOPIC_GUIDES__.push(guide);
      return;
    }
    ["keywords", "comparisonAxes", "researchQuestions", "readingPath"].forEach(function (key) {
      existing[key] = mergeArrays(existing[key], guide[key]);
    });
  }

  var index = loadJson("./data/barth-cd-ii-1-topic-index.json", { topics: [], guides: [] });
  (index.topics || []).forEach(upsertTopic);
  (index.guides || []).forEach(upsertGuide);
  window.__BARTH_II1_TOPIC_INDEX__ = index;
})();
