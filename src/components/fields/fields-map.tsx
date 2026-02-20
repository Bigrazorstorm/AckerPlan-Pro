'use client';

import { Field, Observation } from '@/services/types';
import L, { LatLngExpression, latLng, latLngBounds } from 'leaflet';
import { useMemo, useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';

import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// This setup is moved outside the component to run only once to avoid side-effects.
// It configures the default icon for all Leaflet markers.
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon.src,
  iconRetinaUrl: markerIcon2x.src,
  shadowUrl: markerShadow.src,
});


interface FieldsMapProps {
    fields: Field[];
    observations: Observation[];
}

export function FieldsMap({ fields, observations }: FieldsMapProps) {
    const t = useTranslations('FieldsPage');
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<L.Map | null>(null);
    const fieldLayerRef = useRef<L.FeatureGroup | null>(null);
    const observationLayerRef = useRef<L.FeatureGroup | null>(null);

    const mapStyle = useMemo(() => ({ height: '100%', width: '100%', borderRadius: 'inherit', zIndex: 0 }), []);

    const fieldsWithGeometry = useMemo(() => fields.filter(f => f.geometry && f.geometry.length > 0), [fields]);
    const observationsWithLocation = useMemo(() => observations.filter(o => o.latitude && o.longitude), [observations]);

    // Effect for initializing the map - runs only once
    useEffect(() => {
        if (mapContainerRef.current && !mapInstanceRef.current) {
            const map = L.map(mapContainerRef.current, {
                center: [52.505, 13.37],
                zoom: 10,
                scrollWheelZoom: true,
            });
            mapInstanceRef.current = map;

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(map);
            
            // Create layer groups and store them in refs
            fieldLayerRef.current = L.featureGroup().addTo(map);
            observationLayerRef.current = L.featureGroup().addTo(map);
            
            L.control.layers(undefined, {
                [t('fieldsLayer')]: fieldLayerRef.current,
                [t('observationsLayer')]: observationLayerRef.current
            }).addTo(map);
        }

        // Cleanup function for when the component unmounts
        return () => {
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
                mapInstanceRef.current = null;
            }
        };
    // The dependency array is empty to ensure this runs only once on mount and cleans up on unmount.
    // The 't' function from next-intl is stable and doesn't need to be a dependency.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); 

    // Effect for updating data layers - runs when data changes
    useEffect(() => {
        const map = mapInstanceRef.current;
        const fieldLayer = fieldLayerRef.current;
        const observationLayer = observationLayerRef.current;

        if (!map || !fieldLayer || !observationLayer) return;

        // Clear existing layers
        fieldLayer.clearLayers();
        observationLayer.clearLayers();
        
        // Add new field layers
        fieldsWithGeometry.forEach(field => {
            const geometry = field.geometry as LatLngExpression[];
            L.polygon(geometry, { color: 'hsl(var(--primary))' })
                .bindTooltip(`<strong>${field.name}</strong><br/>${field.crop} - ${field.area} ha`)
                .addTo(fieldLayer);
        });

        // Add new observation layers
        observationsWithLocation.forEach(obs => {
            L.marker([obs.latitude!, obs.longitude!])
                .bindTooltip(`<strong>${obs.title}</strong><br/>${obs.field} - ${new Date(obs.date).toLocaleDateString()}`)
                .addTo(observationLayer);
        });

        // Fit bounds only if there is data
        const bounds = latLngBounds([]);
        if (fieldsWithGeometry.length > 0) {
             fieldsWithGeometry.forEach(f => {
                bounds.extend(latLngBounds(f.geometry as LatLngExpression[]));
             });
        }
        if (observationsWithLocation.length > 0) {
            observationsWithLocation.forEach(o => {
                bounds.extend(latLng(o.latitude!, o.longitude!));
            });
        }

        if(bounds.isValid()){
            map.fitBounds(bounds.pad(0.1));
        }

    }, [fieldsWithGeometry, observationsWithLocation]); // This effect depends only on the memoized data

    return <div ref={mapContainerRef} style={mapStyle} />;
}
