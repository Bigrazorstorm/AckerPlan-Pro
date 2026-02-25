# AgroTrack – Parallelentwicklungs-Plan
## Teamaufteilung, Abhängigkeiten & Meilensteine

---

> **Kurzantwort:** Ja, parallele Entwicklung macht sehr viel Sinn –  
> aber nur mit einer **harten Voraussetzung**: Das Design System und das  
> Datenmodell müssen **als erstes und gemeinsam** fertig sein, bevor  
> irgendein Team anfängt. Sonst baut jeder auf Sand.

---

## WARUM PARALLELE ENTWICKLUNG HIER FUNKTIONIERT

AgroTrack hat eine natürliche Schichtung:

```
SCHICHT 1 – Fundament (blockiert alles andere)
  Design System · Datenmodell · Auth · API-Basisstruktur

SCHICHT 2 – Unabhängige Fachmodule (laufen parallel)
  Schläge · Fuhrpark · Personal · Lager · Karte · Dokumentation

SCHICHT 3 – Zusammenführung (braucht Schicht 2)
  Arbeitsaufträge · Controlling · Förderwesen

SCHICHT 4 – Veredelung (braucht Schicht 3)
  AI-Features · Offline/PWA · Jäger-Portal · Optimierungen
```

Die Module in Schicht 2 haben **kaum direkte Abhängigkeiten untereinander**.
Ein Team kann Fuhrpark bauen während ein anderes Lager baut –
solange beide dasselbe Design System und Datenmodell verwenden.

---

## DIE KRITISCHE VORAUSSETZUNG: SPRINT 0

**Bevor irgendein Feature-Team startet**, muss ein Kern-Team folgendes
liefern. Dauer: **1–2 Wochen**. Kein Team fängt vorher an.

```
SPRINT 0 – Das Fundament
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
VERANTWORTLICH: Lead-Developer + Designer (zusammen)

Design System (Designer):
  ☐ Farbpalette als CSS-Variablen (globals.css)
  ☐ Typografie-Skala (Schriftarten eingebunden)
  ☐ Spacing-System (tailwind.config.ts erweitert)
  ☐ Basis-Komponenten fertig und dokumentiert:
      Button (alle Varianten), Input (alle Varianten),
      Card, Badge, Modal/Sheet, Toast, Skeleton, EmptyState
  ☐ Icon-Set festgelegt (NUR EINES – z.B. Lucide)
  ☐ Bottom Navigation Komponente (Mobile)
  ☐ Seitenrahmen / Layout-Komponente

Datenmodell (Lead-Developer):
  ☐ Alle Prisma-Schemas (oder Drizzle) definiert:
      Betrieb, Wirtschaftsjahr, Flurstück, Schlag,
      Mitarbeiter, Qualifikation, Fahrzeug, Anbaugerät,
      Lagerartikel, Charge, Arbeitsauftrag, Materialentnahme,
      Bonitur, Schaden (Wild + Unwetter), Jagdrevier,
      Alert, Dokument, Vermarktung
  ☐ TypeScript-Typen aus Schema generiert
  ☐ API-Konventionen festgelegt (Namensgebung, Error-Format,
      Pagination-Schema, Response-Wrapper)
  ☐ Auth implementiert (Login, Session, Rollen)
  ☐ Middleware für Rollenprüfung bereit

Shared Infrastructure (Lead-Developer):
  ☐ React Query / SWR Setup
  ☐ API-Client (fetch-Wrapper mit Error-Handling)
  ☐ Toast-Provider global eingebunden
  ☐ Offline-Grundstruktur (Service Worker Skeleton)
  ☐ PWA manifest.json
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FREIGABE-KRITERIUM: Alle anderen Teams können die Komponenten
importieren und die API-Routes nutzen ohne zu wissen wie sie
intern funktionieren. Erst dann startet Sprint 1.
```

---

## TEAMAUFTEILUNG AB SPRINT 1

### Empfohlene Teamgröße

```
Minimum (2 Entwickler):    Sequenziell, kein echter Parallelismus
Optimal (3–4 Entwickler):  2 Feature-Teams + 1 Kern-Entwickler
Gut (5–6 Entwickler):      3 Feature-Teams + 1 Kern + 1 Mobile-Spezialist
Maximum sinnvoll (7–8):    4 Feature-Teams, danach Koordinationsaufwand > Gewinn
```

---

