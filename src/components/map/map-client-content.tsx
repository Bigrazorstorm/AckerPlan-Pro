'use client';

import { useState, useEffect, useRef } from 'react';
import { useSession } from '@/context/session-context';
import dataService from '@/services';
import { Field, FieldEconomics, Observation } from '@/services/types';
import { Skeleton } from '@/components/ui/skeleton';
import { useTranslations } from 'next-intl';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

// Dynamic imports for Leaflet to avoid SSR issues
import type { LatLngExpression } from 'leaflet';

function MapSkeleton() {
  return <Skeleton className="w-full h-full" />;
}

/**
 * Generate sample rectangular polygon for field visualization
 * TODO: Replace with real GeoJSON geometry data from database
 */
const generateFieldGeometry = (fieldIndex: number, area: number): LatLngExpression[] => {
  const baseLat = 50.9778 + (fieldIndex % 5) * 0.15;
  const baseLon = 11.0289 + Math.floor(fieldIndex / 5) * 0.15;
  const sizeOffset = Math.sqrt(area) / 1200;
  
  return [
    [baseLat - sizeOffset, baseLon - sizeOffset],
    [baseLat + sizeOffset, baseLon - sizeOffset],
    [baseLat + sizeOffset, baseLon + sizeOffset],
    [baseLat - sizeOffset, baseLon + sizeOffset],
    [baseLat - sizeOffset, baseLon - sizeOffset],
  ];
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
        return geojson.coordinates[0].map((coord: number[]) => [coord[1], coord[0]]);
      }
    } catch (error) {
      console.warn(`Failed to parse GeoJSON for field ${field.name}:`, error);
    }
  }
  
  // Fallback to generated geometry
  return generateFieldGeometry(fieldIndex, field.totalArea);
};

