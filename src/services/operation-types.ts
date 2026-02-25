/**
 * Operation Types & Models for AgroTrack
 * 
 * Defines all TypeScript interfaces and enums for field operations (Aufträge/Einsätze)
 * including work types, status, machinery assignments, personnel, and tracking metrics.
 * 
 * @module operation-types
 */

/**
 * Status eines Arbeitsauftrags im Lebenszyklus
 * @enum {string}
 */
export enum OperationStatus {
  /** Geplant, noch nicht gestartet */
  PLANNED = 'PLANNED',
  /** Gerade in Arbeit */
  IN_PROGRESS = 'IN_PROGRESS',
  /** Abgeschlossen */
  COMPLETED = 'COMPLETED',
  /** Abgebrochen/Storniert */
  CANCELLED = 'CANCELLED',
  /** Verschoben auf späteren Termin */
  POSTPONED = 'POSTPONED'
}

/**
 * Art der landwirtschaftlichen Arbeit
 * @enum {string}
 */
export enum OperationType {
  /** Bodenbearbeitung: Grundzug mit Pflug */
  PLOWING = 'PLOWING',
  /** Aussaat mit Sämaschine */
  SOWING = 'SOWING',
  /** Düngergabe (organisch oder mineralisch) */
  FERTILIZING = 'FERTILIZING',
  /** Pflanzenschutzmaßnahme (Spritzen mit Fungizide, Insektizide, Herbizide, etc.) */
  SPRAYING = 'SPRAYING',
  /** Mahd/Schnitt (Gras, Getreide) */
  MOWING = 'MOWING',
  /** Ernte (Körnerfrüchte, Rüben, Kartoffeln, etc.) */
  HARVESTING = 'HARVESTING',
  /** Schwadenlage (Bereitstellung zum Trocknen) */
  WINDROWING = 'WINDROWING',
  /** Drusch (Getreide aus Schwad ausdreschen) */
  THRESHING = 'THRESHING',
  /** Heu- oder Silage-Werbung (Pressen, Wickeln) */
  BALING = 'BALING',
  /** Bodenbearbeitung: Eggen zur Krummelstruktur */
  DISKING = 'DISKING',
  /** Bodenbearbeitung: Walzen zur Verdichtung */
  ROLLING = 'ROLLING',
  /** Bodenbearbeitung: Kombiniert (mehrere Schritte) */
  CULTIVATING = 'CULTIVATING',
  /** Unkrautbekämpfung mechanisch */
  WEEDING = 'WEEDING',
  /** Wartung/Reparatur an Maschine */
  MAINTENANCE = 'MAINTENANCE',
  /** Sonstige Arbeiten */
  OTHER = 'OTHER'
}

/**
 * Wetterbedingungen während Operation
 * @interface
 */
export interface WeatherConditions {
  /** Temperatur in °C */
  temperature?: number;
  /** Niederschlag in mm */
  precipitation?: number;
  /** Windgeschwindigkeit in km/h */
  windSpeed?: number;
  /** Windrichtung (N, NE, E, SE, S, SW, W, NW) */
  windDirection?: string;
  /** Bodenfeuchte (0-100%) */
  soilMoisture?: number;
  /** Notizen zu Wetterbedingungen */
  notes?: string;
}

/**
 * Beteiligte Maschine/Gerät
 * @interface
 */
export interface MachineryAssignment {
  /** Maschinentyp (z.B. "Traktor", "Drillmaschine", "Spritzgerät") */
  type: string;
  /** Maschinenmodell oder spez. Identifier (optional) */
  model?: string;
  /** Tatsächliche Betriebsstunden */
  operatingHours?: number;
  /** Kilometerstand am Anfang */
  startOdometer?: number;
  /** Kilometerstand am Ende */
  endOdometer?: number;
  /** Instandhaltungsnotizen */
  notes?: string;
}

/**
 * Beteiligte Person (Fahrer, Helfer, etc.)
 * @interface
 */
export interface PersonnelAssignment {
  /** ID des Mitarbeiters */
  personnelId: string;
  /** Name für Quick-Display */
  name: string;
  /** Rolle (z.B. "Fahrer", "Helfer", "Operator") */
  role: string;
  /** Tatsächliche Stunden/Zeit */
  hoursWorked?: number;
  /** Stundensatz (optional für Kostenrechnung) */
  hourlyRate?: number;
}

/**
 * Verbrauchte Materialien
 * @interface
 */
export interface MaterialUsage {
  /** Material-Name (z.B. "Dünger N30", "Herbizid Glyphosat") */
  name: string;
  /** Menge verwendet */
  quantity: number;
  /** Einheit (kg, L, Säcke, etc.) */
  unit: string;
  /** Kosten für Material */
  cost?: number;
  /** Notizen/Spezifikation */
  notes?: string;
}

/**
 * Arbeitsmetriken & Ergebnisse
 * @interface
 */
export interface OperationMetrics {
  /** Bearbeitete Fläche in ha */
  areaWorked?: number;
  /** Durchschnittliche Geschwindigkeit (km/h) */
  averageSpeed?: number;
  /** Anteil an Gesamtfläche des Feldes (%) */
  completionPercentage?: number;
  /** Ergebnis (z.B. Ernteergebnis dt/ha) */
  yield?: number;
  /** Qualitätsmerkmale oder Besonderheiten */
  qualityNotes?: string;
  /** Fotos/Bilder (URLs) */
  attachments?: string[];
}

