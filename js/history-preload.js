/* History data preloader.
   Adds Reformed tradition and neo-orthodox history data to the preloaded DATA object before app.js starts. */
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

  if (!window.__DATA__) window.__DATA__ = {};
  var reformedHistory = loadJson("./data/tradition-history.json", []);
  var neoOrthodoxHistory = loadJson("./data/neo-orthodoxy-history.json", []);
  window.__DATA__.history = [].concat(reformedHistory || [], neoOrthodoxHistory || []);
})();
