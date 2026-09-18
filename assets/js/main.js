/* Your Excellency Julia — age gate, drawer navigation, and restrained reveal motion. */
(function () {
  'use strict';
  const $ = (selector, context = document) => context.querySelector(selector);
  const $$ = (selector, context = document) => [...context.querySelectorAll(selector)];
  function initAgeGate() {
    const gate = $('#age-gate'); if (!gate) return; let verified = false;
    try { const stored = JSON.parse(localStorage.getItem('julia_age_verified_v1') || 'null'); verified = Boolean(stored && Date.now() < stored.expiry); } catch (error) {}
    if (verified) { gate.hidden = true; return; }
    $('[data-age-enter]', gate)?.addEventListener('click', () => { try { localStorage.setItem('julia_age_verified_v1', JSON.stringify({ verified: true, expiry: Date.now() + 30 * 24 * 60 * 60 * 1000 })); } catch (error) {} gate.hidden = true; });
    $('[data-age-exit]', gate)?.addEventListener('click', () => { window.location.href = 'https://www.google.com'; });
  }
  function initNav() {
    const drawer = $('#nav-drawer'); const setOpen = (open) => { drawer?.classList.toggle('is-open', open); drawer?.toggleAttribute('inert', !open); drawer?.setAttribute('aria-hidden', String(!open)); document.body.style.overflow = open ? 'hidden' : ''; };
    $('[data-nav-open]')?.addEventListener('click', () => setOpen(true)); $('[data-nav-close]')?.addEventListener('click', () => setOpen(false)); $$('.nav-drawer a').forEach((link) => link.addEventListener('click', () => setOpen(false))); document.addEventListener('keydown', (event) => { if (event.key === 'Escape') setOpen(false); });
  }
  function initReveals() {
    const items = $$('[data-reveal]'); if (!items.length) return; if (!('IntersectionObserver' in window)) { items.forEach((item) => item.classList.add('is-revealed')); return; }
    const observer = new IntersectionObserver((entries, instance) => entries.forEach((entry) => { if (entry.isIntersecting) { entry.target.classList.add('is-revealed'); instance.unobserve(entry.target); } }), { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }); items.forEach((item) => observer.observe(item));
  }
  function initGallerySlideshow() {
    const gallery = $('.gallery'); if (!gallery) return;
    const figures = $$('.gallery figure img', gallery); if (figures.length < 2) return;
    const sources = figures.map((image) => ({ src: image.getAttribute('src'), alt: image.getAttribute('alt') }));
    let offset = 0; let timer;
    const render = () => figures.forEach((image, index) => {
      const next = sources[(index + offset) % sources.length];
      image.classList.add('is-changing');
      window.setTimeout(() => { image.src = next.src; image.alt = next.alt; image.classList.remove('is-changing'); }, 220);
    });
    const start = () => { window.clearInterval(timer); timer = window.setInterval(() => { offset = (offset + 1) % sources.length; render(); }, 6000); };
    const stop = () => window.clearInterval(timer);
    gallery.addEventListener('mouseenter', stop); gallery.addEventListener('mouseleave', start);
    gallery.addEventListener('focusin', stop); gallery.addEventListener('focusout', start);
    start();
  }
  function initHeroSlideshow() {
    const hero = $('#hero-image'); if (!hero) return;
    const gallerySources = $$('.gallery img').map((image) => ({ src: image.getAttribute('src'), alt: image.getAttribute('alt') })).filter((image) => image.src);
    const sources = [{ src: hero.getAttribute('src'), alt: hero.getAttribute('alt') }, ...gallerySources.filter((image) => image.src !== hero.getAttribute('src'))];
    if (sources.length < 2) return;
    let index = 0;
    window.setInterval(() => {
      index = (index + 1) % sources.length;
      const next = sources[index];
      hero.classList.add('is-changing');
      window.setTimeout(() => { hero.src = next.src; hero.alt = next.alt; hero.classList.remove('is-changing'); }, 220);
    }, 6000);
  }
  document.addEventListener('DOMContentLoaded', () => { initAgeGate(); initNav(); initReveals(); initGallerySlideshow(); initHeroSlideshow(); });
})();
