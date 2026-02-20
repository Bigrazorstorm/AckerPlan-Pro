'use client';

import { useSession } from '@/context/session-context';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from '@/components/ui/button';
import { ChevronsUpDown, Building } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Skeleton } from '@/components/ui/skeleton';

export function CompanySwitcher() {
  const { session, activeCompany, switchCompany, loading } = useSession();
  const t = useTranslations('Header');

  if (loading || !session || !activeCompany) {
    return (
        <Skeleton className="h-9 w-[200px]" />
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="w-[200px] justify-start gap-2">
          <Building className="h-4 w-4" />
          <span className="truncate flex-1 text-left">{activeCompany.name}</span>
          <ChevronsUpDown className="h-4 w-4 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[200px]" align="end">
        <DropdownMenuLabel>{t('selectCompany')}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {session.companies.map((company) => (
          <DropdownMenuItem key={company.id} onSelect={() => switchCompany(company.id)}>
            {company.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
