"use client"

import { useTranslations } from "next-intl"
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { ChartDataPoint } from "@/services/types"

interface DashboardChartProps {
  chartData: ChartDataPoint[];
}

export function DashboardChart({ chartData }: DashboardChartProps) {
  const t = useTranslations('Dashboard');

  const chartConfig = {
    revenue: {
      label: t('revenue'),
      color: "hsl(var(--primary))",
    },
    cost: {
      label: t('cost'),
      color: "hsl(var(--destructive))",
    },
  } satisfies ChartConfig

  return (
    <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
      <BarChart accessibilityLayer data={chartData}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="month"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value) => value.slice(0, 3)}
        />
        <YAxis
          tickFormatter={(value) => `€${value / 1000}k`}
        />
        <ChartTooltip content={<ChartTooltipContent formatter={(value, name, item) => (`${item.payload.month}: ${new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(value as number)}`)} />} />
        <Bar dataKey="revenue" fill="var(--color-revenue)" radius={4} />
        <Bar dataKey="cost" fill="var(--color-cost)" radius={4} />
      </BarChart>
    </ChartContainer>
  )
}
