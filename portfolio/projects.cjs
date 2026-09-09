// Canonical project metadata. Only featured projects appear on the homepage.
// Product stacks are limited to technologies named in the existing project pages.
/** @param {string} de @param {string} en */
const t = (de, en) => ({ de, en });
/** @satisfies {import('./project-types').PortfolioProject[]} */
module.exports = [
  {
    id: 'beework', name: 'BeeWork', type: 'app', client: null, url: null, detailPath: 'apps/beework/index.html', featured: true, accentColor: '#fbbf24',
    icon: 'assets/portfolio/beework-icon.svg', heroImage: 'assets/portfolio/beework-hero.png',
    tags: ['iOS', 'iPadOS', 'watchOS'],
    category: t('Arbeitszeit & Produktivität', 'Time tracking & productivity'),
    status: t('Veröffentlichung in Vorbereitung', 'Release in preparation'),
    title: t('Deine Zeit. Klar im Blick.', 'Your time. In clear view.'),
    description: t('Vom ersten Einstempeln bis zum Feierabend: Arbeitszeit, Gleitzeit und Planung in einer nativen App für das Apple-Ökosystem.', 'From clock-in to the end of your day: working hours, flexitime and planning in a native app for the Apple ecosystem.'),
    highlights: [t('Live-Zeiterfassung', 'Live time tracking'), t('Smart-Feierabend', 'Smart end-of-day'), t('Am Handgelenk', 'On your wrist')],
    about: t('BeeWork bündelt Zeiterfassung, Zeitkonto und die Planung des Arbeitstags. Die App ist für iPhone und iPad ausgelegt und wird durch eine Apple-Watch-App ergänzt.', 'BeeWork brings time tracking, your time balance and workday planning together. Designed for iPhone and iPad, it also includes an Apple Watch app.'),
    challenge: t('Arbeitsblöcke, Pausen und Gleitzeit verändern laufend den Überblick über den Tag. Die entscheidende Frage bleibt: Wie viel habe ich gearbeitet – und wann ist Feierabend?', 'Work sessions, breaks and flexitime constantly change the shape of a day. The essential question remains: how much have I worked, and when can I finish?'),
    solution: t('Ein gemeinsamer Ablauf verbindet Ein- und Ausstempeln mit Sollzeit und Saldo. Smart-Feierabend berechnet die voraussichtliche Endzeit; Widgets und Live Activities machen den Status ohne Umwege sichtbar.', 'A unified flow connects clocking in and out with target hours and your balance. Smart end-of-day calculates your finish time; widgets and Live Activities keep the status within reach.'),
    outcome: t('Das Produkt führt Zeiterfassung, Urlaubsplanung, Berichte und Apple-Integration zusammen. Der öffentliche App-Store-Link folgt mit der Veröffentlichung.', 'The product brings together time tracking, holiday planning, reports and Apple integration. A public App Store link will follow at release.'),
    technologies: ['CloudKit', 'Core Location', 'Geofencing', 'Live Activities', 'Widgets', 'Siri-Kurzbefehle'],
    cta: { href: '#download', label: t('Verfügbarkeit ansehen', 'Check availability') },
    visualAlt: t('BeeWork Produktvisual: iPhone und Apple Watch mit amberfarbener Zeitanzeige.', 'BeeWork product visual: iPhone and Apple Watch with an amber time display.')
  },
  {
    id: 'beefocus', name: 'BeeFocus', type: 'app', client: null, url: 'https://apps.apple.com/us/app/beefocus/id6753998003', detailPath: 'apps/beefocus/index.html', featured: true, accentColor: '#a78bfa',
    icon: 'apps/beefocus/assets/BeeFocus.PNG', iconCrop: true, heroImage: 'assets/portfolio/beefocus-hero.png',
    tags: ['iOS', 'iPadOS', 'Focus Timer'],
    category: t('Fokus & Tagesplanung', 'Focus & daily planning'),
    status: t('Im App Store', 'On the App Store'),
    title: t('Mehr Raum für deinen Fokus.', 'Make room for focus.'),
    description: t('Aufgaben, Fokus-Sessions und Gewohnheiten an einem Ort. Eine durchdachte Produktivitäts-App für einen klareren Alltag.', 'Tasks, focus sessions and habits in one place. A considered productivity app for a clearer everyday routine.'),
    highlights: [t('Fokus-Timer', 'Focus timer'), t('Aufgaben & Habits', 'Tasks & habits'), t('Tagesplanung', 'Daily planning')],
    about: t('BeeFocus verbindet Aufgabenverwaltung mit Fokus-Timer, Tagesplanung und Reflexion. Die Produktseite zeigt die App mit Ansichten für iPhone und iPad.', 'BeeFocus combines task management with a focus timer, daily planning and reflection. The product page presents iPhone and iPad views of the app.'),
    challenge: t('Aufgabenlisten allein schaffen noch keinen Fokus. Planung, konzentriertes Arbeiten und der Blick auf eigene Gewohnheiten müssen im Alltag zusammenpassen.', 'A task list alone does not create focus. Planning, concentrated work and reflection on habits need to fit together in everyday life.'),
    solution: t('Der Tagesplaner gibt Struktur, der Timer begleitet Fokus-Sessions und Statistiken machen den eigenen Verlauf sichtbar. Aufgaben, Habits und Journaling ergänzen diesen Ablauf.', 'The daily planner provides structure, the timer supports focus sessions and statistics show progress over time. Tasks, habits and journaling complete the flow.'),
    outcome: t('Eine im App Store verfügbare App verbindet Planung und Fokus. Die Detailansichten zeigen das Zusammenspiel von Aufgaben, Timer und persönlichen Auswertungen.', 'An app available on the App Store connects planning and focus. The detailed views show how tasks, the timer and personal statistics work together.'),
    technologies: ['iOS', 'iPadOS', 'Cloud-Sync', 'Homescreen-Widgets'],
    cta: { href: 'https://apps.apple.com/us/app/beefocus/id6753998003', label: t('Im App Store ansehen', 'View on the App Store') },
    visualAlt: t('BeeFocus Produktvisual: Fokus-Timer auf dem iPhone und Aufgabenplanung auf dem iPad.', 'BeeFocus product visual: a focus timer on iPhone and task planning on iPad.')
  },
  {
    id: 'cmdfind', name: 'Cmdfind', type: 'tool', client: null, url: 'https://github.com/indextorben/cmdfind', detailPath: 'apps/cmdfind/index.html', featured: true, accentColor: '#67e8f9',
    icon: 'assets/portfolio/cmdfind-icon.svg', heroImage: 'assets/portfolio/cmdfind-hero.png',
    tags: ['CLI', 'macOS', 'Windows', 'Linux'],
    category: t('Developer Tool', 'Developer tool'),
    status: t('Downloads auf GitHub', 'Downloads on GitHub'),
    title: t('Weniger suchen. Weiterbauen.', 'Find it. Keep building.'),
    description: t('Der passende Terminalbefehl, wenn du ihn brauchst. Ein plattformübergreifender Helfer für den Entwickleralltag.', 'The right terminal command when you need it. A cross-platform companion for everyday development.'),
    highlights: [t('Befehle nachschlagen', 'Look up commands'), t('Drei Plattformen', 'Three platforms'), t('Direkte Downloads', 'Direct downloads')],
    about: t('Cmdfind hilft beim Nachschlagen von CLI-Befehlen für Windows, macOS und Linux. Die Projektseite bündelt den Einstieg und die passenden Downloads je Betriebssystem.', 'Cmdfind helps you look up CLI commands for Windows, macOS and Linux. Its project page brings the introduction and platform-specific downloads together.'),
    challenge: t('Selten genutzte Befehle bleiben nicht immer im Gedächtnis. Dazu unterscheiden sich Werkzeuge und Syntax je nach Betriebssystem – schon das Entpacken eines Archivs kann eine Suche auslösen.', 'Occasional commands are easy to forget. Tools and syntax also differ between operating systems—even extracting an archive can require a search.'),
    solution: t('Ein auf Befehle zugeschnittener Einstieg stellt die gesuchte Aufgabe in den Mittelpunkt. Das Beispiel „extract zip“ zeigt die passenden Befehle für Windows, macOS und Linux nebeneinander.', 'A command-focused entry point puts the task first. The “extract zip” example presents the appropriate commands for Windows, macOS and Linux side by side.'),
    outcome: t('Die Downloadseite führt direkt zu den verfügbaren GitHub-Releases. Installationspakete und portable Varianten sind nach Betriebssystem geordnet.', 'The download page leads directly to the available GitHub releases. Installers and portable versions are grouped by operating system.'),
    technologies: ['CLI', 'Windows', 'macOS', 'Linux', 'GitHub Releases'],
    cta: { href: '#download', label: t('Downloads ansehen', 'View downloads') },
    visualAlt: t('Cmdfind Produktvisual: schwebende Befehlssuche und Terminal mit cyanfarbener Beleuchtung.', 'Cmdfind product visual: floating command search and terminal with cyan lighting.')
  },
  {
    id: 'deskpilot', name: 'DeskPilot', type: 'app', client: null, url: null, detailPath: 'apps/deskpilot/index.html', featured: false, accentColor: '#7dd3fc',
    icon: 'assets/portfolio/deskpilot-icon.svg', heroImage: 'assets/portfolio/deskpilot-hero.png',
    tags: ['iPhone', 'macOS', 'Quick Actions'], category: t('Mac-Fernsteuerung', 'Mac remote control'), status: t('In Planung', 'In planning'),
    title: t('Dein Mac. In deiner Hand.', 'Your Mac. In your hand.'),
    description: t('Das iPhone als Fernbedienung für den Mac: Trackpad, Medien und wiederkehrende Aktionen in einer Oberfläche.', 'Your iPhone as a remote for your Mac: trackpad, media and recurring actions in a single interface.'),
    highlights: [t('Lokale Verbindung', 'Local connection'), t('Trackpad & Medien', 'Trackpad & media'), t('Makros', 'Macros')],
    about: t('DeskPilot ist ein geplantes Produkt für die Steuerung des Mac vom iPhone aus. Der Entwurf verbindet Mediensteuerung, Trackpad, Texteingabe und Quick Actions.', 'DeskPilot is a planned product for controlling a Mac from an iPhone. The concept connects media controls, a trackpad, text input and quick actions.'),
    challenge: t('Bei Präsentationen oder der Medienwiedergabe ist der Mac nicht immer in Reichweite. Häufige Aktionen sollen trotzdem schnell erreichbar bleiben.', 'During presentations or media playback, your Mac is not always within reach. Frequent actions should still be readily accessible.'),
    solution: t('Die geplante Oberfläche bündelt direkte Steuerung und wiederverwendbare Makros. Eine lokale Verbindung soll den Mac und das iPhone ohne Cloud-Umweg verbinden.', 'The planned interface combines direct controls and reusable macros. A local connection is intended to link Mac and iPhone without a cloud intermediary.'),
    outcome: t('Die Projektseite dokumentiert den geplanten Funktionsumfang. Interessierte können über den Kontaktbereich ihr Interesse anmelden; ein öffentlicher Download ist noch nicht verlinkt.', 'The project page documents the planned feature set. Visitors can register interest through the contact section; no public download is linked yet.'),
    technologies: ['iPhone', 'macOS', 'Lokale Verbindung', 'Makros'], cta: { href: '#contact', label: t('Interesse anmelden', 'Register interest') },
    visualAlt: t('DeskPilot Konzeptvisual: iPhone mit Trackpad und Mediensteuerung vor einem MacBook.', 'DeskPilot concept visual: iPhone with trackpad and media controls in front of a MacBook.')
  },
  {
    id: 'ledger', name: 'Ledger', type: 'app', client: null, url: null, detailPath: 'apps/ledger/index.html', featured: false, accentColor: '#6ee7b7',
    icon: 'assets/portfolio/ledger-icon.svg', heroImage: 'assets/portfolio/ledger-hero.png',
    tags: ['iPhone', 'iPad', 'Mac'], category: t('Notizen & Organisation', 'Notes & organisation'), status: t('In Planung', 'In planning'),
    title: t('Gedanken brauchen einen Ort.', 'A place for your thoughts.'),
    description: t('Notizen, Checklisten und Erinnerungen in einer ruhigen Oberfläche. Ein App-Konzept für das Apple-Ökosystem.', 'Notes, checklists and reminders in a calm interface. An app concept for the Apple ecosystem.'),
    highlights: [t('Notizen & Checklisten', 'Notes & checklists'), t('Ordner & Tags', 'Folders & tags'), t('Erinnerungen', 'Reminders')],
    about: t('Ledger ist als reine Notizapp für iPhone, iPad und Mac geplant. Im Mittelpunkt stehen schnelles Erfassen, übersichtliches Organisieren und einfaches Wiederfinden.', 'Ledger is planned as a dedicated notes app for iPhone, iPad and Mac. Its focus is quick capture, clear organisation and easy retrieval.'),
    challenge: t('Spontane Gedanken, Aufgaben und Erinnerungen verteilen sich schnell auf verschiedene Orte. Eine Notizapp muss das Erfassen leicht machen, ohne die spätere Ordnung zu erschweren.', 'Spontaneous thoughts, tasks and reminders quickly become scattered. A notes app needs to make capture easy without making later organisation difficult.'),
    solution: t('Der Entwurf kombiniert Notizen mit Checklisten, Ordnern, Tags und Erinnerungen. Geplanter iCloud-Sync soll das Weiterarbeiten auf verschiedenen Apple-Geräten ermöglichen.', 'The concept combines notes with checklists, folders, tags and reminders. Planned iCloud sync is intended to support working across Apple devices.'),
    outcome: t('Die vorhandene Projektseite beschreibt das Konzept und den vorgesehenen Ablauf. Ledger ist noch in Planung; Fragen zum Projekt sind über den Kontaktbereich möglich.', 'The existing project page describes the concept and intended workflow. Ledger is still in planning; project enquiries can be made through the contact section.'),
    technologies: ['iPhone', 'iPad', 'macOS', 'iCloud-Sync (geplant)'], cta: { href: '#contact', label: t('Zum Projekt anfragen', 'Enquire about the project') },
    visualAlt: t('Ledger Konzeptvisual: dunkle Notizoberfläche auf einem Tablet mit Checkliste und grünen Akzenten.', 'Ledger concept visual: dark notes interface on a tablet with a checklist and green accents.')
  }
];
