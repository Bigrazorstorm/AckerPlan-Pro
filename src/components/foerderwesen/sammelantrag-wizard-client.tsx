'use client';

import { useState, useEffect } from 'react';
import { useSession } from '@/context/session-context';
import { useTranslations } from 'next-intl';
import { mockGapService } from '@/services/mock-gap-service';
import dataService from '@/services';
import { GloezCompliance, EcoSchemeType, EcoSchemeApplication } from '@/services/gap-types';
import { Field } from '@/services/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { Checkbox } from '@/components/ui/checkbox';
import {
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  ChevronRight,
  ChevronLeft,
  FileText,
  Leaf,
  MapPin,
  ShieldCheck,
  ClipboardList,
  Eye,
  Download,
  Send,
  Calendar,
  Euro,
} from 'lucide-react';
import { format, differenceInDays } from 'date-fns';
import { de } from 'date-fns/locale';

const STEPS = [
  { id: 1, title: 'Flächen wählen', icon: MapPin },
  { id: 2, title: 'GLÖZ-Prüfung', icon: ShieldCheck },
  { id: 3, title: 'Öko-Regelungen', icon: Leaf },
  { id: 4, title: 'Plausibilitätsprüfung', icon: ClipboardList },
  { id: 5, title: 'Zusammenfassung', icon: Eye },
  { id: 6, title: 'PDF-Export', icon: Download },
  { id: 7, title: 'Einreichung', icon: Send },
];

const ECO_SCHEME_LABELS: Record<EcoSchemeType, { name: string; rate: number }> = {
  [EcoSchemeType.ECO_1A]: { name: 'ÖR 1a: Biodiversitätsflächen', rate: 600 },
  [EcoSchemeType.ECO_1B]: { name: 'ÖR 1b: Blühstreifen', rate: 650 },
  [EcoSchemeType.ECO_2]: { name: 'ÖR 2: Vielfältige Kulturen', rate: 30 },
  [EcoSchemeType.ECO_3]: { name: 'ÖR 3: Agroforst', rate: 200 },
  [EcoSchemeType.ECO_4]: { name: 'ÖR 4: Extensivgrünland', rate: 150 },
  [EcoSchemeType.ECO_5]: { name: 'ÖR 5: Ergebnisorientiert', rate: 240 },
  [EcoSchemeType.ECO_6]: { name: 'ÖR 6: Ohne chem. Pflanzenschutz', rate: 70 },
  [EcoSchemeType.ECO_7]: { name: 'ÖR 7: Präzisionslandwirtschaft', rate: 40 },
};

const DEADLINE = new Date('2026-05-15');

function LoadingSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-64 w-full" />
    </div>
  );
}

