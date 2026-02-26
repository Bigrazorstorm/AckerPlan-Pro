'use client';

import { useState, useEffect } from 'react';
import { useSession } from '@/context/session-context';
import { mockGapService } from '@/services/mock-gap-service';
import { Deadline, DeadlineType } from '@/services/gap-types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Calendar, CheckCircle2, Clock, AlertTriangle, AlertCircle } from 'lucide-react';
import { format, differenceInDays, isPast } from 'date-fns';
import { de } from 'date-fns/locale';

const DEADLINE_TYPE_LABELS: Record<DeadlineType, string> = {
  [DeadlineType.APPLICATION_SUBMISSION]: 'Antragstellung',
  [DeadlineType.MODIFICATION]: 'Änderungsfrist',
  [DeadlineType.GLOEZ_COMPLIANCE]: 'GLÖZ-Nachweis',
  [DeadlineType.ECO_SCHEME_DOCUMENTATION]: 'Öko-Regelung Dokumentation',
  [DeadlineType.INSPECTION_PREPARATION]: 'Kontrollvorbereitung',
  [DeadlineType.PAYMENT_EXPECTED]: 'Auszahlung erwartet',
};

function getStatusColor(deadline: Deadline): { bg: string; text: string; label: string } {
  if (deadline.completed) {
    return { bg: 'bg-green-50 border-green-200 dark:bg-green-950/20', text: 'text-green-700', label: 'Erledigt' };
  }
  if (isPast(deadline.date)) {
    return { bg: 'bg-red-50 border-red-200 dark:bg-red-950/20', text: 'text-red-700', label: 'Überfällig' };
  }
  const days = differenceInDays(deadline.date, new Date());
  if (days < 14) {
    return { bg: 'bg-red-50 border-red-200 dark:bg-red-950/20', text: 'text-red-600', label: `${days} Tage` };
  }
  if (days < 30) {
    return { bg: 'bg-orange-50 border-orange-200 dark:bg-orange-950/20', text: 'text-orange-600', label: `${days} Tage` };
  }
  if (days < 60) {
    return { bg: 'bg-yellow-50 border-yellow-200 dark:bg-yellow-950/20', text: 'text-yellow-700', label: `${days} Tage` };
  }
  return { bg: 'bg-green-50 border-green-200 dark:bg-green-950/20', text: 'text-green-700', label: `${days} Tage` };
}

function StatusIcon({ deadline }: { deadline: Deadline }) {
  if (deadline.completed) return <CheckCircle2 className="h-5 w-5 text-green-600" />;
  if (isPast(deadline.date)) return <AlertTriangle className="h-5 w-5 text-red-600" />;
  const days = differenceInDays(deadline.date, new Date());
  if (days < 14) return <AlertTriangle className="h-5 w-5 text-red-500" />;
  if (days < 30) return <AlertCircle className="h-5 w-5 text-orange-500" />;
  return <Clock className="h-5 w-5 text-green-600" />;
}

function LoadingSkeleton() {
  return (
    <div className="space-y-3">
      {[...Array(5)].map((_, i) => (
        <Skeleton key={i} className="h-20 w-full" />
      ))}
    </div>
  );
}

