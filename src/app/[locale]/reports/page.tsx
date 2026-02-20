import { ReportsClientContent } from '@/components/reports/reports-client-content';
import { getTranslations, setRequestLocale } from 'next-intl/server';

export default async function ReportsPage({params: {locale}}: {params: {locale: string}}) {
  setRequestLocale(locale);
  const t = await getTranslations({locale, namespace: 'ReportsPage'});
  
  return (
    <div className="space-y-6">
       <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">{t('title')}</h1>
        <p className="text-muted-foreground">
          {t('description')}
        </p>
      </div>
      <ReportsClientContent />
    </div>
  );
}
