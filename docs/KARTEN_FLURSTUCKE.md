# Karten-Integration: Flurstücke und Schläge mit echten Polygonen

## Übersicht

Die Karten-Komponente [map-client-content.tsx](../src/components/map/map-client-content.tsx) wurde aktualisiert um Flurstücke (Cadastral Parcels) mit ihren korrekten Umrandungen anzuzeigen. Dies erfolgt durch:

1. **GeoJSON-Polygone**: Flurstücke speichern ihre Geometrie als GeoJSON-Polygon in der `polygonGeoJSON` Eigenschaft
2. **Geoproxy-Integration**: Zusätzlich zum manuellen Layer können Flurstücke auch via ALKIS-WMS vom Geoproxy angezeigt werden
3. **Schlag-Zusammensetzung**: Schläge werden aus ihren Flurstück-Polygonen zusammengesetzt

## Architektur

### Datenschicht
```
CadastralParcel
  ├─ geometry/polygonGeoJSON    (GeoJSON Polygon mit korrekten Umrandungen)
  ├─ area                        (Fläche in ha)
  └─ parcelNumber               (Flurstücksnummer)

Field
  ├─ cadastralParcelIds[]       (IDs der Flurstücke)
  ├─ fieldBlockId               (zugeordneter Feldblock)
  └─ totalArea                  (Summe der Flurstück-Flächen)
```

### Funktionen in map-client-content.tsx

#### getParcelGeometry(parcel: CadastralParcel)
Konvertiert GeoJSON-Koordinaten eines Flurstücks in Leaflet-Format:
- Input: GeoJSON im Format `[[lon, lat], ...]`
- Output: Leaflet-Format `[[lat, lon], ...]`
- Validierung: Alle Koordinaten werden überprüft

```typescript
const getParcelGeometry = (parcel: CadastralParcel): LatLngExpression[] => {
  if (parcel.polygonGeoJSON) {
    // Parse GeoJSON
    const geojson = JSON.parse(parcel.polygonGeoJSON);
    // Convert [lon, lat] → [lat, lon]
    // Validate coordinates
  }
  // Fallback: Generated geometry
  return generateFieldGeometry(0, parcel.area);
};
```

#### getFieldGeometryFromParcels(field: Field, parcels: CadastralParcel[])
Kombiniert mehrere Flurstück-Polygone zu einem Schlag-Polygon:
- Sucht Flurstücke anhand der `cadastralParcelIds`
- Kombiniert ihre Geometrien
- Fallback zu Feld-GeoJSON oder generierter Geometrie

```typescript
const getFieldGeometryFromParcels = (field: Field, allParcels: CadastralParcel[]): LatLngExpression[] => {
  if (field.cadastralParcelIds?.length > 0) {
    // Combine parcel geometries
    for (const parcelId of field.cadastralParcelIds) {
      const parcel = allParcels.find(p => p.id === parcelId);
      const geom = getParcelGeometry(parcel);
      // Combine...
    }
  }
  // Fallback
  return getFieldGeometry(field, 0);
};
```

## Layer-Struktur in der Karte

