'use client';

import { useEffect, useRef, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertTriangle, RefreshCw, Layers } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Static CSS imports for Leaflet - required for map rendering
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';

// Sample field data
const SAMPLE_FIELDS = [
  { id: '1', name: 'Mühlfeld Ost', area: 12.5, lat: 50.98, lng: 11.03 },
  { id: '2', name: 'Bachwiese', area: 8.3, lat: 50.99, lng: 11.04 },
  { id: '3', name: 'Südfeld', area: 15.2, lat: 50.97, lng: 11.02 },
];

export function SimpleMapContent() {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('Map useEffect triggered, container:', !!mapContainerRef.current);
    let map: any = null;

    const initMap = async () => {
      if (!mapContainerRef.current) {
        // Wait until the container is mounted
        setTimeout(initMap, 50);
        return;
      }

      console.log('Initializing map...');
      try {
        // Dynamic import for Leaflet
        const leaflet = await import('leaflet');
        const L = leaflet.default;
        
        // Create map
        map = L.map(mapContainerRef.current!, {
          center: [50.98, 11.03],
          zoom: 13,
          scrollWheelZoom: true,
        });
        
        // Add OSM tile layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; OpenStreetMap',
          maxZoom: 19,
        }).addTo(map);
        
        // Add sample field circles
        SAMPLE_FIELDS.forEach((field) => {
          L.circle([field.lat, field.lng], {
            radius: 500,
            color: '#16a34a',
            fillColor: '#16a34a',
            fillOpacity: 0.3,
          })
          .bindPopup(`<strong>${field.name}</strong><br/>${field.area} ha`)
          .addTo(map);
        });
        
        console.log('Map initialized successfully!');
        setIsLoading(false);
      } catch (err) {
        console.error('Map error:', err);
        setError(err instanceof Error ? err.message : 'Map failed to load');
        setIsLoading(false);
      }
    };

    initMap();

    // Safety timeout - prevent infinite loading
    const safetyTimeout = setTimeout(() => {
      if (isLoading) {
        console.log('Safety timeout triggered - forcing loading to false');
        setIsLoading(false);
      }
    }, 5000);

    return () => {
      clearTimeout(safetyTimeout);
      if (map) {
        map.remove();
      }
    };
  }, []);

  if (error) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-muted/20 p-4">
        <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-destructive" />
        <h3 className="text-lg font-semibold mb-2">Kartenfehler</h3>
        <p className="text-sm text-muted-foreground mb-4">{error}</p>
        <Button variant="outline" onClick={() => window.location.reload()}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Neu laden
        </Button>
      </div>
    );
  }

  return (
    <div className="relative" style={{ height: '100%', width: '100%', minHeight: '400px' }}>
      <div ref={mapContainerRef} style={{ height: '100%', width: '100%' }} />
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted/20">
          <div className="text-center">
            <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">Karte wird geladen...</p>
          </div>
        </div>
      )}
      
      {/* Legend */}
      <div className="absolute bottom-4 right-4 bg-white rounded-lg shadow-md p-3 z-[1000] text-sm">
        <div className="flex items-center gap-2 mb-1">
          <Layers className="h-4 w-4" />
          <span className="font-medium">Legende</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-600 opacity-50 rounded"></div>
          <span>Schläge</span>
        </div>
      </div>
    </div>
  );
}
