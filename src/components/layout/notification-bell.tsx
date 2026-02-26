'use client';

import { useState, useEffect } from 'react';
import { Bell, CheckCheck, AlertTriangle, Info, AlertCircle, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import { mockGapService } from '@/services/mock-gap-service';
import { Deadline } from '@/services/gap-types';
import { useSession } from '@/context/session-context';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';

interface Notification {
  id: string;
  title: string;
  description: string;
  type: 'critical' | 'warning' | 'info';
  date: Date;
  read: boolean;
  deadlineId?: string;
}

function buildNotificationsFromDeadlines(deadlines: Deadline[]): Notification[] {
  const now = new Date();
  return deadlines.map((d) => {
    const daysUntil = Math.ceil((d.date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    const type: 'critical' | 'warning' | 'info' =
      d.priority === 'critical' ? 'critical' : daysUntil <= 14 ? 'warning' : 'info';
    return {
      id: d.id,
      title: d.description,
      description:
        daysUntil <= 0
          ? 'Frist überfällig!'
          : `Fällig in ${daysUntil} ${daysUntil === 1 ? 'Tag' : 'Tagen'} (${format(d.date, 'dd. MMM yyyy', { locale: de })})`,
      type,
      date: d.date,
      read: false,
      deadlineId: d.id,
    };
  });
}

export function NotificationBell() {
  const { activeCompany } = useSession();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [readIds, setReadIds] = useState<Set<string>>(new Set());
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!activeCompany) return;
    mockGapService.getUpcomingDeadlines(activeCompany.id, 30).then((deadlines) => {
      setNotifications(buildNotificationsFromDeadlines(deadlines));
    });
  }, [activeCompany]);

  const unreadCount = notifications.filter((n) => !readIds.has(n.id)).length;

  const markAsRead = (id: string) => {
    setReadIds((prev) => new Set([...prev, id]));
  };

  const markAllRead = () => {
    setReadIds(new Set(notifications.map((n) => n.id)));
  };

  const getIcon = (type: Notification['type']) => {
    if (type === 'critical') return <AlertCircle className="h-4 w-4 text-destructive shrink-0" />;
    if (type === 'warning') return <AlertTriangle className="h-4 w-4 text-orange-500 shrink-0" />;
    return <Info className="h-4 w-4 text-blue-500 shrink-0" />;
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="relative" aria-label="Benachrichtigungen">
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1.5 -right-1.5 h-5 min-w-5 px-1 text-xs flex items-center justify-center"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Benachrichtigungen
            {unreadCount > 0 && (
              <Badge variant="secondary" className="text-xs">
                {unreadCount} neu
              </Badge>
            )}
          </span>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-auto p-0 text-xs text-muted-foreground hover:text-foreground"
              onClick={markAllRead}
            >
              <CheckCheck className="h-3 w-3 mr-1" />
              Alle lesen
            </Button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <ScrollArea className="max-h-80">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
              <Bell className="h-8 w-8 mb-2 opacity-40" />
              <p className="text-sm">Keine Benachrichtigungen</p>
            </div>
          ) : (
            notifications.map((notification) => {
              const isRead = readIds.has(notification.id);
              return (
                <DropdownMenuItem
                  key={notification.id}
                  className={`flex items-start gap-3 p-3 cursor-pointer ${!isRead ? 'bg-muted/50' : ''}`}
                  onClick={() => markAsRead(notification.id)}
                >
                  {getIcon(notification.type)}
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium leading-tight ${isRead ? 'text-muted-foreground' : ''}`}>
                      {notification.title}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5 leading-tight">
                      {notification.description}
                    </p>
                  </div>
                  {!isRead && (
                    <span className="h-2 w-2 rounded-full bg-primary shrink-0 mt-1" />
                  )}
                </DropdownMenuItem>
              );
            })
          )}
        </ScrollArea>
        {notifications.length > 0 && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="justify-center text-sm text-muted-foreground">
              <Calendar className="h-4 w-4 mr-2" />
              Alle Fristen anzeigen
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
