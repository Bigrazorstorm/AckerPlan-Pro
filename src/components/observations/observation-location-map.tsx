'use client';

import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import 'leaflet-defaulticon-compatibility';
import { useMemo, useEffect, useRef } from 'react';


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
                zoom: 15,
                zoomControl: true,
                scrollWheelZoom: true,
                dragging: true,
            });
            mapInstanceRef.current = map;

            const osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            });

            const alkisWmsLayer = L.tileLayer.wms("https://geoproxy.landesvermessung.thueringen.de/geoproxy/services/wms_alkis_querformat/MapServer/WMSServer?", {
                layers: 'Gemarkung,Flur,Flurstueck,Gebaeude,Hausnummer',
                format: 'image/png',
                transparent: true,
                attribution: "Liegenschaftskarte &copy; TLBG"
            });
            
            alkisWmsLayer.addTo(map);

            const baseLayers = {
                "OpenStreetMap": osmLayer
            };

            const overlayLayers = {
                "Liegenschaftskarte": alkisWmsLayer
            };

            L.control.layers(baseLayers, overlayLayers).addTo(map);
            osmLayer.addTo(map); // Default base layer

            const marker = L.marker([latitude, longitude])
              .bindTooltip('Beobachtungsstandort')
              .addTo(map)
              .openTooltip();
            
            markerRef.current = marker;
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
            mapInstanceRef.current.setView(newLatLng, 15);
            markerRef.current.setLatLng(newLatLng);
        }
    }, [latitude, longitude]);

    return <div ref={mapContainerRef} style={mapStyle} />;
}
