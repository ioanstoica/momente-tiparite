(function () {
  const PHONE = '40726610872';
  const MESSAGE = 'Bună ziua, sunt interesat de o comandă en-gros de bidoane aluminiu sublimabile.';
  const waUrl = 'https://wa.me/' + PHONE + '?text=' + encodeURIComponent(MESSAGE);

  document.querySelectorAll('.wa-link, #waNav').forEach(function (el) {
    el.setAttribute('href', waUrl);
  });

  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', function () {
      navLinks.classList.toggle('is-open');
    });
    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navLinks.classList.remove('is-open');
      });
    });
  }

  const revealEls = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    revealEls.forEach(function (el) { observer.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  }

  const yearEl = document.querySelector('.footer__year');
  if (yearEl) {
    yearEl.textContent = '© ' + new Date().getFullYear() + ' Momente Imprimate. Toate drepturile rezervate.';
  }
})();
