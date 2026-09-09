# Website-Korrektur: Webentwicklung als Hauptangebot

Dieser Bericht ersetzt den vorherigen Design-Review. Die vorherige Ausrichtung auf Apps und Infrastruktur war inhaltlich falsch. Auch die frühere Aussage, normales Scrollen sei ausreichend geprüft, war falsch: programmatische Seitensprünge sind kein Nachweis für funktionierende native Eingaben.

## Scrollursache und Behebung

Auf der Startseite setzte `experience/home.css` den Body auf `overflow: clip`; dieselbe Regel stand für die Produktseiten in `portfolio/showcase.css`. Bei der bestehenden Root-Konfiguration wurde das Clipping an den Viewport weitergegeben. Im Browser blieben Mausrad und Page Down bei scrollY=0. Der Fehler ließ sich vor der Änderung reproduzieren.

Jetzt gilt:

- HTML verwaltet den vertikalen Scrollbereich ausdrücklich mit `overflow-y: auto`.
- Body bleibt `overflow: visible`. Ausschließlich horizontale dekorative Überstände werden am Main-Element geclippt.
- Suche und Lightbox setzen keine globalen Dokument-Scrollsperren mehr. Ihre Overlays bleiben bedienbar, können aber keine zurückbleibende Body-Sperre erzeugen.
- Keine Wheel-/Touchmove-Interception, kein Lenis, kein Root-Scale/Zoom, kein GSAP-Pinning.
- Sticky-Szenen sind normale CSS-Sticky-Elemente innerhalb endlicher Abschnitte.
- Stylesheet-Versionen wurden erhöht, damit der alte Scrollfehler nicht aus dem Browsercache bestehen bleibt.

Ein zweiter Fehler trat im installierten Google Chrome nach Zurücknavigation auf: dokumentübergreifende CSS View Transitions ließen den aus dem BFCache wiederhergestellten Viewport ohne funktionierende Mausrad-/Page-Down-Eingaben zurück. Kontrollversuche: `navigation: none` stellte beide Eingaben wieder her; deaktiviertes GSAP allein nicht. Deshalb sind Cross-Document-Transitions jetzt ausdrücklich ausgeschaltet. Stattdessen läuft eine lokale Einblendung des Inhalts über 240 ms, ohne Fullscreen-Snapshot oder Navigationswartezeit. Reduced Motion deaktiviert auch diese Einblendung.

Der vollständige Mausraddurchlauf fand außerdem einen verschachtelten Scrollbereich in der Produktgalerie: `overflow-x: auto` ließ auch die Y-Achse zu einem Scrollcontainer werden; durch die Parallax-Verschiebung konnten dort Eingaben statt auf der Seite landen. Die Desktop-Galerie nutzt nun ein offenes Grid im Dokumentfluss. Mobil bleibt die native horizontale Galerie ohne Desktop-Parallax erhalten.

`verify-scroll.cjs` prüft native Browser-Eingaben separat: Mausrad, kleine Trackpad-ähnliche Wheel-Deltas, Page Up/Down, Ziehen der echten Scrollbar, Touch-Eingaben über das Chrome DevTools Protocol, Suche schließen, Navigation, Zurücknavigation und mobile Menüs. Es verwendet den installierten Google Chrome; optional kann `TEST_BROWSER_CHANNEL` auf einen anderen verfügbaren Kanal gesetzt werden. Das ist eine automatisierte Browserprüfung, kein Test auf einem physischen iPhone oder mit einem echten Trackpad.

## Korrigierte Informationsarchitektur

1. Hero: „Websites, die dich sichtbar machen.“ Zielgruppen und Website-Leistung stehen sofort sichtbar darunter. CTAs: Projekt anfragen / Referenzen ansehen.
2. Warum eine starke Website: Angebot erklären, Vertrauen schaffen, Kontakt vereinfachen.
3. Leistungen: Unternehmenswebsites, Landingpages, Responsive Webdesign, individuelle Webentwicklung, Relaunch, Wartung & Weiterentwicklung. SEO-Grundlagen und Hosting-Unterstützung sind ergänzend eingeordnet.
4. Großer Responsive-Showcase mit Browser-, Tablet- und Smartphone-Layouts.
5. Über mich: persönliche Betreuung, direkte Kommunikation, Kundenanforderungen und technische Qualität.
6. Sechs Prozessphasen: Erstgespräch, Konzept, Design & Entwicklung, Feedback, Veröffentlichung, Weiterentwicklung.
7. Referenzen: eigene Apps/Tools ausdrücklich als zusätzliche Arbeit bezeichnet. Auf der Startseite kompaktere redaktionelle Projektzeilen; die eigenständigen Produktseiten behalten ihre großen Inszenierungen.
8. Bestehende BeeFocus-Bewertungen klar als App-Feedback bezeichnet, nicht als Website-Kundenbewertungen.
9. Vorhandener Cisco-Kursnachweis korrekt als „CCNA: Introduction to Networks“ eingeordnet.
10. Bestehende FAQ, großzügiger Website-Kontaktbereich, Formular, direkte Kontaktdaten, Footer.

Es wurden keine Kundenprojekte, Kundenlogos, Bewertungen, Ergebnisse oder Leistungskennzahlen erfunden. Die Website-Mockups sind eigene HTML/CSS-Designkonzepte und ausdrücklich **keine Kundenreferenzen**. Vorhandene App-Inhalte und rechtliche Texte wurden nicht entfernt. Nicht verlinkte historische HTML-Kopien bleiben unangetastet.

## Dateien und Verantwortlichkeiten

