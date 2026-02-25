/**
 * Mock Personnel Service
 * 
 * Development-only service providing realistic personnel data without database connection.
 * Simulates async operations for development and testing.
 * 
 * @module mock-personnel-service
 */

import {
  Personnel,
  PersonnelListItem,
  PersonnelFormData,
  PersonnelFilters,
  PersonnelStatistics,
  PersonnelRole,
  EmploymentStatus,
  QualificationType,
  Qualification,
  WorkTimeSummary,
  WorkTimeEntry,
} from './personnel-types';

/**
 * Mock Personnel Database
 * Realistische Beispieldaten für Entwicklung
 */
const MOCK_PERSONNEL: Personnel[] = [
  {
    id: 'PERS-001',
    tenantId: 'tenant-1',
    companyId: 'company-1',
    
    firstName: 'Thomas',
    lastName: 'Müller',
    fullName: 'Thomas Müller',
    dateOfBirth: new Date('1978-05-12'),
    nationality: 'Deutsch',
    employeeNumber: 'LW-001',
    photoUrl: undefined,
    
    role: PersonnelRole.FARM_MANAGER,
    employmentStatus: EmploymentStatus.FULL_TIME,
    department: 'Betriebsleitung',
    
    contactInfo: {
      email: 'thomas.mueller@bauernhof.de',
      phone: '+49 6221 12345',
      mobile: '+49 151 23456789',
      street: 'Hauptstraße 42',
      postalCode: '69115',
      city: 'Heidelberg',
      country: 'Deutschland',
    },
    
    emergencyContact: {
      name: 'Maria Müller',
      relationship: 'Ehefrau',
      phone: '+49 151 98765432',
    },
    
    contract: {
      startDate: new Date('2005-04-01'),
      isPermanent: true,
      weeklyHours: 40,
      monthlySalary: 4500,
      vacationDays: 30,
      probationPeriod: 6,
      noticePeriod: 90,
    },
    
    qualifications: [
      {
        type: QualificationType.PESTICIDE_LICENSE,
        name: 'Pflanzenschutz-Sachkundenachweis',
        issuedDate: new Date('2020-03-15'),
        expiryDate: new Date('2027-03-15'),
        isValid: true,
        certificateNumber: 'PSK-2020-HD-0142',
        issuingAuthority: 'Landwirtschaftskammer Baden-Württemberg',
        notes: 'Letzte Fortbildung: Februar 2024',
      },
      {
        type: QualificationType.DRIVER_LICENSE_T,
        name: 'Führerschein Klasse T',
        issuedDate: new Date('1994-08-20'),
        isValid: true,
        certificateNumber: 'T940820HD',
      },
      {
        type: QualificationType.DRIVER_LICENSE_C,
        name: 'Führerschein Klasse CE',
        issuedDate: new Date('2006-02-10'),
        isValid: true,
        certificateNumber: 'CE060210HD',
      },
      {
        type: QualificationType.FIRST_AID,
        name: 'Erste-Hilfe-Kurs',
        issuedDate: new Date('2024-01-20'),
        expiryDate: new Date('2026-01-20'),
        isValid: true,
        issuingAuthority: 'DRK Heidelberg',
      },
      {
        type: QualificationType.WORK_SAFETY,
        name: 'Arbeitssicherheit Landwirtschaft',
        issuedDate: new Date('2023-06-10'),
        expiryDate: new Date('2026-06-10'),
        isValid: true,
        issuingAuthority: 'Berufsgenossenschaft',
      },
    ],
    
    hasPesticideLicense: true,
    hasTractorLicense: true,
    
    skills: [
      'Betriebsführung',
      'Pflanzenbau',
      'Maschinenführung',
      'Precision Farming',
      'Betriebswirtschaft',
      'Mitarbeiterführung',
    ],
    languages: ['Deutsch', 'Englisch'],
    
    documents: [
      {
        id: 'DOC-001',
        type: 'Arbeitsvertrag',
        name: 'Arbeitsvertrag_Mueller_2005.pdf',
        uploadDate: new Date('2023-01-15'),
        fileUrl: '/documents/contracts/mueller_2005.pdf',
      },
      {
        id: 'DOC-002',
        type: 'Zeugnis',
        name: 'Meisterbrief_Landwirtschaft.pdf',
        uploadDate: new Date('2023-01-15'),
        fileUrl: '/documents/certificates/meisterbrief_mueller.pdf',
      },
    ],
    
    notes: 'Betriebsleiter mit 20+ Jahren Erfahrung. Verantwortlich für strategische Planung und Mitarbeiterführung. Verfügt über Meisterbrief in Landwirtschaft.',
    preferredTasks: ['Planung', 'Düngung', 'Pflanzenschutz', 'Ernteplanung'],
    
    createdAt: new Date('2023-01-10T10:00:00Z'),
    updatedAt: new Date('2024-02-15T14:30:00Z'),
    createdBy: 'admin',
    updatedBy: 'admin',
  },
  
  {
    id: 'PERS-002',
    tenantId: 'tenant-1',
    companyId: 'company-1',
    
    firstName: 'Stefan',
    lastName: 'Weber',
    fullName: 'Stefan Weber',
    dateOfBirth: new Date('1985-11-08'),
    nationality: 'Deutsch',
    employeeNumber: 'LW-002',
    
    role: PersonnelRole.TRACTOR_DRIVER,
    employmentStatus: EmploymentStatus.FULL_TIME,
    
    contactInfo: {
      email: 'stefan.weber@bauernhof.de',
      phone: '+49 6221 54321',
      mobile: '+49 162 34567890',
      street: 'Bergstraße 17',
      postalCode: '69120',
      city: 'Heidelberg',
      country: 'Deutschland',
    },
    
    emergencyContact: {
      name: 'Petra Weber',
      relationship: 'Mutter',
      phone: '+49 6221 87654',
    },
    
    contract: {
      startDate: new Date('2012-08-01'),
      isPermanent: true,
      weeklyHours: 40,
      hourlyRate: 18.50,
      vacationDays: 28,
      probationPeriod: 3,
      noticePeriod: 60,
    },
    
    qualifications: [
      {
        type: QualificationType.DRIVER_LICENSE_T,
        name: 'Führerschein Klasse T',
        issuedDate: new Date('2003-06-15'),
        isValid: true,
        certificateNumber: 'T030615HD',
      },
      {
        type: QualificationType.DRIVER_LICENSE_C,
        name: 'Führerschein Klasse C',
        issuedDate: new Date('2010-03-22'),
        isValid: true,
        certificateNumber: 'C100322HD',
      },
      {
        type: QualificationType.FORKLIFT_LICENSE,
        name: 'Gabelstaplerführerschein',
        issuedDate: new Date('2015-09-10'),
        isValid: true,
        issuingAuthority: 'TÜV Süd',
      },
      {
        type: QualificationType.FIRST_AID,
        name: 'Erste-Hilfe-Kurs',
        issuedDate: new Date('2023-05-12'),
        expiryDate: new Date('2025-05-12'),
        isValid: true,
        issuingAuthority: 'ASB Heidelberg',
      },
      {
        type: QualificationType.CARGO_SECURING,
        name: 'Ladungssicherung',
        issuedDate: new Date('2022-11-18'),
        isValid: true,
        issuingAuthority: 'IHK Rhein-Neckar',
      },
    ],
    
    hasPesticideLicense: false,
    hasTractorLicense: true,
    
    skills: [
      'Traktorführung',
      'Pflügen',
      'Säen',
      'Ernten',
      'Maschineneinstellung',
      'GPS-Technologie',
    ],
    languages: ['Deutsch'],
    
    documents: [
      {
        id: 'DOC-003',
        type: 'Arbeitsvertrag',
        name: 'Arbeitsvertrag_Weber_2012.pdf',
        uploadDate: new Date('2023-01-15'),
        fileUrl: '/documents/contracts/weber_2012.pdf',
      },
    ],
    
    notes: 'Zuverlässiger Traktorfahrer mit 12+ Jahren Betriebszugehörigkeit. Spezialisiert auf Bodenbearbeitung und Aussaat.',
    preferredTasks: ['Pflügen', 'Aussaat', 'Bodenbearbeitung'],
    
    createdAt: new Date('2023-01-10T10:30:00Z'),
    updatedAt: new Date('2024-03-10T09:15:00Z'),
    createdBy: 'admin',
  },
  
  {
    id: 'PERS-003',
    tenantId: 'tenant-1',
    companyId: 'company-1',
    
    firstName: 'Anna',
    lastName: 'Schmidt',
    fullName: 'Anna Schmidt',
    dateOfBirth: new Date('1992-03-25'),
    nationality: 'Deutsch',
    employeeNumber: 'LW-003',
    
    role: PersonnelRole.FARMER,
    employmentStatus: EmploymentStatus.FULL_TIME,
    
    contactInfo: {
      email: 'anna.schmidt@bauernhof.de',
      mobile: '+49 173 45678901',
      street: 'Waldweg 8',
      postalCode: '69121',
      city: 'Heidelberg',
      country: 'Deutschland',
    },
    
    emergencyContact: {
      name: 'Markus Schmidt',
      relationship: 'Ehemann',
      phone: '+49 173 87654321',
    },
    
    contract: {
      startDate: new Date('2018-09-01'),
      isPermanent: true,
      weeklyHours: 40,
      hourlyRate: 19.20,
      vacationDays: 28,
      probationPeriod: 6,
      noticePeriod: 60,
    },
    
    qualifications: [
      {
        type: QualificationType.PESTICIDE_LICENSE,
        name: 'Pflanzenschutz-Sachkundenachweis',
        issuedDate: new Date('2021-06-20'),
        expiryDate: new Date('2024-06-20'),
        isValid: false, // ABGELAUFEN!
        certificateNumber: 'PSK-2021-HD-0287',
        issuingAuthority: 'Landwirtschaftskammer Baden-Württemberg',
        notes: 'ABGELAUFEN - Fortbildung erforderlich!',
      },
      {
        type: QualificationType.DRIVER_LICENSE_T,
        name: 'Führerschein Klasse T',
        issuedDate: new Date('2010-07-15'),
        isValid: true,
        certificateNumber: 'T100715HD',
      },
      {
        type: QualificationType.FIRST_AID,
        name: 'Erste-Hilfe-Kurs',
        issuedDate: new Date('2024-08-05'),
        expiryDate: new Date('2026-08-05'),
        isValid: true,
        issuingAuthority: 'Malteser Heidelberg',
      },
      {
        type: QualificationType.ANIMAL_WELFARE,
        name: 'Tierschutz-Sachkunde',
        issuedDate: new Date('2019-04-10'),
        isValid: true,
        issuingAuthority: 'Veterinäramt Heidelberg',
      },
    ],
    
    hasPesticideLicense: false, // Abgelaufen
    hasTractorLicense: true,
    
    skills: [
      'Pflanzenbau',
      'Düngung',
      'Tierbetreuung',
      'Qualitätskontrolle',
      'Dokumentation',
    ],
    languages: ['Deutsch', 'Englisch'],
    
    documents: [
      {
        id: 'DOC-004',
        type: 'Arbeitsvertrag',
        name: 'Arbeitsvertrag_Schmidt_2018.pdf',
        uploadDate: new Date('2023-01-15'),
        fileUrl: '/documents/contracts/schmidt_2018.pdf',
      },
      {
        id: 'DOC-005',
        type: 'Zeugnis',
        name: 'Ausbildungszeugnis_Landwirtin.pdf',
        uploadDate: new Date('2023-01-15'),
        fileUrl: '/documents/certificates/ausbildung_schmidt.pdf',
      },
    ],
    
    notes: 'Qualifizierte Landwirtin. ACHTUNG: Pflanzenschutz-Sachkunde ist abgelaufen - Fortbildung erforderlich bevor Pflanzenschutzarbeiten durchgeführt werden können!',
    preferredTasks: ['Düngung', 'Qualitätskontrolle', 'Feldbestellung'],
    healthRestrictions: 'Leichte Pollenallergie (Gräser)',
    
    createdAt: new Date('2023-01-10T11:00:00Z'),
    updatedAt: new Date('2024-09-02T16:45:00Z'),
    createdBy: 'admin',
    updatedBy: 'pers-001',
  },
  
  {
    id: 'PERS-004',
    tenantId: 'tenant-1',
    companyId: 'company-1',
    
    firstName: 'Markus',
    lastName: 'Bauer',
    fullName: 'Markus Bauer',
    dateOfBirth: new Date('1972-09-14'),
    nationality: 'Deutsch',
    employeeNumber: 'LW-004',
    
    role: PersonnelRole.MECHANIC,
    employmentStatus: EmploymentStatus.PART_TIME,
    
    contactInfo: {
      email: 'markus.bauer@werkstatt-hd.de',
      phone: '+49 6221 67890',
      mobile: '+49 160 12345678',
      street: 'Industriestraße 25',
      postalCode: '69115',
      city: 'Heidelberg',
      country: 'Deutschland',
    },
    
    emergencyContact: {
      name: 'Gisela Bauer',
      relationship: 'Ehefrau',
      phone: '+49 6221 67891',
    },
    
    contract: {
      startDate: new Date('2015-03-15'),
      isPermanent: true,
      weeklyHours: 20,
      hourlyRate: 28.00,
      vacationDays: 20,
      noticePeriod: 60,
    },
    
    qualifications: [
      {
        type: QualificationType.WELDING_CERTIFICATE,
        name: 'Schweißerschein MAG/MIG',
        issuedDate: new Date('1995-05-20'),
        isValid: true,
        certificateNumber: 'SW950520',
        issuingAuthority: 'TÜV Rheinland',
      },
      {
        type: QualificationType.WORK_SAFETY,
        name: 'Arbeitssicherheit & Unfallverhütung',
        issuedDate: new Date('2023-09-15'),
        expiryDate: new Date('2026-09-15'),
        isValid: true,
        issuingAuthority: 'Berufsgenossenschaft',
      },
      {
        type: QualificationType.FIRST_AID,
        name: 'Erste-Hilfe-Kurs',
        issuedDate: new Date('2023-11-10'),
        expiryDate: new Date('2025-11-10'),
        isValid: true,
        issuingAuthority: 'DRK Heidelberg',
      },
      {
        type: QualificationType.OTHER,
        name: 'Landmaschinenmechaniker-Meister',
        issuedDate: new Date('2000-07-15'),
        isValid: true,
        certificateNumber: 'LM-MEISTER-2000-142',
        issuingAuthority: 'Handwerkskammer Mannheim',
      },
    ],
    
    hasPesticideLicense: false,
    hasTractorLicense: true,
    
    skills: [
      'Traktorwartung',
      'Schweißen',
      'Hydrauliksysteme',
      'Elektronik',
      'Motordiagnose',
      'Dreschertechnik',
    ],
    languages: ['Deutsch'],
    
    documents: [
      {
        id: 'DOC-006',
        type: 'Arbeitsvertrag',
        name: 'Arbeitsvertrag_Bauer_2015.pdf',
        uploadDate: new Date('2023-01-15'),
        fileUrl: '/documents/contracts/bauer_2015.pdf',
      },
      {
        id: 'DOC-007',
        type: 'Zeugnis',
        name: 'Meisterbrief_Landmaschinenmechaniker.pdf',
        uploadDate: new Date('2023-01-15'),
        fileUrl: '/documents/certificates/meisterbrief_bauer.pdf',
      },
    ],
    
    notes: 'Erfahrener Landmaschinenmechaniker-Meister. Teilzeit (20h/Woche), primär für Wartung und Reparatur der Betriebsmaschinen zuständig. Hat eigene Werkstatt in HD.',
    preferredTasks: ['Wartung', 'Reparatur', 'Schweißarbeiten'],
    
    createdAt: new Date('2023-01-10T11:30:00Z'),
    updatedAt: new Date('2024-01-20T13:10:00Z'),
    createdBy: 'admin',
  },
  
  {
    id: 'PERS-005',
    tenantId: 'tenant-1',
    companyId: 'company-1',
    
    firstName: 'Ionuț',
    lastName: 'Popescu',
    fullName: 'Ionuț Popescu',
    dateOfBirth: new Date('1996-07-22'),
    nationality: 'Rumänien',
    employeeNumber: 'LW-005',
    
    role: PersonnelRole.HARVEST_HELPER,
    employmentStatus: EmploymentStatus.SEASONAL,
    
    contactInfo: {
      mobile: '+40 722 123456',
      email: 'ionut.popescu@email.ro',
    },
    
    emergencyContact: {
      name: 'Elena Popescu',
      relationship: 'Schwester',
      phone: '+40 722 654321',
    },
    
    contract: {
      startDate: new Date('2025-05-01'),
      endDate: new Date('2025-10-31'),
      isPermanent: false,
      weeklyHours: 40,
      hourlyRate: 14.50,
      vacationDays: 12,
    },
    
    qualifications: [
      {
        type: QualificationType.FIRST_AID,
        name: 'Erste-Hilfe-Kurs',
        issuedDate: new Date('2024-04-15'),
        expiryDate: new Date('2026-04-15'),
        isValid: true,
        issuingAuthority: 'DRK Heidelberg',
      },
    ],
    
    hasPesticideLicense: false,
    hasTractorLicense: false,
    
    skills: ['Ernte', 'Handarbeit', 'Verpackung'],
    languages: ['Rumänisch', 'Deutsch (Grundkenntnisse)', 'Englisch'],
    
    documents: [
      {
        id: 'DOC-008',
        type: 'Saisonvertrag',
        name: 'Saisonvertrag_Popescu_2025.pdf',
        uploadDate: new Date('2025-04-20'),
        fileUrl: '/documents/contracts/popescu_2025.pdf',
      },
      {
        id: 'DOC-009',
        type: 'A1-Bescheinigung',
        name: 'A1_Bescheinigung_Popescu.pdf',
        description: 'Sozialversicherungsbescheinigung EU',
        uploadDate: new Date('2025-04-20'),
        fileUrl: '/documents/a1/popescu_a1.pdf',
      },
    ],
    
    notes: 'Saisonarbeiter für Erntesaison 2025 (Mai-Oktober). Dritte Saison auf dem Betrieb, zuverlässig und fleißig.',
    preferredTasks: ['Ernte', 'Verpackung'],
    
    createdAt: new Date('2025-04-20T09:00:00Z'),
    updatedAt: new Date('2025-04-22T14:00:00Z'),
    createdBy: 'pers-001',
  },
  
  {
    id: 'PERS-006',
    tenantId: 'tenant-1',
    companyId: 'company-1',
    
    firstName: 'Lisa',
    lastName: 'Friedrich',
    fullName: 'Lisa Friedrich',
    dateOfBirth: new Date('2003-12-10'),
    nationality: 'Deutsch',
    employeeNumber: 'LW-AZ-001',
    
    role: PersonnelRole.APPRENTICE,
    employmentStatus: EmploymentStatus.TRAINEE,
    
    contactInfo: {
      email: 'lisa.friedrich@web.de',
      mobile: '+49 176 98765432',
      street: 'Gartenstraße 5',
      postalCode: '69118',
      city: 'Heidelberg',
      country: 'Deutschland',
    },
    
    emergencyContact: {
      name: 'Sabine Friedrich',
      relationship: 'Mutter',
      phone: '+49 6221 43210',
    },
    
    contract: {
      startDate: new Date('2023-08-01'),
      endDate: new Date('2026-07-31'),
      isPermanent: false,
      weeklyHours: 40,
      monthlySalary: 920, // Ausbildungsvergütung 2. Lehrjahr
      vacationDays: 30,
    },
    
    qualifications: [
      {
        type: QualificationType.FIRST_AID,
        name: 'Erste-Hilfe-Kurs',
        issuedDate: new Date('2023-09-10'),
        expiryDate: new Date('2025-09-10'),
        isValid: true,
        issuingAuthority: 'DRK Heidelberg',
      },
      {
        type: QualificationType.DRIVER_LICENSE_T,
        name: 'Führerschein Klasse T',
        issuedDate: new Date('2024-03-15'),
        isValid: true,
        certificateNumber: 'T240315HD',
        notes: 'Während Ausbildung erworben',
      },
    ],
    
    hasPesticideLicense: false,
    hasTractorLicense: true,
    
    skills: ['Lernen', 'Traktorfahren (Anfänger)', 'Tierpflege', 'Dokumentation'],
    languages: ['Deutsch', 'Englisch'],
    
    documents: [
      {
        id: 'DOC-010',
        type: 'Ausbildungsvertrag',
        name: 'Ausbildungsvertrag_Friedrich_2023.pdf',
        uploadDate: new Date('2023-07-15'),
        fileUrl: '/documents/contracts/friedrich_ausbildung_2023.pdf',
      },
      {
        id: 'DOC-011',
        type: 'Schulzeugnis',
        name: 'Realschulabschluss_Friedrich.pdf',
        uploadDate: new Date('2023-07-15'),
        fileUrl: '/documents/certificates/schulzeugnis_friedrich.pdf',
      },
    ],
    
    notes: 'Auszubildende zur Landwirtin, 2. Lehrjahr. Sehr motiviert und lernbereit. Besucht Berufsschule in Heidelberg (Blockunterricht).',
    preferredTasks: ['Lernen', 'Assistenz', 'Dokumentation'],
    
    createdAt: new Date('2023-07-15T10:00:00Z'),
    updatedAt: new Date('2025-01-10T11:20:00Z'),
    createdBy: 'pers-001',
    updatedBy: 'pers-001',
  },
];

