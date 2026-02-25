'use client';

import React from 'react';
import { usePathname, useParams } from 'next/navigation';
import {
  Leaf,
  LayoutDashboard,
  Map,
  Combine,
  Users,
  Archive,
  BarChart3,
  Settings,
} from 'lucide-react';
import { BottomNav, type BottomNavItem } from '@/components/ui/bottom-nav';
import { useTranslations } from 'next-intl';

/**
 * Mobile Bottom Navigation Layout Wrapper
 * Zeigt BottomNav nur auf Mobile (<= md breakpoint)
 * Wird in der Main Content Area verwendet
 */
export function MobileNavLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const params = useParams();
  const locale = params.locale as string; // Locale für Link-Erstellung
  const t = useTranslations('Navigation');

  // Entferne Locale aus pathname um aktiven Link zu detektieren
  const pathWithoutLocale = pathname.replace(`/${locale}`, '') || '/';

  // Navigation Items für Bottom Bar
  const navItems: BottomNavItem[] = [
    {
      label: t('dashboard'),
      icon: LayoutDashboard,
      href: `/${locale}`,
      isActive: pathWithoutLocale === '/',
    },
    {
      label: t('fields'),
      icon: Leaf,
      href: `/${locale}/fields`,
      isActive: pathWithoutLocale.startsWith('/fields'),
    },
    {
      label: t('map'),
      icon: Map,
      href: `/${locale}/map`,
      isActive: pathWithoutLocale.startsWith('/map'),
    },
    {
      label: t('operations'),
      icon: Combine,
      href: `/${locale}/operations`,
      isActive: pathWithoutLocale.startsWith('/operations'),
    },
    {
      label: t('personal'),
      icon: Users,
      href: `/${locale}/personal`,
      isActive: pathWithoutLocale.startsWith('/personal'),
    },
  ];

  return (
    <>
      {/* Content mit Padding unten für BottomNav */}
      <div className="pb-20 md:pb-0">{children}</div>

      {/* Mobile Bottom Navigation */}
      <BottomNav items={navItems} className="hidden md:hidden" />
    </>
  );
}
