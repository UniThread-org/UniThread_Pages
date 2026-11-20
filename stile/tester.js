/* Modulo "Diventa tester Android": manda l'email alla Edge Function iscrizione-tester (Supabase).
   La funzione salva la richiesta e manda al tester l'email con i link del test chiuso su Google Play.
   Per provare su staging: tester.html?api=staging */
(function () {
  var API = {
    produzione: 'https://amsjwaihvivqtiaehwja.supabase.co/functions/v1/iscrizione-tester',
    staging: 'https://ubceumtnggycthxolbhs.supabase.co/functions/v1/iscrizione-tester'
  };
  var url = /[?&]api=staging\b/.test(location.search) ? API.staging : API.produzione;
  var form = document.getElementById('tester-form');
  if (!form) return;
  var esito = document.getElementById('tester-esito');
  var bottone = form.querySelector('button[type=submit]');

  function mostra(testo, tipo) { esito.textContent = testo; esito.className = 'tester-esito ' + (tipo || ''); }

  form.addEventListener('submit', function (ev) {
    ev.preventDefault();
    var email = form.email.value.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) { mostra('Scrivi un indirizzo email valido.', 'errore'); form.email.focus(); return; }
    if (!form.consenso.checked) { mostra("Per iscriverti devi accettare l'informativa privacy.", 'errore'); return; }
    bottone.disabled = true; mostra('Invio in corso…');
    fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email, consenso: true, sito: form.sito.value })
    }).then(function (r) {
      return r.json().catch(function () { return {}; }).then(function (d) { return { ok: r.ok, d: d }; });
    }).then(function (x) {
      if (x.ok && x.d.ok) {
        form.email.value = '';
        mostra('Fatto! Ti abbiamo mandato un'email (controlla anche Spam e Promozioni). Entro 24 ore ti aggiungiamo alla lista: poi apri il link dell'email dal telefono e installa l'app.', 'ok');
      } else {
        mostra(x.d.error || 'Qualcosa è andato storto. Riprova tra poco.', 'errore');
      }
    }).catch(function () {
      mostra('Connessione non riuscita. Controlla internet e riprova.', 'errore');
    }).then(function () { bottone.disabled = false; });
  });
})();
