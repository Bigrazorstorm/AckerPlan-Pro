/**
 * Field (Schlag) Types & Models
 *
 * Ein Schlag ist die bewirtschaftete Einheit
 * Kann aus einem oder mehreren Flurstücken bestehen
 * Schläge sind Feldblöcken (Referenzparzellen/DGK-Lw) zugeordnet
 */

/**
 * Cadastral Parcel (Flurstück) Model
 * Rechtliche Grundeinheit aus dem Flurstückverzeichnis
 */
export interface CadastralParcel {
  id: string;                    // Eindeutige ID (UUID)
  tenantId: string;              // Mieter-ID (Betrieb)
  companyId: string;             // Unternehmen-ID
  
  // Identifikation
  name: string;                  // Anzeigename (z.B. "Flurstück 123/45")
  county: string;                // Landkreis
  municipality: string;          // Gemeinde
  district: string;              // Gemarkung
  parcelNumber: string;          // Flurstücksnummer (z.B. "123/45")
  subParcelNumber?: string;      // Unterflurstücksnummer
  
  // Fläche & Geometrie
  area: number;                  // Fläche in ha
  polygonGeoJSON?: string;       // GeoJSON Polygon für Kartendarstellung
  
  // Eigenschaft
  owner: string;                 // Eigentümer
  leasingStatus?: 'owned' | 'leased' | 'other'; // Bewirtschaftungsstatus
  
  // System
  createdAt: Date;
  updatedAt: Date;
  createdBy?: string;
}

/**
 * Field Block / Referenzparzelle (DGK-Lw) Model
 * Funktionale Einheit für Förderanträge (ELER, GAP, etc.)
 */
export interface FieldBlock {
  id: string;                    // Eindeutige ID (UUID)
  tenantId: string;              // Mieter-ID (Betrieb)
  companyId: string;             // Unternehmen-ID
  
  // Identifikation
  name: string;                  // Name (z.B. "Feldblock A")
  referenceNumber: string;       // Referenznummer (z.B. "DE-123456-001")
  dgkLwNumber?: string;          // DGK-Lw Identifizierung (für GAP-Compliance)
  
  // Fläche
  totalArea: number;             // Gesamtfläche in ha
  
  // Zuordnung
  fieldIds: string[];            // IDs der Schläge in diesem Feldblock
  cadastralParcelIds: string[];  // IDs der Flurstücke in diesem Feldblock
  
  // Förderung & Auflagen
  subsidyEligible: boolean;      // Für Direktzahlungen förderfähig?
  subsidyAmount?: number;        // Geschätzte Förderung in EUR
  gapCompliant: boolean;         // GAP-konform?
  environmentalZone?: boolean;   // In Umweltzone?
  restrictions?: string[];       // Weitere Auflagen (z.B. "3% Brachenbrache")
  
  // System
  createdAt: Date;
  updatedAt: Date;
  createdBy?: string;
}

/**
 * Field Status
 */
export enum FieldStatus {
  ACTIVE = 'active',        // Bewirtschaftet
  INACTIVE = 'inactive',    // Stillgelegt
  FALLOW = 'fallow',        // Brache
  ARCHIVED = 'archived',    // Archiviert
}

/**
 * Crop Type (Kulturart)
 */
export enum CropType {
  WHEAT = 'wheat',           // Weizen
  BARLEY = 'barley',         // Gerste
  RYE = 'rye',               // Roggen
  CORN = 'corn',             // Mais
  RAPESEED = 'rapeseed',     // Raps
  PEAS = 'peas',             // Erbsen
  BEANS = 'beans',           // Bohnen
  SUGAR_BEET = 'sugar_beet', // Zuckerrübe
  POTATO = 'potato',         // Kartoffeln
  GRASS = 'grass',           // Grasland
  CLOVER = 'clover',         // Klee
  OTHER = 'other',           // Sonstige
}

/**
 * Soil Type
 */
export enum SoilType {
  SANDY = 'sandy',           // Sandig
  LOAMY = 'loamy',           // Lehmig
  CLAY = 'clay',             // Tonig
  SILT = 'silt',             // Schluffig
  PEAT = 'peat',             // Torf
}

/**
 * Field (Schlag) Model
 */
