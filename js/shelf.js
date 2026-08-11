(function () {
  var list = document.getElementById("shelf-list");
  if (!list) return;

  var ESCAPE_MAP = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };

  function escapeHtml(value) {
    return String(value || "").replace(/[&<>"']/g, function (c) {
      return ESCAPE_MAP[c];
    });
  }

  function renderEmpty(message) {
    list.innerHTML = '<p class="shelf-empty">' + escapeHtml(message) + "</p>";
  }

  function renderItems(items) {
    if (!items || items.length === 0) {
      renderEmpty("Nothing on the shelf yet.");
      return;
    }

    list.innerHTML = items
      .map(function (item) {
        var title = escapeHtml(item.title);
        var siteName = escapeHtml(item.siteName);
        var url = escapeHtml(item.url);

        var thumb = item.image
          ? '<img class="shelf-thumb" src="' + escapeHtml(item.image) + '" alt="' + title + '" loading="lazy">'
          : '<div class="shelf-thumb shelf-thumb-empty" aria-hidden="true"></div>';

        return (
          '<a class="shelf-card" href="' + url + '" target="_blank" rel="noopener">' +
          thumb +
          '<div class="shelf-card-body">' +
          '<p class="shelf-title">' + title + "</p>" +
          '<p class="shelf-site">' + siteName + "</p>" +
          "</div>" +
          "</a>"
        );
      })
      .join("");
  }

  fetch("data/shelf.json?v=" + Date.now(), { cache: "no-store" })
    .then(function (res) {
      if (!res.ok) throw new Error("shelf.json request failed");
      return res.json();
    })
    .then(renderItems)
    .catch(function () {
      renderEmpty("Couldn't load the shelf right now.");
    });
})();
