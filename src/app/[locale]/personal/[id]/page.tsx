'use client';

import { useState } from 'react';
import { PageLayout } from "@/components/layout/page-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, ChevronLeft, ChevronRight, Download, Plus, AlertTriangle, User, Clock, Calendar, Shield, FileText } from "lucide-react";

// ---------------------------------------------------------------------------
// Mock-Daten
// ---------------------------------------------------------------------------

const mockMitarbeiter = {
  id: "ma-001",
  vorname: "Thomas",
  nachname: "Bauer",
  personalnummer: "P-2024-0042",
  email: "t.bauer@hof-mueller.de",
  telefon: "+49 171 5553842",
  rolle: "Vorarbeiter",
  status: "aktiv" as const,
  beschaeftigungsart: "Vollzeit",
  stundensatz: 28.5,
  eintrittsdatum: "2019-03-15",
};

const mockQualifikationen = [
  {
    id: "q1",
    bezeichnung: "PSM Sachkundenachweis",
    nummer: "PSM-2022-88431",
    ablaufdatum: "2027-06-30",
    kategorie: "Pflanzenschutz",
  },
  {
    id: "q2",
    bezeichnung: "Motorsaegenschein (AS Baum I)",
    ablaufdatum: "2026-09-15",
    kategorie: "Forstarbeit",
  },
  {
    id: "q3",
    bezeichnung: "Erste-Hilfe-Kurs",
    ablaufdatum: "2026-04-10",
    kategorie: "Sicherheit",
  },
  {
    id: "q4",
    bezeichnung: "ADR-Bescheinigung",
    ablaufdatum: "2026-03-01",
    kategorie: "Gefahrgut",
  },
  {
    id: "q5",
    bezeichnung: "Ladungssicherung VDI 2700",
    ablaufdatum: "2025-12-20",
    kategorie: "Transport",
  },
];

const mockFuehrerscheinklassen = ["B", "BE", "T", "L", "C1", "C1E"];

const mockArbeitszeitenMonat = [
  { woche: "KW 5 (27.01. - 02.02.)", sollStunden: 40, istStunden: 42.5, ueberstunden: 2.5 },
  { woche: "KW 6 (03.02. - 09.02.)", sollStunden: 40, istStunden: 38.0, ueberstunden: -2.0 },
  { woche: "KW 7 (10.02. - 16.02.)", sollStunden: 40, istStunden: 45.0, ueberstunden: 5.0 },
  { woche: "KW 8 (17.02. - 23.02.)", sollStunden: 40, istStunden: 40.0, ueberstunden: 0 },
];

const mockTageseintraege = [
  { datum: "Mo 24.02.", von: "06:30", bis: "15:00", pause: "0:30", netto: 8.0 },
  { datum: "Di 25.02.", von: "06:30", bis: "15:30", pause: "0:30", netto: 8.5 },
  { datum: "Mi 26.02.", von: "07:00", bis: "15:30", pause: "0:30", netto: 8.0 },
  { datum: "Do 27.02.", von: "06:30", bis: "16:00", pause: "0:30", netto: 9.0 },
  { datum: "Fr 28.02.", von: "07:00", bis: "13:00", pause: "0:00", netto: 6.0 },
];

const mockEinsaetze = [
  { id: "e1", datum: "2026-02-25", schlag: "Acker Am Waldrand", massnahme: "Pflanzenschutz", dauer: 3.5, kosten: 245.0 },
  { id: "e2", datum: "2026-02-24", schlag: "Grosses Feld Nord", massnahme: "Duengung", dauer: 4.0, kosten: 320.0 },
  { id: "e3", datum: "2026-02-22", schlag: "Weizenacker Sued", massnahme: "Bodenbearbeitung", dauer: 6.0, kosten: 480.0 },
  { id: "e4", datum: "2026-02-20", schlag: "Kartoffelfeld B3", massnahme: "Pflanzung", dauer: 5.5, kosten: 412.5 },
  { id: "e5", datum: "2026-02-18", schlag: "Maisacker Ost", massnahme: "Saatbettvorbereitung", dauer: 7.0, kosten: 560.0 },
  { id: "e6", datum: "2026-02-15", schlag: "Acker Am Waldrand", massnahme: "Pflanzenschutz", dauer: 2.5, kosten: 175.0 },
  { id: "e7", datum: "2026-02-12", schlag: "Grosses Feld Nord", massnahme: "Kalkung", dauer: 3.0, kosten: 240.0 },
  { id: "e8", datum: "2026-02-10", schlag: "Weizenacker Sued", massnahme: "Ernte", dauer: 8.0, kosten: 640.0 },
];

