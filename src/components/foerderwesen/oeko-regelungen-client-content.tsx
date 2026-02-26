'use client';

import { useState, useEffect } from 'react';
import { useSession } from '@/context/session-context';
import { mockGapService } from '@/services/mock-gap-service';
import { EcoSchemeApplication, EcoSchemeType } from '@/services/gap-types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { CheckCircle2, XCircle, AlertCircle, Leaf, Euro, TrendingUp } from 'lucide-react';

const ECO_SCHEME_INFO: Record<EcoSchemeType, { name: string; description: string; rate: number; unit: string }> = {
  [EcoSchemeType.ECO_1A]: {
    name: 'ÖR 1a: Biodiversitätsflächen',
    description: 'Bereitstellung von Flächen für Biodiversität und Habitate',
    rate: 600,
    unit: '€/ha',
  },
  [EcoSchemeType.ECO_1B]: {
    name: 'ÖR 1b: Blühstreifen',
    description: 'Anlage von Blühstreifen in Ackerflächen für Bestäuber',
    rate: 650,
    unit: '€/ha',
  },
  [EcoSchemeType.ECO_2]: {
    name: 'ÖR 2: Vielfältige Kulturen',
    description: 'Anbau von mindestens 5 verschiedenen Kulturen auf Ackerflächen',
    rate: 30,
    unit: '€/ha',
  },
  [EcoSchemeType.ECO_3]: {
    name: 'ÖR 3: Agroforst',
    description: 'Beibehaltung von Agroforst-Systemen (Bäume auf Ackerflächen)',
    rate: 200,
    unit: '€/ha',
  },
  [EcoSchemeType.ECO_4]: {
    name: 'ÖR 4: Extensivgrünland',
    description: 'Extensive Bewirtschaftung von Dauergrünland ohne Düngung',
    rate: 150,
    unit: '€/ha',
  },
  [EcoSchemeType.ECO_5]: {
    name: 'ÖR 5: Ergebnisorientiert',
    description: 'Ergebnisorientierte extensive Bewirtschaftung mit Nachweispflicht',
    rate: 240,
    unit: '€/ha',
  },
  [EcoSchemeType.ECO_6]: {
    name: 'ÖR 6: Ohne chem. Pflanzenschutz',
    description: 'Bewirtschaftung von Acker- und Dauerkulturflächen ohne chemischen Pflanzenschutz',
    rate: 70,
    unit: '€/ha',
  },
  [EcoSchemeType.ECO_7]: {
    name: 'ÖR 7: Präzisionslandwirtschaft',
    description: 'Anwendung von Präzisionslandwirtschaftstechnologien zur Ressourcenoptimierung',
    rate: 40,
    unit: '€/ha',
  },
};

// Mock farm analysis data: in production this would be derived from actual farm records,
// field data, and historical operations via a real backend service.
const FARM_POTENTIAL: Record<EcoSchemeType, { status: 'erfüllt' | 'nicht erfüllt' | 'knapp'; recommendedArea: number }> = {
  [EcoSchemeType.ECO_1A]: { status: 'nicht erfüllt', recommendedArea: 3.0 },
  [EcoSchemeType.ECO_1B]: { status: 'erfüllt', recommendedArea: 2.5 },
  [EcoSchemeType.ECO_2]: { status: 'knapp', recommendedArea: 45.0 },
  [EcoSchemeType.ECO_3]: { status: 'nicht erfüllt', recommendedArea: 0 },
  [EcoSchemeType.ECO_4]: { status: 'erfüllt', recommendedArea: 12.0 },
  [EcoSchemeType.ECO_5]: { status: 'nicht erfüllt', recommendedArea: 5.0 },
  [EcoSchemeType.ECO_6]: { status: 'knapp', recommendedArea: 20.0 },
  [EcoSchemeType.ECO_7]: { status: 'nicht erfüllt', recommendedArea: 98.5 },
};

