/**
 * GAP (Gemeinsame Agrarpolitik) Types
 * Structures for EU Common Agricultural Policy support schemes
 */

// GLÖZ Standards (Guter landwirtschaftlicher und ökologischer Zustand)
export enum GloezStandard {
  GLOEZ_1 = 'GLOEZ_1', // Erhaltung von Dauergrünland
  GLOEZ_2 = 'GLOEZ_2', // Schutz von Feuchtgebieten und Torfmooren
  GLOEZ_3 = 'GLOEZ_3', // Verbot des Abbrennens von Stoppelfeldern
  GLOEZ_4 = 'GLOEZ_4', // Schaffung von Pufferstreifen entlang von Wasserläufen
  GLOEZ_5 = 'GLOEZ_5', // Erosionsschutz
  GLOEZ_6 = 'GLOEZ_6', // Mindestbodenbedeckung
  GLOEZ_7 = 'GLOEZ_7', // Fruchtwechsel
  GLOEZ_8 = 'GLOEZ_8', // Mindestanteil nicht produktiver Flächen
  GLOEZ_9 = 'GLOEZ_9', // Verbot des Umbruchs von Dauergrünland
}

export interface GloezCompliance {
  standard: GloezStandard;
  companyId: string;
  status: 'compliant' | 'non-compliant' | 'at-risk' | 'not-applicable';
  lastChecked: Date;
  issues: GloezIssue[];
  notes?: string;
}

export interface GloezIssue {
  id: string;
  severity: 'critical' | 'warning' | 'info';
  description: string;
  affectedFieldIds: string[];
  detectedAt: Date;
  resolvedAt?: Date;
  recommendations: string[];
}

// Eco-Schemes (Öko-Regelungen)
export enum EcoSchemeType {
  ECO_1A = 'ECO_1A', // Bereitstellung von Biodiversitätsflächen
  ECO_1B = 'ECO_1B', // Blühstreifen in Ackerflächen
  ECO_2 = 'ECO_2',   // Anbau vielfältiger Kulturen
  ECO_3 = 'ECO_3',   // Beibehaltung Agroforst
  ECO_4 = 'ECO_4',   // Extensivgrünland
  ECO_5 = 'ECO_5',   // Ergebnisorientierte extensive Bewirtschaftung
  ECO_6 = 'ECO_6',   // Bewirtschaftung von Acker- und Dauerkulturflächen ohne chem. Pflanzenschutz
  ECO_7 = 'ECO_7',   // Anwendung von Präzisionslandwirtschaft
}

export interface EcoSchemeApplication {
  id: string;
  companyId: string;
  year: number;
  type: EcoSchemeType;
  area: number; // Hectares
  fieldIds: string[];
  expectedPayment: number; // Euro
  status: 'planned' | 'applied' | 'approved' | 'rejected' | 'paid';
  applicationDate?: Date;
  approvalDate?: Date;
  paymentDate?: Date;
  notes?: string;
}

// Application (Sammelantrag)
export enum ApplicationStatus {
  DRAFT = 'draft',
  SUBMITTED = 'submitted',
  UNDER_REVIEW = 'under_review',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  REVISION_REQUIRED = 'revision_required',
}

export interface GapApplication {
  id: string;
  companyId: string;
  year: number;
  status: ApplicationStatus;
  submittedAt?: Date;
  submittedBy?: string;
  updatedAt: Date;
  
  // Basic Payment Scheme (Basisprämie)
  basisPremium: {
    eligibleArea: number; // Hectares
    expectedPayment: number; // Euro
  };
  
  // Greening Premium (Greeningprämie - now integrated as GLÖZ)
  gloezCompliant: boolean;
  
  // Eco-Schemes (Öko-Regelungen)
  ecoSchemes: EcoSchemeApplication[];
  
  // Young Farmer Premium (Junglandwirteprämie)
  youngFarmerPremium?: {
    eligible: boolean;
    expectedPayment: number;
  };
  
  // Total expected payment
  totalExpectedPayment: number;
  
  // Attachments and documentation
  documents: ApplicationDocument[];
  
  notes?: string;
}

export interface ApplicationDocument {
  id: string;
  name: string;
  type: 'field_map' | 'proof_of_ownership' | 'contract' | 'certificate' | 'other';
  url: string;
  uploadedAt: Date;
  uploadedBy: string;
  size: number; // bytes
}

// Deadlines (Fristen)
export enum DeadlineType {
  APPLICATION_SUBMISSION = 'application_submission', // Sammelantrag abgeben
  MODIFICATION = 'modification',                     // Änderungen möglich
  GLOEZ_COMPLIANCE = 'gloez_compliance',            // GLÖZ-Nachweis
  ECO_SCHEME_DOCUMENTATION = 'eco_scheme_documentation', // Öko-Regelung dokumentieren
  INSPECTION_PREPARATION = 'inspection_preparation', // Kontrolle vorbereiten
  PAYMENT_EXPECTED = 'payment_expected',            // Auszahlung erwartet
}

export interface Deadline {
  id: string;
  type: DeadlineType;
  year: number;
  date: Date;
  description: string;
  completed: boolean;
  completedAt?: Date;
  priority: 'low' | 'medium' | 'high' | 'critical';
  relatedApplicationId?: string;
  reminders: DeadlineReminder[];
}

export interface DeadlineReminder {
  id: string;
  daysBefore: number;
  sent: boolean;
  sentAt?: Date;
}

// Statistics and Overview
export interface GapOverview {
  companyId: string;
  year: number;
  
  // GLÖZ Compliance
  gloezCompliance: {
    compliant: number;
    nonCompliant: number;
    atRisk: number;
    notApplicable: number;
  };
  
  // Applications
  applicationStatus?: ApplicationStatus;
  
  // Expected payments
  expectedPayments: {
    basisPremium: number;
    ecoSchemes: number;
    youngFarmer: number;
    total: number;
  };
  
  // Deadlines
  upcomingDeadlines: number;
  missedDeadlines: number;
}

// Filters for listing
export interface GapFilters {
  year?: number;
  status?: ApplicationStatus;
  gloezStandard?: GloezStandard;
  ecoSchemeType?: EcoSchemeType;
  complianceStatus?: 'compliant' | 'non-compliant' | 'at-risk';
}
