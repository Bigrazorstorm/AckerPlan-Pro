/**
 * Mock GAP (Gemeinsame Agrarpolitik) Service
 * Provides mock data for EU Common Agricultural Policy
 */

import {
  GloezStandard,
  GloezCompliance,
  GloezIssue,
  EcoSchemeType,
  EcoSchemeApplication,
  GapApplication,
  ApplicationStatus,
  Deadline,
  DeadlineType,
  GapOverview,
  ApplicationDocument,
} from './gap-types';

// Mock GLÖZ Compliance Data
const mockGloezCompliance: Record<string, GloezCompliance[]> = {
  'company-1': [
    {
      standard: GloezStandard.GLOEZ_1,
      companyId: 'company-1',
      status: 'compliant',
      lastChecked: new Date('2026-02-20'),
      issues: [],
      notes: 'Dauergrünland vollständig erhalten (42,5 ha)',
    },
    {
      standard: GloezStandard.GLOEZ_2,
      companyId: 'company-1',
      status: 'not-applicable',
      lastChecked: new Date('2026-02-20'),
      issues: [],
      notes: 'Keine Feuchtgebiete oder Torfmoore vorhanden',
    },
    {
      standard: GloezStandard.GLOEZ_3,
      companyId: 'company-1',
      status: 'compliant',
      lastChecked: new Date('2026-02-20'),
      issues: [],
      notes: 'Stoppelfelder werden nicht abgebrannt',
    },
    {
      standard: GloezStandard.GLOEZ_4,
      companyId: 'company-1',
      status: 'at-risk',
      lastChecked: new Date('2026-02-20'),
      issues: [
        {
          id: 'issue-g4-1',
          severity: 'warning',
          description: 'Pufferstreifen am Mühlbach teilweise unter 3m Breite',
          affectedFieldIds: ['FIELD-001'],
          detectedAt: new Date('2026-02-15'),
          recommendations: [
            'Pufferstreifen auf mindestens 3m verbreitern',
            'Vermessung durch Vermessungsbüro empfohlen',
          ],
        },
      ],
      notes: 'Pufferstreifen müssen nachgemessen werden',
    },
    {
      standard: GloezStandard.GLOEZ_5,
      companyId: 'company-1',
      status: 'compliant',
      lastChecked: new Date('2026-02-20'),
      issues: [],
      notes: 'Erosionsschutzmaßnahmen auf gefährdeten Flächen umgesetzt',
    },
    {
      standard: GloezStandard.GLOEZ_6,
      companyId: 'company-1',
      status: 'compliant',
      lastChecked: new Date('2026-02-20'),
      issues: [],
      notes: 'Mindestbodenbedeckung durch Zwischenfrüchte gewährleistet',
    },
    {
      standard: GloezStandard.GLOEZ_7,
      companyId: 'company-1',
      status: 'non-compliant',
      lastChecked: new Date('2026-02-20'),
      issues: [
        {
          id: 'issue-g7-1',
          severity: 'critical',
          description: 'Fruchtwechsel auf 15 ha Ackerfläche nicht dokumentiert',
          affectedFieldIds: ['FIELD-002', 'FIELD-003'],
          detectedAt: new Date('2026-02-10'),
          recommendations: [
            'Anbauhistorie für 2023-2026 vervollständigen',
            'Mindestens 2 verschiedene Kulturen pro Jahr nachweisen',
            'Dokumentation bis 15. März einreichen',
          ],
        },
      ],
      notes: 'DRINGEND: Fruchtwechsel-Nachweis fehlt',
    },
    {
      standard: GloezStandard.GLOEZ_8,
      companyId: 'company-1',
      status: 'at-risk',
      lastChecked: new Date('2026-02-20'),
      issues: [
        {
          id: 'issue-g8-1',
          severity: 'warning',
          description: 'Nur 3,2% nicht-produktive Flächen (Minimum: 4%)',
          affectedFieldIds: [],
          detectedAt: new Date('2026-02-18'),
          recommendations: [
            'Zusätzliche Blühstreifen anlegen (mind. 0,8 ha)',
            'Bestehende Brachen als nicht-produktive Flächen anmelden',
            'Öko-Regelung 1B erwägen',
          ],
        },
      ],
      notes: 'Mindestanteil knapp unterschritten',
    },
    {
      standard: GloezStandard.GLOEZ_9,
      companyId: 'company-1',
      status: 'compliant',
      lastChecked: new Date('2026-02-20'),
      issues: [],
      notes: 'Dauergrünland wurde nicht umgebrochen',
    },
  ],
};

