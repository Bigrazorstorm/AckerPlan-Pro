# AgroTrack – Vollständige Spezifikations-Checkliste
## Prüfdokument für KI-gestützte Code-Review

---

> **Zweck dieses Dokuments:** Eine KI liest den bestehenden Next.js-Code und prüft jeden Punkt dieser Checkliste.  
> **Bewertung pro Punkt:**  
> ✅ Vollständig implementiert und korrekt  
> ⚠️ Teilweise vorhanden, Anpassung nötig  
> ❌ Fehlt vollständig – muss implementiert werden  
> 🔍 Nicht eindeutig prüfbar – manuelle Review empfohlen  
>
> **Nach der Prüfung:** Liste aller ❌ und ⚠️ als priorisierter TODO-Backlog ausgeben.

---

## PRÜFANWEISUNG FÜR DIE KI

Lies zunächst alle Dateien in `/src` vollständig. Identifiziere:
1. Alle vorhandenen Routen (`/app` oder `/pages`)
2. Alle Komponenten in `/components`
3. Alle Datenmodelle / Typen in `/types` oder `/lib`
4. Alle API-Routen in `/api`
5. Alle Datenbankschemas (Prisma, Drizzle, oder SQL-Dateien)
6. Die Genkit-AI-Konfiguration in `/ai`
7. Globale CSS / Tailwind-Konfiguration

Gehe dann diese Checkliste Punkt für Punkt durch. Verweise bei jedem Punkt auf die konkrete Datei und Zeilennummer wenn du etwas findest oder vermisst.

---

## 1. DESIGN SYSTEM & VISUELLE IDENTITÄT

### 1.1 Farbpalette

- [ ] Primärfarbe Grün (Natur/Agrar) ist als CSS-Variable definiert (`--color-primary`)
- [ ] Sekundärfarbe Erdbraun/Ocker ist als CSS-Variable definiert (`--color-secondary`)
- [ ] Akzentfarbe für Aktionen (Buttons, CTAs) ist definiert und kontrastreich
- [ ] Statusfarben sind vollständig definiert:
  - [ ] Erfolg/Aktiv: Grün (eigene Variable, nicht Tailwind-Standard)
  - [ ] Warnung: Orange/Amber
  - [ ] Kritisch/Fehler: Rot
  - [ ] Info: Blau
  - [ ] Neutral/Inaktiv: Grau
- [ ] Alle Farben erfüllen WCAG AA Kontrastverhältnis (4.5:1 für Text)
- [ ] Dunkel-Modus-Variablen vorhanden (relevant für Feldeinsatz bei Sonnenlicht)
- [ ] Keine generischen Purpur-Gradienten oder Standard-KI-Ästhetik
- [ ] Farbpalette ist agrarisch konnotiert (Grün, Erde, Himmel) – nicht tech-blau

### 1.2 Typografie

- [ ] Primäre Schriftart ist eingebunden (kein Arial, Inter oder Roboto)
- [ ] Schriftart ist für große Touchscreens gut lesbar (klare Buchstabenformen)
- [ ] Schriftgrößen-Skala ist als CSS-Variablen oder Tailwind-Config definiert
- [ ] Mindestschriftgröße für Fließtext: 16px (mobile)
- [ ] Mindestschriftgröße für Labels/Hilfstexte: 14px
- [ ] Zeilenhöhe (line-height) für Fließtext: mindestens 1.5
- [ ] Überschriften-Hierarchie H1–H4 ist klar unterscheidbar
- [ ] Alle Texte sind in Deutsch (keine englischen UI-Strings im Frontend)
- [ ] Zahlen-Font (für Kosten, Flächen) ist Tabular-lining (gleiche Zeichenbreite)

### 1.3 Spacing & Layout

- [ ] Einheitliches Spacing-System vorhanden (8px-Raster oder ähnlich)
- [ ] Alle Abstände werden aus der Skala genommen (keine willkürlichen px-Werte)
- [ ] Mobile: Minimaler Tap-Target-Bereich 48×48px für alle interaktiven Elemente
- [ ] Mobile: Keine Elemente näher als 8px Abstand zueinander (Fehlklick-Schutz)
- [ ] Desktop: Inhaltsbreite maximal 1440px, zentriert
- [ ] Konsistente Padding-Werte in Cards, Modals, Sections

### 1.4 Komponenten-Bibliothek

- [ ] Button-Komponente existiert mit Varianten:
  - [ ] Primary (Hauptaktion, prominent, farbig)
  - [ ] Secondary (Nebenakton, weniger prominent)
  - [ ] Destructive (Löschen, Rot)
  - [ ] Ghost (Tertiär, transparent)
  - [ ] Icon-only (quadratisch, für kompakte UIs)
  - [ ] Loading-State (Spinner integriert, Button deaktiviert während Laden)
- [ ] Alle Buttons haben `min-height: 48px` auf Mobile
- [ ] Input-Komponente existiert mit Varianten:
  - [ ] Text-Input
  - [ ] Number-Input (mit Einheit-Suffix, z.B. "ha", "€", "kg")
  - [ ] Dropdown/Select (native auf Mobile, custom auf Desktop)
  - [ ] Textarea
  - [ ] Date-Picker (mobilfreundlich, native Input auf Mobile)
  - [ ] Suchfeld mit Lösch-Button
- [ ] Card-Komponente existiert (für Schläge, Aufträge, Mitarbeiter)
- [ ] Badge/Tag-Komponente für Status-Labels
- [ ] Modal/Dialog-Komponente (Bottom Sheet auf Mobile, zentriert auf Desktop)
- [ ] Toast/Notification-Komponente für Feedback
- [ ] Skeleton-Loader-Komponente für Ladezustände
- [ ] Empty-State-Komponente (wenn Liste leer ist: Icon + Text + Aktion)
- [ ] Alle Komponenten sind in einem `/components/ui` Verzeichnis organisiert

### 1.5 Ikonographie

- [ ] Einheitliches Icon-Set wird verwendet (z.B. Lucide, Heroicons – nur EINES)
- [ ] Icons haben konsistente Größen: 20px (inline), 24px (standalone), 32px (featured)
- [ ] Landwirtschafts-spezifische Icons vorhanden oder custom SVGs:
  - [ ] Traktor
  - [ ] Schlag/Feld
  - [ ] Pflanze/Wachstum
  - [ ] Wildtier (für Schadensmodul)
  - [ ] Wetter (Sonne, Regen, Hagel)
- [ ] Icons werden nie ohne Beschriftung verwendet (Ausnahme: universell bekannte wie ✕, ☰)
- [ ] Icon + Label immer vertikal oder horizontal kombiniert, nie Icon allein in kritischen Aktionen

### 1.6 Animationen & Übergänge

- [ ] Seitenwechsel-Transition vorhanden (nicht hartes Springen)
- [ ] Modale öffnen mit Slide-Up auf Mobile, Fade auf Desktop
- [ ] Listen-Items erscheinen mit Stagger-Animation beim ersten Laden
- [ ] Button-Press hat haptisches Feedback auf Mobile (via `navigator.vibrate()`)
- [ ] Lade-Animationen sind vorhanden (kein leerer weißer Screen)
- [ ] Transitionen ≤ 300ms (nicht träge)
- [ ] `prefers-reduced-motion` wird respektiert

---

## 2. MOBILE-FIRST & RESPONSIVE DESIGN

### 2.1 Breakpoint-System

- [ ] Mobile-Breakpoint definiert: ≤ 640px
- [ ] Tablet-Breakpoint definiert: 641px – 1024px
- [ ] Desktop-Breakpoint definiert: ≥ 1025px
- [ ] Alle Seiten wurden mobile-zuerst entwickelt (CSS: mobile Base, dann `md:` und `lg:`)
- [ ] Kein horizontaler Scroll auf Mobile (320px Mindestbreite getestet)

### 2.2 Navigation Mobile

- [ ] Bottom Navigation Bar vorhanden (nicht Hamburger-Menü)
- [ ] Bottom Nav hat maximal 5 Punkte
- [ ] Bottom Nav-Items sind beschriftet (Icon + kurzer Text darunter)
- [ ] Aktiver Tab ist klar erkennbar (Farbe, Gewicht, Indikator)
- [ ] Bottom Nav ist `position: fixed` und überlagert keinen Seiteninhalt (Padding-bottom am Content)
- [ ] Safe Area Insets beachtet (`padding-bottom: env(safe-area-inset-bottom)`) für iPhone
- [ ] Swipe-Gesten für Tab-Wechsel vorhanden (optional, aber empfohlen)

