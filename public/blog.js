/* ============================================================
   Live Web Studios — blog renderer
   Fetches the single JSON collection (written by Decap CMS), builds a
   card per post, and injects them into #blog-list. Cache-busted so a
   fresh Netlify deploy after a CMS save shows immediately. Each inserted
   card is registered with window.LWS.observe() for the site's scroll
   reveal, with a classList.add('is-visible') fallback if that hook is
   absent (per standing pattern).
   ============================================================ */
(function () {
  var mount = document.getElementById("blog-list");
  if (!mount) return;

  // Relative path per the LWS path rule — resolves to /posts/index.json
  // from the /blog page. Cache-bust so CMS edits appear on next load.
  fetch("posts/index.json?v=" + Date.now())
    .then(function (r) {
      return r.ok ? r.json() : { posts: [] };
    })
    .then(function (data) {
      var posts = (data && data.posts) || [];
      // Newest publish date first.
      posts.sort(function (a, b) {
        return String(b.date || "").localeCompare(String(a.date || ""));
      });

      if (!posts.length) {
        mount.innerHTML =
          '<p class="blog-empty">New posts are on the way. Check back soon.</p>';
        return;
      }

      var frag = document.createDocumentFragment();
      posts.forEach(function (p) {
        frag.appendChild(buildCard(p));
      });
      mount.innerHTML = ""; // clear the "Loading posts…" placeholder
      mount.appendChild(frag);

      // Reveal each inserted card via the site system; fall back to the
      // standing is-visible class if window.LWS is unavailable.
      var cards = mount.querySelectorAll(".blog-card");
      for (var i = 0; i < cards.length; i++) {
        if (window.LWS && typeof window.LWS.observe === "function") {
          window.LWS.observe(cards[i]);
        } else {
          cards[i].classList.add("is-visible");
        }
      }
    })
    .catch(function () {
      mount.innerHTML =
        '<p class="blog-empty">Posts are taking a moment to load. Please refresh the page.</p>';
    });

  function buildCard(p) {
    var art = document.createElement("article");
    art.className = "blog-card reveal";

    // Strip any leading slash so the reference stays relative (path rule).
    var thumb = String(p.thumbnail || "").replace(/^\/+/, "");
    var media = thumb
      ? '<div class="blog-thumb"><img src="' +
        esc(thumb) +
        '" alt="" loading="lazy" decoding="async"></div>'
      : '<div class="blog-thumb blog-thumb--empty"><span>Live Web Studios</span></div>';

    var date = p.date
      ? '<time datetime="' + esc(p.date) + '">' + esc(fmtDate(p.date)) + "</time>"
      : "";

    art.innerHTML =
      media +
      '<div class="blog-meta">' +
      '<span class="blog-date">' +
      date +
      "</span>" +
      '<h2 class="blog-title">' +
      esc(p.title || "Untitled") +
      "</h2>" +
      '<p class="blog-sum">' +
      esc(p.summary || "") +
      "</p>" +
      "</div>";
    return art;
  }

  // Escape all CMS-sourced strings before they touch innerHTML.
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      }[c];
    });
  }

  function fmtDate(d) {
    var t = new Date(String(d) + "T00:00:00");
    if (isNaN(t.getTime())) return d;
    return t.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }
})();
