
'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
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
import { Card } from '@/components/ui/card';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Search, AlertTriangle, LocateFixed, X, PlusCircle, MapPin } from 'lucide-react';

// Static import for Leaflet CSS - must be at top level
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';

// Import types only
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
const MAP_DEFAULT_CENTER: [number, number] = [50.9778, 11.0289]; // Firmenstandort (Erfurt)

function MapSkeleton() {
  return <Skeleton className="w-full h-full min-h-[400px]" />;
}

function MapError({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="w-full h-full min-h-[400px] flex flex-col items-center justify-center bg-muted/20 border rounded-lg">
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
 * Generate sample rectangular polygon for field visualization
 */
const generateFieldGeometry = (fieldIndex: number, area: number): LatLngExpression[] => {
  const validArea = Number.isFinite(area) && area > 0 ? area : 10;
  const baseLat = 50.9778 + (fieldIndex % 5) * 0.05;
  const baseLon = 11.0289 + Math.floor(fieldIndex / 5) * 0.05;
  
  const sizeOffset = Math.max(0.001, Math.min(0.01, Math.sqrt(validArea) / 1000));
  
  return [
    [baseLat - sizeOffset, baseLon - sizeOffset],
    [baseLat + sizeOffset, baseLon - sizeOffset],
    [baseLat + sizeOffset, baseLon + sizeOffset],
    [baseLat - sizeOffset, baseLon + sizeOffset],
    [baseLat - sizeOffset, baseLon - sizeOffset],
  ] as LatLngExpression[];
};

/**
 * Get cadastral parcel geometry from GeoJSON
 */
const getParcelGeometry = (parcel: CadastralParcel): LatLngExpression[] => {
  if (parcel.polygonGeoJSON) {
    try {
      const geojson = JSON.parse(parcel.polygonGeoJSON);
      if (geojson.type === 'Polygon' && geojson.coordinates?.[0]) {
        const coords = geojson.coordinates[0]
          .map((coord: any) => {
            if (!Array.isArray(coord) || coord.length < 2) return null;
            const [lon, lat] = coord;
            if (!Number.isFinite(lon) || !Number.isFinite(lat)) return null;
            return [lat, lon] as LatLngExpression;
          })
          .filter((coord: any): coord is LatLngExpression => coord !== null);
        
        if (coords.length >= 3) return coords;
      }
    } catch (error) {
      console.warn(`Failed to parse GeoJSON for parcel ${parcel.name}:`, error);
    }
  }
  return generateFieldGeometry(0, parcel.area);
};

/**
 * Get field geometry from GeoJSON or generate sample
 */
const getFieldGeometry = (field: Field, fieldIndex: number): LatLngExpression[] => {
  return generateFieldGeometry(fieldIndex, field.area);
};

const getFieldGeometryFromParcels = (field: Field, allParcels: CadastralParcel[]): LatLngExpression[] => {
  if (field.cadastralParcelIds && field.cadastralParcelIds.length > 0) {
    for (const parcelId of field.cadastralParcelIds) {
      const parcel = allParcels.find(p => p.id === parcelId);
      if (parcel) {
        const geom = getParcelGeometry(parcel);
        if (geom && geom.length >= 3) {
          return geom;
        }
      }
    }
  }
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
  const [isLocating, setIsLocating] = useState(false);
  
  const t = useTranslations('MapPage');
  const { toast } = useToast();
  
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const fieldLayerRef = useRef<any>(null);
  const parcelLayerRef = useRef<any>(null);
  const drawLayerRef = useRef<any>(null);
  const profitabilityLayerRef = useRef<any>(null);
  const cultureLayerRef = useRef<any>(null);
  const observationLayerRef = useRef<any>(null);

  const resetParcelForm = () => setParcelForm(emptyParcelForm);

  const clearDrawLayer = () => {
    const drawLayer = drawLayerRef.current;
    if (drawLayer) drawLayer.clearLayers();
  };

  /**
   * Tries to find and center the map on the user's location
   */
  const handleLocate = useCallback((options: { initial?: boolean } = {}) => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (!navigator.geolocation) {
      if (!options.initial) {
        toast({
          variant: 'destructive',
          title: 'GPS nicht verfügbar',
          description: 'Ihr Browser unterstützt keine Geolocation.',
        });
      }
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        map.setView([latitude, longitude], 15);
        
        // Add a marker for user position if it doesn't exist
        const L = (window as any).L;
        if (L) {
          L.circleMarker([latitude, longitude], {
            radius: 8,
            fillColor: '#3b82f6',
            color: '#fff',
            weight: 2,
            fillOpacity: 1,
          })
          .bindPopup('Ihr aktueller Standort')
          .addTo(map);
        }
        
        setIsLocating(false);
        if (!options.initial) {
          toast({ title: 'Standort gefunden' });
        }
      },
      (error) => {
        setIsLocating(false);
        if (!options.initial) {
          let message = 'Standort konnte nicht ermittelt werden.';
          if (error.code === error.PERMISSION_DENIED) {
            message = 'Standortzugriff wurde verweigert.';
          }
          toast({
            variant: 'destructive',
            title: 'GPS-Fehler',
            description: message,
          });
        }
        // If initial load failed, center on company location
        if (options.initial) {
          map.setView(MAP_DEFAULT_CENTER, 13);
        }
      },
      { enableHighAccuracy: true, timeout: 5000 }
    );
  }, [toast]);

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

    const L = (window as any).L;
    if (!mapInstanceRef.current || !L || !L.Draw) {
      toast({ variant: 'destructive', title: 'Zeichenwerkzeuge nicht bereit' });
      return;
    }

    try {
      const drawer = new L.Draw.Polygon(mapInstanceRef.current, {
        shapeOptions: {
          color: '#ff9800',
          weight: 2,
          dashArray: '5, 5',
          fillColor: '#fff3e0',
          fillOpacity: 0.2,
        },
      });
      drawer.enable();
      toast({ title: 'Zeichnen gestartet' });
    } catch (error) {
      console.error(error);
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
      const data = await response.json();
      const feature = data?.features?.[0];
      if (!feature?.geometry) throw new Error('Kein Flurstück gefunden.');

      setParcelForm((prev) => ({
        ...prev,
        name: prev.name || `Flurstück ${prev.parcelNumber}`,
        polygonGeoJSON: JSON.stringify(feature.geometry),
      }));

      const drawLayer = drawLayerRef.current;
      const L = (window as any).L;
      if (drawLayer && L) {
        drawLayer.clearLayers();
        L.geoJSON(feature.geometry, {
          style: { color: '#ff9800', weight: 2, dashArray: '5, 5', fillColor: '#fff3e0', fillOpacity: 0.2 },
        }).addTo(drawLayer);
      }
      toast({ title: 'ALKIS-Geometrie geladen' });
    } catch (error) {
      toast({ variant: 'destructive', title: 'Import fehlgeschlagen' });
    } finally {
      setIsImporting(false);
    }
  };

  const handleSaveParcel = async () => {
    if (!activeCompany) return;
    try {
      const newParcel = await dataService.addCadastralParcel(activeCompany.tenantId, activeCompany.id, parcelForm);
      setParcels((prev) => [...prev, newParcel]);
      toast({ title: 'Flurstück gespeichert' });
      setParcelEditorOpen(false);
      resetParcelForm();
      clearDrawLayer();
    } catch (error) {
      toast({ variant: 'destructive', title: 'Speichern fehlgeschlagen' });
    }
  };

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

  useEffect(() => {
    let initTimer: ReturnType<typeof setTimeout> | null = null;
    let resizeObserver: ResizeObserver | null = null;
    
    const initMap = () => {
      const L = (window as any).L;
      const proj4 = (window as any).proj4;

      if (!mapContainerRef.current || !L || !L.Proj || !L.Proj.CRS || !proj4) {
        initTimer = setTimeout(initMap, 100);
        return;
      }

      try {
        const epsg25832 = new L.Proj.CRS(
          'EPSG:25832',
          '+proj=utm +zone=32 +ellps=GRS80 +units=m +no_defs',
          {
            origin: [0, 0],
            resolutions: UTM32_RESOLUTIONS,
          }
        );

        const map = L.map(mapContainerRef.current!, {
          center: MAP_DEFAULT_CENTER,
          zoom: 13,
          minZoom: UTM32_MIN_ZOOM,
          maxZoom: UTM32_MAX_ZOOM,
          crs: epsg25832,
          fadeAnimation: true,
          zoomAnimation: true
        });
        mapInstanceRef.current = map;

        // Base layers
        const dopLayer = L.tileLayer.wms("https://www.geoproxy.geoportal-th.de/geoproxy/services/DOP20", {
          layers: 'th_dop',
          format: 'image/jpeg',
          attribution: "DOP &copy; TLBG",
          transparent: true,
          version: '1.3.0'
        }).addTo(map);

        const bkgBaseMapLayer = L.tileLayer.wms("https://sgx.geodatenzentrum.de/wms_basemapde", {
          layers: 'de_basemapde_web_raster_farbe',
          format: 'image/png',
          attribution: "© GeoBasis-DE / BKG",
          version: '1.3.0'
        });

        // Feature layers
        const fieldLayer = L.featureGroup().addTo(map);
        const parcelLayer = L.featureGroup().addTo(map);
        const drawLayer = L.featureGroup().addTo(map);
        const profitabilityLayer = L.featureGroup();
        const cultureLayer = L.featureGroup();
        const observationLayer = L.featureGroup();

        fieldLayerRef.current = fieldLayer;
        parcelLayerRef.current = parcelLayer;
        drawLayerRef.current = drawLayer;
        profitabilityLayerRef.current = profitabilityLayer;
        cultureLayerRef.current = cultureLayer;
        observationLayerRef.current = observationLayer;

        if (L.control && L.control.groupedLayers) {
          L.control.groupedLayers({
            'Orthofoto (DOP20)': dopLayer,
            'BKG Basemap': bkgBaseMapLayer,
          }, {
            'Betrieb': {
              'Felder': fieldLayer,
              'Flurstücke (manuell)': parcelLayer,
              'Wirtschaftlichkeit': profitabilityLayer,
              'Kulturkarte': cultureLayer,
              'Beobachtungen': observationLayer,
            }
          }).addTo(map);
        }

        map.on('draw:created', (event: any) => {
          const layer = event?.layer;
          if (!layer) return;
          drawLayer.clearLayers();
          drawLayer.addLayer(layer);
          const geojson = layer.toGeoJSON();
          if (geojson?.geometry) {
            setParcelForm((prev) => ({ ...prev, polygonGeoJSON: JSON.stringify(geojson.geometry) }));
            setParcelEditorMode('draw');
            setParcelEditorOpen(true);
          }
        });

        // Fix gray screen by forcing resize
        setTimeout(() => {
          map.invalidateSize();
          handleLocate({ initial: true }); // Initial centering attempt
        }, 200);

        resizeObserver = new ResizeObserver(() => {
          if (map) map.invalidateSize();
        });
        resizeObserver.observe(mapContainerRef.current!);

      } catch (error) {
        console.error('Failed to initialize map:', error);
        setMapError('Kartenfehler bei der Initialisierung');
      }
    };
    
    initMap();

    return () => {
      if (initTimer) clearTimeout(initTimer);
      if (resizeObserver) resizeObserver.disconnect();
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [handleLocate]);

  useEffect(() => {
    const map = mapInstanceRef.current;
    const L = (window as any).L;
    if (!map || !L || !fieldLayerRef.current) return;

    const fieldLayer = fieldLayerRef.current;
    const parcelLayer = parcelLayerRef.current;
    const observationLayer = observationLayerRef.current;

    fieldLayer.clearLayers();
    parcelLayer.clearLayers();
    observationLayer.clearLayers();

    parcels.forEach((parcel) => {
      const geometry = getParcelGeometry(parcel);
      if (geometry && geometry.length >= 3) {
        L.polygon(geometry, { color: '#ff9800', weight: 2, fillColor: '#fff3e0', fillOpacity: 0.3, dashArray: '5, 5' })
          .bindPopup(`<strong>${parcel.name}</strong><br/>${parcel.area} ha`)
          .addTo(parcelLayer);
      }
    });

    fields.forEach((field, index) => {
      const geometry = getFieldGeometryFromParcels(field, parcels);
      if (geometry && geometry.length >= 3) {
        L.polygon(geometry, { color: 'hsl(var(--primary))', weight: 2, fillOpacity: 0.2 })
          .bindPopup(`<strong>${field.name}</strong><br/>${field.crop} - ${field.area} ha`)
          .addTo(fieldLayer);
      }
    });

    observations.forEach(obs => {
      if (obs.latitude && obs.longitude) {
        L.circleMarker([obs.latitude, obs.longitude], { radius: 6, fillColor: 'hsl(var(--warning))', color: '#000', weight: 1, fillOpacity: 0.8 })
          .bindPopup(`<strong>${obs.title}</strong><br/>${obs.date}`)
          .addTo(observationLayer);
      }
    });

    // We only auto-zoom if there are objects and we are at company center or GPS center hasn't moved yet
    const bounds = fieldLayer.getBounds();
    if (bounds && bounds.isValid() && fields.length > 0) {
      // If we've already positioned via GPS, we don't necessarily want to force fit bounds
      // but usually for farm overview it is better.
      map.fitBounds(bounds.pad(0.1));
    }

  }, [fields, parcels, observations, fieldEconomics]);

  const handleSearch = () => {
    const field = fields.find(f => f.name.toLowerCase().includes(searchQuery.toLowerCase()));
    const L = (window as any).L;
    if (field && mapInstanceRef.current && L) {
      const geometry = getFieldGeometryFromParcels(field, parcels);
      if (geometry && geometry.length >= 3) {
        mapInstanceRef.current.fitBounds(L.latLngBounds(geometry).pad(0.2));
      }
    }
  };

  if (sessionLoading || loading) return <MapSkeleton />;
  if (mapError) return <MapError message={mapError} onRetry={() => window.location.reload()} />;

  return (
    <div className="relative w-full h-full min-h-[400px]">
      <div ref={mapContainerRef} className="w-full h-full absolute inset-0 rounded-lg overflow-hidden bg-[#f0f0f0]" />
      
      {/* Map Controls */}
      <div className="absolute top-4 left-4 flex gap-2 z-[1000]">
        <div className="bg-white rounded-lg shadow-lg p-1.5 flex gap-2 w-64">
          <Input 
            placeholder="Schlag suchen..." 
            value={searchQuery} 
            onChange={(e) => setSearchQuery(e.target.value)} 
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className="h-9 text-sm"
          />
          <Button size="sm" onClick={handleSearch} className="h-9 px-2">
            <Search className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="absolute top-4 right-4 flex flex-col gap-2 z-[1000]">
        <Card className="bg-white/90 backdrop-blur shadow-lg p-2 flex flex-col gap-2 border-primary/20">
          <Button size="sm" variant="outline" onClick={() => handleLocate()} disabled={isLocating} className="justify-start border-primary/30">
            <LocateFixed className={`h-4 w-4 mr-2 ${isLocating ? 'animate-pulse' : ''}`} />
            Standort
          </Button>
          <Button size="sm" variant="default" onClick={handleOpenAlkis} className="justify-start">
            <PlusCircle className="h-4 w-4 mr-2" />
            ALKIS Import
          </Button>
          <Button size="sm" variant="outline" onClick={handleStartDraw} className="justify-start border-primary/30">
            <MapPin className="h-4 w-4 mr-2" />
            Zeichnen
          </Button>
        </Card>
      </div>

      {/* Editor Sheet */}
      <Sheet open={parcelEditorOpen} onOpenChange={setParcelEditorOpen}>
        <SheetContent className="overflow-y-auto w-full sm:max-w-md">
          <SheetHeader>
            <SheetTitle>Flurstück erfassen</SheetTitle>
          </SheetHeader>
          <div className="py-4 space-y-4">
            {parcelEditorMode === 'alkis' && (
              <div className="p-4 bg-primary/5 rounded-lg border border-primary/20 space-y-3">
                <Label className="text-sm font-semibold">ALKIS-Daten abrufen</Label>
                <div className="flex gap-2">
                  <Input 
                    placeholder="Flurstücksnummer eingeben" 
                    value={parcelForm.parcelNumber} 
                    onChange={(e) => setParcelForm({ ...parcelForm, parcelNumber: e.target.value })}
                  />
                  <Button variant="outline" onClick={handleFetchAlkis} disabled={isImporting}>
                    {isImporting ? 'Lädt...' : 'Laden'}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">Daten werden vom Thüringer Geoproxy abgerufen.</p>
              </div>
            )}
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Name</Label>
                <Input value={parcelForm.name} onChange={(e) => setParcelForm({ ...parcelForm, name: e.target.value })} placeholder="z.B. Schlag am Mühlbach" />
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Gemarkung</Label>
                  <Input value={parcelForm.district} onChange={(e) => setParcelForm({ ...parcelForm, district: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Fläche (ha)</Label>
                  <Input type="number" step="0.01" value={parcelForm.area} onChange={(e) => setParcelForm({ ...parcelForm, area: Number(e.target.value) })} />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Eigentümer</Label>
                <Input value={parcelForm.owner} onChange={(e) => setParcelForm({ ...parcelForm, owner: e.target.value })} />
              </div>
              
              <div className="space-y-2">
                <Label>GeoJSON Geometrie</Label>
                <Textarea rows={5} value={parcelForm.polygonGeoJSON} onChange={(e) => setParcelForm({ ...parcelForm, polygonGeoJSON: e.target.value })} className="font-mono text-xs" />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" onClick={() => setParcelEditorOpen(false)}>Abbrechen</Button>
              <Button onClick={handleSaveParcel}>Speichern</Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
