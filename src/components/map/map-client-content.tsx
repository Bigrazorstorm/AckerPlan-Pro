'use client';

import { useState, useEffect, useRef } from 'react';
import { useSession } from '@/context/session-context';
import dataService from '@/services';
import { Field, FieldEconomics, Observation } from '@/services/types';
import { CadastralParcel, CadastralParcelFormData } from '@/services/field-types';
import { Skeleton } from '@/components/ui/skeleton';
import { useTranslations } from 'next-intl';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Search } from 'lucide-react';
import { AlertTriangle } from 'lucide-react';

// Static import for Leaflet CSS - must be at top level
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import 'leaflet-draw/dist/leaflet.draw.css';

// Dynamic imports for Leaflet to avoid SSR issues
import type { LatLngExpression } from 'leaflet';

const UTM32_RESOLUTIONS = [
  8192,
  4096,
  2048,
  1024,
  512,
  256,
  128,
  64,
  32,
  16,
  8,
  4,
  2,
  1,
  0.5,
];
const UTM32_MIN_ZOOM = 0;
const UTM32_MAX_ZOOM = UTM32_RESOLUTIONS.length - 1;
const MAP_DEFAULT_CENTER: [number, number] = [50.9778, 11.0289];

function MapSkeleton() {
  return <Skeleton className="w-full h-full" />;
}

function MapError({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-muted/20">
      <AlertTriangle className="h-12 w-12 text-destructive mb-4" />
      <p className="text-destructive font-medium mb-2">Karte konnte nicht geladen werden</p>
      <p className="text-sm text-muted-foreground mb-4">{message}</p>
      <Button variant="outline" onClick={onRetry}>
        Erneut versuchen
      </Button>
    </div>
  );
}

/**
 * Validate that coordinates are finite numbers
 */
const isValidCoordinate = (coord: unknown): boolean => {
  if (!Array.isArray(coord) || coord.length < 2) return false;
  const [lat, lon] = coord;
  return Number.isFinite(lat) && Number.isFinite(lon);
};

/**
 * Generate sample rectangular polygon for field visualization
 * TODO: Replace with real GeoJSON geometry data from database
 */
const generateFieldGeometry = (fieldIndex: number, area: number): LatLngExpression[] => {
  // Ensure area is valid; use default if not
  const validArea = Number.isFinite(area) && area > 0 ? area : 10;
  
  const baseLat = 50.9778 + (fieldIndex % 5) * 0.15;
  const baseLon = 11.0289 + Math.floor(fieldIndex / 5) * 0.15;
  
  // Validate base coordinates
  if (!Number.isFinite(baseLat) || !Number.isFinite(baseLon)) {
    console.warn(`Invalid base coordinates for field ${fieldIndex}: [${baseLat}, ${baseLon}]`);
    // Fallback to default location
    return [
      [50.9778, 11.0289],
      [50.9779, 11.0289],
      [50.9779, 11.0290],
      [50.9778, 11.0290],
      [50.9778, 11.0289],
    ];
  }

  // Constrain sizeOffset to reasonable bounds (0.001 to 0.1 degrees)
  const sizeOffset = Math.max(0.001, Math.min(0.1, Math.sqrt(validArea) / 1200));
  
  if (!Number.isFinite(sizeOffset)) {
    console.warn(`Invalid sizeOffset calculated: ${sizeOffset}`);
    // Fallback to default offset
    const defaultOffset = 0.01;
    return [
      [baseLat - defaultOffset, baseLon - defaultOffset],
      [baseLat + defaultOffset, baseLon - defaultOffset],
      [baseLat + defaultOffset, baseLon + defaultOffset],
      [baseLat - defaultOffset, baseLon + defaultOffset],
      [baseLat - defaultOffset, baseLon - defaultOffset],
    ];
  }

  const coords = [
    [baseLat - sizeOffset, baseLon - sizeOffset],
    [baseLat + sizeOffset, baseLon - sizeOffset],
    [baseLat + sizeOffset, baseLon + sizeOffset],
    [baseLat - sizeOffset, baseLon + sizeOffset],
    [baseLat - sizeOffset, baseLon - sizeOffset],
  ];

  // Final validation before returning
  const invalidCoords = coords.filter(coord => {
    const [lat, lon] = coord as [number, number];
    return !Number.isFinite(lat) || !Number.isFinite(lon);
  });

  if (invalidCoords.length > 0) {
    console.warn(`Generated invalid coordinates for field ${fieldIndex}:`, invalidCoords);
    // Return fallback
    return [
      [50.9778, 11.0289],
      [50.9779, 11.0289],
      [50.9779, 11.0290],
      [50.9778, 11.0290],
      [50.9778, 11.0289],
    ];
  }

  return coords as LatLngExpression[];
};

/**
 * Get cadastral parcel geometry from GeoJSON
 * Flurstücke haben GeoJSON-Polygone mit korrekten Umrandungen
 */
