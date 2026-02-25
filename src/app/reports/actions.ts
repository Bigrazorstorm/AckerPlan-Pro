'use server';

import dataService from '@/services';
import { ProfitabilityByCropReportData } from '@/services/types';

// A helper function to safely convert data to CSV format
function convertToCSV(data: any[], headers: Record<string, string>): string {
    const headerKeys = Object.keys(headers);
    const headerValues = Object.values(headers);

    const csvRows = [headerValues.join(',')];

    for (const row of data) {
        const values = headerKeys.map(key => {
            let val = row[key as keyof typeof row];
            // Format numbers to a consistent string format for CSV, using dot as decimal separator
            if (typeof val === 'number') {
                val = val.toFixed(2);
            }
            let escaped = ('' + val).replace(/"/g, '""'); // Escape double quotes
            if (escaped.includes(',')) {
                escaped = `"${escaped}"`; // Wrap in double quotes if it contains a comma
            }
            return escaped;
        });
        csvRows.push(values.join(','));
    }

    return csvRows.join('\n');
}

/**
 * Generates a CSV string for the profitability report.
 * @param tenantId The ID of the tenant.
 * @param companyId The ID of the company.
 * @param headers A record mapping data keys to translated header names.
 * @returns An object with the CSV string or an error message.
 */
export async function exportProfitabilityReport(
    tenantId: string,
    companyId: string,
    headers: Record<string, string>
): Promise<{ csv?: string; error?: string }> {
    try {
        const reportData = await dataService.getProfitabilityByCropReport(tenantId, companyId);
        if (!reportData || reportData.length === 0) {
            return { error: 'No data available to export.' };
        }
        
        const csv = convertToCSV(reportData, headers);
        return { csv };
    } catch (error) {
        console.error('Failed to export report:', error);
        const message = error instanceof Error ? error.message : 'An unknown error occurred.';
        return { error: `Failed to generate the report: ${message}` };
    }
}
