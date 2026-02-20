import { DataService } from './data-service';
import { MockDataService } from './mock-data-service';
import { MySqlDataService } from './mysql-data-service';
import { SupabaseDataService } from './supabase-data-service';

// --- DATABASE ABSTRACTION LAYER ---
// The application is configured to use a specific DataService implementation.
// This allows you to switch the data source for the entire app without changing the UI code.
//
// To switch the data provider, comment out the active one and uncomment one of the others.
//
// - MockDataService: Uses hardcoded data for development and demonstration. No database needed.
// - MySqlDataService: Placeholder adapter for a MySQL database. Logs calls and returns empty data.
// - SupabaseDataService: Placeholder adapter for a Supabase (Postgres) backend. Logs calls and returns empty data.
const dataService: DataService = new MockDataService();
// const dataService: DataService = new MySqlDataService(); 
// const dataService: DataService = new SupabaseDataService();

export default dataService;