function LoadingSkeleton() {
  return (
    <div className="space-y-4">
      {[...Array(4)].map((_, i) => (
        <Card key={i}>
          <CardContent className="pt-4">
            <Skeleton className="h-16 w-full" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export function OekoRegelungenClientContent() {
  const { activeCompany } = useSession();
  const [ecoSchemes, setEcoSchemes] = useState<EcoSchemeApplication[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!activeCompany) return;
    const fetch = async () => {
      setLoading(true);
      try {
        const data = await mockGapService.getEcoSchemes(activeCompany.id, 2026);
        setEcoSchemes(data);
      } catch (err) {
        console.error('Failed to load eco schemes:', err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [activeCompany]);

  if (!activeCompany) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-muted-foreground">Bitte wählen Sie zuerst ein Unternehmen aus.</p>
        </CardContent>
      </Card>
    );
  }

  if (loading) return <LoadingSkeleton />;

  // Calculate unclaimed potential
  const appliedTypes = new Set(ecoSchemes.map((s) => s.type));
  const unclaimedPotential = Object.entries(FARM_POTENTIAL)
    .filter(([type, p]) => !appliedTypes.has(type as EcoSchemeType) && p.status !== 'nicht erfüllt' && p.recommendedArea > 0)
    .reduce((sum, [type, p]) => {
      const info = ECO_SCHEME_INFO[type as EcoSchemeType];
      return sum + info.rate * p.recommendedArea;
    }, 0);

  const totalApplied = ecoSchemes.reduce((sum, s) => sum + s.expectedPayment, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
          Öko-Regelungen Potenzialanalyse
        </h1>
        <p className="text-muted-foreground">
          Automatische Analyse der Öko-Regelungen für Ihren Betrieb
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-1">
              <Euro className="h-3 w-3" />
              Bereits beantragt
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-700">
              {totalApplied.toLocaleString('de-DE')} €
            </div>
            <p className="text-xs text-muted-foreground mt-1">{ecoSchemes.length} Öko-Regelung(en) aktiv</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              Ungenutztes Potenzial
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {unclaimedPotential.toLocaleString('de-DE')} €
            </div>
            <p className="text-xs text-muted-foreground mt-1">Zusätzlich erreichbar</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-1">
              <Leaf className="h-3 w-3" />
              Erfüllte Standards
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Object.values(FARM_POTENTIAL).filter((p) => p.status === 'erfüllt').length}/
              {Object.keys(FARM_POTENTIAL).length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Öko-Regelungen erfüllt</p>
          </CardContent>
        </Card>
      </div>

      {/* Unclaimed Highlight */}
      {unclaimedPotential > 0 && (
        <Card className="border-orange-200 bg-orange-50 dark:bg-orange-950/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-800 dark:text-orange-200">
              <TrendingUp className="h-5 w-5" />
              Ungenutztes Förderpotenzial: {unclaimedPotential.toLocaleString('de-DE')} €/Jahr
            </CardTitle>
            <CardDescription className="text-orange-700 dark:text-orange-300">
              Ihr Betrieb erfüllt bereits die Voraussetzungen für weitere Öko-Regelungen, ohne diese beantragt zu haben.
              Handeln Sie jetzt vor dem 15. Mai!
            </CardDescription>
          </CardHeader>
        </Card>
      )}

      {/* Eco-Scheme Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Detailanalyse Öko-Regelungen 2026</CardTitle>
          <CardDescription>
            Automatische Bewertung auf Basis Ihrer Betriebsdaten
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {Object.entries(ECO_SCHEME_INFO).map(([type, info]) => {
            const ecoType = type as EcoSchemeType;
            const potential = FARM_POTENTIAL[ecoType];
            const applied = ecoSchemes.find((s) => s.type === ecoType);
            const achievablePremium = info.rate * potential.recommendedArea;

            return (
              <div key={type} className="p-4 border rounded-lg space-y-2">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    {potential.status === 'erfüllt' && <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />}
                    {potential.status === 'nicht erfüllt' && <XCircle className="h-5 w-5 text-red-500 flex-shrink-0" />}
                    {potential.status === 'knapp' && <AlertCircle className="h-5 w-5 text-orange-500 flex-shrink-0" />}
                    <div className="min-w-0">
                      <div className="font-medium text-sm">{info.name}</div>
                      <div className="text-xs text-muted-foreground">{info.description}</div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1 flex-shrink-0">
                    <Badge
                      variant={
                        potential.status === 'erfüllt' ? 'default' :
                        potential.status === 'knapp' ? 'secondary' : 'destructive'
                      }
                    >
                      {potential.status}
                    </Badge>
                    {applied && (
                      <Badge variant="outline" className="text-xs">
                        {applied.status === 'applied' ? 'Beantragt' : 'Geplant'}
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="flex items-center justify-between pt-1 border-t text-sm">
                  <span className="text-muted-foreground">
                    {info.rate} {info.unit}
                    {potential.recommendedArea > 0 && ` × ${potential.recommendedArea} ha`}
                  </span>
                  <div className="flex items-center gap-2">
                    {achievablePremium > 0 && (
                      <span className={`font-medium ${applied ? 'text-green-700' : potential.status !== 'nicht erfüllt' ? 'text-orange-600' : 'text-muted-foreground'}`}>
                        {achievablePremium.toLocaleString('de-DE')} €{potential.status !== 'erfüllt' && !applied ? '/Jahr möglich' : '/Jahr'}
                      </span>
                    )}
                    {!applied && potential.status !== 'nicht erfüllt' && (
                      <Button size="sm" variant="outline">
                        Beantragen
                      </Button>
                    )}
                  </div>
                </div>
                {potential.status === 'knapp' && (
                  <div className="text-xs text-orange-600 bg-orange-50 dark:bg-orange-950/20 p-2 rounded">
                    💡 Empfehlung: Mit kleinen Anpassungen können Sie diese Öko-Regelung vollständig erfüllen.
                  </div>
                )}
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}
