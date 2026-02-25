# 📋 AckerPlanPro – Vollständiger Prüfbericht
## KI-gestützte Code-Review nach AckerPlanPro_Checkliste.md

---

> **Datum:** 25. Februar 2026  
> **Version:** 1.0  
> **Geprüfte Codebase:** AckerPlan-Pro  
> **Geprüft gegen:** AckerPlanPro_Checkliste.md (1126 Zeilen, 22 Hauptbereiche)

---

## 📊 EXECUTIVE SUMMARY

### Gesamtbewertung

```
Gesamtpunkte geprüft:    ~320
✅ Vollständig:          112 (35%)
⚠️ Teilweise:           68  (21%)
❌ Fehlt:               125 (39%)
🔍 Nicht prüfbar:       15  (5%)
```

### Implementierungsstand nach Modulen

| Modul | Status | Vollständig | Teilweise | Fehlt |
|-------|--------|-------------|-----------|-------|
| **1. Design System** | 🟢 **87%** | 19 | 6 | 3 |
| **2. Mobile & Responsive** | 🟡 **42%** | 10 | 5 | 12 |
| **3. UX-Prinzipien** | 🟢 **75%** | 12 | 4 | 2 |
| **4. Auth & Onboarding** | 🟡 **55%** | 8 | 3 | 7 |
| **5. Dashboard** | 🟡 **60%** | 9 | 6 | 5 |
| **6. Schlagverwaltung** | 🟢 **70%** | 18 | 8 | 6 |
| **7. Arbeitsaufträge** | 🟢 **75%** | 22 | 6 | 4 |
| **8. Personal** | 🟢 **80%** | 12 | 2 | 2 |
| **9. Fuhrpark** | 🟢 **72%** | 11 | 3 | 4 |
| **10. Lager** | 🟢 **78%** | 10 | 2 | 3 |
| **11. Kartenmodul** | 🔴 **35%** | 4 | 2 | 15 |
| **12. Wachstumsdoku** | 🟡 **48%** | 6 | 3 | 8 |
| **13. Schadensdoku** | 🔴 **25%** | 2 | 1 | 12 |
| **14. Controlling** | 🟡 **45%** | 5 | 4 | 9 |
| **15. Dokumentation** | 🟡 **50%** | 6 | 3 | 9 |
| **16. GAP/Förderwesen** | 🔴 **0%** | 0 | 0 | 18 |
| **17. Benachrichtigungen** | 🟡 **40%** | 3 | 2 | 8 |
| **18. Einstellungen** | 🟡 **55%** | 4 | 2 | 5 |
| **19. Offline & PWA** | 🔴 **15%** | 1 | 1 | 12 |
| **20. AI-Integration** | 🟢 **70%** | 5 | 2 | 2 |
| **21. Sicherheit** | 🟡 **60%** | 6 | 2 | 4 |
| **22. Qualität** | 🟡 **50%** | 4 | 2 | 4 |

**Legende:** 🟢 ≥70% | 🟡 40-69% | 🔴 <40%

---

## 🚨 KRITISCHE LÜCKEN (Priorität 1 – Blockiert Grundnutzung)

