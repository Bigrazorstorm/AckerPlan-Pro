import { setRequestLocale } from 'next-intl/server';
import { GloezDetailClientContent } from '@/components/foerderwesen/gloez-detail-client-content';
import { GloezStandard } from '@/services/gap-types';

export default async function GloezDetailPage({
  params: { locale, standard }
}: {
  params: { locale: string; standard: string }
}) {
  setRequestLocale(locale);
  
  // Validate standard parameter
  const validStandards = Object.values(GloezStandard);
  if (!validStandards.includes(standard as GloezStandard)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <h1 className="text-2xl font-bold">Ungültiger GLÖZ-Standard</h1>
        <p className="text-muted-foreground">Der angeforderte Standard existiert nicht.</p>
      </div>
    );
  }
  
  return <GloezDetailClientContent standard={standard as GloezStandard} />;
}

// Generate static params for all GLÖZ standards
export async function generateStaticParams() {
  return Object.values(GloezStandard).map((standard) => ({
    standard,
  }));
}
