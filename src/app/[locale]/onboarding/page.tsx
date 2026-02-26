'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { 
  Building2, 
  User, 
  MapPin, 
  Tractor, 
  ChevronRight, 
  ChevronLeft,
  Check,
  Loader2
} from 'lucide-react';

interface OnboardingData {
  // Step 1: Company
  companyName: string;
  companyAddress: string;
  companyNumber: string; // Betriebsnummer
  // Step 2: Admin User
  adminFirstName: string;
  adminLastName: string;
  adminEmail: string;
  adminPhone: string;
  // Step 3: Location
  state: string;
  region: string;
  // Step 4: First Field
  fieldName: string;
  fieldArea: number;
  // Step 5: First Machine
  machineName: string;
  machineType: string;
}

const STEPS = [
  { id: 1, title: 'Betriebsdaten', description: 'Name und Adresse', icon: Building2 },
  { id: 2, title: 'Admin-Konto', description: 'Ihr Zugang', icon: User },
  { id: 3, title: 'Standort', description: 'Bundesland und Region', icon: MapPin },
  { id: 4, title: 'Erster Schlag', description: 'Fläche anlegen', icon: MapPin },
  { id: 5, title: 'Erste Maschine', description: 'Fuhrpark einrichten', icon: Tractor },
];

const GERMAN_STATES = [
  { value: 'TH', label: 'Thüringen' },
  { value: 'BY', label: 'Bayern' },
  { value: 'NI', label: 'Niedersachsen' },
  { value: 'NW', label: 'Nordrhein-Westfalen' },
  { value: 'ST', label: 'Sachsen-Anhalt' },
  { value: 'BB', label: 'Brandenburg' },
  { value: 'SH', label: 'Schleswig-Holstein' },
  { value: 'MV', label: 'Mecklenburg-Vorpommern' },
  { value: 'HE', label: 'Hessen' },
  { value: 'RP', label: 'Rheinland-Pfalz' },
  { value: 'SL', label: 'Saarland' },
  { value: 'SN', label: 'Sachsen' },
  { value: 'BW', label: 'Baden-Württemberg' },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<OnboardingData>({
    companyName: '',
    companyAddress: '',
    companyNumber: '',
    adminFirstName: '',
    adminLastName: '',
    adminEmail: '',
    adminPhone: '',
    state: 'TH',
    region: '',
    fieldName: '',
    fieldArea: 0,
    machineName: '',
    machineType: 'Traktor',
  });

  const totalSteps = STEPS.length;
  const progress = (currentStep / totalSteps) * 100;

  const updateData = (field: keyof OnboardingData, value: string | number) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return data.companyName.length >= 2 && data.companyAddress.length >= 5;
      case 2:
        return data.adminFirstName.length >= 2 && data.adminLastName.length >= 2 && 
               data.adminEmail.includes('@');
      case 3:
        return data.state.length > 0;
      case 4:
        return data.fieldName.length >= 2 && data.fieldArea > 0;
      case 5:
        return data.machineName.length >= 2;
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleComplete = async () => {
    setLoading(true);
    try {
      // Simulate company creation
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In a real app, this would create the company and login
      // For demo, just redirect to dashboard
      router.push('/de');
    } catch (error) {
      console.error('Onboarding failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="companyName">Betriebsname *</Label>
              <Input
                id="companyName"
                placeholder="z.B. Bauernhof Müller"
                value={data.companyName}
                onChange={(e) => updateData('companyName', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="companyAddress">Adresse *</Label>
              <Input
                id="companyAddress"
                placeholder="Straße, PLZ Ort"
                value={data.companyAddress}
                onChange={(e) => updateData('companyAddress', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="companyNumber">Betriebsnummer (InVeKoS)</Label>
              <Input
                id="companyNumber"
                placeholder="z.B. 1234567890"
                value={data.companyNumber}
                onChange={(e) => updateData('companyNumber', e.target.value)}
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="adminFirstName">Vorname *</Label>
                <Input
                  id="adminFirstName"
                  placeholder="Max"
                  value={data.adminFirstName}
                  onChange={(e) => updateData('adminFirstName', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="adminLastName">Nachname *</Label>
                <Input
                  id="adminLastName"
                  placeholder="Müller"
                  value={data.adminLastName}
                  onChange={(e) => updateData('adminLastName', e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="adminEmail">E-Mail *</Label>
              <Input
                id="adminEmail"
                type="email"
                placeholder="max.mueller@beispiel.de"
                value={data.adminEmail}
                onChange={(e) => updateData('adminEmail', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="adminPhone">Telefon</Label>
              <Input
                id="adminPhone"
                type="tel"
                placeholder="+49 123 456789"
                value={data.adminPhone}
                onChange={(e) => updateData('adminPhone', e.target.value)}
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Bundesland *</Label>
              <RadioGroup
                value={data.state}
                onValueChange={(value) => updateData('state', value)}
                className="grid grid-cols-2 gap-2"
              >
                {GERMAN_STATES.map((state) => (
                  <div key={state.value} className="flex items-center space-x-2">
                    <RadioGroupItem value={state.value} id={state.value} />
                    <Label htmlFor={state.value} className="cursor-pointer">
                      {state.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
            <div className="space-y-2">
              <Label htmlFor="region">Gemarkung</Label>
              <Input
                id="region"
                placeholder="z.B. Erfurt"
                value={data.region}
                onChange={(e) => updateData('region', e.target.value)}
              />
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fieldName">Schlagname *</Label>
              <Input
                id="fieldName"
                placeholder="z.B. Mühlfeld Ost"
                value={data.fieldName}
                onChange={(e) => updateData('fieldName', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fieldArea">Fläche (ha) *</Label>
              <Input
                id="fieldArea"
                type="number"
                placeholder="z.B. 12.5"
                min={0}
                step={0.1}
                value={data.fieldArea || ''}
                onChange={(e) => updateData('fieldArea', parseFloat(e.target.value) || 0)}
              />
            </div>
            <p className="text-sm text-muted-foreground">
              Sie können später weitere Schläge und Flurstücke hinzufügen.
            </p>
          </div>
        );

      case 5:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="machineName">Bezeichnung *</Label>
              <Input
                id="machineName"
                placeholder="z.B. John Deere 6130R"
                value={data.machineName}
                onChange={(e) => updateData('machineName', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="machineType">Maschinentyp</Label>
              <RadioGroup
                value={data.machineType}
                onValueChange={(value) => updateData('machineType', value)}
                className="grid grid-cols-2 gap-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Traktor" id="traktor" />
                  <Label htmlFor="traktor" className="cursor-pointer">Traktor</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Ernte" id="ernte" />
                  <Label htmlFor="ernte" className="cursor-pointer">Erntemaschine</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Spritze" id="spritze" />
                  <Label htmlFor="spritze" className="cursor-pointer">Pflanzenschutzspritze</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Bodenbearbeitung" id="boden" />
                  <Label htmlFor="boden" className="cursor-pointer">Bodenbearbeitung</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const currentStepInfo = STEPS[currentStep - 1];
  const StepIcon = currentStepInfo.icon;

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-amber-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="space-y-4">
          {/* Progress */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Schritt {currentStep} von {totalSteps}</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
          
          {/* Step Title */}
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-100 text-green-700">
              <StepIcon className="h-5 w-5" />
            </div>
            <div>
              <CardTitle>{currentStepInfo.title}</CardTitle>
              <CardDescription>{currentStepInfo.description}</CardDescription>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {renderStepContent()}
          
          {/* Navigation */}
          <div className="flex justify-between pt-4">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 1}
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Zurück
            </Button>
            
            {currentStep < totalSteps ? (
              <Button
                onClick={handleNext}
                disabled={!canProceed()}
              >
                Weiter
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={handleComplete}
                disabled={!canProceed() || loading}
                className="bg-green-600 hover:bg-green-700"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Einrichten...
                  </>
                ) : (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Abschließen
                  </>
                )}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
