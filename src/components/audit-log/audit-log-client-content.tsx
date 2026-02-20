'use client';

import { useState, useEffect } from 'react';
import { useSession } from '@/context/session-context';
import dataService from '@/services';
import { AuditLogEvent } from '@/services/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { useTranslations } from 'next-intl';
import { format } from 'date-fns';
import { de, enUS } from 'date-fns/locale';
import { useParams } from 'next/navigation';

function AuditLogSkeleton() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead><Skeleton className="h-4 w-24" /></TableHead>
          <TableHead><Skeleton className="h-4 w-32" /></TableHead>
          <TableHead><Skeleton className="h-4 w-40" /></TableHead>
          <TableHead><Skeleton className="h-4 w-full" /></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {[...Array(8)].map((_, i) => (
          <TableRow key={i}>
            <TableCell><Skeleton className="h-5 w-24" /></TableCell>
            <TableCell><Skeleton className="h-5 w-32" /></TableCell>
            <TableCell><Skeleton className="h-5 w-40" /></TableCell>
            <TableCell><Skeleton className="h-5 w-full" /></TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export function AuditLogClientContent() {
  const { activeCompany, loading: sessionLoading } = useSession();
  const [logEvents, setLogEvents] = useState<AuditLogEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const t = useTranslations('AuditLogPage');
  const { locale } = useParams<{ locale: string }>();

  useEffect(() => {
    if (activeCompany) {
      const fetchLogs = async () => {
        setLoading(true);
        const data = await dataService.getAuditLog(activeCompany.tenantId, activeCompany.id);
        setLogEvents(data);
        setLoading(false);
      };
      fetchLogs();
    }
  }, [activeCompany]);
  
  const dateFormatter = (dateString: string) => {
    try {
        return format(new Date(dateString), 'PPpp', { locale: locale === 'de' ? de : enUS });
    } catch (e) {
        return dateString;
    }
  }


  if (sessionLoading || loading) {
    return <AuditLogSkeleton />;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{t('tableHeaderUser')}</TableHead>
          <TableHead>{t('tableHeaderAction')}</TableHead>
          <TableHead>{t('tableHeaderDate')}</TableHead>
          <TableHead>{t('tableHeaderDetails')}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {logEvents.map((event) => (
          <TableRow key={event.id}>
            <TableCell className="font-medium">{event.user.name}</TableCell>
            <TableCell>
                <span className="font-mono text-xs bg-muted text-muted-foreground rounded-md px-2 py-1">{event.action}</span>
            </TableCell>
            <TableCell>{dateFormatter(event.date)}</TableCell>
            <TableCell>{event.details}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
