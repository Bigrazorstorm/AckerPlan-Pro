

import { Kpi, ChartDataPoint, Operation, Machinery, Session, Field, MaintenanceEvent, AddMaintenanceEventInput, AuditLogEvent, RepairEvent, AddRepairEventInput, AddOperationInput, LaborHoursByCropReportData, Observation, AddObservationInput, ProfitabilityByCropReportData, UpdateMachineInput, FieldEconomics, User, AddUserInput, UpdateOperationInput, WarehouseItem, AddWarehouseItemInput, UpdateObservationInput, UpdateWarehouseItemInput, UpdateUserData, ProfitabilityByFieldReportData } from './types';
import { CadastralParcel, FieldBlock, CadastralParcelFormData, FieldBlockFormData } from './field-types';

/**
 * Defines the contract for data access in the application.
 * This interface abstracts the data source, allowing for different implementations 
 * (e.g., mock data, MySQL, Supabase, Firestore) without changing the application logic.
 */
export interface DataService {
  /**
   * Retrieves the current user's session information, including available companies.
   * @param email - The email of the user to get the session for.
   */
  getSession(email?: string): Promise<Session>;

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
   * Updates an existing operation in the data store.
   * @param tenantId The ID of the tenant.
   * @param companyId The ID of the company.
   * @param operationId The ID of the operation to update.
   * @param operationData The new data for the operation.
   */
  updateOperation(tenantId: string, companyId: string, operationId: string, operationData: UpdateOperationInput): Promise<Operation>;

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
   * Updates an existing field in the data store.
   * @param tenantId The ID of the tenant.
   * @param companyId The ID of the company.
   * @param field The field data to update.
   */
  updateField(tenantId: string, companyId: string, field: Field): Promise<Field>;

  /**
   * Deletes a field from the data store.
   * @param tenantId - The ID of the tenant.
   * @param companyId - The ID of the company.
   * @param fieldId - The ID of the field to delete.
   */
  deleteField(tenantId: string, companyId: string, fieldId: string): Promise<void>;

  /**
   * Retrieves operations for a specific field.
   * @param tenantId - The ID of the tenant.
   * @param companyId - The ID of the company.
   * @param fieldName - The name of the field.
   */
  getOperationsForField(tenantId: string, companyId: string, fieldName: string): Promise<Operation[]>;

  /**
   * Retrieves observations for a specific field.
   * @param tenantId - The ID of the tenant.
   * @param companyId - The ID of the company.
   * @param fieldName - The name of the field.
   */
  getObservationsForField(tenantId: string, companyId: string, fieldName: string): Promise<Observation[]>;

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
   * Updates an existing observation.
   * @param tenantId The ID of the tenant.
   * @param companyId The ID of the company.
   * @param observationId The ID of the observation to update.
   * @param observationData The data to update.
   */
  updateObservation(tenantId: string, companyId: string, observationId: string, observationData: UpdateObservationInput): Promise<Observation>;

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
   * Retrieves data for the profitability by field report.
   * @param tenantId - The ID of the tenant.
   * @param companyId - The ID of the company.
   */
  getProfitabilityByFieldReport(tenantId: string, companyId: string): Promise<ProfitabilityByFieldReportData[]>;

  /**
   * Retrieves economic data (revenue, costs, margin) for a specific field.
   * @param tenantId - The ID of the tenant.
   * @param companyId - The ID of the company.
   * @param fieldId - The ID of the field.
   */
  getFieldEconomics(tenantId: string, companyId: string, fieldId: string): Promise<FieldEconomics>;

  /**
   * Retrieves economic data for all fields.
   * @param tenantId - The ID of the tenant.
   * @param companyId - The ID of the company.
   */
  getAllFieldEconomics(tenantId: string, companyId: string): Promise<Record<string, FieldEconomics>>;

  /**
   * Retrieves all users associated with a specific company.
   * @param tenantId The ID of the tenant.
   * @param companyId The ID of the company.
   */
  getUsersForCompany(tenantId: string, companyId: string): Promise<User[]>;

  /**
   * Adds a new user to a company within a tenant.
   * @param tenantId The ID of the tenant.
   * @param companyId The ID of the company.
   * @param userData The data for the new user.
   */
  addUser(tenantId: string, companyId: string, userData: AddUserInput): Promise<User>;

  /**
   * Updates an existing user's data for a specific company.
   * @param tenantId The ID of the tenant.
   * @param companyId The ID of the company.
   * @param userId The ID of the user to update.
   * @param userData The data to update.
   */
  updateUser(tenantId: string, companyId: string, userId: string, userData: UpdateUserData): Promise<User>;