const getParcelGeometry = (parcel: CadastralParcel): LatLngExpression[] => {
  if (parcel.polygonGeoJSON) {
    try {
      const geojson = JSON.parse(parcel.polygonGeoJSON);
      if (geojson.type === 'Polygon' && geojson.coordinates?.[0]) {
        // Convert GeoJSON coordinates [lon, lat] to Leaflet format [lat, lon]
        const coords = geojson.coordinates[0]
          .map((coord: any) => {
            try {
              if (!Array.isArray(coord) || coord.length < 2) return null;
              const [lon, lat] = coord;
              if (!Number.isFinite(lon) || !Number.isFinite(lat)) {
                console.warn(`Invalid GeoJSON coordinate in parcel ${parcel.name}: [${lon}, ${lat}]`);
                return null;
              }
              return [lat, lon] as LatLngExpression;
            } catch (e) {
              console.warn(`Error parsing GeoJSON coordinate in parcel ${parcel.name}:`, e);
              return null;
            }
          })
          .filter((coord: LatLngExpression | null): coord is LatLngExpression => coord !== null);
        
        if (coords.length >= 3) {
          const allValid = coords.every(coord => {
            const [lat, lon] = coord;
            return Number.isFinite(lat) && Number.isFinite(lon);
          });
          
          if (allValid) {
            return coords;
          } else {
            console.warn(`GeoJSON coordinates for parcel ${parcel.name} contain invalid values`);
          }
        }
      }
    } catch (error) {
      console.warn(`Failed to parse GeoJSON for parcel ${parcel.name}:`, error);
    }
  }
  
  // Fallback to generated geometry if no valid GeoJSON
  return generateFieldGeometry(0, parcel.area);
};

/**
 * Get field geometry from GeoJSON or generate sample
 */
const getFieldGeometry = (field: Field, fieldIndex: number): LatLngExpression[] => {
  // Try to use real GeoJSON data
  if (field.location?.polygonGeoJSON) {
    try {
      const geojson = JSON.parse(field.location.polygonGeoJSON);
      if (geojson.type === 'Polygon' && geojson.coordinates?.[0]) {
        // Convert GeoJSON coordinates [lon, lat] to Leaflet format [lat, lon]
        const coords = geojson.coordinates[0]
          .map((coord: any) => {
            try {
              if (!Array.isArray(coord) || coord.length < 2) return null;
              const [lon, lat] = coord;
              if (!Number.isFinite(lon) || !Number.isFinite(lat)) {
                console.warn(`Invalid GeoJSON coordinate in field ${field.name}: [${lon}, ${lat}]`);
                return null;
              }
              return [lat, lon] as LatLngExpression;
            } catch (e) {
              console.warn(`Error parsing GeoJSON coordinate in field ${field.name}:`, e);
              return null;
            }
          })
          .filter((coord: LatLngExpression | null): coord is LatLngExpression => coord !== null);
        
        if (coords.length >= 3) {
          const allValid = coords.every(coord => {
            const [lat, lon] = coord;
            return Number.isFinite(lat) && Number.isFinite(lon);
          });
          
          if (allValid) {
            return coords;
          } else {
            console.warn(`GeoJSON coordinates for field ${field.name} contain invalid values after filtering`);
          }
        }
      }
    } catch (error) {
      console.warn(`Failed to parse GeoJSON for field ${field.name}:`, error);
    }
  }
  
  // Fallback to generated geometry
  return generateFieldGeometry(fieldIndex, field.totalArea);
};

const getFieldGeometryFromParcels = (field: Field, allParcels: CadastralParcel[]): LatLngExpression[] => {
  if (field.cadastralParcelIds && field.cadastralParcelIds.length > 0) {
    const parcelGeoms: LatLngExpression[] = [];
    
    for (const parcelId of field.cadastralParcelIds) {
      const parcel = allParcels.find(p => p.id === parcelId);
      if (parcel) {
        const geom = getParcelGeometry(parcel);
        if (geom && geom.length >= 3) {
          parcelGeoms.push(...geom);
        }
      }
    }
    
    // Return combined geometry if we have data from parcels
    if (parcelGeoms.length >= 3) {
      return parcelGeoms;
    }
  }
  
  // Fallback to existing field geometry or generated
  return getFieldGeometry(field, 0);
};

const emptyParcelForm: CadastralParcelFormData = {
  name: '',
  county: '',
  municipality: '',
  district: '',
  parcelNumber: '',
  subParcelNumber: '',
  area: 0,
  owner: '',
  leasingStatus: 'owned',
  polygonGeoJSON: '',
};

