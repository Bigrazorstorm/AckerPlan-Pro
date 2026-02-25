# AgroTrack - Entwicklungs-Fortschritt

**Projekt:** AgroTrack (AckerPlan Pro)  
**Letzte Aktualisierung:** 2025-01-XX  
**Status:** 🚧 In Entwicklung

---

## Projektübersicht

AgroTrack ist eine umfassende Farm-Management-Software für moderne landwirtschaftliche Betriebe. Das Projekt wird in sequentiellen Phasen entwickelt, wobei jedes Modul vollständige Type-Definitionen, Mock-Services, UI-Komponenten und Dokumentation erhält.

**Technologie-Stack:**
- **Framework**: Next.js 14 (App Router)
- **Sprache**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **State**: React Hooks + Context API
- **I18n**: next-intl (Deutsch/Englisch)
- **Backend (geplant)**: Firebase oder Supabase

---

## Phasen-Übersicht

| Phase | Modul                | Status              | Fortschritt | Bemerkungen                          |
|-------|----------------------|---------------------|-------------|--------------------------------------|
| 0     | Design System        | ✅ Fertig           | 100%        | 25+ UI Components, Theming           |
| 1     | UI Components        | ✅ Fertig           | 100%        | shadcn/ui Integration                |
| 2     | Layout & Navigation  | ✅ Fertig           | 100%        | Sidebar, Header, PageLayout          |
| 3     | Fields Module        | ✅ Basis Fertig     | 80%         | Felder-Verwaltung mit Karten         |
| 4     | Operations Module    | ✅ Basis Fertig     | 80%         | Aufträge-Management                  |
| 5     | Personnel Module     | ✅ Basis Fertig     | 80%         | Personalverwaltung                   |
| 6     | Warehouse Module     | ⏳ Geplant          | 0%          | Lagerverwaltung (Saatgut, Dünger)    |
| 7     | Machinery Module     | ⏳ Später           | 0%          | Maschinen & Geräte                   |
| 8     | Database Integration | ⏳ Später           | 0%          | Firebase/Supabase Backend            |
| 9     | Reports & Analytics  | ⏳ Später           | 0%          | Auswertungen, Dashboards             |
| 10    | Mobile Optimierung   | ⏳ Später           | 0%          | PWA, Offline-Mode                    |

---

## Phase 0: Design System ✅

**Status:** Abgeschlossen  
**Fertigstellung:** 2024-Q4

### Ergebnisse

- ✅ shadcn/ui Components installiert und konfiguriert
- ✅ Tailwind CSS mit Custom Theme
- ✅ Design Tokens (Colors, Typography, Spacing)
- ✅ Responsive Breakpoints (Mobile-first)
- ✅ Dark Mode Support (geplant)

### Komponenten (25+)

- Accordion, Alert, AlertDialog, Avatar, Badge, Button
- Calendar, Card, Carousel, Checkbox, Collapsible
- Command, ContextMenu, Dialog, Dropdown, Form
- Input, Label, Menubar, Navigation, Popover
- Progress, Radio, ScrollArea, Select, Separator
- Sheet, Skeleton, Slider, Switch, Table, Tabs
- Textarea, Toast, Toggle, Tooltip

---

## Phase 1: UI Components ✅

**Status:** Abgeschlossen  
**Fertigstellung:** 2024-Q4

### Ergebnisse

- ✅ Custom Components basierend auf shadcn/ui
- ✅ **StatusBadge**: Farbcodierte Status-Anzeige
- ✅ **EmptyState**: Leere Listen mit Call-to-Action
- ✅ **ErrorBoundary**: Fehlerbehandlung
- ✅ **LoadingSpinner**: Konsistente Ladeanzeigen
- ✅ **ConfirmDialog**: Bestätigungsdialoge für kritische Aktionen

### Dateien

```
src/components/ui/
├── status-badge.tsx       # Custom BadgeVariant System
├── empty-state.tsx        # Leere Listen mit Icon & CTA
├── error-boundary.tsx     # React Error Boundaries
└── [25+ shadcn components]
```

---

## Phase 2: Layout & Navigation ✅

**Status:** Abgeschlossen  
**Fertigstellung:** 2024-Q4 - 2025-Q1

### Ergebnisse

