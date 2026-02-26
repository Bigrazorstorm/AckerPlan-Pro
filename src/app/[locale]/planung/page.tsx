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
// Typen
// ---------------------------------------------------------------------------

interface PlanungsAuftrag {
  id: string;
  schlag: string;
  massnahme: string;
  massnahmeTyp: "pflanzenschutz" | "duengung" | "bodenbearbeitung" | "aussaat" | "ernte" | "sonstiges";
  mitarbeiter: string[];
  maschine: string;
  von: string;
  bis: string;
  tag: number; // 0=Mo, 1=Di, ...6=So
  notiz?: string;
  konflikt?: string;
}

interface WochenDaten {
  kw: number;
  jahr: number;
  startDatum: string;
  endDatum: string;
  tage: { datum: string; wochentag: string; tagImMonat: number }[];
  auftraege: PlanungsAuftrag[];
}

// ---------------------------------------------------------------------------
// Farbschema fuer Massnahmetypen
// ---------------------------------------------------------------------------

const massnahmeTypFarben: Record<string, { bg: string; border: string; text: string; dot: string }> = {
  pflanzenschutz: { bg: "bg-emerald-50", border: "border-emerald-200", text: "text-emerald-800", dot: "bg-emerald-500" },
  duengung: { bg: "bg-amber-50", border: "border-amber-200", text: "text-amber-800", dot: "bg-amber-500" },
  bodenbearbeitung: { bg: "bg-orange-50", border: "border-orange-200", text: "text-orange-800", dot: "bg-orange-500" },
  aussaat: { bg: "bg-blue-50", border: "border-blue-200", text: "text-blue-800", dot: "bg-blue-500" },
  ernte: { bg: "bg-yellow-50", border: "border-yellow-200", text: "text-yellow-800", dot: "bg-yellow-500" },
  sonstiges: { bg: "bg-gray-50", border: "border-gray-200", text: "text-gray-800", dot: "bg-gray-500" },
};

function massnahmeFarbe(typ: string) {
  return massnahmeTypFarben[typ] ?? massnahmeTypFarben.sonstiges;
}

// ---------------------------------------------------------------------------
// Mock-Daten
// ---------------------------------------------------------------------------

