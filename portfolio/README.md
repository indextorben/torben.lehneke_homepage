# Referenzen und Projektseiten

## Website-Kundenprojekte ergänzen

Die Startseite ist auf professionelle Kundenwebsites ausgerichtet; Apps und Tools sind eigene Zusatzprojekte. Der aktuelle Hauptseiten-Review steht in `experience/README.md`.

`project-types.d.ts` definiert `website | app | tool`. `project-model.cjs` normalisiert Projektlinks und Kennzeichnungen. Ein Website-Datensatz benötigt keine Produktkapitel, keine App-Icons und keinen `apps/{id}`-Ordner. `detailPath` kann auf eine separat gestaltete Case Study zeigen; andernfalls wird `url` verwendet. Website-Projekte erscheinen vor eigenen Apps/Tools. Nur reale freigegebene Kundenprojekte eintragen, keine Beispieldaten veröffentlichen.

Struktur für einen künftigen Eintrag (Werte ausschließlich Dokumentationsplatzhalter):

```js
{
  id: 'kundenprojekt', type: 'website', featured: true,
  title: { de: 'Projektname', en: 'Project name' },
  client: 'Freigegebener Kundenname',
  description: { de: 'Projektbeschreibung', en: 'Project description' },
  heroImage: 'assets/portfolio/kundenprojekt.webp',
  technologies: ['HTML', 'CSS', 'JavaScript'],
  url: 'https://example.org',
  // Optional: detailPath: 'referenzen/kundenprojekt.html', icon: '...'
  accentColor: '#67e8f9'
}
```

Danach `npm run build`, `npm run check`, `npm run lint`, `npm run typecheck` und `npm run test:model`. Die Assetdatei und eine gegebenenfalls gesetzte lokale Case-Study-Seite müssen tatsächlich vorhanden sein. Bisherige Produktdetailseiten werden weiter aus ihren vollständigen Produktdaten gebaut. Separate Website-Case-Studies werden nicht vom Produktgenerator überschrieben.

## Showcase-Redesign: BeeWork, BeeFocus und Cmdfind

Die drei veröffentlichten Referenzseiten besitzen eine neue visuelle Präsentation mit viewportabhängigen Bühnen. Die übrige Website behält ihre Container und Typografie. Die Bühnen nutzen `min(90%, 2400px)` bzw. auf Ultrawide `min(88%, 2800px)`; Typografie und Abstände skalieren mit `clamp`, `vw` und `svh`. Im Ausgangszustand war die Bühne bei 1920/2560/3440 jeweils nur etwa 578 Pixel breit.

Neue Module:

- `showcases.cjs`: zweisprachige Szenen, Reihenfolge, Geräteart und vorhandene Galerieassets. BeeWork hat sechs Kapitel, BeeFocus vier und Cmdfind drei.
- `showcase-components.cjs`: statische Komponenten für ShowcaseHero, DeviceMockup, ProductScreen, StickyProductStory, Statement, Gallery, FocusField und PlatformBridge. Die Reihenfolge wird aus Daten zusammengesetzt.
- `showcase.css`: eigenständige Produktkomposition, dunkler projektspezifischer Header, responsive Geräte, CSS-3D, Licht, Sticky-Layout, Galerie und native Seitenübergänge.
- `showcase.js`: lädt das Bewegungsmodul dynamisch nur ab 761 Pixeln und ohne reduzierte Bewegung.
- `showcase-motion.js`: GSAP/ScrollTrigger-Choreografie, Screenwechsel, Gerätebewegung, räumliches Auseinanderfahren, Pointer Tilt, Progress und Fokus-Ebenen. GSAP `matchMedia` räumt beim Breakpoint- oder Motion-Wechsel auf.
- `globals.d.ts`: Typen für die bestehende GSAP-Browserintegration.
- `verify-showcase.cjs`: reproduzierbare Tests für große Displays, Scrollrichtung, aktive Screens, Sticky-Position, Sprache, Menüs, Fehlermeldungen und Storage.

