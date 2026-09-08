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
     le sol de la pièce : une vraie grille en perspective.
     Le fond de la pièce est en haut (y = 250), l'entrée en bas
     (y = 400) ; les rangs s'écartent en approchant du regard.
     --------------------------------------------------------- */
  var SVG = 'http://www.w3.org/2000/svg';
  var Y_FOND = 250, Y_BORD = 400, RANGS = 7, COLS = 6;

  var TERRES = ['#C89A6B', '#BE8F60', '#C6A277', '#B98757', '#CFA97F', '#B8814F'];

  function yDuRang(i) {
    /* les rangs se resserrent vers le fond : progression en puissance */
    return Y_FOND + (Y_BORD - Y_FOND) * Math.pow(i / RANGS, 1.8);
  }
  function bordsA(y) {
    var t = (y - Y_FOND) / (Y_BORD - Y_FOND);
    return { g: 200 - 160 * t, d: 400 + 160 * t };
  }

  var sol = document.querySelector('.carreaux');
  var vieux = document.querySelector('.vieux-sol');
  var colle = document.querySelector('.colle');
  var croix = document.querySelector('.croisillons');

  if (sol) {
    for (var r = 0; r < RANGS; r++) {
      var yh = yDuRang(r), yb = yDuRang(r + 1);
      var bh = bordsA(yh), bb = bordsA(yb);
      var creux = (yb - yh) * 0.055 + 0.7;          /* le joint, plus large devant */

      for (var c = 0; c < COLS; c++) {
        var x1h = bh.g + (bh.d - bh.g) * (c / COLS) + creux;
        var x2h = bh.g + (bh.d - bh.g) * ((c + 1) / COLS) - creux;
        var x1b = bb.g + (bb.d - bb.g) * (c / COLS) + creux;
        var x2b = bb.g + (bb.d - bb.g) * ((c + 1) / COLS) - creux;

        var q = document.createElementNS(SVG, 'polygon');
        q.setAttribute('points',
          x1h.toFixed(1) + ',' + (yh + creux).toFixed(1) + ' ' +
          x2h.toFixed(1) + ',' + (yh + creux).toFixed(1) + ' ' +
          x2b.toFixed(1) + ',' + (yb - creux).toFixed(1) + ' ' +
          x1b.toFixed(1) + ',' + (yb - creux).toFixed(1));
        q.setAttribute('fill', TERRES[(r * COLS + c * 3) % TERRES.length]);
        sol.appendChild(q);

        /* le vieux carrelage : mêmes carreaux, ternes et ébréchés */
        if (vieux) {
          var v = q.cloneNode(false);
          v.setAttribute('fill', (r + c) % 3 === 0 ? '#6F6455' : '#8A7E6C');
          vieux.appendChild(v);
        }

        /* les croisillons, aux angles des carreaux */
        if (croix && r > 0 && c > 0) {
          var k = document.createElementNS(SVG, 'path');
          var s = 2 + (yh - Y_FOND) / 60;
          k.setAttribute('d', 'M' + x1h.toFixed(1) + ' ' + (yh - s).toFixed(1) +
                              'v' + (s * 2).toFixed(1) +
                              'M' + (x1h - s).toFixed(1) + ' ' + yh.toFixed(1) +
                              'h' + (s * 2).toFixed(1));
          k.setAttribute('stroke', '#8FA0B4');
          k.setAttribute('stroke-width', (s * 0.7).toFixed(1));
          k.setAttribute('fill', 'none');
          croix.appendChild(k);
        }
      }

      /* la colle peignée, un sillon par rang */
      if (colle) {
        var p = document.createElementNS(SVG, 'path');
        var pas = (bh.d - bh.g) / 26;
        var d = '';
        for (var s2 = 0; s2 < 26; s2++) {
          var xa = bh.g + pas * s2, xb = bb.g + ((bb.d - bb.g) / 26) * s2;
          d += 'M' + xa.toFixed(1) + ' ' + yh.toFixed(1) + 'L' + xb.toFixed(1) + ' ' + yb.toFixed(1);
        }
        p.setAttribute('d', d);
        p.setAttribute('stroke', '#9C8A6E');
        p.setAttribute('stroke-width', '1.6');
        p.setAttribute('fill', 'none');
        colle.appendChild(p);
      }
    }
  }

  /* quelques gravats pendant la dépose */
  var grav = document.querySelector('.gravats');
  if (grav) {
    var pos = [[150, 372], [268, 344], [392, 358], [470, 386], [214, 392], [330, 378]];
    pos.forEach(function (p, i) {
      var g = document.createElementNS(SVG, 'polygon');
      var x = p[0], y = p[1], t = 6 + (i % 3) * 3;
      g.setAttribute('points', x + ',' + y + ' ' + (x + t) + ',' + (y - t * 0.6) + ' ' +
                               (x + t * 1.4) + ',' + (y + t * 0.5) + ' ' + (x + t * 0.3) + ',' + (y + t * 0.8));
      grav.appendChild(g);
    });
  }

  /* ---------------------------------------------------------
     le carrelage se pose en tête de chaque section, au moment
     où elle arrive à l'écran : la page se carrèle de haut en bas
     --------------------------------------------------------- */
  var bandes = document.querySelectorAll('.pose');
  Array.prototype.forEach.call(bandes, function (b) {
    for (var i = 0; i < 40; i++) {
      var carreau = document.createElement('i');
      carreau.style.background = TERRES[(i * 5 + Math.floor(i / 20)) % TERRES.length];
      carreau.style.animationDelay = (i * 26) + 'ms';
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
