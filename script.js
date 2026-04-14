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
  // Language (DE/EN, staged rollout)
  // -----------------------------
  const langToggle = $("#langToggle");
  const languageKey = "site_language";
  const i18nPage = document.body?.dataset?.i18nPage || "";
  const mainEl = $("#main");
  const originalMain = mainEl ? mainEl.innerHTML : "";
  let currentLanguage = "de";

  const pageMainEn = {
    "root-imprint": `
      <section class="section" aria-label="Legal notice">
        <div class="container">
          <div class="section-head">
            <h1>Legal Notice</h1>
            <p class="lead">Information pursuant to Section 5 DDG</p>
          </div>

          <div class="card">
            <h2>Provider</h2>
            <p>
              Torben Lehneke<br />
              <strong>Address:</strong> Neu Panstorf 38b, 17139 Malchin<br />
              Germany
            </p>

            <h2>Contact</h2>
            <p>
              Phone: <a class="inline-link" href="tel:01733734023">01733734023</a><br />
              Email:
              <a class="inline-link" href="mailto:lehneketorben@gmail.com">lehneketorben@gmail.com</a>
            </p>

            <h2>VAT</h2>
            <p>
              <strong>VAT ID:</strong> not available.<br />
              <strong>Tax number:</strong> currently not available.
            </p>

            <h2>Commercial register</h2>
            <p>No commercial register entry available.</p>

            <h2>Responsible for content</h2>
            <p>
              Torben Lehneke (address as above).<br />
              Note: Information pursuant to Section 18(2) MStV is only required if journalistic-editorial content is offered.
            </p>

            <p class="muted">Version: March 10, 2026.</p>
          </div>
        </div>
      </section>
    `,
    "root-privacy": `
      <section class="section" aria-label="Privacy policy">
        <div class="container">
          <div class="section-head">
            <h1>Privacy Policy</h1>
            <p class="lead">Information pursuant to Art. 13 GDPR</p>
          </div>

          <div class="card">
            <h2>1. Controller</h2>
            <p>
              Torben Lehneke<br />
              <strong>Address:</strong> Neu Panstorf 38b, 17139 Malchin<br />
              Email:
              <a class="inline-link" href="mailto:lehneketorben@gmail.com">lehneketorben@gmail.com</a>
            </p>

            <h2>2. General information</h2>
            <p>
              This website processes personal data only where necessary for providing content, communication or security.
            </p>

            <h2>3. Access data / hosting</h2>
            <p>
              When visiting this website, technically required data may be processed (e.g. IP address, date and time,
              requested page, user agent) in order to deliver and protect the website. Legal basis: Art. 6(1)(f) GDPR.
            </p>
            <p>
              <strong>Hosting:</strong> The website is hosted via GitHub Pages. Domain management is handled by STRATO AG.
              The privacy policies of these providers apply.
            </p>

            <h2>4. Contact form</h2>
            <p>
              If you use the contact form, your submitted data (name, email, phone, message) is processed to handle your request.
              Legal basis: Art. 6(1)(b) GDPR (pre-contractual measures) and/or Art. 6(1)(f) GDPR (legitimate interest in communication).
            </p>
            <p>
              <strong>Formspree:</strong> The form is provided via Formspree. Data is transmitted to Formspree and forwarded by email.
              Data is used exclusively for communication.
            </p>

            <h2>5. External content & CDN</h2>
            <p>
              External resources may be loaded for display (e.g. JavaScript via jsDelivr for GSAP).
              This may transmit your IP address to the respective provider. Legal basis: Art. 6(1)(f) GDPR.
              Transfers to third countries (e.g. USA) may occur depending on provider.
            </p>

            <h2>6. Cookies / consent</h2>
            <p>
              This website currently does not use tracking cookies. Technically necessary storage access
              (e.g. dark mode state via localStorage) is used without consent.
              Legal basis: Section 25 TDDDG in conjunction with Art. 6 GDPR.
              If cookies or analytics tools are added, consent will be required.
            </p>

            <h2>7. Your rights</h2>
            <ul class="bullets">
              <li>Access to stored data (Art. 15 GDPR)</li>
              <li>Rectification of inaccurate data (Art. 16 GDPR)</li>
              <li>Erasure (Art. 17 GDPR)</li>
              <li>Restriction of processing (Art. 18 GDPR)</li>
              <li>Data portability (Art. 20 GDPR)</li>
              <li>Objection to processing (Art. 21 GDPR)</li>
              <li>Withdrawal of consent (Art. 7(3) GDPR)</li>
            </ul>

            <h2>8. Right to lodge a complaint</h2>
            <p>
              You have the right to lodge a complaint with the competent data protection supervisory authority.
              Competent authority: Der Landesbeauftragte für Datenschutz und Informationsfreiheit Mecklenburg-Vorpommern (LfDI MV),
              Werderstraße 74a, 19055 Schwerin, phone: +49 385 59494 0, email:
              <a class="inline-link" href="mailto:info@datenschutz-mv.de">info@datenschutz-mv.de</a>.
              More information:
              <a class="inline-link" href="https://www.datenschutz-mv.de" rel="noopener">datenschutz-mv.de</a>
            </p>

            <h2>9. Changes</h2>
            <p>
              This privacy policy is updated when needed so it remains compliant with current legal requirements.
            </p>

            <p class="muted">Version: March 10, 2026.</p>
          </div>
        </div>
      </section>
    `,
    "beefocus-privacy": `
      <section class="section legal-section" aria-label="BeeFocus Privacy">
        <div class="container">
          <article class="legal-card">
            <h1>Privacy for BeeFocus</h1>
            <p class="lead">
              At BeeFocus, we take data protection seriously. This privacy policy explains what data we process,
              how we use it and what rights you have.
            </p>

            <h2>1. Controller</h2>
            <p>The controller responsible for data processing is:</p>
            <p>
              Torben Lehneke<br />
              Email:
              <a class="inline-link" href="mailto:lehneketorben@gmail.com">lehneketorben@gmail.com</a>
            </p>

            <h2>2. Data collected</h2>
            <ul class="bullets legal-list">
              <li>Timer data (e.g. focus and break times, sessions)</li>
              <li>Tasks / todos (stored locally on the device)</li>
              <li>Optional: name or email, if provided by the user</li>
            </ul>

            <h2>3. Purpose of processing</h2>
            <p>The processed data is used only to provide app functionality, for example:</p>
            <ul class="bullets legal-list">
              <li>Storing and managing todos</li>
              <li>Timer functions and progress display</li>
              <li>Synchronization via iCloud (if enabled)</li>
              <li>Notifications</li>
            </ul>

            <h2>4. Sharing with third parties</h2>
            <p>No personal data is shared with third parties.</p>

            <h2>5. User rights</h2>
            <p>
              You have the right to access your stored data, correct it or request deletion.
              Please contact us at
              <a class="inline-link" href="mailto:lehneketorben@gmail.com">lehneketorben@gmail.com</a>.
            </p>

            <h2>6. Changes to this policy</h2>
            <p>
              We reserve the right to change this privacy policy at any time.
              The latest version is always available here.
            </p>

            <p class="legal-date">Version: October 2025</p>
          </article>
        </div>
      </section>
    `,
    "deskpilot-privacy": `
      <section class="section legal-section" aria-label="DeskPilot Privacy">
        <div class="container">
          <article class="legal-card">
            <h1>Privacy at DeskPilot</h1>
            <p class="lead">
              We only process data that is necessary for the app to work.
            </p>

            <div class="trust-row" role="list" aria-label="Trust Signals">
              <span class="trust-item" role="listitem">✓ No trackers</span>
              <span class="trust-item" role="listitem">✓ Local network</span>
              <span class="trust-item" role="listitem">✓ StoreKit via Apple</span>
            </div>

            <h2>1. What data does DeskPilot process?</h2>
            <ul class="bullets legal-list">
              <li>Local app settings, e.g. language, theme, macros and preferred devices.</li>
              <li>Connection-related device information, e.g. device name or hostname in the local network.</li>
              <li>No permanent transfer to own servers.</li>
              <li>No sharing with advertising networks.</li>
            </ul>

            <h2>2. What is the data used for?</h2>
            <ul class="bullets legal-list">
              <li>Device discovery in the local network (Bonjour).</li>
              <li>Establishing and maintaining connection between iPhone and Mac.</li>
              <li>Executing remote control functions.</li>
              <li>Personalization via settings, macros and favorites.</li>
            </ul>

            <h2>3. Third parties & in-app purchases</h2>
            <ul class="bullets legal-list">
              <li>In-app purchases are handled via Apple StoreKit.</li>
              <li>Apple has its own privacy terms that also apply.</li>
              <li>DeskPilot currently includes no embedded third-party tracking SDKs.</li>
            </ul>

            <h2>4. Storage period & deletion</h2>
            <ul class="bullets legal-list">
              <li>Data is stored locally on the device.</li>
              <li>Deletion via app uninstall or resetting settings.</li>
              <li>No central user account is required.</li>
            </ul>

            <h2>5. Legal basis (GDPR)</h2>
            <ul class="bullets legal-list">
              <li>Art. 6(1)(b) GDPR (performance of contract).</li>
              <li>Art. 6(1)(f) GDPR (legitimate interest in secure and reliable app functionality).</li>
            </ul>

            <h2>6. Your rights</h2>
            <ul class="bullets legal-list">
              <li>Access</li>
              <li>Rectification</li>
              <li>Erasure</li>
              <li>Restriction of processing</li>
              <li>Objection</li>
              <li>Data portability</li>
              <li>Right to lodge a complaint with a supervisory authority</li>
            </ul>

            <h2 id="kontakt">7. Contact</h2>
            <p>
              <strong>Name/Company:</strong> Torben Lehneke<br />
              <strong>Email:</strong> <a class="inline-link" href="mailto:lehneketorben@gmail.com">lehneketorben@gmail.com</a><br />
            </p>

            <p class="legal-date">Version: 12.04.2026</p>
          </article>
        </div>
      </section>
    `,
    "deskpilot-terms": `
      <section class="section legal-section" aria-label="DeskPilot Terms">
        <div class="container">
          <article class="legal-card">
            <h1>Terms and Conditions (DeskPilot)</h1>
            <p class="legal-date">Version: 14.04.2026</p>

            <h2>1. Scope</h2>
            <p>
              These Terms govern the use of DeskPilot and all related digital services in the free version and in paid
              premium subscriptions.
            </p>

            <h2>2. Provider</h2>
            <p>
              Torben Lehneke<br />
              Neu Panstorf 38b<br />
              17139 Malchin<br />
              Email: <a class="inline-link" href="mailto:lehneketorben@gmail.com">lehneketorben@gmail.com</a>
            </p>

            <h2>3. Services (Free vs Premium)</h2>
            <ul class="bullets legal-list">
              <li><strong>Free:</strong> basic connection and basic remote control features.</li>
              <li><strong>Premium:</strong> extended macros, pro remote features and iCloud sync where marked in the app.</li>
            </ul>

            <h2>4. Requirements</h2>
            <p>
              DeskPilot requires compatible Apple devices, a supported Mac, and a local network connection.
              Premium features require an Apple ID with in-app purchases enabled.
            </p>

            <h2>5. Pricing and billing via Apple</h2>
            <p>
              Prices are shown in the Apple App Store. Purchase, billing, renewal and cancellation are handled via
              Apple StoreKit and the respective Apple account.
            </p>

            <h2>6. Term, renewal and cancellation</h2>
            <p>
              Premium subscriptions run monthly or yearly based on your selected plan and renew automatically unless
              canceled in Apple account settings.
            </p>

            <h2>7. Withdrawal for digital content</h2>
            <p>
              Statutory withdrawal rights may apply. They may expire once contract performance starts with explicit
              prior consent and acknowledgement in the purchase process.
            </p>

            <h2>8. License rights</h2>
            <p>
              You receive a simple, non-transferable, non-sublicensable right to use the app within its intended scope.
            </p>

            <h2>9. User obligations and prohibited use</h2>
            <ul class="bullets legal-list">
              <li>No unlawful use.</li>
              <li>No reverse engineering, circumvention of technical protections or abusive remote control usage.</li>
              <li>Keep Apple account credentials secure.</li>
            </ul>

            <h2>10. Availability, maintenance and changes</h2>
            <p>
              Continuous, uninterrupted availability is not guaranteed. Maintenance and updates may temporarily affect
              functionality. Features may be changed if the contractual core remains reasonable.
            </p>

            <h2>11. Liability</h2>
            <p>
              Liability is unlimited for intent, gross negligence and injury to life, body or health. For slight
              negligence, liability is limited to foreseeable damage in case of breach of essential obligations.
            </p>

            <h2>12. Warranty</h2>
            <p>
              Statutory rules for digital products apply.
            </p>

            <h2>13. Data protection</h2>
            <p>
              See <a class="inline-link" href="datenschutz.html">Privacy Policy</a>.
            </p>

            <h2>14. Transfer of contract / changes to terms</h2>
            <p>
              Contractual rights and obligations may be transferred where user interests are reasonably protected.
              Changes to these terms are notified appropriately and apply only within legal limits.
            </p>

            <h2>15. Governing law / dispute resolution</h2>
            <p>
              German law applies, excluding the UN Convention on Contracts for the International Sale of Goods.
              Mandatory consumer protection provisions remain unaffected.
            </p>
            <p>
              The provider is not obliged and not willing to participate in consumer arbitration proceedings.
            </p>

            <h2>16. Final provisions</h2>
            <p>
              If individual provisions are invalid, the remaining provisions remain unaffected.
            </p>

            <h2 id="kontakt">Contact</h2>
            <p>
              Torben Lehneke<br />
              Neu Panstorf 38b, 17139 Malchin<br />
              Email: <a class="inline-link" href="mailto:lehneketorben@gmail.com">lehneketorben@gmail.com</a>
            </p>

            <p class="lead" style="margin-top: 1rem; font-weight: 700; color: var(--primary);">
              Note: This text does not constitute legal advice and should be reviewed by a lawyer before publication.
            </p>
          </article>
        </div>
      </section>
    `,
  };

  const pageText = {
    "root-imprint": {
      en: {
        title: "Legal Notice | Torben Lehneke",
        description: "Legal notice of Torben Lehneke - IT in Neubrandenburg.",
        html: {
          ".footer-bottom small": "© <span id='year'></span> Torben Lehneke. All rights reserved.",
        },
      },
    },
    "root-privacy": {
      en: {
        title: "Privacy Policy | Torben Lehneke",
        description: "Privacy policy of Torben Lehneke - IT in Neubrandenburg.",
        html: {
          ".footer-bottom small": "© <span id='year'></span> Torben Lehneke. All rights reserved.",
        },
      },
    },
    "home-index": {
      en: {
        title: "Torben Lehneke | IT in Neubrandenburg - Fast IT solutions for your company",
        description:
          "Torben Lehneke - IT in Neubrandenburg. Fast, reliable and transparent. Get in touch now.",
        text: {
          ".brand-sub": "IT · Neubrandenburg",
          "#navMenu .nav-link:nth-child(1)": "Services",
          "#navMenu .nav-link:nth-child(2)": "About me",
          "#navMenu .nav-link:nth-child(3)": "Process",
          "#navMenu .nav-link:nth-child(4)": "References",
          "#navMenu .nav-link:nth-child(5)": "Reviews",
          "#navMenu .nav-link:nth-child(6)": "FAQ",
          "#navMenu .nav-link:nth-child(7)": "Contact",
          ".eyebrow": "IT in Neubrandenburg",
          ".headline": "Fast IT solutions for your company",
          ".hero-actions .btn-primary": "Request a quote",
          ".hero-actions .btn-ghost": "Get in touch",
          ".trust-row .trust-item:nth-child(1)": "✓ Fast",
          ".trust-row .trust-item:nth-child(2)": "✓ Reliable",
          ".trust-row .trust-item:nth-child(3)": "✓ Transparent",
          ".mini-card-text strong": "Directly available:",
          ".visual-top .pill": "Top service",
          ".metric-label": "Response time",
          ".metric:nth-child(2) .metric-label": "Transparency",
          ".metric:nth-child(3) .metric-label": "Satisfaction",
          "#leistungen h2": "Services",
          "#leistungen .lead": "Clear packages, clean execution and transparent communication.",
          "#leistungen .service-card:nth-child(1) h3": "Consulting & needs analysis",
          "#leistungen .service-card:nth-child(1) p":
            "Short initial call, goals alignment and practical options. Then you get a clear recommendation.",
          "#leistungen .service-card:nth-child(2) h3": "Concept & planning",
          "#leistungen .service-card:nth-child(2) p":
            "We plan structure, process and content so implementation and budget stay predictable.",
          "#leistungen .service-card:nth-child(3) h3": "Implementation & setup",
          "#leistungen .service-card:nth-child(3) p":
            "Professional implementation with clean documentation, testing and a ready-to-use handover.",
          "#leistungen .service-card:nth-child(4) h3": "Maintenance & optimization",
          "#leistungen .service-card:nth-child(4) p":
            "Regular checks, updates and performance optimization to keep everything stable and fast.",
          "#leistungen .service-card:nth-child(5) h3": "Project management",
          "#leistungen .service-card:nth-child(5) p":
            "I ensure a smooth process from planning to implementation and final delivery.",
          "#leistungen .service-card:nth-child(6) h3": "Support & training",
          "#leistungen .service-card:nth-child(6) p":
            "Quick help and short onboarding so you and your team can work confidently.",
          "#ueberuns h2": "About me",
          "#ueberuns .lead":
            "I am Torben - your reliable partner for app and web development in Neubrandenburg. My focus: clean results, clear communication and fast delivery.",
          "#ueberuns .callout strong": "Why does this matter?",
          "#ueberuns .callout .muted":
            "You save time, avoid stress and get a solution that truly fits.",
          "#ueberuns .split-right h3": "Why me?",
          "#ueberuns .bullets li:nth-child(1)": "✓ Clear communication and quick responses",
          "#ueberuns .bullets li:nth-child(2)": "✓ Transparent offers and traceable steps",
          "#ueberuns .bullets li:nth-child(3)": "✓ Clean implementation with quality checks",
          "#ueberuns .bullets li:nth-child(4)": "✓ Personally available, even after project delivery",
          "#ueberuns .inline-actions .btn-secondary": "Contact me now",
          "#ueberuns .inline-actions .btn-ghost": "How it works",
          "#ablauf h2": "Process",
          "#ablauf .lead": "Simple, fast and predictable - from request to result.",
          "#ablauf .step:nth-child(1) h3": "Contact",
          "#ablauf .step:nth-child(1) p":
            "You send a short request and I get back to you quickly.",
          "#ablauf .step:nth-child(2) h3": "Planning",
          "#ablauf .step:nth-child(2) p":
            "I clarify requirements, propose solutions and provide a transparent offer.",
          "#ablauf .step:nth-child(3) h3": "Implementation",
          "#ablauf .step:nth-child(3) p":
            "Professional implementation with updates, so you always stay informed.",
          "#ablauf .step:nth-child(4) h3": "Done",
          "#ablauf .step:nth-child(4) p":
            "Review, refinement and handover - with ongoing support if needed.",
          "#referenzen h2": "References",
          "#referenzen .lead": "Three projects that show clear results.",
          "#referenzen .project:nth-child(1) .project-meta span":
            "Focused product page with clear structure and strong conversion.",
          "#referenzen .project:nth-child(2) .project-meta span":
            "Cross-platform CLI helper for Windows, macOS and Linux.",
          "#referenzen .project:nth-child(3) .project-meta span":
            "iPhone remote control for Mac with quick actions and macros.",
          "#bewertungen h2": "Reviews",
          "#bewertungen .lead":
            "Placeholders for real customer reviews. Will be replaced after first project feedback.",
          "#bewertungen .testimonial:nth-child(1) p":
            "\"A real customer review with concrete results will be shown here soon.\"",
          "#bewertungen .testimonial:nth-child(1) .who strong": "Placeholder 1",
          "#bewertungen .testimonial:nth-child(1) .who .muted": "Customer name + city",
          "#bewertungen .testimonial:nth-child(2) p":
            "\"A real feedback quote about collaboration will be added here.\"",
          "#bewertungen .testimonial:nth-child(2) .who strong": "Placeholder 2",
          "#bewertungen .testimonial:nth-child(2) .who .muted": "Customer name + city",
          "#bewertungen .testimonial:nth-child(3) p":
            "\"A real project experience report will be added after completion.\"",
          "#bewertungen .testimonial:nth-child(3) .who strong": "Placeholder 3",
          "#bewertungen .testimonial:nth-child(3) .who .muted": "Customer name + city",
          "#faq h2": "FAQ",
          "#faq .lead": "The most important questions - short and clear.",
          "#kontakt h2": "Contact",
          "#kontakt .section-head .lead":
            "Tell me briefly what you need and I will get back to you quickly.",
          ".field label[for='website']": "Website",
          ".field label[for='name']": "Name",
          ".field label[for='email']": "Email",
          ".field label[for='emailConfirm']": "Confirm email",
          ".field label[for='phone']": "Phone (optional)",
          ".field label[for='message']": "Message",
          ".form-actions .btn-primary": "Send request",
          ".form-actions .fineprint":
            "Your message is sent securely. Phone number is only needed if required after initial contact.",
          "#formSuccess": "✓ Thanks! Your request has been sent. I will get back to you asap.",
          ".contact-info h3": "Direct contact",
          ".contact-info .info-row:nth-child(2) .info-label": "Email",
          ".contact-info .info-row:nth-child(3) .info-label": "Location",
          ".contact-info .info-row:nth-child(3) .info-value": "Neubrandenburg",
          ".contact-info .info-row:nth-child(4) .info-label": "Business hours",
          ".contact-info .info-row:nth-child(4) .info-value": "Mon-Fri: 17:00-22:00",
          ".contact-info .info-row:nth-child(5) .info-label": "Phone",
          ".contact-info .info-row:nth-child(5) .info-value": "On request",
          ".contact-actions .btn-secondary": "Send email",
          ".contact-actions .btn-ghost": "Back to top",
          ".note strong": "Note:",
          ".note .muted": "The more precise your message, the faster I can help.",
          ".footer-brand .muted": "Fast IT solutions for your company · IT in Neubrandenburg",
          ".footer-links a[href='impressum.html']": "Legal notice",
          ".footer-links a[href='datenschutz.html']": "Privacy",
        },
        html: {
          ".subheadline":
            "Professional, fast and cleanly delivered - so you see results quickly.<span class='muted'>Request without obligation and get a fast response.</span>",
          ".metric:nth-child(1) .metric-label": "Response time",
          "#faq1-btn": "How fast will I get a response?<span class='acc-icon' aria-hidden='true'></span>",
          "#faq2-btn": "Do you offer a non-binding quote?<span class='acc-icon' aria-hidden='true'></span>",
          "#faq3-btn": "Do you also work in my region?<span class='acc-icon' aria-hidden='true'></span>",
          "#faq4-btn": "What does it cost?<span class='acc-icon' aria-hidden='true'></span>",
          "#faq1 p":
            "In most cases I reply quickly, often on the same day.",
          "#faq2 p":
            "Yes. You get a transparent quote before I start - with no obligation.",
          "#faq3 p":
            "I am active in <strong>Neubrandenburg</strong> and also beyond depending on the project - just ask briefly.",
          "#faq4 p":
            "It depends on scope and requirements. You get a clear breakdown before anything starts.",
          ".field label[for='name']": "Name <span aria-hidden='true'>*</span>",
          ".field label[for='email']": "Email <span aria-hidden='true'>*</span>",
          ".field label[for='emailConfirm']": "Confirm email <span aria-hidden='true'>*</span>",
          ".field label[for='phone']": "Phone <span class='muted'>(optional)</span>",
          ".field label[for='message']": "Message <span aria-hidden='true'>*</span>",
          ".footer-bottom small": "© <span id='year'></span> Torben Lehneke. All rights reserved.",
        },
      },
    },
    "cmdfind-index": {
      en: {
        title: "Cmdfind - Commands for every operating system",
        description:
          "Cmdfind helps you quickly find matching commands for Windows, macOS and Linux and download the right build.",
        text: {
          ".brand-sub": "CLI · Windows · macOS · Linux",
          "#navMenu .nav-link:nth-child(1)": "Overview",
          "#navMenu .nav-link:nth-child(2)": "Download",
          "#navMenu .nav-link:nth-child(3)": "Download now",
          ".home-label": "Home",
          ".eyebrow": "Cmdfind",
          ".headline": "Find commands instead of searching forever.",
          ".subheadline":
            "Cmdfind helps you look up CLI commands for Windows, macOS and Linux quickly - ideal when you need a command and do not remember it.",
          ".hero-actions .btn-primary": "Open download",
          ".hero-actions .btn-ghost": "GitHub",
          "#download h2": "Download",
          "#download .lead": "Latest continuous build for your operating system.",
          ".asset-app-head h3": "Cmdfind",
          ".asset-app-tag": "Continuous",
          ".asset-os-card:nth-child(1) .muted": "Latest continuous build",
          ".asset-os-card:nth-child(1) .btn-primary": "Download",
          ".asset-os-card:nth-child(1) .muted:nth-of-type(2)": "Alternative:",
          ".asset-os-card:nth-child(2) .muted": "Latest continuous build",
          ".asset-os-card:nth-child(2) .btn-primary": "Download",
          ".asset-os-card:nth-child(2) .muted:nth-of-type(2)": "Alternative:",
          ".asset-os-card:nth-child(3) .muted": "Latest continuous build",
          ".asset-os-card:nth-child(3) .btn-primary": "Download",
          ".asset-os-card:nth-child(3) .muted:nth-of-type(2)": "Alternative:",
          ".asset-all-link": "Show all files",
          ".footer-brand .muted": "Cross-platform command finder for daily terminal work.",
          ".footer-links a[href='../../index.html']": "Back to homepage",
        },
        html: {
          ".cmdfind-terminal code":
            "$ cmdfind \"extract zip\"\nWindows: tar -xf archive.zip\nmacOS: unzip archive.zip\nLinux:  unzip archive.zip",
          ".asset-os-card:nth-child(1) .muted:nth-of-type(2)":
            "Alternative: <a class='inline-link' href='https://github.com/indextorben/cmdfind/releases/download/continuous/cmdfind-0.1.0-win.zip' target='_blank' rel='noopener noreferrer'>ZIP</a>",
          ".asset-os-card:nth-child(2) .muted:nth-of-type(2)":
            "Alternative: <a class='inline-link' href='https://github.com/indextorben/cmdfind/releases/download/continuous/cmdfind-0.1.0-arm64-mac.zip' target='_blank' rel='noopener noreferrer'>ZIP</a>",
          ".asset-os-card:nth-child(3) .muted:nth-of-type(2)":
            "Alternative: <a class='inline-link' href='https://github.com/indextorben/cmdfind/releases/download/continuous/cmdfind_0.1.0_amd64.deb' target='_blank' rel='noopener noreferrer'>DEB</a> · <a class='inline-link' href='https://github.com/indextorben/cmdfind/releases/download/continuous/cmdfind-0.1.0.tar.gz' target='_blank' rel='noopener noreferrer'>TAR.GZ</a>",
          ".footer-bottom small": "© <span id='year'></span> Cmdfind",
        },
      },
    },
    "beefocus-privacy": {
      en: {
        title: "Privacy - BeeFocus",
        description: "Privacy policy for the BeeFocus app.",
        text: {},
        html: {
          ".footer-bottom small": "© <span id='year'></span> BeeFocus. All rights reserved.",
        },
      },
    },
    "beefocus-index": {
      en: {
        title: "BeeFocus - Focus and To-do App",
        description:
          "BeeFocus is the focused to-do and productivity app with morning overview, pomodoro timer and calendar view.",
        text: {
          ".brand-sub": "App · Focus & To-do",
          "#navMenu .nav-link:nth-child(1)": "Benefits",
          "#navMenu .nav-link:nth-child(2)": "Features",
          "#navMenu .nav-link:nth-child(3)": "Testimonials",
          "#navMenu .nav-link:nth-child(4)": "Download",
          "#navMenu .nav-link:nth-child(5)": "FAQ",
          "#navMenu .nav-link:nth-child(6)": "Download now",
          ".home-label": "Home",
          ".eyebrow": "BeeFocus App",
          ".headline": "Focused. Clear. BeeFocus.",
          ".subheadline":
            "The to-do and focus app that structures your day with a smart morning overview, pomodoro timer and calendar.",
          ".hero-actions .btn-primary": "Download now",
          ".hero-actions .btn-ghost": "Learn more",
          ".trust-row .trust-item:nth-child(1)": "✓ Synced",
          ".trust-row .trust-item:nth-child(2)": "✓ Fast",
          ".trust-row .trust-item:nth-child(3)": "✓ Clear",
          ".hero-card strong": "Your day in 30 seconds",
          ".hero-card p": "Morning overview, timer and calendar in one flow.",
          "#benefits h2": "Clear focus, less friction",
          "#benefits .lead":
            "BeeFocus reduces everything to what matters so you can start faster.",
          "#benefits .benefit-card:nth-child(1) h3": "Morning overview",
          "#benefits .benefit-card:nth-child(1) p": "Start clearly: due tasks at a glance.",
          "#benefits .benefit-card:nth-child(2) h3": "Focus timer",
          "#benefits .benefit-card:nth-child(2) p": "Pomodoro with short and long breaks plus notifications.",
          "#benefits .benefit-card:nth-child(3) h3": "Calendar view",
          "#benefits .benefit-card:nth-child(3) p": "Monthly overview with daily tasks.",
          "#benefits .benefit-card:nth-child(4) h3": "Structure & simplicity",
          "#benefits .benefit-card:nth-child(4) p": "Categories, priorities, subtasks without clutter.",
          "#benefits .benefit-card:nth-child(5) h3": "Cloud sync",
          "#benefits .benefit-card:nth-child(5) p": "Consistent everywhere.",
          "#benefits .benefit-card:nth-child(6) h3": "Multilingual",
          "#benefits .benefit-card:nth-child(6) p": "German & English.",
          "#features h2": "Features that keep you moving",
          "#features .lead":
            "Each section reduces friction so focus becomes routine.",
          "#features .feature-device:nth-child(1) .feature-device-head h3": "iPhone",
          "#features .feature-device:nth-child(1) .feature-device-head .muted":
            "All mobile screens use the same size so details stay easy to compare.",
          "#features .feature-device:nth-child(2) .feature-device-head h3": "iPad",
          "#features .feature-device:nth-child(2) .feature-device-head .muted":
            "All tablet screens keep a unified width for easier reading.",
          "#testimonials h2": "Loved by focus fans",
          "#testimonials .lead": "Short feedback from people who save time every day.",
          "#download h2": "Install BeeFocus now",
          "#download .lead":
            "Get the app for iOS and start your morning overview in less than two minutes.",
          ".store-badge .badge-sub": "Download for iOS",
          "#download .fineprint":
            "Privacy-friendly: your data stays with you and syncs securely.",
          "#download .download-card h3": "1x focus setup",
          "#download .download-card .bullets li:nth-child(1)": "✓ Import tasks or create new ones",
          "#download .download-card .bullets li:nth-child(2)": "✓ Define timer sessions",
          "#download .download-card .bullets li:nth-child(3)": "✓ Connect calendar (optional)",
          "#download .download-card .btn": "Download now",
          "#faq h2": "FAQ",
          "#faq .lead": "Short answers to the most important questions.",
          ".footer-brand .muted": "Focus app for structured days.",
          ".footer-links a[href='#download']": "Pricing",
          ".footer-links a[href='datenschutz.html']": "Privacy",
          ".footer-links a[href='../../index.html#kontakt']": "Legal notice",
          ".footer-links a[href^='mailto:']": "Support",
        },
        html: {
          "#faq1-btn":
            "How does the overview work?<span class='acc-icon' aria-hidden='true'></span>",
          "#faq2-btn":
            "Can I adjust break lengths?<span class='acc-icon' aria-hidden='true'></span>",
          "#faq3-btn":
            "How does BeeFocus sync?<span class='acc-icon' aria-hidden='true'></span>",
          "#faq4-btn":
            "Is there a recycle bin and restore?<span class='acc-icon' aria-hidden='true'></span>",
          "#faq5-btn":
            "Will I also get reminders?<span class='acc-icon' aria-hidden='true'></span>",
          "#faq6-btn":
            "Does the app support multiple languages?<span class='acc-icon' aria-hidden='true'></span>",
          "#faq7-btn":
            "How can I share my tasks?<span class='acc-icon' aria-hidden='true'></span>",
          "#faq1 p":
            "BeeFocus combines open tasks, appointments and priorities in one compact screen so you can start immediately.",
          "#faq2 p":
            "Yes. You can define short and long breaks individually and enable alerts for better pacing.",
          "#faq3 p":
            "BeeFocus uses cloud sync with encrypted transfer. Changes appear across devices within seconds.",
          "#faq4 p":
            "Yes. You can restore deleted tasks or remove them automatically after a selected time.",
          "#faq5 p":
            "Yes. You can enable notifications for due tasks, timer sessions and calendar events.",
          "#faq6 p":
            "Yes, BeeFocus is currently available in German and English. More languages are planned.",
          "#faq7 p":
            "You can export tasks anytime by selecting a task, long-pressing and tapping share. Tasks and timer data are provided as JSON.",
          ".footer-bottom small": "(c) <span id='year'></span> BeeFocus. All rights reserved.",
        },
      },
    },
    "deskpilot-index": {
      en: {
        title: "DeskPilot - Control your Mac from iPhone",
        description:
          "DeskPilot turns your iPhone into an intelligent remote for your Mac, including trackpad, keyboard, quick actions and macros.",
        text: {
          ".brand-sub": "App · iPhone + Mac · planned",
          "#navMenu .nav-link:nth-child(1)": "Highlights",
          "#navMenu .nav-link:nth-child(2)": "Workflow",
          "#navMenu .nav-link:nth-child(3)": "Features",
          "#navMenu .nav-link:nth-child(4)": "FAQ",
          "#navMenu .nav-link:nth-child(5)": "Join waitlist",
          ".home-label": "Home",
          ".eyebrow": "DeskPilot App",
          ".headline": "Your Mac, controlled from iPhone.",
          ".subheadline":
            "DeskPilot turns your iPhone into an intelligent remote for your Mac: control media, use a precise trackpad, type remotely and run powerful quick actions.",
          ".hero-actions .btn-primary": "Join waitlist",
          ".hero-actions .btn-ghost": "Learn more",
          ".trust-row .trust-item:nth-child(1)": "✓ Local connection",
          ".trust-row .trust-item:nth-child(2)": "✓ Macros & Quick Actions",
          ".trust-row .trust-item:nth-child(3)": "✓ German & English",
          ".stat-a .stat-label": "Connected devices",
          ".stat-b .stat-label": "Active macros",
          "#overview h2": "Control in seconds",
          "#overview .lead": "One app for media control, input and smart automations on your Mac.",
          "#overview .overview-card:nth-child(1) h3": "Media control",
          "#overview .overview-card:nth-child(1) p": "Play, pause, volume and skip directly from iPhone.",
          "#overview .overview-card:nth-child(2) h3": "Trackpad & Keyboard",
          "#overview .overview-card:nth-child(2) p": "Precise pointer control, clicks and remote typing.",
          "#overview .overview-card:nth-child(3) h3": "Quick Actions & Macros",
          "#overview .overview-card:nth-child(3) p": "Run recurring workflows with a single tap.",
          "#workflow h2": "How DeskPilot fits into your day",
          "#workflow .lead": "Set up quickly and become productive right away.",
          "#workflow .step:nth-child(1) h3": "Connect",
          "#workflow .step:nth-child(1) p": "Pair Mac and iPhone in the same local network and get started.",
          "#workflow .step:nth-child(2) h3": "Control",
          "#workflow .step:nth-child(2) p": "Use media, cursor and remote typing in one place.",
          "#workflow .step:nth-child(3) h3": "Automate",
          "#workflow .step:nth-child(3) p": "Create macros for app launches, window layouts and workflows.",
          "#workflow .step:nth-child(4) h3": "Favorite",
          "#workflow .step:nth-child(4) p": "Save frequent actions as favorites to stay fast.",
          "#features h2": "Built for focus and productivity",
          "#features .lead": "Perfect for home office, presentations and focused deep work.",
          "#features .bullets li:nth-child(1)": "✓ Local connection for direct response",
          "#features .bullets li:nth-child(2)": "✓ Device management and flexible settings",
          "#features .bullets li:nth-child(3)": "✓ Modern design with German/English support",
          "#features .security-panel h3": "What users notice immediately",
          "#features .security-panel .info-row:nth-child(2) .info-label": "Fewer clicks",
          "#features .security-panel .info-row:nth-child(3) .info-label": "Ready faster",
          "#features .security-panel .info-row:nth-child(3) .info-value": "under 1 min",
          "#features .security-panel .info-row:nth-child(4) .info-label": "Workflow",
          "#features .security-panel .info-row:nth-child(4) .info-value": "in flow",
          "#faq h2": "FAQ",
          "#faq .lead": "The most important questions, answered briefly.",
          "#contact h2": "Get notified about DeskPilot",
          "#contact .lead": "If you want to control your Mac smarter from iPhone, contact us directly.",
          "#contact .btn-primary": "Send email",
          "#contact .btn-ghost": "Request callback",
          "#contact .contact-info h3": "Direct contact",
          "#contact .contact-info .info-row:nth-child(2) .info-label": "Email",
          "#contact .contact-info .info-row:nth-child(3) .info-label": "Phone",
          "#contact .contact-info .info-row:nth-child(3) .info-value": "On request",
          "#contact .contact-info .note":
            "Fast response, clear assessment and a smooth start with DeskPilot.",
          ".footer-brand .muted": "iPhone remote control for your Mac with macros and quick actions.",
          ".footer-links a[href='#workflow']": "Workflow",
          ".footer-links a[href='datenschutz.html']": "Privacy",
          ".footer-links a[href='agb.html']": "Terms",
          ".footer-links a[href^='mailto:']": "Support",
        },
        html: {
          "#deskpilot-faq-1-btn":
            "Does DeskPilot work with every Mac?<span class='acc-icon' aria-hidden='true'></span>",
          "#deskpilot-faq-2-btn":
            "Which control modes are included?<span class='acc-icon' aria-hidden='true'></span>",
          "#deskpilot-faq-3-btn":
            "Is multilingual support available?<span class='acc-icon' aria-hidden='true'></span>",
          "#deskpilot-faq-1 p":
            "DeskPilot is planned for modern macOS versions and optimized for current Mac hardware.",
          "#deskpilot-faq-2 p":
            "Media control, trackpad, remote keyboard, quick actions and macros are core DeskPilot features.",
          "#deskpilot-faq-3 p": "Yes. The app is designed for both German and English.",
          ".footer-bottom small": "(c) <span id='year'></span> DeskPilot. All rights reserved.",
        },
      },
    },
  };

  const chromeText = {
    "root-imprint": {
      en: {
        ".brand": { "aria-label": "Torben Lehneke home page" },
        ".nav": { "aria-label": "Legal notice navigation" },
        ".home-link-btn": { "aria-label": "Go to homepage" },
        "#themeToggle": { "aria-label": "Toggle dark mode" },
        "#navMenu .nav-link:nth-child(1)": "Services",
        "#navMenu .nav-link:nth-child(2)": "Contact",
        "#navMenu .nav-link:nth-child(3)": "Home",
        ".home-label": "Home",
        ".footer-brand .muted": "Fast IT solutions for your company · IT in Neubrandenburg",
        ".footer-links a[href='impressum.html']": "Legal notice",
        ".footer-links a[href='datenschutz.html']": "Privacy",
      },
    },
    "root-privacy": {
      en: {
        ".skip-link": "Skip to content",
        ".brand": { "aria-label": "Torben Lehneke home page" },
        ".nav": { "aria-label": "Privacy navigation" },
        ".home-link-btn": { "aria-label": "Go to homepage" },
        "#themeToggle": { "aria-label": "Toggle dark mode" },
        "#navMenu .nav-link:nth-child(1)": "Services",
        "#navMenu .nav-link:nth-child(2)": "Contact",
        "#navMenu .nav-link:nth-child(3)": "Home",
        ".home-label": "Home",
        ".footer-brand .muted": "Fast IT solutions for your company · IT in Neubrandenburg",
        ".footer-links a[href='impressum.html']": "Legal notice",
        ".footer-links a[href='datenschutz.html']": "Privacy",
      },
    },
    "home-index": {
      en: {
        ".brand": { "aria-label": "Torben Lehneke home page" },
        ".nav": { "aria-label": "Main navigation" },
        "#themeToggle": { "aria-label": "Toggle dark mode" },
      },
    },
    "cmdfind-index": {
      en: {
        ".brand": { "aria-label": "Cmdfind home page" },
        ".nav": { "aria-label": "Cmdfind navigation" },
        ".home-link-btn": { "aria-label": "Go to homepage" },
        "#themeToggle": { "aria-label": "Toggle dark mode" },
      },
    },
    "beefocus-index": {
      en: {
        ".brand": { "aria-label": "BeeFocus home page" },
        ".nav": { "aria-label": "BeeFocus navigation" },
        ".home-link-btn": { "aria-label": "Go to homepage" },
        "#themeToggle": { "aria-label": "Toggle dark mode" },
      },
    },
    "beefocus-privacy": {
      en: {
        ".brand-sub": "Privacy",
        "#navMenu .nav-link:nth-child(1)": "App page",
        "#navMenu .nav-link:nth-child(2)": "Home",
        ".home-label": "Home",
        ".footer-links a[href='index.html#download']": "Pricing",
        ".footer-links a[href='datenschutz.html']": "Privacy",
        ".footer-links a[href='../../index.html#kontakt']": "Legal notice",
        ".footer-links a[href^='mailto:']": "Support",
        ".footer-brand .muted": "Focus app for structured days.",
      },
    },
    "deskpilot-index": {
      en: {
        ".brand": { "aria-label": "DeskPilot home page" },
        ".nav": { "aria-label": "DeskPilot navigation" },
        ".home-link-btn": { "aria-label": "Go to homepage" },
        "#themeToggle": { "aria-label": "Toggle dark mode" },
      },
    },
    "deskpilot-privacy": {
      en: {
        ".brand-sub": "Privacy",
        "#navMenu .nav-link:nth-child(1)": "App page",
        "#navMenu .nav-link:nth-child(2)": "Contact",
        ".home-label": "Home",
        ".footer-links a[href='datenschutz.html']": "Privacy policy",
        ".footer-links a[href='agb.html']": "Terms",
        ".footer-links a[href^='mailto:']": "Support",
        ".footer-brand .muted": "Privacy notice is updated when features change.",
      },
    },
    "deskpilot-terms": {
      en: {
        ".brand-sub": "Terms",
        "#navMenu .nav-link:nth-child(1)": "App page",
        "#navMenu .nav-link:nth-child(2)": "Contact",
        ".home-label": "Home",
        ".footer-links a[href='datenschutz.html']": "Privacy",
        ".footer-links a[href='agb.html']": "Terms",
        ".footer-links a[href^='mailto:']": "Support",
        ".footer-brand .muted": "Legal texts are updated when features change.",
      },
    },
  };

  const setText = (selector, value) => {
    const el = $(selector);
    if (el) el.textContent = value;
  };
  const setHTML = (selector, value) => {
    const el = $(selector);
    if (el) el.innerHTML = value;
  };
  const setAttrs = (selector, attrs) => {
    const el = $(selector);
    if (!el) return;
    Object.entries(attrs).forEach(([key, value]) => el.setAttribute(key, value));
  };

  const getPreferredLanguage = () => {
    const stored = localStorage.getItem(languageKey);
    if (stored === "de" || stored === "en") return stored;
    const browserLang = String(navigator.language || "").toLowerCase();
    return browserLang.startsWith("en") ? "en" : "de";
  };

  const applyLanguage = (lang, notify = false) => {
    currentLanguage = lang === "en" ? "en" : "de";
    localStorage.setItem(languageKey, currentLanguage);
    document.documentElement.lang = currentLanguage;

    if (langToggle) {
      langToggle.textContent = currentLanguage.toUpperCase();
      langToggle.setAttribute(
        "aria-label",
        currentLanguage === "de" ? "Switch to English" : "Auf Deutsch wechseln"
      );
      langToggle.setAttribute("aria-pressed", currentLanguage === "en" ? "true" : "false");
    }

    if (i18nPage && mainEl) {
      if (currentLanguage === "en" && pageMainEn[i18nPage]) {
        mainEl.innerHTML = pageMainEn[i18nPage];
      } else if (currentLanguage === "de" && originalMain) {
        mainEl.innerHTML = originalMain;
      }
    }

    const pageConfig = pageText[i18nPage]?.[currentLanguage];
    if (pageConfig) {
      if (pageConfig.title) document.title = pageConfig.title;
      if (pageConfig.description) {
        const descEl = $('meta[name="description"]');
        if (descEl) descEl.setAttribute("content", pageConfig.description);
      }
      Object.entries(pageConfig.text || {}).forEach(([selector, value]) => setText(selector, value));
      Object.entries(pageConfig.html || {}).forEach(([selector, value]) => setHTML(selector, value));
    }

    const chromeConfig = chromeText[i18nPage]?.[currentLanguage];
    if (chromeConfig) {
      Object.entries(chromeConfig).forEach(([selector, value]) => {
        if (typeof value === "string") setText(selector, value);
        else setAttrs(selector, value);
      });
    }

    const yearNode = $("#year");
    if (yearNode) yearNode.textContent = String(new Date().getFullYear());

    if (notify) {
      showToast(
        currentLanguage === "de" ? "Sprache: Deutsch" : "Language: English",
        1600
      );
    }
  };

  currentLanguage = getPreferredLanguage();
  applyLanguage(currentLanguage);

  if (langToggle) {
    langToggle.addEventListener("click", () => {
      const next = currentLanguage === "de" ? "en" : "de";
      applyLanguage(next, true);
    });
  }

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
      showToast(
        next === "dark"
          ? currentLanguage === "de"
            ? "Dark Mode aktiviert"
            : "Dark mode enabled"
          : currentLanguage === "de"
            ? "Light Mode aktiviert"
            : "Light mode enabled",
        1800
      );
    });
  }

  // -----------------------------
  // Cmdfind release asset links (optional API enhancement)
  // -----------------------------
  const cmdfindButtons = $$("[data-cmdfind-platform]");
  const cmdfindAllFilesLink = $(".asset-all-link");

  if (cmdfindButtons.length) {
    const extMap = {
      windows: [".exe", ".zip"],
      macos: [".dmg", ".zip"],
      linux: [".appimage", ".deb", ".tar.gz"],
    };

    const pickAssetForPlatform = (assets, platform) => {
      const wantedExt = extMap[platform] || [];
      if (!wantedExt.length || !Array.isArray(assets)) return null;

      for (const ext of wantedExt) {
        const match = assets.find((asset) => {
          const name = String(asset?.name || "").toLowerCase();
          return name.endsWith(ext);
        });
        if (match) return match;
      }
      return null;
    };

    const releaseByTagUrl = "https://api.github.com/repos/indextorben/cmdfind/releases/tags/continuous";
    const latestReleaseUrl = "https://api.github.com/repos/indextorben/cmdfind/releases/latest";

    fetch(releaseByTagUrl)
      .then((res) => {
        if (res.ok) return res.json();
        return fetch(latestReleaseUrl).then((latestRes) => (latestRes.ok ? latestRes.json() : null));
      })
      .then((release) => {
        if (!release) return;

        const assets = Array.isArray(release.assets) ? release.assets : [];

        cmdfindButtons.forEach((btn) => {
          const platform = String(btn.getAttribute("data-cmdfind-platform") || "").toLowerCase();
          const fallback = btn.getAttribute("data-cmdfind-fallback") || btn.getAttribute("href") || "";
          const asset = pickAssetForPlatform(assets, platform);
          const tag = String(release.tag_name || "").trim();
          const directPackageUrl = asset && tag
            ? `https://github.com/indextorben/cmdfind/releases/download/${encodeURIComponent(tag)}/${encodeURIComponent(asset.name)}`
            : null;

          btn.href = directPackageUrl || asset?.browser_download_url || fallback;
          if (asset?.name) btn.setAttribute("download", asset.name);
        });

        if (cmdfindAllFilesLink && release.html_url) {
          cmdfindAllFilesLink.href = release.html_url;
        }
      })
      .catch(() => {
        // Keep static fallback links when API is not reachable.
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
  const isLikelyRealName = (v) => {
    const trimmed = (v || "").trim();
    if (trimmed.length < 5) return false;
    if (!/^[\p{L}][\p{L}\s'-]+$/u.test(trimmed)) return false;
    const parts = trimmed.split(/\s+/).filter(Boolean);
    return parts.length >= 2 && parts.every((part) => part.replace(/['-]/g, "").length >= 2);
  };
  const blockedTerms = [
    "arschloch",
    "bastard",
    "bitch",
    "drecksau",
    "fick",
    "fotze",
    "hurensohn",
    "miststuck",
    "nutte",
    "schlampe",
    "spast",
    "verpiss",
    "wichser",
  ];
  const normalizeForModeration = (v) =>
    (v || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/ß/g, "ss");
  const containsBlockedTerms = (v) => {
    const normalized = normalizeForModeration(v);
    return blockedTerms.some((term) => normalized.includes(term));
  };
  const validate = () => {
    const name = $("#name")?.value.trim() || "";
    const email = $("#email")?.value.trim() || "";
    const emailConfirm = $("#emailConfirm")?.value.trim() || "";
    const phone = $("#phone")?.value.trim() || "";
    const message = $("#message")?.value.trim() || "";

    let ok = true;

    if (!isLikelyRealName(name)) {
      setError("name", "Bitte gib deinen echten Vor- und Nachnamen an.");
      ok = false;
    } else setError("name", "");

    if (!isEmail(email)) {
      setError("email", "Bitte gib eine gültige E-Mail-Adresse an.");
      ok = false;
    } else setError("email", "");

    if (!isEmail(emailConfirm)) {
      setError("emailConfirm", "Bitte bestätige deine E-Mail-Adresse.");
      ok = false;
    } else if (emailConfirm !== email) {
      setError("emailConfirm", "Die beiden E-Mail-Adressen müssen identisch sein.");
      ok = false;
    } else setError("emailConfirm", "");

    if (!isPhoneLoose(phone)) {
      setError("phone", "Bitte gib eine gültige Telefonnummer an (oder lass das Feld leer).");
      ok = false;
    } else setError("phone", "");

    if (message.length < 10) {
      setError("message", "Bitte beschreibe dein Anliegen (mind. 10 Zeichen).");
      ok = false;
    } else if (containsBlockedTerms(message)) {
      setError("message", "Bitte formuliere deine Nachricht sachlich und ohne beleidigende Inhalte.");
      ok = false;
    } else setError("message", "");

    return ok;
  };

  if (form) {
    // Validate on blur for nicer UX
    ["name", "email", "emailConfirm", "phone", "message"].forEach((id) => {
      const el = $("#" + id);
      if (!el) return;
      el.addEventListener("blur", validate);
      el.addEventListener("input", () => {
        // Clear field errors quickly while typing.
        if (id !== "message") setError(id, "");
      });
    });

    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const honeypot = $("#website");
      if (honeypot?.value.trim()) {
        showToast("Senden blockiert. Bitte Seite neu laden und erneut versuchen.", 3600);
        return;
      }

      const ok = validate();
      if (!ok) {
        showToast("Bitte prüfe die markierten Felder.", 2600);
        // focus first invalid field
        const firstInvalid = ["name", "email", "emailConfirm", "phone", "message"].find((id) => ($("#err-" + id)?.textContent || "").trim().length);
        if (firstInvalid) $("#" + firstInvalid)?.focus();
        return;
      }

      const action = form.getAttribute("action") || "";

      if (!action) {
        showToast("Senden fehlgeschlagen: Formularziel fehlt.", 3600);
        return;
      }

      const submitBtn = $('button[type="submit"]', form);
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = "Wird gesendet…";
      }

      // Native POST submit is the most reliable path with Formspree + captcha settings.
      form.submit();
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