  /**
   * Removes a user's role from a company.
   * @param tenantId The ID of the tenant.
   * @param companyId The ID of the company.
   * @param userId The ID of the user to remove.
   */
  deleteUser(tenantId: string, companyId: string, userId: string): Promise<void>;
  
  /**
   * Retrieves warehouse items for a given company and tenant.
   * @param tenantId - The ID of the tenant.
   * @param companyId - The ID of the company.
   */
  getWarehouseItems(tenantId: string, companyId: string): Promise<WarehouseItem[]>;

  /**
   * Adds a new item to the warehouse.
   * @param tenantId - The ID of the tenant.
   * @param companyId - The ID of the company.
   * @param itemData - The data for the new item.
   */
  addWarehouseItem(tenantId: string, companyId: string, itemData: AddWarehouseItemInput): Promise<WarehouseItem>;

  /**
   * Updates an existing item in the warehouse.
   * @param tenantId The ID of the tenant.
   * @param companyId The ID of the company.
   * @param itemId The ID of the item to update.
   * @param itemData The data to update.
   */
  updateWarehouseItem(tenantId: string, companyId: string, itemId: string, itemData: UpdateWarehouseItemInput): Promise<WarehouseItem>;

  /**
   * Deletes an item from the warehouse.
   * @param tenantId The ID of the tenant.
   * @param companyId The ID of the company.
   * @param itemId The ID of the item to delete.
   */
  deleteWarehouseItem(tenantId: string, companyId: string, itemId: string): Promise<void>;

  // ====== CADASTRAL PARCELS (Flurstücke) ======

  /**
   * Retrieves all cadastral parcels for a given company and tenant.
   * @param tenantId - The ID of the tenant.
   * @param companyId - The ID of the company.
   */
  getCadastralParcels(tenantId: string, companyId: string): Promise<CadastralParcel[]>;

  /**
   * Retrieves a single cadastral parcel by its ID.
   * @param tenantId - The ID of the tenant.
   * @param companyId - The ID of the company.
   * @param parcelId - The ID of the parcel to retrieve.
   */
  getCadastralParcelById(tenantId: string, companyId: string, parcelId: string): Promise<CadastralParcel | null>;

  /**
   * Creates a new cadastral parcel.
   * @param tenantId - The ID of the tenant.
   * @param companyId - The ID of the company.
   * @param parcelData - The data for the new parcel.
   */
  addCadastralParcel(tenantId: string, companyId: string, parcelData: CadastralParcelFormData): Promise<CadastralParcel>;

  /**
   * Updates an existing cadastral parcel.
   * @param tenantId - The ID of the tenant.
   * @param companyId - The ID of the company.
   * @param parcelId - The ID of the parcel to update.
   * @param parcelData - The updated parcel data.
   */
  updateCadastralParcel(tenantId: string, companyId: string, parcelId: string, parcelData: CadastralParcelFormData): Promise<CadastralParcel>;

  /**
   * Deletes a cadastral parcel.
   * @param tenantId - The ID of the tenant.
   * @param companyId - The ID of the company.
   * @param parcelId - The ID of the parcel to delete.
   */
  deleteCadastralParcel(tenantId: string, companyId: string, parcelId: string): Promise<void>;

  // ====== FIELD BLOCKS (Feldblöcke / Referenzparzellen) ======

  /**
   * Retrieves all field blocks for a given company and tenant.
   * @param tenantId - The ID of the tenant.
   * @param companyId - The ID of the company.
   */
  getFieldBlocks(tenantId: string, companyId: string): Promise<FieldBlock[]>;

  /**
   * Retrieves a single field block by its ID.
   * @param tenantId - The ID of the tenant.
   * @param companyId - The ID of the company.
   * @param blockId - The ID of the block to retrieve.
   */
  getFieldBlockById(tenantId: string, companyId: string, blockId: string): Promise<FieldBlock | null>;

  /**
   * Creates a new field block.
   * @param tenantId - The ID of the tenant.
   * @param companyId - The ID of the company.
   * @param blockData - The data for the new block.
   */
  addFieldBlock(tenantId: string, companyId: string, blockData: FieldBlockFormData): Promise<FieldBlock>;

  /**
   * Updates an existing field block.
   * @param tenantId - The ID of the tenant.
   * @param companyId - The ID of the company.
   * @param blockId - The ID of the block to update.
   * @param blockData - The updated block data.
   */
  updateFieldBlock(tenantId: string, companyId: string, blockId: string, blockData: FieldBlockFormData): Promise<FieldBlock>;

  /**
   * Deletes a field block.
   * @param tenantId - The ID of the tenant.
   * @param companyId - The ID of the company.
   * @param blockId - The ID of the block to delete.
   */
  deleteFieldBlock(tenantId: string, companyId: string, blockId: string): Promise<void>;
}
