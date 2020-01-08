# Memory Quiz
Das Memory Quiz trainiert sowohl Gedächtnis als auch Allgemeinwissen. Nachdem ein richtiges Paar gefunden wurde, gibt es nur Punkte wenn man die entsprechende Frage richtig beantwortet.

## Installation
Nach dem [Download](https://github.com/drkTettnang/memory-quiz/archive/master.zip) einfach die Datei `index.html` mit Chrome oder Firefox öffnen.

## Verwendung
In der Standardkonfiguration treten Team A gegen Team B an (Konfigurationsmöglichkeiten siehe unten) und beide haben jeweils 30 Sekunden Zeit ein Paar mit gleichem Motiv auszuwählen. Bei Erfolg erscheint eine zufällige Frage aus dem zuvor gewählten Schwierigkeitsgrad, welche die Gruppe innerhalb von 60 Sekunden beantworten muss. Der Spielleiter kann nun auf "Antwort anzeigen" klicken und entscheiden ob die Antwort richtig oder falsch war. Sollte der Spielleiter die Antwort bereits kennen, kann er um die Dramaturgie zu steigern, mit den Tasten r (richtig) und f (falsch) die Antwort einloggen. Danach ist die nächste Gruppe an der Reihe.

## Konfiguration
Unser Memory Quiz kann man auf verschiedene Arten und Weisen anpassen. Folgende Optionen sind vorgesehen:

### Memorykarten
Um die Motive zu ändern, muss man die Fotos mit den Dateinamen `card-0.jpg` bis `card-17.jpg` im Ordner `assets/` austauschen. Für schnelle Ladezeiten empfiehlt es sich die Dateigröße zu reduzieren.

### Fragen
Im Ordner `js/` gibt es drei Dateien mit dem Muster `question-ZAHL.json`. Hier finden sich die einfachen (1), mittleren (2) und schwierigen (3) Fragen. Um diese zu ändern müssen die Dateien entsprechend angepasst werden.

### Musik
Ein Quiz mit Musik macht gleich mehr Spaß, daher können verschiedene Audiodateien als Effekte und Hintergrundmusik konfiguriert werden. Hierzu muss der Aufruf von `memoryQuiz()` in der Datei `index.html` um folgenden Code erweitert werden und die entsprechenden Sounddateien an den richtigen Ort kopiert werden:

```
audio: {
        intro: new Audio('audio/intro.mp3'),
        correct: new Audio('audio/correct-pair.mp3'),
        correct2: new Audio('audio/correct-answer.mp3'),
        wrong2: new Audio('audio/wrong-answer.mp3'),
        wrong: new Audio('audio/wrong-pair.mp3'),
        wait: new Audio('audio/wait.mp3'),
        wait2: new Audio('audio/wait2.mp3'),
        selection: new Audio('audio/selection.mp3'),
        loggedInStart: new Audio('audio/logged-in-start.mp3'),
        loggedInLoop: new Audio('audio/logged-in-loop.mp3'),
},
```

### Teams
Anzahl der Teams und deren Namen sind frei wählbar. Hierzu muss der Aufruf von `memoryQuiz()` in der Datei `index.html` um folgenden Code erweitert werden:

```
teams: ['Team A', 'Team B', 'Team C'],
```

### Antworten-Anzeigen-Button verstecken
Wenn der Spielleiter sich sicher ist, dass er alle Antworten kennt, kann man den Antworten-Anzeigen-Button verstecken. Hierzu muss der Aufruf von `memoryQuiz()` in der Datei `index.html` um folgenden Code erweitert werden:

```
hideAnswerButton: true,
```

![Screenshot](doc/screenshot.png)
