'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useSession } from '@/context/session-context';
import dataService from '@/services';
import { Field, Operation } from '@/services/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Tractor } from 'lucide-react';
import Link from 'next/link'; // Standard Next.js link
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { de, enUS } from 'date-fns/locale';

function FieldDetailSkeleton() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="h-9 w-44" />
      </div>
      <div>
        <Skeleton className="h-9 w-64 mb-2" />
        <Skeleton className="h-4 w-96" />
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-1/3" />
          </CardHeader>
          <CardContent className="grid gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex justify-between">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-5 w-32" />
              </div>
            ))}
          </CardContent>
        </Card>
        <Card className="md:col-span-2">
          <CardHeader>
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-4 w-3/4" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function FieldDetailPage() {
  const { id, locale } = useParams<{ id: string, locale: string }>();
  const { activeCompany, loading: sessionLoading } = useSession();
  const [field, setField] = useState<Field | null>(null);
  const [operations, setOperations] = useState<Operation[]>([]);
  const [loading, setLoading] = useState(true);

  const t = useTranslations('FieldDetailPage');
  const tOperationTypes = useTranslations('OperationTypes');
  const tOperationStatuses = useTranslations('OperationStatuses');

  useEffect(() => {
    if (activeCompany) {
      const fetchData = async () => {
        setLoading(true);
        const fieldData = await dataService.getFieldById(activeCompany.tenantId, activeCompany.id, id);
        setField(fieldData);

        if (fieldData) {
          const opsData = await dataService.getOperationsForField(activeCompany.tenantId, activeCompany.id, fieldData.name);
          setOperations(opsData);
        }

        setLoading(false);
      };
      fetchData();
    }
  }, [activeCompany, id]);

  const dateFormatter = (dateString: string) => {
    try {
      return format(new Date(dateString), 'PP', { locale: locale === 'de' ? de : enUS });
    } catch (e) {
      return dateString;
    }
  };

  if (sessionLoading || loading) {
    return <FieldDetailSkeleton />;
  }

  if (!field) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t('notFoundTitle')}</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{t('notFoundDescription')}</p>
          <Button asChild variant="link" className="pl-0 mt-4">
            <Link href={`/${locale}/fields`}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t('backToList')}
            </Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <Button variant="ghost" asChild>
          <Link href={`/${locale}/fields`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t('backToList')}
          </Link>
        </Button>
      </div>

      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">{field.name}</h1>
          <p className="text-muted-foreground">{t('description', { crop: field.crop, area: field.area.toLocaleString(locale) })}</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>{t('detailsTitle')}</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="flex justify-between">
              <span className="text-muted-foreground">{t('cropLabel')}</span>
              <span className="font-medium">{field.crop}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">{t('areaLabel')}</span>
              <span className="font-medium">{field.area.toLocaleString(locale)} ha</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">{t('idLabel')}</span>
              <span className="font-mono text-xs bg-muted text-muted-foreground rounded-md px-2 py-1">{field.id}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>{t('recentOperationsTitle')}</CardTitle>
            <CardDescription>{t('recentOperationsDescription')}</CardDescription>
          </CardHeader>
          <CardContent>
            {operations.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('tableHeaderType')}</TableHead>
                    <TableHead>{t('tableHeaderDate')}</TableHead>
                    <TableHead>{t('tableHeaderMachine')}</TableHead>
                    <TableHead>{t('tableHeaderStatus')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {operations.map((op) => (
                    <TableRow key={op.id}>
                      <TableCell className="font-medium">{tOperationTypes(op.type)}</TableCell>
                      <TableCell>{dateFormatter(op.date)}</TableCell>
                      <TableCell>{op.machine?.name || '-'}</TableCell>
                      <TableCell>
                        <Badge variant={op.status === 'Completed' ? 'default' : 'secondary'} className={op.status === 'Completed' ? 'bg-green-100 text-green-800' : ''}>{tOperationStatuses(op.status)}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="flex flex-col items-center justify-center text-center gap-4 py-16 border-2 border-dashed rounded-lg">
                <Tractor className="w-12 h-12 text-muted-foreground" />
                <h3 className="text-lg font-semibold">{t('noOperationsTitle')}</h3>
                <p className="text-muted-foreground max-w-sm">
                  {t('noOperationsDescription')}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

    </div>
  );
}
