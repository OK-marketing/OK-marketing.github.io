/* Garage k Montreuil — maquette
   Rien d'indispensable ne dépend de ce fichier : sans lui la page
   reste lisible, le bouton WhatsApp part avec un message générique. */

(function () {
  'use strict';

  var doux = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var TEL = '33749215172';

  /* ---------------------------------------------------------
     l'outil : deux touches composent le message
     --------------------------------------------------------- */
  var choix = { piece: '', degat: '' };
  var apercu = document.getElementById('apercu');
  var lienWa = document.getElementById('lienWa');

  function messageTexte() {
    var m = 'Bonjour, je voudrais un devis pour une réparation.';
    if (choix.piece) m += '\n\nPièce : ' + choix.piece;
    if (choix.degat) m += '\nDégât : ' + choix.degat;
    if (choix.piece || choix.degat) {
      m += '\n\nJe joins une photo. Pouvez-vous me dire si ça se répare ou si la pièce est à remplacer ?';
    } else {
      m = "Bonjour, j'ai un dégât sur ma voiture. Pouvez-vous me dire ce que ça donne ?";
    }
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
     apparitions : filet de sécurité obligatoire
     --------------------------------------------------------- */
  var blocs = document.querySelectorAll('.app, .vue');
  function toutMontrer() {
    Array.prototype.forEach.call(blocs, function (el) { el.classList.add('vu'); });
  }
  if (doux || !('IntersectionObserver' in window)) {
    toutMontrer();
  } else {
    var oi = new IntersectionObserver(function (entrees) {
      entrees.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('vu'); oi.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -6% 0px', threshold: 0.1 });
    Array.prototype.forEach.call(blocs, function (el) { oi.observe(el); });
    setTimeout(toutMontrer, 3000);
  }

  /* ---------------------------------------------------------
     la lumière suit la souris quand il y en a une ;
     sinon elle dérive toute seule (voir styles.css)
     --------------------------------------------------------- */
  if (!doux && window.matchMedia('(hover: hover)').matches) {
    var enAttente = false, px = 24, py = 18;
    window.addEventListener('pointermove', function (e) {
      px = (e.clientX / window.innerWidth) * 100;
      py = (e.clientY / window.innerHeight) * 100;
      if (enAttente) return;
      enAttente = true;
      requestAnimationFrame(function () {
        enAttente = false;
        document.documentElement.classList.add('souris');
        document.documentElement.style.setProperty('--mx', px.toFixed(1) + '%');
        document.documentElement.style.setProperty('--my', py.toFixed(1) + '%');
      });
    }, { passive: true });
  }

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