export function FristenClientContent() {
  const { activeCompany } = useSession();
  const [deadlines, setDeadlines] = useState<Deadline[]>([]);
  const [loading, setLoading] = useState(true);
  const [completingId, setCompletingId] = useState<string | null>(null);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const data = await mockGapService.getDeadlines(2026);
        setDeadlines(data);
      } catch (err) {
        console.error('Failed to load deadlines:', err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const markCompleted = async (id: string) => {
    setCompletingId(id);
    try {
      const updated = await mockGapService.completeDeadline(id);
      setDeadlines((prev) => prev.map((d) => (d.id === id ? updated : d)));
    } catch (err) {
      console.error('Failed to mark deadline:', err);
    } finally {
      setCompletingId(null);
    }
  };

  const overdue = deadlines.filter((d) => !d.completed && isPast(d.date));
  const upcoming14 = deadlines.filter((d) => !d.completed && !isPast(d.date) && differenceInDays(d.date, new Date()) < 14);
  const upcoming30 = deadlines.filter((d) => !d.completed && !isPast(d.date) && differenceInDays(d.date, new Date()) >= 14 && differenceInDays(d.date, new Date()) < 30);
  const later = deadlines.filter((d) => !d.completed && !isPast(d.date) && differenceInDays(d.date, new Date()) >= 30);
  const completed = deadlines.filter((d) => d.completed);

  if (!activeCompany) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-muted-foreground">Bitte wählen Sie zuerst ein Unternehmen aus.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
          Fristenkalender 2026
        </h1>
        <p className="text-muted-foreground">
          Alle landwirtschaftlichen Fristen für Thüringen im Überblick
        </p>
      </div>

      {/* Summary */}
      <div className="grid gap-3 sm:grid-cols-4">
        <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 border border-red-200 dark:bg-red-950/20">
          <div className="h-3 w-3 rounded-full bg-red-500 flex-shrink-0" />
          <div>
            <div className="text-xs text-muted-foreground">Überfällig</div>
            <div className="font-bold text-red-700">{overdue.length}</div>
          </div>
        </div>
        <div className="flex items-center gap-2 p-3 rounded-lg bg-orange-50 border border-orange-200 dark:bg-orange-950/20">
          <div className="h-3 w-3 rounded-full bg-orange-500 flex-shrink-0" />
          <div>
            <div className="text-xs text-muted-foreground">Dringend (&lt;14 Tage)</div>
            <div className="font-bold text-orange-700">{upcoming14.length}</div>
          </div>
        </div>
        <div className="flex items-center gap-2 p-3 rounded-lg bg-yellow-50 border border-yellow-200 dark:bg-yellow-950/20">
          <div className="h-3 w-3 rounded-full bg-yellow-500 flex-shrink-0" />
          <div>
            <div className="text-xs text-muted-foreground">Bald (&lt;30 Tage)</div>
            <div className="font-bold text-yellow-700">{upcoming30.length}</div>
          </div>
        </div>
        <div className="flex items-center gap-2 p-3 rounded-lg bg-green-50 border border-green-200 dark:bg-green-950/20">
          <div className="h-3 w-3 rounded-full bg-green-500 flex-shrink-0" />
          <div>
            <div className="text-xs text-muted-foreground">Erledigt</div>
            <div className="font-bold text-green-700">{completed.length}</div>
          </div>
        </div>
      </div>

      {/* Farbkodierung Legende */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base">
            <Calendar className="h-4 w-4" />
            Alle Fristen
          </CardTitle>
          <CardDescription>
            Thüringen-spezifische Fristen für die GAP-Förderung 2026 • Rot = überfällig, Orange = &lt;14 Tage, Gelb = &lt;30 Tage, Grün = &gt;30 Tage
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <LoadingSkeleton />
          ) : (
            <div className="space-y-3">
              {deadlines.length === 0 && (
                <p className="text-muted-foreground text-sm">Keine Fristen gefunden.</p>
              )}
              {deadlines.map((deadline) => {
                const status = getStatusColor(deadline);
                return (
                  <div
                    key={deadline.id}
                    className={`flex items-start gap-3 p-4 border rounded-lg ${status.bg}`}
                  >
                    <StatusIcon deadline={deadline} />
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="font-medium text-sm">{deadline.description}</span>
                        <Badge variant={deadline.priority === 'critical' ? 'destructive' : 'secondary'} className="text-xs">
                          {DEADLINE_TYPE_LABELS[deadline.type]}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <span className="text-muted-foreground">
                          {format(deadline.date, 'EEEE, dd. MMMM yyyy', { locale: de })}
                        </span>
                        {!deadline.completed && (
                          <span className={`font-medium ${status.text}`}>
                            {isPast(deadline.date) ? 'Überfällig!' : `noch ${status.label}`}
                          </span>
                        )}
                        {deadline.completed && deadline.completedAt && (
                          <span className="text-green-600 text-xs">
                            Erledigt am {format(deadline.completedAt, 'dd.MM.yyyy')}
                          </span>
                        )}
                      </div>
                    </div>
                    {!deadline.completed && (
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={completingId === deadline.id}
                        onClick={() => markCompleted(deadline.id)}
                        className="flex-shrink-0"
                      >
                        {completingId === deadline.id ? (
                          <span className="text-xs">...</span>
                        ) : (
                          <>
                            <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                            Erledigt
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Info */}
      <Card className="border-blue-200 bg-blue-50 dark:bg-blue-950/20">
        <CardContent className="pt-4">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            <strong>Hinweis:</strong> Die Fristen gelten für das Bundesland Thüringen (TLLLR).
            Für andere Bundesländer können abweichende Fristen gelten. Bitte prüfen Sie die aktuellen
            Fristen auf der Website Ihrer zuständigen Behörde.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
