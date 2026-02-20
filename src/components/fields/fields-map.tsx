'use client';

import { Field, Observation } from '@/services/types';
import L, { LatLngExpression, latLng, latLngBounds } from 'leaflet';
import { useMemo, useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';

import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// This setup is moved outside the component to run only once.
delete (L.Icon.Default.prototype as any)._getIconUrl;
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

    const mapStyle = useMemo(() => ({ height: '100%', width: '100%', borderRadius: 'inherit', zIndex: 0 }), []);

    const fieldsWithGeometry = useMemo(() => fields.filter(f => f.geometry && f.geometry.length > 0), [fields]);
    const observationsWithLocation = useMemo(() => observations.filter(o => o.latitude && o.longitude), [observations]);

    useEffect(() => {
        // This effect hook handles the entire lifecycle of the Leaflet map.
        if (mapContainerRef.current && !mapInstanceRef.current) {
            // 1. Initialize the map ONLY if it hasn't been created yet.
            const map = L.map(mapContainerRef.current, {
                center: [52.505, 13.37],
                zoom: 10,
                scrollWheelZoom: true,
            });
            mapInstanceRef.current = map;

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(map);
            
            const fieldLayer = L.featureGroup();
            fieldsWithGeometry.forEach(field => {
                const geometry = field.geometry as LatLngExpression[];
                L.polygon(geometry, { color: 'hsl(var(--primary))' })
                    .bindTooltip(`&lt;strong&gt;${field.name}&lt;/strong&gt;&lt;br/&gt;${field.crop} - ${field.area} ha`)
                    .addTo(fieldLayer);
            });

            const observationLayer = L.featureGroup();
            observationsWithLocation.forEach(obs => {
                L.marker([obs.latitude!, obs.longitude!])
                    .bindTooltip(`&lt;strong&gt;${obs.title}&lt;/strong&gt;&lt;br/&gt;${obs.field} - ${new Date(obs.date).toLocaleDateString()}`)
                    .addTo(observationLayer);
            });

            const layersControl = L.control.layers(undefined, {
                [t('fieldsLayer')]: fieldLayer,
                [t('observationsLayer')]: observationLayer
            }).addTo(map);

            fieldLayer.addTo(map);
            observationLayer.addTo(map);

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
        }

        // 2. The cleanup function is crucial for React 18 Strict Mode.
        return () => {
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
                mapInstanceRef.current = null;
            }
        };
    }, [fields, observations, t]); // Rerun effect if data changes

    // 3. We render a simple div that Leaflet will take control of.
    return &lt;div ref={mapContainerRef} style={mapStyle} /&gt;;
}
