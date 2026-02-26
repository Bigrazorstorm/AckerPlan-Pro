

import { DataService } from './data-service';
import { Kpi, ChartDataPoint, Operation, Machinery, Session, Field, MaintenanceEvent, AddMaintenanceEventInput, AuditLogEvent, RepairEvent, AddRepairEventInput, AddOperationInput, LaborHoursByCropReportData, Observation, AddObservationInput, ProfitabilityByCropReportData, UpdateMachineInput, FieldEconomics, User, AddUserInput, Role, UpdateOperationInput, ObservationType, WarehouseItem, AddWarehouseItemInput, UpdateObservationInput, UpdateWarehouseItemInput, UpdateUserData, ProfitabilityByFieldReportData, OperationMaterial, Company } from './types';
import { CadastralParcel, FieldBlock, CadastralParcelFormData, FieldBlockFormData } from './field-types';

let users: User[] = [
    {
        id: 'user-1',
        name: 'John Doe',
        email: 'john.doe@example.com',
        tenantId: 'tenant-123',
        companyRoles: [
            { companyId: 'company-456', role: 'Firmen Admin' },
            { companyId: 'company-789', role: 'Mitarbeiter' },
        ],
        pesticideLicenseNumber: 'TH-12345-AB',
        pesticideLicenseExpiry: '2028-12-31',
    },
    {
        id: 'user-2',
        name: 'Max Mustermann',
        email: 'max.mustermann@example.com',
        tenantId: 'tenant-123',
        companyRoles: [
            { companyId: 'company-456', role: 'Betriebsleitung' },
        ],
        pesticideLicenseNumber: 'TH-54321-CD',
        pesticideLicenseExpiry: new Date(new Date().setMonth(new Date().getMonth() + 3)).toISOString().split('T')[0], // Expires in 3 months
    },
    {
        id: 'user-3',
        name: 'Erika Mustermann',
        email: 'erika.mustermann@example.com',
        tenantId: 'tenant-123',
        companyRoles: [
            { companyId: 'company-456', role: 'Mitarbeiter' },
            { companyId: 'company-789', role: 'Mitarbeiter' },
        ],
        pesticideLicenseNumber: 'TH-67890-EF',
        pesticideLicenseExpiry: '2024-01-01', // Expired
    },
    {
        id: 'user-4',
        name: 'Klaus Kleber',
        email: 'klaus.kleber@example.com',
        tenantId: 'tenant-123',
        companyRoles: [
            { companyId: 'company-456', role: 'Werkstatt' },
        ]
    },
    {
        id: 'user-5',
        name: 'Anna Schmidt',
        email: 'anna.schmidt@example.com',
        tenantId: 'tenant-other', // Different tenant
        companyRoles: [
            { companyId: 'company-abc', role: 'Firmen Admin' },
        ]
    },
    {
        id: 'user-6',
        name: 'Gerd Wildmann',
        email: 'gerd.wildmann@example.com',
        tenantId: 'tenant-123',
        companyRoles: [
            { companyId: 'company-456', role: 'Jäger' },
        ],
        pesticideLicenseNumber: undefined,
        pesticideLicenseExpiry: undefined,
    },
];

const allCompanies: Company[] = [
    { id: 'company-456', name: 'Ackerbau & Co. KG', tenantId: 'tenant-123' },
    { id: 'company-789', name: 'Grünland GmbH', tenantId: 'tenant-123' },
    { id: 'company-abc', name: 'Other Farm Inc.', tenantId: 'tenant-other' },
];

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

let machinery: Machinery[] = [
  { id: 'M001', tenantId: 'tenant-123', companyId: 'company-456', name: "John Deere 8R 370", type: "Tractor", model: "8R 370", status: "Operational", lastMaintenance: "2024-05-10", standardFuelConsumption: 35.5, totalOperatingHours: 1250, maintenanceIntervalHours: 500, lastMaintenanceHours: 1010, createdAt: "2023-01-15T10:00:00Z", updatedAt: "2024-05-10T14:30:00Z" },
  { id: 'M002', tenantId: 'tenant-123', companyId: 'company-456', name: "Claas Lexion 8900", type: "CombineHarvester", model: "Lexion 8900", status: "Maintenance Due", lastMaintenance: "2023-09-15", standardFuelConsumption: 85.0, totalOperatingHours: 3005, maintenanceIntervalHours: 1000, lastMaintenanceHours: 2000, createdAt: "2022-08-20T11:00:00Z", updatedAt: "2023-09-15T09:00:00Z" },
  { id: 'M003', tenantId: 'tenant-123', companyId: 'company-456', name: "Fendt 942 Vario", type: "Tractor", model: "942 Vario", status: "Operational", lastMaintenance: "2024-03-22", standardFuelConsumption: 42.0, totalOperatingHours: 550, maintenanceIntervalHours: 500, lastMaintenanceHours: 500, createdAt: "2023-05-10T12:00:00Z", updatedAt: "2024-03-22T16:00:00Z" },
  { id: 'M004', tenantId: 'tenant-123', companyId: 'company-456', name: "Amazone Catros XL", type: "Tillage", model: "Catros 6003-2TXL", status: "Operational", lastMaintenance: "2024-01-10", standardFuelConsumption: 15.0, totalOperatingHours: 320, lastMaintenanceHours: 280, createdAt: "2023-02-01T08:30:00Z", updatedAt: "2024-01-10T09:45:00Z" }, // No interval set
  { id: 'M005', tenantId: 'tenant-123', companyId: 'company-456', name: "Horsch Maestro 12.50 SW", type: "Seeding", model: "Maestro 12.50 SW", status: "In Workshop", lastMaintenance: "2024-04-01", standardFuelConsumption: 12.0, totalOperatingHours: 890, maintenanceIntervalHours: 400, lastMaintenanceHours: 800, createdAt: "2023-03-18T13:20:00Z", updatedAt: "2024-04-01T11:00:00Z" },
  { id: 'M006', tenantId: 'tenant-123', companyId: 'company-456', name: "Krone Big Pack 1290", type: "Baler", model: "Big Pack 1290", status: "Operational", lastMaintenance: "2024-06-01", standardFuelConsumption: 25.0, totalOperatingHours: 180, maintenanceIntervalHours: 300, lastMaintenanceHours: 0, createdAt: "2023-07-25T18:00:00Z", updatedAt: "2024-06-01T10:00:00Z" },
  { id: 'M007', tenantId: 'tenant-123', companyId: 'company-789', name: "Case IH Magnum 380", type: "Tractor", model: "Magnum 380", status: "Operational", lastMaintenance: "2024-06-15", standardFuelConsumption: 38.0, totalOperatingHours: 1200, maintenanceIntervalHours: 500, lastMaintenanceHours: 1000, createdAt: "2023-08-01T09:00:00Z", updatedAt: "2024-06-15T14:00:00Z" },
  { id: 'M008', tenantId: 'tenant-123', companyId: 'company-789', name: "New Holland CR9.90", type: "CombineHarvester", model: "CR9.90", status: "Operational", lastMaintenance: "2024-07-01", standardFuelConsumption: 75.0, totalOperatingHours: 850, maintenanceIntervalHours: 1000, lastMaintenanceHours: 0, createdAt: "2023-09-01T09:00:00Z", updatedAt: "2024-07-01T14:00:00Z" },
];

