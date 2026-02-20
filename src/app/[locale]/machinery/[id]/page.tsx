'use client';

import { useState, useEffect } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { useParams } from 'next/navigation';
import { useSession } from '@/context/session-context';
import dataService from '@/services';
import { Machinery, MaintenanceEvent, RepairEvent } from '@/services/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslations } from 'next-intl';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { PlusCircle, Wrench, ArrowLeft, Calendar as CalendarIcon, Info, Pencil } from 'lucide-react';
import { format } from 'date-fns';
import { de, enUS } from 'date-fns/locale';
import { Skeleton } from '@/components/ui/skeleton';
import { Link } from 'next-intl/navigation';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { useToast } from '@/hooks/use-toast';
import { addMaintenanceEvent } from '@/app/machinery/maintenance/actions';
import { addRepairEvent } from '@/app/machinery/repair/actions';
import { updateMachine } from '@/app/machinery/actions';
import { cn } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';


const initialState = {
  message: '',
  errors: {},
};

function SubmitButton({tKey = 'submit'}: {tKey?: string}) {
  const { pending } = useFormStatus();
  const t = useTranslations();
  return (
    <Button type="submit" aria-disabled={pending}>
      {pending ? t('General.submitting') : t(tKey)}
    </Button>
  );
}

function EditMachineForm({
  closeSheet,
  machine,
}: {
  closeSheet: () => void;
  machine: Machinery;
}) {
  const [state, formAction] = useFormState(updateMachine, initialState);
  const { toast } = useToast();
  const t = useTranslations('MachineDetailPage.editMachineForm');
  const tMachineTypes = useTranslations('MachineryTypes');

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
  
  const machineTypes = ["Tractor", "CombineHarvester", "Tillage", "Seeding", "Baler"];

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="id" value={machine.id} />
      <input type="hidden" name="tenantId" value={machine.tenantId} />
      <input type="hidden" name="companyId" value={machine.companyId} />
      <div className="space-y-2">
        <Label htmlFor="name">{t('nameLabel')}</Label>
        <Input id="name" name="name" required defaultValue={machine.name} />
        {state.errors?.name && <p className="text-sm text-destructive">{state.errors.name.join(', ')}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="type">{t('typeLabel')}</Label>
        <Select name="type" required defaultValue={machine.type}>
          <SelectTrigger>
            <SelectValue placeholder={t('typePlaceholder')} />
          </SelectTrigger>
          <SelectContent>
            {machineTypes.map((type) => (
                <SelectItem key={type} value={type}>{tMachineTypes(type)}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        {state.errors?.type && <p className="text-sm text-destructive">{state.errors.type.join(', ')}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="model">{t('modelLabel')}</Label>
        <Input id="model" name="model" required defaultValue={machine.model} />
        {state.errors?.model && <p className="text-sm text-destructive">{state.errors.model.join(', ')}</p>}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
            <Label htmlFor="standardFuelConsumption">{t('fuelConsumptionLabel')}</Label>
            <Input id="standardFuelConsumption" name="standardFuelConsumption" type="number" step="0.1" required defaultValue={machine.standardFuelConsumption} />
            {state.errors?.standardFuelConsumption && <p className="text-sm text-destructive">{state.errors.standardFuelConsumption.join(', ')}</p>}
        </div>
        <div className="space-y-2">
            <Label htmlFor="maintenanceIntervalHours">{t('maintenanceIntervalLabel')}</Label>
            <Input id="maintenanceIntervalHours" name="maintenanceIntervalHours" type="number" step="1" placeholder={t('maintenanceIntervalPlaceholder')} defaultValue={machine.maintenanceIntervalHours} />
            {state.errors?.maintenanceIntervalHours && <p className="text-sm text-destructive">{state.errors.maintenanceIntervalHours.join(', ')}</p>}
        </div>
      </div>
      <SubmitButton tKey="MachineDetailPage.editMachineForm.submit" />
    </form>
  )
}

function AddMaintenanceForm({
  closeSheet,
  tenantId,
  companyId,
  machineId,
  locale
}: {
  closeSheet: () => void;
  tenantId: string;
  companyId: string;
  machineId: string;
  locale: string;
}) {
  const [state, formAction] = useFormState(addMaintenanceEvent, initialState);
  const { toast } = useToast();
  const t = useTranslations('MachineDetailPage.addMaintenanceForm');
  const [date, setDate] = useState<Date>();

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

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="tenantId" value={tenantId} />
      <input type="hidden" name="companyId" value={companyId} />
      <input type="hidden" name="machineId" value={machineId} />
      <input type="hidden" name="date" value={date ? format(date, 'yyyy-MM-dd') : ''} />

      <div className="space-y-2">
        <Label htmlFor="date">{t('dateLabel')}</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={'outline'}
              className={cn('w-full justify-start text-left font-normal', !date && 'text-muted-foreground')}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, 'PPP', { locale: locale === 'de' ? de : enUS }) : <span>{t('datePlaceholder')}</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              initialFocus
              disabled={(d) => d > new Date()}
            />
          </PopoverContent>
        </Popover>
        {state.errors?.date && <p className="text-sm text-destructive">{state.errors.date.join(', ')}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">{t('descriptionLabel')}</Label>
        <Textarea id="description" name="description" required placeholder={t('descriptionPlaceholder')} />
        {state.errors?.description && <p className="text-sm text-destructive">{state.errors.description.join(', ')}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="cost">{t('costLabel')}</Label>
        <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground text-sm">€</span>
            <Input id="cost" name="cost" type="number" step="0.01" required placeholder="150.00" className="pl-7"/>
        </div>
        {state.errors?.cost && <p className="text-sm text-destructive">{state.errors.cost.join(', ')}</p>}
      </div>
      
      <SubmitButton tKey="MachineDetailPage.addMaintenanceForm.submit"/>
    </form>
  );
}

function AddRepairForm({
  closeSheet,
  tenantId,
  companyId,
  machineId,
  locale
}: {
  closeSheet: () => void;
  tenantId: string;
  companyId: string;
  machineId: string;
  locale: string;
}) {
  const [state, formAction] = useFormState(addRepairEvent, initialState);
  const { toast } = useToast();
  const t = useTranslations('MachineDetailPage.addRepairForm');
  const [date, setDate] = useState<Date>();

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

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="tenantId" value={tenantId} />
      <input type="hidden" name="companyId" value={companyId} />
      <input type="hidden" name="machineId" value={machineId} />
      <input type="hidden" name="date" value={date ? format(date, 'yyyy-MM-dd') : ''} />

      <div className="space-y-2">
        <Label htmlFor="date">{t('dateLabel')}</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={'outline'}
              className={cn('w-full justify-start text-left font-normal', !date && 'text-muted-foreground')}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, 'PPP', { locale: locale === 'de' ? de : enUS }) : <span>{t('datePlaceholder')}</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              initialFocus
              disabled={(d) => d > new Date()}
            />
          </PopoverContent>
        </Popover>
        {state.errors?.date && <p className="text-sm text-destructive">{state.errors.date.join(', ')}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">{t('descriptionLabel')}</Label>
        <Textarea id="description" name="description" required placeholder={t('descriptionPlaceholder')} />
        {state.errors?.description && <p className="text-sm text-destructive">{state.errors.description.join(', ')}</p>}
      </div>

       <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="cost">{t('costLabel')}</Label>
            <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground text-sm">€</span>
                <Input id="cost" name="cost" type="number" step="0.01" required placeholder="150.00" className="pl-7"/>
            </div>
            {state.errors?.cost && <p className="text-sm text-destructive">{state.errors.cost.join(', ')}</p>}
          </div>
            <div className="space-y-2">
                <Label htmlFor="downtimeHours">{t('downtimeLabel')}</Label>
                <Input id="downtimeHours" name="downtimeHours" type="number" step="0.1" required placeholder={t('downtimePlaceholder')} />
                {state.errors?.downtimeHours && <p className="text-sm text-destructive">{state.errors.downtimeHours.join(', ')}</p>}
            </div>
       </div>
      
      <SubmitButton tKey="MachineDetailPage.addRepairForm.submit"/>
    </form>
  );
}


function MachineDetailSkeleton() {
  return (
    <div className="space-y-4">
       <div>
            <Skeleton className="h-9 w-44" />
       </div>
        <div className="space-y-6">
            <div className="flex justify-between items-start">
                <div>
                <Skeleton className="h-9 w-64 mb-2" />
                <Skeleton className="h-4 w-96" />
                </div>
                <div className="flex gap-2">
                    <Skeleton className="h-9 w-44" />
                    <Skeleton className="h-9 w-44" />
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <Card>
                <CardHeader>
                    <Skeleton className="h-6 w-1/3" />
                </CardHeader>
                <CardContent className="grid gap-4">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="flex justify-between">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-5 w-32" />
                        </div>
                    ))}
                </CardContent>
                </Card>
                <Card className="md:col-span-2">
                <CardHeader>
                    <Skeleton className="h-6 w-1/2" />
                </CardHeader>
                <CardContent>
                    <Skeleton className="h-10 w-48 mb-4" />
                    <div className="space-y-2">
                        {[...Array(5)].map((_, i) => (
                            <Skeleton key={i} className="h-10 w-full" />
                        ))}
                    </div>
                </CardContent>
                </Card>
            </div>
        </div>
    </div>
  )
}