- ✅ **Sidebar Navigation**: Responsive mit Icons
- ✅ **Header**: Company Switcher, User Menu
- ✅ **PageLayout**: Konsistenter Page-Wrapper (Title, Description, Children)
- ✅ **Breadcrumbs**: Navigation Context (optional)
- ✅ **Mobile Menu**: Hamburger für Mobile

### Komponenten

```
src/components/layout/
├── header.tsx             # Top Header mit Company Switcher
├── sidebar-nav.tsx        # Haupt-Navigation
├── company-switcher.tsx   # Multi-Tenant Support
└── page-layout.tsx        # Wrapper für alle Pages
```

### Navigation Structure

1. **Dashboard** (/)
2. **Felder** (/fields) - Phase 3
3. **Aufträge** (/operations) - Phase 4
4. **Personal** (/personal) - Phase 5
5. **Lager** (/lager) - Phase 6 (geplant)
6. **Maschinen** (/machinery) - Phase 7 (geplant)
7. **Berichte** (/reports) - Phase 9 (geplant)
8. **Einstellungen** (/settings)

---

## Phase 3: Fields Module ✅

**Status:** Basis-Implementation Fertig  
**Fertigstellung:** 2025-Q1  
**Dokumentation:** [PHASE3_FIELDS.md](PHASE3_FIELDS.md)

### Implementierung

✅ **Type System** (`field-types.ts`):
- Field Interface mit 25+ Properties
- FieldGeometry für Polygon-Koordinaten
- SoilType, CropType, IrrigationType Enums
- FieldStatistics für Auswertungen

✅ **Mock Service** (`mock-field-service.ts`):
- 4 realistische Beispielfelder
- CRUD-Operationen (get, create, update, delete)
- Filterung nach Typ, Kultur, Status
- Statistik-Berechnung (Gesamtfläche, Verteilung)

✅ **UI Component** (`fields-client-content.tsx`):
- Card-Grid Layout (responsive: 1/2/3 Spalten)
- Suche nach Feldname/ID
- Filter nach Kultur (Weizen, Mais, Gerste)
- Status-Badges (Aktiv, Brache, Geplant)
- Empty State mit Create-Aktion

✅ **Page Integration** (`fields/page.tsx`):
- PageLayout Wrapper
- Server Component Pattern
- Internationalisierung (de/en)

### Offene Punkte

- ❌ Karten-Ansicht (Map View mit Leaflet/Mapbox)
- ❌ Feldgrenzen-Editor (Polygon Drawing)
- ❌ Detail-View mit vollständigen Feldinformationen
- ❌ Create/Edit Forms mit Validierung

---

## Phase 4: Operations Module ✅

**Status:** Basis-Implementation Fertig  
**Fertigstellung:** 2025-Q1  
**Dokumentation:** [PHASE4_OPERATIONS.md](PHASE4_OPERATIONS.md)

### Implementierung

✅ **Type System** (`operation-types.ts`):
- 15 OperationType (PLOWING, SOWING, FERTILIZING, SPRAYING, HARVESTING, etc.)
- 5 OperationStatus (PLANNED, IN_PROGRESS, COMPLETED, CANCELLED, POSTPONED)
- Operation mit Machinery-, Personnel-, Material-Assignments
- WeatherConditions, OperationMetrics, OperationCosts

✅ **Mock Service** (`mock-operation-service.ts`):
- 6 realistische landwirtschaftliche Operationen
- Zeitraum: Sept 2025 - Juni 2026
- Mix: 3 COMPLETED, 2 PLANNED, 1 IN_PROGRESS
- Vollständige Ressourcen-Tracking (Maschinen, Personal, Materialien)
- Kosten-Tracking (Maschinen, Kraftstoff, Arbeit, Material)

✅ **UI Component** (`operations-client-content.tsx`):
- Card-Grid mit Operationsdetails
- Suche (300ms Debounce)
- Filter nach Status (Alle, Geplant, In Arbeit, Fertig)
- Status-Badges mit Farben (geplant=blau, läuft=orange, fertig=grün)
- Prioritäts-Sterne ⭐
- Click → Detail-View (noch nicht implementiert)

✅ **Page Integration** (`operations/page.tsx`):
- PageLayout Wrapper
- Übersetzungen

### Highlights

