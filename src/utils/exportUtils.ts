import { TimeEntry } from '../types';
import { format, parseISO, eachDayOfInterval, compareAsc } from 'date-fns';
import { getTotalDurationForDate } from './timeUtils';

const formatEntryForTxt = (entry: TimeEntry): string => {
  const paddedTitle = entry.title.padEnd(40, ' ');
  return `${entry.startTime} - ${entry.endTime}    ${entry.title}`;
};

export const exportToTxt = (startDateStr: string, endDateStr: string, allEntries: TimeEntry[]) => {
  let startDate = parseISO(startDateStr);
  let endDate = parseISO(endDateStr);

  // Defensively swap dates if start is after end to prevent errors
  if (compareAsc(startDate, endDate) > 0) {
    [startDate, endDate] = [endDate, startDate];
  }

  const dateRange = eachDayOfInterval({ start: startDate, end: endDate });
  let fileContent = '';
  let overallTotalMinutes = 0;

  dateRange.forEach((date) => {
    const dateISO = format(date, 'yyyy-MM-dd');
    const entriesForDay = allEntries
      .filter(e => e.date === dateISO)
      .sort((a, b) => a.startTime.localeCompare(b.startTime));

    if (entriesForDay.length > 0) {
      if (fileContent.length > 0) {
        fileContent += '\n\n';
      }
      fileContent += `Date: ${dateISO}\n\n`;
      entriesForDay.forEach(entry => {
        fileContent += `${formatEntryForTxt(entry)}\n`;
      });

      const { totalDuration } = getTotalDurationForDate(date, allEntries);
      const dayTotalMinutes = (totalDuration.hours || 0) * 60 + (totalDuration.minutes || 0);
      overallTotalMinutes += dayTotalMinutes;
      
      fileContent += `\nTotal tracked: ${totalDuration.hours || 0} hours ${totalDuration.minutes || 0} minutes`;
    }
  });

  // Add overall total for multi-day ranges
  if (compareAsc(startDate, endDate) !== 0 && overallTotalMinutes > 0) {
    const overallHours = Math.floor(overallTotalMinutes / 60);
    const overallMinutes = overallTotalMinutes % 60;
    fileContent += `\n\n\nOverall Total: ${overallHours} hours ${overallMinutes} minutes`;
  }

  // If no content was generated, alert the user and stop.
  if (!fileContent.trim()) {
    alert('No entries found in the selected date range to export.');
    return;
  }

  const blob = new Blob([fileContent], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  
  const finalStartDateStr = format(startDate, 'yyyy-MM-dd');
  const finalEndDateStr = format(endDate, 'yyyy-MM-dd');

  const fileName = finalStartDateStr === finalEndDateStr
    ? `tracker-${finalStartDateStr}.txt`
    : `tracker-${finalStartDateStr}_to_${finalEndDateStr}.txt`;
  
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
