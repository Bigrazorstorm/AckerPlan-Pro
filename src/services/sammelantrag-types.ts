/**
 * Sammelantrag (EU GAP Application) Types
 * Defines structure for EU agricultural subsidy applications
 */

import { GloezStandard } from './gap-types';
import { FieldListItem } from './field-types';

/**
 * Application Steps Enum
 */
export enum SammelantragStep {
  FIELD_SELECTION = 'field-selection',
  AREA_SUMMARY = 'area-summary',
  COMPLIANCE_CHECK = 'compliance-check',
  ECO_SCHEMES = 'eco-schemes',
  DOCUMENTATION = 'documentation',
  PAYMENT_PREVIEW = 'payment-preview',
  REVIEW = 'review',
}

/**
 * Selected Eco-Scheme
 */
export interface SelectedEcoScheme {
  schemeId: string;
  enabledOn: string[]; // Field IDs
  expectedPayment: number; // EUR/ha
}

/**
 * Sammelantrag Application
 */
export interface SammelantragApplication {
  id: string;
  tenantId: string;
  companyId: string;
  
  // Application Metadata
  year: number;
  status: 'draft' | 'submitted' | 'approved' | 'rejected';
  createdAt: Date;
  submittedAt?: Date;
  
  // Field Selection
  selectedFields: string[]; // Field IDs
  totalArea: number; // ha
  
  // GLÖZ Compliance
  gloezCompliance: {
    standard: GloezStandard;
    status: 'compliant' | 'non-compliant' | 'at-risk';
    issues: string[];
  }[];
  
  // Eco-Schemes
  selectedEcoSchemes: SelectedEcoScheme[];
  
  // Documentation
  documents: {
    id: string;
    type: 'land-ownership' | 'lease-agreement' | 'aerial-photo' | 'crop-history' | 'other';
    fileName: string;
    fileSize: number;
    uploadedAt: Date;
    url: string;
  }[];
  
  // Financial Summary
  financialSummary: {
    directPaymentPerHa: number; // EUR/ha - typically 220 EUR/ha in Germany
    directPaymentTotal: number; // EUR
    ecoSchemePaymentTotal: number; // EUR
    totalExpectedPayment: number; // EUR
  };
  
  // Submission
  submissionNotes?: string;
  referenceNumber?: string; // Issued by authority after submission
}

/**
 * Sammelantrag Form Step State
 */
export interface SammelantragFormState {
  currentStep: SammelantragStep;
  selectedFields: string[];
  selectedEcoSchemes: SelectedEcoScheme[];
  documents: SammelantragApplication['documents'];
  complianceCheckResults: {
    standard: GloezStandard;
    status: 'compliant' | 'non-compliant' | 'at-risk';
  }[];
}

/**
 * Payment Calculation Result
 */
export interface PaymentCalculation {
  totalArea: number;
  directPaymentPerHa: number;
  directPaymentTotal: number;
  ecoSchemesByScheme: {
    schemeId: string;
    activeArea: number;
    paymentPerHa: number;
    paymentTotal: number;
  }[];
  ecoSchemePaymentTotal: number;
  totalExpectedPayment: number;
  paymentDate: Date; // Typically December
}