function erzeugeMockWoche(kwOffset: number): WochenDaten {
  // Basis: KW 9, 2026 (23.02. - 01.03.)
  const basisStart = new Date(2026, 1, 23); // 23. Feb 2026 (Montag)
  const start = new Date(basisStart);
  start.setDate(start.getDate() + kwOffset * 7);

  const tage = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(start);
    d.setDate(d.getDate() + i);
    return {
      datum: d.toISOString().slice(0, 10),
      wochentag: ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"][i],
      tagImMonat: d.getDate(),
    };
  });

  const ende = new Date(start);
  ende.setDate(ende.getDate() + 6);

  const kwNummer = 9 + kwOffset;

  const auftraege: PlanungsAuftrag[] = [
    {
      id: "pa-001",
      schlag: "Acker Am Waldrand",
      massnahme: "Herbizidbehandlung",
      massnahmeTyp: "pflanzenschutz",
      mitarbeiter: ["Thomas Bauer"],
      maschine: "Fendt 724 Vario",
      von: "07:00",
      bis: "11:00",
      tag: 0,
    },
    {
      id: "pa-002",
      schlag: "Grosses Feld Nord",
      massnahme: "Kalkduengung",
      massnahmeTyp: "duengung",
      mitarbeiter: ["Maria Schmidt", "Klaus Weber"],
      maschine: "John Deere 6130R",
      von: "08:00",
      bis: "15:00",
      tag: 0,
    },
    {
      id: "pa-003",
      schlag: "Weizenacker Sued",
      massnahme: "Grubbern",
      massnahmeTyp: "bodenbearbeitung",
      mitarbeiter: ["Thomas Bauer"],
      maschine: "Fendt 724 Vario",
      von: "13:00",
      bis: "17:00",
      tag: 0,
      konflikt: "Thomas Bauer ist bereits ab 07:00 eingeplant (Herbizidbehandlung endet 11:00 - pruefen!)",
    },
    {
      id: "pa-004",
      schlag: "Kartoffelfeld B3",
      massnahme: "Pflanzung vorbereiten",
      massnahmeTyp: "aussaat",
      mitarbeiter: ["Maria Schmidt"],
      maschine: "Claas Arion 550",
      von: "07:00",
      bis: "14:00",
      tag: 1,
    },
    {
      id: "pa-005",
      schlag: "Maisacker Ost",
      massnahme: "N-Duengung (2. Gabe)",
      massnahmeTyp: "duengung",
      mitarbeiter: ["Klaus Weber"],
      maschine: "John Deere 6130R",
      von: "08:00",
      bis: "12:00",
      tag: 1,
    },
    {
      id: "pa-006",
      schlag: "Acker Am Waldrand",
      massnahme: "Fungizidbehandlung",
      massnahmeTyp: "pflanzenschutz",
      mitarbeiter: ["Thomas Bauer"],
      maschine: "Fendt 724 Vario",
      von: "06:30",
      bis: "10:30",
      tag: 2,
    },
    {
      id: "pa-007",
      schlag: "Rapsfeld West",
      massnahme: "Stoppelbearbeitung",
      massnahmeTyp: "bodenbearbeitung",
      mitarbeiter: ["Klaus Weber", "Maria Schmidt"],
      maschine: "Claas Arion 550",
      von: "11:00",
      bis: "17:00",
      tag: 2,
    },
    {
      id: "pa-008",
      schlag: "Grosses Feld Nord",
      massnahme: "Aussaat Sommergerste",
      massnahmeTyp: "aussaat",
      mitarbeiter: ["Thomas Bauer", "Klaus Weber"],
      maschine: "Fendt 724 Vario",
      von: "07:00",
      bis: "16:00",
      tag: 3,
    },
    {
      id: "pa-009",
      schlag: "Weizenacker Sued",
      massnahme: "Insektizidbehandlung",
      massnahmeTyp: "pflanzenschutz",
      mitarbeiter: ["Maria Schmidt"],
      maschine: "John Deere 6130R",
      von: "07:00",
      bis: "11:00",
      tag: 3,
      konflikt: "John Deere 6130R hat eine faellige Wartung - bitte Werkstattstatus pruefen!",
    },
    {
      id: "pa-010",
      schlag: "Kartoffelfeld B3",
      massnahme: "Kartoffelpflanzung",
      massnahmeTyp: "aussaat",
      mitarbeiter: ["Thomas Bauer", "Maria Schmidt", "Klaus Weber"],
      maschine: "Fendt 724 Vario",
      von: "06:30",
      bis: "16:00",
      tag: 4,
    },
    {
      id: "pa-011",
      schlag: "Maisacker Ost",
      massnahme: "Ernteproben nehmen",
      massnahmeTyp: "ernte",
      mitarbeiter: ["Maria Schmidt"],
      maschine: "-",
      von: "08:00",
      bis: "10:00",
      tag: 5,
    },
  ];

  return {
    kw: kwNummer,
    jahr: 2026,
    startDatum: tage[0].datum,
    endDatum: tage[6].datum,
    tage,
    auftraege,
  };
}

// ---------------------------------------------------------------------------
// Auftragskarte
// ---------------------------------------------------------------------------

