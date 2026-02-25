'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Search } from 'lucide-react';
import { useSession } from '@/context/session-context';
import { mockFieldService } from '@/services/mock-field-service';
import { FieldListItem, FieldStatus, FieldFilters } from '@/services/field-types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { StatusBadge } from '@/components/ui/status-badge';
import { EmptyState } from '@/components/ui/empty-state';
import { Skeleton } from '@/components/ui/skeleton';
import { Leaf } from '@/components/ui/icons';
import { useTranslations } from 'next-intl';

function FieldsSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {[...Array(6)].map((_, i) => (
        <Card key={i}>
          <CardHeader>
            <Skeleton className="h-6 w-2/3" />
            <Skeleton className="h-3 w-1/3 mt-2" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-2/3 mt-2" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export function FieldsClientContent() {
  const { activeCompany, loading: sessionLoading } = useSession();
  const [fields, setFields] = useState<FieldListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<FieldStatus | undefined>();
  const router = useRouter();
  const t = useTranslations('Fields');

  useEffect(() => {
    if (!activeCompany) return;

    const fetchFields = async () => {
      setLoading(true);
      try {
        const filters: FieldFilters = {
          searchTerm: searchTerm || undefined,
          status: statusFilter,
          sortBy: 'name',
        };

        const data = await mockFieldService.getFields(
          activeCompany.tenantId,
          activeCompany.id,
          filters
        );
        setFields(data);
      } catch (error) {
        console.error('Fehler beim Laden der Felder:', error);
      } finally {
        setLoading(false);
      }
    };

    // Debounce Suche
    const timer = setTimeout(() => {
      fetchFields();
    }, 300);

    return () => clearTimeout(timer);
  }, [activeCompany, searchTerm, statusFilter]);

  const handleCreateField = () => {
    router.push('./fields/new');
  };

  const handleFieldClick = (fieldId: string) => {
    router.push(`./fields/${fieldId}`);
  };

  if (sessionLoading) {
    return <FieldsSkeleton />;
  }

  if (!activeCompany) {
    return (
      <div className="rounded-lg border border-dashed border-muted p-8 text-center">
        <p className="text-muted-foreground">Kein Betrieb ausgewählt</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filter Bar */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Feld suchen..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex gap-2">
          <Button
            variant={statusFilter === undefined ? 'default' : 'outline'}
            size="sm"
            onClick={() => setStatusFilter(undefined)}
          >
            Alle
          </Button>
          <Button
            variant={statusFilter === FieldStatus.ACTIVE ? 'default' : 'outline'}
            size="sm"
            onClick={() => setStatusFilter(FieldStatus.ACTIVE)}
          >
            Aktiv
          </Button>
          <Button
            variant={statusFilter === FieldStatus.FALLOW ? 'default' : 'outline'}
            size="sm"
            onClick={() => setStatusFilter(FieldStatus.FALLOW)}
          >
            Brache
          </Button>
        </div>

        <Button onClick={handleCreateField} className="gap-2">
          <Plus size={20} />
          Neues Feld
        </Button>
      </div>

      {/* Content */}
      {loading ? (
        <FieldsSkeleton />
      ) : fields.length === 0 ? (
        <EmptyState
          icon={Leaf}
          title="Keine Felder vorhanden"
          description="Erstelle dein erstes Feld um zu starten"
          action={
            <Button onClick={handleCreateField} className="gap-2">
              <Plus size={20} />
              Neues Feld
            </Button>
          }
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {fields.map((field) => (
            <Card
              key={field.id}
              className="cursor-pointer transition-all hover:shadow-lg active:scale-95"
              onClick={() => handleFieldClick(field.id)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1 flex-1">
                    <CardTitle className="text-lg line-clamp-1">
                      {field.name}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {field.totalArea.toFixed(2)} ha
                    </p>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-3">
                <StatusBadge
                  variant={field.status === FieldStatus.ACTIVE ? 'success' : 'warning'}
                  size="sm"
                >
                  {field.status === FieldStatus.ACTIVE ? 'Aktiv' : 'Brache'}
                </StatusBadge>

                {field.currentCrop && (
                  <div>
                    <p className="text-xs text-muted-foreground">Kultur</p>
                    <p className="text-sm font-medium capitalize">
                      {field.currentCrop}
                    </p>
                  </div>
                )}

                {field.lastActivity && (
                  <div className="text-xs text-muted-foreground">
                    Aktualisiert:{' '}
                    {new Date(field.lastActivity).toLocaleDateString('de-DE')}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
