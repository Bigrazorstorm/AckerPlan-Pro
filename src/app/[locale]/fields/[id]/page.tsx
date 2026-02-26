'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useSession } from '@/context/session-context';
import dataService from '@/services';
import { Field, Operation, FieldEconomics, Observation } from '@/services/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Tractor, Pencil, Plus, Camera, FileText, MapPin, Download, Bug, CloudRain, Upload } from 'lucide-react';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { de, enUS } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { GrowthChart } from '@/components/fields/growth-chart';
import { EditFieldForm } from '@/components/fields/edit-field-form';
import { EmptyState } from '@/components/ui/empty-state';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';

function FieldDetailSkeleton() {
  return (
    <div className="space-y-6">
      <div><Skeleton className="h-9 w-44" /></div>
      <div>
        <Skeleton className="h-9 w-64 mb-2" />
        <Skeleton className="h-4 w-96" />
      </div>
      <Skeleton className="h-10 w-full max-w-2xl" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <Card><CardHeader><Skeleton className="h-6 w-1/3" /></CardHeader><CardContent className="grid gap-4">{[...Array(4)].map((_, i) => (<div key={i} className="flex justify-between"><Skeleton className="h-4 w-24" /><Skeleton className="h-5 w-32" /></div>))}</CardContent></Card>
        </div>
        <div className="lg:col-span-2">
          <Card><CardHeader><Skeleton className="h-6 w-1/2" /><Skeleton className="h-4 w-3/4" /></CardHeader><CardContent><div className="space-y-2">{[...Array(5)].map((_, i) => (<Skeleton key={i} className="h-10 w-full" />))}</div></CardContent></Card>
        </div>
      </div>
    </div>
  );
}

// Mock data for enhanced detail sections
const mockPachtInfo = { verpächter: 'Hans Müller', preisProHa: 450, laufzeitBis: '2027-12-31', flik: 'DETH012345678' };
const mockAuflagen = ['AUKM-Blühstreifen', 'Wasserschutzgebiet Zone III'];
const mockFlurstuecke = [
  { nr: '1234/5', gemarkung: 'Friedrichstal', fläche: 12.3 },
  { nr: '1234/6', gemarkung: 'Friedrichstal', fläche: 8.7 },
];
const mockBodenanalysen = [
  { datum: '2024-03-15', ph: 6.8, n: 42, p: 18, k: 22, mg: 12, humus: 2.4 },
  { datum: '2022-04-10', ph: 6.5, n: 38, p: 16, k: 20, mg: 11, humus: 2.3 },
];
const mockSchaeden = [
  { id: '1', datum: '2025-09-15', typ: 'Wildschaden', wildart: 'Wildschwein', fläche: 0.8, grad: 3, status: 'Gemeldet' },
  { id: '2', datum: '2025-07-22', typ: 'Unwetter', wildart: 'Hagel', fläche: 5.2, grad: 4, status: 'Reguliert' },
];
const mockDokumente = [
  { name: 'PSM-Protokoll WJ 2025', typ: 'PDF', datum: '2025-12-01' },
  { name: 'Düngedokumentation WJ 2025', typ: 'PDF', datum: '2025-11-15' },
  { name: 'Bodenanalyse LUFA 2024', typ: 'PDF', datum: '2024-03-20' },
];

