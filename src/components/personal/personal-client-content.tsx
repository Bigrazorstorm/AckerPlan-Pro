'use client';

import { useState, useEffect, useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { useSession } from '@/context/session-context';
import dataService from '@/services';
import { User, Role } from '@/services/types';
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, PlusCircle, Users, Calendar as CalendarIcon } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { addUser } from '@/app/personal/actions';
import { Badge } from '@/components/ui/badge';
import { format, parseISO } from 'date-fns';
import { de, enUS } from 'date-fns/locale';
import { useParams } from 'next/navigation';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';

const addUserInitialState = {
  message: '',
  errors: {},
};

function AddUserSubmitButton() {
  const { pending } = useFormStatus();
  const t = useTranslations('PersonalPage.addUserForm');
  return (
    <Button type="submit" aria-disabled={pending}>
      {pending ? t('submitting') : t('submit')}
    </Button>
  );
}

function AddUserForm({ closeSheet, tenantId, companyId }: { closeSheet: () => void; tenantId: string; companyId: string; }) {
  const [state, formAction] = useActionState(addUser, addUserInitialState);
  const { toast } = useToast();
  const t = useTranslations('PersonalPage.addUserForm');
  const tRoles = useTranslations('Roles');
  const { locale } = useParams<{ locale: string }>();
  const [expiryDate, setExpiryDate] = useState<Date>();
  
  const roles: Role[] = ["Firmen Admin", "Betriebsleitung", "Mitarbeiter", "Werkstatt", "Leser"];

  useEffect(() => {
    if (state.message && Object.keys(state.errors).length === 0) {
      toast({
        title: t('successToastTitle'),
        description: state.message,
      });
      closeSheet();
    } else if (state.message && state.message.startsWith('Failed to add user:')) {
      toast({
        variant: 'destructive',
        title: t('errorToastTitle'),
        description: state.message,
      });
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
      <input type="hidden" name="pesticideLicenseExpiry" value={expiryDate ? format(expiryDate, "yyyy-MM-dd") : ""} />
      
      <div className="space-y-2">
        <Label htmlFor="name">{t('nameLabel')}</Label>
        <Input id="name" name="name" required placeholder={t('namePlaceholder')} />
        {state.errors?.name && <p className="text-sm text-destructive">{state.errors.name.join(', ')}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">{t('emailLabel')}</Label>
        <Input id="email" name="email" type="email" required placeholder={t('emailPlaceholder')} />
        {state.errors?.email && <p className="text-sm text-destructive">{state.errors.email.join(', ')}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="role">{t('roleLabel')}</Label>
        <Select name="role" required>
          <SelectTrigger>
            <SelectValue placeholder={t('rolePlaceholder')} />
          </SelectTrigger>
          <SelectContent>
            {roles.map((role) => (
              <SelectItem key={role} value={role}>{tRoles(role)}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        {state.errors?.role && <p className="text-sm text-destructive">{state.errors.role.join(', ')}</p>}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="pesticideLicenseNumber">{t('licenseNumberLabel')}</Label>
        <Input id="pesticideLicenseNumber" name="pesticideLicenseNumber" placeholder={t('licenseNumberPlaceholder')} />
        {state.errors?.pesticideLicenseNumber && <p className="text-sm text-destructive">{state.errors.pesticideLicenseNumber.join(', ')}</p>}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="pesticideLicenseExpiry">{t('licenseExpiryLabel')}</Label>
         <Popover>
            <PopoverTrigger asChild>
            <Button
                variant={"outline"}
                className={cn(
                "w-full justify-start text-left font-normal",
                !expiryDate && "text-muted-foreground"
                )}
            >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {expiryDate ? format(expiryDate, "PPP", { locale: locale === 'de' ? de : enUS }) : <span>{t('licenseExpiryPlaceholder')}</span>}
            </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
            <Calendar
                mode="single"
                selected={expiryDate}
                onSelect={setExpiryDate}
                initialFocus
            />
            </PopoverContent>
        </Popover>
        {state.errors?.pesticideLicenseExpiry && <p className="text-sm text-destructive">{state.errors.pesticideLicenseExpiry.join(', ')}</p>}
      </div>

      <AddUserSubmitButton />
    </form>
  );
}

function UserTableSkeleton() {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead><Skeleton className="h-4 w-32" /></TableHead>
                    <TableHead><Skeleton className="h-4 w-48" /></TableHead>
                    <TableHead><Skeleton className="h-4 w-24" /></TableHead>
                    <TableHead><Skeleton className="h-4 w-32" /></TableHead>
                    <TableHead><span className="sr-only">Actions</span></TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {[...Array(3)].map((_, i) => (
                    <TableRow key={i}>
                        <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-48" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                        <TableCell><Skeleton className="h-6 w-32 rounded-full" /></TableCell>
                        <TableCell><Skeleton className="h-8 w-8" /></TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}

export function PersonalClientContent() {
    const { activeCompany, loading: sessionLoading, activeRole } = useSession();
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAddSheetOpen, setAddSheetOpen] = useState(false);
    const t = useTranslations('PersonalPage');
    const tRoles = useTranslations('Roles');
    const { locale } = useParams<{ locale: string }>();

    const canManageUsers = activeRole === 'Firmen Admin' || activeRole === 'Tenant Admin';

    useEffect(() => {
        if (activeCompany) {
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
    }, [activeCompany, sessionLoading, isAddSheetOpen]);

    const getExpiryStatus = (expiryDate?: string) => {
        if (!expiryDate) return { text: '-', variant: 'secondary' as const, className: 'bg-transparent' };

        try {
            const date = parseISO(expiryDate);
            const today = new Date();
            today.setHours(0,0,0,0);
            const sixMonthsFromNow = new Date();
            sixMonthsFromNow.setMonth(today.getMonth() + 6);

            const formattedDate = format(date, 'PP', { locale: locale === 'de' ? de : enUS });

            if (date < today) {
                return { text: formattedDate, variant: 'destructive' as const, className: '' };
            }
            if (date < sixMonthsFromNow) {
                return { text: formattedDate, variant: 'default' as const, className: 'bg-yellow-500 text-yellow-950 hover:bg-yellow-500/80 border-yellow-500' };
            }
            return { text: formattedDate, variant: 'default' as const, className: 'bg-green-100 text-green-800' };
        } catch (error) {
            return { text: 'Ungültig', variant: 'destructive' as const, className: '' };
        }
    };
    
    if (sessionLoading || loading) {
        return (
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div/>
                    <Skeleton className="h-9 w-32" />
                </CardHeader>
                <CardContent>
                    <UserTableSkeleton />
                </CardContent>
            </Card>
        );
    }
    
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div/>
                {canManageUsers ? (
                 <Sheet open={isAddSheetOpen} onOpenChange={setAddSheetOpen}>
                    <SheetTrigger asChild>
                        <Button size="sm" className="gap-1">
                            <PlusCircle className="h-4 w-4" />
                            {t('addUserButton')}
                        </Button>
                    </SheetTrigger>
                    <SheetContent>
                        <SheetHeader>
                            <SheetTitle>{t('addUserSheetTitle')}</SheetTitle>
                        </SheetHeader>
                        <div className="py-4">
                            {activeCompany && <AddUserForm closeSheet={() => setAddSheetOpen(false)} tenantId={activeCompany.tenantId} companyId={activeCompany.id} />}
                        </div>
                    </SheetContent>
                </Sheet>
                ) : null}
            </CardHeader>
            <CardContent>
                {users.length > 0 ? (
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>{t('tableHeaderName')}</TableHead>
                            <TableHead>{t('tableHeaderEmail')}</TableHead>
                            <TableHead>{t('tableHeaderRole')}</TableHead>
                            <TableHead>{t('tableHeaderLicenseExpiry')}</TableHead>
                            {canManageUsers && <TableHead><span className="sr-only">{t('actions')}</span></TableHead>}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users.map((user) => {
                            const role = user.companyRoles.find(cr => cr.companyId === activeCompany?.id)?.role;
                            const expiryStatus = getExpiryStatus(user.pesticideLicenseExpiry);
                            return (
                                <TableRow key={user.id}>
                                    <TableCell className="font-medium">{user.name}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>{role ? tRoles(role) : '-'}</TableCell>
                                    <TableCell>
                                        <Badge variant={expiryStatus.variant} className={expiryStatus.className}>{expiryStatus.text}</Badge>
                                    </TableCell>
                                    {canManageUsers && (
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
                                    )}
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
                ) : (
                    <div className="flex flex-col items-center justify-center text-center gap-4 py-24 border-2 border-dashed rounded-lg">
                        <Users className="w-16 h-16 text-muted-foreground" />
                        <h3 className="text-lg font-semibold">{t('noUsersTitle')}</h3>
                        <p className="text-muted-foreground max-w-md">
                            {t('noUsersDescription')}
                        </p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
