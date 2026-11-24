/* =========================================================
   Momente Tipărite — script principal

   >>> AICI modifici prețurile, numărul de WhatsApp și
       data limită pentru Crăciun. Restul se actualizează singur.
   ========================================================= */
const CONFIG = {
  whatsapp: '40740123849',            // numărul, în format internațional, fără + și fără spații
  christmasDeadline: '8 decembrie',   // apare în bara de sus, la secțiunea Crăciun și în întrebări
  // mesajul trimis de butoanele „Cere randarea 3D”
  renderMessage: 'Bună! Aș vrea să văd cum ar arăta figurina mea în 3D. Vă trimit poza aici.',
  maxPersons: 6,
  offers: {
    kit: {
      name: 'Kit Atelier (figurină + set de pictură)',
      price: 149,   // lei, pentru 1 persoană
      extra: 50,    // lei, pentru fiecare persoană / animăluț în plus
    },
    color: {
      name: 'Figurina Color (tipărită multicolor)',
      price: 249,
      extra: 90,
    },
  },
};

(function () {
  'use strict';

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Prețuri și texte din CONFIG ---------- */
  $$('[data-price]').forEach((el) => {
    const offer = CONFIG.offers[el.dataset.price];
    if (offer) el.textContent = offer.price;
  });
  $$('[data-extra]').forEach((el) => {
    const offer = CONFIG.offers[el.dataset.extra];
    if (offer) el.textContent = offer.extra;
  });
  $$('[data-config]').forEach((el) => {
    const value = CONFIG[el.dataset.config];
    if (value) el.textContent = value;
  });

  /* ---------- Link-uri WhatsApp ---------- */
  const waLink = (text) =>
    'https://wa.me/' + CONFIG.whatsapp + (text ? '?text=' + encodeURIComponent(text) : '');

  $$('.js-wa').forEach((a) => {
    a.href = waLink('Bună! Aș dori mai multe informații despre figurinele Momente Tipărite.');
    a.target = '_blank';
    a.rel = 'noopener';
  });

  $$('.js-render').forEach((a) => {
    a.href = waLink(CONFIG.renderMessage);
    a.target = '_blank';
    a.rel = 'noopener';
  });

  /* ---------- Anul din footer ---------- */
  const year = $('#year');
  if (year) year.textContent = new Date().getFullYear();

  /* ---------- Bara de Crăciun ---------- */
  const bar = $('#xmasBar');
  if (bar) {
    try {
      if (sessionStorage.getItem('xmasBarClosed') === '1') bar.classList.add('is-hidden');
    } catch (e) { /* stocare indisponibilă */ }
    $('.xmas-bar__close', bar).addEventListener('click', () => {
      bar.classList.add('is-hidden');
      try { sessionStorage.setItem('xmasBarClosed', '1'); } catch (e) { /* ignorat */ }
    });
  }

  /* ---------- Header + meniu mobil ---------- */
  const header = $('#siteHeader');
  const onScroll = () => header && header.classList.toggle('is-scrolled', window.scrollY > 8);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  const toggle = $('.nav-toggle');
  const nav = $('#siteNav');
  if (toggle && nav) {
    const setOpen = (open) => {
      toggle.setAttribute('aria-expanded', String(open));
      nav.classList.toggle('is-open', open);
    };
    toggle.addEventListener('click', () => setOpen(toggle.getAttribute('aria-expanded') !== 'true'));
    $$('a', nav).forEach((a) => a.addEventListener('click', () => setOpen(false)));
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setOpen(false); });
  }

  /* ---------- Configurator comandă ---------- */
  const form = $('#orderForm');
  if (form) {
    const personsEl = $('#persons');
    const totalEl = $('#total');
    const minusBtn = $('[data-step="-1"]', form);
    const plusBtn = $('[data-step="1"]', form);
    let persons = 1;

    const selectedOffer = () => {
      const checked = $('input[name="offer"]:checked', form);
      return checked ? checked.value : 'color';
    };

    const calcTotal = () => {
      const o = CONFIG.offers[selectedOffer()];
      return o.price + (persons - 1) * o.extra;
    };

    const update = () => {
      personsEl.textContent = persons;
      minusBtn.disabled = persons <= 1;
      plusBtn.disabled = persons >= CONFIG.maxPersons;
      totalEl.textContent = calcTotal();
    };

    $$('[data-step]', form).forEach((btn) =>
      btn.addEventListener('click', () => {
        persons = Math.min(CONFIG.maxPersons, Math.max(1, persons + Number(btn.dataset.step)));
        update();
      })
    );
    $$('input[name="offer"]', form).forEach((r) => r.addEventListener('change', update));

    // Butoanele „Aleg…” de pe cardurile de ofertă preselectează varianta
    $$('[data-choose]').forEach((btn) =>
      btn.addEventListener('click', () => {
        const radio = $('input[name="offer"][value="' + btn.dataset.choose + '"]', form);
        if (radio) { radio.checked = true; update(); }
      })
    );

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const offer = CONFIG.offers[selectedOffer()];
      const occasion = $('#occasion').value;
      const details = $('#details').value.trim();

      const lines = [
        'Bună! Aș dori o figurină Momente Tipărite – varianta ' + offer.name + '.',
        'Persoane / animăluțe: ' + persons,
        'Ocazie: ' + occasion,
      ];
      if (details) lines.push('Detalii: ' + details);
      lines.push('Preț estimat: ' + calcTotal() + ' lei');
      lines.push('Vă trimit poza aici.');

      window.open(waLink(lines.join('\n')), '_blank', 'noopener');
    });

    update();
  }

  /* ---------- Galerie: lightbox ---------- */
  const lightbox = $('#lightbox');
  if (lightbox && typeof lightbox.showModal === 'function') {
    const img = $('img', lightbox);
    const caption = $('.lightbox__caption', lightbox);
    $$('.gallery__btn').forEach((btn) =>
      btn.addEventListener('click', () => {
        const thumb = $('img', btn);
        const fig = btn.closest('figure');
        img.src = btn.dataset.full;
        img.alt = thumb ? thumb.alt : '';
        caption.textContent = fig ? $('figcaption', fig).textContent : '';
        lightbox.showModal();
      })
    );
    $('.lightbox__close', lightbox).addEventListener('click', () => lightbox.close());
    lightbox.addEventListener('click', (e) => { if (e.target === lightbox) lightbox.close(); });
  }

  /* ---------- Apariție la scroll ---------- */
  if (!reduceMotion && 'IntersectionObserver' in window) {
    const targets = $$('.step, .offer, .gallery__item, .gift, .faq details, .contact-card, .section-head');
    targets.forEach((el) => el.classList.add('reveal'));
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    targets.forEach((el) => io.observe(el));
  }

  /* ---------- Ninsoare discretă în hero ---------- */
  const canvas = $('#snow');
  if (canvas && !reduceMotion && canvas.getContext) {
    const ctx = canvas.getContext('2d');
    let flakes = [];
    let w = 0, h = 0, dpr = 1, running = true, rafId = 0;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = rect.width; h = rect.height;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.round(Math.min(90, w / 14));
      flakes = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: 1 + Math.random() * 2.6,
        s: 0.25 + Math.random() * 0.6,
        drift: Math.random() * Math.PI * 2,
        o: 0.35 + Math.random() * 0.5,
      }));
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      for (const f of flakes) {
        f.y += f.s;
        f.drift += 0.01;
        f.x += Math.sin(f.drift) * 0.35;
        if (f.y > h + 5) { f.y = -5; f.x = Math.random() * w; }
        ctx.beginPath();
        ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(184, 146, 74,' + (f.o * 0.55) + ')';
        ctx.fill();
      }
      if (running) rafId = requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener('resize', resize);

    // Oprim animația când hero-ul nu e vizibil, ca să nu consumăm resurse
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(([entry]) => {
        running = entry.isIntersecting;
        cancelAnimationFrame(rafId);
        if (running) rafId = requestAnimationFrame(draw);
      }).observe(canvas);
    } else {
      rafId = requestAnimationFrame(draw);
    }
  }
})();
