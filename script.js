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

  const setNavOpen = (open) => {
    if (!navToggle || !navMenu) return;
    navToggle.setAttribute("aria-expanded", open ? "true" : "false");
    navMenu.classList.toggle("is-open", open);
  };

  if (navToggle && navMenu) {
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
      setError("email", "Bitte gib eine gültige E-Mail-Adresse an.");
      ok = false;
    } else setError("email", "");

    if (!isPhoneLoose(phone)) {
      setError("phone", "Bitte gib eine gültige Telefonnummer an (oder lass das Feld leer).");
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
        // clear message quickly on input (don’t be annoying)
        if (id !== "message") setError(id, "");
      });
    });

    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const ok = validate();
      if (!ok) {
        showToast("Bitte prüfe die markierten Felder.", 2600);
        // focus first invalid field
        const firstInvalid = ["name", "email", "phone", "message"].find((id) => ($("#err-" + id)?.textContent || "").trim().length);
        if (firstInvalid) $("#" + firstInvalid)?.focus();
        return;
      }

      // Demo success
      form.reset();
      if (successEl) {
        successEl.hidden = false;
        // Hide after a while
        window.clearTimeout(form._successT);
        form._successT = window.setTimeout(() => {
          successEl.hidden = true;
        }, 5200);
      }
      showToast("Danke! Deine Anfrage wurde (demo) erfolgreich geprüft.", 3200);
    });
  }

  // -----------------------------
  // Section reveal animation (IntersectionObserver)
  // -----------------------------
  const revealEls = $$(".reveal");
  const reducedMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!reducedMotion && "IntersectionObserver" in window && revealEls.length) {
    const revObs = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (!en.isIntersecting) return;
          en.target.classList.add("is-visible");
          revObs.unobserve(en.target);
        });
      },
      { threshold: 0.18, rootMargin: "0px 0px -10% 0px" }
    );

    revealEls.forEach((el) => revObs.observe(el));
  } else {
    // If no IO or reduced motion, just show them
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
})();
