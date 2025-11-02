import React from 'react';
import { TimeEntry } from '../types';
import { useTimeStore } from '../hooks/useTimeStore';
import { formatDuration, intervalToDuration } from 'date-fns';
import { Edit, Trash2, MoreVertical, StickyNote } from 'lucide-react';
import { getDuration } from '../utils/timeUtils';

interface TimeBlockProps {
  entry: TimeEntry;
}

export const TimeBlock: React.FC<TimeBlockProps> = ({ entry }) => {
  const { openEditModal, deleteEntry } = useTimeStore();
  const { duration, durationString } = getDuration(entry.date, entry.startTime, entry.endTime);

  return (
    <div className="bg-surface-light dark:bg-surface-dark rounded-lg p-4 border border-border-light dark:border-border-dark flex items-center justify-between gap-4 transition-shadow hover:shadow-md">
      <div className="flex items-center gap-4 flex-1">
        <div className="text-center w-20 flex-shrink-0">
          <p className="font-mono text-lg font-semibold text-primary">{entry.startTime}</p>
          <p className="font-mono text-sm text-text-secondary-light dark:text-text-secondary-dark">to</p>
          <p className="font-mono text-lg font-semibold text-primary">{entry.endTime}</p>
        </div>
        <div className="border-l border-border-light dark:border-border-dark pl-4 flex-1">
          <h3 className="font-semibold text-lg text-text-light dark:text-text-dark">{entry.title}</h3>
          {entry.notes && (
            <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark mt-1 flex items-start gap-1.5">
              <StickyNote size={14} className="mt-0.5 flex-shrink-0" />
              <span>{entry.notes}</span>
            </p>
          )}
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="font-semibold text-text-light dark:text-text-dark">{durationString}</p>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={() => openEditModal(entry)} className="p-2 rounded-full hover:bg-background-light dark:hover:bg-background-dark transition-colors" aria-label="Edit entry">
            <Edit size={18} className="text-text-secondary-light dark:text-text-secondary-dark" />
          </button>
          <button onClick={() => {
            if (window.confirm('Are you sure you want to delete this entry?')) {
              deleteEntry(entry.id);
            }
          }} className="p-2 rounded-full hover:bg-background-light dark:hover:bg-background-dark transition-colors" aria-label="Delete entry">
            <Trash2 size={18} className="text-error" />
          </button>
        </div>
      </div>
    </div>
  );
};