## DIE TEAMS & IHRE VERANTWORTLICHKEITEN

### TEAM KERN (1 Person – durchgehend)
*Kein Feature-Team. Hält das Fundament zusammen.*

```
Daueraufgaben:
  → Design System pflegen und erweitern wenn neue Komponenten gebraucht werden
  → API-Basisstruktur und Datenbank-Migrationen
  → Code-Reviews aller anderen Teams (Architektur-Konsistenz)
  → Merge-Conflicts auflösen
  → Shared Utilities (Datumsformatierung, Währungsformatierung, etc.)
  → Performance-Monitoring
  → CI/CD-Pipeline

Spielregel: Wenn ein Feature-Team eine neue Basis-Komponente braucht
            die andere auch nutzen werden → immer Team Kern beauftragen,
            nicht selbst bauen.
```

---

### TEAM A – Betrieb & Stammdaten
*Schläge, Flurstücke, Personal, Fuhrpark, Lager*

```
SPRINT 1 (Wochen 1–3):
  Schläge & Flurstücke:
  ☐ /schlaege – Listenansicht (mit Suche, Filter, Sortierung)
  ☐ /schlaege/[id] – Tab-Layout (alle 7 Tabs als Placeholder)
  ☐ /schlaege/neu – Formular (Name, Fläche, Pacht, Boden)
  ☐ Anbauplanung pro Schlag + Wirtschaftsjahr
  ☐ Flurstück-Zuordnung zu Schlägen
  ☐ Geodaten-Import: WFS-Anbindung Thüringen (Flurstücke laden)

  Personal:
  ☐ /personal – Liste
  ☐ /personal/[id] – Stammdaten + Qualifikationen-Tab
  ☐ Qualifikations-Ampel (Ablaufdatum-Logik)

SPRINT 2 (Wochen 4–6):
  Fuhrpark:
  ☐ /fuhrpark – Liste mit Status
  ☐ /fuhrpark/[id] – Stammdaten + Wartungsplan
  ☐ Wartungsprotokoll erfassen
  ☐ Tägliche Sichtkontrolle / Checkliste
  ☐ Betriebsstunden-Update

  Lager:
  ☐ /lager – Übersicht mit Kategorien-Tabs
  ☐ /lager/[id] – Chargen + Bewegungen
  ☐ Wareneingang-Formular
  ☐ Mindestbestand-Ampel
  ☐ PSM-Stammdaten (Zulassung, Wartezeit, HRAC)

ABHÄNGIGKEITEN VON TEAM A:
  → Team B braucht Schläge (für Arbeitsaufträge)
  → Team B braucht Fahrzeuge + Mitarbeiter (für Aufträge)
  → Team B braucht Lagerartikel (für Materialerfassung)
  → Team C braucht Schläge (für Karte)
  LÖSUNG: Stub-APIs ab Tag 1 (feste Test-IDs), echte API sobald fertig
```

---

### TEAM B – Arbeitsaufträge & Zeiterfassung
*Der kritischste UX-Flow der ganzen App*

```
SPRINT 1 (Wochen 1–3):
  Timer-Core:
  ☐ Auftrag-Starten-Flow (3 Schritte: Schlag → Maßnahme → Fahrzeug)
  ☐ Timer-Screen (laufende Zeit, Pause, Stop)
  ☐ GPS-Track im Hintergrund (Geolocation API)
  ☐ Screen-Wake-Lock (Display bleibt an)
  ☐ Material-Erfassung (Bottom Sheet während Auftrag)
  ☐ Foto-Erfassung (Kamera direkt öffnen)
  ☐ Auftrag beenden (Zusammenfassung + Bestätigung)
  ☐ Offline-Speicherung (IndexedDB) für alle obigen Flows

SPRINT 2 (Wochen 4–6):
  Auftrags-Verwaltung:
  ☐ /auftraege – Liste mit Filtern
  ☐ /auftraege/[id] – Detailansicht + GPS-Track-Mini-Map
  ☐ Kosten-Berechnung (Zeit × Satz + Material × Preis)
  ☐ Freigabe-Flow (Vorarbeiter bestätigt)
  ☐ Bearbeiten/Korrigieren nach Abschluss

  Planung (Vorarbeiter):
  ☐ /planung – Wochen-Kalender
  ☐ Neuen Auftrag planen (Schlag + Maßnahme + Mitarbeiter + Datum)
  ☐ Konflikterkennung (gleiche Ressource doppelt)
  ☐ Mobile: Tippen zum Bearbeiten (kein Drag-and-Drop nötig)
  ☐ Desktop: Drag-and-Drop

WICHTIG FÜR TEAM B:
  Der Auftrag-Starten-Flow ist das Herzstück. Ein Bauer der diesen
  Flow in 30 Sekunden schafft wechselt dauerhaft vom Papier.
  Einer der 90 Sekunden braucht tut es nicht.
  → Diesen Flow als erstes bauen, als erstes testen, immer wieder testen.

ABHÄNGIGKEITEN:
  → Braucht Schlag-Liste von Team A (Stub reicht für Sprint 1)
  → Braucht Fahrzeug-Liste von Team A (Stub reicht für Sprint 1)
  → Gibt Kosten-Daten an Team D (Controlling)
```