**Beispiel-Operationen:**
1. Frühjahrsbestellung Weizen (12.5 ha, €787.50)
2. Herbstdüngung mit Kompost (60t, €1340)
3. Graslandmahd & Heuwerbung (8.7 ha, 32 Ballen)
4. Silomais Aussaat (PLANNED, GPS-guided)
5. Fungizid-Anwendung (PLANNED, 40L Bravo 500)
6. Bodenbearbeitung mit Kreiselegge (IN_PROGRESS, 84% fertig)

### Integration mit anderen Modulen

- **Fields**: Jede Operation referenziert `fieldId`
- **Personnel**: PersonnelAssignment mit stundenbezogener Abrechnung
- **Warehouse**: MaterialUsage (zukünftig mit WarehouseItem-ID)
- **Machinery**: MachineryAssignment mit Betriebsstunden

### Offene Punkte

- ❌ Detail-View für einzelne Operation
- ❌ Create/Edit Forms
- ❌ Validierung: PSM-Lizenz bei SPRAYING prüfen
- ❌ Kartenansicht mit Feldgrenzen
- ❌ PDF-Export (Arbeitsauftrag, Nachweis)

---

## Phase 5: Personnel Module ✅

**Status:** Basis-Implementation Fertig  
**Fertigstellung:** 2025-01-XX  
**Dokumentation:** [PHASE5_PERSONNEL.md](PHASE5_PERSONNEL.md)

### Implementierung

✅ **Type System** (`personnel-types.ts`):
- 10 PersonnelRole (FARM_MANAGER, FARMER, TRACTOR_DRIVER, HARVEST_HELPER, etc.)
- 7 EmploymentStatus (FULL_TIME, PART_TIME, SEASONAL, MINI_JOB, TRAINEE, etc.)
- 11 QualificationType (PESTICIDE_LICENSE, DRIVER_LICENSE_T, FORKLIFT, etc.)
- Personnel mit Contact, EmergencyContact, Contract, Qualifications
- PersonnelDocument für Verträge/Zeugnisse

✅ **Mock Service** (`mock-personnel-service.ts`):
- 6 realistische Mitarbeiter mit vollständigen Daten
- Thomas Müller (Betriebsleiter, PSM-Lizenz gültig bis 2027)
- Stefan Weber (Traktorfahrer, keine PSM-Lizenz)
- Anna Schmidt (Landwirtin, PSM-Lizenz **ABGELAUFEN** seit Jun 2024!)
- Markus Bauer (Mechaniker Teilzeit, Schweißerschein)
- Ionuț Popescu (Saisonarbeiter Rumänien, Mai-Okt 2025)
- Lisa Friedrich (Auszubildende, 2. Lehrjahr)

✅ **UI Component** (`personal-client-content.tsx`):
- Card-Grid mit Mitarbeiter-Profilen
- Suche nach Name/E-Mail
- Filter nach Rolle (Betriebsleiter, Fahrer, Landwirt, Mechaniker)
- Status-Badges (Vollzeit=grün, Teilzeit=blau, Saisonal=orange)
- Qualifikations-Icons (PSM-Lizenz, Traktor-Führerschein)
- Ablaufwarnungen für Qualifikationen (nächste 60 Tage)

✅ **Page Integration** (`personal/page.tsx`):
- PageLayout Wrapper
- Server Component

### Highlights

**Rechtliche Compliance:**
- ⚠️ Pflanzenschutz-Sachkundenachweis Tracking (§9 PflSchG)
- Ablaufdatum-Verwaltung mit Warnungen
- Dokumenten-Upload für Zertifikate (vorbereitet)

**Vertragsverwaltung:**
- Vollzeit/Teilzeit/Saisonarbeiter
- Stundenlohn vs. Monatsgehalt
- Urlaubstage, Kündigungsfristen
- Befristete Verträge mit Endatum

**Qualifikations-Management:**
- Mehrere Qualifikationen pro Mitarbeiter
- Automatische Gültigkeitsprüfung
- Computed Fields: `hasPesticideLicense`, `hasTractorLicense`
- Expirations Count in Liste (Alert bei Ablauf)

### Integration mit Operations

```typescript
interface PersonnelAssignment {
  personnelId: string;       // → Personnel.id
  personnelName: string;
  role: string;
  hoursWorked?: number;
  hourlyRate?: number;       // → Personnel.contract.hourlyRate
}
```

**Kritische Validierung (TODO):**
Bei `OperationType.SPRAYING` **MUSS** geprüft werden, ob zugewiesenes Personal gültige PSM-Lizenz hat!

