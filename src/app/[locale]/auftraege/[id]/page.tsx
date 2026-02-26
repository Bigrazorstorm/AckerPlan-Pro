'use client';

import { useState, useEffect } from 'react';
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

const mockOrder: {
  id: string; auftragstyp: string; schlag: string; schlagFlaeche: number;
  status: string; datum: string; erstellt: string; verantwortlich: string; bemerkung: string;
  kosten: { lohn: number; maschinen: number; material: number; summe: number };
  zeit: { start: string; ende: string; dauer: string; pausen: string };
  material: { artikel: string; menge: number; einheit: string }[];
  personal: { name: string; rolle: string; stunden: number }[];
  wetter: { temperatur: number; wind: number; windRichtung: string; niederschlag: number; bewölkung: string };
  fahrzeug: string; anbaugeraet: string;
  fotos: { id: string; name: string }[];
} = {
  id: 'AO-2026-0042',
  auftragstyp: 'Bodenbearbeitung',
  schlag: 'Großer Acker (Schlag 12)',
  schlagFlaeche: 14.5,
  status: 'Abgeschlossen',
  datum: '2026-02-20',
  erstellt: '2026-02-20T06:45:00',
  verantwortlich: 'Markus Bauer',
  bemerkung:
    'Pflugfurche 25 cm Tiefe. Boden war gut abgetrocknet, ideale Bedingungen. Am südlichen Rand leichte Verdichtung erkannt -- Nachbearbeitung empfohlen.',
  kosten: {
    lohn: 245.0,
    maschinen: 180.5,
    material: 0,
    summe: 425.5,
  },
  zeit: {
    start: '07:15',
    ende: '14:30',
    dauer: '6 Std. 45 Min.',
    pausen: '30 Min.',
  },
  material: [
    { artikel: 'Diesel', menge: 120, einheit: 'Liter' },
    { artikel: 'Hydrauliköl', menge: 2, einheit: 'Liter' },
  ],
  personal: [
    { name: 'Markus Bauer', rolle: 'Fahrer', stunden: 7.25 },
    { name: 'Stefan Klein', rolle: 'Helfer', stunden: 4.0 },
  ],
  wetter: {
    temperatur: 8,
    wind: 12,
    windRichtung: 'SW',
    niederschlag: 0,
    bewölkung: 'Teilweise bewölkt',
  },
  fahrzeug: 'John Deere 6130R',
  anbaugeraet: 'Lemken Juwel 8 Pflug',
  fotos: [
    { id: '1', name: 'Feld_vor_Bearbeitung.jpg' },
    { id: '2', name: 'Pflugfurche_Detail.jpg' },
    { id: '3', name: 'Feld_nach_Bearbeitung.jpg' },
  ],
};

// ---------------------------------------------------------------------------
// Helper: Status Badge
// ---------------------------------------------------------------------------

function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { className: string; label: string }> = {
    Abgeschlossen: {
      className: 'bg-green-100 text-green-800 border-green-200',
      label: 'Abgeschlossen',
    },
    'In Bearbeitung': {
      className: 'bg-blue-100 text-blue-800 border-blue-200',
      label: 'In Bearbeitung',
    },
    Geplant: {
      className: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      label: 'Geplant',
    },
    Freigegeben: {
      className: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      label: 'Freigegeben',
    },
    Abgelehnt: {
      className: 'bg-red-100 text-red-800 border-red-200',
      label: 'Abgelehnt',
    },
  };

  const c = config[status] ?? {
    className: '',
    label: status,
  };

  return (
    <Badge variant="outline" className={c.className}>
      {c.label}
    </Badge>
  );
}

// ---------------------------------------------------------------------------
// Component: Arbeitsauftrag Detail Page
// ---------------------------------------------------------------------------

