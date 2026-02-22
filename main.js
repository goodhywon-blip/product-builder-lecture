(() => {
  "use strict";

  // Lightweight helper shared by static pages (no tracking, no external deps).
  // If a page includes this script, it will populate any element with
  // data-year="current" using the current year.
  const yearEls = document.querySelectorAll("[data-year='current']");
  if (yearEls.length) {
    const year = String(new Date().getFullYear());
    yearEls.forEach((el) => {
      el.textContent = year;
    });
  }
})();
