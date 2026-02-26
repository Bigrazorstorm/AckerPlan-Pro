'use client';

import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import { useEffect, useMemo, useRef } from 'react';

interface ObservationLocationPickerProps {
  latitude?: number;
  longitude?: number;
  focusLatLng?: { lat: number; lng: number };
  fieldGeometry?: number[][];
  onChange: (lat: number, lng: number) => void;
}

const DEFAULT_CENTER: [number, number] = [50.9778, 11.0289];
const ZOOM_STORAGE_KEY = 'observation-map-zoom';

const getFieldBounds = (geometry: number[][] | undefined): L.LatLngBounds | null => {
  if (!geometry || geometry.length === 0) return null;

  const validPoints = geometry.filter(
    (point) => Array.isArray(point) && point.length >= 2 && Number.isFinite(point[0]) && Number.isFinite(point[1])
  );

  if (validPoints.length === 0) return null;

  const bounds = validPoints.reduce(
    (acc, [lat, lng]) => acc.extend([lat, lng]),
    L.latLngBounds([validPoints[0][0], validPoints[0][1]], [validPoints[0][0], validPoints[0][1]])
  );

  return bounds;
};

export function ObservationLocationPicker({ latitude, longitude, focusLatLng, fieldGeometry, onChange }: ObservationLocationPickerProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const onChangeRef = useRef(onChange);

  const mapStyle = useMemo(() => ({ height: '100%', width: '100%', borderRadius: 'inherit' }), []);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  const updateMarker = (lat: number, lng: number) => {
    if (!mapInstanceRef.current) return;

    const latLng = L.latLng(lat, lng);
    if (!markerRef.current) {
      markerRef.current = L.marker(latLng).addTo(mapInstanceRef.current);
    } else {
      markerRef.current.setLatLng(latLng);
    }
  };

  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const hasLocation = latitude != null && longitude != null;
    const initialCenter: [number, number] = hasLocation ? [latitude as number, longitude as number] : DEFAULT_CENTER;

    const savedZoom = typeof window !== 'undefined' ? localStorage.getItem(ZOOM_STORAGE_KEY) : null;
    const initialZoom = savedZoom ? parseInt(savedZoom, 10) : (hasLocation ? 15 : 12);

    const map = L.map(mapContainerRef.current, {
      center: initialCenter,
      zoom: initialZoom,
      zoomControl: true,
      scrollWheelZoom: true,
      dragging: true,
    });
    mapInstanceRef.current = map;

    map.on('zoomend', () => {
      localStorage.setItem(ZOOM_STORAGE_KEY, map.getZoom().toString());
    });

    const osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    });

    const dop20Layer = L.tileLayer.wms("https://www.geoproxy.geoportal-th.de/geoproxy/services/DOP20", {
      layers: 'DOP20',
      format: 'image/png',
      transparent: true,
      version: '1.3.0',
      attribution: "DOP &copy; TLBG",
    });

    const alkisLayer = L.tileLayer.wms("https://www.geoproxy.geoportal-th.de/geoproxy/services/ALKISV", {
      layers: 'Gemarkung,Flur,Flurstueck,Gebaeude,Hausnummer',
      format: 'image/png',
      transparent: true,
      version: '1.3.0',
      attribution: "ALKIS &copy; TLBG",
    });

    const baseLayers = {
      "OpenStreetMap": osmLayer,
      "Digitale Orthophotos (DOP20)": dop20Layer,
    };

    const overlayLayers = {
      "Liegenschaftskarte (ALKIS)": alkisLayer,
    };

    L.control.layers(baseLayers, overlayLayers).addTo(map);
    osmLayer.addTo(map);

    if (hasLocation) {
      updateMarker(latitude as number, longitude as number);
    }

    map.on('click', (event) => {
      const { lat, lng } = event.latlng;
      updateMarker(lat, lng);
      onChangeRef.current(lat, lng);
    });

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [latitude, longitude]);

  useEffect(() => {
    if (!mapInstanceRef.current) return;

    if (latitude == null || longitude == null) {
      if (markerRef.current) {
        markerRef.current.remove();
        markerRef.current = null;
      }
      return;
    }

    updateMarker(latitude, longitude);
    mapInstanceRef.current.setView([latitude, longitude], 15);
  }, [latitude, longitude]);

  useEffect(() => {
    if (!mapInstanceRef.current || !focusLatLng) return;

    const fieldBounds = getFieldBounds(fieldGeometry);
    if (fieldBounds && fieldBounds.isValid()) {
      mapInstanceRef.current.fitBounds(fieldBounds, { padding: [50, 50] });
    } else {
      mapInstanceRef.current.setView([focusLatLng.lat, focusLatLng.lng], 14);
    }
  }, [focusLatLng, fieldGeometry]);

  return <div ref={mapContainerRef} style={mapStyle} />;
}