---

### TEAM C – Karte & Geodaten
*Kann weitgehend unabhängig von Teams A und B arbeiten*

```
SPRINT 1 (Wochen 1–3):
  Karten-Grundlage:
  ☐ MapLibre GL JS einbinden und konfigurieren
  ☐ /karte – Basisroute
  ☐ Basiskarten-Wechsler (Orthofoto, OSM, Topo)
  ☐ Schlaggrenzen aus Datenbank als Polygone darstellen
  ☐ Schlag-Labels (Name + ha)
  ☐ Klick auf Schlag → Info-Popup → Link zur Detailseite
  ☐ Zoom, Mein-Standort-Button
  ☐ Layer-Panel (Struktur, noch nicht alle Layer befüllt)
  ☐ Offline-Kartenkacheln (Service Worker Cache)

SPRINT 2 (Wochen 4–6):
  Status-Layer:
  ☐ Kulturkarte (Farben nach Kultur aus DB)
  ☐ Workflow-Status-Karte (Farbkodierung nach Status)
  ☐ Auflagen-Layer (Gewässerpuffer, Hangneigung, Schutzgebiete)
  ☐ Wildschaden-Layer (Icons + Polygone)
  ☐ Planungskarte (Aufträge nächste 7 Tage)

  Live-Arbeitskarte:
  ☐ Fahrzeug-Icons mit GPS-Position (WebSocket-Update alle 30s)
  ☐ GPS-Track laufender Aufträge als Linie
  ☐ Puls-Animation bei aktivem Schlag

  Geodaten-Import:
  ☐ WFS-Anbindung Thüringen fertigstellen (für Team A mitgebaut)
  ☐ Polygon-Editor (Schlaggrenzen manuell zeichnen/bearbeiten)
  ☐ PDF-Export der Karte

ABHÄNGIGKEITEN:
  → Braucht Schlag-Geometrien aus DB (Team A legt Schema fest, Team C füllt)
  → Braucht GPS-Positions-Daten von Team B (Live-Karte)
  → Relativ unabhängig – kann mit Mock-Daten beginnen
```

---

### TEAM D – Controlling & Dokumentation
*Kann erst vollständig starten wenn Team A und B Daten liefern*

```
SPRINT 1 (Wochen 1–3):
  Struktur aufbauen (mit Mock-Daten):
  ☐ /controlling – Layout und KPI-Cards (mit Platzhalter-Zahlen)
  ☐ Diagramm-Bibliothek einbinden (Recharts)
  ☐ Schlag-Wirtschaftlichkeits-Tabelle (Struktur)
  ☐ Wirtschaftsjahr-Selector (globale Komponente)
  ☐ /dokumentation – Layout mit Tabs
  ☐ PSM-Protokoll Tabelle (Struktur + Spalten)
  ☐ Düngedokumentation Tabelle (Struktur)
  ☐ Kontrollbereitschafts-Check (Checkliste-Struktur)
  ☐ PDF-Export-Infrastruktur (welche Library? react-pdf empfohlen)

SPRINT 2 (Wochen 4–6):
  Mit echten Daten aus Team A + B:
  ☐ Kosten-Berechnung live (aus Arbeitsaufträgen)
  ☐ Deckungsbeitrag I + II berechnen
  ☐ Nährstoffbilanz (N, P) aus Düngungsaufträgen
  ☐ GLÖZ-Prüfungen implementieren (alle 9 Standards)
  ☐ Sperrfristen-Logik (Düngedüngung)
  ☐ Sammelantrag-Assistent (Wizard-Struktur)
  ☐ Öko-Regelungen-Potenzialanalyse
  ☐ Fristenkalender
  ☐ PDF-Exporte: PSM-Protokoll, Düngedoku, Betriebsheft, Kontrollmappe

ABHÄNGIGKEITEN:
  → STARK abhängig von Team A (Schläge, Lager) und Team B (Aufträge)
  → Kann Sprint 1 mit Mock-Daten überbrücken
  → Sprint 2 erst starten wenn API-Endpunkte von A und B stabil sind
```

