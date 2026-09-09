/** Scroll-linked DOM 3D. No render loop, WebGL context or scroll interception. */
export function mountShowcase() {
  const gsap = window.gsap;
  const ScrollTrigger = window.ScrollTrigger;
  if (!gsap || !ScrollTrigger) return;
  gsap.registerPlugin(ScrollTrigger);
  const media = gsap.matchMedia();
  media.add('(min-width: 761px) and (prefers-reduced-motion: no-preference)', () => {
    document.body.classList.add('story-enhanced');
    const hero = document.querySelector('.showcase-hero');
    const orbit = document.querySelector('.device-orbit');
    const timeline = gsap.timeline({ scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: .5 } });
    timeline.to('.hero-stage .device', { yPercent: -10, rotationY: 16, rotationZ: 5, scale: 1.07, ease: 'none' }, 0);
    timeline.to('.hero-stage .companion', { xPercent: i => i % 2 ? 26 : -26, yPercent: i => i % 2 ? -18 : 24, rotationZ: i => i % 2 ? 12 : -12, ease: 'none' }, 0);
    timeline.to('.hero-stage .stage-halo', { scale: 1.3, opacity: .3, ease: 'none' }, 0);
    gsap.fromTo('.statement-type', { scale: .88, color: '#50535b' }, { scale: 1, color: '#f4f5f7', ease: 'none', scrollTrigger: { trigger: '.showcase-statement', start: 'top 85%', end: 'center 45%', scrub: .6 } });
    const story = document.querySelector('.product-story');
    const states = gsap.utils.toArray('.story-device .screen-state');
    const steps = gsap.utils.toArray('.story-step');
    let active = -1;
    /** @param {number} index */
    const activate = index => {
      if (active === index) return;
      active = index;
      gsap.to(states, { autoAlpha: 0, duration: .25, overwrite: true });
      gsap.to(states[index], { autoAlpha: 1, duration: .35, overwrite: true });
      const accessory = document.querySelector('.story-accessory');
      if (accessory) {
        const activeState = states[index];
        const watch = activeState instanceof Element && !!activeState.querySelector('.screen-watch');
        gsap.to(accessory, { autoAlpha: watch ? 1 : 0, scale: watch ? 1 : .85, duration: .6, overwrite: true });
        gsap.to('.story-device > .device', { xPercent: watch ? -25 : 0, scale: watch ? .72 : 1, duration: .6, overwrite: 'auto' });
      }
      document.querySelector('.scene-number')?.replaceChildren(String(index + 1).padStart(2, '0'));
      document.querySelector('.product-story')?.setAttribute('data-active-step', String(index));
    };
    steps.forEach((step, index) => {
      ScrollTrigger.create({ trigger: /** @type {Element} */ (step), start: 'top center', end: 'bottom center', onEnter: () => activate(index), onEnterBack: () => activate(index) });
    });
    activate(0);
    gsap.fromTo('.story-device .device', { rotationY: -18, rotationX: 7, rotationZ: -4 }, { rotationY: 16, rotationX: -3, rotationZ: 3, ease: 'none', scrollTrigger: { trigger: story, start: 'top top', end: 'bottom bottom', scrub: .65 } });
    gsap.fromTo('.story-progress i', { scaleX: 0 }, { scaleX: 1, ease: 'none', scrollTrigger: { trigger: story, start: 'top center', end: 'bottom center', scrub: true } });
    if (document.querySelector('.focus-field')) {
      gsap.fromTo('.focus-clock', { scale: .75, rotationX: 25 }, { scale: 1, rotationX: 0, ease: 'none', scrollTrigger: { trigger: '.focus-field', start: 'top bottom', end: 'center center', scrub: .6 } });
      gsap.to('.focus-satellite', { xPercent: i => i % 2 ? 25 : -25, yPercent: i => i % 2 ? -40 : 40, ease: 'none', scrollTrigger: { trigger: '.focus-field', start: 'top bottom', end: 'bottom top', scrub: .7 } });
    }
    // Terminal input reveals by clipping, retaining a readable accessible string.
    const command = document.querySelector('.story-device .typed-command');
    if (command) gsap.fromTo(command, { clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0% 0 0)', ease: 'steps(20)', scrollTrigger: { trigger: story, start: 'top 75%', end: 'top 20%', scrub: true } });
    gsap.utils.toArray('.showcase-shots figure').forEach((figure, i) => {
      gsap.fromTo(figure, { y: 60 + i * 22, rotationY: i % 2 ? -7 : 7 }, { y: 0, rotationY: 0, ease: 'none', scrollTrigger: { trigger: /** @type {Element} */ (figure), start: 'top bottom', end: 'top 35%', scrub: .6 } });
    });
    // Pointer tilt runs only while the hero is visible; it never owns the device's scroll transform.
    const stage = document.querySelector('.hero-stage');
    let visible = true;
    const observer = new IntersectionObserver(entries => { visible = entries[0].isIntersecting; if (!visible) reset(); });
    if (stage) observer.observe(stage);
    const xTo = gsap.quickTo(orbit, 'rotationY', { duration: .6, ease: 'power2.out' });
    const yTo = gsap.quickTo(orbit, 'rotationX', { duration: .6, ease: 'power2.out' });
    /** @param {Event} event */
    function tilt(event) {
      if (!visible || !(event instanceof PointerEvent) || event.pointerType !== 'mouse' || !stage) return;
      const bounds = stage.getBoundingClientRect();
      xTo((event.clientX - bounds.left - bounds.width / 2) / bounds.width * 6);
      yTo(-(event.clientY - bounds.top - bounds.height / 2) / bounds.height * 5);
    }
    function reset() { xTo(0); yTo(0); }
    stage?.addEventListener('pointermove', tilt, { passive: true });
    stage?.addEventListener('pointerleave', reset);
    ScrollTrigger.refresh();
    return () => {
      document.body.classList.remove('story-enhanced');
      document.querySelector('.product-story')?.removeAttribute('data-active-step');
      stage?.removeEventListener('pointermove', tilt);
      stage?.removeEventListener('pointerleave', reset);
      observer.disconnect();
    };
  });
  window.addEventListener('pageshow', () => ScrollTrigger.refresh());
}
