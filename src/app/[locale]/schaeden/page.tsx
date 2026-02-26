'use client';

import { useState } from 'react';
import { PageLayout } from "@/components/layout/page-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { EmptyState } from "@/components/ui/empty-state";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  AlertTriangle,
  Plus,
  CloudLightning,
  ShieldAlert,
  Bug,
  Bird,
  Rabbit,
  TreePine,
  Leaf,
  Snowflake,
  Droplets,
  Wind,
  Sun,
  CloudRain,
  Filter,
  Eye,
  Info,
  CheckCircle2,
  XCircle,
  Clock,
  FileText,
  Search,
} from "lucide-react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type WildschadenStatus = 'Erfasst' | 'Gemeldet' | 'Begutachtet' | 'Reguliert' | 'Abgelehnt';
type Wildart = 'Wildschwein' | 'Reh' | 'Kranich' | 'Gans' | 'Hase' | 'Sonstiges';
type Schadenstyp = 'Verbiss' | 'Aufbruch' | 'Tritt' | 'Frass';
type UnwetterStatus = 'Erfasst' | 'Gemeldet' | 'Begutachtet' | 'Reguliert' | 'Abgelehnt';
type Ereignistyp = 'Hagel' | 'Starkregen' | 'Frost' | 'Duerre' | 'Sturm';

interface Wildschaden {
  id: string;
  datum: string;
  schlag: string;
  wildart: Wildart;
  schadenstyp: Schadenstyp;
  schadensgrad: number;
  flaeche: number;
  status: WildschadenStatus;
  kommentar: string;
}

interface Unwetterschaden {
  id: string;
  datum: string;
  ereignistyp: Ereignistyp;
  schlaege: string[];
  schadensgrad: number;
  gesamtflaeche: number;
  status: UnwetterStatus;
  kommentar: string;
}

// ---------------------------------------------------------------------------
// Mock Data
// ---------------------------------------------------------------------------

const SCHLAEGE = [
  'Am Eichenweg',
  'Hinterer Acker',
  'Sonnenhang',
  'Wiesengrund',
  'Nordfeld',
  'Birkenrain',
  'Talacker',
  'Hochfeld',
];

const MOCK_WILDSCHAEDEN: Wildschaden[] = [
  {
    id: 'ws-001',
    datum: '2026-02-18',
    schlag: 'Am Eichenweg',
    wildart: 'Wildschwein',
    schadenstyp: 'Aufbruch',
    schadensgrad: 4,
    flaeche: 1.2,
    status: 'Gemeldet',
    kommentar: 'Gro\u00DFfl\u00E4chiger Aufbruch im Winterweizen, vermutlich Rotte von ca. 8 Tieren.',
  },
  {
    id: 'ws-002',
    datum: '2026-02-10',
    schlag: 'Sonnenhang',
    wildart: 'Reh',
    schadenstyp: 'Verbiss',
    schadensgrad: 2,
    flaeche: 0.3,
    status: 'Erfasst',
    kommentar: 'Verbiss an jungen Rapspflanzen am Waldrand.',
  },
  {
    id: 'ws-003',
    datum: '2026-01-28',
    schlag: 'Hinterer Acker',
    wildart: 'Kranich',
    schadenstyp: 'Frass',
    schadensgrad: 3,
    flaeche: 2.5,
    status: 'Begutachtet',
    kommentar: 'Kranichschwarm hat frisch ges\u00E4ten Mais aufgenommen.',
  },
  {
    id: 'ws-004',
    datum: '2026-01-15',
    schlag: 'Wiesengrund',
    wildart: 'Wildschwein',
    schadenstyp: 'Aufbruch',
    schadensgrad: 5,
    flaeche: 3.8,
    status: 'Reguliert',
    kommentar: 'Massiver Aufbruch im Gr\u00FCnland, Gutachter war vor Ort.',
  },
  {
    id: 'ws-005',
    datum: '2025-12-20',
    schlag: 'Nordfeld',
    wildart: 'Gans',
    schadenstyp: 'Frass',
    schadensgrad: 2,
    flaeche: 1.0,
    status: 'Abgelehnt',
    kommentar: 'Fraßsch\u00E4den durch Wildg\u00E4nse im Wintergetreide.',
  },
  {
    id: 'ws-006',
    datum: '2026-02-22',
    schlag: 'Birkenrain',
    wildart: 'Hase',
    schadenstyp: 'Verbiss',
    schadensgrad: 1,
    flaeche: 0.1,
    status: 'Erfasst',
    kommentar: 'Geringer Verbiss an Zuckerr\u00FCben-Jungpflanzen.',
  },
  {
    id: 'ws-007',
    datum: '2026-02-05',
    schlag: 'Talacker',
    wildart: 'Wildschwein',
    schadenstyp: 'Tritt',
    schadensgrad: 3,
    flaeche: 0.8,
    status: 'Gemeldet',
    kommentar: 'Trittsch\u00E4den im feuchten Boden entlang des Feldweges.',
  },
];

