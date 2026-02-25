/**
 * Personnel Types & Models for AgroTrack
 * 
 * Defines all TypeScript interfaces and enums for personnel management (Personalverwaltung)
 * including roles, qualifications, certifications, work time tracking, and documentation.
 * 
 * @module personnel-types
 */

/**
 * Rolle/Position im Betrieb
 * @enum {string}
 */
export enum PersonnelRole {
  /** Betriebsleiter */
  FARM_MANAGER = 'FARM_MANAGER',
  /** Landwirt/Fachkraft */
  FARMER = 'FARMER',
  /** Traktorfahrer */
  TRACTOR_DRIVER = 'TRACTOR_DRIVER',
  /** Erntehelfer saisonal */
  HARVEST_HELPER = 'HARVEST_HELPER',
  /** Mechaniker */
  MECHANIC = 'MECHANIC',
  /** Tierpfleger (bei Viehhaltung) */
  ANIMAL_CARETAKER = 'ANIMAL_CARETAKER',
  /** Verwaltung/Büro */
  ADMIN = 'ADMIN',
  /** Auszubildender */
  APPRENTICE = 'APPRENTICE',
  /** Praktikant */
  INTERN = 'INTERN',
  /** Sonstiges */
  OTHER = 'OTHER'
}

/**
 * Beschäftigungsstatus
 * @enum {string}
 */
export enum EmploymentStatus {
  /** Festangestellt Vollzeit */
  FULL_TIME = 'FULL_TIME',
  /** Teilzeit */
  PART_TIME = 'PART_TIME',
  /** Saisonarbeiter */
  SEASONAL = 'SEASONAL',
  /** Minijob (450€/520€) */
  MINI_JOB = 'MINI_JOB',
  /** Praktikant/Auszubildender */
  TRAINEE = 'TRAINEE',
  /** Freiberufler/Subunternehmer */
  CONTRACTOR = 'CONTRACTOR',
  /** Inaktiv (vergangene Mitarbeiter) */
  INACTIVE = 'INACTIVE'
}

/**
 * Qualifikationstypen
 * @enum {string}
 */
export enum QualificationType {
  /** Pflanzenschutz-Sachkundenachweis */
  PESTICIDE_LICENSE = 'PESTICIDE_LICENSE',
  /** Führerschein Klasse T (Traktor) */
  DRIVER_LICENSE_T = 'DRIVER_LICENSE_T',
  /** LKW-Führerschein (C/CE) */
  DRIVER_LICENSE_C = 'DRIVER_LICENSE_C',
  /** Gabelstaplerführerschein */
  FORKLIFT_LICENSE = 'FORKLIFT_LICENSE',
  /** Schweißerschein */
  WELDING_CERTIFICATE = 'WELDING_CERTIFICATE',
  /** Erste-Hilfe-Kurs */
  FIRST_AID = 'FIRST_AID',
  /** Ladungssicherung */
  CARGO_SECURING = 'CARGO_SECURING',
  /** Tierschutz-Schulung */
  ANIMAL_WELFARE = 'ANIMAL_WELFARE',
  /** Hygiene-Schulung (HACCP) */
  HYGIENE_HACCP = 'HYGIENE_HACCP',
  /** Arbeitssicherheit */
  WORK_SAFETY = 'WORK_SAFETY',
  /** Sonstige Qualifikation */
  OTHER = 'OTHER'
}

/**
 * Qualifikation/Zertifizierung
 * @interface
 */
export interface Qualification {
  /** Typ der Qualifikation */
  type: QualificationType;
  /** Name/Beschreibung */
  name: string;
  /** Ausstellungsdatum */
  issuedDate: Date;
  /** Ablaufdatum (falls befristet) */
  expiryDate?: Date;
  /** Ist die Qualifikation noch gültig? */
  isValid: boolean;
  /** Zertifikatsnummer */
  certificateNumber?: string;
  /** Ausstellende Stelle */
  issuingAuthority?: string;
  /** Dokumenten-URL (PDF, Bild) */
  documentUrl?: string;
  /** Notizen */
  notes?: string;
}

/**
 * Vertragsdetails
 * @interface
 */
export interface EmploymentContract {
  /** Vertragsbeginn */
  startDate: Date;
  /** Vertragsende (falls befristet) */
  endDate?: Date;
  /** Ist unbefristet? */
  isPermanent: boolean;
  /** Wochenarbeitsstunden */
  weeklyHours: number;
  /** Stundenlohn in € */
  hourlyRate?: number;
  /** Monatsgehalt in € */
  monthlySalary?: number;
  /** Urlaubstage pro Jahr */
  vacationDays: number;
  /** Probezeit in Monaten */
  probationPeriod?: number;
  /** Kündigungsfrist in Tagen */
  noticePeriod?: number;
}

