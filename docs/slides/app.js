/* Deck engine — navigation (keyboard/scroll/touch), overview (ESC),
   theme toggle (T), progress bar, nav dots. */
(function () {
  var deck = document.getElementById("deck");
  var slides = Array.prototype.slice.call(document.querySelectorAll(".slide"));
  var nav = document.getElementById("nav");
  var bar = document.querySelector(".deck-progress .bar");
  var root = document.documentElement;
  var total = slides.length, idx = 0, lock = false;
  var pad = function (n) { return String(n).padStart(2, "0"); };

  slides.forEach(function (_, i) {
    var b = document.createElement("button");
    b.className = "ndot"; b.setAttribute("aria-label", "Slide " + (i + 1));
    b.onclick = function () { go(i); };
    nav.appendChild(b);
  });

  function applySlide(n) {
    idx = Math.max(0, Math.min(total - 1, n));
    deck.style.transform = "translateX(" + (-idx * 100) + "vw)";
    slides.forEach(function (s, i) { s.classList.toggle("active", i === idx); });
    nav.querySelectorAll(".ndot").forEach(function (d, i) { d.classList.toggle("active", i === idx); });
    bar.style.width = (((idx + 1) / total) * 100) + "%";
    // auto page number (XX / NN) if .pageno is present
    var pn = slides[idx].querySelector(".pageno");
    if (pn) pn.textContent = pad(idx + 1) + " / " + pad(total);
  }
  function go(n) { if (lock) return; applySlide(n); lock = true; setTimeout(function () { lock = false; }, 560); }

  function toggleTheme() { root.setAttribute("data-theme", root.getAttribute("data-theme") === "dark" ? "light" : "dark"); }
  document.getElementById("theme-btn").onclick = toggleTheme;

  var overviewOn = false, ov = document.createElement("div");
  ov.id = "overview"; document.body.appendChild(ov);
  function buildOverview() {
    ov.innerHTML = "";
    var head = document.createElement("div");
    head.className = "ov-head";
    head.innerHTML = "<span><b>Overview</b> &middot; ESC closes</span><span>" + pad(idx + 1) + " / " + pad(total) + "</span>";
    ov.appendChild(head);
    var grid = document.createElement("div"); grid.className = "ov-grid";
    slides.forEach(function (s, i) {
      var card = document.createElement("div"); card.className = "ov-card" + (i === idx ? " active" : "");
      var thumb = document.createElement("div"); thumb.className = "ov-thumb";
      var clone = s.cloneNode(true); clone.className = clone.className.replace("active", "") + " clone";
      var cpn = clone.querySelector(".pageno"); if (cpn) cpn.textContent = pad(i + 1) + " / " + pad(total);
      thumb.appendChild(clone);
      var label = document.createElement("div"); label.className = "ov-label";
      label.innerHTML = "<b>" + pad(i + 1) + "</b><span>" + (s.dataset.slideKind || "") + "</span>";
      card.appendChild(thumb); card.appendChild(label);
      card.onclick = function () { toggleOverview(); applySlide(i); };
      grid.appendChild(card);
    });
    ov.appendChild(grid);
  }
  function toggleOverview() { overviewOn = !overviewOn; if (overviewOn) { buildOverview(); ov.style.display = "block"; } else { ov.style.display = "none"; } }

  addEventListener("keydown", function (e) {
    if (e.key === "Escape") { e.preventDefault(); toggleOverview(); return; }
    if (e.key === "t" || e.key === "T") { toggleTheme(); return; }
    if (overviewOn) return;
    if (e.key === "ArrowRight" || e.key === "PageDown" || e.key === " " || e.key === "ArrowDown") { e.preventDefault(); go(idx + 1); }
    else if (e.key === "ArrowLeft" || e.key === "PageUp" || e.key === "ArrowUp") { e.preventDefault(); go(idx - 1); }
    else if (e.key === "Home") { e.preventDefault(); go(0); }
    else if (e.key === "End") { e.preventDefault(); go(total - 1); }
  });

  var wheelTO = null, wheelAcc = 0;
  addEventListener("wheel", function (e) {
    if (overviewOn) return;
    wheelAcc += e.deltaY + e.deltaX;
    if (Math.abs(wheelAcc) > 70) { go(idx + (wheelAcc > 0 ? 1 : -1)); wheelAcc = 0; }
    clearTimeout(wheelTO); wheelTO = setTimeout(function () { wheelAcc = 0; }, 150);
  }, { passive: true });

  var tx = 0, ty = 0;
  addEventListener("touchstart", function (e) { tx = e.touches[0].clientX; ty = e.touches[0].clientY; }, { passive: true });
  addEventListener("touchend", function (e) {
    if (overviewOn) return;
    var dx = e.changedTouches[0].clientX - tx, dy = e.changedTouches[0].clientY - ty;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) { go(idx + (dx < 0 ? 1 : -1)); }
  }, { passive: true });

  applySlide(0);
})();