### 2.3 Touch-Optimierung

- [ ] Alle Buttons und Links haben `:active`-State (visuelles Feedback beim Tippen)
- [ ] Kein `:hover`-only State (hover funktioniert nicht auf Touch)
- [ ] Abstände zwischen Listenelementen mindestens 4px (kein Fehltippen)
- [ ] Scrollbare Listen haben `-webkit-overflow-scrolling: touch` (flüssiges Scrollen iOS)
- [ ] Pull-to-Refresh auf relevanten Listen (Aufträge, Benachrichtigungen)
- [ ] Lange Listen verwenden virtualisiertes Rendering (nur sichtbare Items gerendert)
- [ ] Datumseingaben nutzen `<input type="date">` auf Mobile (nativer Picker)
- [ ] Zahleneingaben nutzen `inputmode="numeric"` oder `inputmode="decimal"`
- [ ] Telefonnummer-Felder nutzen `inputmode="tel"`

### 2.4 Formulare auf Mobile

- [ ] Formulare scrollen korrekt wenn Tastatur sich öffnet
- [ ] Aktives Formularfeld wird in den sichtbaren Bereich gescrollt (nicht von Tastatur verdeckt)
- [ ] "Nächstes Feld" Taste auf Tastatur springt korrekt zum nächsten Feld (`tabIndex`)
- [ ] Letztes Feld hat "Fertig" oder "Senden" als Tastatur-Aktion
- [ ] Formularvalidierung erscheint inline (nicht in einem Alert-Dialog)
- [ ] Fehlermeldungen erscheinen unter dem Feld, nicht oben auf der Seite
- [ ] Erfolgsbestätigung nach Formular-Submit ist sichtbar ohne zu scrollen

### 2.5 Performance Mobile

- [ ] Ladezeit unter 3G unter 5 Sekunden (First Contentful Paint)
- [ ] Bilder sind lazy-geladen (`loading="lazy"`)
- [ ] Bilder haben explizite `width` und `height` (kein Layout-Shift)
- [ ] Keine ungenutzten JavaScript-Bundles (Code-Splitting via Next.js `dynamic()`)
- [ ] Fonts sind mit `font-display: swap` eingebunden
- [ ] API-Calls werden gecacht (React Query oder SWR)

---

## 3. GLOBALE UX-PRINZIPIEN

### 3.1 Navigation & Orientierung

- [ ] Nutzer weiß immer wo er ist (aktiver Menüpunkt hervorgehoben, Breadcrumb auf Desktop)
- [ ] Zurück-Navigation funktioniert immer erwartungsgemäß
- [ ] Browser-Zurück-Button funktioniert korrekt (kein Verlust von Zustand)
- [ ] Tiefe Seiten haben Breadcrumb-Navigation (z.B. Schläge → Mühlfeld Ost → Aufträge)
- [ ] Seitentitel im Browser-Tab ist beschreibend (nicht nur "AgroTrack")

### 3.2 Feedback & Systemstatus

- [ ] Jede Aktion hat ein sichtbares Feedback (Loading, Erfolg, Fehler)
- [ ] Netzwerk-Fehler werden verständlich erklärt (nicht "Error 500")
- [ ] Offline-Status wird erkennbar angezeigt (Banner oder Icon)
- [ ] Lange Operationen haben Fortschrittsanzeige
- [ ] Erfolgreiche Speicherung wird bestätigt (Toast: "Gespeichert")
- [ ] Keine "Stille" nach Aktionen (immer Feedback, auch wenn nichts passiert)

### 3.3 Fehlerbehandlung

- [ ] 404-Seite existiert und ist hilfreich (Link zurück, keine tote Seite)
- [ ] Fehlerseite (`error.tsx`) existiert und ist benutzerfreundlich
- [ ] API-Fehler werden pro Feld angezeigt (nicht nur als globale Meldung)
- [ ] Netzwerkfehler lösen automatischen Retry aus (mit Exponential Backoff)
- [ ] Validierungsfehler blockieren nicht den gesamten Workflow

### 3.4 Leere Zustände (Empty States)

- [ ] Jede Liste hat einen Empty State (kein leerer weißer Bereich)
- [ ] Empty State enthält: Icon + erklärenden Text + direkte Aktion
- [ ] Beispiele: "Noch keine Schläge angelegt. Ersten Schlag erstellen →"
- [ ] Empty States sind motivierend formuliert, nicht frustrierend

### 3.5 Bestätigungsdialoge

- [ ] Destruktive Aktionen (Löschen) verlangen Bestätigung
- [ ] Bestätigungsdialog benennt konkret was gelöscht wird ("Schlag 'Mühlfeld Ost' wirklich löschen?")
- [ ] Abbrechen-Button ist links/oben (primäre Position), Löschen rechts/unten und rot
- [ ] Nicht-destruktive Aktionen verlangen KEINE Bestätigung (keine unnötigen Dialoge)

---

## 4. AUTHENTIFIZIERUNG & ONBOARDING

### 4.1 Login

- [ ] Login-Seite existiert (`/login` oder `/auth/login`)
- [ ] Login-Formular hat: E-Mail-Feld, Passwort-Feld, "Angemeldet bleiben"-Checkbox
- [ ] Passwort-Sichtbarkeit kann umgeschaltet werden (Auge-Icon)
- [ ] Fehler bei falschem Login ist verständlich ("E-Mail oder Passwort falsch")
- [ ] "Passwort vergessen"-Link vorhanden
- [ ] Login ist für Mobile optimiert (große Felder, korrekte Keyboardtypen)
- [ ] Nach Login: Weiterleitung zur ursprünglich aufgerufenen Seite
- [ ] Session bleibt nach App-Neustart bestehen (kein erneuter Login nötig)
- [ ] Biometrische Authentifizierung wird auf Mobile unterstützt (via Browser/PWA)

### 4.2 Onboarding neuer Betrieb

- [ ] Onboarding-Flow existiert für neue Betriebe
- [ ] Schritt 1: Betriebsdaten (Name, Adresse, Betriebsnummer, Wirtschaftsjahr-Start)
- [ ] Schritt 2: Erster Mitarbeiter / Admin-Account wird angelegt
- [ ] Schritt 3: Geodaten-Import (Bundesland wählen → Gemarkung eingeben → Flurstücke laden)
- [ ] Schritt 4: Erste Schläge aus Flurstücken gruppieren
- [ ] Schritt 5: Erste Maschine anlegen
- [ ] Fortschrittsanzeige im Onboarding (Schritt X von 5)
- [ ] Jeder Schritt ist einzeln speicherbar (kein Verlust bei Abbruch)
- [ ] Onboarding kann übersprungen werden (Daten später nachtragen)
- [ ] Nach Onboarding: Guided Tour / Tooltip-Einführung in die App

### 4.3 Rollenkonzept

- [ ] Drei Rollen sind implementiert: Betriebsleiter, Vorarbeiter, Mitarbeiter
- [ ] Vierte Rolle: Jäger (externer Lesezugang)
- [ ] Rollenbasierte Navigation (Mitarbeiter sieht keine Kosten)
- [ ] Rollenbasierte API-Zugriffskontrollen (Server-Side, nicht nur UI-Hiding)
- [ ] Rollenwechsel für Betriebsleiter möglich (kann alle Ansichten testen)

---

## 5. DASHBOARD

### 5.1 Layout & Struktur

- [ ] Dashboard ist die Startseite nach Login
- [ ] Mobile: Single-Column-Layout, Cards gestapelt
- [ ] Tablet: 2-Column-Grid
- [ ] Desktop: 3-4-Column-Grid mit unterschiedlichen Card-Größen
- [ ] Wichtigste Information "above the fold" (ohne Scrollen sichtbar)

### 5.2 Dashboard-Inhalte Betriebsleiter

- [ ] Karte-Widget: Mini-Karte mit Live-Status der Schläge (klickbar → große Karte)
- [ ] Heute-Widget: Anzahl laufende Aufträge, Anzahl Mitarbeiter im Einsatz
- [ ] Kosten-Widget: Kosten laufendes WJ (Zahl + Trend-Pfeil vs. Vorjahr)
- [ ] Handlungsbedarf-Widget: Alle offenen Alerts sortiert nach Dringlichkeit
- [ ] Letzte Aktivitäten: Chronologische Liste der letzten 5 abgeschlossenen Aufträge
- [ ] Wetter-Widget: Aktuelles Wetter für Betriebsstandort + 3-Tages-Vorschau
- [ ] Fristenkalender: Nächste 3 relevante Fristen (z.B. Sammelantrag in 14 Tagen)