### Offene Punkte

- ❌ Detail-View für einzelnen Mitarbeiter
- ❌ Create/Edit Forms
- ❌ Qualifikations-Management UI (Add/Edit/Delete Zertifikate)
- ❌ Dokument-Upload (Verträge, Zeugnisse)
- ❌ Arbeitszeiterfassung (WorkTimeEntry)
- ❌ Dashboard-Widget mit Ablauf-Alerts
- ❌ E-Mail-Benachrichtigungen bei ablaufenden Lizenzen
- ❌ Export (Excel, PDF)

---

## Phase 6: Warehouse Module ⏳

**Status:** Geplant  
**Start:** 2025-Q1  
**Geschätzte Dauer:** 2-3 Wochen

### Geplante Features

**Lagerverwaltung für:**
- 🌾 Saatgut (Weizen, Mais, Gerste, Raps, etc.)
- 💊 Düngemittel (Kalkammonsalpeter, Gülle, Kompost)
- 🧪 Pflanzenschutzmittel (Herbizide, Fungizide, Insektizide)
- 🛢️ Betriebsstoffe (Diesel, AdBlue, Öle)
- 🔧 Ersatzteile

**Kern-Funktionen:**
- Bestands-Tracking (Menge, Einheit)
- Ein-/Ausgänge mit Datum & Referenz (Operation, Lieferung)
- Min/Max-Bestand Warnungen
- Ablaufdatum-Verwaltung (besonders PSM!)
- Lieferanten-Verwaltung
- Kosten-Tracking (Einkaufspreis, Total Value)

**Type System (geplant):**
```typescript
enum WarehouseItemType {
  SEED,
  FERTILIZER,
  PESTICIDE,
  FUEL,
  SPARE_PART,
  OTHER
}

interface WarehouseItem {
  id: string;
  name: string;
  type: WarehouseItemType;
  quantity: number;
  unit: string;  // kg, L, Stk, etc.
  minStock: number;
  maxStock: number;
  currentValue: number;  // €
  expiryDate?: Date;
  supplier?: string;
  storageLocation?: string;
  // ...
}
```

**Integration:**
- Operations: MaterialUsage referenziert WarehouseItem
- Automatischer Bestandsabzug bei Operation COMPLETED
- Reorder-Alerts bei Min-Stock Unterschreitung

---

## Nächste Schritte

### Kurzfristig (1-2 Wochen)

**Phase 5 Vervollständigung:**
1. Personnel Detail-View
2. Personnel Create/Edit Forms
3. Qualifikations-Management UI
4. Dashboard Widget (Personnel Stats + Expiring Licenses)

**Phase 6 Start:**
5. Warehouse Type System
6. Warehouse Mock Service
7. Warehouse List UI
8. Warehouse Page Integration

### Mittelfristig (1-2 Monate)

**Phase 7: Machinery Module**
- Maschinen-Verwaltung (Traktoren, Mähdrescher, Geräte)
- Wartungsplanung & -historie
- Betriebsstunden-Tracking
- Kosten-Tracking (Anschaffung, Wartung, Reparatur)

**Phase 8: Database Integration**
- Migration von Mock-Services zu Firebase/Supabase
- Authentication & Authorization
- Real-time Sync
- Offline-Mode mit Service Worker

**Feld-/Operations-Module Vervollständigung:**
- Detail-Views für Fields & Operations
- Create/Edit Forms mit Validierung
- Karten-Integration (Leaflet/Mapbox)
- PDF-Exporte

### Langfristig (3+ Monate)

**Phase 9: Reports & Analytics**
- Dashboard mit KPIs (Fläche, Produktivität, Kosten)
- Auswertungen nach Zeitraum
- Export-Funktionen (Excel, PDF)
- Diagramme (Charts.js/Recharts)

**Phase 10: Mobile Optimierung**
- Progressive Web App (PWA)
- Offline-Mode
- GPS-Integration für Zeiterfassung
- QR-Code Scanning (Materialentnahme)

**Zusatzfeatures:**
- Dark Mode
- Mehrsprachigkeit (Englisch vollständig)
- Import/Export (CSV, Excel)
- Automatische Backups
- E-Mail-Benachrichtigungen

---

## Technische Schulden & TODOs

### Kritisch ⚠️

