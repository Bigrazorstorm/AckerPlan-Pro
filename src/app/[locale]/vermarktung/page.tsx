import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Truck } from 'lucide-react';

export default async function VermarktungPage({params: {locale}}: {params: {locale: string}}) {
  setRequestLocale(locale);
  const t = await getTranslations({locale, namespace: 'VermarktungPage'});
  const tGeneral = await getTranslations({locale, namespace: 'General'});
  
  return (
    <div className="space-y-6">
       <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">{t('title')}</h1>
        <p className="text-muted-foreground">
          {t('description')}
        </p>
      </div>
      <Card>
        <CardHeader>
            <CardTitle>{tGeneral('comingSoonTitle')}</CardTitle>
        </CardHeader>
        <CardContent>
            <div className="flex flex-col items-center justify-center text-center gap-4 py-24 border-2 border-dashed rounded-lg">
                <Truck className="w-16 h-16 text-muted-foreground" />
                <p className="text-muted-foreground max-w-md">
                    {tGeneral('comingSoonDescription')}
                </p>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