### 5.3 Dashboard-Inhalte Vorarbeiter

- [ ] Tagesplan-Widget: Heutige geplante Aufträge mit Status
- [ ] Mitarbeiter-Status: Wer ist wo, wer ist verfügbar
- [ ] Maschinen-Status: Welche Fahrzeuge sind verfügbar / im Einsatz / in Wartung
- [ ] Wetter-Widget prominent (wichtig für Tagesplanung)
- [ ] Offene Genehmigungen: Abgeschlossene Aufträge die noch freigegeben werden müssen

### 5.4 Dashboard-Inhalte Mitarbeiter

- [ ] Mein heutiger Auftrag (groß, prominent, sofort erkennbar)
- [ ] "Neuen Auftrag starten"-Button (groß, grün, immer sichtbar)
- [ ] Laufender Timer wenn Auftrag aktiv (mit Schlagname)
- [ ] Meine Arbeitszeit diese Woche
- [ ] Letzte 3 eigene Aufträge

---

## 6. SCHLAG- & FLÄCHENVERWALTUNG

### 6.1 Schlag-Listenansicht

- [ ] Route existiert: `/schlaege` oder `/felder`
- [ ] Liste aller Schläge des Betriebs
- [ ] Jede Schlag-Card zeigt: Name, Fläche (ha), aktuelle Kultur, aktueller Status
- [ ] Schlag-Card zeigt Status-Badge (Farbkodierung nach Workflow-Status)
- [ ] Suchfeld zum Filtern der Schläge (Echtzeit-Filterung)
- [ ] Filter nach: Kultur, Status, Wirtschaftsjahr
- [ ] Sortierung nach: Name, Fläche, Deckungsbeitrag, letzter Aktivität
- [ ] Mobile: Liste, kein Grid (Cards nehmen volle Breite ein)
- [ ] Desktop: Grid mit 3–4 Cards nebeneinander
- [ ] "Neuer Schlag"-Button prominent oben rechts

### 6.2 Schlag-Detailseite

- [ ] Route existiert: `/schlaege/[id]`
- [ ] Header: Schlagname, Fläche ha, aktueller Status-Badge, Wirtschaftsjahr-Selector
- [ ] Tab-Navigation: Übersicht | Aufträge | Wachstum | Kosten | Schäden | Dokumente | Karte
- [ ] **Tab Übersicht:**
  - [ ] Kenndaten: Fläche amtlich vs. bewirtschaftet, Ackerzahl, Bodenart
  - [ ] Aktuelle Kultur: Name, Sorte, Saatdatum, Ernteziel
  - [ ] Pachtinfo: Verpächter, €/ha/Jahr, Laufzeit, Pachtende-Warnung wenn < 1 Jahr
  - [ ] Zugeordnete Flurstücke (Liste mit Flurstücksnummern und Flächen)
  - [ ] Aktive Auflagen (AUKM, Naturschutz) als farbige Tags
  - [ ] Jagdrevier-Zuordnung (Reviername, Jäger-Kontakt)
- [ ] **Tab Aufträge:**
  - [ ] Chronologische Liste aller Arbeitsaufträge für diesen Schlag
  - [ ] Filter nach Maßnahme, Zeitraum, Status
  - [ ] Jeder Eintrag: Datum, Maßnahme, Mitarbeiter, Dauer, Kosten
  - [ ] Klick öffnet Auftrag-Detail
  - [ ] "Neuer Auftrag"-Button direkt auf diesem Tab
- [ ] **Tab Wachstum:**
  - [ ] BBCH-Zeitachse (visuell als Timeline, nicht nur Liste)
  - [ ] Alle Bonituren chronologisch mit Foto-Thumbnails
  - [ ] Zeitraffer-Button (animiert durch alle Einträge)
  - [ ] "Bonitur erfassen"-Button direkt erreichbar
- [ ] **Tab Kosten:**
  - [ ] Kostenaufstellung laufendes WJ (Tabelle: Maßnahme, Kosten/ha, Kosten gesamt)
  - [ ] Deckungsbeitrag I und II (wenn Erntedaten vorhanden)
  - [ ] Vergleich Vorjahr (Balkendiagramm oder Prozentzahl)
  - [ ] Vergleich mit Betriebsdurchschnitt gleicher Kultur
- [ ] **Tab Schäden:**
  - [ ] Liste aller Schäden (Wild, Unwetter) mit Status
  - [ ] Fotos in Galerie-Ansicht
  - [ ] Jäger-Kontakt direkt anrufbar (tel:-Link)
  - [ ] "Schaden melden"-Button
- [ ] **Tab Dokumente:**
  - [ ] PSM-Protokoll aktuelles WJ (Tabelle, PDF-Export-Button)
  - [ ] Düngedokumentation (Tabelle, PDF-Export-Button)
  - [ ] Bodenanalysen (Upload-Möglichkeit + Liste)
  - [ ] Sonstige Dokumente (Drag & Drop Upload)
- [ ] **Tab Karte:**
  - [ ] Schlaggeometrie eingezeichnet
  - [ ] Flurstücksgrenzen als gestrichelte Linie
  - [ ] Boniturflächen als farbige Polygone
  - [ ] Schadenspunkte als Icons

### 6.3 Schlag anlegen / bearbeiten

- [ ] Formular für neuen Schlag
- [ ] Name (Freitext, z.B. "Mühlfeld Ost")
- [ ] Flurstücke zuordnen (Mehrfachauswahl aus vorhandenen Flurstücken oder Import)
- [ ] Karte zum Einzeichnen der Schlaggrenze (wenn keine Flurstücke vorhanden)
- [ ] Bewirtschaftete Fläche (kann von amtlicher Fläche abweichen, mit Hinweis)
- [ ] Pachtvertrag-Daten (Verpächter, Start, Ende, Preis/ha)
- [ ] Bodenart, Ackerzahl (optional)
- [ ] Aktive Auflagen (Mehrfachauswahl)
- [ ] Jagdrevier zuordnen (Dropdown vorhandener Reviere)

### 6.4 Anbauplanung pro Schlag

- [ ] Pro Wirtschaftsjahr: Kultur, Sorte, geplantes Saatdatum, Ernteziel (dt/ha)
- [ ] Fruchtfolge-Warnung wenn gleiche Kultur 3 Jahre in Folge
- [ ] Vorjahreskultur wird automatisch angezeigt
- [ ] GLÖZ-7-Prüfung läuft bei Kulturauswahl automatisch

---

## 7. ARBEITSAUFTRÄGE

### 7.1 Arbeitsauftrag starten (Mitarbeiter-Flow – kritischster UX-Flow)

- [ ] Route existiert: `/auftraege/neu` oder als Modal/Sheet
- [ ] **Schritt 1 – Schlag wählen:**
  - [ ] Karten-Ansicht (Schläge farbig, antippen zum Wählen)
  - [ ] Listen-Ansicht (Alternative, Suche möglich)
  - [ ] Zuletzt verwendete Schläge oben angezeigt
  - [ ] Aktueller GPS-Standort zeigt naheliegende Schläge zuerst
- [ ] **Schritt 2 – Maßnahme wählen:**
  - [ ] Große Icon-Buttons für 8 häufigste Maßnahmen (keine Dropdown-Liste)
  - [ ] "Weitere Maßnahmen" für seltenere Typen
  - [ ] Zuletzt verwendete Maßnahmen oben angezeigt
- [ ] **Schritt 3 – Fahrzeug wählen:**
  - [ ] Liste nur verfügbarer Fahrzeuge (in Wartung ausgegraut mit Grund)
  - [ ] Zuletzt verwendetes Fahrzeug vorausgewählt
  - [ ] Anbaugeräte werden nach Fahrzeugwahl angezeigt
  - [ ] "Ohne Fahrzeug" ist eine Option (Handarbeit)
- [ ] **Gesamtflow:**
  - [ ] Maximal 3 Schritte bis Timer läuft
  - [ ] Jeder Schritt auf eigener Screen-Ebene (kein langes Scrollen)
  - [ ] Zurück-Navigation zwischen Schritten ohne Datenverlust
  - [ ] "Sofort starten"-Button ohne Fahrzeug/Maschine möglich
  - [ ] Gesamtdauer des Flows: unter 30 Sekunden angestrebtes Ziel

