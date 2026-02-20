'use client';

import { MapContainer, TileLayer, Polygon, Tooltip, FeatureGroup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Field } from '@/services/types';
import { LatLngExpression, LatLngTuple, latLng, latLngBounds } from 'leaflet';
import { useMemo } from 'react';

interface FieldsMapProps {
    fields: Field[];
}

export function FieldsMap({ fields }: FieldsMapProps) {
    const fieldsWithGeometry = useMemo(() => fields.filter(f => f.geometry && f.geometry.length > 0), [fields]);

    if (fieldsWithGeometry.length === 0) {
        const center: LatLngTuple = [52.505, 13.37];
         return (
            <MapContainer center={center} zoom={10} scrollWheelZoom={false} style={{ height: '100%', width: '100%', borderRadius: 'inherit', zIndex: 0 }}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
            </MapContainer>
        );
    }

    const allPoints = fieldsWithGeometry.flatMap(f => f.geometry!.map(p => latLng(p[0], p[1])));
    const bounds = latLngBounds(allPoints).pad(0.1);

    return (
        <MapContainer bounds={bounds} scrollWheelZoom={true} style={{ height: '100%', width: '100%', borderRadius: 'inherit', zIndex: 0 }}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <FeatureGroup>
                {fieldsWithGeometry.map((field) => {
                    const geometry = field.geometry as LatLngExpression[];
                    return (
                        <Polygon key={field.id} positions={geometry}>
                            <Tooltip>
                                <strong>{field.name}</strong><br/>
                                {field.crop} - {field.area} ha
                            </Tooltip>
                        </Polygon>
                    );
                })}
            </FeatureGroup>
        </MapContainer>
    );
}
