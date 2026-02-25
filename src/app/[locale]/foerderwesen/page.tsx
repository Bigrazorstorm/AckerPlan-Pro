import { setRequestLocale } from 'next-intl/server';
import { FoerderwesenClientContent } from '@/components/foerderwesen/foerderwesen-client-content';

export default async function FoerderwesenPage({params: {locale}}: {params: {locale: string}}) {
  setRequestLocale(locale);
  
  return <FoerderwesenClientContent />;
}