### 7.2 Laufender Auftrag (Timer-Screen)

- [ ] Dedizierter Vollbild-Screen für laufenden Auftrag
- [ ] Laufende Zeit: groß, dominant, immer sichtbar
- [ ] Schlagname und Maßnahme prominent angezeigt
- [ ] Wetter zum Auftragsbeginn wird angezeigt (aktuell abgerufen)
- [ ] **Aktionen während laufendem Auftrag:**
  - [ ] Pause-Button (groß, gelb) – startet Pausentimer
  - [ ] Material erfassen (öffnet schnellen Eingabe-Sheet)
  - [ ] Foto machen (öffnet Kamera direkt)
  - [ ] Bonitur erfassen (öffnet Bonitur-Schnelleingabe)
  - [ ] Notiz hinzufügen (Freitext)
  - [ ] GPS-Track läuft im Hintergrund (Indikator sichtbar)
- [ ] Stop-Button: Rot, groß, am unteren Rand (schwer zu übersehen)
- [ ] Bei Stop: Zusammenfassung (Zeit, Material, Schlag) vor finalem Bestätigen
- [ ] Auftrag kann nicht aus Versehen gestoppt werden (1 Tap = Zusammenfassung, 2. Tap = Bestätigen)
- [ ] Screen-Lock wird verhindert während Auftrag läuft (`navigator.wakeLock`)

### 7.3 Materialerfassung während Auftrag

- [ ] Bottom Sheet öffnet sich (nicht neue Seite)
- [ ] Suchfeld für Artikel (Echtzeit-Suche im gecachten Lager)
- [ ] Häufig verwendete Artikel oben angezeigt
- [ ] Menge eingeben: numerisches Feld mit Einheit (l, kg, Sack)
- [ ] Charge: automatisch FIFO, manuell änderbar
- [ ] Mehrere Materialien pro Auftrag möglich
- [ ] Hinzugefügte Materialien werden auf dem Timer-Screen als Liste angezeigt
- [ ] Material kann nachträglich korrigiert werden

### 7.4 Auftrags-Listenansicht

- [ ] Route: `/auftraege`
- [ ] Filter: Status (Geplant, Aktiv, Abgeschlossen, Freigegeben), Schlag, Mitarbeiter, Maßnahme, Zeitraum
- [ ] Sortierung: Datum, Schlag, Mitarbeiter, Kosten
- [ ] Jede Auftrags-Card: Datum, Schlagname, Maßnahme, Mitarbeiter, Dauer, Kosten, Status-Badge
- [ ] Genehmigungsqueue für Vorarbeiter: Separate Liste "Warten auf Freigabe"
- [ ] Klick auf Auftrag: Detailansicht
- [ ] Swipe-to-Action auf Mobile: Schnelle Freigabe (Vorarbeiter)

### 7.5 Auftrags-Detailansicht

- [ ] Route: `/auftraege/[id]`
- [ ] Alle erfassten Daten sichtbar (Zeit, Schlag, Maßnahme, Mitarbeiter, Fahrzeug, Material)
- [ ] Automatisch berechnete Kosten aufgeschlüsselt
- [ ] GPS-Track auf Mini-Karte (wenn vorhanden)
- [ ] Fotos in Galerie (wenn vorhanden)
- [ ] Wetterdaten zum Auftragszeitpunkt
- [ ] Bearbeiten-Möglichkeit (für Vorarbeiter und Betriebsleiter)
- [ ] Freigabe-Button (für Vorarbeiter)
- [ ] Kommentar-Feld für Vorarbeiter-Anmerkungen

### 7.6 Auftragsplanung (Vorarbeiter)

- [ ] Route: `/planung`
- [ ] Wochen-Kalender-Ansicht (7 Tage horizontal)
- [ ] Neue Aufträge anlegen: Schlag + Maßnahme + Mitarbeiter + Datum + Maschine
- [ ] Mitarbeiter-Spalten oder Farb-Kodierung für verschiedene Personen
- [ ] Konflikterkennung: Gleiche Ressource doppelt an einem Tag → visuelles Overlap + Warnung
- [ ] Drag-and-Drop zum Verschieben von Aufträgen (Desktop)
- [ ] Tippen zum Bearbeiten auf Mobile
- [ ] Kopieren von Aufträgen (gleiche Maßnahme, anderes Datum)
- [ ] Vorlage-Funktion: Häufige Auftragsfolgen als Template speichern

---

## 8. PERSONAL & MITARBEITERVERWALTUNG

### 8.1 Mitarbeiter-Liste

- [ ] Route: `/personal`
- [ ] Liste aller Mitarbeiter mit: Name, Rolle, Status (aktiv/inaktiv), laufender Auftrag
- [ ] Qualifikations-Warnung: Roter Punkt wenn Sachkundenachweis abläuft
- [ ] "Neuer Mitarbeiter"-Button
- [ ] Suchfeld

### 8.2 Mitarbeiter-Detailseite

- [ ] Route: `/personal/[id]`
- [ ] Stammdaten: Name, Vorname, Personalnummer, Kontakt, Beschäftigungsart
- [ ] Stundensatz (kalkulatorisch, nur für Betriebsleiter sichtbar)
- [ ] **Qualifikationen-Tab:**
  - [ ] Liste aller Qualifikationen mit Ablaufdatum
  - [ ] Ampel: Grün (> 60 Tage), Gelb (< 60 Tage), Rot (abgelaufen)
  - [ ] Sachkundenachweis PSM: Nummer + Ablaufdatum + Upload Zertifikat
  - [ ] Führerscheinklassen (mit Ablaufdatum)
  - [ ] Maschinenberechtigungen (welche Fahrzeuge zugelassen)
  - [ ] Neue Qualifikation hinzufügen
- [ ] **Arbeitszeiten-Tab:**
  - [ ] Monatliche Übersicht (Kalender oder Liste)
  - [ ] Tagesgenaue Zeiten aus Arbeitsaufträgen
  - [ ] Überstunden-Saldo
  - [ ] Export als PDF oder CSV (für Lohnbuchhaltung)
- [ ] **Einsatz-Tab:**
  - [ ] Alle Aufträge dieses Mitarbeiters (filterbar)
  - [ ] Kosten pro Mitarbeiter-Stunde Durchschnitt

### 8.3 Schichtplanung

- [ ] Vorarbeiter kann Mitarbeiter für Tage/Aufgaben einplanen
- [ ] Mitarbeiter sieht seine Planung für die nächsten 7 Tage auf dem Dashboard
- [ ] Benachrichtigung wenn neuer Auftrag zugewiesen wurde

---

## 9. FUHRPARKVERWALTUNG

### 9.1 Fahrzeug-Liste

- [ ] Route: `/fuhrpark`
- [ ] Liste aller Fahrzeuge mit: Bezeichnung, Typ, Status (verfügbar/im Einsatz/Wartung/defekt)
- [ ] Wartungs-Warnung: Roter Punkt wenn Wartung fällig oder überfällig
- [ ] Aktuelle Betriebsstunden sichtbar
- [ ] "Neues Fahrzeug"-Button

### 9.2 Fahrzeug-Detailseite

- [ ] Route: `/fuhrpark/[id]`
- [ ] Stammdaten: Bezeichnung, Typ, Kennzeichen, Baujahr, Fahrgestellnummer
- [ ] Aktuelle Betriebsstunden (manuell aktualisierbar oder aus Telematik)
- [ ] Kalkulatorischer Stundensatz
- [ ] **Wartung-Tab:**
  - [ ] Wartungsplan: Liste aller Intervalle (Stunden oder Kalender)
  - [ ] Jedes Intervall: Beschreibung, letztes Datum, nächste Fälligkeit, Status-Ampel
  - [ ] Wartungshistorie (alle abgeschlossenen Wartungen)
  - [ ] "Wartung abschließen"-Button (öffnet Formular mit Stunden, Kosten, Teile, Notizen)
  - [ ] Dokumente: Rechnungen, Serviceberichte hochladen
- [ ] **Tägliche Sichtkontrolle:**
  - [ ] Checkliste (Öl, Wasser, Reifen, Beleuchtung, etc.)
  - [ ] Fahrer bestätigt vor Arbeitsbeginn (Pflichtschritt optional konfigurierbar)
  - [ ] Mängelmeldung erstellt automatisch Wartungsauftrag
