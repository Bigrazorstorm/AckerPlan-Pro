'use client';

import { Observation } from "@/services/types";
import { useTranslations, useLocale } from "next-intl";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid } from "recharts";
import { format } from "date-fns";
import { de, enUS } from "date-fns/locale";
import { Siren } from "lucide-react";

interface GrowthChartProps {
    observations: Observation[];
}

const chartConfig = {
  bbch: {
    label: "BBCH",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig;

export function GrowthChart({ observations }: GrowthChartProps) {
    const t = useTranslations('FieldDetailPage');
    const locale = useLocale();

    const chartData = observations
        .filter(obs => obs.bbchStage != null)
        .map(obs => ({
            date: new Date(obs.date),
            bbch: obs.bbchStage,
            title: obs.title,
        }));
    
    const dateFormatter = (date: Date) => {
        try {
            return format(date, 'dd.MM', { locale: locale === 'de' ? de : enUS });
        } catch (error) {
            return '';
        }
    };

    if (chartData.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>{t('growthHistoryTitle')}</CardTitle>
                    <CardDescription>{t('growthHistoryDescription')}</CardDescription>
                </CardHeader>
                <CardContent>
                     <div className="flex flex-col items-center justify-center text-center gap-4 py-16 border-2 border-dashed rounded-lg">
                        <Siren className="w-12 h-12 text-muted-foreground" />
                        <h3 className="text-lg font-semibold">{t('noGrowthDataTitle')}</h3>
                        <p className="text-muted-foreground max-w-sm">
                            {t('noGrowthDataDescription')}
                        </p>
                    </div>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>{t('growthHistoryTitle')}</CardTitle>
                <CardDescription>{t('growthHistoryDescription')}</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
                    <LineChart
                        data={chartData}
                        margin={{
                        top: 5,
                        right: 20,
                        left: -10,
                        bottom: 5,
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis
                            dataKey="date"
                            tickFormatter={dateFormatter}
                            name={t('dateAxisLabel')}
                            type="number"
                            scale="time"
                            domain={['dataMin', 'dataMax']}
                        />
                        <YAxis domain={[0, 100]} name={t('bbchAxisLabel')} />
                        <ChartTooltip
                            content={({ active, payload, label }) => {
                                if (active && payload && payload.length) {
                                    const data = payload[0].payload;
                                    return (
                                        <div className="p-2 text-sm bg-background border rounded-md shadow-lg">
                                            <p className="font-bold">{`BBCH: ${data.bbch}`}</p>
                                            <p className="text-muted-foreground">{format(data.date, 'PPP', { locale: locale === 'de' ? de : enUS })}</p>
                                            <p className="italic">"{data.title}"</p>
                                        </div>
                                    );
                                }
                                return null;
                            }}
                        />
                        <Line
                            type="monotone"
                            dataKey="bbch"
                            stroke="var(--color-bbch)"
                            strokeWidth={2}
                            dot={{ r: 4, fill: "var(--color-bbch)" }}
                        />
                    </LineChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}
