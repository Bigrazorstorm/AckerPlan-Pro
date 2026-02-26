# Praktische Implementierung: Flurstücke mit Geoproxy-Daten laden

## Importieren von GeoJSON-Grenzen

Um Flurstücke mit echten Umrandungen zu erfassen, gibt es mehrere Möglichkeiten:

### 1. **Manuelles Zeichnen in der Karte** (Zukünftig)

```typescript
// Feature-Request: Draw Tool für Flurstück-Grenzen
import { Leaflet.Draw } from 'leaflet-draw';

// Nutzer zeichnet Polygon
// → GeoJSON wird extrahiert
// → Als CadastralParcel gespeichert
```

### 2. **Import aus ALKIS-Daten** (Über Geoproxy)

Die Karte zeigt bereits ALKIS Flurstücke vom Geoproxy als WMS-Layer. Diese können über ein Frontend-Tool extrahiert werden:

```typescript
// Nutzer klickt auf Flurstück in der ALKIS-Karte
// → Geoproxy-API abfragen für Geometrie
// → GeoJSON speichern

const getParcelFromGeoproxy = async (parcelNumber: string) => {
  // WFS-Request an Geoproxy
  const url = 'https://www.geoproxy.geoportal-th.de/geoproxy/services/ALKISV/wfs';
  
  const response = await fetch(url + '?request=GetFeature' +
    '&version=2.0.0' +
    '&typeNames=AX_Flurstueck' +
    '&outputFormat=application/json' +
    `&cql_filter=flurstuecksnummer='${parcelNumber}'`
  );
  
  const geojson = await response.json();
  return geojson.features[0].geometry;
};
```

### 3. **CSV/Shapefile-Import** (Zukünftig)

```typescript
// Nutzer lädt Shapefile oder GeoJSON-Datei
// → Parser extrahiert Geometrien
// → CadastralParcels werden erstellt

const importShapefile = async (file: File) => {
  // Using shapefile library
  const features = await shapefile.read(file);
  
  const parcels = features.map(feature => ({
    name: feature.properties.FLUR,
    parcelNumber: feature.properties.NUMMER,
    area: calculateArea(feature.geometry),
    polygonGeoJSON: JSON.stringify(feature.geometry),
    // ...
  }));
  
  await Promise.all(
    parcels.map(p => dataService.addCadastralParcel(tenantId, companyId, p))
  );
};
```

## Beispiel-Workflow: Flurstücke erfassen

### Schritt 1: Flurstück-Daten erfassen

```typescript
const parcelFormData: CadastralParcelFormData = {
  name: 'Flurstück 123/45',
  county: 'Landkreis Weimarer Land',
  municipality: 'Neumark',
  district: 'Neumark',
  parcelNumber: '123/45',
  area: 8.5,
  owner: 'Max Mustermann',
  leasingStatus: 'owned',
  polygonGeoJSON: JSON.stringify({
    type: "Polygon",
    coordinates: [[
      [11.031234, 50.981234],
      [11.031456, 50.981234],
      [11.031456, 50.981456],
      [11.031234, 50.981456],
      [11.031234, 50.981234]
    ]]
  })
};

const newParcel = await dataService.addCadastralParcel(
  'tenant-123',
  'company-456',
  parcelFormData
);
```

### Schritt 2: Flurstücke in der Karte visualisieren

Die Flurstücke appear automatisch im parcelLayer:
- Orange gestrichelte Umrandung
- Light Orange Füllung (30% Transparenz)
- Hover-Popup mit Informationen

### Schritt 3: Schlag aus mehreren Flurstücken zusammensetzen

```typescript
const fieldFormData: FieldFormData = {
  name: 'Acker-Nord kombiniert',
  cadastralParcelIds: ['parcel-1', 'parcel-2', 'parcel-3'],
  fieldBlockId: 'block-1',
  totalArea: 25.3,  // Automatisch berechnet aus Flurstücken
  currentCrop: 'wheat',
  // ...
};

const newField = await dataService.updateField(
  'tenant-123',
  'company-456',
  fieldFormData
);
```

