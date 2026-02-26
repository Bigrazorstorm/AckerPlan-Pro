import { getTranslations, setRequestLocale } from 'next-intl/server';
import { OperationsClientContent } from '@/components/operations/operations-client-content';
import { PageLayout } from '@/components/layout/page-layout';

export default async function OperationsPage({params: {locale}}: {params: {locale: string}}) {
  setRequestLocale(locale);
  const t = await getTranslations({locale, namespace: 'OperationsPage'});
  
  return (
    <PageLayout title={t('title')} description={t('description')}>
      <OperationsClientContent />
    </PageLayout>
  );
}