// ---------------------------------------------------------------------------
// Hilfsfunktionen
// ---------------------------------------------------------------------------

function getQualifikationsAmpel(ablaufdatum: string): { farbe: "gruen" | "gelb" | "rot"; label: string } {
  const heute = new Date();
  const ablauf = new Date(ablaufdatum);
  const diffTage = Math.floor((ablauf.getTime() - heute.getTime()) / (1000 * 60 * 60 * 24));

  if (diffTage < 0) {
    return { farbe: "rot", label: "Abgelaufen" };
  }
  if (diffTage < 60) {
    return { farbe: "gelb", label: `Laeuft in ${diffTage} Tagen ab` };
  }
  return { farbe: "gruen", label: "Gueltig" };
}

function ampelBadgeClasses(farbe: "gruen" | "gelb" | "rot"): string {
  switch (farbe) {
    case "gruen":
      return "bg-green-100 text-green-800 border-green-200";
    case "gelb":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "rot":
      return "bg-red-100 text-red-800 border-red-200";
  }
}

function formatDatum(isoString: string): string {
  const d = new Date(isoString);
  return d.toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year: "numeric" });
}

function formatWaehrung(betrag: number): string {
  return new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" }).format(betrag);
}

// ---------------------------------------------------------------------------
// Tabs
// ---------------------------------------------------------------------------

