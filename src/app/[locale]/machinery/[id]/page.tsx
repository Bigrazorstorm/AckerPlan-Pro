'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useSession } from '@/context/session-context';
import dataService from '@/services';
import { Machinery, MaintenanceEvent } from '@/services/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslations } from 'next-intl';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { PlusCircle, Wrench, ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';
import { de, enUS } from 'date-fns/locale';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';

function MachineDetailSkeleton() {
  return (
    <div className="space-y-4">
       <div>
            <Skeleton className="h-9 w-44" />
       </div>
        <div className="space-y-6">
            <div className="flex justify-between items-start">
                <div>
                <Skeleton className="h-9 w-64 mb-2" />
                <Skeleton className="h-4 w-96" />
                </div>
                <Skeleton className="h-9 w-44" />
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <Card>
                <CardHeader>
                    <Skeleton className="h-6 w-1/3" />
                </CardHeader>
                <CardContent className="grid gap-4">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="flex justify-between">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-5 w-32" />
                        </div>
                    ))}
                </CardContent>
                </Card>
                <Card className="md:col-span-2">
                <CardHeader>
                    <Skeleton className="h-6 w-1/2" />
                    <Skeleton className="h-4 w-3/4 mt-1" />
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        {[...Array(5)].map((_, i) => (
                            <Skeleton key={i} className="h-10 w-full" />
                        ))}
                    </div>
                </CardContent>
                </Card>
            </div>
        </div>
    </div>
  )
}

export default function MachineDetailPage() {
  const { id, locale } = useParams<{ id: string, locale: string }>();
  const { activeCompany, loading: sessionLoading } = useSession();
  const [machine, setMachine] = useState<Machinery | null>(null);
  const [maintenanceHistory, setMaintenanceHistory] = useState<MaintenanceEvent[]>([]);
  const [loading, setLoading] = useState(true);

  const t = useTranslations('MachineDetailPage');
  const tGen = useTranslations('General');
  const tMachineTypes = useTranslations('MachineryTypes');

  useEffect(() => {
    if (activeCompany) {
      const fetchData = async () => {
        setLoading(true);
        const [machineData, historyData] = await Promise.all([
          dataService.getMachineById(activeCompany.tenantId, activeCompany.id, id),
          dataService.getMaintenanceHistory(activeCompany.tenantId, activeCompany.id, id)
        ]);
        
        setMachine(machineData);
        if (machineData) {
            setMaintenanceHistory(historyData);
        }

        setLoading(false);
      };
      fetchData();
    }
  }, [activeCompany, id]);

  if (sessionLoading || loading) {
    return <MachineDetailSkeleton />;
  }

  if (!machine) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>{t('notFoundTitle')}</CardTitle>
            </CardHeader>
            <CardContent>
                <p>{t('notFoundDescription')}</p>
                <Button asChild variant="link" className="pl-0 mt-4">
                    <Link href="/machinery">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        {t('backToList')}
                    </Link>
                </Button>
            </CardContent>
        </Card>
    )
  }

  const currencyFormatter = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'EUR',
  });
  
  const dateFormatter = (dateString: string) => {
    try {
        return format(new Date(dateString), 'PPP', { locale: locale === 'de' ? de : enUS });
    } catch (e) {
        return dateString;
    }
  }

  return (
    <div className="space-y-4">
        <div>
            <Button variant="ghost" asChild>
                <Link href="/machinery">
                <ArrowLeft className="mr-2 h-4 w-4" />
                {t('backToList')}
                </Link>
            </Button>
        </div>
        <div className="space-y-6">
            <div className="flex justify-between items-start">
                <div>
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight">{machine.name}</h1>
                <p className="text-muted-foreground">{t('description', { model: machine.model, type: tMachineTypes(machine.type) })}</p>
                </div>
                <Button size="sm" className="gap-1">
                <PlusCircle className="h-4 w-4" />
                {t('logMaintenanceButton')}
                </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <Card>
                <CardHeader>
                    <CardTitle>{t('detailsTitle')}</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4">
                    <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">{t('statusLabel')}</span>
                    <Badge variant={
                            machine.status === 'Operational' ? 'default' 
                            : machine.status === 'Maintenance Due' ? 'destructive' 
                            : 'secondary'
                        } 
                        className={
                            machine.status === 'Operational' ? 'bg-green-100 text-green-800' 
                            : machine.status === 'Maintenance Due' ? 'bg-yellow-100 text-yellow-800'
                            : machine.status === 'In Workshop' ? 'bg-red-100 text-red-800'
                            : ''
                        }>
                            {machine.status}
                        </Badge>
                    </div>
                    <div className="flex justify-between">
                    <span className="text-muted-foreground">{t('nextServiceLabel')}</span>
                    <span className="font-medium">{machine.nextService}</span>
                    </div>
                    <div className="flex justify-between">
                    <span className="text-muted-foreground">{t('lastMaintenanceLabel')}</span>
                    <span className="font-medium">{dateFormatter(machine.lastMaintenance)}</span>
                    </div>
                    <div className="flex justify-between">
                    <span className="text-muted-foreground">{t('createdAtLabel')}</span>
                    <span className="font-medium">{dateFormatter(machine.createdAt)}</span>
                    </div>
                </CardContent>
                </Card>

                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle>{t('maintenanceHistoryTitle')}</CardTitle>
                        <CardDescription>{t('maintenanceHistoryDescription')}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {maintenanceHistory.length > 0 ? (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>{t('dateHeader')}</TableHead>
                                    <TableHead>{t('descriptionHeader')}</TableHead>
                                    <TableHead className="text-right">{t('costHeader')}</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {maintenanceHistory.map((event) => (
                                    <TableRow key={event.id}>
                                        <TableCell>{dateFormatter(event.date)}</TableCell>
                                        <TableCell className="font-medium">{event.description}</TableCell>
                                        <TableCell className="text-right">{currencyFormatter.format(event.cost)}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        ) : (
                            <div className="flex flex-col items-center justify-center text-center gap-4 py-16 border-2 border-dashed rounded-lg">
                                <Wrench className="w-12 h-12 text-muted-foreground" />
                                <h3 className="text-lg font-semibold">{t('noMaintenanceTitle')}</h3>
                                <p className="text-muted-foreground max-w-sm">
                                    {t('noMaintenanceDescription')}
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    </div>
  );
}
