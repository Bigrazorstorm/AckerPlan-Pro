import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Siren } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

export default async function ObservationsPage({params: {locale}}: {params: {locale: string}}) {
  const t = await getTranslations({locale, namespace: 'ObservationsPage'});
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('title')}</CardTitle>
        <CardDescription>
          {t('description')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center text-center gap-4 py-24 border-2 border-dashed rounded-lg">
          <Siren className="w-16 h-16 text-muted-foreground" />
          <h3 className="text-xl font-semibold">{t('comingSoonTitle')}</h3>
          <p className="text-muted-foreground max-w-md">
            {t('comingSoonDescription')}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
