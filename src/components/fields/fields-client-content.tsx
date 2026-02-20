'use client';

import { useState, useEffect } from 'react';
import { useSession } from '@/context/session-context';
import dataService from '@/services';
import { Field } from '@/services/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import dynamic from 'next/dynamic';

const FieldsMap = dynamic(() => import('@/components/fields/fields-map').then(mod => mod.FieldsMap), {
  ssr: false,
  loading: () => <Skeleton className="w-full aspect-video rounded-lg" />
});

function FieldsSkeleton() {
  return (
    <div className="grid gap-6 lg:grid-cols-5">
      <Card className="lg:col-span-3">
        <CardHeader className="flex flex-row items-center justify-between">
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-9 w-40" />
        </CardHeader>
        <CardContent>
           <Skeleton className="w-full aspect-video rounded-lg" />
        </CardContent>
      </Card>
      <Card className="lg:col-span-2">
        <CardHeader>
           <Skeleton className="h-6 w-1/2" />
        </CardHeader>
        <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead><Skeleton className="h-4 w-24" /></TableHead>
                        <TableHead><Skeleton className="h-4 w-24" /></TableHead>
                        <TableHead><Skeleton className="h-4 w-16" /></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {[...Array(4)].map((_, i) => (
                        <TableRow key={i}>
                            <TableCell><Skeleton className="h-5 w-28" /></TableCell>
                            <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                            <TableCell><Skeleton className="h-5 w-12" /></TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </CardContent>
      </Card>
    </div>
  );
}


export function FieldsClientContent() {
  const { activeCompany, loading: sessionLoading } = useSession();
  const [fields, setFields] = useState<Field[]>([]);
  const [loading, setLoading] = useState(true);
  const t = useTranslations('FieldsPage');
  const { locale } = useParams<{ locale: string }>();

  useEffect(() => {
    if (activeCompany) {
      const fetchFields = async () => {
        setLoading(true);
        const data = await dataService.getFields(activeCompany.tenantId, activeCompany.id);
        setFields(data);
        setLoading(false);
      };
      fetchFields();
    }
  }, [activeCompany]);

  if (sessionLoading || loading) {
    return <FieldsSkeleton />;
  }

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      <Card className="lg:col-span-3">
         <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>{t('mapTitle')}</CardTitle>
             <Button size="sm" className="gap-1">
              <PlusCircle className="h-4 w-4" />
              {t('importButton')}
            </Button>
        </CardHeader>
        <CardContent>
            <div className="aspect-video w-full overflow-hidden rounded-md border">
              <FieldsMap fields={fields} />
            </div>
        </CardContent>
      </Card>
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>{t('listTitle')}</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('listHeaderName')}</TableHead>
                <TableHead>{t('listHeaderCrop')}</TableHead>
                <TableHead className="text-right">{t('listHeaderArea')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {fields.map((field) => (
                <TableRow key={field.id}>
                  <TableCell className="font-medium">
                    <Link href={`/${locale}/fields/${field.id}`} className="hover:underline">
                      {field.name}
                    </Link>
                  </TableCell>
                  <TableCell>{field.crop}</TableCell>
                  <TableCell className="text-right">{field.area.toLocaleString('de-DE')} ha</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
