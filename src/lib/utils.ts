
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date): string {
  try {
    // This function is kept for backward compatibility
    // New code should use the formatDateInTimezone from date-utils.ts
    // or useBackofficeSettings().formatDate
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  } catch (error) {
    return 'Invalid date'
  }
}

// Format field names: convert snake_case to Title Case with proper capitalization
export function formatFieldName(fieldName: string): string {
  if (!fieldName) return '';
  
  return fieldName
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

// Safely parse date string to date object preserving the correct date
export function parseDate(dateString: string | undefined): Date | undefined {
  if (!dateString) return undefined;
  
  // Parse the date string to handle various formats
  // This approach prevents timezone issues by explicitly setting the components
  try {
    if (dateString.includes('T')) {
      // Handle ISO format
      const [datePart] = dateString.split('T');
      const [year, month, day] = datePart.split('-').map(Number);
      
      if (isNaN(year) || isNaN(month) || isNaN(day)) return undefined;
      
      // Create the date directly using the numeric components
      // Note: No UTC - this avoids timezone shifts
      return new Date(year, month - 1, day);
    } else {
      // Handle simple YYYY-MM-DD format
      const [year, month, day] = dateString.split('-').map(Number);
      
      if (isNaN(year) || isNaN(month) || isNaN(day)) return undefined;
      
      // Create the date without timezone adjustment
      return new Date(year, month - 1, day);
    }
  } catch (error) {
    console.error("Error parsing date:", error);
    return undefined;
  }
}

// Format date for input field
export function formatDateForInput(date: Date | undefined): string {
  if (!date) return '';
  
  // Using date values directly without timezone adjustments
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
}
