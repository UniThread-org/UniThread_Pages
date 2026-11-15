/* UniThread: link agli store e interruttore del lancio, in un solo punto.
   AL LANCIO: mettere a true la piattaforma appena l'app è pubblica sul suo store.
   Vale per tutto il sito (home, Chi siamo) e per unithread.it/scarica (il QR dei volantini). */
var UNITHREAD_STORE = {
  disponibile: { ios: false, android: false },
  ios: 'https://apps.apple.com/it/app/id6810596502',
  android: 'https://play.google.com/store/apps/details?id=org.unibooks.app'
};

(function () {
  var S = UNITHREAD_STORE;
  function applica() {
    var qualcuna = S.disponibile.ios || S.disponibile.android;
    // Badge: <a data-store="ios|android"> con dentro <small data-store-etichetta>
    document.querySelectorAll('[data-store]').forEach(function (a) {
      var k = a.getAttribute('data-store');
      a.href = S[k];
      if (!S.disponibile[k]) {
        a.classList.add('in-arrivo');
        a.removeAttribute('href');
        a.setAttribute('aria-disabled', 'true');
        var e = a.querySelector('[data-store-etichetta]');
        if (e) e.textContent = 'In arrivo su';
      }
    });
    // Blocchi da mostrare solo prima / solo dopo il lancio
    document.querySelectorAll('[data-store-attesa]').forEach(function (el) { el.hidden = qualcuna; });
    document.querySelectorAll('[data-store-pronto]').forEach(function (el) { el.hidden = !qualcuna; });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', applica);
  else applica();
})();
