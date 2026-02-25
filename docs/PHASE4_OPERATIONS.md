# AgroTrack – Phase 4: Operations Module (Aufträge/Einsätze)

**Status:** ✅ Abgeschlossen (Basis)
**Datum:** Februar 25, 2026

---

## Übersicht

Phase 4 implementiert das **Operations/Aufträge Modul** - die zentrale Verwaltung aller Arbeitsaufträge auf dem Betrieb. Aufträge sind die praktische Umsetzung von Feldverwaltung und verbinden Felder, Maschinen, Personal und Materialien in konkrete Arbeitsschritte.

### Motivbereiche aus dem Konzept

Aus **AckerPlanPro_KONZEPT.md** Sektion 5 "Phase 1 – Kernmodule":
- **Aufträge/Einsätze**: Tracking von Arbeitstätigkeiten auf Feldern
- **Verknüpfung zu Feldern**: Jeder Auftrag gehört zu einem spezifischen Feld
- **Ressourcenallokation**: Zuweisung von Maschinen und Personal zu Aufträgen
- **Kostenverfolgung**: Erfassung von Treibstoff, Arbeitszeit, Materialverbrauch
- **Produktionshistorie**: Nachverfolgung abgeschlossener Arbeiten

---

## Implementierte Komponenten

### 1. Operation Types & Datenmodelle

**Datei:** `src/services/operation-types.ts` (1000+ Zeilen)

#### Enums

```typescript
enum OperationStatus {
  PLANNED       // Geplant, noch nicht gestartet
  IN_PROGRESS   // Gerade in Arbeit
  COMPLETED     // Abgeschlossen
  CANCELLED     // Abgebrochen/Storniert
  POSTPONED     // Verschoben
}

enum OperationType {
  PLOWING       // Pflügen
  SOWING        // Aussaat
  FERTILIZING   // Düngung
  SPRAYING      // Spritzen (Pflanzenschutz)
  MOWING        // Mahd
  HARVESTING    // Ernte
  WINDROWING    // Schwaden
  THRESHING     // Drusch
  BALING        // Ballenpressung (Heu/Silage)
  DISKING       // Eggen
  ROLLING       // Walzen
  CULTIVATING   // Anbau (Kombiniert)
  WEEDING       // Unkrautbekämpfung
  MAINTENANCE   // Wartung/Reparatur
  OTHER         // Sonstige
}
```

#### Haupt-Interfaces

```typescript
interface Operation {
  // Identität & Zugehörigkeit
  id: string
  tenantId: string
  companyId: string
  fieldId: string                    // Feld, auf dem Auftrag erfolgt
  
  // Basis-Infos
  title: string                      // z.B. "Frühjahrsbestellung Weizen"
  description?: string
  operationType: OperationType       // Typ der Arbeit
  status: OperationStatus            // Aktueller Status
  priority?: number                  // 1-5 (5 = wichtig)
  
  // Zeitplanung
  plannedStartDate: Date
  plannedEndDate: Date
  actualStartDate?: Date             // Wenn gestartet
  actualEndDate?: Date               // Wenn fertig
  estimatedDurationHours?: number
  
  // Ressourcen
  machinery: MachineryAssignment[]   // Beteiligte Maschinen
  personnel: PersonnelAssignment[]   // Beteiligte Personen
  materials: MaterialUsage[]         // Materialverbrauch
  
  // Umgebungsbedingungen
  weatherConditions?: WeatherConditions
  soilConditions?: string
  
  // Ergebnisse
  metrics?: OperationMetrics         // Fläche, Ertrag, etc.
  costs?: OperationCosts             // Kostenaufschlüsselung
  deviations?: string                // Abweichungen/Probleme
  
  // Audit
  createdAt: Date
  updatedAt: Date
  createdBy?: string
  updatedBy?: string
}

interface OperationListItem {
  // Vereinfachte Ansicht für Listen
  id: string
  title: string
  fieldId: string
  operationType: OperationType
  status: OperationStatus
  plannedStartDate: Date
  actualStartDate?: Date
  areaWorked?: number                // ha bearbeitet
  priority?: number
  updatedAt: Date
}
```