let operations: Operation[] = [
  { id: '1', tenantId: 'tenant-123', companyId: 'company-456', type: "Harvesting", field: "Große Wiese", date: "2024-07-22T10:00:00Z", status: "Completed", laborHours: 8.5, machine: { id: 'M002', name: 'Claas Lexion 8900' }, personnel: [{ id: 'user-3', name: 'Erika Mustermann' }], fuelConsumed: 722.5, yieldAmount: 176, revenue: 38720 },
  { id: '2', tenantId: 'tenant-123', companyId: 'company-456', type: "Fertilizing", field: "Südhang", date: "2024-07-21T10:00:00Z", status: "Completed", laborHours: 4, machine: { id: 'M003', name: 'Fendt 942 Vario' }, personnel: [{ id: 'user-2', name: 'Max Mustermann' }], fuelConsumed: 168.0, materials: [{ itemId: 'item-2', itemName: 'Kalkammonsalpeter (KAS)', quantity: 450, unit: 'kg' }] },
  { id: '3', tenantId: 'tenant-123', companyId: 'company-456', type: "PestControl", field: "Acker-Nord 1", date: "2024-07-20T10:00:00Z", status: "Completed", laborHours: 5.5, machine: { id: 'M001', name: 'John Deere 8R 370' }, personnel: [{ id: 'user-2', name: 'Max Mustermann' }, { id: 'user-3', name: 'Erika Mustermann' }], fuelConsumed: 195.2 },
  { id: '4', tenantId: 'tenant-123', companyId: 'company-456', type: "Seeding", field: "An der B2", date: "2024-07-17T10:00:00Z", status: "In Progress", laborHours: 12, machine: { id: 'M005', name: 'Horsch Maestro 12.50 SW' }, personnel: [{ id: 'user-3', name: 'Erika Mustermann' }], fuelConsumed: 144.0 },
  { id: '5', tenantId: 'tenant-123', companyId: 'company-456', type: "Tillage", field: "Acker-Nord 1", date: "2024-07-10T10:00:00Z", status: "Completed", laborHours: 6, machine: { id: 'M004', name: 'Amazone Catros XL' }, fuelConsumed: 90.0 },
  // Data for another company to test multi-tenancy
  { id: '6', tenantId: 'tenant-123', companyId: 'company-789', type: "Mowing", field: "Weide am Bach", date: "2024-07-19T10:00:00Z", status: "Completed", laborHours: 7, machine: { id: 'M007', name: 'Case IH Magnum 380' }, personnel: [{ id: 'user-3', name: 'Erika Mustermann' }], fuelConsumed: 266.0 },
  { id: '7', tenantId: 'tenant-123', companyId: 'company-789', type: "Baling", field: "Grünland-West", date: "2024-07-17T11:00:00Z", status: "Completed", laborHours: 9 }, // No machine assigned yet
];


const cadastralParcels: CadastralParcel[] = [
  { 
    id: 'parcel-1', tenantId: 'tenant-123', companyId: 'company-456', 
    name: 'Flurstück 123/45', county: 'Landkreis Thüringen', municipality: 'Erfurt', district: 'Erfurt',
    parcelNumber: '123/45', area: 8.5, owner: 'Max Mustermann', leasingStatus: 'owned',
    polygonGeoJSON: '{"type":"Polygon","coordinates":[[[13.35,52.51],[13.35,52.52],[13.37,52.52],[13.37,52.51],[13.35,52.51]]]}',
    createdAt: new Date(), updatedAt: new Date()
  },
  { 
    id: 'parcel-2', tenantId: 'tenant-123', companyId: 'company-456', 
    name: 'Flurstück 123/46', county: 'Landkreis Thüringen', municipality: 'Erfurt', district: 'Erfurt',
    parcelNumber: '123/46', area: 6.7, owner: 'Max Mustermann', leasingStatus: 'owned',
    polygonGeoJSON: '{"type":"Polygon","coordinates":[[[13.37,52.51],[13.37,52.52],[13.39,52.52],[13.39,52.51],[13.37,52.51]]]}',
    createdAt: new Date(), updatedAt: new Date()
  },
  { 
    id: 'parcel-3', tenantId: 'tenant-123', companyId: 'company-456', 
    name: 'Flurstück 124/1', county: 'Landkreis Thüringen', municipality: 'Erfurt', district: 'Erfurt',
    parcelNumber: '124/1', area: 22.0, owner: 'Agrargenossenschaft eG', leasingStatus: 'leased',
    polygonGeoJSON: '{"type":"Polygon","coordinates":[[[13.35,52.48],[13.35,52.50],[13.37,52.50],[13.37,52.48],[13.35,52.48]]]}',
    createdAt: new Date(), updatedAt: new Date()
  },
  { 
    id: 'parcel-4', tenantId: 'tenant-123', companyId: 'company-456', 
    name: 'Flurstück 150/12', county: 'Landkreis Thüringen', municipality: 'Erfurt', district: 'Erfurt',
    parcelNumber: '150/12', area: 5.7, owner: 'Max Mustermann', leasingStatus: 'owned',
    polygonGeoJSON: '{"type":"Polygon","coordinates":[[[13.32,52.49],[13.32,52.50],[13.34,52.50],[13.34,52.49],[13.32,52.49]]]}',
    createdAt: new Date(), updatedAt: new Date()
  },
];

const fieldBlocks: FieldBlock[] = [
  {
    id: 'block-1', tenantId: 'tenant-123', companyId: 'company-456',
    name: 'Feldblock A', referenceNumber: 'DE-123456-001', dgkLwNumber: 'DE-THR-001',
    totalArea: 37.9, fieldIds: ['field-1', 'field-2', 'field-4'], cadastralParcelIds: ['parcel-1', 'parcel-2', 'parcel-4'],
    subsidyEligible: true, subsidyAmount: 1900, gapCompliant: true, environmentalZone: false,
    restrictions: ['3% Brachenbrache'], createdAt: new Date(), updatedAt: new Date()
  },
  {
    id: 'block-2', tenantId: 'tenant-123', companyId: 'company-456',
    name: 'Feldblock B', referenceNumber: 'DE-123456-002', dgkLwNumber: 'DE-THR-002',
    totalArea: 22.0, fieldIds: ['field-3'], cadastralParcelIds: ['parcel-3'],
    subsidyEligible: true, subsidyAmount: 1100, gapCompliant: true, environmentalZone: true,
    restrictions: ['Pufferstreifen 5m'], createdAt: new Date(), updatedAt: new Date()
  },
];

const fields: Field[] = [
  { id: 'field-1', tenantId: 'tenant-123', companyId: 'company-456', name: 'Acker-Nord 1', area: 15.2, crop: 'Winterweizen', geometry: [[52.51, 13.35], [52.52, 13.35], [52.52, 13.37], [52.51, 13.37]], cadastralParcelIds: ['parcel-1'], fieldBlockId: 'block-1' },
  { id: 'field-2', tenantId: 'tenant-123', companyId: 'company-456', name: 'Südhang', area: 8.5, crop: 'Zuckerrüben', geometry: [[52.50, 13.38], [52.51, 13.38], [52.51, 13.40], [52.50, 13.40]], cadastralParcelIds: ['parcel-2'], fieldBlockId: 'block-1' },
  { id: 'field-3', tenantId: 'tenant-123', companyId: 'company-456', name: 'Große Wiese', area: 22.0, crop: 'Gerste', geometry: [[52.48, 13.35], [52.49, 13.35], [52.49, 13.37], [52.48, 13.37]], cadastralParcelIds: ['parcel-3'], fieldBlockId: 'block-2' },
  { id: 'field-4', tenantId: 'tenant-123', companyId: 'company-456', name: 'An der B2', area: 5.7, crop: 'Raps', geometry: [[52.49, 13.32], [52.50, 13.32], [52.50, 13.34], [52.49, 13.34]], cadastralParcelIds: ['parcel-4'], fieldBlockId: 'block-1' },
  // Fields for company-789
  { id: 'field-5', tenantId: 'tenant-123', companyId: 'company-789', name: 'Grünland-West', area: 12.0, crop: 'Weidegras', geometry: [[52.46, 13.41], [52.47, 13.41], [52.47, 13.43], [52.46, 13.43]], cadastralParcelIds: [], fieldBlockId: undefined },
  { id: 'field-6', tenantId: 'tenant-123', companyId: 'company-789', name: 'Weide am Bach', area: 7.8, crop: 'Klee-Gras-Mischung', geometry: [[52.45, 13.38], [52.46, 13.38], [52.46, 13.40], [52.45, 13.40]], cadastralParcelIds: [], fieldBlockId: undefined },
];

