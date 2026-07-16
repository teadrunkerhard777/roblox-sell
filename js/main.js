document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-year]').forEach((node) => { node.textContent = new Date().getFullYear(); });
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.site-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const open = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!open));
      nav.classList.toggle('is-open', !open);
    });
    nav.addEventListener('click', (event) => {
      if (event.target.closest('a')) { toggle.setAttribute('aria-expanded', 'false'); nav.classList.remove('is-open'); }
    });
  }
  document.querySelectorAll('.article-toggle').forEach((button) => {
    button.addEventListener('click', () => {
      const open = button.getAttribute('aria-expanded') === 'true';
      button.setAttribute('aria-expanded', String(!open));
      button.closest('.guide-body').querySelector('.article-extra').classList.toggle('is-open', !open);
      button.firstChild.textContent = open ? 'Читать совет ' : 'Свернуть ';
    });
  });
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!reduced && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); }
    }), { threshold: 0.12 });
    document.querySelectorAll('.reveal').forEach((node) => observer.observe(node));
  } else { document.querySelectorAll('.reveal').forEach((node) => node.classList.add('is-visible')); }
});
