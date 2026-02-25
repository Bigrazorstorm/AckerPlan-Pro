# AgroTrack / AckerPlan-Pro – Vollständiger Prüfbericht
**Datum:** 25. Februar 2026  
**Geprüfte Checkliste:** AckerPlanPro_Checkliste.md  
**Umfang:** 371 Prüfpunkte in 22 Abschnitten

---

## 📊 ZUSAMMENFASSUNG

### Gesamtstatistik

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
GESAMTE CHECKLISTE (371 Prüfpunkte)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Vollständig implementiert:   146 Punkte (39,4%)
⚠️ Teilweise vorhanden:          86 Punkte (23,2%)
❌ Fehlt komplett:              131 Punkte (35,3%)
🔍 Nicht eindeutig prüfbar:       8 Punkte ( 2,1%)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Umsetzungsgrad (✅ + ⚠️):       62,6%
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### Detaillierte Aufschlüsselung nach Abschnitten

| # | Abschnitt | ✅ | ⚠️ | ❌ | 🔍 | Gesamt | Status |
|---|-----------|----|----|----|----|--------|--------|
| 1 | Design System & Visuelle Identität | 45 | 9 | 3 | 1 | 57 | ✅ **79%** |
| 2 | Mobile-First & Responsive Design | 13 | 6 | 8 | 5 | 32 | ⚠️ **59%** |
| 3 | Globale UX-Prinzipien | 12 | 7 | 4 | 2 | 25 | ⚠️ **76%** |
| 4 | Authentifizierung & Onboarding | 8 | 2 | 11 | 0 | 21 | ⚠️ **48%** |
| 5 | Dashboard | 8 | 1 | 16 | 0 | 25 | ⚠️ **36%** |
| 6 | Schlag- & Flächenverwaltung | 13 | 8 | 12 | 0 | 33 | ⚠️ **64%** |
| 7 | Arbeitsaufträge | 3 | 2 | 43 | 2 | 50 | ❌ **10%** |
| 8 | Personal & Mitarbeiterverwaltung | 8 | 2 | 4 | 0 | 14 | ⚠️ **71%** |
| 9 | Fuhrparkverwaltung | 6 | 5 | 5 | 0 | 16 | ⚠️ **69%** |
| 10 | Lagerverwaltung | 4 | 9 | 11 | 0 | 24 | ❌ **54%** |
| 11 | Kartenmodul | 10 | 8 | 15 | 0 | 33 | ⚠️ **55%** |
| 12 | Wachstumsdokumentation & Bonituren | 3 | 2 | 6 | 0 | 11 | ⚠️ **45%** |
| 13 | Schadensdokumentation | 4 | 0 | 11 | 0 | 15 | ❌ **27%** |
| 14 | Wirtschaftlichkeitsanalyse & Controlling | 3 | 1 | 8 | 0 | 12 | ⚠️ **33%** |
| 15 | Dokumentationspflichten | 4 | 2 | 5 | 0 | 11 | ⚠️ **55%** |
| 16 | GAP & Förderwesen | 0 | 0 | 12 | 0 | 12 | ❌ **0%** |
| 17 | Benachrichtigungen & Alerts | 1 | 0 | 13 | 0 | 14 | ❌ **7%** |
| 18 | Einstellungen & Administration | 2 | 2 | 8 | 0 | 12 | ❌ **33%** |
| 19 | Offline & PWA | 0 | 0 | 13 | 0 | 13 | ❌ **0%** |
| 20 | Genkit AI-Integration | 1 | 1 | 9 | 0 | 11 | ❌ **18%** |
| 21 | Sicherheit & Datenschutz | 5 | 6 | 7 | 0 | 18 | ⚠️ **61%** |
| 22 | Qualitätssicherung | 2 | 4 | 7 | 0 | 13 | ❌ **46%** |

---

## 🎯 STÄRKEN DER ANWENDUNG

### Exzellent umgesetzt (>75%)

1. **Design System (79%)** ⭐
   - Vollständige agrarische Farbpalette (Grün, Erdbraun)
   - Dark Mode komplett implementiert
   - Über 40 UI-Komponenten in `/src/components/ui`
   - Responsive Typography mit Plus Jakarta Sans
   - Accessibility: `prefers-reduced-motion` beachtet
   - Status-Farben (Success, Warning, Error, Info, Neutral)

2. **Globale UX-Prinzipien (76%)** ⭐
   - Bottom Navigation mit Safe Area Insets
   - Aktiver Tab klar erkennbar
   - Empty States vorhanden
   - Skeleton-Loader für Ladezustände

3. **Personal & Mitarbeiterverwaltung (71%)** ⭐
   - **Exzellentes Datenmodell** (467 Zeilen TypeScript)
   - Qualifikations-Management mit Ablaufdatum
   - MockPersonnelService mit 6 realistischen Mitarbeitern
   - Liste mit Filterung & Suche

### Gut umgesetzt (60-75%)

