/* C2L Rénov — maquette
   Un seul mécanisme : les deux réponses du visiteur refont la pièce
   affichée et composent le message WhatsApp. Sans ce fichier la page
   reste lisible et le bouton part avec un message générique. */

(function () {
  'use strict';

  var TEL = '33628706921';
  var NS = 'http://www.w3.org/2000/svg';

  var solMotif = document.getElementById('solMotif');
  var murMotif = document.getElementById('murMotif');
  var murFond = document.getElementById('murFond');
  var solFond = document.getElementById('solFond');
  var objet = document.getElementById('objet');
  var etatPiece = document.getElementById('pieceEtat');
  var apercu = document.getElementById('apercu');
  var lienWa = document.getElementById('lienWa');

  var choix = { piece: 'sdb', travail: 'carrelage' };
  var libelles = { piece: 'Salle de bains', travail: 'Carrelage' };

  /* ---------------------------------------------------------
     petits utilitaires de dessin
     --------------------------------------------------------- */
  function el(nom, attrs, classe, retard) {
    var n = document.createElementNS(NS, nom);
    for (var k in attrs) n.setAttribute(k, attrs[k]);
    if (classe) n.setAttribute('class', classe);
    if (retard != null) n.style.animationDelay = retard + 'ms';
    return n;
  }
  function vider(g) { while (g.firstChild) g.removeChild(g.firstChild); }

  /* ---------------------------------------------------------
     les sols
     --------------------------------------------------------- */
  function solCarrele() {
    var larg = 118, haut = 52, jeu = 4, i = 0;
    for (var y = 256; y < 420; y += haut + jeu) {
      var decal = ((y - 256) / (haut + jeu)) % 2 ? -58 : 0;
      for (var x = decal; x < 600; x += larg + jeu) {
        solMotif.appendChild(el('rect', {
          x: x, y: y, width: larg, height: haut, rx: 1,
          fill: i % 3 === 0 ? '#DAD5CB' : (i % 3 === 1 ? '#D2CCC1' : '#E0DBD2')
        }, 'tuile', i * 22));
        i++;
      }
    }
  }

  function solParquet() {
    var haut = 22, jeu = 3, i = 0;
    for (var y = 256; y < 420; y += haut + jeu) {
      var rang = (y - 256) / (haut + jeu);
      var x = rang % 2 ? -120 : -40;
      while (x < 600) {
        var larg = rang % 2 ? 250 : 190;
        solMotif.appendChild(el('rect', {
          x: x, y: y, width: larg - jeu, height: haut, rx: 1,
          fill: i % 4 === 0 ? '#C39A6B' : (i % 4 === 1 ? '#B98E5F' : (i % 4 === 2 ? '#CDA779' : '#A9814F'))
        }, 'lame', i * 26));
        x += larg;
        i++;
      }
    }
  }

  function solBrut() {
    solFond.setAttribute('fill', '#C8C9C4');
    for (var i = 0; i < 5; i++) {
      solMotif.appendChild(el('path', {
        d: 'M' + (40 + i * 130) + ' 420 q30 -60 -10 -168',
        stroke: '#BDBEB9', 'stroke-width': 2, fill: 'none'
      }, 'tuile', i * 40));
    }
  }

  /* ---------------------------------------------------------
     les murs
     --------------------------------------------------------- */
  function murPeint(couleur) {
    murFond.setAttribute('fill', couleur);
  }

  function murPlaco() {
    murFond.setAttribute('fill', '#BFC5C2');
    var i = 0;
    for (var x = 0; x <= 600; x += 120) {
      murMotif.appendChild(el('rect', { x: x - 7, y: 0, width: 14, height: 252, fill: '#E7EAE8' }, 'tuile', i * 60));
      for (var y = 26; y < 252; y += 42) {
        murMotif.appendChild(el('circle', { cx: x, cy: y, r: 2.4, fill: '#98A09C' }, 'tuile', i * 60 + 120));
      }
      i++;
    }
  }

  function murFaience() {
    murFond.setAttribute('fill', '#CFD6D2');
    var larg = 74, haut = 36, jeu = 3, i = 0;
    for (var y = 44; y < 252; y += haut + jeu) {
      var decal = ((y - 44) / (haut + jeu)) % 2 ? -37 : 0;
      for (var x = decal; x < 600; x += larg + jeu) {
        murMotif.appendChild(el('rect', {
          x: x, y: y, width: larg, height: haut, rx: 1,
          fill: i % 2 ? '#E8EDEA' : '#DFE6E2'
        }, 'tuile', i * 16));
        i++;
      }
    }
  }

  /* ---------------------------------------------------------
     ce qu'il y a dans la pièce
     --------------------------------------------------------- */
  var objets = {
    sdb: 'M356 300 v-38 q0 -14 14 -14 h150 q14 0 14 14 v38 ' +
         'M370 300 v12 M520 300 v12 ' +
         'M540 248 v-40 h-26 M540 208 m-7 0 a7 7 0 1 0 14 0 a7 7 0 1 0 -14 0',
    cuisine: 'M344 266 h216 v10 h-216 z M356 276 v26 h192 v-26 ' +
             'M392 258 h60 v8 h-60 z M486 266 v-24 q0 -10 -12 -10 ' +
             'M356 288 h192',
    sejour: 'M344 302 v-42 q0 -12 12 -12 h188 q12 0 12 12 v42 ' +
            'M366 248 v-18 q0 -10 10 -10 h148 q10 0 10 10 v18 ' +
            'M450 220 v28 M352 302 v10 M548 302 v10',
    entree: 'M398 302 v-146 h112 v146 M398 156 h112 ' +
            'M492 232 m-5 0 a5 5 0 1 0 10 0 a5 5 0 1 0 -10 0 ' +
            'M540 196 h34 M548 196 v10 M566 196 v10',
    appart: 'M340 196 h224 v106 h-224 z M436 196 v106 M436 248 h128 ' +
            'M340 240 h40 M368 196 v18'
  };

  /* ---------------------------------------------------------
     redessine tout
     --------------------------------------------------------- */
  function refaire() {
    vider(solMotif); vider(murMotif);
    murMotif.removeAttribute('style');
    solFond.setAttribute('fill', '#CBD3CE');

    var t = choix.travail, p = choix.piece;

    if (t === 'carrelage' || t === 'tout') {
      solCarrele();
      if (p === 'sdb' || t === 'tout') murFaience(); else murPeint('#E3E8E4');
    } else if (t === 'parquet') {
      solParquet();
      murPeint('#E6E9E3');
    } else if (t === 'peinture') {
      solBrut();
      murPeint('#DCE7E2');
    } else if (t === 'placo') {
      solBrut();
      murPlaco();
    }

    objet.setAttribute('d', '');
    var d = objets[p] || '';
    vider(objet);
    if (d) objet.appendChild(el('path', { d: d }));

    etatPiece.textContent = libelles.piece + ' · ' + libelles.travail.toLowerCase();
    ecrire();
  }

  /* ---------------------------------------------------------
     le message
     --------------------------------------------------------- */
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

  /* ---------------------------------------------------------
     les boutons
     --------------------------------------------------------- */
  Array.prototype.forEach.call(document.querySelectorAll('.puces'), function (bloc) {
    var jeu = bloc.dataset.jeu;
    bloc.addEventListener('click', function (e) {
      var b = e.target.closest('.puce');
      if (!b || !bloc.contains(b)) return;
      Array.prototype.forEach.call(bloc.querySelectorAll('.puce'), function (autre) {
        autre.setAttribute('aria-pressed', 'false');
      });
      b.setAttribute('aria-pressed', 'true');
      choix[jeu] = b.dataset.v;
      libelles[jeu] = b.dataset.libelle;
      refaire();
    });
  });

  refaire();

  /* ---------------------------------------------------------
     le carrelage se pose en tête de chaque section,
     au moment où elle arrive à l'écran
     --------------------------------------------------------- */
  var bandes = document.querySelectorAll('.pose');
  Array.prototype.forEach.call(bandes, function (b) {
    var n = 26;
    for (var i = 0; i < n; i++) {
      var t = document.createElement('i');
      t.style.animationDelay = (i * 34) + 'ms';
      b.appendChild(t);
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
    setTimeout(poserTout, 4000);
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
