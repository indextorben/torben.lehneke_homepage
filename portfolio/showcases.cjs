// Editorial scenes; UI mockups illustrate existing product features, not live app data.
const t = (de, en) => ({ de, en });
module.exports = {
  beework: {
    theme: 'amber', device: 'work', sequence: ['hero', 'statement', 'story', 'gallery'],
    headline: [t('Deine Zeit.', 'Your time.'), t('Dein Rhythmus.', 'Your rhythm.')],
    statement: t('Deine Zeit.\nKlar im Blick.', 'Your time.\nIn clear view.'),
    intro: t('Ein Arbeitstag. Alles im Gleichgewicht.', 'One workday. Everything in balance.'),
    steps: [
      { screen: 'clock', title: t('Ein Moment.\nDer Tag beginnt.', 'One moment.\nYour day begins.'), text: t('Einstempeln, loslegen. Mehrere Arbeitsblöcke und Aktivitäten bleiben in einem gemeinsamen Tagesverlauf.', 'Clock in and get going. Work sessions and activities stay together in one daily timeline.'), label: t('Arbeitszeit erfassen', 'Track working time') },
      { screen: 'break', title: t('Auch Pausen\nzählen dazu.', 'Breaks are\npart of the day.'), text: t('Arbeit und Erholung gehören zusammen. Pausen fließen in deine erfasste Zeit und die Berechnung des Feierabends ein.', 'Work and rest belong together. Breaks are included in your tracked time and your expected finish.'), label: t('Pausen berücksichtigen', 'Include your breaks') },
      { screen: 'balance', title: t('Mehr Klarheit.\nWeniger Kopfrechnen.', 'More clarity.\nLess mental maths.'), text: t('Sollzeit, Ist-Zeit und Gleitzeitsaldo auf einen Blick. So verstehst du deinen Tag, deine Woche und deinen Monat.', 'Target time, tracked time and flexitime at a glance. Understand your day, your week and your month.'), label: t('Gleitzeit verstehen', 'Understand flexitime') },
      { screen: 'month', title: t('Der ganze Monat.\nEin klares Bild.', 'A whole month.\nOne clear picture.'), text: t('Aus einzelnen Arbeitstagen wird ein verständlicher Verlauf. Monatsübersicht, Statistiken und Berichte machen deine Zeit nachvollziehbar.', 'Individual workdays become a clear timeline. Monthly views, statistics and reports make your time easy to understand.'), label: t('Monat auswerten', 'Review the month') },
      { screen: 'widget', title: t('Ein Blick genügt.', 'A glance is enough.'), text: t('Widgets, Live Activities und Dynamic Island bringen deinen laufenden Arbeitstag direkt auf den Bildschirm.', 'Widgets, Live Activities and Dynamic Island bring your current workday directly to your screen.'), label: t('Immer griffbereit', 'Always within reach') },
      { screen: 'watch', title: t('Dein Tag.\nAm Handgelenk.', 'Your day.\nOn your wrist.'), text: t('Die Apple-Watch-App ergänzt iPhone und iPad. Dein Status bleibt auch dann erreichbar, wenn das Telefon in der Tasche steckt.', 'The Apple Watch app complements iPhone and iPad. Your status stays within reach while your phone is in your pocket.'), label: t('Apple Watch', 'Apple Watch') }
    ],
    gallery: [
      ['apps/beework/assets/BeeWork-Promobilder-6.9-Zoll/clock-in.png', t('Einstempeln', 'Clock in')],
      ['apps/beework/assets/BeeWork-Promobilder-6.9-Zoll/monthly-overview.png', t('Monatsübersicht', 'Monthly overview')],
      ['apps/beework/assets/BeeWork-Promobilder-6.9-Zoll/report-export.png', t('Berichte & Export', 'Reports & export')]
    ]
  },
  beefocus: {
    theme: 'violet', device: 'focus', sequence: ['hero', 'field', 'story', 'statement', 'gallery'],
    headline: [t('Weniger Ablenkung.', 'Less distraction.'), t('Mehr Flow.', 'More flow.')],
    statement: t('Ein klarer Kopf.\nEin guter Tag.', 'A clear mind.\nA better day.'),
    intro: t('Plane. Fokussiere. Wachse.', 'Plan. Focus. Grow.'),
    steps: [
      { screen: 'tasks', title: t('Gedanken raus.\nKlarheit rein.', 'Clear your mind.\nFind your direction.'), text: t('Aufgaben sammeln, Prioritäten setzen und den Tag strukturieren. Deine nächste Aktion bekommt ihren Platz.', 'Capture tasks, set priorities and structure your day. Give your next action a place.'), label: t('Aufgaben', 'Tasks') },
      { screen: 'timer', title: t('Jetzt zählt\nnur dieser Moment.', 'Right now,\nthis moment matters.'), text: t('Der Fokus-Timer begleitet deine Session. Ein ruhiger Raum für konzentriertes Arbeiten – mit Zeit für die nächste Pause.', 'The focus timer accompanies your session. A calm space for concentrated work—with time for your next break.'), label: t('Fokus-Sessions', 'Focus sessions') },
      { screen: 'habits', title: t('Kleine Schritte.\nDein eigener Rhythmus.', 'Small steps.\nYour own rhythm.'), text: t('Gewohnheiten, Ziele und Reflexion verbinden einzelne Tage. Gestalte Routinen, die zu deinem Alltag passen.', 'Habits, goals and reflection connect individual days. Shape routines that fit your everyday life.'), label: t('Habits & Reflexion', 'Habits & reflection') },
      { screen: 'stats', title: t('Fortschritt\nwird sichtbar.', 'See your\nprogress.'), text: t('Statistiken geben deinem Verlauf eine Form. Entdecke, wie sich deine Fokuszeit und Aufgaben über die Zeit entwickeln.', 'Statistics give your history a shape. Explore how your focus time and tasks develop over time.'), label: t('Statistiken', 'Statistics') }
    ],
    gallery: [
      ['apps/beefocus/assets/Iphone/Tasks.PNG', t('Aufgaben', 'Tasks')],
      ['apps/beefocus/assets/Iphone/Timer.PNG', t('Fokus-Timer', 'Focus timer')],
      ['apps/beefocus/assets/Iphone/Statistik.PNG', t('Statistiken', 'Statistics')]
    ]
  },
  cmdfind: {
    theme: 'cyan', device: 'terminal', sequence: ['hero', 'story', 'statement', 'platforms', 'gallery'],
    headline: [t('Weniger suchen.', 'Find it.'), t('Weiterbauen_', 'Keep building_')],
    statement: t('Deine Aufgabe.\nDer passende Befehl.', 'Your task.\nThe right command.'),
    intro: t('Vom Gedanken zum Terminal.', 'From thought to terminal.'),
    steps: [
      { screen: 'search', title: t('Du kennst das Ziel.\nCmdfind den Weg.', 'You know the goal.\nFind the command.'), text: t('Du möchtest ein Archiv entpacken, aber der Befehl fehlt? Suche nach der Aufgabe und finde den passenden Einstieg.', 'Need to extract an archive but cannot recall the command? Search for the task and find a starting point.'), label: t('Command Search', 'Command search') },
      { screen: 'filter', title: t('Deine Plattform.\nDein Werkzeug.', 'Your platform.\nYour tool.'), text: t('Windows, macOS oder Linux: Die vorhandene Oberfläche ordnet Befehle nach Plattform, Sprache und Shell ein.', 'Windows, macOS or Linux: the existing interface organises commands by platform, language and shell.'), label: t('Plattform & Filter', 'Platform & filters') },
      { screen: 'platforms', title: t('Drei Systeme.\nEin Gedanke.', 'Three systems.\nOne idea.'), text: t('Bleib bei deiner Aufgabe, auch wenn das Betriebssystem wechselt. Die Downloads sind direkt nach Plattform geordnet.', 'Stay with your task even when your operating system changes. Downloads are organised by platform.'), label: t('Cross Platform', 'Cross-platform') }
    ],
    gallery: [['apps/cmdfind/assets/cmdfind.png', t('Cmdfind – vorhandene Produktoberfläche', 'Cmdfind — existing product interface')]]
  }
};