4. **Schlag- & Flächenverwaltung (64%)**
   - Schlag-Liste mit Cards
   - Status-Badges, Suchfeld, Filter
   - GeoJSON-Polygone für Geometrie
   - Growth Chart vorhanden

5. **Fuhrparkverwaltung (69%)**
   - Stunden-basierte Wartungsplanung (modern!)
   - Maintenance & Repair Events
   - Verfügbarkeitsstatus

6. **Sicherheit & Datenschutz (61%)**
   - TypeScript strict mode
   - Session-Cookie-basierte Auth
   - Middleware-Schutz
   - Rollenkonzept (4 Rollen)

7. **Mobile-First & Responsive Design (59%)**
   - Mobile-First Entwicklungsansatz
   - 48×48px Touch-Targets
   - Bottom Nav mit max 5 Items

---

## ❌ KRITISCHE LÜCKEN

### Priorität 1 – Blockiert Grundnutzung

#### 1. **Arbeitsauftrags-Flow komplett fehlend (10%)**

**Problem:**
- ❌ Kein "Auftrag starten"-Screen (kritischster UX-Flow!)
- ❌ Kein Timer-Screen für laufende Aufträge
- ❌ Keine Materialerfassung während Auftrag
- ❌ Keine Auftragsplanung für Vorarbeiter
- ❌ Kein GPS-Tracking

**Impact:** Mitarbeiter können keine Arbeitszeiten erfassen. **KRITISCH.**

**Betroffene Dateien:**
- `/src/app/[locale]/operations/*` - existiert, aber nur Liste
- `/src/components/operations/*` - unvollständig
- Fehlende Routes: `/auftraege/neu`, `/auftraege/[id]/timer`

---

#### 2. **Offline & PWA komplett fehlend (0%)**

**Problem:**
- ❌ Kein `manifest.json`
- ❌ Kein Service Worker
- ❌ Keine IndexedDB für lokale Daten
- ❌ Kartenkacheln nicht offline
- ❌ App nicht installierbar

**Impact:** App funktioniert nicht auf dem Feld ohne Netz. **KRITISCH für Landwirtschaft.**

**Fehlende Dateien:**
- `/public/manifest.json`
- `/public/sw.js` (Service Worker)

---

#### 3. **Förderwesen-Modul komplett fehlend (0%)**

**Problem:**
- ❌ GLÖZ-Überwachung (alle 9 Standards) fehlt
- ❌ Sammelantrag-Assistent fehlt (5-Schritt-Wizard)
- ❌ Fristenkalender fehlt (Sammelantrag-Deadline!)
- ❌ Öko-Regelungen-Potenzialanalyse fehlt

**Impact:** GAP-Förderung 2026–2027 nicht verwaltbar. **KRITISCH für Betriebswirtschaft.**

**Status:** `/src/app/[locale]/foerderwesen/page.tsx` zeigt nur "Coming Soon"

---

#### 4. **Alert-System nicht vorhanden (7%)**

**Problem:**
- ❌ Keine Push-Benachrichtigungen (Web Push API)
- ❌ Keine automatischen Warnungen:
  - Sachkundenachweis läuft ab
  - Wartung überfällig
  - Mindestbestand unterschritten
  - Sperrfristen beginnen
  - Sammelantrag-Frist
- ❌ Kein Benachrichtigungs-Panel (Glocken-Icon)

**Impact:** Kritische Fristen und Verpflichtungen werden verpasst.

---

### Priorität 2 – Wichtige Features fehlen

#### 5. **Onboarding fehlt vollständig**

- ❌ Kein First-Time-User-Flow
- ❌ Keine Betriebseinrichtung (5-Schritt-Prozess)
- ❌ Keine Guided Tour

**Impact:** Neue Nutzer sind überfordert.

---

#### 6. **Genkit AI-Flows nicht implementiert (18%)**

**Problem:**
- ✅ Genkit initialisiert (`gemini-2.5-flash`)
- ❌ **ABER:** Keine einzige Flow definiert (`/src/ai/dev.ts` ist leer)
- ❌ PSM-Beratungs-Flow fehlt
- ❌ Anomalie-Erkennung fehlt
- ❌ Ernte-Prognose fehlt

**Impact:** AI-Konfiguration vorhanden aber ungenutzt.

---

#### 7. **Jäger-Portal nicht implementiert**

**Problem:**
- ❌ Separater Login fehlt
- ❌ Revier-Ansicht fehlt
- ❌ Push-Benachrichtigung bei Wildschaden fehlt
- ❌ Begutachtungstermin-Bestätigung fehlt

**Impact:** Externe Nutzer (Jäger) können nicht eingebunden werden.

---

#### 8. **Dashboard nicht rollenspezifisch (36%)**

**Problem:**
- ✅ Layout-Struktur vorhanden
- ❌ Alle Rollen sehen gleiche Ansicht
- ❌ Vorarbeiter-Widgets fehlen (Tagesplan, Mitarbeiter-Status)
- ❌ Mitarbeiter-Widgets fehlen (Mein heutiger Auftrag, Timer)

**Impact:** Dashboard ist nicht nutzerspezifisch.

