'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  MapPin, 
  AlertTriangle, 
  Phone, 
  Mail, 
  Calendar,
  Eye,
  FileText,
  Search,
  ChevronRight,
  Loader2,
  User,
  Trees,
  Camera
} from 'lucide-react';
import Link from 'next/link';

// Mock data for hunter portal
interface JagdRevier {
  id: string;
  name: string;
  flaeche: number;
  belongsTo: string;
}

interface Wildschaden {
  id: string;
  datum: string;
  schlag: string;
  wildart: string;
  schadenstyp: string;
  flaeche: number;
  status: 'erfasst' | 'gemeldet' | 'begutachtet' | 'reguliert' | 'abgelehnt';
  schadensgrad: number;
}

const MOCK_REVIER: JagdRevier = {
  id: 'REV-001',
  name: 'Revier Mühlfeld',
  flaeche: 125,
  belongsTo: 'Bauernhof Müller',
};

const MOCK_SCHADEN: Wildschaden[] = [
  {
    id: 'WS-2026-001',
    datum: '2026-02-15',
    schlag: 'Mühlfeld Ost',
    wildart: 'Wildschwein',
    schadenstyp: 'Aufbruch',
    flaeche: 0.3,
    status: 'begutachtet',
    schadensgrad: 4,
  },
  {
    id: 'WS-2026-002',
    datum: '2026-02-10',
    schlag: 'Bachwiese',
    wildart: 'Reh',
    schadenstyp: 'Verbiss',
    flaeche: 0.1,
    status: 'reguliert',
    schadensgrad: 2,
  },
  {
    id: 'WS-2026-003',
    datum: '2026-02-20',
    schlag: 'Südfeld',
    wildart: 'Kranich',
    schadenstyp: 'Fraß',
    flaeche: 0.5,
    status: 'gemeldet',
    schadensgrad: 3,
  },
];

const STATUS_LABELS: Record<Wildschaden['status'], string> = {
  'erfasst': 'Erfasst',
  'gemeldet': 'Gemeldet',
  'begutachtet': 'Begutachtet',
  'reguliert': 'Reguliert',
  'abgelehnt': 'Abgelehnt',
};

const STATUS_COLORS: Record<Wildschaden['status'], string> = {
  'erfasst': 'bg-gray-500',
  'gemeldet': 'bg-blue-500',
  'begutachtet': 'bg-yellow-500',
  'reguliert': 'bg-green-500',
  'abgelehnt': 'bg-red-500',
};

const WILDART_ICONS: Record<string, string> = {
  'Wildschwein': '🐗',
  'Reh': '🦌',
  'Kranich': '🦢',
  'Fasan': '🐔',
  'Hase': '🐰',
};

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

function HunterSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-4 w-24" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default function JaegerPortalPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [schaden, setSchaden] = useState<Wildschaden[]>(MOCK_SCHADEN);
  const [revier] = useState<JagdRevier>(MOCK_REVIER);

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  // Filter damage by search
  const filteredSchaden = schaden.filter(s =>
    s.schlag.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.wildart.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get stats
  const offeneSchaden = schaden.filter(s => s.status !== 'reguliert' && s.status !== 'abgelehnt').length;
  const schadenThisYear = schaden.length;

  if (loading) {
    return <HunterSkeleton />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            Jäger-Portal
          </h1>
          <p className="text-muted-foreground">
            Willkommen im Revier {revier.name}
          </p>
        </div>
        <Badge variant="outline" className="text-sm">
          <User className="h-4 w-4 mr-1" />
          Revierleiter
        </Badge>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Gesamtfläche
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{revier.flaeche} ha</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Offene Schäden
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">{offeneSchaden}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Schäden dieses Jahr
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{schadenThisYear}</div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="schaden" className="space-y-4">
        <TabsList>
          <TabsTrigger value="schaden">Wildschäden</TabsTrigger>
          <TabsTrigger value="karte">Karte</TabsTrigger>
          <TabsTrigger value="info">Revier-Info</TabsTrigger>
        </TabsList>

        {/* Schäden Tab */}
        <TabsContent value="schaden" className="space-y-4">
          {/* Search */}
          <div className="flex gap-2">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Schäden durchsuchen..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Damage Table */}
          <Card>
            <CardHeader>
              <CardTitle>Wildschaden-Übersicht</CardTitle>
              <CardDescription>
                Alle Schäden in Ihrem Revier
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Datum</TableHead>
                    <TableHead>Schlag</TableHead>
                    <TableHead>Wildart</TableHead>
                    <TableHead>Typ</TableHead>
                    <TableHead>Fläche</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSchaden.map((schaden) => (
                    <TableRow key={schaden.id}>
                      <TableCell>{formatDate(schaden.datum)}</TableCell>
                      <TableCell>{schaden.schlag}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span>{WILDART_ICONS[schaden.wildart] || '🦌'}</span>
                          <span>{schaden.wildart}</span>
                        </div>
                      </TableCell>
                      <TableCell>{schaden.schadenstyp}</TableCell>
                      <TableCell>{schaden.flaeche} ha</TableCell>
                      <TableCell>
                        <Badge className={STATUS_COLORS[schaden.status]}>
                          {STATUS_LABELS[schaden.status]}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              
              {filteredSchaden.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <AlertTriangle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Keine Schäden gefunden</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Karte Tab */}
        <TabsContent value="karte">
          <Card>
            <CardHeader>
              <CardTitle>Revier-Karte</CardTitle>
              <CardDescription>
                Übersicht über Ihr Jagdrevier
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-muted rounded-lg h-[500px] flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <MapPin className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p>Kartenansicht wird geladen...</p>
                  <p className="text-sm mt-2">
                    Hier werden später die Reviergrenzen und Schadenspunkte angezeigt.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Info Tab */}
        <TabsContent value="info" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trees className="h-5 w-5" />
                  Revierdaten
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Reviername</span>
                  <span className="font-medium">{revier.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Fläche</span>
                  <span className="font-medium">{revier.flaeche} ha</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Zugehörig zu</span>
                  <span className="font-medium">{revier.belongsTo}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Ansprechpartner
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Betriebsleiter</span>
                  <span className="font-medium">Max Müller</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>+49 123 456789</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>max.mueller@beispiel.de</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Zuständige Flurstücke</CardTitle>
              <CardDescription>
                Die diesem Revier zugeordneten Flurstücke
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Gemarkung</TableHead>
                    <TableHead>Flur</TableHead>
                    <TableHead>Flurstück</TableHead>
                    <TableHead>Fläche</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>Mühlfeld</TableCell>
                    <TableCell>1</TableCell>
                    <TableCell>12/3</TableCell>
                    <TableCell>4,5 ha</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Mühlfeld</TableCell>
                    <TableCell>1</TableCell>
                    <TableCell>12/4</TableCell>
                    <TableCell>3,2 ha</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Mühlfeld</TableCell>
                    <TableCell>2</TableCell>
                    <TableCell>8/1</TableCell>
                    <TableCell>5,8 ha</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