const MOCK_UNWETTERSCHAEDEN: Unwetterschaden[] = [
  {
    id: 'uw-001',
    datum: '2026-02-14',
    ereignistyp: 'Sturm',
    schlaege: ['Am Eichenweg', 'Hinterer Acker', 'Sonnenhang'],
    schadensgrad: 3,
    gesamtflaeche: 12.5,
    status: 'Gemeldet',
    kommentar: 'Sturmtief "Xander" \u2013 Windbruch an Schutzhecken, Erosionssch\u00E4den auf offenen Fl\u00E4chen.',
  },
  {
    id: 'uw-002',
    datum: '2025-08-03',
    ereignistyp: 'Hagel',
    schlaege: ['Sonnenhang', 'Hochfeld'],
    schadensgrad: 5,
    gesamtflaeche: 8.2,
    status: 'Reguliert',
    kommentar: 'Hagelschlag mit bis zu 4 cm Korngr\u00F6\u00DFe. Totalschaden bei Mais und Sonnenblumen.',
  },
  {
    id: 'uw-003',
    datum: '2025-07-18',
    ereignistyp: 'Starkregen',
    schlaege: ['Talacker', 'Wiesengrund'],
    schadensgrad: 4,
    gesamtflaeche: 6.0,
    status: 'Begutachtet',
    kommentar: '85 l/m\u00B2 innerhalb von 2 Stunden. Massive Erosion und Verschl\u00E4mmung.',
  },
  {
    id: 'uw-004',
    datum: '2025-04-12',
    ereignistyp: 'Frost',
    schlaege: ['Nordfeld', 'Birkenrain', 'Am Eichenweg'],
    schadensgrad: 3,
    gesamtflaeche: 15.0,
    status: 'Reguliert',
    kommentar: 'Sp\u00E4tfrost bis -7\u00B0C. Frostsch\u00E4den an Zuckerr\u00FCben und Kartoffeln.',
  },
  {
    id: 'uw-005',
    datum: '2025-06-25',
    ereignistyp: 'Duerre',
    schlaege: ['Hochfeld', 'Sonnenhang', 'Hinterer Acker', 'Nordfeld'],
    schadensgrad: 4,
    gesamtflaeche: 22.0,
    status: 'Abgelehnt',
    kommentar: '6 Wochen ohne nennenswerten Niederschlag. Ertragseinbu\u00DFen bei Sommergetreide.',
  },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getStatusBadgeVariant(status: WildschadenStatus | UnwetterStatus): "default" | "secondary" | "destructive" | "outline" {
  switch (status) {
    case 'Erfasst':
      return 'outline';
    case 'Gemeldet':
      return 'secondary';
    case 'Begutachtet':
      return 'default';
    case 'Reguliert':
      return 'default';
    case 'Abgelehnt':
      return 'destructive';
    default:
      return 'outline';
  }
}

function getStatusIcon(status: WildschadenStatus | UnwetterStatus) {
  switch (status) {
    case 'Erfasst':
      return <FileText className="h-3 w-3 mr-1" />;
    case 'Gemeldet':
      return <Clock className="h-3 w-3 mr-1" />;
    case 'Begutachtet':
      return <Eye className="h-3 w-3 mr-1" />;
    case 'Reguliert':
      return <CheckCircle2 className="h-3 w-3 mr-1" />;
    case 'Abgelehnt':
      return <XCircle className="h-3 w-3 mr-1" />;
    default:
      return null;
  }
}

function getStatusColor(status: WildschadenStatus | UnwetterStatus): string {
  switch (status) {
    case 'Erfasst':
      return 'bg-gray-100 text-gray-700 border-gray-300';
    case 'Gemeldet':
      return 'bg-blue-50 text-blue-700 border-blue-300';
    case 'Begutachtet':
      return 'bg-amber-50 text-amber-700 border-amber-300';
    case 'Reguliert':
      return 'bg-green-50 text-green-700 border-green-300';
    case 'Abgelehnt':
      return 'bg-red-50 text-red-700 border-red-300';
    default:
      return '';
  }
}

function getSchadensgradLabel(grad: number): string {
  switch (grad) {
    case 1: return 'Minimal';
    case 2: return 'Gering';
    case 3: return 'Mittel';
    case 4: return 'Schwer';
    case 5: return 'Totalschaden';
    default: return '';
  }
}

function getSchadensgradColor(grad: number): string {
  switch (grad) {
    case 1: return 'text-green-600';
    case 2: return 'text-lime-600';
    case 3: return 'text-amber-600';
    case 4: return 'text-orange-600';
    case 5: return 'text-red-600';
    default: return '';
  }
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

function getEreignistypIcon(typ: Ereignistyp) {
  switch (typ) {
    case 'Hagel': return <CloudRain className="h-4 w-4" />;
    case 'Starkregen': return <Droplets className="h-4 w-4" />;
    case 'Frost': return <Snowflake className="h-4 w-4" />;
    case 'Duerre': return <Sun className="h-4 w-4" />;
    case 'Sturm': return <Wind className="h-4 w-4" />;
    default: return null;
  }
}

function getEreignistypLabel(typ: Ereignistyp): string {
  switch (typ) {
    case 'Duerre': return 'D\u00FCrre';
    default: return typ;
  }
}

// ---------------------------------------------------------------------------
// Wildart Icon Button Data
// ---------------------------------------------------------------------------

const WILDART_OPTIONS: { value: Wildart; label: string; icon: React.ReactNode }[] = [
  { value: 'Wildschwein', label: 'Wildschwein', icon: <Bug className="h-6 w-6" /> },
  { value: 'Reh', label: 'Reh', icon: <Leaf className="h-6 w-6" /> },
  { value: 'Kranich', label: 'Kranich', icon: <Bird className="h-6 w-6" /> },
  { value: 'Gans', label: 'Gans', icon: <Bird className="h-6 w-6" /> },
  { value: 'Hase', label: 'Hase', icon: <Rabbit className="h-6 w-6" /> },
  { value: 'Sonstiges', label: 'Sonstiges', icon: <TreePine className="h-6 w-6" /> },
];

const SCHADENSTYP_OPTIONS: Schadenstyp[] = ['Verbiss', 'Aufbruch', 'Tritt', 'Frass'];

const EREIGNISTYP_OPTIONS: { value: Ereignistyp; label: string; icon: React.ReactNode }[] = [
  { value: 'Hagel', label: 'Hagel', icon: <CloudRain className="h-6 w-6" /> },
  { value: 'Starkregen', label: 'Starkregen', icon: <Droplets className="h-6 w-6" /> },
  { value: 'Frost', label: 'Frost', icon: <Snowflake className="h-6 w-6" /> },
  { value: 'Duerre', label: 'D\u00FCrre', icon: <Sun className="h-6 w-6" /> },
  { value: 'Sturm', label: 'Sturm', icon: <Wind className="h-6 w-6" /> },
];

const STATUS_OPTIONS: WildschadenStatus[] = ['Erfasst', 'Gemeldet', 'Begutachtet', 'Reguliert', 'Abgelehnt'];

// ---------------------------------------------------------------------------
// Summary Stats
// ---------------------------------------------------------------------------

function WildschadenStats({ data }: { data: Wildschaden[] }) {
  const total = data.length;
  const offene = data.filter(d => d.status === 'Erfasst' || d.status === 'Gemeldet').length;
  const reguliert = data.filter(d => d.status === 'Reguliert').length;
  const gesamtFlaeche = data.reduce((sum, d) => sum + d.flaeche, 0);

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      <Card>
        <CardContent className="pt-6">
          <div className="text-2xl font-bold">{total}</div>
          <p className="text-xs text-muted-foreground">Gesamt Wildsch\u00E4den</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-6">
          <div className="text-2xl font-bold text-amber-600">{offene}</div>
          <p className="text-xs text-muted-foreground">Offene F\u00E4lle</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-6">
          <div className="text-2xl font-bold text-green-600">{reguliert}</div>
          <p className="text-xs text-muted-foreground">Reguliert</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-6">
          <div className="text-2xl font-bold">{gesamtFlaeche.toFixed(1)} ha</div>
          <p className="text-xs text-muted-foreground">Betroffene Fl\u00E4che</p>
        </CardContent>
      </Card>
    </div>
  );
}

function UnwetterStats({ data }: { data: Unwetterschaden[] }) {
  const total = data.length;
  const offene = data.filter(d => d.status === 'Erfasst' || d.status === 'Gemeldet').length;
  const reguliert = data.filter(d => d.status === 'Reguliert').length;
  const gesamtFlaeche = data.reduce((sum, d) => sum + d.gesamtflaeche, 0);

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      <Card>
        <CardContent className="pt-6">
          <div className="text-2xl font-bold">{total}</div>
          <p className="text-xs text-muted-foreground">Gesamt Unwettersch\u00E4den</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-6">
          <div className="text-2xl font-bold text-amber-600">{offene}</div>
          <p className="text-xs text-muted-foreground">Offene F\u00E4lle</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-6">
          <div className="text-2xl font-bold text-green-600">{reguliert}</div>
          <p className="text-xs text-muted-foreground">Reguliert</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-6">
          <div className="text-2xl font-bold">{gesamtFlaeche.toFixed(1)} ha</div>
          <p className="text-xs text-muted-foreground">Betroffene Fl\u00E4che</p>
        </CardContent>
      </Card>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Wildschaden Melden Sheet
// ---------------------------------------------------------------------------

function WildschadenMeldenSheet() {
  const [open, setOpen] = useState(false);
  const [selectedWildart, setSelectedWildart] = useState<Wildart | null>(null);
  const [selectedSchadenstyp, setSelectedSchadenstyp] = useState<Schadenstyp | null>(null);
  const [schadensgrad, setSchadensgrad] = useState<number[]>([3]);
  const [schlag, setSchlag] = useState<string>('');
  const [flaeche, setFlaeche] = useState<string>('');
  const [kommentar, setKommentar] = useState<string>('');

  const resetForm = () => {
    setSelectedWildart(null);
    setSelectedSchadenstyp(null);
    setSchadensgrad([3]);
    setSchlag('');
    setFlaeche('');
    setKommentar('');
  };

  const handleSubmit = () => {
    // Mock submit -- in real app would POST to API
    resetForm();
    setOpen(false);
  };

  return (
    <Sheet open={open} onOpenChange={(v) => { setOpen(v); if (!v) resetForm(); }}>
      <SheetTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Wildschaden melden
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>Wildschaden melden</SheetTitle>
          <SheetDescription>
            Erfassen Sie einen neuen Wildschaden f\u00FCr die Meldung an die Jagdgenossenschaft.
          </SheetDescription>
        </SheetHeader>
        <ScrollArea className="h-[calc(100vh-10rem)] mt-6 pr-4">
          <div className="space-y-6 pb-8">
            {/* Schlag w\u00E4hlen */}
            <div className="space-y-2">
              <Label htmlFor="ws-schlag">Schlag w\u00E4hlen</Label>
              <Select value={schlag} onValueChange={setSchlag}>
                <SelectTrigger id="ws-schlag">
                  <SelectValue placeholder="Schlag ausw\u00E4hlen..." />
                </SelectTrigger>
                <SelectContent>
                  {SCHLAEGE.map((s) => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Wildart */}
            <div className="space-y-2">
              <Label>Wildart</Label>
              <div className="grid grid-cols-3 gap-2">
                {WILDART_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setSelectedWildart(opt.value)}
                    className={`flex flex-col items-center justify-center gap-1.5 rounded-lg border-2 p-3 text-sm font-medium transition-colors hover:bg-accent ${
                      selectedWildart === opt.value
                        ? 'border-primary bg-primary/5 text-primary'
                        : 'border-muted bg-background text-muted-foreground'
                    }`}
                  >
                    {opt.icon}
                    <span>{opt.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Schadenstyp */}
            <div className="space-y-2">
              <Label>Schadenstyp</Label>
              <div className="grid grid-cols-2 gap-2">
                {SCHADENSTYP_OPTIONS.map((typ) => (
                  <button
                    key={typ}
                    type="button"
                    onClick={() => setSelectedSchadenstyp(typ)}
                    className={`rounded-lg border-2 px-4 py-2.5 text-sm font-medium transition-colors hover:bg-accent ${
                      selectedSchadenstyp === typ
                        ? 'border-primary bg-primary/5 text-primary'
                        : 'border-muted bg-background text-muted-foreground'
                    }`}
                  >
                    {typ === 'Frass' ? 'Fra\u00DF' : typ}
                  </button>
                ))}
              </div>
            </div>

            {/* Schadensgrad Slider */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Schadensgrad</Label>
                <span className={`text-sm font-semibold ${getSchadensgradColor(schadensgrad[0])}`}>
                  {schadensgrad[0]} \u2013 {getSchadensgradLabel(schadensgrad[0])}
                </span>
              </div>
              <Slider
                value={schadensgrad}
                onValueChange={setSchadensgrad}
                min={1}
                max={5}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>1 - Minimal</span>
                <span>5 - Totalschaden</span>
              </div>
            </div>

            {/* Gesch\u00E4tzte Fl\u00E4che */}
            <div className="space-y-2">
              <Label htmlFor="ws-flaeche">Gesch\u00E4tzte Fl\u00E4che (ha)</Label>
              <Input
                id="ws-flaeche"
                type="number"
                step="0.1"
                min="0"
                placeholder="z.B. 1.5"
                value={flaeche}
                onChange={(e) => setFlaeche(e.target.value)}
              />
            </div>

            {/* Kommentar */}
            <div className="space-y-2">
              <Label htmlFor="ws-kommentar">Kommentar</Label>
              <Textarea
                id="ws-kommentar"
                placeholder="Beschreiben Sie den Schaden, Beobachtungen, Spuren..."
                rows={4}
                value={kommentar}
                onChange={(e) => setKommentar(e.target.value)}
              />
            </div>

            {/* Submit */}
            <div className="flex gap-3 pt-2">
              <Button onClick={handleSubmit} className="flex-1">
                <AlertTriangle className="mr-2 h-4 w-4" />
                Schaden erfassen
              </Button>
              <Button variant="outline" onClick={() => { resetForm(); setOpen(false); }}>
                Abbrechen
              </Button>
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}

// ---------------------------------------------------------------------------
// Unwetterschaden Melden Sheet
// ---------------------------------------------------------------------------

function UnwetterschadenMeldenSheet() {
  const [open, setOpen] = useState(false);
  const [selectedEreignistyp, setSelectedEreignistyp] = useState<Ereignistyp | null>(null);
  const [selectedSchlaege, setSelectedSchlaege] = useState<string[]>([]);
  const [schadensgrad, setSchadensgrad] = useState<number[]>([3]);
  const [kommentar, setKommentar] = useState<string>('');

  const toggleSchlag = (s: string) => {
    setSelectedSchlaege((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
    );
  };

  const resetForm = () => {
    setSelectedEreignistyp(null);
    setSelectedSchlaege([]);
    setSchadensgrad([3]);
    setKommentar('');
  };

  const handleSubmit = () => {
    resetForm();
    setOpen(false);
  };

  return (
    <Sheet open={open} onOpenChange={(v) => { setOpen(v); if (!v) resetForm(); }}>
      <SheetTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Unwetterschaden melden
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>Unwetterschaden melden</SheetTitle>
          <SheetDescription>
            Erfassen Sie einen Unwetterschaden f\u00FCr die Schadensmeldung an Ihre Versicherung.
          </SheetDescription>
        </SheetHeader>
        <ScrollArea className="h-[calc(100vh-10rem)] mt-6 pr-4">
          <div className="space-y-6 pb-8">
            {/* Ereignistyp */}
            <div className="space-y-2">
              <Label>Ereignistyp</Label>
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
                {EREIGNISTYP_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setSelectedEreignistyp(opt.value)}
                    className={`flex flex-col items-center justify-center gap-1.5 rounded-lg border-2 p-3 text-sm font-medium transition-colors hover:bg-accent ${
                      selectedEreignistyp === opt.value
                        ? 'border-primary bg-primary/5 text-primary'
                        : 'border-muted bg-background text-muted-foreground'
                    }`}
                  >
                    {opt.icon}
                    <span>{opt.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Betroffene Schl\u00E4ge (multi-select) */}
            <div className="space-y-2">
              <Label>Betroffene Schl\u00E4ge</Label>
              <p className="text-xs text-muted-foreground">Mehrfachauswahl m\u00F6glich</p>
              <div className="grid grid-cols-2 gap-2">
                {SCHLAEGE.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => toggleSchlag(s)}
                    className={`rounded-lg border-2 px-3 py-2 text-sm font-medium text-left transition-colors hover:bg-accent ${
                      selectedSchlaege.includes(s)
                        ? 'border-primary bg-primary/5 text-primary'
                        : 'border-muted bg-background text-muted-foreground'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Schadensgrad */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Schadensgrad</Label>
                <span className={`text-sm font-semibold ${getSchadensgradColor(schadensgrad[0])}`}>
                  {schadensgrad[0]} \u2013 {getSchadensgradLabel(schadensgrad[0])}
                </span>
              </div>
              <Slider
                value={schadensgrad}
                onValueChange={setSchadensgrad}
                min={1}
                max={5}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>1 - Minimal</span>
                <span>5 - Totalschaden</span>
              </div>
            </div>

            {/* Kommentar */}
            <div className="space-y-2">
              <Label htmlFor="uw-kommentar">Kommentar</Label>
              <Textarea
                id="uw-kommentar"
                placeholder="Beschreiben Sie das Ereignis und die Sch\u00E4den..."
                rows={4}
                value={kommentar}
                onChange={(e) => setKommentar(e.target.value)}
              />
            </div>

            {/* Submit */}
            <div className="flex gap-3 pt-2">
              <Button onClick={handleSubmit} className="flex-1">
                <CloudLightning className="mr-2 h-4 w-4" />
                Schaden erfassen
              </Button>
              <Button variant="outline" onClick={() => { resetForm(); setOpen(false); }}>
                Abbrechen
              </Button>
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}

// ---------------------------------------------------------------------------
// Wildschaden Filter Bar
// ---------------------------------------------------------------------------

function WildschadenFilterBar({
  filterWildart,
  setFilterWildart,
  filterStatus,
  setFilterStatus,
  filterZeitraum,
  setFilterZeitraum,
}: {
  filterWildart: string;
  setFilterWildart: (v: string) => void;
  filterStatus: string;
  setFilterStatus: (v: string) => void;
  filterZeitraum: string;
  setFilterZeitraum: (v: string) => void;
}) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <Filter className="h-4 w-4" />
            Filter
          </div>
          <div className="flex-1 space-y-1">
            <Label className="text-xs">Wildart</Label>
            <Select value={filterWildart} onValueChange={setFilterWildart}>
              <SelectTrigger className="h-9">
                <SelectValue placeholder="Alle Wildarten" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="alle">Alle Wildarten</SelectItem>
                {WILDART_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex-1 space-y-1">
            <Label className="text-xs">Status</Label>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="h-9">
                <SelectValue placeholder="Alle Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="alle">Alle Status</SelectItem>
                {STATUS_OPTIONS.map((s) => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex-1 space-y-1">
            <Label className="text-xs">Zeitraum</Label>
            <Select value={filterZeitraum} onValueChange={setFilterZeitraum}>
              <SelectTrigger className="h-9">
                <SelectValue placeholder="Alle Zeitr\u00E4ume" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="alle">Alle Zeitr\u00E4ume</SelectItem>
                <SelectItem value="7">Letzte 7 Tage</SelectItem>
                <SelectItem value="30">Letzte 30 Tage</SelectItem>
                <SelectItem value="90">Letzte 90 Tage</SelectItem>
                <SelectItem value="365">Letztes Jahr</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {(filterWildart !== 'alle' || filterStatus !== 'alle' || filterZeitraum !== 'alle') && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setFilterWildart('alle');
                setFilterStatus('alle');
                setFilterZeitraum('alle');
              }}
            >
              Zur\u00FCcksetzen
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Unwetterschaden Filter Bar
// ---------------------------------------------------------------------------

function UnwetterFilterBar({
  filterEreignistyp,
  setFilterEreignistyp,
  filterStatus,
  setFilterStatus,
}: {
  filterEreignistyp: string;
  setFilterEreignistyp: (v: string) => void;
  filterStatus: string;
  setFilterStatus: (v: string) => void;
}) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <Filter className="h-4 w-4" />
            Filter
          </div>
          <div className="flex-1 space-y-1">
            <Label className="text-xs">Ereignistyp</Label>
            <Select value={filterEreignistyp} onValueChange={setFilterEreignistyp}>
              <SelectTrigger className="h-9">
                <SelectValue placeholder="Alle Ereignisse" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="alle">Alle Ereignisse</SelectItem>
                {EREIGNISTYP_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex-1 space-y-1">
            <Label className="text-xs">Status</Label>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="h-9">
                <SelectValue placeholder="Alle Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="alle">Alle Status</SelectItem>
                {STATUS_OPTIONS.map((s) => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {(filterEreignistyp !== 'alle' || filterStatus !== 'alle') && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setFilterEreignistyp('alle');
                setFilterStatus('alle');
              }}
            >
              Zur\u00FCcksetzen
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Main Page Component
// ---------------------------------------------------------------------------

export default function SchaedenPage() {
  // Wildschaden filters
  const [filterWildart, setFilterWildart] = useState('alle');
  const [filterStatus, setFilterStatus] = useState('alle');
  const [filterZeitraum, setFilterZeitraum] = useState('alle');

  // Unwetter filters
  const [filterEreignistyp, setFilterEreignistyp] = useState('alle');
  const [filterUnwetterStatus, setFilterUnwetterStatus] = useState('alle');

  // Apply wildschaden filters
  const filteredWildschaeden = MOCK_WILDSCHAEDEN.filter((ws) => {
    if (filterWildart !== 'alle' && ws.wildart !== filterWildart) return false;
    if (filterStatus !== 'alle' && ws.status !== filterStatus) return false;
    if (filterZeitraum !== 'alle') {
      const days = parseInt(filterZeitraum);
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - days);
      if (new Date(ws.datum) < cutoff) return false;
    }
    return true;
  });

  // Apply unwetter filters
  const filteredUnwetter = MOCK_UNWETTERSCHAEDEN.filter((uw) => {
    if (filterEreignistyp !== 'alle' && uw.ereignistyp !== filterEreignistyp) return false;
    if (filterUnwetterStatus !== 'alle' && uw.status !== filterUnwetterStatus) return false;
    return true;
  });

  return (
    <PageLayout
      title="Schadensdokumentation"
      description="Wildsch\u00E4den und Unwettersch\u00E4den erfassen, verwalten und an Jagdgenossenschaft oder Versicherung melden."
      breadcrumbs={[
        { label: 'Dashboard', href: '/' },
        { label: 'Schadensdokumentation' },
      ]}
    >
      <Tabs defaultValue="wildschaeden" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="wildschaeden" className="gap-2">
            <ShieldAlert className="h-4 w-4 hidden sm:inline-block" />
            Wildsch\u00E4den
          </TabsTrigger>
          <TabsTrigger value="unwetterschaeden" className="gap-2">
            <CloudLightning className="h-4 w-4 hidden sm:inline-block" />
            Unwettersch\u00E4den
          </TabsTrigger>
          <TabsTrigger value="jaeger-portal" className="gap-2">
            <Eye className="h-4 w-4 hidden sm:inline-block" />
            J\u00E4ger-Portal
          </TabsTrigger>
        </TabsList>

        {/* ================================================================ */}
        {/* TAB: Wildsch\u00E4den                                                   */}
        {/* ================================================================ */}
        <TabsContent value="wildschaeden" className="space-y-6">
          {/* Stats */}
          <WildschadenStats data={MOCK_WILDSCHAEDEN} />

          {/* Filter + Action */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex-1">
              <WildschadenFilterBar
                filterWildart={filterWildart}
                setFilterWildart={setFilterWildart}
                filterStatus={filterStatus}
                setFilterStatus={setFilterStatus}
                filterZeitraum={filterZeitraum}
                setFilterZeitraum={setFilterZeitraum}
              />
            </div>
            <div className="shrink-0">
              <WildschadenMeldenSheet />
            </div>
          </div>

          {/* Status Workflow Info */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                <span className="font-medium">Status-Workflow:</span>
                <Badge variant="outline" className={getStatusColor('Erfasst')}>
                  {getStatusIcon('Erfasst')} Erfasst
                </Badge>
                <span>\u2192</span>
                <Badge variant="outline" className={getStatusColor('Gemeldet')}>
                  {getStatusIcon('Gemeldet')} Gemeldet
                </Badge>
                <span>\u2192</span>
                <Badge variant="outline" className={getStatusColor('Begutachtet')}>
                  {getStatusIcon('Begutachtet')} Begutachtet
                </Badge>
                <span>\u2192</span>
                <Badge variant="outline" className={getStatusColor('Reguliert')}>
                  {getStatusIcon('Reguliert')} Reguliert
                </Badge>
                <span className="text-muted-foreground/60">/</span>
                <Badge variant="outline" className={getStatusColor('Abgelehnt')}>
                  {getStatusIcon('Abgelehnt')} Abgelehnt
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Table */}
          <Card>
            <CardHeader>
              <CardTitle>Wildsch\u00E4den \u00DCbersicht</CardTitle>
              <CardDescription>
                {filteredWildschaeden.length} {filteredWildschaeden.length === 1 ? 'Eintrag' : 'Eintr\u00E4ge'} gefunden
              </CardDescription>
            </CardHeader>
            <CardContent>
              {filteredWildschaeden.length === 0 ? (
                <EmptyState
                  icon={Search}
                  title="Keine Wildsch\u00E4den gefunden"
                  description="Passen Sie die Filterkriterien an oder melden Sie einen neuen Wildschaden."
                />
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Datum</TableHead>
                        <TableHead>Schlag</TableHead>
                        <TableHead>Wildart</TableHead>
                        <TableHead>Schadenstyp</TableHead>
                        <TableHead className="text-center">Schadensgrad</TableHead>
                        <TableHead className="text-right">Fl\u00E4che (ha)</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredWildschaeden.map((ws) => (
                        <TableRow key={ws.id}>
                          <TableCell className="font-medium whitespace-nowrap">
                            {formatDate(ws.datum)}
                          </TableCell>
                          <TableCell>{ws.schlag}</TableCell>
                          <TableCell>{ws.wildart}</TableCell>
                          <TableCell>{ws.schadenstyp === 'Frass' ? 'Fra\u00DF' : ws.schadenstyp}</TableCell>
                          <TableCell className="text-center">
                            <span className={`font-semibold ${getSchadensgradColor(ws.schadensgrad)}`}>
                              {ws.schadensgrad}/5
                            </span>
                            <span className="block text-xs text-muted-foreground">
                              {getSchadensgradLabel(ws.schadensgrad)}
                            </span>
                          </TableCell>
                          <TableCell className="text-right font-mono">
                            {ws.flaeche.toFixed(1)}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={`whitespace-nowrap ${getStatusColor(ws.status)}`}
                            >
                              {getStatusIcon(ws.status)}
                              {ws.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ================================================================ */}
        {/* TAB: Unwettersch\u00E4den                                               */}
        {/* ================================================================ */}
        <TabsContent value="unwetterschaeden" className="space-y-6">
          {/* Stats */}
          <UnwetterStats data={MOCK_UNWETTERSCHAEDEN} />

          {/* Filter + Action */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex-1">
              <UnwetterFilterBar
                filterEreignistyp={filterEreignistyp}
                setFilterEreignistyp={setFilterEreignistyp}
                filterStatus={filterUnwetterStatus}
                setFilterStatus={setFilterUnwetterStatus}
              />
            </div>
            <div className="shrink-0">
              <UnwetterschadenMeldenSheet />
            </div>
          </div>

          {/* Table */}
          <Card>
            <CardHeader>
              <CardTitle>Unwettersch\u00E4den \u00DCbersicht</CardTitle>
              <CardDescription>
                {filteredUnwetter.length} {filteredUnwetter.length === 1 ? 'Eintrag' : 'Eintr\u00E4ge'} gefunden
              </CardDescription>
            </CardHeader>
            <CardContent>
              {filteredUnwetter.length === 0 ? (
                <EmptyState
                  icon={Search}
                  title="Keine Unwettersch\u00E4den gefunden"
                  description="Passen Sie die Filterkriterien an oder melden Sie einen neuen Unwetterschaden."
                />
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Datum</TableHead>
                        <TableHead>Ereignis</TableHead>
                        <TableHead>Betroffene Schl\u00E4ge</TableHead>
                        <TableHead className="text-center">Schadensgrad</TableHead>
                        <TableHead className="text-right">Fl\u00E4che (ha)</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUnwetter.map((uw) => (
                        <TableRow key={uw.id}>
                          <TableCell className="font-medium whitespace-nowrap">
                            {formatDate(uw.datum)}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {getEreignistypIcon(uw.ereignistyp)}
                              <span>{getEreignistypLabel(uw.ereignistyp)}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {uw.schlaege.map((s) => (
                                <Badge key={s} variant="secondary" className="text-xs">
                                  {s}
                                </Badge>
                              ))}
                            </div>
                          </TableCell>
                          <TableCell className="text-center">
                            <span className={`font-semibold ${getSchadensgradColor(uw.schadensgrad)}`}>
                              {uw.schadensgrad}/5
                            </span>
                            <span className="block text-xs text-muted-foreground">
                              {getSchadensgradLabel(uw.schadensgrad)}
                            </span>
                          </TableCell>
                          <TableCell className="text-right font-mono">
                            {uw.gesamtflaeche.toFixed(1)}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={`whitespace-nowrap ${getStatusColor(uw.status)}`}
                            >
                              {getStatusIcon(uw.status)}
                              {uw.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ================================================================ */}
        {/* TAB: J\u00E4ger-Portal                                                  */}
        {/* ================================================================ */}
        <TabsContent value="jaeger-portal" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                J\u00E4ger-Portal
              </CardTitle>
              <CardDescription>
                Eingeschr\u00E4nkte Ansicht f\u00FCr registrierte J\u00E4ger und Jagdp\u00E4chter
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                <div className="flex gap-3">
                  <Info className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-blue-900">
                      J\u00E4ger sieht nur seine Revierfl\u00E4chen
                    </p>
                    <p className="text-sm text-blue-700">
                      In diesem Bereich k\u00F6nnen registrierte J\u00E4ger und Jagdp\u00E4chter die
                      Wildschadensmeldungen einsehen, die ihre zugewiesenen Revierfl\u00E4chen betreffen.
                      Die Ansicht ist auf die jeweiligen Jagdbezirke beschr\u00E4nkt.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Funktionen f\u00FCr J\u00E4ger</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0 mt-0.5" />
                        <span>Wildschadensmeldungen der eigenen Revierfl\u00E4chen einsehen</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0 mt-0.5" />
                        <span>Stellungnahme zu gemeldeten Sch\u00E4den abgeben</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0 mt-0.5" />
                        <span>Begutachtungstermine best\u00E4tigen oder vorschlagen</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0 mt-0.5" />
                        <span>Eigene Bejagungsnachweise hochladen</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0 mt-0.5" />
                        <span>Kommunikation mit dem Landwirt \u00FCber die Plattform</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Zugangsvoraussetzungen</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <Info className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
                        <span>G\u00FCltiger Jagdschein erforderlich</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Info className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
                        <span>Zuweisung der Revierfl\u00E4chen durch den Betriebsleiter</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Info className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
                        <span>Best\u00E4tigung des Jagdpachtvertrags</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Info className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
                        <span>Einladung per E-Mail mit Aktivierungslink</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>

              <EmptyState
                icon={ShieldAlert}
                title="J\u00E4ger-Portal noch nicht aktiviert"
                description="Laden Sie Ihren Jagdp\u00E4chter ein, um das J\u00E4ger-Portal zu aktivieren. Der J\u00E4ger erh\u00E4lt dann eine eingeschr\u00E4nkte Ansicht seiner Revierfl\u00E4chen."
                action={
                  <Button variant="outline">
                    <Plus className="mr-2 h-4 w-4" />
                    J\u00E4ger einladen
                  </Button>
                }
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </PageLayout>
  );
}
