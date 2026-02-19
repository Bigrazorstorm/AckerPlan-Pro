import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import dataService from "@/services";
import { DashboardChart } from "@/components/dashboard-chart";
import { getTranslations } from "next-intl/server";
import { AreaChart, Bell, Eye, Tractor } from "lucide-react";

export default async function Home() {
  const t = await getTranslations('Dashboard');
  const tKpi = await getTranslations('Kpis');

  // In a real app, tenantId and companyId would come from the user's session or context.
  // For now, we'll use dummy values.
  const tenantId = 'tenant-123';
  const companyId = 'company-456';

  const kpis = await dataService.getKpis(tenantId, companyId);
  const recentActivities = await dataService.getRecentActivities(tenantId, companyId);
  const chartData = await dataService.getChartData(tenantId, companyId);

  const kpiIcons: Record<string, React.ElementType> = {
    TotalRevenue: AreaChart,
    TotalCosts: Tractor,
    OpenObservations: Eye,
    MaintenanceDue: Bell,
  };

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
            <CardTitle>{t('recentActivitiesTitle')}</CardTitle>
            <CardDescription>
              {t('recentActivitiesDescription')}
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
                {recentActivities.map((activity) => (
                  <TableRow key={activity.id}>
                    <TableCell>
                      <div className="font-medium">{activity.type}</div>
                      <div className="text-sm text-muted-foreground">{activity.date}</div>
                    </TableCell>
                    <TableCell>{activity.field}</TableCell>
                    <TableCell>
                      <Badge variant={activity.status === 'Completed' ? 'default' : 'secondary'} className={activity.status === 'Completed' ? 'bg-green-100 text-green-800' : ''}>{activity.status}</Badge>
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
