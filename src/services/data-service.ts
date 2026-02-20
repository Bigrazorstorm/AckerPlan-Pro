import { Kpi, ChartDataPoint, Operation, Machinery, Session, Field, MaintenanceEvent, AddMaintenanceEventInput, AuditLogEvent, RepairEvent, AddRepairEventInput, AddOperationInput, LaborHoursByCropReportData, Observation, AddObservationInput, ProfitabilityByCropReportData, UpdateMachineInput, FieldEconomics, User } from './types';

/**
 * Defines the contract for data access in the application.
 * This interface abstracts the data source, allowing for different implementations 
 * (e.g., mock data, MySQL, Supabase, Firestore) without changing the application logic.
 */
export interface DataService {
  /**
   * Retrieves the current user's session information, including available companies.
   */
  getSession(): Promise<Session>;

  /**
   * Retrieves Key Performance Indicators for a given company and tenant.
   * @param tenantId - The ID of the tenant.
   * @param companyId - The ID of the company.
   */
  getKpis(tenantId: string, companyId: string): Promise<Kpi[]>;
  
  /**
   * Retrieves chart data for a given company and tenant.
   * @param tenantId - The ID of the tenant.
   * @param companyId - The ID of the company.
   */
  getChartData(tenantId: string, companyId: string): Promise<ChartDataPoint[]>;

  /**
   * Retrieves recent operations for a given company and tenant.
   * @param tenantId - The ID of the tenant.
   * @param companyId - The ID of the company.
   */
  getOperations(tenantId: string, companyId: string): Promise<Operation[]>;

  /**
   * Retrieves machinery data for a given company and tenant.
   * @param tenantId - The ID of the tenant.
   * @param companyId - The ID of the company.
   */
  getMachinery(tenantId: string, companyId: string): Promise<Machinery[]>;

  /**
   * Retrieves a single machine by its ID.
   * @param tenantId - The ID of the tenant.
   * @param companyId - The ID of the company.
   * @param machineId - The ID of the machine to retrieve.
   */
  getMachineById(tenantId: string, companyId: string, machineId: string): Promise<Machinery | null>;

  /**
   * Retrieves the maintenance history for a specific machine.
   * @param tenantId - The ID of the tenant.
   * @param companyId - The ID of the company.
   * @param machineId - The ID of the machine.
   */
  getMaintenanceHistory(tenantId: string, companyId: string, machineId: string): Promise<MaintenanceEvent[]>;

  /**
   * Adds a new maintenance event for a machine.
   * @param tenantId - The ID of the tenant.
   * @param companyId - The ID of the company.
   * @param eventData - The data for the new maintenance event.
   */
  addMaintenanceEvent(tenantId: string, companyId: string, eventData: AddMaintenanceEventInput): Promise<MaintenanceEvent>;
  
  /**
   * Retrieves the repair history for a specific machine.
   * @param tenantId - The ID of the tenant.
   * @param companyId - The ID of the company.
   * @param machineId - The ID of the machine.
   */
  getRepairHistory(tenantId: string, companyId: string, machineId: string): Promise<RepairEvent[]>;

  /**
   * Adds a new repair event for a machine.
   * @param tenantId - The ID of the tenant.
   * @param companyId - The ID of the company.
   * @param eventData - The data for the new repair event.
   */
  addRepairEvent(tenantId: string, companyId: string, eventData: AddRepairEventInput): Promise<RepairEvent>;

  /**
   * Adds a new machine to the data store.
   * @param tenantId - The ID of the tenant.
   * @param companyId - The ID of the company.
   * @param machineData - The data for the new machine.
   */
  addMachinery(tenantId: string, companyId: string, machineData: { name: string; type: string; model: string; standardFuelConsumption: number; maintenanceIntervalHours?: number; }): Promise<Machinery>;

  /**
   * Updates an existing machine in the data store.
   * @param tenantId - The ID of the tenant.
   * @param companyId - The ID of the company.
   * @param machineId - The ID of the machine to update.
   * @param machineData - The data to update for the machine.
   */
  updateMachine(tenantId: string, companyId: string, machineId: string, machineData: UpdateMachineInput): Promise<Machinery>;

