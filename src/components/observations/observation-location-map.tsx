'use client';

import { MapContainer, TileLayer, Marker, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css';
import * as L from 'leaflet';
import 'leaflet-defaulticon-compatibility';

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
