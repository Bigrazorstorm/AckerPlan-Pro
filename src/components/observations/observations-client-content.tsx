'use client'

import { useEffect, useState, useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import { useTranslations } from "next-intl"
import { useToast } from '@/hooks/use-toast'
import { Observation, Field } from '@/services/types'
import { addObservation } from '@/app/observations/actions'
import { useSession } from '@/context/session-context'
import dataService from '@/services'
import { format } from "date-fns"
import { de, enUS } from 'date-fns/locale'
import { useParams } from 'next/navigation'
import Image from 'next/image'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { MoreHorizontal, PlusCircle, Calendar as CalendarIcon, Camera } from "lucide-react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetDescription } from '@/components/ui/sheet'
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
  const [date, setDate] = useState<Date>()
  const { locale } = useParams<{ locale: string }>();

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
        <Label htmlFor="photoUrl">{t('photoUrlLabel')}</Label>
        <Input id="photoUrl" name="photoUrl" placeholder={t('photoUrlPlaceholder')} />
        {state.errors?.photoUrl && <p className="text-sm text-destructive">{state.errors.photoUrl.join(', ')}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
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
                    <TableHead><span className="sr-only">Actions</span></TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {[...Array(5)].map((_, i) => (
                      <TableRow key={i}>
                        <TableCell><Skeleton className="h-5 w-48" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                        <TableCell><Skeleton className="h-8 w-8 rounded-full" /></TableCell>
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
  const [isAddSheetOpen, setAddSheetOpen] = useState(false);
  const { activeCompany, loading: sessionLoading } = useSession();
  const [observations, setObservations] = useState<Observation[]>([]);
  const [fields, setFields] = useState<Field[]>([]);
  const [loading, setLoading] = useState(true);
  const { locale } = useParams<{ locale: string }>();
  const [observationToView, setObservationToView] = useState<Observation | null>(null);

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
  }, [activeCompany]);

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
                <TableHead>{t('tableHeaderField')}</TableHead>
                <TableHead>{t('tableHeaderDate')}</TableHead>
                <TableHead>{t('tableHeaderPhoto')}</TableHead>
                <TableHead><span className="sr-only">{t('actions')}</span></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {observations.map((obs) => (
                <TableRow key={obs.id}>
                  <TableCell className="font-medium">{obs.title}</TableCell>
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
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive">{t('delete')}</DropdownMenuItem>
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
            </div>
        </SheetContent>
    </Sheet>
    </>
  )
}