- [ ] **Einsatz-Tab:**
  - [ ] Alle Arbeitsaufträge mit diesem Fahrzeug
  - [ ] Gesamtstunden pro Wirtschaftsjahr
  - [ ] Kostenauswertung
- [ ] **Anbaugeräte-Tab:**
  - [ ] Liste der zugeordneten Anbaugeräte
  - [ ] Zuordnung ändern (Gerät dem Fahrzeug anhängen/trennen)

### 9.3 Verfügbarkeitskalender

- [ ] Fahrzeug-Übersicht als Kalender (welches Fahrzeug wann verfügbar)
- [ ] Wartungszeiten und Einsätze eingezeichnet
- [ ] Bei Auftragsplanung: Nur verfügbare Fahrzeuge wählbar

---

## 10. LAGERVERWALTUNG

### 10.1 Lager-Übersicht

- [ ] Route: `/lager`
- [ ] Kategorien-Tabs: Alle | Saatgut | Dünger | PSM | Kraftstoff | Sonstiges
- [ ] Jeder Artikel: Name, aktueller Bestand, Einheit, Status-Ampel (Mindestbestand)
- [ ] Roter Alert wenn Mindestbestand unterschritten
- [ ] Suchfeld
- [ ] "Wareneingang buchen"-Button prominent
- [ ] Gesamtwert des Lagers (optional, nur für Betriebsleiter)

### 10.2 Artikel-Detailseite

- [ ] Route: `/lager/[id]`
- [ ] Stammdaten: Bezeichnung, Kategorie, Einheit, Mindestbestand, Lagerort
- [ ] Aktueller Bestand (aus Summe aller Chargenbewegungen)
- [ ] **Chargen-Tab:**
  - [ ] Liste aller Chargen mit: Lieferant, Datum, Menge, Einkaufspreis, Restmenge
  - [ ] Bei PSM: Chargennummer, Zulassungsnummer, Wartezeit
  - [ ] Sicherheitsdatenblatt-Upload bei PSM-Artikeln
  - [ ] FIFO-Darstellung (älteste Charge wird zuerst verbraucht)
- [ ] **Bewegungen-Tab:**
  - [ ] Chronologische Liste: Eingänge (+) und Entnahmen (-)
  - [ ] Jede Entnahme: Datum, Menge, Mitarbeiter, Arbeitsauftrag, Schlag
  - [ ] Graphische Bestandsentwicklung (Liniendiagramm)

### 10.3 Wareneingang

- [ ] Formular: Artikel wählen, Menge, Einheit, Lieferant, Lieferscheinnummer, Datum, Preis
- [ ] Chargennummer (Pflicht bei PSM)
- [ ] Zulassungsnummer (Pflicht bei PSM, Abgleich mit BVL-Datenbank)
- [ ] Dokument-Upload (Lieferschein-Foto oder PDF)
- [ ] Direkt vom Artikel-Screen oder von /lager aus erreichbar

### 10.4 PSM-Stammdaten

- [ ] Pro PSM-Artikel: Wirkstoff, HRAC-Code, Wartezeit, Zulassungsnummer
- [ ] Zulassungs-Enddatum → Warnung wenn Mittel bald nicht mehr zugelassen
- [ ] Gewässerabstandsauflagen hinterlegt
- [ ] Bienenschutzklasse hinterlegt

---

## 11. KARTENMODUL

### 11.1 Haupt-Karte

- [ ] Route: `/karte`
- [ ] Bibliothek: MapLibre GL JS (oder vergleichbar, nicht Google Maps wegen Kosten)
- [ ] Standard-Basiskarte: Orthofoto / Satellitenbild
- [ ] Basiskarten-Wechsler (Button oben rechts): Orthofoto | Topografisch | OSM
- [ ] Schlaggrenzen sind als Polygone eingezeichnet
- [ ] Schlagbezeichnung + Fläche (ha) erscheint als Label auf dem Polygon
- [ ] Klick auf Schlag öffnet Info-Popup (Name, Kultur, Status, Link zur Detailseite)
- [ ] Zoom-Buttons vorhanden (+ und –)
- [ ] "Mein Standort"-Button (GPS-Zentrierung)
- [ ] Vollbild-Button auf Mobile

### 11.2 Layer-System

- [ ] Layer-Panel (Button oben links öffnet Panel)
- [ ] Layer-Toggles (Ein/Aus) für:
  - [ ] Flurstücksgrenzen (gestrichelt, dünn)
  - [ ] Schlaggrenzen (fett, farbig)
  - [ ] Schlagbezeichnungen
  - [ ] Jagdreviergrenzen
  - [ ] Gewässer + 5m Pufferzone (rot)
  - [ ] Gewässer + 10m Pufferzone (orange)
  - [ ] Hangneigung > 10% (gelbe Schraffur)
  - [ ] Natura 2000 / FFH-Gebiete
  - [ ] Wasserschutzgebiete
  - [ ] Rote Gebiete (Nitrat)
  - [ ] AUKM-Verpflichtungsflächen
- [ ] Layers-Panel schließt bei Klick auf Karte
- [ ] Aktive Layer bleiben nach Seitenwechsel gespeichert (localStorage)

### 11.3 Status-Layer (Kartenansichten)

- [ ] Ansichten-Wechsler: Dropdown oder Tab-Leiste über der Karte
- [ ] **Kulturkarte:**
  - [ ] Jede Kultur hat eigene Füllfarbe (Legende einblendbar)
  - [ ] Tooltip bei Hover/Tap: Kultur, Sorte, Saatdatum
- [ ] **Workflow-Status-Karte:**
  - [ ] Farbkodierung nach Bearbeitungsstatus (Grau → Hellgrün → Dunkelgrün → Goldgelb → Braun)
  - [ ] Legende immer sichtbar
- [ ] **Live-Arbeitskarte:**
  - [ ] Fahrzeuge als Icons auf Karte (aktualisiert alle 30 Sekunden)
  - [ ] Fahrzeug-Icon zeigt Fahrtrichtung
  - [ ] Tooltip bei Klick: Fahrername, Maßnahme, Dauer
  - [ ] Schläge mit aktivem Auftrag grün pulsierend hervorgehoben
  - [ ] GPS-Fahrspuren (Track) als Linie für laufende Aufträge
- [ ] **Wirtschaftlichkeitskarte:**
  - [ ] Farbverlauf Rot → Orange → Gelb → Grün nach Deckungsbeitrag II
  - [ ] Legende mit €/ha-Skala
  - [ ] Nur verfügbar wenn Erntedaten vorhanden
- [ ] **Wildschaden-Karte:**
  - [ ] Schadenpunkte als wildart-spezifische Icons
  - [ ] Schadenflächen als rote Polygone
  - [ ] Reviergrenzen als farbige Linie
  - [ ] Heatmap-Toggle für Mehrjahresdarstellung
  - [ ] Filter nach Wildart, Jahr, Revier
- [ ] **Planungskarte:**
  - [ ] Aufträge der nächsten 7 Tage farblich nach Tag
  - [ ] Klick auf Schlag öffnet direkt Auftrags-Anlage-Sheet

### 11.4 Geodaten-Import

- [ ] WFS-Anbindung an Thüringer Geoportal implementiert
- [ ] Flurstücke können automatisch geladen werden (Gemarkung eingeben → Laden)
- [ ] Flurstücke werden als Polygone in der Datenbank gespeichert (PostGIS oder GeoJSON)
- [ ] Manuelles Einzeichnen von Schlaggrenzen möglich (für fehlende Geodaten)
- [ ] Bearbeiten vorhandener Grenzen (Polygon-Editing auf der Karte)

### 11.5 Offline-Karte

- [ ] Kartenkacheln für den Betriebsbereich werden gecacht (Service Worker)
- [ ] Schlaggrenzen sind offline verfügbar (aus lokaler DB)
- [ ] GPS-Track läuft auch ohne Netz

### 11.6 Karten-Export

- [ ] Screenshot-Funktion (Browser-native oder html2canvas)
- [ ] PDF-Export der Karte (mit Legende, Datum, Maßstab, Betriebsname)
- [ ] Ausgedruckte Karte ist maßstabsgetreu

---

## 12. WACHSTUMSDOKUMENTATION & BONITUREN

### 12.1 Bonitur erfassen (Mobile-Flow)