let maintenanceEvents: MaintenanceEvent[] = [
  { id: 'ME001', tenantId: 'tenant-123', companyId: 'company-456', machineId: 'M001', date: '2024-05-10', description: 'Regulärer 500h Service', cost: 450, createdAt: '2024-05-10T14:30:00Z' },
  { id: 'ME002', tenantId: 'tenant-123', companyId: 'company-456', machineId: 'M001', date: '2023-11-20', description: 'Ölwechsel und Filter', cost: 280, createdAt: '2023-11-20T10:00:00Z' },
  { id: 'ME003', tenantId: 'tenant-123', companyId: 'company-456', machineId: 'M002', date: '2023-09-15', description: 'Großer 3000h Service, Austausch Verschleißteile', cost: 2800, createdAt: '2023-09-15T09:00:00Z' },
  { id: 'ME004', tenantId: 'tenant-123', companyId: 'company-456', machineId: 'M003', date: '2024-03-22', description: 'Software-Update und Hydraulik-Check', cost: 150, createdAt: '2024-03-22T16:00:00Z' },
  { id: 'ME005', tenantId: 'tenant-123', companyId: 'company-456', machineId: 'M004', date: '2024-01-10', description: 'Jährliche Inspektion', cost: 200, createdAt: '2024-01-10T09:45:00Z' },
  { id: 'ME006', tenantId: 'tenant-123', companyId: 'company-789', machineId: 'M007', date: '2024-06-15', description: '1000h Service', cost: 850, createdAt: '2024-06-15T14:00:00Z' },
];

let repairEvents: RepairEvent[] = [
    { id: 'RE001', tenantId: 'tenant-123', companyId: 'company-456', machineId: 'M005', date: '2024-04-01', description: 'Getriebeschaden nach Überlastung', cost: 4500, downtimeHours: 120, createdAt: '2024-04-01T11:00:00Z' },
    { id: 'RE002', tenantId: 'tenant-123', companyId: 'company-456', machineId: 'M002', date: '2023-08-20', description: 'Hydraulikschlauch geplatzt', cost: 350, downtimeHours: 8, createdAt: '2023-08-20T15:00:00Z' },
];

let auditLogEvents: AuditLogEvent[] = [
    { id: 'log-1', tenantId: 'tenant-123', companyId: 'company-456', date: '2024-07-22T10:05:00Z', user: { id: 'user-1', name: 'John Doe' }, action: 'machine.create', details: 'Maschine "Krone Big Pack 1290" wurde erstellt.' },
    { id: 'log-2', tenantId: 'tenant-123', companyId: 'company-456', date: '2024-07-22T09:30:00Z', user: { id: 'user-1', name: 'John Doe' }, action: 'maintenance.log', details: 'Wartung für "John Deere 8R 370" protokolliert: Regulärer 500h Service (Kosten: €450,00).' },
    { id: 'log-3', tenantId: 'tenant-123', companyId: 'company-456', date: '2024-07-21T14:00:00Z', user: { id: 'user-2', name: 'Max Mustermann' }, action: 'operation.create', details: 'Maßnahme "Ernte" auf Fläche "Acker-Nord 1" erstellt.' },
    { id: 'log-4', tenantId: 'tenant-123', companyId: 'company-456', date: '2024-07-21T11:20:00Z', user: { id: 'user-1', name: 'John Doe' }, action: 'machine.update.status', details: 'Status von "Horsch Maestro 12.50 SW" auf "In Werkstatt" geändert.' },
    { id: 'log-5', tenantId: 'tenant-123', companyId: 'company-789', date: '2024-07-22T08:00:00Z', user: { id: 'user-1', name: 'John Doe' }, action: 'operation.create', details: 'Maßnahme "Mähen" auf Fläche "Miller\'s Acre" erstellt.' },
];

let warehouseItems: WarehouseItem[] = [
    { id: 'item-1', tenantId: 'tenant-123', companyId: 'company-456', name: 'Winterweizen "Akteur"', itemType: 'Seed', quantity: 2500, unit: 'kg', costPerUnit: 0.85, createdAt: '2023-08-15T10:00:00Z', updatedAt: '2024-03-01T11:00:00Z' },
    { id: 'item-2', tenantId: 'tenant-123', companyId: 'company-456', name: 'Kalkammonsalpeter (KAS)', itemType: 'Fertilizer', quantity: 15000, unit: 'kg', costPerUnit: 0.42, n: 27, p: 0, k: 0, createdAt: '2023-09-01T09:00:00Z', updatedAt: '2024-04-10T14:00:00Z' },
    { id: 'item-3', tenantId: 'tenant-123', companyId: 'company-456', name: 'Herbizid "Broadway"', itemType: 'Pesticide', quantity: 50, unit: 'l', costPerUnit: 35.50, registrationNumber: '005717-00', waitingPeriodDays: 28, createdAt: '2023-10-02T13:00:00Z', updatedAt: '2024-05-15T08:30:00Z' },
    { id: 'item-4', tenantId: 'tenant-123', companyId: 'company-456', name: 'Raps "DK Exquisite"', itemType: 'Seed', quantity: 50, unit: 'Sack', costPerUnit: 180.00, createdAt: '2023-07-20T16:00:00Z', updatedAt: '2023-07-20T16:00:00Z' },
    { id: 'item-5', tenantId: 'tenant-123', companyId: 'company-789', name: 'Weidegras-Mischung "Robust"', itemType: 'Seed', quantity: 800, unit: 'kg', costPerUnit: 3.20, createdAt: '2023-03-10T11:00:00Z', updatedAt: '2024-04-05T09:00:00Z' },
];

