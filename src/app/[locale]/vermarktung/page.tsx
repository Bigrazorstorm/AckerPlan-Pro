'use client';

import { useState } from 'react';
import { PageLayout } from "@/components/layout/page-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Plus, TrendingUp, Warehouse, FileText, ArrowRight, Euro } from 'lucide-react';

// Mock data for Erntepartien
const mockPartien = [
  { id: '1', schlag: 'Am Waldrand', kultur: 'Winterweizen', sorte: 'Informer', erntedatum: '2025-08-05', menge: 176.4, feuchte: 14.2, qualität: 'A', lager: 'Flachsilo 1', status: 'Eingelagert' },
  { id: '2', schlag: 'Kirchberg', kultur: 'Wintergerste', sorte: 'KWS Flemming', erntedatum: '2025-07-18', menge: 112.8, feuchte: 13.1, qualität: 'B', lager: 'Flachsilo 2', status: 'Verkauft' },
  { id: '3', schlag: 'Große Breite', kultur: 'Winterraps', sorte: 'Avatar', erntedatum: '2025-07-28', menge: 128.4, feuchte: 7.8, qualität: '-', lager: 'Silo A', status: 'Teilweise verkauft' },
  { id: '4', schlag: 'Talwiese', kultur: 'Silomais', sorte: 'P8888', erntedatum: '2025-10-02', menge: 553.2, feuchte: 32.5, qualität: '-', lager: 'Fahrsilo', status: 'Eingelagert' },
];

// Mock data for Kontrakte
const mockKontrakte = [
  { id: 'K1', partner: 'BayWa AG', kultur: 'Winterweizen', menge: 150, preis: 225, einheit: '€/t', lieferung: '2025-09-30', status: 'Offen', geliefert: 0 },
  { id: 'K2', partner: 'AGRAVIS Raiffeisen AG', kultur: 'Wintergerste', menge: 100, preis: 198, einheit: '€/t', lieferung: '2025-08-31', status: 'Erfüllt', geliefert: 112.8 },
  { id: 'K3', partner: 'ADM Hamburg', kultur: 'Winterraps', menge: 80, preis: 465, einheit: '€/t', lieferung: '2025-10-15', status: 'Teilgeliefert', geliefert: 45 },
  { id: 'K4', partner: 'Biogas Friedrichstal GmbH', kultur: 'Silomais', menge: 500, preis: 42, einheit: '€/t FM', lieferung: '2025-11-30', status: 'Offen', geliefert: 0 },
];

// Mock Erlösübersicht
const mockErloese = [
  { kultur: 'Winterweizen', ha: 24.5, ertragDt: 72, preis: 22.5, erlösHa: 1620, erlösGesamt: 39690 },
  { kultur: 'Wintergerste', ha: 18.2, ertragDt: 62, preis: 19.8, erlösHa: 1228, erlösGesamt: 22350 },
  { kultur: 'Winterraps', ha: 32.1, ertragDt: 40, preis: 46.5, erlösHa: 1860, erlösGesamt: 59706 },
  { kultur: 'Silomais', ha: 15.8, ertragDt: 350, preis: 4.2, erlösHa: 1470, erlösGesamt: 23226 },
];