- [ ] Erreichbar: Direkt vom Timer-Screen aus, vom Dashboard, vom Schlag
- [ ] **Screen-Aufbau:**
  - [ ] Schlag vorausgewählt wenn von Schlag-Seite geöffnet
  - [ ] BBCH-Stadium: Großes Dropdown mit Foto-Vorschau je Stadium
  - [ ] Beobachtungstyp: 6 große Icon-Buttons (Routinebonitur, Schaderreger, Mangel, Lager, Stress, Sonstiges)
  - [ ] Intensität: Großer Slider 1–5 mit farblicher Anzeige
  - [ ] Foto: Kamera-Button (direkt öffnet Kamera, kein Umweg über Galerie)
  - [ ] Betroffene Fläche: Toggle "Gesamter Schlag" oder "Teilfläche einzeichnen"
  - [ ] Kommentar: Optionales Textfeld (zuletzt, nicht verpflichtend)
  - [ ] Maßnahme auslösen: Toggle "Arbeitsauftrag erstellen" (wenn Handlungsbedarf)
- [ ] Gesamtdauer: unter 45 Sekunden ohne Freitext und Polygon

### 12.2 BBCH-Kalender Ansicht

- [ ] Pro Schlag: Visuelle Timeline von Saat bis Ernte
- [ ] Alle Bonituren als Punkte auf der Zeitachse (farbkodiert nach Typ)
- [ ] Arbeitsaufträge als Balken auf separater Spur
- [ ] Wetterereignisse auf dritter Spur
- [ ] Klick auf Punkt: Detail-Popup (Datum, BBCH, Befund, Foto)
- [ ] Zeitraffer: Animierter Ablauf (Play-Button)
- [ ] Vergleich mit Vorjahr (zweite Timeline darunter)

### 12.3 Bodenanalysen

- [ ] Pro Schlag: Liste aller Bodenanalysen mit Datum
- [ ] Felder: pH, N, P, K, Mg, Humus
- [ ] LUFA-Import: CSV- oder PDF-Upload mit automatischer Zuordnung
- [ ] Warnung wenn letzte Analyse > 6 Jahre alt
- [ ] Visualisierung: Balkendiagramm der aktuellen Werte vs. Optimumbereich

---

## 13. SCHADENSDOKUMENTATION

### 13.1 Wildschaden melden (Mobile-Flow)

- [ ] Erreichbar: Direkt vom Dashboard, von der Karte, vom Schlag
- [ ] **Schnell-Meldung (unter 60 Sekunden):**
  - [ ] Schlag wählen (aus GPS-nahen Schlägen)
  - [ ] Wildart: 6 große Bild-Buttons (Wildschwein, Reh, Kranich, Gans, Hase, Sonstiges)
  - [ ] Schadenstyp (Verbiss, Aufbruch, Tritt, Fraß)
  - [ ] Foto machen (Pflicht, Kamera öffnet direkt)
  - [ ] Schadensgrad: Slider 1–5
  - [ ] Fläche: Schätzung in ha ODER Polygon auf Karte einzeichnen
  - [ ] Bestätigen → Jäger bekommt automatisch Push-Benachrichtigung
- [ ] Flurstück-Zuordnung und Revier-Zuordnung passiert automatisch im Hintergrund

### 13.2 Wildschaden-Liste

- [ ] Route: `/schaeden` oder Tab in Schlag-Detail
- [ ] Filter: Wildart, Revier, Status, Zeitraum
- [ ] Jeder Eintrag: Datum, Schlag, Wildart, Fläche, Status-Badge
- [ ] Status-Workflow sichtbar: Erfasst → Gemeldet → Begutachtet → Reguliert / Abgelehnt
- [ ] Status kann per Tap weitergeschaltet werden

### 13.3 Wildschaden-Detailseite

- [ ] Alle erfassten Daten
- [ ] Fotos in Galerie
- [ ] Karte mit eingezeichneter Schadensfläche
- [ ] Wetterdaten zum Zeitpunkt der Entdeckung
- [ ] Flurstück-Aufschlüsselung nach Jagdrevier
- [ ] Jäger-Kontakt direkt anrufbar
- [ ] PDF-Bericht generieren: vollständige Dokumentation für Jäger
- [ ] Status-Verlauf (wann wurde was gemeldet, wer hat reagiert)

### 13.4 Unwetterschaden melden

- [ ] Analoger Flow zu Wildschaden
- [ ] Ereignistyp: Hagel | Starkregen | Frost | Dürre | Sturm
- [ ] Mehrere Schläge gleichzeitig betroffenen markieren
- [ ] Wetterdaten werden automatisch für Ereigniszeitpunkt abgerufen
- [ ] DWD-Offizialwerte werden gespeichert und im Bericht angezeigt
- [ ] Versicherungs-PDF-Export vorformatiert

### 13.5 Jäger-Portal

- [ ] Separater Login für Jäger (eingeschränkte Rolle)
- [ ] Jäger sieht nur Schäden auf seinen Revierflächen
- [ ] Karte zeigt nur sein Revier mit Schadenspunkten
- [ ] Push-Benachrichtigung bei neuer Schadensmeldung
- [ ] Jäger kann Begutachtungstermin bestätigen (Klick auf Meldung → Datum eintragen)
- [ ] Jäger kann eigene Beobachtungen einzeichnen (Wildwechsel, Einstand)
- [ ] Jäger kann historische Schadensübersicht als PDF exportieren
- [ ] Jäger hat KEINEN Zugriff auf: Betriebsdaten, Kosten, Mitarbeiter

---

## 14. WIRTSCHAFTLICHKEITSANALYSE & CONTROLLING

### 14.1 Controlling-Dashboard

- [ ] Route: `/controlling`
- [ ] Wirtschaftsjahr-Selector (oben, prominent)
- [ ] **Übersichts-KPIs (oben, groß):**
  - [ ] Gesamtkosten laufendes WJ (€)
  - [ ] Durchschnittlicher Deckungsbeitrag II alle Schläge (€/ha)
  - [ ] Bester Schlag (DB II), Schlechtester Schlag (DB II)
  - [ ] Anteil Schläge mit positivem DB (%)
- [ ] **Kosten-nach-Kategorie-Diagramm** (Donut oder Balken: Lohn, Maschine, Material, Pacht)
- [ ] **Monatliche Kostenentwicklung** (Linien- oder Balkendiagramm)
- [ ] **Schlag-Ranking-Tabelle:**
  - [ ] Spalten: Schlag, Kultur, ha, Kosten/ha, Erlös/ha, DB I, DB II
  - [ ] Sortierbar nach jeder Spalte
  - [ ] Farbige Ampel-Punkte für DB II
  - [ ] Export-Button (Excel, PDF)

### 14.2 Schlag-Wirtschaftlichkeit

- [ ] Pro Schlag: vollständige Ergebnisrechnung (wie im Konzept beschrieben)
- [ ] Kosten werden aus Arbeitsaufträgen automatisch zusammengeführt
- [ ] Erlöse aus Vermarktungsmodul
- [ ] Direktkosten aus Lagermodul
- [ ] Pacht als Strukturkosten (automatisch aus Schlagstammdaten)
- [ ] Vergleich mit Vorjahr (absolut und %)
- [ ] Vergleich mit Betriebsdurchschnitt gleicher Kultur

### 14.3 Maschinenkosten-Auswertung

- [ ] Pro Fahrzeug: Gesamtstunden, Gesamtkosten, Kosten/Stunde Ist vs. Kalkulation
- [ ] Vergleich aller Fahrzeuge nebeneinander
- [ ] Diesel-Verbrauch pro Stunde (Kontrolle auf Plausibilität)

### 14.4 Mitarbeiter-Auswertung

- [ ] Pro Mitarbeiter: Gesamtstunden, Kosten, eingesetzte Schläge
- [ ] Nur für Betriebsleiter und Vorarbeiter sichtbar
- [ ] Kein Mitarbeiter sieht die Daten anderer Mitarbeiter

---

## 15. DOKUMENTATIONSPFLICHTEN

### 15.1 PSM-Protokoll

