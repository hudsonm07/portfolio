(function () {
  var list = document.getElementById("shelf-list");
  if (!list) return;

  function renderEmpty(message) {
    list.innerHTML = '<p class="shelf-empty">' + message + "</p>";
  }

  function renderItems(items) {
    if (!items || items.length === 0) {
      renderEmpty("Nothing on the shelf yet.");
      return;
    }

    list.innerHTML = items
      .map(function (item) {
        var thumb = item.image
          ? '<img class="shelf-thumb" src="' + item.image + '" alt="" loading="lazy">'
          : '<div class="shelf-thumb shelf-thumb-empty" aria-hidden="true"></div>';

        return (
          '<a class="shelf-card" href="' + item.url + '" target="_blank" rel="noopener">' +
          thumb +
          '<div class="shelf-card-body">' +
          '<p class="shelf-title">' + item.title + "</p>" +
          '<p class="shelf-site">' + item.siteName + "</p>" +
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
