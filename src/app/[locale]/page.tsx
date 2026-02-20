'use client';

import { useEffect, useState } from 'react';
import { useSession } from '@/context/session-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import dataService from "@/services";
import { DashboardChart } from "@/components/dashboard-chart";
import { useLocale, useTranslations } from "next-intl";
import { AreaChart, Bell, Eye, Tractor } from "lucide-react";
import { Kpi, Operation, ChartDataPoint } from '@/services/types';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { de, enUS } from 'date-fns/locale';

function DashboardSkeleton() {
    return (
        <div className="space-y-8">
            <div>
                <Skeleton className="h-8 w-1/3" />
                <Skeleton className="h-4 w-2/3 mt-2" />
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {[...Array(4)].map((_, i) => (
                    <Card key={i}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <Skeleton className="h-4 w-2/3" />
                            <Skeleton className="h-4 w-4" />
                        </CardHeader>
                        <CardContent>
                            <Skeleton className="h-7 w-1/2" />
                            <Skeleton className="h-3 w-1/3 mt-1" />
                        </CardContent>
                    </Card>
                ))}
            </div>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-7">
                <Card className="lg:col-span-4">
                    <CardHeader>
                        <Skeleton className="h-6 w-1/4" />
                         <Skeleton className="h-4 w-1/2 mt-1" />
                    </CardHeader>
                    <CardContent className="pl-2">
                        <Skeleton className="h-[300px] w-full" />
                    </CardContent>
                </Card>
                <Card className="lg:col-span-3">
                    <CardHeader>
                        <Skeleton className="h-6 w-1/4" />
                        <Skeleton className="h-4 w-1/2 mt-1" />
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {[...Array(5)].map((_, i) => (
                                <div key={i} className="flex justify-between items-center py-2">
                                    <div className="space-y-2">
                                        <Skeleton className="h-4 w-24" />
                                        <Skeleton className="h-3 w-16" />
                                    </div>
                                    <Skeleton className="h-4 w-20" />
                                    <Skeleton className="h-5 w-24" />
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

export default function Home() {
  const t = useTranslations('Dashboard');
  const tKpi = useTranslations('Kpis');
  const tOperationTypes = useTranslations('OperationTypes');
  const tOperationStatuses = useTranslations('OperationStatuses');
  const { activeCompany, loading: sessionLoading } = useSession();
  const locale = useLocale();

  const [kpis, setKpis] = useState<Kpi[]>([]);
  const [recentOperations, setRecentOperations] = useState<Operation[]>([]);
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (activeCompany) {
      const fetchData = async () => {
        setLoading(true);
        const [kpiData, activityData, chartDataResult] = await Promise.all([
          dataService.getKpis(activeCompany.tenantId, activeCompany.id),
          dataService.getOperations(activeCompany.tenantId, activeCompany.id),
          dataService.getChartData(activeCompany.tenantId, activeCompany.id)
        ]);
        setKpis(kpiData);
        setRecentOperations(activityData);
        setChartData(chartDataResult);
        setLoading(false);
      };
      fetchData();
    }
  }, [activeCompany]);

  const kpiIcons: Record<string, React.ElementType> = {
    TotalRevenue: AreaChart,
    TotalCosts: Tractor,
    OpenObservations: Eye,
    MaintenanceDue: Bell,
  };
  
  const dateFormatter = (dateString: string) => {
    try {
        return format(new Date(dateString), 'PP', { locale: locale === 'de' ? de : enUS });
    } catch (e) {
        return dateString;
    }
  }


  if (sessionLoading || (loading && !kpis.length)) {
    return <DashboardSkeleton />
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">{t('welcome')}</h1>
        <p className="text-muted-foreground">{t('description')}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi) => {
          const Icon = kpiIcons[kpi.labelKey];
          return (
            <Card key={kpi.labelKey}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{tKpi(kpi.labelKey)}</CardTitle>
                {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{kpi.value}</div>
                {kpi.change && (
                  <p className="text-xs text-muted-foreground">
                    <span className={kpi.changeType === 'increase' ? 'text-green-600' : 'text-red-600'}>
                      {kpi.change}
                    </span>
                    {' '}{t('fromLastMonth')}
                  </p>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>{t('performanceTitle')}</CardTitle>
            <CardDescription>
              {t('performanceDescription')}
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <DashboardChart chartData={chartData} />
          </CardContent>
        </Card>
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>{t('recentOperationsTitle')}</CardTitle>
            <CardDescription>
              {t('recentOperationsDescription')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('activity')}</TableHead>
                  <TableHead>{t('field')}</TableHead>
                  <TableHead>{t('status')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentOperations.map((activity) => (
                  <TableRow key={activity.id}>
                    <TableCell>
                      <div className="font-medium">{tOperationTypes(activity.type)}</div>
                      <div className="text-sm text-muted-foreground">{dateFormatter(activity.date)}</div>
                    </TableCell>
                    <TableCell>{activity.field}</TableCell>
                    <TableCell>
                      <Badge variant={activity.status === 'Completed' ? 'default' : 'secondary'} className={activity.status === 'Completed' ? 'bg-green-100 text-green-800' : ''}>{tOperationStatuses(activity.status)}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