Die 3D-Technik sind unabhängig transformierte HTML/CSS-Produktebenen mit Perspektive, `rotateX/Y/Z`, `translateZ`, Gerätekanten und Reflexionen. Es gibt kein WebGL-Canvas, keine Meshes und keine React-Abhängigkeit. [GSAP ScrollTrigger](https://gsap.com/docs/v3/Plugins/ScrollTrigger/) bindet Bewegungen an den Scrollfortschritt; [matchMedia](https://gsap.com/docs/v3/GSAP/gsap.matchMedia()/) verwaltet die responsive Initialisierung. Es wird weder Scroll-Hijacking noch künstliches Warten beim Navigieren eingesetzt.

Die Geräteoberflächen sind explizit beschriftete Produktillustrationen mit Beispieldaten. Sie sind keine exakten App-Screenshots. Die bisherigen Texte, Produktbilder, Funktionen, Preisbereiche und Downloadlinks bleiben vorhanden. Frühere Einstiegsvisuals sind über native aufklappbare Bereiche erreichbar; die großen Galerien zeigen bestehende Assets. Ein Suchverlauf oder messbare Geschwindigkeitsvorteile von Cmdfind werden mangels Nachweis nicht behauptet. Für BeeWork existiert im Projekt kein isoliertes echtes App-Icon; das datengetriebene goldene Projektzeichen bleibt der definierte Ersatz. BeeFocus verwendet das vorhandene App-Zeichen; Cmdfind das projektspezifische Terminalzeichen.

### Cooking-/Loading-Analyse

Es wurde keine Cooking-/Loading-Komponente gefunden. Die wiederholte Ansicht war im lokalen Browser der Cookie-Dialog: `script.js` führte nach jedem Laden bedingungslos `openBanner()` aus, selbst mit gespeicherter Auswahl.

Die automatische Anzeige erfolgt jetzt nur ohne gültige gespeicherte Auswahl **und** ohne `sessionStorage.site_notice_shown === "true"`. Der Marker wird beim ersten Seitenbesuch gesetzt; nach expliziter Auswahl bleibt `localStorage.cookie_consent` maßgeblich. Zurücknavigation mit BFCache schließt den wiederhergestellten Hinweis über `pageshow`. Bei nicht verfügbarem Session-Speicher wird die automatische Anzeige übersprungen, manuelles Öffnen über die Cookie-Einstellungen bleibt möglich. Dies erteilt keine Zustimmung zu optionalen Kategorien. Es gibt keinen zusätzlichen Intro-Screen und keine Navigationssperre.

### Performance und Prüfung

Der sichtbare Showcase-Hero benötigt keine großen Rasterbilder. Erhaltene Screenshots und frühere Hero-Bilder laden verzögert. GSAP 3.12.7 wird beim Build aus der gepinnten Paketversion nach `portfolio/vendor/` kopiert; die sechs Referenz-/Übersichtsseiten benötigen dafür kein CDN. Das neue Scrollmodul wird separat dynamisch importiert. Die alten unsichtbaren Symbol-Animationen laufen auf Showcase-Seiten nicht mehr, Bildkarussells scrollen manuell statt in Endlosschleifen. Neue Bewegungen haben keine eigene permanente Render-Schleife. Native View Transitions dauern 220–300 ms und werden bei reduzierter Bewegung deaktiviert. Ohne Unterstützung erfolgt normale sofortige Navigation.

`npm run test:showcase` prüft 320, 390, 768, 1366, 1920, 2560 und 3440 Pixel. Zusätzlich werden Reduced Motion, deaktiviertes JavaScript und eine fehlende GSAP-Datei geprüft. Die Showcase-Seiten werden als statisches HTML ausgeliefert; es gibt keine Hydration. Die bestehende optionale GitHub-Release-Abfrage braucht Netzwerkzugriff. `tmp/portfolio-review/showcase-metrics.json` dokumentiert die gemessenen Bühnenbreiten.

Geändert wurden zusätzlich `build.cjs`, `portfolio.css`, `portfolio.js`, `verify.cjs`, `tsconfig.json`, `script.js`, `apps/beefocus/beefocus.js`, `package.json` und der Lockfile. Die sechs HTML-Dateien enthalten aktualisierte lokale Script-Verweise; BeeWork, BeeFocus und Cmdfind enthalten die neuen Showcase-Blöcke. Die frühere Überarbeitung von DeskPilot/Ledger und bestehende fremde Änderungen wurden erhalten.

## Architektur und Bestand

Die Website bleibt eine statische HTML/CSS/JavaScript-Website. `style.css` und `script.js` liefern Navigation, Theme, Sprachwechsel, Suche und GSAP-Animationen. Die Produktseiten verwenden zusätzlich ihre bisherigen Styles und Skripte.

- Übersicht: `index.html`, Abschnitt `#referenzen`.
- Detailseiten: `apps/{beework,beefocus,cmdfind,deskpilot,ledger}/index.html`.
- Zentrale Projektdaten: `portfolio/projects.cjs`.
- Gemeinsame Darstellung: `portfolio/portfolio.css`.
- Sprachanbindung: `portfolio/portfolio.js`.
- Statischer Generator: `portfolio/build.cjs`.

BeeWork, BeeFocus und Cmdfind sind in der Übersicht sichtbar. DeskPilot und Ledger bleiben entsprechend dem bisherigen Stand nicht gelistet und werden auf ihren Detailseiten als geplant beschrieben. BeeWork und BeeFocus sind im App Store veröffentlicht und verlinken dorthin. Technologien und Produktbeschreibungen stammen aus den vorhandenen Seiten, nicht aus einer Prüfung der App-Quellcodes. Es werden keine Nutzungs- oder Erfolgszahlen behauptet.

## Pflege

`projects.cjs` enthält unter anderem `icon`, `heroImage`, `accentColor`, `tags`, `featured`, Status, CTA und zweisprachige Case-Study-Texte. Nach Änderungen `npm run build` ausführen. Der Generator aktualisiert die markierten `portfolio:*`-Blöcke im statischen HTML. Diese Blöcke nicht direkt bearbeiten. Die bisherigen Hero-Texte, Navigation, Features, Preise, Downloads, FAQ und Screenshots bleiben außerhalb dieser Blöcke editierbar.

Header, Hero und Footer laden dasselbe projektspezifische Icon aus den Projektdaten. BeeFocus verwendet das bestehende Bildzeichen aus `apps/beefocus/assets/BeeFocus.PNG` mit einem CSS-Ausschnitt. Die übrigen vier SVG-Zeichen sind neu definierte Projekticons (keine behaupteten offiziellen App-Store-Icons).

Die früheren Hero-Visuals bleiben im Abschnitt „Einblicke ins Produkt“ erhalten. Bestehende Bildergalerien wurden nicht entfernt. Die Referenzkarten und neuen Hero-Bilder verwenden `aspect-ratio: 3 / 2` und `object-fit: contain`. Hover-Animationen sind auf Geräte mit Hover und ohne reduzierte Bewegung beschränkt. Text und Links werden statisch ausgeliefert; JavaScript ist nur für die Sprachumschaltung der neuen Texte erforderlich. Ledger hatte bisher keinen Sprachschalter und behält diesen Stand bei.

## Bilder

Alle fünf neuen PNG-Dateien liegen unter `assets/portfolio/{projekt}-hero.png` (1536 × 1024). Sie wurden mit dem eingebauten Bildgenerierungswerkzeug erstellt. Die vollständigen Prompts stehen in `assets/portfolio/PROMPTS.md`. Die Bilder sind als KI-Produktvisualisierungen gekennzeichnet; ihre Interfaces sind illustrative Darstellungen. Die vorhandenen Originalassets bleiben bestehen. PNG wird vom vorhandenen lokalen Server bereits unterstützt. Alle Übersichtsbilder laden verzögert, nur das jeweilige Hero-Bild priorisiert.

## Prüfen und Vorschau

```sh
npm ci
npm run build
npm run lint
npm run typecheck
npm run check
npm start
# In einem zweiten Terminal:
npm run test:portfolio
```

Die Website läuft auf `http://localhost:3000`. `PORTFOLIO_TEST_URL` kann eine andere lokale Vorschauadresse setzen. Die Browserprüfung benötigt Chromium für Playwright; falls noch nicht vorhanden, einmal `npx playwright install chromium` ausführen.

- Build: deterministische Aktualisierung der statischen HTML-Blöcke.
- Lint: JavaScript-Syntaxprüfung aller Projektskripte, Prüfung der Projektdaten, lokalen Links und Assets.
- Typecheck: TypeScript `checkJs`, strikt und ohne Ausgabe, für die neue Datenquelle und das Browser-Skript. Die bestehende Website wurde nicht zu TypeScript migriert.
- Check: stellt sicher, dass die HTML-Ausgabe zu den Projektdaten passt.
- Browserprüfung: sechs Seiten, Breiten 320/390/768/1024/1440, Überläufe in beiden Themes, Bilder, Header, mobiles Menü, Sprachwechsel, Projektlinks und Inhalte ohne JavaScript. Lokale Screenshots werden unter `tmp/portfolio-review/` gespeichert und nicht versioniert.

Die Arbeit verändert keine Veröffentlichungseinstellungen und erstellt keinen Commit. Bereits vorhandene Änderungen in `index.html`, `style.css` und `apps/deskpilot/index.html` wurden erhalten.
