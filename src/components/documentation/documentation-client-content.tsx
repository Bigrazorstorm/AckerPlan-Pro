'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useSession } from '@/context/session-context';
import dataService from '@/services';
import { Operation, WarehouseItem, Field, User } from '@/services/types';
import { useTranslations } from 'next-intl';
import { format, parseISO } from 'date-fns';
import { de, enUS } from 'date-fns/locale';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, Wheat, ShieldAlert, Download, BookOpen, Scale } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';


interface PsmApplication {
    operationId: string;
    date: string;
    fieldName: string;
    crop: string;
    personnel: string;
    pesticideName: string;
    quantity: number;
    unit: string;
    registrationNumber?: string;
    waitingPeriod?: number;
}

interface FertilizationApplication {
    operationId: string;
    date: string;
    fieldName: string;
    crop: string;
    fertilizerName: string;
    quantity: number;
    unit: string;
    nutrientsPerHa: {
        n: number;
        p: number;
        k: number;
    };
}

interface ComplianceIssue {
    operationId: string;
    date: string;
    fieldName: string;
    crop: string;
    psmUsed: string;
    unqualifiedPersonnel: string;
}

const isUserQualifiedForPsm = (user: User) => {
    if (!user.pesticideLicenseExpiry) return false;
    try {
        const expiryDate = parseISO(user.pesticideLicenseExpiry);
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Compare dates only
        return expiryDate >= today;
    } catch (e) {
        return false;
    }
};


