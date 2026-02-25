import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { WifiOff } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Offline - AckerPlan Pro',
  description: 'Sie sind derzeit offline',
};

export default function OfflinePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <div className="text-center space-y-6 max-w-md">
        <WifiOff className="h-24 w-24 mx-auto text-muted-foreground" />
        
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">Offline</h1>
          <p className="text-lg text-muted-foreground">
            Sie sind derzeit nicht mit dem Internet verbunden.
          </p>
        </div>

        <div className="space-y-4 text-sm text-muted-foreground">
          <p>
            AckerPlan Pro benötigt eine Internetverbindung für einige Funktionen.
            Ihre zuletzt angesehenen Daten sind möglicherweise noch verfügbar.
          </p>
          
          <div className="p-4 bg-muted rounded-lg text-left space-y-2">
            <h2 className="font-semibold text-foreground">Verfügbar im Offline-Modus:</h2>
            {React.createElement('ul', { className: 'list-disc list-inside space-y-1' },
              React.createElement('li', null, 'Zuletzt angesehene Schläge'),
              React.createElement('li', null, 'Gespeicherte Karten-Ansichten'),
              React.createElement('li', null, 'Lokale Entwürfe')
            )}
          </div>
        </div>

        <div className="pt-4">
          <Link 
            href="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Zur Startseite
          </Link>
        </div>
      </div>
    </div>
  );
}
