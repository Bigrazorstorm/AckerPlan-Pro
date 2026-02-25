'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from '@/context/session-context';
import { useRouter } from 'next/navigation';
import { 
  PersonnelListItem, 
  PersonnelRole, 
  EmploymentStatus,
  PersonnelFilters 
} from '@/services/personnel-types';
import { mockPersonnelService } from '@/services/mock-personnel-service';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { StatusBadge, type BadgeVariant } from '@/components/ui/status-badge';
import { EmptyState } from '@/components/ui/empty-state';
import { Users, AlertCircle, CheckCircle } from 'lucide-react';

/**
 * Map employment status to badge variants
 */
const STATUS_VARIANTS: Record<EmploymentStatus, BadgeVariant> = {
  [EmploymentStatus.FULL_TIME]: 'success',
  [EmploymentStatus.PART_TIME]: 'info',
  [EmploymentStatus.SEASONAL]: 'warning',
  [EmploymentStatus.MINI_JOB]: 'neutral',
  [EmploymentStatus.TRAINEE]: 'info',
  [EmploymentStatus.CONTRACTOR]: 'neutral',
  [EmploymentStatus.INACTIVE]: 'destructive',
};

/**
 * German labels for personnel roles
 */
const ROLE_LABELS: Record<PersonnelRole, string> = {
  [PersonnelRole.FARM_MANAGER]: 'Betriebsleiter',
  [PersonnelRole.FARMER]: 'Landwirt/Fachkraft',
  [PersonnelRole.TRACTOR_DRIVER]: 'Traktorfahrer',
  [PersonnelRole.HARVEST_HELPER]: 'Erntehelfer',
  [PersonnelRole.MECHANIC]: 'Mechaniker',
  [PersonnelRole.ANIMAL_CARETAKER]: 'Tierpfleger',
  [PersonnelRole.ADMIN]: 'Verwaltung',
  [PersonnelRole.APPRENTICE]: 'Auszubildender',
  [PersonnelRole.INTERN]: 'Praktikant',
  [PersonnelRole.OTHER]: 'Sonstiges',
};

/**
 * German labels for employment status
 */
const STATUS_LABELS: Record<EmploymentStatus, string> = {
  [EmploymentStatus.FULL_TIME]: 'Vollzeit',
  [EmploymentStatus.PART_TIME]: 'Teilzeit',
  [EmploymentStatus.SEASONAL]: 'Saisonal',
  [EmploymentStatus.MINI_JOB]: 'Minijob',
  [EmploymentStatus.TRAINEE]: 'Ausbildung',
  [EmploymentStatus.CONTRACTOR]: 'Freiberufler',
  [EmploymentStatus.INACTIVE]: 'Inaktiv',
};

/**
 * Skeleton loader for personnel list
 */
function PersonnelSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {[...Array(6)].map((_, i) => (
        <Card key={i}>
          <CardHeader>
            <Skeleton className="h-5 w-32 mb-2" />
            <Skeleton className="h-4 w-24" />
          </CardHeader>
          <CardContent className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

/**
 * Main Personnel List Component
 */
export function PersonalClientContent() {
  const { activeCompany, loading: sessionLoading } = useSession();
  const router = useRouter();
  
  const [personnel, setPersonnel] = useState<PersonnelListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<PersonnelRole | 'ALL'>('ALL');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Fetch personnel
  const fetchPersonnel = useCallback(
    async (search: string, role: PersonnelRole | 'ALL') => {
      if (!activeCompany) return;
      
      setLoading(true);
      try {
        const filters: PersonnelFilters = {
          searchTerm: search || undefined,
          role: role === 'ALL' ? undefined : role,
          activeOnly: true,
          sortBy: 'name',
        };
        
        const data = await mockPersonnelService.getPersonnel(
          activeCompany.tenantId,
          activeCompany.id,
          filters
        );
        
        setPersonnel(data);
      } catch (error) {
        console.error('Failed to fetch personnel:', error);
        setPersonnel([]);
      } finally {
        setLoading(false);
      }
    },
    [activeCompany]
  );

  // Trigger fetch when dependencies change
  useEffect(() => {
    if (activeCompany && !sessionLoading) {
      fetchPersonnel(debouncedSearch, roleFilter);
    } else if (!sessionLoading) {
      setLoading(false);
    }
  }, [activeCompany, sessionLoading, debouncedSearch, roleFilter, fetchPersonnel]);

  // Handle personnel card click
  const handlePersonnelClick = (personnelId: string) => {
    router.push(`./personal/${personnelId}`);
  };

  // Render filter buttons
  const renderFilterButtons = () => {
    const filterOptions: Array<{ label: string; value: PersonnelRole | 'ALL' }> = [
      { label: 'Alle', value: 'ALL' },
      { label: 'Betriebsleiter', value: PersonnelRole.FARM_MANAGER },
      { label: 'Fahrer', value: PersonnelRole.TRACTOR_DRIVER },
      { label: 'Landwirt', value: PersonnelRole.FARMER },
      { label: 'Mechaniker', value: PersonnelRole.MECHANIC },
    ];

    return (
      <div className="flex gap-2 flex-wrap">
        {filterOptions.map((option) => (
          <Button
            key={option.value}
            variant={roleFilter === option.value ? 'default' : 'outline'}
            size="sm"
            onClick={() => setRoleFilter(option.value)}
          >
            {option.label}
          </Button>
        ))}
      </div>
    );
  };

  if (sessionLoading || (loading && personnel.length === 0)) {
    return <PersonnelSkeleton />;
  }

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="flex flex-col gap-4">
        <Input
          placeholder="Personal suchen (Name, E-Mail)..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md"
        />
        {renderFilterButtons()}
      </div>

      {/* Personnel Grid */}
      {loading ? (
        <PersonnelSkeleton />
      ) : personnel.length > 0 ? (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {personnel.map((person) => (
              <Card
                key={person.id}
                className="cursor-pointer hover:border-primary transition-colors"
                onClick={() => handlePersonnelClick(person.id)}
              >
                <CardHeader>
                  <CardTitle className="text-lg">{person.fullName}</CardTitle>
                  <p className="text-xs text-muted-foreground">
                    {ROLE_LABELS[person.role]}
                  </p>
                  <StatusBadge variant={STATUS_VARIANTS[person.employmentStatus]}>
                    {STATUS_LABELS[person.employmentStatus]}
                  </StatusBadge>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  {person.email && (
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">E-Mail:</span>
                      <span className="truncate">{person.email}</span>
                    </div>
                  )}
                  {person.phone && (
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">Tel:</span>
                      <span>{person.phone}</span>
                    </div>
                  )}
                  
                  {/* Qualifications */}
                  <div className="flex items-center gap-2 pt-2 border-t">
                    {person.hasPesticideLicense && (
                      <div className="flex items-center gap-1 text-xs">
                        <CheckCircle className="h-3 w-3 text-green-600" />
                        <span>PSM-Lizenz</span>
                      </div>
                    )}
                    {person.hasTractorLicense && (
                      <div className="flex items-center gap-1 text-xs">
                        <CheckCircle className="h-3 w-3 text-blue-600" />
                        <span>Klasse T</span>
                      </div>
                    )}
                  </div>

                  {/* Expiring qualifications warning */}
                  {person.expiringQualificationsCount && person.expiringQualificationsCount > 0 && (
                    <div className="flex items-center gap-2 pt-2 text-xs text-yellow-600 border-t">
                      <AlertCircle className="h-3 w-3" />
                      <span>
                        {person.expiringQualificationsCount} Qualifikation(en) laufen bald ab
                      </span>
                    </div>
                  )}

                  {/* Last updated */}
                  <div className="text-xs text-muted-foreground pt-2">
                    Aktualisiert: {new Date(person.updatedAt).toLocaleDateString('de-DE')}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Summary */}
          <div className="text-sm text-muted-foreground text-center">
            {personnel.length} Mitarbeiter angezeigt
          </div>
        </>
      ) : (
        <EmptyState
          icon={Users}
          title="Keine Mitarbeiter gefunden"
          description={
            searchTerm || roleFilter !== 'ALL'
              ? 'Versuchen Sie es mit anderen Suchkriterien'
              : 'Fügen Sie Ihren ersten Mitarbeiter hinzu, um zu beginnen'
          }
          action={
            <Button onClick={() => router.push('./personal/new')}>
              Mitarbeiter hinzufügen
            </Button>
          }
        />
      )}
    </div>
  );
}