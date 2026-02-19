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

// Represents a summary of a recent operation, not a direct DB entity in its final form,
// but includes tenant/company for filtering.
export interface RecentActivity {
  id: string; // Using string for UUID consistency
  tenantId: string;
  companyId: string;
  type: string;
  field: string;
  date: string;
  status: "Completed" | "In Progress";
};

// Represents the Machinery entity in the database.
export interface Machinery {
  id: string; // Should be a UUID
  tenantId: string;
  companyId: string;
  name: string;
  type: string;
  model: string;
  status: "Operational" | "Maintenance Due" | "In Workshop";
  nextService: string;
  lastMaintenance: string;
  createdAt: string; // ISO-8601 date string
  updatedAt: string; // ISO-8601 date string
};
