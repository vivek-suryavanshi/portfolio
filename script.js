// Sun intro — plays on every full page load (not on in-page anchor nav, since that never reloads the page)
(function () {
  const html = document.documentElement;
  const dot = document.querySelector('.logo .dot');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function revealHero() {
    html.classList.remove('intro-pending');
  }

  if (!dot || reducedMotion) {
    revealHero();
    return;
  }

  const overlay = document.createElement('div');
  overlay.className = 'intro-overlay';
  overlay.setAttribute('aria-hidden', 'true');
  overlay.innerHTML = '<div class="sun"></div><div class="flash"></div>';
  document.body.appendChild(overlay);

  const sun = overlay.querySelector('.sun');
  const rect = dot.getBoundingClientRect();
  sun.style.setProperty('--sun-end-x', `${rect.left + rect.width / 2}px`);
  sun.style.setProperty('--sun-end-y', `${rect.top + rect.height / 2}px`);

  setTimeout(revealHero, 950);
  setTimeout(() => { if (overlay.parentNode) overlay.remove(); }, 1500);
})();

// Scroll-triggered reveal animations
const revealEls = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0, rootMargin: '0px 0px 1000px 0px' });

revealEls.forEach((el) => revealObserver.observe(el));

// Active nav link highlighting based on scroll position
const sections = document.querySelectorAll('main section[id]');
const navLinks = document.querySelectorAll('.nav-link');

const navObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    const id = entry.target.getAttribute('id');
    const link = document.querySelector(`.nav-link[href="#${id}"]`);
    if (!link) return;
    if (entry.isIntersecting) {
      navLinks.forEach((l) => l.classList.remove('active'));
      link.classList.add('active');
    }
  });
}, { rootMargin: '-40% 0px -55% 0px', threshold: 0 });

sections.forEach((section) => navObserver.observe(section));

// Mobile nav toggle
const navToggle = document.getElementById('navToggle');
const navLinksList = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
  navLinksList.classList.toggle('open');
});

navLinksList.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => navLinksList.classList.remove('open'));
});
