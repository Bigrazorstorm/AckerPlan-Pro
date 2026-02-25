'use client';

import { useState, useEffect } from 'react';
import { useSession } from '@/context/session-context';
import dataService from '@/services';
import { LaborHoursByCropReportData, ProfitabilityByCropReportData } from '@/services/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useTranslations } from 'next-intl';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useParams } from 'next/navigation';
import { Button } from '../ui/button';
import { Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { exportProfitabilityReport } from '@/app/reports/actions';


function ReportChartSkeleton() {
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

function ReportTableSkeleton() {
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
              {[...Array(5)].map((_, i) => <TableHead key={i}><Skeleton className="h-4 w-24" /></TableHead>)}
            </TableRow>
          </TableHeader>
          <TableBody>
            {[...Array(3)].map((_, i) => (
              <TableRow key={i}>
                {[...Array(5)].map((_, j) => <TableCell key={j}><Skeleton className="h-5 w-full" /></TableCell>)}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

export function ReportsClientContent() {
  const { activeCompany, loading: sessionLoading } = useSession();
  const [laborReportData, setLaborReportData] = useState<LaborHoursByCropReportData[]>([]);
  const [profitabilityReportData, setProfitabilityReportData] = useState<ProfitabilityByCropReportData[]>([]);
  const [loading, setLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const t = useTranslations('ReportsPage');
  const { locale } = useParams<{ locale: string }>();
  const { toast } = useToast();

  useEffect(() => {
    if (activeCompany) {
      const fetchReportData = async () => {
        setLoading(true);
        const [laborData, profitabilityData] = await Promise.all([
          dataService.getLaborHoursByCropReport(activeCompany.tenantId, activeCompany.id),
          dataService.getProfitabilityByCropReport(activeCompany.tenantId, activeCompany.id),
        ]);
        setLaborReportData(laborData);
        setProfitabilityReportData(profitabilityData);
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

  const currencyFormatter = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'EUR',
  });

  const handleProfitabilityExport = async () => {
    if (!activeCompany) return;
    setIsExporting(true);

    const headers = {
        crop: t('tableHeaderCrop'),
        revenue: t('tableHeaderRevenue'),
        laborCost: t('tableHeaderLaborCosts'),
        fuelCost: t('tableHeaderFuelCosts'),
        materialCost: t('tableHeaderMaterialCosts'),
        contributionMargin: t('tableHeaderContributionMargin'),
    };

    const result = await exportProfitabilityReport(activeCompany.tenantId, activeCompany.id, headers);

    if (result.error) {
        toast({
            variant: 'destructive',
            title: t('exportErrorTitle'),
            description: result.error,
        });
    } else if (result.csv) {
        const blob = new Blob([result.csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `profitability_report_${activeCompany.id}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }
    setIsExporting(false);
  };


  if (sessionLoading || loading) {
    return (
        <div className="grid gap-6">
            <ReportTableSkeleton />
            <ReportChartSkeleton />
        </div>
    );
  }

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
           <div className="flex justify-between items-start">
            <div>
              <CardTitle>{t('profitabilityByCropTitle')}</CardTitle>
              <CardDescription>{t('profitabilityByCropDescription')}</CardDescription>
            </div>
             <Button variant="outline" size="sm" onClick={handleProfitabilityExport} disabled={isExporting} className="gap-1 ml-4 whitespace-nowrap">
                <Download className="h-4 w-4" />
                {isExporting ? t('General.submitting') : t('exportButton')}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('tableHeaderCrop')}</TableHead>
                <TableHead className="text-right">{t('tableHeaderRevenue')}</TableHead>
                <TableHead className="text-right">{t('tableHeaderLaborCosts')}</TableHead>
                <TableHead className="text-right">{t('tableHeaderFuelCosts')}</TableHead>
                <TableHead className="text-right">{t('tableHeaderMaterialCosts')}</TableHead>
                <TableHead className="text-right">{t('tableHeaderContributionMargin')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {profitabilityReportData.map((row) => (
                <TableRow key={row.crop}>
                  <TableCell className="font-medium">{row.crop}</TableCell>
                  <TableCell className="text-right">{currencyFormatter.format(row.revenue)}</TableCell>
                  <TableCell className="text-right text-red-600">{currencyFormatter.format(row.laborCost)}</TableCell>
                  <TableCell className="text-right text-red-600">{currencyFormatter.format(row.fuelCost)}</TableCell>
                  <TableCell className="text-right text-red-600">{currencyFormatter.format(row.materialCost)}</TableCell>
                  <TableCell className={`text-right font-bold ${row.contributionMargin >= 0 ? 'text-green-600' : 'text-red-600'}`}>{currencyFormatter.format(row.contributionMargin)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>{t('laborHoursByCropTitle')}</CardTitle>
          <CardDescription>{t('laborHoursByCropDescription')}</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="min-h-[350px] w-full">
            <BarChart accessibilityLayer data={laborReportData} margin={{ top: 20, right: 20, bottom: 5, left: 0 }}>
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
