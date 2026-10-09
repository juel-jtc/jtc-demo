/* ============ JTC Redesign — Interactions ============ */
(function () {
  'use strict';

  /* Preloader: full-screen logo intro, then curtain lift */
  var preHidden = false;
  function hidePre() {
    if (preHidden) return;
    preHidden = true;
    document.getElementById('preloader')?.classList.add('done');
  }
  window.addEventListener('load', function () { setTimeout(hidePre, 1500); });
  setTimeout(hidePre, 4000); // safety: never trap the user

  /* Nav: always white glass (brand style like jtckw.com) — no scroll toggle needed */

  /* Mobile menu */
  var burger = document.querySelector('.hamburger');
  var links = document.querySelector('.nav-links');
  burger?.addEventListener('click', function () {
    links.classList.toggle('open');
  });

  /* Reveal on scroll */
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.reveal').forEach(function (el) { io.observe(el); });

  /* Animated counters */
  var cio = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      var el = e.target;
      cio.unobserve(el);
      var target = parseFloat(el.dataset.count);
      var dur = 1600, t0 = performance.now();
      function tick(t) {
        var p = Math.min((t - t0) / dur, 1);
        var eased = 1 - Math.pow(1 - p, 4);
        el.textContent = Math.round(target * eased);
        if (p < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('[data-count]').forEach(function (el) { cio.observe(el); });

  /* Hero slider */
  var slides = Array.prototype.slice.call(document.querySelectorAll('.slide'));
  var dotsWrap = document.querySelector('.hero-dots');
  var numEl = document.querySelector('.hero-num');
  var idx = 0, timer = null;
  if (slides.length) {
    slides.forEach(function (_, i) {
      var b = document.createElement('button');
      b.setAttribute('aria-label', 'Slide ' + (i + 1));
      b.addEventListener('click', function () { go(i); restart(); });
      dotsWrap.appendChild(b);
    });
    var dots = Array.prototype.slice.call(dotsWrap.children);
    function render() {
      slides.forEach(function (s, i) { s.classList.toggle('active', i === idx); });
      dots.forEach(function (d, i) { d.classList.toggle('on', i === idx); });
      // re-trigger text animations on the active slide
      var active = slides[idx];
      active.querySelectorAll('.hero-kicker,.hero-title,.hero-sub,.hero-cta').forEach(function (el) {
        el.style.animation = 'none';
        void el.offsetWidth;
        el.style.animation = '';
      });
      if (numEl) numEl.innerHTML = '<b>' + String(idx + 1).padStart(2, '0') + '</b> / ' + String(slides.length).padStart(2, '0');
    }
    function go(i) { idx = (i + slides.length) % slides.length; render(); }
    function restart() { clearInterval(timer); timer = setInterval(function () { go(idx + 1); }, 6000); }
    // subtle parallax on mouse move
    var hero = document.querySelector('.hero');
    hero?.addEventListener('mousemove', function (ev) {
      var x = (ev.clientX / window.innerWidth - 0.5) * 14;
      var y = (ev.clientY / window.innerHeight - 0.5) * 10;
      var bg = slides[idx].querySelector('.bg');
      if (bg) bg.style.translate = x + 'px ' + y + 'px';
    });
    render();
    restart();
  }

  /* Active nav link */
  var path = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a.nl').forEach(function (a) {
    var href = a.getAttribute('href') || '';
    if (href.endsWith(path)) a.classList.add('active');
  });

  /* Footer year */
  var yr = document.getElementById('year');
  if (yr) yr.textContent = new Date().getFullYear();
})();