export default function MachineDetailPage() {
  const { id, locale } = useParams<{ id: string, locale: string }>();
  const { activeCompany, loading: sessionLoading, activeRole } = useSession();
  const [machine, setMachine] = useState<Machinery | null>(null);
  const [maintenanceHistory, setMaintenanceHistory] = useState<MaintenanceEvent[]>([]);
  const [repairHistory, setRepairHistory] = useState<RepairEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMaintenanceSheetOpen, setMaintenanceSheetOpen] = useState(false);
  const [isRepairSheetOpen, setRepairSheetOpen] = useState(false);
  const [isEditSheetOpen, setEditSheetOpen] = useState(false);

  const t = useTranslations('MachineDetailPage');
  const tMachineTypes = useTranslations('MachineryTypes');
  const tMachineStatuses = useTranslations('MachineryStatuses');
  
  const canManageMachinery = activeRole === 'Firmen Admin' || activeRole === 'Tenant Admin';
  const canLogMaintenance = canManageMachinery || activeRole === 'Werkstatt';
  const canReportRepair = canLogMaintenance || activeRole === 'Mitarbeiter';

  useEffect(() => {
    if (activeCompany) {
      const fetchData = async () => {
        setLoading(true);
        const [machineData, maintenanceData, repairData] = await Promise.all([
          dataService.getMachineById(activeCompany.tenantId, activeCompany.id, id),
          dataService.getMaintenanceHistory(activeCompany.tenantId, activeCompany.id, id),
          dataService.getRepairHistory(activeCompany.tenantId, activeCompany.id, id),
        ]);
        
        setMachine(machineData);
        if (machineData) {
            setMaintenanceHistory(maintenanceData);
            setRepairHistory(repairData);
        }

        setLoading(false);
      };
      fetchData();
    }
  }, [activeCompany, id]);

  const currencyFormatter = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'EUR',
  });
  
  const dateFormatter = (dateString: string) => {
    try {
        return format(new Date(dateString), 'PPP', { locale: locale === 'de' ? de : enUS });
    } catch (e) {
        return dateString;
    }
  }

  const getNextServiceInfo = (m: Machinery) => {
    if (m.status === 'In Workshop') {
      return { text: tMachineStatuses('In Workshop'), isDue: true };
    }
    if (!m.maintenanceIntervalHours) {
      return { text: t('serviceNotApplicable'), isDue: false };
    }
    const nextServiceHours = m.lastMaintenanceHours + m.maintenanceIntervalHours;
    const hoursRemaining = nextServiceHours - m.totalOperatingHours;
    
    if (hoursRemaining <= 0) {
      return { text: t('serviceDue'), isDue: true };
    }
    return { text: t('serviceInHours', { hours: hoursRemaining.toFixed(0) }), isDue: false };
  }

  if (sessionLoading || loading) {
    return <MachineDetailSkeleton />;
  }

  if (!machine) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>{t('notFoundTitle')}</CardTitle>
            </CardHeader>
            <CardContent>
                <p>{t('notFoundDescription')}</p>
                <Button asChild variant="link" className="pl-0 mt-4">
                    <Link href="/machinery">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        {t('backToList')}
                    </Link>
                </Button>
            </CardContent>
        </Card>
    )
  }

  const nextServiceInfo = getNextServiceInfo(machine);


  return (
    <div className="space-y-4">
        <div>
            <Button variant="ghost" asChild>
                <Link href="/machinery">
                <ArrowLeft className="mr-2 h-4 w-4" />
                {t('backToList')}
                </Link>
            </Button>
        </div>
        <div className="space-y-6">
            <div className="flex justify-between items-start">
                <div>
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight">{machine.name}</h1>
                <p className="text-muted-foreground">{t('description', { model: machine.model, type: tMachineTypes(machine.type) })}</p>
                </div>
                 <div className="flex gap-2">
                    {canManageMachinery && (
                      <Sheet open={isEditSheetOpen} onOpenChange={setEditSheetOpen}>
                          <SheetTrigger asChild>
                              <Button size="sm" variant="outline" className="gap-1">
                                  <Pencil className="h-4 w-4" />
                                  {t('editMachineButton')}
                              </Button>
                          </SheetTrigger>
                          <SheetContent>
                              <SheetHeader>
                                  <SheetTitle>{t('editMachineSheetTitle')}</SheetTitle>
                              </SheetHeader>
                              <div className="py-4">
                                  <EditMachineForm closeSheet={() => setEditSheetOpen(false)} machine={machine} />
                              </div>
                          </SheetContent>
                      </Sheet>
                    )}
                    {canLogMaintenance && (
                      <Sheet open={isMaintenanceSheetOpen} onOpenChange={setMaintenanceSheetOpen}>
                          <SheetTrigger asChild>
                              <Button size="sm" className="gap-1">
                                  <PlusCircle className="h-4 w-4" />
                                  {t('logMaintenanceButton')}
                              </Button>
                          </SheetTrigger>
                          <SheetContent>
                              <SheetHeader>
                                  <SheetTitle>{t('logMaintenanceSheetTitle')}</SheetTitle>
                              </SheetHeader>
                              <div className="py-4">
                                  {activeCompany && <AddMaintenanceForm closeSheet={() => setMaintenanceSheetOpen(false)} tenantId={activeCompany.tenantId} companyId={activeCompany.id} machineId={machine.id} locale={locale} />}
                              </div>
                          </SheetContent>
                      </Sheet>
                    )}
                    {canReportRepair && (
                      <Sheet open={isRepairSheetOpen} onOpenChange={setRepairSheetOpen}>
                          <SheetTrigger asChild>
                              <Button size="sm" variant="destructive" className="gap-1">
                                  <Wrench className="h-4 w-4" />
                                  {t('reportRepairButton')}
                              </Button>
                          </SheetTrigger>
                          <SheetContent>
                              <SheetHeader>
                                  <SheetTitle>{t('logRepairSheetTitle')}</SheetTitle>
                              </SheetHeader>
                              <div className="py-4">
                                  {activeCompany && <AddRepairForm closeSheet={() => setRepairSheetOpen(false)} tenantId={activeCompany.tenantId} companyId={activeCompany.id} machineId={machine.id} locale={locale} />}
                              </div>
                          </SheetContent>
                      </Sheet>
                    )}
                 </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <Card>
                <CardHeader>
                    <CardTitle>{t('detailsTitle')}</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4">
                    <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">{t('statusLabel')}</span>
                    <Badge variant={
                            machine.status === 'Operational' ? 'default' 
                            : machine.status === 'Maintenance Due' ? 'destructive' 
                            : 'secondary'
                        } 
                        className={
                            machine.status === 'Operational' ? 'bg-green-100 text-green-800' 
                            : machine.status === 'Maintenance Due' ? 'bg-yellow-100 text-yellow-800'
                            : machine.status === 'In Workshop' ? 'bg-red-100 text-red-800'
                            : ''
                        }>
                            {tMachineStatuses(machine.status)}
                        </Badge>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">{t('totalOperatingHoursLabel')}</span>
                        <span className="font-medium">{machine.totalOperatingHours.toLocaleString(locale)} {t('operatingHoursUnit')}</span>
                    </div>
                    <div className="flex justify-between">
                    <span className="text-muted-foreground">{t('nextServiceLabel')}</span>
                    <span className={cn("font-medium", nextServiceInfo.isDue && "text-destructive")}>{nextServiceInfo.text}</span>
                    </div>
                    <div className="flex justify-between">
                    <span className="text-muted-foreground">{t('lastMaintenanceLabel')}</span>
                    <span className="font-medium">{dateFormatter(machine.lastMaintenance)}</span>
                    </div>
                    <div className="flex justify-between">
                    <span className="text-muted-foreground">{t('createdAtLabel')}</span>
                    <span className="font-medium">{dateFormatter(machine.createdAt)}</span>
                    </div>
                </CardContent>
                </Card>

                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle>{t('serviceHistoryTitle')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Tabs defaultValue="maintenance">
                            <TabsList>
                                <TabsTrigger value="maintenance">{t('maintenanceHistoryTitle')}</TabsTrigger>
                                <TabsTrigger value="repairs">{t('repairHistoryTitle')}</TabsTrigger>
                            </TabsList>
                            <TabsContent value="maintenance" className="pt-4">
                                {maintenanceHistory.length > 0 ? (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>{t('dateHeader')}</TableHead>
                                            <TableHead>{t('descriptionHeader')}</TableHead>
                                            <TableHead className="text-right">{t('costHeader')}</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {maintenanceHistory.map((event) => (
                                            <TableRow key={event.id}>
                                                <TableCell>{dateFormatter(event.date)}</TableCell>
                                                <TableCell className="font-medium">{event.description}</TableCell>
                                                <TableCell className="text-right">{currencyFormatter.format(event.cost)}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                                ) : (
                                    <div className="flex flex-col items-center justify-center text-center gap-4 py-16 border-2 border-dashed rounded-lg">
                                        <Wrench className="w-12 h-12 text-muted-foreground" />
                                        <h3 className="text-lg font-semibold">{t('noMaintenanceTitle')}</h3>
                                        <p className="text-muted-foreground max-w-sm">
                                            {t('noMaintenanceDescription')}
                                        </p>
                                    </div>
                                )}
                            </TabsContent>
                            <TabsContent value="repairs" className="pt-4">
                                 {repairHistory.length > 0 ? (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>{t('dateHeader')}</TableHead>
                                            <TableHead>{t('descriptionHeader')}</TableHead>
                                            <TableHead className="text-right">{t('costHeader')}</TableHead>
                                            <TableHead className="text-right">{t('downtimeHeader')}</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {repairHistory.map((event) => (
                                            <TableRow key={event.id}>
                                                <TableCell>{dateFormatter(event.date)}</TableCell>
                                                <TableCell className="font-medium">{event.description}</TableCell>
                                                <TableCell className="text-right">{currencyFormatter.format(event.cost)}</TableCell>
                                                <TableCell className="text-right">{event.downtimeHours}{t('downtimeUnit')}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                                ) : (
                                    <div className="flex flex-col items-center justify-center text-center gap-4 py-16 border-2 border-dashed rounded-lg">
                                        <Wrench className="w-12 h-12 text-muted-foreground" />
                                        <h3 className="text-lg font-semibold">{t('noRepairsTitle')}</h3>
                                        <p className="text-muted-foreground max-w-sm">
                                            {t('noRepairsDescription')}
                                        </p>
                                    </div>
                                )}
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                </Card>
            </div>
        </div>
    </div>
  );
}
