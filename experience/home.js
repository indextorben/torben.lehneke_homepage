// Only load choreography where it is useful. Static HTML is the complete fallback.
const motion = matchMedia('(min-width: 981px) and (prefers-reduced-motion: no-preference)');
let loaded = false;
/** @param {string} path */
function library(path) {
  return new Promise((resolve,reject)=>{
    const script=document.createElement('script');
    script.src=new URL(path,import.meta.url).href;
    script.onload=()=>resolve(undefined);
    script.onerror=()=>{script.remove();reject(new Error('Motion library unavailable'));};
    document.head.append(script);
  });
}
async function enable() {
  if (!motion.matches || loaded) return;
  loaded = true;
  try {
    if(!window.gsap)await library('../portfolio/vendor/gsap.min.js');
    if(!window.ScrollTrigger)await library('../portfolio/vendor/ScrollTrigger.min.js');
    /** @type {typeof import('./motion.js')} */
    const module = await import(new URL('./motion.js?v=2',import.meta.url).href); module.mount();
  }
  catch { loaded = false; /* All content remains readable without the enhancement. */ }
}
if (document.readyState === 'complete') void enable();
else window.addEventListener('load', () => void enable(), { once: true });
motion.addEventListener('change', () => void enable());