// Mock Eco-Scheme Applications
const mockEcoSchemes: Record<string, EcoSchemeApplication[]> = {
  'company-1': [
    {
      id: 'eco-001',
      companyId: 'company-1',
      year: 2026,
      type: EcoSchemeType.ECO_1B,
      area: 2.5,
      fieldIds: ['FIELD-001', 'FIELD-002'],
      expectedPayment: 1625, // 650 €/ha × 2.5 ha
      status: 'planned',
      notes: 'Blühstreifen entlang der Feldränder geplant',
    },
    {
      id: 'eco-002',
      companyId: 'company-1',
      year: 2026,
      type: EcoSchemeType.ECO_4,
      area: 12.0,
      fieldIds: ['FIELD-004'],
      expectedPayment: 1800, // 150 €/ha × 12 ha
      status: 'applied',
      applicationDate: new Date('2026-02-10'),
      notes: 'Extensivgrünland ohne Düngung',
    },
  ],
};

// Mock GAP Application
const mockGapApplication: Record<string, GapApplication> = {
  'company-1': {
    id: 'app-2026-001',
    companyId: 'company-1',
    year: 2026,
    status: ApplicationStatus.DRAFT,
    updatedAt: new Date('2026-02-20'),
    basisPremium: {
      eligibleArea: 98.5,
      expectedPayment: 17073, // ~173 €/ha
    },
    gloezCompliant: false, // Due to GLOEZ_7 issue
    ecoSchemes: mockEcoSchemes['company-1'],
    youngFarmerPremium: {
      eligible: true,
      expectedPayment: 2850,
    },
    totalExpectedPayment: 23348,
    documents: [],
    notes: 'GLÖZ-7-Problem muss vor Einreichung gelöst werden',
  },
};

// Mock Deadlines
const mockDeadlines: Deadline[] = [
  {
    id: 'deadline-001',
    type: DeadlineType.GLOEZ_COMPLIANCE,
    year: 2026,
    date: new Date('2026-03-15'),
    description: 'GLÖZ-7 Fruchtwechsel-Nachweis einreichen',
    completed: false,
    priority: 'critical',
    relatedApplicationId: 'app-2026-001',
    reminders: [
      { id: 'rem-001', daysBefore: 7, sent: false },
      { id: 'rem-002', daysBefore: 3, sent: false },
      { id: 'rem-003', daysBefore: 1, sent: false },
    ],
  },
  {
    id: 'deadline-002',
    type: DeadlineType.APPLICATION_SUBMISSION,
    year: 2026,
    date: new Date('2026-05-15'),
    description: 'Sammelantrag 2026 einreichen',
    completed: false,
    priority: 'critical',
    relatedApplicationId: 'app-2026-001',
    reminders: [
      { id: 'rem-004', daysBefore: 30, sent: false },
      { id: 'rem-005', daysBefore: 14, sent: false },
      { id: 'rem-006', daysBefore: 7, sent: false },
    ],
  },
  {
    id: 'deadline-003',
    type: DeadlineType.MODIFICATION,
    year: 2026,
    date: new Date('2026-06-15'),
    description: 'Letzte Möglichkeit für Änderungen am Sammelantrag',
    completed: false,
    priority: 'high',
    relatedApplicationId: 'app-2026-001',
    reminders: [
      { id: 'rem-007', daysBefore: 7, sent: false },
    ],
  },
  {
    id: 'deadline-004',
    type: DeadlineType.ECO_SCHEME_DOCUMENTATION,
    year: 2026,
    date: new Date('2026-09-30'),
    description: 'Öko-Regelung 1B: Blühstreifen fotografisch dokumentieren',
    completed: false,
    priority: 'medium',
    reminders: [
      { id: 'rem-008', daysBefore: 14, sent: false },
    ],
  },
  {
    id: 'deadline-005',
    type: DeadlineType.PAYMENT_EXPECTED,
    year: 2026,
    date: new Date('2026-12-01'),
    description: 'Voraussichtliche Auszahlung der Basisprämie',
    completed: false,
    priority: 'low',
    reminders: [],
  },
];

// Service Interface
class MockGapService {
  // Get GLÖZ compliance for company
  async getGloezCompliance(companyId: string): Promise<GloezCompliance[]> {
    await this.delay();
    return mockGloezCompliance[companyId] || [];
  }

  // Get single GLÖZ standard compliance
  async getGloezStandardCompliance(
    companyId: string,
    standard: GloezStandard
  ): Promise<GloezCompliance | undefined> {
    await this.delay();
    const compliance = mockGloezCompliance[companyId] || [];
    return compliance.find((c) => c.standard === standard);
  }

