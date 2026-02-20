'use client'

import { useEffect, useState, useMemo, useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import { useTranslations } from "next-intl"
import { useToast } from '@/hooks/use-toast'
import { Operation, Field, Machinery } from '@/services/types'
import { addOperation, deleteOperation } from '@/app/operations/actions'
import { useSession } from '@/context/session-context'
import dataService from '@/services'
import { format } from "date-fns"
import { de, enUS } from 'date-fns/locale'
import { useParams } from 'next/navigation'

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuCheckboxItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { MoreHorizontal, PlusCircle, Calendar as CalendarIcon, ChevronsUpDown } from "lucide-react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
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

const initialState = {
  message: '',
  errors: {},
}

function SubmitButton() {
  const { pending } = useFormStatus()
  const t = useTranslations('OperationsPage.addOperationForm');
  return (
    <Button type="submit" aria-disabled={pending}>
      {pending ? t('submitting') : t('submit')}
    </Button>
  )
}

function AddOperationForm({ closeSheet, tenantId, companyId, fields, machinery }: { closeSheet: () => void; tenantId: string; companyId: string; fields: Field[], machinery: Machinery[] }) {
  const [state, formAction] = useActionState(addOperation, initialState)
  const { toast } = useToast()
  const t = useTranslations('OperationsPage.addOperationForm');
  const tOperationTypes = useTranslations('OperationTypes');
  const [date, setDate] = useState<Date>()
  const [selectedFields, setSelectedFields] = useState<string[]>([]);
  const [operationType, setOperationType] = useState<string>('');
  const { locale } = useParams<{ locale: string }>();

  useEffect(() => {
    if (state.message && !state.errors) {
      toast({
        title: t('successToastTitle'),
        description: state.message,
      })
      closeSheet();
    } else if (state.message && state.errors) {
      toast({
        variant: 'destructive',
        title: t('errorToastTitle'),
        description: state.message,
      })
    }
  }, [state, toast, closeSheet, t]);
  
  const operationTypes = ["Tillage", "Seeding", "Fertilizing", "PestControl", "Harvesting", "Baling", "Mowing"];

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="tenantId" value={tenantId} />
      <input type="hidden" name="companyId" value={companyId} />
      <input type="hidden" name="date" value={date ? format(date, "yyyy-MM-dd") : ""} />
      {selectedFields.map(field => <input key={field} type="hidden" name="fields" value={field} />)}

      <div className="space-y-2">
        <Label htmlFor="type">{t('typeLabel')}</Label>
        <Select name="type" required onValueChange={setOperationType}>
          <SelectTrigger>
            <SelectValue placeholder={t('typePlaceholder')} />
          </SelectTrigger>
          <SelectContent>
            {operationTypes.map((type) => (
                <SelectItem key={type} value={type}>{tOperationTypes(type)}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        {state.errors?.type && <p className="text-sm text-destructive">{state.errors.type.join(', ')}</p>}
      </div>

       <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>{t('fieldLabel')}</Label>
             <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full justify-between font-normal">
                  <span className="truncate pr-1">
                    {selectedFields.length > 0
                      ? selectedFields.length === 1
                        ? selectedFields[0]
                        : t('multipleFieldsSelected', { count: selectedFields.length })
                      : t('fieldPlaceholder')}
                  </span>
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-[--radix-dropdown-menu-trigger-width]">
                {fields.map((field) => (
                  <DropdownMenuCheckboxItem
                    key={field.id}
                    checked={selectedFields.includes(field.name)}
                    onSelect={(e) => e.preventDefault()}
                    onCheckedChange={(checked) => {
                      return checked
                        ? setSelectedFields((prev) => [...prev, field.name])
                        : setSelectedFields((prev) => prev.filter((f) => f !== field.name));
                    }}
                  >
                    {field.name}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            {state.errors?.fields && <p className="text-sm text-destructive">{state.errors.fields.join(', ')}</p>}
        </div>
        <div className="space-y-2">
            <Label htmlFor="machineId">{t('machineLabel')}</Label>
            <Select name="machineId" required>
              <SelectTrigger>
                <SelectValue placeholder={t('machinePlaceholder')} />
              </SelectTrigger>
              <SelectContent>
                {machinery.map((machine) => (
                    <SelectItem key={machine.id} value={machine.id}>{machine.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {state.errors?.machineId && <p className="text-sm text-destructive">{state.errors.machineId.join(', ')}</p>}
        </div>
       </div>

      {operationType === 'Harvesting' && (
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="yieldAmount">{t('yieldLabel')}</Label>
            <Input id="yieldAmount" name="yieldAmount" type="number" step="0.01" placeholder={t('yieldPlaceholder')} />
            {state.errors?.yieldAmount && <p className="text-sm text-destructive">{state.errors.yieldAmount.join(', ')}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="revenue">{t('revenueLabel')}</Label>
            <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground text-sm">€</span>
                <Input id="revenue" name="revenue" type="number" step="0.01" placeholder={t('revenuePlaceholder')} className="pl-7"/>
            </div>
            {state.errors?.revenue && <p className="text-sm text-destructive">{state.errors.revenue.join(', ')}</p>}
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
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
        <div className="space-y-2">
            <Label htmlFor="laborHours">{t('laborHoursLabel')}</Label>
            <Input id="laborHours" name="laborHours" type="number" step="0.1" required placeholder={t('laborHoursPlaceholder')} />
            {state.errors?.laborHours && <p className="text-sm text-destructive">{state.errors.laborHours.join(', ')}</p>}
        </div>
      </div>

       <div className="space-y-2">
        <Label htmlFor="status">{t('statusLabel')}</Label>
        <Select name="status" required defaultValue="Completed">
          <SelectTrigger>
            <SelectValue placeholder={t('statusPlaceholder')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Completed">{t('statusCompleted')}</SelectItem>
            <SelectItem value="In Progress">{t('statusInProgress')}</SelectItem>
          </SelectContent>
        </Select>
        {state.errors?.status && <p className="text-sm text-destructive">{state.errors.status.join(', ')}</p>}
      </div>

      <SubmitButton />
    </form>
  )
}

function OperationsSkeleton() {
  const t = useTranslations('OperationsPage');
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div />
        <Skeleton className="h-9 w-40" />
      </CardHeader>
      <CardContent>
        {/* Mobile Skeleton */}
        <div className="md:hidden space-y-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <Skeleton className="h-6 w-32 mb-2" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                  <Skeleton className="h-8 w-8" />
                </div>
              </CardHeader>
              <CardContent className="space-y-3 pt-0">
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-5 w-24" />
                </div>
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-28" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        {/* Desktop Skeleton */}
        <div className="hidden md:block">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead><Skeleton className="h-4 w-24" /></TableHead>
                <TableHead><Skeleton className="h-4 w-24" /></TableHead>
                <TableHead><Skeleton className="h-4 w-24" /></TableHead>
                <TableHead><Skeleton className="h-4 w-24" /></TableHead>
                <TableHead><Skeleton className="h-4 w-16" /></TableHead>
                <TableHead><Skeleton className="h-4 w-16" /></TableHead>
                <TableHead><Skeleton className="h-4 w-16" /></TableHead>
                <TableHead><Skeleton className="h-4 w-24" /></TableHead>
                <TableHead><span className="sr-only">{t('actions')}</span></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...Array(5)].map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-8 w-8" /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

export function OperationsClientContent() {
  const t = useTranslations('OperationsPage');
  const tOperationTypes = useTranslations('OperationTypes');
  const tOperationStatuses = useTranslations('OperationStatuses');
  const { toast } = useToast();
  const [isSheetOpen, setSheetOpen] = useState(false);
  const { activeCompany, loading: sessionLoading, activeRole } = useSession();
  const [operations, setOperations] = useState<Operation[]>([]);
  const [fields, setFields] = useState<Field[]>([]);
  const [machinery, setMachinery] = useState<Machinery[]>([]);
  const [loading, setLoading] = useState(true);
  const { locale } = useParams<{ locale: string }>();
  const [operationToDelete, setOperationToDelete] = useState<Operation | null>(null);

  const canManageOperations = activeRole === 'Firmen Admin' || activeRole === 'Tenant Admin';

  useEffect(() => {
    if (activeCompany) {
      const fetchData = async () => {
        setLoading(true);
        const [operationsData, fieldsData, machineryData] = await Promise.all([
            dataService.getOperations(activeCompany.tenantId, activeCompany.id),
            dataService.getFields(activeCompany.tenantId, activeCompany.id),
            dataService.getMachinery(activeCompany.tenantId, activeCompany.id)
        ]);
        setOperations(operationsData);
        setFields(fieldsData);
        setMachinery(machineryData);
        setLoading(false);
      }
      fetchData();
    }
  }, [activeCompany]);

  const handleDelete = async () => {
    if (operationToDelete && activeCompany) {
      const result = await deleteOperation(operationToDelete.id, activeCompany.tenantId, activeCompany.id);
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
      setOperationToDelete(null); // Close dialog
    }
  };

  const dateFormatter = (dateString: string) => {
    try {
        return format(new Date(dateString), 'PP', { locale: locale === 'de' ? de : enUS });
    } catch (e) {
        return dateString;
    }
  }
  
  if (sessionLoading || loading) {
      return <OperationsSkeleton />;
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div/>
          <Sheet open={isSheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger asChild>
              <Button size="sm" className="gap-1">
                <PlusCircle className="h-4 w-4" />
                {t('addOperation')}
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>{t('addOperationSheetTitle')}</SheetTitle>
              </SheetHeader>
              <div className="py-4">
                {activeCompany && <AddOperationForm closeSheet={() => setSheetOpen(false)} tenantId={activeCompany.tenantId} companyId={activeCompany.id} fields={fields} machinery={machinery} />}
              </div>
            </SheetContent>
          </Sheet>
        </CardHeader>
        <CardContent>
          {/* Mobile View */}
          <div className="md:hidden space-y-4">
            {operations.map((op) => (
              <Card key={op.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{tOperationTypes(op.type)}</CardTitle>
                      <CardDescription>{op.field}</CardDescription>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button aria-haspopup="true" size="icon" variant="ghost">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Toggle menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>{t('actions')}</DropdownMenuLabel>
                        <DropdownMenuItem>{t('edit')}</DropdownMenuItem>
                        {canManageOperations && (
                          <DropdownMenuItem className="text-destructive" onSelect={() => setOperationToDelete(op)}>{t('delete')}</DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3 text-sm pt-0">
                  <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">{t('tableHeaderStatus')}</span>
                      <Badge variant={op.status === 'Completed' ? 'default' : 'secondary'} className={op.status === 'Completed' ? 'bg-green-100 text-green-800' : ''}>{tOperationStatuses(op.status)}</Badge>
                  </div>
                  <div className="flex justify-between">
                      <span className="text-muted-foreground">{t('tableHeaderDate')}</span>
                      <span>{dateFormatter(op.date)}</span>
                  </div>
                  {op.machine && (
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">{t('tableHeaderMachine')}</span>
                        <span>{op.machine.name}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                      <span className="text-muted-foreground">{t('tableHeaderLaborHours')}</span>
                      <span className="font-medium">{op.laborHours.toLocaleString(locale)} h</span>
                  </div>
                  {op.fuelConsumed && (
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">{t('tableHeaderFuel')}</span>
                        <span className="font-medium">{op.fuelConsumed.toLocaleString(locale)} l</span>
                    </div>
                  )}
                  {op.yieldAmount && (
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">{t('tableHeaderYield')}</span>
                        <span className="font-medium">{op.yieldAmount.toLocaleString(locale)} t</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Desktop View */}
          <div className="hidden md:block">
              <Table>
              <TableHeader>
                  <TableRow>
                  <TableHead>{t('tableHeaderType')}</TableHead>
                  <TableHead>{t('tableHeaderField')}</TableHead>
                  <TableHead>{t('tableHeaderMachine')}</TableHead>
                  <TableHead>{t('tableHeaderDate')}</TableHead>
                  <TableHead className="text-right">{t('tableHeaderLaborHours')}</TableHead>
                  <TableHead className="text-right">{t('tableHeaderFuel')}</TableHead>
                  <TableHead className="text-right">{t('tableHeaderYield')}</TableHead>
                  <TableHead>{t('tableHeaderStatus')}</TableHead>
                  <TableHead><span className="sr-only">{t('actions')}</span></TableHead>
                  </TableRow>
              </TableHeader>
              <TableBody>
                  {operations.map((op) => (
                  <TableRow key={op.id}>
                      <TableCell className="font-medium">{tOperationTypes(op.type)}</TableCell>
                      <TableCell>{op.field}</TableCell>
                      <TableCell>{op.machine?.name}</TableCell>
                      <TableCell>{dateFormatter(op.date)}</TableCell>
                      <TableCell className="text-right">{op.laborHours.toLocaleString(locale)} h</TableCell>
                      <TableCell className="text-right">{op.fuelConsumed?.toLocaleString(locale)} l</TableCell>
                      <TableCell className="text-right">{op.yieldAmount ? `${op.yieldAmount.toLocaleString(locale)} t` : '-'}</TableCell>
                      <TableCell>
                        <Badge variant={op.status === 'Completed' ? 'default' : 'secondary'} className={op.status === 'Completed' ? 'bg-green-100 text-green-800' : ''}>{tOperationStatuses(op.status)}</Badge>
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
                          <DropdownMenuItem>{t('edit')}</DropdownMenuItem>
                          {canManageOperations && (
                            <>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-destructive" onSelect={() => setOperationToDelete(op)}>{t('delete')}</DropdownMenuItem>
                            </>
                          )}
                          </DropdownMenuContent>
                      </DropdownMenu>
                      </TableCell>
                  </TableRow>
                  ))}
              </TableBody>
              </Table>
          </div>
        </CardContent>
      </Card>
      <AlertDialog open={!!operationToDelete} onOpenChange={(open) => !open && setOperationToDelete(null)}>
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
