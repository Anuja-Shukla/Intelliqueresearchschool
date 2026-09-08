// IRSPL — shared site behavior: mobile nav, animated stat counters, mailto contact form

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

  /* ---------- Mailto contact form ---------- */
  var form = document.querySelector("form.contact-form");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var name = form.querySelector("#name") ? form.querySelector("#name").value : "";
      var email = form.querySelector("#email") ? form.querySelector("#email").value : "";
      var message = form.querySelector("#message") ? form.querySelector("#message").value : "";
      var toAddress = form.getAttribute("data-to") || "intelliqueresearchschool@gmail.com";

      var subject = encodeURIComponent("Website inquiry from " + (name || "IRSPL website visitor"));
      var body = encodeURIComponent(
        "Name: " + name + "\nEmail: " + email + "\n\n" + message
      );

      window.location.href = "mailto:" + toAddress + "?subject=" + subject + "&body=" + body;

      var status = form.querySelector(".status");
      if (status) {
        status.textContent = "Opening your email client…";
      }
    });
  }
});
