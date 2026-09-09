// Scroll-led, bounded scenes. No scroll hijacking, looping canvas or idle RAF.
export function mount() {
  const gsap = window.gsap, ScrollTrigger = window.ScrollTrigger;
  if (!gsap || !ScrollTrigger) return;
  gsap.registerPlugin(ScrollTrigger);
  const media = gsap.matchMedia();
  media.add('(min-width: 981px) and (prefers-reduced-motion: no-preference)', () => {
    document.body.classList.add('home-motion');
    /** @type {Array<() => void>} */
    const dispose = [];
    const hero = gsap.timeline({ scrollTrigger: {trigger:'.hero',start:'top top',end:'bottom top',scrub:.65} });
    hero.to('.website-scene .device-desktop',{yPercent:-10,rotationY:-3,rotationZ:-5,ease:'none'},0)
      .to('.website-scene .device-tablet',{xPercent:-7,yPercent:15,rotationZ:-8,ease:'none'},0)
      .to('.website-scene .device-phone',{yPercent:15,xPercent:7,rotationZ:9,ease:'none'},0)
      .to('.studio-plane',{rotationX:40,yPercent:15,ease:'none'},0)
      .to('.studio-title-accent',{color:'#70e4f6',ease:'none'},0);
    const panels = gsap.utils.toArray('.service-panel');
    const steps = gsap.utils.toArray('.service-card');
    let active = -1;
    /** @param {number} index */
    function show(index) {
      if(index===active)return;
      active=index;
      document.querySelector('.service-story')?.setAttribute('data-active-service',String(index));
      const number=document.querySelector('.service-current');
      if(number)number.textContent=`0${index+1}`;
      panels.forEach((panel, i)=>gsap.to(panel,{autoAlpha:i===index?1:0,rotationY:i===index?5:-7,rotationZ:i===index?-2:2,scale:i===index?1:.96,duration:.42,overwrite:true}));
      gsap.to('.service-progress i',{scaleX:(index+1)/steps.length,duration:.4,overwrite:true});
    }
    show(0);
    steps.forEach((step,index)=>ScrollTrigger.create({trigger:step,start:'top center',end:'bottom center',onEnter:()=>show(index),onEnterBack:()=>show(index)}));
    gsap.fromTo('.steps',{'--path-progress':0},{'--path-progress':1,ease:'none',scrollTrigger:{trigger:'.steps',start:'top center',end:'bottom center',scrub:.3}});
    gsap.utils.toArray('.step-badge').forEach(badge=>gsap.fromTo(badge,{color:'#486283'},{color:'#77d7ff',scrollTrigger:{trigger:badge,start:'top 70%',end:'top 40%',scrub:true}}));
    gsap.utils.toArray('.about-principle').forEach((layer,index)=>gsap.fromTo(layer,{xPercent:2+index},{xPercent:0,ease:'none',scrollTrigger:{trigger:layer,start:'top bottom',end:'center center',scrub:.5}}));
    gsap.utils.toArray('.responsive-composition .website-device').forEach((device,index)=>gsap.fromTo(device,{y:50-index*15,rotationY:index===0?-9:9},{y:-25+index*20,rotationY:0,ease:'none',scrollTrigger:{trigger:'.responsive-composition',start:'top bottom',end:'bottom top',scrub:.6}}));
    gsap.utils.toArray('.work-art').forEach(art=>gsap.fromTo(art,{y:45,rotationY:-3},{y:-30,rotationY:2,ease:'none',scrollTrigger:{trigger:art,start:'top bottom',end:'bottom top',scrub:.6}}));
    gsap.utils.toArray('.testimonial p').forEach(quote=>gsap.fromTo(quote,{'--quote-emphasis':0},{'--quote-emphasis':100,scrollTrigger:{trigger:quote,start:'top 85%',end:'top 50%',scrub:true}}));
    gsap.fromTo('.footer-wordmark',{y:40},{y:0,ease:'none',scrollTrigger:{trigger:'.site-footer',start:'top bottom',end:'top center',scrub:.4}});
    // Pointer camera runs only in-view and on actual mouse events.
    /** @param {string} regionSelector @param {string} targetSelector @param {number} strength */
    function tilt(regionSelector,targetSelector,strength) {
      const region=document.querySelector(regionSelector), target=document.querySelector(targetSelector);
      if(!(region instanceof HTMLElement)||!target)return;
      let visible=false;
      const observer=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;});observer.observe(region);
      const x=gsap.quickTo(target,'rotationX',{duration:.7,ease:'power2.out'}),y=gsap.quickTo(target,'rotationY',{duration:.7,ease:'power2.out'});
      /** @param {PointerEvent} event */
      const move=event=>{if(!visible||event.pointerType!=='mouse')return;const rect=region.getBoundingClientRect();x(-(event.clientY-rect.top-rect.height/2)/rect.height*strength);y((event.clientX-rect.left-rect.width/2)/rect.width*strength);};
      const reset=()=>{x(0);y(0);};
      region.addEventListener('pointermove',move,{passive:true});region.addEventListener('pointerleave',reset);
      dispose.push(()=>{observer.disconnect();region.removeEventListener('pointermove',move);region.removeEventListener('pointerleave',reset);x.tween.kill();y.tween.kill();gsap.set(target,{clearProps:'transform'});});
    }
    tilt('.studio-scene','.studio-camera',7);
    tilt('.certificate-card','.certificate-card img',12);
    const refresh=()=>ScrollTrigger.refresh();
    // Language changes no longer replace the scene DOM; only recalculate text height.
    const language=new MutationObserver(refresh);language.observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
    window.addEventListener('pageshow',refresh);
    requestAnimationFrame(refresh);
    return ()=>{
      dispose.forEach(clean=>clean());language.disconnect();window.removeEventListener('pageshow',refresh);
      document.body.classList.remove('home-motion');
      document.querySelector('.service-story')?.removeAttribute('data-active-service');
      gsap.killTweensOf(panels);gsap.set(panels,{clearProps:'all'});
    };
  });
}
