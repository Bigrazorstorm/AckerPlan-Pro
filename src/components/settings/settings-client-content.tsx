'use client';

import { useState } from "react";
import { useSession } from "@/context/session-context";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, Users, Building2, CreditCard, Shield, Bell, Database, Download } from "lucide-react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Switch } from "../ui/switch";
import { Separator } from "../ui/separator";
import { Button } from "../ui/button";
import Link from 'next/link';

export function SettingsClientContent() {
  const t = useTranslations('SettingsPage');
  const { session, activeCompany } = useSession();
  const [wjStart, setWjStart] = useState('1');

  const user = session?.user;
  const activeRole = user?.companyRoles.find(cr => cr.companyId === activeCompany?.id)?.role;

  return (
    <Tabs defaultValue="profile" className="space-y-6">
      <TabsList className="flex-wrap">
        <TabsTrigger value="profile">{t('profileTab')}</TabsTrigger>
        <TabsTrigger value="company">{t('companyTab')}</TabsTrigger>
        <TabsTrigger value="users">{t('usersTab')}</TabsTrigger>
        <TabsTrigger value="notifications">Benachrichtigungen</TabsTrigger>
        <TabsTrigger value="data">Daten & Export</TabsTrigger>
      </TabsList>

      {/* Profil Tab */}
      <TabsContent value="profile">
        <div className="space-y-6">
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
                  <Input id="tenantId" value={user?.tenantId || ''} readOnly className="font-mono text-xs" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">{t('activeRoleLabel')}</Label>
                  <Input id="role" value={activeRole || ''} readOnly />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Passwort ändern</CardTitle>
              <CardDescription>Ändern Sie Ihr Passwort für den Zugang zu AgroTrack.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Aktuelles Passwort</Label>
                  <Input id="currentPassword" type="password" />
                </div>
                <div />
                <div className="space-y-2">
                  <Label htmlFor="newPassword">Neues Passwort</Label>
                  <Input id="newPassword" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Passwort bestätigen</Label>
                  <Input id="confirmPassword" type="password" />
                </div>
              </div>
              <Button>Passwort ändern</Button>
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      {/* Firma Tab - Erweitert per Checklist 18.1 */}
      <TabsContent value="company">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle><Building2 className="inline mr-2 h-5 w-5" />Betriebsdaten</CardTitle>
              <CardDescription>Stammdaten Ihres Betriebs</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Betriebsname</Label>
                  <Input defaultValue={activeCompany?.name || 'Musterbetrieb GbR'} />
                </div>
                <div className="space-y-2">
                  <Label>Betriebsnummer (InVeKoS)</Label>
                  <Input defaultValue="276012345678" className="font-mono" />
                </div>
                <div className="space-y-2">
                  <Label>Adresse</Label>
                  <Input defaultValue="Dorfstraße 12, 99100 Friedrichstal" />
                </div>
                <div className="space-y-2">
                  <Label>Bundesland</Label>
                  <Select defaultValue="TH">
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="TH">Thüringen</SelectItem>
                      <SelectItem value="SN">Sachsen</SelectItem>
                      <SelectItem value="SA">Sachsen-Anhalt</SelectItem>
                      <SelectItem value="BB">Brandenburg</SelectItem>
                      <SelectItem value="MV">Mecklenburg-Vorpommern</SelectItem>
                      <SelectItem value="BY">Bayern</SelectItem>
                      <SelectItem value="NI">Niedersachsen</SelectItem>
                      <SelectItem value="NW">Nordrhein-Westfalen</SelectItem>
                      <SelectItem value="HE">Hessen</SelectItem>
                      <SelectItem value="BW">Baden-Württemberg</SelectItem>
                      <SelectItem value="RP">Rheinland-Pfalz</SelectItem>
                      <SelectItem value="SL">Saarland</SelectItem>
                      <SelectItem value="SH">Schleswig-Holstein</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>USt-ID</Label>
                  <Input defaultValue="DE123456789" className="font-mono" />
                </div>
                <div className="space-y-2">
                  <Label>DATEV-Nummer</Label>
                  <Input placeholder="z.B. 12345" className="font-mono" />
                </div>
              </div>
              <Separator />
              <div className="space-y-4">
                <h4 className="font-semibold">Wirtschaftsjahr</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Start-Monat Wirtschaftsjahr</Label>
                    <Select value={wjStart} onValueChange={setWjStart}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Januar (Kalenderjahr)</SelectItem>
                        <SelectItem value="7">Juli</SelectItem>
                        <SelectItem value="10">Oktober (Agrares WJ)</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">
                      {wjStart === '1' ? 'Wirtschaftsjahr = Kalenderjahr (Jan–Dez)' :
                       wjStart === '10' ? 'Agrares WJ: Oktober bis September' :
                       'WJ: Juli bis Juni'}
                    </p>
                  </div>
                </div>
              </div>
              <Button>Änderungen speichern</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Maßnahmen-Typen</CardTitle>
              <CardDescription>Eigene Maßnahmen-Typen für Arbeitsaufträge verwalten</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {['Bodenbearbeitung', 'Aussaat', 'Düngung', 'Pflanzenschutz', 'Ernte', 'Transport', 'Mähen', 'Ballenpressen'].map(typ => (
                  <div key={typ} className="flex items-center justify-between py-2 px-3 bg-muted/50 rounded-lg">
                    <span className="text-sm font-medium">{typ}</span>
                    <span className="text-xs text-muted-foreground">Standard</span>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="mt-4">Eigene Maßnahme hinzufügen</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Standard-Stundensätze</CardTitle>
              <CardDescription>Kalkulatorische Stundensätze für Kostenrechnung</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Lohn-Pauschalwert (€/h)</Label>
                  <Input type="number" defaultValue="28" className="font-tabular" />
                </div>
                <div className="space-y-2">
                  <Label>Maschinen-Pauschale (€/h)</Label>
                  <Input type="number" defaultValue="45" className="font-tabular" />
                </div>
                <div className="space-y-2">
                  <Label>Dieselpreis (€/l)</Label>
                  <Input type="number" defaultValue="1.45" step="0.01" className="font-tabular" />
                </div>
              </div>
              <Button>Stundensätze speichern</Button>
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      {/* Benutzer Tab */}
      <TabsContent value="users">
        <Card>
          <CardHeader>
            <CardTitle>{t('manageUsersTitle')}</CardTitle>
            <CardDescription>{t('manageUsersDescription')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center text-center gap-4 py-16 border-2 border-dashed rounded-lg">
              <Users className="w-12 h-12 text-muted-foreground" />
              <h3 className="text-lg font-semibold">{t('userManagementMovedTitle')}</h3>
              <p className="text-muted-foreground max-w-md text-sm">{t('userManagementMovedDescription')}</p>
              <Button asChild><Link href="/personal">{t('goToPersonalButton')}</Link></Button>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Benachrichtigungen Tab */}
      <TabsContent value="notifications">
        <Card>
          <CardHeader>
            <CardTitle><Bell className="inline mr-2 h-5 w-5" />Benachrichtigungen</CardTitle>
            <CardDescription>Konfigurieren Sie, welche Benachrichtigungen Sie erhalten möchten.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">Kritische Alerts</h4>
              {[
                { label: 'Sachkundenachweis läuft ab', desc: 'Warnung 60 Tage vor Ablauf' },
                { label: 'Maschinen-Wartung überfällig', desc: 'Sofortige Benachrichtigung' },
                { label: 'PSM-Zulassung endet', desc: 'Warnung bei Ablauf der Zulassung' },
                { label: 'GLÖZ-Verstoß droht', desc: 'Automatische Compliance-Prüfung' },
              ].map(item => (
                <div key={item.label} className="flex items-center justify-between py-3">
                  <div>
                    <p className="font-medium text-sm">{item.label}</p>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              ))}
            </div>
            <Separator />
            <div className="space-y-4">
              <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">Operative Alerts</h4>
              {[
                { label: 'Mindestbestand Lager unterschritten', desc: 'Bei Materialknappheit' },
                { label: 'Sperrfrist beginnt', desc: '7 Tage vor Beginn' },
                { label: 'Sammelantrag-Frist', desc: '30 Tage vor Fristende' },
                { label: 'Neuer Wildschaden', desc: 'Bei Schadensmeldung auf eigenen Flächen' },
                { label: 'Aufträge warten auf Freigabe', desc: 'Tägliche Zusammenfassung' },
              ].map(item => (
                <div key={item.label} className="flex items-center justify-between py-3">
                  <div>
                    <p className="font-medium text-sm">{item.label}</p>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              ))}
            </div>
            <Separator />
            <div className="space-y-4">
              <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">Push-Benachrichtigungen</h4>
              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="font-medium text-sm">Push-Benachrichtigungen aktivieren</p>
                  <p className="text-xs text-muted-foreground">Auch wenn die App geschlossen ist</p>
                </div>
                <Switch />
              </div>
            </div>
            <Button>Einstellungen speichern</Button>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Daten & Export Tab */}
      <TabsContent value="data">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle><Database className="inline mr-2 h-5 w-5" />Datenexport</CardTitle>
              <CardDescription>Exportieren Sie Ihre Betriebsdaten (DSGVO Art. 20)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button variant="outline"><Download className="mr-2 h-4 w-4" />Vollständigen Datenexport erstellen (ZIP)</Button>
              <p className="text-xs text-muted-foreground">
                Enthält alle Betriebsdaten, Arbeitsaufträge, Beobachtungen, Maschinendaten und Personalinformationen.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Wirtschaftsjahr abschließen</CardTitle>
              <CardDescription>Frieren Sie das aktuelle Wirtschaftsjahr ein und archivieren Sie die Daten.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-warning/10 border border-warning/20 rounded-lg">
                <p className="text-sm font-medium text-warning">Achtung: Nach dem Abschließen können keine Daten mehr bearbeitet werden.</p>
                <p className="text-xs text-muted-foreground mt-1">Archivierte Wirtschaftsjahre bleiben lesend zugänglich.</p>
              </div>
              <Button variant="outline">WJ 2024/25 abschließen</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle><Shield className="inline mr-2 h-5 w-5" />Datenschutz</CardTitle>
              <CardDescription>DSGVO-Rechte und Datenschutzinformationen</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="link" className="p-0 h-auto">Datenschutzerklärung anzeigen</Button>
              <br />
              <Button variant="link" className="p-0 h-auto text-destructive">Konto und alle Daten löschen</Button>
            </CardContent>
          </Card>
        </div>
      </TabsContent>
    </Tabs>
  );
}
