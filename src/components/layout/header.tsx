"use client"

import React from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { PlaceHolderImages } from "@/lib/placeholder-images"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { CircleUser, Settings, LogOut } from "lucide-react"
import { Link } from "next-intl/navigation"
import { useTranslations } from "next-intl"
import { CompanySwitcher } from "./company-switcher"
import { NotificationBell } from "./notification-bell"
import { logout } from "@/app/auth/actions"

export function Header() {
  const userAvatar = PlaceHolderImages.find(p => p.id === 'user-avatar');
  const t = useTranslations('Header');
  const logoutFormRef = React.useRef<HTMLFormElement>(null);

  return (
    <>
      <form action={logout} ref={logoutFormRef} className="hidden" />
      <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
        <div className="md:hidden">
            <SidebarTrigger />
        </div>
        <div className="flex-1" />
        <CompanySwitcher />
        <NotificationBell />
        <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="overflow-hidden rounded-full"
                >
                  <Avatar>
                      {userAvatar && <AvatarImage src={userAvatar.imageUrl} alt="User Avatar" data-ai-hint={userAvatar.imageHint} />}
                      <AvatarFallback>
                          <CircleUser />
                      </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>{t('myAccount')}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild><Link href="/settings"><Settings className="mr-2 h-4 w-4" />{t('settings')}</Link></DropdownMenuItem>
                <DropdownMenuItem>{t('support')}</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={() => logoutFormRef.current?.requestSubmit()}>
                  <LogOut className="mr-2 h-4 w-4" />
                  {t('logout')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
      </header>
    </>
  )
}
