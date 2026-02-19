"use client"

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
import Link from "next/link"
import { useTranslations } from "next-intl"

export function Header() {
  const userAvatar = PlaceHolderImages.find(p => p.id === 'user-avatar');
  const t = useTranslations('Header');

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
       <div className="md:hidden">
          <SidebarTrigger />
       </div>
       <div className="flex-1" />
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
              <DropdownMenuItem>{t('logout')}<LogOut className="ml-auto h-4 w-4" /></DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
    </header>
  )
}
