import { DateTime } from 'luxon';

export const formatIsoDate = (
  dateString: string,
  format = 'dd.MM.yyyy HH:mm'
) => {
  if (!dateString) return '';
  return DateTime.fromISO(dateString, {
    zone: 'UTC',
  }).toFormat(format);
};
