# AgroTrack – Digitale Betriebsführung für Agrarbetriebe
## Vollständiges Produktkonzept

---

> **Version:** 1.0  
> **Stand:** Februar 2026  
> **Zielgruppe:** Agrarbetriebe jeder Größe, Vorarbeiter, Betriebsleiter, Buchhalter, Jäger  
> **Plattformen:** iOS, Android, Web (Desktop & Tablet)

---

## Inhaltsverzeichnis

1. [Vision & Philosophie](#1-vision--philosophie)
2. [Zielgruppen & Rollen](#2-zielgruppen--rollen)
3. [Systemarchitektur](#3-systemarchitektur)
4. [Datenkern & Datenmodell](#4-datenkern--datenmodell)
5. [Phase 1 – Kernmodule](#5-phase-1--kernmodule)
6. [Phase 2 – Erweiterungsmodule](#6-phase-2--erweiterungsmodule)
7. [Kartenmodul & Geodaten](#7-kartenmodul--geodaten)
8. [Wirtschaftlichkeitsanalyse](#8-wirtschaftlichkeitsanalyse)
9. [Wachstumsdokumentation](#9-wachstumsdokumentation)
10. [Schadensdokumentation](#10-schadensdokumentation)
11. [Dokumentationspflichten & EU-Konformität](#11-dokumentationspflichten--eu-konformität)
12. [GAP & Förderwesen](#12-gap--förderwesen)
13. [Interface & UX-Konzept](#13-interface--ux-konzept)
14. [Mobile Nutzung](#14-mobile-nutzung)
15. [Technische Architektur](#15-technische-architektur)
16. [Schnittstellen & Integrationen](#16-schnittstellen--integrationen)
17. [Rollout-Strategie](#17-rollout-strategie)
18. [Positionierung & Mehrwert](#18-positionierung--mehrwert)

---

## 1. Vision & Philosophie

### Die Kernidee

AgroTrack ist keine Buchhaltungssoftware die nach der Ernte ausgefüllt wird. Es ist ein lebendes Betriebssystem das **während der Arbeit** befüllt wird – und daraus automatisch Controlling, Dokumentation und Fördergrundlagen erzeugt.

Das System folgt drei unveränderlichen Grundsätzen:

**Erfassen wie es passiert.** Jede Eingabe geschieht im Moment der Handlung – im Feld, auf dem Traktor, beim Beladen. Nicht am Abend, nicht am Freitag, nicht am Jahresende.

**Kein Mehraufwand durch Dokumentation.** Jede gesetzliche Pflicht entsteht als automatisches Nebenprodukt der Arbeitsdaten. PSM-Protokoll, Düngedokumentation, Betriebsheft – alles wird beiläufig erfüllt, ohne separaten Aufwand.

**Daten werden wertvoller mit der Zeit.** Ein Wirtschaftsjahr bringt Orientierung. Drei Jahre bringen Vergleiche. Fünf Jahre bringen Erkenntnisse die kein Berater liefern kann – weil sie aus dem eigenen Betrieb stammen.

### Der strategische Mehrwert

Der Bauer wird durch seine eigenen Daten zum informiertesten Menschen über seinen eigenen Betrieb. Er muss nicht mehr schätzen ob Schlag A oder Schlag B profitabler ist. Er sieht es. Er muss nicht mehr raten ob die neue Sorte besser abschneidet. Er weiß es. Er muss nicht mehr streiten ob der Wildschaden erheblich war. Er dokumentiert es.

AgroTrack ist die Brücke zwischen dem klassischen Familienbetrieb der heute mit Papier und Excel arbeitet und dem datengetriebenen Präzisionsbetrieb der Zukunft – ohne dass der Bauer Informatiker sein muss.

### Abgrenzung

AgroTrack ist **kein** ERP-System das von einer IT-Abteilung betreut werden muss. Es ist **kein** Formular-Tool das nur ausfüllt was die Behörde fordert. Es ist **keine** Insellösung für einen Bereich. Es ist ein durchgängiges, mobil-erstes Betriebswerkzeug das alle Bereiche eines Agrarbetriebs verbindet.

---

## 2. Zielgruppen & Rollen

### Primäre Nutzer

**Betriebsleiter / Bauer**
Der Entscheider. Er will auf einen Blick sehen ob der Betrieb auf Kurs ist. Welche Schläge Geld bringen, welche nicht. Wo gerade gearbeitet wird. Was an Dokumentation fehlt. Er nutzt das System vor allem über die Web-App am Schreibtisch oder das Tablet beim Morgenkaffee – und gelegentlich das Smartphone im Feld.

**Vorarbeiter / Schichtleiter**
Der Organisator. Er plant den Arbeitstag, weist Mitarbeiter und Maschinen zu, überwacht die laufende Arbeit in Echtzeit. Er ist der häufigste Nutzer der Planungsansichten und der Live-Karte. Er arbeitet primär auf dem Tablet, gelegentlich am Smartphone.

**Mitarbeiter / Maschinenführer**
Der Ausführende. Er braucht eine App die in 30 Sekunden einen Arbeitsauftrag startet. Keine langen Menüs, kein Login-Theater, keine Pflichtfelder die er im Feld nicht kennt. Er arbeitet ausschließlich am Smartphone, oft mit dreckigen Händen, oft ohne Netz.

**Buchhalter / Bürokraft**
Der Verwalter. Er pflegt Stammdaten, prüft Buchungen, exportiert Berichte und bereitet den Steuerberater vor. Er arbeitet ausschließlich am Desktop-Browser.

### Sekundäre Nutzer

**Jäger / Revierführer**
Externer Nutzer mit eingeschränktem Zugang. Sieht nur seine Revierflächen, neue Wildschadensmeldungen und die historische Schadensübersicht. Kein Zugriff auf Betriebsdaten, Kosten oder Personalinformationen.

**Steuerberater / Agrarbüro**
Lesender Zugriff auf exportierte Daten oder direkte Schnittstelle zum DATEV-Export. Kein Systemzugang im Normalbetrieb.

**Kontrollbehörde (indirekt)**
Kein Systemzugang. Empfänger von exportierten Kontrollmappen, PSM-Protokollen, Betriebsheften.

### Rollenkonzept im System

Jeder Nutzer hat eine primäre Rolle die seine Berechtigungen und seine Standard-Startansicht bestimmt. Berechtigungen sind granular steuerbar: Ein Mitarbeiter kann Zeiterfassung und Materialverbrauch sehen und erfassen, aber keine Kosten und keine Personalstammdaten anderer Mitarbeiter.

---

## 3. Systemarchitektur

### Überblick

```
┌────────────────────────────────────────────────────────────────────┐
│                         PRÄSENTATIONSSCHICHT                        │
│                                                                      │
│   Mobile App (iOS/Android)    │    Web-App (Browser)                │
│   Mitarbeiter · Vorarbeiter   │    Büro · Controlling · Admin       │
│   Offline-First               │    Vollumfänglich                   │
└──────────────────────────────────────────────────────┬─────────────┘
                                                        │
┌───────────────────────────────────────────────────────▼─────────────┐
│                          API-GATEWAY                                  │
│   REST + GraphQL · JWT Auth · Rate Limiting · Audit Log              │
└──────────────────────────────────────────────────────┬──────────────┘
                                                        │
        ┌───────────────────────────────────────────────┤
        │                                               │
┌───────▼──────────┐                        ┌──────────▼──────────────┐
│   CORE SERVICES  │                        │   INTEGRATION LAYER      │
│                  │                        │                          │
│ · Betrieb        │                        │ · Geodaten (WFS/WMS)     │
│ · Schläge        │                        │ · Wetter (DWD)           │
│ · Arbeitsaufträge│                        │ · DATEV                  │
│ · Personal       │                        │ · ISOBUS / Telematik     │
│ · Fuhrpark       │                        │ · BVL (PSM-Daten)        │
│ · Lager          │                        │ · InVeKoS / ELAN         │
│ · Dokumentation  │                        │ · Sentinel (NDVI)        │
└──────────────────┘                        └─────────────────────────┘
        │
┌───────▼────────────────────────────────────────────────────────────┐
│                         DATENSCHICHT                                │
│                                                                      │
│  PostgreSQL + PostGIS    │  Dokumentspeicher (S3)  │  Event Bus     │
│  Betriebsdaten           │  Fotos, PDFs, Docs       │  Alerts       │
│  Geodaten                │  Zertifikate             │  Fristen      │
│  Zeitreihen              │  Rechnungen              │  Webhooks     │
└────────────────────────────────────────────────────────────────────┘
```

### Offline-First Prinzip

Die Mobile App funktioniert vollständig ohne Internetverbindung. Alle betriebsrelevanten Daten (Schläge, Mitarbeiter, Fahrzeuge, Lagerartikel, offene Aufträge) werden beim Start des Arbeitstags oder automatisch über Nacht auf das Gerät synchronisiert. Neue Einträge werden lokal gespeichert und bei nächster Verbindung synchronisiert.

Konflikte (z.B. zwei Mitarbeiter buchen gleichzeitig auf dieselbe Maschine) werden nach dem Prinzip Last-Write-Wins aufgelöst, mit Benachrichtigung an den Vorarbeiter.

Kartenkacheln für den Betriebsbereich werden ebenfalls vorgeladen und sind offline verfügbar.

### Event Bus

Ein zentraler Event Bus überwacht kontinuierlich alle Betriebsdaten und löst Benachrichtigungen aus:

- Wartungsintervalle nähern sich
- Sperrfristen für Düngung beginnen in 7 Tagen
- Sachkundenachweis läuft in 45 Tagen ab
- Mindestbestand Lagermaterial unterschritten
- PSM-Zulassung des verwendeten Mittels endet
- GLÖZ-Anforderung droht verletzt zu werden
- Frist Sammelantrag in 30 Tagen

Benachrichtigungen erscheinen als Push-Notification auf dem Smartphone und als Hinweis im Dashboard der Web-App.

---

## 4. Datenkern & Datenmodell

### Betrieb & Organisation

Der Betrieb ist die oberste Organisationseinheit. Alle Daten gehören zu genau einem Betrieb. Mehrere Betriebe können von einem Nutzer verwaltet werden (z.B. Betriebsgemeinschaften, Lohnunternehmer).

```
Betrieb
├── Name, Adresse, Rechtsform
├── Betriebsnummer (InVeKoS)
├── USt-ID, DATEV-Nummer
├── Wirtschaftsjahr (Start-Monat konfigurierbar)
│   → Kalenderjahr: Januar–Dezember
│   → Agrares WJ: z.B. Oktober–September
├── Kostenstellen (pro Schlag, Maschine, Mitarbeiter)
└── Buchungsperioden (Monats-, Jahresabschluss)
```

### Flurstücke & Schläge

```
Flurstück (amtliche Einheit)
├── Gemarkung, Flur, Flurstücksnummer
├── Amtliche Fläche (ha)
├── Geometrie (GeoJSON Polygon, aus ALKIS)
├── Eigentümer (Name, Kontakt)
├── Pachtvertrag (Beginn, Ende, Preis €/ha/Jahr)
├── Jagdrevier-Zuordnung
├── FLIK-Nummer (für Förderanträge)
└── Bodentyp, Ackerzahl (optional)

Schlag (bewirtschaftete Einheit)
├── Name / Bezeichnung (eigene Benennung des Bauern)
├── Besteht aus 1–n Flurstücken
├── Bewirtschaftete Fläche (kann von amtlicher Fläche abweichen)
├── GPS-Geometrie (aus Flurstücken zusammengesetzt)
├── Anbauhistorie pro Wirtschaftsjahr
│   └── Kultur, Sorte, Saatdatum, Ernteziel, Ergebnis
├── Bodenanalysen (pH, N, P, K, Mg, Humus – mit Datum)
└── Aktive Auflagen (AUKM, Naturschutz, Wasserschutz)
```

Der Unterschied zwischen Flurstück und Schlag ist wichtig: Flurstücke sind amtliche Parzellen die sich nicht ändern. Schläge sind die tatsächlich bewirtschafteten Einheiten die der Bauer selbst definiert – oft bestehend aus mehreren Flurstücken die zusammen bearbeitet werden.

### Personal

```
Mitarbeiter
├── Name, Vorname, Personalnummer
├── Kontaktdaten, Notfallkontakt
├── Beschäftigungsart (Festanstellung, Saisonarbeit, Minijob)
├── Stundensatz (kalkulatorisch, intern)
├── Arbeitszeitkonto
├── Qualifikationen
│   ├── Führerscheinklassen (mit Ablaufdatum)
│   ├── Maschinenberechtigung (welche Geräte freigegeben)
│   ├── PSM-Sachkundenachweis (Nummer + Ablaufdatum)
│   └── Weitere Zertifikate
└── Rolle im System (Mitarbeiter / Vorarbeiter / Betriebsleiter)
```

### Fuhrpark

```
Fahrzeug / Maschine
├── Bezeichnung, Typ, Hersteller, Modell
├── Kennzeichen, Baujahr, Fahrgestellnummer
├── Betriebsstundenzähler (aktuell)
├── Stundensatz (kalkulatorisch)
├── Kraftstoffart, Tankinhalt
├── Wartungsintervalle (nach Stunden und Kalender)
├── Versicherung, TÜV (mit Ablaufdaten)
└── Verfügbarkeitsstatus (verfügbar / in Wartung / defekt)

Anbaugerät
├── Bezeichnung, Typ
├── Zuordnung zu Fahrzeug (wechselbar)
├── Eigener Stundensatz (optional)
└── Wartungsintervalle

Verbrauchsmaterial (Lagerartikel)
├── Bezeichnung, Kategorie
│   → Saatgut | Dünger | PSM | Kraftstoff | Sonstiges
├── Einheit, Mindestbestand
├── Aktueller Bestand
└── Chargen (Eingang, Preis, Lieferant)
```

### Das zentrale Objekt: Arbeitsauftrag

Der Arbeitsauftrag ist das Herzstück des Systems. Er verbindet alle anderen Entitäten und ist die Quelle aller Kosten, Dokumentationen und Protokolle.

```
Arbeitsauftrag
├── ID, Wirtschaftsjahr
├── Schlag (Pflichtfeld)
├── Maßnahme / Tätigkeitsart
│   → Bodenbearbeitung (Pflügen, Grubbern, Eggen...)
│   → Aussaat / Pflanzung
│   → Düngung (mineralisch / organisch)
│   → Pflanzenschutz (Fungizid, Herbizid, Insektizid...)
│   → Ernte
│   → Transport
│   → Sonstiges
├── Status: Geplant → Aktiv → Abgeschlossen → Freigegeben
├── Erstellt von (Vorarbeiter oder Mitarbeiter selbst)
│
├── PLANUNG (optional, vor Ausführung)
│   ├── Geplantes Datum, Zeitfenster
│   ├── Vorgesehener Mitarbeiter
│   ├── Vorgesehenes Fahrzeug + Anbaugerät
│   └── Geplantes Verbrauchsmaterial
│
├── AUSFÜHRUNG (während/nach der Arbeit)
│   ├── Mitarbeiter (1–n)
│   ├── Fahrzeug + Anbaugerät (tatsächlich genutzt)
│   ├── Zeiterfassung
│   │   ├── Start-Zeitstempel (GPS-Position)
│   │   ├── Pausen (Beginn/Ende)
│   │   ├── Stop-Zeitstempel (GPS-Position)
│   │   └── GPS-Track (Fahrspur während der Arbeit)
│   ├── Verbrauchsmaterial (Art, Menge, Charge)
│   ├── Betriebsstunden Maschine
│   ├── Fotos (georeferenziert, Zeitstempel)
│   └── Notizen / Freitextkommentar
│
├── KOSTEN (automatisch berechnet)
│   ├── Lohnkosten (Zeit × Stundensatz Mitarbeiter)
│   ├── Maschinenkosten (Stunden × Maschinensatz)
│   ├── Materialkosten (Menge × Einkaufspreis)
│   └── Summe € gesamt / € pro ha
│
└── DOKUMENTATION (automatisch erzeugt)
    ├── PSM-Protokollzeile (wenn PSM-Maßnahme)
    ├── Düngeprotokollzeile (wenn Düngung)
    └── Arbeitszeitnachweis-Zeile
```

---

## 5. Phase 1 – Kernmodule

### 5.1 Zeiterfassung & Arbeitsaufträge

Das Kernmodul. Ein Mitarbeiter startet einen Arbeitsauftrag in unter 30 Sekunden:

1. App öffnen → "Auftrag starten"
2. Schlag wählen (aus Karte oder Liste)
3. Maßnahme wählen (Dropdown)
4. Fahrzeug wählen (Liste der verfügbaren Geräte)
5. Timer läuft

Während der Arbeit können jederzeit Verbrauchsmaterial, Fotos und Notizen ergänzt werden. Bei Stop wird der Auftrag automatisch abgeschlossen und synchronisiert.

Ein Mitarbeiter kann einen Auftrag ohne Vorplanung starten. Das System legt einen neuen Auftrag im Status "Aktiv" an. Der Vorarbeiter sieht das sofort in der Live-Übersicht.

### 5.2 Schlagkartei

Die digitale Akte jedes Schlags. Enthält alle Arbeitsaufträge, Bonituren, Schadensmeldungen, Bodenanalysen und Anbauhistorie chronologisch sortiert. Jederzeit einsehbar, durchsuchbar, exportierbar.

### 5.3 Fuhrparkverwaltung

Übersicht aller Fahrzeuge mit aktuellem Status, Betriebsstunden und nächsten Wartungsfälligkeiten. Einsatzhistorie pro Fahrzeug. Kostenkalkulation pro Maschine.

### 5.4 Personalverwaltung

Mitarbeiterstammdaten, Qualifikationen, Arbeitszeitkonten. Einsatzhistorie pro Mitarbeiter. Lohnjournal-Export.

### 5.5 Einfaches Controlling

Kostenübersicht pro Schlag, pro Wirtschaftsjahr. Vergleich Plan vs. Ist. Erste Deckungsbeitragsrechnung sobald Erntedaten vorliegen.

---

## 6. Phase 2 – Erweiterungsmodule

### 6.1 Lagerverwaltung

#### Konzept

Betriebsmittel (Saatgut, Dünger, PSM, Diesel) werden eingekauft, eingelagert und bei Arbeitsaufträgen entnommen. Das Modul verwaltet Bestände, Chargen und Kosten lückenlos – was für PSM- und Düngedokumentation zwingend erforderlich ist.

#### Datenstruktur

```
Lagerartikel
├── Kategorie: Saatgut | Dünger | PSM | Kraftstoff | Sonstiges
├── Bezeichnung, Handelsname
├── Einheit (kg, l, t, Sack)
├── Mindestbestand → Warnung bei Unterschreitung
├── Aktueller Bestand (Summe aller Chargenbewegungen)
└── Lagerort (Scheune, Tank, etc.)

Wareneingang (Charge)
├── Lieferant, Lieferscheinnummer, Datum
├── Menge, Einkaufspreis (netto + MwSt)
├── Chargennummer (bei PSM: Pflicht)
├── Zulassungsnummer (PSM)
├── Sicherheitsdatenblatt (Dokument-Upload)
└── Wartezeit (PSM, aus Stammdaten)

Entnahme
├── Verknüpft mit Arbeitsauftrag (automatisch)
│   oder manuelle Entnahme (mit Begründung)
├── Artikel, Menge, Charge (FIFO-Prinzip)
└── Mitarbeiter, Datum, Schlag
```

#### Besonderheiten

Diesel: Der Verbrauch pro Betriebsstunde wird automatisch berechnet und mit Referenzwerten verglichen. Auffällige Abweichungen (möglicher Schwund, defekter Zähler) werden gemeldet.

Mindestbestandsalarme verhindern dass ein Betriebsmittel mitten in der Kampagne ausgeht. Das System schlägt den Nachbestellbedarf anhand des durchschnittlichen Verbrauchs vor.

### 6.2 Wartungsmanagement

#### Konzept

Maschinen stehen still wenn sie ungeplant ausfallen. Das Wartungsmodul verschiebt Instandhaltung von reaktiv zu geplant. Es kennt jeden Betriebsstundenzähler und meldet sich rechtzeitig vor dem nächsten Intervall.

#### Datenstruktur

```
Wartungsplan pro Fahrzeug
├── Intervalltyp
│   → Nach Betriebsstunden (z.B. Ölwechsel alle 250h)
│   → Nach Kalender (z.B. jährliche HU)
│   → Saisonstart / Saisonende
├── Aufgabenbeschreibung
├── Zuständigkeit (eigenes Personal / externe Werkstatt)
├── Benötigte Ersatzteile (aus Lager oder extern)
└── Letzte Durchführung + Nächste Fälligkeit (automatisch)

Wartungsprotokoll (abgeschlossen)
├── Durchgeführte Arbeiten
├── Verbaute Teile + Kosten
├── Betriebsstunden bei Durchführung
├── Durchgeführt von (Mitarbeiter oder Werkstatt)
└── Dokumente (Rechnung, Foto)

Tägliche Sichtkontrolle (Checkliste)
├── Fahrer bestätigt vor Arbeitsbeginn (Pflicht)
│   → Ölstand, Reifendruck, Beleuchtung, etc.
├── Mängelmeldung möglich → erzeugt Wartungsauftrag
└── Übergabeprotokoll bei Fahrerwechsel
```

#### Integration mit Planung

Eine Maschine mit fälliger oder laufender Wartung ist in der Einsatzplanung als nicht verfügbar markiert. Der Vorarbeiter sieht das beim Zuweisen sofort. Er kann die Wartung trotzdem übersteuern – aber nur mit Bestätigung und Begründung.

### 6.3 Wetter-Integration

#### Konzept

Wetter ist in der Landwirtschaft keine Randnotiz – es ist Betriebsdaten. Jede PSM-Anwendung ist wetterabhängig. Erntetermine hängen am Wetter. Schadenereignisse müssen dokumentiert werden.

Automatische Wetterdaten werden stündlich vom DWD (Deutscher Wetterdienst, Open Data) oder einem kommerziellen Dienst (Meteomatics, weatherstack) für jeden Schlag-Standort abgerufen und mit dem laufenden Arbeitsauftrag verknüpft.

Das bedeutet: Jede PSM-Anwendung hat automatisch Windgeschwindigkeit, Temperatur und Niederschlag zum Zeitpunkt der Ausbringung im Datensatz – ohne dass der Fahrer irgendetwas eingibt.

#### Wetterdaten pro Arbeitsauftrag

```
Automatisch gespeichert bei Auftragsstart und -stop:
├── Temperatur (°C)
├── Windgeschwindigkeit und -richtung (m/s, Beaufort)
├── Niederschlag letzte 24h (mm)
├── Blattnässe (wenn Sensor verfügbar)
├── Relative Luftfeuchtigkeit
└── Wetterlage allgemein (Klartext vom DWD)
```

#### Schadensereignisse

Manuelle Schadensmeldung (Hagel, Frost, Überschwemmung, Sturm) mit Foto und GPS, direkt verknüpft mit dem Schlag. Das System ergänzt automatisch die offiziellen Wetterdaten für den Zeitraum – ein unbestreitbarer Zeitstempel für Versicherungen.

### 6.4 Vermarktung & Erlöse

Ohne Erlöse keine vollständige Deckungsbeitragsrechnung. Dieses Modul schließt den Kreis vom reinen Kostencontrolling zum echten Ergebniscontrolling.

```
Ernte-Erfassung
├── Schlag, Kultur, Erntedatum
├── Erntemenge (dt oder t, gesamt und pro ha)
├── Qualitätsparameter (Feuchte, Protein, Fallzahl, ...)
└── Lagerort (eigenes Lager oder direkte Abfuhr)

Verkaufskontrakt
├── Käufer, Preis, Menge, Lieferzeitraum
├── Preisformel (fix | Basis + Aufschlag | Börsenpreis)
└── Status: offen / teilgeliefert / erfüllt

Lieferschein
├── Menge, Datum, Fahrzeug
├── Wiegeschein (Upload oder manuelle Eingabe)
└── Automatische Verrechnung gegen Kontrakt

Erlös-Buchung
└── Automatisch aus Lieferschein → fließt in Deckungsbeitragsrechnung ein
```

### 6.5 Förder- & Antragsverwaltung

#### Sammelantrag-Assistent

```
Jährlicher Workflow (Frist: 15. Mai in Thüringen)
────────────────────────────────────────────────────
Schritt 1: Flächenabgleich
  → Alle Schläge aus AgroTrack vs. FLIK-Referenzflächen
  → Abweichungen markiert (Geometrie geändert? Neue Pacht?)
  → Korrekturvorschläge

Schritt 2: Nutzungsartenzuordnung
  → Kultur aus Anbauplanung → automatisch in NC-Codes
  → Landwirt bestätigt oder korrigiert

Schritt 3: Maßnahmenauswahl
  → Öko-Regelungen: Empfehlung basierend auf Betriebsdaten
  → AUKM: laufende Verpflichtungen automatisch eingetragen
  → Neue AUKM: Potenzialanalyse

Schritt 4: Plausibilitätsprüfung
  → Pflichtfelder vollständig?
  → Flächenüberschneidungen?
  → GLÖZ-Anforderungen erfüllt?

Schritt 5: Export
  → XML für ELAN / DIANA (Thüringen)
  → PDF-Archiv
  → Direktschnittstelle zum Landesportal (Phase 3)
```

#### Öko-Regelungen Potenzialanalyse

Das System analysiert die Betriebsdaten und zeigt welche Öko-Regelungen der Betrieb bereits erfüllt oder mit geringem Aufwand erfüllen könnte:

```
Öko-Regelungen Analyse – Betrieb Mustermann WJ 2025
────────────────────────────────────────────────────────────────
ÖR 1: Ackerland für Biodiversität
  Status: ✓ 5,2 ha Brache bereits vorhanden
  Prämie erreichbar: 5,2 ha × 195 €/ha = 1.014 €
  Handlungsbedarf: SOFORT ANMELDEN – keine Änderung nötig

ÖR 3: Kohlenstoffreiche Böden
  Status: ✓ 3,1 ha Moorflächen vorhanden
  Prämie erreichbar: 3,1 ha × 325 €/ha = 1.008 €
  Handlungsbedarf: SOFORT ANMELDEN

ÖR 5: Reduzierter PSM-Einsatz
  Status: ⚠ PSM-Aufwand liegt 8% über Schwellenwert
  Prämie: 0 € (Bedingung nicht erfüllt)
  Empfehlung: Überfahrten reduzieren – Potenzial prüfen

GESAMTPOTENZIAL NICHT ABGERUFENER PRÄMIEN: 4.230 €/Jahr
────────────────────────────────────────────────────────────────
```

Viele Betriebe lassen Geld liegen weil sie nicht wissen was sie bereits erfüllen. Diese Analyse liefert die Antwort in Sekunden.

---

## 7. Kartenmodul & Geodaten

### 7.1 Geodaten-Fundament

#### Verfügbare Open-Geodaten Thüringen

Das Thüringer Geoportal (geoportal-th.de) und die GDI-Thüringen bieten umfangreiche kostenlose Geodaten:

```
ALKIS (Amtliches Liegenschaftskataster)
├── Flurstücksgrenzen (exakte Geometrien)
├── Flurstücksnummern und Flächen
└── Nutzungsarten (Acker, Grünland, Wald, Gebäude...)

DGM (Digitales Geländemodell)
├── Höhenlinien
├── Hangneigung (relevant für Erosion, DüV-Sperrflächen)
└── Exposition (Himmelsrichtung → Abtrocknungsgeschwindigkeit)

Orthophotos
└── Aktuelle Luftbilder (1–2 Jahre alt)

ATKIS (Topographisches Landschaftsmodell)
└── Wege, Gewässer, Bebauung, Infrastruktur

TK-Raster
└── Topografische Karten als Hintergrund
```

#### Onboarding neuer Betrieb

```
Workflow: Flurstücke automatisch einladen
──────────────────────────────────────────────────────────
1. Betrieb wählt Bundesland → Thüringen
2. System verbindet sich mit WFS-Dienst des Geoportals
3. Landwirt umkreist seinen Betriebsbereich auf der Karte
   (oder gibt Gemarkung / Gemeinde ein)
4. System lädt alle Flurstücke des Bereichs automatisch
5. Landwirt markiert "das sind meine Flurstücke"
   (eigene / gepachtete / Nachbarn zur Orientierung)
6. System schlägt Schlag-Gruppierungen vor
   (Flurstücke die geografisch zusammenhängen)
7. Landwirt bestätigt oder korrigiert Gruppen
8. Fertig: Alle Schläge eingezeichnet, bemaßt,
   mit amtlicher Fläche und Katasterdaten hinterlegt
──────────────────────────────────────────────────────────
Zeitaufwand für einen mittelgroßen Betrieb: < 30 Minuten
```

#### Bundesland-Erweiterbarkeit

Das System ist von Anfang an mehrländerfähig. Die Geodaten-Schicht ist als Adapter-Architektur gebaut:

```
GeoDataAdapter (Interface)
├── ThueringenAdapter   → geoportal-th.de WFS
├── BayernAdapter       → geoservices.bayern.de (BayernAtlas)
├── SachsenAdapter      → geodaten.sachsen.de
├── BrandenburgAdapter  → geobasis-bb.de
└── BundesAdapter       → BKG (für bundesweite Dienste)
                          → INSPIRE-konforme Dienste EU-weit
```

### 7.2 Layer-System

Die Karte funktioniert als transparentes Layer-System. Jeder Layer kann einzeln ein- und ausgeblendet werden. Mehrere Layer überlagern sich additiv.

```
BASISKARTEN (immer einer aktiv)
├── Orthofoto / Luftbild     ← Standardansicht im Feld
├── Topografische Karte      ← Wege, Orientierung, Geländestruktur
├── OpenStreetMap            ← Offline-fähig, immer verfügbar
└── Weiß / Leer              ← Für Präsentationen und Ausdrucke

EIGENE GEODATEN (kombinierbar)
├── Flurstücksgrenzen (amtlich, gestrichelt)
├── Schlaggrenzen (eigene Definition, fett)
├── Schlagbezeichnungen + Fläche (ha)
├── Jagdreviergrenzen
├── Gewässer-Pufferzonen (5m / 10m, rot schraffiert)
├── Hangneigung > 10% (orange schraffiert)
├── Natura 2000 / FFH-Gebiete (grün gestrichelt)
└── Wasserschutzgebiete (blau schraffiert)

STATUS-LAYER (je nach gewählter Ansicht)
├── Kulturkarte (Farbe nach Anbaufrucht)
├── Arbeitsstatus / Workflow-Karte
├── Live-Arbeitskarte (GPS der Mitarbeiter)
├── Wirtschaftlichkeits-Karte (Deckungsbeitrag)
├── Wildschaden-Karte
├── Bonitur- / Wachstumskarte
├── Planungskarte (nächste 7 Tage)
├── Düngung & Auflagenkarte
└── NDVI-Satellitenbild (Vegetationsindex)
```

### 7.3 Die einzelnen Kartenansichten

#### Live-Arbeitskarte

Die Frage: *Was passiert gerade auf dem Betrieb?*

Jedes Fahrzeug mit aktivem GPS-Signal erscheint als Icon auf der Karte. Das Icon bewegt sich in Echtzeit. Beim Klick erscheint eine Info-Box: Fahrername, Fahrzeug, laufende Maßnahme, Zeit seit Start, aktueller Schlag.

Schläge mit aktivem Auftrag leuchten grün. Geplante Aufträge für heute sind blau markiert. Fahrzeuge ohne GPS-Bewegung seit mehr als 20 Minuten werden orange markiert – möglicherweise eine Panne oder Pause, der Vorarbeiter wird automatisch benachrichtigt.

GPS-Fahrspuren werden als feine Linien gezeichnet und nach Auftragsabschluss gespeichert. So lässt sich im Nachhinein nachvollziehen ob ein Schlag vollständig befahren wurde.

#### Kulturkarte

Die Frage: *Was wächst wo?*

Jeder Schlag erhält eine eindeutige Farbe nach angebauter Kultur. Die Farbgebung orientiert sich an der bekannten InVeKoS-Farbpalette:

```
Winterweizen     → Goldgelb
Wintergerste     → Hellgelb  
Wintertriticale  → Gelbbeige
Winterroggen     → Sandgelb
Winterraps       → Leuchtgelb
Sommergetreide   → Hellgrün
Mais             → Sattgrün
Zuckerrüben      → Mintgrün
Kartoffeln       → Violett
Sonnenblumen     → Orange
Grünland         → Dunkelgrün
Zwischenfrucht   → Blaugrün
Stilllegung      → Graugrün
Brachland        → Hellgrau
```

Klick auf einen Schlag öffnet eine Info-Card: Schlagname, Sorte, Saatdatum, aktuelles BBCH-Stadium, letzter Auftrag, nächste geplante Maßnahme.

#### Workflow-Status-Karte

Die Frage: *In welchem Bearbeitungszustand ist jeder Schlag?*

```
VORBEREITUNG
  Grau         → Planung offen, keine Maßnahme
  Blau-grau    → Bodenbearbeitung abgeschlossen

ANBAU
  Hellgrün     → Angesät / Gepflanzt
  Grün         → Aufgelaufen (per Bonitur bestätigt)

BEWIRTSCHAFTUNG
  Mittelgrün   → In regulärer Bewirtschaftung
  Orange       → Handlungsbedarf (offener Bonitur-Alert)
  Rot          → Kritisch (Schaderreger, Schaden gemeldet)

ERNTE
  Goldgelb     → Erntereif (BBCH 92+ oder manuell gesetzt)
  Dunkles Gold → Ernte läuft (aktiver Ernteauftrag)
  Braun        → Geerntet, Stoppel offen
  Dunkelbraun  → Stoppel bearbeitet / Nachfolge vorbereitet
```

Diese Ansicht ist die wichtigste operative Übersicht in der Erntekampagne.

#### Wirtschaftlichkeits-Karte

Die Frage: *Welche Flächen sind profitabel?*

Am Jahresende oder unterjährig mit Hochrechnung wird der Deckungsbeitrag II (€/ha) als Farbverlauf auf der Karte dargestellt:

```
< 0 €/ha       → Dunkelrot    (Verlustfläche)
0 – 100 €/ha   → Orange       (schwach)
100 – 200 €/ha → Gelb         (durchschnittlich)
200 – 300 €/ha → Hellgrün     (gut)
> 300 €/ha     → Dunkelgrün   (sehr gut)
```

Tooltips zeigen die exakten Zahlen. Vergleichsmodus erlaubt zwei Wirtschaftsjahre als Split-Screen nebeneinander.

#### Wildschaden-Karte

```
Layer-Elemente
├── Schadenpunkte als wildart-spezifische Icons
│   Wildschwein | Reh | Rehwild | Kranich | Gans | Hase
├── Schadenflächen als rote Polygone (GPS-eingezeichnet)
├── Reviergrenzen als farbige Linien (pro Revier eigene Farbe)
├── Heatmap-Modus: Schadendichte über mehrere Jahre
│   → zeigt systematische Problemzonen sichtbar
└── Filter: nach Jahr | Wildart | Revier | Schadensgrad
```

#### Planungskarte

Der Vorarbeiter plant direkt in der Karte. Schlag antippen → Neuen Auftrag anlegen → Mitarbeiter und Maschine zuweisen. Die Karte zeigt alle Aufträge der nächsten sieben Tage farblich nach Tag gestaffelt. Kollisionserkennung: Zwei Aufträge mit derselben Maschine am gleichen Tag → sofortige Warnung.

#### Düngung & Umweltauflagen-Karte

```
Pflichtlayer für gesetzeskonforme Bewirtschaftung
├── Gewässer (aus ATKIS) + 5m / 10m Pufferzone (rot)
│   → automatisch als Sperrfläche für PSM und Düngung
├── Hangneigung > 10% (orange schraffiert)
│   → Erosionsrisiko, DüV-Einschränkungen
├── Wasserschutzgebiete Zone I, II, III
│   → eingeschränkte Düngung und PSM
├── Natura 2000 / FFH-Gebiete
│   → Auflagen bei Klick sichtbar
├── AUKM-Verpflichtungsflächen (türkis)
│   → Auflagentext bei Klick
└── Rote Gebiete (Nitrat-Risikogebiete)
    → Verschärfte Düngeauflagen aktiv
```

Bei Auftragsanlage auf einem Schlag mit aktiver Auflagenzone erscheint automatisch ein Hinweis mit der konkreten Auflage – bevor der Fahrer losfährt.

### 7.4 Technische Kartenumsetzung

```
Frontend
├── MapLibre GL JS (Open Source, keine Lizenzkosten)
│   → WebGL-basiert, flüssig auch mit vielen Polygonen
│   → Vektorkacheln für scharfe Darstellung auf Retina
├── Offline-Kacheln für Mobile (MBTiles, vorgeladen)
└── GeoJSON für alle eigenen Schlag- und Betriebsdaten

Geo-Backend
├── PostGIS (PostgreSQL-Extension)
│   → Schlag-/Flurstückgeometrien
│   → Räumliche Abfragen ("alle Schläge im Revier X")
│   → Pufferzonenberechnung automatisch
├── pg_tileserv
│   → Liefert Vektorkacheln direkt aus PostGIS
└── GDAL für Import und Konvertierung von Geodaten

Externe Dienste
├── Thüringer WFS → Flurstücke (beim Onboarding gecacht)
├── DWD GeoServer → Wetterwarngebiete
└── Sentinel-Hub API → NDVI-Satellitenbilder
    (Optional, kostenpflichtig, günstiger Einstiegstarif)
```

### 7.5 Karten-Export & Druck

```
Exportformate
├── PDF (A4 / A3, mit Legende, Betriebslogo, Datum, Maßstab)
│   → Schlagkarte für Behörden
│   → Wildschadensdokumentation für Jäger / Versicherung
│   → Boniturbericht mit Lageplan
├── Shapefile / GeoJSON
│   → Für QGIS, Agrarbüros, externe Berater
└── Screenshot mit Zeitstempel
    → Direkt aus der App, für schnelle Dokumentation
```

---

## 8. Wirtschaftlichkeitsanalyse

### 8.1 Schlag als Profit-Center

Jeder Schlag bekommt am Ende des Wirtschaftsjahres eine vollständige Ergebnisrechnung. Das Prinzip: Alle Kosten die einem Schlag direkt zugeordnet werden können (Arbeitsaufträge, Materialverbrauch, Pacht) werden auf die Fläche in ha umgerechnet. Erlöse aus Ernteverkauf werden gegengestellt.

```
Beispielrechnung: Schlag "Mühlfeld Ost" – WJ 2024/25
Kultur: Winterweizen, Sorte Benchmark, 12,4 ha
──────────────────────────────────────────────────────
ERLÖSE
  Ernte: 72 dt/ha × 8,20 €/dt                590,40 €/ha
  Qualitätsprämie (Protein > 13%)              12,00 €/ha
  Agrarumweltprämie AUKM                       80,00 €/ha
                              Summe Erlöse = 682,40 €/ha

DIREKTKOSTEN
  Saatgut (aus Lagerbuchung, Charge)           68,00 €/ha
  Dünger N/P/K (aus Düngeprotokoll)           145,00 €/ha
  Pflanzenschutz (aus PSM-Protokoll)           92,00 €/ha
                              Summe Direkt  = 305,00 €/ha

ARBEITS- & MASCHINENKOSTEN (aus Arbeitsaufträgen)
  Bodenbearbeitung                             78,00 €/ha
  Aussaat                                      22,00 €/ha
  Düngung 3 Gaben                              18,00 €/ha
  PSM 4 Überfahrten                            24,00 €/ha
  Ernte                                        55,00 €/ha
  Transport                                    12,00 €/ha
                              Summe A+M     = 209,00 €/ha

STRUKTURKOSTEN
  Pacht                                       110,00 €/ha
  BG, Versicherung (anteilig)                  14,00 €/ha
                              Summe Struktur = 124,00 €/ha

──────────────────────────────────────────────────────
DECKUNGSBEITRAG I (ohne Strukturkosten)  = 377,40 €/ha
DECKUNGSBEITRAG II (mit Strukturkosten) = 263,40 €/ha
GESAMTERGEBNIS SCHLAG (12,4 ha)         = 3.266,16 €
──────────────────────────────────────────────────────
```

### 8.2 Vergleichsanalysen

**Jahresvergleich:** Derselbe Schlag über mehrere Wirtschaftsjahre. Hat die neue Bodenbearbeitungsstrategie die Dieselkosten wirklich gesenkt? Ist der Ertrag nach Zwischenfrucht gestiegen?

**Schlagvergleich:** Gleiche Kultur auf verschiedenen Schlägen im selben Jahr. Warum trägt der Sandacker trotz gleicher Bewirtschaftung 12 dt/ha weniger? Liegt es am Boden, an der Pacht, an der Entfernung zum Hof?

**Sortenvergleich:** Wenn auf einem Schlag zwei Sorten auf Teilflächen angebaut wurden, können beide separat ausgewertet werden.

**Methodenvergleich:** Pflug vs. Direktsaat. Mineralisch vs. organisch. Das System macht den Unterschied in Euro und Cent sichtbar.

**Kulturvergleich:** Welche Fruchtfolge ist für welchen Bodentyp am profitabelsten?

### 8.3 Controlling-Dashboard

Das Dashboard zeigt auf einen Blick:

- Aktuelle Gesamtkosten laufendes Wirtschaftsjahr vs. Budget
- Deckungsbeitrag-Ranking aller Schläge (bester bis schlechtester)
- Kostenentwicklung im Jahresverlauf (Monatsgraph)
- Maschinenkosten pro Stunde je Fahrzeug (Vergleich mit Kalkulation)
- Lohnkosten pro ha je Maßnahme (Effizienzvergleich)
- Offene Arbeitsaufträge ohne Abschluss (Datenpflege-Alarm)

### 8.4 Pacht-Rentabilitätsanalyse

Das System stellt die Frage die sich kein Bauer gerne stellt: Lohnt sich die Pacht noch? Für jeden Pachtschlag wird berechnet ob der Deckungsbeitrag II die Pachtkosten rechtfertigt. Bei der Pachtverlängerung ist das ein konkretes Verhandlungsargument.

---

## 9. Wachstumsdokumentation

### 9.1 Bonituren & Beobachtungen

Wachstum ist die fehlende Dimension zwischen Einsatz und Ernte. Das Wachstumsmodul ist bewusst niedrigschwellig gehalten – eine Bonitur soll im Feld in 30 Sekunden erfasst werden können.

```
Wachstumseintrag
├── Datum + Uhrzeit (automatisch)
├── GPS-Position (automatisch)
├── BBCH-Stadium
│   → Dropdown mit Bildunterstützung (Fotos je Stadium)
│   → Kurzbeschreibung des Stadiums als Hilfetext
├── Beobachtungstyp
│   ├── Reguläre Routinebonitur
│   ├── Schaderreger-Fund (Art + Befallsgrad)
│   ├── Nährstoffmangel (Kategorie + Foto)
│   ├── Lager / Auswinterungsschäden
│   ├── Trocken- / Hitzestress
│   └── Sonstiges
├── Intensität / Befallsgrad (1–5 Skala oder %)
├── Foto (empfohlen, bei Schaderreger fast Pflicht)
├── Betroffene Teilfläche
│   → "Gesamter Schlag" oder GPS-Polygon einzeichnen
├── Kommentar (Freitext)
└── Maßnahme ausgelöst?
    → Ja → erstellt automatisch offenen Arbeitsauftrag
    → Nein → dokumentiert ohne Folge
```

### 9.2 BBCH-Kalender pro Schlag

Das System zeichnet automatisch eine vollständige Entwicklungszeitachse:

```
Zeitachse Schlag "Mühlfeld Ost" – WJ 2024/25
──────────────────────────────────────────────────────────────
Okt 15  BBCH 00  Aussaat                       [Arbeitsauftrag]
Nov 02  BBCH 10  Auflauf vollständig            [Bonitur]
Nov 28  BBCH 21  Bestockungsbeginn              [Bonitur]
Dez 15  BBCH 22  Blattlausbefall Stufe 2        [Bonitur + Foto]
Apr 03  BBCH 30  Schossbeginn                   [Bonitur]
Apr 18  BBCH 32  2-Knoten-Stadium               [Bonitur]
Apr 20           Fungizidbehandlung             [PSM-Auftrag]
Mai 20  BBCH 59  Ährenschieben vollständig      [Bonitur]
Jun 10  BBCH 73  Milchreife                     [Bonitur]
Jul 15  BBCH 92  Gelbreife                      [Bonitur]
Jul 28  BBCH 97  Teigreife – erntereif          [Bonitur + Alert]
Aug 02           Ernte                          [Arbeitsauftrag]
──────────────────────────────────────────────────────────────
```

Diese Zeitachse ist gleichzeitig:
- Grundlage für die PSM-Entscheidungsdokumentation (warum wurde wann behandelt)
- Nachweis für IPS (Integrierter Pflanzenschutz)
- Lernarchiv für die Folgejahre
- Vergleichsdokument zwischen Jahren und Sorten

### 9.3 Bodenanalysen

```
Boden-Stammdaten pro Schlag (historisch mit Datum)
├── Bodenart (aus Kataster oder eigener Kartierung)
├── Ackerzahl / Bodenpunktzahl
├── pH-Wert (Messdatum, Empfehlung Kalkung)
├── Nährstoffgehalte P, K, Mg (LUFA-Import oder manuell)
├── Humusgehalt (%)
└── Nächste empfohlene Analyse (System warnt wenn > 6 Jahre)
```

LUFA-Analyseergebnisse können direkt als Datei importiert werden (CSV, PDF-Extraktion). Das System ergänzt die Standortdaten automatisch und berechnet daraus den Düngebedarf gemäß DüV.

### 9.4 Zeitraffer-Funktion

Die Wachstumszeitachse eines Schlags lässt sich als animierte Sequenz abspielen – von der Saat bis zur Ernte, alle Bonituren, Wetterereignisse und Arbeitsaufträge in chronologischer Folge. Wertvoll für Rückschauen, Beratergespräche und die innerbetriebliche Optimierung.

---

## 10. Schadensdokumentation

### 10.1 Unwetterschäden

```
Schadenereignis (Unwetter)
├── Ereignistyp: Hagel | Starkregen / Erosion | Frost | Dürre | Sturm
├── Datum und Uhrzeit des Ereignisses
├── Betroffene Schläge (Mehrfachauswahl)
│   → Vorschlag aus Wetter-API wenn Unwetterwarnung vorlag
├── Schadenserfassung pro Schlag
│   ├── Betroffene Fläche (ha oder %)
│   ├── Schadensgrad (1–5 visuell + Beschreibung)
│   ├── Fotos (georeferenziert, Zeitstempel unveränderlich)
│   ├── BBCH-Stadium zum Schadenszeitpunkt
│   └── Geschätzter Ertragsausfall (dt/ha)
├── Automatische Wetterdaten zum Ereigniszeitpunkt
│   → DWD-Offizialwerte für die Standortkoordinaten
│   → Niederschlagsmenge, Windstärke, Temperatur
├── Meldung an Hagelversicherung (PDF-Export vorformatiert)
└── Status: Erfasst → Gemeldet → Begutachtet → Reguliert / Abgelehnt
```

Der automatische Wetterdaten-Abgleich ist hier entscheidend: Wenn Hagelschaden gemeldet wird, liefert das System die offiziellen DWD-Stundenwerte als unbestreitbaren Nachweis. Kein Versicherer kann den Zeitpunkt in Frage stellen.

### 10.2 Wildschadensdokumentation

#### Zuordnung: Flurstück → Jagdrevier → Jäger

Die Zuordnung erfolgt auf Flurstück-Ebene, nicht auf Schlag-Ebene – da ein Schlag aus Flurstücken verschiedener Jagdreviere bestehen kann.

```
Jagdrevier-Stammdaten
├── Reviername, Reviercode
├── Revierführer: Name, Telefon, E-Mail
├── Jagdgenossenschaft
├── Pächter, Pachtende
├── Zugeordnete Flurstücke (aus Betriebsdaten)
└── Zugehörige Schläge (abgeleitet, mit Flächenanteil)

Automatische Aufteilung bei Wildschaden auf Schlag:
  Schlag "Großes Feld" (18 ha gesamt)
  → Flurstück 247/2 (11 ha) → Revier Nordwald → Jäger Müller
  → Flurstück 312/1 (7 ha) → Revier Südheide → Jäger Schmidt
  → System teilt den Schaden automatisch auf
```

#### Wildschadensmeldung

```
Wildschaden-Eintrag
├── Datum der Entdeckung
├── Schlag + betroffene Flurstücke
│   → Revier-Zuordnung automatisch
├── Wildart
│   → Reh | Rehwild | Wildschwein | Hase | Kaninchen
│   → Kranich | Graugans | Nilgans | Rebhuhn | Sonstiges
├── Schadenstyp
│   ├── Verbiss / Äsung (Reh)
│   ├── Aufbruch / Wühlschaden (Wildschwein)
│   ├── Trittschäden / Lagerflecken (alle großen Wildarten)
│   └── Fraßschaden (Zugvögel, Kleinwild)
├── Betroffene Fläche (GPS-Polygon einzeichnen)
├── Schadensgrad (1–5)
├── Fotos (mindestens 1 Übersichtsfoto + 1 Detailfoto empfohlen)
├── Kultur + BBCH-Stadium
├── Geschätzter Ertragsausfall (dt/ha, Begründung)
└── Status: Erfasst → Gemeldet → Termin vereinbart → Begutachtet
             → Reguliert | Abgelehnt | Streitig
```

#### Automatischer Wildschadensbericht

Das System generiert auf Knopfdruck einen strukturierten Bericht für den zuständigen Jäger:

```
Wildschadensbericht – Revier Südheide – Jäger Schmidt
Betrieb: Mustermann GbR | Zeitraum: WJ 2024/25
──────────────────────────────────────────────────────────────
Flu.  Datum      Wildart     Fläche  Grad  Ausfall  Status
──────────────────────────────────────────────────────────────
247/2 12.03.25   Reh         0,3 ha   3    8 dt/ha  Gemeldet
247/2 28.04.25   Wildschwein 1,2 ha   4   18 dt/ha  Gemeldet
312/1 05.05.25   Kranich     0,8 ha   2    5 dt/ha  Erfasst
──────────────────────────────────────────────────────────────
Betroffene Fläche gesamt:  2,3 ha
Geschätzter Gesamtausfall: ca. 29 dt = ca. 238 €
Fotodokumentation:         14 Aufnahmen (georeferenziert)
Wetterdaten:               beigefügt (DWD)
Karte:                     beigefügt (Schadensflächen markiert)
──────────────────────────────────────────────────────────────
[Als PDF exportieren]  [Per E-Mail an Jäger senden]
[Sachverständigen einladen]  [Termin vereinbaren]
```

#### Jäger-Portalzugang

Der Revierführer erhält einen eingeschränkten, kostenlosen Lesezugang:

- Sieht nur seine Revierflächen auf der Karte
- Neue Schadensmeldungen erscheinen sofort mit Push-Benachrichtigung
- Kann Begutachtungstermin direkt im System bestätigen
- Kann eigene Beobachtungen einzeichnen: Wildwechsel, Einstände, Fütterungsplätze
- Diese Jäger-Daten werden mit dem Landwirt geteilt und helfen der gemeinsamen Planung

#### Strategische Auswertung für Jäger und Landwirt

**Hotspot-Analyse:** Welche Flurstücke werden systematisch aufgesucht? Wo sind Wildwechsel? Das ist für die Jagdplanung (Drückjagden, Ansitzplätze, Ablenkfütterung) wertvoller als jede Schätzung.

**Saisonale Muster:** Wann treten Kronenschäden auf? Wann kommen die Kraniche? Das ermöglicht vorausschauende Vergrämungsmaßnahmen.

**Jahresentwicklung:** Nimmt der Wildschaden zu oder ab? Korreliert das mit der Bejagungsintensität? Belastbare Argumente für die Jagdgenossenschaftsversammlung.

---

## 11. Dokumentationspflichten & EU-Konformität

### 11.1 PSM-Dokumentation (§ 67 PflSchG)

**Gesetzliche Lage:** Jede Pflanzenschutzmittelanwendung muss innerhalb von 3 Tagen dokumentiert und 3 Jahre aufbewahrt werden. Bei Kontrollen müssen alle Pflichtfelder lückenlos vorhanden sein.

**AgroTrack-Lösung:** Das PSM-Protokoll entsteht als automatisches Nebenprodukt jedes PSM-Arbeitsauftrags. Kein separates Formular, keine Übertragung.

```
PSM-Anwendungsprotokoll – Pflichtfelder (alle automatisch befüllt)
├── Datum der Anwendung              ← Zeitstempel Arbeitsauftrag
├── Schlag / Feldbezeichnung         ← aus Schlagkartei
├── Größe der behandelten Fläche (ha)← aus Schlaggeometrie
├── Kultur                           ← aus Anbauplanung
├── Entwicklungsstadium (BBCH)       ← aus letzter Bonitur
├── Schadorganismus / Anwendungsgrund← Pflichtfeld bei Auftragsanlage
├── Mittel (Handelsname)             ← aus Lagerartikel
├── Zulassungsnummer                 ← aus Lagerartikel-Stammdaten
├── Aufwandmenge (l oder kg/ha)      ← aus Entnahme ÷ Schlagfläche
├── Wartezeit bis Ernte              ← aus PSM-Stammdaten
├── Wasseranwendungsmenge            ← aus Auftragsdaten (l/ha)
├── Windgeschwindigkeit + Temperatur ← automatisch aus Wetter-API
└── Anwender (Name + Sachkundenr.)   ← aus Mitarbeiterstammdaten
```

Export: PDF auf Knopfdruck in amtlich anerkanntem Format. Vollständigkeitsprüfung: Das System zeigt an welche PSM-Einträge im laufenden Wirtschaftsjahr unvollständige Pflichtfelder haben.

#### Integrierter Pflanzenschutz (IPS)

EU-Richtlinie 2009/128/EG verpflichtet zu dokumentieren warum eine PSM-Maßnahme notwendig war. Vor jedem PSM-Auftrag erscheint eine kurze IPS-Checkliste:

```
IPS-Nachweis (4 Felder, < 1 Minute)
1. Schaderreger-Monitoring: Bonitur vorhanden? [Ja / Nein → Link]
2. Schadensschwelle überschritten? [Ja / Nein + Begründung]
3. Nicht-chemische Alternativen geprüft? [Freitext]
4. Begründung Mittelwahl (schonendste wirksame Option) [Freitext]
```

Ausgefüllt erzeugt das System eine rechtssichere IPS-Dokumentation.

#### Resistenzmanagement

Das System erkennt wenn derselbe Wirkstoff-HRAC-Code dreimal in Folge auf demselben Schlag angewendet wurde und gibt einen Hinweis auf Wirkstoffwechsel. Keine Blockierung – aber dokumentierte Warnung.

### 11.2 Düngerecht (DüV 2020)

#### Düngebedarfsermittlung (DBE)

Pflicht vor jeder Düngungsmaßnahme. Das System generiert die DBE automatisch wenn Anbauplanung, Bodenanalysen und Vorjahres-Erntedaten vorhanden sind.

Die berechnete DBE pro Schlag und Nährstoff (N, P, K) wird mit der tatsächlich geplanten Düngung verglichen. Bei Überschreitung erscheint eine Warnung – keine Blockierung, aber dokumentierte Kenntnisnahme erforderlich.

#### Nährstoffbilanz

```
Schlagbezogene N-Bilanz (laufend aktualisiert)
├── N-Zufuhr aus mineralischen Düngern (aus Arbeitsaufträgen)
├── N-Zufuhr aus organischen Düngern (aus Aufträgen)
├── N-Abfuhr durch Ernte (aus Erntedaten × Normabfuhr)
├── Saldo: Zufuhr minus Abfuhr
└── Obergrenze: 50 kg N/ha Überschuss (gesetzlich)
    → Ampel grün / gelb / rot

Betriebliche Gesamtbilanz
├── Stickstoff-Gesamtüberschuss
└── Phosphor-Bilanz (Ziel: ausgeglichen)
```

#### Sperrfristen-Management

Das System kennt alle gesetzlichen Sperrfristen für Thüringen und warnt automatisch:

- Herbst-Sperrfrist auf Ackerland: 1. November bis 31. Januar
- Herbst-Sperrfrist auf Grünland: 1. November bis 31. Januar
- Verlängerte Sperrfristen in Roten Gebieten
- Aussnahmen für organische Dünger auf bestellte Flächen

Bei Auftragsplanung innerhalb einer Sperrfrist erscheint eine aktive Warnung mit der genauen Regelung.

#### Rote-Gebiete-Management

Nitrat-Risikogebiete sind als Layer auf der Karte sichtbar. Für betroffene Schläge gelten verschärfte Regeln die das System automatisch aktiviert:

- 20% Reduktionspflicht bei N-Düngung
- Aufzeichnungspflicht für jeden Düngevorgang
- Verschärfte Herbst-Düngungsverbote
- Warnung bei jedem Düngeauftrag auf betroffener Fläche

### 11.3 Betriebsheft & Cross Compliance

Das Betriebsheft wird automatisch aus allen Betriebsdaten generiert und ist jederzeit als PDF abrufbar. Es enthält:

- Flächennutzungsnachweis (wer hat welchen Schlag wann wie bearbeitet)
- Saatgut-Herkunft und Zertifizierung (aus Lagerchargen)
- Bodenbearbeitungsmaßnahmen (aus Arbeitsaufträgen)
- Nachweis der Einhaltung von Umweltauflagen
- Dünge- und PSM-Dokumentation (zusammengefasst)

### 11.4 Arbeitszeit & Lohnunterlagen

```
Arbeitszeitnachweis pro Mitarbeiter (automatisch)
├── Tägliche Arbeitszeiten (Start, Pausen, Ende)
├── Zuordnung zu Kostenstelle / Auftrag / Schlag
├── Überstunden (automatisch berechnet)
├── Monatssaldo
└── Export für Lohnbuchhaltung (DATEV-Lohnjournal-Format)

Gesetzliche Kontrollen:
├── Mindestpausenzeiten werden überwacht
├── Höchstarbeitszeit (10h/Tag) wird gemeldet
└── Unterschreitungen werden dokumentiert (Schutz bei Kontrollen)
```

### 11.5 Sachkundenachweise & Maschinenberechtigung

Jede Maschine hat hinterlegte Anforderungen. Jeder Mitarbeiter hat hinterlegte Qualifikationen mit Ablaufdaten. Das System verhindert keine Zuweisung – aber warnt mit drei Stufen:

1. **Qualifikation läuft in 60 Tagen ab** → Info-Hinweis, gelb
2. **Qualifikation läuft in 14 Tagen ab** → Warnung, orange
3. **Qualifikation abgelaufen** → Kritischer Alert, rot, bei Auftragsanlage

Bei PSM-Sachkundenachweis erscheint die Warnung sechs Monate vor Ablauf, da die Verlängerungsfortbildung rechtzeitig gebucht werden muss.

### 11.6 Öko-Landbau-Dokumentation

Für Bio-Betriebe oder Betriebe in Umstellung:

```
Bio-Modus (aktivierbar pro Betrieb oder Teilbetrieb)
├── Umstellungszeitraum-Tracking (24/36 Monate)
├── Zugelassene Betriebsmittel (EU-Öko-Liste als Filter)
│   → Nicht zugelassene Mittel im Lager markiert
│   → Bei PSM-Auftragsanlage: nur Bio-konforme Mittel wählbar
├── Parallelproduktion (konventionell + Bio getrennt verwaltet)
│   → Strikte Trennung in Lager, Dokumentation, Abrechnung
├── Fruchtfolgeregeln (Bio-konform geprüft)
└── Zertifizierungsdokumentation
    → Jahresbericht für Kontrollstelle (z.B. DE-ÖKO-001)
    → Automatisch aus Betriebsdaten generiert
```

### 11.7 Kontrollbereitschafts-Check

```
"Bin ich kontrollbereit?" – Live-Dashboard
──────────────────────────────────────────────────────────────
Prüfbereich                                          Status
──────────────────────────────────────────────────────────────
PSM-Aufzeichnungen vollständig (3 Jahre)               ✓
PSM-Aufzeichnungen aktuell (< 3 Tage)                  ✓
Düngedokumentation vollständig                         ✓
Düngebedarfsermittlung vorhanden                       ✓
Nährstoffbilanz innerhalb Grenzwerte                   ✓
Sachkundenachweise gültig (alle Mitarbeiter)           ⚠ 1 läuft in 45 Tagen ab
GLÖZ 1–9 eingehalten (alle Standards)                 ✓
Mindestbodenbedeckung dokumentiert                     ✓
Gewässerpufferstreifen eingehalten                     ✓
Betriebsheft aktuell                                   ✓
Flächenangaben plausibel                               ✓
AUKM-Auflagen nachgewiesen                             ✓
Wasserrahmenrichtlinie beachtet                        ✓
──────────────────────────────────────────────────────────────
ERGEBNIS: 12/13 ✓  |  1 Warnung  |  0 Kritisch
──────────────────────────────────────────────────────────────
[Kontrollmappe als PDF exportieren]
[Details anzeigen]  [Warnung beheben]
```

Die Kontrollmappe bündelt alle relevanten Dokumente in einem PDF – sortiert nach Prüfbereichen. Der Kontrolleur bekommt was er braucht, nicht mehr und nicht weniger.

---

## 12. GAP & Förderwesen

### 12.1 GLÖZ-Standards (9 Standards automatisch überwacht)

**GLÖZ 1 – Dauergrünlanderhalt:** System meldet wenn Dauergrünland umgebrochen werden soll. Referenzfläche hinterlegt, Vergleich automatisch. Genehmigungspflicht als Warnung angezeigt.

**GLÖZ 2 – Schutz von Feuchtgebieten und Mooren:** Moorkataster-Layer auf Karte. Arbeitsaufträge auf betroffenen Flächen lösen Warnung aus.

**GLÖZ 3 – Verbot Stoppelabbrennen:** Bei Planung "Stoppelabbrennen" wird die Maßnahme blockiert. Ausnahmegenehmigung kann dokumentiert werden.

**GLÖZ 4 – Pufferstreifen an Gewässern:** Automatisch aus Geodaten berechnet (5m Mindestabstand). Auf Karte sichtbar. Bei PSM-/Düngeauftrag automatisch geprüft.

**GLÖZ 5 – Erosionsrisiko-Bodenbearbeitung:** Hangneigung aus DGM bekannt. Bei Hanglagen > 10% erscheint Hinweis auf erosionsmindernde Bearbeitung. Maßnahme wird dokumentiert.

**GLÖZ 6 – Mindestbodenbedeckung:** System warnt wenn Schlag im Winter keinen Bewuchs, keine Zwischenfrucht und keine Mulchauflage aufweist. Zwischenfrucht-Einsaat aus Arbeitsauftrag wird automatisch als Erfüllung erkannt.

**GLÖZ 7 – Fruchtwechsel:** Anbauhistorie pro Schlag bekannt. Warnung bei mehr als 3 Jahren gleicher Hauptkultur. Ausnahmen (Grünland, Dauerkulturen) automatisch erkannt.

**GLÖZ 8 – Nicht produktive Flächen (4% Mindestanteil):** Berechnung automatisch aus allen Flächendaten. Ampel: erfüllt / nicht erfüllt / knapp. Vorschlag welche Schläge optimal als Brache angemeldet werden (Prämien-Optimierung).

**GLÖZ 9 – Dauergrünland in Natura 2000:** Absolutes Umwandlungsverbot. Layer auf Karte. Auftrag auf solchen Flächen wird blockiert.

### 12.2 Fristenkalender

```
Automatischer Betriebskalender – Thüringen
──────────────────────────────────────────────────────────
15. Januar    Düngebedarfsermittlung für Herbstkultur
              → Erinnerung wenn Anbauplanung vorliegt

31. März      Düngebedarfsermittlung Sommerfrüchte
              → automatisch wenn Bodenanalysen + Planung eingepflegt

15. Mai       Sammelantrag Abgabe (Frist!)
              → Erinnerungen: 30, 14, 7, 1 Tag vorher
              → Assistent zeigt Vollständigkeit

Laufend       GLÖZ-Kontrollen (unangemeldet möglich)
              → Kontrollbereitschafts-Check jederzeit abrufbar

1. Nov.       Herbst-Düngung Sperrfrist beginnt
              → Push-Warnung an Vorarbeiter: "7 Tage bis Sperrfrist"

Jährlich      AUKM-Maßnahmen-Nachweis
              → Dokumentation aus Arbeitsaufträgen zusammengestellt

Jährlich      Sachkundenachweise prüfen
              → Automatisch 6 Monate vor Ablauf
──────────────────────────────────────────────────────────
```

### 12.3 Nachhaltigkeitsberichterstattung

Für größere Betriebe und Lieferanten des Lebensmittelhandels zunehmend relevant:

```
Nachhaltigkeitsdaten die AgroTrack bereits kennt
├── CO₂-Fußabdruck
│   → Aus Dieselverbrauch (Arbeitsaufträge × Verbrauch)
│   → Aus Düngereinsatz (N-Düngung × Emissionsfaktor IPCC)
│   → Export für QS-Audits, Lieferanten-Nachweise
├── Wasserverbrauch (Beregnung aus Arbeitsaufträgen)
├── PSM-Intensität (kg Wirkstoff/ha, Vergleich Vorjahr)
├── Humusbilanz (aus Fruchtfolge + organischer Düngung)
└── Biodiversitätsflächen (GLÖZ 8, AUKM, Blühstreifen)

Exportformate: PDF, Excel, CSV
Verwendbar für: QS, GlobalG.A.P., VLOG (GVO-frei), REWE-Audit
```

---

## 13. Interface & UX-Konzept

### 13.1 Designprinzipien

**Feldtauglichkeit zuerst.** Jede Funktion muss mit dreckigen Handschuhen bedienbar sein. Große Buttons, großer Text, hoher Kontrast. Keine Miniaturflächen, keine Hover-Zustände.

**Drei Taps bis zum Ziel.** Kein Nutzer sollte mehr als drei Interaktionen benötigen um die wichtigste Aktion seiner Rolle auszuführen. Für den Mitarbeiter ist das: Auftrag starten.

**Kontextabhängige Vereinfachung.** Die App zeigt nur was gerade relevant ist. Ein Mitarbeiter der einen Auftrag startet sieht keine Kostenkalkulation. Ein Buchhalter der Auswertungen erstellt sieht keine Zeiterfassung.

**Fehler korrigieren ist einfacher als Fehler vermeiden.** Pflichtfelder die im Feld nicht bekannt sind gibt es nicht. Falsche Einträge können nachträglich korrigiert werden. Das System protokolliert Änderungen, verliert aber keine Daten.

**Bestätigung nur wo nötig.** Destruktive Aktionen (Löschen, Abschluss eines Wirtschaftsjahres) verlangen Bestätigung. Alle anderen Aktionen werden sofort ausgeführt.

### 13.2 Web-App (Desktop / Büro)

#### Navigation

Die Web-App hat eine zweispältige Navigation: Eine schmale, immer sichtbare Sidebar links mit den Hauptbereichen und ein großer Hauptbereich rechts für den Inhalt.

```
Sidebar (links, immer sichtbar)
├── 🏠 Dashboard
├── 🗺️ Karte
├── 📋 Schläge & Aufträge
├── 👷 Personal
├── 🚜 Fuhrpark
├── 📦 Lager
├── 📊 Controlling
├── 📄 Dokumentation
├── 🌱 Förderwesen
└── ⚙️ Einstellungen
```

#### Dashboard (Startseite)

Das Dashboard ist in vier Quadranten aufgeteilt:

**Oben links – Betriebsübersicht heute:** Wie viele Aufträge laufen gerade, wie viele Mitarbeiter sind im Einsatz, welche Schläge werden bearbeitet. Klick öffnet die Live-Karte.

**Oben rechts – Kosten laufendes WJ:** Balkendiagramm Kosten nach Monat, aktueller Stand vs. Vorjahr. Eine Zahl groß: Gesamtkosten YTD.

**Unten links – Handlungsbedarf:** Alle offenen Alerts sortiert nach Dringlichkeit. Abgelaufene Fristen rot, nahende Fristen orange, Informationshinweise blau. Direkt klickbar zu dem jeweiligen Datensatz.

**Unten rechts – Letzte Aktivitäten:** Chronologische Liste der letzten abgeschlossenen Aufträge mit Kosten und Schlagzuordnung.

#### Schlag-Detailansicht

Die Detailansicht eines Schlags ist in Tabs organisiert:

- **Übersicht:** Kenndaten, aktuelle Kultur, Fläche, Pacht, Ackerzahl
- **Aufträge:** Alle Arbeitsaufträge chronologisch, filterbar nach Maßnahme und Zeitraum
- **Wachstum:** BBCH-Kalender, Bonituren, Fotos
- **Kosten:** Kostenaufstellung laufendes WJ, Vergleich Vorjahr, Deckungsbeitrag
- **Schäden:** Wildschäden, Unwetterschäden mit Fotos und Status
- **Dokumente:** PSM-Protokoll, Düngedoku, Bodenanalysen, alle hochgeladenen Dateien
- **Karte:** Mini-Karte mit Schlaggeometrie, Boniturflächen, Schadenspunkte

#### Controlling-Bereich

```
Controlling-Seitenstruktur
├── Jahresübersicht
│   → Alle Schläge mit Kosten, Erlösen, DB I und DB II
│   → Sortierbar nach jeder Spalte
│   → Export Excel, PDF
│
├── Kostenanalyse
│   → Aufschlüsselung nach Maßnahme, Maschine, Mitarbeiter
│   → Zeitraumfilter, Schlagfilter
│   → Monatsverlauf als Liniendiagramm
│
├── Schlagvergleich
│   → Bis zu 6 Schläge nebeneinander
│   → Gleiche Kultur filter
│   → Kennzahlen: Ertrag, Kosten, DB je ha
│
└── Wirtschaftsjahr-Abschluss
    → Checkliste: Alle Aufträge freigegeben?
    → Erlöse vollständig erfasst?
    → Export Jahresbericht
```

### 13.3 Tablet-App (Vorarbeiter)

Die Tablet-App ist für den Vorarbeiter optimiert. Sie zeigt auf dem Startbildschirm drei Bereiche nebeneinander:

**Links:** Mitarbeiter-Liste mit aktuellem Status (im Einsatz / verfügbar / geplant).

**Mitte:** Karte mit Live-Positionen der Fahrzeuge und Farbstatus der Schläge.

**Rechts:** Aufgaben-Liste für den heutigen Tag, Drag-and-Drop zur Zuweisung von Mitarbeitern an Aufträge.

#### Tagesplanungs-Ansicht

Der Vorarbeiter sieht einen Kalender für die nächsten sieben Tage. Jeder Tag ist eine Spalte. Jede Maßnahme ist ein Block der auf einen Mitarbeiter und eine Maschine gezogen werden kann. Konflikte (gleiche Ressource doppelt verplant) erscheinen als rote Überlappung.

#### Genehmigung abgeschlossener Aufträge

Abgeschlossene Aufträge erscheinen in einer Genehmigungsliste. Der Vorarbeiter sieht: Schlag, Maßnahme, Mitarbeiter, Zeit, Verbrauch, berechnete Kosten. Er kann bestätigen, korrigieren oder kommentieren. Erst nach Genehmigung fließen die Daten in die Kostenrechnung.

### 13.4 Navigationsstruktur Mobile App

```
Bottom Navigation (immer sichtbar)
├── 📋 Heute       → Meine Aufträge / Laufender Auftrag
├── 🗺️ Karte       → Schlagkarte mit Statusfarben
├── ➕ Neu          → Neuen Auftrag starten (prominenter Button)
├── 📷 Bonitur     → Schnelleingabe Wachstumsbeobachtung
└── 👤 Profil      → Einstellungen, Qualifikationen, Arbeitszeitkonto
```

---

## 14. Mobile Nutzung

### 14.1 Der Mitarbeiter-Flow: Auftrag starten

Der wichtigste Flow der ganzen App. Er muss in unter 30 Sekunden abgeschlossen sein, ohne Netz funktionieren und mit Handschuhen bedienbar sein.

**Schritt 1 – App öffnen:** Biometrische Entsperrung (Face ID / Fingerprint). Keine PIN-Eingabe. Sofortige Anzeige des Heute-Screens.

**Schritt 2 – Auftrag wählen oder neu starten:** Wenn ein Auftrag für heute geplant wurde erscheint er prominent als große Karte mit grünem "Starten"-Button. Alternativ: "Neuer Auftrag" Button, orange, gut sichtbar.

**Schritt 3 – Auftrag konfigurieren:** Schlag aus Liste oder Karte wählen. Maßnahme aus Dropdown (max. 8 häufigste angezeigt, Rest in "Weitere"). Fahrzeug aus persönlicher Favoritenliste. Fertig.

**Schritt 4 – Timer läuft:** Ein großer grüner Kreis mit laufender Zeit. Der Schlagname ist sichtbar. Drei Schnellaktionen: Pause, Material erfassen, Foto machen.

**Schritt 5 – Materialerfassung:** Artikel aus Offline-Lager auswählen, Menge eingeben, bestätigen. Das war's.

**Schritt 6 – Auftrag beenden:** Großer roter "Stop"-Button. Kurze Zusammenfassung: Zeit, Fläche, Material. Bestätigen. Sync läuft im Hintergrund.

### 14.2 Offline-Verhalten

```
Offline-Modus – was funktioniert ohne Netz:
├── Auftrag starten, pausieren, beenden           ✓
├── Material erfassen (aus gecachtem Lager)        ✓
├── Fotos machen und dem Auftrag zuordnen          ✓
├── Bonitur erfassen                               ✓
├── GPS-Track aufzeichnen                          ✓
├── Schlagkarte anzeigen (gecachte Kacheln)        ✓
├── Eigene Aufträge ansehen                        ✓
└── Andere Mitarbeiter-Positionen sehen            ✗ (nur online)

Sync bei Verbindungsaufbau:
├── Alle offlineerstellten Einträge werden hochgeladen
├── Neue Aufträge vom Vorarbeiter werden heruntergeladen
├── Lager-Bestände werden synchronisiert
└── Karte wird aktualisiert (wenn WLAN)
```

### 14.3 GPS & Kartenfunktionen Mobile

**Navigation zu einem Schlag:** Klick auf einen Schlag in der Karte öffnet direkt Apple Maps / Google Maps Navigation zum Schlag-Mittelpunkt.

**GPS-Track:** Während ein Auftrag läuft zeichnet die App im Hintergrund alle 30 Sekunden einen GPS-Punkt auf. Aus diesen Punkten entsteht die Fahrspur die im Büro auf der Karte sichtbar ist. Das ermöglicht im Nachhinein zu prüfen ob ein Schlag vollständig bearbeitet wurde.

**Polygon einzeichnen:** Für Boniturteilflächen und Wildschäden kann der Mitarbeiter direkt auf der Karte ein Polygon zeichnen. Er geht dabei um die betroffene Fläche herum und das System zeichnet das Polygon aus den GPS-Punkten.

### 14.4 Bonitur-Schnelleingabe

Die Bonitur ist als Schnelleingabe-Screen optimiert. Der Mitarbeiter sieht:

- Aktuelles Datum und Standort (automatisch)
- Großes BBCH-Dropdown mit Bildunterstützung (Foto des jeweiligen Stadiums)
- Vier Icon-Buttons für häufige Beobachtungstypen
- Foto-Button (öffnet Kamera direkt)
- Intensitäts-Slider (1–5, groß)
- Bestätigen

Der gesamte Vorgang dauert unter 45 Sekunden wenn kein Freitext nötig ist.

### 14.5 Wildschaden-Schnellerfassung

Bei Wildschaden-Entdeckung im Feld:

1. Bonitur-Button → "Wildschaden"
2. Wildart wählen (Icon-Auswahl, groß)
3. Foto machen (automatisch georeferenziert)
4. Fläche schätzen oder Polygon laufen
5. Schadensgrad Slider
6. Bestätigen → Jäger wird automatisch per Push benachrichtigt

### 14.6 Push-Benachrichtigungen Mobile

```
Benachrichtigungs-Kategorien (konfigurierbar)
├── SOFORT (nicht deaktivierbar)
│   → Kritischer Geräteausfall gemeldet
│   → Wildschaden auf eigenem Schlag
│
├── WICHTIG (Standard: aktiv)
│   → Neue Aufgabe vom Vorarbeiter zugewiesen
│   → Sperrfrist beginnt in 3 Tagen
│   → Sachkundenachweis läuft in 14 Tagen ab
│
└── INFORMATION (Standard: aktiv, deaktivierbar)
    → Tagesauftrag für morgen wurde erstellt
    → Wetterbericht für die Arbeitswoche
    → Frist Sammelantrag in 30 Tagen
```

---

## 15. Technische Architektur

### 15.1 Backend

```
Technologie-Stack (empfohlen)
├── API: Node.js + TypeScript mit NestJS Framework
│   → REST-API für Mobile Apps (einfach, gut dokumentiert)
│   → GraphQL für Web-App (flexible Abfragen)
│   → WebSocket für Live-Daten (GPS, Status-Updates)
│
├── Datenbank: PostgreSQL 16 + PostGIS 3
│   → Alle Betriebsdaten relational
│   → Alle Geodaten in PostGIS (Schläge, Tracks, Polygone)
│   → Zeitreihendaten (Wetter, Bonituren) in TimescaleDB Extension
│
├── Dokumentenspeicher: MinIO (S3-kompatibel, selbst gehostet)
│   → Fotos, PDFs, Zertifikate, Rechnungen
│   → Automatische Thumbnail-Generierung
│
├── Event Bus: Redis + Bull Queue
│   → Asynchrone Verarbeitung (Sync, Wetter-Abruf, PDF-Generierung)
│   → Fristenkalender (Cron Jobs)
│   → Push-Notifications
│
└── Authentifizierung: JWT + Refresh Token
    → Multi-Tenant (ein System, viele Betriebe)
    → Rollenbasierte Berechtigungen (RBAC)
    → 2FA optional
```

### 15.2 Mobile App

```
Mobile: React Native (iOS + Android aus einer Codebase)
├── Zustandsverwaltung: Zustand + React Query
├── Offline-Datenbank: WatermelonDB (SQLite-basiert)
│   → Lokale Datenhaltung
│   → Delta-Sync mit Backend
├── Karte: MapLibre GL React Native
│   → Offline-Kacheln (MBTiles)
│   → GPS-Track-Aufzeichnung im Hintergrund
├── Kamera: React Native Camera
│   → EXIF-Daten (GPS, Zeitstempel) werden gespeichert
└── Push: Firebase Cloud Messaging (iOS + Android einheitlich)
```

### 15.3 Web-App

```
Web-Frontend: React + TypeScript
├── UI-Framework: Tailwind CSS + shadcn/ui Komponenten
├── Karte: MapLibre GL JS
├── Diagramme: Recharts
├── Formulare: React Hook Form + Zod Validation
└── State: React Query (Server State) + Zustand (UI State)
```

### 15.4 Infrastruktur & Hosting

```
Deployment
├── Container: Docker + Docker Compose (Entwicklung)
├── Produktion: Kubernetes (AWS EKS oder Azure AKS)
├── CI/CD: GitHub Actions
├── CDN: CloudFront für statische Assets
└── Backups: Automatisch täglich, 30-Tage-Retention, verschlüsselt

Datenschutz & Sicherheit
├── Hosting: Deutschland / EU (DSGVO-konform)
├── Verschlüsselung: TLS 1.3 in Transit, AES-256 at Rest
├── Mandantentrennung: Row-Level Security in PostgreSQL
├── Audit-Log: Alle Datenänderungen protokolliert mit User + Timestamp
└── DSGVO: Datenlöschung auf Anfrage, Export aller Daten möglich
```

---

## 16. Schnittstellen & Integrationen

### 16.1 Geodaten-Schnittstellen

```
Thüringen
├── Geoportal-TH WFS: Flurstücksgrenzen (ALKIS)
├── Geoportal-TH WMS: Orthophotos, TK-Raster
├── DGM Thüringen: Höhenmodell für Hangneigung
└── DIANA-Portal: Förderantragsübermittlung

Bundesweit
├── BKG-Dienste: Bundesweite Basisdaten
├── DWD Open Data: Wetterdaten (kostenlos, stündlich)
└── BVL-Datenbank: PSM-Zulassungen (aktuell, wöchentlich aktualisiert)

Optional (kostenpflichtig)
├── Sentinel-Hub: NDVI-Satellitenbilder (Vegetation)
└── Meteomatics: Hochauflösende Wetterdaten
```

### 16.2 Buchhaltung & Steuer

```
DATEV-Schnittstelle
├── Kostenstellenbuchungen (DATEV Buchungsstapel)
├── Lohnjournal (DATEV Lodas Format)
├── Belege (Fotos von Rechnungen als Buchungsbelege)
└── Export: monatlich oder auf Anforderung

Bankintegration (optional, Phase 3)
├── HBCI / FinTS: Kontoauszüge abrufen
├── Automatischer Abgleich mit Lieferantenrechnungen
└── Offene-Posten-Liste
```

### 16.3 Agrarsoftware

```
InVeKoS / Förderanträge
├── ELAN (Deutschland bundesweit)
├── DIANA (Thüringen)
├── BayernOnline / iBALIS (Bayern)
└── Export: XML nach jeweiligem Landesstandard

Lohnunternehmer-Schnittstelle
├── Externe Aufträge importieren
└── Stunden und Kosten automatisch zubuchen

LUFA / Bodenanalyse
└── CSV-Import Analyseergebnisse (VDLUFA-Format)
```

### 16.4 Telematik & Maschinendaten

```
Phase 2+ – Direktdaten von Maschinen
├── John Deere Operations Center API
│   → Betriebsstunden, GPS-Track, Kraftstoffverbrauch
├── CLAAS Telematics
│   → Erntedaten (Korn, Stroh, GPS-Ertragskarte)
├── CNH AFS / PLM (Case / New Holland)
│   → Betriebsdaten, Ertragskartierung
└── ISOBUS Allgemein (ISO 11783)
    → Herstellerübergreifend wenn Maschine ISOBUS-fähig

Vorteil: Betriebsstunden und GPS-Tracks kommen automatisch,
kein Mitarbeiter muss etwas eingeben.
```

---

## 17. Rollout-Strategie

### Phase 1 (Monat 1–6): Kern & Akzeptanz

Ziel: Tägliche Nutzung etablieren. Der Betrieb erfährt sofort messbaren Nutzen.

Enthält: Zeiterfassung, Arbeitsaufträge, Schlagkartei, einfache Kostenübersicht, Karte (Schläge einzeichnen + Kulturkarte), Mitarbeiter- und Fuhrparkverwaltung, PDF-Exporte.

Erfolgskriterium: Mindestens 80% der Arbeitstage werden im System erfasst.

### Phase 2 (Monat 7–12): Dokumentation & Compliance

Ziel: Gesetzliche Dokumentationspflichten automatisch erfüllen.

Enthält: Lagerverwaltung, vollständige PSM-Dokumentation, Düngedokumentation mit DüV-Prüfung, GLÖZ-Überwachung, Kontrollbereitschafts-Check, Sachkundenachweise-Verwaltung.

Startpunkt: PSM-Dokumentation zuerst (höchster gesetzlicher Druck, sofort sichtbarer Nutzen).

### Phase 3 (Monat 13–18): Wirtschaftlichkeit & Mehrwert

Ziel: Volle Deckungsbeitragsrechnung, strategische Auswertungen.

Enthält: Vermarktungsmodul, vollständige Wirtschaftlichkeitsanalyse, Schlag-Vergleiche, Wildschadensdokumentation mit Jäger-Zugang, Wachstumsdokumentation, Sortenbenchmark.

### Phase 4 (Monat 19–24): Integrationen & Automatisierung

Ziel: Manuelle Eingabe auf Minimum reduzieren.

Enthält: DATEV-Schnittstelle, Wetter-API-Integration, Sammelantrag-Assistent, Telematik-Anbindung (John Deere, CLAAS), NDVI-Satellitenbilder, Öko-Regelungen-Potenzialanalyse.

---

## 18. Positionierung & Mehrwert

### Was AgroTrack dem Betrieb bringt

```
VORHER (ohne AgroTrack)              NACHHER (mit AgroTrack)
─────────────────────────────────────────────────────────────────
PSM-Heft handschriftlich        →    Automatisch aus Auftrag
Düngeplanung in Excel           →    Integriert, geprüft, gespeichert
Sammelantrag: 2 Tage Aufwand    →    Datenübernahme: < 2 Stunden
Kontrollbesuch: Stress & Suche  →    Kontrollmappe: 1 Klick
GLÖZ prüfen: wann? wie?         →    Ampelsystem, täglich aktuell
Öko-Regelungen: welche lohnen?  →    Potenzialanalyse automatisch
Sachkundenachweis-Ablauf        →    Warnung 6 Monate vorher
Wildschaden: Zettel, Streit     →    Georeferenziert dokumentiert
Betriebsheft: liegt irgendwo    →    Immer aktuell, 1-Klick-Export
Wirtschaftlichkeit: Bauchgefühl →    Exakte €/ha, Jahresvergleich
Maschinenkosten: unklar         →    Stundensatz berechnet, Vergleich
Welcher Schlag ist profitabel?  →    Deckungsbeitragsranking live
Pachtverhandlung: keine Zahlen  →    Datenbasierte Argumentation
─────────────────────────────────────────────────────────────────
Zeitersparnis geschätzt:         6–8 Wochen Bürokratie pro Jahr
Mehrprämien (Öko-Regelungen):    2.000–8.000 € je nach Betrieb
Schadensersatz Wildschäden:      Erstmals vollständig durchsetzbar
```

### Kritische Erfolgsfaktoren

Der häufigste Grund warum Agrarsoftware in der Praxis scheitert ist mangelnde Akzeptanz im Feld. Deshalb gilt: Die Eingabe muss schneller sein als Zettel und Stift. Es darf keine Pflichtfelder geben die im Feld nicht bekannt sind. Fehler müssen korrigierbar sein ohne Datenverlust. Der Bauer sieht sofort den Nutzen – nicht erst nach sechs Monaten Datenpflege.

AgroTrack verdient sein Geld nicht mit Features. Es verdient sein Geld damit dass ein Bauer nach dem ersten Winter sagt: Ich würde niemals wieder auf Papier zurückgehen.

---

*AgroTrack – Konzept v1.0 | Alle Module beschrieben, alle Schnittstellen definiert, alle Dokumentationspflichten adressiert.*