import { OperationsClientContent } from "@/components/operations/operations-client-content";
import { getTranslations } from "next-intl/server";

export default async function OperationsPage({params: {locale}}: {params: {locale: string}}) {
  const t = await getTranslations({locale, namespace: 'OperationsPage'});

  return (
     <div className="space-y-6">
       <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">{t('title')}</h1>
        <p className="text-muted-foreground">
          {t('description')}
        </p>
      </div>
      <OperationsClientContent />
    </div>
  );
}
