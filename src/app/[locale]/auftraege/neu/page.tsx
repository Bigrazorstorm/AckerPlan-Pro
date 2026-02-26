'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { PageLayout } from "@/components/layout/page-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { ArrowLeft, Play, Pause, Square, Camera, Package, Clock, MapPin, Thermometer, Wind, Droplets, ChevronRight, Search, Tractor, Sprout, Wheat, Bug, Truck } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

// ---------------------------------------------------------------------------
// Mock Data
// ---------------------------------------------------------------------------

const mockFields = [
  { id: 'f1', name: 'Großer Acker (Schlag 12)', flaeche: 14.5, kultur: 'Winterweizen', letzteMassnahme: '18.02.2026' },
  { id: 'f2', name: 'Hangfeld Süd (Schlag 7)', flaeche: 8.2, kultur: 'Winterraps', letzteMassnahme: '15.02.2026' },
  { id: 'f3', name: 'Waldstück (Schlag 3)', flaeche: 5.8, kultur: 'Sommergerste', letzteMassnahme: '10.02.2026' },
  { id: 'f4', name: 'Kirchenacker (Schlag 1)', flaeche: 12.0, kultur: 'Mais', letzteMassnahme: '12.02.2026' },
  { id: 'f5', name: 'Brückenfeld (Schlag 9)', flaeche: 6.3, kultur: 'Zuckerrüben', letzteMassnahme: '08.02.2026' },
  { id: 'f6', name: 'Am Wasserturm (Schlag 14)', flaeche: 9.7, kultur: 'Winterweizen', letzteMassnahme: '20.02.2026' },
  { id: 'f7', name: 'Oberes Feld (Schlag 5)', flaeche: 11.4, kultur: 'Kartoffeln', letzteMassnahme: '05.02.2026' },
  { id: 'f8', name: 'Wiese Niederbach (Schlag 18)', flaeche: 3.2, kultur: 'Dauergrünland', letzteMassnahme: '22.02.2026' },
];

const mockVehicles = [
  { id: 'v1', name: 'John Deere 6130R', typ: 'Traktor', ps: 130 },
  { id: 'v2', name: 'Fendt 724 Vario', typ: 'Traktor', ps: 240 },
  { id: 'v3', name: 'Claas Lexion 770', typ: 'Mähdrescher', ps: 585 },
  { id: 'v4', name: 'Amazone Pantera 4503', typ: 'Selbstfahrspritze', ps: 230 },
  { id: 'v5', name: 'Krone BiG X 780', typ: 'Feldhäcksler', ps: 780 },
];

type Massnahme = {
  id: string;
  label: string;
  icon: 'boden' | 'aussaat' | 'duengung' | 'pflanzenschutz' | 'ernte' | 'transport' | 'maehen' | 'sonstiges';
};

const massnahmen: Massnahme[] = [
  { id: 'm1', label: 'Bodenbearbeitung', icon: 'boden' },
  { id: 'm2', label: 'Aussaat', icon: 'aussaat' },
  { id: 'm3', label: 'Düngung', icon: 'duengung' },
  { id: 'm4', label: 'Pflanzenschutz', icon: 'pflanzenschutz' },
  { id: 'm5', label: 'Ernte', icon: 'ernte' },
  { id: 'm6', label: 'Transport', icon: 'transport' },
  { id: 'm7', label: 'Mähen', icon: 'maehen' },
  { id: 'm8', label: 'Sonstiges', icon: 'sonstiges' },
];

// ---------------------------------------------------------------------------
// Helper: Icon mapping for Maßnahmen
// ---------------------------------------------------------------------------

function MassnahmeIcon({ icon, className }: { icon: Massnahme['icon']; className?: string }) {
  const baseClass = className ?? 'h-8 w-8';
  switch (icon) {
    case 'boden':
      return <Sprout className={baseClass} />;
    case 'aussaat':
      return <Sprout className={baseClass} />;
    case 'duengung':
      return <Package className={baseClass} />;
    case 'pflanzenschutz':
      return <Bug className={baseClass} />;
    case 'ernte':
      return <Wheat className={baseClass} />;
    case 'transport':
      return <Truck className={baseClass} />;
    case 'maehen':
      return <Wheat className={baseClass} />;
    case 'sonstiges':
      return <Clock className={baseClass} />;
    default:
      return <Clock className={baseClass} />;
  }
}

// ---------------------------------------------------------------------------
// Helper: Format timer display
// ---------------------------------------------------------------------------

