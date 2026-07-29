/**
 * navbar.js — Scroll-aware Netflix navbar
 */

export function initNavbar() {
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');

  // ── Scroll awareness ──
  const onScroll = () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Active link tracking
    const sections = ['home', 'rituals', 'timeline'];
    let active = 'home';

    sections.forEach(id => {
      const el = document.getElementById(id === 'home' ? 'hero-banner' : id);
      if (!el) return;
      const rect = el.getBoundingClientRect();
      if (rect.top <= 100) active = id;
    });

    navLinks.forEach(link => {
      const href = link.getAttribute('href')?.replace('#', '');
      link.classList.toggle('active', href === active);
    });
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run once on init

  // ── Smooth scroll for anchor links ──
  navLinks.forEach(link => {
    link.addEventListener('click', e => {
      const href = link.getAttribute('href');
      if (!href || !href.startsWith('#')) return;
      e.preventDefault();
      const target = href === '#home'
        ? document.getElementById('hero-banner')
        : document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
}