function ReportSkeleton() {
    return (
        <Card>
            <CardHeader>
                <Skeleton className="h-6 w-1/3 mb-2" />
                <Skeleton className="h-4 w-2/3" />
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            {[...Array(7)].map((_, i) => (
                                <TableHead key={i}><Skeleton className="h-4 w-24" /></TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {[...Array(5)].map((_, i) => (
                            <TableRow key={i}>
                                {[...Array(7)].map((_, j) => (
                                     <TableCell key={j}><Skeleton className="h-5 w-full" /></TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}

export function DocumentationClientContent() {
    const { activeCompany, loading: sessionLoading } = useSession();
    const [psmApplications, setPsmApplications] = useState<PsmApplication[]>([]);
    const [fertilizationApplications, setFertilizationApplications] = useState<FertilizationApplication[]>([]);
    const [complianceIssues, setComplianceIssues] = useState<ComplianceIssue[]>([]);
    const [loading, setLoading] = useState(true);

    const t = useTranslations('DokumentationPage');
    const { locale } = useParams<{ locale: string }>();

    useEffect(() => {
        if (activeCompany) {
            const fetchData = async () => {
                setLoading(true);
                const [ops, items, allFields, allUsers] = await Promise.all([
                    dataService.getOperations(activeCompany.tenantId, activeCompany.id),
                    dataService.getWarehouseItems(activeCompany.tenantId, activeCompany.id),
                    dataService.getFields(activeCompany.tenantId, activeCompany.id),
                    dataService.getUsersForCompany(activeCompany.tenantId, activeCompany.id),
                ]);

                // PSM Applications
                const psmApps: PsmApplication[] = [];
                const psmOps = ops.filter(op => op.type === 'PestControl');

                for (const op of psmOps) {
                    if (op.materials) {
                        for (const material of op.materials) {
                            const item = items.find(i => i.id === material.itemId);
                            if (item?.itemType === 'Pesticide') {
                                const field = allFields.find(f => f.name === op.field);
                                psmApps.push({
                                    operationId: `${op.id}-${item.id}`,
                                    date: op.date,
                                    fieldName: op.field,
                                    crop: field?.crop || '-',
                                    personnel: op.personnel?.map(p => p.name).join(', ') || '-',
                                    pesticideName: item.name,
                                    quantity: material.quantity,
                                    unit: material.unit,
                                    registrationNumber: item.registrationNumber,
                                    waitingPeriod: item.waitingPeriodDays,
                                });
                            }
                        }
                    }
                }
                setPsmApplications(psmApps.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
                
                // Fertilization Applications
                const fertApps: FertilizationApplication[] = [];
                const fertOps = ops.filter(op => op.type === 'Fertilizing');

                for (const op of fertOps) {
                    if (op.materials) {
                        for (const material of op.materials) {
                            const item = items.find(i => i.id === material.itemId);
                            const field = allFields.find(f => f.name === op.field);

                            if (item?.itemType === 'Fertilizer' && field) {
                                const totalN = item.n ? (material.quantity * (item.n / 100)) : 0;
                                const totalP = item.p ? (material.quantity * (item.p / 100)) : 0;
                                const totalK = item.k ? (material.quantity * (item.k / 100)) : 0;

                                fertApps.push({
                                    operationId: `${op.id}-${item.id}`,
                                    date: op.date,
                                    fieldName: op.field,
                                    crop: field?.crop || '-',
                                    fertilizerName: item.name,
                                    quantity: material.quantity,
                                    unit: material.unit,
                                    nutrientsPerHa: {
                                        n: totalN / field.area,
                                        p: totalP / field.area,
                                        k: totalK / field.area,
                                    }
                                });
                            }
                        }
                    }
                }
                setFertilizationApplications(fertApps.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
                
                // Compliance Issues
                const issues: ComplianceIssue[] = [];
                for (const op of psmOps) {
                    if (op.personnel && op.personnel.length > 0) {
                        const unqualified = op.personnel.filter(p => {
                            const user = allUsers.find(u => u.id === p.id);
                            return user ? !isUserQualifiedForPsm(user) : true;
                        });

                        if (unqualified.length > 0) {
                            const field = allFields.find(f => f.name === op.field);
                            issues.push({
                                operationId: op.id,
                                date: op.date,
                                fieldName: op.field,
                                crop: field?.crop || '-',
                                psmUsed: op.materials?.map(m => m.itemName).join(', ') || t('unknownProduct'),
                                unqualifiedPersonnel: unqualified.map(p => p.name).join(', '),
                            });
                        }
                    }
                }
                setComplianceIssues(issues.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));


                setLoading(false);
            };
            fetchData();
        }
    }, [activeCompany, t]);

    const dateFormatter = (dateString: string) => {
        try {
            return format(parseISO(dateString), 'PP', { locale: locale === 'de' ? de : enUS });
        } catch (e) {
            return dateString;
        }
    };
    
    if (sessionLoading || loading) {
        return (
            <Tabs defaultValue="psm">
                <TabsList>
                    <TabsTrigger value="psm">{t('psmTab')}</TabsTrigger>
                    <TabsTrigger value="fertilization">{t('fertilizationTab')}</TabsTrigger>
                    <TabsTrigger value="compliance">{t('complianceTab')}</TabsTrigger>
                </TabsList>
                <TabsContent value="psm" className="mt-4">
                    <ReportSkeleton />
                </TabsContent>
                 <TabsContent value="fertilization" className="mt-4">
                    <ReportSkeleton />
                </TabsContent>
                <TabsContent value="compliance" className="mt-4">
                    <ReportSkeleton />
                </TabsContent>
            </Tabs>
        );
    }

    return (
        <Tabs defaultValue="psm">
            <TabsList className="flex-wrap">
                <TabsTrigger value="psm">{t('psmTab')}</TabsTrigger>
                <TabsTrigger value="fertilization">{t('fertilizationTab')}</TabsTrigger>
                <TabsTrigger value="nbilanz">N-Bilanz</TabsTrigger>
                <TabsTrigger value="betriebsheft">Betriebsheft</TabsTrigger>
                <TabsTrigger value="compliance">{t('complianceTab')}</TabsTrigger>
            </TabsList>
            <TabsContent value="psm" className="mt-4">
                <Card>
                    <CardHeader>
                        <CardTitle>{t('psmReportTitle')}</CardTitle>
                        <CardDescription>{t('psmReportDescription')}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {psmApplications.length > 0 ? (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>{t('tableHeaderDate')}</TableHead>
                                        <TableHead>{t('tableHeaderField')}</TableHead>
                                        <TableHead>{t('tableHeaderCrop')}</TableHead>
                                        <TableHead>{t('tableHeaderPsm')}</TableHead>
                                        <TableHead>{t('tableHeaderQuantity')}</TableHead>
                                        <TableHead>{t('tableHeaderRegNr')}</TableHead>
                                        <TableHead>{t('tableHeaderWaitingPeriod')}</TableHead>
                                        <TableHead>{t('tableHeaderPersonnel')}</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {psmApplications.map((app) => (
                                        <TableRow key={app.operationId}>
                                            <TableCell>{dateFormatter(app.date)}</TableCell>
                                            <TableCell>{app.fieldName}</TableCell>
                                            <TableCell>{app.crop}</TableCell>
                                            <TableCell className="font-medium">{app.pesticideName}</TableCell>
                                            <TableCell>{app.quantity.toLocaleString(locale)} {app.unit}</TableCell>
                                            <TableCell className="font-mono text-xs">{app.registrationNumber || '-'}</TableCell>
                                            <TableCell>{app.waitingPeriod ? `${app.waitingPeriod} Tage` : '-'}</TableCell>
                                            <TableCell>{app.personnel}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        ) : (
                            <div className="flex flex-col items-center justify-center text-center gap-4 py-24 border-2 border-dashed rounded-lg">
                                <FileText className="w-16 h-16 text-muted-foreground" />
                                <h3 className="text-lg font-semibold">{t('noPsmApplications')}</h3>
                                <p className="text-muted-foreground max-w-md">
                                    {t('noPsmApplicationsDescription')}
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </TabsContent>
            <TabsContent value="fertilization" className="mt-4">
                <Card>
                    <CardHeader>
                        <CardTitle>{t('fertilizationReportTitle')}</CardTitle>
                        <CardDescription>{t('fertilizationReportDescription')}</CardDescription>
                    </CardHeader>
                    <CardContent>
                         {fertilizationApplications.length > 0 ? (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>{t('tableHeaderDate')}</TableHead>
                                        <TableHead>{t('tableHeaderField')}</TableHead>
                                        <TableHead>{t('tableHeaderCrop')}</TableHead>
                                        <TableHead>{t('tableHeaderFertilizer')}</TableHead>
                                        <TableHead>{t('tableHeaderQuantity')}</TableHead>
                                        <TableHead className="text-right">{t('tableHeaderNutrientsPerHa', {nutrient: 'N'})}</TableHead>
                                        <TableHead className="text-right">{t('tableHeaderNutrientsPerHa', {nutrient: 'P'})}</TableHead>
                                        <TableHead className="text-right">{t('tableHeaderNutrientsPerHa', {nutrient: 'K'})}</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {fertilizationApplications.map((app) => (
                                        <TableRow key={app.operationId}>
                                            <TableCell>{dateFormatter(app.date)}</TableCell>
                                            <TableCell>{app.fieldName}</TableCell>
                                            <TableCell>{app.crop}</TableCell>
                                            <TableCell className="font-medium">{app.fertilizerName}</TableCell>
                                            <TableCell>{app.quantity.toLocaleString(locale)} {app.unit}</TableCell>
                                            <TableCell className="text-right font-mono text-xs">{app.nutrientsPerHa.n.toFixed(1)}</TableCell>
                                            <TableCell className="text-right font-mono text-xs">{app.nutrientsPerHa.p.toFixed(1)}</TableCell>
                                            <TableCell className="text-right font-mono text-xs">{app.nutrientsPerHa.k.toFixed(1)}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                         ) : (
                            <div className="flex flex-col items-center justify-center text-center gap-4 py-24 border-2 border-dashed rounded-lg">
                                <Wheat className="w-16 h-16 text-muted-foreground" />
                                <h3 className="text-lg font-semibold">{t('noFertilizationApplications')}</h3>
                                <p className="text-muted-foreground max-w-md">
                                    {t('noFertilizationApplicationsDescription')}
                                </p>
                            </div>
                         )}
                    </CardContent>
                </Card>
            </TabsContent>
            <TabsContent value="nbilanz" className="mt-4">
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle><Scale className="inline mr-2 h-5 w-5" />Stickstoffbilanz (N-Bilanz)</CardTitle>
                                <CardDescription>Nährstoffvergleich gemäß Düngeverordnung (DüV) § 8</CardDescription>
                            </div>
                            <Button variant="outline"><Download className="mr-2 h-4 w-4" />PDF Export</Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Schlag</TableHead>
                                    <TableHead>Kultur</TableHead>
                                    <TableHead className="text-right">Fläche (ha)</TableHead>
                                    <TableHead className="text-right">N-Zufuhr (kg/ha)</TableHead>
                                    <TableHead className="text-right">N-Abfuhr (kg/ha)</TableHead>
                                    <TableHead className="text-right">N-Saldo (kg/ha)</TableHead>
                                    <TableHead>Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {[
                                    { schlag: 'Am Waldrand', kultur: 'Winterweizen', ha: 24.5, zufuhr: 180, abfuhr: 195, saldo: -15 },
                                    { schlag: 'Kirchberg', kultur: 'Wintergerste', ha: 18.2, zufuhr: 150, abfuhr: 140, saldo: 10 },
                                    { schlag: 'Große Breite', kultur: 'Winterraps', ha: 32.1, zufuhr: 200, abfuhr: 170, saldo: 30 },
                                    { schlag: 'Talwiese', kultur: 'Silomais', ha: 15.8, zufuhr: 170, abfuhr: 180, saldo: -10 },
                                    { schlag: 'Hangstück', kultur: 'Sommergerste', ha: 12.3, zufuhr: 120, abfuhr: 110, saldo: 10 },
                                ].map(r => (
                                    <TableRow key={r.schlag}>
                                        <TableCell className="font-medium">{r.schlag}</TableCell>
                                        <TableCell>{r.kultur}</TableCell>
                                        <TableCell className="text-right font-tabular">{r.ha.toFixed(1)}</TableCell>
                                        <TableCell className="text-right font-tabular">{r.zufuhr}</TableCell>
                                        <TableCell className="text-right font-tabular">{r.abfuhr}</TableCell>
                                        <TableCell className={`text-right font-tabular font-bold ${r.saldo > 50 ? 'text-destructive' : r.saldo < 0 ? 'text-green-600' : ''}`}>{r.saldo > 0 ? '+' : ''}{r.saldo}</TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className={r.saldo <= 50 ? 'border-green-500 text-green-600' : 'border-red-500 text-red-600'}>
                                                {r.saldo <= 50 ? 'Konform' : 'Überschreitung'}
                                            </Badge>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                <TableRow className="bg-muted/50 font-bold">
                                    <TableCell>Betriebsdurchschnitt</TableCell>
                                    <TableCell>-</TableCell>
                                    <TableCell className="text-right font-tabular">102.9</TableCell>
                                    <TableCell className="text-right font-tabular">168</TableCell>
                                    <TableCell className="text-right font-tabular">163</TableCell>
                                    <TableCell className="text-right font-tabular">+5</TableCell>
                                    <TableCell><Badge variant="outline" className="border-green-500 text-green-600">Konform</Badge></TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                        <div className="mt-4 p-3 bg-info/10 border border-info/20 rounded-lg text-sm">
                            <p className="font-medium text-info">Hinweis zur DüV:</p>
                            <p className="text-muted-foreground mt-1">Der N-Saldo darf im Dreijahresmittel maximal 50 kg N/ha betragen. Ihr aktueller Betriebsdurchschnitt beträgt +5 kg N/ha und liegt damit im konformen Bereich.</p>
                        </div>
                    </CardContent>
                </Card>
            </TabsContent>

            <TabsContent value="betriebsheft" className="mt-4">
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle><BookOpen className="inline mr-2 h-5 w-5" />Digitales Betriebsheft</CardTitle>
                                <CardDescription>Chronologische Aufzeichnung aller Betriebsmaßnahmen gemäß CC-Verpflichtung</CardDescription>
                            </div>
                            <Button variant="outline"><Download className="mr-2 h-4 w-4" />Betriebsheft exportieren</Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Datum</TableHead>
                                    <TableHead>Schlag</TableHead>
                                    <TableHead>Maßnahme</TableHead>
                                    <TableHead>Mittel/Material</TableHead>
                                    <TableHead>Aufwandmenge</TableHead>
                                    <TableHead>Maschine</TableHead>
                                    <TableHead>Durchführer</TableHead>
                                    <TableHead>Bemerkungen</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {[
                                    { datum: '2025-10-12', schlag: 'Am Waldrand', maßnahme: 'Aussaat', mittel: 'WW Informer', menge: '180 kg/ha', maschine: 'Fendt 942 + Amazone', person: 'Gerd W.', bemerkung: 'Guter Saathorizont' },
                                    { datum: '2025-10-15', schlag: 'Kirchberg', maßnahme: 'Aussaat', mittel: 'WG KWS Flemming', menge: '170 kg/ha', maschine: 'Fendt 942 + Amazone', person: 'Gerd W.', bemerkung: '-' },
                                    { datum: '2025-11-02', schlag: 'Am Waldrand', maßnahme: 'Herbizid', mittel: 'Atlantis Flex', menge: '330 g/ha', maschine: 'JD 6130R + Amazone', person: 'Hans M.', bemerkung: 'Sachkunde: TH-2024-456' },
                                    { datum: '2026-03-05', schlag: 'Am Waldrand', maßnahme: 'N-Düngung 1', mittel: 'KAS 27%', menge: '250 kg/ha', maschine: 'Fendt 516 + Rauch Axis', person: 'Gerd W.', bemerkung: '67.5 kg N/ha' },
                                    { datum: '2026-03-08', schlag: 'Kirchberg', maßnahme: 'N-Düngung 1', mittel: 'KAS 27%', menge: '220 kg/ha', maschine: 'Fendt 516 + Rauch Axis', person: 'Gerd W.', bemerkung: '59.4 kg N/ha' },
                                    { datum: '2026-04-10', schlag: 'Am Waldrand', maßnahme: 'Fungizid', mittel: 'Osiris', menge: '2.5 l/ha', maschine: 'JD 6130R + Amazone', person: 'Hans M.', bemerkung: 'BBCH 31, Septoria Befall' },
                                ].map((r, i) => (
                                    <TableRow key={i}>
                                        <TableCell className="whitespace-nowrap">{dateFormatter(r.datum)}</TableCell>
                                        <TableCell>{r.schlag}</TableCell>
                                        <TableCell><Badge variant="secondary">{r.maßnahme}</Badge></TableCell>
                                        <TableCell className="font-medium">{r.mittel}</TableCell>
                                        <TableCell className="font-tabular">{r.menge}</TableCell>
                                        <TableCell className="text-xs">{r.maschine}</TableCell>
                                        <TableCell>{r.person}</TableCell>
                                        <TableCell className="text-xs text-muted-foreground max-w-[200px] truncate">{r.bemerkung}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </TabsContent>

            <TabsContent value="compliance" className="mt-4">
                <Card>
                    <CardHeader>
                        <CardTitle>{t('complianceReportTitle')}</CardTitle>
                        <CardDescription>{t('complianceReportDescription')}</CardDescription>
                    </CardHeader>
                    <CardContent>
                         {complianceIssues.length > 0 ? (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>{t('tableHeaderDate')}</TableHead>
                                        <TableHead>{t('tableHeaderField')}</TableHead>
                                        <TableHead>{t('tableHeaderCrop')}</TableHead>
                                        <TableHead>{t('tableHeaderPsmUsed')}</TableHead>
                                        <TableHead>{t('tableHeaderUnqualifiedPersonnel')}</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {complianceIssues.map((issue) => (
                                        <TableRow key={issue.operationId} className="bg-destructive/10">
                                            <TableCell>{dateFormatter(issue.date)}</TableCell>
                                            <TableCell>{issue.fieldName}</TableCell>
                                            <TableCell>{issue.crop}</TableCell>
                                            <TableCell className="font-medium">{issue.psmUsed}</TableCell>
                                            <TableCell className="text-destructive font-semibold">{issue.unqualifiedPersonnel}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                         ) : (
                            <div className="flex flex-col items-center justify-center text-center gap-4 py-24 border-2 border-dashed rounded-lg">
                                <ShieldAlert className="w-16 h-16 text-muted-foreground" />
                                <h3 className="text-lg font-semibold">{t('noComplianceIssues')}</h3>
                                <p className="text-muted-foreground max-w-md">
                                    {t('noComplianceIssuesDescription')}
                                </p>
                            </div>
                         )}
                    </CardContent>
                </Card>
            </TabsContent>
        </Tabs>
    );
}
