/**
 * Mock Operation Service for AgroTrack
 * 
 * Provides CRUD operations for field operations (Aufträge/Einsätze) with realistic mock data.
 * This service is used during development before database integration.
 * 
 * @module mock-operation-service
 */

import {
  Operation,
  OperationListItem,
  OperationFormData,
  OperationFilters,
  OperationStatistics,
  OperationType,
  OperationStatus,
  MachineryAssignment,
  PersonnelAssignment,
  MaterialUsage,
  OperationCosts,
  OperationMetrics
} from './operation-types';

/**
 * Mock data: Realistic operations for demo fields
 * Linked to: Mühlfeld Ost, Bachwiese, Südfeld, Brache Nord
 */
const MOCK_OPERATIONS: Operation[] = [
  {
    id: 'OP-001',
    tenantId: 'tenant-1',
    companyId: 'company-1',
    fieldId: 'FIELD-001', // Mühlfeld Ost
    title: 'Frühjahrsbestellung Weizen',
    description: 'Vorbereitung und Aussaat Winterweizen für Ernte 2026',
    operationType: OperationType.SOWING,
    status: OperationStatus.COMPLETED,
    priority: 5,
    plannedStartDate: new Date('2025-10-15'),
    plannedEndDate: new Date('2025-10-18'),
    actualStartDate: new Date('2025-10-15'),
    actualEndDate: new Date('2025-10-17'),
    estimatedDurationHours: 24,
    machinery: [
      {
        type: 'Traktor',
        model: 'John Deere 6230R',
        operatingHours: 6.5,
        notes: 'Traktor mit Drillmaschine'
      } as MachineryAssignment
    ],
    personnel: [
      {
        personnelId: 'PERS-001',
        name: 'Max Müller',
        role: 'Fahrer',
        hoursWorked: 6.5,
        hourlyRate: 25
      } as PersonnelAssignment
    ],
    materials: [
      {
        name: 'Winterweizen Sorte: Sussex',
        quantity: 180,
        unit: 'kg',
        cost: 540,
        notes: 'Hochwertige Sorte mit guter Krankheitsresistenz'
      } as MaterialUsage
    ],
    weatherConditions: {
      temperature: 14,
      precipitation: 0,
      windSpeed: 12,
      windDirection: 'SW',
      soilMoisture: 65,
      notes: 'Optimale Aussaatbedingungen'
    },
    metrics: {
      areaWorked: 12.5,
      averageSpeed: 8.5,
      completionPercentage: 100,
      qualityNotes: 'Sehr gleichmäßige Saattiefe, optimales Saatbild'
    },
    costs: {
      fuelCosts: 85,
      laborCosts: 162.5,
      materialCosts: 540,
      otherCosts: 0
    },
    createdAt: new Date('2025-09-20'),
    updatedAt: new Date('2025-10-17'),
    createdBy: 'user-1',
    updatedBy: 'user-1'
  },
  {
    id: 'OP-002',
    tenantId: 'tenant-1',
    companyId: 'company-1',
    fieldId: 'FIELD-001', // Mühlfeld Ost
    title: 'Herbstdüngung mit Kompost',
    description: 'Organische Düngergabe zur Bodengare-Verbesserung',
    operationType: OperationType.FERTILIZING,
    status: OperationStatus.COMPLETED,
    priority: 3,
    plannedStartDate: new Date('2025-09-10'),
    plannedEndDate: new Date('2025-09-12'),
    actualStartDate: new Date('2025-09-11'),
    actualEndDate: new Date('2025-09-11'),
    estimatedDurationHours: 8,
    machinery: [
      {
        type: 'Traktor',
        model: 'Case IH 95U',
        operatingHours: 4,
        notes: 'Mit Düngerstreuer'
      } as MachineryAssignment
    ],
    personnel: [
      {
        personnelId: 'PERS-002',
        name: 'Hans Schmidt',
        role: 'Traktorfahrer',
        hoursWorked: 4,
        hourlyRate: 22
      } as PersonnelAssignment
    ],
    materials: [
      {
        name: 'Stallkompost',
        quantity: 60,
        unit: 't',
        cost: 1200,
        notes: 'Aus der Eigenen Kompostierung'
      } as MaterialUsage
    ],
    metrics: {
      areaWorked: 12.5,
      averageSpeed: 6.5,
      completionPercentage: 100
    },
    costs: {
      fuelCosts: 52,
      laborCosts: 88,
      materialCosts: 1200,
      otherCosts: 0
    },
    createdAt: new Date('2025-09-01'),
    updatedAt: new Date('2025-09-11'),
    createdBy: 'user-1'
  },
  {
    id: 'OP-003',
    tenantId: 'tenant-1',
    companyId: 'company-1',
    fieldId: 'FIELD-002', // Bachwiese
    title: 'Graslandmahd & Heuwerbung',
    description: 'Schnitt, Schwaden und Pressung für Futterqualität',
    operationType: OperationType.MOWING,
    status: OperationStatus.COMPLETED,
    priority: 4,
    plannedStartDate: new Date('2026-05-25'),
    plannedEndDate: new Date('2026-05-29'),
    actualStartDate: new Date('2026-05-25'),
    actualEndDate: new Date('2026-05-28'),
    estimatedDurationHours: 32,
    machinery: [
      {
        type: 'Mähwerk',
        model: 'CLAAS Disco 3200',
        operatingHours: 8
      } as MachineryAssignment,
      {
        type: 'Schwader',
        model: 'CLAAS Liner 3900',
        operatingHours: 8
      } as MachineryAssignment,
      {
        type: 'Ballenpresse',
        model: 'CLAAS Variant 485 RC',
        operatingHours: 16
      } as MachineryAssignment
    ],
    personnel: [
      {
        personnelId: 'PERS-001',
        name: 'Max Müller',
        role: 'Hauptfahrer',
        hoursWorked: 32
      },
      {
        personnelId: 'PERS-003',
        name: 'Lisa Wagner',
        role: 'Helfer',
        hoursWorked: 16
      }
    ] as PersonnelAssignment[],
    materials: [
      {
        name: 'Heuballen-Netzwickel',
        quantity: 250,
        unit: 'Rollen',
        cost: 350
      } as MaterialUsage
    ],
    weatherConditions: {
      temperature: 22,
      precipitation: 0,
      windSpeed: 8,
      soilMoisture: 45,
      notes: 'Perfektes Heuwetter - Trocknungsbedingungen optimal'
    },
    metrics: {
      areaWorked: 8.7,
      completionPercentage: 100,
      yield: 4.2,
      qualityNotes: '32 Heuballen à 25kg, sehr gute Futterqualität'
    },
    costs: {
      fuelCosts: 145,
      laborCosts: 480,
      materialCosts: 350,
      otherCosts: 80
    },
    createdAt: new Date('2026-05-15'),
    updatedAt: new Date('2026-05-28'),
    createdBy: 'user-1'
  },
  {
    id: 'OP-004',
    tenantId: 'tenant-1',
    companyId: 'company-1',
    fieldId: 'FIELD-003', // Südfeld
    title: 'Silomais Aussaat',
    description: 'Präzisionssaat Silomais mit GPS-Lenksystem',
    operationType: OperationType.SOWING,
    status: OperationStatus.PLANNED,
    priority: 5,
    plannedStartDate: new Date('2026-04-15'),
    plannedEndDate: new Date('2026-04-18'),
    estimatedDurationHours: 28,
    machinery: [
      {
        type: 'Traktor',
        model: 'CLAAS Xerion 3800',
        notes: 'Mit GPS-Lenksystem und Präzisions-Drillmaschine'
      } as MachineryAssignment
    ],
    personnel: [
      {
        personnelId: 'PERS-001',
        name: 'Max Müller',
        role: 'Fahrer',
        hourlyRate: 28
      } as PersonnelAssignment
    ],
    materials: [
      {
        name: 'Silomais Saatgut FAO 250-270',
        quantity: 30,
        unit: 'kg',
        cost: 480,
        notes: 'Hochleistungssorte für Silage'
      } as MaterialUsage
    ],
    createdAt: new Date('2026-02-15'),
    updatedAt: new Date('2026-02-20'),
    createdBy: 'user-1'
  },
  {
    id: 'OP-005',
    tenantId: 'tenant-1',
    companyId: 'company-1',
    fieldId: 'FIELD-003', // Südfeld
    title: 'Fungizid gegen Blattfleckenkrankheit',
    description: 'Vorbeugungsspritze gegen Blattfleckenerreger im Mais',
    operationType: OperationType.SPRAYING,
    status: OperationStatus.PLANNED,
    priority: 3,
    plannedStartDate: new Date('2026-06-10'),
    plannedEndDate: new Date('2026-06-11'),
    estimatedDurationHours: 6,
    machinery: [
      {
        type: 'Feldspritze',
        model: 'Amazone UX 5200',
        notes: '400L Behälter mit Boombreite 24m'
      } as MachineryAssignment
    ],
    personnel: [
      {
        personnelId: 'PERS-004',
        name: 'Tom Fischer',
        role: 'Spritzfahrer',
        hourlyRate: 26
      } as PersonnelAssignment
    ],
    materials: [
      {
        name: 'Fungizid: Bravo 500',
        quantity: 40,
        unit: 'L',
        cost: 280
      } as MaterialUsage
    ],
    createdAt: new Date('2026-02-20'),
    updatedAt: new Date('2026-02-20')
  },
  {
    id: 'OP-006',
    tenantId: 'tenant-1',
    companyId: 'company-1',
    fieldId: 'FIELD-001', // Mühlfeld Ost
    title: 'Bodenbearbeitung mit Kreiselegge',
    description: 'Saatbettbereitung nach Ernte vor Wintergetreidesaat',
    operationType: OperationType.DISKING,
    status: OperationStatus.IN_PROGRESS,
    priority: 4,
    plannedStartDate: new Date('2026-02-25'),
    plannedEndDate: new Date('2026-02-27'),
    actualStartDate: new Date('2026-02-25'),
    estimatedDurationHours: 12,
    machinery: [
      {
        type: 'Traktor',
        model: 'Deutz Fahr 6215',
        operatingHours: 3.5
      } as MachineryAssignment,
      {
        type: 'Kreiselegge',
        model: 'Lemken Rubin 12',
        operatingHours: 3.5,
        notes: 'Arbeitsbreite 3,0m'
      } as MachineryAssignment
    ],
    personnel: [
      {
        personnelId: 'PERS-002',
        name: 'Hans Schmidt',
        role: 'Fahrer',
        hoursWorked: 3.5,
        hourlyRate: 22
      } as PersonnelAssignment
    ],
    materials: [],
    metrics: {
      areaWorked: 10.5,
      averageSpeed: 9,
      completionPercentage: 84
    },
    costs: {
      fuelCosts: 65
    },
    createdAt: new Date('2026-02-15'),
    updatedAt: new Date('2026-02-25'),
    createdBy: 'user-1',
    updatedBy: 'user-1'
  }
];

