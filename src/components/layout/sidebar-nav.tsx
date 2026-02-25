'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { usePathname, useParams } from 'next/navigation';
import Link from 'next/link';
import {
  Leaf,
  LayoutDashboard,
  Map,
  Layers,
  Combine,
  Siren,
  Tractor,
  BarChart3,
  Settings,
  LogOut,
  ChevronDown,
  History,
  Users,
  Archive,
  FileText,
  Landmark,
  Truck,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarSeparator,
} from '@/components/ui/sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useTranslations } from 'next-intl';
import { logout } from '@/app/auth/actions';
import { useSession } from '@/context/session-context';

const navItemsList = [
  { href: '/', icon: LayoutDashboard, labelKey: 'dashboard' },
  { href: '/map', icon: Map, labelKey: 'map' },
  { href: '/fields', icon: Layers, labelKey: 'schlaege' },
  { href: '/operations', icon: Combine, labelKey: 'auftraege' },
  { href: '/observations', icon: Siren, labelKey: 'observations' },
  { href: '/personal', icon: Users, labelKey: 'personal' },
  { href: '/machinery', icon: Tractor, labelKey: 'fuhrpark' },
  { href: '/lager', icon: Archive, labelKey: 'lager' },
  { href: '/reports', icon: BarChart3, labelKey: 'controlling' },
  { href: '/vermarktung', icon: Truck, labelKey: 'vermarktung' },
  { href: '/dokumentation', icon: FileText, labelKey: 'dokumentation' },
  { href: '/foerderwesen', icon: Landmark, labelKey: 'foerderwesen' },
  { href: '/audit-log', icon: History, labelKey: 'auditLog' },
];

export function SidebarNav() {
  const pathname = usePathname();
  const params = useParams();
  const { activeRole } = useSession();
  const [activePath, setActivePath] = useState('');
  const [locale, setLocale] = useState('de');

  const logoutFormRef = React.useRef<HTMLFormElement>(null);
  
  useEffect(() => {
    // This effect runs only on the client, preventing hydration errors.
    if (pathname && params?.locale) {
      const currentLocale = Array.isArray(params.locale) ? params.locale[0] : params.locale;
      const pathWithoutLocale = pathname.replace(`/${currentLocale}`, '') || '/';
      setActivePath(pathWithoutLocale);
      setLocale(currentLocale);
    }
  }, [pathname, params]);

  const userAvatar = PlaceHolderImages.find(p => p.id === 'user-avatar');
  const t = useTranslations('Sidebar');
  
  const navItems = useMemo(() => {
    if (activeRole === 'Jäger') {
      return navItemsList.filter(item => ['/map', '/observations'].includes(item.href));
    }
    return navItemsList;
  }, [activeRole]);


  return (
    <>
      <form action={logout} ref={logoutFormRef} className="hidden" />
      <SidebarHeader>
        <Link href={`/${locale}/`} className="flex items-center gap-2 font-bold text-lg">
          <Leaf className="h-6 w-6 text-primary" />
          <span>{t('title')}</span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {navItems.map((item) => {
            const isActive =
              (item.href === '/' && activePath === '/') ||
              (item.href !== '/' && activePath.startsWith(item.href));
            return (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton asChild isActive={isActive} className="justify-start">
                  <Link href={`/${locale}${item.href === '/' ? '' : item.href}`}>
                    <item.icon className="h-4 w-4" />
                    <span>{t(item.labelKey)}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>
      <SidebarSeparator />
      <SidebarFooter>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="w-full justify-start text-left h-auto py-2 px-3">
              <div className="flex items-center gap-3 w-full">
                <Avatar className="h-8 w-8">
                  {userAvatar && <AvatarImage src={userAvatar.imageUrl} alt="User Avatar" data-ai-hint={userAvatar.imageHint} />}
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <div className="flex-1 overflow-hidden">
                  <p className="font-medium text-sm truncate">{t('userName')}</p>
                  <p className="text-xs text-muted-foreground truncate">{t('userRole')}</p>
                </div>
                <ChevronDown className="h-4 w-4 text-muted-foreground ml-auto" />
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 mb-2" side="top" align="start">
            <DropdownMenuItem asChild>
              <Link href={`/${locale}/settings`}>
                <Settings className="mr-2 h-4 w-4" />
                <span>{t('settings')}</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={() => logoutFormRef.current?.requestSubmit()}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>{t('logout')}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </>
  );
}
