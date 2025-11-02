import React from 'react';
import { useTimeStore } from '../hooks/useTimeStore';
import { TimeBlock } from './TimeBlock';
import { AnimatePresence, motion } from 'framer-motion';
import { Clock } from 'lucide-react';

export const TimeBlockList: React.FC = () => {
  const { entriesForCurrentDate } = useTimeStore();

  if (entriesForCurrentDate.length === 0) {
    return (
      <div className="text-center py-16 px-6 bg-surface-light dark:bg-surface-dark rounded-lg mt-6 border border-border-light dark:border-border-dark animate-fade-in">
        <Clock size={48} className="mx-auto text-text-secondary-light dark:text-text-secondary-dark" />
        <h3 className="mt-4 text-xl font-semibold text-text-light dark:text-text-dark">No entries for this day</h3>
        <p className="mt-2 text-text-secondary-light dark:text-text-secondary-dark">Click the '+' button to add your first time block.</p>
      </div>
    );
  }

  return (
    <div className="mt-6 space-y-4">
      <AnimatePresence>
        {entriesForCurrentDate.map((entry, index) => (
          <motion.div
            key={entry.id}
            layout
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.98 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
          >
            <TimeBlock entry={entry} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
