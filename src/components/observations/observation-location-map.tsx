'use client';

import { MapContainer, TileLayer, Marker, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import * as L from 'leaflet';
import { useEffect, useState, useMemo } from 'react';

// Fix for default marker icon with webpack
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

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
    const position: L.LatLngExpression = [latitude, longitude];
    const [isMounted, setIsMounted] = useState(false);
    
    const mapStyle = useMemo(() => ({ height: '100%', width: '100%', borderRadius: 'inherit', zIndex: 0 }), []);

    useEffect(() => {
      setIsMounted(true);
    }, [])

    if(!isMounted) {
      return null;
    }

    return (
        <MapContainer key={`${latitude}-${longitude}`} center={position} zoom={13} style={mapStyle} zoomControl={false} scrollWheelZoom={false} dragging={false}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={position}>
                <Tooltip>
                    Beobachtungsstandort
                </Tooltip>
            </Marker>
        </MapContainer>
    );
}