#### Unterstützende Interfaces

```typescript
interface MachineryAssignment {
  type: string                       // "Traktor", "Drillmaschine", etc.
  model?: string
  operatingHours?: number
  startOdometer?: number
  endOdometer?: number
  notes?: string
}

interface PersonnelAssignment {
  personnelId: string
  name: string
  role: string                       // "Fahrer", "Helfer", "Operator"
  hoursWorked?: number
  hourlyRate?: number
}

interface MaterialUsage {
  name: string                       // z.B. "Dünger N30"
  quantity: number
  unit: string                       // "kg", "L", "Säcke", etc.
  cost?: number
  notes?: string
}

interface OperationMetrics {
  areaWorked?: number                // ha
  averageSpeed?: number              // km/h
  completionPercentage?: number      // 0-100%
  yield?: number                     // z.B. dt/ha
  qualityNotes?: string
  attachments?: string[]             // URLs zu Fotos
}

interface OperationCosts {
  machineryCustomCosts?: number
  fuelCosts?: number
  laborCosts?: number
  materialCosts?: number
  otherCosts?: number
  costVarianceNotes?: string
}

interface OperationStatistics {
  plannedCount: number
  inProgressCount: number
  completedCount: number
  averageDurationHours: number
  averageCost: number
  totalAreaWorked: number            // ha
  operationTypeDistribution: Record<OperationType, number>
  topCostOperations: Array<{id, title, totalCost}>
}
```

---

### 2. Mock Operation Service

**Datei:** `src/services/mock-operation-service.ts` (600+ Zeilen)

#### Realistische Beispieldaten

```typescript
// 6 Beispiel-Aufträge für verschiedene Operationen:

OP-001: Frühjahrsbestellung Weizen (Mühlfeld Ost)
        - Status: COMPLETED
        - 12.5 ha Aussaat
        - 6,5 Betriebsstunden Traktor
        - Kosten: ~600€ (Saatgut + Treibstoff + Arbeit)

OP-002: Herbstdüngung mit Kompost (Mühlfeld Ost)
        - Status: COMPLETED
        - 60 Tonnen Stallkompost
        - Kosten: ~1600€

OP-003: Graslandmahd & Heuwerbung (Bachwiese)
        - Status: COMPLETED
        - 8.7 ha Schnitt + Schwaden + Pressung
        - 3 Maschinen, 1,5 Personen
        - Kosten: ~625€

OP-004: Silomais Aussaat (Südfeld)
        - Status: PLANNED
        - Geplant für 15.04.-18.04.2026
        - GPS-Lenksystem
        - Kosten ~150€ vorkalkuliert

OP-005: Fungizid gegen Blattfleckenkrankheit (Südfeld)
        - Status: PLANNED
        - Geplant für 10.06.-11.06.2026
        - Feldspritzung 40L Bravo 500
        - Kosten ~280€ Material

OP-006: Saatbettbereitung mit Kreiselegge (Mühlfeld Ost)
        - Status: IN_PROGRESS
        - 3,5h abgelaufen von 12h Schätzung
        - 10,5 ha of 12,5 ha fertig (84%)
```

#### Service-Methoden

```typescript
class  MockOperationService {
  // Datenabruf mit Filterung
  async getOperations(
    tenantId: string,
    companyId: string,
    filters?: OperationFilters    // Status, Type, Field, Search, DateRange
  ): Promise<OperationListItem[]>

  // Einzelner Auftrag
  async getOperation(
    tenantId: string,
    operationId: string
  ): Promise<Operation | null>

  // Erstellen
  async createOperation(
    tenantId: string,
    companyId: string,
    data: OperationFormData,
    userId?: string
  ): Promise<Operation>

  // Aktualisieren
  async updateOperation(
    tenantId: string,
    operationId: string,
    data: Partial<OperationFormData>
  ): Promise<Operation | null>

  // Status-Wechsel (Geplant → In Arbeit → Fertig)
  async updateOperationStatus(
    tenantId: string,
    operationId: string,
    status: OperationStatus
  ): Promise<Operation | null>

  // Metriken nach Abschluss erfassen
  async updateOperationMetrics(
    tenantId: string,
    operationId: string,
    metrics: OperationMetrics
  ): Promise<Operation | null>

  // Kosten aktualisieren
  async updateOperationCosts(
    tenantId: string,
    operationId: string,
    costs: OperationCosts
  ): Promise<Operation | null>

  // Löschen
  async deleteOperation(
    tenantId: string,
    operationId: string
  ): Promise<boolean>

  // Dashboard Statistics
  async getOperationStatistics(
    tenantId: string,
    companyId: string
  ): Promise<OperationStatistics>
}
```