/**
 * Kosten für Operation
 * @interface
 */
export interface OperationCosts {
  /** Maschinenkosten (Betrieb, Verschleiß) */
  machineryCustomCosts?: number;
  /** Treibstoff/Strom */
  fuelCosts?: number;
  /** Personalkosten (Stundensatz × Zeit) */
  laborCosts?: number;
  /** Materialkosten (Dünger, Pestizide, etc.) */
  materialCosts?: number;
  /** Sonstige Kosten (Kontraktoren, Fremdfirmen) */
  otherCosts?: number;
  /** Grund für Kostenabweichung (falls Budget überschritten) */
  costVarianceNotes?: string;
}

/**
 * Vollständiges Arbeitsauftrags-Modell
 * @interface
 */
export interface Operation {
  // === Identität & Zugehörigkeit ===
  /** Eindeutige ID */
  id: string;
  /** Miet-/Mandant-ID (Multi-Tenancy) */
  tenantId: string;
  /** Unternehmens-ID */
  companyId: string;
  /** Feldnummer, auf dem die Arbeit erfolgt */
  fieldId: string;

  // === Basis-Informationen ===
  /** Beschreibung der Arbeit (z.B. "Frühjahrsbestellung Weizen") */
  title: string;
  /** Detaillierte Notizen zur Operation */
  description?: string;
  /** Typ der Arbeit */
  operationType: OperationType;
  /** Status */
  status: OperationStatus;
  /** Priorität (1-5, 5 = sehr wichtig) */
  priority?: number;

  // === Zeitplanung ===
  /** Geplanter Startdatum/Zeit */
  plannedStartDate: Date;
  /** Geplantes Enddatum/Zeit */
  plannedEndDate: Date;
  /** Tatsächlicher Startdatum/Zeit */
  actualStartDate?: Date;
  /** Tatsächlicher Enddatum/Zeit */
  actualEndDate?: Date;
  /** Geschätzte Gesamtdauer in Stunden */
  estimatedDurationHours?: number;

  // === Ressourcen ===
  /** Zugeordnete Maschinen */
  machinery: MachineryAssignment[];
  /** Beteiligte Personen */
  personnel: PersonnelAssignment[];
  /** Eingesetzte Materialien */
  materials: MaterialUsage[];

  // === Umgebungsbedingungen ===
  /** Wetterbedingungen */
  weatherConditions?: WeatherConditions;
  /** Bodenbeschaffenheit Notizen */
  soilConditions?: string;

  // === Ergebnisse & Verbrauch ===
  /** Arbeitsmetriken & Ergebnisse */
  metrics?: OperationMetrics;
  /** Kostenaufschlüsselung */
  costs?: OperationCosts;
  /** Abweichungen/Probleme (z.B. "Maschine defekt", "Zu nassers Boden") */
  deviations?: string;

  // === Audit Trail ===
  /** Erstellt am */
  createdAt: Date;
  /** Zuletzt aktualisiert am */
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
export interface OperationListItem {
  /** ID */
  id: string;
  /** Titel der Operation */
  title: string;
  /** Feld-ID */
  fieldId: string;
  /** Operationstyp */
  operationType: OperationType;
  /** Status */
  status: OperationStatus;
  /** Geplantes Startdatum */
  plannedStartDate: Date;
  /** Tatsächliches Startdatum (wenn gestartet) */
  actualStartDate?: Date;
  /** Bearbeitete Fläche (von Metriken) */
  areaWorked?: number;
  /** Priorität */
  priority?: number;
  /** Letzte Änderung */
  updatedAt: Date;
}

/**
 * Formular-Daten für Create/Edit
 * @interface
 */
export interface OperationFormData {
  title: string;
  description?: string;
  operationType: OperationType;
  fieldId: string;
  priority?: number;
  plannedStartDate: Date;
  plannedEndDate: Date;
  estimatedDurationHours?: number;
  materialIds?: string[];
  personnelIds?: string[];
  machinery?: MachineryAssignment[];
}

/**
 * Filter-Optionen für Operation-Abfragen
 * @interface
 */
export interface OperationFilters {
  /** Nach Status filtern */
  status?: OperationStatus;
  /** Nach Operationstyp filtern */
  operationType?: OperationType;
  /** Nach Feldnummer filtern */
  fieldId?: string;
  /** Suchtext (Titel, Beschreibung) */
  searchTerm?: string;
  /** Sortierfeld */
  sortBy?: 'date' | 'title' | 'priority' | 'field';
  /** Datum-Bereich (nur Operationen in diesem Zeitraum) */
  dateRange?: {
    from: Date;
    to: Date;
  };
}

/**
 * Statistiken zu Operationen (z.B. für Dashboard)
 * @interface
 */
export interface OperationStatistics {
  /** Anzahl geplanter Operationen */
  plannedCount: number;
  /** Anzahl in Arbeit */
  inProgressCount: number;
  /** Anzahl abgeschlossen */
  completedCount: number;
  /** Durchschnittliche Betriebsdauer pro Operation (Stunden) */
  averageDurationHours: number;
  /** Durchschnittliche Kosten pro Operation */
  averageCost: number;
  /** Gesamtbearbeitete Fläche (ha) */
  totalAreaWorked: number;
  /** Verteilung nach Operationstyp */
  operationTypeDistribution: Record<OperationType, number>;
  /** Übersicht der Top-Kosten-Operationen */
  topCostOperations: Array<{ id: string; title: string; totalCost: number }>;
}
