# Flurstücke & Feldblöcke - Datenstruktur und Verwaltung

## Übersicht

Das System wurde um zwei neue Konzepte erweitert, um eine realistische Abbildung von Agrarflächen zu ermöglichen:

### 1. **Flurstücke (Cadastral Parcels)**
- Rechtliche Grundeinheiten aus dem Flurstückverzeichnis
- Eindeutig durch Landkreis, Gemeinde, Gemarkung und Flurstücksnummer identifiziert
- Basisdaten:
  - Name/Anzeigename (z.B. "Flurstück 123/45")
  - County (Landkreis), Municipality (Gemeinde), District (Gemarkung)
  - Parcel Number (Flurstücksnummer)
  - Area (Fläche in ha)
  - Owner (Eigentümer)
  - Leasing Status (Eigentum, Pacht, Sonstiges)
  - GeoJSON Polygon für Kartendarstellung

### 2. **Feldblöcke (Field Blocks)**
- Funktionale Einheiten für Förderanträge (ELER, Direktzahlungen, GAP)
- Auch als "Referenzparzellen" oder "DGK-Lw" bekannt
- Aggregieren mehrere Schläge und Flurstücke
- Basisdaten:
  - Name (z.B. "Feldblock A")
  - Reference Number (z.B. "DE-123456-001")
  - DGK-Lw Number (für GAP-Compliance)
  - Total Area (Gesamtfläche)
  - Subsidy Eligible, GAP Compliant
  - Environmental Zone Status
  - Restrictions (z.B. "3% Brachenbrache")

### 3. **Schläge (Fields)**
- Bewirtschaftete Einheiten, die aus einem oder mehreren Flurstücken bestehen
- Neue Felder:
  - `cadastralParcelIds`: Array von Flurstück-IDs
  - `fieldBlockId`: Zugeordneter Feldblock (optional)

## Datenbeziehungen

```
Feldblock (1:n)
    ├─ Schlag (1:n)
    │   ├── mehrere Flurstücke
    │   ├── ein Feldblock
    │   └── Anbaudaten (Kultur, Termin, etc.)
    │
    └─ Flurstücke (direkt zugeordnet)

Flurstück (1:n)
    └─ kann in mehreren Schlägen vorkommen
```

## API und Services

### DataService Interface

```typescript
// Flurstücke
getCadastralParcels(tenantId, companyId): Promise<CadastralParcel[]>
getCadastralParcelById(tenantId, companyId, parcelId): Promise<CadastralParcel | null>
addCadastralParcel(tenantId, companyId, parcelData): Promise<CadastralParcel>
updateCadastralParcel(tenantId, companyId, parcelId, parcelData): Promise<CadastralParcel>
deleteCadastralParcel(tenantId, companyId, parcelId): Promise<void>

// Feldblöcke
getFieldBlocks(tenantId, companyId): Promise<FieldBlock[]>
getFieldBlockById(tenantId, companyId, blockId): Promise<FieldBlock | null>
addFieldBlock(tenantId, companyId, blockData): Promise<FieldBlock>
updateFieldBlock(tenantId, companyId, blockId, blockData): Promise<FieldBlock>
deleteFieldBlock(tenantId, companyId, blockId): Promise<void>
```

## Implementierungen

### MockDataService ✅
Vollständig implementiert mit Beispieldaten:
- 4 Flurstücke für company-456
- 2 Feldblöcke für company-456
- Fields aktualisiert mit cadastralParcelIds und fieldBlockId

### MySqlDataService ⚠️
Platzhalter-Implementierungen vorhanden (returns empty data)
- Müssen mit echten MySQL-Queries implementiert werden

### SupabaseDataService ⚠️
Platzhalter-Implementierungen vorhanden (returns empty data)
- Müssen mit echten Supabase-Queries implementiert werden

## Geschäftsregeln

1. **Flurstück-Löschung**: Ein Flurstück kann nur gelöscht werden, wenn es nicht in einem Schlag verwendet wird
2. **Feldblock-Löschung**: Ein Feldblock kann nur gelöscht werden, wenn keine Schläge zugeordnet sind
3. **Schlag-Zusammensetzung**: Ein Schlag muss aus mindestens einem Flurstück bestehen
4. **Feldblock-Zuordnung**: Optional (ein Schlag kann ohne Feldblock existieren)

## Geplante UI-Komponenten

Die folgenden Komponenten sollten implementiert werden:

### 1. Flurstücke-Verwaltung
- Datatable mit Flurstücken
- Create/Edit Form für Flurstücke
- Map-View zur Visualisierung von Flurstück-Geometrie
- Import-Funktionalität (z.B. aus ALKIS-Daten)

### 2. Feldblock-Verwaltung
- Datatable mit Feldblöcken
- Create/Edit Form für Feldblöcke
- Multi-Select für Schläge und Flurstücke
- GAP/Subsidy Status Visualisierung

### 3. Feld-Form Erweiterung
- Multi-Select für Flurstück-Auswahl
- Dropdown für Feldblock-Zuordnung
- Automatische Flächenberechnung aus Flurstücken
- Validierung: Mindestens 1 Flurstück erforderlich

## Mock-Daten

Für Demonstrations- und Entwicklungszwecke sind folgende Daten in MockDataService vorhanden:

### Flurstücke (company-456)
- parcel-1: Flurstück 123/45 (8.5ha, Max Mustermann)
- parcel-2: Flurstück 123/46 (6.7ha, Max Mustermann)
- parcel-3: Flurstück 124/1 (22.0ha, Agrargenossenschaft eG, gepachtet)
- parcel-4: Flurstück 150/12 (5.7ha, Max Mustermann)

### Feldblöcke (company-456)
- block-1: "Feldblock A" (37.9ha, 3 Felder, 3 Flurstücke)
- block-2: "Feldblock B" (22.0ha, 1 Feld, 1 Flurstück, Umweltzone)

## Typ-Definitionen

Siehe [field-types.ts](../src/services/field-types.ts) für vollständige TypeScript-Definitionen:
- `CadastralParcel`
- `CadastralParcelFormData`
- `FieldBlock`
- `FieldBlockFormData`
- Aktualisierte `Field` und `FieldFormData` Interfaces

## Nächste Schritte

1. **UI-Komponenten entwickeln** für Flurstück- und Feldblock-Verwaltung
2. **Import-Funktionalität** für Flurstücke (z.B. aus ALKIS, EFIS-Daten)
3. **Automatische Flächenberechnung** bei Feldblock-Erstellung
4. **GAP-Compliance-Checker** ausbauen
5. **Reportings erweitern** (nach Feldblock, Flurstück)
6. **Integrations-Tests** für neue Geschäftsregeln

## Kartendarstellung

✅ Flurstücke werden mit ihren echten Umrandungen in der Karte angezeigt
- GeoJSON-Polygone als Basis für korrekte Geometrien
- Orange gestrichelte Umrandung (#ff9800) für Flurstücke
- Schläge aus Flurstück-Polygonen zusammengesetzt

Die Karten-Integration ist dokumentiert in:
- [KARTEN_FLURSTUCKE.md](./KARTEN_FLURSTUCKE.md) - Technische Architektur
- [KARTEN_IMPLEMENTIERUNG.md](./KARTEN_IMPLEMENTIERUNG.md) - Praktische Beispiele

### Geoproxy-Integration
- ALKIS Flurstück-Grenzen (WMS-Layer) für Referenz
- Manuelle GeoJSON-Layer für erfasste Flurstücke
- Beide Layer können parallel angezeigt werden zur Validierung