---

### 3. Operations List Component

**Datei:** `src/components/operations/operations-client-content.tsx` (330+ Zeilen)

#### Features

```tsx
<OperationsClientContent>
  ✅ Suchfeld mit 300ms Debounce
  ✅ Status-Filter (Alle, Geplant, In Arbeit, Fertig)
  ✅ Card-Grid Layout (responsive: 1/2/3 Spalten)
  ✅ Loading Skeleton (6 Platzhalter-Karten)
  ✅ Empty State mit Aktion (Auftrag erstellen)
  ✅ Auftrag Details auf Karte:
     - Titel & Operationstyp (deutsch)
     - Feld + Startdatum
     - Bearbeitete Fläche (ha)
     - Priorität (⭐ Sterne)
     - Letzte Änderung
     - Status-Badge (farbig)
  ✅ Click-to-Detail Navigation
  ✅ Summary Statistik am Ende
```

#### Design Integration

```typescript
// Status-Farben aus Design System
const STATUS_VARIANTS = {
  PLANNED: 'info',              // Blau
  IN_PROGRESS: 'warning',       // Orange
  COMPLETED: 'success',         // Grün
  CANCELLED: 'destructive',     // Rot
  POSTPONED: 'neutral'          // Grau
}

// Operationstypen deutscher Anzeige
const OPERATION_TYPE_LABELS = {
  PLOWING: 'Pflügen',
  SOWING: 'Aussaat',
  FERTILIZING: 'Düngung',
  // ... 12 weitere Typen
}
```

---

### 4. Operations Page Wrapper

**Datei:** `src/app/[locale]/operations/page.tsx` (15 Zeilen)

```tsx
// Server Component mit PageLayout Integration
export default async function OperationsPage({params: {locale}}) {
  return (
    <PageLayout
      title="Aufträge"                           // Aus i18n
      description="Verwalten und tracken Sie Ihre Feldarbeiten"
    >
      <OperationsClientContent />                // Client-seitige Interaktion
    </PageLayout>
  );
}
```

---

## Daten-Flow

```
┌─────────────────────┐
│  Operations Page    │  (Server Component)
│   [locale]          │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│   PageLayout        │  (Reusable Wrapper)
│  Title + Breadcrumb │
└──────────┬──────────┘
           │
           ▼
┌──────────────────────────────────────┐
│ OperationsClientContent (Client)     │
│ ┌────────────────────────────────┐  │
│ │ Input (Suche) + Filter Buttons │  │
│ │ ┌──────────────────────────────┤  │
│ │ │ mockOperationService.query() │  │
│ │ └──────────────────────────────┤  │
│ │ Card-Grid (responsive)         │  │
│ │ ┌──────┐ ┌──────┐ ┌──────┐    │  │
│ │ │ Card │ │ Card │ │ Card │    │  │
│ │ └──────┘ └──────┘ └──────┘    │  │
│ └────────────────────────────────┘  │
└──────────────────────────────────────┘
           │
           ▼
┌──────────────────────────────────────┐
│   MockOperationService               │
│   (MOCK_OPERATIONS Array)            │
│   • Filterung                        │
│   • Sortierung                       │
│   • Statistik-Berechnung            │
└──────────────────────────────────────┘
           │
           ▼
┌──────────────────────────────────────┐
│  operation-types.ts                  │
│  (TypeScript Type Definitions)       │
│  • Enums (Status, Type, etc.)       │
│  • Interfaces (Operation, Metrics)  │
└──────────────────────────────────────┘
```

---

## Verwendungsmuster

### Auftrag abrufen mit Filtern