export default function FieldDetailPage() {
  const { id, locale } = useParams<{ id: string; locale: string }>();
  const { activeCompany, loading: sessionLoading } = useSession();
  const [field, setField] = useState<Field | null>(null);
  const [operations, setOperations] = useState<Operation[]>([]);
  const [fieldObservations, setFieldObservations] = useState<Observation[]>([]);
  const [economics, setEconomics] = useState<FieldEconomics | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  const t = useTranslations('FieldDetailPage');
  const tOperationTypes = useTranslations('OperationTypes');
  const tOperationStatuses = useTranslations('OperationStatuses');

  useEffect(() => {
    if (activeCompany) {
      const fetchData = async () => {
        setLoading(true);
        const fieldData = await dataService.getFieldById(activeCompany.tenantId, activeCompany.id, id);
        setField(fieldData);
        if (fieldData) {
          const [opsData, economicsData, obsData] = await Promise.all([
            dataService.getOperationsForField(activeCompany.tenantId, activeCompany.id, fieldData.name),
            dataService.getFieldEconomics(activeCompany.tenantId, activeCompany.id, fieldData.id),
            dataService.getObservationsForField(activeCompany.tenantId, activeCompany.id, fieldData.name),
          ]);
          setOperations(opsData);
          setEconomics(economicsData);
          setFieldObservations(obsData);
        }
        setLoading(false);
      };
      fetchData();
    }
  }, [activeCompany, id]);

  const dateFormatter = (dateString: string) => {
    try { return format(new Date(dateString), 'PP', { locale: locale === 'de' ? de : enUS }); }
    catch { return dateString; }
  };

  const currencyFormatter = new Intl.NumberFormat(locale, { style: 'currency', currency: 'EUR' });

  const handleSave = async (updatedField: Field) => {
    if (activeCompany) {
      await dataService.updateField(activeCompany.tenantId, activeCompany.id, updatedField);
      setField(updatedField);
      setIsEditing(false);
    }
  };

  if (sessionLoading || loading) return <FieldDetailSkeleton />;

  if (!field) {
    return (
      <Card>
        <CardHeader><CardTitle>{t('notFoundTitle')}</CardTitle></CardHeader>
        <CardContent>
          <p>{t('notFoundDescription')}</p>
          <Button asChild variant="link" className="pl-0 mt-4">
            <Link href={`/${locale}/fields`}><ArrowLeft className="mr-2 h-4 w-4" />{t('backToList')}</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Compute mock cost breakdown
  const laborCost = operations.reduce((s, op) => s + op.laborHours * 28, 0);
  const machineCost = operations.reduce((s, op) => s + (op.fuelConsumed || 0) * 1.45, 0);
  const materialCost = operations.reduce((s, op) => s + (op.materials?.reduce((ms, m) => ms + m.quantity * 5, 0) || 0), 0);
  const totalCost = laborCost + machineCost + materialCost;
  const costPerHa = field.area > 0 ? totalCost / field.area : 0;

  return (
    <div className="space-y-6">
      <div>
        <Button variant="ghost" asChild>
          <Link href={`/${locale}/fields`}><ArrowLeft className="mr-2 h-4 w-4" />{t('backToList')}</Link>
        </Button>
      </div>

      {isEditing ? (
        <EditFieldForm field={field} onSave={handleSave} onCancel={() => setIsEditing(false)} />
      ) : (
        <>
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight">{field.name}</h1>
                <Badge variant="default" className="bg-success text-success-foreground">Aktiv</Badge>
              </div>
              <p className="text-muted-foreground mt-1">{t('description', { crop: field.crop, area: field.area.toLocaleString(locale) })}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" asChild>
                <Link href={`/${locale}/auftraege/neu?field=${field.name}`}>
                  <Plus className="mr-2 h-4 w-4" />Neuer Auftrag
                </Link>
              </Button>
              <Button onClick={() => setIsEditing(true)}>
                <Pencil className="mr-2 h-4 w-4" />{t('editButton')}
              </Button>
            </div>
          </div>

          {/* Tab Navigation per Checklist 6.2 */}
          <Tabs defaultValue="uebersicht" className="w-full">
            <TabsList className="w-full justify-start overflow-x-auto flex-nowrap">
              <TabsTrigger value="uebersicht">Übersicht</TabsTrigger>
              <TabsTrigger value="auftraege">Aufträge</TabsTrigger>
              <TabsTrigger value="wachstum">Wachstum</TabsTrigger>
              <TabsTrigger value="kosten">Kosten</TabsTrigger>
              <TabsTrigger value="schaeden">Schäden</TabsTrigger>
              <TabsTrigger value="dokumente">Dokumente</TabsTrigger>
              <TabsTrigger value="karte">Karte</TabsTrigger>
            </TabsList>

            {/* TAB: Übersicht */}
            <TabsContent value="uebersicht" className="space-y-6 mt-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader><CardTitle>Kenndaten</CardTitle></CardHeader>
                  <CardContent className="grid gap-3">
                    <div className="flex justify-between"><span className="text-muted-foreground">Fläche amtlich</span><span className="font-medium font-tabular">{field.area.toLocaleString(locale)} ha</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Fläche bewirtschaftet</span><span className="font-medium font-tabular">{(field.area * 0.97).toFixed(1)} ha</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Ackerzahl</span><span className="font-medium">62</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Bodenart</span><span className="font-medium">Lehm (sL)</span></div>
                    <Separator />
                    <div className="flex justify-between"><span className="text-muted-foreground">Aktuelle Kultur</span><span className="font-medium">{field.crop}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Sorte</span><span className="font-medium">Informer</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Saatdatum</span><span className="font-medium">12.10.2025</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Ernteziel</span><span className="font-medium">85 dt/ha</span></div>
                  </CardContent>
                </Card>

                <div className="space-y-6">
                  <Card>
                    <CardHeader><CardTitle>Pacht & Eigentum</CardTitle></CardHeader>
                    <CardContent className="grid gap-3">
                      <div className="flex justify-between"><span className="text-muted-foreground">Verpächter</span><span className="font-medium">{mockPachtInfo.verpächter}</span></div>
                      <div className="flex justify-between"><span className="text-muted-foreground">Pachtpreis</span><span className="font-medium font-tabular">{mockPachtInfo.preisProHa} €/ha/Jahr</span></div>
                      <div className="flex justify-between"><span className="text-muted-foreground">Pachtende</span><span className="font-medium">{dateFormatter(mockPachtInfo.laufzeitBis)}</span></div>
                      <div className="flex justify-between"><span className="text-muted-foreground">FLIK-Nummer</span><span className="font-mono text-xs bg-muted px-2 py-1 rounded">{mockPachtInfo.flik}</span></div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader><CardTitle>Auflagen & Zuordnungen</CardTitle></CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <span className="text-sm text-muted-foreground">Aktive Auflagen</span>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {mockAuflagen.map(a => <Badge key={a} variant="outline" className="border-warning text-warning">{a}</Badge>)}
                        </div>
                      </div>
                      <div className="flex justify-between"><span className="text-muted-foreground">Jagdrevier</span><span className="font-medium">Revier Friedrichstal</span></div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              <Card>
                <CardHeader><CardTitle>Zugeordnete Flurstücke</CardTitle></CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Flurstücksnr.</TableHead>
                        <TableHead>Gemarkung</TableHead>
                        <TableHead className="text-right">Fläche (ha)</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockFlurstuecke.map(f => (
                        <TableRow key={f.nr}>
                          <TableCell className="font-mono">{f.nr}</TableCell>
                          <TableCell>{f.gemarkung}</TableCell>
                          <TableCell className="text-right font-tabular">{f.fläche.toFixed(1)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            {/* TAB: Aufträge */}
            <TabsContent value="auftraege" className="space-y-4 mt-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Arbeitsaufträge für {field.name}</h3>
                <Button asChild>
                  <Link href={`/${locale}/auftraege/neu?field=${field.name}`}>
                    <Plus className="mr-2 h-4 w-4" />Neuer Auftrag
                  </Link>
                </Button>
              </div>
              {operations.length > 0 ? (
                <Card>
                  <CardContent className="pt-6">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Datum</TableHead>
                          <TableHead>Maßnahme</TableHead>
                          <TableHead>Mitarbeiter</TableHead>
                          <TableHead>Dauer</TableHead>
                          <TableHead className="text-right">Kosten</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {operations.map(op => (
                          <TableRow key={op.id} className="cursor-pointer hover:bg-muted/50">
                            <TableCell>{dateFormatter(op.date)}</TableCell>
                            <TableCell className="font-medium">{tOperationTypes(op.type)}</TableCell>
                            <TableCell>{op.personnel?.map(p => p.name).join(', ') || '-'}</TableCell>
                            <TableCell className="font-tabular">{op.laborHours}h</TableCell>
                            <TableCell className="text-right font-tabular">{currencyFormatter.format(op.laborHours * 28)}</TableCell>
                            <TableCell>
                              <Badge variant={op.status === 'Completed' ? 'default' : 'secondary'} className={op.status === 'Completed' ? 'bg-success/10 text-success border-success/20' : ''}>
                                {tOperationStatuses(op.status)}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              ) : (
                <EmptyState icon={Tractor} title={t('noOperationsTitle')} description={t('noOperationsDescription')} />
              )}
            </TabsContent>

            {/* TAB: Wachstum */}
            <TabsContent value="wachstum" className="space-y-4 mt-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Wachstumsdokumentation</h3>
                <Button variant="outline"><Camera className="mr-2 h-4 w-4" />Bonitur erfassen</Button>
              </div>
              <GrowthChart observations={fieldObservations} />

              <Card>
                <CardHeader>
                  <CardTitle>Bodenanalysen</CardTitle>
                  <CardDescription>Letzte Laborergebnisse für diesen Schlag</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Datum</TableHead>
                        <TableHead>pH</TableHead>
                        <TableHead>N (mg/100g)</TableHead>
                        <TableHead>P (mg/100g)</TableHead>
                        <TableHead>K (mg/100g)</TableHead>
                        <TableHead>Mg (mg/100g)</TableHead>
                        <TableHead>Humus (%)</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockBodenanalysen.map(b => (
                        <TableRow key={b.datum}>
                          <TableCell>{dateFormatter(b.datum)}</TableCell>
                          <TableCell className="font-tabular">{b.ph}</TableCell>
                          <TableCell className="font-tabular">{b.n}</TableCell>
                          <TableCell className="font-tabular">{b.p}</TableCell>
                          <TableCell className="font-tabular">{b.k}</TableCell>
                          <TableCell className="font-tabular">{b.mg}</TableCell>
                          <TableCell className="font-tabular">{b.humus}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  {mockBodenanalysen.length > 0 && new Date().getFullYear() - new Date(mockBodenanalysen[0].datum).getFullYear() > 5 && (
                    <div className="mt-4 p-3 bg-warning/10 border border-warning/20 rounded-lg text-sm text-warning">
                      Letzte Bodenanalyse ist älter als 6 Jahre. Eine Neuuntersuchung wird empfohlen.
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* TAB: Kosten */}
            <TabsContent value="kosten" className="space-y-4 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                  <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Lohnkosten</CardTitle></CardHeader>
                  <CardContent><div className="text-2xl font-bold font-tabular">{currencyFormatter.format(laborCost)}</div><p className="text-xs text-muted-foreground">{(laborCost / Math.max(field.area, 1)).toFixed(0)} €/ha</p></CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Maschinenkosten</CardTitle></CardHeader>
                  <CardContent><div className="text-2xl font-bold font-tabular">{currencyFormatter.format(machineCost)}</div><p className="text-xs text-muted-foreground">{(machineCost / Math.max(field.area, 1)).toFixed(0)} €/ha</p></CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Materialkosten</CardTitle></CardHeader>
                  <CardContent><div className="text-2xl font-bold font-tabular">{currencyFormatter.format(materialCost)}</div><p className="text-xs text-muted-foreground">{(materialCost / Math.max(field.area, 1)).toFixed(0)} €/ha</p></CardContent>
                </Card>
                <Card className="border-primary/30 bg-primary/5">
                  <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Gesamtkosten</CardTitle></CardHeader>
                  <CardContent><div className="text-2xl font-bold font-tabular">{currencyFormatter.format(totalCost)}</div><p className="text-xs text-muted-foreground">{costPerHa.toFixed(0)} €/ha</p></CardContent>
                </Card>
              </div>

              {economics && (
                <Card>
                  <CardHeader>
                    <CardTitle>Deckungsbeitragsrechnung WJ 2025</CardTitle>
                    <CardDescription>Vollständige Ergebnisrechnung für {field.name}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableBody>
                        <TableRow><TableCell className="font-medium">Marktleistung (Erlöse)</TableCell><TableCell className="text-right font-tabular text-success">{currencyFormatter.format(economics.revenue)}</TableCell></TableRow>
                        <TableRow><TableCell className="font-medium pl-6">- Saatgut</TableCell><TableCell className="text-right font-tabular text-destructive">{currencyFormatter.format(materialCost * 0.3)}</TableCell></TableRow>
                        <TableRow><TableCell className="font-medium pl-6">- Dünger</TableCell><TableCell className="text-right font-tabular text-destructive">{currencyFormatter.format(materialCost * 0.4)}</TableCell></TableRow>
                        <TableRow><TableCell className="font-medium pl-6">- Pflanzenschutz</TableCell><TableCell className="text-right font-tabular text-destructive">{currencyFormatter.format(materialCost * 0.3)}</TableCell></TableRow>
                        <TableRow className="border-t-2"><TableCell className="font-bold">= Deckungsbeitrag I</TableCell><TableCell className="text-right font-tabular font-bold">{currencyFormatter.format(economics.revenue - materialCost)}</TableCell></TableRow>
                        <TableRow><TableCell className="font-medium pl-6">- Lohnkosten</TableCell><TableCell className="text-right font-tabular text-destructive">{currencyFormatter.format(laborCost)}</TableCell></TableRow>
                        <TableRow><TableCell className="font-medium pl-6">- Maschinenkosten</TableCell><TableCell className="text-right font-tabular text-destructive">{currencyFormatter.format(machineCost)}</TableCell></TableRow>
                        <TableRow><TableCell className="font-medium pl-6">- Pacht</TableCell><TableCell className="text-right font-tabular text-destructive">{currencyFormatter.format(mockPachtInfo.preisProHa * field.area)}</TableCell></TableRow>
                        <TableRow className="border-t-2 bg-muted/30">
                          <TableCell className="font-bold">= Deckungsbeitrag II</TableCell>
                          <TableCell className={cn("text-right font-tabular font-bold text-lg", economics.contributionMargin >= 0 ? 'text-success' : 'text-destructive')}>
                            {currencyFormatter.format(economics.contributionMargin)}
                          </TableCell>
                        </TableRow>
                        <TableRow><TableCell className="text-muted-foreground">DB II pro ha</TableCell><TableCell className="text-right font-tabular font-medium">{currencyFormatter.format(economics.contributionMargin / Math.max(field.area, 1))}/ha</TableCell></TableRow>
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* TAB: Schäden */}
            <TabsContent value="schaeden" className="space-y-4 mt-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Schadensmeldungen</h3>
                <Button asChild><Link href={`/${locale}/schaeden`}><Bug className="mr-2 h-4 w-4" />Schaden melden</Link></Button>
              </div>
              {mockSchaeden.length > 0 ? (
                <Card>
                  <CardContent className="pt-6">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Datum</TableHead>
                          <TableHead>Typ</TableHead>
                          <TableHead>Wildart/Ereignis</TableHead>
                          <TableHead>Fläche (ha)</TableHead>
                          <TableHead>Grad</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {mockSchaeden.map(s => (
                          <TableRow key={s.id}>
                            <TableCell>{dateFormatter(s.datum)}</TableCell>
                            <TableCell>{s.typ}</TableCell>
                            <TableCell>{s.wildart}</TableCell>
                            <TableCell className="font-tabular">{s.fläche}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1">
                                {[...Array(5)].map((_, i) => (
                                  <div key={i} className={cn("w-2 h-2 rounded-full", i < s.grad ? 'bg-destructive' : 'bg-muted')} />
                                ))}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className={cn(
                                s.status === 'Reguliert' && 'border-success text-success',
                                s.status === 'Gemeldet' && 'border-warning text-warning',
                                s.status === 'Erfasst' && 'border-info text-info',
                              )}>{s.status}</Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              ) : (
                <EmptyState icon={Bug} title="Keine Schäden gemeldet" description="Für diesen Schlag wurden noch keine Schadensmeldungen erfasst." />
              )}
            </TabsContent>

            {/* TAB: Dokumente */}
            <TabsContent value="dokumente" className="space-y-4 mt-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Dokumente & Berichte</h3>
                <Button variant="outline"><Upload className="mr-2 h-4 w-4" />Dokument hochladen</Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">PSM-Protokoll WJ 2025</CardTitle>
                    <CardDescription>Pflanzenschutzmittel-Anwendungen gemäß § 67 PflSchG</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="outline" className="w-full"><Download className="mr-2 h-4 w-4" />PDF exportieren</Button>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Düngedokumentation WJ 2025</CardTitle>
                    <CardDescription>N-Bilanz und Ausbringungsnachweise</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="outline" className="w-full"><Download className="mr-2 h-4 w-4" />PDF exportieren</Button>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader><CardTitle>Alle Dokumente</CardTitle></CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Dokument</TableHead>
                        <TableHead>Typ</TableHead>
                        <TableHead>Datum</TableHead>
                        <TableHead></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockDokumente.map(d => (
                        <TableRow key={d.name}>
                          <TableCell className="font-medium"><FileText className="inline mr-2 h-4 w-4 text-muted-foreground" />{d.name}</TableCell>
                          <TableCell><Badge variant="secondary">{d.typ}</Badge></TableCell>
                          <TableCell>{dateFormatter(d.datum)}</TableCell>
                          <TableCell><Button variant="ghost" size="sm"><Download className="h-4 w-4" /></Button></TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            {/* TAB: Karte */}
            <TabsContent value="karte" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Schlaggeometrie</CardTitle>
                  <CardDescription>Schlaggrenzen, Flurstücksgrenzen und Beobachtungspunkte</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-muted rounded-lg h-[400px] flex items-center justify-center border-2 border-dashed">
                    <div className="text-center">
                      <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground font-medium">Karten-Ansicht</p>
                      <p className="text-sm text-muted-foreground mt-1">Schlaggeometrie mit Flurstücksgrenzen und Beobachtungspunkten</p>
                      <Button variant="outline" className="mt-4" asChild>
                        <Link href={`/${locale}/map`}>Auf Karte anzeigen</Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
}
