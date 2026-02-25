'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from '@/context/session-context';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { mockGapService } from '@/services/mock-gap-service';
import { mockFieldService } from '@/services/mock-field-service';
import { mockOperationService } from '@/services/mock-operation-service';
import { gloezComplianceChecker } from '@/services/gloez-compliance-checker';
import { GloezStandard, GloezCompliance, GloezIssue } from '@/services/gap-types';
import { FieldListItem } from '@/services/field-types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  Info,
  RefreshCw,
  FileText,
  MapPin,
  Calendar,
  TrendingUp,
  Lightbulb,
} from 'lucide-react';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';

interface GloezDetailClientContentProps {
  standard: GloezStandard;
}

const gloezInfo: Record<GloezStandard, {
  title: string;
  shortTitle: string;
  description: string;
  requirements: string[];
  documentation: string[];
}> = {
  [GloezStandard.GLOEZ_1]: {
    title: 'GLÖZ 1: Erhaltung von Dauergrünland',
    shortTitle: 'Dauergrünland',
    description: 'Dauergrünland darf nicht ohne Genehmigung umgebrochen oder in Ackerland umgewandelt werden.',
    requirements: [
      'Dauergrünland muss erhalten bleiben',
      'Umbruch nur mit behördlicher Genehmigung',
      'Bei Umbruch: Kompensationsflächen anlegen',
    ],
    documentation: [
      'Flächennachweis für Dauergrünland',
      'Bei Umbruch: Genehmigungsbescheid',
      'Kompensations-Flächenverzeichnis',
    ],
  },
  [GloezStandard.GLOEZ_2]: {
    title: 'GLÖZ 2: Schutz von Feuchtgebieten und Torfmooren',
    shortTitle: 'Feuchtgebiete',
    description: 'Feuchtgebiete und Torfmoore sind besonders geschützt und dürfen nicht beeinträchtigt werden.',
    requirements: [
      'Feuchtgebiete identifizieren',
      'Keine Entwässerung',
      'Keine Bewirtschaftung mit schweren Maschinen',
    ],
    documentation: [
      'Karte der Feuchtgebiete',
      'Bewirtschaftungsprotokoll',
    ],
  },
  [GloezStandard.GLOEZ_3]: {
    title: 'GLÖZ 3: Verbot des Abbrennens von Stoppelfeldern',
    shortTitle: 'Stoppelfeld-Abbrennen',
    description: 'Das Abbrennen von Stoppelfeldern ist zum Schutz der Bodenstruktur verboten.',
    requirements: [
      'Stoppelfelder dürfen nicht abgebrannt werden',
      'Alternative Stoppelbearbeitung verwenden',
    ],
    documentation: [
      'Auftragsnachweis für Stoppelbearbeitung',
      'Keine Brand-Dokumentation',
    ],
  },
  [GloezStandard.GLOEZ_4]: {
    title: 'GLÖZ 4: Pufferstreifen entlang von Wasserläufen',
    shortTitle: 'Pufferstreifen',
    description: 'Entlang von Gewässern müssen mindestens 3m breite Pufferstreifen angelegt werden.',
    requirements: [
      'Mindestens 3m Breite entlang Wasserläufen',
      'Keine Düngung oder Pflanzenschutz',
      'Dauerhafte Begrünung',
    ],
    documentation: [
      'Vermessung der Pufferstreifen-Breite',
      'GPS-Track der Pufferstreifen',
      'Foto-Dokumentation',
    ],
  },
  [GloezStandard.GLOEZ_5]: {
    title: 'GLÖZ 5: Maßnahmen zur Begrenzung von Erosion',
    shortTitle: 'Erosionsschutz',
    description: 'Auf erosionsgefährdeten Flächen müssen Schutzmaßnahmen ergriffen werden.',
    requirements: [
      'Erosionsgefährdung bewerten',
      'Hangflächen quer zur Hangneigung bewirtschaften',
      'Mulchsaat oder Direktsaat bei Wasser-Erosion',
    ],
    documentation: [
      'Erosionsrisiko-Bewertung',
      'Bewirtschaftungsrichtung dokumentieren',
      'Anbauverfallthrough dokumentieren',
    ],
  },
  [GloezStandard.GLOEZ_6]: {
    title: 'GLÖZ 6: Mindestbodenbedeckung in sensiblen Zeiten',
    shortTitle: 'Bodenbedeckung',
    description: 'Der Boden muss in sensiblen Zeiten (Winter) bedeckt sein, z.B. durch Zwischenfrüchte.',
    requirements: [
      'Zwischen 15. November und 15. Januar: Bodenbedeckung',
      'Zwischenfrüchte, Untersaaten oder Mulch',
      'Keine offenen Ackerflächen im Winter',
    ],
    documentation: [
      'Aussaat-Termine von Zwischenfrüchten',
      'Fotos der Bodenbedeckung',
      'Flächenverzeichnis mit Zwischenfrucht',
    ],
  },
  [GloezStandard.GLOEZ_7]: {
    title: 'GLÖZ 7: Fruchtwechsel auf Ackerland',
    shortTitle: 'Fruchtwechsel',
    description: 'Auf Ackerflächen über 10 ha muss ein Fruchtwechsel stattfinden.',
    requirements: [
      'Mindestens 2 verschiedene Hauptfrüchte pro Jahr',
      'Hauptfrucht darf max. 66% der Ackerfläche einnehmen',
      'Jährlicher Wechsel der Hauptfrucht pro Schlag',
    ],
    documentation: [
      'Anbauhistorie der letzten 3 Jahre',
      'Flächenverzeichnis mit Fruchtarten',
      'Aussaat- und Ernte-Termine',
    ],
  },
  [GloezStandard.GLOEZ_8]: {
    title: 'GLÖZ 8: Mindestanteil nichtproduktiver Flächen',
    shortTitle: 'Nicht-produktive Flächen',
    description: 'Mindestens 4% der Ackerfläche müssen nichtproduktiv sein (Brachen, Blühstreifen, etc.).',
    requirements: [
      'Mindestens 4% nichtproduktive Flächen',
      'Brachen, Blühstreifen, Landschaftselemente',
      'Flächenstilllegung oder Öko-Regelung 1',
    ],
    documentation: [
      'Flächenverzeichnis nichtproduktiver Flächen',
      'GPS-Koordinaten',
      'Foto-Dokumentation',
    ],
  },
  [GloezStandard.GLOEZ_9]: {
    title: 'GLÖZ 9: Verbot des Umbruchs bzw. der Umwandlung von Dauergrünland',
    shortTitle: 'Dauergrünland-Schutz',
    description: 'Umweltsensibles Dauergrünland in Natura 2000-Gebieten ist besonders geschützt.',
    requirements: [
      'Umweltsensibles DGL nicht umbrechen',
      'Keine Umwandlung in Acker',
      'Bei Verstoß: Rückumwandlungspflicht',
    ],
    documentation: [
      'Nachweis Natura 2000-Lage',
      'Dauergrünland-Kataster',
    ],
  },
};

