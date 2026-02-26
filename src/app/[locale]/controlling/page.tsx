'use client';

import { useState, useMemo } from 'react';
import { PageLayout } from '@/components/layout/page-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from 'recharts';
import {
  Download,
  TrendingUp,
  TrendingDown,
  Euro,
  ArrowUpDown,
  ChevronUp,
  ChevronDown,
  BarChart3,
} from 'lucide-react';

// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------

interface SchlagData {
  id: string;
  schlag: string;
  kultur: string;
  ha: number;
  kostenHa: number;
  erloesHa: number;
  dbI: number;
  dbII: number;
}

interface MonatKosten {
  monat: string;
  lohn: number;
  maschine: number;
  material: number;
  pacht: number;
}

const WIRTSCHAFTSJAHRE = ['2025/2026', '2024/2025', '2023/2024'];

const MOCK_DATA_BY_WJ: Record<
  string,
  {
    gesamtkosten: number;
    schlaege: SchlagData[];
    monatskosten: MonatKosten[];
    kategorieKosten: { name: string; value: number; color: string }[];
  }
> = {
  '2025/2026': {
    gesamtkosten: 487650,
    schlaege: [
      { id: '1', schlag: 'Am Waldrand', kultur: 'Winterweizen', ha: 32.5, kostenHa: 1420, erloesHa: 2180, dbI: 760, dbII: 580 },
      { id: '2', schlag: 'Bergacker', kultur: 'Winterraps', ha: 18.0, kostenHa: 1680, erloesHa: 2450, dbI: 770, dbII: 520 },
      { id: '3', schlag: 'Sonnenhof Sued', kultur: 'Sommergerste', ha: 24.0, kostenHa: 1150, erloesHa: 1680, dbI: 530, dbII: 340 },
      { id: '4', schlag: 'Wiesengrund', kultur: 'Silomais', ha: 15.5, kostenHa: 1890, erloesHa: 2350, dbI: 460, dbII: 210 },
      { id: '5', schlag: 'Kirchfeld', kultur: 'Zuckerrueben', ha: 22.0, kostenHa: 2100, erloesHa: 3100, dbI: 1000, dbII: 780 },
      { id: '6', schlag: 'Muehlenweg', kultur: 'Winterweizen', ha: 28.0, kostenHa: 1380, erloesHa: 2100, dbI: 720, dbII: 540 },
      { id: '7', schlag: 'Seeblick', kultur: 'Koernererbsen', ha: 12.0, kostenHa: 980, erloesHa: 1520, dbI: 540, dbII: 380 },
      { id: '8', schlag: 'Talgrund', kultur: 'Wintergerste', ha: 20.0, kostenHa: 1260, erloesHa: 1450, dbI: 190, dbII: -60 },
      { id: '9', schlag: 'Huegelkamp', kultur: 'Winterraps', ha: 16.0, kostenHa: 1750, erloesHa: 2380, dbI: 630, dbII: 410 },
      { id: '10', schlag: 'Dorfanger', kultur: 'Silomais', ha: 19.5, kostenHa: 1920, erloesHa: 1780, dbI: -140, dbII: -380 },
    ],
    monatskosten: [
      { monat: 'Jul', lohn: 8200, maschine: 12500, material: 3200, pacht: 6800 },
      { monat: 'Aug', lohn: 14800, maschine: 18200, material: 2100, pacht: 6800 },
      { monat: 'Sep', lohn: 16500, maschine: 22400, material: 18500, pacht: 6800 },
      { monat: 'Okt', lohn: 18200, maschine: 19800, material: 24600, pacht: 6800 },
      { monat: 'Nov', lohn: 9800, maschine: 8400, material: 5200, pacht: 6800 },
      { monat: 'Dez', lohn: 5200, maschine: 4200, material: 1800, pacht: 6800 },
      { monat: 'Jan', lohn: 4800, maschine: 3800, material: 2400, pacht: 6800 },
      { monat: 'Feb', lohn: 6200, maschine: 5600, material: 8900, pacht: 6800 },
      { monat: 'Mär', lohn: 12400, maschine: 14200, material: 22800, pacht: 6800 },
      { monat: 'Apr', lohn: 15800, maschine: 16500, material: 18200, pacht: 6800 },
      { monat: 'Mai', lohn: 13200, maschine: 15800, material: 12400, pacht: 6800 },
      { monat: 'Jun', lohn: 11500, maschine: 13600, material: 8600, pacht: 6800 },
    ],
    kategorieKosten: [
      { name: 'Lohn', value: 136600, color: 'hsl(220, 70%, 55%)' },
      { name: 'Maschine', value: 155000, color: 'hsl(150, 60%, 45%)' },
      { name: 'Material', value: 128700, color: 'hsl(35, 85%, 55%)' },
      { name: 'Pacht', value: 81600, color: 'hsl(0, 65%, 55%)' },
    ],
  },
  '2024/2025': {
    gesamtkosten: 452300,
    schlaege: [
      { id: '1', schlag: 'Am Waldrand', kultur: 'Wintergerste', ha: 32.5, kostenHa: 1280, erloesHa: 1650, dbI: 370, dbII: 190 },
      { id: '2', schlag: 'Bergacker', kultur: 'Winterweizen', ha: 18.0, kostenHa: 1520, erloesHa: 2280, dbI: 760, dbII: 510 },
      { id: '3', schlag: 'Sonnenhof Sued', kultur: 'Winterraps', ha: 24.0, kostenHa: 1680, erloesHa: 2520, dbI: 840, dbII: 620 },
      { id: '4', schlag: 'Wiesengrund', kultur: 'Winterweizen', ha: 15.5, kostenHa: 1450, erloesHa: 2150, dbI: 700, dbII: 480 },
      { id: '5', schlag: 'Kirchfeld', kultur: 'Silomais', ha: 22.0, kostenHa: 1820, erloesHa: 2280, dbI: 460, dbII: 240 },
      { id: '6', schlag: 'Muehlenweg', kultur: 'Sommergerste', ha: 28.0, kostenHa: 1120, erloesHa: 1580, dbI: 460, dbII: 280 },
      { id: '7', schlag: 'Seeblick', kultur: 'Zuckerrueben', ha: 12.0, kostenHa: 2050, erloesHa: 2980, dbI: 930, dbII: 710 },
      { id: '8', schlag: 'Talgrund', kultur: 'Koernererbsen', ha: 20.0, kostenHa: 920, erloesHa: 1380, dbI: 460, dbII: 300 },
      { id: '9', schlag: 'Huegelkamp', kultur: 'Winterweizen', ha: 16.0, kostenHa: 1480, erloesHa: 2200, dbI: 720, dbII: 490 },
      { id: '10', schlag: 'Dorfanger', kultur: 'Wintergerste', ha: 19.5, kostenHa: 1320, erloesHa: 1580, dbI: 260, dbII: 40 },
    ],
    monatskosten: [
      { monat: 'Jul', lohn: 7800, maschine: 11200, material: 2800, pacht: 6500 },
      { monat: 'Aug', lohn: 13500, maschine: 16800, material: 1900, pacht: 6500 },
      { monat: 'Sep', lohn: 15200, maschine: 20100, material: 16800, pacht: 6500 },
      { monat: 'Okt', lohn: 16800, maschine: 18200, material: 22100, pacht: 6500 },
      { monat: 'Nov', lohn: 8900, maschine: 7600, material: 4800, pacht: 6500 },
      { monat: 'Dez', lohn: 4800, maschine: 3900, material: 1500, pacht: 6500 },
      { monat: 'Jan', lohn: 4500, maschine: 3500, material: 2100, pacht: 6500 },
      { monat: 'Feb', lohn: 5800, maschine: 5100, material: 8200, pacht: 6500 },
      { monat: 'Mär', lohn: 11200, maschine: 13000, material: 20500, pacht: 6500 },
      { monat: 'Apr', lohn: 14500, maschine: 15200, material: 16800, pacht: 6500 },
      { monat: 'Mai', lohn: 12100, maschine: 14500, material: 11200, pacht: 6500 },
      { monat: 'Jun', lohn: 10500, maschine: 12400, material: 7800, pacht: 6500 },
    ],
    kategorieKosten: [
      { name: 'Lohn', value: 125600, color: 'hsl(220, 70%, 55%)' },
      { name: 'Maschine', value: 141500, color: 'hsl(150, 60%, 45%)' },
      { name: 'Material', value: 116500, color: 'hsl(35, 85%, 55%)' },
      { name: 'Pacht', value: 78000, color: 'hsl(0, 65%, 55%)' },
    ],
  },
  '2023/2024': {
    gesamtkosten: 421800,
    schlaege: [
      { id: '1', schlag: 'Am Waldrand', kultur: 'Winterraps', ha: 32.5, kostenHa: 1620, erloesHa: 2380, dbI: 760, dbII: 540 },
      { id: '2', schlag: 'Bergacker', kultur: 'Sommergerste', ha: 18.0, kostenHa: 1080, erloesHa: 1480, dbI: 400, dbII: 220 },
      { id: '3', schlag: 'Sonnenhof Sued', kultur: 'Winterweizen', ha: 24.0, kostenHa: 1380, erloesHa: 2050, dbI: 670, dbII: 450 },
      { id: '4', schlag: 'Wiesengrund', kultur: 'Koernererbsen', ha: 15.5, kostenHa: 880, erloesHa: 1280, dbI: 400, dbII: 240 },
      { id: '5', schlag: 'Kirchfeld', kultur: 'Winterweizen', ha: 22.0, kostenHa: 1420, erloesHa: 2120, dbI: 700, dbII: 480 },
      { id: '6', schlag: 'Muehlenweg', kultur: 'Winterraps', ha: 28.0, kostenHa: 1580, erloesHa: 2300, dbI: 720, dbII: 500 },
      { id: '7', schlag: 'Seeblick', kultur: 'Wintergerste', ha: 12.0, kostenHa: 1200, erloesHa: 1520, dbI: 320, dbII: 140 },
      { id: '8', schlag: 'Talgrund', kultur: 'Silomais', ha: 20.0, kostenHa: 1780, erloesHa: 2200, dbI: 420, dbII: 180 },
      { id: '9', schlag: 'Huegelkamp', kultur: 'Zuckerrueben', ha: 16.0, kostenHa: 2020, erloesHa: 2920, dbI: 900, dbII: 680 },
      { id: '10', schlag: 'Dorfanger', kultur: 'Winterweizen', ha: 19.5, kostenHa: 1350, erloesHa: 2080, dbI: 730, dbII: 510 },
    ],
    monatskosten: [
      { monat: 'Jul', lohn: 7200, maschine: 10500, material: 2500, pacht: 6200 },
      { monat: 'Aug', lohn: 12800, maschine: 15600, material: 1700, pacht: 6200 },
      { monat: 'Sep', lohn: 14200, maschine: 18800, material: 15200, pacht: 6200 },
      { monat: 'Okt', lohn: 15600, maschine: 17000, material: 20800, pacht: 6200 },
      { monat: 'Nov', lohn: 8200, maschine: 7100, material: 4200, pacht: 6200 },
      { monat: 'Dez', lohn: 4400, maschine: 3600, material: 1200, pacht: 6200 },
      { monat: 'Jan', lohn: 4100, maschine: 3200, material: 1800, pacht: 6200 },
      { monat: 'Feb', lohn: 5400, maschine: 4800, material: 7500, pacht: 6200 },
      { monat: 'Mär', lohn: 10500, maschine: 12200, material: 18800, pacht: 6200 },
      { monat: 'Apr', lohn: 13500, maschine: 14200, material: 15500, pacht: 6200 },
      { monat: 'Mai', lohn: 11200, maschine: 13500, material: 10200, pacht: 6200 },
      { monat: 'Jun', lohn: 9800, maschine: 11600, material: 7200, pacht: 6200 },
    ],
    kategorieKosten: [
      { name: 'Lohn', value: 116900, color: 'hsl(220, 70%, 55%)' },
      { name: 'Maschine', value: 132100, color: 'hsl(150, 60%, 45%)' },
      { name: 'Material', value: 106600, color: 'hsl(35, 85%, 55%)' },
      { name: 'Pacht', value: 74400, color: 'hsl(0, 65%, 55%)' },
    ],
  },
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

type SortKey = keyof SchlagData;
type SortDir = 'asc' | 'desc';

const euroFormatter = new Intl.NumberFormat('de-DE', {
  style: 'currency',
  currency: 'EUR',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

const euroHaFormatter = new Intl.NumberFormat('de-DE', {
  style: 'currency',
  currency: 'EUR',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

function formatEuro(value: number): string {
  return euroFormatter.format(value);
}

function formatEuroHa(value: number): string {
  return euroHaFormatter.format(value) + '/ha';
}

// Custom tooltip for pie chart
function PieCustomTooltip({ active, payload }: { active?: boolean; payload?: Array<{ name: string; value: number; payload: { color: string } }> }) {
  if (!active || !payload?.length) return null;
  const item = payload[0];
  return (
    <div className="rounded-lg border bg-background px-3 py-2 text-sm shadow-xl">
      <div className="flex items-center gap-2">
        <div className="h-3 w-3 rounded-sm" style={{ backgroundColor: item.payload.color }} />
        <span className="font-medium">{item.name}</span>
      </div>
      <div className="mt-1 font-mono text-foreground">{formatEuro(item.value)}</div>
    </div>
  );
}

// Custom tooltip for bar chart
function BarCustomTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ name: string; value: number; color: string }>; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border bg-background px-3 py-2 text-sm shadow-xl">
      <p className="mb-1 font-medium">{label}</p>
      {payload.map((entry) => (
        <div key={entry.name} className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: entry.color }} />
            <span className="text-muted-foreground">{entry.name}</span>
          </div>
          <span className="font-mono tabular-nums">{formatEuro(entry.value)}</span>
        </div>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// CSV Export
// ---------------------------------------------------------------------------

function exportSchlagCSV(data: SchlagData[], wj: string) {
  const headers = ['Schlag', 'Kultur', 'ha', 'Kosten/ha', 'Erloes/ha', 'DB I', 'DB II'];
  const rows = data.map((d) => [
    d.schlag,
    d.kultur,
    d.ha.toFixed(1).replace('.', ','),
    d.kostenHa.toString(),
    d.erloesHa.toString(),
    d.dbI.toString(),
    d.dbII.toString(),
  ]);

  const csvContent = [headers.join(';'), ...rows.map((r) => r.join(';'))].join('\n');
  const BOM = '\uFEFF';
  const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `controlling_schlag_ranking_${wj.replace('/', '_')}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function ControllingPage() {
  const [selectedWJ, setSelectedWJ] = useState<string>(WIRTSCHAFTSJAHRE[0]);
  const [sortKey, setSortKey] = useState<SortKey>('dbII');
  const [sortDir, setSortDir] = useState<SortDir>('desc');

  const data = MOCK_DATA_BY_WJ[selectedWJ];

  // Sorted schlag data
  const sortedSchlaege = useMemo(() => {
    const arr = [...data.schlaege];
    arr.sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortDir === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }
      return sortDir === 'asc'
        ? (aVal as number) - (bVal as number)
        : (bVal as number) - (aVal as number);
    });
    return arr;
  }, [data.schlaege, sortKey, sortDir]);

  // KPI calculations
  const kpis = useMemo(() => {
    const schlaege = data.schlaege;
    const totalHa = schlaege.reduce((sum, s) => sum + s.ha, 0);
    const weightedDbII = schlaege.reduce((sum, s) => sum + s.dbII * s.ha, 0) / totalHa;

    const best = schlaege.reduce((best, s) => (s.dbII > best.dbII ? s : best), schlaege[0]);
    const worst = schlaege.reduce((worst, s) => (s.dbII < worst.dbII ? s : worst), schlaege[0]);

    return {
      gesamtkosten: data.gesamtkosten,
      avgDbII: Math.round(weightedDbII),
      bestSchlag: best,
      worstSchlag: worst,
    };
  }, [data]);

  // Handle sort toggle
  function handleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('desc');
    }
  }

  // Sort indicator
  function SortIndicator({ column }: { column: SortKey }) {
    if (sortKey !== column) {
      return <ArrowUpDown className="ml-1 inline h-3.5 w-3.5 text-muted-foreground/50" />;
    }
    return sortDir === 'asc' ? (
      <ChevronUp className="ml-1 inline h-3.5 w-3.5" />
    ) : (
      <ChevronDown className="ml-1 inline h-3.5 w-3.5" />
    );
  }

  // Bar chart data: restructure for stacked bars
  const barChartData = data.monatskosten.map((m) => ({
    monat: m.monat,
    Lohn: m.lohn,
    Maschine: m.maschine,
    Material: m.material,
    Pacht: m.pacht,
  }));

  return (
    <PageLayout
      title="Controlling"
      description="Wirtschaftlichkeitsanalyse und Deckungsbeitragsrechnung"
    >
      {/* Wirtschaftsjahr Selector */}
      <div className="flex items-center gap-3">
        <label className="text-sm font-medium text-muted-foreground">Wirtschaftsjahr:</label>
        <Select value={selectedWJ} onValueChange={setSelectedWJ}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Wirtschaftsjahr wählen" />
          </SelectTrigger>
          <SelectContent>
            {WIRTSCHAFTSJAHRE.map((wj) => (
              <SelectItem key={wj} value={wj}>
                {wj}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Gesamtkosten */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Gesamtkosten lfd. WJ</CardTitle>
            <Euro className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatEuro(kpis.gesamtkosten)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Wirtschaftsjahr {selectedWJ}
            </p>
          </CardContent>
        </Card>

        {/* Durchschnittlicher DB II */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Durchschn. DB II</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${kpis.avgDbII >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatEuroHa(kpis.avgDbII)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Gewichteter Mittelwert aller Schläge
            </p>
          </CardContent>
        </Card>

        {/* Bester Schlag */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Bester Schlag (DB II)</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatEuroHa(kpis.bestSchlag.dbII)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {kpis.bestSchlag.schlag} &middot; {kpis.bestSchlag.kultur}
            </p>
          </CardContent>
        </Card>

        {/* Schlechtester Schlag */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Schlechtester Schlag (DB II)</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${kpis.worstSchlag.dbII >= 0 ? 'text-yellow-600' : 'text-red-600'}`}>
              {formatEuroHa(kpis.worstSchlag.dbII)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {kpis.worstSchlag.schlag} &middot; {kpis.worstSchlag.kultur}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Kosten nach Kategorie - Donut Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Kosten nach Kategorie</CardTitle>
            <CardDescription>
              Verteilung der Gesamtkosten im WJ {selectedWJ}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[320px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.kategorieKosten}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={120}
                    paddingAngle={3}
                    dataKey="value"
                    nameKey="name"
                    strokeWidth={2}
                    stroke="hsl(var(--background))"
                  >
                    {data.kategorieKosten.map((entry, index) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<PieCustomTooltip />} />
                  <Legend
                    verticalAlign="bottom"
                    height={36}
                    formatter={(value: string) => (
                      <span className="text-sm text-foreground">{value}</span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            {/* Legend details with amounts */}
            <div className="mt-4 grid grid-cols-2 gap-3">
              {data.kategorieKosten.map((kat) => (
                <div key={kat.name} className="flex items-center justify-between rounded-md border px-3 py-2">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-sm" style={{ backgroundColor: kat.color }} />
                    <span className="text-sm">{kat.name}</span>
                  </div>
                  <span className="text-sm font-medium tabular-nums">{formatEuro(kat.value)}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Monatliche Kostenentwicklung - Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Monatliche Kostenentwicklung</CardTitle>
            <CardDescription>
              Kostenverteilung je Monat im WJ {selectedWJ}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[320px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barChartData} margin={{ top: 10, right: 10, bottom: 0, left: 0 }}>
                  <CartesianGrid vertical={false} strokeDasharray="3 3" />
                  <XAxis
                    dataKey="monat"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    fontSize={12}
                  />
                  <YAxis
                    tickFormatter={(v: number) => `${(v / 1000).toFixed(0)}k`}
                    tickLine={false}
                    axisLine={false}
                    fontSize={12}
                    width={45}
                  />
                  <Tooltip content={<BarCustomTooltip />} />
                  <Legend
                    verticalAlign="bottom"
                    height={36}
                    formatter={(value: string) => (
                      <span className="text-sm text-foreground">{value}</span>
                    )}
                  />
                  <Bar dataKey="Lohn" stackId="a" fill="hsl(220, 70%, 55%)" radius={[0, 0, 0, 0]} />
                  <Bar dataKey="Maschine" stackId="a" fill="hsl(150, 60%, 45%)" radius={[0, 0, 0, 0]} />
                  <Bar dataKey="Material" stackId="a" fill="hsl(35, 85%, 55%)" radius={[0, 0, 0, 0]} />
                  <Bar dataKey="Pacht" stackId="a" fill="hsl(0, 65%, 55%)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Schlag-Ranking-Tabelle */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <CardTitle>Schlag-Ranking nach Deckungsbeitrag</CardTitle>
              <CardDescription>
                Wirtschaftlichkeitsvergleich aller Schläge im WJ {selectedWJ}
              </CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 whitespace-nowrap"
              onClick={() => exportSchlagCSV(sortedSchlaege, selectedWJ)}
            >
              <Download className="h-4 w-4" />
              CSV Export
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead
                  className="cursor-pointer select-none hover:text-foreground"
                  onClick={() => handleSort('schlag')}
                >
                  Schlag
                  <SortIndicator column="schlag" />
                </TableHead>
                <TableHead
                  className="cursor-pointer select-none hover:text-foreground"
                  onClick={() => handleSort('kultur')}
                >
                  Kultur
                  <SortIndicator column="kultur" />
                </TableHead>
                <TableHead
                  className="cursor-pointer select-none text-right hover:text-foreground"
                  onClick={() => handleSort('ha')}
                >
                  ha
                  <SortIndicator column="ha" />
                </TableHead>
                <TableHead
                  className="cursor-pointer select-none text-right hover:text-foreground"
                  onClick={() => handleSort('kostenHa')}
                >
                  Kosten/ha
                  <SortIndicator column="kostenHa" />
                </TableHead>
                <TableHead
                  className="cursor-pointer select-none text-right hover:text-foreground"
                  onClick={() => handleSort('erloesHa')}
                >
                  Erlös/ha
                  <SortIndicator column="erloesHa" />
                </TableHead>
                <TableHead
                  className="cursor-pointer select-none text-right hover:text-foreground"
                  onClick={() => handleSort('dbI')}
                >
                  DB I
                  <SortIndicator column="dbI" />
                </TableHead>
                <TableHead
                  className="cursor-pointer select-none text-right hover:text-foreground"
                  onClick={() => handleSort('dbII')}
                >
                  DB II
                  <SortIndicator column="dbII" />
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedSchlaege.map((s) => (
                <TableRow key={s.id}>
                  <TableCell className="font-medium">{s.schlag}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="font-normal">
                      {s.kultur}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {s.ha.toFixed(1).replace('.', ',')}
                  </TableCell>
                  <TableCell className="text-right tabular-nums text-red-600">
                    {formatEuro(s.kostenHa)}
                  </TableCell>
                  <TableCell className="text-right tabular-nums text-green-600">
                    {formatEuro(s.erloesHa)}
                  </TableCell>
                  <TableCell className={`text-right tabular-nums font-medium ${s.dbI >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatEuro(s.dbI)}
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge
                      variant={s.dbII >= 0 ? 'default' : 'destructive'}
                      className={`tabular-nums font-semibold ${
                        s.dbII >= 0
                          ? 'bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-400'
                          : 'bg-red-100 text-red-800 hover:bg-red-100 dark:bg-red-900/30 dark:text-red-400'
                      }`}
                    >
                      {formatEuro(s.dbII)}/ha
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </PageLayout>
  );
}
