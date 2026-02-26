import Link from 'next/link';
import { FieldsClientContent } from "@/components/fields/fields-client-content";
import { Button } from '@/components/ui/button';
import { getTranslations, setRequestLocale } from "next-intl/server";

export default async function FieldsPage({params: {locale}}: {params: {locale: string}}) {
  setRequestLocale(locale);
  const t = await getTranslations({locale, namespace: 'FieldsPage'});
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">{t('title')}</h1>
          <p className="text-muted-foreground">
            {t('description_list')}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button asChild variant="outline" size="sm">
            <Link href={`/${locale}/fields/parcels`}>Flurstücke verwalten</Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link href={`/${locale}/fields/blocks`}>Feldblöcke verwalten</Link>
          </Button>
        </div>
      </div>
      <FieldsClientContent />
    </div>
  );
}