---

## ZEITPLAN GESAMTPROJEKT

```
      SPRINT 0     SPRINT 1         SPRINT 2         SPRINT 3
      Woche 0–2    Woche 1–3        Woche 4–6        Woche 7–9
      ─────────────────────────────────────────────────────────────
KERN  [Fundament ██████████] [Reviews+Fixes ████] [PWA+Offline ████]

A     [wartet ██] [Schläge+Personal ████] [Fuhrpark+Lager ████] [Polish]

B     [wartet ██] [Timer-Flow (PRIO!) ███] [Aufträge+Planung ████] [Polish]

C     [wartet ██] [Karte-Basis ████████] [Layer+Live-Karte ████] [Polish]

D     [wartet ██] [Struktur+Mock ██████] [Echte Daten ████████] [Polish]
      ─────────────────────────────────────────────────────────────
      MEILENSTEIN 1           MEILENSTEIN 2           MEILENSTEIN 3
      Fundament freigegeben   Erster echter           Feature-Complete
      Alle Teams starten      Feldeinsatz möglich     Beta-Start
```

### Meilenstein 1 – Ende Sprint 0 (Woche 2)
Alle Teams können unabhängig entwickeln. Design System dokumentiert. Datenbank läuft. Auth funktioniert. Stub-APIs verfügbar.

### Meilenstein 2 – Ende Sprint 1 (Woche 5)
Ein Mitarbeiter kann einen Auftrag starten und stoppen (auch offline). Schläge sind angelegt und auf der Karte sichtbar. Erster echter Feldtest möglich.

### Meilenstein 3 – Ende Sprint 2 (Woche 8)
Alle Kernmodule lauffähig. PSM-Dokumentation automatisch. Erster Deckungsbeitrag berechenbar. Beta-Test mit echtem Betrieb.

---

## SPIELREGELN FÜR PARALLELE ENTWICKLUNG

Diese Regeln sind nicht optional. Ohne sie entsteht Chaos.

### Regel 1 – API-Contract-First
```
Bevor Team A einen Endpunkt baut und Team B ihn nutzt:
→ Zuerst gemeinsam den Contract definieren (Route, Request, Response-Format)
→ Team B baut gegen einen Mock des Contracts
→ Team A implementiert den echten Endpunkt
→ Wenn fertig: Mock austauschen, kein Code-Refactoring nötig

Tool: OpenAPI/Swagger-Spec als einzige Wahrheitsquelle
```

### Regel 2 – Keine eigenen Basis-Komponenten
```
VERBOTEN:
  Team B baut einen eigenen "GreenButton" weil der Button von Team Kern
  noch nicht fertig ist.

ERLAUBT:
  Team B sagt: "Ich brauche einen Button mit Loading-State bis Freitag."
  Team Kern liefert ihn bis Freitag.
  Team B wartet 2 Tage und baut dann auf der richtigen Basis.

Begründung: 4 verschiedene Button-Implementierungen = 4x Wartungsaufwand
```

### Regel 3 – Feature Flags für unfertige Module
```
Wenn Team D das Controlling baut aber Team B noch keine Kostendaten
liefert: Feature Flag aktivieren.

// in /lib/features.ts
export const FEATURES = {
  controlling_live_data: process.env.NEXT_PUBLIC_FEAT_CONTROLLING === 'true',
  wildschaden_portal: false,
  ndvi_karte: false,
}

// in der Komponente:
if (!FEATURES.controlling_live_data) return <MockDataBanner />
```

### Regel 4 – Tägliche Sync-Calls (15 Minuten)
```
Nicht um Fortschritt zu berichten – sondern um Blockaden früh zu erkennen.

Fragen:
  1. Was blockiert mich heute?
  2. Was brauche ich von einem anderen Team bis wann?
  3. Hat jemand Änderungen am Datenmodell gemacht?

Änderungen am Datenmodell (Prisma Schema) werden IMMER vorher
im Sync angekündigt – nie still committet.
```

