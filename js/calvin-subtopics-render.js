/* Calvin Institutes renderer compatibility shim.
   Calvin chapter data is now normalized before app.js by book-description-standardize.js.
   Do not install a Calvin-only chapter renderer here; every book detail page must keep the
   Barth-style explanation layout supplied by js/app.js. */
(function () {
  if (typeof render === "function") render();
})();
