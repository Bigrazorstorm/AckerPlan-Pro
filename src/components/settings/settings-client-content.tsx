'use client';

import { useSession } from "@/context/session-context";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings } from "lucide-react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";

function PlaceholderContent({ titleKey, descriptionKey }: { titleKey: string; descriptionKey: string; }) {
  const t = useTranslations('SettingsPage');
  return (
    <div className="flex flex-col items-center justify-center text-center gap-4 py-24 border-2 border-dashed rounded-lg">
      <Settings className="w-16 h-16 text-muted-foreground" />
      <h3 className="text-xl font-semibold">{t(titleKey)}</h3>
      <p className="text-muted-foreground max-w-md">
        {t(descriptionKey)}
      </p>
    </div>
  )
}

export function SettingsClientContent() {
  const t = useTranslations('SettingsPage');
  const { session, activeCompany } = useSession();

  const user = session?.user;
  const activeRole = user?.companyRoles.find(cr => cr.companyId === activeCompany?.id)?.role;

  return (
    <Tabs defaultValue="profile" className="space-y-6">
      <TabsList>
        <TabsTrigger value="profile">{t('profileTab')}</TabsTrigger>
        <TabsTrigger value="users">{t('usersTab')}</TabsTrigger>
        <TabsTrigger value="company">{t('companyTab')}</TabsTrigger>
        <TabsTrigger value="billing">{t('billingTab')}</TabsTrigger>
      </TabsList>
      <TabsContent value="profile">
        <Card>
          <CardHeader>
            <CardTitle>{t('profileTitle')}</CardTitle>
            <CardDescription>{t('profileDescription')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">{t('nameLabel')}</Label>
                <Input id="name" value={user?.name || ''} readOnly />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">{t('emailLabel')}</Label>
                <Input id="email" value={user?.email || ''} readOnly />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tenantId">{t('tenantIdLabel')}</Label>
                <Input id="tenantId" value={user?.tenantId || ''} readOnly />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">{t('activeRoleLabel')}</Label>
                <Input id="role" value={activeRole || ''} readOnly />
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="users">
        <Card>
            <CardHeader>
                <CardTitle>{t('manageUsersTitle')}</CardTitle>
                <CardDescription>{t('manageUsersDescription')}</CardDescription>
            </CardHeader>
            <CardContent>
                <PlaceholderContent titleKey="comingSoonTitle" descriptionKey="comingSoonDescription" />
            </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="company">
         <Card>
            <CardHeader>
                <CardTitle>{t('companySettingsTitle')}</CardTitle>
                <CardDescription>{t('companySettingsDescription')}</CardDescription>
            </CardHeader>
            <CardContent>
                <PlaceholderContent titleKey="comingSoonTitle" descriptionKey="comingSoonDescription" />
            </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="billing">
         <Card>
            <CardHeader>
                <CardTitle>{t('billingSettingsTitle')}</CardTitle>
                <CardDescription>{t('billingSettingsDescription')}</CardDescription>
            </CardHeader>
            <CardContent>
                <PlaceholderContent titleKey="comingSoonTitle" descriptionKey="comingSoonDescription" />
            </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
