export const formatDate = (date: string | Date): string => {
  if (!date) return '';
  
  try {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch (error) {
    console.error('Error formatting date:', error);
    return '';
  }
};

export const formatDateTime = (date: string | Date): string => {
  if (!date) return '';
  
  try {
    return new Date(date).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    });
  } catch (error) {
    console.error('Error formatting date time:', error);
    return '';
  }
};

export const formatTime = (time: string): string => {
  if (!time) return '';
  
  try {
    return new Date(`1970-01-01T${time}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  } catch (error) {
    console.error('Error formatting time:', error);
    return '';
  }
};

export const addDays = (date: Date, days: number): Date => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};