- [ ] Route: `/dokumentation/psm` oder Tab in Schlag-Detail
- [ ] Tabellen-Ansicht aller PSM-Anwendungen des laufenden WJ
- [ ] Alle Pflichtfelder gemäß § 67 PflSchG sind in der Tabelle vorhanden
- [ ] Vollständigkeits-Anzeige: Wie viele Einträge haben alle Pflichtfelder?
- [ ] Fehlende Pflichtfelder werden pro Zeile markiert und können inline ergänzt werden
- [ ] IPS-Nachweis-Status pro Eintrag (Checkliste ausgefüllt? Ja/Nein)
- [ ] Filter nach Schlag, Mittel, Zeitraum
- [ ] Export: PDF (pro Schlag, gesamt), Excel

### 15.2 Düngedokumentation

- [ ] Tabellen-Ansicht aller Düngungen
- [ ] N-Bilanz pro Schlag: laufend aktualisiert, Ampel-Status
- [ ] Betriebliche N-Gesamtbilanz
- [ ] Sperrfristen-Warnung: Wenn geplante Düngung in Sperrfrist fällt
- [ ] Düngebedarfsermittlung: Formular pro Schlag/Kultur
- [ ] Rote-Gebiete-Marker bei betroffenen Einträgen
- [ ] Export: PDF, Excel

### 15.3 Betriebsheft

- [ ] Automatisch generiertes Betriebsheft aus Betriebsdaten
- [ ] Enthält: Flächennutzung, Maßnahmen, Saatgut, Dünge- und PSM-Zusammenfassung
- [ ] Immer aktuell (wird on-demand generiert, nicht statisch)
- [ ] Export als PDF (A4, professionelles Layout)

### 15.4 Kontrollbereitschafts-Check

- [ ] Route: `/dokumentation/kontrolle`
- [ ] Checkliste mit allen relevanten Prüfbereichen
- [ ] Jeder Punkt: Status-Ampel (Grün/Gelb/Rot) + direkter Link zur Behebung
- [ ] Gesamtstatus oben: "Kontrollbereit" / "X Punkte offen"
- [ ] "Kontrollmappe exportieren"-Button: Bündelt alle relevanten PDFs

### 15.5 Arbeitszeitnachweise

- [ ] Export pro Mitarbeiter, pro Monat
- [ ] Format: PDF (offiziell, unterschriftbereit) und Excel
- [ ] Enthält: alle Tage, Zeiten, Kostenstellen
- [ ] Überstunden-Saldo sichtbar

---

## 16. GAP & FÖRDERWESEN

### 16.1 GLÖZ-Überwachung

- [x] Route: `/foerderwesen/gloez/[standard]` mit dynamischem Routing für alle 9 Standards ✅
- [x] Alle 9 GLÖZ-Standards sind implementiert und gelistet (GLOEZ_1 bis GLOEZ_9) ✅
- [x] Jeder Standard: Ampel-Status + Erklärung + Automtische Compliance-Prüfung ✅
- [x] GLÖZ 1: Dauergrünland-Schutz mit Umbruch-Detektion ✅
- [x] GLÖZ 2: Feuchtgebiet- und Moorboden-Schutz ✅
- [x] GLÖZ 3: Stoppelbrand-Verbot automatisch prüfbar ✅
- [x] GLÖZ 4: Pufferstreifen-Status aus Feldgeometrie automatisch ✅
- [x] GLÖZ 5: Erosionsschutz-Maßnahmen auf Hangflächen ✅
- [x] GLÖZ 6: Winterbegrünung und Mindestbodenbedeckung ✅
- [x] GLÖZ 7: Fruchtwechsel-Analyse aus Anbauhistorie automatisch ✅
- [x] GLÖZ 8: Berechnung nicht-produktive Flächen (% von Gesamtfläche) automatisch ✅
- [x] GLÖZ 9: Natura 2000 Habitat-Schutz und Bodenorganismen ✅
- [x] Detail-UI mit betroffenen Feldern und Handlungsempfehlungen ✅

### 16.2 Sammelantrag-Assistent

- [x] Route: `/foerderwesen/sammelantrag` erstellt ✅
- [x] Typsystem (SammelantragApplication, SammelantragFormState) definiert ✅
- [ ] Schritt-für-Schritt-Wizard UI-Komponente (7 Schritte)
- [ ] Schritt 1: Feldauswahl mit Gesamtflächenberechnung
- [ ] Schritt 2: Flächenabgleich (eigene Schläge vs. FLIK)
- [ ] Schritt 3: GLÖZ-Compliance-Prüfung vor Submission
- [ ] Schritt 4: Öko-Regelungen-Auswahl mit Prämien-Kalkulation
- [ ] Schritt 5: Dokumentation hochladen (Flächennachweise, Pachtverträge)
- [ ] Schritt 6: Plausibilitätsprüfung
- [ ] Schritt 7: Zahlungsvorschau und Antrag-Review
- [ ] Fortschrittsbalken über dem Wizard
- [ ] Zwischenspeicherung (kann in mehreren Sessions ausgefüllt werden)
- [ ] Frist-Countdown prominent angezeigt (Tage bis 15. Mai)
- [ ] PDF-Export für Behörden-Einreichung

### 16.3 Öko-Regelungen-Potenzialanalyse

- [ ] Automatische Analyse: Welche ÖR erfüllt der Betrieb bereits?
- [ ] Pro ÖR: Status (erfüllt/nicht erfüllt/knapp), erreichbare Prämie €, Handlungsempfehlung
- [ ] Gesamtpotenzial nicht abgerufener Prämien als Highlight-Zahl

### 16.4 Fristenkalender

- [ ] Route: `/foerderung/fristen` oder im Dashboard-Widget
- [ ] Kalender-Ansicht aller agrarpolitischen Fristen
- [ ] Farbkodierung: Rot (überfällig), Orange (< 14 Tage), Gelb (< 30 Tage), Grün (> 30 Tage)
- [ ] Fristen sind für Thüringen vorausgefüllt und jährlich aktualisierbar
- [ ] Eigene Fristen können hinzugefügt werden
- [ ] Push-Erinnerungen konfigurierbar pro Frist

---

## 17. BENACHRICHTIGUNGEN & ALERTS

### 17.1 Alert-System

- [ ] Zentrale Alert-Datenbank im Backend (alle Warnungen persistiert)
- [ ] Alert-Kategorien: Kritisch | Warnung | Info
- [ ] Alerts werden automatisch ausgelöst durch:
  - [ ] Sachkundenachweis < 60 Tage bis Ablauf
  - [ ] Maschinen-Wartung überfällig
  - [ ] PSM-Zulassung des verwendeten Mittels endet
  - [ ] Mindestbestand Lager unterschritten
  - [ ] Sperrfrist beginnt in 7 Tagen
  - [ ] Sammelantrag-Frist in 30 Tagen
  - [ ] GLÖZ-Anforderung verletzt oder gefährdet
  - [ ] Fahrzeug steht seit > 20 Min ohne Bewegung (mögliche Panne)
  - [ ] Neuer Wildschaden gemeldet (für Betriebsleiter + Jäger)

### 17.2 In-App-Benachrichtigungen

- [ ] Glocken-Icon in der Navigation mit Badge-Zähler
- [ ] Benachrichtigungs-Panel: Liste aller ungelesenen Alerts
- [ ] Alert-Eintrag: Icon (nach Kategorie), Kurzbeschreibung, Zeitstempel, Link zur Aktion
- [ ] Markierung als gelesen (einzeln oder alle)
- [ ] Kritische Alerts können nicht ohne Bestätigung ignoriert werden

### 17.3 Push-Benachrichtigungen

- [ ] PWA-Push-Benachrichtigungen implementiert (Web Push API)
- [ ] Opt-in beim ersten Start der App
- [ ] Kategorien konfigurierbar (Nutzer wählt was er empfangen möchte)
- [ ] Push kommt auch wenn App geschlossen ist

---

## 18. EINSTELLUNGEN & ADMINISTRATION

### 18.1 Betriebseinstellungen

- [ ] Route: `/einstellungen`
- [ ] Betriebsdaten bearbeiten (Name, Adresse, Betriebsnummer)
- [ ] Wirtschaftsjahr-Start festlegen (Monat)
- [ ] Maßnahmen-Typen verwalten (eigene Maßnahmen hinzufügen)
- [ ] Kostenstellenplan verwalten
- [ ] Standard-Stundensätze konfigurieren (Lohn-Pauschalwert, Maschinen)

### 18.2 Nutzerverwaltung