export default function AuftragDetailPage() {
  const { id, locale } = useParams<{ id: string; locale: string }>();
  const [order, setOrder] = useState(mockOrder);
  const [comment, setComment] = useState(order.bemerkung);
  const [isApproved, setIsApproved] = useState(false);

  const currencyFormatter = new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
  });

  const handleApprove = () => {
    setOrder((prev) => ({ ...prev, status: 'Freigegeben' as const }));
    setIsApproved(true);
  };

  return (
    <PageLayout
      title={`Auftrag ${order.id}`}
      description={`${order.auftragstyp} -- ${order.schlag}`}
      breadcrumbs={[
        { label: 'Aufträge', href: `/${locale}/auftraege` },
        { label: order.id },
      ]}
      headerAction={
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href={`/${locale}/auftraege`}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Zurück
            </Link>
          </Button>
          <Button variant="outline">Bearbeiten</Button>
          {order.status === 'Abgeschlossen' && !isApproved && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button>Freigabe erteilen</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Auftrag freigeben?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Hiermit wird der Arbeitsauftrag {order.id} als geprüft und
                    freigegeben markiert. Die Kosten werden in die Abrechnung
                    übernommen.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Abbrechen</AlertDialogCancel>
                  <AlertDialogAction onClick={handleApprove}>
                    Freigeben
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      }
    >
      {/* ----------------------------------------------------------------- */}
      {/* Header Summary Row                                                */}
      {/* ----------------------------------------------------------------- */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Auftragstyp</p>
            <p className="text-lg font-semibold">{order.auftragstyp}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Schlag</p>
            <p className="text-lg font-semibold">{order.schlag}</p>
            <p className="text-xs text-muted-foreground">
              {order.schlagFlaeche} ha
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Status</p>
            <div className="mt-1">
              <StatusBadge status={order.status} />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Datum</p>
            <p className="text-lg font-semibold">
              {new Date(order.datum).toLocaleDateString('de-DE', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
              })}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* ----------------------------------------------------------------- */}
      {/* Main Content Grid                                                 */}
      {/* ----------------------------------------------------------------- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ---------- Left Column ---------- */}
        <div className="space-y-6">
          {/* Cost Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Kostenaufstellung</CardTitle>
              <CardDescription>Aufschlüsselung der Auftragskosten</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Lohnkosten</span>
                <span className="font-medium">
                  {currencyFormatter.format(order.kosten.lohn)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Maschinenkosten</span>
                <span className="font-medium">
                  {currencyFormatter.format(order.kosten.maschinen)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Materialkosten</span>
                <span className="font-medium">
                  {currencyFormatter.format(order.kosten.material)}
                </span>
              </div>
              <Separator />
              <div className="flex justify-between font-bold text-lg">
                <span>Summe</span>
                <span>{currencyFormatter.format(order.kosten.summe)}</span>
              </div>
            </CardContent>
          </Card>

          {/* Time Tracking */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Zeiterfassung
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Start</span>
                <span className="font-medium">{order.zeit.start} Uhr</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Ende</span>
                <span className="font-medium">{order.zeit.ende} Uhr</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Pausen</span>
                <span className="font-medium">{order.zeit.pausen}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-bold">
                <span>Netto-Arbeitszeit</span>
                <span>{order.zeit.dauer}</span>
              </div>
            </CardContent>
          </Card>

          {/* Weather */}
          <Card>
            <CardHeader>
              <CardTitle>Wetter bei Durchführung</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-2 text-muted-foreground">
                  <Thermometer className="h-4 w-4" />
                  Temperatur
                </span>
                <span className="font-medium">{order.wetter.temperatur} °C</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-2 text-muted-foreground">
                  <Wind className="h-4 w-4" />
                  Wind
                </span>
                <span className="font-medium">
                  {order.wetter.wind} km/h {order.wetter.windRichtung}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-2 text-muted-foreground">
                  <Droplets className="h-4 w-4" />
                  Niederschlag
                </span>
                <span className="font-medium">
                  {order.wetter.niederschlag} mm
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Bewölkung</span>
                <span className="font-medium">{order.wetter.bewölkung}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ---------- Center + Right Columns ---------- */}
        <div className="lg:col-span-2 space-y-6">
          {/* Fahrzeug / Anbaugerät */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Tractor className="h-5 w-5" />
                Fahrzeug &amp; Gerät
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Fahrzeug</span>
                <span className="font-medium">{order.fahrzeug}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Anbaugerät</span>
                <span className="font-medium">{order.anbaugeraet}</span>
              </div>
            </CardContent>
          </Card>

          {/* Material List */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Eingesetztes Material
              </CardTitle>
              <CardDescription>Verbrauchte Materialien für diesen Auftrag</CardDescription>
            </CardHeader>
            <CardContent>
              {order.material.length > 0 ? (
                <div className="rounded-md border">
                  <div className="grid grid-cols-3 gap-4 p-3 bg-muted/50 text-sm font-medium text-muted-foreground">
                    <span>Artikel</span>
                    <span className="text-right">Menge</span>
                    <span className="text-right">Einheit</span>
                  </div>
                  {order.material.map((m, idx) => (
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
              ) : (
                <p className="text-sm text-muted-foreground">
                  Kein Material erfasst.
                </p>
              )}
            </CardContent>
          </Card>

          {/* Personnel */}
          <Card>
            <CardHeader>
              <CardTitle>Eingesetztes Personal</CardTitle>
              <CardDescription>Am Auftrag beteiligte Mitarbeiter</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <div className="grid grid-cols-3 gap-4 p-3 bg-muted/50 text-sm font-medium text-muted-foreground">
                  <span>Name</span>
                  <span>Rolle</span>
                  <span className="text-right">Stunden</span>
                </div>
                {order.personal.map((p, idx) => (
                  <div
                    key={idx}
                    className="grid grid-cols-3 gap-4 p-3 border-t text-sm"
                  >
                    <span className="font-medium">{p.name}</span>
                    <span className="text-muted-foreground">{p.rolle}</span>
                    <span className="text-right">{p.stunden.toFixed(2)} h</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* GPS Track Placeholder */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                GPS-Strecke
              </CardTitle>
              <CardDescription>Aufgezeichneter Fahrweg während des Auftrags</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center h-48 rounded-lg border-2 border-dashed bg-muted/30">
                <div className="text-center text-muted-foreground">
                  <MapPin className="mx-auto h-10 w-10 mb-2" />
                  <p className="text-sm font-medium">Kartenansicht</p>
                  <p className="text-xs">
                    GPS-Track wird hier angezeigt, wenn verfügbar
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Photos Placeholder */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="h-5 w-5" />
                Fotos
              </CardTitle>
              <CardDescription>
                {order.fotos.length} Foto{order.fotos.length !== 1 ? 's' : ''}{' '}
                aufgenommen
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {order.fotos.map((foto) => (
                  <div
                    key={foto.id}
                    className="flex flex-col items-center justify-center h-32 rounded-lg border-2 border-dashed bg-muted/30 cursor-pointer hover:bg-muted/50 transition-colors"
                  >
                    <Camera className="h-8 w-8 text-muted-foreground mb-1" />
                    <span className="text-xs text-muted-foreground truncate max-w-[90%]">
                      {foto.name}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Comment */}
          <Card>
            <CardHeader>
              <CardTitle>Bemerkungen</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="comment">Kommentar zum Auftrag</Label>
                <textarea
                  id="comment"
                  className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Bemerkungen zum Arbeitsauftrag..."
                />
              </div>
              <div className="flex justify-end">
                <Button variant="outline" size="sm">
                  Kommentar speichern
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageLayout>
  );
}
