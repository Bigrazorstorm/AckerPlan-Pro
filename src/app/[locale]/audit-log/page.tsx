import { getTranslations } from "next-intl/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AuditLogClientContent } from "@/components/audit-log/audit-log-client-content";

export default async function AuditLogPage({params: {locale}}: {params: {locale: string}}) {
  const t = await getTranslations({locale, namespace: 'AuditLogPage'});
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('title')}</CardTitle>
        <CardDescription>
          {t('description')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <AuditLogClientContent />
      </CardContent>
    </Card>
  );
}
