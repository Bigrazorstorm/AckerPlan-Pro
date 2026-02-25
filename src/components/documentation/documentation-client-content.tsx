'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useSession } from '@/context/session-context';
import dataService from '@/services';
import { Operation, WarehouseItem, Field } from '@/services/types';
import { useTranslations } from 'next-intl';
import { format, parseISO } from 'date-fns';
import { de, enUS } from 'date-fns/locale';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, Wheat } from 'lucide-react';


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
    const [loading, setLoading] = useState(true);

    const t = useTranslations('DokumentationPage');
    const { locale } = useParams<{ locale: string }>();

    useEffect(() => {
        if (activeCompany) {
            const fetchData = async () => {
                setLoading(true);
                const [ops, items, allFields] = await Promise.all([
                    dataService.getOperations(activeCompany.tenantId, activeCompany.id),
                    dataService.getWarehouseItems(activeCompany.tenantId, activeCompany.id),
                    dataService.getFields(activeCompany.tenantId, activeCompany.id),
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

                setLoading(false);
            };
            fetchData();
        }
    }, [activeCompany]);

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
                </TabsList>
                <TabsContent value="psm" className="mt-4">
                    <ReportSkeleton />
                </TabsContent>
                 <TabsContent value="fertilization" className="mt-4">
                    <ReportSkeleton />
                </TabsContent>
            </Tabs>
        );
    }

    return (
        <Tabs defaultValue="psm">
            <TabsList>
                <TabsTrigger value="psm">{t('psmTab')}</TabsTrigger>
                <TabsTrigger value="fertilization">{t('fertilizationTab')}</TabsTrigger>
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
        </Tabs>
    );
}
