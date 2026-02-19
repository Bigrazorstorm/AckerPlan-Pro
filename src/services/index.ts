import { DataService } from './data-service';
import { MockDataService } from './mock-data-service';
import { MySqlDataService } from './mysql-data-service';
import { SupabaseDataService } from './supabase-data-service';

// The application is configured to use a specific DataService implementation.
// By changing the assigned variable, you can switch the data source for the entire app.
// This is useful for development (using MockDataService) and production (e.g., MySqlDataService).
const dataService: DataService = new MockDataService();
// const dataService: DataService = new MySqlDataService(); 
// const dataService: DataService = new SupabaseDataService();

export default dataService;