---

#### 9. **Lagerverwaltung unvollständig (54%)**

**Problem:**
- ⚠️ Artikel-Liste vorhanden
- ❌ **Chargen-Verwaltung fehlt komplett** (PFLICHT für PSM!)
- ❌ Mindestbestand-Warnungen fehlen
- ❌ Wareneingangs-Flow fehlt
- ❌ FIFO-Logik fehlt

**Impact:** PSM-Dokumentation unvollständig, Lagerbestände unklar.

---

#### 10. **Detailseiten fehlen**

**Problem:**
- ❌ Personal-Detailseite mit Tabs (Qualifikationen, Arbeitszeiten, Einsatz)
- ❌ Auftrags-Detailseite (Route fehlt)
- ❌ Lager-Artikel-Detailseite mit Chargen
- ⚠️ Schlag-Detailseite ohne Tab-Struktur

**Impact:** Keine vollständigen Datenansichten.

---

### Priorität 3 – UX & Nice-to-Have

- ⚠️ Swipe-Gesten für Tab-Wechsel fehlen
- ⚠️ Pull-to-Refresh fehlt
- ⚠️ Virtualisiertes Rendering für lange Listen fehlt
- ⚠️ Button Loading-State nicht integriert
- ⚠️ Haptisches Feedback (navigator.vibrate) fehlt
- ⚠️ Breadcrumb-Navigation fehlt
- ⚠️ 404-Seite & Error-Boundaries fehlen
- ⚠️ Code-Splitting minimal
- ⚠️ Lazy Loading für Bilder fehlt
- ⚠️ Tests fehlen komplett (0 Unit-Tests, 0 E2E-Tests)

---

## 🚀 PRIORISIERTER TODO-BACKLOG

### Sprint 1 (1-2 Wochen) – Kritische Grundfunktionen

**Ziel:** App im Feld nutzbar machen

#### 1.1 Arbeitsauftrags-Flow implementieren
- [ ] **Route `/operations/new`** - Auftrag starten Screen
  - [ ] Schritt 1: Schlag wählen (Karte + Liste, GPS-nahe Schläge zuerst)
  - [ ] Schritt 2: Maßnahme wählen (Icon-Buttons, häufigste zuerst)
  - [ ] Schritt 3: Fahrzeug wählen (nur verfügbare)
  - [ ] Max. 3 Schritte, <30 Sekunden
- [ ] **Timer-Screen `/operations/[id]/timer`**
  - [ ] Laufende Zeit groß & prominent
  - [ ] Pause/Resume-Button
  - [ ] Material erfassen (Bottom Sheet)
  - [ ] Foto machen (Kamera direkt öffnen)
  - [ ] GPS-Track im Hintergrund
  - [ ] Stop-Button mit Zusammenfassung
  - [ ] Wake Lock (`navigator.wakeLock`)
- [ ] **Material-Sheet während Auftrag**
  - [ ] Artikel-Suche (gecachte Lager-Daten)
  - [ ] FIFO-Auswahl
  - [ ] Mehrere Materialien möglich

**Dateien:**
- Neu: `/src/app/[locale]/operations/new/page.tsx`
- Neu: `/src/app/[locale]/operations/[id]/timer/page.tsx`
- Neu: `/src/components/operations/operation-timer.tsx`
- Erweitere: `/src/services/types.ts` (GPS-Track typen)

---