- [ ] Liste aller Nutzer des Betriebs
- [ ] Nutzer einladen (per E-Mail)
- [ ] Rolle zuweisen / ändern
- [ ] Nutzer deaktivieren (kein Löschen – für Datennachvollziehbarkeit)
- [ ] Eigene Profil-Einstellungen (Passwort ändern, Benachrichtigungen konfigurieren)

### 18.3 Jagdrevier-Verwaltung

- [ ] Reviere anlegen: Name, Revierführer (Name, Kontakt)
- [ ] Flurstücke einem Revier zuordnen (Mehrfachauswahl)
- [ ] Jäger-Zugang erstellen (separater Login, eingeschränkte Rechte)
- [ ] Jäger-Zugang deaktivieren

### 18.4 Datenexport & Datenschutz

- [ ] Vollständiger Datenexport als ZIP (alle Betriebsdaten, DSGVO-Recht)
- [ ] Wirtschaftsjahr abschließen (Daten einfrieren, kein weiteres Bearbeiten)
- [ ] Archivierte Wirtschaftsjahre lesend zugänglich (immer)

---

## 19. OFFLINE & PWA

### 19.1 Progressive Web App

- [ ] `manifest.json` vorhanden mit: Name, Icons (alle Größen), Farben, `display: standalone`
- [ ] Service Worker registriert
- [ ] App ist installierbar (Install-Prompt auf Mobile)
- [ ] App-Icon auf dem Home Screen zeigt Betriebsname
- [ ] Splash Screen beim Start (kein weißer Flash)
- [ ] App läuft ohne Browser-Adressleiste (standalone mode)

### 19.2 Offline-Funktionalität

- [ ] Folgende Daten sind offline verfügbar (Service Worker Cache):
  - [ ] Liste der eigenen Schläge
  - [ ] Liste der Fahrzeuge und Mitarbeiter
  - [ ] Lagerartikel-Liste (für Materialerfassung)
  - [ ] Eigene geplanten Aufträge
  - [ ] Kartenkacheln (letzter Betriebsbereich)
- [ ] Offline erstellte Daten werden lokal gespeichert (IndexedDB)
- [ ] Sync-Status ist sichtbar (letzter Sync-Zeitpunkt, ausstehende Sync-Elemente)
- [ ] Bei Verbindungsaufbau: automatischer Sync im Hintergrund
- [ ] Sync-Konflikte werden dem Vorarbeiter gemeldet (nicht still überschrieben)

### 19.3 Offline-Indikator

- [ ] Permanente Statusanzeige: Online / Offline (z.B. farbiger Punkt in der Navigation)
- [ ] Offline-Banner wenn keine Verbindung
- [ ] Klar kommuniziert welche Funktionen offline nicht verfügbar sind

---

## 20. GENKIT AI-INTEGRATION

### 20.1 Vorhandene AI-Konfiguration prüfen

- [ ] `/src/ai` Verzeichnis vorhanden
- [ ] Genkit korrekt initialisiert
- [ ] Welche AI-Flows sind bereits definiert? (auflisten)
- [ ] Welche AI-Features sind bereits implementiert? (auflisten)

### 20.2 Geplante AI-Features (prüfen ob vorhanden)

- [ ] **PSM-Beratung:** Nutzer beschreibt Schaderreger → AI empfiehlt zugelassenes Mittel
- [ ] **Anomalie-Erkennung:** AI erkennt ungewöhnliche Kosten oder Verbrauchswerte und meldet sie
- [ ] **Ernte-Prognose:** Auf Basis von BBCH, Wetter und Vorjahr → geschätzter Erntetermin
- [ ] **Bericht-Zusammenfassung:** AI fasst Wirtschaftsjahr in verständlichem Text zusammen
- [ ] **Formularausfüllung-Hilfe:** AI schlägt NC-Codes und Öko-Regelungen für Sammelantrag vor

### 20.3 AI-UX-Anforderungen

- [ ] AI-Antworten sind klar als solche gekennzeichnet (nicht als Fakten dargestellt)
- [ ] AI-Empfehlungen haben immer eine "Mehr erfahren"- oder "Ablehnen"-Option
- [ ] AI lädt schnell (Streaming-Antworten wenn möglich)
- [ ] AI-Fehler werden graceful behandelt (Fallback auf manuellen Flow)

---

## 21. SICHERHEIT & DATENSCHUTZ

### 21.1 Authentifizierung & Autorisierung

- [ ] Alle API-Routen sind geschützt (kein anonymer Zugriff auf Betriebsdaten)
- [ ] JWT-Tokens haben Ablaufzeit (Access Token: 15 Min, Refresh Token: 30 Tage)
- [ ] Rollenbasierte Autorisierung ist server-seitig (nicht nur UI-seitig)
- [ ] Ein Betrieb kann nie auf Daten eines anderen Betriebs zugreifen (Mandantentrennung)
- [ ] Passwörter werden gehasht (bcrypt oder argon2)
- [ ] Brute-Force-Schutz auf Login (Rate Limiting nach X Versuchen)

### 21.2 DSGVO

- [ ] Datenschutzerklärung verlinkt
- [ ] Cookie-Banner (wenn Cookies verwendet werden)
- [ ] Nutzer können ihre Daten exportieren
- [ ] Nutzer können ihre Daten löschen lassen
- [ ] Datenverarbeitungsvertrag (AVV) mit Hosting-Anbieter dokumentiert

### 21.3 Datensicherheit

- [ ] HTTPS erzwungen (kein HTTP-Zugriff)
- [ ] Sensible Daten (Stundensätze, Kosten) nur für berechtigte Rollen sichtbar
- [ ] Audit-Log: Alle Datenänderungen werden protokolliert (User, Zeitstempel, Änderung)
- [ ] Daten werden in EU/Deutschland gehostet

---

## 22. QUALITÄTSSICHERUNG

### 22.1 Code-Qualität

- [ ] TypeScript ist vollständig konfiguriert (`tsconfig.json`)
- [ ] Keine `any`-Typen in kritischen Dateien
- [ ] ESLint-Konfiguration vorhanden (`.eslintrc`)
- [ ] Alle Komponenten haben korrekte TypeScript-Props
- [ ] API-Response-Typen sind definiert (keine ungetypten Responses)

### 22.2 Testing

- [ ] Unit-Tests vorhanden (zumindest für Berechnungslogik: Kosten, DB, Nährstoffbilanz)
- [ ] E2E-Tests für kritische Flows (Login, Auftrag starten, Bonitur erfassen)
- [ ] Testabdeckung der Berechnungslogik: 80%+

### 22.3 Accessibility (Barrierefreiheit)

- [ ] Alle Formularfelder haben `<label>` (nicht nur Placeholder)
- [ ] `aria-label` bei Icon-only-Buttons
- [ ] Keyboard-Navigation funktioniert (Tab-Reihenfolge logisch)
- [ ] Fokus-Styles sind sichtbar (nicht von CSS entfernt)
- [ ] Fehler-Messages sind mit `aria-describedby` verknüpft
- [ ] Bilder haben `alt`-Text

---

## PRÜF-AUSGABE-FORMAT FÜR DIE KI

Nach vollständiger Prüfung, bitte folgendes ausgeben:

### Zusammenfassung

```
Gesamtpunkte geprüft:    ___
✅ Vollständig:          ___ (___ %)
⚠️ Teilweise:           ___ (___ %)
❌ Fehlt:               ___ (___ %)
🔍 Nicht prüfbar:       ___
```

### Kritische Lücken (❌ nach Priorität)

```
PRIORITÄT 1 – Blockiert Grundnutzung
  ❌ [Punkt] – [Datei fehlt oder Beschreibung]

PRIORITÄT 2 – Wichtige Features fehlen
  ❌ [Punkt] – [Beschreibung]

PRIORITÄT 3 – Nice-to-have fehlt
  ❌ [Punkt] – [Beschreibung]
```

### Anpassungsbedarf (⚠️)

```
  ⚠️ [Punkt] – [Was vorhanden ist] – [Was fehlt oder falsch ist]
```

### Positiv-Highlights (✅ Top 5 beste Umsetzungen)

```
  ✅ [Punkt] – [Warum besonders gut umgesetzt]
```

### Nächste Schritte (empfohlene Reihenfolge)

```
1. [Aufgabe] (behebt ___ kritische Punkte)
2. [Aufgabe]
3. ...
```

---

*AgroTrack Spezifikations-Checkliste v1.0 – für KI-gestützte Code-Review mit Next.js*  
*Erstellt: Februar 2026 | Format: Markdown mit Checkboxen*