import { getTranslations, setRequestLocale } from 'next-intl/server';
import { PersonalClientContent } from '@/components/personal/personal-client-content';
import { PageLayout } from '@/components/layout/page-layout';

export default async function PersonalPage({params: {locale}}: {params: {locale: string}}) {
  setRequestLocale(locale);
  const t = await getTranslations({locale, namespace: 'PersonalPage'});
  
  return (
    <PageLayout title={t('title')} description={t('description')}>
      <PersonalClientContent />
    </PageLayout>
  );
}
