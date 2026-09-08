/* C2L Rénov — maquette
   Trois choses : les deux réponses composent le message WhatsApp,
   le carrelage se pose en tête de section au défilement, et l'état
   d'ouverture se calcule à l'heure de Paris.
   Sans ce fichier la page reste lisible et le bouton part avec un
   message générique. */

(function () {
  'use strict';

  var TEL = '33628706921';

  /* ---------------------------------------------------------
     les deux réponses composent le message
     --------------------------------------------------------- */
  var libelles = { piece: 'Salle de bains', travail: 'Carrelage' };
  var apercu = document.getElementById('apercu');
  var lienWa = document.getElementById('lienWa');

  function texte() {
    var m = 'Bonjour, je voudrais un devis.';
    m += '\n\nPièce : ' + libelles.piece;
    m += '\nÀ refaire : ' + libelles.travail;
    m += '\n\nJe joins une photo. Pouvez-vous me dire ce que ça donnerait et sous quel délai ?';
    return m;
  }

  function ecrire() {
    var m = texte();
    if (apercu) apercu.textContent = m;
    if (lienWa) lienWa.href = 'https://wa.me/' + TEL + '?text=' + encodeURIComponent(m);
  }

  Array.prototype.forEach.call(document.querySelectorAll('.puces'), function (bloc) {
    var jeu = bloc.dataset.jeu;
    bloc.addEventListener('click', function (e) {
      var b = e.target.closest('.puce');
      if (!b || !bloc.contains(b)) return;
      Array.prototype.forEach.call(bloc.querySelectorAll('.puce'), function (autre) {
        autre.setAttribute('aria-pressed', 'false');
      });
      b.setAttribute('aria-pressed', 'true');
      libelles[jeu] = b.dataset.libelle;
      ecrire();
    });
  });
  ecrire();

  /* ---------------------------------------------------------
     le carrelage se pose en tête de chaque section, au moment
     où elle arrive à l'écran : la page se carrèle de haut en bas
     --------------------------------------------------------- */
  var bandes = document.querySelectorAll('.pose');
  Array.prototype.forEach.call(bandes, function (b) {
    for (var i = 0; i < 26; i++) {
      var carreau = document.createElement('i');
      carreau.style.animationDelay = (i * 34) + 'ms';
      b.appendChild(carreau);
    }
  });

  function poserTout() {
    Array.prototype.forEach.call(bandes, function (b) { b.classList.add('pose-va'); });
  }

  if (!('IntersectionObserver' in window)) {
    poserTout();
  } else {
    var oi = new IntersectionObserver(function (entrees) {
      entrees.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('pose-va'); oi.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.05 });
    Array.prototype.forEach.call(bandes, function (b) { oi.observe(b); });
    setTimeout(poserTout, 4000);   /* filet de sécurité */
  }

  /* ---------------------------------------------------------
     ouvert ou fermé, à l'heure de Paris
     --------------------------------------------------------- */
  try {
    var now = new Date(new Date().toLocaleString('en-US', { timeZone: 'Europe/Paris' }));
    var j = now.getDay();
    var min = now.getHours() * 60 + now.getMinutes();
    var ouvert = (j >= 1 && j <= 5 && min >= 420 && min < 1200) ||
                 (j === 6 && min >= 480 && min < 1020);

    var etat = document.getElementById('etat');
    var txt = document.getElementById('etatTxt');
    if (etat && txt) {
      if (ouvert) {
        etat.classList.add('ouvert');
        txt.textContent = 'Ouvert en ce moment';
      } else if (j === 0) {
        txt.textContent = 'Fermé — ouvre lundi à 7 h';
      } else {
        txt.textContent = 'Fermé en ce moment';
      }
    }
    var ligne = document.querySelector('#heures tr[data-j="' + j + '"]');
    if (ligne) ligne.classList.add('jour');
  } catch (e) { /* le tableau reste affiché tel quel */ }

  window.pagePrete = true;
})();