/**
 * Mock Operation Service
 * Provides CRUD and query operations for farm operations/jobs
 */
export class MockOperationService {
  /**
   * Retrieve operations with optional filtering and sorting
   * @param tenantId - Tenant identifier
   * @param companyId - Company identifier
   * @param filters - Filter criteria
   * @returns Array of operation list items
   */
  async getOperations(
    tenantId: string,
    companyId: string,
    filters?: OperationFilters
  ): Promise<OperationListItem[]> {
    // Filter by tenant and company
    let results = MOCK_OPERATIONS.filter(
      op => op.tenantId === tenantId && op.companyId === companyId
    );

    // Apply status filter
    if (filters?.status) {
      results = results.filter(op => op.status === filters.status);
    }

    // Apply operation type filter
    if (filters?.operationType) {
      results = results.filter(op => op.operationType === filters.operationType);
    }

    // Apply field filter
    if (filters?.fieldId) {
      results = results.filter(op => op.fieldId === filters.fieldId);
    }

    // Apply search term
    if (filters?.searchTerm) {
      const term = filters.searchTerm.toLowerCase();
      results = results.filter(
        op =>
          op.title.toLowerCase().includes(term) ||
          op.description?.toLowerCase().includes(term)
      );
    }

    // Apply date range filter
    if (filters?.dateRange) {
      results = results.filter(op => {
        const opDate = op.plannedStartDate;
        return (
          opDate >= filters.dateRange!.from &&
          opDate <= filters.dateRange!.to
        );
      });
    }

    // Apply sorting
    const sortBy = filters?.sortBy || 'date';
    results.sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.title.localeCompare(b.title);
        case 'priority':
          return (b.priority || 0) - (a.priority || 0);
        case 'field':
          return a.fieldId.localeCompare(b.fieldId);
        case 'date':
        default:
          return b.plannedStartDate.getTime() - a.plannedStartDate.getTime();
      }
    });

    // Convert to list items
    return results.map(op => ({
      id: op.id,
      title: op.title,
      fieldId: op.fieldId,
      operationType: op.operationType,
      status: op.status,
      plannedStartDate: op.plannedStartDate,
      actualStartDate: op.actualStartDate,
      areaWorked: op.metrics?.areaWorked,
      priority: op.priority,
      updatedAt: op.updatedAt
    }));
  }

  /**
   * Get all operations as detailed Operation objects (for compliance checking)
   * @param tenantId - Tenant identifier
   * @param companyId - Company identifier
   * @returns Array of full Operation objects
   */
  async getAllOperations(
    tenantId: string,
    companyId: string
  ): Promise<Operation[]> {
    return MOCK_OPERATIONS.filter(
      op => op.tenantId === tenantId && op.companyId === companyId
    );
  }

  /**
   * Get single operation by ID
   * @param tenantId - Tenant identifier
   * @param operationId - Operation identifier
   * @returns Operation details or null if not found
   */
  async getOperation(
    tenantId: string,
    operationId: string
  ): Promise<Operation | null> {
    const op = MOCK_OPERATIONS.find(
      o => o.id === operationId && o.tenantId === tenantId
    );
    return op || null;
  }

  /**
   * Create new operation
   * @param tenantId - Tenant identifier
   * @param companyId - Company identifier
   * @param data - Form data
   * @param userId - User creating the operation
   * @returns New operation
   */
  async createOperation(
    tenantId: string,
    companyId: string,
    data: OperationFormData,
    userId?: string
  ): Promise<Operation> {
    const newOp: Operation = {
      id: `OP-${String(MOCK_OPERATIONS.length + 1).padStart(3, '0')}`,
      tenantId,
      companyId,
      title: data.title,
      description: data.description,
      operationType: data.operationType,
      fieldId: data.fieldId,
      status: OperationStatus.PLANNED,
      priority: data.priority || 3,
      plannedStartDate: data.plannedStartDate,
      plannedEndDate: data.plannedEndDate,
      estimatedDurationHours: data.estimatedDurationHours,
      machinery: data.machinery || [],
      personnel: [],
      materials: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: userId
    };

    MOCK_OPERATIONS.push(newOp);
    return newOp;
  }

  /**
   * Update operation details
   * @param tenantId - Tenant identifier
   * @param operationId - Operation identifier
   * @param data - Partial update data
   * @returns Updated operation or null if not found
   */
  async updateOperation(
    tenantId: string,
    operationId: string,
    data: Partial<OperationFormData>
  ): Promise<Operation | null> {
    const op = MOCK_OPERATIONS.find(
      o => o.id === operationId && o.tenantId === tenantId
    );

    if (!op) return null;

    Object.assign(op, data, { updatedAt: new Date() });
    return op;
  }

  /**
   * Update operation status (PLANNED → IN_PROGRESS → COMPLETED)
   * @param tenantId - Tenant identifier
   * @param operationId - Operation identifier
   * @param status - New status
   * @returns Updated operation or null if not found
   */
  async updateOperationStatus(
    tenantId: string,
    operationId: string,
    status: OperationStatus
  ): Promise<Operation | null> {
    const op = MOCK_OPERATIONS.find(
      o => o.id === operationId && o.tenantId === tenantId
    );

    if (!op) return null;

    op.status = status;
    if (status === OperationStatus.IN_PROGRESS && !op.actualStartDate) {
      op.actualStartDate = new Date();
    }
    if (status === OperationStatus.COMPLETED && !op.actualEndDate) {
      op.actualEndDate = new Date();
    }
    op.updatedAt = new Date();

    return op;
  }

  /**
   * Delete operation
   * @param tenantId - Tenant identifier
   * @param operationId - Operation identifier
   * @returns Success status
   */
  async deleteOperation(
    tenantId: string,
    operationId: string
  ): Promise<boolean> {
    const index = MOCK_OPERATIONS.findIndex(
      o => o.id === operationId && o.tenantId === tenantId
    );

    if (index === -1) return false;

    MOCK_OPERATIONS.splice(index, 1);
    return true;
  }

  /**
   * Update operation metrics after completion
   * @param tenantId - Tenant identifier
   * @param operationId - Operation identifier
   * @param metrics - Metrics from field work
   * @returns Updated operation
   */
  async updateOperationMetrics(
    tenantId: string,
    operationId: string,
    metrics: OperationMetrics
  ): Promise<Operation | null> {
    const op = await this.getOperation(tenantId, operationId);
    if (!op) return null;

    op.metrics = { ...op.metrics, ...metrics };
    op.updatedAt = new Date();
    return op;
  }

  /**
   * Update operation costs
   * @param tenantId - Tenant identifier
   * @param operationId - Operation identifier
   * @param costs - Cost breakdown
   * @returns Updated operation
   */
  async updateOperationCosts(
    tenantId: string,
    operationId: string,
    costs: OperationCosts
  ): Promise<Operation | null> {
    const op = await this.getOperation(tenantId, operationId);
    if (!op) return null;

    op.costs = { ...op.costs, ...costs };
    op.updatedAt = new Date();
    return op;
  }

  /**
   * Get overview statistics
   * @param tenantId - Tenant identifier
   * @param companyId - Company identifier
   * @returns Statistics object
   */
  async getOperationStatistics(
    tenantId: string,
    companyId: string
  ): Promise<OperationStatistics> {
    const ops = MOCK_OPERATIONS.filter(
      op => op.tenantId === tenantId && op.companyId === companyId
    );

    const plannedCount = ops.filter(o => o.status === OperationStatus.PLANNED)
      .length;
    const inProgressCount = ops.filter(
      o => o.status === OperationStatus.IN_PROGRESS
    ).length;
    const completedCount = ops.filter(o => o.status === OperationStatus.COMPLETED)
      .length;

    const completedOps = ops.filter(o => o.status === OperationStatus.COMPLETED);
    const avgDuration =
      completedOps.length > 0
        ? completedOps.reduce((sum, o) => sum + (o.estimatedDurationHours || 0), 0) /
          completedOps.length
        : 0;

    const totalCost = ops.reduce((sum, o) => {
      const costs = o.costs || {};
      return (
        sum +
        (costs.fuelCosts || 0) +
        (costs.laborCosts || 0) +
        (costs.materialCosts || 0) +
        (costs.otherCosts || 0)
      );
    }, 0);

    const avgCost = ops.length > 0 ? totalCost / ops.length : 0;

    const totalArea = ops.reduce((sum, o) => sum + (o.metrics?.areaWorked || 0), 0);

    // Distribution
    const distribution: Record<OperationType, number> = {} as Record<
      OperationType,
      number
    >;
    Object.values(OperationType).forEach(type => {
      distribution[type] = ops.filter(o => o.operationType === type).length;
    });

    // Top cost operations
    const topCostOps = completedOps
      .map(o => ({
        id: o.id,
        title: o.title,
        totalCost: (o.costs?.fuelCosts || 0) +
          (o.costs?.laborCosts || 0) +
          (o.costs?.materialCosts || 0) +
          (o.costs?.otherCosts || 0)
      }))
      .sort((a, b) => b.totalCost - a.totalCost)
      .slice(0, 5);

    return {
      plannedCount,
      inProgressCount,
      completedCount,
      averageDurationHours: Math.round(avgDuration * 10) / 10,
      averageCost: Math.round(avgCost),
      totalAreaWorked: Math.round(totalArea * 10) / 10,
      operationTypeDistribution: distribution,
      topCostOperations: topCostOps
    };
  }
}

// Singleton instance for export
export const mockOperationService = new MockOperationService();
