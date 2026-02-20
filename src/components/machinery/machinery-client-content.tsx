'use client'

import { useEffect, useState } from 'react'
import { useFormState, useFormStatus } from 'react-dom'
import { useTranslations } from "next-intl"
import { useToast } from '@/hooks/use-toast'
import { Machinery } from '@/services/types'
import { addMachine } from '@/app/machinery/actions'
import { useSession } from '@/context/session-context'
import dataService from '@/services'
import { Link } from "next-intl/navigation";
import { useParams } from 'next/navigation'

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { MoreHorizontal, PlusCircle } from "lucide-react"
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
import { Skeleton } from '../ui/skeleton'

const initialState = {
  message: '',
  errors: {},
}

function SubmitButton() {
  const { pending } = useFormStatus()
  const t = useTranslations('MachineryPage.addMachineForm');
  return (
    <Button type="submit" aria-disabled={pending}>
      {pending ? t('submitting') : t('submit')}
    </Button>
  )
}

function AddMachineForm({ closeSheet, tenantId, companyId }: { closeSheet: () => void; tenantId: string; companyId: string; }) {
  const [state, formAction] = useFormState(addMachine, initialState)
  const { toast } = useToast()
  const t = useTranslations('MachineryPage.addMachineForm');
  const tMachineTypes = useTranslations('MachineryTypes');

  useEffect(() => {
    if (state.message && state.errors && Object.keys(state.errors).length === 0) {
      toast({
        title: t('successToastTitle'),
        description: state.message,
      })
      closeSheet();
    } else if (state.message && state.errors && Object.keys(state.errors).length > 0) {
      toast({
        variant: 'destructive',
        title: t('errorToastTitle'),
        description: state.message,
      })
    }
  }, [state, toast, closeSheet, t]);
  
  const machineTypes = ["Tractor", "CombineHarvester", "Tillage", "Seeding", "Baler"];

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="tenantId" value={tenantId} />
      <input type="hidden" name="companyId" value={companyId} />
      <div className="space-y-2">
        <Label htmlFor="name">{t('nameLabel')}</Label>
        <Input id="name" name="name" required />
        {state.errors?.name && <p className="text-sm text-destructive">{state.errors.name.join(', ')}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="type">{t('typeLabel')}</Label>
        <Select name="type" required>
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
        <Input id="model" name="model" required />
        {state.errors?.model && <p className="text-sm text-destructive">{state.errors.model.join(', ')}</p>}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
            <Label htmlFor="standardFuelConsumption">{t('fuelConsumptionLabel')}</Label>
            <Input id="standardFuelConsumption" name="standardFuelConsumption" type="number" step="0.1" required placeholder="35.5" />
            {state.errors?.standardFuelConsumption && <p className="text-sm text-destructive">{state.errors.standardFuelConsumption.join(', ')}</p>}
        </div>
        <div className="space-y-2">
            <Label htmlFor="maintenanceIntervalHours">{t('maintenanceIntervalLabel')}</Label>
            <Input id="maintenanceIntervalHours" name="maintenanceIntervalHours" type="number" step="1" placeholder={t('maintenanceIntervalPlaceholder')} />
            {state.errors?.maintenanceIntervalHours && <p className="text-sm text-destructive">{state.errors.maintenanceIntervalHours.join(', ')}</p>}
        </div>
      </div>
      <SubmitButton />
    </form>
  )
}

export function MachineryClientContent() {
  const t = useTranslations('MachineryPage');
  const tMachineTypes = useTranslations('MachineryTypes');
  const tMachineStatuses = useTranslations('MachineryStatuses');
  const [isSheetOpen, setSheetOpen] = useState(false);
  const { activeCompany, loading: sessionLoading } = useSession();
  const [machinery, setMachinery] = useState<Machinery[]>([]);
  const [loading, setLoading] = useState(true);
  const { locale } = useParams<{ locale: string }>();

  useEffect(() => {
    if (activeCompany) {
      const fetchMachinery = async () => {
        setLoading(true);
        const data = await dataService.getMachinery(activeCompany.tenantId, activeCompany.id);
        setMachinery(data);
        setLoading(false);
      }
      fetchMachinery();
    }
  }, [activeCompany]);
  
  if (sessionLoading || loading) {
      return (
          <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                      <Skeleton className="h-6 w-32" />
                      <Skeleton className="h-4 w-64 mt-2" />
                  </div>
                  <Skeleton className="h-9 w-32" />
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
        <div>
          <CardTitle>{t('title')}</CardTitle>
          <CardDescription>
            {t('description')}
          </CardDescription>
        </div>
        <Sheet open={isSheetOpen} onOpenChange={setSheetOpen}>
          <SheetTrigger asChild>
            <Button size="sm" className="gap-1">
              <PlusCircle className="h-4 w-4" />
              {t('addMachine')}
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>{t('addMachineSheetTitle')}</SheetTitle>
            </SheetHeader>
            <div className="py-4">
              {activeCompany && <AddMachineForm closeSheet={() => setSheetOpen(false)} tenantId={activeCompany.tenantId} companyId={activeCompany.id} />}
            </div>
          </SheetContent>
        </Sheet>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('name')}</TableHead>
              <TableHead>{t('type')}</TableHead>
              <TableHead>{t('status')}</TableHead>
              <TableHead className="text-right">{t('operatingHours')}</TableHead>
              <TableHead><span className="sr-only">{t('actions')}</span></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {machinery.map((machine) => (
              <TableRow key={machine.id}>
                <TableCell className="font-medium">
                  <Link href={`/machinery/${machine.id}`} className="hover:underline">
                    {machine.name}
                  </Link>
                </TableCell>
                <TableCell>{tMachineTypes(machine.type)}</TableCell>
                <TableCell>
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
                </TableCell>
                <TableCell className="text-right">{machine.totalOperatingHours.toLocaleString(locale)} {t('operatingHoursUnit')}</TableCell>
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
                      <DropdownMenuItem>{t('viewMaintenance')}</DropdownMenuItem>
                      <DropdownMenuItem>{t('reportRepair')}</DropdownMenuItem>
                      <DropdownMenuSeparator />
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
