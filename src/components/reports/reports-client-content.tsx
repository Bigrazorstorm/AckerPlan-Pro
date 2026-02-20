'use client';

import { useState, useEffect } from 'react';
import { useSession } from '@/context/session-context';
import dataService from '@/services';
import { LaborHoursByCropReportData } from '@/services/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useTranslations } from 'next-intl';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

function ReportSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-1/3 mb-2" />
        <Skeleton className="h-4 w-2/3" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-[350px] w-full" />
      </CardContent>
    </Card>
  );
}

export function ReportsClientContent() {
  const { activeCompany, loading: sessionLoading } = useSession();
  const [reportData, setReportData] = useState<LaborHoursByCropReportData[]>([]);
  const [loading, setLoading] = useState(true);
  const t = useTranslations('ReportsPage');

  useEffect(() => {
    if (activeCompany) {
      const fetchReportData = async () => {
        setLoading(true);
        const data = await dataService.getLaborHoursByCropReport(activeCompany.tenantId, activeCompany.id);
        setReportData(data);
        setLoading(false);
      };
      fetchReportData();
    }
  }, [activeCompany]);
  
  const chartConfig = {
    hours: {
      label: t('laborHoursChartLabel'),
      color: "hsl(var(--primary))",
    },
  } satisfies ChartConfig;


  if (sessionLoading || loading) {
    return (
        <div className="grid gap-6">
            <ReportSkeleton />
        </div>
    );
  }

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>{t('laborHoursByCropTitle')}</CardTitle>
          <CardDescription>{t('laborHoursByCropDescription')}</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="min-h-[350px] w-full">
            <BarChart accessibilityLayer data={reportData} margin={{ top: 20, right: 20, bottom: 5, left: 0 }}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="crop"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
              />
              <YAxis
                tickFormatter={(value) => `${value} h`}
              />
              <ChartTooltip 
                cursor={false} 
                content={<ChartTooltipContent indicator="dot" />} 
              />
              <Bar dataKey="hours" fill="var(--color-hours)" radius={4} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
      
      {/* Placeholder for other reports */}
      <Card>
        <CardHeader>
            <CardTitle>{t('moreReportsComingSoonTitle')}</CardTitle>
        </CardHeader>
        <CardContent>
            <p className="text-muted-foreground">{t('moreReportsComingSoonDescription')}</p>
        </CardContent>
      </Card>
    </div>
  );
}
