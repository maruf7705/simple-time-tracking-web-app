import React from 'react';
import { useTimeStore } from '../hooks/useTimeStore';
import { format, formatDuration, intervalToDuration } from 'date-fns';
import { getTotalDurationForDate } from '../utils/timeUtils';

export const DaySummary: React.FC = () => {
  const { currentDate, entries } = useTimeStore();
  const { totalDuration, totalDurationString } = getTotalDurationForDate(currentDate, entries);

  return (
    <div className="bg-surface-light dark:bg-surface-dark rounded-lg p-6 border border-border-light dark:border-border-dark">
      <div className="flex justify-between items-baseline">
        <div>
          <h2 className="text-2xl font-bold text-text-light dark:text-text-dark">
            {format(currentDate, 'EEEE, MMMM d')}
          </h2>
          <p className="text-text-secondary-light dark:text-text-secondary-dark">
            {format(currentDate, 'yyyy')}
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">Total Tracked</p>
          <p className="text-3xl font-bold text-primary">{totalDurationString}</p>
        </div>
      </div>
    </div>
  );
};
