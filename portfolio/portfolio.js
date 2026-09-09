/* Keep static, accessible content in sync with the existing language switch. */
(() => {
  const translate = () => {
    const language = document.documentElement.lang === 'en' ? 'en' : 'de';
    document.querySelectorAll('[data-portfolio-de]').forEach(element => {
      element.textContent = element.getAttribute(`data-portfolio-${language}`);
    });
    document.querySelectorAll('[data-portfolio-alt-de]').forEach(element => {
      element.setAttribute('alt', element.getAttribute(`data-portfolio-alt-${language}`) || '');
    });
    document.querySelectorAll('.work-card').forEach(card => {
      card.setAttribute('aria-label', `${card.querySelector('h3')?.textContent || ''} – ${language === 'en' ? 'View project' : 'Projekt ansehen'}`);
    });
  };
  translate();
  new MutationObserver(translate).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
  // Small pointer-led depth on overview cards. No animation loop, no touch tilt.
  const tiltQuery = matchMedia('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)');
  document.querySelectorAll('.work-card').forEach(card => {
    if (!(card instanceof HTMLElement)) return;
    const reset = () => { card.style.removeProperty('--tilt-x'); card.style.removeProperty('--tilt-y'); };
    card.addEventListener('pointermove', event => {
      if (!tiltQuery.matches || !(event instanceof PointerEvent)) return;
      const box = card.getBoundingClientRect();
      card.style.setProperty('--tilt-x', `${-(event.clientY - box.top - box.height / 2) / box.height * 4}deg`);
      card.style.setProperty('--tilt-y', `${(event.clientX - box.left - box.width / 2) / box.width * 4}deg`);
    }, { passive: true });
    card.addEventListener('pointerleave', reset);
    tiltQuery.addEventListener('change', reset);
  });
})();
