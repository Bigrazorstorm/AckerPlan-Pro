'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from '@/context/session-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  Play, 
  Pause, 
  Square, 
  Camera, 
  Package, 
  MapPin,
  Thermometer,
  Wind,
  Droplets,
  Clock,
  Timer,
  ChevronRight,
  Plus,
  X,
  CameraIcon,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  Navigation
} from 'lucide-react';
import Link from 'next/link';

// Types for the active operation
interface ActiveOperation {
  id: string;
  fieldId: string;
  fieldName: string;
  operationType: string;
  startTime: Date;
  isPaused: boolean;
  pauseTime?: Date;
  totalPausedTime: number; // in milliseconds
  materials: MaterialEntry[];
  notes: string[];
  photos: PhotoEntry[];
  gpsTrack: GPSPoint[];
}

interface MaterialEntry {
  id: string;
  name: string;
  quantity: number;
  unit: string;
}

interface PhotoEntry {
  id: string;
  timestamp: Date;
  base64?: string;
}

interface GPSPoint {
  lat: number;
  lng: number;
  timestamp: Date;
}

// German labels
const OPERATION_TYPE_LABELS: Record<string, string> = {
  'PLOWING': 'Pflügen',
  'SOWING': 'Aussaat',
  'FERTILIZING': 'Düngung',
  'SPRAYING': 'Pflanzenschutz',
  'MOWING': 'Mahd',
  'HARVESTING': 'Ernte',
  'DISKING': 'Eggen',
  'ROLLING': 'Walzen',
  'CULTIVATING': 'Kultivator',
  'MAINTENANCE': 'Wartung',
  'OTHER': 'Sonstiges',
};

// Mock weather data
const MOCK_WEATHER = {
  temperature: 12,
  wind: 8,
  windDirection: 'SW',
  precipitation: 0,
  condition: 'Teilweise bewölkt',
};