1. **PSM-Lizenz Validierung**: Bei Spraying-Operations Personal-Qualifikation prüfen!
2. **Data Privacy (DSGVO)**: Zugriffsrechte auf sensible Personaldaten
3. **Error Handling**: Konsistente Error Boundaries in allen Modulen
4. **Loading States**: Skeleton Loaders überall wo Daten geladen werden

### Wichtig 🔶

1. **Database Schema**: Definieren für Firebase/Supabase Migration
2. **Authentication**: User Login & Permission System
3. **Form Validation**: Zod Schemas für alle Forms
4. **Toast Notifications**: Konsistentes Feedback nach Actions
5. **Internationalisierung**: Englische Übersetzungen vervollständigen

### Nice-to-haves 🔵

1. **Dark Mode**: Design Tokens bereits vorbereitet
2. **Keyboard Shortcuts**: Power-User Features
3. **Drag-and-Drop**: Für Feld-Zuordnung, Planung
4. **Bulk Actions**: Multi-Select für Listen
5. **Version History**: Änderungs-Tracking (Audit Log)

---

## Erkenntnisse & Lessons Learned

### Was funktioniert gut ✅

1. **Mock-First Development**: Ermöglicht schnelle Iteration ohne Backend-Abhängigkeit
2. **Type-Driven Design**: TypeScript Interfaces vor Implementation schreiben hilft enorm
3. **Component Reuse**: StatusBadge, EmptyState, PageLayout reduzieren Code-Duplikation
4. **Realistic Mock Data**: Echte landwirtschaftliche Szenarien helfen beim Testing
5. **Documentation-First**: Markdown-Docs parallel zur Implementation schreiben

### Herausforderungen 🎯

1. **Alte vs. Neue Implementation**: Mehrfach mussten alte Files komplett neu geschrieben werden (z.B. operations-client-content.tsx: 990 → 330 Zeilen)
2. **Type Complexity**: Nested Interfaces (Operation, Personnel) werden schnell unübersichtlich
3. **Responsive Design**: Cards sind besser als Tables für Mobile, aber Design-Patterns noch nicht 100% konsistent
4. **German Localization**: Mischung aus Englisch (Code) und Deutsch (UI) manchmal verwirrend

### Best Practices 📋

1. **Naming Convention**: 
   - Types: PascalCase (Personnel, OperationType)
   - Files: kebab-case (personnel-types.ts, mock-personnel-service.ts)
   - Components: PascalCase (PersonalClientContent)

2. **File Structure**:
   ```
   src/
   ├── services/
   │   ├── [module]-types.ts      # Type Definitions
   │   └── mock-[module]-service.ts
   ├── components/
   │   └── [module]/
   │       └── [module]-client-content.tsx
   └── app/
       └── [locale]/
           └── [module]/
               └── page.tsx
   ```

3. **Component Pattern**:
   - Server Component (Page) → Client Component (Content)
   - Search mit 300ms Debounce
   - Skeleton Loader während Loading
   - Empty State bei leeren/gefilterten Listen

4. **Mock Service Pattern**:
   - Simulated Network Delay (200-400ms)
   - Realistic Data mit deutschen Namen/Adressen
   - CRUD + Statistics Methoden
   - Singleton Export: `export const mockXService = new MockXService()`

---

## Dokumentation

### Verfügbare Dokumente

1. **README.md** - Projekt-Übersicht & Setup
2. **PROGRESS.md** (dieses Dokument) - Entwicklungs-Fortschritt
3. **PHASE3_FIELDS.md** - Fields Module Dokumentation
4. **PHASE4_OPERATIONS.md** - Operations Module Dokumentation
5. **PHASE5_PERSONNEL.md** - Personnel Module Dokumentation
6. **AckerPlanPro_Konzept.md** - Ursprüngliches Konzeptdokument
7. **AckerPlanPro_Checkliste.md** - Feature-Checkliste

### Geplante Dokumente

- PHASE6_WAREHOUSE.md
- PHASE7_MACHINERY.md
- DATABASE_SCHEMA.md
- API_REFERENCE.md
- DEPLOYMENT_GUIDE.md

---

## Team & Kontakt

**Entwicklung:** AgroTrack Development Team  
**Konzept:** Basierend auf AckerPlanPro_Konzept.md  
**Technologie-Beratung:** GitHub Copilot & Claude

---

**Letzte Aktualisierung:** 2025-01-XX  
**Nächste Review:** Nach Phase 6 Fertigstellung
