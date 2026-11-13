/* Fabrication Works: a lightbox for the images and the current project in the top bar. */
(function () {
  "use strict";
  var lb = document.querySelector(".lb"), big = lb.querySelector("img");
  function close() { lb.hidden = true; big.removeAttribute("src"); document.body.style.overflow = ""; }
  document.querySelectorAll("figure img").forEach(function (img) {
    img.addEventListener("click", function () {
      big.src = img.currentSrc || img.src; big.alt = img.alt;
      lb.hidden = false; document.body.style.overflow = "hidden";
      lb.querySelector("button").focus();
    });
  });
  lb.addEventListener("click", close);
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && !lb.hidden) close(); });

  var links = [].slice.call(document.querySelectorAll(".toc a"));
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        links.forEach(function (a) { a.classList.toggle("on", a.getAttribute("href") === "#" + e.target.id); });
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    document.querySelectorAll(".project").forEach(function (s) { io.observe(s); });
  }
})();