export function SammelantragWizardClient() {
  const { activeCompany } = useSession();
  const tCommon = useTranslations('Common');

  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(true);

  // Data
  const [fields, setFields] = useState<Field[]>([]);
  const [gloezCompliance, setGloezCompliance] = useState<GloezCompliance[]>([]);
  const [ecoSchemes, setEcoSchemes] = useState<EcoSchemeApplication[]>([]);

  // Wizard state
  const [selectedFieldIds, setSelectedFieldIds] = useState<Set<string>>(new Set());
  const [selectedEcoSchemes, setSelectedEcoSchemes] = useState<Set<EcoSchemeType>>(new Set());
  const [submitted, setSubmitted] = useState(false);
  const [refNumber] = useState(() => `SA-2026-${Date.now().toString().slice(-5)}`);

  const daysUntilDeadline = differenceInDays(DEADLINE, new Date());

  useEffect(() => {
    if (!activeCompany) return;
    const fetch = async () => {
      setLoading(true);
      try {
        const [fieldsData, complianceData, schemesData] = await Promise.all([
          dataService.getFields(activeCompany.tenantId, activeCompany.id),
          mockGapService.getGloezCompliance(activeCompany.id),
          mockGapService.getEcoSchemes(activeCompany.id, 2026),
        ]);
        setFields(fieldsData);
        setGloezCompliance(complianceData);
        setEcoSchemes(schemesData);
        // Pre-select all fields
        setSelectedFieldIds(new Set(fieldsData.map((f) => f.id)));
        // Pre-select existing eco schemes
        setSelectedEcoSchemes(new Set(schemesData.map((s) => s.type)));
      } catch (err) {
        console.error('Failed to load wizard data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [activeCompany]);

  const selectedFields = fields.filter((f) => selectedFieldIds.has(f.id));
  const totalArea = selectedFields.reduce((sum, f) => sum + f.area, 0);
  const basisPraemie = totalArea * 173; // ~173 €/ha
  const ecoTotal = Array.from(selectedEcoSchemes).reduce((sum, type) => {
    const existing = ecoSchemes.find((s) => s.type === type);
    if (existing) return sum + existing.expectedPayment;
    return sum + ECO_SCHEME_LABELS[type].rate * 2; // fallback: 2ha estimate
  }, 0);
  const totalPayment = basisPraemie + ecoTotal;

  const nonCompliant = gloezCompliance.filter((c) => c.status === 'non-compliant');
  const atRisk = gloezCompliance.filter((c) => c.status === 'at-risk');
  const warnings = [...nonCompliant, ...atRisk];

  const toggleField = (id: string) => {
    setSelectedFieldIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleEcoScheme = (type: EcoSchemeType) => {
    setSelectedEcoSchemes((prev) => {
      const next = new Set(prev);
      if (next.has(type)) next.delete(type);
      else next.add(type);
      return next;
    });
  };

  const canProceed = () => {
    if (currentStep === 1) return selectedFieldIds.size > 0;
    return true;
  };

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            Sammelantrag 2026
          </h1>
          <p className="text-muted-foreground">
            Schritt-für-Schritt Antragstellung für GAP-Förderung
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Calendar className="h-4 w-4 text-orange-600" />
          <span className="text-muted-foreground">Einreichungsfrist:</span>
          <Badge variant={daysUntilDeadline < 30 ? 'destructive' : 'secondary'}>
            {format(DEADLINE, 'dd. MMMM yyyy', { locale: de })} ({daysUntilDeadline} Tage)
          </Badge>
        </div>
      </div>

      {/* Step Progress */}
      <Card>
        <CardContent className="pt-4 pb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">
              Schritt {currentStep} von {STEPS.length}: {STEPS[currentStep - 1].title}
            </span>
            <span className="text-sm text-muted-foreground">
              {Math.round(((currentStep - 1) / (STEPS.length - 1)) * 100)}%
            </span>
          </div>
          <Progress value={((currentStep - 1) / (STEPS.length - 1)) * 100} className="h-2" />
          <div className="flex justify-between mt-3 overflow-x-auto gap-1">
            {STEPS.map((step) => {
              const Icon = step.icon;
              return (
                <button
                  key={step.id}
                  onClick={() => setCurrentStep(step.id)}
                  className={`flex flex-col items-center gap-1 px-2 py-1 rounded transition-colors text-xs min-w-0 ${
                    step.id === currentStep
                      ? 'text-primary font-semibold'
                      : step.id < currentStep
                      ? 'text-green-600'
                      : 'text-muted-foreground'
                  }`}
                >
                  <div
                    className={`h-7 w-7 rounded-full flex items-center justify-center border-2 ${
                      step.id === currentStep
                        ? 'border-primary bg-primary text-primary-foreground'
                        : step.id < currentStep
                        ? 'border-green-600 bg-green-600 text-white'
                        : 'border-muted-foreground/30'
                    }`}
                  >
                    {step.id < currentStep ? (
                      <CheckCircle2 className="h-4 w-4" />
                    ) : (
                      <Icon className="h-3.5 w-3.5" />
                    )}
                  </div>
                  <span className="hidden sm:block truncate max-w-[70px]">{step.title}</span>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Step Content */}
      {currentStep === 1 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Schritt 1: Flächen auswählen
            </CardTitle>
            <CardDescription>
              Wählen Sie alle Flächen aus, die im Sammelantrag angemeldet werden sollen.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <span className="text-sm font-medium">
                {selectedFieldIds.size} von {fields.length} Flächen gewählt
              </span>
              <span className="text-sm font-bold">
                Gesamt: {totalArea.toFixed(2)} ha
              </span>
            </div>
            <div className="space-y-2">
              {fields.map((field) => (
                <div
                  key={field.id}
                  className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted/30 transition-colors cursor-pointer"
                  onClick={() => toggleField(field.id)}
                >
                  <Checkbox
                    checked={selectedFieldIds.has(field.id)}
                    onCheckedChange={() => toggleField(field.id)}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm">{field.name}</div>
                    <div className="text-xs text-muted-foreground">{field.crop}</div>
                  </div>
                  <div className="text-sm font-medium">{field.area.toFixed(2)} ha</div>
                </div>
              ))}
            </div>
            <div className="border-t pt-3 flex justify-between text-sm font-semibold">
              <span>Basisprämie (ca. 173 €/ha):</span>
              <span className="text-green-700">{basisPraemie.toLocaleString('de-DE')} €</span>
            </div>
          </CardContent>
        </Card>
      )}

      {currentStep === 2 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5" />
              Schritt 2: GLÖZ-Konformitätsprüfung
            </CardTitle>
            <CardDescription>
              Überprüfung der GLÖZ-Standards (Guter landwirtschaftlicher und ökologischer Zustand)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {warnings.length > 0 && (
              <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg text-sm text-orange-800 dark:bg-orange-950/20 dark:text-orange-200">
                <strong>Achtung:</strong> {nonCompliant.length > 0 && `${nonCompliant.length} kritische Verstöße`}
                {nonCompliant.length > 0 && atRisk.length > 0 && ', '}
                {atRisk.length > 0 && `${atRisk.length} gefährdete Standards`} gefunden.
              </div>
            )}
            {gloezCompliance.map((c) => (
              <div
                key={c.standard}
                className="flex items-start gap-3 p-3 border rounded-lg"
              >
                {c.status === 'compliant' && <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />}
                {c.status === 'non-compliant' && <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />}
                {c.status === 'at-risk' && <AlertCircle className="h-5 w-5 text-orange-600 flex-shrink-0 mt-0.5" />}
                {c.status === 'not-applicable' && <CheckCircle2 className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />}
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm">{c.standard.replace('_', ' ')}</div>
                  {c.notes && <div className="text-xs text-muted-foreground mt-0.5">{c.notes}</div>}
                  {c.issues.map((issue) => (
                    <div key={issue.id} className="text-xs text-red-600 mt-1">
                      ⚠ {issue.description}
                    </div>
                  ))}
                </div>
                <Badge
                  variant={
                    c.status === 'compliant' ? 'default' :
                    c.status === 'not-applicable' ? 'secondary' : 'destructive'
                  }
                >
                  {c.status === 'compliant' && 'Konform'}
                  {c.status === 'non-compliant' && 'Nicht konform'}
                  {c.status === 'at-risk' && 'Gefährdet'}
                  {c.status === 'not-applicable' && 'n.a.'}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {currentStep === 3 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Leaf className="h-5 w-5" />
              Schritt 3: Öko-Regelungen
            </CardTitle>
            <CardDescription>
              Wählen Sie Öko-Regelungen für zusätzliche Förderprämien.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {Object.entries(ECO_SCHEME_LABELS).map(([type, info]) => {
              const ecoType = type as EcoSchemeType;
              const existing = ecoSchemes.find((s) => s.type === ecoType);
              const area = existing?.area ?? 0;
              const payment = existing?.expectedPayment ?? (info.rate * 2);
              return (
                <div
                  key={type}
                  className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted/30 transition-colors cursor-pointer"
                  onClick={() => toggleEcoScheme(ecoType)}
                >
                  <Checkbox
                    checked={selectedEcoSchemes.has(ecoType)}
                    onCheckedChange={() => toggleEcoScheme(ecoType)}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm">{info.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {info.rate} €/ha
                      {area > 0 && ` • ${area.toFixed(1)} ha beantragt`}
                    </div>
                  </div>
                  <div className="text-sm font-medium text-green-700">
                    {payment.toLocaleString('de-DE')} €
                  </div>
                  {existing && (
                    <Badge variant="secondary" className="text-xs">{existing.status === 'applied' ? 'Beantragt' : 'Geplant'}</Badge>
                  )}
                </div>
              );
            })}
            <div className="border-t pt-3 flex justify-between text-sm font-semibold">
              <span>Öko-Prämie gesamt:</span>
              <span className="text-green-700">{ecoTotal.toLocaleString('de-DE')} €</span>
            </div>
          </CardContent>
        </Card>
      )}

      {currentStep === 4 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ClipboardList className="h-5 w-5" />
              Schritt 4: Plausibilitätsprüfung
            </CardTitle>
            <CardDescription>
              Automatische Überprüfung Ihrer Angaben auf Widersprüche und fehlende Daten.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {selectedFieldIds.size === 0 && (
              <div className="flex gap-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0" />
                <div>
                  <div className="font-medium text-sm text-red-800">Fehler: Keine Flächen gewählt</div>
                  <div className="text-xs text-red-600">Bitte kehren Sie zu Schritt 1 zurück.</div>
                </div>
              </div>
            )}
            {nonCompliant.length > 0 && (
              <div className="flex gap-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0" />
                <div>
                  <div className="font-medium text-sm text-red-800">
                    GLÖZ-Verstöße: {nonCompliant.length} Standard(s) nicht eingehalten
                  </div>
                  <div className="text-xs text-red-600">
                    Können zu Kürzungen oder Ablehnung führen.
                  </div>
                </div>
              </div>
            )}
            {atRisk.length > 0 && (
              <div className="flex gap-3 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                <AlertCircle className="h-5 w-5 text-orange-600 flex-shrink-0" />
                <div>
                  <div className="font-medium text-sm text-orange-800">
                    Warnung: {atRisk.length} Standard(s) gefährdet
                  </div>
                  <div className="text-xs text-orange-600">
                    Bitte prüfen und ggf. Maßnahmen ergreifen.
                  </div>
                </div>
              </div>
            )}
            {selectedFieldIds.size > 0 && nonCompliant.length === 0 && (
              <div className="flex gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
                <div>
                  <div className="font-medium text-sm text-green-800">Keine kritischen Fehler</div>
                  <div className="text-xs text-green-600">
                    Ihr Antrag ist plausibel und kann eingereicht werden.
                  </div>
                </div>
              </div>
            )}
            <div className="flex gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <FileText className="h-5 w-5 text-blue-600 flex-shrink-0" />
              <div>
                <div className="font-medium text-sm text-blue-800">Hinweis: Flächen-Referenz</div>
                <div className="text-xs text-blue-600">
                  Alle {selectedFieldIds.size} Flächen ({totalArea.toFixed(2)} ha) wurden im Flächenreferenzsystem (FLIK) gefunden.
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {currentStep === 5 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Schritt 5: Zusammenfassung
            </CardTitle>
            <CardDescription>
              Bitte prüfen Sie Ihre Angaben vor der Einreichung.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="p-3 border rounded-lg">
                <div className="text-xs text-muted-foreground mb-1">Betrieb</div>
                <div className="font-medium">{activeCompany.name}</div>
              </div>
              <div className="p-3 border rounded-lg">
                <div className="text-xs text-muted-foreground mb-1">Antragsjahr</div>
                <div className="font-medium">2026</div>
              </div>
              <div className="p-3 border rounded-lg">
                <div className="text-xs text-muted-foreground mb-1">Angemeldete Flächen</div>
                <div className="font-medium">{selectedFieldIds.size} Flächen ({totalArea.toFixed(2)} ha)</div>
              </div>
              <div className="p-3 border rounded-lg">
                <div className="text-xs text-muted-foreground mb-1">GLÖZ-Status</div>
                <div className={`font-medium ${nonCompliant.length > 0 ? 'text-red-600' : 'text-green-600'}`}>
                  {nonCompliant.length > 0 ? `${nonCompliant.length} Probleme` : 'Konform'}
                </div>
              </div>
              <div className="p-3 border rounded-lg">
                <div className="text-xs text-muted-foreground mb-1">Öko-Regelungen</div>
                <div className="font-medium">{selectedEcoSchemes.size} gewählt</div>
              </div>
              <div className="p-3 border rounded-lg">
                <div className="text-xs text-muted-foreground mb-1">Einreichungsfrist</div>
                <div className="font-medium">{format(DEADLINE, 'dd.MM.yyyy', { locale: de })}</div>
              </div>
            </div>
            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span>Basisprämie:</span>
                <span>{basisPraemie.toLocaleString('de-DE')} €</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Öko-Regelungen:</span>
                <span>{ecoTotal.toLocaleString('de-DE')} €</span>
              </div>
              <div className="flex justify-between font-bold border-t pt-2">
                <span className="flex items-center gap-1">
                  <Euro className="h-4 w-4" />
                  Erwartete Förderung gesamt:
                </span>
                <span className="text-green-700 text-lg">{totalPayment.toLocaleString('de-DE')} €</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {currentStep === 6 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="h-5 w-5" />
              Schritt 6: PDF-Export
            </CardTitle>
            <CardDescription>
              Laden Sie eine Zusammenfassung Ihres Sammelantrags herunter.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-6 border-2 border-dashed rounded-lg text-center space-y-3">
              <FileText className="h-12 w-12 mx-auto text-muted-foreground" />
              <div>
                <div className="font-medium">Sammelantrag_2026_{activeCompany.name}.pdf</div>
                <div className="text-sm text-muted-foreground mt-1">
                  Enthält: Flächenaufstellung, GLÖZ-Status, Öko-Regelungen, Prämienübersicht
                </div>
              </div>
              <Button variant="outline" disabled>
                <Download className="h-4 w-4 mr-2" />
                PDF herunterladen (In echtem System verfügbar)
              </Button>
            </div>
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800 dark:bg-blue-950/20 dark:text-blue-200">
              <strong>Hinweis:</strong> In der Produktionsumgebung wird hier ein vollständiges PDF mit allen 
              Antragsdaten generiert, das Sie für Ihre Unterlagen aufbewahren können.
            </div>
          </CardContent>
        </Card>
      )}

      {currentStep === 7 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Send className="h-5 w-5" />
              Schritt 7: Einreichung
            </CardTitle>
            <CardDescription>
              Reichen Sie Ihren Sammelantrag verbindlich ein.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {!submitted ? (
              <>
                <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg text-sm text-orange-800 dark:bg-orange-950/20 dark:text-orange-200">
                  <strong>Verbindliche Einreichung:</strong> Mit dem Absenden bestätigen Sie die 
                  Richtigkeit Ihrer Angaben. Der Antrag wird elektronisch an die zuständige Behörde 
                  (TLLLR Thüringen) übermittelt.
                </div>
                {nonCompliant.length > 0 && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-800">
                    <strong>Achtung:</strong> Es bestehen noch {nonCompliant.length} GLÖZ-Probleme. 
                    Bitte beheben Sie diese vor der Einreichung, um Kürzungen zu vermeiden.
                  </div>
                )}
                <Button
                  className="w-full"
                  size="lg"
                  onClick={() => setSubmitted(true)}
                >
                  <Send className="h-4 w-4 mr-2" />
                  Sammelantrag 2026 verbindlich einreichen
                </Button>
              </>
            ) : (
              <div className="text-center space-y-4 py-6">
                <CheckCircle2 className="h-16 w-16 text-green-600 mx-auto" />
                <div>
                  <div className="text-xl font-bold text-green-800">Antrag erfolgreich eingereicht!</div>
                  <div className="text-muted-foreground mt-2">
                    Ihr Sammelantrag 2026 wurde am {format(new Date(), 'dd. MMMM yyyy', { locale: de })} eingereicht.
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    Referenznummer: {refNumber}
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">
                  Sie erhalten eine Eingangsbestätigung per E-Mail. 
                  Änderungen sind bis zum {format(new Date('2026-06-15'), 'dd. MMMM yyyy', { locale: de })} möglich.
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Navigation */}
      {!submitted && (
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => setCurrentStep((s) => Math.max(1, s - 1))}
            disabled={currentStep === 1}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Zurück
          </Button>
          {currentStep < STEPS.length ? (
            <Button
              onClick={() => setCurrentStep((s) => Math.min(STEPS.length, s + 1))}
              disabled={!canProceed()}
            >
              Weiter
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          ) : null}
        </div>
      )}
    </div>
  );
}
