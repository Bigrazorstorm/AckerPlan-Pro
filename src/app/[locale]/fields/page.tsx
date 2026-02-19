import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Map } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

export default async function FieldsPage() {
  const t = await getTranslations('FieldsPage');
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
          <Map className="w-16 h-16 text-muted-foreground" />
          <h3 className="text-xl font-semibold">{t('comingSoonTitle')}</h3>
          <p className="text-muted-foreground max-w-md">
            {t('comingSoonDescription')}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