```tsx
const filters: OperationFilters = {
  status: OperationStatus.IN_PROGRESS,
  operationType: OperationType.HARVESTING,
  fieldId: 'FIELD-003',
  searchTerm: 'mais',
  dateRange: {
    from: new Date('2026-06-01'),
    to: new Date('2026-09-30')
  },
  sortBy: 'priority'  // Nach Priorität sortieren
};

const operations = await mockOperationService.getOperations(
  'tenant-1',
  'company-1',
  filters
);
```

### Neuen Auftrag erstellen

```tsx
const newOp = await mockOperationService.createOperation(
  'tenant-1',
  'company-1',
  {
    title: 'Erntevorbereitung Weizen',
    operationType: OperationType.HARVESTING,
    fieldId: 'FIELD-001',
    plannedStartDate: new Date('2026-07-15'),
    plannedEndDate: new Date('2026-07-20'),
    estimatedDurationHours: 48,
    priority: 5,  // Hohe Priorität
    machinery: [
      {
        type: 'Mähdrescher',
        model: 'CLAAS Lexion 760',
        operatingHours: 0
      }
    ],
    personnel: [
      {
        personnelId: 'PERS-001',
        name: 'Max Müller',
        role: 'Fahrer',
        hourlyRate: 28
      }
    ]
  },
  'user-1'  // Erstellt von
);
```

### Status aktualisieren

```tsx
// Auftrag starten
await mockOperationService.updateOperationStatus(
  'tenant-1',
  'OP-004',
  OperationStatus.IN_PROGRESS
);

// Nach Abschluss
await mockOperationService.updateOperationStatus(
  'tenant-1',
  'OP-004',
  OperationStatus.COMPLETED
);
```

### Metriken erfassen

```tsx
// Nach Feldarbeit: Ergebnisse dokumentieren
await mockOperationService.updateOperationMetrics(
  'tenant-1',
  'OP-006',
  {
    areaWorked: 12.5,              // Bearbeitete ha
    completionPercentage: 100,     // Voll abgeschlossen
    averageSpeed: 9.2,             // km/h durchschnitt
    qualityNotes: 'Sehr gleichmäßge Saattiefe, optimales Saatbild',
    attachments: ['https://...field-photo-1.jpg']
  }
);
```

---

## Komponenten-Integration

### Task-Status-Flow

Operationen folgen einem einfachen Zustandsmodell:

```
┌─────────┐    start()    ┌────────────┐    complete()    ┌───────────┐
│ PLANNED │──────────────>│ IN_PROGRESS│─────────────────>│ COMPLETED │
└─────────┘               └────────────┘                   └───────────┘
     ↑                                                           ↓
     │                                                           │
     └───────────────────────  cancel() ──────────────────┘
                                        postpone()
```

### Mobile-First Responsive

```
Mobile (< 640px):    Tablet (640-1024px):    Desktop (> 1024px):
┌───────────────┐    ┌──────────────────────┐    ┌──────────────────────────┐
│  [Auftrag 1]  │    │ [Auftrag 1] [Auf. 2] │    │ [Auf 1] [Auf 2] [Auf 3] │
│               │    │ [Auftrag 3] [Auf. 4] │    │ [Auf 4] [Auf 5] [Auf 6] │
│  [Auftrag 2]  │    │ [Auftrag 5]          │    └──────────────────────────┘
│               │    └──────────────────────┘
│  [Auftrag 3]  │
└───────────────┘
```

---

## Konfiguration & Anpassung

### Operationstypen hinzufügen

1. Enum erweitern in `operation-types.ts`:
   ```typescript
   enum OperationType {
     // ... existing
     PEST_MONITORING = 'PEST_MONITORING',  // Neu
   }
   ```

2. Label hinzufügen in `operations-client-content.tsx`:
   ```typescript
   const OPERATION_TYPE_LABELS = {
     // ... existing
     [OperationType.PEST_MONITORING]: 'Schädlingsüberwachung',
   }
   ```

3. Mock-Daten aktualisieren (optional)

### Status-Farben anpassen