export function GloezDetailClientContent({ standard }: GloezDetailClientContentProps) {
  const { activeCompany } = useSession();
  const router = useRouter();
  const t = useTranslations('Foerderwesen');

  const [compliance, setCompliance] = useState<GloezCompliance | null>(null);
  const [affectedFields, setAffectedFields] = useState<FieldListItem[]>([]);
  const [autoCheckResult, setAutoCheckResult] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [checking, setChecking] = useState(false);

  const info = gloezInfo[standard];

  useEffect(() => {
    if (!activeCompany) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const complianceData = await mockGapService.getGloezStandardCompliance(
          activeCompany.id,
          standard
        );
        
        if (complianceData) {
          setCompliance(complianceData);
          
          // Load affected fields
          if (complianceData.issues.length > 0) {
            const fieldIds = [
              ...new Set(complianceData.issues.flatMap(i => i.affectedFieldIds))
            ];
            const fields = await mockFieldService.getAllFieldsDetailed('tenant-1', activeCompany.id);
            const affected = fields.filter(f => fieldIds.includes(f.id));
            setAffectedFields(affected);
          }
        }
      } catch (error) {
        console.error('Failed to load GLÖZ compliance:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [activeCompany, standard]);

  const runAutomatedCheck = async () => {
    if (!activeCompany) return;

    setChecking(true);
    try {
      const fields = await mockFieldService.getAllFieldsDetailed('tenant-1', activeCompany.id);
      const operations = await mockOperationService.getAllOperations('tenant-1', activeCompany.id);

      let result;
      switch (standard) {
        case GloezStandard.GLOEZ_1:
          result = gloezComplianceChecker.checkGloez1(fields, operations);
          break;
        case GloezStandard.GLOEZ_2:
          result = gloezComplianceChecker.checkGloez2(fields);
          break;
        case GloezStandard.GLOEZ_3:
          result = gloezComplianceChecker.checkGloez3(operations);
          break;
        case GloezStandard.GLOEZ_4:
          result = gloezComplianceChecker.checkGloez4(fields);
          break;
        case GloezStandard.GLOEZ_5:
          result = gloezComplianceChecker.checkGloez5(fields, operations);
          break;
        case GloezStandard.GLOEZ_6:
          result = gloezComplianceChecker.checkGloez6(fields, operations);
          break;
        case GloezStandard.GLOEZ_7:
          result = gloezComplianceChecker.checkGloez7(fields, operations);
          break;
        case GloezStandard.GLOEZ_8:
          result = gloezComplianceChecker.checkGloez8(fields);
          break;
        case GloezStandard.GLOEZ_9:
          result = gloezComplianceChecker.checkGloez9(fields);
          break;
        default:
          result = null;
      }

      setAutoCheckResult(result);
      if (result) {
        setAffectedFields(result.affectedFields);
      }
    } catch (error) {
      console.error('Automated check failed:', error);
    } finally {
      setChecking(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-64" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!compliance) {
    return <div>Keine Daten verfügbar</div>;
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'compliant':
        return 'text-green-600';
      case 'non-compliant':
        return 'text-red-600';
      case 'at-risk':
        return 'text-orange-600';
      default:
        return 'text-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'compliant':
        return <CheckCircle2 className="h-6 w-6 text-green-600" />;
      case 'non-compliant':
        return <AlertTriangle className="h-6 w-6 text-red-600" />;
      case 'at-risk':
        return <AlertCircle className="h-6 w-6 text-orange-600" />;
      default:
        return <Info className="h-6 w-6 text-gray-600" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'compliant':
        return 'Konform';
      case 'non-compliant':
        return 'Nicht konform';
      case 'at-risk':
        return 'Gefährdet';
      default:
        return 'Nicht anwendbar';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push('/de/foerderwesen')}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            {info.title}
          </h1>
          <p className="text-muted-foreground mt-1">{info.description}</p>
        </div>
        <Button onClick={runAutomatedCheck} disabled={checking}>
          <RefreshCw className={`h-4 w-4 mr-2 ${checking ? 'animate-spin' : ''}`} />
          Automatisch prüfen
        </Button>
      </div>

      {/* Status Card */}
      <Card className={
        compliance.status === 'non-compliant' ? 'border-red-200 bg-red-50 dark:bg-red-950/20' :
        compliance.status === 'at-risk' ? 'border-orange-200 bg-orange-50 dark:bg-orange-950/20' :
        compliance.status === 'compliant' ? 'border-green-200 bg-green-50 dark:bg-green-950/20' : ''
      }>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {getStatusIcon(compliance.status)}
              <div>
                <CardTitle>{getStatusText(compliance.status)}</CardTitle>
                <CardDescription>
                  Zuletzt geprüft: {format(compliance.lastChecked, 'dd. MMMM yyyy', { locale: de })}
                </CardDescription>
              </div>
            </div>
            <Badge
              variant={
                compliance.status === 'compliant' ? 'default' :
                compliance.status === 'non-compliant' ? 'destructive' :
                compliance.status === 'at-risk' ? 'destructive' : 'secondary'
              }
              className="text-lg px-4 py-2"
            >
              {autoCheckResult ? `${autoCheckResult.score}/100` : getStatusText(compliance.status)}
            </Badge>
          </div>
        </CardHeader>
        {compliance.notes && (
          <CardContent>
            <p className="text-sm">{compliance.notes}</p>
          </CardContent>
        )}
      </Card>

      {/* Issues */}
      {compliance.issues.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Erkannte Probleme ({compliance.issues.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {compliance.issues.map((issue) => (
              <Alert
                key={issue.id}
                variant={issue.severity === 'critical' ? 'destructive' : 'default'}
              >
                <AlertTitle className="flex items-center gap-2">
                  {issue.severity === 'critical' && <AlertTriangle className="h-4 w-4" />}
                  {issue.severity === 'warning' && <AlertCircle className="h-4 w-4" />}
                  {issue.description}
                </AlertTitle>
                <AlertDescription>
                  <div className="mt-2 space-y-2">
                    <div className="text-sm">
                      Erkannt am: {format(issue.detectedAt, 'dd.MM.yyyy', { locale: de })}
                    </div>
                    {issue.affectedFieldIds.length > 0 && (
                      <div className="text-sm">
                        Betroffene Schläge: {issue.affectedFieldIds.join(', ')}
                      </div>
                    )}
                    <div className="mt-3">
                      <div className="font-medium text-sm mb-1">Empfehlungen:</div>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        {issue.recommendations.map((rec, idx) => (
                          <li key={idx}>{rec}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </AlertDescription>
              </Alert>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Automated Check Result */}
      {autoCheckResult && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Automatische Prüfung
            </CardTitle>
            <CardDescription>
              Analyse basierend auf aktuellen Feld- und Auftragsdaten
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <span className="font-medium">Compliance-Score:</span>
                <span className={`text-2xl font-bold ${getStatusColor(autoCheckResult.status)}`}>
                  {autoCheckResult.score}/100
                </span>
              </div>
              
              {autoCheckResult.recommendations.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Lightbulb className="h-4 w-4 text-yellow-600" />
                    <span className="font-medium">Empfehlungen:</span>
                  </div>
                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                    {autoCheckResult.recommendations.map((rec: string, idx: number) => (
                      <li key={idx}>{rec}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Affected Fields */}
      {affectedFields.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Betroffene Schläge ({affectedFields.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {affectedFields.map((field) => (
                <Link key={field.id} href={`/de/fields/${field.id}`}>
                  <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div>
                      <div className="font-medium">{field.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {field.totalArea.toFixed(1)} ha • {field.currentCrop || 'Keine Kultur'}
                      </div>
                    </div>
                    <Button size="sm" variant="ghost">
                      Details
                    </Button>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Requirements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Anforderungen
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc list-inside space-y-2">
            {info.requirements.map((req, idx) => (
              <li key={idx} className="text-sm">{req}</li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Documentation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Erforderliche Dokumentation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc list-inside space-y-2">
            {info.documentation.map((doc, idx) => (
              <li key={idx} className="text-sm">{doc}</li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
