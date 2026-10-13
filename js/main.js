// IRSPL — shared site behavior: mobile nav, animated stat counters, contact form submission

document.addEventListener("DOMContentLoaded", function () {
  /* ---------- Mobile nav toggle ---------- */
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.querySelector("nav.primary-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      nav.classList.toggle("open");
    });
    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        nav.classList.remove("open");
      });
    });
  }

  /* ---------- Animated stat counters ---------- */
  var stats = document.querySelectorAll(".stat .num[data-target]");
  if (stats.length) {
    var animate = function (el) {
      var target = parseInt(el.getAttribute("data-target"), 10) || 0;
      var suffix = el.getAttribute("data-suffix") || "";
      var duration = 1400;
      var start = null;

      function step(ts) {
        if (!start) start = ts;
        var progress = Math.min((ts - start) / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 3);
        var value = Math.round(eased * target);
        el.textContent = value.toLocaleString() + suffix;
        if (progress < 1) {
          window.requestAnimationFrame(step);
        } else {
          el.textContent = target.toLocaleString() + suffix;
        }
      }
      window.requestAnimationFrame(step);
    };

    if ("IntersectionObserver" in window) {
      var observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              animate(entry.target);
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.4 }
      );
      stats.forEach(function (el) {
        observer.observe(el);
      });
    } else {
      stats.forEach(animate);
    }
  }

  /* ---------- Contact form submission (delivers straight to inbox via FormSubmit) ---------- */
  var form = document.querySelector("form.contact-form");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var name = form.querySelector("#name") ? form.querySelector("#name").value : "";
      var email = form.querySelector("#email") ? form.querySelector("#email").value : "";
      var message = form.querySelector("#message") ? form.querySelector("#message").value : "";
      var toAddress = form.getAttribute("data-to") || "intelliqueresearchschool@gmail.com";
      var status = form.querySelector(".status");
      var submitBtn = form.querySelector("button[type=submit]");

      var data = new FormData();
      data.append("name", name);
      data.append("email", email);
      data.append("message", message);
      data.append("_subject", "Website inquiry from " + (name || "IRSPL website visitor"));
      data.append("_captcha", "false");
      data.append("_template", "table");

      if (submitBtn) submitBtn.disabled = true;
      if (status) status.textContent = "Sending…";

      fetch("https://formsubmit.co/ajax/" + toAddress, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: data
      })
        .then(function (res) {
          if (!res.ok) throw new Error("Request failed");
          return res.json();
        })
        .then(function () {
          if (status) status.textContent = "Thank you — your message has been sent. We'll be in touch soon.";
          form.reset();
        })
        .catch(function () {
          if (status) {
            status.textContent =
              "Something went wrong sending your message. Please email us directly at " + toAddress + ".";
          }
        })
        .finally(function () {
          if (submitBtn) submitBtn.disabled = false;
        });
    });
  }

  /* ---------- Contact Us popup modal ---------- */
  var modal = document.getElementById("contactModal");
  if (modal) {
    var openModal = function (e) {
      if (e) e.preventDefault();
      modal.hidden = false;
      document.body.classList.add("modal-open");
      var firstField = modal.querySelector("#name");
      if (firstField) firstField.focus();
    };
    var closeModal = function () {
      modal.hidden = true;
      document.body.classList.remove("modal-open");
    };
    document.querySelectorAll("[data-open-contact]").forEach(function (trigger) {
      trigger.addEventListener("click", openModal);
    });
    var closeBtn = modal.querySelector(".modal-close");
    if (closeBtn) closeBtn.addEventListener("click", closeModal);
    modal.addEventListener("click", function (e) {
      if (e.target === modal) closeModal();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !modal.hidden) closeModal();
    });
  }
});