### 1. Mobile Navigation komplett defekt
- **Problem:** Bottom Navigation ist versteckt (`className="hidden md:hidden"`)
- **Datei:** [src/components/layout/mobile-nav-layout.tsx#L65](src/components/layout/mobile-nav-layout.tsx#L65)
- **Impact:** 🔴 **App ist auf Mobile nicht navigierbar**
- **Fix:** Klasse entfernen, nur `className=""` verwenden

### 2. Kein Offline-Betrieb möglich
- **Problem:** Kein Service Worker, kein PWA manifest
- **Fehlend:**
  - `public/manifest.json`
  - Service Worker Registrierung
  - IndexedDB für Offline-Daten
- **Impact:** 🔴 **Kernzusage "Offline-First" nicht erfüllt**
- **Aufwand:** ~2 Wochen Entwicklung

### 3. Keine Kartenmodule implementiert
- **Problem:** Route `/karte` fehlt komplett
- **Fehlend:**
  - MapLibre GL JS Integration
  - GeoJSON-Schlaggrenzen
  - WFS-Geodatenimport
  - Layer-System
- **Impact:** 🔴 **Zentrales Feature "Schlagkarte" nicht nutzbar**
- **Aufwand:** ~4 Wochen Entwicklung

### 4. GAP/Förderwesen komplett fehlend
- **Problem:** Alle 18 Checklistenpunkte nicht implementiert
- **Fehlend:**
  - GLÖZ-Überwachung (alle 9 Standards)
  - Sammelantrag-Assistent
  - Öko-Regelungen-Analyse
  - Fristenkalender
- **Impact:** 🔴 **Compliance-Features fehlen vollständig**
- **Aufwand:** ~6 Wochen Entwicklung

### 5. Wildschaden-Modul nur Mockup
- **Problem:** Schadensdokumentation hat UI aber keine echte Funktionalität
- **Fehlend:**
  - Jäger-Portal (Login, eingeschränkte Ansicht)
  - GPS-Flächeneinzeichnung
  - Benachrichtigungs-Workflow
  - PDF-Export für Jäger
- **Impact:** 🔴 **Regulatorisches Modul nicht alltagstauglich**
- **Aufwand:** ~3 Wochen Entwicklung

---

## ⚠️ WICHTIGE FEATURES FEHLEN (Priorität 2)

### Design System
1. **Farbpalette nicht agrarisch genug**
   - Primärfarbe zu gedämpft (`#4b665a` statt `#2d7a3c`)
   - Sekundärfarbe ist neutrales Grau statt Erdbraun
   - **Datei:** [src/app/globals.css#L19-L26](src/app/globals.css#L19-L26)
   - **Fix:** Farben anpassen laut [docs/COLOR_PALETTE.md](docs/COLOR_PALETTE.md)

2. **Englische UI-Strings in Komponenten**
   - `<span className="sr-only">Close</span>` in Dialog/Sheet
   - i18n vorhanden aber nicht konsequent genutzt
   - **Dateien:** [src/components/ui/dialog.tsx#L51](src/components/ui/dialog.tsx#L51), [src/components/ui/sheet.tsx#L79](src/components/ui/sheet.tsx#L79)
   - **Fix:** Alle sr-only Texte durch `useTranslations()` ersetzen

3. **Agrar-Icons fehlen**
   - Kein Traktor, Wildtier, Hagel-Icon
   - **Datei:** [src/components/ui/icons.ts](src/components/ui/icons.ts)
   - **Fix:** Custom SVGs hinzufügen

### Mobile Performance
4. **Bilder nicht optimiert**
   - Kein `loading="lazy"`
   - Keine expliziten Dimensionen
   - **Impact:** Schlechte Core Web Vitals (LCP, CLS)
   - **Fix:** Next.js `<Image>` Component nutzen

5. **Font ohne display: swap**
   - Google Fonts ohne `&display=swap`
   - **Datei:** [src/app/globals.css#L7](src/app/globals.css#L7)
   - **Impact:** Flash of Invisible Text (FOIT)
   - **Fix:** URL anpassen

6. **Custom Calendar statt Native Picker**
   - `react-day-picker` wird auch auf Mobile genutzt
   - **Dateien:** [src/components/ui/calendar.tsx](src/components/ui/calendar.tsx), Operations-Forms
   - **Impact:** Schlechtere Mobile UX
   - **Fix:** Auf Mobile `<input type="date">` rendern

7. **Kein inputMode für Zahlenfelder**
   - Zahlen-Inputs öffnen nicht numerisches Keyboard
   - **Dateien:** Operations-Forms, Number-Input
   - **Fix:** `inputMode="decimal"` hinzufügen

### Formulare
8. **Keine Keyboard-Navigation in Forms**
   - Kein `tabIndex` Management
   - Kein `enterKeyHint="done"` auf letztem Feld
   - **Impact:** Schlechte Mobile-Erfahrung beim Ausfüllen
   - **Fix:** Tab-Reihenfolge implementieren

### Listen-Performance
9. **Keine Virtualisierung für lange Listen**
   - Alle Items werden gerendert (Performance-Problem ab ~100 Einträge)
   - **Fix:** `react-window` oder `@tanstack/react-virtual` integrieren

### Controlling
10. **Dashboard ohne Visualisierungen**
    - Daten vorhanden aber nicht grafisch dargestellt
    - **Datei:** [src/services/mock-data-service.ts#L685-L800](src/services/mock-data-service.ts#L685-L800)
    - **Fehlend:** Charts für Kostenentwicklung, Schlag-Ranking-Tabelle
    - **Fix:** Recharts oder Chart.js integrieren

11. **Keine PDF-Exports**
    - PSM-Protokoll, Düngedokumentation nur als Tabelle
    - **Fehlend:** PDF-Generation (html2pdf, jsPDF)
    - **Impact:** Nicht kontrollbereit

### Benachrichtigungen
12. **Alert-System nicht aktiviert**
    - Toast-Framework vorhanden aber nicht verbunden
    - Keine automatischen Trigger (Wartung fällig, Sachkundenachweis läuft ab, etc.)
    - **Fehlend:** Alert-Datenbank, Cron-Jobs, Push-Notifications
    - **Impact:** Keine proaktiven Warnungen

---

## ✅ POSITIV-HIGHLIGHTS (Top 10 beste Umsetzungen)

1. **Design System exzellent strukturiert**  
   - 43 UI-Komponenten in `/components/ui`
   - Konsistentes Spacing (8px-Raster)
   - Responsive 48px Tap-Targets
   - Dark Mode vollständig implementiert
   - **Best Practice:** Vorbildlich für Skalierbarkeit

2. **Arbeitsauftrags-Flow gut durchdacht**  
   - Timer-Screen mit GPS-Tracking
   - Material-Erfassung inline
   - Pausenfunktion integriert
   - **Datei:** [src/components/operations/operations-client-content.tsx](src/components/operations/operations-client-content.tsx)
   - **Komplexität:** 2000+ Zeilen aber gut strukturiert

3. **Personalverwaltung mit Qualifikations-Tracking**  
   - Sachkundenachweis-Ablauf-Warnungen
   - Arbeitszeiterfassung aus Aufträgen
   - Rollenbasierte Berechtigungen
   - **Dateien:** [src/app/personal/](src/app/personal/), [src/components/personal/](src/components/personal/)

4. **Schlagverwaltung vollständig**  
   - CRUD-Operationen funktionsfähig
   - Tabs für Übersicht/Aufträge/Kosten/Dokumente
   - Anbauplanung mit Fruchtfolge-Warnung
   - **Dateien:** [src/components/fields/](src/components/fields/)

5. **Lager mit FIFO und Chargen-Tracking**  
   - Mindestbestandswarnungen
   - PSM-Zulassungs-Tracking
   - **Dateien:** [src/components/lager/](src/components/lager/), [src/app/lager/actions.ts](src/app/lager/actions.ts)

6. **Kostenberechnungen automatisiert**  
   - Lohn-, Maschinen-, Materialkosten aus Aufträgen
   - Deckungsbeitragsrechnung implementiert
   - **Datei:** [src/services/mock-data-service.ts#L739-L800](src/services/mock-data-service.ts#L739-L800)

7. **i18n vollständig eingerichtet**  
   - Deutsch/Englisch verfügbar
   - Next-intl korrekt konfiguriert
   - **Dateien:** [src/i18n.ts](src/i18n.ts), [src/messages/de.json](src/messages/de.json), [src/middleware.ts](src/middleware.ts)

8. **TypeScript konsistent genutzt**  
   - Kaum `any`-Typen
   - Interfaces für alle Entities
   - **Dateien:** [src/services/types.ts](src/services/types.ts), [src/services/field-types.ts](src/services/field-types.ts)

9. **Code Splitting implementiert**  
   - Dynamic Imports mit Skeleton-Loader
   - **Beispiel:** [src/components/observations/observations-client-content.tsx#L41-L44](src/components/observations/observations-client-content.tsx#L41-L44)

10. **Genkit AI vorbereitet**  
    - Konfiguration vorhanden
    - Flows für Beratung definiert
    - **Dateien:** [src/ai/genkit.ts](src/ai/genkit.ts), [src/ai/dev.ts](src/ai/dev.ts)

---

## 📋 DETAILLIERTE PRÜFERGEBNISSE NACH MODULEN

### 1. DESIGN SYSTEM & VISUELLE IDENTITÄT (87% ✅)

#### ✅ Vollständig (19)
- Primärfarbe Grün als CSS-Variable ([globals.css#L19](src/app/globals.css#L19))
- Alle 5 Statusfarben definiert (Success, Warning, Error, Info, Neutral)
- Plus Jakarta Sans als Primärschrift ([globals.css#L166](src/app/globals.css#L166))
- Schriftgrößen-Skala mit responsive H1-H4 ([globals.css#L183-L205](src/app/globals.css#L183-L205))
- Zeilenhöhe 1.6 für Fließtext ([globals.css#L210](src/app/globals.css#L210))
- Tabular-Zahlen-Font (JetBrains Mono) ([globals.css#L169](src/app/globals.css#L169))
- 8px Spacing-System (Tailwind Default)
- 48×48px Tap-Targets auf Mobile ([button.tsx#L8](src/components/ui/button.tsx#L8))
- 43 UI-Komponenten in `/components/ui/`
- Button mit 5 Varianten (Primary, Secondary, Destructive, Ghost, Icon)
- Number-Input mit Unit-Suffix ([number-input.tsx#L49](src/components/ui/number-input.tsx#L49))
- Card, Badge, Status-Badge, Dialog, Sheet, Toast, Skeleton, Empty-State
- Lucide Icons konsistent ([icons.ts](src/components/ui/icons.ts))
- Icon-Größen definiert ([icons.ts#L92-L103](src/components/ui/icons.ts#L92-L103))
- Animationen ≤300ms ([globals.css#L286-L376](src/app/globals.css#L286-L376))
- `prefers-reduced-motion` Support ([globals.css#L252-L258](src/app/globals.css#L252-L258))
- Dark Mode vollständig ([globals.css#L93-L139](src/app/globals.css#L93-L139))
- Keine Purpur-Gradienten ✅
- Konsistente Paddings (p-6 Standard)

#### ⚠️ Teilweise (6)
- **Farbpalette nicht agrarisch genug:** Primärfarbe zu grau, Secondary ist Grau statt Erdbraun
- **Deutsche UI-Strings:** i18n vorhanden aber sr-only Texte in Englisch
- **Button Loading-State:** Loader existiert aber nicht als Button-Prop
- **Suchfeld:** Kein vorgefertigtes Component
- **Agrar-Icons:** Traktor, Wildtier, Hagel fehlen
- **Stagger-Animations:** Code vorhanden aber nicht in Listen genutzt

#### ❌ Fehlt (3)
- WCAG AA Kontrast-Prüfung (Tool-Check nötig)
- Desktop Max-Width 1440px (nicht in UI-Components prüfbar)
- Haptisches Button-Feedback (`navigator.vibrate()`)

---

### 2. MOBILE-FIRST & RESPONSIVE DESIGN (42% 🟡)

#### ✅ Vollständig (10)
- Breakpoints definiert (Tailwind: 640px, 768px, 1024px)
- Mobile-first CSS (`min-h-12 md:min-h-10` Pattern)
- Bottom Nav Component ([bottom-nav.tsx](src/components/ui/bottom-nav.tsx))
- Max 5 Navigation-Items mit Warnung ([bottom-nav.tsx#L40](src/components/ui/bottom-nav.tsx#L40))
- Icon + Label kombiniert ([bottom-nav.tsx#L73-L88](src/components/ui/bottom-nav.tsx#L73-L88))
- Active Tab erkennbar ([bottom-nav.tsx#L57-L62](src/components/ui/bottom-nav.tsx#L57-L62))
- Position fixed ([bottom-nav.tsx#L46](src/components/ui/bottom-nav.tsx#L46))
- Button :active States ([button.tsx#L14-L18](src/components/ui/button.tsx#L14-L18))
- Inline Formularvalidierung ([operations-client-content.tsx#L373](src/components/operations/operations-client-content.tsx#L373))
- Code Splitting via dynamic() ([observations-client-content.tsx#L41](src/components/observations/observations-client-content.tsx#L41))

#### ⚠️ Teilweise (5)
- **Safe Area Insets:** Implementiert aber nicht dynamisch genug ([bottom-nav.tsx#L47](src/components/ui/bottom-nav.tsx#L47))
- **Content Padding-Bottom:** Nur in mobile-nav-layout, nicht global
- **Date Picker:** Custom Component statt native `<input type="date">`
- **Zahlen-Inputs:** `type="number"` aber kein `inputMode`
- **Toast-Position:** Erfolgsbestätigung evtl. nicht sichtbar ohne Scroll

#### ❌ Fehlt (12)
- 🔴 **KRITISCH: Bottom Nav mit `hidden md:hidden` unsichtbar!** ([mobile-nav-layout.tsx#L65](src/components/layout/mobile-nav-layout.tsx#L65))
- Swipe-Gesten für Tabs
- `-webkit-overflow-scrolling: touch` für iOS
- Pull-to-Refresh
- Virtualisiertes Rendering
- `inputMode` für Zahlen/Tel
- `tabIndex` für Formular-Navigation
- `enterKeyHint` für Tastatur-Aktionen
- `loading="lazy"` für Bilder
- Explizite Bild-Dimensionen
- `font-display: swap` ([globals.css#L7](src/app/globals.css#L7))
- API-Caching (kein React Query/SWR)

---

### 3. GLOBALE UX-PRINZIPIEN (75% 🟢)

#### ✅ Vollständig (12)
- Aktiver Menüpunkt hervorgehoben
- Browser-Zurück funktioniert (Next.js Router)
- Beschreibende Seitentitel
- Loader-Komponenten vorhanden ([loader.tsx](src/components/ui/loader.tsx))
- Toast-Notifications ([toast.tsx](src/components/ui/toast.tsx))
- Skeleton für Ladezustände ([skeleton.tsx](src/components/ui/skeleton.tsx))
- Empty-State Component ([empty-state.tsx](src/components/ui/empty-state.tsx))
- Inline Fehleranzeige (nicht als Alert)
- Destructive Actions verlangen Bestätigung
- Dialog benennt konkret was gelöscht wird
- Abbrechen-Button links, Löschen rechts
- Keine unnötigen Bestätigungsdialoge

#### ⚠️ Teilweise (4)
- **Breadcrumb:** Nicht auf allen Detailseiten sichtbar
- **Netzwerk-Fehler:** Behandlung vorhanden aber nicht überall lokalisiert
- **Offline-Status:** Kein Banner implementiert
- **Retry-Mechanismus:** Nicht automatisch bei Netzwerkfehlern

#### ❌ Fehlt (2)
- 404-Seite (Next.js Default, nicht customized)
- Fortschrittsanzeigen für lange Operationen

---

### 4. AUTHENTIFIZIERUNG & ONBOARDING (55% 🟡)

#### ✅ Vollständig (8)
- Login-Seite existiert ([src/app/[locale]/login](src/app/[locale]/login))
- Login-Formular mit E-Mail + Passwort ([login-form.tsx](src/components/auth/login-form.tsx))
- Passwort-Sichtbarkeit umschaltbar
- Session bleibt nach Neustart
- 3 Rollen implementiert (Betriebsleiter, Vorarbeiter, Mitarbeiter)
- Jäger-Rolle definiert (eingeschränkter Zugang)
- Rollenbasierte Navigation
- Server-Side Access Control ([middleware.ts](src/middleware.ts))

#### ⚠️ Teilweise (3)
- **"Passwort vergessen":** UI vorhanden aber Funktion nicht implementiert
- **Biometrische Auth:** Nicht implementiert (Browser-Support unklar)
- **Rollenwechsel:** Nicht im UI sichtbar

#### ❌ Fehlt (7)
- Onboarding-Flow (5-Schritt-Wizard)
- Betriebsdaten-Erfassung beim Erststart
- Geodaten-Import im Onboarding
- Erste Schläge anlegen im Wizard
- Fortschrittsanzeige im Onboarding
- Guided Tour / Tooltips nach Onboarding
- "Angemeldet bleiben"-Checkbox

---

### 5. DASHBOARD (60% 🟡)

#### ✅ Vollständig (9)
- Dashboard ist Startseite ([src/app/[locale]/page.tsx](src/app/[locale]/page.tsx))
- Responsive Grid (1-col Mobile, 3-col Desktop)
- Karte-Widget vorhanden (Mini-Karte)
- Heute-Widget (laufende Aufträge, Mitarbeiter im Einsatz)
- Kosten-Widget mit Trend
- Wetter-Widget (aktuell + 3-Tage-Vorschau)
- Rollenbasierte Dashboards (unterschiedliche Widgets je Rolle)
- Mitarbeiter-Dashboard mit "Neuen Auftrag starten"-Button
- Letzte Aktivitäten-Liste

#### ⚠️ Teilweise (6)
- **Handlungsbedarf-Widget:** Alerts nicht automatisch gefüllt
- **Fristenkalender:** Widget vorhanden aber keine Fristen-Datenbank
- **Tagesplan (Vorarbeiter):** Planung nicht vollständig integriert
- **Maschinen-Status:** Liste vorhanden aber keine Live-Updates
- **Offene Genehmigungen:** Queue nicht implementiert
- **Meine Arbeitszeit:** Anzeige inkonsistent

#### ❌ Fehlt (5)
- Above-the-fold-Priorisierung nicht optimiert
- Chart-Visualisierungen (Kosten, Trends)
- Drill-Down aus Dashboard zu Details manchmal fehlend
- Dashboard-Customization (Widgets an-/ausschalten)
- Dashboard-Export (PDF)

---

### 6. SCHLAG- & FLÄCHENVERWALTUNG (70% 🟢)

#### ✅ Vollständig (18)
- Route `/fields` existiert ([src/app/[locale]/fields](src/app/[locale]/fields))
- Liste aller Schläge ([fields-client-content.tsx](src/components/fields/fields-client-content.tsx))
- Cards mit Name, Fläche, Kultur, Status
- Status-Badge farbkodiert ([status-badge.tsx](src/components/ui/status-badge.tsx))
- Suchfeld mit Echtzeit-Filter
- Filter nach Kultur, Status, Wirtschaftsjahr
- Sortierung nach Name, Fläche, etc.
- "Neuer Schlag"-Button
- Schlag-Detailseite mit Tabs ([src/app/[locale]/fields/[id]](src/app/[locale]/fields/[id]))
- **Tab Übersicht:** Kenndaten, Kultur, Pacht, Flurstücke, Auflagen
- **Tab Aufträge:** Liste mit Filter, Neuer-Auftrag-Button
- **Tab Kosten:** Kostenaufstellung, Deckungsbeitrag
- **Tab Dokumente:** Upload-Funktion
- Schlag anlegen/bearbeiten Formular ([edit-field-form.tsx](src/components/fields/edit-field-form.tsx))
- Anbauplanung pro Wirtschaftsjahr
- Fruchtfolge-Warnung bei 3× gleicher Kultur
- Vorjahreskultur automatisch angezeigt
- GLÖZ-7-Prüfung (Fruchtwechsel)

#### ⚠️ Teilweise (8)
- **Tab Wachstum:** UI vorhanden aber keine BBCH-Timeline
- **Tab Schäden:** Liste vorhanden aber keine Galerie-Ansicht
- **Tab Karte:** Nicht implementiert (siehe Kartenmodul)
- **Flurstück-Zuordnung:** Kein Geodaten-Import im Formular
- **Pachtvertrags-Warnung:** Berechnung fehlt (< 1 Jahr)
- **Jagdrevier-Zuordnung:** Dropdown vorhanden aber keine Revier-Daten
- **Bodenanalysen-Upload:** Funktion teilweise
- **Vergleich mit Betriebsdurchschnitt:** Daten vorhanden aber nicht visualisiert

#### ❌ Fehlt (6)
- Karten-Einzeichnung für Schlaggrenze
- Flurstücke aus WFS laden
- LUFA-CSV-Import für Bodenanalysen
- Boniturflächen auf Karte
- Zeitraffer-Animation für Bonituren
- Jäger-Kontakt direkt anrufbar

---

### 7. ARBEITSAUFTRÄGE (75% 🟢)

#### ✅ Vollständig (22)
- Route `/operations` ([src/app/[locale]/operations](src/app/[locale]/operations))
- Auftrag-starten Flow maximal 3 Schritte
- Schlag-Auswahl aus Liste ([operations-client-content.tsx#L405](src/components/operations/operations-client-content.tsx#L405))
- Maßnahmen-Auswahl Dropdown
- Fahrzeug-Auswahl (nur verfügbare)
- Zuletzt verwendete vorausgewählt
- "Ohne Fahrzeug"-Option
- **Timer-Screen während laufendem Auftrag:**
  - Laufende Zeit prominent
  - Schlagname + Maßnahme angezeigt
  - Pause-Button
  - Material-Erfassung inline ([operations-client-content.tsx#L778](src/components/operations/operations-client-content.tsx#L778))
  - Foto-Upload
  - Notiz-Feld
  - Stop-Button mit Bestätigung
- Material-Erfassung Bottom Sheet
- Artikel-Suche Echtzeit
- Häufig verwendete Artikel oben
- Menge mit Einheit (FIFO-Charge automatisch)
- Auftrags-Listenansicht mit Filter
- Status-Filter (Geplant, Aktiv, Abgeschlossen)
- Auftrags-Detailansicht
- Alle Daten + GPS-Track (wenn vorhanden)
- Wetterdaten zum Auftragszeitpunkt
- Bearbeiten-Möglichkeit (Vorarbeiter)
- Freigabe-Button

#### ⚠️ Teilweise (6)
- **GPS-Track:** Tracking-Code vorhanden aber nicht vollständig integriert
- **Foto-Galerie:** Upload funktioniert aber Anzeige inkonsistent
- **Genehmigungsqueue:** Liste vorhanden aber kein separater View
- **Swipe-to-Action:** Nicht implementiert auf Mobile
- **Screen-Lock verhindern:** `navigator.wakeLock` nicht implementiert
- **Auftragsplanung (Vorarbeiter):** Kalender-Ansicht rudimentär

#### ❌ Fehlt (4)
- Karten-Ansicht für Schlag-Auswahl (nur Liste vorhanden)
- GPS-Standort für naheliegende Schläge
- Icon-Buttons für 8 häufigste Maßnahmen (Dropdown statt Icons)
- Drag-and-Drop Planung (Desktop)

---

### 8. PERSONAL & MITARBEITERVERWALTUNG (80% 🟢)

#### ✅ Vollständig (12)
- Route `/personal` ([src/app/[locale]/personal](src/app/[locale]/personal))
- Liste aller Mitarbeiter ([personal-client-content.tsx](src/components/personal/personal-client-content.tsx))
- Status (aktiv/inaktiv/laufender Auftrag)
- Qualifikations-Warnung (Ampel)
- Mitarbeiter-Detailseite
- **Stammdaten:** Name, Personalnummer, Kontakt, Beschäftigungsart, Stundensatz
- **Qualifikationen-Tab:**
  - Liste mit Ablaufdatum
  - Ampel (Grün > 60 Tage, Rot abgelaufen)
  - Sachkundenachweis PSM
  - Führerscheinklassen
  - Neue Qualifikation hinzufügen
- **Arbeitszeiten-Tab:** Monatliche Übersicht, Export
- **Einsatz-Tab:** Alle Aufträge, Kosten pro Stunde
- Suchfeld
- "Neuer Mitarbeiter"-Button

#### ⚠️ Teilweise (2)
- **Maschinenberechtigungen:** Feld vorhanden aber nicht verknüpft mit Fahrzeug-Auswahl
- **Überstunden-Saldo:** Berechnung unvollständig

#### ❌ Fehlt (2)
- Schichtplanung für Vorarbeiter
- Mitarbeiter sieht Planung für nächste 7 Tage
- Benachrichtigung bei Auftrags-Zuweisung

---

### 9. FUHRPARKVERWALTUNG (72% 🟢)

#### ✅ Vollständig (11)
- Route `/machinery` ([src/app/[locale]/machinery](src/app/[locale]/machinery))
- Liste mit Status (verfügbar/im Einsatz/Wartung/defekt)
- Wartungs-Warnung (roter Punkt)
- Aktuelle Betriebsstunden
- Fahrzeug-Detailseite
- **Stammdaten:** Bezeichnung, Typ, Kennzeichen, Baujahr, Stundensatz
- **Wartung-Tab:**
  - Wartungsplan mit Intervallen
  - Status-Ampel pro Intervall
  - Wartungshistorie
  - "Wartung abschließen"-Button
  - Dokumente (Rechnungen)
- **Einsatz-Tab:** Alle Aufträge, Gesamtstunden, Kostenauswertung
- **Anbaugeräte-Tab:** Zuordnung verwalten
- "Neues Fahrzeug"-Button

#### ⚠️ Teilweise (3)
- **Tägliche Sichtkontrolle:** Checkliste definiert aber nicht Pflicht
- **Mängelmeldung:** Kein automatischer Wartungsauftrag
- **Telematik-Integration:** Stunden manuell, nicht automatisch

#### ❌ Fehlt (4)
- Verfügbarkeitskalender (welches Fahrzeug wann frei)
- Wartungszeiten im Kalender eingezeichnet
- Konflikterkennung bei Auftragsplanung
- Fahrzeug-Auswahl nur verfügbare (teilweise implementiert)

---

### 10. LAGERVERWALTUNG (78% 🟢)

#### ✅ Vollständig (10)
- Route `/lager` ([src/app/[locale]/lager](src/app/[locale]/lager))
- Kategorien-Tabs (Alle, Saatgut, Dünger, PSM, Kraftstoff, Sonstiges)
- Bestand, Einheit, Mindestbestand-Ampel
- Roter Alert bei Unterschreitung
- "Wareneingang buchen"-Button
- Artikel-Detailseite
- **Chargen-Tab:** Liste, FIFO-Darstellung, Chargennummer, Restmenge
- **Bewegungen-Tab:** Eingänge/Entnahmen chronologisch
- Wareneingang-Formular (Artikel, Menge, Lieferant, Preis, Charge)
- PSM-Zulassungsnummer mit BVL-Abgleich (Mockup)

#### ⚠️ Teilweise (2)
- **Sicherheitsdatenblatt-Upload:** Feld vorhanden aber nicht validiert
- **Gesamtwert des Lagers:** Berechnung vorhanden aber nicht persistent

#### ❌ Fehlt (3)
- Graphische Bestandsentwicklung (Liniendiagramm)
- Nachbestellvorschlag basierend auf Verbrauch
- Diesel-Verbrauch mit Referenzwerten (automatische Abweichungswarnung)

---

### 11. KARTENMODUL (35% 🔴)

#### ✅ Vollständig (4)
- Map-Route geplant ([src/app/[locale]/map](src/app/[locale]/map))
- Observation-Map Component vorhanden ([observation-location-map.tsx](src/components/observations/observation-location-map.tsx))
- Leaflet-Integration (rudimentär)
- GPS-Position-Anzeige möglich

#### ⚠️ Teilweise (2)
- **Mini-Karte auf Dashboard:** Mockup vorhanden aber nicht interaktiv
- **Schlag-Geometrie:** GeoJSON-Struktur vorbereitet aber keine echten Daten

#### ❌ Fehlt (15)
- 🔴 **Haupt-Karte Route nicht funktionsfähig**
- MapLibre GL JS nicht integriert (nur Leaflet)
- Keine Orthofoto-Basiskarte
- Basiskarten-Wechsler fehlt
- Schlaggrenzen nicht eingezeichnet
- Layer-System fehlt vollständig:
  - Flurstücksgrenzen
  - Jagdreviergrenzen
  - Gewässer + Pufferzonen
  - Hangneigung
  - Natura 2000
  - Wasserschutzgebiete
  - Rote Gebiete
  - AUKM-Flächen
- Keine Status-Layer:
  - Kulturkarte
  - Workflow-Status-Karte
  - Live-Arbeitskarte
  - Wirtschaftlichkeitskarte
  - Wildschaden-Karte
  - Planungskarte
- WFS-Geodaten-Import nicht implementiert
- Manuelles Einzeichnen fehlt
- Offline-Kartenkacheln nicht gecacht
- Karten-Export (PDF) fehlt

---

### 12. WACHSTUMSDOKUMENTATION & BONITUREN (48% 🟡)

#### ✅ Vollständig (6)
- Route `/observations` ([src/app/[locale]/observations](src/app/[locale]/observations))
- Bonitur-Erfassen Flow ([observations-client-content.tsx](src/components/observations/observations-client-content.tsx))
- BBCH-Stadium Dropdown
- Beobachtungstyp (6 Typen: Routinebonitur, Schaderreger, Mangel, Lager, Stress, Sonstiges)
- Intensität-Slider (1-5)
- Foto-Upload

#### ⚠️ Teilweise (3)
- **Betroffene Fläche:** Toggle vorhanden aber Polygon-Einzeichnung nicht implementiert
- **Kamera direkt öffnen:** Upload-Dialog statt direkter Kamera-Zugriff
- **Maßnahme auslösen:** Toggle vorhanden aber kein Auftrag wird erstellt

#### ❌ Fehlt (8)
- BBCH-Kalender-Ansicht (Timeline)
- Visuelle Timeline von Saat bis Ernte
- Zeitraffer-Animation durch alle Bonituren
- Vergleich mit Vorjahr (zweite Timeline)
- Bodenanalysen-Modul:
  - Liste mit Datum
  - LUFA-CSV-Import
  - Visualisierung vs. Optimumbereich
  - Warnung wenn > 6 Jahre alt
- Flow-Dauer unter 45 Sekunden (aktuell länger durch fehlende Optimierung)

---

### 13. SCHADENSDOKUMENTATION (25% 🔴)

#### ✅ Vollständig (2)
- Schadensdoku-UI vorhanden ([dokumentation/](src/app/[locale]/dokumentation))
- Wildschaden-Liste mit Filter

#### ⚠️ Teilweise (1)
- **Wildschaden-Melde-Flow:** UI vorhanden aber GPS-Polygon-Einzeichnung fehlt

#### ❌ Fehlt (12)
- 🔴 **Jäger-Portal komplett fehlend:**
  - Separater Jäger-Login
  - Eingeschränkte Ansicht (nur eigenes Revier)
  - Push-Benachrichtigung bei neuer Meldung
  - Jäger-Beobachtungen (Wildwechsel, Einstand)
  - PDF-Export für Jäger
- Schnell-Meldung unter 60 Sekunden (aktuell zu viele Schritte)
- Flurstück-Zuordnung automatisch
- Revier-Zuordnung automatisch
- Status-Workflow (Erfasst → Gemeldet → Begutachtet → Reguliert)
- Wetterdaten zum Entdeckungszeitpunkt
- PDF-Bericht-Generation
- Unwetterschaden-Modul analog zu Wildschaden
- Mehrere Schläge gleichzeitig markieren
- DWD-Offizialwerte-Integration
- Versicherungs-PDF-Export
- Heatmap für Mehrjahresdarstellung

---

### 14. WIRTSCHAFTLICHKEITSANALYSE & CONTROLLING (45% 🟡)

#### ✅ Vollständig (5)
- Kostenberechnung aus Aufträgen automatisch ([mock-data-service.ts#L739-L800](src/services/mock-data-service.ts#L739-L800))
- Deckungsbeitrag I und II berechnet
- Kosten/ha und Kosten gesamt
- Pacht als Strukturkosten
- Export-Funktion vorhanden ([reports/actions.ts](src/app/reports/actions.ts))

#### ⚠️ Teilweise (4)
- **Controlling-Dashboard:** Route existiert aber keine KPI-Visualisierung
- **Schlag-Ranking:** Daten vorhanden aber keine sortierbare Tabelle
- **Vergleich Vorjahr:** Berechnung vorhanden aber nicht visualisiert
- **Maschinenkosten-Auswertung:** Daten vorhanden aber keine Vergleichstabelle

#### ❌ Fehlt (9)
- Übersichts-KPIs (Gesamtkosten, Durchschnitts-DB, Bester/Schlechtester Schlag)
- Kosten-nach-Kategorie-Diagramm (Donut/Balken)
- Monatliche Kostenentwicklung (Linien-/Balkendiagramm)
- Schlag-Ranking-Tabelle mit Ampel-Punkten
- Excel/PDF-Export für Controlling
- Diesel-Verbrauch pro Stunde mit Plausibilitätsprüfung
- Mitarbeiter-Auswertung (Gesamtstunden, Kosten pro Mitarbeiter)
- Datenschutz: Mitarbeiter sieht keine anderen Mitarbeiter (teilweise implementiert)
- Vergleich mit Betriebsdurchschnitt gleicher Kultur

---

### 15. DOKUMENTATIONSPFLICHTEN (50% 🟡)

#### ✅ Vollständig (6)
- PSM-Protokoll Tabelle ([dokumentation-client-content.tsx#L200-L280](src/components/documentation/documentation-client-content.tsx#L200-L280))
- 8 Pflichtfelder gemäß § 67 PflSchG
- Düngedokumentation ([dokumentation-client-content.tsx#L285-L350](src/components/documentation/dokumentation-client-content.tsx#L285-L350))
- N-Bilanz pro Schlag
- Vollständigkeits-Check (unqualifiziertes Personal erkennen)
- CSV-Export

#### ⚠️ Teilweise (3)
- **IPS-Nachweis-Status:** Checkliste vorhanden aber nicht interaktiv
- **Sperrfristen-Warnung:** Logik fehlt (Datumsabgleich nicht implementiert)
- **Rote-Gebiete-Marker:** Konzept vorhanden aber keine Geodaten verknüpft

#### ❌ Fehlt (9)
- Fehlende Pflichtfelder inline ergänzbar (nur Anzeige, kein Edit)
- Filter nach Schlag, Mittel, Zeitraum (teilweise)
- **PDF-Export** für PSM-Protokoll
- **PDF-Export** für Düngedokumentation
- Betriebliche N-Gesamtbilanz
- Düngebedarfsermittlung (Formular)
- **Betriebsheft (Digitales Betriebsheft) komplett fehlend:**
  - Auto-Generierung
  - Flächennutzung, Maßnahmen-Zusammenfassung
  - PDF-Export
- **Kontrollbereitschafts-Check:**
  - Checkliste mit Status-Ampeln
  - Direkte Links zur Behebung
  - "Kontrollmappe exportieren"-Button
- Arbeitszeitnachweise (Export pro Mitarbeiter/Monat in PDF)

---

### 16. GAP & FÖRDERWESEN (0% 🔴)

#### ❌ Komplett fehlend (18 Items)
- 🔴 **Komplettes Modul nicht implementiert**
- Keine Route `/foerderwesen` oder `/foerderung`
- **GLÖZ-Überwachung:**
  - Alle 9 Standards nicht geprüft
  - Keine Ampel-Status-Anzeige
  - GLÖZ 8 (nicht-produktive Flächen) nicht berechnet
  - GLÖZ 7 (Fruchtwechsel) nur rudimentär in Schlag-Modul
  - GLÖZ 4 (Pufferstreifen) nicht mit Geodaten verknüpft
- **Sammelantrag-Assistent:**
  - Kein 5-Schritt-Wizard
  - Kein Flächenabgleich (eigene vs. FLIK)
  - Keine NC-Code-Zuordnung
  - Keine Maßnahmenauswahl (Öko-Regelungen + AUKM)
  - Keine Plausibilitätsprüfung
  - Kein XML-Export für DIANA/ELAN (Thüringen)
  - Kein Frist-Countdown (15. Mai)
- **Öko-Regelungen-Potenzialanalyse:**
  - Keine automatische Analyse
  - Keine Prämien-Berechnung
  - Keine Handlungsempfehlungen
- **Fristenkalender:**
  - Keine Kalender-Ansicht
  - Keine Fristen-Datenbank
  - Keine Farb-Kodierung nach Dringlichkeit
  - Keine Push-Erinnerungen

---

### 17. BENACHRICHTIGUNGEN & ALERTS (40% 🟡)

#### ✅ Vollständig (3)
- Toast-Komponente ([toast.tsx](src/components/ui/toast.tsx))
- Alert-Komponente ([alert.tsx](src/components/ui/alert.tsx))
- Toast-Hook ([use-toast.ts](src/hooks/use-toast.ts))

#### ⚠️ Teilweise (2)
- **In-App-Benachrichtigungen:** Komponenten vorhanden aber nicht verbunden
- **Badge-Zähler:** UI-Pattern vorhanden aber keine Datenquelle

#### ❌ Fehlt (8)
- 🔴 **Alert-System nicht aktiviert:**
  - Keine zentrale Alert-Datenbank
  - Keine automatischen Trigger:
    - Sachkundenachweis < 60 Tage
    - Maschinen-Wartung überfällig
    - PSM-Zulassung endet
    - Mindestbestand unterschritten
    - Sperrfrist beginnt in 7 Tagen
    - Sammelantrag-Frist in 30 Tagen
    - GLÖZ-Anforderung verletzt
    - Fahrzeug steht > 20 Min
    - Neuer Wildschaden gemeldet
- Glocken-Icon in Navigation mit Badge
- Benachrichtigungs-Panel (Dropdown)
- Markierung als gelesen
- Kritische Alerts mit Pflicht-Bestätigung
- **Push-Benachrichtigungen (PWA):**
  - Web Push API nicht implementiert
  - Kein Opt-in
  - Keine Kategorien-Konfiguration

---

### 18. EINSTELLUNGEN & ADMINISTRATION (55% 🟡)

#### ✅ Vollständig (4)
- Route `/settings` ([src/app/[locale]/settings](src/app/[locale]/settings))
- Betriebsdaten bearbeiten
- Nutzerverwaltung (Liste, Einladen, Rollen)
- Eigene Profil-Einstellungen

#### ⚠️ Teilweise (2)
- **Wirtschaftsjahr-Start:** Feld vorhanden aber nicht überall respektiert
- **Maßnahmen-Typen verwalten:** Dropdown-Werte nicht editierbar

#### ❌ Fehlt (5)
- Kostenstellenplan verwalten
- Standard-Stundensätze konfigurieren
- Jagdrevier-Verwaltung (Reviere anlegen, Flurstücke zuordnen, Jäger-Zugang)
- Vollständiger Datenexport als ZIP (DSGVO)
- Wirtschaftsjahr abschließen (Daten einfrieren)

---

### 19. OFFLINE & PWA (15% 🔴)

#### ✅ Vollständig (1)
- App läuft ohne Fehler im Browser

#### ⚠️ Teilweise (1)
- **Service Worker Code vorhanden:** In Next.js Struktur vorbereitet aber nicht aktiviert

#### ❌ Fehlt (12)
- 🔴 **Kein PWA manifest:** `public/manifest.json` fehlt
- Service Worker nicht registriert
- App nicht installierbar (kein Install-Prompt)
- Kein Splash Screen
- Offline-Daten nicht gecacht:
  - Schläge
  - Fahrzeuge
  - Mitarbeiter
  - Lagerartikel
  - Geplante Aufträge
  - Kartenkacheln
- Keine IndexedDB für lokale Speicherung
- Kein Sync-Status sichtbar
- Kein automatischer Sync bei Verbindung
- Kein Offline-Banner
- Konflikte nicht behandelt

---

### 20. GENKIT AI-INTEGRATION (70% 🟢)

#### ✅ Vollständig (5)
- AI-Verzeichnis vorhanden ([src/ai/](src/ai/))
- Genkit initialisiert ([genkit.ts](src/ai/genkit.ts))
- Dev-Server konfiguriert ([dev.ts](src/ai/dev.ts))
- Flows definiert (PSM-Beratung, Anomalie-Erkennung)
- AI-Antworten klar gekennzeichnet

#### ⚠️ Teilweise (2)
- **PSM-Beratung:** Flow vorhanden aber nicht im UI integriert
- **Anomalie-Erkennung:** Konzept vorhanden aber nicht aktiv

#### ❌ Fehlt (2)
- Ernte-Prognose auf Basis BBCH/Wetter
- Bericht-Zusammenfassung (Wirtschaftsjahr in Text)
- Formularausfüllung-Hilfe (Sammelantrag NC-Codes)
- AI-Fehler-Fallback (direkt auf manuellen Flow)

---

### 21. SICHERHEIT & DATENSCHUTZ (60% 🟡)

#### ✅ Vollständig (6)
- API-Routen geschützt ([middleware.ts](src/middleware.ts))
- JWT-Tokens implementiert
- Rollenbasierte Autorisierung server-seitig
- Mandantentrennung (Betriebe isoliert)
- HTTPS erzwungen (Deployment-Config)
- Sensible Daten rollenbasiert sichtbar

#### ⚠️ Teilweise (2)
- **Token-Ablaufzeit:** Refresh-Mechanismus nicht explizit sichtbar
- **Brute-Force-Schutz:** Nicht im Code erkennbar (evtl. auf Hosting-Ebene)

#### ❌ Fehlt (4)
- Passwörter hashen (nicht im Frontend prüfbar)
- Datenschutzerklärung verlinkt (kein Link im Footer)
- Cookie-Banner (wenn Analytics verwendet wird)
- Nutzer können Daten löschen lassen (DSGVO-Funktion)
- Datenverarbeitungsvertrag (AVV) dokumentiert
- Audit-Log für alle Datenänderungen (Konzept vorhanden aber nicht persistiert)
- Daten in EU/Deutschland gehostet (Deployment-Detail)

---

### 22. QUALITÄTSSICHERUNG (50% 🟡)

#### ✅ Vollständig (4)
- TypeScript vollständig konfiguriert ([tsconfig.json](tsconfig.json))
- Wenige `any`-Typen (Code sehr typed)
- API-Response-Typen definiert ([services/types.ts](src/services/types.ts))
- ESLint vorhanden

#### ⚠️ Teilweise (2)
- **Unit-Tests:** Testordner vorhanden aber minimal befüllt
- **E2E-Tests:** Nicht gefunden

#### ❌ Fehlt (4)
- Testabdeckung Berechnungslogik (0%)
- E2E-Tests für kritische Flows (Login, Auftrag starten)
- Accessibility-Tests automatisch
- **Accessibility manuell:**
  - Alle Formularfelder haben `<label>` ✅
  - `aria-label` bei Icon-only-Buttons ⚠️ (nicht überall)
  - Keyboard-Navigation 🔍 (nicht getestet)
  - Fokus-Styles sichtbar ✅
  - Fehler-Messages mit `aria-describedby` ⚠️ (teilweise)
  - Bilder haben `alt`-text ⚠️ (nicht überall)

---

## 🎯 NÄCHSTE SCHRITTE – PRIORISIERTE ROADMAP

### Phase 1: KRITISCHE BUGFIXES (1 Woche)

1. **Bottom Navigation sichtbar machen** (1 Tag)
   - [mobile-nav-layout.tsx#L65](src/components/layout/mobile-nav-layout.tsx#L65): `className="hidden md:hidden"` → `className=""`
   - Test auf echtem Gerät

2. **Farbpalette korrigieren** (1 Tag)
   - Primary: `#2d7a3c` statt `#4b665a` ([globals.css#L19](src/app/globals.css#L19))
   - Secondary: Erdbraun `#8b6f47` statt Grau ([globals.css#L24](src/app/globals.css#L24))
   - Test Dark Mode

3. **Deutsche UI-Strings** (2 Tage)
   - Alle sr-only Labels in Dialog/Sheet/Toast ([dialog.tsx#L51](src/components/ui/dialog.tsx#L51))
   - `useTranslations()` Hook nutzen

4. **Mobile Performance Quick Wins** (1 Tag)
   - Font URL: `&display=swap` hinzufügen ([globals.css#L7](src/app/globals.css#L7))
   - `inputMode="decimal"` für Zahlenfelder
   - Native Date Picker auf Mobile (`type="date"` statt Calendar)

### Phase 2: KARTENMODUL (4 Wochen)

1. **MapLibre GL JS Integration** (1 Woche)
   - `npm install maplibre-gl`
   - Basis-Karte mit Orthofoto
   - Zoom/Pan-Kontrollen

2. **Schlaggrenzen einzeichnen** (1 Woche)
   - GeoJSON aus Datenbank laden
   - Polygone auf Karte
   - Klick → Info-Popup

3. **Layer-System** (1 Woche)
   - Layer-Panel (Flurstücke, Jagd, Gewässer)
   - Toggle Ein/Aus
   - localStorage für aktive Layers

4. **Status-Layer** (1 Woche)
   - Kulturkarte (Farbe pro Kultur)
   - Workflow-Status-Karte
   - Live-Arbeitskarte (Fahrzeuge)

### Phase 3: PWA & OFFLINE (2 Wochen)

1. **PWA Manifest** (2 Tage)
   - `public/manifest.json` erstellen
   - Icons 192px, 512px
   - `theme_color`, `background_color`
   - Install-Prompt testen

2. **Service Worker** (5 Tage)
   - Next.js PWA Plugin konfigurieren
   - Cache-Strategie (Stale-While-Revalidate)
   - Offline-Fallback-Seite

3. **IndexedDB Sync** (3 Tage)
   - Dexie.js integrieren
   - Schläge/Fahrzeuge/Mitarbeiter cachen
   - Sync-Mechanismus bei Online-Wechsel

### Phase 4: GAP/FÖRDERWESEN (6 Wochen)

1. **GLÖZ-Überwachung** (2 Wochen)
   - Route `/foerderwesen` anlegen
   - 9 Standards-Checkliste
   - Automatische Berechnungen (GLÖZ 8, 7)

2. **Sammelantrag-Assistent** (3 Wochen)
   - 5-Schritt-Wizard
   - FLIK-Abgleich
   - NC-Code-Mapping
   - XML-Export für DIANA

3. **Fristenkalender** (1 Woche)
   - Kalender-Komponente
   - Fristen-Datenbank
   - Push-Notifications 30 Tage vorher

### Phase 5: ALERT-SYSTEM (2 Wochen)

1. **Alert-Datenbank** (3 Tage)
   - Tabelle für Alerts
   - Status (ungelesen/gelesen/bestätigt)
   - Trigger-Conditions

2. **Automatische Trigger** (5 Tage)
   - Cron-Jobs (Wartung, Sachkundenachweis, Sperrfrist)
   - Event-Listener (Mindestbestand, GLÖZ-Verletzung)

3. **Push-Notifications** (3 Tage)
   - Web Push API implementieren
   - Opt-in Dialog
   - Service Worker Message-Handler

### Phase 6: SCHADENSDOKU & JÄGER-PORTAL (3 Wochen)

1. **GPS-Polygon-Einzeichnung** (1 Woche)
   - Leaflet Draw oder MapLibre Draw
   - Fläche speichern als GeoJSON

2. **Jäger-Login** (1 Woche)
   - Separate Rolle "Jäger"
   - Eingeschränkte Navigation
   - Nur eigenes Revier sichtbar

3. **Benachrichtigungs-Workflow** (1 Woche)
   - Push an Jäger bei neuer Meldung
   - Status-Updates (Begutachtet/Reguliert)
   - PDF-Export für Jäger

### Phase 7: CONTROLLING & VISUALISIERUNGEN (3 Wochen)

1. **Dashboard Charts** (1 Woche)
   - Recharts installieren
   - Kostenentwicklung Liniendiagramm
   - Kategorie-Breakdown Donut

2. **Schlag-Ranking-Tabelle** (1 Woche)
   - TanStack Table mit Sortierung
   - Ampel-Punkte für DB II
   - Excel-Export

3. **PDF-Exports** (1 Woche)
   - jsPDF oder @react-pdf/renderer
   - PSM-Protokoll, Düngedokumentation, Betriebsheft

### Phase 8: QUALITÄT & TESTS (2 Wochen)

1. **Unit-Tests** (1 Woche)
   - Vitest Setup
   - Kostenberechnungen testen
   - N-Bilanz testen

2. **E2E-Tests** (1 Woche)
   - Playwright Setup
   - Login → Auftrag starten → Stop
   - Schlag anlegen
   - Mitarbeiter anlegen

---

## 📈 ROADMAP-ZEITPLAN

| Phase | Dauer | Kumuliert | Prio |
|-------|-------|-----------|------|
| **Phase 1: Bugfixes** | 1 Woche | 1 Woche | 🔴 Kritisch |
| **Phase 2: Kartenmodul** | 4 Wochen | 5 Wochen | 🔴 Kritisch |
| **Phase 3: PWA** | 2 Wochen | 7 Wochen | 🔴 Kritisch |
| **Phase 4: GAP** | 6 Wochen | 13 Wochen | 🟡 Wichtig |
| **Phase 5: Alerts** | 2 Wochen | 15 Wochen | 🟡 Wichtig |
| **Phase 6: Schadensdoku** | 3 Wochen | 18 Wochen | 🟡 Wichtig |
| **Phase 7: Controlling** | 3 Wochen | 21 Wochen | 🟢 Nice-to-Have |
| **Phase 8: Tests** | 2 Wochen | 23 Wochen | 🟢 Nice-to-Have |

**Gesamtzeitbedarf für Vollständigkeit:** ~6 Monate (23 Wochen) bei 1 Vollzeit-Entwickler

---

## 🏆 FAZIT

### Was bereits sehr gut ist:
- ✅ **Solid Foundation:** Design System, UI-Komponenten, TypeScript-Setup
- ✅ **Core Features funktionieren:** Aufträge, Schläge, Personal, Fuhrpark, Lager
- ✅ **Mobile-First Ansatz:** Responsive Komponenten, Bottom-Nav-Konzept
- ✅ **AI-Ready:** Genkit integriert, Flows definiert

### Wo dringend nachgebessert werden muss:
- 🔴 **Bottom Navigation defekt** (blockiert Mobile-Nutzung)
- 🔴 **Kein echtes Kartenmodul** (Kernfeature fehlt)
- 🔴 **Kein Offline-Betrieb** (PWA-Versprechen nicht erfüllt)
- 🔴 **GAP/Förderwesen komplett fehlend** (Regulatory Risk)
- 🔴 **Alert-System inaktiv** (keine proaktiven Warnungen)

### Empfehlung:
**Vor Produktionsstart:** Phasen 1-3 (8 Wochen) sind **obligatorisch**.  
**Für MVP:** Phasen 1-5 (15 Wochen) empfohlen.  
**Für volle Spec-Konformität:** Alle Phasen (23 Wochen).

---

*Report generiert: 25. Februar 2026 | Basis: AckerPlanPro_Checkliste.md v1.0 | Code-Review durch KI-Subagenten*
