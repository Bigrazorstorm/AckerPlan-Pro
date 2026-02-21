import { MapClientContent } from "@/components/map/map-client-content";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

export default async function MapPage({params: {locale}}: {params: {locale: string}}) {
  setRequestLocale(locale);
  const t = await getTranslations({locale, namespace: 'MapPage'});
  
  return (
    <div className="space-y-6 h-full flex flex-col">
       <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">{t('title')}</h1>
          <p className="text-muted-foreground">
            {t('description')}
          </p>
        </div>
         <Button size="sm" className="gap-1">
            <PlusCircle className="h-4 w-4" />
            {t('importButton')}
          </Button>
      </div>
      <div className="flex-1 min-h-0 rounded-lg border overflow-hidden">
        <MapClientContent />
      </div>
    </div>
  );
}
