(function () {
  var form = document.getElementById("contact-form");
  if (!form) return;

  var status = document.getElementById("contact-form-status");
  var button = form.querySelector("button[type=submit]");

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    button.disabled = true;
    status.textContent = "Sending...";
    status.className = "form-status";

    fetch(form.action, {
      method: "POST",
      headers: { Accept: "application/json" },
      body: new FormData(form),
    })
      .then(function (res) {
        return res.json().then(function (data) {
          return { ok: res.ok, data: data };
        });
      })
      .then(function (result) {
        if (result.ok && result.data.success) {
          status.textContent = "Message sent - thanks for reaching out.";
          status.className = "form-status form-status-success";
          form.reset();
        } else {
          throw new Error((result.data && result.data.message) || "Submission failed");
        }
      })
      .catch(function () {
        status.textContent = "Something went wrong - please try again or email me directly.";
        status.className = "form-status form-status-error";
      })
      .finally(function () {
        button.disabled = false;
      });
  });
})();
