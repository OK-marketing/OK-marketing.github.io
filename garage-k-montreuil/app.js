/* Garage k Montreuil — maquette
   Rien d'indispensable ne dépend de ce fichier : sans lui la page
   reste lisible et le bouton WhatsApp part avec un message générique. */

(function () {
  'use strict';

  var TEL = '33749215172';

  /* ---------------------------------------------------------
     l'outil : deux touches composent le message
     --------------------------------------------------------- */
  var choix = { piece: '', degat: '' };
  var apercu = document.getElementById('apercu');
  var lienWa = document.getElementById('lienWa');

  function messageTexte() {
    if (!choix.piece && !choix.degat) {
      return "Bonjour, j'ai un dégât sur ma voiture. Pouvez-vous me dire ce que ça donne ?";
    }
    var m = 'Bonjour, je voudrais un devis pour une réparation.';
    if (choix.piece) m += '\n\nPièce : ' + choix.piece;
    if (choix.degat) m += '\nDégât : ' + choix.degat;
    m += '\n\nJe joins une photo. Pouvez-vous me dire si ça se répare ou si la pièce est à remplacer ?';
    return m;
  }

  function rafraichir() {
    var m = messageTexte();
    if (apercu) apercu.textContent = m;
    if (lienWa) lienWa.href = 'https://wa.me/' + TEL + '?text=' + encodeURIComponent(m);
  }

  Array.prototype.forEach.call(document.querySelectorAll('.puces'), function (bloc) {
    var groupe = bloc.dataset.groupe;
    bloc.addEventListener('click', function (e) {
      var b = e.target.closest('.puce');
      if (!b || !bloc.contains(b)) return;

      var deja = b.getAttribute('aria-pressed') === 'true';
      Array.prototype.forEach.call(bloc.querySelectorAll('.puce'), function (autre) {
        autre.setAttribute('aria-pressed', 'false');
      });
      if (deja) {
        choix[groupe] = '';
      } else {
        b.setAttribute('aria-pressed', 'true');
        choix[groupe] = b.dataset.v;
      }
      rafraichir();
    });
  });
  rafraichir();

  /* ---------------------------------------------------------
     ouvert / fermé, à l'heure de Paris
     --------------------------------------------------------- */
  try {
    var maintenant = new Date(new Date().toLocaleString('en-US', { timeZone: 'Europe/Paris' }));
    var jour = maintenant.getDay();
    var minutes = maintenant.getHours() * 60 + maintenant.getMinutes();
    var ouvert = jour >= 1 && jour <= 6 && minutes >= 480 && minutes < 1140;

    var etat = document.getElementById('etat');
    var txt = document.getElementById('etatTxt');
    if (etat && txt) {
      if (ouvert) {
        etat.classList.add('ouvert');
        txt.textContent = 'Ouvert en ce moment';
      } else if (jour === 0) {
        txt.textContent = 'Fermé — réouverture lundi 8 h';
      } else {
        txt.textContent = 'Fermé en ce moment';
      }
    }
    var ligne = document.querySelector('#heures tr[data-j="' + jour + '"]');
    if (ligne) ligne.classList.add('jour');
  } catch (e) { /* l'horaire reste affiché tel quel */ }

  window.pagePrete = true;
})();