  /**
   * Deletes a machine from the data store.
   * @param tenantId - The ID of the tenant.
   * @param companyId - The ID of the company.
   * @param machineId - The ID of the machine to delete.
   */
  deleteMachine(tenantId: string, companyId: string, machineId: string): Promise<void>;

  /**
   * Adds a new operation to the data store.
   * @param tenantId - The ID of the tenant.
   * @param companyId - The ID of the company.
   * @param operationData - The data for the new operation.
   */
  addOperation(tenantId: string, companyId: string, operationData: AddOperationInput): Promise<Operation[]>;

  /**
   * Deletes an operation from the data store.
   * @param tenantId - The ID of the tenant.
   * @param companyId - The ID of the company.
   * @param operationId - The ID of the operation to delete.
   */
  deleteOperation(tenantId: string, companyId: string, operationId: string): Promise<void>;

  /**
   * Retrieves fields data for a given company and tenant.
   * @param tenantId - The ID of the tenant.
   * @param companyId - The ID of the company.
   */
  getFields(tenantId: string, companyId: string): Promise<Field[]>;

  /**
   * Retrieves a single field by its ID.
   * @param tenantId - The ID of the tenant.
   * @param companyId - The ID of the company.
   * @param fieldId - The ID of the field to retrieve.
   */
  getFieldById(tenantId: string, companyId: string, fieldId: string): Promise<Field | null>;

  /**
   * Retrieves operations for a specific field.
   * @param tenantId - The ID of the tenant.
   * @param companyId - The ID of the company.
   * @param fieldName - The name of the field.
   */
  getOperationsForField(tenantId: string, companyId: string, fieldName: string): Promise<Operation[]>;

  /**
   * Retrieves the audit log for a given company and tenant.
   * @param tenantId - The ID of the tenant.
   * @param companyId - The ID of the company.
   */
  getAuditLog(tenantId: string, companyId: string): Promise<AuditLogEvent[]>;

  /**
   * Retrieves observations for a given company and tenant.
   * @param tenantId - The ID of the tenant.
   * @param companyId - The ID of the company.
   */
  getObservations(tenantId: string, companyId: string): Promise<Observation[]>;

  /**
   * Adds a new observation to the data store.
   * @param tenantId - The ID of the tenant.
   * @param companyId - The ID of the company.
   * @param observationData - The data for the new observation.
   */
  addObservation(tenantId: string, companyId: string, observationData: AddObservationInput): Promise<Observation>;

  /**
   * Deletes an observation from the data store.
   * @param tenantId The ID of the tenant.
   * @param companyId The ID of the company.
   * @param observationId The ID of the observation to delete.
   */
  deleteObservation(tenantId: string, companyId: string, observationId: string): Promise<void>;

  /**
   * Retrieves data for the labor hours by crop report.
   * @param tenantId - The ID of the tenant.
   * @param companyId - The ID of the company.
   */
  getLaborHoursByCropReport(tenantId: string, companyId: string): Promise<LaborHoursByCropReportData[]>;
  
  /**
   * Retrieves data for the profitability by crop report.
   * @param tenantId - The ID of the tenant.
   * @param companyId - The ID of the company.
   */
  getProfitabilityByCropReport(tenantId: string, companyId: string): Promise<ProfitabilityByCropReportData[]>;

  /**
   * Retrieves economic data (revenue, costs, margin) for a specific field.
   * @param tenantId - The ID of the tenant.
   * @param companyId - The ID of the company.
   * @param fieldId - The ID of the field.
   */
  getFieldEconomics(tenantId: string, companyId: string, fieldId: string): Promise<FieldEconomics>;

  /**
   * Retrieves all users associated with a specific company.
   * @param tenantId The ID of the tenant.
   * @param companyId The ID of the company.
   */
  getUsersForCompany(tenantId: string, companyId: string): Promise<User[]>;
}