export interface Field {
  id: string;                    // Eindeutige ID (UUID)
  tenantId: string;              // Mieter-ID (Betrieb)
  companyId: string;             // Unternehmen-ID
  
  // Basis-Infos
  name: string;                  // Name des Schlags (z.B. "Mühlfeld Ost")
  description?: string;          // Optionale Beschreibung
  status: FieldStatus;           // Status (aktiv, inaktiv, etc.)
  
  // Flurstücke & Feldblock
  cadastralParcelIds: string[];  // IDs der Flurstücke, aus denen dieser Schlag besteht
  fieldBlockId?: string;         // ID des zugeordneten Feldblocks (Referenzparzelle/DGK-Lw)
  
  // Lokalisierung
  location?: {
    lat?: number;               // Breitengrad
    lon?: number;               // Längengrad
    polygonGeoJSON?: string;    // GeoJSON Polygon
  };
  
  // Fläche & Geometrie
  totalArea: number;            // Gesamtfläche in ha (berechnet aus Flurstücken oder manuell)
  usableArea?: number;          // Nutzbare Fläche (kann von Gesamtfläche abweichen)
  
  // Eigenschaften
  soilType?: SoilType;          // Bodentyp
  soilQuality?: number;         // Bodenwertzahl (0-100)
  
  // Anbau-Infos (aktuelles/letztes Wirtschaftsjahr)
  currentCrop?: CropType;       // Aktuelle Kultur
  cropVariety?: string;         // Sorte (z.B. "Sommerweizen RGT Planet")
  sowingDate?: Date;            // Aussaat-Datum
  expectedHarvestDate?: Date;   // Erwarteter Erntetermin
  
  // Betriebsmittel
  labAnalysisDate?: Date;       // Letzter Bodenanalysetermin
  phValue?: number;             // pH-Wert
  nitrogenContent?: number;     // N-Gehalt (mg/100g)
  phosphorContent?: number;     // P-Gehalt
  potassiumContent?: number;    // K-Gehalt
  
  // Regulierung & Auflagen
  isEnvironmentalZone?: boolean; // In Umweltzone?
  environmentalMeasures?: string[]; // AUKM Maßnahmen
  restrictions?: string[];      // Weitere Auflagen
  huntingArea?: string;         // Zugeordnetes Jagdrevier
  
  // System
  createdAt: Date;
  updatedAt: Date;
  createdBy?: string;           // User ID
}

/**
 * Field List Item (für Tabellen/Karten-Übersicht)
 */
export interface FieldListItem {
  id: string;
  name: string;
  totalArea: number;
  currentCrop?: CropType;
  status: FieldStatus;
  lastActivity?: Date;
  nextMaintenanceDate?: Date;
}

/**
 * Field Create/Edit Request
 */
export interface FieldFormData {
  name: string;
  description?: string;
  cadastralParcelIds: string[];  // Flurstücke, aus denen dieser Schlag besteht
  fieldBlockId?: string;         // Zugeordneter Feldblock
  totalArea: number;
  usableArea?: number;
  soilType?: SoilType;
  soilQuality?: number;
  currentCrop?: CropType;
  cropVariety?: string;
  sowingDate?: Date;
  expectedHarvestDate?: Date;
  phValue?: number;
  isEnvironmentalZone?: boolean;
  environmentalMeasures?: string[];
}

/**
 * Filter Options für Feld-Liste
 */
export interface FieldFilters {
  status?: FieldStatus;
  cropType?: CropType;
  sortBy?: 'name' | 'area' | 'lastActivity';
  searchTerm?: string;
}

/**
 * Cadastral Parcel Create/Edit Request
 */
export interface CadastralParcelFormData {
  name: string;
  county: string;
  municipality: string;
  district: string;
  parcelNumber: string;
  subParcelNumber?: string;
  area: number;
  owner: string;
  leasingStatus?: 'owned' | 'leased' | 'other';
  polygonGeoJSON?: string;
}

/**
 * Field Block Create/Edit Request
 */
export interface FieldBlockFormData {
  name: string;
  referenceNumber: string;
  dgkLwNumber?: string;
  totalArea: number;
  fieldIds: string[];
  cadastralParcelIds: string[];
  subsidyEligible: boolean;
  subsidyAmount?: number;
  gapCompliant: boolean;
  environmentalZone?: boolean;
  restrictions?: string[];
}
