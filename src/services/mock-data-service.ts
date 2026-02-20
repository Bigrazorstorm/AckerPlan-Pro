import { DataService } from './data-service';
import { Kpi, ChartDataPoint, Operation, Machinery, Session, Field, MaintenanceEvent, AddMaintenanceEventInput, AuditLogEvent, RepairEvent, AddRepairEventInput } from './types';

const session: Session = {
  user: {
    id: 'user-1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    tenantId: 'tenant-123',
    companyRoles: [
      { companyId: 'company-456', role: 'Firmen Admin' },
      { companyId: 'company-789', role: 'Mitarbeiter' },
    ]
  },
  companies: [
    { id: 'company-456', name: 'Ackerbau & Co. KG', tenantId: 'tenant-123' },
    { id: 'company-789', name: 'Grünland GmbH', tenantId: 'tenant-123' },
  ]
};

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

const kpisCompany789: Kpi[] = [
  {
    labelKey: "TotalRevenue",
    value: "€12,850.42",
    change: "+5.2%",
    changeType: "increase",
  },
  {
    labelKey: "TotalCosts",
    value: "€9,200.00",
    change: "+8.1%",
    changeType: "increase",
  },
  {
    labelKey: "OpenObservations",
    value: "4",
    change: "-1",
    changeType: "decrease",
  },
  {
    labelKey: "MaintenanceDue",
    value: "1",
    change: "0 overdue",
    changeType: "increase",
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

const chartDataCompany789: ChartDataPoint[] = [
    { month: "January", revenue: 500, cost: 300 },
    { month: "February", revenue: 800, cost: 400 },
    { month: "March", revenue: 1200, cost: 600 },
    { month: "April", revenue: 900, cost: 500 },
    { month: "May", revenue: 1500, cost: 800 },
    { month: "June", revenue: 1800, cost: 1000 },
    { month: "July", revenue: 2500, cost: 1200 },
    { month: "August", revenue: 3200, cost: 1500 },
    { month: "September", revenue: 2800, cost: 1300 },
    { month: "October", revenue: 1000, cost: 600 },
    { month: "November", revenue: 700, cost: 400 },
    { month: "December", revenue: 300, cost: 100 },
];

const operations: Operation[] = [
  { id: '1', tenantId: 'tenant-123', companyId: 'company-456', type: "Harvesting", field: "Field A-12", date: "2 days ago", status: "Completed" },
  { id: '2', tenantId: 'tenant-123', companyId: 'company-456', type: "Fertilizing", field: "Field C-04", date: "3 days ago", status: "Completed" },
  { id: '3', tenantId: 'tenant-123', companyId: 'company-456', type: "PestControl", field: "Field B-08", date: "4 days ago", status: "Completed" },
  { id: '4', tenantId: 'tenant-123', companyId: 'company-456', type: "Seeding", field: "Field D-01", date: "1 week ago", status: "In Progress" },
  { id: '5', tenantId: 'tenant-123', companyId: 'company-456', type: "Tillage", field: "Field F-21", date: "2 weeks ago", status: "Completed" },
  // Data for another company to test multi-tenancy
  { id: '6', tenantId: 'tenant-123', companyId: 'company-789', type: "Mowing", field: "Miller's Acre", date: "5 days ago", status: "Completed" },
  { id: '7', tenantId: 'tenant-123', companyId: 'company-789', type: "Baling", field: "South Pasture", date: "1 week ago", status: "Completed" },
];

const machinery: Machinery[] = [
  { id: 'M001', tenantId: 'tenant-123', companyId: 'company-456', name: "John Deere 8R 370", type: "Tractor", model: "8R 370", status: "Operational", nextService: "In 250h", lastMaintenance: "2024-05-10", createdAt: "2023-01-15T10:00:00Z", updatedAt: "2024-05-10T14:30:00Z" },
  { id: 'M002', tenantId: 'tenant-123', companyId: 'company-456', name: "Claas Lexion 8900", type: "CombineHarvester", model: "Lexion 8900", status: "Maintenance Due", nextService: "Now (3000h)", lastMaintenance: "2023-09-15", createdAt: "2022-08-20T11:00:00Z", updatedAt: "2023-09-15T09:00:00Z" },
  { id: 'M003', tenantId: 'tenant-123', companyId: 'company-456', name: "Fendt 942 Vario", type: "Tractor", model: "942 Vario", status: "Operational", nextService: "In 450h", lastMaintenance: "2024-03-22", createdAt: "2023-05-10T12:00:00Z", updatedAt: "2024-03-22T16:00:00Z" },
  { id: 'M004', tenantId: 'tenant-123', companyId: 'company-456', name: "Amazone Catros XL", type: "Tillage", model: "Catros 6003-2TXL", status: "Operational", nextService: "2025-01-10", lastMaintenance: "2024-01-10", createdAt: "2023-02-01T08:30:00Z", updatedAt: "2024-01-10T09:45:00Z" },
  { id: 'M005', tenantId: 'tenant-123', companyId: 'company-456', name: "Horsch Maestro 12.50 SW", type: "Seeding", model: "Maestro 12.50 SW", status: "In Workshop", nextService: "After Repair", lastMaintenance: "2024-04-01", createdAt: "2023-03-18T13:20:00Z", updatedAt: "2024-04-01T11:00:00Z" },
  { id: 'M006', tenantId: 'tenant-123', companyId: 'company-456', name: "Krone Big Pack 1290", type: "Baler", model: "Big Pack 1290", status: "Operational", nextService: "In 120h", lastMaintenance: "2024-06-01", createdAt: "2023-07-25T18:00:00Z", updatedAt: "2024-06-01T10:00:00Z" },
  // Data for another company to test multi-tenancy
  { id: 'M007', tenantId: 'tenant-123', companyId: 'company-789', name: "Case IH Magnum 380", type: "Tractor", model: "Magnum 380", status: "Operational", nextService: "In 300h", lastMaintenance: "2024-06-15", createdAt: "2023-08-01T09:00:00Z", updatedAt: "2024-06-15T14:00:00Z" },
  { id: 'M008', tenantId: 'tenant-123', companyId: 'company-789', name: "New Holland CR9.90", type: "CombineHarvester", model: "CR9.90", status: "Operational", nextService: "In 150h", lastMaintenance: "2024-07-01", createdAt: "2023-09-01T09:00:00Z", updatedAt: "2024-07-01T14:00:00Z" },
];

const fields: Field[] = [
  { id: 'field-1', tenantId: 'tenant-123', companyId: 'company-456', name: 'Acker-Nord 1', area: 15.2, crop: 'Winterweizen' },
  { id: 'field-2', tenantId: 'tenant-123', companyId: 'company-456', name: 'Südhang', area: 8.5, crop: 'Zuckerrüben' },
  { id: 'field-3', tenantId: 'tenant-123', companyId: 'company-456', name: 'Große Wiese', area: 22.0, crop: 'Gerste' },
  { id: 'field-4', tenantId: 'tenant-123', companyId: 'company-456', name: 'An der B2', area: 5.7, crop: 'Raps' },
  // Fields for company-789
  { id: 'field-5', tenantId: 'tenant-123', companyId: 'company-789', name: 'Grünland-West', area: 12.0, crop: 'Weidegras' },
  { id: 'field-6', tenantId: 'tenant-123', companyId: 'company-789', name: 'Weide am Bach', area: 7.8, crop: 'Klee-Gras-Mischung' },
];

const maintenanceEvents: MaintenanceEvent[] = [
  { id: 'ME001', tenantId: 'tenant-123', companyId: 'company-456', machineId: 'M001', date: '2024-05-10', description: 'Regulärer 500h Service', cost: 450, createdAt: '2024-05-10T14:30:00Z' },
  { id: 'ME002', tenantId: 'tenant-123', companyId: 'company-456', machineId: 'M001', date: '2023-11-20', description: 'Ölwechsel und Filter', cost: 280, createdAt: '2023-11-20T10:00:00Z' },
  { id: 'ME003', tenantId: 'tenant-123', companyId: 'company-456', machineId: 'M002', date: '2023-09-15', description: 'Großer 3000h Service, Austausch Verschleißteile', cost: 2800, createdAt: '2023-09-15T09:00:00Z' },
  { id: 'ME004', tenantId: 'tenant-123', companyId: 'company-456', machineId: 'M003', date: '2024-03-22', description: 'Software-Update und Hydraulik-Check', cost: 150, createdAt: '2024-03-22T16:00:00Z' },
  { id: 'ME005', tenantId: 'tenant-123', companyId: 'company-456', machineId: 'M004', date: '2024-01-10', description: 'Jährliche Inspektion', cost: 200, createdAt: '2024-01-10T09:45:00Z' },
  { id: 'ME006', tenantId: 'tenant-123', companyId: 'company-789', machineId: 'M007', date: '2024-06-15', description: '1000h Service', cost: 850, createdAt: '2024-06-15T14:00:00Z' },
];

const repairEvents: RepairEvent[] = [
    { id: 'RE001', tenantId: 'tenant-123', companyId: 'company-456', machineId: 'M005', date: '2024-04-01', description: 'Getriebeschaden nach Überlastung', cost: 4500, downtimeHours: 120, createdAt: '2024-04-01T11:00:00Z' },
    { id: 'RE002', tenantId: 'tenant-123', companyId: 'company-456', machineId: 'M002', date: '2023-08-20', description: 'Hydraulikschlauch geplatzt', cost: 350, downtimeHours: 8, createdAt: '2023-08-20T15:00:00Z' },
];

const auditLogEvents: AuditLogEvent[] = [
    { id: 'log-1', tenantId: 'tenant-123', companyId: 'company-456', date: '2024-07-22T10:05:00Z', user: { id: 'user-1', name: 'John Doe' }, action: 'machine.create', details: 'Maschine "Krone Big Pack 1290" wurde erstellt.' },
    { id: 'log-2', tenantId: 'tenant-123', companyId: 'company-456', date: '2024-07-22T09:30:00Z', user: { id: 'user-1', name: 'John Doe' }, action: 'maintenance.log', details: 'Wartung für "John Deere 8R 370" protokolliert: Regulärer 500h Service (Kosten: €450,00).' },
    { id: 'log-3', tenantId: 'tenant-123', companyId: 'company-456', date: '2024-07-21T14:00:00Z', user: { id: 'user-2', name: 'Max Mustermann' }, action: 'operation.create', details: 'Maßnahme "Ernte" auf Fläche "Acker-Nord 1" erstellt.' },
    { id: 'log-4', tenantId: 'tenant-123', companyId: 'company-456', date: '2024-07-21T11:20:00Z', user: { id: 'user-1', name: 'John Doe' }, action: 'machine.update.status', details: 'Status von "Horsch Maestro 12.50 SW" auf "In Werkstatt" geändert.' },
    { id: 'log-5', tenantId: 'tenant-123', companyId: 'company-789', date: '2024-07-22T08:00:00Z', user: { id: 'user-1', name: 'John Doe' }, action: 'operation.create', details: 'Maßnahme "Mähen" auf Fläche "Miller\'s Acre" erstellt.' },
];

function logAuditEvent(tenantId: string, companyId: string, action: string, details: string) {
    const newLog: AuditLogEvent = {
        id: `log-${auditLogEvents.length + 1}`,
        tenantId,
        companyId,
        date: new Date().toISOString(),
        user: { id: 'user-1', name: 'John Doe' }, // Hardcoded for mock service
        action,
        details,
    };
    auditLogEvents.unshift(newLog); // Add to the beginning to show newest first
}

export class MockDataService implements DataService {
  
  async getSession(): Promise<Session> {
    console.log(`Fetching session.`);
    return Promise.resolve(session);
  }
  
  async getKpis(tenantId: string, companyId: string): Promise<Kpi[]> {
    console.log(`Fetching KPIs for tenant ${tenantId} and company ${companyId}.`);
    if (companyId === 'company-789') {
      return Promise.resolve(kpisCompany789);
    }
    return Promise.resolve(kpis);
  }
  
  async getChartData(tenantId: string, companyId: string): Promise<ChartDataPoint[]> {
    console.log(`Fetching ChartData for tenant ${tenantId} and company ${companyId}.`);
    if (companyId === 'company-789') {
      return Promise.resolve(chartDataCompany789);
    }
    return Promise.resolve(chartData);
  }

  async getOperations(tenantId: string, companyId: string): Promise<Operation[]> {
    console.log(`Fetching Operations for tenant ${tenantId} and company ${companyId}.`);
    return Promise.resolve(operations.filter(a => a.tenantId === tenantId && a.companyId === companyId));
  }

  async getMachinery(tenantId: string, companyId: string): Promise<Machinery[]> {
    console.log(`Fetching Machinery for tenant ${tenantId} and company ${companyId}.`);
    return Promise.resolve(machinery.filter(m => m.tenantId === tenantId && m.companyId === companyId));
  }
  
  async getFields(tenantId: string, companyId: string): Promise<Field[]> {
    console.log(`Fetching Fields for tenant ${tenantId} and company ${companyId}.`);
    return Promise.resolve(fields.filter(f => f.tenantId === tenantId && f.companyId === companyId));
  }

  async getMachineById(tenantId: string, companyId: string, machineId: string): Promise<Machinery | null> {
    console.log(`Fetching Machine ${machineId} for tenant ${tenantId} and company ${companyId}.`);
    const machine = machinery.find(m => m.id === machineId && m.tenantId === tenantId && m.companyId === companyId);
    return Promise.resolve(machine || null);
  }

  async getMaintenanceHistory(tenantId: string, companyId: string, machineId: string): Promise<MaintenanceEvent[]> {
    console.log(`Fetching Maintenance History for machine ${machineId}.`);
    return Promise.resolve(maintenanceEvents.filter(e => e.machineId === machineId && e.tenantId === tenantId && e.companyId === companyId).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
  }
  
  async getRepairHistory(tenantId: string, companyId: string, machineId: string): Promise<RepairEvent[]> {
    console.log(`Fetching Repair History for machine ${machineId}.`);
    return Promise.resolve(repairEvents.filter(e => e.machineId === machineId && e.tenantId === tenantId && e.companyId === companyId).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
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
    logAuditEvent(tenantId, companyId, 'machine.create', `Maschine "${machineData.name}" wurde erstellt.`);
    return Promise.resolve(newMachine);
  }

  async addOperation(tenantId: string, companyId: string, operationData: { type: string; field: string; date: string; status: "Completed" | "In Progress"; }): Promise<Operation> {
    console.log(`Adding Operation for tenant ${tenantId} and company ${companyId}.`);
    const newOperation: Operation = {
      id: `OP${String(operations.length + 1).padStart(3, '0')}`,
      tenantId: tenantId,
      companyId: companyId,
      ...operationData,
    };
    operations.unshift(newOperation);
    logAuditEvent(tenantId, companyId, 'operation.create', `Maßnahme "${operationData.type}" auf Fläche "${operationData.field}" erstellt.`);
    return Promise.resolve(newOperation);
  }
  
  async addMaintenanceEvent(tenantId: string, companyId: string, eventData: AddMaintenanceEventInput): Promise<MaintenanceEvent> {
    console.log(`Adding Maintenance Event for tenant ${tenantId} and company ${companyId}.`);
    const machine = machinery.find(m => m.id === eventData.machineId);
    const newEvent: MaintenanceEvent = {
      id: `ME${String(maintenanceEvents.length + 1).padStart(3, '0')}`,
      tenantId,
      companyId,
      createdAt: new Date().toISOString(),
      ...eventData,
    };
    maintenanceEvents.unshift(newEvent);

    const costFormatted = new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(eventData.cost);
    logAuditEvent(tenantId, companyId, 'maintenance.log', `Wartung für "${machine?.name || eventData.machineId}" protokolliert: ${eventData.description} (Kosten: ${costFormatted}).`);

    return Promise.resolve(newEvent);
  }

  async addRepairEvent(tenantId: string, companyId: string, eventData: AddRepairEventInput): Promise<RepairEvent> {
    console.log(`Adding Repair Event for tenant ${tenantId} and company ${companyId}.`);
    const machine = machinery.find(m => m.id === eventData.machineId);
    const newEvent: RepairEvent = {
      id: `RE${String(repairEvents.length + 1).padStart(3, '0')}`,
      tenantId,
      companyId,
      createdAt: new Date().toISOString(),
      ...eventData,
    };
    repairEvents.unshift(newEvent);

    const costFormatted = new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(eventData.cost);
    logAuditEvent(tenantId, companyId, 'repair.log', `Reparatur für "${machine?.name || eventData.machineId}" protokolliert: ${eventData.description} (Kosten: ${costFormatted}, Ausfall: ${eventData.downtimeHours}h).`);

    return Promise.resolve(newEvent);
  }

  async getAuditLog(tenantId: string, companyId: string): Promise<AuditLogEvent[]> {
    console.log(`Fetching AuditLog for tenant ${tenantId} and company ${companyId}.`);
    return Promise.resolve(auditLogEvents.filter(e => e.tenantId === tenantId && e.companyId === companyId).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
  }
}
