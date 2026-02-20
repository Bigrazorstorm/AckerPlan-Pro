'use client';

import { useState, useEffect } from 'react';
import { useSession } from '@/context/session-context';
import dataService from '@/services';
import { Field } from '@/services/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useParams } from 'next/navigation';

function FieldsSkeleton() {
  return (
      <Card>
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
                    {[...Array(8)].map((_, i) => (
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
      const fetchData = async () => {
        setLoading(true);
        const [fieldsData] = await Promise.all([
            dataService.getFields(activeCompany.tenantId, activeCompany.id),
        ]);
        setFields(fieldsData);
        setLoading(false);
      };
      fetchData();
    }
  }, [activeCompany]);

  if (sessionLoading || loading) {
    return <FieldsSkeleton />;
  }

  return (
      <Card>
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
  );
}