/**
 * Arbeitszeiterfassung (einzelner Eintrag)
 * @interface
 */
export interface WorkTimeEntry {
  /** ID des Eintrags */
  id: string;
  /** Mitarbeiter-ID */
  personnelId: string;
  /** Datum */
  date: Date;
  /** Startzeit */
  startTime: Date;
  /** Endzeit */
  endTime: Date;
  /** Pausenzeit in Minuten */
  breakMinutes: number;
  /** Effektive Arbeitsstunden */
  hoursWorked: number;
  /** Überstunden */
  overtimeHours?: number;
  /** Aktivität/Beschreibung */
  activity?: string;
  /** Verknüpfte Operation (falls zutreffend) */
  operationId?: string;
  /** Notizen */
  notes?: string;
}

/**
 * Kontaktinformationen
 * @interface
 */
export interface ContactInfo {
  /** E-Mail */
  email?: string;
  /** Telefon */
  phone?: string;
  /** Mobil */
  mobile?: string;
  /** Straße & Hausnummer */
  street?: string;
  /** PLZ */
  postalCode?: string;
  /** Stadt */
  city?: string;
  /** Land */
  country?: string;
}

/**
 * Notfallkontakt
 * @interface
 */
export interface EmergencyContact {
  /** Name */
  name: string;
  /** Beziehung (z.B. "Ehepartner", "Elternteil") */
  relationship: string;
  /** Telefon */
  phone: string;
  /** Alternative Telefon */
  alternativePhone?: string;
}

/**
 * Dokumente (Verträge, Zeugnisse, etc.)
 * @interface
 */
export interface PersonnelDocument {
  /** ID des Dokuments */
  id: string;
  /** Typ (z.B. "Arbeitsvertrag", "Zeugnis", "ID-Kopie") */
  type: string;
  /** Name */
  name: string;
  /** Beschreibung */
  description?: string;
  /** Datei-URL */
  fileUrl: string;
  /** Upload-Datum */
  uploadDate: Date;
  /** Hochgeladen von (User-ID) */
  uploadedBy?: string;
}

/**
 * Vollständiges Personal-Modell
 * @interface
 */
export interface Personnel {
  // === Identität ===
  /** Eindeutige ID */
  id: string;
  /** Miet-/Mandant-ID */
  tenantId: string;
  /** Unternehmens-ID */
  companyId: string;
  
  // === Persönliche Daten ===
  /** Vorname */
  firstName: string;
  /** Nachname */
  lastName: string;
  /** Vollständiger Name (computed) */
  fullName?: string;
  /** Geburtsdatum */
  dateOfBirth?: Date;
  /** Nationalität */
  nationality?: string;
  /** Personalnummer */
  employeeNumber?: string;
  /** Foto-URL */
  photoUrl?: string;
  
  // === Position & Status ===
  /** Rolle/Position */
  role: PersonnelRole;
  /** Beschäftigungsstatus */
  employmentStatus: EmploymentStatus;
  /** Abteilung (optional für große Betriebe) */
  department?: string;
  
  // === Kontakt ===
  /** Kontaktinformationen */
  contactInfo: ContactInfo;
  /** Notfallkontakt */
  emergencyContact?: EmergencyContact;
  
  // === Vertrag ===
  /** Vertragsdetails */
  contract: EmploymentContract;
  
  // === Qualifikationen ===
  /** Liste aller Qualifikationen/Zertifikate */
  qualifications: Qualification[];
  /** Hat gültige Pflanzenschutz-Lizenz? */
  hasPesticideLicense?: boolean;
  /** Hat Traktor-Führerschein? */
  hasTractorLicense?: boolean;
  
  // === Arbeitsfähigkeiten ===
  /** Spezialisierungen/Fähigkeiten */
  skills: string[];
  /** Sprachen */
  languages: string[];
  /** Notizen zu Fähigkeiten */
  skillNotes?: string;
  
  // === Arbeitszeitdokumentation ===
  /** Link zu Arbeitszeiteinträgen (wird separat abgerufen) */
  workTimeEntries?: WorkTimeEntry[];
  
  // === Dokumente ===
  /** Hochgeladene Dokumente */
  documents: PersonnelDocument[];
  
  // === Notizen & Sonstiges ===
  /** Interne Notizen */
  notes?: string;
  /** Ist für bestimmte Aufgaben bevorzugt? */
  preferredTasks?: string[];
  /** Gesundheitliche Einschränkungen (vertraulich) */
  healthRestrictions?: string;
  