### Schritt 4: Feldblock-Zuordnung

```typescript
const blockFormData: FieldBlockFormData = {
  name: 'Feldblock Süd',
  referenceNumber: 'DE-456789-001',
  dgkLwNumber: 'DE-THR-456789',
  fieldIds: ['field-1', 'field-2', 'field-3'],
  cadastralParcelIds: ['parcel-1', 'parcel-2', 'parcel-3'],
  subsidyEligible: true,
  subsidyAmount: 2500,
  gapCompliant: true,
  environmentalZone: false,
  restrictions: ['5% Blühfläche']
};

const newBlock = await dataService.addFieldBlock(
  'tenant-123',
  'company-456',
  blockFormData
);
```

## Kartendarstellung bei verschiedenen Zoom-Leveln

### Level 10-12: Landkreisebene
- Feldblöcke sichtbar
- Schläge können sichtbar sein
- Flurstücke ausgeblendet (zu klein)

### Level 13-15: Gemeinde/Großflächig
- Schläge deutlich sichtbar
- Flurstücke einzeln erkennbar
- ALKIS Grenzen helfen bei Orientierung

### Level 16+: Detailansicht
- Flurstück-Grenzen sehr deutlich
- Einzelne Grenzen zoombar
- Vergleich Manual vs ALKIS möglich

## Troubleshooting

### Problem: Flurstücke werden nicht angezeigt

```typescript
// 1. Überprüfe Datenladung
console.log("Parcels loaded:", parcels.length);

// 2. Überprüfe GeoJSON-Format
if (parcel.polygonGeoJSON) {
  const geojson = JSON.parse(parcel.polygonGeoJSON);
  console.log("Valid GeoJSON:", geojson.type === 'Polygon');
}

// 3. Überprüfe Layer-Visibility
const visible = map.hasLayer(parcelLayer);
console.log("Parcel layer visible:", visible);

// 4. Überprüfe Koordinaten
const coords = getParcelGeometry(parcel);
console.log("Coordinates count:", coords.length);
coords.forEach((c, i) => {
  const [lat, lon] = c;
  console.log(`  ${i}: [${lat}, ${lon}]`, 
    Number.isFinite(lat) && Number.isFinite(lon) ? '✓' : '✗');
});
```

### Problem: Schlag-Polygon sieht merkwürdig aus

Schläge die aus mehreren Flurstücken bestehen können komplexe Geometrien haben:

```typescript
// Visualisierung der Schlag-Zusammensetzung
const field = fields[0];
console.log("Field cadastral parcels:");
field.cadastralParcelIds.forEach(id => {
  const parcel = parcels.find(p => p.id === id);
  console.log(`  - ${parcel?.name} (${id})`);
});

// Überprüfe ob alle Flurstücke geladen sind
const allLoaded = field.cadastralParcelIds.every(id => 
  parcels.some(p => p.id === id)
);
console.log("All parcels loaded:", allLoaded);
```

### Problem: Performance bei vielen Flurstücken

```typescript
// Renderierung optimieren
const parcelCount = parcels.length;

if (parcelCount > 100) {
  console.warn(`
    ${parcelCount} Flurstücke können Performance-Probleme verursachen.
    Lösungsoptionen:
    1. Clustering-Layer verwenden
    2. Nur sichtbare Flurstücke rendern (viewport-basiert)
    3. WebGL-Layer statt Canvas-Layer
  `);
}
```

## Integration mit anderen Features

### Mit Operationen verknüpfen

Operationen (Maßnahmen) können auf Schlag-Ebene erfasst werden, aber auch auf Flurstück-Ebene refinanced werden:

```typescript
const operation = await dataService.addOperation(tenantId, companyId, {
  type: 'Seeding',
  fields: ['field-1'],  // Schlag-ID
  parcels: ['parcel-1', 'parcel-2'],  // Flurstück-IDs (optional)
  date: new Date().toISOString(),
  // ...
});
```

### Mit Beobachtungen verknüpfen

Feldbeobachtungen können mit Flurstücken verknüpft werden:

