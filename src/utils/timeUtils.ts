import { TimeEntry } from '../types';
import {
  parse,
  differenceInMinutes,
  format,
  isSameDay,
  parseISO,
  intervalToDuration,
  formatDuration,
} from 'date-fns';

// Helper to parse a time string (HH:mm) into a Date object for a given date
export const parseTimeString = (timeString: string, date: Date = new Date()): Date => {
  const [hours, minutes] = timeString.split(':').map(Number);
  const newDate = new Date(date);
  newDate.setHours(hours, minutes, 0, 0);
  return newDate;
};

// Check if end time is before start time
export const isEndTimeBeforeStartTime = (startTime: string, endTime: string): boolean => {
  // Handle overnight case where start and end time are the same (24h block)
  if (startTime === endTime) return false;
  return endTime < startTime;
};

// Check for time overlaps
export const isTimeOverlap = (
  startTime: string,
  endTime: string,
  entries: TimeEntry[],
  excludeId?: string
): boolean => {
  const newStart = parseTimeString(startTime);
  const newEnd = parseTimeString(endTime);

  // If end is before start, it's an overnight entry
  if (newEnd < newStart) {
    newEnd.setDate(newEnd.getDate() + 1);
  }

  for (const entry of entries) {
    if (entry.id === excludeId) continue;

    const existingStart = parseTimeString(entry.startTime);
    const existingEnd = parseTimeString(entry.endTime);

    if (existingEnd < existingStart) {
      existingEnd.setDate(existingEnd.getDate() + 1);
    }

    // Overlap condition: (StartA < EndB) and (EndA > StartB)
    if (newStart < existingEnd && newEnd > existingStart) {
      return true;
    }
  }

  return false;
};

// Calculate duration of a single entry
export const getDuration = (date: string, startTime: string, endTime: string) => {
  const startDate = parse(`${date} ${startTime}`, 'yyyy-MM-dd HH:mm', new Date());
  let endDate = parse(`${date} ${endTime}`, 'yyyy-MM-dd HH:mm', new Date());

  // Handle overnight spans
  if (endDate <= startDate) {
    endDate.setDate(endDate.getDate() + 1);
  }

  const duration = intervalToDuration({ start: startDate, end: endDate });
  const durationString = formatDuration(duration, { format: ['hours', 'minutes'] }) || '0 minutes';

  return { duration, durationString };
};

// Calculate total duration for a given date
export const getTotalDurationForDate = (date: Date, entries: TimeEntry[]) => {
  const entriesForDate = entries.filter(entry => isSameDay(parseISO(entry.date), date));
  
  const totalMinutes = entriesForDate.reduce((acc, entry) => {
    const startDate = parseTimeString(entry.startTime);
    let endDate = parseTimeString(entry.endTime);

    if (endDate <= startDate) {
      endDate.setDate(endDate.getDate() + 1);
    }
    
    return acc + differenceInMinutes(endDate, startDate);
  }, 0);

  const totalDuration = {
    hours: Math.floor(totalMinutes / 60),
    minutes: totalMinutes % 60,
  };

  const totalDurationString = formatDuration(totalDuration, { format: ['hours', 'minutes'] }) || '0 minutes';

  return { totalDuration, totalDurationString };
};