- `content.cjs`: zweisprachige Website-Inhalte und strukturelle Abschnitte.
- `web-components.cjs`: Browser-Chrome, illustrative Website, Desktop/Tablet/Phone, Hero, Service-Bühne, persönliche Prinzipien.
- `components.cjs`: gemeinsam verwendete, HTML-escaped Sprachbausteine. Die alten App-/Terminal-/Server-Renderfunktionen wurden entfernt.
- `build.cjs`: deterministische statische Ausgabe; ersetzt nur vorgesehene Bereiche, erhält Formular, Reviews, FAQ und Rechtliches.
- `web.css`: kundenorientierte Kompositionen, große CSS-Geräte, Responsive-Layouts.
- `home.css` / `site.css`: gemeinsame Layout- und Branding-Grundlage.
- `home.js` / `motion.js`: bedarfsgeladene GSAP-Choreografie, CSS-Perspektive, Scroll-Parallax, Service-Wechsel, Timeline und Pointer-Tilt.
- `../script.js`: keine globalen Scrollsperren; Sprachwechsel schützt die neuen Sprachbausteine und erhält Formularzustand; Suchindex und Metadaten passend zu Webentwicklung.
- `../portfolio/project-types.d.ts` / `project-model.cjs` / `projects.cjs`: Websites/Apps/Tools und unabhängige Projektlinks.
- `../index.html`: generierte Startseite, aktualisierte SEO-/Social-/Schema-Metadaten.
- `../site.webmanifest`: Website-Fokus auch in der installierbaren Seitenbeschreibung.

Alle angebundenen öffentlichen HTML-Dokumente erhalten aktualisierte Asset-Versionen. Die drei Showcase-Detailseiten behalten ihre individuellen Farben, Icons, Inhalte und Animationen.

## Layout, Bewegung und Performance

| Breite | Hero-Layout | Hero-Szene | Headline |
| --- | ---: | ---: | ---: |
| 1920 | ca. 1715 px | ca. 911 px | 87 px |
| 2560 | ca. 2291 px | ca. 1218 px | 116 px |
| 3440 | 2800 px | ca. 1483 px | 138 px |

Die Werte berücksichtigen den nativen Scrollbar-Gutter. Es wird nicht die ganze Seite skaliert: Textzeilen, Geräte, Zwischenräume und Layoutbreiten haben unterschiedliche Grenzen. Auf Mobilgeräten erscheinen die Service-Visuals inline; keine Desktop-Sticky-Choreografie wird erzwungen.

3D ist CSS-Perspektive, keine WebGL-Szene. Kein Canvas, keine neue Dependency. GSAP/ScrollTrigger werden auf der Startseite nur über 980 px und ohne Reduced Motion geladen. Galeriebilder laden lazy; die Website-Mockups brauchen keine Bitmap-Downloads. Pointer-Tilt reagiert nur auf Mausereignisse im sichtbaren Bereich. MatchMedia räumt Animationen und Listener bei Präferenz-/Breakpointwechseln auf. Ohne JavaScript oder GSAP bleiben Inhalte lesbar.

Die lokale Performance-Stichprobe auf 390/1920/3440 ergab 0 Canvas, keine mobilen Animations-Downloads und CLS unter 0,003. Das sind localhost-Diagnosen, keine Produktions- oder Lighthouse-Versprechen.

## Cooking / Cookie-Hinweis

Im Projekt gibt es keinen eigenständigen Cooking-Loader. Der Cookie-Hinweis erscheint automatisch höchstens einmal pro Browser-Session (`sessionStorage.site_notice_shown`). Eine gültige gespeicherte Auswahl unter `localStorage.cookie_consent` verhindert die erneute automatische Anzeige. Die Einstellungen bleiben manuell erreichbar; optionale Kategorien werden nicht ohne Einwilligung aktiviert. Nach Zurücknavigation wird der Hinweis nicht wiederhergestellt. Es gibt keine künstliche Navigationswartezeit.

## Reproduzierbare Prüfungen

Server: `npm start` auf localhost:3000.

```sh
npm run build
npm run check
npm run lint
npm run typecheck
npm run test:model
npm run test:scroll
npm run test:experience
npm run test:portfolio
npm run test:showcase
node experience/performance.cjs
```

- Experience: komplette Startseite bei 320/390/768/1366/1440/1920/2560/3440 px; sämtliche Sections, sechs Service-Zustände, sechs Prozessphasen, Sprache, Formular ohne Versand, FAQ, Navigation, Light Mode, kein JS, fehlendes GSAP und Reduced Motion.
- Dokumentseiten: mobile und drei große Desktop-Breiten, vollständiger Scrollweg.
- Showcase: BeeWork/BeeFocus/Cmdfind bei sieben Breiten, Vorwärts-/Rückwärts-Szenen, Icons, Navigation, Cookie-Persistenz, Konsole und Fallbacks.
- Model: rein lokale Website-Testdaten prüfen die neuen unabhängigen URLs und optionalen Icons. Keine Testreferenz wird veröffentlicht.
- Native Scrollprüfung: zusätzlich vollständige Wheel-Durchläufe bis zum Footer und Keyboard-Rückkehr bei 1920/2560/3440 px.

Screenshots und Messwerte: `tmp/home-review/` und `tmp/portfolio-review/` (git-ignoriert). Für Cmdfinds echte GitHub-Downloadabfrage muss Netzwerkzugriff erlaubt sein. Eine blockierte Sandbox-Anfrage gilt nicht als fehlerfreier Konsolentest; der Test wird dafür mit freigegebenem Zugriff erneut ausgeführt.

Es gibt kein React-SSR und daher kein Hydration-System. Runtime-/Console-Fehler werden dennoch geprüft. Keine Formspree-Testnachricht, kein Deployment, kein Commit und kein Push.
