(() => {
  "use strict";

  const prefersReduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReduced) return;

  const hero = document.querySelector(".app-hero");
  const layers = Array.from(document.querySelectorAll("[data-parallax]"));
  const tilt = document.querySelector(".tilt");

  if (!hero || !layers.length) return;

  let ticking = false;

  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const rect = hero.getBoundingClientRect();
      const progress = Math.min(1, Math.max(0, (window.innerHeight - rect.top) / (window.innerHeight + rect.height)));
      layers.forEach((el) => {
        const depth = Number(el.getAttribute("data-parallax") || 0.1);
        const offset = (progress - 0.5) * depth * 60;
        el.style.transform = `translateY(${offset}px)`;
      });
      ticking = false;
    });
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  if (!tilt || "ontouchstart" in window) return;

  hero.addEventListener("mousemove", (e) => {
    const { left, top, width, height } = hero.getBoundingClientRect();
    const x = (e.clientX - left) / width - 0.5;
    const y = (e.clientY - top) / height - 0.5;
    const rotateX = y * -6;
    const rotateY = x * 8;
    tilt.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  });

  hero.addEventListener("mouseleave", () => {
    tilt.style.transform = "rotateX(0deg) rotateY(0deg)";
  });
})();