### Feature Layers (von unten nach oben)
1. **Flurstücke (manuell)** - parcelLayer
   - Farbe: Orange Rand (#ff9800) mit hellem Orange Fill (#fff3e0)
   - Stil: Gestrichelte Linie (5, 5 Pixel)
   - Popup: Name, Flurstücksnummer, Eigentümer, Fläche

2. **Felder (Schläge)** - fieldLayer
   - Farbe: Primärfarbe mit 20% Transparenz
   - Polygon-Umrandung mit Popups

3. **Wirtschaftlichkeit** - profitabilityLayer
   - Farben basierend auf DB II (€/ha)
   - Green > 300€/ha bis Red < 0€/ha

4. **Kulturkarte** - cultureLayer
   - Farben nach Kulturart (Weizen=Gold, Mais=Orange, etc.)

5. **Beobachtungen** - observationLayer
   - Circle Marker zur Markierung von Feldbeobachtungen

### WMS-Layer (vom Geoproxy)
- **Flurstücke (ALKIS)**: FlurstueckGrenzpunkt (amtliche Grenzen)
- **Vegetation**: Zutat-Klassifizierung
- **Fluren/Gemarkungen**: Administrative Grenzen

## Datenfluss

```
DataService.getCadastralParcels()
        ↓
[CadastralParcel[], CadastralParcel[], ...]
        ↓
setParc els() in MapClientContent
        ↓
Update-Effect triggert:
        ├─ getParcelGeometry() für jeden Parcel
        │  └─ Rendert parcelLayer mit Polygonen
        │
        └─ getFieldGeometryFromParcels() für jeden Field
           └─ Rendert fieldLayer mit kombinierten Polygonen
```

## Rendering-Logik

### Flurstück-Layer (parcels)
```typescript
parcels.forEach((parcel) => {
  const geometry = getParcelGeometry(parcel);
  
  L.polygon(geometry, {
    color: '#ff9800',          // Orange border
    weight: 2,
    fillColor: '#fff3e0',      // Light orange fill
    fillOpacity: 0.3,
    dashArray: '5, 5'          // Dashed
  })
    .bindPopup(`${parcel.name}<br/>...`)
    .addTo(parcelLayer);
});
```

### Schlag-Layer (fields)
```typescript
fields.forEach((field) => {
  // Prioritize: Combine from parcels → Field GeoJSON → Generated
  const geometry = getFieldGeometryFromParcels(field, parcels);
  
  L.polygon(geometry, {
    color: 'hsl(var(--primary))',
    weight: 2,
    fillOpacity: 0.2
  })
    .bindPopup(`${field.name}<br/>...`)
    .addTo(fieldLayer);
});
```

## GeoJSON Format

Flurstücke speichern ihre Geometrie als Standard-GeoJSON Polygon:

```json
{
  "type": "Polygon",
  "coordinates": [
    [
      [11.031234, 50.981234],
      [11.031456, 50.981234],
      [11.031456, 50.981456],
      [11.031234, 50.981456],
      [11.031234, 50.981234]
    ]
  ]
}
```

**Wichtig**: GeoJSON verwendet `[longitude, latitude]` Format, während Leaflet `[latitude, longitude]` erwartet. Die Konvertierung wird in `getParcelGeometry()` durchgeführt.

## Fehlerbehandlung

Alle Funktionen validieren Koordinaten:
```typescript
// Vor Verwendung
if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
  console.warn("Invalid coordinate");
  return null;
}

// Filter ungültige Koordinaten
const validGeometry = geometry.filter(coord => {
  const [lat, lon] = coord;
  return Number.isFinite(lat) && Number.isFinite(lon);
});

// Mindestens 3 Punkte für Polygon
if (validGeometry.length < 3) {
  return; // Skip rendering
}
```

## Kartenlayer-Verwendung

In der Karte können folgende Layer ein/ausgeschaltet werden:

```
Basemaps:
  ☑ Orthofoto (DOP20)  - 20cm DOP vom Geoproxy
  ☐ BKG Basemap        - Amtliche Deutsche Grundkarte

Overlays:
  ☑ Felder             - Vom System erfasste Schläge
  ☑ Flurstücke (manuell) - GeoJSON-Polygone aus Datenbank
  ☐ Wirtschaftlichkeit - DB II Farbcodierung
  ☐ Kulturkarte        - Nach Kulturart gefärbt
  ☐ Beobachtungen      - Feldbeobachtungen als Marker
  ☐ Flurstücke (ALKIS) - Amtliche ALKIS-Grenzen
  ☐ Vegetation         - Landnutzungsklassen
  ☐ Fluren             - Administrative Flur-Grenzen
  ☐ Gemarkungen        - Administrative Gemarkungen
```

## Performance-Optimierungen

1. **Validierung an der Quelle**: Koordinaten werden beim Laden validiert
2. **Early Return**: Ungültige Polygone überspringen das Rendering
3. **Lazy Loading**: Layer werden nur beim Rendern erstellt
4. **Memoization**: getParcelGeometry() wird für jeden Parcel nur einmal aufgerufen pro Render

## Integration mit Geoproxy

Die ALKIS-Flurstücke vom Geoproxy werden parallel zur manuellen Layer angezeigt:

```typescript
// WMS-Layer vom Geoproxy
const alkisParcelLayer = createWmsLayer('ALKIS Flurstücke', 
  "https://www.geoproxy.geoportal-th.de/geoproxy/services/ALKISV", {
  layers: 'FlurstueckGrenzpunkt',
  // ...
});

// Manuelle Layer aus der Datenbank
const parcelLayer = L.featureGroup();
```

Dies ermöglicht:
- **Vergleich**: Manuelle Grenzen vs. amtliche ALKIS-Grenzen überlagern
- **Kalibrierung**: GeoJSON-Daten anpassen basierend auf ALKIS
- **Validierung**: Automatische Überprüfung der erfassten Grenzen

## Bekannte Einschränkungen

1. **Simple Polygone**: Nur SinglePart Polygone werden unterstützt (keine MultiPolygon)
2. **2D-Geometrie**: Z-Koordinaten werden ignoriert
3. **Rendering-Performance**: Bei > 100 Flurstücken kann die Performance abnehmen
4. **WGS84 vs UTM**: Karte nutzt UTM32, GeoJSON normalerweise WGS84

## Erweiterungsmöglichkeiten

1. **MultiPolygon-Unterstützung**: Für Flurstücke mit Enklaven
2. **Geometrie-Editor**: Bearbeitung von Grenzen direkt in der Karte
3. **Flächenberechnung**: Automatische Neberechnung der Flächen
4. **Import/Export**: GeoJSON-Import und Shapefile-Export
5. **Routing**: Fahrtrouten auf Basis von Schlägen

## Debugging

Turn on console logging:
```typescript
console.log("Field geometry:", geometry);
console.log("Parcel bounds:", getParcelGeometry(parcel));
console.log("Layer count:", parcelLayer.getLayers().length);
```

Browser DevTools:
- Inspector: Prüfe polygon-Elemente
- Console: Fehler und Warnungen
- Network: WMS-Request-Status
