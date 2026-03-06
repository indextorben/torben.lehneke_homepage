(() => {
  "use strict";

  const scene = document.querySelector(".symbol-scene");
  const symbols = scene ? Array.from(scene.querySelectorAll(".note-symbol")) : [];
  const reducedMotion =
    window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia && window.matchMedia("(pointer: fine)").matches;

  if (!scene || !symbols.length || reducedMotion) return;

  let targetX = 0;
  let targetY = 0;
  let currentX = 0;
  let currentY = 0;
  let t = 0;
  let rafId = 0;

  const onPointerMove = (e) => {
    targetX = e.clientX / window.innerWidth - 0.5;
    targetY = e.clientY / window.innerHeight - 0.5;
  };

  const onLeave = () => {
    targetX = 0;
    targetY = 0;
  };

  const animate = () => {
    currentX += (targetX - currentX) * 0.06;
    currentY += (targetY - currentY) * 0.06;
    t += 0.014;

    symbols.forEach((el, idx) => {
      const depth = Number(el.dataset.depth || 1);
      const phase = idx * 1.07;
      const driftX = Math.cos(t * 0.62 + phase) * (2 + depth * 1.2);
      const driftY = Math.sin(t * 0.74 + phase) * (3 + depth * 1.5);
      const x = currentX * depth * 48 + driftX;
      const y = currentY * depth * 34 + driftY;
      el.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0)`;
    });

    rafId = window.requestAnimationFrame(animate);
  };

  const onVisibility = () => {
    if (document.hidden) {
      window.cancelAnimationFrame(rafId);
      rafId = 0;
      return;
    }
    if (!rafId) rafId = window.requestAnimationFrame(animate);
  };

  if (finePointer) {
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerleave", onLeave, { passive: true });
    window.addEventListener("blur", onLeave, { passive: true });
  }
  document.addEventListener("visibilitychange", onVisibility, { passive: true });

  rafId = window.requestAnimationFrame(animate);
})();