/**
 * Mock Personnel Service Class
 * Provides CRUD operations and filtering for personnel management
 */
export class MockPersonnelService {
  /**
   * Get all personnel with optional filters
   */
  async getPersonnel(
    tenantId: string,
    companyId: string,
    filters?: PersonnelFilters
  ): Promise<PersonnelListItem[]> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 300));

    let results = MOCK_PERSONNEL.filter(
      (p) => p.tenantId === tenantId && p.companyId === companyId
    );

    // Apply filters
    if (filters) {
      // Active only (default behavior)
      if (filters.activeOnly !== false) {
        results = results.filter(
          (p) => p.employmentStatus !== EmploymentStatus.INACTIVE
        );
      }

      // Role filter
      if (filters.role) {
        results = results.filter((p) => p.role === filters.role);
      }

      // Employment status filter
      if (filters.employmentStatus) {
        results = results.filter(
          (p) => p.employmentStatus === filters.employmentStatus
        );
      }

      // Qualification filter
      if (filters.qualification) {
        results = results.filter((p) =>
          p.qualifications.some(
            (q) => q.type === filters.qualification && q.isValid
          )
        );
      }

      // Pesticide license filter
      if (filters.hasPesticideLicense !== undefined) {
        results = results.filter(
          (p) => p.hasPesticideLicense === filters.hasPesticideLicense
        );
      }

      // Tractor license filter
      if (filters.hasTractorLicense !== undefined) {
        results = results.filter(
          (p) => p.hasTractorLicense === filters.hasTractorLicense
        );
      }

      // Search term
      if (filters.searchTerm) {
        const search = filters.searchTerm.toLowerCase();
        results = results.filter(
          (p) =>
            p.fullName?.toLowerCase().includes(search) ||
            p.firstName.toLowerCase().includes(search) ||
            p.lastName.toLowerCase().includes(search) ||
            p.employeeNumber?.toLowerCase().includes(search) ||
            p.contactInfo.email?.toLowerCase().includes(search)
        );
      }

      // Sorting
      const sortBy = filters.sortBy || 'name';
      results.sort((a, b) => {
        switch (sortBy) {
          case 'name':
            return (a.fullName || a.lastName).localeCompare(
              b.fullName || b.lastName
            );
          case 'role':
            return a.role.localeCompare(b.role);
          case 'hireDate':
            return a.contract.startDate.getTime() - b.contract.startDate.getTime();
          case 'employeeNumber':
            return (a.employeeNumber || '').localeCompare(b.employeeNumber || '');
          default:
            return 0;
        }
      });
    }

    // Convert to list items
    return results.map((p) => this.toListItem(p));
  }

  /**
   * Get single personnel member by ID
   */
  async getPersonnelMember(
    tenantId: string,
    personnelId: string
  ): Promise<Personnel | null> {
    await new Promise((resolve) => setTimeout(resolve, 200));

    const personnel = MOCK_PERSONNEL.find(
      (p) => p.tenantId === tenantId && p.id === personnelId
    );

    return personnel ? { ...personnel } : null;
  }

  /**
   * Create new personnel member
   */
  async createPersonnel(
    tenantId: string,
    companyId: string,
    data: PersonnelFormData,
    userId?: string
  ): Promise<Personnel> {
    await new Promise((resolve) => setTimeout(resolve, 400));

    const newId = `PERS-${String(MOCK_PERSONNEL.length + 1).padStart(3, '0')}`;

    const newPersonnel: Personnel = {
      id: newId,
      tenantId,
      companyId,
      
      firstName: data.firstName,
      lastName: data.lastName,
      fullName: `${data.firstName} ${data.lastName}`,
      dateOfBirth: data.dateOfBirth,
      nationality: data.nationality,
      employeeNumber: data.employeeNumber,
      
      role: data.role,
      employmentStatus: data.employmentStatus,
      department: data.department,
      
      contactInfo: {
        email: data.email,
        phone: data.phone,
        mobile: data.mobile,
        street: data.street,
        postalCode: data.postalCode,
        city: data.city,
        country: 'Deutschland',
      },
      
      emergencyContact: data.emergencyContactName
        ? {
            name: data.emergencyContactName,
            relationship: data.emergencyContactRelationship || '',
            phone: data.emergencyContactPhone || '',
          }
        : undefined,
      
      contract: {
        startDate: data.contractStartDate,
        endDate: data.contractEndDate,
        isPermanent: data.isPermanent,
        weeklyHours: data.weeklyHours,
        hourlyRate: data.hourlyRate,
        monthlySalary: data.monthlySalary,
        vacationDays: data.vacationDays,
      },
      
      qualifications: [],
      hasPesticideLicense: false,
      hasTractorLicense: false,
      
      skills: data.skills || [],
      languages: data.languages || ['Deutsch'],
      
      documents: [],
      notes: data.notes,
      
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: userId,
    };

    MOCK_PERSONNEL.push(newPersonnel);
    return newPersonnel;
  }

  /**
   * Update existing personnel member
   */
  async updatePersonnel(
    tenantId: string,
    personnelId: string,
    data: Partial<PersonnelFormData>
  ): Promise<Personnel | null> {
    await new Promise((resolve) => setTimeout(resolve, 400));

    const index = MOCK_PERSONNEL.findIndex(
      (p) => p.tenantId === tenantId && p.id === personnelId
    );

    if (index === -1) return null;

    const personnel = MOCK_PERSONNEL[index];

    // Update fields
    if (data.firstName) personnel.firstName = data.firstName;
    if (data.lastName) personnel.lastName = data.lastName;
    if (data.firstName || data.lastName) {
      personnel.fullName = `${personnel.firstName} ${personnel.lastName}`;
    }
    if (data.dateOfBirth !== undefined) personnel.dateOfBirth = data.dateOfBirth;
    if (data.nationality) personnel.nationality = data.nationality;
    if (data.employeeNumber !== undefined) personnel.employeeNumber = data.employeeNumber;
    if (data.role) personnel.role = data.role;
    if (data.employmentStatus) personnel.employmentStatus = data.employmentStatus;
    if (data.department !== undefined) personnel.department = data.department;

    // Update contact info
    if (data.email !== undefined) personnel.contactInfo.email = data.email;
    if (data.phone !== undefined) personnel.contactInfo.phone = data.phone;
    if (data.mobile !== undefined) personnel.contactInfo.mobile = data.mobile;
    if (data.street !== undefined) personnel.contactInfo.street = data.street;
    if (data.postalCode !== undefined) personnel.contactInfo.postalCode = data.postalCode;
    if (data.city !== undefined) personnel.contactInfo.city = data.city;

    // Update contract
    if (data.contractStartDate) personnel.contract.startDate = data.contractStartDate;
    if (data.contractEndDate !== undefined) personnel.contract.endDate = data.contractEndDate;
    if (data.isPermanent !== undefined) personnel.contract.isPermanent = data.isPermanent;
    if (data.weeklyHours) personnel.contract.weeklyHours = data.weeklyHours;
    if (data.hourlyRate !== undefined) personnel.contract.hourlyRate = data.hourlyRate;
    if (data.monthlySalary !== undefined) personnel.contract.monthlySalary = data.monthlySalary;
    if (data.vacationDays) personnel.contract.vacationDays = data.vacationDays;

    // Update emergency contact
    if (
      data.emergencyContactName !== undefined ||
      data.emergencyContactRelationship !== undefined ||
      data.emergencyContactPhone !== undefined
    ) {
      if (data.emergencyContactName) {
        personnel.emergencyContact = {
          name: data.emergencyContactName,
          relationship: data.emergencyContactRelationship || '',
          phone: data.emergencyContactPhone || '',
        };
      } else {
        personnel.emergencyContact = undefined;
      }
    }

    // Update skills and languages
    if (data.skills) personnel.skills = data.skills;
    if (data.languages) personnel.languages = data.languages;
    if (data.notes !== undefined) personnel.notes = data.notes;

    personnel.updatedAt = new Date();

    return personnel;
  }

  /**
   * Delete personnel member
   * In production, might want to set to INACTIVE instead of actual deletion
   */
  async deletePersonnel(tenantId: string, personnelId: string): Promise<boolean> {
    await new Promise((resolve) => setTimeout(resolve, 300));

    const index = MOCK_PERSONNEL.findIndex(
      (p) => p.tenantId === tenantId && p.id === personnelId
    );

    if (index === -1) return false;

    // For safety, set to INACTIVE rather than deleting
    MOCK_PERSONNEL[index].employmentStatus = EmploymentStatus.INACTIVE;
    MOCK_PERSONNEL[index].updatedAt = new Date();

    return true;
  }

  /**
   * Add or update qualification for personnel member
   */
  async updateQualification(
    tenantId: string,
    personnelId: string,
    qualification: Qualification
  ): Promise<Personnel | null> {
    await new Promise((resolve) => setTimeout(resolve, 300));

    const personnel = MOCK_PERSONNEL.find(
      (p) => p.tenantId === tenantId && p.id === personnelId
    );

    if (!personnel) return null;

    // Check if qualification already exists (by type)
    const existingIndex = personnel.qualifications.findIndex(
      (q) => q.type === qualification.type
    );

    if (existingIndex !== -1) {
      // Update existing
      personnel.qualifications[existingIndex] = qualification;
    } else {
      // Add new
      personnel.qualifications.push(qualification);
    }

    // Update pesticide license flag
    personnel.hasPesticideLicense = personnel.qualifications.some(
      (q) => q.type === QualificationType.PESTICIDE_LICENSE && q.isValid
    );

    // Update tractor license flag
    personnel.hasTractorLicense = personnel.qualifications.some(
      (q) => q.type === QualificationType.DRIVER_LICENSE_T && q.isValid
    );

    personnel.updatedAt = new Date();

    return personnel;
  }

  /**
   * Get personnel statistics for dashboard
   */
  async getPersonnelStatistics(
    tenantId: string,
    companyId: string
  ): Promise<PersonnelStatistics> {
    await new Promise((resolve) => setTimeout(resolve, 300));

    const personnel = MOCK_PERSONNEL.filter(
      (p) => p.tenantId === tenantId && p.companyId === companyId
    );

    const activePersonnel = personnel.filter(
      (p) => p.employmentStatus !== EmploymentStatus.INACTIVE
    );

    // Role distribution
    const roleDistribution: Record<PersonnelRole, number> = {
      [PersonnelRole.FARM_MANAGER]: 0,
      [PersonnelRole.FARMER]: 0,
      [PersonnelRole.TRACTOR_DRIVER]: 0,
      [PersonnelRole.HARVEST_HELPER]: 0,
      [PersonnelRole.MECHANIC]: 0,
      [PersonnelRole.ANIMAL_CARETAKER]: 0,
      [PersonnelRole.ADMIN]: 0,
      [PersonnelRole.APPRENTICE]: 0,
      [PersonnelRole.INTERN]: 0,
      [PersonnelRole.OTHER]: 0,
    };

    activePersonnel.forEach((p) => {
      roleDistribution[p.role]++;
    });

    // Expiring qualifications (next 30 days)
    const now = new Date();
    const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    const expiringQualifications: Array<{
      personnelId: string;
      personnelName: string;
      qualificationType: QualificationType;
      expiryDate: Date;
    }> = [];

    activePersonnel.forEach((p) => {
      p.qualifications.forEach((q) => {
        if (
          q.expiryDate &&
          q.expiryDate >= now &&
          q.expiryDate <= thirtyDaysFromNow
        ) {
          expiringQualifications.push({
            personnelId: p.id,
            personnelName: p.fullName || `${p.firstName} ${p.lastName}`,
            qualificationType: q.type,
            expiryDate: q.expiryDate,
          });
        }
      });
    });

    // Average tenure
    const tenureYears = activePersonnel.map((p) => {
      const years =
        (now.getTime() - p.contract.startDate.getTime()) /
        (1000 * 60 * 60 * 24 * 365);
      return years;
    });
    const averageTenureYears =
      tenureYears.length > 0
        ? tenureYears.reduce((sum, y) => sum + y, 0) / tenureYears.length
        : 0;

    return {
      totalCount: personnel.length,
      activeCount: activePersonnel.length,
      fullTimeCount: activePersonnel.filter(
        (p) => p.employmentStatus === EmploymentStatus.FULL_TIME
      ).length,
      partTimeCount: activePersonnel.filter(
        (p) => p.employmentStatus === EmploymentStatus.PART_TIME
      ).length,
      seasonalCount: activePersonnel.filter(
        (p) => p.employmentStatus === EmploymentStatus.SEASONAL
      ).length,
      roleDistribution,
      expiringQualifications,
      averageTenureYears,
      pesticideLicenseCount: activePersonnel.filter((p) => p.hasPesticideLicense)
        .length,
      tractorLicenseCount: activePersonnel.filter((p) => p.hasTractorLicense)
        .length,
    };
  }

  /**
   * Convert full Personnel to PersonnelListItem
   * @private
   */
  private toListItem(personnel: Personnel): PersonnelListItem {
    // Count expiring qualifications (next 60 days)
    const now = new Date();
    const sixtyDaysFromNow = new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000);
    const expiringCount = personnel.qualifications.filter(
      (q) =>
        q.expiryDate &&
        q.expiryDate >= now &&
        q.expiryDate <= sixtyDaysFromNow
    ).length;

    return {
      id: personnel.id,
      fullName: personnel.fullName || `${personnel.firstName} ${personnel.lastName}`,
      firstName: personnel.firstName,
      lastName: personnel.lastName,
      role: personnel.role,
      employmentStatus: personnel.employmentStatus,
      photoUrl: personnel.photoUrl,
      email: personnel.contactInfo.email,
      phone: personnel.contactInfo.phone || personnel.contactInfo.mobile,
      hasPesticideLicense: personnel.hasPesticideLicense || false,
      hasTractorLicense: personnel.hasTractorLicense || false,
      expiringQualificationsCount: expiringCount > 0 ? expiringCount : undefined,
      updatedAt: personnel.updatedAt,
    };
  }
}

/**
 * Singleton instance for global use
 */
export const mockPersonnelService = new MockPersonnelService();