### Regel 5 – Gemeinsame Typen, kein Duplizieren
```
Alle TypeScript-Typen in /src/types/index.ts (oder gesplittet nach Domain)
Kein Team definiert einen eigenen "Schlag"-Typ.
Änderungen an Typen → PR → Review durch alle betroffenen Teams.
```

### Regel 6 – Mobile-First ist nicht verhandelbar
```
Jeder Entwickler testet seinen Code täglich auf:
  → Chrome DevTools mit Mobile Preset (375px, iPhone 14)
  → Echtes Gerät mindestens 1x pro Sprint

Kein Feature gilt als fertig wenn es auf Mobile nicht funktioniert.
"Machen wir später mobile-tauglich" führt zu vollständigem Rebuild.
```

---

## WAS NICHT PARALLEL ENTWICKELT WERDEN KANN

Ehrlichkeit ist hier wichtig. Folgende Bereiche sind sequenziell:

```
1. SPRINT 0 MUSS FERTIG SEIN
   Kein Team fängt an bevor Design System und Datenmodell stehen.
   Kosten einer Stunde zu früh starten: 10 Stunden Refactoring später.

2. ARBEITSAUFTRAG-FLOW VOR ALLEM ANDEREN IN TEAM B
   Erst Timer-Flow perfektionieren, dann Planung, dann Auswertungen.
   Der Flow ist der Überzeugungsmoment für den Bauern.

3. TEAM D ECHTE DATEN ERST AB SPRINT 2
   Controlling ohne echte Daten ist nur Darstellung.
   Sprint 1 für Struktur nutzen, Sprint 2 für echte Logik.

4. OFFLINE/PWA AM SCHLUSS
   Service Worker und Offline-Sync sind Querschnittsthemen.
   Erst wenn alle Features stabil laufen, Offline drauflegen.
   Empfehlung: Sprint 3 oder separates Offline-Sprint danach.

5. AI-FEATURES NACH FEATURE-COMPLETE
   Genkit-AI-Features (PSM-Beratung, Anomalie-Erkennung) bauen
   auf stabilen Daten auf. Erst nach Meilenstein 3 sinnvoll.
```

---

## ABHÄNGIGKEITS-MATRIX

```
                  KERN   TEAM A   TEAM B   TEAM C   TEAM D
                  ─────────────────────────────────────────
KERN              —      liefert  liefert  liefert  liefert
TEAM A (Stammd.)  nutzt  —        liefert  liefert  liefert
TEAM B (Aufträge) nutzt  nutzt    —        liefert  liefert
TEAM C (Karte)    nutzt  nutzt    nutzt    —        —
TEAM D (Control.) nutzt  nutzt    nutzt    —        —

Leseweise: "TEAM B nutzt TEAM A" bedeutet:
Team B braucht Daten/APIs von Team A um vollständig zu funktionieren.
```

---

## FÜR KLEINE TEAMS (1–2 PERSONEN)

Parallele Entwicklung mit einer Person ist kein Parallelismus –
aber die **Reihenfolge** aus diesem Plan bleibt trotzdem wertvoll:

```
Empfohlene Einzelentwickler-Reihenfolge:
  Woche 1–2:  Sprint 0 (Fundament – nicht überspringen!)
  Woche 3–4:  Timer-Flow vollständig (Team B, Sprint 1)
  Woche 5–6:  Schläge + Karte-Basis (Team A Sprint 1 + Team C Sprint 1)
  Woche 7–8:  Fuhrpark + Lager (Team A Sprint 2)
  Woche 9–10: Planung + Auftragsdetails (Team B Sprint 2)
  Woche 11–12: Layer-Karte + Live (Team C Sprint 2)
  Woche 13–14: Controlling + Dokumentation (Team D Sprint 1+2)
  Woche 15+:  GLÖZ, Förderung, AI, Offline
```

---

## FAZIT IN EINEM SATZ

Parallele Entwicklung funktioniert hier sehr gut –
**wenn Sprint 0 unantastbar ist, API-Contracts vor dem Coden vereinbart werden,
und niemand eigene Basis-Komponenten baut.**

Die größte Zeitersparnis entsteht nicht durch mehr Entwickler,
sondern durch die richtige Reihenfolge der ersten zwei Wochen.