export function MapClientContent() {
  const { activeCompany, loading: sessionLoading } = useSession();
  const [fields, setFields] = useState<Field[]>([]);
  const [observations, setObservations] = useState<Observation[]>([]);
  const [fieldEconomics, setFieldEconomics] = useState<Record<string, FieldEconomics>>({});
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  const t = useTranslations('MapPage');
  const { toast } = useToast();
  
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const fieldLayerRef = useRef<L.FeatureGroup | null>(null);
  const profitabilityLayerRef = useRef<L.FeatureGroup | null>(null);
  const cultureLayerRef = useRef<L.FeatureGroup | null>(null);
  const observationLayerRef = useRef<L.FeatureGroup | null>(null);

  const mapStyle = { height: '100%', width: '100%' };

  // Fetch data
  useEffect(() => {
    if (activeCompany) {
      const fetchData = async () => {
        setLoading(true);
        const [fieldsData, observationsData, economicsData] = await Promise.all([
          dataService.getFields(activeCompany.tenantId, activeCompany.id),
          dataService.getObservations(activeCompany.tenantId, activeCompany.id),
          dataService.getAllFieldEconomics(activeCompany.tenantId, activeCompany.id)
        ]);
        setFields(fieldsData);
        setObservations(observationsData);
        setFieldEconomics(economicsData);
        setLoading(false);
      };
      fetchData();
    }
  }, [activeCompany]);

  // Map initialization
  useEffect(() => {
    if (!mapContainerRef.current) return;
    
    // Dynamic import of Leaflet to avoid SSR issues
    let map: any;
    
    const initMap = async () => {
      const L = (await import('leaflet')).default;
      await import('leaflet/dist/leaflet.css');
      await import('leaflet-defaulticon-compatibility');
      await import('leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css');

      map = L.map(mapContainerRef.current!, {
        center: [50.9778, 11.0289],
        zoom: 8,
        scrollWheelZoom: true,
      });
      mapInstanceRef.current = map;

      setTimeout(() => {
        map.invalidateSize();
      }, 0);

      // Base maps
      const osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      });

      const dopLayer = L.tileLayer.wms("https://www.geoproxy.geoportal-th.de/geoproxy/services/DOP20", {
        layers: 'DOP20',
        format: 'image/png',
        transparent: true,
        version: '1.3.0',
        attribution: "DOP &copy; TLBG",
        maxZoom: 19,
      });

      osmLayer.addTo(map);

      // WMS overlay layers
      const alkisLayer = L.tileLayer.wms("https://www.geoproxy.geoportal-th.de/geoproxy/services/ALKIS", {
        layers: 'Flurstuecke',
        format: 'image/png',
        transparent: true,
        version: '1.3.0',
        attribution: "ALKIS &copy; TLBG",
        maxZoom: 19,
      });

      const schutzgebieteLayer = L.tileLayer.wms("https://www.geoproxy.geoportal-th.de/geoproxy/services/Schutzgebiete", {
        layers: 'Natura2000,Naturschutzgebiete',
        format: 'image/png',
        transparent: true,
        version: '1.3.0',
        attribution: "Schutzgebiete &copy; TLBG",
        maxZoom: 19,
      });

      const gewaesserLayer = L.tileLayer.wms("https://www.geoproxy.geoportal-th.de/geoproxy/services/Gewaesser", {
        layers: 'Fliessgewaesser,Stehendegewaesser',
        format: 'image/png',
        transparent: true,
        version: '1.3.0',
        attribution: "Gewässer &copy; TLBG",
        maxZoom: 19,
      });

      // Feature layers
      const fieldLayer = L.featureGroup();
      const profitabilityLayer = L.featureGroup();
      const cultureLayer = L.featureGroup();
      const observationLayer = L.featureGroup();

      fieldLayer.addTo(map);

      fieldLayerRef.current = fieldLayer;
      profitabilityLayerRef.current = profitabilityLayer;
      cultureLayerRef.current = cultureLayer;
      observationLayerRef.current = observationLayer;

      // Layer control
      const baseLayers = {
        'OpenStreetMap': osmLayer,
        'Orthofoto': dopLayer,
      };

      const overlayLayers = {
        [t('fieldsLayer') || 'Felder']: fieldLayer,
        [t('profitabilityLayer') || 'Wirtschaftlichkeit']: profitabilityLayer,
        [t('cultureLayer') || 'Kulturkarte']: cultureLayer,
        [t('observationsLayer') || 'Beobachtungen']: observationLayer,
        'Flurstücke (ALKIS)': alkisLayer,
        'Schutzgebiete': schutzgebieteLayer,
        'Gewässer': gewaesserLayer,
      };

      L.control.layers(baseLayers, overlayLayers, { collapsed: true }).addTo(map);
    };
    
    initMap();

    return () => {
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
    const profitabilityLayer = profitabilityLayerRef.current;
    const cultureLayer = cultureLayerRef.current;
    const observationLayer = observationLayerRef.current;

    if (!map || !fieldLayer || !profitabilityLayer || !cultureLayer || !observationLayer) return;

    fieldLayer.clearLayers();
    profitabilityLayer.clearLayers();
    cultureLayer.clearLayers();
    observationLayer.clearLayers();

    const updateLayers = async () => {
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

    // Render fields
    fields.forEach((field, index) => {
      const geometry = getFieldGeometry(field, index);
      const cropName = field.currentCrop || 'Keine Kultur';

      // Field layer
      L.polygon(geometry, {
        color: 'hsl(var(--primary))',
        weight: 2,
        fillOpacity: 0.2,
      })
        .bindPopup(`<strong>${field.name}</strong><br/>${cropName} - ${field.totalArea} ha`)
        .addTo(fieldLayer);

      // Profitability layer
      const color = getProfitabilityColor(field.id, field.totalArea);
      const economics = fieldEconomics[field.id];
      const marginPerHa = economics?.contributionMargin && field.totalArea > 0
        ? (economics.contributionMargin / field.totalArea).toFixed(0)
        : 'N/A';

      L.polygon(geometry, {
        color: color,
        fillColor: color,
        fillOpacity: 0.6,
        weight: 2,
      })
        .bindPopup(`<strong>${field.name}</strong><br/>DB II: ${marginPerHa} €/ha`)
        .addTo(profitabilityLayer);

      // Culture layer (Kulturkarte)
      const cultureColor = getCultureColor(field.currentCrop);
      const cropLabel = cropName || 'Keine Kultur';

      L.polygon(geometry, {
        color: cultureColor,
        fillColor: cultureColor,
        fillOpacity: 0.7,
        weight: 2,
      })
        .bindPopup(`<strong>${field.name}</strong><br/>Kultur: ${cropLabel}<br/>Fläche: ${field.totalArea} ha`)
        .addTo(cultureLayer);
      });

      // Render observations
      observations
        .filter(o => o.latitude && o.longitude)
        .forEach(obs => {
          L.circleMarker([obs.latitude!, obs.longitude!], {
            radius: 6,
            fillColor: 'hsl(var(--warning))',
            color: '#000',
            weight: 1,
            fillOpacity: 0.8,
          })
            .bindPopup(`${obs.title}<br/>${new Date(obs.date).toLocaleDateString()}`)
            .addTo(observationLayer);
        });

      // Fit bounds
      const bounds = latLngBounds([]);
      fields.forEach((field, index) => {
        bounds.extend(latLngBounds(getFieldGeometry(field, index) as LatLngExpression[]));
      });

      if (bounds.isValid()) {
        map.fitBounds(bounds.pad(0.1));
      }
    };
    
    updateLayers();
  }, [fields, observations, fieldEconomics]);

  // Search handler
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    const field = fields.find(f => f.name.toLowerCase().includes(searchQuery.toLowerCase()));
    if (field) {
      const fieldIndex = fields.indexOf(field);
      const { latLngBounds } = await import('leaflet');
      const bounds = latLngBounds(generateFieldGeometry(fieldIndex, field.totalArea) as LatLngExpression[]);
      if (mapInstanceRef.current && bounds.isValid()) {
        mapInstanceRef.current.fitBounds(bounds.pad(0.1));
        toast({ title: `Schlag: ${field.name}`, description: `${field.totalArea} ha` });
      }
    } else {
      toast({ variant: 'destructive', title: 'Schlag nicht gefunden' });
    }
  };

  if (sessionLoading || loading) {
    return <MapSkeleton />;
  }

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainerRef} style={mapStyle} />
      
      {/* Search panel */}
      <div className="absolute top-4 left-4 bg-white rounded-lg shadow-md p-3 z-40 max-w-xs flex gap-2">
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
    </div>
  );
}
