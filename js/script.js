(function () {
  var root = document.documentElement;
  var toggle = document.getElementById("theme-toggle");

  toggle.addEventListener("click", function () {
    var current = root.getAttribute("data-theme");
    var next = current === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
  });
})();

(function () {
  var note = document.getElementById("reply-by-note");
  if (!note) return;

  var replyBy = new Date(Date.now() + 24 * 60 * 60 * 1000);
  var dateStr = replyBy.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" });
  var timeStr = replyBy.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });

  note.textContent = "I'll get back to you by " + dateStr + " at " + timeStr;
})();
