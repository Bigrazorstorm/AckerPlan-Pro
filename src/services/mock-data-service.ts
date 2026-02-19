import { DataService } from './data-service';
import { Kpi, ChartDataPoint, RecentActivity, Machinery } from './types';

// This is mock data. In a real application, this would come from a database.
const kpis: Kpi[] = [
  {
    labelKey: "TotalRevenue",
    value: "€45,231.89",
    change: "+20.1%",
    changeType: "increase",
  },
  {
    labelKey: "TotalCosts",
    value: "€28,102.50",
    change: "+12.5%",
    changeType: "increase",
  },
  {
    labelKey: "OpenObservations",
    value: "12",
    change: "+2",
    changeType: "increase",
  },
  {
    labelKey: "MaintenanceDue",
    value: "3",
    change: "1 overdue",
    changeType: "decrease",
  },
];

const chartData: ChartDataPoint[] = [
    { month: "January", revenue: 1860, cost: 800 },
    { month: "February", revenue: 3050, cost: 1200 },
    { month: "March", revenue: 2370, cost: 980 },
    { month: "April", revenue: 730, cost: 300 },
    { month: "May", revenue: 2090, cost: 1100 },
    { month: "June", revenue: 2140, cost: 1300 },
    { month: "July", revenue: 8500, cost: 2500 },
    { month: "August", revenue: 12050, cost: 3400 },
    { month: "September", revenue: 9800, cost: 2900 },
    { month: "October", revenue: 2500, cost: 1100 },
    { month: "November", revenue: 1800, cost: 700 },
    { month: "December", revenue: 500, cost: 200 },
];

const recentActivities: RecentActivity[] = [
  { id: '1', tenantId: 'tenant-123', companyId: 'company-456', type: "Harvesting", field: "Field A-12", date: "2 days ago", status: "Completed" },
  { id: '2', tenantId: 'tenant-123', companyId: 'company-456', type: "Fertilizing", field: "Field C-04", date: "3 days ago", status: "Completed" },
  { id: '3', tenantId: 'tenant-123', companyId: 'company-456', type: "Pest Control", field: "Field B-08", date: "4 days ago", status: "Completed" },
  { id: '4', tenantId: 'tenant-123', companyId: 'company-456', type: "Seeding", field: "Field D-01", date: "1 week ago", status: "In Progress" },
  { id: '5', tenantId: 'tenant-123', companyId: 'company-456', type: "Tillage", field: "Field F-21", date: "2 weeks ago", status: "Completed" },
  // Data for another company to test multi-tenancy
  { id: '6', tenantId: 'tenant-123', companyId: 'company-789', type: "Harvesting", field: "Miller's Acre", date: "5 days ago", status: "Completed" },
];

const machinery: Machinery[] = [
  { id: 'M001', tenantId: 'tenant-123', companyId: 'company-456', name: "John Deere 8R 370", type: "Tractor", model: "8R 370", status: "Operational", nextService: "In 250h", lastMaintenance: "2024-05-10", createdAt: "2023-01-15T10:00:00Z", updatedAt: "2024-05-10T14:30:00Z" },
  { id: 'M002', tenantId: 'tenant-123', companyId: 'company-456', name: "Claas Lexion 8900", type: "Combine Harvester", model: "Lexion 8900", status: "Maintenance Due", nextService: "Now (3000h)", lastMaintenance: "2023-09-15", createdAt: "2022-08-20T11:00:00Z", updatedAt: "2023-09-15T09:00:00Z" },
  { id: 'M003', tenantId: 'tenant-123', companyId: 'company-456', name: "Fendt 942 Vario", type: "Tractor", model: "942 Vario", status: "Operational", nextService: "In 450h", lastMaintenance: "2024-03-22", createdAt: "2023-05-10T12:00:00Z", updatedAt: "2024-03-22T16:00:00Z" },
  { id: 'M004', tenantId: 'tenant-123', companyId: 'company-456', name: "Amazone Catros XL", type: "Tillage", model: "Catros 6003-2TXL", status: "Operational", nextService: "2025-01-10", lastMaintenance: "2024-01-10", createdAt: "2023-02-01T08:30:00Z", updatedAt: "2024-01-10T09:45:00Z" },
  { id: 'M005', tenantId: 'tenant-123', companyId: 'company-456', name: "Horsch Maestro 12.50 SW", type: "Seeding", model: "Maestro 12.50 SW", status: "In Workshop", nextService: "After Repair", lastMaintenance: "2024-04-01", createdAt: "2023-03-18T13:20:00Z", updatedAt: "2024-04-01T11:00:00Z" },
  { id: 'M006', tenantId: 'tenant-123', companyId: 'company-456', name: "Krone Big Pack 1290", type: "Baler", model: "Big Pack 1290", status: "Operational", nextService: "In 120h", lastMaintenance: "2024-06-01", createdAt: "2023-07-25T18:00:00Z", updatedAt: "2024-06-01T10:00:00Z" },
  // Data for another company to test multi-tenancy
  { id: 'M007', tenantId: 'tenant-123', companyId: 'company-789', name: "Case IH Magnum 380", type: "Tractor", model: "Magnum 380", status: "Operational", nextService: "In 300h", lastMaintenance: "2024-06-15", createdAt: "2023-08-01T09:00:00Z", updatedAt: "2024-06-15T14:00:00Z" },
];


export class MockDataService implements DataService {
  
  async getKpis(tenantId: string, companyId: string): Promise<Kpi[]> {
    // Mock KPIs are the same for all companies in this mock service.
    // A real implementation would calculate these based on the provided IDs.
    console.log(`Fetching KPIs for tenant ${tenantId} and company ${companyId}.`);
    return Promise.resolve(kpis);
  }
  
  async getChartData(tenantId: string, companyId: string): Promise<ChartDataPoint[]> {
    // Mock Chart data is the same for all companies in this mock service.
    console.log(`Fetching ChartData for tenant ${tenantId} and company ${companyId}.`);
    return Promise.resolve(chartData);
  }

  async getRecentActivities(tenantId: string, companyId: string): Promise<RecentActivity[]> {
    console.log(`Fetching RecentActivities for tenant ${tenantId} and company ${companyId}.`);
    return Promise.resolve(recentActivities.filter(a => a.tenantId === tenantId && a.companyId === companyId));
  }

  async getMachinery(tenantId: string, companyId: string): Promise<Machinery[]> {
    console.log(`Fetching Machinery for tenant ${tenantId} and company ${companyId}.`);
    return Promise.resolve(machinery.filter(m => m.tenantId === tenantId && m.companyId === companyId));
  }

  async addMachinery(tenantId: string, companyId: string, machineData: { name: string; type: string; model: string; }): Promise<Machinery> {
    console.log(`Adding Machinery for tenant ${tenantId} and company ${companyId}.`);
    const newMachine: Machinery = {
      id: `M${String(machinery.length + 1).padStart(3, '0')}`,
      tenantId: tenantId,
      companyId: companyId,
      status: 'Operational',
      nextService: 'In 500h', // Default value
      lastMaintenance: new Date().toISOString().split('T')[0], // Today's date
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...machineData,
    };
    machinery.push(newMachine);
    return Promise.resolve(newMachine);
  }
}