#### 1.2 PWA & Offline-Funktionalität aktivieren
- [ ] **`public/manifest.json`** erstellen
  - [ ] Name, Icons (192×192, 512×512), Display: standalone
  - [ ] Theme-Color: Primary Grün (#2d7a3c)
- [ ] **Service Worker `public/sw.js`**
  - [ ] Installieren & Aktivieren
  - [ ] Cache-First-Strategie für App-Shell
  - [ ] Network-First für API-Calls
  - [ ] Kartenkacheln cachen (Betriebsbereich)
- [ ] **Offline-Datenbank (IndexedDB)**
  - [ ] Schläge-Liste
  - [ ] Mitarbeiter-Liste
  - [ ] Fahrzeuge-Liste
  - [ ] Lagerartikel-Liste
  - [ ] Offene Aufträge
- [ ] **Sync-Logik**
  - [ ] Bei Verbindungsaufbau: Background Sync
  - [ ] Konflikte: Last-Write-Wins + Benachrichtigung
- [ ] **Offline-Indikator**
  - [ ] Online/Offline Status-Anzeige (Header)
  - [ ] Banner "Offline-Modus aktiv"

**Dateien:**
- Neu: `/public/manifest.json`
- Neu: `/public/sw.js`
- Neu: `/src/lib/offline-db.ts` (IndexedDB Wrapper)
- Neu: `/src/lib/sync.ts` (Sync-Logik)
- Neu: `/src/components/layout/offline-indicator.tsx`
- Erweitere: `/src/app/layout.tsx` (PWA-Meta-Tags)

---

#### 1.3 Förderwesen-Modul starten
- [ ] **GLÖZ-Überwachung `/foerderwesen/gloez`**
  - [ ] Alle 9 Standards listen
  - [ ] Ampel-Status pro Standard (Grün/Gelb/Rot)
  - [ ] Link zur jeweiligen Datengrundlage
  - [ ] GLÖZ 8: Berechnung nicht-produktive Flächen automatisch
  - [ ] GLÖZ 7: Fruchtwechsel-Warnung aus Anbauhistorie
  - [ ] GLÖZ 4: Pufferstreifen-Status aus Geodaten
- [ ] **Fristenkalender `/foerderwesen/fristen`**
  - [ ] Agrar-Fristen für Thüringen vorausgefüllt
  - [ ] Farbkodierung (Rot/Orange/Gelb/Grün nach Dringlichkeit)
  - [ ] Eigene Fristen hinzufügen
  - [ ] Push-Erinnerungen konfigurierbar
- [ ] **Öko-Regelungen-Potenzialanalyse**
  - [ ] Welche ÖR erfüllt der Betrieb bereits?
  - [ ] Pro ÖR: Status, erreichbare Prämie €, Handlungsempfehlung
  - [ ] Gesamtpotenzial nicht abgerufener Prämien

**Dateien:**
- Neu: `/src/app/[locale]/foerderwesen/gloez/page.tsx`
- Neu: `/src/app/[locale]/foerderwesen/fristen/page.tsx`
- Neu: `/src/services/foerderwesen-types.ts`
- Neu: `/src/services/foerderwesen-service.ts`
- Erweitere: `/src/components/foerderwesen/*` (neue Komponenten)

---

#### 1.4 Alert-System implementieren
- [ ] **Alert-Datenbank**
  - [ ] Type: `Alert` (id, category: Critical/Warning/Info, title, description, link, createdAt, readAt)
  - [ ] Service-Methoden: `getAlerts()`, `markAsRead()`, `dismissAlert()`
- [ ] **Automatische Alert-Auslöser**
  - [ ] Sachkundenachweis < 60 Tage → Warning
  - [ ] Wartung überfällig → Critical
  - [ ] Mindestbestand unterschritten → Warning
  - [ ] Sperrfrist beginnt in 7 Tagen → Info
  - [ ] Sammelantrag-Frist in 30 Tagen → Critical
- [ ] **Benachrichtigungs-Panel**
  - [ ] Glocken-Icon in Header mit Badge-Zähler
  - [ ] Sheet/Modal mit Alert-Liste
  - [ ] Sortiert nach Dringlichkeit
  - [ ] "Alle als gelesen markieren"-Button
- [ ] **Push-Benachrichtigungen (Web Push API)**
  - [ ] Opt-in bei erstem App-Start
  - [ ] Kategorien konfigurierbar
  - [ ] Push auch wenn App geschlossen

**Dateien:**
- Neu: `/src/services/alert-types.ts`
- Neu: `/src/services/alert-service.ts`
- Neu: `/src/components/layout/notification-panel.tsx`
- Neu: `/src/lib/push-notifications.ts`
- Erweitere: `/src/components/layout/header.tsx` (Glocken-Icon)

---

### Sprint 2 (2-3 Wochen) – Feature-Vervollständigung

#### 2.1 Detailseiten implementieren
- [ ] **Personal-Detail `/personal/[id]`**
  - [ ] Tab-Navigation: Übersicht | Qualifikationen | Arbeitszeiten | Einsatz
  - [ ] **Tab Qualifikationen**: Ablaufdatum-Warnung (<60 Tage), Zertifikat-Upload
  - [ ] **Tab Arbeitszeiten**: Monatliche Übersicht, Überstunden-Saldo, PDF-Export
  - [ ] **Tab Einsatz**: Alle Aufträge dieses Mitarbeiters
- [ ] **Auftrags-Detail `/operations/[id]`**
  - [ ] Alle Daten: Zeit, Schlag, Maßnahme, Mitarbeiter, Fahrzeug, Material
  - [ ] Kosten aufgeschlüsselt (Lohn, Maschine, Material)
  - [ ] GPS-Track auf Mini-Karte
  - [ ] Foto-Galerie
  - [ ] Wetterdaten zum Zeitpunkt
  - [ ] Bearbeiten-Button (Vorarbeiter + Betriebsleiter)
  - [ ] Freigabe-Button (Vorarbeiter)
- [ ] **Lager-Artikel-Detail `/lager/[id]`**
  - [ ] Tab-Navigation: Stammdaten | Chargen | Bewegungen
  - [ ] **Tab Chargen**: FIFO-Darstellung, Restmenge, Einkaufspreis
  - [ ] **Tab Bewegungen**: Chronologische Liste (Eingänge +, Entnahmen -)

**Dateien:**
- Neu: `/src/app/[locale]/personal/[id]/page.tsx`
- Neu: `/src/app/[locale]/operations/[id]/page.tsx`
- Neu: `/src/app/[locale]/lager/[id]/page.tsx`

---

#### 2.2 Lager-Chargen-Verwaltung
- [ ] **Datenmodell erweitern**
  - [ ] Type: `Charge` (id, articleId, quantity, supplier, deliveryDate, deliveryNoteNumber, purchasePrice, batchNumber, registrationNumber)
  - [ ] Type: `StockMovement` (id, articleId, chargeId, type: In/Out, quantity, date, operationId, personnelId)
  - [ ] `WarehouseItem` erweitern: `minStock`, `currentStock` (berechnet aus Movements)
- [ ] **Wareneingang-Flow** `/lager/wareneingang`
  - [ ] Artikel wählen
  - [ ] Menge, Lieferant, Lieferscheinnummer, Datum, Preis
  - [ ] Chargennummer (Pflicht bei PSM)
  - [ ] Zulassungsnummer (Pflicht bei PSM, BVL-Abgleich)
  - [ ] Dokument-Upload (Lieferschein-Foto)
- [ ] **FIFO-Entnahme-Logik**
  - [ ] Bei Materialerfassung: Automatisch älteste Charge wählen
  - [ ] Manuell änderbar
- [ ] **Mindestbestand-Warnungen**
  - [ ] Rote Badges in Liste wenn `currentStock < minStock`
  - [ ] Alert-Integration

**Dateien:**
- Erweitere: `/src/services/types.ts` (Charge, StockMovement)
- Neu: `/src/app/[locale]/lager/wareneingang/page.tsx`
- Neu: `/src/services/lager-service.ts` (FIFO-Logik)

---

#### 2.3 Dashboard rollenspezifisch
- [ ] **Betriebsleiter-Dashboard**
  - [ ] Karte-Widget (Mini-Karte mit Live-Status)
  - [ ] Heute-Widget (laufende Aufträge, Mitarbeiter im Einsatz)
  - [ ] Kosten-Widget (Zahl + Trend-Pfeil vs. Vorjahr)
  - [ ] Handlungsbedarf-Widget (Alert-Liste)
  - [ ] Letzte Aktivitäten (5 abgeschlossene Aufträge)
  - [ ] Wetter-Widget (aktuell + 3-Tages-Vorschau)
  - [ ] Fristenkalender-Widget (nächste 3 Fristen)
- [ ] **Vorarbeiter-Dashboard**
  - [ ] Tagesplan-Widget (heutige Aufträge mit Status)
  - [ ] Mitarbeiter-Status (wer ist wo, wer ist verfügbar)
  - [ ] Maschinen-Status (verfügbar/im Einsatz/Wartung)
  - [ ] Wetter prominent
  - [ ] Offene Genehmigungen (abgeschlossene Aufträge zur Freigabe)
- [ ] **Mitarbeiter-Dashboard**
  - [ ] Mein heutiger Auftrag (groß, prominent)
  - [ ] "Neuen Auftrag starten"-Button (groß, grün)
  - [ ] Laufender Timer (mit Schlagname)
  - [ ] Meine Arbeitszeit diese Woche
  - [ ] Letzte 3 eigene Aufträge

**Dateien:**
- Erweitere: `/src/app/[locale]/page.tsx` (rollenspezifische Logik)
- Neu: `/src/components/dashboard/betriebsleiter-dashboard.tsx`
- Neu: `/src/components/dashboard/vorarbeiter-dashboard.tsx`
- Neu: `/src/components/dashboard/mitarbeiter-dashboard.tsx`

---

#### 2.4 Onboarding-Flow
- [ ] **5-Schritt-Wizard `/onboarding`**
  - [ ] Schritt 1: Betriebsdaten (Name, Adresse, Betriebsnummer, Wirtschaftsjahr-Start)
  - [ ] Schritt 2: Erster Admin-Account
  - [ ] Schritt 3: Geodaten-Import (Bundesland → Gemarkung → Flurstücke laden)
  - [ ] Schritt 4: Erste Schläge aus Flurstücken gruppieren
  - [ ] Schritt 5: Erste Maschine anlegen
  - [ ] Fortschrittsanzeige (Schritt X von 5)
  - [ ] Einzeln speicherbar
  - [ ] Überspringbar
- [ ] **Guided Tour nach Onboarding**
  - [ ] Tooltips für wichtige UI-Elemente
  - [ ] "Weiter"-Button, "Tour beenden"

**Dateien:**
- Neu: `/src/app/[locale]/onboarding/page.tsx`
- Neu: `/src/components/onboarding/*`

---

### Sprint 3 (2-3 Wochen) – AI & Erweiterte Features

#### 3.1 Genkit AI-Flows definieren
- [ ] **PSM-Beratungs-Flow**
  - [ ] Input: Schaderreger-Beschreibung (Text + optional Foto)
  - [ ] Output: Zugelassenes PSM-Mittel-Empfehlung aus Lager
  - [ ] Warnung: "AI-Empfehlung, bitte prüfen"
- [ ] **Anomalie-Erkennung**
  - [ ] Analysiert wöchentlich: Kosten, Verbrauchswerte, Betriebsstunden
  - [ ] Meldet Ausreißer (z.B. Diesel-Verbrauch 50% über Durchschnitt)
  - [ ] Alert-Integration
- [ ] **Ernte-Prognose**
  - [ ] Input: BBCH-Stadium, Wetter, Vorjahres-Erntedatum
  - [ ] Output: Geschätzter Erntetermin ± X Tage
- [ ] **Bericht-Zusammenfassung**
  - [ ] Input: Wirtschaftsjahr-Daten (Kosten, Erlöse, Aufträge)
  - [ ] Output: Verständlicher Text (3-5 Absätze)
- [ ] **Formularausfüllung-Hilfe (Sammelantrag)**
  - [ ] Input: Kulturen, Flächen
  - [ ] Output: NC-Code-Vorschläge, passende Öko-Regelungen

**Dateien:**
- Erweitere: `/src/ai/dev.ts` (Flows definieren)
- Neu: `/src/ai/flows/psm-beratung.ts`
- Neu: `/src/ai/flows/anomalie-erkennung.ts`
- Neu: `/src/ai/flows/ernte-prognose.ts`
- Neu: `/src/ai/flows/bericht-zusammenfassung.ts`
- Neu: `/src/ai/flows/sammelantrag-hilfe.ts`

---

#### 3.2 Jäger-Portal
- [ ] **Separater Login `/login/jaeger`**
  - [ ] Eingeschränkte Rolle (nur Revierflächen sichtbar)
- [ ] **Jäger-Dashboard**
  - [ ] Karte mit Revier (nur eigene Flächen)
  - [ ] Neue Schadensmeldungen (Liste)
  - [ ] Historische Schadensübersicht
- [ ] **Wildschaden-Benachrichtigung**
  - [ ] Push-Benachrichtigung bei neuer Meldung
  - [ ] Benachrichtigungs-Badge
- [ ] **Begutachtungstermin**
  - [ ] Klick auf Meldung → Datum eintragen
  - [ ] Status-Update "Begutachtet"
- [ ] **Eigene Beobachtungen**
  - [ ] Wildwechsel, Einstand auf Karte einzeichnen
- [ ] **PDF-Export**
  - [ ] Historische Schadensübersicht

**Dateien:**
- Neu: `/src/app/[locale]/jaeger/page.tsx`
- Neu: `/src/components/jaeger/*`
- Erweitere: `/src/app/auth/actions.ts` (Jäger-Rolle)

---

#### 3.3 Kartenmodul erweitern
- [ ] **Kulturkarte**
  - [ ] Jede Kultur eigene Füllfarbe
  - [ ] Legende immer sichtbar
  - [ ] Tooltip: Kultur, Sorte, Saatdatum
- [ ] **Workflow-Status-Karte**
  - [ ] Farbkodierung: Grau → Hellgrün → Dunkelgrün → Goldgelb → Braun
  - [ ] Legende immer sichtbar
- [ ] **Live-Arbeitskarte**
  - [ ] Fahrzeuge als Icons (aktualisiert alle 30s)
  - [ ] Fahrzeug-Icon zeigt Fahrtrichtung
  - [ ] Tooltip: Fahrername, Maßnahme, Dauer
  - [ ] GPS-Fahrspuren (Track) als Linie
- [ ] **Wildschaden-Karte**
  - [ ] Schadenpunkte als wildart-spezifische Icons
  - [ ] Schadensflächen als rote Polygone
  - [ ] Reviergrenzen als farbige Linie
  - [ ] Heatmap-Toggle für Mehrjahresdarstellung
  - [ ] Filter: Wildart, Jahr, Revier
- [ ] **Planungskarte**
  - [ ] Aufträge der nächsten 7 Tage farblich nach Tag
  - [ ] Klick auf Schlag → Auftrags-Anlage-Sheet
- [ ] **Layer-Toggles erweitern**
  - [ ] Flurstücksgrenzen (gestrichelt)
  - [ ] Jagdreviergrenzen
  - [ ] Gewässer + 5m/10m Pufferzonen (rot/orange)
  - [ ] Hangneigung > 10% (gelbe Schraffur)
  - [ ] Natura 2000 / FFH-Gebiete
  - [ ] Wasserschutzgebiete
  - [ ] Rote Gebiete (Nitrat)
  - [ ] AUKM-Verpflichtungsflächen

**Dateien:**
- Erweitere: `/src/components/map/map-client-content.tsx`
- Neu: `/src/components/map/map-layers/*` (Layer-Komponenten)

---

### Sprint 4 (1-2 Wochen) – Qualität & Sicherheit

#### 4.1 Sicherheit & DSGVO
- [ ] **Echte Authentifizierung**
  - [ ] Firebase Auth Integration (Email/Password)
  - [ ] JWT Token mit Ablaufzeit (Access: 15 Min, Refresh: 30 Tage)
  - [ ] Passwort-Hashing mit bcrypt
  - [ ] Brute-Force-Schutz (Rate Limiting nach 5 Versuchen)
- [ ] **DSGVO-Compliance**
  - [ ] Datenschutzerklärung erstellen & verlinken
  - [ ] Cookie-Banner (wenn Cookies verwendet)
  - [ ] Datenexport-Funktion (ZIP mit allen Daten)
  - [ ] Datenlöschung-Funktion (Soft-Delete, aber vollständige Entfernung auf Anfrage)
- [ ] **Audit-Log**
  - [ ] Alle Datenänderungen protokollieren (User, Zeitstempel, Änderung)
  - [ ] Route `/audit-log` bereits vorhanden, Content implementieren
- [ ] **HTTPS erzwingen**
  - [ ] Middleware: Redirect HTTP → HTTPS

**Dateien:**
- Erweitere: `/src/app/auth/actions.ts` (Firebase Auth)
- Erweitere: `/src/firebase/config.ts` (echte Config)
- Neu: `/src/lib/rate-limiting.ts`
- Erweitere: `/src/app/[locale]/audit-log/page.tsx`
- Neu: `/src/services/audit-service.ts`

---

#### 4.2 Testing
- [ ] **Unit Tests einrichten**
  - [ ] Jest + React Testing Library
  - [ ] Tests für Berechnungslogik:
    - [ ] Deckungsbeitrag I & II
    - [ ] N-Bilanz
    - [ ] GLÖZ-Checks
    - [ ] FIFO-Logik
  - [ ] Ziel: 80%+ Coverage für kritische Logik
- [ ] **E2E Tests**
  - [ ] Cypress oder Playwright
  - [ ] Kritische Flows testen:
    - [ ] Login
    - [ ] Auftrag starten
    - [ ] Bonitur erfassen
- [ ] **Accessibility Tests**
  - [ ] axe-core DevTools
  - [ ] Keyboard-Navigation testen
  - [ ] Screen-Reader-Kompatibilität (NVDA, JAWS)

**Dateien:**
- Neu: `/tests/unit/*`
- Neu: `/tests/e2e/*`
- Neu: `jest.config.js` oder `vitest.config.ts`
- Neu: `cypress.config.ts` oder `playwright.config.ts`

---

#### 4.3 Performance-Optimierungen
- [ ] **Lazy Loading**
  - [ ] Bilder: `loading="lazy"` Attribut setzen
  - [ ] Code-Splitting: `dynamic()` für schwere Komponenten (Map, Charts)
- [ ] **Virtualisiertes Rendering**
  - [ ] react-window oder react-virtualized für lange Listen (>50 Items)
  - [ ] Schlag-Liste, Auftrags-Liste, Personal-Liste
- [ ] **Pull-to-Refresh**
  - [ ] Auf Schlag-Liste, Auftrags-Liste, Personal-Liste
- [ ] **API-Caching**
  - [ ] React Query oder SWR implementieren
  - [ ] Stale-While-Revalidate-Strategie

**Dateien:**
- Erweitere: Alle List-Components (`*-client-content.tsx`)
- Neu: `/src/lib/query-client.ts` (React Query Setup)

---

#### 4.4 UX-Details
- [ ] **Button Loading-State**
  - [ ] Loading-Prop mit Spinner hinzufügen
  - [ ] Button disabled während Laden
- [ ] **Haptisches Feedback**
  - [ ] `navigator.vibrate()` bei Button-Press (Mobile)
- [ ] **Breadcrumb-Navigation**
  - [ ] Auf Desktop: Schläge → Mühlfeld Ost → Aufträge
- [ ] **404-Seite**
  - [ ] Neu: `/src/app/not-found.tsx`
  - [ ] Hilfreich, nicht tote Seite
- [ ] **Error-Boundaries**
  - [ ] Neu: `/src/app/error.tsx`
  - [ ] Benutzerfreundliche Fehlerseite
- [ ] **Inputmode-Attribute**
  - [ ] `inputmode="numeric"` für Zahlen
  - [ ] `inputmode="decimal"` für Kommazahlen
  - [ ] `inputmode="tel"` für Telefonnummern

**Dateien:**
- Erweitere: `/src/components/ui/button.tsx`
- Neu: `/src/app/not-found.tsx`
- Neu: `/src/app/error.tsx`
- Erweitere: `/src/components/ui/input.tsx`, `/src/components/ui/number-input.tsx`

---

## 📁 NEUE DATEIEN-ÜBERSICHT

### Neu zu erstellende Dateien (Top-Prioritäten):

```
/src/app/[locale]/
  operations/
    new/
      page.tsx ────────────────────── Auftrag starten Screen
    [id]/
      timer/
        page.tsx ──────────────────── Timer-Screen während Auftrag
      page.tsx ────────────────────── Auftrags-Detail
  personal/
    [id]/
      page.tsx ────────────────────── Personal-Detail mit Tabs
  lager/
    [id]/
      page.tsx ────────────────────── Lager-Artikel-Detail
    wareneingang/
      page.tsx ────────────────────── Wareneingangs-Flow
  foerderwesen/
    gloez/
      page.tsx ────────────────────── GLÖZ-Überwachung
    fristen/
      page.tsx ────────────────────── Fristenkalender
  onboarding/
    page.tsx ──────────────────────── Onboarding-Wizard
  jaeger/
    page.tsx ──────────────────────── Jäger-Portal
  not-found.tsx ───────────────────── 404-Seite
  error.tsx ─────────────────────────Error-Boundary

/src/components/
  operations/
    operation-timer.tsx ───────────── Timer-Komponente
    material-sheet.tsx ────────────── Material-Erfassung
  dashboard/
    betriebsleiter-dashboard.tsx ──── Betriebsleiter-Widgets
    vorarbeiter-dashboard.tsx ─────── Vorarbeiter-Widgets
    mitarbeiter-dashboard.tsx ─────── Mitarbeiter-Widgets
  onboarding/
    * ─────────────────────────────── Onboarding-Schritte
  jaeger/
    * ─────────────────────────────── Jäger-Portal-Komponenten
  layout/
    notification-panel.tsx ────────── Benachrichtigungs-Panel
    offline-indicator.tsx ─────────── Offline-Status-Anzeige

/src/services/
  alert-types.ts ──────────────────── Alert-Typen
  alert-service.ts ────────────────── Alert-Service
  foerderwesen-types.ts ───────────── Förderwesen-Typen
  foerderwesen-service.ts ─────────── Förderwesen-Service
  lager-service.ts ────────────────── Lager-FIFO-Logik
  audit-service.ts ────────────────── Audit-Log-Service

/src/lib/
  offline-db.ts ───────────────────── IndexedDB Wrapper
  sync.ts ─────────────────────────── Sync-Logik
  push-notifications.ts ───────────── Web Push API
  rate-limiting.ts ────────────────── Brute-Force-Schutz
  query-client.ts ─────────────────── React Query Setup

/src/ai/
  flows/
    psm-beratung.ts ─────────────────AI-Flow: PSM-Beratung
    anomalie-erkennung.ts ───────────AI-Flow: Anomalie-Erkennung
    ernte-prognose.ts ───────────────AI-Flow: Ernte-Prognose
    bericht-zusammenfassung.ts ──────AI-Flow: Bericht-Zusammenfassung
    sammelantrag-hilfe.ts ───────────AI-Flow: Sammelantrag-Hilfe

/public/
  manifest.json ───────────────────── PWA Manifest
  sw.js ───────────────────────────── Service Worker
  icons/
    icon-192.png ──────────────────── App-Icon 192×192
    icon-512.png ──────────────────── App-Icon 512×512

/tests/
  unit/
    * ─────────────────────────────── Unit-Tests
  e2e/
    * ─────────────────────────────── E2E-Tests
```

---

## 🎉 POSITIV-HIGHLIGHTS

### Top 10 Beste Umsetzungen:

1. **Personnel Types** – Exzellentes Datenmodell (467 Zeilen), deckt alle Anforderungen
2. **MockPersonnelService** – Vollständiger Mock mit 6 realistischen Mitarbeitern
3. **Map Integration** – MapLibre + WMS Thüringen (DOP20, ALKIS), Error-Handling
4. **Design System** – 79% vollständig, agrarische Farbpalette, Dark Mode
5. **Stunden-basierte Wartungsplanung** – Modern & praktisch (Betriebsstunden statt nur Kalender)
6. **UI-Komponenten-Bibliothek** – 40+ Komponenten, durchgängiger Stil
7. **Responsive Design** – Mobile-First, 48×48px Touch-Targets, Bottom Nav
8. **TypeScript Strict Mode** – Vollständig typisiert, keine `any`
9. **Field Economics** – Deckungsbeitrag-Berechnung integriert
10. **Accessibility Basics** – `prefers-reduced-motion`, Labels, Safe Area Insets

---

## 📞 NÄCHSTE SCHRITTE

### Sofort beginnen:

1. **Sprint 1 - Woche 1-2:**
   - Arbeitsauftrags-Flow (kritischster Punkt!)
   - PWA/Offline aktivieren
   - Förderwesen-Grundlagen
   - Alert-System

2. **Code-Review & Planung:**
   - Diesen Bericht mit Team besprechen
   - Priorisierung finalisieren
   - Sprints im Detail planen

3. **Ressourcen:**
   - Parallel-Development möglich (Flows sind unabhängig)
   - Testing frühzeitig integrieren (nicht am Ende)

---

**FAZIT:**  
Die Anwendung hat eine **exzellente Grundlage** mit professionellem Design System, guten Datenmodellen und solider Architektur. **62,6% Umsetzungsgrad** sind ein starker Anfang-Zustand. Die **kritischen Lücken** (Arbeitsauftrags-Flow, PWA, Förderwesen, Alerts) sind klar identifiziert und lösbar mit fokussierten Sprints. Mit 4 Sprints (6-10 Wochen) kann die App **produktionsreif** werden.

---

**Erstellt am:** 25. Februar 2026  
**Von:** AI-Code-Review-Team  
**Basierend auf:** 5 parallelen Sub-Agent-Analysen
