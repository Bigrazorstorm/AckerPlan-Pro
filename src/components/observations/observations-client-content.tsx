'use client'

import { React, useEffect, useState, useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import { useTranslations } from "next-intl"
import { useToast } from '@/hooks/use-toast'
import { Observation, Field, ObservationType } from '@/services/types'
import { addObservation, deleteObservation } from '@/app/observations/actions'
import { useSession } from '@/context/session-context'
import dataService from '@/services'
import { format } from "date-fns"
import { de, enUS } from 'date-fns/locale'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import dynamic from 'next/dynamic'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { MoreHorizontal, PlusCircle, Calendar as CalendarIcon, Camera, MapPin } from "lucide-react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet'
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

const initialState = {
  message: '',
  errors: {},
}

function SubmitButton() {
  const { pending } = useFormStatus()
  const t = useTranslations('ObservationsPage.addObservationForm');
  return (
    <Button type="submit" aria-disabled={pending}>
      {pending ? t('submitting') : t('submit')}
    </Button>
  )
}

function AddObservationForm({ closeSheet, tenantId, companyId, fields }: { closeSheet: () => void; tenantId: string; companyId: string; fields: Field[] }) {
  const [state, formAction] = useActionState(addObservation, initialState)
  const { toast } = useToast()
  const t = useTranslations('ObservationsPage.addObservationForm');
  const tObservationTypes = useTranslations('ObservationTypes');
  const [date, setDate] = useState<Date>()
  const [intensity, setIntensity] = useState(3);
  const { locale } = useParams<{ locale: string }>();

  const observationTypes: ObservationType[] = ['Routine', 'Pest', 'NutrientDeficiency', 'Damage', 'Other'];

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
  
  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="tenantId" value={tenantId} />
      <input type="hidden" name="companyId" value={companyId} />
      <input type="hidden" name="date" value={date ? format(date, "yyyy-MM-dd") : ""} />
      <input type="hidden" name="intensity" value={intensity} />

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
          <Select name="observationType" required>
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

       <div className="space-y-2">
        <Label htmlFor="photoUrl">{t('photoUrlLabel')}</Label>
        <Input id="photoUrl" name="photoUrl" placeholder={t('photoUrlPlaceholder')} />
        {state.errors?.photoUrl && <p className="text-sm text-destructive">{state.errors.photoUrl.join(', ')}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="latitude">{t('latitudeLabel')}</Label>
          <Input id="latitude" name="latitude" type="number" step="any" placeholder="52.515" />
          {state.errors?.latitude && <p className="text-sm text-destructive">{state.errors.latitude.join(', ')}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="longitude">{t('longitudeLabel')}</Label>
          <Input id="longitude" name="longitude" type="number" step="any" placeholder="13.360" />
          {state.errors?.longitude && <p className="text-sm text-destructive">{state.errors.longitude.join(', ')}</p>}
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
            <Select name="field" required>
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
  const { toast } = useToast();
  const [isAddSheetOpen, setAddSheetOpen] = useState(false);
  const { activeCompany, loading: sessionLoading, activeRole } = useSession();
  const [observations, setObservations] = useState<Observation[]>([]);
  const [fields, setFields] = useState<Field[]>([]);
  const [loading, setLoading] = useState(true);
  const { locale } = useParams<{ locale: string }>();
  const [observationToView, setObservationToView] = useState<Observation | null>(null);
  const [observationToDelete, setObservationToDelete] = useState<Observation | null>(null);
  
  const canManageObservations = activeRole === 'Firmen Admin' || activeRole === 'Tenant Admin';

  useEffect(() => {
    if (activeCompany) {
      const fetchData = async () => {
        setLoading(true);
        const [observationsData, fieldsData] = await Promise.all([
            dataService.getObservations(activeCompany.tenantId, activeCompany.id),
            dataService.getFields(activeCompany.tenantId, activeCompany.id),
        ]);
        setObservations(observationsData);
        setFields(fieldsData);
        setLoading(false);
      }
      fetchData();
    }
  }, [activeCompany, isAddSheetOpen, observationToDelete]);

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


  const dateFormatter = (dateString: string) => {
    if (!dateString) return '';
    try {
      return format(new Date(dateString), 'PP', { locale: locale === 'de' ? de : enUS });
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
        <Sheet open={isAddSheetOpen} onOpenChange={setAddSheetOpen}>
          <SheetTrigger asChild>
            <Button size="sm" className="gap-1">
              <PlusCircle className="h-4 w-4" />
              {t('addObservation')}
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>{t('addObservationSheetTitle')}</SheetTitle>
            </SheetHeader>
            <div className="py-4">
              {activeCompany && <AddObservationForm closeSheet={() => setAddSheetOpen(false)} tenantId={activeCompany.tenantId} companyId={activeCompany.id} fields={fields} />}
            </div>
          </SheetContent>
        </Sheet>
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
                        <DropdownMenuItem>{t('edit')}</DropdownMenuItem>
                        {canManageObservations && (
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
        <SheetContent>
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
    </>
  )
}
