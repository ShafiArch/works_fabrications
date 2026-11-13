/* Fabrication Works: theme switch, lightbox, the current project in the top bar,
   and the money agent's round screen (the same messages as the Arduino program). */
(function () {
  "use strict";
  var root = document.documentElement;

  /* themes: Trace, Night, Clay; remembered with the works site's key */
  var btns = [].slice.call(document.querySelectorAll(".themes button"));
  function mark() { btns.forEach(function (b) { b.setAttribute("aria-pressed", b.dataset.theme === root.dataset.theme ? "true" : "false"); }); }
  btns.forEach(function (b) {
    b.addEventListener("click", function () {
      root.dataset.theme = b.dataset.theme; mark();
      try { localStorage.setItem("site-theme", b.dataset.theme); } catch (e) {}
    });
  });
  mark();

  /* lightbox keeps the figure's tone class, so a dark board image is toned the same way */
  var lb = document.querySelector(".lb"), big = lb.querySelector("img");
  function close() { lb.hidden = true; big.removeAttribute("src"); lb.className = "lb"; document.body.style.overflow = ""; }
  document.querySelectorAll("figure img").forEach(function (img) {
    img.addEventListener("click", function () {
      var fig = img.closest("figure");
      lb.className = "lb" + (fig.classList.contains("dark-made") ? " dark-made" : "") + (fig.classList.contains("line-art") ? " line-art" : "");
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
        if (e.isIntersecting) links.forEach(function (a) { a.classList.toggle("on", a.getAttribute("href") === "#" + e.target.id); });
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    document.querySelectorAll(".project").forEach(function (s) { io.observe(s); });
  }

  /* the agent: words stacked one per line, like drawVerticalText on the GC9A01 */
  var MSG = ["23 years of work due", "5 mins cooking due", "Half a semester due", "10 years homework", "7 days cleaning",
    "2.5 lifetimes owed", "Netflix weekend skipped", "1 yr gym missed", "Tasks infinite", "8 hrs engineering", "4 hrs accounting",
    "12 hrs labor", "2 days support", "36 hrs debugging", "6 hrs parenting", "3 months writing", "100 coffees pending",
    "50 deliveries due", "7 hrs brain", "5000 meetings", "48 hrs focus", "9 hrs UX/UI", "3.14 days thinking", "1 week emotion",
    "Bakery night shift", "Design marathon"];
  var DEFAULT = "Your Personal Money Agent";
  var text = document.querySelector("[data-agent]"), face = text && text.parentNode, timer = null, covered = false;
  var still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  function show(m) { text.style.opacity = 0; setTimeout(function () { text.textContent = m.split(" ").join("\n"); text.style.opacity = 1; }, 200); }
  function cover() {
    if (!text) return;
    covered = true; face.classList.remove("buzz"); void face.offsetWidth; face.classList.add("buzz");
    setTimeout(function () { show(MSG[Math.floor(Math.random() * MSG.length)]); }, still ? 0 : 900);
    clearTimeout(timer); timer = setTimeout(uncover, 4200);
  }
  function uncover() { covered = false; show(DEFAULT); }
  if (text) {
    show(DEFAULT);
    var btn = document.querySelector("[data-agent-next]");
    if (btn) btn.addEventListener("click", cover);
    face.addEventListener("pointerenter", cover);
    face.addEventListener("click", cover);
    // when the screen is in view, it is "covered" now and then by itself
    if (!still && "IntersectionObserver" in window) {
      var auto = null;
      new IntersectionObserver(function (es) {
        es.forEach(function (e) {
          clearInterval(auto);
          if (e.isIntersecting) auto = setInterval(function () { if (!covered) cover(); }, 7000);
        });
      }).observe(face);
    }
  }
})();