  // Update GLÖZ compliance
  async updateGloezCompliance(
    companyId: string,
    standard: GloezStandard,
    data: Partial<GloezCompliance>
  ): Promise<GloezCompliance> {
    await this.delay();
    const compliance = mockGloezCompliance[companyId] || [];
    const index = compliance.findIndex((c) => c.standard === standard);
    
    if (index >= 0) {
      compliance[index] = { ...compliance[index], ...data };
      return compliance[index];
    }
    
    const newCompliance: GloezCompliance = {
      standard,
      companyId,
      status: 'not-applicable',
      lastChecked: new Date(),
      issues: [],
      ...data,
    };
    compliance.push(newCompliance);
    mockGloezCompliance[companyId] = compliance;
    return newCompliance;
  }

  // Get eco-schemes for company
  async getEcoSchemes(companyId: string, year?: number): Promise<EcoSchemeApplication[]> {
    await this.delay();
    const schemes = mockEcoSchemes[companyId] || [];
    return year ? schemes.filter((s) => s.year === year) : schemes;
  }

  // Create eco-scheme application
  async createEcoScheme(data: Omit<EcoSchemeApplication, 'id'>): Promise<EcoSchemeApplication> {
    await this.delay();
    const newScheme: EcoSchemeApplication = {
      ...data,
      id: `eco-${Date.now()}`,
    };
    
    if (!mockEcoSchemes[data.companyId]) {
      mockEcoSchemes[data.companyId] = [];
    }
    mockEcoSchemes[data.companyId].push(newScheme);
    
    return newScheme;
  }

  // Get GAP application
  async getGapApplication(companyId: string, year: number): Promise<GapApplication | undefined> {
    await this.delay();
    const app = mockGapApplication[companyId];
    return app?.year === year ? app : undefined;
  }

  // Create/update GAP application
  async saveGapApplication(data: GapApplication): Promise<GapApplication> {
    await this.delay();
    mockGapApplication[data.companyId] = {
      ...data,
      updatedAt: new Date(),
    };
    return mockGapApplication[data.companyId];
  }

  // Get deadlines
  async getDeadlines(year?: number, companyId?: string): Promise<Deadline[]> {
    await this.delay();
    let deadlines = [...mockDeadlines];
    
    if (year) {
      deadlines = deadlines.filter((d) => d.year === year);
    }
    
    // In real app, would filter by companyId
    return deadlines.sort((a, b) => a.date.getTime() - b.date.getTime());
  }

  // Get upcoming deadlines
  async getUpcomingDeadlines(companyId: string, days: number = 30): Promise<Deadline[]> {
    await this.delay();
    const now = new Date();
    const future = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
    
    return mockDeadlines.filter(
      (d) => !d.completed && d.date >= now && d.date <= future
    );
  }

  // Mark deadline as completed
  async completeDeadline(deadlineId: string): Promise<Deadline> {
    await this.delay();
    const deadline = mockDeadlines.find((d) => d.id === deadlineId);
    if (deadline) {
      deadline.completed = true;
      deadline.completedAt = new Date();
    }
    return deadline!;
  }

  // Get GAP overview
  async getGapOverview(companyId: string, year: number): Promise<GapOverview> {
    await this.delay();
    
    const compliance = await this.getGloezCompliance(companyId);
    const application = await this.getGapApplication(companyId, year);
    const deadlines = await this.getDeadlines(year, companyId);
    
    const now = new Date();
    const upcoming = deadlines.filter((d) => !d.completed && d.date >= now).length;
    const missed = deadlines.filter((d) => !d.completed && d.date < now).length;
    
    return {
      companyId,
      year,
      gloezCompliance: {
        compliant: compliance.filter((c) => c.status === 'compliant').length,
        nonCompliant: compliance.filter((c) => c.status === 'non-compliant').length,
        atRisk: compliance.filter((c) => c.status === 'at-risk').length,
        notApplicable: compliance.filter((c) => c.status === 'not-applicable').length,
      },
      applicationStatus: application?.status,
      expectedPayments: {
        basisPremium: application?.basisPremium.expectedPayment || 0,
        ecoSchemes: application?.ecoSchemes.reduce((sum, s) => sum + s.expectedPayment, 0) || 0,
        youngFarmer: application?.youngFarmerPremium?.expectedPayment || 0,
        total: application?.totalExpectedPayment || 0,
      },
      upcomingDeadlines: upcoming,
      missedDeadlines: missed,
    };
  }

  // Helper delay for mock async behavior
  private delay(ms: number = 100): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

export const mockGapService = new MockGapService();
