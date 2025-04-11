
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
