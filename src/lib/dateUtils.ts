import { DateTime } from 'luxon';

export const formatIsoDate = (
  dateString: string,
  format = 'dd.MM.yyyy HH:mm'
): string => {
  if (!dateString) return '';
  return DateTime.fromISO(dateString, {
    zone: 'UTC',
  }).toFormat(format);
};

export const getCurrentTimestamp = (): string => DateTime.utc().toISO();