  // === Audit Trail ===
  /** Erstellt am */
  createdAt: Date;
  /** Zuletzt aktualisiert */
  updatedAt: Date;
  /** Erstellt von (User-ID) */
  createdBy?: string;
  /** Zuletzt bearbeitet von (User-ID) */
  updatedBy?: string;
}

/**
 * Vereinfachte Ansicht für Listendarstellung
 * @interface
 */
export interface PersonnelListItem {
  /** ID */
  id: string;
  /** Vollständiger Name */
  fullName: string;
  /** Vorname */
  firstName: string;
  /** Nachname */
  lastName: string;
  /** Role/Position */
  role: PersonnelRole;
  /** Status */
  employmentStatus: EmploymentStatus;
  /** Foto-URL */
  photoUrl?: string;
  /** E-Mail */
  email?: string;
  /** Telefon */
  phone?: string;
  /** Hat gültige Pflanzenschutz-Lizenz? */
  hasPesticideLicense: boolean;
  /** Hat Traktor-Führerschein? */
  hasTractorLicense: boolean;
  /** Ablaufende Qualifikationen (Anzahl) */
  expiringQualificationsCount?: number;
  /** Letzte Änderung */
  updatedAt: Date;
}

/**
 * Formular-Daten für Create/Edit
 * @interface
 */
export interface PersonnelFormData {
  firstName: string;
  lastName: string;
  dateOfBirth?: Date;
  nationality?: string;
  employeeNumber?: string;
  role: PersonnelRole;
  employmentStatus: EmploymentStatus;
  department?: string;
  
  // Kontakt
  email?: string;
  phone?: string;
  mobile?: string;
  street?: string;
  postalCode?: string;
  city?: string;
  
  // Vertrag
  contractStartDate: Date;
  contractEndDate?: Date;
  isPermanent: boolean;
  weeklyHours: number;
  hourlyRate?: number;
  monthlySalary?: number;
  vacationDays: number;
  
  // Notfallkontakt
  emergencyContactName?: string;
  emergencyContactRelationship?: string;
  emergencyContactPhone?: string;
  
  // Fähigkeiten
  skills?: string[];
  languages?: string[];
  
  // Notizen
  notes?: string;
}

/**
 * Filter-Optionen für Personnel-Abfragen
 * @interface
 */
export interface PersonnelFilters {
  /** Nach Rolle filtern */
  role?: PersonnelRole;
  /** Nach Status filtern */
  employmentStatus?: EmploymentStatus;
  /** Nach Qualifikation filtern */
  qualification?: QualificationType;
  /** Nur Mitarbeiter mit gültiger Pestizid-Lizenz */
  hasPesticideLicense?: boolean;
  /** Nur Mitarbeiter mit Traktor-Führerschein */
  hasTractorLicense?: boolean;
  /** Suchtext (Name, Employee Number) */
  searchTerm?: string;
  /** Sortierfeld */
  sortBy?: 'name' | 'role' | 'hireDate' | 'employeeNumber';
  /** Nur aktive Mitarbeiter */
  activeOnly?: boolean;
}

/**
 * Statistiken zur Personalübersicht (z.B. für Dashboard)
 * @interface
 */
export interface PersonnelStatistics {
  /** Gesamtanzahl Mitarbeiter */
  totalCount: number;
  /** Aktive Mitarbeiter */
  activeCount: number;
  /** Vollzeit */
  fullTimeCount: number;
  /** Teilzeit */
  partTimeCount: number;
  /** Saisonarbeiter */
  seasonalCount: number;
  /** Verteilung nach Rollen */
  roleDistribution: Record<PersonnelRole, number>;
  /** Ablaufende Qualifikationen (nächste 30 Tage) */
  expiringQualifications: Array<{
    personnelId: string;
    personnelName: string;
    qualificationType: QualificationType;
    expiryDate: Date;
  }>;
  /** Durchschnittliche Betriebszugehörigkeit (Jahre) */
  averageTenureYears: number;
  /** Mitarbeiter mit Pflanzenschutz-Lizenz */
  pesticideLicenseCount: number;
  /** Mitarbeiter mit Traktor-Führerschein */
  tractorLicenseCount: number;
}

/**
 * Arbeitszeitübersicht (für Zeitraum)
 * @interface
 */
export interface WorkTimeSummary {
  /** Mitarbeiter-ID */
  personnelId: string;
  /** Mitarbeitername */
  personnelName: string;
  /** Zeitraum Start */
  periodStart: Date;
  /** Zeitraum Ende */
  periodEnd: Date;
  /** Gesamte Arbeitsstunden */
  totalHours: number;
  /** Überstunden */
  overtimeHours: number;
  /** Anzahl Arbeitstage */
  workDays: number;
  /** Durchschnittliche Stunden pro Tag */
  averageHoursPerDay: number;
}
