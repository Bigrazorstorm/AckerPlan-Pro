'use client';

import { useState, useEffect, useRef } from 'react';
import { useSession } from '@/context/session-context';
import dataService from '@/services';
import { Field, FieldEconomics, Observation } from '@/services/types';
import { Skeleton } from '@/components/ui/skeleton';
import { useTranslations } from 'next-intl';
import L, { LatLngExpression, latLng, latLngBounds } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import { useToast } from '@/hooks/use-toast';

function MapSkeleton() {
  return <Skeleton className="w-full h-full" />;
}

export function MapClientContent() {
  const { activeCompany, loading: sessionLoading } = useSession();
  const [fields, setFields] = useState<Field[]>([]);
  const [observations, setObservations] = useState<Observation[]>([]);
  const [fieldEconomics, setFieldEconomics] = useState<Record<string, FieldEconomics>>({});
  const [loading, setLoading] = useState(true);
  
  const t = useTranslations('MapPage');
  const tDebug = useTranslations('MapDebug');
  const { toast } = useToast();
  
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const fieldLayerRef = useRef<L.FeatureGroup | null>(null);
  const observationLayerRef = useRef<L.FeatureGroup | null>(null);
  const profitabilityLayerRef = useRef<L.FeatureGroup | null>(null);

  const mapStyle = { height: '100%', width: '100%' };

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

  // Effect for initializing the map - runs only once
  useEffect(() => {
    if (!mapContainerRef.current) return;

    const map = L.map(mapContainerRef.current, {
        center: [50.9778, 11.0289], // Center on Thüringen
        zoom: 9,
        scrollWheelZoom: true,
    });
    mapInstanceRef.current = map;

    // Force map to re-evaluate its size after initialization in a flex container
    setTimeout(() => {
        map.invalidateSize();
    }, 0);

    const osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });

    const dop20Layer = L.tileLayer.wms("https://www.geoproxy.geoportal-th.de/geoproxy/services/DOP20", {
        layers: 'DOP20',
        format: 'image/png',
        transparent: true,
        version: '1.3.0',
        attribution: "DOP &copy; TLBG"
    });

    const alkisWmsLayer = L.tileLayer.wms("https://www.geoproxy.geoportal-th.de/geoproxy/services/ALKISV", {
        layers: 'Gemarkung,Flur,Flurstueck,Gebaeude,Hausnummer',
        format: 'image/png',
        transparent: true,
        version: '1.3.0',
        attribution: "ALKIS &copy; TLBG"
    });

    // Debugging event listeners
    dop20Layer.on('tileerror', (error) => {
        console.error('DOP20 Layer Error:', error);
        toast({
            variant: 'destructive',
            title: tDebug('layerErrorTitle'),
            description: tDebug('layerErrorDescription', { layerName: 'Digitale Orthophotos (DOP20)' }),
        });
    });
    alkisWmsLayer.on('tileerror', (error) => {
        console.error('ALKIS Layer Error:', error);
         toast({
            variant: 'destructive',
            title: tDebug('layerErrorTitle'),
            description: tDebug('layerErrorDescription', { layerName: 'Liegenschaftskarte (ALKIS)' }),
        });
    });

    const fieldLayer = L.featureGroup();
    const observationLayer = L.featureGroup();
    const profitabilityLayer = L.featureGroup();
    
    fieldLayerRef.current = fieldLayer;
    observationLayerRef.current = observationLayer;
    profitabilityLayerRef.current = profitabilityLayer;

    osmLayer.addTo(map);
    fieldLayer.addTo(map);
    observationLayer.addTo(map);
    
    const baseLayers = {
        "OpenStreetMap": osmLayer,
        "Digitale Orthophotos (DOP20)": dop20Layer
    };

    const overlayLayers = {
        [t('fieldsLayer')]: fieldLayer,
        [t('observationsLayer')]: observationLayer,
        [t('profitabilityLayer')]: profitabilityLayer,
        "Liegenschaftskarte (ALKIS)": alkisWmsLayer,
    };

    L.control.layers(baseLayers, overlayLayers).addTo(map);

    return () => {
        if (mapInstanceRef.current) {
            mapInstanceRef.current.remove();
            mapInstanceRef.current = null;
        }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [t, tDebug]); 

  // Effect for updating data layers - runs when data changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    const fieldLayer = fieldLayerRef.current;
    const observationLayer = observationLayerRef.current;
    const profitabilityLayer = profitabilityLayerRef.current;

    if (!map || !fieldLayer || !observationLayer || !profitabilityLayer) return;

    fieldLayer.clearLayers();
    observationLayer.clearLayers();
    profitabilityLayer.clearLayers();
    
    const fieldsWithGeometry = fields.filter(f => f.geometry && f.geometry.length > 0);

    const getProfitabilityColor = (fieldId: string, area: number) => {
        const economics = fieldEconomics[fieldId];
        if (!economics || area === 0) return '#808080'; // Gray for no data
        const marginPerHa = economics.contributionMargin / area;
        
        if (marginPerHa > 300) return '#16a34a'; // Dunkelgrün
        if (marginPerHa > 200) return '#84cc16'; // Hellgrün
        if (marginPerHa > 100) return '#facc15'; // Gelb
        if (marginPerHa >= 0) return '#f97316'; // Orange
        return '#dc2626'; // Dunkelrot
    };

    fieldsWithGeometry.forEach(field => {
        const geometry = field.geometry as LatLngExpression[];
        
        // Standard field layer
        L.polygon(geometry, { color: 'hsl(var(--primary))' })
            .bindTooltip(`<strong>${field.name}</strong><br/>${field.crop} - ${field.area} ha`)
            .addTo(fieldLayer);

        // Profitability layer
        const color = getProfitabilityColor(field.id, field.area);
        const economics = fieldEconomics[field.id];
        const marginPerHa = economics && field.area > 0 ? (economics.contributionMargin / field.area) : NaN;
        const profitabilityTooltip = `<strong>${field.name}</strong><br/>${t('contributionMarginLabel')}: ${!isNaN(marginPerHa) ? `${marginPerHa.toFixed(2)} €/ha` : 'N/A'}`;
        
        L.polygon(geometry, { color: color, fillColor: color, fillOpacity: 0.6 })
            .bindTooltip(profitabilityTooltip)
            .addTo(profitabilityLayer);
    });

    const observationsWithLocation = observations.filter(o => o.latitude && o.longitude);
    observationsWithLocation.forEach(obs => {
        L.marker([obs.latitude!, obs.longitude!])
            .bindTooltip(`<strong>${obs.title}</strong><br/>${obs.field} - ${new Date(obs.date).toLocaleDateString()}`)
            .addTo(observationLayer);
    });

    const bounds = latLngBounds([]);
    if (fieldsWithGeometry.length > 0) {
         fieldsWithGeometry.forEach(f => {
            bounds.extend(latLngBounds(f.geometry as LatLngExpression[]));
         });
    }

    if(bounds.isValid()){
        map.fitBounds(bounds.pad(0.1));
    }

  }, [fields, observations, fieldEconomics, t]);

  if (sessionLoading || loading) {
    return <MapSkeleton />;
  }

  return (
      <div ref={mapContainerRef} style={mapStyle} />
  );
}