export default function VermarktungPage() {
  const [sheetOpen, setSheetOpen] = useState(false);
  const currencyFormatter = new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' });
  const totalErlös = mockErloese.reduce((s, e) => s + e.erlösGesamt, 0);

  return (
    <PageLayout title="Vermarktung" description="Erfassen Sie Ernten, verwalten Sie Kontrakte und verfolgen Sie Erlöse.">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Gesamterlös WJ</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold font-tabular text-success">{currencyFormatter.format(totalErlös)}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Erntepartien</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold font-tabular">{mockPartien.length}</div><p className="text-xs text-muted-foreground">{mockPartien.reduce((s, p) => s + p.menge, 0).toFixed(0)} t gesamt</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Offene Kontrakte</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold font-tabular">{mockKontrakte.filter(k => k.status !== 'Erfüllt').length}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Noch eingelagert</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold font-tabular">{mockPartien.filter(p => p.status === 'Eingelagert').reduce((s, p) => s + p.menge, 0).toFixed(0)} t</div></CardContent>
        </Card>
      </div>

      <Tabs defaultValue="partien">
        <TabsList>
          <TabsTrigger value="partien">Erntepartien</TabsTrigger>
          <TabsTrigger value="kontrakte">Kontrakte</TabsTrigger>
          <TabsTrigger value="erloese">Erlösübersicht</TabsTrigger>
        </TabsList>

        {/* Erntepartien Tab */}
        <TabsContent value="partien" className="mt-4 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Erntepartien WJ 2025</h3>
            <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
              <SheetTrigger asChild>
                <Button><Plus className="mr-2 h-4 w-4" />Partie erfassen</Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader><SheetTitle>Neue Erntepartie</SheetTitle></SheetHeader>
                <div className="space-y-4 mt-6">
                  <div className="space-y-2"><Label>Schlag</Label><Select><SelectTrigger><SelectValue placeholder="Schlag wählen" /></SelectTrigger><SelectContent><SelectItem value="1">Am Waldrand</SelectItem><SelectItem value="2">Kirchberg</SelectItem><SelectItem value="3">Große Breite</SelectItem></SelectContent></Select></div>
                  <div className="space-y-2"><Label>Erntedatum</Label><Input type="date" /></div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2"><Label>Erntemenge (t)</Label><Input type="number" placeholder="z.B. 176.4" /></div>
                    <div className="space-y-2"><Label>Feuchte (%)</Label><Input type="number" placeholder="z.B. 14.2" /></div>
                  </div>
                  <div className="space-y-2"><Label>Qualitätsklasse</Label><Select><SelectTrigger><SelectValue placeholder="Qualität" /></SelectTrigger><SelectContent><SelectItem value="E">E-Weizen</SelectItem><SelectItem value="A">A-Weizen</SelectItem><SelectItem value="B">B-Weizen</SelectItem><SelectItem value="-">Keine Klasse</SelectItem></SelectContent></Select></div>
                  <div className="space-y-2"><Label>Lagerort</Label><Input placeholder="z.B. Flachsilo 1" /></div>
                  <div className="space-y-2"><Label>Bemerkungen</Label><Textarea placeholder="z.B. Lagerort, Besonderheiten..." /></div>
                  <Button className="w-full" onClick={() => setSheetOpen(false)}>Partie speichern</Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          <Card>
            <CardContent className="pt-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Erntedatum</TableHead>
                    <TableHead>Schlag</TableHead>
                    <TableHead>Kultur / Sorte</TableHead>
                    <TableHead className="text-right">Menge (t)</TableHead>
                    <TableHead className="text-right">Feuchte (%)</TableHead>
                    <TableHead>Qualität</TableHead>
                    <TableHead>Lager</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockPartien.map(p => (
                    <TableRow key={p.id}>
                      <TableCell>{p.erntedatum}</TableCell>
                      <TableCell className="font-medium">{p.schlag}</TableCell>
                      <TableCell>{p.kultur}<span className="text-muted-foreground text-xs ml-1">({p.sorte})</span></TableCell>
                      <TableCell className="text-right font-tabular">{p.menge.toFixed(1)}</TableCell>
                      <TableCell className="text-right font-tabular">{p.feuchte.toFixed(1)}</TableCell>
                      <TableCell><Badge variant="secondary">{p.qualität}</Badge></TableCell>
                      <TableCell className="text-xs">{p.lager}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={
                          p.status === 'Verkauft' ? 'border-success text-success' :
                          p.status === 'Teilweise verkauft' ? 'border-warning text-warning' :
                          'border-info text-info'
                        }>{p.status}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Kontrakte Tab */}
        <TabsContent value="kontrakte" className="mt-4 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Verkaufskontrakte</h3>
            <Button><Plus className="mr-2 h-4 w-4" />Kontrakt anlegen</Button>
          </div>
          <Card>
            <CardContent className="pt-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Handelspartner</TableHead>
                    <TableHead>Kultur</TableHead>
                    <TableHead className="text-right">Kontraktmenge (t)</TableHead>
                    <TableHead className="text-right">Preis</TableHead>
                    <TableHead className="text-right">Kontraktwert</TableHead>
                    <TableHead>Lieferdatum</TableHead>
                    <TableHead className="text-right">Geliefert (t)</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockKontrakte.map(k => (
                    <TableRow key={k.id}>
                      <TableCell className="font-medium">{k.partner}</TableCell>
                      <TableCell>{k.kultur}</TableCell>
                      <TableCell className="text-right font-tabular">{k.menge}</TableCell>
                      <TableCell className="text-right font-tabular">{k.preis} {k.einheit}</TableCell>
                      <TableCell className="text-right font-tabular font-medium">{currencyFormatter.format(k.menge * k.preis)}</TableCell>
                      <TableCell>{k.lieferung}</TableCell>
                      <TableCell className="text-right font-tabular">{k.geliefert}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={
                          k.status === 'Erfüllt' ? 'border-success text-success' :
                          k.status === 'Teilgeliefert' ? 'border-warning text-warning' :
                          ''
                        }>{k.status}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Erlösübersicht Tab */}
        <TabsContent value="erloese" className="mt-4 space-y-4">
          <h3 className="text-lg font-semibold">Erlösübersicht nach Kultur WJ 2025</h3>
          <Card>
            <CardContent className="pt-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Kultur</TableHead>
                    <TableHead className="text-right">Fläche (ha)</TableHead>
                    <TableHead className="text-right">Ertrag (dt/ha)</TableHead>
                    <TableHead className="text-right">Preis (€/dt)</TableHead>
                    <TableHead className="text-right">Erlös/ha</TableHead>
                    <TableHead className="text-right">Erlös gesamt</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockErloese.map(e => (
                    <TableRow key={e.kultur}>
                      <TableCell className="font-medium">{e.kultur}</TableCell>
                      <TableCell className="text-right font-tabular">{e.ha.toFixed(1)}</TableCell>
                      <TableCell className="text-right font-tabular">{e.ertragDt}</TableCell>
                      <TableCell className="text-right font-tabular">{e.preis.toFixed(2)}</TableCell>
                      <TableCell className="text-right font-tabular">{currencyFormatter.format(e.erlösHa)}</TableCell>
                      <TableCell className="text-right font-tabular font-medium">{currencyFormatter.format(e.erlösGesamt)}</TableCell>
                    </TableRow>
                  ))}
                  <TableRow className="bg-muted/50 font-bold">
                    <TableCell>Summe</TableCell>
                    <TableCell className="text-right font-tabular">{mockErloese.reduce((s, e) => s + e.ha, 0).toFixed(1)}</TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell className="text-right font-tabular text-success">{currencyFormatter.format(totalErlös)}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </PageLayout>
  );
}
