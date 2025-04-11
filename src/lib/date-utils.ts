export const formatDateTime = (
  date: Date | string | number,
  timezone: string = 'UTC',
  locale: string = 'en-US',
  options: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  }
): string => {
  const dateObj = new Date(date);
  
  try {
    const formatter = new Intl.DateTimeFormat(locale, {
      ...options,
      timeZone: timezone
    });

    return formatter.formatToParts(dateObj)
      .map(part => {
        switch (part.type) {
          case 'day': return part.value.padStart(2, '0');
          case 'month': return part.value.padStart(2, '0');
          case 'year': return part.value;
          case 'hour': return part.value.padStart(2, '0');
          case 'minute': return part.value.padStart(2, '0');
          default: return part.value;
        }
      })
      .filter(value => value !== ',')
      .join('/');
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateObj.toLocaleString(locale);
  }
};

// Alias for formatDateTime to maintain backward compatibility
export const formatDateInTimezone = formatDateTime;

/**
 * Formats the time difference between a date and now in a human-readable format
 * @param date The date to calculate the time difference from
 * @param locale The locale to use for formatting
 * @param timezone The timezone to use for calculations
 * @returns A human-readable string representing the time difference
 */
export const formatTimeDifference = (
  date: Date | string | number,
  locale: string = 'en-US',
  timezone: string = 'UTC'
): string => {
  const dateObj = new Date(date);
  const now = new Date();
  
  // Calculate time difference in milliseconds
  const diffMs = now.getTime() - dateObj.getTime();
  
  // Convert to seconds
  const diffSec = Math.floor(diffMs / 1000);
  
  // Less than a minute
  if (diffSec < 60) {
    return locale.startsWith('es') ? 'Hace unos segundos' : 'A few seconds ago';
  }
  
  // Less than an hour
  if (diffSec < 3600) {
    const minutes = Math.floor(diffSec / 60);
    return locale.startsWith('es') 
      ? `Hace ${minutes} ${minutes === 1 ? 'minuto' : 'minutos'}`
      : `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
  }
  
  // Less than a day
  if (diffSec < 86400) {
    const hours = Math.floor(diffSec / 3600);
    return locale.startsWith('es') 
      ? `Hace ${hours} ${hours === 1 ? 'hora' : 'horas'}`
      : `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
  }
  
  // Less than a week
  if (diffSec < 604800) {
    const days = Math.floor(diffSec / 86400);
    return locale.startsWith('es') 
      ? `Hace ${days} ${days === 1 ? 'día' : 'días'}`
      : `${days} ${days === 1 ? 'day' : 'days'} ago`;
  }
  
  // Otherwise, return a formatted date
  return formatDateTime(dateObj, timezone, locale, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};
