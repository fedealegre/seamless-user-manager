
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
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: timezone,
      ...options
    };
    
    return new Intl.DateTimeFormat(locale, defaultOptions).format(dateObj);
  } catch (error) {
    console.error("Error formatting date:", error);
    return String(date);
  }
};

// Format a date for input field (DD/MM/YYYY)
export const formatDateForInput = (
  date: Date | undefined, 
  timezone: string = "UTC"
): string => {
  if (!date) return "";
  
  try {
    // Format using the timezone but in DD/MM/YYYY format
    const formatter = new Intl.DateTimeFormat("es-ES", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      timeZone: timezone
    });
    
    return formatter.format(date).split("/").join("/");
  } catch (error) {
    console.error("Error formatting date for input:", error);
    return "";
  }
};

// Parse date from DD/MM/YYYY format to Date object
export const parseDateFromInput = (
  dateString: string,
  timezone: string = "UTC"
): Date | undefined => {
  if (!dateString) return undefined;
  
  try {
    // Parse DD/MM/YYYY format
    const [day, month, year] = dateString.split("/").map(Number);
    
    if (isNaN(day) || isNaN(month) || isNaN(year)) return undefined;
    
    // Create date in the specified timezone
    const date = new Date(Date.UTC(year, month - 1, day));
    return date;
  } catch (error) {
    console.error("Error parsing date from input:", error);
    return undefined;
  }
};

// Get current date in the specified timezone
export const getCurrentDateInTimezone = (timezone: string = "UTC"): Date => {
  // Create a date in the local timezone
  const date = new Date();
  
  // Get the current time in ISO format
  const isoDate = date.toISOString();
  
  // Convert it to a string in the target timezone
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: false
  });
  
  // Format the date and parse it back
  const dateString = formatter.format(date);
  
  // Parse it back to a Date object
  return new Date(dateString);
};

// Format time difference (e.g., "2 hours ago")
export const formatTimeDifference = (
  date: Date | string | number,
  locale: string = "en-US",
  timezone: string = "UTC"
): string => {
  if (!date) return "";
  
  const dateObj = typeof date === "string" || typeof date === "number" 
    ? new Date(date) 
    : date;
  
  // Current date in the specified timezone
  const now = new Date();
  
  // Calculate the difference in milliseconds
  const diffMs = now.getTime() - dateObj.getTime();
  
  // Convert to seconds, minutes, hours, days
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHours = Math.floor(diffMin / 60);
  const diffDays = Math.floor(diffHours / 24);
  
  // Format based on the difference
  if (diffDays > 30) {
    // If more than a month, just show the date
    return formatDateInTimezone(dateObj, timezone, locale);
  } else if (diffDays > 0) {
    return locale.startsWith("es") 
      ? `hace ${diffDays} ${diffDays === 1 ? 'día' : 'días'}`
      : `${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`;
  } else if (diffHours > 0) {
    return locale.startsWith("es")
      ? `hace ${diffHours} ${diffHours === 1 ? 'hora' : 'horas'}`
      : `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`;
  } else if (diffMin > 0) {
    return locale.startsWith("es")
      ? `hace ${diffMin} ${diffMin === 1 ? 'minuto' : 'minutos'}`
      : `${diffMin} ${diffMin === 1 ? 'minute' : 'minutes'} ago`;
  } else {
    return locale.startsWith("es") ? "justo ahora" : "just now";
  }
};

// Format date in timezone according to locale with custom options
export const formatDateTime = (
  date: Date | string | number,
  timezone: string = 'UTC',
  locale: string = 'en-US',
  options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  }
): string => {
  const dateObj = new Date(date);
  
  try {
    return new Intl.DateTimeFormat(locale, {
      ...options,
      timeZone: timezone
    }).format(dateObj);
  } catch (error) {
    console.error('Error formatting date:', error);
    // Fallback to default format in case of error
    return dateObj.toLocaleString(locale);
  }
};
