/* lbws-motion.js: the Gold Rack motion system for the Live Band pages.
   Ported from the kit (2026-11-15). Vanilla, no dependencies. Imported once
   by LiveBandLayout. Everything it animates has a CSS final state, so the
   page reads fine if this never runs. */
(function () {
  var root = document.documentElement;
  var scope = document.querySelector('.lbws-gold');
  if (!scope || scope.__lbMotion) return;
  scope.__lbMotion = true;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var paused = function () { return root.dataset.motion === 'paused'; };
  var $$ = function (sel, el) { return Array.prototype.slice.call((el || scope).querySelectorAll(sel)); };

  /* dB to needle angle. Same curve as VuMeter.astro, so the server-rendered
     needle sits exactly where this script expects it. */
  function dbToDeg(db) {
    var lin = function (d) { return Math.pow(10, d / 20); };
    var n = (lin(db) - lin(-20)) / (lin(3) - lin(-20));
    return -50 + Math.max(-0.04, Math.min(1.04, n)) * 100;
  }
  function setNeedle(needle, db, fast) {
    needle.classList.toggle('is-fast', !!fast);
    needle.style.setProperty('--vu-rot', dbToDeg(db).toFixed(2) + 'deg');
  }

  /* 1. power-on: fade up once, stagger siblings that enter together */
  function initReveal() {
    var items = $$('[data-reveal], [data-draw], [data-chain], [data-knob], [data-vu-level]');
    if (reduce || !('IntersectionObserver' in window)) { items.forEach(function (el) { el.classList.add('is-in', 'is-set'); }); return; }
    var io = new IntersectionObserver(function (entries) {
      var i = 0;
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var el = e.target;
        el.style.setProperty('--ri', Math.min(i++, 8));
        el.classList.add('is-in');
        if (el.hasAttribute('data-knob')) setTimeout(function () { el.classList.add('is-set'); }, 250 + i * 120);
        if (el.hasAttribute('data-vu-level')) levelIn(el);
        io.unobserve(el);
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.05 });
    items.forEach(function (el) { io.observe(el); });
  }

  /* 2. pricing meters: sweep from rest to the tier's level once */
  function levelIn(wrap) {
    $$('[data-vu-needle]', wrap).forEach(function (n) { setNeedle(n, parseFloat(n.dataset.db)); });
  }
  function initLevels() {
    if (reduce) return;
    $$('[data-vu-level] [data-vu-needle]').forEach(function (n) { n.style.setProperty('--vu-rot', dbToDeg(-20).toFixed(2) + 'deg'); });
  }

  /* 3. idle meters: needles ride like program material while on screen */
  function initIdle() {
    if (reduce) return;
    $$('[data-vu-idle]').forEach(function (pair) {
      var needles = $$('[data-vu-needle]', pair), visible = false, held = false, timer = 0, level = -7;
      function tick() {
        timer = 0;
        if (!visible || held || paused() || document.hidden) return schedule();
        level += ((-10 + Math.random() * 7) - level) * 0.7; /* ease toward a new spot between -10 and -3 dB */
        var peak = Math.random() < 0.12;
        needles.forEach(function (n, i) { setNeedle(n, (peak ? -1.5 : level) + (i ? 1 : -1) * Math.random() * 1.2); });
        schedule();
      }
      function schedule() { if (!timer) timer = setTimeout(tick, 700 + Math.random() * 900); }
      if ('IntersectionObserver' in window) {
        new IntersectionObserver(function (es) { visible = es[0].isIntersecting; if (visible) schedule(); }).observe(pair);
      } else { visible = true; }
      pair.__hold = function (on, idx) {
        held = on;
        needles.forEach(function (n, i) { if (idx === 'all' || Number(idx) === i) setNeedle(n, on ? 0 : level, on); });
      };
      schedule();
    });
  }

  /* 4. CTA hover or focus pegs the matching needle to 0 dB and cranks the knob strip */
  function initCtas() {
    $$('[data-meter-cta]').forEach(function (btn) {
      var host = btn.closest('.lb-panel');
      var pair = host && host.querySelector('[data-vu-idle]');
      var group = btn.hasAttribute('data-knob-trigger') ? btn.closest('[data-knob-group]') : null;
      var on = function () { if (pair && pair.__hold) pair.__hold(true, btn.dataset.meterCta); if (group) group.classList.add('is-hot'); };
      var off = function () {
        if (btn.matches(':hover') || document.activeElement === btn) return;
        if (pair && pair.__hold) pair.__hold(false, btn.dataset.meterCta);
        if (group) group.classList.remove('is-hot');
      };
      btn.addEventListener('pointerenter', on); btn.addEventListener('focus', on);
      btn.addEventListener('pointerleave', off); btn.addEventListener('blur', off);
    });
  }

  /* 5. scroll fader: brass cap rides up the slot as the page scrolls */
  function initFader() {
    var cap = scope.querySelector('[data-fader-cap]');
    if (!cap) return;
    var travel = 119, queued = false;
    function update() {
      queued = false;
      var max = document.documentElement.scrollHeight - window.innerHeight;
      var p = max > 0 ? window.scrollY / max : 0;
      cap.style.setProperty('--fader-y', (travel * (1 - p)).toFixed(1) + 'px');
    }
    window.addEventListener('scroll', function () { if (!queued) { queued = true; requestAnimationFrame(update); } }, { passive: true });
    update();
  }

  /* 6. ticker speed scales with its content width */
  function initReadout() {
    $$('[data-readout]').forEach(function (el) {
      var list = el.querySelector('.lb-readout__list');
      if (list) el.style.setProperty('--readout-dur', Math.round(list.scrollWidth / 22) + 's');
    });
  }

  /* 7. hold button: pauses every loop and the videos, remembers for the session.
     Base.astro's lazy-video observer checks the same flag before it plays. */
  function onScreen(el) { var r = el.getBoundingClientRect(); return r.bottom > 0 && r.top < window.innerHeight; }
  function initHold() {
    var btn = scope.querySelector('[data-motion-toggle]');
    if (!btn) return;
    function set(p) {
      if (p) root.dataset.motion = 'paused'; else delete root.dataset.motion;
      btn.setAttribute('aria-pressed', String(p));
      btn.setAttribute('aria-label', p ? 'Play motion' : 'Pause motion');
      $$('video').forEach(function (v) {
        if (p) { v.pause(); return; }
        /* Only resume a clip that has loaded, is on screen and has not finished
           its single pass (data-once clips hold their last frame). */
        if (v.getAttribute('src') && v.dataset.done !== '1' && !v.ended && onScreen(v)) v.play().catch(function () {});
      });
      try { p ? sessionStorage.setItem('lb-motion', 'paused') : sessionStorage.removeItem('lb-motion'); } catch (e) {}
    }
    set(paused());
    btn.addEventListener('click', function () { set(btn.getAttribute('aria-pressed') !== 'true'); });
  }

  initLevels(); initReveal(); initIdle(); initCtas(); initFader(); initReadout(); initHold();
})();