function AuftragsKarte({ auftrag }: { auftrag: PlanungsAuftrag }) {
  const farbe = massnahmeFarbe(auftrag.massnahmeTyp);

  return (
    <div
      className={`rounded-lg border p-3 space-y-2 ${farbe.bg} ${farbe.border} transition-shadow hover:shadow-md`}
    >
      {/* Konflikt-Warnung */}
      {auftrag.konflikt && (
        <div className="flex items-start gap-1.5 text-xs bg-red-100 border border-red-300 text-red-800 rounded-md px-2 py-1.5">
          <AlertTriangle className="h-3.5 w-3.5 mt-0.5 shrink-0" />
          <span>{auftrag.konflikt}</span>
        </div>
      )}

      {/* Schlag und Massnahme */}
      <div>
        <p className={`font-semibold text-sm ${farbe.text}`}>{auftrag.schlag}</p>
        <div className="flex items-center gap-1.5 mt-0.5">
          <span className={`inline-block h-2 w-2 rounded-full ${farbe.dot}`} />
          <span className="text-xs text-muted-foreground">{auftrag.massnahme}</span>
        </div>
      </div>

      {/* Zeit */}
      <div className="flex items-center gap-1 text-xs text-muted-foreground">
        <Clock className="h-3 w-3" />
        <span>{auftrag.von} - {auftrag.bis}</span>
      </div>

      {/* Mitarbeiter */}
      <div className="flex items-center gap-1 text-xs text-muted-foreground">
        <User className="h-3 w-3" />
        <span>{auftrag.mitarbeiter.join(", ")}</span>
      </div>

      {/* Maschine */}
      {auftrag.maschine !== "-" && (
        <div className="text-xs text-muted-foreground">
          <span className="font-medium">Maschine:</span> {auftrag.maschine}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Dialog-Platzhalter fuer "Neuer Auftrag planen"
// ---------------------------------------------------------------------------

function NeuerAuftragDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/60" onClick={onClose} />
      {/* Dialog */}
      <div className="relative z-50 w-full max-w-lg rounded-lg border bg-background p-6 shadow-lg">
        <div className="flex flex-col space-y-1.5 text-center sm:text-left mb-6">
          <h2 className="text-lg font-semibold leading-none tracking-tight">Neuen Auftrag planen</h2>
          <p className="text-sm text-muted-foreground">
            Erstellen Sie einen neuen Arbeitsauftrag fuer die Wochenplanung.
          </p>
        </div>

        <div className="space-y-4">
          {/* Schlag */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Schlag</label>
            <select className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
              <option value="">Schlag waehlen...</option>
              <option value="waldrand">Acker Am Waldrand</option>
              <option value="nord">Grosses Feld Nord</option>
              <option value="sued">Weizenacker Sued</option>
              <option value="kartoffel">Kartoffelfeld B3</option>
              <option value="mais">Maisacker Ost</option>
              <option value="raps">Rapsfeld West</option>
            </select>
          </div>

          {/* Massnahme */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Massnahme</label>
            <select className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
              <option value="">Massnahmetyp waehlen...</option>
              <option value="pflanzenschutz">Pflanzenschutz</option>
              <option value="duengung">Duengung</option>
              <option value="bodenbearbeitung">Bodenbearbeitung</option>
              <option value="aussaat">Aussaat</option>
              <option value="ernte">Ernte</option>
              <option value="sonstiges">Sonstiges</option>
            </select>
          </div>

          {/* Wochentag und Zeit */}
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-2">
              <label className="text-sm font-medium">Tag</label>
              <select className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                <option value="0">Montag</option>
                <option value="1">Dienstag</option>
                <option value="2">Mittwoch</option>
                <option value="3">Donnerstag</option>
                <option value="4">Freitag</option>
                <option value="5">Samstag</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Von</label>
              <input type="time" defaultValue="07:00" className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Bis</label>
              <input type="time" defaultValue="15:00" className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
            </div>
          </div>

          {/* Mitarbeiter */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Mitarbeiter</label>
            <div className="flex flex-wrap gap-2">
              {["Thomas Bauer", "Maria Schmidt", "Klaus Weber"].map((name) => (
                <label key={name} className="flex items-center gap-1.5 text-sm">
                  <input type="checkbox" className="rounded border-gray-300" />
                  {name}
                </label>
              ))}
            </div>
          </div>

          {/* Maschine */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Maschine</label>
            <select className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
              <option value="">Maschine waehlen...</option>
              <option value="fendt">Fendt 724 Vario</option>
              <option value="jd">John Deere 6130R</option>
              <option value="claas">Claas Arion 550</option>
            </select>
          </div>

          {/* Notiz */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Notiz (optional)</label>
            <textarea
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm min-h-[60px]"
              placeholder="Hinweise zum Auftrag..."
            />
          </div>
        </div>

        {/* Aktionen */}
        <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 mt-6">
          <Button variant="outline" onClick={onClose}>
            Abbrechen
          </Button>
          <Button onClick={onClose}>
            Auftrag erstellen
          </Button>
        </div>

        {/* Schliessen-Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-sm opacity-70 hover:opacity-100 transition-opacity"
        >
          <span className="sr-only">Schliessen</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
        </button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Hauptkomponente
// ---------------------------------------------------------------------------

export default function PlanungPage() {
  const { locale } = useParams<{ locale: string }>();
  const [kwOffset, setKwOffset] = useState(0);
  const [dialogOffen, setDialogOffen] = useState(false);

  const woche = erzeugeMockWoche(kwOffset);

  // Zusammenfassung berechnen
  const anzahlAuftraege = woche.auftraege.length;
  const alleMitarbeiter = new Set(woche.auftraege.flatMap((a) => a.mitarbeiter));
  const anzahlMitarbeiter = alleMitarbeiter.size;
  const anzahlKonflikte = woche.auftraege.filter((a) => a.konflikt).length;

  function formatDatumKurz(isoString: string): string {
    const d = new Date(isoString);
    return d.toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit" });
  }

  return (
    <div className="space-y-6">
      <PageLayout
        title="Wochenplanung"
        description="Planen und verwalten Sie Arbeitsauftraege fuer Ihr Team"
        headerAction={
          <Button onClick={() => setDialogOffen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Neuer Auftrag planen
          </Button>
        }
      >
        {/* Wochen-Navigation */}
        <Card>
          <CardContent className="py-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-9 w-9"
                  onClick={() => setKwOffset((p) => p - 1)}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <div className="text-center">
                  <h2 className="text-lg font-semibold flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    KW {woche.kw} / {woche.jahr}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {formatDatumKurz(woche.startDatum)} - {formatDatumKurz(woche.endDatum)}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-9 w-9"
                  onClick={() => setKwOffset((p) => p + 1)}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
                {kwOffset !== 0 && (
                  <Button variant="ghost" size="sm" onClick={() => setKwOffset(0)}>
                    Heute
                  </Button>
                )}
              </div>

              {/* Zusammenfassung */}
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1.5">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{anzahlAuftraege}</span>
                  <span className="text-muted-foreground">Auftraege</span>
                </div>
                <Separator orientation="vertical" className="h-5" />
                <div className="flex items-center gap-1.5">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{anzahlMitarbeiter}</span>
                  <span className="text-muted-foreground">Mitarbeiter</span>
                </div>
                {anzahlKonflikte > 0 && (
                  <>
                    <Separator orientation="vertical" className="h-5" />
                    <div className="flex items-center gap-1.5 text-red-600">
                      <AlertTriangle className="h-4 w-4" />
                      <span className="font-medium">{anzahlKonflikte}</span>
                      <span>Konflikte</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Legende */}
        <div className="flex flex-wrap gap-3">
          {Object.entries(massnahmeTypFarben).map(([typ, farbe]) => (
            <div key={typ} className="flex items-center gap-1.5 text-xs">
              <span className={`inline-block h-3 w-3 rounded-full ${farbe.dot}`} />
              <span className="capitalize text-muted-foreground">{typ}</span>
            </div>
          ))}
        </div>

        {/* Wochen-Kalender-Grid */}
        <div className="grid grid-cols-7 gap-3">
          {woche.tage.map((tag, tagIdx) => {
            const tagesAuftraege = woche.auftraege.filter((a) => a.tag === tagIdx);
            const istWochenende = tagIdx >= 5;
            const istHeute = tag.datum === new Date().toISOString().slice(0, 10);

            return (
              <div key={tag.datum} className="min-h-[200px] flex flex-col">
                {/* Tag-Header */}
                <div
                  className={`rounded-t-lg border border-b-0 px-3 py-2 text-center ${
                    istHeute
                      ? "bg-primary text-primary-foreground"
                      : istWochenende
                      ? "bg-muted/50"
                      : "bg-muted"
                  }`}
                >
                  <div className="text-xs font-medium">{tag.wochentag}</div>
                  <div className={`text-lg font-bold ${istHeute ? "" : ""}`}>
                    {tag.tagImMonat}
                  </div>
                  <div className="text-xs opacity-70">{formatDatumKurz(tag.datum)}</div>
                </div>

                {/* Auftrags-Spalte */}
                <div
                  className={`flex-1 rounded-b-lg border border-t-0 p-2 space-y-2 ${
                    istWochenende ? "bg-muted/20" : "bg-card"
                  }`}
                >
                  {tagesAuftraege.length > 0 ? (
                    tagesAuftraege.map((auftrag) => (
                      <AuftragsKarte key={auftrag.id} auftrag={auftrag} />
                    ))
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <span className="text-xs text-muted-foreground italic">
                        {istWochenende ? "Wochenende" : "Keine Auftraege"}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Auftrags-Liste als Tabelle unter dem Kalender */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Alle Auftraege der Woche</CardTitle>
            <CardDescription>
              KW {woche.kw} &middot; {anzahlAuftraege} geplante Auftraege &middot; {anzahlMitarbeiter} Mitarbeiter im Einsatz
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tag</TableHead>
                  <TableHead>Zeit</TableHead>
                  <TableHead>Schlag</TableHead>
                  <TableHead>Massnahme</TableHead>
                  <TableHead>Mitarbeiter</TableHead>
                  <TableHead>Maschine</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {woche.auftraege
                  .sort((a, b) => a.tag - b.tag || a.von.localeCompare(b.von))
                  .map((auftrag) => {
                    const farbe = massnahmeFarbe(auftrag.massnahmeTyp);
                    const tagInfo = woche.tage[auftrag.tag];
                    return (
                      <TableRow key={auftrag.id}>
                        <TableCell className="font-medium">
                          {tagInfo.wochentag} {tagInfo.tagImMonat}.
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          {auftrag.von} - {auftrag.bis}
                        </TableCell>
                        <TableCell className="font-medium">{auftrag.schlag}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1.5">
                            <span className={`inline-block h-2 w-2 rounded-full ${farbe.dot}`} />
                            <span>{auftrag.massnahme}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {auftrag.mitarbeiter.map((m) => (
                              <Badge key={m} variant="outline" className="text-xs">
                                {m}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>{auftrag.maschine}</TableCell>
                        <TableCell>
                          {auftrag.konflikt ? (
                            <Badge className="bg-red-100 text-red-800 border-red-200 gap-1">
                              <AlertTriangle className="h-3 w-3" />
                              Konflikt
                            </Badge>
                          ) : (
                            <Badge className="bg-green-100 text-green-800 border-green-200">
                              Geplant
                            </Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Mitarbeiter-Auslastung */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Mitarbeiter-Auslastung KW {woche.kw}</CardTitle>
            <CardDescription>Geplante Stunden pro Mitarbeiter in dieser Woche</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {Array.from(alleMitarbeiter).map((name) => {
              const mitarbeiterAuftraege = woche.auftraege.filter((a) => a.mitarbeiter.includes(name));
              const geplanteStunden = mitarbeiterAuftraege.reduce((sum, a) => {
                const [vh, vm] = a.von.split(":").map(Number);
                const [bh, bm] = a.bis.split(":").map(Number);
                return sum + (bh + bm / 60) - (vh + vm / 60);
              }, 0);
              const sollStunden = 40;
              const auslastung = Math.min(100, Math.round((geplanteStunden / sollStunden) * 100));

              return (
                <div key={name} className="space-y-1.5">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{name}</span>
                    </div>
                    <span className="text-muted-foreground">
                      {geplanteStunden.toFixed(1)} / {sollStunden} Std. ({auslastung}%)
                    </span>
                  </div>
                  <Progress value={auslastung} className="h-2" />
                  <div className="flex flex-wrap gap-1">
                    {mitarbeiterAuftraege.map((a) => {
                      const f = massnahmeFarbe(a.massnahmeTyp);
                      return (
                        <span key={a.id} className={`text-xs rounded px-1.5 py-0.5 ${f.bg} ${f.text}`}>
                          {woche.tage[a.tag].wochentag}: {a.schlag}
                        </span>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </PageLayout>

      {/* Dialog */}
      <NeuerAuftragDialog open={dialogOffen} onClose={() => setDialogOffen(false)} />
    </div>
  );
}
