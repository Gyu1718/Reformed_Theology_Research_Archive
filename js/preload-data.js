/* Supplemental data preloader.
   Loads the default archive data plus supplemental book files before app.js starts. */
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

  var books = loadJson("./data/books.json", []);
  var extraBooks = loadJson("./data/books-barth.json", []);

  window.__DATA__ = {
    books: books.concat(Array.isArray(extraBooks) ? extraBooks : []),
    authors: loadJson("./data/authors.json", []),
    topics: loadJson("./data/topics.json", []),
    passages: loadJson("./data/passages.json", []),
    notes: loadJson("./data/notes.json", []),
    taxonomy: loadJson("./data/taxonomy.json", {})
  };
})();
