'use client';

import L from 'leaflet';
import { useMemo, useEffect, useRef } from 'react';

import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Fix for default marker icon, run only once
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
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
    const markerRef = useRef<L.Marker | null>(null);

    const mapStyle = useMemo(() => ({ height: '100%', width: '100%', borderRadius: 'inherit', zIndex: 0 }), []);
    
    // Init effect
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
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(map);

            markerRef.current = L.marker([latitude, longitude])
              .bindTooltip('Beobachtungsstandort')
              .addTo(map)
              .openTooltip();
        }

        // Cleanup function for when the component unmounts
        return () => {
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
                mapInstanceRef.current = null;
            }
        };
    // Empty array ensures this runs only on mount/unmount
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Update effect
    useEffect(() => {
        if (mapInstanceRef.current && markerRef.current) {
            const newLatLng = L.latLng(latitude, longitude);
            mapInstanceRef.current.setView(newLatLng);
            markerRef.current.setLatLng(newLatLng);
        }
    }, [latitude, longitude]);

    return <div ref={mapContainerRef} style={mapStyle} />;
}
