import { DocumentationClientContent } from '@/components/documentation/documentation-client-content';
import { getTranslations, setRequestLocale } from 'next-intl/server';

export default async function DokumentationPage({params: {locale}}: {params: {locale: string}}) {
  setRequestLocale(locale);
  const t = await getTranslations({locale, namespace: 'DokumentationPage'});
  
  return (
    <div className="space-y-6">
       <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">{t('title')}</h1>
        <p className="text-muted-foreground">
          {t('description')}
        </p>
      </div>
      <DocumentationClientContent />
    </div>
  );
}
