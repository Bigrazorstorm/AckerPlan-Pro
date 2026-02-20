'use client';

import { MapContainer, TileLayer, Marker, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import * as L from 'leaflet';

// Fix for default marker icon with webpack
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

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
    const position: L.LatLngExpression = [latitude, longitude];

    return (
        <MapContainer center={position} zoom={13} style={{ height: '100%', width: '100%', borderRadius: 'inherit', zIndex: 0 }} zoomControl={false} scrollWheelZoom={false} dragging={false}>
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
