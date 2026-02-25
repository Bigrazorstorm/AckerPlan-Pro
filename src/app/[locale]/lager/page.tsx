import { LagerClientContent } from '@/components/lager/lager-client-content';
import { getTranslations, setRequestLocale } from 'next-intl/server';

export default async function LagerPage({params: {locale}}: {params: {locale: string}}) {
  setRequestLocale(locale);
  const t = await getTranslations({locale, namespace: 'LagerPage'});
  
  return (
    <div className="space-y-6">
       <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">{t('title')}</h1>
        <p className="text-muted-foreground">
          {t('description')}
        </p>
      </div>
      <LagerClientContent />
    </div>
  );
}
