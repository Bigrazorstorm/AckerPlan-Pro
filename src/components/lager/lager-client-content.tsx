'use client';

import { useState, useEffect } from 'react';
import { useSession } from '@/context/session-context';
import dataService from '@/services';
import { WarehouseItem } from '@/services/types';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, PlusCircle, Archive } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

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
    }, [activeCompany, sessionLoading]);
    
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
                    <Button size="sm" className="gap-1" disabled>
                        <PlusCircle className="h-4 w-4" />
                        {t('addItemButton')}
                    </Button>
                )}
            </CardHeader>
            <CardContent>
                {items.length > 0 ? (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>{t('tableHeaderName')}</TableHead>
                                <TableHead>{t('tableHeaderType')}</TableHead>
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