function StammdatenTab() {
  const ma = mockMitarbeiter;

  const felder: { label: string; wert: string | React.ReactNode }[] = [
    { label: "Nachname", wert: ma.nachname },
    { label: "Vorname", wert: ma.vorname },
    { label: "Personalnummer", wert: <span className="font-mono text-xs bg-muted rounded-md px-2 py-1">{ma.personalnummer}</span> },
    { label: "E-Mail", wert: <a href={`mailto:${ma.email}`} className="text-primary underline underline-offset-4">{ma.email}</a> },
    { label: "Telefon", wert: ma.telefon },
    { label: "Beschaeftigungsart", wert: ma.beschaeftigungsart },
    { label: "Eintrittsdatum", wert: formatDatum(ma.eintrittsdatum) },
    { label: "Stundensatz (Betriebsleiter)", wert: formatWaehrung(ma.stundensatz) },
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <User className="h-5 w-5" />
            Persoenliche Daten
          </CardTitle>
          <CardDescription>Stammdaten des Mitarbeiters</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          {felder.map((f, i) => (
            <div key={i} className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
              <span className="text-sm text-muted-foreground">{f.label}</span>
              <span className="font-medium text-sm">{f.wert}</span>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Vertragsinformationen
          </CardTitle>
          <CardDescription>Beschaeftigung und Konditionen</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Rolle</span>
            <Badge variant="outline">{ma.rolle}</Badge>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Status</span>
            <Badge className="bg-green-100 text-green-800 border-green-200">
              {ma.status === "aktiv" ? "Aktiv" : "Inaktiv"}
            </Badge>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Wochenstunden (Soll)</span>
            <span className="font-medium text-sm">40,0 Std.</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Urlaubsanspruch</span>
            <span className="font-medium text-sm">30 Tage / Jahr</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Resturlaub 2026</span>
            <span className="font-medium text-sm">18 Tage</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function QualifikationenTab() {
  return (
    <div className="space-y-6">
      {/* PSM Sachkundenachweis - Spezialbereich */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Shield className="h-5 w-5" />
            PSM Sachkundenachweis
          </CardTitle>
          <CardDescription>Pflanzenschutz-Sachkundenachweis nach PflSchG</CardDescription>
        </CardHeader>
        <CardContent>
          {(() => {
            const psm = mockQualifikationen.find((q) => q.bezeichnung === "PSM Sachkundenachweis");
            if (!psm) return <p className="text-muted-foreground">Kein PSM Nachweis hinterlegt.</p>;
            const ampel = getQualifikationsAmpel(psm.ablaufdatum);
            return (
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-1">
                  <span className="text-xs text-muted-foreground">Nachweisnnummer</span>
                  <p className="font-mono text-sm bg-muted rounded-md px-2 py-1 inline-block">{psm.nummer}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-xs text-muted-foreground">Gueltig bis</span>
                  <p className="font-medium text-sm">{formatDatum(psm.ablaufdatum)}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-xs text-muted-foreground">Status</span>
                  <div>
                    <Badge className={ampelBadgeClasses(ampel.farbe)}>{ampel.label}</Badge>
                  </div>
                </div>
              </div>
            );
          })()}
        </CardContent>
      </Card>

      {/* Fuehrerscheinklassen */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Fuehrerscheinklassen</CardTitle>
          <CardDescription>Vorhandene Fahrerlaubnisklassen</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {mockFuehrerscheinklassen.map((klasse) => (
              <Badge key={klasse} variant="outline" className="text-sm px-3 py-1">
                Klasse {klasse}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Alle Qualifikationen */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div className="space-y-1">
            <CardTitle className="text-lg">Alle Qualifikationen</CardTitle>
            <CardDescription>Uebersicht aller Nachweise und Zertifikate</CardDescription>
          </div>
          <Button size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Neue Qualifikation hinzufuegen
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Bezeichnung</TableHead>
                <TableHead>Kategorie</TableHead>
                <TableHead>Ablaufdatum</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockQualifikationen.map((q) => {
                const ampel = getQualifikationsAmpel(q.ablaufdatum);
                return (
                  <TableRow key={q.id}>
                    <TableCell className="font-medium">{q.bezeichnung}</TableCell>
                    <TableCell>{q.kategorie}</TableCell>
                    <TableCell>{formatDatum(q.ablaufdatum)}</TableCell>
                    <TableCell>
                      <Badge className={ampelBadgeClasses(ampel.farbe)}>
                        {ampel.farbe === "rot" && <AlertTriangle className="mr-1 h-3 w-3" />}
                        {ampel.label}
                      </Badge>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

function ArbeitszeitenTab() {
  const [ansicht, setAnsicht] = useState<"kalender" | "liste">("liste");
  const [monat, setMonat] = useState("Februar 2026");

  const gesamtSoll = mockArbeitszeitenMonat.reduce((s, w) => s + w.sollStunden, 0);
  const gesamtIst = mockArbeitszeitenMonat.reduce((s, w) => s + w.istStunden, 0);
  const ueberstundenSaldo = gesamtIst - gesamtSoll;
  const progressProzent = Math.min(100, Math.round((gesamtIst / gesamtSoll) * 100));

  return (
    <div className="space-y-6">
      {/* Monat-Navigation */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div className="flex items-center gap-3">
            <Button variant="outline" size="icon" className="h-8 w-8">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <CardTitle className="text-lg flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              {monat}
            </CardTitle>
            <Button variant="outline" size="icon" className="h-8 w-8">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant={ansicht === "liste" ? "default" : "outline"}
              size="sm"
              onClick={() => setAnsicht("liste")}
            >
              Liste
            </Button>
            <Button
              variant={ansicht === "kalender" ? "default" : "outline"}
              size="sm"
              onClick={() => setAnsicht("kalender")}
            >
              Kalender
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Zusammenfassung */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-muted-foreground">Soll-Stunden</div>
            <div className="text-2xl font-bold">{gesamtSoll.toFixed(1)} Std.</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-muted-foreground">Ist-Stunden</div>
            <div className="text-2xl font-bold">{gesamtIst.toFixed(1)} Std.</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-muted-foreground">Ueberstunden-Saldo</div>
            <div className={`text-2xl font-bold ${ueberstundenSaldo >= 0 ? "text-green-600" : "text-red-600"}`}>
              {ueberstundenSaldo > 0 ? "+" : ""}
              {ueberstundenSaldo.toFixed(1)} Std.
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-muted-foreground">Erfuellung</div>
            <div className="text-2xl font-bold">{progressProzent}%</div>
            <Progress value={progressProzent} className="mt-2 h-2" />
          </CardContent>
        </Card>
      </div>

      {/* Wochenansicht */}
      {ansicht === "liste" ? (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Wochenuebersicht</CardTitle>
              <CardDescription>Zusammenfassung nach Kalenderwochen</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Woche</TableHead>
                    <TableHead className="text-right">Soll</TableHead>
                    <TableHead className="text-right">Ist</TableHead>
                    <TableHead className="text-right">Differenz</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockArbeitszeitenMonat.map((w, i) => (
                    <TableRow key={i}>
                      <TableCell className="font-medium">{w.woche}</TableCell>
                      <TableCell className="text-right">{w.sollStunden.toFixed(1)} Std.</TableCell>
                      <TableCell className="text-right">{w.istStunden.toFixed(1)} Std.</TableCell>
                      <TableCell className={`text-right font-medium ${w.ueberstunden >= 0 ? "text-green-600" : "text-red-600"}`}>
                        {w.ueberstunden > 0 ? "+" : ""}
                        {w.ueberstunden.toFixed(1)} Std.
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Aktuelle Woche Detail */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Aktuelle Woche (KW 9)</CardTitle>
              <CardDescription>Tageseintraege der laufenden Woche</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tag</TableHead>
                    <TableHead>Beginn</TableHead>
                    <TableHead>Ende</TableHead>
                    <TableHead>Pause</TableHead>
                    <TableHead className="text-right">Netto</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockTageseintraege.map((t, i) => (
                    <TableRow key={i}>
                      <TableCell className="font-medium">{t.datum}</TableCell>
                      <TableCell>{t.von}</TableCell>
                      <TableCell>{t.bis}</TableCell>
                      <TableCell>{t.pause}</TableCell>
                      <TableCell className="text-right font-medium">{t.netto.toFixed(1)} Std.</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </>
      ) : (
        /* Kalenderansicht */
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Kalenderansicht - {monat}</CardTitle>
            <CardDescription>Tagesansicht mit Arbeitsstunden</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-1 text-center">
              {["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"].map((tag) => (
                <div key={tag} className="text-xs font-medium text-muted-foreground py-2">
                  {tag}
                </div>
              ))}
              {/* Leere Zellen fuer Offset (Februar 2026 startet am Sonntag -> 6 leere Zellen bei Mo-Start) */}
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={`empty-${i}`} className="h-16" />
              ))}
              {Array.from({ length: 28 }).map((_, i) => {
                const tag = i + 1;
                const istWochentag = ((6 + i) % 7) < 5; // Berechnung fuer Feb 2026
                const stunden = istWochentag ? (7.5 + Math.random() * 2).toFixed(1) : null;
                return (
                  <div
                    key={tag}
                    className={`h-16 rounded-md border text-xs flex flex-col items-center justify-center gap-0.5 ${
                      istWochentag ? "bg-card" : "bg-muted/30"
                    } ${tag === 26 ? "ring-2 ring-primary" : ""}`}
                  >
                    <span className={`font-medium ${tag === 26 ? "text-primary" : ""}`}>{tag}</span>
                    {stunden && (
                      <span className="text-muted-foreground">{stunden}h</span>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Export Buttons */}
      <div className="flex gap-3">
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Export als PDF
        </Button>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Export als CSV
        </Button>
      </div>
    </div>
  );
}

function EinsaetzeTab() {
  const gesamtDauer = mockEinsaetze.reduce((s, e) => s + e.dauer, 0);
  const gesamtKosten = mockEinsaetze.reduce((s, e) => s + e.kosten, 0);

  return (
    <div className="space-y-6">
      {/* Zusammenfassung */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-muted-foreground">Einsaetze gesamt</div>
            <div className="text-2xl font-bold">{mockEinsaetze.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-muted-foreground">Gesamtdauer</div>
            <div className="text-2xl font-bold">{gesamtDauer.toFixed(1)} Std.</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-muted-foreground">Gesamtkosten</div>
            <div className="text-2xl font-bold">{formatWaehrung(gesamtKosten)}</div>
          </CardContent>
        </Card>
      </div>

      {/* Einsatz-Tabelle */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Alle Einsaetze</CardTitle>
          <CardDescription>
            Arbeitsauftraege dieses Mitarbeiters im aktuellen Zeitraum
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Datum</TableHead>
                <TableHead>Schlag</TableHead>
                <TableHead>Massnahme</TableHead>
                <TableHead className="text-right">Dauer</TableHead>
                <TableHead className="text-right">Kosten</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockEinsaetze.map((e) => (
                <TableRow key={e.id}>
                  <TableCell>{formatDatum(e.datum)}</TableCell>
                  <TableCell className="font-medium">{e.schlag}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{e.massnahme}</Badge>
                  </TableCell>
                  <TableCell className="text-right">{e.dauer.toFixed(1)} Std.</TableCell>
                  <TableCell className="text-right font-medium">{formatWaehrung(e.kosten)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Hauptkomponente
// ---------------------------------------------------------------------------

export default function PersonalDetailPage() {
  const { id, locale } = useParams<{ id: string; locale: string }>();
  const ma = mockMitarbeiter;

  return (
    <div className="space-y-6">
      {/* Zurueck-Button */}
      <div>
        <Button variant="ghost" asChild>
          <Link href={`/${locale}/personal`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Zurueck zur Personaluebersicht
          </Link>
        </Button>
      </div>

      {/* Kopfbereich */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
            <User className="h-8 w-8" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                {ma.vorname} {ma.nachname}
              </h1>
              <Badge className={ma.status === "aktiv" ? "bg-green-100 text-green-800 border-green-200" : "bg-red-100 text-red-800 border-red-200"}>
                {ma.status === "aktiv" ? "Aktiv" : "Inaktiv"}
              </Badge>
            </div>
            <p className="text-muted-foreground">
              {ma.rolle} &middot; {ma.personalnummer} &middot; {ma.beschaeftigungsart}
            </p>
          </div>
        </div>
      </div>

      <Separator />

      {/* Tabs */}
      <Tabs defaultValue="stammdaten" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-flex">
          <TabsTrigger value="stammdaten" className="gap-2">
            <User className="h-4 w-4 hidden sm:inline-block" />
            Stammdaten
          </TabsTrigger>
          <TabsTrigger value="qualifikationen" className="gap-2">
            <Shield className="h-4 w-4 hidden sm:inline-block" />
            Qualifikationen
          </TabsTrigger>
          <TabsTrigger value="arbeitszeiten" className="gap-2">
            <Clock className="h-4 w-4 hidden sm:inline-block" />
            Arbeitszeiten
          </TabsTrigger>
          <TabsTrigger value="einsaetze" className="gap-2">
            <Calendar className="h-4 w-4 hidden sm:inline-block" />
            Einsaetze
          </TabsTrigger>
        </TabsList>

        <TabsContent value="stammdaten">
          <StammdatenTab />
        </TabsContent>

        <TabsContent value="qualifikationen">
          <QualifikationenTab />
        </TabsContent>

        <TabsContent value="arbeitszeiten">
          <ArbeitszeitenTab />
        </TabsContent>

        <TabsContent value="einsaetze">
          <EinsaetzeTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
