// script.js

(() => {
  "use strict";

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  // -----------------------------
  // Helpers
  // -----------------------------
  const clamp = (n, min, max) => Math.min(max, Math.max(min, n));

  const showToast = (message, ms = 3200) => {
    const toast = $("#toast");
    if (!toast) return;
    toast.textContent = message;
    toast.hidden = false;
    toast.classList.remove("is-visible");
    // tiny rAF to ensure it can animate if you add CSS later
    requestAnimationFrame(() => toast.classList.add("is-visible"));

    window.clearTimeout(showToast._t);
    showToast._t = window.setTimeout(() => {
      toast.hidden = true;
    }, ms);
  };

  // -----------------------------
  // Footer year
  // -----------------------------
  const yearEl = $("#year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // -----------------------------
  // Mobile nav toggle + close on click/outside/esc
  // -----------------------------
  const navToggle = $(".nav-toggle");
  const navMenu = $("#navMenu");
  const siteHeader = $(".site-header");

  const syncNavMenuTop = () => {
    if (!navMenu || !siteHeader) return;
    const headerBottom = Math.round(siteHeader.getBoundingClientRect().bottom);
    navMenu.style.setProperty("--menu-top", `${headerBottom + 10}px`);
  };

  const setNavOpen = (open) => {
    if (!navToggle || !navMenu) return;
    if (open) syncNavMenuTop();
    navToggle.setAttribute("aria-expanded", open ? "true" : "false");
    navMenu.classList.toggle("is-open", open);
  };

  if (navToggle && navMenu) {
    syncNavMenuTop();

    navToggle.addEventListener("click", () => {
      const isOpen = navMenu.classList.contains("is-open");
      setNavOpen(!isOpen);
    });

    // Close menu when clicking a link
    navMenu.addEventListener("click", (e) => {
      const a = e.target.closest("a");
      if (a) setNavOpen(false);
    });

    // Close on outside click
    document.addEventListener("click", (e) => {
      const isOpen = navMenu.classList.contains("is-open");
      if (!isOpen) return;
      const inside = e.target.closest(".nav") || e.target.closest("#navMenu");
      if (!inside) setNavOpen(false);
    });

    // Close on ESC
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") setNavOpen(false);
    });

    window.addEventListener("resize", syncNavMenuTop, { passive: true });
    window.addEventListener("orientationchange", syncNavMenuTop, { passive: true });
  }

  // -----------------------------
  // Smooth scrolling (fallback) + offset
  // -----------------------------
  // Note: CSS scroll-margin-top handles sticky header offset nicely.
  $$('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const href = a.getAttribute("href");
      if (!href || href === "#" || href === "#top") return;

      const target = $(href);
      if (!target) return;

      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });

      // Update URL without jumping
      history.pushState(null, "", href);
    });
  });

  // -----------------------------
  // Active section highlighting (IntersectionObserver)
  // -----------------------------
  const navLinks = $$(".nav-link").filter((l) => (l.getAttribute("href") || "").startsWith("#"));
  const sections = navLinks
    .map((l) => $(l.getAttribute("href")))
    .filter(Boolean);

  if ("IntersectionObserver" in window && sections.length) {
    const linkById = new Map(navLinks.map((l) => [l.getAttribute("href")?.slice(1), l]));

    const obs = new IntersectionObserver(
      (entries) => {
        // pick the most visible entry
        const visible = entries
          .filter((en) => en.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (!visible) return;
        const id = visible.target.id;
        navLinks.forEach((l) => l.classList.remove("is-active"));
        const active = linkById.get(id);
        if (active) active.classList.add("is-active");
      },
      {
        root: null,
        // Trigger when section is around the top third of the viewport
        rootMargin: "-20% 0px -60% 0px",
        threshold: [0.1, 0.2, 0.35, 0.5, 0.65],
      }
    );

    sections.forEach((s) => obs.observe(s));
  }

  // -----------------------------
  // Dark mode toggle (localStorage)
  // -----------------------------
  const themeToggle = $("#themeToggle");
  const storageKey = "theme";
  const root = document.documentElement;

  const getPreferredTheme = () => {
    const stored = localStorage.getItem(storageKey);
    if (stored === "dark" || stored === "light") return stored;
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  };

  const applyTheme = (theme) => {
    if (theme === "dark") root.setAttribute("data-theme", "dark");
    else root.removeAttribute("data-theme");

    if (themeToggle) {
      themeToggle.setAttribute("aria-pressed", theme === "dark" ? "true" : "false");
    }
  };

  const theme = getPreferredTheme();
  applyTheme(theme);

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const current = root.getAttribute("data-theme") === "dark" ? "dark" : "light";
      const next = current === "dark" ? "light" : "dark";
      localStorage.setItem(storageKey, next);
      applyTheme(next);
      showToast(next === "dark" ? "Dark Mode aktiviert" : "Light Mode aktiviert", 1800);
    });
  }

  // -----------------------------
  // FAQ Accordion (keyboard accessible)
  // -----------------------------
  const accRoot = $("[data-accordion]");
  const accButtons = accRoot ? $$(".acc-btn", accRoot) : [];

  const closePanel = (btn) => {
    const panelId = btn.getAttribute("aria-controls");
    const panel = panelId ? $("#" + panelId) : null;
    btn.setAttribute("aria-expanded", "false");
    if (panel) panel.hidden = true;
  };

  const openPanel = (btn) => {
    const panelId = btn.getAttribute("aria-controls");
    const panel = panelId ? $("#" + panelId) : null;
    btn.setAttribute("aria-expanded", "true");
    if (panel) panel.hidden = false;
  };

  if (accButtons.length) {
    accButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const expanded = btn.getAttribute("aria-expanded") === "true";
        // Close others (accordion behavior)
        accButtons.forEach((b) => closePanel(b));
        if (!expanded) openPanel(btn);
      });

      // Keyboard: Enter/Space toggles (native button handles), Arrow navigation
      btn.addEventListener("keydown", (e) => {
        const idx = accButtons.indexOf(btn);
        if (e.key === "ArrowDown") {
          e.preventDefault();
          accButtons[clamp(idx + 1, 0, accButtons.length - 1)].focus();
        }
        if (e.key === "ArrowUp") {
          e.preventDefault();
          accButtons[clamp(idx - 1, 0, accButtons.length - 1)].focus();
        }
        if (e.key === "Home") {
          e.preventDefault();
          accButtons[0].focus();
        }
        if (e.key === "End") {
          e.preventDefault();
          accButtons[accButtons.length - 1].focus();
        }
      });
    });
  }

  // -----------------------------
  // Contact form validation + demo success
  // -----------------------------
  const form = $("#contactForm");
  const successEl = $("#formSuccess");

  const setError = (id, msg) => {
    const el = $("#err-" + id);
    if (el) el.textContent = msg || "";
  };

  const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(v);
  const isPhoneLoose = (v) => {
    if (!v) return true; // optional
    // permissive: digits, spaces, +, -, (), /
    return /^[0-9+\-()\/\s]{6,}$/.test(v.trim());
  };

  const validate = () => {
    const name = $("#name")?.value.trim() || "";
    const email = $("#email")?.value.trim() || "";
    const phone = $("#phone")?.value.trim() || "";
    const message = $("#message")?.value.trim() || "";

    let ok = true;

    if (name.length < 2) {
      setError("name", "Bitte gib deinen Namen an (mind. 2 Zeichen).");
      ok = false;
    } else setError("name", "");

    if (!isEmail(email)) {
      setError("email", "Bitte gib eine gÃ¼ltige E-Mail-Adresse an.");
      ok = false;
    } else setError("email", "");

    if (!isPhoneLoose(phone)) {
      setError("phone", "Bitte gib eine gÃ¼ltige Telefonnummer an (oder lass das Feld leer).");
      ok = false;
    } else setError("phone", "");

    if (message.length < 10) {
      setError("message", "Bitte beschreibe dein Anliegen (mind. 10 Zeichen).");
      ok = false;
    } else setError("message", "");

    return ok;
  };

  if (form) {
    // Validate on blur for nicer UX
    ["name", "email", "phone", "message"].forEach((id) => {
      const el = $("#" + id);
      if (!el) return;
      el.addEventListener("blur", validate);
      el.addEventListener("input", () => {
        // clear message quickly on input (donâ€™t be annoying)
        if (id !== "message") setError(id, "");
      });
    });

    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const ok = validate();
      if (!ok) {
        showToast("Bitte prÃ¼fe die markierten Felder.", 2600);
        // focus first invalid field
        const firstInvalid = ["name", "email", "phone", "message"].find((id) => ($("#err-" + id)?.textContent || "").trim().length);
        if (firstInvalid) $("#" + firstInvalid)?.focus();
        return;
      }

      const formData = new FormData(form);
      const action = form.getAttribute("action") || "";

      try {
        const res = await fetch(action, {
          method: "POST",
          body: formData,
          headers: { Accept: "application/json" },
        });

        if (!res.ok) throw new Error("formspree");

        form.reset();
        if (successEl) {
          successEl.hidden = false;
          window.clearTimeout(form._successT);
          form._successT = window.setTimeout(() => {
            successEl.hidden = true;
          }, 5200);
        }
        showToast("Danke! Deine Anfrage wurde gesendet.", 3200);
      } catch (err) {
        showToast("Senden fehlgeschlagen. Bitte später erneut versuchen.", 3200);
      }
    });
  }

  // -----------------------------
  // Scroll animations
  // -----------------------------
  const revealEls = $$(".reveal");
  const reducedMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const hasGSAP = typeof window.gsap !== "undefined" && typeof window.ScrollTrigger !== "undefined";
  const currentPath = (window.location.pathname || "/").replace(/\\/g, "/");
  const normalizedPath = currentPath.endsWith("/") ? `${currentPath}index.html` : currentPath;
  const allowScrollAnimations = [
    "/",
    "/index.html",
    "/apps/beefocus/index.html",
    "/apps/ledger/index.html",
  ].includes(normalizedPath);

  if (!allowScrollAnimations) {
    revealEls.forEach((el) => el.classList.add("is-visible"));
  } else if (!reducedMotion && hasGSAP) {
    const gsap = window.gsap;
    document.documentElement.classList.add("gsap-ready");
    gsap.registerPlugin(window.ScrollTrigger);
    window.ScrollTrigger.config({ ignoreMobileResize: true });
    gsap.config({ force3D: false });
    gsap.ticker.lagSmoothing(500, 33);

    revealEls.forEach((el) => el.classList.add("is-visible"));
    const sectionReveal = (target, vars = {}) => {
      gsap.set(target, { autoAlpha: 0, y: 22 });
      window.ScrollTrigger.batch(target, {
        start: "top 76%",
        once: true,
        onEnter: (batch) => {
          gsap.to(batch, {
            autoAlpha: 1,
            y: 0,
            duration: 0.82,
            ease: "power3.out",
            stagger: 0.07,
            overwrite: true,
            ...vars,
          });
        },
      });
    };

    const staggerChildren = (containerSelector, childSelector, vars = {}) => {
      $$(containerSelector).forEach((container) => {
        const children = $$(childSelector, container);
        if (!children.length) return;
        gsap.set(children, { autoAlpha: 0, y: 20 });
        window.ScrollTrigger.create({
          trigger: container,
          start: "top 74%",
          once: true,
          onEnter: () => {
            gsap.to(children, {
              autoAlpha: 1,
              y: 0,
              duration: 0.84,
              ease: "power3.out",
              stagger: 0.075,
              overwrite: true,
              ...vars,
            });
          },
        });
      });
    };

    const heroCopy = $(".hero-copy");
    const heroVisual = $(".hero-visual");
    if (heroCopy || heroVisual) {
      const heroTl = gsap.timeline({ defaults: { ease: "power3.out" } });
      const heroTextItems = heroCopy
        ? [
            $(".eyebrow", heroCopy),
            $(".headline", heroCopy),
            $(".subheadline", heroCopy),
            $(".hero-actions", heroCopy),
            ...$$(".trust-item", heroCopy),
            $(".mini-card", heroCopy),
          ].filter(Boolean)
        : [];

      if (heroTextItems.length) {
        heroTl.fromTo(
          heroTextItems,
          { autoAlpha: 0, y: 28 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.92,
            stagger: 0.065,
            clearProps: "transform,opacity,visibility",
          }
        );
      }

      if (heroVisual) {
        heroTl.fromTo(
          heroVisual,
          { autoAlpha: 0, y: 30, scale: 0.992 },
          {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            duration: 1.0,
            clearProps: "transform,opacity,visibility",
          },
          heroTextItems.length ? 0.16 : 0
        );

        const heroDetailItems = [
          $(".pill", heroVisual),
          ...$$(".metric", heroVisual),
        ].filter(Boolean);

        if (heroDetailItems.length) {
          heroTl.fromTo(
            heroDetailItems,
            { autoAlpha: 0, y: 14 },
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.68,
              stagger: 0.05,
              clearProps: "transform,opacity,visibility",
            },
            "-=0.56"
          );
        }
      }
    }

    sectionReveal(".section-head");
    sectionReveal(".feature-device-head", { duration: 0.88 });
    sectionReveal(".download-copy, .download-card, .logo-row", { duration: 0.88 });
    sectionReveal(".split-left, .split-right", { duration: 0.9 });
    sectionReveal(".contact-card, .contact-info", { duration: 0.9 });
    staggerChildren(".cards-grid", ".card, .service-card, .testimonial, .testimonial-card, .benefit-card, .overview-card", { stagger: 0.07 });
    staggerChildren(".steps", ".step");
    staggerChildren(".projects-grid", ".project");
    staggerChildren(".feature-device-grid", ".feature-shot", { duration: 0.92, stagger: 0.06 });
    staggerChildren(".logo-row", ".logo-pill", { duration: 0.68, stagger: 0.045 });
    staggerChildren(".contact-grid", ".card", { duration: 0.84, stagger: 0.075 });
    staggerChildren(".accordion", ".acc-item", { duration: 0.76, stagger: 0.055 });

    window.ScrollTrigger.matchMedia({
      "(min-width: 960px)": () => {
        const premiumParallaxTargets = [$(".hero-visual"), ...$$(".project-thumb.js-parallax")].filter(Boolean);
        premiumParallaxTargets.forEach((el) => {
          gsap.fromTo(
            el,
            { y: -6 },
            {
              y: 6,
              ease: "none",
              overwrite: "auto",
              scrollTrigger: {
                trigger: el,
                start: "top bottom",
                end: "bottom top",
                scrub: 0.9,
              },
            }
          );
        });
      },
    });

    window.requestAnimationFrame(() => window.ScrollTrigger.refresh());
  } else if (!reducedMotion && "IntersectionObserver" in window && revealEls.length) {
    // Fallback if GSAP is not available
    const revObs = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (!en.isIntersecting) return;
          en.target.classList.add("is-visible");
          revObs.unobserve(en.target);
        });
      },
      { threshold: 0.16, rootMargin: "0px 0px -14% 0px" }
    );

    revealEls.forEach((el) => revObs.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("is-visible"));
  }

  // -----------------------------
  // Mini project filter (optional)
  // -----------------------------
  const filterRow = $(".filter-row");
  const chips = filterRow ? $$(".chip", filterRow) : [];
  const projects = $$(".project");

  const applyFilter = (tag) => {
    projects.forEach((p) => {
      const tags = (p.getAttribute("data-tags") || "").split(/\s+/).filter(Boolean);
      const show = tag === "all" ? true : tags.includes(tag);
      p.style.display = show ? "" : "none";
    });
  };

  if (chips.length && projects.length) {
    chips.forEach((chip) => {
      chip.addEventListener("click", () => {
        chips.forEach((c) => c.classList.remove("is-active"));
        chip.classList.add("is-active");
        const tag = chip.getAttribute("data-filter") || "all";
        applyFilter(tag);
      });
    });
  }

  // -----------------------------
  // Image lightbox (app screenshots)
  // -----------------------------
  const lightboxTargets = $$("main img").filter(
    (img) => !img.classList.contains("no-lightbox")
  );

  if (lightboxTargets.length) {
    const lightbox = document.createElement("div");
    lightbox.className = "img-lightbox";
    lightbox.setAttribute("aria-hidden", "true");

    const closeBtn = document.createElement("button");
    closeBtn.className = "img-lightbox-close";
    closeBtn.type = "button";
    closeBtn.setAttribute("aria-label", "Bild schließen");
    closeBtn.textContent = "×";

    const lightboxImg = document.createElement("img");
    lightboxImg.className = "img-lightbox-img";
    lightboxImg.alt = "";

    lightbox.append(closeBtn, lightboxImg);
    document.body.append(lightbox);

    let active = false;

    const closeLightbox = () => {
      if (!active) return;
      active = false;
      lightbox.classList.remove("is-open");
      document.body.classList.remove("lightbox-open");
      lightbox.setAttribute("aria-hidden", "true");
      window.setTimeout(() => {
        lightboxImg.removeAttribute("src");
      }, 180);
    };

    const openLightbox = (img) => {
      const src = img.currentSrc || img.getAttribute("src");
      if (!src) return;
      active = true;
      lightboxImg.src = src;
      lightboxImg.alt = img.alt || "Vergrößerte Ansicht";
      lightbox.setAttribute("aria-hidden", "false");
      document.body.classList.add("lightbox-open");
      requestAnimationFrame(() => lightbox.classList.add("is-open"));
    };

    lightboxTargets.forEach((img) => img.classList.add("is-lightboxable"));

    document.addEventListener("click", (e) => {
      const img = e.target.closest("main img");
      if (!img || img.classList.contains("no-lightbox")) return;
      if (img.closest(".img-lightbox")) return;
      // Keep normal navigation when image is inside a link/card.
      const linkedParent = img.closest("a[href]");
      if (linkedParent && !img.classList.contains("allow-lightbox-link")) return;
      e.preventDefault();
      e.stopPropagation();
      openLightbox(img);
    });

    closeBtn.addEventListener("click", closeLightbox);
    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox) closeLightbox();
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeLightbox();
    });
  }

  // -----------------------------
  // 3D orb background (mouse reactive)
  // -----------------------------
  const orbScene = $(".orb-scene");
  const orbs = orbScene ? $$(".orb", orbScene) : [];
  const finePointer = window.matchMedia && window.matchMedia("(pointer: fine)").matches;

  if (!reducedMotion && finePointer && orbScene && orbs.length) {
    const gsap = window.gsap;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let driftT = 0;
    let running = true;

    const setters = orbs.map((orb) => ({
      x: gsap.quickSetter(orb, "x", "px"),
      y: gsap.quickSetter(orb, "y", "px"),
    }));

    const onPointerMove = (e) => {
      const nx = e.clientX / window.innerWidth - 0.5;
      const ny = e.clientY / window.innerHeight - 0.5;
      targetX = nx;
      targetY = ny;
    };

    const onLeave = () => {
      targetX = 0;
      targetY = 0;
    };

    const tick = () => {
      if (!running) return;
      currentX += (targetX - currentX) * 0.05;
      currentY += (targetY - currentY) * 0.05;
      driftT += 0.012;
      const drift = Math.sin(driftT) * 6;

      setters.forEach((setPos, i) => {
        const depth = Number(orbs[i].dataset.depth || 1);
        const phase = i * 1.15;
        const floatY = Math.sin(driftT * 0.72 + phase) * (3.5 + depth * 1.8);
        const floatX = Math.cos(driftT * 0.55 + phase) * (2 + depth * 1.4);
        const x = currentX * depth * 60 + floatX;
        const y = currentY * depth * 44 + floatY + drift * 0.25;
        setPos.x(x);
        setPos.y(y);
      });
    };

    const onVisibility = () => {
      running = !document.hidden;
      if (running) gsap.ticker.add(tick);
      else gsap.ticker.remove(tick);
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerleave", onLeave, { passive: true });
    window.addEventListener("blur", onLeave, { passive: true });
    document.addEventListener("visibilitychange", onVisibility, { passive: true });
    gsap.ticker.add(tick);
  }
})();

