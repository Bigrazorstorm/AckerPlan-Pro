'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { 
  Bell, 
  BellOff, 
  Check, 
  Loader2,
  Smartphone,
  Monitor,
  Calendar,
  AlertTriangle,
  Info,
  CheckCircle2,
  Settings
} from 'lucide-react';

interface NotificationCategory {
  id: string;
  label: string;
  description: string;
  enabled: boolean;
}

interface RecentNotification {
  id: string;
  title: string;
  message: string;
  time: Date;
  read: boolean;
  type: 'info' | 'warning' | 'success';
}

// Default notification categories
const DEFAULT_CATEGORIES: NotificationCategory[] = [
  {
    id: 'wildschaden',
    label: 'Wildschäden',
    description: 'Neue Wildschadenmeldungen aus Ihrem Revier',
    enabled: true,
  },
  {
    id: 'wartung',
    label: 'Wartung fällig',
    description: 'Maschinenwartung steht an',
    enabled: true,
  },
  {
    id: 'qualifikation',
    label: 'Qualifikationen',
    description: 'Sachkundenachweis läuft ab',
    enabled: true,
  },
  {
    id: 'sammelantrag',
    label: 'Fristen',
    description: 'Sammelantrag und andere Fristen',
    enabled: true,
  },
  {
    id: 'gloez',
    label: 'GLÖZ-Warnungen',
    description: 'Compliance-Warnungen für GLÖZ-Standards',
    enabled: false,
  },
];

const MOCK_RECENT_NOTIFICATIONS: RecentNotification[] = [
  {
    id: '1',
    title: 'Neuer Wildschaden gemeldet',
    message: 'Auf Schlag Mühlfeld Ost wurde Wildschaden durch Wildschweine erfasst.',
    time: new Date(Date.now() - 3600000),
    read: false,
    type: 'warning',
  },
  {
    id: '2',
    title: 'Wartung fällig',
    message: 'John Deere 6130R - Ölwechsel nach 250h fällig.',
    time: new Date(Date.now() - 86400000),
    read: false,
    type: 'info',
  },
  {
    id: '3',
    title: 'Auftrag abgeschlossen',
    message: 'Pflügen auf Mühlfeld Ost wurde abgeschlossen.',
    time: new Date(Date.now() - 172800000),
    read: true,
    type: 'success',
  },
];

export function NotificationSettings() {
  const [categories, setCategories] = useState<NotificationCategory[]>(DEFAULT_CATEGORIES);
  const [loading, setLoading] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [recentNotifications, setRecentNotifications] = useState<RecentNotification[]>(MOCK_RECENT_NOTIFICATIONS);

  // Check permission on mount
  useEffect(() => {
    if ('Notification' in window) {
      setPermission(Notification.permission);
    }
  }, []);

  // Request permission
  const handleRequestPermission = async () => {
    if (!('Notification' in window)) {
      alert('Dieser Browser unterstützt keine Benachrichtigungen.');
      return;
    }

    setLoading(true);
    try {
      const result = await Notification.requestPermission();
      setPermission(result);
    } catch (error) {
      console.error('Error requesting notification permission:', error);
    } finally {
      setLoading(false);
    }
  };

  // Toggle category
  const toggleCategory = (id: string) => {
    setCategories(prev => 
      prev.map(cat => 
        cat.id === id ? { ...cat, enabled: !cat.enabled } : cat
      )
    );
  };

  // Mark as read
  const markAsRead = (id: string) => {
    setRecentNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  // Mark all as read
  const markAllAsRead = () => {
    setRecentNotifications(prev =>
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  // Get icon for type
  const getTypeIcon = (type: RecentNotification['type']) => {
    switch (type) {
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-amber-500" />;
      case 'success':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      default:
        return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  // Format time
  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    if (diff < 3600000) {
      const minutes = Math.floor(diff / 60000);
      return `vor ${minutes} Min.`;
    } else if (diff < 86400000) {
      const hours = Math.floor(diff / 3600000);
      return `vor ${hours} Std.`;
    } else {
      return date.toLocaleDateString('de-DE');
    }
  };

  const unreadCount = recentNotifications.filter(n => !n.read).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Benachrichtigungen
          </h2>
          <p className="text-sm text-muted-foreground">
            Verwalten Sie Ihre Benachrichtigungseinstellungen
          </p>
        </div>
      </div>

      {/* Permission Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="h-5 w-5" />
            Berechtigungen
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Browser-Benachrichtigungen</p>
              <p className="text-sm text-muted-foreground">
                Erlaubt Push-Benachrichtigungen von dieser App
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={
                permission === 'granted' ? 'default' : 
                permission === 'denied' ? 'destructive' : 'secondary'
              }>
                {permission === 'granted' ? 'Erlaubt' : 
                 permission === 'denied' ? 'Blockiert' : 'Nicht angefragt'}
              </Badge>
              {permission !== 'granted' && (
                <Button 
                  size="sm" 
                  onClick={handleRequestPermission}
                  disabled={loading || permission === 'denied'}
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    'Aktivieren'
                  )}
                </Button>
              )}
            </div>
          </div>
          
          {permission === 'denied' && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm text-amber-800">
              Benachrichtigungen wurden blockiert. Bitte ändern Sie die Berechtigungen in Ihren Browser-Einstellungen.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Categories */}
      <Card>
        <CardHeader>
          <CardTitle>Benachrichtigungskategorien</CardTitle>
          <CardDescription>
            Wählen Sie, über welche Ereignisse Sie informiert werden möchten
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {categories.map((category) => (
            <div key={category.id} className="flex items-center justify-between">
              <div>
                <p className="font-medium">{category.label}</p>
                <p className="text-sm text-muted-foreground">{category.description}</p>
              </div>
              <Switch
                checked={category.enabled}
                onCheckedChange={() => toggleCategory(category.id)}
                disabled={permission !== 'granted'}
              />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Recent Notifications */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Letzte Benachrichtigungen</CardTitle>
            <CardDescription>
              Ihre neuesten Benachrichtigungen
            </CardDescription>
          </div>
          {unreadCount > 0 && (
            <Button variant="outline" size="sm" onClick={markAllAsRead}>
              <Check className="h-4 w-4 mr-2" />
              Alle als gelesen markieren
            </Button>
          )}
        </CardHeader>
        <CardContent>
          {recentNotifications.length > 0 ? (
            <div className="space-y-3">
              {recentNotifications.map((notif) => (
                <div 
                  key={notif.id}
                  className={`flex items-start gap-3 p-3 rounded-lg ${
                    notif.read ? 'bg-muted/30' : 'bg-muted'
                  }`}
                  onClick={() => markAsRead(notif.id)}
                >
                  {getTypeIcon(notif.type)}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{notif.title}</p>
                      {!notif.read && (
                        <span className="w-2 h-2 rounded-full bg-blue-500" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {notif.message}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatTime(notif.time)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <BellOff className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Keine Benachrichtigungen</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
