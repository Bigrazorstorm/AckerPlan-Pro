export interface Kpi {
  labelKey: string;
  value: string;
  change: string;
  changeType: "increase" | "decrease";
};

export interface ChartDataPoint {
  month: string;
  revenue: number;
  cost: number;
};

export interface OperationMaterial {
  itemId: string;
  itemName: string;
  quantity: number;
  unit: string;
}

export interface OperationMaterialInput {
  itemId: string;
  quantity: number;
}

// Represents a summary of an operation.
export interface Operation {
  id: string; // Using string for UUID consistency
  tenantId: string;
  companyId: string;
  type: string;
  field: string;
  date: string;
  status: "Completed" | "In Progress";
  laborHours: number;
  machine?: {
      id: string;
      name: string;
  };
  personnel?: {
    id: string;
    name: string;
  }[];
  fuelConsumed?: number; // in liters
  yieldAmount?: number; // in tons
  revenue?: number; // in EUR
  materials?: OperationMaterial[];
};

// Input type for adding a new operation
export interface AddOperationInput {
  type: string;
  fields: string[];
  date: string;
  status: "Completed" | "In Progress";
  laborHours: number;
  machineId: string;
  personnelIds?: string[];
  yieldAmount?: number;
  revenue?: number;
  materials?: OperationMaterialInput[];
}

// Input type for updating an existing operation
export interface UpdateOperationInput {
  type: string;
  date: string;
  status: "Completed" | "In Progress";
  laborHours: number;
  machineId: string;
  personnelIds?: string[];
  yieldAmount?: number;
  revenue?: number;
  materials?: OperationMaterialInput[];
}


// Represents a Maintenance Event for a machine.
export interface MaintenanceEvent {
  id: string; // UUID
  tenantId: string;
  companyId: string;
  machineId: string;
  date: string; // ISO-8601 date string
  description: string;
  cost: number;
  createdAt: string; // ISO-8601 date string
}

// Input type for adding a new maintenance event
export interface AddMaintenanceEventInput {
  machineId: string;
  date: string;
  description: string;
  cost: number;
}

// Represents a Repair Event for a machine.
export interface RepairEvent {
  id: string; // UUID
  tenantId: string;
  companyId: string;
  machineId: string;
  date: string; // ISO-8601 date string
  description: string;
  cost: number;
  downtimeHours: number; // Downtime in hours
  createdAt: string; // ISO-8601 date string
}

// Input type for adding a new repair event
export interface AddRepairEventInput {
  machineId: string;
  date: string;
  description: string;
  cost: number;
  downtimeHours: number;
}

// Represents the Machinery entity in the database.
export interface Machinery {
  id: string; // Should be a UUID
  tenantId: string;
  companyId: string;
  name: string;
  type: string;
  model: string;
  status: "Operational" | "Maintenance Due" | "In Workshop";
  lastMaintenance: string;
  standardFuelConsumption: number; // in liters per hour
  
  // New fields for hour-based maintenance planning
  totalOperatingHours: number;
  maintenanceIntervalHours?: number; // The interval in hours when maintenance is due
  lastMaintenanceHours: number; // The value of totalOperatingHours at the last maintenance

  createdAt: string; // ISO-8601 date string
  updatedAt: string; // ISO-8601 date string
};

// Input type for updating an existing machine.
export interface UpdateMachineInput {
  name: string;
  type: string;
  model: string;
  standardFuelConsumption: number;
  maintenanceIntervalHours?: number;
}


// Represents a Field entity in the database.
export interface Field {
  id: string; // UUID
  tenantId: string;
  companyId: string;
  name: string;
  area: number; // in hectares
  crop: string;
  geometry?: number[][]; // Array of [lat, lng] points for a polygon
};

// Represents economic data for a specific entity (like a field).
export interface FieldEconomics {
  revenue: number;
  costs: number;
  contributionMargin: number;
}

export type ObservationType = 'Routine' | 'Pest' | 'NutrientDeficiency' | 'Damage' | 'Other';

// Represents a field observation or damage report.
export interface Observation {
  id: string; // UUID
  tenantId: string;
  companyId: string;
  field: string;
  date: string; // ISO-8601 date string
  title: string;
  description: string;
  photoUrl?: string; // Optional URL to an uploaded photo
  latitude?: number;
  longitude?: number;
  observationType: ObservationType;
  bbchStage: number;
  intensity: number; // 1-5
}

// Input type for adding a new observation.
export interface AddObservationInput {
  field: string;
  date: string; // ISO-8601 date string
  title: string;
  description: string;
  photoUrl?: string;
  latitude?: number;
  longitude?: number;
  observationType: ObservationType;
  bbchStage: number;
  intensity: number; // 1-5
}


export type Role = "Tenant Admin" | "Firmen Admin" | "Betriebsleitung" | "Mitarbeiter" | "Werkstatt" | "Leser";

export interface Company {
  id: string;
  name: string;
  tenantId: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  tenantId: string;
  // A user can have different roles for different companies
  companyRoles: { companyId: string, role: Role }[];
}

export interface AddUserInput {
  name: string;
  email: string;
  role: Role;
}

export interface Session {
  user: User;
  companies: Company[];
}

export interface AuditLogEvent {
  id: string;
  tenantId: string;
  companyId: string;
  date: string; // ISO-8601 date string
  user: {
    id: string;
    name: string;
  };
  action: string; // e.g., 'machine.create', 'maintenance.log'
  details: string; // e.g., 'Created machine "Fendt 942 Vario"'
}

// Represents data for the labor hours by crop report.
export interface LaborHoursByCropReportData {
  crop: string;
  hours: number;
}

// Represents data for the profitability by crop report.
export interface ProfitabilityByCropReportData {
  crop: string;
  revenue: number;
  laborCost: number;
  fuelCost: number;
  contributionMargin: number;
}

export type WarehouseItemType = 'Seed' | 'Fertilizer' | 'Pesticide' | 'Other';

export interface WarehouseItem {
  id: string;
  tenantId: string;
  companyId: string;
  name: string;
  itemType: WarehouseItemType;
  quantity: number;
  unit: string; // e.g., 'kg', 'l', 'Sack'
  costPerUnit: number;
  n?: number; // Nitrogen in %
  p?: number; // Phosphorus in %
  k?: number; // Potassium in %
  registrationNumber?: string; // Zulassungsnummer
  waitingPeriodDays?: number; // Wartezeit in Tagen
  createdAt: string;
  updatedAt: string;
}

export interface AddWarehouseItemInput {
  name: string;
  itemType: WarehouseItemType;
  quantity: number;
  unit: string;
  costPerUnit: number;
  n?: number;
  p?: number;
  k?: number;
  registrationNumber?: string;
  waitingPeriodDays?: number;
}
