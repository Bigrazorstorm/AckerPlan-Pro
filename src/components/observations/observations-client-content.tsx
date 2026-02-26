
'use client'

import { React, useEffect, useState, useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import { useTranslations } from "next-intl"
import { useToast } from '@/hooks/use-toast'
import { Observation, Field, ObservationType } from '@/services/types'
import { addObservation, deleteObservation, updateObservation } from '@/app/observations/actions'
import { useSession } from '@/context/session-context'
import dataService from '@/services'
import { format, parseISO } from "date-fns"
import { de, enUS } from 'date-fns/locale'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import dynamic from 'next/dynamic'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { MoreHorizontal, PlusCircle, Calendar as CalendarIcon, Camera, MapPin, LocateFixed, X } from "lucide-react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetTrigger } from '@/components/ui/sheet'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { Skeleton } from '../ui/skeleton'
import { cn } from '@/lib/utils'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { Slider } from '@/components/ui/slider'

const ObservationLocationMap = dynamic(() => import('@/components/observations/observation-location-map').then(mod => mod.ObservationLocationMap), {
  ssr: false,
  loading: () => <Skeleton className="w-full h-48 rounded-lg" />
});

const ObservationLocationPicker = dynamic(() => import('@/components/observations/observation-location-picker').then(mod => mod.ObservationLocationPicker), {
  ssr: false,
  loading: () => <Skeleton className="w-full h-48 rounded-lg" />
});

const initialState = {
  message: '',
  errors: {},
}

const getFieldCenter = (field?: Field): { lat: number; lng: number } | undefined => {
  if (!field?.geometry || field.geometry.length === 0) return undefined;

  const validPoints = field.geometry.filter(
    (point) => Array.isArray(point) && point.length >= 2 && Number.isFinite(point[0]) && Number.isFinite(point[1])
  ) as number[][];

  if (validPoints.length === 0) return undefined;

  const sums = validPoints.reduce(
    (acc, [lat, lng]) => ({ lat: acc.lat + lat, lng: acc.lng + lng }),
    { lat: 0, lng: 0 }
  );

  return {
    lat: sums.lat / validPoints.length,
    lng: sums.lng / validPoints.length,
  };
};

function SubmitButton({isEdit = false}: {isEdit?: boolean}) {
  const { pending } = useFormStatus()
  const t = useTranslations('ObservationsPage.addObservationForm');
  const tEdit = useTranslations('ObservationsPage.editObservationForm');

  const buttonText = isEdit ? tEdit('submit') : t('submit');
  const submittingText = isEdit ? tEdit('submitting') : t('submitting');

  return (
    <Button type="submit" aria-disabled={pending}>
      {pending ? submittingText : buttonText}
    </Button>
  )
}

function EditObservationForm({ closeSheet, tenantId, companyId, observation, fields }: { closeSheet: () => void; tenantId: string; companyId: string; observation: Observation; fields: Field[] }) {
  const [state, formAction] = useActionState(updateObservation, initialState);
  const { toast } = useToast();
  const t = useTranslations('ObservationsPage.editObservationForm');
  const tShared = useTranslations('ObservationsPage.addObservationForm');
  const tObservationTypes = useTranslations('ObservationTypes');
  const tDamageCauses = useTranslations('DamageCauses');
  const { locale } = useParams<{ locale: string }>();

  const [date, setDate] = useState<Date | undefined>(observation.date ? parseISO(observation.date) : undefined);
  const [intensity, setIntensity] = useState(observation.intensity);
  const [observationType, setObservationType] = useState<ObservationType | ''>(observation.observationType);
  const [damageCause, setDamageCause] = useState<'Wildlife' | 'Weather' | 'Other' | ''>(observation.damageCause || '');
  const [latitude, setLatitude] = useState<number | undefined>(observation.latitude);
  const [longitude, setLongitude] = useState<number | undefined>(observation.longitude);
  const [isLocating, setIsLocating] = useState(false);
  const observationField = fields.find((field) => field.name === observation.field);
  const fieldCenter = getFieldCenter(observationField);
  const focusLatLng = latitude == null && longitude == null ? fieldCenter : undefined;

  const observationTypes: ObservationType[] = ['Routine', 'Pest', 'NutrientDeficiency', 'Damage', 'Other'];
  const damageCauses: ('Wildlife' | 'Weather' | 'Other')[] = ['Wildlife', 'Weather', 'Other'];

  useEffect(() => {
    if (state.message && Object.keys(state.errors).length === 0) {
      toast({
        title: t('successToastTitle'),
        description: t('successToastDescription'),
      });
      closeSheet();
    } else if (state.message && Object.keys(state.errors).length > 0) {
      toast({
        variant: 'destructive',
        title: t('errorToastTitle'),
        description: state.message,
      });
    }
  }, [state, toast, closeSheet, t]);

  const handleUseGps = () => {
    if (!navigator.geolocation) {
      toast({
        variant: 'destructive',
        title: tShared('locationErrorTitle'),
        description: tShared('locationUnsupported'),
      });
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitude(position.coords.latitude);
        setLongitude(position.coords.longitude);
        setIsLocating(false);
      },
      (error) => {
        const description = error.code === error.PERMISSION_DENIED
          ? tShared('locationPermissionDenied')
          : tShared('locationErrorDescription');
        toast({
          variant: 'destructive',
          title: tShared('locationErrorTitle'),
          description,
        });
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleClearLocation = () => {
    setLatitude(undefined);
    setLongitude(undefined);
  };
  
  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="tenantId" value={tenantId} />
      <input type="hidden" name="companyId" value={companyId} />
      <input type="hidden" name="id" value={observation.id} />
      <input type="hidden" name="date" value={date ? format(date, "yyyy-MM-dd") : ""} />
      <input type="hidden" name="intensity" value={intensity} />
      <input type="hidden" name="latitude" value={latitude ?? ''} />
      <input type="hidden" name="longitude" value={longitude ?? ''} />

      <div className="space-y-2">
        <Label htmlFor="title">{tShared('titleLabel')}</Label>
        <Input id="title" name="title" required defaultValue={observation.title} />
        {state.errors?.title && <p className="text-sm text-destructive">{state.errors.title.join(', ')}</p>}
      </div>
      
       <div className="space-y-2">
        <Label htmlFor="description">{tShared('descriptionLabel')}</Label>
        <Textarea id="description" name="description" required defaultValue={observation.description} />
        {state.errors?.description && <p className="text-sm text-destructive">{state.errors.description.join(', ')}</p>}
      </div>

      <div className="space-y-2">
          <Label htmlFor="field">{t('fieldLabel')}</Label>
          <Input id="field" name="field" readOnly disabled value={observation.field} />
      </div>
      
      <div className="space-y-2">
          <Label htmlFor="observationType">{tShared('observationTypeLabel')}</Label>
          <Select name="observationType" required onValueChange={(value) => setObservationType(value as ObservationType)} defaultValue={observation.observationType}>
            <SelectTrigger>
              <SelectValue placeholder={tShared('observationTypePlaceholder')} />
            </SelectTrigger>
            <SelectContent>
              {observationTypes.map((type) => (
                  <SelectItem key={type} value={type}>{tObservationTypes(type)}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {state.errors?.observationType && <p className="text-sm text-destructive">{state.errors.observationType.join(', ')}</p>}
      </div>

       {observationType === 'Damage' && (
        <div className="space-y-4 rounded-md border p-4">
            <div className="space-y-2">
                <Label htmlFor="damageCause">{tShared('damageCauseLabel')}</Label>
                <Select name="damageCause" onValueChange={(value) => setDamageCause(value as any)} defaultValue={observation.damageCause}>
                    <SelectTrigger>
                        <SelectValue placeholder={tShared('damageCausePlaceholder')} />
                    </SelectTrigger>
                    <SelectContent>
                        {damageCauses.map((cause) => (
                            <SelectItem key={cause} value={cause}>{tDamageCauses(cause)}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                {state.errors?.damageCause && <p className="text-sm text-destructive">{state.errors.damageCause.join(', ')}</p>}
            </div>
            {damageCause === 'Wildlife' && (
                 <div className="space-y-2">
                    <Label htmlFor="animal">{tShared('animalLabel')}</Label>
                    <Input id="animal" name="animal" placeholder={tShared('animalPlaceholder')} defaultValue={observation.animal} />
                    {state.errors?.animal && <p className="text-sm text-destructive">{state.errors.animal.join(', ')}</p>}
                 </div>
            )}
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="affectedArea">{tShared('affectedAreaLabel')}</Label>
                    <Input id="affectedArea" name="affectedArea" type="number" step="any" placeholder="50" defaultValue={observation.affectedArea} />
                    {state.errors?.affectedArea && <p className="text-sm text-destructive">{state.errors.affectedArea.join(', ')}</p>}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="damagePercentage">{tShared('damagePercentageLabel')}</Label>
                    <Input id="damagePercentage" name="damagePercentage" type="number" step="1" min="0" max="100" placeholder="15" defaultValue={observation.damagePercentage} />
                    {state.errors?.damagePercentage && <p className="text-sm text-destructive">{state.errors.damagePercentage.join(', ')}</p>}
                </div>
            </div>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="photoUrl">{tShared('photoUrlLabel')}</Label>
        <Input id="photoUrl" name="photoUrl" placeholder={tShared('photoUrlPlaceholder')} defaultValue={observation.photoUrl} />
        {state.errors?.photoUrl && <p className="text-sm text-destructive">{state.errors.photoUrl.join(', ')}</p>}
      </div>

      <div className="space-y-3">
        <Label>{tShared('locationLabel')}</Label>
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="outline" size="sm" onClick={handleUseGps} disabled={isLocating}>
            <LocateFixed className="h-4 w-4 mr-2" />
            {isLocating ? tShared('locationLocating') : tShared('useGpsButton')}
          </Button>
          <Button type="button" variant="ghost" size="sm" onClick={handleClearLocation} disabled={latitude == null || longitude == null}>
            <X className="h-4 w-4 mr-2" />
            {tShared('clearLocationButton')}
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">
          {latitude != null && longitude != null
            ? tShared('locationSetLabel', { lat: latitude.toFixed(5), lng: longitude.toFixed(5) })
            : tShared('locationEmptyHint')}
        </p>
        <div className="aspect-video w-full overflow-hidden rounded-md border">
          <ObservationLocationPicker
            latitude={latitude}
            longitude={longitude}
            focusLatLng={focusLatLng}
            fieldGeometry={observationField?.geometry}
            onChange={(lat, lng) => {
              setLatitude(lat);
              setLongitude(lng);
            }}
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-4">
        <div className="space-y-2">
          <Label htmlFor="bbchStage">{tShared('bbchStageLabel')}</Label>
          <Input id="bbchStage" name="bbchStage" type="number" required defaultValue={observation.bbchStage} />
          {state.errors?.bbchStage && <p className="text-sm text-destructive">{state.errors.bbchStage.join(', ')}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="date">{tShared('dateLabel')}</Label>
        <Popover>
            <PopoverTrigger asChild>
            <Button
                variant={"outline"}
                className={cn(
                "w-full justify-start text-left font-normal",
                !date && "text-muted-foreground"
                )}
            >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP", { locale: locale === 'de' ? de : enUS }) : <span>{tShared('datePlaceholder')}</span>}
            </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
            <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
            />
            </PopoverContent>
        </Popover>
        {state.errors?.date && <p className="text-sm text-destructive">{state.errors.date.join(', ')}</p>}
      </div>

       <div className="space-y-3">
          <div className="flex justify-between">
            <Label htmlFor="intensity">{tShared('intensityLabel')}</Label>
            <span className="text-sm text-muted-foreground font-medium">{intensity}</span>
          </div>
          <Slider
            name="intensity-slider"
            defaultValue={[intensity]}
            min={1}
            max={5}
            step={1}
            onValueChange={(value) => setIntensity(value[0])}
          />
          {state.errors?.intensity && <p className="text-sm text-destructive">{state.errors.intensity.join(', ')}</p>}
        </div>

      <SubmitButton isEdit={true} />
    </form>
  );
}


function AddObservationForm({ closeSheet, tenantId, companyId, fields }: { closeSheet: () => void; tenantId: string; companyId: string; fields: Field[] }) {
  const [state, formAction] = useActionState(addObservation, initialState)
  const { toast } = useToast()
  const t = useTranslations('ObservationsPage.addObservationForm');
  const tObservationTypes = useTranslations('ObservationTypes');
  const tDamageCauses = useTranslations('DamageCauses');
  const [date, setDate] = useState<Date>()
  const [intensity, setIntensity] = useState(3);
  const [observationType, setObservationType] = useState<ObservationType | ''>('');
  const [damageCause, setDamageCause] = useState<'Wildlife' | 'Weather' | 'Other' | ''>('');
  const [latitude, setLatitude] = useState<number | undefined>(undefined);
  const [longitude, setLongitude] = useState<number | undefined>(undefined);
  const [isLocating, setIsLocating] = useState(false);
  const [selectedFieldName, setSelectedFieldName] = useState<string | undefined>(undefined);
  const selectedField = fields.find((field) => field.name === selectedFieldName);
  const fieldCenter = getFieldCenter(selectedField);
  const focusLatLng = latitude == null && longitude == null ? fieldCenter : undefined;
  const { locale } = useParams<{ locale: string }>();

  const observationTypes: ObservationType[] = ['Routine', 'Pest', 'NutrientDeficiency', 'Damage', 'Other'];
  const damageCauses: ('Wildlife' | 'Weather' | 'Other')[] = ['Wildlife', 'Weather', 'Other'];

  useEffect(() => {
    if (state.message && Object.keys(state.errors).length === 0) {
      toast({
        title: t('successToastTitle'),
        description: t('successToastDescription'),
      })
      closeSheet();
    } else if (state.message && Object.keys(state.errors).length > 0) {
      toast({
        variant: 'destructive',
        title: t('errorToastTitle'),
        description: state.message,
      })
    }
  }, [state, toast, closeSheet, t]);

  const handleUseGps = () => {
    if (!navigator.geolocation) {
      toast({
        variant: 'destructive',
        title: t('locationErrorTitle'),
        description: t('locationUnsupported'),
      });
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitude(position.coords.latitude);
        setLongitude(position.coords.longitude);
        setIsLocating(false);
      },
      (error) => {
        const description = error.code === error.PERMISSION_DENIED
          ? t('locationPermissionDenied')
          : t('locationErrorDescription');
        toast({
          variant: 'destructive',
          title: t('locationErrorTitle'),
          description,
        });
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleClearLocation = () => {
    setLatitude(undefined);
    setLongitude(undefined);
  };
  
  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="tenantId" value={tenantId} />
      <input type="hidden" name="companyId" value={companyId} />
      <input type="hidden" name="date" value={date ? format(date, "yyyy-MM-dd") : ""} />
      <input type="hidden" name="intensity" value={intensity} />
      <input type="hidden" name="latitude" value={latitude ?? ''} />
      <input type="hidden" name="longitude" value={longitude ?? ''} />

      <div className="space-y-2">
        <Label htmlFor="title">{t('titleLabel')}</Label>
        <Input id="title" name="title" required placeholder={t('titlePlaceholder')} />
        {state.errors?.title && <p className="text-sm text-destructive">{state.errors.title.join(', ')}</p>}
      </div>
      
       <div className="space-y-2">
        <Label htmlFor="description">{t('descriptionLabel')}</Label>
        <Textarea id="description" name="description" required placeholder={t('descriptionPlaceholder')} />
        {state.errors?.description && <p className="text-sm text-destructive">{state.errors.description.join(', ')}</p>}
      </div>
      
      <div className="space-y-2">
          <Label htmlFor="observationType">{t('observationTypeLabel')}</Label>
          <Select name="observationType" required onValueChange={(value) => setObservationType(value as ObservationType)}>
            <SelectTrigger>
              <SelectValue placeholder={t('observationTypePlaceholder')} />
            </SelectTrigger>
            <SelectContent>
              {observationTypes.map((type) => (
                  <SelectItem key={type} value={type}>{tObservationTypes(type)}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {state.errors?.observationType && <p className="text-sm text-destructive">{state.errors.observationType.join(', ')}</p>}
      </div>

       {observationType === 'Damage' && (
        <div className="space-y-4 rounded-md border p-4">
            <div className="space-y-2">
                <Label htmlFor="damageCause">{t('damageCauseLabel')}</Label>
                <Select name="damageCause" onValueChange={(value) => setDamageCause(value as any)}>
                    <SelectTrigger>
                        <SelectValue placeholder={t('damageCausePlaceholder')} />
                    </SelectTrigger>
                    <SelectContent>
                        {damageCauses.map((cause) => (
                            <SelectItem key={cause} value={cause}>{tDamageCauses(cause)}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                {state.errors?.damageCause && <p className="text-sm text-destructive">{state.errors.damageCause.join(', ')}</p>}
            </div>
            {damageCause === 'Wildlife' && (
                 <div className="space-y-2">
                    <Label htmlFor="animal">{t('animalLabel')}</Label>
                    <Input id="animal" name="animal" placeholder={t('animalPlaceholder')} />
                    {state.errors?.animal && <p className="text-sm text-destructive">{state.errors.animal.join(', ')}</p>}
                 </div>
            )}
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="affectedArea">{t('affectedAreaLabel')}</Label>
                    <Input id="affectedArea" name="affectedArea" type="number" step="any" placeholder="50" />
                    {state.errors?.affectedArea && <p className="text-sm text-destructive">{state.errors.affectedArea.join(', ')}</p>}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="damagePercentage">{t('damagePercentageLabel')}</Label>
                    <Input id="damagePercentage" name="damagePercentage" type="number" step="1" min="0" max="100" placeholder="15" />
                    {state.errors?.damagePercentage && <p className="text-sm text-destructive">{state.errors.damagePercentage.join(', ')}</p>}
                </div>
            </div>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="photoUrl">{t('photoUrlLabel')}</Label>
        <Input id="photoUrl" name="photoUrl" placeholder={t('photoUrlPlaceholder')} />
        {state.errors?.photoUrl && <p className="text-sm text-destructive">{state.errors.photoUrl.join(', ')}</p>}
      </div>

      <div className="space-y-3">
        <Label>{t('locationLabel')}</Label>
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="outline" size="sm" onClick={handleUseGps} disabled={isLocating}>
            <LocateFixed className="h-4 w-4 mr-2" />
            {isLocating ? t('locationLocating') : t('useGpsButton')}
          </Button>
          <Button type="button" variant="ghost" size="sm" onClick={handleClearLocation} disabled={latitude == null || longitude == null}>
            <X className="h-4 w-4 mr-2" />
            {t('clearLocationButton')}
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">
          {latitude != null && longitude != null
            ? t('locationSetLabel', { lat: latitude.toFixed(5), lng: longitude.toFixed(5) })
            : t('locationEmptyHint')}
        </p>
        <div className="aspect-video w-full overflow-hidden rounded-md border">
          <ObservationLocationPicker
            latitude={latitude}
            longitude={longitude}
            focusLatLng={focusLatLng}
            fieldGeometry={selectedField?.geometry}
            onChange={(lat, lng) => {
              setLatitude(lat);
              setLongitude(lng);
            }}
          />
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="bbchStage">{t('bbchStageLabel')}</Label>
          <Input id="bbchStage" name="bbchStage" type="number" required placeholder={t('bbchStagePlaceholder')} />
          {state.errors?.bbchStage && <p className="text-sm text-destructive">{state.errors.bbchStage.join(', ')}</p>}
        </div>
        <div className="space-y-2">
            <Label htmlFor="field">{t('fieldLabel')}</Label>
            <Select name="field" required onValueChange={(value) => setSelectedFieldName(value)}>
              <SelectTrigger>
                <SelectValue placeholder={t('fieldPlaceholder')} />
              </SelectTrigger>
              <SelectContent>
                {fields.map((field) => (
                    <SelectItem key={field.id} value={field.name}>{field.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {state.errors?.field && <p className="text-sm text-destructive">{state.errors.field.join(', ')}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="date">{t('dateLabel')}</Label>
        <Popover>
            <PopoverTrigger asChild>
            <Button
                variant={"outline"}
                className={cn(
                "w-full justify-start text-left font-normal",
                !date && "text-muted-foreground"
                )}
            >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP", { locale: locale === 'de' ? de : enUS }) : <span>{t('datePlaceholder')}</span>}
            </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
            <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
            />
            </PopoverContent>
        </Popover>
        {state.errors?.date && <p className="text-sm text-destructive">{state.errors.date.join(', ')}</p>}
      </div>

       <div className="space-y-3">
          <div className="flex justify-between">
            <Label htmlFor="intensity">{t('intensityLabel')}</Label>
            <span className="text-sm text-muted-foreground font-medium">{intensity}</span>
          </div>
          <Slider
            name="intensity-slider"
            defaultValue={[3]}
            min={1}
            max={5}
            step={1}
            onValueChange={(value) => setIntensity(value[0])}
          />
          {state.errors?.intensity && <p className="text-sm text-destructive">{state.errors.intensity.join(', ')}</p>}
        </div>

      <SubmitButton />
    </form>
  )
}

function ObservationsSkeleton() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
          <div/>
          <Skeleton className="h-9 w-44" />
      </CardHeader>
      <CardContent>
          <Table>
            <TableHeader>
                <TableRow>
                    <TableHead className="w-1/3"><Skeleton className="h-4 w-24" /></TableHead>
                    <TableHead><Skeleton className="h-4 w-24" /></TableHead>
                    <TableHead><Skeleton className="h-4 w-24" /></TableHead>
                    <TableHead><Skeleton className="h-4 w-16" /></TableHead>
                    <TableHead><Skeleton className="h-4 w-16" /></TableHead>
                    <TableHead><span className="sr-only">Actions</span></TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {[...Array(5)].map((_, i) => (
                      <TableRow key={i}>
                        <TableCell><Skeleton className="h-5 w-48" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                        <TableCell><Skeleton className="h-8 w-10 rounded-md" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-10 mx-auto" /></TableCell>
                        <TableCell><Skeleton className="h-8 w-8" /></TableCell>
                      </TableRow>
                ))}
            </TableBody>
          </Table>
      </CardContent>
  </Card>
  )
}

export function ObservationsClientContent() {
  const t = useTranslations('ObservationsPage');
  const tObservationTypes = useTranslations('ObservationTypes');
  const tDamageCauses = useTranslations('DamageCauses');
  const { toast } = useToast();
  const [isAddSheetOpen, setAddSheetOpen] = useState(false);
  const [isEditSheetOpen, setEditSheetOpen] = useState(false);
  const { activeCompany, loading: sessionLoading, activeRole } = useSession();
  const [observations, setObservations] = useState<Observation[]>([]);
  const [fields, setFields] = useState<Field[]>([]);
  const [loading, setLoading] = useState(true);
  const { locale } = useParams<{ locale: string }>();
  const [observationToView, setObservationToView] = useState<Observation | null>(null);
  const [observationToDelete, setObservationToDelete] = useState<Observation | null>(null);
  const [observationToEdit, setObservationToEdit] = useState<Observation | null>(null);
  
  const canAdd = activeRole !== 'Jäger' && activeRole !== 'Leser';
  const canEdit = activeRole !== 'Jäger' && activeRole !== 'Leser';
  const canDelete = activeRole === 'Firmen Admin' || activeRole === 'Tenant Admin';

  useEffect(() => {
    if (activeCompany) {
      const fetchData = async () => {
        setLoading(true);
        const [observationsData, fieldsData] = await Promise.all([
            dataService.getObservations(activeCompany.tenantId, activeCompany.id),
            dataService.getFields(activeCompany.tenantId, activeCompany.id),
        ]);
        
        if (activeRole === 'Jäger') {
            setObservations(observationsData.filter(o => o.observationType === 'Damage' && o.damageCause === 'Wildlife'));
        } else {
            setObservations(observationsData);
        }

        setFields(fieldsData);
        setLoading(false);
      }
      fetchData();
    }
  }, [activeCompany, isAddSheetOpen, observationToDelete, isEditSheetOpen, activeRole]);

  const handleDelete = async () => {
    if (observationToDelete && activeCompany) {
      const result = await deleteObservation(observationToDelete.id, activeCompany.tenantId, activeCompany.id);
      if (result.message.includes('successfully')) {
        toast({
          title: t('deleteSuccessToastTitle'),
          description: result.message,
        });
      } else {
        toast({
          variant: 'destructive',
          title: t('deleteErrorToastTitle'),
          description: result.message,
        });
      }
      setObservationToDelete(null); // Close dialog
    }
  };

  const handleEdit = (observation: Observation) => {
    setObservationToEdit(observation);
    setEditSheetOpen(true);
  };


  const dateFormatter = (dateString: string) => {
    if (!dateString) return '';
    try {
      return format(parseISO(dateString), 'PP', { locale: locale === 'de' ? de : enUS });
    } catch (e) {
      return dateString;
    }
  };
  
  if (sessionLoading || loading) {
      return <ObservationsSkeleton />;
  }

  return (
    <>
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div/>
        {canAdd && (
          <Sheet open={isAddSheetOpen} onOpenChange={setAddSheetOpen}>
            <SheetTrigger asChild>
              <Button size="sm" className="gap-1">
                <PlusCircle className="h-4 w-4" />
                {t('addObservation')}
              </Button>
            </SheetTrigger>
            <SheetContent className="w-full sm:max-w-md overflow-y-auto">
              <SheetHeader>
                <SheetTitle>{t('addObservationSheetTitle')}</SheetTitle>
              </SheetHeader>
              <div className="py-4">
                {activeCompany && <AddObservationForm closeSheet={() => setAddSheetOpen(false)} tenantId={activeCompany.tenantId} companyId={activeCompany.id} fields={fields} />}
              </div>
            </SheetContent>
          </Sheet>
        )}
      </CardHeader>
      <CardContent>
         {observations.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('tableHeaderTitle')}</TableHead>
                <TableHead>{t('tableHeaderType')}</TableHead>
                <TableHead>{t('tableHeaderField')}</TableHead>
                <TableHead>{t('tableHeaderDate')}</TableHead>
                <TableHead>{t('tableHeaderPhoto')}</TableHead>
                <TableHead className="text-center">{t('tableHeaderLocation')}</TableHead>
                <TableHead><span className="sr-only">{t('actions')}</span></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {observations.map((obs) => (
                <TableRow key={obs.id}>
                  <TableCell className="font-medium">{obs.title}</TableCell>
                  <TableCell>{tObservationTypes(obs.observationType)}</TableCell>
                  <TableCell>{obs.field}</TableCell>
                  <TableCell>{dateFormatter(obs.date)}</TableCell>
                  <TableCell>
                    {obs.photoUrl ? (
                       <Image src={obs.photoUrl} alt={obs.title} width={40} height={40} className="rounded-md aspect-square object-cover" />
                    ) : (
                      <div className="w-10 h-10 flex items-center justify-center bg-muted rounded-md">
                        <Camera className="h-5 w-5 text-muted-foreground" />
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    {obs.latitude && obs.longitude ? (
                       <MapPin className="h-5 w-5 mx-auto text-muted-foreground" />
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button aria-haspopup="true" size="icon" variant="ghost">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Toggle menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>{t('actions')}</DropdownMenuLabel>
                        <DropdownMenuItem onSelect={() => setObservationToView(obs)}>{t('view')}</DropdownMenuItem>
                        {canEdit && <DropdownMenuItem onSelect={() => handleEdit(obs)}>{t('edit')}</DropdownMenuItem>}
                        {canDelete && (
                          <>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive" onSelect={() => setObservationToDelete(obs)}>{t('delete')}</DropdownMenuItem>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
         ) : (
            <div className="flex flex-col items-center justify-center text-center gap-4 py-16 border-2 border-dashed rounded-lg">
                <Camera className="w-12 h-12 text-muted-foreground" />
                <h3 className="text-lg font-semibold">{t('noObservationsTitle')}</h3>
                <p className="text-muted-foreground max-w-sm">
                    {t('noObservationsDescription')}
                </p>
            </div>
         )}
      </CardContent>
    </Card>

    <Sheet open={!!observationToView} onOpenChange={(open) => !open && setObservationToView(null)}>
        <SheetContent className="w-full sm:max-w-md overflow-y-auto">
            <SheetHeader>
                <SheetTitle>{observationToView?.title}</SheetTitle>
                <SheetDescription>
                    {t('detailsSheetDescription', {field: observationToView?.field, date: dateFormatter(observationToView?.date || '')})}
                </SheetDescription>
            </SheetHeader>
            <div className="py-4 space-y-4">
                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <Label>{t('addObservationForm.observationTypeLabel')}</Label>
                        <p className="text-sm font-medium">{observationToView && tObservationTypes(observationToView.observationType)}</p>
                    </div>
                     <div className="space-y-1">
                        <Label>{t('addObservationForm.bbchStageLabel')}</Label>
                        <p className="text-sm font-medium">{observationToView?.bbchStage}</p>
                    </div>
                 </div>
                 <div className="space-y-1">
                    <Label>{t('addObservationForm.intensityLabel')}</Label>
                    <div className="flex items-center gap-2">
                        <Slider value={[observationToView?.intensity || 0]} max={5} min={1} step={1} disabled className="w-1/2" />
                        <span className="text-sm font-medium">{observationToView?.intensity} / 5</span>
                    </div>
                 </div>
                 
                 {observationToView?.observationType === 'Damage' && (
                    <Card>
                        <CardHeader className="p-4">
                            <CardTitle className="text-base">{t('addObservationForm.damageCauseLabel')}</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 pt-0 grid gap-2 text-sm">
                             {observationToView.damageCause && (
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">{t('addObservationForm.damageCauseLabel')}</span>
                                    <span className="font-medium">{tDamageCauses(observationToView.damageCause as any)}</span>
                                </div>
                             )}
                            {observationToView.damageCause === 'Wildlife' && observationToView.animal && (
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">{t('addObservationForm.animalLabel')}</span>
                                    <span className="font-medium">{observationToView.animal}</span>
                                </div>
                            )}
                            {observationToView.affectedArea != null && (
                                 <div className="flex justify-between">
                                    <span className="text-muted-foreground">{t('addObservationForm.affectedAreaLabel')}</span>
                                    <span className="font-medium">{observationToView.affectedArea.toLocaleString(locale)} m²</span>
                                </div>
                            )}
                            {observationToView.damagePercentage != null && (
                                 <div className="flex justify-between">
                                    <span className="text-muted-foreground">{t('addObservationForm.damagePercentageLabel')}</span>
                                    <span className="font-medium">{observationToView.damagePercentage} %</span>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                 )}

                {observationToView?.photoUrl && (
                    <div className="aspect-video w-full overflow-hidden rounded-md border">
                        <Image
                            src={observationToView.photoUrl}
                            alt={observationToView.title || 'Observation photo'}
                            width={600}
                            height={400}
                            className="w-full h-full object-cover"
                        />
                    </div>
                )}
                <p className="text-sm text-muted-foreground">{observationToView?.description}</p>
                 {observationToView?.latitude && observationToView?.longitude && (
                  <div className="space-y-2">
                    <Label>{t('locationLabel')}</Label>
                    <div className="aspect-video w-full overflow-hidden rounded-md border">
                        <ObservationLocationMap latitude={observationToView.latitude} longitude={observationToView.longitude} />
                    </div>
                  </div>
                )}
            </div>
        </SheetContent>
    </Sheet>
    
    <AlertDialog open={!!observationToDelete} onOpenChange={(open) => !open && setObservationToDelete(null)}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t('deleteConfirmationTitle')}</AlertDialogTitle>
          <AlertDialogDescription>
            {t('deleteConfirmationDescription')}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{t('deleteConfirmationCancel')}</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">{t('deleteConfirmationConfirm')}</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
    
    <Sheet open={isEditSheetOpen} onOpenChange={setEditSheetOpen}>
        <SheetContent className="w-full sm:max-w-md overflow-y-auto">
            <SheetHeader>
                <SheetTitle>{t('editObservationSheetTitle')}</SheetTitle>
            </SheetHeader>
            <div className="py-4">
              {activeCompany && observationToEdit && (
                <EditObservationForm
                  closeSheet={() => setEditSheetOpen(false)}
                  tenantId={activeCompany.tenantId}
                  companyId={activeCompany.id}
                  observation={observationToEdit}
                  fields={fields}
                />
              )}
            </div>
        </SheetContent>
    </Sheet>
    </>
  )
}
