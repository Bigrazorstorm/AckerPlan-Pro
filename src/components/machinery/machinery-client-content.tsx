'use client'

import { useEffect, useState } from 'react'
import { useFormState, useFormStatus } from 'react-dom'
import { useTranslations } from "next-intl"
import { useToast } from '@/hooks/use-toast'
import { Machinery } from '@/services/types'
import { addMachine } from '@/app/machinery/actions'

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

function AddMachineForm({ closeSheet }: { closeSheet: () => void }) {
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
                <SelectItem key={type} value={tMachineTypes(type)}>{tMachineTypes(type)}</SelectItem>
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
      <SubmitButton />
    </form>
  )
}

interface MachineryClientContentProps {
  machinery: Machinery[];
}

export function MachineryClientContent({ machinery }: MachineryClientContentProps) {
  const t = useTranslations('MachineryPage');
  const tMachineTypes = useTranslations('MachineryTypes');
  const [isSheetOpen, setSheetOpen] = useState(false);

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
              <AddMachineForm closeSheet={() => setSheetOpen(false)} />
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
              <TableHead>{t('nextService')}</TableHead>
              <TableHead><span className="sr-only">{t('actions')}</span></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {machinery.map((machine) => (
              <TableRow key={machine.id}>
                <TableCell className="font-medium">{machine.name}</TableCell>
                <TableCell>{tMachineTypes(machine.type.replace(/ /g, ''))}</TableCell>
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
                    {machine.status}
                  </Badge>
                </TableCell>
                <TableCell>{machine.nextService}</TableCell>
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