function formatElapsedTime(totalSeconds: number): string {
  const hrs = Math.floor(totalSeconds / 3600);
  const mins = Math.floor((totalSeconds % 3600) / 60);
  const secs = totalSeconds % 60;
  return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

// ---------------------------------------------------------------------------
// Step Indicator
// ---------------------------------------------------------------------------

function StepIndicator({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center justify-center gap-2 mb-6">
      {Array.from({ length: total }, (_, i) => {
        const step = i + 1;
        const isActive = step === current;
        const isDone = step < current;
        return (
          <div key={step} className="flex items-center gap-2">
            <div
              className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold transition-colors ${
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : isDone
                  ? 'bg-primary/20 text-primary'
                  : 'bg-muted text-muted-foreground'
              }`}
            >
              {step}
            </div>
            {step < total && (
              <div
                className={`w-8 h-0.5 ${
                  isDone ? 'bg-primary/40' : 'bg-muted'
                }`}
              />
            )}
          </div>
        );
      })}
      <span className="ml-3 text-sm text-muted-foreground">
        Schritt {current} von {total}
      </span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Material Entry
// ---------------------------------------------------------------------------

type MaterialEntry = {
  artikel: string;
  menge: string;
  einheit: string;
};

// ---------------------------------------------------------------------------
// Component: New Work Order Page
// ---------------------------------------------------------------------------

export default function NeuerAuftragPage() {
  const { locale } = useParams<{ locale: string }>();

  // Wizard state
  const [step, setStep] = useState(1);
  const [selectedField, setSelectedField] = useState<typeof mockFields[0] | null>(null);
  const [selectedMassnahme, setSelectedMassnahme] = useState<Massnahme | null>(null);
  const [selectedVehicle, setSelectedVehicle] = useState<typeof mockVehicles[0] | null>(null);
  const [ohneVehicle, setOhneVehicle] = useState(false);
  const [fieldSearch, setFieldSearch] = useState('');

  // Timer state
  const [timerActive, setTimerActive] = useState(false);
  const [timerRunning, setTimerRunning] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [pauseCount, setPauseCount] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Materials
  const [materials, setMaterials] = useState<MaterialEntry[]>([]);
  const [materialForm, setMaterialForm] = useState<MaterialEntry>({
    artikel: '',
    menge: '',
    einheit: 'kg',
  });
  const [materialSheetOpen, setMaterialSheetOpen] = useState(false);

  // Summary / done
  const [showSummary, setShowSummary] = useState(false);

  // Timer logic
  useEffect(() => {
    if (timerRunning) {
      timerRef.current = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [timerRunning]);

  // Start timer after step 3
  const startTimer = useCallback(() => {
    setTimerActive(true);
    setTimerRunning(true);
  }, []);

  const togglePause = useCallback(() => {
    if (timerRunning) {
      setPauseCount((prev) => prev + 1);
    }
    setTimerRunning((prev) => !prev);
  }, [timerRunning]);

  const stopTimer = useCallback(() => {
    setTimerRunning(false);
    setShowSummary(true);
  }, []);

  // Wizard navigation
  const goNext = () => {
    if (step === 3) {
      startTimer();
      return;
    }
    setStep((s) => Math.min(s + 1, 3));
  };

  const goBack = () => {
    setStep((s) => Math.max(s - 1, 1));
  };

  const canAdvance = (): boolean => {
    if (step === 1) return selectedField !== null;
    if (step === 2) return selectedMassnahme !== null;
    if (step === 3) return selectedVehicle !== null || ohneVehicle;
    return false;
  };

  const handleVehicleSelect = (v: typeof mockVehicles[0] | null) => {
    if (v === null) {
      setOhneVehicle(true);
      setSelectedVehicle(null);
    } else {
      setOhneVehicle(false);
      setSelectedVehicle(v);
    }
  };

  const addMaterial = () => {
    if (materialForm.artikel.trim() && materialForm.menge.trim()) {
      setMaterials((prev) => [...prev, { ...materialForm }]);
      setMaterialForm({ artikel: '', menge: '', einheit: 'kg' });
      setMaterialSheetOpen(false);
    }
  };

  const filteredFields = mockFields.filter((f) =>
    f.name.toLowerCase().includes(fieldSearch.toLowerCase()) ||
    f.kultur.toLowerCase().includes(fieldSearch.toLowerCase())
  );

  // -----------------------------------------------------------------------
  // Summary Screen (after stopping the timer)
  // -----------------------------------------------------------------------
  if (showSummary) {
    const hrs = Math.floor(elapsedSeconds / 3600);
    const mins = Math.floor((elapsedSeconds % 3600) / 60);

    return (
      <PageLayout
        title="Auftrag abgeschlossen"
        description="Zusammenfassung des erfassten Arbeitsauftrags"
        breadcrumbs={[
          { label: 'Aufträge', href: `/${locale}/auftraege` },
          { label: 'Neuer Auftrag' },
        ]}
      >
        <Card>
          <CardHeader>
            <CardTitle>Zusammenfassung</CardTitle>
            <CardDescription>
              Bitte prüfen Sie die Angaben, bevor der Auftrag gespeichert wird.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div>
                  <span className="text-sm text-muted-foreground">Schlag</span>
                  <p className="font-medium">{selectedField?.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {selectedField?.flaeche} ha -- {selectedField?.kultur}
                  </p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Maßnahme</span>
                  <p className="font-medium">{selectedMassnahme?.label}</p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Fahrzeug</span>
                  <p className="font-medium">
                    {ohneVehicle
                      ? 'Ohne Fahrzeug'
                      : selectedVehicle?.name ?? '--'}
                  </p>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <span className="text-sm text-muted-foreground">
                    Arbeitszeit
                  </span>
                  <p className="font-medium">
                    {hrs > 0 ? `${hrs} Std. ` : ''}
                    {mins} Min.
                  </p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Pausen</span>
                  <p className="font-medium">{pauseCount}</p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Datum</span>
                  <p className="font-medium">
                    {new Date().toLocaleDateString('de-DE', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                    })}
                  </p>
                </div>
              </div>
            </div>

            {materials.length > 0 && (
              <>
                <Separator />
                <div>
                  <h4 className="text-sm font-semibold mb-2">
                    Eingesetztes Material
                  </h4>
                  <div className="rounded-md border">
                    <div className="grid grid-cols-3 gap-4 p-3 bg-muted/50 text-sm font-medium text-muted-foreground">
                      <span>Artikel</span>
                      <span className="text-right">Menge</span>
                      <span className="text-right">Einheit</span>
                    </div>
                    {materials.map((m, idx) => (
                      <div
                        key={idx}
                        className="grid grid-cols-3 gap-4 p-3 border-t text-sm"
                      >
                        <span className="font-medium">{m.artikel}</span>
                        <span className="text-right">{m.menge}</span>
                        <span className="text-right text-muted-foreground">
                          {m.einheit}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            <Separator />

            <div className="flex justify-between gap-3">
              <Button variant="outline" asChild>
                <Link href={`/${locale}/auftraege`}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Zur Auftragsliste
                </Link>
              </Button>
              <Button
                onClick={() => {
                  // In a real app: save the order, then redirect.
                  // Here we just go to the list.
                  window.location.href = `/${locale}/auftraege`;
                }}
              >
                Auftrag speichern
              </Button>
            </div>
          </CardContent>
        </Card>
      </PageLayout>
    );
  }

  // -----------------------------------------------------------------------
  // Timer Screen (after wizard completes)
  // -----------------------------------------------------------------------
  if (timerActive) {
    return (
      <PageLayout
        title="Auftrag läuft"
        description={`${selectedMassnahme?.label} -- ${selectedField?.name}`}
        breadcrumbs={[
          { label: 'Aufträge', href: `/${locale}/auftraege` },
          { label: 'Neuer Auftrag' },
        ]}
      >
        <div className="flex flex-col items-center gap-8 py-4">
          {/* Timer Display */}
          <Card className="w-full max-w-md">
            <CardContent className="pt-8 pb-8 text-center">
              <p className="text-sm text-muted-foreground mb-2">
                Laufende Arbeitszeit
              </p>
              <p className="text-6xl md:text-7xl font-mono font-bold tracking-wider tabular-nums">
                {formatElapsedTime(elapsedSeconds)}
              </p>
              <div className="mt-4 flex items-center justify-center gap-2">
                <Badge
                  variant={timerRunning ? 'default' : 'secondary'}
                  className={timerRunning ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}
                >
                  {timerRunning ? 'Läuft' : 'Pausiert'}
                </Badge>
                {pauseCount > 0 && (
                  <span className="text-xs text-muted-foreground">
                    {pauseCount} Pause{pauseCount !== 1 ? 'n' : ''}
                  </span>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Info Cards */}
          <div className="w-full max-w-md grid grid-cols-2 gap-3">
            <Card>
              <CardContent className="pt-4 pb-4 text-center">
                <p className="text-xs text-muted-foreground">Schlag</p>
                <p className="text-sm font-semibold truncate">
                  {selectedField?.name}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4 pb-4 text-center">
                <p className="text-xs text-muted-foreground">Maßnahme</p>
                <p className="text-sm font-semibold">
                  {selectedMassnahme?.label}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Controls */}
          <div className="flex gap-4">
            <Button
              size="lg"
              variant={timerRunning ? 'secondary' : 'default'}
              onClick={togglePause}
              className="gap-2 w-36"
            >
              {timerRunning ? (
                <>
                  <Pause className="h-5 w-5" />
                  Pause
                </>
              ) : (
                <>
                  <Play className="h-5 w-5" />
                  Weiter
                </>
              )}
            </Button>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button size="lg" variant="destructive" className="gap-2 w-36">
                  <Square className="h-5 w-5" />
                  Stopp
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Auftrag beenden?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Der Timer wird gestoppt und Sie sehen eine Zusammenfassung
                    des Auftrags. Die erfasste Arbeitszeit beträgt{' '}
                    {formatElapsedTime(elapsedSeconds)}.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Abbrechen</AlertDialogCancel>
                  <AlertDialogAction onClick={stopTimer}>
                    Auftrag beenden
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>

          <Separator className="w-full max-w-md" />

          {/* Action Buttons */}
          <div className="w-full max-w-md space-y-3">
            {/* Material Add */}
            <Sheet open={materialSheetOpen} onOpenChange={setMaterialSheetOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" className="w-full gap-2">
                  <Package className="h-4 w-4" />
                  Material hinzufügen
                  {materials.length > 0 && (
                    <Badge variant="secondary" className="ml-auto">
                      {materials.length}
                    </Badge>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Material erfassen</SheetTitle>
                </SheetHeader>
                <div className="py-6 space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="mat-artikel">Artikel</Label>
                    <Input
                      id="mat-artikel"
                      placeholder="z.B. Diesel, Dünger, Saatgut..."
                      value={materialForm.artikel}
                      onChange={(e) =>
                        setMaterialForm((prev) => ({
                          ...prev,
                          artikel: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label htmlFor="mat-menge">Menge</Label>
                      <Input
                        id="mat-menge"
                        type="number"
                        step="0.1"
                        placeholder="0"
                        value={materialForm.menge}
                        onChange={(e) =>
                          setMaterialForm((prev) => ({
                            ...prev,
                            menge: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="mat-einheit">Einheit</Label>
                      <select
                        id="mat-einheit"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        value={materialForm.einheit}
                        onChange={(e) =>
                          setMaterialForm((prev) => ({
                            ...prev,
                            einheit: e.target.value,
                          }))
                        }
                      >
                        <option value="kg">kg</option>
                        <option value="Liter">Liter</option>
                        <option value="Tonnen">Tonnen</option>
                        <option value="Stück">Stück</option>
                        <option value="Sack">Sack</option>
                        <option value="m³">m³</option>
                      </select>
                    </div>
                  </div>
                  <Button
                    className="w-full"
                    onClick={addMaterial}
                    disabled={
                      !materialForm.artikel.trim() ||
                      !materialForm.menge.trim()
                    }
                  >
                    Hinzufügen
                  </Button>

                  {materials.length > 0 && (
                    <>
                      <Separator />
                      <div>
                        <h4 className="text-sm font-semibold mb-2">
                          Bereits erfasst
                        </h4>
                        <div className="space-y-2">
                          {materials.map((m, idx) => (
                            <div
                              key={idx}
                              className="flex justify-between items-center text-sm bg-muted/50 rounded-md px-3 py-2"
                            >
                              <span className="font-medium">{m.artikel}</span>
                              <span className="text-muted-foreground">
                                {m.menge} {m.einheit}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </SheetContent>
            </Sheet>

            {/* Photo Button */}
            <Button variant="outline" className="w-full gap-2">
              <Camera className="h-4 w-4" />
              Foto aufnehmen
            </Button>
          </div>
        </div>
      </PageLayout>
    );
  }

  // -----------------------------------------------------------------------
  // Wizard Steps
  // -----------------------------------------------------------------------
  return (
    <PageLayout
      title="Neuer Arbeitsauftrag"
      description="Auftrag in 3 Schritten starten"
      breadcrumbs={[
        { label: 'Aufträge', href: `/${locale}/auftraege` },
        { label: 'Neuer Auftrag' },
      ]}
    >
      <StepIndicator current={step} total={3} />

      {/* ================================================================= */}
      {/* Step 1: Schlag wählen                                             */}
      {/* ================================================================= */}
      {step === 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Schlag wählen</CardTitle>
            <CardDescription>
              Wählen Sie den Schlag, auf dem gearbeitet werden soll.
              Zuletzt bearbeitete Schläge werden zuerst angezeigt.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Schlag suchen..."
                className="pl-9"
                value={fieldSearch}
                onChange={(e) => setFieldSearch(e.target.value)}
              />
            </div>
            <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
              {filteredFields.map((field) => {
                const isSelected = selectedField?.id === field.id;
                return (
                  <button
                    key={field.id}
                    type="button"
                    onClick={() => setSelectedField(field)}
                    className={`w-full flex items-center justify-between rounded-lg border p-4 text-left transition-colors hover:bg-accent ${
                      isSelected
                        ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                        : 'border-border'
                    }`}
                  >
                    <div>
                      <p className="font-medium">{field.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {field.flaeche} ha &middot; {field.kultur}
                      </p>
                    </div>
                    <div className="text-right shrink-0 ml-4">
                      <p className="text-xs text-muted-foreground">
                        Letzte Maßnahme
                      </p>
                      <p className="text-sm">{field.letzteMassnahme}</p>
                    </div>
                  </button>
                );
              })}
              {filteredFields.length === 0 && (
                <p className="text-center text-muted-foreground py-8">
                  Kein Schlag gefunden.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* ================================================================= */}
      {/* Step 2: Maßnahme wählen                                           */}
      {/* ================================================================= */}
      {step === 2 && (
        <Card>
          <CardHeader>
            <CardTitle>Maßnahme wählen</CardTitle>
            <CardDescription>
              Welche Tätigkeit soll durchgeführt werden?
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {massnahmen.map((m) => {
                const isSelected = selectedMassnahme?.id === m.id;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setSelectedMassnahme(m)}
                    className={`flex flex-col items-center justify-center gap-3 rounded-xl border p-6 text-center transition-all hover:bg-accent hover:shadow-sm ${
                      isSelected
                        ? 'border-primary bg-primary/5 ring-2 ring-primary/20 shadow-sm'
                        : 'border-border'
                    }`}
                  >
                    <div
                      className={`rounded-full p-3 ${
                        isSelected
                          ? 'bg-primary/10 text-primary'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      <MassnahmeIcon icon={m.icon} className="h-8 w-8" />
                    </div>
                    <span className="text-sm font-medium">{m.label}</span>
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* ================================================================= */}
      {/* Step 3: Fahrzeug wählen                                           */}
      {/* ================================================================= */}
      {step === 3 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Tractor className="h-5 w-5" />
              Fahrzeug wählen
            </CardTitle>
            <CardDescription>
              Wählen Sie das Fahrzeug für den Einsatz, oder arbeiten Sie ohne
              Fahrzeug.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {/* Ohne Fahrzeug option */}
            <button
              type="button"
              onClick={() => handleVehicleSelect(null)}
              className={`w-full flex items-center justify-between rounded-lg border p-4 text-left transition-colors hover:bg-accent ${
                ohneVehicle
                  ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                  : 'border-border'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-muted">
                  <span className="text-muted-foreground text-lg font-bold">
                    --
                  </span>
                </div>
                <div>
                  <p className="font-medium">Ohne Fahrzeug</p>
                  <p className="text-sm text-muted-foreground">
                    Handarbeit oder externes Fahrzeug
                  </p>
                </div>
              </div>
            </button>

            <Separator />

            {mockVehicles.map((v) => {
              const isSelected =
                !ohneVehicle && selectedVehicle?.id === v.id;
              return (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => handleVehicleSelect(v)}
                  className={`w-full flex items-center justify-between rounded-lg border p-4 text-left transition-colors hover:bg-accent ${
                    isSelected
                      ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                      : 'border-border'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-muted">
                      <Tractor className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-medium">{v.name}</p>
                      <p className="text-sm text-muted-foreground">{v.typ}</p>
                    </div>
                  </div>
                  <span className="text-sm text-muted-foreground shrink-0">
                    {v.ps} PS
                  </span>
                </button>
              );
            })}
          </CardContent>
        </Card>
      )}

      {/* ================================================================= */}
      {/* Navigation Buttons                                                */}
      {/* ================================================================= */}
      <div className="flex justify-between items-center pt-2">
        {step > 1 ? (
          <Button variant="outline" onClick={goBack} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Zurück
          </Button>
        ) : (
          <Button variant="outline" asChild>
            <Link href={`/${locale}/auftraege`}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Abbrechen
            </Link>
          </Button>
        )}

        <Button onClick={goNext} disabled={!canAdvance()} className="gap-2">
          {step === 3 ? (
            <>
              <Play className="h-4 w-4" />
              Timer starten
            </>
          ) : (
            <>
              Weiter
              <ChevronRight className="h-4 w-4" />
            </>
          )}
        </Button>
      </div>
    </PageLayout>
  );
}
