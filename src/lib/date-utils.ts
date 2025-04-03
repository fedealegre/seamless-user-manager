
/**
 * Utility functions for date formatting with timezone support
 */

// Format a date considering the specified timezone
export const formatDateInTimezone = (
  date: Date | string | number,
  timezone: string = "UTC",
  locale: string = "en-US",
  options: Intl.DateTimeFormatOptions = {}
): string => {
  if (!date) return "";
  
  const dateObj = typeof date === "string" || typeof date === "number" 
    ? new Date(date) 
    : date;
  
  try {
    const defaultOptions: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZone: timezone,
      ...options
    };
    
    return new Intl.DateTimeFormat(locale, defaultOptions).format(dateObj);
  } catch (error) {
    console.error("Error formatting date:", error);
    return String(date);
  }
};

// Format a date for input field (YYYY-MM-DD)
export const formatDateForInput = (
  date: Date | undefined, 
  timezone: string = "UTC"
): string => {
  if (!date) return "";
  
  try {
    // Format using the timezone but in a format suitable for inputs
    const formatter = new Intl.DateTimeFormat("en-CA", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      timeZone: timezone
    });
    
    return formatter.format(date).split("/").join("-");
  } catch (error) {
    console.error("Error formatting date for input:", error);
    return "";
  }
};

// Get current date in the specified timezone
export const getCurrentDateInTimezone = (timezone: string = "UTC"): Date => {
  // Create a date in the local timezone
  const date = new Date();
  
  // Convert it to a string in the target timezone
  const dateString = date.toLocaleString("en-US", { timeZone: timezone });
  
  // Parse it back to a Date object
  return new Date(dateString);
};
