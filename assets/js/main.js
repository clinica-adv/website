document.addEventListener("DOMContentLoaded", function () {


  var header = document.getElementById("site-header");
  if (header) {
    var on_scroll = function () {
      header.classList.toggle("scrolled", window.scrollY > 40);
    };
    window.addEventListener("scroll", on_scroll, { passive: true });
    on_scroll();
  }

  // mobile menu
  var menu_toggle = document.getElementById("menu-toggle");
  var main_nav = document.getElementById("main-nav");

  var set_menu = function (is_open) {
    if (!header || !menu_toggle) return;
    header.classList.toggle("nav-open", is_open);
    menu_toggle.setAttribute("aria-expanded", is_open ? "true" : "false");
  };

  if (menu_toggle && main_nav) {
    menu_toggle.addEventListener("click", function () {
      set_menu(!header.classList.contains("nav-open"));
    });
    main_nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () { set_menu(false); });
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") set_menu(false);
    });
  }

  // background video
  var video = document.getElementById("hero-video");
  var hero_media = document.getElementById("hero-media");
  var prefers_reduced_motion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (video) {
    if (prefers_reduced_motion) {
      video.removeAttribute("autoplay");
      video.pause();
    } else {
      document.addEventListener("visibilitychange", function () {
        if (document.hidden) {
          video.pause();
        } else {
          video.play().catch(function () {
          });
        }
      });
    }

    var reveal_media = function () {
      if (hero_media) hero_media.classList.add("is-loaded");
    };
    video.addEventListener("loadeddata", reveal_media, { once: true });
    setTimeout(reveal_media, 900);
  } else if (hero_media) {
    hero_media.classList.add("is-loaded");
  }


  var hero_reveals = document.querySelectorAll(".hero-content .reveal, .scroll-cue.reveal");
  requestAnimationFrame(function () {
    requestAnimationFrame(function () {
      hero_reveals.forEach(function (el) { el.classList.add("in"); });
    });
  });


  var scroll_reveals = document.querySelectorAll("main section:not(.hero) .reveal");
  if ("IntersectionObserver" in window && scroll_reveals.length) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    scroll_reveals.forEach(function (el) { observer.observe(el); });
  } else {
    scroll_reveals.forEach(function (el) { el.classList.add("in"); });
  }

  // highlight the nav link of the section in view
  var nav_links = main_nav ? main_nav.querySelectorAll("a[href^='#']") : [];
  var tracked_sections = [];
  nav_links.forEach(function (link) {
    var target = document.querySelector(link.getAttribute("href"));
    if (target) tracked_sections.push({ link: link, section: target });
  });

  if ("IntersectionObserver" in window && tracked_sections.length) {
    var section_observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          tracked_sections.forEach(function (item) {
            item.link.classList.toggle("is-current", item.section === entry.target);
          });
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    tracked_sections.forEach(function (item) { section_observer.observe(item.section); });
  }

  // contact form: send in the background, fall back to a normal post
  var contact_form = document.getElementById("contact-form");
  var form_status = document.getElementById("form-status");
  var submit_button = document.getElementById("contact-submit");

  if (contact_form && window.fetch && window.FormData) {
    contact_form.addEventListener("submit", function (e) {
      e.preventDefault();

      var ajax_url = contact_form.action.replace("formsubmit.co/", "formsubmit.co/ajax/");
      submit_button.disabled = true;
      form_status.className = "form-status";
      form_status.textContent = "Αποστολή…";

      fetch(ajax_url, {
        method: "POST",
        headers: { "Accept": "application/json" },
        body: new FormData(contact_form)
      })
        .then(function (res) {
          if (!res.ok) throw new Error("send_failed");
          return res.json();
        })
        .then(function () {
          contact_form.reset();
          form_status.className = "form-status is-ok";
          form_status.textContent = "Ευχαριστούμε! Το μήνυμά σου στάλθηκε, θα επικοινωνήσουμε σύντομα μαζί σου.";
        })
        .catch(function () {
          form_status.className = "form-status is-error";
          form_status.textContent = "Κάτι πήγε στραβά. Δοκίμασε ξανά ή στείλε μας email στο info@clinica.gr.";
        })
        .then(function () {
          submit_button.disabled = false;
        });
    });
  }

  var year_el = document.getElementById("year");
  if (year_el) year_el.textContent = new Date().getFullYear();

});