export function MapClientContent() {
  const { activeCompany, loading: sessionLoading } = useSession();
  const [fields, setFields] = useState<Field[]>([]);
  const [parcels, setParcels] = useState<CadastralParcel[]>([]);
  const [observations, setObservations] = useState<Observation[]>([]);
  const [fieldEconomics, setFieldEconomics] = useState<Record<string, FieldEconomics>>({});
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [mapError, setMapError] = useState<string | null>(null);
  const [parcelEditorOpen, setParcelEditorOpen] = useState(false);
  const [parcelEditorMode, setParcelEditorMode] = useState<'alkis' | 'draw' | 'manual'>('manual');
  const [parcelForm, setParcelForm] = useState<CadastralParcelFormData>(emptyParcelForm);
  const [isImporting, setIsImporting] = useState(false);
  
  const t = useTranslations('MapPage');
  const tDebug = useTranslations('MapDebug');
  const { toast } = useToast();
  
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const fieldLayerRef = useRef<any>(null);
  const parcelLayerRef = useRef<any>(null);
  const drawLayerRef = useRef<any>(null);
  const profitabilityLayerRef = useRef<any>(null);
  const cultureLayerRef = useRef<any>(null);
  const observationLayerRef = useRef<any>(null);

  const mapStyle = { height: '100%', width: '100%' };

  const resetParcelForm = () => {
    setParcelForm(emptyParcelForm);
  };

  const clearDrawLayer = () => {
    const drawLayer = drawLayerRef.current;
    if (drawLayer) {
      drawLayer.clearLayers();
    }
  };

  const handleOpenAlkis = () => {
    resetParcelForm();
    clearDrawLayer();
    setParcelEditorMode('alkis');
    setParcelEditorOpen(true);
  };

  const handleStartDraw = async () => {
    resetParcelForm();
    clearDrawLayer();
    setParcelEditorMode('draw');

    if (!mapInstanceRef.current) {
      toast({ variant: 'destructive', title: 'Karte nicht bereit' });
      return;
    }

    try {
      const L = (await import('leaflet')).default;
      await import('leaflet-draw');
      const drawer = new (L as any).Draw.Polygon(mapInstanceRef.current, {
        shapeOptions: {
          color: '#ff9800',
          weight: 2,
          dashArray: '5, 5',
          fillColor: '#fff3e0',
          fillOpacity: 0.2,
        },
      });
      drawer.enable();
      toast({ title: 'Zeichnen gestartet', description: 'Polygon auf der Karte zeichnen.' });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Zeichnen fehlgeschlagen',
        description: error instanceof Error ? error.message : 'Unbekannter Fehler',
      });
    }
  };

  const handleFetchAlkis = async () => {
    if (!parcelForm.parcelNumber.trim()) {
      toast({ variant: 'destructive', title: 'Flurstücksnummer fehlt' });
      return;
    }

    setIsImporting(true);
    try {
      const parcelNumber = parcelForm.parcelNumber.trim().replace(/'/g, "''");
      const url = new URL('https://www.geoproxy.geoportal-th.de/geoproxy/services/ALKISV/wfs');
      url.searchParams.set('service', 'WFS');
      url.searchParams.set('version', '2.0.0');
      url.searchParams.set('request', 'GetFeature');
      url.searchParams.set('typeNames', 'AX_Flurstueck');
      url.searchParams.set('outputFormat', 'application/json');
      url.searchParams.set('srsName', 'EPSG:4326');
      url.searchParams.set('CQL_FILTER', `flurstuecksnummer='${parcelNumber}'`);

      const response = await fetch(url.toString());
      if (!response.ok) {
        throw new Error(`ALKIS Import fehlgeschlagen (${response.status})`);
      }

      const data = await response.json();
      const feature = data?.features?.[0];
      if (!feature?.geometry) {
        throw new Error('Kein Flurstück gefunden.');
      }

      const geometry = JSON.stringify(feature.geometry);
      setParcelForm((prev) => ({
        ...prev,
        name: prev.name || `Flurstück ${prev.parcelNumber}`,
        polygonGeoJSON: geometry,
      }));

      const drawLayer = drawLayerRef.current;
      if (drawLayer) {
        const L = (await import('leaflet')).default;
        drawLayer.clearLayers();
        L.geoJSON(feature.geometry, {
          style: {
            color: '#ff9800',
            weight: 2,
            dashArray: '5, 5',
            fillColor: '#fff3e0',
            fillOpacity: 0.2,
          },
        }).addTo(drawLayer);
      }

      toast({ title: 'ALKIS-Geometrie geladen' });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Import fehlgeschlagen',
        description: error instanceof Error ? error.message : 'Unbekannter Fehler',
      });
    } finally {
      setIsImporting(false);
    }
  };

  const handleSaveParcel = async () => {
    if (!activeCompany) return;

    if (!parcelForm.name || !parcelForm.parcelNumber || !parcelForm.district || !parcelForm.municipality) {
      toast({
        variant: 'destructive',
        title: 'Pflichtfelder fehlen',
        description: 'Bitte Name, Flurstücksnummer, Gemarkung und Gemeinde ausfüllen.',
      });
      return;
    }

    if (!Number.isFinite(parcelForm.area) || parcelForm.area <= 0) {
      toast({
        variant: 'destructive',
        title: 'Fläche fehlt',
        description: 'Bitte eine gültige Fläche in ha angeben.',
      });
      return;
    }

    try {
      const newParcel = await dataService.addCadastralParcel(
        activeCompany.tenantId,
        activeCompany.id,
        parcelForm
      );
      setParcels((prev) => [...prev, newParcel]);
      toast({ title: 'Flurstück gespeichert' });
      setParcelEditorOpen(false);
      resetParcelForm();
      clearDrawLayer();
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Speichern fehlgeschlagen',
        description: error instanceof Error ? error.message : 'Unbekannter Fehler',
      });
    }
  };

  // Fetch data - including cadastral parcels
  useEffect(() => {
    if (activeCompany) {
      const fetchData = async () => {
        setLoading(true);
        const [fieldsData, cadastralParcelsData, observationsData, economicsData] = await Promise.all([
          dataService.getFields(activeCompany.tenantId, activeCompany.id),
          dataService.getCadastralParcels(activeCompany.tenantId, activeCompany.id),
          dataService.getObservations(activeCompany.tenantId, activeCompany.id),
          dataService.getAllFieldEconomics(activeCompany.tenantId, activeCompany.id)
        ]);
        setFields(fieldsData);
        setParcels(cadastralParcelsData);
        setObservations(observationsData);
        setFieldEconomics(economicsData);
        setLoading(false);
      };
      fetchData();
    }
  }, [activeCompany]);

  // Map initialization
  useEffect(() => {
    // Dynamic import of Leaflet to avoid SSR issues
    let map: any;
    let initTimer: ReturnType<typeof setTimeout> | null = null;
    
    const initMap = async () => {
      if (!mapContainerRef.current) {
        initTimer = setTimeout(initMap, 50);
        return;
      }

      try {
        const L = (await import('leaflet')).default;
        await import('leaflet-defaulticon-compatibility');
        await import('leaflet-groupedlayercontrol');
        await import('leaflet-draw');

        const proj4 = (await import('proj4')).default;
        (window as unknown as { proj4?: typeof proj4 }).proj4 = proj4;
        await import('proj4leaflet');

        const epsg25832 = new (L as any).Proj.CRS(
          'EPSG:25832',
          '+proj=utm +zone=32 +ellps=GRS80 +units=m +no_defs',
          {
            origin: [0, 0],
            resolutions: UTM32_RESOLUTIONS,
          }
        );

        map = L.map(mapContainerRef.current!, {
          center: MAP_DEFAULT_CENTER,
          zoom: Math.min(8, UTM32_MAX_ZOOM),
          minZoom: UTM32_MIN_ZOOM,
          maxZoom: UTM32_MAX_ZOOM,
          scrollWheelZoom: true,
          crs: epsg25832,
        });
        mapInstanceRef.current = map;

        setTimeout(() => {
          map.invalidateSize();
        }, 0);

      // Base maps
      const createWmsLayer = (label: string, url: string, options: Record<string, unknown>) => {
        const layer = L.tileLayer.wms(url, {
          ...options,
          uppercase: true,
          crossOrigin: true,
          crs: map.options.crs,
        });

        layer.on('tileerror', (event: { tile?: HTMLImageElement }) => {
          const tileUrl = event?.tile?.src;
          console.warn(`WMS tile error for ${label}`, tileUrl || url);
          toast({
            variant: 'destructive',
            title: tDebug('layerErrorTitle'),
            description: tDebug('layerErrorDescription', { layerName: label }),
          });
        });

        return layer;
      };

      // Base layer: DOP20 (Digital Orthophoto 20cm)
      // Available layers from GetCapabilities: th_dop (RGB), th_dop20pan (Grayscale), th_dop20cir (Infrared)
      const dopLayer = createWmsLayer('DOP20', "https://www.geoproxy.geoportal-th.de/geoproxy/services/DOP20", {
        layers: 'th_dop',
        format: 'image/jpeg',
        transparent: false,
        version: '1.1.1',
        attribution: "DOP &copy; TLBG",
        maxZoom: UTM32_MAX_ZOOM,
      });

      dopLayer.addTo(map);

      // BKG Basemap.de - Official German basemap by Bundesamt für Kartographie und Geodäsie (BKG)
      // Service: https://sgx.geodatenzentrum.de/wms_basemapde
      // Supports EPSG:25832 (UTM32) and EPSG:3857 (Web Mercator)
      const bkgBaseMapLayer = createWmsLayer('BKG Basemap', "https://sgx.geodatenzentrum.de/wms_basemapde", {
        layers: 'de_basemapde_web_raster_farbe',
        format: 'image/png',
        transparent: false,
        version: '1.3.0',
        attribution: "© GeoBasis-DE / BKG CC BY 4.0",
        maxZoom: UTM32_MAX_ZOOM,
      });

      // ALKIS Simplified (ALKISV) - Flurstücke (parcels) with labels combined into single layer
      // Service endpoint: https://www.geoproxy.geoportal-th.de/geoproxy/services/ALKISV
      // Layers: FlurstueckGrenzpunkt (boundaries) + AngabenZumFlurstueck (labels) combined
      const alkisParcelLayer = createWmsLayer('ALKIS Flurstücke Grenzen', "https://www.geoproxy.geoportal-th.de/geoproxy/services/ALKISV", {
        layers: 'FlurstueckGrenzpunkt',
        format: 'image/png',
        transparent: true,
        version: '1.3.0',
        styles: 'adv:AX_Flurstueck',
        attribution: "ALKIS &copy; TLBG",
        maxZoom: UTM32_MAX_ZOOM,
      });

      const alkisLabelsLayer = createWmsLayer('ALKIS Flurstücke Beschriftung', "https://www.geoproxy.geoportal-th.de/geoproxy/services/ALKISV", {
        layers: 'AngabenZumFlurstueck',
        format: 'image/png',
        transparent: true,
        version: '1.3.0',
        attribution: "ALKIS &copy; TLBG",
        maxZoom: UTM32_MAX_ZOOM,
      });

      // Combine both Flurstücke layers into a single LayerGroup
      const alkisLayer = L.layerGroup([alkisParcelLayer, alkisLabelsLayer]);

      // ALKIS Vegetation - Land use/vegetation layer
      const vegetationLayer = createWmsLayer('Vegetation', "https://www.geoproxy.geoportal-th.de/geoproxy/services/ALKISV", {
        layers: 'Vegetation',
        format: 'image/png',
        transparent: true,
        version: '1.3.0',
        attribution: "ALKIS &copy; TLBG",
        maxZoom: UTM32_MAX_ZOOM,
      });

      // Administrative boundaries - Fluren (fields/districts)
      // Service: https://www.geoproxy.geoportal-th.de/geoproxy/services/GRENZUEB
      // Layers: gmkueb_flur (boundaries) + gmkueb_flur_name (labels) combined
      const flurenLayer = createWmsLayer('Fluren', "https://www.geoproxy.geoportal-th.de/geoproxy/services/GRENZUEB", {
        layers: 'gmkueb_flur,gmkueb_flur_name',
        format: 'image/png',
        transparent: true,
        version: '1.3.0',
        attribution: "ALKIS &copy; TLBG",
        maxZoom: UTM32_MAX_ZOOM,
      });

      // Administrative boundaries - Gemarkungen (municipalities/districts)
      // Service: https://www.geoproxy.geoportal-th.de/geoproxy/services/GRENZUEB
      // Layers: gmkueb_gmk (boundaries) + gmkueb_gmk_name (labels) combined
      const gemarkungenLayer = createWmsLayer('Gemarkungen', "https://www.geoproxy.geoportal-th.de/geoproxy/services/GRENZUEB", {
        layers: 'gmkueb_gmk,gmkueb_gmk_name',
        format: 'image/png',
        transparent: true,
        version: '1.3.0',
        attribution: "ALKIS &copy; TLBG",
        maxZoom: UTM32_MAX_ZOOM,
      });

      // Agrar WMS layers (Feldblock, Nitrat-, Phosphatkulisse)
      const feldblockLayer = createWmsLayer('Feldblöcke', "https://www.geoproxy.geoportal-th.de/geoproxy/services/agrar/feldblock", {
        layers: 'Feldblock',
        format: 'image/png',
        transparent: true,
        version: '1.3.0',
        attribution: "Feldblöcke &copy; GDI-Th",
        maxZoom: UTM32_MAX_ZOOM,
      });

      const nitratLayer = createWmsLayer('Nitratkulisse', "https://www.geoproxy.geoportal-th.de/geoproxy/services/agrar/agrar", {
        layers: 'Nitratkulisse',
        format: 'image/png',
        transparent: true,
        version: '1.3.0',
        attribution: "Agrar &copy; GDI-Th",
        maxZoom: UTM32_MAX_ZOOM,
      });

      const phosphatLayer = createWmsLayer('Phosphatkulisse', "https://www.geoproxy.geoportal-th.de/geoproxy/services/agrar/agrar", {
        layers: 'Phosphatkulisse',
        format: 'image/png',
        transparent: true,
        version: '1.3.0',
        attribution: "Agrar &copy; GDI-Th",
        maxZoom: UTM32_MAX_ZOOM,
      });


      // Feature layers
      const fieldLayer = L.featureGroup();
      const parcelLayer = L.featureGroup();
      const drawLayer = L.featureGroup();
      const profitabilityLayer = L.featureGroup();
      const cultureLayer = L.featureGroup();
      const observationLayer = L.featureGroup();

      fieldLayer.addTo(map);
      parcelLayer.addTo(map);
      drawLayer.addTo(map);

      fieldLayerRef.current = fieldLayer;
      parcelLayerRef.current = parcelLayer;
      drawLayerRef.current = drawLayer;
      profitabilityLayerRef.current = profitabilityLayer;
      cultureLayerRef.current = cultureLayer;
      observationLayerRef.current = observationLayer;

      // Layer control
      const baseLayers = {
        'Orthofoto (DOP20)': dopLayer,
        'BKG Basemap': bkgBaseMapLayer,
      };

      const groupedOverlays = {
        'Betrieb': {
          [t('fieldsLayer') || 'Felder']: fieldLayer,
          'Flurstücke (manuell)': parcelLayer,
          [t('profitabilityLayer') || 'Wirtschaftlichkeit']: profitabilityLayer,
          [t('cultureLayer') || 'Kulturkarte']: cultureLayer,
          [t('observationsLayer') || 'Beobachtungen']: observationLayer,
        },
        'Amtliche Daten': {
          'Flurstücke (ALKIS)': alkisLayer,
          'Vegetation': vegetationLayer,
          'Fluren': flurenLayer,
          'Gemarkungen': gemarkungenLayer,
        },
        'Agrar-Kulissen': {
          'Feldblöcke (WMS)': feldblockLayer,
          'Nitratkulisse': nitratLayer,
          'Phosphatkulisse': phosphatLayer,
        },
      };

      (L.control as any).groupedLayers(baseLayers, groupedOverlays, { collapsed: true }).addTo(map);

      map.on('draw:created', (event: any) => {
        try {
          const layer = event?.layer;
          if (!layer) return;
          drawLayer.clearLayers();
          drawLayer.addLayer(layer);
          const geojson = layer.toGeoJSON();
          if (geojson?.geometry) {
            setParcelForm((prev) => ({
              ...prev,
              polygonGeoJSON: JSON.stringify(geojson.geometry),
            }));
            setParcelEditorMode('draw');
            setParcelEditorOpen(true);
          }
        } catch (error) {
          console.warn('Failed to capture draw geometry:', error);
        }
      });

      // Add error handling for map zoom/pan events
      map.on('baselayerchange', (e: any) => {
        try {
          if (e.layer && e.layer.options && !Number.isFinite(e.layer.options.maxZoom)) {
            e.layer.options.maxZoom = UTM32_MAX_ZOOM;
          }
        } catch (error) {
          console.warn('Error handling base layer change:', error);
        }
      });

      // Prevent coordinate errors during zoom by validating before render
      const originalFitBounds = map.fitBounds.bind(map);
      map.fitBounds = function(bounds: any, options?: any) {
        try {
          if (!bounds || !bounds.isValid || !bounds.isValid()) {
            console.warn('Invalid bounds passed to fitBounds, skipping');
            return map;
          }
          return originalFitBounds(bounds, options);
        } catch (error) {
          console.warn('Error in fitBounds:', error);
          return map;
        }
      };
      } catch (error) {
        console.error('Failed to initialize map:', error);
        setMapError(error instanceof Error ? error.message : 'Karte konnte nicht initialisiert werden');
      }
    };
    
    initMap();

    return () => {
      if (initTimer) {
        clearTimeout(initTimer);
      }
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [t]);

  // Update layers when data changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    const fieldLayer = fieldLayerRef.current;
    const parcelLayer = parcelLayerRef.current;
    const profitabilityLayer = profitabilityLayerRef.current;
    const cultureLayer = cultureLayerRef.current;
    const observationLayer = observationLayerRef.current;

    if (!map || !fieldLayer || !parcelLayer || !profitabilityLayer || !cultureLayer || !observationLayer) return;

    fieldLayer.clearLayers();
    parcelLayer.clearLayers();
    profitabilityLayer.clearLayers();
    cultureLayer.clearLayers();
    observationLayer.clearLayers();

    const updateLayers = async () => {
      try {
        const L = (await import('leaflet')).default;
        const { latLngBounds } = await import('leaflet');

        const getProfitabilityColor = (fieldId: string, area: number) => {
          const economics = fieldEconomics[fieldId];
          if (!economics || area === 0) return '#808080';
          const marginPerHa = economics.contributionMargin / area;
          
          if (marginPerHa > 300) return '#16a34a';
          if (marginPerHa > 200) return '#84cc16';
          if (marginPerHa > 100) return '#facc15';
          if (marginPerHa >= 0) return '#f97316';
          return '#dc2626';
        };

        const getCultureColor = (cropType: string | undefined) => {
          const colors: Record<string, string> = {
            'wheat': '#DAA520',      // Goldenrod (Weizen)
            'barley': '#D2691E',     // Chocolate (Gerste)
            'rye': '#B8860B',        // DarkGoldenrod (Roggen)
            'corn': '#FF8C00',       // DarkOrange (Mais)
            'rapeseed': '#FFD700',   // Gold (Raps)
            'peas': '#90EE90',       // LightGreen (Erbsen)
            'beans': '#98FB98',      // PaleGreen (Bohnen)
            'sugar_beet': '#FFC0CB', // Pink (Zuckerrübe)
            'potato': '#F0E68C',     // Khaki (Kartoffeln)
            'grass': '#7CFC00',      // LawnGreen (Grasland)
            'clover': '#00FF7F',     // SpringGreen (Klee)
            'other': '#A9A9A9',      // DarkGray (Sonstige)
          };
          return colors[cropType || ''] || '#4A90E2';
        };

        // Render cadastral parcels (Flurstücke) with their correct boundaries
        parcels.forEach((parcel) => {
          try {
            const geometry = getParcelGeometry(parcel);
            
            if (!geometry || geometry.length < 3) {
              console.warn(`Parcel ${parcel.name} has invalid geometry`);
              return;
            }

            const validGeometry = geometry.filter(coord => {
              try {
                if (!Array.isArray(coord) || coord.length < 2) return false;
                const [lat, lon] = coord;
                return Number.isFinite(lat) && Number.isFinite(lon);
              } catch (e) {
                return false;
              }
            });

            if (validGeometry.length < 3) {
              console.warn(`Parcel ${parcel.name} has insufficient coordinates`);
              return;
            }

            // Color for parcels (light gray with orange border)
            L.polygon(validGeometry as L.LatLngExpression[], {
              color: '#ff9800',       // Orange border
              weight: 2,
              fillColor: '#fff3e0',   // Very light orange fill
              fillOpacity: 0.3,
              dashArray: '5, 5'       // Dashed line for parcels
            })
              .bindPopup(`<strong>${parcel.name}</strong><br/>Flurstück: ${parcel.parcelNumber}<br/>Eigentümer: ${parcel.owner}<br/>Fläche: ${parcel.area.toFixed(2)} ha`)
              .addTo(parcelLayer);
          } catch (error) {
            console.error(`Failed to create parcel polygon for ${parcel.name}:`, error);
          }
        });

    // Render fields with proper geometries from cadastral parcels
    fields.forEach((field, index) => {
      try {
        // Use parcel geometries if available, otherwise fall back to field geometry
        const geometry = getFieldGeometryFromParcels(field, parcels);
        const cropName = field.currentCrop || 'Keine Kultur';

        // Validate geometry before rendering (must have at least 3 valid coordinates)
        if (!geometry || !Array.isArray(geometry) || geometry.length < 3) {
          console.warn(`Field ${field.name} has invalid geometry, skipping`);
          return;
        }

        // Filter out invalid coordinates from geometry
        const validGeometry = geometry.filter(coord => {
          try {
            if (!Array.isArray(coord) || coord.length < 2) return false;
            const [lat, lon] = coord;
            const isValid = Number.isFinite(lat) && Number.isFinite(lon);
            if (!isValid) {
              console.warn(`Invalid coordinate [${lat}, ${lon}] in field ${field.name}`);
            }
            return isValid;
          } catch (e) {
            console.warn(`Exception filtering coordinate in field ${field.name}:`, e);
            return false;
          }
        });

        // Skip if not enough valid coordinates
        if (validGeometry.length < 3) {
          console.warn(`Field ${field.name} has insufficient valid coordinates: ${validGeometry.length}/3, skipping`);
          return;
        }

        // Validate the geometry array itself before passing to Leaflet
        const geometryIsValid = validGeometry.every((coord, idx) => {
          if (!Array.isArray(coord) || coord.length < 2) {
            console.warn(`Geometry validation failed at index ${idx}: not an array or missing coordinates`);
            return false;
          }
          const [lat, lon] = coord;
          if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
            console.warn(`Geometry validation failed at index ${idx}: [${lat}, ${lon}] not finite`);
            return false;
          }
          return true;
        });

        if (!geometryIsValid) {
          console.warn(`Field ${field.name} geometry validation failed, skipping`);
          return;
        }

        // Field layer
        try {
          L.polygon(validGeometry as L.LatLngExpression[], {
            color: 'hsl(var(--primary))',
            weight: 2,
            fillOpacity: 0.2,
          })
            .bindPopup(`<strong>${field.name}</strong><br/>${cropName} - ${field.totalArea} ha`)
            .addTo(fieldLayer);
        } catch (polygonError) {
          console.error(`Failed to create polygon for field ${field.name}:`, polygonError, 'geometry:', validGeometry);
          return;
        }

        // Profitability layer
        try {
          const color = getProfitabilityColor(field.id, field.totalArea);
          const economics = fieldEconomics[field.id];
          const marginPerHa = economics?.contributionMargin && field.totalArea > 0
            ? (economics.contributionMargin / field.totalArea).toFixed(0)
            : 'N/A';

          L.polygon(validGeometry as L.LatLngExpression[], {
            color: color,
            fillColor: color,
            fillOpacity: 0.6,
            weight: 2,
          })
            .bindPopup(`<strong>${field.name}</strong><br/>DB II: ${marginPerHa} €/ha`)
            .addTo(profitabilityLayer);
        } catch (profitabilityError) {
          console.error(`Failed to create profitability polygon for field ${field.name}:`, profitabilityError);
        }

        // Culture layer (Kulturkarte)
        try {
          const cultureColor = getCultureColor(field.currentCrop);
          const cropLabel = cropName || 'Keine Kultur';

          L.polygon(validGeometry as L.LatLngExpression[], {
            color: cultureColor,
            fillColor: cultureColor,
            fillOpacity: 0.7,
            weight: 2,
          })
            .bindPopup(`<strong>${field.name}</strong><br/>Kultur: ${cropLabel}<br/>Fläche: ${field.totalArea} ha`)
            .addTo(cultureLayer);
        } catch (cultureError) {
          console.error(`Failed to create culture polygon for field ${field.name}:`, cultureError);
        }
      } catch (fieldError) {
        console.error(`Unexpected error processing field ${field.name || index}:`, fieldError);
      }
    });

      // Render observations
      observations
        .filter(o => {
          try {
            return o.latitude && o.longitude && 
                   Number.isFinite(o.latitude) && 
                   Number.isFinite(o.longitude);
          } catch (e) {
            return false;
          }
        })
        .forEach(obs => {
          if (!isValidCoordinate([obs.latitude, obs.longitude])) {
            console.warn(`Observation ${obs.title} has invalid coordinates, skipping`);
            return;
          }
          try {
            L.circleMarker([obs.latitude!, obs.longitude!], {
              radius: 6,
              fillColor: 'hsl(var(--warning))',
              color: '#000',
              weight: 1,
              fillOpacity: 0.8,
            })
              .bindPopup(`${obs.title}<br/>${new Date(obs.date).toLocaleDateString()}`)
              .addTo(observationLayer);
          } catch (e) {
            console.warn(`Failed to render observation ${obs.title}:`, e);
          }
        });

      // Fit bounds - collect all valid bounds from fields and parcels
      let bounds = latLngBounds([
        [50.9778, 11.0289], // Initialize with center point
        [50.9779, 11.0290]  // Add second point to create valid bounds
      ]);
      let hasValidBounds = false;
      
      // Include fields with parcel geometries
      fields.forEach((field, index) => {
        const geometry = getFieldGeometryFromParcels(field, parcels);
        if (geometry && Array.isArray(geometry) && geometry.length >= 3) {
          // Validate all coordinates before adding to bounds
          const validCoords = geometry.filter(coord => {
            try {
              if (!Array.isArray(coord) || coord.length < 2) return false;
              const [lat, lon] = coord;
              return Number.isFinite(lat) && Number.isFinite(lon);
            } catch (e) {
              return false;
            }
          });
          
          if (validCoords.length >= 3) {
            // Extend bounds with each validated coordinate
            validCoords.forEach(coord => {
              try {
                if (Array.isArray(coord) && coord.length >= 2) {
                  const [lat, lon] = coord;
                  if (Number.isFinite(lat) && Number.isFinite(lon)) {
                    bounds.extend([lat, lon]);
                    hasValidBounds = true;
                  }
                }
              } catch (e) {
                console.warn('Failed to extend bounds with coordinate:', coord, e);
              }
            });
          }
        }
      });

      // Also include parcels in bounds calculation
      parcels.forEach((parcel) => {
        const geometry = getParcelGeometry(parcel);
        if (geometry && Array.isArray(geometry) && geometry.length >= 3) {
          const validCoords = geometry.filter(coord => {
            try {
              if (!Array.isArray(coord) || coord.length < 2) return false;
              const [lat, lon] = coord;
              return Number.isFinite(lat) && Number.isFinite(lon);
            } catch (e) {
              return false;
            }
          });
          
          if (validCoords.length >= 3) {
            validCoords.forEach(coord => {
              try {
                if (Array.isArray(coord) && coord.length >= 2) {
                  const [lat, lon] = coord;
                  if (Number.isFinite(lat) && Number.isFinite(lon)) {
                    bounds.extend([lat, lon]);
                    hasValidBounds = true;
                  }
                }
              } catch (e) {
                console.warn('Failed to extend bounds with parcel coordinate:', coord, e);
              }
            });
          }
        }
      });

      // Only fit bounds if we have valid bounds and the map instance exists
      if (hasValidBounds && bounds && bounds.isValid()) {
        try {
          map.fitBounds(bounds.pad(0.1));
        } catch (e) {
          console.warn('Failed to fit bounds:', e);
        }
      }
      } catch (updateError) {
        console.error('Error updating layers:', updateError);
      }
    };
    updateLayers();
  }, [fields, parcels, observations, fieldEconomics]);

  // Search handler
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    const field = fields.find(f => f.name.toLowerCase().includes(searchQuery.toLowerCase()));
    if (field) {
      // Use parcel geometries if available
      const geometry = getFieldGeometryFromParcels(field, parcels);
      
      // Validate geometry before creating bounds
      const validGeometry = geometry.filter(coord => {
        try {
          if (!Array.isArray(coord) || coord.length < 2) return false;
          const [lat, lon] = coord;
          return Number.isFinite(lat) && Number.isFinite(lon);
        } catch (e) {
          return false;
        }
      });

      if (validGeometry.length < 3) {
        toast({ variant: 'destructive', title: 'Ungültige Feldkoordinaten' });
        return;
      }

      try {
        const { latLngBounds } = await import('leaflet');
        // Create bounds properly by extending with each coordinate
        let bounds = latLngBounds(validGeometry as [number, number][]);
        if (mapInstanceRef.current && bounds.isValid()) {
          mapInstanceRef.current.fitBounds(bounds.pad(0.1));
          toast({ title: `Schlag: ${field.name}`, description: `${field.totalArea} ha` });
        }
      } catch (e) {
        console.error('Search failed:', e);
        toast({ variant: 'destructive', title: 'Fehler bei der Suche', description: 'Die Feldkoordinaten konnten nicht verarbeitet werden' });
      }
    } else {
      toast({ variant: 'destructive', title: 'Schlag nicht gefunden' });
    }
  };

  if (sessionLoading || loading) {
    return <MapSkeleton />;
  }

  // Show error state
  if (mapError) {
    return <MapError message={mapError} onRetry={() => setMapError(null)} />;
  }

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainerRef} style={mapStyle} />
      
      {/* Search panel */}
      <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg p-3 z-[9999] max-w-xs flex gap-2">
        <Input
          placeholder="Schlag suchen..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          className="text-sm"
        />
        <Button size="sm" onClick={handleSearch}>
          <Search className="h-4 w-4" />
        </Button>
      </div>

      {/* Parcel tools */}
      <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-3 z-[9999] flex flex-col gap-2">
        <Button size="sm" onClick={handleOpenAlkis}>
          ALKIS Import
        </Button>
        <Button size="sm" variant="outline" onClick={handleStartDraw}>
          Flurstück zeichnen
        </Button>
      </div>

      <Sheet
        open={parcelEditorOpen}
        onOpenChange={(open) => {
          setParcelEditorOpen(open);
          if (!open) {
            resetParcelForm();
            clearDrawLayer();
          }
        }}
      >
        <SheetContent className="overflow-y-auto">
          <SheetHeader>
            <SheetTitle>
              {parcelEditorMode === 'alkis'
                ? 'ALKIS-Import'
                : parcelEditorMode === 'draw'
                  ? 'Flurstück zeichnen'
                  : 'Flurstück anlegen'}
            </SheetTitle>
          </SheetHeader>
          <div className="py-4 space-y-4">
            {parcelEditorMode === 'alkis' && (
              <div className="space-y-2">
                <Label>ALKIS-Geometrie laden</Label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleFetchAlkis}
                  disabled={isImporting}
                >
                  {isImporting ? 'Lade...' : 'Geometrie laden'}
                </Button>
              </div>
            )}
            {parcelEditorMode === 'draw' && (
              <p className="text-sm text-muted-foreground">
                Zeichne das Polygon auf der Karte. Die Geometrie wird hier automatisch eingefügt.
              </p>
            )}
            <div className="space-y-2">
              <Label htmlFor="parcel-name">Name</Label>
              <Input
                id="parcel-name"
                value={parcelForm.name}
                onChange={(e) => setParcelForm((prev) => ({ ...prev, name: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="parcel-number">Flurstücksnummer</Label>
              <Input
                id="parcel-number"
                value={parcelForm.parcelNumber}
                onChange={(e) =>
                  setParcelForm((prev) => ({ ...prev, parcelNumber: e.target.value }))
                }
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="parcel-subnumber">Unterflurstück</Label>
                <Input
                  id="parcel-subnumber"
                  value={parcelForm.subParcelNumber || ''}
                  onChange={(e) =>
                    setParcelForm((prev) => ({ ...prev, subParcelNumber: e.target.value }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="parcel-area">Fläche (ha)</Label>
                <Input
                  id="parcel-area"
                  type="number"
                  step="0.01"
                  value={parcelForm.area}
                  onChange={(e) =>
                    setParcelForm((prev) => ({ ...prev, area: Number(e.target.value) }))
                  }
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="parcel-county">Landkreis</Label>
                <Input
                  id="parcel-county"
                  value={parcelForm.county}
                  onChange={(e) =>
                    setParcelForm((prev) => ({ ...prev, county: e.target.value }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="parcel-municipality">Gemeinde</Label>
                <Input
                  id="parcel-municipality"
                  value={parcelForm.municipality}
                  onChange={(e) =>
                    setParcelForm((prev) => ({ ...prev, municipality: e.target.value }))
                  }
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="parcel-district">Gemarkung</Label>
              <Input
                id="parcel-district"
                value={parcelForm.district}
                onChange={(e) =>
                  setParcelForm((prev) => ({ ...prev, district: e.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="parcel-owner">Eigentümer</Label>
              <Input
                id="parcel-owner"
                value={parcelForm.owner}
                onChange={(e) =>
                  setParcelForm((prev) => ({ ...prev, owner: e.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="parcel-geojson">GeoJSON Polygon</Label>
              <Textarea
                id="parcel-geojson"
                rows={5}
                value={parcelForm.polygonGeoJSON || ''}
                onChange={(e) =>
                  setParcelForm((prev) => ({ ...prev, polygonGeoJSON: e.target.value }))
                }
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setParcelEditorOpen(false)}>
                Abbrechen
              </Button>
              <Button onClick={handleSaveParcel}>Speichern</Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
