'use client';

import { useState, useEffect, useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { useSession } from '@/context/session-context';
import dataService from '@/services';
import { WarehouseItem, WarehouseItemType } from '@/services/types';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, PlusCircle, Archive } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { addWarehouseItem } from '@/app/lager/actions';

const addItemInitialState = {
  message: '',
  errors: {},
};

function SubmitButton() {
  const { pending } = useFormStatus();
  const t = useTranslations('LagerPage.addItemForm');
  return (
    <Button type="submit" aria-disabled={pending}>
      {pending ? t('submitting') : t('submit')}
    </Button>
  );
}

function AddItemForm({ closeSheet, tenantId, companyId }: { closeSheet: () => void; tenantId: string; companyId: string; }) {
  const [state, formAction] = useActionState(addWarehouseItem, addItemInitialState);
  const { toast } = useToast();
  const t = useTranslations('LagerPage.addItemForm');
  const tItemTypes = useTranslations('WarehouseItemTypes');
  const [itemType, setItemType] = useState<WarehouseItemType | ''>('');
  
  const itemTypes: WarehouseItemType[] = ['Seed', 'Fertilizer', 'Pesticide', 'Other'];

  useEffect(() => {
    if (state.message && Object.keys(state.errors).length === 0) {
      toast({
        title: t('successToastTitle'),
        description: state.message,
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
      
      <div className="space-y-2">
        <Label htmlFor="name">{t('nameLabel')}</Label>
        <Input id="name" name="name" required placeholder={t('namePlaceholder')} />
        {state.errors?.name && <p className="text-sm text-destructive">{state.errors.name.join(', ')}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="itemType">{t('typeLabel')}</Label>
        <Select name="itemType" required onValueChange={(value) => setItemType(value as WarehouseItemType)}>
          <SelectTrigger>
            <SelectValue placeholder={t('typePlaceholder')} />
          </SelectTrigger>
          <SelectContent>
            {itemTypes.map((type) => (
              <SelectItem key={type} value={type}>{tItemTypes(type)}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        {state.errors?.itemType && <p className="text-sm text-destructive">{state.errors.itemType.join(', ')}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="quantity">{t('quantityLabel')}</Label>
          <Input id="quantity" name="quantity" type="number" step="any" required placeholder="100" />
          {state.errors?.quantity && <p className="text-sm text-destructive">{state.errors.quantity.join(', ')}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="unit">{t('unitLabel')}</Label>
          <Input id="unit" name="unit" required placeholder={t('unitPlaceholder')} />
          {state.errors?.unit && <p className="text-sm text-destructive">{state.errors.unit.join(', ')}</p>}
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="costPerUnit">{t('costPerUnitLabel')}</Label>
        <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground text-sm">€</span>
            <Input id="costPerUnit" name="costPerUnit" type="number" step="0.01" required placeholder="25.50" className="pl-7"/>
        </div>
        {state.errors?.costPerUnit && <p className="text-sm text-destructive">{state.errors.costPerUnit.join(', ')}</p>}
      </div>

      {itemType === 'Fertilizer' && (
        <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
                <Label htmlFor="n">{t('nLabel')}</Label>
                <Input id="n" name="n" type="number" step="0.1" placeholder="27" />
                {state.errors?.n && <p className="text-sm text-destructive">{state.errors.n.join(', ')}</p>}
            </div>
            <div className="space-y-2">
                <Label htmlFor="p">{t('pLabel')}</Label>
                <Input id="p" name="p" type="number" step="0.1" placeholder="5" />
                {state.errors?.p && <p className="text-sm text-destructive">{state.errors.p.join(', ')}</p>}
            </div>
            <div className="space-y-2">
                <Label htmlFor="k">{t('kLabel')}</Label>
                <Input id="k" name="k" type="number" step="0.1" placeholder="5" />
                {state.errors?.k && <p className="text-sm text-destructive">{state.errors.k.join(', ')}</p>}
            </div>
        </div>
      )}

      {itemType === 'Pesticide' && (
        <>
          <div className="space-y-2">
            <Label htmlFor="registrationNumber">{t('registrationNumberLabel')}</Label>
            <Input id="registrationNumber" name="registrationNumber" placeholder={t('registrationNumberPlaceholder')} />
            {state.errors?.registrationNumber && <p className="text-sm text-destructive">{state.errors.registrationNumber.join(', ')}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="waitingPeriodDays">{t('waitingPeriodDaysLabel')}</Label>
            <Input id="waitingPeriodDays" name="waitingPeriodDays" type="number" step="1" placeholder={t('waitingPeriodDaysPlaceholder')} />
            {state.errors?.waitingPeriodDays && <p className="text-sm text-destructive">{state.errors.waitingPeriodDays.join(', ')}</p>}
          </div>
        </>
      )}

      <SubmitButton />
    </form>
  );
}


function LagerSkeleton() {
    const t = useTranslations('LagerPage');
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <Skeleton className="h-6 w-48" />
                </div>
                <Skeleton className="h-9 w-32" />
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead><Skeleton className="h-4 w-32" /></TableHead>
                            <TableHead><Skeleton className="h-4 w-24" /></TableHead>
                            <TableHead><Skeleton className="h-4 w-20" /></TableHead>
                            <TableHead><Skeleton className="h-4 w-24" /></TableHead>
                            <TableHead><span className="sr-only">{t('actions')}</span></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {[...Array(5)].map((_, i) => (
                             <TableRow key={i}>
                                <TableCell><Skeleton className="h-5 w-40" /></TableCell>
                                <TableCell><Skeleton className="h-5 w-28" /></TableCell>
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


export function LagerClientContent() {
    const { activeCompany, loading: sessionLoading, activeRole } = useSession();
    const [items, setItems] = useState<WarehouseItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAddSheetOpen, setAddSheetOpen] = useState(false);
    const t = useTranslations('LagerPage');
    const tItemTypes = useTranslations('WarehouseItemTypes');
    const { locale } = useParams<{ locale: string }>();

    const canManageWarehouse = activeRole === 'Firmen Admin' || activeRole === 'Tenant Admin' || activeRole === 'Betriebsleitung';
    
    useEffect(() => {
        if (activeCompany) {
            const fetchData = async () => {
                setLoading(true);
                const data = await dataService.getWarehouseItems(activeCompany.tenantId, activeCompany.id);
                setItems(data);
                setLoading(false);
            };
            fetchData();
        } else if (!sessionLoading) {
            setLoading(false);
        }
    }, [activeCompany, sessionLoading, isAddSheetOpen]);
    
    const currencyFormatter = new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: 'EUR',
    });

    if (sessionLoading || loading) {
        return <LagerSkeleton />;
    }
    
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div/>
                {canManageWarehouse && (
                    <Sheet open={isAddSheetOpen} onOpenChange={setAddSheetOpen}>
                        <SheetTrigger asChild>
                             <Button size="sm" className="gap-1">
                                <PlusCircle className="h-4 w-4" />
                                {t('addItemButton')}
                            </Button>
                        </SheetTrigger>
                        <SheetContent>
                            <SheetHeader>
                                <SheetTitle>{t('addItemSheetTitle')}</SheetTitle>
                            </SheetHeader>
                            <div className="py-4">
                                {activeCompany && <AddItemForm closeSheet={() => setAddSheetOpen(false)} tenantId={activeCompany.tenantId} companyId={activeCompany.id} />}
                            </div>
                        </SheetContent>
                    </Sheet>
                )}
            </CardHeader>
            <CardContent>
                {items.length > 0 ? (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>{t('tableHeaderName')}</TableHead>
                                <TableHead>{t('tableHeaderType')}</TableHead>
                                <TableHead className="hidden md:table-cell">{t('tableHeaderRegNr')}</TableHead>
                                <TableHead className="hidden md:table-cell">{t('tableHeaderNutrients')}</TableHead>
                                <TableHead className="hidden md:table-cell text-right">{t('tableHeaderWaitingPeriod')}</TableHead>
                                <TableHead className="text-right">{t('tableHeaderQuantity')}</TableHead>
                                <TableHead className="text-right">{t('tableHeaderValue')}</TableHead>
                                {canManageWarehouse && <TableHead><span className="sr-only">{t('actions')}</span></TableHead>}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {items.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell className="font-medium">{item.name}</TableCell>
                                    <TableCell>{tItemTypes(item.itemType)}</TableCell>
                                    <TableCell className="hidden md:table-cell font-mono text-xs">{item.registrationNumber || '-'}</TableCell>
                                    <TableCell className="hidden md:table-cell font-mono text-xs">
                                        {item.itemType === 'Fertilizer' ? `${item.n || 0}-${item.p || 0}-${item.k || 0}` : '-'}
                                    </TableCell>
                                    <TableCell className="hidden md:table-cell text-right">{item.waitingPeriodDays ? `${item.waitingPeriodDays} ${t('daysSuffix')}` : '-'}</TableCell>
                                    <TableCell className="text-right">{item.quantity.toLocaleString(locale)} {item.unit}</TableCell>
                                    <TableCell className="text-right">{currencyFormatter.format(item.quantity * item.costPerUnit)}</TableCell>
                                    {canManageWarehouse && (
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button size="icon" variant="ghost">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuLabel>{t('actions')}</DropdownMenuLabel>
                                                    <DropdownMenuItem disabled>{t('edit')}</DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem className="text-destructive" disabled>{t('delete')}</DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    )}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                ) : (
                     <div className="flex flex-col items-center justify-center text-center gap-4 py-24 border-2 border-dashed rounded-lg">
                        <Archive className="w-16 h-16 text-muted-foreground" />
                        <h3 className="text-lg font-semibold">{t('noItemsTitle')}</h3>
                        <p className="text-muted-foreground max-w-md">
                            {t('noItemsDescription')}
                        </p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
