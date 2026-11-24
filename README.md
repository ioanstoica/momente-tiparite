# Momente Tipărite – site

Site static (HTML + CSS + JS), fără dependențe externe. Merge direct pe GitHub Pages.

## Structura

```
index.html              pagina principală
termeni.html            Termeni și condiții
confidentialitate.html  Politica de confidențialitate (GDPR)
css/style.css           stilurile (culorile sunt în :root, la început)
js/main.js              prețuri, WhatsApp, configurator, ninsoare
images/                 logo, favicon și pozele (foto-*.webp/jpg sunt poze temporare, de referință; foto-kit.jpg e foto-cuplu.webp trecută în gri, ca să imite rășina nepictată)
images/archive/         ilustrațiile SVG vechi (hero-glob, galerie-*), păstrate pentru revenire
CNAME                   domeniul momentetiparite.ro (pentru GitHub Pages)
.nojekyll               spune GitHub Pages să servească fișierele exact cum sunt
```

## Ce modifici des

**Prețuri, număr WhatsApp, data limită de Crăciun:** în `js/main.js`, obiectul `CONFIG` de la început.
Se actualizează singure peste tot pe site (oferte, configurator, întrebări frecvente).
Prețurile scrise în HTML sunt doar o rezervă pentru cazul în care JavaScript e dezactivat; dacă vrei să fie identice, schimbă-le și în `index.html` (caută `data-price` și `data-extra`).

**Poze reale în galerie:** pune fotografiile în `images/` (ideal format 4:5, de ex. 1200×1500 px, JPG/WebP sub ~300 KB)
și schimbă în `index.html` atât `src`, cât și `data-full` din secțiunea `GALERIE`.
Când pui poze reale, șterge rândul „Imagini cu titlu ilustrativ.”

**După Crăciun:** șterge blocul `xmas-bar` din `index.html` și, eventual, secțiunea `CRACIUN`.

**Datele firmei:** caută `DE COMPLETAT` în `index.html`, `termeni.html` și `confidentialitate.html`.

## Publicare pe GitHub Pages

1. Creează un repository nou pe GitHub și încarcă **conținutul** acestui folder (nu folderul `web` în sine).
2. Settings → Pages → Source: *Deploy from a branch* → `main` / `/ (root)`.
3. La registrarul de domeniu, pentru `momentetiparite.ro` adaugă înregistrările DNS:
   - 4 înregistrări `A` către: `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - un `CNAME` pentru `www` către `<utilizator-github>.github.io`
4. În Settings → Pages bifează **Enforce HTTPS** după ce certificatul e emis.
