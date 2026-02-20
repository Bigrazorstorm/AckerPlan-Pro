'use client';

import L from 'leaflet';
import { useMemo, useEffect, useRef } from 'react';

import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Fix for default marker icon, run only once
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon.src,
  iconRetinaUrl: markerIcon2x.src,
  shadowUrl: markerShadow.src,
});

interface ObservationLocationMapProps {
    latitude: number;
    longitude: number;
}

export function ObservationLocationMap({ latitude, longitude }: ObservationLocationMapProps) {
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<L.Map | null>(null);

    const mapStyle = useMemo(() => ({ height: '100%', width: '100%', borderRadius: 'inherit', zIndex: 0 }), []);
    
    useEffect(() => {
        if (mapContainerRef.current && !mapInstanceRef.current) {
            const map = L.map(mapContainerRef.current, {
                center: [latitude, longitude],
                zoom: 13,
                zoomControl: false,
                scrollWheelZoom: false,
                dragging: false,
            });
            mapInstanceRef.current = map;

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; &lt;a href="https://www.openstreetmap.org/copyright"&gt;OpenStreetMap&lt;/a&gt; contributors'
            }).addTo(map);

            L.marker([latitude, longitude])
              .bindTooltip('Beobachtungsstandort')
              .addTo(map)
              .openTooltip();
        }

        // Cleanup function for React StrictMode
        return () => {
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
                mapInstanceRef.current = null;
            }
        };
    }, [latitude, longitude]); // Re-run if coordinates change

    return &lt;div ref={mapContainerRef} style={mapStyle} /&gt;;
}
