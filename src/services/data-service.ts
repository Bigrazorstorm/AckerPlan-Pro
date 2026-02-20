import { Kpi, ChartDataPoint, RecentActivity, Machinery, Session, Field } from './types';

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
   * Retrieves recent activities for a given company and tenant.
   * @param tenantId - The ID of the tenant.
   * @param companyId - The ID of the company.
   */
  getRecentActivities(tenantId: string, companyId: string): Promise<RecentActivity[]>;

  /**
   * Retrieves machinery data for a given company and tenant.
   * @param tenantId - The ID of the tenant.
   * @param companyId - The ID of the company.
   */
  getMachinery(tenantId: string, companyId: string): Promise<Machinery[]>;

  /**
   * Adds a new machine to the data store.
   * @param tenantId - The ID of the tenant.
   * @param companyId - The ID of the company.
   * @param machineData - The data for the new machine.
   */
  addMachinery(tenantId: string, companyId: string, machineData: { name: string; type: string; model: string; }): Promise<Machinery>;

  /**
   * Retrieves fields data for a given company and tenant.
   * @param tenantId - The ID of the tenant.
   * @param companyId - The ID of the company.
   */
  getFields(tenantId: string, companyId: string): Promise<Field[]>;
}