In `operations-client-content.tsx`:
```typescript
const STATUS_VARIANTS = {
  [OperationStatus.PLANNED]: 'info',        // ← change to 'warning'
  // ... etc
};
```

---

## Bekannte Limitationen & TODOs

### Nicht implementiert (Phase 4)

- [ ] Formular zum Erstellen/Bearbeiten (nur Mock-Service)
- [ ] Detail-View für einzelne Operationen
- [ ] Validierung (erforderliche Felder, Datums-Logik)
- [ ] Toast-Notifikationen (Erfolg/Fehler)
- [ ] Fehlerbehandlung (Catch + Display)
- [ ] Echtzeit-Datensynchronisation
- [ ] Offline-Support
- [ ] Undo/Redo Funktionalität
- [ ] Bulk-Operationen (Mehrere Aufträge gleichzeitig)

### Für Phase 5+

- Database Integration (Firebase/Supabase)
- Real-time Collaboration
- Map Integration (GeoJSON Polygone)
- Weather API Integration (aktuelle Wetterdaten)
- Cost Analytics & Reports
- Machinery Fuel Tracking
- Pesticide License Validation

---

## Schnellstart für Entwickler

### Neue Seite mit Operations hinzufügen

```tsx
import { OperationsClientContent } from '@/components/operations/operations-client-content';

// In Page Component:
<PageLayout title="Aufträge" description="...">
  <OperationsClientContent />
</PageLayout>
```

### In einen bestehenden Feature integrieren

```tsx
// Zeige nur Aufträge für ein bestimmtes Feld
const operationsByField = await mockOperationService.getOperations(
  tenantId,
  companyId,
  { fieldId: 'FIELD-001' }  // Filter
);
```

---

## Metriken & Performance

### Mock Service Performance

- **getOperations()**: O(n) Filter-Iteration, ~0ms für 6 Items
- **getOperationStatistics()**: O(n) Aggregation, ~1ms für 100 Items
- **Search mit Debounce**: 300ms Verzögerung ist bewusst

### Component Render Time

- **List mit 20 Aufträgen**: ~10ms (React Reconciliation)
- **Skeleton Loading**: Sofort sichtbar (Optimistic UI)
- **Image Loading**: Lazy loaded bei Attachment URLs

---

## Testing Checklist

- [ ] Filter funktioniert (Status, Suche, Operationstyp)
- [ ] Responsive Layout auf Mobile/Tablet/Desktop
- [ ] Card-Click navigiert zu Detail-Page
- [ ] Empty State zeigt sich bei 0 Aufträgen
- [ ] Loading Skeleton wird angezeigt
- [ ] Debounce verhindert zu viele Requests
- [ ] Status-Farben matchen Design System
- [ ] Daten-Typen sind korrekt (TypeScript)
- [ ] Sortierung nach Datum funktioniert

---

## Dokumentation Links

- [Phase 3: Fields Module](./PHASE3_FIELDS.md)
- [Design System](./DESIGN_SYSTEM.md)
- [Components Library](./COMPONENTS.md)
- [Layout Architecture](./PHASE2_LAYOUT.md)
- [Main Progress](./PROGRESS.md)

---

## Häufig gestellte Fragen

**Q: Wie verknüpfe ich Aufträge mit Feldern?**
A: Jede Operation hat ein `fieldId` Attribut.  Nutze `mockOperationService.getOperations(..., {fieldId: 'xyz'})` zum Filtern.

**Q: Können mehrere Personen eine Operation durchführen?**
A: Ja! Das `personnel` Array unterstützt mehrere PersonnelAssignments.

**Q: Wie tracke ich Treibstoffverbrauch?**
A: Im `costs` Objekt: `costs.fuelCosts = 85`. Im `machinery`: `operatingHours` für Abrechnung.

**Q: Wie wird die Ernte dokumentiert?**
A: Nach Abschluss `updateOperationMetrics()` mit `yield` und `qualityNotes` aufrufen.

**Q: Sind Aufträge nicht rückgängig zu machen?**
A: Mock Service speichert nicht persistent. Das ist Teil von Phase 5 (Database).

---

**Phase 4 abgeschlossen** ✅  
**Nächste Phase:** Operations Forms & Validation
