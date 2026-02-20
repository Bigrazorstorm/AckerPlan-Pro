'use client'

import { useEffect, useState, useMemo } from 'react'
import { useFormState, useFormStatus } from 'react-dom'
import { useTranslations } from "next-intl"
import { useToast } from '@/hooks/use-toast'
import { Operation, Field } from '@/services/types'
import { addOperation } from '@/app/operations/actions'
import { useSession } from '@/context/session-context'
import dataService from '@/services'
import { format } from "date-fns"
import { de } from 'date-fns/locale'

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { MoreHorizontal, PlusCircle, Calendar as CalendarIcon } from "lucide-react"
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

function AddOperationForm({ closeSheet, tenantId, companyId, fields }: { closeSheet: () => void; tenantId: string; companyId: string; fields: Field[] }) {
  const [state, formAction] = useFormState(addOperation, initialState)
  const { toast } = useToast()
  const t = useTranslations('OperationsPage.addOperationForm');
  const tOperationTypes = useTranslations('OperationTypes');
  const [date, setDate] = useState<Date>()

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
      
      <div className="space-y-2">
        <Label htmlFor="type">{t('typeLabel')}</Label>
        <Select name="type" required>
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
                {date ? format(date, "PPP", { locale: de }) : <span>{t('datePlaceholder')}</span>}
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

export function OperationsClientContent() {
  const t = useTranslations('OperationsPage');
  const tOperationTypes = useTranslations('OperationTypes');
  const [isSheetOpen, setSheetOpen] = useState(false);
  const { activeCompany, loading: sessionLoading } = useSession();
  const [operations, setOperations] = useState<Operation[]>([]);
  const [fields, setFields] = useState<Field[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (activeCompany) {
      const fetchData = async () => {
        setLoading(true);
        const [operationsData, fieldsData] = await Promise.all([
            dataService.getOperations(activeCompany.tenantId, activeCompany.id),
            dataService.getFields(activeCompany.tenantId, activeCompany.id)
        ]);
        setOperations(operationsData);
        setFields(fieldsData);
        setLoading(false);
      }
      fetchData();
    }
  }, [activeCompany]);
  
  if (sessionLoading || loading) {
      return (
          <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                  <div/>
                  <Skeleton className="h-9 w-40" />
              </CardHeader>
              <CardContent>
                  <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead><Skeleton className="h-4 w-24" /></TableHead>
                            <TableHead><Skeleton className="h-4 w-24" /></TableHead>
                            <TableHead><Skeleton className="h-4 w-24" /></TableHead>
                            <TableHead><Skeleton className="h-4 w-24" /></TableHead>
                            <TableHead><span className="sr-only">{t('actions')}</span></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {[...Array(5)].map((_, i) => (
                             <TableRow key={i}>
                                <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                                <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                                <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                                <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                                <TableCell><Skeleton className="h-8 w-8" /></TableCell>
                             </TableRow>
                        ))}
                    </TableBody>
                  </Table>
              </CardContent>
          </Card>
      );
  }

  return (
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
              {activeCompany && <AddOperationForm closeSheet={() => setSheetOpen(false)} tenantId={activeCompany.tenantId} companyId={activeCompany.id} fields={fields} />}
            </div>
          </SheetContent>
        </Sheet>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('tableHeaderType')}</TableHead>
              <TableHead>{t('tableHeaderField')}</TableHead>
              <TableHead>{t('tableHeaderDate')}</TableHead>
              <TableHead>{t('tableHeaderStatus')}</TableHead>
              <TableHead><span className="sr-only">{t('actions')}</span></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {operations.map((op) => (
              <TableRow key={op.id}>
                <TableCell className="font-medium">{tOperationTypes(op.type)}</TableCell>
                <TableCell>{op.field}</TableCell>
                <TableCell>{op.date}</TableCell>
                <TableCell>
                  <Badge variant={op.status === 'Completed' ? 'default' : 'secondary'} className={op.status === 'Completed' ? 'bg-green-100 text-green-800' : ''}>{op.status}</Badge>
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
                      <DropdownMenuItem className="text-destructive">{t('delete')}</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