```typescript
const observation = await dataService.addObservation(
  tenantId,
  companyId,
  {
    field: 'field-1',
    parcel: 'parcel-1',  // Flurstück-spezifische Observation
    title: 'Schädlingsbefall erkannt',
    latitude: 50.981234,
    longitude: 11.031234,
    // ...
  }
);
```

### Mit Lager-Verwaltung verknüpfen

Lagermaterial wird auf Felderebene zugeordnet, kann aber auch Flurstück-spezifisch sein:

```typescript
const materialsPerParcel = {
  'parcel-1': [
    { itemId: 'seed-1', quantity: 250 },  // 250 kg für dieses Flurstück
  ],
  'parcel-2': [
    { itemId: 'seed-1', quantity: 200 },  // 200 kg für dieses Flurstück
  ]
};
```

## Best Practices

### 1. GeoJSON-Qualität
- Koordinaten müssen `Number.isFinite()` sein
- Polygone müssen mindestens 3 unterschiedliche Punkte haben
- Geschlossene Ringe: Last Punkt = First Punkt
- WGS84 Koordinaten (lat/lon)

### 2. Flurstück-Verwaltung
- Eindeutige Flurstücknummern pro Gemeinde/Gemarkung
- Korrekte Eigentümer-Erfassung für Pacht-Dokumentation
- Regelmäßige Überprüfung gegen ALKIS-Daten

### 3. Schlag-Zusammensetzung
- Schläge sollten zusammenhängende Flurstücke nutzen
- Flächen-Konsistenz überprüfen
- Feldblock-Zuordnung vollständig halten

### 4. Kartendarstellung
- Beide Layer (Parcel + ALKIS) parallel nutzen zum Validieren
- Layer-Visibility anpassen je nach Aufgabe
- Zoom-Level beachten für Performance

## Testing

```typescript
// Unit Test Beispiel
describe('Parcel Rendering', () => {
  test('should parse valid GeoJSON', () => {
    const parcel: CadastralParcel = {
      // ...
      polygonGeoJSON: JSON.stringify({
        type: "Polygon",
        coordinates: [[
          [11.01, 50.98],
          [11.02, 50.98],
          [11.02, 50.99],
          [11.01, 50.99],
          [11.01, 50.98]
        ]]
      })
    };
    
    const geometry = getParcelGeometry(parcel);
    expect(geometry).toHaveLength(5);
    expect(geometry[0]).toEqual([50.98, 11.01]);
  });
  
  test('should combine parcel geometries for fields', () => {
    const field: Field = {
      // ...
      cadastralParcelIds: ['parcel-1', 'parcel-2']
    };
    const parcels = [parcel1, parcel2];
    
    const geometry = getFieldGeometryFromParcels(field, parcels);
    expect(geometry.length).toBeGreaterThan(3);
  });
});
```

## Verknüpfung mit Geoproxy-APIs

### WCS (Web Coverage Service) für Luftbilder
```typescript
// Orthofoto über GeoJSON-Grenze
const getOrthoFoto = async (parcelGeoJSON: string) => {
  const bounds = calculateBounds(parcelGeoJSON);
  const wcsUrl = `https://www.geoproxy.geoportal-th.de/geoproxy/wcs?` +
    `request=GetCoverage&service=WCS&version=2.0.1` +
    `&coverageId=th_dop@OrthoPhoto&format=image/jpeg` +
    `&BoundingBox=${bounds}`;
  
  return wcsUrl;  // Image für diese Grenze
};
```

### WFS (Web Feature Service) für Eigenschaften
```typescript
// Flurstück-Eigenschaften von ALKIS abrufen
const getAlkisProperties = async (parcelNumber: string) => {
  const wfsUrl = `https://www.geoproxy.geoportal-th.de/geoproxy/wfs?` +
    `request=GetFeature&service=WFS&version=2.0.0` +
    `&typeNames=AX_Flurstueck` +
    `&propertyName=gml:name,flurstuecksnummer,amtlicheFlaeche` +
    `&outputFormat=application/json`;
  
  const response = await fetch(wfsUrl);
  return response.json();
};
```
