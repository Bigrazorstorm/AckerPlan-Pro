import { getTranslations, setRequestLocale } from 'next-intl/server';
import { SettingsClientContent } from '@/components/settings/settings-client-content';

export default async function SettingsPage({params: {locale}}: {params: {locale: string}}) {
  setRequestLocale(locale);
  const t = await getTranslations({locale, namespace: 'SettingsPage'});
  
  return (
    <div className="space-y-6">
       <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">{t('title')}</h1>
        <p className="text-muted-foreground">
          {t('description')}
        </p>
      </div>
      <SettingsClientContent />
    </div>
  );
}