// Format elapsed time
function formatElapsedTime(startTime: Date, isPaused: boolean, totalPausedTime: number): string {
  const now = new Date();
  const elapsed = now.getTime() - startTime.getTime() - (isPaused ? 0 : totalPausedTime);
  
  const hours = Math.floor(elapsed / (1000 * 60 * 60));
  const minutes = Math.floor((elapsed % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((elapsed % (1000 * 60)) / 1000);
  
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

// Format time only
function formatTime(date: Date): string {
  return date.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
}

export default function ActiveOperationPage() {
  const router = useRouter();
  const { activeCompany } = useSession();
  const { toast } = useToast();
  
  // Active operation state
  const [operation, setOperation] = useState<ActiveOperation | null>(null);
  const [elapsedTime, setElapsedTime] = useState('00:00:00');
  const [isLoading, setIsLoading] = useState(true);
  const [showStopConfirm, setShowStopConfirm] = useState(false);
  const [materialSheetOpen, setMaterialSheetOpen] = useState(false);
  const [noteInput, setNoteInput] = useState('');
  
  // Timer ref
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Material form state
  const [materialName, setMaterialName] = useState('');
  const [materialQuantity, setMaterialQuantity] = useState('');
  const [materialUnit, setMaterialUnit] = useState('l');

  // Load active operation on mount
  useEffect(() => {
    // Simulate loading from storage/API
    const loadOperation = async () => {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mock: Check if there's an active operation in session
      // In real app, this would be loaded from database
      const hasActiveOperation = sessionStorage.getItem('activeOperation');
      
      if (hasActiveOperation) {
        const op = JSON.parse(hasActiveOperation);
        op.startTime = new Date(op.startTime);
        if (op.pauseTime) op.pauseTime = new Date(op.pauseTime);
        setOperation(op);
      } else {
        // No active operation - redirect to create new
        router.push('./auftraege/neu');
      }
      
      setIsLoading(false);
    };
    
    loadOperation();
  }, [router]);

  // Timer effect
  useEffect(() => {
    if (operation && !operation.isPaused) {
      timerRef.current = setInterval(() => {
        setElapsedTime(formatElapsedTime(operation.startTime, operation.isPaused, operation.totalPausedTime));
      }, 1000);
    }
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [operation]);

  // Handle pause/resume
  const handlePause = () => {
    if (!operation) return;
    
    const now = new Date();
    const newPausedTime = operation.isPaused 
      ? operation.totalPausedTime 
      : operation.totalPausedTime + (now.getTime() - (operation.pauseTime?.getTime() || now.getTime()));
    
    const updated = {
      ...operation,
      isPaused: !operation.isPaused,
      pauseTime: !operation.isPaused ? now : undefined,
      totalPausedTime: newPausedTime,
    };
    
    setOperation(updated);
    sessionStorage.setItem('activeOperation', JSON.stringify(updated));
    
    toast({
      title: operation.isPaused ? 'Auftrag fortgesetzt' : 'Auftrag pausiert',
      description: operation.isPaused 
        ? 'Timer läuft weiter' 
        : 'Zeit wird nicht mehr gezählt',
    });
  };

  // Handle stop (complete)
  const handleStop = async () => {
    if (!operation) return;
    
    setShowStopConfirm(false);
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Clear active operation
    sessionStorage.removeItem('activeOperation');
    
    toast({
      title: 'Auftrag abgeschlossen',
      description: `Auftrag ${operation.id} wurde erfolgreich beendet.`,
    });
    
    // Navigate to operation detail
    router.push(`./auftraege/${operation.id}`);
  };

  // Handle add material
  const handleAddMaterial = () => {
    if (!operation || !materialName || !materialQuantity) return;
    
    const newMaterial: MaterialEntry = {
      id: Date.now().toString(),
      name: materialName,
      quantity: parseFloat(materialQuantity),
      unit: materialUnit,
    };
    
    const updated = {
      ...operation,
      materials: [...operation.materials, newMaterial],
    };
    
    setOperation(updated);
    sessionStorage.setItem('activeOperation', JSON.stringify(updated));
    
    setMaterialName('');
    setMaterialQuantity('');
    setMaterialSheetOpen(false);
    
    toast({
      title: 'Material erfasst',
      description: `${materialQuantity} ${materialUnit} ${materialName} hinzugefügt.`,
    });
  };

  // Handle add note
  const handleAddNote = () => {
    if (!operation || !noteInput.trim()) return;
    
    const updated = {
      ...operation,
      notes: [...operation.notes, noteInput.trim()],
    };
    
    setOperation(updated);
    sessionStorage.setItem('activeOperation', JSON.stringify(updated));
    
    setNoteInput('');
    
    toast({
      title: 'Notiz hinzugefügt',
    });
  };

  // Handle photo (simulated)
  const handleTakePhoto = () => {
    if (!operation) return;
    
    // In real app, this would open camera
    const newPhoto: PhotoEntry = {
      id: Date.now().toString(),
      timestamp: new Date(),
    };
    
    const updated = {
      ...operation,
      photos: [...operation.photos, newPhoto],
    };
    
    setOperation(updated);
    sessionStorage.setItem('activeOperation', JSON.stringify(updated));
    
    toast({
      title: 'Foto aufgenommen',
      description: 'Foto wurde dem Auftrag hinzugefügt.',
    });
  };

  // Get current GPS (simulated)
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        if (!operation) return;
        
        const newPoint: GPSPoint = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          timestamp: new Date(),
        };
        
        const updated = {
          ...operation,
          gpsTrack: [...operation.gpsTrack, newPoint],
        };
        
        setOperation(updated);
        sessionStorage.setItem('activeOperation', JSON.stringify(updated));
        
        toast({
          title: 'Standort erfasst',
          description: `Lat: ${position.coords.latitude.toFixed(4)}, Lng: ${position.coords.longitude.toFixed(4)}`,
        });
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-green-500 mx-auto mb-4" />
          <p className="text-white text-lg">Lade Auftrag...</p>
        </div>
      </div>
    );
  }

  if (!operation) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-white text-lg mb-4">Kein aktiver Auftrag gefunden</p>
          <Link href="./auftraege/neu">
            <Button className="bg-green-600 hover:bg-green-700">
              Neuen Auftrag starten
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      {/* Header with Timer */}
      <div className="bg-gray-800 p-4 pb-8">
        <div className="max-w-lg mx-auto">
          {/* Field & Type Info */}
          <div className="text-center mb-6">
            <Badge variant="outline" className="text-green-400 border-green-400 mb-2">
              {OPERATION_TYPE_LABELS[operation.operationType] || operation.operationType}
            </Badge>
            <h1 className="text-2xl font-bold">{operation.fieldName}</h1>
            <p className="text-gray-400">Auftrag #{operation.id}</p>
          </div>
          
          {/* Timer Display */}
          <div className="text-center mb-6">
            <div className={`text-7xl font-mono font-bold tracking-wider ${
              operation.isPaused ? 'text-amber-400' : 'text-green-400'
            }`}>
              {elapsedTime}
            </div>
            {operation.isPaused && (
              <div className="flex items-center justify-center gap-2 text-amber-400 mt-2">
                <Pause className="h-5 w-5" />
                <span>Pausiert</span>
              </div>
            )}
          </div>
          
          {/* Weather Info */}
          <div className="flex justify-center gap-6 text-sm text-gray-400">
            <div className="flex items-center gap-1">
              <Thermometer className="h-4 w-4" />
              <span>{MOCK_WEATHER.temperature}°C</span>
            </div>
            <div className="flex items-center gap-1">
              <Wind className="h-4 w-4" />
              <span>{MOCK_WEATHER.wind} km/h {MOCK_WEATHER.windDirection}</span>
            </div>
            <div className="flex items-center gap-1">
              <Droplets className="h-4 w-4" />
              <span>{MOCK_WEATHER.precipitation} mm</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex-1 bg-gray-900 p-4">
        <div className="max-w-lg mx-auto space-y-4">
          {/* Quick Actions */}
          <div className="grid grid-cols-4 gap-3">
            <Button
              variant="outline"
              className="flex flex-col h-20 gap-1 bg-gray-800 border-gray-700 hover:bg-gray-700"
              onClick={handleTakePhoto}
            >
              <CameraIcon className="h-6 w-6" />
              <span className="text-xs">Foto</span>
            </Button>
            
            <Sheet open={materialSheetOpen} onOpenChange={setMaterialSheetOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  className="flex flex-col h-20 gap-1 bg-gray-800 border-gray-700 hover:bg-gray-700"
                >
                  <Package className="h-6 w-6" />
                  <span className="text-xs">Material</span>
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Material erfassen</SheetTitle>
                </SheetHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>Artikel</Label>
                    <Input
                      placeholder="z.B. Diesel, Dünger"
                      value={materialName}
                      onChange={(e) => setMaterialName(e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-2">
                      <Label>Menge</Label>
                      <Input
                        type="number"
                        placeholder="0"
                        value={materialQuantity}
                        onChange={(e) => setMaterialQuantity(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Einheit</Label>
                      <select
                        className="w-full h-10 px-3 rounded-md border border-input bg-background"
                        value={materialUnit}
                        onChange={(e) => setMaterialUnit(e.target.value)}
                      >
                        <option value="l">Liter</option>
                        <option value="kg">kg</option>
                        <option value="sack">Sack</option>
                        <option value="stück">Stück</option>
                      </select>
                    </div>
                  </div>
                  <Button onClick={handleAddMaterial} className="w-full">
                    Hinzufügen
                  </Button>
                  
                  {/* Current Materials */}
                  {operation.materials.length > 0 && (
                    <div className="mt-4">
                      <h4 className="font-medium mb-2">Erfasste Materialien</h4>
                      <div className="space-y-2">
                        {operation.materials.map((m) => (
                          <div key={m.id} className="flex justify-between text-sm bg-gray-100 p-2 rounded">
                            <span>{m.name}</span>
                            <span className="font-medium">{m.quantity} {m.unit}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
            
            <Button
              variant="outline"
              className="flex flex-col h-20 gap-1 bg-gray-800 border-gray-700 hover:bg-gray-700"
              onClick={getCurrentLocation}
            >
              <Navigation className="h-6 w-6" />
              <span className="text-xs">GPS</span>
            </Button>
            
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  className="flex flex-col h-20 gap-1 bg-gray-800 border-gray-700 hover:bg-gray-700"
                >
                  <FileText className="h-6 w-6" />
                  <span className="text-xs">Notiz</span>
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Notiz hinzufügen</SheetTitle>
                </SheetHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>Notiz</Label>
                    <textarea
                      className="w-full h-32 px-3 py-2 rounded-md border border-input bg-background"
                      placeholder="Freitextnotiz..."
                      value={noteInput}
                      onChange={(e) => setNoteInput(e.target.value)}
                    />
                  </div>
                  <Button onClick={handleAddNote} className="w-full">
                    Speichern
                  </Button>
                  
                  {/* Current Notes */}
                  {operation.notes.length > 0 && (
                    <div className="mt-4">
                      <h4 className="font-medium mb-2">Notizen</h4>
                      <div className="space-y-2">
                        {operation.notes.map((n, i) => (
                          <div key={i} className="text-sm bg-gray-100 p-2 rounded">
                            {n}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
          
          {/* Notes & Photos Summary */}
          {(operation.materials.length > 0 || operation.notes.length > 0 || operation.photos.length > 0) && (
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-gray-300">Aktuelle Aufzeichnung</CardTitle>
              </CardHeader>
              <CardContent className="text-sm">
                <div className="flex gap-4 flex-wrap">
                  {operation.materials.length > 0 && (
                    <div className="flex items-center gap-1">
                      <Package className="h-4 w-4 text-blue-400" />
                      <span>{operation.materials.length} Materialien</span>
                    </div>
                  )}
                  {operation.notes.length > 0 && (
                    <div className="flex items-center gap-1">
                      <FileText className="h-4 w-4 text-yellow-400" />
                      <span>{operation.notes.length} Notizen</span>
                    </div>
                  )}
                  {operation.photos.length > 0 && (
                    <div className="flex items-center gap-1">
                      <CameraIcon className="h-4 w-4 text-purple-400" />
                      <span>{operation.photos.length} Fotos</span>
                    </div>
                  )}
                  {operation.gpsTrack.length > 0 && (
                    <div className="flex items-center gap-1">
                      <Navigation className="h-4 w-4 text-green-400" />
                      <span>{operation.gpsTrack.length} GPS-Punkte</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
          
          {/* GPS Status */}
          {operation.gpsTrack.length > 0 && (
            <div className="text-xs text-gray-500 text-center">
              GPS-Tracking aktiv • Letzte Position: {formatTime(operation.gpsTrack[operation.gpsTrack.length - 1].timestamp)}
            </div>
          )}
        </div>
      </div>

      {/* Stop Button */}
      <div className="p-4 bg-gray-800">
        <div className="max-w-lg mx-auto">
          <div className="flex gap-3">
            <Button
              variant={operation.isPaused ? "default" : "outline"}
              size="lg"
              className={`flex-1 h-16 text-lg ${
                operation.isPaused 
                  ? 'bg-green-600 hover:bg-green-700' 
                  : 'bg-gray-700 border-gray-600 hover:bg-gray-600'
              }`}
              onClick={handlePause}
            >
              {operation.isPaused ? (
                <>
                  <Play className="h-6 w-6 mr-2" />
                  Fortsetzen
                </>
              ) : (
                <>
                  <Pause className="h-6 w-6 mr-2" />
                  Pause
                </>
              )}
            </Button>
            
            <AlertDialog open={showStopConfirm} onOpenChange={setShowStopConfirm}>
              <AlertDialogTrigger asChild>
                <Button
                  variant="destructive"
                  size="lg"
                  className="flex-1 h-16 text-lg bg-red-600 hover:bg-red-700"
                >
                  <Square className="h-6 w-6 mr-2" />
                  Stopp
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Auftrag beenden?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Möchten Sie diesen Auftrag wirklich beenden?
                    <br /><br />
                    <strong>Zusammenfassung:</strong>
                    <br />• Dauer: {elapsedTime}
                    <br />• Materialien: {operation.materials.length}
                    <br />• Notizen: {operation.notes.length}
                    <br />• Fotos: {operation.photos.length}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Zurück</AlertDialogCancel>
                  <AlertDialogAction onClick={handleStop} className="bg-red-600 hover:bg-red-700">
                    Ja, beenden
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </div>
    </div>
  );
}
