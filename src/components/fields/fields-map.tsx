'use client';

import { Field, Observation } from '@/services/types';
import L, { LatLngExpression, latLng, latLngBounds } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import 'leaflet-defaulticon-compatibility';
import { useMemo, useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';


interface FieldsMapProps {
    fields: Field[];
    observations: Observation[];
}

export function FieldsMap({ fields, observations }: FieldsMapProps) {
    const t = useTranslations('FieldsPage');
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<L.Map | null>(null);
    const fieldLayerRef = useRef<L.FeatureGroup | null>(null);
    const observationLayerRef = useRef<L.FeatureGroup | null>(null);

    const mapStyle = useMemo(() => ({ height: '100%', width: '100%', borderRadius: 'inherit', zIndex: 0 }), []);

    const fieldsWithGeometry = useMemo(() => fields.filter(f => f.geometry && f.geometry.length > 0), [fields]);
    const observationsWithLocation = useMemo(() => observations.filter(o => o.latitude && o.longitude), [observations]);

    // Effect for initializing the map - runs only once
    useEffect(() => {
        if (mapContainerRef.current && !mapInstanceRef.current) {
            const map = L.map(mapContainerRef.current, {
                center: [50.9778, 11.0289], // Center on Thüringen
                zoom: 9,
                scrollWheelZoom: true,
            });
            mapInstanceRef.current = map;

            const osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            });

            const dop20Layer = L.tileLayer.wms("https://www.geoproxy.geoportal-th.de/geoproxy/services/DOP20", {
                layers: 'dop20-th',
                format: 'image/jpeg',
                transparent: false,
                attribution: "DOP &copy; TLBG"
            });

            const alkisWmsLayer = L.tileLayer.wms("https://www.geoproxy.geoportal-th.de/geoproxy/services/ALKISV", {
                layers: 'Gemarkung,Flur,Flurstueck,Gebaeude,Hausnummer',
                format: 'image/png',
                transparent: true,
                attribution: "ALKIS &copy; TLBG"
            });
            
            // Create layer groups and store them in refs
            const fieldLayer = L.featureGroup();
            const observationLayer = L.featureGroup();
            
            fieldLayerRef.current = fieldLayer;
            observationLayerRef.current = observationLayer;

            // Add default layers to map
            osmLayer.addTo(map);
            fieldLayer.addTo(map);
            observationLayer.addTo(map);
            
            const baseLayers = {
                "OpenStreetMap": osmLayer,
                "Digitale Orthophotos (DOP20)": dop20Layer
            };

            const overlayLayers = {
                "Liegenschaftskarte (ALKIS)": alkisWmsLayer,
                [t('fieldsLayer')]: fieldLayer,
                [t('observationsLayer')]: observationLayer
            };

            L.control.layers(baseLayers, overlayLayers).addTo(map);
        }

        // Cleanup function for when the component unmounts
        return () => {
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
                mapInstanceRef.current = null;
            }
        };
    // The dependency array is empty to ensure this runs only once on mount and cleans up on unmount.
    // The 't' function from next-intl is stable and doesn't need to be a dependency.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); 

    // Effect for updating data layers - runs when data changes
    useEffect(() => {
        const map = mapInstanceRef.current;
        const fieldLayer = fieldLayerRef.current;
        const observationLayer = observationLayerRef.current;

        if (!map || !fieldLayer || !observationLayer) return;

        // Clear existing layers
        fieldLayer.clearLayers();
        observationLayer.clearLayers();
        
        // Add new field layers
        fieldsWithGeometry.forEach(field => {
            const geometry = field.geometry as LatLngExpression[];
            L.polygon(geometry, { color: 'hsl(var(--primary))' })
                .bindTooltip(`<strong>${field.name}</strong><br/>${field.crop} - ${field.area} ha`)
                .addTo(fieldLayer);
        });

        // Add new observation layers
        observationsWithLocation.forEach(obs => {
            L.marker([obs.latitude!, obs.longitude!])
                .bindTooltip(`<strong>${obs.title}</strong><br/>${obs.field} - ${new Date(obs.date).toLocaleDateString()}`)
                .addTo(observationLayer);
        });

        // Fit bounds only if there is data
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

    }, [fieldsWithGeometry, observationsWithLocation]); // This effect depends only on the memoized data

    // 3. We render a simple div that Leaflet will take control of.
    return <div ref={mapContainerRef} style={mapStyle} />;
}
