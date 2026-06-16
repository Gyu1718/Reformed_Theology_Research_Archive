/* History data preloader.
   Adds tradition-history.json to the preloaded DATA object before app.js starts. */
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
  window.__DATA__.history = loadJson("./data/tradition-history.json", []);
})();
