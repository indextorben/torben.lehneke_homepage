// Load scroll choreography only on capable layouts; content never waits for it.
const motionQuery = matchMedia('(min-width: 761px) and (prefers-reduced-motion: no-preference)');
let requested = false;
function loadMotion() {
  if (!motionQuery.matches || requested) return;
  requested = true;
  import('./showcase-motion.js').then(module => module.mountShowcase()).catch(() => {
    requested = false;
    document.body.classList.remove('story-enhanced');
  });
}
if (document.readyState === 'complete') loadMotion();
else window.addEventListener('load', loadMotion, { once: true });
motionQuery.addEventListener('change', loadMotion);
