/* Newsletter-Anmeldung.
 *
 * Sendet an das eigene Backend, das daraufhin eine Bestätigungsmail
 * verschickt (Double Opt-In). Erst der Klick auf den Link in dieser Mail
 * macht die Anmeldung gültig — hier passiert bewusst nicht mehr als das
 * Absenden der Adresse.
 *
 * Die Sprachlogik folgt derselben Konvention wie portfolio.js:
 * `document.documentElement.lang` ist die Quelle, ein MutationObserver
 * reagiert auf den Wechsel. Texte im Markup laufen über data-portfolio-*,
 * hier im Skript nur das, was dort nicht abgebildet werden kann —
 * Platzhalter und Statusmeldungen.
 */
(() => {
  const API = "https://pi5torben.tail969f0b.ts.net:8443";

  const form = document.getElementById("newsletterForm");
  if (!form) return;

  const status = document.getElementById("newsletterStatus");
  const label = document.getElementById("newsletterButtonLabel");
  const button = form.querySelector('button[type="submit"]');
  const email = form.elements.email;
  const firstName = form.elements.firstName;

  const TEXT = {
    de: {
      phFirstName: "Vorname (optional)",
      phEmail: "deine@e-mail.de",
      sending: "Wird gesendet …",
      invalid: "Bitte gib eine gültige E-Mail-Adresse ein.",
      tooMany: "Zu viele Versuche. Bitte probiere es in einer Weile noch einmal.",
      failed: "Das hat nicht geklappt. Bitte versuche es später erneut.",
      offline: "Keine Verbindung zum Server. Bitte versuche es später erneut.",
      success: "Fast geschafft — bitte bestätige den Link in der E-Mail."
    },
    en: {
      phFirstName: "First name (optional)",
      phEmail: "your@email.com",
      sending: "Sending …",
      invalid: "Please enter a valid email address.",
      tooMany: "Too many attempts. Please try again in a little while.",
      failed: "That didn’t work. Please try again later.",
      offline: "No connection to the server. Please try again later.",
      success: "Almost done — please confirm the link in the email."
    }
  };

  const lang = () => (document.documentElement.lang === "en" ? "en" : "de");
  const t = () => TEXT[lang()];

  const applyLanguage = () => {
    firstName.placeholder = t().phFirstName;
    email.placeholder = t().phEmail;
  };
  applyLanguage();
  new MutationObserver(applyLanguage).observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["lang"]
  });

  const resetButtonLabel = () => {
    if (!label) return;
    label.textContent = label.getAttribute(`data-portfolio-${lang()}`) || label.textContent;
  };

  const show = (message, ok) => {
    if (!status) return;
    status.textContent = message || "";
    status.className = message ? (ok ? "form-success" : "error") : "error";
  };

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const address = email.value.trim();
    // Bewusst nachsichtig: Die belastbare Prüfung macht das Backend, und die
    // eigentliche Bestätigung ist ohnehin der Klick in der E-Mail.
    if (!address || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(address)) {
      show(t().invalid, false);
      email.focus();
      return;
    }

    button.disabled = true;
    if (label) label.textContent = t().sending;
    show("", true);

    try {
      const response = await fetch(`${API}/api/newsletter/subscribe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: address,
          firstName: firstName.value.trim(),
          website: form.elements.website.value
        })
      });

      if (response.status === 429) {
        show(t().tooMany, false);
      } else if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        show(data.reason || t().failed, false);
      } else {
        // Die Antwort ist absichtlich immer gleich — ob die Adresse neu ist
        // oder schon auf der Liste steht, verrät der Endpunkt nicht.
        form.reset();
        show(t().success, true);
      }
    } catch (error) {
      show(t().offline, false);
    } finally {
      button.disabled = false;
      resetButtonLabel();
    }
  });
})();
