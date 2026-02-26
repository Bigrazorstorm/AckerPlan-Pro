'use client';

import { useState, useEffect } from 'react';
import { useSession } from '@/context/session-context';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { mockGapService } from '@/services/mock-gap-service';
import {
  GloezCompliance,
  GloezStandard,
  Deadline,
  GapOverview,
  EcoSchemeApplication,
} from '@/services/gap-types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
  Calendar,
  Euro,
  FileText,
  TrendingUp,
  Leaf,
  Clock,
} from 'lucide-react';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';

function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <Skeleton className="h-4 w-24" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16" />
            </CardContent>
          </Card>
        ))}
      </div>
      <Skeleton className="h-96 w-full" />
    </div>
  );
}

export function FoerderwesenClientContent() {
  const { activeCompany } = useSession();
  const t = useTranslations('Foerderwesen');
  const tCommon = useTranslations('Common');

  const [overview, setOverview] = useState<GapOverview | null>(null);
  const [gloezCompliance, setGloezCompliance] = useState<GloezCompliance[]>([]);
  const [deadlines, setDeadlines] = useState<Deadline[]>([]);
  const [ecoSchemes, setEcoSchemes] = useState<EcoSchemeApplication[]>([]);
  const [loading, setLoading] = useState(true);

  const currentYear = 2026;

  useEffect(() => {
    if (!activeCompany) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const [overviewData, complianceData, deadlinesData, schemesData] = await Promise.all([
          mockGapService.getGapOverview(activeCompany.id, currentYear),
          mockGapService.getGloezCompliance(activeCompany.id),
          mockGapService.getUpcomingDeadlines(activeCompany.id, 60),
          mockGapService.getEcoSchemes(activeCompany.id, currentYear),
        ]);

        setOverview(overviewData);
        setGloezCompliance(complianceData);
        setDeadlines(deadlinesData);
        setEcoSchemes(schemesData);
      } catch (error) {
        console.error('Failed to load GAP data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [activeCompany]);

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (!overview) {
    return <div>Keine Daten verfügbar</div>;
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'compliant':
        return <CheckCircle2 className="h-5 w-5 text-green-600" />;
      case 'non-compliant':
        return <AlertTriangle className="h-5 w-5 text-red-600" />;
      case 'at-risk':
        return <AlertCircle className="h-5 w-5 text-orange-600" />;
      default:
        return null;
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'compliant':
        return 'default' as const;
      case 'non-compliant':
        return 'destructive' as const;
      case 'at-risk':
        return 'destructive' as const;
      default:
        return 'secondary' as const;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'text-red-600';
      case 'high':
        return 'text-orange-600';
      case 'medium':
        return 'text-yellow-600';
      default:
        return 'text-blue-600';
    }
  };

  const gloezStandardNames: Record<GloezStandard, string> = {
    [GloezStandard.GLOEZ_1]: 'GLÖZ 1: Erhaltung Dauergrünland',
    [GloezStandard.GLOEZ_2]: 'GLÖZ 2: Schutz Feuchtgebiete',
    [GloezStandard.GLOEZ_3]: 'GLÖZ 3: Verbot Stoppelfeldabbrennen',
    [GloezStandard.GLOEZ_4]: 'GLÖZ 4: Pufferstreifen',
    [GloezStandard.GLOEZ_5]: 'GLÖZ 5: Erosionsschutz',
    [GloezStandard.GLOEZ_6]: 'GLÖZ 6: Mindestbodenbedeckung',
    [GloezStandard.GLOEZ_7]: 'GLÖZ 7: Fruchtwechsel',
    [GloezStandard.GLOEZ_8]: 'GLÖZ 8: Nicht-produktive Flächen',
    [GloezStandard.GLOEZ_9]: 'GLÖZ 9: Dauergrünland-Schutz',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            GAP-Förderung {currentYear}
          </h1>
          <p className="text-muted-foreground">
            Gemeinsame Agrarpolitik • GLÖZ • Öko-Regelungen
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Link href="foerderwesen/fristen">
            <Button variant="outline">
              <Calendar className="h-4 w-4 mr-2" />
              Fristenkalender
            </Button>
          </Link>
          <Link href="foerderwesen/oeko-regelungen">
            <Button variant="outline">
              <Leaf className="h-4 w-4 mr-2" />
              Öko-Regelungen
            </Button>
          </Link>
          <Link href="foerderwesen/sammelantrag">
            <Button>
              <FileText className="h-4 w-4 mr-2" />
              Sammelantrag stellen
            </Button>
          </Link>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-1">
              <Euro className="h-3 w-3" />
              Erwartete Förderung
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {overview.expectedPayments.total.toLocaleString('de-DE')} €
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Basis: {overview.expectedPayments.basisPremium.toLocaleString('de-DE')} € • 
              Öko: {overview.expectedPayments.ecoSchemes.toLocaleString('de-DE')} €
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-1">
              <CheckCircle2 className="h-3 w-3" />
              GLÖZ-Konformität
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {overview.gloezCompliance.compliant}/9
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {overview.gloezCompliance.nonCompliant > 0 && (
                <span className="text-red-600 font-medium">
                  {overview.gloezCompliance.nonCompliant} nicht konform
                </span>
              )}
              {overview.gloezCompliance.atRisk > 0 && (
                <span className="text-orange-600 font-medium">
                  {overview.gloezCompliance.nonCompliant > 0 ? ' • ' : ''}
                  {overview.gloezCompliance.atRisk} gefährdet
                </span>
              )}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              Fristen
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {overview.upcomingDeadlines}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Anstehend in 60 Tagen
              {overview.missedDeadlines > 0 && (
                <span className="text-red-600 font-medium">
                  {' '}• {overview.missedDeadlines} überfällig
                </span>
              )}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-1">
              <Leaf className="h-3 w-3" />
              Öko-Regelungen
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{ecoSchemes.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {ecoSchemes.reduce((sum, s) => sum + s.area, 0).toFixed(1)} ha Fläche
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Critical Issues Alert */}
      {overview.gloezCompliance.nonCompliant > 0 && (
        <Card className="border-red-200 bg-red-50 dark:bg-red-950/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-900 dark:text-red-200">
              <AlertTriangle className="h-5 w-5" />
              Kritische GLÖZ-Verstöße
            </CardTitle>
            <CardDescription className="text-red-700 dark:text-red-300">
              {overview.gloezCompliance.nonCompliant} Standard(s) nicht eingehalten - 
              Kürzungen oder Ausschluss drohen
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {gloezCompliance
                .filter((c) => c.status === 'non-compliant')
                .map((compliance) => (
                  <div key={compliance.standard} className="flex items-start gap-3 p-3 bg-white dark:bg-gray-900 rounded-lg">
                    <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm">
                        {gloezStandardNames[compliance.standard]}
                      </div>
                      {compliance.issues.map((issue) => (
                        <div key={issue.id} className="text-sm text-muted-foreground mt-1">
                          {issue.description}
                        </div>
                      ))}
                    </div>
                    <Button size="sm" variant="outline">
                      Details
                    </Button>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* GLÖZ Standards Overview */}
      <Card>
        <CardHeader>
          <CardTitle>GLÖZ-Standards {currentYear}</CardTitle>
          <CardDescription>
            Guter landwirtschaftlicher und ökologischer Zustand
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {gloezCompliance.map((compliance) => (
              <div
                key={compliance.standard}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  {getStatusIcon(compliance.status)}
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm">
                      {gloezStandardNames[compliance.standard]}
                    </div>
                    {compliance.notes && (
                      <div className="text-sm text-muted-foreground truncate">
                        {compliance.notes}
                      </div>
                    )}
                    {compliance.issues.length > 0 && (
                      <div className="text-sm text-orange-600 mt-1">
                        {compliance.issues.length} Problem(e) erkannt
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={getStatusBadgeVariant(compliance.status)}>
                    {compliance.status === 'compliant' && 'Konform'}
                    {compliance.status === 'non-compliant' && 'Nicht konform'}
                    {compliance.status === 'at-risk' && 'Gefährdet'}
                    {compliance.status === 'not-applicable' && 'n.a.'}
                  </Badge>
                  <Link href={`/de/foerderwesen/gloez/${compliance.standard}`}>
                    <Button size="sm" variant="ghost">
                      Prüfen
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Upcoming Deadlines */}
      {deadlines.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Anstehende Fristen
            </CardTitle>
            <CardDescription>Nächste 60 Tage</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {deadlines.slice(0, 5).map((deadline) => {
                const daysUntil = Math.ceil(
                  (deadline.date.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
                );
                return (
                  <div
                    key={deadline.id}
                    className="flex items-start justify-between p-3 border rounded-lg"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">{deadline.description}</span>
                        <Badge variant={deadline.priority === 'critical' ? 'destructive' : 'secondary'}>
                          {deadline.priority}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        {format(deadline.date, 'dd. MMMM yyyy', { locale: de })}
                        <span className={`ml-2 font-medium ${getPriorityColor(deadline.priority)}`}>
                          {daysUntil > 0 ? `in ${daysUntil} Tagen` : 'Heute'}
                        </span>
                      </div>
                    </div>
                    <Button size="sm" variant="outline">
                      Details
                    </Button>
                  </div>
                );
              })}
            </div>
            {deadlines.length > 5 && (
              <Link href="foerderwesen/fristen">
                <Button variant="ghost" className="w-full mt-4">
                  Alle {deadlines.length} Fristen anzeigen
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>
      )}

      {/* Eco-Schemes */}
      {ecoSchemes.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Leaf className="h-5 w-5" />
              Öko-Regelungen {currentYear}
            </CardTitle>
            <CardDescription>
              Zusätzliche Förderung für umweltfreundliche Bewirtschaftung
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {ecoSchemes.map((scheme) => (
                <div
                  key={scheme.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex-1">
                    <div className="font-medium text-sm">{scheme.type}</div>
                    <div className="text-sm text-muted-foreground">
                      {scheme.area.toFixed(1)} ha • {scheme.expectedPayment.toLocaleString('de-DE')} €
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant={scheme.status === 'applied' ? 'default' : 'secondary'}>
                      {scheme.status === 'planned' && 'Geplant'}
                      {scheme.status === 'applied' && 'Beantragt'}
                      {scheme.status === 'approved' && 'Genehmigt'}
                    </Badge>
                    <Button size="sm" variant="ghost">
                      Details
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            <Link href="foerderwesen/oeko-regelungen">
              <Button variant="outline" className="w-full mt-4">
                <Leaf className="h-4 w-4 mr-2" />
                Potenzialanalyse öffnen
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