let observations: Observation[] = [
    { id: 'obs-1', tenantId: 'tenant-123', companyId: 'company-456', field: 'Südhang', date: '2024-07-18T10:00:00Z', title: 'Verdacht auf Gelbrost', description: 'Im unteren Bereich des Schlags sind deutliche gelbe Pusteln auf den Blättern zu erkennen. Ca. 10-15% der Pflanzen betroffen.', photoUrl: 'https://picsum.photos/seed/rust/600/400', latitude: 52.505, longitude: 13.39, observationType: 'Pest', bbchStage: 39, intensity: 2 },
    { id: 'obs-2', tenantId: 'tenant-123', companyId: 'company-456', field: 'Acker-Nord 1', date: '2024-07-15T14:30:00Z', title: 'Wildschweinschaden', description: 'Am Waldrand wurden ca. 50-100qm von Wildschweinen umgebrochen. Schaden hält sich in Grenzen.', photoUrl: 'https://picsum.photos/seed/boar/600/400', observationType: 'Damage', bbchStage: 75, intensity: 1, damageCause: 'Wildlife', animal: 'Wildschwein', affectedArea: 75, damagePercentage: 5 },
    { id: 'obs-3', tenantId: 'tenant-123', companyId: 'company-789', field: 'Weide am Bach', date: '2024-07-20T08:00:00Z', title: 'Guter Klee-Anteil', description: 'Der Klee hat sich gut entwickelt, Bestand sieht sehr gut aus.', observationType: 'Routine', bbchStage: 55, intensity: 5 },
    { id: 'obs-4', tenantId: 'tenant-123', companyId: 'company-456', field: 'Südhang', date: '2024-05-10T09:00:00Z', title: 'Routinebonitur', description: 'Bestand aufgelaufen, keine Auffälligkeiten.', observationType: 'Routine', bbchStage: 12, intensity: 5 },
    { id: 'obs-5', tenantId: 'tenant-123', companyId: 'company-456', field: 'Südhang', date: '2024-06-05T11:00:00Z', title: 'Routinebonitur', description: 'Pflanzen im 6-Blatt-Stadium, leichter Trockenstress sichtbar.', observationType: 'Routine', bbchStage: 16, intensity: 4 },
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
  
  async getSession(email?: string): Promise<Session> {
    const userEmail = email || 'john.doe@example.com';
    console.log(`Fetching session for ${userEmail}.`);
    const user = users.find(u => u.email === userEmail);
    if (!user) {
        throw new Error(`User with email ${userEmail} not found`);
    }
    const userCompanies = allCompanies.filter(c => user.companyRoles.some(rc => rc.companyId === c.id));

    return Promise.resolve({
      user: user,
      companies: userCompanies
    });
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

  async getFieldById(tenantId: string, companyId: string, fieldId: string): Promise<Field | null> {
    console.log(`Fetching Field ${fieldId} for tenant ${tenantId} and company ${companyId}.`);
    const field = fields.find(f => f.id === fieldId && f.tenantId === tenantId && f.companyId === companyId);
    return Promise.resolve(field || null);
  }

  async updateField(tenantId: string, companyId: string, field: Field): Promise<Field> {
    console.log(`Updating Field ${field.id} for tenant ${tenantId} and company ${companyId}.`);
    const fieldIndex = fields.findIndex(f => f.id === field.id && f.tenantId === tenantId && f.companyId === companyId);
    if (fieldIndex === -1) {
      throw new Error("Field not found or not authorized to update.");
    }
    fields[fieldIndex] = field;
    logAuditEvent(tenantId, companyId, 'field.update', `Schlag "${field.name}" wurde aktualisiert.`);
    return Promise.resolve(field);
  }

  async getOperationsForField(tenantId: string, companyId: string, fieldName: string): Promise<Operation[]> {
    console.log(`Fetching Operations for field ${fieldName}.`);
    return Promise.resolve(operations.filter(o => o.tenantId === tenantId && o.companyId === companyId && o.field === fieldName).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
  }

  async getObservationsForField(tenantId: string, companyId: string, fieldName: string): Promise<Observation[]> {
    console.log(`Fetching Observations for field ${fieldName}.`);
    return Promise.resolve(observations.filter(o => o.tenantId === tenantId && o.companyId === companyId && o.field === fieldName).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()));
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

  async addMachinery(tenantId: string, companyId: string, machineData: { name: string; type: string; model: string; standardFuelConsumption: number; maintenanceIntervalHours?: number; }): Promise<Machinery> {
    console.log(`Adding Machinery for tenant ${tenantId} and company ${companyId}.`);
    const newMachine: Machinery = {
      id: `M${String(machinery.length + 1).padStart(3, '0')}`,
      tenantId: tenantId,
      companyId: companyId,
      status: 'Operational',
      lastMaintenance: new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      totalOperatingHours: 0,
      lastMaintenanceHours: 0,
      ...machineData,
    };
    machinery.push(newMachine);
    logAuditEvent(tenantId, companyId, 'machine.create', `Maschine "${machineData.name}" wurde erstellt.`);
    return Promise.resolve(newMachine);
  }

  async updateMachine(tenantId: string, companyId: string, machineId: string, machineData: UpdateMachineInput): Promise<Machinery> {
    console.log(`Updating machine ${machineId} for tenant ${tenantId}, company ${companyId}.`);
    const machineIndex = machinery.findIndex(m => m.id === machineId && m.tenantId === tenantId && m.companyId === companyId);
    if (machineIndex === -1) {
      throw new Error("Machine not found or not authorized to update.");
    }
    const updatedMachine = { ...machinery[machineIndex], ...machineData, updatedAt: new Date().toISOString() };
    machinery[machineIndex] = updatedMachine;
    logAuditEvent(tenantId, companyId, 'machine.update', `Maschinendetails für "${updatedMachine.name}" wurden aktualisiert.`);
    return Promise.resolve(updatedMachine);
  }

  async deleteMachine(tenantId: string, companyId: string, machineId: string): Promise<void> {
    console.log(`Deleting Machinery ${machineId} for tenant ${tenantId} and company ${companyId}.`);
    const initialLength = machinery.length;
    const machineToDelete = machinery.find(m => m.id === machineId && m.tenantId === tenantId && m.companyId === companyId);
    
    if (!machineToDelete) {
        return Promise.reject(new Error('Machine not found or not authorized to delete.'));
    }

    const isUsed = operations.some(op => op.machine?.id === machineId);
    if (isUsed) {
        return Promise.reject(new Error('Machine cannot be deleted because it is used in at least one work order.'));
    }

    machinery = machinery.filter(m => m.id !== machineId || m.tenantId !== tenantId || m.companyId !== companyId);
    
    if (machinery.length < initialLength) {
        logAuditEvent(tenantId, companyId, 'machine.delete', `Maschine "${machineToDelete.name}" wurde gelöscht.`);
        return Promise.resolve();
    }
  }

  async addOperation(tenantId: string, companyId: string, operationData: AddOperationInput): Promise<Operation[]> {
    console.log(`Adding Operation for tenant ${tenantId} and company ${companyId}.`);
    const machine = machinery.find(m => m.id === operationData.machineId && m.tenantId === tenantId && m.companyId === companyId);
    if (!machine) {
        throw new Error('Machine not found');
    }

    const personnel = (operationData.personnelIds || [])
        .map(id => users.find(u => u.id === id))
        .filter((u): u is User => !!u)
        .map(u => ({ id: u.id, name: u.name }));
    
    const consumedMaterials: OperationMaterial[] = (operationData.materials || []).map(mat => {
        const item = warehouseItems.find(i => i.id === mat.itemId);
        if (!item) {
            throw new Error(`Warehouse item with id ${mat.itemId} not found.`);
        }
        // In a real app, you would decrease warehouse stock here.
        // For mock, we just record the consumption.
        return {
            itemId: item.id,
            itemName: item.name,
            quantity: mat.quantity,
            unit: item.unit
        };
    });


    const createdOps: Operation[] = [];
    const numFields = operationData.fields.length;
    if (numFields === 0) {
        return Promise.resolve([]);
    }

    // Distribute hours and consumption across fields
    const laborHoursPerField = operationData.laborHours / numFields;
    machine.totalOperatingHours += operationData.laborHours; // Add total hours to machine
    machine.updatedAt = new Date().toISOString();
    if (machine.maintenanceIntervalHours && machine.totalOperatingHours >= machine.lastMaintenanceHours + machine.maintenanceIntervalHours) {
        if (machine.status !== 'In Workshop') {
            machine.status = 'Maintenance Due';
        }
    }
    const fuelConsumedPerField = (machine.standardFuelConsumption * operationData.laborHours) / numFields;

    const materialsPerField = consumedMaterials.map(m => ({ ...m, quantity: m.quantity / numFields }));


    for (const fieldName of operationData.fields) {
        const newOperation: Operation = {
          id: `OP${String(operations.length + 1 + createdOps.length).padStart(3, '0')}`,
          tenantId: tenantId,
          companyId: companyId,
          type: operationData.type,
          field: fieldName,
          date: operationData.date,
          status: operationData.status,
          laborHours: parseFloat(laborHoursPerField.toFixed(2)),
          machine: {
              id: machine.id,
              name: machine.name
          },
          personnel: personnel,
          fuelConsumed: parseFloat(fuelConsumedPerField.toFixed(1)),
          yieldAmount: operationData.yieldAmount ? parseFloat((operationData.yieldAmount / numFields).toFixed(2)) : undefined,
          revenue: operationData.revenue ? parseFloat((operationData.revenue / numFields).toFixed(2)) : undefined,
          materials: materialsPerField,
        };
        createdOps.push(newOperation);
    }
    
    operations.unshift(...createdOps);
    const fieldsString = operationData.fields.join(', ');
    const personnelString = personnel.map(p => p.name).join(', ');
    let logDetails = `Maßnahme "${operationData.type}" auf Fläche(n) "${fieldsString}" erstellt (Gesamtarbeitszeit: ${operationData.laborHours}h).`;

    if (personnelString) {
        logDetails += ` Personal: ${personnelString}.`;
    }
    if (operationData.type === 'Harvesting' && operationData.yieldAmount) {
      logDetails += ` Gesamtertrag: ${operationData.yieldAmount}t.`
    }
    if (consumedMaterials.length > 0) {
      logDetails += ` Materialverbrauch erfasst.`
    }
    logAuditEvent(tenantId, companyId, 'operation.create', logDetails);
    return Promise.resolve(createdOps);
  }

  async updateOperation(tenantId: string, companyId: string, operationId: string, operationData: UpdateOperationInput): Promise<Operation> {
    console.log(`Updating Operation ${operationId} for tenant ${tenantId}, company ${companyId}.`);
    const opIndex = operations.findIndex(o => o.id === operationId && o.tenantId === tenantId && o.companyId === companyId);
    if (opIndex === -1) {
        throw new Error("Operation not found or not authorized to update.");
    }

    const oldOperation = operations[opIndex];
    
    // Adjust machine operating hours
    const oldMachine = machinery.find(m => m.id === oldOperation.machine?.id);
    if (oldMachine) {
        oldMachine.totalOperatingHours -= oldOperation.laborHours;
    }

    const newMachine = machinery.find(m => m.id === operationData.machineId);
    if (!newMachine) {
        throw new Error("New machine not found.");
    }
    newMachine.totalOperatingHours += operationData.laborHours;
    
    // Recalculate fuel consumption
    const fuelConsumed = newMachine.standardFuelConsumption * operationData.laborHours;
    
    const personnel = (operationData.personnelIds || [])
        .map(id => users.find(u => u.id === id))
        .filter((u): u is User => !!u)
        .map(u => ({ id: u.id, name: u.name }));
    
    const consumedMaterials: OperationMaterial[] = (operationData.materials || []).map(mat => {
        const item = warehouseItems.find(i => i.id === mat.itemId);
        if (!item) {
            throw new Error(`Warehouse item with id ${mat.itemId} not found.`);
        }
        return {
            itemId: item.id,
            itemName: item.name,
            quantity: mat.quantity,
            unit: item.unit
        };
    });

    const updatedOperation: Operation = {
        ...oldOperation,
        ...operationData,
        machine: { id: newMachine.id, name: newMachine.name },
        personnel: personnel,
        fuelConsumed: parseFloat(fuelConsumed.toFixed(1)),
        materials: consumedMaterials,
    };

    operations[opIndex] = updatedOperation;

    logAuditEvent(tenantId, companyId, 'operation.update', `Maßnahme "${updatedOperation.type}" auf Fläche "${updatedOperation.field}" wurde aktualisiert.`);
    
    return Promise.resolve(updatedOperation);
  }
  
  async deleteOperation(tenantId: string, companyId: string, operationId: string): Promise<void> {
    console.log(`Deleting Operation ${operationId} for tenant ${tenantId} and company ${companyId}.`);
    const initialLength = operations.length;
    const operationToDelete = operations.find(o => o.id === operationId && o.tenantId === tenantId && o.companyId === companyId);
    
    if (!operationToDelete) {
        return Promise.reject(new Error('Operation not found or not authorized to delete.'));
    }

    operations = operations.filter(o => o.id !== operationId);
    
    if (operations.length < initialLength) {
        logAuditEvent(tenantId, companyId, 'operation.delete', `Maßnahme "${operationToDelete.type}" auf Fläche "${operationToDelete.field}" vom ${new Date(operationToDelete.date).toLocaleDateString('de-DE')} wurde gelöscht.`);
        return Promise.resolve();
    } else {
        return Promise.reject(new Error('Deletion failed unexpectedly.'));
    }
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

    if (machine) {
        machine.lastMaintenanceHours = machine.totalOperatingHours;
        machine.lastMaintenance = eventData.date;
        if (machine.status === 'Maintenance Due') {
            machine.status = 'Operational';
        }
        machine.updatedAt = new Date().toISOString();
    }

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

  async getObservations(tenantId: string, companyId: string): Promise<Observation[]> {
    console.log(`Fetching Observations for tenant ${tenantId} and company ${companyId}.`);
    return Promise.resolve(observations.filter(o => o.tenantId === tenantId && o.companyId === companyId).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
  }

  async addObservation(tenantId: string, companyId: string, observationData: AddObservationInput): Promise<Observation> {
    console.log(`Adding Observation for tenant ${tenantId} and company ${companyId}.`);
    const newObservation: Observation = {
      id: `obs-${observations.length + 1}`,
      tenantId,
      companyId,
      ...observationData,
    };
    observations.unshift(newObservation);
    logAuditEvent(tenantId, companyId, 'observation.create', `Beobachtung "${observationData.title}" auf Fläche "${observationData.field}" erstellt.`);
    return Promise.resolve(newObservation);
  }

  async updateObservation(tenantId: string, companyId: string, observationId: string, observationData: UpdateObservationInput): Promise<Observation> {
    console.log(`Updating Observation ${observationId} for tenant ${tenantId}, company ${companyId}.`);
    const obsIndex = observations.findIndex(o => o.id === observationId && o.tenantId === tenantId && o.companyId === companyId);
    if (obsIndex === -1) {
      throw new Error("Observation not found or not authorized to update.");
    }
    const updatedObservation = { ...observations[obsIndex], ...observationData, updatedAt: new Date().toISOString() };
    observations[obsIndex] = updatedObservation as Observation;

    logAuditEvent(tenantId, companyId, 'observation.update', `Beobachtung "${updatedObservation.title}" auf Fläche "${(updatedObservation as Observation).field}" wurde aktualisiert.`);
    
    return Promise.resolve(updatedObservation as Observation);
  }

  async deleteObservation(tenantId: string, companyId: string, observationId: string): Promise<void> {
    console.log(`Deleting Observation ${observationId} for tenant ${tenantId} and company ${companyId}.`);
    const initialLength = observations.length;
    const observationToDelete = observations.find(o => o.id === observationId && o.tenantId === tenantId && o.companyId === companyId);
    
    if (!observationToDelete) {
        return Promise.reject(new Error('Observation not found or not authorized to delete.'));
    }

    observations = observations.filter(o => o.id !== observationId);
    
    if (observations.length < initialLength) {
        logAuditEvent(tenantId, companyId, 'observation.delete', `Beobachtung "${observationToDelete.title}" auf Fläche "${observationToDelete.field}" vom ${new Date(observationToDelete.date).toLocaleDateString('de-DE')} wurde gelöscht.`);
        return Promise.resolve();
    } else {
        return Promise.reject(new Error('Deletion failed unexpectedly.'));
    }
  }

  async getLaborHoursByCropReport(tenantId: string, companyId: string): Promise<LaborHoursByCropReportData[]> {
    console.log(`Fetching Labor Hours by Crop Report for tenant ${tenantId} and company ${companyId}.`);
    const companyOps = operations.filter(op => op.tenantId === tenantId && op.companyId === companyId);
    const companyFields = fields.filter(f => f.tenantId === tenantId && f.companyId === companyId);

    const hoursByCrop: { [crop: string]: number } = {};

    for (const op of companyOps) {
        const field = companyFields.find(f => f.name === op.field);
        if (field) {
            if (!hoursByCrop[field.crop]) {
                hoursByCrop[field.crop] = 0;
            }
            hoursByCrop[field.crop] += op.laborHours;
        }
    }

    const reportData: LaborHoursByCropReportData[] = Object.entries(hoursByCrop).map(([crop, hours]) => ({
        crop,
        hours: parseFloat(hours.toFixed(1)),
    }));

    return Promise.resolve(reportData);
  }
  
  async getProfitabilityByCropReport(tenantId: string, companyId: string): Promise<ProfitabilityByCropReportData[]> {
    console.log(`Fetching Profitability by Crop Report for tenant ${tenantId} and company ${companyId}.`);
    
    const DIESEL_PRICE_PER_LITER = 1.50;
    const LABOR_COST_PER_HOUR = 25.00;

    const companyOps = operations.filter(op => op.tenantId === tenantId && op.companyId === companyId);
    const companyFields = fields.filter(f => f.tenantId === tenantId && f.companyId === companyId);

    const report: { [crop: string]: { revenue: number, laborCost: number, fuelCost: number, materialCost: number } } = {};

    // Initialize report object with all crops for the company
    for (const field of companyFields) {
        if (!report[field.crop]) {
            report[field.crop] = { revenue: 0, laborCost: 0, fuelCost: 0, materialCost: 0 };
        }
    }

    for (const op of companyOps) {
        const field = companyFields.find(f => f.name === op.field);
        if (field) {
            const cropReport = report[field.crop];
            if(cropReport) { // check if crop exists in report
              cropReport.laborCost += op.laborHours * LABOR_COST_PER_HOUR;
              if (op.fuelConsumed) {
                  cropReport.fuelCost += op.fuelConsumed * DIESEL_PRICE_PER_LITER;
              }
              if (op.revenue) {
                  cropReport.revenue += op.revenue;
              }
              if (op.materials) {
                for (const material of op.materials) {
                    const item = warehouseItems.find(i => i.id === material.itemId);
                    if (item) {
                        cropReport.materialCost += material.quantity * item.costPerUnit;
                    }
                }
              }
            }
        }
    }
    
    const reportData: ProfitabilityByCropReportData[] = Object.entries(report).map(([crop, data]) => ({
        crop,
        revenue: data.revenue,
        laborCost: data.laborCost,
        fuelCost: data.fuelCost,
        materialCost: data.materialCost,
        contributionMargin: data.revenue - data.laborCost - data.fuelCost - data.materialCost,
    }));
    
    return Promise.resolve(reportData.sort((a,b) => b.contributionMargin - a.contributionMargin));
  }

  async getProfitabilityByFieldReport(tenantId: string, companyId: string): Promise<ProfitabilityByFieldReportData[]> {
    console.log(`Fetching Profitability by Field Report for tenant ${tenantId} and company ${companyId}.`);
    
    const DIESEL_PRICE_PER_LITER = 1.50;
    const LABOR_COST_PER_HOUR = 25.00;

    const companyOps = operations.filter(op => op.tenantId === tenantId && op.companyId === companyId);
    const companyFields = fields.filter(f => f.tenantId === tenantId && f.companyId === companyId);

    const reportData: ProfitabilityByFieldReportData[] = [];

    for (const field of companyFields) {
        let revenue = 0;
        let laborCost = 0;
        let fuelCost = 0;
        let materialCost = 0;

        const fieldOps = companyOps.filter(op => op.field === field.name);

        for (const op of fieldOps) {
            laborCost += op.laborHours * LABOR_COST_PER_HOUR;
            if (op.fuelConsumed) {
                fuelCost += op.fuelConsumed * DIESEL_PRICE_PER_LITER;
            }
            if (op.revenue) {
                revenue += op.revenue;
            }
            if (op.materials) {
                for (const material of op.materials) {
                    const item = warehouseItems.find(i => i.id === material.itemId);
                    if (item) {
                        materialCost += material.quantity * item.costPerUnit;
                    }
                }
            }
        }

        reportData.push({
            fieldId: field.id,
            fieldName: field.name,
            crop: field.crop,
            area: field.area,
            revenue,
            laborCost,
            fuelCost,
            materialCost,
            contributionMargin: revenue - laborCost - fuelCost - materialCost,
        });
    }
    
    return Promise.resolve(reportData.sort((a,b) => (b.contributionMargin / b.area) - (a.contributionMargin / a.area)));
  }

  async getFieldEconomics(tenantId: string, companyId: string, fieldId: string): Promise<FieldEconomics> {
    console.log(`Fetching Field Economics for field ${fieldId}.`);
    const DIESEL_PRICE_PER_LITER = 1.50;
    const LABOR_COST_PER_HOUR = 25.00;

    const field = fields.find(f => f.id === fieldId && f.tenantId === tenantId && f.companyId === companyId);
    if (!field) {
        return Promise.resolve({ revenue: 0, costs: 0, contributionMargin: 0 });
    }

    const fieldOps = operations.filter(op => op.tenantId === tenantId && op.companyId === companyId && op.field === field.name);

    let totalRevenue = 0;
    let totalCosts = 0;

    for (const op of fieldOps) {
        if (op.revenue) {
            totalRevenue += op.revenue;
        }
        totalCosts += op.laborHours * LABOR_COST_PER_HOUR;
        if (op.fuelConsumed) {
            totalCosts += op.fuelConsumed * DIESEL_PRICE_PER_LITER;
        }
        if (op.materials) {
            for (const material of op.materials) {
                const item = warehouseItems.find(i => i.id === material.itemId);
                if (item) {
                    totalCosts += material.quantity * item.costPerUnit;
                }
            }
        }
    }
    
    return Promise.resolve({
        revenue: totalRevenue,
        costs: totalCosts,
        contributionMargin: totalRevenue - totalCosts,
    });
  }

  async getAllFieldEconomics(tenantId: string, companyId: string): Promise<Record<string, FieldEconomics>> {
    console.log(`Fetching all Field Economics for company ${companyId}.`);
    const DIESEL_PRICE_PER_LITER = 1.50;
    const LABOR_COST_PER_HOUR = 25.00;
    
    const companyFields = fields.filter(f => f.tenantId === tenantId && f.companyId === companyId);
    const companyOps = operations.filter(op => op.tenantId === tenantId && op.companyId === companyId);
    
    const economicsByFieldId: Record<string, FieldEconomics> = {};

    for (const field of companyFields) {
        let totalRevenue = 0;
        let totalCosts = 0;
        const fieldOps = companyOps.filter(op => op.field === field.name);

        for (const op of fieldOps) {
            if (op.revenue) {
                totalRevenue += op.revenue;
            }
            totalCosts += op.laborHours * LABOR_COST_PER_HOUR;
            if (op.fuelConsumed) {
                totalCosts += op.fuelConsumed * DIESEL_PRICE_PER_LITER;
            }
            if (op.materials) {
                for (const material of op.materials) {
                    const item = warehouseItems.find(i => i.id === material.itemId);
                    if (item) {
                        totalCosts += material.quantity * item.costPerUnit;
                    }
                }
            }
        }
        
        economicsByFieldId[field.id] = {
            revenue: totalRevenue,
            costs: totalCosts,
            contributionMargin: totalRevenue - totalCosts,
        };
    }
    
    return Promise.resolve(economicsByFieldId);
  }

  async getUsersForCompany(tenantId: string, companyId: string): Promise<User[]> {
    console.log(`Fetching Users for tenant ${tenantId} and company ${companyId}.`);
    const companyUsers = users.filter(u => 
        u.tenantId === tenantId && 
        u.companyRoles.some(cr => cr.companyId === companyId)
    );
    return Promise.resolve(companyUsers);
  }

  async addUser(tenantId: string, companyId: string, userData: AddUserInput): Promise<User> {
    console.log(`Adding user to tenant ${tenantId} and company ${companyId}.`);
    
    let user = users.find(u => u.email === userData.email);

    if (user) {
        const alreadyInCompany = user.companyRoles.some(cr => cr.companyId === companyId);
        if (alreadyInCompany) {
            throw new Error('User is already a member of this company.');
        }
        user.companyRoles.push({ companyId, role: userData.role });
        if (userData.pesticideLicenseNumber) user.pesticideLicenseNumber = userData.pesticideLicenseNumber;
        if (userData.pesticideLicenseExpiry) user.pesticideLicenseExpiry = userData.pesticideLicenseExpiry;
    } else {
        user = {
            id: `user-${users.length + 1}`,
            name: userData.name,
            email: userData.email,
            tenantId: tenantId,
            companyRoles: [{ companyId, role: userData.role }],
            pesticideLicenseNumber: userData.pesticideLicenseNumber || undefined,
            pesticideLicenseExpiry: userData.pesticideLicenseExpiry || undefined,
        };
        users.push(user);
    }
    
    logAuditEvent(tenantId, companyId, 'user.add', `User "${userData.name}" (${userData.email}) was added to the company with role "${userData.role}".`);
    
    return Promise.resolve(user);
  }

  async updateUser(tenantId: string, companyId: string, userId: string, userData: UpdateUserData): Promise<User> {
    console.log(`Updating user ${userId} for tenant ${tenantId}, company ${companyId}.`);
    const userIndex = users.findIndex(u => u.id === userId && u.tenantId === tenantId);
    if (userIndex === -1) {
      throw new Error("User not found or you don't have permission to edit.");
    }
    
    const user = users[userIndex];
    
    // Update basic properties
    user.name = userData.name;
    user.email = userData.email;
    user.pesticideLicenseNumber = userData.pesticideLicenseNumber || undefined;
    user.pesticideLicenseExpiry = userData.pesticideLicenseExpiry || undefined;

    // Update role for the specific company
    const roleIndex = user.companyRoles.findIndex(cr => cr.companyId === companyId);
    if (roleIndex !== -1) {
      user.companyRoles[roleIndex].role = userData.role;
    } else {
      // This case should ideally not happen if we are editing a user within a company context
      // but we can add it for robustness.
      user.companyRoles.push({ companyId, role: userData.role });
    }
    
    users[userIndex] = user;

    logAuditEvent(tenantId, companyId, 'user.update', `User details for "${userData.name}" were updated.`);
    
    return Promise.resolve(user);
  }

  async deleteUser(tenantId: string, companyId: string, userId: string): Promise<void> {
    console.log(`Deleting user ${userId} from company ${companyId}.`);
    const userIndex = users.findIndex(u => u.id === userId && u.tenantId === tenantId);
    if (userIndex === -1) {
        return Promise.reject(new Error("User not found."));
    }
    
    const user = users[userIndex];
    const roleIndex = user.companyRoles.findIndex(cr => cr.companyId === companyId);
    
    if (roleIndex === -1) {
        return Promise.reject(new Error("User is not a member of this company."));
    }

    // Instead of deleting the user, just remove their role for this company
    user.companyRoles.splice(roleIndex, 1);
    
    logAuditEvent(tenantId, companyId, 'user.remove', `User "${user.name}" was removed from the company.`);
    
    return Promise.resolve();
  }

  async getWarehouseItems(tenantId: string, companyId: string): Promise<WarehouseItem[]> {
    console.log(`Fetching Warehouse Items for tenant ${tenantId} and company ${companyId}.`);
    return Promise.resolve(warehouseItems.filter(i => i.tenantId === tenantId && i.companyId === companyId));
  }

  async addWarehouseItem(tenantId: string, companyId: string, itemData: AddWarehouseItemInput): Promise<WarehouseItem> {
    console.log(`Adding Warehouse Item for tenant ${tenantId} and company ${companyId}.`);
    const newItem: WarehouseItem = {
      id: `item-${warehouseItems.length + 1}`,
      tenantId,
      companyId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...itemData,
    };
    warehouseItems.unshift(newItem);
    logAuditEvent(tenantId, companyId, 'warehouse.item.create', `Lagerartikel "${itemData.name}" wurde hinzugefügt (Menge: ${itemData.quantity} ${itemData.unit}).`);
    return Promise.resolve(newItem);
  }
  
  async updateWarehouseItem(tenantId: string, companyId: string, itemId: string, itemData: UpdateWarehouseItemInput): Promise<WarehouseItem> {
    console.log(`Updating Warehouse Item ${itemId} for tenant ${tenantId}, company ${companyId}.`);
    const itemIndex = warehouseItems.findIndex(i => i.id === itemId && i.tenantId === tenantId && i.companyId === companyId);
    if (itemIndex === -1) {
      throw new Error("Item not found or not authorized to update.");
    }
    const updatedItem = { 
        ...warehouseItems[itemIndex], 
        ...itemData, 
        // ensure nutrient/psm fields are nulled if type changes
        n: itemData.itemType === 'Fertilizer' ? itemData.n : undefined,
        p: itemData.itemType === 'Fertilizer' ? itemData.p : undefined,
        k: itemData.itemType === 'Fertilizer' ? itemData.k : undefined,
        registrationNumber: itemData.itemType === 'Pesticide' ? itemData.registrationNumber : undefined,
        waitingPeriodDays: itemData.itemType === 'Pesticide' ? itemData.waitingPeriodDays : undefined,
        updatedAt: new Date().toISOString() 
    };
    warehouseItems[itemIndex] = updatedItem;
    logAuditEvent(tenantId, companyId, 'warehouse.item.update', `Lagerartikel "${updatedItem.name}" wurde aktualisiert.`);
    return Promise.resolve(updatedItem);
  }

  async deleteWarehouseItem(tenantId: string, companyId: string, itemId: string): Promise<void> {
    console.log(`Deleting Warehouse Item ${itemId} for tenant ${tenantId} and company ${companyId}.`);
    const initialLength = warehouseItems.length;
    const itemToDelete = warehouseItems.find(i => i.id === itemId && i.tenantId === tenantId && i.companyId === companyId);
    
    if (!itemToDelete) {
        return Promise.reject(new Error('Item not found or not authorized to delete.'));
    }
    
    const isUsed = operations.some(op => op.materials?.some(mat => mat.itemId === itemId));
    if (isUsed) {
        return Promise.reject(new Error('Item cannot be deleted because it is used in at least one work order.'));
    }

    warehouseItems = warehouseItems.filter(i => !(i.id === itemId && i.tenantId === tenantId && i.companyId === companyId));
    
    if (warehouseItems.length < initialLength) {
        logAuditEvent(tenantId, companyId, 'warehouse.item.delete', `Lagerartikel "${itemToDelete.name}" wurde gelöscht.`);
        return Promise.resolve();
    } else {
        return Promise.reject(new Error('Deletion failed unexpectedly.'));
    }
  }

  // ====== CADASTRAL PARCELS (Flurstücke) ======

  async getCadastralParcels(tenantId: string, companyId: string): Promise<CadastralParcel[]> {
    console.log(`Fetching Cadastral Parcels for tenant ${tenantId} and company ${companyId}.`);
    return Promise.resolve(cadastralParcels.filter(p => p.tenantId === tenantId && p.companyId === companyId));
  }

  async getCadastralParcelById(tenantId: string, companyId: string, parcelId: string): Promise<CadastralParcel | null> {
    console.log(`Fetching Cadastral Parcel ${parcelId} for tenant ${tenantId} and company ${companyId}.`);
    const parcel = cadastralParcels.find(p => p.id === parcelId && p.tenantId === tenantId && p.companyId === companyId);
    return Promise.resolve(parcel || null);
  }

  async addCadastralParcel(tenantId: string, companyId: string, parcelData: CadastralParcelFormData): Promise<CadastralParcel> {
    console.log(`Adding Cadastral Parcel for tenant ${tenantId} and company ${companyId}.`);
    const newParcel: CadastralParcel = {
      id: `parcel-${cadastralParcels.length + 1}`,
      tenantId,
      companyId,
      ...parcelData,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    cadastralParcels.push(newParcel);
    logAuditEvent(tenantId, companyId, 'cadastral.parcel.create', `Flurstück "${parcelData.name}" (${parcelData.parcelNumber}) wurde hinzugefügt (${parcelData.area}ha).`);
    return Promise.resolve(newParcel);
  }

  async updateCadastralParcel(tenantId: string, companyId: string, parcelId: string, parcelData: CadastralParcelFormData): Promise<CadastralParcel> {
    console.log(`Updating Cadastral Parcel ${parcelId} for tenant ${tenantId} and company ${companyId}.`);
    const parcelIndex = cadastralParcels.findIndex(p => p.id === parcelId && p.tenantId === tenantId && p.companyId === companyId);
    if (parcelIndex === -1) {
      throw new Error("Cadastral Parcel not found or not authorized to update.");
    }
    const updatedParcel: CadastralParcel = {
      ...cadastralParcels[parcelIndex],
      ...parcelData,
      updatedAt: new Date(),
    };
    cadastralParcels[parcelIndex] = updatedParcel;
    logAuditEvent(tenantId, companyId, 'cadastral.parcel.update', `Flurstück "${parcelData.name}" wurde aktualisiert.`);
    return Promise.resolve(updatedParcel);
  }

  async deleteCadastralParcel(tenantId: string, companyId: string, parcelId: string): Promise<void> {
    console.log(`Deleting Cadastral Parcel ${parcelId} for tenant ${tenantId} and company ${companyId}.`);
    const parcelToDelete = cadastralParcels.find(p => p.id === parcelId && p.tenantId === tenantId && p.companyId === companyId);
    
    if (!parcelToDelete) {
      return Promise.reject(new Error('Cadastral Parcel not found or not authorized to delete.'));
    }

    // Check if parcel is used in any field
    const isUsed = fields.some(f => f.cadastralParcelIds.includes(parcelId));
    if (isUsed) {
      return Promise.reject(new Error('Cadastral Parcel cannot be deleted because it is used in one or more fields.'));
    }

    const initialLength = cadastralParcels.length;
    const newParcels = cadastralParcels.filter(p => !(p.id === parcelId && p.tenantId === tenantId && p.companyId === companyId));
    
    if (newParcels.length < initialLength) {
      cadastralParcels.length = 0;
      cadastralParcels.push(...newParcels);
      logAuditEvent(tenantId, companyId, 'cadastral.parcel.delete', `Flurstück "${parcelToDelete.name}" wurde gelöscht.`);
      return Promise.resolve();
    } else {
      return Promise.reject(new Error('Deletion failed unexpectedly.'));
    }
  }

  // ====== FIELD BLOCKS (Feldblöcke / Referenzparzellen) ======

  async getFieldBlocks(tenantId: string, companyId: string): Promise<FieldBlock[]> {
    console.log(`Fetching Field Blocks for tenant ${tenantId} and company ${companyId}.`);
    return Promise.resolve(fieldBlocks.filter(b => b.tenantId === tenantId && b.companyId === companyId));
  }

  async getFieldBlockById(tenantId: string, companyId: string, blockId: string): Promise<FieldBlock | null> {
    console.log(`Fetching Field Block ${blockId} for tenant ${tenantId} and company ${companyId}.`);
    const block = fieldBlocks.find(b => b.id === blockId && b.tenantId === tenantId && b.companyId === companyId);
    return Promise.resolve(block || null);
  }

  async addFieldBlock(tenantId: string, companyId: string, blockData: FieldBlockFormData): Promise<FieldBlock> {
    console.log(`Adding Field Block for tenant ${tenantId} and company ${companyId}.`);
    const newBlock: FieldBlock = {
      id: `block-${fieldBlocks.length + 1}`,
      tenantId,
      companyId,
      ...blockData,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    fieldBlocks.push(newBlock);
    logAuditEvent(tenantId, companyId, 'field.block.create', `Feldblock "${blockData.name}" (${blockData.referenceNumber}) wurde hinzugefügt (${blockData.totalArea}ha).`);
    return Promise.resolve(newBlock);
  }

  async updateFieldBlock(tenantId: string, companyId: string, blockId: string, blockData: FieldBlockFormData): Promise<FieldBlock> {
    console.log(`Updating Field Block ${blockId} for tenant ${tenantId} and company ${companyId}.`);
    const blockIndex = fieldBlocks.findIndex(b => b.id === blockId && b.tenantId === tenantId && b.companyId === companyId);
    if (blockIndex === -1) {
      throw new Error("Field Block not found or not authorized to update.");
    }
    const updatedBlock: FieldBlock = {
      ...fieldBlocks[blockIndex],
      ...blockData,
      updatedAt: new Date(),
    };
    fieldBlocks[blockIndex] = updatedBlock;
    logAuditEvent(tenantId, companyId, 'field.block.update', `Feldblock "${blockData.name}" wurde aktualisiert.`);
    return Promise.resolve(updatedBlock);
  }

  async deleteFieldBlock(tenantId: string, companyId: string, blockId: string): Promise<void> {
    console.log(`Deleting Field Block ${blockId} for tenant ${tenantId} and company ${companyId}.`);
    const blockToDelete = fieldBlocks.find(b => b.id === blockId && b.tenantId === tenantId && b.companyId === companyId);
    
    if (!blockToDelete) {
      return Promise.reject(new Error('Field Block not found or not authorized to delete.'));
    }

    // Check if block has fields assigned
    if (blockToDelete.fieldIds.length > 0) {
      return Promise.reject(new Error('Field Block cannot be deleted because it has fields assigned. Please reassign the fields first.'));
    }

    const initialLength = fieldBlocks.length;
    const newBlocks = fieldBlocks.filter(b => !(b.id === blockId && b.tenantId === tenantId && b.companyId === companyId));
    
    if (newBlocks.length < initialLength) {
      fieldBlocks.length = 0;
      fieldBlocks.push(...newBlocks);
      logAuditEvent(tenantId, companyId, 'field.block.delete', `Feldblock "${blockToDelete.name}" wurde gelöscht.`);
      return Promise.resolve();
    } else {
      return Promise.reject(new Error('Deletion failed unexpectedly.'));
    }
  }
}
