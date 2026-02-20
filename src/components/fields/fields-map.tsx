'use client';

import { MapContainer, TileLayer, Polygon, Tooltip, FeatureGroup, LayersControl, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Field, Observation } from '@/services/types';
import L, { LatLngExpression, LatLngTuple, latLng, latLngBounds } from 'leaflet';
import { useMemo } from 'react';
import { useTranslations } from 'next-intl';

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

interface FieldsMapProps {
    fields: Field[];
    observations: Observation[];
}

export function FieldsMap({ fields, observations }: FieldsMapProps) {
    const t = useTranslations('FieldsPage');
    const fieldsWithGeometry = useMemo(() => fields.filter(f => f.geometry && f.geometry.length > 0), [fields]);
    const observationsWithLocation = useMemo(() => observations.filter(o => o.latitude && o.longitude), [observations]);

    const hasData = fieldsWithGeometry.length > 0 || observationsWithLocation.length > 0;

    if (!hasData) {
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

    const fieldPoints = fieldsWithGeometry.flatMap(f => f.geometry!.map(p => latLng(p[0], p[1])));
    const observationPoints = observationsWithLocation.map(o => latLng(o.latitude!, o.longitude!));
    const allPoints = [...fieldPoints, ...observationPoints];
    const bounds = allPoints.length > 0 ? latLngBounds(allPoints).pad(0.1) : null;

    return (
        <MapContainer bounds={bounds || undefined} center={bounds ? undefined : [52.505, 13.37]} zoom={bounds ? undefined : 10} scrollWheelZoom={true} style={{ height: '100%', width: '100%', borderRadius: 'inherit', zIndex: 0 }}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            <LayersControl position="topright">
                <LayersControl.Overlay checked name={t('fieldsLayer')}>
                    <FeatureGroup>
                        {fieldsWithGeometry.map((field) => {
                            const geometry = field.geometry as LatLngExpression[];
                            return (
                                <Polygon key={field.id} positions={geometry} pathOptions={{ color: 'hsl(var(--primary))' }}>
                                    <Tooltip>
                                        <strong>{field.name}</strong><br/>
                                        {field.crop} - {field.area} ha
                                    </Tooltip>
                                </Polygon>
                            );
                        })}
                    </FeatureGroup>
                </LayersControl.Overlay>
                <LayersControl.Overlay checked name={t('observationsLayer')}>
                     <FeatureGroup>
                        {observationsWithLocation.map((obs) => (
                           <Marker key={obs.id} position={[obs.latitude!, obs.longitude!]}>
                               <Tooltip>
                                   <strong>{obs.title}</strong><br/>
                                   {obs.field} - {new Date(obs.date).toLocaleDateString()}
                               </Tooltip>
                           </Marker>
                        ))}
                     </FeatureGroup>
                </LayersControl.Overlay>
            </LayersControl>
        </MapContainer>
    );
}
