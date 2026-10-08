document.addEventListener("DOMContentLoaded", function () {


  var header = document.getElementById("site-header");
  if (header) {
    var on_scroll = function () {
      header.classList.toggle("scrolled", window.scrollY > 40);
    };
    window.addEventListener("scroll", on_scroll, { passive: true });
    on_scroll();
  }

  //background video
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


  var hero_reveals = document.querySelectorAll(".hero-content .reveal, .hero-badge.reveal");
  requestAnimationFrame(function () {
    requestAnimationFrame(function () {
      hero_reveals.forEach(function (el) { el.classList.add("in"); });
    });
  });


  var scroll_reveals = document.querySelectorAll(".section-head.reveal, .contact-grid > .reveal");
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
      { threshold: 0.2 }
    );
    scroll_reveals.forEach(function (el) { observer.observe(el); });
  } else {
    scroll_reveals.forEach(function (el) { el.classList.add("in"); });
  }

});
