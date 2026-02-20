'use client';

import { useState, useEffect } from 'react';
import { useSession } from '@/context/session-context';
import dataService from '@/services';
import { User } from '@/services/types';
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, PlusCircle, Users } from 'lucide-react';

function UserTableSkeleton() {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead><Skeleton className="h-4 w-32" /></TableHead>
                    <TableHead><Skeleton className="h-4 w-48" /></TableHead>
                    <TableHead><Skeleton className="h-4 w-24" /></TableHead>
                    <TableHead><span className="sr-only">Actions</span></TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {[...Array(3)].map((_, i) => (
                    <TableRow key={i}>
                        <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-48" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                        <TableCell><Skeleton className="h-8 w-8" /></TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}

export function UserManagementContent() {
    const { activeCompany, loading: sessionLoading, activeRole } = useSession();
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const t = useTranslations('SettingsPage.userManagement');
    const tRoles = useTranslations('Roles');

    const canManageUsers = activeRole === 'Firmen Admin' || activeRole === 'Tenant Admin';

    useEffect(() => {
        if (activeCompany && canManageUsers) {
            const fetchUsers = async () => {
                setLoading(true);
                const data = await dataService.getUsersForCompany(activeCompany.tenantId, activeCompany.id);
                setUsers(data);
                setLoading(false);
            };
            fetchUsers();
        } else if (!sessionLoading) {
            setLoading(false);
        }
    }, [activeCompany, canManageUsers, sessionLoading]);
    
    if (sessionLoading || loading) {
        return (
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle>{t('title')}</CardTitle>
                        <CardDescription>{t('description')}</CardDescription>
                    </div>
                    <Skeleton className="h-9 w-32" />
                </CardHeader>
                <CardContent>
                    <UserTableSkeleton />
                </CardContent>
            </Card>
        );
    }

    if (!canManageUsers) {
        return (
            <Card>
                <CardHeader>
                     <CardTitle>{t('title')}</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col items-center justify-center text-center gap-4 py-24 border-2 border-dashed rounded-lg">
                        <Users className="w-16 h-16 text-muted-foreground" />
                        <h3 className="text-xl font-semibold">{t('accessDeniedTitle')}</h3>
                        <p className="text-muted-foreground max-w-md">
                            {t('accessDeniedDescription')}
                        </p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>{t('title')}</CardTitle>
                    <CardDescription>{t('description')}</CardDescription>
                </div>
                 <Button size="sm" className="gap-1">
                    <PlusCircle className="h-4 w-4" />
                    {t('addUserButton')}
                </Button>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>{t('tableHeaderName')}</TableHead>
                            <TableHead>{t('tableHeaderEmail')}</TableHead>
                            <TableHead>{t('tableHeaderRole')}</TableHead>
                            <TableHead><span className="sr-only">{t('actions')}</span></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users.map((user) => {
                            const role = user.companyRoles.find(cr => cr.companyId === activeCompany?.id)?.role;
                            return (
                                <TableRow key={user.id}>
                                    <TableCell className="font-medium">{user.name}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>{role ? tRoles(role) : '-'}</TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button size="icon" variant="ghost">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>{t('actions')}</DropdownMenuLabel>
                                                <DropdownMenuItem>{t('editRole')}</DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem className="text-destructive">{t('removeUser')}</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
