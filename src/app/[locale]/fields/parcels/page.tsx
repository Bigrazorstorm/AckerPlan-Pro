import { CadastralParcelsClientContent } from '@/components/fields/cadastral-parcels-client-content';
import { getTranslations, setRequestLocale } from 'next-intl/server';

export default async function ParcelsPage({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'FieldsPage' });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Flurstücke</h1>
        <p className="text-muted-foreground">
          {t('description_list')} – rechtliche Parzellen inkl. Geometrie.
        </p>
      </div>
      <CadastralParcelsClientContent />
    </div>
  );
}
