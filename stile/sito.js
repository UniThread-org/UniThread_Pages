// Comportamenti comuni a tutte le pagine: barra in alto, avanzamento lettura,
// comparsa degli elementi allo scorrimento.
(function () {
  var nav = document.querySelector('.nav');
  var barra = document.querySelector('.progresso');
  var inAttesa = false;

  function aggiorna() {
    inAttesa = false;
    var y = window.scrollY;
    if (nav) nav.classList.toggle('scrolled', y > 8);
    if (barra) {
      var max = document.documentElement.scrollHeight - window.innerHeight;
      barra.style.transform = 'scaleX(' + (max > 0 ? Math.min(1, y / max) : 0) + ')';
    }
  }
  window.addEventListener('scroll', function () {
    if (!inAttesa) { inAttesa = true; requestAnimationFrame(aggiorna); }
  }, { passive: true });
  aggiorna();

  var elementi = document.querySelectorAll('.rivela');
  if (!('IntersectionObserver' in window)) {
    elementi.forEach(function (el) { el.classList.add('visibile'); });
    return;
  }
  var osservatore = new IntersectionObserver(function (voci) {
    voci.forEach(function (v) {
      if (v.isIntersecting) { v.target.classList.add('visibile'); osservatore.unobserve(v.target); }
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
  elementi.forEach(function (el) { osservatore.observe(el); });
})();

// Menu a tutto schermo su telefono.
(function () {
  var btn = document.querySelector('.menu-btn');
  if (!btn) return;
  function chiudi() { document.documentElement.classList.remove('menu-aperto'); btn.setAttribute('aria-expanded', 'false'); btn.setAttribute('aria-label', 'Apri il menu'); }
  btn.addEventListener('click', function () {
    var aperto = document.documentElement.classList.toggle('menu-aperto');
    btn.setAttribute('aria-expanded', aperto ? 'true' : 'false');
    btn.setAttribute('aria-label', aperto ? 'Chiudi il menu' : 'Apri il menu');
  });
  document.querySelectorAll('.nav-links a').forEach(function (a) { a.addEventListener('click', chiudi); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') chiudi(); });
  window.addEventListener('pageshow', chiudi);
})();

// Frase che si accende parola per parola mentre scorri.
(function () {
  var p = document.querySelector('[data-frase]');
  if (!p) return;
  var pezzi = [];
  function spezza(nodo, blu) {
    Array.prototype.slice.call(nodo.childNodes).forEach(function (n) {
      if (n.nodeType === 3) {
        var frag = document.createDocumentFragment();
        n.textContent.split(/(\s+)/).forEach(function (t) {
          if (!t) return;
          if (/^\s+$/.test(t)) { frag.appendChild(document.createTextNode(t)); return; }
          var s = document.createElement('span');
          s.className = 'pz' + (blu ? ' blu' : '');
          s.textContent = t;
          pezzi.push(s); frag.appendChild(s);
        });
        nodo.replaceChild(frag, n);
      } else if (n.nodeType === 1) {
        spezza(n, blu || n.classList.contains('blu'));
        if (n.classList.contains('blu')) n.classList.remove('blu');
      }
    });
  }
  spezza(p, false);
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { pezzi.forEach(function (s) { s.classList.add('acceso'); }); return; }
  var inAttesa = false;
  function aggiorna() {
    inAttesa = false;
    var r = p.getBoundingClientRect(), h = window.innerHeight;
    var k = (h * 0.85 - r.top) / (r.height + h * 0.35);
    var n = Math.round(Math.max(0, Math.min(1, k)) * pezzi.length);
    pezzi.forEach(function (s, i) { s.classList.toggle('acceso', i < n); });
  }
  window.addEventListener('scroll', function () { if (!inAttesa) { inAttesa = true; requestAnimationFrame(aggiorna); } }, { passive: true });
  aggiorna();
})();
