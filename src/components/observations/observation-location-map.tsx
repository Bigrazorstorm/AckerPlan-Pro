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

            const dop20Layer = L.tileLayer.wms("https://www.geoproxy.geoportal-th.de/geoproxy/services/DOP20", {
                layers: 'DOP20',
                format: 'image/png',
                transparent: false,
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

            const baseLayers = {
                "OpenStreetMap": osmLayer,
                "Digitale Orthophotos (DOP20)": dop20Layer
            };

            const overlayLayers = {
                "Liegenschaftskarte (ALKIS)": alkisWmsLayer
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
