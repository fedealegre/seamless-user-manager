
/**
 * CSV Export Service
 * Handles the conversion and download of data to CSV format
 */

export interface CSVExportOptions {
  filename: string;
  headers: string[];
  rows: any[];
  /**
   * Optional mapper function to transform data before export
   * @param row The row data to transform
   * @param index The index of the row
   * @returns An array of values in the same order as headers
   */
  mapRow?: (row: any, index: number) => any[];
}

export class CSVExportService {
  
  /**
   * Export data as a CSV file
   */
  public static export(options: CSVExportOptions): void {
    const { filename, headers, rows, mapRow } = options;
    
    // Create CSV content
    let csvContent = this.generateCSVContent(headers, rows, mapRow);
    
    // Create a Blob with the CSV content
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    
    // Create a download link
    const link = document.createElement('a');
    
    // Create the download URL
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.csv`);
    
    // Append the link to the document
    document.body.appendChild(link);
    
    // Trigger the download
    link.click();
    
    // Clean up
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
  
  /**
   * Generate the CSV content from headers and rows
   */
  private static generateCSVContent(
    headers: string[],
    rows: any[],
    mapRow?: (row: any, index: number) => any[]
  ): string {
    // Add headers
    let content = headers.join(',') + '\r\n';
    
    // Add rows
    rows.forEach((row, index) => {
      let values = mapRow ? mapRow(row, index) : Object.values(row);
      
      // Escape any values that contain commas or quotes
      const escapedValues = values.map(value => {
        if (value === null || value === undefined) {
          return '';
        }
        
        const stringValue = String(value);
        
        // If the value contains quotes, commas, or newlines, quote it and escape any quotes
        if (stringValue.includes('"') || stringValue.includes(',') || stringValue.includes('\n')) {
          return `"${stringValue.replace(/"/g, '""')}"`;
        }
        
        return stringValue;
      });
      
      content += escapedValues.join(',') + '\r\n';
    });
    
    return content;
  }
}

