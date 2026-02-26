import Link from 'next/link';
import { MapClientContent } from "@/components/map/map-client-content";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

export default async function MapPage({params: {locale}}: {params: {locale: string}}) {
  setRequestLocale(locale);
  const t = await getTranslations({locale, namespace: 'MapPage'});
  
  return (
    <div className="space-y-6 flex flex-col" style={{ height: 'calc(100vh - 100px)' }}>
       <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">{t('title')}</h1>
          <p className="text-muted-foreground">
            {t('description')}
          </p>
        </div>
         <Button size="sm" className="gap-1" asChild>
            <Link href={`/${locale}/fields/parcels`}>
              <PlusCircle className="h-4 w-4" />
              {t('importButton')}
            </Link>
          </Button>
      </div>
      <div className="flex-1 min-h-[400px] rounded-lg border overflow-hidden bg-muted/10">
        <MapClientContent />
      </div>
    </div>
  );
}
